import { useState, useRef, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function NumberInput({ task: _task, onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setValue('');
  }, [_task.question]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="space-y-3">
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={disabled}
        className="text-center text-2xl h-14"
        placeholder="?"
      />
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <Button key={n} variant="outline" size="lg" onClick={() => setValue((v) => v + n)} disabled={disabled}>
            {n}
          </Button>
        ))}
        <Button variant="outline" size="lg" onClick={() => setValue((v) => v + '-')} disabled={disabled}>-</Button>
        <Button variant="outline" size="lg" onClick={() => setValue((v) => v + '0')} disabled={disabled}>0</Button>
        <Button variant="outline" size="lg" onClick={() => setValue((v) => v.slice(0, -1))} disabled={disabled}>←</Button>
      </div>
      <Button onClick={handleSubmit} disabled={disabled || !value.trim()} className="w-full" size="lg">
        Odeslat
      </Button>
    </div>
  );
}
