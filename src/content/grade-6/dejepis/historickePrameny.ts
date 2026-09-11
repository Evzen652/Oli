/**
 * Dějepis 6. ročník — Historické prameny (categorize).
 *
 * Přepsáno 2026-09-11 (audit 6. ročníku): dřív tři pevné úlohy na úroveň,
 * teď generátor z banky pramenů. L1 tři prameny (jeden z každé skupiny),
 * L2 šest jasných pramenů (dva z každé skupiny), L3 šest pramenů, mezi nimi
 * klamavé — písemný pramen na kameni nebo hlíně, obraz vyrytý do kovu, ozdobený
 * předmět. Rozhoduje, co pramen NESE, ne z čeho je.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, shuffle, buildCategorizeTask as cat } from "./_shared";

const H = "Hmotný pramen";
const P = "Písemný pramen";
const O = "Obrazový pramen";

const RULE =
  "Typ pramene poznáš podle toho, co NESE: hmotný = předmět bez textu (nástroj, nádoba), písemný = nese psaný text (i když je vytesán do kamene), obrazový = zobrazuje výjev (malba, mapa).";

type Pramen = [string, string]; // [název, proč patří do skupiny]
const JASNE: Record<string, Pramen[]> = {
  [H]: [
    ["Pazourkový nástroj", "předmět bez textu i obrazu"], ["Hliněná nádoba", "předmět, který lidé používali"],
    ["Bronzový meč", "zbraň — předmět"], ["Bronzová spona", "šperk, předmět bez textu"],
    ["Kostra z mohyly", "pozůstatek člověka, žádný text"], ["Zbytky hradeb", "část stavby"],
    ["Kamenný hrot šípu", "nástroj k lovu"], ["Železný meč", "zbraň — předmět"], ["Keramická nádoba", "předmět denní potřeby"],
  ],
  [P]: [
    ["Středověká kronika", "psaný záznam událostí"], ["Dopis panovníka", "psaný text"],
    ["Listina s pečetí", "psaný dokument, pečeť ho jen ověřuje"], ["Zápis v matrice", "psaný záznam narození a sňatků"],
    ["Listina krále", "psaný dokument"], ["Starý dopis", "psaný text"],
  ],
  [O]: [
    ["Nástěnná malba (freska)", "zobrazuje výjev"], ["Stará fotografie", "zachycuje obraz skutečnosti"],
    ["Stará mapa", "zobrazuje území"], ["Rytina bitvy", "zobrazuje výjev"],
    ["Portrét panovníka", "zobrazuje člověka"], ["Kresba hradu", "zobrazuje stavbu"], ["Freska v kostele", "zobrazuje výjev"],
  ],
};
const KLAMAVE: Record<string, Pramen[]> = {
  [H]: [
    ["Nádoba s malovaným vzorem", "vzor je jen ozdoba, nezobrazuje výjev — pořád je to předmět"],
    ["Meč se zdobenou rukojetí", "ozdoba z předmětu obraz neudělá"],
  ],
  [P]: [
    ["Klínové písmo na hliněné tabulce", "tabulka vypadá jako předmět, ale nese písmo"],
    ["Egyptské hieroglyfy na zdi chrámu", "zeď je stavba, ale hieroglyfy jsou písmo"],
    ["Zákoník vytesaný do kamene", "kámen vypadá jako předmět, ale nese text"],
    ["Náhrobní nápis", "je na kameni, ale nese psaný text"],
  ],
  [O]: [
    ["Jeskynní malba zvířat", "je na skále, ale zobrazuje zvířata"],
    ["Mapa vyrytá do měděné desky", "deska je z kovu, ale zobrazuje území"],
  ],
};

const ZADANI: Record<number, string> = {
  1: "Zařaď tři historické prameny do správné skupiny.",
  2: "Roztřiď šest pramenů do tří skupin podle typu.",
  3: "Zařaď šest pramenů; některé vypadají jinak, než kam patří.",
};

function uloha(level: number): PracticeTask {
  const vyber: Record<string, Pramen[]> = {};
  for (const g of [H, P, O]) {
    if (level === 1) vyber[g] = pickN(JASNE[g], 1);
    else if (level === 2) vyber[g] = pickN(JASNE[g], 2);
    else {
      // L3: písemný vždy s jedním klamavým, ostatní skupiny s ním jen někdy.
      const klam = g === P || Math.random() < 0.5 ? pickN(KLAMAVE[g], 1) : [];
      vyber[g] = [...klam, ...pickN(JASNE[g], 2 - klam.length)];
    }
  }
  const vse = shuffle([H, P, O].flatMap((g) => vyber[g].map(([n, proc]) => ({ n, proc, g }))));
  const ukazka = vse.map((x) => `„${x.n}“`);
  return cat(ZADANI[level], [H, P, O].map((g) => ({ name: g, items: vyber[g].map(([n]) => n) })), {
    hints: [
      `Začni prameny ${ukazka.join(", ")}: nese který z nich text, který obraz a který nic z toho?`,
      level === 3 ? `${RULE} Nerozhoduj podle materiálu (hlína, kámen, kov), ale podle toho, co pramen nese.` : RULE,
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
export const HISTORICKE_PRAMENY: TopicMetadata[] = [
  {
    id: "g6-dej-historicke-prameny-6",
    rvpNodeId:
      "g6-dejepis-uvod-do-dejepisu-historie-a-historicke-prameny-historicke-prameny-hmotne-pisemne-obrazove",
    displayName: "Historické prameny",
    title: "Historické prameny – hmotné, písemné, obrazové",
    studentTitle: "Historické prameny",
    subject: "dejepis",
    category: "Úvod do dějepisu",
    topic: "Historie a historické prameny",
    briefDescription: "Roztřídíš historické prameny na hmotné, písemné a obrazové.",
    keywords: [
      "historický pramen", "hmotný pramen", "písemný pramen", "obrazový pramen",
      "kronika", "listina", "archeologie", "freska", "nápis", "prameny",
    ],
    goals: [
      "Rozlišit hmotný, písemný a obrazový pramen podle toho, co nese.",
      "Zařadit konkrétní pramen do správné skupiny.",
      "Nenechat se zmást materiálem (text na kameni je stále písemný pramen).",
    ],
    boundaries: [
      "Tři základní typy pramenů (hmotný, písemný, obrazový).",
      "Rozhoduje obsah pramene, ne materiál, z něhož je.",
      "Nezahrnuje dělení na primární/sekundární prameny.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Typ pramene poznáš podle obsahu: hmotný = předmět (nástroj, nádoba), písemný = nese psaný text (kronika, nápis, i na kameni), obrazový = zobrazuje výjev (malba, mapa, fotografie).",
      steps: [
        "U každého pramene se zeptej: nese psaný text? → písemný.",
        "Zobrazuje nějaký výjev (obraz, mapu)? → obrazový.",
        "Je to jen předmět bez textu i obrazu? → hmotný.",
      ],
      commonMistake: "Zařadit podle materiálu místo podle obsahu — klínové písmo na hliněné tabulce je písemný pramen, ne hmotný.",
      example: "Meč = hmotný. Kronika = písemný. Freska = obrazový. Nápis na kameni = písemný (nese text).",
    },
  },
];
