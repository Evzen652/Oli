/**
 * Odborné typy 2. stupně: vstupní komponenta ↔ validátor ↔ zobrazení odpovědi.
 *
 * Doplňuje `stupen2-odborne-typy-ui.smoke.test.tsx` (co komponenta EMITUJE)
 * o zbylé dva konce řetězu, které se do 14. 9. neověřovaly vůbec:
 *
 *  1. jaký VALIDÁTOR se na odpověď použije (`resolveTaskValidation`),
 *  2. co se ukáže dítěti, když odpoví ŠPATNĚ (`CheckFeedbackCard`).
 *
 * Proč vznikl: průchod prohlížečem (bod 1.6 plánu šestky) našel, že
 * `correctAnswer` je u těchhle typů strojový zápis — a ten se dítěti ukazoval
 * syrový: „Správná odpověď: img-modry“, „…A|B|C“, „…30±1“. Zároveň se validátor
 * vybíral jen podle `topic.inputType`, zatímco komponentu vybírá router podle
 * POLÍ úlohy; při neshodě se tiše porovnávalo přes string_exact.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { resolveTaskValidation } from "@/lib/validators";
import { CheckFeedbackCard } from "@/components/CheckFeedbackCard";
import { PracticeInputRouter } from "@/components/PracticeInputRouter";
import type { PracticeTask, TopicMetadata } from "@/lib/types";

beforeEach(() => cleanup());

const TOPIC: TopicMetadata = {
  id: "t",
  title: "T",
  subject: "dejepis",
  category: "C",
  topic: "T",
  briefDescription: "",
  keywords: [],
  goals: [],
  boundaries: [],
  gradeRange: [6, 6],
  inputType: "select_one",
  generator: () => [],
  helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
};

const TIMELINE: PracticeTask = {
  question: "Seřaď události.",
  correctAnswer: "Vznik písma|Založení Říma|Korunovace Karla IV.",
  timelineEvents: [
    { id: "a", label: "Vznik písma" },
    { id: "b", label: "Založení Říma" },
    { id: "c", label: "Korunovace Karla IV." },
  ],
};

const DIAGRAM: PracticeTask = {
  question: "Popiš body.",
  correctAnswer: "brána|věž|studna",
  diagram: {
    imageUrl: "/x.png",
    imageAlt: "plánek",
    points: [
      { id: "p1", x: 0.2, y: 0.3 },
      { id: "p2", x: 0.6, y: 0.2 },
      { id: "p3", x: 0.5, y: 0.7 },
    ],
    labelPool: ["brána", "věž", "studna", "hradby"],
  },
};

const IMAGE: PracticeTask = {
  question: "Který obrázek je modrý?",
  correctAnswer: "img-modry",
  imageOptions: [
    { id: "img-cerveny", url: "/a.png", alt: "červený čtverec" },
    { id: "img-modry", url: "/b.png", alt: "modrý čtverec" },
  ],
};

describe("resolveTaskValidation — validátor se pozná z TVARU úlohy", () => {
  it("timeline: pořadí se hodnotí timeline validátorem, ne string_exact", () => {
    expect(resolveTaskValidation(TIMELINE)).toEqual({
      expected: "Vznik písma|Založení Říma|Korunovace Karla IV.",
      validatorId: "timeline",
    });
  });

  it("diagram_label: popisky mají tolerovat překlep, tedy vlastní validátor", () => {
    expect(resolveTaskValidation(DIAGRAM).validatorId).toBe("diagram_label");
  });

  it("image_select: klíčem je id obrázku", () => {
    expect(resolveTaskValidation(IMAGE)).toEqual({
      expected: "img-modry",
      validatorId: "image_select",
    });
  });

  it("chemical_balance a formula_builder taky", () => {
    expect(
      resolveTaskValidation({
        correctAnswer: "2|1|2",
        chemEquation: { tokens: [{ value: "?", isCoefficient: true }] },
      }).validatorId,
    ).toBe("chemical_balance");
    expect(
      resolveTaskValidation({
        correctAnswer: "x|=|2",
        formulaPool: [{ id: "a", token: "x" }],
      }).validatorId,
    ).toBe("formula_builder");
  });

  it("běžná úloha zůstává beze změny (žádný validatorId navíc)", () => {
    expect(resolveTaskValidation({ correctAnswer: "42" })).toEqual({ expected: "42" });
  });
});

describe("CheckFeedbackCard — správná odpověď je čitelná, ne strojový zápis", () => {
  function renderKartu(task: PracticeTask, topic: TopicMetadata = TOPIC) {
    render(
      <CheckFeedbackCard
        checkFeedback="To není ono"
        lastAnswerCorrect={false}
        answeredTask={task}
        topic={topic}
        loading={false}
        isTerminal={false}
        onContinue={vi.fn()}
      />,
    );
  }

  it("timeline: číslovaný seznam místo „A|B|C“", () => {
    renderKartu(TIMELINE);
    expect(screen.getByText("Správné pořadí:")).toBeTruthy();
    expect(screen.getByText("Založení Říma")).toBeTruthy();
    expect(screen.queryByText(/\|/)).toBeNull();
  });

  it("diagram_label: popisek je přiřazený k číslu bodu", () => {
    renderKartu(DIAGRAM);
    expect(screen.getByText(/Bod 2:/)).toBeTruthy();
    expect(screen.getByText(/věž/)).toBeTruthy();
    expect(screen.queryByText(/\|/)).toBeNull();
  });

  it("image_select: ukáže obrázek a jeho popis, ne interní id", () => {
    renderKartu(IMAGE);
    expect(screen.getByText("modrý čtverec")).toBeTruthy();
    expect(screen.queryByText(/img-modry/)).toBeNull();
  });

  it("numeric_range: tolerance se přeloží do věty", () => {
    renderKartu({ question: "Kolik let?", correctAnswer: "30±1" }, { ...TOPIC, inputType: "numeric_range" });
    expect(screen.getByText("30 (stačí 29 až 31)")).toBeTruthy();
  });

  it("numeric_range: rozsah se přeloží taky", () => {
    renderKartu({ question: "Kolik?", correctAnswer: "5..6" }, { ...TOPIC, inputType: "numeric_range" });
    expect(screen.getByText("5 až 6")).toBeTruthy();
  });

  it("běžná úloha se zobrazí beze změny", () => {
    renderKartu({ question: "Kolik?", correctAnswer: "25 cm²" });
    expect(screen.getByText("25 cm²")).toBeTruthy();
  });
});

describe("PracticeInputRouter — numeric_range dostane číselné pole", () => {
  it("nerenderuje textareu pro volný text", () => {
    render(
      <PracticeInputRouter
        topic={{ ...TOPIC, inputType: "numeric_range" }}
        currentTask={{ question: "Kolik let?", correctAnswer: "30±1" }}
        userInput=""
        loading={false}
        onUserInputChange={vi.fn()}
        onAnswerSubmit={vi.fn()}
        onTextSubmit={vi.fn()}
      />,
    );
    expect(document.querySelector('input[type="number"]')).toBeTruthy();
    expect(document.querySelector("textarea")).toBeNull();
  });
});
