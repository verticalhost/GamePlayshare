/*
  # Add Initial Gaming Challenges

  1. Changes
    - Add 5 diverse gaming challenges with different difficulty levels and rewards
    - Challenges span different game genres and skill types
    - Include reasonable deadlines and point rewards

  2. Data
    - Each challenge has a clear title, description, and requirements
    - Points are balanced based on difficulty
    - Deadlines set to give users enough time to complete
*/

INSERT INTO public.challenges (title, description, points, requirements, deadline, game)
VALUES
  (
    'Speed Runner Elite',
    'Complete the main story campaign in under 2 hours. Must record full playthrough.',
    1000,
    'Submit video evidence of complete playthrough with timer visible. No glitches or exploits allowed.',
    NOW() + INTERVAL '30 days',
    'Hollow Knight'
  ),
  (
    'No Hit Champion',
    'Defeat any boss without taking damage. Show your perfect mastery!',
    750,
    'Submit video of complete boss fight showing no damage taken. Health bar must be visible.',
    NOW() + INTERVAL '14 days',
    'Elden Ring'
  ),
  (
    'Creative Builder',
    'Build a fully functional city with at least 100 happy residents and 90% approval rating.',
    500,
    'Submit screenshots showing city stats, layout, and approval rating. City must be self-sustaining.',
    NOW() + INTERVAL '21 days',
    'Cities: Skylines II'
  ),
  (
    'Tactical Genius',
    'Win a match using only pistols and maintain a K/D ratio above 2.0.',
    800,
    'Submit full match replay showing loadout and final scoreboard.',
    NOW() + INTERVAL '7 days',
    'Counter-Strike 2'
  ),
  (
    'Pacifist Run',
    'Complete the game without eliminating any enemies (except mandatory bosses).',
    1500,
    'Submit complete playthrough evidence. Stats must show zero optional eliminations.',
    NOW() + INTERVAL '45 days',
    'Cyberpunk 2077'
  );