/**
 * Dějepis 6. ročník — Historické prameny (hmotné, písemné, obrazové).
 *
 * FAKTICKÝ vzor typu categorize (žák třídí prameny do skupin) — třetí ověřovaný
 * typ pilotu (po select_one a drag_order). Procvičuje „práci se zdrojem": rozlišit,
 * podle čeho poznáme typ historického pramene.
 *
 * Rozlišovací pravidlo (klíč kvality):
 *  • HMOTNÝ = předmět/věc bez textu i záměrného obrazu (nástroj, nádoba, kostra…).
 *  • PÍSEMNÝ = nese ZÁZNAM PÍSMA (kronika, listina, nápis — i když je vytesán do kamene).
 *  • OBRAZOVÝ = zobrazuje výjev (malba, fotografie, mapa, rytina).
 *
 * Chybový model (jádro kvality categorize): v L3 jsou prameny, které NAVENEK vypadají
 * jako jiná skupina — klínové písmo na hliněné tabulce vypadá hmotně, ale nese text →
 * písemný. Vysvětlení pak pojmenuje, podle čeho se rozhoduje (ne podle materiálu, ale
 * podle toho, co pramen NESE).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, buildCategorizeTask as cat } from "./_shared";

const H = "Hmotný pramen";
const P = "Písemný pramen";
const O = "Obrazový pramen";

const RULE =
  "Typ pramene poznáš podle toho, co NESE: hmotný = předmět bez textu (nástroj, nádoba), písemný = nese psaný text (i když je vytesán do kamene), obrazový = zobrazuje výjev (malba, mapa).";

// ── Pooly úloh po úrovních ──────────────────────────────────────────────────
const L1: PracticeTask[] = [
  cat(
    "Zařaď tři historické prameny do správné skupiny.",
    [
      { name: H, items: ["Pazourkový nástroj"] },
      { name: P, items: ["Středověká kronika"] },
      { name: O, items: ["Nástěnná malba (freska)"] },
    ],
    {
      hints: ["Polož si otázku: nese pramen text, obraz, nebo je to jen předmět?", "Kronika je psaná rukou — co to o ní říká?"],
      explanation: RULE + " Pazourkový nástroj je předmět (hmotný), kronika nese text (písemný), freska zobrazuje výjev (obrazový).",
    },
  ),
  cat(
    "Roztřiď tři prameny podle typu.",
    [
      { name: H, items: ["Hliněná nádoba"] },
      { name: P, items: ["Dopis panovníka"] },
      { name: O, items: ["Stará fotografie"] },
    ],
    {
      hints: ["Co pramen nese — text, obraz, nebo nic z toho?", "Fotografie zachycuje obraz skutečnosti."],
      explanation: RULE + " Nádoba je předmět (hmotný), dopis je psaný text (písemný), fotografie zobrazuje výjev (obrazový).",
    },
  ),
  cat(
    "Zařaď tři prameny do skupin podle typu.",
    [
      { name: H, items: ["Bronzový meč"] },
      { name: P, items: ["Listina s pečetí"] },
      { name: O, items: ["Stará mapa"] },
    ],
    {
      hints: ["Rozhoduj podle obsahu, ne podle materiálu.", "Listina je psaný dokument — pečeť ji jen ověřuje."],
      explanation: RULE + " Meč je předmět (hmotný), listina nese psaný text (písemný), mapa zobrazuje území (obrazový).",
    },
  ),
];

const L2: PracticeTask[] = [
  cat(
    "Roztřiď prameny do tří skupin: hmotný, písemný, obrazový.",
    [
      { name: H, items: ["Bronzová spona", "Kostra z mohyly"] },
      { name: P, items: ["Středověká kronika", "Náhrobní nápis"] },
      { name: O, items: ["Freska v kostele", "Portrét panovníka"] },
    ],
    {
      hints: ["U každého pramene se zeptej: nese text, zobrazuje výjev, nebo je to předmět?", "Náhrobní nápis je vytesán do kamene, ale nese písmo."],
      explanation: RULE + " Spona a kostra jsou předměty (hmotné). Kronika i náhrobní nápis nesou text (písemné). Freska a portrét zobrazují výjev (obrazové).",
    },
  ),
  cat(
    "Roztřiď šest pramenů do tří skupin podle typu.",
    [
      { name: H, items: ["Pazourkový nástroj", "Zbytky hradeb"] },
      { name: P, items: ["Starý dopis", "Zápis v matrice"] },
      { name: O, items: ["Stará mapa", "Rytina bitvy"] },
    ],
    {
      hints: ["Předmět bez textu = hmotný; psaný záznam = písemný; obraz = obrazový.", "Mapa i rytina něco zobrazují."],
      explanation: RULE + " Nástroj a hradby jsou předměty (hmotné). Dopis a zápis v matrice nesou text (písemné). Mapa a rytina zobrazují (obrazové).",
    },
  ),
  cat(
    "Zařaď šest pramenů do skupin: hmotný, písemný, obrazový.",
    [
      { name: H, items: ["Hliněná nádoba", "Kamenný hrot šípu"] },
      { name: P, items: ["Kronika", "Listina krále"] },
      { name: O, items: ["Kresba bitvy", "Rytina města"] },
    ],
    {
      hints: ["Rozhoduj podle obsahu pramene, ne podle toho, z čeho je vyroben.", "Hrot šípu je nástroj — žádný text ani obraz."],
      explanation: RULE + " Nádoba a hrot šípu jsou předměty (hmotné). Kronika a listina nesou text (písemné). Kresba a rytina zobrazují výjev (obrazové).",
    },
  ),
];

// L3 — prameny, které NAVENEK vypadají jako jiná skupina (chybový model).
const L3: PracticeTask[] = [
  cat(
    "Roztřiď šest pramenů podle typu — pozor na ty, které klamou.",
    [
      { name: H, items: ["Bronzová spona", "Kostra z pohřebiště"] },
      { name: P, items: ["Klínové písmo na hliněné tabulce", "Egyptské hieroglyfy na zdi chrámu"] },
      { name: O, items: ["Nástěnná malba bitvy", "Stará mapa kraje"] },
    ],
    {
      hints: ["Nerozhoduj podle materiálu (hlína, kámen), ale podle toho, co pramen NESE.", "Klínové písmo i hieroglyfy jsou písmo — i když jsou na hlíně nebo na zdi."],
      explanation: RULE + " Klínová tabulka a hieroglyfy vypadají jako předmět nebo stavba, ale NESOU PÍSMO → jsou písemné. Spona a kostra jsou předměty (hmotné), malba a mapa zobrazují (obrazové).",
    },
  ),
  cat(
    "Zařaď šest pramenů; některé vypadají jinak, než kam patří.",
    [
      { name: H, items: ["Pazourkový nástroj", "Zbytky hradeb"] },
      { name: P, items: ["Zákoník vytesaný do kamene", "Listina s pečetí"] },
      { name: O, items: ["Rytina středověkého města", "Portrét panovníka"] },
    ],
    {
      hints: ["Pramen, který nese text, je písemný — i kdyby byl vytesán do kamene.", "Pečeť listinu jen ověřuje; obsah je psaný text."],
      explanation: RULE + " Zákoník v kameni a listina s pečetí nesou text → písemné, i když vypadají jako kámen či předmět. Nástroj a hradby jsou hmotné, rytina a portrét obrazové.",
    },
  ),
  cat(
    "Roztřiď všech šest pramenů podle typu (rozhoduj podle obsahu, ne materiálu).",
    [
      { name: H, items: ["Bronzový meč", "Hliněná nádoba"] },
      { name: P, items: ["Náhrobní nápis", "Středověká kronika"] },
      { name: O, items: ["Freska v kostele", "Kresba lovecké scény"] },
    ],
    {
      hints: ["Předmět bez textu/obrazu = hmotný; psaný záznam = písemný; zobrazení = obrazový.", "Náhrobní nápis je sice na kameni, ale nese psaný text."],
      explanation: RULE + " Náhrobní nápis vypadá jako kamenný předmět, ale nese text → písemný (spolu s kronikou). Meč a nádoba jsou hmotné, freska a kresba obrazové.",
    },
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  return pickN(pool, pool.length);
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
