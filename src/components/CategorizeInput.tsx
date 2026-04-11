import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategorizeInputProps {
  categories: { name: string; items: string[] }[];
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function CategorizeInput({ categories, onSubmit, disabled }: CategorizeInputProps) {
  // Collect all items and shuffle
  const [allItems] = useState(() => {
    const items = categories.flatMap(c => c.items);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  });

  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const assignedItems = new Set(Object.keys(assignments));

  const handleItemClick = (item: string) => {
    if (disabled || assignedItems.has(item)) return;
    setSelectedItem(item === selectedItem ? null : item);
  };

  const handleCategoryClick = (categoryName: string) => {
    if (disabled || !selectedItem) return;
    setAssignments(prev => ({ ...prev, [selectedItem]: categoryName }));
    setSelectedItem(null);
  };

  const handleUndo = (item: string) => {
    if (disabled) return;
    setAssignments(prev => {
      const next = { ...prev };
      delete next[item];
      return next;
    });
  };

  const handleSubmit = () => {
    const result: Record<string, string[]> = {};
    categories.forEach(c => { result[c.name] = []; });
    Object.entries(assignments).forEach(([item, cat]) => {
      result[cat]?.push(item);
    });
    onSubmit(JSON.stringify(result));
  };

  const allAssigned = assignedItems.size === allItems.length;

  const categoryColors = [
    "border-blue-300 bg-blue-50",
    "border-green-300 bg-green-50",
    "border-purple-300 bg-purple-50",
  ];

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Zařaď každou položku do správné skupiny.</p>

      {/* Unassigned items */}
      <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-xl border-2 border-dashed border-border bg-muted/30">
        {allItems.filter(item => !assignedItems.has(item)).map(item => (
          <button
            key={item}
            onClick={() => handleItemClick(item)}
            disabled={disabled}
            className={cn(
              "px-4 py-2 rounded-lg border-2 font-medium transition-all text-sm",
              selectedItem === item
                ? "border-primary bg-primary/10 scale-105 shadow-md"
                : "border-border bg-card hover:border-primary/50 hover:shadow"
            )}
          >
            {item}
          </button>
        ))}
        {allItems.filter(item => !assignedItems.has(item)).length === 0 && (
          <span className="text-muted-foreground text-sm italic">Všechny položky přiřazeny ✓</span>
        )}
      </div>

      {/* Category buckets */}
      <div className={cn("grid gap-3", categories.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
        {categories.map((cat, ci) => {
          const catItems = Object.entries(assignments).filter(([, c]) => c === cat.name).map(([item]) => item);
          return (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              disabled={disabled || !selectedItem}
              className={cn(
                "rounded-xl border-2 p-3 min-h-[120px] transition-all flex flex-col",
                categoryColors[ci % categoryColors.length],
                selectedItem ? "hover:shadow-lg hover:scale-[1.02] cursor-pointer" : "cursor-default"
              )}
            >
              <span className="font-bold text-sm mb-2">{cat.name}</span>
              <div className="flex flex-wrap gap-1 flex-1">
                {catItems.map(item => (
                  <span
                    key={item}
                    onClick={(e) => { e.stopPropagation(); handleUndo(item); }}
                    className="px-2 py-1 rounded bg-white/70 border text-xs font-medium cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    {item} ×
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <Button onClick={handleSubmit} disabled={!allAssigned || disabled} className="w-full text-lg h-12 rounded-xl">
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
