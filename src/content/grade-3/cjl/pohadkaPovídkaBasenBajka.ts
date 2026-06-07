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
  { q: "Co je pohádka?", a: "Příběh s nadpřirozenými bytostmi (víly, draci, čarodějnice)", opts: ["Příběh s nadpřirozenými bytostmi (víly, draci, čarodějnice)", "Příběh ze skutečného života", "Báseň s rýmy", "Příběh o zvířatech s ponaučením"], e: "Pohádka je příběh, kde se dějí věci, které v opravdovém životě nejdou — třeba víly kouzlí, draci chrlí oheň nebo se zrcadlo umí mluvit. To jsou nadpřirozené bytosti a jevy, a právě díky nim poznáme, že čteme pohádku." },
  { q: "Jak typicky začíná pohádka?", a: "Bylo nebylo... / Za sedmero horami...", opts: ["Bylo nebylo... / Za sedmero horami...", "Jednoho večera jsem šel domů...", "Dnes ráno...", "V přírodě žijí..."], e: "Pohádky začínají zvláštními frázemi jako 'Bylo nebylo' nebo 'Za sedmero horami', které nám hned říkají: tohle se nestalo ve skutečnosti, je to vymyšlený příběh z dávných časů. Ostatní začátky se hodí spíš pro povídky z reálného života." },
  { q: "Co je bajka?", a: "Krátký příběh se zvířaty, který má ponaučení", opts: ["Krátký příběh se zvířaty, který má ponaučení", "Pohádka s dračí", "Báseň bez rýmu", "Skutečný příběh ze života"], e: "Bajka má vždy dvě důležité věci najednou: zvířata, která se chovají jako lidé (mluví, hádají se, chytračí), a ponaučení — krátkou moudrou větu na konci, která říká, co si z příběhu vzít. Bez ponaučení by to nebyla bajka." },
  { q: "Kdo napsal bajky o zvířatech ve starověku?", a: "Ezop (řecký spisovatel)", opts: ["Ezop (řecký spisovatel)", "Erben", "Němcová", "Andersen"], e: "Ezop žil ve starém Řecku před více než 2 500 lety a napsal stovky bajek. Jeho příběhy jako 'Liška a vrána' nebo 'Zajíc a želva' se vyprávějí dodnes. Erben a Němcová jsou čeští spisovatelé, Andersen psal pohádky." },
  { q: "Co je povídka?", a: "Kratší příběh ze skutečného (nebo reálně možného) života", opts: ["Kratší příběh ze skutečného (nebo reálně možného) života", "Dlouhý román", "Báseň s rýmy", "Pohádka se šťastným koncem"], e: "Povídka vypráví o věcech, které by se mohly opravdu stát — třeba o dítěti, které se ztratí v lese, nebo o kamarádství dvou dětí. Nenajdeme v ní víly ani mluvící zvířata, a je kratší než román." },
  { q: "Co je báseň?", a: "Literární útvar psaný ve verších, s rýmem nebo rytmem", opts: ["Literární útvar psaný ve verších, s rýmem nebo rytmem", "Příběh s dějem", "Popis přírody v próze", "Bajka se zvířaty"], e: "Báseň poznáme snadno — je rozdělena na řádky zvané verše a slova na konci řádků se rýmují (třeba 'pes – les'). Má také rytmus, takže když ji čteme nahlas, zní jako hudba. Ostatní žánry jsou psané v normálních větách." },
  { q: "Jak poznáme bajku?", a: "Zvířata mluví a jednají jako lidé, text končí ponaučením", opts: ["Zvířata mluví a jednají jako lidé, text končí ponaučením", "Pohádkové bytosti jako draci", "Rýmy a strofy", "Jen popis přírody"], e: "V bajce se zvířata chovají jako lidé — liška je lstivá, lev je pyšný, zajíc je chvástavý. A vždy na konci najdeme ponaučení, třeba 'Pýcha předchází pád'. Tohle spojení — mluvící zvířata plus moudrost na konci — je typické jen pro bajku." },
  { q: "Jak se jmenuje pohádkový hrdina, který zachraňuje princeznu?", a: "Princ / Rytíř (typická pohádková postava)", opts: ["Princ / Rytíř (typická pohádková postava)", "Ježibaba", "Posel", "Rolník"], e: "V pohádkách se opakují stálé postavy — princ nebo rytíř bývá hrdina, který překonává překážky a zachraňuje princeznu. Ježibaba je naopak záporná postava, která hrdinovi překáží. Tohle jsou typické pohádkové vzory." },
  { q: "Pohádka od Boženy Němcové je:", a: "Zlatovláska nebo O dvanácti měsíčkách", opts: ["Zlatovláska nebo O dvanácti měsíčkách", "Malá mořská víla (Andersen)", "Popelka (Perrault)", "Červená Karkulka"], e: "Božena Němcová je slavná česká spisovatelka, která sebrala a napsala mnoho pohádek — třeba Zlatovlásku nebo O dvanácti měsíčkách. Malá mořská víla pochází od dánského spisovatele Andersena a Červená Karkulka od Charlese Perraulta z Francie." },
  { q: "Čím se liší pohádka od povídky?", a: "Pohádka má nadpřirozené bytosti, povídka je ze skutečného života", opts: ["Pohádka má nadpřirozené bytosti, povídka je ze skutečného života", "Pohádka je kratší", "Povídka má rýmy", "Žádný rozdíl"], e: "Největší rozdíl je v tom, jestli se příběh mohl opravdu stát. V pohádce jsou věci, které nejdou — kouzelné předměty, víly, draci. V povídce se děje jen to, co je reálně možné. Délka ani rýmy nejsou pro tento rozdíl důležité." },
  { q: "Ponaučení bajky bývá:", a: "Krátká moudrá věta na konci (Kdo jiné jámu kopá...)", opts: ["Krátká moudrá věta na konci (Kdo jiné jámu kopá...)", "Dlouhé moralizující vyprávění", "Jen nadpis", "Uprostřed textu"], e: "Ponaučení bajky je vždy krátká a výstižná věta, která uzavírá příběh a říká nám, co si z něj vzít — třeba 'Kdo jiné jámu kopá, sám do ní padá'. Stojí vždy na konci, aby vynikla jako závěr celého příběhu." },
  { q: "Jaký literární žánr je 'Červená Karkulka'?", a: "Pohádka", opts: ["Pohádka", "Bajka", "Povídka", "Báseň"], e: "Červená Karkulka je pohádka — setkáme se v ní s mluvícím vlkem, který předstírá, že je babička. Taková nadpřirozená situace (vlk mluví a chová se jako člověk v pohádkovém smyslu) a pohádkový příběh ji řadí mezi pohádky, ne bajky." },
  { q: "Jaký literární žánr je příběh 'Liška a vrána' (liška chválí vránu, vrána pustí sýr)?", a: "Bajka (zvířata + ponaučení)", opts: ["Bajka (zvířata + ponaučení)", "Pohádka", "Povídka", "Báseň"], e: "Liška a vrána je bajka — zvířata se chovají jako lidé (liška lstivě chválí, vrána je marnivá) a příběh končí ponaučením: nenech se chytit na lichotky. Tohle přesně odpovídá znakům bajky: mluvící zvířata s lidskými vlastnostmi plus moudrost na závěr." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 8) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Pohádka = nadpřirozené bytosti. Bajka = zvířata + ponaučení. Povídka = reálný život. Báseň = verše.", "Typický začátek pohádky: 'Bylo nebylo...'"],
    explanation: e,
  }));
}

export const POHADKAPOVIDKA: TopicMetadata[] = [
  {
    id: "g3-cjl-pohadka-povidka-basen-bajka",
    rvpNodeId: "g3-cjl-literarni-vychova-literarni-druhy-a-zanry-pohadka-povidka-basen-bajka",
    title: "Pohádka, povídka, báseň, bajka",
    studentTitle: "Žánry literatury",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární druhy a žánry",
    briefDescription: "Poznáš rozdíl mezi pohádkou, povídkou, básní a bajkou.",
    keywords: ["pohádka", "povídka", "báseň", "bajka", "literární žánry", "nadpřirozené bytosti", "ponaučení"],
    goals: ["Rozlišit pohádku, povídku, báseň a bajku.", "Uvést typické znaky každého žánru.", "Přiřadit konkrétní text ke správnému žánru."],
    boundaries: ["Základní žánry pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Pohádka: nadpřirozené bytosti. Bajka: zvířata + ponaučení. Povídka: reálný život. Báseň: verše a rýmy.",
      steps: ["Přečti ukázku.", "Jsou tam bytosti jako víly, draci? → pohádka.", "Mluví zvířata a text má ponaučení? → bajka.", "Je to psáno ve verších? → báseň.", "Jinak: povídka."],
      commonMistake: "Příběh se zvířaty ≠ vždy bajka — bajka musí mít ponaučení.",
      example: "Liška a vrána (liška pochválí vránu, aby dostala sýr) = bajka. Ponaučení: Nenech se chytit na lichotky.",
    },
  },
];
