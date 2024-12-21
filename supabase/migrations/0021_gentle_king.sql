/*
  # Add YouTube URL support for achievements

  1. Changes
    - Add youtube_url column to achievements table
    - Update RLS policies to handle the new column
*/

-- Add youtube_url column
ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Update policies to include youtube_url
DROP POLICY IF EXISTS "Users can create own achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can update own pending achievements" ON public.achievements;

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
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    title IS NOT NULL AND
    description IS NOT NULL AND
    game IS NOT NULL AND
    (proof_url IS NOT NULL OR youtube_url IS NOT NULL)
  );