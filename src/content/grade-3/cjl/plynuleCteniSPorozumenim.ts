import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEXTY: { text: string; otazky: { q: string; a: string; opts: string[]; e: string }[] }[] = [
  {
    text: "Máša má psa Boba. Bob je velký hnědý pes. Každý den ho Máša venčí v parku. Bob rád honí míč a plave v rybníku. Večer spí vedle Máši na koberci.",
    otazky: [
      { q: "Jak se jmenuje Mášin pes?", a: "Bob", opts: ["Bob", "Max", "Brok", "Rex"], e: "V textu je napsáno 'Máša má psa Boba' — jméno psa je tedy Bob. Max, Brok ani Rex v textu nejsou zmíněni." },
      { q: "Kde Máša venčí psa?", a: "V parku", opts: ["V parku", "V lese", "Na zahradě", "U řeky"], e: "Text říká 'Každý den ho Máša venčí v parku' — odpověď je přímo v textu. Les, zahrada ani řeka v textu nejsou." },
      { q: "Co Bob rád dělá?", a: "Honí míč a plave", opts: ["Honí míč a plave", "Jen spí", "Hlídá dům", "Hraje si s kočkou"], e: "V textu stojí 'Bob rád honí míč a plave v rybníku' — obě činnosti jsou správně. Spí sice také, ale to dělá každý pes, text zdůrazňuje honičku a plavání." },
    ],
  },
  {
    text: "V zimě přišla do zahrady liška. Byla červená s bílým ocasem. Hledala jídlo, protože měla hlad. Zahradník ji uviděl a dal jí kousek chleba. Liška vzala chléb a utekla do lesa.",
    otazky: [
      { q: "Co hledala liška v zahradě?", a: "Jídlo, protože měla hlad", opts: ["Jídlo, protože měla hlad", "Noru", "Kamaráda", "Vodu"], e: "Text přímo říká 'Hledala jídlo, protože měla hlad' — důvod i odpověď jsou jasně napsané. Noru, kamaráda ani vodu liška nehledala." },
      { q: "Kdo dal lišce chleba?", a: "Zahradník", opts: ["Zahradník", "Dítě", "Farmář", "Pes"], e: "V textu je napsáno 'Zahradník ji uviděl a dal jí kousek chleba' — chléb dala lišce zahradník, ne dítě ani farmář." },
      { q: "Jakou barvu měla liška?", a: "Červenou s bílým ocasem", opts: ["Červenou s bílým ocasem", "Hnědou", "Šedou", "Černobílou"], e: "Text popisuje lišku jako 'červenou s bílým ocasem' — to jsou dvě barvy najednou. Hnědá, šedá ani černobílá v textu nejsou." },
    ],
  },
  {
    text: "Petr a Jana jdou do školy každý den spolu. Škola je daleko, proto jezdí autobusem. V autobuse se Petr vždy učí slovíčka a Jana čte knížku. Na zastávce se rozloučí a každý jde do své třídy.",
    otazky: [
      { q: "Jak Petr a Jana jezdí do školy?", a: "Autobusem", opts: ["Autobusem", "Pěšky", "Autem", "Na kole"], e: "Text říká 'proto jezdí autobusem' — slovo 'proto' ukazuje, že autobusem jezdí kvůli tomu, že škola je daleko. Auto, kolo ani chůze v textu nejsou zmíněny." },
      { q: "Co dělá Petr v autobuse?", a: "Učí se slovíčka", opts: ["Učí se slovíčka", "Čte knížku", "Spí", "Poslouchá hudbu"], e: "V textu stojí 'Petr vždy učí slovíčka' — Jana čte knížku, ale Petr se učí slovíčka. Je důležité si všimnout, kdo dělá co." },
      { q: "Proč jezdí autobusem?", a: "Protože škola je daleko", opts: ["Protože škola je daleko", "Protože prší", "Protože je zima", "Protože chtějí"], e: "Text jasně říká 'Škola je daleko, proto jezdí autobusem' — slovo 'proto' označuje příčinu. O dešti ani zimě text nic neříká." },
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  // Level 1: jen první text + přímé otázky (kdo/kde/co) — index 0,1
  // Level 2: první dva texty + "jak/proč" otázky (index 1,2)
  // Level 3: všechny texty + všechny otázky
  const texty = level === 1 ? TEXTY.slice(0, 1)
    : level === 2 ? TEXTY.slice(0, 2)
    : TEXTY;
  // Každý level má jiný "startovní" index otázky — zajišťuje různou 1. otázku
  const startIdx = level === 1 ? 0 : level === 2 ? 1 : 2;
  const getOtazky = (t: typeof TEXTY[0]) =>
    level === 1 ? t.otazky.slice(0, 2)
    : level === 2 ? [t.otazky[1 % t.otazky.length], t.otazky[0]]
    : t.otazky;

  for (let i = 0; i < 40; i++) {
    const t = texty[i % texty.length];
    const otazky = getOtazky(t);
    // První task pro level 1 začíná od indexu 0, pro level 2 od 1, pro level 3 od 2
    const o = otazky[(i + startIdx) % otazky.length];
    tasks.push({
      question: `Přečti si text:\n\n${t.text}\n\n${o.q}`,
      correctAnswer: o.a,
      options: shuffle([...o.opts]),
      hints: ["Přečti text pozorně a hledej odpověď přímo v textu.", "Pokud si nejsi jistý, přečti text znovu."],
      explanation: o.e,
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
