-- Registrované předměty 2. stupně bez obsahu se zobrazí POUZE v 8. ročníku.
-- Tím jsou splněny všechny požadavky: ne v 2., ne v 6., ne v 9. ročníku, ano v 8.
UPDATE public.curriculum_subjects
  SET grade_min = 8, grade_max = 8
  WHERE slug IN ('biologie', 'chemie', 'fyzika', 'dejepis',
                 'zemeris', 'zemeopis', 'zemepis', 'cestina');
-- matematika zůstane [1,9] — má code obsah pro všechny ročníky
