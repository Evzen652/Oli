import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, Search, BookOpen, FolderTree, FileText, Target } from "lucide-react";
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
    toggleSubject(subject);
  };

  const handleCategoryClick = (subject: string, category: string) => {
    onSelectSubject(subject);
    onSelectCategory(category);
    setExpandedSubjects((prev) => new Set(prev).add(subject));
    toggleCategory(subject, category);
  };

  const handleTopicClick = (subject: string, category: string, topic: string) => {
    onSelectSubject(subject);
    onSelectCategory(category);
    onSelectTopic(topic);
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

  return (
    <div className="h-full flex flex-col bg-muted/30 border-r">
      {/* Header */}
      <div className="p-3 border-b bg-background/50">
        <button
          onClick={handleHomeClick}
          className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors text-sm font-semibold"
        >
          <BookOpen className="h-4 w-4 text-primary" />
          <span>Kurikulum</span>
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {totalSubjects}·{totalSkills}
          </Badge>
        </button>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat v kurikulu…"
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {subjects.length === 0 && (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-muted-foreground">
                {query ? "Žádné výsledky" : "Kurikulum je prázdné"}
              </p>
            </div>
          )}
          {/* Legenda úrovní — pomáhá adminovi pochopit, co znamenají odsazení */}
          {!query && subjects.length > 0 && (
            <div className="px-3 py-1.5 text-[10px] text-muted-foreground/70 leading-tight border-b mb-1">
              <span className="inline-flex items-center gap-1"><BookOpen className="h-2.5 w-2.5" />Předmět</span>
              {" › "}
              <span className="inline-flex items-center gap-1"><FolderTree className="h-2.5 w-2.5" />Okruh</span>
              {" › "}
              <span className="inline-flex items-center gap-1"><FileText className="h-2.5 w-2.5" />Téma</span>
              {" › "}
              <span className="inline-flex items-center gap-1"><Target className="h-2.5 w-2.5" />Podtéma</span>
            </div>
          )}
          {subjects.map((subject) => {
            const isSubjectOpen = expandedSubjects.has(subject) || !!query;
            const isSubjectActive = selectedSubject === subject;
            const categories = Object.keys(tree[subject]).sort();
            // První písmeno velké, zbytek beze změny — žádný capitalize CSS
            const fmtName = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

            return (
              <div key={subject} className="mb-0.5">
                {/* Subject (Předmět) — největší font, primární barva */}
                <button
                  onClick={() => handleSubjectClick(subject)}
                  className={`w-full flex items-center gap-1.5 px-2 py-2 text-sm rounded-md transition-colors border-l-4 ${
                    isSubjectActive && !selectedCategory
                      ? "bg-primary/15 text-primary font-bold border-primary"
                      : "hover:bg-accent/70 font-semibold border-transparent"
                  }`}
                  title={`Předmět: ${fmtName(subject)}`}
                >
                  {isSubjectOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{fmtName(subject)}</span>
                </button>

                {/* Categories */}
                {isSubjectOpen && (
                  <div className="ml-3 border-l-2 border-border/60">
                    {categories.map((category) => {
                      const categoryKey = `${subject}::${category}`;
                      const isCatOpen = expandedCategories.has(categoryKey) || !!query;
                      const isCatActive = selectedSubject === subject && selectedCategory === category;
                      const topicsList = Object.keys(tree[subject][category]).sort();

                      return (
                        <div key={category}>
                          {/* Category (Okruh) */}
                          <button
                            onClick={() => handleCategoryClick(subject, category)}
                            className={`w-full flex items-center gap-1.5 pl-2 pr-2 py-1.5 text-sm rounded-md transition-colors border-l-4 ${
                              isCatActive && !selectedTopic
                                ? "bg-primary/10 text-primary font-semibold border-primary"
                                : "hover:bg-accent/70 text-foreground/85 border-transparent"
                            }`}
                            title={`Okruh: ${fmtName(category)}`}
                          >
                            {isCatOpen ? (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            )}
                            <FolderTree className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="truncate">{fmtName(category)}</span>
                          </button>

                          {/* Topics */}
                          {isCatOpen && (
                            <div className="ml-3 border-l border-border/40">
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
                                      className={`w-full flex items-center gap-1.5 pl-2 pr-2 py-1 text-xs rounded-md transition-colors border-l-4 ${
                                        isTopicActive && !selectedSkill
                                          ? "bg-primary/10 text-primary font-semibold border-primary"
                                          : "hover:bg-accent/70 text-foreground/75 border-transparent"
                                      }`}
                                      title={`Téma: ${fmtName(topic)}`}
                                    >
                                      {isTopicOpen ? (
                                        <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                      )}
                                      <FileText className="h-3 w-3 text-sky-600 dark:text-sky-400 shrink-0" />
                                      <span className="truncate flex-1 text-left">
                                        {fmtName(topic)}
                                      </span>
                                      <Badge variant="outline" className="text-[9px] h-4 px-1 shrink-0 font-mono">
                                        {skills.length}
                                      </Badge>
                                    </button>

                                    {/* Skills (Podtémata) */}
                                    {isTopicOpen && (
                                      <div className="ml-3 border-l border-border/30">
                                        {skills.map((skill) => {
                                          const isSkillActive = selectedSkill?.id === skill.id;
                                          return (
                                            <button
                                              key={skill.id}
                                              onClick={() => handleSkillClick(skill)}
                                              className={`w-full flex items-center gap-1.5 pl-2 pr-2 py-1 text-xs rounded-md transition-colors border-l-4 ${
                                                isSkillActive
                                                  ? "bg-primary text-primary-foreground font-semibold border-primary-foreground/40"
                                                  : "hover:bg-accent/70 text-foreground/65 border-transparent"
                                              }`}
                                              title={`Podtéma: ${skill.title}`}
                                            >
                                              <Target className={`h-3 w-3 shrink-0 ${isSkillActive ? "" : "text-emerald-600 dark:text-emerald-400"}`} />
                                              <span className="truncate text-left flex-1">
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
