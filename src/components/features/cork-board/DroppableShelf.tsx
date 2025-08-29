'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Shelf, Book } from '@/types/book'
import { cn } from '@/lib/cn'
import { Text, Heading3 } from '@/components/ui/Typography'
import { Card, CardContent } from '@/components/ui/Card'

interface DroppableShelfProps {
  shelf: Shelf
  books: Book[]
  children: React.ReactNode
  className?: string
}

export function DroppableShelf({ 
  shelf, 
  books, 
  children, 
  className 
}: DroppableShelfProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: shelf.id,
    data: {
      type: 'shelf',
      shelf,
      accepts: ['book'],
    },
  })

  return (
    <div className={cn("mb-8", className)}>
      {/* Shelf Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: shelf.color }}
          />
          <Heading3 className="!text-lg">
            {shelf.name}
          </Heading3>
          <Text color="muted" className="text-sm">
            ({books.length} {books.length === 1 ? 'book' : 'books'})
          </Text>
        </div>
      </div>

      {/* Droppable Area */}
      <Card 
        variant="cork-board"
        className={cn(
          "min-h-[200px] p-6 transition-all duration-200",
          isOver && "border-amber-400 border-2 bg-amber-50/50",
          books.length === 0 && "min-h-[120px]"
        )}
      >
        <CardContent 
          ref={setNodeRef}
          className={cn(
            "p-0",
            books.length === 0 && "flex items-center justify-center h-full"
          )}
        >
          {books.length === 0 ? (
            <div className="text-center py-8">
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-2 opacity-30"
                style={{ backgroundColor: shelf.color }}
              />
              <Text color="muted" className="text-sm">
                Drop books here to add them to "{shelf.name}"
              </Text>
            </div>
          ) : (
            <SortableContext 
              items={books.map(book => book.id)} 
              strategy={rectSortingStrategy}
            >
              <div className={cn(
                "grid gap-4 justify-items-center",
                // Responsive grid
                "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
              )}>
                {children}
              </div>
            </SortableContext>
          )}
        </CardContent>
      </Card>

      {/* Shelf Description */}
      {shelf.description && (
        <Text color="muted" className="mt-2 text-sm">
          {shelf.description}
        </Text>
      )}
    </div>
  )
}