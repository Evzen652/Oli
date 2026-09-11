/**
 * Dějepis 6. ročník — Doba kamenná a periodizace pravěku (drag_order).
 *
 * Přepsáno 2026-09-11 (audit 6. ročníku): dřív čtyři pevné úlohy na úroveň,
 * teď generátor z banky úseků pravěku. Každý úsek má několik podob (název,
 * typický nástroj, způsob života, nález), úloha vybere 3 / 4 / 5 různých úseků
 * a z každého jednu podobu. Pořadí úseků je pevné (rank), takže chronologie je
 * jednoznačná.
 *
 * Malá nápověda se ptá na položky v ZAMÍCHANÉM pořadí (nic neprozradí), velká
 * dá pravidlo řazení a jednu kotvu. Vysvětlení říká u každé položky, proč tam patří.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, shuffle, pick, buildOrderTask as order } from "./_shared";

interface Podoba { text: string; proc: string }
const USEKY: Podoba[][] = [
  [
    { text: "Paleolit – starší doba kamenná", proc: "nejstarší a nejdelší úsek, lidé kámen jen štípali" },
    { text: "Paleolit – lovci mamutů", proc: "v době ledové lidé lovili mamuty — nejstarší úsek" },
    { text: "Lovci a sběrači (paleolit)", proc: "první lidé se živili lovem a sběrem" },
    { text: "Štípaný kámen (paleolit)", proc: "nejstarší nástroje vznikaly štípáním kamene" },
    { text: "Věstonická venuše (paleolit)", proc: "soška z Dolních Věstonic je stará asi 30 000 let" },
  ],
  [
    { text: "Mezolit – střední doba kamenná", proc: "krátký přechod po skončení doby ledové" },
    { text: "Mezolit – konec doby ledové", proc: "oteplilo se, lidé lovili menší zvěř a rybařili" },
    { text: "Střední doba kamenná", proc: "leží mezi starší a mladší dobou kamennou" },
  ],
  [
    { text: "Neolit – první zemědělci", proc: "lidé se usadili, pěstovali obilí a chovali zvířata" },
    { text: "Broušený kámen (neolit)", proc: "kámen se už brousil, nástroje byly dokonalejší" },
    { text: "Zemědělská revoluce (neolit)", proc: "zemědělství změnilo lovce v usedlé zemědělce" },
    { text: "Mladší doba kamenná", proc: "poslední část doby kamenné, přinesla zemědělství" },
  ],
  [
    { text: "Doba bronzová", proc: "první kovové nástroje ze slitiny mědi a cínu" },
    { text: "Doba bronzová – únětická kultura", proc: "u nás vznikla únětická kultura, která zpracovávala bronz" },
    { text: "Bronz – slitina mědi a cínu", proc: "bronz lidé uměli vyrobit až po době kamenné" },
    { text: "Bronzové nástroje a šperky", proc: "kovové předměty z bronzu nahradily kámen" },
  ],
  [
    { text: "Doba železná", proc: "železo je tvrdší než bronz a přišlo až nakonec" },
    { text: "Doba železná – Keltové", proc: "Keltové ovládli zpracování železa" },
    { text: "Keltská oppida", proc: "opevněná sídla Keltů z doby železné, první města u nás" },
    { text: "Železné nástroje – Keltové (Bohemia)", proc: "podle keltského kmene Bójů se naše země nazývá Bohemia" },
  ],
];

const ZADANI: Record<number, string> = {
  3: "Seřaď tři úseky pravěku od nejstaršího po nejnovější.",
  4: "Seřaď čtyři úseky pravěku od nejstaršího po nejnovější.",
  5: "Seřaď všech pět úseků pravěku na našem území od nejstaršího po nejnovější.",
};
const PRAVIDLO = "Pravěk jde od doby kamenné (starší, střední a mladší — paleolit, mezolit, neolit) přes dobu bronzovou k době železné.";
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function uloha(kolik: number): PracticeTask {
  const rady = pickN([0, 1, 2, 3, 4], kolik).sort((a, b) => a - b);
  const xs = rady.map((r) => pick(USEKY[r]));
  let promichane = shuffle(xs);
  if (promichane.every((x, i) => x === xs[i])) promichane = [...xs].reverse();
  const [a, b, ...zbytek] = promichane;
  const kotva = pick(xs.slice(1));
  return order(ZADANI[kolik], xs.map((x) => x.text), {
    hints: [
      `Co bylo dřív: „${a.text}“, nebo „${b.text}“?${zbytek.length ? ` A kam patří ${zbytek.map((x) => `„${x.text}“`).join(" a ")}?` : ""}`,
      `${PRAVIDLO} Pomůže i kotva: ${kotva.text} — ${kotva.proc}.`,
    ],
    explanation: `Správné pořadí: ${xs.map((x) => x.text).join(" → ")}. ${xs.map((x) => `${cap(x.text)}: ${x.proc}.`).join(" ")}`,
  });
}

function gen(level: number): PracticeTask[] {
  const kolik = level === 1 ? 3 : level === 2 ? 4 : 5;
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 200 && out.size < 24; i++) {
    const t = uloha(kolik);
    out.set(t.items!.join("|"), t);
  }
  return [...out.values()];
}

// ── Topic ────────────────────────────────────────────────────────────────
export const DOBA_KAMENNA_PERIODIZACE: TopicMetadata[] = [
  {
    id: "g6-dej-doba-kamenna-periodizace-6",
    rvpNodeId: "g6-dejepis-pravek-vyvoj-cloveka-doba-kamenna-paleolit-mezolit-neolit",
    displayName: "Časová osa pravěku",
    title: "Doba kamenná – paleolit, mezolit, neolit; periodizace pravěku",
    studentTitle: "Pravěk – časová osa",
    subject: "dejepis",
    category: "Pravěk",
    topic: "Vývoj člověka",
    briefDescription: "Seřadíš pravěké epochy na časové ose podle stáří a vývoje nástrojů.",
    keywords: [
      "pravěk", "doba kamenná", "paleolit", "mezolit", "neolit", "doba bronzová",
      "doba železná", "chronologie", "časová osa", "periodizace", "Keltové",
    ],
    goals: [
      "Seřadit úseky doby kamenné (paleolit, mezolit, neolit) podle stáří.",
      "Chronologicky uspořádat epochy pravěku podle materiálu nástrojů.",
      "Zařadit národy na našem území (Keltové, Germáni, Slované) na časovou osu.",
    ],
    boundaries: [
      "Jen relativní chronologie (co bylo dřív/později), ne konkrétní letopočty zpaměti.",
      "Pravěk a přechod k starověku na našem území.",
      "Nezahrnuje podrobné dějiny jednotlivých kultur.",
    ],
    gradeRange: [6, 6],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 4,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Pravěk jde podle materiálu nástrojů: doba kamenná (paleolit → mezolit → neolit) → doba bronzová → doba železná. Na našem území pak Keltové → Germáni → Slované.",
      steps: [
        "Najdi nejstarší epochu — vždy je to paleolit (starší doba kamenná).",
        "Doba kamenná postupuje: paleolit → mezolit → neolit.",
        "Po kameni přišel bronz, pak železo; nakonec národy: Keltové → Germáni → Slované.",
      ],
      commonMistake: "Zaměnit pořadí mezolitu a neolitu, nebo dát kovy (bronz/železo) před dobu kamennou.",
      example: "Paleolit (lov) → neolit (zemědělství) → doba bronzová → doba železná (Keltové).",
    },
  },
];
