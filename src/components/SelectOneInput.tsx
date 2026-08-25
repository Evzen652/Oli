import { Button } from "@/components/ui/button";

interface SelectOneInputProps {
  options: string[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function SelectOneInput({ options, onSubmit, disabled }: SelectOneInputProps) {
  if (!options || options.length === 0) return null;

  const maxLen = Math.max(...options.map(o => o.length));
  const isLong = maxLen > 20;
  // Delší odpověď = menší písmo, ať se vejde bez zalomení do nečitelna.
  const textSize = maxLen > 20 ? "text-base" : maxLen > 10 ? "text-lg" : "text-2xl";

  const gridCols = isLong
    ? "grid-cols-1"
    : options.length <= 2 ? "grid-cols-2" : options.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="space-y-4">
      <p className="text-base font-bold text-foreground">Vyber správnou odpověď.</p>
      <div className={`grid gap-4 ${gridCols}`}>
        {options.map((option) => (
          // `variant="answer"` nese bílou kartu, 56px cíl dotyku, e1 stín
          // i jednotný hover pohyb. Dřív tu byl čtyřprvkový `colors` seznam
          // se čtyřmi IDENTICKÝMI třídami a `hover:scale-105` (design systém
          // povoluje jediný hover pohyb — zvednutí o 1px).
          <Button
            key={option}
            variant="answer"
            disabled={disabled}
            onClick={() => onSubmit(option)}
            className={textSize}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
