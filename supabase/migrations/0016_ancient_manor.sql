/*
  # Fix achievements schema and policies

  1. Changes
    - Add NOT NULL constraints to required columns
    - Update RLS policies for achievements
    - Add default values for required fields

  2. Security
    - Ensure proper RLS policies are in place
    - Allow authenticated users to create and view achievements
*/

-- Add NOT NULL constraints
ALTER TABLE public.achievements ALTER COLUMN title SET NOT NULL;
ALTER TABLE public.achievements ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.achievements ALTER COLUMN game SET NOT NULL;
ALTER TABLE public.achievements ALTER COLUMN proof_url SET NOT NULL;
ALTER TABLE public.achievements ALTER COLUMN completed_at SET NOT NULL;

-- Add status column with default
ALTER TABLE public.achievements ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.achievements ALTER COLUMN status SET DEFAULT 'pending';

-- Drop existing policies
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
DROP POLICY IF EXISTS "Users can create achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can delete own achievements" ON public.achievements;

-- Create comprehensive policies
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    title IS NOT NULL AND
    description IS NOT NULL AND
    game IS NOT NULL AND
    proof_url IS NOT NULL
  );

CREATE POLICY "Users can update own pending achievements"
  ON public.achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    title IS NOT NULL AND
    description IS NOT NULL AND
    game IS NOT NULL AND
    proof_url IS NOT NULL
  );

CREATE POLICY "Users can delete own pending achievements"
  ON public.achievements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');