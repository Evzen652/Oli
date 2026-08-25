import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Pojmenované stupně typografické škály (viz `tailwind.config.ts`).
 *
 * MUSÍ tu být vyjmenované: tailwind-merge zná jen výchozí Tailwind škálu,
 * takže neznámé `text-h2` zařadí do skupiny **barva textu** — a pak ho
 * jakákoli pozdější `text-warning` / `text-muted-foreground` beze stopy
 * odstraní. Projevilo se to na `Badge`: `text-caption` (12 px) zmizelo
 * a pilulka se vykreslila zděděnými 16 px.
 */
const FONT_SIZE_SCALE = ["display", "h1", "h2", "h3", "body-lg", "body", "label", "caption"];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZE_SCALE }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
