import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { getAllTopics } from "@/lib/contentRegistry";
import { pickWorkedExample } from "@/lib/workedExample";
import { WorkedExample } from "@/components/WorkedExample";
import type { PracticeTask, TopicMetadata } from "@/lib/types";

const topic = (id: string) => getAllTopics().find((t) => t.id === id)!;

describe("pickWorkedExample — výběr úlohy", () => {
  it("každé téma má na každé úrovni ukázku i po vyloučení rozdělané sady", () => {
    const chybi: string[] = [];
    for (const t of getAllTopics()) {
      for (const level of [1, 2, 3]) {
        const batch = (t.generator(level) ?? []).slice(0, t.sessionTaskCount ?? 6);
        if (!pickWorkedExample(t, level, batch)) chybi.push(`${t.id} L${level}`);
      }
    }
    expect(chybi).toEqual([]);
  }, 120_000);

  it("nikdy nevrátí úlohu z rozdělané sady", () => {
    const t = topic("g3-cjl-doplnovaci-diktat");
    for (let i = 0; i < 20; i++) {
      const batch = t.generator(1).slice(0, 6);
      const ex = pickWorkedExample(t, 1, batch);
      expect(ex).not.toBeNull();
      expect(batch.map((x) => x.question)).not.toContain(ex!.question);
    }
  });

  it("když v poolu nezbývá nic mimo sadu → null (radši žádná ukázka než prozrazená)", () => {
    const t = topic("g3-cjl-doplnovaci-diktat");
    const vse = new Map<string, PracticeTask>();
    for (let i = 0; i < 30; i++) for (const x of t.generator(1)) vse.set(x.question, x);
    expect(pickWorkedExample(t, 1, [...vse.values()])).toBeNull();
  });

  it("padající generátor → null, ne výjimka", () => {
    const t = { ...topic("g3-cjl-doplnovaci-diktat"), generator: () => { throw new Error("boom"); } };
    expect(pickWorkedExample(t, 1, [])).toBeNull();
  });

  it("u „spoj dvojice“ (stejné zadání, jiné dvojice) vybere jinou sadu dvojic, ne jinou otázku", () => {
    const t = getAllTopics().find((x) => x.inputType === "match_pairs")!;
    const batch = t.generator(1).slice(0, 6);
    const ex = pickWorkedExample(t, 1, batch)!;
    expect(ex).not.toBeNull();
    expect(batch.map((b) => JSON.stringify(b.pairs))).not.toContain(JSON.stringify(ex.pairs));
  });
});

describe("WorkedExample — vykreslení", () => {
  const t = topic("g3-cjl-doplnovaci-diktat");
  const task: PracticeTask = {
    question: "Doplň: „Na obloze se zablesklo a bl_skalo.“",
    correctAnswer: "ý",
    options: ["i", "í", "y", "ý"],
    optionFeedback: { i: "Po L je tu vyjmenované slovo.", í: "Samohláska je dlouhá, ale…", y: "Krátké y tu není." },
    hints: ["h0", "h1"],
    explanation: "„Blýskat se“ je vyjmenované slovo po L.",
  };

  it("zadání, správná možnost se značkou, u chybných proč, a vysvětlení", () => {
    const { container, getByText } = render(<WorkedExample task={task} topic={t} />);
    getByText(task.question);
    const items = [...container.querySelectorAll("li")];
    expect(items).toHaveLength(4);
    const ok = items.find((li) => li.textContent?.startsWith("ý"))!;
    expect(ok.className).toContain("border-success");
    expect(ok.querySelector("svg")).not.toBeNull();
    getByText("Po L je tu vyjmenované slovo.");
    getByText("Krátké y tu není.");
    getByText("„Blýskat se“ je vyjmenované slovo po L.");
    // Obecná rada z výkladu tu NEmá být — v dialogu stojí o box výš.
    expect(container.textContent).not.toContain(t.helpTemplate.hint);
  });

  it("úloha bez možností → „Správná odpověď“ a kroky řešení", () => {
    const mat = topic("g4-mat-pisemne-nasobeni-4");
    const numTask: PracticeTask = { question: "660 × 7 = ?", correctAnswer: "4 620", solutionSteps: ["7 × 0 = 0", "7 × 6 = 42", "4 620"] };
    const fillTopic: TopicMetadata = { ...mat, inputType: "number" };
    const { container, getByText } = render(<WorkedExample task={numTask} topic={fillTopic} />);
    expect(container.querySelectorAll("li").length).toBe(3);
    expect(container.textContent).toContain("4 620");
    getByText("7 × 6 = 42");
  });
});
