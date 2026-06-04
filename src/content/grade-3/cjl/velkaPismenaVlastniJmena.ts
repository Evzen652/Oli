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
  { q: "Jak správně napíšeme hlavní město ČR?", a: "Praha", opts: ["Praha", "praha", "PRAHA", "Praga"] },
  { q: "Jak správně napíšeme českou řeku?", a: "Vltava", opts: ["Vltava", "vltava", "VLTAVA", "vltáva"] },
  { q: "Které slovo se píše s velkým písmenem?", a: "Jiří (jméno člověka)", opts: ["Jiří (jméno člověka)", "jiřina (květ)", "jiný", "jihovýchod"] },
  { q: "Jak napíšeme: 'bydlím v _____ (město Brno)?'", a: "Brně", opts: ["Brně", "brně", "BRNĚ", "brno"] },
  { q: "Které slovo se píše s malým písmenem?", a: "hora (obecně)", opts: ["hora (obecně)", "Krkonoše", "Vltava", "Karel"] },
  { q: "Jak napíšeme horu Sněžka?", a: "Sněžka", opts: ["Sněžka", "sněžka", "SNĚŽKA", "Snežka"] },
  { q: "Věta: 'Jana a tomáš jdou do školy.' Co je špatně?", a: "tomáš — správně Tomáš (vlastní jméno)", opts: ["tomáš — správně Tomáš (vlastní jméno)", "Jana — správně jana", "školy — správně Školy", "Nic"] },
  { q: "Jak správně napíšeme: '___ Labe je česká řeka.'", a: "Labe", opts: ["Labe", "labe", "LABE", "Labě"] },
  { q: "Které slovo MUSÍ mít velké písmeno?", a: "Morava (řeka)", opts: ["Morava (řeka)", "modrý", "mokrý", "moudrý"] },
  { q: "Jak napíšeme: 'Bydlím v ulici Na _____ (kopec)?'", a: "Kopci (název ulice → velké)", opts: ["Kopci (název ulice → velké)", "kopci (malé)", "KOPCI", "kOpci"] },
  { q: "Které z těchto slov se píše s MALÝM písmenem?", a: "pes (obecné jméno)", opts: ["pes (obecné jméno)", "Azor (jméno psa)", "Nora (jméno)", "Praha"] },
  { q: "Jak napíšeme státní svátek '28. října'?", a: "Říjen (název měsíce malým: říjen)", opts: ["říjen (malé písmeno)", "Říjen", "ŘÍJEN", "říJen"] },
  { q: "Jak správně: 'Učitelka se jmenuje ___ Nováková.'", a: "paní (malé) Nováková (velké)", opts: ["paní Nováková", "Paní Nováková", "paní nováková", "PANÍ NOVÁKOVÁ"] },
  { q: "Název pohoří Šumava píšeme:", a: "Šumava (velké — vlastní jméno)", opts: ["Šumava (velké — vlastní jméno)", "šumava (malé)", "ŠUMAVA", "šUMAVA"] },
  { q: "Jak napíšeme: 'Navštívili jsme _____ (stát Německo).'", a: "Německo", opts: ["Německo", "německo", "NĚMECKO", "Nemecko"] },
  { q: "Jméno 'martin' v dopise — jak ho opravíme?", a: "Martin (vlastní jméno → velké)", opts: ["Martin (vlastní jméno → velké)", "martin (správně malé)", "MARTIN", "maRtin"] },
  { q: "Které z těchto píšeme s velkým písmenem?", a: "Západ (část světa jako název oblasti)", opts: ["Západ (část světa jako název oblasti)", "západ slunce", "západiště", "zapádat"] },
  { q: "Jak napíšeme: 'Bydlíme v ___ (obec Třebíč).'", a: "Třebíči", opts: ["Třebíči", "třebíči", "TŘEBÍČI", "tŘEBÍČI"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 10) : POOL;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Vlastní jméno = jméno konkrétní osoby, místa, řeky, hory → velké písmeno.", "Obecné jméno = každý pes, každá hora → malé písmeno."],
    solutionSteps: ["Je to vlastní jméno (konkrétní osoba, místo)?", a.includes("velké") ? "Ano → velké písmeno." : "Obecné → malé písmeno."],
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
