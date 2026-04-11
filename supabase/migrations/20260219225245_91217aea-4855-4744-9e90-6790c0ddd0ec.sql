-- Allow admins to fully manage children table
CREATE POLICY "Admins can manage all children"
ON public.children
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));