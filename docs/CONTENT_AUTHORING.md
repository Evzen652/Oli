# Content Authoring Guide — Oli (Sovička)

> **Závazná autorská norma** pro tvorbu jakéhokoliv generátoru úloh.
> Vznikla z chyb, které nezávislý pedagogický review opakovaně nacházel
> v kolech 1 a 2 (2026-07). Není to doporučení — je to checklist,
> který musí splňovat každá úloha před tím, než se dostane před dítě.

## Základní princip: Generator → Critic

Nejlepší garancí správnosti je **oddělení generátoru a kritika**:

1. **Generátor** vytvoří úlohu, klíč a distraktory z pravidel.
2. **Kritik** (nezávislá logika, ideálně jiný autor) vyřeší úlohu od nuly
   a porovná svůj výsledek s klíčem generátoru.

Nikdy nespoléhej, že „když jsem to psal, znám odpověď". Vždy si úlohu vyřeš
nezávisle — jako kdybys ji nikdy nepsal.

## 1. Správnost klíče

### 1.1 Vyřeš nezávisle
- Vyřeš úlohu jako kdybys neviděl klíč. Teprve pak porovnej.
- U slovních úloh: verbalizuj postup („mám 35, koupím za 12, zbyde 35-12=23").
- U interpunkce: aplikuj pravidlo, ne intuici.

### 1.2 Pozor na past — čárka a slučovací poměr
Před spojkami **a, i, ani, nebo** ve slučovacím poměru **se čárka NEPÍŠE**,
a to ani mezi větami hlavními:

- ✅ „Přišel Petr a Anna zpívala a Bára tancovala." — žádná čárka.
- ✅ „Bratr a sestra spí." — žádná čárka.
- ❌ „Přišel Petr, a Anna zpívala." — NE, čárka je chybná.

Čárka SE PÍŠE před spojkami:
- **ale, avšak, však, nýbrž** (odporovací)
- **protože, jelikož, poněvadž, ježto** (příčina)
- **když, až, jakmile, dokud** (čas/podmínka)
- **aby, abys, abychom** (účel)
- **a proto, a tak** (důsledek — celé „a proto" jako spojka)

### 1.3 Věty musí být gramaticky správné a idiomatické
- Žádné **vygenerované ne-slovo** („zdal", „spochodovala", „vzstartovala").
- Žádná **porušená shoda** („Jak se má Ty").
- Žádná **nesmyslná konstrukce** („aby ne se nemocní").
- Pokud generuješ větu ze šablony (např. `${podmet} ${sloveso} ${predmet}`),
  ověř výsledný tvar celé věty, ne jen jednotlivá dosazení.

## 2. Distraktory

### 2.1 Blízké chyby, ne náhodné hodnoty
Distraktor má být **typická chyba** — něco, co dítě odpoví, když udělá
konkrétní miskoncepci:

- Násobilka: sousední spoje (`6×7=42` → distraktor `48` = záměna se `6×8`), odchylka o 1.
- Čísla: `+/-` sousední hodnota, přehození řádů.
- Řady: chybný počet členů („odečtu ještě jeden krok").
- Čas: neplatný údaj typu „16:75", záměna hodin/minut.

**Špatné distraktory:**
- Absurdní hodnoty („−298,5 m" u délky, „100000" u času).
- Náhodná čísla bez souvislosti.
- Vícewordové nebo složené („kachna letecká", „poštovní schránka") — ať se dají porovnat na první pohled.

### 2.2 Pravopis 1. stupně — NIKDY chybné celé slovo
- ❌ Options: `[ryba, riba, rýba]` — dítě si zapamatuje `riba` jako slovo.
- ✅ Options: `[y, ý, i, í]` (nebo `[e, ě]`) — jen sporný grafém.

Otázka: `Doplň chybějící písmeno do slova: "r_ba"` + options jen grafémy.

**Alternativně, u úloh typu „Které slovo PATŘÍ mezi vyjmenovaná po B?":**
všechna 4 slova musejí být **správně napsaná**, jen jedno je vyjmenované.
Nikdy nesměšuj pravopisný test s testem příslušnosti.

### 2.3 Unikátnost — dedup až PO vygenerování konkrétních tvarů
- 4 různé možnosti, právě 1 správná.
- U skloňování/časování se **distraktor po ohnutí může shodnout s klíčem**:
  ```
  vzor = "žena", 2.p. mn.: klíč "žen", distraktor "ženy" (1.p. mn.)
  vzor = "kost", 7.p. j.: klíč "kostí", distraktor "kostí" (1.p. mn.) ← duplicita!
  ```
  Dedup vždy až **po vytvoření všech tvarů**, ne nad zdrojovými slovy.
- Používej `buildUniqueOptions` z `src/lib/content/uniqueOptions.ts`.

### 2.4 Žádný distraktor není také správně
- U mnohoznačných otázek („Které slovo je mnohoznačné?") ověř, že skutečně
  jen JEDNO je mnohoznačné — ostatní musí mít jen 1 význam.
- Distraktor nesmí být **délkovým outlierem** (delší/kratší než ostatní o víc než 50 %).
- Distraktor nesmí **používat slova z otázky** tak, že napovídá.

## 3. Kalibrace úrovní L1 < L2 < L3

### 3.1 Úrovně jsou kognitivní náročnost, ne náhodný výběr
- **L1** = rozpoznání pravidla / definice / čisté případy.
- **L2** = aplikace pravidla na běžné případy.
- **L3** = **nová dovednost nebo transfer**:
  - dvoukrokové úlohy (2 nákupy, 2 operace),
  - inverze (najdi činitele, obrácený převod),
  - přenesený význam / kontextová aplikace,
  - extrapolace (dopočítej 7. člen).

### 3.2 Disjunktní pooly
Antipattern: `pool = level<=2 ? POOL_L1 : shuffle([...POOL_L1, ...POOL_L2])`.
Tento vzor způsobí, že `getTierTasks` (rozdíl množin) vyprázdní L3.

**Správně:**
```ts
const POOL_L1: Item[] = [ /* jen L1 */ ];
const POOL_L2: Item[] = [ /* jen L2 */ ];
const POOL_L3: Item[] = [ /* jen L3 — nová dovednost */ ];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pick(pool);
}
```

### 3.3 Dovednostní téma MUSÍ mít L3
- Prázdné L3 je vada — flaguje ji audit `tier_population`.
- Výjimka: čistě rozpoznávací téma (např. „poznej barvy") — dokumentuj
  ji explicitně v komentáři a v `boundaries`.

### 3.4 Verify: `L3.hardest > L1.easiest`
Ověř kognitivní progresi. Past: L1 obsahuje složitou úlohu, L3 triviální.
Vypiš si nejtěžší L1 a nejlehčí L3 a porovnej.

## 4. Přiměřenost ročníku

### 4.1 Drž se RVP
- Číselný obor podle ročníku (2. tř. do 100, 3. tř. do 1000, 4. tř. do milionu).
- Pojmy, které se v ročníku zavádějí (např. zlomky až od 3.-4. tř., inverze
  násobilky až s pochopením dělení).

### 4.2 Enrichment (rozšiřující obsah) označ explicitně
Pokud L3 obsahuje látku nad RVP (např. nelineární posloupnosti ve 4. tř.,
třetina v 2. tř.), **označ v komentáři a v `briefDescription`**:
```
briefDescription: "…. (L3 obsahuje ENRICHMENT — nad rámec RVP.)"
```

## 5. Variabilita

### 5.1 Min. 8 unikátních úloh na úroveň (K=8)
- Flaguje audit `min_unique_tasks_per_tier`.
- Pod hranicí dítě vidí stejné otázky v každém sezení.

### 5.2 Faktické předměty — banka, ne opakování
- Přírodověda / vlastivěda / dějepis: **vytvořit banku ≥12 otázek na téma×úroveň**.
- Čtení s porozuměním: **rotovat 6-8 textů**, ne 2 opakované.

### 5.3 Matematika — generuj z rozsahu, ne z seznamu
- Ne: `POOL = [{ q: "5+3=?", a: "8" }, { q: "5+4=?", a: "9" }, …]`.
- Ano: `for (let a=1; a<=20; a++) for (let b=1; b<=20; b++) tasks.push({ q: `${a}+${b}=?`, a: String(a+b) })`.
- Distraktory z chybového modelu (typické miskoncepce).

## 6. Formát vs cíl

### 6.1 Pravopis a tvarosloví se prokazují produkcí
- Preferuj `fill_blank` (dítě doplní grafém).
- `select_one` z celých slov je slabší (dá se hádat).

### 6.2 Binární Ano/Ne (`true_false`) jen na L1
- L1: identifikace pravidla / definice — Ano/Ne stačí.
- L2/L3: **výběr ze 4 možností** (jinak 50 % náhoda).
- Flaguje audit `binary_tf_not_sole_l3`.

### 6.3 Sladí `topic.inputType` s tvarem tasků
- Pokud topic říká `inputType: "select_one"`, VŠECHNY tasky musí mít `options`
  a `correctAnswer ∈ options`. Test `generator-validation` to hlídá.
- Pokud potřebuješ mix (matching + select_one), buď rozděl na 2 topics,
  nebo topic.inputType = ten „hlavní" a routing se řeší podle tvaru tasku.

## 7. Nápověda

### 7.1 Nasměruj na strategii, neprozraď výsledek
- ✅ „Co říká pravidlo pro Y po tvrdé souhlásce?"
- ✅ „Ptej se: proč se to stalo?"
- ❌ „Odpověď je 42."
- ❌ „Vezmi 6 a přičti 6 sedmkrát = 42." — u úlohy `6 × 7 = ?`.

### 7.2 Obecné pravidlo NENÍ leak
- „Po měkké souhlásce píšeme I/Í." — OK i u úlohy s Č.
- „Po tvrdé souhlásce píšeme Y/Ý." — OK i u úlohy s R.

### 7.3 Nápověda per úloha vs `helpTemplate.hint`
- Přírodověda/vlastivěda/dějepis se spoléhá na `topic.helpTemplate` (fallback).
- Ostatní topics dávají `task.hints` per úloha (pole).
- `HelpButton` má fallback: `task.hints → task.solutionSteps → topic.helpTemplate`.

## 8. Freeze & regrese

### 8.1 Ověřený obsah je zmrazený
- Otázky a klíče ověřeného obsahu (aritmetika, faktografie, ověřené české klíče)
  se NESMÍ tichým způsobem měnit.
- Freeze mechanismus: `src/lib/contentSnapshot.ts` + audit `frozen_content_unchanged`.

### 8.2 Když opravíš topic
1. Přidej ID do `UNFROZEN_TOPIC_IDS` v `contentSnapshot.ts`.
2. Uprav topic.
3. Přegeneruj snapshot: `UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts`.
4. Po ověření/mergnutí odeber ID z `UNFROZEN_TOPIC_IDS` (topic je znovu zmrazený).

### 8.3 Audit MUSÍ projít
Nový generátor **neodesílej**, dokud `runOfflineAudit` neprojde:
- `format`, `self_validation`, `hint_leak`, `boundary`, `czech_grammar`.
- `options_distinct`, `answer_key_matches_option` (full-coverage).
- `min_unique_tasks_per_tier`, `tier_population`, `binary_tf_not_sole_l3` (topic-level).
- `frozen_content_unchanged` (regrese).

## Checklist před nasazením nového generátoru

Před tím, než merge/pushneš nový nebo upravený generátor, musí platit VŠE:

- [ ] Klíč nezávisle ověřen (Generator → Critic pattern).
- [ ] Každá věta v otázce i klíči je gramaticky správná a idiomatická.
- [ ] Interpunkce ověřena podle konkrétního pravidla (zvlášť čárka × slučovací `a/i/ani/nebo`).
- [ ] Distraktory jsou blízké chyby, 4 různé, právě 1 správná, žádný „také správně".
- [ ] U pravopisu 1. stupně jsou možnosti jen grafémy, ne celá slova.
- [ ] L1 < L2 < L3 obtížností; L3 naplněné a přináší transfer (nebo doložená výjimka).
- [ ] Obsah v rozsahu RVP ročníku; nadstavba označena jako **ENRICHMENT**.
- [ ] ≥ 8 unikátních úloh na téma × úroveň; faktická témata z banky ≥ 12.
- [ ] Formát odpovídá cíli; **binární Ano/Ne jen na L1**, L2/L3 s výběrem ze 4.
- [ ] `topic.inputType` odpovídá tvaru tasků (všechny mají `options`, pokud select_one).
- [ ] Nápověda navádí na strategii, neprozrazuje výsledek.
- [ ] `runOfflineAudit` prošel, včetně `frozen_content_unchanged`.
- [ ] `generator-validation.test.ts` prošel pro všechny 3 úrovně.
- [ ] `tsc --noEmit` bez chyb.

## Reference

- Freeze: [`src/lib/contentSnapshot.ts`](../src/lib/contentSnapshot.ts)
- Audit: [`src/lib/contentAudit.ts`](../src/lib/contentAudit.ts)
- Unique options: [`src/lib/content/uniqueOptions.ts`](../src/lib/content/uniqueOptions.ts)
- Tier coverage: [`src/lib/levelCoverage.ts`](../src/lib/levelCoverage.ts)
- Task validator: [`src/lib/taskValidator.ts`](../src/lib/taskValidator.ts)
- Handoff kolo 1: [`docs/GENERATOR_FIXES_HANDOFF.md`](GENERATOR_FIXES_HANDOFF.md)
- Přiložená pravidla z Chat review kola 2: [`D:\weigle\stažené soubory\cc-prompt-oli-kolo2.md`](file:///D:/weigle/sta%C5%BEen%C3%A9%20soubory/cc-prompt-oli-kolo2.md)
