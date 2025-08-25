export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          isbn: string | null
          title: string
          subtitle: string | null
          author: string
          publisher: string | null
          published_date: string | null
          page_count: number | null
          language: string
          cover_url: string | null
          cover_thumbnail_url: string | null
          google_books_id: string | null
          open_library_id: string | null
          status: 'tbr' | 'reading' | 'completed' | 'dnf' | 'archived'
          rating: number | null
          personal_notes: string | null
          date_added: string
          date_started: string | null
          date_completed: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          isbn?: string | null
          title: string
          subtitle?: string | null
          author: string
          publisher?: string | null
          published_date?: string | null
          page_count?: number | null
          language?: string
          cover_url?: string | null
          cover_thumbnail_url?: string | null
          google_books_id?: string | null
          open_library_id?: string | null
          status?: 'tbr' | 'reading' | 'completed' | 'dnf' | 'archived'
          rating?: number | null
          personal_notes?: string | null
          date_added?: string
          date_started?: string | null
          date_completed?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          isbn?: string | null
          title?: string
          subtitle?: string | null
          author?: string
          publisher?: string | null
          published_date?: string | null
          page_count?: number | null
          language?: string
          cover_url?: string | null
          cover_thumbnail_url?: string | null
          google_books_id?: string | null
          open_library_id?: string | null
          status?: 'tbr' | 'reading' | 'completed' | 'dnf' | 'archived'
          rating?: number | null
          personal_notes?: string | null
          date_added?: string
          date_started?: string | null
          date_completed?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      shelves: {
        Row: {
          id: string
          name: string
          description: string | null
          position: number
          color: string
          icon: string
          is_default: boolean
          is_archived: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          position?: number
          color?: string
          icon?: string
          is_default?: boolean
          is_archived?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          position?: number
          color?: string
          icon?: string
          is_default?: boolean
          is_archived?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      book_positions: {
        Row: {
          id: string
          book_id: string
          shelf_id: string
          position: number
          master_position: number | null
          year_completed: number | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          shelf_id: string
          position?: number
          master_position?: number | null
          year_completed?: number | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          shelf_id?: string
          position?: number
          master_position?: number | null
          year_completed?: number | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          user_id?: string
          created_at?: string
        }
      }
      book_tags: {
        Row: {
          book_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          book_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          book_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      reading_sessions: {
        Row: {
          id: string
          book_id: string
          start_time: string
          end_time: string | null
          pages_read: number | null
          notes: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          start_time?: string
          end_time?: string | null
          pages_read?: number | null
          notes?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          start_time?: string
          end_time?: string | null
          pages_read?: number | null
          notes?: string | null
          user_id?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme: 'light' | 'dark' | 'auto'
          default_view: 'cork-board' | 'list' | 'grid'
          books_per_page: number
          show_archived: boolean
          enable_notifications: boolean
          reading_goal_annual: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: 'light' | 'dark' | 'auto'
          default_view?: 'cork-board' | 'list' | 'grid'
          books_per_page?: number
          show_archived?: boolean
          enable_notifications?: boolean
          reading_goal_annual?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: 'light' | 'dark' | 'auto'
          default_view?: 'cork-board' | 'list' | 'grid'
          books_per_page?: number
          show_archived?: boolean
          enable_notifications?: boolean
          reading_goal_annual?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use
export type Book = Database['public']['Tables']['books']['Row']
export type BookInsert = Database['public']['Tables']['books']['Insert']
export type BookUpdate = Database['public']['Tables']['books']['Update']

export type Shelf = Database['public']['Tables']['shelves']['Row']
export type ShelfInsert = Database['public']['Tables']['shelves']['Insert']
export type ShelfUpdate = Database['public']['Tables']['shelves']['Update']

export type BookPosition = Database['public']['Tables']['book_positions']['Row']
export type BookPositionInsert = Database['public']['Tables']['book_positions']['Insert']
export type BookPositionUpdate = Database['public']['Tables']['book_positions']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type TagUpdate = Database['public']['Tables']['tags']['Update']

export type BookTag = Database['public']['Tables']['book_tags']['Row']
export type BookTagInsert = Database['public']['Tables']['book_tags']['Insert']

export type ReadingSession = Database['public']['Tables']['reading_sessions']['Row']
export type ReadingSessionInsert = Database['public']['Tables']['reading_sessions']['Insert']
export type ReadingSessionUpdate = Database['public']['Tables']['reading_sessions']['Update']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

export type BookStatus = 'tbr' | 'reading' | 'completed' | 'dnf' | 'archived'
export type Theme = 'light' | 'dark' | 'auto'
export type DefaultView = 'cork-board' | 'list' | 'grid'