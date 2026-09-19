✅ Auditováno 2026-09-11 (CONTENT_AUTHORING §0) a zamrazeno. Ročník je od 2026-09-11 otevřený žákům (`ACTIVE_GRADES`) — viz `PROJECT_STATUS.md` §6, session 37.

# Grade 6 — STATUS (pilot 2. stupně)

> Hotovo (2026-09-19): **Fyzika 13/13, Dějepis 24/24, Matematika 12/12,
> Přírodopis 22/22, Zeměpis 6/18** — 77 ze 117.
> Zbývá zbytek zeměpisu (12), čeština, výchova k občanství (pořadí v
> `docs/GRADE_6_COMPLETION_PLAN.md`). `GRADE_6_TOPICS` obsahuje jen hotová témata.

## Fyzika (13 RVP podtémat)

### Měření fyzikálních veličin
- [x] **Délka – jednotky, měření délky** → `fyzika/mereniDelky.ts` ✅ (zlatý vzor: L1→L3, chybový model, optionFeedback)
- [x] **Hmotnost – jednotky, vážení** → `fyzika/mereniHmotnosti.ts` ✅ (mg/g/dkg/kg/t, recept/balení)
- [x] **Objem – jednotky, měření odměrným válcem** → `fyzika/mereniObjemu.ts` ✅ (ml/l/dl/cm³/dm³ + ekvivalence cm³=ml)
- [x] **Hustota – výpočet a měření** → `fyzika/hustota.ts` ✅ (vrchol: ρ=m/V, m=ρ·V, identifikace látky; chybový model = záměna vzorce)
- [x] **Teplota – jednotky, výpočty, kelviny** → `fyzika/mereniTeploty.ts` ✅ (změna teploty, rozdíl přes nulu, °C→K; chybový model = směr + nula)
- [x] **Čas – jednotky, převody, časová osa** → `fyzika/mereniCasu.ts` ✅ (h/min/s základ 60, zbytek, časová osa s přenosem; chybový model = ×100 místo ×60)

**Okruh „Měření veličin": 6/6 hotovo. ✅** Teplota a čas mají jiný charakter (teplota není násobkový převod, čas má základ 60) — vzor obstál.

> Sdílené utility převodových úloh: `fyzika/_shared.ts` (cz/pick/shuffle/buildChoiceTask).
> Společný test: `__tests__/prevodyJednotek.test.ts` (parametrizovaný přes 3 témata, 51 testů).

### Látky a tělesa
- [x] **Látka a těleso – rozlišení, vlastnosti látek** → `fyzika/latkaATeleso.ts` ✅ (pojmový vzor: L1 rozpoznání · L2 sdílená látka · L3 vlastnost látky vs. tělesa)
- [x] **Skupenství látek – pevné, kapalné, plynné** → `fyzika/skupenstviLatek.ts` ✅ (L1 skupenství při pokojové teplotě · L2 název změny z běžného děje · L3 skupenství z teploty tání a varu)
- [x] **Atomy, molekuly – úvod do mikrosvěta** → `fyzika/atomyMolekuly.ts` ✅ (L1 počet atomů ze složení · L2 částicový model na běžném jevu · L3 vlastnost látky vs. vlastnost jedné částice)
- [x] **Pohyb částic – difuze, Brownův pohyb** → `fyzika/pohybCastic.ts` ✅ (L1 teplota a rychlost děje · L2 difúze na běžné situaci vč. pevných látek · L3 Brownův pohyb jako důkaz částic)

### Elektrické vlastnosti látek
- [x] **Elektrické pole – kladný a záporný náboj** → `fyzika/elektrickyNaboj.ts` ✅ (L1 přitažení/odpuzení ze znamének · L2 mechanismus elektrování a zachování náboje · L3 nabité přitahuje i nenabité)
- [x] **Jednoduchý elektrický obvod – zdroj, vodič, spotřebič, spínač** → `fyzika/elektrickyObvod.ts` ✅ (L1 úloha součástky · L2 poteče proud tímhle zapojením? · L3 proud se nespotřebovává a co z toho plyne)
- [x] **Magnety – magnetické pole, magnetické póly Země** → `fyzika/magnety.ts` ✅ (L1 přitáhne magnet tenhle předmět · L2 póly, pole a dočasný magnet · L3 Země jako magnet a hranice analogie s nábojem)

## Matematika (12 RVP podtémat) — HOTOVO 12/12 (2026-09-16)

> Sdílené utility: `matematika/_shared.ts` (cis/uhel/rnd/buildChoiceTask → null při
> < 3 distraktorech/losUlohy/ruzneUlohy). Vše select_one, klíče u výpočtů přepočítává
> `check:keys` (desetinná čísla, dělitelnost, NSN/NSD); geometrie ověřena testy tématu.

### Číslo a proměnná
- [x] Násobení a dělení desetinných čísel → `matematika/nasobeniADeleniDesetinnychCisel.ts` ✅
- [x] Početní operace s desetinnými čísly — komplexně → `matematika/pocetniOperaceDesetinnaKomplexne.ts` ✅
- [x] Násobek, dělitel, znaky dělitelnosti → `matematika/znakyDelitelnosti.ts` ✅
- [x] Prvočísla a čísla složená, rozklad → `matematika/prvocislaRozklad.ts` ✅
- [x] Nejmenší společný násobek, největší společný dělitel → `matematika/nsnNsd.ts` ✅

### Geometrie v rovině a v prostoru
- [x] Druhy úhlů, sčítání a odčítání úhlů → `matematika/uhlyDruhyScitani.ts` ✅
- [x] Úhel — rýsování, měření úhloměrem → `matematika/uhelRysovaniMereni.ts` ✅
- [x] Trojúhelníky — druhy, vnitřní úhly, výška, těžnice → `matematika/trojuhelnikyUhlyVyskaTeznice.ts` ✅
- [x] Krychle a kvádr — síť, povrch, objem → `matematika/sitKrychleAKvadruPovrchAObjem.ts` ✅
- [x] Osová a středová souměrnost → `matematika/osovaStredovaSoumernost.ts` ✅ (bez obrázku: souřadnice ve čtvercové síti)

### Nestandardní úlohy · Práce s daty
- [x] Logické úvahy, kombinační úsudek → `matematika/logickeUvahyKombinacniUsudek.ts` ✅
- [x] Sběr a třídění dat, tabulky, diagramy → `matematika/tabulkyADiagramy.ts` ✅ (tabulka v textu zadání)

## Přírodopis (22 RVP podtémat) — HOTOVO 22/22 (2026-09-16)

> Sdílené utility: `prirodopis/_shared.ts` (buildChoiceTask → null při < 3
> distraktorech, buildOrderTask, buildCategorizeTask, losUlohy). Distraktor =
> typická miskoncepce (pavouk je hmyz, antibiotika na virózu…). Vše select_one,
> kromě `vyvojZivotaGeologickaObdobi` a `hmyzStavbaTelaDruhyVyvoj` (categorize).

- **Obecná biologie:** `vznikZemePodminkyProZivot`, `vyvojZivotaGeologickaObdobi`,
  `taxonomickeSkupiny`, `mikroskop`, `stavbaBunky` ✅
- **Nebuněční a bakterie:** `viryStavbaVyznam`, `bakterie`, `siniceVyskytVyznam`,
  `prvociZastupciNemoci` ✅
- **Biologie hub:** `houbyStavbaVyziva`, `jedleAJedovateHouby`, `lisejnikySymbioza` ✅
- **Biologie rostlin:** `rasyStavbaZastupciVyznam`, `mechorostyZastupciVyznam`,
  `kapradorosty` ✅
- **Biologie živočichů:** `zahavciNezmarMeduzaKoraly`, `plostenciHlisti`,
  `mekkysiPlziMlziHlavonozci`, `krouzkovciZizalaPijavka`,
  `pavoukovciPavouciStiriKlistata`, `korysi`, `hmyzStavbaTelaDruhyVyvoj` ✅

## Zeměpis (18 RVP podtémat) — 6/18 (2026-09-19)

> Sdílené utility: `zemepis/_shared.ts` (sirka/delka/meritko/cas/cis/rnd,
> buildChoiceTask → null při < 3 distraktorech, buildOrderTask,
> buildCategorizeTask, losUlohy). Výpočetní úloha se pozná podle
> `solutionSteps` a dostane jinou velkou nápovědu. K obsahu nejsou mapy, takže
> každé zadání musí jít vyřešit ze slov. Klíče měřítka, časových pásem
> a souřadnic přepočítává `check:keys`.

- **Mapa a glóbus:** `globusMapaMeritko`, `mapoveZnackyOrientace`,
  `zemepisnaSit` ✅
- **Vesmír a Země:** `vesmirSlunecniSoustava`, `tvarAPohybyZeme`,
  `rocniDobyCasovaPasma` ✅
- [ ] Krajinné sféry — atmosféra, hydrosféra, litosféra, pedosféra a biosféra (4)
- [ ] Polární oblasti — Arktida, Antarktida (2)
- [ ] Afrika — poloha a povrch, přírodní oblasti, obyvatelstvo a hospodářství (3)
- [ ] Austrálie a Oceánie — poloha a klima, příroda, obyvatelstvo a ostrovy (3)

## Dějepis (24 RVP podtémat) — HOTOVO 24/24 (2026-09-15)

> ⚠️ Seznam níž je z doby pilotu (4/24) a zbytek nepokrývá. Aktuální stav
> je v `index.ts` a `navigation.ts`; detail dávek v `PROJECT_STATUS.md` §6, session 48.

> Sdílené utility faktického vzoru: `dejepis/_shared.ts` (pick/shuffle/pickN/buildChoiceTask).
> Distraktor = typický HISTORICKÝ omyl (záměna éry, „menší = dřív" u př. n. l.,
> zapomenutý rok 0), ne numerický posun.

### Úvod do dějepisu
- [x] **Periodizace dějin, časová přímka, letopočet** → `dejepis/periodizaceLetopocet.ts` ✅
      (ZLATÝ FAKTICKÝ VZOR — most z výpočetní fyziky: L1 určení století → L2 řazení/rozdíl
      př. n. l. → L3 přelom letopočtu „rok 0 neexistuje"; chybový model + optionFeedback;
      blind-solve judge 18/18, konvence X+Y−1 ověřena). select_one (nemíchá typy).
- [x] **Historické prameny — hmotné, písemné, obrazové** → `dejepis/historickePrameny.ts` ✅
      (categorize — 3. ověřovaný typ; práce se zdrojem. Rozlišovací pravidlo „podle obsahu,
      ne materiálu"; chybový model v L3 = klamavé prameny (klínové písmo na hliněné tabulce
      = písemný, ne hmotný). Nezávislý klasifikátor v testu. ⏳ judge zbývá.) select_one nepoužit.
- [x] **Pomocné vědy historické — archeologie, paleografie, numismatika, heraldika** → `dejepis/pomocneVedyHistoricke.ts` ✅
      (categorize — přiřazení nálezu k vědě dle PŘEDMĚTU zkoumání. **Vytvořeno přes
      `author-batch` pipeline** (dvojí optika): 7 vad nalezeno a opraveno žákem/pedagogem/
      fakt-expertem. L3 chybový model = klamavé nálezy (mince s portrétem → numismatika,
      ne heraldika). Autor sám ošetřil hranice oborů (sfragistika/epigrafika vyloučeny).
      16/16 testů se sofistikovaným klasifikátorem, brána 0 PASS, tsc 0.)
- [x] **Co je dějepis — význam studia minulosti** → `dejepis/coJeDejepis.ts` ✅
      (select_one — rozlišení DĚJINY (události) × DĚJEPIS (věda) + co historik zkoumá +
      proč studovat minulost. **Author-batch pipeline** (re-run po pádu, opravený workflow):
      2 vady opraveny dvojí optikou, agenti respektovali zákaz editace sdílených docs.
      Chybový model = miskoncepce (záměna pojmů, „historik věští budoucnost", „jen války/data").
      L1 definice → L2 aplikace na činnost → L3 hraniční případy + smysl studia. Nezávislý
      solver odvozuje klíč ze sémantiky (ne z correctAnswer), 22/22, brána 0 PASS, tsc 0.)

**Okruh „Úvod do dějepisu" KOMPLETNÍ (4/4).** ✅

### Pravěk
- [x] **Doba kamenná / periodizace pravěku** → `dejepis/dobaKamennaPeriodizace.ts` ✅
      (drag_order chronologie — 2. ověřovaný typ pilotu; gradace přes počet položek
      3→4→5, disjunktní znění L1≠L3; chronologický rank-solver v testu + judge
      ověřil všech 12 pořadí a fakta). `g6-dej-doba-kamenna-periodizace-6`.
- [ ] Vývoj člověka — hominizace, neolitická revoluce, bronz/železo (zbytek oblasti)
- [ ] Pravěk na našem území (lovci mamutů, Věstonická venuše, Keltové/Germáni/Slované)

### Starověk
- [ ] Mezopotámie a Egypt · Indie a Čína · Antika Řecko · Antika Řím (13 podtémat)

**Pilotní stav:** 4/24. Okruh **Úvod do dějepisu**: 3/4 (periodizace, prameny, pomocné vědy);
zbývá „Co je dějepis" (pipeline pokus selhal — re-run). Typy: select_one + drag_order + categorize ověřeny.
⏳ Téma 3 (prameny): adversariální judge zbývá doplnit.
