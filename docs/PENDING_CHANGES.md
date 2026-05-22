# Pending Changes — požadavky mezi sessions

> Sem píší grade-N sessions, když potřebují něco, co nemůžou udělat samy
> (změna sdílených typů, DB schema, UI komponent, ...).
>
> Architekt po vyřízení požadavek označí ✅ a přesune do "Vyřízené".

---

## Otevřené

### Hint leak v grade-4 geometrii a průměru (pre-existing)
- `src/content/grade-4/matematika/trojuhelnikDruhyStran.ts` — hints obsahují správnou odpověď
- `src/content/grade-4/matematika/aritmetickyPrumerUvod.ts` — hint #2 prozrazuje výsledek
- Opravit: přepsat hints tak, aby neobsahovaly `correctAnswer` jako podřetězec

### `audit:pedagogical` script nefunguje na Windows CMD
- Prefix `AUDIT_PEDAGOGICAL=1` nefunguje v `cmd.exe` 
- Řešení: přidat `cross-env` do devDependencies, nebo dokumentovat jen pro Git Bash

---

## Vyřízené

### 2026-05-22 — Noční pipeline (Tasks 1–6) ✅
Viz `docs/MORNING_SUMMARY_2026-05-22.md` pro úplný přehled.
- Task 1: refactor/inputtype-per-task
- Task 2: feat/new-input-types
- Task 3: feat/templated-facts
- Task 4: feat/parent-first
- Task 5: feat/student-ui
- Task 6: feat/pedagogical-audit-pipeline
