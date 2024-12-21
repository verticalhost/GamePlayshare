/*
  # Fix achievements RLS policies and constraints

  1. Changes
    - Drop all existing policies
    - Make proof_url nullable since we now support youtube_url
    - Update constraints to allow either proof_url OR youtube_url
    - Create new comprehensive policies
*/

-- First drop all existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can create own achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can update own pending achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can delete own pending achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
END $$;

-- Make proof_url nullable since we support youtube_url now
ALTER TABLE public.achievements
  ALTER COLUMN proof_url DROP NOT NULL;

-- Add constraint to ensure either proof_url or youtube_url is provided
ALTER TABLE public.achievements
  DROP CONSTRAINT IF EXISTS achievements_proof_check;

ALTER TABLE public.achievements
  ADD CONSTRAINT achievements_proof_check
  CHECK (
    (proof_url IS NOT NULL) OR 
    (youtube_url IS NOT NULL)
  );

-- Create new policies
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    title IS NOT NULL AND
    description IS NOT NULL AND
    game IS NOT NULL AND
    (proof_url IS NOT NULL OR youtube_url IS NOT NULL)
  );

CREATE POLICY "Users can update own pending achievements"
  ON public.achievements FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    status = 'pending'
  );

CREATE POLICY "Users can delete own pending achievements"
  ON public.achievements FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    status = 'pending'
  );