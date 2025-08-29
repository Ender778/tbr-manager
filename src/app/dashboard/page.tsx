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
import { UserAvatar } from '@/components/auth/UserProfile'
import { BookSearch } from '@/components/features/search'
import { CorkBoard } from '@/components/features/cork-board'
import { Book, Shelf, BookPosition, BookSearchResult } from '@/types/book'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isInitialized, initialize, signOut } = useAuthStore()
  
  // State
  const [books, setBooks] = useState<Book[]>([])
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [bookPositions, setBookPositions] = useState<BookPosition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/auth')
    }
  }, [isInitialized, user, router])

  // Load data when user is available
  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load shelves and books in parallel
      const [shelvesResponse, booksResponse] = await Promise.all([
        fetch('/api/shelves'),
        fetch('/api/books')
      ])

      if (!shelvesResponse.ok || !booksResponse.ok) {
        throw new Error('Failed to load dashboard data')
      }

      const shelvesData = await shelvesResponse.json()
      const booksData = await booksResponse.json()

      console.log('Shelves data:', shelvesData.data)
      console.log('Books data:', booksData.data)
      console.log('Book cover URLs:', booksData.data?.map((book: Book) => ({ title: book.title, coverUrl: book.cover_url })))
      console.log('First shelf book_positions:', shelvesData.data[0]?.book_positions)

      if (shelvesData.success) {
        setShelves(shelvesData.data)
        
        // Extract book positions from shelf data
        const positions: BookPosition[] = []
        shelvesData.data.forEach((shelf: any) => {
          if (shelf.book_positions) {
            positions.push(...shelf.book_positions.map((pos: any) => ({
              id: pos.id,
              book_id: pos.book_id || pos.books?.id, // Try both fields
              shelf_id: shelf.id,
              position: pos.position,
              user_id: user!.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              master_position: pos.master_position || null,
              year_completed: pos.year_completed || null,
            })))
          }
        })
        console.log('Extracted positions:', positions)
        setBookPositions(positions)
      }

      if (booksData.success) {
        setBooks(booksData.data)
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load your books. Please refresh the page.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAdd = async (searchResult: BookSearchResult) => {
    try {
      // Find the default "To Be Read" shelf
      const tbrShelf = shelves.find(shelf => shelf.name === 'To Be Read' && shelf.is_default)
      console.log('Found TBR shelf:', tbrShelf)
      
      const bookData = {
        title: searchResult.title,
        subtitle: searchResult.subtitle,
        author: searchResult.author,
        isbn: searchResult.isbn,
        publisher: searchResult.publisher,
        published_date: searchResult.publishedDate && searchResult.publishedDate instanceof Date && !isNaN(searchResult.publishedDate.getTime()) 
          ? searchResult.publishedDate.toISOString() 
          : undefined,
        page_count: searchResult.pageCount,
        language: searchResult.language,
        cover_url: searchResult.coverUrl,
        cover_thumbnail_url: searchResult.thumbnailUrl,
        google_books_id: searchResult.googleBooksId,
        status: 'tbr' as const,
        shelfId: tbrShelf?.id,
      }

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      })

      if (!response.ok) {
        throw new Error('Failed to add book')
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success(`Added "${searchResult.title}" to your library!`)
        setIsAddBookModalOpen(false)
        loadDashboardData() // Reload to get updated data
      } else {
        throw new Error(result.error || 'Failed to add book')
      }

    } catch (error) {
      console.error('Error adding book:', error)
      toast.error('Failed to add book. Please try again.')
    }
  }

  const handleBookMove = async (bookId: string, _fromShelfId: string, toShelfId: string, newPosition: number) => {
    try {
      // Optimistic update
      const updatedPositions = bookPositions.map(pos => {
        if (pos.book_id === bookId) {
          return { ...pos, shelf_id: toShelfId, position: newPosition }
        }
        return pos
      })
      setBookPositions(updatedPositions)

      // TODO: Implement API call to update book position
      toast.success('Book moved successfully!')
    } catch (error) {
      console.error('Error moving book:', error)
      toast.error('Failed to move book. Please try again.')
      // Reload data on error to revert optimistic update
      loadDashboardData()
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  // Calculate stats
  const stats = {
    total: books.length,
    tbr: books.filter(book => book.status === 'tbr').length,
    reading: books.filter(book => book.status === 'reading').length,
    completed: books.filter(book => book.status === 'completed').length,
  }

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
                    <Text className="text-2xl font-bold text-amber-800">{stats.tbr}</Text>
                    <Text color="muted">To Be Read</Text>
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
                    <Text className="text-2xl font-bold text-amber-800">{stats.completed}</Text>
                    <Text color="muted">Completed</Text>
                  </CardContent>
                </Card>
              </Grid>
            </Section>

            {/* Cork Board */}
            {isLoading ? (
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
    </PageLayout>
  )
}