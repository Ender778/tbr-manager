import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/database/client'
import { z } from 'zod'

const moveBookSchema = z.object({
  bookId: z.string().uuid(),
  fromShelfId: z.string().uuid(),
  toShelfId: z.string().uuid(),
  position: z.number().int().min(0),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = moveBookSchema.parse(body)

    const { bookId, fromShelfId, toShelfId, position } = validatedData

    // Check if book exists and belongs to user, and get target shelf info
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id, status, date_started')
      .eq('id', bookId)
      .eq('user_id', user.id)
      .single()

    if (bookError || !book) {
      return NextResponse.json({
        success: false,
        error: 'Book not found or access denied'
      }, { status: 404 })
    }

    // Get target shelf to determine new book status
    const { data: targetShelf, error: shelfError } = await supabase
      .from('shelves')
      .select('id, name')
      .eq('id', toShelfId)
      .eq('user_id', user.id)
      .single()

    if (shelfError || !targetShelf) {
      return NextResponse.json({ 
        success: false, 
        error: 'Target shelf not found' 
      }, { status: 404 })
    }

    // Determine new status based on shelf name
    const shelfToStatus: Record<string, string> = {
      'Currently Reading': 'reading', 
      'To Be Read': 'tbr',
      'Completed': 'completed',
      'Did Not Finish': 'dnf',
      'Archived': 'archived'
    }
    
    const newStatus = shelfToStatus[targetShelf.name] || book.status

    // Get current position of the book being moved
    const { data: currentPosition, error: currentPosError } = await supabase
      .from('book_positions')
      .select('position, shelf_id')
      .eq('book_id', bookId)
      .eq('user_id', user.id)
      .single()

    if (currentPosError) {
      console.error('Error getting current position:', currentPosError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to get current book position' 
      }, { status: 500 })
    }

    // Use database function to atomically handle position updates
    const { data: moveResult, error: updateError } = await supabase.rpc('move_book_position', {
      p_book_id: bookId,
      p_user_id: user.id,
      p_from_shelf_id: fromShelfId,
      p_to_shelf_id: toShelfId,
      p_new_position: position,
      p_current_position: currentPosition.position
    })

    if (updateError) {
      console.error('Error updating book position:', updateError)
      return NextResponse.json({ 
        success: false, 
        error: updateError.message || 'Failed to move book' 
      }, { status: 500 })
    }

    // Check if the function returned an error
    if (moveResult?.error) {
      console.error('Database function returned error:', moveResult)
      return NextResponse.json({ 
        success: false, 
        error: moveResult.message || 'Database operation failed' 
      }, { status: 500 })
    }

    const updatedPosition = moveResult

    // Update book status if it changed
    let updatedBook = null
    if (newStatus !== book.status) {
      const bookUpdate: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // Auto-fill date_started when moved to 'reading' status for the first time
      if (newStatus === 'reading' && !book.date_started) {
        bookUpdate.date_started = new Date().toISOString().split('T')[0]
      }

      // Set completion date if moving to completed
      if (newStatus === 'completed') {
        bookUpdate.date_completed = new Date().toISOString().split('T')[0]
      }
      // Clear completion date if moving away from completed
      else if (book.status === 'completed' && newStatus !== 'completed') {
        bookUpdate.date_completed = null
      }

      const { data, error: bookUpdateError } = await supabase
        .from('books')
        .update(bookUpdate)
        .eq('id', bookId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (bookUpdateError) {
        console.error('Error updating book status:', bookUpdateError)
        return NextResponse.json({
          success: false,
          error: bookUpdateError.message || 'Failed to update book status'
        }, { status: 500 })
      }

      updatedBook = data
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        position: updatedPosition,
        book: updatedBook
      },
      message: 'Book moved successfully'
    })

  } catch (error) {
    console.error('Error in move book API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request data',
        details: error.issues 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}