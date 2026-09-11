import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { parovani, type Dvojice } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a dvojice obsahovaly chyby i látku nad rámec 5. ročníku
// („Island — největší ostrov Evropy“, HDP na obyvatele, jazykové rodiny).
// Teď dvě banky: hlavní města států a sousedé Česka s Evropskou unií.

const HLAVNI_MESTA: Dvojice[] = [
  { uroven: 1, levy: "Německo", pravy: "Berlín", proc: "Berlín je největší město Německa a leží na řece Sprévě." },
  { uroven: 1, levy: "Polsko", pravy: "Varšava", proc: "Varšava leží na řece Visle." },
  { uroven: 1, levy: "Rakousko", pravy: "Vídeň", proc: "Vídeň leží na Dunaji." },
  { uroven: 1, levy: "Slovensko", pravy: "Bratislava", proc: "Bratislava leží na Dunaji u hranic s Rakouskem a Maďarskem." },
  { uroven: 1, levy: "Francie", pravy: "Paříž", proc: "Paříž leží na řece Seině a stojí v ní Eiffelova věž." },
  { uroven: 1, levy: "Itálie", pravy: "Řím", proc: "V Římě stojí Koloseum a uvnitř města leží Vatikán." },
  { uroven: 1, levy: "Velká Británie", pravy: "Londýn", proc: "Londýn leží na řece Temži." },
  { uroven: 1, levy: "Španělsko", pravy: "Madrid", proc: "Madrid leží uprostřed Pyrenejského poloostrova." },

  { uroven: 2, levy: "Maďarsko", pravy: "Budapešť", proc: "Budapešť vznikla spojením Budína a Pešti na březích Dunaje." },
  { uroven: 2, levy: "Chorvatsko", pravy: "Záhřeb", proc: "Záhřeb leží na řece Sávě ve vnitrozemí Chorvatska." },
  { uroven: 2, levy: "Nizozemsko", pravy: "Amsterdam", proc: "Amsterdam je známý kanály a mosty." },
  { uroven: 2, levy: "Belgie", pravy: "Brusel", proc: "V Bruselu sídlí Evropská komise." },
  { uroven: 2, levy: "Portugalsko", pravy: "Lisabon", proc: "Lisabon leží u ústí řeky Tejo do Atlantského oceánu." },
  { uroven: 2, levy: "Řecko", pravy: "Atény", proc: "Nad Aténami stojí starověká Akropole." },
  { uroven: 2, levy: "Dánsko", pravy: "Kodaň", proc: "V přístavu v Kodani sedí socha Malé mořské víly." },
  { uroven: 2, levy: "Švédsko", pravy: "Stockholm", proc: "Stockholm leží na ostrovech mezi jezerem a Baltským mořem." },
  { uroven: 2, levy: "Norsko", pravy: "Oslo", proc: "Oslo leží na konci dlouhého fjordu." },

  { uroven: 3, levy: "Slovinsko", pravy: "Lublaň", proc: "Lublaň je malé hlavní město pod Alpami." },
  { uroven: 3, levy: "Finsko", pravy: "Helsinky", proc: "Helsinky leží na pobřeží Finského zálivu." },
  { uroven: 3, levy: "Irsko", pravy: "Dublin", proc: "Dublin leží na východním pobřeží Irska." },
  { uroven: 3, levy: "Rumunsko", pravy: "Bukurešť", proc: "Bukurešť je největší město Rumunska." },
  { uroven: 3, levy: "Bulharsko", pravy: "Sofie", proc: "Sofie leží pod horou Vitoša." },
  { uroven: 3, levy: "Litva", pravy: "Vilnius", proc: "Vilnius je nejjižnější z pobaltských metropolí." },
  { uroven: 3, levy: "Lotyšsko", pravy: "Riga", proc: "Riga je největší město Pobaltí." },
  { uroven: 3, levy: "Estonsko", pravy: "Tallinn", proc: "Tallinn má zachované středověké Staré Město." },
];

const SOUSEDE_A_EU: Dvojice[] = [
  { uroven: 1, levy: "Německo", pravy: "soused Česka s nejdelší společnou hranicí",
    proc: "Hranice s Německem vede po Krušných horách, Českém lese a Šumavě." },
  { uroven: 1, levy: "Slovensko", pravy: "soused, se kterým jsme do roku 1992 tvořili jeden stát",
    proc: "Československo se k 1. 1. 1993 pokojně rozdělilo." },
  { uroven: 1, levy: "Rakousko", pravy: "jižní soused Česka",
    proc: "Hranice s Rakouskem vede přes Šumavu a jižní Moravu." },
  { uroven: 1, levy: "Polsko", pravy: "severní soused Česka",
    proc: "Hranice s Polskem vede přes Krkonoše a Jeseníky." },
  { uroven: 1, levy: "Evropská unie", pravy: "společenství států, do kterého Česko vstoupilo v roce 2004",
    proc: "Státy EU spolu obchodují bez cel a jejich občané mohou volně cestovat." },
  { uroven: 1, levy: "euro", pravy: "společná měna mnoha států Evropské unie",
    proc: "Eurem se platí například na Slovensku, v Německu nebo v Rakousku." },

  { uroven: 2, levy: "Brusel", pravy: "město, kde sídlí Evropská komise",
    proc: "Brusel je hlavním městem Belgie a sídlí v něm hlavní úřady EU." },
  { uroven: 2, levy: "Štrasburk", pravy: "město, kde zasedá Evropský parlament",
    proc: "Štrasburk leží ve Francii u hranic s Německem." },
  { uroven: 2, levy: "schengenský prostor", pravy: "státy bez kontrol na společných hranicích",
    proc: "Česko je v schengenském prostoru od roku 2007." },
  { uroven: 2, levy: "NATO", pravy: "obranné spojenectví, jehož je Česko členem od roku 1999",
    proc: "Členové NATO si slíbili, že si při napadení pomohou." },
  { uroven: 2, levy: "Norsko", pravy: "severský stát s fjordy, který není v EU",
    proc: "Norové v hlasování dvakrát odmítli vstup do Evropské unie." },
  { uroven: 2, levy: "Chorvatsko", pravy: "stát, který vstoupil do EU jako poslední (2013)",
    proc: "Chorvatsko je zatím nejmladším členem Evropské unie." },

  { uroven: 3, levy: "Vatikán", pravy: "nejmenší stát světa",
    proc: "Vatikán leží uprostřed Říma a vládne mu papež." },
  { uroven: 3, levy: "Švýcarsko", pravy: "alpský stát, který není v EU",
    proc: "Švýcarsko s EU úzce spolupracuje, ale členem není." },
  { uroven: 3, levy: "Lucembursko", pravy: "malé velkovévodství mezi Belgií, Francií a Německem",
    proc: "Lucembursko patří k zakládajícím státům evropské spolupráce." },
  { uroven: 3, levy: "česká koruna", pravy: "měna Česka, které zatím nepřijalo euro",
    proc: "Česko se k přijetí eura zavázalo, ale termín zatím nestanovilo." },
  { uroven: 3, levy: "Evropský parlament", pravy: "poslanci, které volí občané všech států EU",
    proc: "Volby do Evropského parlamentu jsou jednou za pět let." },
];

function gen(level: number): PracticeTask[] {
  return [
    ...parovani(HLAVNI_MESTA, level, "Spoj stát s jeho hlavním městem.", 15),
    ...parovani(SOUSEDE_A_EU, level, "Spoj pojem s tím, co o něm platí.", 15),
  ];
}

export const EVROPSKESTATYAEUSOUSEDNIZEMECRPODROBNE: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropske-staty-a-eu-sousedni-zeme-cr-podrobne",
    title: "Evropské státy a EU, sousední země ČR podrobně",
    studentTitle: "Sousedé ČR a EU",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš sousedy Česka a jak funguje Evropská unie.",
    keywords: ["sousedé čr", "německo", "polsko", "slovensko", "rakousko", "eu", "vatikán", "monaco"],
    goals: [
      "Žák jmenuje 4 sousední státy ČR a jejich polohu",
      "Žák uvede základní fakta o EU (27 členů, Brusel)",
      "Žák porovná sousedy ČR podle populace",
    ],
    boundaries: ["Detailní ekonomická statistika", "Politická geografie celé Evropy"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "ČR má 4 sousedy: Německo (Z), Polsko (S), Slovensko (V), Rakousko (J).",
      steps: [
        "Západ: Německo (~84 mil.)",
        "Sever: Polsko (~37 mil.)",
        "Východ: Slovensko (~5,5 mil.)",
        "Jih: Rakousko (~9 mil.)",
        "EU: 27 zemí, sídlo v Bruselu",
      ],
      commonMistake: "Záměna polohy Polska (sever) a Slovenska (východ).",
      example: "Německo je největší soused ČR — přibližně 84 milionů obyvatel.",
    },
  },
];
