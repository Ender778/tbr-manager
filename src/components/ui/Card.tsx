import React from 'react'
import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

// Card component variants for different use cases
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'cork-board'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  children: ReactNode
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const cardVariants = {
  default: 'bg-white border border-cork-200 rounded-lg shadow-sm',
  elevated: 'bg-white border border-cork-200 rounded-lg shadow-lg',
  outlined: 'bg-transparent border-2 border-cork-300 rounded-lg',
  'cork-board': 'bg-white border border-cork-200 rounded-lg shadow-lg transform transition-transform hover:scale-[1.02]'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'

// Feature card specifically for homepage features
export const FeatureCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      className={cn('p-6 hover:shadow-xl transition-shadow', className)}
      {...props}
    >
      {children}
    </Card>
  )
)
FeatureCard.displayName = 'FeatureCard'