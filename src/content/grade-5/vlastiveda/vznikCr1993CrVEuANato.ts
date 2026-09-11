import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných řad. Teď se skládají z banky
// ověřených událostí: L1 tři s datem, L2 čtyři s datem, L3 čtyři bez data.

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "Sametová revoluce", kdy: "listopad 1989", klic: 1989.1117,
    proc: "Pád komunismu otevřel cestu k demokracii a svobodným volbám." },
  { uroven: 1, co: "Vznik samostatné České republiky", kdy: "1. 1. 1993", klic: 1993.0101,
    proc: "Československo se pokojně rozdělilo na Česko a Slovensko." },
  { uroven: 1, co: "Česko vstoupilo do NATO", kdy: "12. 3. 1999", klic: 1999.0312,
    proc: "Vstupem do obranného spojenectví se Česko může spolehnout na pomoc spojenců." },
  { uroven: 1, co: "Česko vstoupilo do Evropské unie", kdy: "1. 5. 2004", klic: 2004.0501,
    proc: "Díky EU mohou Češi volně cestovat, studovat a pracovat v dalších zemích unie." },
  { uroven: 1, co: "Česko vstoupilo do schengenského prostoru", kdy: "21. 12. 2007", klic: 2007.1221,
    proc: "Na hranicích se sousedními státy zmizely pasové kontroly." },

  { uroven: 2, co: "Přijata Ústava České republiky", kdy: "16. 12. 1992", klic: 1992.1216,
    proc: "Ústavu přijala Česká národní rada ještě před vznikem samostatného státu." },
  { uroven: 1, co: "Václav Havel zvolen prvním prezidentem České republiky", kdy: "26. 1. 1993", klic: 1993.0126,
    proc: "Prvním prezidentem samostatného Česka se stal Václav Havel." },
  { uroven: 2, co: "Václav Klaus zvolen prezidentem", kdy: "2003", klic: 2003.0228,
    proc: "Klaus vystřídal na Pražském hradě Václava Havla." },
  { uroven: 2, co: "Česko poprvé předsedalo Radě Evropské unie", kdy: "první pololetí 2009", klic: 2009.01,
    proc: "Půl roku vedlo Česko jednání ministrů zemí Evropské unie." },
  { uroven: 2, co: "První přímá volba prezidenta", kdy: "leden 2013", klic: 2013.0126,
    proc: "Poprvé prezidenta nevolil parlament, ale přímo občané; zvolen byl Miloš Zeman." },

  { uroven: 3, co: "Vznikla Visegrádská skupina", kdy: "15. 2. 1991", klic: 1991.0215,
    proc: "Československo, Polsko a Maďarsko se ve Visegrádu dohodly na spolupráci." },
  { uroven: 3, co: "Premiéři Klaus a Mečiar se dohodli na rozdělení státu", kdy: "26. 8. 1992", klic: 1992.0826,
    proc: "Dohoda ve vile Tugendhat v Brně připravila pokojné rozdělení Československa." },
  { uroven: 3, co: "Česko přijato do OECD", kdy: "prosinec 1995", klic: 1995.1221,
    proc: "Členstvím v organizaci vyspělých ekonomik se Česko zařadilo mezi rozvinuté země." },
  { uroven: 3, co: "Vstoupila v platnost Lisabonská smlouva", kdy: "1. 12. 2009", klic: 2009.1201,
    proc: "Smlouva změnila fungování Evropské unie; Česko ji schválilo mezi posledními." },
  { uroven: 3, co: "Česko podruhé předsedalo Radě Evropské unie", kdy: "druhé pololetí 2022", klic: 2022.07,
    proc: "Podruhé vedlo Česko půl roku jednání zemí Evropské unie." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z let 1989–2022");
}

export const VZNIKCR1993CRVEUANATO: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-vznik-cr-1993-cr-v-eu-a-nato",
    title: "Vznik ČR 1993, ČR v EU a NATO",
    studentTitle: "Vznik ČR a EU",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Pochopíš vznik ČR a její místo v Evropě.",
    keywords: ["vznik čr", "sametový rozvod", "eu", "nato", "schengen", "eurozóna", "česká koruna"],
    goals: [
      "Žák uvede datum vzniku ČR a podmínky rozdělení",
      "Žák zná členství ČR v NATO, EU a Schengenu a jejich roky",
      "Žák vysvětlí, proč ČR nemá euro",
    ],
    boundaries: ["Ekonomická kritéria eurozóny podrobně", "Vojenská struktura NATO"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj: 1993 vznik ČR, 1999 NATO, 2004 EU, 2007 Schengen.",
      steps: [
        "1. 1993: Sametový rozvod — vznik ČR a SR",
        "1999: ČR vstupuje do NATO",
        "1. 5. 2004: ČR vstupuje do EU",
        "2007: ČR vstupuje do Schengenu",
        "ČR nemá euro — používáme CZK",
      ],
      commonMistake: "Zaměňování roku vstupu do NATO (1999) a EU (2004).",
      example: "Sametový rozvod = pokojné rozdělení ČSR na dvě republiky — jako Sametová revoluce, ale jiné.",
    },
  },
];
