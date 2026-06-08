# Audit obsahu — 5. ročník (grade-5)

> Vygenerováno automaticky: `runOfflineAudit` + `runPedagogicalAudit` (gradeFilter=5, 16 vzorků/téma).
> Datum: 2026-06-08. 63 témat, 1008 úloh, technická úspěšnost 84 %.

---

## 0. Interpretace — reálné problémy vs. false-positive auditu

Surové počty níže obsahují i **false-positive** (audit checky samy mají slabiny). Po analýze generátorů a validátorů:

### 🔴 Reálné problémy (opravit)

| # | Problém | Rozsah | Kořenová příčina | Doporučená oprava |
|---|---|---|---|---|
| R1 | `fill_blank` „nesedí formát" | 13 (shodaPrisudkuSPodmetem) | Věty mají `___` (3 podtržítka) = validátor počítá 3 blanky, ale `blanks` má 1 prvek | **Generátor**: smazat `blanks: [blank]` (validátor pak kontroluje jen `_>0`), nebo `___`→`_`. Ověřit, že UI nerenderuje inputy podle počtu `_`. |
| R2 | `match_pairs` u kategorizace | obratlovci (31×), říše rostlin/hub/živočichů (31×) | Celé téma je kategorizace (víc položek → stejná třída), ne 1:1 párování → duplicitní pravé strany | **Změnit `inputType` na `categorize`** + restrukturovat data na kategorie. Bonus překlepy: „Čolník"→„Čolek", Rak označen jako ryba. |
| R3 | `match_pairs` vadná data | evropaPoloha (1 úloha), evropskeStaty (2 úlohy) | Jednotlivé úlohy mají duplicitní pravé strany (Alpy 2×, Euro 2×, Německo 2×) | **Opravit jen vadné úlohy** (zaměnit položku za unikátní), NEMĚNIT typ celého tématu — většina párů je validní 1:1. |
| R4 | `hint_leak` vzorec `= <odpověď>` | ~60 % z 108 (zejm. zájmena, etapy života) | Nápověda obsahuje `… = tebou`, „Kojení mlékem = kojenec" → žák jen opíše | **Obsah**: přeformulovat první nápovědy bez `= <termín/tvar>`; navádět přes vlastnost/příklad. |
| R5 | `difficulty_progression` | 2 (nervová soustava, říše rostlin) | Generátor vrací totožný výstup pro L1/2/3 | **Generátor**: zavést gradaci obtížnosti mezi úrovněmi. |
| R6 | `missing_hints` matematika | 12 témat | Matematické generátory nemají per-task `hints` | Ověřit, zda spoléhají na `helpTemplate` (pak OK) — jinak doplnit nápovědy. |

### 🟡 False-positive auditu (opravit AUDIT/VALIDÁTOR, ne obsah)

| # | Problém | Rozsah | Proč false-positive | Doporučení |
|---|---|---|---|---|
| F1 | `select_one` „nesedí formát" | ~20 (matematika + čeština) | Substring-heuristika ve `validateTaskForInputType` (taskValidator.ts ř. 26–32) faulne **legitimní** distraktory: `8 cm` ⊂ `8 cm²`, `5 °C` ⊂ `−5 °C`, `přímá řeč` ⊂ `nepřímá řeč`, `umělecký` ⊂ `neumělecký` | **Validátor**: vyjmout čistě numerické/jednotkové odpovědi ze substring-kontroly + použít token/word-boundary shodu místo `includes` (vyřeší českou negaci `ne-`). Jedna cílená změna opraví matematiku i češtinu. |
| F2 | `answer_uniqueness` | 18 (vlastiveda, prirodoveda) | Hlášeno „5 tasků má shodnou odpověď `order`/`match`" — to jsou **typové markery** drag_order/match_pairs, ne skutečné odpovědi. Audit check nerozumí těmto inputType. | **Pedagogický audit**: přidat `drag_order`/`match_pairs` do výjimek (vedle `true_false`/`comparison`). |
| F3 | `hint_leak` definiční opakování | ~40 % z 108 | U otázek „Co je X?" se termín přirozeně objeví v nápovědě i odpovědi; detektor hlásí jakékoli slovo ≥4 znaky | **Detektor**: nehlásit leak, když se shodný token vyskytuje i v zadání otázky (žák ho už vidí). Sekundární priorita. |

### Prioritizace pro ranní práci
1. **F1 (validátor substring)** — 1 cílená změna, opraví ~20 format false-positive napříč matematikou i češtinou. Nejvyšší páka, nízké riziko obsahu.
2. **F2 (answer_uniqueness výjimka)** — triviální, odstraní 18 false-positive.
3. **R1 (fill_blank)** — 1 soubor, jasná oprava.
4. **R2 (match_pairs→categorize)** — 2 soubory, větší obsahová restruktura.
5. **R4 (hint_leak `=` vzorec)** — mechanická úprava nápověd napříč gramatickými generátory.
6. **R3, R5, R6** — jednotlivé doladění.

> ⚠️ Opravy validátoru (F1) jsou zásahem do systémového invariantu používaného ve všech 3 cestách generování úloh — testovat proti celé `audit:content` sadě, ne jen grade-5.

---

## 1. Technický audit (runOfflineAudit)

- Témat zkontrolováno: **63**
- Úloh zkontrolováno: **1008**
- OK: **844** · Problémů: **164** · Úspěšnost: **84%**

### Podle kategorie

| Kategorie | Počet |
|---|---|
| Formát | 56 |
| Validace odpovědi | 0 |
| Nápověda prozrazuje | 108 |
| Mimo hranice tématu | 0 |
| Česká gramatika | 0 |

### Detaily problémů

#### `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-cisla-nad-milion-miliardy` (matematika)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Jak zapíšeme číslem: 'osm milionů padesát tisíc'?"
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Co je 1 000 000 × 6?"

#### `g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek` (matematika)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Teplotní graf: leden −3 °C, únor −1 °C, březen 5 °C. Jaká je průměrná teplota tě"

#### `g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-obsah-obrazce-ve-ctvercove-siti-jednotky-obsahu` (matematika)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Obsah čtverce se stranou 9 cm = ?"
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Obsah obdélníku 2 cm × 9 cm = ?"
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Obsah obdélníku 3 cm × 5 cm = ?"
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Obsah čtverce se stranou 6 cm = ?"
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Obsah obdélníku 10 cm × 4 cm = ?"

#### `g5-matematika-nestandardni-aplikacni-ulohy-a-problemy-logicke-ulohy-ulohy-nezavisle-na-beznych-postupech-prostorova-predstavivos` (matematika)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Vzor: A, C, E, G, ?"

#### `g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose` (matematika)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Jaká teplota je v mrazu: 5 °C nebo −5 °C?"

#### `g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-basen-lyricka-a-epicka-roman-povidka` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pocity nálady"
  - úloha: "Lyrická báseň nevypráví příběh, ale:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pocity nálady"
  - úloha: "Co je lyrická báseň?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-cislovky-druhy-zakladni-radove-druhove-nasobne` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "základní"
  - úloha: "Jaký druh číslovky je 'sedm'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kolikrát"
  - úloha: "Na jakou otázku odpovídají násobné číslovky?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "násobná"
  - úloha: "Jaký druh číslovky je 'jednou'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "řadová"
  - úloha: "Jaký druh číslovky je 'druhý'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "řadová"
  - úloha: "Jaký druh číslovky je 'sedmý'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "násobná"
  - úloha: "Jaký druh číslovky je 'sedmkrát'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kolik"
  - úloha: "Na jakou otázku odpovídají základní číslovky?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "základní"
  - úloha: "Jaký druh číslovky je 'pět'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kolikátý"
  - úloha: "Na jakou otázku odpovídají řadové číslovky?"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dopis-uredni-zadost-tiskopisy-prihlaska-dotaznik` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vážený pane"
  - úloha: "Jak se správně zahajuje úřední dopis?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kam kdy"
  - úloha: "Co musí obsahovat přihláška?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pod adresou"
  - úloha: "Kde se uvádí datum v úředním dopisu?"

#### `g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nebo překážka"
  - úloha: "Co je antagonista?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jeden řádek"
  - úloha: "Co je verš v básni?"

#### `g5-cjl-jazykova-vychova-skladba-podmet-vyjadreny-nevyjadreny-nekolikanasobny` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nevyjádřený"
  - úloha: "Jaký je podmět ve větě 'Čtu.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "obě slovesa"
  - úloha: "Ve větě 'Zpívám a tancuji.' jaký je podmět?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "ptáci"
  - úloha: "Ve větě 'Ptáci odletěli na jih.' je podmět:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pes"
  - úloha: "Jaký je podmět ve větě 'Pes štěká.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "slunce"
  - úloha: "Ve větě 'Slunce svítí.' jaký je podmět?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mužský rod"
  - úloha: "Ve větě 'Ráno se probudil a šel do školy.' je podmět:"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pracovní postup"
  - úloha: "Jaký typ popisu je recept na dort?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přidej smíchej"
  - úloha: "Pracovní postup používá slovesa v:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jen fakta"
  - úloha: "Jaký typ popisu je: 'Jablko je kulaté, červené, průměru přibližně 8 cm.'?"

#### `g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "chybí proč"
  - úloha: "Je tato zpráva úplná? 'Přijdu pozdě.'"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "předmět schůzky"
  - úloha: "Je tato zpráva úplná? 'Schůzka v úterý v 15:00 ve škole.'"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kdy kde"
  - úloha: "Je pozvánka 'Přijď na oslavu!' úplná?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-pridavna-jmena-druhy-tvrda-mekka-privlastnovaci-sklonovani` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přivlastňovací vzor"
  - úloha: "Přídavné jméno 'sousedův' je:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "měkké vzor"
  - úloha: "Ve větě 'Slyším zimní vítr.' přídavné jméno 'zimní' je:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přivlastňovací"
  - úloha: "Ve větě 'Vidím tátkův klobouk.' přídavné jméno 'tátkův' je:"

#### `g5-cjl-jazykova-vychova-skladba-prima-a-neprima-rec-uvod` (čeština)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Jaký druh řeči je věta: Petr řekl, že přijde zítra."
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nepřímá řeč"
  - úloha: "Jaký druh řeči je věta: Petr řekl, že přijde zítra."
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Jaký druh řeči je věta: Petr řekl: "Přijdu zítra.""
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přímá řeč"
  - úloha: "Jaký druh řeči je věta: Petr řekl: "Přijdu zítra.""
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "dole zavírací"
  - úloha: "Jaký tvar mají uvozovky v češtině?"

#### `g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vlastními slovy"
  - úloha: "Co je reprodukce sdělení?"

#### `g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem` (čeština)
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Žáci ___ test.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Kamarádky ___ včas.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Bratři ___ na výlet.""
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "šli"
  - úloha: "Doplň správný tvar slovesa: "Bratři ___ na výlet.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Kočky ___ celé odpoledne.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Holubi ___ nad střechami.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Myši ___ zásoby.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Dívky ___ na oslavu.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Ptáci ___ na jih.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Hoši ___ od radosti.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Chlapci ___ domů pozdě.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Mravenci ___ po zemi.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Sestry ___ na výlet.""
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "šly"
  - úloha: "Doplň správný tvar slovesa: "Sestry ___ na výlet.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Žákyně ___ loutkové divadlo.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Ovce ___ na louce.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Kameny ___ na cestě.""
- **[Formát]** Nesedí formát pro typ fill_blank
  - úloha: "Doplň správný tvar slovesa: "Hory ___ na obzoru.""

#### `g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "slova"
  - úloha: "Jaký je správný termín pro slova s více různými významy?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kotva"
  - úloha: "Které slovo má více významů: 'kotva' nebo 'kyslík'?"

#### `g5-cjl-jazykova-vychova-nauka-o-slove-slova-spisovna-a-nespisovna` (čeština)
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Jak zní spisovná varianta slova 'vokno'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "hovorová čeština"
  - úloha: "Jak se nazývá vrstva češtiny, která stojí mezi plně spisovnou a nářečím?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-slovesa-zpusob-oznamovaci-rozkazovaci-podminovaci` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "rozkazovací"
  - úloha: "Jaký způsob má sloveso 'Jdi domů!'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "podmiňovací"
  - úloha: "'Mohl bych ti pomoci.' – jaký způsob?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "podmiňovací"
  - úloha: "Jaký způsob má sloveso 'Šel bych domů.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "přišel by"
  - úloha: "Přesun z oznamovacího do podmiňovacího: 'On přijde.' → ___"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "podmiňovací"
  - úloha: "'Přišli by brzy.' – jaký způsob?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "oznamovací"
  - úloha: "Jaký způsob má sloveso 'Jdu domů.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "rozkazovací"
  - úloha: "'Buď hodný!' – jaký způsob?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jdi"
  - úloha: "Přesun z oznamovacího do rozkazovacího: 'Ty jdeš.' → ___"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "způsobu"
  - úloha: "Sloveso 'Chtěla by spát.' je v:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "rozkazovací způsob"
  - úloha: "Jaký způsob vyjadřuje rozkaz, zákaz nebo prosbu?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-slovni-druhy-urcovani-vsech-deseti-ohebne-a-neohebne` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "částice"
  - úloha: "Jaký slovní druh je slovo 'ano'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "10"
  - úloha: "Kolik slovních druhů je v češtině?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "citoslovce"
  - úloha: "Jaký slovní druh je slovo 'au'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "citoslovce"
  - úloha: "Ve větě 'Ahoj, jak se máš?' – jaký slovní druh je 'ahoj'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "částice citoslovce"
  - úloha: "Neohebné slovní druhy jsou:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "příslovce"
  - úloha: "Jaký slovní druh je slovo 'rychle'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "příslovce"
  - úloha: "Ve větě 'Dívka tiše zpívala.' – jaký slovní druh je 'tiše'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "předložka"
  - úloha: "Ve větě 'Bez práce nejsou koláče.' – jaký slovní druh je 'bez'?"

#### `g5-cjl-jazykova-vychova-skladba-souveti-vzorce-pocet-vet` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "více vět"
  - úloha: "Co je souvětí?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "3 věty"
  - úloha: "Kolik vět je v souvětí 'Vím, že přijdeš, když budeš mít čas.'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vedlejší větu"
  - úloha: "Spojka 'protože' je:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "ale proto"
  - úloha: "Čárka v souvětí se píše:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "3 věty"
  - úloha: "Kolik vět je v souvětí 'Doma bylo ticho, protože všichni spali a nikdo nerušil.'"

#### `g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-studijni-cteni-a-vecne-cteni` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcné čtení"
  - úloha: "Jaký typ čtení použiji, když potřebuji pochopit nový pojem ze slovníku?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcné čtení"
  - úloha: "Při hledání receptu na koláč z webu – jaký typ čtení zvolím?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "studijní čtení"
  - úloha: "Jaký typ čtení zvolím při přípravě referátu o Egyptě?"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-telefonicky-rozhovor-zanechani-vzkazu` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kdy proč"
  - úloha: "Co musí zanechaný vzkaz obsahovat?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vzkaz když"
  - úloha: "Co je hlasová schránka (záznamník)?"

#### `g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "estetický zážitek"
  - úloha: "Co je cílem uměleckého textu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je encyklopedie?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "umělecký"
  - úloha: "Jaký typ textu je báseň?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je jízdní řád autobusu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je učebnice matematiky?"
- **[Formát]** Nesedí formát pro typ select_one
  - úloha: "Jaký typ textu je návod k pračce?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "věcný"
  - úloha: "Jaký typ textu je návod k pračce?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "umělecký"
  - úloha: "Jaký typ textu je pohádka?"

#### `g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-s-rozvinutou-osnovou` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "minulý čas"
  - úloha: "Jaký čas se nejčastěji používá ve vyprávění?"

#### `g5-cjl-jazykova-vychova-tvaroslovi-zajmena-sklonovani-osobnich-zajmen` (čeština)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jeho"
  - úloha: "Jaký je 2. pád od zájmena 'on' (mužský rod)?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tobě"
  - úloha: "Jaký je 3. pád od zájmena 'ty'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nám"
  - úloha: "Jaký je 3. pád od zájmena 'my'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mnou"
  - úloha: "Jaký je 7. pád od zájmena 'já'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "předložce"
  - úloha: "Ve větě 'Myslím na ___ (ona).' v 4. pádu:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mu nebo jemu"
  - úloha: "Ve větě 'Dám to ___ (on).' v 3. pádu:"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tebou"
  - úloha: "Která forma je správná: 'Jde ___ (ty).' → šla s tebou?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tebe"
  - úloha: "Jaký je 2. pád od zájmena 'ty'?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "nebo mně"
  - úloha: "Která forma je správná: 'Řekl to ___ (já).' v 3. pádu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "tebou"
  - úloha: "Jaký je 7. pád od zájmena 'ty'?"

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi` (vlastivěda)
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj horu s horstvem, kam patří."

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne` (vlastivěda)
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj zemi s její měnou (aktuální)."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj zemi s jejím sousedem na západ nebo východ."

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-bezobratli-hmyz-pavouci-mekkysi-cervi` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "jako vajíčko"
  - úloha: "Jak přes zimu přežívá hmyz v mírném podnebí?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "slimák"
  - úloha: "Který z těchto živočichů patří mezi měkkýše?"

#### `g5-prirodoveda-clovek-a-jeho-zdravi-vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "kojenec"
  - úloha: "Jak se jmenuje etapa vývoje člověka od 0 do 1 roku?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "stáří"
  - úloha: "Jak se označuje etapa po 65 letech?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "dospělost"
  - úloha: "Která etapa lidského života trvá od 18 do 65 let?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "batole"
  - úloha: "Jaká je etapa vývoje od 1 do 3 let?"

#### `g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-horniny-a-nerosty-druhy-vlastnosti-vznik` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "žula"
  - úloha: "Jak se jmenuje nejrozšířenější hornina ve stavebnictví?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "vápenec"
  - úloha: "Která hornina se používá k výrobě vápna a cementu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mastek"
  - úloha: "Který nerost je nejměkčí na Mohsově stupnici?"

#### `g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-magnety-elektrina-jednoduche-obvody-uvod` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "odpuzují"
  - úloha: "Co se stane, když k sobě přiblížíme dva stejné póly magnetu?"

#### `g5-prirodoveda-clovek-a-jeho-zdravi-navyky-a-prevence-navykove-latky-alkohol-nikotin-drogy` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "18 let"
  - úloha: "Jaký je věkový limit pro alkohol a cigarety v ČR?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "116 111"
  - úloha: "Kde může nezletilý v ČR vyhledat pomoc s drogami?"

#### `g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie` (přírodověda)
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "klasická žárovka"
  - úloha: "Co jsou LED žárovky a proč šetří energii?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "radioaktivní odpad"
  - úloha: "Proč je jaderná energie kontroverzní, přestože produkuje málo CO₂?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "pohybovou energii"
  - úloha: "Jak větrné turbíny vyrábějí elektřinu?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "úniku tepla"
  - úloha: "Jak přispívá tepelná izolace domu k úspoře energie?"

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby` (přírodověda)
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj živočicha se skupinou obratlovců, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj živočicha se skupinou obratlovců, do které patří."
- **[Formát]** Nesedí formát pro typ match_pairs
  - úloha: "Spoj živočicha se skupinou obratlovců, do které patří."
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
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "mezinárodní spolupráce"
  - úloha: "Proč je CITES důležitá mezinárodní úmluva?"

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
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "zygota"
  - úloha: "Jak se nazývá buňka, která vznikne spojením vajíčka a spermie?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "embryo"
  - úloha: "Jak se jmenuje vývojové stadium od 2. do 8. týdne těhotenství?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "menarché"
  - úloha: "Jak se jmenuje první menstruace u dívek?"
- **[Nápověda prozrazuje]** Hint #1 obsahuje doslovně odpověď: "chromozom spermie"
  - úloha: "Jak genetika ovlivňuje pohlaví dítěte?"

## 2. Pedagogický audit (runPedagogicalAudit)

- Témat zkontrolováno: **63**
- Problémů: **39**
- Témata označená NEEDS_REVIEW: —
- Neadaptivní generátory (stejný výstup L1/2/3): `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly`, `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu`

### Podle kategorie

| Kategorie | Počet |
|---|---|
| Chybí gradace obtížnosti | 2 |
| Chybí nápovědy | 18 |
| Slabé distraktory | 0 |
| Označeno k revizi | 0 |
| Chybí postup řešení | 0 |
| Formální jazyk nevhodný pro ZŠ | 0 |
| Příliš složitá otázka | 1 |
| Šablonový generátor (stejné odpovědi) | 18 |
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
- **[Příliš složitá otázka]** Otázka má 29 slov (max pro 5. ročník: 25): "Přečti sdělení: "Knihovna je místo, kde si lidé půjčují knih"

#### `g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-globus-svetove-strany-na-mape-casova-pasma-uvod` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-prumyslova-revoluce-vedecky-a-technicky-pokrok` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato` (vlastivěda)
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový

#### `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava` (přírodověda)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly` (přírodověda)
- **[Chybí gradace obtížnosti]** Generátor vrací totožný výstup pro level 1, 2 i 3 (30 tasků, stejná 1. otázka)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby` (přírodověda)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu` (přírodověda)
- **[Chybí gradace obtížnosti]** Generátor vrací totožný výstup pro level 1, 2 i 3 (30 tasků, stejná 1. otázka)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava` (přírodověda)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "match" → generátor je šablonový

#### `g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci` (přírodověda)
- **[Chybí nápovědy]** 0 z 10 vzorových tasků má nápovědy
- **[Šablonový generátor (stejné odpovědi)]** 5 tasků v level 1 má shodnou odpověď "order" → generátor je šablonový
