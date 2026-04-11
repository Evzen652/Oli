
-- 1. Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'parent', 'child');

-- 2. User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  locale text NOT NULL DEFAULT 'cs',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Generate pairing code function
CREATE OR REPLACE FUNCTION public.generate_pairing_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  i int;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.children WHERE pairing_code = code);
  END LOOP;
  RETURN code;
END;
$$;

-- 8. Children table
CREATE TABLE public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  child_name text NOT NULL,
  grade int NOT NULL DEFAULT 3,
  pairing_code text NOT NULL UNIQUE DEFAULT public.generate_pairing_code(),
  pairing_code_expires_at timestamptz NOT NULL DEFAULT (now() + interval '48 hours'),
  is_paired boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage own children"
  ON public.children FOR ALL
  TO authenticated
  USING (auth.uid() = parent_user_id);

CREATE POLICY "Children can view own record"
  ON public.children FOR SELECT
  TO authenticated
  USING (auth.uid() = child_user_id);

-- 9. Report settings table
CREATE TABLE public.report_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL UNIQUE REFERENCES public.children(id) ON DELETE CASCADE,
  parent_frequency text NOT NULL DEFAULT 'weekly',
  child_reports_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.report_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage report settings for own children"
  ON public.report_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = child_id AND c.parent_user_id = auth.uid()
    )
  );

-- 10. Auto-create report_settings on new child
CREATE OR REPLACE FUNCTION public.handle_new_child()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.report_settings (child_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_child_created
  AFTER INSERT ON public.children
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_child();

-- 11. Add child_id to existing tables
ALTER TABLE public.session_logs
  ADD COLUMN child_id uuid REFERENCES public.children(id) ON DELETE SET NULL;

ALTER TABLE public.skill_profiles
  ADD COLUMN child_id uuid REFERENCES public.children(id) ON DELETE SET NULL;

-- 12. Parents can view their children's session logs
CREATE POLICY "Parents can view children session logs"
  ON public.session_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = session_logs.child_id AND c.parent_user_id = auth.uid()
    )
  );

-- 13. Parents can view their children's skill profiles
CREATE POLICY "Parents can view children skill profiles"
  ON public.skill_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = skill_profiles.child_id AND c.parent_user_id = auth.uid()
    )
  );
