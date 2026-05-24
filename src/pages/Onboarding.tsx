import { useNavigate } from "react-router-dom";
import { OlyLogo } from "@/components/OlyLogo";
import { hasContentForGrade } from "@/lib/contentAvailability";
import { LandingNav } from "@/pages/LandingNav";
import { ArrowLeft } from "lucide-react";

const GRADE_COLORS: Record<number, { bg: string; border: string; text: string; hover: string }> = {
  1: { bg: "bg-yellow-400",  border: "border-yellow-400",  text: "text-yellow-900", hover: "hover:bg-yellow-300" },
  2: { bg: "bg-orange-400",  border: "border-orange-400",  text: "text-orange-900", hover: "hover:bg-orange-300" },
  3: { bg: "bg-red-400",     border: "border-red-400",     text: "text-red-900",    hover: "hover:bg-red-300"    },
  4: { bg: "bg-emerald-400", border: "border-emerald-400", text: "text-emerald-900",hover: "hover:bg-emerald-300"},
  5: { bg: "bg-teal-400",    border: "border-teal-400",    text: "text-teal-900",   hover: "hover:bg-teal-300"   },
  6: { bg: "bg-sky-400",     border: "border-sky-400",     text: "text-sky-900",    hover: "hover:bg-sky-300"    },
  7: { bg: "bg-blue-500",    border: "border-blue-500",    text: "text-white",      hover: "hover:bg-blue-400"   },
  8: { bg: "bg-violet-500",  border: "border-violet-500",  text: "text-white",      hover: "hover:bg-violet-400" },
  9: { bg: "bg-pink-500",    border: "border-pink-500",    text: "text-white",      hover: "hover:bg-pink-400"   },
};

export default function Onboarding() {
  const navigate = useNavigate();

  const handleGradeSelect = (grade: number) => {
    localStorage.setItem("oli_anon_grade", String(grade));
    localStorage.setItem("oli_anon_started", new Date().toISOString());
    navigate("/student?anon=1");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <LandingNav />
      <div className="flex-1 flex flex-col items-center p-8">
        <div className="max-w-sm w-full">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Zpět
          </button>
        </div>
        <div className="max-w-sm w-full space-y-10 text-center">

          <div className="flex flex-col items-center gap-4">
            <OlyLogo size="md" variant="notext" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Ahoj! Já jsem Oli.
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Pomůžu ti se vším, co máš teď ve škole.<br />
                Jen mi řekni, do které třídy chodíš a jdeme na to.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-700 font-semibold text-base">Do které třídy chodíš?</p>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => {
                const hasContent = hasContentForGrade(grade);
                const c = GRADE_COLORS[grade];
                return (
                  <button
                    key={grade}
                    onClick={() => handleGradeSelect(grade)}
                    title={hasContent ? undefined : "Obsah připravujeme — zatím dostaneš cvičení z jiného ročníku"}
                    className={`
                      aspect-square rounded-2xl border-2 text-2xl font-bold
                      transition-all duration-150 cursor-pointer active:scale-95
                      flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5
                      ${hasContent
                        ? `${c.bg} ${c.border} ${c.text} ${c.hover}`
                        : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200 opacity-60"
                      }
                    `}
                  >
                    {grade}.
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-1.5">
            <p className="text-sm text-slate-600 leading-relaxed">
              Chcete dítěti zadávat úkoly a sledovat pokrok?
            </p>
            <a
              href="/auth?mode=register"
              className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition-colors inline-flex"
            >
              Jsem tady jako rodič →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
