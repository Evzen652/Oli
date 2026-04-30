import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";

interface Event {
  id: string;
  label: string;
}

interface Props {
  events: Event[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * Timeline — žák seřadí historické události chronologicky.
 *
 * Layout: vertikální seznam událostí s up/down arrows pro přesun.
 * Pool je v náhodném pořadí (memo na první render). Submit posílá
 * labely v aktuálním pořadí, oddělené |.
 */
export function TimelineInput({ events, onSubmit, disabled }: Props) {
  // Stable shuffled init order
  const initialOrder = useMemo(() => {
    const copy = [...events];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [events]);

  const [order, setOrder] = useState<Event[]>(initialOrder);

  const move = (idx: number, dir: "up" | "down") => {
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= order.length) return;
    const next = [...order];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setOrder(next);
  };

  const handleSubmit = () => {
    onSubmit(order.map((e) => e.label).join("|"));
  };

  return (
    <div className="space-y-5">
      <p className="text-base text-muted-foreground">
        Seřaď události chronologicky od nejstarší (nahoře) po nejnovější (dole).
      </p>

      <div className="space-y-2">
        {order.map((event, i) => (
          <div
            key={event.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft-1"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
              {i + 1}
            </span>
            <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 hidden sm:block" />
            <span className="flex-1 text-sm font-medium text-foreground">{event.label}</span>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => move(i, "up")}
                disabled={i === 0 || disabled}
                title="Posunout nahoru"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => move(i, "down")}
                disabled={i === order.length - 1 || disabled}
                title="Posunout dolů"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full text-lg h-12 rounded-xl"
      >
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
