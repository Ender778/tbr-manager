import { useQuery } from '@tanstack/react-query'
import { useBookStore } from '@/stores/book-store'
import { bookKeys } from './use-books'
import { shelfKeys } from './use-shelves'
import { Book, Shelf, BookPosition } from '@/types/book'

interface DashboardData {
  books: Book[]
  shelves: Shelf[]
  bookPositions: BookPosition[]
}

// Fetch dashboard data (books and shelves together)
async function fetchDashboardData(): Promise<DashboardData> {
  const [booksResponse, shelvesResponse] = await Promise.all([
    fetch('/api/books'),
    fetch('/api/shelves'),
  ])

  if (!booksResponse.ok || !shelvesResponse.ok) {
    throw new Error('Failed to fetch dashboard data')
  }

  const booksData = await booksResponse.json()
  const shelvesData = await shelvesResponse.json()

  if (!booksData.success || !shelvesData.success) {
    throw new Error('Failed to fetch dashboard data')
  }

  // Extract book positions from shelf data
  const positions: BookPosition[] = []
  shelvesData.data.forEach((shelf: any) => {
    if (shelf.book_positions) {
      positions.push(
        ...shelf.book_positions.map((pos: any) => ({
          id: pos.id,
          book_id: pos.book_id || pos.books?.id,
          shelf_id: shelf.id,
          position: pos.position,
          user_id: pos.user_id,
          created_at: pos.created_at,
          updated_at: pos.updated_at,
          master_position: pos.master_position || null,
          year_completed: pos.year_completed || null,
        }))
      )
    }
  })

  return {
    books: booksData.data,
    shelves: shelvesData.data,
    bookPositions: positions,
  }
}

// Hook to fetch all dashboard data at once
export function useDashboardData() {
  const queryResult = useQuery({
    queryKey: [...bookKeys.all, ...shelfKeys.all, 'dashboard'] as const,
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Only refetch if data is stale, not on every mount
    // This prevents overwriting optimistic updates
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  return {
    ...queryResult,
    // Expose refetch for manual triggers after mutations
    refetchDashboard: queryResult.refetch,
  }
}

// Hook to get books organized by shelf
export function useBooksByShelf() {
  const getBooksByShelf = useBookStore((state) => state.getBooksByShelf)
  const shelves = useBookStore((state) => state.shelves)

  return shelves.reduce((acc, shelf) => {
    acc[shelf.id] = getBooksByShelf(shelf.id)
    return acc
  }, {} as Record<string, Book[]>)
}

// Hook to get book statistics
export function useBookStats() {
  const getBookStats = useBookStore((state) => state.getBookStats)
  return getBookStats()
}
