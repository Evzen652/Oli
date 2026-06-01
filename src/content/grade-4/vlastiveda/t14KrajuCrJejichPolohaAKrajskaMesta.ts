import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const KRAJE: { kraj: string; mesto: string; poloha: string }[] = [
  { kraj: "Praha", mesto: "Praha", poloha: "střední Čechy, srdce Čech" },
  { kraj: "Středočeský", mesto: "Praha", poloha: "střední Čechy, obklopuje Prahu" },
  { kraj: "Jihočeský", mesto: "České Budějovice", poloha: "jižní Čechy, hraničí s Rakouskem" },
  { kraj: "Plzeňský", mesto: "Plzeň", poloha: "západní Čechy, hraničí s Německem" },
  { kraj: "Karlovarský", mesto: "Karlovy Vary", poloha: "severozápadní Čechy, hraničí s Německem" },
  { kraj: "Ústecký", mesto: "Ústí nad Labem", poloha: "severní Čechy, hraničí s Německem" },
  { kraj: "Liberecký", mesto: "Liberec", poloha: "severní Čechy, hraničí s Německem a Polskem" },
  { kraj: "Královéhradecký", mesto: "Hradec Králové", poloha: "severovýchodní Čechy, u Krkonoš" },
  { kraj: "Pardubický", mesto: "Pardubice", poloha: "východní Čechy, u řeky Labe" },
  { kraj: "Kraj Vysočina", mesto: "Jihlava", poloha: "střed republiky, Českomoravská vrchovina" },
  { kraj: "Jihomoravský", mesto: "Brno", poloha: "jižní Morava, hraničí s Rakouskem a Slovenskem" },
  { kraj: "Olomoucký", mesto: "Olomouc", poloha: "střední Morava, u řeky Moravy" },
  { kraj: "Zlínský", mesto: "Zlín", poloha: "jihovýchodní Morava, Beskydy" },
  { kraj: "Moravskoslezský", mesto: "Ostrava", poloha: "severovýchodní Morava, hraničí s Polskem a Slovenskem" },
];

function otherMesta(correct: string, count = 3): string[] {
  return shuffle(KRAJE.map(k => k.mesto).filter(m => m !== correct)).slice(0, count);
}

function otherKraje(correct: string, count = 3): string[] {
  return shuffle(KRAJE.map(k => k.kraj).filter(k => k !== correct)).slice(0, count);
}

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  // Level 1: krajské město → kraj a kraj → krajské město (základní)
  if (level === 1) {
    for (const k of KRAJE) {
      tasks.push({
        question: `Jaké je krajské město kraje ${k.kraj}?`,
        correctAnswer: k.mesto,
        options: shuffle([k.mesto, ...otherMesta(k.mesto, 3)]),
        hints: [`Krajské město je správní centrum kraje.`, `Hledáme město v kraji ${k.kraj}.`],
        solutionSteps: [`Krajské město kraje ${k.kraj} je ${k.mesto}.`],
      });
    }
    tasks.push({
      question: "Kolik krajů má Česká republika?",
      correctAnswer: "14",
      options: ["12", "13", "14", "16"],
      hints: ["Počet krajů si můžeš spočítat na mapě ČR."],
      solutionSteps: ["Česká republika má celkem 14 krajů."],
    });
    tasks.push({
      question: "Které město je krajským městem Jihočeského kraje?",
      correctAnswer: "České Budějovice",
      options: ["Plzeň", "České Budějovice", "Liberec", "Jihlava"],
      hints: ["Jihočeský kraj leží na jihu Čech."],
      solutionSteps: ["Krajským městem Jihočeského kraje jsou České Budějovice."],
    });
    tasks.push({
      question: "Které město je krajským městem Moravskoslezského kraje?",
      correctAnswer: "Ostrava",
      options: ["Brno", "Olomouc", "Ostrava", "Zlín"],
      hints: ["Moravskoslezský kraj leží na severovýchodě Moravy."],
      solutionSteps: ["Krajským městem Moravskoslezského kraje je Ostrava."],
    });
    tasks.push({
      question: "Které město je krajským městem Jihomoravského kraje?",
      correctAnswer: "Brno",
      options: ["Brno", "Jihlava", "Olomouc", "Pardubice"],
      hints: ["Jihomoravský kraj leží na jižní Moravě."],
      solutionSteps: ["Krajským městem Jihomoravského kraje je Brno."],
    });
  }

  // Level 2: město → kraj
  if (level === 2) {
    for (const k of KRAJE) {
      tasks.push({
        question: `Ve kterém kraji leží krajské město ${k.mesto}?`,
        correctAnswer: k.kraj,
        options: shuffle([k.kraj, ...otherKraje(k.kraj, 3)]),
        hints: [`${k.mesto} je krajské město.`, `Hledáme kraj, jehož centrem je ${k.mesto}.`],
        solutionSteps: [`${k.mesto} je krajským městem kraje ${k.kraj}.`],
      });
    }
    tasks.push({
      question: "Které z těchto měst NENÍ krajským městem?",
      correctAnswer: "Kutná Hora",
      options: ["Liberec", "Kutná Hora", "Jihlava", "Pardubice"],
      hints: ["Krajská města jsou správní centra krajů."],
      solutionSteps: ["Kutná Hora není krajské město. Krajská města jsou například Liberec, Jihlava, Pardubice."],
    });
    tasks.push({
      question: "Které z těchto měst NENÍ krajským městem?",
      correctAnswer: "Kladno",
      options: ["Kladno", "Zlín", "Hradec Králové", "Karlovarský kraj"],
      hints: ["Kladno leží ve Středočeském kraji, ale není jeho krajským městem."],
      solutionSteps: ["Kladno není krajské město — krajským městem Středočeského kraje je Praha."],
    });
    tasks.push({
      question: "Které kraj má jako krajské město Jihlavu?",
      correctAnswer: "Kraj Vysočina",
      options: ["Kraj Vysočina", "Jihomoravský kraj", "Pardubický kraj", "Olomoucký kraj"],
      hints: ["Kraj Vysočina leží uprostřed republiky na Českomoravské vrchovině."],
      solutionSteps: ["Jihlava je krajským městem Kraje Vysočina."],
    });
    tasks.push({
      question: "Které kraj hraničí se Slovenskem a má krajské město Zlín?",
      correctAnswer: "Zlínský",
      options: ["Zlínský", "Jihomoravský", "Moravskoslezský", "Olomoucký"],
      hints: ["Zlínský kraj leží na jihovýchodě Moravy."],
      solutionSteps: ["Zlínský kraj má krajské město Zlín a hraničí se Slovenskem."],
    });
  }

  // Level 3: těžší — poloha kraje
  if (level === 3) {
    tasks.push({
      question: "Který kraj obklopuje hlavní město Prahu ze všech stran?",
      correctAnswer: "Středočeský",
      options: ["Středočeský", "Plzeňský", "Ústecký", "Kraj Vysočina"],
      hints: ["Tento kraj obklopuje Prahu jako prstenec."],
      solutionSteps: ["Středočeský kraj obklopuje Prahu ze všech stran."],
    });
    tasks.push({
      question: "Který kraj leží nejseverozápadněji v ČR a hraničí s Německem?",
      correctAnswer: "Karlovarský",
      options: ["Karlovarský", "Ústecký", "Liberecký", "Plzeňský"],
      hints: ["Tento kraj je znám léčivými prameny."],
      solutionSteps: ["Karlovarský kraj leží nejseverozápadněji a je znám Karlovými Vary."],
    });
    tasks.push({
      question: "Který kraj leží na jihu ČR a je největší co do rozlohy?",
      correctAnswer: "Jihočeský",
      options: ["Jihočeský", "Plzeňský", "Jihomoravský", "Středočeský"],
      hints: ["Tento kraj je znám rybníky a Šumavou."],
      solutionSteps: ["Jihočeský kraj je největší kraj ČR (co do rozlohy) a leží na jihu Čech."],
    });
    tasks.push({
      question: "Které krajské město leží na řece Vltavě v jižních Čechách?",
      correctAnswer: "České Budějovice",
      options: ["České Budějovice", "Plzeň", "Praha", "Jihlava"],
      hints: ["Vltava pramení na Šumavě a teče přes toto krajské město."],
      solutionSteps: ["České Budějovice leží na Vltavě v Jihočeském kraji."],
    });
    tasks.push({
      question: "Který kraj hraničí zároveň s Polskem a Slovenskem?",
      correctAnswer: "Moravskoslezský",
      options: ["Moravskoslezský", "Liberecký", "Zlínský", "Královéhradecký"],
      hints: ["Tento kraj leží na severovýchodě ČR."],
      solutionSteps: ["Moravskoslezský kraj hraničí na severu s Polskem a na jihu se Slovenskem."],
    });
    tasks.push({
      question: "Který kraj jako jediný leží jen uprostřed republiky bez hranice se zahraničím?",
      correctAnswer: "Kraj Vysočina",
      options: ["Kraj Vysočina", "Pardubický", "Olomoucký", "Středočeský"],
      hints: ["Tento kraj nemá žádnou státní hranici."],
      solutionSteps: ["Kraj Vysočina nemá žádnou státní hranici — leží ve vnitrozemí ČR."],
    });
    tasks.push({
      question: "Která dvě krajská města sdílí stejný název (stejné město je krajské město dvou krajů)?",
      correctAnswer: "Praha",
      options: ["Praha", "Brno", "Plzeň", "Ostrava"],
      hints: ["Praha je krajské město Prahy jako kraje a zároveň sídlo hejtmana Středočeského kraje."],
      solutionSteps: ["Praha je krajské město hlavního města Prahy a zároveň sídlo hejtmanství Středočeského kraje."],
    });
    tasks.push({
      question: "Ve které části ČR leží Olomoucký kraj?",
      correctAnswer: "Na střední Moravě",
      options: ["Na střední Moravě", "V jižních Čechách", "Na severu Čech", "Na západě Čech"],
      hints: ["Olomouc leží u řeky Moravy uprostřed Moravy."],
      solutionSteps: ["Olomoucký kraj leží na střední Moravě u řeky Moravy."],
    });
    // Fill remaining with mixed questions about all kraje
    for (const k of shuffle(KRAJE).slice(0, 10)) {
      tasks.push({
        question: `Popiš polohu kraje ${k.kraj}. Kde leží?`,
        correctAnswer: k.poloha,
        options: shuffle([k.poloha, ...shuffle(KRAJE.filter(x => x.kraj !== k.kraj).map(x => x.poloha)).slice(0, 3)]),
        hints: [`Mysli na to, kde na mapě ČR leží krajské město ${k.mesto}.`],
        solutionSteps: [`Kraj ${k.kraj} leží: ${k.poloha}.`],
      });
    }
  }

  return shuffle(tasks).slice(0, level === 1 ? 30 : level === 2 ? 35 : 45);
}

export const T14KRAJUCRJEJICHPOLOHAAKRAJSKAMESTA: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-14-kraju-cr-jejich-poloha-a-krajska-mesta",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-kraje-cr-14-kraju-cr-jejich-poloha-a-krajska-mesta",
    title: "14 krajů ČR, jejich poloha a krajská města",
    studentTitle: "14 krajů ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Poznáš všechna 4 krajská města a rozmístění krajů na mapě ČR.",
    keywords: ["kraje", "krajská města", "česká republika", "mapa", "kraj"],
    goals: [
      "Vyjmenovat 14 krajů ČR",
      "Přiřadit ke každému kraji krajské město",
      "Popsat přibližnou polohu krajů na mapě",
    ],
    boundaries: ["Není nutné znát přesné hranice krajů", "Statistická data krajů nejsou požadována"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "ČR má 14 krajů. Každý kraj má krajské město, které je správním centrem.",
      steps: [
        "Vzpomeň si na mapu ČR",
        "Najdi kraj, na který se ptáme",
        "Vzpomeň si, které město je centrem (krajským městem) tohoto kraje",
      ],
      commonMistake: "Žáci si pletou Středočeský kraj a hlavní město Praha — Praha je krajské město obou, ale jsou to dva samostatné kraje.",
      example: "Jihočeský kraj → krajské město České Budějovice (leží na jihu Čech, u Šumavy)",
    },
  },
];
