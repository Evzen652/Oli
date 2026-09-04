-- Add student_answer to session_logs
-- Uloží, CO přesně dítě odpovědělo (nejen správný klíč), aby rodič v modalu
-- „Ukázat výsledky a hodnocení" viděl u chybných úloh konkrétní chybu dítěte.
alter table session_logs
  add column if not exists student_answer text;
