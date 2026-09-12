import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu): dřív měly úlohy jednu šablonovou
// nápovědu na tvar, žádnou zpětnou vazbu a úrovně se lišily jen velikostí čísel.
// Teď oddělené úrovně s vlastním chybovým modelem u každého tvaru:
// L1 obvod přímo ze všech stran (čtverec, obecný trojúhelník) ·
// L2 stran je méně zadaných, než kolik jich tvar má (obdélník, rovnostranný
//    a rovnoramenný trojúhelník) — musí se doplnit ze vlastností tvaru ·
// L3 inverze (strana z obvodu), dva kroky (plot s brankou), převod jednotek.
// Konstanty 2, 3, 4 píšeme v nápovědách slovy: u inverzních úloh bývá strana
// právě 2–4 cm a číslice v nápovědě by vypadala jako prozrazený výsledek.

interface Uloha {
  q: string;
  /** Hodnota klíče (číslo) a jednotka. */
  v: number;
  u: string;
  h0: string;
  h1: string;
  e: string;
  /** Distraktory jako čísla ve stejné jednotce. */
  d: { v: number; why: string }[];
  /** Zápis výpočtu pro náhradní distraktor ±10. */
  calc: string;
}

function sestav(x: Uloha): PracticeTask | null {
  const ans = `${x.v} ${x.u}`;
  if (x.v <= 0 || x.q.includes(ans)) return null;
  const kandidati = [
    ...x.d,
    { v: x.v + 10, why: `Přepočítej ${x.calc}: vyšlo ti o 10 víc — pozor na přechod přes desítku.` },
    { v: x.v - 10, why: `Přepočítej ${x.calc}: vyšlo ti o 10 méně — pozor na přechod přes desítku.` },
  ];
  const videno = new Set([ans]);
  const out: Distractor[] = [];
  for (const k of kandidati) {
    const val = `${k.v} ${x.u}`;
    if (!Number.isInteger(k.v) || k.v <= 0 || videno.has(val)) continue;
    videno.add(val);
    out.push({ value: val, why: k.why });
    if (out.length === 3) break;
  }
  if (out.length < 3) return null;
  return choice(x.q, ans, out as [Distractor, Distractor, Distractor], { hints: [x.h0, x.h1], explanation: x.e });
}

const trojuhelnik = (a: number, b: number, c: number) => a + b > c && a + c > b && b + c > a;

// ── L1: obvod ze všech stran ───────────────────────────────────────────────

function ctverec(a: number): Uloha {
  const o = 4 * a;
  return {
    q: `Čtverec má stranu ${a} cm. Jaký je jeho obvod?`,
    v: o, u: "cm", calc: `4 × ${a}`,
    h0: `Čtverec má čtyři strany a každá z nich měří ${a} cm.`,
    h1: `Obvod je součet všech stran: ${a} + ${a} + ${a} + ${a}. Rychleji to spočítáš násobením — čtyřikrát ${a} cm. Výsledek zapiš v centimetrech.`,
    e: `Čtverec má čtyři stejné strany, proto je obvod 4 × ${a} = ${o} cm (stejně jako ${a} + ${a} + ${a} + ${a}).`,
    d: [
      { v: 3 * a, why: "Sečetl jsi jen tři strany — čtverec jich má čtyři." },
      { v: 2 * a, why: "To jsou jen dvě strany — čtverec jich má čtyři." },
      // a × a jen u malých stran — u větších by vyšlo nápadně velké číslo (15 × 15 = 225).
      ...(a <= 9 ? [{ v: a * a, why: `Vynásobil jsi stranu stranou (${a} × ${a}). Obvod je ale součet všech čtyř stran.` }] : []),
      { v: a + 4, why: `K ${a} jsi přičetl 4, ale čtyři strany znamenají čtyřikrát ${a}.` },
    ],
  };
}

function obecnyTrojuhelnik(a: number, b: number, c: number): Uloha {
  const o = a + b + c;
  return {
    q: `Trojúhelník má strany ${a} cm, ${b} cm a ${c} cm. Jaký je jeho obvod?`,
    v: o, u: "cm", calc: `${a} + ${b} + ${c}`,
    h0: `Kolik stran má trojúhelník? Sečti délky všech: ${a}, ${b} a ${c} cm.`,
    h1: `Sčítej postupně: nejdřív ${a} + ${b}, pak k mezivýsledku přičti ${c}. Každou stranu přičti právě jednou a výsledek zapiš v centimetrech.`,
    e: `Obvod je délka čáry kolem celého trojúhelníku, tedy součet všech tří stran: ${a} + ${b} + ${c} = ${o} cm.`,
    d: [
      { v: a + b, why: `Chybí strana ${c} cm — sečetl jsi jen dvě strany.` },
      { v: b + c, why: `Chybí strana ${a} cm — sečetl jsi jen dvě strany.` },
      { v: a + c, why: `Chybí strana ${b} cm — sečetl jsi jen dvě strany.` },
    ],
  };
}

// ── L2: strany doplnit z vlastností tvaru ──────────────────────────────────

function obdelnik(a: number, b: number): Uloha {
  const o = 2 * (a + b);
  return {
    q: `Obdélník má délku ${a} cm a šířku ${b} cm. Jaký je jeho obvod?`,
    v: o, u: "cm", calc: `2 × (${a} + ${b})`,
    h0: `Obdélník má dvě delší strany po ${a} cm a dvě kratší po ${b} cm.`,
    h1: `Sečti jednu delší a jednu kratší stranu (${a} + ${b}) — to je polovina obvodu. Protože má obdélník každou z těch stran dvakrát, výsledek zdvojnásob.`,
    e: `Obdélník má dvě strany dlouhé ${a} cm a dvě široké ${b} cm: ${a} + ${b} + ${a} + ${b} = ${o} cm, zkráceně 2 × (${a} + ${b}) = 2 × ${a + b} = ${o} cm.`,
    d: [
      { v: a + b, why: `${a + b} cm je jen polovina obvodu — jedna délka a jedna šířka.` },
      { v: 2 * a + b, why: `Zapomněl jsi na druhou kratší stranu (${b} cm).` },
      { v: a + 2 * b, why: `Zapomněl jsi na druhou delší stranu (${a} cm).` },
      { v: a * b, why: "Vynásobil jsi délku a šířku — obvod je ale součet všech čtyř stran." },
    ],
  };
}

function zahrada(a: number, b: number): Uloha {
  const o = 2 * (a + b);
  return {
    q: `Zahrada tvaru obdélníku je dlouhá ${a} m a široká ${b} m. Kolik metrů měří její obvod?`,
    v: o, u: "m", calc: `2 × (${a} + ${b})`,
    h0: `Kolem zahrady vedou dvě strany po ${a} m a dvě strany po ${b} m.`,
    h1: `Obejdi zahradu v duchu dokola: ${a} m, ${b} m, ${a} m, ${b} m. Sečti všechny čtyři úseky nebo sečti ${a} + ${b} a výsledek vezmi dvakrát.`,
    e: `Obvod zahrady je ${a} + ${b} + ${a} + ${b} = 2 × (${a} + ${b}) = ${o} m, protože obdélník má dvě délky a dvě šířky.`,
    d: [
      { v: a + b, why: `${a + b} m je jen polovina cesty kolem zahrady — jedna délka a jedna šířka.` },
      { v: 2 * a + b, why: `Zapomněl jsi na druhou šířku (${b} m).` },
      { v: a + 2 * b, why: `Zapomněl jsi na druhou délku (${a} m).` },
    ],
  };
}

function rovnostranny(a: number): Uloha {
  const o = 3 * a;
  return {
    q: `Rovnostranný trojúhelník má stranu ${a} cm. Jaký je jeho obvod?`,
    v: o, u: "cm", calc: `3 × ${a}`,
    h0: `Rovnostranný trojúhelník má všechny tři strany stejně dlouhé — každá měří ${a} cm.`,
    h1: `Sečti ${a} + ${a} + ${a} nebo rychleji vynásob: třikrát ${a} cm. Pozor, trojúhelník má jen tři strany, ne čtyři jako čtverec. Výsledek zapiš v centimetrech.`,
    e: `Všechny tři strany rovnostranného trojúhelníku měří ${a} cm, proto obvod = 3 × ${a} = ${o} cm.`,
    d: [
      { v: 4 * a, why: "Počítal jsi čtyři strany jako u čtverce — trojúhelník má tři." },
      { v: 2 * a, why: "Sečetl jsi jen dvě strany — trojúhelník má tři." },
      { v: a + 3, why: `K ${a} jsi přičetl 3, ale tři strany znamenají třikrát ${a}.` },
      { v: a * a, why: `Vynásobil jsi stranu stranou (${a} × ${a}). Obvod je součet stran.` },
    ],
  };
}

function rovnoramenny(z: number, r: number): Uloha {
  const o = z + 2 * r;
  return {
    q: `Rovnoramenný trojúhelník má základnu ${z} cm a obě ramena po ${r} cm. Jaký je jeho obvod?`,
    v: o, u: "cm", calc: `${z} + ${r} + ${r}`,
    h0: `Trojúhelník má tři strany: základnu ${z} cm a dvě stejná ramena po ${r} cm.`,
    h1: `Rameno započítej dvakrát — sečti ${r} + ${r} a pak přičti základnu ${z}. Každou ze tří stran započítej právě jednou.`,
    e: `Obvod = základna + rameno + rameno = ${z} + ${r} + ${r} = ${o} cm. Základna je jen jedna, ramena jsou dvě.`,
    d: [
      { v: z + r, why: "Započítal jsi jen jedno rameno — rovnoramenný trojúhelník má ramena dvě." },
      { v: 2 * z + r, why: `Prohodil jsi základnu a rameno: dvakrát se počítá rameno (${r} cm), ne základna.` },
      { v: 2 * (z + r), why: "Počítal jsi jako u obdélníku (čtyři strany) — trojúhelník má jen tři." },
    ],
  };
}

// ── L3: inverze, dva kroky, převod jednotek ────────────────────────────────

function stranaCtverce(a: number): Uloha {
  const o = 4 * a;
  return {
    q: `Obvod čtverce je ${o} cm. Jak dlouhá je jeho strana?`,
    v: a, u: "cm", calc: `${o} ÷ 4`,
    h0: `Obvod ${o} cm se skládá ze čtyř stejně dlouhých stran.`,
    h1: `Hledáš délku, která čtyřikrát sečtená dá ${o} cm. Vyděl tedy obvod ${o} čtyřmi a zkouškou ověř, že čtyřikrát strana vrátí celý obvod.`,
    e: `Čtverec má čtyři stejné strany, proto strana = ${o} ÷ 4 = ${a} cm. Zkouška: 4 × ${a} = ${o} cm.`,
    d: [
      { v: o / 2, why: "Dělil jsi dvěma — čtverec má ale čtyři strany, takže se dělí čtyřmi." },
      { v: o - 4, why: "Od obvodu jsi odečetl 4 — čtyři stejné strany ale znamenají obvod čtyřmi vydělit." },
      { v: a + 1, why: `Zkouška: 4 × ${a + 1} = ${4 * (a + 1)} cm, to není ${o} cm.` },
      { v: a - 1, why: `Zkouška: 4 × ${a - 1} = ${4 * (a - 1)} cm, to není ${o} cm.` },
    ],
  };
}

function stranaObdelniku(a: number, b: number): Uloha {
  const o = 2 * (a + b);
  return {
    q: `Obdélník má obvod ${o} cm a jeho delší strana měří ${a} cm. Jak dlouhá je kratší strana?`,
    v: b, u: "cm", calc: `${o} ÷ 2 − ${a}`,
    h0: `Polovina obvodu ${o} cm je součet delší strany (${a} cm) a kratší strany.`,
    h1: `Nejdřív vyděl obvod ${o} dvěma — dostaneš délku + šířku dohromady. Potom od tohoto součtu odečti delší stranu ${a} cm, zbude kratší strana. Nakonec udělej zkoušku.`,
    e: `Polovina obvodu je ${o} ÷ 2 = ${a + b} cm, to je delší + kratší strana. Kratší strana tedy měří ${a + b} − ${a} = ${b} cm. Zkouška: 2 × (${a} + ${b}) = ${o} cm.`,
    d: [
      { v: o - a, why: "Od obvodu jsi odečetl jen jednu delší stranu. Obvod nejdřív vyděl dvěma." },
      { v: o / 2, why: `${o / 2} cm je delší + kratší strana dohromady — ještě odečti ${a} cm.` },
      { v: o - 2 * a, why: `${o - 2 * a} cm jsou obě kratší strany dohromady — jedna z nich je polovina.` },
    ],
  };
}

function tretiStrana(a: number, b: number, c: number): Uloha {
  const o = a + b + c;
  return {
    q: `Trojúhelník má obvod ${o} cm. Dvě strany měří ${a} cm a ${b} cm. Jak dlouhá je třetí strana?`,
    v: c, u: "cm", calc: `${o} − ${a} − ${b}`,
    h0: `Obvod ${o} cm je součet všech tří stran; dvě z nich znáš: ${a} cm a ${b} cm.`,
    h1: `Od obvodu ${o} odečti postupně obě známé strany (nejdřív ${a} cm, pak ${b} cm). Co zbude, připadá na třetí stranu. Zkouškou ověř, že součet tří stran dá ${o} cm.`,
    e: `Obvod je součet tří stran, takže třetí strana = ${o} − ${a} − ${b} = ${c} cm. Zkouška: ${a} + ${b} + ${c} = ${o} cm.`,
    d: [
      { v: o - a, why: `Odečetl jsi jen stranu ${a} cm — odečti ještě ${b} cm.` },
      { v: o - b, why: `Odečetl jsi jen stranu ${b} cm — odečti ještě ${a} cm.` },
      { v: a + b, why: `${a + b} cm je součet dvou známých stran, ne třetí strana.` },
    ],
  };
}

function plot(a: number, b: number, w: number): Uloha {
  const o = 2 * (a + b);
  const x = o - w;
  return {
    q: `Obdélníková zahrada měří ${a} m a ${b} m. Branka zabere ${w} m. Kolik metrů plotu kolem ní potřebujeme?`,
    v: x, u: "m", calc: `2 × (${a} + ${b}) − ${w}`,
    h0: `Nejdřív spočítej obvod zahrady s rozměry ${a} m a ${b} m, teprve pak mysli na branku širokou ${w} m.`,
    h1: `Krok 1: obvod obdélníku je dvakrát (${a} + ${b}). Krok 2: od obvodu odečti ${w} m, protože v místě branky plot nebude. Zkontroluj, že výsledek je o kousek menší než obvod.`,
    e: `Obvod zahrady je 2 × (${a} + ${b}) = ${o} m. Branka zabere ${w} m, takže plotu je potřeba ${o} − ${w} = ${x} m.`,
    d: [
      { v: o, why: `${o} m je celý obvod zahrady — ještě odečti branku (${w} m).` },
      { v: o + w, why: "Branku jsi přičetl, ale v jejím místě plot nebude." },
      { v: a + b - w, why: "Počítal jsi jen dvě strany zahrady — obdélník jich má čtyři." },
    ],
  };
}

function prevod(a: number, b: number): Uloha {
  const dcm = 10 * a;
  const o = 2 * (dcm + b);
  return {
    q: `Obdélník má délku ${a} dm a šířku ${b} cm. Jaký je jeho obvod v centimetrech?`,
    v: o, u: "cm", calc: `2 × (${dcm} + ${b})`,
    h0: `Strany jsou v různých jednotkách: ${a} dm a ${b} cm. Nejdřív je převeď na centimetry.`,
    h1: `Krok 1: jeden decimetr má deset centimetrů, převeď tedy ${a} dm na centimetry. Krok 2: obvod obdélníku je dvakrát (délka + šířka), teď už všechno v centimetrech.`,
    e: `${a} dm = ${dcm} cm. Obvod = 2 × (${dcm} + ${b}) = 2 × ${dcm + b} = ${o} cm. Sčítat se dají jen délky ve stejné jednotce.`,
    d: [
      { v: 2 * (a + b), why: `Nepřevedl jsi decimetry: ${a} dm není ${a} cm, ale ${dcm} cm.` },
      { v: dcm + b, why: "To je jen polovina obvodu — jedna délka a jedna šířka." },
      { v: 2 * dcm + b, why: `Zapomněl jsi na druhou šířku (${b} cm).` },
    ],
  };
}

// ── Pooly úrovní ───────────────────────────────────────────────────────────

function range(lo: number, hi: number): number[] {
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

/** Pool úrovně = skupiny podle typu úlohy (každá skupina jeden typ). */
function poolL1(): Uloha[][] {
  const troj: Uloha[] = [];
  for (const a of range(3, 12)) for (const b of range(a + 1, 13)) for (const c of range(b + 1, 14)) {
    if (trojuhelnik(a, b, c)) troj.push(obecnyTrojuhelnik(a, b, c));
  }
  return [range(2, 15).map(ctverec), troj];
}

function poolL2(): Uloha[][] {
  const obd: Uloha[] = [], zah: Uloha[] = [], rr: Uloha[] = [];
  for (const a of range(4, 20)) for (const b of range(2, a - 1)) obd.push(obdelnik(a, b));
  for (const a of range(12, 40)) for (const b of range(6, a - 2)) if ((a + b) % 3 === 0) zah.push(zahrada(a, b));
  for (const z of range(3, 16)) for (const r of range(3, 18)) if (r !== z && 2 * r > z) rr.push(rovnoramenny(z, r));
  return [obd, zah, range(3, 20).map(rovnostranny), rr];
}

function poolL3(): Uloha[][] {
  const obd: Uloha[] = [], troj: Uloha[] = [], pl: Uloha[] = [], pr: Uloha[] = [];
  for (const a of range(5, 20)) for (const b of range(2, a - 1)) obd.push(stranaObdelniku(a, b));
  for (const a of range(4, 14)) for (const b of range(a + 1, 15)) for (const c of range(3, 16)) {
    if (c !== a && c !== b && trojuhelnik(a, b, c)) troj.push(tretiStrana(a, b, c));
  }
  for (const a of range(8, 30)) for (const b of range(5, a - 1)) if ((a + b) % 4 === 0) pl.push(plot(a, b, 1 + ((a * b) % 4)));
  for (const a of range(2, 6)) for (const b of range(3, 9)) pr.push(prevod(a, b));
  return [range(3, 25).map(stranaCtverce), obd, troj, pl, pr];
}

/**
 * Z poolu vybere 30 úloh, a to rovnoměrně napříč typy,
 * aby početné typy (trojúhelníky) nepřehlušily málo početné (čtverce).
 */
function vyber(skupiny: Uloha[][]): PracticeTask[] {
  const fronty = skupiny.map((arr) => shuffle(arr));
  const out: PracticeTask[] = [];
  for (let i = 0; out.length < 30 && fronty.some((f) => f.length); i++) {
    const f = fronty[i % fronty.length];
    const u = f.pop();
    if (!u) continue;
    const t = sestav(u);
    if (t) out.push(t);
  }
  return shuffle(out);
}

function gen(level: number): PracticeTask[] {
  return vyber(level === 1 ? poolL1() : level === 2 ? poolL2() : poolL3());
}

export const OBVODTROJUHELNIKUCTVERCEOBD: TopicMetadata[] = [
  {
    id: "g3-mat-obvod-trojuhelniku-ctverce-obdelniku",
    rvpNodeId: "g3-matematika-geometrie-v-rovine-a-v-prostoru-rovinne-utvary-obvod-trojuhelniku-ctverce-obdelniku",
    title: "Obvod trojúhelníku, čtverce, obdélníku",
    studentTitle: "Obvod tvarů",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Rovinné útvary",
    briefDescription: "Spočítáš obvod trojúhelníku, čtverce a obdélníku.",
    keywords: ["obvod", "trojúhelník", "čtverec", "obdélník", "strany", "délka"],
    goals: [
      "Vypočítat obvod trojúhelníku jako součet tří stran.",
      "Vypočítat obvod čtverce: 4 × strana.",
      "Vypočítat obvod obdélníku: 2 × (délka + šířka).",
    ],
    boundaries: ["Celé délky stran v cm.", "Bez obsahu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Obvod = délka ohraničující čáry. Sečti všechny strany dohromady.",
      steps: [
        "Trojúhelník: o = a + b + c",
        "Čtverec: o = 4 × a (4 stejné strany)",
        "Obdélník: o = 2 × (a + b) (2 páry stejných stran)",
      ],
      commonMistake: "U čtverce: o = a × a (obsah!) — ale obvod je 4 × a.",
      example: "Obdélník 5 cm × 3 cm: o = 2 × (5 + 3) = 2 × 8 = 16 cm.",
    },
  },
];
