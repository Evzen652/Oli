import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface Props {
  startTime: number;
  maxSeconds: number;
  countUp?: boolean;
  onTimeExpired: () => void;
}

export function SessionTimer({ startTime, maxSeconds, countUp = false, onTimeExpired }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const expiredRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(secs);

      if (secs >= maxSeconds && !expiredRef.current) {
        expiredRef.current = true;
        onTimeExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, maxSeconds, onTimeExpired]);

  const displaySeconds = countUp ? elapsed : Math.max(0, maxSeconds - elapsed);
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;
  const isWarning = !countUp && displaySeconds <= 60;

  return (
    <span className={cn(
      'font-mono text-sm tabular-nums',
      isWarning && 'text-destructive font-bold animate-pulse'
    )}>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}
