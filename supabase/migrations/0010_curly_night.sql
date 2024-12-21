-- Ensure videos bucket exists and is public
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('videos', 'videos', true)
  ON CONFLICT (id) DO UPDATE
  SET public = true;
END $$;

-- Update storage policies for videos bucket
DROP POLICY IF EXISTS "Videos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

CREATE POLICY "Videos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

-- Add missing columns to videos table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'size') THEN
    ALTER TABLE public.videos ADD COLUMN size BIGINT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'videos' AND column_name = 'duration') THEN
    ALTER TABLE public.videos ADD COLUMN duration INTEGER;
  END IF;
END $$;