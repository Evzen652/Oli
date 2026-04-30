import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormulaToken {
  id: string;
  token: string;
}

interface Props {
  pool: FormulaToken[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * FormulaBuilder — žák klikáním sestaví vzorec z pool dílů.
 *
 * Layout:
 *   • Horní řádek: aktuálně sestavený vzorec (chips)
 *   • Pool dole: klikatelné chips s nepoužitými díly
 * Submit posílá tokens v pořadí oddělené |.
 *
 * UX: klik na pool token → přesune ho do sestavy. Klik na sestavu chip → odstraní.
 * Žádný drag-drop pro jednoduchost (klik je rychlejší).
 */
export function FormulaBuilderInput({ pool, onSubmit, disabled }: Props) {
  // Stable shuffled pool
  const shuffledPool = useMemo(() => {
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [pool]);

  const [assembled, setAssembled] = useState<FormulaToken[]>([]);

  const usedIds = new Set(assembled.map((t) => t.id));
  const remaining = shuffledPool.filter((t) => !usedIds.has(t.id));

  const handleSubmit = () => {
    onSubmit(assembled.map((t) => t.token).join("|"));
  };

  return (
    <div className="space-y-5">
      <p className="text-base text-muted-foreground">
        Klikni na díly v pořadí, jak je sestavíš do vzorce. Klikni na díl ve vzorci pro odstranění.
      </p>

      {/* Sestavený vzorec */}
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 sm:p-5 min-h-[80px] flex flex-wrap items-center gap-2">
        {assembled.length === 0 ? (
          <p className="text-sm text-muted-foreground italic w-full text-center">
            Klikni na díl níže pro začátek
          </p>
        ) : (
          assembled.map((tok, i) => (
            <button
              key={`${tok.id}-${i}`}
              type="button"
              onClick={() => setAssembled((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={disabled}
              className="group inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-3 py-2 font-display font-bold text-base shadow-soft-1 hover:bg-primary/90 transition-colors disabled:opacity-50"
              title="Odstranit díl"
            >
              <span>{tok.token}</span>
              <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
            </button>
          ))
        )}
      </div>

      {/* Pool */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">
          Dostupné díly
        </p>
        <div className="flex flex-wrap gap-2">
          {remaining.length === 0 ? (
            <p className="text-sm text-muted-foreground italic w-full text-center py-3">
              Všechny díly použity
            </p>
          ) : (
            remaining.map((tok) => (
              <button
                key={tok.id}
                type="button"
                onClick={() => setAssembled((prev) => [...prev, tok])}
                disabled={disabled}
                className="rounded-xl border border-border bg-card text-foreground px-3 py-2 font-display font-bold text-base shadow-soft-1 hover:bg-accent hover:border-primary/40 transition-colors disabled:opacity-50"
              >
                {tok.token}
              </button>
            ))
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={assembled.length === 0 || disabled}
        className="w-full text-lg h-12 rounded-xl"
      >
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
