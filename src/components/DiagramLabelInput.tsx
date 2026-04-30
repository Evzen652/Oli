import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface Point {
  x: number;
  y: number;
  id: string;
}

interface Props {
  imageUrl: string;
  imageAlt: string;
  points: Point[];
  labelPool: string[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * DiagramLabel — žák přiřazuje labely k bodům na obrázku.
 *
 * Layout:
 *   • Image s číslovanými body (kruhy s číslem)
 *   • Pod tím seznam bodů s dropdown výběrem labelu
 *   • Submit posílá labels v pořadí indexů bodů, oddělené |
 *
 * Pool labelů je shuffled, aby žák nemohl prostě vzít první.
 */
export function DiagramLabelInput({
  imageUrl, imageAlt, points, labelPool, onSubmit, disabled,
}: Props) {
  // Map index → vybraný label (string nebo "")
  const [assignments, setAssignments] = useState<string[]>(
    () => points.map(() => "")
  );

  // Stable shuffled pool (memo na první render)
  const shuffledPool = useMemo(() => {
    const copy = [...labelPool];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [labelPool]);

  const allFilled = assignments.every((a) => a.length > 0);
  const handleSubmit = () => {
    onSubmit(assignments.join("|"));
  };

  // Spočítej, které labely už jsou přiřazené (pro disable v dropdownech)
  const usedLabels = new Set(assignments.filter(Boolean));

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Přiřaď popisky k jednotlivým bodům na obrázku.</p>

      {/* Image se značkami bodů */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-card shadow-soft-2">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="block w-full h-auto"
          loading="lazy"
        />
        {points.map((p, i) => (
          <span
            key={p.id}
            className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground font-display font-bold text-sm shadow-soft-2 border-2 border-white"
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            aria-label={`Bod ${i + 1}`}
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Body s dropdowny */}
      <div className="space-y-2">
        {points.map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
              {i + 1}
            </span>
            <select
              value={assignments[i]}
              onChange={(e) => {
                const next = [...assignments];
                next[i] = e.target.value;
                setAssignments(next);
              }}
              disabled={disabled}
              className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-soft-1 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            >
              <option value="">— vyber popisek —</option>
              {shuffledPool.map((label) => (
                <option
                  key={label}
                  value={label}
                  disabled={usedLabels.has(label) && assignments[i] !== label}
                >
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!allFilled || disabled}
        className="w-full text-lg h-12 rounded-xl"
      >
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
