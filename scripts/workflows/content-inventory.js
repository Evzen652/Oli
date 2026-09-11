export const meta = {
  name: 'content-inventory',
  description: 'Inventura obsahu: brána audit-topic + docs-check nad všemi tématy 2.–6. ročníku, klasifikace nálezů',
  phases: [{ title: 'Inventura', detail: '13 agentů, každý jedna dávka ročník × předmět; jen čtení' }],
}

const G = args.groups
const SP = args.sp
const WT = args.wt
const PLAN = [
  ['2|matematika', '2|čeština'], ['2|prvouka'], ['3|matematika'], ['3|prvouka'], ['3|čeština'],
  ['4|matematika'], ['4|čeština'], ['4|vlastivěda', '4|přírodověda'], ['5|matematika'],
  ['5|čeština'], ['5|vlastivěda'], ['5|přírodověda'], ['6|fyzika', '6|dejepis'],
]
const batches = PLAN.map((keys, i) => ({
  name: keys.join(' + '),
  slug: 'b' + i,
  ids: keys.flatMap((k) => G[k] || []),
}))

const SCHEMA = {
  type: 'object',
  properties: {
    batch: { type: 'string' },
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          file: { type: 'string' },
          gate: { type: 'string', enum: ['PASS', 'FAIL', 'ERROR'] },
          uniquePerLevel: { type: 'string' },
          verdict: { type: 'string', enum: ['ok', 'exception_only', 'patch', 'rewrite'] },
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                severity: { type: 'string', enum: ['blocker', 'real', 'exception'] },
                levels: { type: 'string' },
                count: { type: 'integer' },
                example: { type: 'string' },
              },
              required: ['category', 'severity', 'count', 'example'],
            },
          },
          note: { type: 'string' },
        },
        required: ['id', 'gate', 'verdict', 'findings'],
      },
    },
  },
  required: ['batch', 'topics'],
}

const prompt = (b) => `Jsi inventurní agent obsahu vzdělávací aplikace Oli. Pracovní adresář: ${WT}
Tvoje dávka: ${b.name} (${b.ids.length} témat). ID témat:
${b.ids.join('\n')}

PRAVIDLA: Jen čteš a měříš. NEMĚŇ žádný soubor v repu. Žádné git příkazy měnící stav. Commity nedělej.

KROK 1 — brána: pro každé ID spusť \`node scripts/audit-topic.mjs <id>\` a zaznamenej PASS/FAIL a řádky s „•“ (nálezy).
KROK 2 — kontrola dokumentace všech unikátních úloh:
  IDS=<ID oddělená čárkou> npx vite-node scripts/docs-check.ts
  Výstup: řádek „✓/✗ <id>  L1/L2/L3 = a/b/c“ (počet unikátních úloh na úroveň) a pod ním problémy. „klic ve zneni“ = klíč stojí ve znění otázky; „mala napoveda se opakuje Nx“ = hints[0] sdílí více úloh; „velka napoveda neni o 20 % delsi“; „hint leak“; „bez feedbacku“ = chybí optionFeedback u chybných možností; „bez vysvetleni“; „duplicitni moznosti“. Když je výstup dlouhý, spusť ho po menších skupinách ID.
KROK 3 — klasifikuj každé téma. U nejasných nálezů otevři soubor generátoru (grep id v src/content) a podívej se na 1–2 konkrétní úlohy.
  category: hint_leak | hint_duplicate | hint_progression | missing_hints | missing_explanation | missing_feedback | key_in_question | format | low_variety | level_overlap | factual_error | language_error | other
  severity: blocker = kvůli tomu brána FAIL; real = porušuje autorská pravidla (CLAUDE.md „Authoring rules“, docs/CONTENT_AUTHORING.md §0: obě nápovědy unikátní pro úlohu, feedback u každé chybné možnosti, nápověda neprozrazuje, ≥12 unikátních úloh na úroveň, úrovně disjunktní) a má se opravit; exception = záměrné/nevyhnutelné (klíč ve znění u výčtových úloh „Které z čísel … je největší?“ nebo úloh s předponou „Text:“, varianty velikosti písmen u tématu velkých písmen, délka věty u čtecích textů).
  verdict: ok (nic) | exception_only | patch (cílené úpravy: doplnit feedback, přepsat pár nápověd) | rewrite (musí se změnit struktura generátoru: sdílené nápovědy z šablony bez dat úlohy, překryv úrovní, málo unikátních úloh).
  count = počet dotčených úloh (odhad z výstupu), example = jedna ukázka otázky ≤ 100 znaků, file = cesta k souboru tématu, uniquePerLevel = „a/b/c“ z kroku 2.
  Věcné a jazykové chyby hlas jen tehdy, když na ně při kontrole narazíš — nedělej celou korekturu.
Na konci ověř, že src/__inv_${b.slug}.tmp.ts neexistuje. Vrať výsledek přes StructuredOutput, batch = "${b.name}".`

phase('Inventura')
const results = await parallel(batches.map((b) => () =>
  agent(prompt(b), { label: `inventura: ${b.name}`, phase: 'Inventura', schema: SCHEMA, effort: 'medium' })))

const ok = results.filter(Boolean)
const missing = batches.filter((b, i) => !results[i]).map((b) => b.name)
if (missing.length) log(`Dávky bez výsledku: ${missing.join(', ')}`)

const summary = ok.map((r) => {
  const v = { ok: 0, exception_only: 0, patch: 0, rewrite: 0 }
  let fail = 0
  for (const t of r.topics) { v[t.verdict] = (v[t.verdict] || 0) + 1; if (t.gate !== 'PASS') fail++ }
  return { batch: r.batch, topics: r.topics.length, gateFail: fail, ...v }
})
const cats = {}
for (const r of ok) for (const t of r.topics) for (const f of t.findings) {
  const k = f.category + '/' + f.severity
  cats[k] = (cats[k] || 0) + (f.count || 1)
}
return { summary, categories: cats, missingBatches: missing, results: ok }
