
-- Create the update_updated_at function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Skill profiles
CREATE TABLE public.skill_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  skill_id TEXT NOT NULL,
  attempts_total INTEGER NOT NULL DEFAULT 0,
  correct_total INTEGER NOT NULL DEFAULT 0,
  error_streak INTEGER NOT NULL DEFAULT 0,
  success_streak INTEGER NOT NULL DEFAULT 0,
  mastery_score REAL NOT NULL DEFAULT 0.0,
  weak_pattern_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_practiced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

ALTER TABLE public.skill_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skill profiles"
  ON public.skill_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skill profiles"
  ON public.skill_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skill profiles"
  ON public.skill_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Session logs
CREATE TABLE public.session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  skill_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  example_id TEXT,
  correct BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  error_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session logs"
  ON public.session_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own session logs"
  ON public.session_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_skill_profiles_updated_at
  BEFORE UPDATE ON public.skill_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_skill_profiles_user_skill ON public.skill_profiles(user_id, skill_id);
CREATE INDEX idx_session_logs_user_skill ON public.session_logs(user_id, skill_id);
CREATE INDEX idx_session_logs_session ON public.session_logs(session_id);
