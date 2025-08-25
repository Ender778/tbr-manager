'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Container, Section } from '@/components/ui/layout'
import { Heading1, Text } from '@/components/ui/Typography'
import { Button } from '@/components/ui/Button'

export default function TestDatabasePage() {
  const [status, setStatus] = useState<string>('Checking...')
  const [user, setUser] = useState<any>(null)
  const [shelves, setShelves] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    try {
      const supabase = createClient()
      
      // Check auth status
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Test database connection
      const healthResponse = await fetch('/api/health')
      const healthData = await healthResponse.json()
      
      if (healthData.status === 'healthy') {
        setStatus('✅ Database Connected')
        
        // If user is logged in, fetch their shelves
        if (user) {
          const { data: shelvesData, error: shelvesError } = await supabase
            .from('shelves')
            .select('*')
            .order('position')
          
          if (shelvesError) {
            setError(`Shelves error: ${shelvesError.message}`)
          } else {
            setShelves(shelvesData || [])
          }
        }
      } else {
        setStatus('❌ Database Connection Failed')
        setError(healthData.error)
      }
    } catch (err) {
      setStatus('❌ Error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const signInTestUser = async () => {
    setError(null)
    setStatus('Creating test user...')
    
    try {
      // Use service role endpoint to create user
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Failed to create test user')
        setStatus('❌ Error')
        return
      }
      
      // Now sign in with the created credentials
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })
      
      if (signInError) {
        setError(`User created but sign in failed: ${signInError.message}`)
        setStatus('⚠️ Sign In Failed')
        console.log('Created user credentials:', { email: data.email, password: data.password })
      } else {
        setStatus('✅ Test user created and signed in!')
        console.log('Successfully signed in as:', data.email)
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('❌ Error')
    }
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <Container>
      <Section spacing="lg">
        <Heading1>Database Test Page</Heading1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <Text className="font-semibold">Connection Status:</Text>
            <Text>{status}</Text>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <Text className="font-semibold">User Status:</Text>
            <Text>{user ? `Logged in as: ${user.email}` : 'Not logged in'}</Text>
          </div>
          
          {user && shelves.length > 0 && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <Text className="font-semibold">Your Shelves:</Text>
              <ul className="list-disc list-inside mt-2">
                {shelves.map(shelf => (
                  <li key={shelf.id}>
                    {shelf.name} (Position: {shelf.position}, Default: {shelf.is_default ? 'Yes' : 'No'})
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-100 rounded-lg">
              <Text className="text-red-600">Error: {error}</Text>
              {error.includes('email confirmation') && (
                <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <Text className="font-semibold text-yellow-800 mb-2">To disable email confirmation for testing:</Text>
                  <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                    <li>Go to your Supabase Dashboard</li>
                    <li>Navigate to Authentication → Providers → Email</li>
                    <li>Toggle OFF "Confirm email"</li>
                    <li>Save changes and try again</li>
                  </ol>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-4">
            {!user ? (
              <Button onClick={signInTestUser}>
                Sign In Test User
              </Button>
            ) : (
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            )}
            <Button onClick={checkDatabase} variant="secondary">
              Refresh Status
            </Button>
          </div>
        </div>
      </Section>
    </Container>
  )
}