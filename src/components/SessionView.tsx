import { useState, useEffect, useCallback, useRef } from "react";
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
import { IllustrationImg } from "@/components/IllustrationImg";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { LandingNav } from "@/pages/LandingNav";
import { OlyLogo } from "@/components/OlyLogo";
import { BackButton } from "@/components/BackButton";

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
function getSubjectColor(subject?: string): { bg: string; border: string; cardBorder: string; badge: string; accent: string; dotAccent: string } {
  switch (subject) {
    case "matematika":
      return { bg: "from-sky-50 to-blue-100", border: "border-l-blue-400", cardBorder: "border-blue-300", badge: "bg-blue-500 text-white border-blue-600", accent: "bg-blue-500", dotAccent: "bg-blue-100 ring-2 ring-blue-400" };
    case "čeština":
      return { bg: "from-purple-100 to-purple-200", border: "border-l-purple-400", cardBorder: "border-purple-300", badge: "bg-purple-500 text-white border-purple-600", accent: "bg-purple-500", dotAccent: "bg-purple-100 ring-2 ring-purple-400" };
    case "prvouka":
      return { bg: "from-green-100 to-green-200", border: "border-l-green-400", cardBorder: "border-green-300", badge: "bg-green-500 text-white border-green-600", accent: "bg-green-500", dotAccent: "bg-green-100 ring-2 ring-green-400" };
    case "přírodověda":
      return { bg: "from-emerald-100 to-emerald-200", border: "border-l-emerald-400", cardBorder: "border-emerald-300", badge: "bg-emerald-500 text-white border-emerald-600", accent: "bg-emerald-500", dotAccent: "bg-emerald-100 ring-2 ring-emerald-400" };
    case "vlastivěda":
      return { bg: "from-amber-100 to-amber-200", border: "border-l-amber-400", cardBorder: "border-amber-300", badge: "bg-amber-500 text-white border-amber-600", accent: "bg-amber-500", dotAccent: "bg-amber-100 ring-2 ring-amber-400" };
    case "informatika":
      return { bg: "from-sky-100 to-sky-200", border: "border-l-sky-400", cardBorder: "border-sky-300", badge: "bg-sky-500 text-white border-sky-600", accent: "bg-sky-500", dotAccent: "bg-sky-100 ring-2 ring-sky-400" };
    default:
      return { bg: "from-slate-100 to-slate-200", border: "border-l-primary", cardBorder: "border-slate-300", badge: "bg-secondary text-secondary-foreground", accent: "bg-primary", dotAccent: "bg-primary/10 ring-2 ring-primary/40" };
  }
}

/** Vrátí dětský název tématu — pro student view, jinak RVP */
function getChildTopicTitle(topic: { topic: string; title: string; displayName?: string; studentTitle?: string }, grade: number | null, isStudentView: boolean): string {
  if (!isStudentView) return getFullTopicTitle(topic as any);
  // studentTitle je krátký, samostatný dětský název (např. „Násobilka 2–5") → použij přímo
  if (topic.studentTitle) return topic.studentTitle;
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
    questionTitle, questionIcon, taskResults, pendingDiktatTopic,
  } = s;

  // For child role: show ChildHomePage by default, TopicBrowser on demand
  // Anon „procházet předmět" — subject čteme synchronně při mountu (stejně jako
  // isStarting níže). Pro anon trial se TopicBrowser renderuje hned (přeskakuje
  // ChildHomePage), takže initialSubject musí být k dispozici už při prvním
  // renderu — jinak browser nastartuje na výběru předmětu místo na okruzích.
  const [showTopicBrowser, setShowTopicBrowser] = useState(
    () => !!sessionStorage.getItem("oli_anon_browse_subject"),
  );
  const [topicBrowserSubject, setTopicBrowserSubject] = useState<string | undefined>(
    () => sessionStorage.getItem("oli_anon_browse_subject") ?? undefined,
  );
  // isStarting = právě se zakládá session (z auto-startu daily tasku NEBO z kliknutí
  // na téma). Čteme sessionStorage synchronně při mountu → první render je rovnou
  // spinner, nikdy nepropliknе ChildHomePage/TopicBrowser.
  const [isStarting, setIsStarting] = useState(
    () => !!sessionStorage.getItem("oli_anon_start_topic"),
  );

  // Jakmile je session založená, vypni starting flag
  useEffect(() => {
    if (session && isStarting) setIsStarting(false);
  }, [session, isStarting]);

  // Bezpečnostní reset: pokud start doběhl (loading šel true→false) a session
  // přesto nevznikla (např. prázdné DB téma), nenech spinner viset navždy.
  // Ref zabrání spuštění při prvním tiku, než async start vůbec nastaví loading.
  const startSawLoading = useRef(false);
  useEffect(() => {
    if (isStarting && loading) startSawLoading.current = true;
    if (isStarting && startSawLoading.current && !loading && !session) {
      setIsStarting(false);
      startSawLoading.current = false;
    }
  }, [isStarting, loading, session]);

  // Anon mód: auto-start topicu nebo otevření TopicBrowseru pro předmět
  useEffect(() => {
    if (session || !grade) return;
    const startTopicId = sessionStorage.getItem("oli_anon_start_topic");
    if (startTopicId) {
      sessionStorage.removeItem("oli_anon_start_topic");
      import("@/lib/contentRegistry").then(({ getAllTopics }) => {
        const topic = getAllTopics().find((t) => t.id === startTopicId);
        if (topic) s.handleTopicSelect(topic);
      });
      return;
    }
    const browseSubject = sessionStorage.getItem("oli_anon_browse_subject");
    if (browseSubject) {
      sessionStorage.removeItem("oli_anon_browse_subject");
      setTopicBrowserSubject(browseSubject);
      setShowTopicBrowser(true);
    }
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

  // Admin: obnov naposledy testovaný ročník (zapamatovaný v localStorage), fallback 4
  useEffect(() => {
    if (role === "admin" && !grade) {
      const saved = Number(localStorage.getItem("oli_admin_preview_grade"));
      const g = saved >= 1 && saved <= 9 ? saved : 4;
      s.handleGradeSelect(g as any);
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
          value={grade ?? 4}
          onChange={(e) => {
            const g = Number(e.target.value);
            localStorage.setItem("oli_admin_preview_grade", String(g));
            s.setSession(null as any);
            // Reset výběru — jinak zůstane předmět z minulého ročníku (prázdná stránka)
            setShowTopicBrowser(false);
            setTopicBrowserSubject(undefined);
            s.handleGradeSelect(g as any);
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
    // Během zakládání session — spinner místo ChildHomePage/TopicBrowser
    // (zabrání probliknutí dashboardu při auto-startu i při kliknutí na téma)
    if (isStarting) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-muted border-t-primary animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          </div>
        </div>
      );
    }

    // Child role: show home page with assignments first (anon trial přeskočí rovnou na TopicBrowser)
    if (isStudentView && !showTopicBrowser && !isAnonTrial) {
      return (
        <>
          {DemoHeader}
          {AdminBanner}
          <div style={isDemoChild ? { paddingTop: "7rem" } : role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
            {DemoChildSwitcher}
            <ChildHomePage
              grade={grade}
              onSelectTopic={(topic) => { setIsStarting(true); s.handleTopicSelect(topic); }}
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
        <TopicBrowser
          key={grade}
          grade={grade}
          onSelectTopic={(topic) => { setIsStarting(true); s.handleTopicSelect(topic); }}
          onBack={() => {
            if (isAnonTrial) {
              // Anon: ChildHomePage je přeskočena → "zpět" na nejvyšší úrovni
              // musí zavřít celou session a vrátit na anon dashboard (doporučení).
              window.dispatchEvent(new CustomEvent("oli-anon-exit-session"));
            } else if (isStudentView) {
              setShowTopicBrowser(false);
              setTopicBrowserSubject(undefined);
            } else {
              s.setGrade(null);
            }
          }}
          isAdmin={role === "admin" && !isStudentView}
          initialSubject={topicBrowserSubject}
          anonLocked={isAnonTrial}
          onLockedClick={() => navigate("/auth?mode=register")}
        />
      </>
    );
  }

  const isTerminal = TERMINAL_STATES.includes(session.state);
  const showTextInput = !isTerminal && !isLocked && session.state === "INPUT_CAPTURE";
  const showPracticeInput = !isTerminal && !isLocked && session.state === "PRACTICE" && !checkFeedback && !revealedAnswer;
  const currentTask: PracticeTask | undefined = session.practiceBatch[session.currentTaskIndex];
  const subjectColors = getSubjectColor(session.matchedTopic?.subject);

  // Dekorace pozadí — zobrazí se jen během PRACTICE/EXPLAIN, fixní vlevo dole
  const SUPABASE_STORAGE = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images";
  const showDecor = session.state === "PRACTICE" || session.state === "EXPLAIN";

  return (
    <div className={`relative flex min-h-screen flex-col ${isTerminal || session.state === "PRACTICE" || session.state === "EXPLAIN" ? "session-bg-gradient" : "bg-background"}`} style={role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
      {/* Dekorativní ilustrace vlevo dole — fixní, jen desktop.
          Page má radial krémový gradient v levém dolním rohu (viz session-bg-gradient).
          Maska je radial fade kolem objektů (knihy + globus), krémové pozadí kresby
          se rozpustí do krémového pozadí stránky → bez viditelného přechodu. */}
      {showDecor && (
        <img
          src={`${SUPABASE_STORAGE}/practice-decor-globe.png`}
          alt=""
          aria-hidden="true"
          className="hidden lg:block fixed bottom-0 left-0 w-72 xl:w-96 h-auto object-contain pointer-events-none select-none z-0"
          style={{
            opacity: 1,
            // Radial fade kolem objektů (lampa, knihy, globus, sukulent — vystředěné lehce vlevo dole)
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 40% 70%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 90%)",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 40% 70%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 90%)",
          }}
        />
      )}

      {/* Letící kniha s pohádkovými hvězdičkami vpravo nahoře — tematický protějšek
          ke knihám+globusu vlevo dole (dole studovna, nahoře vzlétající fantazie). */}
      {showDecor && (
        <img
          src={`${SUPABASE_STORAGE}/practice-decor-flying-book.png`}
          alt=""
          aria-hidden="true"
          className="hidden lg:block fixed top-0 right-0 w-72 xl:w-96 h-auto object-contain pointer-events-none select-none z-0"
          style={{
            opacity: 0.85,
            mixBlendMode: "multiply",
            // Fade levého a spodního okraje — kresba se rozplyne do stránky
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 70% 30%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 90%)",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 70% 30%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 90%)",
          }}
        />
      )}
      {AdminBanner}
      {/* Header */}
      <header className="relative border-b px-4 pt-4 pb-3">
        <div className={`absolute top-0 left-0 right-0 h-1 ${subjectColors.accent}`} />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <OlyLogo size="sm" onClick={s.handleReset} />
        </div>
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            {!isAnonTrial && (
              <BackButton size="sm" onClick={s.handleReset} />
            )}
            {session.matchedTopic && (
              <span className="text-lg font-bold text-foreground">
                {session.matchedTopic.subject.charAt(0).toUpperCase() + session.matchedTopic.subject.slice(1)}
                <span className="font-bold"> | {session.grade}. ročník</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isTerminal && !isStudentView && (
              <div className="w-48">
                <SessionTimer
                  startTime={session.startTime}
                  maxSeconds={session.rules.maxDurationSeconds}
                  isActive={!isLocked}
                  onTimeExpired={s.handleTimeExpired}
                />
              </div>
            )}
            {!isStudentView && (
              <a href="/report" className="text-base text-muted-foreground hover:text-foreground">
                Report
              </a>
            )}
            {!isAnonTrial && (
              <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()} title={t("session.sign_out")} className="text-base">
                {t("session.sign_out")}
              </Button>
            )}
            {!isAnonTrial && (
              <Button variant="ghost" size="sm" onClick={s.handleReset} className="text-base">
                ✕
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl flex flex-col space-y-6">
          {/* Topic info */}
          {session.matchedTopic && !isTerminal && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {(() => {
                  const illUrl = getTopicIllustrationUrl(session.matchedTopic);
                  const subjectMeta = getSubjectMeta(session.matchedTopic.subject);
                  // Fallback řetěz: ilustrace tématu → ilustrace předmětu (lokální
                  // asset, existuje vždy) → emoji. Mnoho grade-N témat nemá
                  // vygenerovanou ilustraci (404) — nikdy nezobrazit rozbitou ikonu.
                  const subjectFallback = (
                    <IllustrationImg
                      src={subjectMeta.image}
                      alt=""
                      className="w-16 h-16 object-contain shrink-0 self-center"
                      fallback={<span className="text-5xl shrink-0 self-center">{subjectMeta.emoji}</span>}
                    />
                  );
                  return illUrl ? (
                    <IllustrationImg
                      src={illUrl}
                      alt=""
                      className="w-16 h-16 object-contain shrink-0 self-center"
                      fallback={subjectFallback}
                    />
                  ) : subjectFallback;
                })()}
                <div className="flex-1 space-y-1">
                  <p className="text-xl font-heading font-bold text-foreground">
                    {getChildTopicTitle(session.matchedTopic, grade, isStudentView)}
                  </p>
                  <p className="text-base font-semibold text-muted-foreground">
                    {session.matchedTopic.briefDescription}
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-base border-2 gap-2 px-5 py-3 h-auto rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 text-amber-800 shadow-sm hover:from-amber-100 hover:to-yellow-100 hover:border-amber-400 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 font-semibold"
                  >
                    {t("session.good_to_know")}
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
                      <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-5 space-y-3">
                        <p className="font-bold text-blue-800 text-lg">{t("session.how_to")}</p>
                        <p className="text-blue-900">{session.matchedTopic.helpTemplate.hint}</p>
                        {session.matchedTopic.helpTemplate.steps.length > 0 && (
                          <ol className="list-decimal list-inside space-y-2 text-blue-900">
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
                      <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-5 space-y-2">
                        <p className="font-bold text-emerald-800">{t("session.example_label")}</p>
                        <p className="text-emerald-900">{session.matchedTopic.helpTemplate.example}</p>
                      </div>
                      <div className="rounded-xl border-2 border-red-300 bg-red-50 p-5 space-y-2">
                        <p className="font-bold text-red-800">{t("session.common_mistake")}</p>
                        <p className="text-red-900">{session.matchedTopic.helpTemplate.commonMistake}</p>
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
            <Card className={`border-2 rounded-2xl overflow-hidden shadow-lg ${subjectColors.cardBorder} bg-gradient-to-br ${subjectColors.bg}`}>
              <CardContent className="p-6">
                {session.state === "EXPLAIN" && (
                  <>
                    <h2 className="text-2xl font-heading font-bold text-foreground mb-3">{t("session.explain.title")}</h2>
                    <p className="mt-2 text-base text-muted-foreground">
                      {session.errorCount > 0
                        ? t("session.explain.errors")
                        : t("session.explain.intro")}
                    </p>
                    {session.matchedTopic && (
                      <div className="rounded-xl bg-background/70 p-5 text-base text-secondary-foreground space-y-3 mt-3">
                        <p>{session.matchedTopic.helpTemplate.hint}</p>
                        {session.matchedTopic.helpTemplate.steps.length > 0 && (
                          <ol className="list-decimal list-inside space-y-1">
                            {session.matchedTopic.helpTemplate.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        )}
                        <p><span className="font-semibold text-foreground">{t("session.example_label")}</span> {session.matchedTopic.helpTemplate.example}</p>
                      </div>
                    )}
                    <p className="mt-4 text-base text-muted-foreground">{t("session.explain.one_way")}</p>
                  </>
                )}
                {session.state === "PRACTICE" && (
                  <div className="mb-4">
                    <h2 className="text-2xl font-heading font-bold text-foreground">{questionTitle}</h2>
                  </div>
                )}
                {practiceQuestion && (
                  <div className="mt-5 rounded-xl bg-background/70 p-5">
                    {currentTask?.emoji && (
                      <div className="mb-3 text-center text-6xl leading-none" aria-hidden="true">
                        {currentTask.emoji}
                      </div>
                    )}
                    <p className="text-xl font-semibold text-foreground">
                      {practiceQuestion}
                    </p>
                  </div>
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
              <Card className="border-2 rounded-2xl shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <p className="text-lg font-medium text-foreground">
                    {t("session.correct_answer")}<span className="font-bold">{revealedAnswer.answer}</span>
                  </p>
                  <p className="text-base text-muted-foreground">{revealedAnswer.hint}</p>
                </CardContent>
              </Card>
              <Button onClick={s.handleContinueAfterCheck} disabled={loading} className="w-full text-lg h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
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
                dotAccentClass={subjectColors.dotAccent}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
