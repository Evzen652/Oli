# Grade 4 — Obsah pro 4. ročník ZŠ

> **Tato složka je vlastněna grade-4 session.**
> Žádná jiná session sem nesahá.

---

## Co tady patří

Obsah specifický pro 4. ročník — cvičení, generátory, fakta, validace.
Předměty 4. ročníku podle RVP:
- Matematika
- Český jazyk a literatura
- Vlastivěda
- Přírodověda
- Informatika

## Co tady NEpatří

- Obecné UI komponenty → `src/components/`
- Sdílené typy → `src/content/types.ts`
- DB migrace → `supabase/migrations/`
- Curriculum logika (lookup, navigace) → `src/lib/curriculum*.ts`
- Engine (adaptiveEngine, sessionDispatch) → `src/lib/`

## Pravidla pro grade-4 session

### ✅ Co smíš

- Vytvářet a měnit cokoli v `src/content/grade-4/**`
- Číst (jen číst) sdílené:
  - `src/content/types.ts` — typy `Exercise`, `NodeId`, `TopicMetadata`
  - `src/lib/types.ts` — existující domain typy
  - `src/lib/content/taxonomy.ts` — `ContentType`, `QualityTier`, `AcademicSubject`
  - `src/integrations/supabase/types.ts` — DB typy (auto-generated, readonly)
- Přidávat unit testy do `src/content/grade-4/__tests__/`
- Commit na branchi `content/grade-4`

### ❌ Co NESMÍŠ

- Editovat cokoli mimo `src/content/grade-4/**`
- Editovat sdílené typy (`src/content/types.ts`, `src/lib/types.ts`)
- Měnit DB schema, vytvářet migrace
- Editovat `package.json`, `vite.config.ts`, `tailwind.config.ts`
- Editovat UI komponenty (`src/components/**`)
- Vytvářet nové sdílené utility v `src/lib/`
- Mergovat do `main` (to dělá architekt)

### 🟡 Když potřebuješ víc

Pokud narazíš na to, že potřebuješ:
- Nový typ cvičení (UI komponentu)
- Změnu shared typu
- Novou DB tabulku / sloupec
- Sdílenou utility funkci

**STOP.** Napiš požadavek do `docs/PENDING_CHANGES.md` ve formátu:

```
## [grade-4] {datum} — {krátký název}

**Co potřebuju:** ...
**Proč:** ...
**Návrh řešení:** ...
**Co tím odblokuju:** ...
```

Pak pokračuj v jiné práci uvnitř `grade-4/` a počkej, až architekt požadavek vyřídí.

---

## Struktura

```
src/content/grade-4/
├── README.md           ← tento soubor
├── index.ts            ← veřejný export (jen tohle čte zbytek app)
├── matematika/
│   ├── index.ts
│   └── {topic}/
│       ├── generator.ts
│       ├── facts.ts (volitelné)
│       └── __tests__/
├── cestina/
├── vlastiveda/
├── prirodoveda/
└── informatika/
```

## Workflow

1. Přečti `src/content/grade-4/README.md` (tento soubor) — vždy první
2. Přečti `src/content/types.ts` — kontrakty
3. Zkontroluj `docs/PENDING_CHANGES.md` — neblokuje tě něco z minula?
4. Pracuj
5. Commit s prefixem `[grade-4]`: `git commit -m "[grade-4] desetinná čísla — sčítání"`
6. Před koncem session: `git push origin content/grade-4`

## Pedagogická vodítka pro 4. ročník

- **Matematika:** přechod od počítání po milion, písemné algoritmy, zlomky (úvod), jednotky
- **Český jazyk:** vyjmenovaná slova (opakování + nové řady), shoda podmětu s přísudkem, slovní druhy (rozšíření)
- **Vlastivěda:** ČR — kraje, památky, přírodní podmínky; úvod do dějin
- **Přírodověda:** lidské tělo (úvod), životní prostředí, energie a látky
- **Informatika:** algoritmické myšlení, blokové programování, bezpečnost
