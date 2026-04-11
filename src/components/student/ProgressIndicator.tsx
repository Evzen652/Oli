import type { TaskResult } from '@/lib/engine/types';
import { cn } from '@/lib/utils/cn';

interface Props {
  total: number;
  current: number;
  results: TaskResult[];
}

export function ProgressIndicator({ total, current, results }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const result = results[i];
          let dotClass = 'bg-muted';
          if (result) {
            if (result.status === 'correct') dotClass = 'bg-success';
            else if (result.status === 'help') dotClass = 'bg-warning';
            else dotClass = 'bg-error';
          } else if (i === current) {
            dotClass = 'bg-primary animate-pulse';
          }
          return (
            <div key={i} className={cn('w-3 h-3 rounded-full transition-colors', dotClass)} />
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground ml-2">
        {Math.min(current + 1, total)}/{total} uloh
      </span>
    </div>
  );
}
