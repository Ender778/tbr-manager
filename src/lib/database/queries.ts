/**
 * Type-safe database query functions with proper field mapping
 * These functions ensure we always use the correct database schema field names
 */

import { getSupabaseClient } from './client'
import type { Book, Shelf, BookPosition } from '@/types/book'
import type { BookInsert, ShelfInsert, BookPositionInsert } from '@/types/database.types'

// Book queries
export async function getUserBooks(userId: string, status?: string): Promise<Book[]> {
  const supabase = await getSupabaseClient()
  
  let query = supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('date_added', { ascending: false })
    
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching books:', error)
    throw new Error('Failed to fetch books')
  }
  
  return data || []
}

export async function createBook(bookData: BookInsert): Promise<Book> {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase
    .from('books')
    .insert([bookData])
    .select()
    .single()
    
  if (error) {
    console.error('Error creating book:', error)
    throw new Error('Failed to create book')
  }
  
  return data
}

export async function updateBook(bookId: string, updates: Partial<BookInsert>): Promise<Book> {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', bookId)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating book:', error)
    throw new Error('Failed to update book')
  }
  
  return data
}

// Shelf queries
export async function getUserShelves(userId: string): Promise<Shelf[]> {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase
    .from('shelves')
    .select(`
      *,
      book_positions (
        id,
        book_id,
        position,
        master_position,
        year_completed,
        books (
          id,
          title,
          author,
          cover_url,
          status
        )
      )
    `)
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('position', { ascending: true })
    
  if (error) {
    console.error('Error fetching shelves:', error)
    throw new Error('Failed to fetch shelves')
  }
  
  return data || []
}

export async function createShelf(shelfData: ShelfInsert): Promise<Shelf> {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase
    .from('shelves')
    .insert([shelfData])
    .select()
    .single()
    
  if (error) {
    console.error('Error creating shelf:', error)
    throw new Error('Failed to create shelf')
  }
  
  return data
}

// Book position queries
export async function createBookPosition(positionData: BookPositionInsert): Promise<BookPosition> {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase
    .from('book_positions')
    .insert([positionData])
    .select()
    .single()
    
  if (error) {
    console.error('Error creating book position:', error)
    throw new Error('Failed to create book position')
  }
  
  return data
}

export async function updateBookPosition(
  bookId: string, 
  shelfId: string, 
  position: number,
  userId: string
): Promise<BookPosition> {
  const supabase = await getSupabaseClient()
  
  // First, try to find existing position
  const { data: existingPosition } = await supabase
    .from('book_positions')
    .select('*')
    .eq('book_id', bookId)
    .eq('user_id', userId)
    .single()
    
  if (existingPosition) {
    // Update existing position
    const { data, error } = await supabase
      .from('book_positions')
      .update({
        shelf_id: shelfId,
        position: position,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingPosition.id)
      .select()
      .single()
      
    if (error) {
      console.error('Error updating book position:', error)
      throw new Error('Failed to update book position')
    }
    
    return data
  } else {
    // Create new position
    return createBookPosition({
      book_id: bookId,
      shelf_id: shelfId,
      position: position,
      user_id: userId
    })
  }
}

export async function getBookPositions(userId: string): Promise<BookPosition[]> {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase
    .from('book_positions')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
    
  if (error) {
    console.error('Error fetching book positions:', error)
    throw new Error('Failed to fetch book positions')
  }
  
  return data || []
}

// Combined queries for efficient data loading
export async function getDashboardData(userId: string) {
  const supabase = await getSupabaseClient()
  
  // Load shelves and books in parallel
  const [shelvesResponse, booksResponse] = await Promise.all([
    supabase
      .from('shelves')
      .select(`
        *,
        book_positions (
          id,
          book_id,
          position,
          master_position,
          year_completed
        )
      `)
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('position', { ascending: true }),
      
    supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('date_added', { ascending: false })
  ])
  
  if (shelvesResponse.error) {
    console.error('Error fetching shelves:', shelvesResponse.error)
    throw new Error('Failed to fetch shelves')
  }
  
  if (booksResponse.error) {
    console.error('Error fetching books:', booksResponse.error)
    throw new Error('Failed to fetch books')
  }
  
  // Extract book positions from shelves
  const bookPositions: BookPosition[] = []
  shelvesResponse.data?.forEach((shelf: any) => {
    if (shelf.book_positions) {
      bookPositions.push(...shelf.book_positions.map((pos: any) => ({
        id: pos.id,
        book_id: pos.book_id,
        shelf_id: shelf.id,
        position: pos.position,
        master_position: pos.master_position,
        year_completed: pos.year_completed,
        user_id: userId,
        created_at: pos.created_at || new Date().toISOString(),
        updated_at: pos.updated_at || new Date().toISOString(),
      })))
    }
  })
  
  return {
    shelves: shelvesResponse.data || [],
    books: booksResponse.data || [],
    bookPositions
  }
}