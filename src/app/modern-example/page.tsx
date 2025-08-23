/**
 * Modern Page Implementation Example
 * Demonstrates advanced UI patterns and modern React practices
 */

'use client'

import React from 'react'
import { Container, Grid } from '@/components/ui/Container'
import { Text, Heading, Body } from '@/components/ui/Polymorphic/Text'
import { ModernButton, ButtonGroup } from '@/components/ui/ModernButton'
import { Modal } from '@/components/ui/Compound/Modal'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { OptimizedImage, useDebounce, usePerformanceMonitor } from '@/lib/performance'
import { useRenderProfiler } from '@/lib/dev-tools'

// Example book data type
interface Book {
  id: string
  title: string
  author: string
  cover: string
  rating: number
  status: 'to-read' | 'reading' | 'completed'
}

// Mock data
const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    cover: '/api/placeholder/200/300',
    rating: 4.5,
    status: 'completed'
  },
  {
    id: '2', 
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: '/api/placeholder/200/300',
    rating: 4.8,
    status: 'reading'
  },
  {
    id: '3',
    title: 'The Psychology of Design',
    author: 'Jon Yablonski',
    cover: '/api/placeholder/200/300',
    rating: 4.2,
    status: 'to-read'
  }
]

// Modern Book Card Component
function BookCard({ book }: { book: Book }) {
  useRenderProfiler('BookCard')
  
  const statusColors = {
    'to-read': 'warning',
    'reading': 'success', 
    'completed': 'cork'
  } as const

  const statusIcons = {
    'to-read': 'clock',
    'reading': 'book-open',
    'completed': 'star'
  } as const

  return (
    <Card variant="elevated" className="group hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <OptimizedImage
          src={book.cover}
          alt={`Cover of ${book.title}`}
          width={200}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-${statusColors[book.status]}-100 text-${statusColors[book.status]}-700`}>
          <Icon 
            name={statusIcons[book.status]} 
            size="xs" 
            className="inline mr-1"
          />
          {book.status.replace('-', ' ')}
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
          <Icon name="star" size="xs" className="text-yellow-400" />
          <Text variant="caption" color="inverse">{book.rating}</Text>
        </div>
      </div>

      <CardContent className="p-4">
        <Heading size="sm" className="mb-2 line-clamp-2">
          {book.title}
        </Heading>
        <Body size="sm" color="secondary" className="mb-3">
          by {book.author}
        </Body>
        
        <ButtonGroup variant="horizontal" size="sm">
          <ModernButton variant="ghost" iconOnly="eye" aria-label="Quick view" />
          <ModernButton variant="ghost" iconOnly="heart" aria-label="Add to favorites" />
          <ModernButton variant="outline" size="sm">
            View Details
          </ModernButton>
        </ButtonGroup>
      </CardContent>
    </Card>
  )
}

// Search and Filter Component
function SearchAndFilters({ 
  onSearch, 
  onFilter 
}: { 
  onSearch: (term: string) => void
  onFilter: (status: string) => void 
}) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  React.useEffect(() => {
    onSearch(debouncedSearch)
  }, [debouncedSearch, onSearch])

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search Input */}
      <div className="relative flex-1">
        <Icon 
          name="search" 
          size="sm" 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" 
        />
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-cork-500 focus:border-cork-500"
        />
      </div>

      {/* Status Filter */}
      <select 
        onChange={(e) => onFilter(e.target.value)}
        className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-cork-500"
      >
        <option value="">All Status</option>
        <option value="to-read">To Read</option>
        <option value="reading">Reading</option>
        <option value="completed">Completed</option>
      </select>

      {/* View Toggle */}
      <ButtonGroup>
        <ModernButton variant="ghost" iconOnly="grid" aria-label="Grid view" />
        <ModernButton variant="ghost" iconOnly="list" aria-label="List view" />
      </ButtonGroup>
    </div>
  )
}

// Add Book Modal Component
function AddBookModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    onClose()
  }

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose} size="lg">
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Add New Book</Modal.Title>
          <Modal.Description>
            Add a new book to your reading list. You can search by title, ISBN, or add manually.
          </Modal.Description>
        </Modal.Header>
        
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Book Title</label>
              <input
                type="text"
                placeholder="Enter book title..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-cork-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                placeholder="Enter author name..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-cork-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-cork-500">
                <option value="to-read">To Read</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        
        <Modal.Footer justify="between">
          <Modal.Close asChild>
            <ModernButton variant="ghost">Cancel</ModernButton>
          </Modal.Close>
          <div className="space-x-2">
            <ModernButton 
              variant="outline" 
              iconLeft="search"
            >
              Search Online
            </ModernButton>
            <ModernButton 
              variant="primary" 
              iconLeft="plus"
              isLoading={isLoading}
              loadingText="Adding..."
              onClick={handleSubmit}
            >
              Add Book
            </ModernButton>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}

// Main Modern Example Page
export default function ModernExamplePage() {
  usePerformanceMonitor('ModernExamplePage')
  
  const [books, setBooks] = React.useState(SAMPLE_BOOKS)
  const [filteredBooks, setFilteredBooks] = React.useState(SAMPLE_BOOKS)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const handleSearch = React.useCallback((searchTerm: string) => {
    if (!searchTerm) {
      setFilteredBooks(books)
      return
    }

    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBooks(filtered)
  }, [books])

  const handleFilter = React.useCallback((status: string) => {
    if (!status) {
      setFilteredBooks(books)
      return
    }

    const filtered = books.filter(book => book.status === status)
    setFilteredBooks(filtered)
  }, [books])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cork-50 to-amber-50">
      <Container size="xl" className="py-8">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Heading size="lg" color="primary" className="mb-2">
                Modern TBR Manager
              </Heading>
              <Body color="secondary">
                Demonstrating cutting-edge UI architecture patterns
              </Body>
            </div>
            
            <div className="flex gap-3">
              <ModernButton 
                variant="gradient" 
                iconLeft="plus"
                onClick={() => setIsAddModalOpen(true)}
                glow
              >
                Add Book
              </ModernButton>
              
              <ModernButton variant="ghost" iconOnly="settings" />
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <SearchAndFilters 
          onSearch={handleSearch}
          onFilter={handleFilter}
        />

        {/* Stats Cards */}
        <Grid 
          cols={{ default: 1, sm: 2, lg: 4 }} 
          gap="md" 
          className="mb-8"
        >
          {[
            { label: 'Total Books', value: books.length, icon: 'library' },
            { label: 'Reading', value: books.filter(b => b.status === 'reading').length, icon: 'book-open' },
            { label: 'Completed', value: books.filter(b => b.status === 'completed').length, icon: 'star' },
            { label: 'Average Rating', value: '4.5', icon: 'heart' },
          ].map((stat, index) => (
            <Card key={index} variant="elevated" className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cork-100 rounded-full">
                  <Icon name={stat.icon as any} size="lg" className="text-cork-600" />
                </div>
                <div>
                  <Text variant="heading-lg" color="primary">
                    {stat.value}
                  </Text>
                  <Text variant="body-sm" color="secondary">
                    {stat.label}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </Grid>

        {/* Books Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <Heading size="md">Your Library</Heading>
            <Text variant="body-sm" color="muted">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
            </Text>
          </div>

          <Grid cols={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap="lg">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </Grid>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16">
              <Icon name="search" size="xl" className="text-neutral-300 mb-4" />
              <Heading size="sm" color="secondary" className="mb-2">
                No books found
              </Heading>
              <Body color="muted">
                Try adjusting your search or filters
              </Body>
            </div>
          )}
        </section>

        {/* Add Book Modal */}
        <AddBookModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Container>
    </div>
  )
}