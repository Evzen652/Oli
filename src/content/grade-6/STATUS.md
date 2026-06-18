⏸️ PARKOVÁNO — mimo aktivní scope (2026-06-18). Nerozšiřovat.

# Grade 6 — STATUS (pilot 2. stupně)

> Pilot: **Fyzika** (výpočetní vzor) + **Dějepis** (faktický vzor).
> Ostatní předměty (čeština, matematika, zeměpis, přírodopis, výchova k občanství)
> až po pilotu. `GRADE_6_TOPICS` obsahuje jen hotová témata.

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
- [ ] Látka a těleso – rozlišení, vlastnosti látek
- [ ] Skupenství látek – pevné, kapalné, plynné
- [ ] Atomy, molekuly – úvod do mikrosvěta
- [ ] Pohyb částic – difuze, Brownův pohyb

### Elektrické vlastnosti látek
- [ ] Elektrické pole – kladný a záporný náboj
- [ ] Jednoduchý elektrický obvod – zdroj, vodič, spotřebič, spínač
- [ ] Magnety – magnetické pole, magnetické póly Země

## Dějepis (24 RVP podtémat)

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
