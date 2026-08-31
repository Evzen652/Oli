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
  { question: "Jaký je plod dubu?", correctAnswer: "Žalud", options: ["Žalud", "Šiška", "Bukev", "Jablko"] },
  { question: "Jaký je plod buku?", correctAnswer: "Bukev, trojhranný oříšek", options: ["Žalud jako u dubu", "Bukev, trojhranný oříšek", "Šiška se semínky", "Kaštan v ostnaté slupce"] },
  { question: "Jak poznáš břízu?", correctAnswer: "Bílá kůra s tmavými šmuhami", options: ["Bílá kůra s tmavými šmuhami", "Červená kůra", "Šupinkovitá hnědá kůra", "Hladká zelená kůra"] },
  { question: "Který strom je národní strom České republiky?", correctAnswer: "Lípa", options: ["Lípa", "Dub", "Bříza", "Smrk"] },
  { question: "Co je jehličnan?", correctAnswer: "Strom s jehlicemi místo listů", options: ["Strom s jehlicemi místo listů", "Strom s kulatými listy", "Keř s ostnatými větvemi", "Strom s drobnými kvítky"] },
  { question: "Jak se jmenuje jehličnan s šiškami otočenými dolů?", correctAnswer: "Smrk", options: ["Smrk", "Borovice", "Jedle", "Modřín"] },
  { question: "Který jehličnan je jediný opadavý (na podzim ztrácí jehličí)?", correctAnswer: "Modřín", options: ["Modřín", "Smrk", "Borovice", "Jedle"] },
  { question: "Jaký je rozdíl mezi stromem a keřem?", correctAnswer: "Strom má 1 hlavní kmen, keř roste z více stonků od země", options: ["Strom má 1 hlavní kmen, keř roste z více stonků od země", "Strom je vyšší než 10 m, keř je nižší", "Strom je listnatý, keř jehličnatý", "Keř neroste v lese, strom ano"] },
  { question: "Jaký keř má voňavé fialové nebo bílé květy?", correctAnswer: "Šeřík", options: ["Šeřík", "Bez černý", "Hloh", "Zimolez"] },
  { question: "Jaké plody má bez černý?", correctAnswer: "Černé drobné bobule v okolíku", options: ["Červené kulaté bobule", "Černé drobné bobule v okolíku", "Žluté šišky s pryskyřicí", "Hnědé oříšky ve slupce"] },
  { question: "Jak se jmenuje jehličnan s jehlicemi ve skupinkách po 2?", correctAnswer: "Borovice", options: ["Borovice", "Smrk", "Jedle", "Modřín"] },
  { question: "Jaký keř dává jedlé červené nebo černé bobule?", correctAnswer: "Rybíz", options: ["Rybíz", "Hloh", "Šeřík", "Zimolez"] },
  { question: "Jak se jmenuje jehličnan, jehož šišky stojí vzpřímeně na větvích?", correctAnswer: "Jedle", options: ["Jedle", "Smrk", "Borovice", "Modřín"] },
  { question: "Jak vysoký musí být strom?", correctAnswer: "Výše než 5 metrů s jedním hlavním kmenem", options: ["Výše než 5 metrů s jedním hlavním kmenem", "Výše než 2 metry", "Výše než 10 metrů", "Jakákoliv výška s dřevnatým kmenem"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší listnatý strom od jehličnatého?", correctAnswer: "Listnatý má listy, jehličnatý jehlice", options: ["Listnatý má vždycky větší listy", "Listnatý má listy, jehličnatý jehlice", "Jehličnatý opadá, listnatý ne", "Listnatý roste jen v teple"] },
  { question: "Proč je tis (Taxus) nebezpečný?", correctAnswer: "Téměř všechny jeho části jsou jedovaté – vyjma dužiny u arilu", options: ["Téměř všechny jeho části jsou jedovaté – vyjma dužiny u arilu", "Není jedovatý — jen alergizující", "Jen jehličí je jedovaté, plody jsou bezpečné", "Tis není jedovatý"] },
  { question: "Proč modřín ztrácí jehličí na podzim?", correctAnswer: "Je to přizpůsobení šetřící vodu a energii v zimě — jediný opadavý jehličnan", options: ["Je to přizpůsobení šetřící vodu a energii v zimě — jediný opadavý jehličnan", "Modřín je ve skutečnosti listnatý strom", "Ztrácí jehličí jen při suchu", "Modřín ztrácí jehličí jen v mrazivých oblastech"] },
  { question: "Co je angrešt?", correctAnswer: "Keř s trny a jedlými plody", options: ["Druh drobného ovocného stromku", "Keř s trny a jedlými plody", "Plevelná bylina na loukách", "Druh dubu s malými žaludy"] },
  { question: "Čím je lípa významná jako národní strom ČR?", correctAnswer: "Je symbolem Čechů a Slovanů", options: ["Je nejrozšířenější strom v ČR", "Je symbolem Čechů a Slovanů", "Je nejstarší strom na světě", "Dává jedlé plody jako jabloň"] },
  { question: "Jaká je funkce šišek u jehličnanů?", correctAnswer: "Chrání semena — šišky se otevřou a uvolní semena pro rozmnožování", options: ["Chrání semena — šišky se otevřou a uvolní semena pro rozmnožování", "Sbírají vodu pro strom", "Slouží jako potravu pro strom v zimě", "Přitahují hmyz pro opylení"] },
  { question: "Jak se jmenuje plod javoru a jak se šíří?", correctAnswer: "Nažka s křídlem, letí větrem", options: ["Šiška otevírající se teplem", "Nažka s křídlem, letí větrem", "Bobule pojídaná ptáky", "Oříšek přenášený mravenci"] },
  { question: "Jak je dub přizpůsoben suchému prostředí?", correctAnswer: "Hluboké kořeny čerpají vodu", options: ["Opadává dřív než jiné stromy", "Hluboké kořeny čerpají vodu", "Ukládá vodu v silné kůře", "Jehlice omezují výpar vody"] },
  { question: "Jak se liší plody hlohu od plodů šípku?", correctAnswer: "Hloh má tvrdá jablíčka, šípek měkké plody", options: ["Šípek má tvrdá jablíčka, hloh měkké plody", "Hloh má tvrdá jablíčka, šípek měkké plody", "Šípek má modré plody, hloh červené", "Hloh je jedovatý, šípek jedlý"] },
  { question: "Co je dendrology?", correctAnswer: "Vědecký obor studující stromy a dřeviny", options: ["Vědecký obor studující stromy a dřeviny", "Věda o pěstování ovoce", "Věda o lesní ekologii", "Nauka o dřevorubectví"] },
  { question: "Jak rozpoznáš smrk od jedle?", correctAnswer: "Smrk: šišky dolů. Jedle: nahoru.", options: ["Smrk: šišky nahoru. Jedle: dolů.", "Smrk: šišky dolů. Jedle: nahoru.", "Smrk má ploché jehlice, jedle ostré.", "Nejde je od sebe rozlišit."] },
  { question: "Co je kalina a k čemu ji lze využít?", correctAnswer: "Keř s bílými květy a červenými plody", options: ["Druh lípy s aromatickými listy", "Keř s bílými květy a červenými plody", "Jedovatý strom s červenou kůrou", "Tráva rostoucí v mokřadech"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč jsou smrkové monokultury ekologickým problémem?", correctAnswer: "Málo druhů a snadný útok kůrovce", options: ["Smrk se do Česka hodí bez problémů", "Málo druhů a snadný útok kůrovce", "Problém je jen v tom, že jsou nudné", "Jsou odolnější než smíšené lesy"] },
  { question: "Co je letokruh?", correctAnswer: "Jeden kruh ve dřevě za rok", options: ["Je to obvod kmene stromu", "Jeden kruh ve dřevě za rok", "Stáří určíme jen z výšky", "Jeden kruh znamená dva roky"] },
  { question: "Jak probíhá větrné opylování u jehličnanů?", correctAnswer: "Peyl – pyl je velmi lehký, produkuje se v obrovském množství a větrem se přenáší na samičí šišky", options: ["Peyl – pyl je velmi lehký, produkuje se v obrovském množství a větrem se přenáší na samičí šišky", "Jehličnany jsou opylovány hmyzem jako listnaté stromy", "Jehličnany se rozmnožují spórami, ne pylem", "Pyl jehličnanů se šíří vodou"] },
  { question: "Jaký ekologický vliv mají stromy na mikroklima okolí?", correctAnswer: "Snižují teplotu – stín + transpirace , zadržují vodu, tlumí vítr a snižují prašnost", options: ["Snižují teplotu – stín + transpirace , zadržují vodu, tlumí vítr a snižují prašnost", "Stromy zvyšují místní teplotu v létě", "Stromy nemají vliv na mikroklima", "Stromy pouze produkují O₂ bez jiných efektů"] },
  { question: "Co je allelopatie u rostlin?", correctAnswer: "Produkce chemických látek, které inhibují růst jiných rostlin v okolí – např. vlašský ořech", options: ["Produkce chemických látek, které inhibují růst jiných rostlin v okolí – např. vlašský ořech", "Schopnost rostlin rozpoznat sousední druhy opticky", "Spolupráce dvou druhů stromů při sdílení živin", "Druh parazitismu mezi stromy"] },
  { question: "Proč jsou staré duby zvláště cenné pro biodiverzitu?", correctAnswer: "Dutiny poskytují hnízdiště, odumřelé dřevo je stanovištěm pro stovky druhů bezobratlých a hub", options: ["Dutiny poskytují hnízdiště, odumřelé dřevo je stanovištěm pro stovky druhů bezobratlých a hub", "Staré duby nemají vyšší ekologickou hodnotu než mladé", "Staré duby jsou jen nebezpečné — měly by se kácet", "Staré duby jsou cenné jen pro dřevorubce"] },
  { question: "Jak se šíří semena lípy?", correctAnswer: "Větrem, křídlatý listen jako vrtulka", options: ["Ptáky, kteří semena pozřou", "Větrem, křídlatý listen jako vrtulka", "Mravenci, kteří je odnesou", "Vodou v potocích a řekách"] },
  { question: "Jaký je rozdíl mezi původním a znovu vysazeným lesem?", correctAnswer: "Původní má víc druhů rostlin i zvířat", options: ["Znovu vysazený má víc druhů", "Původní má víc druhů rostlin i zvířat", "Oba mají stejně druhů", "Původní les je vždy mladší"] },
  { question: "Jak se les sám obnoví na vykácené pasece?", correctAnswer: "Nejdřív trávy, pak keře, nakonec stromy", options: ["Hned vyrostou znovu vysoké stromy", "Nejdřív trávy, pak keře, nakonec stromy", "Nic tam nevyroste bez vysazení", "Vyrostou hned vysoké jehličnany"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const DREVINYSTROMYAKERE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-dreviny-stromy-a-kere",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-dreviny-stromy-a-kere",
    title: "Dřeviny - stromy a keře",
    studentTitle: "Stromy a keře",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš listnaté a jehličnaté stromy a naučíš se rozeznávat keře v přírodě.",
    keywords: ["strom", "keř", "dub", "buk", "bříza", "smrk", "borovice", "jedle", "modřín", "šeřík", "bez"],
    goals: [
      "Rozlišit strom a keř",
      "Jmenovat typické listnaté a jehličnaté stromy s jejich plody",
      "Uvést příklady keřů a jejich plodů",
      "Vysvětlit, proč je modřín zvláštní jehličnan",
    ],
    boundaries: ["Podrobná botanická systematika není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Strom = 1 kmen, výška >5 m. Keř = více stonků od země.",
      steps: [
        "1. Dub → žalud, buk → bukev, bříza → bílá kůra.",
        "2. Smrk → šišky dolů. Borovice → šišky nahoru. Jedle → šišky stojí. Modřín → jediný opadavý jehličnan.",
        "3. Tis → jedovatý. Šeřík → voní. Rybíz → jedlé bobule.",
      ],
      commonMistake: "Modřín je jehličnan, ale opadává — žáci ho zaměňují s listnatým stromem.",
      example: "Smrk má šišky visící dolů, jedle má šišky stojící vzpřímeně na větvích.",
    },
  },
];
