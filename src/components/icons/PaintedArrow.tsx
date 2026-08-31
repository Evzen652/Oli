import { cn } from "@/lib/utils";

/**
 * Ručně kreslená šipka — drží stejný rukopis jako akvarelové ilustrace
 * (inkoustová kontura, dráha není přesně rovná, hlava se nesejde na doraz).
 * Pod dříkem je slabší druhý tah, aby to působilo jako skica.
 *
 * Proč SVG a ne malovaný PNG: šipka se objevuje na oranžovém tlačítku (bílá),
 * na bílém (oranžová) i v tlumeném textu. `currentColor` se přebarví sám,
 * rastr by musel existovat v několika verzích a stejně by nešel obarvit
 * podle stavu.
 *
 * Používá se jako náhrada za `ArrowRight`/`ArrowLeft` z lucide, takže bere
 * velikost přes `className` (`h-4 w-4`) úplně stejně.
 *
 * Směr se otáčí atributem `transform` na `<g>`, NE přes CSS. Kdyby se
 * nastavoval inline `style.transform`, přebil by Tailwind třídy typu
 * `group-hover:translate-x-0.5`, které se u těchhle šipek běžně používají.
 */

type Direction = "right" | "left" | "up" | "down";

const TRANSFORM: Record<Direction, string | undefined> = {
  right: undefined,
  left: "translate(24, 0) scale(-1, 1)",
  up: "rotate(-90 12 12)",
  down: "rotate(90 12 12)",
};

interface Props {
  className?: string;
  direction?: Direction;
}

export function PaintedArrow({ className, direction = "right" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <g
        transform={TRANSFORM[direction]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.1}
      >
        {/* dřík — mírně zvlněný, ne rovná čára */}
        <path d="M3.4 12.6 C 8.2 12.0, 12.8 12.4, 18.9 11.8" />
        {/* hlava, dva samostatné tahy */}
        <path d="M14.2 7.2 C 16.1 8.8, 17.7 10.4, 19.1 11.8" />
        <path d="M19.1 12.0 C 17.5 13.6, 15.9 15.3, 14.0 16.6" />
        {/* slabší doprovodný tah — dojem skici */}
        <path
          d="M4.6 13.9 C 9.0 13.4, 13.0 13.6, 17.4 13.1"
          strokeWidth={0.9}
          opacity={0.4}
        />
      </g>
    </svg>
  );
}
