-- Drop the problematic trigger that's preventing user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS create_default_shelves();

-- We'll handle default shelf creation in the application code instead