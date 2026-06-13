import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PoolItem {
  question: string;
  correct: string;
  distractors: string[];
  emoji: string;
  hint: string;
  solution: string;
}

const POOL: PoolItem[] = [
  { question: "Jak se jmenují pojmenované cesty v obci?", correct: "Ulice", distractors: ["Mraky", "Hvězdy"], emoji: "🗺️", hint: "V adrese bydliště píšeme název cesty, na které stojí dům — Hlavní _____, Školní _____.", solution: "Cesty v obci se jmenují ulice — každá má své jméno a vede ke konkrétním domům." },
  { question: "Jakou hromadnou dopravou jezdíme do školy?", correct: "Autobus", distractors: ["Loď", "Letadlo"], emoji: "🚌", hint: "Hromadná doprava přepravuje mnoho lidí najednou — jaký dopravní prostředek jezdí na pravidelných linkách?", solution: "Do školy jezdíme autobusem — je to hromadná doprava, která jezdí po zastávkách." },
  { question: "Co svítí na přechodu pro chodce?", correct: "Semafor", distractors: ["Lampa", "Svíčka"], emoji: "🚦", hint: "Na přechodu pro chodce jsou světla, která říkají, kdy přejít — jak se jim říká?", solution: "Na přechodu svítí semafor — červená znamená stůj, zelená znamená jdi." },
  { question: "Po čem chodíme u silnice?", correct: "Chodník", distractors: ["Tráva", "Voda"], emoji: "🚶", hint: "Auta jezdí po silnici a chodci chodí odděleně po...", solution: "U silnice chodíme po chodníku — je pro chodce a odděluje je od silnice." },
  { question: "Kde bezpečně přejdeme silnici?", correct: "Přechod", distractors: ["Strom", "Plot"], emoji: "🚸", hint: "Silnici bezpečně přejdeme na označeném místě — jak se jmenuje?", solution: "Silnici přejdeme na přechodu — tam mají chodci přednost." },
  { question: "Po čem jezdí auta?", correct: "Silnice", distractors: ["Chodník", "Tráva"], emoji: "🛣️", hint: "Auta nepojezdí po chodníku — po čem tedy jezdí?", solution: "Auta jezdí po silnici — silnice je jen pro motorová vozidla." },
  { question: "Co ukazuje cestu nebo směr?", correct: "Cedule", distractors: ["Mrak", "Strom"], emoji: "🪧", hint: "Abychom věděli, kde jsme nebo kde co je, slouží nám...", solution: "Cestu nám ukazuje cedule (dopravní značka) — ukazuje směr nebo upozorňuje." },
  { question: "Co je postaveno nad řekou, aby se dalo přejít?", correct: "Most", distractors: ["Plot", "Lavička"], emoji: "🌉", hint: "Přes řeku se dá přejít nebo přejet — přes co se přejde?", solution: "Nad řekou je most — po mostě přecházíme nebo přejíždíme na druhý břeh." },
  { question: "Kde si sedneme v parku k odpočinku?", correct: "Lavička", distractors: ["Semafor", "Cedule"], emoji: "🪑", hint: "V parku jsou dřevěné nebo kovové sedačky — jak se jmenují?", solution: "V parku si sedneme na lavičku — jsou tam k odpočinku pro návštěvníky." },
  { question: "Co roste v parku a poskytuje stín?", correct: "Stromy", distractors: ["Auta", "Semafory"], emoji: "🌳", hint: "Park je místo s zelení, kde rostou vysoké dřeviny.", solution: "V parku rostou stromy — poskytují stín a zkrášlují park." },
  { question: "Jaká hromadná doprava jezdí po kolejích ve městě?", correct: "Tramvaj", distractors: ["Loď", "Letadlo"], emoji: "🚊", hint: "Ve větším městě jezdí hromadná doprava po kolejích — jak se jmenuje?", solution: "Ve městě jezdí tramvaj — jezdí po kolejích v ulicích." },
  { question: "Kde čekáme na autobus?", correct: "Zastávka", distractors: ["Most", "Park"], emoji: "🚏", hint: "Autobus nezastavuje kdekoliv — čekáme na konkrétním místě, které se jmenuje...", solution: "Na autobus čekáme na zastávce — označené místo, kde autobus zastavuje." },
  { question: "Co ohraničuje zahradu u domu?", correct: "Plot", distractors: ["Řeka", "Mrak"], emoji: "🏡", hint: "Domy mají ohraničenou zahradu nebo pozemek — co ho ohraničuje?", solution: "Zahradu ohraničuje plot — odděluje ji od ulice a sousedů." },
  { question: "Kde parkují auta?", correct: "Parkoviště", distractors: ["Řeka", "Park"], emoji: "🅿️", hint: "Auta potřebují místo k zaparkování — jak se tomu místu říká?", solution: "Auta parkují na parkovišti — je to plocha vyhrazená pro zaparkovaná vozidla." },
  { question: "Co teče přirozeně obcí?", correct: "Řeka", distractors: ["Silnice", "Plot"], emoji: "🏞️", hint: "V obci může téct přirozený vodní tok — jak se jmenuje?", solution: "Obcí teče řeka — je to přirozený vodní tok, který protéká krajinou." },
  { question: "Kde si hrají děti venku?", correct: "Hřiště", distractors: ["Silnice", "Most"], emoji: "🛝", hint: "Děti si hrají venku na místě s prolézačkami — kde to je?", solution: "Děti si hrají na hřišti — je tam pískoviště, houpačky a prolézačky." },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 15).map(item => {
    const options = shuffle([item.correct, ...item.distractors]);
    return {
      question: item.question,
      correctAnswer: item.correct,
      options,
      emoji: item.emoji,
      hints: [item.hint],
      solutionSteps: [item.solution],
    };
  });
}

export const PLANOBCEOKOLISKOLY: TopicMetadata[] = [
  {
    id: "g2-prv-plan-obce",
    rvpNodeId: "g2-prvouka-misto-kde-zijeme-obec-a-okoli-plan-obce-okoli-skoly",
    title: "Plán obce a okolí školy",
    studentTitle: "Plán obce",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Obec a okolí",
    briefDescription: "Poznáš, co je na plánu obce.",
    keywords: ["plán", "obec", "ulice", "silnice", "autobus", "semafor"],
    goals: [
      "Poznat, co je na plánu obce.",
      "Vědět, jak se dostat do školy.",
      "Znát dopravní prvky v obci.",
    ],
    boundaries: ["Pouze základní orientace.", "Bez čtení mapy."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Na plánu obce jsou ulice, silnice a domy.",
      steps: ["Přečti otázku.", "Co venku v obci vidíš?"],
      commonMistake: "Záměna chodníku (pro lidi) a silnice (pro auta).",
      example: "Po silnici jezdí auta, po chodníku chodí lidé.",
    },
  },
];
