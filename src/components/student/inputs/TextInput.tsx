import { useState, useRef, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Button } from '@/components/ui/button';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function TextInput({ task: _task, onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
    setValue('');
  }, [_task.question]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={disabled}
        className="w-full min-h-24 p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Napis svou odpoved..."
      />
      <Button onClick={handleSubmit} disabled={disabled || !value.trim()} className="w-full" size="lg">
        Odeslat
      </Button>
    </div>
  );
}
