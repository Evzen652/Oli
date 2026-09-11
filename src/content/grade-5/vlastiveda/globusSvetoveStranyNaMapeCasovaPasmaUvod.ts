import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { parovani, type Dvojice } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a dvojice sahaly daleko nad rámec 5. ročníku (UTC posuny,
// Mercatorova projekce, geologické mapy) a obsahovaly nepřesnosti. Teď
// banka pojmů glóbus – mapa – světové strany – časová pásma na úrovni RVP.

const DVOJICE: Dvojice[] = [
  { uroven: 1, levy: "glóbus", pravy: "zmenšený model Země ve tvaru koule",
    proc: "Glóbus ukazuje tvar Země věrně, mapa ho musí na ploše zkreslit." },
  { uroven: 1, levy: "rovník", pravy: "kružnice, která dělí Zemi na severní a jižní polokouli",
    proc: "Rovník leží stejně daleko od severního i jižního pólu." },
  { uroven: 1, levy: "sever", pravy: "světová strana, kam ukazuje střelka kompasu",
    proc: "Magnetická střelka se natočí k severu; ostatní strany pak odvodíš." },
  { uroven: 1, levy: "legenda mapy", pravy: "vysvětlivky značek a barev",
    proc: "V legendě zjistíš, co znamená která značka a barva." },
  { uroven: 1, levy: "měřítko mapy", pravy: "údaj, kolikrát je skutečnost na mapě zmenšená",
    proc: "Podle měřítka převedeš vzdálenost na mapě na skutečnou." },
  { uroven: 1, levy: "modrá barva na mapě", pravy: "vodstvo — moře, řeky a jezera",
    proc: "Na zeměpisných mapách se voda kreslí vždy modře." },

  { uroven: 2, levy: "poledník", pravy: "čára spojující severní a jižní pól",
    proc: "Poledníky se sbíhají v pólech; podle nich se určuje zeměpisná délka." },
  { uroven: 2, levy: "rovnoběžka", pravy: "kružnice, která vede souběžně s rovníkem",
    proc: "Rovnoběžky se k pólům zmenšují; podle nich se určuje zeměpisná šířka." },
  { uroven: 2, levy: "nultý poledník", pravy: "poledník, který prochází Greenwichí v Londýně",
    proc: "Od nultého poledníku se počítá zeměpisná délka na východ a na západ." },
  { uroven: 2, levy: "hnědá barva na mapě", pravy: "hory a vysoko položená místa",
    proc: "Čím tmavší hnědá, tím vyšší nadmořská výška." },
  { uroven: 2, levy: "zelená barva na mapě", pravy: "nížiny",
    proc: "Zeleně se kreslí nízko položená místa, například okolí velkých řek." },
  { uroven: 2, levy: "kompas", pravy: "přístroj s magnetickou střelkou",
    proc: "Střelku natáčí magnetické pole Země." },
  { uroven: 2, levy: "Polárka", pravy: "hvězda, podle které se v noci najde sever",
    proc: "Polárka stojí na obloze téměř přesně nad severním pólem." },

  { uroven: 3, levy: "časové pásmo", pravy: "oblast Země, kde platí stejný čas",
    proc: "Země se otáčí, a proto je v různých místech různě hodin; pásma to sjednocují." },
  { uroven: 3, levy: "zeměpisná šířka", pravy: "jak daleko na sever nebo na jih od rovníku místo leží",
    proc: "Určuje se ve stupních podle rovnoběžek; rovník má 0°." },
  { uroven: 3, levy: "zeměpisná délka", pravy: "jak daleko na východ nebo na západ od nultého poledníku místo leží",
    proc: "Určuje se ve stupních podle poledníků." },
  { uroven: 3, levy: "datová hranice", pravy: "čára v Tichém oceánu, na které se mění datum",
    proc: "Kdo ji překročí, posune se v kalendáři o den dopředu nebo dozadu." },
  { uroven: 3, levy: "měřítko 1 : 100 000", pravy: "1 cm na mapě je 1 km ve skutečnosti",
    proc: "100 000 cm je 1 000 m, tedy 1 km." },
  { uroven: 3, levy: "polední Slunce", pravy: "Slunce, které u nás stojí nejvýš a na jihu",
    proc: "Na severní polokouli je Slunce v poledne na jihu — podle toho se dá určit sever." },
];

function gen(level: number): PracticeTask[] {
  return parovani(DVOJICE, level, "Spoj pojem s tím, co znamená.");
}

export const GLOBUSSVETOVESTRANYNAMAPECASOVAPASMAUVOD: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-globus-svetove-strany-na-mape-casova-pasma-uvod",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-globus-svetove-strany-na-mape-casova-pasma-uvod",
    title: "Glóbus, světové strany na mapě, časová pásma (úvod)",
    studentTitle: "Glóbus a mapy",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Pochopíš, jak se orientovat na mapě a glóbusu.",
    keywords: ["glóbus", "mapa", "rovnoběžky", "poledníky", "světové strany", "časová pásma", "rovník"],
    goals: [
      "Žák vysvětlí rozdíl mezi glóbusem a mapou",
      "Žák zná rovnoběžky, poledníky a světové strany",
      "Žák pochopí princip časových pásem",
    ],
    boundaries: ["Matematika kartografických projekcí", "GPS technologie"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Rovnoběžky vedou souběžně s rovníkem (zeměpisná šířka), poledníky od pólu k pólu (zeměpisná délka).",
      steps: [
        "Glóbus = kulatý model Země",
        "Rovnoběžky = vodorovné čáry (zeměpisná šířka, 0°–90°)",
        "Poledníky = svislé čáry (zeměpisná délka, 0°–180°)",
        "Časové pásmo = oblast se stejným časem; sousední pásma se liší o hodinu",
        "Světové strany: sever, jih, východ, západ",
      ],
      commonMistake: "Záměna rovnoběžek (vodorovné) a poledníků (svislé).",
      example: "Praha leží asi na 14° východní délky, proto u nás platí středoevropský čas.",
    },
  },
];
