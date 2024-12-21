/*
  # Fix achievements table structure

  1. Changes
    - Add title and description columns to achievements
    - Make challenge_id optional since users can submit custom achievements
    - Add status column for achievement verification
*/

ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ALTER COLUMN challenge_id DROP NOT NULL,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'
CHECK (status IN ('pending', 'approved', 'rejected'));