import { useEffect, useState } from "react";

interface SessionTimerProps {
  startTime: number;
  maxSeconds: number;
  isActive: boolean;
  onTimeExpired: () => void;
  countUp?: boolean;
}

export function SessionTimer({ startTime, maxSeconds, isActive, onTimeExpired, countUp }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const now = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(now);
      if (!countUp && now >= maxSeconds) {
        onTimeExpired();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, maxSeconds, isActive, onTimeExpired, countUp]);

  if (countUp) {
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>⏱</span>
        <span className="text-base font-mono tabular-nums font-semibold text-muted-foreground">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
    );
  }

  const remaining = Math.max(0, maxSeconds - elapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const pct = Math.max(0, (remaining / maxSeconds) * 100);
  const isLow = remaining < 60;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg" aria-hidden>⏱</span>
      <div className="h-3 flex-1 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? "bg-destructive" : "bg-primary/70"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-base font-mono tabular-nums font-semibold ${isLow ? "text-destructive" : "text-muted-foreground"}`}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
