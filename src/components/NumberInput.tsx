import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface NumberInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function NumberInput({ onSubmit, disabled }: NumberInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }, [value, onSubmit]);

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Zadej výsledek.</p>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Tvoje odpověď"
        disabled={disabled}
        autoFocus
        className="w-full h-16 text-center text-3xl font-bold rounded-md border-2 border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      <Button onClick={handleSubmit} disabled={disabled || !value.trim()} className="w-full text-lg h-12">
        Odeslat odpověď
      </Button>
    </div>
  );
}
