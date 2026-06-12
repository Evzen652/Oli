# Grade 2 — Obsah pro 2. ročník ZŠ

> **Tato složka je vlastněna grade-2 session.**
> Žádná jiná session sem nesahá.

---

## Co tady patří

Obsah specifický pro 2. ročník — cvičení, generátory, fakta, validace.
Předměty 2. ročníku podle RVP:
- Matematika
- Český jazyk a literatura
- Prvouka

---

## Co tady NEpatří

- Obecné UI komponenty → `src/components/`
- Sdílené typy → `src/content/types.ts`
- DB migrace → `supabase/migrations/`
- Curriculum logika → `src/lib/curriculum*.ts`
- Engine → `src/lib/`

---

## Struktura

```
src/content/grade-2/
├── README.md           ← tento soubor
├── STATUS.md           ← tracker podtémat
├── index.ts            ← veřejný export
└── matematika/         ← 13 souborů
```

---

## Tone of voice — grade-2 (7–8 let)

Děti jsou o rok mladší než grade-3 — ještě jednodušší jazyk, ještě kratší věty.

### `briefDescription`
- **Max 10 slov, 1 věta**, 2. osoba: "Naučíš se...", "Spočítáš...", "Poznáš..."
- Žádný odborný žargon
- Konkrétní, ne abstraktní

### `studentTitle`
- 1–3 slova, dětsky
- "Sčítání a odčítání v oboru do 100" → "Počítám do 100"

### Otázky v úlohách
- **Max 5–6 slov** v otázce
- Čísla a symboly místo textu tam, kde to jde
- Nápovědy max 1 věta, velmi jednoduše

### Slovník 2. ročníku (7–8 let)

| ❌ Nepoužívej | ✅ Použij |
|---|---|
| číselný obor | čísla do 100 |
| přechod přes desítku | přes desítku |
| geometrický útvar | tvar |
| polopřímka | polopřímka (vysvětlit: "začíná v bodě, jde dál") |
| koeficient | číslo |

---

## Pedagogická vodítka pro 2. ročník

- **Matematika:** sčítání a odčítání do 100 (bez i s přechodem), úvod násobení (opakované sčítání), násobilka 2–5, jednotky (cm/m, kg, l), čas (hodiny, minuty), geometrie (bod, přímka, úsečka)
