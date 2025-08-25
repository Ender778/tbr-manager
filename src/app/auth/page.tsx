'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SignInForm } from '@/components/auth/SignInForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { cn } from '@/lib/utils'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'signup') {
      setActiveTab('signup')
    } else {
      setActiveTab('signin')
    }
  }, [searchParams])

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

        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex border-b border-cork-200">
            <button
              onClick={() => setActiveTab('signin')}
              className={cn(
                'flex-1 py-3 px-4 text-sm font-medium transition-colors',
                activeTab === 'signin'
                  ? 'text-cork-700 border-b-2 border-cork-600'
                  : 'text-cork-500 hover:text-cork-700'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={cn(
                'flex-1 py-3 px-4 text-sm font-medium transition-colors',
                activeTab === 'signup'
                  ? 'text-cork-700 border-b-2 border-cork-600'
                  : 'text-cork-500 hover:text-cork-700'
              )}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'signin' ? (
              <SignInForm />
            ) : (
              <SignUpForm />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}