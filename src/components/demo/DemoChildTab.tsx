import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, ChevronDown } from "lucide-react";
import { logoNoText } from "@/components/OlyLogo";
import { IllustrationImg } from "@/components/IllustrationImg";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { motivationalMessage } from "@/components/ChildHomePage";

const MOCK_CHILD_NAME = "Tomáš";
const MOCK_STATS = { daysActive: 3, tasks: 32, accuracy: 31 };

const MOCK_ASSIGNMENTS = [
  { id: "1", skillName: "Velká násobilka (1–10)", subject: "matematika", assigned_date: "18. 4.", due_date: null, note: null },
  { id: "2", skillName: "Části rostliny", subject: "prvouka", assigned_date: "27. 4.", due_date: null, note: null },
  { id: "3", skillName: "Vyjmenovaná slova po B", subject: "čeština", assigned_date: "2. 5.", due_date: "10. 5.", note: null },
];

const MOCK_SKILLS = [
  { skillId: "math-add-sub-100", subject: "matematika", correct: 2, attempts: 20, badgeText: "trénovat", badgeCls: "bg-amber-100 text-amber-700", barColor: "bg-amber-500", acc: 10, lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { skillId: "cz-vyjmenovana-slova-b", subject: "čeština", correct: 8, attempts: 12, badgeText: "dobře", badgeCls: "bg-sky-100 text-sky-700", barColor: "bg-sky-500", acc: 67, lastPracticed: new Date().toISOString() },
];

type Period = "today" | "7d" | "30d" | "all";
const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "Dnes" },
  { value: "7d",    label: "Posledních 7 dní" },
  { value: "30d",   label: "Poslední měsíc" },
  { value: "all",   label: "Od začátku" },
];

function PeriodSelect({ value, onChange }: { value: Period; onChange: (v: Period) => void }) {
  const [open, setOpen] = useState(false);
  const label = PERIOD_OPTIONS.find(o => o.value === value)?.label ?? "";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium hover:text-foreground transition-colors"
      >
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[150px] rounded-xl border border-border/50 bg-white shadow-lg py-1 overflow-hidden">
          {PERIOD_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${opt.value === value ? "bg-blue-50 text-blue-600 font-semibold" : "text-foreground hover:bg-slate-50"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TIPS = [
  "Každý byl jednou začátečník — i tvůj učitel.",
  "Chyba není problém — tak se učíš.",
  "Krátké procvičování každý den je lepší než hodina jednou za týden.",
];

function formatLastPracticed(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "dnes";
  if (d.toDateString() === yesterday.toDateString()) return "včera";
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

const EVAL_HIGH = [
  (acc: number) => `Fantastických ${acc} %! Tuhle látku máš v malíku.`,
  (acc: number) => `Výborně, ${acc} % správně! Zkus se pustit do dalšího tématu.`,
  (_: number) => `Skvělý výsledek! Udržuj toto tempo a půjde ti to ještě lépe.`,
  (acc: number) => `${acc} % — to je pecka! Gratuluju.`,
];
const EVAL_MID = [
  (acc: number) => `${acc} % — dobrý základ! Zopakuj si chyby a bude ještě lépe.`,
  (_: number) => `Jde ti to! Zaměř se na místa, kde děláš chyby, a výsledek poroste.`,
  (acc: number) => `Solidní výkon (${acc} %). Trochu více procvičování a přeskočíš na skvělé.`,
  (_: number) => `Dobrá práce — každý trénink tě posouvá o kousek dál.`,
];
const EVAL_LOW = [
  (_: number) => `Nevzdávej to — opakování je základ. Každý chybuje, důležité je pokračovat.`,
  (acc: number) => `${acc} % zatím, ale to se změní. Zkus to znovu, chyby jsou nejlepší učitel.`,
  (_: number) => `Tohle téma chce více procvičení — ty to ale zvládneš!`,
  (_: number) => `Neboj se chybovat, tak se to naučíš. Jen nevzdávej to!`,
];
const EVAL_START = [
  "Teprve začínáš — odvahu, tohle se naučit dá!",
  "První kroky jsou nejtěžší. Zkus to ještě jednou!",
  "Nový začátek! Pokračuj a uvidíš, jak rychle to půjde.",
  "Vítej u nového tématu — zkus první kolo a uvidíme, jak na tom jsi.",
];

function skillEvaluation(acc: number, attempts: number, seed: number): string {
  if (attempts < 2) return EVAL_START[seed % EVAL_START.length];
  const pool = acc >= 80 ? EVAL_HIGH : acc >= 50 ? EVAL_MID : EVAL_LOW;
  return pool[seed % pool.length](acc);
}

function StatPill({ emoji, main, sub, cls }: { emoji: string; main: string; sub: string; cls: string }) {
  return (
    <div className={`rounded-2xl px-4 py-2.5 flex items-center gap-2.5 ${cls}`}>
      <span className="text-lg leading-none">{emoji}</span>
      <div>
        <p className="font-extrabold text-base leading-tight tabular-nums">{main}</p>
        <p className="text-xs opacity-70 leading-tight">{sub}</p>
      </div>
    </div>
  );
}

function SkillHeader({ subject, skillId, skillName }: { subject: string; skillId?: string; skillName: string }) {
  const meta = getSubjectMeta(subject);
  return (
    <div className="flex items-start gap-2">
      <div className="shrink-0 h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
        {meta
          ? <IllustrationImg src={meta.image} className="h-7 w-7 object-contain" fallback={<span className="text-base">{meta.emoji}</span>} />
          : <span className="text-base">📋</span>}
      </div>
      <div className="flex-1 min-w-0">
        {meta?.label && <p className="text-[10px] text-muted-foreground leading-tight mb-0.5">{meta.label}</p>}
        <p className="font-bold text-sm text-foreground leading-snug">{skillName}</p>
      </div>
    </div>
  );
}

export function DemoChildTab() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("7d");
  const [skillSubject, setSkillSubject] = useState<string | null>(null);
  const [assignmentSubject, setAssignmentSubject] = useState<string | null>(null);
  const motiv = motivationalMessage(MOCK_STATS.daysActive, MOCK_STATS.tasks, MOCK_STATS.accuracy, MOCK_CHILD_NAME);
  const tip = TIPS[new Date().getDate() % TIPS.length];

  const assignmentSubjects = [...new Set(MOCK_ASSIGNMENTS.map(a => a.subject))];
  const visibleAssignments = assignmentSubject ? MOCK_ASSIGNMENTS.filter(a => a.subject === assignmentSubject) : MOCK_ASSIGNMENTS;
  const skillSubjects = [...new Set(MOCK_SKILLS.map(s => s.subject))];
  const visibleSkills = skillSubject ? MOCK_SKILLS.filter(s => s.subject === skillSubject) : MOCK_SKILLS;

  return (
    <div className="min-h-[600px] bg-[#fdf8f2] rounded-2xl p-4 space-y-4">

      {/* Greeting bar */}
      <div className="bg-white rounded-3xl px-6 py-5 flex flex-wrap items-center gap-4 shadow-sm border border-black/[0.05]">
        <img src={logoNoText} alt="Oli" className="h-14 w-14 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-2xl text-foreground leading-tight">Ahoj, Tomíku!</h1>
          <p className="text-base text-muted-foreground mt-0.5">{motiv}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <StatPill emoji="🔥" main={`${MOCK_STATS.daysActive} dny`} sub="v řadě" cls="bg-orange-100 text-orange-800" />
          <StatPill emoji="✅" main={String(MOCK_STATS.tasks)} sub="úloh" cls="bg-emerald-100 text-emerald-800" />
          <StatPill emoji="⭐" main={`${MOCK_STATS.accuracy} %`} sub="úspěšnost" cls="bg-violet-100 text-violet-800" />
        </div>
      </div>

      {/* Hero: Procvičovat samostatně */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-400 px-8 py-8 flex flex-col sm:flex-row items-center gap-6 text-white">
        <span className="absolute top-4 right-16 text-white/25 text-2xl pointer-events-none select-none">✦</span>
        <span className="absolute top-10 right-6 text-white/20 text-lg pointer-events-none select-none">+</span>
        <span className="absolute bottom-4 left-1/3 text-white/15 text-sm pointer-events-none select-none">✦</span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold tracking-[0.15em] text-white/60 flex items-center gap-1.5 mb-3">
            <span>✦</span> HLAVNÍ AKCE
          </p>
          <h2 className="font-display text-3xl font-extrabold leading-tight mb-2">Procvičovat samostatně</h2>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            Vyber si předmět a téma — Oli ti připraví cvičení na míru.
          </p>
          <div className="flex flex-wrap gap-2">
            {["matematika", "čeština", "prvouka"].map((subj) => {
              const meta = getSubjectMeta(subj);
              return (
                <button key={subj} onClick={() => navigate("/demo/session")}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white/90 transition-colors shadow-sm">
                  <IllustrationImg src={meta.image} className="h-6 w-6 object-contain" fallback={<span className="text-sm">{meta.emoji}</span>} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-52">
          <button onClick={() => navigate("/demo/session")}
            className="w-full h-12 rounded-2xl bg-white font-bold text-violet-700 hover:bg-white/95 active:scale-[0.98] transition-all flex items-center justify-between px-4 text-sm shadow-md">
            Začít procvičovat <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* Úkoly od rodiče */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
          <span className="text-rose-500">❤️</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground text-base">Úkoly od rodiče</h2>
            <p className="text-xs text-muted-foreground leading-tight">Tady jsou cvičení, která ti zadali doma. Snaž se je splnit do termínu!</p>
          </div>
          <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 leading-none shrink-0">
            {MOCK_ASSIGNMENTS.length}&nbsp;nové
          </span>
        </div>
        {assignmentSubjects.length > 1 && (
          <div className="px-5 pt-3 pb-1 flex flex-wrap gap-1.5">
            <button onClick={() => setAssignmentSubject(null)}
              className={`h-7 px-3 rounded-xl text-xs font-medium border transition-all ${assignmentSubject === null ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
            >Vše</button>
            {assignmentSubjects.map(subj => {
              const meta = getSubjectMeta(subj);
              return (
                <button key={subj} onClick={() => setAssignmentSubject(assignmentSubject === subj ? null : subj)}
                  className={`h-7 pl-1.5 pr-3 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${assignmentSubject === subj ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                >
                  <span className="h-5 w-5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <IllustrationImg src={meta?.image ?? ""} className="h-4 w-4 object-contain" fallback={<span className="text-[11px]">{meta?.emoji ?? "📚"}</span>} />
                  </span>
                  {meta?.label ?? subj}
                </button>
              );
            })}
          </div>
        )}
        <div className="p-4 space-y-3">
          {visibleAssignments.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border/40 bg-slate-50/60 p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <SkillHeader subject={a.subject} skillName={a.skillName} />
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" /> Zadáno {a.assigned_date}
                  </span>
                  {a.due_date && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700">
                      do {a.due_date}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate("/demo/session")}
                className="shrink-0 h-10 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-bold px-4 flex items-center gap-1.5 text-sm transition-all"
              >
                Začít <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Co jsi procvičoval */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
          <span className="text-purple-500">📊</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground text-base">Co jsi procvičoval</h2>
            <p className="text-xs text-muted-foreground leading-tight">Podívej se, jak ti to šlo v poslední době.</p>
          </div>
        </div>
        <div className="px-5 pt-3 pb-1">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 gap-0.5">
            {PERIOD_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setPeriod(opt.value)}
                className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${period === opt.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >{opt.label}</button>
            ))}
          </div>
        </div>
        {skillSubjects.length > 1 && (
          <div className="px-5 pt-2 pb-1 flex flex-wrap gap-1.5">
            <button
              onClick={() => setSkillSubject(null)}
              className={`h-7 px-3 rounded-xl text-xs font-medium border transition-all ${skillSubject === null ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
            >Vše</button>
            {skillSubjects.map(subj => {
              const meta = getSubjectMeta(subj);
              return (
                <button key={subj}
                  onClick={() => setSkillSubject(skillSubject === subj ? null : subj)}
                  className={`h-7 pl-1.5 pr-3 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${skillSubject === subj ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                >
                  <span className="h-5 w-5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <IllustrationImg src={meta?.image ?? ""} className="h-4 w-4 object-contain" fallback={<span className="text-[11px]">{meta?.emoji ?? "📚"}</span>} />
                  </span>
                  {meta?.label ?? subj}
                </button>
              );
            })}
          </div>
        )}
        <div className="p-4 space-y-2">
          {visibleSkills.map((s) => (
            <div key={s.skillId} className="rounded-2xl border border-border/40 bg-slate-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <SkillHeader subject={s.subject} skillId={s.skillId} skillName={s.skillId === "math-add-sub-100" ? "Sčítání a odčítání do 100" : "Vyjmenovaná slova po B"} />
                <span className={`text-[10px] font-bold rounded-full px-2.5 py-1 shrink-0 ${s.badgeCls}`}>{s.badgeText}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${s.barColor} transition-all`} style={{ width: `${s.acc}%` }} />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-600 font-semibold">✓ {s.correct} správně</span>
                <span className="text-rose-500 font-semibold">✗ {s.attempts - s.correct} špatně</span>
                <span className="text-muted-foreground ml-auto">{s.acc} %</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <p className={`text-xs font-medium ${s.acc >= 80 ? "text-emerald-600" : s.acc >= 50 ? "text-sky-600" : s.attempts < 2 ? "text-slate-500" : "text-amber-600"}`}>
                  {skillEvaluation(s.acc, s.attempts, s.skillId.charCodeAt(0) + s.skillId.length)}
                </p>
                {s.lastPracticed && (
                  <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                    Naposledy: {formatLastPracticed(s.lastPracticed)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip dne */}
      <div className="bg-white rounded-3xl px-6 py-5 flex items-center gap-4 shadow-sm border border-black/[0.05]">
        <img src={logoNoText} alt="Oli" className="h-12 w-12 object-contain shrink-0" />
        <div>
          <p className="text-xs font-bold text-orange-500 mb-1">Tip dne</p>
          <p className="font-semibold text-base text-foreground">{tip}</p>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-2">
        Demo verze — data jsou ukázková.
      </p>
    </div>
  );
}
