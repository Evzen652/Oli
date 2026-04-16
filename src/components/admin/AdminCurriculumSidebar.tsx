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
          {subjects.map((subject) => {
            const isSubjectOpen = expandedSubjects.has(subject) || !!query;
            const isSubjectActive = selectedSubject === subject;
            const categories = Object.keys(tree[subject]).sort();

            return (
              <div key={subject} className="mb-0.5">
                {/* Subject row */}
                <button
                  onClick={() => handleSubjectClick(subject)}
                  className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md transition-colors ${
                    isSubjectActive && !selectedCategory
                      ? "bg-primary/15 text-primary font-semibold"
                      : "hover:bg-accent/70"
                  }`}
                >
                  {isSubjectOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="capitalize truncate">{subject}</span>
                </button>

                {/* Categories */}
                {isSubjectOpen && (
                  <div className="ml-3 border-l border-border/60">
                    {categories.map((category) => {
                      const categoryKey = `${subject}::${category}`;
                      const isCatOpen = expandedCategories.has(categoryKey) || !!query;
                      const isCatActive = selectedSubject === subject && selectedCategory === category;
                      const topicsList = Object.keys(tree[subject][category]).sort();

                      return (
                        <div key={category}>
                          <button
                            onClick={() => handleCategoryClick(subject, category)}
                            className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors ${
                              isCatActive && !selectedTopic
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-accent/70 text-foreground/80"
                            }`}
                          >
                            {isCatOpen ? (
                              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                            )}
                            <FolderTree className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="capitalize truncate">{category}</span>
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
                                    <button
                                      onClick={() => handleTopicClick(subject, category, topic)}
                                      className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors ${
                                        isTopicActive && !selectedSkill
                                          ? "bg-primary/10 text-primary font-medium"
                                          : "hover:bg-accent/70 text-foreground/70"
                                      }`}
                                    >
                                      {isTopicOpen ? (
                                        <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                      )}
                                      <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                      <span className="capitalize truncate flex-1 text-left">
                                        {topic}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground shrink-0">{skills.length}</span>
                                    </button>

                                    {/* Skills */}
                                    {isTopicOpen && (
                                      <div className="ml-3 border-l border-border/30">
                                        {skills.map((skill) => {
                                          const isSkillActive = selectedSkill?.id === skill.id;
                                          return (
                                            <button
                                              key={skill.id}
                                              onClick={() => handleSkillClick(skill)}
                                              className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors ${
                                                isSkillActive
                                                  ? "bg-primary text-primary-foreground"
                                                  : "hover:bg-accent/70 text-foreground/60"
                                              }`}
                                            >
                                              <Target className="h-3 w-3 shrink-0" />
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
