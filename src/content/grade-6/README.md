# Grade 6 — Obsah pro 6. ročník ZŠ (2. stupeň) — README ŠABLONA

> **Tato složka je vlastněna grade-6 session.** Žádná jiná session sem nesahá.
> Zároveň slouží jako **README šablona pro celý 2. stupeň** (7.–9. ročník navazují
> stejnou strukturou, mění jen slovník a rozsah).
>
> Kanonický standard kvality: [`docs/PEDAGOGICKA_SPECIFIKACE_STUPEN2.md`](../../../docs/PEDAGOGICKA_SPECIFIKACE_STUPEN2.md).
> Cesta naplnění: [`docs/STUPEN2_CONTENT_PLAN.md`](../../../docs/STUPEN2_CONTENT_PLAN.md).

---

## Co tady patří / NEpatří

Stejné hranice jako grade-2…5 (viz `grade-4/README.md`): obsah specifický pro
6. ročník (cvičení, generátory, fakta, validace) v `src/content/grade-6/**`.
Sdílené typy, UI komponenty, DB migrace, engine **NEEDITUJ** — eskaluj přes
`docs/PENDING_CHANGES.md`.

**Pilot 6. ročníku (Fáze 1):** Dějepis (faktický vzor) + Fyzika (výpočetní vzor).
Zbytek (čeština, matematika, zeměpis, přírodopis, výchova k občanství) až po pilotu.

**NodeId formát:** `g6-{subject}-{area}-{topic}-{subtopic}` (kebab-case, bez diakritiky).

---

## ⚠️ Kvalitativní zlom 2. stupně — proč ≠ víc téhož 1. stupně

Žák 12–15 let procvičuje **aplikaci a vícekrokové uvažování**, ne rozpoznávání.
Model „pool 30 faktických otázek → select_one" je **nedostatečný.**

1. **Cvičení = aplikace, ne rozpoznání.** Výpočetní generátory s reálnými čísly
   (fyzika: dosazení do vzorce + převody jednotek; matematika: rovnice, procenta).
   Humanitní: práce se zdrojem/textem, ne „kdo byl X".
2. **Reálná gradace L1→L3** (vynucuje audit `difficulty_progression`):
   L1 = jeden krok / přímá aplikace · L2 = dva kroky / volba metody ·
   L3 = aplikace v neznámém kontextu. **Žádná recyklace L1→L3** (check 2b: ≥90 % = fail).
3. **Nápověda = metoda, ne odpověď** (audit `hint_leak`). U výpočetních úloh
   2. stupně je nápověda **víceúrovňová — pole 2–3 krokových hintů** (`HelpButton`
   je odhaluje progresivně). Krok 1 = nasměrování/vzorec, Krok 2 = první krok
   s hodnotami ze zadání, Krok 3 = dotažení. Úloha na 2 kroky → nápověda oba
   kroky rozepíše. **Nikdy nevkládej do hintu konkrétní výslednou hodnotu** —
   ani jako součást převodního vztahu (pozor: „1 kg = 1000 g" leakuje, když je
   odpověď „1 kg"; číslo už ušlé/nalité leakuje, když náhodou == zbytek).
4. **Vysvětlení = proč, vícekrokově**; u výpočtů `solutionSteps` s mezivýsledky.

---

## ⚠️ Jádro kvality 2. stupně — chybový model distraktorů + `optionFeedback`

Žák 2. stupně **jen vybírá z možností, nepíše** (rozhodnutí 2026-06-15). Celá kvalita
proto leží v **možnostech**. Povolené typy: `select_one`, `true_false`, `multi_select`,
`match_pairs`, `categorize`, `drag_order`, `comparison`, `image_select`, `diagram_label`
+ odborné výběrové (`timeline`, `chemical_balance`, `formula_builder`, `numeric_range`,
`number` — viz cookbook níže). **Zakázáno volné psaní:** `text`, `short_answer`, `essay`, `fraction`.

**Každý distraktor = konkrétní typická chyba**, ne náhodný posun:

```ts
// ❌ NE: options = [r, r+10, r-5, r+5]      ← náhodné, žák vyloučí odhadem
// ✅ ANO: options = [r, jen1Krok, opacnaOperace, sectlVse]  ← každá = reálná chyba
```

Tím distraktory **zároveň diagnostikují**, jakou chybu žák dělá. Na to navazuje pole
`PracticeTask.optionFeedback?: Record<string, string>` (klíč = přesný text možnosti,
hodnota = krátké vysvětlení **té** chyby). Při chybě se zobrazí cíleně místo obecného
`explanation`. Rozsah: `select_one` / `true_false` / `multi_select`.

```ts
{
  question: "Vypočítej obsah čtverce se stranou 5 cm.",
  correctAnswer: "25 cm²",
  options: ["25 cm²", "20 cm²", "10 cm²", "5 cm²"],
  optionFeedback: {
    "20 cm²": "Spočítal jsi obvod (4 × 5), ne obsah. Obsah je strana × strana.",
    "10 cm²": "Sečetl jsi jen dvě strany. Obsah se počítá násobením.",
  },
  explanation: "Obsah čtverce = strana × strana = 5 × 5 = 25 cm².",
}
```

Generátor s chybovým modelem plní `optionFeedback` skoro zdarma — distraktor už víš,
jak vznikl.

---

## Cookbook formátů `correctAnswer` pro odborné typy

Zafixováno smoke testy (`stupen2-odborne-typy.smoke.test.ts` + `…-ui.smoke.test.tsx`).
🔴 **Pozor:** `resolveTaskValidation` NEpřevádí strukturovaná pole (`chemEquation`/
`timelineEvents`/`formulaPool`/`diagram`) na `expected` → autor musí **ručně sladit**
`correctAnswer` (pipe-formát) + `inputType` + strukturované pole pro UI.

| inputType | `correctAnswer` (= `expected`) | answer z UI | pozn. |
|---|---|---|---|
| `number` | `"8"` | `"8"` / `"8,0"` | čárka i tečka, tolerance 0.001 |
| `numeric_range` | `"9.81±0.1"` nebo `"5..6"` | `"9.78"` | tolerance / rozsah |
| `chemical_balance` | `"2\|H2\|1\|O2\|2\|H2O"` (páry koef\|vzorec, BEZ +/=) | `"2\|1\|2"` | jen koeficienty; prázdné/0 = „1" |
| `formula_builder` | `"ρ\|=\|m\|/\|V"` | stejné pořadí | díly oddělené `\|` |
| `timeline` | `"Pravěk (-3000)\|Antika (500)\|…"` | seřazené pořadí | rok v závorce → feedback |
| `diagram_label` | `"kořen\|stonek\|list"` | dle pozic | toleruje diakritiku/překlep |

---

## Tone of voice — 6. ročník (11–12 let)

Dvouúrovňový systém zůstává (jako grade-4): **RVP fields** (`title`/`category`/`topic`)
= oficiální názvy, jen audit/report; **dětská vrstva** (`studentTitle` + `displayNames.ts`
+ `briefDescription`) = co žák vidí.

- **`briefDescription`:** max 14 slov (2. stupeň smí o 2 delší než 1. stupeň), 2. osoba,
  NIKDY „Žák…". Odborný termín smí — viz slovník níže.
- **`studentTitle`:** 1–3 slova, max 4.
- **Věty v úlohách:** max 25 slov (audit `sentence_complexity` pro G5+).

### Slovník 6. ročníku (11–12 let)

Oproti 1. stupni **smíš** odborné termíny, které žák zná z výuky 2. stupně.
Pořád vysvětluj POSTUP lidsky, ne definicí.

| ✅ Smíš použít (2. stupeň zná) | Předmět |
|---|---|
| veličina, jednotka, měření, převod jednotek, hustota, objem, vlastnost látky | fyzika |
| desetinné číslo, zlomek, dělitelnost, úhel, osová souměrnost, rovnice, procento | matematika |
| letopočet, n. l. / př. n. l., pravěk, starověk, civilizace, archeolog, pramen | dějepis |
| podstatné/přídavné jméno, slovní druh, vyjmenovaná slova, podmět, přísudek | čeština |

| ❌ Stále nepoužívej (moc abstraktní / vysokoškolské) | ✅ Použij |
|---|---|
| interpretuje / aplikuje (RVP žargon na žáka) | přečteš / použiješ |
| stechiometrie | poměr látek (až 8.–9. roč.) |
| kinematická veličina | rychlost / dráha / čas |
| historiografický pramen | historický pramen / zdroj |

> **Rozšíření 7.–9. ročník:** slovník se dál otevírá (chemie 8.: „sloučenina",
> „chemická rovnice", „reaktant"; fyzika: „síla", „práce", „energie"; dějepis:
> „revoluce", „industrializace"). Každý ročník má vlastní slovník v `grade-N/README.md`.
> Odborné jednotky/pojmy do `czechGrammar.ts` NOUNS eskaluj architektovi až budou potřeba.

---

## Definition of Done (každý topic)

- [ ] Kontrolní seznam z `PEDAGOGICKA_SPECIFIKACE_STUPEN2.md` sekce 5
- [ ] `npx tsc --noEmit` bez chyb
- [ ] `npm run audit:content` — passingPct ≥ 70 %, 0 hint_leak / giveaway / self_validation
- [ ] `npm run audit:pedagogical` — difficulty_progression OK, distractor_quality OK, sentence_complexity OK
- [ ] `navigation-consistency.test.ts` — topic v právě jednom okruhu
- [ ] česká gramatika přes `czechGrammar.ts` helpery
- [ ] faktický obsah: fakt má zdroj (RVP/učebnice), AI ho negeneruje z paměti
- [ ] **sebeověření** (sekce 6 plánu): u výpočetních úloh deterministický solver +
      LLM blind-solve/adversariální judge dle rubriky 7 kritérií

## Two-phase workflow

Stejný jako grade-4 (skelet → implementace). `GRADE_6_TOPICS` obsahuje **jen hotové
topics** — skelety se do `index.ts` nepřidávají (žádné broken topics v běžící app).
Index, navigation registr a STATUS.md zakládá **architekt** ve Fázi 1 scaffoldingu
(zasahují do sdílených registrů `src/content/navigation.ts` + content index).
