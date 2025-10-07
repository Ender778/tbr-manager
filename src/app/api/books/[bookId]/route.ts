import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Schema for book updates (all fields optional)
const updateBookSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  published_date: z.string().optional(),
  isbn: z.string().optional(),
  page_count: z.number().optional(),
  cover_url: z.string().url().optional(),
  description: z.string().optional(),
  status: z.enum(['tbr', 'reading', 'completed', 'dnf', 'archived']).optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  personal_notes: z.string().nullable().optional(),
  date_added: z.string().nullable().optional(),
  date_started: z.string().nullable().optional(),
  date_completed: z.string().nullable().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params

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
    const validatedData = updateBookSchema.parse(body)

    // Verify book belongs to user and update it
    const { data: book, error: updateError } = await supabase
      .from('books')
      .update(validatedData)
      .eq('id', bookId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating book:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update book' },
        { status: 500 }
      )
    }

    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: book,
    })
  } catch (error) {
    console.error('Update book error:', error)

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params

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

    // Delete book (cascade will handle book_positions)
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting book:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete book' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
    })
  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
