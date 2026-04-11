import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MultiSelectInputProps {
  options: string[];
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function MultiSelectInput({ options, onSubmit, disabled }: MultiSelectInputProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (option: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  const handleSubmit = () => {
    const sorted = [...selected].sort();
    onSubmit(JSON.stringify(sorted));
  };

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Vyber všechny správné odpovědi.</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggle(option)}
            disabled={disabled}
            className={cn(
              "p-4 rounded-xl border-2 text-left font-medium transition-all",
              selected.has(option)
                ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                : "border-border bg-card hover:border-primary/50 hover:shadow"
            )}
          >
            <span className="flex items-center gap-3">
              <span className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all",
                selected.has(option)
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground"
              )}>
                {selected.has(option) && "✓"}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={selected.size === 0 || disabled} className="w-full text-lg h-12 rounded-xl">
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
