# Pending Changes — požadavky mezi sessions

> Sem píší grade-N sessions, když potřebují něco, co nemůžou udělat samy
> (změna sdílených typů, DB schema, UI komponent, ...).
>
> Architekt po vyřízení požadavek označí ✅ a přesune do "Vyřízené".

---

## CI/CD + E2E testy (přidáno)
- GitHub Actions CI pipeline: .github/workflows/ci.yml
- GitHub Actions PR check: .github/workflows/pr-check.yml  
- Playwright E2E testy: e2e/ (landing, demo, auth, výkon, přístupnost)
- ⚠️ GitHub Secrets musí přidat Evžen ručně v repo Settings → Secrets:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

---

## Otevřené

### Email integrace pro parent_invitations (Krok D follow-up)
- Pozvánka se ukládá do `parent_invitations`, ale email se zatím **neodesílá automaticky**.
- Dialog dítěti říká "řekni rodiči ať se zaregistruje na oli-edu.com se stejným emailem".
- TODO: edge function s Resend/SendGrid integrací — odeslat email s registračním linkem `/auth?mode=register&invite={id}`.
- Až bude email integrace, status pozvánky se přechodí automaticky `pending → accepted` při kliknutí na link.

### Automatické propojení dítěte při akceptaci pozvánky rodičem
- Po `Auth.tsx` update `status: accepted`, **TODO**: vytvořit záznam v `children` propojující rodiče s dítětem.
- Závisí na child auth pattern (anon → registrovaný child user, nebo invite vytváří pending child profile).

### Migrace `parent_invitations` v Supabase
- Migrace `20260524180000_parent_invitations.sql` připravena, ale **musí být aplikována**:
  - Lokálně: `npx supabase db push`
  - Nebo přes Supabase Studio: SQL editor → run migration
- Po migraci regenerovat types: `npx supabase gen types typescript` (jinak zůstane `(supabase as any)` cast v kódu).

### Rozdělení historie procvičování podle původu (parent vs. self)
- `session_logs` neobsahuje `origin` pole (parent / self).
- Lze odvodit z `parent_assignments.skill_id IN session_logs.skill_id`,
  ale je to drahé a nepřesné (rodič mohl smazat assignment po splnění).
- **Pro správnou implementaci přidat `session_logs.origin` enum
  ('parent', 'self') + naplnit při insertu z FSM podle session source.**
- Odloženo z follow-up ČÁST C bod 2 — bez DB migrace nelze čistě implementovat.

---

## Vyřízené

### 2026-05-24 — Anonymní onboarding — Krok D ✅ (dítě pozve rodiče)
- ✅ `supabase/migrations/20260524180000_parent_invitations.sql` — tabulka + RLS (dítě vidí svoje, kdokoli vytváří, kdokoli updatuje status)
- ✅ `src/components/InviteParentDialog.tsx` — modal s emailem rodiče, validace, 2 stavy (form / sent confirmation)
- ✅ `AnonStudentPage.tsx` — nenápadné tlačítko "👪 Sdílet pokrok s rodiči" dole pod denními úkoly
- ✅ `Auth.tsx` — detekuje `?invite={id}` query param, po registraci označí pozvánku `status: accepted` + zobrazí informativní banner
- ⚠️ Email odesílání chybí (viz Otevřené), automatické propojení children chybí (viz Otevřené)

### 2026-05-24 — Anonymní onboarding — Krok C ✅ (přenos pokroku při registraci)
- ✅ `src/lib/anonMigration.ts` — `hasAnonProgress()`, `getAnonProgressSummary()`, `migrateAnonProgress(userId, childId)`, `clearAnonData()`
- ✅ `src/components/AnonMigrationDialog.tsx` — modální dialog s počtem splněných úkolů + tlačítka Přenést / Začít od začátku
- ✅ `ChildAuth.tsx` — po úspěšném spárování zobrazí dialog pokud existuje anon pokrok, migruje session_logs na child_id
- ✅ `Auth.tsx` — soft hint pro rodiče "Dítě má splněno X úkolů, přenese se po propojení"
- ⚠️ Migrace synthetic session_logs (1 row per topic, sdílený session_id), grade na children se updatuje jen pokud je default 0

### 2026-05-24 — Anonymní onboarding — Krok B ✅ (3 denní úkoly)
- ✅ `src/lib/anonDailyTasks.ts` — deterministický výběr 3 topics pro daný ročník (seed = datum + grade), preference různých předmětů, fallback na grade-4 pokud ročník nemá obsah
- ✅ `src/lib/anonProgress.ts` — `getTodayProgress()`, `markTaskCompleted()`, `allTasksCompleted()`, `clearAnonProgress()` — localStorage progress se resetuje při změně dne nebo ročníku
- ✅ `AnonStudentPage.tsx` — UI s 3 denními úkoly, CTA k registraci po splnění všech 3, sessionMode pro spuštění konkrétního úkolu
- ✅ `useSessionDispatch.ts` — při END stavu v anon módu se zavolá `markAnonTaskCompleted(topicId, score)` a vyhodí event `oli-anon-task-completed`
- ✅ `SessionView.tsx` — auto-start topicu zvoleného v AnonStudentPage přes sessionStorage `oli_anon_start_topic`

### 2026-05-24 — Anonymní onboarding — Krok A ✅ (anonymní vstup)
- ✅ `Onboarding.tsx` — výběr ročníku 1-9, ukládá `oli_anon_grade` do localStorage, přesměrování na `/student?anon=1`
- ✅ `AnonStudentPage.tsx` — banner "Procvičuješ jako host", grade z localStorage (rozšířeno v Kroku B)
- ✅ `App.tsx` — `/onboarding` a `/student` dostupné bez přihlášení
- ✅ `useSessionDispatch.ts` — grade inicializována z `oli_anon_grade` při startu
- ✅ `Landing.tsx` — hero tlačítko "Začít zdarma" → `/onboarding`

### 2026-05-22 — UX audit critical fixes ✅ (branch: fix/ux-audit-critical)
- ✅ BUG 1: "Začít zdarma" vede na registraci — přidán ?mode=register param (Auth.tsx + Landing.tsx)
- ✅ BUG 2: /demo/session routa existovala — žádná změna nutná
- ✅ BUG 3: Subject param předáván z DemoChildTab → DemoSession, fallback zpráva pro předměty bez obsahu
- ✅ BUG 4: autoComplete="off" na email inputu v Auth.tsx (dev autocomplete odstraněn)

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
