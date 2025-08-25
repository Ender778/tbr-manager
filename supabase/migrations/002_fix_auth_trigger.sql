-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS create_default_shelves();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default shelves for new user
    INSERT INTO public.shelves (user_id, name, position, is_default, color, icon)
    VALUES 
        (NEW.id, 'To Be Read', 0, true, '#8B4513', 'book'),
        (NEW.id, 'Currently Reading', 1, true, '#059669', 'book-open'),
        (NEW.id, 'Completed', 2, true, '#6B7280', 'check'),
        (NEW.id, 'Did Not Finish', 3, true, '#EF4444', 'x');
    
    -- Create user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Error creating default data for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;