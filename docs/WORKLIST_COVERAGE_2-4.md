# Worklist — doplnění obtížnosti L2/L3 (aktivní scope 2–4)

> Výstup Fáze 0.3 (2026-07-12): `npm run audit:coverage` (scope ročníky 2–4, všechny předměty).
> Zdroj pravdy o obtížnosti = `getTierTasks` (`src/lib/levelCoverage.ts`). Vzor opravy: disjunktní
> `POOL_L1/L2/L3` (viz `CONTENT_CONTRACT.md`, Balík 1A/2A). Po každém balíku: `npm run audit:coverage`,
> `tsc`, `generator-validation`, přegenerovat freeze snapshot (+ do `UNFROZEN_TOPIC_IDS`).
>
> ⚠️ Počty L1/L2/L3 v auditu **fluktuují mezi běhy** (náhodné samplování generátorů) — worklist je podle
> vzoru (chybí L2/L3), ne podle přesného čísla. Slohová/rukopisná témata čeština (`TIER_EXCEPTIONS`
> v `auditInvariantConfig.ts`) se do dluhu **nepočítají** — nemají přirozenou obtížnostní osu.

## Balík A (priorita) — Vlastivěda g4: `35/0/0` non-adaptivní (runtime L1 cap!)

Stejná třída bugu jako Balík 1A: `gen(_level)` **ignoruje úroveň** (podtržítko) → všechny 3 úrovně
identické → `getTierTasks` vidí L2/L3 prázdné → `maxAvailableLevel` ořezává v **produkci na L1**.
`drag_order` (dějiny, chronologie) + `match_pairs` (kraje). Nutná disjunkce L1/L2/L3 (např. dějiny
gradace přes počet položek 3→4→5 + obtížnost událostí; kraje přes počet párů / míru nápovědy).

- [ ] `g4-vlastiveda-...kraje-cr-14-kraju-cr-jejich-poloha-a-krajska-mesta` (match_pairs)
- [ ] `g4-vlastiveda-...lucemburkove-karel-iv-a-jeho-doba` (drag_order)
- [ ] `g4-vlastiveda-...husitstvi-mistr-jan-hus-husitske-valky` (drag_order)
- [x] `g4-vlastiveda-...pravek-a-prvni-lide-na-nasem-uzemi` (drag_order) ✅ 2026-07-12 pilot — 12/12/12 maxL3 (L1 3-pol. materiál, L2 4-pol. obživa+Keltové, L3 5-pol. národy neurčitelné materiálem)
- [ ] `g4-vlastiveda-...premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii` (drag_order)
- [ ] `g4-vlastiveda-...slovane-velkomoravska-rise-cyril-a-metodej` (drag_order)
- [ ] `g4-vlastiveda-...vodstvo-cr-hlavni-reky-vltava-labe-morava-odra-rybniky-prehr` (match_pairs)

> ⚠️ Fakt-check povinný (data, chronologie) — dějiny drag_order už měly opravu formulací
> (2026-06-08 „Bohemia"). Ověřit klíč nezávisle (Generator→Critic).

## Balík B — Přírodověda g4 (1 téma)

- [ ] `g4-prirodoveda-...rostliny-stavba-rostlin-rozsireni-druhy-rostlin` (`30/1/0`) — míchané typy
  tasků (souvisí s R2 auditem grade-5). Rozdělit na disjunktní L1/L2/L3.

## Balík C — Prvouka g3 (chybí L2/L3)

Většina má L1=12, L2=1–4 (tenké), L3=0–1. Doplnit disjunktní L2/L3 dle náročnosti otázky.
(`ekosystemy-pole-louka-les` = 11/8/9 už OK z Balíku 1A — mimo seznam.)

- [ ] `g3-prvouka-...casova-primka-generace-v-rodine`
- [ ] `g3-prvouka-...hlavni-mesto-statni-symboly`
- [ ] `g3-prvouka-...kraje-a-regiony-cr-uvod-nas-region`
- [ ] `g3-prvouka-...mapa-svetove-strany-plan-a-mapa-kompas`
- [ ] `g3-prvouka-...komunikace-jednani-s-neznamymi-lidmi-bezpecnost`
- [ ] `g3-prvouka-...minulost-naseho-regionu-povesti`
- [ ] `g3-prvouka-...skupiny-zivocichu-savci-ptaci-ryby-plazi-obojzivelnici-hmyz`
- [ ] `g3-prvouka-...voda-vzduch-puda-vyznam-pro-zivot`
- [ ] `g3-prvouka-...vztahy-mezi-lidmi-reseni-konfliktu`
- [ ] `g3-prvouka-...rozdily-mezi-zivou-a-nezivou-prirodou`

## Balík D — Prvouka g2 (největší rozsah)

Prakticky **všech 15 témat** má L1=15, L2=1–3 (pod prahem), L3=0–1. Nejde jen o L3 — i L2 je slabé.
Přepsat na disjunktní pooly (vzor grade-2 čeština, 2026-06-18). Rozdělit na 2–3 podbalíky.

- [ ] `g2-prv-hodiny-cas` · `g2-prv-tradice` · `g2-prv-sousedstvi` · `g2-prv-povolani` · `g2-prv-chovani`
- [ ] `g2-prv-nase-obec` · `g2-prv-orientace-obec` · `g2-prv-plan-obce`
- [ ] `g2-prv-zvirata-uzitek` · `g2-prv-jaro-rostliny-mladata` · `g2-prv-jaro-leto` · `g2-prv-zima-zvirata` · `g2-prv-podzim-zima`
- [ ] `g2-prv-prvni-pomoc` · `g2-prv-zdravy-styl`

## Pořadí

A (runtime dopad — děti nevidí L2/L3) → B → C → D. Každý balík stejným modelem jako 1A/2A:
fakt-check + Generator→Critic + disjunkce + audit + freeze.
