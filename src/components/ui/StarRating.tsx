import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number | null
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function StarRating({
  rating,
  onChange,
  readonly = false,
  size = 'md',
  showLabel = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const displayRating = hoverRating ?? rating ?? 0

  const handleClick = (starRating: number) => {
    if (!readonly && onChange) {
      // Clicking the same rating clears it
      onChange(rating === starRating ? 0 : starRating)
    }
  }

  const handleMouseEnter = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(null)
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating
          const isInteractive = !readonly && onChange

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                'transition-all duration-150',
                isInteractive && 'cursor-pointer hover:scale-110',
                readonly && 'cursor-default'
              )}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <svg
                className={cn(
                  sizeClasses[size],
                  'transition-colors duration-150',
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-none text-gray-300',
                  isInteractive && hoverRating && 'drop-shadow-sm'
                )}
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          )
        })}
      </div>

      {showLabel && (
        <span className="text-sm text-gray-600 ml-1">
          {displayRating > 0 ? `${displayRating}/5` : 'Not rated'}
        </span>
      )}
    </div>
  )
}
