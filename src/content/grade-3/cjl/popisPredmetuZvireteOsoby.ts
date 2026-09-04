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
  { q: "Co je popis?", a: "Útvar zachycující vzhled a vlastnosti", opts: ["Útvar zachycující vzhled a vlastnosti", "Příběh s dobrodružstvím", "Báseň s rýmy", "Dopis kamarádovi"], e: "Popis říká, jak věc nebo bytost vypadá — jakou má barvu, tvar, velikost a vlastnosti. Příběh nebo dopis jsou jiné slohové útvary, kde se něco děje nebo posíláme zprávu." },
  { q: "V jakém pořadí popisujeme předmět?", a: "Od celku k detailu", opts: ["Od celku k detailu", "Náhodně", "Od nejmenšího detailu", "Abecedně"], e: "Nejdřív řekneme, co věc celkově je ('míč je kulatý a červený'), a teprve pak přidáváme podrobnosti ('má černý proužek'). Kdybychom začali od malých detailů, čtenář by se v popisu ztratil." },
  { q: "Která slova se hodí do popisu?", a: "Přídavná jména", opts: ["Přídavná jména", "Jen slovesa", "Jen číslovky", "Jen podstatná jména"], e: "Přídavná jména nám říkají, jaký věc je — velký, červený, kulatý, měkký. Slovesa by ukazovala, co se děje, a děj do popisu nepatří." },
  { q: "Co popisujeme u zvířete?", a: "Tělo, barvu, velikost, chování a prostředí", opts: ["Tělo, barvu, velikost, chování a prostředí", "Jen to, čím se zvíře živí", "Jen barvu srsti nebo peří", "Jen místo, kde zvíře žije"], e: "Dobrý popis zvířete zahrnuje, jak vypadá (tělo, barva, velikost), jak se chová a kde žije. Jediná z těchto věcí by nestačila — čtenář by si zvíře nedokázal představit." },
  { q: "Co popisujeme u osoby?", a: "Vzhled a povahu", opts: ["Vzhled a povahu", "Jen výšku", "Jen jméno", "Jen věk"], e: "Popis osoby zahrnuje, jak člověk vypadá (výška, barva vlasů a očí) a jaký je (hodný, veselý, pilný). Samotná výška ani jméno by nestačily." },
  { q: "Ukázka popisu: 'Míč je kulatý, červený a gumový. Je velký jako pomeranč.' Co se tu popisuje?", a: "Míč a jeho vlastnosti", opts: ["Míč a jeho vlastnosti", "Jak míč skáče", "Příběh o míči", "Kde míč koupíme"], e: "V ukázce se dozvídáme tvar, barvu, materiál i velikost míče — to jsou vlastnosti předmětu. Nic se tu neděje, takže jde o popis, ne o příběh." },
  { q: "Dobrý popis musí být:", a: "Přesný a srozumitelný", opts: ["Přesný a srozumitelný", "Co nejdelší", "Plný přirovnání", "Psán jen v přítomném čase"], e: "Cílem popisu je, aby si čtenář věc dokázal jasně představit. Dlouhý popis plný přirovnání může být naopak matoucí — důležitá je jasnost a přesnost." },
  { q: "Které smysly využíváme při popisu?", a: "Zrak, sluch, hmat, čich, chuť", opts: ["Zrak, sluch, hmat, čich, chuť", "Jen zrak", "Jen zrak a sluch", "Žádné"], e: "Popis může zapojit všechny smysly — u jablka napíšeme, že je červené (zrak), šťavnaté (chuť), voní (čich) a má hladkou slupku (hmat). Čím víc smyslů použiješ, tím je popis živější." },
  { q: "Jak zahájíme popis předmětu?", a: "Pojmenujeme, co popisujeme", opts: ["Pojmenujeme, co popisujeme", "Začneme příběhem", "Napíšeme datum", "Napíšeme jméno autora"], e: "Na začátku popisu čtenáři řekneme, o čem budeme psát — třeba 'Popisuji tužku, kterou najdeme v penálu.' Díky tomu hned ví, na co se má soustředit." },
  { q: "Popis psa — co nevhodně patří do popisu?", a: "'Pes mi přinesl noviny.'", opts: ["'Pes mi přinesl noviny.'", "'Pes má hnědou srst.'", "'Pes je středně velký.'", "'Pes má černé oči.'"], e: "Tahle věta říká, co pes udělal — to je děj a patří do vypravování. Popis má zachytit, jak pes vypadá, ne co právě dělal. Ostatní tři věty popisují vzhled." },
  { q: "Popis je napsán v čase:", a: "Přítomném", opts: ["Přítomném", "Minulém", "Budoucím", "Záleží na žánru"], e: "Popis zachycuje věci tak, jak jsou teď — proto používáme přítomný čas (je, má, vypadá). Minulý čas bychom použili v příběhu, kde se něco stalo." },
  { q: "Co odlišuje popis od vypravování?", a: "Popis zachycuje vzhled, vypravování děj", opts: ["Popis zachycuje vzhled, vypravování děj", "Žádný rozdíl", "Popis je vždy kratší", "Vypravování nemá pořadí"], e: "Popis odpovídá na otázku 'Jak to vypadá?' a zachycuje vlastnosti věci nebo bytosti. Vypravování odpovídá na otázku 'Co se stalo?' a sleduje sled událostí. Délka o tom nerozhoduje." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Popis říká, jak to vypadá — barva, tvar, velikost, vlastnosti.", "Postupuj systematicky: nejdřív to hlavní a nápadné, teprve pak drobnosti. A hlídej si, aby ses nezačal věnovat tomu, co se stalo — to už by nebyl popis."],
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
      example: "Jablko je kulaté ovoce. Je zelené nebo červené. Má hladkou slupku a uvnitř bílou dužinu. Jablko je sladké a šťavnaté.",
    },
  },
];
