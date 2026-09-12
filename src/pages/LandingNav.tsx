import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { OliLogo } from "@/components/OliLogo";
import { useParentGate } from "@/components/ParentGate";

const NAV_LINKS = [
  { label: "Jak to funguje", href: "#jak-to-funguje" },
  { label: "Příprava na písemku", href: "#pisemka" },
  { label: "Každodenní vyučování", href: "#den-s-olim" },
  { label: "Přínosy", href: "#prinosy" },
  { label: "Ceník", href: "#ceny" },
];

/**
 * `detskeZobrazeni` zapni všude, kde tuhle navigaci vidí dítě (`Onboarding`,
 * `AnonStudentPage`, `ChildAuth`). Odchody z dětské části pak vedou přes
 * rodičovskou bránu — do 2026-09-12 byly bez ní a byly to jediné takové
 * vstupy do části pro dospělé; všude jinde (registrace, sdílení rodičům,
 * pozvánka) se `requireParent` volá.
 *
 * Za bránou je **celé** menu, ne jen „Ceník". Všechny položky vedou na
 * `/landing`, kde ceník je — chránit jen odkaz „Ceník" by nic neřešilo,
 * dítě by se k částkám dostalo kliknutím na „Přínosy".
 *
 * Na marketingovém landingu (`detskeZobrazeni = false`) se brána neptá:
 * tam přichází dospělý a ptát se ho na procenta by bylo jen otravné.
 */
export function LandingNav({ detskeZobrazeni = false }: { detskeZobrazeni?: boolean } = {}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { requireParent, gateElement } = useParentGate();

  /** Na dětské obrazovce přes bránu, jinde rovnou. */
  function odchod(akce: () => void) {
    if (detskeZobrazeni) requireParent(akce);
    else akce();
  }

  function handleLogoClick() {
    // Na landing scrolluje nahoru, jinde naviguje na home
    if (pathname === "/" || pathname === "/landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  }

  function goToLogin() {
    // Přihlášeného rodiče/admina/dítě neodhlašovat — LandingNav se renderuje
    // i na /landing v jejich větvi a jejich /auth route je přesměruje zpět.
    // Anonymní návštěvník žádnou auth session nemá, takže není co odhlašovat.
    odchod(() => navigate("/auth"));
  }

  function scrollTo(id: string) {
    const el = document.querySelector(id);
    if (el) {
      // Kotva je na téhle stránce → jsme na landingu, nikam se neodchází.
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      odchod(() => navigate("/landing" + id));
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-muted bg-card/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <OliLogo size="xs" onClick={handleLogoClick} />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-6" onClick={goToLogin}>
            Přihlásit se
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 pt-8">
                {NAV_LINKS.map((link) => (
                  <button key={link.href} onClick={() => { scrollTo(link.href); setOpen(false); }}
                    className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </button>
                ))}
                <hr />
                <Button variant="outline" className="w-full" onClick={() => { goToLogin(); setOpen(false); }}>Přihlásit se</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {gateElement}
    </nav>
  );
}
