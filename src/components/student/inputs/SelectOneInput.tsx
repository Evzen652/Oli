import { useState, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  options?: string[];
  isComparison?: boolean;
}

export function SelectOneInput({ task, onSubmit, disabled, options, isComparison }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const items = options ?? task.options ?? [];

  useEffect(() => {
    setSelected(null);
  }, [task.question]);

  const handleSelect = (option: string) => {
    if (disabled) return;
    setSelected(option);
    // Auto-submit on selection
    onSubmit(option);
  };

  const gridCols = isComparison
    ? 'grid-cols-3'
    : items.length <= 4
    ? 'grid-cols-2'
    : 'grid-cols-3';

  return (
    <div className={cn('grid gap-3', gridCols)}>
      {items.map((option) => (
        <Button
          key={option}
          variant={selected === option ? 'default' : 'outline'}
          size={isComparison ? 'xl' : 'lg'}
          onClick={() => handleSelect(option)}
          disabled={disabled}
          className={cn(
            'whitespace-normal h-auto min-h-12 py-3',
            isComparison && 'text-3xl'
          )}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
