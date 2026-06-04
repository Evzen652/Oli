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
  { q: "Co je reprodukce textu?", a: "Převyprávění obsahu vlastními slovy", opts: ["Převyprávění obsahu vlastními slovy", "Doslovné opisování textu", "Přeložení do jiného jazyka", "Zkrácení textu na polovinu"] },
  { q: "Jak začínáme reprodukci?", a: "Stručně řekneme, o čem text je (téma + postavy)", opts: ["Stručně řekneme, o čem text je (téma + postavy)", "Přečteme první větu doslova", "Začneme od konce", "Napíšeme datum"] },
  { q: "Co musíme zachovat při reprodukci?", a: "Hlavní myšlenku a pořadí událostí", opts: ["Hlavní myšlenku a pořadí událostí", "Doslova každé slovo", "Jen závěr", "Jen jména postav"] },
  { q: "Co NEMUSÍME zachovat při reprodukci?", a: "Přesná slova a formulace originálu", opts: ["Přesná slova a formulace originálu", "Hlavní postavy", "Hlavní myšlenku", "Pořadí klíčových událostí"] },
  { q: "Proč je reprodukce důležitá?", a: "Ukazuje, zda jsme textu opravdu porozuměli", opts: ["Ukazuje, zda jsme textu opravdu porozuměli", "Abychom si zapamatovali texty doslova", "Protože opisování je rychlé", "Učíme se tak pravopis"] },
  { q: "Jak zjistíme hlavní myšlenku textu?", a: "Ptáme se: O čem text je? Co je v něm nejdůležitější?", opts: ["Ptáme se: O čem text je? Co je v něm nejdůležitější?", "Přečteme první větu", "Spočítáme slova", "Podtrhneme každé podstatné jméno"] },
  { q: "Reprodukce příběhu by měla zachovat:", a: "Úvod, střed a závěr (pořadí děje)", opts: ["Úvod, střed a závěr (pořadí děje)", "Jen závěr", "Jen střed s napětím", "Jen jména"] },
  { q: "Text říká: 'Bylo jednou malé kotě, které se ztratilo v lese.' Jak začneme reprodukci?", a: "Příběh je o malém kotěti, které se ztratilo v lese.", opts: ["Příběh je o malém kotěti, které se ztratilo v lese.", "Bylo jednou...", "Kotě je malé a ztratilo se.", "Nevím, jak začít."] },
  { q: "Jaký je rozdíl mezi reprodukcí a opisem?", a: "Reprodukce = vlastními slovy, opis = doslova stejně", opts: ["Reprodukce = vlastními slovy, opis = doslova stejně", "Žádný rozdíl", "Opis je kratší", "Reprodukce je doslova"] },
  { q: "Po přečtení textu si nejdříve odpovíme na otázky:", a: "Kdo? Co se stalo? Kde? Kdy? Jak to dopadlo?", opts: ["Kdo? Co se stalo? Kde? Kdy? Jak to dopadlo?", "Jak dlouhý je text?", "Kolik slov má text?", "Kdo napsal text?"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Reprodukce = vlastními slovy převyprávět hlavní obsah textu.", "Zachovej: kdo, co se stalo, jak to dopadlo."],
    solutionSteps: [`Odpověď: ${a}`],
  }));
}

export const REPRODUKCETEXTU: TopicMetadata[] = [
  {
    id: "g3-cjl-reprodukce-textu",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-reprodukce-precteneho-textu",
    title: "Reprodukce přečteného textu",
    studentTitle: "Převyprávím příběh",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Naučíš se převyprávět přečtený příběh vlastními slovy.",
    keywords: ["reprodukce", "převyprávění", "vlastními slovy", "hlavní myšlenka", "pořadí"],
    goals: ["Porozumět textu a převyprávět ho.", "Zachovat hlavní myšlenku a pořadí událostí.", "Odlišit reprodukci od doslovného opisu."],
    boundaries: ["Krátké texty přiměřené 3. ročníku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Reprodukce = vlastními slovy. Zachovej: kdo, co se stalo, jak to dopadlo. Nemusíš opakovat každé slovo.",
      steps: ["Přečti text.", "Zeptej se: Kdo? Co? Kde? Jak to dopadlo?", "Vlastními slovy povyprávěj hlavní body.", "Dodržuj pořadí."],
      commonMistake: "Opisování doslova — reprodukce = VLASTNÍMI slovy, ne kopírování.",
      example: "Text o kočičce → Reprodukce: 'V příběhu je kotě, které se ztratilo v lese. Hledalo cestu domů a nakonec ho našla jeho maminka.'",
    },
  },
];
