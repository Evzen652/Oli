CREATE POLICY "Children can update assignment status" 
ON public.parent_assignments 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM children c WHERE c.id = parent_assignments.child_id AND c.child_user_id = auth.uid())) 
WITH CHECK (status = 'completed');