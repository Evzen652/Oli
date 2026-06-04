import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEXTY: { text: string; otazky: { q: string; a: string; opts: string[] }[] }[] = [
  {
    text: "Máša má psa Boba. Bob je velký hnědý pes. Každý den ho Máša venčí v parku. Bob rád honí míč a plave v rybníku. Večer spí vedle Máši na koberci.",
    otazky: [
      { q: "Jak se jmenuje Mášin pes?", a: "Bob", opts: ["Bob", "Max", "Brok", "Rex"] },
      { q: "Kde Máša venčí psa?", a: "V parku", opts: ["V parku", "V lese", "Na zahradě", "U řeky"] },
      { q: "Co Bob rád dělá?", a: "Honí míč a plave", opts: ["Honí míč a plave", "Jen spí", "Hlídá dům", "Hraje si s kočkou"] },
    ],
  },
  {
    text: "V zimě přišla do zahrady liška. Byla červená s bílým ocasem. Hledala jídlo, protože měla hlad. Zahradník ji uviděl a dal jí kousek chleba. Liška vzala chléb a utekla do lesa.",
    otazky: [
      { q: "Co hledala liška v zahradě?", a: "Jídlo, protože měla hlad", opts: ["Jídlo, protože měla hlad", "Noru", "Kamaráda", "Vodu"] },
      { q: "Kdo dal lišce chleba?", a: "Zahradník", opts: ["Zahradník", "Dítě", "Farmář", "Pes"] },
      { q: "Jakou barvu měla liška?", a: "Červenou s bílým ocasem", opts: ["Červenou s bílým ocasem", "Hnědou", "Šedou", "Černobílou"] },
    ],
  },
  {
    text: "Petr a Jana jdou do školy každý den spolu. Škola je daleko, proto jezdí autobusem. V autobuse se Petr vždy učí slovíčka a Jana čte knížku. Na zastávce se rozloučí a každý jde do své třídy.",
    otazky: [
      { q: "Jak Petr a Jana jezdí do školy?", a: "Autobusem", opts: ["Autobusem", "Pěšky", "Autem", "Na kole"] },
      { q: "Co dělá Petr v autobuse?", a: "Učí se slovíčka", opts: ["Učí se slovíčka", "Čte knížku", "Spí", "Poslouchá hudbu"] },
      { q: "Proč jezdí autobusem?", a: "Protože škola je daleko", opts: ["Protože škola je daleko", "Protože prší", "Protože je zima", "Protože chtějí"] },
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  const texty = level <= 2 ? TEXTY.slice(0, 2) : TEXTY;
  for (let i = 0; i < 40; i++) {
    const t = texty[i % texty.length];
    const o = t.otazky[i % t.otazky.length];
    tasks.push({
      question: `Přečti si text:\n\n${t.text}\n\n${o.q}`,
      correctAnswer: o.a,
      options: shuffle([...o.opts]),
      hints: ["Přečti text pozorně a hledej odpověď přímo v textu.", "Pokud si nejsi jistý, přečti text znovu."],
      solutionSteps: ["Najdu odpověď v textu.", `Správná odpověď: ${o.a}`],
    });
  }
  return tasks;
}

export const PLYNULECTENI: TopicMetadata[] = [
  {
    id: "g3-cjl-plynule-cteni-porozumeni",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-delsich-textu",
    title: "Plynulé čtení s porozuměním delších textů",
    studentTitle: "Čtu s porozuměním",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Přečteš text a správně odpovíš na otázky o jeho obsahu.",
    keywords: ["čtení", "porozumění", "text", "otázky", "obsah", "odpovědi z textu"],
    goals: ["Přečíst text a porozumět mu.", "Najít odpovědi na otázky přímo v textu.", "Rozlišit důležité a méně důležité informace."],
    boundaries: ["Texty přiměřené 3. ročníku, max 5 vět."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přečti text 2×. Při hledání odpovědi se vrať k textu a hledej konkrétní informaci.",
      steps: ["Přečti celý text.", "Přečti otázku.", "Vrať se k textu a najdi odpověď.", "Vyber správnou možnost."],
      commonMistake: "Odpovídání z hlavy bez opření o text — vždy se vrať k textu.",
      example: "Text: 'Bob je hnědý pes.' Otázka: Jakou barvu má Bob? → Hledám v textu: 'hnědý'.",
    },
  },
];
