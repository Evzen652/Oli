-- ============================================
-- Oly / Sovicka — Database Schema
-- ============================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

create type app_role as enum ('admin', 'parent', 'child');
create type assignment_status as enum ('pending', 'completed');
create type subscription_plan as enum ('free', 'premium', 'school');
create type subscription_status as enum ('active', 'canceled', 'past_due', 'trialing');

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text default 'cs',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User roles
create table user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz default now(),
  unique(user_id)
);

-- Children
create table children (
  id uuid primary key default uuid_generate_v4(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  child_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  grade smallint not null check (grade between 1 and 9),
  learning_notes text,
  pairing_code text,
  pairing_code_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Session logs (per-task results)
create table session_logs (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  child_id uuid references children(id) on delete set null,
  skill_id text not null,
  level smallint not null default 1,
  example_id text,
  correct boolean not null,
  response_time_ms integer,
  error_type text,
  help_used boolean default false,
  created_at timestamptz default now()
);

-- Skill profiles (EMA mastery, streaks)
create table skill_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  child_id uuid references children(id) on delete cascade,
  skill_id text not null,
  mastery_score numeric(5,3) default 0.500,
  error_streak integer default 0,
  success_streak integer default 0,
  attempts_total integer default 0,
  weak_pattern_flags jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, skill_id)
);

-- Parent assignments
create table parent_assignments (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references children(id) on delete cascade,
  skill_id text not null,
  note text,
  due_date date,
  status assignment_status default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Report settings
create table report_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  frequency text default 'weekly',
  child_reports_enabled boolean default true,
  created_at timestamptz default now(),
  unique(user_id)
);

-- ============================================
-- CURRICULUM TABLES (admin-managed)
-- ============================================

create table curriculum_subjects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  emoji text,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table curriculum_categories (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references curriculum_subjects(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  fun_fact text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  unique(subject_id, slug)
);

create table curriculum_topics (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references curriculum_categories(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  unique(category_id, slug)
);

create table curriculum_skills (
  id uuid primary key default uuid_generate_v4(),
  topic_id uuid not null references curriculum_topics(id) on delete cascade,
  name text not null,
  code_skill_id text,
  brief_description text,
  grade_min smallint default 1,
  grade_max smallint default 9,
  input_type text default 'number',
  default_level smallint default 1,
  session_task_count smallint default 6,
  goals jsonb default '[]'::jsonb,
  boundaries jsonb default '[]'::jsonb,
  keywords jsonb default '[]'::jsonb,
  help_steps jsonb default '[]'::jsonb,
  help_visual_examples jsonb default '[]'::jsonb,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Custom exercises (AI/admin generated, cached)
create table custom_exercises (
  id uuid primary key default uuid_generate_v4(),
  skill_id text not null,
  question text not null,
  correct_answer text not null,
  options jsonb,
  items jsonb,
  solution_steps jsonb,
  hints jsonb,
  blanks jsonb,
  pairs jsonb,
  categories jsonb,
  correct_answers jsonb,
  source text default 'simple',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- SUBSCRIPTION / BILLING (freemium)
-- ============================================

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan subscription_plan default 'free',
  status subscription_status default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

create table usage_tracking (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null, -- '2026-04'
  ai_tutor_calls integer default 0,
  children_count integer default 0,
  sessions_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, month)
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_session_logs_user_skill on session_logs(user_id, skill_id);
create index idx_session_logs_child on session_logs(child_id);
create index idx_session_logs_session on session_logs(session_id);
create index idx_session_logs_created on session_logs(created_at);
create index idx_skill_profiles_user_skill on skill_profiles(user_id, skill_id);
create index idx_children_child_user on children(child_user_id);
create index idx_children_parent_user on children(parent_user_id);
create index idx_parent_assignments_child on parent_assignments(child_id);
create index idx_custom_exercises_skill on custom_exercises(skill_id);
create index idx_subscriptions_user on subscriptions(user_id);

-- ============================================
-- SECURITY DEFINER FUNCTION
-- ============================================

-- Optimized role check (avoids nested selects in RLS)
create or replace function has_role(required_role app_role)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid()
    and role = required_role
  );
$$;

-- Get current user's role
create or replace function get_my_role()
returns app_role
language sql
security definer
stable
as $$
  select role from user_roles
  where user_id = auth.uid()
  limit 1;
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table children enable row level security;
alter table session_logs enable row level security;
alter table skill_profiles enable row level security;
alter table parent_assignments enable row level security;
alter table report_settings enable row level security;
alter table curriculum_subjects enable row level security;
alter table curriculum_categories enable row level security;
alter table curriculum_topics enable row level security;
alter table curriculum_skills enable row level security;
alter table custom_exercises enable row level security;
alter table subscriptions enable row level security;
alter table usage_tracking enable row level security;

-- Profiles: users see/edit own
create policy "profiles_select_own" on profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on profiles for update using (id = auth.uid());

-- User roles: users see own, admins see all
create policy "roles_select_own" on user_roles for select using (user_id = auth.uid());
create policy "roles_select_admin" on user_roles for select using (has_role('admin'));
create policy "roles_insert_admin" on user_roles for insert with check (has_role('admin'));

-- Children: parent sees own, child sees self, admin sees all
create policy "children_select_parent" on children for select using (parent_user_id = auth.uid());
create policy "children_select_child" on children for select using (child_user_id = auth.uid());
create policy "children_select_admin" on children for select using (has_role('admin'));
create policy "children_insert_parent" on children for insert with check (parent_user_id = auth.uid());
create policy "children_update_parent" on children for update using (parent_user_id = auth.uid());
create policy "children_delete_parent" on children for delete using (parent_user_id = auth.uid());

-- Session logs: user sees own + parent sees child's, admin sees all
create policy "logs_insert_auth" on session_logs for insert with check (auth.uid() is not null);
create policy "logs_select_own" on session_logs for select using (user_id = auth.uid());
create policy "logs_select_parent" on session_logs for select using (
  child_id in (select id from children where parent_user_id = auth.uid())
);
create policy "logs_select_admin" on session_logs for select using (has_role('admin'));

-- Skill profiles: user sees own, admin sees all
create policy "skills_select_own" on skill_profiles for select using (user_id = auth.uid());
create policy "skills_upsert_own" on skill_profiles for insert with check (user_id = auth.uid());
create policy "skills_update_own" on skill_profiles for update using (user_id = auth.uid());
create policy "skills_select_admin" on skill_profiles for select using (has_role('admin'));

-- Parent assignments: parent manages own children's
create policy "assignments_select_parent" on parent_assignments for select using (
  child_id in (select id from children where parent_user_id = auth.uid())
);
create policy "assignments_select_child" on parent_assignments for select using (
  child_id in (select id from children where child_user_id = auth.uid())
);
create policy "assignments_insert_parent" on parent_assignments for insert with check (
  child_id in (select id from children where parent_user_id = auth.uid())
);
create policy "assignments_update_parent" on parent_assignments for update using (
  child_id in (select id from children where parent_user_id = auth.uid())
);
create policy "assignments_delete_parent" on parent_assignments for delete using (
  child_id in (select id from children where parent_user_id = auth.uid())
);
-- Allow child to update own assignments (mark completed)
create policy "assignments_update_child" on parent_assignments for update using (
  child_id in (select id from children where child_user_id = auth.uid())
);

-- Report settings: user sees own
create policy "report_settings_own" on report_settings for all using (user_id = auth.uid());

-- Curriculum: everyone reads, admin writes
create policy "curriculum_subjects_read" on curriculum_subjects for select using (true);
create policy "curriculum_subjects_admin" on curriculum_subjects for all using (has_role('admin'));
create policy "curriculum_categories_read" on curriculum_categories for select using (true);
create policy "curriculum_categories_admin" on curriculum_categories for all using (has_role('admin'));
create policy "curriculum_topics_read" on curriculum_topics for select using (true);
create policy "curriculum_topics_admin" on curriculum_topics for all using (has_role('admin'));
create policy "curriculum_skills_read" on curriculum_skills for select using (true);
create policy "curriculum_skills_admin" on curriculum_skills for all using (has_role('admin'));

-- Custom exercises: everyone reads, admin writes
create policy "exercises_read" on custom_exercises for select using (true);
create policy "exercises_admin" on custom_exercises for all using (has_role('admin'));

-- Subscriptions: user sees own
create policy "subscriptions_own" on subscriptions for select using (user_id = auth.uid());

-- Usage tracking: user sees own
create policy "usage_own" on usage_tracking for select using (user_id = auth.uid());
create policy "usage_upsert_own" on usage_tracking for insert with check (user_id = auth.uid());
create policy "usage_update_own" on usage_tracking for update using (user_id = auth.uid());

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger update_children_updated_at before update on children for each row execute function update_updated_at();
create trigger update_skill_profiles_updated_at before update on skill_profiles for each row execute function update_updated_at();
create trigger update_parent_assignments_updated_at before update on parent_assignments for each row execute function update_updated_at();
create trigger update_subscriptions_updated_at before update on subscriptions for each row execute function update_updated_at();
create trigger update_usage_tracking_updated_at before update on usage_tracking for each row execute function update_updated_at();
