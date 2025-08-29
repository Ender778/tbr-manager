import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { bookSchema } from '@/lib/validation/book'
import { z } from 'zod'

const createBookSchema = bookSchema.extend({
  shelfId: z.string().uuid().optional(), // Optional shelf to add to (not stored in books table)
})

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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const shelfId = searchParams.get('shelfId')

    let query = supabase
      .from('books')
      .select(`
        *,
        book_positions (
          id,
          shelf_id,
          position,
          shelves (
            id,
            name,
            color
          )
        )
      `)
      .eq('user_id', user.id)
      .order('date_added', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (shelfId) {
      query = query.eq('book_positions.shelf_id', shelfId)
    }

    const { data: books, error } = await query

    if (error) {
      console.error('Error fetching books:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch books' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: books || [],
    })
  } catch (error) {
    console.error('Books API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const validatedData = createBookSchema.parse(body)

    // Extract shelfId and remove it from book data
    const { shelfId, ...bookData } = validatedData

    // Create the book without shelfId
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert([{
        ...bookData,
        user_id: user.id,
      }])
      .select()
      .single()

    if (bookError) {
      console.error('Error creating book:', bookError)
      return NextResponse.json(
        { success: false, error: 'Failed to create book' },
        { status: 500 }
      )
    }

    // Add to shelf if specified
    if (shelfId) {
      // Get current max position for this shelf
      const { data: positions, error: posError } = await supabase
        .from('book_positions')
        .select('position')
        .eq('shelf_id', shelfId)
        .eq('user_id', user.id)
        .order('position', { ascending: false })
        .limit(1)

      if (posError) {
        console.error('Error getting shelf positions:', posError)
        // Continue without adding to shelf
      } else {
        const maxPosition = positions && positions.length > 0 ? positions[0].position : -1
        
        const { data: positionData, error: positionError } = await supabase
          .from('book_positions')
          .insert([{
            book_id: book.id,
            shelf_id: shelfId,
            position: maxPosition + 1,
            user_id: user.id,
          }])
          .select()

        if (positionError) {
          console.error('Error adding book to shelf:', positionError)
          // Continue without adding to shelf
        } else {
          console.log('Successfully created book position:', positionData)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: book,
    })
  } catch (error) {
    console.error('Create book error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid book data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}