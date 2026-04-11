
CREATE TABLE public.parent_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  parent_user_id uuid NOT NULL,
  skill_id text NOT NULL,
  assigned_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  status text NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.parent_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage own assignments"
ON public.parent_assignments FOR ALL
USING (auth.uid() = parent_user_id)
WITH CHECK (auth.uid() = parent_user_id);

CREATE POLICY "Children can view their assignments"
ON public.parent_assignments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.children c
  WHERE c.id = parent_assignments.child_id
  AND c.child_user_id = auth.uid()
));
