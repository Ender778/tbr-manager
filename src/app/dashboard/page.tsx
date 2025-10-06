'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout, Container, Section, Grid, Flex } from "@/components/ui/layout"
import { Heading1, Heading2, Lead, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Modal } from "@/components/ui/Compound/Modal"
import { LibraryIcon, PlusIcon } from "@/components/ui/Icon"
import { useAuthStore } from '@/stores/auth-store'
import { useBookStore } from '@/stores/book-store'
import { UserAvatar } from '@/components/auth/UserProfile'
import { BookSearch } from '@/components/features/search'
import { CorkBoard } from '@/components/features/cork-board'
import { BookSearchResult, Book } from '@/types/book'
import { useDashboardData, useBookStats } from '@/hooks/use-dashboard'
import { useOrderedShelves } from '@/hooks/use-ordered-shelves'
import { BookDetailsModal } from '@/components/features/book-details'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isInitialized, initialize, signOut } = useAuthStore()

  // React Query hooks for data fetching
  const { data: dashboardData, isLoading: isLoadingData, dataUpdatedAt, refetchDashboard } = useDashboardData()

  // Zustand store for mutations (with optimistic updates) and current state
  const {
    books: storeBooks,
    shelves: storeShelves,
    bookPositions: storeBookPositions,
    isLoading: isMutating,
    addBook,
    moveBook,
    getTBRShelf,
  } = useBookStore()

  // Only sync React Query data to Zustand on initial load or after mutations complete
  // This prevents React Query from overwriting optimistic updates
  const [lastSyncTime, setLastSyncTime] = useState(0)
  useEffect(() => {
    if (dashboardData && !isMutating && dataUpdatedAt > lastSyncTime) {
      useBookStore.setState({
        books: dashboardData.books,
        shelves: dashboardData.shelves,
        bookPositions: dashboardData.bookPositions,
      })
      setLastSyncTime(dataUpdatedAt)
    }
  }, [dashboardData, isMutating, dataUpdatedAt, lastSyncTime])

  // Get book stats from store (computed from current state)
  const stats = useBookStats()

  // Local state
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/auth')
    }
  }, [isInitialized, user, router])

  // IMPORTANT: Extract data and call hooks BEFORE any early returns
  // This ensures hooks are always called in the same order (Rules of Hooks)

  // Use Zustand store data (includes optimistic updates)
  // Fall back to React Query data on initial load
  const books = storeBooks.length > 0 ? storeBooks : (dashboardData?.books || [])
  const rawShelves = storeShelves.length > 0 ? storeShelves : (dashboardData?.shelves || [])
  const bookPositions = storeBookPositions.length > 0 ? storeBookPositions : (dashboardData?.bookPositions || [])

  // Get shelves in user-preferred order (UI-based, not DB position)
  const shelves = useOrderedShelves(rawShelves)

  // Event handlers
  const handleBookAdd = async (searchResult: BookSearchResult) => {
    const tbrShelf = getTBRShelf()

    if (!tbrShelf) {
      toast.error('No default shelf found. Please create a "To Be Read" shelf first.')
      return
    }

    try {
      await addBook(searchResult, tbrShelf.id)
      setIsAddBookModalOpen(false)
      // Refetch dashboard data after successful add to sync with database
      await refetchDashboard()
    } catch (error) {
      console.error('Failed to add book:', error)
    }
  }

  const handleBookMove = async (bookId: string, fromShelfId: string, toShelfId: string, newPosition: number) => {
    try {
      await moveBook(bookId, fromShelfId, toShelfId, newPosition)
      // Refetch dashboard data after successful move to sync with database
      await refetchDashboard()
    } catch (error) {
      console.error('Failed to move book:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book)
    setIsBookDetailsOpen(true)
  }

  const handleBookDetailsClose = async () => {
    setIsBookDetailsOpen(false)
    // Refetch data after closing to ensure we have latest changes
    await refetchDashboard()
    // Small delay to avoid jarring transition
    setTimeout(() => setSelectedBook(null), 300)
  }

  // Early return AFTER all hooks have been called
  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cork-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-white/80 backdrop-blur-sm">
        <Container>
          <Flex justify="between" align="center" className="h-16">
            <Flex align="center" gap="sm">
              <LibraryIcon size="lg" className="text-amber-600" />
              <Heading2 className="!text-2xl">TBR Manager</Heading2>
            </Flex>
            
            <Flex gap="sm" align="center">
              <Button 
                variant="primary" 
                size="md"
                onClick={() => setIsAddBookModalOpen(true)}
              >
                <PlusIcon size="sm" />
                Add Book
              </Button>
              <UserAvatar size="md" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="text-cork-600 hover:text-cork-800"
              >
                Sign Out
              </Button>
            </Flex>
          </Flex>
        </Container>
      </header>

      {/* Main Content */}
      <main>
        <Container>
          <Section spacing="lg">
            <div className="mb-8">
              <Heading1 className="mb-2">Your Reading Collection</Heading1>
              <Lead>
                Organize your books visually with drag-and-drop on your personal cork board
              </Lead>
            </div>

            {/* Stats Section */}
            <Section spacing="sm">
              <Grid cols={4} gap="md">
                <Card>
                  <CardContent className="p-6">
                    <Text className="text-2xl font-bold text-amber-800">{stats.total}</Text>
                    <Text color="muted">Total Books</Text>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Text className="text-2xl font-bold text-amber-800">{stats.reading}</Text>
                    <Text color="muted">Currently Reading</Text>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Text className="text-2xl font-bold text-amber-800">{stats.tbr}</Text>
                    <Text color="muted">To Be Read</Text>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Text className="text-2xl font-bold text-amber-800">{stats.completed}</Text>
                    <Text color="muted">Completed</Text>
                  </CardContent>
                </Card>
              </Grid>
            </Section>

            {/* Cork Board */}
            {isLoadingData ? (
              <Card variant="cork-board" className="min-h-[600px] p-8">
                <div className="flex items-center justify-center h-full">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-cork-600 border-t-transparent" />
                </div>
              </Card>
            ) : books.length === 0 ? (
              <Card variant="cork-board" className="min-h-[600px] p-8">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <LibraryIcon size="xl" className="text-amber-500 opacity-50 mb-4" />
                  <Heading2 className="mb-2">Your Cork Board Awaits</Heading2>
                  <Text className="mb-6 max-w-md">
                    Add your first book to get started. Your books will appear here as visual covers
                    that you can drag and organize however you like.
                  </Text>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setIsAddBookModalOpen(true)}
                  >
                    <PlusIcon size="md" />
                    Add Your First Book
                  </Button>
                </div>
              </Card>
            ) : (
              <CorkBoard
                shelves={shelves}
                books={books}
                bookPositions={bookPositions}
                onBookMove={handleBookMove}
                onBookSelect={handleBookSelect}
              />
            )}
          </Section>
        </Container>
      </main>

      {/* Add Book Modal */}
      <Modal.Root open={isAddBookModalOpen} onOpenChange={setIsAddBookModalOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add a New Book</Modal.Title>
          </Modal.Header>
          <div className="p-6">
            <BookSearch onBookAdd={handleBookAdd} />
          </div>
        </Modal.Content>
      </Modal.Root>

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={isBookDetailsOpen}
        onClose={handleBookDetailsClose}
      />
    </PageLayout>
  )
}