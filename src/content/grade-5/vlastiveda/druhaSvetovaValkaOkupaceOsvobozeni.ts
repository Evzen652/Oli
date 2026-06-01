import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší sekvence (4 události)
const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď chronologicky: vznik Protektorátu, začátek 2. světové války, konec války, osvobození Prahy.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu Čechy a Morava (15. 3. 1939)",
      "Začátek 2. světové války (1. 9. 1939)",
      "Osvobození Prahy Sovětskou armádou (9. 5. 1945)",
      "Konec 2. světové války v Evropě (8. 5. 1945)",
    ],
    hints: ["Protektorát vznikl ještě před začátkem světové války."],
  },
  {
    question: "Seřaď od nejdřívějšího: atentát na Heydricha, vznik Protektorátu, vypálení Lidic, konec války.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec 2. světové války (8. 5. 1945)",
    ],
    hints: ["Protektorát byl nejdříve, pak atentát a Lidice."],
  },
  {
    question: "Seřaď: obsazení ČSR, konec války, vznik Protektorátu, německá kapitulace.",
    correctAnswer: "order",
    items: [
      "Obsazení českých zemí Hitlerem (15. 3. 1939)",
      "Začátek 2. světové války (1. 9. 1939)",
      "Odsun sudetských Němců začíná (1945–1946)",
      "Německá kapitulace (8. 5. 1945)",
    ],
    hints: ["Odsun Němců probíhal po konci války."],
  },
  {
    question: "Seřaď: atentát na Heydricha, Terezín jako ghetto, vznik Protektorátu, konec války.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "Terezín slouží jako ghetto pro Židy (od 1941)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Konec 2. světové války (8. 5. 1945)",
    ],
    hints: ["Terezín jako ghetto fungoval od roku 1941."],
  },
  {
    question: "Seřaď čtyři klíčové události 2. světové války v českém kontextu.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu Čechy a Morava (1939)",
      "Operace Anthropoid — atentát (1942)",
      "Konec války — Den vítězství (8. 5. 1945)",
      "Odsun sudetských Němců (1945–1946)",
    ],
    hints: ["Odsun Němců byl až po konci války."],
  },
  {
    question: "Seřaď: Německo napadlo Polsko, vznik Protektorátu, kapitulace Německa, osvobozeni Plzně.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "Německo napadlo Polsko (1. 9. 1939)",
      "Osvobození Plzně Američany (6. 5. 1945)",
      "Kapitulace Německa (8. 5. 1945)",
    ],
    hints: ["Protektorát vznikl před začátkem světové války."],
  },
  {
    question: "Seřaď chronologicky: Gabčík a Kubiš přiletěli do Prahy, vznik Protektorátu, konec války, Heydrich umírá.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "Gabčík a Kubiš vysazeni do Prahy (28. 12. 1941)",
      "Heydrich umírá po atentátu (4. 6. 1942)",
      "Konec 2. světové války (8. 5. 1945)",
    ],
    hints: ["Parašutisté přiletěli v prosinci 1941."],
  },
  {
    question: "Seřaď: Mnichovská dohoda, vznik Protektorátu, atentát na Heydricha, konec války.",
    correctAnswer: "order",
    items: [
      "Mnichovská dohoda — Sudety Německu (září 1938)",
      "Vznik Protektorátu (15. 3. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Konec 2. světové války (8. 5. 1945)",
    ],
    hints: ["Mnichovská dohoda byla v září 1938."],
  },
  {
    question: "Seřaď: Terezínské ghetto, první deportace Židů, vznik Protektorátu, holocaust v Osvětimi.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "První deportace Židů do Terezína (1941)",
      "Masové deportace do Osvětimi z Terezína (1942–1944)",
      "Osvobození táborů (1945)",
    ],
    hints: ["Deportace začaly v roce 1941."],
  },
  {
    question: "Seřaď čtyři klíčové okamžiky pro Židy v Protektorátu.",
    correctAnswer: "order",
    items: [
      "Zavedení protižidovských zákonů v Protektorátu (1939–1940)",
      "Povinnost nosit žlutou hvězdu (1941)",
      "Deportace do Terezína (od 1941)",
      "Osvobození přeživších (1945)",
    ],
    hints: ["Omezení přišla postupně."],
  },
];

// Level 2 – středně těžké sekvence (5 událostí)
const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď chronologicky 5 klíčových událostí 2. světové války v českých zemích.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu Čechy a Morava (15. 3. 1939)",
      "Začátek 2. světové války (1. 9. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec 2. světové války v Evropě (8. 5. 1945)",
    ],
    hints: ["Protektorát byl před začátkem světové války."],
  },
  {
    question: "Seřaď: Lidice, Gabčík a Kubiš přiletěli, atentát, vznik Protektorátu, konec války.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "Gabčík a Kubiš vysazeni do Prahy (28. 12. 1941)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec války (8. 5. 1945)",
    ],
    hints: ["Parašutisté přiletěli v prosinci 1941."],
  },
  {
    question: "Seřaď 5 milníků holocaustu v Čechách.",
    correctAnswer: "order",
    items: [
      "Protižidovské zákony v Protektorátu (1939)",
      "Povinnost nosit žlutou hvězdu (1941)",
      "Terezínské ghetto funguje naplno (1942)",
      "Deportace do Osvětimi (1942–1944)",
      "Osvobození přeživších Židů (1945)",
    ],
    hints: ["Omezení přicházela postupně."],
  },
  {
    question: "Seřaď chronologicky: Mnichovská dohoda, vznik Protektorátu, atentát, vypálení Lidic, konec války.",
    correctAnswer: "order",
    items: [
      "Mnichovská dohoda (září 1938)",
      "Vznik Protektorátu (15. 3. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec 2. světové války (8. 5. 1945)",
    ],
    hints: ["Mnichovská dohoda byla v září 1938."],
  },
  {
    question: "Seřaď 5 klíčových událostí od konce Protektorátu po Postupim.",
    correctAnswer: "order",
    items: [
      "Pražské povstání (5. 5. 1945)",
      "Osvobození Plzně Američany (6. 5. 1945)",
      "Kapitulace Německa (8. 5. 1945)",
      "Osvobození Prahy Sovětskou armádou (9. 5. 1945)",
      "Postupimská konference — odsun Němců rozhodnut (1945)",
    ],
    hints: ["Pražské povstání začalo 5. 5. 1945."],
  },
  {
    question: "Seřaď: deportace z Terezína, Mnichovská dohoda, vznik Protektorátu, konec války, osvobozeni.",
    correctAnswer: "order",
    items: [
      "Mnichovská dohoda (1938)",
      "Vznik Protektorátu (1939)",
      "Deportace Židů z Terezína do Osvětimi (1942–1944)",
      "Konec války (8. 5. 1945)",
      "Odsun sudetských Němců (1945–1946)",
    ],
    hints: ["Mnichovská dohoda byla v roce 1938."],
  },
  {
    question: "Seřaď: Operace Anthropoid, Heydrich jmenován protektorem, atentát, vypálení Lidic, konec války.",
    correctAnswer: "order",
    items: [
      "Heydrich jmenován zastupujícím protektorem (září 1941)",
      "Gabčík a Kubiš vysazeni — Operace Anthropoid (12. 1941)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec 2. světové války (8. 5. 1945)",
    ],
    hints: ["Heydrich byl jmenován v září 1941."],
  },
  {
    question: "Seřaď 5 klíčových dat 2. světové války z pohledu Čechů.",
    correctAnswer: "order",
    items: [
      "15. 3. 1939 — vznik Protektorátu",
      "27. 5. 1942 — atentát na Heydricha",
      "10. 6. 1942 — vypálení Lidic",
      "8. 5. 1945 — konec války (Den vítězství)",
      "1945–1946 — odsun sudetských Němců",
    ],
    hints: ["Pamatuj na rok 1939 a rok 1942."],
  },
  {
    question: "Seřaď chronologicky: odsun Němců, osvobozeni Prahy, konec války, atentát, vznik Protektorátu.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu Čechy a Morava (15. 3. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Konec 2. světové války v Evropě (8. 5. 1945)",
      "Osvobození Prahy Sovětskou armádou (9. 5. 1945)",
      "Odsun sudetských Němců (1945–1946)",
    ],
    hints: ["Odsun Němců byl až po osvobozeni."],
  },
  {
    question: "Seřaď 5 událostí týkajících se Terezína a holocaustu.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "Terezín otevřen jako ghetto (1941)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vrchol deportací z Terezína (1942–1944)",
      "Osvobozeni Terezína (1945)",
    ],
    hints: ["Terezínské ghetto fungovalo od roku 1941."],
  },
];

// Level 3 – pokročilé sekvence (5–6 událostí)
const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď 6 klíčových událostí 2. světové války v českém kontextu od nejdřívějšího.",
    correctAnswer: "order",
    items: [
      "Mnichovská dohoda (září 1938)",
      "Vznik Protektorátu Čechy a Morava (15. 3. 1939)",
      "Začátek 2. světové války (1. 9. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec 2. světové války v Evropě (8. 5. 1945)",
    ],
    hints: ["Mnichovská dohoda přišla ještě před vznikem Protektorátu."],
  },
  {
    question: "Seřaď 6 klíčových momentů: od Mnichovské dohody po odsun Němců.",
    correctAnswer: "order",
    items: [
      "Mnichovská dohoda — Sudety Německu (1938)",
      "Vznik Protektorátu (15. 3. 1939)",
      "Terezín jako ghetto (od 1941)",
      "Atentát na Heydricha (1942)",
      "Konec 2. světové války (8. 5. 1945)",
      "Odsun sudetských Němců (1945–1946)",
    ],
    hints: ["Mnichovská dohoda je absolutně první."],
  },
  {
    question: "Seřaď 6 milníků od Heydrichova jmenování po konec války.",
    correctAnswer: "order",
    items: [
      "Heydrich jmenován zastupujícím protektorem (září 1941)",
      "Gabčík a Kubiš vysazeni (28. 12. 1941)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Heydrich umírá (4. 6. 1942)",
      "Vypálení Lidic (10. 6. 1942)",
      "Konec 2. světové války (8. 5. 1945)",
    ],
    hints: ["Heydrich umřel 4. 6. 1942 — týden po atentátu."],
  },
  {
    question: "Seřaď 6 klíčových dat v chronologickém pořadí.",
    correctAnswer: "order",
    items: [
      "15. 3. 1939 — vznik Protektorátu",
      "1. 9. 1939 — začátek 2. světové války",
      "27. 5. 1942 — atentát na Heydricha",
      "10. 6. 1942 — vypálení Lidic",
      "8. 5. 1945 — Den vítězství",
      "1945–1946 — odsun sudetských Němců",
    ],
    hints: ["Pamatuj klíčová data: 3/1939, 9/1939, 5/1942, 6/1942, 5/1945."],
  },
  {
    question: "Seřaď 6 milníků týkajících se Židů v Čechách za 2. světové války.",
    correctAnswer: "order",
    items: [
      "Protižidovské zákony v Protektorátu (1939–1940)",
      "Povinnost nosit žlutou hvězdu (1941)",
      "Terezín jako ghetto — první deportace (1941)",
      "Atentát na Heydricha — architekt holocaustu (1942)",
      "Masové deportace do Osvětimi (1942–1944)",
      "Osvobozeni a návrat přeživších (1945)",
    ],
    hints: ["Omezení přicházela postupně od 1939."],
  },
  {
    question: "Seřaď 6 událostí od Mnichovské dohody po Postupimskou konferenci.",
    correctAnswer: "order",
    items: [
      "Mnichovská dohoda (září 1938)",
      "Vznik Protektorátu (15. 3. 1939)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Pražské povstání (5. 5. 1945)",
      "Konec 2. světové války (8. 5. 1945)",
      "Postupimská konference — odsun Němců (1945)",
    ],
    hints: ["Pražské povstání bylo 5. 5. 1945 — tři dny před koncem války."],
  },
  {
    question: "Seřaď 5 klíčových okamžiků osvobozování Čech v roce 1945.",
    correctAnswer: "order",
    items: [
      "Pražské povstání (5. 5. 1945)",
      "Osvobozeni Plzně Americany (6. 5. 1945)",
      "Kapitulace Německa (8. 5. 1945)",
      "Příjezd Sovětské armády do Prahy (9. 5. 1945)",
      "Konec ozbrojených bojů v ČSR (12. 5. 1945)",
    ],
    hints: ["Pražské povstání bylo 5. 5. — první ze série."],
  },
  {
    question: "Seřaď 6 klíčových dat 2. světové války na světové úrovni.",
    correctAnswer: "order",
    items: [
      "Německo obsazuje ČSR (15. 3. 1939)",
      "Německo napadá Polsko (1. 9. 1939)",
      "Německo napadá SSSR (22. 6. 1941)",
      "USA vstupuje po Pearl Harboru (8. 12. 1941)",
      "Vylodění v Normandii (D-Day, 6. 6. 1944)",
      "Kapitulace Německa (8. 5. 1945)",
    ],
    hints: ["Obsazení ČSR bylo ještě před začátkem světové války."],
  },
  {
    question: "Seřaď 5 klíčových dat týkajících se operace Anthropoid.",
    correctAnswer: "order",
    items: [
      "Heydrich jmenován protektorem (září 1941)",
      "Gabčík a Kubiš vycvičeni v Anglii a vysazeni (12. 1941)",
      "Atentát na Heydricha (27. 5. 1942)",
      "Heydrich umírá (4. 6. 1942)",
      "Gabčík a Kubiš padají v kryptě katedrály (18. 6. 1942)",
    ],
    hints: ["Atentát byl 27. 5. 1942."],
  },
  {
    question: "Seřaď 6 milníků od začátku Protektorátu po obnovení ČSR.",
    correctAnswer: "order",
    items: [
      "Vznik Protektorátu (15. 3. 1939)",
      "Terezínské ghetto otevřeno (1941)",
      "Atentát na Heydricha (1942)",
      "Konec 2. světové války (8. 5. 1945)",
      "Odsun sudetských Němců (1945–1946)",
      "Obnovení demokratické ČSR (1946 — volby)",
    ],
    hints: ["Obnovení demokracie bylo volbami v roce 1946."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const DRUHASVETOVAVALKAOKUPACEOSVOBOZENI: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni",
    title: "Druhá světová válka, okupace, osvobození",
    studentTitle: "2. světová válka",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Poznáš, co zažily Čechy za nacistické okupace.",
    keywords: ["druhá světová válka", "protektorát", "heydrich", "lidice", "holocaust", "terezín", "osvobození"],
    goals: [
      "Žák vysvětlí vznik a podstatu Protektorátu Čechy a Morava",
      "Žák popíše holocaust a roli Terezína",
      "Žák uvede, kdo a kdy osvobodil ČSR",
    ],
    boundaries: ["Detailní vojenské operace", "Celá geografie druhé světové války"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová data: 15. 3. 1939 (Protektorát), 1942 (Heydrich + Lidice), 8. 5. 1945 (konec války).",
      steps: [
        "15. 3. 1939: nacistická okupace — Protektorát",
        "1942: atentát na Heydricha → Lidice a Ležáky",
        "Holocaust: Terezín → deportace → 6 mil. obětí",
        "8. 5. 1945: konec války; západ = Američané, východ = Sověti",
        "Odsun sudetských Němců po 1945",
      ],
      commonMistake: "Zaměňování protektorátu (1939) s začátkem světové války (1939) — protektorát byl o 6 měsíců dříve.",
      example: "Lidice byly vypáleny jako odplata za atentát na Heydricha v červnu 1942.",
    },
  },
];
