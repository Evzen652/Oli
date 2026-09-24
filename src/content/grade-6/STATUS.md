✅ Auditováno 2026-09-11 (CONTENT_AUTHORING §0) a zamrazeno. Ročník je od 2026-09-11 otevřený žákům (`ACTIVE_GRADES`) — viz `PROJECT_STATUS.md` §6, session 37.

# Grade 6 — STATUS (pilot 2. stupně)

> Hotovo (2026-09-25): **Fyzika 13/13, Dějepis 24/24, Matematika 12/12,
> Přírodopis 22/22, Zeměpis 18/18, Čeština 20/20, Výchova k občanství 8/8**
> — **117 ze 117. Šestý ročník KOMPLETNÍ.** S ročníky 1–5 hotový celý
> obsahový plán aplikace. `GRADE_6_TOPICS` obsahuje jen hotová témata.

## Čeština (20 RVP podtémat) — 20/20 HOTOVO (2026-09-23)

> Sdílené utility: `cjl/_shared.ts` (buildChoiceTask → null při < 3 distraktorech,
> buildOrderTask, buildCategorizeTask, losUlohy, ruzneUlohy; nápovědy o jazyce).
> Id `g6-cjl-<kebab>-6`, subject `"čeština"`. Navazuje na `grade-4/cjl` a `grade-5/cjl`.

### Jazyková výchova — Tvarosloví
- [x] Opakování slovních druhů – ohebné, neohebné → `cjl/opakovaniSlovnichDruhuOhebneNeohebne.ts` ✅ (L3: slovní druh podle věty — večer/kolem/vedle/blízko; stupňování není ohýbání)
- [x] Podstatná jména – skloňování, mluvnické kategorie → `cjl/podstatnaJmenaSklonovaniMluvnickeKategorie.ts` ✅ (L2 vzor + úplné určení · L3 pomnožná jména, tvar → 1. pád + vzor)
- [x] Slovesa – mluvnické kategorie, slovesné třídy a vzory → `cjl/slovesaTridyAVzory.ts` ✅ (L1 třída ze 3. osoby · L2 vzor z tvaru ve větě · L3 „které nepatří“, čas × vid)

### Jazyková výchova — Nauka o slovní zásobě
- [x] Slovní zásoba a její obohacování → `cjl/slovniZasobaAJejiObohacovani.ts` ✅ (odvozování, skládání, zkracování, přejímání, sousloví, změna významu)
- [x] Synonyma, antonyma, homonyma → `cjl/synonymaAntonymaHomonyma.ts` ✅ (L2 synonymum/antonymum podle kontextu · L3 homonymum × mnohoznačné slovo i s důvodem)

### Jazyková výchova — Skladba
- [x] Věta jednoduchá – základní a rozvíjející větné členy → `cjl/vetaJednoduchaZakladniARozvijejiciVetneCleny.ts` ✅ (L1 podmět/přísudek/předmět · L2 druhy PU, přívlastek shodný × neshodný · L3 přísudek jmenný se sponou, doplněk, podmět za slovesem)
- [x] Předmět, příslovečné určení, přívlastek, doplněk → `cjl/predmetPrislovecneUrceniPrivlastekDoplnek.ts` ✅ (L2 pádová otázka předmětu, druh PU · L3 doplněk × přívlastek, PU účelu a míry)

### Jazyková výchova — Zvuková stránka jazyka (bez zvuku — vše z psaného textu)
- [x] Přízvuk, intonace, frázování → `cjl/prizvukIntonaceFrazovani.ts` ✅ (přízvuk na 1. slabice i s předložkou, takty, melodie otázek, pauza mění smysl, větný důraz)
- [x] Spisovná výslovnost, modulace souvislé řeči → `cjl/spisovnaVyslovnostModulaceSouvisleReci.ts` ✅ (spodoba znělosti v přepisu, ď/ť/ň, mě/bě, přednes podle situace)

### Komunikační a slohová výchova — Slohová výchova
- [x] Dopis soukromý a úřední → `cjl/dopisSoukromyAUredni.ts` ✅ (části dopisu, oslovení a rozloučení podle adresáta, oprava formulace)
- [x] Popis prostý, odborný, umělecký → `cjl/popisProstyOdbornyUmelecky.ts` ✅ (druh popisu z ukázky, spojení vhodné pro daný druh, věta porušující styl)
- [x] Vyprávění – výstavba, kompozice, zápletka → `cjl/vypraveniVystavbaKompoziceZapletka.ts` ✅ (části kompozice, zápletka × vedlejší detail, retrospektivní postup, přesunutá věta)
- [x] Zpráva a oznámení – rozdíly → `cjl/zpravaAOznameniRozdily.ts` ✅ (co se stalo × stane, chybějící údaj, pocit ve zprávě)

### Komunikační a slohová výchova — Čtení a naslouchání
- [x] Klíčová slova, hlavní myšlenky textu → `cjl/klicovaSlovaHlavniMyslenkyTextu.ts` ✅ (klíčová slova, téma, nadpis, odbočující věta, závěr z textu)
- [x] Praktické a věcné čtení, studijní čtení → `cjl/praktickeVecneCteniStudijniCteni.ts` ✅ (jízdní řád, ceník, pravidla s podmínkou, výpisky z učebního textu)

### Literární výchova
- [x] Bajka, přísloví, pranostika → `cjl/bajkaPrisloviPranostika.ts` ✅ (útvar podle ukázky, ponaučení bajky, výklad přísloví/pranostiky)
- [x] Mýty a báje národů světa → `cjl/mytyABajeNaroduSveta.ts` ✅ (postava a kultura, ustálená spojení, funkce mýtu)
- [x] Pohádka klasická, autorská → `cjl/pohadkaKlasickaAutorska.ts` ✅ (znaky lidové × autorské pohádky, smíšené ukázky)
- [x] Pověst regionální, historická → `cjl/povestRegionalniHistoricka.ts` ✅ (místní × historická pověst, jádro pravdy, znak pověsti)
- [x] Verš, rým, přirovnání, metafora (úvod) → `cjl/versRymPrirovnaniMetaforaUvod.ts` ✅ (rýmové schéma, metafora × přirovnání, převod mezi nimi)

### Zbývá
- [ ] Literární výchova (5) — dávka 4

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

## Zeměpis (18 RVP podtémat) — HOTOVO 18/18 (2026-09-20)

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
- **Krajinné sféry:** `atmosferaPocasiPodnebi`, `hydrosferaVodaNaZemi`,
  `litosferaStavbaZemeDesky`, `pedosferaBiosfera` ✅
- **Polární oblasti:** `arktidaPolohaKlimaVyznam`, `antarktidaPolohaKlima` ✅
- **Afrika:** `afrikaPolohaPovrchVodstvoPodnebi`, `africkePrirodniOblasti`,
  `obyvatelstvoHospodarstviAfriky` ✅
- **Austrálie a Oceánie:** `australieOceaniePolohaPovrchKlima`,
  `prirodaEndemityVelkyBarierovyUtes`, `australieObyvatelstvoOstrovyOceanie` ✅

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

## Výchova k občanství (8 RVP podtémat) — 4/8 (2026-09-24)

> Nový, čistě konceptuální předmět (žádné číslo, žádné historické datum) —
> pravidla navržena samostatně na základě RVP uzlů `g6-vko-*`, viz STANDARDS
> v `.claude/workflows/author-batch.js`. Sdílené utility: `vko/_shared.ts`
> (stejná stavba jako `prirodopis/_shared.ts`, napsáno ručně předem, ne
> autorem dávky — poučení z matematiky: sdílený pomocník psaný autorem =
> jedna chyba × celá dávka). Klíčové pravidlo: **žádný hodnotový soud jako
> jediná správná odpověď u sporného tématu** (politika, náboženství jako
> pravda/nepravda, „správné" složení rodiny, „lepší" kultura); u obecní/státní
> samosprávy se ptá na ROLI/FUNKCI, nikdy nejmenuje současného držitele úřadu.

### Stát a hospodářství
- [x] Majetek a peníze — hospodaření v rodině, kapesné, šetření, plánování → `vko/majetekAPenizeHospodareniVRodine.ts` ✅ (příjem/výdaj/rozpočet/spoření, potřeba × přání, plánovaný × impulzivní nákup; žádné částky/ceny/banky)

### Člověk jako jedinec
- [x] Sebepoznání — osobní vlastnosti, schopnosti, dovednosti → `vko/sebepoznaniVlastnostiSchopnostiDovednosti.ts` ✅ (vlastnost × schopnost × dovednost, žádné hodnocení „lepší" osobnosti)

### Člověk ve společnosti — Lidská setkávání a kultura
- [x] Kultura — druhy umění, kulturní instituce, masová kultura → `vko/kulturaDruhyUmeniInstituce.ts` ✅ (muzeum/galerie/divadlo/kino/knihovna podle účelu, masová × „vysoká" kultura bez hodnocení)
- [x] Vrstevnické vztahy, kamarádství, řešení konfliktů → `vko/vrstevnickeVztahyReseniKonfliktu.ts` ✅ (naslouchání, kompromis, já-výrok, přivolání dospělého; žádný konkrétní scénář šikany, žádná nebezpečná rada)

### Člověk ve společnosti — Naše obec, region, vlast
- [x] Naše obec a region — tradice, kultura, památky → `vko/naseObecARegionTradiceKulturaPamatky.ts` ✅ (obec/kraj/starosta/zastupitelstvo jako role, ne osoba; hrad/zámek/chrám podle typu a dnešního využití)
- [x] Naše vlast — státní symboly, T. G. Masaryk, státní svátky → `vko/statniSymbolyOsobnostiSvatkyNaseVlasti.ts` ✅ (vlajka/znak/hymna, všech 7 svátků ověřeno proti zákonu č. 245/2000 Sb., žádná současná osoba ve funkci)
- [x] Rodina, příbuzenství, mezigenerační vztahy → `vko/pribuzenskeVztahyVRodine.ts` ✅ (teta/strýc/bratranec/sestřenice/synovec/neteř, žádné hodnocení „správného" složení rodiny)

### Člověk ve společnosti — Rok v jeho proměnách
- [x] Tradice a zvyky během roku (Vánoce, Velikonoce, Masopust, Dušičky, Mikuláš) → `vko/rokVPromenachTradiceAZvyky.ts` ✅ (svátek jako kulturní zvyk — „podle tradice…", nikdy jako podávaná pravda)

**Výchova k občanství HOTOVÁ (8/8, 25. 9.). Šestka 117/117 — KOMPLETNÍ.**

**Poučení z dávky B:** ruční průchod (4 recenzenti, 1 na téma) potvrdil, že
citlivá témata (politická neutralita u státních symbolů, náboženská
neutralita u ročních zvyků) prošla **bez jediného nálezu** — pravidla ze
STANDARDS fungovala už při psaní. Skutečné nálezy byly jinde: dvě věcně
nesmyslné časové vazby v L3 scénářích (kalendářní odstup uvedený jako
konkrétní číslo, které v realitě neplatí — „pár týdnů" mezi zářím a
1. květnem, „tři týdny" od pohyblivých Velikonoc), mylně přisouzená
kompetence (stavební povolení má jen obec s rozšířenou působností, ne každý
obecní úřad), a sdílený slovník zpětné vazby, který nerozlišoval, že L2/L3
mluví o jmenovaných postavách ve 3. osobě, ne k žákovi samotnému. Stejné
poučení jako v dávce A o `topicInsight.ts` (klíčováno na RVP `topic`, sdílí
box mezi věcně různými tématy) se potvrdilo znovu — tentokrát preventivně
ošetřeno napsáním textu, který sedí na všechna tři témata pod „Naše obec,
region, vlast" hned napoprvé.

**Poučení z dávky A:** nezávislý ruční průchod (4 recenzenti, 1 na téma) našel
u všech 4 témat aspoň jeden skutečný nález — zmínka „banky" v distraktoru
(zakázané slovo), věcně nepřesný klíč (dárek věcí vydávaný za „příjem"),
systémová chyba interpunkce („, nebo" ve výčtu, i v názvu tématu), 2× L3
jen přejmenované L2, a nejzávažnější: nápověda H0 u 18 ze 40 úloh
(„vrstevnické vztahy") prakticky opakovala klíč — opraveno na neutrální styl.
Jeden nález (L3 „jen 9 unikátních úloh" u kultury) byl **falešný poplach**:
reviewer počítal unikátnost podle textu otázky, ne podle skutečné identity
úlohy (otázka+klíč+možnosti) — `generator-task-count.test.ts` na tématu
prochází, `gen(3)` spolehlivě vrací 24 unikátů. Další poučení: `topicInsight.ts`
je klíčované na úrovni RVP `topic` (ne jednotlivého generátoru) — když RVP
seskupí dvě věcně různá témata pod jeden uzel („Lidská setkávání a kultura" =
kultura I vrstevnické vztahy), sdílí i box „Co je dobré vědět". Formulace musí
sedět na OBĚ témata, ne jen na to, které psal autor jako první (živě odhaleno
až v prohlížeči, ne testem).
