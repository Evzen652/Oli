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
          // `variant="answer"` = stejná bílá karta jako u výběru jedné odpovědi
          // (dřív to bylo syrové <button> mimo design systém, s vlastním
          // rádiusem i stínem). Vybraný stav přebíjí jen barvu, ne tvar.
          <Button
            key={option}
            variant="answer"
            onClick={() => toggle(option)}
            disabled={disabled}
            className={cn(
              "justify-start text-left text-base font-medium",
              selected.has(option) && "border-primary bg-accent ring-2 ring-primary/30",
            )}
          >
            <span className="flex items-center gap-3">
              <span className={cn(
                "w-5 h-5 rounded-sm border-2 flex items-center justify-center text-caption transition-colors",
                selected.has(option)
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground"
              )}>
                {selected.has(option) && "✓"}
              </span>
              {option}
            </span>
          </Button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={selected.size === 0 || disabled} size="child" className="w-full">
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
