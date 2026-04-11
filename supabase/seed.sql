-- ============================================
-- Oly / Sovicka — Seed Data
-- ============================================
-- POSTUP:
-- 1. Nejdrive se zaregistruj v aplikaci (http://localhost:5173/auth) s emailem a heslem
-- 2. Pak spust tento SQL v Supabase SQL Editor
-- 3. Nahrad 'TVUJ_EMAIL' za email, ktery jsi pouzil pri registraci
-- ============================================

-- Prirazeni role admin pro tvuj ucet
-- (nahrad email za svuj skutecny)
insert into user_roles (user_id, role)
select id, 'admin'::app_role
from auth.users
where email = 'TVUJ_EMAIL'
on conflict (user_id) do update set role = 'admin';

-- Update profilu
update profiles
set display_name = 'Admin'
where id = (select id from auth.users where email = 'TVUJ_EMAIL');

-- ============================================
-- Ukazkove kurikulum v DB
-- ============================================

-- Subjects
insert into curriculum_subjects (name, slug, description, emoji, sort_order) values
  ('Matematika', 'matematika', 'Pocty, geometrie, zlomky', '🔢', 1),
  ('Cestina', 'cestina', 'Pravopis, mluvnice, diktat', '📝', 2),
  ('Prvouka', 'prvouka', 'Príroda, spolecnost, zdravi', '🌿', 3)
on conflict (slug) do nothing;

-- Categories
insert into curriculum_categories (subject_id, name, slug, description, fun_fact, sort_order)
select s.id, c.name, c.slug, c.description, c.fun_fact, c.sort_order
from curriculum_subjects s
cross join (values
  ('matematika', 'Zakladni pocty', 'zakladni-pocty', 'Scitani, odcitani, nasobeni, deleni', 'Pocitani je zaklad vsecho!', 1),
  ('matematika', 'Zlomky', 'zlomky', 'Porovnavani, scitani, odcitani zlomku', 'Zlomky pouzivame kazdy den pri vareni!', 2),
  ('matematika', 'Porovnavani', 'porovnavani', 'Porovnavani cisel a vyrazu', 'Porovnavani je zaklad logiky', 3),
  ('cestina', 'Pravopis', 'pravopis', 'Pravidla ceskeho pravopisu', 'Cestina ma spoustu vyjimek!', 1),
  ('cestina', 'Vyjmenovana slova', 'vyjmenovana', 'Slova s y po obojetnych souhlaskach', 'Vyjmenovana slova se uci uz od 2. tridy', 2),
  ('prvouka', 'Priroda', 'priroda', 'Zvirata, rostliny, rocni obdobi', 'Na Zemi zije pres 8 milionu druhu!', 1)
) as c(subject_slug, name, slug, description, fun_fact, sort_order)
where s.slug = c.subject_slug
on conflict (subject_id, slug) do nothing;
