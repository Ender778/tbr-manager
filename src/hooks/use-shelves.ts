import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Shelf } from '@/types/book'
import { useBookStore } from '@/stores/book-store'

// Query keys for cache management
export const shelfKeys = {
  all: ['shelves'] as const,
  lists: () => [...shelfKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...shelfKeys.lists(), filters] as const,
  details: () => [...shelfKeys.all, 'detail'] as const,
  detail: (id: string) => [...shelfKeys.details(), id] as const,
}

// Fetch all shelves
async function fetchShelves(): Promise<Shelf[]> {
  const response = await fetch('/api/shelves')
  if (!response.ok) {
    throw new Error('Failed to fetch shelves')
  }
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch shelves')
  }
  return data.data
}

// Hook to fetch all shelves
export function useShelves() {
  return useQuery({
    queryKey: shelfKeys.lists(),
    queryFn: fetchShelves,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single shelf
export function useShelf(shelfId: string) {
  return useQuery({
    queryKey: shelfKeys.detail(shelfId),
    queryFn: async () => {
      const response = await fetch(`/api/shelves/${shelfId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch shelf')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch shelf')
      }
      return data.data as Shelf
    },
    enabled: !!shelfId,
  })
}

// Mutation hooks that work with Zustand store
export function useCreateShelf() {
  const queryClient = useQueryClient()
  const createShelf = useBookStore((state) => state.createShelf)

  return useMutation({
    mutationFn: async (shelfData: Omit<Shelf, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      await createShelf(shelfData)
    },
    onSuccess: () => {
      // Invalidate and refetch shelves
      queryClient.invalidateQueries({ queryKey: shelfKeys.lists() })
    },
  })
}

export function useUpdateShelf() {
  const queryClient = useQueryClient()
  const updateShelf = useBookStore((state) => state.updateShelf)

  return useMutation({
    mutationFn: async ({ shelfId, updates }: { shelfId: string; updates: Partial<Shelf> }) => {
      await updateShelf(shelfId, updates)
    },
    onSuccess: (_, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: shelfKeys.lists() })
      queryClient.invalidateQueries({ queryKey: shelfKeys.detail(variables.shelfId) })
    },
  })
}

export function useDeleteShelf() {
  const queryClient = useQueryClient()
  const deleteShelf = useBookStore((state) => state.deleteShelf)

  return useMutation({
    mutationFn: async (shelfId: string) => {
      await deleteShelf(shelfId)
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: shelfKeys.lists() })
    },
  })
}

export function useReorderShelves() {
  const queryClient = useQueryClient()
  const reorderShelves = useBookStore((state) => state.reorderShelves)

  return useMutation({
    mutationFn: async (shelfIds: string[]) => {
      await reorderShelves(shelfIds)
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: shelfKeys.lists() })
    },
  })
}
