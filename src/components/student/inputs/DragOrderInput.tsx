import { useState, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function DragOrderInput({ task, onSubmit, disabled }: Props) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle items initially
    const shuffled = [...(task.items ?? [])].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [task.question, task.items]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-2 bg-card border rounded-lg p-3">
            <span className="text-muted-foreground text-sm w-6">{index + 1}.</span>
            <span className="flex-1 font-medium">{item}</span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveUp(index)}
                disabled={disabled || index === 0}
                className={cn('text-xs px-2 py-1 rounded hover:bg-muted', index === 0 && 'opacity-30')}
              >
                ↑
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={disabled || index === items.length - 1}
                className={cn('text-xs px-2 py-1 rounded hover:bg-muted', index === items.length - 1 && 'opacity-30')}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={() => onSubmit(items.join(','))} disabled={disabled} className="w-full" size="lg">
        Odeslat
      </Button>
    </div>
  );
}
