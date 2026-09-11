import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { trideni, type Zarazeni } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných sad. Teď banka živočichů: L1 běžní
// zástupci, L2 živočichové, kteří klamou vzhledem (netopýr, velryba, tučňák),
// L3 méně známí a zrádní (slepýš, ptakopysk, mořský koník).

const Z: Zarazeni[] = [
  { uroven: 1, polozka: "pes", skupina: "savci", proc: "Pes rodí živá mláďata a kojí je mlékem." },
  { uroven: 1, polozka: "kůň", skupina: "savci", proc: "Kůň má srst a hříbě pije mateřské mléko." },
  { uroven: 1, polozka: "srnec", skupina: "savci", proc: "Srnčí mláďata sají mléko matky." },
  { uroven: 1, polozka: "vrabec", skupina: "ptáci", proc: "Vrabec má peří, zobák a snáší vejce." },
  { uroven: 1, polozka: "kachna", skupina: "ptáci", proc: "Kachna má peří a křídla a snáší vejce." },
  { uroven: 1, polozka: "sýkora", skupina: "ptáci", proc: "Sýkora má peří a zobák." },
  { uroven: 1, polozka: "ještěrka", skupina: "plazi", proc: "Ještěrka má suchou šupinatou kůži." },
  { uroven: 1, polozka: "užovka", skupina: "plazi", proc: "Užovka je had — plaz se šupinami." },
  { uroven: 1, polozka: "skokan", skupina: "obojživelníci", proc: "Skokan žije ve vodě i na souši a z vajíček se líhnou pulci." },
  { uroven: 1, polozka: "kapr", skupina: "ryby", proc: "Kapr dýchá žábrami a má ploutve." },
  { uroven: 1, polozka: "pstruh", skupina: "ryby", proc: "Pstruh žije ve vodě a dýchá žábrami." },

  { uroven: 2, polozka: "netopýr", skupina: "savci", proc: "Netopýr létá, ale rodí živá mláďata a kojí je — je to savec." },
  { uroven: 2, polozka: "velryba", skupina: "savci", proc: "Velryba žije v moři, ale dýchá plícemi a kojí mláďata." },
  { uroven: 2, polozka: "delfín", skupina: "savci", proc: "Delfín se musí nadechovat nad hladinou a kojí mláďata." },
  { uroven: 2, polozka: "tučňák", skupina: "ptáci", proc: "Tučňák neumí létat, ale má peří a snáší vejce." },
  { uroven: 2, polozka: "pštros", skupina: "ptáci", proc: "Pštros je největší pták — nelétá, ale má peří." },
  { uroven: 2, polozka: "želva", skupina: "plazi", proc: "Želva má krunýř a šupinatou kůži a klade vejce na souši." },
  { uroven: 2, polozka: "krokodýl", skupina: "plazi", proc: "Krokodýl žije u vody, ale je to plaz se šupinami." },
  { uroven: 2, polozka: "mlok", skupina: "obojživelníci", proc: "Mlok vypadá jako ještěrka, ale má vlhkou kůži bez šupin." },
  { uroven: 2, polozka: "čolek", skupina: "obojživelníci", proc: "Čolek se rozmnožuje ve vodě, jeho larvy dýchají žábrami." },
  { uroven: 2, polozka: "žralok", skupina: "ryby", proc: "Žralok dýchá žábrami a má ploutve." },

  { uroven: 3, polozka: "ježek", skupina: "savci", proc: "Ježek má bodliny místo srsti, ale kojí mláďata." },
  { uroven: 3, polozka: "ptakopysk", skupina: "savci", proc: "Ptakopysk klade vejce, ale mláďata kojí — proto patří k savcům." },
  { uroven: 3, polozka: "slepýš", skupina: "plazi", proc: "Slepýš není had ani červ, je to beznohá ještěrka." },
  { uroven: 3, polozka: "kuňka", skupina: "obojživelníci", proc: "Kuňka je malá žába s pestrým bříškem." },
  { uroven: 3, polozka: "ropucha", skupina: "obojživelníci", proc: "Ropucha má bradavičnatou kůži, ale kladou vajíčka do vody." },
  { uroven: 3, polozka: "mořský koník", skupina: "ryby", proc: "Mořský koník vypadá zvláštně, ale dýchá žábrami — je to ryba." },
  { uroven: 3, polozka: "úhoř", skupina: "ryby", proc: "Úhoř vypadá jako had, ale je to ryba s žábrami." },
  { uroven: 3, polozka: "kiwi", skupina: "ptáci", proc: "Kiwi nelétá a jeho peří připomíná srst, přesto je to pták." },
];

function gen(level: number): PracticeTask[] {
  return trideni(Z, level, "Roztřiď živočichy do skupin obratlovců.");
}

export const OBRATLOVCISAVCIPTACIPLAZIOBOJZIVELNICIRYBY: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby",
    title: "Obratlovci - savci, ptáci, plazi, obojživelníci, ryby",
    studentTitle: "Skupiny obratlovců",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš 5 skupin obratlovců a jejich hlavní znaky.",
    keywords: ["obratlovci", "savci", "ptáci", "plazi", "obojživelníci", "ryby", "teplokrevní", "studenokrevní"],
    goals: ["Vyjmenovat 5 skupin obratlovců", "Popsat hlavní znaky každé skupiny", "Zařadit konkrétní živočichy do správné skupiny"],
    boundaries: ["Neprobírá fylogenetiku obratlovců", "Neprobírá anatomii do hloubky"],
    gradeRange: [5, 5],
    inputType: "categorize",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "5 skupin: ryby (žábry), obojživelníci (voda+souš), plazi (šupiny, studenokrevní), ptáci (peří), savci (srst, mléko).",
      steps: [
        "Ryby: žábry, ploutve, šupiny, voda.",
        "Obojživelníci: larvy ve vodě, dospělci i na souši.",
        "Plazi: šupiny, studenokrevní, suchá kůže.",
        "Ptáci: peří, teplokrevní, vejce.",
        "Savci: srst, teplokrevní, kojení mlékem.",
      ],
      commonMistake: "Velryba je SAVEC (kojí mlékem), ne ryba. Delfín také.",
      example: "Žába = obojživelník. Had = plaz. Holub = pták. Pes = savec.",
    },
  },
];
