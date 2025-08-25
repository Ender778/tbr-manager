'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Typography } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

interface UserProfileProps {
  className?: string
}

export function UserProfile({ className }: UserProfileProps) {
  const router = useRouter()
  const { user, signOut, isLoading } = useAuthStore()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.push('/auth')
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
  const email = user.email || ''
  const avatarUrl = user.user_metadata?.avatar_url
  const bio = user.user_metadata?.bio

  return (
    <Card variant="elevated" className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover border-4 border-cork-200"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-cork-200 flex items-center justify-center border-4 border-cork-300">
              <span className="text-3xl font-bold text-cork-600">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <Typography variant="h3" className="text-xl font-bold">
          {displayName}
        </Typography>
        <Typography variant="body" className="text-cork-600">
          {email}
        </Typography>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {bio && (
          <div className="p-3 bg-cork-50 rounded-lg">
            <Typography variant="body" className="text-cork-700">
              {bio}
            </Typography>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cork-200">
          <div className="text-center">
            <Typography variant="h4" className="text-2xl font-bold text-cork-700">
              0
            </Typography>
            <Typography variant="caption" className="text-cork-600">
              Books Read
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h4" className="text-2xl font-bold text-cork-700">
              0
            </Typography>
            <Typography variant="caption" className="text-cork-600">
              To Be Read
            </Typography>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => router.push('/profile/edit')}
          >
            Edit Profile
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
            isLoading={isSigningOut || isLoading}
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({ size = 'md', className }: UserAvatarProps) {
  const { user } = useAuthStore()

  if (!user) {
    return null
  }

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  }

  return (
    <div className={cn('relative', className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className={cn(
            'rounded-full object-cover border-2 border-cork-200',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-cork-200 flex items-center justify-center border-2 border-cork-300',
            sizeClasses[size]
          )}
        >
          <span className="font-bold text-cork-600">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}