import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { EssayInput } from "@/components/EssayInput";

/**
 * EssayInput React UI tests (Fáze 11).
 *
 * Cíl: ověřit klientský flow:
 *  - Word count s minWords gate (button disabled pod minWords)
 *  - Submit volá edge fn, AI feedback se zobrazí in-place
 *  - "Pokračovat" emituje score string skrze onSubmit
 *  - Error → toast, žádný posun dál
 *  - XSS v textu se nerendererjuje jako HTML (React default)
 */

const invokeMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => invokeMock(...args) },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

beforeEach(() => {
  invokeMock.mockReset();
  cleanup();
});

describe("EssayInput — word count gate", () => {
  it("zobrazuje aktuální počet slov + zbývající do minima", () => {
    const onSubmit = vi.fn();
    render(<EssayInput prompt="Napiš o víkendu." minWords={20} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Začni psát/i);
    fireEvent.change(textarea, { target: { value: "jedno dva tři" } });
    expect(screen.getByText(/3 slov/i)).toBeInTheDocument();
    expect(screen.getByText(/ještě 17/i)).toBeInTheDocument();
  });

  it("submit disabled pod minWords, enabled nad", () => {
    const onSubmit = vi.fn();
    render(<EssayInput prompt="Napiš." minWords={5} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Začni psát/i);
    const button = screen.getByRole("button", { name: /Odeslat ke kontrole/i });

    expect(button).toBeDisabled();
    fireEvent.change(textarea, { target: { value: "jedno dva" } });
    expect(button).toBeDisabled();
    fireEvent.change(textarea, { target: { value: "jedno dva tři čtyři pět šest" } });
    expect(button).not.toBeDisabled();
  });

  it("default minWords = 30", () => {
    const { container } = render(<EssayInput prompt="..." onSubmit={vi.fn()} />);
    // Text "Minimálně" je v <p>, "30 slov" v <strong> — kompletně přes textContent
    expect(container.textContent).toMatch(/Minimálně\s*30 slov/);
  });
});

describe("EssayInput — AI grading flow", () => {
  const setup = () => {
    invokeMock.mockResolvedValue({
      data: {
        score: 75,
        praise: "Pěkný text.",
        suggestions: ["Použij víc přídavných jmen.", "Zkus pestřejší slovník."],
        errors: ["malý překlep"],
      },
      error: null,
    });
    const onSubmit = vi.fn();
    render(<EssayInput prompt="Napiš o víkendu." minWords={3} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Začni psát/i);
    fireEvent.change(textarea, { target: { value: "Můj víkend byl skvělý." } });
    return { onSubmit };
  };

  it("po odeslání zavolá edge fn s prompt + essay + min_words", async () => {
    const { onSubmit } = setup();
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalled());
    const callArgs = invokeMock.mock.calls[0];
    expect(callArgs[0]).toBe("evaluate-essay");
    expect(callArgs[1].body.prompt).toBe("Napiš o víkendu.");
    expect(callArgs[1].body.essay).toBe("Můj víkend byl skvělý.");
    expect(callArgs[1].body.min_words).toBe(3);
    expect(onSubmit).not.toHaveBeenCalled(); // ještě ne, čeká na "Pokračovat"
  });

  it("po grade zobrazí skóre, pochvalu, tipy", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/75\/100/)).toBeInTheDocument());
    expect(screen.getByText(/Pěkný text./i)).toBeInTheDocument();
    expect(screen.getByText(/Použij víc přídavných jmen./i)).toBeInTheDocument();
    expect(screen.getByText(/malý překlep/i)).toBeInTheDocument();
  });

  it("Pokračovat emituje score skrze onSubmit", async () => {
    const { onSubmit } = setup();
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => screen.getByText(/75\/100/));
    fireEvent.click(screen.getByRole("button", { name: /Pokračovat/i }));
    expect(onSubmit).toHaveBeenCalledWith("75");
  });

  it("score >= 60 zobrazí 'Pěkná práce!' (passed)", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/Pěkná práce/i)).toBeInTheDocument());
  });

  it("score < 60 zobrazí 'Skoro to bylo' (failed)", async () => {
    invokeMock.mockResolvedValue({
      data: { score: 45, praise: "Začátek je tu.", suggestions: ["Doplň závěr."] },
      error: null,
    });
    render(<EssayInput prompt="..." minWords={3} onSubmit={vi.fn()} />);
    const textarea = screen.getByPlaceholderText(/Začni psát/i);
    fireEvent.change(textarea, { target: { value: "Krátký text tady." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/Skoro to bylo/i)).toBeInTheDocument());
  });
});

describe("EssayInput — error handling", () => {
  it("AI error → zůstane na input view, neemituje onSubmit", async () => {
    invokeMock.mockResolvedValue({ data: null, error: { message: "down" } });
    const onSubmit = vi.fn();
    render(<EssayInput prompt="..." minWords={3} onSubmit={onSubmit} />);
    const textarea = screen.getByPlaceholderText(/Začni psát/i);
    fireEvent.change(textarea, { target: { value: "Tady je text." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalled());
    // Pořád vidí původní textarea (ne grade view)
    expect(screen.getByPlaceholderText(/Začni psát/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("server vrátí score=0 (validní fallback) → flow pokračuje", async () => {
    invokeMock.mockResolvedValue({
      data: { score: 0, praise: "", suggestions: [] },
      error: null,
    });
    const onSubmit = vi.fn();
    render(<EssayInput prompt="..." minWords={3} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/Začni psát/i), { target: { value: "Krátký text napsaný." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/0\/100/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /Pokračovat/i }));
    expect(onSubmit).toHaveBeenCalledWith("0");
  });

  it("malformed AI response (chybí score) → defaultně 0", async () => {
    invokeMock.mockResolvedValue({ data: { praise: "OK" }, error: null });
    const onSubmit = vi.fn();
    render(<EssayInput prompt="..." minWords={3} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/Začni psát/i), { target: { value: "Toto je krátký test." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/0\/100/)).toBeInTheDocument());
  });
});

describe("EssayInput — XSS / sanitization", () => {
  it("HTML v essay textu není rendrován jako HTML (React default)", async () => {
    invokeMock.mockResolvedValue({
      data: { score: 70, praise: "<img src=x onerror=alert(1)>", suggestions: [] },
      error: null,
    });
    render(<EssayInput prompt="..." minWords={3} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Začni psát/i), { target: { value: "Krátký text tady." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/70\/100/)).toBeInTheDocument());
    // Praise content je rendrován jako TEXT (React escapuje), ne HTML
    expect(screen.getByText("<img src=x onerror=alert(1)>")).toBeInTheDocument();
    // Žádný skutečný <img> tag s onerror v DOM
    expect(document.querySelectorAll("img[onerror]").length).toBe(0);
  });

  it("script tag v suggestions je escapován, ne spuštěn", async () => {
    invokeMock.mockResolvedValue({
      data: { score: 70, praise: "ok", suggestions: ["<script>alert(1)</script>"] },
      error: null,
    });
    render(<EssayInput prompt="..." minWords={3} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Začni psát/i), { target: { value: "Dnes byl pěkný den." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/70\/100/)).toBeInTheDocument());
    // Žádný skutečný script v DOM (kromě těch co tam Vite/React vloží)
    const inserted = Array.from(document.querySelectorAll("script")).filter((s) =>
      s.textContent?.includes("alert(1)")
    );
    expect(inserted.length).toBe(0);
  });
});

describe("EssayInput — pole 'errors' (drobnosti) je optional", () => {
  it("AI bez errors pole → drobnosti panel se nerendererjuje", async () => {
    invokeMock.mockResolvedValue({
      data: { score: 75, praise: "ok", suggestions: ["Tip."] },
      error: null,
    });
    render(<EssayInput prompt="..." minWords={3} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Začni psát/i), { target: { value: "Dnes byl pěkný den." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/75\/100/)).toBeInTheDocument());
    expect(screen.queryByText(/Drobnosti/i)).not.toBeInTheDocument();
  });
  it("AI s prázdným errors array → drobnosti taky ne", async () => {
    invokeMock.mockResolvedValue({
      data: { score: 75, praise: "ok", suggestions: ["Tip."], errors: [] },
      error: null,
    });
    render(<EssayInput prompt="..." minWords={3} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Začni psát/i), { target: { value: "Dnes byl pěkný den." } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat ke kontrole/i }));
    await waitFor(() => expect(screen.getByText(/75\/100/)).toBeInTheDocument());
    expect(screen.queryByText(/Drobnosti/i)).not.toBeInTheDocument();
  });
});

describe("EssayInput — race conditions", () => {
  it("při probíhajícím grading je submit disabled (anti double-submit)", async () => {
    let resolve!: (v: unknown) => void;
    invokeMock.mockReturnValue(new Promise((r) => { resolve = r; }));
    render(<EssayInput prompt="..." minWords={3} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Začni psát/i), { target: { value: "Toto je krátký test." } });
    const button = screen.getByRole("button", { name: /Odeslat ke kontrole/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Hodnotím/i })).toBeDisabled();
    });
    resolve({ data: { score: 70, praise: "", suggestions: [] }, error: null });
  });

  it("disabled prop disabluje vstup", () => {
    render(<EssayInput prompt="..." minWords={3} onSubmit={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText(/Začni psát/i)).toBeDisabled();
  });
});
