'use client'

import React, { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { DroppableShelf } from './DroppableShelf'
import { DraggableBookCard } from './DraggableBookCard'
import { BookCard } from './BookCard'
import { Book, Shelf, BookPosition } from '@/types/book'
import { cn } from '@/lib/cn'

interface CorkBoardProps {
  shelves: Shelf[]
  books: Book[]
  bookPositions: BookPosition[]
  onBookMove: (bookId: string, fromShelfId: string, toShelfId: string, newPosition: number) => void
  onBookSelect?: (book: Book) => void
  onBookEdit?: (book: Book) => void
  onBookDelete?: (book: Book) => void
  className?: string
}

export function CorkBoard({
  shelves,
  books,
  bookPositions,
  onBookMove,
  onBookSelect,
  onBookEdit,
  onBookDelete,
  className
}: CorkBoardProps) {
  const [activeBook, setActiveBook] = useState<Book | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement to start dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Generate random rotations for books (consistent per book ID)
  const getBookRotation = (bookId: string) => {
    const hash = bookId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return (hash % 7) - 3 // Random rotation between -3° and +3°
  }

  // Group books by shelf
  const getShelfBooks = (shelfId: string): Book[] => {
    const shelfPositions = bookPositions
      .filter(pos => pos.shelf_id === shelfId)
      .sort((a, b) => a.position - b.position)
    
    return shelfPositions
      .map(pos => books.find(book => book.id === pos.book_id))
      .filter(Boolean) as Book[]
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    console.log('Drag start coordinates:', {
      clientX: event.activatorEvent?.clientX,
      clientY: event.activatorEvent?.clientY,
      activeRect: active.rect.current.translated
    })
    const book = books.find(b => b.id === active.id)
    if (book) {
      setActiveBook(book)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveBook(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the active book and its current shelf
    const activeBook = books.find(b => b.id === activeId)
    if (!activeBook) return

    const currentPosition = bookPositions.find(pos => pos.book_id === activeId)
    if (!currentPosition) return

    // Determine target shelf
    let targetShelfId: string
    let targetPosition: number = 0

    if (over.data.current?.type === 'shelf') {
      // Dropped on shelf directly
      targetShelfId = overId
      const targetShelfBooks = getShelfBooks(targetShelfId)
      targetPosition = targetShelfBooks.length
    } else {
      // Dropped on another book - find its shelf and position
      const targetBookPosition = bookPositions.find(pos => pos.book_id === overId)
      if (!targetBookPosition) return

      targetShelfId = targetBookPosition.shelf_id
      targetPosition = targetBookPosition.position
    }

    // Only move if it's actually changing position or shelf
    if (targetShelfId !== currentPosition.shelf_id || targetPosition !== currentPosition.position) {
      onBookMove(activeId, currentPosition.shelf_id, targetShelfId, targetPosition)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (over) {
      console.log('Drag over:', {
        activeId: active.id,
        overId: over.id,
        overRect: over.rect,
        overData: over.data.current
      })
    }
  }

  return (
    <div className={cn("cork-board-container", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        measuring={{
          droppable: {
            strategy: 'always',
          },
        }}
      >
        {/* Shelves */}
        <div className="space-y-8">
          {shelves
            .filter(shelf => !shelf.is_archived)
            .sort((a, b) => a.position - b.position)
            .map((shelf) => {
              const shelfBooks = getShelfBooks(shelf.id)
              return (
                <DroppableShelf
                  key={shelf.id}
                  shelf={shelf}
                  books={shelfBooks}
                >
                  {shelfBooks.map((book) => (
                    <DraggableBookCard
                      key={book.id}
                      book={book}
                      rotation={getBookRotation(book.id)}
                      shelfColor={shelf.color}
                      onSelect={onBookSelect}
                      onEdit={onBookEdit}
                      onDelete={onBookDelete}
                    />
                  ))}
                </DroppableShelf>
              )
            })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeBook ? (
            <BookCard
              book={activeBook}
              isDragging={true}
              rotation={0} // No rotation when dragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}