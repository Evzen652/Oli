ALTER TABLE public.session_logs
  DROP CONSTRAINT IF EXISTS session_logs_child_id_fkey,
  ADD CONSTRAINT session_logs_child_id_fkey
    FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE;

ALTER TABLE public.skill_profiles
  DROP CONSTRAINT IF EXISTS skill_profiles_child_id_fkey,
  ADD CONSTRAINT skill_profiles_child_id_fkey
    FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE;