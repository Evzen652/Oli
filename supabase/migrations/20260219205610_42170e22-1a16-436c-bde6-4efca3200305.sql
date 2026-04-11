
-- Curriculum hierarchy: subjects → categories → topics → skills
-- All managed by admin, read by all authenticated users

-- Subjects (e.g. "Matematika", "Čeština", "Prvouka")
CREATE TABLE public.curriculum_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Categories within subjects (e.g. "Zlomky", "Pravopis")
CREATE TABLE public.curriculum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.curriculum_subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  fun_fact text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject_id, slug)
);

-- Topics within categories (e.g. "Porovnávání zlomků")
CREATE TABLE public.curriculum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.curriculum_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

-- Skills (leaf nodes, linked to code generators via code_skill_id)
CREATE TABLE public.curriculum_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.curriculum_topics(id) ON DELETE CASCADE,
  code_skill_id text NOT NULL UNIQUE,
  name text NOT NULL,
  brief_description text,
  grade_min integer NOT NULL DEFAULT 3,
  grade_max integer NOT NULL DEFAULT 9,
  input_type text NOT NULL DEFAULT 'text',
  default_level integer NOT NULL DEFAULT 1,
  help_hint text,
  help_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  help_example text,
  help_common_mistake text,
  help_visual_examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  boundaries jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_skills ENABLE ROW LEVEL SECURITY;

-- Read access for all authenticated users
CREATE POLICY "Authenticated users can read subjects"
  ON public.curriculum_subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read categories"
  ON public.curriculum_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read topics"
  ON public.curriculum_topics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read skills"
  ON public.curriculum_skills FOR SELECT
  TO authenticated
  USING (true);

-- Admin-only write access
CREATE POLICY "Admins can manage subjects"
  ON public.curriculum_subjects FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage categories"
  ON public.curriculum_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage topics"
  ON public.curriculum_topics FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage skills"
  ON public.curriculum_skills FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at triggers
CREATE TRIGGER update_curriculum_subjects_updated_at
  BEFORE UPDATE ON public.curriculum_subjects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_curriculum_categories_updated_at
  BEFORE UPDATE ON public.curriculum_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_curriculum_topics_updated_at
  BEFORE UPDATE ON public.curriculum_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_curriculum_skills_updated_at
  BEFORE UPDATE ON public.curriculum_skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
