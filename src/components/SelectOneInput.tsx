interface SelectOneInputProps {
  options: string[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * Multiple-choice odpovědi jako velké pastelové karty (2×2 grid).
 * Design sjednocený s landing page — soft shadows, big rounded, hover scale.
 */
export function SelectOneInput({ options, onSubmit, disabled }: SelectOneInputProps) {
  if (!options || options.length === 0) return null;

  const maxLen = Math.max(...options.map(o => o.length));
  const isLong = maxLen > 20;
  const textSize = maxLen > 20 ? "text-base" : maxLen > 10 ? "text-xl" : "text-3xl";

  // Pastelové akcenty per pozici — sjednocené s landing
  const palettes = [
    { border: "border-violet-200", ring: "ring-violet-100", text: "text-violet-700", bg: "hover:bg-violet-50", glow: "hover:shadow-violet-200/60" },
    { border: "border-emerald-200", ring: "ring-emerald-100", text: "text-emerald-700", bg: "hover:bg-emerald-50", glow: "hover:shadow-emerald-200/60" },
    { border: "border-orange-200", ring: "ring-orange-100", text: "text-orange-700", bg: "hover:bg-orange-50", glow: "hover:shadow-orange-200/60" },
    { border: "border-sky-200", ring: "ring-sky-100", text: "text-sky-700", bg: "hover:bg-sky-50", glow: "hover:shadow-sky-200/60" },
  ];

  const gridCols = isLong
    ? "grid-cols-1"
    : options.length <= 2 ? "grid-cols-2" : options.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
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
              group relative min-h-[88px] rounded-2xl border-2 bg-white
              ${p.border} ${p.text} ${p.bg} ${p.glow}
              ring-4 ring-transparent hover:${p.ring}
              ${textSize} font-bold text-center
              px-6 py-5 leading-tight
              shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm
              whitespace-normal
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
