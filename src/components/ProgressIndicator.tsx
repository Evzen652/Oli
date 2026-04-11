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
          let dotClass = "rounded-full transition-all duration-300 flex items-center justify-center text-sm ";
          let emoji = "";

          if (result === "correct") {
            dotClass += "w-7 h-7 bg-green-500";
            emoji = "😊";
          } else if (result === "wrong") {
            dotClass += "w-7 h-7 bg-orange-400";
            emoji = "😕";
          } else if (result === "help") {
            dotClass += "w-7 h-7 bg-blue-400";
            emoji = "🤔";
          } else if (isCurrent) {
            dotClass += "w-8 h-8 bg-primary/20 ring-2 ring-primary/50 scale-110";
            emoji = "✏️";
          } else {
            dotClass += "w-7 h-7 bg-muted-foreground/20";
          }

          return <div key={i} className={dotClass}>{emoji}</div>;
        })}
      </div>
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 bg-green-100 text-green-800 rounded-full px-2 py-0.5">😊 správně</span>
          <span className="flex items-center gap-1 bg-orange-100 text-orange-800 rounded-full px-2 py-0.5">😕 zkus to příště</span>
          <span className="flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">🤔 s nápovědou</span>
        </div>
      )}
    </div>
  );
}
