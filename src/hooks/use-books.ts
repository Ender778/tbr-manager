import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Book } from '@/types/book'
import { useBookStore } from '@/stores/book-store'

// Query keys for cache management
export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...bookKeys.lists(), filters] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
}

// Fetch all books
async function fetchBooks(): Promise<Book[]> {
  const response = await fetch('/api/books')
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch books')
  }
  return data.data
}

// Hook to fetch all books
export function useBooks() {
  return useQuery({
    queryKey: bookKeys.lists(),
    queryFn: fetchBooks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single book
export function useBook(bookId: string) {
  return useQuery({
    queryKey: bookKeys.detail(bookId),
    queryFn: async () => {
      const response = await fetch(`/api/books/${bookId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch book')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch book')
      }
      return data.data as Book
    },
    enabled: !!bookId,
  })
}

// Mutation hooks that work with Zustand store
export function useAddBook() {
  const queryClient = useQueryClient()
  const addBook = useBookStore((state) => state.addBook)

  return useMutation({
    mutationFn: async ({ bookData, shelfId }: { bookData: any; shelfId: string }) => {
      await addBook(bookData, shelfId)
    },
    onSuccess: () => {
      // Invalidate and refetch books
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  const updateBook = useBookStore((state) => state.updateBook)

  return useMutation({
    mutationFn: async ({ bookId, updates }: { bookId: string; updates: Partial<Book> }) => {
      await updateBook(bookId, updates)
    },
    onSuccess: (_, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(variables.bookId) })
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()
  const deleteBook = useBookStore((state) => state.deleteBook)

  return useMutation({
    mutationFn: async (bookId: string) => {
      await deleteBook(bookId)
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
  })
}

export function useMoveBook() {
  const queryClient = useQueryClient()
  const moveBook = useBookStore((state) => state.moveBook)

  return useMutation({
    mutationFn: async ({
      bookId,
      fromShelfId,
      toShelfId,
      position,
    }: {
      bookId: string
      fromShelfId: string
      toShelfId: string
      position: number
    }) => {
      await moveBook(bookId, fromShelfId, toShelfId, position)
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
  })
}
