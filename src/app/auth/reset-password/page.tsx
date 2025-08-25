'use client'

import React from 'react'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cork-50 to-cork-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-cork-800 mb-2">
            TBR Manager
          </h1>
          <p className="text-cork-600">
            Your personal reading list organizer
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  )
}