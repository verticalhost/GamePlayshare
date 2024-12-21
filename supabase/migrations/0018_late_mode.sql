/*
  # Add test achievements

  1. Changes
    - Insert sample achievements for testing
    - Ensures data exists in the achievements table
    
  2. Security
    - Uses existing RLS policies
*/

-- Insert test achievements
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
  'Speed Run Champion',
  'Completed the game in under 2 hours!',
  'Hollow Knight',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
  auth.uid(),
  'approved',
  NOW()
FROM auth.users
WHERE email = 'test@example.com'
LIMIT 1;

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
  'No Hit Boss Fight',
  'Defeated the final boss without taking damage',
  'Elden Ring',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc',
  auth.uid(),
  'pending',
  NOW()
FROM auth.users
WHERE email = 'test@example.com'
LIMIT 1;