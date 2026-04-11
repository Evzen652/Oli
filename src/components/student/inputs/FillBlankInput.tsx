import { useState, useEffect, useRef } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function FillBlankInput({ task, onSubmit, disabled }: Props) {
  const segments = parseSegments(task.question);
  const blankCount = segments.filter((s) => s.type === 'blank').length;
  const [blanks, setBlanks] = useState<string[]>([]);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBlanks(Array(blankCount).fill(''));
    firstRef.current?.focus();
  }, [task.question, blankCount]);

  const updateBlank = (index: number, value: string) => {
    setBlanks((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = () => {
    if (blanks.some((b) => !b.trim())) return;
    onSubmit(blanks.join(','));
  };

  let blankIndex = 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1 text-lg leading-relaxed">
        {segments.map((seg, i) => {
          if (seg.type === 'text') {
            return <span key={i}>{seg.value}</span>;
          }
          const idx = blankIndex++;
          return (
            <Input
              key={i}
              ref={idx === 0 ? firstRef : undefined}
              value={blanks[idx] ?? ''}
              onChange={(e) => updateBlank(idx, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={disabled}
              className="inline-flex w-20 h-8 text-center text-lg border-b-2 border-primary"
            />
          );
        })}
      </div>
      <Button onClick={handleSubmit} disabled={disabled || blanks.some((b) => !b.trim())} className="w-full" size="lg">
        Odeslat
      </Button>
    </div>
  );
}

interface Segment {
  type: 'text' | 'blank';
  value: string;
}

function parseSegments(question: string): Segment[] {
  const parts = question.split(/(_+)/);
  return parts.map((part) => ({
    type: /^_+$/.test(part) ? 'blank' : 'text',
    value: part,
  }));
}
