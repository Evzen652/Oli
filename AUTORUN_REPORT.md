# AUTORUN REPORT — autonomní audit 2026-06-14

Větev: `auto/audit-2026-06-14` (NEpushováno na main, nic nenasazeno).
Rozhodnutí + alternativy: viz `DECISIONS.md` (D1–D6).

---

## 1. Co jsem spustil

| Krok | Nástroj | Výsledek |
|---|---|---|
| Typecheck | `tsc --noEmit` | ✅ 0 chyb |
| Lint | `eslint` | ❌→⚙️ config byl rozbitý (nešel spustit) → opraveno; zbývá pre-existující dluh |
| Unit/konzistence | `vitest run` (4371 testů) | 37→**31 failů**, 4338 passed, 2 skip |
| Pedagogický audit | `audit:pedagogical` | 67 % cvičení technicky OK (cíl ≥70 %) + 144 nálezů |
| Curriculum verify | `verify:curriculum` | ✅ 0 warnings (offline, proti Supabase) |
| App E2E (browser MCP) | preview na :8080 | ✅ všechny obrazovky, 0 chyb v konzoli |

## 2. Co jsem opravil

### Lint (commit `a0c3dad`)
- **ESLint config byl kompletně rozbitý** — `reactHooks.configs.flat.recommended`
  v nainstalované verzi neexistuje → ESLint vůbec neběžel (ani v CI). Opraveno na
  `recommended-latest`. (D1)
- Config respektuje `_`-prefix u nevyužitých identifikátorů + NBSP v textu. (D2, D3)
- 3 content nálezy: odstraněn stray import `form`; `POOL_L3`/`HORY` (autorský
  nezapojený obsah) označeny `_`+TODO místo smazání. (D5)

### Testy + reálný bug (commit `c98a180`)
- **Reálný bug generátoru** `pisemneNasobeni` L3: druhý činitel byl `11–100`
  místo `11–99` (`Math.random()*90` → `*89`).
- 5 stale testů opraveno: `content-registry` (3 — grade-2 už má obsah, ročníky 6–9
  prázdné, legacy ID → dynamicky), `db-curriculum` (legacy ID), `prvouka-visuals`
  (edge case prázdného vstupu).
- **Výsledek: 37 → 31 failů, žádné regrese** (+6 passed).

## 3. Ověření aplikace (browser MCP, :8080)

Proklikáno bez jediné chyby v konzoli:
- **Landing** → **Onboarding** (žák i rodič) → **Student home**
- **Okruhová navigace** (čeština + matematika, grade-2) — okruhy → témata, správná
  česká gramatika počtů („1 téma", „3 témata")
- **select_one**: celá session Slovesa od EXPLAIN přes 6 úloh až po **END/Shrnutí**
- **true_false**: Vlastní jména („Je to pravda?" + „Ano…/Ne…", vysvětlení)
- **matematika**: „48 − 5 = ?", feedback s odhalením výsledku
- **Parent**: onboarding (jméno → dítě → párovací kód) → **/parent dashboard**
  (Zadané úkoly / Samostatné procvičování / Na co se zaměřit, filtry, zadávání úkolů)

Konzole: 0 errorů. Jen benigní warnings (React Router v7 future flags, „No
authenticated user" v anonymním režimu) + 1 drobný a11y warning (viz níže).

> Pozn.: `preview_screenshot` v tomto prostředí opakovaně vypršel (30 s) —
> jako důkaz použity accessibility snapshoty (přesný text + struktura).

> Pozn.: `text_input`, `essay`, `step_based` se v **registrovaném obsahu
> nevyskytují** (živý obsah = `select_one` + `true_false`). Komponenty existují,
> ale žádné téma je nepoužívá → nelze je projít běžným flow.

## 4. Otevřené k tvé revizi

### Testy — 31 dokumentovaného baseline (NEopravováno autonomně, viz D6)
- 🔴 **Boundary enforcement** (7: red-team, system-stress) — `BOUNDARY_RULES`
  klíčované starými ID → runtime kontrola neaktivní pro grade-N. **Bezpečnostně
  relevantní**, ale slepý remap riskuje false-positive STOP_2 blokující děti.
  **Doporučení: samostatný fokus task** s ověřením numericRange per téma.
- execution-directive (4) + keyword-conflicts (3) — Cause B (topic-matching po migraci ID).
- generator-validation (3) — Cause C (mixed-type tasks, spec rozhodnutí).
- lib-utilities (1) — Cause D (match_pairs ≥2 vs ≥3 — spec, ne bug).
- sloh-topics (1) + security (1) — Cause F (stale fixtures s mazanými ID).
- i18n-completeness (1) — Cause E. content-audit (1) — passingPct 67 % < 70 %.

### Lint dluh (NEopravováno plošně, viz D4)
- ~339 errorů v `src/` + ~2900 v `supabase/functions/` (Deno edge). Drtivě
  kosmetika (`no-explicit-any`, `prefer-const`). **Doporučení: cleanup PR po předmětech.**

### Pedagogický audit — 67 % OK, 144 nálezů
- Většina `difficulty_progression` u **faktických poolových témat** (L1=L3 je záměr
  memorování) — audit-checker je laděný na algoritmická témata (false-positives).
  **Doporučení:** vyjmout `contentType: factual` z `difficulty_progression` kontroly.
- Drobné reálné: `sentence_complexity` (g3-mat-tabulky 26 slov vč. tabulky),
  `hint_progression` (velká nápověda není o 20 % delší).

### Drobnosti
- A11y warning: `DialogContent` bez `aria-describedby` (Radix). Minor, napříč dialogy.
- Autorský nezapojený obsah: `_POOL_L3` (g5 volby — L3 drag_order/match_pairs),
  `_HORY` (g4 povrch ČR — 6 pohoří). K rozhodnutí: zapojit, nebo smazat.

## 5. Commity na větvi (od main)
- `a0c3dad` fix(lint): oprava rozbitého ESLint configu + konvence
- `c98a180` fix(tests): reálný bug pisemneNasobeni L3 + 5 stale testů
- (+ tento report)

Stav: `tsc` 0, app bez chyb v konzoli, žádné regrese v testech.
