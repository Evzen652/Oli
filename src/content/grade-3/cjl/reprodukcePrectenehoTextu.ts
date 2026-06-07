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
  { q: "Co je reprodukce textu?", a: "Převyprávění obsahu vlastními slovy", opts: ["Převyprávění obsahu vlastními slovy", "Doslovné opisování textu", "Přeložení do jiného jazyka", "Zkrácení textu na polovinu"], e: "Reprodukce znamená, že si text přečteš, pochopíš ho a pak ho vysvětlíš svými vlastními slovy — jako když kamarádovi vyprávíš film, který jsi viděl. Opis nebo překlad jsou něco úplně jiného." },
  { q: "Jak začínáme reprodukci?", a: "Stručně řekneme, o čem text je (téma + postavy)", opts: ["Stručně řekneme, o čem text je (téma + postavy)", "Přečteme první větu doslova", "Začneme od konce", "Napíšeme datum"], e: "Na začátku reprodukce řekneme posluchači, co ho čeká — o čem text je a kdo v něm vystupuje. Díky tomu může snáz sledovat, co mu budeme vyprávět dál." },
  { q: "Co musíme zachovat při reprodukci?", a: "Hlavní myšlenku a pořadí událostí", opts: ["Hlavní myšlenku a pořadí událostí", "Doslova každé slovo", "Jen závěr", "Jen jména postav"], e: "Při reprodukci je nejdůležitější říct, o čem text byl, a zachovat pořadí toho, co se stalo — aby to dávalo smysl. Přesná slova si pamatovat nemusíme." },
  { q: "Co NEMUSÍME zachovat při reprodukci?", a: "Přesná slova a formulace originálu", opts: ["Přesná slova a formulace originálu", "Hlavní postavy", "Hlavní myšlenku", "Pořadí klíčových událostí"], e: "Reprodukce je o tom, že text pochopíš a vysvětlíš ho svými slovy. Proto nemusíš pamatovat přesné věty — důležité je zachytit obsah, postavy a děj." },
  { q: "Proč je reprodukce důležitá?", a: "Ukazuje, zda jsme textu opravdu porozuměli", opts: ["Ukazuje, zda jsme textu opravdu porozuměli", "Abychom si zapamatovali texty doslova", "Protože opisování je rychlé", "Učíme se tak pravopis"], e: "Když dokážeš text převyprávět vlastními slovy, znamená to, že jsi mu opravdu porozuměl. Kdyby ses ho jen naučil nazpaměť, nemuselo by to znamenat, že víš, o čem byl." },
  { q: "Jak zjistíme hlavní myšlenku textu?", a: "Ptáme se: O čem text je? Co je v něm nejdůležitější?", opts: ["Ptáme se: O čem text je? Co je v něm nejdůležitější?", "Přečteme první větu", "Spočítáme slova", "Podtrhneme každé podstatné jméno"], e: "Hlavní myšlenku najdeme tak, že si po přečtení položíme otázku: co bylo v textu to nejdůležitější? Samotná první věta ani počet slov nám to neřeknou." },
  { q: "Reprodukce příběhu by měla zachovat:", a: "Úvod, střed a závěr (pořadí děje)", opts: ["Úvod, střed a závěr (pořadí děje)", "Jen závěr", "Jen střed s napětím", "Jen jména"], e: "Každý příběh má začátek (úvod), část s dějem (střed) a konec (závěr). Když všechny tři části zachováš ve správném pořadí, bude reprodukce dávat smysl." },
  { q: "Text říká: 'Bylo jednou malé kotě, které se ztratilo v lese.' Jak začneme reprodukci?", a: "Příběh je o malém kotěti, které se ztratilo v lese.", opts: ["Příběh je o malém kotěti, které se ztratilo v lese.", "Bylo jednou...", "Kotě je malé a ztratilo se.", "Nevím, jak začít."], e: "Reprodukci začínáme tak, že vlastními slovy řekneme, o čem příběh je — tedy popíšeme hlavní postavu a situaci. Opisovat první větu doslova není reprodukce." },
  { q: "Jaký je rozdíl mezi reprodukcí a opisem?", a: "Reprodukce = vlastními slovy, opis = doslova stejně", opts: ["Reprodukce = vlastními slovy, opis = doslova stejně", "Žádný rozdíl", "Opis je kratší", "Reprodukce je doslova"], e: "Při opisu přepisuješ text přesně tak, jak je napsán. Při reprodukci ho vyprávíš svými vlastními slovy — to je mnohem důležitější dovednost, protože ukáže, zda jsi textu rozuměl." },
  { q: "Po přečtení textu si nejdříve odpovíme na otázky:", a: "Kdo? Co se stalo? Kde? Kdy? Jak to dopadlo?", opts: ["Kdo? Co se stalo? Kde? Kdy? Jak to dopadlo?", "Jak dlouhý je text?", "Kolik slov má text?", "Kdo napsal text?"], e: "Otázky Kdo? Co? Kde? Kdy? Jak to dopadlo? nám pomůžou zachytit všechny důležité části příběhu. Délka textu ani jméno autora nám k převyprávění nepomůžou." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Reprodukce = vlastními slovy převyprávět hlavní obsah textu.", "Zachovej: kdo, co se stalo, jak to dopadlo."],
    explanation: e,
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
