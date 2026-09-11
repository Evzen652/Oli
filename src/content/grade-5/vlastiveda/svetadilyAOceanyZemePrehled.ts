import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { parovani, type Dvojice } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a dvojice obsahovaly chyby a překlepy („Nejteplotplejší
// kontinent“, dvě různé průměrné teploty Antarktidy, deskovou tektoniku).
// Teď banka světadílů, oceánů a jejich nejznámějších míst s jednoznačnými popisy.

const DVOJICE: Dvojice[] = [
  { uroven: 1, levy: "Asie", pravy: "největší a nejlidnatější světadíl",
    proc: "V Asii leží Čína a Indie, země s nejvíce obyvateli." },
  { uroven: 1, levy: "Afrika", pravy: "světadíl s největší pouští Sahara",
    proc: "Sahara zabírá velkou část severní Afriky." },
  { uroven: 1, levy: "Antarktida", pravy: "ledový světadíl kolem jižního pólu",
    proc: "Antarktida je pokrytá ledem a žijí na ní jen vědci na stanicích." },
  { uroven: 1, levy: "Austrálie", pravy: "nejmenší světadíl",
    proc: "Austrálie je tak velká, že tvoří celý světadíl, a žije v ní klokan." },
  { uroven: 1, levy: "Evropa", pravy: "světadíl, na kterém leží Česko",
    proc: "Evropa tvoří s Asií jednu pevninu — Eurasii." },
  { uroven: 1, levy: "Tichý oceán", pravy: "největší oceán",
    proc: "Tichý oceán je větší než všechna pevnina Země dohromady." },

  { uroven: 2, levy: "Atlantský oceán", pravy: "oceán mezi Evropou a Amerikou",
    proc: "Přes Atlantský oceán se roku 1492 plavil Kryštof Kolumbus." },
  { uroven: 2, levy: "Indický oceán", pravy: "oceán mezi Afrikou, Asií a Austrálií",
    proc: "Je to nejteplejší oceán." },
  { uroven: 2, levy: "Severní ledový oceán", pravy: "oceán kolem severního pólu",
    proc: "Velkou část roku je pokrytý mořským ledem." },
  { uroven: 2, levy: "Jižní Amerika", pravy: "světadíl, kde leží Brazílie a Argentina",
    proc: "Jižní Amerikou protéká Amazonka." },
  { uroven: 2, levy: "Severní Amerika", pravy: "světadíl, kde leží USA a Kanada",
    proc: "Patří k němu i Mexiko a ostrov Grónsko." },
  { uroven: 2, levy: "Mount Everest", pravy: "nejvyšší hora světa",
    proc: "Mount Everest (8 849 m) leží v Himálaji na hranici Nepálu a Číny." },

  { uroven: 3, levy: "Himálaj", pravy: "nejvyšší pohoří světa",
    proc: "V Himálaji je všech deset nejvyšších hor Země." },
  { uroven: 3, levy: "Kilimandžáro", pravy: "nejvyšší hora Afriky",
    proc: "Kilimandžáro je vyhaslá sopka v Tanzanii se sněhem na vrcholu." },
  { uroven: 3, levy: "Nil", pravy: "dlouhá řeka, která teče Afrikou do Středozemního moře",
    proc: "Na březích Nilu vznikla civilizace starověkého Egypta." },
  { uroven: 3, levy: "Amazonka", pravy: "řeka, která teče největším deštným pralesem",
    proc: "Amazonka je nejvodnatější řeka světa." },
  { uroven: 3, levy: "Mariánský příkop", pravy: "nejhlubší místo oceánů",
    proc: "Leží v Tichém oceánu a je hluboký přes 10 km." },
  { uroven: 3, levy: "Grónsko", pravy: "největší ostrov světa",
    proc: "Grónsko je z velké části pokryté ledovcem." },
  { uroven: 3, levy: "Oceánie", pravy: "tisíce ostrovů v Tichém oceánu kolem Austrálie",
    proc: "Patří k nim například Nový Zéland." },
];

function gen(level: number): PracticeTask[] {
  return parovani(DVOJICE, level, "Spoj světadíl, oceán nebo místo s tím, co o něm platí.");
}

export const SVETADILYAOCEANYZEMEPREHLED: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-svetadily-a-oceany-zeme-prehled",
    title: "Světadíly a oceány Země - přehled",
    studentTitle: "Světadíly a oceány",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš všechny světadíly a oceány naší planety.",
    keywords: ["světadíly", "oceány", "asie", "afrika", "tichý oceán", "atlantský oceán", "antarktida", "australie"],
    goals: [
      "Žák jmenuje 7 světadílů a 5 oceánů",
      "Žák uvede největší a nejmenší světadíl a oceán",
      "Žák umístí světadíly na mapu světa",
    ],
    boundaries: ["Politická geografie světa", "Detailní fyzická geografie kontinentů"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Světadíly: Evropa, Asie, Afrika, Severní a Jižní Amerika, Austrálie a Oceánie, Antarktida. Oceány: Tichý, Atlantský, Indický, Severní ledový a Jižní.",
      steps: [
        "Světadíly: Evropa, Asie, Afrika, Severní Amerika, Jižní Amerika, Austrálie a Oceánie, Antarktida",
        "Oceány: Tichý (největší), Atlantský, Indický, Severní ledový (nejmenší), Jižní",
        "Největší světadíl: Asie",
        "Nejmenší světadíl: Austrálie",
      ],
      commonMistake: "Zapomínání Jižního (Antarktického) oceánu — nejnověji uznaný z pěti oceánů.",
      example: "Tichý oceán je největší — pokrývá třetinu povrchu Země.",
    },
  },
];
