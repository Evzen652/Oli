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

### 67 pre-existujících padajících testů — ≥6 příčin (NE jen whitelist!)
> ⚠️ KOREKCE: dříve zde stálo „jen zastaralý inputType whitelist". Audit 2026-06-08 (`docs/AUDIT_2026-06-08_full.md`) ukázal, že whitelist je jen **2 z 67**. Padá 17 test souborů s ≥6 příčinami:
- **A** (2): `topic-invariants.test.ts:42-53` whitelist chybí `true_false`. Triviální.
- **B** (~40+, NEJVÁŽNĚJŠÍ): `classifyIntent`/keyword-matching vrací `topical` místo `unclear_input`/`nonsense`/`wrong_grade` — nová obsahová klíčová slova matchují dříve odmítané vstupy. **Možná funkční regrese boundary/security brány** (žák může dostat „téma" na nesmysl/out-of-scope). Prošetřit prioritně. Soubory: `preintent*`, `red-team`, `security`, `system-stress`, `stress-test-a`, `keyword-conflicts`, `multi-role-flow`, `prvouka-visuals`.
- **C** (9): `generator-validation.test.ts` — `correctAnswer` není v `options` (vyjmenovaná slova, rýmy).
- **D** (1): spec rozpor `taskValidator.ts:54` (match_pairs ≥3) vs `lib-utilities.test.ts:246` (≥2).
- **E** (1): `i18n-completeness` — `parent.greeting` bez `{name}`.
- **F** (1): `sloh-topics` — chybí topic `cz-sloh-vypraveni`.
- Vše **pre-existující** (67 na čistém HEAD i se změnami 2026-06-08).

### Bezpečnostní nálezy z auditu 2026-06-08 (viz docs/AUDIT_2026-06-08_full.md)
- 🔴 **C1 (vyžaduje akci uživatele):** Groq klíč `VITE_GROQ_API_KEY` je v klientském bundlu → rotovat v Groq dashboardu + přesunout volání do edge funkce. `src/lib/aiClient.ts`.
- 🔴 **C2:** `generate-prvouka-images` edge funkce bez auth (service-role) → přepis ilustrací / DoS. Přidat admin gate.
- 🟠 H1 `generate-logo` bez auth · H2 `send-parent-invite` bez auth (email bombing) · H3 `parent_invitations` UPDATE `USING(true)` · H4 bucket `prvouka-images` zápis bez role check.

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

### BUG #5 — Tab zamrzne po zavření InviteParentDialog
- Možný memory leak v animaci/listeneru — předběžně do PENDING
- TODO: zkontrolovat `useEffect` cleanup v `InviteParentDialog.tsx`, vyčistit setTimeout/listenery při unmount
- Pokud používá framer-motion AnimatePresence, zkontrolovat exit handler

### Czech grammar audit zbylých generátorů
- Centrální helper `src/lib/czechGrammar.ts` vytvořen + testován (18/18 testů ok)
- Opraveny nejviditelnější bugy: `zlomekJakoCastCelku`, ChildHomePage motivační hlášky, weeklyReportGenerator, SkillDetailModal
- **TODO**: audit zbývajících ~25 content generátorů v `src/lib/content/math/*` — najít ternární `n === 1 ? ... : ...` patterny a převést na `pad()` / `phrase()`
- Postup: `grep "=== 1 \? .* : .* :"` per soubor, refactor postupně

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

## Otevřené (doplněno 2026-06-11 pokr.)

### R2 — match_pairs→categorize (obratlovci, říše rostlin/hub/živočichů)
Audit R2: `obratlovciSavciPtaciPlaziObojzivelniciRyby.ts` a `riseRostlinHubZivocichu.ts` jsou ve skutečnosti kategorizace (více položek → stejná třída), ne 1:1 párování. Změnit `inputType` na `categorize` + restrukturovat data na `categories: [{name, items}]`. Bonus překlepy: „Čolník"→„Čolek", Rak označen jako ryba.

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
