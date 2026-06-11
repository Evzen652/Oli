# OLI — Architecture Index & Project Status

> **Single entry point pro Claude Chat (product manager).**
> Jeden fetch tohoto souboru = úplný kontext architektury + aktuální stav.
> Detailní soubory linkovány níže (raw GitHub URLs).
>
> Repo: https://github.com/Evzen652/Oli
> Branch: `main`
> Aktualizováno: 2026-06-03

---

## 1. Co je OLI

Vzdělávací aplikace pro děti 1.–9. třídy ZŠ (Česká republika). Pokrývá kompletní RVP ZV (Rámcový vzdělávací program pro základní vzdělávání). Rodič zadává úkoly a sleduje pokrok, dítě procvičuje.

**Produkční doména:** oli-edu.com
**Vývoj:** solo developer (Evžen) + Claude Code + Claude Chat
**Fáze:** aktivní vývoj, priorita funkčnost nad dokonalostí

---

## 2. Stack

- **Frontend:** React 19 + Vite 5 + TypeScript + Tailwind 3 + shadcn/ui
- **Data:** Supabase (Postgres) + @tanstack/react-query
- **Charts:** Recharts
- **State:** React hooks (Zustand implicit)

---

## 3. Aktuální architektura (klíčová rozhodnutí)

### AI architektura (rozhodnuto 2026-05-20)
**AI negeneruje cvičení za běhu.** Zůstává pouze:
- **Session Evaluation** (async po sezení) — Gemini 2.5 Flash Lite
- **Report pro rodiče** (async) — Gemini 2.5 Flash Lite
- **Authoring asistent v adminu** — Claude API (offline, ne runtime)

Content fallback chain: `DB cache → Algoritmický generator → Empty state`. Žádné AI volání za běhu pro generování cvičení.

### Curriculum (rozhodnuto 2026-05-21)
**RVP dataset = zdroj pravdy** (`data/rvp_data.json`):
- 841 podtémat, 9 ročníků × 12 předmětů
- Stabilní ID formát: `g{grade}-{subject}-{area}-{topic}-{subtopic}` (kebab-case, bez diakritiky)
- Vyloučeny: VV, TV, HV, cizí jazyky
- Most do existujících internal IDs: pole `rvpNodeId` v `TopicMetadata`

### Paralelní Claude sessions (rozhodnuto 2026-05-21)
Architektura podporuje 2+ paralelní Claude Code session bez kolize:
- **Architekt session** — branch `main`, vlastní vše mimo `src/content/grade-*/`
- **Grade-N session** — branch `content/grade-N`, vlastní jen `src/content/grade-N/**`
- **Worktree** izolace na disku (`.claude/worktrees/grade-N`)
- **Sdílené typy** v `src/lib/types.ts` jsou zmrazené (mění je jen architekt)
- **Komunikace** mezi sessions přes `docs/PENDING_CHANGES.md`

### Modulární obsah (struktura `src/`)

```
src/
├── content/
│   ├── types.ts            ← NodeId formalismus
│   ├── curriculum.ts       ← RVP API (getNode, getNodesByGradeSubject, …)
│   ├── grade-4/            ← VLASTNÍ grade-4 session
│   │   ├── README.md       ← pravidla pro grade-4
│   │   ├── STATUS.md       ← tracker 72 podtémat
│   │   ├── TEMPLATE.ts     ← šablona topiku
│   │   ├── index.ts        ← export GRADE_4_TOPICS
│   │   └── {predmet}/      ← per-předmět topics
│   └── (grade-3, grade-5, … přijdou později)
├── lib/
│   ├── types.ts            ← TopicMetadata, PracticeTask, HelpData (zmrazené)
│   ├── content/            ← LEGACY (matematika/cestina/prvouka po předmětech)
│   │   └── index.ts        ← ALL_TOPICS = legacy + GRADE_4_TOPICS
│   └── …
├── components/             ← UI komponenty (architekt)
└── integrations/supabase/  ← auto-generated, NEEDITOVAT
```

---

## 4. Roadmap (pořadí práce)

1. ~~**Nové typy cvičení**~~ ✅ — 6 typů hotovo (TextInput, FillBlank, MatchPairs, DragOrder, MultiSelect, TrueFalse)
2. **Admin editor cvičení** — základ pro vlastní obsah
3. **i18n příprava** — technický základ pro jiné státy
4. ~~**Audit systém**~~ ✅ — contentAudit + pedagogický audit pipeline hotovo
5. **RVP import** — naplnění obsahem (probíhá přes grade-N sessions)

### Typy cvičení — všechny hotovy ✅
- [x] Multiple choice (`select_one`)
- [x] Fill in the blank (`fill_blank`)
- [x] True/False (`true_false`)
- [x] Text input (`text_input`)
- [x] Matching pairs (`matching`)
- [x] Ordering (`ordering`)
- [x] Multi-select (`multi_select`)

---

## 5. Hotovo (od 2026-05-22)

| Co | Stav | Popis |
|---|---|---|
| **6 typů cvičení** | ✅ | `select_one`, `fill_blank`, `true_false`, `text_input`, `matching`, `ordering` — nové komponenty + routing |
| **Templated facts** | ✅ | Architektura faktů oddělená od generátorů; `contentType: "factual"` vs `"conceptual"` |
| **Hint leaky — grade-4** | ✅ | Odstraněny prozrazující hinty v `aritmetickyPrumerUvod`, `rovnobezkyAKolmice`, `trojuhelnikDruhy` |
| **Parent UI** | ✅ | `PositiveObservation` + `NextWeekPlan` ve zprávě, strukturovaný Gemini output |
| **Student UI** | ✅ | Feature flags, pozitivní labely (Výborně!/Pěkně!), `TopicResultDetail`, skryty filtry známek |
| **Pedagogický audit** | ✅ | `runPedagogicalAudit()` + `auditFlag` na `TopicMetadata`, npm skripty |
| **UX bugy** | ✅ | Kapitalizace, grade filter, demo session subject parametr, auth redirect |
| **Adaptivní obtížnost** | ✅ | Adaptive difficulty mezi sezeními (session evaluation → next level) |
| **`refactor/inputType-per-task`** | ✅ | `inputType` přesunut z `TopicMetadata` na `PracticeTask` |
| **DisplayNames (dětské názvy)** | ✅ | Per-grade slovník RVP okruhů → dětské ekvivalenty, viditelné v TopicBrowser |
| **Authoring Launcher** | ✅ | `AuthoringLauncher` komponenta v admin ExerciseTab pro Level II+III — generuje prompt pro Claude Chat |
| **CI/CD + E2E testy** | ✅ | GitHub Actions pipeline, Playwright setup, 5 E2E spec souborů, GitHub Secrets (Supabase) |
| **Admin ilustrace — fix** | ✅ | Legacy imageKey priorita (admin panel = stejné klíče jako UI), DEFAULT_DESCS pro grade-4 geometrii |
| **Admin ilustrace — generování** | ✅ | Pollinations `gen.pollinations.ai` + `?key=` auth; HF seed fix; `key` prop na `<img>` pro remount |
| **Inline editace dítěte** | ✅ | Editace jména/ročníku přímo v gradient kartě (shadcn Select přes Radix Portal) |
| **AssignmentCreator** | ✅ | Přepsán na code registry (`getAllTopics()`), ilustrace s `mix-blend-multiply` |
| **UI redesign** | ✅ | Stats karty s ikonami, fialový session header, ChildHomePage layout s chipy předmětů |
| **Grade-4 matematika** | ✅ | 14/14 topics implementovány (plný RVP pro 4. ročník) |
| **Grade-4 obsah kompletní** | ✅ | 72 topics: matematika 14, čeština 22, vlastivěda 13, přírodověda 13, informatika 10 |
| **CI/CD + E2E testy** | ✅ | GitHub Actions pipeline, Playwright setup, 5 E2E spec souborů |
| **Freemium + 14-denní trial** | ✅ | Anonymní vstup, trial flow, adaptive difficulty, InviteParent flow |
| **Architektura paralelních sessions** | ✅ | Worktree izolace, SESSION_OWNERSHIP, PENDING_CHANGES komunikace |
| **RVP dataset + curriculum API** | ✅ | 841 podtémat, `data/rvp_data.json`, `rvpNodeId` most |
| **Grade-3 žákovská navigace 2 úrovně** | ✅ | `navigation.ts` — okruh → téma (max 4/okruh), 52 podtémat zachováno; jen pro grade 3, RVP strom v adminu beze změny |

### Session 2026-06-10 — hotovo:
- ✅ **TopicBrowser UX: vynechaná meziúroveň „Vyber si okruh"** — klik na chip předmětu v ChildHomePage přeskočí úroveň `category` a jde přímo na `subtopic` (zobrazí všechna témata daného předmětu najednou). Výjimka: grade-3 matematika + čeština s `GRADE3_NAVIGATION` zůstávají na 2-úrovňové okruhové navigaci beze změny. Opraveno i `rvpCategory = selectedCategory ?? topic.category` pro ilustrace v "all topics" módu. TypeScript 0 chyb.
- ✅ **„Začít procvičovat" bug** — `onClick={onBrowseTopics}` předávalo MouseEvent jako `subject` → prázdný subtopic grid. Opraveno na `() => onBrowseTopics()`.
- ✅ **Session obrazovka — barevný redesign dle předmětu** — header proužek (4px), solid badge, aktivní progress dot a karta cvičení (shadow-lg, gradient -100→-200, bez levého proužku) v barvě předmětu. `getSubjectColor()` rozšířen o přírodovědu/vlastivědu/informatiku. Sytější tlačítka odpovědí (`-200/-400` + barevný stín). Nápověda „Chceš trochu poradit?" violet-200/400/900.
- ✅ **Typografie** — nadpisy session (`font-heading`) přepnuty na **Baloo 2** (oblý dětský font s českou diakritikou; Fredoka One měl vadné háčky). Odstraněn prefix „Téma:", tučnější texty.
- ✅ **Dialog „Co je dobré vědět" — barevné boxy** — Jak na to (modrá), Příklad (zelená), Častá chyba (červená).
- ✅ **Landing page** — skryté tlačítko „Vyzkoušet demo" (hero + desktop nav + mobile menu); prohozeny karty Diktát ↔ Příprava na písemku (zachována geometrie); větší box vpravo (Každodenní vyučování). ⚠️ Obnoven původní obrázek `subject-cestina.png` v Supabase storage (omylem přepsaný dřív). **Pravidlo: na landing obrázky nešahat bez pokynu** (uloženo do paměti).

## 6. Otevřené / další v pořadí

### Session 2026-06-10/11 (pokračování) — hotovo:
- ✅ **Audit grade-5 F1+F2: false-positive opravy audit nástroje** — `taskValidator.ts` substring → word-boundary shoda (`containsAsPhrase`) + výjimka numerických/jednotkových odpovědí; `contentAudit.ts` answer_uniqueness přeskakuje `drag_order`/`match_pairs`. Testy aktualizovány (35/35 ✅), žádné nové faily vs. baseline 67.
- ✅ **Pedagogická revize grade-3 (152 vzorků) + opravy kritických chyb obsahu** — „byk"→„býk" (učilo špatný pravopis!), giveaway úlohy, hint leaky, duplicitní distraktory, „zebr"→„zeber". Detail v PENDING_CHANGES.
- ✅ **Systémové audit checky** — duplicitní options, giveaway option (meta-text/délka), sémantický leak porovnávání + slovníkový strážce vyjmenovaných slov (`vyjmenovana-canon.test.ts`). Checky samy našly 3 chyby, které ruční revize přehlédla. Testy: 63 failed (o 4 méně než baseline).
- ✅ **Gradace obtížnosti: check 2b (recyklace otázek L1→L3)** — odhalil 29 non-adaptivních generátorů (původní check viděl 7). + velká písmena: 6 úloh zbaveno meta-textu v options, 1 odpověď mimo options. Testy: 61 failed (baseline 67, −6). **Follow-up:** 29 témat potřebuje autorsky těžší L3 úlohy (viz PENDING_CHANGES).

### Session 2026-06-12 — hotovo:
- ✅ **Admin editor: match_pairs + multi_select** — `CreateExerciseDialog`/`EditExerciseDialog` rozšířeny ze 4 na 6 typů. Nové editory párů (min 3, max 8, validace unikátnosti) a multi-select (checkboxy správných). DB migrace `custom_exercises.pairs` + `correct_answers` JSONB (aplikováno přes API). Strukturální override ve `taskValidator` + `resolveTaskValidation` (set_match) + `PracticeInputRouter` (detekce correctAnswers) + `customExerciseLoader` (mapování polí).
- ✅ **Dětské názvy okruhů — bug + chybějící slovníky** — `AnonStudentPage.DailyTaskList` zobrazoval syrový RVP `topic.category` (např. „Komunikační a slohová výchova") místo `getDisplayCategory()`. Opraveno (+ protažen `grade` prop). **Hlavní příčina:** grade-5 slovník existoval ve starém nepoužitém formátu a nebyl v `BY_GRADE` → grade-5 žáci viděli vše syrově. Přepsán do `DisplayMap` + zaregistrován. Doplněny chybějící kategorie: grade-3 prvouka (5), grade-4 čeština+ČaJS+informatika (11), grade-5 kompletní (16). Ověřeno v prohlížeči grade-3 i grade-5.
- ✅ **Preview port fix** — `.claude/launch.json` 5173 → 8080 (sjednoceno s `vite.config.ts`).

### Session 2026-06-11 (pokračování 2) — hotovo:
- ✅ **P0 KRITICKÁ OPRAVA: drag_order/match_pairs/categorize vždy vyhodnocovaly špatně** — orchestrátor porovnával žákovu strukturovanou odpověď se stringovým markerem `"order"`/`"match"`. Přidány `pairsMatchValidator` + `categorizeValidator` + `resolveTaskValidation()`. Zapojeno v `sessionOrchestrator.ts` CHECK + `DemoSession.tsx`. Ověřeno v prohlížeči. 183 testů zelených.
- ✅ **R1 fill_blank validátor** — `shodaPrisudkuSPodmetem.ts` používá `___` (3 podtržítka = 1 blank). Validátor přepnut na `/_+/g`. Bonus: fix i/y větve (vyžaduje obě varianty i+y, ne samotné „I").
- ✅ **R3 match_pairs vadná data Evropa** — `evropaPolohaPovrchVodstvoPodnebi`: Matterhorn→Alpy (duplicita) → Pico de Aneto→Pyreneje. `evropskeStatyAEuSousedniZemeCrPodrobne`: Euro 2× → forint, Německo 2× → Maďarsko.
- ✅ **Audit grade-5 re-run** — report `docs/AUDIT_GRADE_5_2026-06-11_rerun.md`. F1+F2 ověřeny (select_one format 20→0, answer_uniqueness 18→0). Nové nálezy: giveaway délkou 178, meta-text 14, non-adaptivní 2→6.
- ✅ **UX: SelectOneInput** — barevná tlačítka odpovědí (modrá/fuchsiová/zelená/žlutá) → čisté bílé karty s šedým okrajem (`bg-white border-stone-300 shadow-md`).

| Co | Kdo | Stav |
|---|---|---|
| ~~R2: match_pairs→categorize (obratlovci, říše)~~ | Architekt | ✅ 2026-06-11 |
| R4: hint_leak „= odpověď" (104 nálezů) | Architekt | ⏸️ Autorská práce |
| R5: non-adaptivní generátory grade-5 (6 témat) | Architekt | ⏸️ Autorská práce |
| R6: missing_hints matematika (12 témat) | Architekt | ⏸️ Ověřit helpTemplate |
| Giveaway délkou (178 nálezů) | Architekt | ⏸️ Velký rozsah, autorská práce |
| ~~Sloučit duplicitní CATEGORY render v TopicBrowseru~~ | Architekt | ✅ 2026-06-11 |
| ~~Grade-3 prvouka (14/14 témat)~~ | Architekt | ✅ 2026-06-12 |
| Admin editor cvičení (Level II+III authoring) | Architekt | ✅ 2026-06-12 — Create+Edit dialogy, 6 typů (select_one/true_false/fill_blank/short_answer/match_pairs/multi_select), DB migrace |
| Email integrace pro parent_invitations (Resend) | Architekt | ⏸️ Follow-up |
| Grade-5 až Grade-9 | Grade-N sessions | ⏸️ Čeká |

### Session 2026-06-08 (pokračování) — hotovo:
- ✅ **Grade-4 vlastivěda: systémový fix hints + explanation** — `getSafeHints.ts` centrální funkce zabraňuje únikům správných odpovědí v nápovědách (drag_order/match_pairs/categorize). `CheckFeedbackCard` redesign: type-aware zobrazení správné odpovědi (`CorrectAnswerDisplay`) + unikátní vysvětlení WHY pro každou otázku (`ExplanationDisplay`).
- ✅ **Grade-4 vlastivěda: explanation na všech 4 historických tématech** — `pravekAPrvniLideNaNasemUzemi` (36 úloh), `slovane` (31), `premyslovci` (36), `lucemburkove` (35), `mistrJanHus` (35) — každá úloha má unikátní `explanation` vysvětlující kauzální logiku pořadí. Celkem ~173 unikátních vysvětlení.
- ✅ **Grade-4 vlastivěda: kraje + vodstvo** — dynamická explanation přes `KRAJ_FAKTA` a `VODNI_FAKTA` slovníky.
- ✅ **solutionSteps bug (písemné sčítání)** — přepsáno s `addSteps`/`subSteps` helpery, zobrazuje všechny sloupce (jednotky/desítky/stovky/tisíce) + přenosy.
- ✅ **Auth.tsx: gramatika „1 úkolů"** → `pad(count, "ÚKOL")`.

### Session 2026-06-08 (pokračování 4) — audit:
- ✅ **Komplexní audit (technický + pedagogický + bezpečnostní)** → `docs/AUDIT_2026-06-08_full.md`. 3 paralelní agenti, nic neměněno (jen hodnocení).
- 🔴 **2× CRITICAL bezpečnost:** Groq klíč v klientském bundlu (rotovat!) · `generate-prvouka-images` edge funkce bez auth.
- 🟠 **Korekce:** „67 testů = whitelist" bylo CHYBNÉ — ≥6 příčin, nejvážnější možná regrese `classifyIntent` boundary brány (~40 selhání).
- 🟠 **Pedagogika:** vymyšlené názvy druhů v g4 přírodovědě (ekosystémy) · hinty historie prozrazují celé pořadí.
- Detail + prioritizovaný akční plán (P0–P3) v audit reportu.

### Session 2026-06-08 (pokračování 3) — hotovo:
- ✅ **Symbol porovnání `□` → `vs`** — placeholder ve všech porovnávacích úlohách (grade-3/4/5 matematika) změněn na čitelné „vs" (např. „Porovnej: 183 vs 126"). Upraveny i test regexpy. 29/29 grade-5 testů zelených.
- ✅ **Stabilní (seedovaný) náhled ukázek v adminu** — `src/lib/seededRandom.ts` (mulberry32 + FNV-1a hash + `withSeededRandom`). ExerciseTab generuje ukázky deterministicky ze `skill.id` → karty „neskáčou" při renderu/reloadu. Tlačítko „Přegenerovat ukázky" (zvýší seed) pro novou stabilní sadu.
- ✅ **Per-karta OK (kontrola obsahu) + sync mezi PC** — `src/hooks/useExerciseReview.ts`: každá ukázková karta má tlačítko „Označit OK" vedle „Přeformulovat" (obě uvnitř karty, pod obsahem, v rámci okraje). Nezkontrolovaná = červený okraj, OK = zelený. Klíč = `skill.id + otázka + odpověď`. **Persistence v Supabase** (`admin_reviewed_cards`, migrace `20260608120000`) → synchronizuje se mezi oběma PC. Optimistický update + fire-and-forget zápis.
- ⚠️ **Supabase migrace — repair:** `parent_invitations` + `custom_illustrations` existovaly v DB, ale chyběly v historii migrací → `supabase migration repair --status applied`. Pozn.: remote DB nemá funkci `has_role()`, RLS politiky musí používat inline `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`.

### Session 2026-06-08 (pokračování 2) — hotovo:
- ✅ **Admin editor cvičení: Přeformulovat dialog** — `ReformulateTaskDialog.tsx` s Groq Llama 3.3 70B. Tlačítko „✦ Přeformulovat" na každé kartě ukázky ze šablony; 2-sloupkový dialog (originál vlevo, varianty vpravo); 5 polí (otázka, odpovědi, nápověda, postup, možnosti). Varianty jsou klikatelné → aplikují se na task. Upravené tasky lze uložit do `custom_exercises`.
- ✅ **Opraveny corrupted ternárky (□ symbol)** — `replace_all` na ` ?` → ` □` poškodil ternární operátory v 4 souborech. Opraveny: `numbersMillion.ts`, `fracSameDen.ts`, `negativeIntro.ts`, `cteniZapisPorovnavaniCiselDo1000.ts`. Symbol `□` zůstává jen v string literálech otázek (placeholder pro porovnání). 29/29 grade-5 testů zelených.
- ✅ **Česká gramatika — STOVKA/DESÍTKA/JEDNOTKA** — přidány do NOUNS registru `czechGrammar.ts`; `cteniZapisPorovnavaniCiselDo1000.ts` (grade-3) opravuje „5 desítky" → `pad(5, "DESÍTKA")` = „5 desítek".

### Session 2026-06-08 — hotovo:
- ✅ **Auth.tsx gramatika:** banner anon pokroku měl „1 úkolů" (inline `{count} úkolů`) → opraveno na `pad(count, "ÚKOL")`. Ověřeno v preview.
- ✅ **Audit obsahu grade-5** → [`docs/AUDIT_GRADE_5_2026-06-08.md`](docs/AUDIT_GRADE_5_2026-06-08.md). 63 témat / 1008 úloh, technická úspěšnost 84 %. Report rozlišuje reálné problémy (fill_blank `___`/blanks, match_pairs→categorize u obratlovců/říší, hint_leak vzorec „= odpověď", 2 neadaptivní generátory) od false-positive auditu (select_one substring-heuristika validátoru, answer_uniqueness nerozumí order/match). Prioritizace oprav viz report; otevřené body v PENDING_CHANGES.
- ✅ **subject-vlastiveda.png: odstraněno neprůhledné pozadí.** Jediná subject ilustrace měla místo transparentního pozadí světle modrou oblohu → na bílé kartě (`mix-blend-multiply` umí skrýt jen bílou) zůstával viditelný čtverec. Pozadí odstraněno flood-fillem od rohů (sharp) — souvislé pozadí pryč, modrá zeměkoule v motivu zachována. Ověřeno: rohy alpha=0, střed alpha=255.
- ✅ **Denní úkoly: 3 → 4 návrhy.** `DEFAULT_DAILY_COUNT = 4` v `anonDailyTasks.ts`; texty „X cvičení" v AnonStudentPage převedeny na `pad(dailyTopics.length, "CVIČENÍ")` (dynamicky dle počtu, dle pravidla czechGrammar). Výběr dál preferuje různé předměty → 4 úkoly = po jednom z matematiky/češtiny/vlastivědy/přírodovědy.
  - `getTodayProgress` (anonProgress.ts) doplní nové úkoly do už uloženého dnešního progressu (3 → 4) bez ztráty dosavadního pokroku — stávající uživatelé uvidí 4. úkol hned po reloadu, ne až další den.
- ✅ **SubjectGrid: výpis okruhů na kartách.** Karty předmětů na dashboardu zobrazují pod názvem až 3 okruhy (přes `getDisplayCategory` → dětské názvy tam, kde existují, jinak RVP). Styl sjednocen s denními úkoly — barevný text v barvě předmětu (ne šedé pilulky). Přírodověda má reálně jen 2 okruhy.
- ✅ **Sjednocené čtvercové karty napříč /student dashboardem i TopicBrowserem.** Všechny gridy (DailyTaskList, SubjectGrid, TopicBrowser subject/topic/category/subtopic) převedeny na `aspect-square` čtverce.
  - Dashboard (úzký kontejner ~624px): `grid-cols-1 sm:grid-cols-2` → karty 304×304, aby se vešel celý text bez ořezávání (odstraněn `line-clamp`/`truncate` u okruhu i tématu).
  - TopicBrowser (max-w-5xl): `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` → karty ~331×331.
  - DailyTaskList přepsán z horizontálního seznamu na grid: ilustrace nahoře, předmět | okruh, téma, tlačítko Začít / štítek Splněno dole.
  - TopicBrowser subject grid: odstraněn asymetrický „featured" layout (1. předmět velký) ve prospěch jednotných čtverců.
- ✅ **TopicBrowser: odstraněn duplicitní nadpis předmětu.** Na úrovni `category` byl název předmětu (např. „Čeština") dvakrát — ve welcome banneru i jako `h2`. Na úrovni `category` se `h2` už nezobrazuje (banner ho nese), na hlubších úrovních zůstává (banner = předmět, `h2` = okruh/téma).
- ✅ **Grade-4 CJL: `displayName` + `recommendedNext` — 22/22 souborů.** Krátký rodičovský/dětský název + logická pedagogická návaznost v rámci podkategorií (slohová, čtení, stavba slova, tvarosloví, skladba, literární pojmy, práce s textem).
- ✅ **Bonus — `language.test.ts` zelený:** opraveno 10× `briefDescription` >12 slov + 2× `studentTitle` >4 slova napříč grade-4 (CJL, vlastivěda, přírodověda). ⚠️ Zbývá předexistující fail `pisemneScitaniAOdcitani` (`gradeRange [4,4]` vs test `[4,5]`).
- ✅ **Grade-4 CJL: explanation kompletní — 22/22 souborů.**
- ✅ **SubjectGrid** na AnonStudentPage — předměty s ilustracemi místo jednoho tlačítka. Klik → TopicBrowser filtrovaný na předmět (SessionView čte `oli_anon_browse_subject` ze sessionStorage).
- ✅ **TopicBrowser UI redesign:** logo Oli odstraněno z headerů; rovnoměrný grid (aspect-square, 2–3 sloupce) místo featured layout; ilustrace `w-44 h-44`; nadpis `text-lg font-black`; popis okruhu jako fallback na `briefDescription`.
- ✅ **grade-3 displayNames.ts** vytvořen — 7 okruhů + 17 témat s dětskými názvy a popisy (matematika + CJL). Zaregistrováno v `displayNames.ts` (BY_GRADE[3]).
- ✅ **SkillHeader / DailyTaskList** — předmět nahoře `text-base font-bold` v barvě + `|` + okruh stejnou barvou; téma pod tím.
- ✅ **subjectRegistry.ts** — přidáno pole `color` ke `SubjectMeta` (matematika=blue-600, čeština=purple-600, prvouka=green-600, přírodověda=emerald-600, vlastivěda=amber-600).
- ✅ **Audit check `czech_grammar`** — detekuje vzor `2–4 + genitiv plurálu` v question textu. Přidáno do `contentAudit.ts` (AuditCategory, CATEGORY_LABELS, CATEGORY_COLORS, byCategory).
- ✅ **slovniUlohySeDvemaOperacemi.ts** — opravena gramatika: `plural()` pro jablko/knížku/místo/auto; KNÍŽKA/MÍSTO/AUTO přidány do NOUNS rejstříku; `solutionSteps` → `explanation`.

### Poslední session (2026-06-07) — hotovo:
- ✅ InviteDialog memory leak opraven (AbortController)
- ✅ Audit systém: 10 nových checků, 33 unit testů
- ✅ Feedback systém: `explanation` pole na PracticeTask, CheckFeedbackCard redesign
- ✅ Grade-3 CJL (25 souborů): explanation per otázka, odstraněno `solutionSteps: Odpověď: a`
- ✅ Grade-3 matematika audit: 7 hint_leak → 0, 10 hint_progression → 0
- ✅ hintLeakage.ts: oprava regex escapování (pipe char bug v hintShowsEquality)
- ✅ STATUS.md grade-3: checkboxy prvouka opraveny (0/14)

---

## 7. Detailní dokumenty (linky)

Pro hlubší kontext fetchni:

| Co | Raw URL |
|---|---|
| **CLAUDE.md** (pravidla pro Claude Code) | https://raw.githubusercontent.com/Evzen652/Oli/main/CLAUDE.md |
| **Session ownership** (kdo co vlastní) | https://raw.githubusercontent.com/Evzen652/Oli/main/docs/SESSION_OWNERSHIP.md |
| **Pending changes** (cross-session požadavky) | https://raw.githubusercontent.com/Evzen652/Oli/main/docs/PENDING_CHANGES.md |
| **Grade-4 README** (pravidla pro grade-4) | https://raw.githubusercontent.com/Evzen652/Oli/main/src/content/grade-4/README.md |
| **Grade-4 STATUS** (72 podtémat + checkboxy) | https://raw.githubusercontent.com/Evzen652/Oli/main/src/content/grade-4/STATUS.md |
| **Grade-4 TEMPLATE** (vzor topiku) | https://raw.githubusercontent.com/Evzen652/Oli/main/src/content/grade-4/TEMPLATE.ts |
| **TopicMetadata typ** (sdílený contract) | https://raw.githubusercontent.com/Evzen652/Oli/main/src/lib/types.ts |
| **Curriculum API** | https://raw.githubusercontent.com/Evzen652/Oli/main/src/content/curriculum.ts |
| **RVP dataset** (841 podtémat) | https://raw.githubusercontent.com/Evzen652/Oli/main/data/rvp_data.json |

---

## 8. Pedagogická filozofie

- **Spirálovost** — stejné téma se vrací v komplexnější podobě napříč ročníky
- **Chyba ≠ trest** — aplikace motivuje k opakování, ne penalizuje
- **Rodič = partner** — reporting je pro podporu, ne kontrolu
- **Méně je více** — 5 kvalitních cvičení lepší než 20 průměrných
- **Žádná gamifikace** — žádné body, odznaky, streaks, leaderboards
- **Efficiency principle** — "čím méně času dítě v systému stráví, tím lépe"

---

## 9. Role v projektu

- **Claude Chat** (Claude.ai) — **product manager / strategický architekt**: navrhuje směr, ptá se, validuje rozhodnutí. Své návrhy formuluje jako instrukce pro Claude Code v code blocku.
- **Claude Code (architekt session)** — developer infrastruktury, typů, integrace, DB schema, UI komponent. Mergne práci grade-N sessions.
- **Claude Code (grade-N session)** — developer obsahu pro 1 ročník. Žije v izolovaném worktree, pracuje výhradně v `src/content/grade-N/`.

---

## 10. Poslední commity (top of `main`)

Pro aktuální seznam fetchni:
https://api.github.com/repos/Evzen652/Oli/commits?per_page=10

(Nebo se podívej na https://github.com/Evzen652/Oli/commits/main)
