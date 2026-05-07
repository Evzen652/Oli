import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReadableSkillName } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { logoNoText } from "@/components/OlyLogo";
import { CalendarDays, CalendarRange, History, ArrowLeft, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

type Range = "week" | "month" | "all";

const REPORTS: Record<Range, {
  summary: string;
  stats: { days: number; attempts: number; accuracy: number; withHelp: number; wrong: number };
  rangeLabel: string;
  recommendations: string;
  skills: { skill: string; subject: string; attempts: number; correct: number }[];
}> = {
  week: {
    summary: "Tomáš tento týden pracoval aktivně — 3 dny. V matematice dělá chyby ve většině příkladů, v češtině mu vyjmenovaná slova po B jdou výrazně lépe.",
    stats: { days: 3, attempts: 14, accuracy: 29, withHelp: 1, wrong: 8 },
    rangeLabel: "Tento týden",
    recommendations: "Zadejte 2–3 krátká cvičení ze sčítání do 100 — tohle téma teď nejvíce brzdí celkové výsledky. Vyjmenovaná slova po B jsou skoro hotová, stačí jedno opakování.",
    skills: [
      { skill: "math-add-sub-100", subject: "matematika", attempts: 6, correct: 0 },
      { skill: "math-compare-natural-numbers-100", subject: "matematika", attempts: 5, correct: 1 },
      { skill: "cz-vyjmenovana-slova-b", subject: "čeština", attempts: 3, correct: 2 },
    ],
  },
  month: {
    summary: "Za poslední měsíc Tomáš procvičoval 6 dní. Matematika je hlavní výzva — úspěšnost 32 %. V češtině se za poslední 2 týdny znatelně zlepšil.",
    stats: { days: 6, attempts: 31, accuracy: 32, withHelp: 3, wrong: 18 },
    rangeLabel: "Tento měsíc",
    recommendations: "Zaměřte se na matematiku — zadejte 2 úkoly týdně. Sčítání a porovnávání čísel spolu souvisí, procvičujte je střídavě.",
    skills: [
      { skill: "math-add-sub-100", subject: "matematika", attempts: 12, correct: 2 },
      { skill: "math-compare-natural-numbers-100", subject: "matematika", attempts: 11, correct: 3 },
      { skill: "cz-vyjmenovana-slova-b", subject: "čeština", attempts: 8, correct: 5 },
    ],
  },
  all: {
    summary: "Od začátku Tomáš splnil 31 úloh za 6 dní. Sčítání do 100 je trvale nejslabší místo. V češtině je viditelný pokrok — vyjmenovaná slova se od začátku zlepšila z 33 % na 67 %.",
    stats: { days: 6, attempts: 31, accuracy: 32, withHelp: 3, wrong: 18 },
    rangeLabel: "Celkem",
    recommendations: "Sčítání do 100 je priorita — krátká, pravidelná procvičování (10–15 min) jsou účinnější než jedno dlouhé. Češtinu dál povzbuzujte, jde to správným směrem.",
    skills: [
      { skill: "math-add-sub-100", subject: "matematika", attempts: 12, correct: 2 },
      { skill: "math-compare-natural-numbers-100", subject: "matematika", attempts: 11, correct: 3 },
      { skill: "cz-vyjmenovana-slova-b", subject: "čeština", attempts: 8, correct: 5 },
    ],
  },
};

const RANGE_TABS: { id: Range; label: string; icon: React.ReactNode }[] = [
  { id: "week", label: "Týdenní", icon: <CalendarDays className="h-4 w-4" /> },
  { id: "month", label: "Měsíční", icon: <CalendarRange className="h-4 w-4" /> },
  { id: "all", label: "Od začátku", icon: <History className="h-4 w-4" /> },
];

const RANGE_HEADING: Record<Range, string> = {
  week: "Týdenní hodnocení",
  month: "Měsíční hodnocení",
  all: "Hodnocení od začátku",
};

export default function DemoReport() {
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>("week");
  const [chartSubject, setChartSubject] = useState<string | null>(null);
  const report = REPORTS[range];
  const title = `${RANGE_HEADING[range]} — Tomáš`;

  // Seskup skills po předmětech
  const bySubject = new Map<string, typeof report.skills>();
  for (const s of report.skills) {
    if (!bySubject.has(s.subject)) bySubject.set(s.subject, []);
    bySubject.get(s.subject)!.push(s);
  }
  const subjectOrder = ["matematika", "čeština", "prvouka", "přírodověda", "vlastivěda", "ostatní"];
  const sortedSubjects = Array.from(bySubject.keys()).sort(
    (a, b) => (subjectOrder.indexOf(a) === -1 ? 99 : subjectOrder.indexOf(a)) - (subjectOrder.indexOf(b) === -1 ? 99 : subjectOrder.indexOf(b))
  );

  // Data pro sloupcový graf
  const allChartData = report.skills.map((s) => {
    const acc = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
    const full = getReadableSkillName(s.skill);
    const short = full.length > 14 ? full.slice(0, 12) + "…" : full;
    const color = acc >= 80 ? "#10b981" : acc >= 50 ? "#f59e0b" : "#f43f5e";
    return { name: full, short, acc, color, correct: s.correct, attempts: s.attempts, subject: s.subject };
  });
  const chartSubjects = Array.from(new Set(allChartData.map((d) => d.subject)));
  const chartData = chartSubject ? allChartData.filter((d) => d.subject === chartSubject) : allChartData;
  const manyBars = chartData.length > 7;

  return (
    <div className="min-h-screen bg-[#fdf8f2] px-4 pb-12 pt-4">
      <div className="mx-auto max-w-2xl space-y-4">

        {/* Header */}
        <div className="bg-white rounded-3xl px-6 py-5 flex items-center gap-4 shadow-sm border border-black/[0.05]">
          <button
            onClick={() => navigate("/demo")}
            className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <img src={logoNoText} alt="Oli" className="h-10 w-10 object-contain shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-foreground leading-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Ukázkové hodnocení · skutečné generuje AI z vašich dat</p>
          </div>
        </div>

        {/* Range tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] p-1.5 grid grid-cols-3 gap-1">
          {RANGE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRange(tab.id)}
              className={`flex items-center justify-center gap-1.5 rounded-2xl py-2.5 px-2 text-sm font-medium transition-all ${
                range === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Stats + AI shrnutí */}
        {(() => {
          const acc = report.stats.accuracy;
          const accColor = acc >= 80 ? "text-emerald-600" : acc >= 50 ? "text-amber-600" : "text-rose-600";
          const accBg = acc >= 80 ? "bg-emerald-50 border-emerald-200" : acc >= 50 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200";
          const accLabel = acc >= 80 ? "Skvělá úspěšnost" : acc >= 50 ? "Zlepšuje se" : "Potřebuje pomoc";
          return (
            <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-border/40">
                <div className="px-5 py-5 text-center">
                  <p className="text-3xl font-extrabold text-foreground tabular-nums">{report.stats.days}</p>
                  <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground mt-1">DNY</p>
                </div>
                <div className="px-5 py-5 text-center">
                  <p className="text-3xl font-extrabold text-foreground tabular-nums">{report.stats.attempts}</p>
                  <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground mt-1">ÚLOH</p>
                </div>
                <div className="px-5 py-5 text-center">
                  <p className={`text-3xl font-extrabold tabular-nums ${accColor}`}>{acc} %</p>
                  <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground mt-1">ÚSPĚŠNOST</p>
                </div>
              </div>
              {/* Verdict chip + AI souhrn */}
              <div className="border-t border-border/40 px-5 py-4 space-y-2.5">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${accBg} ${accColor}`}>
                  {accLabel}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{report.summary}</p>
              </div>
            </div>
          );
        })()}

        {/* Přehled témat — sloupcový graf */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40">
            <h2 className="font-bold text-base text-foreground">Přehled témat</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Úspěšnost v každém procvičovaném tématu (% správných odpovědí)</p>
          </div>
          {chartSubjects.length > 1 && (
            <div className="px-5 pt-4 pb-1 flex flex-wrap gap-1.5">
              <button
                onClick={() => setChartSubject(null)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${!chartSubject ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >Vše</button>
              {chartSubjects.map((subj) => {
                const meta = getSubjectMeta(subj);
                return (
                  <button
                    key={subj}
                    onClick={() => setChartSubject(chartSubject === subj ? null : subj)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1 ${chartSubject === subj ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    <span>{meta?.emoji}</span>
                    {meta?.label ?? subj}
                  </button>
                );
              })}
            </div>
          )}
          <div className="px-4 pt-4 pb-3">
            <ResponsiveContainer width="100%" height={manyBars ? 260 : 220}>
              <BarChart data={chartData} barSize={manyBars ? undefined : 44} margin={{ top: 8, right: 8, left: 0, bottom: manyBars ? 68 : 4 }}>
                <XAxis
                  dataKey="short"
                  tick={{ fontSize: 10, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={manyBars ? -45 : 0}
                  textAnchor={manyBars ? "end" : "middle"}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fontSize: 11, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                  width={44}
                />
                <ReferenceLine y={80} stroke="#10b981" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: "cíl 80 %", position: "insideTopRight", fontSize: 10, fill: "#10b981" }} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", radius: 6 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white border border-border rounded-xl shadow-md px-3 py-2 text-xs space-y-0.5">
                        <p className="font-semibold text-foreground">{d.name}</p>
                        <p className="text-muted-foreground">{d.correct} z {d.attempts} správně</p>
                        <p className="font-bold" style={{ color: d.color }}>{d.acc} %</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="acc" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Legenda */}
            <div className="flex items-center justify-center gap-5 pt-1 pb-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block shrink-0" />Zvládnuto (≥ 80 %)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-400 inline-block shrink-0" />Zlepšuje se (50–79 %)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-rose-500 inline-block shrink-0" />Potřebuje pomoc</span>
            </div>
          </div>
          {/* Přehled po předmětech */}
          <div className="border-t border-border/40 divide-y divide-border/40">
            {sortedSubjects.map((subj) => {
              const meta = getSubjectMeta(subj);
              const skills = bySubject.get(subj)!;
              return (
                <div key={subj}>
                  {/* Hlavička předmětu */}
                  <div className="flex items-center gap-2.5 px-5 py-3 bg-muted/30">
                    <IllustrationImg src={meta.image} alt={meta.label} className="h-7 w-7 object-contain shrink-0" fallback={<span className="text-xl">{meta.emoji}</span>} />
                    <p className="font-bold text-sm text-foreground">{meta.label}</p>
                  </div>
                  {/* Témata */}
                  <div className="divide-y divide-border/30">
                    {skills.map((s) => {
                      const acc = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
                      const textColor = acc >= 80 ? "text-emerald-700" : acc >= 50 ? "text-amber-600" : "text-rose-600";
                      const dotColor = acc >= 80 ? "bg-emerald-500" : acc >= 50 ? "bg-amber-400" : "bg-rose-500";
                      return (
                        <div key={s.skill} className="flex items-center justify-between px-5 py-3 gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
                            <p className="text-sm text-foreground truncate">{getReadableSkillName(s.skill)}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">{s.correct}/{s.attempts}</span>
                            <span className={`text-sm font-bold tabular-nums w-12 text-right ${textColor}`}>{acc} %</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Co teď */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40">
            <h2 className="font-bold text-base text-foreground">Co teď?</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Doporučení na základě výsledků</p>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-foreground leading-relaxed">{report.recommendations}</p>
            <button
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-between px-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm"
              onClick={() => navigate("/demo")}
            >
              Zadat úkol Tomášovi
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            className="h-11 rounded-2xl bg-white border border-border text-foreground font-semibold text-sm px-5 flex items-center gap-2 hover:bg-muted/50 active:scale-[0.98] transition-all shadow-sm"
            onClick={() => navigate("/demo")}
          >
            <ArrowLeft className="h-4 w-4" />
            Zpět do demo
          </button>
          <button
            className="h-11 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm px-6 flex items-center gap-2 active:scale-[0.98] transition-all shadow-md"
            onClick={() => navigate("/auth")}
          >
            Registrace zdarma
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
