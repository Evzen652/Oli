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
  { q: "Co je ilustrace ke knize?", a: "Obrázek, který zobrazuje nebo doplňuje text", opts: ["Obrázek, který zobrazuje nebo doplňuje text", "Titulní strana", "Obsah knihy", "Autor knihy"], e: "Ilustrace je obrázek, který patří k textu — ukazuje nám, co se v příběhu děje, nebo pomáhá lépe si ho představit. Titulní strana, obsah ani autor obrázkem nejsou." },
  { q: "Co by měla zobrazovat ilustrace k příběhu?", a: "Důležitou scénu nebo postavu z textu", opts: ["Důležitou scénu nebo postavu z textu", "Něco, co v textu není", "Jen krajinu", "Jen zvířata"], e: "Ilustrace musí být propojená s příběhem — kreslíme to, co se v textu skutečně stalo nebo kdo v něm je. Kdybychom kreslili něco, co v textu není, čtenáře by to zmátlo." },
  { q: "Jak vybrat, co nakreslit k textu?", a: "Vyberu nejzajímavější nebo nejdůležitější moment příběhu", opts: ["Vyberu nejzajímavější nebo nejdůležitější moment příběhu", "Nakreslím cokoliv", "Nakreslím jen postavy bez pozadí", "Nakreslím text slovo od slova"], e: "Dobrá ilustrace zachycuje klíčový okamžik příběhu — ten, který čtenáře zaujme nebo který je pro příběh nejdůležitější. Kreslit cokoliv nebo jen kopírovat slova nestačí." },
  { q: "Kdo tvoří ilustrace v knížkách pro děti?", a: "Ilustrátor / výtvarník", opts: ["Ilustrátor / výtvarník", "Spisovatel", "Tiskař", "Překladatel"], e: "Ilustrátor (výtvarník) je umělec, jehož prací je kreslit obrázky k textům. Spisovatel píše příběh, ale ne vždy umí kreslit — proto spolu spolupracují." },
  { q: "Co pomáhá ilustrace čtenáři?", a: "Lépe si představit příběh a postavy", opts: ["Lépe si představit příběh a postavy", "Přečíst text rychleji", "Naučit se pravopis", "Zjistit, kdo napsal knihu"], e: "Obrázky nám pomáhají vidět v hlavě, jak postavy vypadají a kde se příběh odehrává. Čtení rychleji nepomáhají a pravopis s autorem v ilustraci nejsou." },
  { q: "Jak by měla ilustrace souviset s textem?", a: "Zobrazovat to, co text popisuje — ne něco jiného", opts: ["Zobrazovat to, co text popisuje — ne něco jiného", "Může zobrazovat cokoliv", "Musí být abstraktní", "Nemusí vůbec souviset"], e: "Ilustrace a text tvoří pár — obrázek ukazuje to, co slova popisují. Kdyby obrázek zobrazoval něco úplně jiného, čtenář by byl zmaten a ilustrace by neplnila svůj účel." },
  { q: "Co je titulní ilustrace?", a: "Obrázek na obálce knihy, který láká ke čtení", opts: ["Obrázek na obálce knihy, který láká ke čtení", "Poslední obrázek v knize", "Obrázek autora", "Mapa příběhu"], e: "Titulní ilustrace je první obrázek, který vidíme — je na obálce a má nás nalákat, abychom si knihu vzali a začali číst. Je to jako výloha obchodu — musí zaujmout." },
  { q: "Proč mívají dětské knihy hodně obrázků?", a: "Obrázky pomáhají dětem lépe pochopit a prožít příběh", opts: ["Obrázky pomáhají dětem lépe pochopit a prožít příběh", "Aby byly knihy dražší", "Aby byly knihy tlustší", "Obrázky nahrazují text"], e: "Pro děti jsou obrázky důležitou pomůckou — pomáhají jim rozumět textu a vcítit se do příběhu. Obrázky text nedoplňují, ale nenahrazují — čtení je stále hlavní." },
  { q: "Co byste nakreslili jako ilustraci k větě 'Červená Karkulka šla lesem a zpívala'?", a: "Dívku s košíčkem v lese", opts: ["Dívku s košíčkem v lese", "Prázdný les", "Babičku doma", "Vlka samotného"], e: "Věta popisuje Červenou Karkulku (dívku s košíčkem), jak jde lesem — proto kreslíme přesně to. Babička ani vlk v té větě nejsou, a prázdný les by byl bez hlavní postavy." },
  { q: "Jak poznáme, zda je ilustrace vhodná k textu?", a: "Obrázek zobrazuje to, co text říká", opts: ["Obrázek zobrazuje to, co text říká", "Obrázek je barevný", "Obrázek je velký", "Obrázek se nám líbí"], e: "Správná ilustrace musí odpovídat obsahu textu — to je hlavní podmínka. Barva, velikost ani to, jestli se nám obrázek líbí, nezajistí, že ilustrace k textu skutečně patří." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Ilustrace = obrázek k textu. Zobrazuj to, co text popisuje.", "Vyber nejdůležitější moment příběhu."],
    explanation: e,
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
