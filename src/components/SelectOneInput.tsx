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
  const textSize = maxLen > 20 ? "text-base" : maxLen > 10 ? "text-lg" : "text-2xl";

  const colors = [
    "bg-white border-stone-300 text-stone-800 shadow-md hover:bg-stone-50 hover:border-stone-400 hover:shadow-lg active:bg-stone-100",
    "bg-white border-stone-300 text-stone-800 shadow-md hover:bg-stone-50 hover:border-stone-400 hover:shadow-lg active:bg-stone-100",
    "bg-white border-stone-300 text-stone-800 shadow-md hover:bg-stone-50 hover:border-stone-400 hover:shadow-lg active:bg-stone-100",
    "bg-white border-stone-300 text-stone-800 shadow-md hover:bg-stone-50 hover:border-stone-400 hover:shadow-lg active:bg-stone-100",
  ];

  const gridCols = isLong
    ? "grid-cols-1"
    : options.length <= 2 ? "grid-cols-2" : options.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="space-y-4">
      <p className="text-base font-bold text-foreground">Vyber správnou odpověď.</p>
      <div className={`grid gap-4 ${gridCols}`}>
        {options.map((option, i) => (
          <Button
            key={option}
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => onSubmit(option)}
            className={`${textSize} font-bold py-4 min-h-[64px] h-auto border-2 rounded-xl shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md whitespace-normal text-center ${colors[i % colors.length]}`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
