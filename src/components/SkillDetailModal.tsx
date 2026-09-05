import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Activity, CheckCircle2, ChevronDown, HelpCircle, Lightbulb, ListChecks, XCircle } from "lucide-react";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { pad } from "@/lib/czechGrammar";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { dropTruncatedTailSession } from "@/lib/sessionLogPaging";
import {
  getRecommendations,
  getIntroSentence,
  formatCzDate,
  FEEDBACK_LABELS,
  type Audience,
  type SessionSummary,
} from "@/lib/skillFeedback";

const LOG_LIMIT = 500;

interface LogItem {
  id: string;
  correct: boolean;
  helpUsed: boolean;
  errorType: string | null;
  question?: string;
  correctAnswer?: string;
  studentAnswer?: string;
}

function pctToGrade(pct: number): 1 | 2 | 3 | 4 | 5 {
  if (pct >= 90) return 1;
  if (pct >= 75) return 2;
  if (pct >= 55) return 3;
  if (pct >= 40) return 4;
  return 5;
}

/**
 * Tón známky — sémantické tokeny, ne pastelové rampy.
 *
 * Předchozí verze měla pět vlastních ramp a dvě z nich byly TOTOŽNÉ: v
 * `tailwind.config.ts` je `emerald: colors.green`, takže známka 1
 * (`emerald-700/50/300`) se vykreslila pixel po pixelu stejně jako známka 2
 * (`green-700/50/300`). Rodič viděl dvě různé známky v nerozeznatelném obalu.
 * Stejná past: `rose: colors.red` a `orange-300` = odstín značky, takže
 * „dostatečný" nosil primární barvu.
 *
 * Tři tóny stačí — rozdíl mezi 1 a 2 nese číslice a slovní popis, ne odstín.
 */
const GRADE_TONE: Record<number, string> = {
  1: "border-success/30 bg-success-muted text-success",
  2: "border-success/30 bg-success-muted text-success",
  3: "border-warning/30 bg-warning-muted text-warning",
  4: "border-destructive/25 bg-destructive-muted text-destructive",
  5: "border-destructive/25 bg-destructive-muted text-destructive",
};

const GRADE_LABEL: Record<number, string> = {
  1: "Výborný",
  2: "Chvalitebný",
  3: "Dobrý",
  4: "Dostatečný",
  5: "Nedostatečný",
};

/** Levá lišta u řádku odpovědi — stav nese proužek, ne výplň celé plochy. */
const GROUP_ACCENT = {
  wrong: "border-l-destructive/60",
  helped: "border-l-warning/60",
  correct: "border-l-success/60",
} as const;

interface Props {
  childId: string;
  skillId: string;
  onClose: () => void;
  childName?: string;
  /**
   * Komu se modál ukazuje. Rozhoduje o VŠECH textech — rodič čte diagnózu
   * o dítěti ve třetí osobě, dítě čte o sobě ve druhé. Volitelné s výchozím
   * `parent`, protože rodičovská volání jsou dvě a dětské jedno; kdyby se
   * ale někde zapomnělo, ať radši rodič uvidí text pro rodiče než dítě text
   * o sobě jako o třetí osobě. Texty žijí v `src/lib/skillFeedback.ts`.
   */
  audience?: Audience;
}

export function SkillDetailModal({ childId, skillId, onClose, childName, audience = "parent" }: Props) {
  const labels = FEEDBACK_LABELS[audience];
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [logItems, setLogItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Obojí sbalené: správné odpovědi a starší pokusy jsou doplňkové. Bez
  // explicitního stavu by `Collapsible` sice fungoval, ale nešel by zavřít
  // programově — tuhle past už jednou schoval `open={open || shouldDefaultOpen}`
  // v grafu aktivity, kde se karta nedala sbalit vůbec.
  const [correctOpen, setCorrectOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const subject = getSkillSubject(skillId) ?? null;
  const subjectMeta = subject ? getSubjectMeta(subject) : null;

  useEffect(() => {
    // ── Reálná DB ─────────────────────────────────────────────────
    let cancelled = false;
    async function load() {
      const { data } = await (supabase as any)
        .from("session_logs")
        .select("id, session_id, correct, help_used, error_type, example_id, created_at, question_text, correct_answer, student_answer")
        .eq("child_id", childId)
        .eq("skill_id", skillId)
        .order("created_at", { ascending: false })
        .limit(LOG_LIMIT);

      if (cancelled || !data) { setLoading(false); return; }

      // Agregace po sezeních. Nejstarší sezení v plné dávce je nejspíš useknuté
      // limitem — bez tohohle by mělo podhodnocený počet úloh i známku.
      const map = new Map<string, { correct: number; helpUsed: number; total: number; date: string }>();
      // Explicitní typ: dotaz jde přes `supabase as any`, takže by se generikum
      // odvodilo z omezení (`{ session_id }`) a zbytek sloupců by zmizel.
      type AggRow = { session_id: string; correct: boolean; help_used: boolean; created_at: string };
      for (const log of dropTruncatedTailSession<AggRow>(data, LOG_LIMIT)) {
        const sid = log.session_id as string;
        const prev = map.get(sid) ?? { correct: 0, helpUsed: 0, total: 0, date: log.created_at as string };
        prev.total += 1;
        if (log.correct && !log.help_used) prev.correct += 1;
        if (log.correct && log.help_used) prev.helpUsed += 1;
        map.set(sid, prev);
      }

      const result: SessionSummary[] = Array.from(map.entries()).map(([sessionId, s]) => ({
        sessionId,
        date: s.date,
        correct: s.correct,
        helpUsed: s.helpUsed,
        wrong: s.total - s.correct - s.helpUsed,
        total: s.total,
        // Úspěšnost = VŠECHNY správné (i s nápovědou) / celkem. Nápověda se
        // ukazuje zvlášť jako nuance, netrestá se ve známce — jinak by dítě, které
        // odpoví vše správně s nápovědou, vyšlo na 0 % / „Nedostatečný" (nesmysl).
        // Shodné se souhrnem v ChildSessionLog.
        pct: s.total > 0 ? Math.round(((s.correct + s.helpUsed) / s.total) * 100) : 0,
      }));

      if (!cancelled) setSessions(result);

      // Individuální logy posledního sezení s texty otázek přímo z DB
      const lastSessionId = result[0]?.sessionId;
      if (lastSessionId) {
        const lastLogs = data.filter((l: any) => l.session_id === lastSessionId);
        const items: LogItem[] = [...lastLogs].reverse().map((l: any) => ({
          id: l.id as string,
          correct: l.correct as boolean,
          helpUsed: l.help_used as boolean,
          errorType: l.error_type as string | null,
          question: l.question_text ?? undefined,
          correctAnswer: l.correct_answer ?? undefined,
          studentAnswer: l.student_answer ?? undefined,
        }));
        if (!cancelled) setLogItems(items);
      }

      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [childId, skillId]);

  // Souhrnný panel = pouze poslední sezení
  const last = sessions[0] ?? null;
  const lastGrade = last ? pctToGrade(last.pct) : null;
  const recommendations = last && lastGrade !== null
    ? getRecommendations(sessions, last.pct, lastGrade, audience)
    : [];

  // Sekce = bílá karta, stejně jako všude jinde v aplikaci. Modál dřív používal
  // barevné plochy s `border-2`, což je tvar, který má produkt vyhrazený pro
  // dashed placeholdery — vypadal proto jako cizí těleso.
  const sectionCls = "rounded-3xl border border-border bg-card p-5 shadow-e1";

  const sectionHeader = (icon: React.ReactNode, tone: string, title: string, subtitle?: string) => (
    <div className="flex items-center gap-2.5">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${tone}`}>{icon}</span>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-foreground leading-tight">{title}</h3>
        {subtitle && <p className="text-caption text-muted-foreground leading-tight">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      {/* `rounded-3xl sm:rounded-3xl`: `ui/dialog.tsx` má `sm:rounded-lg`, a
          responzivní varianta stojí v CSS za base utilitou — samotné
          `rounded-3xl` by ji nepřebilo a modál by zůstal ostřejší než karty
          pod ním. `p-0 gap-0` ruší vnitřní odsazení dialogu, protože odsazení
          si tady řídí hlavička a scroll kontejner zvlášť. */}
      <DialogContent className="max-w-2xl w-[90vw] max-h-[85vh] flex flex-col gap-0 overflow-hidden rounded-3xl sm:rounded-3xl border-border bg-background p-0 shadow-e2">
        {/* `pr-12`: zavírací křížek je `absolute right-4 top-4`, dlouhý název
            tématu by se pod něj jinak podsunul. */}
        <DialogHeader className="shrink-0 space-y-0 border-b border-border/60 bg-card px-5 py-4 pr-12 text-left sm:px-6">
          <div className="flex items-center gap-3">
            {subjectMeta && (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-muted overflow-hidden">
                <IllustrationImg
                  src={subjectMeta.image ?? ""}
                  className="h-8 w-8 object-contain"
                  fallback={<span className="text-xl">{subjectMeta.emoji ?? "📚"}</span>}
                />
              </span>
            )}
            <div className="min-w-0">
              {subjectMeta?.label && (
                <p className="text-caption font-bold uppercase tracking-[0.12em] text-muted-foreground leading-none mb-1">
                  {subjectMeta.label}
                </p>
              )}
              <DialogTitle className="text-base font-bold leading-snug text-foreground">
                {getReadableSkillName(skillId)}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-4">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Načítám výsledky…</p>
        ) : sessions.length === 0 ? (
          // Prázdný stav, ne prázdná díra — `npm run audit:ui` na to má pravidlo.
          <div className="space-y-1 rounded-3xl border border-dashed border-border bg-card/40 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-foreground">Zatím tu nic není</p>
            <p className="text-caption text-muted-foreground">
              {audience === "child"
                ? "Až téma procvičíš, uvidíš tu své výsledky."
                : "Až dítě téma procvičí, uvidíte tu jeho výsledky."}
            </p>
          </div>
        ) : (
          <>
            {/* ── 1. Verdikt ── */}
            {last && lastGrade !== null && (
              <section className={`${sectionCls} space-y-4`}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {getIntroSentence(audience, last, lastGrade, childName)}
                </p>

                {/* Známka je štítek, ne displej. Dřív tu byla číslice `text-3xl`
                    a vedle ní procenta `text-2xl` — dvě obří čísla vedle sebe
                    dělají skórový panel, což invariant „žádná gamifikace"
                    vylučuje. Školní známka smí zůstat, jako displej ne. */}
                {/* Žádný řádek metadat pod známkou. Stálo tam „Úspěšnost 100 %
                    · 6 otázek · 4. 9.", což je doslova to, co říká věta nad tím
                    — tentýž údaj dvakrát pod sebou jinými slovy. */}
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border text-xl font-extrabold tabular-nums ${GRADE_TONE[lastGrade]}`}>
                    {lastGrade}
                  </span>
                  <p className="min-w-0 flex-1 text-sm font-bold text-foreground">{GRADE_LABEL[lastGrade]}</p>
                </div>

                {/* Rozpad na kategorie jen když se opravdu na co rozpadat.
                    Když bylo všechno správně, byl to jediný štítek „6 správně",
                    tedy stoprocentní úspěšnost potřetí na jedné obrazovce. */}
                {(last.helpUsed > 0 || last.wrong > 0) && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {last.correct} správně
                    </Badge>
                    {last.helpUsed > 0 && (
                      <Badge variant="warning" className="gap-1">
                        <HelpCircle className="h-3.5 w-3.5" /> {last.helpUsed} s nápovědou
                      </Badge>
                    )}
                    {last.wrong > 0 && (
                      <Badge variant="danger" className="gap-1">
                        <XCircle className="h-3.5 w-3.5" /> {last.wrong} chybně
                      </Badge>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ── 2. Doporučení / Co dál ──
                Nahoru, ne dolů: je to jediná akční informace a dřív stála až
                za seznamem odpovědí, který má klidně třicet řádků. */}
            {recommendations.length > 0 && (
              <section className={`${sectionCls} space-y-3`}>
                {sectionHeader(<Lightbulb className="h-4 w-4" />, "bg-warning/10 text-warning", labels.advice)}
                {/* Jeden rámeček, i když vět je víc. Dvě samostatné tintované
                    plochy pod sebou vypadají jako dvě různá sdělení — přitom
                    je to jedna rada o dvou větách. */}
                <div className="space-y-1.5 rounded-2xl border border-warning/30 bg-warning-muted px-3.5 py-3">
                  {recommendations.map((tip, i) => (
                    <p key={i} className="text-sm leading-relaxed text-foreground">{tip}</p>
                  ))}
                </div>
              </section>
            )}

            {/* ── 3. Jak si vedl(a) / Jak ti to šlo ── */}
            {logItems.length > 0 && (() => {
              const wrong   = logItems.filter(l => !l.correct);
              const helped  = logItems.filter(l => l.correct && l.helpUsed);
              const correct = logItems.filter(l => l.correct && !l.helpUsed);

              const row = (l: LogItem, accent: string) => (
                // Neutrální plocha, stav nese levá lišta. Dřív byly tři plné
                // tinty pod sebou a chybná odpověď byla přeškrtnutá červeně —
                // to je u dítěte trest, ne informace.
                <div key={l.id} className={`rounded-2xl border border-border/60 border-l-[3px] ${accent} bg-muted/40 px-3.5 py-2.5`}>
                  {l.question ? (
                    <>
                      <p className="text-sm font-medium leading-snug text-foreground">{l.question}</p>
                      {!l.correct && l.studentAnswer && l.studentAnswer !== l.correctAnswer && (
                        <p className="mt-1 text-caption text-muted-foreground">
                          {labels.answeredPrefix} <span className="font-semibold text-destructive">{l.studentAnswer}</span>
                        </p>
                      )}
                      {/* Správnou odpověď má smysl ukázat jen tam, kde padla
                          jiná. U správně zodpovězené úlohy je to informace,
                          kterou čtenář právě sám napsal. */}
                      {l.correctAnswer && !l.correct && (
                        <p className="mt-0.5 text-caption text-muted-foreground">
                          {labels.correctAnswer} <span className="font-semibold text-success">{l.correctAnswer}</span>
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-caption italic text-muted-foreground">
                      {!l.correct ? "Chybná odpověď" : l.helpUsed ? "Správně s nápovědou" : "Správně"}
                    </p>
                  )}
                </div>
              );

              const groupLabel = (icon: React.ReactNode, tone: string, label: string, n: number) => (
                <p className={`flex items-center gap-1.5 text-caption font-bold uppercase tracking-[0.12em] ${tone}`}>
                  {icon} {label} <span className="font-semibold text-muted-foreground">({n})</span>
                </p>
              );

              return (
                <section className={`${sectionCls} space-y-4`}>
                  {sectionHeader(<ListChecks className="h-4 w-4" />, "bg-primary/10 text-primary", labels.breakdown)}

                  {wrong.length > 0 && (
                    <div className="space-y-1.5">
                      {groupLabel(<XCircle className="h-3.5 w-3.5" />, "text-destructive", "Chybně", wrong.length)}
                      {wrong.map(l => row(l, GROUP_ACCENT.wrong))}
                    </div>
                  )}

                  {helped.length > 0 && (
                    <div className="space-y-1.5">
                      {groupLabel(<HelpCircle className="h-3.5 w-3.5" />, "text-warning", "S nápovědou", helped.length)}
                      {helped.map(l => row(l, GROUP_ACCENT.helped))}
                    </div>
                  )}

                  {/* Chyby a nápověda jsou to důležité → vždy rozbalené. Správné
                      odpovědi zabírají nejvíc místa a nesou nejmíň informace →
                      sbalené. Dřív to řešil nativní <details> s textem
                      „— rozbalit"; to je popis affordance, ne affordance. */}
                  {correct.length > 0 && (
                    <Collapsible open={correctOpen} onOpenChange={setCorrectOpen} className="space-y-1.5">
                      <CollapsibleTrigger className="group flex w-full items-center gap-1.5 text-caption font-bold uppercase tracking-[0.12em] text-success transition-colors hover:text-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Správně <span className="font-semibold text-muted-foreground">({correct.length})</span>
                        <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1.5 pt-1">
                        {correct.map(l => row(l, GROUP_ACCENT.correct))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </section>
              );
            })()}

            {/* ── 4. Starší pokusy ── */}
            {sessions.length > 1 && (
              <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className={sectionCls}>
                <CollapsibleTrigger className="group flex w-full items-center gap-2.5 text-left">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-success/10 text-success">
                    <Activity className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground leading-tight">{labels.history}</span>
                    <span className="block text-caption text-muted-foreground leading-tight">
                      {pad(sessions.length - 1, "CVIČENÍ")}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1.5 pt-3">
                  {sessions.slice(1).map(s => {
                    const g = pctToGrade(s.pct);
                    return (
                      <div key={s.sessionId} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-border/60 bg-muted/40 px-3.5 py-2.5">
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-caption font-bold tabular-nums ${GRADE_TONE[g]}`}>
                          {g}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-foreground">{s.pct} %</span>
                        <span className="ml-auto flex flex-wrap items-center gap-2 text-caption tabular-nums text-muted-foreground">
                          <span className="font-semibold text-success">✓ {s.correct}</span>
                          {s.helpUsed > 0 && <span className="font-semibold text-warning">? {s.helpUsed}</span>}
                          {s.wrong > 0 && <span className="font-semibold text-destructive">✗ {s.wrong}</span>}
                          <span>{formatCzDate(s.date)}</span>
                        </span>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
