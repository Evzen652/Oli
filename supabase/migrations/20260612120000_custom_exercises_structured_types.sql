-- Přidání strukturovaných polí pro match_pairs a multi_select
-- do custom_exercises tabulky.
--
-- pairs: JSON pole {left, right} objektů (match_pairs cvičení)
-- correct_answers: JSON pole stringů (multi_select správné odpovědi)
--
-- Typ cvičení se detekuje strukturálně (přítomnost polí), nikoli
-- samostatným input_type sloupcem — stejný přístup jako u PracticeInputRouter.

ALTER TABLE public.custom_exercises
  ADD COLUMN IF NOT EXISTS pairs JSONB,
  ADD COLUMN IF NOT EXISTS correct_answers JSONB;

COMMENT ON COLUMN public.custom_exercises.pairs IS
  'match_pairs: [{left: string, right: string}, ...] — správná odpověď = "match"';
COMMENT ON COLUMN public.custom_exercises.correct_answers IS
  'multi_select: pole správných odpovědí; správná odpověď = join(",")';
