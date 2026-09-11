export const meta = {
  name: 'content-fix-87',
  description: 'Oprava 87 témat z inventury: autor ve vlastním worktree + nezávislý kritik, jen větve content-fix/*',
  phases: [
    { title: 'Oprava', detail: '22 dávek, každá ve vlastním worktree a větvi content-fix/<dávka>' },
    { title: 'Kontrola', detail: 'nezávislý kritik: řeší úlohy bez klíče, jazyk, distraktory, nápovědy' },
  ],
}

const REPO = 'C:\\Users\\Evzen\\Desktop\\OLI'
const BATCHES = args.batches

const FIX_SCHEMA = {
  type: 'object',
  properties: {
    branch: { type: 'string' },
    worktreePath: { type: 'string' },
    commit: { type: 'string' },
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          gate: { type: 'string', enum: ['PASS', 'FAIL', 'ERROR'] },
          docsCheck: { type: 'string', enum: ['clean', 'exceptions_only', 'issues'] },
          uniquePerLevel: { type: 'string' },
          whatChanged: { type: 'string' },
          remaining: { type: 'string' },
        },
        required: ['id', 'gate', 'docsCheck', 'uniquePerLevel', 'whatChanged'],
      },
    },
    filesChanged: { type: 'array', items: { type: 'string' } },
    sharedFilesTouched: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['branch', 'worktreePath', 'commit', 'topics', 'filesChanged'],
}

const CRIT_SCHEMA = {
  type: 'object',
  properties: {
    branch: { type: 'string' },
    commit: { type: 'string' },
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          verdict: { type: 'string', enum: ['ok', 'fixed', 'problems_left'] },
          tasksChecked: { type: 'integer' },
          errorsFound: { type: 'array', items: { type: 'string' } },
          gate: { type: 'string', enum: ['PASS', 'FAIL', 'ERROR'] },
          docsCheck: { type: 'string', enum: ['clean', 'exceptions_only', 'issues'] },
          remaining: { type: 'string' },
        },
        required: ['id', 'verdict', 'tasksChecked', 'errorsFound', 'gate', 'docsCheck'],
      },
    },
    filesChanged: { type: 'array', items: { type: 'string' } },
  },
  required: ['branch', 'commit', 'topics'],
}

const topicList = (b) => b.topics.map((t) => `- [${t.v}] ${t.id}\n  soubor: ${t.f}`).join('\n')

const fixPrompt = (b) => `Jsi autor obsahu vzdělávací aplikace Oli (procvičování pro 1. a 2. stupeň ZŠ, česky). Opravuješ témata podle inventury obsahu.
Běžíš v izolovaném git worktree = tvůj aktuální pracovní adresář. Hlavní repo ${REPO} NEMĚŇ.

DÁVKA: ${b.slug} (${b.name})
TÉMATA ([rewrite] = přepis generátoru, [patch] = cílená úprava):
${topicList(b)}
${b.note ? '\nPOZOR, konkrétně v téhle dávce:\n' + b.note + '\n' : ''}
KROK 0 — příprava
1. \`git checkout -b content-fix/${b.slug}\`
2. Ve worktree chybí node_modules. Vytvoř junction na hlavní repo: \`cmd /c mklink /J node_modules ${REPO}\\node_modules\` (nebo PowerShell \`New-Item -ItemType Junction -Path node_modules -Target ${REPO}\\node_modules\`). Nic neinstaluj, junction nemaž.
3. Přečti: CLAUDE.md (sekce „Authoring rules“ a „ČESKÁ GRAMATIKA“), docs/CONTENT_AUTHORING.md §0, nálezy svých témat v docs/CONTENT_INVENTORY.md (surová data: docs/content-inventory-2026-09-11.json).
4. Vzor dobře přepsaných témat: src/content/grade-3/_shared.ts (choice, urcovaci, shuffle), src/content/grade-3/_iy.ts, src/content/grade-3/matematika/prevodyJednotekDelky.ts, src/content/grade-3/cjl/slovaSouznacnaAProtikladna.ts, src/content/grade-3/cjl/vyjmenovanaSlova.ts.

CÍL — pro každé téma musí platit VŠE:
- Brána \`node scripts/audit-topic.mjs <id>\` = PASS.
- Kontrola dokumentace \`IDS=<id> npx vite-node scripts/docs-check.ts\` (PowerShell: \`$env:IDS='<id>'; npx vite-node scripts/docs-check.ts\`) = ✓. Jediný přípustný zbytek je „klic ve zneni otazky“ u výčtových úloh, kde klíč ve znění být musí — zdůvodni v remaining a docsCheck = exceptions_only.
- ≥ 12 unikátních úloh na úroveň (míř na 13+), úrovně disjunktní (vlastní banka/pool na úroveň), L1 < L2 < L3 kognitivní náročností (L1 rozpoznání, L2 aplikace, L3 transfer / 2 kroky / inverze).
- Každá úloha: hints[0] i hints[1] unikátní pro tu konkrétní úlohu (hints[1] o ≥ 20 % delší a podrobnější); nápověda navádí na strategii, NEprozrazuje výsledek; explanation (nebo solutionSteps) vysvětluje PROČ; optionFeedback u KAŽDÉ chybné možnosti, konkrétně proč je právě ta možnost špatně.
- Distraktory = blízké typické chyby, 4 různé možnosti, právě 1 správná; dedup až po vygenerování konkrétních tvarů. U pravopisu 1. stupně jen sporný grafém (i/í/y/ý, e/ě), nikdy chybně napsané celé slovo.
- Ano/Ne (true_false) jen na L1, nikdy jako hlavní formát L2/L3.
- Každá věta gramaticky správná a idiomatická; interpunkce podle pravidla (před a/i/ani/nebo ve slučovacím poměru se čárka NEpíše). Číslo + podstatné jméno vždy přes helpery ze src/lib/czechGrammar.ts (pad, plural, phrase, form).
- Obsah v rozsahu RVP daného ročníku (číselný obor, zavedené pojmy).
- Klíč ověř NEZÁVISLE: po napsání si vypiš vygenerované úlohy (brána ukládá vzorek do .audit-topic/<id>.json; celé úrovně si můžeš vypsat dočasným vite-node skriptem ve scripts/, který pak smažeš) a každou vyřeš sám, bez pohledu na correctAnswer. Nesoulad oprav.

[rewrite] = přepiš generátor: buď tři oddělené banky ručně psaných úloh L1/L2/L3, nebo parametrický generátor, jehož nápovědy, vysvětlení i feedback obsahují data konkrétní úlohy (ne jednu šablonu pro celou úroveň).
[patch] = cílené doplnění (feedback, druhá nápověda, odstupňování nápověd, oprava konkrétních nálezů). Nepřepisuj, co funguje.

HRANICE
- Měň jen soubory svých témat. Zachovej id tématu, exportované jméno a metadata (title, studentTitle, rvp, displayName, inputType jen pokud ho nutně nemusíš změnit) — mění se generátor a obsah úloh.
- Pomocné funkce dej do souboru tématu, nebo importuj existující helpery (@/content/grade-3/_shared, @/lib/czechGrammar…) jen ke čtení. NEvytvářej ani neupravuj sdílené soubory: _shared.ts, index.ts, navigation.ts, displayNames.ts, src/lib/*, snapshot, docs/*, PROJECT_STATUS.md, CLAUDE.md.
- Test frozen-content-unchanged bude u tvých témat padat — to je očekávané. Snapshot NEpřegeneruj.
- Pokud jiný existující test (grep id tématu nebo název souboru v src/test) padá kvůli tvé záměrné změně, uprav v něm jen části týkající se tvého tématu a uveď soubor v sharedFilesTouched.
- Na konci: \`npm run typecheck\` bez chyb v tvých souborech; \`npx vitest run <testy, které tvá témata zmiňují>\` zelené (kromě frozen-content).
- Smaž všechny své dočasné soubory. \`git add\` jen své soubory (ne node_modules, ne .audit-topic), commit do content-fix/${b.slug} se zprávou „fix(content): ${b.name}“. NEpushuj, nemerguj, na main nesahej.

Vrať StructuredOutput: branch, worktreePath (absolutní cesta k tvému worktree, \`git rev-parse --show-toplevel\`), commit (sha), topics (stav po opravě), filesChanged, sharedFilesTouched, notes.`

const critPrompt = (b, fix) => `Jsi NEZÁVISLÝ kritik obsahu vzdělávací aplikace Oli (Generator→Critic). Jiný agent právě opravil tato témata a commitnul je do větve content-fix/${b.slug}:
${topicList(b)}
Autor hlásí: ${JSON.stringify(fix.topics.map((t) => ({ id: t.id, gate: t.gate, docs: t.docsCheck, u: t.uniquePerLevel, zbytek: t.remaining || '' })))}

PŘÍPRAVA
- Pracuj ve worktree ${fix.worktreePath} (cd tam; větev content-fix/${b.slug} je tam checkoutnutá). Hlavní repo ${REPO} NEMĚŇ.
- Pokud ten adresář neexistuje: \`git -C ${REPO} worktree add ${REPO}\\.claude\\worktrees\\cf-${b.slug} content-fix/${b.slug}\`, přejdi tam a vytvoř junction \`cmd /c mklink /J node_modules ${REPO}\\node_modules\`.
- Pravidla: CLAUDE.md sekce „Authoring rules“ a docs/CONTENT_AUTHORING.md §0.

ÚKOL — u každého tématu:
1. Vypiš si úlohy všech tří úrovní (dočasný vite-node skript ve scripts/, který na konci smažeš; nebo .audit-topic/<id>.json po spuštění brány). Projdi aspoň 10 úloh na úroveň, u ručních bank všechny.
2. Každou úlohu nejdřív vyřeš SÁM, bez pohledu na correctAnswer, pak porovnej. Není obhajitelně správná i jiná možnost? Je zadání jednoznačné (bez obrázku, který dítě nevidí)?
3. Jazyk: gramatika, shoda, skloňování po dosazení do šablony, interpunkce (před a/i/ani/nebo ve slučovacím poměru bez čárky), idiomatičnost, slovní zásoba přiměřená ročníku.
4. Nápovědy: neprozrazují výsledek, hints[1] je podrobnější; explanation vysvětluje proč; optionFeedback věcně sedí ke každé chybné možnosti.
5. Distraktory blízké a pravděpodobné, u pravopisu 1. stupně jen grafém; Ano/Ne jen na L1; L1 < L2 < L3; obsah v rozsahu RVP.
Konkrétní chyby OPRAV přímo v souborech témat (malé cílené zásahy, nepřepisuj celé téma). Pak znovu: \`node scripts/audit-topic.mjs <id>\` a \`$env:IDS='<id>'; npx vite-node scripts/docs-check.ts\` a \`npm run typecheck\`. Pokud jsi něco měnil, commit do content-fix/${b.slug} se zprávou „fix(content): kontrola ${b.name}“. Strukturální problém, který nejde opravit malým zásahem, popiš v remaining a dej verdict problems_left.
Nepushuj, nemerguj, na main nesahej, snapshot nepřegeneruj, smaž dočasné soubory.

Vrať StructuredOutput: branch, commit (sha HEAD po tvé práci), topics (verdict ok = bez chyb, fixed = opraveno, problems_left), filesChanged.`

log(`Spouštím ${BATCHES.length} dávek, ${BATCHES.reduce((n, b) => n + b.topics.length, 0)} témat`)

const results = await pipeline(
  BATCHES,
  (b) => agent(fixPrompt(b), { label: `oprava: ${b.slug}`, phase: 'Oprava', schema: FIX_SCHEMA, isolation: 'worktree', effort: 'high' }),
  (fix, b) => {
    if (!fix) return null
    return agent(critPrompt(b, fix), { label: `kontrola: ${b.slug}`, phase: 'Kontrola', schema: CRIT_SCHEMA, effort: 'high' })
      .then((crit) => ({ slug: b.slug, name: b.name, fix, crit }))
  },
)

const done = results.filter(Boolean)
const missing = BATCHES.filter((b, i) => !results[i]).map((b) => b.slug)
if (missing.length) log(`Dávky bez výsledku: ${missing.join(', ')}`)

const summary = done.map((r) => {
  const byId = {}
  for (const t of r.fix.topics) byId[t.id] = { gate: t.gate, docs: t.docsCheck, u: t.uniquePerLevel }
  if (r.crit) for (const t of r.crit.topics) byId[t.id] = { ...(byId[t.id] || {}), gate: t.gate, docs: t.docsCheck, crit: t.verdict, errors: t.errorsFound.length }
  return { slug: r.slug, branch: r.fix.branch, worktree: r.fix.worktreePath, commit: r.crit ? r.crit.commit : r.fix.commit, critMissing: !r.crit, topics: byId, shared: r.fix.sharedFilesTouched || [] }
})
return { summary, missing, results: done }
