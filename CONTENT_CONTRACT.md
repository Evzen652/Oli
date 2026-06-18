# CONTENT CONTRACT — kontrakt obtížnosti

> Jak se v Oly definuje obtížnost cvičení a kdo je jejím zdrojem pravdy.
> Platí pro generátory (`TopicMetadata.generator`), admin, audit i runtime.

---

## 1. Generátor = zdroj pravdy o obtížnosti

Každé téma má `generator(level: number): PracticeTask[]` — **čistou funkci** bez sítě,
DB a AI. `level` je `1 | 2 | 3`:

- `gen(1)` → **Level I** „Základní" — jednokrokový dril, mechanika.
- `gen(2)` → **Level II** „Pokročilá" — vícekrokové / aplikační úlohy.
- `gen(3)` → **Level III** „Vysoká obtížnost" — nejtěžší, kombinuje koncepty.

Runtime (`sessionOrchestrator` → `generateMockBatch`) volá `generator(currentLevel)`.
Admin i audit počítají úrovně ze stejného generátoru — **nikdy ne z DB**.

---

## 2. Doporučený model: disjunktní pooly POOL_L1 / POOL_L2 / POOL_L3

Pro **nová** témata je referenční vzor
[`src/content/grade-4/cjl/vzoryPodstatnychJmenPanHradMuzStrojPredsedaSoudce.ts`](src/content/grade-4/cjl/vzoryPodstatnychJmenPanHradMuzStrojPredsedaSoudce.ts):

```ts
const POOL_L1: QA[] = [ /* základní */ ];
const POOL_L2: QA[] = [ /* pokročilé — JINÉ otázky než L1 */ ];
const POOL_L3: QA[] = [ /* nejtěžší — JINÉ otázky než L1 i L2 */ ];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 16).map(/* … */);
}
```

Pooly musí být **disjunktní podle textu otázky** (`question`). Tím je obtížnost
deklarativní a auditovatelná.

---

## 3. Pravidlo úrovní — `src/lib/levelCoverage.ts`

`levelCoverage.ts` je **jediné místo**, kde je rozdílové pravidlo definováno.
Počítá *odlišné* úlohy na úroveň přes rozdíl množin podle `question`:

```
l1 = generator(1)
l2 = generator(2) \ l1
l3 = generator(3) \ (l1 ∪ l2)
```

- `getTierTasks(topic): { l1, l2, l3 }` — úlohy po úrovních.
- `maxAvailableLevel(topic): 1 | 2 | 3` — nejvyšší úroveň s >0 odlišnými úlohami.

Reuse: **admin** (počty karet Level I/II/III), **audit** (pokrytí úrovní),
**runtime** (`maxAvailableLevel` jako pojistka).

---

## 4. `custom_exercises` = aditivní overlay, ne náhrada

Tabulka `custom_exercises` (ruční / AI authoring v adminu) je **volitelná nadstavba**
nad generátorem, ne jediný zdroj II/III. Počty na kartách v adminu:

| Karta | Generátor | + DB overlay (`approved`) |
|---|---|---|
| Level I | `tier.l1.length` | `source = "simple"` |
| Level II | `tier.l2.length` | `source = "advanced" / "ai"` |
| Level III | `tier.l3.length` | `source = "expert"` |

Schválené (`approved`) custom úlohy se přičítají; čekající (`pending`) se zobrazují
zvlášť jako návrhy.

---

## 5. Runtime pojistka

Engine nikdy nesmí servírovat **prázdnou nebo duplicitní** úroveň:

- `sessionOrchestrator` po `clampLevel(...)` ořízne `currentLevel` na
  `maxAvailableLevel(topic)`. Hodnota se počítá **jednou** při matchi tématu
  (cache `_maxLevel`) → realtime CHECK loop zůstává O(1) (invariant CHECK < 60 ms,
  žádné volání generátoru v reálné smyčce).
- `DemoSession` (anon, bez uložené úrovně žáka) startuje na `defaultLevel` ořezaném
  na `maxAvailableLevel` — ne natvrdo na 1.

---

## 6. Worklist „chybí těžší obtížnost"

`npm run audit:content` vypíše report **pokrytí úrovní** pro aktivní scope
(2.–4. třída, matematika + čeština) a worklist témat, kde `l2 === 0` nebo `l3 === 0`.
Doplnění chybějících L2/L3 je autorská práce (samostatné tasky), ne strukturální.
