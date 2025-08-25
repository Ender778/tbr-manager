'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { AuthForm, FormField, Input } from './AuthForm'
import { signUpSchema, type SignUpFormData } from '@/lib/validation/auth'
import { useAuthStore } from '@/stores/auth-store'
import { handleAuthError } from '@/lib/auth/errors'

interface SignUpFormProps {
  onSuccess?: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const router = useRouter()
  const { signUp } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const password = watch('password')

  const getPasswordStrength = (password: string = '') => {
    let strength = 0
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++
    
    return {
      score: strength,
      label: strength <= 2 ? 'Weak' : strength <= 3 ? 'Fair' : strength <= 4 ? 'Good' : 'Strong',
      color: strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-orange-500' : strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
    }
  }

  const passwordStrength = getPasswordStrength(password)

  const onSubmit = async (data: SignUpFormData) => {
    setError(null)
    setSuccess(null)
    
    const result = await signUp(data.email, data.password, data.displayName)
    
    if (result.success) {
      setSuccess('Account created successfully! Please check your email to verify your account.')
      onSuccess?.()
      setTimeout(() => {
        router.push('/auth?tab=signin')
      }, 3000)
    } else {
      setError(handleAuthError(result.error))
    }
  }

  return (
    <AuthForm
      title="Create an account"
      subtitle="Start organizing your reading list"
      error={error}
      success={success}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Display Name"
          htmlFor="displayName"
          error={errors.displayName?.message}
        >
          <Input
            id="displayName"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            error={!!errors.displayName}
            {...register('displayName')}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={!!errors.password}
            onFocus={() => setShowPasswordStrength(true)}
            {...register('password')}
          />
          {showPasswordStrength && password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i <= passwordStrength.score
                        ? passwordStrength.color
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-cork-600">
                Password strength: {passwordStrength.label}
              </p>
            </div>
          )}
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
          required
        >
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <div className="text-xs text-cork-600">
          By signing up, you agree to our{' '}
          <a href="/terms" className="underline hover:text-cork-700">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-cork-700">
            Privacy Policy
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>

        <div className="text-center text-sm">
          <span className="text-cork-600">Already have an account? </span>
          <button
            type="button"
            onClick={() => router.push('/auth?tab=signin')}
            className="font-semibold text-cork-700 hover:text-cork-800 hover:underline"
          >
            Sign in
          </button>
        </div>
      </form>
    </AuthForm>
  )
}