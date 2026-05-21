# Oly (Sovicka) — Project Notes

## Multi-PC workflow
- User pracuje střídavě na dvou PC. Vždy na začátku session udělej `git pull` (na branchi `claude/cranky-shirley`), abys měl nejnovější změny z druhého PC. Pokud user nepoví jinak.
- Při skončení práce / před tím, než user přejde na druhý PC: pushni všechny commity (uživatelem schválené) na origin.
- Pro jednoduchý start je v repo skript `scripts/oli-start.ps1` (Windows) — dělá `git pull` + `npm install` (jen když je třeba) + `npm run dev`. User ho spouští dvojklikem.

## Stack
- React 19 + Vite 5 + TypeScript + Tailwind CSS 3 + shadcn/ui + Supabase
- State: React hooks + Zustand (implicit)
- Data: @tanstack/react-query + Supabase client
- Charts: Recharts

## Supabase
- URL: https://uusaczibimqvaazpaopy.supabase.co
- Anon key: sb_publishable_33yUDPztgleFHYtChSvGKQ_rMlyktGV
- NEVER edit src/integrations/supabase/client.ts or types.ts (auto-generated)

## AI Architecture Invariants
- CHECK < 60ms — no network/AI calls in realtime loop
- AI is stateless — no control over session flow
- Generator = pure function — no network, no DB, no AI
- Fire-and-forget persistence — never blocks UI
- No gamification — no points, badges, streaks, leaderboards
- Efficiency principle — "the less time child spends in system, the better"

## AI Models — NOVÁ ARCHITEKTURA (rozhodnuto 2026-05-20)
Zjednodušení: AI jen pro hodnocení, NE pro generování cvičení.

### Zůstává
- Session Evaluation (async, po sezení): google/gemini-2.5-flash-lite
- Report pro rodiče (async): google/gemini-2.5-flash-lite
- Authoring asistent v adminu (tvorba cvičení): Claude API — NE runtime

### Odchází (smazat až při refaktoru)
- ~~AI Tutor~~ (Gemini) — generoval cvičení za běhu
- ~~Curriculum Wizard~~ (GPT)
- ~~Semantic Gate~~ (Gemini lite)
- ~~Exercise Validator~~ (Gemini)

### AI tutor (žák se ptá)
- Zatím odloženo, probere se zvlášť

## Content Fallback Chain — NOVÁ
1. custom_exercises (DB cache)
2. Algorithmic generator (topic.generator)
3. Empty state (toast + offer different topic)
— žádné AI volání za běhu pro generování cvičení

## Roadmap (pořadí práce)
1. Nové typy cvičení — největší dopad pro žáky
2. Admin editor cvičení — základ pro vlastní obsah
3. i18n příprava — technický základ pro jiné státy
4. Audit systém — nápovědy + vysvětlení řešení
5. RVP import — naplnění obsahem (720 řádků, 1:1 mapping připraven)

## Nové typy cvičení (přidat)
- [x] Multiple choice (máme)
- [ ] Text input (volná odpověď)
- [ ] Fill in the blank (doplň do věty)
- [ ] Matching pairs (spoj pojmy)
- [ ] Ordering (seřaď)
- [ ] True/False
- [ ] Multi-select (více správných odpovědí)

## Claude Chat ↔ Claude Code provázanost
- Udržovat `PROJECT_STATUS.md` v root repa
- Claude Chat fetchne přes raw GitHub URL (web browsing)
- TODO: ověřit zda je repo public, pak nastavit Claude.ai Project
- Claude Chat = product manager (design, UX, strategie)
- Claude Code = developer (implementace)

## DB Column Notes
- children table uses `name` (not child_name)
- children has no `is_paired` column — derive from child_user_id != null
- profiles uses `id` as PK referencing auth.users(id)

## Admin account
- Email: eweigl@email.cz / Password: Admin123!
- Role: admin
