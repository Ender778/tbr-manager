import { BookSearchResult } from '@/types/book'

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes'

interface GoogleBooksVolumeInfo {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: Array<{
    type: string
    identifier: string
  }>
  pageCount?: number
  categories?: string[]
  language?: string
  imageLinks?: {
    smallThumbnail?: string
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
    extraLarge?: string
  }
}

interface GoogleBooksVolume {
  id: string
  volumeInfo: GoogleBooksVolumeInfo
}

interface GoogleBooksResponse {
  kind: string
  totalItems: number
  items?: GoogleBooksVolume[]
}

/**
 * Search for books using the Google Books API
 */
export async function searchBooks(query: string, maxResults: number = 10): Promise<BookSearchResult[]> {
  if (!query.trim()) {
    return []
  }

  try {
    const searchParams = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
      printType: 'books',
    })

    // Add API key if available
    if (process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) {
      searchParams.append('key', process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY)
    }

    const response = await fetch(`${GOOGLE_BOOKS_API_URL}?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status} ${response.statusText}`)
    }

    const data: GoogleBooksResponse = await response.json()

    if (!data.items) {
      return []
    }

    return data.items.map(transformGoogleBookToSearchResult)
  } catch (error) {
    console.error('Error searching books:', error)
    throw new Error('Failed to search books. Please try again.')
  }
}

/**
 * Get a specific book by Google Books ID
 */
export async function getBookById(googleBooksId: string): Promise<BookSearchResult | null> {
  try {
    const searchParams = new URLSearchParams()
    
    if (process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) {
      searchParams.append('key', process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY)
    }

    const response = await fetch(`${GOOGLE_BOOKS_API_URL}/${googleBooksId}?${searchParams}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Google Books API error: ${response.status} ${response.statusText}`)
    }

    const volume: GoogleBooksVolume = await response.json()
    return transformGoogleBookToSearchResult(volume)
  } catch (error) {
    console.error('Error fetching book:', error)
    throw new Error('Failed to fetch book details. Please try again.')
  }
}

/**
 * Transform Google Books API response to our BookSearchResult format
 */
function transformGoogleBookToSearchResult(volume: GoogleBooksVolume): BookSearchResult {
  const { volumeInfo } = volume
  
  // Extract ISBN (prefer ISBN-13, fall back to ISBN-10)
  const isbn13 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier
  const isbn10 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier
  const isbn = isbn13 || isbn10

  // Get the best available cover image
  const coverUrl = getBestCoverImage(volumeInfo.imageLinks)
  const thumbnailUrl = volumeInfo.imageLinks?.smallThumbnail || volumeInfo.imageLinks?.thumbnail

  // Parse publication date
  const publishedDate = volumeInfo.publishedDate ? parsePublicationDate(volumeInfo.publishedDate) : undefined

  return {
    googleBooksId: volume.id,
    isbn,
    title: volumeInfo.title || 'Unknown Title',
    subtitle: volumeInfo.subtitle,
    author: volumeInfo.authors?.[0] || 'Unknown Author',
    authors: volumeInfo.authors || [],
    publisher: volumeInfo.publisher,
    publishedDate,
    pageCount: volumeInfo.pageCount,
    language: volumeInfo.language || 'en',
    description: volumeInfo.description,
    categories: volumeInfo.categories || [],
    coverUrl: coverUrl ? convertToHttps(coverUrl) : undefined,
    thumbnailUrl: thumbnailUrl ? convertToHttps(thumbnailUrl) : undefined,
  }
}

/**
 * Get the best available cover image from Google Books image links
 */
function getBestCoverImage(imageLinks?: GoogleBooksVolumeInfo['imageLinks']): string | undefined {
  if (!imageLinks) return undefined

  // Prefer larger images, fall back to smaller ones
  return (
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail
  )
}

/**
 * Convert HTTP URLs to HTTPS for security
 */
function convertToHttps(url: string): string {
  return url.replace(/^http:/, 'https:')
}

/**
 * Parse Google Books publication date format
 * Can be YYYY, YYYY-MM, or YYYY-MM-DD
 */
function parsePublicationDate(dateString: string): Date | undefined {
  try {
    if (!dateString || typeof dateString !== 'string') {
      return undefined
    }

    // Clean the date string
    const cleanDate = dateString.trim()
    
    // Handle different date formats from Google Books
    if (/^\d{4}$/.test(cleanDate)) {
      // Just year: "2020"
      const year = parseInt(cleanDate)
      if (year < 1000 || year > 2100) return undefined
      const date = new Date(year, 0, 1) // Use Date constructor instead of string parsing
      return isNaN(date.getTime()) ? undefined : date
    } else if (/^\d{4}-\d{2}$/.test(cleanDate)) {
      // Year and month: "2020-03"
      const [yearStr, monthStr] = cleanDate.split('-')
      const year = parseInt(yearStr)
      const month = parseInt(monthStr) - 1 // Month is 0-indexed
      if (year < 1000 || year > 2100 || month < 0 || month > 11) return undefined
      const date = new Date(year, month, 1)
      return isNaN(date.getTime()) ? undefined : date
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      // Full date: "2020-03-15"
      const [yearStr, monthStr, dayStr] = cleanDate.split('-')
      const year = parseInt(yearStr)
      const month = parseInt(monthStr) - 1
      const day = parseInt(dayStr)
      if (year < 1000 || year > 2100 || month < 0 || month > 11 || day < 1 || day > 31) return undefined
      const date = new Date(year, month, day)
      return isNaN(date.getTime()) ? undefined : date
    } else {
      // Try parsing as-is for other formats
      const parsed = new Date(cleanDate)
      return isNaN(parsed.getTime()) ? undefined : parsed
    }
  } catch (error) {
    console.warn('Failed to parse publication date:', dateString, error)
    return undefined
  }
}

/**
 * Search for books with better error handling and caching support
 */
export async function searchBooksWithFallback(query: string, maxResults: number = 10): Promise<BookSearchResult[]> {
  try {
    return await searchBooks(query, maxResults)
  } catch (error) {
    console.warn('Primary search failed, attempting fallback search:', error)
    
    // Fallback: try a simpler search without special characters
    const simplifiedQuery = query.replace(/[^\w\s]/g, '').trim()
    if (simplifiedQuery && simplifiedQuery !== query) {
      try {
        return await searchBooks(simplifiedQuery, maxResults)
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError)
      }
    }
    
    throw error
  }
}