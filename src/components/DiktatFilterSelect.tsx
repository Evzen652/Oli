import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export type DiktatType = "vyjmenovana" | "parove" | "tvrde_mekke" | "velka_pismena";

interface DiktatFilterSelectProps {
  onConfirm: (selectedTypes: DiktatType[]) => void;
  onBack: () => void;
}

const DIKTAT_TYPE_OPTIONS: { value: DiktatType; label: string; description: string }[] = [
  { value: "vyjmenovana", label: "Vyjmenovaná slova", description: "y/ý nebo i/í po obojetných souhláskách (B, L, M, P, S, V, Z)" },
  { value: "parove", label: "Párové souhlásky", description: "b/p, d/t, ž/š, z/s, v/f, ď/ť na konci nebo uprostřed slova" },
  { value: "tvrde_mekke", label: "Tvrdé a měkké souhlásky", description: "y/ý po tvrdých (h, ch, k, r) a i/í po měkkých (ž, š, č, ř, c, j)" },
  { value: "velka_pismena", label: "Velká písmena", description: "Vlastní jména, zeměpisné názvy, začátky vět" },
];

export function DiktatFilterSelect({ onConfirm, onBack }: DiktatFilterSelectProps) {
  const [selected, setSelected] = useState<Set<DiktatType>>(
    new Set(DIKTAT_TYPE_OPTIONS.map((o) => o.value))
  );

  const toggle = (type: DiktatType) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-base text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
          Zpět
        </Button>

        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Doplňovací diktát
          </h1>
          <p className="text-lg text-muted-foreground">
            Vyber, co chceš v diktátu procvičovat:
          </p>
        </div>

        <div className="grid gap-4">
          {DIKTAT_TYPE_OPTIONS.map((opt) => (
            <Card
              key={opt.value}
              className={`cursor-pointer border-2 transition-colors ${
                selected.has(opt.value) ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => toggle(opt.value)}
            >
              <CardContent className="flex items-start gap-4 p-5">
                <Checkbox
                  checked={selected.has(opt.value)}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => toggle(opt.value)}
                  className="mt-1 h-6 w-6"
                />
                <div>
                  <p className="text-xl font-medium text-foreground">{opt.label}</p>
                  <p className="text-base text-muted-foreground">{opt.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={() => onConfirm([...selected])}
          disabled={selected.size === 0}
          className="w-full text-lg h-14"
        >
          {selected.size === 0
            ? "Vyber alespoň jeden jev"
            : `Začít diktát (${selected.size} ${selected.size === 1 ? "jev" : selected.size < 5 ? "jevy" : "jevů"})`}
        </Button>
      </div>
    </div>
  );
}
