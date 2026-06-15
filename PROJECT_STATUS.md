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

### Session 2026-06-15 — Grade-5 čeština cleanup (hotovo):
- ✅ **Hint_leak + giveaway grade-5 čeština (9 souborů opraveno, 12 čistých)** — systematické odstranění nápověd, které prozrazovaly odpověď. Hinty typu „termín = definice/tvar" (např. „Večerní → měkké", „'By' = podmiňovací", „Mlčte = vy") přepsány na **navedení otázkou / rozlišovacím znakem** bez vyřčení odpovědi. Hranice: pádové otázky („Koho/čeho?") a obecná pravidla ponechány (zavedená mnemotechnika). Soubory: `pridavnaJmena`, `slovesaZpusob`, `podmetVyjadreny`, `cislovky`, `souvetiVzorce`, `slovniDruhy`, `primaANeprimaRec`, `basenLyricka`, `elementarniLiterarni`. Detekce přes 3 paralelní agenty, opravy zčásti ručně (velké soubory), zčásti delegovány na agenty + revize. **Vady navíc:** duplicitní/meta option „krásnou ženu správně", placeholder uvozovek „dolni-uvoz" → „ ", sporný počet vět „Jedl, pil a zpíval…" (3→2, několikanásobný přísudek), překlepy museum→muzeum / většíhopříběhu / reproukci, giveaway „nic"→„být", vadná otázka v `umelecke`. `shodaPrisudkuSPodmetem` (fill_blank) ponechán vědomě (rod+koncovka = aplikační scaffolding). **Ověřeno:** tsc 0 chyb, generator-validation bez nových failů (correctAnswer ∈ options); 2 chyby agentů (ASCII uvozovka, museum mismatch) odchyceny. Detail v `docs/PENDING_CHANGES.md`.

### Session 2026-06-15 — plánování:
- 📋 **Plán obsahu 2. stupně (ročníky 6–9)** → [`docs/STUPEN2_CONTENT_PLAN.md`](docs/STUPEN2_CONTENT_PLAN.md). Rozsah ~505 podtémat (2× dosavadní obsah), 6 nových předmětů (dějepis, fyzika, chemie, přírodopis, zeměpis, výchova k občanství). **Rozhodnuto:** pilot napřed → 6. ročník **Dějepis + Fyzika** (textový + výpočetní vzor); metoda **Hybrid** (výpočetní předměty ručně jako kód, faktické přes authoring pipeline). Standard kvality 2. stupně (aplikace ne rozpoznání, reálná L1→L3 gradace) + Definition of Done definovány. **Zjištění:** odborné UI typy (chemical_balance/formula_builder/timeline/diagram_label/number/essay) UŽ existují v `PracticeInputRouter.tsx` + validátory → potřebují jen smoke test. `subjectRegistry.ts` zná jen 5 předmětů 1. stupně → 6 nových jede přes `buildFallback` (Fáze 0). Existující `docs/CONTENT_ROADMAP.md` částečně zastaralý (DB-skilly/RAG/ai-tutor opuštěny 2026-05-20).
- 🔬 **Sebeověření pedagogické kvality** (sekce 6 plánu) — triangulační ověření: generátor + deterministický solver (dvojí výpočet, plausibility guards) + **LLM blind-solve + adversariální judge** dle rubriky 7 kritérií (řešitelnost, jednoznačnost, realističnost, num. čistota, kvalita distraktorů, nápověda, vysvětlení). Produkt: **„chybový model distraktorů"** (distraktory = typické chyby, ne náhodné posuny → zároveň diagnostikují chybu žáka). **Ověřeno demem** na 4 grade-3 slovních úlohách: judge naslepo potvrdil výpočty + našel 3 vady, které deterministický audit propustí (náhodné distraktory, nereálná cena, identické nápovědy). Follow-up grade-3 v PENDING_CHANGES.
- 📐 **Pedagogická specifikace** → [`docs/PEDAGOGICKA_SPECIFIKACE_STUPEN2.md`](docs/PEDAGOGICKA_SPECIFIKACE_STUPEN2.md) (kanonický standard pro generování i audit, návrh od Claude Chat adaptován). **Klíčové omezení potvrzené uživatelem: žák jen VYBÍRÁ z možností, nepíše** → jen výběrové typy (select_one/true_false/multi_select/match_pairs/categorize/drag_order/comparison/image_select/diagram_label), žádné volné psaní (text/number/essay/fraction). Důsledek: jádro kvality = **chybový model distraktorů** (každý distraktor = typická chyba → zároveň diagnostikuje). Normalizace/formát psaných odpovědí z původní spec → bezpředmětné. **Zjištění:** cílený feedback per zvolená možnost dnes NEEXISTUJE (`CheckFeedbackCard` ukazuje při chybě vždy totéž) — návrh `PracticeTask.optionFeedback?` **ZAŘAZEN do Fáze 0** (rozhodnuto uživatelem) — diagnostický feedback dle zvolené možnosti („Vybral jsi obvod, ne obsah"), technický design v plánu; architektonická změna sdíleného typu.
### Session 2026-06-15 — Fáze 1 PILOT (rozpracováno):
- ✅ **Fyzika 6. ročník — první téma „Měření délky" (ZLATÝ VZOR výpočetního obsahu 2. stupně)** — `src/content/grade-6/fyzika/mereniDelky.ts`. Demonstruje celý standard 2. stupně: reálná gradace **L1** (přímý převod, 1 krok) → **L2** (opačný směr/dělení + složené jednotky) → **L3** (aplikační slovní úlohy, 2 kroky). **Chybový model distraktorů** — každá špatná možnost = konkrétní typická chyba (špatný směr převodu, posun o řád, zapomenutý převod) + **`optionFeedback`** s cíleným diagnostickým vysvětlením. select_one (žák vybírá). Nápověda = metoda, solutionSteps = postup, explanation = proč. **Sebeověření (rubrika z plánu):** blind-solve vzorku potvrdil numerickou správnost L1–L3; odhalil a opravil 2 vady, které audit nechytá — absurdní záporný distraktor („−298,5 m") → věrohodná chyba „počítal v km", a kostrbaté formulace → „Převeď X na Y". Scaffolding: `grade-6/index.ts` + `STATUS.md`, registrace v `ALL_TOPICS`. Nové slovo „KOLO" do `czechGrammar` NOUNS. Test `mereniDelky.test.ts` (17/17), generator-validation ✅, audit:content + audit:pedagogical bez nálezů, tsc 0 chyb. ⚠️ Grade 6 je teď „má obsah" → odemčen v onboardingu (1 téma — pilot).
- ✅ **Fyzika g6 — Hmotnost + Objem** — `mereniHmotnosti.ts` (mg/g/dkg/kg/t) + `mereniObjemu.ts` (ml/l/dl/cm³/dm³ + **ekvivalence cm³=ml** s cíleným chybovým modelem na mylnou představu „1 cm³ = 1000 ml"). Sdílené utility vytaženy do `fyzika/_shared.ts` (cz/pick/shuffle/buildChoiceTask), délka zrefaktorována přes ně. Parametrizovaný test `prevodyJednotek.test.ts` (51/51 přes 3 témata), audity bez nálezů, blind-solve potvrdil numerickou správnost. Okruh „Měření veličin" má teď 3/6 témat.
- ✅ **Fyzika g6 — Hustota (vrchol)** — `hustota.ts`: ρ=m/V, odvozený m=ρ·V, identifikace látky podle hustoty. Reálné hustoty (hliník 2,7 · železo 7,8 · měď 8,9…), chybový model = záměna vzorce (V/m), násobení (m·V), nepřevedený kg. select_one (záměrně nemíchá typy — zdroj Cause C failů). 17/17 testů, blind-solve perfektní, audity bez nálezů. **Okruh „Měření veličin": 4/6 hotovo** (zbývá teplota, čas).
- ✅ **Víceúrovňové nápovědy (feedback uživatele)** — všechna 4 fyzikální témata dostala místo jednovětých nápověd **pole 2–3 krokových hintů** (`HelpButton` je odhaluje progresivně): Krok 1 nasměrování/vzorec, Krok 2 první krok s hodnotami, Krok 3 dotažení. Dvoukrokové úlohy (převod kg→g + výpočet ρ) mají oba kroky rozepsané. Hint_leak guard odhalil 4 leaky (převodní vztah „1 kg = 1000 g" / substring „0,9 g/cm³" obsahuje „9 g") → opraveno zobecněním. Pravidlo zapsáno do `grade-6/README.md`. 68/68 testů.
- ⏭️ **Další ve Fázi 1:** teplota + čas (jiný charakter — ne násobkový převod, čas má 60/24 základ), pak Dějepis g6 (faktický vzor — authoring pipeline). Z pilotu odvodit `TEMPLATE_STUPEN2.ts`.

### Session 2026-06-15 — Fáze 0 (rozpracováno):
- ✅ **subjectRegistry.ts** — 6 nových předmětů 2. stupně (dějepis/fyzika/chemie/přírodopis/zeměpis/výchova k občanství) s barvami, emoji, hooky. `SUPABASE_STORAGE` přesunut nad `SUBJECTS`. TSC 0 chyb.
- ✅ **Smoke test odborných typů (validační vrstva)** — `src/test/stupen2-odborne-typy.smoke.test.ts` (8/8 ✅). Ověřeny `number`/`numeric_range`/`chemical_balance`/`formula_builder`/`timeline`/`diagram_label`. **Cookbook formátů `correctAnswer`** zapsán do plánu (Fáze 0). 🔴 Nález: `resolveTaskValidation` nepřevádí strukturovaná odborná pole na `expected` → autor sladí ručně. Opraven matoucí komentář u `chemicalBalanceValidator` (formát = páry koef|vzorec BEZ operátorů).
- ✅ **`optionFeedback` engine — cílený feedback per zvolená možnost** — sdílený typ `PracticeTask.optionFeedback?: Record<string,string>` (text možnosti → vysvětlení té chyby). `CheckFeedbackCard` dostal prop `selectedAnswer` + engine `getTargetedFeedback()` (přímá shoda klíče; multi_select dělí čárka/středník/pipa); při chybě zobrazí cílené vysvětlení v oranžovém boxu nad správnou odpovědí, fallback = `explanation` (zpětně kompatibilní). `selectedAnswer` propagován přes `useSessionDispatch` → `SessionView` + `DemoSession`. 9/9 unit testů (`option-feedback.test.ts`), tsc 0 chyb. Bonus: uklizena předexistující duplicitní deklarace `displayName?` v `TopicMetadata`. **Jádro kvality 2. stupně:** generátor s chybovým modelem distraktorů plní `optionFeedback` rovnou (distraktor = typická chyba → zároveň diagnostikuje).
- ✅ **Vizuální smoke test odborných typů (UI↔validátor)** — `stupen2-odborne-typy-ui.smoke.test.tsx` (8/8). Místo ručního klikání v prohlížeči zvolen integrační render test (@testing-library/react): komponenta → simulace vstupu → zachycený ANSWER → validátor. Ověřeno, že `ChemicalBalanceInput`/`TimelineInput`/`FormulaBuilderInput` emitují přesně formáty, které validátory čekají (pozitivní i negativní případy). Trvalá regresní ochrana, **spike chemie odblokován pro grade-8.** tsc 0 chyb.
- ✅ **Per-grade slovník 12–15 let → README šablona 2. stupně** — `src/content/grade-6/README.md`: tone-of-voice 11–12 let + slovník povolených odborných termínů (fyzika/matematika/dějepis/čeština) + co stále nepoužívat, poznámka o rozšíření 7.–9. roč. Navíc shrnuje kvalitativní zlom 2. stupně, chybový model distraktorů + `optionFeedback`, cookbook odborných formátů, Definition of Done. Jen markdown (žádný index/navigation — ten zakládá architekt ve Fázi 1 scaffoldingu).
- ⏭️ **Zbývá ve Fázi 0 (jediná položka, vyžaduje uživatele):** ilustrace 6 předmětů přes admin pipeline → Supabase `subject-{slug}.png` (potřebuje běžící app + admin přístup). Dokud nejsou, `subjectRegistry` má fallback na emoji. → **Fáze 0 je jinak hotová, lze začít Fázi 1 (scaffolding grade-6 + pilot Dějepis/Fyzika).**
- ⏭️ **Ověření `optionFeedback` s reálným obsahem** — až bude grade-6 obsah (pilot), projet v prohlížeči, že se cílený feedback zobrazuje (dnes pokryto unit testy, žádný stávající task ho nemá vyplněný).

### Session 2026-06-14 (pokračování) — hotovo:
- 🔄 **Grade-5 čeština: oprava hint_leak + giveaway délkou (R4 + R17) — VZOR** — `zajmenaSklonovaniOsobnichZajmen.ts` přepsán jako vzor pro zbytek grade-5. (1) hint_leak: nápovědy „Koho/čeho? od já = mě nebo mne." → useknuto na metodu „Zeptej se: Koho/čeho? To je 2. pád zájmena 'já'." (2) giveaway délkou: meta-text z options („mi (krátký tvar) nebo mně – dlouhý tvar", „mě – 2. pád") přesunut do nového pole `explanation`, options zkráceny na čisté tvary stejné délky. (3) opraveny 3 vadné položky: matoucí otázky přeformulovány, distraktor „na mne nebo na mě – obě správně" (byl fakticky pravdivý → 2 správné odpovědi) nahrazen, neexistující tvar „mné" → „mně". `explanation` doplněn u všech 45 položek. TypeScript 0 chyb, soubor v auditu bez nálezů. ⏭️ Pokračuje na zbylých ~21 souborech grade-5 cjl.
- ✅ **Grade-2 slabiky: nápověda prozrazovala odpověď** — počítací úlohy („Kolik slabik má slovo X?") měly nápovědu, která rozsázela slovo s velkými samohláskami (`b-A-b-I-čk-A`) → stačilo spočítat velká písmena = odpověď, bez přemýšlení. Přepsáno na metodickou oporu „Řekni '<slovo>' pomalu a tleskni u každé části. Kolik tlesknutí, tolik slabik." (14 položek + speciál pro dvojhlásku 'auto'). Vysvětlení po odpovědi (`solution`) zůstává konkrétní. Dělící úlohy (kam rozdělit) ponechány — výpis samohlásek tam odpověď neprozrazuje.
- ✅ **Welcome header okruhů — ilustrace přesunuta vlevo** — na úrovni okruhů byla ilustrace předmětu v DOM až za textem → renderovala se vpravo. Prohozeno pořadí flex prvků: ilustrace teď vlevo před nadpisem.
- ✅ **„Vyber si předmět" — odstraněn podtitul** — pod nadpisem na výběru předmětu se zobrazoval podtitul „Co chceš dnes procvičovat?", který působil odpojeně od nadpisu. Odstraněn (subtitle pro `level==="subject"` → prázdný, render `<p>` podmíněn), smazán nepoužitý i18n klíč `topic.what_today`. Nadpis „Vyber si předmět" stojí sám.
- ✅ **Anon: klik na předmět skončil na „Vyber si předmět" místo na okruzích** — `AnonStudentPage` uloží `oli_anon_browse_subject` a přepne do session; `SessionView` ho ale plnil teprve v `useEffect` **po** prvním renderu. Protože anon trial přeskakuje `ChildHomePage` a renderuje `TopicBrowser` hned, browser nastartoval s `initialSubject=undefined` → `level="subject"`, a pozdější `setTopicBrowserSubject` ho už neremountoval (`key={grade}`). Fix: `topicBrowserSubject` i `showTopicBrowser` se čtou **synchronně** ze sessionStorage při inicializaci stavu (stejně jako `isStarting` čte `oli_anon_start_topic`). Klik na předmět teď jde rovnou na okruhy. TypeScript 0 chyb.

### Session 2026-06-14 — hotovo:
- ✅ **Groq odstraněn z klientského bundlu** (nález C1) — smazán `aiClient.ts` + test; `sessionEvaluator` volá lokální šablonu; AI tlačítka odebrána z `AdminContentAudit` + `ReformulateTaskDialog`; `VITE_GROQ_API_KEY` z `.env`. ⚠️ **Klíč rotovat v Groq dashboardu** (byl exponován v historii).
- ✅ **TopicBrowser + SessionView UI doladění** — odstraněny redundantní subtitly a count labely, zvětšené popisy karet a hlavičky, předmět+ročník v session hlavičce `text-lg font-bold` jednotnou barvou.
- ✅ **Anon onboarding zpřehledněn** — výběr předmětu jen název + větší ilustrace/nadpis; anon trial přeskakuje matoucí `ChildHomePage` a jde rovnou na `TopicBrowser`; žluté bannery „v anon režimu se neukládá" u Úkolů od rodiče + Co jsi procvičoval.
- ✅ **Oprava tlačítka Zpět v anon** — na nejvyšší úrovni TopicBrowseru „Zpět" zavře session a vrátí na dashboard (event `oli-anon-exit-session`); dřív render hned spadl zpět na výběr předmětu.
- ✅ **🔒 Zamykání okruhů v anon režimu** — ve volném výběru je v každém předmětu odemčený jen **první okruh**, ostatní mají zámek + „🔓 Odemkni registrací →" (klik → `/auth?mode=register`), ilustrace zůstává barevná (láká k registraci). Props `anonLocked`/`onLockedClick` v `TopicBrowser`. Trial banner „plný přístup zdarma" → „1 okruh v každém předmětu zdarma".
- ✅ **Denní úkoly čerpají ze VŠECH okruhů** (i zamčených) — ochutnávka napříč obsahem, zamykání se týká jen volného výběru okruhů, ne kurátorovaných denních doporučení (rozhodnutí uživatele).
- ✅ **Model anon přístupu (rozhodnuto)** — trial (1–14 dní): zamčené okruhy ve volném výběru (1 odemčený/předmět) + denní úkoly ze všech okruhů; po trialu (15+): jen denní úkoly. Registrace = vše odemčené.
- ✅ **Ilustrace grade-2 prvouky** — okruhy padaly na emoji (dedikované `cat-prvouka-*` PNG ve storage neexistují, ověřeno HTTP 400). Namapovány na existující legacy prvouka ilustrace v `prvoukaVisuals.ts`. ⏸️ Follow-up: vygenerovat dedikované přes admin pipeline.

### Session 2026-06-13 (pokračování 4) — hotovo:
- ✅ **Navigace „předmět → okruh → téma" pro VŠECHNY ročníky** — sjednocení display vrstvy (dříve jen grade-3). Nové `navigation.ts` pro grade-2/4/5 + sdílený registr `src/content/navigation.ts` (typy `Okruh`/`SubjectNav`, `getGradeNavigation`/`getSubjectOkruhy`). `TopicBrowser.tsx` zobecněn z `grade === 3` na per-ročník lookup. Okruhy: g2 (mat 6, prv 5, čj 5), g4 (mat 6, čj 6, vlast 5, přír 5), g5 (mat 5, čj 6, přír 6, vlast 5). **Žádné cvičení se nemazalo ani neměnilo** — okruhy jen odkazují na existující `id`. RVP pole (category/topic) beze změny. **Informatika záměrně plochá** (dle pravidla; studentům se navíc vůbec nezobrazuje). Nový test `navigation-consistency.test.ts` (42 testů) hlídá: každé cvičení v právě jednom okruhu, žádní sirotci/duplikáty, topicIds existují. Ověřeno v prohlížeči (g2 čeština + g4 matematika zobrazují okruhy → témata). TypeScript 0 chyb.
- ✅ **Oprava 2 build-breaking syntax chyb** — `lideVOkoliKamaradstvi.ts` + `povolaniPraceDospelych.ts` měly uvnitř stringu rovnou ASCII uvozovku `"` místo české `"` (U+201C) → předčasné ukončení JS stringu, padal vite/SWC build (tsc to přehlížel). Opraveno na korektní české uvozovky. Konzistenční test (importuje obsah všech ročníků) nyní slouží i jako syntax check.
- ⚠️ **Konzistenční zjištění:** pole `topic` v `TopicMetadata` je napříč ročníky nekonzistentně granulární — v grade-2 jemné (RVP téma), v grade-4/5 degenerované (`topic` == `category`) u všech předmětů kromě matematiky. Navigace proto nestaví na `topic`, ale na `id` + ruční seskupení. (Ke zvážení: dorovnat `topic` v grade-4/5, není blokující.)

### Session 2026-06-13 (pokračování 3) — hotovo:
- ✅ **Grade-2 čeština: 12 topics implementováno** — `src/content/grade-2/cjl/` (12 souborů). Okruhy: Jazyková výchova (pravopis i/y po souhláskách, skupiny dě-tě-ně-bě-pě-vě-mě, slabiky, slovesa, vlastní jména, protikladná a souznačná slova, nadřazená a podřazená slova, abeceda a řazení), Komunikační a slohová výchova (druhy vět, orientace v textu), Literární výchova (pohádka/říkanka/báseň/hádanka, spisovatel/ilustrátor/knihovna). Pravidla R1–R16 dodržena: explanation (ne solutionSteps), per-item hint bez kruhových formulací, true_false celé věty, pool 17–18 úloh/téma. Aktualizovány `index.ts` (importy + exporty) a `displayNames.ts` (3 nové categories + 6 nových topics). TypeScript 0 chyb.

### Session 2026-06-13 (pokračování 2) — hotovo:
- ✅ **Grade-2 prvouka: ruční review obsahu — 13 zbývajících témat** — přepsáno všech 13 souborů (7× true_false, 6× select_one). Opravy: R11 „Pravda?" → „Je to pravda?", R12 „Pravda/Nepravda" → celé věty „Ano, to je pravda/Ne, to není pravda", solutionSteps „Správně: X" → konkrétní vysvětlení PROČ, per-item hint+solution (dřív jen generický). Opraveny fragment-otázky (kvetouciRostliny, drobnaPoraneni, planObce), broken distractor „Souseda kočku", otázky v první osobě „Jak se jmenuje mládě...".

### Session 2026-06-13 (pokračování) — hotovo:
- ✅ **Grade-2 matematika: ruční review obsahu — 13 témat** — projity všechny otázky, nápovědy a "odpověď pro žáka" (solutionSteps) v každém ze 13 témat matematiky. Odvozena a uložena pravidla R7–R12 (konkrétní předměty ve slovních úlohách, kompletní otázky s „?", konkrétní hinty s čísly z příkladu, solutionSteps neutrálně vysvětlující PROČ, True/False formát „Je to pravda?" + celé věty). Přepsáno 6 souborů od základu (slovniUlohy, jednotky, mereniCasu, mereniDelkyUsecky, bodPrimkaUsecka, tabulky, posloupnosti). Opraveny drobné obsahové chyby: „0,5 hodiny" → „půl hodiny" (nevhodné pro 2. třídu), otázka „Narýsuj" (nelze v multiple choice), nepřesná „asi 7 cm". L3 chybějící faktor (vztahNasobeniADeleni) dostaly dva hinty: paměťový + akční. Commit b825a7f.

### Session 2026-06-13 — hotovo:
- ✅ **Grade-2 matematika: adaptivní nápověda u sčítání/odčítání** — `scitaniAOdcitaniDo100.ts` měl generickou nápovědu „počítej po desítkách" u všech příkladů, i u těch bez přechodu (75 − 4), kde se desítky nemění → matoucí. Nová `hintFor(question)` parsuje operandy z otázky a rozliší přechod přes desítku: bez přechodu „Desítky zůstanou — stačí sečíst/odečíst jednotky", s přechodem „Nejdřív dopočítej do desítky" / „Půjč si jednu desítku". Ověřeno node testem (4 případy).
- ✅ **Grade-2 audit (matematika + prvouka, 28 témat)** — spuštěn `audit:pedagogical`, opraveny všechny reálné nálezy: **hint_leak** (`vztahNasobeniADeleni` hint končil „= odpověď", `nasobilka2345` ×1 rozpis = odpověď → n od 2, `mereniCasu` čísla v hintu, `prvni-pomoc` + `hodinyKalendarCas` slovo z hintu = odpověď), **distractor_quality** (`cteniZapis` L1 mělo 2 možnosti → přepsáno na výběr největšího ze 3), **sentence_complexity** (`nasobeniOpakovane` položka 13 tokenů → zkrácena). Ověřeno 2× během (hint_leak v poolech je nedeterministický kvůli shuffle). Zbývá jen `difficulty_progression` u 7 faktických poolových témat = **by design** (faktické memorování typu „kolik minut má hodina" nemá smysluplnou gradaci L1/L2/L3; audit check je laděný na algoritmická témata). Celokorpusové passingPct 66 % → 67 %.
- ✅ **Grade-2 matematika: audit nápověd všech 13 témat** — projity všechny generátory na „nápověda nesedí na konkrétní úlohu". Nalezen a opraven `cteniZapisPorovnavaniCiselDo100.ts` (3 typy úloh L1 porovnání / L2 ±1 / L3 ±10 měly jednu nápovědu „Porovnej desítky" — matoucí u ±1/±10). Nyní hint per větev. Ostatní OK: násobilka/vztah/opakované-sčítání mají per-úlohu vypočtené hinty, poolové generické sedí. ⏸️ Vedlejší nález (borderline, neřešeno): `mereniCasu.ts` hint „1 hodina = 60 minut" u otázky „1 hodina = ? minut" prozrazuje — ale jde o faktické učení pro 2. třídu, kde připomenutí faktu v nápovědě je obhajitelné.
- ✅ **Grade-2 prvouka: 15 topics implementováno** — `src/content/grade-2/prvouka/` (15 souborů). Okruhy: Lidé a čas (hodiny/kalendář, tradice), Lidé kolem nás (kamarádství, povolání, slušné chování), Místo kde žijeme (naše obec, orientace, plán obce), Rozmanitost přírody (domácí zvířata, mláďata/květiny, jaro-léto, zazimování, podzim-zima), Člověk a jeho zdraví (první pomoc/tísňové linky, zdravý styl). Každá úloha má `emoji` vizuální oporu, krátké otázky (4–5 slov) pro pomalu čtoucí děti. 7× true_false, 8× select_one. Pool 16–19 úloh/téma, gen vybírá 15. Doplněn `index.ts`, `displayNames.ts`, `STATUS.md`. TypeScript 0 chyb, žádné cyrilské znaky.
- ✅ **Grade-2 matematika: 13 topics implementováno** — `src/content/grade-2/` (README, STATUS, index.ts) + 13 topic souborů v `matematika/`. Pokrývá: sčítání/odčítání do 100, číselná osa, porovnávání čísel, násobení jako opakované sčítání, násobilka 2–5, vztah násobení a dělení, slovní úlohy, jednotky (cm/m/kg/l), měření času, posloupnosti čísel, tabulky, bod/přímka/úsečka, měření délky. TypeScript 0 chyb.
- ✅ **Landing: nová ilustrace zlomků** — `landing-zlomky` přegenerována (Pollinations, objekt bez postavy — barevný koláč/graf rozdělený na díly). Cache-bust `?v=2` v `Landing.tsx`.
- ✅ **Onboarding: animace výběru ročníku** — vybraný ročník skočí na 1.25× (pružinový ease) + světelný ripple, ostatní se zmenší/zprůhlední, pak navigace (650 ms).
- ✅ **Onboarding: zamčené ročníky bez obsahu** — klik na ročník bez obsahu zobrazí toast „Připravuje se" místo fallbacku na jiný ročník. Tlačítka zůstávají barevná (žádný greyscale).
- ✅ **Session start: odstraněna probliknutá meziobrazovka** — při spuštění tématu (auto-start z denního úkolu i klik na téma) probliknul dashboard/EXPLAIN. Příčina: auto-start jde přes `useEffect`, ne `onSelectTopic`. Fix: `isStarting` flag čtený **synchronně z sessionStorage při mountu** SessionView → první render je rovnou spinner; EXPLAIN→PRACTICE se v `handleTopicSelect` zpracuje bez mezilehlého `setSession`. Bezpečnostní reset přes `loading` ref pro prázdná témata.
- ✅ **Obsah grade-3 velká písmena: oprava giveaway** — úloha „Labe" měla správnou odpověď napsanou ve znění věty. Přeformulováno na `'_____ je česká řeka.' (řeka labe)`. ⏸️ Follow-up: proskenovat zbytek grade-3 na vzor „odpověď ve znění otázky" (current audit check to nechytá).

### Session 2026-06-10/11 (pokračování) — hotovo:
- ✅ **Audit grade-5 F1+F2: false-positive opravy audit nástroje** — `taskValidator.ts` substring → word-boundary shoda (`containsAsPhrase`) + výjimka numerických/jednotkových odpovědí; `contentAudit.ts` answer_uniqueness přeskakuje `drag_order`/`match_pairs`. Testy aktualizovány (35/35 ✅), žádné nové faily vs. baseline 67.
- ✅ **Pedagogická revize grade-3 (152 vzorků) + opravy kritických chyb obsahu** — „byk"→„býk" (učilo špatný pravopis!), giveaway úlohy, hint leaky, duplicitní distraktory, „zebr"→„zeber". Detail v PENDING_CHANGES.
- ✅ **Systémové audit checky** — duplicitní options, giveaway option (meta-text/délka), sémantický leak porovnávání + slovníkový strážce vyjmenovaných slov (`vyjmenovana-canon.test.ts`). Checky samy našly 3 chyby, které ruční revize přehlédla. Testy: 63 failed (o 4 méně než baseline).
- ✅ **Gradace obtížnosti: check 2b (recyklace otázek L1→L3)** — odhalil 29 non-adaptivních generátorů (původní check viděl 7). + velká písmena: 6 úloh zbaveno meta-textu v options, 1 odpověď mimo options. Testy: 61 failed (baseline 67, −6). **Follow-up:** 29 témat potřebuje autorsky těžší L3 úlohy (viz PENDING_CHANGES).

### Session 2026-06-12 — hotovo:
- ✅ **Admin editor: match_pairs + multi_select** — `CreateExerciseDialog`/`EditExerciseDialog` rozšířeny ze 4 na 6 typů. Nové editory párů (min 3, max 8, validace unikátnosti) a multi-select (checkboxy správných). DB migrace `custom_exercises.pairs` + `correct_answers` JSONB (aplikováno přes API). Strukturální override ve `taskValidator` + `resolveTaskValidation` (set_match) + `PracticeInputRouter` (detekce correctAnswers) + `customExerciseLoader` (mapování polí).
- ✅ **Dětské názvy okruhů — bug + chybějící slovníky** — `AnonStudentPage.DailyTaskList` zobrazoval syrový RVP `topic.category` (např. „Komunikační a slohová výchova") místo `getDisplayCategory()`. Opraveno (+ protažen `grade` prop). **Hlavní příčina:** grade-5 slovník existoval ve starém nepoužitém formátu a nebyl v `BY_GRADE` → grade-5 žáci viděli vše syrově. Přepsán do `DisplayMap` + zaregistrován. Doplněny chybějící kategorie: grade-3 prvouka (5), grade-4 čeština+ČaJS+informatika (11), grade-5 kompletní (16). Ověřeno v prohlížeči grade-3 i grade-5.
- ✅ **Preview port fix** — `.claude/launch.json` 5173 → 8080 (sjednoceno s `vite.config.ts`).
- ✅ **Rozbité ilustrace v session — graceful fallback** — `SessionView` + `DemoSession` měly inline `<img>` s `getTopicIllustrationUrl()` bez `onError`. Mnoho grade-N témat nemá vygenerovanou ilustraci (slug URL → 404) → rozbitá ikona. Nahrazeno `IllustrationImg` (skryje při chybě). ⏸️ Follow-up: vygenerovat chybějící ilustrace pro grade-5 témata (admin pipeline) — viz PENDING_CHANGES.
- ✅ **Technický audit + úklid kódu** — smazán mrtvý adresář `src/components/student/` (21 souborů, 0 importů — duplikáty živých komponent), odstraněny 4 nepoužité importy v `App.tsx` (AppRole + 3 admin pages bez route), extrahován `toSlug` do `src/lib/slugify.ts` (byl 3× duplikovaný), odstraněn nepoužitý `lovable-tagger` z package.json, mrtvý `console.log` v Report.tsx, `React` import z AdminGenerateIllustrations. tsc 0 chyb. ⏸️ Zbývá (zapsáno): god objecty (5 souborů >800 řádků), `getHelpForSkill` deprecated, BackButton v demo/*.
- ✅ **Cause B audit: SKUTEČNÁ regrese boundary brány — opraveno** — `classifyIntent` i `matchTopic` (1) crashovaly na živé cestě kvůli 1 tématu bez `keywords` pole, (2) přes naivní substring `input.includes(kw)` označovaly nesmysly jako `topical` (83 krátkých keywordů, jednoznakové `"a"` matchovalo skoro vše). Fix: nový sdílený `keywordMatch.ts` (word-boundary + min. délka 2 + guard), data tématu doplněna, numerická kontrola přesunuta. **Net −98 padajících testů (137→~39).** Cause A (whitelist `true_false`) + můj vlastní regres v `taskValidator` (override obcházel match_pairs validaci) také opraveny. 🔴 Nový nález: `BOUNDARY_RULES` nemigrovaná na grade-N ID → runtime boundary enforcement neaktivní pro grade-3 math (viz PENDING_CHANGES).

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
