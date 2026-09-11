import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných řad. Teď se skládají z banky
// ověřených událostí: L1 tři s datem, L2 čtyři s datem, L3 čtyři bez data.

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "Českým králem zvolen Ferdinand I. Habsburský", kdy: "1526", klic: 1526.1024,
    proc: "Po smrti krále Ludvíka Jagellonského zvolili čeští stavové Habsburka; Habsburkové pak vládli téměř 400 let." },
  { uroven: 1, co: "Císař Rudolf II. přesídlil do Prahy", kdy: "1583", klic: 1583.0,
    proc: "Praha se stala sídlem císaře a centrem vědy a umění." },
  { uroven: 1, co: "Třetí pražská defenestrace", kdy: "23. 5. 1618", klic: 1618.0523,
    proc: "Stavové vyhodili císařské místodržící z okna Pražského hradu; začalo povstání a třicetiletá válka." },
  { uroven: 1, co: "Bitva na Bílé hoře", kdy: "8. 11. 1620", klic: 1620.1108,
    proc: "Stavovské vojsko prohrálo za necelé dvě hodiny; Habsburkové pak odpůrce tvrdě potrestali." },
  { uroven: 1, co: "Poprava 27 vůdců povstání na Staroměstském náměstí", kdy: "21. 6. 1621", klic: 1621.0621,
    proc: "Poprava měla být výstrahou všem, kdo by se chtěli císaři znovu vzepřít." },
  { uroven: 1, co: "Konec třicetileté války", kdy: "1648", klic: 1648.1024,
    proc: "Vestfálský mír ukončil válku, která zpustošila české země." },

  { uroven: 2, co: "Rudolf II. vydal Majestát o náboženské svobodě", kdy: "1609", klic: 1609.0709,
    proc: "Majestát zaručil stavům svobodu vyznání — jeho porušování vedlo k defenestraci." },
  { uroven: 2, co: "Obnovené zřízení zemské — povolena jen katolická víra", kdy: "1627", klic: 1627.051,
    proc: "Kdo nechtěl přestoupit ke katolické víře, musel ze země odejít." },
  { uroven: 2, co: "Jan Amos Komenský odešel do exilu", kdy: "1628", klic: 1628.02,
    proc: "Jako protestant musel po Bílé hoře opustit vlast a už se nevrátil." },
  { uroven: 2, co: "Švédové obléhali Prahu", kdy: "1648", klic: 1648.07,
    proc: "Na Karlově mostě se bojovalo ještě v posledních měsících třicetileté války." },
  { uroven: 2, co: "Komenský vydal obrázkovou učebnici Orbis pictus", kdy: "1658", klic: 1658.0,
    proc: "Byla to jedna z prvních učebnic pro děti s obrázky." },
  { uroven: 2, co: "Začala stavba barokního chrámu sv. Mikuláše na Malé Straně", kdy: "1704", klic: 1704.0,
    proc: "Barokní kostely měly ohromit bohatou výzdobou a posílit katolickou víru." },

  { uroven: 3, co: "Albrecht z Valdštejna zavražděn v Chebu", kdy: "1634", klic: 1634.0225,
    proc: "Císař se mocného vojevůdce obával; zabili ho jeho vlastní důstojníci." },
  { uroven: 3, co: "Velké selské povstání v Čechách", kdy: "1680", klic: 1680.0,
    proc: "Poddaní se bouřili proti rostoucí robotě." },
  { uroven: 3, co: "Pragmatická sankce", kdy: "1713", klic: 1713.0419,
    proc: "Karel VI. zajistil, že po něm může vládnout i jeho dcera Marie Terezie." },
  { uroven: 3, co: "Jan Nepomucký prohlášen za svatého", kdy: "1729", klic: 1729.0319,
    proc: "Svatořečení posílilo katolickou víru v Čechách; jeho sochy stojí na mnoha mostech." },
  { uroven: 3, co: "Na trůn nastoupila Marie Terezie", kdy: "1740", klic: 1740.102,
    proc: "Po smrti otce Karla VI. musela hned bránit své země ve válkách o dědictví." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z doby Habsburků");
}

export const HABSBURKOVEDOBAPOBELOHORSKABAROKO: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-habsburkove-doba-pobelohorska-baroko",
    title: "Habsburkové, doba pobělohorská, baroko",
    studentTitle: "Habsburkové a baroko",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Novověk - habsburská monarchie",
    briefDescription: "Poznáš Habsburky, bitvu na Bílé hoře a barokní styl.",
    keywords: ["habsburkové", "bílá hora", "baroko", "komenský", "rekatolizace", "jezuité"],
    goals: [
      "Žák vysvětlí příchod Habsburků na český trůn",
      "Žák popíše důsledky bitvy na Bílé hoře",
      "Žák charakterizuje barokní styl a jeho roli",
      "Žák zná dílo a osud J. A. Komenského",
    ],
    boundaries: [
      "Detailní vojenská taktika bitev",
      "Genealogie Habsburků",
      "Podrobná teologie reformace",
    ],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si na rok 1620 — bitva na Bílé hoře změnila Čechy.",
      steps: [
        "1526: Habsburkové přišli na český trůn",
        "1620: Bílá hora — porážka české šlechty",
        "Po 1620: rekatolizace, exil protestantů, baroko",
        "Komenský: Učitel národů v exilu",
      ],
      commonMistake: "Zaměňování bitvy u Moháče (1526) a bitvy na Bílé hoře (1620).",
      example: "Komenský napsal Orbis Pictus — první ilustrovanou učebnici světa.",
    },
  },
];
