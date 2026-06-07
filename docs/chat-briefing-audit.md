# Briefing pro Claude Chat — rozšíření audit systému

**Projekt: Oli (Sovička) — vzdělávací app pro české ZŠ, 1.–5. ročník**

Stavíme systém cvičení kde každé "téma" má `generator(level: 1|2|3): PracticeTask[]` — pure funkce, žádný network. Typy cvičení: `select_one`, `text_input`, `essay`, `step_based` (další přibývají: `fill_in_blank`, `matching_pairs`, `ordering`).

---

## Architektura registru témat

Témata jsou registrována hierarchicky — žádný hardcoding v auditu:

```
generátor.ts
  → grade-N/index.ts  (GRADE_N_TOPICS)
  → src/lib/content/index.ts  (ALL_TOPICS = [...GRADE_3, ...GRADE_4, ...GRADE_5])
  → src/lib/contentRegistry.ts  (getAllTopics())
  → audit dostane vše automaticky
```

```ts
// src/lib/content/index.ts
export const ALL_TOPICS = [...GRADE_3_TOPICS, ...GRADE_4_TOPICS, ...GRADE_5_TOPICS];
```

Audit přijímá témata jako parametr — bez hardcoded filtrů:
```ts
export function runOfflineAudit(topics: readonly TopicMetadata[], options: AuditOptions = {})
// AuditOptions: subjectFilter?: string[], gradeFilter?: number
```

---

## Stav obsahu (co existuje)

| Ročník | Předmět | Stav |
|--------|---------|------|
| Grade 3 | matematika | ✅ 13 témat |
| Grade 3 | čeština (cjl) | ✅ 25 témat |
| Grade 3 | prvouka | ❌ 0/14 — chybí soubory |
| Grade 4 | matematika | ✅ 14 témat |
| Grade 4 | čeština (cjl) | ✅ 22 témat |
| Grade 4 | vlastivěda | ✅ 13 témat |
| Grade 4 | přírodověda | ✅ 13 témat |
| Grade 5 | cjl, matematika, přírodověda, vlastivěda, informatika | ✅ soubory existují |

Nový předmět se do auditu dostane automaticky — stačí zaregistrovat v `grade-N/index.ts`.

---

## Formát topic ID

```
g{grade}-{subject}-{slug}

Příklady:
  g3-mat-nasobeni-deleni-mala-nasobilka
  g3-cjl-slovni-druhy
  g4-vlastiveda-lide-kolem-nas-stat-a-spolecnost-vznik-a-vyvoj-statu-demokracie-pravni-stat
```

Grade a subject jsou v metadatech (`topic.gradeRange`, `topic.subject`) — audit filtruje přes ty, ne parsováním ID.

---

## TopicMetadata struktura

```ts
{
  id: string                        // "g3-mat-nasobeni-..."
  title: string                     // "Násobení a dělení — malá násobilka"
  subject: string                   // "matematika" | "cjl" | "prvouka" | ...
  gradeRange: [number, number]      // [3, 3] = jen 3. třída
  inputType: "select_one" | "text_input" | "essay" | "step_based"
  practiceType?: "step_based"
  generator: (level: 1|2|3) => PracticeTask[]
  auditFlag?: string[]              // ["NEEDS_REVIEW"] pro ruční označení
  displayName?: string              // česky
}
```

---

## PracticeTask struktura

```ts
{
  question: string
  correctAnswer: string | number
  options?: string[]        // pro select_one — včetně správné odpovědi
  hints?: [string, string]  // [malá nápověda, velká nápověda]
  solutionSteps?: string[]  // pro step_based
  difficulty?: 1 | 2 | 3
}
```

---

## Aktuální audit — co kontroluje

### runOfflineAudit (vždy, synchronní, < 60ms per topic)

Max 5 vzorků per topic, ze všech 3 levelů:

| Check | Co kontroluje |
|-------|--------------|
| `format` | generator nespadne, question + correctAnswer nejsou prázdné, displayName je česky, formát sedí k inputType |
| `hint_leak` | nápověda neobsahuje nebo silně nenaznačuje správnou odpověď |
| `boundary` | odpověď nepřekračuje definované hranice tématu |
| `self_validation` | `validateAnswer(correctAnswer, correctAnswer)` vrátí `correct: true` |

Hard fail testu pokud < 70 % cvičení projde.

### runPedagogicalAudit (opt-in: `AUDIT_PEDAGOGICAL=1`, synchronní, bez AI)

Max 10 vzorků per topic:

| Check | Co kontroluje |
|-------|--------------|
| `audit_flag` | `topic.auditFlag` obsahuje `NEEDS_REVIEW` nebo jiný flag |
| `difficulty_progression` | `generator(1,2,3)` vrací stejný počet + stejnou 1. otázku → generátor není adaptivní |
| `missing_hints` | 0 % ze vzorků má `hints` (jen témata s ≥ 4 tasky) |
| `distractor_quality` | `select_one`: méně než 3 možnosti / prázdná možnost / distraktor identický se správnou odpovědí |
| `missing_solution_steps` | `step_based`: méně než 50 % tasků má `solutionSteps` |

Pedagogický audit nikdy neselhává test — jen reportuje. Hard fail jen u `audit_flag`.

### AI audit (opt-in: `AUDIT_AI=1`, async, volá Gemini/Llama)

Posílá vzorky v dávkách po 5:

```
System prompt:
"Jsi pedagogický validátor pro českou ZŠ.
 Kontroluj kvalitu cvičení (logika, přiměřenost ročníku, kvalita nápověd).
 Vrátíš tool call audit_results."

Per cvičení vrací: status OK | POTŘEBA_ÚPRAV + problems: string[]
```

---

## Architektonická omezení

- CHECK < 60ms — žádný network v realtime smyčce
- Generátory = pure funkce (žádný network, žádná DB, žádné side-effecty)
- AI audit = async, fire-and-forget, nikdy neblokuje UI
- AI je stateless — nemá kontext session

---

## Co audit odhalil a opravil (grade 3)

Po implementaci grade-3 proběhl audit a opravil:
- **hint_leak** — nápovědy prozrazovaly správnou odpověď (obsahovaly ji doslova)
- **non-adaptivní generátory** — `generator(1)`, `generator(2)`, `generator(3)` vracely totožné otázky

---

## Co chci probrat

Jak rozšířit audit? Zajímá mě:

1. Jaké další pedagogické checky by dávaly smysl pro českou ZŠ (1.–5. ročník)?
2. Má smysl rozšířit AI audit — a jaký prompt by byl nejefektivnější?
3. Jak auditovat různé typy cvičení odlišně — jiné checky pro `text_input` vs. `select_one` vs. budoucí `fill_in_blank`, `matching_pairs`, `ordering`?
4. Jak přistupovat k auditu nových předmětů (prvouka) — má jiné nároky než matematika nebo čeština?
