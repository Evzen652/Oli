import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionView } from "@/components/SessionView";
import { getAllTopics } from "@/lib/contentRegistry";
import { getTodayProgress, allTasksCompleted, markTaskCompleted } from "@/lib/anonProgress";
import { serverGetProgress } from "@/lib/anonServerSync";
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
import { getDisplayCategory } from "@/lib/displayNames";
import { IllustrationImg } from "@/components/IllustrationImg";
import { ArrowRight, Check, Sparkles, Heart, BookOpen } from "lucide-react";
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

  // Fáze 3c: obnova pokroku ze serveru po smazání localStorage (stejný token).
  // Spustí se jen když dnešní localStorage nemá žádné splněné úkoly.
  useEffect(() => {
    if (isNaN(grade) || grade < 1 || grade > 9) return;
    const local = getTodayProgress(grade);
    if (local.tasks.some((t) => t.completed)) return; // localStorage je aktuální
    const todayIds = new Set(local.tasks.map((t) => t.topicId));
    let cancelled = false;
    serverGetProgress().then((server) => {
      if (cancelled || server.length === 0) return;
      let restored = 0;
      for (const item of server) {
        if (item.completed && todayIds.has(item.topic_id)) {
          markTaskCompleted(item.topic_id, item.score ?? 1);
          restored++;
        }
      }
      if (restored > 0) setRefreshTick((t) => t + 1);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  // "Zpět" z nejvyšší úrovně TopicBrowseru → zpět na dashboard (doporučení)
  useEffect(() => {
    const handler = () => setSessionMode(false);
    window.addEventListener("oli-anon-exit-session", handler);
    return () => window.removeEventListener("oli-anon-exit-session", handler);
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
                    <span className="text-xs text-violet-600 font-medium ml-1">— 1 okruh v každém předmětu zdarma</span>
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
                  {pad(dailyTopics.length, "CVIČENÍ")} pro {grade}. ročník — {pad(daysRemaining, "DEN")} přístupu zdarma
                </p>
              </div>
              <DailyTaskList topics={dailyTopics} onStart={handleStartTopic} grade={grade} />
            </section>

            <section className="space-y-3 pt-6 border-t-2 border-violet-600">
              <h2 className="text-xl font-bold text-violet-900">Nebo si vyber vlastní téma</h2>
              <SubjectGrid grade={grade} onSelect={(subject) => {
                sessionStorage.setItem("oli_anon_browse_subject", subject);
                sessionStorage.removeItem("oli_anon_start_topic");
                setSessionMode(true);
              }} />
            </section>
          </>
        )}

        {/* Trial expired: FreemiumStudentDashboard — jen 3 denní úkoly */}
        {trialExpired && (
          <section className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-violet-900">Dnešní úkoly</h1>
              <p className="text-violet-700/70 mt-1">{pad(dailyTopics.length, "CVIČENÍ")} zdarma každý den</p>
            </div>
            <DailyTaskList topics={dailyTopics} onStart={handleStartTopic} grade={grade} />
          </section>
        )}

        {/* Vstupy pro rodiče — dítě sdílí pozvánku, nebo rodič jde rovnou na účet */}
        <div className="text-center pt-2 space-y-1.5">
          <button
            onClick={() => setShowInviteParent(true)}
            className="block mx-auto text-sm text-gray-400 hover:text-violet-600 transition-colors"
          >
            👪 Sdílet pokrok s rodiči
          </button>
          <a
            href="/auth?mode=register"
            className="block text-sm text-gray-400 hover:text-violet-600 transition-colors"
          >
            Jsem rodič — založit účet →
          </a>
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
  grade: number;
}

function DailyTaskList({ topics, onStart, grade }: DailyTaskListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {topics.map(({ topic, completed }) => {
        const meta = getSubjectMeta(topic.subject);
        const title = topic.displayName ?? topic.studentTitle ?? topic.title;
        return (
          <div
            key={topic.id}
            className={`group aspect-square flex flex-col rounded-3xl p-6 transition-all ${
              completed
                ? "bg-emerald-50 border-2 border-emerald-200"
                : "bg-white border-2 border-violet-100 hover:border-violet-300 hover:shadow-md hover:-translate-y-0.5"
            }`}
          >
            <div className="flex-1 flex items-center justify-center min-h-0">
              <IllustrationImg
                src={meta.image}
                className="h-28 w-28 object-contain mix-blend-multiply"
                fallback={<span className="text-6xl">{meta.emoji}</span>}
              />
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-baseline gap-1 flex-wrap leading-tight">
                  <span className={`text-sm font-bold ${meta.color}`}>{meta.label}</span>
                  {topic.category && (
                    <>
                      <span className={`text-sm font-bold ${meta.color}`}>|</span>
                      <span className={`text-sm font-bold ${meta.color}`}>
                        {getDisplayCategory(topic.category, grade as Parameters<typeof getDisplayCategory>[1])}
                      </span>
                    </>
                  )}
                </div>
                <p className="font-bold text-gray-900 text-base leading-tight">{title}</p>
              </div>
              {completed ? (
                <span className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold text-sm py-2">
                  <Check className="h-4 w-4" /> Splněno
                </span>
              ) : (
                <button
                  onClick={() => onStart(topic.id)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 text-white px-3 py-2.5 text-sm font-semibold hover:bg-violet-700 active:scale-95 transition-all"
                >
                  Začít <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SubjectGrid({ grade, onSelect }: { grade: number; onSelect: (subject: string) => void }) {
  const topicsForGrade = useMemo(
    () => getAllTopics().filter((t) => t.gradeRange[0] <= grade && t.gradeRange[1] >= grade),
    [grade],
  );
  const subjects = useMemo(() => [...new Set(topicsForGrade.map((t) => t.subject))], [topicsForGrade]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {subjects.map((subject) => {
        const meta = getSubjectMeta(subject);
        const categories = [...new Set(topicsForGrade.filter((t) => t.subject === subject).map((t) => t.category))];
        return (
          <button
            key={subject}
            onClick={() => onSelect(subject)}
            className="group aspect-square flex flex-col items-center justify-center gap-3 rounded-3xl bg-white border-2 border-violet-100 hover:border-violet-400 hover:shadow-md hover:-translate-y-0.5 p-6 transition-all"
          >
            <IllustrationImg
              src={meta.image}
              className="h-36 w-36 object-contain"
              fallback={<span className="text-8xl">{meta.emoji}</span>}
            />
            <p className={`text-2xl font-bold text-center ${meta.color}`}>{meta.label}</p>
          </button>
        );
      })}
    </div>
  );
}
