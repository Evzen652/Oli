ALTER TABLE public.report_settings
  DROP CONSTRAINT IF EXISTS report_settings_child_id_fkey,
  ADD CONSTRAINT report_settings_child_id_fkey
    FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE;