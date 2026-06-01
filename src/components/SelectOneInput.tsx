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

  // Pastelové akcenty viditelné hned — bez nutnosti hoveru
  const colors = [
    "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 active:bg-blue-200",
    "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 active:bg-purple-200",
    "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 active:bg-green-200",
    "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 active:bg-amber-200",
  ];

  const gridCols = isLong
    ? "grid-cols-1"
    : options.length <= 2 ? "grid-cols-2" : options.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Vyber správnou odpověď.</p>
      <div className={`grid gap-4 ${gridCols}`}>
        {options.map((option, i) => (
          <Button
            key={option}
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => onSubmit(option)}
            className={`${textSize} font-bold py-4 min-h-[64px] h-auto border-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md whitespace-normal text-center ${colors[i % colors.length]}`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
