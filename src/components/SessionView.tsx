import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { PracticeTask, SessionState } from "@/lib/types";
import { getFullTopicTitle } from "@/lib/types";
import { getDisplayTopic, getDisplayCategory } from "@/lib/displayNames";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { GradeSelect } from "@/components/GradeSelect";
import { TopicBrowser } from "@/components/TopicBrowser";
import { ChildHomePage } from "@/components/ChildHomePage";
import { DiktatFilterSelect } from "@/components/DiktatFilterSelect";
import { HelpButton } from "@/components/HelpButton";
import { TutorChat } from "@/components/TutorChat";
import { FEATURES } from "@/lib/features";
import { MiniExplainer } from "@/components/MiniExplainer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { SessionTimer } from "@/components/SessionTimer";
import { PracticeInputRouter } from "@/components/PracticeInputRouter";
import { CheckFeedbackCard } from "@/components/CheckFeedbackCard";
import { SessionEndSummary } from "@/components/SessionEndSummary";
import { useSessionDispatch, TERMINAL_STATES } from "@/hooks/useSessionDispatch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { FractionBarVisual } from "@/components/FractionBarVisual";
import { getTopicIllustrationUrl } from "@/lib/prvoukaVisuals";
import { getCategoryInfo } from "@/lib/categoryInfo";
import { getPersistedSession, clearPersistedSession } from "@/hooks/useSessionPersistence";
import { SessionRecoveryDialog } from "@/components/SessionRecoveryDialog";
import goodToKnowImg from "@/assets/good-to-know.png";
import { useT } from "@/lib/i18n";
import { LogOut, Eye } from "lucide-react";
import { DewhiteImg } from "@/components/DewhiteImg";
import { LandingNav } from "@/pages/LandingNav";
import { OlyLogo, logoNoText } from "@/components/OlyLogo";

function ChildLoadingFallback() {
  const [showFallback, setShowFallback] = useState(false);
  const t = useT();
  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!showFallback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="pt-6 space-y-4">
          <p className="text-muted-foreground">Tvůj účet ještě není propojený s rodičem.</p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            {t("session.sign_out")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const STATE_LABELS: Record<SessionState, string> = {
  INIT: "Inicializace",
  INPUT_CAPTURE: "Zadání problému",
  PRE_INTENT: "Rozpoznání záměru",
  TOPIC_MATCH: "Hledání tématu",
  EXPLAIN: "Vysvětlení",
  PRACTICE: "Procvičování",
  CHECK: "Kontrola",
  STOP_1: "Zjednodušení",
  STOP_2: "Ukončení",
  END: "Konec",
};

/** Get subject accent color class */
function getSubjectColor(subject?: string): { bg: string; border: string; badge: string; accent: string } {
  switch (subject) {
    case "matematika":
      return { bg: "from-blue-50 to-blue-100/50", border: "border-l-blue-400", badge: "bg-blue-100 text-blue-700 border-blue-200", accent: "bg-blue-400" };
    case "čeština":
      return { bg: "from-purple-50 to-purple-100/50", border: "border-l-purple-400", badge: "bg-purple-100 text-purple-700 border-purple-200", accent: "bg-purple-400" };
    case "prvouka":
      return { bg: "from-green-50 to-green-100/50", border: "border-l-green-400", badge: "bg-green-100 text-green-700 border-green-200", accent: "bg-green-400" };
    default:
      return { bg: "from-secondary to-secondary/50", border: "border-l-primary", badge: "bg-secondary text-secondary-foreground", accent: "bg-primary" };
  }
}

/** Vrátí dětský název tématu — pro student view, jinak RVP */
function getChildTopicTitle(topic: { topic: string; title: string; displayName?: string }, grade: number | null, isStudentView: boolean): string {
  if (!isStudentView) return getFullTopicTitle(topic as any);
  const g = grade ?? 4;
  const displayGroup = getDisplayTopic(topic.topic ?? "", g as any);
  const displaySub = topic.displayName ?? topic.title ?? "";
  if (!displaySub || topic.topic === topic.title) return displayGroup;
  const sub = displaySub.charAt(0).toLowerCase() + displaySub.slice(1);
  return `${displayGroup} – ${sub}`;
}

export function SessionView() {
  const t = useT();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role, loading: roleLoading } = useUserRole();
  // Anonymní trial-active uživatel = student view (ChildHomePage místo TopicBrowser)
  const isAnonTrial = pathname === "/student" && !!localStorage.getItem("oli_anon_trial");
  const isStudentView = role === "child" || (role === "admin" && pathname === "/student") || isAnonTrial;
  const s = useSessionDispatch();
  const {
    grade, session, practiceQuestion, userInput, isLocked, loading,
    checkFeedback, lastAnswerCorrect, revealedAnswer, answeredTask,
    questionTitle, taskResults, pendingDiktatTopic,
  } = s;

  // For child role: show ChildHomePage by default, TopicBrowser on demand
  const [showTopicBrowser, setShowTopicBrowser] = useState(false);
  const [topicBrowserSubject, setTopicBrowserSubject] = useState<string | undefined>(undefined);

  // Anon mód: auto-start topicu zvoleného v AnonStudentPage (předaný přes sessionStorage)
  useEffect(() => {
    if (session || !grade) return;
    const startTopicId = sessionStorage.getItem("oli_anon_start_topic");
    if (!startTopicId) return;
    sessionStorage.removeItem("oli_anon_start_topic");
    // Najdi topic v code registry a spusť ho
    import("@/lib/contentRegistry").then(({ getAllTopics }) => {
      const topic = getAllTopics().find((t) => t.id === startTopicId);
      if (topic) s.handleTopicSelect(topic);
    });
    // session, grade jsou jen guardy — spusť jen jednou po mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Session recovery from localStorage
  const [recoveryData, setRecoveryData] = useState<ReturnType<typeof getPersistedSession>>(null);
  const [recoveryChecked, setRecoveryChecked] = useState(false);

  // For paired children: auto-load grade from children table
  const [childGradeLoaded, setChildGradeLoaded] = useState(false);
  const [isDemoChild, setIsDemoChild] = useState(false);
  useEffect(() => {
    if (role === "child" && !grade && !childGradeLoaded) {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        if (user.id === "705f7c4a-9f32-4efb-9c55-e8043f0ede5e") setIsDemoChild(true);
        const { data } = await supabase
          .from("children")
          .select("grade")
          .eq("child_user_id", user.id)
          .maybeSingle();
        if (data?.grade) {
          s.handleGradeSelect(data.grade as any);
        }
        setChildGradeLoaded(true);
      })();
    }
  }, [role, grade, childGradeLoaded]);

  useEffect(() => {
    if (!recoveryChecked && !session && !grade) {
      const persisted = getPersistedSession();
      if (persisted) {
        setRecoveryData(persisted);
      }
      setRecoveryChecked(true);
    }
  }, [recoveryChecked, session, grade]);

  // Admin: auto-select grade 3 if none set, skip GradeSelect entirely
  useEffect(() => {
    if (role === "admin" && !grade) {
      s.handleGradeSelect(3 as any);
    }
  }, [role, grade]);

  // Admin floating banner component with grade dropdown
  const GRADES = [3, 4, 5, 6, 7, 8, 9];
  const AdminBanner = role === "admin" ? (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur text-primary-foreground px-5 py-2.5 flex items-center justify-between text-sm shadow-soft-2">
      <div className="flex items-center gap-3">
        <span className="font-medium inline-flex items-center gap-2">
          <Eye className="h-3.5 w-3.5" />
          Náhled žákovského pohledu
        </span>
        <select
          value={grade ?? 3}
          onChange={(e) => {
            s.setGrade(null);
            s.setSession(null as any);
            setTimeout(() => s.handleGradeSelect(Number(e.target.value) as any), 0);
          }}
          className="h-7 rounded-full bg-white/15 border border-white/20 text-primary-foreground text-xs px-3 cursor-pointer font-medium"
        >
          {GRADES.map(g => (
            <option key={g} value={g} className="text-foreground bg-background">{g}. ročník</option>
          ))}
        </select>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="h-7 text-xs rounded-full bg-white/15 hover:bg-white/25 text-primary-foreground border border-white/20"
        onClick={() => navigate("/admin")}
      >
        ← Zpět do Adminu
      </Button>
    </div>
  ) : null;

  if (!grade && roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!grade) {
    // Children never see grade select – grade comes from children table
    if (role === "child") {
      return <ChildLoadingFallback />;
    }

    // Non-admin, non-child: show grade select (parent fallback)
    if (role !== "admin") {
      return (
        <>
          <SessionRecoveryDialog
            open={!!recoveryData}
            topicTitle={recoveryData?.session?.matchedTopic ? getFullTopicTitle(recoveryData.session.matchedTopic) : ""}
            onRecover={() => {
              if (recoveryData) {
                s.setGrade(recoveryData.session.grade);
                s.setSession(recoveryData.session);
                setRecoveryData(null);
              }
            }}
            onDiscard={() => {
              clearPersistedSession();
              setRecoveryData(null);
            }}
          />
          <GradeSelect onSelect={s.handleGradeSelect} />
        </>
      );
    }

    // Admin: loading state while grade auto-sets
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!session && pendingDiktatTopic) {
    return (
      <DiktatFilterSelect
        onConfirm={s.handleDiktatFilterConfirm}
        onBack={() => s.setPendingDiktatTopic(null)}
      />
    );
  }

  const DemoHeader = isDemoChild ? (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-soft-2">
      <div className="bg-[#F97316] text-white px-5 py-2 text-sm text-center font-medium">
        Demo — prohlídka bez registrace
      </div>
      <LandingNav />
    </div>
  ) : null;

  const DemoChildSwitcher = isDemoChild ? (
    <div className="grid sm:grid-cols-2 gap-4 mx-auto max-w-5xl px-4 pt-6 sm:px-8">
      <button
        className="rounded-3xl border-2 border-blue-200 bg-blue-50/60 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg p-6 flex items-center gap-4 text-left transition-all active:scale-[0.98]"
        onClick={async () => {
          await supabase.auth.signInWithPassword({ email: "demo@oli.app", password: "Demo123demo" });
          window.location.href = "/parent";
        }}
      >
        <DewhiteImg
          src="https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/topic-rodina-a-spolecnost.png"
          alt=""
          className="h-16 w-16 object-contain drop-shadow-md shrink-0"
          threshold={240}
        />
        <div className="flex-1">
          <p className="font-bold text-lg text-blue-900">Jsem rodič</p>
          <p className="text-xs text-blue-600 mt-0.5">Přepnout na rodičovský pohled →</p>
        </div>
      </button>
      <div className="rounded-3xl border-2 border-orange-300 bg-orange-50/80 p-6 flex items-center gap-4">
        <DewhiteImg
          src="https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/ui-child-desk.png"
          alt=""
          className="h-16 w-16 object-contain drop-shadow-md shrink-0"
          threshold={240}
        />
        <div>
          <p className="font-bold text-lg text-orange-900">Jsem žák</p>
          <p className="text-xs text-orange-600 mt-0.5">Aktuální pohled</p>
        </div>
      </div>
    </div>
  ) : null;

  if (!session) {
    // Child role: show home page with assignments first
    if (isStudentView && !showTopicBrowser) {
      return (
        <>
          {DemoHeader}
          {AdminBanner}
          <div style={isDemoChild ? { paddingTop: "7rem" } : role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
            {DemoChildSwitcher}
            <ChildHomePage
              grade={grade}
              onSelectTopic={s.handleTopicSelect}
              onBrowseTopics={(subject?: string) => { setTopicBrowserSubject(subject); setShowTopicBrowser(true); }}
            />
          </div>
        </>
      );
    }
    return (
      <>
        {DemoHeader}
        {AdminBanner}
        <TopicBrowser grade={grade} onSelectTopic={s.handleTopicSelect} onBack={() => {
          if (isStudentView) {
            setShowTopicBrowser(false);
            setTopicBrowserSubject(undefined);
          } else {
            s.setGrade(null);
          }
        }} isAdmin={role === "admin" && !isStudentView} initialSubject={topicBrowserSubject} />
      </>
    );
  }

  const isTerminal = TERMINAL_STATES.includes(session.state);
  const showTextInput = !isTerminal && !isLocked && session.state === "INPUT_CAPTURE";
  const showPracticeInput = !isTerminal && !isLocked && session.state === "PRACTICE" && !checkFeedback && !revealedAnswer;
  const currentTask: PracticeTask | undefined = session.practiceBatch[session.currentTaskIndex];
  const subjectColors = getSubjectColor(session.matchedTopic?.subject);

  const isPracticeBg = isTerminal || session.state === "PRACTICE" || session.state === "EXPLAIN";

  return (
    <div
      className={`flex min-h-screen flex-col ${isPracticeBg ? "bg-gradient-to-br from-violet-50 via-white to-fuchsia-50" : "bg-background"}`}
      style={role === "admin" ? { paddingTop: "2.5rem" } : undefined}
    >
      {AdminBanner}
      {/* Header — Zpět vlevo (skryto v anon — vnější wrapper má vlastní), logo + název uprostřed */}
      <header className="sticky top-0 z-30 border-b border-slate-100/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Levá: Zpět — skryto v anon trial (vnější wrapper poskytuje navigaci zpět) */}
          {!isAnonTrial && (
            <Button
              variant="ghost"
              size="sm"
              onClick={s.handleReset}
              className="text-sm rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0"
              title={t("session.back")}
            >
              ← {t("session.back")}
            </Button>
          )}

          {/* Střed: Oli logo + název tématu */}
          <div className="flex-1 min-w-0 flex items-center justify-center gap-2 sm:gap-3">
            <OlyLogo size="xs" onClick={s.handleReset} />
            {session.matchedTopic && (
              <span className="hidden sm:inline text-sm font-semibold text-slate-700 truncate">
                · {getChildTopicTitle(session.matchedTopic, grade, isStudentView)}
              </span>
            )}
          </div>

          {/* Pravá: timer + admin akce */}
          <div className="flex items-center gap-2 shrink-0">
            {!isTerminal && !isStudentView && (
              <div className="hidden md:block w-40">
                <SessionTimer
                  startTime={session.startTime}
                  maxSeconds={session.rules.maxDurationSeconds}
                  isActive={!isLocked}
                  onTimeExpired={s.handleTimeExpired}
                  countUp={isStudentView}
                />
              </div>
            )}
            {!isStudentView && (
              <a href="/report" className="hidden md:inline text-sm text-slate-500 hover:text-slate-900">
                Report
              </a>
            )}
            {!isStudentView && (
              <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()} title={t("session.sign_out")} className="text-sm rounded-full">
                {t("session.sign_out")}
              </Button>
            )}
          </div>
        </div>
        {/* Mobile: název tématu pod logem */}
        {session.matchedTopic && (
          <div className="sm:hidden px-4 pb-2 text-center">
            <p className="text-xs font-semibold text-slate-600 truncate">
              {getChildTopicTitle(session.matchedTopic, grade, isStudentView)}
            </p>
          </div>
        )}
      </header>

      <main className="flex flex-1 flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-5xl flex gap-6 pt-2 pb-8">
          {/* Oli mascot + chat bublina vlevo — jen desktop, jen PRACTICE */}
          {session.matchedTopic && session.state === "PRACTICE" && !checkFeedback && !revealedAnswer && (
            <aside className="hidden lg:flex flex-col items-center w-44 shrink-0 pt-12">
              <img
                src={logoNoText}
                alt=""
                className="h-32 w-32 object-contain drop-shadow-md"
              />
              <div className="relative mt-4 rounded-2xl bg-white border border-violet-100 shadow-sm px-4 py-3 text-center">
                <p className="text-sm font-bold text-slate-900">Ahoj!</p>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Společně to zvládneme. 💜
                </p>
                {/* Trojúhelník bubliny směrem nahoru k sově */}
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-violet-100 rotate-45" />
              </div>
            </aside>
          )}

          {/* Hlavní obsah */}
          <div className="flex-1 min-w-0 flex flex-col space-y-5 max-w-2xl mx-auto lg:mx-0">
          {/* Topic hero karta */}
          {session.matchedTopic && !isTerminal && (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-3xl bg-white border border-violet-100 shadow-sm p-5 sm:p-6">
                {/* Jemný gradient akcent v rohu */}
                <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br from-violet-100/60 to-fuchsia-100/40 blur-2xl pointer-events-none" />
                <div className="relative flex items-center gap-4 sm:gap-5">
                  {(() => {
                    const illUrl = getTopicIllustrationUrl(session.matchedTopic);
                    return illUrl ? (
                      <div className="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center ring-4 ring-white shadow-sm">
                        <img src={illUrl} alt="" className="h-12 w-12 sm:h-14 sm:w-14 object-contain mix-blend-multiply" />
                      </div>
                    ) : null;
                  })()}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                      {getChildTopicTitle(session.matchedTopic, grade, isStudentView)}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                      {session.matchedTopic.briefDescription}
                    </p>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-base border-2 gap-2 px-5 py-3.5 h-auto rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                  >
                    💡 {t("session.good_to_know")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0">
                  <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                    <div className="flex items-center gap-4">
                      <img src={goodToKnowImg} alt="Co je dobré vědět" className="w-12 h-12 object-contain shrink-0 mix-blend-multiply" />
                      <DialogTitle className="text-xl text-left">{getChildTopicTitle(session.matchedTopic, grade, isStudentView)}</DialogTitle>
                    </div>
                  </DialogHeader>
                  <ScrollArea className="flex-1 px-6 pb-6">
                    <div className="space-y-6 text-base pt-4">
                      <p className="text-muted-foreground">{session.matchedTopic.briefDescription}</p>
                      <div className="rounded-md bg-secondary p-5 space-y-3">
                        <p className="font-semibold text-foreground text-lg">{t("session.how_to")}</p>
                        <p>{session.matchedTopic.helpTemplate.hint}</p>
                        {session.matchedTopic.helpTemplate.steps.length > 0 && (
                          <ol className="list-decimal list-inside space-y-2">
                            {session.matchedTopic.helpTemplate.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        )}
                      </div>
                      {session.matchedTopic.helpTemplate.visualExamples && session.matchedTopic.helpTemplate.visualExamples.length > 0 && (
                        <div className="space-y-3">
                          <p className="font-semibold text-foreground text-lg">{t("session.visual_examples")}</p>
                          {(() => {
                            const examples = session.matchedTopic!.helpTemplate.visualExamples!;
                            const hasStrings = examples.some((ex) => typeof ex === "string");
                            if (hasStrings) {
                              return (
                                <div className="rounded-lg border-2 bg-secondary/50 p-4">
                                  <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground leading-relaxed">
                                    {examples.filter((ex) => typeof ex === "string").join("\n\n")}
                                  </pre>
                                </div>
                              );
                            }
                            return examples.map((ex: any, i: number) => (
                              <div key={i} className="rounded-lg border-2 bg-secondary/50 p-4 space-y-3">
                                <p className="font-medium text-sm text-foreground">{ex.label}</p>
                                {ex.fractionBars ? (
                                  <FractionBarVisual bars={ex.fractionBars} conclusion={ex.conclusion} />
                                ) : ex.illustration ? (
                                  <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground leading-relaxed">
                                    {ex.illustration}
                                  </pre>
                                ) : null}
                              </div>
                            ));
                          })()}
                        </div>
                      )}
                      <div className="rounded-md bg-secondary p-5 space-y-2">
                        <p className="font-semibold text-foreground">{t("session.example_label")}</p>
                        <p>{session.matchedTopic.helpTemplate.example}</p>
                      </div>
                      <div className="rounded-md border-2 border-destructive/30 bg-destructive/5 p-5 space-y-2">
                        <p className="font-semibold text-foreground">{t("session.common_mistake")}</p>
                        <p className="text-muted-foreground">{session.matchedTopic.helpTemplate.commonMistake}</p>
                      </div>
                      {(() => {
                        const catInfo = getCategoryInfo(session.matchedTopic!.subject, session.matchedTopic!.category, session.matchedTopic!.topic);
                        return catInfo?.funFact ? (
                          <div className="rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-5 space-y-2">
                            <p className="font-semibold text-amber-900 text-lg">{t("session.fun_fact")}</p>
                            <p className="text-amber-800 italic">{catInfo.funFact}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Question card (EXPLAIN / PRACTICE without feedback) */}
          {session.state !== "INPUT_CAPTURE" && !isTerminal && !checkFeedback && (
            <Card className="border-0 rounded-3xl overflow-hidden bg-white shadow-md ring-1 ring-violet-100">
              <CardContent className="p-6 sm:p-7">
                {session.state === "EXPLAIN" && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">{t("session.explain.title")}</h2>
                    <p className="mt-2 text-base text-slate-500 leading-relaxed">
                      {session.errorCount > 0
                        ? t("session.explain.errors")
                        : t("session.explain.intro")}
                    </p>
                    {session.matchedTopic && (
                      <div className="rounded-2xl bg-violet-50 border border-violet-100 p-5 text-base text-slate-700 space-y-3 mt-4">
                        <p>{session.matchedTopic.helpTemplate.hint}</p>
                        {session.matchedTopic.helpTemplate.steps.length > 0 && (
                          <ol className="list-decimal list-inside space-y-1">
                            {session.matchedTopic.helpTemplate.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        )}
                        <p><span className="font-semibold text-slate-900">{t("session.example_label")}</span> {session.matchedTopic.helpTemplate.example}</p>
                      </div>
                    )}
                    <p className="mt-4 text-base text-slate-500">{t("session.explain.one_way")}</p>
                  </>
                )}
                {session.state === "PRACTICE" && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 text-violet-700 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                      <span aria-hidden>🎯</span> {questionTitle}
                    </span>
                  </div>
                )}
                {practiceQuestion && (
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {practiceQuestion}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Check feedback */}
          {checkFeedback && (
            <CheckFeedbackCard
              checkFeedback={checkFeedback}
              lastAnswerCorrect={lastAnswerCorrect}
              answeredTask={answeredTask}
              topic={session.matchedTopic}
              subjectColors={subjectColors}
              loading={loading}
              isTerminal={isTerminal}
              onContinue={s.handleContinueAfterCheck}
            />
          )}

          {/* EXPLAIN → PRACTICE */}
          {session.state === "EXPLAIN" && !isLocked && !checkFeedback && (
            <div className="space-y-4 text-center">
              <p className="text-base text-muted-foreground">{t("session.explain.ready")}</p>
              <Button onClick={s.handleExplainContinue} disabled={loading} className="w-full text-lg h-12 rounded-xl">
                {loading ? t("session.processing") : session.errorCount > 0 ? t("session.explain.try_again") : t("session.explain.try")}
              </Button>
            </div>
          )}

          {/* Mini-vysvětlení s vizuálem (Fáze 10) */}
          {showPracticeInput && session.matchedTopic && (
            <MiniExplainer topic={session.matchedTopic} resetKey={currentTask?.question} />
          )}

          {/* PRACTICE: Dynamic input */}
          {showPracticeInput && session.matchedTopic && (
            <PracticeInputRouter
              topic={session.matchedTopic}
              currentTask={currentTask}
              userInput={userInput}
              loading={loading}
              onUserInputChange={s.setUserInput}
              onAnswerSubmit={s.handleAnswerSubmit}
              onTextSubmit={s.handleTextSubmit}
            />
          )}

          {/* Help button */}
          {showPracticeInput && session.matchedTopic && (
            <HelpButton
              skillId={session.matchedTopic.id}
              topic={session.matchedTopic}
              currentTask={currentTask ?? null}
              onHelpOpened={() => {
                if (!session.helpUsedOnCurrent) {
                  s.setSession(prev => prev ? { ...prev, helpUsedOnCurrent: true } : prev);
                }
              }}
            />
          )}

          {/* Konverzační tutor — Fáze 7 — skryto: FEATURES.studentChat = false pro grade 1-7 */}
          {showPracticeInput && session.matchedTopic && FEATURES.studentChat && (
            <TutorChat
              topic={session.matchedTopic}
              currentTask={currentTask ?? null}
              phase="practice"
            />
          )}

          {/* Revealed answer */}
          {revealedAnswer && session.state === "PRACTICE" && !checkFeedback && (
            <div className="space-y-5">
              <Card className="border-2 rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <p className="text-lg font-medium text-foreground">
                    {t("session.correct_answer")}<span className="font-bold">{revealedAnswer.answer}</span>
                  </p>
                  <p className="text-base text-muted-foreground">{revealedAnswer.hint}</p>
                </CardContent>
              </Card>
              <Button onClick={s.handleContinueAfterCheck} disabled={loading} className="w-full text-lg h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                {loading ? t("session.processing") : t("session.continue")}
              </Button>
            </div>
          )}

          {/* INPUT_CAPTURE */}
          {showTextInput && (
            <div className="space-y-4">
              {session.confusionCount > 0 && (
                <p className="text-base text-muted-foreground rounded-md bg-secondary p-4">
                  {t("session.input.confusion")}
                </p>
              )}
              <p className="text-xl font-medium text-foreground">
                {t("session.input.prompt")}
              </p>
              <p className="text-base text-muted-foreground">
                {t("session.input.hint")}
              </p>
              <Textarea
                placeholder={t("session.input.placeholder")}
                value={userInput}
                onChange={(e) => s.setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    s.handleInputSubmit();
                  }
                }}
                className="min-h-[100px] resize-none text-lg border-2"
              />
              <Button onClick={s.handleInputSubmit} disabled={!userInput.trim() || loading} className="w-full text-lg h-12">
                {loading ? t("session.processing") : t("session.input.submit")}
              </Button>
              {session.confusionCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => s.setUserInput("nevím")}
                  className="w-full text-base text-muted-foreground"
                >
                  {t("session.input.idk")}
                </Button>
              )}
            </div>
          )}

          {/* Terminal state — summary */}
          {isTerminal && (
            <SessionEndSummary
              session={session}
              onRepeat={() => {
                if (session.matchedTopic) {
                  const topic = session.matchedTopic;
                  s.handleReset();
                  s.setGrade(session.grade);
                  s.handleTopicSelect(topic);
                }
              }}
              onNewTopic={s.handleReset}
            />
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Progress indicator */}
          {session.matchedTopic && session.state === "PRACTICE" && session.practiceBatch.length > 0 && (
            <div className="pb-4">
              <ProgressIndicator
                current={answeredTask ? Math.max(session.currentTaskIndex - 1, 0) : session.currentTaskIndex}
                total={session.practiceBatch.length}
                results={taskResults}
              />
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}
