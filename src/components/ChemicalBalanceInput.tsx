import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Token {
  value: string;
  isCoefficient: boolean;
}

interface Props {
  tokens: Token[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * ChemicalBalance — žák doplňuje stechiometrické koeficienty.
 *
 * Layout: chemická rovnice na velké řádce, koeficienty jako malé inputy
 * vedle vzorců. Submit posílá jen koeficienty oddělené | v pořadí.
 *
 * Příklad:
 *   tokens = [
 *     { value: "?", isCoefficient: true },
 *     { value: "H2", isCoefficient: false },
 *     { value: "+", isCoefficient: false },
 *     { value: "?", isCoefficient: true },
 *     { value: "O2", isCoefficient: false },
 *     { value: "=", isCoefficient: false },
 *     { value: "?", isCoefficient: true },
 *     { value: "H2O", isCoefficient: false },
 *   ]
 */
export function ChemicalBalanceInput({ tokens, onSubmit, disabled }: Props) {
  // Pro každý coefficient token držíme aktuální hodnotu inputu
  const coefIndices = tokens
    .map((t, i) => (t.isCoefficient ? i : -1))
    .filter((i) => i !== -1);
  const [coefValues, setCoefValues] = useState<Record<number, string>>(
    () => Object.fromEntries(coefIndices.map((i) => [i, ""]))
  );

  const allFilled = coefIndices.every((i) => (coefValues[i] ?? "").trim() !== "");

  const handleSubmit = () => {
    const answer = coefIndices.map((i) => coefValues[i].trim()).join("|");
    onSubmit(answer);
  };

  // Render H2 → H<sub>2</sub> a podobně (jednoduchá heuristika: čísla po písmenech)
  const renderFormula = (val: string) => {
    const parts = val.match(/([A-Z][a-z]?|\d+)/g);
    if (!parts) return val;
    return parts.map((p, i) =>
      /^\d+$/.test(p) ? (
        <sub key={i}>{p}</sub>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  return (
    <div className="space-y-5">
      <p className="text-base text-muted-foreground">
        Doplň koeficienty tak, aby na obou stranách rovnice byl stejný počet atomů každého prvku.
      </p>

      {/* Equation row */}
      <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6 shadow-soft-1">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-display text-2xl sm:text-3xl text-foreground">
          {tokens.map((tok, i) => {
            if (tok.isCoefficient) {
              return (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={coefValues[i] ?? ""}
                  onChange={(e) =>
                    setCoefValues((prev) => ({ ...prev, [i]: e.target.value.replace(/\D/g, "") }))
                  }
                  disabled={disabled}
                  className="w-12 h-11 text-center font-bold rounded-lg border-2 border-primary/40 bg-primary/5 text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                  aria-label={`Koeficient ${i}`}
                />
              );
            }
            // Operator nebo vzorec
            const isOp = ["+", "-", "=", "→"].includes(tok.value);
            return (
              <span
                key={i}
                className={isOp ? "text-muted-foreground px-1" : "font-bold"}
              >
                {isOp ? tok.value : renderFormula(tok.value)}
              </span>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!allFilled || disabled}
        className="w-full text-lg h-12 rounded-xl"
      >
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
