/**
 * Určovací úlohy (select_one) z banky položek s kategorií — slovní druhy,
 * druhy číslovek a přídavných jmen, slovesné způsoby… (2026-09-11, audit 5. ročníku).
 *
 * Každá položka je jedna úloha a patří k jedné úrovni (`uroven` = úroveň úlohy).
 * Chybné možnosti jsou jiné kategorie; jejich zpětná vazba připomene, podle čeho
 * se ta kategorie pozná. Vysvětlení (`proc`) říká, proč položka patří tam, kam patří.
 * Znění otázky a nápovědy skládá téma (`sestav`), aby byly vázané na položku.
 */
import type { PracticeTask } from "@/lib/types";
import { doplnVelkou, shuffle, type SUrovni } from "./_shared";

export interface Kategorie {
  nazev: string;
  /** Podle čeho se kategorie pozná — jde do zpětné vazby. */
  znak: string;
}

export interface Polozka extends SUrovni {
  slovo: string;
  veta: string;
  kategorie: string;
  /** Krátká stopa k této položce pro velkou nápovědu (bez názvu kategorie). */
  klic: string;
  /** Proč položka patří do kategorie — vysvětlení po odpovědi. */
  proc: string;
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const STRATEGIE = [
  "Pak zkus slovo ohýbat — mění se jeho tvar, nebo zůstává stejné?",
  "Porovnej to s otázkami, na které jednotlivé druhy odpovídají.",
];

export function urceni(
  bank: Polozka[],
  kategorie: Kategorie[],
  level: number,
  sestav: (p: Polozka) => { question: string; hints: [string, string] },
  /** Doplňky velké nápovědy, když je krátká; výchozí se hodí pro určování slov. */
  strategie: string[] = STRATEGIE,
): PracticeTask[] {
  return shuffle(bank.filter((p) => p.uroven === level).map((p) => {
    if (!kategorie.some((k) => k.nazev === p.kategorie)) throw new Error(`Neznámá kategorie „${p.kategorie}“`);
    const jine = shuffle(kategorie.filter((k) => k.nazev !== p.kategorie)).slice(0, 3);
    const { question, hints } = sestav(p);
    return {
      question,
      correctAnswer: p.kategorie,
      options: shuffle([p.kategorie, ...jine.map((k) => k.nazev)]),
      optionFeedback: Object.fromEntries(jine.map((k) => [k.nazev, `${cap(k.nazev)}: ${k.znak}`])),
      hints: [hints[0], doplnVelkou(hints[0], hints[1], strategie)],
      explanation: p.proc,
    };
  }));
}
