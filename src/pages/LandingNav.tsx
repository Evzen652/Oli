import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { OlyLogo } from "@/components/OlyLogo";

const NAV_LINKS = [
  { label: "Jak to funguje", href: "#jak-to-funguje" },
  { label: "Přínosy", href: "#prinosy" },
  { label: "Ceník", href: "#ceny" },
];

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

export function LandingNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <OlyLogo size="xs" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => navigate("/demo")}>
            Demo
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => navigate("/auth")}>
            Přihlásit se
          </Button>
          <Button
            size="sm"
            className="bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-6"
            onClick={() => navigate("/auth")}
          >
            Registrace zdarma
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
                    className="text-left text-lg font-medium text-slate-800 hover:text-[#F97316] transition-colors">
                    {link.label}
                  </button>
                ))}
                <hr />
                <Button variant="outline" className="w-full" onClick={() => { navigate("/demo"); setOpen(false); }}>Demo</Button>
                <Button variant="outline" className="w-full" onClick={() => { navigate("/auth"); setOpen(false); }}>Přihlásit se</Button>
                <Button className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white" onClick={() => { navigate("/auth"); setOpen(false); }}>
                  Registrace zdarma
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
