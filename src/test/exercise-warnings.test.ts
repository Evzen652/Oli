import { describe, it, expect } from "vitest";
import { detectExerciseWarnings } from "@/lib/exerciseWarnings";

describe("detectExerciseWarnings", () => {
  it("čistá úloha nevygeneruje žádné varování", () => {
    const w = detectExerciseWarnings({
      inputType: "select_one",
      question: "Kolik je 2 + 3?",
      correctAnswer: "5",
      options: ["5", "4", "6", "7"],
      hints: ["Přidávej po jedné.", "Zkus prsty na ruce."],
    });
    expect(w).toEqual([]);
  });

  it("hint prozrazující odpověď → hint_leak", () => {
    const w = detectExerciseWarnings({
      inputType: "select_one",
      question: "Jaké je hlavní město Česka?",
      correctAnswer: "Praha",
      options: ["Praha", "Brno", "Ostrava", "Plzeň"],
      hints: ["Správná odpověď je Praha."],
    });
    expect(w.some((x) => x.category === "hint_leak")).toBe(true);
  });

  it("odpověď doslova ve znění otázky → giveaway_question", () => {
    const w = detectExerciseWarnings({
      inputType: "select_one",
      question: "Který savec je pes? Pes.",
      correctAnswer: "Pes",
      options: ["Pes", "Kapr", "Orel", "Žába"],
    });
    expect(w.some((x) => x.category === "giveaway_question")).toBe(true);
  });

  it("čistě číselná odpověď v otázce NENÍ giveaway (false-positive guard)", () => {
    const w = detectExerciseWarnings({
      inputType: "select_one",
      question: "Kolik je 5 + 0?",
      correctAnswer: "5",
      options: ["5", "4", "6", "50"],
    });
    expect(w.some((x) => x.category === "giveaway_question")).toBe(false);
  });

  it("true_false přeskočí giveaway v otázce", () => {
    const w = detectExerciseWarnings({
      inputType: "true_false",
      question: "Pardubice jsou krajské město. Pravda, nebo nepravda?",
      correctAnswer: "Pravda",
      options: ["Pravda", "Nepravda"],
    });
    expect(w.some((x) => x.category === "giveaway_question")).toBe(false);
  });

  it("nápadně dlouhá správná možnost → giveaway_option", () => {
    const w = detectExerciseWarnings({
      inputType: "select_one",
      question: "Co je fotosyntéza?",
      correctAnswer: "Proces, kterým rostliny vyrábějí cukry ze světla",
      options: [
        "Proces, kterým rostliny vyrábějí cukry ze světla",
        "dýchání",
        "spánek",
        "růst",
      ],
    });
    expect(w.some((x) => x.category === "giveaway_option")).toBe(true);
  });

  it("meta-slovo ve správné možnosti → giveaway_option", () => {
    const w = detectExerciseWarnings({
      inputType: "select_one",
      question: "Vyber správnou dvojici.",
      correctAnswer: "kůň → savec (patří)",
      options: ["kůň → savec (patří)", "kapr", "orel", "moucha"],
    });
    expect(w.some((x) => x.category === "giveaway_option")).toBe(true);
  });

  it("match_pairs nehlásí giveaway (correctAnswer je marker \"match\")", () => {
    const w = detectExerciseWarnings({
      inputType: "match_pairs",
      question: "Spoj zvíře se skupinou.",
      correctAnswer: "match",
      options: [],
    });
    expect(w).toEqual([]);
  });
});
