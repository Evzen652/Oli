import { useState, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function MultiSelectInput({ task, onSubmit, disabled }: Props) {
  const options = task.options ?? [];
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelected(new Set());
  }, [task.question]);

  const toggle = (option: string) => {
    if (disabled) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Vyber vsechny spravne odpovedi:</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggle(option)}
            disabled={disabled}
            className={cn(
              'p-3 rounded-lg border text-left transition-colors',
              selected.has(option) ? 'border-primary bg-primary/10 font-medium' : 'hover:border-primary/50'
            )}
          >
            <span className="mr-2">{selected.has(option) ? '☑' : '☐'}</span>
            {option}
          </button>
        ))}
      </div>
      <Button
        onClick={() => onSubmit(Array.from(selected).sort().join(','))}
        disabled={disabled || selected.size === 0}
        className="w-full"
        size="lg"
      >
        Odeslat
      </Button>
    </div>
  );
}
