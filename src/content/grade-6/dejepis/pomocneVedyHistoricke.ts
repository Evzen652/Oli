/**
 * Dějepis 6. ročník — Pomocné vědy historické (categorize).
 *
 * Přepsáno 2026-09-11 (audit 6. ročníku): dřív tři pevné úlohy na úroveň,
 * teď generátor z banky nálezů. L1 čtyři nálezy (jeden na vědu), L2 osm
 * jasných nálezů (dva na vědu), L3 osm nálezů, mezi nimi vždy klamavá mince
 * (portrét nebo znak láká na heraldiku) a klamavý rukopis k rozluštění (kus
 * pergamenu láká na archeologii). Rozhoduje, CO se zkoumá, ne z čeho nález je.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, shuffle, buildCategorizeTask as cat } from "./_shared";

const A = "Archeologie";
const P = "Paleografie";
const N = "Numismatika";
const H = "Heraldika";

const RULE =
  "Vědu poznáš podle toho, CO zkoumá, ne podle materiálu nálezu: archeologie = hmotné nálezy vykopané ze země, paleografie = čtení starého písma a rukopisů, numismatika = mince a platidla, heraldika = erby a znaky rodů a měst.";
const MINCE_RULE = "Pozor na mince: i když je na minci portrét nebo znak, pořád je to platidlo — výzdoba z ní erb neudělá.";
const GLOSSARY = "Slovníček: archeologie (vykopávky ze země), paleografie (čtení starého písma), numismatika (mince a peníze), heraldika (erby a znaky).";

type Nalez = [string, string]; // [název, co se na něm zkoumá]
const JASNE: Record<string, Nalez[]> = {
  [A]: [
    ["Nádoba vykopaná ze země", "vykopaný předmět"], ["Střep z vykopávek", "úlomek nádoby ze země"],
    ["Kostra z pravěkého hrobu", "pozůstatek člověka z hrobu"], ["Základy staré stavby", "zbytky stavby odkryté v zemi"],
    ["Pazourek z vykopávek", "nástroj nalezený v zemi"], ["Korálky z pohřebiště", "šperk z hrobu"],
    ["Kamenná sekerka – nález v zemi", "nástroj nalezený v zemi"],
  ],
  [P]: [
    ["Starý rukopis ke čtení", "rukopis se čte — jde o staré písmo"], ["Středověká kronika ke čtení", "ručně psaný text ke čtení"],
    ["Listina psaná gotickým písmem", "staré písmo je třeba přečíst"], ["Opis středověké kroniky", "ručně psaný text"],
    ["Rukopisná modlitební kniha", "rukopis se starým písmem"], ["Dopis psaný starým písmem", "staré písmo se musí přečíst"],
  ],
  [N]: [
    ["Antická mince", "platidlo starověku"], ["Stříbrné platidlo", "platidlo"], ["Papírová bankovka", "platidlo z papíru"],
    ["Zlatá mince", "platidlo"], ["Groš – stříbrná mince", "středověké platidlo"], ["Měděná mince z pokladu", "platidlo"],
  ],
  [H]: [
    ["Rytířský erb na štítu", "erb je znak rodu"], ["Znak královského města na bráně", "znak města"],
    ["Erb šlechtického rodu na praporu", "erb rodu"], ["Znak cechu na vývěsním štítu", "znak řemeslníků"],
    ["Městský znak na radnici", "znak města"], ["Erb na kamenném štítu nad branou", "erb rodu"],
  ],
};
const KLAMAVE: Record<string, Nalez[]> = {
  [A]: [["Nález v zemi: bronzový meč", "meč vykopaný ze země — zkoumá se předmět z vykopávek"], ["Hliněný střep s ornamentem", "ozdobený úlomek ze země je pořád vykopávka"]],
  [P]: [
    ["Stará listina k rozluštění písma", "vypadá jako vykopaný kus pergamenu, ale úkolem je přečíst písmo"],
    ["Pergamen se starým písmem k rozluštění", "zkoumá se písmo, ne materiál"],
    ["Egyptský papyrus k rozluštění písma", "papyrus nese písmo, které se luští"],
    ["Listina se starým písmem ke čtení", "úkolem je číst písmo"],
  ],
  [N]: [
    ["Mince s portrétem panovníka", "portrét láká na heraldiku, ale předmětem je mince"],
    ["Mince se znakem města", "znak je jen výzdoba platidla"],
    ["Zlatá mince s portrétem císaře", "platidlo s výzdobou, pořád mince"],
  ],
  [H]: [["Znak rodu vytesaný nad branou hradu", "znak rodu, kámen je jen jeho nositel"]],
};

const ZADANI: Record<number, string> = {
  1: "Přiřaď čtyři nálezy k pomocné vědě, která je zkoumá.",
  2: "Roztřiď osm nálezů ke čtyřem pomocným vědám (po dvou).",
  3: "Roztřiď osm nálezů ke správné vědě — pozor, některé klamou vzhledem.",
};

function uloha(level: number): PracticeTask {
  const vyber: Record<string, Nalez[]> = {};
  for (const g of [A, P, N, H]) {
    if (level === 1) vyber[g] = pickN(JASNE[g], 1);
    else if (level === 2) vyber[g] = pickN(JASNE[g], 2);
    else {
      // L3: mince a rukopis vždy klamavé, archeologie a heraldika jen někdy.
      const klam = g === N || g === P || Math.random() < 0.5 ? pickN(KLAMAVE[g], 1) : [];
      vyber[g] = [...klam, ...pickN(JASNE[g], 2 - klam.length)];
    }
  }
  const vse = shuffle([A, P, N, H].flatMap((g) => vyber[g].map(([n, proc]) => ({ n, proc, g }))));
  const ukazka = vse.slice(0, 4).map((x) => `„${x.n}“`).join(", ");
  return cat(ZADANI[level], [A, P, N, H].map((g) => ({ name: g, items: vyber[g].map(([n]) => n) })), {
    hints: [
      `U nálezů ${ukazka} se zeptej: jde o vykopávku, o písmo ke čtení, o platidlo, nebo o znak?`,
      level === 3 ? `${RULE} ${MINCE_RULE}` : level === 1 ? `${GLOSSARY} ${RULE}` : RULE,
    ],
    explanation: `${RULE} ${vse.map((x) => `${x.n}: ${x.proc} (${x.g.toLowerCase()}).`).join(" ")}`,
  });
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 200 && out.size < 24; i++) {
    const t = uloha(level);
    out.set(t.categories!.map((c) => c.items.join("+")).join("|"), t);
  }
  return [...out.values()];
}

// ── Topic ────────────────────────────────────────────────────────────────
export const POMOCNE_VEDY_HISTORICKE: TopicMetadata[] = [
  {
    id: "g6-dej-pomocne-vedy-historicke-6",
    rvpNodeId:
      "g6-dejepis-uvod-do-dejepisu-pomocne-vedy-historicke-archeologie-paleografie-numismatika-heraldika",
    displayName: "Pomocné vědy historické",
    title: "Pomocné vědy historické – archeologie, paleografie, numismatika, heraldika",
    studentTitle: "Pomocné vědy historické",
    subject: "dejepis",
    category: "Úvod do dějepisu",
    topic: "Pomocné vědy historické",
    briefDescription:
      "Přiřadíš nález ke správné vědě: archeologii, paleografii, numismatice, heraldice.",
    keywords: [
      "pomocné vědy historické", "archeologie", "paleografie", "numismatika", "heraldika",
      "mince", "erb", "rukopis", "vykopávky", "znak",
    ],
    goals: [
      "Přiřadit nález k pomocné vědě podle toho, co věda zkoumá.",
      "Rozlišit archeologii, paleografii, numismatiku a heraldiku.",
      "Nenechat se zmást vzhledem či materiálem (mince s portrétem je stále numismatika).",
    ],
    boundaries: [
      "Čtyři základní pomocné vědy (archeologie, paleografie, numismatika, heraldika).",
      "Rozhoduje předmět zařazení, ne materiál ani obrázek na nálezu.",
      "Nezahrnuje další pomocné vědy (chronologie, genealogie, sfragistika, epigrafika apod.) — pečeti a nápisy na kameni proto mezi položky nepatří.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Vědu poznáš podle toho, CO zkoumá: archeologie = vykopávky ze země, paleografie = čtení starého písma, numismatika = mince a platidla, heraldika = erby a znaky.",
      steps: [
        "Je nález vykopaný předmět ze země (kostra, střep, základy)? → archeologie.",
        "Je úkolem přečíst staré písmo nebo rukopis (listina, kronika, pergamen)? → paleografie.",
        "Je to mince nebo platidlo? → numismatika. Je to erb či znak rodu/města (na štítu, praporu, bráně)? → heraldika.",
      ],
      commonMistake:
        "Třídit podle vzhledu nebo materiálu — mince s portrétem panovníka je numismatika (ne heraldika), starou listinu ke čtení řeší paleografie (ne archeologie).",
      example:
        "Vykopaná nádoba = archeologie. Rukopis = paleografie. Mince = numismatika. Erb = heraldika.",
    },
  },
];
