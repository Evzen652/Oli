import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";

/**
 * SLOVNÍKOVÝ STRÁŽCE vyjmenovaných slov.
 *
 * Pravopisná cvičení jsou nejrizikovější obsah v aplikaci: překlep ve správné
 * odpovědi ("byk" místo "býk") učí dítě CHYBU. Tento test pinuje každou
 * correctAnswer témat vyjmenovaných slov na kurátorovaný seznam správných
 * českých tvarů. Přidáš-li do banky nové slovo, přidej ho i sem — vědomě.
 *
 * PED-1 refaktor (2026-07-08) změnil "fill" úlohy tak, že correctAnswer je
 * jen sporný grafém (y/ý/i/í), ne celé slovo — proto se u nich slovo musí
 * nejdřív rekonstruovat z otázky (token s "_" + grafém) a teprve to se ověří
 * proti kánonu. "which" úlohy mají correctAnswer pořád celé slovo.
 *
 * 2026-09-11 (audit 3. ročníku): témata mají oddělené banky pro L1–L3, věty
 * jsou v českých uvozovkách „…“ a L3 obsahuje i slova s i/í, která jen znějí
 * podobně (mít × mýt, bílý × bylina). Kontrolují se všechny tři úrovně.
 */

// Správné tvary používané v generátorech (vyjmenovaná slova, příbuzná slova
// a slova s i/í, se kterými se pletou; vč. skloňování)
const CANON = new Set([
  // B
  "býk", "být", "bylina", "byliny", "kobyla", "kobylka", "bydlení", "bydliště", "bydlet", "bystrý",
  "dobytek", "obyvatel", "příbytek", "nábytek", "zabydleli", "bylinkový",
  // L
  "lyžích", "lýko", "lysý", "blýskalo", "lyžař", "lyže", "lyžovali", "slyšet", "plynout",
  "polykej", "neslyšný", "neslyšící",
  // M
  "mýdlo", "mýt", "myslet", "mýlili", "myšlenka", "myšlenku", "hmyz", "umyvadlo", "umyvadle", "přemýšlel",
  // P
  "pýcha", "pytli", "pytle", "pytel", "pytlík", "pytlíku", "pyl", "pykat", "pyšný", "opylují",
  // S
  "sýr", "sytý", "syn", "syna", "syrový", "sýkora", "sypat", "nasytit", "nasytila", "sýrečky", "posypal",
  // V
  "výt", "výr", "vysoký", "výška", "výšky", "zvyk", "zvykat", "zvyklost", "výskat", "výskaly", "zvyknout",
  // Z
  "brzy", "brzký", "jazyk", "nazývat", "jazykový", "jazykové",
  // i/í — slova, která s vyjmenovanými jen podobně znějí
  "mít", "bít", "vír", "vít", "líže", "bílé", "bílá", "letišti",
]);

const TOPIC_IDS = ["g3-cjl-vyjmenovana-slova", "g3-cjl-slova-pribuzna-vyjmenovana"];

/** Posbírá všechny unikátní tasky generátoru na všech úrovních (generátor vzorkuje náhodně). */
function collectAllTasks(generator: (level: number) => { question: string; correctAnswer: string }[]) {
  const byQuestion = new Map<string, { question: string; correctAnswer: string }>();
  for (let i = 0; i < 40; i++) {
    for (const level of [1, 2, 3]) {
      for (const t of generator(level)) byQuestion.set(t.question, t);
    }
  }
  return [...byQuestion.values()];
}

const GRAPHEME_ANSWER = /^[yýií]$/;

/** "fill" úlohy: dosadí grafém do tokenu s "_" v citované větě a vrátí holé slovo. */
function reconstructFillWord(question: string, grapheme: string): string {
  const quoted = question.match(/[„']([^“']*)[“']/)?.[1] ?? question;
  const blankToken = quoted.split(/\s+/).find(tok => tok.includes("_")) ?? "";
  return blankToken
    .replace("_", grapheme)
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")
    .toLowerCase();
}

describe("Vyjmenovaná slova — slovníkový strážce správných odpovědí", () => {
  const topics = getAllTopics().filter(t => TOPIC_IDS.includes(t.id));

  it("obě témata existují v registry", () => {
    expect(topics.map(t => t.id).sort()).toEqual([...TOPIC_IDS].sort());
  });

  for (const id of TOPIC_IDS) {
    it(`${id}: každá correctAnswer je správný český tvar z kánonu`, () => {
      const topic = topics.find(t => t.id === id);
      expect(topic?.generator).toBeDefined();
      const tasks = collectAllTasks(topic!.generator!);
      expect(tasks.length).toBeGreaterThan(5);

      const offenders = tasks
        .filter(t => {
          const answer = String(t.correctAnswer).trim();
          const word = GRAPHEME_ANSWER.test(answer)
            ? reconstructFillWord(t.question, answer)
            : answer.toLowerCase();
          return !CANON.has(word);
        })
        .map(t => `"${t.correctAnswer}" (otázka: ${t.question.slice(0, 50)})`);

      expect(offenders, `Odpovědi mimo kánon — překlep, nebo přidej do CANON:\n${offenders.join("\n")}`).toEqual([]);
    });
  }
});
