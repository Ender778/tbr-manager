import { z } from 'zod'

// Book validation schemas
export const bookSchema = z.object({
  isbn: z.string().regex(/^(?:\d{10}|\d{13})$/).optional().nullable(),
  title: z.string().min(1, 'Title is required').max(500).trim(),
  subtitle: z.string().max(500).optional().nullable(),
  author: z.string().min(1, 'Author is required').max(200).trim(),
  publisher: z.string().max(200).optional().nullable(),
  published_date: z.string().optional().nullable(),
  page_count: z.number().min(1).max(10000).optional().nullable(),
  language: z.string().length(2).default('en'),
  cover_url: z.string().url().optional().nullable(),
  cover_thumbnail_url: z.string().url().optional().nullable(),
  google_books_id: z.string().optional().nullable(),
  open_library_id: z.string().optional().nullable(),
  status: z.enum(['tbr', 'reading', 'completed', 'dnf', 'archived']).default('tbr'),
  rating: z.number().min(1).max(5).optional().nullable(),
  personal_notes: z.string().max(5000).optional().nullable(),
})

export const bookUpdateSchema = bookSchema.partial()

// Shelf validation schemas
export const shelfSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  description: z.string().max(500).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#8B4513'),
  icon: z.string().max(50).default('book'),
  position: z.number().min(0).optional(),
  is_archived: z.boolean().default(false),
})

export const shelfUpdateSchema = shelfSchema.partial()

// Book position validation
export const bookPositionSchema = z.object({
  book_id: z.string().uuid(),
  shelf_id: z.string().uuid(),
  position: z.number().min(0),
  master_position: z.number().min(0).optional().nullable(),
  year_completed: z.number().min(1900).max(2100).optional().nullable(),
})

// Tag validation schemas
export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50).trim(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#6B7280'),
})

// Reading session validation
export const readingSessionSchema = z.object({
  book_id: z.string().uuid(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional().nullable(),
  pages_read: z.number().min(0).max(1000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

// User preferences validation
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  default_view: z.enum(['cork-board', 'list', 'grid']).default('cork-board'),
  books_per_page: z.number().min(10).max(200).default(50),
  show_archived: z.boolean().default(false),
  enable_notifications: z.boolean().default(true),
  reading_goal_annual: z.number().min(1).max(1000).optional().nullable(),
})

// Search validation
export const searchQuerySchema = z.object({
  query: z.string().min(1).max(200).trim(),
  filter_by: z.enum(['title', 'author', 'isbn', 'all']).optional(),
  status: z.enum(['tbr', 'reading', 'completed', 'dnf', 'archived', 'all']).optional(),
  tags: z.array(z.string().uuid()).optional(),
  sort_by: z.enum(['title', 'author', 'date_added', 'date_completed', 'rating']).optional(),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// Bulk import validation
export const bulkImportSchema = z.object({
  books: z.array(bookSchema).min(1).max(100),
  shelf_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
})

// Type exports
export type BookFormData = z.infer<typeof bookSchema>
export type BookUpdateData = z.infer<typeof bookUpdateSchema>
export type ShelfFormData = z.infer<typeof shelfSchema>
export type ShelfUpdateData = z.infer<typeof shelfUpdateSchema>
export type BookPositionData = z.infer<typeof bookPositionSchema>
export type TagFormData = z.infer<typeof tagSchema>
export type ReadingSessionData = z.infer<typeof readingSessionSchema>
export type UserPreferencesData = z.infer<typeof userPreferencesSchema>
export type SearchQueryData = z.infer<typeof searchQuerySchema>
export type BulkImportData = z.infer<typeof bulkImportSchema>