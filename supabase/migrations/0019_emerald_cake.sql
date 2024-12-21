/*
  # Fix achievements schema and add test data

  1. Changes
    - Ensure all required columns exist with proper constraints
    - Add test achievements for demonstration
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
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

-- Now set NOT NULL constraints and defaults
ALTER TABLE public.achievements 
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ALTER COLUMN game SET NOT NULL,
  ALTER COLUMN proof_url SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN completed_at SET NOT NULL;

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

-- Insert test achievements if none exist
INSERT INTO public.achievements (
  title,
  description,
  game,
  proof_url,
  user_id,
  status,
  completed_at
)
SELECT
  'Speedrun Master',
  'Completed the game in under 30 minutes!',
  'Hollow Knight',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
  id,
  'approved',
  NOW()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.achievements
)
LIMIT 1;