import type { PracticeTask } from "@/lib/types";

// Společné pro matematiku 5. ročníku (2026-09-11, audit 5. ročníku).
// Stejný princip jako ve 4. ročníku: distraktory vznikají z typických chyb
// (neposunutá čárka, zapomenutý přenos, vynechaná nula v podílu…) a každý
// nese vysvětlení, jakou chybu dítě udělalo.

export const RADY = ["jednotky", "desítky", "stovky", "tisíce", "desetitisíce", "stotisíce", "miliony"];

export function fmt(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\s/g, " ");
}

/** Desetinné číslo česky (3,5 · 1 234,75 · −4 s typografickým minusem). */
export function fdec(n: number): string {
  const r = Math.round(n * 10000) / 10000;
  const s = Math.abs(r).toLocaleString("cs-CZ", { maximumFractionDigits: 4 }).replace(/\s/g, " ");
  return r < 0 ? `−${s}` : s;
}

/** Peníze vždy se dvěma desetinnými místy: 45,60. */
export function fkc(n: number): string {
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, " ");
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function rnd(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface Chyba { value: number | string; why: string }

/**
 * Výběrová úloha s číselnou (nebo krátkou textovou) odpovědí.
 * Z `chyby` se vezmou první tři hodnoty, které se liší od klíče i od sebe;
 * u číselného klíče chybějící doplní odchylka o 10, 100, 1 000… s obecným
 * vysvětlením. U textového klíče musí `chyby` dát tři různé hodnoty, jinak
 * funkce vrátí null a generátor zkusí jiné zadání.
 */
export function ciselnaUloha(
  question: string,
  correct: number | string,
  chyby: Chyba[],
  hints: [string, string],
  solutionSteps: string[],
): PracticeTask | null {
  const key = String(correct);
  const vybrane: Chyba[] = [];
  const seen = new Set<string>([key]);
  for (const c of chyby) {
    const v = String(c.value);
    if (seen.has(v)) continue;
    if (typeof c.value === "number" && (c.value < 0 || !Number.isFinite(c.value))) continue;
    seen.add(v);
    vybrane.push({ value: v, why: c.why });
    if (vybrane.length === 3) break;
  }
  if (typeof correct === "number") {
    for (const k of [10, 100, 1000, 1, 10000]) {
      for (const sign of [1, -1]) {
        if (vybrane.length === 3) break;
        const v = correct + sign * k;
        if (v < 0 || seen.has(String(v))) continue;
        seen.add(String(v));
        vybrane.push({ value: String(v), why: `Výsledek se liší o ${fmt(k)} — v jednom řádu je chyba. Zkontroluj ${RADY[String(k).length - 1] ?? "řády"}.` });
      }
    }
  }
  if (vybrane.length < 3) return null;
  const optionFeedback: Record<string, string> = {};
  for (const c of vybrane) optionFeedback[String(c.value)] = c.why;
  return {
    question,
    correctAnswer: key,
    options: shuffle([key, ...vybrane.map((c) => String(c.value))]),
    optionFeedback,
    hints,
    solutionSteps,
  };
}

/** Vyrobí `pocet` úloh z tvůrce; opakovaná zadání a nepovedené pokusy (null) přeskočí. */
export function sada(pocet: number, tvor: (i: number) => PracticeTask | null): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < pocet * 10 && out.size < pocet; i++) {
    const t = tvor(i);
    if (t && !out.has(t.question)) out.set(t.question, t);
  }
  return [...out.values()];
}

// ── Čísla slovy (pro čtení a zápis velkých a desetinných čísel) ─────────────
const JEDNOTKY = ["", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];
const NACT = ["deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"];
const DESITKY = ["", "", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];
const STOVKY = ["", "sto", "dvě stě", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set"];

/**
 * Hodnoty trojic, které umíme bezpečně přečíst: 1–19 a násobky pěti. U složených
 * čísel končících na 1–4 (dvacet dva…) kolísá tvar počítaného slova, proto se
 * v úlohách nepoužívají.
 */
export const TROJICE: number[] = [
  ...Array.from({ length: 19 }, (_, i) => i + 1),
  ...Array.from({ length: 196 }, (_, i) => 20 + 5 * i),
];
export const lzeCist = (g: number) => g === 0 || TROJICE.includes(g);

/** 1–999 slovy (jedna, dvacet pět, tři sta padesát). */
export function slovy(n: number): string {
  const s = Math.floor(n / 100), r = n % 100;
  const zbytek = r === 0 ? "" : r < 10 ? JEDNOTKY[r] : r < 20 ? NACT[r - 10] : `${DESITKY[Math.floor(r / 10)]}${r % 10 ? ` ${JEDNOTKY[r % 10]}` : ""}`;
  return [STOVKY[s], zbytek].filter(Boolean).join(" ");
}

/** Trojice s počítaným slovem: 1 → jeden milion / jedna miliarda / tisíc, 2 → dva miliony / dvě miliardy… */
export function trojiceSlovy(g: number, rad: "miliarda" | "milion" | "tisic" | "jednotky"): string {
  if (g === 0) return "";
  if (rad === "jednotky") return slovy(g);
  const [one, few, many] = rad === "miliarda" ? ["miliarda", "miliardy", "miliard"] : rad === "milion" ? ["milion", "miliony", "milionů"] : ["tisíc", "tisíce", "tisíc"];
  if (g === 1) return rad === "miliarda" ? "jedna miliarda" : rad === "milion" ? "jeden milion" : "tisíc";
  if (g === 2) return `${rad === "miliarda" ? "dvě" : "dva"} ${few}`;
  if (g === 3 || g === 4) return `${slovy(g)} ${few}`;
  return `${slovy(g)} ${many}`;
}

/** Celé číslo do miliard slovy; trojice musí být čitelné (lzeCist). */
export function cisloSlovy(n: number): string {
  const b = Math.floor(n / 1e9), m = Math.floor(n / 1e6) % 1000, t = Math.floor(n / 1e3) % 1000, u = n % 1000;
  return [trojiceSlovy(b, "miliarda"), trojiceSlovy(m, "milion"), trojiceSlovy(t, "tisic"), trojiceSlovy(u, "jednotky")].filter(Boolean).join(" ");
}
