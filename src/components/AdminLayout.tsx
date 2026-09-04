import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronRight, Home, Shield, Users, GraduationCap, BookOpenCheck } from "lucide-react";
import { useT } from "@/lib/i18n";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface Breadcrumb {
  label: string;
  path?: string;
}

interface AdminLayoutProps {
  breadcrumbs: Breadcrumb[];
  children: ReactNode;
}

export function AdminLayout({ breadcrumbs, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const t = useT();

  return (
    <div className="min-h-screen bg-background">
      {/* Header — Notion/Linear vibe: bílý, vzdušný, jemný oddělovač */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo + nadpis */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 group"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft-2 transition-transform group-hover:scale-105">
              <BookOpenCheck className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="text-left">
              <h1 className="font-display text-[17px] font-bold leading-tight text-foreground tracking-tight">
                Oli · Kurikulum
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Správa obsahu pro 1.–9. ročník
              </p>
            </span>
          </button>

          {/* Pravá strana: role switcher, avatar */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full border-border bg-card hover:bg-accent shadow-soft-1"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="font-medium">Pohled: Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl shadow-soft-3">
                <DropdownMenuItem onClick={() => navigate("/admin")} className="gap-2">
                  <Shield className="h-4 w-4" /> Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/parent")} className="gap-2">
                  <Users className="h-4 w-4" /> Rodič
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/student")} className="gap-2">
                  <GraduationCap className="h-4 w-4" /> Žák
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => supabase.auth.signOut()}
              title={t("admin.sign_out")}
              className="h-9 w-9 rounded-full bg-warning-muted text-warning hover:bg-warning-muted/70 font-semibold text-sm"
            >
              <span className="sr-only">{t("admin.sign_out")}</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs — wrapper má identickou strukturu jako <main> níže,
          aby home ikona seděla přesně nad levým sloupcem (sidebar). */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-5">
        <nav className="flex items-center gap-1 text-sm flex-nowrap overflow-x-auto whitespace-nowrap">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => navigate("/admin")}
            title="Domů"
          >
            <Home className="h-3.5 w-3.5" />
          </Button>
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-1 shrink-0">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
              {bc.path ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => navigate(bc.path!)}
                >
                  {bc.label}
                </Button>
              ) : (
                <span className="px-2 font-semibold text-foreground">{bc.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-5 lg:py-6 space-y-4">
        {children}
      </main>
    </div>
  );
}
