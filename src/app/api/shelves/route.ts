import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const shelfSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#8B4513'),
  icon: z.string().default('book'),
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
    const includeArchived = searchParams.get('includeArchived') === 'true'

    let query = supabase
      .from('shelves')
      .select(`
        *,
        book_positions (
          id,
          book_id,
          position,
          books (
            id,
            title,
            author,
            cover_url,
            status
          )
        )
      `)
      .eq('user_id', user.id)
      .order('position', { ascending: true })

    if (!includeArchived) {
      query = query.eq('is_archived', false)
    }

    const { data: shelves, error } = await query

    if (error) {
      console.error('Error fetching shelves:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch shelves' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: shelves || [],
    })
  } catch (error) {
    console.error('Shelves API error:', error)
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
    const validatedData = shelfSchema.parse(body)

    // Get the next position
    const { data: existingShelves, error: countError } = await supabase
      .from('shelves')
      .select('position')
      .eq('user_id', user.id)
      .order('position', { ascending: false })
      .limit(1)

    if (countError) {
      console.error('Error counting shelves:', countError)
      return NextResponse.json(
        { success: false, error: 'Failed to create shelf' },
        { status: 500 }
      )
    }

    const maxPosition = existingShelves && existingShelves.length > 0 
      ? existingShelves[0].position 
      : -1

    const { data: shelf, error } = await supabase
      .from('shelves')
      .insert([{
        ...validatedData,
        position: maxPosition + 1,
        user_id: user.id,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating shelf:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create shelf' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: shelf,
    })
  } catch (error) {
    console.error('Create shelf error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid shelf data',
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