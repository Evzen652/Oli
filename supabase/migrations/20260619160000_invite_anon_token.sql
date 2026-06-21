-- Fáze 3 / 3b — token do pozvánky.
-- parent_invitations nese anon_token, aby šel serverový anon pokrok adoptovat
-- na dítě i bez localStorage (cross-device cesta přes pozvánku).
-- Aditivní, nullable.

ALTER TABLE public.parent_invitations
  ADD COLUMN IF NOT EXISTS anon_token uuid;

COMMENT ON COLUMN public.parent_invitations.anon_token IS
  'Fáze 3: anon_token odesílatele (dítěte) — pro adopci serverového pokroku po registraci rodiče.';
