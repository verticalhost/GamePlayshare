/*
  # Add proof URL to achievements

  1. Changes
    - Add proof_url column to achievements table
    - Create proofs storage bucket
    - Add storage policies for proofs bucket

  2. Security
    - Enable public access to proofs bucket
    - Add policies for authenticated users to upload proofs
*/

-- Create proofs bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs', 'proofs', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Add proof_url column to achievements
ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS proof_url TEXT;

-- Set up storage policies for proofs bucket
CREATE POLICY "Proofs are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proofs');

CREATE POLICY "Authenticated users can upload proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'proofs');