
-- Create public storage bucket for prvouka illustrations
INSERT INTO storage.buckets (id, name, public)
VALUES ('prvouka-images', 'prvouka-images', true);

-- Allow public read access
CREATE POLICY "Public read access for prvouka images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prvouka-images');

-- Allow service role (edge functions) to insert
CREATE POLICY "Service role can upload prvouka images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prvouka-images');

-- Allow service role to update
CREATE POLICY "Service role can update prvouka images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'prvouka-images');
