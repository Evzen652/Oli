import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původní pool měl chybné klíče
// („Dostal ___znamení“ → „vý“ dává neexistující „významení“), rozbité věty
// („Chlapec ___klidnil se postupně“ s klíčem „u“), nepřirozená spojení
// („vystřelil gól“ místo „vstřelil gól“) a pravidlo „vý- = přízvučná
// slabika“, které dítěti nic neřekne. Věty, kde by šly dvě předpony
// (vyletěl × vzlétl na střechu), tu nejsou — doplňovačka má jeden klíč.
//
// L1 = vy- × vý- (sloveso × jméno); možnosti jen sporný grafém (vy/vý/vi/ví)
// L2 = s- × z- × vz- podle významu
// L3 = všechno dohromady včetně výjimky zvednout.

type Klic = "vy" | "vý" | "s" | "z" | "vz";
type Vyznam = "sloveso" | "jméno" | "ven" | "dolů" | "dohromady" | "nahoru" | "změna";

const POPIS: Record<Vyznam, string> = {
  sloveso: "sloveso (co kdo dělá)",
  jméno: "podstatné nebo přídavné jméno",
  ven: "pohyb ven nebo dokončení děje",
  dolů: "pohyb dolů",
  dohromady: "spojení dohromady",
  nahoru: "pohyb nahoru",
  změna: "změnu stavu nebo vlastnosti",
};

const PRAVIDLO: Record<string, string> = {
  "vy-": "Krátké vy- mají slovesa: vyletět, vyhrát. Znamená pohyb ven nebo dokončení.",
  "vý-": "Dlouhé vý- mají hlavně podstatná a přídavná jména: výlet, výborný.",
  "vi-": "Předpona vi- v češtině neexistuje — v předponě je po v vždy y.",
  "ví-": "Předpona ví- v češtině neexistuje — v předponě je po v vždy y nebo ý.",
  "s-": "S- znamená pohyb dolů nebo spojení dohromady: sjet, slepit.",
  "z-": "Z- znamená, že se něco mění — stav, barva, vlastnost: zčervenat, zlepšit.",
  "vz-": "Vz- znamená pohyb nahoru: vzlétnout, vznést se.",
};

function uloha(veta: string, klic: Klic, slovo: string, vyznam: Vyznam, options: string[], vyjimka?: string): PracticeTask {
  const correct = `${klic}-`;
  const zbytek = veta.split("___")[1].split(/[\s,.!?]/)[0];
  const optionFeedback: Record<string, string> = {};
  for (const o of options) if (o !== correct) optionFeedback[o] = `${PRAVIDLO[o]} „${slovo}“ ale vyjadřuje ${POPIS[vyznam]}.`;
  if (vyjimka) for (const o of options) if (o !== correct) optionFeedback[o] = vyjimka;
  return {
    question: `Doplň správnou předponu: „${veta}“`,
    correctAnswer: correct,
    options,
    blanks: [klic],
    optionFeedback,
    hints: vyznam === "sloveso" || vyznam === "jméno"
      ? [
          `Je slovo „…${zbytek}“ po doplnění sloveso (co kdo dělá), nebo jméno věci či vlastnosti?`,
          `Slovesa mají předponu s krátkým y (vyletět, vyhrát), podstatná a přídavná jména většinou s dlouhým ý (výlet, výborný). Po v v předponě nikdy nepíšeme i. Co znamená „…${zbytek}“?`,
        ]
      : [
          `Co v této větě znamená „…${zbytek}“: pohyb ven, dolů, nahoru, spojení, nebo změnu?`,
          `Pohyb dolů nebo spojení dohromady má jednu předponu, pohyb nahoru jinou a změna stavu zase jinou. Představ si, co se ve větě se slovem „…${zbytek}“ opravdu děje.`,
        ],
    explanation: vyjimka
      ? `Správně je „${slovo}“. ${vyjimka}`
      : `Správně je „${slovo}“: slovo vyjadřuje ${POPIS[vyznam]}. ${PRAVIDLO[correct]}`,
  };
}

const VY = ["vy-", "vý-", "vi-", "ví-"];
const SZ = ["s-", "z-", "vz-"];
const VSE = ["vy-", "s-", "z-", "vz-"];

const L1: PracticeTask[] = ([
  ["Ptáček ___letěl z klece.", "vy", "vyletěl", "sloveso"],
  ["Dostali jsme ___bornou zmrzlinu.", "vý", "výbornou", "jméno"],
  ["Kočka ___lezla na strom.", "vy", "vylezla", "sloveso"],
  ["Tomáš získal ___hru v soutěži.", "vý", "výhru", "jméno"],
  ["Na ___letě jsme viděli zámek.", "vý", "výletě", "jméno"],
  ["Žába ___skočila z vody.", "vy", "vyskočila", "sloveso"],
  ["Petr ___hrál závod.", "vy", "vyhrál", "sloveso"],
  ["Z okna je krásný ___hled.", "vý", "výhled", "jméno"],
  ["Paní učitelka nám ___světlila úlohu.", "vy", "vysvětlila", "sloveso"],
  ["Jedeme ___tahem do pátého patra.", "vý", "výtahem", "jméno"],
  ["Mravenci ___lezli z mraveniště.", "vy", "vylezli", "sloveso"],
  ["Tatínek má ___borné nápady.", "vý", "výborné", "jméno"],
  ["Kluci ___běhli ven.", "vy", "vyběhli", "sloveso"],
] as [string, Klic, string, Vyznam][]).map(([v, k, s, z]) => uloha(v, k, s, z, VY));

const L2: PracticeTask[] = ([
  ["Lyžař ___jel z kopce.", "s", "sjel", "dolů"],
  ["Přátelé ___pojili síly.", "s", "spojili", "dohromady"],
  ["Slza mu ___tekla po tváři.", "s", "stekla", "dolů"],
  ["Listí na podzim ___žloutlo.", "z", "zžloutlo", "změna"],
  ["Mléko v teple ___kyslo.", "z", "zkyslo", "změna"],
  ["Letadlo ___létlo k obloze.", "vz", "vzlétlo", "nahoru"],
  ["Balón se ___nesl vysoko.", "vz", "vznesl", "nahoru"],
  ["Kameny ___padaly ze skály.", "s", "spadaly", "dolů"],
  ["Voda v kaluži ___mrzla.", "z", "zmrzla", "změna"],
  ["Potoky se ___lévají do řeky.", "s", "slévají", "dohromady"],
  ["Tomáš leknutím ___bledl.", "z", "zbledl", "změna"],
  ["Auto se ___razilo s dodávkou.", "s", "srazilo", "dohromady"],
  ["Po nemoci babička ___hubla.", "z", "zhubla", "změna"],
] as [string, Klic, string, Vyznam][]).map(([v, k, s, z]) => uloha(v, k, s, z, SZ));

const L3: PracticeTask[] = [
  uloha("Petr ___vedl těžkou krabici.", "z", "zvedl", "nahoru", VSE,
    "„Zvednout“ je výjimka: znamená sice pohyb nahoru, ale píše se se z-. Stejně zvedat, zvednutý."),
  ...([
    ["Babička ___pomínala na mládí.", "vz", "vzpomínala", "nahoru"],
    ["Holčička ___pracovala úkol sama.", "vy", "vypracovala", "ven"],
    ["Potok v zimě ___mrzl.", "z", "zmrzl", "změna"],
    ["Děti se ___běhly k učitelce.", "s", "sběhly", "dohromady"],
    ["Děti ___lepily dva papíry k sobě.", "s", "slepily", "dohromady"],
    ["Ze skály ___padl kámen.", "s", "spadl", "dolů"],
    ["Lyžaři ___jeli prudký svah.", "s", "sjeli", "dolů"],
    ["Liška ___mizela v lese.", "z", "zmizela", "změna"],
    ["Tomáš si ___lepšil známky.", "z", "zlepšil", "změna"],
    ["Holubi se ___nesli k nebi.", "vz", "vznesli", "nahoru"],
    ["Pes ___běhl ze dveří ven.", "vy", "vyběhl", "ven"],
    ["Pták ___létl z větve až nad střechy.", "vz", "vzlétl", "nahoru"],
  ] as [string, Klic, string, Vyznam][]).map(([v, k, s, z]) => uloha(v, k, s, z, VSE)),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const PRAVOPISPREDPONVYVYSZVZ: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz",
    rvpNodeId: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz",
    displayName: "Předpony vy/s/z",
    title: "Pravopis předpon (vy-, vý-, s-, z-, vz-)",
    studentTitle: "Předpony vy/s/z",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Naučíš se, kdy psát předponu vy-, vý-, s-, z- nebo vz-.",
    keywords: ["předpona", "vy-", "vý-", "s-", "z-", "vz-", "pravopis"],
    goals: [
      "Rozlišit vy- (slovesa) a vý- (jména)",
      "Rozlišit předpony s-/z-/vz- podle významu",
    ],
    boundaries: ["Nezabývat se předložkami s/z", "Bez předpon v přejatých slovech"],
    gradeRange: [4, 4],
    inputType: "fill_blank",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-cjl-jazykova-vychova-stavba-slova-pravopis-predlozek-s-z-se-ze"],
    generator: gen,
    helpTemplate: {
      hint: "vy- = slovesa (vyletět), vý- = jména (výlet); s- = dolů/dohromady, z- = změna stavu, vz- = nahoru",
      steps: [
        "Je to sloveso? → vy-. Podstatné nebo přídavné jméno? → většinou vý-.",
        "Pohyb dolů nebo spojení → s-",
        "Změna stavu → z-",
        "Pohyb nahoru → vz- (výjimka: zvednout)",
      ],
      commonMistake: "Záměna s- a z- (sjet = dolů × zlepšit = změna stavu)",
      example: "sjet (z kopce dolů) × zmrznout (změna stavu) × vzlétnout (nahoru)",
    },
  },
];
