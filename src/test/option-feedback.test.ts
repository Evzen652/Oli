import { describe, it, expect } from "vitest";
import { getTargetedFeedback } from "@/components/CheckFeedbackCard";
import type { PracticeTask } from "@/lib/types";

/**
 * Engine cíleného feedbacku per zvolená možnost (optionFeedback).
 * Jádro kvality 2. stupně: každý distraktor = typická chyba → diagnostikuje.
 */

const baseTask: PracticeTask = {
  question: "Vypočítej obsah čtverce se stranou 5 cm.",
  correctAnswer: "25 cm²",
  options: ["25 cm²", "20 cm²", "10 cm²", "5 cm²"],
  explanation: "Obsah čtverce = strana × strana = 5 × 5 = 25 cm².",
  optionFeedback: {
    "20 cm²": "Spočítal jsi obvod (4 × 5), ne obsah. Obsah je strana × strana.",
    "10 cm²": "Sečetl jsi jen dvě strany (5 + 5). Obsah se počítá násobením.",
  },
};

describe("getTargetedFeedback — přímá shoda klíče", () => {
  it("vrátí cílené vysvětlení pro diagnostikovanou špatnou možnost", () => {
    expect(getTargetedFeedback(baseTask, "20 cm²")).toBe(
      "Spočítal jsi obvod (4 × 5), ne obsah. Obsah je strana × strana.",
    );
  });

  it("toleruje okolní mezery ve zvolené odpovědi", () => {
    expect(getTargetedFeedback(baseTask, "  10 cm²  ")).toBe(
      "Sečetl jsi jen dvě strany (5 + 5). Obsah se počítá násobením.",
    );
  });

  it("vrátí null pro možnost bez záznamu (fallback na explanation)", () => {
    expect(getTargetedFeedback(baseTask, "5 cm²")).toBeNull();
  });

  it("vrátí null pro správnou odpověď", () => {
    expect(getTargetedFeedback(baseTask, "25 cm²")).toBeNull();
  });
});

describe("getTargetedFeedback — okrajové případy", () => {
  it("vrátí null, když task nemá optionFeedback", () => {
    const { optionFeedback, ...without } = baseTask;
    expect(getTargetedFeedback(without, "20 cm²")).toBeNull();
  });

  it("vrátí null pro prázdnou/chybějící zvolenou odpověď", () => {
    expect(getTargetedFeedback(baseTask, "")).toBeNull();
    expect(getTargetedFeedback(baseTask, undefined)).toBeNull();
  });
});

describe("getTargetedFeedback — multi_select (víc zvolených možností)", () => {
  const multiTask: PracticeTask = {
    question: "Které z látek jsou prvky?",
    correctAnswer: "kyslík, železo",
    correctAnswers: ["kyslík", "železo"],
    optionFeedback: {
      "voda": "Voda je sloučenina (H₂O), ne prvek — skládá se z vodíku a kyslíku.",
      "oxid uhličitý": "Oxid uhličitý je sloučenina (CO₂), ne prvek.",
    },
  };

  it("najde feedback pro první diagnostikovanou zvolenou možnost (oddělovač čárka)", () => {
    expect(getTargetedFeedback(multiTask, "kyslík, voda")).toBe(
      "Voda je sloučenina (H₂O), ne prvek — skládá se z vodíku a kyslíku.",
    );
  });

  it("podporuje oddělovač středník i pipu", () => {
    expect(getTargetedFeedback(multiTask, "železo; oxid uhličitý")).toBe(
      "Oxid uhličitý je sloučenina (CO₂), ne prvek.",
    );
    expect(getTargetedFeedback(multiTask, "kyslík|voda")).toBe(
      "Voda je sloučenina (H₂O), ne prvek — skládá se z vodíku a kyslíku.",
    );
  });

  it("vrátí null, když žádná zvolená možnost není diagnostikovaná", () => {
    expect(getTargetedFeedback(multiTask, "kyslík, železo")).toBeNull();
  });
});
