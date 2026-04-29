-- Multi-předmět infrastruktura
-- Subject metadata, které dříve byly hardcoded ve frontendu, přesouváme do DB.
-- Tím admin/AI mohou přidávat nové předměty bez kódových změn.

-- Vizuální + AI prompt rozšíření per předmět
ALTER TABLE public.curriculum_subjects
  ADD COLUMN IF NOT EXISTS emoji TEXT,
  ADD COLUMN IF NOT EXISTS color_hue INTEGER,    -- 0-360 HSL hue pro generování barev
  ADD COLUMN IF NOT EXISTS ai_prompt_extra TEXT, -- per-předmět doplnění do system promptu při generování
  ADD COLUMN IF NOT EXISTS hook TEXT;            -- 1-věta motivace pro žáka

-- Backfill pro existující předměty (synchronizace s frontend SUBJECTS map)
UPDATE public.curriculum_subjects SET emoji = '🔢',
  hook = 'Matematika tě naučí počítat, porovnávat a řešit úlohy — v obchodě, ve hře i v životě!',
  ai_prompt_extra = 'Matematika: Drž se aritmetiky a geometrie přiměřené ročníku. Pro slovní úlohy používej kontext z běžného života (nákupy, čas, vzdálenost). U geometrických úloh popisuj rozměry slovy.'
  WHERE slug = 'matematika' AND emoji IS NULL;

UPDATE public.curriculum_subjects SET emoji = '📝',
  hook = 'Čeština je klíč ke správnému psaní, čtení a porozumění — ve škole i na internetu!',
  ai_prompt_extra = 'Čeština: Důsledně používej diakritiku. U doplňovaček dej žákovi otázku jak má slovo doplnit. U slovních druhů je kontext věty kritický. Vyhýbej se nářečním tvarům, používej spisovnou češtinu.'
  WHERE slug = 'cestina' AND emoji IS NULL;

UPDATE public.curriculum_subjects SET emoji = '🌍',
  hook = 'Prvouka ti ukáže, jak funguje příroda, lidské tělo i svět kolem tebe!',
  ai_prompt_extra = 'Prvouka: Zaměř se na pozorování přírody, denní život, rodinu, povolání, dopravu, čas. Buď konkrétní (lev nebo medvěd, ne savec obecně). Pro 1-3. třídu používej jednoduchá souvětí.'
  WHERE slug = 'prvouka' AND emoji IS NULL;

UPDATE public.curriculum_subjects SET emoji = '🌿',
  hook = 'Přírodověda ti ukáže, jak fungují ekosystémy, koloběh vody i svět hornin!',
  ai_prompt_extra = 'Přírodověda: Pokrýt ekosystémy, koloběh vody, počasí, geologii, fyziku přírody, lidské tělo. Pro 4-5. třídu už lze používat odbornější pojmy s vysvětlením.'
  WHERE slug = 'prirodoveda' AND emoji IS NULL;

UPDATE public.curriculum_subjects SET emoji = '🗺️',
  hook = 'Vlastivěda tě provede kraji Česka, jeho historií a státními symboly!',
  ai_prompt_extra = 'Vlastivěda: Český obsah — kraje, města, řeky, hory, historie ČR od pravěku po současnost, státní symboly, ústava. Spojuj zeměpis s historií když to dává smysl.'
  WHERE slug = 'vlastiveda' AND emoji IS NULL;

-- Pro nově přidávané předměty (zeměpis, chemie, fyzika, ...): admin nastavuje
-- hook + ai_prompt_extra ve správě kurikula. Pokud null → frontend použije
-- generický fallback (hash-based hue, default emoji).

COMMENT ON COLUMN public.curriculum_subjects.emoji IS
  'Emoji pro UI (subject card, sidebar). Když NULL, použije se generický fallback.';
COMMENT ON COLUMN public.curriculum_subjects.color_hue IS
  'HSL hue 0-360 pro barvy v UI. Když NULL, vygeneruje se z hashe slugu.';
COMMENT ON COLUMN public.curriculum_subjects.ai_prompt_extra IS
  'Per-předmět doplňková instrukce, která se přidá do system promptu při AI generování úloh.';
COMMENT ON COLUMN public.curriculum_subjects.hook IS
  'Krátký motivační text (1 věta) pro žáka — proč je tento předmět zajímavý.';
