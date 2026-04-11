# Oly (Sovicka) — Project Notes

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

## AI Models (via Lovable AI Gateway or direct API)
- AI Tutor: google/gemini-3-flash-preview
- Curriculum Wizard: openai/gpt-5-mini
- Semantic Gate: google/gemini-2.5-flash-lite (cheapest, fastest)
- Session Evaluation: google/gemini-3-flash-preview
- Exercise Validator: google/gemini-2.5-flash

## Content Fallback Chain
1. custom_exercises (DB cache)
2. Algorithmic generator (topic.generator)
3. AI tutor (edge fn, 5s timeout)
4. Empty state (toast + offer different topic)

## Hybrid mixing: 4 algo + 2 DB exercises per batch (shuffled)

## DB Column Notes
- children table uses `name` (not child_name)
- children has no `is_paired` column — derive from child_user_id != null
- profiles uses `id` as PK referencing auth.users(id)

## Admin account
- Email: eweigl@email.cz / Password: Admin123!
- Role: admin
