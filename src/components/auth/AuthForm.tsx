'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuthFormProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  error?: string | null
  success?: string | null
}

export function AuthForm({ 
  title, 
  subtitle, 
  children, 
  className,
  error,
  success
}: AuthFormProps) {
  return (
    <div className={cn('w-full max-w-md', className)}>
      <div className="space-y-1 text-center mb-6">
        <h2 className="text-2xl font-bold text-cork-800">
          {title}
        </h2>
        {subtitle && (
          <p className="text-cork-600">
            {subtitle}
          </p>
        )}
      </div>
      <div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800" role="alert">
            {success}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  htmlFor: string
  children: ReactNode
  error?: string
  required?: boolean
}

export function FormField({ 
  label, 
  htmlFor, 
  children, 
  error,
  required 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-cork-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-cork-900',
          'focus:outline-none focus:ring-2 focus:ring-cork-500 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-cork-300',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'