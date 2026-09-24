/**
 * Výchova k občanství 6. ročník — Státní symboly, T. G. Masaryk a státní
 * svátky ČR (select_one).
 *
 * Čistě faktické, stálé téma bez čísel k počítání a bez soudobých osob:
 * žák rozpoznává a přiřazuje popis, datum nebo význam ke správnému státnímu
 * symbolu (vlajka × velký/malý znak × hymna), ke správnému státnímu svátku
 * (datum × důvod) a ke skutečné roli T. G. Masaryka (první prezident
 * Československa — ne král, ne prezident dnešní ČR).
 *
 * Stavba podle zlatého vzoru `dejepis/periodizaceLetopocet.ts` a
 * `vko/majetekAPenizeHospodareniVRodine.ts`: disjunktní banky POOL_L1 / L2 /
 * L3, helpery výhradně z `./_shared`. Rotace bankou se nastaví na začátku
 * gen(), generátor nemá stav mezi voláními.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • vlajka × znak zaměněny (žák neví, který popis patří kterému pojmu);
 *  • sousední/blízké datum státního svátku zaměněno za jiné (28. 9. × 28. 10.,
 *    17. 11. × jiné datum), nebo svátek přiřazený ke špatnému datu;
 *  • T. G. Masaryk označen za krále nebo za současného prezidenta ČR, nebo
 *    jeho úřad špatně zařazen do dnešní ČR místo tehdejšího Československa;
 *  • hymna zaměněna za jinou píseň, nebo mylná představa, že se zpívají obě
 *    sloky Kde domov můj.
 *
 *  • L1 — přímé zapamatování jednoho izolovaného faktu (definice symbolu →
 *    jeho název; jeden konkrétní svátek → datum, nebo naopak; role TGM).
 *  • L2 — spojení dvou faktů v jedné odpovědi: datum svátku SPOLU s důvodem,
 *    nebo přiřazení TGM ke skutečnému státu a funkci zároveň.
 *  • L3 — přenos: z 2–3 vět líčících situaci (bez přímého jmenování svátku)
 *    odvodit jeho název; nebo rozhodnout, který ze čtyř věcně podobných
 *    výroků o symbolech/TGM je jediný pravdivý.
 *
 * Fakta podle zákona č. 3/1993 Sb. (státní symboly) a č. 245/2000 Sb.
 * (státní svátky), shodná s výkladem učebnic VKO 6. ročníku (Fraus, SPN,
 * Nová škola). Žádné obrázky — vše popsáno slovy, jak to učebnice popisují.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  key: string;
  d: [Distractor, Distractor, Distractor];
  hints: [string, string];
  explanation: string;
}

// ── L1 — přímé zapamatování jednoho izolovaného faktu ───────────────────
const POOL_L1: Polozka[] = [
  {
    q: "Obdélník s bílým pruhem nahoře, červeným pruhem dole a modrým klínem, který od žerdi zasahuje do poloviny délky listu. O jaký státní symbol jde?",
    key: "státní vlajka",
    d: [
      { value: "velký státní znak", why: "Znak je štít s vyobrazenými zvířaty (lvem, orlicemi), ne obdélník s pruhy a klínem. Popsaný obdélník s pruhy a klínem je vlajka." },
      { value: "malý státní znak", why: "I malý znak je štít se lvem, ne obdélník s barevnými pruhy. Popsaný symbol je vlajka." },
      { value: "státní hymna", why: "Hymna je píseň, ne vyobrazení s pruhy a klínem. Popsaný symbol je vlajka." },
    ],
    hints: [
      "Přemýšlej, který ze státních symbolů má podobu barevného obdélníku, ne obrázku na štítu.",
      "Symbol s barvami a klínem, bez vyobrazení zvířat na štítu, má mezi státními symboly jen jednu takovou podobu.",
    ],
    explanation: "Popsaný vzhled (bílý pruh nahoře, červený dole, modrý klín od žerdi do poloviny délky) patří státní vlajce ČR.",
  },
  {
    q: "Čtvrcený štít, na kterém jsou vedle sebe český lev, moravská orlice a slezská orlice. O jaký státní symbol jde?",
    key: "velký státní znak",
    d: [
      { value: "malý státní znak", why: "Malý znak zobrazuje jen samotného českého lva, ne štít rozdělený na víc polí se třemi zvířaty. Popsaný čtvrcený štít je velký státní znak." },
      { value: "státní vlajka", why: "Vlajka je barevný list s pruhy a klínem, ne štít se lvem a orlicemi. Popsaný symbol je velký státní znak." },
      { value: "státní hymna", why: "Hymna je píseň, ne štít s vyobrazenými zvířaty. Popsaný symbol je velký státní znak." },
    ],
    hints: [
      "Přemýšlej, který symbol zobrazuje víc zvířat najednou rozdělených na více polí štítu.",
      "Kde je štít rozdělený na čtyři pole a v nich lev i dvě orlice zároveň, jde o tu větší, podrobnější podobu znaku, ne o zjednodušenou verzi jen s jedním zvířetem.",
    ],
    explanation: "Štít se čtyřmi poli, ve kterých jsou český lev, moravská orlice a slezská orlice, je velký státní znak.",
  },
  {
    q: "Červený štít, na kterém je jen stříbrný dvouocasý lev ve skoku se zlatou korunou, bez dalších zvířat. O jaký státní symbol jde?",
    key: "malý státní znak",
    d: [
      { value: "velký státní znak", why: "Velký znak má štít rozdělený na čtyři pole s lvem i oběma orlicemi. Popsaný štít má jen samotného lva, to je malý státní znak." },
      { value: "státní vlajka", why: "Vlajka je barevný list s pruhy a klínem, ne štít s vyobrazeným lvem. Popsaný symbol je malý státní znak." },
      { value: "státní hymna", why: "Hymna je píseň, ne štít s vyobrazením zvířete. Popsaný symbol je malý státní znak." },
    ],
    hints: [
      "Přemýšlej, který symbol zobrazuje jen jedno jediné zvíře na štítu, bez dalších polí.",
      "Kde na štítu není nic než samotný lev, bez obou orlic, jde o tu zjednodušenou, menší podobu znaku.",
    ],
    explanation: "Štít jen s jedním zvířetem, stříbrným lvem ve skoku na červeném poli, je malý státní znak.",
  },
  {
    q: "Píseň Kde domov můj, ze které se při státních příležitostech zpívá jen první sloka. O jaký státní symbol jde?",
    key: "státní hymna",
    d: [
      { value: "státní vlajka", why: "Vlajka je barevný list, ne píseň. Popsaný symbol, který se zpívá, je státní hymna." },
      { value: "velký státní znak", why: "Znak je vyobrazení na štítu, ne píseň. Popsaný symbol je státní hymna." },
      { value: "malý státní znak", why: "I malý znak je jen štít se lvem, ne píseň, která se zpívá. Popsaný symbol je státní hymna." },
    ],
    hints: [
      "Přemýšlej, který ze státních symbolů se dá zazpívat, ne jen ukázat nebo vyvěsit.",
      "Ze čtyř symbolů má jen jeden podobu písně s melodií a slovy, ne jen vzhled.",
    ],
    explanation: "Píseň Kde domov můj, ze které je oficiální hymnou jen první sloka, je státní hymna ČR.",
  },
  {
    q: "Který státní svátek připadá na 28. září?",
    key: "Den české státnosti",
    d: [
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek připadá na 28. října, ne na 28. září. Na 28. září připadá Den české státnosti." },
      { value: "Den boje za svobodu a demokracii", why: "Ten svátek připadá na 17. listopadu. Na 28. září připadá Den české státnosti." },
      { value: "Den vítězství", why: "Ten svátek připadá na 8. května. Na 28. září připadá Den české státnosti." },
    ],
    hints: [
      "Přemýšlej, který z několika podzimních státních svátků má datum na konci září, ne v říjnu nebo listopadu.",
      "Konec září patří svátku spojenému se svatým Václavem, patronem české země.",
    ],
    explanation: "28. září se slaví Den české státnosti, svátek spojený se svatým Václavem.",
  },
  {
    q: "Na které datum připadá Den vzniku samostatného československého státu?",
    key: "28. října",
    d: [
      { value: "28. září", why: "To je datum jiného svátku, Dne české státnosti. Den vzniku samostatného československého státu připadá na 28. října." },
      { value: "17. listopadu", why: "To je datum Dne boje za svobodu a demokracii. Den vzniku samostatného československého státu připadá na 28. října." },
      { value: "1. ledna", why: "To je datum Dne obnovy samostatného českého státu. Den vzniku samostatného československého státu připadá na 28. října." },
    ],
    hints: [
      "Přemýšlej, ve kterém podzimním měsíci roku 1918 vzniklo Československo.",
      "Vznik samostatného Československa v roce 1918 si připomínáme koncem října, na rozdíl od Dne české státnosti, který je o měsíc dřív.",
    ],
    explanation: "Den vzniku samostatného československého státu si připomínáme 28. října, kdy v roce 1918 vzniklo Československo.",
  },
  {
    q: "Který státní svátek připadá na 17. listopadu?",
    key: "Den boje za svobodu a demokracii",
    d: [
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek připadá na 28. října, ne na 17. listopadu. Na 17. listopadu připadá Den boje za svobodu a demokracii." },
      { value: "Den české státnosti", why: "Ten svátek připadá na 28. září. Na 17. listopadu připadá Den boje za svobodu a demokracii." },
      { value: "Den vítězství", why: "Ten svátek připadá na 8. května. Na 17. listopadu připadá Den boje za svobodu a demokracii." },
    ],
    hints: [
      "Přemýšlej, který svátek si lidé připomínají koncem podzimu, v listopadu.",
      "17. listopad je jediný z podzimních státních svátků, který připomíná dvě různá výročí z 20. století zároveň — studentské demonstrace roku 1939 i sametovou revoluci roku 1989.",
    ],
    explanation: "17. listopadu se slaví Den boje za svobodu a demokracii.",
  },
  {
    q: "Na které datum připadá Den vítězství?",
    key: "8. května",
    d: [
      { value: "5. července", why: "To je datum Dne slovanských věrozvěstů Cyrila a Metoděje. Den vítězství připadá na 8. května." },
      { value: "6. července", why: "To je datum Dne upálení mistra Jana Husa. Den vítězství připadá na 8. května." },
      { value: "1. ledna", why: "To je datum Dne obnovy samostatného českého státu. Den vítězství připadá na 8. května." },
    ],
    hints: [
      "Přemýšlej, ve kterém jarním měsíci v roce 1945 skončila v Evropě druhá světová válka.",
      "Konec druhé světové války v Evropě roku 1945 si připomínáme na jaře, hned na začátku května.",
    ],
    explanation: "Den vítězství, který připomíná konec druhé světové války v Evropě, se slaví 8. května.",
  },
  {
    q: "Který státní svátek připadá na 5. července?",
    key: "Den slovanských věrozvěstů Cyrila a Metoděje",
    d: [
      { value: "Den upálení mistra Jana Husa", why: "Ten svátek připadá na 6. července, o den později. Na 5. července připadá Den slovanských věrozvěstů Cyrila a Metoděje." },
      { value: "Den vítězství", why: "Ten svátek připadá na 8. května. Na 5. července připadá Den slovanských věrozvěstů Cyrila a Metoděje." },
      { value: "Den české státnosti", why: "Ten svátek připadá na 28. září. Na 5. července připadá Den slovanských věrozvěstů Cyrila a Metoděje." },
    ],
    hints: [
      "Přemýšlej, který letní svátek připomíná dva bratry, kteří na Velkou Moravu přinesli písmo.",
      "Příchod Cyrila a Metoděje na Velkou Moravu si připomínáme na začátku července, 5. července.",
    ],
    explanation: "5. července se slaví Den slovanských věrozvěstů Cyrila a Metoděje.",
  },
  {
    q: "Který státní svátek připadá na 6. července?",
    key: "Den upálení mistra Jana Husa",
    d: [
      { value: "Den slovanských věrozvěstů Cyrila a Metoděje", why: "Ten svátek připadá na 5. července, o den dřív. Na 6. července připadá Den upálení mistra Jana Husa." },
      { value: "Den boje za svobodu a demokracii", why: "Ten svátek připadá na 17. listopadu. Na 6. července připadá Den upálení mistra Jana Husa." },
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek připadá na 28. října. Na 6. července připadá Den upálení mistra Jana Husa." },
    ],
    hints: [
      "Přemýšlej, který letní svátek připomíná kazatele upáleného na hranici v Kostnici.",
      "Kazatele upáleného v Kostnici si připomínáme hned den po svátku Cyrila a Metoděje.",
    ],
    explanation: "6. července se slaví Den upálení mistra Jana Husa.",
  },
  {
    q: "Na které datum připadá Den obnovy samostatného českého státu?",
    key: "1. ledna",
    d: [
      { value: "28. září", why: "To je datum Dne české státnosti. Den obnovy samostatného českého státu připadá na 1. ledna." },
      { value: "28. října", why: "To je datum Dne vzniku samostatného československého státu. Den obnovy samostatného českého státu připadá na 1. ledna." },
      { value: "17. listopadu", why: "To je datum Dne boje za svobodu a demokracii. Den obnovy samostatného českého státu připadá na 1. ledna." },
    ],
    hints: [
      "Přemýšlej, kterým dnem začíná kalendářní rok.",
      "Samostatná Česká republika vznikla rozdělením Československa na počátku roku 1993 — svátek proto připadá na úplně první den kalendářního roku.",
    ],
    explanation: "Den obnovy samostatného českého státu, kdy v roce 1993 vznikla samostatná Česká republika, se slaví 1. ledna.",
  },
  {
    q: "Kým byl T. G. Masaryk?",
    key: "první prezident Československa",
    d: [
      { value: "král Československa", why: "Československo nikdy krále nemělo, byla to republika v čele s prezidentem. T. G. Masaryk byl první prezident Československa." },
      { value: "současný prezident České republiky", why: "T. G. Masaryk žil a zemřel dávno v minulosti, ne dnes. Byl prvním prezidentem tehdy vzniklého Československa." },
      { value: "poslední rakousko-uherský císař", why: "Rakousko-uherským císařem T. G. Masaryk nikdy nebyl, naopak se zasloužil o vznik samostatného státu po rozpadu Rakouska-Uherska. Byl prvním prezidentem Československa." },
    ],
    hints: [
      "Přemýšlej, jakou funkci zastával v čerstvě vzniklém státě po roce 1918.",
      "T. G. Masaryk stál v čele nově vzniklého státu jako jeho úplně první hlava.",
    ],
    explanation: "T. G. Masaryk byl první prezident Československa, státu, který vznikl v roce 1918.",
  },
  {
    q: "Malý státní znak zobrazuje…",
    key: "jen českého lva",
    d: [
      { value: "českého lva, moravskou orlici a slezskou orlici", why: "To zobrazuje velký státní znak, ne malý. Malý znak zobrazuje jen samotného českého lva." },
      { value: "jen moravskou orlici", why: "Moravská orlice je součástí velkého znaku, ne malého. Malý znak zobrazuje jen českého lva." },
      { value: "bílý pruh, červený pruh a modrý klín", why: "To popisuje vlajku, ne znak. Malý státní znak zobrazuje jen českého lva." },
    ],
    hints: [
      "Přemýšlej, kolik zvířat je na štítu, když je znak v té jednodušší, „malé“ podobě.",
      "Malá podoba znaku vynechává obě orlice a zůstává na ní jen samotný český lev.",
    ],
    explanation: "Malý státní znak zobrazuje jen českého lva — stříbrného dvouocasého lva ve skoku na červeném poli.",
  },
  {
    q: "Který svátek roku 1939 i 1989 připomíná studentské protesty proti nesvobodě?",
    key: "Den boje za svobodu a demokracii",
    d: [
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek připomíná vznik Československa v roce 1918, ne studentské protesty. Studentské protesty připomíná Den boje za svobodu a demokracii." },
      { value: "Den české státnosti", why: "Ten svátek připomíná svatého Václava, ne studentské protesty z 20. století. Studentské protesty připomíná Den boje za svobodu a demokracii." },
      { value: "Den vítězství", why: "Ten svátek připomíná konec druhé světové války, ne studentské protesty. Studentské protesty připomíná Den boje za svobodu a demokracii." },
    ],
    hints: [
      "Přemýšlej, který svátek má datum 17. listopadu a váže se hned ke dvěma různým letům z 20. století.",
      "Datum 17. listopadu je mezi státními svátky jediné, které se váže hned ke dvěma různým protestům proti nesvobodě — jednomu z roku 1939, druhému z roku 1989.",
    ],
    explanation: "Den boje za svobodu a demokracii (17. listopadu) připomíná studentské protesty proti nesvobodě z let 1939 i 1989.",
  },
  {
    q: "Jakou barvu má klín na státní vlajce ČR?",
    key: "modrou",
    d: [
      { value: "zelenou", why: "Zelená barva se na státní vlajce ČR nevyskytuje vůbec. Klín na vlajce je modrý." },
      { value: "žlutou", why: "Žlutá barva se na státní vlajce ČR nevyskytuje. Klín na vlajce je modrý." },
      { value: "červenou", why: "Červená je barva dolního pruhu vlajky, ne klínu. Klín na vlajce je modrý." },
    ],
    hints: [
      "Přemýšlej, které tři barvy se na české vlajce vyskytují — bílá, červená a jedna další.",
      "Vlajka ČR má bílý pruh nahoře, červený pruh dole a klín od žerdi, který je modrý.",
    ],
    explanation: "Klín na státní vlajce ČR, který vychází od žerdi do poloviny délky listu, je modrý.",
  },
];

// ── L2 — spojení dvou faktů v jedné odpovědi ─────────────────────────────
const POOL_L2: Polozka[] = [
  {
    q: "V tento den roku 935 zemřel svatý Václav, patron české země, jehož korunu dodnes používáme jako korunovační klenot. O jaký svátek jde a na jaké datum připadá?",
    key: "Den české státnosti, 28. září",
    d: [
      { value: "Den vzniku samostatného československého státu, 28. října", why: "Vznik Československa v roce 1918 nemá se svatým Václavem nic společného. Svátek spojený se svatým Václavem je Den české státnosti, 28. září." },
      { value: "Den české státnosti, 28. října", why: "Název svátku je správně, ale datum patří jinému svátku, Dni vzniku samostatného československého státu. Den české státnosti připadá na 28. září." },
      { value: "Den boje za svobodu a demokracii, 17. listopadu", why: "Ten svátek připomíná studentské demonstrace 20. století, ne svatého Václava. Svátek spojený se svatým Václavem je Den české státnosti, 28. září." },
    ],
    hints: [
      "Přemýšlej, kterému historickému symbolu je tenhle svátek zasvěcený, a k jakému datu se váže.",
      "Svátek zasvěcený svatému Václavovi, patronovi české země, se slaví koncem září — nezaměňuj ho s jiným podzimním svátkem o měsíc později.",
    ],
    explanation: "Den české státnosti (28. září) je spojen se svatým Václavem, patronem české země.",
  },
  {
    q: "V tento den roku 1918 vznikl po rozpadu Rakouska-Uherska samostatný stát Čechů a Slováků. O jaký svátek jde a na jaké datum připadá?",
    key: "Den vzniku samostatného československého státu, 28. října",
    d: [
      { value: "Den české státnosti, 28. září", why: "Ten svátek je spojen se svatým Václavem, ne se vznikem Československa. Vznik Československa si připomínáme jako Den vzniku samostatného československého státu, 28. října." },
      { value: "Den vzniku samostatného československého státu, 28. září", why: "Název svátku je správně, ale datum patří jinému svátku, Dni české státnosti. Den vzniku samostatného československého státu připadá na 28. října." },
      { value: "Den obnovy samostatného českého státu, 1. ledna", why: "Ten svátek připomíná vznik samostatné ČR v roce 1993, ne vznik Československa v roce 1918. Vznik Československa si připomínáme 28. října." },
    ],
    hints: [
      "Přemýšlej, ke kterému roku a k jakému měsíci se váže rozpad Rakouska-Uherska a vznik společného státu Čechů a Slováků.",
      "Vznik samostatného Československa v roce 1918 si připomínáme koncem října, 28. října — jiný podzimní svátek je o měsíc dřív a týká se něčeho jiného.",
    ],
    explanation: "Den vzniku samostatného československého státu (28. října) připomíná vznik Československa v roce 1918.",
  },
  {
    q: "V tento den lidé pokládají svíčky na Národní třídě a připomínají si studentské demonstrace z roku 1939 i sametovou revoluci z roku 1989. O jaký svátek jde a na jaké datum připadá?",
    key: "Den boje za svobodu a demokracii, 17. listopadu",
    d: [
      { value: "Den vzniku samostatného československého státu, 28. října", why: "Ten svátek připomíná vznik Československa v roce 1918, ne studentské demonstrace. Svátek spojený s Národní třídou je Den boje za svobodu a demokracii, 17. listopadu." },
      { value: "Den boje za svobodu a demokracii, 28. října", why: "Název svátku je správně, ale datum patří jinému svátku. Den boje za svobodu a demokracii připadá na 17. listopadu." },
      { value: "Den vítězství, 8. května", why: "Ten svátek připomíná konec druhé světové války, ne studentské demonstrace. Svátek spojený s Národní třídou je Den boje za svobodu a demokracii, 17. listopadu." },
    ],
    hints: [
      "Přemýšlej, ve kterém podzimním měsíci se odehrály obě události, na které se svíčky pokládají.",
      "Studentské demonstrace z let 1939 i 1989 si připomínáme koncem podzimu, 17. listopadu.",
    ],
    explanation: "Den boje za svobodu a demokracii (17. listopadu) připomíná studentské demonstrace z roku 1939 i sametovou revoluci z roku 1989.",
  },
  {
    q: "V tento den roku 1945 umlkly v Evropě zbraně a skončila druhá světová válka. O jaký svátek jde a na jaké datum připadá?",
    key: "Den vítězství, 8. května",
    d: [
      { value: "Den boje za svobodu a demokracii, 17. listopadu", why: "Ten svátek připomíná studentské demonstrace 20. století, ne konec druhé světové války. Konec druhé světové války si připomínáme jako Den vítězství, 8. května." },
      { value: "Den vítězství, 5. července", why: "Název svátku je správně, ale datum patří jinému svátku, Dni slovanských věrozvěstů. Den vítězství připadá na 8. května." },
      { value: "Den vzniku samostatného československého státu, 28. října", why: "Ten svátek připomíná vznik Československa v roce 1918, ne konec druhé světové války. Konec druhé světové války si připomínáme 8. května." },
    ],
    hints: [
      "Přemýšlej, ve kterém ročním období roku 1945 v Evropě skončila druhá světová válka.",
      "Konec druhé světové války v Evropě si připomínáme na jaře, 8. května.",
    ],
    explanation: "Den vítězství (8. května) připomíná konec druhé světové války v Evropě v roce 1945.",
  },
  {
    q: "V tento den si lidé připomínají dva bratry ze Soluně, kteří na Velkou Moravu před více než tisíci lety přinesli písmo a bohoslužbu v jazyce, kterému lidé rozuměli. O jaký svátek jde a na jaké datum připadá?",
    key: "Den slovanských věrozvěstů Cyrila a Metoděje, 5. července",
    d: [
      { value: "Den upálení mistra Jana Husa, 6. července", why: "Ten svátek připomíná kazatele upáleného v Kostnici, ne příchod bratrů ze Soluně. Příchod Cyrila a Metoděje si připomínáme 5. července." },
      { value: "Den slovanských věrozvěstů Cyrila a Metoděje, 6. července", why: "Název svátku je správně, ale datum patří jinému, následujícímu svátku. Den slovanských věrozvěstů Cyrila a Metoděje připadá na 5. července." },
      { value: "Den české státnosti, 28. září", why: "Ten svátek je spojen se svatým Václavem, ne s bratry ze Soluně. Příchod Cyrila a Metoděje si připomínáme 5. července." },
    ],
    hints: [
      "Přemýšlej, ve kterém letním měsíci se slaví svátek dvou bratří, kteří na Velkou Moravu přinesli písmo.",
      "Příchod Cyrila a Metoděje na Velkou Moravu si připomínáme na začátku léta, 5. července.",
    ],
    explanation: "Den slovanských věrozvěstů Cyrila a Metoděje (5. července) připomíná příchod Cyrila a Metoděje na Velkou Moravu. Věrozvěst je ten, kdo šíří víru a učení mezi lidmi, kteří je ještě neznají.",
  },
  {
    q: "V tento den roku 1415 byl v německém městě Kostnice upálen český kazatel a reformátor. O jaký svátek jde a na jaké datum připadá?",
    key: "Den upálení mistra Jana Husa, 6. července",
    d: [
      { value: "Den slovanských věrozvěstů Cyrila a Metoděje, 5. července", why: "Ten svátek připomíná příchod bratrů ze Soluně, ne upálení kazatele. Upálení mistra Jana Husa si připomínáme 6. července." },
      { value: "Den upálení mistra Jana Husa, 5. července", why: "Název svátku je správně, ale datum patří jinému, předchozímu svátku. Den upálení mistra Jana Husa připadá na 6. července." },
      { value: "Den boje za svobodu a demokracii, 17. listopadu", why: "Ten svátek připomíná studentské demonstrace 20. století, ne upálení kazatele v roce 1415. Upálení mistra Jana Husa si připomínáme 6. července." },
    ],
    hints: [
      "Přemýšlej, ve kterém letním měsíci se slaví svátek spojený s Kostnicí a rokem 1415.",
      "Kazatele upáleného v Kostnici v roce 1415 si připomínáme hned den po svátku Cyrila a Metoděje, ne ve stejný den.",
    ],
    explanation: "Den upálení mistra Jana Husa (6. července) připomíná upálení Jana Husa v Kostnici v roce 1415.",
  },
  {
    q: "V tento den roku 1993 se společný stát Čechů a Slováků rozdělil a vznikla samostatná Česká republika. O jaký svátek jde a na jaké datum připadá?",
    key: "Den obnovy samostatného českého státu, 1. ledna",
    d: [
      { value: "Den vzniku samostatného československého státu, 28. října", why: "Ten svátek připomíná vznik Československa v roce 1918, ne jeho rozdělení v roce 1993. Rozdělení a vznik samostatné ČR si připomínáme 1. ledna." },
      { value: "Den obnovy samostatného českého státu, 28. října", why: "Název svátku je správně, ale datum patří jinému svátku z roku 1918. Den obnovy samostatného českého státu připadá na 1. ledna." },
      { value: "Den české státnosti, 28. září", why: "Ten svátek je spojen se svatým Václavem, ne s rozdělením Československa v roce 1993. Rozdělení státu si připomínáme 1. ledna." },
    ],
    hints: [
      "Přemýšlej, na který den v kalendáři roku 1993 připadl vznik samostatné České republiky.",
      "Samostatná Česká republika vznikla rozdělením Československa na začátku roku 1993, proto svátek připadá na první den roku, 1. ledna.",
    ],
    explanation: "Den obnovy samostatného českého státu (1. ledna) připomíná vznik samostatné České republiky v roce 1993.",
  },
  {
    q: "T. G. Masaryk stanul v čele státu, který vznikl v roce 1918 rozpadem Rakouska-Uherska. O jakou funkci a v jakém státě šlo?",
    key: "první prezident Československa",
    d: [
      { value: "první prezident České republiky", why: "Česká republika v roce 1918 ještě neexistovala jako samostatný stát, vznikla až v roce 1993. T. G. Masaryk stál v čele Československa, ne dnešní ČR." },
      { value: "král Československa", why: "Československo bylo republikou, nikdy nemělo krále. T. G. Masaryk zastával funkci prezidenta Československa." },
      { value: "poslední rakousko-uherský císař", why: "Rakousko-uherským císařem nikdy nebyl, naopak se zasloužil o rozpad Rakouska-Uherska a vznik samostatného státu. Byl prvním prezidentem nově vzniklého Československa." },
    ],
    hints: [
      "Přemýšlej, jak se jmenoval stát, který vznikl v roce 1918, a jestli tehdy vůbec existovala samostatná Česká republika.",
      "V roce 1918 vzniklo Československo, ne Česká republika (ta vznikla až mnohem později, v roce 1993) — T. G. Masaryk se stal jeho prvním prezidentem.",
    ],
    explanation: "T. G. Masaryk byl první prezident Československa, státu, který vznikl v roce 1918 — tehdy ještě samostatná Česká republika neexistovala.",
  },
  {
    q: "Na štítu jsou vedle sebe český lev, moravská orlice a slezská orlice, rozdělené do čtyř polí. O jaký symbol jde a o kterou jeho podobu konkrétně?",
    key: "znak, konkrétně velký státní znak",
    d: [
      { value: "znak, konkrétně malý státní znak", why: "Malý znak zobrazuje jen samotného lva, bez orlic. Štít se lvem i oběma orlicemi rozdělený na čtyři pole je velký státní znak." },
      { value: "vlajka, konkrétně její klín", why: "Vlajka je barevný list s pruhy a klínem, ne štít se lvem a orlicemi. Popsaný symbol je znak, konkrétně velký státní znak." },
      { value: "hymna, konkrétně její první sloka", why: "Hymna je píseň, ne štít s vyobrazenými zvířaty. Popsaný symbol je znak, konkrétně velký státní znak." },
    ],
    hints: [
      "Přemýšlej, kolik zvířat je na štítu popsáno a jestli jsou rozdělená do víc polí, nebo je tam jen jedno samotné.",
      "Vyobrazení lva i obou orlic zároveň na čtyřech polích štítu patří podrobnější, „velké“ podobě znaku — velkému státnímu znaku.",
    ],
    explanation: "Štít se čtyřmi poli, na kterých jsou český lev, moravská orlice a slezská orlice, je velký státní znak.",
  },
  {
    q: "Na červeném poli štítu je jen samotný stříbrný lev ve skoku, bez orlic a bez rozdělení na další pole. O jaký symbol jde a o kterou jeho podobu konkrétně?",
    key: "znak, konkrétně malý státní znak",
    d: [
      { value: "znak, konkrétně velký státní znak", why: "Velký znak má štít rozdělený na čtyři pole s lvem i oběma orlicemi. Štít jen s jedním lvem, bez rozdělení na pole, je malý státní znak." },
      { value: "vlajka, konkrétně její dolní pruh", why: "Vlajka je barevný list s pruhy a klínem, ne štít s vyobrazeným lvem. Popsaný symbol je znak, konkrétně malý státní znak." },
      { value: "hymna, konkrétně její melodie", why: "Hymna je píseň, ne štít s vyobrazeným zvířetem. Popsaný symbol je znak, konkrétně malý státní znak." },
    ],
    hints: [
      "Přemýšlej, o který ze státních symbolů jde, a jestli zobrazuje jen jedno zvíře, nebo víc najednou rozdělených na pole.",
      "Vyobrazení jen samotného lva, bez orlic a bez rozdělení štítu na další pole, patří zjednodušené, „malé“ podobě znaku — malému státnímu znaku.",
    ],
    explanation: "Štít jen s jedním zvířetem, samotným stříbrným lvem, bez orlic a bez dalších polí, je malý státní znak.",
  },
  {
    q: "Z písně Kde domov můj se při státních příležitostech zpívá jen jedna část. Která to je a jak se tenhle symbol nazývá?",
    key: "první sloka, státní hymna",
    d: [
      { value: "obě sloky, státní hymna", why: "Oficiální hymnou je jen první sloka písně, druhá sloka se při státních příležitostech nezpívá. Symbol se přesto nazývá státní hymna." },
      { value: "první sloka, státní znak", why: "Píseň, která se zpívá, se nenazývá znak (ten je vyobrazením na štítu), ale hymna. Zpívá se z ní jen první sloka." },
      { value: "druhá sloka, státní hymna", why: "Oficiální hymnou je právě první sloka, ne druhá. Název symbolu, státní hymna, je správně." },
    ],
    hints: [
      "Přemýšlej, jestli se z písně Kde domov můj zpívají obě sloky, nebo jen jedna, a jak se celý tenhle symbol jmenuje.",
      "Oficiální státní hymnou ČR je jen první sloka písně Kde domov můj, druhá sloka se při státních příležitostech nezpívá.",
    ],
    explanation: "Oficiální státní hymnou ČR je jen první sloka písně Kde domov můj.",
  },
  {
    q: "Lidé svého prvního prezidenta láskyplně nazývali „tatíček“. O koho šlo a jakou funkci zastával?",
    key: "T. G. Masaryk, první prezident Československa",
    d: [
      { value: "Edvard Beneš, první prezident Československa", why: "Edvard Beneš byl až druhým prezidentem Československa, ne prvním. Přezdívku „tatíček“ nesl T. G. Masaryk, první prezident Československa." },
      { value: "T. G. Masaryk, král Československa", why: "Československo bylo republikou a krále nikdy nemělo. T. G. Masaryk zastával funkci prezidenta, ne krále." },
      { value: "T. G. Masaryk, současný prezident České republiky", why: "T. G. Masaryk žil a zemřel dávno v minulosti, prezidentem dnešní ČR nikdy nebyl. Byl prvním prezidentem tehdy vzniklého Československa." },
    ],
    hints: [
      "Přemýšlej, o které historické osobnosti se mluví a jakou funkci v jakém státě zastávala.",
      "Přezdívku „tatíček“ nesl muž, který stál v čele nově vzniklého Československa jako jeho vůbec první hlava státu.",
    ],
    explanation: "Přezdívku „tatíček“ dostal T. G. Masaryk, první prezident Československa.",
  },
];

// ── L3 — přenos: scénář bez přímého jmenování, nebo jediný pravdivý výrok ──
const POOL_L3: Polozka[] = [
  {
    q: "Každý rok koncem září si lidé připomínají svatého Václava jako symbol české státnosti — jeho svatováclavská koruna se dodnes používá při korunovačních klenotech. O jaký svátek jde?",
    key: "Den české státnosti",
    d: [
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek si lidé připomínají o měsíc později, v říjnu, a souvisí se vznikem Československa v roce 1918, ne se svatým Václavem. Svátek spojený se svatým Václavem je Den české státnosti." },
      { value: "Den boje za svobodu a demokracii", why: "Ten svátek připomíná studentské demonstrace 20. století, ne svatého Václava a jeho korunu. Svátek spojený se svatým Václavem je Den české státnosti." },
      { value: "Den vítězství", why: "Ten svátek připomíná konec druhé světové války, ne svatého Václava. Svátek spojený se svatým Václavem je Den české státnosti." },
    ],
    hints: [
      "Přemýšlej, kterou historickou osobnost popis připomíná a v jakém ročním období se svátek slaví.",
      "Popis mluví o svatém Václavovi a jeho koruně jako symbolu státnosti — takový svátek slavíme koncem září, ne v říjnu nebo listopadu.",
    ],
    explanation: "Popsaná situace (svatý Václav, jeho koruna jako symbol státnosti) odpovídá Dni české státnosti (28. září).",
  },
  {
    q: "V listopadu lidé pokládají svíčky na Národní třídě v Praze a připomínají si, jak studenti v roce 1989 pokojně demonstrovali za svobodu. O jaký svátek jde?",
    key: "Den boje za svobodu a demokracii",
    d: [
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek si lidé připomínají v říjnu a souvisí se vznikem Československa v roce 1918, ne se studentskými demonstracemi z roku 1989. Svátek spojený s Národní třídou je Den boje za svobodu a demokracii." },
      { value: "Den české státnosti", why: "Ten svátek je spojen se svatým Václavem, ne se studentskými demonstracemi z roku 1989. Svátek spojený s Národní třídou je Den boje za svobodu a demokracii." },
      { value: "Den obnovy samostatného českého státu", why: "Ten svátek připomíná vznik samostatné ČR v roce 1993, ne studentské demonstrace z roku 1989. Svátek spojený s Národní třídou je Den boje za svobodu a demokracii." },
    ],
    hints: [
      "Přemýšlej, jaká konkrétní událost se v listopadu 1989 odehrála na místě, které se v popisu jmenuje.",
      "Svíčky na Národní třídě a vzpomínka na sametovou revoluci patří ke Dni boje za svobodu a demokracii.",
    ],
    explanation: "Popsaná situace (svíčky na Národní třídě, sametová revoluce 1989) odpovídá Dni boje za svobodu a demokracii (17. listopadu).",
  },
  {
    q: "Lidé si připomínají chvíli, kdy se po rozpadu Rakouska-Uherska poprvé v dějinách osamostatnil společný stát Čechů a Slováků. O jaký svátek jde?",
    key: "Den vzniku samostatného československého státu",
    d: [
      { value: "Den obnovy samostatného českého státu", why: "Ten svátek připomíná rozdělení společného státu Čechů a Slováků a vznik samostatné ČR v roce 1993, ne jeho první vznik po rozpadu Rakouska-Uherska. Popsaná situace odpovídá Dni vzniku samostatného československého státu." },
      { value: "Den české státnosti", why: "Ten svátek je spojen se svatým Václavem, ne s rozpadem Rakouska-Uherska. Popsaná situace odpovídá Dni vzniku samostatného československého státu." },
      { value: "Den boje za svobodu a demokracii", why: "Ten svátek připomíná studentské demonstrace 20. století, ne rozpad Rakouska-Uherska. Popsaná situace odpovídá Dni vzniku samostatného československého státu." },
    ],
    hints: [
      "Přemýšlej, o jaký společný stát šlo, když poprvé vznikl po rozpadu Rakouska-Uherska.",
      "První vznik společného státu Čechů a Slováků v roce 1918 si připomínáme na konci října — nezaměňuj ho s pozdějším rozdělením tohoto státu v roce 1993.",
    ],
    explanation: "Popsaná situace (první vznik společného státu Čechů a Slováků po rozpadu Rakouska-Uherska) odpovídá Dni vzniku samostatného československého státu (28. října).",
  },
  {
    q: "Lidé si připomínají chvíli, kdy po letech těžkých bojů v Evropě konečně umlkly zbraně a skončilo utrpení druhé světové války. O jaký svátek jde?",
    key: "Den vítězství",
    d: [
      { value: "Den boje za svobodu a demokracii", why: "Ten svátek připomíná studentské demonstrace z let 1939 a 1989, ne konec druhé světové války v roce 1945. Popsaná situace odpovídá Dni vítězství." },
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek připomíná vznik Československa v roce 1918, ne konec druhé světové války v roce 1945. Popsaná situace odpovídá Dni vítězství." },
      { value: "Den obnovy samostatného českého státu", why: "Ten svátek připomíná vznik samostatné ČR v roce 1993, ne konec druhé světové války. Popsaná situace odpovídá Dni vítězství." },
    ],
    hints: [
      "Přemýšlej, jaká celoevropská událost z roku 1945 se v popisu líčí.",
      "Konec druhé světové války v Evropě v roce 1945 si připomínáme na jaře, na začátku května.",
    ],
    explanation: "Popsaná situace (konec bojů a utrpení druhé světové války) odpovídá Dni vítězství (8. května).",
  },
  {
    q: "Lidé si připomínají příchod dvou bratří ze Soluně, kteří na Velkou Moravu před více než tisíci lety přinesli písmo a bohoslužbu v jazyce, kterému lidé rozuměli. O jaký svátek jde?",
    key: "Den slovanských věrozvěstů Cyrila a Metoděje",
    d: [
      { value: "Den upálení mistra Jana Husa", why: "Ten svátek připomíná kazatele upáleného v Kostnici v roce 1415, ne příchod bratrů ze Soluně na Velkou Moravu. Popsaná situace odpovídá Dni slovanských věrozvěstů Cyrila a Metoděje." },
      { value: "Den české státnosti", why: "Ten svátek je spojen se svatým Václavem, ne s příchodem bratrů ze Soluně. Popsaná situace odpovídá Dni slovanských věrozvěstů Cyrila a Metoděje." },
      { value: "Den vítězství", why: "Ten svátek připomíná konec druhé světové války, ne příchod bratrů ze Soluně na Velkou Moravu. Popsaná situace odpovídá Dni slovanských věrozvěstů Cyrila a Metoděje." },
    ],
    hints: [
      "Přemýšlej, odkud bratři přišli a co přesně na Velkou Moravu přinesli.",
      "Příchod Cyrila a Metoděje s písmem a srozumitelnou bohoslužbou na Velkou Moravu si připomínáme na začátku léta, den před svátkem připomínajícím Jana Husa.",
    ],
    explanation: "Popsaná situace (dva bratři ze Soluně, písmo a bohoslužba pro Velkou Moravu) odpovídá Dni slovanských věrozvěstů Cyrila a Metoděje (5. července). Věrozvěst je ten, kdo šíří víru a učení mezi lidmi, kteří je ještě neznají.",
  },
  {
    q: "Lidé si připomínají kazatele a reformátora, kterého kvůli jeho učení upálili na hranici v německém městě Kostnice. O jaký svátek jde?",
    key: "Den upálení mistra Jana Husa",
    d: [
      { value: "Den slovanských věrozvěstů Cyrila a Metoděje", why: "Ten svátek připomíná příchod bratrů ze Soluně na Velkou Moravu, ne upálení kazatele v Kostnici. Popsaná situace odpovídá Dni upálení mistra Jana Husa." },
      { value: "Den boje za svobodu a demokracii", why: "Ten svátek připomíná studentské demonstrace 20. století, ne upálení kazatele v roce 1415. Popsaná situace odpovídá Dni upálení mistra Jana Husa." },
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek připomíná vznik Československa v roce 1918, ne upálení kazatele v Kostnici. Popsaná situace odpovídá Dni upálení mistra Jana Husa." },
    ],
    hints: [
      "Přemýšlej, v jakém německém městě a za co byl kazatel odsouzen k smrti.",
      "Kazatel upálený v Kostnici v roce 1415 se jmenoval Jan Hus — svátek na jeho počest slavíme na začátku léta, den po svátku Cyrila a Metoděje.",
    ],
    explanation: "Popsaná situace (kazatel upálený v Kostnici) odpovídá Dni upálení mistra Jana Husa (6. července).",
  },
  {
    q: "Lidé si připomínají okamžik, kdy se po rozdělení společného státu Čechů a Slováků osamostatnila Česká republika jako vlastní, samostatný stát. O jaký svátek jde?",
    key: "Den obnovy samostatného českého státu",
    d: [
      { value: "Den vzniku samostatného československého státu", why: "Ten svátek připomíná vznik Československa v roce 1918, ne jeho pozdější rozdělení a vznik samostatné ČR v roce 1993. Popsaná situace odpovídá Dni obnovy samostatného českého státu." },
      { value: "Den české státnosti", why: "Ten svátek je spojen se svatým Václavem, ne s rozdělením Československa v roce 1993. Popsaná situace odpovídá Dni obnovy samostatného českého státu." },
      { value: "Den boje za svobodu a demokracii", why: "Ten svátek připomíná studentské demonstrace 20. století, ne rozdělení Československa v roce 1993. Popsaná situace odpovídá Dni obnovy samostatného českého státu." },
    ],
    hints: [
      "Přemýšlej, jaký stát tady poprvé vznikl jako úplně samostatný, oddělený od Slovenska.",
      "Vznik samostatné České republiky v roce 1993, po rozdělení Československa, si připomínáme na úplně první den kalendářního roku.",
    ],
    explanation: "Popsaná situace (osamostatnění České republiky po rozdělení Československa) odpovídá Dni obnovy samostatného českého státu (1. ledna).",
  },
  {
    q: "Které z těchto tvrzení o státní hymně ČR je pravdivé?",
    key: "Oficiální hymnou ČR je jen první sloka písně Kde domov můj.",
    d: [
      { value: "Oficiální hymnou ČR jsou obě sloky písně Kde domov můj.", why: "Při státních příležitostech se zpívá jen první sloka, druhá sloka není součástí oficiální hymny." },
      { value: "Oficiální hymnou ČR je píseň Nad Tatrou sa blýska.", why: "Tahle píseň je slovenská hymna. Samostatná Česká republika má vlastní hymnu, Kde domov můj." },
      { value: "Text i melodii státní hymny může každá vláda podle potřeby změnit.", why: "Podoba státní hymny se nemění podle rozhodnutí vlády. Oficiální hymnou zůstává trvale první sloka písně Kde domov můj." },
    ],
    hints: [
      "Přemýšlej, kolik slok písně Kde domov můj se doopravdy zpívá při státních příležitostech.",
      "U každého tvrzení zvlášť zkontroluj počet slok, název písně a kdo o její podobě rozhoduje.",
    ],
    explanation: "Oficiální státní hymnou ČR je jen první sloka písně Kde domov můj, ne obě sloky, ne jiná píseň a její podoba se nemění podle vlády.",
  },
  {
    q: "Které z těchto tvrzení o T. G. Masarykovi je pravdivé?",
    key: "T. G. Masaryk byl první prezident Československa.",
    d: [
      { value: "T. G. Masaryk byl král Československa.", why: "Československo bylo republikou a krále nikdy nemělo. T. G. Masaryk byl prezident, ne král." },
      { value: "T. G. Masaryk je současný prezident České republiky.", why: "T. G. Masaryk žil a zemřel dávno v minulosti, prezidentem dnešní ČR nikdy nebyl. Byl prvním prezidentem tehdy vzniklého Československa." },
      { value: "T. G. Masaryk byl prvním prezidentem samostatné České republiky, ne Československa.", why: "Samostatná Česká republika v jeho době ještě neexistovala, vznikla až v roce 1993. T. G. Masaryk byl prvním prezidentem Československa." },
    ],
    hints: [
      "Přemýšlej, jestli Československo vůbec mělo krále, a jestli T. G. Masaryk mohl být prezidentem státu, který v jeho době ještě neexistoval.",
      "U každého tvrzení ověř zvlášť funkci, dobu a stát, ke kterému se váže.",
    ],
    explanation: "T. G. Masaryk byl první prezident Československa, ne král, ne dnešní prezident ČR a ne prezident samostatné České republiky, která v jeho době ještě neexistovala.",
  },
  {
    q: "Které z těchto tvrzení o malém státním znaku ČR je pravdivé?",
    key: "Malý státní znak zobrazuje jen samotného českého lva.",
    d: [
      { value: "Malý státní znak zobrazuje českého lva i moravskou orlici.", why: "Lva i moravskou orlici zároveň zobrazuje velký státní znak. Malý znak zobrazuje jen samotného lva." },
      { value: "Malý státní znak je úplně stejný jako velký, jen zmenšený.", why: "Malý znak se od velkého neliší jen velikostí, ale i obsahem — vynechává obě orlice. Zobrazuje jen samotného lva." },
      { value: "Malý státní znak zobrazuje jen slezskou orlici.", why: "Slezská orlice je součástí velkého znaku spolu s dalšími poli, ne malého. Malý znak zobrazuje jen samotného lva." },
    ],
    hints: [
      "Přemýšlej, jestli se malý znak od velkého liší jen velikostí, nebo i tím, kolik zvířat na štítu vidíš.",
      "U každého tvrzení zvlášť spočítej, kolik zvířat na štítu tvrzení popisuje.",
    ],
    explanation: "Malý státní znak zobrazuje jen samotného českého lva, bez moravské i slezské orlice, které patří jen velkému znaku.",
  },
  {
    q: "Které z těchto tvrzení o státní vlajce ČR je pravdivé?",
    key: "Modrý klín na vlajce zasahuje od žerdi do poloviny délky listu.",
    d: [
      { value: "Modrý klín na vlajce zasahuje od žerdi až k opačnému okraji listu.", why: "Klín nezasahuje přes celou délku vlajky, ale jen do poloviny. Kdyby zasahoval až k opačnému okraji, pruhy by byly zcela rozdělené na dvě poloviny." },
      { value: "Vlajka ČR nemá žádný klín, jen tři vodorovné pruhy.", why: "Vlajka ČR modrý klín od žerdi skutečně má, není to jen trojice pruhů. Klín zasahuje do poloviny délky listu." },
      { value: "Modrý klín se nachází u dolního okraje vlajky, ne u žerdi.", why: "Klín vychází od žerdi (od okraje u žerdě), ne od dolního okraje listu. Zasahuje odtud do poloviny délky vlajky." },
    ],
    hints: [
      "Přemýšlej, odkud modrý klín na vlajce vychází a jak daleko na listu zasahuje.",
      "U každého tvrzení zvlášť ověř, odkud klín vychází a jak daleko na listu sahá.",
    ],
    explanation: "Modrý klín na státní vlajce ČR vychází od žerdi a zasahuje do poloviny délky listu, ne přes celou vlajku a ne od jiného okraje.",
  },
  {
    q: "Které z těchto tvrzení o velkém státním znaku ČR je pravdivé?",
    key: "Velký státní znak zobrazuje na čtvrceném štítu českého lva, moravskou orlici i slezskou orlici.",
    d: [
      { value: "Velký státní znak zobrazuje jen českého lva, stejně jako malý.", why: "Jen samotného lva zobrazuje malý znak. Velký znak navíc zobrazuje moravskou i slezskou orlici na čtvrceném štítu." },
      { value: "Velký státní znak zobrazuje moravskou orlici, ale bez českého lva.", why: "Velký znak zobrazuje lva i obě orlice zároveň, ne jen orlici bez lva. Lev na velkém znaku chybět nesmí." },
      { value: "Velký státní znak se používá jen na vlajce, ne na dokumentech.", why: "Znak se nepoužívá na vlajce (ta má klín, ne znak), ale třeba na úředních dokumentech a budovách. Velký znak zobrazuje lva i obě orlice na čtvrceném štítu." },
    ],
    hints: [
      "Přemýšlej, kolik zvířat velký znak zobrazuje a jestli je štít rozdělený na víc polí.",
      "U každého tvrzení zvlášť ověř, o kolika zvířatech mluví a jestli vůbec popisuje znak, ne jiný symbol.",
    ],
    explanation: "Velký státní znak zobrazuje na čtvrceném štítu českého lva, moravskou orlici i slezskou orlici zároveň.",
  },
];

// ── Generátor ────────────────────────────────────────────────────────────
function uloha(p: Polozka): PracticeTask | null {
  return choice(p.q, p.key, p.d, { hints: p.hints, explanation: p.explanation });
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  // Rotace bankou se nastaví tady, ne na úrovni modulu: dvě volání gen()
  // se stejným seedem tak dají stejné úlohy.
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => uloha(pool[i++ % pool.length])));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const STATNI_SYMBOLY_OSOBNOSTI_SVATKY_NASE_VLASTI: TopicMetadata[] = [
  {
    id: "g6-vko-statni-symboly-osobnosti-svatky-nase-vlasti-6",
    rvpNodeId:
      "g6-vko-clovek-ve-spolecnosti-nase-obec-region-vlast-nase-vlast-statni-symboly-vyznamne-osobnosti-svatky",
    displayName: "Státní symboly a svátky",
    title: "Naše vlast — státní symboly, T. G. Masaryk a státní svátky",
    studentTitle: "Státní symboly a svátky",
    subject: "vko",
    category: "Člověk ve společnosti",
    topic: "Naše obec, region, vlast",
    briefDescription: "Poznáš státní vlajku, znak, hymnu, T. G. Masaryka a státní svátky ČR.",
    keywords: [
      "státní vlajka", "státní znak", "velký znak", "malý znak", "státní hymna",
      "Kde domov můj", "T. G. Masaryk", "Masaryk", "prezident", "Československo",
      "státní svátek", "28. září", "28. října", "17. listopadu", "Den vítězství",
      "Cyril a Metoděj", "Jan Hus", "Den obnovy samostatného českého státu",
    ],
    goals: [
      "Rozpoznat státní vlajku, velký a malý státní znak a státní hymnu podle popisu.",
      "Přiřadit český státní svátek ke správnému datu a důvodu.",
      "Určit skutečnou roli T. G. Masaryka jako prvního prezidenta Československa.",
    ],
    boundaries: [
      "Jen stálá, historicky ukotvená fakta — žádný soudobý držitel úřadu.",
      "Bez obrázků, vše popsáno slovy (barvy, tvary, vyobrazení).",
      "Data a fakta podle zákonů o státních symbolech a státních svátcích.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Vlajka = barevný list s pruhy a klínem. Znak = štít se lvem (malý) nebo se lvem a orlicemi (velký). Hymna = píseň, zpívá se jen první sloka. T. G. Masaryk byl první prezident Československa, ne král ani dnešní prezident ČR.",
      steps: [
        "Rozhodni, jestli popis mluví o barevném listu (vlajka), štítu se zvířaty (znak) nebo písni (hymna).",
        "U svátku si spoj datum s důvodem, proč se slaví — každý podzimní i letní svátek má jiný důvod.",
        "U T. G. Masaryka si ověř, ke kterému státu (Československo, ne dnešní ČR) a k jaké funkci (prezident, ne král) se váže.",
      ],
      commonMistake: "Zaměnit vlajku a znak, splést si blízká podzimní data (28. 9. a 28. 10.), nebo si myslet, že T. G. Masaryk byl král nebo dnešní prezident ČR.",
      example: "28. října se slaví Den vzniku samostatného československého státu (1918) — nezaměňuj ho s 28. zářím, kdy je Den české státnosti.",
    },
  },
];
