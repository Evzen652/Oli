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
  {
    question: "Co je umělecký text?",
    correctAnswer: "text, jehož cílem je estetický zážitek – básně, romány, povídky",
    options: [
      "text s přesnými fakty",
      "text, jehož cílem je estetický zážitek – básně, romány, povídky",
      "návod k použití",
      "zpráva v novinách",
    ],
    hints: ["Umělecký = literatura. Cíl = krása, emoce, příběh."],
  },
  {
    question: "Co je věcný (neumělecký) text?",
    correctAnswer: "text, jehož cílem je předat informaci – učebnice, návody, zprávy",
    options: [
      "báseň o přírodě",
      "román s dobrodružstvím",
      "text, jehož cílem je předat informaci – učebnice, návody, zprávy",
      "pohádka pro děti",
    ],
    hints: ["Věcný = informuje. Učebnice, encyklopedie, zpráva."],
  },
  {
    question: "Jaký typ textu je báseň?",
    correctAnswer: "umělecký",
    options: ["věcný", "umělecký", "odborný", "záleží na básni"],
    hints: ["Báseň = literatura = umělecký text."],
  },
  {
    question: "Jaký typ textu je návod k pračce?",
    correctAnswer: "věcný – neumělecký",
    options: ["umělecký", "poetický", "věcný – neumělecký", "záleží na výrobci"],
    hints: ["Návod = informace a instrukce = věcný text."],
  },
  {
    question: "Jaký typ textu je encyklopedie?",
    correctAnswer: "věcný – odborný",
    options: ["umělecký", "poetický", "věcný – odborný", "záleží na tématu"],
    hints: ["Encyklopedie = fakta, definice, odborné informace = věcný text."],
  },
  {
    question: "Jaký typ textu je pohádka?",
    correctAnswer: "umělecký",
    options: ["věcný", "odborný", "umělecký", "záleží na pohádce"],
    hints: ["Pohádka = příběh s fantazií = umělecký text."],
  },
  {
    question: "Jaký typ textu je novinový článek o fotbale?",
    correctAnswer: "věcný – informuje o událostech",
    options: ["umělecký", "věcný – informuje o událostech", "poetický", "záleží na novinách"],
    hints: ["Zpravodajství = fakta o událostech = věcný text."],
  },
  {
    question: "Jaký typ textu je román od Jarlava Foglara?",
    correctAnswer: "umělecký – beletrie",
    options: ["věcný", "odborný", "umělecký – beletrie", "záleží na románu"],
    hints: ["Foglar = prozaický spisovatel. Romány = umělecké texty."],
  },
  {
    question: "Jaký typ textu je jízdní řád autobusu?",
    correctAnswer: "věcný – funkční",
    options: ["umělecký", "věcný – funkční", "poetický", "záleží na dopravci"],
    hints: ["Jízdní řád = informace pro cestující = věcný funkční text."],
  },
  {
    question: "Co je cílem uměleckého textu?",
    correctAnswer: "estetický zážitek, emoce, příběh, obraz světa",
    options: [
      "přesné fakty bez emocí",
      "estetický zážitek, emoce, příběh, obraz světa",
      "instrukce k provedení",
      "záleží na autorovi",
    ],
    hints: ["Umělecký = krásy, pocity, příběhy = estetický zážitek."],
  },
  {
    question: "Co je cílem věcného textu?",
    correctAnswer: "přesně předat informaci adresátovi",
    options: [
      "vyvolat emoce",
      "pobavit čtenáře",
      "přesně předat informaci adresátovi",
      "záleží na textu",
    ],
    hints: ["Věcný = informace. Přesnost a srozumitelnost jsou klíčové."],
  },
  {
    question: "Jaký typ textu je učebnice matematiky?",
    correctAnswer: "věcný – odborný",
    options: ["umělecký", "poetický", "věcný – odborný", "záleží na nakladatelství"],
    hints: ["Učebnice = fakta a výuka = věcný odborný text."],
  },
  {
    question: "Jak se liší styl uměleckého a věcného textu?",
    correctAnswer: "umělecký = poetický, obrazný; věcný = přesný, neutrální",
    options: [
      "jsou totéž",
      "umělecký = poetický, obrazný; věcný = přesný, neutrální",
      "věcný je vždy kratší",
      "záleží jen na délce",
    ],
    hints: ["Umělecký využívá metafory. Věcný je faktický."],
  },
  {
    question: "Jaký typ textu je reklama?",
    correctAnswer: "přechodný – věcný s uměleckými prvky – přesvědčuje i informuje",
    options: [
      "čistě umělecký",
      "čistě věcný",
      "přechodný – věcný s uměleckými prvky – přesvědčuje i informuje",
      "záleží na produktu",
    ],
    hints: ["Reklama informuje o produktu, ale používá kreativní jazyk."],
  },
  {
    question: "Co je beletrie?",
    correctAnswer: "umělecká próza – romány, povídky, novely",
    options: [
      "odborný vědecký text",
      "umělecká próza – romány, povídky, novely",
      "věcný text",
      "báseň vždy",
    ],
    hints: ["Beletrie = krásná literatura (z francouzského belles-lettres)."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je publicistický text?",
    correctAnswer: "text v médiích – novinách, webu informující o aktuálních událostech",
    options: [
      "umělecká próza",
      "text v médiích – novinách, webu informující o aktuálních událostech",
      "báseň v novinách",
      "záleží na periodiku",
    ],
    hints: ["Publicistika = žurnalistika. Zprávy, reportáže, komentáře."],
  },
  {
    question: "Co je odborný text?",
    correctAnswer: "věcný text určený odborníkům s přesnou terminologií",
    options: [
      "umělecký text pro odborníky",
      "věcný text určený odborníkům s přesnou terminologií",
      "báseň o vědě",
      "záleží na tématu",
    ],
    hints: ["Odborný = lékařský, vědecký, právní. Terminologie a přesnost."],
  },
  {
    question: "Jaký typ textu je fejeton?",
    correctAnswer: "přechodný – věcný s uměleckými prvky – humor, ironie",
    options: [
      "čistě umělecký",
      "čistě věcný",
      "přechodný – věcný s uměleckými prvky – humor, ironie",
      "záleží na autorovi",
    ],
    hints: ["Fejeton = vtipný nebo kritický článek. Mix věcného a uměleckého."],
  },
  {
    question: "Co je reportáž?",
    correctAnswer: "věcný publicistický text zachycující přímý zážitek z místa události",
    options: [
      "umělecká próza",
      "věcný publicistický text zachycující přímý zážitek z místa události",
      "epická báseň",
      "záleží na délce",
    ],
    hints: ["Reportáž = novinář je přímo na místě a popisuje, co vidí."],
  },
  {
    question: "Co je esej?",
    correctAnswer: "kratší prose text vyjadřující autorův pohled na téma, mix faktů a úvah",
    options: [
      "novinový článek",
      "kratší prose text vyjadřující autorův pohled na téma, mix faktů a úvah",
      "odborný výzkum",
      "záleží na tématu",
    ],
    hints: ["Esej = subjektivní úvaha autora o tématu."],
  },
  {
    question: "Jak poznáme umělecký text od věcného?",
    correctAnswer: "umělecký využívá obrazný jazyk, emoce a příběh; věcný je neutrální a faktický",
    options: [
      "umělecký je vždy kratší",
      "umělecký využívá obrazný jazyk, emoce a příběh; věcný je neutrální a faktický",
      "věcný má vždy čísla",
      "záleží jen na délce",
    ],
    hints: ["Obrazný jazyk, emoce, příběh = umělecký. Fakta, přesnost = věcný."],
  },
  {
    question: "Co je cestopis?",
    correctAnswer: "textový žánr popisující cestu a místa – přechodný mezi věcným a uměleckým",
    options: [
      "čistě odborný text",
      "textový žánr popisující cestu a místa – přechodný mezi věcným a uměleckým",
      "vědecký výzkum",
      "záleží na délce",
    ],
    hints: ["Cestopis = popis cesty. Subjektivní dojmy + faktické informace."],
  },
  {
    question: "Jaký typ textu je recept?",
    correctAnswer: "věcný funkční text – pracovní postup",
    options: [
      "umělecký",
      "věcný funkční text – pracovní postup",
      "poetický",
      "záleží na kuchyni",
    ],
    hints: ["Recept = instrukce k vaření = věcný funkční text."],
  },
  {
    question: "Co je memoáry?",
    correctAnswer: "vzpomínky autora na prožité události – přechodný žánr",
    options: [
      "vědecká studie",
      "vzpomínky autora na prožité události – přechodný žánr",
      "epická báseň",
      "záleží na autorovi",
    ],
    hints: ["Memoáry = osobní vzpomínky. Mezi autobiografií a literaturou."],
  },
  {
    question: "Co je populárně vědecký text?",
    correctAnswer: "odborné informace podány srozumitelně pro široké publikum",
    options: [
      "odborný text pro vědce",
      "odborné informace podány srozumitelně pro široké publikum",
      "umělecký text",
      "záleží na tématu",
    ],
    hints: ["Populárně vědecký = věda pro všechny. National Geographic, Vesmír."],
  },
  {
    question: "Jaký styl jazyka je typický pro věcný text?",
    correctAnswer: "neutrální, přesný, bez expresivní slovní zásoby",
    options: [
      "poetický a obrazný",
      "neutrální, přesný, bez expresivní slovní zásoby",
      "hovorový a neformální",
      "záleží na délce",
    ],
    hints: ["Věcný text = jasné a přesné sdělení, žádné metafory."],
  },
  {
    question: "Jaký styl jazyka je typický pro umělecký text?",
    correctAnswer: "obrazný, expresivní, metafory, přirovnání, personifikace",
    options: [
      "neutrální a přesný",
      "odborný s terminologií",
      "obrazný, expresivní, metafory, přirovnání, personifikace",
      "záleží jen na délce",
    ],
    hints: ["Umělecký text = kreativní jazyk, obrazy, emoce."],
  },
  {
    question: "Může být stejné téma zpracováno jako věcný i jako umělecký text podle toho, jaký má autor záměr?",
    correctAnswer: "záleží na účelu – vědecký popis přírody = věcný; báseň o přírodě = umělecký",
    options: [
      "vždy věcný",
      "vždy umělecký",
      "záleží na účelu – vědecký popis přírody = věcný; báseň o přírodě = umělecký",
      "záleží na délce",
    ],
    hints: ["Stejné téma může být zpracováno věcně i umělecky."],
  },
  {
    question: "Co je literární kritika?",
    correctAnswer: "věcný text hodnotící umělecké dílo",
    options: [
      "umělecký text",
      "věcný text hodnotící umělecké dílo",
      "epická báseň",
      "záleží na kritikovi",
    ],
    hints: ["Kritika = hodnocení díla. Je to věcný odborný text."],
  },
  {
    question: "Jak se liší životopis (biografie) od autobiografie?",
    correctAnswer: "biografie = o jiné osobě; autobiografie = o sobě samém",
    options: [
      "jsou totéž",
      "biografie = o jiné osobě; autobiografie = o sobě samém",
      "autobiografie je vždy kratší",
      "záleží na osobě",
    ],
    hints: ["Biografie = jiný author o jiné osobě. Autobiografie = sám o sobě."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Co je intertextualita?",
    correctAnswer: "odkaz jednoho textu na jiný text – citace, parafráze, alúze",
    options: [
      "typ věcného textu",
      "odkaz jednoho textu na jiný text – citace, parafráze, alúze",
      "druh básně",
      "záleží na autorovi",
    ],
    hints: ["Intertextualita = vzájemné propojení textů."],
  },
  {
    question: "Co je narativ?",
    correctAnswer: "způsob vyprávění příběhu v literárním nebo jiném textu",
    options: [
      "věcný text",
      "způsob vyprávění příběhu v literárním nebo jiném textu",
      "báseň",
      "záleží na žánru",
    ],
    hints: ["Narativ = příběhové vyprávění. Každý příběh má narativ."],
  },
  {
    question: "Co je propaganda?",
    correctAnswer: "přesvědčovací text sloužící ideologickým nebo politickým cílům",
    options: [
      "vědecký text",
      "přesvědčovací text sloužící ideologickým nebo politickým cílům",
      "umělecká báseň",
      "záleží na obsahu",
    ],
    hints: ["Propaganda = záměrné přesvědčování. Ne vždy pravdivé."],
  },
  {
    question: "Co je alegorie v literárním textu?",
    correctAnswer: "příběh nebo obraz, kde postavy a události mají skrytý symbolický smysl",
    options: [
      "přímé vyjádření smyslu",
      "příběh nebo obraz, kde postavy a události mají skrytý symbolický smysl",
      "věcný popis",
      "záleží na žánru",
    ],
    hints: ["Alegorie = příběh s dvojím smyslem. Orwell: Farma zvířat = alegorie o politice."],
  },
  {
    question: "Co je satira?",
    correctAnswer: "literární nebo umělecký styl kritizující společnost nebo osoby pomocí humoru",
    options: [
      "vědecký text",
      "literární nebo umělecký styl kritizující společnost nebo osoby pomocí humoru",
      "dětská pohádka",
      "záleží na autorovi",
    ],
    hints: ["Satira = kritika skrze humor nebo ironii."],
  },
  {
    question: "Jak se liší odborný a populárně vědecký text z hlediska jazyka?",
    correctAnswer: "odborný = terminologie pro odborníky; populárně vědecký = srozumitelný pro laiky",
    options: [
      "jsou totéž",
      "odborný = terminologie pro odborníky; populárně vědecký = srozumitelný pro laiky",
      "populárně vědecký je kratší",
      "záleží na vydavateli",
    ],
    hints: ["Odborný = vědecký jazyk. Populárně vědecký = přijatelný pro všechny."],
  },
  {
    question: "Co je fikce v literatuře?",
    correctAnswer: "vymyšlené příběhy a světy, které nejsou skutečné",
    options: [
      "pravdivý záznam událostí",
      "vymyšlené příběhy a světy, které nejsou skutečné",
      "vědecký text",
      "záleží na žánru",
    ],
    hints: ["Fikce = vymyšlené. Non-fiction = skutečné události."],
  },
  {
    question: "Co je non-fiction?",
    correctAnswer: "literatura o skutečných událostech a faktech – biografie, historia, věda",
    options: [
      "vymyšlené příběhy",
      "literatura o skutečných událostech a faktech – biografie, historia, věda",
      "pohádky",
      "záleží na vydavateli",
    ],
    hints: ["Non-fiction = skutečnost. Reportáže, biografie, vědecké texty."],
  },
  {
    question: "Co je ironický text?",
    correctAnswer: "text, kde pravý smysl je opačný než doslovný výraz",
    options: [
      "vědecký text",
      "text, kde pravý smysl je opačný než doslovný výraz",
      "básně bez děje",
      "záleží na tématu",
    ],
    hints: ["Ironie = říkám opak toho, co myslím. 'To je ale krásné počasí' v dešti."],
  },
  {
    question: "Jak se liší parabola od alegorie?",
    correctAnswer: "parabola = jednoduchý příběh s morálním poučením; alegorie = komplexnější symbolismus",
    options: [
      "jsou totéž",
      "parabola = jednoduchý příběh s morálním poučením; alegorie = komplexnější symbolismus",
      "parabola je vždy kratší",
      "záleží na autorovi",
    ],
    hints: ["Parabola = podobenství (biblická). Alegorie = komplexnější systém symbolů."],
  },
  {
    question: "Co je dystopie?",
    correctAnswer: "fiktivní příběh o negativní, nebezpečné budoucí společnosti",
    options: [
      "historický román",
      "fiktivní příběh o negativní, nebezpečné budoucí společnosti",
      "pohádka",
      "záleží na žánru",
    ],
    hints: ["Dystopie = opak utopie. 1984 (Orwell), Hunger Games."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const UMELECKEANEUMELECKETEXTY: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty",
    rvpNodeId: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty",
    title: "Umělecké a věcné texty",
    studentTitle: "Umělecké a věcné texty",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární pojmy a žánry",
    briefDescription: "Rozlišíš umělecký a věcný text a pochopíš jejich účel.",
    keywords: ["umělecký text", "věcný text", "beletrie", "odborný text", "publicistika"],
    goals: [
      "Rozlišit umělecký a věcný text",
      "Určit cíl a styl obou typů textů",
      "Přiřadit konkrétní text ke správné kategorii",
    ],
    boundaries: [
      "Bez podrobné literárněvědné analýzy",
      "Neprobíráme složité teorie textu",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Umělecký text = krása, emoce, příběh (básně, romány, pohádky). Věcný text = informace, fakta (učebnice, návody, zprávy).",
      steps: [
        "Přečti text a zeptej se: Chce mě pobavit nebo dojmout? → umělecký.",
        "Chce mě informovat nebo poučit? → věcný.",
        "Umělecký: obrazný jazyk, příběh, emoce.",
        "Věcný: přesná fakta, neutrální jazyk.",
      ],
      commonMistake: "Žáci si myslí, že krásně napsaný věcný text je umělecký. Záleží na účelu, ne na kráse jazyka.",
      example: "Báseň o slonech = umělecká. Encyklopedický článek o slonech = věcný.",
    },
  },
];
