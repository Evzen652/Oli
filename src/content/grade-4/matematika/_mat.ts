import type { PracticeTask } from "@/lib/types";

// Společné pro matematiku 4. ročníku (2026-09-11).
//
// Distraktory mají vznikat z typických chyb (zapomenutý přenos, neposunutý
// mezisoučet, vynechaná nula v podílu…) a každý nese vysvětlení, jakou chybu
// dítě udělalo. Když chybový model nedá tři různé hodnoty, doplní se obecná
// odchylka v jednom řádu — i ta má vysvětlení.

export const RADY = ["jednotky", "desítky", "stovky", "tisíce", "desetitisíce", "stotisíce", "miliony"];
export const RADY_2P = ["jednotek", "desítek", "stovek", "tisíců", "desetitisíců", "stotisíců", "milionů"];

export function fmt(n: number): string {
  return n.toLocaleString("cs-CZ").replace(/\s/g, " ");
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

export interface Chyba { value: number | string; why: string }

/**
 * Výběrová úloha s číselnou (nebo krátkou textovou) odpovědí.
 * Z `chyby` se vezmou první tři hodnoty, které se liší od klíče i od sebe;
 * chybějící doplní odchylka o 10, 100, 1 000… s obecným vysvětlením.
 */
export function ciselnaUloha(
  question: string,
  correct: number | string,
  chyby: Chyba[],
  hints: [string, string],
  solutionSteps: string[],
): PracticeTask {
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
