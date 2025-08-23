import React from 'react'
import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

// Container sizes for responsive layout management
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  children: ReactNode
  centerContent?: boolean
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none'
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', children, centerContent = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8',
        containerSizes[size],
        centerContent && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Container.displayName = 'Container'

// Section component for semantic page structure
interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: 'section' | 'main' | 'article' | 'aside'
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, as: Component = 'section', ...props }, ref) => (
    React.createElement(
      Component,
      {
        ref,
        className: cn('py-12 lg:py-16', className),
        ...props
      },
      children
    )
  )
)
Section.displayName = 'Section'

// Grid system for consistent layouts
interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg'
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, children, cols = { default: 1, md: 2, lg: 3 }, gap = 'md', ...props }, ref) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-2', 
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6'
    }

    const gridGaps = {
      sm: 'gap-4',
      md: 'gap-6', 
      lg: 'gap-8'
    }

    const responsiveClasses = [
      cols.default && gridCols[cols.default as keyof typeof gridCols],
      cols.sm && `sm:${gridCols[cols.sm as keyof typeof gridCols]}`,
      cols.md && `md:${gridCols[cols.md as keyof typeof gridCols]}`, 
      cols.lg && `lg:${gridCols[cols.lg as keyof typeof gridCols]}`,
      cols.xl && `xl:${gridCols[cols.xl as keyof typeof gridCols]}`
    ].filter(Boolean)

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          responsiveClasses,
          gridGaps[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Grid.displayName = 'Grid'