import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { ciselnaUloha, fmt, pick, rnd, sada } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď generátor, který rozepíše písemné
// dělení krok po kroku. Distraktory: špatný odhad číslice podílu (±1),
// vynechaná nula v podílu (103 → 13), zbytek větší než dělitel.
// L1 trojciferné číslo : dělitel 11–19 beze zbytku · L2 dělitel 21–99, i čtyřciferný
// dělenec, beze zbytku · L3 dělení se zbytkem, nula uprostřed podílu
// a slovní úloha, kde se výsledek zaokrouhluje nahoru.

function pisemne(N: number, d: number): { q: number; r: number; kroky: string[] } {
  const cislice = String(N).split("").map(Number);
  let cur = 0, q = "", zacal = false;
  const kroky: string[] = [];
  cislice.forEach((c, i) => {
    cur = cur * 10 + c;
    if (!zacal && cur < d && i < cislice.length - 1) return;
    zacal = true;
    const k = Math.floor(cur / d);
    q += String(k);
    kroky.push(`${cur} : ${d} = ${k}, protože ${k} × ${d} = ${k * d}; zbytek ${cur - k * d}`);
    cur -= k * d;
  });
  return { q: Number(q), r: cur, kroky };
}

/**
 * Nápověda nesmí obsahovat výsledek ani jako samostatné číslo — u dělení se
 * podíl může náhodou shodnout s číslem, které nápověda zmiňuje (dělitel, část
 * dělence). Taková úloha se zahodí a generátor zkusí jiná čísla.
 */
function hintBezCisla(key: number | string, hints: [string, string]): boolean {
  const s = String(key);
  return !hints.some((h) => (h.match(/\d+/g) ?? []).includes(s));
}

const prvniCast = (N: number, d: number) => {
  const s = String(N);
  for (let i = 1; i <= s.length; i++) if (Number(s.slice(0, i)) >= d) return Number(s.slice(0, i));
  return N;
};

function bezZbytku(dMin: number, dMax: number, qMin: number, qMax: number, nMin: number, nMax: number): PracticeTask | null {
  const d = rnd(dMin, dMax), q = rnd(qMin, qMax), N = d * q;
  if (N < nMin || N > nMax || d % 10 === 0) return null;
  const { kroky } = pisemne(N, d);
  const bezNuly = String(q).includes("0") ? Number(String(q).replace(/0/g, "")) : null;
  const hints: [string, string] = [
    `Začni u čísla ${fmt(N)} zleva: kolikrát se ${d} vejde do ${prvniCast(N, d)}? Pro odhad si ${d} zaokrouhli na desítky.`,
    `Postupuj po číslicích: z ${fmt(N)} vezmi zleva tolik číslic, aby se do nich ${d} vešlo, zapiš číslici podílu, vynásob ${d}, odečti a připiš další číslici dělence. Takhle pokračuj až na konec a nakonec ověř zkouškou — podíl vynásobený ${d} musí dát zpátky ${fmt(N)}.`,
  ];
  if (!hintBezCisla(q, hints)) return null;
  return ciselnaUloha(`Vypočítej písemně: ${fmt(N)} : ${d}`, q, [
    ...(bezNuly ? [{ value: bezNuly, why: "V podílu chybí nula. Když se dělitel do části dělence nevejde, zapíše se do podílu 0." }] : []),
    { value: q + 1, why: `Zkouška: ${q + 1} × ${d} = ${fmt((q + 1) * d)}, to je víc než ${fmt(N)}.` },
    { value: q - 1, why: `Zkouška: ${q - 1} × ${d} = ${fmt((q - 1) * d)}, zbylo by ještě ${d}.` },
    { value: q + 10, why: "Odhad první číslice podílu je o jedna vyšší — zkus vynásobit." },
  ], hints, [...kroky, `Zkouška: ${q} × ${d} = ${fmt(N)} ✓`]);
}

function seZbytkem(): PracticeTask | null {
  const d = rnd(12, 48), q = rnd(11, 60), r = rnd(1, d - 1), N = d * q + r;
  if (N > 999 || d % 10 === 0 || d - r === r) return null;
  const { kroky } = pisemne(N, d);
  const T = (a: number, b: number) => `${a}, zbytek ${b}`;
  const hints: [string, string] = [
    `Vyděl ${N} : ${d} postupně zleva — kolikrát se ${d} vejde do ${prvniCast(N, d)}?`,
    `Děl po číslicích až na konec: vezmi zleva tolik číslic z ${N}, aby se do nich ${d} vešlo, zapiš číslici podílu, vynásob ${d} a odečti. To, co po posledním odečtení zůstane, musí být menší než ${d} — jinak se ${d} vejde ještě jednou. Zkouška: podíl krát ${d} a k tomu ten poslední rozdíl dá ${N}.`,
  ];
  if (!hintBezCisla(q, hints) || !hintBezCisla(r, hints)) return null;
  return ciselnaUloha(`Vypočítej písemně se zbytkem: ${N} : ${d}`, T(q, r), [
    { value: T(q - 1, r + d), why: `Zbytek ${r + d} je větší než dělitel ${d} — dělitel by se vešel ještě jednou.` },
    { value: T(q, d - r), why: `Zbytek se odečetl obráceně. Zkouška: ${q} × ${d} + ${d - r} = ${q * d + d - r}, ne ${N}.` },
    { value: T(q + 1, r), why: `Zkouška: ${q + 1} × ${d} = ${(q + 1) * d}, to je víc než ${N}.` },
  ], hints, [...kroky, `Zkouška: ${q} × ${d} + ${r} = ${N} ✓`]);
}

function nulaUprostred(): PracticeTask | null {
  const d = rnd(11, 25), q = rnd(1, 9) * 100 + rnd(1, 9), N = d * q;
  if (N > 9999 || d % 10 === 0) return null;
  const { kroky } = pisemne(N, d);
  const hints: [string, string] = [
    `Vyděl ${fmt(N)} : ${d} zleva. Co zapíšeš do podílu, když se ${d} do právě připsané části nevejde ani jednou?`,
    `Každá číslice dělence ${fmt(N)}, kterou při dělení připíšeš, dá jednu číslici podílu — a když se ${d} do vzniklého čísla nevejde, patří na to místo v podílu nula a připisuje se další číslice. Na konci ověř zkouškou: podíl vynásobený ${d} musí dát zpátky ${fmt(N)}.`,
  ];
  if (!hintBezCisla(q, hints)) return null;
  return ciselnaUloha(`Vypočítej písemně: ${fmt(N)} : ${d}`, q, [
    { value: Number(String(q).replace("0", "")), why: "V podílu chybí nula. Když se dělitel do připsané části nevejde, napíše se do podílu 0 a připíše se další číslice." },
    { value: q + 10, why: `Zkouška: ${q + 10} × ${d} = ${fmt((q + 10) * d)}, ne ${fmt(N)}.` },
    { value: q - 1, why: `Zkouška: ${q - 1} × ${d} = ${fmt((q - 1) * d)}, zbylo by ještě ${d}.` },
  ], hints, [...kroky, `Zkouška: ${q} × ${d} = ${fmt(N)} ✓`]);
}

function autobusy(): PracticeTask | null {
  const d = pick([38, 45, 48, 50, 55, 57, 60]), N = rnd(150, 480);
  if (N % d === 0) return null;
  const q = Math.floor(N / d), r = N % d;
  const hints: [string, string] = [
    `Kolik plných autobusů obsadí ${N} dětí, když se do jednoho vejde ${d}? A zbude po nich ještě někdo?`,
    `Vyděl ${N} : ${d} a všímej si toho, co po dělení zůstane. Děti, které se do plných autobusů nevešly, musí taky někam nastoupit, takže pro ně musí přijet ještě jeden autobus — počet se proto zaokrouhluje nahoru, i kdyby v posledním autobuse jelo jediné dítě.`,
  ];
  if (!hintBezCisla(q + 1, hints)) return null;
  return ciselnaUloha(`Počet dětí, které jedou na výlet, je ${N}. Do jednoho autobusu se vejde ${d} dětí. Kolik autobusů je potřeba, aby jely všechny děti?`, q + 1, [
    { value: q, why: `S ${q} autobusy by ${r === 1 ? "jedno dítě zůstalo" : "zbylé děti zůstaly"} doma — pro zbytek je potřeba ještě jeden autobus.` },
    { value: q + 2, why: `Stačí o jeden autobus méně — do ${q + 1} autobusů se vejde ${pad((q + 1) * d, "DÍTĚ")}, a to bohatě stačí.` },
    { value: r, why: `${r} je zbytek po dělení — počet dětí, které se nevešly, ne počet autobusů.` },
  ], hints, [
    `${N} : ${d} = ${q}, zbytek ${r}`,
    `Na ${pad(r, "DÍTĚ")} je potřeba další autobus: ${q} + 1 = ${q + 1}`,
  ]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, () => bezZbytku(11, 19, 11, 60, 100, 999));
  if (level === 2) return sada(30, () => bezZbytku(21, 99, 12, 99, 250, 9999));
  const tvurci = [seZbytkem, nulaUprostred, autobusy];
  return sada(30, (i) => tvurci[i % 3]());
}

export const PISEMNEDELENIDVOUCIFERNYMDELITELEM: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-dvoucifernym-delitelem",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-pisemne-deleni-dvoucifernym-delitelem",
    title: "Písemné dělení dvouciferným dělitelem",
    studentTitle: "Dělení pod sebou",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Písemné početní operace",
    briefDescription: "Zvládneš písemné dělení větším číslem.",
    keywords: ["dělení", "dvouciferný dělitel", "písemné dělení", "podíl", "zbytek"],
    goals: [
      "Provést písemné dělení trojciferného čísla dvouciferným dělitelem",
      "Odhadnout výsledek dělení",
      "Ověřit výsledek násobením",
    ],
    boundaries: ["Bez dělení desetinných čísel", "Bez dělení se zbytkem na úrovni 1"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Při dělení dvouciferným číslem odhadni nejprve, kolikrát se dělitel vejde do první části dělence. Pak vynásob a odečti. Opakuj pro zbytek.",
      steps: [
        "Vezmi první 2 (nebo 3) číslice dělence.",
        "Odhadni, kolikrát se do nich dělitel vejde.",
        "Výsledek napiš do podílu, vynásob a odečti.",
        "Přidej další číslici a opakuj.",
        "Ověř výsledek: podíl × dělitel = dělenec.",
      ],
      commonMistake: "Chyba: špatný odhad číslice podílu. Pomůže zaokrouhlení dělitele: 28 ≈ 30, 312 ÷ 30 ≈ 10.",
      example: "312 ÷ 12: 31 ÷ 12 ≈ 2 (2×12=24, 31-24=7). Přidám 2 → 72 ÷ 12 = 6. Výsledek: 26.",
    },
  },
];
