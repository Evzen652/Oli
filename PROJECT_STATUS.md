# OLI — Architecture Index & Project Status

> **Single entry point pro Claude Chat (product manager).**
> Jeden fetch tohoto souboru = úplný kontext architektury + aktuální stav.
> Detailní soubory linkovány níže (raw GitHub URLs).
>
> Repo: https://github.com/Evzen652/Oli
> Branch: `main`
> Aktualizováno: 2026-05-24

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

### Typy cvičení
- [x] Multiple choice (`select_one`)
- [x] Fill in the blank (`fill_blank`)
- [x] True/False (`true_false`)
- [x] Text input (`text_input`)
- [x] Matching pairs (`matching`)
- [x] Ordering (`ordering`)
- [ ] Multi-select

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
| **Inline editace dítěte** | ✅ | Editace jména/ročníku přímo v gradient kartě (shadcn Select přes Radix Portal) |
| **AssignmentCreator** | ✅ | Přepsán na code registry (`getAllTopics()`), ilustrace s `mix-blend-multiply` |
| **UI redesign** | ✅ | Stats karty s ikonami, fialový session header, ChildHomePage layout s chipy předmětů |
| **Grade-4 matematika** | ✅ | 14/14 topics implementovány (plný RVP pro 4. ročník) |
| **Architektura paralelních sessions** | ✅ | Worktree izolace, SESSION_OWNERSHIP, PENDING_CHANGES komunikace |
| **RVP dataset + curriculum API** | ✅ | 841 podtémat, `data/rvp_data.json`, `rvpNodeId` most |

## 6. Aktuálně rozpracované

| Co | Kdo | Stav |
|---|---|---|
| Adaptabilita mezi sezeními | Architekt | ✅ Hotovo |
| Refactor inputType na úroveň PracticeTask | Architekt | ✅ Hotovo |
| 6 typů cvičení | Architekt | ✅ Hotovo |
| Admin ilustrace — překreslení po generování (`key` na `<img>` + bez `loading="lazy"`) | Architekt | ✅ Hotovo |
| Admin ilustrace — regenerace vracela stejný obrázek (HF chybějící seed; Pollinations padá na HF) | Architekt | ✅ Hotovo (Pollinations 403 k prověření) |
| Templated facts architektura | Architekt | ✅ Hotovo |
| Parent UI (reporty, benchmarky, plán dopředu) | Architekt | ✅ Hotovo |
| Student UI (pozitivní labely, TopicResultDetail) | Architekt | ✅ Hotovo |
| Pedagogický audit pipeline | Architekt | ✅ Hotovo |
| 4 kritické UX bugy (auth, demo flow) | Architekt | ✅ Hotovo |
| Admin UI cleanup + AuthoringLauncher | Architekt | ✅ Hotovo |
| CI/CD pipeline + E2E testy (Playwright) | Architekt | 🟡 V PR |
| Hero layout (plovoucí hvězdičky, tlačítko dolů) | Architekt | 🟡 V PR |
| Freemium / anonymní vstup pro dítě (Kroky A–E kompletní) | Architekt | ✅ Hotovo |
| 14-denní trial s plným přístupem (změna freemium modelu) | Architekt | ✅ Hotovo |
| Trial flow bug fixes (loading, crash, grade, progress) | Architekt | ✅ Hotovo (4/5 — InviteDialog memory leak otevřený) |
| Email integrace pro parent_invitations (Resend/SendGrid) | Architekt | ⏸️ Follow-up |
| Czech grammar — centrální helper + audit | Architekt | ✅ Hotovo (audit zbylých generátorů otevřený) |
| Aplikace migrace `parent_invitations` v Supabase | Evžen | ✅ Provedeno 24.5. |
| Sjednocení helpTemplate vs task.hints | Architekt | ⏸️ Čeká |
| displayName + recommendedNext grade-4 (14 souborů) | Architekt | ⏸️ Čeká |
| Grade-4 obsah Level II a III | Grade-4 session | ⏸️ Čeká na authoring |
| Grade-4 čeština, vlastivěda, přírodověda | Grade-4 session | ⏸️ Čeká na authoring |
| Grade-5 až Grade-9 | Grade-N sessions | ⏸️ Čeká |

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
