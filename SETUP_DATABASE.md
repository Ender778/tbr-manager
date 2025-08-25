# Database Setup Instructions

## Step 1: Apply Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/bjezudsfreblhhcviczs

2. Navigate to the SQL Editor (left sidebar)

3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`

4. Paste it into the SQL Editor

5. Click "Run" to execute the migration

## Step 2: Verify Setup

After running the migration, test the connection:

```bash
curl http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "..."
}
```

## Database Tables Created:

- **books** - Main book storage
- **shelves** - Book shelves/categories
- **book_positions** - Book positioning on shelves
- **tags** - Book tags
- **book_tags** - Book-tag relationships
- **reading_sessions** - Reading tracking
- **user_preferences** - User settings

## Default Shelves

When a user signs up, these shelves are automatically created:
- To Be Read
- Currently Reading
- Completed
- Did Not Finish

## Security

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.