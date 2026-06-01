interface ProgressIndicatorProps {
  current: number;
  total: number;
  results?: ("correct" | "wrong" | "help")[];
}

export function ProgressIndicator({ current, total, results = [] }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">
        Úloha {Math.min(current + 1, total)} z {total}
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {Array.from({ length: total }).map((_, i) => {
          const result = results[i];
          const isCurrent = i === current;
          let dotClass = "rounded-full transition-all duration-300 ";

          if (result === "correct") {
            dotClass += "w-3 h-3 bg-emerald-500";
          } else if (result === "wrong") {
            dotClass += "w-3 h-3 bg-orange-400";
          } else if (result === "help") {
            dotClass += "w-3 h-3 bg-sky-400";
          } else if (isCurrent) {
            dotClass += "w-4 h-4 bg-primary ring-2 ring-primary/30 scale-110";
          } else {
            dotClass += "w-3 h-3 bg-slate-200";
          }

          return <div key={i} className={dotClass} />;
        })}
      </div>
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> správně</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400" /> s nápovědou</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" /> zkus to příště</span>
        </div>
      )}
    </div>
  );
}
