# Fáze 3 — Anon pokrok serverově (návrh)

> Stav: **NÁVRH k rozhodnutí.** Žádná implementace. Cílem je vybrat architekturu.

## 1. Problém, který to řeší

Anon pokrok dnes žije **jen v localStorage jednoho prohlížeče**:
- `oli_anon_progress` — splněné denní úkoly (`anonProgress.ts`)
- `oli_anon_trial` — start trialu + ročník (`anonTrial.ts`)

Důsledky (z analýzy anon→rodič flow):
- **G2** — cross-device pozvánka pokrok nepřenese (parent na zařízení B, dítě na A).
- **G6** — smazání prohlížeče = ztráta pokroku.
- Migrace (`migrateAnonProgress`) dnes **synteticky** rekonstruuje `session_logs` z localStorage při párování (na stejném zařízení).

## 2. Co chceme

Pokrok **adresovatelný serverem**, aby:
1. přežil smazání localStorage dat,
2. šel čistě „adoptovat" registrovaným rodičem / dítětem (re-key reálných logů, ne syntéza),
3. fungoval pro report bez závislosti na konkrétním prohlížeči.

> Pozn.: ani serverové úložiště plně neřeší cross-device, protože **identita anon uživatele je stále vázaná na zařízení** (token/identifikátor v localStorage). Cross-device obnova vyžaduje, aby pozvánka/párování **nesly anon identifikátor** → pak se logy adoptují bez ohledu na zařízení.

## 3. Dvě architektury

### Možnost A — Supabase Anonymous Auth (kanonická)
`supabase.auth.signInAnonymously()` při vstupu (výběr ročníku) → vznikne reálný `auth.users` řádek (`is_anonymous = true`) + JWT. Pokrok se píše do `session_logs` (user_id = anon user, child_id = NULL). Při registraci/párování se logy adoptují (set child_id).

**Plus:** reálná identita, RLS „zadarmo", logy jsou reálné (ne syntéza).

**Zásadní problém — routing:** `App.tsx` dnes větví podle `session ? AuthenticatedRoutes : <anon routes>`. Anonymní auth **vytvoří session** → anon dítě by spadlo do `AuthenticatedRoutes` (child/no-role větev), ne na `/student`. Musel by se **speciálně ošetřit `session.user.is_anonymous`** napříč `App.tsx`, `useUserRole`, gate logikou. To je **velký zásah do jádra auth/routingu.**

**Další rizika:**
- **MAU/cena** — anon uživatelé se počítají do Monthly Active Users (Supabase billing). Každý výběr ročníku = nový auth user → potenciální nárůst nákladů + nutný úklid stale anon účtů (cron delete).
- **Abuse** — bot může tvořit účty (rate-limit nutný).
- **GDPR** — zakládání účtů pro děti (i anonymních) má právní rozměr.

### Možnost B — Klientský anon token + serverová tabulka (lehčí)
Klient vygeneruje náhodný `anon_token` (uuid, uložen v localStorage). Pokrok se POSTuje do nové tabulky `anon_progress(anon_token, topic_id, completed, score, grade, started_at, …)`. Pozvánka/párování **nesou `anon_token`** → adopce: edge funkce (service role) přepíše/zkopíruje záznamy na nově vytvořené dítě.

**Plus:** **žádný zásah do auth/routingu** (anon zůstává „bez session"), žádný MAU dopad, jednoduché. localStorage drží jen *token* (malý, lze i zálohovat do URL pozvánky).

**Mínus:** token-based čtení (kdokoli s tokenem vidí pokrok — ale to jsou jen splněné topicy + ročník, nízká citlivost). RLS = přístup dle tokenu (přes edge funkci nebo `USING (true)` s column grants).

## 4. Doporučení

**Možnost B.** Důvody:
- Vyhne se přepisu auth/routingu (možnost A = největší riziko v celém projektu).
- Žádný MAU/billing dopad.
- Pokrývá G6 (přežije smazání progress dat) a umožní cross-device adopci přes token v pozvánce (G2 z velké části).
- Inkrementální: dual-write (localStorage + server) → postupné přepnutí.

Možnost A je „čistší" v učebnicovém smyslu, ale cena (routing refactor + MAU + GDPR účty) je u tohoto produktu neúměrná zisku.

## 5. Náčrt Možnosti B

### Datový model
```sql
create table public.anon_progress (
  id uuid primary key default gen_random_uuid(),
  anon_token uuid not null,
  grade int check (grade between 1 and 9),
  topic_id text not null,
  completed boolean not null default true,
  score real,
  created_at timestamptz not null default now(),
  unique (anon_token, topic_id)
);
create index on public.anon_progress (anon_token);
-- trial start zvlášť, nebo sloupec started_at na první řádek / malá tabulka anon_trial
```
RLS: insert/select dle tokenu (přes edge funkci `anon-progress` se service role; klient nikdy nečte cizí token).

### Tok
1. **Vstup:** Onboarding vygeneruje `anon_token` (pokud není), uloží do localStorage.
2. **Procvičení:** `markTaskCompleted` → dual-write: localStorage (jako dnes) + POST na edge `anon-progress` (fire-and-forget).
3. **Dashboard:** čte z localStorage (rychlé), volitelně se synchronizuje ze serveru při startu.
4. **Pozvánka:** `send-parent-invite` / InviteParentDialog přibalí `anon_token` → odkaz/parametr.
5. **Adopce:** při registraci (same-browser, F3) nebo párování (cross-device) edge funkce přepíše `anon_progress` daného tokenu na `session_logs` nového dítěte.

### Dotčené soubory
`Onboarding.tsx` (token), `anonProgress.ts` + `anonTrial.ts` (dual-write), `useSessionDispatch.ts` (zápis), `anonMigration.ts` (adopce přes token místo syntézy), `InviteParentDialog.tsx` + `send-parent-invite` (token v pozvánce), `pair-child` (adopce), nová edge funkce `anon-progress`, nová migrace (tabulka + RLS).

## 6. Fázovaný rollout
- **3a** — tabulka + edge funkce `anon-progress` + dual-write (localStorage zůstává zdrojem pravdy). Bez změny chování pro uživatele.
- **3b** — adopce přes token v pozvánce/párování (nahradí syntézu v `migrateAnonProgress`).
- **3c** — server jako zdroj pravdy, localStorage jen cache; úklid (TTL na anon_progress).

## 7. Odhad rozsahu
Střední. 1 migrace + 1 edge funkce + ~6 klientských souborů. Riziko **nízké** (aditivní, dual-write, žádný zásah do auth/routingu). Možnost A by byla vysoké riziko (routing) + provozní náklady.

## 8. Otevřené otázky k rozhodnutí
1. Možnost A vs B (doporučeno **B**).
2. Je Resend (e-mailové pozvánky) reálně nakonfigurovaný? Bez něj je e-mailová větev pozvánky mrtvá (WhatsApp větev funguje klientsky).
3. TTL/úklid `anon_progress` (např. 30 dní po expiraci trialu).
