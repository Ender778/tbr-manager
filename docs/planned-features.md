# Planned Features: Enhanced Book Management & Views (Phase 2 Continuation)

## 📚 Feature Set 1: Book Details Modal Enhancements

**Priority:** High Value - These features significantly improve book metadata management and reading progress tracking.

### 1.1 Genre Tags/Pills System
**Implementation Details:**
- **Display:** Tag/pill UI components for genre display
- **API Integration:** Pull genres from Google Books API when available
- **User Management:**
  - Add new genres manually
  - Edit existing genre tags
  - Delete genre tags
  - Tag autocomplete from existing tags across all books
- **Database:**
  - Reuse existing `tags` table (id, name, color, user_id)
  - Utilize `book_tags` join table (book_id, tag_id)
- **UI Components:**
  - Tag input with autocomplete dropdown
  - Color picker for tag customization
  - Tag chips with remove buttons
  - "Add Tag" button to create new tags
- **Estimated Effort:** 3-4 hours

### 1.2 Format Selection
**Implementation Details:**
- **Field Type:** Dropdown select (single choice)
- **Options:**
  1. Paperback Book
  2. Hardcover Book
  3. eBook
  4. Audiobook
- **Database:** Add `format` column to books table
  ```sql
  ALTER TABLE books ADD COLUMN format TEXT
    CHECK (format IN ('paperback', 'hardcover', 'ebook', 'audiobook'));
  ```
- **UI:** Styled select dropdown in BookDetailsModal
- **Estimated Effort:** 1 hour

### 1.3 Ownership Status
**Implementation Details:**
- **Field Type:** Dropdown select (single choice)
- **Options:**
  1. Own
  2. Library
  3. Borrow
- **Database:** Add `ownership` column to books table
  ```sql
  ALTER TABLE books ADD COLUMN ownership TEXT
    CHECK (ownership IN ('own', 'library', 'borrow'));
  ```
- **UI:** Styled select dropdown in BookDetailsModal
- **Use Cases:**
  - Track library due dates
  - Filter books by ownership
  - Remind when borrowed books need returning
- **Estimated Effort:** 1 hour

### 1.4 Published Date (from API)
**Implementation Details:**
- **Data Source:** Google Books API `publishedDate` field
- **Database:** Already exists as `published_date` column
- **Display:** Format as "Month Year" or "Year" depending on precision
- **API Integration:** Auto-populate from Google Books when adding book
- **User Override:** Allow manual editing if API data is incorrect
- **Estimated Effort:** 30 minutes (already partially implemented)

### 1.5 Summary/Description Accordion
**Implementation Details:**
- **Placement:** Above personal notes section in BookDetailsModal
- **Default State:** Collapsed/closed
- **Data Source:** Google Books API `description` field
- **Database:** Use existing `description` column in books table
- **UI Component:** Accordion/collapsible section
- **User Editing:** Textarea for manual editing
- **Features:**
  - Auto-populate from API on book add
  - Rich text display with proper formatting
  - Character limit indicator
  - Expand/collapse animation
- **Estimated Effort:** 2 hours

### 1.6 Reading Progress Tracker
**Implementation Details:**
- **Visibility:** Only show when book is NOT in "To Be Read" shelf
- **Input Field:** "Current Page" number input
- **Calculation:** `(current_page / page_count) * 100 = progress_percentage`
- **Database:** Add `current_page` column to books table
  ```sql
  ALTER TABLE books ADD COLUMN current_page INTEGER
    CHECK (current_page >= 0 AND current_page <= page_count);
  ```
- **UI Display:**
  - Input field for current page
  - Progress bar visual (0-100%)
  - Text: "Page 234 of 456 (51%)"
- **Auto-update:** Recalculate percentage on page number change
- **Status Integration:**
  - Auto-set status to 'reading' when progress > 0% and < 100%
  - Auto-set status to 'completed' when progress = 100%
- **Estimated Effort:** 2-3 hours

### 1.7 Goodreads Review Score
**Implementation Details:**
- **Display:** Read-only field showing Goodreads average rating
- **Data Source:** Google Books API often includes Goodreads data in `volumeInfo.averageRating`
- **Database:** Add `goodreads_rating` column to books table
  ```sql
  ALTER TABLE books ADD COLUMN goodreads_rating DECIMAL(3,2)
    CHECK (goodreads_rating >= 0 AND goodreads_rating <= 5);
  ```
- **UI Display:**
  - Star rating (read-only, different style from user rating)
  - Text: "Goodreads: 4.23 / 5.0"
  - Small badge or label to distinguish from personal rating
- **API Integration:**
  - Auto-populate from Google Books API when available
  - Fallback: Manual entry if API doesn't provide
  - Refresh option to update from API
- **Comparison Feature:**
  - Show both Goodreads rating and personal rating side-by-side
  - Visual indicator if personal rating differs significantly
- **Estimated Effort:** 1-2 hours

**Total Estimated Effort for Feature Set 1:** 11-14 hours

---

## 🎨 Feature Set 2: Library View Modes

**Priority:** High Value - Provides users with different ways to view and organize their collection.

### 2.1 View Mode Selector
**Implementation Details:**
- **Location:** Top of dashboard, near "Add Book" button
- **Component:** Segmented control or dropdown selector
- **Persistence:** Save preference to localStorage via preferences-store
- **Options:**
  1. **Default View** (Cork Board)
  2. **List View by Section**
  3. **Full List View**

### 2.2 Default View (Cork Board) - Already Implemented ✅
**Current Implementation:**
- Grid layout with book covers
- Drag-and-drop functionality
- Organized by shelves/sections
- Visual cork board aesthetic

### 2.3 List View by Section
**Implementation Details:**
- **Layout:** Table-like structure grouped by shelf
- **Sections:** Each shelf becomes a collapsible section header
  - To Be Read
  - Currently Reading
  - Completed
  - Custom categories
- **Row Content (Default Columns):**
  - Medium/small book cover (60-80px width)
  - Book title (bold)
  - Author name
  - Genre tags
  - Rating stars (personal)
  - Goodreads rating
  - Progress percentage (if applicable)
  - Ownership badge
  - Format icon
- **Column Customization:**
  - **Add/Remove Columns:** Users can show/hide any field from BookDetailsModal
  - **Available Columns:** All fields from book details (genre, format, ownership, progress, summary, notes, dates, published date, personal rating, Goodreads rating, etc.)
  - **Column Order:** Drag-and-drop to reorder columns
  - **Persistence:** Save column preferences per view mode in localStorage
  - **Reset to Default:** Button to restore default column configuration
- **Features:**
  - Collapse/expand sections
  - Sort within section (by any visible column)
  - Click row to open book details modal
  - Bulk actions (select multiple books)
  - Column picker modal/dropdown
- **UI Components:**
  - Table with sticky headers
  - Collapsible section headers
  - Responsive columns
  - Column customization button (⚙️ icon in table header)
  - Column picker with drag-and-drop reordering
- **Estimated Effort:** 8-10 hours

### 2.4 Full List View
**Implementation Details:**
- **Layout:** Single unified table (all books in one list)
- **Default Columns:**
  1. Book Cover (small, 50px)
  2. Title
  3. Author
  4. Shelf/Category
  5. Status badge
  6. Rating (personal)
  7. Goodreads Rating
  8. Progress %
  9. Date Added
  10. Format
  11. Ownership
- **Column Customization:**
  - **Add/Remove Columns:** Same functionality as List by Section
  - **All Available Fields:** Genre, Summary (truncated), Notes (truncated), Published Date, Date Started, Date Completed, Page Count, ISBN, Publisher, Personal Rating, Goodreads Rating, etc.
  - **Column Visibility Toggle:** Checkbox list in settings
  - **Column Width:** Resizable columns with drag handles
  - **Sticky Columns:** Pin important columns (e.g., Title, Cover) to left
- **Features:**
  - Sort by any column (ascending/descending)
  - Filter by shelf, status, rating, format, ownership
  - Search across all visible fields
  - Pagination or virtual scrolling for performance
  - Click row to open book details modal
  - Bulk selection and actions
  - Export visible columns to CSV
- **UI Components:**
  - Sortable table headers with resize handles
  - Filter dropdowns above table
  - Search input with field selector
  - Pagination controls
  - Column settings modal
- **Estimated Effort:** 10-12 hours

**Total Estimated Effort for Feature Set 2:** 18-22 hours

---

## 🏷️ Feature Set 3: Custom Shelf Creation

**Priority:** Medium-High Value - Empowers users to organize books their way.

### 3.1 Custom Shelf Creation UI
**Implementation Details:**
- **Trigger:** "Create New Shelf" button in dashboard header or settings
- **Modal/Drawer:** Form for shelf configuration
- **Required Fields:**
  1. **Shelf Name** (text input, max 100 chars, unique per user)
  2. **Color** (color picker, hex value)
  3. **Icon** (icon selector from lucide-react icons)

### 3.2 Shelf Customization Options
**Custom Parameters/Features:**
- **Metadata Fields to Display:** Checkboxes for which fields appear in BookDetailsModal for books on this shelf
  - [ ] Show Genre Tags
  - [ ] Show Format
  - [ ] Show Ownership
  - [ ] Show Progress Tracker
  - [ ] Show Summary
  - [ ] Show Personal Notes
  - [ ] Show Published Date
  - [ ] Show Date Started
  - [ ] Show Date Completed
- **Shelf-Specific Settings:**
  - Auto-assign status when book added to shelf
  - Default sort order for books in this shelf
  - Shelf description/purpose (optional text)

### 3.3 Database Schema for Custom Shelves
**Extend shelves table:**
```sql
-- Add custom configuration JSON column
ALTER TABLE shelves ADD COLUMN config JSONB DEFAULT '{}';

-- Example config structure:
{
  "visible_fields": ["genre", "format", "ownership", "progress"],
  "auto_status": "reading",
  "default_sort": "date_added_desc",
  "description": "Books I want to read this summer"
}
```

### 3.4 Shelf Management Features
**Implementation:**
- **CRUD Operations:**
  - Create new custom shelf
  - Edit shelf (name, color, icon, config)
  - Delete shelf (with confirmation, move books to default shelf)
  - Archive shelf (hide but don't delete)
- **Drag-and-Drop Reordering:**
  - Reorder shelves in sidebar/dashboard
  - Save order to preferences-store
- **Shelf Templates:**
  - Preset configurations (e.g., "Reading Challenge", "Series Tracker")
  - Clone existing shelf with settings
- **UI Components:**
  - Shelf creation modal with tabs (Basic Info, Custom Fields, Advanced)
  - Color picker component
  - Icon selector grid
  - Checkbox group for field visibility

**Total Estimated Effort for Feature Set 3:** 8-10 hours

---

## ⚙️ Feature Set 4: User Preferences & Global Settings

**Priority:** High Value - Centralized control over UI/UX preferences and field visibility.

### 4.1 User Preferences Section/Page
**Implementation Details:**
- **Access:** Settings button in dashboard header (⚙️ icon or "Settings" menu item)
- **UI:** Dedicated preferences modal or page (`/dashboard/settings`)
- **Categories:**
  1. Book Details Display
  2. List View Columns
  3. Cork Board Settings
  4. General Preferences

### 4.2 Global Book Details Field Visibility
**Implementation Details:**
- **Purpose:** Set default field visibility for ALL shelves at once
- **Override Behavior:**
  - Global settings apply to all shelves by default
  - Individual shelf settings can override global preferences
  - Clear indicator when shelf has custom settings (e.g., "Using custom settings for this shelf")
- **UI Component:**
  ```
  ┌─── Book Details - Global Field Visibility ───┐
  │                                               │
  │  These settings apply to all shelves unless  │
  │  a shelf has custom visibility settings.     │
  │                                               │
  │  ☑ Genre Tags          ☑ Format              │
  │  ☑ Ownership           ☑ Progress Tracker    │
  │  ☑ Summary/Description ☑ Personal Notes      │
  │  ☑ Published Date      ☑ Date Added          │
  │  ☑ Date Started        ☑ Date Completed      │
  │  ☑ Rating              ☑ Goodreads Rating    │
  │  ☑ ISBN                ☑ Publisher           │
  │  ☑ Page Count                                │
  │                                               │
  │  [Reset to Defaults]           [Save Changes]│
  └───────────────────────────────────────────────┘
  ```
- **Database:**
  - Store in `user_preferences` table as JSONB
  ```sql
  ALTER TABLE user_preferences
    ADD COLUMN book_detail_fields JSONB DEFAULT '{
      "genre": true, "format": true, "ownership": true,
      "progress": true, "summary": true, "notes": true,
      "published_date": true, "date_added": true,
      "date_started": true, "date_completed": true,
      "rating": true, "isbn": true, "publisher": true,
      "page_count": true
    }';
  ```
- **Estimated Effort:** 3-4 hours

### 4.3 List View Column Preferences
**Implementation Details:**
- **Separate Settings for Each View:**
  - List View by Section - Column preferences
  - Full List View - Column preferences
- **Customization Options:**
  - **Column Visibility:** Show/hide any field from book details
  - **Column Order:** Drag-and-drop to reorder
  - **Column Width:** Set default width for each column
  - **Sticky Columns:** Choose which columns stay fixed on scroll
- **UI Component:**
  ```
  ┌─── List View Column Settings ───────────────┐
  │                                              │
  │  View Mode: [List by Section ▼]             │
  │                                              │
  │  Visible Columns (drag to reorder):         │
  │  ☑ ≡ Cover                                   │
  │  ☑ ≡ Title                    [Pin 📌]       │
  │  ☑ ≡ Author                                  │
  │  ☑ ≡ Genre                                   │
  │  ☑ ≡ Rating (Personal)                       │
  │  ☑ ≡ Goodreads Rating                        │
  │  ☐ ≡ Progress                                │
  │  ☑ ≡ Format                                  │
  │  ☑ ≡ Ownership                               │
  │  ☐ ≡ Summary                                 │
  │  ☐ ≡ Notes                                   │
  │  ☑ ≡ Date Added                              │
  │  ☐ ≡ Date Started                            │
  │  ☐ ≡ Date Completed                          │
  │  ☐ ≡ Published Date                          │
  │  ☐ ≡ Page Count                              │
  │  ☐ ≡ ISBN                                    │
  │  ☐ ≡ Publisher                               │
  │                                              │
  │  [Select All] [Clear All] [Reset to Defaults]│
  │                                [Save Changes]│
  └──────────────────────────────────────────────┘
  ```
- **Quick Access:** Column picker also available directly in table header (⚙️ button)
- **Persistence:** Save to localStorage in preferences-store
  ```typescript
  {
    listViewBySection: {
      visibleColumns: ['cover', 'title', 'author', ...],
      columnOrder: ['cover', 'title', 'author', ...],
      columnWidths: { title: 300, author: 200, ... },
      pinnedColumns: ['cover', 'title']
    },
    fullListView: {
      visibleColumns: [...],
      columnOrder: [...],
      columnWidths: {...},
      pinnedColumns: [...]
    }
  }
  ```
- **Estimated Effort:** 4-5 hours

### 4.4 Cork Board Settings
**Implementation Details:**
- **Options:**
  - Number of columns (3, 4, 5, 6, auto)
  - Book card size (small, medium, large)
  - Show/hide hover overlay info
  - Animation effects (enable/disable)
  - Cork texture style
- **Estimated Effort:** 2 hours

### 4.5 General Preferences
**Implementation Details:**
- **Options:**
  - Default view mode on dashboard load
  - Theme (light, dark, auto)
  - Date format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
  - Time zone
  - Language (future feature)
- **Estimated Effort:** 1-2 hours

**Total Estimated Effort for Feature Set 4:** 10-13 hours

---

## Implementation Priority & Roadmap (Updated)

### Phase 2B: Enhanced Features (After current 50% completion)

**Week 1-2: Book Details Enhancements**
1. Genre tags system (3-4 hours)
2. Format & Ownership dropdowns (2 hours)
3. Summary accordion with API integration (2 hours)
4. Reading progress tracker (2-3 hours)
5. Published date display refinement (30 min)

**Week 3: User Preferences & Global Settings**
1. Preferences section/page setup (2 hours)
2. Global book detail field visibility (3-4 hours)
3. List view column preferences (4-5 hours)
4. Cork board settings (2 hours)
5. General preferences (1-2 hours)

**Week 4-5: Library View Modes**
1. View mode selector component (2 hours)
2. List view by section with column customization (8-10 hours)
3. Full list view with column customization (10-12 hours)

**Week 6: Custom Shelves & Polish**
1. Custom shelf creation UI (4-5 hours)
2. Shelf customization options (2-3 hours)
3. Shelf management features (2-3 hours)
4. Testing and refinement (4-5 hours)

**Total Additional Effort:** 48-63 hours (6-8 weeks part-time)

---

## Database Migration Requirements

### New Columns Needed:

```sql
-- Migration: Add book metadata fields
ALTER TABLE books
  ADD COLUMN format TEXT CHECK (format IN ('paperback', 'hardcover', 'ebook', 'audiobook')),
  ADD COLUMN ownership TEXT CHECK (ownership IN ('own', 'library', 'borrow')),
  ADD COLUMN current_page INTEGER CHECK (current_page >= 0 AND current_page <= page_count),
  ADD COLUMN goodreads_rating DECIMAL(3,2) CHECK (goodreads_rating >= 0 AND goodreads_rating <= 5),
  ADD COLUMN description TEXT; -- For book summary

-- Migration: Add shelf customization
ALTER TABLE shelves
  ADD COLUMN config JSONB DEFAULT '{}',
  ADD COLUMN description TEXT;

-- Migration: Add user preferences for field visibility and list columns
ALTER TABLE user_preferences
  ADD COLUMN book_detail_fields JSONB DEFAULT '{
    "genre": true, "format": true, "ownership": true,
    "progress": true, "summary": true, "notes": true,
    "published_date": true, "date_added": true,
    "date_started": true, "date_completed": true,
    "rating": true, "goodreads_rating": true,
    "isbn": true, "publisher": true, "page_count": true
  }',
  ADD COLUMN list_view_columns JSONB DEFAULT '{
    "listViewBySection": {
      "visibleColumns": ["cover", "title", "author", "genre", "rating", "goodreads_rating", "format", "ownership", "date_added"],
      "columnOrder": ["cover", "title", "author", "genre", "rating", "goodreads_rating", "format", "ownership", "date_added"],
      "pinnedColumns": ["cover", "title"]
    },
    "fullListView": {
      "visibleColumns": ["cover", "title", "author", "shelf", "status", "rating", "goodreads_rating", "progress", "date_added", "format", "ownership"],
      "columnOrder": ["cover", "title", "author", "shelf", "status", "rating", "goodreads_rating", "progress", "date_added", "format", "ownership"],
      "pinnedColumns": ["cover", "title"]
    }
  }';

-- Indexes for performance
CREATE INDEX idx_books_format ON books(user_id, format) WHERE format IS NOT NULL;
CREATE INDEX idx_books_ownership ON books(user_id, ownership) WHERE ownership IS NOT NULL;
CREATE INDEX idx_books_progress ON books(user_id, current_page) WHERE current_page IS NOT NULL;
```

### Validation Rules:
- `current_page` must be <= `page_count`
- `format` and `ownership` must be from predefined enums
- `config` JSONB must have valid structure (validate on API)
- `book_detail_fields` and `list_view_columns` must have valid JSON structure

---

## Testing Checklist for New Features

### Book Details Modal:
- [ ] Genre tags add/edit/delete functionality
- [ ] Tag autocomplete works across all books
- [ ] Format dropdown saves correctly
- [ ] Ownership dropdown saves correctly
- [ ] Summary accordion expands/collapses
- [ ] Summary prefills from API
- [ ] Progress tracker calculates percentage correctly
- [ ] Progress tracker only shows for non-TBR books
- [ ] All fields persist to database
- [ ] Optimistic updates work for all new fields
- [ ] Global field visibility settings apply correctly
- [ ] Shelf-specific overrides work properly

### User Preferences:
- [ ] Settings page/modal accessible from dashboard
- [ ] Global book detail field visibility saves correctly
- [ ] Field visibility changes reflect in BookDetailsModal
- [ ] Shelf-specific settings override global settings
- [ ] List view column preferences save per view mode
- [ ] Column order drag-and-drop works
- [ ] Pinned columns stay fixed on scroll
- [ ] Reset to defaults restores original settings
- [ ] Preferences persist across sessions (localStorage)

### View Modes:
- [ ] View mode selector switches views correctly
- [ ] Preference persists across sessions
- [ ] List by section groups books properly
- [ ] Section collapse/expand works
- [ ] Full list view sorts by all columns
- [ ] Filter and search work in full list view
- [ ] Column customization saves correctly
- [ ] Add/remove columns updates table immediately
- [ ] Column width resizing works
- [ ] Performance is good with 100+ books
- [ ] Responsive on mobile devices

### Custom Shelves:
- [ ] Shelf creation saves all fields
- [ ] Color picker works correctly
- [ ] Icon selector displays and saves
- [ ] Custom field visibility works in book modal
- [ ] "Use global settings" option works
- [ ] Shelf editing updates correctly
- [ ] Shelf deletion moves books appropriately
- [ ] Drag-and-drop shelf reordering works
- [ ] Config JSONB validates properly
