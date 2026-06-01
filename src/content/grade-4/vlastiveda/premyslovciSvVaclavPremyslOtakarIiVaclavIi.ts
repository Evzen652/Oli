import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události Přemyslovců ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události z dějin Přemyslovců od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první pokřtěný přemyslovský kníže",
      "Sv. Václav zavražděn svým bratrem Boleslavem",
      "Přemysl Otakar I. – Čechy se staly dědičným královstvím",
      "Bitva na Moravském poli – zánik moci Přemysla Otakara II.",
    ],
    hints: ["Bořivoj byl první, sv. Václav brzy po něm. Přemysl Otakar I. přišel pak, Moravské pole 1278."],
  },
  {
    question: "Seřaď přemyslovské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů do Čech (6. stol.)",
      "Bořivoj přijal křesťanství na dvoře Svätopluka",
      "Zavraždění sv. Václava (935)",
      "Václav II. – zlaté časy kutnohorského stříbra",
    ],
    hints: ["Slované přišli jako první, pak Bořivoj, pak Václav, nakonec Václav II."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav šíří křesťanství v Čechách",
      "Bitva na Moravském poli – smrt Přemysla Otakara II. (1278)",
      "Václav II. – král český a polský",
      "Václav III. zavražděn – konec Přemyslovců (1306)",
    ],
    hints: ["Václav → Moravské pole → Václav II. → Václav III."],
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj (první historický přemyslovský kníže)",
      "Sv. Václav (patron Čech)",
      "Přemysl Otakar II. (král železný a zlatý)",
      "Václav III. (poslední Přemyslovec)",
    ],
    hints: ["Bořivoj – Václav – Přemysl Otakar II. – Václav III."],
  },
  {
    question: "Seřaď mezníky přemyslovské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (7. stol.) – první slovanský stát",
      "Pokřtění Bořivoje na Moravě",
      "Zlatá bula sicilská – dědičné království (1212)",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["Sámova říše byla nejstarší, zánik Přemyslovců nejmladší."],
  },
  {
    question: "Seřaď tyto historické události chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství (kolem 874)",
      "Zavraždění sv. Václava (935)",
      "Přemysl Otakar I. – dědičný titul krále (1198)",
      "Přemysl Otakar II. – rozkvět království",
    ],
    hints: ["874 → 935 → 1198 → poté Přemysl Otakar II."],
  },
  {
    question: "Seřaď od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové v Čechách (doba železná)",
      "Příchod Slovanů (6. stol. n. l.)",
      "Bořivoj – první přemyslovský kníže",
      "Sv. Václav – patron Čech",
    ],
    hints: ["Keltové → Slované → Bořivoj → Václav."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav zavražděn Boleslavem I.",
      "Přemysl Otakar I. získal dědičný titul krále",
      "Přemysl Otakar II. – nejsilnější panovník střední Evropy",
      "Václav II. – krále český a polský, Kutná Hora",
    ],
    hints: ["935 → 1198 → poté Otakar II. → poté Václav II."],
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Boleslav I. – vrah Václava, ale silný kníže",
      "Přemysl Otakar I. – dědičné království",
      "Přemysl Otakar II. – od Baltu po Jadrán",
      "Václav II. – Kutná Hora, polský král",
    ],
    hints: ["Boleslav I. byl nejstarší z těchto čtyř."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – pokřtěn na dvoře Svätopluka",
      "Sv. Václav – zavražděn 935",
      "Bitva na Moravském poli (1278)",
      "Zánik Přemyslovců – Václav III. (1306)",
    ],
    hints: ["Bořivoj → Václav 935 → Moravské pole 1278 → zánik 1306."],
  },
  {
    question: "Seřaď tyto události chronologicky.",
    correctAnswer: "order",
    items: [
      "Zlatá bula sicilská – dědičný titul krále pro Přemyslovce (1212)",
      "Přemysl Otakar II. – rozšíření říše od Baltu po Jadrán",
      "Bitva na Moravském poli – smrt Přemysla Otakara II. (1278)",
      "Václav III. zavražděn – konec rodu (1306)",
    ],
    hints: ["1212 → poté Otakar II. → 1278 → 1306."],
  },
  {
    question: "Seřaď od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše – první slovanský stát (623)",
      "Velkomoravská říše – vznik (9. stol.)",
      "Bořivoj – první přemyslovský kníže",
      "Přemysl Otakar II. – král železný a zlatý",
    ],
    hints: ["623 → 9. stol. → Bořivoj → Přemysl Otakar II."],
  },
  {
    question: "Seřaď přemyslovské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – patron Čech",
      "Přemysl Otakar I. – dědičné království (1198)",
      "Přemysl Otakar II. – nejmocnější panovník střední Evropy",
      "Václav II. – polský král, stříbrné doly Kutná Hora",
    ],
    hints: ["Václav → Otakar I. 1198 → Otakar II. → Václav II."],
  },
  {
    question: "Seřaď od nejstaršího po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první křesťanský přemyslovský kníže",
      "Přemysl Otakar I. – Čechy královstvím",
      "Bitva na Moravském poli (1278)",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Bořivoj → Otakar I. → 1278 → 1306."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci sjednotili slovanské kmeny v Čechách",
      "Sv. Václav – kníže a patron Čech",
      "Přemysl Otakar II. – Bohemia od Baltu po Jadrán",
      "Zánik Přemyslovců – Václav III. (1306)",
    ],
    hints: ["Sjednocení → Václav → Otakar II. → zánik."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové (Boiové) pojmenovali Čechy Bohemia",
      "Slované přišli do Čech (6. stol. n. l.)",
      "Bořivoj – první přemyslovský kníže",
      "Václav II. – král česky a polský",
    ],
    hints: ["Keltové → Slované → Bořivoj → Václav II."],
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Přijetí křesťanství Bořivojem",
      "Sv. Václav zavražděn bratrem (935)",
      "Přemysl Otakar I. – dědičný titul (1198)",
      "Václav II. – kutnohorské stříbro a polská koruna",
    ],
    hints: ["Bořivoj → 935 → 1198 → Václav II."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Velkomoravské říše (906)",
      "Bořivoj – první přemyslovský kníže",
      "Sv. Václav – patron Čech (zavražděn 935)",
      "Přemysl Otakar II. – rozkvět království",
    ],
    hints: ["906 → Bořivoj → 935 → Přemysl Otakar II."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav šíří křesťanství",
      "Zlatá bula sicilská (1212) – dědičné království",
      "Bitva na Moravském poli (1278)",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Václav → 1212 → 1278 → 1306."],
  },
  {
    question: "Seřaď přemyslovské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – křest na dvoře VM Říše (kolem 874)",
      "Zavraždění sv. Václava (935)",
      "Zlatá bula sicilská – dědičné království (1212)",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["874 → 935 → 1212 → 1306."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – kníže, šíří křesťanství",
      "Přemysl Otakar I. – dědičný titul krále ČR",
      "Přemysl Otakar II. – největší přemyslovská moc",
      "Václav II. – polský král, bohatství z Kutné Hory",
    ],
    hints: ["Václav I. → Otakar I. → Otakar II. → Václav II."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství",
      "Bitva na Moravském poli – zánik moci Přemysla Otakara II. (1278)",
      "Václav II. – stříbrné doly a polská koruna",
      "Václav III. – poslední Přemyslovec (zavražděn 1306)",
    ],
    hints: ["Bořivoj → 1278 → Václav II. → 1306."],
  },
  {
    question: "Seřaď přemyslovské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci sjednocují slovanské kmeny v Čechách",
      "Zlatá bula sicilská – Čechy dědičným královstvím",
      "Přemysl Otakar II. – říše od Baltu po Jadrán",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["Sjednocení → bula 1212 → Otakar II. → zánik."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové v Čechách – doba železná",
      "Slované v Čechách – 6. stol. n. l.",
      "Sámova říše – 7. stol.",
      "Bořivoj – první přemyslovský kníže",
    ],
    hints: ["Keltové → Slované → Sámova říše → Bořivoj."],
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Boleslav I. – konsolidátor přemyslovské moci",
      "Boleslav II. – upevnění křesťanství",
      "Přemysl Otakar I. – dědičné království",
      "Přemysl Otakar II. – rozkvět",
    ],
    hints: ["Boleslav I. → Boleslav II. → Otakar I. → Otakar II."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první křesťanský kníže Čech",
      "Sv. Václav – patron Čech (9.–10. stol.)",
      "Přemysl Otakar II. – největší přemyslovský vládce",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Bořivoj → Václav → Otakar II. → Václav III."],
  },
  {
    question: "Seřaď tyto mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů do střední Evropy (6. stol.)",
      "Bořivoj – křest (kolem 874)",
      "Sv. Václav – zavražděn (935)",
      "Zlatá bula sicilská – Čechy dědičné království (1212)",
    ],
    hints: ["6. stol. → 874 → 935 → 1212."],
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství z Velké Moravy",
      "Sv. Václav – zavražděn 935",
      "Přemysl Otakar I. – dědičné království (1198)",
      "Přemysl Otakar II. – 'král železný a zlatý'",
    ],
    hints: ["Bořivoj → 935 → 1198 → Přemysl Otakar II."],
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – 28. září (svátek patrona Čech)",
      "Přemysl Otakar I. – dědičné království",
      "Přemysl Otakar II. – bitva na Moravském poli (1278)",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Václav → Otakar I. → 1278 → 1306."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první Přemyslovec s pokřtěním",
      "Sv. Václav – patron Čech",
      "Václav II. – král český a polský",
      "Václav III. – konec rodu Přemyslovců",
    ],
    hints: ["Bořivoj → Václav I. → Václav II. → Václav III."],
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Přemyslovci sjednocují Čechy",
      "Sv. Václav – šíří křesťanství",
      "Zlatá bula sicilská (1212)",
      "Zánik Přemyslovců – Václav III. (1306)",
    ],
    hints: ["Sjednocení → Václav → 1212 → 1306."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci – vznik dynastie (9. stol.)",
      "Zlatá bula sicilská (1212) – dědičné království",
      "Přemysl Otakar II. – nejmocnější přemyslovský král",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["9. stol. → 1212 → Otakar II. → 1306."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové Boiové – pojmenování Bohemia",
      "Slované v Čechách – 6. stol.",
      "Bořivoj – první historický přemyslovský kníže",
      "Sv. Václav – zavražděn 935",
    ],
    hints: ["Keltové → Slované → Bořivoj → Václav 935."],
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství",
      "Přemysl Otakar I. – dědičné království (1198)",
      "Přemysl Otakar II. – 'od Baltu po Jadrán'",
      "Václav II. – kutnohorské stříbro",
    ],
    hints: ["Bořivoj → 1198 → Otakar II. → Václav II."],
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – kníže, patron Čech",
      "Přemysl Otakar II. – 'král železný a zlatý'",
      "Václav II. – polský král, Kutná Hora",
      "Zánik rodu Přemyslovců (1306)",
    ],
    hints: ["Václav → Otakar II. → Václav II. → 1306."],
  },
  {
    question: "Seřaď mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci – vznik rodu (9. stol.)",
      "Sv. Václav – zavražděn 935",
      "Přemysl Otakar II. – bitva na Moravském poli (1278)",
      "Václav III. – poslední Přemyslovec (1306)",
    ],
    hints: ["9. stol. → 935 → 1278 → 1306."],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const PREMYSLOVCISVVACLAVPREMYSLOTAKARIIVACLAVII: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    title: "Přemyslovci - sv. Václav, Přemysl Otakar II., Václav II.",
    studentTitle: "Přemyslovci",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš první českou dynastii Přemyslovců a jejich nejslavnější panovníky.",
    keywords: ["Přemyslovci", "Václav", "Přemysl Otakar II.", "Bořivoj", "Kutná Hora", "patron Čech"],
    goals: [
      "Vyjmenovat hlavní přemyslovské panovníky",
      "Popsat přínos sv. Václava",
      "Vysvětlit přezdívku 'král železný a zlatý'",
      "Vědět, kdy a proč Přemyslovci vymřeli",
    ],
    boundaries: ["Přesná genealogie celé dynastie není vyžadována", "Feudální systém do hloubky není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Přemyslovci: Bořivoj (první křestěný) → Sv. Václav (zavražděn 935) → Přemysl Otakar II. 'železný a zlatý' → Václav II. (stříbro) → Václav III. (1306 konec).",
      steps: [
        "Patron Čech = sv. Václav, 28. září = svátek",
        "Přemysl Otakar II. = 'král železný a zlatý', od Baltu po Jadrán",
        "Bitva na Moravském poli 1278 = konec moci Přemyslovců",
        "Václav III. 1306 = zánik dynastie",
      ],
      commonMistake: "Žáci si pletou Václava I. (sv. Václav, kníže) a Václava II. (král, otec Václava III.).",
      example: "Sv. Václav: kníže, šířil křesťanství, zavražděn 935, patron Čech.",
    },
  },
];
