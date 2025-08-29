export type BookStatus = 'tbr' | 'reading' | 'completed' | 'dnf' | 'archived'

// Import from database types for consistency
import type { Book as DatabaseBook, Shelf as DatabaseShelf, BookPosition as DatabaseBookPosition } from './database.types'

// Use database types directly to ensure consistency
export type Book = DatabaseBook
export type Shelf = DatabaseShelf
export type BookPosition = DatabaseBookPosition

export interface BookSearchResult {
  googleBooksId: string
  isbn?: string | undefined
  title: string
  subtitle?: string | undefined
  author: string
  authors: string[]
  publisher?: string | undefined
  publishedDate?: Date | undefined
  pageCount?: number | undefined
  language?: string | undefined
  description?: string | undefined
  categories?: string[] | undefined
  coverUrl?: string | undefined
  thumbnailUrl?: string | undefined
}



// Import UserPreferences from database types
export type UserPreferences = import('./database.types').UserPreferences