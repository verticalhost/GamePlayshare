/*
  # Update achievement policies

  1. Changes
    - Drop existing policies for achievements table
    - Add new policies for authenticated users to manage their achievements
  
  2. Security
    - Allow authenticated users to insert their own achievements
    - Allow users to view all achievements
    - Allow users to update/delete their own achievements
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can create own achievements" ON public.achievements;

-- Create new policies
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON public.achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements"
  ON public.achievements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);