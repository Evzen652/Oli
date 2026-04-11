import { Button } from "@/components/ui/button";
import type { Grade } from "@/lib/types";
import { useT } from "@/lib/i18n";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OlyLogo } from "@/components/OlyLogo";

interface GradeSelectProps {
  onSelect: (grade: Grade) => void;
  isAdmin?: boolean;
}

const DEMO_MODE = true; // Set to false to show all grades
const DEMO_GRADE: Grade = 3;

const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function GradeSelect({ onSelect, isAdmin }: GradeSelectProps) {
  const t = useT();
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4" style={isAdmin ? { paddingTop: "2.5rem" } : undefined}>
      <div className={`absolute ${isAdmin ? "top-[4.5rem]" : "top-4"} left-4 z-10`}>
        <OlyLogo />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 gap-2 text-muted-foreground"
        onClick={() => supabase.auth.signOut()}
      >
        <LogOut className="h-4 w-4" />
        {t("session.sign_out")}
      </Button>
      <div className="w-full max-w-lg space-y-10 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {t("grade.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("grade.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {grades.map((g) => {
            const isActive = !DEMO_MODE || g === DEMO_GRADE;
            return (
              <Button
                key={g}
                variant="outline"
                size="lg"
                className={`text-2xl font-medium h-16 border-2 relative ${
                  !isActive ? "opacity-40 cursor-not-allowed" : ""
                }`}
                onClick={() => isActive && onSelect(g)}
                disabled={!isActive}
              >
                {g}.
                {!isActive && (
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-normal whitespace-nowrap">
                    Již brzy
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
