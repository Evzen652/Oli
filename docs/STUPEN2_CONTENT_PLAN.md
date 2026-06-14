# Plán obsahu 2. stupně (ročníky 6–9)

> **Status:** návrh schválen 2026-06-14 (pilot napřed). Tento dokument je „kvalitní cesta"
> pro naplnění obsahu 2. stupně ZŠ. Nahrazuje zastaralé části `docs/CONTENT_ROADMAP.md`
> (ten počítá s DB-skilly, RAG a AI-tutorem — architektura je opustila 2026-05-20;
> platí z něj jen **3 pilíře** taxonomie/fakta-se-zdrojem/prerekvizity).

---

## 1. Rozsah (tvrdá čísla z `data/rvp_data.json`)

| Předmět | G6 | G7 | G8 | G9 | Σ | Charakter |
|---|---|---|---|---|---|---|
| Český jazyk a literatura | 20 | 19 | 19 | 16 | 74 | smíšený |
| Dějepis | 24 | 23 | 19 | 23 | 89 | faktický |
| Fyzika | 13 | 17 | 15 | 17 | 62 | **výpočetní** + fakta |
| Chemie | – | – | 26 | 20 | 46 | **výpočetní** + fakta |
| Matematika | 12 | 14 | 14 | 15 | 55 | **výpočetní** |
| Přírodopis | 22 | 20 | 21 | 18 | 81 | faktický |
| Výchova k občanství | 8 | 10 | 10 | 10 | 38 | konceptuální |
| Zeměpis | 18 | 13 | 15 | 14 | 60 | faktický + mapa |
| **Σ (bez informatiky)** | **117** | **116** | **139** | **133** | **505** | |
| Informatika (skrytá) | 9 | 9 | 10 | 11 | 39 | — nezobrazuje se |

**Celkem k implementaci: ~505 podtémat** (informatika se studentům nezobrazuje, dle pravidla).
Pro srovnání: celý dosavadní obsah g2–g5 = 260 souborů. Tohle je ~2× tolik.

### Nové předměty oproti 1. stupni (6 nových)
- **Dějepis, Fyzika, Chemie, Přírodopis, Zeměpis, Výchova k občanství**
- Mizí: prvouka, vlastivěda, přírodověda (nahrazuje je dějepis + zeměpis + přírodopis)
- Zůstává: čeština, matematika (ale 2. stupeň = vyšší náročnost)

---

## 2. Kvalitativní zlom: proč 2. stupeň ≠ víc téhož

Dosavadní model „pool 30 faktických otázek → `select_one`" je pro 13–15leté **nedostatečný**.
Žák 2. stupně má procvičovat **aplikaci a vícekrokové uvažování**, ne rozpoznávání.

### Standard kvality 2. stupně (měřitelný — ne dojmový)
1. **Cvičení = aplikace, ne rozpoznání.** Výpočetní generátory s reálnými čísly
   (fyzika: dosazení do vzorce + převody jednotek; chemie: vyčíslení rovnice;
   matematika: rovnice, procenta, poměry). Humanitní: práce se zdrojem/textem,
   ne „kdo byl X".
2. **Reálná gradace L1→L3** (vynucuje audit `difficulty_progression`):
   - L1 = jeden krok / přímá aplikace
   - L2 = dva kroky / volba metody
   - L3 = aplikace v neznámém kontextu / kombinace pojmů
   - Žádná recyklace L1→L3 (check 2b: ≥90 % shoda = fail).
3. **Nápověda = metoda, ne odpověď** (audit `hint_leak`): navádí postup
   („dosaď do vzorce, převeď na metry"), nikdy nevypíše výsledek/tvar.
4. **Vysvětlení (`explanation`) = proč, vícekrokově**; u výpočtů `solutionSteps`
   s mezivýsledky.
5. **Distraktory založené na typických chybách** (špatný převod jednotky, záměna
   vzorce), ne náhodné — žák se z chyby učí.

### Typy cvičení: jen výběrové (žák nepíše)
Žák **nikdy nepíše volnou odpověď** — jen vybírá/manipuluje. Povolené typy:
`select_one`, `true_false`, `multi_select`, `match_pairs`, `categorize`,
`drag_order`, `comparison`, `image_select`, `diagram_label`. Zakázáno: `text`,
`number`, `short_answer`, `essay`, `fraction` (volné psaní). I sloh/čeština výběrově.
→ Celá kvalita leží v **možnostech** → viz [`PEDAGOGICKA_SPECIFIKACE_STUPEN2.md`](PEDAGOGICKA_SPECIFIKACE_STUPEN2.md).

### Definition of Done (každý topic musí projít)
- [ ] **Kontrolní seznam** z [`PEDAGOGICKA_SPECIFIKACE_STUPEN2.md`](PEDAGOGICKA_SPECIFIKACE_STUPEN2.md) sekce 5
- [ ] `npx tsc --noEmit` bez chyb
- [ ] `npm run audit:content` — passingPct ≥ 70 %, 0 hint_leak / giveaway / self_validation fail
- [ ] `npm run audit:pedagogical` — difficulty_progression OK, distractor_quality OK, sentence_complexity (G5+ max 25 slov) OK
- [ ] `navigation-consistency.test.ts` — topic je v právě jednom okruhu
- [ ] česká gramatika přes `czechGrammar.ts` helpery
- [ ] faktický obsah: fakt má zdroj (RVP/učebnice), AI ho negeneruje z paměti

---

## 3. Rozhodnutí (2026-06-14)

| Rozhodnutí | Volba | Důvod |
|---|---|---|
| **Náběh** | Pilot napřed | Ověřit „zlatý vzor 2. stupně" než se škáluje na 505 témat |
| **Pořadí** | Mix v pilotu: **6. ročník, Dějepis + Fyzika** | Pilot pokryje textový i výpočetní svět najednou; nepředěláváme TEMPLATE |
| **Metoda** | **Hybrid řízený charakterem generátoru** | Výpočetní = kód (ručně); faktické = authoring pipeline + audit brány + revize |

### Metoda detailně
- **Výpočetní** (matematika, fyzika, chemie) → **ručně jako kód** v grade-N session.
  Generátor je deterministická funkce, co počítá. AI pipeline tu nedává smysl.
- **Faktické/textové** (dějepis, zeměpis, přírodopis, občanka, literatura) →
  **authoring pipeline**: AI dostane **ověřená fakta jako vstup** a generuje jen
  *formu* otázek (distraktory, formulace), ne fakta z paměti (3. pilíř roadmapy).
  Výstup → tvrdé audit brány → lidská revize před exportem do `GRADE_N_TOPICS`.

---

## 4. Fáze

### Fáze 0 — Architektonická příprava (architekt, `main`)
Bez tohohle nemůže grade-N session pro nové předměty začít.
- [ ] **`subjectRegistry.ts`**: doplnit 6 nových `SubjectMeta` (dějepis, fyzika,
      chemie, přírodopis, zeměpis, výchova k občanství) — label, emoji, barva,
      gradient, hook. (Dnes jedou přes `buildFallback` = jen auto emoji.)
- [ ] **Ilustrace** 6 nových předmětů (admin pipeline → Supabase storage
      `subject-{slug}.png`).
- [ ] **Smoke test odborných typů** — komponenty UŽ existují (`ChemicalBalanceInput`,
      `FormulaBuilderInput`, `TimelineInput`, `DiagramLabelInput`, `NumberInput`,
      `EssayInput` jsou v `PracticeInputRouter.tsx`) + validátory existují.
      Chybí jen ověření end-to-end: vytvořit 1 testovací topic každého odborného
      typu (zejm. `chemical_balance`, `formula_builder`, `numeric_range`),
      projet v prohlížeči CHECK→feedback. **Spike chemie** (chemical_balance)
      tady — než se dělá grade-8.
- [ ] **`czechGrammar.ts` NOUNS** — předběžně doplnit odborné jednotky/pojmy
      (newton, joule, mol, atom, …) až budou potřeba (eskalace z grade-N).
- [ ] Per-grade **slovník/tone of voice** pro 12–15 leté do README šablony
      (lze odborné termíny: „rovnice", „veličina", „sloučenina", „letopočet").
- [ ] **Cílený feedback per zvolená možnost** (ZAŘAZENO 2026-06-15) — diagnostický
      feedback, který reaguje na to, kterou špatnou možnost žák klikl. Technický návrh:
  - **Typ:** `PracticeTask.optionFeedback?: Record<string, string>` — klíč = přesný
    text možnosti (shodný s `options`/`correctAnswer`), hodnota = krátké vysvětlení
    *té konkrétní chyby*. Volitelné → zpětně kompatibilní.
  - **Tok zvolené odpovědi:** `CheckFeedbackCard` dnes dostává `answeredTask` +
    `lastAnswerCorrect`, ale NE zvolenou hodnotu. Přidat prop `selectedAnswer: string`
    (orchestrátor/SessionView ji už má — jen propagovat).
  - **Engine:** při chybě, pokud `answeredTask.optionFeedback?.[selectedAnswer]`
    existuje → zobraz ho jako primární cílené vysvětlení; pak správná odpověď +
    `explanation`. Fallback = dnešní chování (obecné `explanation`).
  - **Rozsah:** `select_one`, `true_false`, `multi_select` (kde „zvolená možnost"
    dává smysl). `match_pairs`/`categorize`/`drag_order` zůstávají na `explanation`.
  - **Vazba na obsah:** generátor s chybovým modelem distraktorů plní `optionFeedback`
    rovnou (ví, že distraktor X = „spočítal obvod" → feedback je skoro zdarma).
  - Architektonická změna (sdílený typ `PracticeTask`) → vlastní architekt.

### Fáze 1 — Zlatý vzor 2. stupně (PILOT)
- [ ] Scaffolding `src/content/grade-6/` (README, STATUS, navigation skelet,
      složky `dejepis/`, `fyzika/`).
- [ ] **Dějepis g6** (~5 vzorových témat, faktický vzor): pravěk, starověk.
      Ověřit `timeline`/`drag_order` na chronologii + `select_one` s prací se zdrojem.
- [ ] **Fyzika g6** (~5 vzorových témat, výpočetní vzor): vlastnosti látek,
      měření veličin (délka, hmotnost, čas, objem), hustota. Ověřit `number`/
      `numeric_range` generátory s reálnými výpočty + převody jednotek + L1→L3 gradace.
- [ ] Z pilotu odvodit **`TEMPLATE_STUPEN2.ts`** + zapsat odborná pravidla
      (rozšíření R1–R17 o výpočetní specifika) do `grade-6/README.md`.

### Fáze 2 — Infrastruktura + scaffolding 7–9
- [ ] Rozšířit `scripts/create-grade-N-infra.mjs` na 6–9 (počty z RVP datasetu).
- [ ] Branch `content/grade-N` + worktree `.claude/worktrees/grade-N` per ročník.
- [ ] Authoring pipeline skript pro faktické předměty (Claude API batch →
      draft poolu → audit brány → soubor k revizi). Vstup = ověřená fakta.

### Fáze 3 — Škálované plnění
- [ ] Dokončit **6. ročník celý** (zbylé předměty: čeština, zeměpis, přírodopis,
      občanka — pipeline; matematika — ručně).
- [ ] Paralelní grade-N session pro 7, 8, 9 (worktree izolace, PENDING_CHANGES
      eskalace — model osvědčený z g2–g5).
- [ ] Chemie (g8, g9) až po Fázi 0 spike odborných typů.

### Fáze 4 — QA brány + merge
- [ ] Každý topic přes Definition of Done (sekce 2).
- [ ] Architekt review → merge `content/grade-N` → `main` (CI musí projít).
- [ ] Aktualizace `PROJECT_STATUS.md` + `PENDING_CHANGES.md` po každém celku.

---

## 5. Pořadí škálování předmětů (po pilotu)

Priorita = hodnota pro žáka × nízké riziko:
1. **Dějepis, zeměpis, přírodopis, občanka** (faktické) — pipeline, paralelně, nízké riziko.
2. **Čeština 2. st.** (smíšený) — část pipeline (literatura), část ručně (mluvnice).
3. **Matematika, fyzika** (výpočetní) — ručně, střední riziko.
4. **Chemie** (g8/g9) — ručně, nejvyšší riziko (odborné typy) → až po spike.

---

## 6. Sebeověření pedagogické kvality (zejm. slovní úlohy)

Deterministický audit (`contentAudit`, `pedagogicalAudit`) chytá jen **mechanické**
vady (hint_leak, giveaway, duplicity, formát, gradace). **Nechytá sémantiku:**
vychází výpočet? je zadání jednoznačné a realistické? reprezentují distraktory
reálné chyby? navádí nápověda správně? Tyto vady jsou u slovních úloh nejčastější.

### Triangulační ověření — 3 nezávislé cesty k pravdě
Topic je důvěryhodný, když se shodnou všechny tři. Neshoda = flag k revizi.

1. **Generátor (autor)** — produkuje úlohu + tvrzenou odpověď.
2. **Deterministický solver (kód)** — u výpočetních úloh nezávislá druhá cesta
   k výsledku + plausibility guards: výsledek kladný kde má být, celé číslo kde
   se počítají kusy, jednotky sedí, čísla věku přiměřená, částky reálné.
   (Generátor a solver = oddělená logika, jinak se chyba skryje.)
3. **LLM blind-solver + adversariální judge (subagent)** — viz níže.

### Protokol LLM-judge (jak ho používám při tvorbě)
Po napsání každého topicu vezmu **N reprezentativních vygenerovaných instancí**
(dosadím reálné hodnoty / spustím generátor) a předám subagentovi se **dvěma
oddělenými fázemi**:

- **Fáze 1 — BLIND SOLVE:** judge dostane úlohy **bez správných odpovědí** a sám
  je vyřeší. Porovnám s `correctAnswer` → chytí numerické chyby a nejednoznačnost
  (když judge dojde k jinému/žádnému jednoznačnému výsledku).
- **Fáze 2 — ADVERSARIÁLNÍ HODNOCENÍ** dle rubriky níže. Judge je instruován
  **hledat vady, ne potvrzovat** (default „podezřelé").

**Proč blind + adversariální:** kdyby judge viděl odpověď, sklouzne k jejímu
potvrzení. Bez odpovědi musí úlohu skutečně vyřešit; s adversariálním rámcem
nepřehlíží slabiny.

### Rubrika pro slovní úlohy (7 kritérií — ověřeno v praxi 2026-06-15)
1. **Řešitelnost** — dost informací, právě jedno řešení (ne pod/přeurčená).
2. **Jednoznačnost** — zadání nelze pochopit dvěma způsoby.
3. **Realističnost** — čísla i kontext dávají v reálu smysl (cena, počet, množství).
4. **Numerická čistota** — výsledek „hezký" pro daný ročník (celé/max 2 des. místa).
5. **Kvalita distraktorů** — KAŽDÁ špatná možnost = konkrétní typická chyba
   (jen 1. krok / opačná operace / sečetl vše / záměna směru), ne náhodný posun.
6. **Nápověda** — navádí na METODU, neprozrazuje výsledek, je kontextová (ne
   identická pro všechny úlohy tématu).
7. **Vysvětlení** — ukazuje POSTUP s mezivýsledky, ne jen finální číslo.

### Produkt ověření → „chybový model distraktorů"
Klíčové zlepšení pro výpočetní generátory 2. stupně: distraktory se **negenerují
náhodným posunem** (`a±5`, `a±10`), ale z **chybového modelu** — explicitně
spočítané typické chyby:
```ts
// místo: options = [r, r+10, r-5, r+5]   ← náhodné, vyloučitelné odhadem
// takto: options = [r, jen1Krok, opacnaOperace, sectlVse]  ← každá = reálná chyba
```
Tím distraktory zároveň **diagnostikují**, jakou chybu žák dělá (vstup pro
adaptivní engine a report rodiči).

### Zapojení do workflow
- **Při tvorbě** (Claude Code): po každém topicu spustit blind-solve + judge
  subagent na ~4–6 instancí. U výpočetních topiců navíc deterministický solver.
- **Dávkově** (volitelně): authoring pipeline pošle draft poolu judgi → flagne
  vady před lidskou revizí.
- **Brána:** topic se needituje do `GRADE_N_TOPICS`, dokud judge nevrátí
  „PŘIJMOUT" (nebo dokud nejsou vady opraveny). Doplňuje Definition of Done (sekce 2).

### Ověřovací běh 2026-06-15 (důkaz konceptu)
Metoda spuštěna na 4 existující slovní úlohy z
`grade-3/matematika/slovniUlohySeDvemaOperacemi.ts`. Judge naslepo potvrdil
numerickou správnost všech 4 a nezávisle odhalil: (a) distraktory jsou náhodné
posuny ±5/±10 (nemapují chyby) ve všech 4; (b) nerealistická cena „knížka za
12 Kč"; (c) nápovědy identické pro všechny úlohy tématu. **Žádná z těchto vad
neprojde deterministickým auditem** — potvrzuje nutnost sémantické vrstvy.
→ Follow-up: přepracovat distraktory tohoto grade-3 tématu dle chybového modelu
(zapsáno v PENDING_CHANGES).

---

## 7. Otevřené otázky k pozdějšímu rozhodnutí
- **Knowledge Base pro fakta** — DB tabulka (`curriculum_facts` z roadmapy) vs.
  fakta inline v `.ts` souborech (jako dosud g2–g5). Pro pipeline by KB pomohla
  (zdroj pravdy), ale přidává infrastrukturu. Rozhodnout před masovým plněním faktických předmětů.
- **Prerequisite graf** napříč ročníky (`prerequisites` pole) — kdy zapojit do
  adaptivního enginu pro vracení k prerekvizitám.
- **Verifikace faktů** — kdo/jak schvaluje fakta (zdroj učebnice/RVP) před exportem.
