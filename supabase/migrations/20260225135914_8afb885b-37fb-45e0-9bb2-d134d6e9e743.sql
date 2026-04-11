
-- Create app-assets bucket for logo and other app assets
INSERT INTO storage.buckets (id, name, public) VALUES ('app-assets', 'app-assets', true);

-- Allow public read access
CREATE POLICY "Public read access for app-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-assets');

-- Allow service role to upload (edge functions use service role)
CREATE POLICY "Service role upload for app-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'app-assets');
