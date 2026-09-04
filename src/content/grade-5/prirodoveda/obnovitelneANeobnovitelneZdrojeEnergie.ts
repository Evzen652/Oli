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
  { question: "Které z těchto zdrojů jsou neobnovitelné?", correctAnswer: "Uhlí, ropa, zemní plyn, uran", options: ["Vítr, slunce, voda, biomasa", "Uhlí, ropa, zemní plyn, uran", "Geotermální energie a sluneční záření", "Uhlí a vítr"], hints: ["Neobnovitelné = vznikaly miliony let, nelze doplnit."] },
  { question: "Jak vyrábějí solární panely elektřinu?", correctAnswer: "Fotovoltaickým jevem – sluneční světlo uvolňuje elektrony v křemíkových článcích", options: ["Zahříváním vody slunečním světlem a výrobou páry", "Akumulací tepla a jeho přeměnou na elektřinu", "Fotovoltaickým jevem – sluneční světlo uvolňuje elektrony v křemíkových článcích", "Odrážením světla na turbínu"], hints: ["'Foto' = světlo, 'volt' = elektrické napětí."] },
  { question: "Co je biomasa jako zdroj energie?", correctAnswer: "Organický materiál – dřevo, sláma, bioodpad spalovaný nebo přeměňovaný na plyn či kapalné palivo", options: ["Energie z pohybu moří a oceánů", "Energetická rezerva uložená v živých tělech zvířat", "Druh zemního plynu z bažin", "Organický materiál – dřevo, sláma, bioodpad spalovaný nebo přeměňovaný na plyn či kapalné palivo"], hints: ["Biomasa = biologický materiál."] },
  { question: "Co je hlavní nevýhoda spalování uhlí?", correctAnswer: "Uvolňuje CO₂, který způsobuje skleníkový efekt a globální oteplování", options: ["Uvolňuje CO₂, který způsobuje skleníkový efekt a globální oteplování", "Je velmi drahé a těžko dostupné", "Produkuje pouze vodní páru bez jiných vedlejších produktů", "Nelze ho používat v zimě"], hints: ["CO₂ = oxid uhličitý = skleníkový plyn."] },
  { question: "Jaká je výhoda jaderné energie oproti uhlí?", correctAnswer: "Produkuje málo CO₂ a z málo paliva dá hodně energie", options: ["Je levnější než výroba energie z uhlí", "Produkuje málo CO₂ a z málo paliva dá hodně energie", "Při jejím provozu nevzniká žádný odpad", "Je to plně obnovitelný zdroj energie"], hints: ["Nevýhoda jaderné energie je radioaktivní odpad."] },
  { question: "Jaká je největší vodní elektrárna v ČR?", correctAnswer: "Vodní elektrárna Orlík na řece Vltavě", options: ["Vodní elektrárna Lipno na Šumavě", "Temelín na řece Lužnici", "Vodní elektrárna Orlík na řece Vltavě", "Elektrárna Mělník na Labi"], hints: ["Orlík je přehrada na Vltavě."] },
  { question: "Co je geotermální energie?", correctAnswer: "Energie z tepla uvnitř Země – podzemní horká voda a pára", options: ["Energie ze Slunce uskladněná v zemi", "Teplo ze zemědělských kompostů", "Energie z chemických reakcí v půdě", "Energie z tepla uvnitř Země – podzemní horká voda a pára"], hints: ["'Geo' = Země, 'termální' = tepelný."] },
  { question: "Co jsou LED žárovky a proč šetří energii?", correctAnswer: "LED = světelná dioda, spotřebuje až 10× méně elektřiny než klasická žárovka při stejném světle", options: ["LED = světelná dioda, spotřebuje až 10× méně elektřiny než klasická žárovka při stejném světle", "LED jsou solární žárovky nabíjené přes den", "LED žárovky mají delší kabel a méně se zahřívají", "LED jsou žárovky plněné speciálním plynem šetřícím energii"], hints: ["LED neprodukuje tolik tepla jako starší typ žárovky se žhavicím vláknem."] },
  { question: "Proč jsou zásoby ropy a zemního plynu omezené?", correctAnswer: "Vznikly miliony let z odumřelých organismů – nové zásoby nevznikají v lidsky využitelném čase", options: ["Jsou skryté hluboko pod zemí a nelze je najít", "Vznikly miliony let z odumřelých organismů – nové zásoby nevznikají v lidsky využitelném čase", "Vlády omezují jejich těžbu, aby byly dostupné i v budoucnu", "Vypaří se při kontaktu se vzduchem"], hints: ["Fosilní paliva = uložená energie z dávné minulosti."] },
  { question: "Co je uhlíková stopa?", correctAnswer: "Množství CO₂ vyprodukované člověkem nebo produktem – doprava, výroba, jídlo", options: ["Stopa, kterou zanechá uhlí při těžbě v krajině", "Znečištění vody uhlíkovými sloučeninami", "Množství CO₂ vyprodukované člověkem nebo produktem – doprava, výroba, jídlo", "Přírodní uhlíkový cyklus v atmosféře"], hints: ["Menší uhlíková stopa = méně CO₂ = méně globálního oteplování."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak větrné turbíny vyrábějí elektřinu?", correctAnswer: "Vítr otáčí listy turbíny, ta pohání generátor, který mění pohybovou energii na elektřinu", options: ["Turbína sbírá vzdušný tlak a přeměňuje ho přímo na elektrické pole", "Vítr zahřívá páru, která pohání parní turbínu", "Turbína akumuluje elektrické náboje z větru do baterie", "Vítr otáčí listy turbíny, ta pohání generátor, který mění pohybovou energii na elektřinu"], hints: ["Generátor přeměňuje energii pohybu na elektrickou."] },
  { question: "Proč nemůžeme zásobovat celou zemi jen solárními panely a větrníky?", correctAnswer: "Jsou nestálé – nefungují, když nefouká vítr nebo nesvítí slunce. Vyžadují záložní zdroje nebo baterie pro ukládání energie.", options: ["Jsou nestálé – nefungují, když nefouká vítr nebo nesvítí slunce. Vyžadují záložní zdroje nebo baterie pro ukládání energie.", "Jsou příliš drahé na výrobu", "Produkují příliš mnoho elektřiny a sítě by to nezvládly", "Obnovitelné zdroje jsou spolehlivé, jen jejich kapacita nestačí"], hints: ["Hlavní nevýhoda obnovitelných zdrojů = nestálost (intermitentnost)."] },
  { question: "Jak přispívá tepelná izolace domu k úspoře energie?", correctAnswer: "Brání úniku tepla v zimě i jeho vnikání v létě", options: ["Izolace vyrábí teplo z vnějšího prostředí", "Brání úniku tepla v zimě i jeho vnikání v létě", "Izolace uchovává sluneční teplo na noční topení", "Tepelná izolace snižuje emise CO₂ přímo v ovzduší"], hints: ["Lepší izolace znamená, že teplo neutíká tak snadno ven ani dovnitř — proto se šetří energie na topení i chlazení."] },
  { question: "Proč je jaderná energie kontroverzní, přestože produkuje málo CO₂?", correctAnswer: "Produkuje radioaktivní odpad, který je nebezpečný tisíce let, a existuje riziko havárie – Černobyl, Fukušima", options: ["Je příliš drahá na provoz v porovnání s uhlím", "Spotřebovává obnovitelný uran, jehož zásoby se brzy vyčerpají", "Produkuje radioaktivní odpad, který je nebezpečný tisíce let, a existuje riziko havárie – Černobyl, Fukušima", "Jaderná energie produkuje CO₂ nepřímo přes chladící věže"], hints: ["Odpad z jaderné elektrárny zůstává nebezpečný kvůli záření po velmi dlouhou dobu."] },
  { question: "Jak elektrická auta snižují uhlíkovou stopu ve srovnání s benzínovými?", correctAnswer: "Neprodukují výfukové plyny, ale záleží, jak se vyrobila elektřina", options: ["Elektrická auta jsou ekologičtější vždy, bez jakékoli výjimky", "Elektrická auta produkují méně CO₂ pouze v zimě", "Výroba baterie je ekologická, proto je elektromobil vždy šetrnější", "Neprodukují výfukové plyny, ale záleží, jak se vyrobila elektřina"], hints: ["Záleží na zdroji elektřiny – elektřina z uhlí není zelená."] },
  { question: "Proč se v ČR staví více obnovitelných zdrojů energie?", correctAnswer: "EU požaduje snižování emisí CO₂ do roku 2050 – přechod na obnovitelné zdroje je zákonná povinnost i ekonomická příležitost", options: ["EU požaduje snižování emisí CO₂ do roku 2050 – přechod na obnovitelné zdroje je zákonná povinnost i ekonomická příležitost", "ČR nemá zásoby uhlí ani ropy, proto musí využívat obnovitelné zdroje", "Obnovitelné zdroje jsou v ČR levnější než uhlí", "Počasí v ČR je ideální pro solární a větrnou energii"], hints: ["Klimatická politika EU tlačí na přechod k zelené energetice."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli, proč je skleníkový efekt CO₂ problémem, ačkoli CO₂ je přirozenou součástí atmosféry.", correctAnswer: "Přirozený efekt Zemi ohřívá, ale lidé ho spalováním zesílili", options: ["Oxid uhličitý škodí vždy – i ten, který vzniká přirozeně.", "Přirozený efekt Zemi ohřívá, ale lidé ho spalováním zesílili", "Skleníkový efekt způsobuje jen metan z dobytka, ne CO₂.", "Oxid uhličitý se v atmosféře přirozeně nevyskytuje vůbec."], hints: ["Bez přirozeného skleníkového efektu by průměrná teplota Země byla −18 °C."] },
  { question: "Jak se liší přečerpávací elektrárna od běžné vodní elektrárny?", correctAnswer: "Přečerpávací elektrárna může elektřinu ukládat – v době přebytku elektřiny čerpá vodu do nádrže výše, v době nedostatku ji pouští dolů přes turbíny.", options: ["Přečerpávací elektrárna je větší verze vodní elektrárny.", "Přečerpávací elektrárna vyrábí elektřinu z podzemní vody.", "Přečerpávací elektrárna může elektřinu ukládat – v době přebytku elektřiny čerpá vodu do nádrže výše, v době nedostatku ji pouští dolů přes turbíny.", "Přečerpávací elektrárna filtruje vodu a jako vedlejší produkt vyrábí elektřinu."], hints: ["Pompe à chaleur = tepelné čerpadlo. Přečerpávací = baterie pro elektrosoustavu."] },
  { question: "Co by se stalo, kdybychom přestali používat fosilní paliva zítra?", correctAnswer: "Průmysl i doprava by se zastavily, přechod musí být postupný", options: ["Nic dramatického – slunce a vítr by spotřebu pokryly hned.", "Průmysl by přešel na jadernou energii během jednoho roku.", "Oxid uhličitý by ihned klesl a oteplování by se zastavilo.", "Průmysl i doprava by se zastavily, přechod musí být postupný"], hints: ["Zvaž, jestli by náhradní zdroje stihly nastoupit ze dne na den."] },
  { question: "Jak funguje vodíkový pohon jako alternativa k elektrickému autu?", correctAnswer: "V palivovém článku vzniká z vodíku a kyslíku elektřina a voda", options: ["V palivovém článku vzniká z vodíku a kyslíku elektřina a voda", "Vodík hoří v motoru podobně jako benzín, ale bez CO₂.", "Vodíkové auto pohání baterie, vodík slouží jen jako záloha.", "Vodík se skladuje jako kapalina a na elektřinu se mění zahřátím."], hints: ["Zamysli se, co vznikne, když se vodík spojí s kyslíkem."] },
  { question: "Proč jsou fosilní paliva tak levná, přestože škodí klimatu?", correctAnswer: "V ceně nejsou započítány škody, které způsobí na klimatu", options: ["Mají nižší výrobní náklady než výroba solárních panelů.", "V ceně nejsou započítány škody, které způsobí na klimatu", "Cenu ropy určuje příroda – čím je jí méně, tím je levnější.", "Fosilní paliva dotují vlády, aby podpořily přechod na čisté zdroje."], hints: ["Zamysli se, jestli cena zahrnuje úplně všechny následky."] },
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
