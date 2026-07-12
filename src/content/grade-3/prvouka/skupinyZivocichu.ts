import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), match_pairs (4 páry/úloha).
//   L1 = rozpoznání: nejběžnější/prototypická zvířata, žádné záludnosti
//   L2 = aplikace:   méně běžná, ale standardní zvířata téže skupiny
//   L3 = transfer:   typické miskoncepce (netopýr, slepýš, tučňák, mlok, úhoř —
//                    zvířata, která vypadají/chovají se zavádějícím způsobem)
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "pes", right: "savec" },
      { left: "kapr", right: "ryba" },
      { left: "sýkora", right: "pták" },
      { left: "žába", right: "obojživelník" },
    ],
    hints: [
      "Savci mají srst a kojí mláďata.",
      "Ryby žijí ve vodě a dýchají žábrami.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "kráva", right: "savec" },
      { left: "štika", right: "ryba" },
      { left: "čáp", right: "pták" },
      { left: "ještěrka", right: "plaz" },
    ],
    hints: [
      "Ptáci mají peří a zobák.",
      "Plazi mají šupiny a jsou studenokrevní.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "liška", right: "savec" },
      { left: "moucha", right: "hmyz" },
      { left: "holub", right: "pták" },
      { left: "had", right: "plaz" },
    ],
    hints: [
      "Hmyz má 6 noh a 3 části těla.",
      "Had nemá nohy, ale patří mezi plazy.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "kočka", right: "savec" },
      { left: "mravenec", right: "hmyz" },
      { left: "kachna", right: "pták" },
      { left: "ropucha", right: "obojživelník" },
    ],
    hints: [
      "Savci kojí mláďata mlékem.",
      "Obojživelníci žijí mládí ve vodě, dospělí i na souši.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "kůň", right: "savec" },
      { left: "motýl", right: "hmyz" },
      { left: "vrabec", right: "pták" },
      { left: "pstruh", right: "ryba" },
    ],
    hints: [
      "Motýl má 6 noh — je to hmyz.",
      "Vrabec má peří a zobák — je to pták.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "ovce", right: "savec" },
      { left: "včela", right: "hmyz" },
      { left: "husa", right: "pták" },
      { left: "želva", right: "plaz" },
    ],
    hints: [
      "Včela má 6 noh a 3 části těla — je to hmyz.",
      "Želva má krunýř a je studenokrevní — je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "zajíc", right: "savec" },
      { left: "beruška", right: "hmyz" },
      { left: "kos", right: "pták" },
      { left: "žába", right: "obojživelník" },
    ],
    hints: [
      "Beruška má 6 noh — je to hmyz.",
      "Žába žije mládí ve vodě jako pulec, dospělá i na souši.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "medvěd", right: "savec" },
      { left: "candát", right: "ryba" },
      { left: "slepice", right: "pták" },
      { left: "had", right: "plaz" },
    ],
    hints: [
      "Medvěd má srst a kojí mláďata — je to savec.",
      "Candát dýchá žábrami — je to ryba.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "koza", right: "savec" },
      { left: "moucha", right: "hmyz" },
      { left: "orel", right: "pták" },
      { left: "ještěrka", right: "plaz" },
    ],
    hints: [
      "Koza má srst a kojí mláďata — je to savec.",
      "Orel má peří a zobák — je to pták.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "vlk", right: "savec" },
      { left: "losos", right: "ryba" },
      { left: "labuť", right: "pták" },
      { left: "ropucha", right: "obojživelník" },
    ],
    hints: [
      "Losos dýchá žábrami — je to ryba.",
      "Labuť má peří a zobák — je to pták.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "prase", right: "savec" },
      { left: "mravenec", right: "hmyz" },
      { left: "čáp", right: "pták" },
      { left: "krokodýl", right: "plaz" },
    ],
    hints: [
      "Prase má srst a kojí mláďata — je to savec.",
      "Krokodýl má šupiny a je studenokrevní — je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "myš", right: "savec" },
      { left: "motýl", right: "hmyz" },
      { left: "kachna", right: "pták" },
      { left: "kapr", right: "ryba" },
    ],
    hints: [
      "Myš má srst a kojí mláďata — je to savec.",
      "Kapr dýchá žábrami a má šupiny — je to ryba.",
    ],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "jezevec", right: "savec" },
      { left: "sumec", right: "ryba" },
      { left: "rorýs", right: "pták" },
      { left: "čolek", right: "obojživelník" },
    ],
    hints: [
      "Jezevec má srst a kojí mláďata — je to savec.",
      "Čolek žije mládí ve vodě, dospělý i na souši — je to obojživelník.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "vydra", right: "savec" },
      { left: "lín", right: "ryba" },
      { left: "vlaštovka", right: "pták" },
      { left: "gekon", right: "plaz" },
    ],
    hints: [
      "Vydra má srst a kojí mláďata — je to savec.",
      "Gekon má šupiny a je studenokrevní — je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "hroch", right: "savec" },
      { left: "plotice", right: "ryba" },
      { left: "sova", right: "pták" },
      { left: "rosnička", right: "obojživelník" },
    ],
    hints: [
      "Hroch má srst (řídkou) a kojí mláďata — je to savec.",
      "Rosnička žije mládí ve vodě jako pulec — je to obojživelník.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "ježek", right: "savec" },
      { left: "okoun", right: "ryba" },
      { left: "straka", right: "pták" },
      { left: "chameleón", right: "plaz" },
    ],
    hints: [
      "Ježek má i pod bodlinami srst — je to savec.",
      "Chameleón má šupiny a je studenokrevní — je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "rys", right: "savec" },
      { left: "brouk", right: "hmyz" },
      { left: "datel", right: "pták" },
      { left: "varan", right: "plaz" },
    ],
    hints: [
      "Brouk má 6 noh a 3 části těla — je to hmyz.",
      "Varan má šupiny a je studenokrevní — je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "kuna", right: "savec" },
      { left: "cvrček", right: "hmyz" },
      { left: "volavka", right: "pták" },
      { left: "blatnice", right: "obojživelník" },
    ],
    hints: [
      "Cvrček má 6 noh — je to hmyz.",
      "Blatnice žije mládí ve vodě, dospělá i na souši — je to obojživelník.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "los", right: "savec" },
      { left: "komár", right: "hmyz" },
      { left: "sova", right: "pták" },
      { left: "užovka", right: "plaz" },
    ],
    hints: [
      "Komár má 6 noh — je to hmyz.",
      "Užovka nemá nohy, ale patří mezi plazy.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "srnec", right: "savec" },
      { left: "světluška", right: "hmyz" },
      { left: "rorýs", right: "pták" },
      { left: "zmije", right: "plaz" },
    ],
    hints: [
      "Světluška má 6 noh — je to hmyz.",
      "Zmije nemá nohy, ale patří mezi plazy.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "jezevec", right: "savec" },
      { left: "vážka", right: "hmyz" },
      { left: "straka", right: "pták" },
      { left: "krajta", right: "plaz" },
    ],
    hints: [
      "Vážka má 6 noh a 3 části těla — je to hmyz.",
      "Krajta nemá nohy, ale patří mezi plazy stejně jako had.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "vydra", right: "savec" },
      { left: "sumec", right: "ryba" },
      { left: "vlaštovka", right: "pták" },
      { left: "kuňka", right: "obojživelník" },
    ],
    hints: [
      "Sumec dýchá žábrami — je to ryba.",
      "Kuňka žije mládí ve vodě, dospělá i na souši — je to obojživelník.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "hroch", right: "savec" },
      { left: "brouk", right: "hmyz" },
      { left: "datel", right: "pták" },
      { left: "gekon", right: "plaz" },
    ],
    hints: [
      "Datel má peří a zobák — je to pták.",
      "Gekon má šupiny a je studenokrevní — je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "ježek", right: "savec" },
      { left: "cvrček", right: "hmyz" },
      { left: "volavka", right: "pták" },
      { left: "rosnička", right: "obojživelník" },
    ],
    hints: [
      "Volavka má peří a zobák — je to pták.",
      "Rosnička žije mládí ve vodě jako pulec — je to obojživelník.",
    ],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "netopýr", right: "savec" },
      { left: "tučňák", right: "pták" },
      { left: "kapr", right: "ryba" },
      { left: "žába", right: "obojživelník" },
    ],
    hints: [
      "Netopýr létá, ale má srst a kojí mláďata mlékem — je to savec.",
      "Tučňák neumí létat, ale má peří a zobák — je to pták.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "slepýš", right: "plaz" },
      { left: "mlok", right: "obojživelník" },
      { left: "pes", right: "savec" },
      { left: "sýkora", right: "pták" },
    ],
    hints: [
      "Slepýš vypadá jako had, ale má víčka a je to plaz s nepatrnými nožkami.",
      "Mlok žije mládí ve vodě, dospělý i na souši — je to obojživelník, ne plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "netopýr", right: "savec" },
      { left: "úhoř", right: "ryba" },
      { left: "had", right: "plaz" },
      { left: "moucha", right: "hmyz" },
    ],
    hints: [
      "Netopýr má srst a kojí mláďata — je to savec, i když létá.",
      "Úhoř vypadá jako had, ale dýchá žábrami a žije ve vodě — je to ryba.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "tučňák", right: "pták" },
      { left: "slepýš", right: "plaz" },
      { left: "kráva", right: "savec" },
      { left: "včela", right: "hmyz" },
    ],
    hints: [
      "Tučňák má peří a zobák, i když neumí létat — je to pták.",
      "Slepýš nemá nohy jako had, ale je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "mlok", right: "obojživelník" },
      { left: "netopýr", right: "savec" },
      { left: "štika", right: "ryba" },
      { left: "ještěrka", right: "plaz" },
    ],
    hints: [
      "Mlok vypadá jako ještěrka, ale je to obojživelník, ne plaz.",
      "Netopýr kojí mláďata mlékem — je to savec.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "slepýš", right: "plaz" },
      { left: "tučňák", right: "pták" },
      { left: "žába", right: "obojživelník" },
      { left: "liška", right: "savec" },
    ],
    hints: [
      "Slepýš je beznohý plaz, ne had.",
      "Tučňák je pták, i když plave a neumí létat.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "netopýr", right: "savec" },
      { left: "mlok", right: "obojživelník" },
      { left: "kos", right: "pták" },
      { left: "mravenec", right: "hmyz" },
    ],
    hints: [
      "Netopýr je jediný létající savec.",
      "Mlok žije mládí ve vodě, dospělý na souši — je to obojživelník.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "úhoř", right: "ryba" },
      { left: "slepýš", right: "plaz" },
      { left: "tučňák", right: "pták" },
      { left: "kůň", right: "savec" },
    ],
    hints: [
      "Úhoř dýchá žábrami — je to ryba, i když vypadá jako had.",
      "Slepýš má víčka jako ještěrka — je to plaz.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "netopýr", right: "savec" },
      { left: "tučňák", right: "pták" },
      { left: "čolek", right: "obojživelník" },
      { left: "had", right: "plaz" },
    ],
    hints: [
      "Netopýr má srst a kojí mláďata — je to savec.",
      "Čolek žije mládí ve vodě, dospělý i na souši — je to obojživelník.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "mlok", right: "obojživelník" },
      { left: "slepýš", right: "plaz" },
      { left: "veverka", right: "savec" },
      { left: "vrabec", right: "pták" },
    ],
    hints: [
      "Mlok vypadá jako plaz, ale je to obojživelník.",
      "Slepýš nemá nohy, ale je to plaz, ne had.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "netopýr", right: "savec" },
      { left: "úhoř", right: "ryba" },
      { left: "tučňák", right: "pták" },
      { left: "motýl", right: "hmyz" },
    ],
    hints: [
      "Netopýr létá, ale kojí mláďata mlékem — je to savec.",
      "Úhoř žije ve vodě a dýchá žábrami — je to ryba.",
    ],
  },
  {
    question: "Spoj každé zvíře se správnou skupinou živočichů.",
    correctAnswer: "match",
    pairs: [
      { left: "slepýš", right: "plaz" },
      { left: "mlok", right: "obojživelník" },
      { left: "moucha", right: "hmyz" },
      { left: "holub", right: "pták" },
    ],
    hints: [
      "Slepýš je beznohý plaz, ne had.",
      "Mlok je obojživelník, i když vypadá jako ještěrka.",
    ],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const SKUPINYZIVOCICHU: TopicMetadata[] = [
  {
    id: "g3-prvouka-rozmanitost-prirody-rostliny-a-zivocichove-skupiny-zivocichu-savci-ptaci-ryby-plazi-obojzivelnici-hmyz",
    title: "Skupiny živočichů",
    studentTitle: "Zvířata a jejich skupiny",
    subject: "prvouka",
    category: "Rozmanitost přírody",
    topic: "Rostliny a živočichové",
    briefDescription: "Roztřídíš zvířata do skupin podle jejich znaků.",
    keywords: [
      "skupiny živočichů",
      "třídění zvířat",
      "savec",
      "savci",
      "pták",
      "ptáci",
      "ryba",
      "ryby",
      "plaz",
      "plazi",
      "obojživelník",
      "obojživelníci",
      "hmyz",
      "srst",
      "peří",
      "šupiny",
      "žábry",
      "obratlovci",
    ],
    goals: [
      "Roztřídit zvířata do skupin: savci, ptáci, ryby, plazi, obojživelníci, hmyz.",
      "Poznat skupinu živočicha podle typických znaků (srst, peří, šupiny, žábry).",
      "Přiřadit konkrétní zvíře ke správné skupině.",
    ],
    boundaries: [
      "Šest základních skupin pro 3. třídu — bez podrobné systematiky.",
      "Bez latinských názvů a detailní anatomie.",
      "Hmyz jako zástupce bezobratlých, ostatní skupiny jsou obratlovci.",
    ],
    gradeRange: [3, 3],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Savci mají srst a kojí mláďata. Ptáci mají peří a zobák. Ryby mají šupiny a dýchají žábrami. Plazi mají šupiny a jsou studenokrevní. Obojživelníci žijí ve vodě i na souši. Hmyz má 6 noh a 3 části těla.",
      steps: [
        "Podívej se na tělo zvířete — má srst, peří, nebo šupiny?",
        "Srst + kojí mláďata = savec. Peří + zobák = pták.",
        "Šupiny + žábry + žije ve vodě = ryba. Šupiny + studenokrevný = plaz.",
        "Žije ve vodě i na souši = obojživelník. 6 noh a 3 části těla = hmyz.",
      ],
      commonMistake:
        "Netopýr létá, ale je to savec (má srst). Slepýš vypadá jako had, ale je to plaz. Čolek a mlok jsou obojživelníci, ne plazi.",
      example:
        "Pes = savec (srst), kapr = ryba (žábry), sova = pták (peří), had = plaz (šupiny), žába = obojživelník, motýl = hmyz.",
    },
  },
];
