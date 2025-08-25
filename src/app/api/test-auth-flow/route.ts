import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const results = {
      timestamp: new Date().toISOString(),
      authFlow: {
        sessionCheck: false,
        userCheck: false,
        authStateCheck: false,
      },
      user: null as any,
      session: null as any,
      error: null as any,
    }

    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      results.error = sessionError
    } else {
      results.authFlow.sessionCheck = true
      results.session = session ? {
        access_token: session.access_token ? 'present' : 'missing',
        refresh_token: session.refresh_token ? 'present' : 'missing',
        expires_at: session.expires_at,
        user_id: session.user?.id,
      } : null
    }

    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      results.error = userError
    } else {
      results.authFlow.userCheck = true
      results.user = user ? {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        user_metadata: user.user_metadata,
      } : null
    }

    // Check auth state
    results.authFlow.authStateCheck = !!session && !!user

    return NextResponse.json({
      success: true,
      message: 'Auth flow test completed',
      results,
      recommendations: {
        hasValidSession: !!session,
        hasValidUser: !!user,
        isAuthenticated: !!session && !!user,
        nextSteps: !session || !user 
          ? 'User needs to authenticate at /auth' 
          : 'User is authenticated and can access protected routes',
      }
    })
  } catch (error) {
    console.error('Auth flow test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}