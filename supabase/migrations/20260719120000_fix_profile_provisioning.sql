-- 🔴 BLOCKER: veřejná registrace rodiče vracela 500 a NEŠLA dokončit.
--
-- Příznak (ostrá DB, ověřeno 2026-07-19 přes /auth/v1/signup):
--   {"code":"23502","message":"null value in column \"id\" of relation
--    \"profiles\" violates not-null constraint",
--    "detail":"Failing row contains (null, null, cs, …, <uuid>)"}
--
-- Příčina: remote schéma se rozešlo s migracemi. Repo obsahuje DVĚ neslučitelné
-- definice `profiles`:
--   • supabase/schema.sql        → id uuid PK REFERENCES auth.users(id)  (bez defaultu)
--   • migrace 20260219195831     → id uuid PK DEFAULT gen_random_uuid() + user_id
-- Ostrá DB odpovídá té první (id NOT NULL, BEZ defaultu), zatímco
-- `handle_new_user` i klientský upsert v `useProfile.ts` vkládají pouze
-- `user_id` a spoléhají, že `id` si Postgres doplní sám. Nedoplní → 23502.
--
-- Proč se to neprojevilo dřív: existující účty (admin, demo, spárované děti)
-- vznikly před rozejitím schématu. Trigger se láme jen na NOVÉ registraci,
-- kterou od té doby nikdo nezkusil.
--
-- Oprava: vkládat `id` EXPLICITNĚ hodnotou NEW.id. Funguje bez ohledu na to,
-- kterou z obou variant schématu daná instance reálně má:
--   • je-li id FK na auth.users → NEW.id je platný odkaz
--   • je-li id samostatný PK    → NEW.id je unikátní UUID
-- Nespoléháme tedy na existenci defaultu ani na tvar FK.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
BEGIN
  -- profiles (idempotentně) — `id` explicitně, viz hlavička migrace.
  INSERT INTO public.profiles (id, user_id)
  SELECT NEW.id, NEW.id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = NEW.id
  );

  -- role z metadat signupu; default 'parent' pro veřejnou registraci rodiče
  v_role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'parent')::public.app_role;

  INSERT INTO public.user_roles (user_id, role)
  SELECT NEW.id, v_role
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles r WHERE r.user_id = NEW.id AND r.role = v_role
  );

  RETURN NEW;
END;
$$;

-- Backfill: uživatelé, kterým profil kvůli téhle chybě nevznikl.
-- (Bez profilu spadne rodič po přihlášení do nekonečného onboardingu —
--  App.tsx routuje `parent` bez `display_name` vždy na /onboarding.)
INSERT INTO public.profiles (id, user_id)
SELECT u.id, u.id
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);
