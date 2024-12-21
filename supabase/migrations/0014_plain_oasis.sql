/*
  # Add game column to achievements table

  1. Changes
    - Add game column to achievements table
    - Make game column required for new entries
*/

ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS game TEXT NOT NULL DEFAULT 'Unknown';

-- Remove default after adding column to ensure future entries require a game
ALTER TABLE public.achievements
ALTER COLUMN game DROP DEFAULT;