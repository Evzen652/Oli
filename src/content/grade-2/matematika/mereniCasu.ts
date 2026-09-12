import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

/**
 * Přepsáno 2026-09-11 (inventura obsahu): brána padala na hint_leak u výběru
 * ze dvou („Co je delší: 1 minuta nebo 1 sekunda?“), úlohy měly jednu
 * nápovědu, žádnou zpětnou vazbu a sekundy navzdory hranici „bez sekund“.
 *
 * Teď výběr ze 4 možností bez výčtu kandidátů ve znění otázky. Úrovně:
 *   L1 — rozpoznání: celé hodiny na ciferníku, 1 h = 60 min, 1 den = 24 h,
 *        půl hodiny.
 *   L2 — aplikace: půl a čtvrt na ciferníku, čtvrt a třičtvrtě hodiny v minutách.
 *   L3 — transfer: kdy něco skončí / začalo (inverze), jak dlouho to trvalo,
 *        hodina + minuty → minuty, kolik chybí do celé hodiny.
 */

const cas = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;

/** Vybere první 3 různé distraktory, které se liší od klíče. */
function vyber(question: string, key: string, cands: Distractor[], hints: [string, string], explanation: string): PracticeTask {
  const seen = new Set<string>([key]);
  const d: Distractor[] = [];
  for (const c of cands) {
    if (seen.has(c.value)) continue;
    seen.add(c.value);
    d.push(c);
    if (d.length === 3) break;
  }
  if (d.length < 3) throw new Error(`Málo distraktorů: ${question}`);
  return choice(question, key, d as [Distractor, Distractor, Distractor], { hints, explanation });
}

// ── L1 ──────────────────────────────────────────────────────────────────────

function celaHodina(h: number): PracticeTask {
  const dalsi = (h % 12) + 1;
  return vyber(
    `Malá ručička ukazuje na ${h}, velká na 12. Kolik je hodin?`,
    cas(h, 0),
    [
      { value: cas(h, 12), why: "Velká ručička na 12 neznamená 12 minut. Ukazuje nahoru, tedy celou hodinu bez minut." },
      { value: cas(h, 30), why: "Půl by bylo, kdyby velká ručička mířila dolů na 6." },
      { value: cas(12, (h * 5) % 60), why: "Prohodil jsi ručičky. Hodiny ukazuje malá ručička, velká ukazuje minuty." },
      { value: cas(dalsi, 0), why: `Malá ručička ukazuje na ${h}, ne na ${dalsi}. Hodinu čti podle malé ručičky.` },
    ],
    [
      `Která ručička ukazuje hodiny — malá, nebo velká? Malá teď míří na ${h}.`,
      `Velká ručička nahoře na 12 znamená celou hodinu, žádné minuty navíc. Hodinu ti řekne malá ručička, která míří na ${h}.`,
    ],
    `Malá ručička ukazuje hodiny: ${h}. Velká na 12 znamená 0 minut. Je tedy ${cas(h, 0)}.`,
  );
}

const L1_FAKTA: PracticeTask[] = [
  choice("Kolik minut má 1 hodina?", "60", [
    { value: "100", why: "Hodina se nedělí na sto minut jako metr na sto centimetrů. Spočítej dílky na ciferníku." },
    { value: "30", why: "30 minut je jen půl hodiny." },
    { value: "24", why: "24 je počet hodin za celý den, ne minut v hodině." },
  ], {
    hints: [
      "Velká ručička oběhne za hodinu celý ciferník. Kolik malých dílků přitom přejde?",
      "Na ciferníku je 12 velkých čísel a mezi každými dvěma sousedními je 5 dílků. Počítej po pěti: 5, 10, 15 a tak dál až dokola.",
    ],
    explanation: "Velká ručička oběhne za hodinu celý ciferník: 12 úseků po 5 minutách, 12 × 5 = 60 minut.",
  }),
  choice("Kolik hodin má 1 den?", "24", [
    { value: "12", why: "12 hodin oběhne malá ručička jen jednou — to je půl dne. Den má i noc." },
    { value: "60", why: "60 je počet minut v hodině, ne hodin ve dni." },
    { value: "10", why: "Čas se nepočítá po desítkách. Na ciferníku je 12 hodin a malá ručička ho za den oběhne víckrát." },
  ], {
    hints: [
      "Za den a noc oběhne malá ručička ciferník dvakrát. Kolik hodin je na ciferníku?",
      "Na ciferníku je 12 hodin. Malá ručička je oběhne jednou za den a jednou za noc — sečti 12 + 12.",
    ],
    explanation: "Den a noc dohromady: malá ručička oběhne ciferník dvakrát, 12 + 12 = 24 hodin.",
  }),
  choice("Kolik minut je půl hodiny?", "30", [
    { value: "50", why: "50 je půlka ze 100. Hodina má ale jen 60 minut." },
    { value: "15", why: "15 minut je čtvrt hodiny, ne půl." },
    { value: "60", why: "60 minut je celá hodina." },
  ], {
    hints: [
      "Za půl hodiny oběhne velká ručička jen polovinu ciferníku — od 12 dolů k 6.",
      "Celá hodina má 60 minut. Půl hodiny je polovina z toho: rozděl 60 na dvě stejné části.",
    ],
    explanation: "Hodina má 60 minut, polovina je 60 : 2 = 30 minut. Velká ručička přejde od 12 k 6.",
  }),
];

// ── L2 ──────────────────────────────────────────────────────────────────────

const PUL_GEN: Record<number, string> = {
  1: "jedné", 2: "druhé", 3: "třetí", 4: "čtvrté", 5: "páté", 6: "šesté", 7: "sedmé",
  8: "osmé", 9: "deváté", 10: "desáté", 11: "jedenácté", 12: "dvanácté",
};

function pulHodiny(h: number): PracticeTask {
  const dalsi = (h % 12) + 1;
  return vyber(
    `Malá ručička je mezi ${h} a ${dalsi}, velká ukazuje na 6. Kolik je hodin?`,
    cas(h, 30),
    [
      { value: cas(dalsi, 30), why: `Malá ručička ještě na ${dalsi} nedošla, je teprve v půlce cesty. Počítá se číslo, které už minula.` },
      { value: cas(h, 6), why: "Velká ručička na 6 neznamená 6 minut. Když míří dolů, uběhla půlhodina." },
      { value: cas(h, 15), why: "Čtvrt by bylo, kdyby velká ručička ukazovala na 3." },
    ],
    [
      `Malá ručička už minula ${h}. Co znamená, když velká ručička míří dolů na 6?`,
      `Velká ručička na 6 znamená, že uběhla polovina hodiny. Hodinu urči podle čísla, které malá ručička už minula (${h}), ne podle toho, ke kterému jde.`,
    ],
    `Malá ručička minula ${h}, velká na 6 = 30 minut. Je ${cas(h, 30)}, česky „půl ${PUL_GEN[dalsi]}“.`,
  );
}

function ctvrtHodiny(h: number): PracticeTask {
  return vyber(
    `Malá ručička je kousek za ${h}, velká ukazuje na 3. Kolik je hodin?`,
    cas(h, 15),
    [
      { value: cas(h, 3), why: "Velká ručička na 3 neznamená 3 minuty. Každé číslo na ciferníku je 5 minut." },
      { value: cas(h, 45), why: "Třičtvrtě by bylo, kdyby velká ručička ukazovala na 9." },
      { value: cas(h, 30), why: "Půl by bylo, kdyby velká ručička ukazovala dolů na 6." },
    ],
    [
      `Malá ručička je těsně za ${h}. Kolik minut ukazuje velká ručička na čísle 3?`,
      `Každé číslo na ciferníku znamená 5 minut. Počítej po pěti od 12 až k číslu 3. Hodina je ta, kterou malá ručička právě minula (${h}).`,
    ],
    `Velká ručička na 3 = 3 × 5 = 15 minut, tedy čtvrt hodiny. Malá minula ${h}, proto je ${cas(h, 15)}.`,
  );
}

const L2_FAKTA: PracticeTask[] = [
  choice("Kolik minut je čtvrt hodiny?", "15", [
    { value: "25", why: "25 je čtvrtina ze 100. Hodina má ale jen 60 minut." },
    { value: "30", why: "30 minut je půl hodiny, čtvrt je méně." },
    { value: "45", why: "45 minut je třičtvrtě hodiny." },
  ], {
    hints: [
      "Rozděl hodinu na čtyři stejné díly, jako když krájíš dort na čtvrtiny.",
      "Za čtvrt hodiny dojde velká ručička od 12 k číslu 3. Každé číslo na ciferníku je 5 minut — spočítej, kolik to je.",
    ],
    explanation: "Hodina má 60 minut, čtvrtina je 60 : 4 = 15 minut. Velká ručička přejde od 12 ke 3.",
  }),
  choice("Kolik minut je třičtvrtě hodiny?", "45", [
    { value: "30", why: "30 minut jsou jen dvě čtvrthodiny (půl hodiny)." },
    { value: "75", why: "75 jsou tři čtvrtiny ze 100. Hodina má ale jen 60 minut." },
    { value: "15", why: "15 minut je jen jedna čtvrthodina. Třičtvrtě jsou tři." },
  ], {
    hints: [
      "Třičtvrtě hodiny jsou tři čtvrthodiny za sebou. Kolik minut má jedna?",
      "Jedna čtvrthodina je tolik minut, kolik ukazuje velká ručička na čísle 3. Vezmi ji třikrát, nebo odečti jednu čtvrthodinu od celé hodiny.",
    ],
    explanation: "Čtvrt hodiny = 15 minut. Třičtvrtě = 15 + 15 + 15 = 45 minut (nebo 60 − 15).",
  }),
];

// ── L3 ──────────────────────────────────────────────────────────────────────

function zaMinut(s: number, d: number, co: string): PracticeTask {
  return vyber(
    `Je ${cas(s, 0)}. Za ${pad(d, "MINUTA")} začne ${co}. Kolik bude hodin?`,
    cas(s, d),
    [
      { value: cas(s + 1, d), why: `Přidal jsi navíc celou hodinu. ${pad(d, "MINUTA")} je méně než hodina, číslo hodin se nezmění.` },
      { value: cas(s, 60 - d), why: `Spletl sis čtvrt a třičtvrtě. Posunout se máš o ${pad(d, "MINUTA")}.` },
      { value: cas(s + 1, 0), why: "Celá hodina ještě neuběhne — přidáváš méně než 60 minut." },
      { value: cas(s, d === 45 ? 30 : d + 15), why: `Posunul ses o ${pad(15, "MINUTA")} ${d === 45 ? "méně" : "víc"}, než máš. Posunout se máš přesně o ${pad(d, "MINUTA")}.` },
    ],
    [
      `Teď je ${cas(s, 0)} a přidáváš ${pad(d, "MINUTA")}. Oběhne velká ručička celý ciferník?`,
      `Přidáváš méně než celou hodinu, takže číslo hodin zůstane. Posuň velkou ručičku od 12 o ${pad(d, "MINUTA")} a přečti minuty.`,
    ],
    `${pad(d, "MINUTA")} je méně než hodina, hodina se nemění. ${cas(s, 0)} + ${d} min = ${cas(s, d)}.`,
  );
}

function trvaHodin(s: number, k: number, co: string): PracticeTask {
  const e = s + k;
  return vyber(
    `${co} začíná v ${cas(s, 0)} a trvá ${pad(k, "HODINA")}. Kdy skončí?`,
    cas(e, 0),
    [
      { value: cas(e + 1, 0), why: `Přičetl jsi o hodinu víc. Trvá to ${pad(k, "HODINA")}.` },
      { value: cas(e - 1, 0), why: `Přičetl jsi o hodinu méně. Trvá to ${pad(k, "HODINA")}.` },
      { value: cas(s, k), why: `Přičetl jsi ${k} k minutám. ${pad(k, "HODINA")} se přičítají k číslu hodin.` },
    ],
    [
      `${co} trvá celé hodiny. Ke kterému číslu v zápisu ${cas(s, 0)} je přičteš?`,
      `Minuty zůstanou nulové, mění se jen hodiny. K ${s} přičti ${k} — třeba počítej po jedné hodině na prstech.`,
    ],
    `Celé hodiny se přičítají k hodinám: ${s} + ${k} = ${e}. Skončí v ${cas(e, 0)}.`,
  );
}

function kdyZacal(e: number, k: number, co: string): PracticeTask {
  const s = e - k;
  return vyber(
    `${co} skončil v ${cas(e, 0)}. Trval ${pad(k, "HODINA")}. Kdy začal?`,
    cas(s, 0),
    [
      { value: cas(e + k, 0), why: "Přičetl jsi. Začátek je ale dřív než konec, proto se hodiny odečítají." },
      { value: cas(s + 1, 0), why: `Odečetl jsi o hodinu méně. Mezi začátkem a koncem musí uběhnout ${pad(k, "HODINA")}.` },
      { value: cas(s - 1, 0), why: `Odečetl jsi o hodinu víc. Mezi začátkem a koncem musí uběhnout ${pad(k, "HODINA")}.` },
    ],
    [
      `Začal ${co.toLowerCase()} dřív, nebo později než v ${cas(e, 0)}?`,
      `Začátek je před koncem, proto jdi v čase zpátky: od ${e} odečti ${k}. Pak zkontroluj: začátek a k němu ${pad(k, "HODINA")} musí dát konec.`,
    ],
    `Jdeme zpátky: ${e} − ${k} = ${s}. Začal v ${cas(s, 0)}, protože ${cas(s, 0)} + ${pad(k, "HODINA")} = ${cas(e, 0)}.`,
  );
}

function jakDlouho(s: number, m: number, co: string): PracticeTask {
  return vyber(
    `${co} začal v ${cas(s, 0)} a skončil v ${cas(s, m)}. Jak dlouho trval?`,
    pad(m, "MINUTA"),
    [
      { value: pad(60 - m, "MINUTA"), why: "To je doba, která zbývá do celé hodiny, ne doba, kterou to trvalo." },
      { value: pad(m + 10, "MINUTA"), why: `Uběhlo méně. Velká ručička se posunula od 12 jen k ${m / 5}.` },
      { value: pad(s, "HODINA"), why: `${s} je číslo hodin na začátku. Trvalo to méně než hodinu.` },
    ],
    [
      `Číslo hodin se nezměnilo, pořád je ${s}. Změnily se jen minuty.`,
      `Od ${cas(s, 0)} do ${cas(s, m)} se posunula jen velká ručička. Kolik minut ukazuje na konci, když na začátku ukazovala 0?`,
    ],
    `Hodina zůstala ${s}, minuty se změnily z 0 na ${m}. Trval tedy ${pad(m, "MINUTA")}.`,
  );
}

function hodinaAMinuty(m: number): PracticeTask {
  const key = 60 + m;
  return vyber(
    `Kolik minut je 1 hodina a ${pad(m, "MINUTA")}?`,
    String(key),
    [
      { value: String(100 + m), why: "Počítal jsi hodinu jako 100 minut. Hodina má ale jen 60 minut." },
      { value: String(m + 1), why: "Hodinu jsi přičetl jako 1 minutu. Nejdřív ji převeď na minuty." },
      { value: String(key + 10), why: `O deset víc. Zkontroluj součet 60 + ${m}.` },
      { value: String(key - 10), why: `O deset méně. Zkontroluj součet 60 + ${m}.` },
    ],
    [
      `Převeď nejdřív tu 1 hodinu na minuty. Pak přidej ${pad(m, "MINUTA")}.`,
      `Kolik minut má celá hodina? K tomu číslu přičti ještě ${m} — nejdřív desítky, pak jednotky.`,
    ],
    `1 hodina = 60 minut. 60 + ${m} = ${key} minut.`,
  );
}

function doCeleHodiny(m: number): PracticeTask {
  const key = 60 - m;
  return vyber(
    `Uběhlo ${pad(m, "MINUTA")} z hodiny. Kolik minut zbývá do celé hodiny?`,
    String(key),
    [
      { value: String(100 - m), why: "Počítal jsi s hodinou o 100 minutách. Hodina má ale jen 60 minut." },
      { value: String(m), why: `${pad(m, "MINUTA")} už uběhlo. Otázka se ptá, kolik ještě zbývá.` },
      { value: String(key + 10), why: `O deset víc. Zkontroluj rozdíl 60 − ${m}.` },
      { value: String(key - 5), why: `O pět méně. Zkontroluj rozdíl 60 − ${m}.` },
    ],
    [
      `Celá hodina má kolik minut? Z nich už uběhlo ${m}.`,
      `Od počtu minut v celé hodině odečti ${m}, které už uběhly. Nebo dopočítávej: od ${m} přidávej po pěti, dokud nedojdeš na celou hodinu.`,
    ],
    `Hodina má 60 minut, uběhlo ${m}. Zbývá 60 − ${m} = ${key} minut.`,
  );
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle([...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(celaHodina), ...L1_FAKTA]);
  if (level === 2)
    return shuffle([
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(pulHodiny),
      ...[2, 4, 5, 7, 8, 10].map(ctvrtHodiny),
      ...L2_FAKTA,
    ]);
  return shuffle([
    zaMinut(8, 45, "přestávka"),
    zaMinut(7, 30, "snídaně"),
    zaMinut(9, 15, "trénink"),
    zaMinut(10, 45, "oběd"),
    zaMinut(16, 30, "pohádka"),
    zaMinut(11, 15, "kroužek"),
    trvaHodin(15, 2, "Film"),
    trvaHodin(9, 3, "Výlet"),
    trvaHodin(16, 2, "Oslava"),
    trvaHodin(8, 4, "Vyučování"),
    kdyZacal(18, 2, "Trénink"),
    kdyZacal(11, 3, "Výlet"),
    kdyZacal(17, 2, "Kroužek"),
    kdyZacal(10, 2, "Závod"),
    jakDlouho(16, 45, "Trénink"),
    jakDlouho(10, 20, "Závod"),
    jakDlouho(8, 35, "Test"),
    jakDlouho(17, 50, "Kroužek"),
    ...[10, 20, 25, 35].map(hodinaAMinuty),
    ...[35, 40, 50, 25].map(doCeleHodiny),
  ]);
}

export const MERENICASU: TopicMetadata[] = [
  {
    id: "g2-mat-mereni-casu",
    rvpNodeId:
      "g2-matematika-zavislosti-vztahy-a-prace-s-daty-mereni-a-jednotky-mereni-casu-hodina-minuta",
    title: "Měření času (hodina, minuta)",
    studentTitle: "Kolik je hodin?",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Měření a jednotky",
    briefDescription: "Poznáš, kolik minut má hodina a čtvrthodina.",
    keywords: ["čas", "hodina", "minuta", "půl hodiny", "čtvrthodina", "hodiny"],
    goals: [
      "Znát, že 1 hodina = 60 minut.",
      "Určit půl hodiny (30 min) a čtvrthodinu (15 min).",
      "Počítat s časovými údaji.",
    ],
    boundaries: ["Pouze hodiny a minuty.", "Bez sekund a složitých přepočtů."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "1 hodina = 60 minut. Půl hodiny = 30 minut. Čtvrt hodiny = 15 minut.",
      steps: [
        "1 hodina má 60 minut.",
        "Půl hodiny = 60 ÷ 2 = 30 minut.",
        "Čtvrt hodiny = 60 ÷ 4 = 15 minut.",
      ],
      commonMistake: "Záměna 30 a 15 — půl = 30, čtvrt = 15.",
      example: "2 hodiny = 2 × 60 = 120 minut.",
    },
  },
];
