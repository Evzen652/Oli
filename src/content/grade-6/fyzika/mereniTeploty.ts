/**
 * Fyzika 6. ročník — Měření teploty (°C, změny teploty, rozdíl přes nulu, převod na K).
 *
 * Jiný charakter než délka/hmotnost/objem: NENÍ násobkový převod jednotek.
 * Jádro je počítání se stupnicí, která prochází nulou (záporné teploty) a
 * aditivní převod °C → K. Chybový model cílí na typické chyby:
 *  • špatný směr (oteplení vs. ochlazení),
 *  • rozdíl přes nulu počítaný bez ohledu na zápornou stranu,
 *  • převod na kelviny změnou jednotky bez přičtení 273.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as task } from "./_shared";

const ri = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Teplota ve °C se správným typografickým minus (−), s mezerou před jednotkou. */
const tC = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(n)} °C`;

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    tasks.push(level === 1 ? genL1() : level === 2 ? genL2() : genL3());
  }
  return tasks;
}

// L1 — oteplení / ochlazení o daný počet stupňů (jeden krok, výsledek nezáporný).
function genL1(): PracticeTask {
  const delta = ri(2, 9);
  const warming = Math.random() < 0.5;
  const start = warming ? ri(5, 20) : ri(delta + 2, 24); // ochlazení: start > delta → výsledek ≥ 2
  const result = warming ? start + delta : start - delta;
  const ctx = warming
    ? pick([
        `Ráno bylo ${tC(start)}. Přes den se oteplilo o ${delta} °C. Jaká je teplota teď?`,
        `Voda měla ${tC(start)}. Ohřáli jsme ji o ${delta} °C. Jakou má teplotu?`,
      ])
    : pick([
        `Odpoledne bylo ${tC(start)}. Večer se ochladilo o ${delta} °C. Jaká je teplota teď?`,
        `Vzduch měl ${tC(start)}. Teplota klesla o ${delta} °C. Jaká je teď?`,
      ]);
  return task(
    ctx,
    tC(result),
    [
      {
        value: tC(warming ? start - delta : start + delta),
        why: `Spletl sis směr. ${warming ? "Oteplení" : "Ochlazení"} znamená ${warming ? "přičíst" : "odečíst"}, ne ${warming ? "odečíst" : "přičíst"}.`,
      },
      {
        value: tC(delta),
        why: `To je jen změna teploty (o kolik), ne výsledná teplota. Připoj ji k počáteční hodnotě.`,
      },
      {
        value: tC(start),
        why: `To je počáteční teplota. Ještě musíš započítat změnu o ${delta} °C.`,
      },
    ],
    {
      hints: [
        `Krok 1: Urči směr — „oteplilo se" přičítáš, „ochladilo se / kleslo" odečítáš.`,
        `Krok 2: K počáteční teplotě připoj změnu uvedenou v zadání.`,
      ],
      solutionSteps: [
        `Směr: ${warming ? "oteplení → přičítáme" : "ochlazení → odečítáme"}.`,
        `${tC(start)} ${warming ? "+" : "−"} ${delta} °C = ${tC(result)}`,
      ],
      explanation: `${warming ? "Oteplení znamená přičíst" : "Ochlazení znamená odečíst"}: ${start} ${warming ? "+" : "−"} ${delta} = ${result} °C.`,
    },
  );
}

// L2 — rozdíl teplot přes nulu (jedna teplota záporná, druhá kladná).
function genL2(): PracticeTask {
  const a = ri(-12, -1); // záporná (chladnější)
  const b = ri(1, 12); // kladná (teplejší)
  const diff = b - a; // = b + |a|, vždy kladné
  const rose = Math.random() < 0.5;
  const ctx = rose
    ? `Ráno bylo ${tC(a)}, odpoledne ${tC(b)}. O kolik stupňů se oteplilo?`
    : `V poledne bylo ${tC(b)}, v noci ${tC(a)}. O kolik stupňů se ochladilo?`;
  return task(
    ctx,
    tC(diff),
    [
      {
        value: tC(Math.abs(b - Math.abs(a))),
        why: `Přes nulu nestačí jen odečíst čísla. Sečti vzdálenost pod nulou a nad nulou.`,
      },
      {
        value: tC(Math.abs(a)),
        why: `To je jen vzdálenost od ${tC(a)} k nule. Přičti ještě cestu od nuly k ${tC(b)}.`,
      },
      {
        value: tC(b),
        why: `To je jen jedna z teplot, ne rozdíl. Spočítej vzdálenost mezi oběma.`,
      },
    ],
    {
      hints: [
        `Krok 1: Teploty leží na opačných stranách nuly. Rozděl cestu na dvě části — pod nulou a nad nulou.`,
        `Krok 2: Spočítej, kolik stupňů je od záporné teploty k nule a kolik od nuly ke kladné, a pak je sečti.`,
      ],
      solutionSteps: [
        `Od ${tC(a)} k 0 °C je to ${Math.abs(a)} °C.`,
        `Od 0 °C k ${tC(b)} je to ${b} °C.`,
        `Celkem: ${Math.abs(a)} + ${b} = ${diff} °C`,
      ],
      explanation: `Přes nulu se obě vzdálenosti sčítají: ${Math.abs(a)} + ${b} = ${diff} °C.`,
    },
  );
}

// L3 — aplikace: velký rozdíl, postupné ochlazování (2 kroky), nebo převod °C → K.
function genL3(): PracticeTask {
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
    // velký rozdíl přes nulu (mrazák × pokoj)
    const cold = ri(-25, -10);
    const warm = ri(18, 26);
    const diff = warm - cold;
    return task(
      `V mrazáku je ${tC(cold)} a v pokoji ${tC(warm)}. Jaký je rozdíl teplot?`,
      tC(diff),
      [
        {
          value: tC(Math.abs(warm - Math.abs(cold))),
          why: `Přes nulu nestačí odečíst čísla. Sečti vzdálenost od ${tC(cold)} k nule a od nuly k ${tC(warm)}.`,
        },
        {
          value: tC(Math.abs(cold)),
          why: `To je jen cesta od ${tC(cold)} k nule. Přičti ještě ${warm} °C nad nulou.`,
        },
        {
          value: tC(warm),
          why: `To je teplota v pokoji, ne rozdíl. Spočítej vzdálenost mezi oběma teplotami.`,
        },
      ],
      {
        hints: [
          `Krok 1: Jedna teplota je pod nulou, druhá nad nulou — rozděl rozdíl na dvě části.`,
          `Krok 2: Sečti počet stupňů pod nulou a počet stupňů nad nulou.`,
        ],
        solutionSteps: [
          `Pod nulou: od ${tC(cold)} k 0 °C je ${Math.abs(cold)} °C.`,
          `Nad nulou: od 0 °C k ${tC(warm)} je ${warm} °C.`,
          `Rozdíl: ${Math.abs(cold)} + ${warm} = ${diff} °C`,
        ],
        explanation: `Rozdíl přes nulu = vzdálenost pod nulou + vzdálenost nad nulou: ${Math.abs(cold)} + ${warm} = ${diff} °C.`,
      },
    );
  }

  if (variant === 1) {
    // postupné ochlazování (2 kroky: celkový pokles, pak odečtení)
    const d = ri(2, 4); // pokles za hodinu
    const h = ri(2, 4); // počet hodin
    const s = ri(2, 8); // počáteční teplota
    const drop = d * h;
    const result = s - drop; // typicky pod nulu
    return task(
      `Teplota klesala o ${d} °C každou hodinu. Začínalo na ${tC(s)}. Jaká bude teplota po ${h} hodinách?`,
      tC(result),
      [
        {
          value: tC(s - d),
          why: `To je teplota po jedné hodině. Pokles trvá ${h} hodin: ${d} × ${h} = ${drop} °C celkem.`,
        },
        {
          value: tC(s + drop),
          why: `Teplota klesá, takže celkový pokles odečítáš, ne přičítáš.`,
        },
        {
          value: tC(-drop),
          why: `Zapomněl jsi počáteční teplotu ${tC(s)}. Od ní odečti celkový pokles.`,
        },
      ],
      {
        hints: [
          `Krok 1: Nejdřív spočítej celkový pokles — kolik stupňů za hodinu krát počet hodin.`,
          `Krok 2: Od počáteční teploty odečti celkový pokles. Výsledek může klesnout pod nulu.`,
        ],
        solutionSteps: [
          `Celkový pokles: ${d} × ${h} = ${drop} °C`,
          `${tC(s)} − ${drop} °C = ${tC(result)}`,
        ],
        explanation: `Za ${h} hodin klesne o ${d} × ${h} = ${drop} °C. Z ${s} °C: ${s} − ${drop} = ${result} °C.`,
      },
    );
  }

  // variant === 2: převod °C → K (aditivní)
  const t = pick([-20, -15, -10, -5, 5, 10, 15, 20, 25, 30, 35]);
  const k = t + 273;
  return task(
    `Teplota je ${tC(t)}. Kolik je to kelvinů? (0 °C odpovídá 273 K)`,
    `${k} K`,
    [
      {
        value: `${t} K`,
        why: `Změnil jsi jen jednotku. Ke stupňům Celsia musíš přičíst 273.`,
      },
      {
        value: `${t - 273} K`,
        why: `Z °C na K se 273 přičítá, ne odečítá.`,
      },
      {
        value: `${t + 100} K`,
        why: `Rozdíl mezi stupnicemi je 273, ne 100.`,
      },
    ],
    {
      hints: [
        `Krok 1: Kelvinova stupnice je posunutá. Platí: teplota v K = teplota v °C + 273.`,
        `Krok 2: Dosaď zadanou teplotu a přičti 273.`,
      ],
      solutionSteps: [
        `T(K) = t(°C) + 273`,
        `${t} + 273 = ${k} K`,
      ],
      explanation: `Kelviny získáš přičtením 273 ke stupňům Celsia: ${t} + 273 = ${k} K.`,
    },
  );
}

export const MERENI_TEPLOTY: TopicMetadata[] = [
  {
    id: "g6-fyz-mereni-teploty-6",
    rvpNodeId:
      "g6-fyzika-mereni-fyzikalnich-velicin-hustota-teplota-cas-teplota-jednotky-teplomery-tepelna-roztaznost",
    displayName: "Měření teploty",
    title: "Teplota – stupně Celsia, kelviny",
    studentTitle: "Měření teploty",
    subject: "fyzika",
    category: "Měření fyzikálních veličin",
    topic: "Hustota, teplota, čas",
    briefDescription: "Počítáš změny teploty, rozdíly přes nulu a převádíš na kelviny.",
    keywords: [
      "teplota", "stupeň Celsia", "°C", "kelvin", "K", "teploměr", "oteplení",
      "ochlazení", "rozdíl teplot", "záporná teplota", "pod nulou",
    ],
    goals: [
      "Spočítat výslednou teplotu po oteplení nebo ochlazení.",
      "Určit rozdíl teplot, i když jedna je pod nulou.",
      "Převést teplotu ze stupňů Celsia na kelviny (přičtením 273).",
    ],
    boundaries: [
      "Pouze stupnice Celsia a Kelvina, celá čísla.",
      "Tepelná roztažnost a teplo (J) se neřeší zde — jen práce se stupnicí.",
      "Záporné teploty jen v rozsahu běžného počasí a mrazáku.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-mereni-casu-6"],
    generator: gen,
    helpTemplate: {
      hint: "Oteplení přičítá, ochlazení odečítá. Rozdíl přes nulu = vzdálenost pod nulou + vzdálenost nad nulou. Kelviny: K = °C + 273.",
      steps: [
        "U změny teploty urči směr: oteplení (+) nebo ochlazení (−).",
        "U rozdílu přes nulu sečti cestu od záporné teploty k nule a od nuly ke kladné.",
        "U převodu na kelviny přičti ke stupňům Celsia 273.",
      ],
      commonMistake: "Špatný směr změny, odečtení teplot bez ohledu na nulu, nebo převod na K pouhou výměnou jednotky.",
      example: "Z −5 °C do 6 °C: 5 + 6 = 11 °C. 25 °C = 25 + 273 = 298 K.",
    },
  },
];
