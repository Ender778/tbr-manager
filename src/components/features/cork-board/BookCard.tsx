'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Star, BookOpen, Calendar, User, MoreVertical } from 'lucide-react'
import { Book } from '@/types/book'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'

interface BookCardProps {
  book: Book
  isDragging?: boolean | undefined
  isSelected?: boolean | undefined
  rotation?: number | undefined
  onSelect?: ((book: Book) => void) | undefined
  onEdit?: ((book: Book) => void) | undefined
  onDelete?: ((book: Book) => void) | undefined
  className?: string | undefined
}

const statusColors = {
  tbr: 'bg-amber-100 text-amber-800 border-amber-200',
  reading: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  dnf: 'bg-red-100 text-red-800 border-red-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200',
} as const

const statusLabels = {
  tbr: 'To Read',
  reading: 'Reading',
  completed: 'Completed',
  dnf: 'Did Not Finish',
  archived: 'Archived',
} as const

export function BookCard({ 
  book, 
  isDragging = false, 
  isSelected = false,
  rotation = 0,
  onSelect,
  onEdit,
  onDelete,
  className 
}: BookCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    onSelect?.(book)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(book)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(book)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
      month: 'short' 
    }).format(new Date(dateString))
  }

  const renderRatingStars = (rating?: number) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center gap-0.5 mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= rating 
                ? "fill-amber-400 text-amber-400" 
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative cursor-pointer select-none",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:z-10",
        isDragging && "opacity-50 rotate-0 scale-95",
        isSelected && "ring-2 ring-amber-400 ring-offset-2",
        className
      )}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`${book.title} by ${book.author} - ${statusLabels[book.status]}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Push Pin */}
      <div 
        className={cn(
          "absolute -top-2 -right-1 z-20",
          "w-4 h-4 rounded-full shadow-sm",
          "transition-all duration-200",
          book.status === 'tbr' && "bg-red-500",
          book.status === 'reading' && "bg-green-500",
          book.status === 'completed' && "bg-blue-500",
          book.status === 'dnf' && "bg-orange-500",
          book.status === 'archived' && "bg-gray-500",
        )}
      />
      
      {/* Book Cover Container */}
      <div className={cn(
        "relative",
        "w-32 h-48", // Fixed aspect ratio for book covers
        "bg-white rounded-sm shadow-md",
        "border border-gray-200",
        "overflow-hidden",
        "group-hover:shadow-lg transition-shadow duration-200"
      )}>
        {/* Cover Image */}
        {book.cover_url && !imageError ? (
          <Image
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 128px, 128px"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cork-100 to-cork-200 flex flex-col items-center justify-center p-3">
            <BookOpen className="h-8 w-8 text-cork-500 mb-2" />
            <Text className="text-xs text-center text-cork-600 leading-tight font-medium">
              {book.title}
            </Text>
            <Text className="text-xs text-center text-cork-500 mt-1">
              {book.author}
            </Text>
          </div>
        )}

        {/* Hover Overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/75 text-white p-3",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200",
          "flex flex-col justify-between"
        )}>
          {/* Top Section */}
          <div>
            <Text className="text-sm font-semibold line-clamp-2 leading-tight mb-1">
              {book.title}
            </Text>
            {book.subtitle && (
              <Text className="text-xs text-gray-300 line-clamp-2 leading-tight mb-2">
                {book.subtitle}
              </Text>
            )}
            <div className="flex items-center gap-1 mb-1">
              <User className="h-3 w-3" />
              <Text className="text-xs line-clamp-1">{book.author}</Text>
            </div>
            {book.date_completed && (
              <div className="flex items-center gap-1 mb-2">
                <Calendar className="h-3 w-3" />
                <Text className="text-xs">{formatDate(book.date_completed)}</Text>
              </div>
            )}
            {renderRatingStars(book.rating || undefined)}
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between">
            <div 
              className={cn(
                "px-2 py-1 rounded text-xs font-medium border",
                statusColors[book.status]
              )}
            >
              {statusLabels[book.status]}
            </div>

            {/* Action Menu */}
            {(onEdit || onDelete) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  // In a real app, this would open a dropdown menu
                  console.log('Open book menu')
                }}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Personal Notes Indicator */}
        {book.personal_notes && (
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-yellow-400 shadow-sm" />
        )}

        {/* Reading Progress (for currently reading books) */}
        {book.status === 'reading' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-200">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: '40%' }} // This would be calculated from reading progress
            />
          </div>
        )}
      </div>

      {/* Screen reader information */}
      <span className="sr-only">
        Book: {book.title} by {book.author}. 
        Status: {statusLabels[book.status]}. 
        {book.rating && `Rating: ${book.rating} out of 5 stars. `}
        {book.personal_notes && 'Has personal notes. '}
        {book.date_completed && `Completed on ${formatDate(book.date_completed)}. `}
        Click to select or press Enter to open details.
      </span>
    </div>
  )
}

// Skeleton loader for when books are loading
export function BookCardSkeleton({ rotation = 0 }: { rotation?: number }) {
  return (
    <div
      className="w-32 h-48 rounded-sm bg-gray-200 animate-pulse"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="absolute -top-2 -right-1 w-4 h-4 rounded-full bg-gray-300" />
    </div>
  )
}