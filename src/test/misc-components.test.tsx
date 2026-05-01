import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { SessionTimer } from "@/components/SessionTimer";
import { HelpButton } from "@/components/HelpButton";
import type { TopicMetadata, PracticeTask } from "@/lib/types";

/**
 * Misc UI komponenty smoke testy.
 *
 * Pokrývá:
 *  - ProgressIndicator (visual progress bar pro session)
 *  - SessionTimer (countdown / count-up režim, expiry callback)
 *  - HelpButton (collapsible nápověda, hint reveal, fallback chain)
 */

vi.mock("@/lib/i18n", () => ({
  useT: () => (key: string) => key,
  LocaleProvider: ({ children }: { children: React.ReactNode }) => children,
}));

beforeEach(() => {
  cleanup();
});

describe("ProgressIndicator", () => {
  it("renderuje 'Úloha X z Y' label", () => {
    render(<ProgressIndicator current={2} total={6} />);
    expect(screen.getByText(/Úloha 3 z 6/)).toBeInTheDocument();
  });

  it("current=total → klampuje na total (po finální úloze)", () => {
    render(<ProgressIndicator current={6} total={6} />);
    expect(screen.getByText(/Úloha 6 z 6/)).toBeInTheDocument();
  });

  it("renderuje 'total' dot indikátorů", () => {
    const { container } = render(<ProgressIndicator current={0} total={4} />);
    // 4 dots
    const dots = container.querySelectorAll(".rounded-full");
    expect(dots.length).toBeGreaterThanOrEqual(4);
  });

  it("results array s 'correct' → 😊 emoji", () => {
    render(<ProgressIndicator current={2} total={3} results={["correct", "wrong"]} />);
    expect(screen.getByText("😊")).toBeInTheDocument();
    expect(screen.getByText("😕")).toBeInTheDocument();
  });

  it("'help' výsledek → 🤔 emoji", () => {
    render(<ProgressIndicator current={1} total={2} results={["help"]} />);
    expect(screen.getByText("🤔")).toBeInTheDocument();
  });

  it("legendu zobrazí jen pokud existují results", () => {
    const { rerender } = render(<ProgressIndicator current={0} total={3} />);
    expect(screen.queryByText(/správně/)).not.toBeInTheDocument();
    rerender(<ProgressIndicator current={1} total={3} results={["correct"]} />);
    expect(screen.getByText(/správně/)).toBeInTheDocument();
  });
});

describe("SessionTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("count-up režim zobrazí 'M:SS' format", () => {
    render(
      <SessionTimer
        startTime={Date.now()}
        maxSeconds={1000}
        isActive
        onTimeExpired={vi.fn()}
        countUp
      />
    );
    expect(screen.getByText(/0:00/)).toBeInTheDocument();
  });

  it("countdown zobrazí remaining time + progress bar", () => {
    render(
      <SessionTimer
        startTime={Date.now()}
        maxSeconds={300}
        isActive
        onTimeExpired={vi.fn()}
      />
    );
    // 5:00 = 300s
    expect(screen.getByText(/5:00/)).toBeInTheDocument();
  });

  it("po uplynutí času volá onTimeExpired", () => {
    const onExpired = vi.fn();
    const start = Date.now();
    render(
      <SessionTimer
        startTime={start - 11_000}
        maxSeconds={10}
        isActive
        onTimeExpired={onExpired}
      />
    );
    // Po 1 tick interval (1s)
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(onExpired).toHaveBeenCalled();
  });

  it("isActive=false → žádný interval / žádné expirování", () => {
    const onExpired = vi.fn();
    render(
      <SessionTimer
        startTime={Date.now() - 1000}
        maxSeconds={10}
        isActive={false}
        onTimeExpired={onExpired}
      />
    );
    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    expect(onExpired).not.toHaveBeenCalled();
  });

  it("count-up režim NE-volá onTimeExpired ani po překročení maxSeconds", () => {
    const onExpired = vi.fn();
    render(
      <SessionTimer
        startTime={Date.now() - 100_000}
        maxSeconds={10}
        isActive
        onTimeExpired={onExpired}
        countUp
      />
    );
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onExpired).not.toHaveBeenCalled();
  });
});

const baseTopic: TopicMetadata = {
  id: "test-topic",
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
  helpTemplate: {
    hint: "Toto je nápověda",
    steps: ["Krok 1", "Krok 2"],
    commonMistake: "Nezapomeň na X",
    example: "Třeba 1+1=2",
  },
};

describe("HelpButton", () => {
  it("nerenderuje se pokud topic nemá help, žádné hints, žádné solutionSteps", () => {
    const noHelpTopic: TopicMetadata = {
      ...baseTopic,
      helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
    };
    const { container } = render(
      <HelpButton skillId="x" topic={null} currentTask={{ question: "?", correctAnswer: "x" }} />
    );
    // Bez help nebo hintů → null render
    expect(container.firstChild).toBeNull();
  });

  it("renderuje když topic má helpTemplate", () => {
    render(
      <HelpButton skillId="x" topic={baseTopic} currentTask={{ question: "?", correctAnswer: "x" }} />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renderuje pro task s hints (per-task hints prio před topic help)", () => {
    const task: PracticeTask = {
      question: "Q",
      correctAnswer: "A",
      hints: ["První hint", "Druhý hint", "Třetí hint"],
    };
    render(<HelpButton skillId="x" topic={baseTopic} currentTask={task} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("po kliku na trigger se panel rozbalí + zavolá onHelpOpened callback", () => {
    const onOpened = vi.fn();
    const task: PracticeTask = {
      question: "Q",
      correctAnswer: "A",
      hints: ["První hint"],
    };
    render(<HelpButton skillId="x" topic={baseTopic} currentTask={task} onHelpOpened={onOpened} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpened).toHaveBeenCalled();
    expect(screen.getByText(/První hint/)).toBeInTheDocument();
  });

  it("multi-hint progressive reveal: klik 'více' odhalí další", () => {
    const task: PracticeTask = {
      question: "Q",
      correctAnswer: "A",
      hints: ["Hint 1", "Hint 2", "Hint 3"],
    };
    render(<HelpButton skillId="x" topic={baseTopic} currentTask={task} />);
    fireEvent.click(screen.getByRole("button")); // open
    expect(screen.getByText(/Hint 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Hint 2/)).not.toBeInTheDocument();

    // Klik "help.more" reveal
    const moreBtn = screen.getByRole("button", { name: /help\.more/ });
    fireEvent.click(moreBtn);
    expect(screen.getByText(/Hint 2/)).toBeInTheDocument();
  });

  it("solutionSteps fallback (žádné hints) — renderuje krok-po-kroku", () => {
    const task: PracticeTask = {
      question: "Q",
      correctAnswer: "A",
      solutionSteps: ["První krok", "Druhý krok"],
      // No hints
    };
    render(<HelpButton skillId="x" topic={baseTopic} currentTask={task} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/První krok/)).toBeInTheDocument();
    expect(screen.getByText(/Druhý krok/)).toBeInTheDocument();
  });

  it("reset (close + revealed) při změně tasku", () => {
    const task1: PracticeTask = { question: "Q1", correctAnswer: "A", hints: ["H1", "H2"] };
    const task2: PracticeTask = { question: "Q2", correctAnswer: "B", hints: ["X1", "X2"] };
    const { rerender } = render(<HelpButton skillId="x" topic={baseTopic} currentTask={task1} />);
    fireEvent.click(screen.getByRole("button")); // open
    expect(screen.getByText(/H1/)).toBeInTheDocument();
    rerender(<HelpButton skillId="x" topic={baseTopic} currentTask={task2} />);
    // Po změně tasku je panel zavřený
    expect(screen.queryByText(/H1/)).not.toBeInTheDocument();
    expect(screen.queryByText(/X1/)).not.toBeInTheDocument();
  });

  it("hints prioritní před solutionSteps a topic help", () => {
    const task: PracticeTask = {
      question: "Q", correctAnswer: "A",
      hints: ["Specifický hint"],
      solutionSteps: ["NIKDY se nezobrazí"],
    };
    render(<HelpButton skillId="x" topic={baseTopic} currentTask={task} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/Specifický hint/)).toBeInTheDocument();
    expect(screen.queryByText(/NIKDY/)).not.toBeInTheDocument();
  });
});
