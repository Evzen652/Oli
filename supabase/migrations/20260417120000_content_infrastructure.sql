-- ═══════════════════════════════════════════════════════════════════════════
-- CONTENT INFRASTRUCTURE — homeschool-ready ZŠ 1.-9.
-- ═══════════════════════════════════════════════════════════════════════════
-- Připraví platformu pro profesionální vzdělávací obsah napříč všemi
-- akademickými předměty (ne výtvarka/hudebka/tělocvik/jazyky).
--
-- Tři pilíře:
--   1) content_type taxonomie — algoritmický/faktický/konceptuální/smíšený
--   2) curriculum_facts — knowledge base pro faktické předměty (dějepis,
--      zeměpis, biologie, atd.) — AI nikdy negeneruje fakta z paměti, pouze
--      z této KB přes RAG
--   3) prerequisites & quality_tier — explicitní závislosti + kvalitní řady
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Rozšíření curriculum_skills ────────────────────────────────────────
-- content_type určuje, JAK se obsah pro tuto dovednost generuje a validuje
ALTER TABLE curriculum_skills
  ADD COLUMN IF NOT EXISTS content_type TEXT
  NOT NULL DEFAULT 'algorithmic'
  CHECK (content_type IN ('algorithmic', 'factual', 'conceptual', 'mixed'));

COMMENT ON COLUMN curriculum_skills.content_type IS
'Určuje generační strategii a validaci:
 • algorithmic — pure funkce, unit testy ověří správnost
 • factual    — generováno z curriculum_facts (KB), zdroj povinný
 • conceptual — AI + 3-vrstvá validace + humanní review
 • mixed      — kombinace algoritmického a faktického';

-- prerequisites — explicitní seznam dovedností nutných PŘED touto (vertikální kontinuita)
ALTER TABLE curriculum_skills
  ADD COLUMN IF NOT EXISTS prerequisites JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN curriculum_skills.prerequisites IS
'Seznam code_skill_id které musí žák umět před touto dovedností.
 Adaptive engine je používá pro "návrat o krok" při zaostávání.
 Příklad: ["math-frac-intro", "math-decimal-intro"] pro 6. ročník zlomků.';

-- rvp_reference — explicitní odkaz na RVP kód (pro governance a reporting)
ALTER TABLE curriculum_skills
  ADD COLUMN IF NOT EXISTS rvp_reference TEXT;

COMMENT ON COLUMN curriculum_skills.rvp_reference IS
'Odkaz na příslušný výstupní ukazatel RVP ZV, např. "M-5-1-03" (matematika, 5. roč., …).
 Umožňuje reportování pokrytí kurikula a export pro dokumentaci homeschoolu.';

-- ── 2. Rozšíření custom_exercises ─────────────────────────────────────────
-- quality_tier určuje, kdy smí cvičení vidět žák
ALTER TABLE custom_exercises
  ADD COLUMN IF NOT EXISTS quality_tier TEXT
  NOT NULL DEFAULT 'ai_raw'
  CHECK (quality_tier IN ('validated', 'ai_validated', 'ai_raw', 'needs_review'));

COMMENT ON COLUMN custom_exercises.quality_tier IS
'Úroveň kvality cvičení — určuje viditelnost pro žáka:
 • validated     — 🟢 humanně validované (seed nebo schválené kurátorem)
 • ai_validated  — 🟡 prošlo 3-vrstvou AI validací (format + grade + correctness)
 • ai_raw        — 🔴 AI-generované bez review, NEZOBRAZOVAT žákovi
 • needs_review  — ⚠️ AI-validated ale označeno k humannímu review (chyby žáků apod.)
Žák vidí jen validated a ai_validated.';

-- validated_by / validated_at — metadata kurátorského schválení
ALTER TABLE custom_exercises
  ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES auth.users(id);

ALTER TABLE custom_exercises
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ;

-- fact_ids — odkazy na curriculum_facts použité při generování (pro faktické cvičení)
ALTER TABLE custom_exercises
  ADD COLUMN IF NOT EXISTS fact_ids JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN custom_exercises.fact_ids IS
'Pro cvičení typu "factual" nebo "mixed" — seznam ID faktů z curriculum_facts,
 které AI použila při generování. Umožňuje dohledat zdroj a provést audit.';

-- ── 3. Nová tabulka: curriculum_facts (knowledge base) ────────────────────
CREATE TABLE IF NOT EXISTS curriculum_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES curriculum_skills(id) ON DELETE CASCADE,

  -- Typ faktu — určuje strukturu content
  fact_type TEXT NOT NULL CHECK (fact_type IN (
    'date',        -- historická událost s datem (rok/přesné datum)
    'entity',      -- osoba, místo, organizace, druh, atd.
    'concept',     -- definice pojmu
    'relation',    -- vztah mezi entitami ("A je hl. město B")
    'process',     -- sled kroků (biologie, chemie)
    'formula'      -- matematická/fyzikální formule s kontextem
  )),

  -- Strukturovaná data faktu (JSON schema podle fact_type)
  -- Např. pro 'date': {"event": "...", "year": 1620, "date": "...", "location": "...", "context": "..."}
  content JSONB NOT NULL,

  -- Zdroj — POVINNÝ! Žádný fact bez zdroje.
  source TEXT NOT NULL,
  source_page TEXT,              -- volitelně stránka/kapitola
  source_url TEXT,               -- volitelně URL

  -- Kurátorská metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  validated_by UUID REFERENCES auth.users(id),  -- kdo schválil
  validated_at TIMESTAMPTZ,

  -- Governance
  is_active BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE curriculum_facts IS
'Curated knowledge base pro faktické předměty (dějepis, zeměpis, biologie, atd.).
 AI generuje úlohy POUZE na základě zde uvedených faktů — nikdy z paměti.
 Každý fakt MUSÍ mít zdroj. Před zobrazením žákovi musí být validated_by ≠ NULL.';

CREATE INDEX IF NOT EXISTS idx_curriculum_facts_skill ON curriculum_facts(skill_id) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_curriculum_facts_type ON curriculum_facts(fact_type);
CREATE INDEX IF NOT EXISTS idx_curriculum_facts_validated ON curriculum_facts(validated_at) WHERE validated_at IS NOT NULL;

-- RLS: jen admin může editovat, všichni autentizovaní mohou číst aktivní fakta
ALTER TABLE curriculum_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_read_active_facts"
  ON curriculum_facts FOR SELECT
  USING (is_active = true);

CREATE POLICY "admin_can_insert_facts"
  ON curriculum_facts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "admin_can_update_facts"
  ON curriculum_facts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "admin_can_delete_facts"
  ON curriculum_facts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

-- ── 4. Audit log pro fakta (trackování změn) ─────────────────────────────
CREATE TABLE IF NOT EXISTS curriculum_facts_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_id UUID,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'validate', 'invalidate')),
  actor_id UUID REFERENCES auth.users(id),
  before JSONB,
  after JSONB,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE curriculum_facts_audit IS
'Audit log všech změn v curriculum_facts. Umožňuje vysledovat, kdo a kdy
 změnil fakt — klíčové pro governance a důvěryhodnost obsahu.';

CREATE INDEX IF NOT EXISTS idx_facts_audit_fact ON curriculum_facts_audit(fact_id);
CREATE INDEX IF NOT EXISTS idx_facts_audit_actor ON curriculum_facts_audit(actor_id);

ALTER TABLE curriculum_facts_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_can_read_audit"
  ON curriculum_facts_audit FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
  );

-- ── 5. Trigger: automatický audit ────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_curriculum_facts_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO curriculum_facts_audit (fact_id, action, actor_id, after)
    VALUES (NEW.id, 'create', auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Validace detekce
    IF OLD.validated_at IS NULL AND NEW.validated_at IS NOT NULL THEN
      INSERT INTO curriculum_facts_audit (fact_id, action, actor_id, before, after)
      VALUES (NEW.id, 'validate', auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    ELSIF OLD.validated_at IS NOT NULL AND NEW.validated_at IS NULL THEN
      INSERT INTO curriculum_facts_audit (fact_id, action, actor_id, before, after)
      VALUES (NEW.id, 'invalidate', auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    ELSE
      INSERT INTO curriculum_facts_audit (fact_id, action, actor_id, before, after)
      VALUES (NEW.id, 'update', auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO curriculum_facts_audit (fact_id, action, actor_id, before)
    VALUES (OLD.id, 'delete', auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_curriculum_facts_audit ON curriculum_facts;
CREATE TRIGGER trg_curriculum_facts_audit
  AFTER INSERT OR UPDATE OR DELETE ON curriculum_facts
  FOR EACH ROW EXECUTE FUNCTION log_curriculum_facts_change();

-- ── 6. Trigger: auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_curriculum_facts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_curriculum_facts_updated_at ON curriculum_facts;
CREATE TRIGGER trg_curriculum_facts_updated_at
  BEFORE UPDATE ON curriculum_facts
  FOR EACH ROW EXECUTE FUNCTION update_curriculum_facts_timestamp();

-- ── 7. Nastavit content_type pro existující dovednosti (inference) ───────
-- Matematika (gradeRange ≤ 9, subject = matematika) → algorithmic
UPDATE curriculum_skills
SET content_type = 'algorithmic'
WHERE content_type = 'algorithmic'  -- default, explicitní pro jistotu
  AND topic_id IN (
    SELECT t.id FROM curriculum_topics t
    JOIN curriculum_categories c ON c.id = t.category_id
    JOIN curriculum_subjects s ON s.id = c.subject_id
    WHERE s.slug = 'matematika'
  );

-- Dějepis/zeměpis/přírodopis → factual (pro budoucí seed)
-- Zatím žádné skills, ale až budou vytvořeny, nastaví se ručně

-- ── 8. View: content coverage — pro admin dashboard ──────────────────────
CREATE OR REPLACE VIEW content_coverage AS
SELECT
  s.slug AS subject_slug,
  s.name AS subject_name,
  c.slug AS category_slug,
  c.name AS category_name,
  t.slug AS topic_slug,
  t.name AS topic_name,
  sk.code_skill_id,
  sk.name AS skill_name,
  sk.grade_min,
  sk.grade_max,
  sk.content_type,
  sk.rvp_reference,
  COALESCE(jsonb_array_length(sk.prerequisites), 0) AS prerequisite_count,
  (SELECT COUNT(*) FROM custom_exercises ce WHERE ce.skill_id = sk.code_skill_id AND ce.is_active AND ce.quality_tier = 'validated') AS validated_exercises,
  (SELECT COUNT(*) FROM custom_exercises ce WHERE ce.skill_id = sk.code_skill_id AND ce.is_active AND ce.quality_tier = 'ai_validated') AS ai_validated_exercises,
  (SELECT COUNT(*) FROM custom_exercises ce WHERE ce.skill_id = sk.code_skill_id AND ce.is_active AND ce.quality_tier = 'ai_raw') AS ai_raw_exercises,
  (SELECT COUNT(*) FROM curriculum_facts f WHERE f.skill_id = sk.id AND f.is_active AND f.validated_at IS NOT NULL) AS validated_facts,
  (SELECT COUNT(*) FROM curriculum_facts f WHERE f.skill_id = sk.id AND f.is_active AND f.validated_at IS NULL) AS unvalidated_facts
FROM curriculum_skills sk
JOIN curriculum_topics t ON t.id = sk.topic_id
JOIN curriculum_categories c ON c.id = t.category_id
JOIN curriculum_subjects s ON s.id = c.subject_id
WHERE sk.is_active;

COMMENT ON VIEW content_coverage IS
'Přehled pokrytí obsahu — kolik ověřených cvičení a faktů má každá dovednost.
 Zdroj pro admin coverage dashboard. Zobrazuje v jedné řadě: subject → skill
 s počty cvičení per quality_tier a počty faktů.';
