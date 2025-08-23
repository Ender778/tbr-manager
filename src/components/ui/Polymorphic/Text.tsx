/**
 * Polymorphic Text Component
 * Ultra-flexible text component that can render as any HTML element
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { baseTokens, semanticTokens } from '@/lib/design-tokens'
import type {
  PolymorphicForwardRefComponent,
  PolymorphicComponentPropWithRef,
} from './index'

// Text variant system
export type TextVariant = 
  | 'display-lg' | 'display-md' | 'display-sm'
  | 'heading-lg' | 'heading-md' | 'heading-sm'
  | 'body-lg' | 'body-md' | 'body-sm'
  | 'caption' | 'overline'

export type TextColor = 
  | 'primary' | 'secondary' | 'muted' | 'inverse'
  | 'success' | 'warning' | 'error'
  | 'cork' | 'neutral'

export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize'

interface TextProps {
  variant?: TextVariant
  color?: TextColor
  align?: TextAlign
  weight?: TextWeight
  transform?: TextTransform
  truncate?: boolean
  italic?: boolean
  underline?: boolean
  className?: string
}

// Variant styles mapping
const textVariants = {
  'display-lg': 'text-5xl font-extrabold tracking-tight leading-none',
  'display-md': 'text-4xl font-extrabold tracking-tight leading-tight',
  'display-sm': 'text-3xl font-bold tracking-tight leading-tight',
  'heading-lg': 'text-2xl font-bold tracking-tight leading-tight',
  'heading-md': 'text-xl font-bold tracking-tight leading-tight',
  'heading-sm': 'text-lg font-semibold tracking-tight leading-tight',
  'body-lg': 'text-lg leading-relaxed',
  'body-md': 'text-base leading-normal',
  'body-sm': 'text-sm leading-normal',
  'caption': 'text-xs leading-tight',
  'overline': 'text-xs font-medium uppercase tracking-wide leading-tight',
} as const

// Color mappings
const textColors = {
  primary: 'text-cork-800',
  secondary: 'text-cork-600', 
  muted: 'text-neutral-500',
  inverse: 'text-neutral-50',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
  cork: 'text-cork-600',
  neutral: 'text-neutral-600',
} as const

// Weight mappings
const textWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
} as const

// Alignment mappings
const textAligns = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
} as const

// Transform mappings
const textTransforms = {
  none: 'normal-case',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
} as const

// Default element mapping for variants
const defaultElements = {
  'display-lg': 'h1',
  'display-md': 'h1',
  'display-sm': 'h2',
  'heading-lg': 'h2',
  'heading-md': 'h3',
  'heading-sm': 'h4',
  'body-lg': 'p',
  'body-md': 'p',
  'body-sm': 'p',
  'caption': 'span',
  'overline': 'span',
} as const

// Main Text component
export const Text: PolymorphicForwardRefComponent<'p', TextProps> = React.forwardRef(
  <C extends React.ElementType = 'p'>(
    {
      as,
      variant = 'body-md',
      color = 'primary',
      align,
      weight,
      transform = 'none',
      truncate = false,
      italic = false,
      underline = false,
      className,
      children,
      ...props
    }: PolymorphicComponentPropWithRef<C, TextProps>,
    ref?: React.Ref<Element>
  ) => {
    // Determine the component to render
    const Component = as || defaultElements[variant] || 'p'
    
    // Build className
    const classes = cn(
      // Base variant styles
      textVariants[variant],
      
      // Color
      textColors[color],
      
      // Weight (if specified, overrides variant weight)
      weight && textWeights[weight],
      
      // Alignment
      align && textAligns[align],
      
      // Transform
      textTransforms[transform],
      
      // Modifiers
      truncate && 'truncate',
      italic && 'italic',
      underline && 'underline',
      
      // Custom classes
      className
    )

    return React.createElement(
      Component,
      {
        ref,
        className: classes,
        ...props,
      },
      children
    )
  }
)

Text.displayName = 'Text'

// Convenience components with pre-defined variants
export const DisplayText = React.forwardRef<
  HTMLHeadingElement,
  Omit<TextProps, 'variant'> & { size?: 'lg' | 'md' | 'sm' }
>(({ size = 'md', ...props }, ref) => (
  <Text 
    ref={ref} 
    variant={`display-${size}` as TextVariant} 
    {...props} 
  />
))

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  Omit<TextProps, 'variant'> & { size?: 'lg' | 'md' | 'sm' }
>(({ size = 'md', ...props }, ref) => (
  <Text 
    ref={ref} 
    variant={`heading-${size}` as TextVariant} 
    {...props} 
  />
))

export const Body = React.forwardRef<
  HTMLParagraphElement,
  Omit<TextProps, 'variant'> & { size?: 'lg' | 'md' | 'sm' }
>(({ size = 'md', ...props }, ref) => (
  <Text 
    ref={ref} 
    variant={`body-${size}` as TextVariant} 
    {...props} 
  />
))

export const Caption = React.forwardRef<
  HTMLSpanElement,
  Omit<TextProps, 'variant'>
>((props, ref) => (
  <Text 
    ref={ref} 
    as="span"
    variant="caption" 
    {...props} 
  />
))

export const Overline = React.forwardRef<
  HTMLSpanElement,
  Omit<TextProps, 'variant'>
>((props, ref) => (
  <Text 
    ref={ref} 
    as="span"
    variant="overline" 
    {...props} 
  />
))

// Export types
export type TextComponent = typeof Text

// Example usage in comments:
/*
// Basic usage
<Text variant="heading-lg" color="primary">Welcome to TBR Manager</Text>

// Polymorphic usage
<Text as="h1" variant="display-md" color="cork">Main Title</Text>
<Text as="span" variant="caption" color="muted">Subtitle</Text>

// With modifiers
<Text 
  variant="body-lg" 
  color="secondary"
  weight="semibold"
  align="center"
  truncate
>
  Long text that will be truncated...
</Text>

// Convenience components
<DisplayText size="lg" color="primary">Hero Title</DisplayText>
<Heading size="md" color="cork">Section Header</Heading>
<Body size="sm" color="muted">Description text</Body>
<Caption color="neutral">Small text</Caption>
<Overline color="cork">Category Label</Overline>
*/