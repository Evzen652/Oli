-- Fix: prvouka-images bucket INSERT/UPDATE policies — bez role check → admin only
-- Původní politiky neověřovaly auth.uid(), jakýkoliv přihlášený uživatel mohl nahrávat.
-- Edge funkce používají service role key (bypasses RLS), takže jim to nevadí.

DROP POLICY IF EXISTS "Service role can upload prvouka images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update prvouka images" ON storage.objects;

CREATE POLICY "Admin can upload prvouka images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prvouka-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admin can update prvouka images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'prvouka-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
