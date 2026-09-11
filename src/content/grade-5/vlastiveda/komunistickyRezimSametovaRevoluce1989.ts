import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných řad. Teď se skládají z banky
// ověřených událostí: L1 tři s datem, L2 čtyři s datem, L3 čtyři bez data.

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "Komunisté převzali moc ve státě (Vítězný únor)", kdy: "25. 2. 1948", klic: 1948.0225,
    proc: "Komunistická strana ovládla stát a začala potlačovat ostatní strany." },
  { uroven: 1, co: "Vojska Varšavské smlouvy obsadila Československo", kdy: "21. 8. 1968", klic: 1968.0821,
    proc: "Sovětská a další armády přijely ukončit uvolnění zvané pražské jaro." },
  { uroven: 1, co: "Zásah proti studentům na Národní třídě — začala sametová revoluce", kdy: "17. 11. 1989", klic: 1989.1117,
    proc: "Brutální zásah proti studentům spustil pokojné protesty, které komunistický režim svrhly." },
  { uroven: 1, co: "Václav Havel zvolen prezidentem", kdy: "29. 12. 1989", klic: 1989.1229,
    proc: "Dříve pronásledovaný disident se stal prezidentem na konci roku revoluce." },
  { uroven: 1, co: "První svobodné volby po revoluci", kdy: "červen 1990", klic: 1990.0608,
    proc: "Poprvé po dlouhých letech mohli lidé volit svobodně mezi více stranami." },

  { uroven: 2, co: "Politický proces s Miladou Horákovou", kdy: "1950", klic: 1950.0627,
    proc: "Komunisté ji ve vykonstruovaném procesu odsoudili k smrti — symbol represí 50. let." },
  { uroven: 2, co: "Měnová reforma připravila lidi o úspory", kdy: "1953", klic: 1953.0601,
    proc: "Stát přes noc vyměnil peníze v nevýhodném poměru a úspory lidí znehodnotil." },
  { uroven: 2, co: "Pražské jaro — Alexander Dubček v čele strany", kdy: "leden 1968", klic: 1968.0105,
    proc: "Pokus o „socialismus s lidskou tváří“ uvolnil cenzuru; ukončila ho srpnová okupace." },
  { uroven: 1, co: "Jan Palach se upálil na protest", kdy: "leden 1969", klic: 1969.0116,
    proc: "Student chtěl svým činem probudit lidi z lhostejnosti po okupaci." },
  { uroven: 2, co: "Vznikla Charta 77", kdy: "leden 1977", klic: 1977.0101,
    proc: "Disidenti v čele s Václavem Havlem upozorňovali, že režim porušuje lidská práva." },
  { uroven: 2, co: "Pád Berlínské zdi", kdy: "9. 11. 1989", klic: 1989.1109,
    proc: "Týden před 17. listopadem padla zeď mezi východním a západním Berlínem." },

  { uroven: 3, co: "Začala kolektivizace — rolníci museli do družstev (JZD)", kdy: "od roku 1949", klic: 1949.0223,
    proc: "Soukromá hospodářství přešla do jednotných zemědělských družstev, často pod nátlakem." },
  { uroven: 3, co: "Gustáv Husák v čele strany — začala normalizace", kdy: "duben 1969", klic: 1969.0417,
    proc: "Husák po Dubčekovi obnovil přísnou kontrolu společnosti." },
  { uroven: 3, co: "Palachův týden — demonstrace k výročí Palachova činu", kdy: "leden 1989", klic: 1989.0115,
    proc: "Protesty ukázaly, že se lidé přestávají bát; pár měsíců nato padl režim." },
  { uroven: 3, co: "Z ústavy zmizel článek o vedoucí úloze komunistické strany", kdy: "29. 11. 1989", klic: 1989.1129,
    proc: "Dvanáct dní po začátku revoluce ztratila komunistická strana zaručenou moc." },
  { uroven: 3, co: "Z Československa odešla sovětská vojska", kdy: "červen 1991", klic: 1991.0621,
    proc: "Vojska, která zemi obsadila v roce 1968, odešla dva roky po revoluci." },
  { uroven: 3, co: "Rozdělení Československa na dva státy", kdy: "1. 1. 1993", klic: 1993.0101,
    proc: "Česko a Slovensko se pokojně rozdělily na samostatné státy." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z let 1948–1993");
}

export const KOMUNISTICKYREZIMSAMETOVAREVOLUCE1989: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-komunisticky-rezim-sametova-revoluce-1989",
    title: "Komunistický režim, sametová revoluce 1989",
    studentTitle: "Komunismus a revoluce",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Poznáš, jak fungoval komunismus a jak padl v roce 1989.",
    keywords: ["komunismus", "gottwald", "pražské jaro", "dubček", "normalizace", "sametová revoluce", "havel"],
    goals: [
      "Žák vysvětlí, co byl komunistický režim v ČSR",
      "Žák popíše Pražské jaro a srpnovou invazi",
      "Žák zná datum a průběh Sametové revoluce",
    ],
    boundaries: ["Marxistická ekonomická teorie", "Detailní geopolitika studené války"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová data: 1948 (převrat), 1968 (Pražské jaro + invaze), 1989 (Sametová revoluce).",
      steps: [
        "Únor 1948: komunistický převrat — Gottwald",
        "1968: Pražské jaro (Dubček) → invaze SSSR",
        "1969–1989: normalizace — Husák",
        "17. 11. 1989: Sametová revoluce",
        "1989: Václav Havel — prezident",
      ],
      commonMistake: "Zaměňování Dubčeka (Pražské jaro) a Husáka (normalizace).",
      example: "Sametová revoluce se nazývá sametová, protože proběhla bez násilí.",
    },
  },
];
