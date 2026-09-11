import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { plural } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu): původní pevné banky měly 7/7/7 řad,
// jednu obecnou nápovědu a žádnou zpětnou vazbu. Teď parametrický generátor,
// jehož nápovědy, vysvětlení i zpětná vazba počítají s čísly konkrétní úlohy.
//
// L1 rozpoznání — soused hned před/za, číslo mezi dvěma sousedy, řada po desítkách.
// L2 aplikace   — řada s krokem 2, 5 nebo 10 od libovolného čísla, mezi kterými desítkami číslo leží.
// L3 transfer   — skoky po ose (více kroků), vzdálenost dvou čísel, klesající řada.

const M = "−"; // U+2212

const rnd = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const dilky = (n: number) => `${n} ${plural(n, "dílek", "dílky", "dílků")}`;
const skoky = (n: number) => `${n} ${plural(n, "skok", "skoky", "skoků")}`;
const poSkocich = (n: number) => `${n} ${plural(n, "skoku", "skocích", "skocích")}`;

interface Built {
  q: string;
  ans: number | string;
  cands: { v: number | string; why: string }[];
  h0: string;
  h1: string;
  expl: string;
}

/** Vybere 3 různé platné distraktory (čísla 0–100, ≠ klíč) a ověří, že nápověda klíč neprozradí. */
function finish(b: Built): PracticeTask | null {
  const ans = String(b.ans);
  const seen = new Set([ans]);
  const ds: Distractor[] = [];
  for (const c of b.cands) {
    const v = String(c.v);
    if (seen.has(v)) continue;
    if (typeof c.v === "number" && (!Number.isInteger(c.v) || c.v < 0 || c.v > 100)) continue;
    seen.add(v);
    ds.push({ value: v, why: c.why });
    if (ds.length === 3) break;
  }
  if (ds.length < 3) return null;
  const esc = ans.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const leak = new RegExp(`(^|[^\\d])${esc}([^\\d]|$)`);
  if (leak.test(b.h0) || leak.test(b.h1)) return null;
  return choice(b.q, ans, ds as [Distractor, Distractor, Distractor], { hints: [b.h0, b.h1], explanation: b.expl });
}

// ── L1 ───────────────────────────────────────────────────────────────────────

function soused(): Built {
  if (Math.random() < 0.5) {
    const n = rnd(11, 98), c = n + 1;
    const cands = [
      { v: n - 1, why: `${n - 1} leží hned před číslem ${n}, ne za ním. Za číslem jsou na ose čísla větší.` },
      { v: n + 10, why: `Posunul ses o celou desítku. „Hned za“ znamená jen o jeden dílek.` },
      { v: n + 2, why: `${n + 2} je až o dva dílky dál — jedno číslo jsi přeskočil.` },
    ];
    if (n % 10 === 9) cands.unshift({ v: n - 9, why: `Jednotky jsi změnil na nulu, ale desítku jsi nepřidal. Po devítce na místě jednotek začíná nová desítka.` });
    return {
      q: `Které číslo je na číselné ose hned za číslem ${n}?`,
      ans: c,
      cands: n % 10 === 9 ? cands : shuffle(cands),
      h0: `Na číselné ose rostou čísla zleva doprava. Kterým směrem se od ${n} posuneš?`,
      h1: `„Hned za“ znamená o jeden dílek doprava, tedy o 1 víc než ${n}. Přičti jedničku a zkontroluj, jestli se nezmění i počet desítek.`,
      expl: `Hned za číslem ${n} leží číslo o 1 větší: ${n} + 1 = ${c}.`,
    };
  }
  const n = rnd(11, 99), c = n - 1;
  const cands = [
    { v: n + 1, why: `${n + 1} leží hned za číslem ${n}, ne před ním. Před číslem jsou na ose čísla menší.` },
    { v: n - 10, why: `Posunul ses o celou desítku. „Hned před“ znamená jen o jeden dílek.` },
    { v: n - 2, why: `${n - 2} je až o dva dílky dál — jedno číslo jsi přeskočil.` },
  ];
  if (n % 10 === 0) cands.unshift({ v: n + 9, why: `Jednotky jsi změnil na devítku, ale desítku jsi neubral. Před celou desítkou končí desítka předchozí.` });
  return {
    q: `Které číslo je na číselné ose hned před číslem ${n}?`,
    ans: c,
    cands: n % 10 === 0 ? cands : shuffle(cands),
    h0: `Na číselné ose rostou čísla zleva doprava. Na které straně od ${n} leží menší čísla?`,
    h1: `„Hned před“ znamená o jeden dílek doleva, tedy o 1 méně než ${n}. Uber jedničku a zkontroluj, jestli se nezmění i počet desítek.`,
    expl: `Hned před číslem ${n} leží číslo o 1 menší: ${n} ${M} 1 = ${c}.`,
  };
}

function mezi(): Built {
  const n = rnd(11, 98), lo = n - 1, hi = n + 1;
  const swap = (n % 10) * 10 + Math.floor(n / 10);
  const cands = shuffle([
    { v: lo, why: `${lo} je jedno z čísel ze zadání. Hledáš to, které leží mezi ${lo} a ${hi}.` },
    { v: hi, why: `${hi} je jedno z čísel ze zadání. Hledáš to, které leží mezi ${lo} a ${hi}.` },
    { v: n + 10, why: `${n + 10} leží o celou desítku dál, až za číslem ${hi}.` },
    { v: n - 10, why: `${n - 10} leží o celou desítku dřív, ještě před číslem ${lo}.` },
    ...(n % 10 !== 0 && swap !== n ? [{ v: swap, why: `Přehodil jsi číslice — ${swap} leží na ose úplně jinde.` }] : []),
  ]);
  return {
    q: `Které číslo leží na číselné ose mezi ${lo} a ${hi}?`,
    ans: n,
    cands,
    h0: `Najdi si na ose čísla ${lo} a ${hi}. Které číslo leží přesně mezi nimi?`,
    h1: `Od ${lo} k ${hi} jsou to dva dílky. Uprostřed je číslo o 1 větší než ${lo} a zároveň o 1 menší než ${hi}. Ověř obě podmínky.`,
    expl: `${lo} + 1 = ${n} a ${n} + 1 = ${hi}, proto ${n} leží mezi ${lo} a ${hi}.`,
  };
}

/** Řada po desítkách od celé desítky (L1): 0, 10, 20, … */
function radaPoDesitkach(): Built {
  const s0 = rnd(0, 5) * 10, idx = rnd(1, 3);
  const row = [0, 1, 2, 3, 4].map((i) => s0 + i * 10);
  const c = row[idx], prev = row[idx - 1], next = row[idx + 1];
  const shown = row.map((x, i) => (i === idx ? "___" : String(x))).join(", ");
  return {
    q: `Co chybí na ose? ${shown}`,
    ans: c,
    cands: shuffle([
      { v: prev + 1, why: `Posunul ses od ${prev} jen o 1 dílek. Čísla v této řadě rostou vždy o celou desítku.` },
      { v: prev + 5, why: `${prev + 5} leží jen v půlce cesty mezi ${prev} a dalším číslem řady.` },
      { v: next, why: `${next} už v řadě je — stojí hned za mezerou.` },
      { v: prev, why: `${prev} už v řadě je — stojí hned před mezerou.` },
    ]),
    h0: `Řada začíná číslem ${s0}. O kolik se čísla zvětšují a co přijde po ${prev}?`,
    h1: `Každé další číslo má o jednu desítku víc. K číslu ${prev} přidej desítku a ověř, že od výsledku k ${next} je to zase přesně o desítku.`,
    expl: `Čísla v řadě rostou po desítkách: ${prev} + 10 = ${c} a ${c} + 10 = ${next}.`,
  };
}

// ── L2 ───────────────────────────────────────────────────────────────────────

/** Rostoucí řada s krokem 2, 5 nebo 10 od libovolného čísla. */
function radaSKrokem(): Built | null {
  const step = pick([2, 5, 10]);
  const start = step === 10 ? rnd(1, 5) * 10 + rnd(1, 9) : step === 5 ? rnd(1, 16) * 5 : rnd(10, 90);
  const row = [0, 1, 2, 3, 4].map((i) => start + i * step);
  if (row[4] > 100) return null;
  const idx = rnd(1, 4);
  const c = row[idx], prev = row[idx - 1];
  const next = idx < 4 ? row[idx + 1] : undefined;
  const [x, y] = idx >= 2 ? [row[0], row[1]] : [row[2], row[3]];
  const shown = row.map((v, i) => (i === idx ? "___" : String(v))).join(", ");
  return {
    q: `Co chybí na ose? ${shown}`,
    ans: c,
    cands: shuffle([
      { v: prev + 1, why: `Posunul ses od ${prev} jen o 1. V této řadě se skáče vždy o ${step}.` },
      { v: c + step, why: next !== undefined ? `${c + step} už v řadě je — stojí hned za mezerou.` : `${c + step} je o krok dál, než hledáš — k ${prev} jsi přičetl krok dvakrát.` },
      { v: c + 1, why: `Je o 1 větší. Zkontroluj, že od ${prev} k tvému číslu je přesně ${step}.` },
      { v: c - 1, why: `Je o 1 menší. Zkontroluj, že od ${prev} k tvému číslu je přesně ${step}.` },
    ]),
    h0: `Porovnej sousední čísla ${x} a ${y}. O kolik se čísla v řadě zvětšují a co přijde po ${prev}?`,
    h1: `Krok řady je ${step}: každé číslo je o ${step} větší než to před ním. Přičti ${step} k číslu ${prev}${next !== undefined ? ` a ověř, že od výsledku k ${next} je to zase o ${step}` : " a ověř to i na ostatních číslech řady"}.`,
    expl: `Čísla v řadě rostou o ${step} (${x} + ${step} = ${y}). Proto ${prev} + ${step} = ${c}.`,
  };
}

function meziDesitkami(): Built {
  const t = rnd(1, 8), u = rnd(1, 9), n = t * 10 + u;
  const ans = `${t * 10} a ${(t + 1) * 10}`;
  const cands = [
    { v: `${(t - 1) * 10} a ${t * 10}`, why: `Všechna čísla mezi ${(t - 1) * 10} a ${t * 10} jsou menší než ${t * 10}, ale ${n} je větší.` },
    { v: `${(t + 1) * 10} a ${(t + 2) * 10}`, why: `Všechna čísla mezi ${(t + 1) * 10} a ${(t + 2) * 10} jsou větší než ${(t + 1) * 10}, ale ${n} je menší.` },
    { v: `${n} a ${(t + 1) * 10}`, why: `${n} není celá desítka — celé desítky končí nulou. Hledáš dvě desítky, mezi kterými ${n} leží.` },
  ];
  if (u !== t && Math.abs(u - t) > 1) cands.unshift({ v: `${u * 10} a ${(u + 1) * 10}`, why: `To jsou desítky kolem čísla ${u}${t} — přehodil jsi číslice.` });
  return {
    q: `Mezi kterými dvěma desítkami leží na ose číslo ${n}?`,
    ans,
    cands: shuffle(cands),
    h0: `Podívej se na první číslici čísla ${n}. Kolik celých desítek číslo ${n} obsahuje?`,
    h1: `Číslo ${n} je o něco větší než celá desítka s tolika desítkami, kolik ukazuje první číslice, a menší než desítka hned po ní. Obě desítky najdi na ose a ověř, že ${n} leží mezi nimi.`,
    expl: `${n} má ${t} ${plural(t, "desítku", "desítky", "desítek")} a ${u} ${plural(u, "jednotku", "jednotky", "jednotek")}, proto je větší než ${t * 10} a menší než ${(t + 1) * 10}.`,
  };
}

// ── L3 ───────────────────────────────────────────────────────────────────────

const SLOVO_KROK: Record<number, string> = { 2: "dvou", 5: "pěti", 10: "deseti" };

function zabka(): Built | null {
  const step = pick([2, 5, 10]), k = rnd(2, 4), fwd = Math.random() < 0.5;
  const span = k * step;
  const s = fwd ? rnd(3, 99 - span) : rnd(span + 1, 97);
  if (s < 1 || s > 99) return null;
  const sg = fwd ? 1 : -1;
  const c = s + sg * span;
  const smer = fwd ? "dopředu" : "dozadu";
  return {
    q: `Žabka skáče z ${s} po ${SLOVO_KROK[step]} ${smer}. Kde bude po ${poSkocich(k)}?`,
    ans: c,
    cands: shuffle([
      { v: s + sg * (k - 1) * step, why: `Tam je žabka už po ${poSkocich(k - 1)} — jeden skok ti chybí.` },
      { v: s + sg * (k + 1) * step, why: `Tam je žabka až po ${poSkocich(k + 1)} — jeden skok navíc. Výchozí číslo ${s} se jako skok nepočítá.` },
      { v: s - sg * span, why: `Skákal jsi opačným směrem. ${fwd ? "Dopředu znamená k větším číslům." : "Dozadu znamená k menším číslům."}` },
      { v: s + sg * k, why: `Posunul ses jen o ${dilky(k)}, ale každý skok měří ${step}.` },
    ]),
    h0: `Skákej se žabkou z ${s} ${fwd ? "doprava k větším" : "doleva k menším"} číslům, pokaždé o ${step}. Skoky počítej na prstech.`,
    h1: `Po prvním skoku bude žabka na ${s + sg * step}. Pokračuj vždy o ${step} ${fwd ? "dál" : "zpátky"}, dokud nenapočítáš ${skoky(k)} — a pak přečti, kde žabka stojí.`,
    // k je 2–4, proto „jsou" (u 5 a víc by bylo „je").
    expl: `${skoky(k)} po ${step} jsou dohromady ${span}, a to ${fwd ? "dopředu" : "dozadu"}: ${fwd ? `${s} + ${span}` : `${s} ${M} ${span}`} = ${c}.`,
  };
}

function vzdalenost(): Built | null {
  const a = rnd(11, 79), b = a + rnd(11, 49);
  if (b > 99 || a % 10 === 0 || b % 10 === 0) return null;
  const c = b - a;
  const au = a % 10, bu = b % 10, at = Math.floor(a / 10), bt = Math.floor(b / 10);
  const nextTen = (at + 1) * 10, lastTen = bt * 10;
  const cesta = nextTen === lastTen
    ? `od ${a} k celé desítce ${nextTen} a pak k ${b}`
    : `od ${a} k nejbližší desítce ${nextTen}, pak po desítkách k ${lastTen} a nakonec k ${b}`;
  return {
    q: `Jak daleko je na číselné ose od ${a} do ${b}?`,
    ans: c,
    cands: [
      { v: c + 1, why: `Počítal jsi čísla od ${a} do ${b} včetně obou. Vzdálenost tvoří dílky mezi nimi a těch je o jeden méně.` },
      au > bu
        ? { v: (bt - at) * 10 + (au - bu), why: `U jednotek jsi odečetl menší číslici od větší (${au} ${M} ${bu}). Jednotek má ${b} jen ${bu}, musíš přejít přes desítku.` }
        : { v: c + 10, why: `O desítku víc — spočítej znovu, kolik celých desítek ujdeš.` },
      ...shuffle([
        { v: a + b, why: `Sečetl jsi ${a} + ${b}. Vzdálenost na ose zjistíš odčítáním.` },
        { v: c - 1, why: `O jednu méně — zkontroluj poslední úsek cesty k ${b}.` },
        { v: c + 10, why: `O desítku víc — spočítej znovu, kolik celých desítek ujdeš.` },
      ]),
    ],
    h0: `Vzdálenost od ${a} do ${b} zjistíš odčítáním. Které číslo odečteš od kterého?`,
    h1: `Jdi po ose po částech: ${cesta}. Délky všech úseků sečti — nebo rovnou vypočítej ${b} ${M} ${a}.`,
    expl: `Vzdálenost na ose je rozdíl čísel: ${b} ${M} ${a} = ${c}. Z ${a} je potřeba udělat ${dilky(c)} doprava, abychom došli na ${b}.`,
  };
}

/** Klesající řada s krokem 2, 5 nebo 10. */
function klesajiciRada(): Built | null {
  const step = pick([2, 5, 10]);
  const start = step === 10 ? rnd(51, 99) : step === 5 ? rnd(30, 99) : rnd(18, 99);
  const row = [0, 1, 2, 3, 4].map((i) => start - i * step);
  if (row[4] < 1) return null;
  const idx = rnd(1, 4);
  const c = row[idx], prev = row[idx - 1];
  const next = idx < 4 ? row[idx + 1] : undefined;
  const [x, y] = idx >= 2 ? [row[0], row[1]] : [row[2], row[3]];
  const shown = row.map((v, i) => (i === idx ? "___" : String(v))).join(", ");
  return {
    q: `Co chybí v řadě? ${shown}`,
    ans: c,
    cands: shuffle([
      { v: prev - 1, why: `Ubral jsi od ${prev} jen 1. V této řadě čísla klesají vždy o ${step}.` },
      { v: prev + step, why: `Čísla v této řadě se zmenšují, ty jsi ale ${step} přičetl.` },
      { v: c - step, why: next !== undefined ? `${c - step} už v řadě je — stojí hned za mezerou.` : `${c - step} je o krok dál, než hledáš — od ${prev} jsi odečetl krok dvakrát.` },
      { v: c + 1, why: `Je o 1 větší. Zkontroluj, že od ${prev} k tvému číslu je to přesně o ${step} méně.` },
      { v: c - 1, why: `Je o 1 menší. Zkontroluj, že od ${prev} k tvému číslu je to přesně o ${step} méně.` },
    ]),
    h0: `Porovnej sousední čísla ${x} a ${y}. O kolik se čísla v řadě zmenšují a co přijde po ${prev}?`,
    h1: `Krok řady je ${step} směrem dolů: každé číslo je o ${step} menší než to před ním. Odečti ${step} od ${prev}${next !== undefined ? ` a ověř, že od výsledku k ${next} je to zase o ${step} méně` : " a ověř to i na ostatních číslech řady"}.`,
    expl: `Čísla v řadě klesají o ${step} (${x} ${M} ${step} = ${y}). Proto ${prev} ${M} ${step} = ${c}.`,
  };
}

// ── generátor ────────────────────────────────────────────────────────────────

function naplnit(out: PracticeTask[], seen: Set<string>, make: () => Built | null, n: number) {
  let added = 0;
  for (let attempt = 0; added < n && attempt < 300; attempt++) {
    const b = make();
    if (!b || seen.has(b.q)) continue;
    const t = finish(b);
    if (!t) continue;
    seen.add(b.q);
    out.push(t);
    added++;
  }
}

function gen(level: number): PracticeTask[] {
  const out: PracticeTask[] = [];
  const seen = new Set<string>();
  if (level === 1) {
    naplnit(out, seen, soused, 6);
    naplnit(out, seen, mezi, 5);
    naplnit(out, seen, radaPoDesitkach, 4);
  } else if (level === 2) {
    naplnit(out, seen, radaSKrokem, 9);
    naplnit(out, seen, meziDesitkami, 6);
  } else {
    naplnit(out, seen, zabka, 5);
    naplnit(out, seen, vzdalenost, 5);
    naplnit(out, seen, klesajiciRada, 5);
  }
  return shuffle(out);
}

export const CISELNAOSADO100: TopicMetadata[] = [
  {
    id: "g2-mat-ciselna-osa-100",
    rvpNodeId:
      "g2-matematika-cislo-a-pocetni-operace-ciselny-obor-0-100-ciselna-osa-do-100",
    title: "Číselná osa do 100",
    studentTitle: "Kam patří číslo?",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–100",
    briefDescription: "Najdeš chybějící číslo na číselné ose.",
    keywords: ["číselná osa", "posloupnost", "chybějící číslo", "řada čísel"],
    goals: [
      "Orientovat se na číselné ose do 100.",
      "Určit chybějící číslo v řadě s krokem 2, 5 nebo 10.",
      "Poznat směr číselné osy (rostoucí).",
    ],
    boundaries: ["Pouze čísla 0–100.", "Kroky 2, 5 nebo 10."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Podívej se, o kolik se čísla mění — pak přičti nebo odečti.",
      steps: [
        "Najdi, o kolik se čísla mění (krok).",
        "Přičti nebo odečti krok k sousednímu číslu.",
        "Zkontroluj, zda sedí i druhý soused.",
      ],
      commonMistake: "Záměna kroku — nejdřív zjisti, o kolik se čísla mění.",
      example: "10, 20, ___, 40 → krok je +10 → chybí 30.",
    },
  },
];
