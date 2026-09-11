import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných řad. Teď se skládají z banky
// ověřených událostí: L1 tři s datem, L2 čtyři s datem, L3 čtyři bez data.

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "Josef II. zrušil nevolnictví", kdy: "1781", klic: 1781.1101,
    proc: "Lidé se mohli stěhovat a posílat děti na studia — bez toho by obrození nemělo kdo nést." },
  { uroven: 1, co: "Josef Jungmann vydal Slovník česko-německý", kdy: "1834–1839", klic: 1834.5,
    proc: "Pětidílný slovník ukázal, že čeština zvládne vyjádřit i odborné a vědecké myšlenky." },
  { uroven: 1, co: "Zrušení roboty", kdy: "1848", klic: 1848.0907,
    proc: "V revolučním roce 1848 přestali rolníci muset pracovat zadarmo na panském." },
  { uroven: 1, co: "Položen základní kámen Národního divadla", kdy: "1868", klic: 1868.0516,
    proc: "Na stavbu divadla přispívali lidé z celé země sbírkami." },
  { uroven: 1, co: "Národní divadlo se po požáru znovu otevřelo", kdy: "1883", klic: 1883.1118,
    proc: "Po požáru z roku 1881 se divadlo díky nové sbírce postavilo znovu." },

  { uroven: 2, co: "Josef Dobrovský vydal mluvnici češtiny", kdy: "1809", klic: 1809.0,
    proc: "Dobrovský sepsal pravidla českého jazyka — ještě německy, protože tak psali vzdělanci." },
  { uroven: 2, co: "Založeno Národní muzeum", kdy: "1818", klic: 1818.0415,
    proc: "Muzeum mělo sbírat doklady o přírodě a dějinách českých zemí." },
  { uroven: 2, co: "Poprvé zazněla píseň Kde domov můj", kdy: "1834", klic: 1834.1221,
    proc: "Píseň z Tylovy hry Fidlovačka se později stala českou hymnou." },
  { uroven: 2, co: "Karel Havlíček Borovský začal vydávat Národní noviny", kdy: "1848", klic: 1848.0405,
    proc: "Havlíček v novinách kritizoval vládu; za to byl později poslán do vyhnanství." },
  { uroven: 2, co: "Havlíček odvezen do vyhnanství v Brixenu", kdy: "1851", klic: 1851.1216,
    proc: "Vláda se jeho kritiky bála a poslala ho do Tyrol, daleko od čtenářů." },
  { uroven: 1, co: "Božena Němcová vydala Babičku", kdy: "1855", klic: 1855.0,
    proc: "Babička zachytila život na venkově a patří k nejčtenějším českým knihám." },
  { uroven: 2, co: "Založen tělocvičný spolek Sokol", kdy: "1862", klic: 1862.0216,
    proc: "Miroslav Tyrš a Jindřich Fügner chtěli, aby byl národ zdravý a jednotný." },

  { uroven: 3, co: "Marie Terezie zavedla povinnou školní docházku", kdy: "1774", klic: 1774.1206,
    proc: "Víc lidí se naučilo číst — obrozenci měli pro koho psát." },
  { uroven: 3, co: "Nalezen Rukopis královédvorský — později odhalen jako padělek", kdy: "1817", klic: 1817.0916,
    proc: "Václav Hanka ho vydával za starou památku; až koncem 19. století se prokázalo, že je podvržený." },
  { uroven: 3, co: "Založena Matice česká", kdy: "1831", klic: 1831.0,
    proc: "Spolek vydával české knihy, například Jungmannův slovník." },
  { uroven: 3, co: "Slovanský sjezd v Praze", kdy: "červen 1848", klic: 1848.06,
    proc: "František Palacký na něm hájil právo slovanských národů v rakouské říši." },
  { uroven: 3, co: "Národní divadlo vyhořelo", kdy: "1881", klic: 1881.0812,
    proc: "Divadlo shořelo krátce před slavnostním otevřením; lidé hned začali sbírat na nové." },
  { uroven: 3, co: "Pražská univerzita se rozdělila na českou a německou", kdy: "1882", klic: 1882.0,
    proc: "Čeština se stala jazykem vysoké školy — cíl, o který obrozenci usilovali." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z doby národního obrození");
}

export const NARODNIOBROZENIJUNGMANNPALACKYHAVLICEK: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-narodni-obrozeni-a-19-stoleti-narodni-obrozeni-jungmann-palacky-havlicek",
    title: "Národní obrození - Jungmann, Palacký, Havlíček",
    studentTitle: "Národní obrození",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Národní obrození a 19. století",
    briefDescription: "Poznáš obrozence, kteří zachránili český jazyk a kulturu.",
    keywords: ["národní obrození", "jungmann", "palacký", "havlíček", "smetana", "dvořák", "čeština"],
    goals: [
      "Žák vysvětlí příčiny a cíle národního obrození",
      "Žák uvede přínosy Jungmanna, Palackého a Havlíčka",
      "Žák propojí kulturní dílo Smetany a Dvořáka s obrozenectvím",
    ],
    boundaries: ["Detailní jazykovědná analýza slovníku", "Hudební teorie"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Jungmann = slovník, Palacký = dějiny, Havlíček = noviny.",
      steps: [
        "Příčina: germanizace po Bílé hoře",
        "Cíl: obnovit češtinu a českou kulturu",
        "Jungmann: slovník (1835–1839)",
        "Palacký: Dějiny národu českého",
        "Havlíček: Národní noviny, satira, exil v Brixenu",
      ],
      commonMistake: "Zaměňování Komenského (17. stol.) s obrozenci (18.–19. stol.).",
      example: "Palacký byl nazýván 'Otcem národa' za jeho historické dílo.",
    },
  },
];
