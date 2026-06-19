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
--
-- Idempotence přes WHERE NOT EXISTS (NE ON CONFLICT): remote schéma se rozešlo
-- s migracemi a `user_roles` tam nemá composite unique (user_id, role), takže
-- ON CONFLICT by selhal (42P10). WHERE NOT EXISTS funguje bez ohledu na constrainty.

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
  SELECT NEW.id
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

-- Backfill: existující uživatelé bez jakékoli role dostanou 'parent'.
-- Děti mají vždy řádek 'child' z pair-child → NOT EXISTS je přeskočí.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'parent'::public.app_role
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id
);
