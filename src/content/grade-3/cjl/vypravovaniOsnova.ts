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
  { q: "Co je vypravování?", a: "Útvar, který vypráví příběh", opts: ["Útvar, který vypráví příběh", "Popis věcí a osob", "Výčet faktů", "Vědecký text"], e: "Ve vypravování něco vyprávíš — máš postavy, místo a děj, kde se něco stane. Popis nebo výčet faktů děj nemají, takže to vypravování není." },
  { q: "Jak se jmenují tři části vypravování?", a: "Úvod, zápletka, závěr", opts: ["Úvod, zápletka, závěr", "Začátek, konec, jméno", "Popis, děj, poznámka", "1. část, 2. část, 3. část"], e: "Každý příběh má tři části: v úvodu se dozvíš kdo, kde a kdy; v zápletce se něco přihodí; a závěr říká, jak to dopadlo. Bez jedné části by příběh nebyl celý." },
  { q: "Co je osnova ve vypravování?", a: "Plán děje v bodech", opts: ["Plán děje v bodech", "Obrázek k příběhu", "Závěr příběhu", "Jméno autora"], e: "Osnova je jako nákupní seznam — jenom místo věcí si do ní zapíšeš, co se bude dít a v jakém pořadí. Díky ní nezapomeneš nic důležitého." },
  { q: "Co obsahuje úvod příběhu?", a: "Kde, kdy a kdo", opts: ["Kde, kdy a kdo", "Největší napětí", "Závěr a ponaučení", "Výčet postav"], e: "Úvod uvede čtenáře do děje — dozví se, kde se to odehrává, kdy to bylo a kdo v tom vystupuje. Největší napětí ani rozuzlení do úvodu nepatří, to přijde později." },
  { q: "Co je zápletka (střed)?", a: "Problém nebo dobrodružství", opts: ["Problém nebo dobrodružství", "Klidný popis prostředí", "Pozdravy a rozloučení", "Úvodní věta"], e: "Zápletka je srdce příběhu — stane se něco zajímavého, nastane problém nebo dobrodružství. Kdyby se nic nestalo, nebylo by co vyprávět." },
  { q: "Co obsahuje závěr příběhu?", a: "Jak se vše vyřeší", opts: ["Jak se vše vyřeší", "Začátek nové zápletky", "Popis postav", "Datum napsání"], e: "Závěr uzavírá děj — čtenář se dozví, jak problém ze zápletky dopadl. Někdy se přidá i ponaučení, co se postavy naučily." },
  { q: "Proč je v příběhu důležité pořadí (časová posloupnost)?", a: "Aby byl příběh srozumitelný a logický", opts: ["Aby byl příběh srozumitelný a logický", "Aby byl příběh co nejdelší", "Aby měl příběh rýmy", "Na pořadí událostí nezáleží"], e: "Když bys vyprávěl nejdřív konec a teprve pak začátek, nikdo by nevěděl, o čem mluvíš. Správné pořadí událostí zajišťuje, že text dává smysl. S délkou ani rýmy to nesouvisí." },
  { q: "Jaká slůvka pomáhají zachovat pořadí událostí?", a: "Nejdříve, potom, nakonec, pak, brzy", opts: ["Nejdříve, potom, nakonec, pak, brzy", "Velký, malý, červený", "Ale, nebo, protože", "Já, ty, on, ona"], e: "Slůvka jako 'nejdříve', 'potom' nebo 'nakonec' říkají čtenáři, co se stalo dřív a co pak — jsou to ukazatele pořadí. Přídavná jména ani zájmena pořadí nevyjadřují." },
  { q: "Co je obrázková osnova?", a: "Obrázky seřazené podle děje", opts: ["Obrázky seřazené podle děje", "Nakreslená mapa", "Portrét hlavní postavy", "Ilustrace bez příběhu"], e: "Obrázkovou osnovu tvoří obrázky seřazené za sebou — každý ukazuje jednu část děje. Je to jako komiks, který ti pomůže si vzpomenout, co se dělo dřív a co potom." },
  { q: "Příběh začíná: 'Jednoho rána...' — Jaká část je to?", a: "Úvod", opts: ["Úvod", "Zápletka", "Závěr", "Ponaučení"], e: "Věta 'Jednoho rána...' nás teprve uvádí do děje — říká kdy. Zápletka nebo rozuzlení přicházejí až později, ne na samém začátku." },
  { q: "Příběh pokračuje: 'Náhle se stalo, že...' — Jaká část?", a: "Zápletka", opts: ["Zápletka", "Úvod", "Závěr", "Osnova"], e: "Slovo 'náhle' naznačuje, že se něco nečekaného přihodilo — to je typický střed příběhu. Úvod by nás teprve seznamoval s postavami a místem." },
  { q: "Příběh končí: 'A tak se vše vyřešilo a všichni byli šťastní.' — Jaká část?", a: "Závěr", opts: ["Závěr", "Úvod", "Zápletka", "Osnova"], e: "Věta říká, že se vše vyřešilo — to je rozuzlení, které uzavírá děj. Úvod ani zápletka by nás ke šťastnému konci ještě nedovedly." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: [
      "Zeptej se, jestli ta věta čtenáře teprve seznamuje, nebo už něco řeší.",
      "Zkus si vyprávění představit jako cestu: na začátku se rozhlédneš kolem sebe, uprostřed narazíš na překážku a na konci dojdeš do cíle. Do které z těch tří chvil ukázka patří?",
    ],
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
    briefDescription: "Naučíš se napsat příběh s úvodem, zápletkou a závěrem.",
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
