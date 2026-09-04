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
  { q: "Co je dramatizace textu?", a: "Zahrání příběhu jako scénky", opts: ["Zahrání příběhu jako scénky", "Nakreslení příběhu", "Přepsání textu", "Přeložení do jiného jazyka"], e: "Při dramatizaci si žáci rozdělí role postav a příběh zahrají — jako v divadle. Nestačí jen číst text, postavy musí opravdu mluvit a jednat." },
  { q: "Co je recitace?", a: "Hlasité přednesení básně nazpaměť", opts: ["Hlasité přednesení básně nazpaměť", "Čtení básně ze sešitu", "Psaní vlastní básně", "Zpívání básně s melodií"], e: "Recitovat znamená říkat báseň zpaměti, bez knížky — a přitom ji předříkávat nahlas s citem. Je to jiné než čtení, protože text musíš mít v hlavě." },
  { q: "Jak vytvoříme komiks z příběhu?", a: "Rozdělíme děj do okének", opts: ["Rozdělíme děj do okének", "Opíšeme celý text", "Nakreslíme jen postavy", "Napíšeme nový příběh"], e: "Komiks funguje jako seriál obrázků — každé okénko ukazuje jeden důležitý moment příběhu. Postavy v okénkách mohou mít i bubliny s tím, co říkají." },
  { q: "Co je ilustrace textu?", a: "Obrázek doplňující text", opts: ["Obrázek doplňující text", "Komentář k textu", "Opis textu", "Zkrácení textu"], e: "Ilustrace je obrázek, který kreslíme ke knížce nebo příběhu — ukazuje, jak vypadají postavy nebo místa z textu. Pomáhá čtenáři lépe si příběh představit." },
  { q: "Jak můžeme tvořivě pracovat s pohádkou?", a: "Změnit konec, zahrát ji nebo nakreslit", opts: ["Změnit konec, zahrát ji nebo nakreslit", "Jen si ji potichu přečíst", "Opsat ji celou do sešitu", "Přeložit ji do angličtiny"], e: "Tvořivá práce znamená, že pohádku nejen přečteme, ale něco s ní uděláme — třeba ji zahrajeme, nakreslíme, nebo vymyslíme úplně jiný konec." },
  { q: "Co je přednes básně?", a: "Říkání básně s citem a výrazem", opts: ["Říkání básně s citem a výrazem", "Tiché čtení básně pro sebe", "Psaní vlastní básně", "Překládání básně do jiného jazyka"], e: "Přednes básně není jen hlasité čtení — musíme ji říkat s výrazem, aby posluchači cítili, zda je báseň veselá, smutná nebo napínavá." },
  { q: "Jak se liší ilustrace a popis?", a: "Ilustrace = obrázek, popis = slova", opts: ["Ilustrace = obrázek, popis = slova", "Žádný rozdíl", "Ilustrace je vždy barevná", "Popis je kratší"], e: "Ilustrace ukazuje, jak něco vypadá — ale pomocí obrázku. Popis říká totéž pomocí slov. Jsou to dvě různé cesty, jak sdělit stejnou věc." },
  { q: "Co znamená 'pokračovat v příběhu'?", a: "Napsat, co se stalo dál", opts: ["Napsat, co se stalo dál", "Přepsat příběh od začátku", "Zkrátit příběh", "Přeložit příběh"], e: "Pokračování začíná tam, kde původní konec skončil — vymyslíme, co se s postavami stalo potom. Přepisování od začátku by byl celý nový příběh, ne pokračování." },
  { q: "Proč je dobré dramatizovat příběhy?", a: "Lépe pochopíme postavy a jejich pocity", opts: ["Lépe pochopíme postavy a jejich pocity", "Je to povinné", "Abychom se naučili text nazpaměť", "Dramatizace je snazší než čtení"], e: "Když si postavu zahrajeme sami, musíme přemýšlet, co ta postava cítí a proč se tak chová — to nám pomůže ji mnohem lépe pochopit." },
  { q: "Co je pantomima?", a: "Vyjádření pohybem bez slov", opts: ["Vyjádření pohybem bez slov", "Zpěv bez slov", "Hlasité čtení", "Kreslení příběhu"], e: "Při pantomimě nesmíš mluvit — příběh nebo pocit musíš ukázat jen pohybem těla a mimikou. Je to zajímavé cvičení, protože zjistíš, kolik toho tělo umí říct bez slov." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: [
      "Zeptej se, čím se ta činnost vyjadřuje — slovy, obrázkem, nebo tělem?",
      "Zkus si představit, co bys při té činnosti opravdu dělal: mluvil bys, kreslil, nebo se jen díval? Podle toho poznáš, která možnost sedí a které popisují úplně jinou činnost.",
    ],
    explanation: e,
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
      hint: "Tvořivá práce s textem: dramatizuj (zahraj), ilustruj (nakresli), recituj (přednes), vytvoř komiks.",
      steps: ["Přečti text.", "Vyber aktivitu: hraní, kreslení, recitace.", "Pracuj kreativně — klidně příběh trochu změň."],
      commonMistake: "Dramatizace ≠ doslovné čtení textu — postavy musí opravdu hrát a mluvit.",
      example: "Dramatizace Červené Karkulky: jeden žák hraje Karkulku, druhý Vlka, třetí vypravuje.",
    },
  },
];
