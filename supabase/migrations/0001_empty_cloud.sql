/*
  # Initial Schema Setup for Gameplay Sharing Platform

  1. New Tables
    - users (extends auth.users)
      - username, points, level tracking
    - videos
      - gameplay video metadata and URLs
    - challenges
      - gamification challenges and rewards
    - achievements
      - tracks completed challenges
    
  2. Security
    - RLS enabled on all tables
    - Public read access for videos and challenges
    - Protected write access for authenticated users
*/

-- Users table extending auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  game TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  requirements TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  game TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone"
  ON public.videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create videos"
  ON public.videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON public.videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Challenges policies
CREATE POLICY "Challenges are viewable by everyone"
  ON public.challenges FOR SELECT
  TO authenticated
  USING (true);

-- Achievements policies
CREATE POLICY "Users can view all achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own achievements"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);