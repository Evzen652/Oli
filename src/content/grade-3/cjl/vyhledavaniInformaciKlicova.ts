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
      { q: "Jaká jsou klíčová slova v textu o velrybách?", a: "velryba, savec, oceán, kril, 30 metrů", opts: ["velryba, savec, oceán, kril, 30 metrů", "voda, ryba, moře, jídlo, malý", "zvíře, velké, plout, žít, jíst", "savec, kočka, pes, oceán, velký"], e: "Klíčová slova jsou ta nejdůležitější — říkají, o kom text je (velryba, savec), kde žije (oceán), co jí (kril) a jak je velká (30 metrů). Slova jako 'jsou' nebo 'živí se' jsou jen pomocná a klíčová nejsou." },
      { q: "Čím se živí velryby?", a: "Drobnými krevetami zvanými kril", opts: ["Drobnými krevetami zvanými kril", "Rybami", "Mořskými řasami", "Medúzami"], e: "Text přímo říká, že velryby se živí drobnými krevetami zvanými kril — to je překvapivé, protože jsou tak obrovské, ale jedí tak malé živočichy." },
      { q: "Jak velká může být velryba?", a: "Až 30 metrů", opts: ["Až 30 metrů", "Až 10 metrů", "Až 100 metrů", "Až 5 metrů"], e: "V textu stojí přímo: 'Velryba může být až 30 metrů dlouhá.' To je jako tři školní autobusy za sebou!" },
    ],
  },
  {
    text: "Slunečnice je vysoká rostlina s velkým žlutým květem. Roste na slunci. Semena slunečnice se lisují na olej. Slunečnicový olej se používá v kuchyni při vaření.",
    otazky: [
      { q: "Jaká jsou klíčová slova v textu?", a: "slunečnice, květ, semena, olej, vaření", opts: ["slunečnice, květ, semena, olej, vaření", "louka, tráva, voda, stromy, zelenina", "barva, žlutá, velká, roste, kvete", "zahrada, plevel, květ, list, kůra"], e: "Klíčová slova jsou ta, která celý text vystihují — o čem je (slunečnice, květ), co se z ní vyrábí (semena, olej) a k čemu to slouží (vaření). Slova jako 'vysoká' nebo 'žlutý' jsou jen popis, ne hlavní téma." },
      { q: "K čemu se používá slunečnicový olej?", a: "V kuchyni při vaření", opts: ["V kuchyni při vaření", "Na svícení", "Jako lék", "Na mazání kola"], e: "Text říká přímo: 'Slunečnicový olej se používá v kuchyni při vaření.' Určitě jsi ho viděl nebo viděla doma — maminky ho přidávají do pánve při smažení." },
      { q: "Co se lisuje ze semen slunečnice?", a: "Olej", opts: ["Olej", "Mouka", "Cukr", "Med"], e: "V textu stojí: 'Semena slunečnice se lisují na olej.' Mouka se mele z obilí, cukr se vyrábí z cukrové řepy a med dělají včely — to vše je jiný zdroj." },
    ],
  },
];

const TEORIE: { q: string; a: string; opts: string[]; e: string }[] = [
  { q: "Co jsou klíčová slova v textu?", a: "Nejdůležitější slova, která vyjadřují hlavní téma", opts: ["Nejdůležitější slova, která vyjadřují hlavní téma", "Nejdelší slova v textu", "Slova, která neznáme", "První slova každé věty"], e: "Klíčová slova jsou ta nejdůležitější — říkají, o čem celý text je. Nejsou to nutně nejdelší slova ani slova, která neznáme." },
  { q: "Jak hledáme klíčová slova?", a: "Ptáme se: Co je v textu nejdůležitější?", opts: ["Ptáme se: Co je v textu nejdůležitější?", "Podtrhneme každé slovo", "Hledáme nejkratší slova", "Hledáme nejdéle ve slovníku"], e: "Správná otázka je: 'Co je v textu nejdůležitější?' Kdybys text musel popsat jedním slovem nebo dvěma, jaká by to byla? To jsou právě klíčová slova." },
  { q: "Proč jsou klíčová slova užitečná?", a: "Pomáhají rychle pochopit, o čem text je", opts: ["Pomáhají rychle pochopit, o čem text je", "Jsou to pravopisné chyby", "Používají se jen v básních", "Jsou to vždy přídavná jména"], e: "Klíčová slova fungují jako výtah — rychle ti řeknou, o čem text je, aniž bys musel číst každé slovo. Pomáhají ti pochopit text a zapamatovat si ho." },
  { q: "Kde v textu nejčastěji najdeme klíčová slova?", a: "V názvu, prvním a posledním odstavci", opts: ["V názvu, prvním a posledním odstavci", "Jen uprostřed textu", "Jen na konci", "Nikde konkrétně"], e: "Autoři obvykle uvádějí to nejdůležitější hned v názvu nebo na začátku a shrnou to na konci. Proto hledej klíčová slova nejdřív tam." },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Level 1: jen faktické otázky z prvního textu
  // Level 2: oba texty + klíčová slova
  // Level 3: vše
  const texty = level === 1 ? TEXTY.slice(0, 1)
    : level === 2 ? TEXTY.slice(0, 2)
    : TEXTY;
  const getOtazky = (t: typeof TEXTY[0]) =>
    level === 1 ? t.otazky.slice(1) : t.otazky; // level 1: přeskočit klíčová slova

  for (let i = 0; i < 20; i++) {
    const t = texty[i % texty.length];
    const otazky = getOtazky(t);
    const o = otazky[i % otazky.length];
    tasks.push({
      question: `Text:\n${t.text}\n\n${o.q}`,
      correctAnswer: o.a,
      options: shuffle([...o.opts]),
      hints: ["Hledej odpověď přímo v textu.", "Klíčová slova = nejdůležitější slova tématu."],
      explanation: o.e,
    });
  }
  shuffle(TEORIE).slice(0, 20).forEach(({ q, a, opts, e }) => {
    tasks.push({ question: q, correctAnswer: a, options: shuffle([...opts]), hints: ["Klíčová slova vyjadřují hlavní téma textu."], explanation: e });
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
