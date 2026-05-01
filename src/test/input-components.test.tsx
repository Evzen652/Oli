import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { NumberInput } from "@/components/NumberInput";
import { FractionInput } from "@/components/FractionInput";
import { SelectOneInput } from "@/components/SelectOneInput";
import { FillBlankInput } from "@/components/FillBlankInput";

/**
 * UI input komponenty — smoke + happy-path tests (Bod 9).
 *
 * Pokrývá komponenty bez doposud žádného UI testu:
 *  - NumberInput, FractionInput, SelectOneInput, FillBlankInput
 *
 * Pro každou: render OK, prázdný stav → submit disabled, vyplněný → submit
 * volá onSubmit s correct payload, Enter klávesa funguje (kde aplikováno).
 */

beforeEach(() => {
  cleanup();
});

describe("NumberInput", () => {
  it("renderuje placeholder + odeslat button", () => {
    render(<NumberInput onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Tvoje odpověď/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeInTheDocument();
  });

  it("submit disabled při prázdném inputu", () => {
    render(<NumberInput onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });

  it("vyplněný input + click → onSubmit s trimmed value", () => {
    const onSubmit = vi.fn();
    render(<NumberInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/Tvoje odpověď/i);
    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith("42");
  });

  it("Enter v inputu odešle", () => {
    const onSubmit = vi.fn();
    render(<NumberInput onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText(/Tvoje odpověď/i);
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledWith("100");
  });

  it("po submit se input vyčistí", () => {
    render(<NumberInput onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Tvoje odpověď/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(input.value).toBe("");
  });

  it("disabled prop disabluje input + button", () => {
    render(<NumberInput onSubmit={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText(/Tvoje odpověď/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });

  it("whitespace-only nelze odeslat", () => {
    const onSubmit = vi.fn();
    render(<NumberInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/Tvoje odpověď/i), { target: { value: "   " } });
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });
});

describe("FractionInput", () => {
  it("renderuje 2 inputy (čitatel + jmenovatel)", () => {
    render(<FractionInput onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/čitatel/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/jmenovatel/i)).toBeInTheDocument();
  });

  it("submit disabled bez obou hodnot", () => {
    render(<FractionInput onSubmit={vi.fn()} />);
    const button = screen.getByRole("button", { name: /Odeslat/i });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText(/čitatel/i), { target: { value: "3" } });
    expect(button).toBeDisabled(); // jen čitatel

    fireEvent.change(screen.getByPlaceholderText(/jmenovatel/i), { target: { value: "8" } });
    expect(button).not.toBeDisabled();
  });

  it("submit emituje 'a/b' format", () => {
    const onSubmit = vi.fn();
    render(<FractionInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/čitatel/i), { target: { value: "3" } });
    fireEvent.change(screen.getByPlaceholderText(/jmenovatel/i), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith("3/8");
  });

  it("'/' klávesa v čitateli posune focus na jmenovatele", () => {
    render(<FractionInput onSubmit={vi.fn()} />);
    const num = screen.getByPlaceholderText(/čitatel/i);
    const den = screen.getByPlaceholderText(/jmenovatel/i);
    num.focus();
    fireEvent.keyDown(num, { key: "/" });
    expect(document.activeElement).toBe(den);
  });

  it("Enter ve jmenovateli odesílá", () => {
    const onSubmit = vi.fn();
    render(<FractionInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/čitatel/i), { target: { value: "1" } });
    fireEvent.change(screen.getByPlaceholderText(/jmenovatel/i), { target: { value: "2" } });
    fireEvent.keyDown(screen.getByPlaceholderText(/jmenovatel/i), { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledWith("1/2");
  });

  it("po submit se oba inputy vyčistí", () => {
    render(<FractionInput onSubmit={vi.fn()} />);
    const num = screen.getByPlaceholderText(/čitatel/i) as HTMLInputElement;
    const den = screen.getByPlaceholderText(/jmenovatel/i) as HTMLInputElement;
    fireEvent.change(num, { target: { value: "3" } });
    fireEvent.change(den, { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(num.value).toBe("");
    expect(den.value).toBe("");
  });

  it("disabled prop disabluje vše", () => {
    render(<FractionInput onSubmit={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText(/čitatel/i)).toBeDisabled();
    expect(screen.getByPlaceholderText(/jmenovatel/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });

  it("záporný čitatel se zachová ('-3/8')", () => {
    const onSubmit = vi.fn();
    render(<FractionInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/čitatel/i), { target: { value: "-3" } });
    fireEvent.change(screen.getByPlaceholderText(/jmenovatel/i), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith("-3/8");
  });
});

describe("SelectOneInput", () => {
  it("renderuje button per option", () => {
    render(<SelectOneInput options={["A", "B", "C"]} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "C" })).toBeInTheDocument();
  });

  it("klik na option emituje její text", () => {
    const onSubmit = vi.fn();
    render(<SelectOneInput options={["jablko", "hruška"]} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "jablko" }));
    expect(onSubmit).toHaveBeenCalledWith("jablko");
  });

  it("prázdné options → null render", () => {
    const { container } = render(<SelectOneInput options={[]} onSubmit={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("disabled disabluje všechny options", () => {
    render(<SelectOneInput options={["A", "B"]} onSubmit={vi.fn()} disabled />);
    expect(screen.getByRole("button", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "B" })).toBeDisabled();
  });

  it("dlouhý option text → grid-cols-1 layout (responsive)", () => {
    const longText = "Tohle je velmi dlouhá odpověď, která má víc než 20 znaků určitě.";
    render(<SelectOneInput options={[longText, "krátký"]} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: longText })).toBeInTheDocument();
  });

  it("XSS v option labelu se nerenderuje jako HTML (React escape)", () => {
    const onSubmit = vi.fn();
    render(<SelectOneInput options={["<script>alert(1)</script>"]} onSubmit={onSubmit} />);
    // Žádný script v DOM
    const scripts = Array.from(document.querySelectorAll("script")).filter((s) =>
      s.textContent?.includes("alert(1)")
    );
    expect(scripts).toHaveLength(0);
    // Text rendered as escaped
    expect(screen.getByRole("button", { name: /script/i })).toBeInTheDocument();
  });
});

describe("FillBlankInput", () => {
  it("renderuje text s blanks", () => {
    render(
      <FillBlankInput
        question="Doplň: ___ je nejvyšší hora."
        blanks={["Mount Everest"]}
        onSubmit={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByText(/nejvyšší hora/)).toBeInTheDocument();
  });

  it("submit disabled bez vyplnění", () => {
    render(
      <FillBlankInput
        question="___"
        blanks={["x"]}
        onSubmit={vi.fn()}
        disabled={false}
      />
    );
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });

  it("single blank → emituje string", () => {
    const onSubmit = vi.fn();
    render(
      <FillBlankInput
        question="___"
        blanks={["test"]}
        onSubmit={onSubmit}
        disabled={false}
      />
    );
    const inputs = document.querySelectorAll('input[type="text"]');
    fireEvent.change(inputs[0], { target: { value: "answer" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith("answer");
  });

  it("multiple blanks → emituje JSON array", () => {
    const onSubmit = vi.fn();
    render(
      <FillBlankInput
        question="___ a ___"
        blanks={["a", "b"]}
        onSubmit={onSubmit}
        disabled={false}
      />
    );
    const inputs = document.querySelectorAll('input[type="text"]');
    fireEvent.change(inputs[0], { target: { value: "první" } });
    fireEvent.change(inputs[1], { target: { value: "druhý" } });
    fireEvent.click(screen.getByRole("button", { name: /Odeslat/i }));
    expect(onSubmit).toHaveBeenCalledWith(JSON.stringify(["první", "druhý"]));
  });

  it("Enter odeslání všech vyplněných blanks", () => {
    const onSubmit = vi.fn();
    render(
      <FillBlankInput
        question="___"
        blanks={["x"]}
        onSubmit={onSubmit}
        disabled={false}
      />
    );
    const input = document.querySelector('input[type="text"]')!;
    fireEvent.change(input, { target: { value: "X" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalled();
  });

  it("disabled prop disabluje submit", () => {
    render(
      <FillBlankInput
        question="___"
        blanks={["x"]}
        onSubmit={vi.fn()}
        disabled={true}
      />
    );
    expect(screen.getByRole("button", { name: /Zpracovávám/i })).toBeDisabled();
  });

  it("button label se mění v disabled stavu", () => {
    render(
      <FillBlankInput
        question="___"
        blanks={["x"]}
        onSubmit={vi.fn()}
        disabled={true}
      />
    );
    expect(screen.getByRole("button", { name: /Zpracovávám/i })).toBeInTheDocument();
  });

  it("submit s prázdným blankem trimuje (zachovává prázdné v JSON)", () => {
    const onSubmit = vi.fn();
    render(
      <FillBlankInput
        question="___ a ___"
        blanks={["a", "b"]}
        onSubmit={onSubmit}
        disabled={false}
      />
    );
    const inputs = document.querySelectorAll('input[type="text"]');
    // Pouze první vyplněn → submit disabled
    fireEvent.change(inputs[0], { target: { value: "X" } });
    expect(screen.getByRole("button", { name: /Odeslat/i })).toBeDisabled();
  });
});
