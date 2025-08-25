import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const serviceRole = await createServiceRoleClient()
    
    // Generate test user credentials
    const timestamp = Date.now()
    const testEmail = `test_${timestamp}@example.com`
    const testPassword = 'testpassword123'
    
    // First, try to create the user with Supabase Auth
    // Using signUp with Admin API to bypass email confirmation
    const { data: authData, error: authError } = await serviceRole.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        test_user: true,
        created_at: new Date().toISOString()
      }
    })
    
    if (authError) {
      console.error('Auth creation error:', authError)
      return NextResponse.json({ 
        error: `Failed to create auth user: ${authError.message}`,
        details: authError
      }, { status: 500 })
    }
    
    if (!authData.user) {
      return NextResponse.json({ 
        error: 'No user data returned' 
      }, { status: 500 })
    }
    
    // Manually create default shelves (in case trigger fails)
    const { error: shelvesError } = await serviceRole
      .from('shelves')
      .insert([
        { user_id: authData.user.id, name: 'To Be Read', position: 0, is_default: true, color: '#8B4513', icon: 'book' },
        { user_id: authData.user.id, name: 'Currently Reading', position: 1, is_default: true, color: '#059669', icon: 'book-open' },
        { user_id: authData.user.id, name: 'Completed', position: 2, is_default: true, color: '#6B7280', icon: 'check' },
        { user_id: authData.user.id, name: 'Did Not Finish', position: 3, is_default: true, color: '#EF4444', icon: 'x' }
      ])
    
    if (shelvesError) {
      console.warn('Failed to create shelves:', shelvesError)
    }
    
    // Create user preferences
    const { error: prefsError } = await serviceRole
      .from('user_preferences')
      .insert({ user_id: authData.user.id })
    
    if (prefsError) {
      console.warn('Failed to create preferences:', prefsError)
    }
    
    return NextResponse.json({ 
      success: true,
      email: testEmail,
      password: testPassword,
      userId: authData.user.id,
      message: 'Test user created successfully! Use these credentials to sign in.'
    })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}