# Morning Summary — 2026-05-22

Noční pipeline dokončen. 6 tasků, 6 feature branches, vše pushnuté na remote.

---

## Co bylo uděláno

### Task 1 — `refactor/inputtype-per-task` ✅
**inputType přesun z topic na task**

`inputType` přesunuto z `TopicMetadata` na každý `PracticeTask` object.
`PracticeInputRouter` odstraněn `topic` prop — routuje přes `currentTask.inputType`.
Zpětná kompatibilita zachována — `TopicMetadata.inputType` zůstává jako default.

### Task 2 — `feat/new-input-types` ✅
**TrueFalseInput + TextInput komponenty**

- `TrueFalseInput.tsx` — dvoutlačítková Pravda/Nepravda odpověď
- `TextInput.tsx` — extrahováno z inline kódu v PracticeInputRouter
- `PracticeInputRouter` — přidán `case "true_false"`, `case "short_answer"`
- `taskValidator.ts` + `validators/index.ts` — validace pro nové typy
- `SessionView`, `ExerciseTab`, `DemoSession` — odstraněn `topic=` prop

### Task 3 — `feat/templated-facts` ✅
**Faktový systém pro humanitní předměty**

- `types.ts` — nové typy `FactBankEntry`, `FactAngle`, `FactualContent`; `generator` na TopicMetadata je teď optional
- `factualGenerator.ts` — pure function `generateFromFactual()` + `renderTemplate()`
- `contentRegistry.ts` — `normalizeTopic()` auto-wraps factualContent topics s generátorem
- `data/facts/kraje-cr.ts` — 14 českých krajů jako fact bank
- `src/content/grade-4/vlastiveda/krajeCr.ts` — reference topic s 5 angles
- `src/test/factualGenerator.test.ts` — 18 testů
- `tsconfig.app.json` + `vite.config.ts` + `vitest.config.ts` — `@data` alias pro `./data`

### Task 4 — `feat/parent-first` ✅
**Rodičovský pohled — pozitivní observace + doporučení**

- `types.ts` — `displayName?: string`, `recommendedNext?: string[]` na TopicMetadata
- 14 grade-4 matematika souborů — doplněno `displayName` + `recommendedNext`
- `parentBenchmarks.ts` — optima pro sessionsPerWeek, successRate, sessionMinutes + interpretace
- `studentLabels.ts` — pozitivní labely pro výkon žáka (Výborně!/Pěkně!/Zvládl·a/...)
- `PositiveObservation.tsx` — nová komponenta pro prominentní pozitivní pozorování
- `NextWeekPlan.tsx` — nová komponenta s doporučeními + "Zadat" CTA
- `skillReadableName.ts` — upřednostňuje `displayName ?? title`
- `TopicBrowser.tsx` + `student/TopicBrowser.tsx` — zobrazuje displayName kde existuje

### Task 5 — `feat/student-ui` ✅
**Dětský UI — feature flagy + pozitivní výsledková obrazovka**

- `features.ts` — centrální feature flags (`studentChat=false`, `studentPercentageScore=false`, `studentGradeFilters=false`) s localStorage override
- `studentLabels.ts` — pozitivní hodnocení bez čísel nebo červené barvy
- `student/TopicResultDetail.tsx` — child-friendly výsledková obrazovka:
  - Max 1 chyba k připomenutí (první nalezená)
  - "Zvládl jsi X z Y úloh"
  - Primární CTA: "Zkusit znovu »"
  - Bez výčtu chyb v hlavičce
- `SessionView.tsx` — TutorChat skryt za `FEATURES.studentChat` (vypnuto pro grade 1–7)

### Task 6 — `feat/pedagogical-audit-pipeline` ✅
**Pedagogický audit — čistě statická kontrola didaktické kvality**

- `types.ts` — `auditFlag?: string[]` na TopicMetadata (NEEDS_REVIEW, AI_CHECKED, DISTRACTOR_WEAK, ...)
- `contentAudit.ts` — `runPedagogicalAudit()`:
  - `difficulty_progression` — generátor neprodukuje různý výstup pro level 1/2/3
  - `missing_hints` — témata bez nápověd
  - `distractor_quality` — select_one s <3 možnostmi nebo prázdnými distraktory
  - `audit_flag` — povrchuje témata s NEEDS_REVIEW a ostatními flagy
  - `missing_solution_steps` — step_based témata kde <50 % tasků má solutionSteps
- `content-audit.test.ts` — opt-in test (`AUDIT_PEDAGOGICAL=1`) s plným console reportem
- `package.json` — nový script `audit:pedagogical`

---

## Branches & PRs

| Branch | Status | PR |
|--------|--------|----|
| `refactor/inputtype-per-task` | ✅ pushed | https://github.com/Evzen652/Oli/pull/new/refactor/inputtype-per-task |
| `feat/new-input-types` | ✅ pushed | https://github.com/Evzen652/Oli/pull/new/feat/new-input-types |
| `feat/templated-facts` | ✅ pushed | https://github.com/Evzen652/Oli/pull/new/feat/templated-facts |
| `feat/parent-first` | ✅ pushed | https://github.com/Evzen652/Oli/pull/new/feat/parent-first |
| `feat/student-ui` | ✅ pushed | https://github.com/Evzen652/Oli/pull/new/feat/student-ui |
| `feat/pedagogical-audit-pipeline` | ✅ pushed | https://github.com/Evzen652/Oli/pull/new/feat/pedagogical-audit-pipeline |

---

## Co potřebuje pozornost

### Hint leak problémy (pre-existing)
`runOfflineAudit` reportuje hint_leak issues v grade-4 geometrii (trojúhelníky) a aritmetickém průměru.
Nápovědy doslova obsahují správnou odpověď. Potřeba opravit v:
- `src/content/grade-4/matematika/trojuhelnikDruhyStran.ts`
- `src/content/grade-4/matematika/aritmetickyPrumerUvod.ts`

### Task 4 + Task 5 sdílejí `studentLabels.ts`
Obě větve mají nezávislou kopii `src/lib/studentLabels.ts` (totožný obsah).
Při mergi do main se vyřeší standardním merge — soubor je identický, žádný konflikt.

### `feat/new-input-types` závisí na `refactor/inputtype-per-task`
Branch `feat/new-input-types` byl rebasován na `refactor/inputtype-per-task`.
Při mergi do main: nejdříve merge `refactor/inputtype-per-task`, pak `feat/new-input-types`.

### Audit script na Windows
`audit:pedagogical` používá `AUDIT_PEDAGOGICAL=1` prefix — na Windows CMD to nefunguje.
Řešení: spustit z Git Bash nebo přidat cross-env do devDependencies.

---

## Rychlé příkazy pro ráno

```bash
# Spustit offline audit (vždy)
npm run audit:content

# Spustit pedagogický audit (opt-in)
AUDIT_PEDAGOGICAL=1 npm run audit:content   # Git Bash / Linux / Mac

# Spustit testy factualGenerator
npx vitest run src/test/factualGenerator.test.ts

# Přepnout na konkrétní branch pro review
git checkout feat/student-ui
git checkout feat/pedagogical-audit-pipeline
```
