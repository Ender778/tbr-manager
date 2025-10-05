import { useMemo, useEffect } from 'react'
import { usePreferencesStore } from '@/stores/preferences-store'
import { Shelf } from '@/types/book'

/**
 * Hook to get shelves ordered according to user preferences
 * Falls back to database position if no custom order is set
 */
export function useOrderedShelves(shelves: Shelf[]): Shelf[] {
  const { shelfOrder, setShelfOrder, addShelfToOrder } = usePreferencesStore()

  // Initialize shelf order if empty or sync new shelves
  useEffect(() => {
    if (shelves.length === 0) return

    const shelfIds = shelves.map((s) => s.id)
    const currentOrder = shelfOrder.filter((id) => shelfIds.includes(id))

    // If no order set, initialize with database order
    if (shelfOrder.length === 0) {
      const initialOrder = [...shelves]
        .sort((a, b) => a.position - b.position)
        .map((s) => s.id)
      setShelfOrder(initialOrder)
      return
    }

    // Add any new shelves that aren't in the order yet
    const newShelfIds = shelfIds.filter((id) => !shelfOrder.includes(id))
    if (newShelfIds.length > 0) {
      // Add new shelves to the end, sorted by their database position
      const newShelves = shelves
        .filter((s) => newShelfIds.includes(s.id))
        .sort((a, b) => a.position - b.position)

      newShelves.forEach((shelf) => {
        addShelfToOrder(shelf.id)
      })
    }

    // Remove any shelf IDs that no longer exist
    if (currentOrder.length !== shelfOrder.length) {
      setShelfOrder(currentOrder)
    }
  }, [shelves, shelfOrder, setShelfOrder, addShelfToOrder])

  // Return shelves in the specified order
  const orderedShelves = useMemo(() => {
    if (shelfOrder.length === 0) {
      // Fall back to database position
      return [...shelves].sort((a, b) => a.position - b.position)
    }

    // Create a map for quick lookup
    const shelfMap = new Map(shelves.map((shelf) => [shelf.id, shelf]))

    // Return shelves in the preferred order
    return shelfOrder
      .map((id) => shelfMap.get(id))
      .filter((shelf): shelf is Shelf => shelf !== undefined)
  }, [shelves, shelfOrder])

  return orderedShelves
}

/**
 * Hook to reorder shelves with optimistic UI update
 * Syncs to database in the background
 */
export function useReorderShelves() {
  const { moveShelf } = usePreferencesStore()

  return {
    /**
     * Move a shelf from one position to another in the UI
     * This updates the local order immediately for instant feedback
     */
    reorderShelf: (fromIndex: number, toIndex: number) => {
      moveShelf(fromIndex, toIndex)
    },

    /**
     * Sync the current UI order to the database
     * Call this after drag-and-drop is complete
     */
    syncOrderToDatabase: async (shelfOrder: string[]) => {
      try {
        const response = await fetch('/api/shelves/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shelfIds: shelfOrder }),
        })

        if (!response.ok) {
          throw new Error('Failed to sync shelf order')
        }

        return { success: true }
      } catch (error) {
        console.error('Failed to sync shelf order to database:', error)
        return { success: false, error }
      }
    },
  }
}
