import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SessionView } from "@/components/SessionView";

/**
 * Žákovský dashboard pro anonymního uživatele (bez registrace).
 * Ročník se čte z localStorage (oli_anon_grade) — nastaveno v OnboardingPage.
 * Zobrazuje banner "Procvičuješ jako host" a skrývá sekce vyžadující auth.
 */
export default function AnonStudentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAnon = searchParams.get("anon") === "1" || !!localStorage.getItem("oli_anon_grade");
  const anonGrade = localStorage.getItem("oli_anon_grade");

  // Pokud sem přijde unauthenticated uživatel bez anon grade → onboarding
  useEffect(() => {
    if (!anonGrade) {
      navigate("/onboarding", { replace: true });
    }
  }, [anonGrade, navigate]);

  if (!anonGrade) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Anon banner */}
      {isAnon && (
        <div className="bg-violet-50 border-b border-violet-100 px-4 py-2
                        text-sm text-violet-700 flex items-center justify-between gap-4 shrink-0">
          <span>Procvičuješ jako host — pokrok se uloží jen v tomto prohlížeči.</span>
          <a href="/auth?mode=register" className="font-medium hover:underline whitespace-nowrap">
            Uložit pokrok →
          </a>
        </div>
      )}

      {/* Student dashboard — funguje normálně, grade přednastavena z localStorage */}
      <div className="flex-1">
        <SessionView />
      </div>
    </div>
  );
}
