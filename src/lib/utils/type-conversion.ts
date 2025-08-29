/**
 * Utility functions for handling type conversions between database schema (snake_case)
 * and frontend usage (camelCase when needed)
 */

import type { Book, Shelf, BookPosition } from '@/types/book'

/**
 * Creates a book display object that handles field name consistency
 * This ensures we always use the correct database field names
 */
export function createBookDisplayData(book: Book) {
  return {
    ...book,
    // Provide getter methods for common camelCase usage
    get personalNotes() { return book.personal_notes },
    get dateCompleted() { return book.date_completed },
    get dateStarted() { return book.date_started },
    get dateAdded() { return book.date_added },
    get coverUrl() { return book.cover_url },
    get coverThumbnailUrl() { return book.cover_thumbnail_url },
    get googleBooksId() { return book.google_books_id },
    get openLibraryId() { return book.open_library_id },
    get pageCount() { return book.page_count },
    get publishedDate() { return book.published_date },
    get userId() { return book.user_id },
    get createdAt() { return book.created_at },
    get updatedAt() { return book.updated_at }
  }
}

/**
 * Creates a shelf display object that handles field name consistency
 */
export function createShelfDisplayData(shelf: Shelf) {
  return {
    ...shelf,
    // Provide getter methods for common camelCase usage
    get isDefault() { return shelf.is_default },
    get isArchived() { return shelf.is_archived },
    get userId() { return shelf.user_id },
    get createdAt() { return shelf.created_at },
    get updatedAt() { return shelf.updated_at }
  }
}

/**
 * Creates a book position display object that handles field name consistency
 */
export function createBookPositionDisplayData(position: BookPosition) {
  return {
    ...position,
    // Provide getter methods for common camelCase usage
    get bookId() { return position.book_id },
    get shelfId() { return position.shelf_id },
    get masterPosition() { return position.master_position },
    get yearCompleted() { return position.year_completed },
    get userId() { return position.user_id },
    get createdAt() { return position.created_at },
    get updatedAt() { return position.updated_at }
  }
}

/**
 * Type-safe function to ensure we're using correct database field names
 * when creating book data for API calls
 */
export function createBookInsertData(bookData: {
  title: string
  subtitle?: string
  author: string
  isbn?: string
  publisher?: string
  published_date?: string  // Note: snake_case for database
  page_count?: number      // Note: snake_case for database
  language?: string
  cover_url?: string       // Note: snake_case for database
  cover_thumbnail_url?: string  // Note: snake_case for database
  google_books_id?: string      // Note: snake_case for database
  status?: 'tbr' | 'reading' | 'completed' | 'dnf' | 'archived'
}) {
  return {
    title: bookData.title,
    subtitle: bookData.subtitle,
    author: bookData.author,
    isbn: bookData.isbn,
    publisher: bookData.publisher,
    published_date: bookData.published_date,
    page_count: bookData.page_count,
    language: bookData.language || 'en',
    cover_url: bookData.cover_url,
    cover_thumbnail_url: bookData.cover_thumbnail_url,
    google_books_id: bookData.google_books_id,
    status: bookData.status || 'tbr' as const,
    // These will be set by the database
    date_added: new Date().toISOString()
  }
}