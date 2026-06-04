# Grade 3 — Obsah pro 3. ročník ZŠ

> **Tato složka je vlastněna grade-3 session.**
> Žádná jiná session sem nesahá.

---

## Co tady patří

Obsah specifický pro 3. ročník — cvičení, generátory, fakta, validace.
Předměty 3. ročníku podle RVP:
- Matematika
- Český jazyk a literatura
- Prvouka

> ℹ️ Přírodověda, Vlastivěda a Informatika začínají až od 4. ročníku.

## Co tady NEpatří

- Obecné UI komponenty → `src/components/`
- Sdílené typy → `src/content/types.ts`
- DB migrace → `supabase/migrations/`
- Curriculum logika → `src/lib/curriculum*.ts`
- Engine → `src/lib/`

---

## Pravidla pro grade-3 session

### ✅ Co smíš

- Vytvářet a měnit cokoli v `src/content/grade-3/**`
- Číst (jen číst) sdílené:
  - `src/content/types.ts` — typy `TopicMetadata`, `PracticeTask`
  - `src/content/curriculum.ts` — RVP lookup (`getNodesByGradeSubject(3, ...)`)
  - `data/rvp_data.json` — zdroj pravdy (NIKDY needituj)
  - `src/lib/types.ts` — domain typy
- Přidávat unit testy do `src/content/grade-3/__tests__/`
- Commit na branchi `content/grade-3`

### 📌 Tvá podtémata

Grade-3 vlastní těchto **52 podtémat** z RVP:
- Matematika: 13
- Prvouka: 14
- Český jazyk (cjl): 25

**NodeId formát:** `g3-{subject}-{area}-{topic}-{subtopic}` (kebab-case, bez diakritiky).

### ❌ Co NESMÍŠ

- Editovat cokoli mimo `src/content/grade-3/**`
- Editovat sdílené typy
- Měnit DB schema
- Editovat UI komponenty
- Mergovat do `main` (to dělá architekt)

### 🟡 Když potřebuješ víc

Napiš požadavek do `docs/PENDING_CHANGES.md`:

```
## [grade-3] {datum} — {krátký název}

**Co potřebuju:** ...
**Proč:** ...
**Návrh řešení:** ...
**Co tím odblokuju:** ...
```

---

## Struktura

```
src/content/grade-3/
├── README.md           ← tento soubor
├── STATUS.md           ← tracker 52 podtémat
├── index.ts            ← veřejný export (jen hotová témata)
├── matematika/         ← 13 souborů
├── prvouka/            ← 14 souborů
├── cjl/                ← 25 souborů
└── __tests__/
```

---

## Two-phase workflow

### Fáze 1 — Skelet (jednorázově)

1. Z RVP datasetu vytáhni uzly: `getNodesByGradeSubject(3, 'matematika')` atd.
2. Pro každý uzel vytvoř soubor `src/content/grade-3/{predmet}/{camelCase}.ts`
   - Jen `TopicMetadata` metadata (id, rvpNodeId, title, subject, category, …)
   - Generator: zatím `() => []`
   - **NEPŘIDÁVEJ do `GRADE_3_TOPICS`**
3. Fáze 1 = 52 souborů, STATUS.md vyplněn, `GRADE_3_TOPICS` zůstává `[]`

### Fáze 2 — Implementace (postupně)

1. Otevři soubor z fáze 1
2. Naplň podle `src/content/grade-4/TEMPLATE.ts`
3. Napiš unit testy v `__tests__/`
4. Přidej do `GRADE_3_TOPICS` v `index.ts`
5. V `STATUS.md` přepiš `[ ]` na `[x]`
6. `npm run test` — musí projít
7. `git commit -m "[grade-3] {predmet} — {subtopic}"`

---

## Tone of voice — grade-3 (8–9 let)

Děti jsou o rok mladší než grade-4 — ještě jednodušší jazyk.

### `briefDescription`
- **Max 12 slov, 1 věta**, 2. osoba: "Naučíš se...", "Spočítáš...", "Poznáš..."
- Žádný odborný žargon
- Konkrétní, ne abstraktní

### `studentTitle`
- 1–3 slova, dětsky
- "Násobení a dělení v oboru malé násobilky" → "Násobilka"
- "Sčítání a odčítání do 1000" → "Počítám do 1000"

### Slovník 3. ročníku (8–9 let)

| ❌ Nepoužívej | ✅ Použij |
|---|---|
| násobilka 6–10 | násobilka |
| číselný obor | čísla |
| geometrický útvar | tvar |
| synonyma / antonyma | slova s podobným/opačným významem |
| tvarosloví | jak se slova mění |
| slovní druhy | druhy slov |

---

## Pedagogická vodítka pro 3. ročník

- **Matematika:** dokončení násobilky (6–10), čísla do 1000, geometrie (kružnice, obvod), jednotky
- **Prvouka:** příroda kolem nás (ekosystémy, rostliny, živočichové), orientace v čase a prostoru, ČR úvod
- **Český jazyk:** vyjmenovaná slova, slovní druhy (přehled), souvětí úvod, slohové útvary (popis, vypravování, vzkaz)
