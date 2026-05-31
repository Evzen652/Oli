interface SelectOneInputProps {
  options: string[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * Multiple-choice odpovědi jako velké pastelové karty (2×2 grid).
 * Design sjednocený s landing — bílé karty s pastel akcentem, soft shadow, hover scale.
 */
export function SelectOneInput({ options, onSubmit, disabled }: SelectOneInputProps) {
  if (!options || options.length === 0) return null;

  const maxLen = Math.max(...options.map(o => o.length));
  const isLong = maxLen > 20;
  const textSize = maxLen > 20 ? "text-base" : maxLen > 10 ? "text-xl" : "text-3xl";

  // Pastelové akcenty per pozici — odpovídají mockupu
  const palettes = [
    { border: "border-violet-200", text: "text-violet-700", hover: "hover:border-violet-300 hover:bg-violet-50" },
    { border: "border-emerald-200", text: "text-emerald-700", hover: "hover:border-emerald-300 hover:bg-emerald-50" },
    { border: "border-orange-200", text: "text-orange-700", hover: "hover:border-orange-300 hover:bg-orange-50" },
    { border: "border-sky-200", text: "text-sky-700", hover: "hover:border-sky-300 hover:bg-sky-50" },
  ];

  const gridCols = isLong
    ? "grid-cols-1"
    : options.length <= 2 ? "grid-cols-2" : options.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Vyber správnou odpověď.</p>
      <div className={`grid gap-4 ${gridCols}`}>
        {options.map((option, i) => {
          const p = palettes[i % palettes.length];
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onSubmit(option)}
              className={`
                min-h-[80px] rounded-2xl border-2 bg-white
                ${p.border} ${p.text} ${p.hover}
                ${textSize} font-bold text-center
                px-6 py-5 leading-tight whitespace-normal
                shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
