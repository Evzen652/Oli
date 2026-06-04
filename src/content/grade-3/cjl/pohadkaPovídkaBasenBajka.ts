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
  { q: "Co je pohádka?", a: "Příběh s nadpřirozenými bytostmi (víly, draci, čarodějnice)", opts: ["Příběh s nadpřirozenými bytostmi (víly, draci, čarodějnice)", "Příběh ze skutečného života", "Báseň s rýmy", "Příběh o zvířatech s ponaučením"] },
  { q: "Jak typicky začíná pohádka?", a: "Bylo nebylo... / Za sedmero horami...", opts: ["Bylo nebylo... / Za sedmero horami...", "Jednoho večera jsem šel domů...", "Dnes ráno...", "V přírodě žijí..."] },
  { q: "Co je bajka?", a: "Krátký příběh se zvířaty, který má ponaučení", opts: ["Krátký příběh se zvířaty, který má ponaučení", "Pohádka s dračí", "Báseň bez rýmu", "Skutečný příběh ze života"] },
  { q: "Kdo napsal bajky o zvířatech ve starověku?", a: "Ezop (řecký spisovatel)", opts: ["Ezop (řecký spisovatel)", "Erben", "Němcová", "Andersen"] },
  { q: "Co je povídka?", a: "Kratší příběh ze skutečného (nebo reálně možného) života", opts: ["Kratší příběh ze skutečného (nebo reálně možného) života", "Dlouhý román", "Báseň s rýmy", "Pohádka se šťastným koncem"] },
  { q: "Co je báseň?", a: "Literární útvar psaný ve verších, s rýmem nebo rytmem", opts: ["Literární útvar psaný ve verších, s rýmem nebo rytmem", "Příběh s dějem", "Popis přírody v próze", "Bajka se zvířaty"] },
  { q: "Jak poznáme bajku?", a: "Zvířata mluví a jednají jako lidé, text končí ponaučením", opts: ["Zvířata mluví a jednají jako lidé, text končí ponaučením", "Pohádkové bytosti jako draci", "Rýmy a strofy", "Jen popis přírody"] },
  { q: "Jak se jmenuje pohádkový hrdina, který zachraňuje princeznu?", a: "Princ / Rytíř (typická pohádková postava)", opts: ["Princ / Rytíř (typická pohádková postava)", "Ježibaba", "Posel", "Rolník"] },
  { q: "Pohádka od Boženy Němcové je:", a: "Zlatovláska nebo O dvanácti měsíčkách", opts: ["Zlatovláska nebo O dvanácti měsíčkách", "Malá mořská víla (Andersen)", "Popelka (Perrault)", "Červená Karkulka"] },
  { q: "Čím se liší pohádka od povídky?", a: "Pohádka má nadpřirozené bytosti, povídka je ze skutečného života", opts: ["Pohádka má nadpřirozené bytosti, povídka je ze skutečného života", "Pohádka je kratší", "Povídka má rýmy", "Žádný rozdíl"] },
  { q: "Ponaučení bajky bývá:", a: "Krátká moudrá věta na konci (Kdo jiné jámu kopá...)", opts: ["Krátká moudrá věta na konci (Kdo jiné jámu kopá...)", "Dlouhé moralizující vyprávění", "Jen nadpis", "Uprostřed textu"] },
  { q: "Jaký literární žánr je 'Červená Karkulka'?", a: "Pohádka", opts: ["Pohádka", "Bajka", "Povídka", "Báseň"] },
  { q: "Jaký literární žánr je příběh 'Liška a vrána' (liška chválí vránu, vrána pustí sýr)?", a: "Bajka (zvířata + ponaučení)", opts: ["Bajka (zvířata + ponaučení)", "Pohádka", "Povídka", "Báseň"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 8) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Pohádka = nadpřirozené bytosti. Bajka = zvířata + ponaučení. Povídka = reálný život. Báseň = verše.", "Typický začátek pohádky: 'Bylo nebylo...'"],
    solutionSteps: [`Odpověď: ${a}`],
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
