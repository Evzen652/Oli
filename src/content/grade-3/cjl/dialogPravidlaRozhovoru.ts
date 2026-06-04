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
  { q: "Co je dialog?", a: "Rozhovor mezi dvěma nebo více lidmi", opts: ["Rozhovor mezi dvěma nebo více lidmi", "Dopis příteli", "Monolog jedné osoby", "Vědecký text"] },
  { q: "Jak zapisujeme přímou řeč?", a: "Do uvozovek (dolni+horni) + uvozovaci veta", opts: ["Do uvozovek (dolni+horni) + uvozovaci veta", "Bez uvozovek, proste do textu", "Do zavorek", "Kurzivou bez uvozovek"] },
  { q: "Pravidlo slušného rozhovoru č. 1:", a: "Neskáčeme druhému do řeči — počkáme, než domluví", opts: ["Neskáčeme druhému do řeči — počkáme, než domluví", "Mluvíme co nejrychleji", "Opakujeme, co říká druhý", "Díváme se jinam"] },
  { q: "Jak oslovíme dospělého člověka, kterého neznáme?", a: "Pane/paní + příjmení, nebo jen Pane/paní", opts: ["Pane/paní + příjmení, nebo jen Pane/paní", "Hej ty", "Křestním jménem", "Nijak"] },
  { q: "Co říkáme, když vstoupíme do místnosti s lidmi?", a: "Dobrý den (pozdravíme)", opts: ["Dobrý den (pozdravíme)", "Nic neříkáme", "Ahoj všem (vždy)", "Promiňte, musím odejít"] },
  { q: "Jak zapíšeme dialog v textu?", a: "Každý mluvčí začíná na novém řádku s pomlčkou nebo uvozovkami", opts: ["Každý mluvčí začíná na novém řádku s pomlčkou nebo uvozovkami", "Vše dohromady bez odlišení", "Každý mluvčí jinak barevně", "Čísly (1:, 2:, 3:)"] },
  { q: "Co je přímá řeč?", a: "Doslova citovaná slova mluvčí osoby", opts: ["Doslova citovaná slova mluvčí osoby", "Popis děje", "Vypravování bez řeči", "Poznámka autora"] },
  { q: "Jak projevíme, že posloucháme druhého?", a: "Díváme se na něj, kýváme, reagujeme", opts: ["Díváme se na něj, kýváme, reagujeme", "Díváme se do telefonu", "Přerušujeme ho", "Odcházíme"] },
  { q: "Jak zahájíme telefonní rozhovor?", a: "Pozdravíme a představíme se", opts: ["Pozdravíme a představíme se", "Rovnou řekneme, co chceme", "Ticho — čekáme", "Řekneme jen 'Halo'"] },
  { q: "Veta: (uvozovka)Pojd si hrat!(uvozovka) rekla Anicka. — Kde jsou uvozovky?", a: "Kolem prime reci — kolem slov, ktera nekdo rika", opts: ["Kolem prime reci — kolem slov, ktera nekdo rika", "Kolem jmena Anicka", "Kolem slova rekla", "Nejsou potreba"] },
  { q: "Jak správně ukončíme rozhovor?", a: "Rozloučíme se (Na shledanou / Ahoj)", opts: ["Rozloučíme se (Na shledanou / Ahoj)", "Odejdeme bez slova", "Řekneme 'konec'", "Přestaneme mluvit"] },
  { q: "Co říkáme, když chceme vstoupit do skupinového rozhovoru?", a: "Prominete, smím se zeptat? / Přidám se...", opts: ["Prominete, smím se zeptat? / Přidám se...", "Hned začneme mluvit", "Nahlas zavoláme", "Nic — počkáme navěky"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Dialog = rozhovor. Přímou řeč píšeme do uvozovek.", "Pravidla: nasloucháme, neskáčeme do řeči, zdravíme, rozloučíme se."],
    solutionSteps: [`Odpověď: ${a}`],
  }));
}

export const DIALOGPRAVIDLA: TopicMetadata[] = [
  {
    id: "g3-cjl-dialog-pravidla",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dialog-pravidla-rozhovoru",
    title: "Dialog - pravidla rozhovoru",
    studentTitle: "Pravidla rozhovoru",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se pravidla slušného rozhovoru a jak zapsat přímou řeč.",
    keywords: ["dialog", "rozhovor", "přímá řeč", "uvozovky", "pravidla", "zdvořilost", "oslovení"],
    goals: ["Znát pravidla slušného rozhovoru.", "Zapsat přímou řeč s uvozovkami.", "Správně oslovit dospělého a pozdravit."],
    boundaries: ["Základní pravidla, bez dramatizace."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Dialog: neskaceme do reci, nasloucháme, zdravíme. Přímá řeč: uvozovky + slova + kdo řekl.",
      steps: ["Pozdrav.", "Neskáčeme do řeči.", "Přímou řeč dáme do uvozovek.", "Na závěr se rozloučíme."],
      commonMistake: "Zapomenutí uvozovek u přímé řeči.",
      example: "Ucitelka se zeptala: (uvozovka)Jak se jmenujes?(uvozovka) Tomas odpovedel: (uvozovka)Jmenuji se Tomas.(uvozovka)",
    },
  },
];
