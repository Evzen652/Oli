import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionView } from "@/components/SessionView";
import { getAllTopics } from "@/lib/contentRegistry";
import { getTodayProgress, allTasksCompleted } from "@/lib/anonProgress";
import { getContentWarning } from "@/lib/contentAvailability";
import {
  isTrialActive,
  isTrialExpired,
  getTrialDaysRemaining,
  getTrialCurrentDay,
  getCurrentAnonGrade,
  TRIAL_DAYS,
} from "@/lib/anonTrial";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { ArrowRight, Check, Sparkles, BookOpen, Heart } from "lucide-react";
import { InviteParentDialog } from "@/components/InviteParentDialog";
import { LandingNav } from "@/pages/LandingNav";
import { BackButton } from "@/components/BackButton";
import { pad } from "@/lib/czechGrammar";
import type { TopicMetadata } from "@/lib/types";

/**
 * Žákovský dashboard pro anonymního (nepřihlášeného) uživatele.
 *
 * Dva režimy podle trial stavu (viz @/lib/anonTrial):
 * - Den 1-14: FullStudentDashboard — plný přístup, doporučení + vlastní výběr
 * - Den 15+: FreemiumStudentDashboard — jen 3 denní úkoly + CTA k registraci
 */
export default function AnonStudentPage() {
  const navigate = useNavigate();
  // Single source of truth — trial state má přednost, fallback na legacy localStorage
  const gradeOrNull = getCurrentAnonGrade();
  const anonGradeRaw = gradeOrNull !== null ? String(gradeOrNull) : null;
  const grade = gradeOrNull ?? NaN;

  // session mode — zobrazí SessionView pro vybraný topic / volný browse
  const [sessionMode, setSessionMode] = useState(false);
  // refresh trigger po dokončení úkolu (re-read localStorage)
  const [refreshTick, setRefreshTick] = useState(0);
  // invite parent dialog
  const [showInviteParent, setShowInviteParent] = useState(false);

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

  if (!anonGradeRaw || isNaN(grade)) return null;

  // ── Session mode (spuštění daily tasku nebo volného browseru) ─────────────
  if (sessionMode) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-violet-50 border-b border-violet-100 px-4 py-2 text-sm text-violet-700 flex items-center justify-between gap-4 shrink-0">
          <BackButton size="sm" label="Zpět na dashboard" onClick={() => setSessionMode(false)} />
          <span className="text-xs text-violet-500">Anonymní mód</span>
        </div>
        <div className="flex-1">
          <SessionView />
        </div>
      </div>
    );
  }

  // ── Trial state ───────────────────────────────────────────────────────────
  const trialActive = isTrialActive();
  const trialExpired = isTrialExpired();
  const daysRemaining = getTrialDaysRemaining();
  const currentDay = getTrialCurrentDay();

  const handleStartTopic = (topicId: string) => {
    sessionStorage.setItem("oli_anon_start_topic", topicId);
    setSessionMode(true);
  };

  const handleBrowseAll = () => {
    // Bez preset topicu — SessionView zobrazí TopicBrowser
    sessionStorage.removeItem("oli_anon_start_topic");
    setSessionMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      <LandingNav />

      {/* Top banner — trial progress nebo anon hint */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {trialActive ? (
          <div className="rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-[1.5px] shadow-lg shadow-violet-200">
            <div className="rounded-2xl bg-white/95 backdrop-blur px-5 py-3 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-800">Den {currentDay}</span>
                    <span className="text-xs text-slate-500">z {TRIAL_DAYS}</span>
                    <span className="text-xs text-violet-600 font-medium ml-1">— plný přístup zdarma</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full max-w-xs rounded-full bg-violet-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                      style={{ width: `${(currentDay / TRIAL_DAYS) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowInviteParent(true)}
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                <Heart className="h-3.5 w-3.5 fill-current" />
                Sdílet s rodiči
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-violet-200 shadow-md px-5 py-3 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <BookOpen className="h-4.5 w-4.5 text-violet-600" />
              </div>
              <div className="text-sm text-slate-600 leading-snug">
                <span className="font-semibold text-slate-800">Procvičuješ jako host.</span>{" "}
                <span className="text-slate-500">Pokrok se uloží jen v tomto prohlížeči.</span>
              </div>
            </div>
            <button
              onClick={() => setShowInviteParent(true)}
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              Sdílet s rodiči
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Subheader — ročník + změna */}
        <header className="flex items-center justify-between pt-2 gap-3 text-sm">
          <BackButton to="/onboarding" label="Změnit ročník" size="sm" />
          <div className="text-violet-600 font-semibold">{grade}. ročník</div>
        </header>

        {/* Content fallback banner — pokud ročník nemá vlastní obsah */}
        {(() => {
          const warning = getContentWarning(grade);
          return warning ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
              <span className="shrink-0">🚧</span>
              <span>{warning}</span>
            </div>
          ) : null;
        })()}

        {/* Trial expired CTA — jasná zpráva */}
        {trialExpired && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 space-y-2">
            <p className="font-bold text-amber-900 text-lg">Tvých {TRIAL_DAYS} dní skončilo.</p>
            <p className="text-sm text-amber-800">
              Pokračuj v 3 úkolech denně — <strong>zdarma navždy</strong>.<br />
              Pro plný přístup ti rodič může založit účet.
            </p>
            <button
              onClick={() => setShowInviteParent(true)}
              className="mt-2 text-sm font-semibold text-amber-900 hover:underline"
            >
              👪 Chci plný přístup — řekni rodičům →
            </button>
          </div>
        )}

        {/* Trial active: FullStudentDashboard */}
        {trialActive && (
          <>
            <section className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-violet-900">Dnes ti Oli doporučuje</h1>
                <p className="text-violet-700/70 mt-1">
                  3 cvičení pro {grade}. ročník — {pad(daysRemaining, "DEN")} přístupu zdarma
                </p>
              </div>
              <DailyTaskList topics={dailyTopics} onStart={handleStartTopic} />
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-violet-900">Nebo si vyber vlastní téma</h2>
              <button
                onClick={handleBrowseAll}
                className="w-full flex items-center justify-between rounded-2xl bg-white border-2 border-violet-200 hover:border-violet-400 hover:shadow-md p-5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 ring-4 ring-violet-100 flex items-center justify-center shadow-sm">
                    <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Procházet všechny předměty</p>
                    <p className="text-xs text-gray-500 mt-0.5">Matematika, čeština, prvouka a další</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-violet-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </>
        )}

        {/* Trial expired: FreemiumStudentDashboard — jen 3 denní úkoly */}
        {trialExpired && (
          <section className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-violet-900">Dnešní úkoly</h1>
              <p className="text-violet-700/70 mt-1">3 cvičení zdarma každý den</p>
            </div>
            <DailyTaskList topics={dailyTopics} onStart={handleStartTopic} />
          </section>
        )}

        {/* Nenápadné tlačítko "Sdílet pokrok s rodiči" */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowInviteParent(true)}
            className="text-sm text-gray-400 hover:text-violet-600 transition-colors"
          >
            👪 Sdílet pokrok s rodiči
          </button>
        </div>

        {/* CTA po splnění všech 3 (freemium mode) */}
        {trialExpired && allTasksCompleted() && (
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

      {showInviteParent && (
        <InviteParentDialog
          onClose={() => setShowInviteParent(false)}
          anonGrade={grade}
        />
      )}
    </div>
  );
}

// ── Pomocná komponenta — seznam denních úkolů (reuse v obou režimech) ────────

interface DailyTaskListProps {
  topics: { topic: TopicMetadata; completed: boolean; score?: number }[];
  onStart: (topicId: string) => void;
}

function DailyTaskList({ topics, onStart }: DailyTaskListProps) {
  return (
    <div className="space-y-3">
      {topics.map(({ topic, completed }) => {
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
                onClick={() => onStart(topic.id)}
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 text-white px-4 py-2 text-sm font-semibold hover:bg-violet-700 active:scale-95 transition-all shrink-0"
              >
                Začít <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
