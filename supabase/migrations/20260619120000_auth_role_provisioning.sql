-- Robustní provisioning nového uživatele.
--
-- Problém: role `parent` se dosud zakládala z klienta (Auth.tsx) až PO signupu.
-- Když ten insert selhal (síť / RLS / nepotvrzený e-mail), uživatel zůstal bez
-- role a spadl do žákovského UI. `handle_new_user` přitom zakládal jen profiles.
--
-- Řešení: trigger zakládá profiles I user_roles atomicky při vzniku auth.users.
-- Role se bere z metadat signupu (`raw_user_meta_data->>'role'`):
--   • děti z `pair-child` mají `user_metadata.role = 'child'`  → dostanou 'child'
--   • veřejná registrace rodiče (bez/`'parent'` v metadatech) → dostane 'parent'
-- Vše idempotentně (ON CONFLICT DO NOTHING), takže explicitní insert v
-- `pair-child` ani opakované spuštění nic nerozbije.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
BEGIN
  -- profiles (idempotentně)
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- role z metadat signupu; default 'parent' pro veřejnou registraci rodiče
  v_role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'parent')::public.app_role;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Backfill: existující uživatelé bez jakékoli role dostanou 'parent'.
-- Děti mají vždy řádek 'child' z pair-child → NOT EXISTS je přeskočí.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'parent'::public.app_role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id
)
ON CONFLICT (user_id, role) DO NOTHING;
