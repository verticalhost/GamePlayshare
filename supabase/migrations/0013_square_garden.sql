/*
  # Fix achievements storage setup

  1. Changes
    - Ensure proofs bucket exists with proper configuration
    - Add missing storage policies
*/

-- Recreate proofs bucket with proper configuration
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('proofs', 'proofs', true)
  ON CONFLICT (id) DO UPDATE
  SET public = true;
END $$;

-- Update storage policies
DROP POLICY IF EXISTS "Proofs are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload proofs" ON storage.objects;

CREATE POLICY "Proofs are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proofs');

CREATE POLICY "Authenticated users can upload proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'proofs');

CREATE POLICY "Users can update their own proofs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'proofs');

CREATE POLICY "Users can delete their own proofs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'proofs');