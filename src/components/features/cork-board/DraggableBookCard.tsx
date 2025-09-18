'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BookCard } from './BookCard'
import { Book } from '@/types/book'
import { cn } from '@/lib/cn'

interface DraggableBookCardProps {
  book: Book
  rotation?: number | undefined
  shelfColor?: string | undefined
  onSelect?: ((book: Book) => void) | undefined
  onEdit?: ((book: Book) => void) | undefined
  onDelete?: ((book: Book) => void) | undefined
  className?: string | undefined
}

export function DraggableBookCard({ 
  book, 
  rotation = 0,
  shelfColor,
  onSelect,
  onEdit,
  onDelete,
  className 
}: DraggableBookCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: book.id,
    data: {
      type: 'book',
      book,
    },
    // Ensure proper measurement
    disabled: false,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none w-32", // Match BookCard width exactly
        isDragging && "z-50",
        className
      )}
      {...attributes}
      {...listeners}
    >
      <BookCard
        book={book}
        isDragging={isDragging}
        rotation={isDragging ? 0 : rotation} // Reset rotation when dragging
        shelfColor={shelfColor}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}