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
  { q: "Co je vypravování?", a: "Slohový útvar, který vypráví příběh s dějem", opts: ["Slohový útvar, který vypráví příběh s dějem", "Popis věcí a osob", "Výčet faktů", "Vědecký text"], e: "Vypravování je takový útvar, kde něco vyprávíš — máš postavy, místo a děj, kde se něco stane. Popis nebo výčet faktů příběh nemají, takže to není vypravování." },
  { q: "Jak se jmenují tři části vypravování?", a: "Úvod, zápletka (střed), závěr", opts: ["Úvod, zápletka (střed), závěr", "Začátek, konec, jméno", "Popis, děj, poznámka", "1. část, 2. část, 3. část"], e: "Každý příběh má tři části: v úvodu se dozvíš kdo, kde a kdy; v zápletce se něco přihodí; a závěr říká, jak to dopadlo. Bez jedné části by příběh nebyl celý." },
  { q: "Co je osnova ve vypravování?", a: "Plán — body, co se bude dít v jakém pořadí", opts: ["Plán — body, co se bude dít v jakém pořadí", "Obrázek k příběhu", "Závěr příběhu", "Jméno autora"], e: "Osnova je jako nákupní seznam — jenom místo věcí si do ní zapíšeš, co se v příběhu bude dít a v jakém pořadí. Díky osnově nezapomeneš nic důležitého." },
  { q: "Co obsahuje úvod příběhu?", a: "Kde, kdy a kdo — uvedení čtenáře do příběhu", opts: ["Kde, kdy a kdo — uvedení čtenáře do příběhu", "Největší napětí", "Závěr a ponaučení", "Výčet postav"], e: "Úvod uvede čtenáře do příběhu — dozví se, kde se příběh odehrává, kdy to bylo a kdo jsou postavy. Největší napětí nebo závěr do úvodu nepatří, to přijde později." },
  { q: "Co je zápletka (střed)?", a: "Hlavní příhoda — problém nebo dobrodružství", opts: ["Hlavní příhoda — problém nebo dobrodružství", "Klidný popis prostředí", "Pozdravy a rozloučení", "Úvodní věta"], e: "Zápletka je srdce příběhu — stane se něco zajímavého, nastane problém nebo dobrodružství. Kdyby se nic nestalo, příběh by byl nudný a nebyl by to příběh." },
  { q: "Co obsahuje závěr příběhu?", a: "Jak se vše vyřeší a skončí, případně ponaučení", opts: ["Jak se vše vyřeší a skončí, případně ponaučení", "Začátek nové zápletky", "Popis postav", "Datum napsání"], e: "Závěr uzavírá příběh — čtenář se dozví, jak problém ze zápletky dopadl a jak se vše vyřešilo. Někdy přidáme i ponaučení, co se postavy naučily." },
  { q: "Proč je v příběhu důležité pořadí (časová posloupnost)?", a: "Aby byl příběh srozumitelný a logický", opts: ["Aby byl příběh srozumitelný a logický", "Není důležité", "Aby byl delší", "Aby měl rýmy"], e: "Když bys vyprávěl nejdřív závěr a pak teprve úvod, nikdo by nevěděl, o čem mluvíš. Správné pořadí událostí pomáhá tomu, aby příběh dával smysl." },
  { q: "Jaká slůvka pomáhají zachovat pořadí událostí?", a: "Nejdříve, potom, nakonec, pak, brzy", opts: ["Nejdříve, potom, nakonec, pak, brzy", "Velký, malý, červený", "Ale, nebo, protože", "Já, ty, on, ona"], e: "Slůvka jako 'nejdříve', 'potom' nebo 'nakonec' říkají čtenáři, co se stalo dřív a co pak — jsou to takové ukazatele pořadí. Přídavná jména ani zájmena pořadí nevyjadřují." },
  { q: "Co je obrázkový osnova?", a: "Série obrázků, které ukazují pořadí děje", opts: ["Série obrázků, které ukazují pořadí děje", "Nakreslená mapa", "Portrét hlavní postavy", "Ilustrace bez příběhu"], e: "Obrázkovou osnovu tvoří obrázky seřazené za sebou — každý ukazuje jednu část příběhu. Je to jako komiks, který ti pomůže si vzpomenout, co se dělo dřív a co potom." },
  { q: "Příběh začíná: 'Jednoho rána...' — Jaká část je to?", a: "Úvod (začátek příběhu)", opts: ["Úvod (začátek příběhu)", "Zápletka", "Závěr", "Ponaučení"], e: "Věta 'Jednoho rána...' nás teprve uvádí do příběhu — říká kdy — takže jde o úvod. Zápletka nebo závěr přicházejí až později, ne na samém začátku." },
  { q: "Příběh pokračuje: 'Náhle se stalo, že...' — Jaká část?", a: "Zápletka (střed — problém nebo obrat)", opts: ["Zápletka (střed — problém nebo obrat)", "Úvod", "Závěr", "Osnova"], e: "Slovo 'náhle' naznačuje, že se něco nečekaného přihodilo — to je typická zápletka uprostřed příběhu. Úvod by nás teprve seznamoval s postavami a místem." },
  { q: "Příběh končí: 'A tak se vše vyřešilo a všichni byli šťastní.' — Jaká část?", a: "Závěr (rozuzlení příběhu)", opts: ["Závěr (rozuzlení příběhu)", "Úvod", "Zápletka", "Osnova"], e: "Věta říká, že se vše vyřešilo — to je závěr, který uzavírá příběh. Úvod nebo zápletka by nás ještě neuváděly ke šťastnému konci." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Vypravování = příběh. 3 části: úvod (kde/kdy/kdo), zápletka (co se stalo), závěr (jak to skončilo).", "Slůvka pořadí: nejdříve, potom, nakonec..."],
    explanation: e,
  }));
}

export const VYPRAVOVANIOSNOVA: TopicMetadata[] = [
  {
    id: "g3-cjl-vypravovani-osnova",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-podle-obrazkove-i-slovni-osnovy",
    title: "Vypravování podle obrázkové i slovní osnovy",
    studentTitle: "Píšu příběh",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat příběh s úvodem, zápletkOU a závěrem.",
    keywords: ["vypravování", "osnova", "úvod", "zápletka", "závěr", "příběh", "pořadí"],
    goals: ["Sestavit osnovu příběhu.", "Napsat vypravování se třemi částmi.", "Dodržet časovou posloupnost."],
    boundaries: ["Jednoduchý příběh se třemi částmi."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Příběh = úvod (kdo/kde/kdy) + zápletka (co se stalo) + závěr (jak to skončilo).",
      steps: ["Sestav osnovu: 3 body.", "Úvod: Kde, kdy, kdo?", "Střed: Co se přihodilo?", "Závěr: Jak to dopadlo?"],
      commonMistake: "Příběh bez závěru — vždy řekni, jak to skončilo.",
      example: "1. Úvod: Jednoho dne šel Tomáš do lesa. 2. Zápletka: Ztratil cestu domů. 3. Závěr: Našel ho správce lesa a odvedl domů.",
    },
  },
];
