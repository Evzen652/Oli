import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { PracticeTask, SessionState } from "@/lib/types";
import { getDisplayCategory, getChildTopicTitle } from "@/lib/displayNames";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { GradeSelect } from "@/components/GradeSelect";
import { TopicBrowser } from "@/components/TopicBrowser";
import { ChildHomePage } from "@/components/ChildHomePage";
import { DiktatFilterSelect } from "@/components/DiktatFilterSelect";
import { HelpButton } from "@/components/HelpButton";
import { PaintedArrow } from "@/components/icons/PaintedArrow";
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
import { getTopicInsight } from "@/lib/topicInsight";
import { readLocal, writeLocal } from "@/lib/safeStorage";
import { getPersistedSession, clearPersistedSession } from "@/hooks/useSessionPersistence";
import { getTopicById } from "@/lib/contentRegistry";
import { SessionRecoveryDialog } from "@/components/SessionRecoveryDialog";
import { ExitSessionDialog } from "@/components/ExitSessionDialog";
import goodToKnowImg from "@/assets/good-to-know.png";
/**
 * Ikony boxů v „Co je dobré vědět". Jedna sada, tatáž jako u úloh
 * v průběhu cvičení (`ProgressIndicator`) — dítě ty tvary už zná.
 * Tužka = jak na to, fajfka = takhle to vypadá správně, křížek = past,
 * žárovka = zajímavost.
 */
import icoHowTo from "@/assets/progress/progress-current.png";
import icoExample from "@/assets/progress/progress-correct.png";
import icoMistake from "@/assets/progress/progress-wrong.png";
import icoFunFact from "@/assets/progress/progress-help.png";
import { useT } from "@/lib/i18n";
import { LogOut, Eye, Lightbulb, Hourglass } from "lucide-react";
import { IllustrationImg } from "@/components/IllustrationImg";
import { getSubjectMeta, getSubjectPalette } from "@/lib/subjectRegistry";
import { OliLogo } from "@/components/OliLogo";
import { BackButton } from "@/components/BackButton";
import { isTrialActive } from "@/lib/anonTrial";

function ChildLoadingFallback() {
  const [showFallback, setShowFallback] = useState(false);
  const t = useT();
  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 4000);
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
          <p className="text-muted-foreground">
            Nepodařilo se načíst tvoje procvičování. Možná účet ještě není propojený s rodičem nebo nemá nastavený ročník.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => window.location.reload()}>Zkusit znovu</Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("session.sign_out")}
            </Button>
          </div>
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

export function SessionView() {
  const t = useT();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role, loading: roleLoading } = useUserRole();
  /**
   * Dítě bez účtu. Řídí jen VZHLED (schované odhlášení, ✕, časovač) —
   * NE přístup k obsahu. Podmínka `role === null` je tu proto, že klíč
   * `oli_anon_trial` v localStorage přežije registraci i přihlášení admina
   * (maže ho jen migrace anonymního pokroku), takže samotná jeho existence
   * o anonymitě nic neříká.
   */
  const isAnonymous = pathname === "/student" && role === null && !!readLocal("oli_anon_trial");
  const isStudentView = role === "child" || (role === "admin" && pathname === "/student") || isAnonymous;

  /**
   * Zámek obsahu. Platí AŽ PO vypršení trialu — během 14 dnů má dítě plný
   * přístup, přesně jak slibuje landing i hlavička `anonTrial.ts`.
   *
   * Dřív se sem předávalo `isAnonymous`, tedy „je anonymní" ve významu
   * „je zamčeno": zámek proto platil od první minuty a stejně tak 20. den.
   * Trial se přitom celou dobu správně počítal, jen ho tenhle řádek nečetl.
   */
  const isContentLocked = isAnonymous && !isTrialActive();
  const s = useSessionDispatch();
  const {
    grade, session, practiceQuestion, userInput, isLocked, loading,
    checkFeedback, lastAnswerCorrect, revealedAnswer, answeredTask, answeredTaskIndex, selectedAnswer,
    questionTitle, questionIcon, taskResults, pendingDiktatTopic,
    // Vytažené zvlášť kvůli závislostem efektů níž: `s` je nový objekt na každý
    // render, takže by ho do deps dát nešlo. `handleGradeSelect` je stabilní
    // (`useCallback` s prázdnými deps), tedy do deps patřit může.
    handleGradeSelect,
  } = s;

  // For child role: show ChildHomePage by default, TopicBrowser on demand
  // Anon „procházet předmět" — subject čteme synchronně při mountu (stejně jako
  // isStarting níže). Pro anon trial se TopicBrowser renderuje hned (přeskakuje
  // ChildHomePage), takže initialSubject musí být k dispozici už při prvním
  // renderu — jinak browser nastartuje na výběru předmětu místo na okruzích.
  const [showTopicBrowser, setShowTopicBrowser] = useState(
    () => !!sessionStorage.getItem("oli_anon_browse_subject"),
  );
  const [showAnonGateModal, setShowAnonGateModal] = useState(false);
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

  // Potvrzení před odchodem z rozdělaného cvičení (UX audit 2026-08-25).
  // Uchováváme akci, kterou má odchod provést — hlavička jich má čtyři
  // (logo, Zpět, Odhlásit se, ✕) a všechny mají projít stejnou branou.
  const [pendingExit, setPendingExit] = useState<(() => void) | null>(null);

  // Klidné upozornění minutu před vypršením limitu. Drží `startTime` sezení,
  // ne boolean — po „Procvičit znovu" začíná nové sezení s novým `startTime`,
  // takže hláška sama zhasne a příště se ukáže znovu.
  const [timeWarningFor, setTimeWarningFor] = useState<number | null>(null);
  // Prázdné deps jsou nutnost, ne pohodlí: `SessionTimer` má callback
  // v závislostech svého intervalu, takže nestabilní identita by interval
  // restartovala při každém renderu a tikot by se nikdy nedopočítal.
  const handleTimeWarning = useCallback((startTime: number) => setTimeWarningFor(startTime), []);

  // For paired children: auto-load grade from children table
  const [childGradeLoaded, setChildGradeLoaded] = useState(false);
  useEffect(() => {
    if (role === "child" && !grade && !childGradeLoaded) {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("children")
          .select("grade")
          .eq("child_user_id", user.id)
          .maybeSingle();
        if (data?.grade) {
          handleGradeSelect(data.grade as any);
          // childGradeLoaded ZŮSTÁVÁ false: po handleReset (grade→null na konci sezení / „Zpět")
          // se tento effect musí spustit znovu a ročník z DB opět načíst, jinak dítě uvízne
          // na ChildLoadingFallback (grade je null a nikdo ho už nenačte).
        } else {
          // Dítě nemá v DB ročník → zamkni, ať se nefetchuje donekonečna (grade zůstane null).
          setChildGradeLoaded(true);
        }
      })();
    }
  }, [role, grade, childGradeLoaded, handleGradeSelect]);

  // Nabídka obnovení rozdělané práce.
  // Dřív byla podmínka `!session && !grade`, jenže ANI JEDNA ze skutečných
  // žákovských cílovek ji nesplní: anonymní dítě má `grade` naplněný
  // synchronně z localStorage a přihlášené dítě s `!grade` skončí na
  // `ChildLoadingFallback`. Dialog tak nikdy neviděl nikdo, komu byl určen.
  // Stačí, že neběží žádné sezení — tedy že dítě stojí ve výběru tématu.
  useEffect(() => {
    if (!recoveryChecked && !session) {
      const persisted = getPersistedSession();
      if (persisted) {
        setRecoveryData(persisted);
      }
      setRecoveryChecked(true);
    }
  }, [recoveryChecked, session]);

  // Admin: obnov naposledy testovaný ročník (zapamatovaný v localStorage), fallback 4
  useEffect(() => {
    if (role === "admin" && !grade) {
      const saved = Number(readLocal("oli_admin_preview_grade"));
      const g = saved >= 1 && saved <= 9 ? saved : 4;
      handleGradeSelect(g as any);
    }
  }, [role, grade, handleGradeSelect]);

  // Admin floating banner component with grade dropdown
  const GRADES = [2, 3, 4, 5, 6, 7, 8, 9];
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
            writeLocal("oli_admin_preview_grade", String(g));
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
      <BackButton to="/admin" label="Zpět do Adminu" size="sm" />
    </div>
  ) : null;

  // Recovery dialog se renderuje ve VŠECH větvích returnu — dřív visel jen
  // v parent fallbacku, kam se dítě nikdy nedostane.
  const recoveryDialog = (
    <SessionRecoveryDialog
      open={!!recoveryData}
      // Dětský název, ne RVP. Dialog vidí dítě, a „Práce s daty – tabulky
      // a jednoduchá schémata" mu neřekne nic o tom, co má rozdělané.
      topicTitle={recoveryData?.session?.matchedTopic ? getChildTopicTitle(recoveryData.session.matchedTopic, grade, isStudentView) : ""}
      onRecover={() => {
        if (recoveryData) {
          const rec = recoveryData.session;
          // Čas strávený mimo aktivní sezení se nepočítá — jinak by se obnovené
          // sezení při první odpovědi hned ukončilo do STOP_2 („čas vypršel"),
          // což ruší celý smysl obnovy. Posuň startTime o dosud odehraný čas.
          rec.startTime = Date.now() - (rec.elapsedSeconds ?? 0) * 1000;
          // matchedTopic.generator je funkce → JSON.stringify ji ze zálohy zahodí.
          // Přehrání uloženého batche to nevadí, ale „Zopakovat" po obnově volá
          // topic.generator → TypeError. Rehydratuj generátor z registru.
          if (rec.matchedTopic) {
            const fresh = getTopicById(rec.matchedTopic.id);
            if (fresh) rec.matchedTopic = { ...rec.matchedTopic, generator: fresh.generator };
          }
          s.setGrade(rec.grade);
          s.setSession(rec);
          // Bez tohohle se sezení obnovilo, ale ukazatel průběhu byl prázdný —
          // dítě vidělo „Úloha 3 z 6" a přitom nulu hotových teček.
          s.setTaskResults(recoveryData.taskResults ?? []);
          setRecoveryData(null);
        }
      }}
      onDiscard={() => {
        clearPersistedSession();
        setRecoveryData(null);
      }}
    />
  );

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
      return <>{recoveryDialog}<ChildLoadingFallback /></>;
    }

    // Non-admin, non-child: show grade select (parent fallback)
    if (role !== "admin") {
      return (
        <>
          {recoveryDialog}
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
    if (isStudentView && !showTopicBrowser && !isAnonymous) {
      return (
        <>
          {recoveryDialog}
          {AdminBanner}
          <div style={role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
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
        {recoveryDialog}
        {AdminBanner}
        <TopicBrowser
          key={grade}
          grade={grade}
          onSelectTopic={(topic) => { setIsStarting(true); s.handleTopicSelect(topic); }}
          onBack={() => {
            if (isAnonymous) {
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
          anonLocked={isContentLocked}
          onLockedClick={() => setShowAnonGateModal(true)}
        />

        <Dialog open={showAnonGateModal} onOpenChange={setShowAnonGateModal}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Přihlásit se</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 pt-2">
              <button
                className="flex flex-col items-start gap-1 rounded-lg border-2 border-primary/30 bg-card px-5 py-4 text-left transition-all duration-150 hover:bg-accent hover:shadow-e2 hover:-translate-y-px"
                onClick={() => { setShowAnonGateModal(false); navigate("/auth/child"); }}
              >
                <span className="font-bold text-base text-foreground">Jsem žák</span>
                <span className="text-sm text-muted-foreground">Mám párovací kód od rodiče</span>
              </button>
              <button
                className="flex flex-col items-start gap-1 rounded-lg border-2 border-success/30 bg-card px-5 py-4 text-left transition-all duration-150 hover:bg-success-muted hover:shadow-e2 hover:-translate-y-px"
                onClick={() => { setShowAnonGateModal(false); navigate("/auth?mode=register"); }}
              >
                <span className="font-bold text-base text-foreground">Jsem rodič</span>
                <span className="text-sm text-muted-foreground">Chci sledovat pokrok dítěte</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const isTerminal = TERMINAL_STATES.includes(session.state);

  // Rozdělaná práce = běžící sezení, které dítě už začalo řešit.
  // Na nulté úloze není co chránit → odchod proběhne rovnou, bez dialogu.
  const answeredCount = taskResults.length;
  const hasWorkInProgress = !isTerminal && answeredCount > 0;

  /**
   * Jediná brána pro všechny čtyři odchodové prvky v hlavičce.
   * `keepBackup: true` je záměr — odchod práci NEMAŽE, jen ji odloží;
   * `SessionRecoveryDialog` ji při návratu nabídne zpět.
   */
  // Zálohu má smysl držet jen když je co obnovovat — odchod z ještě
  // nezačaté úlohy by jinak při návratu nabízel prázdné „Pokračovat".
  const leaveSession = () => s.handleReset({ keepBackup: hasWorkInProgress });
  const requestExit = (action: () => void) => {
    if (hasWorkInProgress) setPendingExit(() => action);
    else action();
  };
  const showTextInput = !isTerminal && !isLocked && session.state === "INPUT_CAPTURE";
  const showPracticeInput = !isTerminal && !isLocked && session.state === "PRACTICE" && !checkFeedback && !revealedAnswer;
  const currentTask: PracticeTask | undefined = session.practiceBatch[session.currentTaskIndex];
  // Předmětová barva JEN z rejstříku — dřív tu byla šestá nezávislá mapa
  // (`getSubjectColor`), kvůli které měla matematika jiný odstín modré ve
  // cvičení než v přehledu předmětů.
  const subjectPalette = getSubjectPalette(session.matchedTopic?.subject);

  /**
   * K čemu to je + zajímavost. Dřív se bralo z `getCategoryInfo`, jenže ten
   * mapuje klíče staré taxonomie a od přechodu na RVP názvy vracel `null`
   * pro všech 229 témat — box se zajímavostí se tedy nezobrazil nikdy.
   * `getTopicInsight` má fallback na kategorii, takže se to nemůže opakovat;
   * hlídá to test `topic-insight-coverage`.
   */
  const insight = session.matchedTopic
    ? getTopicInsight(session.matchedTopic.subject, session.matchedTopic.category, session.matchedTopic.topic)
    : null;


  return (
    <div className={`relative flex min-h-screen flex-col ${isTerminal || session.state === "PRACTICE" || session.state === "EXPLAIN" ? "session-bg-gradient" : "bg-background"}`} style={role === "admin" ? { paddingTop: "2.5rem" } : undefined}>
      {/* Dekorace v rozích (3D glóbus s knihami vlevo dole, letící kniha vpravo
          nahoře) SMAZÁNY 2026-09-03. Čtyři důvody, každý sám o sobě stačí:
          1. byly ve stylu „3D Pixar“, který `ILLUSTRATION_STYLE.md` výslovně
             označuje za nepatřičný vedle akvarelu — a byly to největší grafické
             prvky na obrazovce (288–384 px, `fixed` v obou rozích);
          2. na širokém monitoru orámovaly obsah jako tapeta šablony;
          3. tahaly se za běhu ze Supabase storage — síťová závislost pro
             čistou dekoraci;
          4. letící kniha měla `mixBlendMode: multiply` nad radiálním gradientem,
             takže se jí odstín měnil podle pozice na stránce.
          Prázdné okraje se nemá čím zaplňovat — klid kolem karty je záměr. */}
      {AdminBanner}
      <ExitSessionDialog
        open={!!pendingExit}
        done={answeredCount}
        total={session.practiceBatch.length}
        onStay={() => setPendingExit(null)}
        onLeave={() => { const go = pendingExit; setPendingExit(null); go?.(); }}
      />
      {/* Header */}
      <header className="relative border-b px-4 pt-4 pb-3">
        <div className={`absolute top-0 left-0 right-0 h-1 ${subjectPalette.accentClass}`} />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <OliLogo size="sm" onClick={() => requestExit(leaveSession)} />
        </div>
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Zobrazeno i anonymnímu dítěti. Dřív bylo schované za
                `!isAnonymous`, takže jediný klikací prvek v hlavičce bylo logo —
                a to sezení mazalo. Odchod má mít popisek, ne se hádat. */}
            <BackButton size="sm" onClick={() => requestExit(leaveSession)} />
            {session.matchedTopic && (
              <span className="text-lg font-bold text-foreground">
                {session.matchedTopic.subject.charAt(0).toUpperCase() + session.matchedTopic.subject.slice(1)}
                <span className="font-bold"> | {session.grade}. ročník</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* `SessionTimer` nic nevykresluje — jen hlídá limit na pozadí
                a minutu před koncem pošle jednu klidnou hlášku.

                Podmínka `!isStudentView` je pryč záměrně: `isStudentView` je
                pravda pro KAŽDÉ dítě (viz jeho definice výše), takže hlídač
                běžel jedině rodiči/adminovi v náhledu — tedy nikomu, komu
                limit platí. Dětem se limit uplatnil jen náhodou přes
                `evaluateStop` po chybné odpovědi: kdo odpovídal správně,
                neskončil nikdy, a kdo chyboval v 8:01, spadl uprostřed úlohy. */}
            {!isTerminal && (
              <SessionTimer
                startTime={session.startTime}
                maxSeconds={session.rules.maxDurationSeconds}
                isActive={!isLocked}
                onTimeExpired={s.handleTimeExpired}
                onWarning={handleTimeWarning}
              />
            )}
            {!isStudentView && (
              <a href="/report" className="text-base text-muted-foreground hover:text-foreground">
                Report
              </a>
            )}
            {!isAnonymous && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => requestExit(async () => {
                  await supabase.auth.signOut();
                  // Skutečného žáka pošli rovnou na přihlášení (zařízení si ho pamatuje → zadá jen PIN).
                  // NE admina v náhledu /student (isStudentView by ho zde chybně poslal na dětský login).
                  if (role === "child") window.location.href = "/auth/child";
                })}
                title={t("session.sign_out")}
                className="text-base"
              >
                {t("session.sign_out")}
              </Button>
            )}
            {!isAnonymous && (
              // Glyf ✕ sám o sobě není přístupný název — odečítač obrazovky
              // z něj přečte „krát" nebo nic. Přitom je to tlačítko, které
              // ukončuje sezení, tedy nejzávažnější akce na obrazovce.
              <Button
                variant="ghost"
                size="sm"
                onClick={() => requestExit(leaveSession)}
                aria-label={t("session.exit")}
                title={t("session.exit")}
                className="text-base"
              >
                <span aria-hidden>✕</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl flex flex-col space-y-6">
          {/* Blížící se konec limitu — jedna klidná věta, žádný odpočet.
              Jantarová, ne červená: není to chyba ani trest, jen informace. */}
          {!isTerminal && timeWarningFor === session.startTime && (
            <div
              role="status"
              className="rounded-2xl border border-warning/30 bg-warning-muted px-5 py-3 flex items-start gap-2.5 text-base text-foreground"
            >
              <Hourglass className="h-5 w-5 shrink-0 text-warning mt-0.5" aria-hidden />
              <span>{t("session.time_warning")}</span>
            </div>
          )}

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
                  {/* Dřív plná jantarová lišta přes celou šířku, pak tichý odkaz
                      — ten ale nevypadal klikatelně. Nově kompaktní tlačítko
                      s okrajem: má tvar ovládacího prvku, ale nezabírá celou
                      šířku a nekřičí jako původní lišta. */}
                  <Button
                    variant="outline"
                    className="h-auto w-fit gap-2 rounded-full border-border bg-card px-4 py-2 text-[15px] font-semibold text-foreground shadow-e1 hover:border-warning/50 hover:bg-warning-muted"
                  >
                    <Lightbulb className="h-4 w-4 text-warning" />
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
                      {/* K čemu to je stojí PŘED postupem a schválně NENÍ box:
                          dítě, které neví proč, se návod učit nechce, takže tohle
                          není kapitola mezi ostatními, ale úvodní věta dialogu.
                          Boxy pod ní tvoří čtveřici, na kterou přesně sedí čtyři
                          akvarelové ikony — pátá by musela vzniknout jen kvůli
                          symetrii. */}
                      {insight && (
                        <p className="text-lg font-semibold leading-snug text-primary">
                          {insight.useful}
                        </p>
                      )}
                      <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-e1">
                        <p className="flex items-center gap-2 font-bold text-foreground text-lg">
                          <img src={icoHowTo} alt="" className="h-6 w-6 object-contain" />
                          {t("session.how_to")}
                        </p>
                        <p className="text-foreground">{session.matchedTopic.helpTemplate.hint}</p>
                        {session.matchedTopic.helpTemplate.steps.length > 0 && (
                          <ol className="list-decimal list-inside space-y-2 text-foreground">
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
                                <div className="rounded-2xl border border-border bg-card p-4 shadow-e1">
                                  <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground leading-relaxed">
                                    {examples.filter((ex) => typeof ex === "string").join("\n\n")}
                                  </pre>
                                </div>
                              );
                            }
                            return examples.map((ex: any, i: number) => (
                              <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-e1">
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
                      <div className="rounded-2xl border border-success/30 bg-card p-5 space-y-2 shadow-e1">
                        <p className="flex items-center gap-2 font-bold text-success">
                          <img src={icoExample} alt="" className="h-6 w-6 object-contain" />
                          {t("session.example_label")}
                        </p>
                        <p className="text-foreground">{session.matchedTopic.helpTemplate.example}</p>
                      </div>
                      <div className="rounded-2xl border border-destructive/30 bg-card p-5 space-y-2 shadow-e1">
                        <p className="flex items-center gap-2 font-bold text-destructive">
                          <img src={icoMistake} alt="" className="h-6 w-6 object-contain" />
                          {t("session.common_mistake")}
                        </p>
                        <p className="text-foreground">{session.matchedTopic.helpTemplate.commonMistake}</p>
                      </div>
                      {insight && (
                        <div className="rounded-2xl border border-warning/30 bg-card p-5 space-y-2 shadow-e1">
                          <p className="flex items-center gap-2 font-semibold text-warning text-lg">
                            <img src={icoFunFact} alt="" className="h-6 w-6 object-contain" />
                            {t("session.fun_fact")}
                          </p>
                          <p className="text-foreground">{insight.funFact}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Question card (EXPLAIN / PRACTICE without feedback) */}
          {session.state !== "INPUT_CAPTURE" && !isTerminal && !checkFeedback && (
            // Karta je vždy bílá; předmět nese jen okraj (design systém).
            // Tvarosloví převzaté z landing page: rádius 24 px a okraj 1 px
            // v předmětovém tintu — ne `border-2` kolem dokola, to čte jako
            // Material Design. Předmět nese rozmytý akvarelový tah v horní hraně.
            // Rozmytý akvarelový tah v horní hraně byl zavržen: `blur` prosákl
            // přes zaoblený roh a četl se jako nechtěný stín nad kartou.
            // Předmět nese samotný okraj 1 px v tintu — to stačí.
            <Card className={`relative rounded-3xl border overflow-hidden shadow-e1 ${subjectPalette.borderClass}`}>
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
                {/* Rotující pobídka („Poradíš si?", „Tvůj tah!") je jen náladová
                    vata — byla ale `text-2xl` (24 px), tedy VĚTŠÍ než samotná
                    otázka (20 px). Hierarchie naruby: dítě četlo nejdřív pozdrav.
                    Degradováno na tichý nadtitulek v barvě předmětu. */}
                {session.state === "PRACTICE" && (
                  <p className={`text-[13px] font-extrabold uppercase tracking-[0.07em] ${subjectPalette.color}`}>
                    {questionTitle}
                  </p>
                )}
                {/* Otázka je hrdina obrazovky — bez obalu a bez emoji.
                    Dřív tu byl vnořený `rounded-xl bg-background/70 p-5`, jenže
                    #FAF9F6 při 70 % na bílé dá ~#FCFBF9, tedy rozdíl v jasu
                    1,5 % — neviditelný obal za 20 px paddingu.
                    Nad otázkou navíc stálo emoji `text-6xl` (60 px), největší
                    objekt na obrazovce: mimo paletu, mimo akvarelový rukopis
                    a na každé platformě jinak kreslené. Pole `emoji` v obsahu
                    zůstává (1 061 výskytů), jen se tady nevykresluje. */}
                {practiceQuestion && (
                  <p className="mt-4 text-[29px] leading-[1.3] font-extrabold text-foreground">
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
              loading={loading}
              isTerminal={isTerminal}
              onContinue={s.handleContinueAfterCheck}
              selectedAnswer={selectedAnswer}
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
              <Card className="rounded-3xl border shadow-e1">
                <CardContent className="p-6 space-y-4">
                  <p className="text-lg font-medium text-foreground">
                    {t("session.correct_answer")}<span className="font-bold">{revealedAnswer.answer}</span>
                  </p>
                  <p className="text-base text-muted-foreground">{revealedAnswer.hint}</p>
                </CardContent>
              </Card>
              <Button onClick={s.handleContinueAfterCheck} disabled={loading} size="child" className="group w-full gap-2 rounded-full text-lg font-bold">
                {loading ? t("session.processing") : t("session.continue")}
                {!loading && <PaintedArrow className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />}
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
              onNewTopic={() => {
                if (isAnonymous) {
                  // Anon: handleReset by skončil na zamčeném TopicBrowseru.
                  // Vrať dítě na anon dashboard (denní úkoly) přes existující event.
                  window.dispatchEvent(new CustomEvent("oli-anon-exit-session"));
                } else {
                  s.handleReset();
                }
              }}
            />
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Progress indicator */}
          {session.matchedTopic && session.state === "PRACTICE" && session.practiceBatch.length > 0 && (
            <div className="pb-4">
              <ProgressIndicator
                current={answeredTask && answeredTaskIndex !== null ? answeredTaskIndex : session.currentTaskIndex}
                total={session.practiceBatch.length}
                results={taskResults}
                dotAccentClass={`${subjectPalette.tintClass} ring-2 ${subjectPalette.ringClass}`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
