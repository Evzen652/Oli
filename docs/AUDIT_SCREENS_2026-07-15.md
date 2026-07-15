# Audit obrazovek — reality check (2026-07-15)

> Systematický průchod všemi obrazovkami: kde co naráží, nefunguje, nesouvisí, kolize.
> Metoda: 5 paralelních statických auditů (auth / rodič / žák-session / admin / demo) + živý průchod v prohlížeči + reálný typecheck.
> Legenda: 🔴 BLOCKER · 🟠 HIGH · 🟡 MEDIUM · ⚪ LOW · 🔵 SUSPICION

---

## 0. META — nejdůležitější systémový nález

**🔴 Projekt fakticky netypechecknutý — reálný `tsc` hlásí 95 chyb, ale nikdo je nevidí.**
Root `tsconfig.json` má `"files": []` + jen `references` → `tsc --noEmit` (i všechna dosavadní „tsc 0" v PROJECT_STATUS) **nekontroluje NIC**. Reálný typecheck `tsc -p tsconfig.app.json --noEmit` = **95 chyb** (build přesto projde, protože Vite/esbuild typy nekontroluje). Několik z nich jsou runtime bomby (viz níže). Doporučení: `npm run typecheck` = `tsc -p tsconfig.app.json --noEmit`, zapojit do CI, postupně vynulovat.
Top zasažené soubory: `ekosystemyPoleLoukaLes.ts` (31 — pole `type` neexistuje v `PracticeTask`), `performanceTracker.ts` (7), `supabase/skillLevel.ts` (6), `ChildHomePage.tsx` (3 — `child_name` vs `name`), `ProposalReview.tsx` (3), `ui/form.tsx`/`pagination`/`sidebar` (verbatimModuleSyntax type-import).

---

## 1. BLOCKERY (reálný dopad na uživatele / crash)

**✅ OPRAVENO (2026-07-15) — Spárované dítě uvízlo na chybové obrazovce po každém konci sezení / „Zpět".**
`useSessionDispatch.ts:495-505` (`handleReset`) nastaví pro přihlášené dítě `grade = null`. Znovunačtení ročníku (`SessionView.tsx:205-222`) bylo hlídané `!childGradeLoaded`, které se po prvním načtení zamklo na `true` a nikdy neresetovalo → `role==="child" && !grade` → `ChildLoadingFallback` („Nepodařilo se načíst tvoje procvičování"). Spouštělo: „Jiné téma", ✕, BackButton, klik na logo.
**Fix:** `childGradeLoaded=true` se nastaví jen když dítě v DB ročník NEMÁ (ochrana proti nekonečné smyčce); má-li ho, zůstane odemčené → po resetu (grade=null) se ročník z DB znovu načte. **Ověřeno reprodukcí** (login `demo-child@oli.app`, aktivní sezení → session „Zpět" → návrat na výběr předmětů podle ročníku, ne fallback).

**🔴 Reset hesla přes e-mailový odkaz je nedosažitelný.**
`/reset-password` je route jen v neautentizované větvi (`App.tsx:171`). Supabase recovery odkaz ale při načtení sám vytvoří session (`detectSessionInUrl`) → App vyrenderuje `AuthenticatedRoutes`, kde `/reset-password` neexistuje → NotFound. Rodič, který klikne „obnovit heslo", se nikdy nedostane na formulář. (Latentní, dokud není nasazen SMTP — ale bug je reálný.)
**Návrh fixu:** přidat `/reset-password` i do autentizovaných větví (nebo do samostatné always-on routy nad rozskokem podle role).

**🔴 Admin „Technický audit" spadne (ReferenceError).**
`AdminContentAudit.tsx:62` volá `setAiFixes(new Map())`, které nikde neexistuje (leftover po smazané AI-fix featuře; potvrzeno reálným tsc TS2304). Klik „Technický audit" → „Spustit audit" hodí výjimku, spinner visí, audit se nespustí.
**Návrh fixu:** smazat řádek 62.

---

## 2. HIGH

**🟠 Anon pokrok dítěte se při párování kódem tiše ztratí.** *(předexistující)*
`ChildAuth.tsx` počítá `childId = data.child?.id ?? data.child_id`, ale `pair-child` vrací jen `{session, child_name, grade}` → `childId` vždy `undefined` → `AnonMigrationDialog` se nikdy nezobrazí, migrace anon pokroku nefunguje.
**Návrh fixu:** `pair-child` vrátí i `child_id: child.id`, ChildAuth čte `data.child_id`.

**🟠 `generateMockBatch` (hlavní runtime cesta) neprochází `filterValidTasks`.**
`aiExecution.ts:127-133` — deterministický generátor se nevaliduje. Malformovaná úloha (`select_one` bez `options`, `match_pairs` <2 páry…) → `PracticeInputRouter` vrátí `null` → karta bez vstupu = „prázdná obrazovka". Orchestrátor hlídá jen úplně prázdný batch, ne jednotlivou vadnou úlohu. Chybí obranná vrstva na hlavní cestě.

**🟠 Admin „Přeformulovat" vždy skončí chybou + mrtvý kód.** *(předexistující)*
`ReformulateTaskDialog.tsx:386-388` — bezpodmínečný `throw new Error("AI přeformulování není dostupné.")`, za ním nedosažitelný `parsed` (neexistuje, TS2304 ×2). Tlačítko je vykreslené u většiny grade-4 podtémat. Buď featuru dodělat, nebo tlačítko skrýt.

---

## 3. MEDIUM

**🟡 `/demo/session` = 404 pro admina i dítě** (živě potvrzeno). Route jen v unauth+parent větvi. Dnes latentní (jediný linker `DemoChildTab` je mrtvý kód), ale reálný nesoulad route setů.

**✅ OPRAVENO (2026-07-15) — Mrtvá demo v1 generace smazána (~900 řádků + orphan routy).** Smazáno 6 souborů: `DemoParentTab/ChildTab/AdminTab.tsx`, `components/demo/DemoSession.tsx`, `pages/DemoSession.tsx`, `pages/DemoReport.tsx`. Z `App.tsx` odstraněny importy + 6 rout (`/demo/session` ×2, `/demo-report` ×4). Zachován `/demo` + `Demo.tsx` (v2 login → reálné obrazovky s `isDemo`). Ověřeno: 0 visících referencí v `src`, tsc beze změny (95), app běží, `/demo` funguje, orphan routy padají přes catch-all (unauth→home, admin/child→NotFound), 0 konzol. chyb. Paměť `feedback_demo_prod_sync` aktualizována na v2.

**🟡 Záporné „správně bez nápovědy" v demu.** `ChildSessionLog.tsx:254` `correctOnly = s.correct - s.help_used` → u demo session (correct 1, help 3) = **-2**; `SkillDetailModal` ukáže „-2 správně". Fix: `Math.max(0, …)` + srovnat demo data.

**🟡 Osiřelé admin stránky.** `AdminCategories.tsx`/`AdminTopics.tsx`/`AdminSkills.tsx` nikde neroutované (App importuje jen `AdminDashboard`+`AdminRvpTree`). Mrtvý kód navázaný na starý navigační model.

**🟡 Odstraněné AI featury stále zadrátované.** UI volá `ai-curriculum` („Navrhnout s AI"), `exercise-validator` („Pedagogický audit") — dle architektury „Odchází". Fungují jen dokud Evžen nesmaže edge funkce; pak tiše selžou.

**🟡 LandingNav kotvy z /auth vedou na neexistující `/landing`.** `LandingNav.tsx:42` `scrollTo` fallback `navigate("/landing"+id)`; neautentizovaná sada nemá `/landing` → catch-all zahodí hash. „Ceník"/„Jak to funguje" z přihlašovací stránky nescrolluje.

**🟡 PIN re-login: `child-relogin` select selže před nasazením migrace** → matoucí „Účet nebyl nalezen" místo „PIN dočasně nedostupný". (Deploy-transient; po nasazení migrace zmizí.)

---

## 4. LOW / úklid

- ⚪ `LandingNav` „Přihlásit se" volá `signOut()` i pro přihlášeného rodiče na `/landing` (odhlásí sám sebe).
- ⚪ `Demo.tsx` přehlašuje i přihlášeného uživatele na `demo@oli.app` (footgun, žádný odkaz).
- ⚪ Inline česká pluralizace mimo `czechGrammar` v `ChildMisconceptions.tsx:46`, `ChildActivityBadge.tsx` (porušení CLAUDE.md pravidla). `ChildMisconceptions.tsx:49` `window.location.reload()` místo refetche.
- ⚪ `AdminGenerateIllustrations.tsx:79,93` push do `readonly TopicMetadata[]` (TS2339). `AssignmentCreator.tsx:53` readonly→mutable (TS2345). `ChildHomePage.tsx:337-345` `child_name` vs `name` (TS2741 ×3).
- ⚪ `FillBlankInput` (`split("___")`) vs `taskValidator` (`/_+/`) — nesoulad počítání blanků; při jiném počtu podtržítek než přesně 3 může input zůstat trvale disabled.
- ⚪ Duplicitní texty v možnostech `SelectOne/MultiSelect/DragOrder` → kolize React `key` + v DragOrder nelze doskládat. Reálné jen u vadného obsahu.
- ⚪ `ExerciseTab` mrtvý kód (`ExerciseInputPreview`, `TaskCard`), nepoužitý prop `colorClass`.

---

## 5. SUSPICION (nutno ověřit backend/reprodukcí)

- 🔵 Nově registrovaný rodič bez řádku v `user_roles` (nebo se zpožděním triggeru) → `role=null` → App ho směruje do **žákovské** praxe místo rodičovského onboardingu (`App.tsx:101-112`). Ověřit trigger `handle_new_user` timing.
- 🔵 `useUserRole`/`useProfile` se nefetchují znovu při změně auth stavu (prázdné deps) — zakryto full-reloady při login/logout; křehké pro budoucí in-app přechody.
- 🔵 Demo rodič „Podrobné hodnocení" → reálný `/report?child=<demo id>` — ověřit, zda Report má mock-fallback.

---

## 6. OVĚŘENO OK
- Session loop (anon g4): select_one dělení → „Správně! 🎉" + vysvětlení + Pokračovat. Funguje.
- Zamčené ročníky 1/5–9 („BRZY") dle `ACTIVE_GRADES=[2,3,4]`, fallback 4. Konzistentní.
- i18n: 248 klíčů, 0 duplicit, `LocaleKey` typově vynucuje existenci → raw-key leak přes `t()` nemožný. 64/64 testů.
- Empty-batch guard, anon „Nové téma" event, NotFound + návrat, catch-all routy — bez nálezu.
- Nový PIN re-login (klient): PIN/kód režimy, validace, graceful české chyby, „Nejsem to já", rodičovský dialog. Ověřeno end-to-end.

---

## 7. Opraveno v této session (2026-07-15)
- ✅ Admin náhled `/student` se přes „Odhlásit" už neposílá na dětský login (guard `role==="child"` místo `isStudentView`) — SessionView.
- ✅ ChildAuth `remembered` je nyní state → „Nejsem to já" hned překreslí UI (dřív stale const do reloadu).
- ✅ ChildAuth PIN režim: ne-destruktivní „Přihlásit se kódem" (dítě bez nastaveného PINu se přihlásí, aniž by se „zapomnělo").
- ✅ ChildAuth: ošetřen loading-stuck edge (odpověď bez session i chyby).
- ✅ ParentDashboard: 2 reálné type errory (`pairing_code`/`pairing_code_expires_at` null) → null-guard. Celkem tsc chyb 97 → 95.
