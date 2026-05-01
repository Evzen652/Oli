import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MiniExplainer } from "@/components/MiniExplainer";
import type { TopicMetadata } from "@/lib/types";

/**
 * MiniExplainer (Fáze 10) — kompaktní vizuální vysvětlení nad taskem.
 *
 * Pravidla:
 *  - Default collapsed
 *  - Reset (zavření) při změně resetKey
 *  - Pokud topic nemá visualExamples / žádný hasContent, NErenderuje se
 *  - První visualExample je tahoun (fractionBars > illustration)
 */

const baseHelp = (extra: Partial<TopicMetadata["helpTemplate"]> = {}) => ({
  hint: "h",
  steps: [],
  commonMistake: "",
  example: "",
  ...extra,
});

const makeTopic = (help: TopicMetadata["helpTemplate"]): TopicMetadata => ({
  id: "t1",
  title: "T",
  subject: "matematika",
  category: "C",
  topic: "Topic",
  briefDescription: "d",
  keywords: ["k"],
  goals: ["g"],
  boundaries: ["b"],
  gradeRange: [3, 3],
  inputType: "number",
  generator: () => [],
  helpTemplate: help,
});

describe("MiniExplainer — render / no-render", () => {
  it("nerenderuje se, pokud helpTemplate nemá visualExamples", () => {
    const topic = makeTopic(baseHelp());
    const { container } = render(<MiniExplainer topic={topic} />);
    expect(container.firstChild).toBeNull();
  });

  it("nerenderuje se, pokud visualExamples má prázdný example", () => {
    const topic = makeTopic(
      baseHelp({
        visualExamples: [{ label: "L" }],
      })
    );
    const { container } = render(<MiniExplainer topic={topic} />);
    expect(container.firstChild).toBeNull();
  });

  it("renderuje se, pokud visualExample má illustration", () => {
    const topic = makeTopic(
      baseHelp({
        visualExamples: [{ label: "L", illustration: "ASCII art\n3+3=6", conclusion: "Tedy 6." }],
      })
    );
    render(<MiniExplainer topic={topic} />);
    expect(screen.getByRole("button", { name: /Mini-příklad/i })).toBeInTheDocument();
  });

  it("renderuje se, pokud visualExample má fractionBars", () => {
    const topic = makeTopic(
      baseHelp({
        visualExamples: [{ label: "L", fractionBars: [{ fraction: "1/2", numerator: 1, denominator: 2 }] }],
      })
    );
    render(<MiniExplainer topic={topic} />);
    expect(screen.getByRole("button", { name: /Mini-příklad/i })).toBeInTheDocument();
  });

  it("renderuje se, pokud visualExample má conclusion (i bez ostatních)", () => {
    const topic = makeTopic(
      baseHelp({
        visualExamples: [{ label: "L", conclusion: "1+1=2" }],
      })
    );
    render(<MiniExplainer topic={topic} />);
    expect(screen.getByRole("button", { name: /Mini-příklad/i })).toBeInTheDocument();
  });
});

describe("MiniExplainer — collapsible chování", () => {
  const topic = makeTopic(
    baseHelp({
      visualExamples: [{ label: "Příklad 1", illustration: "1+1=2", conclusion: "Tedy 2." }],
    })
  );

  it("default je zavřený (illustration není v DOM)", () => {
    render(<MiniExplainer topic={topic} />);
    expect(screen.queryByText(/1\+1=2/)).not.toBeInTheDocument();
  });

  it("klik otevře", () => {
    render(<MiniExplainer topic={topic} />);
    const trigger = screen.getByRole("button", { name: /Mini-příklad/i });
    fireEvent.click(trigger);
    // Po otevření je trigger pojmenovaný "Skrýt..."
    expect(screen.getByRole("button", { name: /Skrýt mini-příklad/i })).toBeInTheDocument();
  });

  it("opětovný klik zavře", () => {
    render(<MiniExplainer topic={topic} />);
    const trigger = screen.getByRole("button", { name: /Mini-příklad/i });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: /Skrýt/i }));
    expect(screen.queryByRole("button", { name: /Skrýt/i })).not.toBeInTheDocument();
  });
});

describe("MiniExplainer — reset při změně resetKey", () => {
  const topic = makeTopic(
    baseHelp({
      visualExamples: [{ label: "Příklad 1", illustration: "1+1=2" }],
    })
  );

  it("resetKey change → zavře otevřený panel", () => {
    const { rerender } = render(<MiniExplainer topic={topic} resetKey="task1" />);
    fireEvent.click(screen.getByRole("button", { name: /Mini-příklad/i }));
    expect(screen.getByRole("button", { name: /Skrýt/i })).toBeInTheDocument();
    rerender(<MiniExplainer topic={topic} resetKey="task2" />);
    expect(screen.queryByRole("button", { name: /Skrýt/i })).not.toBeInTheDocument();
  });
});
