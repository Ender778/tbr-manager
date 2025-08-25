# Book TBR (To Be Read) List Application

## Project Overview
A visual, interactive book management system designed to organize and track reading lists with a cork board aesthetic and intuitive drag-and-drop functionality.

## Core Requirements

### Visual Design
- **Cork Board Interface**: Main screen designed to look like a cork board where book covers are "pinned" like notes
- **Book Cover Display**: Primary interface uses book cover images instead of text titles
- **Visual Priority**: Book covers are essential since many titles sound similar within same genres

### Interaction & Organization
- **Drag and Drop**: Mouse-based drag and drop to easily reorder book covers
- **Multiple Shelves/Categories**: Support for different TBR categories including:
  - On hold at library
  - Waiting for more books in series
  - Discworld books remaining
  - Cozy books
  - Romance
  - Romantasy
  - Fantasy
  - Physical books owned
  - Custom categories as needed

### List Management
- **Multiple Lists**: Separate categorized lists (shelves)
- **Master Order List**: One overall master list that maintains universal reading order
- **Flexible Organization**: Multiple columns/rows/sections/pages/"shelves"
- **Easy Reordering**: Quick reorganization since reading priorities change frequently

### Data Entry & Tracking
- **Simplified Book Input**: Streamlined process for adding books (high volume usage)
- **Completed Books Archive**: View lists of completed books organized by year

## Recommended Tech Stack

### Core Framework
**Next.js** (Preferred over plain React)

#### Why Next.js:
- **Image Optimization**: Built-in `next/image` component for efficient handling of hundreds of book covers with lazy loading
- **API Routes**: Backend endpoints for fetching book data from external APIs without CORS issues
- **Performance**: Automatic code splitting for image-heavy applications
- **ISR/SSG**: Pre-rendering options for improved performance

### Essential Libraries

#### Drag & Drop
- **Primary**: `@dnd-kit/sortable` - Modern, accessible, performant drag-and-drop
- **Alternative**: `react-beautiful-dnd` - Older but very stable

#### Layout & Animation
- **Layout**: `react-grid-layout` or CSS Grid for cork board effect
- **Animation**: `framer-motion` for smooth book movement animations
- **Styling**: Tailwind CSS

#### Book Data & Covers
- **APIs**: 
  - Google Books API
  - Open Library API
- **Image Handling**: Automatic cover fetching and caching

#### UI Components
- **Component Library**: `shadcn/ui` for customizable components
- **Notifications**: `react-hot-toast`
- **Icons**: `lucide-react`

### Backend & Database
**Supabase** (Already configured)

## Database Schema

```sql
-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isbn TEXT,
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  google_books_id TEXT,
  open_library_id TEXT,
  status TEXT DEFAULT 'tbr',
  date_added TIMESTAMP DEFAULT NOW(),
  date_completed TIMESTAMP,
  user_id UUID REFERENCES auth.users(id)
);

-- Shelves/Categories table
CREATE TABLE shelves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position INTEGER,
  color TEXT,
  icon TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Book positions for drag & drop persistence
CREATE TABLE book_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  shelf_id UUID REFERENCES shelves(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  master_position INTEGER,
  year_completed INTEGER,
  user_id UUID REFERENCES auth.users(id),
  UNIQUE(book_id, shelf_id)
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  default_view TEXT DEFAULT 'cork_board',
  cork_board_columns INTEGER DEFAULT 5,
  theme TEXT DEFAULT 'light'
);
```

## Key Features Implementation

### Cork Board Aesthetic
- Cork texture background (CSS or subtle image)
- Slight random rotation on book covers (-3° to +3°)
- Drop shadows for depth effect
- "Push pin" graphics on book corners
- Hover effects for interactivity

### Quick Book Input Methods
1. **Search with Autocomplete**: Real-time search using Google Books/Open Library
2. **ISBN Scanner**: Mobile barcode scanning capability
3. **URL Parser**: Paste Goodreads/Amazon links for automatic import
4. **Bulk Import**: CSV upload for multiple books
5. **Browser Extension**: Quick-add from book websites

### View Modes
1. **Cork Board View**: Visual grid with covers
2. **List View**: Traditional ranked list
3. **Shelf View**: Grouped by categories
4. **Timeline View**: Books by date added/completed
5. **Master Order View**: Single prioritized list across all shelves

### Additional Features
- **Search & Filter**: By title, author, genre, shelf
- **Reading Statistics**: Books per year, genre breakdown
- **Export Options**: CSV, JSON, Goodreads compatible
- **Sharing**: Public profile or specific shelf sharing
- **Mobile Responsive**: Touch-friendly drag and drop

## File Structure
```
/app
  /api
    /books
    /shelves
  /dashboard
  /auth
/components
  /ui
  /cork-board
  /book-card
  /drag-drop
/lib
  /supabase
  /book-apis
  /utils
/public
  /textures
```

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_BOOKS_API_KEY=your_google_books_key
```

## Getting Started
```bash
npx create-next-app@latest book-tbr-list
cd book-tbr-list
npm install @dnd-kit/sortable framer-motion @supabase/supabase-js
npm install -D tailwindcss @types/react @types/node
```

## Next Steps
1. Set up Supabase tables with provided schema
2. Configure authentication with Supabase Auth
3. Create cork board component with drag-and-drop
4. Implement book search and cover fetching
5. Add shelf management system
6. Create master list ordering logic
7. Build completed books archive view
8. Optimize for mobile devices