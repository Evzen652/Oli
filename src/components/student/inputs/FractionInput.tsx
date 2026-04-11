import { useState, useRef, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function FractionInput({ task, onSubmit, disabled }: Props) {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const numRef = useRef<HTMLInputElement>(null);

  const isWholeNumber = !task.correctAnswer.includes('/');

  useEffect(() => {
    numRef.current?.focus();
    setNumerator('');
    setDenominator('');
  }, [task.question]);

  const handleSubmit = () => {
    if (disabled) return;
    if (isWholeNumber && numerator.trim()) {
      onSubmit(numerator.trim());
    } else if (numerator.trim() && denominator.trim()) {
      onSubmit(`${numerator.trim()}/${denominator.trim()}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <Input
          ref={numRef}
          type="number"
          value={numerator}
          onChange={(e) => setNumerator(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={disabled}
          className="text-center text-xl w-20 h-12"
          placeholder="?"
        />
        {!isWholeNumber && (
          <>
            <span className="text-3xl font-light text-muted-foreground">/</span>
            <Input
              type="number"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={disabled}
              className="text-center text-xl w-20 h-12"
              placeholder="?"
            />
          </>
        )}
      </div>
      <Button onClick={handleSubmit} disabled={disabled || !numerator.trim()} className="w-full" size="lg">
        Odeslat
      </Button>
    </div>
  );
}
