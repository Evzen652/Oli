-- Admin „OK" stav jednotlivých ukázkových karet cvičení
--
-- Admin prochází v adminu ukázky ze šablony a označuje je jako zkontrolované (OK).
-- Stav musí platit napříč počítači (admin pracuje střídavě na dvou PC) → sdílená
-- tabulka místo localStorage.
--
-- Klíč karty (card_key) = `${skill_id}::${otázka}::${správná odpověď}` (z klienta).

CREATE TABLE IF NOT EXISTS public.admin_reviewed_cards (
  -- Stabilní klíč karty (skill.id + otázka + odpověď) — viz cardKey() v useExerciseReview.ts
  card_key TEXT NOT NULL PRIMARY KEY,
  -- Podtéma, do kterého karta patří (pro případné filtrování/úklid)
  skill_id TEXT NOT NULL,
  -- Kdo označil
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_reviewed_cards_skill_idx
  ON public.admin_reviewed_cards (skill_id);

-- RLS — pouze admini (review je interní nástroj). Stav je sdílený mezi všemi adminy.
ALTER TABLE public.admin_reviewed_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage reviewed cards"
ON public.admin_reviewed_cards FOR ALL
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
