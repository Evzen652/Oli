# Worklist — doplnění obtížnosti L2/L3 (aktivní scope 2–4)

> Výstup Fáze 0.3 (2026-07-12): `npm run audit:coverage` (scope ročníky 2–4, všechny předměty).
> Zdroj pravdy o obtížnosti = `getTierTasks` (`src/lib/levelCoverage.ts`). Vzor opravy: disjunktní
> `POOL_L1/L2/L3` (viz `CONTENT_CONTRACT.md`, Balík 1A/2A). Po každém balíku: `npm run audit:coverage`,
> `tsc`, `generator-validation`, přegenerovat freeze snapshot (+ do `UNFROZEN_TOPIC_IDS`).
>
> ⚠️ Počty L1/L2/L3 v auditu **fluktuují mezi běhy** (náhodné samplování generátorů) — worklist je podle
> vzoru (chybí L2/L3), ne podle přesného čísla. Slohová/rukopisná témata čeština (`TIER_EXCEPTIONS`
> v `auditInvariantConfig.ts`) se do dluhu **nepočítají** — nemají přirozenou obtížnostní osu.

## ✅ Balík A HOTOVO (2026-07-12) — Vlastivěda g4: `35/0/0` non-adaptivní (runtime L1 cap!)

Stejná třída bugu jako Balík 1A: `gen(_level)` **ignoroval úroveň** → všechny 3 úrovně identické →
`getTierTasks` viděl L2/L3 prázdné → `maxAvailableLevel` ořezával v **produkci na L1**. Přepsáno na
disjunktní `POOL_L1/L2/L3`. Všech 7 nyní **maxL3** (dřív 35/0/0 nebo 35/1/0).

- [x] `g4-vlastiveda-...pravek-a-prvni-lide-na-nasem-uzemi` (drag_order) ✅ 12/12/12 — L1 materiál, L2 obživa+Keltové, L3 národy neurčitelné materiálem
- [x] `g4-vlastiveda-...lucemburkove-karel-iv-a-jeho-doba` (drag_order) ✅ 10/10/10 — L3 těsná sekvence 1355→1356→1357
- [x] `g4-vlastiveda-...husitstvi-mistr-jan-hus-husitske-valky` (drag_order) ✅ 10/10/10 — L3 miskoncepce Žižka †1424 ≠ Lipany 1434
- [x] `g4-vlastiveda-...premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii` (drag_order) ✅ 10/10/10 — L3 past Otakar I. vs II., Václav II. vs III.
- [x] `g4-vlastiveda-...slovane-velkomoravska-rise-cyril-a-metodej` (drag_order) ✅ 10/10/10 — L3 těsná sekvence 863→883→906
- [x] `g4-vlastiveda-...kraje-cr-14-kraju-cr-jejich-poloha-a-krajska-mesta` (match_pairs) ✅ 10/10/10 — L1 samo-odvoditelné, L3 5 párů vč. Vysočina→Jihlava
- [x] `g4-vlastiveda-...vodstvo-cr-hlavni-reky-...` (match_pairs) ✅ 10/10/10 — L3 obrácený směr + past Rožmberk/Lipno/Orlík

> Fakt-check proveden (Generator→Critic). Opravy: Máchovo jezero není „největší přirozené jezero“
> (je to rybník); vyhnuto se stejnoletým událostem v drag_order a duplicitní pravé straně v match_pairs
> (Praha↔Středočeský). Freeze přegenerován (107 témat), 7 nových v `UNFROZEN_TOPIC_IDS`.

## ✅ Balík B HOTOVO (2026-07-12) — Přírodověda g4 (1 téma)

- [x] `g4-prirodoveda-...rostliny-stavba-rostlin-rozsireni-druhy-rostlin` ✅ 12/11/8 maxL3 (bylo 30/1/0).
  Všech 31 úloh konzistentně `match_pairs` (žádné míchané typy, na rozdíl od obavy z R2 grade-5).
  L1 základní části/funkce, L2 aplikace/klasifikace, L3 odborná terminologie nad RVP (chloroplast,
  xylém/floém, anatomie květu) — nyní explicitně označena jako rozšiřující v `boundaries`.
  **Fakt-check:** „Bránice (průduch)" byl chybný — bránice je savčí orgán, opraveno na „Průduch".

## ✅ Balík C — Prvouka g3 (chybí L2/L3) — 10/10 HOTOVO (2026-07-12)

Většina měla L1=12, L2=1–4 (tenké), L3=0–1. Doplněny disjunktní L1/L2/L3.
(`ekosystemy-pole-louka-les` = 11/8/9 už OK z Balíku 1A — mimo seznam.)

✅ **Finální ověření proběhlo pro celý balík najednou**: tsc 0, generator-validation jen 6
předexistujících prvouka failů (`stavbaRostlin`, `stavbaTelaaZdravi` — mimo scope, nezměněny),
audit:coverage — všech 10 témat `maxL3` bez CHYBÍ, freeze snapshot přegenerován (96 témat).

- [x] `g3-prvouka-...casova-primka-generace-v-rodine` ✅ disjunktní L1/L2/L3, fact-check hotov
- [x] `g3-prvouka-...hlavni-mesto-statni-symboly` ✅ disjunktní L1/L2/L3, fact-check hotov
- [x] `g3-prvouka-...kraje-a-regiony-cr-uvod-nas-region` ✅ disjunktní L1/L2/L3, fact-check hotov
- [x] `g3-prvouka-...mapa-svetove-strany-plan-a-mapa-kompas` ✅ 13/16/14 maxL3 — L2 mezilehlé strany + rohy mapy, L3 výpočet skutečné vzdálenosti z měřítka + otočení těla o 90°/180°
- [x] `g3-prvouka-...komunikace-jednani-s-neznamymi-lidmi-bezpecnost` ✅ disjunktní L1/L2/L3, fact-check hotov (+ oprava syntax erroru z neescapované uvozovky v hints)
- [x] `g3-prvouka-...minulost-naseho-regionu-povesti` ✅ 13/12/12 maxL3 — L2 doplňkové detaily pověstí (Krok, Stadice), L3 klasifikace hmotný/písemný/ústní pramen (bez letopočtů dle boundaries)
- [x] `g3-prvouka-...skupiny-zivocichu-savci-ptaci-ryby-plazi-obojzivelnici-hmyz` ✅ disjunktní L1/L2/L3 + oprava runtime bugu (4 rozbité úlohy bez `pairs`, neplatné pole `type`)
- [x] `g3-prvouka-...voda-vzduch-puda-vyznam-pro-zivot` ✅ disjunktní L1/L2/L3, fact-check hotov
- [x] `g3-prvouka-...vztahy-mezi-lidmi-reseni-konfliktu` ✅ disjunktní L1/L2/L3, fact-check hotov
- [x] `g3-prvouka-...rozdily-mezi-zivou-a-nezivou-prirodou` ✅ disjunktní L1/L2/L3, fact-check hotov

## Balík D — Prvouka g2 (největší rozsah) — 12/15 ROZPRACOVÁNO (WIP, necommitnutý freeze/audit)

Prakticky **všech 15 témat** má L1=15, L2=1–3 (pod prahem), L3=0–1. Nejde jen o L3 — i L2 je slabé.
Přepsat na disjunktní pooly (vzor grade-2 čeština, 2026-06-18). Rozděleno na 4 vlny po ~4 tématech.

⚠️ **STAV 2026-07-14 (přechod na druhý PC):** 12/15 témat přepsáno na disjunktní POOL_L1/L2/L3 a
tsc-čisté (viz WIP commit). Vlny 1–3 hotové. **ZBÝVÁ:** vlna 4 (3 témata dole) + FINÁLNÍ OVĚŘENÍ
CELÉHO BALÍKU (generator-validation, audit:coverage, doplnit 15 ID do `UNFROZEN_TOPIC_IDS`
v `src/lib/contentSnapshot.ts`, přegenerovat freeze snapshot, dopsat PROJECT_STATUS/PENDING_CHANGES,
finální commit). Freeze snapshot ani audit ZATÍM NEPROBĚHLY ani pro těch 12 hotových.

Vlna 1 ✅: `g2-prv-hodiny-cas` · `g2-prv-tradice` · `g2-prv-sousedstvi` · `g2-prv-povolani`
Vlna 2 ✅: `g2-prv-chovani` · `g2-prv-nase-obec` · `g2-prv-orientace-obec` · `g2-prv-plan-obce`
Vlna 3 ✅: `g2-prv-zvirata-uzitek` · `g2-prv-jaro-rostliny-mladata` · `g2-prv-jaro-leto` · `g2-prv-zima-zvirata`

- [x] `g2-prv-hodiny-cas` · `g2-prv-tradice` · `g2-prv-sousedstvi` · `g2-prv-povolani` · `g2-prv-chovani`
- [x] `g2-prv-nase-obec` · `g2-prv-orientace-obec` · `g2-prv-plan-obce`
- [x] `g2-prv-zvirata-uzitek` · `g2-prv-jaro-rostliny-mladata` · `g2-prv-jaro-leto` · `g2-prv-zima-zvirata`
- [ ] **VLNA 4 (zbývá):** `g2-prv-podzim-zima` · `g2-prv-prvni-pomoc` · `g2-prv-zdravy-styl`

> Pozn.: `podzim-zima`, `jaro-leto`, `sousedstvi`, `chovani`, `nase-obec`, `zima-zvirata`, `zdravy-styl`
> mají `inputType: true_false` → L2/L3 musí mít 4-možnostní úlohy (ne jen Ano/Ne), jinak audit
> `binary_tf_not_sole_l3` padne. Router (`PracticeInputRouter.tsx`) 4-možnostní `options` u těchto
> topiců zobrazí správně (ověřeno).

## Pořadí

A (runtime dopad — děti nevidí L2/L3) → B → C → D. Každý balík stejným modelem jako 1A/2A:
fakt-check + Generator→Critic + disjunkce + audit + freeze.
