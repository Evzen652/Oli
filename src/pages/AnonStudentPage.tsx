import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionView } from "@/components/SessionView";
import { getAllTopics } from "@/lib/contentRegistry";
import { getTodayProgress, allTasksCompleted } from "@/lib/anonProgress";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { OlyLogo } from "@/components/OlyLogo";
import { ArrowRight, Check } from "lucide-react";
import type { TopicMetadata } from "@/lib/types";

/**
 * Žákovský dashboard pro anonymního (nepřihlášeného) uživatele.
 * Ukazuje 3 denní úkoly. Po splnění všech 3 zobrazí CTA k registraci.
 * Ročník se čte z localStorage (oli_anon_grade) — nastaveno v Onboarding.
 */
export default function AnonStudentPage() {
  const navigate = useNavigate();
  const anonGradeRaw = localStorage.getItem("oli_anon_grade");
  const grade = anonGradeRaw ? parseInt(anonGradeRaw, 10) : NaN;

  // session mode — zobrazí SessionView pro vybraný topic
  const [sessionMode, setSessionMode] = useState(false);
  // refresh trigger po dokončení úkolu (re-read localStorage)
  const [refreshTick, setRefreshTick] = useState(0);

  // Pokud chybí grade → onboarding
  useEffect(() => {
    if (!anonGradeRaw || isNaN(grade) || grade < 1 || grade > 9) {
      navigate("/onboarding", { replace: true });
    }
  }, [anonGradeRaw, grade, navigate]);

  // Posloucháme dokončení úkolu — refresh progress
  useEffect(() => {
    const handler = () => setRefreshTick((t) => t + 1);
    window.addEventListener("oli-anon-task-completed", handler);
    return () => window.removeEventListener("oli-anon-task-completed", handler);
  }, []);

  const dailyTopics = useMemo(() => {
    if (isNaN(grade)) return [];
    const progress = getTodayProgress(grade);
    const allTopics = getAllTopics();
    return progress.tasks
      .map((task) => {
        const topic = allTopics.find((t) => t.id === task.topicId);
        if (!topic) return null;
        return { topic, completed: task.completed, score: task.score };
      })
      .filter((t): t is { topic: TopicMetadata; completed: boolean; score?: number } => !!t);
    // refreshTick záměrně v deps — vynutí re-výpočet po dokončení úkolu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, refreshTick]);

  const allDone = allTasksCompleted();

  if (!anonGradeRaw || isNaN(grade)) return null;

  // Session mode — render SessionView (grade už nastavena z localStorage v useSessionDispatch)
  if (sessionMode) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-violet-50 border-b border-violet-100 px-4 py-2 text-sm text-violet-700 flex items-center justify-between gap-4 shrink-0">
          <button onClick={() => setSessionMode(false)} className="hover:underline">
            ← Zpět na dnešní úkoly
          </button>
          <span className="text-xs text-violet-500">Anonymní mód</span>
        </div>
        <div className="flex-1">
          <SessionView />
        </div>
      </div>
    );
  }

  // Home mode — 3 denní úkoly
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      {/* Anon banner */}
      <div className="bg-violet-100 border-b border-violet-200 px-4 py-2 text-sm text-violet-800 flex items-center justify-between gap-4">
        <span>Procvičuješ jako host — pokrok se uloží jen v tomto prohlížeči.</span>
        <a href="/auth?mode=register" className="font-medium hover:underline whitespace-nowrap">
          Uložit pokrok →
        </a>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between pt-2">
          <OlyLogo size="md" />
          <div className="text-sm text-violet-600 font-semibold">{grade}. ročník</div>
        </header>

        {/* Dnešní úkoly */}
        <section className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-violet-900">Dnešní úkoly</h1>
            <p className="text-violet-700/70 mt-1">3 cvičení zdarma každý den</p>
          </div>

          <div className="space-y-3">
            {dailyTopics.map(({ topic, completed }) => {
              const meta = getSubjectMeta(topic.subject);
              const title = topic.displayName ?? topic.studentTitle ?? topic.title;
              return (
                <div
                  key={topic.id}
                  className={`flex items-center gap-4 rounded-2xl p-4 transition-all ${
                    completed
                      ? "bg-emerald-50 border-2 border-emerald-200"
                      : "bg-white border-2 border-violet-100 hover:border-violet-300 hover:shadow-md"
                  }`}
                >
                  <IllustrationImg
                    src={meta.image}
                    className="h-12 w-12 object-contain shrink-0 mix-blend-multiply"
                    fallback={<span className="text-2xl">{meta.emoji}</span>}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{meta.label}</p>
                  </div>
                  {completed ? (
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm shrink-0 px-3 py-1.5">
                      <Check className="h-4 w-4" /> Splněno
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        sessionStorage.setItem("oli_anon_start_topic", topic.id);
                        setSessionMode(true);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-violet-600 text-white px-4 py-2 text-sm font-semibold hover:bg-violet-700 active:scale-95 transition-all shrink-0"
                    >
                      Začít <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA po splnění všech 3 */}
        {allDone && (
          <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-violet-200 p-6 text-center space-y-3">
            <h3 className="text-xl font-bold text-violet-900">Skvělé! Splnil jsi dnešní úkoly. 🎉</h3>
            <p className="text-violet-700">Zítra tě čekají nové. Chceš si uložit pokrok?</p>
            <a
              href="/auth?mode=register"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-3 font-semibold hover:bg-violet-700 transition-colors"
            >
              Zaregistrovat se zdarma <ArrowRight className="h-4 w-4" />
            </a>
            <p className="text-sm text-violet-500/80">Nebo se vrať zítra pro nové úkoly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
