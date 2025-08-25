import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServiceRoleClient()
    
    // Test 1: Check if we can query the auth.users table
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1)
    
    // Test 2: Check if we can query shelves table
    const { data: shelves, error: shelvesError } = await supabase
      .from('shelves')
      .select('id')
      .limit(1)
    
    // Test 3: Check if we can query user_preferences table
    const { data: prefs, error: prefsError } = await supabase
      .from('user_preferences')
      .select('user_id')
      .limit(1)
    
    // Test 4: Try to list auth users using admin API
    let authTest = { success: false, error: null as any }
    try {
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1
      })
      authTest = { success: !authError, error: authError }
    } catch (e) {
      authTest = { success: false, error: e }
    }
    
    return NextResponse.json({
      database_connection: {
        shelves_table: !shelvesError ? '✅ OK' : `❌ ${shelvesError.message}`,
        user_preferences_table: !prefsError ? '✅ OK' : `❌ ${prefsError?.message || 'Table might not exist'}`,
      },
      auth_system: {
        admin_api: authTest.success ? '✅ OK' : `❌ ${authTest.error?.message || 'Admin API not accessible'}`,
        service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '❌ Missing',
      },
      possible_issues: [
        'If auth.users is not accessible, the trigger might be the issue',
        'If admin API fails, check service role key',
        'Run migration 002_fix_auth_trigger.sql to fix permissions'
      ]
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}