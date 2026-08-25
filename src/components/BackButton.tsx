import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
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
 *
 * Postaveno na `buttonVariants({ variant: "outline" })` — dřív mělo vlastní
 * rádius, vlastní studenou šeď (`slate-200`/`slate-600`) i vlastní oranžový
 * focus ring, takže se nikde ve zbytku aplikace neshodovalo. Tvar zůstává
 * pilulka (`rounded-full` = povolený tvar pro pilulky a ikonová tlačítka).
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

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "outline", size: size === "sm" ? "sm" : "default" }),
        "group rounded-full text-muted-foreground shadow-e1 hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className={cn(iconSize, "transition-transform duration-150 group-hover:-translate-x-0.5")} />
      {label}
    </button>
  );
}
