-- Child re-login PIN (blocker spuštění pilotu 2–4).
-- Umožní dítěti vrátit se do svého účtu po odhlášení / vymazání session
-- bez nutnosti generovat nový párovací kód. PIN nastavuje/resetuje rodič,
-- ukládá se výhradně jako PBKDF2-SHA256 hash (nikdy plaintext). Ověření PINu
-- a vydání session dělá edge funkce child-relogin (service role).

ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS pin_hash text,
  ADD COLUMN IF NOT EXISTS pin_failed_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pin_locked_until timestamptz;

COMMENT ON COLUMN public.children.pin_hash IS
  'PBKDF2-SHA256 hash PINu dítěte (formát pbkdf2$iter$salt$hash). NULL = PIN nenastaven. Zapisuje edge funkce set-child-pin.';
COMMENT ON COLUMN public.children.pin_failed_attempts IS
  'Počet po sobě jdoucích chybných pokusů o PIN. Reset na 0 při úspěchu i při nastavení nového PINu.';
COMMENT ON COLUMN public.children.pin_locked_until IS
  'Do kdy je PIN re-login dočasně zamčen po překročení limitu chybných pokusů. NULL = odemčeno.';
