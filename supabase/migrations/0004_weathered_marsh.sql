/*
  # Fix user profile creation

  1. Changes
    - Add trigger to automatically create user profile after signup
    - Ensure profile creation with default values
*/

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, points, level)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1), -- Use email prefix as default username
    SPLIT_PART(NEW.email, '@', 1), -- Use same for display name
    0,  -- Default points
    1   -- Default level
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();