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
    "bg-blue-200 border-blue-400 text-blue-900 shadow-md shadow-blue-200/60 hover:bg-blue-300 hover:border-blue-500 hover:shadow-lg active:bg-blue-400",
    "bg-fuchsia-200 border-fuchsia-400 text-fuchsia-900 shadow-md shadow-fuchsia-200/60 hover:bg-fuchsia-300 hover:border-fuchsia-500 hover:shadow-lg active:bg-fuchsia-400",
    "bg-emerald-200 border-emerald-400 text-emerald-900 shadow-md shadow-emerald-200/60 hover:bg-emerald-300 hover:border-emerald-500 hover:shadow-lg active:bg-emerald-400",
    "bg-amber-200 border-amber-400 text-amber-900 shadow-md shadow-amber-200/60 hover:bg-amber-300 hover:border-amber-500 hover:shadow-lg active:bg-amber-400",
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
