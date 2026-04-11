import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface FractionInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function FractionInput({ onSubmit, disabled }: FractionInputProps) {
  const [numerator, setNumerator] = useState("");
  const [denominator, setDenominator] = useState("");
  const denRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const num = numerator.trim();
    const den = denominator.trim();
    if (!num || !den) return;
    onSubmit(`${num}/${den}`);
    setNumerator("");
    setDenominator("");
  }, [numerator, denominator, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Zadej zlomek (čitatel / jmenovatel).</p>
      <div className="flex items-center justify-center gap-3">
        <input
          type="number"
          inputMode="numeric"
          value={numerator}
          onChange={(e) => setNumerator(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "/" || e.key === "Tab") {
              e.preventDefault();
              denRef.current?.focus();
            }
            handleKeyDown(e);
          }}
          placeholder="čitatel"
          disabled={disabled}
          autoFocus
          className="w-28 h-16 text-center text-2xl font-bold border-b-2 border-primary bg-transparent outline-none focus:border-primary/80 text-foreground placeholder:text-base placeholder:font-normal"
        />
        <span className="text-4xl font-light text-muted-foreground">/</span>
        <input
          ref={denRef}
          type="number"
          inputMode="numeric"
          value={denominator}
          onChange={(e) => setDenominator(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="jmenovatel"
          disabled={disabled}
          className="w-28 h-16 text-center text-2xl font-bold border-b-2 border-primary bg-transparent outline-none focus:border-primary/80 text-foreground placeholder:text-base placeholder:font-normal"
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={disabled || !numerator.trim() || !denominator.trim()}
        className="w-full text-lg h-12"
      >
        Odeslat odpověď
      </Button>
    </div>
  );
}
