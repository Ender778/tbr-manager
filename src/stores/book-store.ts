import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Book, Shelf, BookPosition, BookSearchResult } from '@/types/book'
import toast from 'react-hot-toast'

interface BookStore {
  // State
  books: Book[]
  shelves: Shelf[]
  bookPositions: BookPosition[]
  isLoading: boolean
  error: string | null
  
  // Book Actions
  addBook: (bookData: BookSearchResult, shelfId: string) => Promise<void>
  moveBook: (bookId: string, fromShelfId: string, toShelfId: string, position: number) => Promise<void>
  updateBook: (bookId: string, updates: Partial<Book>) => Promise<void>
  deleteBook: (bookId: string) => Promise<void>
  
  // Shelf Actions
  createShelf: (shelf: Omit<Shelf, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateShelf: (shelfId: string, updates: Partial<Shelf>) => Promise<void>
  deleteShelf: (shelfId: string) => Promise<void>
  reorderShelves: (shelfIds: string[]) => Promise<void>
  
  // Data Loading
  loadDashboardData: () => Promise<void>
  
  // Utility Actions
  clearError: () => void
  
  // Computed Getters
  getBooksByShelf: (shelfId: string) => Book[]
  getBookStats: () => { total: number; tbr: number; reading: number; completed: number }
  getTBRShelf: () => Shelf | undefined
}

export const useBookStore = create<BookStore>()(
  immer((set, get) => ({
    // Initial State
    books: [],
    shelves: [],
    bookPositions: [],
    isLoading: false,
    error: null,

    // Book Actions
    addBook: async (searchResult, shelfId) => {
      set(state => {
        state.isLoading = true
        state.error = null
      })

      // Generate temporary ID outside try block for proper scoping
      const tempId = crypto.randomUUID()
      
      // Get current user ID (this should be available from auth store)
      const userId = 'temp-user' // We'll set proper user ID from API response

      try {
        // Optimistic update
        const tempBook: Book = {
          id: tempId,
          title: searchResult.title,
          subtitle: searchResult.subtitle || null,
          author: searchResult.author,
          isbn: searchResult.isbn || null,
          publisher: searchResult.publisher || null,
          published_date: searchResult.publishedDate && searchResult.publishedDate instanceof Date && !isNaN(searchResult.publishedDate.getTime()) 
            ? searchResult.publishedDate.toISOString().split('T')[0]
            : null,
          page_count: searchResult.pageCount || null,
          language: searchResult.language || 'en',
          cover_url: searchResult.coverUrl || null,
          cover_thumbnail_url: searchResult.thumbnailUrl || null,
          google_books_id: searchResult.googleBooksId || null,
          open_library_id: null,
          status: 'tbr',
          rating: null,
          personal_notes: null,
          date_added: new Date().toISOString(),
          date_started: null,
          date_completed: null,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const tempPosition: BookPosition = {
          id: crypto.randomUUID(),
          book_id: tempId,
          shelf_id: shelfId,
          position: get().bookPositions.filter(pos => pos.shelf_id === shelfId).length,
          master_position: null,
          year_completed: null,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        set(state => {
          state.books.push(tempBook)
          state.bookPositions.push(tempPosition)
        })

        // API Call
        const bookData = {
          title: searchResult.title,
          subtitle: searchResult.subtitle,
          author: searchResult.author,
          isbn: searchResult.isbn,
          publisher: searchResult.publisher,
          published_date: searchResult.publishedDate && searchResult.publishedDate instanceof Date && !isNaN(searchResult.publishedDate.getTime()) 
            ? searchResult.publishedDate.toISOString() 
            : undefined,
          page_count: searchResult.pageCount && searchResult.pageCount > 0 ? searchResult.pageCount : null,
          language: searchResult.language,
          cover_url: searchResult.coverUrl,
          cover_thumbnail_url: searchResult.thumbnailUrl,
          google_books_id: searchResult.googleBooksId,
          status: 'tbr' as const,
          shelfId: shelfId,
        }

        const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        })

        if (!response.ok) {
          throw new Error('Failed to add book')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to add book')
        }

        // Update with real data from server
        set(state => {
          const bookIndex = state.books.findIndex(b => b.id === tempId)
          const positionIndex = state.bookPositions.findIndex(p => p.book_id === tempId)
          
          if (bookIndex !== -1 && result.data.book) {
            // Ensure the book has all required properties
            state.books[bookIndex] = {
              ...result.data.book,
              status: result.data.book.status || 'tbr' // Ensure status is set
            }
          }
          
          if (positionIndex !== -1 && result.data.position) {
            state.bookPositions[positionIndex] = result.data.position
          }
        })

        toast.success(`Added "${searchResult.title}" to your library!`)
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          // Remove the temporary book and position
          state.books = state.books.filter(b => b && b.id !== tempId)
          state.bookPositions = state.bookPositions.filter(p => p && p.book_id !== tempId)
          state.error = error instanceof Error ? error.message : 'Failed to add book'
        })

        console.error('Error adding book:', error)
        toast.error('Failed to add book. Please try again.')
      } finally {
        set(state => {
          state.isLoading = false
        })
      }
    },

    moveBook: async (bookId, fromShelfId, toShelfId, position) => {
      const originalPositions = get().bookPositions
      const originalBooks = get().books

      try {
        // Optimistic update - update both position and book status
        set(state => {
          const positionIndex = state.bookPositions.findIndex(p => p.book_id === bookId)
          const bookIndex = state.books.findIndex(b => b.id === bookId)
          
          if (positionIndex !== -1) {
            state.bookPositions[positionIndex].shelf_id = toShelfId
            state.bookPositions[positionIndex].position = position
            state.bookPositions[positionIndex].updated_at = new Date().toISOString()
          }

          // Update book status based on target shelf
          if (bookIndex !== -1) {
            const targetShelf = state.shelves.find(s => s.id === toShelfId)
            if (targetShelf) {
              // Map shelf names to book statuses
              const shelfToStatus: Record<string, string> = {
                'Currently Reading': 'reading', 
                'To Be Read': 'tbr',
                'Completed': 'completed',
                'Did Not Finish': 'dnf',
                'Archived': 'archived'
              }
              
              const newStatus = shelfToStatus[targetShelf.name] || state.books[bookIndex].status
              state.books[bookIndex].status = newStatus as any
              state.books[bookIndex].updated_at = new Date().toISOString()
              
              // Set completion date if moving to completed
              if (newStatus === 'completed' && !state.books[bookIndex].date_completed) {
                state.books[bookIndex].date_completed = new Date().toISOString().split('T')[0]
              }
              // Clear completion date if moving away from completed
              else if (newStatus !== 'completed') {
                state.books[bookIndex].date_completed = null
              }
            }
          }
        })

        // API Call (TODO: implement when API endpoint is ready)
        const response = await fetch('/api/books/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId, fromShelfId, toShelfId, position }),
        })

        if (!response.ok) {
          throw new Error('Failed to move book')
        }

        toast.success('Book moved successfully!')
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          state.bookPositions = originalPositions
          state.books = originalBooks
          state.error = error instanceof Error ? error.message : 'Failed to move book'
        })

        console.error('Error moving book:', error)
        toast.error('Failed to move book. Please try again.')
      }
    },

    updateBook: async (bookId, updates) => {
      const originalBooks = get().books

      try {
        // Optimistic update
        set(state => {
          const bookIndex = state.books.findIndex(b => b.id === bookId)
          if (bookIndex !== -1) {
            state.books[bookIndex] = { ...state.books[bookIndex], ...updates, updated_at: new Date().toISOString() }
          }
        })

        // API Call
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          throw new Error('Failed to update book')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to update book')
        }

        // Update with server response
        set(state => {
          const bookIndex = state.books.findIndex(b => b.id === bookId)
          if (bookIndex !== -1) {
            state.books[bookIndex] = result.data
          }
        })

        toast.success('Book updated successfully!')
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          state.books = originalBooks
          state.error = error instanceof Error ? error.message : 'Failed to update book'
        })

        console.error('Error updating book:', error)
        toast.error('Failed to update book. Please try again.')
      }
    },

    deleteBook: async (bookId) => {
      const originalBooks = get().books
      const originalPositions = get().bookPositions

      try {
        // Optimistic update
        set(state => {
          state.books = state.books.filter(b => b.id !== bookId)
          state.bookPositions = state.bookPositions.filter(p => p.book_id !== bookId)
        })

        // API Call
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete book')
        }

        toast.success('Book deleted successfully!')
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          state.books = originalBooks
          state.bookPositions = originalPositions
          state.error = error instanceof Error ? error.message : 'Failed to delete book'
        })

        console.error('Error deleting book:', error)
        toast.error('Failed to delete book. Please try again.')
      }
    },

    // Shelf Actions
    createShelf: async (shelfData) => {
      set(state => {
        state.isLoading = true
        state.error = null
      })

      // Generate temporary ID outside try block for proper scoping
      const tempId = crypto.randomUUID()

      try {
        // Optimistic update
        const tempShelf: Shelf = {
          id: tempId,
          ...shelfData,
          position: get().shelves.length,
          is_archived: false,
          user_id: '', // Will be set from auth
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        set(state => {
          state.shelves.push(tempShelf)
        })

        // API Call
        const response = await fetch('/api/shelves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shelfData),
        })

        if (!response.ok) {
          throw new Error('Failed to create shelf')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to create shelf')
        }

        // Update with real data
        set(state => {
          const shelfIndex = state.shelves.findIndex(s => s.id === tempId)
          if (shelfIndex !== -1) {
            state.shelves[shelfIndex] = result.data
          }
        })

        toast.success(`Created shelf "${shelfData.name}"!`)
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          state.shelves = state.shelves.filter(s => s.id !== tempId)
          state.error = error instanceof Error ? error.message : 'Failed to create shelf'
        })

        console.error('Error creating shelf:', error)
        toast.error('Failed to create shelf. Please try again.')
      } finally {
        set(state => {
          state.isLoading = false
        })
      }
    },

    updateShelf: async (shelfId, updates) => {
      const originalShelves = get().shelves

      try {
        // Optimistic update
        set(state => {
          const shelfIndex = state.shelves.findIndex(s => s.id === shelfId)
          if (shelfIndex !== -1) {
            state.shelves[shelfIndex] = { ...state.shelves[shelfIndex], ...updates, updated_at: new Date().toISOString() }
          }
        })

        // API Call
        const response = await fetch(`/api/shelves/${shelfId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          throw new Error('Failed to update shelf')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to update shelf')
        }

        toast.success('Shelf updated successfully!')
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          state.shelves = originalShelves
          state.error = error instanceof Error ? error.message : 'Failed to update shelf'
        })

        console.error('Error updating shelf:', error)
        toast.error('Failed to update shelf. Please try again.')
      }
    },

    deleteShelf: async (shelfId) => {
      const originalShelves = get().shelves
      const originalPositions = get().bookPositions

      try {
        // Optimistic update
        set(state => {
          state.shelves = state.shelves.filter(s => s.id !== shelfId)
          state.bookPositions = state.bookPositions.filter(p => p.shelf_id !== shelfId)
        })

        // API Call
        const response = await fetch(`/api/shelves/${shelfId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete shelf')
        }

        toast.success('Shelf deleted successfully!')
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          state.shelves = originalShelves
          state.bookPositions = originalPositions
          state.error = error instanceof Error ? error.message : 'Failed to delete shelf'
        })

        console.error('Error deleting shelf:', error)
        toast.error('Failed to delete shelf. Please try again.')
      }
    },

    reorderShelves: async (shelfIds) => {
      const originalShelves = get().shelves

      try {
        // Optimistic update
        set(state => {
          const reorderedShelves = shelfIds.map((id, index) => {
            const shelf = state.shelves.find(s => s.id === id)
            return shelf ? { ...shelf, position: index } : null
          }).filter(Boolean) as Shelf[]

          state.shelves = reorderedShelves
        })

        // API Call
        const response = await fetch('/api/shelves/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shelfIds }),
        })

        if (!response.ok) {
          throw new Error('Failed to reorder shelves')
        }

        toast.success('Shelves reordered successfully!')
      } catch (error) {
        // Rollback optimistic update
        set(state => {
          state.shelves = originalShelves
          state.error = error instanceof Error ? error.message : 'Failed to reorder shelves'
        })

        console.error('Error reordering shelves:', error)
        toast.error('Failed to reorder shelves. Please try again.')
      }
    },

    // Data Loading
    loadDashboardData: async () => {
      set(state => {
        state.isLoading = true
        state.error = null
      })

      try {
        const [shelvesResponse, booksResponse] = await Promise.all([
          fetch('/api/shelves'),
          fetch('/api/books')
        ])

        if (!shelvesResponse.ok || !booksResponse.ok) {
          throw new Error('Failed to load dashboard data')
        }

        const shelvesData = await shelvesResponse.json()
        const booksData = await booksResponse.json()

        set(state => {
          if (shelvesData.success) {
            state.shelves = shelvesData.data

            // Extract book positions from shelf data
            const positions: BookPosition[] = []
            shelvesData.data.forEach((shelf: any) => {
              if (shelf.book_positions) {
                positions.push(...shelf.book_positions.map((pos: any) => ({
                  id: pos.id,
                  book_id: pos.book_id || pos.books?.id,
                  shelf_id: shelf.id,
                  position: pos.position,
                  user_id: pos.user_id,
                  created_at: pos.created_at,
                  updated_at: pos.updated_at,
                  master_position: pos.master_position || null,
                  year_completed: pos.year_completed || null,
                })))
              }
            })
            state.bookPositions = positions
          }

          if (booksData.success) {
            state.books = booksData.data
          }
        })
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Failed to load dashboard data'
        })

        console.error('Error loading dashboard data:', error)
        toast.error('Failed to load your books. Please refresh the page.')
      } finally {
        set(state => {
          state.isLoading = false
        })
      }
    },

    // Utility Actions
    clearError: () => set(state => {
      state.error = null
    }),

    // Computed Getters
    getBooksByShelf: (shelfId) => {
      const { books, bookPositions } = get()
      const validPositions = bookPositions.filter(pos => pos && pos.shelf_id === shelfId)
      const shelfBookIds = validPositions
        .sort((a, b) => a.position - b.position)
        .map(pos => pos.book_id)
      
      const validBooks = books.filter(book => book && book.id)
      return shelfBookIds
        .map(id => validBooks.find(book => book.id === id))
        .filter(Boolean) as Book[]
    },

    getBookStats: () => {
      const { books } = get()
      // Filter out any undefined or invalid books
      const validBooks = books.filter(book => book && book.status)
      return {
        total: validBooks.length,
        tbr: validBooks.filter(book => book.status === 'tbr').length,
        reading: validBooks.filter(book => book.status === 'reading').length,
        completed: validBooks.filter(book => book.status === 'completed').length,
      }
    },

    getTBRShelf: () => {
      const { shelves } = get()
      return shelves.find(shelf => shelf.name === 'To Be Read' && shelf.is_default)
    },
  }))
)