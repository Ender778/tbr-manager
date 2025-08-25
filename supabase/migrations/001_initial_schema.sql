-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enhanced books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isbn TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT NOT NULL,
  publisher TEXT,
  published_date DATE,
  page_count INTEGER,
  language TEXT DEFAULT 'en',
  cover_url TEXT,
  cover_thumbnail_url TEXT,
  google_books_id TEXT,
  open_library_id TEXT,
  status TEXT DEFAULT 'tbr' CHECK (status IN ('tbr', 'reading', 'completed', 'dnf', 'archived')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  personal_notes TEXT,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_started TIMESTAMP WITH TIME ZONE,
  date_completed TIMESTAMP WITH TIME ZONE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Data integrity constraints
  CONSTRAINT valid_completion_date CHECK (
    (status = 'completed' AND date_completed IS NOT NULL) OR 
    (status != 'completed' AND date_completed IS NULL)
  )
);

-- Enhanced shelves table
CREATE TABLE shelves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#8B4513',
  icon TEXT DEFAULT 'book',
  is_default BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);

-- Enhanced book positions table
CREATE TABLE book_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  shelf_id UUID NOT NULL REFERENCES shelves(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  master_position INTEGER,
  year_completed INTEGER,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(book_id, shelf_id),
  UNIQUE(shelf_id, position)
);

-- Add partial unique constraint separately
CREATE UNIQUE INDEX idx_unique_master_position 
  ON book_positions(user_id, master_position) 
  WHERE master_position IS NOT NULL;

-- Tags table for categorization
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, name)
);

-- Book-tags junction table
CREATE TABLE book_tags (
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (book_id, tag_id)
);

-- Reading sessions for tracking reading habits
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  pages_read INTEGER,
  notes TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  default_view TEXT DEFAULT 'cork-board' CHECK (default_view IN ('cork-board', 'list', 'grid')),
  books_per_page INTEGER DEFAULT 50,
  show_archived BOOLEAN DEFAULT FALSE,
  enable_notifications BOOLEAN DEFAULT TRUE,
  reading_goal_annual INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_books_user_status_date ON books(user_id, status, date_added DESC);
CREATE INDEX idx_book_positions_user_shelf_pos ON book_positions(user_id, shelf_id, position);
CREATE INDEX idx_shelves_user_position ON shelves(user_id, position);
CREATE INDEX idx_books_completed ON books(user_id, date_completed DESC) WHERE status = 'completed';
CREATE INDEX idx_book_tags_book ON book_tags(book_id);
CREATE INDEX idx_book_tags_tag ON book_tags(tag_id);
CREATE INDEX idx_reading_sessions_book ON reading_sessions(book_id);
CREATE INDEX idx_reading_sessions_user ON reading_sessions(user_id);

-- Row Level Security policies
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelves ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Books policies
CREATE POLICY "Users can view their own books" ON books
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own books" ON books
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own books" ON books
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own books" ON books
    FOR DELETE USING (auth.uid() = user_id);

-- Shelves policies
CREATE POLICY "Users can view their own shelves" ON shelves
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own shelves" ON shelves
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shelves" ON shelves
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shelves" ON shelves
    FOR DELETE USING (auth.uid() = user_id);

-- Book positions policies
CREATE POLICY "Users can view their own book positions" ON book_positions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own book positions" ON book_positions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own book positions" ON book_positions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own book positions" ON book_positions
    FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can view their own tags" ON tags
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tags" ON tags
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tags" ON tags
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tags" ON tags
    FOR DELETE USING (auth.uid() = user_id);

-- Book tags policies
CREATE POLICY "Users can view their own book tags" ON book_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM books 
            WHERE books.id = book_tags.book_id 
            AND books.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert their own book tags" ON book_tags
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM books 
            WHERE books.id = book_tags.book_id 
            AND books.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete their own book tags" ON book_tags
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM books 
            WHERE books.id = book_tags.book_id 
            AND books.user_id = auth.uid()
        )
    );

-- Reading sessions policies
CREATE POLICY "Users can view their own reading sessions" ON reading_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reading sessions" ON reading_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reading sessions" ON reading_sessions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reading sessions" ON reading_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shelves_updated_at BEFORE UPDATE ON shelves
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_positions_updated_at BEFORE UPDATE ON book_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default shelves for new users
CREATE OR REPLACE FUNCTION create_default_shelves()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO shelves (user_id, name, position, is_default, color, icon)
    VALUES 
        (NEW.id, 'To Be Read', 0, true, '#8B4513', 'book'),
        (NEW.id, 'Currently Reading', 1, true, '#059669', 'book-open'),
        (NEW.id, 'Completed', 2, true, '#6B7280', 'check'),
        (NEW.id, 'Did Not Finish', 3, true, '#EF4444', 'x');
    
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default shelves when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_shelves();