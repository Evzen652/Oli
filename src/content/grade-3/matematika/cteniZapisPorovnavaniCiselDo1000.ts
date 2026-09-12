import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad, plural } from "@/lib/czechGrammar";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu): všechny úlohy téhož typu měly stejnou
// nápovědu, žádná chybná možnost neměla zpětnou vazbu a úrovně se lišily jen
// velikostí čísel. Teď jsou úrovně oddělené typem myšlení:
// L1 rozpoznání — zápis ze stovek/desítek/jednotek, číslice na daném místě,
//    porovnání čísel s různými stovkami.
// L2 aplikace — nula jako zástupce prázdného místa, porovnání se stejnými
//    stovkami, řazení čtyř čísel, posun o 1 / o 10 přes celou desítku či stovku.
// L3 transfer — přeskupení (14 desítek = 1 stovka a 4 desítky), největší
//    a nejmenší číslo z číslic, počet všech celých desítek v čísle.

const MISTO = ["stovek", "desítek", "jednotek"] as const;

function rnd(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

const cislo = (s: number, d: number, j: number) => s * 100 + d * 10 + j;

/** Tři různé číslice, stovky nenulové; `bezNul` zakáže nulu i u desítek a jednotek. */
function ruzneCislice(bezNul: boolean): [number, number, number] {
  for (;;) {
    const s = rnd(1, 9);
    const d = rnd(bezNul ? 1 : 0, 9);
    const j = rnd(bezNul ? 1 : 0, 9);
    if (new Set([s, d, j]).size === 3) return [s, d, j];
  }
}

/** Tři různé chybné možnosti, odlišné od klíče — dedup až po vygenerování tvarů. */
function tri(correct: string, kandidati: Distractor[]): [Distractor, Distractor, Distractor] {
  const seen = new Set([correct]);
  const out: Distractor[] = [];
  for (const k of kandidati) {
    if (seen.has(k.value)) continue;
    seen.add(k.value);
    out.push(k);
    if (out.length === 3) return out as [Distractor, Distractor, Distractor];
  }
  throw new Error(`Málo chybných možností pro klíč ${correct}`);
}

// ── L1 ──────────────────────────────────────────────────────────────────────

function zapisCislem(): PracticeTask {
  const [s, d, j] = ruzneCislice(true);
  const n = cislo(s, d, j);
  const zadani = `${pad(s, "STOVKA")}, ${pad(d, "DESÍTKA")} a ${pad(j, "JEDNOTKA")}`;
  return choice(`Zapiš číslem: ${zadani}.`, String(n), tri(String(n), [
    { value: String(cislo(s, j, d)), why: `Desítky a jednotky jsou prohozené. Desítek je ${d}, ta číslice patří doprostřed.` },
    { value: String(cislo(d, s, j)), why: `Stovky a desítky jsou prohozené. Na první místo zleva patří počet stovek, tedy ${s}.` },
    { value: String(cislo(j, d, s)), why: "Číslo je napsané pozpátku. Zleva se píšou stovky, pak desítky a nakonec jednotky." },
  ]), {
    hints: [
      `Počet stovek (${s}) patří na první místo zleva. Kam patří ${pad(d, "DESÍTKA")} a kam ${pad(j, "JEDNOTKA")}?`,
      `Zadání „${zadani}“ jde od stovek k jednotkám. Každý počet zapiš jako jednu číslici: nejdřív stovky, pak desítky, nakonec jednotky. Hlídej, ať číslice nepřehodíš.`,
    ],
    explanation: `${pad(s, "STOVKA")} → ${s * 100}, ${pad(d, "DESÍTKA")} → ${d * 10}, ${pad(j, "JEDNOTKA")} → ${j}. Dohromady ${s * 100} + ${d * 10} + ${j} = ${n}.`,
  });
}

function cisliceNaMiste(): PracticeTask {
  const k = rnd(0, 2);
  let [s, d, j] = ruzneCislice(false);
  while (k === 2 && d === 0) [s, d, j] = ruzneCislice(false);
  const n = cislo(s, d, j);
  const dig = [s, d, j];
  const correct = String(dig[k]);
  const kandidati: Distractor[] = [];
  for (let i = 0; i < 3; i++) {
    if (i !== k) kandidati.push({ value: String(dig[i]), why: `Číslice ${dig[i]} stojí v čísle ${n} na místě ${MISTO[i]}, ne ${MISTO[k]}.` });
  }
  kandidati.push(
    k === 0
      ? { value: String(s * 100), why: `${s * 100} je hodnota všech stovek. Otázka se ale ptá jen na jednu číslici.` }
      : k === 1
        ? { value: String(s * 10 + d), why: `${s * 10 + d} je počet všech celých desítek v čísle ${n}. Otázka se ptá jen na číslici na místě desítek.` }
        : { value: String(d * 10 + j), why: `${d * 10 + j} jsou poslední dvě číslice. Místo jednotek je jen to úplně poslední.` },
  );
  const kde = ["úplně vlevo", "uprostřed", "úplně vpravo"][k];
  return choice(`Která číslice v čísle ${n} stojí na místě ${MISTO[k]}?`, correct, tri(correct, kandidati), {
    hints: [
      `V čísle ${n} počítej místa zprava: jednotky, desítky, stovky. Kde je místo ${MISTO[k]}?`,
      `Číslo ${n} má tři číslice. Úplně vpravo stojí jednotky, uprostřed desítky a úplně vlevo stovky. Místo ${MISTO[k]} je tedy ${kde} — přečti číslici, která tam stojí.`,
    ],
    explanation: `${n} = ${pad(s, "STOVKA")}, ${pad(d, "DESÍTKA")} a ${pad(j, "JEDNOTKA")}. Místo ${MISTO[k]} je ${kde}, a proto tam stojí číslice ${dig[k]}.`,
  });
}

/** Porovnání dvou čísel; možnosti jsou celé zápisy, ať jsou čtyři různé. */
function porovnani(a: number, b: number, uroven: 1 | 2): PracticeTask {
  const da = [Math.floor(a / 100), Math.floor(a / 10) % 10, a % 10];
  const db = [Math.floor(b / 100), Math.floor(b / 10) % 10, b % 10];
  const k = da.findIndex((x, i) => x !== db[i]);
  const big = a > b ? a : b;
  const small = a > b ? b : a;
  const bd = a > b ? da[k] : db[k];
  const sd = a > b ? db[k] : da[k];
  const znak = a > b ? ">" : "<";
  const opak = a > b ? "<" : ">";
  const correct = `${a} ${znak} ${b}`;
  const d: [Distractor, Distractor, Distractor] = [
    { value: `${a} ${opak} ${b}`, why: `Znak je obrácený. Otevřená strana znaku míří k většímu číslu a větší je ${big}.` },
    { value: `${a} = ${b}`, why: `Rovnítko platí jen pro dvě stejná čísla. ${a} a ${b} se liší na místě ${MISTO[k]}.` },
    { value: `${b} ${znak} ${a}`, why: `Tento zápis tvrdí opak. Na místě ${MISTO[k]} má ${big} číslici ${bd}, kdežto ${small} jen ${sd}.` },
  ];
  const hints: [string, string] = uroven === 1
    ? [
      `Porovnej čísla ${a} a ${b} zleva. Začni počtem stovek.`,
      `${a} má na místě stovek ${da[0]}, ${b} má ${db[0]}. Když se stovky liší, desítky ani jednotky už nerozhodují. Otevřená strana znaku míří k většímu číslu.`,
    ]
    : [
      `Čísla ${a} a ${b} mají stejné stovky. Na kterém dalším místě se liší?`,
      k === 1
        ? `Stovky jsou stejné, proto se posuň doprava a porovnej desítky: ${da[1]} a ${db[1]}. Jednotky už nerozhodují. Otevřená strana znaku míří k většímu číslu.`
        : `Stovky i desítky jsou stejné, rozhodnou až jednotky: ${da[2]} a ${db[2]}. Otevřená strana znaku míří k většímu číslu.`,
    ];
  const pred = k === 0 ? "" : k === 1 ? "Stovky jsou stejné. " : "Stovky i desítky jsou stejné. ";
  return choice(`Porovnej čísla ${a} a ${b}. Který zápis je správně?`, correct, d, {
    hints,
    explanation: `Čísla porovnáváme zleva. ${pred}Na místě ${MISTO[k]} má ${big} číslici ${bd} a ${small} číslici ${sd}, takže ${big} je větší. Platí ${correct}.`,
  });
}

function porovnaniL1(): PracticeTask {
  // Stovky se liší; číslo s víc stovkami má schválně menší desítky (past „podle konce“).
  for (;;) {
    const sa = rnd(1, 9), sb = rnd(1, 9);
    if (sa === sb) continue;
    const velke = Math.max(sa, sb), male = Math.min(sa, sb);
    const dv = rnd(0, 8), dm = rnd(dv + 1, 9);
    const nv = cislo(velke, dv, rnd(0, 9));
    const nm = cislo(male, dm, rnd(0, 9));
    return Math.random() < 0.5 ? porovnani(nv, nm, 1) : porovnani(nm, nv, 1);
  }
}

// ── L2 ──────────────────────────────────────────────────────────────────────

function porovnaniL2(): PracticeTask {
  const s = rnd(1, 9);
  let a: number, b: number;
  if (Math.random() < 0.6) {
    // liší se desítky; větší desítky mají menší jednotky
    const d1 = rnd(0, 8), d2 = rnd(d1 + 1, 9);
    const j2 = rnd(0, 8), j1 = rnd(j2 + 1, 9);
    a = cislo(s, d1, j1);
    b = cislo(s, d2, j2);
  } else {
    const d = rnd(0, 9);
    const j1 = rnd(0, 8), j2 = rnd(j1 + 1, 9);
    a = cislo(s, d, j1);
    b = cislo(s, d, j2);
  }
  return Math.random() < 0.5 ? porovnani(a, b, 2) : porovnani(b, a, 2);
}

function zapisSNulou(): PracticeTask {
  const s = rnd(1, 9);
  let x = rnd(1, 9);
  while (x === s) x = rnd(1, 9);
  const chybiDesitky = Math.random() < 0.5;
  const n = chybiDesitky ? cislo(s, 0, x) : cislo(s, x, 0);
  const cast = chybiDesitky ? pad(x, "JEDNOTKA") : pad(x, "DESÍTKA");
  const casti = [pad(s, "STOVKA"), cast];
  const zadani = (Math.random() < 0.5 ? casti : casti.reverse()).join(" a ");
  const prazdne = chybiDesitky ? "desítek" : "jednotek";
  const d: Distractor[] = chybiDesitky
    ? [
      { value: `${s}${x}`, why: `Chybí nula na místě desítek. Bez ní je ${s}${x} jen dvojmístné číslo.` },
      { value: String(cislo(s, x, 0)), why: `${x} je počet jednotek, a ty patří na poslední místo, ne doprostřed.` },
      { value: String(cislo(x, 0, s)), why: `Stovky a jednotky jsou prohozené. Na první místo zleva patří počet stovek, tedy ${s}.` },
    ]
    : [
      { value: `${s}${x}`, why: `Chybí nula na místě jednotek. Bez ní je ${s}${x} jen dvojmístné číslo.` },
      { value: String(cislo(s, 0, x)), why: `${x} je počet desítek, a ty patří doprostřed, ne na poslední místo.` },
      { value: String(cislo(x, s, 0)), why: `Stovky a desítky jsou prohozené. Na první místo zleva patří počet stovek, tedy ${s}.` },
    ];
  return choice(`Zapiš číslem: ${zadani}.`, String(n), tri(String(n), d), {
    hints: [
      `V zadání „${zadani}“ nejsou žádné ${chybiDesitky ? "desítky" : "jednotky"}. Co napíšeš na jejich místo?`,
      `Každé ze tří míst (stovky, desítky, jednotky) musí mít číslici — kde nic není, píše se 0. Hlídej pořadí zleva: stovky, desítky, jednotky, ne pořadí ze zadání. Prázdné je tady místo ${prazdne}.`,
    ],
    explanation: chybiDesitky
      ? `${pad(s, "STOVKA")} → ${s * 100}, žádné desítky → na místě desítek 0, ${pad(x, "JEDNOTKA")} → ${x}. Zleva ${s}, 0, ${x}, tedy ${n}.`
      : `${pad(s, "STOVKA")} → ${s * 100}, ${pad(x, "DESÍTKA")} → ${x * 10}, žádné jednotky → na konci 0. Zleva ${s}, ${x}, 0, tedy ${n}.`,
  });
}

function razeni(): PracticeTask {
  const h = rnd(1, 8);
  const t = rnd(0, 9);
  let t2 = rnd(0, 9);
  while (t2 === t) t2 = rnd(0, 9);
  const u1 = rnd(0, 8), u2 = rnd(u1 + 1, 9);
  const n1 = cislo(h, t, u1), n2 = cislo(h, t, u2), n3 = cislo(h, t2, rnd(0, 9));
  const n4 = cislo(h + 1, rnd(0, 3), rnd(0, 9)); // víc stovek, ale malé desítky
  const nums = [n1, n2, n3, n4];
  const sorted = [...nums].sort((x, y) => x - y);
  let zam = shuffle(nums);
  while (zam.join(",") === sorted.join(",")) zam = shuffle(nums);
  const fmt = (arr: number[]) => arr.join(", ");
  const correct = fmt(sorted);
  const i1 = sorted.indexOf(n1);
  const swapJ = [...sorted];
  [swapJ[i1], swapJ[i1 + 1]] = [swapJ[i1 + 1], swapJ[i1]];
  const podleJednotek = [...nums].sort((x, y) => (x % 10) - (y % 10) || x - y);
  const podleKonce = [...nums].sort((x, y) => (x % 100) - (y % 100) || x - y);
  const kandidati: Distractor[] = [
    { value: fmt(swapJ), why: `${n1} a ${n2} mají stejné stovky i desítky, takže rozhodují jednotky: ${u1} je méně než ${u2}.` },
    { value: fmt([...sorted].reverse()), why: "Tohle je pořadí od největšího. Úloha chce začít nejmenším číslem." },
    { value: fmt(podleKonce), why: `Tohle pořadí sleduje jen desítky a jednotky. ${n4} má ale víc stovek než ostatní, proto patří na konec.` },
    { value: fmt(podleJednotek), why: "Tohle pořadí sleduje jen jednotky. Porovnávat se musí zleva, od stovek." },
  ];
  // Záložní chybné pořadí: prohozená sousední dvojice, s vysvětlením právě té dvojice.
  for (let i = 0; i < 3; i++) {
    const p = [...sorted];
    [p[i], p[i + 1]] = [p[i + 1], p[i]];
    const x = sorted[i], y = sorted[i + 1];
    const dx = [Math.floor(x / 100), Math.floor(x / 10) % 10, x % 10];
    const dy = [Math.floor(y / 100), Math.floor(y / 10) % 10, y % 10];
    const k = dx.findIndex((c, m) => c !== dy[m]);
    kandidati.push({ value: fmt(p), why: `${y} a ${x} jsou prohozené: na místě ${MISTO[k]} má ${x} číslici ${dx[k]}, kdežto ${y} číslici ${dy[k]}, takže ${x} je menší.` });
  }
  return choice(`Seřaď čísla od nejmenšího po největší: ${fmt(zam)}.`, correct, tri(correct, kandidati), {
    hints: [
      `Začni stovkami: porovnej čísla ${zam[0]} a ${zam[1]}, pak přidej ${zam[2]} a ${zam[3]}. Která mají nejméně stovek?`,
      `Nejdřív porovnej stovky: tři čísla mají na místě stovek ${h}, jedno má ${h + 1}. Čísla se stejnými stovkami porovnej podle desítek. Shodují-li se i desítky, rozhodnou jednotky.`,
    ],
    explanation: `Čísla ${n1}, ${n2} a ${n3} mají na místě stovek ${h}, číslo ${n4} má ${h + 1}, proto je největší. `
      + `Z ostatních rozhodují desítky, a u ${n1} a ${n2} jsou stejné i desítky, takže rozhodnou jednotky. Pořadí: ${correct}.`,
  });
}

function posun(): PracticeTask {
  const step = Math.random() < 0.5 ? 1 : 10;
  const nahoru = Math.random() < 0.5;
  const h = nahoru ? rnd(1, 8) : rnd(1, 9);
  let n: number, chyba: number, napoveda: string, proc: string;
  if (step === 1 && nahoru) {
    const t = rnd(0, 9);
    n = cislo(h, t, 9); chyba = n - 9;
    napoveda = `V čísle ${n} je na místě jednotek 9. Když přidáš jednotku, vznikne celá desítka${t === 9 ? " — a protože i desítek je 9, vznikne dokonce celá stovka" : ", a proto se změní i číslice desítek"}.`;
    proc = t === 9
      ? "Na místě jednotek i desítek je 9. S další jednotkou vznikne celá desítka a s ní i celá stovka, a proto se zvětší číslice stovek a na místě desítek i jednotek bude 0."
      : "Na místě jednotek je 9. S další jednotkou vznikne celá desítka, a proto se číslice desítek zvětší o 1 a na místě jednotek bude 0.";
  } else if (step === 1) {
    const t = rnd(0, 9);
    n = cislo(h, t, 0); chyba = n + 9;
    napoveda = `V čísle ${n} je na místě jednotek 0 a z nuly nejde ubrat. ${t === 0 ? "Desítky jsou taky 0, proto si musíš rozměnit jednu stovku." : "Rozměň si proto jednu desítku na 10 jednotek."}`;
    proc = t === 0
      ? "Na místě jednotek i desítek je 0, a proto se rozmění jedna stovka. Číslice stovek se zmenší o 1 a na místě desítek i jednotek bude 9."
      : "Na místě jednotek je 0, a proto se rozmění jedna desítka na 10 jednotek. Číslice desítek se zmenší o 1 a na místě jednotek bude 9.";
  } else if (nahoru) {
    n = cislo(h, 9, rnd(0, 9)); chyba = n - 90;
    napoveda = `V čísle ${n} je na místě desítek 9. Když přidáš desítku, vznikne celá stovka, a proto se změní i číslice stovek.`;
    proc = "Na místě desítek je 9. S další desítkou vznikne celá stovka, a proto se číslice stovek zvětší o 1 a na místě desítek bude 0.";
  } else {
    n = cislo(h, 0, rnd(0, 9)); chyba = n + 90;
    napoveda = `V čísle ${n} je na místě desítek 0 a z nuly nejde ubrat. Rozměň si proto jednu stovku na 10 desítek.`;
    proc = "Na místě desítek je 0, a proto se rozmění jedna stovka na 10 desítek. Číslice stovek se zmenší o 1 a na místě desítek bude 9.";
  }
  const smer = nahoru ? 1 : -1;
  const r = n + smer * step;
  const jiny = step === 1 ? 10 : 1;
  const slovo = nahoru ? "větší" : "menší";
  const kandidati: Distractor[] = [
    { value: String(chyba), why: nahoru
      ? `Změnila se jen jedna číslice. Přechodem přes 9 ale vznikne celá ${step === 1 ? "desítka" : "stovka"}, takže se musí zvětšit i číslice vlevo.`
      : `Změnila se jen jedna číslice. Z nuly nejde ubrat — nejdřív se musí rozměnit vyšší řád, takže se zmenší i číslice vlevo.` },
    { value: String(n - smer * step), why: `To je číslo o ${step} ${nahoru ? "menší" : "větší"}. Hledáme číslo o ${step} ${slovo}.` },
    { value: String(n + smer * jiny), why: `To je číslo o ${jiny} ${slovo}, ne o ${step}.` },
    { value: String(n + smer * 2 * step), why: `Posun je o dvě ${step === 1 ? "jednotky" : "desítky"}, ne o jednu.` },
  ];
  return choice(`Které číslo je o ${step} ${slovo} než ${n}?`, String(r), tri(String(r), kandidati), {
    hints: [`Na číselné ose se od ${n} posuň o ${step} ${nahoru ? "doprava" : "doleva"}.`, napoveda],
    explanation: `${n} ${nahoru ? "+" : "−"} ${step} = ${r}. ${proc}`,
  });
}

// ── L3 ──────────────────────────────────────────────────────────────────────

function preskupeni(): PracticeTask {
  const s = rnd(2, 7), D = rnd(11, 19), j = rnd(2, 9);
  const n = s * 100 + D * 10 + j;
  const zadani = `${pad(s, "STOVKA")}, ${pad(D, "DESÍTKA")} a ${pad(j, "JEDNOTKA")}`;
  const kandidati: Distractor[] = [
    { value: String(s * 100 + (D % 10) * 10 + j), why: `${pad(D, "DESÍTKA")} je ${D * 10}, ne ${(D % 10) * 10} — jedna stovka z desítek se ztratila.` },
    { value: String(s * 100 + D + j), why: `${pad(D, "DESÍTKA")} není ${D}, ale ${D * 10}. Každá desítka má hodnotu 10.` },
    { value: String(n + 100), why: `${pad(D, "DESÍTKA")} dá jen jednu stovku navíc, ne dvě.` },
  ];
  return choice(`Jaké číslo má ${zadani}?`, String(n), tri(String(n), kandidati), {
    hints: [
      `Zadání: ${zadani}. Kolik desítek tvoří jednu stovku?`,
      `Deset desítek je jedna stovka. ${pad(D, "DESÍTKA")} rozděl na 1 stovku a zbylé desítky, stovku přidej ke stovkám, které už máš. Pak zapiš stovky, desítky a jednotky zleva.`,
    ],
    explanation: `${pad(D, "DESÍTKA")} = ${D * 10} = 1 stovka a ${pad(D - 10, "DESÍTKA")}. Stovek je tedy ${s + 1}, desítek ${D - 10} a jednotek ${j}: ${s * 100} + ${D * 10} + ${j} = ${n}.`,
  });
}

function zCislic(): PracticeTask {
  const sNulou = Math.random() < 0.5;
  let digs: number[];
  for (;;) {
    digs = sNulou ? [0, rnd(1, 9), rnd(1, 9)] : [rnd(1, 9), rnd(1, 9), rnd(1, 9)];
    if (new Set(digs).size === 3) break;
  }
  const max = Math.random() < 0.5;
  const desc = [...digs].sort((x, y) => y - x);
  const asc = [...digs].sort((x, y) => x - y);
  const minPerm = asc[0] === 0 ? [asc[1], 0, asc[2]] : asc;
  const cil = max ? desc : minPerm;
  const str = (p: number[]) => p.join("");
  const correct = str(cil);
  const perms: number[][] = [];
  for (const a of digs) for (const b of digs) for (const c of digs) {
    if (a !== b && b !== c && a !== c && a !== 0) perms.push([a, b, c]);
  }
  const hodnota = (p: number[]) => Number(str(p));
  const jine = perms.filter((p) => str(p) !== correct)
    .sort((p, q) => (max ? hodnota(q) - hodnota(p) : hodnota(p) - hodnota(q)));
  const proc = (p: number[]): string => {
    const k = p.findIndex((x, i) => x !== cil[i]);
    return `Na místě ${MISTO[k]} stojí ${p[k]}. Šla by tam ${max ? "větší" : "menší"} číslice a číslo by bylo ${max ? "větší" : "menší"}.`;
  };
  const kandidati: Distractor[] = [];
  if (!max && sNulou) kandidati.push({ value: str(asc), why: `Trojmístné číslo nesmí začínat nulou. Zápis ${str(asc)} je vlastně jen ${hodnota(asc)}, tedy dvojmístné číslo.` });
  const opacne = max ? minPerm : desc;
  kandidati.push({ value: str(opacne), why: `To je naopak ${max ? "nejmenší" : "největší"} číslo, které z těchto číslic sestavíš.` });
  for (const p of jine) kandidati.push({ value: str(p), why: proc(p) });
  const seznam = shuffle(digs);
  const vypis = `${seznam[0]}, ${seznam[1]} a ${seznam[2]}`;
  const slovo = max ? "největší" : "nejmenší";
  return choice(`Z číslic ${vypis} sestav ${slovo} trojmístné číslo. Každou číslici použij jednou.`, correct, tri(correct, kandidati), {
    hints: [
      `Která z číslic ${vypis} patří na místo stovek, aby číslo bylo co ${max ? "největší" : "nejmenší"}?`,
      max
        ? `Největší číslo dostaneš, když na každé místo zleva (stovky, desítky, jednotky) dáš největší číslici, která z ${vypis} ještě zbyla.`
        : sNulou
          ? `Na každé místo zleva dej nejmenší číslici, která z ${vypis} ještě zbyla. Pozor: nula nesmí stát na místě stovek, jinak by číslo nebylo trojmístné.`
          : `Nejmenší číslo dostaneš, když na každé místo zleva (stovky, desítky, jednotky) dáš nejmenší číslici, která z ${vypis} ještě zbyla.`,
    ],
    explanation: !max && sNulou
      ? `Nula nesmí být na začátku, a proto na místo stovek patří ${cil[0]}, nejmenší nenulová číslice. Na místo desítek pak dáme nulu a na konec ${cil[2]}: ${correct}.`
      : `Na místo stovek patří ${slovo} číslice ${cil[0]}, na místo desítek ${cil[1]} a na místo jednotek ${cil[2]}. Proto je ${slovo} číslo ${correct}.`,
  });
}

function celeDesitky(): PracticeTask {
  const penize = Math.random() < 0.5;
  const s = rnd(2, 9);
  let d = rnd(0, 9);
  while (d === s) d = rnd(0, 9);
  const j = penize ? 0 : rnd(1, 9);
  const n = cislo(s, d, j);
  const ans = s * 10 + d;
  const correct = String(ans);
  const desetikorun = (x: number) => `${x} ${plural(x, "desetikoruna", "desetikoruny", "desetikorun")}`;
  if (penize) {
    const kandidati: Distractor[] = [
      d > 0
        ? { value: String(d), why: `${d} je jen číslice na místě desítek. Každých 100 Kč se ale rozmění na dalších 10 desetikorun.` }
        : { value: String(ans + 10), why: `Tolik desetikorun by dalo ${s * 100 + 100} Kč, tedy o stovku víc.` },
      { value: String(s), why: `${s} je počet celých stokorun, ne desetikorun.` },
      { value: String(n), why: `${n} je počet korun. Jedna desetikoruna má ale hodnotu 10 Kč.` },
    ];
    return choice(`Kolik desetikorun dostaneš, když ${n} Kč rozměníš na desetikoruny?`, correct, tri(correct, kandidati), {
      hints: [
        `Kolik desetikorun je v jedné stokoruně? A kolik stovek má ${n} Kč?`,
        d > 0
          ? `Každých 100 Kč se rozmění na 10 desetikorun. Spočítej desetikoruny ze všech ${s * 100} Kč a přidej ty, které dá zbytek ${d * 10} Kč.`
          : `Každých 100 Kč se rozmění na 10 desetikorun. Částka ${n} Kč je složená jen ze stovek, takže stačí spočítat desetikoruny ze všech stovek.`,
      ],
      explanation: d > 0
        ? `${s * 100} Kč dá ${desetikorun(s * 10)} a ${d * 10} Kč dá ${desetikorun(d)}. Celkem ${s * 10} + ${d} = ${ans}, protože ${n} Kč obsahuje ${pad(ans, "DESÍTKA")}.`
        : `Každých 100 Kč dá 10 desetikorun a ${n} Kč má ${pad(s, "STOVKA")}. Celkem ${s} × 10 = ${ans}.`,
    });
  }
  const kandidati: Distractor[] = [
    { value: String(d), why: `${d} je jen číslice na místě desítek. Každá stovka ale obsahuje dalších 10 desítek.` },
    { value: String(s), why: `${s} je počet stovek, ne desítek.` },
    { value: String(n - j), why: `${n - j} je hodnota všech desítek dohromady, ne jejich počet.` },
    { value: String(ans + 1), why: `Jednotek je jen ${j}, na další celou desítku to nestačí.` },
  ];
  return choice(`Kolik celých desítek obsahuje číslo ${n}?`, correct, tri(correct, kandidati), {
    hints: [
      `Kolik desítek je v jedné stovce? A kolik stovek má číslo ${n}?`,
      `Jedna stovka obsahuje 10 desítek. Spočítej desítky ve všech stovkách čísla ${n} a přidej desítky z místa desítek. Jednotky (${j}) celou desítku nedají.`,
    ],
    explanation: `${n} = ${s * 100} + ${d * 10} + ${j}. V ${s * 100} je ${pad(s * 10, "DESÍTKA")} a z místa desítek přibude ${d}. Celkem ${s * 10} + ${d} = ${ans}; jednotky celou desítku nedají.`,
  });
}

// ── Generátor ───────────────────────────────────────────────────────────────

/** Nápověda nesmí obsahovat číselný klíč jako samostatné číslo (kontrola úniku). */
function unik(t: PracticeTask): boolean {
  if (!/^\d+$/.test(t.correctAnswer)) return false;
  const re = new RegExp(`(^|[^\\d.,])${t.correctAnswer}([^\\d.,]|$)`);
  return (t.hints ?? []).some((h) => re.test(h.replace(/[;:!?"'„“()]/g, " ")) || h.includes(`= ${t.correctAnswer}`));
}

function gen(level: number): PracticeTask[] {
  const typy = level === 1
    ? [zapisCislem, cisliceNaMiste, porovnaniL1]
    : level === 2
      ? [zapisSNulou, porovnaniL2, razeni, posun]
      : [preskupeni, zCislic, celeDesitky];
  const tasks: PracticeTask[] = [];
  for (let i = 0; i < 24; i++) {
    let t = typy[i % typy.length]();
    while (unik(t)) t = typy[i % typy.length]();
    tasks.push(t);
  }
  return shuffle(tasks);
}

export const CTENIZAPISPOROVNAVANICISELDO1000: TopicMetadata[] = [
  {
    id: "g3-mat-cisla-do-1000",
    rvpNodeId: "g3-matematika-cislo-a-pocetni-operace-ciselny-obor-0-1000-cteni-zapis-a-porovnavani-cisel-do-1000",
    title: "Čtení, zápis a porovnávání čísel do 1000",
    studentTitle: "Čísla do 1000",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Číselný obor 0–1000",
    briefDescription: "Přečteš, zapíšeš a porovnáš čísla až do tisíce.",
    keywords: ["čísla do 1000", "stovky", "desítky", "jednotky", "porovnávání", "řazení", "rozklad"],
    goals: [
      "Přečíst a zapsat čísla do 1000.",
      "Rozložit číslo na stovky, desítky a jednotky.",
      "Porovnat a seřadit čísla do 1000.",
    ],
    boundaries: ["Pouze přirozená čísla 0–1000.", "Nezahrnuje záporná čísla ani desetinná čísla."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Každé číslo má tři části: stovky, desítky, jednotky. 357 = 3 stovky + 5 desítek + 7 jednotek.",
      steps: [
        "Podívej se na první číslici — to jsou stovky.",
        "Druhá číslice jsou desítky.",
        "Třetí číslice jsou jednotky.",
        "Pro porovnání: začni od stovek — větší stovky = větší číslo.",
      ],
      commonMistake: "Záměna desítek a jednotek: 352 ≠ 325.",
      example: "573: 5 stovek, 7 desítek, 3 jednotky. 573 > 357 (5 stovek > 3 stovky).",
    },
  },
];
