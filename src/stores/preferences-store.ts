import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesStore {
  // Shelf ordering - array of shelf IDs in display order
  shelfOrder: string[]

  // Cork board preferences
  corkBoardColumns: number
  defaultView: 'cork_board' | 'list' | 'shelf' | 'timeline'
  theme: 'light' | 'dark'

  // Actions
  setShelfOrder: (shelfIds: string[]) => void
  moveShelf: (fromIndex: number, toIndex: number) => void
  addShelfToOrder: (shelfId: string, position?: number) => void
  removeShelfFromOrder: (shelfId: string) => void
  setCorkBoardColumns: (columns: number) => void
  setDefaultView: (view: 'cork_board' | 'list' | 'shelf' | 'timeline') => void
  setTheme: (theme: 'light' | 'dark') => void

  // Reset
  resetShelfOrder: () => void
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      // Initial state
      shelfOrder: [],
      corkBoardColumns: 5,
      defaultView: 'cork_board',
      theme: 'light',

      // Set entire shelf order
      setShelfOrder: (shelfIds) => {
        set({ shelfOrder: shelfIds })
      },

      // Move a shelf from one position to another
      moveShelf: (fromIndex, toIndex) => {
        set((state) => {
          const newOrder = [...state.shelfOrder]
          const [movedShelf] = newOrder.splice(fromIndex, 1)
          newOrder.splice(toIndex, 0, movedShelf)
          return { shelfOrder: newOrder }
        })
      },

      // Add a new shelf to the order
      addShelfToOrder: (shelfId, position) => {
        set((state) => {
          // Don't add if already exists
          if (state.shelfOrder.includes(shelfId)) {
            return state
          }

          const newOrder = [...state.shelfOrder]
          if (position !== undefined && position >= 0 && position <= newOrder.length) {
            newOrder.splice(position, 0, shelfId)
          } else {
            newOrder.push(shelfId)
          }
          return { shelfOrder: newOrder }
        })
      },

      // Remove a shelf from the order
      removeShelfFromOrder: (shelfId) => {
        set((state) => ({
          shelfOrder: state.shelfOrder.filter((id) => id !== shelfId),
        }))
      },

      // Update cork board columns
      setCorkBoardColumns: (columns) => {
        set({ corkBoardColumns: Math.max(1, Math.min(10, columns)) })
      },

      // Update default view
      setDefaultView: (view) => {
        set({ defaultView: view })
      },

      // Update theme
      setTheme: (theme) => {
        set({ theme })
      },

      // Reset shelf order (will be rebuilt from database positions)
      resetShelfOrder: () => {
        set({ shelfOrder: [] })
      },
    }),
    {
      name: 'tbr-preferences', // localStorage key
      partialize: (state) => ({
        shelfOrder: state.shelfOrder,
        corkBoardColumns: state.corkBoardColumns,
        defaultView: state.defaultView,
        theme: state.theme,
      }),
    }
  )
)
