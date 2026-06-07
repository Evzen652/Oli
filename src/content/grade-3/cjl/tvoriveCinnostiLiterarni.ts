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
  { q: "Co je dramatizace textu?", a: "Hraní příběhu jako divadelní scénku (postavy mluví a jednají)", opts: ["Hraní příběhu jako divadelní scénku (postavy mluví a jednají)", "Nakreslení příběhu", "Přepsání textu", "Přeložení do jiného jazyka"], e: "Při dramatizaci si žáci rozdělí role postav a příběh zahrají — jako v divadle. Nestačí jen číst text, postavy musí opravdu mluvit a jednat." },
  { q: "Co je recitace?", a: "Hlasité přednesení básně nazpaměť", opts: ["Hlasité přednesení básně nazpaměť", "Čtení ze sešitu", "Psaní básně", "Zpívání básně"], e: "Recitovat znamená říkat báseň zpaměti, bez knížky — a přitom ji předříkávat nahlas s citem. Je to jiné než čtení, protože text musíš mít v hlavě." },
  { q: "Jak vytvoříme komiks z příběhu?", a: "Rozdělíme příběh na scény a každou nakreslíme do okénka", opts: ["Rozdělíme příběh na scény a každou nakreslíme do okénka", "Opíšeme celý text", "Nakreslíme jen postavy", "Napíšeme nový příběh"], e: "Komiks funguje jako seriál obrázků — každé okénko ukazuje jeden důležitý moment příběhu. Postavy v okénkách mohou mít i bubliny s tím, co říkají." },
  { q: "Co je ilustrace textu?", a: "Obrázek, který doplňuje nebo zobrazuje obsah textu", opts: ["Obrázek, který doplňuje nebo zobrazuje obsah textu", "Komentář k textu", "Opis textu", "Zkrácení textu"], e: "Ilustrace je obrázek, který kreslíme ke knížce nebo příběhu — ukazuje, jak vypadají postavy nebo místa z textu. Pomáhá čtenáři lépe si příběh představit." },
  { q: "Jak můžeme tvořivě pracovat s pohádkou?", a: "Změnit konec, přidat postavu, dramatizovat, nakreslit", opts: ["Změnit konec, přidat postavu, dramatizovat, nakreslit", "Jen přečíst", "Opsat do sešitu", "Přeložit do angličtiny"], e: "Tvořivá práce znamená, že pohádku nejen přečteme, ale něco s ní uděláme — třeba ji zahrajeme, nakreslíme, nebo vymyslíme úplně jiný konec." },
  { q: "Co je přednes básně?", a: "Hlasité čtení nebo recitace básně s citem a výrazem", opts: ["Hlasité čtení nebo recitace básně s citem a výrazem", "Tiché čtení básně", "Psaní básně", "Překládání básně"], e: "Přednes básně není jen hlasité čtení — musíme ji říkat s výrazem, aby posluchači cítili, zda je báseň veselá, smutná nebo napínavá." },
  { q: "Jak se liší ilustrace a popis?", a: "Ilustrace = obrázek, popis = slova", opts: ["Ilustrace = obrázek, popis = slova", "Žádný rozdíl", "Ilustrace je vždy barevná", "Popis je kratší"], e: "Ilustrace ukazuje, jak něco vypadá — ale pomocí obrázku. Popis říká totéž pomocí slov. Jsou to dvě různé cesty, jak sdělit stejnou věc." },
  { q: "Co znamená 'pokračovat v příběhu'?", a: "Napsat, co se stalo dál (po konci původního příběhu)", opts: ["Napsat, co se stalo dál (po konci původního příběhu)", "Přepsat příběh od začátku", "Zkrátit příběh", "Přeložit příběh"], e: "Pokračování příběhu začíná tam, kde původní konec skončil — vymyslíme, co se se postavami stalo dál. Přepisování od začátku by byl celý nový příběh, ne pokračování." },
  { q: "Proč je dobré dramatizovat příběhy?", a: "Lépe pochopíme postavy a jejich pocity", opts: ["Lépe pochopíme postavy a jejich pocity", "Je to povinné", "Abychom se naučili text nazpaměť", "Dramatizace je snazší než čtení"], e: "Když si postavu zahrajeme sami, musíme přemýšlet, co ta postava cítí a proč se tak chová — to nám pomůže ji mnohem lépe pochopit." },
  { q: "Co je pantomima?", a: "Vyjádření příběhu nebo pocitu pohybem těla bez slov", opts: ["Vyjádření příběhu nebo pocitu pohybem těla bez slov", "Zpěv bez slov", "Hlasité čtení", "Kreslení příběhu"], e: "Při pantomimě nesmíš mluvit — příběh nebo pocit musíš ukázat jen pohybem těla a mimikou. Je to zajímavé cvičení, protože zjistíš, kolik toho tělo umí říct bez slov." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Tvořivé činnosti: dramatizace, recitace, komiks, ilustrace, pokračování příběhu.", "Dramatizace = hrát jako divadlo. Ilustrace = nakreslit scénu."],
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
      hint: "Tvořivá práce s textem: dramatizuj (zahraj), ilustruj (nakresli), recituj (přednès), vytvoř komiks.",
      steps: ["Přečti text.", "Vyber aktivitu: hraní, kreslení, recitace.", "Pracuj kreativně — klidně příběh trochu změň."],
      commonMistake: "Dramatizace ≠ doslovné čtení textu — postavy musí opravdu hrát a mluvit.",
      example: "Dramatizace Červené Karkulky: jeden žák hraje Karkulku, druhý Vlka, třetí vypravuje.",
    },
  },
];
