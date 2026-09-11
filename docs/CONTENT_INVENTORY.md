# Inventura obsahu — 2026-09-11

> Vygenerováno workflowem `scripts/workflows/content-inventory.js` (13 agentů, brána `audit-topic` + `scripts/docs-check.ts` nad všemi tématy 2.–6. ročníku). Surová data: `docs/content-inventory-2026-09-11.json`. Témata `g3-cjl-tvorive-cinnosti` a `g3-cjl-vlastni-vytvarny-doprovod` inventura vynechala — byla přepsaná a ověřená těsně předtím.
>
> **severity:** blocker = brána FAIL · real = porušuje autorská pravidla · exception = záměrné (klíč ve znění u výčtových úloh / `Text:` apod.)

## Souhrn

| dávka | témat | FAIL brány | ok | jen výjimky | úprava | přepis |
|---|---|---|---|---|---|---|
| 2. matematika + 2. čeština | 26 | 3 | 0 | 0 | 2 | 24 |
| 2. prvouka | 15 | 0 | 0 | 0 | 15 | 0 |
| 3. matematika | 13 | 0 | 2 | 1 | 3 | 7 |
| 3. prvouka | 14 | 0 | 0 | 0 | 11 | 3 |
| 3. čeština | 23 | 0 | 8 | 6 | 0 | 9 |
| 4. matematika | 14 | 0 | 12 | 1 | 1 | 0 |
| 4. čeština | 22 | 0 | 15 | 6 | 1 | 0 |
| 4. vlastivěda + 4. přírodověda | 26 | 0 | 26 | 0 | 0 | 0 |
| 5. matematika | 12 | 0 | 3 | 2 | 3 | 4 |
| 5. čeština | 22 | 0 | 19 | 2 | 1 | 0 |
| 5. vlastivěda | 13 | 0 | 12 | 0 | 1 | 0 |
| 5. přírodověda | 16 | 0 | 16 | 0 | 0 | 0 |
| 6. fyzika + 6. dejepis | 11 | 0 | 8 | 1 | 2 | 0 |

## Co vidí děti už teď (priorita)

- Brána FAIL: `g2-mat-mereni-casu`, `g2-mat-mereni-delky`, skupiny dě/tě/ně (2. čj).
- `g3-mat-tabulky-diagramy`: nápověda „Sečti čas…“ má být „odečti“ (~100 úloh).
- `g2-mat-bod-primka-usecka`: „Bod leží na přímce. Je to pravda?“ není jednoznačné.

## Témata k opravě

### 2. matematika + 2. čeština

- 🔴 přepis `g2-mat-scitani-odcitani-100` (src/content/grade-2/matematika/scitaniAOdcitaniDo100.ts, unikátních 9/10/7) — low_variety 3, missing_hints 26, missing_feedback 26
- 🔴 přepis `g2-mat-ciselna-osa-100` (src/content/grade-2/matematika/ciselnaOsaDo100.ts, unikátních 7/7/7) — low_variety 3, missing_hints 21, missing_feedback 21
- 🔴 přepis `g2-mat-cteni-zapis-100` (src/content/grade-2/matematika/cteniZapisPorovnavaniCiselDo100.ts, unikátních 7/7/7) — low_variety 3, missing_hints 21, missing_feedback 21
- 🔴 přepis `g2-mat-nasobeni-opakovane` (src/content/grade-2/matematika/nasobeniJakoOpakovaneScitani.ts, unikátních 10/10/8) — low_variety 3, missing_hints 28, missing_feedback 28
- 🟠 úprava `g2-mat-nasobilka-2345` (src/content/grade-2/matematika/nasobilka2345.ts, unikátních 18/18/36) — missing_hints 36, hint_progression 36, missing_feedback 72. _Variabilita stačí; chybí druhá nápověda a feedback, L3 nápovědy nejsou odstupňované._
- 🔴 přepis `g2-mat-vztah-nasobeni-deleni` (src/content/grade-2/matematika/vztahNasobieniADeleni.ts, unikátních 9/9/9) — low_variety 3, missing_hints 18, hint_duplicate 9, hint_progression 9, missing_feedback 27
- 🔴 přepis `g2-mat-slovni-ulohy-100` (src/content/grade-2/matematika/slovniUlohyDo100.ts, unikátních 10/18/10) — low_variety 2, missing_hints 38, missing_feedback 38
- 🔴 přepis `g2-mat-jednotky` (src/content/grade-2/matematika/jednotkyDlkyHmotnostiObjemu.ts, unikátních 10/10/12) — low_variety 2, missing_hints 32, missing_feedback 32
- 🔴 přepis `g2-mat-mereni-casu` (src/content/grade-2/matematika/mereniCasu.ts, unikátních 8/10/10) — hint_leak ⛔ 1, low_variety 3, missing_hints 28, missing_feedback 28. _Detektor hint leak spustil klíč ve znění otázky (výběr ze dvou), ne samotná nápověda ('Kolik sekund má 1 minuta?'). Brána ale selže, dokud se to nepřeformuluje._
- 🔴 přepis `g2-mat-posloupnosti` (src/content/grade-2/matematika/posloupnostiCisel.ts, unikátních 7/7/7) — low_variety 3, missing_hints 21, missing_feedback 21
- 🟠 úprava `g2-mat-tabulky` (src/content/grade-2/matematika/tabulkyAJednoduchaSchema.ts, unikátních 94/99/100) — missing_hints 293, missing_feedback 293. _Parametrický generátor: hints[0] obsahuje data úlohy. Hints[1] a optionFeedback stačí doplnit do šablon (4–5 míst). Fallback hint na ř. 201 je generický._
- 🔴 přepis `g2-mat-bod-primka-usecka` (src/content/grade-2/matematika/bodPrimkaUsecka.ts, unikátních 9/9/10) — low_variety 3, missing_hints 28, missing_feedback 28, format 20, factual_error 1. _Téměř vše jsou úlohy Ano/Ne i na L2/L3. 'Bod leží na přímce. Je to pravda?' (klíč: pravda) je bez obrázku věcně sporné._
- 🔴 přepis `g2-mat-mereni-delky` (src/content/grade-2/matematika/mereniDelkyUsecky.ts, unikátních 8/11/12) — hint_leak ⛔ 1, low_variety 2, missing_hints 31, missing_feedback 31. _Hint leak na L3 je způsobený tím, že klíč '5 cm' stojí ve znění otázky (výběr ze dvou); nápověda sama neprozrazuje. Brána přesto selže._
- 🔴 přepis `g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach` (src/content/grade-2/cjl/pravopisIY.ts, unikátních 8/8/8) — low_variety 3, hint_duplicate 11, missing_hints 8, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-skupiny-de-te-ne-be-pe-ve-me` (src/content/grade-2/cjl/skupinyDeTeNe.ts, unikátních 8/8/8) — hint_leak ⛔ 1, low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-slabika-rozdeleni-na-slabiky` (src/content/grade-2/cjl/slabiky.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-druhy-vet-oznamovaci-tazaci-rozkazovaci` (src/content/grade-2/cjl/druhyVet.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-tvaroslovi-slovesa-rozliseni-slovesneho-druhu` (src/content/grade-2/cjl/slovesa.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-tvaroslovi-vlastni-jmena-velke-pismeno` (src/content/grade-2/cjl/vlastniJmena.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-slovni-zasoba-slova-protikladna-a-souznacna` (src/content/grade-2/cjl/slovaProtikladna.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-slovni-zasoba-slova-nadrazena-a-podrazena` (src/content/grade-2/cjl/slovaNadrazena.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-tvaroslovi-abeceda-a-razeni` (src/content/grade-2/cjl/abecedaRazeni.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-literarni-vychova-literarni-zanry-pohadka-rikanky-basen-hadanka` (src/content/grade-2/cjl/pohadkaRikankaBasen.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-literarni-vychova-prace-s-knihou-spisovatel-ilustrator-knihovna` (src/content/grade-2/cjl/spisovatelKniha.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-orientace-v-textu-veta-odstavec-nadpis` (src/content/grade-2/cjl/orientaceVTextu.ts, unikátních 8/8/8) — low_variety 3, missing_hints 24, missing_feedback 24
- 🔴 přepis `g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-deleni-slov-na-konci-radku` (src/content/grade-2/cjl/deleniSlovNaKonciRadku.ts, unikátních 10/10/9) — low_variety 3, missing_hints 29, missing_feedback 29

### 2. prvouka

- 🟠 úprava `g2-prv-hodiny-cas` (src/content/grade-2/prvouka/hodinyKalendarCas.ts, unikátních 14/14/12) — missing_feedback 40, missing_hints 29, hint_progression 8. _Brána čistá. Klíč ve znění jen u srovnávacích otázek „X, nebo Y?“, tam je nevyhnutelný. Nápovědy jsou unikátní pro úlohu, chybí druhá nápověda a optionFeedback._
- 🟠 úprava `g2-prv-tradice` (src/content/grade-2/prvouka/tradiceAZvyky.ts, unikátních 14/13/13) — missing_feedback 40, missing_hints 40. _Všechny úlohy mají jen jednu nápovědu a žádný feedback. Klíč ve znění jen u srovnávacích otázek na pořadí svátků._
- 🟠 úprava `g2-prv-sousedstvi` (src/content/grade-2/prvouka/lideVOkoliKamaradstvi.ts, unikátních 14/14/14) — missing_feedback 42, missing_hints 18, hint_progression 18. _Brána hlásí 1× sentence_complexity (otázka má 14 slov) jen k revizi._
- 🟠 úprava `g2-prv-povolani` (src/content/grade-2/prvouka/povolaniPraceDospelych.ts, unikátních 16/14/14) — missing_feedback 44, missing_hints 44. _U žádné úlohy není hints[1] ani optionFeedback._
- 🟠 úprava `g2-prv-chovani` (src/content/grade-2/prvouka/pravidlaSlusnehoChovani.ts, unikátních 14/13/12) — missing_feedback 39, missing_hints 16, hint_progression 21. _Brána hlásí 1× sentence_complexity. L3 má přesně 12 úloh._
- 🟠 úprava `g2-prv-nase-obec` (src/content/grade-2/prvouka/naseObecNazev.ts, unikátních 15/14/14) — missing_feedback 43, missing_hints 43, other 1. _Distraktor se textově překrývá s klíčem, chybný od správného může odlišit jen jedno slovo. Ověřit, jestli je volba jednoznačná._
- 🟠 úprava `g2-prv-orientace-obec` (src/content/grade-2/prvouka/orientaceVObci.ts, unikátních 12/12/12) — missing_feedback 36, missing_hints 24, hint_progression 12. _Každá úroveň má přesně 12 úloh, tedy hraniční minimum._
- 🟠 úprava `g2-prv-plan-obce` (src/content/grade-2/prvouka/planObceOkoliSkoly.ts, unikátních 14/12/12) — missing_feedback 38, hint_progression 23. _Obě nápovědy jsou všude, ale velká často není delší. Brána hlásí sentence_complexity (15 slov) a hint_progression jen k revizi._
- 🟠 úprava `g2-prv-zvirata-uzitek` (src/content/grade-2/prvouka/domaciHospodarskaZvirata.ts, unikátních 16/14/14) — missing_feedback 44, missing_hints 44. _Banka s jednou unikátní nápovědou na úlohu (hints: ["…"]). Chybí hints[1] a optionFeedback._
- 🟠 úprava `g2-prv-jaro-rostliny-mladata` (src/content/grade-2/prvouka/kvetouciRostlinyMladata.ts, unikátních 15/12/12) — missing_feedback 39, missing_hints 39. _Klíč ve znění jen u srovnávacích otázek na dvě jmenované rostliny. Brána hlásí 1× sentence_complexity._
- 🟠 úprava `g2-prv-jaro-leto` (src/content/grade-2/prvouka/zmenyVPrirodeJaroLeto.ts, unikátních 14/12/12) — missing_feedback 38, missing_hints 18, hint_progression 14
- 🟠 úprava `g2-prv-zima-zvirata` (src/content/grade-2/prvouka/zazimovaniZvirat.ts, unikátních 15/14/14) — missing_feedback 43, missing_hints 18, hint_progression 23
- 🟠 úprava `g2-prv-podzim-zima` (src/content/grade-2/prvouka/zmenyVPrirodePodzimZima.ts, unikátních 16/12/12) — missing_feedback 40, missing_hints 20, hint_progression 16
- 🟠 úprava `g2-prv-prvni-pomoc` (src/content/grade-2/prvouka/drobnaPoraneniTisnoveLinky.ts, unikátních 13/12/13) — missing_feedback 38, missing_hints 13, hint_progression 20. _Všech 13 úloh L1 má jen jednu nápovědu. U L2/L3 obě nápovědy jsou, ale velká často není delší._
- 🟠 úprava `g2-prv-zdravy-styl` (src/content/grade-2/prvouka/zdravyZivotniStyl.ts, unikátních 15/12/13) — missing_feedback 40, missing_hints 19, hint_progression 15, format 4. _Na L3 jsou binární úlohy Ano/Ne (pravidla je povolují jen na L1). Ano/Ne ale není jediný formát L3, proto jen real, ne rewrite._

### 3. matematika

- 🔴 přepis `g3-mat-cisla-do-1000` (src/content/grade-3/matematika/cteniZapisPorovnavaniCiselDo1000.ts, unikátních 187/191/198) — hint_duplicate 426, missing_feedback 576
- 🟠 úprava `g3-mat-zaokrouhlovani` (src/content/grade-3/matematika/zaokrouhlovaniNaDesitkyAStovky.ts, unikátních 175/183/191) — key_in_question 48, missing_feedback 549, hint_duplicate 2. _L1 generuje čísla už zaokrouhlená (320 na desítky = 320) – triviální úloha, klíč ve znění._
- 🔴 přepis `g3-mat-scitani-odcitani-1000` (src/content/grade-3/matematika/scitaniAOdcitaniDo1000.ts, unikátních 200/200/200) — hint_duplicate 600, missing_feedback 600
- 🟠 úprava `g3-mat-nasobilka-6-10` (src/content/grade-3/matematika/nasobilka6789a10.ts, unikátních 20/20/51) — missing_feedback 91, hint_progression 42
- 🟠 úprava `g3-mat-nasobeni-deleni-mala-nasobilka` (src/content/grade-3/matematika/nasobeniADeleniMalaNasobilka.ts, unikátních 36/54/72) — hint_duplicate 30. _Nápověda 'Hledáš chybějící číslo v násobilce: dělitel × ? = …' se opakuje 2–4x mezi úlohami se stejnými čísly._
- 🔴 přepis `g3-mat-tabulky-diagramy` (src/content/grade-3/matematika/tabulkyJizdniRadyDiagramy.ts, unikátních 100/100/100) — missing_hints 300, missing_feedback 300, language_error 100, format 1. _Každá úloha má jen 1 nápovědu (šablonovou), žádný optionFeedback. Nápověda u celkové doby jízdy říká 'Sečti čas odjezdu … (rozdíl …)' – vnitřně protichůdné._
- 🔴 přepis `g3-mat-slovni-ulohy-dve-operace` (src/content/grade-3/matematika/slovniUlohySeDvemaOperacemi.ts, unikátních 191/194/195) — hint_duplicate 580, missing_feedback 580
- 🔴 přepis `g3-mat-rysovani-usecky` (src/content/grade-3/matematika/rysovaaniUseckyODaneDelce.ts, unikátních 8/8/12) — low_variety 28, missing_feedback 28, missing_explanation 28, hint_progression 26, key_in_question 1, hint_duplicate 2
- 🔴 přepis `g3-mat-kruznice-kruh` (src/content/grade-3/matematika/kruznicaKruhRysovani.ts, unikátních 8/9/12) — low_variety 29, hint_duplicate 27, missing_feedback 29, missing_explanation 29, key_in_question 1, hint_progression 1
- 🔴 přepis `g3-mat-obvod-trojuhelniku-ctverce-obdelniku` (src/content/grade-3/matematika/obvodTrojuhelnikuCtverceObdelniku.ts, unikátních 100/132/137) — hint_duplicate 185, missing_feedback 369

### 3. prvouka

- 🟠 úprava `g3-prvouka-lide-a-cas-minulost-a-soucasnost-minulost-naseho-regionu-povesti` (src/content/grade-3/prvouka/minulostRegionuPovesti.ts, unikátních 13/12/12) — missing_feedback 37, hint_progression 30. _Gate PASS; no file in the batch has optionFeedback. The two key-in-question hits are the 'Kde spíš najdeš…' either-or questions._
- 🟠 úprava `g3-prvouka-lide-a-cas-minulost-a-soucasnost-casova-primka-generace-v-rodine` (src/content/grade-3/prvouka/casovaPrimkaGenerace.ts, unikátních 14/14/14) — missing_feedback 42, hint_progression 35
- 🟠 úprava `g3-prvouka-lide-kolem-nas-souziti-a-komunikace-komunikace-jednani-s-neznamymi-lidmi-bezpecnost` (src/content/grade-3/prvouka/komunikaceBezpecnost.ts, unikátních 13/13/12) — missing_feedback 38, hint_progression 29, hint_duplicate 4
- 🟠 úprava `g3-prvouka-lide-kolem-nas-souziti-a-komunikace-vztahy-mezi-lidmi-reseni-konfliktu` (src/content/grade-3/prvouka/vztahyKonflikty.ts, unikátních 13/14/12) — missing_feedback 39, hint_progression 27
- 🟠 úprava `g3-prvouka-misto-kde-zijeme-nase-vlast-kraje-a-regiony-cr-uvod-nas-region` (src/content/grade-3/prvouka/krajeRegionyCr.ts, unikátních 13/14/14) — missing_feedback 41, hint_progression 31, key_in_question 4, hint_duplicate 7, format 1. _Four 'krajské město X kraje' L2 questions carry the key in the wording, and the hint 'Krajské město má stejné jméno jako kraj.' (shared by 7 tasks) gives it away outright._
- 🟠 úprava `g3-prvouka-misto-kde-zijeme-nase-vlast-mapa-svetove-strany-plan-a-mapa-kompas` (src/content/grade-3/prvouka/mapaStranySveta.ts, unikátních 13/16/14) — missing_feedback 43, hint_progression 30
- 🟠 úprava `g3-prvouka-misto-kde-zijeme-nase-vlast-ceska-republika-hlavni-mesto-statni-symboly` (src/content/grade-3/prvouka/crSymboly.ts, unikátních 14/13/13) — missing_feedback 40, hint_progression 26, hint_duplicate 3
- 🔴 přepis `g3-prvouka-rozmanitost-prirody-ekosystemy-pole-louka-les-voda-jednoduche-ekosystemy` (src/content/grade-3/prvouka/ekosystemyPoleLoukaLes.ts, unikátních 11/8/9) — low_variety 3, missing_hints 7, missing_feedback 28, hint_progression 14
- 🟠 úprava `g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-skupiny-zivocichu-savci-ptaci-ryby-plazi-obojzivelnici-hmyz` (src/content/grade-3/prvouka/skupinyZivocichu.ts, unikátních 12/12/12) — missing_explanation 36, hint_progression 20, hint_duplicate 2. _The gate's difficulty_progression flag ('identical output L1-3') is a heuristic false positive. gen() uses separate POOL_L1/L2/L3; every task is a match task sharing one question text, and only the pairs differ. Whether L3 is actually harder than L1 still needs a manual look._
- 🔴 přepis `g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-stavba-rostlin-koren-stonek-list-kvet-plod` (src/content/grade-3/prvouka/stavbaRostlin.ts, unikátních 11/10/10) — low_variety 3, missing_feedback 31, hint_progression 26
- 🟠 úprava `g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-rozdily-mezi-zivou-a-nezivou-prirodou` (src/content/grade-3/prvouka/zivaNezivaPrivroda.ts, unikátních 12/12/12) — missing_feedback 36, hint_progression 22, hint_duplicate 2
- 🟠 úprava `g3-prvouka-rozmanitost-prirody-ziva-a-neziva-priroda-voda-vzduch-puda-vyznam-pro-zivot` (src/content/grade-3/prvouka/vodaVzduchPuda.ts, unikátních 12/12/12) — missing_feedback 36, hint_progression 22
- 🟠 úprava `g3-prvouka-clovek-a-jeho-zdravi-bezpecnost-a-prvni-pomoc-mimoradne-udalosti-pozar-povoden-chovani-pri-ohrozeni` (src/content/grade-3/prvouka/mimoradneUdalosti.ts, unikátních 13/13/12) — missing_feedback 38, hint_progression 34
- 🔴 přepis `g3-prvouka-clovek-a-jeho-zdravi-lidske-telo-stavba-lidskeho-tela-kostra-svaly-uvod-zdravi-a-nemoc` (src/content/grade-3/prvouka/stavbaTelaaZdravi.ts, unikátních 10/10/10) — low_variety 3, missing_feedback 30, hint_progression 21

### 3. čeština

- 🔴 přepis `g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna` (src/content/grade-3/cjl/slovaJednoznacnaMnohoznacna.ts, unikátních 15/15/10) — missing_feedback 40, hint_duplicate 39, low_variety 10, hint_progression 1. _Chybí feedback u všech úloh a jedna malá nápověda je sdílená pro 39 úloh; L3 má jen 10 úloh._
- 🔴 přepis `g3-cjl-velka-pismena` (src/content/grade-3/cjl/velkaPismenaVlastniJmena.ts, unikátních 9/9/10) — missing_feedback 28, hint_duplicate 26, low_variety 28, hint_progression 2. _Když úloha nemá vlastní nápovědy, doplní se šablona (ř. 109), proto je hints[0] u 26 úloh stejná. Duplicity lišící se jen velikostí písmen jsou u tohoto tématu záměrné._
- 🔴 přepis `g3-cjl-spojovani-vet-spojkami` (src/content/grade-3/cjl/spojovaniVetSpojkami.ts, unikátních 10/9/10) — missing_feedback 29, hint_duplicate 28, low_variety 29, hint_progression 1
- 🔴 přepis `g3-cjl-veta-jednoducha-souveti` (src/content/grade-3/cjl/vetaJednoduchaSouveti.ts, unikátních 8/8/10) — missing_feedback 26, hint_progression 24, hint_duplicate 20, low_variety 26, other 3
- 🔴 přepis `g3-cjl-slovesa-osoba-cislo-cas` (src/content/grade-3/cjl/slovesaOsobaCisloCas.ts, unikátních 9/9/10) — missing_feedback 29, hint_duplicate 27, low_variety 28, hint_progression 1
- 🔴 přepis `g3-cjl-plynule-cteni-porozumeni` (src/content/grade-3/cjl/plynuleCteniSPorozumenim.ts, unikátních 12/12/12) — missing_feedback 36, hint_duplicate 36, hint_progression 36. _Jen 6 textů (2 na úroveň), otázky se vzorkují. Malá nápověda je obecná šablona u všech 36 úloh, feedback chybí všude._
- 🔴 přepis `g3-cjl-pohadka-povidka-basen-bajka` (src/content/grade-3/cjl/pohadkaPovídkaBasenBajka.ts, unikátních 8/8/10) — missing_feedback 26, hint_duplicate 22, low_variety 26
- 🔴 přepis `g3-cjl-proza-verse` (src/content/grade-3/cjl/prozaAVerseRozliseni.ts, unikátních 8/8/10) — missing_feedback 26, hint_duplicate 23, low_variety 26, hint_progression 1
- 🔴 přepis `g3-cjl-vers-rym-prirovnani` (src/content/grade-3/cjl/versRymPrirovnani.ts, unikátních 10/10/10) — missing_feedback 30, hint_duplicate 30, hint_progression 27, low_variety 30

### 4. matematika

- 🟠 úprava `g4-mat-tabulky-diagramy-4` (src/content/grade-4/matematika/tabulkyDiagramySloupcovyKruhovy.ts, unikátních 200/200/200) — hint_duplicate 46. _hints[0] in cteniDiagramu (L1 ■=2, L2 ■=5) uses only the row name + its squares, so different diagrams with the same row repeat it; adding the scale or the dataset name to hint[0] fixes it. Key in question = nejvic() select_one, where the options are the table rows (by design). Audit flagged 30-word sentence_complexity because the diagram rows count as words._

### 4. čeština

- 🟠 úprava `g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika` (src/content/grade-4/cjl/hlavniPostavyAJejichCharakteristika.ts, unikátních 13/13/13) — key_in_question 1. _Na L3 je klíč „bouřka“ doslova ve znění, takže úloha nic neprověřuje. Úlohu je třeba přeformulovat (ř. 201)._

### 5. matematika

- 🟠 úprava `g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky` (src/content/grade-5/matematika/konstrukceTrojuhelnikuKolmiceRovnobezky.ts, unikátních 13/150/120) — hint_duplicate 19, low_variety 13. _L1 jen 13 unikátních úloh – těsně nad limitem 12._
- 🔴 přepis `g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu` (src/content/grade-5/matematika/obsahObrazceVeCtvercoveSitiJednotkyObsahu.ts, unikátních 115/144/119) — hint_duplicate 200. _Nápovědy z šablon nesou jen část dat (jen stranu čtverce c, jen počet v řadě), proto se opakují až 20x. Key-in-question L3 je falešně pozitivní: klíč „5 cm“ je podřetězcem „25 cm²“._
- 🔴 přepis `g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy` (src/content/grade-5/matematika/osovaSoumernostSestrojeniObrazuUrceniOsy.ts, unikátních 13/32/58) — hint_duplicate 58, hint_progression 4, low_variety 45. _Nápověda obsahuje jen vzdálenost bodu od osy (6 hodnot → 9–10 úloh na každou). Malá variabilita: L1 13 a L2 32 unikátních úloh._
- 🟠 úprava `g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-dvoucifernym-delitelem` (src/content/grade-5/matematika/pisemneDeleniDvoucifernymDelitelem.ts, unikátních 133/149/150) — hint_progression 38, hint_duplicate 34. _L3: hint[0] je parametrizovaný jen dělitelem, hint[1] není výrazně delší._
- 🟠 úprava `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-scitani-a-odcitani-desetinnych-cisel` (src/content/grade-5/matematika/scitaniAOdcitaniDesetinnychCisel.ts, unikátních 150/150/150) — hint_duplicate 6
- 🔴 přepis `g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos` (src/content/grade-5/matematika/ulohyNezavisleNaBeznychPostupechProstorovaPredstavivost.ts, unikátních 145/111/73) — hint_duplicate 95. _Statická nápověda bez dat úlohy (triko/sukně 15x). Rozdílová nápověda má jen první dva rozdíly (12x). Nápověda s vrstvou kostek se opakuje 2–3x._
- 🔴 přepis `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose` (src/content/grade-5/matematika/zapornaCislaNaCiselneOse.ts, unikátních 84/150/112) — hint_duplicate 110, hint_progression 3. _Statická nápověda „Všechna čísla jsou záporná…“ se opakuje 52x a „Na kterou stranu od nuly…“ 13x. Klíč ve znění u výčtových úloh „nejmenší/největší“ je výjimka._

### 5. čeština

- 🟠 úprava `g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova` (src/content/grade-5/cjl/slovaJednoznacnaMnohoznacnaVicevyznamova.ts, unikátních 18/13/12) — hint_duplicate 2. _hints[0] je šablona s náhodně vybranými jednoznačnými slovy (shuffle), při shodě výběru vznikne stejná malá nápověda u dvou úloh; navázat nápovědu na klíčové slovo úlohy._

### 5. vlastivěda

- 🟠 úprava `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne` (src/content/grade-5/vlastiveda/evropskeStatyAEuSousedniZemeCrPodrobne.ts, unikátních 131/150/150) — hint_duplicate 4. _hints[0] matching úloh generuje sdílený helper v src/content/grade-5/_shared.ts:183 jen z levých stran; dvě sady se stejnými levými stranami (jiné pořadí/pravé strany) dostanou stejnou nápovědu. Oprava: dedup sad se stejnou množinou levých stran nebo zapojit do h0 i data pravé strany._

### 6. fyzika + 6. dejepis

- 🟠 úprava `g6-dej-periodizace-letopocet-6` (src/content/grade-6/dejepis/periodizaceLetopocet.ts, unikátních 119/80/81) — hint_duplicate 4. _hints[0] u uloh 'nejstarsi' sklada jen dva letopocty (ostatni[0..1], resp. nl+pr), takze dve ulohy se stejnou dvojici a jinou treti moznosti sdileji malou napovedu; hints[1] je u techto sablon staticky text. Staci zahrnout do hints[0] vsechny moznosti._
- 🟠 úprava `g6-dej-pomocne-vedy-historicke-6` (src/content/grade-6/dejepis/pomocneVedyHistoricke.ts, unikátních 115/120/120) — hint_duplicate 2. _hints[0] se sklada z ukazky nalezu (podmnozina); dve ulohy se stejnou ukazkou sdileji malou napovedu. hints[1] je sdileny text pravidla (RULE/GLOSSARY) podle urovne._
