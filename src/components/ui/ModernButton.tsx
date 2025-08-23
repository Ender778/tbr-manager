/**
 * Modern Button Component
 * Advanced button with multiple patterns and AI-powered features
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { semanticTokens } from '@/lib/design-tokens'
import { Icon, type IconName } from './Icon'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

// Enhanced button variants with modern styling
export type ButtonVariant = 
  | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  | 'success' | 'warning' | 'gradient' | 'glass'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonShape = 'rectangle' | 'rounded' | 'pill' | 'circle'

interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  children: ReactNode
  
  // Loading states
  isLoading?: boolean
  loadingText?: string
  
  // Icon support
  iconLeft?: IconName
  iconRight?: IconName
  iconOnly?: IconName
  
  // Advanced features
  pulse?: boolean
  shake?: boolean
  glow?: boolean
  
  // Accessibility
  'aria-label'?: string
  'data-testid'?: string
}

// Comprehensive variant system
const buttonVariants = {
  primary: [
    'bg-cork-600 text-white border-cork-600',
    'hover:bg-cork-700 hover:border-cork-700',
    'active:bg-cork-800 active:scale-95',
    'disabled:bg-cork-300 disabled:border-cork-300 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-cork-200 focus:border-cork-700'
  ].join(' '),
  
  secondary: [
    'bg-cork-100 text-cork-700 border-cork-200',
    'hover:bg-cork-200 hover:border-cork-300',
    'active:bg-cork-300 active:scale-95',
    'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-cork-100 focus:border-cork-300'
  ].join(' '),
  
  outline: [
    'bg-transparent text-cork-600 border-2 border-cork-600',
    'hover:bg-cork-600 hover:text-white',
    'active:bg-cork-700 active:border-cork-700 active:scale-95',
    'disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-cork-200'
  ].join(' '),
  
  ghost: [
    'bg-transparent text-cork-600 border-transparent',
    'hover:bg-cork-100 hover:text-cork-700',
    'active:bg-cork-200 active:scale-95',
    'disabled:text-neutral-400 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-cork-100'
  ].join(' '),
  
  destructive: [
    'bg-red-600 text-white border-red-600',
    'hover:bg-red-700 hover:border-red-700',
    'active:bg-red-800 active:scale-95',
    'disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-red-200 focus:border-red-700'
  ].join(' '),
  
  success: [
    'bg-green-600 text-white border-green-600',
    'hover:bg-green-700 hover:border-green-700',
    'active:bg-green-800 active:scale-95',
    'disabled:bg-green-300 disabled:border-green-300 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-green-200'
  ].join(' '),
  
  warning: [
    'bg-yellow-500 text-yellow-900 border-yellow-500',
    'hover:bg-yellow-600 hover:border-yellow-600',
    'active:bg-yellow-700 active:scale-95',
    'disabled:bg-yellow-300 disabled:border-yellow-300 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-yellow-200'
  ].join(' '),
  
  gradient: [
    'bg-gradient-to-r from-cork-500 to-amber-500 text-white border-transparent',
    'hover:from-cork-600 hover:to-amber-600',
    'active:scale-95',
    'disabled:from-neutral-300 disabled:to-neutral-400 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-cork-200'
  ].join(' '),
  
  glass: [
    'backdrop-blur-md bg-white/10 text-cork-800 border border-white/20',
    'hover:bg-white/20 hover:border-white/30',
    'active:bg-white/30 active:scale-95',
    'disabled:bg-white/5 disabled:text-neutral-400 disabled:cursor-not-allowed',
    'focus:ring-4 focus:ring-white/20'
  ].join(' '),
} as const

// Size system with responsive considerations
const buttonSizes = {
  xs: 'px-2 py-1 text-xs min-h-[24px]',
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-base min-h-[40px]',
  lg: 'px-6 py-3 text-lg min-h-[48px]',
  xl: 'px-8 py-4 text-xl min-h-[56px]',
} as const

// Shape variants
const buttonShapes = {
  rectangle: 'rounded-none',
  rounded: 'rounded-lg',
  pill: 'rounded-full',
  circle: 'rounded-full aspect-square',
} as const

// Icon size mapping
const iconSizes = {
  xs: 'xs' as const,
  sm: 'xs' as const,
  md: 'sm' as const,
  lg: 'md' as const,
  xl: 'lg' as const,
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    children,
    isLoading = false,
    loadingText = 'Loading...',
    iconLeft,
    iconRight,
    iconOnly,
    pulse = false,
    shake = false,
    glow = false,
    disabled,
    'aria-label': ariaLabel,
    'data-testid': testId,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading
    const iconSize = iconSizes[size]
    
    const classes = cn(
      // Base button styles
      'inline-flex items-center justify-center gap-2 font-semibold',
      'border transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-offset-2',
      
      // Variant styles
      buttonVariants[variant],
      
      // Size styles
      buttonSizes[size],
      
      // Shape styles
      buttonShapes[shape],
      
      // Special effects
      pulse && 'animate-pulse',
      shake && 'animate-bounce',
      glow && 'shadow-lg shadow-cork-500/25',
      
      // Icon-only adjustments
      iconOnly && 'p-2',
      
      className
    )

    const content = () => {
      if (isLoading) {
        return (
          <>
            <Icon 
              name="clock" 
              size={iconSize}
              className="animate-spin" 
            />
            {!iconOnly && (loadingText || children)}
          </>
        )
      }

      if (iconOnly) {
        return (
          <Icon 
            name={iconOnly} 
            size={iconSize}
            aria-label={ariaLabel || String(children)} 
          />
        )
      }

      return (
        <>
          {iconLeft && <Icon name={iconLeft} size={iconSize} />}
          {children}
          {iconRight && <Icon name={iconRight} size={iconSize} />}
        </>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-label={ariaLabel}
        data-testid={testId}
        {...props}
      >
        {content()}
      </button>
    )
  }
)

ModernButton.displayName = 'ModernButton'

// Button group component for related actions
interface ButtonGroupProps {
  children: ReactNode
  className?: string
  variant?: 'horizontal' | 'vertical'
  size?: ButtonSize
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, variant = 'horizontal', size = 'md' }, ref) => {
    const classes = cn(
      'flex',
      variant === 'horizontal' ? 'flex-row' : 'flex-col',
      '[&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:rounded-l-none',
      variant === 'vertical' && '[&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:rounded-t-none',
      className
    )

    // Clone children and apply consistent size
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, { size })
      }
      return child
    })

    return (
      <div ref={ref} className={classes}>
        {childrenWithProps}
      </div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

// Example usage in comments:
/*
// Basic usage
<ModernButton variant="primary" size="md">
  Click me
</ModernButton>

// With icons
<ModernButton variant="secondary" iconLeft="plus" iconRight="arrow-right">
  Add Book
</ModernButton>

// Loading state
<ModernButton variant="primary" isLoading loadingText="Saving...">
  Save Book
</ModernButton>

// Icon only
<ModernButton variant="ghost" iconOnly="search" aria-label="Search books" />

// Special effects
<ModernButton variant="gradient" glow pulse>
  Premium Feature
</ModernButton>

// Button group
<ButtonGroup variant="horizontal" size="sm">
  <ModernButton variant="outline">Cancel</ModernButton>
  <ModernButton variant="primary">Confirm</ModernButton>
</ButtonGroup>
*/