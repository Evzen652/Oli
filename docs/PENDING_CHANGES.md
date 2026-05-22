# Pending Changes — požadavky mezi sessions

> Sem píší grade-N sessions, když potřebují něco, co nemůžou udělat samy
> (změna sdílených typů, DB schema, UI komponent, ...).
>
> Architekt po vyřízení požadavek označí ✅ a přesune do "Vyřízené".

---

## Otevřené

### Rozdělení historie procvičování podle původu (parent vs. self)
- `session_logs` neobsahuje `origin` pole (parent / self).
- Pro správné rozdělení v dětském UI je potřeba přidat
  `session_logs.origin enum ('parent', 'self')` + naplnit při insertu z FSM
  podle session source.
- Odloženo z follow-up ČÁST C bod 2 — bez DB migrace nelze čistě implementovat.

---

## Vyřízené

### 2026-05-22 — audit:pedagogical cross-platform wrapper ✅
- `scripts/run-audit-pedagogical.mjs` — node wrapper bez `cross-env` dep
- Funguje v Linux, macOS, Git Bash i Windows CMD/PowerShell

### 2026-05-22 — Follow-up po review (Hint leaks + Parent UI + Student UI) ✅
- ✅ Hint leaks (3 soubory) — branch `fix/hint-leaks-grade-4`,
  audit: 0 hint_leak issues, 100% passingPct
- ✅ Parent report: positive_observation + next_week_plan (backend i UI)
- ✅ Student UI: filtry 1-5 za FEATURES, displayName fallback

### 2026-05-22 — Noční pipeline (Tasks 1–6) ✅
Viz `docs/MORNING_SUMMARY_2026-05-22.md` pro úplný přehled.
- Task 1: refactor/inputtype-per-task
- Task 2: feat/new-input-types
- Task 3: feat/templated-facts
- Task 4: feat/parent-first
- Task 5: feat/student-ui
- Task 6: feat/pedagogical-audit-pipeline
