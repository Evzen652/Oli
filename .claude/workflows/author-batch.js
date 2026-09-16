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
- MATEMATIKA: stavba úlohy jako mereniDelky.ts, ale helpery VÝHRADNĚ z src/content/grade-6/matematika/_shared.ts
  (cis, uhel, rnd, pick, buildChoiceTask → vrací null při < 3 různých distraktorech, losUlohy, ruzneUlohy).
  Generátor: gen(level) = ruzneUlohy(() => losUlohy(genLx)). Soubor do src/content/grade-6/matematika/<camelCase>.ts,
  id "g6-mat-<kebab>-6", subject "matematika". Ten _shared.ts NEEDITUJ (sdílí ho celá dávka).

- PŘÍRODOPIS: stavba jako dějepisné vzory (historickePrameny.ts pro categorize, periodizaceLetopocet.ts pro select_one),
  ale helpery VÝHRADNĚ z src/content/grade-6/prirodopis/_shared.ts (buildChoiceTask → null při < 3 distraktorech,
  buildOrderTask, buildCategorizeTask, losUlohy, ruzneUlohy, pick, pickN, shuffle). Ten _shared.ts NEEDITUJ.
  Soubor do src/content/grade-6/prirodopis/<camelCase>.ts, id "g6-pri-<kebab>-6", subject "prirodopis".
  Generátor: gen(level) = ruzneUlohy(() => losUlohy(genLx)) (u order/categorize bez losUlohy).

PRAVIDLA PRO PŘÍRODOPIS:
- Fakta jen ta, na kterých se shodují běžné učebnice přírodopisu 6. ročníku (Fraus, Nová škola, SPN).
  Zjednodušení smí být, nepravda ne (houby NEJSOU rostliny; viry NEJSOU organismy v běžném smyslu —
  formuluj „nemají buněčnou stavbu"; lišejník = soužití houby a řasy/sinice).
- Distraktor = typická miskoncepce šesťáka (pavouk je hmyz, antibiotika na virózu, klíště je hmyz,
  žížala je had/hmyz, medúza je ryba, mech má kořeny, houba dělá fotosyntézu), ne náhodný pojem odjinud.
- Zástupci jen z české přírody nebo všeobecně známí (trepka, měňavka, nezmar, škeble, hlemýžď, sépie…).
  Latinské názvy nepoužívej jako klíč.
- Zdraví (jedovaté houby, klíšťata, nemoci) — správné rady (houbu neznáš = netrhej; klíště vytáhnout
  celé, místo sledovat; na viry antibiotika nezabírají). Žádná rada, která by mohla ublížit.
- Pořadí (drag_order) jen tam, kde je pořadí jednoznačné (vývoj hmyzu, práce s mikroskopem, geologická éra).
- L3 = přenos: poznej organismus z popisu znaků, rozhodni o neznámém případu, spoj znak s funkcí.

OBECNĚ — DETERMINISMUS: generátor nesmí mít stav mezi voláními (žádné „let" počítadlo na úrovni modulu,
které se jen zvyšuje). Rotaci šablon nastav na začátku gen() — hlídá to src/test/generator-determinism.test.ts.

PRAVIDLA PRO MATEMATIKU:
- Čísla v textu VŽDY přes cis() (česká čárka, mezera v tisících), úhly přes uhel(). Nikdy String(n) ani toFixed.
- Desetinné výsledky jen jako možnosti select_one (číselné pole zahodí čárku). Výsledky „čisté" — nejvýš 2 desetinná místa, bez periody.
- Rozsah RVP 6. ročníku; navazuje na src/content/grade-5/matematika — L1 smí být rozcvička z 5. ročníku, L2/L3 ne.
  Zlomky, procenta, záporná čísla v počtech a rovnice sem NEPATŘÍ (7. ročník).
- Geometrie bez obrázku: zadání musí jít vyřešit ze slov (rozměry, velikosti úhlů, popis). Žádné „podívej se na obrázek".
- Distraktor = výsledek konkrétního chybného postupu (čárka posunutá o řád, sečtené místo vynásobené, 60 ↔ 100 u minut,
  obvod místo obsahu, povrch jen tří stěn, nsn ↔ NSD, zapomenutý prvočinitel…), spočítaný z TĚCH SAMÝCH čísel.
- Slovní úlohy: jména a reálie střídej, čísla realistická (cena, délka, hmotnost). Jednotka ve všech možnostech stejná.
- NÁLEZY KRITIKŮ Z 1. DÁVKY MATEMATIKY (16. 9.) — napiš rovnou správně:
  • Mocniny ani zápis 2³ šesťák nezná (RVP 8. roč.) — piš 2 · 2 · 2 a „tolikrát, kolikrát…".
  • optionFeedback musí platit pro KAŽDOU vylosovanou kombinaci, ne jen typickou („dělíš číslem menším než 1…" u dělitele 2,5 je lež).
    Podmíněné tvrzení → podmíněný text. Feedback pojmenuje chybu slovníkem úrovně (na L1 bez pojmů z L2).
  • Peníze vždy se dvěma desetinnými místy (24,80 Kč) a realistické ceny podle zboží.
  • L3 nesmí jít vyřešit vylučováním ani vzorem (jediná možnost končící 5; klíč vždy jediné velké číslo; klíč daný polohou *).
  • Každá úloha tématu musí obsahovat to, co téma procvičuje (téma desetinných čísel = desetinné číslo v každé úloze).
  • Šablony střídej rovnoměrně (ne 5 ze 6 úloh L1 stejný typ); u slovních úloh ≥ 4 různé kontexty na úroveň.
  • Čeština: s 2–4 „byly tři", ne „bylo jich 3"; „kus" jen u věcí, které se tak počítají; žádné useknuté věty.
  • Vysvětlení nesmí být tautologie („5 560 = 5 560 + 0") a mezikrok s koncovou nulou ukaž (0,120 = 0,12).
- Test: nezávislý solver PARSUJE čísla ze znění otázky (ne z parametrů generátoru) a spočítá klíč jinou cestou
  (např. NSD Euklidem vs. rozklad v generátoru; objem a·b·c vs. součet vrstev).

PRAVIDLA Z 13.–14. 9. 2026 (kontroly je chytí při integraci — napiš to rovnou správně):
- ODBORNÉ TYPY: přečti docs/CONTENT_AUTHORING.md §6.4. timeline: timelineEvents = pool, correctAnswer = labely ve správném
  pořadí spojené "|". numeric_range smíš použít (letopočet), jen CELÁ čísla. image_select ani diagram_label NEPOUŽÍVEJ (nejsou obrázky).
- ≥12 RŮZNÝCH úloh na každou úroveň — deterministicky, ne losováním a doufáním (vzor ruzneUlohy() v src/content/grade-6/fyzika/_shared.ts).
- Klíč NESMÍ být systematicky výrazně nejdelší možnost (check:length). Distraktory piš stejně dlouhé a stejně konkrétní jako klíč.
- Klíč NESMÍ vyčnívat tvarem: když 3 distraktory začínají stejným slovem („Protože…", „Jen…"), musí tak začínat i klíč (check:options).
- Ano/Ne (true_false) jen na L1.
- Nápověda nesmí jmenovat prvky řešení (u drag_order/categorize/timeline ani pravou stranu dvojice). hints[0] i hints[1] unikátní pro úlohu.
- Správná odpověď se nesmí vyskytovat ve znění otázky.
- Předložka + dosazené jméno: pád ulož jako vlastní pole, nelep předložku k holému jménu (dřív vznikalo „z sklo", „u jantar").
- Čeština: žádné rodové lomítkové tvary (sám/sama). Po dosazení do šablony ověř shodu.
- category = labels.AREA, topic = labels.TOPIC (NE subtopic — podtéma je jen v rvpNodeId a title).
  Příklad: rvpId g6-prirodopis-biologie-hub-houby-a-lisejniky-lisejniky-… → category "Biologie hub", topic "Houby a lišejníky".
- category a topic ZNAK PO ZNAKU podle data/rvp_data.json (pomlčka "-", ne "–"). Témata téhož RVP topicu
  sdílí klíč pro zajímavost (src/lib/topicInsight.ts) a dětský název (src/content/grade-N/displayNames.ts);
  jiný znak = rozdělené téma bez zajímavosti. Ty soubory needituj, jen drž přesný zápis.
- Historická fakta jen ta, na kterých se shodují běžné učebnice 6. ročníku; sporné datace formuluj s „asi/kolem" nebo nepoužívej jako klíč.

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
U výpočetního tématu NEJDŘÍV sám přepočítej klíč u KAŽDÉ úlohy ve vzorku (bez pohledu do generátoru) a každou neshodu hlas jako realDefect.
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
