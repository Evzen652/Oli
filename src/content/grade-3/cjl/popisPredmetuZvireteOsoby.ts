import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[]; e: string }[] = [
  { q: "Co je popis?", a: "Slohový útvar, který přesně zachycuje vzhled nebo vlastnosti", opts: ["Slohový útvar, který přesně zachycuje vzhled nebo vlastnosti", "Příběh s dobrodružstvím", "Báseň s rýmy", "Dopis kamarádovi"], e: "Popis říká, jak věc nebo bytost vypadá — jakou má barvu, tvar, velikost a vlastnosti. Příběh nebo dopis jsou jiné slohové útvary, kde se třeba něco děje nebo posíláme zprávu." },
  { q: "V jakém pořadí popisujeme předmět?", a: "Od celku k detailu (nejdřív celek, pak podrobnosti)", opts: ["Od celku k detailu (nejdřív celek, pak podrobnosti)", "Náhodně", "Od nejmenšího detailu", "Abecedně"], e: "Nejdřív řekneme, co věc celkově je (třeba 'míč je kulatý a červený'), a teprve pak přidáváme podrobnosti (třeba 'má černý proužek'). Kdybychom začali od malých detailů, čtenář by se v popisu ztratil." },
  { q: "Která slova se hodí do popisu?", a: "Přídavná jména (velký, červený, kulatý, měkký)", opts: ["Přídavná jména (velký, červený, kulatý, měkký)", "Jen slovesa", "Jen číslovky", "Jen podstatná jména"], e: "Přídavná jména nám říkají, jaký věc je — jakou má barvu, tvar nebo povrch. Slovesa by nám ukazovala, co se děje, a to do popisu nepatří." },
  { q: "Co popisujeme u zvířete?", a: "Tělo, barvu, velikost, chování a prostředí", opts: ["Tělo, barvu, velikost, chování a prostředí", "Jen barvu", "Jen co jí", "Jen kde žije"], e: "Dobrý popis zvířete zahrnuje, jak vypadá (tělo, barva, velikost), jak se chová a kde žije. Jen jedna z těchto věcí by nestačila — čtenář by si zvíře dobře nepředstavil." },
  { q: "Co popisujeme u osoby?", a: "Vzhled (výška, vlasy, oči) a povahu", opts: ["Vzhled (výška, vlasy, oči) a povahu", "Jen výšku", "Jen jméno", "Jen věk"], e: "Popis osoby zahrnuje, jak daný člověk vypadá (barva vlasů, výška, barva očí) a jaký je (hodný, veselý, pilný). Jen výška nebo jen jméno by nestačilo — nevěděli bychom si toho člověka představit." },
  { q: "Ukázka popisu: 'Míč je kulatý, červený a gumový. Je velký jako pomeranč.' Co se tu popisuje?", a: "Předmět — míč (tvar, barva, materiál, velikost)", opts: ["Předmět — míč (tvar, barva, materiál, velikost)", "Jak míč skáče", "Příběh o míči", "Kde míč koupíme"], e: "V ukázce se dozvídáme, jaký míč je (kulatý, červený, gumový) a jak je velký — to jsou všechno vlastnosti předmětu. Nic se tu neděje, takže jde o popis, ne o příběh." },
  { q: "Dobrý popis musí být:", a: "Přesný a srozumitelný, aby si čtenář věc představil", opts: ["Přesný a srozumitelný, aby si čtenář věc představil", "Co nejdelší", "Plný přirovnání", "Psán jen v přítomném čase"], e: "Cílem popisu je, aby si čtenář věc dokázal jasně představit. Dlouhý popis plný přirovnání může být naopak matoucí — důležitá je jasnost a přesnost." },
  { q: "Které smysly využíváme při popisu?", a: "Zrak, sluch, hmat, čich, chuť", opts: ["Zrak, sluch, hmat, čich, chuť", "Jen zrak", "Jen zrak a sluch", "Žádné"], e: "Popis může zapojit všechny smysly — třeba u jablka napíšeme, že je červené (zrak), šťavnaté (chuť), voní (čich) a má hladkou slupku (hmat). Čím více smyslů použijeme, tím živější je popis." },
  { q: "Jak zahájíme popis předmětu?", a: "Pojmenujeme, co popisujeme a kde ho najdeme", opts: ["Pojmenujeme, co popisujeme a kde ho najdeme", "Začneme příběhem", "Napíšeme datum", "Napíšeme jméno autora"], e: "Na začátku popisu čtenáři řekneme, o čem budeme psát — třeba 'Popisuji tužku, kterou najdeme v penálu.' Díky tomu hned ví, na co se má soustředit." },
  { q: "Popis psa — co nevhodně patří do popisu?", a: "'Pes mi přinesl noviny.' (děj, ne popis vzhledu)", opts: ["'Pes mi přinesl noviny.' (děj, ne popis vzhledu)", "'Pes má hnědou srst.'", "'Pes je středně velký.'", "'Pes má černé oči.'"], e: "Věta 'Pes mi přinesl noviny' říká, co pes udělal — to je děj a patří do vypravování. Popis má zachytit, jak pes vypadá, ne co právě dělal." },
  { q: "Popis je napsán v čase:", a: "Přítomném (popisujeme, jak to právě je)", opts: ["Přítomném (popisujeme, jak to právě je)", "Minulém", "Budoucím", "Záleží na žánru"], e: "Popis zachycuje věci tak, jak jsou teď — proto používáme přítomný čas (je, má, vypadá). Minulý čas bychom použili třeba v příběhu, kde se něco stalo." },
  { q: "Co odlišuje popis od vypravování?", a: "Popis zachycuje vzhled (jak to vypadá), vypravování zachycuje děj (co se stalo)", opts: ["Popis zachycuje vzhled (jak to vypadá), vypravování zachycuje děj (co se stalo)", "Žádný rozdíl", "Popis je vždy kratší", "Vypravování nemá pořadí"], e: "Popis odpovídá na otázku 'Jak to vypadá?' a zachycuje vlastnosti věci nebo bytosti. Vypravování odpovídá na otázku 'Co se stalo?' a sleduje nějaký příběh nebo sled událostí." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Popis = jak to vypadá (tvar, barva, velikost, vlastnosti).", "Postupuj od celku k detailu."],
    explanation: e,
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
