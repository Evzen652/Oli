import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Design systém Oli — viz `docs/DESIGN_SYSTEM.md`.
 *
 * Stavové pilulky se v aplikaci psaly ručně (~63×) jako
 * `bg-green-100 text-green-700 px-2 py-0.5 rounded-full` + vlastní velikost —
 * pokaždé s jiným odstínem i velikostí písma, často pod 12 px.
 * `success`/`warning`/`info` ty ruční varianty nahrazují: tint + tmavý text,
 * ověřený kontrast, 12 px = absolutní minimum.
 */

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-caption font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        /** Hotovo, zvládnuto, správně. Tint #E3F3E8 + #15803D (5,02:1). */
        success: "border-transparent bg-success-muted text-success",
        /** Nápověda, pozor, čeká na akci. Tint #FEF6E7 + #B45309 (5,02:1). */
        warning: "border-transparent bg-warning-muted text-warning",
        /** Neutrální doplněk. Borůvkový tint #F3F1FE + #3B2A9E (9,36:1). */
        info: "border-transparent bg-accent text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
