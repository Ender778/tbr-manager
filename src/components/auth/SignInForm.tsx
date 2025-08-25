'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { AuthForm, FormField, Input } from './AuthForm'
import { signInSchema, type SignInFormData } from '@/lib/validation/auth'
import { useAuthStore } from '@/stores/auth-store'
import { handleAuthError } from '@/lib/auth/errors'

interface SignInFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function SignInForm({ onSuccess, redirectTo = '/dashboard' }: SignInFormProps) {
  const router = useRouter()
  const { signIn } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    setError(null)
    
    const result = await signIn(data.email, data.password)
    
    if (result.success) {
      onSuccess?.()
      router.push(redirectTo)
    } else {
      setError(handleAuthError(result.error))
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to your account"
      error={error}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            autoComplete="current-password"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/auth/reset-password')}
            className="text-sm text-cork-600 hover:text-cork-700 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>

        <div className="text-center text-sm">
          <span className="text-cork-600">Don't have an account? </span>
          <button
            type="button"
            onClick={() => router.push('/auth?tab=signup')}
            className="font-semibold text-cork-700 hover:text-cork-800 hover:underline"
          >
            Sign up
          </button>
        </div>
      </form>
    </AuthForm>
  )
}