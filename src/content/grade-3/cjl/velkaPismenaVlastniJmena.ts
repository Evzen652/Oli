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
  { q: "Jak správně napíšeme hlavní město ČR?", a: "Praha", opts: ["Praha", "praha", "PRAHA", "Praga"], e: "Praha je vlastní jméno — jméno konkrétního města. Vlastní jména se vždy píší s velkým písmenem na začátku." },
  { q: "Jak správně napíšeme českou řeku?", a: "Vltava", opts: ["Vltava", "vltava", "VLTAVA", "vltáva"], e: "Vltava je vlastní jméno řeky — jmenuje se tak jen jedna jediná řeka v ČR. Proto píšeme velké V." },
  { q: "Které slovo se píše s velkým písmenem?", a: "Jiří (jméno člověka)", opts: ["Jiří (jméno člověka)", "jiřina (květ)", "jiný", "jihovýchod"], e: "Jiří je jméno konkrétního člověka, proto velké J. Jiřina (květ) je obecné jméno — tak se jmenuje každá taková rostlina, proto malé j." },
  { q: "Jak napíšeme: 'bydlím v _____ (město Brno)?'", a: "Brně", opts: ["Brně", "brně", "BRNĚ", "brno"], e: "Brno je vlastní jméno města, takže i ve změněném tvaru (Brně) zůstává velké písmeno na začátku." },
  { q: "Které slovo se píše s malým písmenem?", a: "hora (obecně)", opts: ["hora (obecně)", "Krkonoše", "Vltava", "Karel"], e: "Slovo 'hora' obecně znamená každou horu na světě — není to jméno jedné konkrétní hory. Proto píšeme malé h. Krkonoše, Vltava a Karel jsou vlastní jména." },
  { q: "Jak napíšeme: 'Nejvyšší hora v Česku se jmenuje _____.'", a: "Sněžka", opts: ["Sněžka", "sněžka", "SNĚŽKA", "Snežka"], e: "Sněžka je jméno konkrétní hory — nejvyšší hory v Česku. Vlastní jméno hory píšeme s velkým písmenem." },
  { q: "Věta: 'Jana a tomáš jdou do školy.' Které slovo je napsáno ŠPATNĚ?", a: "tomáš", opts: ["tomáš", "Jana", "školy", "jdou"], e: "Tomáš je jméno konkrétního člověka, proto musí mít velké T. Jana je napsáno správně (velké J). Slovo 'školy' je obecné jméno — malé písmeno je správně." },
  { q: "Doplň název řeky: '_____ je česká řeka.' (řeka labe)", a: "Labe", opts: ["Labe", "labe", "LABE", "Labě"], e: "Labe je vlastní jméno řeky. Jmenuje se tak jen tato jedna konkrétní řeka, proto píšeme velké L." },
  { q: "Které slovo MUSÍ mít velké písmeno?", a: "Morava (řeka)", opts: ["Morava (řeka)", "modrý", "mokrý", "moudrý"], e: "Morava je vlastní jméno — jmenuje se tak konkrétní řeka (i kraj). Modrý, mokrý a moudrý jsou přídavná jména, která popisují vlastnosti — píšou se malým písmenem." },
  { q: "Jak napíšeme: 'Bydlím v ulici Na _____ (kopec)?'", a: "Kopci", opts: ["Kopci", "kopci", "KOPCI", "kOpci"], e: "Když je slovo součástí názvu ulice, píše se s velkým písmenem. 'Na Kopci' je jméno konkrétní ulice, proto velké K." },
  { q: "Které z těchto slov se píše s MALÝM písmenem?", a: "pes (obecné jméno)", opts: ["pes (obecné jméno)", "Azor (jméno psa)", "Nora (jméno)", "Praha"], e: "Pes je obecné jméno — tak říkáme každému psovi na světě. Azor je ale jméno konkrétního psa, proto velké A — stejně jako jména lidí." },
  { q: "Jak napíšeme název měsíce ve větě '28. _____ máme svátek'?", a: "října", opts: ["října", "Října", "ŘÍJNA", "říJna"], e: "Názvy měsíců se v češtině píší malým písmenem — říjen, listopad, prosinec... Velké písmeno by bylo chyba." },
  { q: "Jak správně: 'Učitelka se jmenuje ___ Nováková.'", a: "paní Nováková", opts: ["paní Nováková", "Paní Nováková", "paní nováková", "PANÍ NOVÁKOVÁ"], e: "Slovo 'paní' je obecné oslovení — píše se malým písmenem (pokud není na začátku věty). Nováková je příjmení konkrétního člověka — to má velké písmeno." },
  { q: "Název pohoří Šumava píšeme:", a: "Šumava", opts: ["Šumava", "šumava", "ŠUMAVA", "šUMAVA"], e: "Šumava je vlastní jméno konkrétního pohoří. Protože jde o pojmenování jednoho určitého místa, píšeme velké Š." },
  { q: "Jak napíšeme název státu, který sousedí s Českem na západě?", a: "Německo", opts: ["Německo", "německo", "NĚMECKO", "Nemecko"], e: "Německo je vlastní jméno státu. Jména států se píší s velkým písmenem, protože pojmenovávají konkrétní zemi." },
  { q: "Jméno 'martin' v dopise — jak ho opravíme?", a: "Martin", opts: ["Martin", "martin", "MARTIN", "maRtin"], e: "Martin je jméno konkrétního člověka — vlastní jméno. Vlastní jména se vždy píší s velkým písmenem na začátku, takže správně je Martin." },
  { q: "Které z těchto píšeme s velkým písmenem?", a: "Západ (část světa jako název oblasti)", opts: ["Západ (část světa jako název oblasti)", "západ slunce", "západiště", "zapádat"], e: "Když 'Západ' znamená konkrétní světovou oblast (např. Západ Evropy jako politický pojem), píše se velkým písmenem. 'Západ slunce' je obecný děj — malé z." },
  { q: "Jak napíšeme: 'Bydlíme v ___ (obec Třebíč).'", a: "Třebíči", opts: ["Třebíči", "třebíči", "TŘEBÍČI", "tŘEBÍČI"], e: "Třebíč je vlastní jméno obce. I když tvar změníme (Třebíči), velké písmeno na začátku zůstává — platí pro celé slovo." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 10) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Vlastní jméno = jméno konkrétní osoby, místa, řeky, hory → velké písmeno.", "Obecné jméno = každý pes, každá hora → malé písmeno."],
    explanation: e,
  }));
}

export const VELKAPISMENA: TopicMetadata[] = [
  {
    id: "g3-cjl-velka-pismena",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-velka-pismena-ve-vlastnich-jmenech-osoby-mesta-reky-hory",
    title: "Velká písmena ve vlastních jménech (osoby, města, řeky, hory)",
    studentTitle: "Velká písmena",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Naučíš se psát velká písmena u jmen lidí, měst, řek a hor.",
    keywords: ["velké písmeno", "vlastní jméno", "osoby", "města", "řeky", "hory", "Praha", "Vltava"],
    goals: ["Rozlišit vlastní a obecné jméno.", "Psát správně velké písmeno u jmen osob, měst, řek a hor.", "Opravit chybně napsaná vlastní jména."],
    boundaries: ["Jména osob, měst, řek, hor, států.", "Bez názvů institucí a svátků."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Vlastní jméno = jméno KONKRÉTNÍ osoby nebo místa → velké písmeno. Obecné = každý/každá → malé.",
      steps: ["Ptám se: je to jméno konkrétní osoby nebo místa?", "Ano (Karel, Praha, Vltava, Krkonoše) → Velké.", "Ne (pes, hora, řeka obecně) → Malé."],
      commonMistake: "'pes' × 'Azor' — pes je obecné (malé), Azor je jméno konkrétního psa (velké).",
      example: "Vltava (konkrétní řeka) → velké V. / řeka (obecně) → malé ř.",
    },
  },
];
