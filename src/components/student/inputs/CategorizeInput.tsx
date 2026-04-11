import { useState, useEffect } from 'react';
import type { PracticeTask } from '@/lib/engine/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Props {
  task: PracticeTask;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export function CategorizeInput({ task, onSubmit, disabled }: Props) {
  const categories = task.categories ?? [];
  const allItems = categories.flatMap((c) => c.items);
  const [assignments, setAssignments] = useState<Map<string, string>>(new Map());
  const [shuffledItems, setShuffledItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setAssignments(new Map());
    setSelectedCategory(null);
    setShuffledItems([...allItems].sort(() => Math.random() - 0.5));
  }, [task.question]);

  const assignItem = (item: string) => {
    if (disabled || !selectedCategory) return;
    setAssignments((prev) => new Map(prev).set(item, selectedCategory));
  };

  const unassignedItems = shuffledItems.filter((item) => !assignments.has(item));
  const allAssigned = assignments.size === allItems.length;

  const handleSubmit = () => {
    const result = categories.map((cat) => {
      const items = Array.from(assignments.entries())
        .filter(([_, catName]) => catName === cat.name)
        .map(([item]) => item);
      return `${cat.name}:${items.join(';')}`;
    }).join('|');
    onSubmit(result);
  };

  return (
    <div className="space-y-4">
      {/* Category buttons */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.name}
            variant={selectedCategory === cat.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.name)}
            disabled={disabled}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Unassigned items */}
      {unassignedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unassignedItems.map((item) => (
            <button
              key={item}
              onClick={() => assignItem(item)}
              disabled={disabled || !selectedCategory}
              className={cn(
                'px-3 py-2 rounded-lg border bg-card transition-colors',
                selectedCategory ? 'hover:border-primary cursor-pointer' : 'opacity-50'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Assigned items per category */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const items = Array.from(assignments.entries())
            .filter(([_, catName]) => catName === cat.name)
            .map(([item]) => item);
          return (
            <div key={cat.name} className="p-3 rounded-lg border bg-muted/50">
              <div className="text-sm font-medium mb-1">{cat.name}:</div>
              <div className="flex flex-wrap gap-1">
                {items.length === 0 ? (
                  <span className="text-xs text-muted-foreground">prazdne</span>
                ) : (
                  items.map((item) => (
                    <span key={item} className="px-2 py-1 rounded bg-primary/10 text-sm">{item}</span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={handleSubmit} disabled={disabled || !allAssigned} className="w-full" size="lg">
        Odeslat
      </Button>
    </div>
  );
}
