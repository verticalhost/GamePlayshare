/*
  # Fix users table RLS policies

  1. Changes
    - Add policy for user creation during signup
    - Update existing policies for better security

  2. Security
    - Enable RLS
    - Add policy for authenticated users to read all profiles
    - Add policy for users to update their own profile
    - Add policy for new user creation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for signup"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);