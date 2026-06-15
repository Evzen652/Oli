/**
 * VIZUÁLNÍ SMOKE TEST (UI↔validátor) — odborné typy 2. stupně.
 *
 * Doplňuje `stupen2-odborne-typy.smoke.test.ts` (validační vrstva) o ověření,
 * že ANSWER string EMITOVANÝ odbornou UI komponentou skutečně SEDÍ na formát,
 * který validátor čeká. Bez tohohle by autor mohl mít validátor i komponentu
 * každou zvlášť „správně", ale vzájemně rozjeté (komponenta emituje jiný formát).
 *
 * Pokrývá `chemical_balance`, `timeline`, `formula_builder` — typy, kde
 * komponenta sama serializuje strukturovaný vstup na pipe-string. (number/
 * numeric_range/diagram_label jsou prosté a pokryté jinde.)
 *
 * Vzor: render → simuluj vstup → zachyť onSubmit(answer) → validateAnswer(answer, expected).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { ChemicalBalanceInput } from "@/components/ChemicalBalanceInput";
import { TimelineInput } from "@/components/TimelineInput";
import { FormulaBuilderInput } from "@/components/FormulaBuilderInput";
import { validateAnswer } from "@/lib/validators";

beforeEach(() => cleanup());

/** Zachytí poslední answer předaný do onSubmit. */
function captureSubmit() {
  const fn = vi.fn();
  return { onSubmit: fn, last: () => fn.mock.calls.at(-1)?.[0] as string | undefined };
}

describe("UI↔validátor: chemical_balance", () => {
  // 2 H2 + O2 = 2 H2O → koeficienty 2, 1, 2
  const tokens = [
    { value: "?", isCoefficient: true },
    { value: "H2", isCoefficient: false },
    { value: "+", isCoefficient: false },
    { value: "?", isCoefficient: true },
    { value: "O2", isCoefficient: false },
    { value: "=", isCoefficient: false },
    { value: "?", isCoefficient: true },
    { value: "H2O", isCoefficient: false },
  ];
  const expected = "2|H2|1|O2|2|H2O";

  it("komponenta emituje jen koeficienty (2|1|2) a validátor je přijme", () => {
    const { onSubmit, last } = captureSubmit();
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={onSubmit} />);

    const inputs = document.querySelectorAll('input[type="text"]');
    expect(inputs).toHaveLength(3); // tři koeficienty k doplnění
    fireEvent.change(inputs[0], { target: { value: "2" } });
    fireEvent.change(inputs[1], { target: { value: "1" } });
    fireEvent.change(inputs[2], { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));

    expect(last()).toBe("2|1|2");
    expect(validateAnswer(last()!, expected, { inputType: "chemical_balance" }).correct).toBe(true);
  });

  it("špatný koeficient → validátor odmítne", () => {
    const { onSubmit, last } = captureSubmit();
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={onSubmit} />);
    const inputs = document.querySelectorAll('input[type="text"]');
    fireEvent.change(inputs[0], { target: { value: "2" } });
    fireEvent.change(inputs[1], { target: { value: "2" } }); // má být 1
    fireEvent.change(inputs[2], { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));

    expect(last()).toBe("2|2|2");
    expect(validateAnswer(last()!, expected, { inputType: "chemical_balance" }).correct).toBe(false);
  });

  it("submit je disabled, dokud nejsou doplněny všechny koeficienty", () => {
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
    const inputs = document.querySelectorAll('input[type="text"]');
    fireEvent.change(inputs[0], { target: { value: "2" } });
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled(); // jen 1/3
  });
});

describe("UI↔validátor: timeline", () => {
  // Math.random → 0.999 dělá z Fisher-Yates shuffle identitu (j === i pro každé i),
  // takže iniciální pořadí == pořadí předaných events → deterministický test.
  beforeEach(() => vi.spyOn(Math, "random").mockReturnValue(0.999));
  afterEach(() => vi.restoreAllMocks());

  const events = [
    { id: "a", label: "Pravěk" },
    { id: "b", label: "Antika" },
    { id: "c", label: "Středověk" },
  ];
  const expected = "Pravěk|Antika|Středověk";

  it("správné chronologické pořadí → answer sedí na validátor", () => {
    const { onSubmit, last } = captureSubmit();
    render(<TimelineInput events={events} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));

    expect(last()).toBe(expected);
    expect(validateAnswer(last()!, expected, { inputType: "timeline" }).correct).toBe(true);
  });

  it("prohození pořadí (šipka dolů na 1. položce) → validátor odmítne", () => {
    const { onSubmit, last } = captureSubmit();
    render(<TimelineInput events={events} onSubmit={onSubmit} />);
    // Posuň „Pravěk" dolů → pořadí Antika|Pravěk|Středověk
    fireEvent.click(screen.getAllByTitle("Posunout dolů")[0]);
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));

    expect(last()).toBe("Antika|Pravěk|Středověk");
    expect(validateAnswer(last()!, expected, { inputType: "timeline" }).correct).toBe(false);
  });
});

describe("UI↔validátor: formula_builder", () => {
  // hustota: ρ = m / V
  const pool = [
    { id: "1", token: "ρ" },
    { id: "2", token: "=" },
    { id: "3", token: "m" },
    { id: "4", token: "/" },
    { id: "5", token: "V" },
  ];
  const expected = "ρ|=|m|/|V";

  /** Klikni pool díly v daném pořadí (každý token unikátní → bez kolize s assembled). */
  function buildFormula(order: string[]) {
    for (const token of order) {
      const poolSection = screen.getByText(/Dostupné díly/i).parentElement!;
      fireEvent.click(within(poolSection).getByRole("button", { name: token }));
    }
  }

  it("sestavení ve správném pořadí → answer sedí na validátor", () => {
    const { onSubmit, last } = captureSubmit();
    render(<FormulaBuilderInput pool={pool} onSubmit={onSubmit} />);
    buildFormula(["ρ", "=", "m", "/", "V"]);
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));

    expect(last()).toBe(expected);
    expect(validateAnswer(last()!, expected, { inputType: "formula_builder" }).correct).toBe(true);
  });

  it("prohozené pořadí (V před m) → validátor odmítne", () => {
    const { onSubmit, last } = captureSubmit();
    render(<FormulaBuilderInput pool={pool} onSubmit={onSubmit} />);
    buildFormula(["ρ", "=", "V", "/", "m"]);
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));

    expect(last()).toBe("ρ|=|V|/|m");
    expect(validateAnswer(last()!, expected, { inputType: "formula_builder" }).correct).toBe(false);
  });

  it("submit disabled při prázdné sestavě", () => {
    render(<FormulaBuilderInput pool={pool} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });
});
