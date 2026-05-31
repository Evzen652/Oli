-- Custom illustrations — vlastní ilustrace generované přes admin panel.
--
-- Slouží jako registr custom klíčů (nesouvisí s topicy/categorie z RVP).
-- Příklady: practice-decor-globe, landing-rodic-propojeni, atd.
--
-- Soubor PNG se ukládá do storage bucketu prvouka-images jako {key}.png.
-- Tato tabulka eviduje, které custom klíče existují + jejich prompt
-- pro pozdější regeneraci.

CREATE TABLE IF NOT EXISTS public.custom_illustrations (
  key TEXT NOT NULL PRIMARY KEY,
  description TEXT NOT NULL,
  -- Wrapped prompt který se poslal do edge funkce (pro audit / debug)
  full_prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Counter — kolikrát byla ilustrace přegenerována
  generations INTEGER NOT NULL DEFAULT 1
);

-- Index pro řazení podle data
CREATE INDEX IF NOT EXISTS custom_illustrations_created_idx
  ON public.custom_illustrations (created_at DESC);

-- RLS — admin manage, ostatní jen čtou (pro případ public použití v UI)
ALTER TABLE public.custom_illustrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage custom illustrations"
ON public.custom_illustrations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Veřejné čtení — ilustrace se renderují i pro nepřihlášené (anon trial)
CREATE POLICY "Anyone reads custom illustrations"
ON public.custom_illustrations FOR SELECT
USING (true);

-- Auto-update updated_at při změně
CREATE OR REPLACE FUNCTION public.touch_custom_illustration()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER custom_illustrations_touch
  BEFORE UPDATE ON public.custom_illustrations
  FOR EACH ROW EXECUTE FUNCTION public.touch_custom_illustration();

COMMENT ON TABLE public.custom_illustrations IS
  'Registr vlastních ilustrací generovaných přes admin panel. Soubor PNG je v storage bucketu prvouka-images.';
COMMENT ON COLUMN public.custom_illustrations.key IS
  'Slug bez diakritiky, slouží jako filename {key}.png ve storage.';
COMMENT ON COLUMN public.custom_illustrations.generations IS
  'Počet generování — inkrementuje se při každém regenerate.';
