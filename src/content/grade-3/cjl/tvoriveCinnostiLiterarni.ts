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
  { q: "Co je dramatizace textu?", a: "Hraní příběhu jako divadelní scénku (postavy mluví a jednají)", opts: ["Hraní příběhu jako divadelní scénku (postavy mluví a jednají)", "Nakreslení příběhu", "Přepsání textu", "Přeložení do jiného jazyka"] },
  { q: "Co je recitace?", a: "Hlasité přednesení básně nazpaměť", opts: ["Hlasité přednesení básně nazpaměť", "Čtení ze sešitu", "Psaní básně", "Zpívání básně"] },
  { q: "Jak vytvoříme komiks z příběhu?", a: "Rozdělíme příběh na scény a každou nakreslíme do okénka", opts: ["Rozdělíme příběh na scény a každou nakreslíme do okénka", "Opíšeme celý text", "Nakreslíme jen postavy", "Napíšeme nový příběh"] },
  { q: "Co je ilustrace textu?", a: "Obrázek, který doplňuje nebo zobrazuje obsah textu", opts: ["Obrázek, který doplňuje nebo zobrazuje obsah textu", "Komentář k textu", "Opis textu", "Zkrácení textu"] },
  { q: "Jak můžeme tvořivě pracovat s pohádkou?", a: "Změnit konec, přidat postavu, dramatizovat, nakreslit", opts: ["Změnit konec, přidat postavu, dramatizovat, nakreslit", "Jen přečíst", "Opsat do sešitu", "Přeložit do angličtiny"] },
  { q: "Co je přednes básně?", a: "Hlasité čtení nebo recitace básně s citem a výrazem", opts: ["Hlasité čtení nebo recitace básně s citem a výrazem", "Tiché čtení básně", "Psaní básně", "Překládání básně"] },
  { q: "Jak se liší ilustrace a popis?", a: "Ilustrace = obrázek, popis = slova", opts: ["Ilustrace = obrázek, popis = slova", "Žádný rozdíl", "Ilustrace je vždy barevná", "Popis je kratší"] },
  { q: "Co znamená 'pokračovat v příběhu'?", a: "Napsat, co se stalo dál (po konci původního příběhu)", opts: ["Napsat, co se stalo dál (po konci původního příběhu)", "Přepsat příběh od začátku", "Zkrátit příběh", "Přeložit příběh"] },
  { q: "Proč je dobré dramatizovat příběhy?", a: "Lépe pochopíme postavy a jejich pocity", opts: ["Lépe pochopíme postavy a jejich pocity", "Je to povinné", "Abychom se naučili text nazpaměť", "Dramatizace je snazší než čtení"] },
  { q: "Co je pantomima?", a: "Vyjádření příběhu nebo pocitu pohybem těla bez slov", opts: ["Vyjádření příběhu nebo pocitu pohybem těla bez slov", "Zpěv bez slov", "Hlasité čtení", "Kreslení příběhu"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Tvořivé činnosti: dramatizace, recitace, komiks, ilustrace, pokračování příběhu.", "Dramatizace = hrát jako divadlo. Ilustrace = nakreslit scénu."],
    solutionSteps: [`Odpověď: ${a}`],
  }));
}

export const TVORIVECINN: TopicMetadata[] = [
  {
    id: "g3-cjl-tvorive-cinnosti",
    rvpNodeId: "g3-cjl-literarni-vychova-prace-s-textem-tvorive-cinnosti-s-literarnim-textem",
    title: "Tvořivé činnosti s literárním textem",
    studentTitle: "Hrajem s příběhem",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se dramatizovat, ilustrovat a tvořivě pracovat s textem.",
    keywords: ["dramatizace", "recitace", "ilustrace", "komiks", "pokračování příběhu", "pantomima"],
    goals: ["Dramatizovat krátký příběh.", "Vytvořit ilustraci k textu.", "Pokračovat v příběhu nebo změnit jeho konec."],
    boundaries: ["Základní tvořivé aktivity pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Tvořivá práce s textem: dramatizuj (zahraj), ilustruj (nakresli), recituj (přednès), vytvoř komiks.",
      steps: ["Přečti text.", "Vyber aktivitu: hraní, kreslení, recitace.", "Pracuj kreativně — klidně příběh trochu změň."],
      commonMistake: "Dramatizace ≠ doslovné čtení textu — postavy musí opravdu hrát a mluvit.",
      example: "Dramatizace Červené Karkulky: jeden žák hraje Karkulku, druhý Vlka, třetí vypravuje.",
    },
  },
];
