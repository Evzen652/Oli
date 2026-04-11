import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";

interface DragOrderInputProps {
  items: string[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

const CARD_COLORS = [
  "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100",
  "border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100",
  "border-green-300 bg-green-50 text-green-700 hover:bg-green-100",
  "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
];

export function DragOrderInput({ items, onSubmit, disabled }: DragOrderInputProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>(() => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const handleSelect = useCallback((item: string) => {
    if (disabled) return;
    setRemaining((prev) => prev.filter((i) => i !== item));
    setSelected((prev) => [...prev, item]);
  }, [disabled]);

  const handleDeselect = useCallback((item: string) => {
    if (disabled) return;
    setSelected((prev) => prev.filter((i) => i !== item));
    setRemaining((prev) => [...prev, item]);
  }, [disabled]);

  const handleSubmit = useCallback(() => {
    onSubmit(selected.join(","));
  }, [selected, onSubmit]);

  const handleReset = useCallback(() => {
    if (disabled) return;
    const all = [...selected, ...remaining];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    setRemaining(all);
    setSelected([]);
  }, [disabled, selected, remaining]);

  const colorFor = (item: string) => CARD_COLORS[items.indexOf(item) % CARD_COLORS.length];

  const maxLen = Math.max(...items.map((i) => i.length));
  const textSize = maxLen > 15 ? "text-base" : "text-lg";

  return (
    <div className="space-y-5">
      {/* Selected zone */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">📋 Tvoje pořadí:</p>
        {selected.length > 0 && (
          <p className="text-xs text-muted-foreground/50 mb-1">Klikni na položku pro odebrání</p>
        )}
        <div className="min-h-[56px] rounded-xl border-2 border-dashed border-muted p-3">
          {selected.length === 0 ? (
            <p className="text-sm text-muted-foreground/60 text-center py-2">Klikni na položku níže…</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {selected.map((item, index) => (
                <button
                  key={item}
                  onClick={() => handleDeselect(item)}
                  disabled={disabled}
                  className={`animate-pop-in flex items-center gap-2 rounded-xl border-2 px-3 py-3 ${textSize} font-bold transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer whitespace-normal text-left ${colorFor(item)}`}
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1">{item}</span>
                  <X className="w-4 h-4 opacity-40 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
        {selected.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={disabled} className="mt-2 text-xs text-muted-foreground gap-1">
            <RotateCcw className="w-3 h-3" />
            Začít znovu
          </Button>
        )}
      </div>

      {/* Remaining zone */}
      {remaining.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">👇 Vyber další:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {remaining.map((item) => (
              <button
                key={item}
                onClick={() => handleSelect(item)}
                disabled={disabled}
                className={`animate-pop-in rounded-xl border-2 px-3 py-3 ${textSize} font-bold transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer whitespace-normal text-center ${colorFor(item)}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      {remaining.length === 0 && (
        <Button onClick={handleSubmit} disabled={disabled} className="w-full text-lg h-12 animate-pop-in">
          Odeslat pořadí
        </Button>
      )}
    </div>
  );
}
