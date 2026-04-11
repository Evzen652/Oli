import { useState, useMemo } from "react";
import type { TopicMetadata, Grade } from "@/lib/types";
import { getTopicsForGrade, getAllTopics } from "@/lib/contentRegistry";
import { getCategoryInfo } from "@/lib/categoryInfo";
import { getPrvoukaCategoryVisual, getPrvoukaTopicEmoji, getPrvoukaTopicVisual, getPrvoukaCategoryImageUrl, getPrvoukaTopicImageUrl } from "@/lib/prvoukaVisuals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import categoryInfoImg from "@/assets/category-info.png";
import { useT } from "@/lib/i18n";
import { useDbCurriculum, hasCodeGenerator } from "@/hooks/useDbCurriculum";
import { OlyLogo } from "@/components/OlyLogo";

interface TopicBrowserProps {
  grade: Grade;
  onSelectTopic: (topic: TopicMetadata) => void;
  onBack: () => void;
  isAdmin?: boolean;
}

type BrowseLevel = "subject" | "category" | "topic" | "subtopic";

export function TopicBrowser({ grade, onSelectTopic, onBack, isAdmin }: TopicBrowserProps) {
  const t = useT();
  const [level, setLevel] = useState<BrowseLevel>("subject");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Use only code registry topics for student view (no DB-only duplicates)
  const { dbOnlyTopics } = useDbCurriculum(grade);
  const codeTopics = useMemo(() => {
    const all = getAllTopics();
    return all.filter((t) => grade >= t.gradeRange[0] && grade <= t.gradeRange[1]);
  }, [grade]);
  // Only add DB-only topics that have actual exercises (not just metadata stubs)
  const topics = useMemo(() => {
    const realDbOnly = dbOnlyTopics.filter((t) => (t as any)._dbOnly && t.generator(1).length === 0 === false);
    // For now, just use code topics — DB-only topics without generators can't be practiced
    return [...codeTopics];
  }, [codeTopics, dbOnlyTopics]);

  const subjects = [...new Set(topics.map((t) => t.subject))];

  const categories = selectedSubject
    ? [...new Set(topics.filter((t) => t.subject === selectedSubject).map((t) => t.category))]
    : [];

  // Topics (groups) within selected category
  const topicGroups =
    selectedSubject && selectedCategory
      ? [...new Set(
          topics
            .filter((t) => t.subject === selectedSubject && t.category === selectedCategory)
            .map((t) => t.topic)
        )]
      : [];

  // Subtopics (skills) within selected topic group
  const subtopics =
    selectedSubject && selectedCategory && selectedTopic
      ? topics.filter(
          (t) =>
            t.subject === selectedSubject &&
            t.category === selectedCategory &&
            t.topic === selectedTopic
        )
      : [];

  const handleBack = () => {
    if (level === "subtopic") {
      // If topic level has only 1 group, skip it
      const groups = selectedSubject && selectedCategory
        ? [...new Set(topics.filter(t => t.subject === selectedSubject && t.category === selectedCategory).map(t => t.topic))]
        : [];
      if (groups.length <= 1) {
        // Also check if category level has only 1 category
        const cats = selectedSubject
          ? [...new Set(topics.filter(t => t.subject === selectedSubject).map(t => t.category))]
          : [];
        if (cats.length <= 1) {
          setSelectedTopic(null);
          setSelectedCategory(null);
          setSelectedSubject(null);
          setLevel("subject");
        } else {
          setSelectedTopic(null);
          setSelectedCategory(null);
          setLevel("category");
        }
      } else {
        setSelectedTopic(null);
        setLevel("topic");
      }
    } else if (level === "topic") {
      // If category level has only 1 category, skip it
      const cats = selectedSubject
        ? [...new Set(topics.filter(t => t.subject === selectedSubject).map(t => t.category))]
        : [];
      if (cats.length <= 1) {
        setSelectedCategory(null);
        setSelectedSubject(null);
        setLevel("subject");
      } else {
        setSelectedCategory(null);
        setLevel("category");
      }
    } else if (level === "category") {
      setSelectedSubject(null);
      setLevel("subject");
    } else {
      onBack();
    }
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    const cats = [...new Set(topics.filter((t) => t.subject === subject).map((t) => t.category))];
    if (cats.length === 1) {
      setSelectedCategory(cats[0]);
      // Check if this category has only one topic group
      const groups = [...new Set(
        topics.filter((t) => t.subject === subject && t.category === cats[0]).map((t) => t.topic)
      )];
      if (groups.length === 1) {
        const skillsInGroup = topics.filter(
          (t) => t.subject === subject && t.category === cats[0] && t.topic === groups[0]
        );
        if (skillsInGroup.length === 1) {
          onSelectTopic(skillsInGroup[0]);
        } else {
          setSelectedTopic(groups[0]);
          setLevel("subtopic");
        }
      } else {
        setLevel("topic");
      }
    } else {
      setLevel("category");
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const groups = [...new Set(
      topics.filter((t) => t.subject === selectedSubject && t.category === category).map((t) => t.topic)
    )];
    if (groups.length === 1) {
      const skillsInGroup = topics.filter(
        (t) => t.subject === selectedSubject && t.category === category && t.topic === groups[0]
      );
      if (skillsInGroup.length === 1) {
        onSelectTopic(skillsInGroup[0]);
      } else {
        setSelectedTopic(groups[0]);
        setLevel("subtopic");
      }
    } else {
      setLevel("topic");
    }
  };

  const handleTopicClick = (topicName: string) => {
    const skillsInGroup = topics.filter(
      (t) =>
        t.subject === selectedSubject &&
        t.category === selectedCategory &&
        t.topic === topicName
    );
    if (skillsInGroup.length === 1) {
      // Single-item topic group — auto-skip to practice
      onSelectTopic(skillsInGroup[0]);
    } else {
      setSelectedTopic(topicName);
      setLevel("subtopic");
    }
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const title =
    level === "subject"
      ? t("topic.select_subject")
      : level === "category"
        ? selectedSubject ? capitalize(selectedSubject) : ""
        : level === "topic"
          ? selectedCategory ? capitalize(selectedCategory) : ""
          : selectedTopic ? capitalize(selectedTopic) : "";

  const subtitle =
    level === "subject"
      ? t("topic.what_today")
      : level === "category"
        ? t("topic.select_topic")
        : level === "topic"
          ? t("topic.select_practice")
          : t("topic.select_subtopic");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4" style={isAdmin ? { paddingTop: "2.5rem" } : undefined}>
      <div className={`absolute ${isAdmin ? "top-[4.5rem]" : "top-4"} left-4 z-10`}>
        <OlyLogo onClick={onBack} />
      </div>
      <div className="w-full max-w-lg space-y-8">
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 text-base text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
          {t("topic.back")}
        </Button>

        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {/* Category/topic info button — shown at topic and subtopic level */}
        {level === "topic" && selectedSubject && selectedCategory && (() => {
          const info = getCategoryInfo(selectedSubject, selectedCategory);
          if (!info) return null;
          return <CategoryInfoDialog info={info} />;
        })()}
        {level === "subtopic" && selectedSubject && selectedCategory && selectedTopic && (() => {
          const info = getCategoryInfo(selectedSubject, selectedCategory, selectedTopic);
          if (!info) return null;
          return <CategoryInfoDialog info={info} />;
        })()}

        <div className="grid gap-4">
          {level === "subject" &&
            subjects.map((subject) => {
              const count = new Set(topics.filter((t) => t.subject === subject).map((t) => t.category)).size;
              const meta = getSubjectMeta(subject);
              return (
                <Card
                  key={subject}
                  className={`cursor-pointer border-2 transition-colors hover:shadow-md ${meta.gradientClass} ${meta.borderClass}`}
                  onClick={() => handleSubjectClick(subject)}
                >
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <PrvoukaImage imageUrl={meta.image || null} fallbackEmoji={meta.emoji} size="lg" />
                      <div>
                        <p className="text-2xl font-medium capitalize text-foreground">{subject}</p>
                        <p className="text-base text-muted-foreground">{count} {count === 1 ? t("count.category_1") : count < 5 ? t("count.category_2_4") : t("count.category_5_plus")}</p>
                      </div>
                    </div>
                    <ChevronLeft className="h-6 w-6 rotate-180 text-muted-foreground" />
                  </CardContent>
                </Card>
              );
            })}

          {level === "category" &&
            categories.map((category) => {
              const count = new Set(
                topics.filter((t) => t.subject === selectedSubject && t.category === category).map((t) => t.topic)
              ).size;
              const catInfo = getCategoryInfo(selectedSubject!, category);
              const visual = getPrvoukaCategoryVisual(selectedSubject!, category);
              return (
                <Card
                  key={category}
                  className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                    visual ? `${visual.gradientClass} ${visual.colorClass}` : "hover:bg-accent"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <PrvoukaImage imageUrl={getPrvoukaCategoryImageUrl(selectedSubject!, category)} fallbackEmoji={visual?.emoji} size="lg" />
                      <div>
                        <p className="text-2xl font-medium text-foreground">{capitalize(category)}</p>
                        <p className="text-base text-muted-foreground">{count} {count === 1 ? t("count.topic_1") : count < 5 ? t("count.topic_2_4") : t("count.topic_5_plus")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronLeft className="h-6 w-6 rotate-180 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          {level === "topic" &&
            topicGroups.map((topicName) => {
              const skillsInGroup = topics.filter(
                (t) => t.subject === selectedSubject && t.category === selectedCategory && t.topic === topicName
              );
              const count = skillsInGroup.length;
              const description = count > 1
                ? (skillsInGroup[0]?.topicDescription ?? skillsInGroup[0]?.briefDescription ?? "")
                : (skillsInGroup[0]?.briefDescription ?? "");
              const topicEmoji = getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, topicName);
              const topicVisual = getPrvoukaTopicVisual(selectedSubject!, selectedCategory!);
              return (
                <Card
                  key={topicName}
                  className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                    topicVisual ? `${topicVisual.gradientClass} ${topicVisual.colorClass}/60` : "hover:bg-accent"
                  }`}
                  onClick={() => handleTopicClick(topicName)}
                >
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <PrvoukaImage imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topicName)} fallbackEmoji={topicEmoji} size="md" />
                      <div>
                        <p className="text-xl font-medium text-foreground">{capitalize(topicName)}</p>
                        {description && (
                          <p className="mt-1 text-base text-muted-foreground">{description}</p>
                        )}
                        {count > 1 && (
                          <p className="mt-1 text-sm text-muted-foreground">{count} {count < 5 ? t("count.subtopic_2_4") : t("count.subtopic_5_plus")}</p>
                        )}
                      </div>
                    </div>
                    <ChevronLeft className="h-6 w-6 rotate-180 text-muted-foreground" />
                  </CardContent>
                </Card>
              );
            })}

          {level === "subtopic" &&
            subtopics.map((topic) => {
              const subEmoji = getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, selectedTopic!);
              const subVisual = getPrvoukaTopicVisual(selectedSubject!, selectedCategory!);
              const isDbOnly = !hasCodeGenerator(topic);
              return (
                <Card
                  key={topic.id}
                  className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                    subVisual ? `${subVisual.gradientClass} ${subVisual.colorClass}/40` : "hover:bg-accent"
                  } ${isDbOnly ? "opacity-80" : ""}`}
                  onClick={() => onSelectTopic(topic)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <PrvoukaImage imageUrl={getPrvoukaTopicImageUrl(selectedSubject!, topic.title)} fallbackEmoji={getPrvoukaTopicEmoji(selectedSubject!, selectedCategory!, topic.title) || subEmoji} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-medium text-foreground">{topic.title}</p>
                        </div>
                        <p className="mt-1 text-base text-muted-foreground">{topic.goals[0]}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ── Prvouka image with emoji fallback ────────────────────────

const IMG_SIZES = { lg: "w-20 h-20", md: "w-16 h-16", sm: "w-12 h-12" };
const EMOJI_SIZES = { lg: "text-4xl", md: "text-3xl", sm: "text-2xl" };
function PrvoukaImage({ imageUrl, fallbackEmoji, size = "md" }: { imageUrl: string | null; fallbackEmoji?: string | null; size?: "lg" | "md" | "sm" }) {
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={`${IMG_SIZES[size]} object-contain shrink-0 mix-blend-multiply`}
        onError={() => setFailed(true)}
      />
    );
  }

  if (fallbackEmoji) {
    return <span className={EMOJI_SIZES[size]}>{fallbackEmoji}</span>;
  }

  return null;
}

// ── Extracted dialog components ─────────────────────────────

function CategoryInfoDialog({ info }: { info: ReturnType<typeof getCategoryInfo> & {} }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full gap-3 border-2 text-base py-7 bg-gradient-to-r from-white to-accent hover:shadow-md transition-all">
          <img src={categoryInfoImg} alt="" className="w-10 h-10 object-contain shrink-0 mix-blend-multiply" />
          <span className="font-medium">{info.buttonLabel}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-none p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-5 text-base max-w-2xl mx-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl">{info.title}</SheetTitle>
            </SheetHeader>
            <p className="text-lg font-medium text-primary">{info.hook}</p>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Co to je?</h3>
              <p className="text-muted-foreground">{info.whatIsIt}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Proč se to učíme?</h3>
              <p className="text-muted-foreground">{info.whyWeUseIt}</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Jak to vypadá?</h3>
              {info.visualExamples.map((ex, i) => (
                <div key={i} className="rounded-lg border-2 bg-secondary/50 p-4 space-y-2">
                  <p className="font-medium text-sm text-foreground">{ex.label}</p>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-muted-foreground leading-relaxed">
                    {ex.illustration}
                  </pre>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-accent p-4">
              <p className="text-base text-accent-foreground">{info.funFact}</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
