import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[] }[] = [
  { q: "Co je popis?", a: "Slohový útvar, který přesně zachycuje vzhled nebo vlastnosti", opts: ["Slohový útvar, který přesně zachycuje vzhled nebo vlastnosti", "Příběh s dobrodružstvím", "Báseň s rýmy", "Dopis kamarádovi"] },
  { q: "V jakém pořadí popisujeme předmět?", a: "Od celku k detailu (nejdřív celek, pak podrobnosti)", opts: ["Od celku k detailu (nejdřív celek, pak podrobnosti)", "Náhodně", "Od nejmenšího detailu", "Abecedně"] },
  { q: "Která slova se hodí do popisu?", a: "Přídavná jména (velký, červený, kulatý, měkký)", opts: ["Přídavná jména (velký, červený, kulatý, měkký)", "Jen slovesa", "Jen číslovky", "Jen podstatná jména"] },
  { q: "Co popisujeme u zvířete?", a: "Tělo, barvu, velikost, chování a prostředí", opts: ["Tělo, barvu, velikost, chování a prostředí", "Jen barvu", "Jen co jí", "Jen kde žije"] },
  { q: "Co popisujeme u osoby?", a: "Vzhled (výška, vlasy, oči) a povahu", opts: ["Vzhled (výška, vlasy, oči) a povahu", "Jen výšku", "Jen jméno", "Jen věk"] },
  { q: "Ukázka popisu: 'Míč je kulatý, červený a gumový. Je velký jako pomeranč.' Co se tu popisuje?", a: "Předmět — míč (tvar, barva, materiál, velikost)", opts: ["Předmět — míč (tvar, barva, materiál, velikost)", "Jak míč skáče", "Příběh o míči", "Kde míč koupíme"] },
  { q: "Dobrý popis musí být:", a: "Přesný a srozumitelný, aby si čtenář věc představil", opts: ["Přesný a srozumitelný, aby si čtenář věc představil", "Co nejdelší", "Plný přirovnání", "Psán jen v přítomném čase"] },
  { q: "Které smysly využíváme při popisu?", a: "Zrak, sluch, hmat, čich, chuť", opts: ["Zrak, sluch, hmat, čich, chuť", "Jen zrak", "Jen zrak a sluch", "Žádné"] },
  { q: "Jak zahájíme popis předmětu?", a: "Pojmenujeme, co popisujeme a kde ho najdeme", opts: ["Pojmenujeme, co popisujeme a kde ho najdeme", "Začneme příběhem", "Napíšeme datum", "Napíšeme jméno autora"] },
  { q: "Popis psa — co nevhodně patří do popisu?", a: "'Pes mi přinesl noviny.' (děj, ne popis vzhledu)", opts: ["'Pes mi přinesl noviny.' (děj, ne popis vzhledu)", "'Pes má hnědou srst.'", "'Pes je středně velký.'", "'Pes má černé oči.'"] },
  { q: "Popis je napsán v čase:", a: "Přítomném (popisujeme, jak to právě je)", opts: ["Přítomném (popisujeme, jak to právě je)", "Minulém", "Budoucím", "Záleží na žánru"] },
  { q: "Co odlišuje popis od vypravování?", a: "Popis zachycuje vzhled (jak to vypadá), vypravování zachycuje děj (co se stalo)", opts: ["Popis zachycuje vzhled (jak to vypadá), vypravování zachycuje děj (co se stalo)", "Žádný rozdíl", "Popis je vždy kratší", "Vypravování nemá pořadí"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Popis = jak to vypadá (tvar, barva, velikost, vlastnosti).", "Postupuj od celku k detailu."],
    solutionSteps: [`Odpověď: ${a}`],
  }));
}

export const POPISPREDMETU: TopicMetadata[] = [
  {
    id: "g3-cjl-popis-predmetu",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-predmetu-zvirete-osoby",
    title: "Popis předmětu, zvířete, osoby",
    studentTitle: "Popis věci a zvířete",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se přesně popsat věc, zvíře nebo osobu.",
    keywords: ["popis", "přídavná jména", "vzhled", "vlastnosti", "od celku k detailu", "smysly"],
    goals: ["Napsat popis předmětu od celku k detailu.", "Použít přídavná jména pro přesnější popis.", "Rozlišit popis od vypravování."],
    boundaries: ["Jednoduchý popis pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Popis: Jaký? Jak velký? Jaké barvy? Z čeho? K čemu slouží? — od celku k detailu.",
      steps: ["Pojmenuj, co popisuješ.", "Celek: velikost, tvar, barva.", "Detaily: části, materiál, zvláštnosti.", "Zakončení: k čemu slouží."],
      commonMistake: "Přidání děje do popisu: 'Míč skočil přes plot.' → to patří do vypravování, ne popisu.",
      example: "Jablko je kulatý ovoce. Je zelené nebo červené. Má hladkou slupku a uvnitř bílou dužinu. Jablko je sladké a šťavnaté.",
    },
  },
];
