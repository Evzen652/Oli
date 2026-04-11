
-- Table for AI-generated (or manually added) custom exercises
CREATE TABLE public.custom_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  hints JSONB NOT NULL DEFAULT '[]'::jsonb,
  solution_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  source TEXT NOT NULL DEFAULT 'ai',
  created_by UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage custom exercises"
ON public.custom_exercises
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can read active exercises"
ON public.custom_exercises
FOR SELECT
USING (is_active = true);

CREATE INDEX idx_custom_exercises_skill ON public.custom_exercises (skill_id);

CREATE TRIGGER update_custom_exercises_updated_at
BEFORE UPDATE ON public.custom_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
