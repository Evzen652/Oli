/**
 * Matematika 6. ročník — Násobek, dělitel, znaky dělitelnosti (2, 3, 4, 5, 6, 9, 10).
 *
 * Výpočetní select_one téma podle vzoru `fyzika/mereniDelky.ts`:
 *  • L1 — rozpoznání jednoduchého znaku (2, 5, 10; 3 u trojmístných čísel).
 *  • L2 — složitější znaky 4, 6, 9 a rozlišení pojmů násobek × dělitel.
 *  • L3 — dva kroky: doplnění číslice za hvězdičku a „dělitelné p, ale ne q“.
 *
 * Každý distraktor je číslo vyrobené z jedné konkrétní chyby (sudé ⇒ dělitelné
 * čtyřmi, „končí 3“ ⇒ dělitelné třemi, dělitelnost třemi místo devíti, násobek
 * místo dělitele…). Generátor rozhoduje přes ZNAKY (poslední číslice, dvojčíslí,
 * ciferný součet); test tématu ověřuje klíč operátorem zbytku, tedy jinou cestou.
 *
 * Nadstavbové znaky (8, 11, 12, 25, 100) téma nepoužívá.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  cis as f,
  rnd,
  pick,
  buildChoiceTask,
  losUlohy,
  ruzneUlohy,
  type Distractor,
} from "./_shared";

/**
 * buildChoiceTask bez automatického dodatku „Čísla ze zadání: …“. Ten u čísla
 * s hvězdičkou rozsekal vzor na nesmyslné kusy (80 3*2 → „80, 3, 2“) a u ostatních
 * úloh jen opakoval dělitele. Nápovědy tohoto tématu jsou konkrétní podle dělitele,
 * proto se použijí přesně tak, jak je tvůrce napsal.
 */
function task(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: [string, string]; solutionSteps: string[]; explanation: string },
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (t) t.hints = [parts.hints[0], parts.hints[1]];
  return t;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// ── Znaky dělitelnosti (jediný zdroj pravdy generátoru) ────────────────────
const cifry = (x: number): number[] => String(x).split("").map(Number);
const soucet = (x: number): number => cifry(x).reduce((a, b) => a + b, 0);
const posledni = (x: number): number => x % 10;
const dvojcisli = (x: number): number => Number(String(x).slice(-2));
const dvoj = (x: number): string => String(x).slice(-2);
const sude = (c: number): boolean => c % 2 === 0;

function znak(x: number, d: number): boolean {
  switch (d) {
    case 2: return sude(posledni(x));
    case 3: return soucet(x) % 3 === 0;
    case 4: return dvojcisli(x) % 4 === 0;
    case 5: return posledni(x) === 0 || posledni(x) === 5;
    case 6: return znak(x, 2) && znak(x, 3);
    case 9: return soucet(x) % 9 === 0;
    case 10: return posledni(x) === 0;
    default: throw new Error(`znak: nepodporovaný dělitel ${d}`);
  }
}

const je = (ok: boolean, d: number) => `${ok ? "je" : "není"} dělitelné ${f(d)}`;
const zbytek = (a: number, b: number) =>
  a % b === 0 ? `${f(a)} : ${f(b)} = ${f(a / b)}` : `${f(a)} : ${f(b)} = ${f(Math.floor(a / b))} zbytek ${f(a % b)}`;

/** Slovní rozbor jedné podmínky se mezivýsledkem (pro solutionSteps). */
function rozbor(x: number, d: number): string {
  const c = posledni(x);
  const s = soucet(x);
  switch (d) {
    case 2: return `poslední číslice ${f(c)} je ${sude(c) ? "sudá" : "lichá"} → ${je(znak(x, 2), 2)}`;
    case 5: return `končí číslicí ${f(c)} → ${je(znak(x, 5), 5)}`;
    case 10: return `končí číslicí ${f(c)} → ${je(znak(x, 10), 10)}`;
    case 4: return `dvojčíslí ${dvoj(x)}, ${zbytek(dvojcisli(x), 4)} → ${je(znak(x, 4), 4)}`;
    case 3: return `ciferný součet ${cifry(x).join(" + ")} = ${f(s)} → ${je(znak(x, 3), 3)}`;
    case 9: return `ciferný součet ${cifry(x).join(" + ")} = ${f(s)} → ${je(znak(x, 9), 9)}`;
    case 6:
      return `${sude(c) ? "je sudé" : "je liché"}, ciferný součet ${f(s)} ${s % 3 === 0 ? "je" : "není"} dělitelný 3 → ${je(znak(x, 6), 6)}`;
    default: throw new Error(`rozbor: nepodporovaný dělitel ${d}`);
  }
}

/** Najde číslo z ⟨min, max⟩ splňující podmínku, které ještě nebylo použito. */
function najdi(min: number, max: number, pred: (x: number) => boolean, used: Set<number>): number {
  for (let i = 0; i < 5000; i++) {
    const x = rnd(min, max);
    if (!used.has(x) && pred(x)) {
      used.add(x);
      return x;
    }
  }
  throw new Error("najdi: nenalezeno");
}

/** Tvůrce smí selhat (vzácná kombinace) — losUlohy pak zkusí jinou úlohu. */
function zkus(tvor: () => PracticeTask | null): () => PracticeTask | null {
  return () => {
    try {
      return tvor();
    } catch {
      return null;
    }
  };
}

const krokyMoznosti = (cisla: number[], popis: (x: number) => string) =>
  [...cisla].sort((a, b) => a - b).map((x) => `${f(x)}: ${popis(x)}.`);

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(zkus(tvor)));
}

// ── L1 — rozpoznání jednoduchého znaku ────────────────────────────────────
const L1_PRAVIDLO: Record<number, string> = {
  2: "Číslo je dělitelné dvěma, když je jeho poslední číslice sudá. Na ostatních číslicích nezáleží.",
  5: "Číslo je dělitelné pěti, když končí nulou nebo pětkou. Pětka uvnitř čísla nic neznamená.",
  10: "Číslo je dělitelné deseti jen tehdy, když končí nulou. Pětka na konci stačí jen pro dělitelnost pěti.",
  3: "Sečti všechny číslice. Když je jejich součet dělitelný třemi, je dělitelné třemi i celé číslo. Poslední číslice sama nerozhoduje.",
};

function genL1(): PracticeTask | null {
  const d = pick([2, 5, 10, 3]);
  const [min, max] = d === 3 ? [100, 999] : [1000, 9999];
  const used = new Set<number>();
  let key: number;
  const dis: Distractor[] = [];

  if (d === 2) {
    key = najdi(min, max, (x) => znak(x, 2), used);
    const a = najdi(min, max, (x) => cifry(x)[0] === 2 && !znak(x, 2), used);
    dis.push({
      value: f(a),
      why: `Dvojka stojí na začátku čísla ${f(a)}, ale o dělitelnosti dvěma rozhoduje poslední číslice. Ta je ${f(posledni(a))}, tedy lichá.`,
    });
    const b = najdi(min, max, (x) => soucet(x) % 2 === 0 && !znak(x, 2), used);
    dis.push({
      value: f(b),
      why: `Ciferný součet ${f(soucet(b))} je sudý, ale u dvojky se ciferný součet nepoužívá. Poslední číslice ${f(posledni(b))} je lichá, proto ${f(b)} dělitelné 2 není.`,
    });
    const c = najdi(min, max, (x) => cifry(x).slice(0, -1).every(sude) && !znak(x, 2), used);
    dis.push({
      value: f(c),
      why: `Všechny číslice kromě poslední jsou sudé, jenže rozhoduje právě ta poslední. Číslice ${f(posledni(c))} je lichá, takže ${f(c)} dělitelné 2 není.`,
    });
  } else if (d === 5) {
    key = najdi(min, max, (x) => znak(x, 5), used);
    const a = najdi(min, max, (x) => posledni(x) === 2, used);
    dis.push({
      value: f(a),
      why: `Číslo ${f(a)} končí dvojkou. To je znak dělitelnosti dvěma; dělitelné pěti je jen číslo, které končí 0 nebo 5.`,
    });
    const b = najdi(min, max, (x) => cifry(x).slice(0, -1).includes(5) && !znak(x, 5) && posledni(x) !== 2, used);
    dis.push({
      value: f(b),
      why: `Pětka je uvnitř čísla, ne na konci. Rozhoduje poslední číslice ${f(posledni(b))}, a ta není 0 ani 5.`,
    });
    const c = najdi(min, max, (x) => soucet(x) % 5 === 0 && !znak(x, 5) && posledni(x) !== 2, used);
    dis.push({
      value: f(c),
      why: `Ciferný součet ${f(soucet(c))} je sice dělitelný pěti, ale u pětky ciferný součet nerozhoduje. Číslo končí číslicí ${f(posledni(c))}, proto ho 5 nedělí.`,
    });
  } else if (d === 10) {
    key = najdi(min, max, (x) => znak(x, 10), used);
    const a = najdi(min, max, (x) => posledni(x) === 5, used);
    dis.push({
      value: f(a),
      why: `Číslo ${f(a)} končí pětkou, takže je dělitelné 5. Deseti je ale dělitelné jen číslo, které končí nulou.`,
    });
    const b = najdi(min, max, (x) => cifry(x).slice(0, -1).includes(0) && !znak(x, 5), used);
    dis.push({
      value: f(b),
      why: `Nula stojí uvnitř čísla, ne na posledním místě. Poslední číslice je ${f(posledni(b))}, proto ${f(b)} dělitelné 10 není.`,
    });
    const c = najdi(min, max, (x) => soucet(x) % 10 === 0 && !znak(x, 5), used);
    dis.push({
      value: f(c),
      why: `Ciferný součet ${f(soucet(c))} je dělitelný deseti, ale u desítky se ciferný součet nepoužívá. Číslo nekončí nulou, takže 10 ho nedělí.`,
    });
  } else {
    key = najdi(min, max, (x) => znak(x, 3), used);
    const a = najdi(min, max, (x) => posledni(x) === 3 && !znak(x, 3), used);
    dis.push({
      value: f(a),
      why: `Číslo končí trojkou, ale u trojky rozhoduje ciferný součet: ${cifry(a).join(" + ")} = ${f(soucet(a))}, a ten není dělitelný 3.`,
    });
    const b = najdi(min, max, (x) => cifry(x)[0] === 3 && posledni(x) !== 3 && !znak(x, 3), used);
    dis.push({
      value: f(b),
      why: `Trojka na začátku čísla nerozhoduje. Ciferný součet ${cifry(b).join(" + ")} = ${f(soucet(b))} není dělitelný 3.`,
    });
    const c = najdi(min, max, (x) => (posledni(x) === 6 || posledni(x) === 9) && !znak(x, 3), used);
    dis.push({
      value: f(c),
      why: `Poslední číslice ${f(posledni(c))} je sice násobek tří, ale u trojky poslední číslice nerozhoduje. Ciferný součet ${f(soucet(c))} není dělitelný 3.`,
    });
  }

  const c = posledni(key);
  const explanation =
    d === 3
      ? `Ciferný součet čísla ${f(key)} je ${f(soucet(key))} a to je násobek tří, proto je ${f(key)} dělitelné 3. Proč to funguje: 10, 100 i ${f(1000)} dávají po dělení třemi zbytek 1, takže číslo má stejný zbytek jako jeho ciferný součet.`
      : c === 0
        ? `${f(key)} končí nulou, je to tedy celý počet desítek (${f(key / 10)} · 10). Celé desítky jsou vždy dělitelné 2, 5 i 10, proto je ${f(key)} dělitelné ${f(d)}.`
        : `${f(key)} = ${f(key - c)} + ${f(c)}. Celé desítky jsou vždy dělitelné 2, 5 i 10, takže o dělitelnosti rozhoduje jen poslední číslice ${f(c)}. ${
            d === 2 ? "Je sudá, proto je číslo dělitelné 2." : "Je to pětka, proto je číslo dělitelné 5."
          }`;

  return task(`Které z čísel je dělitelné číslem ${f(d)}?`, f(key), dis, {
    hints: [
      "Na kterých číslicích u tohoto dělitele záleží?",
      L1_PRAVIDLO[d],
    ],
    solutionSteps: krokyMoznosti([key, ...dis.map((x) => Number(x.value.replace(/\s/g, "")))], (x) => rozbor(x, d)),
    explanation,
  });
}

// ── L2 — znaky 4, 6, 9 a násobek × dělitel ────────────────────────────────
const L2_PRAVIDLO: Record<number, string> = {
  4: "Násobek čtyř poznáš podle čísla z posledních dvou číslic: to musí být dělitelné čtyřmi. Sudá poslední číslice nestačí.",
  6: "Násobek šesti musí splnit dvě podmínky zároveň: být sudý a mít ciferný součet dělitelný třemi.",
  9: "Sečti všechny číslice. Násobek devíti má ciferný součet dělitelný devíti; dělitelnost třemi nestačí.",
};

function genL2(): PracticeTask | null {
  return Math.random() < 0.5 ? genL2Nasobek() : genL2Delitel();
}

function genL2Nasobek(): PracticeTask | null {
  const d = pick([4, 6, 9]);
  const nc = pick([3, 4, 5]);
  const [min, max] = [10 ** (nc - 1), 10 ** nc - 1];
  const used = new Set<number>();
  const dis: Distractor[] = [];
  let key: number;

  if (d === 4) {
    const zaludny = Math.random() < 0.5;
    key = najdi(min, max, (x) => znak(x, 4) && (zaludny ? [2, 6].includes(posledni(x)) : true), used);
    const a = najdi(min, max, (x) => [0, 2, 6].includes(posledni(x)) && !znak(x, 4), used);
    dis.push({
      value: f(a),
      why: `Sudé číslo ještě nemusí být dělitelné 4. Rozhoduje číslo z posledních dvou číslic a ${dvoj(a)} není násobkem 4 (${zbytek(dvojcisli(a), 4)}).`,
    });
    const b = najdi(min, max, (x) => [4, 8].includes(posledni(x)) && !znak(x, 4), used);
    dis.push({
      value: f(b),
      why: `Končí číslicí ${f(posledni(b))}, která je sama dělitelná 4, jenže rozhoduje celé dvojčíslí ${dvoj(b)}, a to není dělitelné 4 (${zbytek(dvojcisli(b), 4)}).`,
    });
    const c = najdi(min, max, (x) => soucet(x) % 4 === 0 && !znak(x, 4), used);
    dis.push({
      value: f(c),
      why: `Ciferný součet ${f(soucet(c))} je dělitelný 4, ale u čtyřky se ciferný součet nepoužívá. Dvojčíslí ${dvoj(c)} není dělitelné 4.`,
    });
  } else if (d === 6) {
    key = najdi(min, max, (x) => znak(x, 6), used);
    const a = najdi(min, max, (x) => znak(x, 3) && !znak(x, 2), used);
    dis.push({
      value: f(a),
      why: `Ciferný součet ${f(soucet(a))} je dělitelný 3, ale číslo je liché, takže ho 2 nedělí. 6 = 2 · 3, musí platit obě podmínky současně.`,
    });
    const b = najdi(min, max, (x) => posledni(x) === 6 && !znak(x, 3), used);
    dis.push({
      value: f(b),
      why: `Končí šestkou, ale to nestačí. Ciferný součet ${f(soucet(b))} není dělitelný 3, takže číslo není dělitelné ani 6.`,
    });
    const c = najdi(min, max, (x) => znak(x, 2) && posledni(x) !== 6 && !znak(x, 3), used);
    dis.push({
      value: f(c),
      why: `Číslo je sudé, to je jen polovina podmínky. Ciferný součet ${f(soucet(c))} není dělitelný 3. 6 = 2 · 3, musí platit obě podmínky.`,
    });
  } else {
    key = najdi(min, max, (x) => znak(x, 9), used);
    const a = najdi(min, max, (x) => posledni(x) === 9 && !znak(x, 3), used);
    dis.push({
      value: f(a),
      why: `Končí devítkou, ale u devítky poslední číslice nerozhoduje. Ciferný součet ${f(soucet(a))} není dělitelný 9.`,
    });
    const b = najdi(min, max, (x) => znak(x, 3) && !znak(x, 9), used);
    dis.push({
      value: f(b),
      why: `Ciferný součet ${f(soucet(b))} je dělitelný 3, ale ne 9. Takové číslo je násobkem tří, ne devíti.`,
    });
    const c = najdi(min, max, (x) => dvojcisli(x) > 0 && dvojcisli(x) % 9 === 0 && !znak(x, 9), used);
    dis.push({
      value: f(c),
      why: `Dvojčíslí ${dvoj(c)} je násobek 9, ale u devítky se dvojčíslí nepoužívá. Ciferný součet ${f(soucet(c))} není dělitelný 9.`,
    });
  }

  const s = soucet(key);
  const explanation =
    d === 4
      ? `Násobek 4 poznáš podle dvojčíslí: ${f(key)} končí dvojčíslím ${dvoj(key)} a ${zbytek(dvojcisli(key), 4)}. Stovky jsou dělitelné 4 vždy (100 = 4 · 25), proto na ostatních číslicích nezáleží.`
      : d === 6
        ? `${f(key)} je sudé a jeho ciferný součet ${f(s)} je dělitelný 3. Protože 6 = 2 · 3, je číslo násobkem 6 jen tehdy, když platí obě podmínky zároveň.`
        : `Ciferný součet čísla ${f(key)} je ${f(s)}, a to je násobek 9. Dělitelnost 9 zaručí jen ciferný součet dělitelný 9; dělitelnost 3 nestačí.`;

  return task(`Právě jedno z nabízených čísel je násobkem čísla ${f(d)}. Které to je?`, f(key), dis, {
    hints: [
      "Nejdřív si ujasni, podle čeho se tento násobek pozná.",
      L2_PRAVIDLO[d],
    ],
    solutionSteps: krokyMoznosti([key, ...dis.map((x) => Number(x.value.replace(/\s/g, "")))], (x) => rozbor(x, d)),
    explanation,
  });
}

const L2_N = [24, 36, 48, 60, 72, 84, 90, 96, 108, 120, 126, 144, 150, 168, 180];

function genL2Delitel(): PracticeTask | null {
  const n = pick(L2_N);
  const delitele = Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);
  const key = pick(delitele.filter((k) => k >= 3 && k <= n / 2));
  const kolikrat = pick([2, 3]);
  const nasobek = kolikrat * n;
  // Falešní dělitelé: z intervalu ⟨3, n/2⟩, se společným dělitelem s n, ale n nedělí.
  // Velikostí se od skutečného dělitele neliší, rozhodne jen dělení.
  const falesni = Array.from({ length: Math.floor(n / 2) - 2 }, (_, i) => i + 3).filter(
    (k) => n % k !== 0 && gcd(n, k) > 1,
  );
  const dvojnasobkove = falesni.filter((k) => (2 * n) % k === 0);
  const prvni = dvojnasobkove.length > 0 ? pick(dvojnasobkove) : pick(falesni);
  const zbyle = falesni.filter((k) => k !== prvni);
  if (zbyle.length === 0) return null;
  const druhy = pick(zbyle);

  const whyFalesny = (k: number): string => {
    if ((2 * n) % k === 0) {
      return `${f(k)} dělí číslo ${f(2 * n)} (dvojnásobek čísla ${f(n)}), ale samotné ${f(n)} ne: ${zbytek(n, k)}. Dělení musí vyjít beze zbytku.`;
    }
    const g = gcd(n, k);
    return `${f(k)} i ${f(n)} jsou dělitelná číslem ${f(g)}, ale to ještě neznamená, že ${f(k)} dělí ${f(n)}: ${zbytek(n, k)}. Dělení musí vyjít beze zbytku.`;
  };

  const dis: Distractor[] = [
    {
      value: f(nasobek),
      why: `${f(nasobek)} = ${f(kolikrat)} · ${f(n)} je násobek čísla ${f(n)}, ne jeho dělitel. Dělitel je menší nebo roven ${f(n)} a ${f(n)} jím jde vydělit beze zbytku.`,
    },
    { value: f(prvni), why: whyFalesny(prvni) },
    { value: f(druhy), why: whyFalesny(druhy) },
  ];

  return task(`Které z těchto čísel patří mezi dělitele čísla ${f(n)}?`, f(key), dis, {
    hints: [
      "Dělitel je číslo, kterým jde zadané číslo vydělit beze zbytku.",
      "Dělitel nemůže být větší než samotné číslo. Menší kandidáty ověř dělením a hlídej zbytek; pomůže i znak dělitelnosti.",
    ],
    solutionSteps: [
      `${zbytek(n, key)} beze zbytku → ${f(key)} je dělitel čísla ${f(n)}.`,
      `${f(nasobek)} = ${f(kolikrat)} · ${f(n)} → násobek, ne dělitel.`,
      `${zbytek(n, prvni)} → ${f(prvni)} není dělitel.`,
      `${zbytek(n, druhy)} → ${f(druhy)} není dělitel.`,
    ],
    explanation: `Dělitel čísla ${f(n)} je číslo, kterým jde ${f(n)} vydělit beze zbytku: ${zbytek(n, key)}. Násobek vzniká opačně, násobením čísla ${f(n)}. Dělitel proto nikdy není větší než samotné číslo, násobek nikdy menší.`,
  });
}

// ── L3 — doplnění číslice a kombinace znaků ───────────────────────────────
function genL3(): PracticeTask | null {
  return Math.random() < 0.5 ? genL3Hvezdicka() : genL3Kombinace();
}

/** Zápis čísla s hvězdičkou, číslice seskupené po třech odzadu. */
function zapisVzoru(cif: (number | "*")[]): string {
  const s = cif.join("");
  const out: string[] = [];
  for (let i = s.length; i > 0; i -= 3) out.unshift(s.slice(Math.max(0, i - 3), i));
  return out.join(" ");
}

function genL3Hvezdicka(): PracticeTask | null {
  const d = pick([4, 6, 9]);
  const nc = pick([4, 5]);
  const znama = Array.from({ length: nc }, (_, i) => (i === 0 ? rnd(1, 9) : rnd(0, 9)));
  // Pozice hvězdičky: u 6 jednotky, u 4 jednotky nebo desítky, u 9 kdekoli kromě první.
  const poz = d === 6 ? nc - 1 : d === 4 ? pick([nc - 1, nc - 2]) : rnd(1, nc - 1);
  const vzor: (number | "*")[] = znama.map((c, i) => (i === poz ? "*" : c));
  const znameCifry = znama.filter((_, i) => i !== poz);
  const S = znameCifry.reduce((a, b) => a + b, 0);
  const dosad = (c: number) => Number(znama.map((z, i) => (i === poz ? c : z)).join(""));
  const cislo = (c: number) => f(dosad(c));
  const plati = (c: number) => znak(dosad(c), d);

  let key: number;
  const dis: Distractor[] = [];
  let steps: string[];
  let explanation: string;
  let napovedy: [string, string];
  let nejvetsi = false;

  if (d === 9) {
    const r = S % 9;
    key = (9 - r) % 9;
    if (![4, 5, 7, 8].includes(key)) return null;
    const s3 = key % 3;
    dis.push({
      value: f(s3),
      why: `S číslicí ${f(s3)} vyjde ciferný součet ${f(S + s3)}. Ten je dělitelný 3, ale ne 9 — číslo ${cislo(s3)} je násobkem tří, ne devíti.`,
    });
    dis.push({
      value: f(0),
      why: `Nula je sice nejmenší číslice, ale ciferný součet by zůstal ${f(S)}, a ten není dělitelný 9.`,
    });
    dis.push({
      value: f(r),
      why: `${f(r)} je zbytek součtu po dělení devíti, ale do násobku 9 je potřeba doplnit: ${f(S)} + ${f(r)} = ${f(S + r)}, a to 9 nedělí.`,
    });
    steps = [
      `Součet známých číslic: ${znameCifry.join(" + ")} = ${f(S)}.`,
      `Nejbližší násobek 9, který není menší než ${f(S)}, je ${f(S + key)}. Chybí ${f(S + key)} − ${f(S)} = ${f(key)}.`,
      `Zkouška: ${cislo(key)} má ciferný součet ${f(S + key)} → je dělitelné 9.`,
    ];
    explanation = `O dělitelnosti 9 rozhoduje ciferný součet celého čísla. Známé číslice dávají ${f(S)}, do násobku 9 (${f(S + key)}) chybí ${f(key)}, a to je nejmenší možná číslice.`;
    napovedy = [
      "Nejdřív sečti číslice, které v čísle už jsou.",
      "Pak zjisti, kolik chybí do nejbližšího násobku devíti. Pozor, dělitelnost třemi nestačí.",
    ];
  } else if (d === 6) {
    if (S % 2 === 0 || S % 3 === 0) return null;
    key = S % 6 === 1 ? 2 : 4;
    const s3 = (3 - (S % 3)) % 3;
    const c6 = (6 - (S % 6)) % 6;
    const r = S % 3;
    dis.push({
      value: f(0),
      why: `S nulou by číslo bylo sudé, ale ciferný součet by zůstal ${f(S)}, a ten není dělitelný 3.`,
    });
    dis.push({
      value: f(s3),
      why: `S číslicí ${f(s3)} je ciferný součet ${f(S + s3)} dělitelný 3, ale číslo by končilo lichou číslicí, takže by nebylo sudé. 6 = 2 · 3, platit musí obě podmínky.`,
    });
    dis.push({
      value: f(c6),
      why: `Ciferný součet ${f(S + c6)} je dělitelný 6, ale znak dělitelnosti 6 takhle nefunguje: číslo končící lichou číslicí ${f(c6)} není sudé, a tak ho 6 nedělí.`,
    });
    dis.push({
      value: f(r),
      why: `${f(r)} je zbytek součtu po dělení třemi, ale doplnit je potřeba do násobku 3: ${f(S)} + ${f(r)} = ${f(S + r)}, a to 3 nedělí.`,
    });
    const zkousky = [0, 2, 4]
      .filter((c) => c <= key)
      .map((c) => `${f(c)} → součet ${f(S + c)} ${(S + c) % 3 === 0 ? "je" : "není"} dělitelný 3`);
    steps = [
      "Dělitelné 6 = sudé a zároveň s ciferným součtem dělitelným 3. Hvězdička je poslední číslice, musí tedy být sudá.",
      `Součet známých číslic: ${znameCifry.join(" + ")} = ${f(S)}.`,
      `Zkoušíme sudé číslice od nejmenší: ${zkousky.join("; ")}.`,
      `Nejmenší vyhovující číslice: ${f(key)}, číslo ${cislo(key)} ${je(true, 6)}.`,
    ];
    explanation = `Číslo dělitelné 6 musí být sudé i mít ciferný součet dělitelný 3. Sudé číslice 0, 2, 4… zkoušíme postupně; první, se kterou součet ${f(S)} + číslice vyjde dělitelný 3, je ${f(key)}.`;
    napovedy = [
      "Jaké dvě podmínky musí splnit číslo dělitelné šesti?",
      "Zkoušej jen sudé číslice od nejmenší a u každé ověř, jestli je ciferný součet dělitelný třemi.",
    ];
  } else {
    // Varianty (klíč se mění s polohou hvězdičky, druhou číslicí dvojčíslí i otázkou):
    //  jednotky, liché desítky → vyhovuje 2, 6        (nejmenší 2, největší 6)
    //  jednotky, sudé desítky  → vyhovuje 0, 4, 8     (jen největší 8)
    //  desítky, jednotky 2/6   → vyhovuje 1, 3, 5, 7, 9 (nejmenší 1, největší 9)
    //  desítky, jednotky 0/4/8 → vyhovuje 0, 2, 4, 6, 8 (jen největší 8)
    const naJednotkach = poz === nc - 1;
    const vyhovuji = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(plati);
    if (vyhovuji.length === 0) return null; // desítky u jednotek 1/3/5/7/9 → řešení není
    // Když vyhovuje nula, byla by „nejmenší“ triviální → ptáme se na největší.
    nejvetsi = vyhovuji[0] === 0 ? true : Math.random() < 0.5;
    key = nejvetsi ? vyhovuji[vyhovuji.length - 1] : vyhovuji[0];
    const dv = (c: number) => dvoj(dosad(c));
    const sudeDv = (c: number) => sude(Number(dv(c)));
    const whyNe = (c: number): string =>
      sudeDv(c)
        ? `Dvojčíslí ${dv(c)} je sudé, ale ${zbytek(Number(dv(c)), 4)}. Sudé číslo ještě nemusí být dělitelné 4.`
        : `Dvojčíslí ${dv(c)} je liché, takže ho 4 nedělí (${zbytek(Number(dv(c)), 4)}).`;
    const poradi = nejvetsi ? [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const sumc = poradi.find((c) => (S + c) % 4 === 0);
    if (sumc !== undefined && !plati(sumc)) {
      dis.push({
        value: f(sumc),
        why: `S číslicí ${f(sumc)} vyjde ciferný součet ${f(S + sumc)} dělitelný 4, ale u čtyřky se ciferný součet nepoužívá. Dvojčíslí ${dv(sumc)} není dělitelné 4.`,
      });
    }
    if (!nejvetsi) {
      dis.push({
        value: f(0),
        why: `S nulou by dvojčíslí bylo ${dv(0)}: ${zbytek(Number(dv(0)), 4)}. Nejmenší číslice ještě nemusí vyhovovat.`,
      });
    }
    // Blízké chyby: sudé dvojčíslí, které 4 nedělí, a číslice hned za klíčem.
    const nevyhovuji = poradi.filter((c) => !plati(c));
    for (const c of [...nevyhovuji.filter(sudeDv), ...nevyhovuji]) dis.push({ value: f(c), why: whyNe(c) });

    const zkousky = poradi
      .slice(0, poradi.indexOf(key) + 1)
      .map((c) => `${dv(c)} → ${zbytek(Number(dv(c)), 4)}`);
    const smer = nejvetsi ? "největší" : "nejmenší";
    steps = [
      `O dělitelnosti 4 rozhoduje dvojčíslí a hvězdička je na místě ${naJednotkach ? "jednotek" : "desítek"}, patří tedy do něj.`,
      `Zkoušíme číslice od ${nejvetsi ? "devítky dolů" : "nuly nahoru"}: ${zkousky.join("; ")}.`,
      `${nejvetsi ? "Největší" : "Nejmenší"} vyhovující číslice: ${f(key)}, číslo ${cislo(key)} ${je(true, 4)}.`,
    ];
    explanation = `U čtyřky rozhoduje jen číslo z posledních dvou číslic. Hvězdička v něm leží, proto zkoušíme číslice od ${
      nejvetsi ? "devítky dolů" : "nuly nahoru"
    } a dělíme celé dvojčíslí čtyřmi; ${smer} číslice, se kterou vyjde beze zbytku, je ${f(key)}.`;
    napovedy = [
      "Které číslice rozhodují o dělitelnosti čtyřmi? Patří mezi ně hvězdička?",
      `Zkoušej číslice od ${nejvetsi ? "devítky směrem dolů" : "nuly směrem nahoru"} a u každé vyděl celé dvojčíslí čtyřmi. Nestačí, že je sudé.`,
    ];
  }

  // Distraktor nesmí být jiná vyhovující číslice („také správně“).
  const cisteDis = dis.filter((x) => !plati(Number(x.value)));
  const mistne = nc === 4 ? "ve čtyřmístném čísle" : "v pětimístném čísle";
  const otazka = nejvetsi
    ? `Kterou největší číslici můžeš dosadit za hvězdičku ${mistne} ${zapisVzoru(vzor)}, aby bylo dělitelné číslem ${f(d)}?`
    : `Kterou nejmenší číslici musíš dosadit za hvězdičku ${mistne} ${zapisVzoru(vzor)}, aby bylo dělitelné číslem ${f(d)}?`;
  return task(otazka, f(key), cisteDis, { hints: napovedy, solutionSteps: steps, explanation });
}

type Dvojice = { p: number; q: number; pravidlo: string };
const DVOJICE: Dvojice[] = [
  { p: 6, q: 9, pravidlo: "Dělitelné šesti = sudé a s ciferným součtem dělitelným třemi. Dělitelné devíti = ciferný součet dělitelný devíti. Hledané číslo splní první a nesplní druhé." },
  { p: 3, q: 9, pravidlo: "U trojky i devítky rozhoduje ciferný součet. Hledané číslo má součet dělitelný třemi, ale devíti už ne." },
  { p: 2, q: 4, pravidlo: "U dvojky rozhoduje poslední číslice, u čtyřky číslo z posledních dvou číslic. Každé dvojčíslí vyděl čtyřmi." },
  // (5, 10) sem nepatří: rozhodne jediný pohled na poslední číslici, to je úroveň L1.
  { p: 3, q: 6, pravidlo: "Trojka chce ciferný součet dělitelný třemi. Šestka navíc chce, aby bylo číslo sudé." },
];

/** Výsledek obou podmínek jednou větou („je dělitelné 3, ale ne 9“). */
function oboje(x: number, p: number, q: number): string {
  const a = znak(x, p);
  const b = znak(x, q);
  if (a && b) return `je dělitelné ${f(p)} i ${f(q)}`;
  if (!a && !b) return `není dělitelné ${f(p)} ani ${f(q)}`;
  return a ? `je dělitelné ${f(p)}, ale ne ${f(q)}` : `není dělitelné ${f(p)}, ale je dělitelné ${f(q)}`;
}

/** Rozbor obou podmínek; údaj, který obě podmínky sdílejí, se uvede jen jednou. */
function rozborDvou(x: number, p: number, q: number): string {
  const souc = `ciferný součet ${cifry(x).join(" + ")} = ${f(soucet(x))}`;
  const parita = sude(posledni(x)) ? "sudé" : "liché";
  if (p === 3 && q === 9) return `${souc} → ${oboje(x, p, q)}`;
  if (p === 3 && q === 6) {
    return znak(x, 3) ? `${souc}, číslo je ${parita} → ${oboje(x, p, q)}` : `${souc} → ${oboje(x, p, q)}`;
  }
  if (p === 2 && q === 4) {
    return znak(x, 2)
      ? `poslední číslice ${f(posledni(x))} je sudá, dvojčíslí ${dvoj(x)}: ${zbytek(dvojcisli(x), 4)} → ${oboje(x, p, q)}`
      : `poslední číslice ${f(posledni(x))} je lichá → ${oboje(x, p, q)}`;
  }
  // p = 6, q = 9
  return `číslo je ${parita}, ${souc} → ${oboje(x, p, q)}`;
}

function genL3Kombinace(): PracticeTask | null {
  const { p, q, pravidlo } = pick(DVOJICE);
  const [min, max] = [1000, 9999];
  const used = new Set<number>();
  // U (2, 4) je klíč v polovině případů zakončený 0, 4 nebo 8 — „končí čtyřkou,
  // tak je dělitelné 4“ je přesně ta chyba, kterou úloha zkouší.
  const keyPred =
    p === 2
      ? Math.random() < 0.5
        ? (x: number) => znak(x, 2) && !znak(x, 4) && [0, 4, 8].includes(posledni(x))
        : (x: number) => znak(x, 2) && !znak(x, 4) && [2, 6].includes(posledni(x))
      : (x: number) => znak(x, p) && !znak(x, q);
  const key = najdi(min, max, keyPred, used);
  const dis: Distractor[] = [];
  const add = (pred: (x: number) => boolean, why: (x: number) => string) => {
    const x = najdi(min, max, pred, used);
    dis.push({ value: f(x), why: why(x) });
  };
  const s = (x: number) => f(soucet(x));
  const obe = `Otázka ale chce číslo, které ${f(q)} dělitelné NENÍ.`;

  if (p === 6) {
    // splní p i q · splní jen „sudé“ z p · splní ciferný součet jako klíč, ale je liché
    add((x) => znak(x, 6) && znak(x, 9), (x) => `Je sudé a ciferný součet ${s(x)} je dělitelný 9, tedy i 3. Číslo je proto dělitelné 6 i 9. ${obe}`);
    add((x) => znak(x, 2) && !znak(x, 3), (x) => `Je sudé, ale to je jen polovina podmínky. Ciferný součet ${s(x)} není dělitelný 3, takže číslo není dělitelné 6.`);
    add((x) => znak(x, 3) && !znak(x, 9) && !znak(x, 2), (x) => `Ciferný součet ${s(x)} je dělitelný 3 a 9 ne, ale číslo je liché. Pro dělitelnost 6 musí být i sudé.`);
  } else if (p === 3 && q === 9) {
    // dvakrát splní p i q · jednou jen „záludná“ podoba p (končí 3 nebo 9)
    const obe9 = (x: number) => `Ciferný součet ${s(x)} je dělitelný 9, tedy i 3. Číslo je dělitelné 3 i 9. ${obe}`;
    add((x) => znak(x, 9), obe9);
    add((x) => znak(x, 9), obe9);
    add(
      (x) => [3, 9].includes(posledni(x)) && !znak(x, 3),
      (x) => `Končí ${posledni(x) === 3 ? "trojkou" : "devítkou"}, ale u trojky ani devítky poslední číslice nerozhoduje. Ciferný součet ${s(x)} není dělitelný 3.`,
    );
  } else if (p === 3) {
    // Klíč je nutně lichý, proto dva liché distraktory: ty se dají vyřadit jen ciferným součtem.
    add((x) => znak(x, 6), (x) => `Je sudé a ciferný součet ${s(x)} je dělitelný 3, takže je dělitelné 3 i 6. ${obe}`);
    add((x) => posledni(x) === 3 && !znak(x, 3), (x) => `Končí trojkou, ale u trojky rozhoduje ciferný součet ${s(x)}, a ten není dělitelný 3.`);
    add((x) => posledni(x) === 9 && !znak(x, 3), (x) => `Končí devítkou, ale u trojky poslední číslice nerozhoduje. Ciferný součet ${s(x)} není dělitelný 3.`);
  } else {
    // (2, 4): všechny distraktory splní p i q — každé dvojčíslí je nutné vydělit.
    const obe4 = (x: number) => `Dvojčíslí ${dvoj(x)} je dělitelné 4, takže číslo je dělitelné 2 i 4. ${obe}`;
    add((x) => znak(x, 4) && [2, 6].includes(posledni(x)), (x) => `Končí číslicí ${f(posledni(x))}, a přesto je dvojčíslí ${dvoj(x)} násobek 4. Číslo je dělitelné 2 i 4. ${obe}`);
    add((x) => znak(x, 4) && posledni(x) === 0, obe4);
    add((x) => znak(x, 4) && [4, 8].includes(posledni(x)), obe4);
  }

  const cisla = [key, ...dis.map((x) => Number(x.value.replace(/\s/g, "")))];
  const podmnozina = p !== 6; // každé číslo dělitelné q je dělitelné i p
  return task(`Které číslo je dělitelné číslem ${f(p)}, ale není dělitelné číslem ${f(q)}?`, f(key), dis, {
    hints: ["Otázka má dvě podmínky. U každého nabízeného čísla je ověř jednu po druhé.", pravidlo],
    solutionSteps: [
      ...krokyMoznosti(cisla, (x) => rozborDvou(x, p, q)),
      `Dělitelné ${f(p)} a zároveň nedělitelné ${f(q)} je jen ${f(key)}.`,
    ],
    explanation: `U čísla ${f(key)}: ${rozborDvou(key, p, q)}. Obě podmínky je potřeba ověřit zvlášť.${
      podmnozina ? ` Každé číslo dělitelné ${f(q)} je dělitelné i ${f(p)}, proto hledáš číslo, které splní jen slabší podmínku.` : ""
    }`,
  });
}

// ── Topic ────────────────────────────────────────────────────────────────
export const ZNAKY_DELITELNOSTI: TopicMetadata[] = [
  {
    id: "g6-mat-znaky-delitelnosti-6",
    rvpNodeId: "g6-matematika-cislo-a-promenna-delitelnost-prirozenych-cisel-nasobek-delitel-znaky-delitelnosti-2-3-4-5-6-9-10",
    displayName: "Znaky dělitelnosti",
    title: "Násobek, dělitel, znaky dělitelnosti (2, 3, 4, 5, 6, 9, 10)",
    studentTitle: "Znaky dělitelnosti",
    subject: "matematika",
    category: "Číslo a proměnná",
    topic: "Dělitelnost přirozených čísel",
    briefDescription: "Podle číslic poznáš, zda je číslo dělitelné 2, 3, 4, 5, 6, 9, 10.",
    keywords: [
      "dělitelnost", "znaky dělitelnosti", "násobek", "dělitel", "ciferný součet",
      "dvojčíslí", "sudé číslo", "dělitelné dvěma", "dělitelné třemi", "dělitelné čtyřmi",
      "dělitelné šesti", "dělitelné devíti",
    ],
    goals: [
      "Podle znaku dělitelnosti poznat bez dělení, zda je číslo dělitelné 2, 3, 4, 5, 6, 9 nebo 10.",
      "Rozlišit pojmy násobek a dělitel.",
      "Doplnit chybějící číslici tak, aby číslo bylo dělitelné daným číslem, a kombinovat dva znaky.",
    ],
    boundaries: [
      "Jen znaky dělitelnosti 2, 3, 4, 5, 6, 9 a 10; nadstavbové znaky (8, 11, 12, 25, 100) ne.",
      "Přirozená čísla do 99 999.",
      "Bez rozkladu na prvočinitele a bez NSD a nsn (samostatná témata).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-mat-prvocisla-rozklad-6"],
    generator: gen,
    helpTemplate: {
      hint: "U 2, 5 a 10 rozhoduje poslední číslice, u 4 poslední dvojčíslí, u 3 a 9 ciferný součet. Číslo je dělitelné 6, když je dělitelné 2 i 3.",
      steps: [
        "Urči, na kterých číslicích u daného dělitele záleží.",
        "Spočítej, co znak vyžaduje: poslední číslici, dvojčíslí, nebo ciferný součet.",
        "U dělitele 6 nebo u dvou podmínek ověř každou podmínku zvlášť.",
      ],
      commonMistake: "Sudé číslo považovat za dělitelné 4, číslo končící 3 za dělitelné 3, nebo dělitelnost 3 za dělitelnost 9.",
      example: "4 572: ciferný součet 4 + 5 + 7 + 2 = 18, je dělitelný 9, proto je 4 572 dělitelné 9 (i 3). Dvojčíslí 72 je dělitelné 4, takže i číslo je dělitelné 4.",
    },
  },
];
