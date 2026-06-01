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
  { question: "Jaký je plod buku?", correctAnswer: "Bukev – trojhranný oříšek", options: ["Bukev – trojhranný oříšek", "Žalud", "Šiška", "Kaštan"] },
  { question: "Jak poznáš břízu?", correctAnswer: "Bílá kůra s tmavými šmuhami", options: ["Bílá kůra s tmavými šmuhami", "Červená kůra", "Šupinkovitá hnědá kůra", "Hladká zelená kůra"] },
  { question: "Který strom je národní strom České republiky?", correctAnswer: "Lípa", options: ["Lípa", "Dub", "Bříza", "Smrk"] },
  { question: "Co je jehličnan?", correctAnswer: "Strom s jehlicemi místo listů", options: ["Strom s jehlicemi místo listů", "Strom s kulatými listy", "Keř s ostnatými větvemi", "Strom s drobnými kvítky"] },
  { question: "Jak se jmenuje jehličnan s šiškami otočenými dolů?", correctAnswer: "Smrk", options: ["Smrk", "Borovice", "Jedle", "Modřín"] },
  { question: "Který jehličnan je jediný opadavý (na podzim ztrácí jehličí)?", correctAnswer: "Modřín", options: ["Modřín", "Smrk", "Borovice", "Jedle"] },
  { question: "Jaký je rozdíl mezi stromem a keřem?", correctAnswer: "Strom má 1 hlavní kmen, keř roste z více stonků od země", options: ["Strom má 1 hlavní kmen, keř roste z více stonků od země", "Strom je vyšší než 10 m, keř je nižší", "Strom je listnatý, keř jehličnatý", "Keř neroste v lese, strom ano"] },
  { question: "Jaký keř má voňavé fialové nebo bílé květy?", correctAnswer: "Šeřík", options: ["Šeřík", "Bez černý", "Hloh", "Zimolez"] },
  { question: "Jaké plody má bez černý?", correctAnswer: "Fialové – černé drobné bobule", options: ["Fialové – černé drobné bobule", "Červené bobule", "Žluté šišky", "Hnědé oříšky"] },
  { question: "Jak se jmenuje jehličnan s jehlicemi ve skupinkách po 2?", correctAnswer: "Borovice", options: ["Borovice", "Smrk", "Jedle", "Modřín"] },
  { question: "Jaký keř dává jedlé červené nebo černé bobule?", correctAnswer: "Rybíz", options: ["Rybíz", "Hloh", "Šeřík", "Zimolez"] },
  { question: "Jak se jmenuje jehličnan, jehož šišky stojí vzpřímeně na větvích?", correctAnswer: "Jedle", options: ["Jedle", "Smrk", "Borovice", "Modřín"] },
  { question: "Jak vysoký musí být strom?", correctAnswer: "Výše než 5 metrů s jedním hlavním kmenem", options: ["Výše než 5 metrů s jedním hlavním kmenem", "Výše než 2 metry", "Výše než 10 metrů", "Jakákoliv výška s dřevnatým kmenem"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší listnatý strom od jehličnatého?", correctAnswer: "Listnatý: ploché listy (opadají na podzim nebo zimostrázy). Jehličnatý: jehlice – většina stálezeleně .", options: ["Listnatý: ploché listy (opadají na podzim nebo zimostrázy). Jehličnatý: jehlice – většina stálezeleně .", "Listnatý má vždy větší listy.", "Jehličnatý vždy opadá, listnatý je stálezelený.", "Listnatý roste jen v teplejším podnebí."] },
  { question: "Proč je tis (Taxus) nebezpečný?", correctAnswer: "Téměř všechny jeho části jsou jedovaté – vyjma dužiny u arilu", options: ["Téměř všechny jeho části jsou jedovaté – vyjma dužiny u arilu", "Není jedovatý — jen alergizující", "Jen jehličí je jedovaté, plody jsou bezpečné", "Tis není jedovatý"] },
  { question: "Proč modřín ztrácí jehličí na podzim?", correctAnswer: "Je to přizpůsobení šetřící vodu a energii v zimě — jediný opadavý jehličnan", options: ["Je to přizpůsobení šetřící vodu a energii v zimě — jediný opadavý jehličnan", "Modřín je ve skutečnosti listnatý strom", "Ztrácí jehličí jen při suchu", "Modřín ztrácí jehličí jen v mrazivých oblastech"] },
  { question: "Co je angrešt?", correctAnswer: "Keř s trnistými větvemi a jedlými oválnými plody – zelené nebo červenohnědé", options: ["Keř s trnistými větvemi a jedlými oválnými plody – zelené nebo červenohnědé", "Druh drobného ovocného stromku", "Plevelná bylina na loukách", "Druh dubu s malými žaludy"] },
  { question: "Čím je lípa významná jako národní strom ČR?", correctAnswer: "Symbolem ČR – Čechů, Moravanů, Slováků — voňavé léčivé květy, symbolika slovanství", options: ["Symbolem ČR – Čechů, Moravanů, Slováků — voňavé léčivé květy, symbolika slovanství", "Je nejrozšířenějším stromem v ČR", "Je nejstarším stromem na světě", "Lípa dává jedlé plody"] },
  { question: "Jaká je funkce šišek u jehličnanů?", correctAnswer: "Chrání semena — šišky se otevřou a uvolní semena pro rozmnožování", options: ["Chrání semena — šišky se otevřou a uvolní semena pro rozmnožování", "Sbírají vodu pro strom", "Slouží jako potravu pro strom v zimě", "Přitahují hmyz pro opylení"] },
  { question: "Jak se jmenuje plod javoru a jak se šíří?", correctAnswer: "Nažka s křídlem – vrtulka — létí s větrem a šíří se rotováním", options: ["Nažka s křídlem – vrtulka — létí s větrem a šíří se rotováním", "Šiška otevírající se teplem", "Bobule pojídaná ptáky", "Oříšek přenášený mravenci"] },
  { question: "Jak přizpůsoben je dub k suchému prostředí?", correctAnswer: "Hluboký kořenový systém, tvrdá kůra a silné kořeny pro čerpání vody z hloubky", options: ["Hluboký kořenový systém, tvrdá kůra a silné kořeny pro čerpání vody z hloubky", "Opadává dříve než jiné stromy", "Ukládá vodu v kůře", "Jehlice místo listů omezují výpar"] },
  { question: "Jak se liší plody hlohů od plodů šípku?", correctAnswer: "Hloh: červené drobné jablíčka – tvrdé s peckou . Šípek: červené masité plody s vlákny a semínky.", options: ["Hloh: červené drobné jablíčka – tvrdé s peckou . Šípek: červené masité plody s vlákny a semínky.", "Oba mají totožné plody.", "Šípek má modré plody, hloh červené.", "Hloh je jedovatý, šípek jedlý."] },
  { question: "Co je dendrology?", correctAnswer: "Vědecký obor studující stromy a dřeviny", options: ["Vědecký obor studující stromy a dřeviny", "Věda o pěstování ovoce", "Věda o lesní ekologii", "Nauka o dřevorubectví"] },
  { question: "Jak rozpoznáš smrk od jedle?", correctAnswer: "Smrk: šišky visí dolů, jehlice ostré. Jedle: šišky stojí nahoru, jehlice ploché s bílými pásky.", options: ["Smrk: šišky visí dolů, jehlice ostré. Jedle: šišky stojí nahoru, jehlice ploché s bílými pásky.", "Smrk má šišky stojí nahoru, jedle dolů.", "Smrk má ploché jehlice, jedle ostré.", "Nejde je rozlišit."] },
  { question: "Co je kalina a k čemu ji lze využít?", correctAnswer: "Keř s bílými květy a červenými plody — léčivé využití, okrasný keř, potravu pro ptáky", options: ["Keř s bílými květy a červenými plody — léčivé využití, okrasný keř, potravu pro ptáky", "Druh lípy s aromatickými listy", "Jedovatý strom s červenou kůrou", "Tráva rostoucí v mokřadech"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč jsou smrkové monokultury ekologickým problémem?", correctAnswer: "Malá biodiverzita, náchylnost ke kůrovcům, neschopnost zadržet vodu a rychlá eroze půdy při holosečích", options: ["Malá biodiverzita, náchylnost ke kůrovcům, neschopnost zadržet vodu a rychlá eroze půdy při holosečích", "Smrk je ideální pro české podmínky bez problémů", "Problém je jen estetický — smrkový les je monotónní", "Smrkové monokultury jsou odolnější než smíšené lesy"] },
  { question: "Co je letokruh a jak se počítá stáří stromu?", correctAnswer: "Každý rok vytvoří strom jeden kruh ve dřevě — počtem letokruhů na průřezu určíme stáří", options: ["Každý rok vytvoří strom jeden kruh ve dřevě — počtem letokruhů na průřezu určíme stáří", "Letokruh je obvodový průměr kmene", "Stáří nelze určit z průřezu — jen z výšky", "Každý letokruh odpovídá 2 rokům"] },
  { question: "Jak probíhá větrné opylování u jehličnanů?", correctAnswer: "Peyl – pyl je velmi lehký, produkuje se v obrovském množství a větrem se přenáší na samičí šišky", options: ["Peyl – pyl je velmi lehký, produkuje se v obrovském množství a větrem se přenáší na samičí šišky", "Jehličnany jsou opylovány hmyzem jako listnaté stromy", "Jehličnany se rozmnožují spórami, ne pylem", "Pyl jehličnanů se šíří vodou"] },
  { question: "Jaký ekologický vliv mají stromy na mikroklima okolí?", correctAnswer: "Snižují teplotu – stín + transpirace , zadržují vodu, tlumí vítr a snižují prašnost", options: ["Snižují teplotu – stín + transpirace , zadržují vodu, tlumí vítr a snižují prašnost", "Stromy zvyšují místní teplotu v létě", "Stromy nemají vliv na mikroklima", "Stromy pouze produkují O₂ bez jiných efektů"] },
  { question: "Co je allelopatie u rostlin?", correctAnswer: "Produkce chemických látek, které inhibují růst jiných rostlin v okolí – např. vlašský ořech", options: ["Produkce chemických látek, které inhibují růst jiných rostlin v okolí – např. vlašský ořech", "Schopnost rostlin rozpoznat sousední druhy opticky", "Spolupráce dvou druhů stromů při sdílení živin", "Druh parazitismu mezi stromy"] },
  { question: "Proč jsou staré duby zvláště cenné pro biodiverzitu?", correctAnswer: "Dutiny poskytují hnízdiště, odumřelé dřevo je stanovištěm pro stovky druhů bezobratlých a hub", options: ["Dutiny poskytují hnízdiště, odumřelé dřevo je stanovištěm pro stovky druhů bezobratlých a hub", "Staré duby nemají vyšší ekologickou hodnotu než mladé", "Staré duby jsou jen nebezpečné — měly by se kácet", "Staré duby jsou cenné jen pro dřevorubce"] },
  { question: "Jak se šíří semena lípy a jaký typ rozšiřování je to?", correctAnswer: "Šíří se větrem — nažka je spojena s křídlatým listenem, který funguje jako vrtulka – anemochorie", options: ["Šíří se větrem — nažka je spojena s křídlatým listenem, který funguje jako vrtulka – anemochorie", "Semena lípy šíří ptáci – ornitochorie", "Semena lípy rozšiřují mravenci – myrmekochorie", "Semena lípy šíří voda – hydrochorie"] },
  { question: "Jaký je ekologický rozdíl mezi primárním a sekundárním lesem?", correctAnswer: "Primární: nikdy nekácený, max. biodiverzita. Sekundární: po mýtině nebo kalamitě obnovený — méně druhů, jiná struktura.", options: ["Primární: nikdy nekácený, max. biodiverzita. Sekundární: po mýtině nebo kalamitě obnovený — méně druhů, jiná struktura.", "Primární les je mladší než sekundární.", "Oba typy lesů mají stejnou biodiverzitu.", "Sekundární les je přirozenější než primární."] },
  { question: "Co je sukcese a jak probíhá v lese po holosečné těžbě?", correctAnswer: "Postupné osídlování a proměna — nejdřív plevel a trávy, pak pionýrské dřeviny, nakonec klimaxový les", options: ["Postupné osídlování a proměna — nejdřív plevel a trávy, pak pionýrské dřeviny, nakonec klimaxový les", "Okamžité obnovení lesa ze spár kořenů", "Přímé osázení dřevinami bez přirozené sukcese", "Sukcese probíhá jen v tropickém pralese"] },
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
