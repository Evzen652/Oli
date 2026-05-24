/**
 * Admin stránka — RVP strom (všechny ročníky)
 */

import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, MinusCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getNodesByGrade } from "@/content/curriculum";
import { GRADE_4_TOPICS } from "@/content/grade-4";
import type { CurriculumNode } from "@/content/curriculum";
import type { TopicMetadata } from "@/lib/types";

// ── Implementovaný obsah per ročník ───────────────────────────────────
// Až přibydou další ročníky, stačí sem přidat import a záznam do mapy.

const TOPICS_BY_GRADE: Record<number, TopicMetadata[]> = {
  4: GRADE_4_TOPICS,
};

// ── Statusy ──────────────────────────────────────────────────────────

type Status = "done" | "skeleton" | "missing";

function getStatus(node: CurriculumNode, topics: TopicMetadata[]): Status {
  const topic = topics.find((t) => t.rvpNodeId === node.id);
  if (!topic) return "missing";
  return topic.generator(1).length > 0 ? "done" : "skeleton";
}

const STATUS: Record<Status, {
  label: string;
  icon: React.ReactNode;
  row: string;
  badge: string;
}> = {
  done: {
    label: "Hotovo",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    row: "hover:bg-emerald-50/40",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  skeleton: {
    label: "Připraveno k implementaci",
    icon: <Circle className="h-3.5 w-3.5 text-amber-400" />,
    row: "hover:bg-amber-50/40",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  missing: {
    label: "Chybí",
    icon: <MinusCircle className="h-3.5 w-3.5 text-gray-300" />,
    row: "hover:bg-gray-50",
    badge: "bg-gray-100 text-gray-400 border-gray-200",
  },
};

// ── Datová vrstva ──────────────────────────────────────────────────────

interface SubtopicNode { node: CurriculumNode; status: Status }
interface TopicGroup   { topicSlug: string; topicLabel: string; subtopics: SubtopicNode[] }
interface AreaGroup    { areaSlug: string; areaLabel: string; topics: TopicGroup[] }
interface SubjectGroup {
  subjectSlug: string;
  subjectLabel: string;
  areas: AreaGroup[];
  stats: { done: number; skeleton: number; missing: number; total: number };
}

function buildTree(nodes: CurriculumNode[], topics: TopicMetadata[]): SubjectGroup[] {
  const map = new Map<string, SubjectGroup>();

  for (const node of nodes) {
    if (!map.has(node.subject)) {
      map.set(node.subject, {
        subjectSlug: node.subject,
        subjectLabel: node.labels.subject,
        areas: [],
        stats: { done: 0, skeleton: 0, missing: 0, total: 0 },
      });
    }
    const subj = map.get(node.subject)!;

    let area = subj.areas.find((a) => a.areaSlug === node.area);
    if (!area) { area = { areaSlug: node.area, areaLabel: node.labels.area, topics: [] }; subj.areas.push(area); }

    let topic = area.topics.find((t) => t.topicSlug === node.topic);
    if (!topic) { topic = { topicSlug: node.topic, topicLabel: node.labels.topic, subtopics: [] }; area.topics.push(topic); }

    const status = getStatus(node, topics);
    topic.subtopics.push({ node, status });
    subj.stats[status]++;
    subj.stats.total++;
  }

  return [...map.values()];
}

// ── Barvy předmětů ────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, {
  border: string;   // left border předmětu
  areaBg: string;   // pozadí okruhu
  areaText: string; // text okruhu
  dot: string;      // tečka v overview
}> = {
  matematika:   { border: "border-l-blue-500",   areaBg: "bg-blue-50/60 border-blue-100",    areaText: "text-blue-800",   dot: "bg-blue-500"   },
  "cesky-jazyk":{ border: "border-l-rose-500",   areaBg: "bg-rose-50/60 border-rose-100",    areaText: "text-rose-800",   dot: "bg-rose-500"   },
  vlastiveda:   { border: "border-l-amber-500",  areaBg: "bg-amber-50/60 border-amber-100",  areaText: "text-amber-800",  dot: "bg-amber-500"  },
  prirodoveda:  { border: "border-l-teal-500",   areaBg: "bg-teal-50/60 border-teal-100",    areaText: "text-teal-800",   dot: "bg-teal-500"   },
  informatika:  { border: "border-l-violet-500", areaBg: "bg-violet-50/60 border-violet-100",areaText: "text-violet-800", dot: "bg-violet-500" },
};

const DEFAULT_COLOR = { border: "border-l-gray-400", areaBg: "bg-gray-50/60 border-gray-100", areaText: "text-gray-700", dot: "bg-gray-400" };

function subjectColor(slug: string) {
  return SUBJECT_COLORS[slug] ?? DEFAULT_COLOR;
}

// ── Česká pluralizace ──────────────────────────────────────────────────

import { pluralWithNumber as plural } from "@/lib/czechGrammar";

// ── UI komponenty ──────────────────────────────────────────────────────

function ProgressBar({ done, total, colorClass = "bg-emerald-500" }: { done: number; total: number; colorClass?: string }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">{done}/{total}</span>
    </div>
  );
}

function SubtopicRow({ item }: { item: SubtopicNode }) {
  return (
    <div className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg px-3 py-2 transition-colors ${STATUS[item.status].row}`}>
      <span className="shrink-0">{STATUS[item.status].icon}</span>
      <span className="text-sm text-foreground truncate">{item.node.labels.subtopic}</span>
    </div>
  );
}

function TopicSection({ topic, defaultOpen = false }: { topic: TopicGroup; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const done = topic.subtopics.filter((s) => s.status === "done").length;
  return (
    <div>
      <button
        className="flex w-full items-center gap-2 py-1.5 pl-1 text-left group rounded-md hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </span>
        <span className="text-[13px] font-medium text-foreground/75 group-hover:text-foreground transition-colors flex-1">
          {topic.topicLabel}
        </span>
        <span className="text-[11px] tabular-nums text-muted-foreground/60">{done}/{topic.subtopics.length}</span>
      </button>
      {open && (
        <div className="mt-0.5 ml-3 space-y-0.5">
          {topic.subtopics.map((s) => <SubtopicRow key={s.node.id} item={s} />)}
        </div>
      )}
    </div>
  );
}

function AreaSection({ area, color, defaultOpen = false }: { area: AreaGroup; color: ReturnType<typeof subjectColor>; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const allSubs = area.topics.flatMap((t) => t.subtopics);
  const done = allSubs.filter((s) => s.status === "done").length;
  return (
    <div className={`rounded-xl border overflow-hidden ${color.areaBg}`}>
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:brightness-95 transition-all"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={color.areaText}>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
        <span className={`flex-1 text-[13px] font-semibold ${color.areaText}`}>{area.areaLabel}</span>
        <span className="text-[11px] tabular-nums text-muted-foreground">{done}/{allSubs.length}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 space-y-3 border-t border-black/5 bg-white/50">
          {area.topics.map((topic) => (
            <TopicSection key={topic.topicSlug} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubjectSection({ subject, id, expandAll }: { subject: SubjectGroup; id?: string; expandAll: boolean }) {
  const [open, setOpen] = useState(true);
  const { done, skeleton, missing, total } = subject.stats;
  const color = subjectColor(subject.subjectSlug);
  return (
    <div id={id} className={`rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden border-l-4 ${color.border}`}>
      <button
        className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-muted-foreground shrink-0">
          {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-base font-bold text-foreground">{subject.subjectLabel}</h2>
            <span className="text-xs text-muted-foreground">{total} podtémat</span>
          </div>
          <ProgressBar
            done={done} total={total}
            colorClass={done === total && total > 0 ? "bg-emerald-500" : done > 0 ? "bg-amber-400" : "bg-gray-300"}
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-semibold">
          {done > 0 && <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle2 className="h-3 w-3" />{done}</span>}
          {skeleton > 0 && <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 bg-amber-100 text-amber-700 border-amber-200"><Circle className="h-3 w-3" />{skeleton}</span>}
          {missing > 0 && <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 bg-gray-100 text-gray-400 border-gray-200"><MinusCircle className="h-3 w-3" />{missing}</span>}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-border/30 pt-4">
          {subject.areas.map((area) => (
            <AreaSection key={area.areaSlug} area={area} color={color} defaultOpen={expandAll} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Přehled předmětů ───────────────────────────────────────────────────

function SubjectOverview({ tree }: { tree: SubjectGroup[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {tree.map((subject) => {
        const { done, total } = subject.stats;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const allDone = done === total && total > 0;
        const anyDone = done > 0;
        return (
          <a
            key={subject.subjectSlug}
            href={`#subj-${subject.subjectSlug}`}
            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card px-4 py-3 hover:bg-muted/30 transition-colors no-underline"
          >
            <span className="text-[13px] font-semibold text-foreground leading-tight">{subject.subjectLabel}</span>
            <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full shrink-0 ${subjectColor(subject.subjectSlug).dot}`} />{plural(subject.areas.length, "okruh", "okruhy", "okruhů")}</span>
              <span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full shrink-0 opacity-70 ${subjectColor(subject.subjectSlug).dot}`} />{plural(subject.areas.flatMap(a => a.topics).length, "téma", "témata", "témat")}</span>
              <span className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full shrink-0 opacity-40 ${subjectColor(subject.subjectSlug).dot}`} />{plural(total, "podtéma", "podtémata", "podtémat")}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${allDone ? "bg-emerald-500" : anyDone ? "bg-amber-400" : "bg-gray-200"}`}
                style={{ width: `${Math.max(pct, pct > 0 ? 4 : 0)}%` }}
              />
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground font-medium">{done}/{total} hotovo · {pct} %</span>
          </a>
        );
      })}
    </div>
  );
}

// ── Legenda ────────────────────────────────────────────────────────────

const LEGEND_ITEMS: { status: Status; label: string; tooltip: string }[] = [
  {
    status: "done",
    label: "Připraveno",
    tooltip: "Téma má hotové úlohy — žáci si ho mohou procvičovat.",
  },
  {
    status: "skeleton",
    label: "Připraveno k implementaci",
    tooltip: "Téma je v systému zaregistrované, ale úlohy k němu ještě nebyly napsány.",
  },
  {
    status: "missing",
    label: "Chybí",
    tooltip: "Téma existuje v RVP (vzdělávacím programu), ale zatím nebylo do aplikace vůbec přidáno.",
  },
];

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
      <span className="font-semibold text-foreground/50 text-xs uppercase tracking-wide">Legenda</span>
      {LEGEND_ITEMS.map(({ status, label, tooltip }) => (
        <Tooltip key={status} delayDuration={100}>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1.5 cursor-default">
              {STATUS[status].icon}
              <span>{label}</span>
              <Info className="h-3 w-3 text-muted-foreground/40" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs text-sm">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

// ── Přepínač ročníku ───────────────────────────────────────────────────

function GradePicker({ grade, onChange }: { grade: number; onChange: (g: number) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground shrink-0">Ročník:</span>
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((g) => {
          const hasContent = !!TOPICS_BY_GRADE[g];
          const active = g === grade;
          return (
            <button
              key={g}
              onClick={() => onChange(g)}
              className={`relative h-8 w-8 rounded-lg text-sm font-semibold transition-colors
                ${active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-foreground/70 hover:bg-muted"
                }`}
            >
              {g}
              {hasContent && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border-2 border-background" />
              )}
            </button>
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">
        {TOPICS_BY_GRADE[grade]
          ? `— obsah implementován`
          : `— obsah zatím chybí`}
      </span>
    </div>
  );
}

// ── Strom s expand/collapse kontrolou ────────────────────────────────

function ExpandableTree({ tree }: { tree: SubjectGroup[] }) {
  const [expandAll, setExpandAll] = useState(false);
  const [key, setKey] = useState(0); // remount pro reset stavu

  const toggle = (expand: boolean) => {
    setExpandAll(expand);
    setKey((k) => k + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Detail stromu</p>
        <div className="flex gap-2">
          <button
            onClick={() => toggle(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
          >
            Rozbalit vše
          </button>
          <button
            onClick={() => toggle(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
          >
            Sbalit vše
          </button>
        </div>
      </div>
      {tree.map((subject) => (
        <SubjectSection
          key={`${subject.subjectSlug}-${key}`}
          subject={subject}
          id={`subj-${subject.subjectSlug}`}
          expandAll={expandAll}
        />
      ))}
    </div>
  );
}

// ── Hlavní stránka ────────────────────────────────────────────────────

export default function AdminRvpTree() {
  const [grade, setGrade] = useState(4);

  const topics = TOPICS_BY_GRADE[grade] ?? [];
  const nodes  = useMemo(() => getNodesByGrade(grade), [grade]);
  const tree   = useMemo(() => buildTree(nodes, topics), [nodes, topics]);

  const totalStats = useMemo(() => {
    const done     = topics.filter((t) => t.generator(1).length > 0).length;
    const skeleton = topics.filter((t) => t.generator(1).length === 0).length;
    const total    = nodes.length;
    const missing  = total - topics.length;
    return { done, skeleton, missing, total };
  }, [nodes, topics]);

  const pct = totalStats.total > 0 ? Math.round((totalStats.done / totalStats.total) * 100) : 0;

  return (
    <AdminLayout breadcrumbs={[{ label: "Editor obsahu", path: "/admin" }, { label: "Přehled obsahu (RVP)" }]}>
      <div className="space-y-6 max-w-5xl">

        {/* Záhlaví */}
        <div>
          <h1 className="text-2xl font-black text-foreground">RVP strom</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zdroj: <code className="text-xs bg-muted px-1 rounded">data/rvp_data.json</code>
            {" · "}841 podtémat · ročníky 1–9
          </p>
        </div>

        {/* Přepínač ročníku */}
        <GradePicker grade={grade} onChange={setGrade} />

        {/* Celkové stats */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Hotovo",  value: totalStats.done,     icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
              { label: "Připraveno k implementaci", value: totalStats.skeleton, icon: <Circle className="h-5 w-5 text-amber-400" />,         color: "text-amber-600",   bg: "bg-amber-50 border-amber-200"   },
              { label: "Chybí",   value: totalStats.missing,  icon: <MinusCircle className="h-5 w-5 text-gray-300" />,     color: "text-gray-500",    bg: "bg-gray-50 border-gray-200"     },
            ].map((c) => (
              <div key={c.label} className={`rounded-xl border p-4 flex items-start gap-3 ${c.bg}`}>
                <div className="mt-0.5 shrink-0">{c.icon}</div>
                <div>
                  <p className={`text-3xl font-black leading-none ${c.color}`}>{c.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {totalStats.total > 0 ? Math.round((c.value / totalStats.total) * 100) : 0} % z {totalStats.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-semibold text-foreground shrink-0 tabular-nums">{pct} % hotovo</span>
          </div>
        </div>

        {/* Přehled předmětů */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">
            Předměty v {grade}. ročníku
          </p>
          <SubjectOverview tree={tree} />
        </div>

        {/* Legenda */}
        <Legend />

        {/* Strom */}
        <ExpandableTree tree={tree} />

      </div>
    </AdminLayout>
  );
}
