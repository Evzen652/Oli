import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEXTY = [
  {
    text: "Velryby jsou největší savci na světě. Žijí v oceánech. Přestože jsou obrovské, živí se drobnými krevetami zvanými kril. Velryba může být až 30 metrů dlouhá.",
    otazky: [
      { q: "Jaká jsou klíčová slova v textu o velrybách?", a: "velryba, savec, oceán, kril, 30 metrů", opts: ["velryba, savec, oceán, kril, 30 metrů", "voda, ryba, moře, jídlo, malý", "zvíře, velké, plout, žít, jíst", "savec, kočka, pes, oceán, velký"] },
      { q: "Čím se živí velryby?", a: "Drobnými krevetami zvanými kril", opts: ["Drobnými krevetami zvanými kril", "Rybami", "Mořskými řasami", "Medúzami"] },
      { q: "Jak velká může být velryba?", a: "Až 30 metrů", opts: ["Až 30 metrů", "Až 10 metrů", "Až 100 metrů", "Až 5 metrů"] },
    ],
  },
  {
    text: "Slunečnice je vysoká rostlina s velkým žlutým květem. Roste na slunci. Semena slunečnice se lisují na olej. Slunečnicový olej se používá v kuchyni při vaření.",
    otazky: [
      { q: "Jaká jsou klíčová slova v textu?", a: "slunečnice, květ, semena, olej, vaření", opts: ["slunečnice, květ, semena, olej, vaření", "louka, tráva, voda, stromy, zelenina", "barva, žlutá, velká, roste, kvete", "zahrada, plevel, květ, list, kůra"] },
      { q: "K čemu se používá slunečnicový olej?", a: "V kuchyni při vaření", opts: ["V kuchyni při vaření", "Na svícení", "Jako lék", "Na mazání kola"] },
      { q: "Co se lisuje ze semen slunečnice?", a: "Olej", opts: ["Olej", "Mouka", "Cukr", "Med"] },
    ],
  },
];

const TEORIE: { q: string; a: string; opts: string[] }[] = [
  { q: "Co jsou klíčová slova v textu?", a: "Nejdůležitější slova, která vyjadřují hlavní téma", opts: ["Nejdůležitější slova, která vyjadřují hlavní téma", "Nejdelší slova v textu", "Slova, která neznáme", "První slova každé věty"] },
  { q: "Jak hledáme klíčová slova?", a: "Ptáme se: Co je v textu nejdůležitější?", opts: ["Ptáme se: Co je v textu nejdůležitější?", "Podtrhneme každé slovo", "Hledáme nejkratší slova", "Hledáme nejdéle ve slovníku"] },
  { q: "Proč jsou klíčová slova užitečná?", a: "Pomáhají rychle pochopit, o čem text je", opts: ["Pomáhají rychle pochopit, o čem text je", "Jsou to pravopisné chyby", "Používají se jen v básních", "Jsou to vždy přídavná jména"] },
  { q: "Kde v textu nejčastěji najdeme klíčová slova?", a: "V názvu, prvním a posledním odstavci", opts: ["V názvu, prvním a posledním odstavci", "Jen uprostřed textu", "Jen na konci", "Nikde konkrétně"] },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const texty = level <= 2 ? TEXTY.slice(0, 1) : TEXTY;
  for (let i = 0; i < 20; i++) {
    const t = texty[i % texty.length];
    const o = t.otazky[i % t.otazky.length];
    tasks.push({
      question: `Text:\n${t.text}\n\n${o.q}`,
      correctAnswer: o.a,
      options: shuffle([...o.opts]),
      hints: ["Hledej odpověď přímo v textu.", "Klíčová slova = nejdůležitější slova tématu."],
      solutionSteps: ["Přečtu text a otázku.", `Odpověď: ${o.a}`],
    });
  }
  shuffle(TEORIE).slice(0, 20).forEach(({ q, a, opts }) => {
    tasks.push({ question: q, correctAnswer: a, options: shuffle([...opts]), hints: ["Klíčová slova vyjadřují hlavní téma textu."], solutionSteps: [`Odpověď: ${a}`] });
  });
  return tasks.slice(0, 40);
}

export const VYHLEDAVANIINFO: TopicMetadata[] = [
  {
    id: "g3-cjl-vyhledavani-informaci",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-informaci-v-textu-klicova-slova",
    title: "Vyhledávání informací v textu, klíčová slova",
    studentTitle: "Hledám info v textu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Naučíš se najít klíčové informace a klíčová slova v textu.",
    keywords: ["klíčová slova", "vyhledávání informací", "hlavní myšlenka", "text", "porozumění"],
    goals: ["Najít klíčová slova v textu.", "Vyhledat konkrétní informaci z textu.", "Rozlišit důležité a méně důležité informace."],
    boundaries: ["Krátké texty přiměřené 3. ročníku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová slova = to nejdůležitější. Hledej: kdo/co je v textu hlavní? O čem celý text je?",
      steps: ["Přečti celý text.", "Zeptej se: O čem to celé je?", "Podtrhni slova, která se opakují nebo jsou nejdůležitější.", "To jsou klíčová slova."],
      commonMistake: "Vybírání dlouhých slov místo klíčových — délka slova neznamená důležitost.",
      example: "Text o velrybách: klíčová slova = velryba, savec, oceán (ne: 'jsou', 'živí se', 'obrovské').",
    },
  },
];
