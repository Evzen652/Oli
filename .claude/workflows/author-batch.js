export const meta = {
  name: 'author-batch',
  description: 'Authoring + dvojí-optika verifikace cvičení 2. stupně přes paralelní agenty (pedagog + žák)',
  whenToUse: 'Když je potřeba vytvořit a ověřit více témat cvičení najednou (batch 6–8 RVP podtémat).',
  phases: [
    { title: 'Spec', detail: 'pedagog-plánovač navrhne hodinu per téma' },
    { title: 'Author', detail: 'autor napíše téma + test, projde bránou 0' },
    { title: 'Verify', detail: 'žák ∥ pedagog ∥ fakt — dvojí optika' },
    { title: 'Fix', detail: 'opravář sloučí nálezy, opraví, re-brána' },
  ],
}

// ── Vstup ────────────────────────────────────────────────────────────────
// args = pole položek: buď řetězec rvpId, nebo { rvpId, label?, file?, exportName?, subject? }
const raw = Array.isArray(args) ? args : (args ? [args] : [])
const topics = raw.map((t) => (typeof t === 'string' ? { rvpId: t } : t)).filter((t) => t && t.rvpId)
if (!topics.length) {
  log('⚠️ Nebyl předán žádný topic. Předej args = pole rvpId (nebo objektů {rvpId, label, file, exportName, subject}).')
  return { error: 'no_topics' }
}
log(`Batch: ${topics.length} témat → ${topics.map((t) => t.rvpId).join(', ')}`)

// ── Sdílené standardy (vloženy do promptů jednou) ──────────────────────────
const STANDARDS = `
STANDARD KVALITY 2. STUPNĚ (závazné):
- Žák jen VYBÍRÁ/manipuluje, NIKDY nepíše volnou odpověď. Povolené typy:
  select_one, true_false, multi_select, drag_order, categorize, comparison, timeline.
- Reálná gradace L1→L3 (zapamatování → použití → analýza). ŽÁDNÁ recyklace L1=L3.
  Znění otázek L1 a L3 musí být DISJUNKTNÍ (audit difficulty_progression porovnává texty otázek).
- Téma NEMÍCHÁ typy úloh (select_one téma emituje jen úlohy s options — jinak "Cause C" fail).
- Chybový model: KAŽDÝ distraktor = konkrétní typická chyba, ne náhodný posun.
  U select_one/true_false/multi_select navíc optionFeedback (mapa možnost→vysvětlení té chyby).
- Nápověda učí METODU, NIKDY neprozradí výsledek (ani jako součást převodního vztahu).
- explanation vysvětluje PROČ (u výpočtů solutionSteps s mezivýsledky).
- Česká gramatika čísel přes helpery z @/lib/czechGrammar (pad/plural/phrase/form) — nikdy inline.
- Test MUSÍ obsahovat NEZÁVISLÝ SOLVER (druhá cesta): pro výpočetní = přepočítej klíč z textu
  otázky; pro chronologii = rank-tabulka stáří; pro categorize = klasifikátor klíčových slov.

ZLATÉ VZORY (použij jako šablonu dle typu):
- select_one (výpočetní/faktický): src/content/grade-6/dejepis/periodizaceLetopocet.ts
- drag_order (chronologie):        src/content/grade-6/dejepis/dobaKamennaPeriodizace.ts
- categorize (práce se zdrojem):   src/content/grade-6/dejepis/historickePrameny.ts
- sdílené helpery faktického vzoru: src/content/grade-6/dejepis/_shared.ts
  (buildChoiceTask / buildOrderTask / buildCategorizeTask / pick / pickN / shuffle)
- výpočetní fyzika:                 src/content/grade-6/fyzika/mereniDelky.ts

DŮLEŽITÉ:
- Téma NEregistruj do index.ts (kolize). Registraci dělá architekt při integraci.
- RVP id, dětský studentTitle, briefDescription (max 14 slov), category/topic dle RVP datasetu.
`

// ── Schémata strukturovaného výstupu ───────────────────────────────────────
const SPEC_SCHEMA = {
  type: 'object',
  properties: {
    rvpId: { type: 'string' },
    skill: { type: 'string', description: 'Jedna jasná dovednost, kterou téma procvičuje.' },
    inputType: { type: 'string', description: 'Nejvhodnější typ úlohy.' },
    levels: {
      type: 'object',
      properties: { L1: { type: 'string' }, L2: { type: 'string' }, L3: { type: 'string' } },
      required: ['L1', 'L2', 'L3'],
    },
    errorModel: {
      type: 'array',
      description: '3–4 typické omyly žáka → z nich budou distraktory.',
      items: { type: 'object', properties: { mistake: { type: 'string' }, distractor: { type: 'string' } }, required: ['mistake', 'distractor'] },
    },
    factSource: { type: 'string', description: 'Zdroj faktů (RVP/učebnice); u výpočetních pravidlo.' },
    solverCheck: { type: 'string', description: 'Co má nezávislý solver v testu ověřit.' },
    isFactual: { type: 'boolean', description: 'true = faktické téma (potřebuje fakt-experta).' },
    file: { type: 'string', description: 'Navržená cesta souboru.' },
    exportName: { type: 'string', description: 'Navržený název export konstanty (UPPER_SNAKE).' },
  },
  required: ['rvpId', 'skill', 'inputType', 'levels', 'errorModel', 'solverCheck', 'isFactual', 'file', 'exportName'],
}

const AUTHOR_SCHEMA = {
  type: 'object',
  properties: {
    topicId: { type: 'string' },
    file: { type: 'string' },
    test: { type: 'string' },
    exportName: { type: 'string' },
    gatePassed: { type: 'boolean', description: 'Prošla brána 0 (strukturálně)?' },
    blockingErrors: { type: 'array', items: { type: 'string' } },
    reviewFindings: { type: 'array', items: { type: 'string' }, description: 'Heuristické audit nálezy k adjudikaci pedagogem.' },
  },
  required: ['topicId', 'file', 'test', 'exportName', 'gatePassed'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    realDefects: {
      type: 'array',
      items: { type: 'object', properties: { where: { type: 'string' }, what: { type: 'string' }, fix: { type: 'string' } }, required: ['what', 'fix'] },
    },
    verdict: { type: 'string', description: 'PŘIJMOUT nebo OPRAVIT.' },
  },
  required: ['realDefects', 'verdict'],
}

// ── Prompty agentů ─────────────────────────────────────────────────────────
const planPrompt = (t) => `Jsi zkušený učitel 2. stupně ZŠ. Pro RVP podtéma "${t.rvpId}"${t.label ? ` (${t.label})` : ''} navrhni plán cvičení.
${STANDARDS}
Vrať: (1) JEDNU jasnou dovednost; (2) typ úlohy a proč; (3) gradaci L1→L3 (konkrétně CO žák na každé úrovni dělá); (4) CHYBOVÝ MODEL — 3–4 typické omyly, které žák reálně dělá, a jaký distraktor z nich vznikne; (5) zdroj faktů / pravidlo; (6) co má ověřit nezávislý solver; (7) isFactual; (8) cestu souboru a název exportu. Mysli jako učitel připravující hodinu pro 11–12leté.`

const authorPrompt = (spec) => `Jsi autor obsahu cvičení. Podle TÉTO specifikace napiš hotové soubory:
SPEC: ${JSON.stringify(spec)}
${STANDARDS}
Postup:
1. Otevři odpovídající ZLATÝ VZOR (dle inputType) a _shared.ts a drž jejich strukturu i styl.
2. Napiš téma do "${spec.file}" (export "${spec.exportName}") + test do src/content/grade-6/__tests__/ s NEZÁVISLÝM SOLVEREM dle spec.solverCheck.
3. Spusť BRÁNU 0:  node scripts/audit-topic.mjs --file ${spec.file} --export ${spec.exportName} <cesta_k_testu>
   - Pokud hlásí "✗ FAIL" (strukturální vada / pád solveru) → oprav a spusť znovu. Max 2 pokusy.
   - Heuristické nálezy "k revizi" (hint_leak na jednotku, hint_progression) NEOPRAVUJ na sílu — nech je pedagogovi.
4. Vrať: topicId, file, test (cesta), exportName, gatePassed (bool), blockingErrors (pokud zůstaly), reviewFindings (řádky z bloku "REVIZE").
⛔ NEEDITUJ ŽÁDNÉ SDÍLENÉ SOUBORY — index.ts, PROJECT_STATUS.md, PENDING_CHANGES.md, STATUS.md.
   (I když to říká CLAUDE.md — v tomto workflow to NEPLATÍ; sdílené soubory aktualizuje architekt
   při integraci, jinak by se paralelní agenti o soubor poprali.) Tvůj výstup = JEN nový .ts soubor
   tématu + jeho test + strukturovaný návrat.`

const zakPrompt = (a) => `Jsi 11–12letý žák 6. třídy. V souboru .audit-topic/${a.topicId}.json je pole "samples" (úlohy po úrovních).
Vezmi z každé úrovně 2–3 úlohy a vyřeš je NASLEPO — IGNORUJ pole "correctAnswer"/"items"/"categories" jako klíč, řeš jen ze zadání a možností, tím co zná šesťák.
Pak u každé řekni UPŘÍMNĚ: (1) co bys vybral; (2) bylo JASNÉ, co se chce? (když ne, proč); (3) která špatná možnost tě lákala; (4) je tam slovo, kterému nerozumíš; (5) je to nudné/pořád stejné?
Teprve POTOM porovnej s klíčem v souboru. Každou neshodu (tvá odpověď ≠ klíč) nebo zmatek nahlas jako realDefect. Mluv jako dítě, nepředstírej víc, než šesťák ví. verdict = OPRAVIT, pokud ses někde nezvládl rozhodnout nebo nerozuměl; jinak PŘIJMOUT.`

const pedagogPrompt = (a) => `Jsi přísný učitel, co kontroluje pracovní list před tiskem. Default "hledej vadu".
Soubor tématu: ${a.file}. Vzorek instancí: .audit-topic/${a.topicId}.json (pole "samples", s klíčem).
Posuď 7 kritérií: řešitelnost, jednoznačnost, realističnost, čistý výsledek, KAŽDÝ distraktor = reálný omyl (ne náhoda), nápověda učí metodu (neprozrazuje), vysvětlení ukazuje PROČ. Navíc: sedí na RVP dovednost? jazyk pro 11–12 let? roste obtížnost L1→L3 reálně?
ADJUDIKUJ heuristické audit nálezy (mohou být falešné poplachy): ${JSON.stringify(a.reviewFindings || [])}
— u každého rozhodni, zda je to REÁLNÁ vada (pak realDefect), nebo falešný poplach checku (např. hint_leak na jednotku "století", kde se rozlišující číslo neprozrazuje → ignoruj).
Vrať realDefects (where/what/fix) + verdict PŘIJMOUT/OPRAVIT.`

const faktPrompt = (a) => `Jsi odborník na daný předmět. Soubor: ${a.file}. Vzorek: .audit-topic/${a.topicId}.json.
Fakt-check KAŽDÉ tvrzení v zadáních, distraktorech, optionFeedback i vysvětleních. Každý faktický omyl (co je špatně + správně) a každé sporné/zjednodušené-až-chybné tvrzení nahlas jako realDefect s návrhem opravy. verdict = OPRAVIT při jakékoli faktické vadě, jinak PŘIJMOUT.`

const fixPrompt = (a, defects) => `Dostáváš soubor tématu a potvrzené vady od žáka/pedagoga/fakt-experta. Oprav je.
Soubor: ${a.file} · test: ${a.test} · export: ${a.exportName}
VADY (sloučeno): ${JSON.stringify(defects)}
Priorita: cokoli, kde se žák zasekl NEBO faktická chyba. Zachovej, co funguje. Po opravě spusť bránu 0:
  node scripts/audit-topic.mjs --file ${a.file} --export ${a.exportName} ${a.test}
Musí projít (✓ PASS) a test/solver nesmí spadnout.
⛔ NEEDITUJ sdílené soubory (index.ts, PROJECT_STATUS.md, PENDING_CHANGES.md, STATUS.md) — jen soubor tématu a jeho test.
Vrať souhrn: co jsi změnil a finální gatePassed.`

// ── Pipeline: každé téma protéká nezávisle (bez bariéry mezi tématy) ───────
const results = await pipeline(
  topics,
  // 1) SPEC
  (t) => agent(planPrompt(t), { label: `spec:${t.rvpId.slice(0, 28)}`, phase: 'Spec', schema: SPEC_SCHEMA }),
  // 2) AUTHOR + brána 0
  //    Pozor: agent() vrací null, když subagent zemře (terminal API error po retry).
  //    Nikdy nevracíme bare null — vracíme sentinel s rvpId (z originalItem `t`),
  //    aby téma NEZMIZELO tiše, ale objevilo se v needsReview jako 'failed'.
  (spec, t) => {
    if (!spec) return { rvpId: t.rvpId, status: 'failed', stage: 'spec', reason: 'plánovač vrátil null (agent zemřel / schema fail)' }
    return agent(authorPrompt(spec), { label: `author:${spec.exportName}`, phase: 'Author', schema: AUTHOR_SCHEMA })
      .then((a) => (a ? { spec, author: a } : { rvpId: t.rvpId, status: 'failed', stage: 'author', reason: 'autor vrátil null (agent zemřel / schema fail)' }))
  },
  // 3) VERIFY — dvojí optika (+ fakt u faktických), paralelně
  (prev) => {
    if (!prev || !prev.author) return prev
    const a = prev.author
    if (!a.gatePassed) {
      log(`⛔ ${a.topicId}: brána 0 neprošla (${(a.blockingErrors || []).join('; ')}) → needs_review, přeskakuji kritiky.`)
      return { ...prev, verdicts: [], needsReview: true }
    }
    const critics = [
      () => agent(zakPrompt(a), { label: `žák:${a.topicId.slice(0, 24)}`, phase: 'Verify', schema: VERDICT_SCHEMA }),
      () => agent(pedagogPrompt(a), { label: `pedagog:${a.topicId.slice(0, 20)}`, phase: 'Verify', schema: VERDICT_SCHEMA }),
    ]
    if (prev.spec && prev.spec.isFactual) {
      critics.push(() => agent(faktPrompt(a), { label: `fakt:${a.topicId.slice(0, 24)}`, phase: 'Verify', schema: VERDICT_SCHEMA }))
    }
    return parallel(critics).then((vs) => ({ ...prev, verdicts: vs.filter(Boolean) }))
  },
  // 4) FIX — jen pokud kritici našli reálné vady
  (prev) => {
    if (!prev || !prev.author) return prev
    if (prev.needsReview) return { topicId: prev.author.topicId, file: prev.author.file, status: 'needs_review', reason: 'brána 0 neprošla' }
    const a = prev.author
    const defects = (prev.verdicts || []).flatMap((v) => (v && v.realDefects) || [])
    const mustFix = (prev.verdicts || []).some((v) => v && v.verdict === 'OPRAVIT') && defects.length > 0
    if (!mustFix) {
      return { topicId: a.topicId, file: a.file, test: a.test, exportName: a.exportName, status: 'accepted', defects: 0 }
    }
    return agent(fixPrompt(a, defects), { label: `fix:${a.topicId.slice(0, 26)}`, phase: 'Fix' })
      .then((summary) => ({ topicId: a.topicId, file: a.file, test: a.test, exportName: a.exportName, status: 'fixed', defects: defects.length, fixSummary: summary }))
  },
)

// ── Souhrn pro architekta (integraci dělá main loop, ne workflow) ──────────
const done = results.filter(Boolean)
const accepted = done.filter((r) => r.status === 'accepted' || r.status === 'fixed')
const review = done.filter((r) => r.status === 'needs_review' || r.status === 'failed')
log(`Hotovo: ${accepted.length} přijato/opraveno, ${review.length} k ruční revizi (vč. ${done.filter((r) => r.status === 'failed').length} padlých agentů).`)

return {
  batch: topics.map((t) => t.rvpId),
  accepted: accepted.map((r) => ({ topicId: r.topicId, file: r.file, test: r.test, exportName: r.exportName, status: r.status, defects: r.defects })),
  needsReview: review,
  // integrace (main loop): registrace exportů do src/content/grade-6/index.ts,
  // globální tsc + audit + generator-validation + navigation, docs, commit.
  integrationHint: accepted.map((r) => ({ exportName: r.exportName, file: r.file })),
}
