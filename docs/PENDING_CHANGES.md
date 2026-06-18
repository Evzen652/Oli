# Pending Changes — požadavky mezi sessions

> Sem píší grade-N sessions, když potřebují něco, co nemůžou udělat samy
> (změna sdílených typů, DB schema, UI komponent, ...).
>
> Architekt po vyřízení požadavek označí ✅ a přesune do "Vyřízené".

---

## ✅ Flow mezery — Blok 4: Drobnosti (2026-06-19)
- D1 text kódu 24→48 h. D2 onboarding tlačítko disabled bez jména + trim. D3 anon „Nové téma" → dashboard (event). D4 ChildLoadingFallback text + reload, 5→4 s. D5 (localStorage warning) odloženo do anon→registrovaný flow. tsc/build OK. **Série flow-mezery (Blok 1–4) hotová** na `fix/flow-mezery-blok1-ucet`.

## ✅ Flow mezery — Blok 3: Navigace (2026-06-19)
- N2 odkaz „Celá historie" na `/session-history` z dashboardu (byla mrtvá routa). N3 Report `navigate(-1)`→`/parent` + BackButton sjednocení (Report, SessionHistory). N1 (smazat demo) vynecháno dle pokynu. tsc/build OK. Zbývá Blok 4 (drobnosti: kód 48h vs text, onboarding disabled, anon „Nové téma", child grade=null).

## ✅ Flow mezery — Blok 2: Robustnost session (2026-06-19)
- S1 empty-batch guard v `sessionOrchestrator.ts` (prázdný batch → END místo pádu; = bod A2 auditu). S2 (dedup recyklace) ověřeně non-issue → bez změny. tsc OK, testy beze změny. Větev `fix/flow-mezery-blok1-ucet` (pokračování). Zbývá Blok 3 (smazat demo, /session-history, sjednotit Zpět), Blok 4 (drobnosti).

## ✅ Flow mezery — Blok 1: Účet & role rodiče (2026-06-19)
- R1 role přes DB trigger (migrace `20260619120000_auth_role_provisioning.sql` — **nutno aplikovat na Supabase**), klient roli nezakládá. R2 `updateProfile` upsert + `useUserRole` deterministické řazení. R3 `mapAuthError` (české chyby) + check-email obrazovka. tsc/eslint/build OK. Větev `fix/flow-mezery-blok1-ucet`. Detail v `PROJECT_STATUS.md` sekce 6. Navazuje audit flow rodič/žák (viz níže).
- **Otevřené z flow auditu:** Blok 2 (empty-batch guard, „Zopakovat" dedup), Blok 3 (smazat demo, zapojit /session-history, sjednotit Zpět), Blok 4 (kód 48h vs text, onboarding disabled, anon „Nové téma", child grade=null).

## ✅ Audit fáze 1 — reality check (2026-06-19)
- Proběhl READ-ONLY audit, výstup `AUDIT_PHASE1.md` (root). Scope: čj + matematika, ročníky 2–4. Bez kódových změn. Nálezy rozděleny na A (rozbíjí smyčku / faktické chyby → fáze 2) a B (polish → fáze 3). Hlavní A-blokr: `g3-cjl/versRymPrirovnani.ts` (4 neřešitelné úlohy) + latentní pád enginu na prázdném batchi.

## ✅ Gradace levelů grade-2 čeština — 12 souborů (2026-06-18)
- Všech 12 souborů `src/content/grade-2/cjl/` převedeno z nefunkčního flat `POOL` + `gen(_level)` na disjunktní `POOL_L1/L2/L3` + `gen(level)`. Audit: **všech 12 témat 8/8/8, max L3** (dříve level systém u čj 2. tř. nefungoval). ~84 nových položek doplněno. tsc 0 chyb, generator-validation 0 grade-2 failů, true_false struktura + cyrilické exporty zachovány. Větev `feat/cjl-grade2-levely`. Detail v `PROJECT_STATUS.md` sekce 6.

## ✅ Disjunktní pooly grade-2 matematika (2026-06-18)
- 6 kumulativních generátorů převedeno na `POOL_L1/L2/L3`: `scitaniAOdcitaniDo100`, `posloupnostiCisel`, `nasobeniJakoOpakovaneScitani`, `cteniZapisPorovnavaniCiselDo100`, `ciselnaOsaDo100`, `vztahNasobieniADeleni`. Audit 2× potvrzen (stabilní): `scitani 9/10/7`, `posloupnosti 7/7/7`, `nasobeni 10/10/8`, `cteni 7/7/7`, `ciselna-osa 7/7/7`, `vztah 9/9/9`. Všechna `max L3`. tsc 0 chyb.

## ✅ Sjednocení obtížnosti: generátor = zdroj pravdy (2026-06-18)
- `src/lib/levelCoverage.ts` (`getTierTasks` / `maxAvailableLevel`), admin karty Level I/II/III z generátoru + DB overlay, audit „pokrytí úrovní", runtime ořez na `maxAvailableLevel`, `CONTENT_CONTRACT.md`. Detail v `PROJECT_STATUS.md` sekce 6.

### 📋 WORKLIST — doplnit těžší obtížnost (L2/L3), scope 2.–4. tř. mat+čj
Z auditu `npm run audit:content` (report „pokrytí úrovní"). **Autorská práce**, ne strukturální — doplnit disjunktní `POOL_L2`/`POOL_L3` (vzor viz `CONTENT_CONTRACT.md`). Celkem **14 bez L2, 37 bez L3** z 99 témat. Témata, kterým chybí L2 **i** L3 (priorita — celá adaptace na L1):
- `g3-cjl-dialog-pravidla`, `g3-cjl-omluvenka-zprava`, `g3-cjl-popis-predmetu`, `g3-cjl-proza-verse`, `g3-cjl-reprodukce-textu`, `g3-cjl-sebekontrola-projevu`, `g3-cjl-tvorive-cinnosti`, `g3-cjl-uhledne-psani`, `g3-cjl-vers-rym-prirovnani`, `g3-cjl-vlastni-vytvarny-doprovod`, `g3-cjl-vypravovani-osnova`, `g2-mat-mereni-delky`
- Pozn.: některá témata mají L3 ale prázdné L2 (např. `g3-mat-kruznice-kruh` 24/0/15) — generátor přeskakuje pokročilou úroveň → projít při doplňování.
- Plný rozpis: spusť `npm run audit:content` (sekce „POKRYTÍ ÚROVNÍ").

## ✅ Scope zúžení na ročníky 2–4 (2026-06-18)
- Aktivní scope = ročníky 2, 3 a 4. Ročník 4 jen matematika + čeština (vlastivěda/přírodověda odloženy kvůli nehotovému factual/conceptual obsahu). Ročníky 5+ parkovány, obsah zachován.
- Zaznamenáno v `DECISIONS.md` (D9), `PROJECT_STATUS.md` (sekce 1), `grade-5/STATUS.md`, `grade-6/STATUS.md`, `grade-4/STATUS.md` (vlastivěda + přírodověda).

## CI/CD + E2E testy (přidáno)
- GitHub Actions CI pipeline: .github/workflows/ci.yml
- GitHub Actions PR check: .github/workflows/pr-check.yml  
- Playwright E2E testy: e2e/ (landing, demo, auth, výkon, přístupnost)
- ⚠️ GitHub Secrets musí přidat Evžen ručně v repo Settings → Secrets:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

---

## Otevřené

### 🧪 Stav testů 2026-06-15 (diagnostika po Fázi 0 — žádná regrese z mé práce)
Plná sada: **17 failů / 4343 (4324 passed)** ve 3 souborech. Ověřeno, že **moje noční
změny (optionFeedback + smoke testy + README) nezpůsobily žádný z nich** — dotčené
soubory jsou aditivní/UI/typové, padající testy importují nezměněný orchestrátor.
Nové testy `option-feedback.test.ts` (9/9) + `stupen2-odborne-typy-ui.smoke.test.tsx` (8/8) zelené, tsc 0 chyb.

Tři předexistující padající soubory:
1. **`generator-validation.test.ts`** (~12) — **Cause C** (viz níže): `correctAnswer` mimo
   `options` u `g3-cjl-vers-rym-prirovnani` (rýmy), `g3-prvouka-…-ekosystemy`,
   `…-stavba-rostlin`, `…-lidske-telo-kostra-svaly`. Známé, grade-3 obsah.
2. **`execution-directive.test.ts`** (5) — **NOVĚ DIAGNOSTIKOVÁNO:** testy volají
   `createSession(6)` + `processState(s, "porovnávání zlomků")`, ale **grade 6 nemá žádný
   obsah** → `matchTopic` striktně filtruje `gradeRange` (contentRegistry.ts:116) → 0 kandidátů
   → `STOP_2`, prázdný `practiceBatch` → `practiceBatch[0]` undefined. Orchestrátor nemá
   cross-grade fallback (design je správný). **K rozhodnutí:** přepsat testy na ročník s
   obsahem (grade 5 „porovnávání zlomků" existuje), NEBO počkají na pilot grade-6 (Fáze 1).
   Runtime dopad teď nulový (grade 6 není pro žáky dostupný).
3. **`content-audit.test.ts`** (1) — „OFFLINE PŘEHLED" práh passingPct (audit, předexistující).

### 📋 Obsah 2. stupně (ročníky 6–9) — PLÁN HOTOV, čeká na Fázi 0 (2026-06-15)
Kompletní cesta v [`docs/STUPEN2_CONTENT_PLAN.md`](STUPEN2_CONTENT_PLAN.md). Rozsah ~505 podtémat, 6 nových předmětů.
**Rozhodnuto:** pilot 6. ročník (Dějepis + Fyzika), metoda Hybrid (výpočetní ručně / faktické pipeline).

**Sebeověření pedagogické kvality (sekce 6 plánu):** triangulační ověření
(generátor + deterministický solver + LLM blind-solve/adversariální judge) +
rubrika 7 kritérií pro slovní úlohy + „chybový model distraktorů". Ověřeno demem 2026-06-15.

**Follow-up grade-3 (nález z dema, vlastní grade-3 session):** přepracovat distraktory
v `grade-3/matematika/slovniUlohySeDvemaOperacemi.ts` z náhodných posunů (`r±5/±10`,
ř. 89) na chybový model (jen 1. krok / opačná operace / sečetl vše); zreálnit cenu
„knížka 12 Kč"; kontextualizovat 2. nápovědu (dnes identická pro všechny 4 šablony).

**Fáze 1 PILOT — zahájeno 2026-06-15:**
- [x] Scaffolding `grade-6/` (index.ts, STATUS.md, fyzika/) + registrace v `ALL_TOPICS`. README už z Fáze 0.
- [x] **Fyzika g6 — „Měření délky"** (zlatý vzor výpočetního obsahu) ✅ — L1→L3 gradace, chybový model distraktorů + `optionFeedback`, blind-solve ověření (rubrika). `g6-fyz-mereni-delky-6`. 17/17 testů, audity bez nálezů.
- [x] **Hmotnost** (`mereniHmotnosti.ts`) + **Objem** (`mereniObjemu.ts`, vč. ekvivalence cm³=ml) ✅ 2026-06-15 — stejný vzor jako délka přes sdílený `fyzika/_shared.ts`. Parametrizovaný test `prevodyJednotek.test.ts` (51/51), audity bez nálezů, blind-solve ověřen.
- [x] **Hustota** (`hustota.ts`) ✅ 2026-06-15 — vrchol okruhu: ρ=m/V, m=ρ·V, identifikace látky podle hustoty. Reálné hustoty látek, chybový model = záměna vzorce (V/m), násobení (m·V), nepřevedený kg. select_one (nemíchá typy). 17/17 testů, blind-solve ověřen, audity bez nálezů.
- [x] **Fyzika g6: teplota + čas** ✅ 2026-06-15 — `mereniTeploty.ts` (změna teploty, rozdíl přes nulu, °C→K) + `mereniCasu.ts` (základ 60, zbytek, časová osa s přenosem). Okruh „Měření veličin" **6/6**. Chybový model na ne-násobkové jevy (teplota: směr/nula/K; čas: ×100 vs ×60, přenos přes 60). Testy 34/34, generator-validation 0 failů, audit:content bez nálezů, tsc 0 chyb. Vzor 2. stupně obstál.
- [x] **Dějepis g6 — „Periodizace, časová přímka, letopočet"** (zlatý FAKTICKÝ vzor) ✅ 2026-06-15 — `dejepis/periodizaceLetopocet.ts` + `dejepis/_shared.ts`. Most z výpočetní fyziky do faktického světa: numericky ověřitelný, ale historické uvažování o čase. L1 století → L2 řazení/rozdíl př. n. l. → L3 přelom letopočtu (rok 0 neexistuje, X+Y−1). Chybový model = historické omyly (záměna éry, „menší = dřív", zapomenutý rok 0) + optionFeedback. select_one (nemíchá typy). **Triangulace:** deterministický solver v testu + adversariální judge 18/18 blind-solve, konvence X+Y−1 potvrzena. 20/20 testů, audity bez nálezů, tsc 0 chyb, 0 nových generator-validation failů.
- [x] **Dějepis g6 — „Doba kamenná / periodizace pravěku"** (drag_order chronologie) ✅ 2026-06-15 — `dejepis/dobaKamennaPeriodizace.ts`. 2. ověřovaný typ pilotu. Gradace přes počet položek 3→4→5, disjunktní znění L1≠L3 (difficulty_progression). **Sebeověření:** nezávislý chronologický rank-solver v testu + adversariální judge (všech 12 pořadí + fakta OK, 3 formulace „Bohemia" opraveny). 14/14 testů, audity bez nálezů, tsc 0 chyb, 0 nových generator-validation failů. Dějepis pilot **2/24**.
- [x] **Dějepis g6 — „Historické prameny"** (categorize, práce se zdrojem) ✅ 2026-06-15 — `dejepis/historickePrameny.ts`. 3. a poslední klíčový faktický typ. Třídění hmotný/písemný/obrazový dle pravidla „podle obsahu, ne materiálu"; chybový model v L3 = klamavé prameny (klínové písmo na hliněné tabulce = písemný). Gradace 3→6→6, disjunktní L1≠L3. Nezávislý klasifikátor v testu. **Architektonická oprava:** `categorize` doplněn do skip listu `answer_uniqueness` v `contentAudit.ts` (marker, ne odpověď). 11/11 testů, audity bez nálezů, audit-new-checks 44/44, tsc 0 chyb. **Dějepis pilot 3/24 — všechny 3 faktické typy ověřeny.**
- [x] **Dějepis g6 — „Pomocné vědy historické"** (categorize, práce se zdrojem) ✅ 2026-06-17 — `dejepis/pomocneVedyHistoricke.ts` (export `POMOCNE_VEDY_HISTORICKE`), autorský batch. Přiřazení nálezu ke vědě (archeologie/paleografie/numismatika/heraldika) podle PŘEDMĚTU zařazení, ne materiálu/vzhledu. L1 4 prototypy (1/věda) → L2 8 čistých → L3 8 klamavých (mince s portrétem/znakem = numismatika, listina/papyrus ke čtení = paleografie). Nezávislý solver = klíčový klasifikátor s precedencí (mince > písmo > znak > vykopávka). **BRÁNA 0 PASS** (0 invariantů), solver test 16/16. Neregistrováno v index.ts (čeká na architekta).
- [x] **Oprava vad „Pomocné vědy historické"** ✅ 2026-06-17 (fakt-expert + žák) — 2 faktické chyby + 4 zádrhely: (1) **pečeť/pečetidlo pryč z heraldiky** (zkoumá je sfragistika, kterou `boundaries` vylučuje) → nahrazeno čistými nositeli znaku; (2) **klínopis/nápisy pryč z paleografie** (to je epigrafika) → rukopisné prameny na měkkém materiálu; (3) L3 „mince se znakem města" a „znak města na bráně" rozděleny do různých úloh; (4) past „mince + obrázek/znak" → explicitní pravidlo v hintu L3; (5) mikro-slovníček věd do hintu L1; (6) změkčena absolutní tvrzení ve vysvětleních. Test sladěn (precedence komentáře + L3 klamavá položka), solver 16/16, **BRÁNA 0 PASS**.
- [ ] ⏳ **Doplnit adversariální judge na téma 3 (prameny)** — session ukončena před jeho během; téma prošlo tsc+testy+audity, ale ne LLM fakt-check (low risk, ale dokončit dle protokolu).
- [ ] Z pilotu odvodit `TEMPLATE_STUPEN2.ts` (výpočetní + faktický: select_one/drag_order/categorize) + odborná pravidla do `grade-6/README.md`.
- [ ] Navigation registr `grade-6/navigation.ts` + `displayNames.ts` (až bude víc témat napříč fyzikou i dějepisem).
- ⚠️ Grade 6 je „má obsah" → odemčen v onboardingu (6 fyzikálních + 3 dějepisná témata).

**Author-batch pipeline (2026-06-17) — nástroj postaven, čeká na ostrý běh:**
- [x] **Brána 0 + workflow** ✅ 2026-06-17 — `src/test/topic-gate.test.ts` + `scripts/audit-topic.mjs` + `.claude/workflows/author-batch.js`. Paralelní authoring přes témata + dvojí-optika audit (pedagog + žák). Detail [`docs/AUTHOR_BATCH_PIPELINE.md`](AUTHOR_BATCH_PIPELINE.md). Brána otestována (PASS/FAIL/file-režim), workflow zaregistrován jako skill. Integraci (registrace/commit) dělá main loop, ne workflow.
- [x] **První ostrý běh (demo, okruh „Úvod do dějepisu")** ✅ 2026-06-17 — batch 2 témat. „Pomocné vědy" vytvořeno + integrováno (7 vad opraveno dvojí optikou). „Co je dějepis" vypadlo (agent zemřel ve spec). 6 agentů, ~375k tokenů, ~27 min. **3 opravy z dema:** (a) workflow tiše zahazoval padlá témata → failure sentinel do needsReview; (b) agenti editovali sdílené docs (CLAUDE.md) → explicitní zákaz v promptech; (c) `self_validation` další false-positive na marker.
- [x] **Okruh „Úvod do dějepisu" KOMPLETNÍ (4/4)** ✅ 2026-06-17 — re-run „Co je dějepis" uspěl (fresh single-topic, opravený workflow + úhly v zadání). select_one, dějiny×dějepis, 22/22 testů, brána 0 PASS, tsc 0, bez regrese. **Obě opravy z dema ověřeny:** agenti respektovali zákaz editace sdílených docs (git ukázal jen téma+test). Dějepis pilot **5/24**.
- [ ] **Ostrý běh workflow na zbytku dějepisu g6** (zbývá 20 témat: Pravěk 4, Starověk 13, + co-je-dejepis) — na pokyn uživatele.
- [ ] 🔎 **Zjemnit audit checky — false-positives na strukturální markery** v `contentAudit.ts`: (1) `self_validation` flaguje correctAnswer „categorize"/„order"/„match" (marker, ne odpověď) — vyjmout marker-typy (jako už `answer_uniqueness`); (2) `hint_leak` flaguje jednotku odpovědi („století" v „15. století"), kde se rozlišující číslo neprozrazuje; (3) `hint_progression` délkový heuristik. Brána je správně neblokuje (jen reportuje). Týká se 4 hotových témat dějepisu — **nejsou to reálné vady, jen šum checku** (potvrzeno gate + judgi).

**Fáze 0 (architekt, `main`) — další krok, blokuje start grade-N:**
- [x] `subjectRegistry.ts` — 6 nových `SubjectMeta` ✅ 2026-06-15.
- [ ] Ilustrace 6 nových předmětů (admin pipeline → Supabase `subject-{slug}.png`).
- [x] **Smoke test odborných typů (validační vrstva)** ✅ 2026-06-15 — `stupen2-odborne-typy.smoke.test.ts` (8/8). Cookbook formátů v plánu. 🔴 `resolveTaskValidation` nepokrývá strukturovaná odborná pole → autor sladí `correctAnswer`+`inputType` ručně.
- [x] **Vizuální smoke test odborných typů** ✅ 2026-06-15 — `stupen2-odborne-typy-ui.smoke.test.tsx` (8/8). Místo ručního klikání v prohlížeči zvolen **integrační render test** (@testing-library/react): každá komponenta se vyrenderuje, odsimuluje vstup, zachytí emitovaný ANSWER a prožene validátorem. Ověřeno, že `ChemicalBalanceInput` emituje jen koeficienty `2|1|2`, `TimelineInput` labely v pořadí, `FormulaBuilderInput` tokeny v pořadí — vše sedí na validátor (pozitivní i negativní případy). Trvalá regresní ochrana místo jednorázového smoke. **Spike chemie ✅** odblokován pro grade-8.
- [x] Per-grade slovník 12–15 let do README šablony ✅ 2026-06-15 — `src/content/grade-6/README.md` jako README šablona 2. stupně: tone-of-voice 11–12 let + slovník povolených odborných termínů (fyzika/matematika/dějepis/čeština) + co stále nepoužívat, s poznámkou o rozšíření 7.–9. roč. Navíc shrnuje kvalitativní zlom 2. stupně, chybový model distraktorů + `optionFeedback`, cookbook odborných formátů a Definition of Done. Jen markdown (žádný index/navigation registr — ten zakládá architekt ve Fázi 1 scaffoldingu).
- [x] **Cílený feedback per zvolená možnost** ✅ 2026-06-15 — `PracticeTask.optionFeedback?:
      Record<string,string>` přidán; `CheckFeedbackCard` dostal prop `selectedAnswer` + engine
      `getTargetedFeedback()` (přímá shoda klíče; multi_select rozdělí čárka/středník/pipa); při chybě
      zobrazí cílené vysvětlení v oranžovém boxu nad správnou odpovědí, fallback = `explanation`.
      Propagace `selectedAnswer` přes `useSessionDispatch` → `SessionView` i `DemoSession`. 9/9 unit testů
      (`option-feedback.test.ts`), tsc 0 chyb. Bonus: uklizena duplicitní deklarace `displayName?` v `TopicMetadata`.

**Standard kvality:** [`PEDAGOGICKA_SPECIFIKACE_STUPEN2.md`](PEDAGOGICKA_SPECIFIKACE_STUPEN2.md)
— platí pro generování i audit. Klíčové omezení: **žák jen vybírá, nepíše** → jen výběrové
typy, jádro kvality = chybový model distraktorů (každý distraktor = typická chyba).

### ✅ Grade-5 čeština — oprava hint_leak + giveaway délkou (DOKONČENO 2026-06-15)
**Hotovo 2026-06-15:** Postup z vzoru `zajmenaSklonovaniOsobnichZajmen.ts` (commit 9b2372c) aplikován na zbytek cjl.
- **9 souborů opraveno** (hinty přepsány z „termín = definice/tvar" na navedení otázkou/rozlišovacím znakem): `pridavnaJmena…` (druh/vzor leaky + duplicitní/meta option „krásnou ženu správně"), `slovesaZpusob…`, `podmetVyjadreny…`, `cislovky…`, `souvetiVzorce…`, `slovniDruhy…`, `primaANeprimaRec…` (+ placeholder uvozovek „dolni-uvoz" → „ "), `basenLyricka…`, `elementarniLiterarni…`.
- **Sporný počet vět:** souvětí „Jedl, pil a zpíval, dokud mu nezbyly síly." — `correctAnswer` 3→**2 věty** (několikanásobný přísudek = 1 věta).
- **Drobné vady:** `slovaSpisovna` (museum→muzeum + giveaway „nic"→„být"), `vypravovani` („většíhopříběhu"), `reprodukce` („reproukci"), `umelecke` (vadná otázka přeformulována).
- **`shodaPrisudkuSPodmetem`** (fill_blank): hinty „rod → koncovka" ponechány **vědomě** = aplikační scaffolding, ne určovací leak. Volitelný follow-up: zjemnit na samotný rod (90 generovaných hintů).
- **12 souborů cjl bez nálezů** (čisté).
- **Hranice oprav:** opraveno tam, kde z hintu jde odpověď *přečíst* (termín/tvar/počet); pádové otázky a obecná pravidla ponechány.
- **Ověřeno:** `tsc` 0 chyb, `generator-validation` bez nových failů (correctAnswer ∈ options); 2 chyby agentů (ASCII uvozovka, museum mismatch) odchyceny a opraveny.
- **Zbývá (přírodověda, mimo cjl):** `etapyLidskehoZivotaDospivani.ts` (hint_leak), `nervovaSoustavaSmysly.ts` (R5 neadaptivní).

<details><summary>Původní postup (reference)</summary>

**Vzor:** `zajmenaSklonovaniOsobnichZajmen.ts` (commit 9b2372c).

**Postup (vzor):**
1. **hint_leak (R4):** nápověda s `= <odpověď/tvar>` → useknout na metodu bez prozrazení. Např. „Koho/čeho? od já = mě nebo mne." → „Zeptej se: Koho/čeho? To je 2. pád zájmena 'já'."
2. **giveaway délkou (R17/giveaway):** meta-text v `options`/`correctAnswer` (např. „mě – 2. pád", „mi (krátký tvar) nebo mně – dlouhý tvar") → přesunout do nového pole `explanation`, `options` zkrátit na čisté tvary podobné délky. Správná možnost nesmí být nejdelší/jediná popisná.
3. Při tom opravit vadné položky: matoucí otázky, dvojí správné odpovědi mezi distraktory, neexistující tvary.
4. Doplnit `explanation` u každé položky (vysvětlí PROČ). Ověřit: `npx tsc --noEmit` + `correctAnswer` ∈ `options`.

**Soubory ke zpracování (grade-5 cjl, ~21):** projít každý, opravit jen pokud má leak/giveaway:
primaANeprimaRecUvod, vypravovaniSRozvinutouOsnovou, souvetiVzorcePocetVet, slovesaZpusobOznamovaciRozkazovaciPodminovaci, slovaSpisovnaANespisovna, posuzovaniUplnostiSdeleni, podmetVyjadrenyNevyjadrenyNekolikanasobny, cislovkyDruhyZakladniRadoveDruhoveNasobne, basenLyrickaAEpickaRomanPovidka, studijniCteniAVecneCteni, popisSubjektivneZabarvenyPopisPracovnihoPostupu, vlastniLiterarniTextNaDaneTema, umeleckeANeumeleckeTexty, telefonickyRozhovorZanechaniVzkazu, slovniDruhyUrcovaniVsechDesetiOhebneANeohebne, slovaJednoznacnaMnohoznacnaVicevyznamova, shodaPrisudkuSPodmetem, reprodukcePrimereneSlozitehoSdeleni, pridavnaJmenaDruhyTvrdaMekkaPrivlastnovaciSklonovani, elementarniLiterarniPojmyPriRozboruTextu, dopisUredniZadostTiskopisyPrihlaskaDotaznik.
+ přírodověda: `etapyLidskehoZivotaDospivani.ts` (hint_leak), `nervovaSoustavaSmysly.ts` (R5 neadaptivní).

</details>

### 🔴 Anon → registrovaný flow + messaging „Odemkni registrací" (řešit v nové session, 2026-06-14)
Messaging zamčených okruhů („🔓 Odemkni registrací →" + tooltip „Zaregistruj se zdarma a odemkni všechny okruhy") **neodpovídá realitě flow**:
- Registruje **rodič**, ne dítě (klik → `/auth?mode=register`).
- Odemčení **není okamžité** — vícekrok: registrace rodiče → ověření e-mailu → přidání dítěte → párovací kód → spárování dítěte. Teprve spárované dítě (role „child") má `anonLocked = false`.
- „**zdarma**": Auth banner slibuje „14 dní zdarma, pak 149 Kč/měs", ale **platební integrace v kódu není** (žádný Stripe/subscription gate) → registrovaný teď dostane vše zdarma.

**K rozhodnutí:** celý anon → registrovaný flow (kdo/jak/kdy se odemkne, co s platbami), pak doladit messaging. Text zamčených okruhů zatím **neopraven** (čeká na rozhodnutí o flow). Doporučení: řešit flow pořádně, ne jen kosmetiku.

### 67 pre-existujících padajících testů — ≥6 příčin (NE jen whitelist!)
> ⚠️ KOREKCE: dříve zde stálo „jen zastaralý inputType whitelist". Audit 2026-06-08 (`docs/AUDIT_2026-06-08_full.md`) ukázal, že whitelist je jen **2 z 67**. Padá 17 test souborů s ≥6 příčinami:
- ~~**A** (2): `topic-invariants.test.ts:42-53` whitelist chybí `true_false`~~ ✅ 2026-06-12 — doplněno.
- ~~**B** (~40+, NEJVÁŽNĚJŠÍ): `classifyIntent`/keyword-matching vrací `topical` místo boundary klasifikace~~ ✅ 2026-06-12 — **POTVRZENÁ SKUTEČNÁ REGRESE, opraveno.** Dvě příčiny: (1) **crash** — 1 téma (`g3-prvouka-...-skupiny-zivocichu...`) nemělo `keywords` pole → `classifyIntent`/`matchTopic` shodily bránu na ŽIVÉ cestě (sessionOrchestrator:119) pro JAKÝKOLIV grade-3 vstup; (2) **substring over-match** — 83 krátkých keywordů (`"a"`,`"s"`,`"6"`…) přes naivní `input.includes(kw)` označovalo nesmysly jako `topical`. Fix: nový `src/lib/keywordMatch.ts` (word-boundary matching + min. délka 2 + guard) použitý v `preIntent.ts` i `contentRegistry.matchTopic`; doplněna data tématu; numerická kontrola přesunuta před keyword matching. **Net: −98 padajících testů** (137→~39). Detail: viz commit.
- **C** (~9–12): `generator-validation.test.ts` — pre-existující. Dvě podpříčiny: `correctAnswer` není v `options` (vyjmenovaná slova, rýmy) + **témata s míchanými typy tasků deklarují `inputType: "select_one"`, ale emitují match_pairs/categorize tasky bez options** (`stavba-rostlin`, `ekosystemy-pole-louka-les`, `lidske-telo`). Test asertuje options dle `topic.inputType`.
- **D** (1): spec rozpor `taskValidator.ts:54` (match_pairs ≥3) vs `lib-utilities.test.ts:246` (≥2).
- **E** (1): `i18n-completeness` — `parent.greeting` bez `{name}`.
- **F** (~5): stale fixtures odkazují na smazaná legacy ID `cz-sloh-vypraveni`/`cz-sloh-popis` (nahrazena grade-N obsahem). Soubory: `sloh-topics`, `keyword-conflicts`, `security` sanity, `content-registry`.

### 🔴 NOVÝ NÁLEZ (Cause B audit 2026-06-12): boundary pravidla nemigrována na grade-N ID
- `src/lib/boundaryEnforcement.ts` `BOUNDARY_RULES` je klíčovaný **starými ID** (`math-compare-natural-numbers-100`, `math-add-sub-100`…), ale `matchTopic` teď vrací grade-N ID (`g3-mat-*`). → **runtime boundary enforcement (STOP_2 pro čísla mimo rozsah / zakázané operace) je pro aktuální grade-3 math obsah NEAKTIVNÍ.**
- Projevuje se faily: `red-team` AC-S2 (4), `system-stress-test` boundary (3).
- TODO: namapovat `BOUNDARY_RULES` na grade-N topic ID (+ ověřit `numericRange`/`forbiddenKeywords` per téma). Bezpečnostně relevantní — vlastní fokus task.

### Bezpečnostní nálezy z auditu 2026-06-08 (viz docs/AUDIT_2026-06-08_full.md)
- 🔴 **C1 (vyžaduje akci uživatele):** Groq klíč `VITE_GROQ_API_KEY` je v klientském bundlu → rotovat v Groq dashboardu + přesunout volání do edge funkce. `src/lib/aiClient.ts`.
- ~~🔴 **C2:** `generate-prvouka-images` edge funkce bez auth~~ ✅ 2026-06-11 — JWT + admin role gate přidán.
- ~~🟠 **H1** `generate-logo` bez auth~~ ✅ 2026-06-12 — JWT + admin role gate přidán.
- ~~🟠 **H2** `send-parent-invite` bez auth (email bombing)~~ ✅ 2026-06-12 — rate limit: max 1 pozvánka/email/hodinu.
- ~~🟠 **H3** `parent_invitations` UPDATE `USING(true)`~~ ✅ 2026-06-12 — migrace `20260612100000` opravuje na `USING(status='pending') WITH CHECK (status='accepted')`.
- ~~🟠 **H4** bucket `prvouka-images` zápis bez role check~~ ✅ 2026-06-12 — migrace `20260612100001` vyžaduje admin roli pro INSERT/UPDATE.
- ✅ Migrace H3+H4 aplikovány (`supabase db push` 2026-06-12).

### Audit grade-5 — opravy (priorita dle docs/AUDIT_GRADE_5_2026-06-08.md)
Z auditu 2026-06-08 (84 % technická úspěšnost). Pořadí dle páky/rizika:
1. ~~**F1 — validátor substring**~~ ✅ 2026-06-10 (viz Vyřízené)
2. ~~**F2 — answer_uniqueness**~~ ✅ 2026-06-10 (viz Vyřízené)
3. **R1 — fill_blank (13):** `shodaPrisudkuSPodmetem.ts` má `___` (3 podtržítka) vs `blanks` délky 1. Smazat `blanks: [blank]` nebo `___`→`_` (ověřit UI render).
4. **R2 — match_pairs→categorize:** `obratlovciSavciPtaci...` a `riseRostlinHubZivocichu.ts` jsou kategorizace (víc položek → stejná třída), ne 1:1 párování. Změnit `inputType` na `categorize` + restrukturovat data. Bonus překlepy: „Čolník"→„Čolek", Rak označen jako ryba.
5. **R3 — match_pairs vadná data:** `evropaPoloha...` (1 úloha, Alpy 2×), `evropskeStaty...` (2 úlohy, Euro 2×, Německo 2×). Opravit jen vadné úlohy, NEMĚNIT typ.
6. **R4 — hint_leak vzorec „= odpověď" (~60 z 108):** zejm. `zajmenaSklonovani...`, `etapyLidskehoZivota...`. Přeformulovat 1. nápovědy bez `= <tvar/termín>`.
7. **R5 — neadaptivní generátory (2):** `nervovaSoustavaSmysly.ts`, `riseRostlinHubZivocichu.ts` — stejný výstup L1/2/3.
8. **R6 — missing_hints matematika (12):** ověřit, zda spoléhají na `helpTemplate` (pak OK), jinak doplnit.

~~**BUG #5** — Tab zamrzne po zavření InviteParentDialog~~ ✅ 2026-06-12 — přidána focus restoration (save activeElement při mount, vrátí focus při unmount + focus první prvek po otevření).

### ✅ Navigace předmět → okruh → téma pro všechny ročníky (2026-06-13)
- Sjednocena 2-úrovňová žákovská navigace (okruh → téma) pro grade-2/4/5 — dříve jen grade-3.
- Nové soubory: `src/content/navigation.ts` (registr + typy), `grade-2/navigation.ts`, `grade-4/navigation.ts`, `grade-5/navigation.ts`.
- `TopicBrowser.tsx` zobecněn (per-ročník lookup místo `grade === 3`).
- Žádné cvičení se nemazalo/neměnilo; okruhy odkazují na existující `id`. RVP pole beze změny.
- Informatika ponechána plochá (dle pravidla; studentům se nezobrazuje).
- Nový test `navigation-consistency.test.ts` (42 ✅): každé cvičení v právě jednom okruhu, žádní sirotci/duplikáty.
- Opraveny 2 build-breaking ASCII uvozovky (lideVOkoliKamaradstvi, povolaniPraceDospelych).
- TODO (neblokující): dorovnat nekonzistentní `topic` v grade-4/5 (degenerované == category u nematematických předmětů).

### ✅ Grade-2 čeština: 12 topics implementováno (2026-06-13)
- 12 souborů v `src/content/grade-2/cjl/`: pravopisIY, skupinyDeTeNe, slabiky, druhyVet, slovesa, vlastniJmena, slovaProtikladna, slovaNadrazena, abecedaRazeni, pohadkaRikankaBasen, spisovatelKniha, orientaceVTextu.
- `displayNames.ts`: přidány 3 categories (Jazyková výchova, Komunikační a slohová výchova, Literární výchova) + 6 topics.
- `index.ts`: importy + exporty všech 12 topics.
- Pravidla R1–R16, `explanation` (ne `solutionSteps`), pool 17–18 úloh, TypeScript 0 chyb.

### ✅ Grade-2 prvouka: ruční review obsahu (2026-06-13)
- Přepsáno všech 13 zbývajících souborů prvouka (7× true_false, 6× select_one).
- R11+R12: True/False „Je to pravda?" + celé věty „Ano, to je pravda/Ne, to není pravda".
- Per-item hint+solution (dřív generické „Mysli na to, co..." a „Správně: X").
- Opraveny fragment-otázky: „Mládě kočky je?" → „Jak se jmenuje mládě kočky?", „Číslo na záchranku?" → „Jaké je tísňové číslo záchranné služby?".
- Opraven broken distractor „Souseda kočku" v drobnaPoraneni.

### ✅ Grade-2 matematika: ruční review obsahu (2026-06-13)
- Projity všechny otázky, nápovědy a solutionSteps u 13 témat matematiky 2. ročníku.
- Odvozena pravidla R7–R12 (uložena v memory `feedback_content_review_rules.md`).
- Přepsány soubory: slovniUlohy, jednotky, mereniCasu, mereniDelkyUsecky, bodPrimkaUsecka, tabulky, posloupnosti, vztahNasobeniADeleni (L3 hinty).
- Opraveny obsahové chyby: „0,5 hodiny", „Narýsuj", „asi 7 cm", neúplné otázky.

### Czech grammar audit zbylých generátorů ✅ 2026-06-12
- Hotovo — viz sekce Vyřízené výše.

### Chybějící ilustrace grade-5 témat (a dalších grade-N)
- Mnoho grade-N témat nemá ve storage `prvouka-images` vygenerovanou ilustraci → slug URL 404.
- Rozbitá ikona už se nezobrazuje (✅ `IllustrationImg` graceful fallback 2026-06-12), ale session header je bez obrázku.
- TODO: dávkově vygenerovat ilustrace pro grade-5 (čeština sloh, vlastivěda, přírodověda…) přes admin pipeline `AdminGenerateIllustrations`.
- Alternativa pro mezičas: emoji fallback v `IllustrationImg` (předat `getTopicEmoji()` jako `fallback`).

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

## Vyřízené (doplněno 2026-06-17)

### 🖼️ Fix: AI ilustrace měly v sobě zkomolený text — vyčištěny prompty ✅
- FLUX maloval do obrázků český text, protože pozitivní prompty si o text říkaly („písmena A B C", „s popisky", „směry S V J Z"). Fix: `sanitizeForImagePrompt` rozšířen o neutralizaci text-spouštěčů (písmena/popisky/nápis/text/názvy + sekvence samostatných písmen). Běží na všech auto-promptech. `subject-cestina` vyčištěn u zdroje. Negace zůstává jen v negative_prompt edge funkce. Ověřeno node testem, tsc 0. ⚠️ Regenerování + schválení nových ilustrací dělá uživatel ručně v adminu.

### 🖼️ Fix: admin panel ilustrací ukazoval u ročníku cizí předměty ✅
- Filtr ročníku v `AdminGenerateIllustrations` vyjímal `subject` typ → u 2. roč. se ukazovala přírodověda/vlastivěda (4.+) a fyzika (6.). Fix: výjimka odstraněna, filtr platí i pro subject karty (gradeMap zná ročníky subjectů). Ověřeno v prohlížeči: 2. roč. → mat/čj/prvouka, 4. roč. → mat/čj/přír/vlast. tsc 0.

### 🖼️ Fix: žák ukazoval jiné ilustrace předmětů než admin ✅
- `subjectRegistry.ts` měl pro 1. stupeň bundled PNG (`@/assets/subjects/…`), ale admin generuje do Supabase storage `subject-{slug}.png` → žák viděl staré obrázky (prvouka strom vs. admin sova). Hashe potvrdily rozdíl. Fix: 1. stupeň přepnut na `${SUPABASE_STORAGE}/subject-{slug}.png` (stejný zdroj jako admin) → regenerace se propisují samy. Ověřeno v prohlížeči, tsc 0.

### 🐛 Fix: admin panel „React is not defined" ✅
- `AdminGenerateIllustrations.tsx` používal `React.Fragment` (s `key`), ale neimportoval `React` → s automatickým JSX runtimem (`jsx: react-jsx`) spadl celý admin při renderu. Pre-existující (z commitu `d130951`, ne z této session). Fix: import `Fragment` + `React.Fragment` → `Fragment`. Grep potvrdil jediný takový soubor v repu. Ověřeno přihlášením admina na dev serveru (`/admin` bez chyby), tsc 0.

### Dev helper: reset anon 14denního trialu ✅
- `src/components/DevTrialReset.tsx` — plovoucí pilulka vlevo dole, renderuje se **JEN v dev módu** (`import.meta.env.DEV`, mount v `App.tsx` za flagem → produkční build ji nezahrne). Akce: reset na den 1 (14 dní), posun na den 13, nastav expirováno, smaž anon data — vše + reload.
- Nový reusable helper `restartTrial(grade?, daysAgo?)` v `anonTrial.ts` (startedAt = teď, volitelný posun do minulosti; zachová ročník). 5 nových testů v `anon-trial.test.ts` (19/19), tsc 0.

## Vyřízené (doplněno 2026-06-14)

### Anon: klik na předmět skončil na „Vyber si předmět" místo na okruhách ✅
- `AnonStudentPage` SubjectGrid uloží `oli_anon_browse_subject` + přepne do session; `SessionView` ho ale četl až v `useEffect` po prvním renderu. Anon trial přeskakuje `ChildHomePage` → `TopicBrowser` se renderuje hned s `initialSubject=undefined` → `level="subject"` (= výběr předmětu), pozdější `setTopicBrowserSubject` browser neremountoval. **Fix:** `topicBrowserSubject` i `showTopicBrowser` čteny synchronně ze sessionStorage při init stavu (jako `isStarting`). Klik na předmět teď vede rovnou na okruhy daného předmětu. TypeScript 0 chyb.

### Anon UX: zamykání okruhů + oprava navigace + onboarding čistota ✅
- **Groq odstraněn z klientského bundlu** — smazán `aiClient.ts` + `ai-client.test.ts`; `sessionEvaluator` volá rovnou `generateLocalEvaluation` (lokální šablona); odebrány AI tlačítka z `AdminContentAudit` + `ReformulateTaskDialog`; GROQ hláška z `edgeFunctionError`; `VITE_GROQ_API_KEY` z `.env`. ⚠️ Klíč byl exponován v historii → **rotovat v Groq dashboardu** (řeší nález C1).
- **TopicBrowser UI** — „Vyber okruh" subtitle odstraněn z hlavičkového boxu; „Vyber si okruh…" prompt zvětšen (`text-lg font-bold`) i pro úroveň podtémat; popisy karet zvětšeny `text-xs → text-base`; odstraněny count labely („3 témata") z karet.
- **SessionView hlavička** — předmět + ročník `text-lg font-bold`, ročník stejnou barvou jako předmět.
- **AnonStudentPage výběr předmětu** — karty jen název (bez okruhů pod ním), větší ilustrace (`h-36`) + nadpis (`text-2xl`).
- **Anon upozornění** — žluté bannery „v anonymním režimu se neukládá" v sekcích „Úkoly od rodiče" + „Co jsi procvičoval" (`text-sm`, jen pro `isAnonUser`).
- **Anon flow zjednodušen** — anon trial přeskakuje `ChildHomePage` a jde rovnou na `TopicBrowser` (matoucí prázdný dashboard jako první obrazovka pryč).
- **Oprava tlačítka Zpět** — na nejvyšší úrovni TopicBrowseru v anon režimu „Zpět" zavře session a vrátí na dashboard (nový event `oli-anon-exit-session`); dřív kvůli přeskočení ChildHomePage render hned spadl zpět na výběr předmětu.
- **🔒 Zamykání okruhů v anon režimu** (vždy ve volném výběru, dle rozhodnutí uživatele) — v každém předmětu je odemčený **jen první okruh**, ostatní mají zámek + „Odemkni registrací →"; klik vede na `/auth?mode=register`. Props `anonLocked` + `onLockedClick` v `TopicBrowser`. Trial banner přeformulován „plný přístup zdarma" → „1 okruh v každém předmětu zdarma".
- **Denní úkoly čerpají ze VŠECH okruhů** (i zamčených) — zamykání se týká jen volného výběru okruhů, ne denních doporučení (ochutnávka napříč obsahem). `getDailyTasksForGrade` bez filtru. **Model:** trial (1–14) zamčené okruhy ve výběru + denní úkoly ze všech; po trialu (15+) jen denní úkoly.
- **Zamčené okruhy barevné** — místo grayscale zůstává ilustrace i pozadí předmětu barevné, jen zámek v rohu + „🔓 Odemkni registrací" (láká k registraci, ukazuje hodnotu).
- **Ilustrace grade-2 prvouky** — okruhy padaly na emoji, protože dedikované `cat-prvouka-*` PNG ve storage neexistují (ověřeno HTTP: 400). Namapovány na existující legacy prvouka ilustrace v `prvoukaVisuals.ts` (Lidé a čas + Místo kde žijeme → orientace, Lidé kolem nás → společnost, Rozmanitost přírody → příroda, Člověk a zdraví → tělo). ⏸️ Follow-up: vygenerovat dedikované PNG přes admin pipeline (viz „Chybějící ilustrace grade-N témat").
- TypeScript 0 chyb.

## Vyřízené (doplněno 2026-06-13)

### UX + obsah session 2026-06-13 ✅
- **Landing zlomky** — nová ilustrace (Pollinations, objekt bez postavy), cache-bust `?v=2`.
- **Onboarding** — animace výběru ročníku (scale+ripple) + zamčené ročníky bez obsahu (toast „Připravuje se", bez fallbacku).
- **Session start flash** — odstraněno probliknutí dashboardu/EXPLAIN při startu tématu (`isStarting` flag ze sessionStorage při mountu; EXPLAIN→PRACTICE bez mezilehlého setSession).
- **Giveaway grade-3** — `velkaPismenaVlastniJmena.ts` úloha „Labe" měla odpověď ve znění věty → přeformulováno.

### UX + obsah session 2026-06-13 (pokr.) ✅
- **Grade-2 matematika** — 13 topics, celý RVP 2. ročníku. `src/content/grade-2/matematika/`. Designová zásada: otázky max 5–6 slov (7–8 let, čtou pomalu). Sčítání/odčítání, číselná osa, porovnávání, násobilka 2–5, násobení jako opakované sčítání, vztah ×÷, slovní úlohy, jednotky, měření času, posloupnosti, tabulky, geometrie (bod/přímka/úsečka).
- **Grade-2 prvouka** — 15 topics, `src/content/grade-2/prvouka/`. Okruhy: Lidé a čas, Lidé kolem nás, Místo kde žijeme, Rozmanitost přírody, Člověk a jeho zdraví. Každá úloha má `emoji` vizuální oporu, otázky 4–5 slov. 7× true_false, 8× select_one. Doplněn index.ts, displayNames.ts, STATUS.md. tsc 0 chyb.

### Otevřené (nové 2026-06-13)
- **Sken grade-3 na giveaway „odpověď ve znění otázky"** — current audit check (c3) chytá jen meta-text/délku distraktorů, NE případ, kdy je správná odpověď doslova ve znění `q`. Vhodné doplnit nový check + proskenovat existující POOL napříč grade-3 cjl.
- ~~**Grade-2: chybí navigace (onboarding + displayNames)**~~ ✅ 2026-06-13 — `displayNames.ts` grade-2 existuje a je kompletní, import i `BY_GRADE` záznam jsou v pořádku, `GRADE_2_TOPICS` registrováno v content indexu.

## Vyřízené (doplněno 2026-06-12)

### Czech grammar audit — math generátory ✅ 2026-06-12
- Přidáno 8 nových slov do NOUNS v `czechGrammar.ts`: SLOUPEC, ŘÁDEK, NULA, DESETINA, SETINA, TISÍCINA, TISÍCOVKA, SKUPINKA.
- Migrováno 8 souborů z legacy `czechPlural.ts` → `czechGrammar.ts` (pad/form): `addSub10k`, `areaGrid`, `fracIntro`, `fracSameDen` (dead import), `multiply`, `multWritten`, `units4`, `wordProblems5`.
- Opraveny inline ternáry v `decimalMulDiv`, `decimalRead`, `fracOfNumber`.
- `czechPlural.ts` už není importován nikde v kódu (soubor zachován pro případ dalšího použití).
- TypeScript 0 chyb, czech-grammar.test 18/18 ✅.

## Otevřené (doplněno 2026-06-12)

### Admin editor — edit uložených cvičení ✅ 2026-06-12
- `EditExerciseDialog` přidán do `CreateExerciseDialog.tsx` — prefilluje formulář z DB záznamu, inferuje `inputType` z dat, ukládá přes `UPDATE`.
- Tlačítko „✏️ Upravit" v `SavedExercisesList` (vedle Smazat) pro každý stav (pending/approved/rejected).
- TypeScript 0 chyb.

---

## Otevřené (doplněno 2026-06-11 pokr.)

### ~~R2 — match_pairs→categorize (obratlovci, říše rostlin/hub/živočichů)~~ ✅ 2026-06-11
`inputType: categorize`, `pairs` → `categories`, Čolník→Čolek, Rak odstraněn, Jezerní rybník→Olše lepkavá.

### Giveaway délkou — 178 nálezů grade-5 (nový check c3)
Správná možnost je ≥ 2× delší než všechny distraktory → žák vybere nejdelší bez čtení. Koncentrace v CJL slohové + literární výchově (~120), přírodovědě (~30). Oprava = autorsky prodloužit distraktory / zkrátit správnou. Velký rozsah — vhodné pro grade-5 session po tématech.

### R4 — hint_leak „= odpověď" (104 nálezů, grade-5)
Zejm. `zajmenaSklonovaniOsobnichZajmen.ts`, `etapyLidskehoZivotaDospivani.ts`, CJL tvarosloví. Přeformulovat 1. nápovědy bez `= <termín/tvar>` — navádět přes vlastnost/příklad.

### R5 — non-adaptivní generátory grade-5 (6 témat)
Totožný výstup L1/2/3: `kostraASvaly`, `nervovaSoustava`, `obratlovci`, `riseRostlin`, `traviciSoustava` + `zemeJakoPlaneta` (100% recyklace L3=L1). Zavést gradaci obtížnosti.

### R6 — missing_hints matematika grade-5 (18 témat)
Matematické generátory bez per-task hints. Ověřit, zda spoléhají na `helpTemplate` (pak OK), jinak doplnit.

## Otevřené (doplněno 2026-06-11)

### 29 témat bez gradace obtížnosti (nový check 2b)
Nový audit check „recyklace otázek L1 → L3" odhalil 29 non-adaptivních generátorů napříč ročníky (původní check viděl jen 7 — shuffle ho obcházel). Level 3 vrací ≥ 90 % stejných otázek jako level 1. Grade-3: dialog-pravidla, omluvenka-zprava, popis-predmetu, sebekontrola-projevu, uhledne-psani + další v g4/g5. Seznam: `npm run audit:pedagogical` → difficulty_progression. **Oprava = autorská práce** (napsat těžší L3 úlohy — aplikační místo definičních), vhodné pro grade-N sessions po tématech.

## Vyřízené

### 2026-06-11 (pokr. 2) — P0 oprava validátorů + R1/R3 obsah grade-5 + UX ✅
- **P0:** `pairsMatchValidator` + `categorizeValidator` + `resolveTaskValidation()` — strukturované odpovědi (match_pairs/categorize/drag_order) se vyhodnocují správně. Zapojeno v orchestrátoru + DemoSession. 183 testů zelených.
- **R1:** fill_blank validátor — `/_+/g` místo `/_/g`; fix i/y větve.
- **R3:** `evropaPolohaPovrchVodstvoPodnebi` + `evropskeStatyAEuSousedniZemeCrPodrobne` — odstraněny duplicitní pravé strany párů (Alpy 2×, Euro 2×, Německo 2×).
- **UX:** SelectOneInput — barevná tlačítka → bílé karty (`bg-white border-stone-300 shadow-md`).
- **Audit:** re-run grade-5 → `docs/AUDIT_GRADE_5_2026-06-11_rerun.md`.

### 2026-06-11 — Gradace obtížnosti: systémový check + velká písmena bez meta-textu ✅
- **Check 2b v runPedagogicalAudit**: podíl otázek L3 shodných s L1 ≥ 90 % → difficulty_progression. Imunní vůči shuffle (check 2 porovnával jen 1. otázku). Šablonové generátory s náhodnými čísly ~0 % překryv, pool-based s nadmnožinou < 60 % — bez false positives. Nález: 7 → 29 non-adaptivních témat.
- **velkaPismenaVlastniJmena.ts**: 6 úloh zbaveno meta-textu v options („Kopci (název ulice → velké)" → „Kopci") — zdůvodnění patří do explanation; +1 odpověď mimo options („paní (malé) Nováková (velké)"). Uzavřen otevřený nález z 2026-06-11.
- Testy: 61 failed (baseline 67, −6), audit-new-checks 44/44 ✅

### 2026-06-11 — Pedagogická revize grade-3 obsahu + systémové audit checky ✅
**Opravy obsahu (učily chybu):**
- `vyjmenovanaSlova.ts` + `slovaPribuznaVyjmenovana.ts`: **„byk" → „býk"** (3 úlohy učily špatný pravopis!), „pásla se býk" → „pásl se býk", duplicitní distraktory (bik 2×, milili 2×, sitý 2×, zvyknout 2×, brzy 2×), odpověď „Bystří / Bystrý" mimo options, cirkulární/zmatené explanations (kobyla→kobyla, hedging „nebo přinejmenším")
- `slovaPribuznaKorenSlova.ts`: voda-úloha s odpovědí obsahující řešení („— VODIT nepatří"), „KNIH / KNIH" a „koňský, koňar, kůň" mimo options, neexistující slovo „výpit", zmatené explanations (zimnička, srdce, DEN/DEN)
- `cteniZapisPorovnavaniCiselDo1000.ts`: hint „31 je menší než 60" prozrazoval odpověď → metodický hint
- `tabulkyJizdniRadyDiagramy.ts`: „zebr" → „zeber", „Které zvíře je nejvíce" → „Kterých zvířat je nejvíce"
- `obvodTrojuhelnikuCtverceObdelniku.ts`: duplicitní distraktor pro a=2 (4 cm 2×) → dedup

**Systémové řešení (contentAudit.ts — offline audit, běží v CI):**
- **c2 Duplicitní options** (case-sensitive — „Vltava" vs „vltava" je u velkých písmen legitimní)
- **c3 Giveaway option** — meta-text („nepatří", „→", „správně") nebo délka ≥ 2× všech distraktorů
- **d1b Sémantický leak porovnávání** — hint s čísly + menší/větší/rovná (s \b — „porovnávat" nematchuje)
- **Slovníkový strážce** `src/test/vyjmenovana-canon.test.ts` — každá correctAnswer vyjmenovaných témat pinována na kánon správných tvarů; překlep typu „byk" = okamžitý fail testu
- +10 unit testů checků (audit-new-checks 45/45 ✅)
- Testy: 63 failed (baseline 67 — žádný nový, 4 opraveny obsahem)
- **Otevřený nález:** velkaPismena options s meta-textem „(… → velké)" — flagged auditem, vyžaduje redesign options (ne kritické)

### 2026-06-10 — Audit grade-5: F1 + F2 — false-positive opravy audit nástroje ✅
- **F1** `taskValidator.ts`: substring check → `containsAsPhrase` (shoda jen na hranicích slov) + výjimka pro numerické/jednotkové odpovědi. `8 cm`/`8 cm²`, `5 °C`/`−5 °C`, `přímá řeč`/`nepřímá řeč`, `umělecký`/`neumělecký` už nejsou faulovány; `Praha` ⊂ `stará Praha` (skutečná ambiguita) stále invalid.
- **F2** `contentAudit.ts`: `answer_uniqueness` přeskakuje `drag_order`/`match_pairs` (correctAnswer je technický marker).
- Testy: `audit-new-checks.test.ts` aktualizovány na novou sémantiku (35/35 ✅), `audit:content` ✅, `audit:pedagogical` ✅, celá sada bez nových failů vs. baseline (67 pre-existujících).
- **Další krok:** znovu spustit audit grade-5 → reálný počet nálezů, pak R1–R6.

### 2026-06-10 — TopicBrowser UX: vynechání zbytečné meziúrovně při výběru předmětu ✅
- Klik na chip předmětu (initialSubject) → nová logika: `level = "subtopic"` (zobrazí všechna témata pro předmět), dříve `level = "category"` → prázdná stránka „Vyber si okruh"
- Výjimka zachována: grade-3 + předmět s `GRADE3_NAVIGATION` → stále zobrazuje okruhovou navigaci
- Opraveno `selectedCategory!` → `selectedCategory ?? topic.category` (ilustrace v "all topics" módu)
- `handleBack` v "all topics" módu (bez selectedCategory) → vrátí na výběr předmětu
- TypeScript 0 chyb

### 2026-06-09 — Grade-3 žákovská navigace: zploštění na 2 úrovně (okruh → téma) ✅
- Nový `src/content/grade-3/navigation.ts` — custom mapování okruhů (max 4 témata/okruh), 52 podtémat zachováno
- `TopicBrowser.tsx` — pro `grade === 3` použije custom 2-úrovňovou nav (okruh → téma → cvičení) místo 4-úrovňové RVP hierarchie; ostatní ročníky beze změny
- Matematika 5 okruhů, Čeština 8 okruhů (Prvouka zatím bez obsahu); RVP strom v adminu (`/admin/rvp-tree`) zůstává věrný oficiálnímu kurikulu
- Ověřeno v prohlížeči end-to-end (okruh → téma → spuštěné cvičení), TypeScript 0 chyb
- ⚠️ TODO (spawned): sloučit duplicitní CATEGORY render blok v TopicBrowseru

### 2026-06-08 — Per-karta OK + sync mezi PC (Supabase) ✅
- `useExerciseReview.ts` — per-karta „OK" stav, klíč `skill.id::otázka::odpověď`
- Supabase tabulka `admin_reviewed_cards` (migrace `20260608120000`), RLS pro admina (inline `EXISTS` nad `user_roles`)
- OK + Přeformulovat tlačítka přesunuta dovnitř karty (footer prop v CompactTaskCard); červený okraj = nezkontrolováno, zelený = OK
- Stabilní seedovaný náhled (`seededRandom.ts`) + tlačítko „Přegenerovat ukázky"
- ⚠️ Migration repair: `parent_invitations` + `custom_illustrations` označeny jako applied (existovaly v DB, chyběly v historii)

### 2026-06-08 — Admin editor: ReformulateTaskDialog + oprava corrupted ternárků ✅
- `ReformulateTaskDialog.tsx` — 2-sloupkový dialog, Groq Llama 3.3 70B, 5 polí (otázka/odpovědi/nápověda/postup/možnosti)
- Tlačítko „✦ Přeformulovat" per-karta v ExerciseTab, modifiedGenIndices tracking, uložení do DB
- Opraveny 4 soubory s corrupted ternárky (`□` místo `?`): `numbersMillion.ts`, `fracSameDen.ts`, `negativeIntro.ts`, `cteniZapisPorovnavaniCiselDo1000.ts`
- 29/29 grade-5 testů zelených, TypeScript 0 chyb

### 2026-06-08 — Grade-4 vlastivěda: explanation na historických tématech ✅
- `slovaneVelkomoravskaRiseCyrilAMetodej.ts` (31 úloh) — unikátní explanation na každé drag_order úloze
- `premyslovciSvVaclavPremyslOtakarIiVaclavIi.ts` (36 úloh) — unikátní explanation na každé drag_order úloze
- `lucemburkoveKarelIvAJehoDoba.ts` (35 úloh) — unikátní explanation na každé drag_order úloze
- `mistrJanHusHusitskeValky.ts` (35 úloh) — unikátní explanation na každé drag_order úloze
- Celkem ~137 unikátních vysvětlení ve 4 souborech
- Hinty přepsány: odstraněny sekvence dat „623 → 863 → …" (které leakují odpovědi)
- TypeScript check čistý (0 chyb)

### 2026-06-08 — Systémová oprava hints (getSafeHints.ts) ✅
- Vytvořen `src/lib/safeHints.ts` — centrální funkce `getSafeHints(task, topic)` pro drag_order/match_pairs/categorize
- drag_order: vždy 2 generické hinty (strategie + první položka jako kotva), NIKDY neprozrazuje pořadí
- Zapojen v `HelpButton.tsx` (runtime nápovědy) a zahrnut do `CheckFeedbackCard.tsx` (type-aware)

### 2026-06-08 — CheckFeedbackCard redesign ✅
- `CorrectAnswerDisplay`: type-aware zobrazení (drag_order=číslovaný seznam, match_pairs=šipky, ostatní=text)
- `ExplanationDisplay`: priorita task.explanation → task.solutionSteps → fallback helpTemplate.hint
- drag_order/match_pairs/categorize bez explanation: null (nevypisuje generické texty)

### 2026-06-08 — Auth.tsx: gramatika „1 úkolů" → `pad()` ✅
- Banner anon pokroku v `Auth.tsx` (ř. 158) měl inline `{count} úkolů` → „1 úkolů" (špatně)
- Opraveno na `pad(anonSummary.completedCount, "ÚKOL")` → 1 úkol / 2 úkoly / 5 úkolů
- Ověřeno v preview na localhost:8080

### 2026-06-08 — Grade-4 CJL: displayName + recommendedNext ✅
- Doplněno `displayName` (krátký rodičovský/dětský název) do všech 22 CJL souborů
- Doplněno `recommendedNext` (logická pedagogická návaznost) do všech 22 CJL souborů — návaznost v rámci podkategorií (slohová, čtení, stavba slova, tvarosloví, skladba, literární pojmy, práce s textem)
- Bonus: opraveno 10× `briefDescription` >12 slov + 2× `studentTitle` >4 slova napříč grade-4 (CJL, vlastivěda, přírodověda) — `language.test.ts` nyní zelený
- Typecheck čistý, 114/115 grade-4 testů zelených
- ⚠️ **Otevřené:** `pisemneScitaniAOdcitani.test.ts` — předexistující fail `gradeRange [4,4]` vs test očekává `[4,5]` (rozhodnout, zda téma patří i do 5. ročníku)

### 2026-06-03 — Ilustrace se po regeneraci neměnily (HF chybějící seed) ✅
- **Hlavní příčina:** Pollinations selhává (403 / IP block), chain padne na HuggingFace FLUX.1-schnell, který **bez `seed` parametru** vrací pro stejný prompt deterministicky bajtově identický obrázek → force regenerace zapsala stejná data → UI ukazovalo starý obrázek
- **Fix:** edge funkce posílá `parameters.seed` (random) do HF requestu → každá regenerace = nová varianta
- Ověřeno end-to-end přes preview: SHA-256 hash obrázku se po kliku „Znovu" mění, `<img>` se překreslí na nový blob (`visuallyChanged: true`)
- Vedlejší: do response přidán `providers` (diagnostika, který provider obrázek vygeneroval), Pollinations `nofeed=true` + vyšší entropie seedu
- **Pozn. k ověření:** předchozí fix `key` na `<img>` byl správný (zajišťuje remount), problém byl čistě na backendu
- ⚠️ **Otevřené:** Pollinations (deklarovaný jako primární „nejlepší kvalita") reálně **nikdy neběží** — vždy selže na 403 a použije se HF. K prověření zvlášť (token / IP).

### 2026-06-03 — Admin ilustrace se nepřekreslovaly po generování ✅
- Bug: po `bumpImageVersion()` hook `useImageVersions()` vrátil novou URL (blob / `?t=`), ale `<img>` se v UI nepřekreslil
- Příčina: React jen měnil `src` atribut (stejný element) → prohlížeč držel starý obrázek; `loading="lazy"` navíc odkládal načtení
- Fix v `AdminGenerateIllustrations.tsx` (2 `<img>`): `key={versioned(url, key)}` vynutí remount + odebráno `loading="lazy"`

### 2026-06-01 — Grade-4 kompletní obsah ✅
- 58 nových topics implementováno: čeština 22, vlastivěda 13, přírodověda 13, informatika 10
- Celkem 72 topics v GRADE_4_TOPICS (vč. 14 matematiky)

### 2026-05-25 — Trial flow critical bug fixes ✅ (4 z 5 bugů opraveno)
- ✅ **BUG #1 (BLOCKER):** ChildHomePage zaseknuté na "Načítání…" pro anon uživatele — chyběl `setLoading(false)` v `if (!user) return;` větvi
- ✅ **BUG #2 (BLOCKER):** TopicBrowser crash `s.charAt is not a function` — `capitalize` přijímá `unknown` s typeof guardem
- ✅ **BUG #3:** Špatný ročník v UI (6 místo 4) — sjednocení přes `getCurrentAnonGrade()` (trial state = single source of truth, legacy `oli_anon_grade` jen fallback)
- ✅ **BUG #4:** Pokrok se neukládá průběžně — useEffect cleanup v `useSessionDispatch` markuje anon task při unmount sezení (alespoň 1 správná odpověď), `completedRef` brání duplikaci s END handlerem
- ⏸️ BUG #5: Tab zamrzne po zavření InviteParentDialog — do Otevřené

### 2026-05-25 — Anonymní 14-denní trial ✅ (fundamentální změna freemium flow)
- ✅ `src/lib/anonTrial.ts` — `startTrial()`, `getTrialState()`, `getTrialDaysRemaining()`, `getTrialCurrentDay()`, `isTrialActive()`, `isTrialExpired()`, `clearTrial()`
- ✅ 14 testů (`src/test/anon-trial.test.ts`) — všechny prošly
- ✅ `Onboarding.tsx` — `startTrial(grade)` při výběru ročníku (idempotent)
- ✅ `AnonStudentPage.tsx` — refactor na 2 režimy:
  - **Trial aktivní (den 1-14):** plný dashboard s doporučeními + tlačítkem "Procházet všechny předměty" → SessionView TopicBrowser. Banner "Den X z 14 — plný přístup zdarma"
  - **Trial expired (den 15+):** freemium režim — jen 3 denní úkoly + amber CTA "Tvých 14 dní skončilo. Pokračuj zdarma navždy + řekni rodičům"
- ✅ Idempotent — změna ročníku nezresetuje trial, zachová `startedAt`
- ✅ `clearAnonData()` (anonMigration) maže i trial state po registraci

**Změna chování:** dříve anonymní = 3 úkoly/den od začátku. Teď = 14 dní plný přístup → pak 3 úkoly/den zdarma navždy. Žádná tvrdá blokáda.

### 2026-05-25 — Česká gramatika — centrální systém ✅
- ✅ `src/lib/czechGrammar.ts` — `plural()`, `pluralWithNumber()`, `pad()`, `form()`, `adj()`, `phrase()`, `pastTense()`, `pastTenseInclusive()`
- ✅ Slovník 30+ běžných substantiv (ÚKOL, ÚLOHA, DEN, DÍL, METR, …) + 11 adjektiv (STEJNÝ, MALÝ, …)
- ✅ 18 testů (`src/test/czech-grammar.test.ts`) — všechny prošly
- ✅ Konsolidováno 4× lokální `plural()` duplikáty: `ChildHomePage`, `ParentDashboard`, `AdminRvpTree`, `AdminCurriculumSidebar`
- ✅ Opravený bug "3 stejných dílů" → "3 stejné díly" v `zlomekJakoCastCelkuZnazorneniZlomku.ts`
- ✅ Opraveny `weeklyReportGenerator.ts` (3×), `SkillDetailModal.tsx` (2×), `ChildHomePage.tsx` motivační hlášky (4×)
- ✅ CLAUDE.md — povinné pravidlo "každý uživatelsky viditelný string s číslem + substantivem MUSÍ použít czechGrammar"

### 2026-05-24 — Anonymní onboarding — Krok E ✅ (fallback obsah pro prázdné ročníky)
- ✅ `src/lib/contentAvailability.ts` — `hasContentForGrade()`, `getBestAvailableGrade()`, `getContentWarning()`
- ✅ `Onboarding.tsx` — ročníky bez obsahu jsou šedé s labelem "brzy" (stále klikatelné, jen vizuálně rozlišené)
- ✅ `AnonStudentPage.tsx` — amber banner "🚧 Obsah pro X. ročník připravujeme. Zatím ti ukážeme cvičení pro Y. ročník."
- ✅ `ChildHomePage.tsx` — stejný banner pro přihlášené dítě s ročníkem bez obsahu
- ✅ `anonDailyTasks.ts` — refactor na `getBestAvailableGrade()` (jediný zdroj pravdy pro fallback logiku)

**Anonymní onboarding FINIŠ:** Kroky A+B+C+D+E hotové. Dítě může vstoupit, dostane 3 denní úkoly, pokrok se přenese při registraci, může pozvat rodiče, fallback obsah pro prázdné ročníky funguje.

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
