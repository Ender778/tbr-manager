'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { AuthForm, FormField, Input } from './AuthForm'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validation/auth'
import { useAuthStore } from '@/stores/auth-store'
import { handleAuthError } from '@/lib/auth/errors'

export function ResetPasswordForm() {
  const router = useRouter()
  const { resetPassword } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null)
    setSuccess(null)
    
    const result = await resetPassword(data.email)
    
    if (result.success) {
      setSuccess('Password reset instructions have been sent to your email.')
    } else {
      setError(handleAuthError(result.error))
    }
  }

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter your email and we'll send you instructions"
      error={error}
      success={success}
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

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isSubmitting}
        >
          Send Reset Instructions
        </Button>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => router.push('/auth?tab=signin')}
            className="font-semibold text-cork-700 hover:text-cork-800 hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </form>
    </AuthForm>
  )
}