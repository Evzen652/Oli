import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { NumberInput } from "@/components/NumberInput";
import { FractionInput } from "@/components/FractionInput";
import { SelectOneInput } from "@/components/SelectOneInput";
import { FillBlankInput } from "@/components/FillBlankInput";
import { MultiSelectInput } from "@/components/MultiSelectInput";
import { ImageSelectInput } from "@/components/ImageSelectInput";
import { ProgressIndicator } from "@/components/ProgressIndicator";

expect.extend(toHaveNoViolations);

/**
 * Accessibility smoke tests (jest-axe).
 *
 * Pro děti se SVP (zrak, jemná motorika, screen reader) je a11y kritická.
 * Tento test pokrývá hlavní žákovské vstupy — hledá WCAG 2.1 AA porušení.
 *
 * Pokrývá:
 *  - aria-label / role atributy chybí
 *  - kontrast textu s pozadím (NEPOKRÝVÁ — jest-axe nemá render kontextu,
 *    musí se ověřit screenshot testem)
 *  - keyboard focus chains (chybějící tabindex)
 *  - duplicate IDs
 *  - form bez label
 *  - obrázek bez alt
 *  - button bez accessible name
 *
 * Test je shovívavý — některé pravidla (color-contrast, region) jsou
 * disabled, protože jdou jen v reálném prohlížeči s CSS, ne v jsdom.
 */

const a11yOptions = {
  rules: {
    // jsdom nemá CSS rendering — color contrast nelze otestovat
    "color-contrast": { enabled: false },
    // Komponenty se renderují izolovaně, ne ve full page — region check off
    region: { enabled: false },
  },
};

beforeEach(() => {
  cleanup();
});

describe("A11y — žákovské input komponenty", () => {
  it("NumberInput — žádné violations", async () => {
    const { container } = render(<NumberInput onSubmit={() => {}} />);
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });

  it("FractionInput — žádné violations", async () => {
    const { container } = render(<FractionInput onSubmit={() => {}} />);
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });

  it("SelectOneInput — žádné violations", async () => {
    const { container } = render(
      <SelectOneInput options={["A", "B", "C"]} onSubmit={() => {}} />,
    );
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });

  it("FillBlankInput — žádné violations", async () => {
    const { container } = render(
      <FillBlankInput
        question="Doplň: ___ je vlastní jméno."
        blanks={["x"]}
        onSubmit={() => {}}
        disabled={false}
      />,
    );
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });

  it("MultiSelectInput — žádné violations", async () => {
    const { container } = render(
      <MultiSelectInput options={["A", "B"]} onSubmit={() => {}} disabled={false} />,
    );
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });

  it("ImageSelectInput — alt texty na obrázcích, žádné violations", async () => {
    const imageOptions = [
      { url: "/img1.png", alt: "Obrázek slunce", id: "1" },
      { url: "/img2.png", alt: "Obrázek měsíce", id: "2" },
    ];
    const { container } = render(
      <ImageSelectInput imageOptions={imageOptions} onSubmit={() => {}} />,
    );
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });
});

describe("A11y — informativní komponenty", () => {
  it("ProgressIndicator — žádné violations", async () => {
    const { container } = render(<ProgressIndicator current={2} total={6} />);
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });

  it("ProgressIndicator s results emoji — žádné violations", async () => {
    const { container } = render(
      <ProgressIndicator current={3} total={6} results={["correct", "wrong", "help"]} />,
    );
    const results = await axe(container, a11yOptions);
    expect(results).toHaveNoViolations();
  });
});

describe("A11y — manuální checks (dokumentace specifických invariants)", () => {
  it("ImageSelectInput: každý obrázek má neprázdný alt text", () => {
    const imageOptions = [
      { url: "/x.png", alt: "Popis obrázku 1", id: "1" },
      { url: "/y.png", alt: "Popis obrázku 2", id: "2" },
    ];
    const { container } = render(
      <ImageSelectInput imageOptions={imageOptions} onSubmit={() => {}} />,
    );
    const imgs = container.querySelectorAll("img");
    imgs.forEach((img) => {
      expect(img.getAttribute("alt")).toBeTruthy();
      expect(img.getAttribute("alt")?.trim().length ?? 0).toBeGreaterThan(0);
    });
  });

  it("ImageSelectInput: každé tlačítko má aria-label (jinak screen reader nezná smysl)", () => {
    const imageOptions = [
      { url: "/x.png", alt: "Popis obrázku 1", id: "1" },
    ];
    const { container } = render(
      <ImageSelectInput imageOptions={imageOptions} onSubmit={() => {}} />,
    );
    const btn = container.querySelector("button");
    expect(btn?.getAttribute("aria-label")).toBeTruthy();
  });

  it("NumberInput: input má numeric inputMode pro mobile keyboard", () => {
    const { container } = render(<NumberInput onSubmit={() => {}} />);
    const input = container.querySelector("input");
    expect(input?.getAttribute("inputmode")).toBe("numeric");
    // autoFocus je React prop → DOM property focus, ne HTML attribute v jsdom
    expect(input?.type).toBe("number");
  });

  it("FractionInput: oba inputy mají numeric inputMode", () => {
    const { container } = render(<FractionInput onSubmit={() => {}} />);
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBe(2);
    inputs.forEach((i) => expect(i.getAttribute("inputmode")).toBe("numeric"));
  });

  it("Tlačítka v SelectOne mají accessible name (text content)", () => {
    const { container } = render(
      <SelectOneInput options={["jablko", "hruška"]} onSubmit={() => {}} />,
    );
    const buttons = container.querySelectorAll("button");
    buttons.forEach((b) => {
      expect(b.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    });
  });

  it("Disabled state je správně vyjádřený přes attribute, ne jen CSS", () => {
    const { container } = render(<NumberInput onSubmit={() => {}} disabled />);
    const input = container.querySelector("input");
    const button = container.querySelector("button");
    expect(input?.hasAttribute("disabled")).toBe(true);
    expect(button?.hasAttribute("disabled")).toBe(true);
  });
});

describe("A11y — keyboard accessibility", () => {
  it("NumberInput: Enter key v inputu odešle (testováno v input-components.test.tsx, tady jen sanity)", () => {
    const { container } = render(<NumberInput onSubmit={() => {}} />);
    const input = container.querySelector("input");
    // input by neměl mít tabindex=-1 (musí být v tab orderu)
    const tabIndex = input?.getAttribute("tabindex");
    if (tabIndex !== null) {
      expect(parseInt(tabIndex ?? "0")).toBeGreaterThanOrEqual(0);
    }
  });

  it("Tlačítka NEMAJÍ tabindex=-1 (musí být dostupná z klávesnice)", () => {
    const { container } = render(
      <SelectOneInput options={["A", "B"]} onSubmit={() => {}} />,
    );
    const buttons = container.querySelectorAll("button");
    buttons.forEach((b) => {
      const ti = b.getAttribute("tabindex");
      if (ti !== null) {
        expect(parseInt(ti)).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
