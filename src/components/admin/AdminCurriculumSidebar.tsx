import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, Search, BookOpen, FolderTree, FileText, Target, RotateCcw } from "lucide-react";
// Target je použitý jen v legendě nahoře — proto zůstává
import type { TopicMetadata } from "@/lib/types";

export interface CurriculumContext {
  subject: string | null;
  category: string | null;
  topic: string | null;
}

interface AdminCurriculumSidebarProps {
  topics: TopicMetadata[];               // filtered by grade
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

  // Stats
  const totalSubjects = subjects.length;
  const totalSkills = topics.length;
  const hasAnySelection = !!(selectedSubject || selectedCategory || selectedTopic || selectedSkill);

  return (
    <div className="h-full flex flex-col bg-muted/30 border-r rounded-lg">
      {/* Header */}
      <div className="p-4 border-b bg-background/50">
        {/* Sidebar header: nadpis + (volitelně) reset */}
        <div className="flex items-center gap-2 px-2 py-1">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">Kurikulum</span>
          {hasAnySelection && (
            <button
              onClick={handleHomeClick}
              className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              title="Zrušit výběr a vrátit se na úvod (Vyber předmět)"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Začátek</span>
            </button>
          )}
        </div>
        <p className="px-2 mt-1 text-xs text-muted-foreground">
          {totalSubjects} {totalSubjects === 1 ? "předmět" : totalSubjects < 5 ? "předměty" : "předmětů"}
          {" · "}
          <span className="font-medium text-foreground">{totalSkills}</span>{" "}
          {totalSkills === 1 ? "podtéma" : totalSkills < 5 ? "podtémata" : "podtémat"}
        </p>
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat v kurikulu…"
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="py-3 px-2 space-y-3">
          {subjects.length === 0 && (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-muted-foreground">
                {query ? "Žádné výsledky" : "Kurikulum je prázdné"}
              </p>
            </div>
          )}
          {/* Legenda úrovní — pomáhá adminovi pochopit, co znamenají odsazení */}
          {!query && subjects.length > 0 && (
            <div className="px-3 py-2.5 text-[10px] leading-tight rounded-md mb-1 space-y-1.5 bg-muted/40">
              <p className="font-semibold text-muted-foreground uppercase tracking-wide">Úrovně:</p>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold">
                  <BookOpen className="h-3 w-3" />Předmět
                </span>
                <span className="text-muted-foreground/50">→</span>
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                  <FolderTree className="h-3 w-3" />Okruh
                </span>
                <span className="text-muted-foreground/50">→</span>
                <span className="inline-flex items-center gap-1 text-sky-700 dark:text-sky-400 font-medium">
                  <FileText className="h-3 w-3" />Téma
                </span>
                <span className="text-muted-foreground/50">→</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <Target className="h-3 w-3" />Podtéma
                </span>
              </div>
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
                {/* Subject (Předmět) — největší font, modré pozadí, výrazný */}
                <button
                  onClick={() => handleSubjectClick(subject)}
                  className={`w-full flex items-start gap-2.5 px-3 py-3.5 text-base rounded-lg transition-colors border-l-4 ${
                    isSubjectActive && !selectedCategory
                      ? "bg-blue-100 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-bold border-blue-600 shadow-sm"
                      : "bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-100/80 dark:hover:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-bold border-transparent"
                  }`}
                  title={`Předmět: ${fmtName(subject)}`}
                >
                  {isSubjectOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                  <BookOpen className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="break-words text-left flex-1 leading-tight">{fmtName(subject)}</span>
                </button>

                {/* Categories */}
                {isSubjectOpen && (
                  <div className="ml-4 mt-2 pl-2 border-l-2 border-border/60 space-y-2">
                    {categories.map((category, catIdx) => {
                      const categoryKey = `${subject}::${category}`;
                      const isCatOpen = expandedCategories.has(categoryKey) || !!query;
                      const isCatActive = selectedSubject === subject && selectedCategory === category;
                      const topicsList = Object.keys(tree[subject][category]).sort();

                      return (
                        <div
                          key={category}
                          className={catIdx > 0 ? "pt-2 border-t border-amber-300/50 dark:border-amber-800/50" : ""}
                        >
                          {/* Category (Okruh) — amber barva, výrazný level chip */}
                          <button
                            onClick={() => handleCategoryClick(subject, category)}
                            className={`w-full flex items-start gap-2 pl-2.5 pr-2 py-2 text-sm rounded-md transition-colors border-l-4 ${
                              isCatActive && !selectedTopic
                                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border-amber-600 shadow-sm"
                                : "hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-800/90 dark:text-amber-400/90 font-semibold border-transparent"
                            }`}
                            title={`Okruh: ${fmtName(category)}`}
                          >
                            {isCatOpen ? (
                              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span className="text-[9px] font-bold tracking-wider px-1 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/40 shrink-0">OKRUH</span>
                            <span className="break-words text-left flex-1 leading-tight">{fmtName(category)}</span>
                          </button>

                          {/* Topics */}
                          {isCatOpen && (
                            <div className="ml-4 mt-2 pl-2 border-l border-border/40 space-y-1.5">
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
                                    {/* Topic (Téma) — sky barva, level chip */}
                                    <button
                                      onClick={() => handleTopicClick(subject, category, topic)}
                                      className={`w-full flex items-start gap-2 pl-2.5 pr-2 py-2 text-sm rounded-md transition-colors border-l-4 ${
                                        isTopicActive && !selectedSkill
                                          ? "bg-sky-100 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-bold border-sky-600 shadow-sm"
                                          : "hover:bg-sky-50 dark:hover:bg-sky-950/20 text-sky-800/85 dark:text-sky-400/85 font-medium border-transparent"
                                      }`}
                                      title={`Téma: ${fmtName(topic)}`}
                                    >
                                      {isTopicOpen ? (
                                        <ChevronDown className="h-3 w-3 shrink-0" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 shrink-0" />
                                      )}
                                      <span className="text-[9px] font-bold tracking-wider px-1 py-0.5 rounded bg-sky-200/60 dark:bg-sky-900/40 shrink-0">TÉMA</span>
                                      <span className="break-words flex-1 text-left leading-tight">
                                        {fmtName(topic)}
                                      </span>
                                      <Badge variant="outline" className="text-[9px] h-4 px-1 shrink-0 font-mono">
                                        {skills.length}
                                      </Badge>
                                    </button>

                                    {/* Skills (Podtémata) — emerald barva, level chip */}
                                    {isTopicOpen && (
                                      <div className="ml-4 mt-1.5 pl-2 border-l border-border/30 space-y-1">
                                        {skills.map((skill) => {
                                          const isSkillActive = selectedSkill?.id === skill.id;
                                          return (
                                            <button
                                              key={skill.id}
                                              onClick={() => handleSkillClick(skill)}
                                              className={`w-full flex items-start gap-2 pl-2.5 pr-2 py-2 text-xs rounded-md transition-colors border-l-4 ${
                                                isSkillActive
                                                  ? "bg-emerald-600 dark:bg-emerald-700 text-white font-bold border-emerald-800 dark:border-emerald-500 shadow-sm"
                                                  : "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-800/80 dark:text-emerald-400/80 border-transparent"
                                              }`}
                                              title={`Podtéma: ${skill.title}`}
                                            >
                                              <span className={`text-[9px] font-bold tracking-wider px-1 py-0.5 rounded shrink-0 ${
                                                isSkillActive ? "bg-white/20" : "bg-emerald-200/60 dark:bg-emerald-900/40"
                                              }`}>PODTÉMA</span>
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
