import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  /** Kam navigovat. Pokud nezadáno, použije navigate(-1). */
  to?: string;
  /** Vlastní onClick handler — pokud zadán, přepíše to/-1 chování. */
  onClick?: () => void;
  /** Text na tlačítku. Default: "Zpět" */
  label?: string;
  /** Velikost: md (default) = standardní, sm = kompaktní pro hlavičky */
  size?: "sm" | "md";
  /** Extra className na vnější button. */
  className?: string;
}

/**
 * Sjednocené tlačítko Zpět pro celou aplikaci.
 * Pill-shaped, lehký border, hover scale + posun šipky.
 *
 * Použití:
 *   <BackButton />                              // navigate(-1), label "Zpět"
 *   <BackButton to="/" />                       // navigate("/")
 *   <BackButton to="/onboarding" label="Změnit ročník" size="sm" />
 *   <BackButton onClick={() => doSomething()} label="Konec sezení" />
 */
export function BackButton({ to, onClick, label = "Zpět", size = "md", className }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) { onClick(); return; }
    if (to) { navigate(to); return; }
    navigate(-1);
  };

  const sizeClasses = size === "sm"
    ? "px-3 py-1.5 text-xs gap-1.5"
    : "px-4 py-2 text-sm gap-2";

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group inline-flex items-center rounded-full font-medium",
        "bg-white border border-slate-200 shadow-sm text-slate-600",
        "hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-md",
        "active:scale-95 transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2",
        sizeClasses,
        className,
      )}
    >
      <ArrowLeft className={cn(iconSize, "transition-transform duration-150 group-hover:-translate-x-0.5")} />
      {label}
    </button>
  );
}
