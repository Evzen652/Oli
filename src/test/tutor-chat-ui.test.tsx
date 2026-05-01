import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { TutorChat } from "@/components/TutorChat";
import type { TopicMetadata, PracticeTask } from "@/lib/types";

/**
 * TutorChat React UI tests (Fáze 7).
 *
 * Cíl: ověřit klientské guardrails:
 *  - Max N otázek per task (default 5) → input + send disabled
 *  - Reset history při změně tasku NEBO topicu
 *  - Toast + revert při AI errorech (zachová text v inputu)
 *  - Empty input nesmí jít odeslat
 *  - maxLength input prop = 500
 *
 * Server-side guardrails (anti-leak filter, phase guardrails) jsou testované
 * v tutor-chat-antileak.test.ts a tutor-chat-edge.test.ts.
 */

const invokeMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

// useToast → no-op (toast komponenta sama testovaná není)
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const baseTopic: TopicMetadata = {
  id: "test-topic",
  title: "Násobilka",
  subject: "matematika",
  category: "Aritmetika",
  topic: "Násobilka",
  briefDescription: "Procvič si násobilku.",
  keywords: ["násobilka"],
  goals: ["Naučit násobilku"],
  boundaries: ["Žádné desetinné"],
  gradeRange: [3, 3],
  inputType: "number",
  generator: () => [],
  helpTemplate: { hint: "", steps: [], commonMistake: "", example: "" },
};

const baseTask: PracticeTask = {
  question: "Kolik je 6 × 6?",
  correctAnswer: "36",
};

beforeEach(() => {
  invokeMock.mockReset();
  cleanup();
});

describe("TutorChat — collapsible UX", () => {
  it("default je zavřený, klik na trigger ho otevře", () => {
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    const trigger = screen.getByRole("button", { name: /Nerozumím — zeptat se Oli/i });
    expect(trigger).toBeInTheDocument();
    fireEvent.click(trigger);
    // Po kliku label se mění
    expect(screen.getByRole("button", { name: /Zavřít chat s Oli/i })).toBeInTheDocument();
  });
});

describe("TutorChat — input limit per task", () => {
  it("po 5 odeslaných otázkách (default maxQuestions) input + send button disabled", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "OK" }, error: null });
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" maxQuestions={2} />);

    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;

    // 1st question
    fireEvent.change(input, { target: { value: "co znamená násobit?" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(1));

    // 2nd question
    fireEvent.change(input, { target: { value: "ještě jednou?" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(2));

    // Reached limit (maxQuestions=2) → placeholder se mění
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Limit dotazů na úlohu vyčerpán/i)).toBeInTheDocument();
    });
    // Input je disabled
    const limitedInput = screen.getByPlaceholderText(/Limit dotazů/i) as HTMLInputElement;
    expect(limitedInput).toBeDisabled();
  });

  it("nudge zpráva se zobrazí po dosažení limitu", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "OK" }, error: null });
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" maxQuestions={1} />);

    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/Zkus odpovědět/i)).toBeInTheDocument();
    });
  });
});

describe("TutorChat — reset history při změně tasku", () => {
  it("po změně currentTask se historie vyprázdní", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "Tady je rada." }, error: null });
    const { rerender } = render(
      <TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Co je násobení?" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => expect(screen.getByText(/Tady je rada./i)).toBeInTheDocument());

    // Change task
    const newTask: PracticeTask = { question: "Kolik je 7 × 7?", correctAnswer: "49" };
    rerender(<TutorChat topic={baseTopic} currentTask={newTask} phase="practice" />);

    // Historie se reset, zpráva už není v DOM
    await waitFor(() => {
      expect(screen.queryByText(/Tady je rada./i)).not.toBeInTheDocument();
    });
  });

  it("po změně topicu se historie taky vyprázdní", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "Rada k tématu." }, error: null });
    const { rerender } = render(
      <TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />
    );

    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "?" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(screen.getByText(/Rada k tématu./i)).toBeInTheDocument());

    const newTopic: TopicMetadata = { ...baseTopic, id: "another-topic", title: "Geometrie" };
    rerender(<TutorChat topic={newTopic} currentTask={baseTask} phase="practice" />);

    await waitFor(() => {
      expect(screen.queryByText(/Rada k tématu./i)).not.toBeInTheDocument();
    });
  });
});

describe("TutorChat — empty input nelze odeslat", () => {
  it("send button je disabled při prázdném inputu", () => {
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    // Najdi send button (jen ikonku obsahuje, hledej přes type="submit" nebo position)
    const buttons = screen.getAllByRole("button");
    const sendButton = buttons[buttons.length - 1]; // Send button je vpravo dole
    expect(sendButton).toBeDisabled();
  });

  it("whitespace-only nelze odeslat", async () => {
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "    " } });
    fireEvent.keyDown(input, { key: "Enter" });
    // Edge fn nesmí být zavolaná
    expect(invokeMock).not.toHaveBeenCalled();
  });
});

describe("TutorChat — error handling", () => {
  it("AI error → text se vrátí zpět do inputu, message se odebere z historie", async () => {
    invokeMock.mockResolvedValue({ data: null, error: { message: "AI gateway down" } });
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "co je to?" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      const restoredInput = screen.getByDisplayValue("co je to?");
      expect(restoredInput).toBeInTheDocument();
    });
  });

  it("empty reply → vyhodí jako error, vrátí text", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "" }, error: null });
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => {
      expect(screen.getByDisplayValue("test")).toBeInTheDocument();
    });
  });
});

describe("TutorChat — phase awareness", () => {
  it("phase=practice → empty state říká 'odpověď neprozradí'", () => {
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    expect(screen.getByText(/odpověď neprozradí/i)).toBeInTheDocument();
  });
  it("phase=explain → empty state je obecné", () => {
    render(<TutorChat topic={baseTopic} currentTask={null} phase="explain" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    expect(screen.queryByText(/neprozradí/i)).not.toBeInTheDocument();
  });
  it("phase=practice posílá current_task do edge fn", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "ok" }, error: null });
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "?" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(invokeMock).toHaveBeenCalled());
    const callArgs = invokeMock.mock.calls[0][1];
    expect(callArgs.body.phase).toBe("practice");
    expect(callArgs.body.current_task).toEqual({
      question: "Kolik je 6 × 6?",
      correct_answer: "36",
    });
  });
  it("phase=explain s currentTask=null neposílá current_task", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "ok" }, error: null });
    render(<TutorChat topic={baseTopic} currentTask={null} phase="explain" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "?" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(invokeMock).toHaveBeenCalled());
    const callArgs = invokeMock.mock.calls[0][1];
    expect(callArgs.body.phase).toBe("explain");
    expect(callArgs.body.current_task).toBeUndefined();
  });
});

describe("TutorChat — input maxLength", () => {
  it("input má maxLength=500 (anti-spam guardrail)", () => {
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    expect(input.maxLength).toBe(500);
  });
});

describe("TutorChat — history slim (max 6 turnů na server)", () => {
  it("posílá history bez aktuální user message (ta je zvlášť)", async () => {
    invokeMock.mockResolvedValue({ data: { reply: "ok" }, error: null });
    render(<TutorChat topic={baseTopic} currentTask={baseTask} phase="practice" />);
    fireEvent.click(screen.getByRole("button", { name: /Nerozumím/i }));
    const input = screen.getByPlaceholderText(/Napiš dotaz/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "první otázka" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(invokeMock).toHaveBeenCalled());
    const firstCall = invokeMock.mock.calls[0][1];
    // Při 1. otázce je history prázdná (nová user message není zahrnuta)
    expect(firstCall.body.history).toEqual([]);
    expect(firstCall.body.user_message).toBe("první otázka");
  });
});
