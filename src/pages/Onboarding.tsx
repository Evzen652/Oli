import { useNavigate } from "react-router-dom";
import { OlyLogo } from "@/components/OlyLogo";
import { hasContentForGrade } from "@/lib/contentAvailability";
import { startTrial } from "@/lib/anonTrial";
import { LandingNav } from "@/pages/LandingNav";
import { ArrowLeft } from "lucide-react";

const S = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images";

const GRADE_META: Record<number, {
  gradient: string; border: string; text: string;
}> = {
  1: { gradient: "from-yellow-300 to-amber-400",   border: "border-yellow-500",  text: "text-yellow-900" },
  2: { gradient: "from-orange-300 to-red-400",     border: "border-orange-500",  text: "text-orange-900" },
  3: { gradient: "from-rose-400 to-pink-500",      border: "border-rose-500",    text: "text-white"      },
  4: { gradient: "from-emerald-300 to-green-500",  border: "border-emerald-600", text: "text-emerald-900"},
  5: { gradient: "from-teal-300 to-cyan-500",      border: "border-teal-600",    text: "text-teal-900"   },
  6: { gradient: "from-sky-300 to-blue-500",       border: "border-sky-600",     text: "text-white"      },
  7: { gradient: "from-blue-400 to-indigo-600",    border: "border-blue-700",    text: "text-white"      },
  8: { gradient: "from-violet-400 to-purple-600",  border: "border-violet-700",  text: "text-white"      },
  9: { gradient: "from-fuchsia-400 to-pink-600",   border: "border-fuchsia-600", text: "text-white"      },
};

export default function Onboarding() {
  const navigate = useNavigate();

  const handleGradeSelect = (grade: number) => {
    localStorage.setItem("oli_anon_grade", String(grade));
    localStorage.setItem("oli_anon_started", new Date().toISOString());
    startTrial(grade); // spustí 14-denní trial (idempotent)
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
                const m = GRADE_META[grade];
                return (
                  <button
                    key={grade}
                    onClick={() => handleGradeSelect(grade)}
                    title={hasContent ? undefined : "Obsah připravujeme — zatím dostaneš cvičení z jiného ročníku"}
                    className={`
                      relative overflow-hidden aspect-square rounded-2xl border-2
                      transition-all duration-150 cursor-pointer active:scale-95
                      flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1
                      bg-gradient-to-br
                      ${hasContent
                        ? `${m.gradient} ${m.border} ${m.text}`
                        : "from-slate-100 to-slate-200 border-slate-300 text-slate-400 opacity-60"
                      }
                    `}
                  >
                    {/* Velké číslo v pozadí jako dekorativní ilustrace */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center text-[5rem] font-black leading-none opacity-20 select-none pointer-events-none"
                    >
                      {grade}
                    </span>
                    {/* Čitelné číslo s tečkou nahoře */}
                    <span className="relative z-10 text-2xl font-bold">{grade}.</span>
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
