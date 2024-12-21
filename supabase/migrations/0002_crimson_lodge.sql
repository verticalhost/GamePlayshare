/*
  # Fix users table schema

  1. Changes
    - Remove email column from users table (already exists in auth.users)
    - Add display_name column for user profile display
    - Add avatar_url for profile pictures
  
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE public.users 
  DROP COLUMN IF EXISTS email,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;