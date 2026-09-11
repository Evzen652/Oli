import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď podle cílů tématu: L1 co znamenají
// pojmy (postava, prostředí, děj, vypravěč, téma, verš, sloka, rým) · L2 pojmy
// použité na krátké ukázce · L3 básnické prostředky v ukázce (přirovnání,
// zosobnění, nadsázka, zdrobnělina).

const POJMY: Kategorie[] = [
  { nazev: "postava", znak: "osoba nebo zvíře, které v příběhu jedná." },
  { nazev: "prostředí", znak: "místo a čas, kde a kdy se příběh odehrává." },
  { nazev: "děj", znak: "to, co se v příběhu postupně stane." },
  { nazev: "vypravěč", znak: "ten, kdo příběh vypráví (já, nebo on či ona)." },
  { nazev: "téma", znak: "o čem celé dílo je, třeba o přátelství nebo odvaze." },
  { nazev: "verš", znak: "jeden řádek básně." },
  { nazev: "sloka", znak: "skupina veršů oddělená od další prázdným řádkem (strofa)." },
  { nazev: "rým", znak: "zvuková shoda konců veršů (les – ples)." },
];
const PROSTREDKY: Kategorie[] = [
  { nazev: "přirovnání", znak: "porovná dvě věci pomocí slov jako, jak nebo než (rychlý jako vítr)." },
  { nazev: "zosobnění", znak: "věc, rostlina nebo příroda jedná jako člověk (vítr zpívá, slunce se usmívá)." },
  { nazev: "nadsázka", znak: "schválně přehání, aby to znělo silněji (čekal jsem sto let)." },
  { nazev: "zdrobnělina", znak: "slovo zmenšené a mazlivé (domeček, sluníčko)." },
];

const Q = (uroven: 1 | 2 | 3, otazka: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo: otazka, veta: otazka, kategorie, klic, proc });

const BANKA_POJMY: Polozka[] = [
  Q(1, "Jak se jmenuje jeden řádek básně?", "verš", "jde o formu básně, o jeden řádek", "Jeden řádek básně je verš."),
  Q(1, "Jak se jmenuje skupina veršů oddělená od další prázdným řádkem?", "sloka", "jde o celou skupinu řádků", "Skupina veršů je sloka (strofa)."),
  Q(1, "Jak se jmenuje zvuková shoda konců veršů, třeba les – ples?", "rým", "jde o to, jak konce veršů znějí", "Shoda konců veršů je rým."),
  Q(1, "Jak se jmenuje osoba nebo zvíře, které v příběhu jedná?", "postava", "jde o toho, kdo v příběhu jedná", "Kdo v příběhu jedná, je postava."),
  Q(1, "Jak se jmenuje místo a doba, kde a kdy se příběh odehrává?", "prostředí", "jde o místo a čas", "Místo a čas příběhu je prostředí."),
  Q(1, "Jak se jmenuje to, co se v příběhu postupně stane?", "děj", "jde o události za sebou", "Události příběhu tvoří děj."),
  Q(1, "Jak se jmenuje ten, kdo příběh vypráví?", "vypravěč", "jde o toho, kdo příběh podává čtenáři", "Kdo příběh vypráví, je vypravěč."),
  Q(1, "Jak se jmenuje to, o čem celé dílo je, třeba o přátelství?", "téma", "jde o hlavní myšlenku celého díla", "O čem dílo je, je jeho téma."),
  Q(1, "Slova kočka – očka na konci dvou veršů tvoří co?", "rým", "konce veršů zní podobně", "Kočka – očka se rýmují."),
  Q(1, "Chaloupka v lese za hluboké noci — co to v příběhu popisuje?", "prostředí", "říká, kde a kdy se to děje", "Chaloupka v lese v noci — místo a čas, tedy prostředí."),
  Q(1, "Honza, jeho pes Rek a zlý kouzelník — co to v příběhu jsou?", "postava", "jsou to ti, kdo v příběhu jednají", "Honza, Rek a kouzelník jsou postavy."),
  Q(1, "Honza odešel z domu, potkal kouzelníka a nakonec ho přelstil — co to je?", "děj", "jsou to události za sebou", "Sled událostí je děj."),
  Q(1, "Kniha vypráví o tom, jak je důležité mít kamaráda — co to vyjadřuje?", "téma", "je to hlavní myšlenka knihy", "Hlavní myšlenka knihy je její téma."),

  Q(2, "V ukázce „Na horách v roubené chalupě žila babička s vnukem.“ — co vyjadřují slova „na horách v roubené chalupě“?", "prostředí", "říkají, kde se to děje", "Na horách v chalupě — místo, tedy prostředí."),
  Q(2, "V ukázce „Na horách v roubené chalupě žila babička s vnukem.“ — co jsou „babička s vnukem“?", "postava", "jsou to ti, o kom se vypráví a kdo jedná", "Babička a vnuk jsou postavy."),
  Q(2, "„Vnuk ráno vyběhl ven, spadl do sněhu a pak se dlouho smál.“ — co vyjadřuje tato věta?", "děj", "říká, co se postupně stalo", "Vyběhl, spadl, smál se — to je děj."),
  Q(2, "„Vyprávím vám, co jsem zažil loni v létě.“ — kdo je tu ten, kdo mluví?", "vypravěč", "někdo nám příběh podává a mluví o sobě", "Ten, kdo vypráví (tady v první osobě), je vypravěč."),
  Q(2, "Báseň: „Padá sníh, / tichý smích.“ — co tvoří slova „sníh“ a „smích“?", "rým", "jsou na konci veršů a zní podobně", "Sníh – smích je rým."),
  Q(2, "Báseň: „Padá sníh, / tichý smích.“ — co je „Padá sníh“?", "verš", "je to jeden řádek básně", "Padá sníh je jeden řádek — verš."),
  Q(2, "Básník napsal dvě části po čtyřech řádcích oddělené mezerou. Co je každá z těch částí?", "sloka", "je to skupina řádků", "Skupina čtyř veršů je sloka."),
  Q(2, "Kniha o dvou klucích, kteří se naučí vzájemně si pomáhat. Co je „pomoc a přátelství“?", "téma", "je to hlavní myšlenka knihy", "Pomoc a přátelství jsou téma knihy."),
  Q(2, "„Pohádka se odehrává v království za sedmero horami.“ — co tu je popsáno?", "prostředí", "říká, kde se pohádka odehrává", "Království za horami — prostředí."),
  Q(2, "„Hlavní hrdinkou je statečná Maruška.“ — čím je Maruška?", "postava", "Maruška v pohádce jedná", "Maruška je postava (hlavní)."),
  Q(2, "„Nejdřív se Maruška v lese ztratila, pak ji našel myslivec.“ — co to je?", "děj", "jsou to události za sebou", "Ztratila se, našel ji — děj."),
  Q(2, "„Petr vypráví, co se stalo jeho sestře.“ — jakou úlohu tu má Petr?", "vypravěč", "Petr příběh podává", "Petr příběh vypráví — je vypravěč."),
  Q(2, "Dvojice „les – ples, voda – škoda“ na koncích veršů — co to je?", "rým", "konce veršů spolu zní", "Les – ples, voda – škoda jsou rýmy."),

  Q(3, "Běžel rychle jako vítr. — Jaký prostředek tu je?", "přirovnání", "porovnává běh s větrem slovem jako", "Rychle jako vítr — přirovnání."),
  Q(3, "Vítr zpíval v korunách stromů. — Jaký prostředek tu je?", "zosobnění", "vítr tu zpívá jako člověk", "Vítr zpívá — zosobnění."),
  Q(3, "Čekal jsem na tebe sto let! — Jaký prostředek tu je?", "nadsázka", "sto let se nečeká, je to schválně přehnané", "Sto let — nadsázka."),
  Q(3, "Na kopci stál malý domeček. — Jaký prostředek tu je?", "zdrobnělina", "domeček je zmenšené slovo dům", "Domeček — zdrobnělina."),
  Q(3, "Stará vrba se nad potokem smutně skláněla a plakala. — Jaký prostředek tu je?", "zosobnění", "vrba pláče jako člověk", "Vrba pláče — zosobnění."),
  Q(3, "Ve frontě na zmrzlinu stály miliony lidí. — Jaký prostředek tu je?", "nadsázka", "miliony lidí ve frontě být nemohou", "Miliony lidí — nadsázka."),
  Q(3, "Jezero bylo hladké jako zrcadlo. — Jaký prostředek tu je?", "přirovnání", "porovnává jezero se zrcadlem", "Hladké jako zrcadlo — přirovnání."),
  Q(3, "Pejsek radostně vrtěl ocáskem. — Jaký prostředek tu je?", "zdrobnělina", "pejsek a ocásek jsou zmenšená slova", "Pejsek, ocásek — zdrobněliny."),
  Q(3, "Byl vyšší než věž kostela. — Jaký prostředek tu je?", "přirovnání", "porovnává výšku slovem než", "Vyšší než věž — přirovnání."),
  Q(3, "Dům na nás zíral prázdnými okny. — Jaký prostředek tu je?", "zosobnění", "dům zírá jako člověk", "Dům zírá — zosobnění."),
  Q(3, "Tolik jsem se nasmál, že jsem málem praskl. — Jaký prostředek tu je?", "nadsázka", "prasknout smíchy nejde", "Málem praskl — nadsázka."),
  Q(3, "Na stole ležela hromádka knížek. — Jaký prostředek tu je?", "zdrobnělina", "hromádka a knížky jsou zmenšená slova", "Hromádka, knížky — zdrobněliny."),
  Q(3, "Jaro zaťukalo na okno. — Jaký prostředek tu je?", "zosobnění", "jaro ťuká jako člověk", "Jaro ťuká — zosobnění."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA_POJMY, level >= 3 ? PROSTREDKY : POJMY, level >= 3 ? 3 : level, (p) => ({
    question: p.veta,
    hints: [
      level >= 3
        ? `Porovnává věta „${p.veta.split(" — ")[0]}“ dvě věci, přehání, zmenšuje, nebo se v ní něco chová jako člověk?`
        : `Týká se otázka „…${p.veta.slice(-40)}“ formy básně, nebo příběhu?`,
      `Pomůže tohle: ${p.klic}.`,
    ],
  }));
}

export const ELEMENTARNILITERARNIPOJMYPRIROZBORUTEXTU: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu",
    rvpNodeId: "g5-cjl-literarni-vychova-prace-s-textem-elementarni-literarni-pojmy-pri-rozboru-textu",
    title: "Elementární literární pojmy při rozboru textu",
    studentTitle: "Rozbor textu",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se základní literární pojmy pro rozbor textu.",
    keywords: ["téma", "postava", "prostředí", "děj", "vypravěč", "verš", "sloka", "rým", "přirovnání", "zosobnění"],
    goals: [
      "Používat základní literární pojmy správně",
      "Rozebrat literární text pomocí pojmů (téma, postava, prostředí, děj, vypravěč)",
      "Popsat formu básně (verš, sloka, rým)",
      "Poznat v ukázce přirovnání, zosobnění, nadsázku a zdrobnělinu",
    ],
    boundaries: [
      "Bez pokročilé naratologie a literární teorie",
      "Úroveň 3: básnické prostředky přirovnání, zosobnění, nadsázka a zdrobnělina; bez dalších figur",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Téma = o čem dílo je. Postava = kdo jedná. Prostředí = kde a kdy. Děj = co se stalo. Vypravěč = kdo to vypráví. Verš = řádek básně, sloka = skupina veršů, rým = shoda konců veršů.",
      steps: [
        "Přečti text.",
        "Urči téma: o čem to je celkově?",
        "Najdi postavy: kdo jedná?",
        "Popiš prostředí: kde a kdy se to děje?",
        "Sleduj děj: co se stalo?",
        "Zjisti vypravěče: vypráví o sobě (já), nebo o někom jiném (on, ona)?",
        "U básně spočítej verše a sloky a najdi rýmy.",
      ],
      commonMistake: "Žáci si pletou téma a děj. Téma = o čem dílo je celkově (třeba o odvaze). Děj = co se v něm postupně stane.",
      example: "Téma: odvaha. Postava: Jan. Prostředí: přístav v noci. Děj: Jan zachrání trosečníka. Vypravěč: vypráví o Janovi (on).",
    },
  },
];
