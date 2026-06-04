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
  { q: "Co kontrolujeme při sebekontrole písemného projevu?", a: "Pravopis, obsah, srozumitelnost a úpravu", opts: ["Pravopis, obsah, srozumitelnost a úpravu", "Jen délku textu", "Jen velká písmena", "Jen interpunkci"] },
  { q: "Kdy sebekontrolujeme svůj text?", a: "Po napsání — přečteme znovu a opravíme chyby", opts: ["Po napsání — přečteme znovu a opravíme chyby", "Před psaním", "Při psaní každého slova", "Nikdy"] },
  { q: "Co uděláš, když najdeš chybu ve svém textu?", a: "Opravím ji — přeškrtnu a napíšu správně", opts: ["Opravím ji — přeškrtnu a napíšu správně", "Nechám ji tak", "Smažu celou stránku", "Požádám kamaráda"] },
  { q: "Jak poznáme, že je text srozumitelný?", a: "Když ho čtenář pochopí bez dalšího vysvětlení", opts: ["Když ho čtenář pochopí bez dalšího vysvětlení", "Když je dlouhý", "Když má mnoho přídavných jmen", "Když je psán rychle"] },
  { q: "Co je korektura?", a: "Opravování chyb v textu", opts: ["Opravování chyb v textu", "Psaní nového textu", "Překládání textu", "Opisování textu"] },
  { q: "Na co se zaměřím při kontrole vlastního textu?", a: "Velká písmena, interpunkce, pravopis slov", opts: ["Velká písmena, interpunkce, pravopis slov", "Jen počet slov", "Jen délku vět", "Jen téma textu"] },
  { q: "Proč je důležité přečíst svůj text po napsání?", a: "Abychom odhalili a opravili chyby", opts: ["Abychom odhalili a opravili chyby", "Abychom ho naučili nazpaměť", "Abychom ho přepsali", "Není to důležité"] },
  { q: "Jaký postup je správný při psaní a kontrole textu?", a: "Napsat → přečíst → opravit → přepsat čistě", opts: ["Napsat → přečíst → opravit → přepsat čistě", "Přepsat → napsat → zkontrolovat", "Jen napsat, kontrola není potřeba", "Kontrolovat jen na konci roku"] },
  { q: "Co znamená 'číst text nahlas'?", a: "Pomáhá odhalit chyby, které přehlédneme při tichém čtení", opts: ["Pomáhá odhalit chyby, které přehlédneme při tichém čtení", "Je to zbytečné", "Jen pro malé děti", "Pomáhá jen s výslovností"] },
  { q: "Věta 'Jan šel do školi.' obsahuje chybu. Co je špatně?", a: "Pravopis: 'školi' → správně 'školy'", opts: ["Pravopis: 'školi' → správně 'školy'", "Velké písmeno u Jan", "Chybí čárka", "Nic špatného není"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Sebekontrola = znovu přečíst a opravit chyby.", "Kontroluj: pravopis, velká písmena, tečky, čárky, srozumitelnost."],
    solutionSteps: ["Přečtu text.", `Správná odpověď: ${a}`],
  }));
}

export const SEBEKONTROLAPROJEVU: TopicMetadata[] = [
  {
    id: "g3-cjl-sebekontrola-projevu",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-psani-sebekontrola-vlastniho-pisemneho-projevu",
    title: "Sebekontrola vlastního písemného projevu",
    studentTitle: "Kontroluji svůj text",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Psaní",
    briefDescription: "Naučíš se zkontrolovat a opravit svůj napsaný text.",
    keywords: ["sebekontrola", "korektura", "oprava chyb", "přečíst text", "pravopis kontrola"],
    goals: ["Přečíst vlastní text a hledat chyby.", "Opravit nalezené chyby.", "Zkontrolovat pravopis, velká písmena a interpunkci."],
    boundaries: ["Základní sebekontrola, bez pokročilé stylistiky."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Po napsání vždy přečti text znovu. Hledej: chybná písmena, velká/malá písmena, tečky a čárky.",
      steps: ["Dočti text do konce.", "Přečti ho znovu — tentokrát pomalu.", "Podtrhni slova, která vypadají špatně.", "Oprav chyby."],
      commonMistake: "Přeskočení sebekontroly — unáhlené odevzdání textu s chybami.",
      example: "Napsáno: 'šel do školi' → kontrola → opraveno: 'šel do školy'.",
    },
  },
];
