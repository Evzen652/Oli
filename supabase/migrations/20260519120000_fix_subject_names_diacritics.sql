-- ═══════════════════════════════════════════════════════════════════════════
-- Oprava názvů předmětů — diakritika
-- ═══════════════════════════════════════════════════════════════════════════
-- AI někdy navrhuje názvy předmětů bez diakritiky (Cestina, Dejepis…).
-- Tato migrace opravuje názvy dle slug → kanonické jméno.
-- Bezpečné spouštět opakovaně (UPDATE WHERE slug = '...' AND name != '...').
-- ═══════════════════════════════════════════════════════════════════════════

UPDATE curriculum_subjects SET name = 'čeština'       WHERE slug = 'cestina'     AND name != 'čeština';
UPDATE curriculum_subjects SET name = 'matematika'     WHERE slug = 'matematika'  AND name != 'matematika';
UPDATE curriculum_subjects SET name = 'prvouka'        WHERE slug = 'prvouka'     AND name != 'prvouka';
UPDATE curriculum_subjects SET name = 'přírodověda'    WHERE slug = 'prirodoveda' AND name != 'přírodověda';
UPDATE curriculum_subjects SET name = 'vlastivěda'     WHERE slug = 'vlastiveda'  AND name != 'vlastivěda';
UPDATE curriculum_subjects SET name = 'dějepis'        WHERE slug = 'dejepis'     AND name != 'dějepis';
UPDATE curriculum_subjects SET name = 'zeměpis'        WHERE slug IN ('zemepis', 'zemeopis', 'zemeris') AND name != 'zeměpis';
UPDATE curriculum_subjects SET name = 'informatika'    WHERE slug = 'informatika' AND name != 'informatika';
UPDATE curriculum_subjects SET name = 'anglický jazyk' WHERE slug = 'anglictina'  AND name != 'anglický jazyk';
UPDATE curriculum_subjects SET name = 'německý jazyk'  WHERE slug = 'nemcina'     AND name != 'německý jazyk';
UPDATE curriculum_subjects SET name = 'fyzika'         WHERE slug = 'fyzika'      AND name != 'fyzika';
UPDATE curriculum_subjects SET name = 'chemie'         WHERE slug = 'chemie'      AND name != 'chemie';
UPDATE curriculum_subjects SET name = 'biologie'       WHERE slug = 'biologie'    AND name != 'biologie';
