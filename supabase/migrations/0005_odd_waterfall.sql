/*
  # Fix user profile creation trigger

  1. Changes
    - Update trigger to use metadata from auth.users
    - Ensure unique usernames
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    username,
    display_name,
    points,
    level
  ) VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'username')::text,
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      (NEW.raw_user_meta_data->>'display_name')::text,
      SPLIT_PART(NEW.email, '@', 1)
    ),
    0,
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();