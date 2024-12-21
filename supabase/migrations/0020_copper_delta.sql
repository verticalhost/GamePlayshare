/*
  # Fix achievements table structure and policies

  1. Changes
    - Ensure all required columns exist with proper constraints
    - Set up proper status enum values
    - Create comprehensive RLS policies
    
  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- First ensure all required columns exist with proper types
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'title') THEN
    ALTER TABLE public.achievements ADD COLUMN title TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'description') THEN
    ALTER TABLE public.achievements ADD COLUMN description TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'game') THEN
    ALTER TABLE public.achievements ADD COLUMN game TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'proof_url') THEN
    ALTER TABLE public.achievements ADD COLUMN proof_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'status') THEN
    ALTER TABLE public.achievements ADD COLUMN status TEXT;
  END IF;
END $$;

-- Set default values for any NULL entries
UPDATE public.achievements 
SET 
  title = COALESCE(title, 'Untitled Achievement'),
  description = COALESCE(description, 'No description provided'),
  game = COALESCE(game, 'Unknown Game'),
  status = COALESCE(status, 'pending'),
  completed_at = COALESCE(completed_at, NOW());

-- Now set NOT NULL constraints
DO $$
BEGIN
  -- Add NOT NULL constraints one at a time
  ALTER TABLE public.achievements ALTER COLUMN title SET NOT NULL;
  ALTER TABLE public.achievements ALTER COLUMN description SET NOT NULL;
  ALTER TABLE public.achievements ALTER COLUMN game SET NOT NULL;
  ALTER TABLE public.achievements ALTER COLUMN proof_url SET NOT NULL;
  ALTER TABLE public.achievements ALTER COLUMN status SET NOT NULL;
  ALTER TABLE public.achievements ALTER COLUMN completed_at SET NOT NULL;
END $$;

-- Add status check constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'achievements' AND constraint_name = 'achievements_status_check'
  ) THEN
    ALTER TABLE public.achievements
      ADD CONSTRAINT achievements_status_check 
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Drop existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON public.achievements;
  DROP POLICY IF EXISTS "Users can create achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can update own achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can delete own achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can update own pending achievements" ON public.achievements;
  DROP POLICY IF EXISTS "Users can delete own pending achievements" ON public.achievements;
END $$;

-- Create new policies
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending achievements"
  ON public.achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can delete own pending achievements"
  ON public.achievements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');