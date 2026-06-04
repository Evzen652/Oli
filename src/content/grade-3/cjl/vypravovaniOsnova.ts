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
  { q: "Co je vypravování?", a: "Slohový útvar, který vypráví příběh s dějem", opts: ["Slohový útvar, který vypráví příběh s dějem", "Popis věcí a osob", "Výčet faktů", "Vědecký text"] },
  { q: "Jak se jmenují tři části vypravování?", a: "Úvod, zápletka (střed), závěr", opts: ["Úvod, zápletka (střed), závěr", "Začátek, konec, jméno", "Popis, děj, poznámka", "1. část, 2. část, 3. část"] },
  { q: "Co je osnova ve vypravování?", a: "Plán — body, co se bude dít v jakém pořadí", opts: ["Plán — body, co se bude dít v jakém pořadí", "Obrázek k příběhu", "Závěr příběhu", "Jméno autora"] },
  { q: "Co obsahuje úvod příběhu?", a: "Kde, kdy a kdo — uvedení čtenáře do příběhu", opts: ["Kde, kdy a kdo — uvedení čtenáře do příběhu", "Největší napětí", "Závěr a ponaučení", "Výčet postav"] },
  { q: "Co je zápletka (střed)?", a: "Hlavní příhoda — problém nebo dobrodružství", opts: ["Hlavní příhoda — problém nebo dobrodružství", "Klidný popis prostředí", "Pozdravy a rozloučení", "Úvodní věta"] },
  { q: "Co obsahuje závěr příběhu?", a: "Jak se vše vyřeší a skončí, případně ponaučení", opts: ["Jak se vše vyřeší a skončí, případně ponaučení", "Začátek nové zápletky", "Popis postav", "Datum napsání"] },
  { q: "Proč je v příběhu důležité pořadí (časová posloupnost)?", a: "Aby byl příběh srozumitelný a logický", opts: ["Aby byl příběh srozumitelný a logický", "Není důležité", "Aby byl delší", "Aby měl rýmy"] },
  { q: "Jaká slůvka pomáhají zachovat pořadí událostí?", a: "Nejdříve, potom, nakonec, pak, brzy", opts: ["Nejdříve, potom, nakonec, pak, brzy", "Velký, malý, červený", "Ale, nebo, protože", "Já, ty, on, ona"] },
  { q: "Co je obrázkový osnova?", a: "Série obrázků, které ukazují pořadí děje", opts: ["Série obrázků, které ukazují pořadí děje", "Nakreslená mapa", "Portrét hlavní postavy", "Ilustrace bez příběhu"] },
  { q: "Příběh začíná: 'Jednoho rána...' — Jaká část je to?", a: "Úvod (začátek příběhu)", opts: ["Úvod (začátek příběhu)", "Zápletka", "Závěr", "Ponaučení"] },
  { q: "Příběh pokračuje: 'Náhle se stalo, že...' — Jaká část?", a: "Zápletka (střed — problém nebo obrat)", opts: ["Zápletka (střed — problém nebo obrat)", "Úvod", "Závěr", "Osnova"] },
  { q: "Příběh končí: 'A tak se vše vyřešilo a všichni byli šťastní.' — Jaká část?", a: "Závěr (rozuzlení příběhu)", opts: ["Závěr (rozuzlení příběhu)", "Úvod", "Zápletka", "Osnova"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Vypravování = příběh. 3 části: úvod (kde/kdy/kdo), zápletka (co se stalo), závěr (jak to skončilo).", "Slůvka pořadí: nejdříve, potom, nakonec..."],
    solutionSteps: [`Odpověď: ${a}`],
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
