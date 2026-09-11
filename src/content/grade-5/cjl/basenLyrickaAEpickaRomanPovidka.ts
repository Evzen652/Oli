import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď se podle popisu díla nebo krátké
// vlastní ukázky určuje, o jaký útvar jde: L1 zřetelné popisy · L2 ukázky
// a popisy s méně nápadnými znaky · L3 zrádné případy (příběh ve verších je
// báseň epická, ne povídka; krátká próza s jedním dějem je povídka, ne román).

const UTVARY: Kategorie[] = [
  { nazev: "báseň lyrická", znak: "ve verších vyjadřuje pocity a nálady, nevypráví příběh." },
  { nazev: "báseň epická", znak: "ve verších vypráví příběh s postavami a dějem (třeba balada)." },
  { nazev: "povídka", znak: "kratší vyprávění v próze s jedním hlavním dějem a několika postavami." },
  { nazev: "román", znak: "rozsáhlé vyprávění v próze s mnoha postavami a delším, rozvětveným dějem." },
];
const LYR = "báseň lyrická", EP = "báseň epická", POV = "povídka", ROM = "román";
const P = (uroven: 1 | 2 | 3, popis: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo: popis, veta: popis, kategorie, klic, proc });

const BANKA: Polozka[] = [
  P(1, "Básník ve verších popisuje, jak smutně se cítí za deštivého podzimního večera.", LYR, "jde o verše a o pocity, žádný příběh se tu nevypráví", "Verše vyjadřující pocity — báseň lyrická."),
  P(1, "Ve verších se vypráví, jak statečný rytíř přemohl draka a zachránil princeznu.", EP, "je to ve verších a má to postavy a děj", "Příběh vyprávěný ve verších — báseň epická."),
  P(1, "Na několika stranách se v odstavcích vypráví, jak Tonda ztratil klíče a našel je až večer.", POV, "je to krátké, v próze a má jeden děj", "Krátké vyprávění v próze s jedním dějem — povídka."),
  P(1, "Tlustá kniha o čtyřech stech stranách sleduje osudy celé rodiny během mnoha let.", ROM, "je to velmi dlouhé, v próze a s mnoha postavami", "Rozsáhlá próza s mnoha postavami — román."),
  P(1, "Krátká báseň oslavuje krásu jarní louky a radost z prvního tepla.", LYR, "vyjadřuje radost a obdiv, neděje se v ní žádný příběh", "Báseň plná pocitů bez děje — báseň lyrická."),
  P(1, "Balada ve verších vypráví, co se stalo matce, která nedodržela slib.", EP, "je ve verších a vypráví příběh", "Balada vypráví ve verších příběh — báseň epická."),
  P(1, "Příběh na pár stranách o tom, jak dvě kamarádky zachránily koťátko ze stromu.", POV, "je krátký, v próze a má jeden děj", "Krátká próza s jednou příhodou — povídka."),
  P(1, "Rozsáhlý příběh v několika dílech o chlapci, který studuje na kouzelnické škole a zažívá mnoho dobrodružství.", ROM, "je velmi dlouhý, má mnoho postav a dějových linií", "Rozsáhlý prozaický příběh — román."),
  P(1, "Básník ve verších vyznává, jak moc má rád svůj rodný kraj.", LYR, "vyjadřuje vztah a pocity, nevypráví děj", "Vyjádření pocitů ve verších — báseň lyrická."),
  P(1, "Ve verších se vypráví, jak vodník stáhl do rybníka dívku, která ho neposlechla.", EP, "je ve verších a vypráví příběh s postavami", "Příběh ve verších — báseň epická (balada)."),
  P(1, "Krátké vyprávění v próze o jednom zvláštním dni na táboře.", POV, "je krátké, v próze a o jedné příhodě", "Krátká próza s jedním dějem — povídka."),
  P(1, "Kniha o trosečníkovi, který mnoho let přežívá na pustém ostrově a postupně buduje svůj svět.", ROM, "je to dlouhé vyprávění v próze o mnoha letech života", "Dlouhé prozaické vyprávění — román (například Robinson Crusoe)."),
  P(1, "Verše zachycují ticho zasněženého lesa a klid, který básník cítí.", LYR, "zachycuje náladu, neděje se nic", "Nálada a pocity ve verších — báseň lyrická."),

  P(2, "„Padá listí, padá tiše, / smutek se mi v srdci píše.“", LYR, "jsou to verše a mluví o pocitu smutku", "Verše vyjadřující smutek — báseň lyrická."),
  P(2, "„Šel Honza lesem do světa, / potkal tam dědu s kloboukem, / ten mu dal radu na cestu…“", EP, "jsou to verše a něco se v nich děje: postava jde, potká někoho", "Ve verších se vypráví děj — báseň epická."),
  P(2, "„Když Eliška ráno otevřela oči, byla na zahradě tma. Rychle se oblékla a vyběhla ven…“ Celý text má pět stran.", POV, "je to próza, krátká, s jednou příhodou", "Krátká próza — povídka."),
  P(2, "Kniha má třicet kapitol a vypráví o dětství, dospívání i dospělosti hlavní hrdinky a jejích přátel.", ROM, "je velmi dlouhá a sleduje mnoho let a postav", "Rozsáhlá próza — román."),
  P(2, "Sbírka Kytice od Karla Jaromíra Erbena obsahuje příběhy vyprávěné ve verších, například Polednici nebo Vodníka.", EP, "jsou to verše, které vyprávějí strašidelné příběhy", "Básně z Kytice jsou balady — básně epické."),
  P(2, "„Ó, jak krásné je ráno, když zpívají ptáci / a slunce mě hladí po tváři.“", LYR, "jsou to verše plné radosti, žádný příběh", "Verše vyjadřující radost — báseň lyrická."),
  P(2, "Na dvou stranách čteme, jak se dědeček ztratil v obchoďáku a jak ho vnuk našel u hraček.", POV, "je to krátké vyprávění v próze", "Krátká próza s jedním dějem — povídka."),
  P(2, "Příběh ve verších o hloupém Honzovi, který nakonec vyzraje na lakomého krále.", EP, "je ve verších a má děj s postavami", "Děj ve verších — báseň epická."),
  P(2, "Mnohasetstránková kniha sleduje osudy vesnice během války i po ní očima několika rodin.", ROM, "je to rozsáhlé vyprávění s mnoha postavami", "Rozsáhlé vyprávění v próze — román."),
  P(2, "Básník přirovnává svou lásku k matce k teplu kamen v zimě.", LYR, "vyjadřuje cit, nevypráví děj", "Vyjádření citu — báseň lyrická."),
  P(2, "Sbírka krátkých příběhů v próze, z nichž každý vypráví jinou příhodu ze školy.", POV, "každý příběh je krátký, v próze a má jeden děj", "Každý z krátkých prozaických příběhů je povídka."),
  P(2, "„Za devatero horami žil kovář. Jednou k němu přišel voják…“ — dlouhé vyprávění ve verších o jejich společné cestě.", EP, "vypráví příběh, a to ve verších", "Příběh vyprávěný ve verších — báseň epická."),
  P(2, "Kniha o mnoha kapitolách, v níž se střídají vypravěči a děj se odehrává ve třech různých městech.", ROM, "je rozsáhlá a má několik dějových linií", "Rozvětvený rozsáhlý děj — román."),

  P(3, "Krátký text ve verších, ve kterém dívka jde přes les, potká vlka a uteče mu.", EP, "i když je text krátký, je ve verších a vypráví příběh", "Krátkost nerozhoduje — příběh ve verších je báseň epická, ne povídka."),
  P(3, "Krátký text v próze o jednom odpoledni na rybníce, kde se chlapec poprvé naučí plavat.", POV, "je v próze, krátký a má jeden děj", "Próza s jedním dějem je povídka; román by byl mnohem rozsáhlejší."),
  P(3, "Dlouhá báseň, ve které básník postupně popisuje, co cítí v každém ročním období.", LYR, "je dlouhá, ale nevypráví příběh, jen vyjadřuje pocity", "Délka nerozhoduje — báseň bez děje, plná pocitů, je lyrická."),
  P(3, "Kniha o dvaceti kapitolách vypráví ve verších, jak se chudý chlapec stal králem.", EP, "je rozsáhlá, ale psaná ve verších", "Vyprávění ve verších je báseň epická, i když je dlouhé jako kniha."),
  P(3, "Text v próze na tři strany, ve kterém vypravěč jen líčí, jak voní les po dešti a jak se cítí.", POV, "je v próze a krátký; román by byl mnohem delší", "Krátký prozaický text se řadí k povídkám (i když se v něm skoro nic neděje)."),
  P(3, "Verše, v nichž básník oslovuje měsíc a svěřuje se mu se svým stesknem.", LYR, "vyjadřuje stesk, nevypráví děj", "Oslovení a vyjádření pocitů — báseň lyrická."),
  P(3, "Vyprávění v próze na tři sta stran o jedné výpravě, na kterou se vydá deset postav, a o tom, co každá z nich prožije.", ROM, "je rozsáhlé a sleduje osudy mnoha postav", "Rozsáhlá próza s mnoha postavami a liniemi — román."),
  P(3, "Balada o dívce, která v noci na hřbitově potká ducha.", EP, "balada je ve verších a vypráví příběh", "Balada je báseň epická."),
  P(3, "Krátká básnička, ve které si dítě představuje, jaké by to bylo být ptákem.", LYR, "vyjadřuje představy a pocity, nevypráví příběh", "Představy a pocity ve verších — báseň lyrická."),
  P(3, "Příběh v próze na dvě strany s jednou postavou, která celý den čeká na dopis.", POV, "je krátký, v próze, s jednou postavou a jedním dějem", "Krátké prozaické vyprávění — povídka."),
  P(3, "Kniha, v níž se v próze střídají kapitoly z pohledu čtyř sourozenců během jednoho dlouhého léta.", ROM, "je rozsáhlá, s více postavami a vypravěči", "Rozsáhlé prozaické vyprávění s více postavami — román."),
  P(3, "Verše, které vyprávějí, jak se sedlák se sousedem přeli o mez a jak je rozsoudil rychtář.", EP, "je ve verších a má děj", "Příběh ve verších — báseň epická."),
  P(3, "Verše popisují, jak básník vidí z okna první sníh a jak ho to rozesměje.", LYR, "zachycuje dojem a pocit, ne příběh", "Dojem a pocit ve verších — báseň lyrická."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, UTVARY, level, (p) => ({
    question: `O jaký útvar jde? ${p.veta}`,
    hints: [
      `Je text „${p.veta.slice(0, 60)}${p.veta.length > 60 ? "…" : ""}“ psaný ve verších, nebo v próze?`,
      `Pomůže tohle: ${p.klic}.`,
    ],
  }));
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
      "Rozšiřující nad rámec RVP 5. ročníku: lyrický subjekt, leitmotiv, literární druhy (lyrika/epika/drama)",
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
