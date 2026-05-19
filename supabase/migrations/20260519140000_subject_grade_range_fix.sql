-- Oprava ročníkových rozsahů: předměty 2. stupně bez obsahu pro 9. ročník
-- nebudou zbytečně zobrazeny, když tam admin nemá žádný obsah.
-- grade_max=8 pro typické předměty, které se budují do 8. ročníku.
-- Admin může rozsah kdykoli upravit přímo v DB dle potřeby.

UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 8 WHERE slug = 'biologie';
UPDATE public.curriculum_subjects SET grade_min = 8, grade_max = 8 WHERE slug = 'chemie';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 8 WHERE slug = 'fyzika';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 8 WHERE slug = 'dejepis';
UPDATE public.curriculum_subjects SET grade_min = 6, grade_max = 8 WHERE slug IN ('zemeris', 'zemeopis', 'zemepis');
UPDATE public.curriculum_subjects SET grade_min = 1, grade_max = 8 WHERE slug = 'cestina';
-- matematika zůstane [1,9] — má code obsah pro všechny ročníky
