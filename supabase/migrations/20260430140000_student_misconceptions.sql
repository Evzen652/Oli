-- Misconception detection — uložené vzorce chyb pro každé dítě a skill.
-- AI periodicky analyzuje session_logs a detekuje opakující se nesprávné
-- vzorce ("zaměňuje sčítání s násobením u zlomků", "vynechává čárky").
-- Adaptivní engine při výběru další úlohy preferuje témata kde má dítě
-- aktivní misconception → terapeutické cvičení.

CREATE TABLE IF NOT EXISTS public.student_misconceptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Vazba na dítě (children.id) nebo přímo user_id (legacy / před spárováním)
  child_id UUID,
  user_id UUID,
  -- Skill, kterého se misconception týká (code_skill_id)
  skill_id TEXT NOT NULL,
  -- Krátký popis vzoru chyby (max 1 věta, AI generated)
  pattern_label TEXT NOT NULL,
  -- Detailní vysvětlení pro rodiče/admina
  description TEXT,
  -- Doporučení co s tím (1-2 věty)
  suggestion TEXT,
  -- Síla detekce: 0.0 = velmi slabá, 1.0 = vysoká jistota
  confidence REAL NOT NULL DEFAULT 0.5,
  -- Počet pokusů, ze kterých byl pattern detekován
  evidence_count INTEGER NOT NULL DEFAULT 1,
  -- Stav: aktivní (žák stále chybuje), resolved (vyřešeno — N úspěchů v řadě)
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'resolved', 'dismissed')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Constraint: alespoň jedno z child_id / user_id musí být
  CONSTRAINT student_misconceptions_target_check
    CHECK (child_id IS NOT NULL OR user_id IS NOT NULL)
);

-- Index pro rychlé fetch per dítě nebo per user
CREATE INDEX IF NOT EXISTS student_misconceptions_child_idx
  ON public.student_misconceptions (child_id, status, skill_id);
CREATE INDEX IF NOT EXISTS student_misconceptions_user_idx
  ON public.student_misconceptions (user_id, status, skill_id);
-- Pro adaptivní engine — najít aktivní misconceptions napříč skilly
CREATE INDEX IF NOT EXISTS student_misconceptions_active_idx
  ON public.student_misconceptions (status, confidence DESC)
  WHERE status = 'active';

-- RLS — admin manage, parent vidí svoje děti, žák vidí svoje
ALTER TABLE public.student_misconceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage misconceptions"
ON public.student_misconceptions FOR ALL
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

-- Rodič vidí misconceptions svých dětí
CREATE POLICY "Parent reads own children's misconceptions"
ON public.student_misconceptions FOR SELECT
USING (
  child_id IS NOT NULL AND child_id IN (
    SELECT id FROM public.children WHERE parent_user_id = auth.uid()
  )
);

-- Žák vidí svoje misconceptions (přes user_id nebo přes paired child_user_id)
CREATE POLICY "Student reads own misconceptions"
ON public.student_misconceptions FOR SELECT
USING (
  user_id = auth.uid() OR
  (child_id IS NOT NULL AND child_id IN (
    SELECT id FROM public.children WHERE child_user_id = auth.uid()
  ))
);

COMMENT ON TABLE public.student_misconceptions IS
  'AI-detekované vzorce chyb pro adaptivní engine + rodičovský feedback.';
COMMENT ON COLUMN public.student_misconceptions.pattern_label IS
  'Krátký label vzoru, např. "Záměna sčítání a násobení u zlomků".';
COMMENT ON COLUMN public.student_misconceptions.confidence IS
  'AI jistota detekce 0-1. Pod 0.6 = pravděpodobné, nad 0.8 = vysoká.';
