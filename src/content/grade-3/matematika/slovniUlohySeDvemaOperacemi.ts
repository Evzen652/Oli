import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Uloha = { q: string; a: number; steps: string[]; e: string };

function makeUlohy(level: number): Uloha[] {
  const ulohy: Uloha[] = [];

  const templates = [
    () => {
      const a = Math.floor(Math.random() * (level === 1 ? 20 : 50)) + 5;
      const b = Math.floor(Math.random() * (level === 1 ? 10 : 30)) + 2;
      const c = Math.floor(Math.random() * (level === 1 ? 10 : 20)) + 1;
      const r = (a + b) - c;
      const jablkaA = plural(a, "jablko", "jablka", "jablek");
      const jablkaB = plural(b, "jablko", "jablka", "jablek");
      const jablkaR = plural(r, "jablko", "jablka", "jablek");
      return {
        q: `V košíku bylo ${a} ${jablkaA}. Přidali jsme ${b} ${jablkaB} a pak ${c} snědli. Kolik jablek je v košíku?`,
        a: r,
        steps: [`${a} + ${b} = ${a + b}`, `${a + b} − ${c} = ${r}`],
        e: `Nejdřív spočítáme, kolik jablek je po přidání: ${a} + ${b} = ${a + b}. Pak odečteme snědená: ${a + b} − ${c} = ${r}. V košíku je ${r} ${jablkaR}.`,
      };
    },
    () => {
      const pocet = Math.floor(Math.random() * (level === 1 ? 5 : 8)) + 2;
      const cena = Math.floor(Math.random() * (level === 1 ? 10 : 20)) + 5;
      const zaplaceno = pocet * cena + Math.floor(Math.random() * 20) + pocet * cena;
      const r = zaplaceno - pocet * cena;
      const knizky = plural(pocet, "knížku", "knížky", "knížek");
      return {
        q: `Koupili jsme ${pocet} ${knizky} po ${cena} Kč. Zaplatili jsme ${zaplaceno} Kč. Kolik Kč jsme dostali zpět?`,
        a: r,
        steps: [`${pocet} × ${cena} = ${pocet * cena} Kč`, `${zaplaceno} − ${pocet * cena} = ${r} Kč`],
        e: `Nejdřív spočítáme cenu všech knížek: ${pocet} × ${cena} = ${pocet * cena} Kč. Pak odečteme od zaplacené částky: ${zaplaceno} − ${pocet * cena} = ${r} Kč zpět.`,
      };
    },
    () => {
      const radyPocet = Math.floor(Math.random() * 4) + 2;
      const mistyPocet = Math.floor(Math.random() * 6) + 4;
      const obsazeno = Math.floor(Math.random() * (radyPocet * mistyPocet / 2)) + 1;
      const celkem = radyPocet * mistyPocet;
      const volnych = celkem - obsazeno;
      const mista = plural(mistyPocet, "místem", "místy", "místy");
      const mistVolnych = plural(volnych, "místo", "místa", "míst");
      return {
        q: `V kině je ${radyPocet} řady po ${mistyPocet} ${mista}. Obsazeno je ${obsazeno} míst. Kolik míst je volných?`,
        a: volnych,
        steps: [`${radyPocet} × ${mistyPocet} = ${celkem} míst celkem`, `${celkem} − ${obsazeno} = ${volnych} volných míst`],
        e: `Nejdřív zjistíme celkový počet míst: ${radyPocet} × ${mistyPocet} = ${celkem}. Od toho odečteme obsazená místa: ${celkem} − ${obsazeno} = ${volnych}. Volných je ${volnych} ${mistVolnych}.`,
      };
    },
    () => {
      const a = Math.floor(Math.random() * (level === 1 ? 30 : 60)) + 10;
      // b musí být menší než a, aby mezivýsledek a−b nebyl záporný (3. třída nepočítá se zápornými čísly)
      const b = Math.floor(Math.random() * Math.min(level === 1 ? 20 : 40, a - 1)) + 1;
      const c = Math.floor(Math.random() * (level === 1 ? 15 : 30)) + 3;
      const r = a - b + c;
      const autA = plural(a, "auto", "auta", "aut");
      const autR = plural(r, "auto", "auta", "aut");
      return {
        q: `Na parkovišti stálo ${a} ${autA}. Odjelo ${b} aut a přijelo ${c} nových. Kolik aut je teď na parkovišti?`,
        a: r,
        steps: [`${a} − ${b} = ${a - b}`, `${a - b} + ${c} = ${r}`],
        e: `Nejdřív odečteme auta, která odjela: ${a} − ${b} = ${a - b}. Pak přičteme nová: ${a - b} + ${c} = ${r}. Na parkovišti je teď ${r} ${autR}.`,
      };
    },
  ];

  for (let i = 0; i < 40; i++) {
    const t = templates[i % templates.length];
    ulohy.push(t());
  }
  return ulohy;
}

function gen(level: number): PracticeTask[] {
  return makeUlohy(level).map(u => ({
    question: u.q,
    correctAnswer: String(u.a),
    options: shuffle([String(u.a), String(u.a + 10), String(u.a - 5 > 0 ? u.a - 5 : u.a + 15), String(u.a + 5)].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)),
    hints: ["Každý krok = jedna početní operace.", "Rozděl úlohu na dva kroky: co se děje nejdřív a co potom — zapiš každý krok zvlášť."],
    explanation: u.e,
  }));
}

export const SLOVNIULOHYSEDVEMAOPERACEMI: TopicMetadata[] = [
  {
    id: "g3-mat-slovni-ulohy-dve-operace",
    rvpNodeId: "g3-matematika-nestandardni-aplikacni-ulohy-a-problemy-slovni-a-logicke-ulohy-slovni-ulohy-se-dvema-a-vice-pocetnimi-operacemi",
    title: "Slovní úlohy se dvěma a více početními operacemi",
    studentTitle: "Slovní úlohy",
    subject: "matematika",
    category: "Nestandardní aplikační úlohy a problémy",
    topic: "Slovní a logické úlohy",
    briefDescription: "Vyřešíš příběhové úlohy ve dvou krocích.",
    keywords: ["slovní úloha", "dva kroky", "sčítání", "odčítání", "násobení", "praktická matematika"],
    goals: [
      "Rozdělit slovní úlohu na dílčí kroky.",
      "Zapsat postup řešení (co počítám nejdřív, co potom).",
      "Ověřit výsledek v kontextu úlohy.",
    ],
    boundaries: ["Max 2–3 operace.", "Čísla do 1000."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Přečti úlohu dvakrát. Podtrhni čísla a klíčová slova (přidali, odebrali, koupili…). Řeš krok za krokem.",
      steps: [
        "Přečti celou úlohu.",
        "Najdi všechna čísla a co znamenají.",
        "Urči, co počítáš nejdřív (1. krok).",
        "Z výsledku 1. kroku spočítej 2. krok.",
        "Zkontroluj: dává výsledek smysl?",
      ],
      commonMistake: "Přeskočení prvního kroku a rovnou počítání jen jedné operace.",
      example: "Bylo 20 žáků. Přišlo 5 a pak 3 odešli. Krok 1: 20+5=25. Krok 2: 25−3=22.",
    },
  },
];
