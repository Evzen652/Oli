-- Asset pipeline pro vizuální typy cvičení (image_select, diagram_label)
-- Obrázky generované AI (DALL-E přes Lovable) nebo nahrané adminem.
-- Slouží jako reusable knihovna napříč úlohami.

CREATE TABLE IF NOT EXISTS public.exercise_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- URL na hostovaný obrázek (Supabase Storage / externí CDN)
  url TEXT NOT NULL,
  -- Krátký popis pro SEO + accessibility (alt text)
  alt_text TEXT NOT NULL,
  -- Prompt použitý při AI generaci (pro audit a re-generation)
  generation_prompt TEXT,
  -- Tagy pro vyhledávání: "matematika", "trojúhelník", "savec"
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  -- Volitelná vazba na konkrétní podtéma (pomáhá omezit duplicity)
  skill_id TEXT,
  -- Jak byl asset pořízen
  source TEXT NOT NULL DEFAULT 'ai_generated'
    CHECK (source IN ('ai_generated', 'manual_upload', 'external')),
  -- Status pro curation (pending = AI vygenerovala, approved = admin schválil)
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pro rychlé vyhledávání podle tagů + skillu
CREATE INDEX IF NOT EXISTS exercise_assets_skill_idx
  ON public.exercise_assets (skill_id, status, is_active);
CREATE INDEX IF NOT EXISTS exercise_assets_tags_idx
  ON public.exercise_assets USING GIN (tags);

-- RLS — admin spravuje vše, ostatní authenticated čtou approved
ALTER TABLE public.exercise_assets ENABLE ROW LEVEL SECURITY;

-- RLS policies — admin via user_roles tabulka
CREATE POLICY "Admins manage assets"
ON public.exercise_assets FOR ALL
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

CREATE POLICY "Authenticated read approved assets"
ON public.exercise_assets FOR SELECT
USING (is_active = true AND status = 'approved');

COMMENT ON TABLE public.exercise_assets IS
  'Knihovna obrázků pro vizuální typy cvičení (image_select, diagram_label).';

-- Storage bucket pro obrázky (vytvoří se ručně v Supabase Dashboard,
-- pokud ještě neexistuje — skript jen zaznamená očekávanou existenci)
-- Bucket: "exercise-assets", public-read, max 5MB per file, image/* MIME types
