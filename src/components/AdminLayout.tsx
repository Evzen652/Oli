import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, ChevronRight, Home, Shield, Users, GraduationCap } from "lucide-react";
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

/** Fetch a single field from a curriculum table by ID. */
export function useParentName(table: string, id: string | undefined) {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    (supabase as any)
      .from(table)
      .select("name")
      .eq("id", id)
      .single()
      .then(({ data }: any) => {
        if (data?.name) setName(data.name);
      });
  }, [table, id]);
  return name;
}

export function AdminLayout({ breadcrumbs, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const t = useT();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 sm:px-6 lg:px-8 py-3">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">{t("admin.title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Shield className="h-4 w-4" />
                  Pohled
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4 mr-1" /> {t("admin.sign_out")}
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30 px-4 sm:px-6 lg:px-8 py-2">
        <nav className="mx-auto flex max-w-screen-2xl items-center gap-1 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/admin")}
          >
            <Home className="h-3.5 w-3.5" />
          </Button>
          {breadcrumbs.map((bc, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              {bc.path ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => navigate(bc.path!)}
                >
                  {bc.label}
                </Button>
              ) : (
                <span className="px-2 font-medium text-foreground">{bc.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      <main className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8 space-y-4">
        {children}
      </main>
    </div>
  );
}

/** Auto-generate slug from name. */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
