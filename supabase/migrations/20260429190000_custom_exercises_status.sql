-- Custom exercises curation workflow
-- Status flow: pending -> approved | rejected
-- - pending  : AI vygenerovalo, čeká na revizi adminem
-- - approved : admin schválil, žáci vidí
-- - rejected : admin odmítl, neukazovat (ale ponechat audit)
--
-- Existující řádky se backfillem označí jako 'approved' (předpokládáme,
-- že admin je už dříve schvaloval ručně tím, že je uložil).
--
-- is_active zůstává pro soft-delete (ortogonální vůči status).

ALTER TABLE public.custom_exercises
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- Backfill existujících řádků jako approved (jsou tam, protože je admin uložil)
UPDATE public.custom_exercises
  SET status = 'approved'
  WHERE status = 'pending'
    AND created_at < NOW();

-- Index pro rychlé filtrování při načítání pro žáka
CREATE INDEX IF NOT EXISTS custom_exercises_skill_status_idx
  ON public.custom_exercises (skill_id, status, is_active);

COMMENT ON COLUMN public.custom_exercises.status IS
  'Curation status: pending (čeká na revizi) | approved (žáci vidí) | rejected (odmítnuto)';
