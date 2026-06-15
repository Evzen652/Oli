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
    question: "Co je lyrická báseň?",
    correctAnswer: "báseň vyjadřující pocity a nálady bez příběhového děje",
    options: [
      "báseň s příběhem a dějem",
      "báseň vyjadřující pocity a nálady bez příběhového děje",
      "báseň o historické události",
      "báseň pro děti vždy",
    ],
    hints: ["'Lyrika' pochází z řeckého nástroje lyra, spojeného s výrazem vnitřního světa. Vypráví tato báseň příběh, nebo spíše vyjadřuje niterné prožívání?"],
  },
  {
    question: "Co je epická báseň?",
    correctAnswer: "báseň s příběhem a dějem – balada, epos, pohádkový příběh",
    options: [
      "báseň jen o přírodě",
      "báseň bez děje vyjadřující jen pocity",
      "báseň s příběhem a dějem – balada, epos, pohádkový příběh",
      "báseň z pohledu zvířete",
    ],
    hints: ["'Epika' pochází z řeckého slova pro vyprávění. Má tato báseň příběh s postavami a dějem, nebo jen vyjadřuje pocity?"],
  },
  {
    question: "Co je román?",
    correctAnswer: "delší prozaické dílo s více postavami a složitějším dějem",
    options: [
      "kratší prozaický příběh",
      "delší prozaické dílo s více postavami a složitějším dějem",
      "báseň v próze",
      "divadelní hra",
    ],
    hints: ["Román = dlouhý prozaický text. Například: Ostrov pokladů, Dobrodružství Toma Sawyera."],
  },
  {
    question: "Co je povídka?",
    correctAnswer: "kratší prozaické dílo s jedním příběhem a méně postavami",
    options: [
      "delší prozaické dílo",
      "kratší prozaické dílo s jedním příběhem a méně postavami",
      "báseň",
      "divadelní hra",
    ],
    hints: ["Povídka = kratší než román. Jeden hlavní příběh."],
  },
  {
    question: "Jaký literární žánr je Erbenova Kytice?",
    correctAnswer: "sbírka balad – epických básní",
    options: [
      "román",
      "sbírka povídek",
      "sbírka balad – epických básní",
      "divadelní hra",
    ],
    hints: ["Kytice = básně s příběhem (balady). Karel Jaromír Erben."],
  },
  {
    question: "Jaký literární žánr jsou Máchovy básně (Máj)?",
    correctAnswer: "lyrická a lyrickoepická báseň",
    options: [
      "román",
      "povídka",
      "lyrická a lyrickoepická báseň",
      "divadelní hra",
    ],
    hints: ["Máj od K. H. Máchy je proslulý tím, že v jednom díle kombinuje dvě různé formy. Přečti si názvy možností a zamysli se, která vystihuje tuto kombinaci."],
  },
  {
    question: "Jaký je hlavní rozdíl mezi románem a povídkou?",
    correctAnswer: "román je delší, složitější, povídka kratší a jednodušší",
    options: [
      "jsou totéž",
      "román je delší, složitější, povídka kratší a jednodušší",
      "povídka je vždy o dětech",
      "román je vždy sci-fi",
    ],
    hints: ["Délka a složitost děje = klíčový rozdíl."],
  },
  {
    question: "Který z těchto titulů je román?",
    correctAnswer: "Dobrodružství Toma Sawyera – Mark Twain",
    options: [
      "Kytice – Erben",
      "Dobrodružství Toma Sawyera – Mark Twain",
      "Máj – Mácha",
      "básně pro děti",
    ],
    hints: ["Tom Sawyer = dlouhé dobrodružné prozaické dílo = román."],
  },
  {
    question: "Co je balada?",
    correctAnswer: "epická báseň s tragickým dějem a dramatickým napětím",
    options: [
      "lyrická báseň o přírodě",
      "epická báseň s tragickým dějem a dramatickým napětím",
      "veselá báseň pro děti",
      "pohádka ve verších",
    ],
    hints: ["Balada = smutný příběh ve verších. Erben: Vrba, Vodník."],
  },
  {
    question: "Co je epos?",
    correctAnswer: "rozsáhlá epická báseň o hrdinech a jejich dobrodružstvích",
    options: [
      "kratší lyrická báseň",
      "rozsáhlá epická báseň o hrdinech a jejich dobrodružstvích",
      "moderní román",
      "pohádka",
    ],
    hints: ["Epos = hrdinský příběh ve verších (Iliada, Odyssea)."],
  },
  {
    question: "Jaký typ díla je Jaroslav Foglar – Záhada hlavolamu?",
    correctAnswer: "dobrodružný román pro mládež",
    options: [
      "báseň",
      "povídka",
      "dobrodružný román pro mládež",
      "pohádka",
    ],
    hints: ["Foglar psal dobrodružné romány pro mladé čtenáře."],
  },
  {
    question: "Lyrická báseň nevypráví příběh, ale:",
    correctAnswer: "vyjadřuje pocity, nálady a subjektivní dojmy autora",
    options: [
      "popisuje historické události",
      "vyjadřuje pocity, nálady a subjektivní dojmy autora",
      "instruuje čtenáře, co dělat",
      "vypráví pohádku",
    ],
    hints: ["Lyrika = vnitřní svět autora. Pocity, nálady, dojmy."],
  },
  {
    question: "Jaký literární žánr psal Arthur Conan Doyle (Sherlock Holmes)?",
    correctAnswer: "detektivní povídky a novely",
    options: [
      "epické básně",
      "lyrické básně",
      "detektivní povídky a novely",
      "pohádky",
    ],
    hints: ["Sherlock Holmes = detektivní příběhy. Doyle psal povídky a novely."],
  },
  {
    question: "Co je novela?",
    correctAnswer: "prozaické dílo delší než povídka, kratší než román",
    options: [
      "kratší báseň",
      "prozaické dílo delší než povídka, kratší než román",
      "jiné slovo pro román",
      "epická báseň",
    ],
    hints: ["Novela = mezi povídkou a románem. Jedno hlavní téma."],
  },
  {
    question: "Jaký je autor knihy 'Ostrov pokladů'?",
    correctAnswer: "Robert Louis Stevenson",
    options: [
      "Mark Twain",
      "Robert Louis Stevenson",
      "Arthur Conan Doyle",
      "Jaroslav Foglar",
    ],
    hints: ["Ostrov pokladů = Stevenson. Dobrodružný román."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Co je lyrickoepická báseň?",
    correctAnswer: "báseň kombinující lyrické pocity s epickým dějem",
    options: [
      "jen lyrická báseň",
      "jen epická báseň",
      "báseň kombinující lyrické pocity s epickým dějem",
      "pohádka ve verších",
    ],
    hints: ["'Lyricko-' a '-epická' — obě části názvu napovídají, co dílo spojuje. Která dvě slova označují pocity a příběh?"],
  },
  {
    question: "Co je pohádka a jaký žánr to je?",
    correctAnswer: "prozaické – nebo veršované dílo s fantastickými prvky, typicky pro děti",
    options: [
      "historický román",
      "prozaické – nebo veršované dílo s fantastickými prvky, typicky pro děti",
      "vědecký text",
      "divadelní hra",
    ],
    hints: ["Pohádka = fantazie, magie, morální poučení."],
  },
  {
    question: "Jaké znaky má epická báseň, které lyricka nemá?",
    correctAnswer: "příběh s dějem, postavami a zápletkou",
    options: [
      "rým a rytmus",
      "příběh s dějem, postavami a zápletkou",
      "verše a sloky",
      "záleží na autorovi",
    ],
    hints: ["Zamysli se: co lyrickým básním chybí a epickým ne? Co potřebuješ, aby se dalo mluvit o hrdinovi, zápletce a rozuzlení?"],
  },
  {
    question: "Jaký je žánr díla Tři mušketýři (Alexandre Dumas)?",
    correctAnswer: "historický dobrodružný román",
    options: [
      "epická báseň",
      "historický dobrodružný román",
      "detektivní povídka",
      "pohádka",
    ],
    hints: ["Tři mušketýři = dlouhý prozaický příběh = román."],
  },
  {
    question: "Co je sci-fi (science fiction)?",
    correctAnswer: "žánr prozaické literatury o budoucnosti, vědě a technologii",
    options: [
      "epická báseň",
      "žánr prozaické literatury o budoucnosti, vědě a technologii",
      "lyrická báseň",
      "pohádka",
    ],
    hints: ["Sci-fi = vědecká fikce. H. G. Wells, Jules Verne."],
  },
  {
    question: "Jaký je rozdíl mezi povídkou a příběhem v básni (baladou)?",
    correctAnswer: "povídka je próza; balada je báseň s dějem ve verších",
    options: [
      "jsou totéž",
      "povídka je próza; balada je báseň s dějem ve verších",
      "balada je vždy lyrická",
      "záleží jen na délce",
    ],
    hints: ["Próza vs. poezie – balada je epická báseň."],
  },
  {
    question: "Co je detektivní román?",
    correctAnswer: "prozaické dílo, jehož ústředním prvkem je záhada a její rozluštění",
    options: [
      "historický román",
      "prozaické dílo, jehož ústředním prvkem je záhada a její rozluštění",
      "pohádka",
      "epická báseň",
    ],
    hints: ["Detektivní žánr = záhada, vyšetřování, odhalení."],
  },
  {
    question: "Co je fantasy román?",
    correctAnswer: "prozaické dílo odehrávající se v smyšleném světě s magií",
    options: [
      "historický román",
      "prozaické dílo odehrávající se v smyšleném světě s magií",
      "pohádka pro malé děti vždy",
      "epická báseň",
    ],
    hints: ["Fantasy = smyšlený svět s magií. Tolkien: Pán prstenů."],
  },
  {
    question: "Co je autobiografie?",
    correctAnswer: "prozaické dílo, kde autor píše o vlastním životě",
    options: [
      "životopis o jiné osobě",
      "prozaické dílo, kde autor píše o vlastním životě",
      "druh epické básně",
      "pohádka",
    ],
    hints: ["Auto = sám. Bio = život. Autobiografie = vlastní životní příběh."],
  },
  {
    question: "Jaký je žánr Kytice od K. J. Erbena?",
    correctAnswer: "sbírka balad – epických básní s tragickým dějem",
    options: [
      "sbírka lyrických básní",
      "sbírka balad – epických básní s tragickým dějem",
      "sbírka povídek",
      "román",
    ],
    hints: ["Kytice = básně s příběhem (Vodník, Vrba, Polednice) = balady."],
  },
  {
    question: "Co je pohádkový román?",
    correctAnswer: "delší prozaické dílo s pohádkovými prvky pro mládež",
    options: [
      "krátká pohádka",
      "delší prozaické dílo s pohádkovými prvky pro mládež",
      "epická báseň",
      "lyrická báseň",
    ],
    hints: ["Pohádkový román = delší, složitější než klasická pohádka."],
  },
  {
    question: "Co je horrorová literatura?",
    correctAnswer: "žánr zaměřený na strach, hrozbu a napětí",
    options: [
      "historická literatura",
      "žánr zaměřený na strach, hrozbu a napětí",
      "lyrická poezie",
      "dobrodružný román vždy",
    ],
    hints: ["Horror = strach. Stephen King je typický představitel."],
  },
  {
    question: "Jaká je charakteristická délka povídky oproti románu?",
    correctAnswer: "povídka = kratší, jeden příběh; román = delší, složitější",
    options: [
      "jsou stejně dlouhé",
      "povídka = kratší, jeden příběh; román = delší, složitější",
      "román je vždy kratší",
      "záleží na tématu",
    ],
    hints: ["Délka a složitost děje = hlavní rozdíl."],
  },
  {
    question: "Co je fejeton?",
    correctAnswer: "kratší humoristický nebo satirický novinový článek",
    options: [
      "lyrická báseň",
      "kratší humoristický nebo satirický novinový článek",
      "epická báseň",
      "historický román",
    ],
    hints: ["Fejeton = krátký, vtipný nebo kritický text v novinách."],
  },
  {
    question: "Co je pikareskní román?",
    correctAnswer: "dobrodružný román o potulném hrdinu – šibalovi z lidového prostředí",
    options: [
      "vědeckofantastický román",
      "dobrodružný román o potulném hrdinu – šibalovi z lidového prostředí",
      "historický román",
      "lyrická báseň",
    ],
    hints: ["Pikareskní = šibalský. Hrdina se potuluje a zažívá dobrodružství."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi lyrikou a epikou jako literárními druhy?",
    correctAnswer: "lyrika = pocity a nálady bez děje; epika = příběh s dějem",
    options: [
      "jsou totéž",
      "lyrika = pocity a nálady bez děje; epika = příběh s dějem",
      "epika je vždy próza",
      "záleží jen na délce",
    ],
    hints: ["Tři literární druhy: lyrika, epika, drama."],
  },
  {
    question: "Co je drama jako literární druh?",
    correctAnswer: "dílo určené k divadelnímu provedení – dialogová forma",
    options: [
      "epická báseň",
      "dílo určené k divadelnímu provedení – dialogová forma",
      "lyrická báseň",
      "historický román",
    ],
    hints: ["Drama = divadlo. Dialogy, scénická poznámky, hercové."],
  },
  {
    question: "Co je tragédie?",
    correctAnswer: "dramatické dílo s vážným, smutným závěrem – hrdina zahyne nebo padá",
    options: [
      "veselá divadelní hra",
      "dramatické dílo s vážným, smutným závěrem – hrdina zahyne nebo padá",
      "epická báseň",
      "pohádka",
    ],
    hints: ["Tragédie = tragický konec. Shakespeare: Hamlet, Romeo a Julie."],
  },
  {
    question: "Co je komedie?",
    correctAnswer: "dramatické dílo s humorným nebo šťastným závěrem",
    options: [
      "tragická hra",
      "dramatické dílo s humorným nebo šťastným závěrem",
      "epická báseň",
      "lyrická báseň",
    ],
    hints: ["Komedie = smích a dobrý konec. Opak tragédie."],
  },
  {
    question: "Co je literární próza?",
    correctAnswer: "texty psané normální větnou řečí – bez verše , jako romány a povídky",
    options: [
      "texty psané ve verších",
      "texty psané normální větnou řečí – bez verše , jako romány a povídky",
      "básně o přírodě",
      "záleží na autorovi",
    ],
    hints: ["Próza = bez verše. Báseň = s veršem."],
  },
  {
    question: "Co je lyrický subjekt v básni?",
    correctAnswer: "hlas básně – kdo v básni hovoří – ne nutně autor",
    options: [
      "vždy autor básně",
      "hlas básně – kdo v básni hovoří – ne nutně autor",
      "hlavní postava příběhu",
      "záleží na délce básně",
    ],
    hints: ["Lyrický subjekt = 'já' v básni. Nemusí to být sám autor."],
  },
  {
    question: "Jaký je literární druh divadla pro dospělé zaměřeného na vážná témata?",
    correctAnswer: "tragédie nebo drama – vážná divadelní hra",
    options: [
      "komedie",
      "tragédie nebo drama – vážná divadelní hra",
      "lyrická báseň",
      "epický román",
    ],
    hints: ["Vážná témata na jevišti = drama nebo tragédie."],
  },
  {
    question: "Co je opus (dílo) autora?",
    correctAnswer: "soubor všech děl, která autor napsal",
    options: [
      "jedno konkrétní dílo",
      "soubor všech děl, která autor napsal",
      "jen básně autora",
      "záleží na vydavateli",
    ],
    hints: ["Opus = celé dílo jednoho autora (životní dílo)."],
  },
  {
    question: "Co je leitmotiv v literárním díle?",
    correctAnswer: "opakující se motiv nebo téma, které prostupuje celým dílem",
    options: [
      "hlavní postava",
      "opakující se motiv nebo téma, které prostupuje celým dílem",
      "závěrečné poučení",
      "záleží na žánru",
    ],
    hints: ["Leitmotiv = červená nit celého díla. Vrací se znovu a znovu."],
  },
  {
    question: "Co je metatextualita v literatuře?",
    correctAnswer: "dílo, které mluví o sobě samém nebo o literatuře jako takové",
    options: [
      "historický román",
      "dílo, které mluví o sobě samém nebo o literatuře jako takové",
      "epická báseň",
      "záleží na délce",
    ],
    hints: ["Metatext = text o textu. Kniha, kde autor komentuje svůj vlastní příběh."],
  },
  {
    question: "Jaký žánr jsou Andersenovy pohádky?",
    correctAnswer: "umělé – autorské pohádky v próze",
    options: [
      "lidové pohádky",
      "umělé – autorské pohádky v próze",
      "epické básně",
      "balady",
    ],
    hints: ["Andersen = dánský autor. Umělé pohádky = napsal jeden konkrétní autor."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const BASENLYRICKAAEPICKAROMANPOVIDKA: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-basen-lyricka-a-epicka-roman-povidka",
    rvpNodeId: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-basen-lyricka-a-epicka-roman-povidka",
    title: "Báseň lyrická a epická, román, povídka",
    studentTitle: "Literární žánry",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární pojmy a žánry",
    briefDescription: "Poznáš rozdíl mezi básní, románem a povídkou.",
    keywords: ["lyrická báseň", "epická báseň", "román", "povídka", "balada", "literární žánry"],
    goals: [
      "Rozlišit lyrickou a epickou báseň",
      "Rozlišit román a povídku",
      "Přiřadit dílo ke správnému žánru",
    ],
    boundaries: [
      "Bez podrobné literárněhistorické analýzy",
      "Neprobíráme avantgardní žánry",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Lyrická báseň = pocity (bez příběhu). Epická báseň = příběh ve verších (balada). Román = dlouhá próza. Povídka = kratší próza.",
      steps: [
        "Zjisti: je to próza nebo poezie (verše)?",
        "Poezie bez příběhu? → lyrická báseň.",
        "Poezie s příběhem? → epická báseň / balada.",
        "Próza, dlouhá? → román. Krátká? → povídka.",
      ],
      commonMistake: "Žáci si pletou baladu (epická báseň) s románem. Klíč: balada je ve verších.",
      example: "Kytice (Erben) = balady = epické básně. Tom Sawyer (Twain) = román. Sherlock Holmes (Doyle) = povídky.",
    },
  },
];
