/*
  # Fix achievements table structure and policies

  1. Changes
    - Add NOT NULL constraints safely
    - Update status column with proper default
    - Recreate policies with proper checks

  2. Security
    - Ensure proper RLS policies
    - Status-based access control
*/

-- Drop existing policies safely
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
  DROP POLICY IF EXISTS "Users can create achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can update own achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can delete own achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can update own pending achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can delete own pending achievements" ON public.achievements;
END $$;

-- Update column constraints safely
DO $$ 
BEGIN
  -- Set default values for any NULL entries
  UPDATE public.achievements 
  SET title = 'Untitled Achievement' 
  WHERE title IS NULL;
  
  UPDATE public.achievements 
  SET description = 'No description provided' 
  WHERE description IS NULL;
  
  UPDATE public.achievements 
  SET game = 'Unknown Game' 
  WHERE game IS NULL;
  
  UPDATE public.achievements 
  SET status = 'pending' 
  WHERE status IS NULL;
  
  UPDATE public.achievements 
  SET completed_at = NOW() 
  WHERE completed_at IS NULL;

  -- Now set NOT NULL constraints
  ALTER TABLE public.achievements 
    ALTER COLUMN title SET NOT NULL,
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN game SET NOT NULL,
    ALTER COLUMN proof_url SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN completed_at SET NOT NULL;

  -- Set default for status
  ALTER TABLE public.achievements 
    ALTER COLUMN status SET DEFAULT 'pending';
END $$;

-- Recreate policies
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