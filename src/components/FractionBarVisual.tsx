import type { FractionBarData } from "@/lib/types";

interface FractionBarProps {
  data: FractionBarData;
  color: string; // tailwind bg class e.g. "bg-primary"
}

function FractionBar({ data, color }: FractionBarProps) {
  const segments = Array.from({ length: data.denominator }, (_, i) => i < data.numerator);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-sm font-bold text-foreground">{data.fraction}</span>
      <div className="flex gap-1">
        {segments.map((filled, i) => (
          <div
            key={i}
            className={`h-9 w-7 rounded-sm border-2 ${
              filled ? `${color} border-foreground/20` : "bg-muted border-muted-foreground/40"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {data.numerator} z {data.denominator}
      </span>
    </div>
  );
}

const BAR_COLORS = [
  "bg-primary",
  "bg-destructive/70",
  "bg-accent-foreground/60",
  "bg-primary/60",
];

interface FractionBarVisualProps {
  bars: FractionBarData[];
  conclusion?: string;
}

export function FractionBarVisual({ bars, conclusion }: FractionBarVisualProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-center gap-6 flex-wrap">
        {bars.map((bar, i) => (
          <FractionBar key={i} data={bar} color={BAR_COLORS[i % BAR_COLORS.length]} />
        ))}
      </div>
      {conclusion && (
        <p className="text-center text-base font-bold text-primary">{conclusion}</p>
      )}
    </div>
  );
}
