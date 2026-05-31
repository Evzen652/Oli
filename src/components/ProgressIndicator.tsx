interface ProgressIndicatorProps {
  current: number;
  total: number;
  results?: ("correct" | "wrong" | "help")[];
  /** Pokud true, renderuje kompaktní inline verzi pro hlavičku (jen bar + počty). */
  compact?: boolean;
}

/**
 * Progress indikátor — buď kompaktní lineární bar do hlavičky (compact)
 * nebo plný se segmenty + legendou (footer). Sjednocený design s landing.
 */
export function ProgressIndicator({ current, total, results = [], compact = false }: ProgressIndicatorProps) {
  const safeCurrent = Math.max(0, Math.min(current, total));
  const displayedTask = Math.min(safeCurrent + 1, total);
  const pct = total > 0 ? (safeCurrent / total) * 100 : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-2.5 rounded-full bg-violet-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-slate-700 tabular-nums whitespace-nowrap">
          {displayedTask} / {total}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 rounded-full bg-violet-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-700 tabular-nums whitespace-nowrap">
          {displayedTask} / {total}
        </span>
      </div>
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {Array.from({ length: total }).map((_, i) => {
          const result = results[i];
          const isCurrent = i === current;
          let cls = "h-2.5 w-7 rounded-full transition-all duration-300 ";
          if (result === "correct") cls += "bg-emerald-400";
          else if (result === "wrong") cls += "bg-orange-300";
          else if (result === "help") cls += "bg-sky-300";
          else if (isCurrent) cls += "bg-violet-400 ring-2 ring-violet-200 ring-offset-1";
          else cls += "bg-slate-200";
          return <div key={i} className={cls} />;
        })}
      </div>
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> správně</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-300" /> s nápovědou</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-300" /> zkus znovu</span>
        </div>
      )}
    </div>
  );
}
