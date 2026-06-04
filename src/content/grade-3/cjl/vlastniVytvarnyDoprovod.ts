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
  { q: "Co je ilustrace ke knize?", a: "Obrázek, který zobrazuje nebo doplňuje text", opts: ["Obrázek, který zobrazuje nebo doplňuje text", "Titulní strana", "Obsah knihy", "Autor knihy"] },
  { q: "Co by měla zobrazovat ilustrace k příběhu?", a: "Důležitou scénu nebo postavu z textu", opts: ["Důležitou scénu nebo postavu z textu", "Něco, co v textu není", "Jen krajinu", "Jen zvířata"] },
  { q: "Jak vybrat, co nakreslit k textu?", a: "Vyberu nejzajímavější nebo nejdůležitější moment příběhu", opts: ["Vyberu nejzajímavější nebo nejdůležitější moment příběhu", "Nakreslím cokoliv", "Nakreslím jen postavy bez pozadí", "Nakreslím text slovo od slova"] },
  { q: "Kdo tvoří ilustrace v knížkách pro děti?", a: "Ilustrátor / výtvarník", opts: ["Ilustrátor / výtvarník", "Spisovatel", "Tiskař", "Překladatel"] },
  { q: "Co pomáhá ilustrace čtenáři?", a: "Lépe si představit příběh a postavy", opts: ["Lépe si představit příběh a postavy", "Přečíst text rychleji", "Naučit se pravopis", "Zjistit, kdo napsal knihu"] },
  { q: "Jak by měla ilustrace souviset s textem?", a: "Zobrazovat to, co text popisuje — ne něco jiného", opts: ["Zobrazovat to, co text popisuje — ne něco jiného", "Může zobrazovat cokoliv", "Musí být abstraktní", "Nemusí vůbec souviset"] },
  { q: "Co je titulní ilustrace?", a: "Obrázek na obálce knihy, který láká ke čtení", opts: ["Obrázek na obálce knihy, který láká ke čtení", "Poslední obrázek v knize", "Obrázek autora", "Mapa příběhu"] },
  { q: "Proč mívají dětské knihy hodně obrázků?", a: "Obrázky pomáhají dětem lépe pochopit a prožít příběh", opts: ["Obrázky pomáhají dětem lépe pochopit a prožít příběh", "Aby byly knihy dražší", "Aby byly knihy tlustší", "Obrázky nahrazují text"] },
  { q: "Co byste nakreslili jako ilustraci k větě 'Červená Karkulka šla lesem a zpívala'?", a: "Dívku s košíčkem v lese", opts: ["Dívku s košíčkem v lese", "Prázdný les", "Babičku doma", "Vlka samotného"] },
  { q: "Jak poznáme, zda je ilustrace vhodná k textu?", a: "Obrázek zobrazuje to, co text říká", opts: ["Obrázek zobrazuje to, co text říká", "Obrázek je barevný", "Obrázek je velký", "Obrázek se nám líbí"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Ilustrace = obrázek k textu. Zobrazuj to, co text popisuje.", "Vyber nejdůležitější moment příběhu."],
    solutionSteps: [`Odpověď: ${a}`],
  }));
}

export const VLASTNIVYTVARNY: TopicMetadata[] = [
  {
    id: "g3-cjl-vlastni-vytvarny-doprovod",
    rvpNodeId: "g3-cjl-literarni-vychova-prace-s-textem-vlastni-vytvarny-doprovod-k-textu",
    title: "Vlastní výtvarný doprovod k textu",
    studentTitle: "Kreslím k příběhu",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se vytvořit ilustraci, která odpovídá obsahu textu.",
    keywords: ["ilustrace", "obrázek k textu", "výtvarný doprovod", "ilustrátor", "scéna z příběhu"],
    goals: ["Vybrat vhodnou scénu pro ilustraci.", "Nakreslit ilustraci odpovídající textu.", "Pochopit vztah textu a obrázku."],
    boundaries: ["Základní ilustrace k literárnímu textu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Ilustrace = obrázek k textu. Nakresli to, co text popisuje — nejdůležitější scénu.",
      steps: ["Přečti text.", "Vyber nejzajímavější moment.", "Nakresli ho — postavy, prostředí, děj.", "Zkontroluj: souhlasí obrázek s textem?"],
      commonMistake: "Kreslení něčeho, co v textu není — ilustrace musí odpovídat příběhu.",
      example: "Text: 'Kotě lezlo na strom.' → Ilustrace: kotě na stromě (ne kotě u misky s jídlem).",
    },
  },
];
