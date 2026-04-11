import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MatchPairsInputProps {
  pairs: { left: string; right: string }[];
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function MatchPairsInput({ pairs, onSubmit, disabled }: MatchPairsInputProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<{ left: number; right: number }[]>([]);
  // Shuffle right side once
  const [shuffledRight] = useState(() => {
    const arr = pairs.map((p, i) => ({ text: p.right, origIndex: i }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const leftMatched = new Set(matched.map(m => m.left));
  const rightMatched = new Set(matched.map(m => m.right));

  const handleLeftClick = (i: number) => {
    if (disabled || leftMatched.has(i)) return;
    setSelectedLeft(i === selectedLeft ? null : i);
  };

  const handleRightClick = (origIndex: number) => {
    if (disabled || rightMatched.has(origIndex) || selectedLeft === null) return;
    setMatched(prev => [...prev, { left: selectedLeft, right: origIndex }]);
    setSelectedLeft(null);
  };

  const handleUndo = () => {
    setMatched(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const result = matched.map(m => ({
      left: pairs[m.left].left,
      right: pairs[m.right].right,
    }));
    onSubmit(JSON.stringify(result));
  };

  const allMatched = matched.length === pairs.length;

  const colors = [
    "bg-blue-100 border-blue-400 text-blue-800",
    "bg-green-100 border-green-400 text-green-800",
    "bg-purple-100 border-purple-400 text-purple-800",
    "bg-orange-100 border-orange-400 text-orange-800",
    "bg-pink-100 border-pink-400 text-pink-800",
    "bg-teal-100 border-teal-400 text-teal-800",
  ];

  const getMatchColor = (leftIdx: number) => {
    const mi = matched.findIndex(m => m.left === leftIdx);
    return mi >= 0 ? colors[mi % colors.length] : "";
  };

  const getRightMatchColor = (origIdx: number) => {
    const mi = matched.findIndex(m => m.right === origIdx);
    return mi >= 0 ? colors[mi % colors.length] : "";
  };

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Spoj odpovídající dvojice kliknutím.</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          {pairs.map((p, i) => (
            <button
              key={`l-${i}`}
              onClick={() => handleLeftClick(i)}
              disabled={disabled || leftMatched.has(i)}
              className={cn(
                "w-full p-3 rounded-xl border-2 text-left font-medium transition-all",
                leftMatched.has(i)
                  ? getMatchColor(i)
                  : selectedLeft === i
                    ? "border-primary bg-primary/10 scale-105 shadow-md"
                    : "border-border bg-card hover:border-primary/50 hover:shadow"
              )}
            >
              {p.left}
            </button>
          ))}
        </div>
        {/* Right column */}
        <div className="space-y-2">
          {shuffledRight.map((item, i) => (
            <button
              key={`r-${i}`}
              onClick={() => handleRightClick(item.origIndex)}
              disabled={disabled || rightMatched.has(item.origIndex) || selectedLeft === null}
              className={cn(
                "w-full p-3 rounded-xl border-2 text-left font-medium transition-all",
                rightMatched.has(item.origIndex)
                  ? getRightMatchColor(item.origIndex)
                  : selectedLeft !== null && !rightMatched.has(item.origIndex)
                    ? "border-border bg-card hover:border-primary/50 hover:shadow cursor-pointer"
                    : "border-border bg-card opacity-60"
              )}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        {matched.length > 0 && (
          <Button variant="outline" onClick={handleUndo} disabled={disabled} className="rounded-xl">
            ↩ Zpět
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={!allMatched || disabled} className="flex-1 text-lg h-12 rounded-xl">
          {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
        </Button>
      </div>
    </div>
  );
}
