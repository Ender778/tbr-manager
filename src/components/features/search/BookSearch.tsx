'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Plus, BookOpen, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Text, Heading3 } from '@/components/ui/Typography'
import { BookSearchResult } from '@/types/book'
import { cn } from '@/lib/cn'

interface BookSearchProps {
  onBookAdd: (book: BookSearchResult) => void
  className?: string | undefined
}

interface SearchResult {
  success: boolean
  data: BookSearchResult[]
  total: number
  error?: string
}

export function BookSearch({ onBookAdd, className }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BookSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    setIsLoading(true)
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}&maxResults=8`)
        const data: SearchResult = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Search failed')
        }

        setResults(data.data)
        setError(null)
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [query])

  const handleBookAdd = (book: BookSearchResult) => {
    onBookAdd(book)
    setQuery('')
    setResults([])
    setIsOpen(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const formatDate = (date?: Date) => {
    if (!date) return null
    return new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cork-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for books to add..."
          className={cn(
            "w-full rounded-lg border border-cork-300 bg-white pl-10 pr-4 py-2.5",
            "focus:border-cork-500 focus:outline-none focus:ring-2 focus:ring-cork-200",
            "placeholder:text-cork-400"
          )}
          aria-label="Search for books"
          autoComplete="off"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || isLoading || error) && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Results Panel */}
          <div className="absolute left-0 right-0 top-full z-20 mt-2">
            <Card className="border-cork-200 bg-white shadow-xl">
              <CardContent className="p-0">
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center p-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-cork-600 border-t-transparent" />
                    <Text className="ml-3">Searching books...</Text>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="p-6 text-center">
                    <Text color="muted" className="mb-2">
                      ⚠️ {error}
                    </Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setError(null)
                        setQuery('')
                      }}
                    >
                      Clear search
                    </Button>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && query.trim() && results.length === 0 && (
                  <div className="p-6 text-center">
                    <BookOpen className="mx-auto h-8 w-8 text-cork-400 mb-2" />
                    <Text color="muted">
                      No books found for "{query}"
                    </Text>
                  </div>
                )}

                {/* Results */}
                {!isLoading && !error && results.length > 0 && (
                  <div className="max-h-96 overflow-y-auto">
                    {results.map((book) => (
                      <SearchResultItem
                        key={book.googleBooksId}
                        book={book}
                        onAdd={() => handleBookAdd(book)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

interface SearchResultItemProps {
  book: BookSearchResult
  onAdd: () => void
}

function SearchResultItem({ book, onAdd }: SearchResultItemProps) {
  const formatDate = (date?: Date) => {
    if (!date) return null
    try {
      // Check if date is valid
      if (isNaN(date.getTime())) return null
      return new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)
    } catch {
      return null
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border-b border-cork-100 last:border-b-0",
        "hover:bg-cork-50 transition-colors"
      )}
    >
      {/* Book Cover */}
      <div className="flex-shrink-0">
        {book.thumbnailUrl ? (
          <img
            src={book.thumbnailUrl}
            alt={`Cover of ${book.title}`}
            className="h-16 w-12 rounded object-cover shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="h-16 w-12 rounded bg-cork-200 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-cork-500" />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <Heading3 className="!text-sm !leading-tight line-clamp-2">
            {book.title}
          </Heading3>
          {book.subtitle && (
            <Text color="muted" className="text-xs line-clamp-1 mt-0.5">
              {book.subtitle}
            </Text>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-cork-600 mb-2">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{book.author}</span>
          </div>
          {book.publishedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(book.publishedDate)}</span>
            </div>
          )}
        </div>

        {book.description && (
          <Text color="muted" className="text-xs line-clamp-2">
            {book.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </Text>
        )}
      </div>

      {/* Add Button */}
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="h-8 w-8 p-0 hover:bg-cork-100"
          aria-label={`Add ${book.title} to your library`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}