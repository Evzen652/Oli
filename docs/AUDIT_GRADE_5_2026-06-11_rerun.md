# Audit obsahu — 5. ročník (grade-5) — RE-RUN po F1+F2

> Vygenerováno: `runOfflineAudit` + `runPedagogicalAudit` (gradeFilter=5, 16 vzorků/téma).
> Datum: 2026-06-11. Re-run po opravách audit nástroje F1 (substring→word-boundary) a F2 (answer_uniqueness skip drag_order/match_pairs).

## 1. Technický audit (runOfflineAudit)

- Témat zkontrolováno: **63**
- Úloh zkontrolováno: **1008**
- OK: **686** · Problémů: **322** · Úspěšnost: **68%**

### Podle kategorie

| Kategorie | Počet |
|---|---|
| Formát | 211 |
| Validace odpovědi | 0 |
| Nápověda prozrazuje | 111 |
| Mimo hranice tématu | 0 |
| Česká gramatika | 0 |

### Detaily problémů

#### `g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky` (matematika)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (40 vs 19 znaků) — prozrazuje se
  - úloha: "Má čtverec kolmé strany?"

#### `g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu` (matematika)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (30 vs 13 znaků) — prozrazuje se
  - úloha: "Co je obsah obrazce?"

#### `g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy` (matematika)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (34 vs 14 znaků) — prozrazuje se
  - úloha: "Má číslo 8 osu souměrnosti?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (37 vs 17 znaků) — prozrazuje se
  - úloha: "Je lidský obličej přesně osově souměrný?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (43 vs 17 znaků) — prozrazuje se
  - úloha: "Je zrcadlový obraz souměrný s originálem?"

#### `g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos` (matematika)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Vzor: A, C, E, G, ?"

#### `g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-basen-lyricka-a-epicka-roman-povidka` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (54 vs 27 znaků) — prozrazuje se
  - úloha: "Co je lyrická báseň?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pocity nálady"
  - úloha: "Co je lyrická báseň?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (28 vs 7 znaků) — prozrazuje se
  - úloha: "Jaký typ díla je Jaroslav Foglar – Záhada hlavolamu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (27 vs 13 znaků) — prozrazuje se
  - úloha: "Jaký literární žánr psal Arthur Conan Doyle (Sherlock Holmes)?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (56 vs 20 znaků) — prozrazuje se
  - úloha: "Co je povídka?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (57 vs 23 znaků) — prozrazuje se
  - úloha: "Co je román?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (52 vs 23 znaků) — prozrazuje se
  - úloha: "Co je balada?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (57 vs 20 znaků) — prozrazuje se
  - úloha: "Co je epos?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (55 vs 24 znaků) — prozrazuje se
  - úloha: "Jaký je hlavní rozdíl mezi románem a povídkou?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pocity nálady"
  - úloha: "Lyrická báseň nevypráví příběh, ale:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (29 vs 13 znaků) — prozrazuje se
  - úloha: "Jaký literární žánr jsou Máchovy básně (Máj)?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (50 vs 20 znaků) — prozrazuje se
  - úloha: "Co je novela?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (29 vs 14 znaků) — prozrazuje se
  - úloha: "Jaký literární žánr je Erbenova Kytice?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (39 vs 14 znaků) — prozrazuje se
  - úloha: "Který z těchto titulů je román?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "řadová"
  - úloha: "Jaký druh číslovky je 'sedmý'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "násobná"
  - úloha: "Jaký druh číslovky je 'sedmkrát'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kolikátý"
  - úloha: "Na jakou otázku odpovídají řadové číslovky?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (19 vs 8 znaků) — prozrazuje se
  - úloha: "Jaký druh číslovky je 'jednou'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "násobná"
  - úloha: "Jaký druh číslovky je 'jednou'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (23 vs 9 znaků) — prozrazuje se
  - úloha: "Na jakou otázku odpovídají druhové číslovky?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kolikrát"
  - úloha: "Na jakou otázku odpovídají násobné číslovky?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kolik"
  - úloha: "Na jakou otázku odpovídají základní číslovky?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (18 vs 8 znaků) — prozrazuje se
  - úloha: "Jaký druh číslovky je 'druhý'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "řadová"
  - úloha: "Jaký druh číslovky je 'druhý'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "základní"
  - úloha: "Jaký druh číslovky je 'sedm'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (45 vs 8 znaků) — prozrazuje se
  - úloha: "Jaký druh číslovky je 'trojnásobný'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "základní"
  - úloha: "Jaký druh číslovky je 'pět'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "řadová"
  - úloha: "Jaký druh číslovky je 'čtvrtý'?"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (59 vs 11 znaků) — prozrazuje se
  - úloha: "Co musí obsahovat přihláška?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kam kdy"
  - úloha: "Co musí obsahovat přihláška?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (48 vs 24 znaků) — prozrazuje se
  - úloha: "Jaké osobní údaje se nejčastěji uvádějí v přihlášce?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (38 vs 17 znaků) — prozrazuje se
  - úloha: "Jak se správně píše oslovení v úředním dopisu na obálce?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (40 vs 18 znaků) — prozrazuje se
  - úloha: "Co je dotazník?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (37 vs 16 znaků) — prozrazuje se
  - úloha: "Co patří do hlavičky (záhlaví) úředního dopisu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (44 vs 20 znaků) — prozrazuje se
  - úloha: "Kde se uvádí datum v úředním dopisu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pod adresou"
  - úloha: "Kde se uvádí datum v úředním dopisu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (41 vs 18 znaků) — prozrazuje se
  - úloha: "Co je 'Vec:' v úředním dopisu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (44 vs 13 znaků) — prozrazuje se
  - úloha: "Co uvádíme v těle (obsahu) žádosti?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (62 vs 17 znaků) — prozrazuje se
  - úloha: "Jak se podepisujeme v úředním dopisu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (45 vs 18 znaků) — prozrazuje se
  - úloha: "Jak se správně zahajuje úřední dopis?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vážený pane"
  - úloha: "Jak se správně zahajuje úřední dopis?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (49 vs 17 znaků) — prozrazuje se
  - úloha: "Co je tiskopis?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (62 vs 16 znaků) — prozrazuje se
  - úloha: "Co je 'příloha' u dopisu?"

#### `g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (32 vs 13 znaků) — prozrazuje se
  - úloha: "Co je prostředí v literárním díle?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (44 vs 17 znaků) — prozrazuje se
  - úloha: "Co je děj v literárním díle?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (36 vs 15 znaků) — prozrazuje se
  - úloha: "Co je refren v básni?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (26 vs 12 znaků) — prozrazuje se
  - úloha: "Co je rým v básni?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (65 vs 19 znaků) — prozrazuje se
  - úloha: "Co je vypravěč v literárním díle?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jeden řádek"
  - úloha: "Co je verš v básni?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (54 vs 12 znaků) — prozrazuje se
  - úloha: "Co je rytmus v básni?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (50 vs 23 znaků) — prozrazuje se
  - úloha: "Co je hlavní postava?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (53 vs 17 znaků) — prozrazuje se
  - úloha: "Co je motiv v literárním díle?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (54 vs 10 znaků) — prozrazuje se
  - úloha: "Co je postava v literárním díle?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (51 vs 12 znaků) — prozrazuje se
  - úloha: "Co je téma literárního díla?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (58 vs 16 znaků) — prozrazuje se
  - úloha: "Co je antagonista?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nebo překážka"
  - úloha: "Co je antagonista?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (36 vs 17 znaků) — prozrazuje se
  - úloha: "Co je strofa v básni?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "zjemnění nepříjemné skutečnosti výrazem – zemřel → odešel"
  - úloha: "Co je eufemismus?"

#### `g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (47 vs 7 znaků) — prozrazuje se
  - úloha: "Ve větě 'Zpívám a tancuji.' jaký je podmět?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "obě slovesa"
  - úloha: "Ve větě 'Zpívám a tancuji.' jaký je podmět?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "ptáci"
  - úloha: "Ve větě 'Ptáci odletěli na jih.' je podmět:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (39 vs 13 znaků) — prozrazuje se
  - úloha: "Ve větě 'Lucie, Tomáš a Ondřej skočili do vody.' je podmět:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "slunce"
  - úloha: "Ve větě 'Slunce svítí.' jaký je podmět?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (32 vs 11 znaků) — prozrazuje se
  - úloha: "Ve větě 'Babička a děda sedí na lavičce.' je podmět:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (16 vs 7 znaků) — prozrazuje se
  - úloha: "Ve větě 'Hrajete si venku.' jaký je podmět?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (28 vs 8 znaků) — prozrazuje se
  - úloha: "Ve větě 'Petr a Jana přišli.' je podmět:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (16 vs 6 znaků) — prozrazuje se
  - úloha: "Ve větě 'Pojďme do kina.' jaký je podmět?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pes"
  - úloha: "Jaký je podmět ve větě 'Pes štěká.'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (37 vs 16 znaků) — prozrazuje se
  - úloha: "Ve větě 'Mlčte!' jaký je podmět?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nevyjádřený"
  - úloha: "Jaký je podmět ve větě 'Čtu.'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (41 vs 16 znaků) — prozrazuje se
  - úloha: "Ve větě 'Čtu a píšu zároveň.' kolik podmětů je?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "obě slovesa"
  - úloha: "Ve větě 'Čtu a píšu zároveň.' kolik podmětů je?"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (61 vs 26 znaků) — prozrazuje se
  - úloha: "Pracovní postup používá slovesa v:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přidej smíchej"
  - úloha: "Pracovní postup používá slovesa v:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (63 vs 22 znaků) — prozrazuje se
  - úloha: "Jak poznáš pracovní postup v textu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (45 vs 22 znaků) — prozrazuje se
  - úloha: "Kde se nejčastěji setkáme se subjektivně zabarveným popisem?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jen fakta"
  - úloha: "Jaký typ popisu je: 'Jablko je kulaté, červené, průměru přibližně 8 cm.'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (47 vs 16 znaků) — prozrazuje se
  - úloha: "Jaký typ popisu je: 'Jablko voní jako zahrada po dešti a jeho šťavnatost je jako"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (61 vs 18 znaků) — prozrazuje se
  - úloha: "Jak poznáš subjektivně zabarvený popis?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pracovní postup"
  - úloha: "Jaký typ popisu je recept na dort?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (57 vs 22 znaků) — prozrazuje se
  - úloha: "Kde se nejčastěji setkáme s objektivním popisem?"

#### `g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (46 vs 22 znaků) — prozrazuje se
  - úloha: "Ve zprávě 'Ukliď pokoj!' – co chybí?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (60 vs 24 znaků) — prozrazuje se
  - úloha: "Jak poznáš neúplné sdělení?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (41 vs 20 znaků) — prozrazuje se
  - úloha: "Je pozvánka 'Přijď na oslavu!' úplná?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kdy kde"
  - úloha: "Je pozvánka 'Přijď na oslavu!' úplná?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (28 vs 14 znaků) — prozrazuje se
  - úloha: "Které otázky musí zodpovědět úplné sdělení?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (40 vs 18 znaků) — prozrazuje se
  - úloha: "Co chybí ve zprávě: 'Přijela maminka z Brna.'?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "aby adresát věděl, co se od něho očekává, a mohl správně rea"
  - úloha: "Proč je důležité, aby sdělení bylo úplné?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (50 vs 19 znaků) — prozrazuje se
  - úloha: "Co musí obsahovat úplná pozvánka na narozeninovou oslavu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (44 vs 22 znaků) — prozrazuje se
  - úloha: "Co chybí ve vzkazu: 'Zavolej mi!'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "chybí proč"
  - úloha: "Je tato zpráva úplná? 'Přijdu pozdě.'"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "předmět schůzky"
  - úloha: "Je tato zpráva úplná? 'Schůzka v úterý v 15:00 ve škole.'"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (52 vs 25 znaků) — prozrazuje se
  - úloha: "Sdělení je přiměřeně úplné, pokud:"

#### `g5-cjl-jazykova-vychova-tvaroslovi-pridavna-jmena-druhy-tvrda-mekka-privlastnovaci-sklonovani` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přivlastňovací vzor"
  - úloha: "Přídavné jméno 'sousedův' je:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přivlastňovací"
  - úloha: "Ve větě 'Vidím tátkův klobouk.' přídavné jméno 'tátkův' je:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "měkké vzor"
  - úloha: "Ve větě 'Slyším zimní vítr.' přídavné jméno 'zimní' je:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "měkká mají"
  - úloha: "Jak se liší skloňování tvrdých a měkkých přídavných jmen?"

#### `g5-cjl-jazykova-vychova-skladba-prima-a-neprima-rec-uvod` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (36 vs 17 znaků) — prozrazuje se
  - úloha: "V přímé řeči se pronomen 'já' v nepřímé řeči změní na:"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "chybí uvozovky – správně: Řekla: "Přijdu.""
  - úloha: "Ve větě 'Řekla: Přijdu.' – co je špatně?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (55 vs 18 znaků) — prozrazuje se
  - úloha: "Kde se píše čárka při přímé řeči s uvozovací větou?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přímá řeč"
  - úloha: "Jaký druh řeči je věta: Petr řekl: "Přijdu zítra.""
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (37 vs 17 znaků) — prozrazuje se
  - úloha: "Ve větě s přímou řečí: dolni-uvoz.Pojď sem,horni-uvoz. řekla babička. – kde je č"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nepřímá řeč"
  - úloha: "Jaký druh řeči je věta: Petr řekl, že přijde zítra."
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Pavel řekl, že má čas. (mám → má)"
  - úloha: "Jak se změní sloveso v nepřímé řeči věty: Pavel řekl: "Mám čas."?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (46 vs 21 znaků) — prozrazuje se
  - úloha: "Co je uvozovací věta?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přímé řeči"
  - úloha: "Ve větě: Lucie řekla, že přijde zítra. – čím se liší 'přijde' od přímé řeči?"

#### `g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (73 vs 23 znaků) — prozrazuje se
  - úloha: "Při reprodukci delšího textu je vhodné:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (57 vs 26 znaků) — prozrazuje se
  - úloha: "Co je parafráze?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vlastními slovy"
  - úloha: "Co je reprodukce sdělení?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (92 vs 38 znaků) — prozrazuje se
  - úloha: "Přečti sdělení: "Knihovna je místo, kde si lidé půjčují knihy. Návštěvníci mohou"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (47 vs 23 znaků) — prozrazuje se
  - úloha: "Při reprodukci NESMÍME:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (48 vs 21 znaků) — prozrazuje se
  - úloha: "Jaký je rozdíl mezi reprodukcí a doslova citovaným textem?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (53 vs 18 znaků) — prozrazuje se
  - úloha: "Co je zkrácená reprodukce (shrnutí)?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (62 vs 22 znaků) — prozrazuje se
  - úloha: "Jak poznáme dobrou reprodukci?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "každý odstavec"
  - úloha: "Jak správně strukturujeme reproukci delšího textu?"

#### `g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "šly"
  - úloha: "Doplň správný tvar slovesa: "Sestry ___ na výlet.""
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "šli"
  - úloha: "Doplň správný tvar slovesa: "Bratři ___ na výlet.""

#### `g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (55 vs 21 znaků) — prozrazuje se
  - úloha: "Slovo 'ruka' — kolik významů má?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kotva"
  - úloha: "Které slovo má více významů: 'kotva' nebo 'kyslík'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (39 vs 19 znaků) — prozrazuje se
  - úloha: "Slovo 'koruna' může znamenat:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "slova"
  - úloha: "Jaký je správný termín pro slova s více různými významy?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (65 vs 28 znaků) — prozrazuje se
  - úloha: "Slovo 'les' je vícevýznamové. Jaký může mít druhý význam?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "část těla"
  - úloha: "Ve větě 'Sedí jí na rameni.' slovo 'rameno' znamená:"

#### `g5-cjl-jazykova-vychova-nauka-o-slove-slova-spisovna-a-nespisovna` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (48 vs 23 znaků) — prozrazuje se
  - úloha: "Co jsou to nářečí (dialekty)?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (61 vs 6 znaků) — prozrazuje se
  - úloha: "Jak zní nespisovný hovorový tvar slova 'nic'?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-slovesa-zpusob-oznamovaci-rozkazovaci-podminovaci` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "podmiňovací"
  - úloha: "'Mohl bych ti pomoci.' – jaký způsob?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "podmiňovací"
  - úloha: "'Přišli by brzy.' – jaký způsob?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "oznamovací"
  - úloha: "Jaký způsob má sloveso 'Jdu domů.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "rozkazovací způsob"
  - úloha: "Jaký způsob vyjadřuje rozkaz, zákaz nebo prosbu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přišel by"
  - úloha: "Přesun z oznamovacího do podmiňovacího: 'On přijde.' → ___"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "rozkazovací"
  - úloha: "'Buď hodný!' – jaký způsob?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "podmiňovací"
  - úloha: "Jaký způsob má sloveso 'Šel bych domů.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "rozkazovací"
  - úloha: "Jaký způsob má sloveso 'Jdi domů!'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "způsobu"
  - úloha: "Sloveso 'Chtěla by spát.' je v:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jdi"
  - úloha: "Přesun z oznamovacího do rozkazovacího: 'Ty jdeš.' → ___"

#### `g5-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-urcovani-vsech-deseti-ohebne-a-neohebne` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "citoslovce"
  - úloha: "Ve větě 'Ahoj, jak se máš?' – jaký slovní druh je 'ahoj'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "citoslovce"
  - úloha: "Jaký slovní druh je slovo 'au'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "10"
  - úloha: "Kolik slovních druhů je v češtině?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "příslovce"
  - úloha: "Jaký slovní druh je slovo 'rychle'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "částice citoslovce"
  - úloha: "Neohebné slovní druhy jsou:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "částice"
  - úloha: "Jaký slovní druh je slovo 'ano'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "příslovce"
  - úloha: "Ve větě 'Dívka tiše zpívala.' – jaký slovní druh je 'tiše'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "předložka"
  - úloha: "Ve větě 'Bez práce nejsou koláče.' – jaký slovní druh je 'bez'?"

#### `g5-cjl-jazykova-vychova-skladba-souveti-vzorce-pocet-vet` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (62 vs 20 znaků) — prozrazuje se
  - úloha: "Čárka v souvětí se píše:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "ale proto"
  - úloha: "Čárka v souvětí se píše:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (40 vs 18 znaků) — prozrazuje se
  - úloha: "Spojka 'nebo' spojuje:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "více vět"
  - úloha: "Co je souvětí?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vedlejší větu"
  - úloha: "Spojka 'protože' je:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "3 věty"
  - úloha: "Kolik vět je v souvětí 'Vím, že přijdeš, když budeš mít čas.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "předmětná"
  - úloha: "Ve větě 'Vím, kam jdeš.' je 'kam jdeš' vedlejší věta:"

#### `g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (47 vs 23 znaků) — prozrazuje se
  - úloha: "Co jsou poznámky při studijním čtení?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (52 vs 20 znaků) — prozrazuje se
  - úloha: "Proč je věcné čtení efektivní pro konkrétní úkoly?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "studijní čtení"
  - úloha: "Jaký typ čtení zvolím při přípravě referátu o Egyptě?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcné čtení"
  - úloha: "Jaký typ čtení použiji, když potřebuji pochopit nový pojem ze slovníku?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (56 vs 25 znaků) — prozrazuje se
  - úloha: "Co je vyhledávací čtení (scanning)?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcné čtení"
  - úloha: "Při hledání receptu na koláč z webu – jaký typ čtení zvolím?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (52 vs 23 znaků) — prozrazuje se
  - úloha: "Jak podtrháváme při studijním čtení?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (60 vs 23 znaků) — prozrazuje se
  - úloha: "Jak se liší studijní a věcné čtení v rychlosti?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (54 vs 25 znaků) — prozrazuje se
  - úloha: "Jakou techniku studijního čtení použiješ při čtení obtížného textu?"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-telefonicky-rozhovor-zanechani-vzkazu` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (38 vs 16 znaků) — prozrazuje se
  - úloha: "Jak říkáme, že chceme být přepojeni?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (41 vs 16 znaků) — prozrazuje se
  - úloha: "Jak začneme vzkaz na záznamník?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (55 vs 25 znaků) — prozrazuje se
  - úloha: "Jaký je rozdíl mezi telefonátem příteli a telefonátem do nemocnice?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (60 vs 18 znaků) — prozrazuje se
  - úloha: "Kdy je vhodné zavolat? (etikett telefonování)"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (66 vs 23 znaků) — prozrazuje se
  - úloha: "Co je hlasová schránka (záznamník)?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vzkaz když"
  - úloha: "Co je hlasová schránka (záznamník)?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (45 vs 15 znaků) — prozrazuje se
  - úloha: "Co nezapomene sdělit vzkaz, který zanecháváme?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (47 vs 16 znaků) — prozrazuje se
  - úloha: "Jak se představíme na začátku formálního telefonátu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (44 vs 20 znaků) — prozrazuje se
  - úloha: "Co musí zanechaný vzkaz obsahovat?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kdy proč"
  - úloha: "Co musí zanechaný vzkaz obsahovat?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (51 vs 16 znaků) — prozrazuje se
  - úloha: "Jaké informace zapíšeme do písemného vzkazu (telefon pro kolegu)?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (62 vs 17 znaků) — prozrazuje se
  - úloha: "Jak říkáme telefonnímu číslu, které si ověřujeme?"

#### `g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (34 vs 15 znaků) — prozrazuje se
  - úloha: "Co je cílem věcného textu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (64 vs 22 znaků) — prozrazuje se
  - úloha: "Co je věcný (neumělecký) text?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (40 vs 20 znaků) — prozrazuje se
  - úloha: "Co je beletrie?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (63 vs 21 znaků) — prozrazuje se
  - úloha: "Co je umělecký text?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (45 vs 22 znaků) — prozrazuje se
  - úloha: "Co je cílem uměleckého textu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "estetický zážitek"
  - úloha: "Co je cílem uměleckého textu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je návod k pračce?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (62 vs 18 znaků) — prozrazuje se
  - úloha: "Jaký typ textu je reklama?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "umělecký"
  - úloha: "Jaký typ textu je báseň?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je encyklopedie?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je učebnice matematiky?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (55 vs 20 znaků) — prozrazuje se
  - úloha: "Jak se liší styl uměleckého a věcného textu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "umělecký"
  - úloha: "Jaký typ textu je pohádka?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je jízdní řád autobusu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (36 vs 17 znaků) — prozrazuje se
  - úloha: "Jaký typ textu je recept?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný funkční"
  - úloha: "Jaký typ textu je recept?"

#### `g5-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-text-na-dane-tema` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (77 vs 20 znaků) — prozrazuje se
  - úloha: "Co je charakteristické pro pohádku?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (52 vs 16 znaků) — prozrazuje se
  - úloha: "Co je pointa v literárním textu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (58 vs 15 znaků) — prozrazuje se
  - úloha: "Před psaním vlastního textu je nejdůležitější:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (55 vs 20 znaků) — prozrazuje se
  - úloha: "Co je osnova textu a proč ji tvoříme?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (49 vs 19 znaků) — prozrazuje se
  - úloha: "Co je správné pravidlo pro psaní vlastního textu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (47 vs 16 znaků) — prozrazuje se
  - úloha: "Co musí povídka nebo pohádka obsahovat?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (55 vs 24 znaků) — prozrazuje se
  - úloha: "Jak přímá řeč text oživuje?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (53 vs 12 znaků) — prozrazuje se
  - úloha: "Co je téma vlastního literárního textu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (36 vs 15 znaků) — prozrazuje se
  - úloha: "Co je dialog v literárním textu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (51 vs 22 znaků) — prozrazuje se
  - úloha: "Jak se liší pohádka od povídky?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (60 vs 19 znaků) — prozrazuje se
  - úloha: "Jak správně začneme psát povídku?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (59 vs 17 znaků) — prozrazuje se
  - úloha: "Co je nezbytné pro dobrou charakteristiku postavy?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (52 vs 23 znaků) — prozrazuje se
  - úloha: "Jak správně napsat klidnou, idylickou scénu?"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (42 vs 21 znaků) — prozrazuje se
  - úloha: "Jaký prvek z přímé řeči dělá vyprávění věrohodnějším?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "minulý čas"
  - úloha: "Jaký čas se nejčastěji používá ve vyprávění?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (65 vs 17 znaků) — prozrazuje se
  - úloha: "Co je zápletka ve vyprávění?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (48 vs 15 znaků) — prozrazuje se
  - úloha: "Co je poučení (morální závěr) ve vyprávění?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (54 vs 27 znaků) — prozrazuje se
  - úloha: "Rozvitá osnova se liší od jednoduché tím, že:"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (57 vs 22 znaků) — prozrazuje se
  - úloha: "Proč je osnova užitečná před psaním?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (31 vs 15 znaků) — prozrazuje se
  - úloha: "Co obsahuje závěr vyprávění?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (46 vs 19 znaků) — prozrazuje se
  - úloha: "Co je vyvrcholení ve vyprávění?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (45 vs 22 znaků) — prozrazuje se
  - úloha: "Co pomáhá vyprávění udělat živým a napínavým?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (67 vs 15 znaků) — prozrazuje se
  - úloha: "Co je osnova vyprávění?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-zajmena-sklonovani-osobnich-zajmen` (čeština)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (52 vs 8 znaků) — prozrazuje se
  - úloha: "Jaký je 1. pád množného čísla od zájmena 'on'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (25 vs 4 znaků) — prozrazuje se
  - úloha: "Ve větě 'Jdu s ___ (on).' v 7. pádu:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tebe"
  - úloha: "Jaký je 2. pád od zájmena 'ty'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tebou"
  - úloha: "Která forma je správná: 'Jde ___ (ty).' → šla s tebou?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nám"
  - úloha: "Jaký je 3. pád od zájmena 'my'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tebou"
  - úloha: "Jaký je 7. pád od zájmena 'ty'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mnou"
  - úloha: "Jaký je 7. pád od zájmena 'já'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (32 vs 3 znaků) — prozrazuje se
  - úloha: "Ve větě 'Myslím na ___ (ona).' v 4. pádu:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "předložce"
  - úloha: "Ve větě 'Myslím na ___ (ona).' v 4. pádu:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mu nebo jemu"
  - úloha: "Ve větě 'Dám to ___ (on).' v 3. pádu:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jeho"
  - úloha: "Jaký je 2. pád od zájmena 'on' (mužský rod)?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (39 vs 13 znaků) — prozrazuje se
  - úloha: "Která forma je správná: 'Řekl to ___ (já).' v 3. pádu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nebo mně"
  - úloha: "Která forma je správná: 'Řekl to ___ (já).' v 3. pádu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tobě"
  - úloha: "Jaký je 3. pád od zájmena 'ty'?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (37 vs 5 znaků) — prozrazuje se
  - úloha: "Ve větě 'Jdu za ___ (ona).' – za ní nebo za ji?"

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi` (vlastivěda)
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj horu s horstvem, kam patří."

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne` (vlastivěda)
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj zemi s její měnou (aktuální)."

#### `g5-vlastiveda-lide-kolem-nas-demokracie-a-stat-volby-zastupitelske-organy-cr-prezident-vlada` (vlastivěda)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (29 vs 6 znaků) — prozrazuje se
  - úloha: "Na jak dlouho je volen prezident ČR?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (64 vs 29 znaků) — prozrazuje se
  - úloha: "Co je Ústavní soud?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (65 vs 25 znaků) — prozrazuje se
  - úloha: "Co je úkolem vlády?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (81 vs 24 znaků) — prozrazuje se
  - úloha: "Co znamená princip dělby moci?"

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-bezobratli-hmyz-pavouci-mekkysi-cervi` (přírodověda)
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "V mořích – patří mezi ostnokožce"
  - úloha: "Kde žijí mořští bezobratlí jako hvězdice a ježovka?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (28 vs 8 znaků) — prozrazuje se
  - úloha: "Jak se jmenuje tvrdý obal (vnější kostra) hmyzu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "slimák"
  - úloha: "Který z těchto živočichů patří mezi měkkýše?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (38 vs 15 znaků) — prozrazuje se
  - úloha: "Jakou funkci mají tykadla hmyzu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jako vajíčko"
  - úloha: "Jak přes zimu přežívá hmyz v mírném podnebí?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Kladením vajíček – vajíčko → larva → kukla → dospělec"
  - úloha: "Jak se hmyz množí?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (107 vs 49 znaků) — prozrazuje se
  - úloha: "Jak se liší pavouci od hmyzu v počtu tělesných částí?"

#### `g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "dospělost"
  - úloha: "Která etapa lidského života trvá od 18 do 65 let?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (40 vs 20 znaků) — prozrazuje se
  - úloha: "Které hormony způsobují změny v pubertě?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kojenec"
  - úloha: "Jak se jmenuje etapa vývoje člověka od 0 do 1 roku?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "stáří"
  - úloha: "Jak se označuje etapa po 65 letech?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "batole"
  - úloha: "Jaká je etapa vývoje od 1 do 3 let?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (181 vs 69 znaků) — prozrazuje se
  - úloha: "Proč je spánek zvlášť důležitý pro dospívající?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Hormony urychlují 'prořezávání' nevyužívaných synapsí a posi"
  - úloha: "Jak hormony ovlivňují vývoj mozku v pubertě?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (150 vs 65 znaků) — prozrazuje se
  - úloha: "Co je sebeobrázek (self-image) a proč je důležitý v pubertě?"

#### `g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "žula"
  - úloha: "Jak se jmenuje nejrozšířenější hornina ve stavebnictví?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (71 vs 29 znaků) — prozrazuje se
  - úloha: "Co je to Mohsova stupnice?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vápenec"
  - úloha: "Která hornina se používá k výrobě vápna a cementu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mastek"
  - úloha: "Který nerost je nejměkčí na Mohsově stupnici?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (75 vs 32 znaků) — prozrazuje se
  - úloha: "Co jsou drahokamy?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (143 vs 56 znaků) — prozrazuje se
  - úloha: "K čemu slouží nerosty jako křemen, živec a slída v hornině žule?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (168 vs 59 znaků) — prozrazuje se
  - úloha: "Jak vzniklo uhlí? Proč se mu říká fosilní palivo?"

#### `g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-magnety-elektrina-jednoduche-obvody-uvod` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "odpuzují"
  - úloha: "Co se stane, když k sobě přiblížíme dva stejné póly magnetu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (147 vs 45 znaků) — prozrazuje se
  - úloha: "Jak se liší sériové a paralelní zapojení spotřebičů v obvodu?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (135 vs 62 znaků) — prozrazuje se
  - úloha: "Proč se různé póly magnetů přitahují a stejné odpuzují?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (124 vs 56 znaků) — prozrazuje se
  - úloha: "Proč hromosvod chrání budovu před bleskem?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nejmenším odporem"
  - úloha: "Proč hromosvod chrání budovu před bleskem?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (131 vs 61 znaků) — prozrazuje se
  - úloha: "Jak pracuje elektromagnet v jeřábu šrotovniště?"

#### `g5-prirodoveda-clovek-a-jeho-zdravi-navyky-a-prevence-navykove-latky-alkohol-nikotin-drogy` (přírodověda)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (86 vs 42 znaků) — prozrazuje se
  - úloha: "Co způsobuje kouření pro plíce?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "116 111"
  - úloha: "Kde může nezletilý v ČR vyhledat pomoc s drogami?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "18 let"
  - úloha: "Jaký je věkový limit pro alkohol a cigarety v ČR?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Nikotin se váže na acetylcholinové receptory → uvolní se dop"
  - úloha: "Jak funguje závislost na nikotin na buněčné úrovni?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (179 vs 71 znaků) — prozrazuje se
  - úloha: "Jak pasivní kouření poškozuje zdraví?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (159 vs 65 znaků) — prozrazuje se
  - úloha: "Proč je prevence lepší než léčba závislosti?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Obsahují vysoké dávky kofeinu a cukru + taurin → zrychlují s"
  - úloha: "Proč jsou energetické nápoje nebezpečné pro srdce mladých lidí?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Játra prioritně odbourávají alkohol – při chronické konzumac"
  - úloha: "Proč alkohol ničí játra?"

#### `g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "klasická žárovka"
  - úloha: "Co jsou LED žárovky a proč šetří energii?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (66 vs 20 znaků) — prozrazuje se
  - úloha: "Jaká je výhoda jaderné energie oproti uhlí?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (98 vs 49 znaků) — prozrazuje se
  - úloha: "Jak přispívá tepelná izolace domu k úspoře energie?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "úniku tepla"
  - úloha: "Jak přispívá tepelná izolace domu k úspoře energie?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "radioaktivní odpad"
  - úloha: "Proč je jaderná energie kontroverzní, přestože produkuje málo CO₂?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (143 vs 62 znaků) — prozrazuje se
  - úloha: "Jak elektrická auta snižují uhlíkovou stopu ve srovnání s benzínovými?"

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby` (přírodověda)
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj živočicha se skupinou obratlovců, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj živočicha se skupinou obratlovců, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj živočicha se skupinou obratlovců, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj živočicha se skupinou obratlovců, do které patří."

#### `g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-ochrana-prirody-narodni-parky-chko-v-cr` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "podyjí"
  - úloha: "Který národní park leží v Moravě na řece Dyji?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (101 vs 47 znaků) — prozrazuje se
  - úloha: "Co je CHKO?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (78 vs 36 znaků) — prozrazuje se
  - úloha: "Co je uhlíková stopa a jak ji snížit?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (87 vs 40 znaků) — prozrazuje se
  - úloha: "Jak mohou děti přispět k ochraně přírody?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (143 vs 51 znaků) — prozrazuje se
  - úloha: "Jaký je rozdíl mezi národním parkem a CHKO?"

#### `g5-prirodoveda-rozmanitost-prirody-ekosystemy-a-zivotni-prostredi-potravni-retezec-vztahy-v-ekosystemu` (přírodověda)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (129 vs 61 znaků) — prozrazuje se
  - úloha: "Co jsou invazivní druhy a proč jsou problémem?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Z každého kW přijaté energie rostlina předá bylinožravci jen"
  - úloha: "Proč je v ekosystému více bylinožravců než masožravců?"

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu` (přírodověda)
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj organismus s říší, do které patří."

#### `g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-rozmnozovaci-soustava-vyvoj-cloveka-uvod` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "embryo"
  - úloha: "Jak se jmenuje vývojové stadium od 2. do 8. týdne těhotenství?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "menarché"
  - úloha: "Jak se jmenuje první menstruace u dívek?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Vajíčko (od ženy) + spermii – od muže → oplodnění"
  - úloha: "Pohlavní rozmnožování člověka vyžaduje:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "zygota"
  - úloha: "Jak se nazývá buňka, která vznikne spojením vajíčka a spermie?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (87 vs 40 znaků) — prozrazuje se
  - úloha: "Co je placenta?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (29 vs 9 znaků) — prozrazuje se
  - úloha: "Jak dlouho trvá těhotenství přibližně?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (105 vs 49 znaků) — prozrazuje se
  - úloha: "Co je ovulace a kdy probíhá?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Vajíčko vždy nese chromozom X. Spermie nese X nebo Y. Spermi"
  - úloha: "Jak genetika ovlivňuje pohlaví dítěte?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "chromozom spermie"
  - úloha: "Jak genetika ovlivňuje pohlaví dítěte?"
- **[Formát]** Správná možnost obsahuje meta-text prozrazující odpověď: "Plod přijímá všechny živiny přes placentu z krve matky. Nedo"
  - úloha: "Proč je zdravá výživa matky během těhotenství klíčová?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (153 vs 62 znaků) — prozrazuje se
  - úloha: "Co jsou pohlavně přenosné nemoci (STI) a jak se přenášejí?"

#### `g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-vesmir-slunecni-soustava-planety-slunce-mesic` (přírodověda)
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (41 vs 14 znaků) — prozrazuje se
  - úloha: "Jak daleko je Slunce od Země přibližně?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (61 vs 26 znaků) — prozrazuje se
  - úloha: "Co je to kometa?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (124 vs 30 znaků) — prozrazuje se
  - úloha: "Jak se od sebe liší kamenité a plynné planety?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (102 vs 48 znaků) — prozrazuje se
  - úloha: "Jaký je rozdíl mezi asteroidem a kometou?"
- **[Formát]** Správná možnost je ≥ 2× delší než všechny distraktory (97 vs 33 znaků) — prozrazuje se
  - úloha: "Co je to jaderná fúze probíhající ve Slunci?"

## 2. Pedagogický audit (runPedagogicalAudit)

- Témat zkontrolováno: **63**
- Problémů: **25**
- Témata označená NEEDS_REVIEW: —
- Neadaptivní generátory (stejný výstup L1/2/3): `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava`, `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly`, `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby`, `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu`, `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava`, `g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci`

### Podle kategorie

| Kategorie | Počet |
|---|---|
| Chybí gradace obtížnosti | 6 |
| Chybí nápovědy | 18 |
| Slabé distraktory | 0 |
| Označeno k revizi | 0 |
| Chybí postup řešení | 0 |
| Formální jazyk nevhodný pro ZŠ | 0 |
| Příliš složitá otázka | 1 |
| Šablonový generátor (stejné odpovědi) | 0 |
| Invertovaná obtížnost | 0 |
| Nápověda špatně stupňována | 0 |

### Detaily problémů

#### `g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-aritmeticky-prumer-vypocet` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-cisla-nad-milion-miliardy` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-desetinna-cisla-cteni-zapis-porovnavani` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-nasobeni-a-deleni-desetinnych-cisel-10-100-1000` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-dvoucifernym-delitelem` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-scitani-a-odcitani-desetinnych-cisel` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose` (matematika)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni` (čeština)
- **[Příliš složitá otázka]** Otázka má 31 slov (max pro 5. ročník: 25): "Přečti sdělení: "Každé ráno chodí Pavel do školy pěšky. Cest"

#### `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava` (přírodověda)
- **[Chybí gradace obtížnosti]** 100 % otázek levelu 3 je shodných s levelem 1 — nejtěžší úroveň nepřidává obtížnost
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly` (přírodověda)
- **[Chybí gradace obtížnosti]** 100 % otázek levelu 3 je shodných s levelem 1 — nejtěžší úroveň nepřidává obtížnost
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby` (přírodověda)
- **[Chybí gradace obtížnosti]** Generátor vrací totožný výstup pro level 1, 2 i 3 (30 tasků, stejná 1. otázka)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu` (přírodověda)
- **[Chybí gradace obtížnosti]** Generátor vrací totožný výstup pro level 1, 2 i 3 (30 tasků, stejná 1. otázka)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava` (přírodověda)
- **[Chybí gradace obtížnosti]** 100 % otázek levelu 3 je shodných s levelem 1 — nejtěžší úroveň nepřidává obtížnost
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy

#### `g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci` (přírodověda)
- **[Chybí gradace obtížnosti]** 100 % otázek levelu 3 je shodných s levelem 1 — nejtěžší úroveň nepřidává obtížnost
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy
