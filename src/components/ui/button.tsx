import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Design systém Oli — viz `docs/DESIGN_SYSTEM.md`.
 *
 * Tvar: tlačítko ≥40 px má rádius 16 px (`rounded-lg`), malé tlačítko 10 px.
 * Pohyb: JEDEN hover pohyb pro celou aplikaci — `shadow-e2` + zvednutí o 1 px.
 * Dřív se na jedné obrazovce potkaly `hover:scale-105`, `1.02` i `1.01`.
 * Barva: oranžová/jantarová NIKDY nenese bílý text (kontrast 2,8:1) — proto
 * je `warning` tint s tmavým textem, ne plocha.
 */

/** Jediný povolený hover pohyb. Neplatí pro `ghost`/`link` (nemají plochu). */
const LIFT =
  "hover:shadow-e2 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground shadow-e1 hover:bg-primary-hover ${LIFT}`,
        destructive: `bg-destructive text-destructive-foreground shadow-e1 hover:bg-destructive/90 ${LIFT}`,
        outline: `border border-input bg-card text-foreground hover:bg-accent hover:text-accent-foreground ${LIFT}`,
        secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80 ${LIFT}`,
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** Potvrzení, dokončení, „Správně". */
        success: `bg-success text-success-foreground shadow-e1 hover:bg-success/90 ${LIFT}`,
        /** Nápověda / upozornění — tint s tmavým textem, nikdy plocha s bílým. */
        warning: `border border-warning/30 bg-warning-muted text-warning hover:bg-warning-muted/70 ${LIFT}`,
        /**
         * Možnost odpovědi ve cvičení. Bílá karta, 56 px minimální výška
         * (dětský cíl dotyku), text se smí zalomit na víc řádků.
         */
        answer: `min-h-14 h-auto whitespace-normal border-2 border-border bg-card py-3 text-center text-lg font-bold text-foreground shadow-e1 hover:border-primary/40 hover:bg-accent/40 ${LIFT}`,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
        /** Dětská část: 56 px cíl dotyku, základní text 17 px. */
        child: "min-h-14 px-6 py-3 text-[17px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
