import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all book positions for the user
    const { data: positions, error: posError } = await supabase
      .from('book_positions')
      .select('*')
      .eq('user_id', user.id)

    // Get all books for the user  
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)

    // Get all shelves for the user
    const { data: shelves, error: shelvesError } = await supabase
      .from('shelves')
      .select('*')
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      data: {
        positions: positions || [],
        books: books || [],
        shelves: shelves || [],
        positionsCount: positions?.length || 0,
        booksCount: books?.length || 0,
        shelvesCount: shelves?.length || 0,
      },
      errors: {
        posError,
        booksError, 
        shelvesError
      }
    })
  } catch (error) {
    console.error('Debug positions error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}