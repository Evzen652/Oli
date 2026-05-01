import { describe, it, expect } from "vitest";
import { checkHintLeakage } from "../../supabase/functions/_shared/hintLeakage";

/**
 * Hint leakage detector — kontroluje, jestli hinty NEPROZRAZUJí odpověď.
 *
 * Pedagogický princip: hint má NAVÉST k myšlení, ne dát výsledek.
 * Tady testujeme jak server-side validátor (curriculum wizard generuje
 * hinty + tato fn je validuje) tak runtime guard při AI-generated hint.
 */

describe("checkHintLeakage — žádné hinty", () => {
  it("task bez hints → ok", () => {
    const r = checkHintLeakage({
      question: "Kolik je 2+2?",
      correct_answer: "4",
    });
    expect(r.ok).toBe(true);
  });

  it("task s prázdným hints array → ok", () => {
    const r = checkHintLeakage({
      question: "Kolik je 2+2?",
      correct_answer: "4",
      hints: [],
    });
    expect(r.ok).toBe(true);
  });

  it("task bez correct_answer → ok (nelze leakovat)", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "",
      hints: ["Něco s 4"],
    });
    expect(r.ok).toBe(true);
  });
});

describe("checkHintLeakage — number leak detection", () => {
  it("hint obsahuje literál číselné odpovědi → leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je 12 × 3?",
      correct_answer: "36",
      hints: ["Spočítej 12 × 3 = 36"],
    });
    expect(r.ok).toBe(false);
    expect(r.leakingFragment).toBe("36");
  });

  it("hint zmíní odpověď bez '=' → stále leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je 12 × 3?",
      correct_answer: "36",
      hints: ["Pamatuj si, že je to 36."],
    });
    expect(r.ok).toBe(false);
  });

  it("hint zmiňuje JINÉ číslo (analogie) → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je 12 × 3?",
      correct_answer: "36",
      hints: ["Třeba 4 × 5 = 20 — to je jen příklad."],
    });
    expect(r.ok).toBe(true);
  });

  it("hint má číslo, které je SOUČÁSTÍ většího (word boundary)", () => {
    const r = checkHintLeakage({
      question: "Kolik je 5 × 7?",
      correct_answer: "35",
      hints: ["Hodnoty od 35000 jsou velké."],
    });
    // 35 je v 35000 → ne-leak (number boundary)
    expect(r.ok).toBe(true);
  });
});

describe("checkHintLeakage — equality pattern", () => {
  it("hint se vzorcem '= 36' → leak", () => {
    const r = checkHintLeakage({
      question: "12 × 3?",
      correct_answer: "36",
      hints: ["x = 36"],
    });
    expect(r.ok).toBe(false);
  });
});

describe("checkHintLeakage — text answer (multi-token)", () => {
  it("hint obsahuje celou textovou odpověď → leak", () => {
    const r = checkHintLeakage({
      question: "Jaký slovní druh je 'pes'?",
      correct_answer: "podstatné jméno",
      hints: ["Je to podstatné jméno."],
    });
    expect(r.ok).toBe(false);
  });

  it("hint obsahuje pouze 1 funkční slovo z odpovědi → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "podstatné jméno",
      hints: ["Slovo je."],
    });
    // "je" je HINT_NEUTRAL_WORD — ne-leak
    expect(r.ok).toBe(true);
  });

  it("hint navádějící otázkou (žádné slovo z odpovědi) → ne-leak", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "podstatné jméno",
      hints: ["Co se ptáš? Kdo? Co?"],
    });
    expect(r.ok).toBe(true);
  });

  it("hint obsahuje 1 významové slovo (4+ chars) z 2-tokenové odpovědi → leak", () => {
    const r = checkHintLeakage({
      question: "Q",
      correct_answer: "mužský rod",
      hints: ["Je to mužský prvek."],
    });
    expect(r.ok).toBe(false);
    expect(r.leakingFragment).toBe("mužský");
  });
});

describe("checkHintLeakage — fraction answer", () => {
  it("hint obsahuje doslovný zlomek → leak", () => {
    const r = checkHintLeakage({
      question: "Kolik je polovina jablka?",
      correct_answer: "1/2",
      hints: ["Tedy 1/2 jablka."],
    });
    expect(r.ok).toBe(false);
  });

  it("hint zmiňuje jiný zlomek → ne-leak", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "1/2",
      hints: ["Třeba 3/4 je víc než půlka."],
    });
    expect(r.ok).toBe(true);
  });
});

describe("checkHintLeakage — multi-hint, jen první leak hlášený", () => {
  it("několik hintů, pouze 1 leakuje → vrátí index a fragment", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "36",
      hints: [
        "Začni odhad.",
        "Spočti přesně. Tedy 36.",
        "Třetí hint.",
      ],
    });
    expect(r.ok).toBe(false);
    expect(r.leakingHintIndex).toBe(1);
  });
});

describe("checkHintLeakage — robustness", () => {
  it("non-string hint v array (e.g. null, number) je přeskočen, ne crash", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "5",
      hints: [null as unknown as string, undefined as unknown as string, "OK hint"],
    });
    expect(r.ok).toBe(true);
  });

  it("prázdný string hint je přeskočen", () => {
    const r = checkHintLeakage({
      question: "?",
      correct_answer: "5",
      hints: ["", "  ", "OK"],
    });
    expect(r.ok).toBe(true);
  });
});
