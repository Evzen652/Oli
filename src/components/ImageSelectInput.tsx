import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ImageOption {
  url: string;
  alt: string;
  id: string;
}

interface Props {
  imageOptions: ImageOption[];
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * ImageSelect — žák klikne na 1 ze 4 obrázků.
 * Submit posílá `id` zvoleného obrázku jako answer string.
 */
export function ImageSelectInput({ imageOptions, onSubmit, disabled }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-base text-muted-foreground">Vyber správný obrázek.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4">
        {imageOptions.map((opt) => {
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelected(opt.id)}
              className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                isActive
                  ? "border-primary ring-4 ring-primary/20 shadow-soft-3"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-soft-2"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              aria-label={opt.alt}
            >
              <img
                src={opt.url}
                alt={opt.alt}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              {isActive && (
                <span className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft-2">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <Button
        onClick={() => selected && onSubmit(selected)}
        disabled={!selected || disabled}
        className="w-full text-lg h-12 rounded-xl"
      >
        {disabled ? "Zpracovávám…" : "Odeslat odpověď ✏️"}
      </Button>
    </div>
  );
}
