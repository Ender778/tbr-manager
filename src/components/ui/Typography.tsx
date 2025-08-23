import React from 'react'
import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

// Typography variant types for semantic HTML elements
export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'lead' | 'large' | 'small' | 'muted'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  children: ReactNode
  asChild?: boolean
}

// Semantic typography system with consistent sizing and spacing
const typographyVariants = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-cork-800 lg:text-5xl',
  h2: 'scroll-m-20 text-3xl font-bold tracking-tight text-cork-800 lg:text-4xl',
  h3: 'scroll-m-20 text-2xl font-bold tracking-tight text-cork-800 lg:text-3xl',
  h4: 'scroll-m-20 text-xl font-bold tracking-tight text-cork-800 lg:text-2xl',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight text-cork-800',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight text-cork-800',
  p: 'leading-7 text-cork-600',
  lead: 'text-xl text-cork-600 leading-8',
  large: 'text-lg font-semibold text-cork-800',
  small: 'text-sm font-medium text-cork-600',
  muted: 'text-sm text-cork-500'
}

const elementMap = {
  h1: 'h1',
  h2: 'h2', 
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  lead: 'p',
  large: 'div',
  small: 'small',
  muted: 'p'
} as const

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'p', children, ...props }, ref) => {
    const Element = elementMap[variant] as keyof JSX.IntrinsicElements
    
    return React.createElement(
      Element,
      {
        className: cn(typographyVariants[variant], className),
        ref,
        ...props
      },
      children
    )
  }
)

Typography.displayName = 'Typography'

// Convenience components for common usage
export const Heading1 = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="h1" {...props} />

export const Heading2 = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="h2" {...props} />

export const Heading3 = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="h3" {...props} />

export const Heading4 = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="h4" {...props} />

export const Text = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="p" {...props} />

export const Lead = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="lead" {...props} />

export const Small = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="small" {...props} />

export const Muted = (props: Omit<TypographyProps, 'variant'>) => 
  <Typography variant="muted" {...props} />