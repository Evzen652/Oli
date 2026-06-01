import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Co jsou obnovitelné zdroje energie?", correctAnswer: "Zdroje, které se přirozeně doplňují a nevyčerpají se – slunce, vítr, voda", options: ["Zdroje, které se přirozeně doplňují a nevyčerpají se – slunce, vítr, voda", "Zdroje, které lze obnovit těžbou z jiných míst", "Zdroje, které mají neomezené zásoby v zemi", "Zdroje, které se obnoví za 100 let"], hints: ["Slunce svítí každý den – je nevyčerpatelné."] },
  { question: "Které z těchto zdrojů jsou neobnovitelné?", correctAnswer: "Uhlí, ropa, zemní plyn, uran", options: ["Uhlí, ropa, zemní plyn, uran", "Vítr, slunce, voda, biomasa", "Geotermální energie a sluneční záření", "Uhlí a vítr"], hints: ["Neobnovitelné = vznikaly miliony let, nelze doplnit."] },
  { question: "Jak vyrábějí solární panely elektřinu?", correctAnswer: "Fotovoltaickým jevem – sluneční světlo uvolňuje elektrony v křemíkových článcích", options: ["Fotovoltaickým jevem – sluneční světlo uvolňuje elektrony v křemíkových článcích", "Zahříváním vody slunečním světlem a výrobou páry", "Akumulací tepla a jeho přeměnou na elektřinu", "Odrážením světla na turbínu"], hints: ["'Foto' = světlo, 'volt' = elektrické napětí."] },
  { question: "Co je biomasa jako zdroj energie?", correctAnswer: "Organický materiál – dřevo, sláma, bioodpad spalovaný nebo přeměňovaný na plyn či kapalné palivo", options: ["Organický materiál – dřevo, sláma, bioodpad spalovaný nebo přeměňovaný na plyn či kapalné palivo", "Energie z pohybu moří a oceánů", "Energetická rezerva uložená v živých tělech zvířat", "Druh zemního plynu z bažin"], hints: ["Biomasa = biologický materiál."] },
  { question: "Co je hlavní nevýhoda spalování uhlí?", correctAnswer: "Uvolňuje CO₂, který způsobuje skleníkový efekt a globální oteplování", options: ["Uvolňuje CO₂, který způsobuje skleníkový efekt a globální oteplování", "Je velmi drahé a těžko dostupné", "Produkuje pouze vodní páru bez jiných vedlejších produktů", "Nelze ho používat v zimě"], hints: ["CO₂ = oxid uhličitý = skleníkový plyn."] },
  { question: "Jaká je výhoda jaderné energie oproti uhlí?", correctAnswer: "Produkuje velmi málo CO₂ a má velký výkon z malého množství paliva", options: ["Produkuje velmi málo CO₂ a má velký výkon z malého množství paliva", "Je levnější než uhlí", "Nevzniká žádný odpad", "Je plně obnovitelná"], hints: ["Nevýhoda jaderné energie je radioaktivní odpad."] },
  { question: "Jaká je největší vodní elektrárna v ČR?", correctAnswer: "Vodní elektrárna Orlík na řece Vltavě", options: ["Vodní elektrárna Orlík na řece Vltavě", "Vodní elektrárna Lipno na Šumavě", "Temelín na řece Lužnici", "Elektrárna Mělník na Labi"], hints: ["Orlík je přehrada na Vltavě."] },
  { question: "Co je geotermální energie?", correctAnswer: "Energie z tepla uvnitř Země – podzemní horká voda a pára", options: ["Energie z tepla uvnitř Země – podzemní horká voda a pára", "Energie ze Slunce uskladněná v zemi", "Teplo ze zemědělských kompostů", "Energie z chemických reakcí v půdě"], hints: ["'Geo' = Země, 'termální' = tepelný."] },
  { question: "Co jsou LED žárovky a proč šetří energii?", correctAnswer: "LED = světelná dioda, spotřebuje až 10× méně elektřiny než klasická žárovka při stejném světle", options: ["LED = světelná dioda, spotřebuje až 10× méně elektřiny než klasická žárovka při stejném světle", "LED jsou solární žárovky nabíjené přes den", "LED žárovky mají delší kabel a méně se zahřívají", "LED jsou žárovky plněné speciálním plynem šetřícím energii"], hints: ["LED neprodukuje tolik tepla jako klasická žárovka."] },
  { question: "Proč jsou zásoby ropy a zemního plynu omezené?", correctAnswer: "Vznikly miliony let z odumřelých organismů – nové zásoby nevznikají v lidsky využitelném čase", options: ["Vznikly miliony let z odumřelých organismů – nové zásoby nevznikají v lidsky využitelném čase", "Jsou skryté hluboko pod zemí a nelze je najít", "Vlády omezují jejich těžbu, aby byly dostupné i v budoucnu", "Vypaří se při kontaktu se vzduchem"], hints: ["Fosilní paliva = uložená energie z dávné minulosti."] },
  { question: "Co je uhlíková stopa?", correctAnswer: "Množství CO₂ vyprodukované člověkem nebo produktem – doprava, výroba, jídlo", options: ["Množství CO₂ vyprodukované člověkem nebo produktem – doprava, výroba, jídlo", "Stopa, kterou zanechá uhlí při těžbě v krajině", "Znečištění vody uhlíkovými sloučeninami", "Přírodní uhlíkový cyklus v atmosféře"], hints: ["Menší uhlíková stopa = méně CO₂ = méně globálního oteplování."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak větrné turbíny vyrábějí elektřinu?", correctAnswer: "Vítr otáčí listy turbíny, ta pohání generátor, který mění pohybovou energii na elektřinu", options: ["Vítr otáčí listy turbíny, ta pohání generátor, který mění pohybovou energii na elektřinu", "Turbína sbírá vzdušný tlak a přeměňuje ho přímo na elektrické pole", "Vítr zahřívá páru, která pohání parní turbínu", "Turbína akumuluje elektrické náboje z větru do baterie"], hints: ["Generátor přeměňuje pohybovou energii na elektrickou."] },
  { question: "Proč nemůžeme zásobovat celou zemi jen solárními panely a větrníky?", correctAnswer: "Jsou nestálé – nefungují, když nefouká vítr nebo nesvítí slunce. Vyžadují záložní zdroje nebo baterie pro ukládání energie.", options: ["Jsou nestálé – nefungují, když nefouká vítr nebo nesvítí slunce. Vyžadují záložní zdroje nebo baterie pro ukládání energie.", "Jsou příliš drahé na výrobu", "Produkují příliš mnoho elektřiny a sítě by to nezvládly", "Obnovitelné zdroje jsou spolehlivé, jen jejich kapacita nestačí"], hints: ["Hlavní nevýhoda obnovitelných zdrojů = nestálost (intermitentnost)."] },
  { question: "Jak přispívá tepelná izolace domu k úspoře energie?", correctAnswer: "Zabraňuje úniku tepla v zimě a přístupu tepla v létě – kotel i klimatizace spotřebují méně energie", options: ["Zabraňuje úniku tepla v zimě a přístupu tepla v létě – kotel i klimatizace spotřebují méně energie", "Izolace vyrábí teplo z vnějšího prostředí", "Izolace uchovává solární energii pro noční topení", "Tepelná izolace snižuje emise CO₂ přímo v ovzduší"], hints: ["Méně úniku tepla = nižší spotřeba energie na vytápění."] },
  { question: "Proč je jaderná energie kontroverzní, přestože produkuje málo CO₂?", correctAnswer: "Produkuje radioaktivní odpad, který je nebezpečný tisíce let, a existuje riziko havárie – Černobyl, Fukušima", options: ["Produkuje radioaktivní odpad, který je nebezpečný tisíce let, a existuje riziko havárie – Černobyl, Fukušima", "Je příliš drahá na provoz v porovnání s uhlím", "Spotřebovává obnovitelný uran, jehož zásoby se brzy vyčerpají", "Jaderná energie produkuje CO₂ nepřímo přes chladící věže"], hints: ["Radioaktivní odpad = odpad, který vyzařuje záření po staletí."] },
  { question: "Jak elektrická auta snižují uhlíkovou stopu ve srovnání s benzínovými?", correctAnswer: "Elektrická auta neprodukují výfukové plyny přímo. Jejich celkový dopad závisí na tom, jak je vyrobena elektřina – uhlí vs. obnovitelné zdroje .", options: ["Elektrická auta neprodukují výfukové plyny přímo. Jejich celkový dopad závisí na tom, jak je vyrobena elektřina – uhlí vs. obnovitelné zdroje .", "Elektrická auta jsou celkově ekologičtější vždy, bez výjimky", "Elektrická auta produkují méně CO₂ pouze v zimě", "Výroba baterie je ekologická, proto je el. auto vždy šetrnější"], hints: ["Záleží na zdroji elektřiny – elektřina z uhlí není zelená."] },
  { question: "Proč se v ČR staví více obnovitelných zdrojů energie?", correctAnswer: "EU požaduje snižování emisí CO₂ do roku 2050 – přechod na obnovitelné zdroje je zákonná povinnost i ekonomická příležitost", options: ["EU požaduje snižování emisí CO₂ do roku 2050 – přechod na obnovitelné zdroje je zákonná povinnost i ekonomická příležitost", "ČR nemá zásoby uhlí ani ropy, proto musí využívat obnovitelné zdroje", "Obnovitelné zdroje jsou v ČR levnější než uhlí", "Počasí v ČR je ideální pro solární a větrnou energii"], hints: ["Klimatická politika EU tlačí na přechod k zelené energetice."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli, proč je skleníkový efekt CO₂ problémem, ačkoli CO₂ je přirozenou součástí atmosféry.", correctAnswer: "Přirozený skleníkový efekt udržuje Zemi teplou (o 33 °C tepleji). Lidská činnost – spalování fosilních paliv zvýšila CO₂ nad přirozené meze → extra teplo → klimatická změna.", options: ["Přirozený skleníkový efekt udržuje Zemi teplou (o 33 °C tepleji). Lidská činnost – spalování fosilních paliv zvýšila CO₂ nad přirozené meze → extra teplo → klimatická změna.", "CO₂ je škodlivý vždy – i přirozený CO₂ způsobuje problémy.", "Skleníkový efekt je způsoben pouze metanem z dobytka, ne CO₂.", "CO₂ se v atmosféře přirozeně neobjevuje – pochází jen z průmyslu."], hints: ["Bez přirozeného skleníkového efektu by průměrná teplota Země byla −18 °C."] },
  { question: "Jak se liší přečerpávací elektrárna od běžné vodní elektrárny?", correctAnswer: "Přečerpávací elektrárna může elektřinu ukládat – v době přebytku elektřiny čerpá vodu do nádrže výše, v době nedostatku ji pouští dolů přes turbíny.", options: ["Přečerpávací elektrárna může elektřinu ukládat – v době přebytku elektřiny čerpá vodu do nádrže výše, v době nedostatku ji pouští dolů přes turbíny.", "Přečerpávací elektrárna je větší verze vodní elektrárny.", "Přečerpávací elektrárna vyrábí elektřinu z podzemní vody.", "Přečerpávací elektrárna filtruje vodu a jako vedlejší produkt vyrábí elektřinu."], hints: ["Pompe à chaleur = tepelné čerpadlo. Přečerpávací = baterie pro elektrosoustavu."] },
  { question: "Co by se stalo, kdybychom přestali používat fosilní paliva zítra?", correctAnswer: "Globálně by selhal průmysl, doprava a vytápění, protože obnovitelné zdroje a sítě pro přenos energie nejsou na to připraveny – přechod musí být postupný.", options: ["Globálně by selhal průmysl, doprava a vytápění, protože obnovitelné zdroje a sítě pro přenos energie nejsou na to připraveny – přechod musí být postupný.", "Nic dramatického – slunce a vítr by okamžitě pokryly veškerou spotřebu.", "Průmysl by přešel na jadernou energii do 1 roku.", "CO₂ by ihned klesl na přirozené úrovně a klimatická změna by se zastavila."], hints: ["Energetická transformace = postupný, ne skokový proces."] },
  { question: "Jak funguje vodíkový pohon jako alternativa k elektrickému autu?", correctAnswer: "Vodík reaguje v palivovém článku s kyslíkem → vzniká elektřina a voda – žádné emise . Výzva: výroba zeleného vodíku z obnovitelné elektřiny je zatím drahá.", options: ["Vodík reaguje v palivovém článku s kyslíkem → vzniká elektřina a voda – žádné emise . Výzva: výroba zeleného vodíku z obnovitelné elektřiny je zatím drahá.", "Vodík hoří v motoru jako benzín, ale bez CO₂.", "Vodíkové auto je napájeno baterií z vodíku – záloha benzínu.", "Vodík je skladován jako kapalina a přeměňován na elektřinu zahřátím."], hints: ["H₂ + O₂ → H₂O + elektřina = čistý provoz."] },
  { question: "Proč jsou fosilní paliva tak levná, přestože jsou škodlivá pro klimat?", correctAnswer: "Historicky nebyla zahrnuty náklady na klimatické škody – externality . Fosilní paliva mají obrovskou hustotu energie a existující infrastrukturu. Přechod na OZE narušuje zájmy těžebních firem.", options: ["Historicky nebyla zahrnuty náklady na klimatické škody – externality . Fosilní paliva mají obrovskou hustotu energie a existující infrastrukturu. Přechod na OZE narušuje zájmy těžebních firem.", "Fosilní paliva jsou levnější, protože mají nižší výrobní náklady než solární panely.", "Cena ropy je určena přírodou – čím je jí méně, tím je levnější.", "Fosilní paliva dotují vlády, aby motivovaly k přechodu na OZE."], hints: ["Externality = náklady, které nenese výrobce, ale společnost."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const OBNOVITELNEANEOBNOVITELNEZDROJEENERGIE: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie",
    title: "Obnovitelné a neobnovitelné zdroje energie",
    studentTitle: "Zdroje energie",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Energie a její zdroje",
    briefDescription: "Poznáš rozdíl mezi obnovitelnými a neobnovitelnými zdroji energie.",
    keywords: ["obnovitelné", "neobnovitelné", "uhlí", "ropa", "slunce", "vítr", "solární", "CO₂", "skleníkový efekt"],
    goals: ["Rozlišit obnovitelné a neobnovitelné zdroje energie", "Popsat výhody a nevýhody různých zdrojů", "Vysvětlit skleníkový efekt a uhlíkovou stopu"],
    boundaries: ["Neprobírá energetiku na úrovni fyziky", "Neprobírá ekonomii energetiky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Obnovitelné: slunce, vítr, voda, biomasa, geotermální. Neobnovitelné: uhlí, ropa, zemní plyn, uran.",
      steps: [
        "1. Obnovitelné: nevyčerpatelné v lidském časovém horizontu.",
        "2. Neobnovitelné: vznikaly miliony let – zásoby jsou konečné.",
        "3. Spalování fosilních paliv → CO₂ → skleníkový efekt.",
        "4. Úspora energie: LED, izolace, veřejná doprava.",
      ],
      commonMistake: "Jaderná energie NENÍ obnovitelná – uran je neobnovitelný nerost.",
      example: "Solární panely = obnovitelné. Uhlí = neobnovitelné + CO₂.",
    },
  },
];
