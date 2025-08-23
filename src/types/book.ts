export type BookStatus = 'tbr' | 'reading' | 'completed' | 'dnf' | 'archived'

export interface Book {
  id: string
  isbn?: string
  title: string
  subtitle?: string
  author: string
  publisher?: string
  publishedDate?: string
  pageCount?: number
  language?: string
  coverUrl?: string
  coverThumbnailUrl?: string
  googleBooksId?: string
  openLibraryId?: string
  goodreadsId?: string
  status: BookStatus
  rating?: number
  personalNotes?: string
  dateAdded: string
  dateStarted?: string
  dateCompleted?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface BookSearchResult {
  id: string
  title: string
  subtitle?: string
  authors: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  pageCount?: number
  categories?: string[]
  imageLinks?: {
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
  }
  isbn10?: string
  isbn13?: string
  language?: string
  googleBooksId?: string
}

export interface Shelf {
  id: string
  name: string
  description?: string
  position: number
  color: string
  icon: string
  isDefault: boolean
  isArchived: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface BookPosition {
  id: string
  bookId: string
  shelfId: string
  position: number
  masterPosition?: number
  yearCompleted?: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  userId: string
  defaultView: 'cork_board' | 'list' | 'shelf' | 'timeline' | 'master'
  corkBoardColumns: number
  booksPerPage: number
  theme: 'light' | 'dark' | 'auto'
  showCovers: boolean
  showRatings: boolean
  autoFetchCovers: boolean
  createdAt: string
  updatedAt: string
}