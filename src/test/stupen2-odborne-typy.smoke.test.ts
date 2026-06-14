/**
 * SMOKE TEST — odborné typy cvičení pro 2. stupeň (6.–9. ročník).
 *
 * Účel: ověřit end-to-end, že odborné typy (fyzika/chemie/dějepis/přírodopis)
 * fungují přes validační vrstvu, a ZAFIXOVAT správné formáty `correctAnswer`,
 * které grade-N session musí použít. Komponenty existují (PracticeInputRouter),
 * validátory existují — chybělo ověření, JAK je správně propojit.
 *
 * Klíčový poznatek (Fáze 0, 2026-06-15):
 * `resolveTaskValidation` NEpřevádí chemEquation/timelineEvents/formulaPool/diagram
 * na `expected`. Autor MUSÍ ručně nastavit:
 *   (a) strukturované pole pro UI (chemEquation.tokens, …),
 *   (b) `correctAnswer` v PŘESNÉM pipe-formátu, který validátor čeká,
 *   (c) `inputType` (vybírá validátor přes getDefaultValidator).
 */
import { describe, it, expect } from "vitest";
import { validateAnswer, resolveTaskValidation } from "@/lib/validators";

const ok = (answer: string, expected: string, inputType: string) =>
  validateAnswer(answer, expected, { inputType }).correct;

describe("2. stupeň — odborné typy: validační vrstva funguje", () => {
  it("number (numeric_tolerance) — fyzika výpočet", () => {
    // hustota = 240 g / 30 cm³ = 8 g/cm³
    expect(ok("8", "8", "number")).toBe(true);
    expect(ok("8,0", "8", "number")).toBe(true); // čárka i tečka
    expect(ok("80", "8", "number")).toBe(false); // chyba v řádu
  });

  it("numeric_range — fyzika/chemie s tolerancí nebo rozsahem", () => {
    expect(ok("9.78", "9.81±0.1", "numeric_range")).toBe(true); // tíhové zrychlení
    expect(ok("9.2", "9.81±0.1", "numeric_range")).toBe(false);
    expect(ok("5.5", "5..6", "numeric_range")).toBe(true); // rozsah
    expect(ok("6.4", "5..6", "numeric_range")).toBe(false);
  });

  it("chemical_balance — SPRÁVNÝ formát = páry koef|vzorec BEZ operátorů", () => {
    // 2 H2 + O2 -> 2 H2O. Koeficienty: 2, 1, 2.
    // expected = "koef|vzorec|koef|vzorec|…" (operátory +/= se NEuvádějí!)
    const expected = "2|H2|1|O2|2|H2O";
    expect(ok("2|1|2", expected, "chemical_balance")).toBe(true); // žák doplnil 3 koeficienty
    expect(ok("2|2|2", expected, "chemical_balance")).toBe(false); // špatný 2. koef
    // implicitní "1" lze zapsat prázdné/0 (chemici 1 vynechávají)
    expect(ok("2||2", expected, "chemical_balance")).toBe(true);
  });

  it("chemical_balance — POZOR: formát s operátory (z matoucího komentáře) NEFUNGUJE", () => {
    // Komentář u validátoru ukazuje "2|H2|+|1|O2|=|2|H2O" — ale i+=2 by bral
    // koeficienty z pozic [2, +, O2, 2] → past. Tímto testem to fixujeme jako
    // ZAKÁZANÝ formát, ať ho grade-N session nepoužije.
    const wrongFormat = "2|H2|+|1|O2|=|2|H2O";
    // žák doplní reálné koeficienty 2,1,2 → s tímto expected to nikdy nesedne
    expect(ok("2|1|2", wrongFormat, "chemical_balance")).toBe(false);
  });

  it("formula_builder — fyzika/matematika sestavení vzorce", () => {
    // hustota: ρ = m / V
    const expected = "ρ|=|m|/|V";
    expect(ok("ρ|=|m|/|V", expected, "formula_builder")).toBe(true);
    expect(ok("ρ|=|V|/|m", expected, "formula_builder")).toBe(false); // prohozené
  });

  it("timeline — dějepis chronologie (pořadí záleží)", () => {
    const expected = "Pravěk (-3000)|Antika (500)|Středověk (1200)|Novověk (1500)";
    expect(ok(expected, expected, "timeline")).toBe(true);
    const wrong = "Antika (500)|Pravěk (-3000)|Středověk (1200)|Novověk (1500)";
    expect(ok(wrong, expected, "timeline")).toBe(false);
  });

  it("diagram_label — přírodopis/zeměpis popis (toleruje diakritiku/překlep)", () => {
    const expected = "kořen|stonek|list|květ";
    expect(ok("kořen|stonek|list|květ", expected, "diagram_label")).toBe(true);
    expect(ok("koren|stonek|list|kvet", expected, "diagram_label")).toBe(true); // bez diakritiky OK
    expect(ok("stonek|kořen|list|květ", expected, "diagram_label")).toBe(false); // špatné pozice
  });
});

describe("2. stupeň — resolveTaskValidation NEpokrývá odborné strukturované typy", () => {
  it("task s chemEquation spadne na correctAnswer + inputType validátor (nutné ručně)", () => {
    // Dokumentuje past: resolveTaskValidation řeší jen pairs/items/categories/
    // correctAnswers. chemEquation se ignoruje → expected = correctAnswer.
    const task = {
      correctAnswer: "2|H2|1|O2|2|H2O",
      // chemEquation by tu bylo pro UI, ale resolveTaskValidation ho nevidí
    };
    const { expected, validatorId } = resolveTaskValidation(task);
    expect(expected).toBe("2|H2|1|O2|2|H2O"); // = correctAnswer, ne ze struktury
    expect(validatorId).toBeUndefined(); // → orchestrator použije getDefaultValidator(inputType)
  });
});
