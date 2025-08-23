/**
 * Modern Modal Compound Component
 * Uses Radix UI primitives with compound pattern
 */

import React, { createContext, useContext } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import { semanticTokens } from '@/lib/design-tokens'
import { Icon } from '../Icon'
import type { ReactNode } from 'react'

// Modal context for internal state management
interface ModalContextValue {
  size: ModalSize
}

const ModalContext = createContext<ModalContextValue>({ size: 'md' })

// Size variants for modal
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
} as const

// Root Modal component
interface ModalRootProps {
  children: ReactNode
  size?: ModalSize
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

function ModalRoot({ 
  children, 
  size = 'md', 
  open, 
  onOpenChange, 
  defaultOpen 
}: ModalRootProps) {
  return (
    <ModalContext.Provider value={{ size }}>
      <DialogPrimitive.Root 
        open={open} 
        onOpenChange={onOpenChange} 
        defaultOpen={defaultOpen}
      >
        {children}
      </DialogPrimitive.Root>
    </ModalContext.Provider>
  )
}

// Modal trigger
interface ModalTriggerProps {
  children: ReactNode
  asChild?: boolean
  className?: string
}

function ModalTrigger({ children, asChild = false, className }: ModalTriggerProps) {
  return (
    <DialogPrimitive.Trigger asChild={asChild} className={className}>
      {children}
    </DialogPrimitive.Trigger>
  )
}

// Modal overlay
function ModalOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  )
}

// Modal content container
interface ModalContentProps {
  children: ReactNode
  className?: string
  showClose?: boolean
}

function ModalContent({ children, className, showClose = true }: ModalContentProps) {
  const { size } = useContext(ModalContext)
  
  return (
    <DialogPrimitive.Portal>
      <ModalOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full translate-x-1/2 translate-y-1/2 gap-4',
          'border bg-white p-6 shadow-lg duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'rounded-lg border-cork-200',
          modalSizes[size],
          className
        )}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded-sm opacity-70 transition-opacity',
              'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-cork-500',
              'disabled:pointer-events-none data-[state=open]:bg-cork-100'
            )}
          >
            <Icon name="x" size="sm" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

// Modal header
interface ModalHeaderProps {
  children: ReactNode
  className?: string
}

function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>
      {children}
    </div>
  )
}

// Modal title
interface ModalTitleProps {
  children: ReactNode
  className?: string
}

function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-cork-800',
        className
      )}
    >
      {children}
    </DialogPrimitive.Title>
  )
}

// Modal description
interface ModalDescriptionProps {
  children: ReactNode
  className?: string
}

function ModalDescription({ children, className }: ModalDescriptionProps) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-cork-600', className)}
    >
      {children}
    </DialogPrimitive.Description>
  )
}

// Modal body
interface ModalBodyProps {
  children: ReactNode
  className?: string
}

function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('flex-1 py-4', className)}>
      {children}
    </div>
  )
}

// Modal footer
interface ModalFooterProps {
  children: ReactNode
  className?: string
  justify?: 'start' | 'center' | 'end' | 'between'
}

function ModalFooter({ children, className, justify = 'end' }: ModalFooterProps) {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={cn(
      'flex flex-col-reverse sm:flex-row sm:space-x-2',
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  )
}

// Modal close button
interface ModalCloseProps {
  children: ReactNode
  asChild?: boolean
  className?: string
}

function ModalClose({ children, asChild = false, className }: ModalCloseProps) {
  return (
    <DialogPrimitive.Close asChild={asChild} className={className}>
      {children}
    </DialogPrimitive.Close>
  )
}

// Compound component export
export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
}

// Example usage in comments:
/*
<Modal.Root size="lg">
  <Modal.Trigger asChild>
    <Button>Open Modal</Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Add New Book</Modal.Title>
      <Modal.Description>
        Enter book details to add to your reading list
      </Modal.Description>
    </Modal.Header>
    <Modal.Body>
      <BookForm />
    </Modal.Body>
    <Modal.Footer>
      <Modal.Close asChild>
        <Button variant="ghost">Cancel</Button>
      </Modal.Close>
      <Button type="submit">Add Book</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal.Root>
*/