import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných řad. Teď se skládají z banky
// ověřených událostí: L1 tři s datem, L2 čtyři s datem, L3 čtyři bez data.

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "Marie Terezie nastoupila na trůn", kdy: "1740", klic: 1740.102,
    proc: "Po smrti otce Karla VI. se stala vládkyní habsburských zemí." },
  { uroven: 1, co: "Zavedena povinná školní docházka", kdy: "1774", klic: 1774.1206,
    proc: "Děti musely chodit do školy; víc lidí se naučilo číst, psát a počítat." },
  { uroven: 1, co: "Josef II. začal vládnout sám", kdy: "1780", klic: 1780.1129,
    proc: "Po smrti matky mohl rychle prosazovat své reformy." },
  { uroven: 1, co: "Toleranční patent", kdy: "1781", klic: 1781.1013,
    proc: "Kromě katolíků mohli svou víru vyznávat i protestanti a pravoslavní." },
  { uroven: 1, co: "Zrušení nevolnictví", kdy: "1781", klic: 1781.1101,
    proc: "Poddaní se mohli bez svolení pána stěhovat, ženit a posílat děti na studia." },

  { uroven: 2, co: "Sňatek Marie Terezie s Františkem Štěpánem Lotrinským", kdy: "1736", klic: 1736.0212,
    proc: "Z manželství se narodilo šestnáct dětí, mezi nimi i budoucí císař Josef II." },
  { uroven: 2, co: "Marie Terezie přišla ve válce s Pruskem o většinu Slezska", kdy: "1742", klic: 1742.0611,
    proc: "Pruský král Fridrich II. využil nástupu mladé panovnice a Slezsko zabral." },
  { uroven: 1, co: "Domy dostaly čísla popisná", kdy: "1770", klic: 1770.0,
    proc: "Stát chtěl vědět, kolik má obyvatel — kvůli daním a odvodům vojáků." },
  { uroven: 2, co: "Zrušen jezuitský řád", kdy: "1773", klic: 1773.0,
    proc: "Papež řád zrušil; jeho školy převzal stát." },
  { uroven: 2, co: "Robotní patent omezil robotu", kdy: "1775", klic: 1775.0813,
    proc: "Po selském povstání Marie Terezie stanovila, kolik dní roboty smí pán žádat." },
  { uroven: 2, co: "Josef II. začal rušit kláštery", kdy: "1782", klic: 1782.0,
    proc: "Zrušil kláštery, které neučily ani neléčily; jejich majetek využil stát." },

  { uroven: 3, co: "Pragmatická sankce", kdy: "1713", klic: 1713.0419,
    proc: "Karel VI. zajistil, že po něm může vládnout i dcera — bez toho by Marie Terezie na trůn nemohla." },
  { uroven: 3, co: "Marie Terezie korunována českou královnou v Praze", kdy: "1743", klic: 1743.0512,
    proc: "Korunovace proběhla až poté, co vojska vyhnala z Čech její nepřátele." },
  { uroven: 3, co: "Selské povstání v Čechách", kdy: "jaro 1775", klic: 1775.03,
    proc: "Poddaní se bouřili proti vysoké robotě; povstání vedlo k robotnímu patentu." },
  { uroven: 3, co: "Němčina se stala jediným úředním jazykem", kdy: "1784", klic: 1784.0,
    proc: "Josef II. chtěl jednotnou správu celé říše; čeština z úřadů ustoupila." },
  { uroven: 3, co: "Josef II. zemřel a část reforem musel odvolat", kdy: "1790", klic: 1790.022,
    proc: "Toleranční patent a zrušení nevolnictví ale zůstaly v platnosti." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z doby Marie Terezie a Josefa II.");
}

export const MARIETEREZIEJOSEFIIREFORMY: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-novovek-habsburska-monarchie-marie-terezie-josef-ii-reformy",
    title: "Marie Terezie, Josef II., reformy",
    studentTitle: "Marie Terezie",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Novověk - habsburská monarchie",
    briefDescription: "Pochopíš reformy Marie Terezie a Josefa II.",
    keywords: ["marie terezie", "josef ii", "reformy", "nevolnictví", "toleranční patent", "školní docházka"],
    goals: [
      "Žák uvede hlavní reformy Marie Terezie a Josefa II.",
      "Žák vysvětlí dopad zrušení nevolnictví",
      "Žák porovná přístupy obou panovníků",
    ],
    boundaries: ["Detailní diplomatická jednání", "Válečná taktika slezských válek"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pamatuj: Marie Terezie zavedla školy (1774), Josef II. zrušil nevolnictví (1781).",
      steps: [
        "Marie Terezie 1740–1780: školy, armáda, správa",
        "Josef II. 1780–1790: nevolnictví, tolerance, kláštery",
        "Oba = osvícenský absolutismus",
      ],
      commonMistake: "Zaměňování, kdo co zavedl — školy jsou Terezie, nevolnictví Josef.",
      example: "Toleranční patent 1781 dovolil protestantům v Čechách svobodně věřit.",
    },
  },
];
