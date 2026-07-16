import { describe, it, expect } from "vitest";
import { getAllTopics } from "@/lib/contentRegistry";

/**
 * SLOVNÍKOVÝ STRÁŽCE vyjmenovaných slov.
 *
 * Pravopisná cvičení jsou nejrizikovější obsah v aplikaci: překlep ve správné
 * odpovědi ("byk" místo "býk") učí dítě CHYBU. Tento test pinuje každou
 * correctAnswer témat vyjmenovaných slov na kurátorovaný seznam správných
 * českých tvarů. Přidáš-li do POOLu nové slovo, přidej ho i sem — vědomě.
 *
 * PED-1 refaktor (2026-07-08) změnil "fill" úlohy tak, že correctAnswer je
 * jen sporný grafém (y/ý/i/í), ne celé slovo — proto se u nich slovo musí
 * nejdřív rekonstruovat z otázky (token s "_" + grafém) a teprve to se ověří
 * proti kánonu. "which" úlohy mají correctAnswer pořád celé slovo.
 */

// Správné tvary používané v generátorech (vyjmenovaná slova + příbuzná, vč. skloňování)
const CANON = new Set([
  // B
  "býk", "být", "bylina", "kobyla", "bydlení", "bydliště", "bystrý",
  // L
  "lyžích", "lýko", "lysý", "blýskalo", "lyžař",
  // M
  "mýdlo", "mýt", "myslet", "mýlili", "myšlenka",
  // P
  "pýcha", "pytli", "pytle", "pyl", "pykat",
  // S
  "sýr", "sytý", "syn", "syrový",
  // V
  "výt", "zvyk", "výskat", "zvyknout",
  // Z
  "brzy", "jazyk", "nazývat", "jazykový",
]);

const TOPIC_IDS = ["g3-cjl-vyjmenovana-slova", "g3-cjl-slova-pribuzna-vyjmenovana"];

/** Posbírá všechny unikátní tasky generátoru (generátor vzorkuje náhodně). */
function collectAllTasks(generator: (level: number) => { question: string; correctAnswer: string }[]) {
  const byQuestion = new Map<string, { question: string; correctAnswer: string }>();
  for (let i = 0; i < 40; i++) {
    for (const t of generator(3)) byQuestion.set(t.question, t);
  }
  return [...byQuestion.values()];
}

const GRAPHEME_ANSWER = /^[yýií]$/;

/** "fill" úlohy: dosadí grafém do tokenu s "_" v citované větě a vrátí holé slovo. */
function reconstructFillWord(question: string, grapheme: string): string {
  const quoted = question.match(/'([^']*)'/)?.[1] ?? question;
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
