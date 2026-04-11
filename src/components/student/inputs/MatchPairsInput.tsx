import { useState, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function MatchPairsInput({ task, onSubmit, disabled }: Props) {
  const pairs = task.pairs ?? [];
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [shuffledRight, setShuffledRight] = useState<number[]>([]);

  useEffect(() => {
    setSelectedLeft(null);
    setMatches(new Map());
    setShuffledRight(
      pairs.map((_, i) => i).sort(() => Math.random() - 0.5)
    );
  }, [task.question, pairs.length]);

  const handleLeftClick = (index: number) => {
    if (disabled || matches.has(index)) return;
    setSelectedLeft(index);
  };

  const handleRightClick = (rightIndex: number) => {
    if (disabled || selectedLeft === null) return;
    // Check if right is already matched
    const isRightUsed = Array.from(matches.values()).includes(rightIndex);
    if (isRightUsed) return;

    const newMatches = new Map(matches);
    newMatches.set(selectedLeft, rightIndex);
    setMatches(newMatches);
    setSelectedLeft(null);

    // Auto-submit when all paired
    if (newMatches.size === pairs.length) {
      const answer = pairs
        .map((_, i) => `${pairs[i].left}:${pairs[newMatches.get(i)!].right}`)
        .join(',');
      onSubmit(answer);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        {pairs.map((pair, i) => (
          <button
            key={`left-${i}`}
            onClick={() => handleLeftClick(i)}
            disabled={disabled || matches.has(i)}
            className={cn(
              'w-full p-3 rounded-lg border text-left transition-colors',
              selectedLeft === i && 'border-primary bg-primary/10',
              matches.has(i) && 'opacity-50 bg-muted',
              !matches.has(i) && selectedLeft !== i && 'hover:border-primary/50'
            )}
          >
            {pair.left}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {shuffledRight.map((rightIdx) => {
          const isUsed = Array.from(matches.values()).includes(rightIdx);
          return (
            <button
              key={`right-${rightIdx}`}
              onClick={() => handleRightClick(rightIdx)}
              disabled={disabled || isUsed}
              className={cn(
                'w-full p-3 rounded-lg border text-left transition-colors',
                isUsed && 'opacity-50 bg-muted',
                !isUsed && 'hover:border-primary/50'
              )}
            >
              {pairs[rightIdx].right}
            </button>
          );
        })}
      </div>
    </div>
  );
}
