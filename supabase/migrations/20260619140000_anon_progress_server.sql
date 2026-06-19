-- Fáze 3 (Možnost B) — anon pokrok serverově, token-based úložiště.
--
-- Klient vygeneruje náhodný anon_token (uuid) a drží ho v localStorage.
-- Pokrok i trial se ukládají serverově pod tímto tokenem.
--
-- BEZPEČNOST: RLS zapnuto BEZ veřejných policy → anon/authenticated klient
-- tabulky NEČTE ani NEZAPISUJE přímo. Veškerý přístup jde přes service-role
-- edge funkci `anon-progress` (service role obchází RLS). Token = tajemství,
-- takže žádné klientské čtení = žádný leak cizího pokroku.

-- Splněné úkoly (1 řádek per token × topic).
CREATE TABLE IF NOT EXISTS public.anon_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_token uuid NOT NULL,
  grade int CHECK (grade BETWEEN 1 AND 9),
  topic_id text NOT NULL,
  completed boolean NOT NULL DEFAULT true,
  score real,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (anon_token, topic_id)
);
CREATE INDEX IF NOT EXISTS anon_progress_token_idx ON public.anon_progress (anon_token);

-- Stav trialu (1 řádek per token).
CREATE TABLE IF NOT EXISTS public.anon_trial (
  anon_token uuid PRIMARY KEY,
  grade int CHECK (grade BETWEEN 1 AND 9),
  started_at timestamptz NOT NULL DEFAULT now()
);

-- RLS zapnuto, ZÁMĚRNĚ bez policy → jen service role (edge funkce) má přístup.
ALTER TABLE public.anon_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anon_trial ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.anon_progress IS
  'Fáze 3: serverový anon pokrok dle anon_token. Přístup jen přes edge funkci anon-progress (service role). RLS bez policy = klient nemá přímý přístup.';
COMMENT ON TABLE public.anon_trial IS
  'Fáze 3: serverový stav anon trialu dle anon_token. Přístup jen přes edge funkci anon-progress.';
