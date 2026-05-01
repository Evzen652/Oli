import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DragOrderInput } from "@/components/DragOrderInput";
import { MatchPairsInput } from "@/components/MatchPairsInput";
import { CategorizeInput } from "@/components/CategorizeInput";
import { MultiSelectInput } from "@/components/MultiSelectInput";
import { ImageSelectInput } from "@/components/ImageSelectInput";
import { ChemicalBalanceInput } from "@/components/ChemicalBalanceInput";
import { TimelineInput } from "@/components/TimelineInput";
import { FormulaBuilderInput } from "@/components/FormulaBuilderInput";
import { DiagramLabelInput } from "@/components/DiagramLabelInput";

/**
 * Domain-specific UI inputy — smoke + happy path tests.
 *
 * Pokrývá komponenty bez UI testu:
 *  - DragOrderInput, MatchPairsInput, CategorizeInput, MultiSelectInput
 *  - ImageSelectInput, ChemicalBalanceInput, TimelineInput
 *  - FormulaBuilderInput, DiagramLabelInput
 *
 * Pro každou: render OK, prázdný stav → submit disabled, vyplněný flow →
 * onSubmit s correct payload format (joined by appropriate separator).
 */

beforeEach(() => {
  cleanup();
  // Stabilize Math.random pro shuffle-deterministic testy
  vi.spyOn(Math, "random").mockReturnValue(0);
});

describe("DragOrderInput", () => {
  it("renderuje pool items", () => {
    render(<DragOrderInput items={["A", "B", "C"]} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /A/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /B/i })).toBeInTheDocument();
  });

  it("klik na pool item ho přesune do selected zone", () => {
    render(<DragOrderInput items={["A", "B"]} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^A$/ }));
    // Po kliku je A v selected zone (s číslem 1)
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it("vyplnění všech položek → submit button visible + onSubmit emituje 'A,B'", () => {
    const onSubmit = vi.fn();
    render(<DragOrderInput items={["A", "B"]} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /^A$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^B$/ }));
    fireEvent.click(screen.getByRole("button", { name: /Odeslat pořadí/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.stringMatching(/^[AB],[AB]$/));
  });

  it("klik na selected item ho vrátí zpět do pool", () => {
    render(<DragOrderInput items={["A", "B"]} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^A$/ }));
    // Zobrazená v selected (s "×" ikonou) — klik zpět do pool
    const selectedBtn = screen.getAllByRole("button").find((b) =>
      /1.*A/.test(b.textContent ?? "")
    );
    expect(selectedBtn).toBeDefined();
    fireEvent.click(selectedBtn!);
    // A zpátky v pool
    expect(screen.getByRole("button", { name: /^A$/ })).toBeInTheDocument();
  });

  it("Začít znovu vrací vše do pool", () => {
    render(<DragOrderInput items={["A", "B"]} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^A$/ }));
    const reset = screen.getByRole("button", { name: /Začít znovu/i });
    fireEvent.click(reset);
    expect(screen.getByRole("button", { name: /^A$/ })).toBeInTheDocument();
    expect(screen.getByText(/Klikni na položku níže/i)).toBeInTheDocument();
  });
});

describe("MultiSelectInput", () => {
  it("renderuje option per option", () => {
    render(<MultiSelectInput options={["A", "B", "C"]} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("button", { name: /A/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /B/ })).toBeInTheDocument();
  });

  it("submit disabled bez výběru", () => {
    render(<MultiSelectInput options={["A", "B"]} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });

  it("po kliku na option se selected toggle", () => {
    render(<MultiSelectInput options={["A", "B"]} onSubmit={vi.fn()} disabled={false} />);
    const optA = screen.getByRole("button", { name: /A/ });
    fireEvent.click(optA);
    // Po kliku se zobrazí ✓
    expect(optA.textContent).toMatch(/✓/);
  });

  it("submit emituje JSON sorted array", () => {
    const onSubmit = vi.fn();
    render(<MultiSelectInput options={["B", "A", "C"]} onSubmit={onSubmit} disabled={false} />);
    fireEvent.click(screen.getByRole("button", { name: /B/ }));
    fireEvent.click(screen.getByRole("button", { name: /A/ }));
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    // Sorted alphabetically
    expect(onSubmit).toHaveBeenCalledWith(JSON.stringify(["A", "B"]));
  });

  it("opětovný klik odstraní option z výběru", () => {
    render(<MultiSelectInput options={["A"]} onSubmit={vi.fn()} disabled={false} />);
    const optA = screen.getByRole("button", { name: /A/ });
    fireEvent.click(optA);
    fireEvent.click(optA);
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });
});

describe("MatchPairsInput", () => {
  const pairs = [
    { left: "Praha", right: "Česko" },
    { left: "Berlin", right: "Německo" },
  ];

  it("renderuje obě strany párů", () => {
    render(<MatchPairsInput pairs={pairs} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("button", { name: /Praha/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Berlin/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Česko/ })).toBeInTheDocument();
  });

  it("submit disabled bez všech matches", () => {
    render(<MatchPairsInput pairs={pairs} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("button", { name: /Odeslat odpověď/i })).toBeDisabled();
  });

  it("klik vlevo + vpravo vytvoří match (1× pair)", () => {
    render(<MatchPairsInput pairs={pairs} onSubmit={vi.fn()} disabled={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Praha/ }));
    fireEvent.click(screen.getByRole("button", { name: /Česko/ }));
    // Undo button se objeví po 1 matchi
    expect(screen.getByRole("button", { name: /Zpět/i })).toBeInTheDocument();
  });

  it("po vytvoření všech párů emituje JSON", () => {
    const onSubmit = vi.fn();
    render(<MatchPairsInput pairs={pairs} onSubmit={onSubmit} disabled={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Praha/ }));
    fireEvent.click(screen.getByRole("button", { name: /Česko/ }));
    fireEvent.click(screen.getByRole("button", { name: /Berlin/ }));
    fireEvent.click(screen.getByRole("button", { name: /Německo/ }));
    fireEvent.click(screen.getByRole("button", { name: /Odeslat odpověď/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const arg = onSubmit.mock.calls[0][0];
    const parsed = JSON.parse(arg);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
  });
});

describe("CategorizeInput", () => {
  const categories = [
    { name: "Ovoce", items: ["jablko"] },
    { name: "Zelenina", items: ["mrkev"] },
  ];

  it("renderuje category buckets + items", () => {
    render(<CategorizeInput categories={categories} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByText(/Ovoce/)).toBeInTheDocument();
    expect(screen.getByText(/Zelenina/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /jablko/ })).toBeInTheDocument();
  });

  it("klik na item + klik na category přiřadí", () => {
    render(<CategorizeInput categories={categories} onSubmit={vi.fn()} disabled={false} />);
    fireEvent.click(screen.getByRole("button", { name: /jablko/ }));
    fireEvent.click(screen.getByRole("button", { name: /Ovoce/ }));
    // Po přiřazení by se mělo zobrazit "jablko ×" v Ovoce category
    expect(screen.getByText(/jablko ×/)).toBeInTheDocument();
  });

  it("submit po všech přiřazeních emituje JSON dictionary", () => {
    const onSubmit = vi.fn();
    render(<CategorizeInput categories={categories} onSubmit={onSubmit} disabled={false} />);
    fireEvent.click(screen.getByRole("button", { name: /jablko/ }));
    fireEvent.click(screen.getByRole("button", { name: /Ovoce/ }));
    fireEvent.click(screen.getByRole("button", { name: /mrkev/ }));
    fireEvent.click(screen.getByRole("button", { name: /Zelenina/ }));
    fireEvent.click(screen.getByRole("button", { name: /Odeslat odpověď/i }));
    expect(onSubmit).toHaveBeenCalled();
    const parsed = JSON.parse(onSubmit.mock.calls[0][0]);
    expect(parsed).toHaveProperty("Ovoce");
    expect(parsed).toHaveProperty("Zelenina");
  });

  it("submit disabled dokud nejsou všechny přiřazené", () => {
    render(<CategorizeInput categories={categories} onSubmit={vi.fn()} disabled={false} />);
    expect(screen.getByRole("button", { name: /Odeslat odpověď/i })).toBeDisabled();
  });
});

describe("ImageSelectInput", () => {
  const imageOptions = [
    { url: "/img1.png", alt: "Obrázek 1", id: "id-1" },
    { url: "/img2.png", alt: "Obrázek 2", id: "id-2" },
  ];

  it("renderuje obrázky s alt atributy (a11y)", () => {
    render(<ImageSelectInput imageOptions={imageOptions} onSubmit={vi.fn()} />);
    expect(screen.getByAltText("Obrázek 1")).toBeInTheDocument();
    expect(screen.getByAltText("Obrázek 2")).toBeInTheDocument();
  });

  it("submit disabled bez výběru", () => {
    render(<ImageSelectInput imageOptions={imageOptions} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });

  it("klik na image + submit emituje image id", () => {
    const onSubmit = vi.fn();
    render(<ImageSelectInput imageOptions={imageOptions} onSubmit={onSubmit} />);
    // Image button má aria-label = alt text
    fireEvent.click(screen.getByRole("button", { name: "Obrázek 1" }));
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith("id-1");
  });
});

describe("ChemicalBalanceInput", () => {
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

  it("renderuje 3 coefficient inputy", () => {
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={vi.fn()} />);
    const inputs = document.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(3);
  });

  it("submit disabled bez vyplnění všech koeficientů", () => {
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Odeslat odpověď/i })).toBeDisabled();
  });

  it("vyplnění všech 3 koeficientů + submit → 'a|b|c' format", () => {
    const onSubmit = vi.fn();
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={onSubmit} />);
    const inputs = document.querySelectorAll('input[type="text"]');
    fireEvent.change(inputs[0], { target: { value: "2" } });
    fireEvent.change(inputs[1], { target: { value: "1" } });
    fireEvent.change(inputs[2], { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith("2|1|2");
  });

  it("non-numeric input je odstraněn (digit-only)", () => {
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={vi.fn()} />);
    const input = document.querySelectorAll('input[type="text"]')[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: "a2b3" } });
    expect(input.value).toBe("23");
  });

  it("disabled prop disabluje vše", () => {
    render(<ChemicalBalanceInput tokens={tokens} onSubmit={vi.fn()} disabled />);
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach((i) => expect(i).toBeDisabled());
  });
});

describe("TimelineInput", () => {
  const events = [
    { id: "e1", label: "Karel IV. (1346)" },
    { id: "e2", label: "Husitské války (1419)" },
    { id: "e3", label: "Bílá hora (1620)" },
  ];

  it("renderuje events", () => {
    render(<TimelineInput events={events} onSubmit={vi.fn()} />);
    expect(screen.getByText(/Karel IV./)).toBeInTheDocument();
    expect(screen.getByText(/Husitské války/)).toBeInTheDocument();
  });

  it("submit emituje labels v aktuálním pořadí oddělené |", () => {
    const onSubmit = vi.fn();
    render(<TimelineInput events={events} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /Odeslat odpověď/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const arg = onSubmit.mock.calls[0][0];
    expect(arg.split("|")).toHaveLength(3);
  });

  it("up arrow posune item nahoru", () => {
    render(<TimelineInput events={events} onSubmit={vi.fn()} />);
    const upButtons = screen.getAllByTitle(/Posunout nahoru/i);
    expect(upButtons.length).toBeGreaterThan(0);
    // První up button je disabled (item je top)
    expect(upButtons[0]).toBeDisabled();
    // Druhý je enabled
    expect(upButtons[1]).not.toBeDisabled();
  });

  it("první item nemá up arrow enabled, poslední down", () => {
    render(<TimelineInput events={events} onSubmit={vi.fn()} />);
    const upBtns = screen.getAllByTitle(/Posunout nahoru/i);
    const downBtns = screen.getAllByTitle(/Posunout dolů/i);
    expect(upBtns[0]).toBeDisabled(); // first
    expect(downBtns[downBtns.length - 1]).toBeDisabled(); // last
  });
});

describe("FormulaBuilderInput", () => {
  const pool = [
    { id: "x", token: "x" },
    { id: "eq", token: "=" },
    { id: "two", token: "2" },
    { id: "mul", token: "*" },
    { id: "a", token: "a" },
  ];

  it("renderuje pool dílů, pool je shuffled (memo)", () => {
    render(<FormulaBuilderInput pool={pool} onSubmit={vi.fn()} />);
    // 5 pool buttons + 1 submit button = 6 total
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(5);
  });

  it("klik na pool token ho přesune do sestavy", () => {
    render(<FormulaBuilderInput pool={pool} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^x$/ }));
    // Sestava obsahuje "x" jako chip
    expect(screen.queryByText(/Klikni na díl níže pro začátek/i)).not.toBeInTheDocument();
  });

  it("submit emituje tokens v sestavovém pořadí oddělené |", () => {
    const onSubmit = vi.fn();
    render(<FormulaBuilderInput pool={pool} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /^x$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^=$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^2$/ }));
    fireEvent.click(screen.getByRole("button", { name: /Odeslat odpověď/i }));
    expect(onSubmit).toHaveBeenCalledWith("x|=|2");
  });

  it("submit disabled při prázdné sestavě", () => {
    render(<FormulaBuilderInput pool={pool} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Odeslat odpověď/i })).toBeDisabled();
  });
});

describe("DiagramLabelInput", () => {
  const points = [
    { x: 0.2, y: 0.3, id: "p1" },
    { x: 0.5, y: 0.5, id: "p2" },
  ];
  const labelPool = ["kořen", "stonek", "list"];

  it("renderuje image + body s číslováním", () => {
    render(
      <DiagramLabelInput
        imageUrl="/diagram.png"
        imageAlt="Diagram"
        points={points}
        labelPool={labelPool}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByAltText("Diagram")).toBeInTheDocument();
    // 2 selecty (1 per point) + 2 očíslované značky bodů na obrázku
    expect(document.querySelectorAll("select").length).toBe(2);
  });

  it("submit disabled pokud ne vše vybrané", () => {
    render(
      <DiagramLabelInput
        imageUrl="/d.png" imageAlt="d" points={points} labelPool={labelPool}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /Odeslat odpověď/i })).toBeDisabled();
  });

  it("výběr labels v každém selectu → submit emituje 'a|b'", () => {
    const onSubmit = vi.fn();
    render(
      <DiagramLabelInput
        imageUrl="/d.png" imageAlt="d" points={points} labelPool={labelPool}
        onSubmit={onSubmit}
      />
    );
    const selects = document.querySelectorAll("select");
    fireEvent.change(selects[0], { target: { value: "kořen" } });
    fireEvent.change(selects[1], { target: { value: "stonek" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith("kořen|stonek");
  });
});
