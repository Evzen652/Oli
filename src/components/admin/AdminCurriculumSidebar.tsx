import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, Search, RotateCcw } from "lucide-react";
import type { TopicMetadata } from "@/lib/types";

// Barva pro vizuální dot per předmět — Notion-vibe minimal indikátor
const SUBJECT_DOT: Record<string, string> = {
  matematika: "bg-violet-500",
  "čeština": "bg-rose-500",
  cestina: "bg-rose-500",
  prvouka: "bg-emerald-500",
  "přírodověda": "bg-amber-500",
  prirodoveda: "bg-amber-500",
  "vlastivěda": "bg-fuchsia-500",
  vlastiveda: "bg-fuchsia-500",
};
const dotFor = (subject: string) =>
  SUBJECT_DOT[subject.toLowerCase()] ?? "bg-slate-400";

export interface CurriculumContext {
  subject: string | null;
  category: string | null;
  topic: string | null;
}

interface AdminCurriculumSidebarProps {
  topics: TopicMetadata[];               // filtered by grade
  /** Aktivní filtr ročníku — pro zobrazení badge v hlavičce sidebaru */
  gradeFilter?: number | null;
  selectedSubject: string | null;
  selectedCategory: string | null;
  selectedTopic: string | null;
  selectedSkill: TopicMetadata | null;
  onSelectSubject: (subject: string | null) => void;
  onSelectCategory: (category: string | null) => void;
  onSelectTopic: (topic: string | null) => void;
  onSelectSkill: (skill: TopicMetadata | null) => void;
}

export function AdminCurriculumSidebar({
  topics,
  gradeFilter,
  selectedSubject,
  selectedCategory,
  selectedTopic,
  selectedSkill,
  onSelectSubject,
  onSelectCategory,
  onSelectTopic,
  onSelectSkill,
}: AdminCurriculumSidebarProps) {
  const [query, setQuery] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set(selectedSubject ? [selectedSubject] : []),
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(selectedSubject && selectedCategory ? [`${selectedSubject}::${selectedCategory}`] : []),
  );
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set(
      selectedSubject && selectedCategory && selectedTopic
        ? [`${selectedSubject}::${selectedCategory}::${selectedTopic}`]
        : [],
    ),
  );

  // Build tree structure
  const tree = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = q
      ? topics.filter(
          (t) =>
            t.subject.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.topic.toLowerCase().includes(q) ||
            t.title.toLowerCase().includes(q),
        )
      : topics;

    const byS: Record<string, Record<string, Record<string, TopicMetadata[]>>> = {};
    for (const t of filtered) {
      if (!byS[t.subject]) byS[t.subject] = {};
      if (!byS[t.subject][t.category]) byS[t.subject][t.category] = {};
      if (!byS[t.subject][t.category][t.topic]) byS[t.subject][t.category][t.topic] = [];
      byS[t.subject][t.category][t.topic].push(t);
    }
    return byS;
  }, [topics, query]);

  const toggleSubject = (s: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const toggleCategory = (s: string, c: string) => {
    const key = `${s}::${c}`;
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleTopic = (s: string, c: string, t: string) => {
    const key = `${s}::${c}::${t}`;
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSubjectClick = (subject: string) => {
    onSelectSubject(subject);
    // CRITICAL: reset všech podřazených, jinak pravá strana zůstane
    // na předchozí vybrané dovednosti / tématu
    onSelectCategory(null);
    onSelectTopic(null);
    onSelectSkill(null);
    toggleSubject(subject);
  };

  const handleCategoryClick = (subject: string, category: string) => {
    onSelectSubject(subject);
    onSelectCategory(category);
    onSelectTopic(null);
    onSelectSkill(null);
    setExpandedSubjects((prev) => new Set(prev).add(subject));
    toggleCategory(subject, category);
  };

  const handleTopicClick = (subject: string, category: string, topic: string) => {
    onSelectSubject(subject);
    onSelectCategory(category);
    onSelectTopic(topic);
    onSelectSkill(null);
    setExpandedSubjects((prev) => new Set(prev).add(subject));
    setExpandedCategories((prev) => new Set(prev).add(`${subject}::${category}`));
    toggleTopic(subject, category, topic);
  };

  const handleSkillClick = (skill: TopicMetadata) => {
    onSelectSubject(skill.subject);
    onSelectCategory(skill.category);
    onSelectTopic(skill.topic);
    onSelectSkill(skill);
  };

  const handleHomeClick = () => {
    onSelectSkill(null);
    onSelectTopic(null);
    onSelectCategory(null);
    onSelectSubject(null);
  };

  const subjects = Object.keys(tree).sort();

  // Stats — počty na všech úrovních (Subject → Category → Topic → Skill)
  const totalSubjects = subjects.length;
  let totalCategories = 0;
  let totalTopics = 0;
  for (const subj of subjects) {
    const cats = Object.keys(tree[subj]);
    totalCategories += cats.length;
    for (const cat of cats) {
      totalTopics += Object.keys(tree[subj][cat]).length;
    }
  }
  const totalSkills = topics.length;
  const hasAnySelection = !!(selectedSubject || selectedCategory || selectedTopic || selectedSkill);

  // Skloňování pomocí helperu — Czech: 1, 2-4, 5+
  const plural = (n: number, one: string, few: string, many: string) =>
    n === 1 ? one : n < 5 ? few : many;

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-2xl shadow-soft-1 overflow-hidden">
      {/* Header — minimální Notion-vibe */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Kurikulum
          </p>
          {hasAnySelection && (
            <button
              onClick={handleHomeClick}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              title="Zrušit výběr a vrátit se na úvod"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Začátek</span>
            </button>
          )}
        </div>
        {gradeFilter != null && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {gradeFilter}. ročník · <span className="font-medium text-foreground">{totalSkills}</span>{" "}
            {plural(totalSkills, "podtéma", "podtémata", "podtémat")}
          </p>
        )}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat předmět, téma…"
            className="pl-9 h-9 text-sm rounded-xl border-border bg-muted/40 placeholder:text-muted-foreground/70 focus-visible:bg-card"
          />
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4 pt-1 space-y-0.5">
          {subjects.length === 0 && (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-muted-foreground">
                {query ? "Žádné výsledky" : "Kurikulum je prázdné"}
              </p>
            </div>
          )}
          {subjects.map((subject) => {
            const isSubjectOpen = expandedSubjects.has(subject) || !!query;
            const isSubjectActive = selectedSubject === subject;
            const categories = Object.keys(tree[subject]).sort();
            // První písmeno velké, zbytek beze změny — žádný capitalize CSS
            const fmtName = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

            return (
              <div key={subject}>
                {/* Subject (Předmět) — color dot, větší typografie */}
                <button
                  onClick={() => handleSubjectClick(subject)}
                  className={`group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
                    isSubjectActive && !selectedCategory
                      ? "bg-accent/70 text-foreground"
                      : "hover:bg-muted/60 text-foreground"
                  }`}
                  title={`Předmět: ${fmtName(subject)}`}
                >
                  {isSubjectOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className={`h-2 w-2 rounded-full shrink-0 ${dotFor(subject)}`} aria-hidden />
                  <span className="break-words text-left flex-1 leading-tight font-display font-semibold text-[14px]">
                    {fmtName(subject)}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                    {Object.values(tree[subject]).reduce((acc, cat) => acc + Object.values(cat).reduce((a, b) => a + b.length, 0), 0)}
                  </span>
                </button>

                {/* Categories */}
                {isSubjectOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {categories.map((category) => {
                      const categoryKey = `${subject}::${category}`;
                      const isCatOpen = expandedCategories.has(categoryKey) || !!query;
                      const isCatActive = selectedSubject === subject && selectedCategory === category;
                      const topicsList = Object.keys(tree[subject][category]).sort();
                      const catSkillCount = topicsList.reduce((a, t) => a + tree[subject][category][t].length, 0);

                      return (
                        <div key={category}>
                          {/* Category (Okruh) — minimal text */}
                          <button
                            onClick={() => handleCategoryClick(subject, category)}
                            className={`group w-full flex items-center gap-2 pl-2.5 pr-2 py-1.5 text-[13px] rounded-lg transition-colors ${
                              isCatActive && !selectedTopic
                                ? "bg-accent/60 text-foreground font-semibold"
                                : "hover:bg-muted/60 text-foreground/80 font-medium"
                            }`}
                            title={`Okruh: ${fmtName(category)}`}
                          >
                            {isCatOpen ? (
                              <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                            )}
                            <span className="break-words text-left flex-1 leading-tight">{fmtName(category)}</span>
                            <span className="text-[11px] font-normal text-muted-foreground tabular-nums">
                              {catSkillCount}
                            </span>
                          </button>

                          {/* Topics */}
                          {isCatOpen && (
                            <div className="ml-4 mt-0.5 space-y-0.5">
                              {topicsList.map((topic) => {
                                const topicKey = `${subject}::${category}::${topic}`;
                                const isTopicOpen = expandedTopics.has(topicKey) || !!query;
                                const isTopicActive =
                                  selectedSubject === subject &&
                                  selectedCategory === category &&
                                  selectedTopic === topic;
                                const skills = tree[subject][category][topic];

                                return (
                                  <div key={topic}>
                                    {/* Topic (Téma) */}
                                    <button
                                      onClick={() => handleTopicClick(subject, category, topic)}
                                      className={`group w-full flex items-center gap-2 pl-2 pr-2 py-1.5 text-[13px] rounded-lg transition-colors ${
                                        isTopicActive && !selectedSkill
                                          ? "bg-accent/60 text-foreground font-semibold"
                                          : "hover:bg-muted/60 text-foreground/75"
                                      }`}
                                      title={`Téma: ${fmtName(topic)}`}
                                    >
                                      {isTopicOpen ? (
                                        <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                                      )}
                                      <span className="break-words flex-1 text-left leading-tight">
                                        {fmtName(topic)}
                                      </span>
                                      <span className="text-[11px] text-muted-foreground tabular-nums">
                                        {skills.length}
                                      </span>
                                    </button>

                                    {/* Skills (Podtémata) — neutrální mini řádky */}
                                    {isTopicOpen && (
                                      <div className="ml-4 mt-0.5 space-y-0.5">
                                        {skills.map((skill) => {
                                          const isSkillActive = selectedSkill?.id === skill.id;
                                          return (
                                            <button
                                              key={skill.id}
                                              onClick={() => handleSkillClick(skill)}
                                              className={`w-full flex items-center gap-2 pl-2 pr-2 py-1.5 text-[12.5px] rounded-lg transition-colors ${
                                                isSkillActive
                                                  ? "bg-primary/10 text-primary font-semibold"
                                                  : "hover:bg-muted/60 text-foreground/70"
                                              }`}
                                              title={`Podtéma: ${skill.title}`}
                                            >
                                              <span className={`h-1 w-1 rounded-full shrink-0 ${
                                                isSkillActive ? "bg-primary" : "bg-muted-foreground/40"
                                              }`} aria-hidden />
                                              <span className="break-words text-left flex-1 leading-tight">
                                                {skill.title}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
