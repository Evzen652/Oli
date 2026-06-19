# OLI — Audit fáze 1: Reality check

**Datum:** 2026-06-19
**Větev:** `main` (HEAD `4093f30`, == origin/main)
**Režim:** READ-ONLY audit. Žádný zdrojový soubor nebyl změněn. Nálezy se **zapisují, neopravují**.
**Rozsah (zúžený dle rozhodnutí):** pouze **čeština + matematika**, ročníky 2–4.
Prvouka, přírodověda, vlastivěda a informatika jsou **mimo scope** této fáze (neauditovány jako blokery).

---

## Prerekvizity (ověřeno)

| Kontrola | Stav |
|---|---|
| Na nejnovějším `main` | ✅ HEAD == origin/main (`4093f30`) |
| `grade-2/cjl/` používá `POOL_L1/L2/L3` + `gen(level)` (ne flat `POOL`/`gen(_level)`) | ✅ všech 12 souborů |
| Gradace čj 2. ročník 8/8/8 disjunktní | ✅ ověřeno generátorem (`audit:content`): všech 12 témat **8/8/8, max L3** |

Merge gradace proběhl korektně — pokračováno v auditu.

---

## A) Rozbíjí smyčku / faktické chyby (→ fáze 2)

Seřazeno dle závažnosti. „Ověřeno" = zkontrolováno čtením kódu / spuštěním testu, ne slepě z agenta.

### A1 — TVRDÝ loop-breaker: neřešitelné úlohy (correctAnswer ∉ options)
- **Ročník 3, čeština** — [`src/content/grade-3/cjl/versRymPrirovnani.ts`](src/content/grade-3/cjl/versRymPrirovnani.ts)
- **Důkaz:** `npx vitest run src/test/generator-validation.test.ts` → **12 failed / 912**, z toho v scope čj/math selhává jen tohle téma (zbylé jsou prvouka — mimo scope).
- 4 úlohy mají `a` (správná odpověď) jako pomlčkový seznam, ale `opts` obsahují jen první variantu nebo jiný text → po zamíchání **správná odpověď není mezi tlačítky a žák ji nikdy nemůže vybrat**:
  - ř. 22: `a: "prima / lima / klima"`, `opts: ["prima", …]`
  - ř. 24: `a: "louku (rým: oves – louku nepasuje, správně: …)"` — do tlačítka navíc uniká metakomentář
  - ř. 25: `a: "myška / voda v rybníce"`, `opts: ["myška", …]`
  - ř. 26: `a: "táta / dáma / láma"`, `opts: ["táta / dáma", …]`
- Navíc ř. 20: `"byk"` → překlep, správně `"býk"`.
- **Návrh opravy:** `a` nastavit přesně na jednu hodnotu, která je i v `opts` (např. `"prima"`, `"dáma"`, `"myška"`); ř. 24 přepsat na verš s čistým rýmem bez metatextu.

### A2 — ENGINE: prázdný batch → pád session bez ukončení
- [`src/lib/sessionOrchestrator.ts:357-361`](src/lib/sessionOrchestrator.ts) + [`src/lib/aiExecution.ts:127-133`](src/lib/aiExecution.ts)
- Pokud `topic.generator(level)` vrátí `[]`, `generateMockBatch` vrátí prázdné pole bez kontroly; `const task = batch[i]` → `undefined` → `task.question` hodí **TypeError**. Smyčka spadne (zachyceno v `useSessionDispatch.ts:256` → `return null`), UI zůstane bez další úlohy i bez konce.
- **Aktuálně latentní** — všechna čj témata mají 8/8/8, takže `[]` reálně nevrací. Je to ale chybějící pojistka: jakýkoli budoucí generátor čj/math vracející prázdno na úrovni session zasekne.
- **Návrh opravy:** v `generateMockBatch`/orchestrátoru ošetřit `batch.length === 0` → graceful fallback (přejít na `maxAvailableLevel` nebo ukončit s hláškou), nikdy nečíst `batch[i]` bez kontroly.

### A3 — FAKT (matematika 3): chybný výpočet v nápovědě
- [`src/content/grade-3/matematika/scitaniAOdcitaniDo1000.ts:85`](src/content/grade-3/matematika/scitaniAOdcitaniDo1000.ts) — `commonMistake: "… 358 + 64 = 412 …"`. **Ověřeno:** 358 + 64 = **422**.
- **Návrh:** `412` → `422`.

### A4 — FAKT (matematika 3): záporný mezivýsledek mimo obor ročníku
- [`src/content/grade-3/matematika/slovniUlohySeDvemaOperacemi.ts:62-73`](src/content/grade-3/matematika/slovniUlohySeDvemaOperacemi.ts) — šablona „parkoviště". **Ověřeno:** `a ∈ [10,39]`, `b ∈ [5,24]`, takže `a − b` **může být záporné** (např. 10 − 24 = −14); krok i výsledek pak ukáže záporné číslo / „−11 aut", což je ve 3. třídě mimo obor a nesmyslné.
- **Návrh:** generovat `b < a` (např. `b = random(a-5)+1`), aby mezivýsledek i výsledek zůstaly nezáporné.

### A5 — FAKT (čeština 4): neexistující / nesmyslná slova jako správné odpovědi
- [`src/content/grade-4/cjl/pravopisPredponVyVySZVz.ts`](src/content/grade-4/cjl/pravopisPredponVyVySZVz.ts) — pravopisné cvičení, kde „správné" doplnění tvoří neexistující slovo (učí žáka špatně):
  - ř. 56, 103: `"Sníh ___tálo"` + blank `z` → **„ztálo"** (neexistuje; správně *roztálo*, navíc chybná shoda „sníh roztál")
  - ř. 106: `"Dítě ___bredilo"` + blank `s` → **„sbredilo"** (neexistuje)
  - ř. 76: `"Prameny ___víraly se do řeky"` + blank `s` → **„svíraly se do řeky"** (významový nesmysl; mělo být *vlévaly se*)
  - ř. 75: `"Pes ___kulovitěl jak houska"` + blank `z` → **„zkulovitěl"** (vymyšlené)
  - L3: `"…stále fittovanější"` — „fittovanější" není české slovo
- **Návrh:** nahradit reálnými slovy s jednoznačnou předponou (např. *roztál, vlévaly se, blouznilo, zakulatil se*).

### A6 — FAKT (čeština 2, gateway): chybné slabičné dělení
- [`src/content/grade-2/cjl/slabiky.ts:53`](src/content/grade-2/cjl/slabiky.ts) — `"sluníčko"`: `correct: "slun-íč-ko"`, mezi distraktory je `"slu-níč-ko"`. **Standardní dělení je `slu-níč-ko`** → správná odpověď je označená jako distraktor a naopak.
- **Návrh:** `correct` = `"slu-níč-ko"`; jako distraktory `"slun-íč-ko"`, `"slun-íčk-o"`.

### A7 — FAKT (matematika 2, gateway): chybný slovní tvar času v řešení
- [`src/content/grade-2/matematika/mereniCasu.ts:39`](src/content/grade-2/matematika/mereniCasu.ts) — řešení: „8:00 + 45 minut = 8:45. Přestávka je **ve čtvrt na devět**." 8:45 = **třičtvrtě na devět** (čtvrt na devět = 8:15). Správná číselná odpověď `8:45` je OK, chybný je jen text řešení — ale u tématu *o čase* zvlášť matoucí.
- **Návrh:** „…8:45. Přestávka je **třičtvrtě na devět**."

### A8 — JAZYK (čeština 3): překlep ve znění úlohy
- [`src/content/grade-3/cjl/spojovaniVetSpojkami.ts:17`](src/content/grade-3/cjl/spojovaniVetSpojkami.ts) — `"___ přijde tatínek, pojdeme na výlet."` → **„pojdeme"** je překlep, správně **„půjdeme"**. V jazykovém cvičení tiše učí špatný pravopis.
- **Návrh:** `pojdeme` → `půjdeme`.

---

## B) Polish (→ fáze 3 batch)

### Mezery v pokrytí úrovní (čj + math) — z `npm run audit:content`
Témata, kde chybí těžší obtížnost (kandidáti na doplnění L2/L3):
- **Matematika 2:** `g2-mat-jednotky` 20/1/0 · `g2-mat-mereni-delky` 20/0/0 (jen L1) · `g2-mat-nasobilka-2345` 18/18/0
- **Matematika 4:** `g4-mat-magicke-ctverce-ciselne-rady-4` 40/20/0
- **Čeština 3–4:** řada „dovednostních" témat (sloh, čtení, vypravování) má jen L1/L2 — viz WORKLIST v auditu (`g3-cjl-*`, `g4-cjl-*`). Pro launch nejsou blokerem, jen mělčí gradace.

### Kvalita obsahu (ne chybné, ale ke zlepšení)
- **Duplicitní distraktory:** `grade-3/cjl/vyjmenovanaSlova.ts` („pikat" 2×), `grade-3/cjl/podstatnaJmenaRodCisloPad.ts` („pesy" 2×).
- **G3 čj** [`spojovaniVetSpojkami.ts:16`](src/content/grade-3/cjl/spojovaniVetSpojkami.ts) — „Nezaspal jsem, protože jsem vstával časně." mírně nelogická příčina (přijatelné, ale lze přeformulovat).
- **G3 čj** [`velkaPismenaVlastniJmena.ts:29`](src/content/grade-3/cjl/velkaPismenaVlastniJmena.ts) — „Západ (část světa…)" je nad rámec 3. třídy; distraktory „západiště", „zapádat" jsou vymyšlená slova.
- **G2 čj** `spisovatelKniha.ts` kostrbatá otázka; `slabiky.ts` slovo „encyklopedie" na hranici osnov 2. třídy; `vlastniJmena.ts` úloha o „slunce/Slunce" pro 2. třídu matoucí.
- **G4 math** `trojuhelnikDruhyPodleStran.ts` distraktor „Pravúhly" (překlep, jen distraktor); `cteniZapisAPorovnavaniCiselDoMilionu.ts` `numberToWords` tvoří kostrbaté složeniny v zadání (odpověď číslicí je správně).
- **Audit flagy `[hint_leak]` / `[format]` na g2-cjl** (`pravopisIY`, `slabiky`, `slovaNadrazena`, `slovesa`) jsou **heuristické false-positives** (prose-MC formát „Které slovo je X: a, b, c?" a slova „vždy/slovo" v nápovědě) — ne regrese.

### UX / tok
- **Progress indikátor: EXISTUJE** — [`src/components/ProgressIndicator.tsx`](src/components/ProgressIndicator.tsx) („Úloha n z total" + barevné tečky), vykreslen v `SessionView.tsx:850` i `DemoSession.tsx:273`. → Domnělá „chybějící" mezera je **už vyřešená**.
- **Chování po správné odpovědi: DEFINOVÁNO a konzistentní** — feedback karta + chvála + animace, **ruční „Pokračovat"**, žádný auto-advance (`CheckFeedbackCard.tsx:187`, `useSessionDispatch.ts:435`). → Také vyřešené.
- **Demo, poslední úloha:** [`DemoSession.tsx:316`](src/components/demo/DemoSession.tsx) + `CheckFeedbackCard.tsx:187` — na poslední úloze se skryje tlačítko „Pokračovat", cesta na výsledky pak vede jen přes Zpět/✕. Drobná UX mezera (jen demo, jede ročník 3).
- **`_maxLevel` cache** se u preloaded/DB-only cesty (`useSessionDispatch.ts:318-353`, přeskakuje TOPIC_MATCH) nenastaví → ořez `currentLevel` se neprovede. Smyčku **nezasekne** (batch je fixní), ovlivní jen volbu úrovně příští session.

### Rozložení typů cvičení (`inputType`, měřeno přes celý obsah ročníku)
| Ročník | select_one | ostatní |
|---|---|---|
| 2. | 29 | true_false 11 → **~72 %** select_one |
| 3. | 51 | match_pairs 1 → **~98 %** select_one |
| 4. | 55 | match_pairs 8, drag_order 6, true_false 2, fill_blank 2 → **~75 %** select_one |
Pozn.: 2. a 4. ročník mají citelný podíl ne-`select_one` (hlavně true_false / match_pairs), nižší než orientační odhad ~91 %. Jen měřeno, nepřepisováno.

### Rodičovský report (bod 6) — bez blokeru
- Produkční cesta [`src/pages/Report.tsx:111`](src/pages/Report.tsx) → [`src/lib/weeklyReportGenerator.ts`](src/lib/weeklyReportGenerator.ts) je **100 % deterministická z DB `session_logs`** (reálné odpovědi žáka). **Žádné živé AI/Gemini volání**, žádné riziko halucinace. Gemini edge funkce `weekly-report` / `session-evaluation` jsou **mrtvý kód** (nikde v `src/` se nevolají).
- Jediné reziduum (kosmetika): zastaralé komentáře „z Gemini" v `Report.tsx:33,476`.

---

## Shrnutí

Launch 2.–4. ročníku (čj + math) je **reálně blízko** — žádný systémový blokr. Hlavní session smyčka **drží a jde dokončit** (vícenásobně pojištěné ukončení), progress indikátor i chování po odpovědi jsou hotové, rodičovský report stojí na reálných datech bez AI. V kbelíku A je **jeden tvrdý loop-breaker** (`versRymPrirovnani.ts` — 4 neřešitelné úlohy, prokázáno testem) a jedna **latentní engine díra** (pád na prázdném batchi bez pojistky); zbytek A jsou bodové faktické chyby v obsahu (math 412→422 a záporné parkoviště ve 3. tř.; neexistující slova v g4 pravopisu předpon; ve 2. třídě chybné dělení „sluníčko" a slovní tvar času) — všechny lokální, rychle opravitelné. **Vzory podstatných jmen 4. ročníku a veškerá generátorová aritmetika (mimo dvě výše) jsou čisté.** Po opravě kbelíku A je obsah čj/math „ne-trapný" a připravený; gateway (2. ročník) má jen 2 věcné chyby.
