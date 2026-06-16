# Author-batch pipeline — paralelní tvorba a audit cvičení

> Nahrazuje sériový postup „téma po tématu" paralelní pipeline přes témata.
> Dvojí optika ověření: **pedagog** (didaktika) + **žák** (simulovaný řešitel).
> Navrženo 2026-06-16/17 po pilotu dějepisu g6 (3 témata ručně sériově).

## Princip

Témata cvičení jsou navzájem nezávislá (každé = vlastní nový soubor) → paralelizují se
**přes témata**, ne přes kroky. Levné deterministické brány odfiltrují mechanické vady
dřív, než se utratí token na LLM. Drahé LLM ověření běží jen na to, co bránou projde,
a **dvěma optikami zároveň** — jejich neshoda = nejcennější signál.

```
SPEC (pedagog-plánovač) → AUTHOR (+ brána 0) → VERIFY (žák ∥ pedagog ∥ fakt) → FIX
   (pipeline přes témata, bez bariéry; integrace = main loop, ne workflow)
```

## Artefakty

| Soubor | Co dělá |
|---|---|
| `src/test/topic-gate.test.ts` | **Brána 0** (vitest, env-řízená). Audity + strukturální invarianty + dump vzorku pro jedno téma. Dva režimy: `GATE_TOPIC_ID` (registr) / `GATE_TOPIC_FILE`+`GATE_TOPIC_EXPORT` (import ze souboru — téma nemusí být v `index.ts`). |
| `scripts/audit-topic.mjs` | Node wrapper brány 0. Čitelný PASS/FAIL + uloží vzorek do `.audit-topic/<id>.json`. |
| `.claude/workflows/author-batch.js` | Workflow s 6 agenty. Spouští se přes Workflow tool / `author-batch` skill. |

## Brána 0 — politika PASS/FAIL

- **Tvrdě blokuje JEN strukturální invarianty** (correctAnswer ∉ options, drag_order bez items,
  categorize bez skupin, duplicitní options, optionFeedback klíč mimo options, hint = doslova odpověď).
  Tyhle nejsou nikdy falešné → propadlík se nedostane k LLM.
- **Audit nálezy = heuristika** (hint_leak, difficulty_progression, sentence_complexity…) →
  jen se **reportují** a posílají pedagog-kritikovi k adjudikaci. Mají falešné poplachy
  (např. `hint_leak` na jednotku „století", kde se rozlišující číslo neprozrazuje).

### Použití ručně
```bash
# téma z registru (+ jeho test se solverem)
node scripts/audit-topic.mjs g6-dej-periodizace-letopocet-6 src/content/grade-6/__tests__/periodizaceLetopocet.test.ts
# téma ze souboru (ještě neregistrované)
node scripts/audit-topic.mjs --file src/content/grade-6/dejepis/historickePrameny.ts --export HISTORICKE_PRAMENY <test>
```

## Řada agentů (dvojí optika)

| # | Agent | Optika | Kdy |
|---|---|---|---|
| ① | Pedagog-plánovač | učitel plánuje hodinu | 1× / téma |
| ② | Autor | píše pro žáka | 1× / téma (+ brána 0) |
| ③ | Žák-řešitel | dítě řeší naslepo | po bráně 0 |
| ④ | Pedagog-recenzent | učitel adversariálně | po bráně 0 |
| ⑤ | Fakt-expert | odborník | jen faktická témata |
| ⑥ | Opravář | sloučí ③④⑤, opraví | jen při vadě |

**Rozhodovací pravidlo:** rozpor ③ (žák) × ④ (pedagog) = priorita č. 1 k opravě.

## Spuštění workflow

⚠️ Spouští desítky placených agentů → **jen na výslovný pokyn uživatele.** Pak:

```
Workflow({ name: 'author-batch', args: [
  { rvpId: 'g6-dejepis-...-co-je-dejepis-...', label: 'Co je dějepis' },
  { rvpId: 'g6-dejepis-...-pomocne-vedy-...',  label: 'Pomocné vědy historické' },
  ...
]})
```
Workflow **vrátí** seznam hotových témat + verdiktů. **Integraci** (registrace do
`index.ts`, globální tsc + audit + generator-validation + navigation, docs, commit)
dělá main loop / architekt — workflow do sdílených souborů ani gitu nesahá.

## Náklad (odhad, kotvený měřením)

- 1 LLM kritik ≈ ~30k tokenů, ~60 s (měřeno na judge subagentech 2026-06-16).
- 1 téma ≈ ~110–200k tokenů (dle fakt-checku a kol oprav), kritická cesta ~6 min.
- Batch 6–8 témat ≈ ~1–1,3 M tokenů, wall-clock ~10–15 min (paralelně).
- Zbytek dějepisu g6 (21 témat) ≈ ~3 M tokenů, ~1,5–2 h vs. ~10–20 h sériově ručně.

## Známá omezení (follow-up)

- `hint_leak` check flaguje i jednotkové podstatné jméno odpovědi (např. „století" v „15. století"),
  kde se rozlišující část neprozrazuje → falešný poplach. Brána ho proto neblokuje (jen reportuje).
  Ke zvážení: zjemnit check, aby ignoroval jednotku/kategorii (sdílená změna `contentAudit.ts`).
- Workflow integraci (registrace/commit) záměrně nedělá — drží člověka ve smyčce u commitů.
