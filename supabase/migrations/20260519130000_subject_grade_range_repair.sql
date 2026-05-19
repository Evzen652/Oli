-- Repair migrace: zajistí existenci grade_min/grade_max sloupců na curriculum_subjects.
-- ADD COLUMN IF NOT EXISTS je bezpečné i při opakovaném spuštění.

ALTER TABLE public.curriculum_subjects
  ADD COLUMN IF NOT EXISTS grade_min INTEGER,
  ADD COLUMN IF NOT EXISTS grade_max INTEGER;

-- Backfill dle RVP ZV — bezpečné i opakovaně (SET WHERE slug = ...)
UPDATE public.curriculum_subjects SET grade_min = 1, grade_max = 9 WHERE slug = 'matematika';
UPDATE public.curriculum_subjects SET grade_min = 1, grade_max = 9 WHERE slug = 'cestina';
UPDATE public.curriculum_subjects SET grade_min = 1, grade_max = 3 WHERE slug = 'prvouka';
UPDATE public.curriculum_subjects SET grade_min = 4, grade_max = 5 WHERE slug = 'prirodoveda';
UPDATE public.curriculum_subjects SET grade_min = 4, grade_max = 5 WHERE slug = 'vlastiveda';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 9 WHERE slug = 'biologie';
UPDATE public.curriculum_subjects SET grade_min = 8, grade_max = 9 WHERE slug = 'chemie';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 9 WHERE slug = 'fyzika';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 9 WHERE slug = 'dejepis';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 9 WHERE slug IN ('zemeris', 'zemeopis', 'zemepis');
UPDATE public.curriculum_subjects SET grade_min = 4, grade_max = 9 WHERE slug = 'informatika';
UPDATE public.curriculum_subjects SET grade_min = 3, grade_max = 9 WHERE slug = 'anglictina';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 9 WHERE slug = 'nemcina';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 9 WHERE slug = 'obcanska';
