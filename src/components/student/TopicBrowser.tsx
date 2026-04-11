import { useState, useMemo } from 'react';
import type { Grade, TopicMetadata } from '@/lib/engine/types';
import { getTopicsForGrade } from '@/lib/content/contentRegistry';
import { getSubjectMeta, getSubjectsForGrade } from '@/lib/utils/subjectRegistry';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OlyLogo } from '@/components/shared/OlyLogo';
import { useT } from '@/app/LocaleProvider';
import { cn } from '@/lib/utils/cn';

interface Props {
  grade: Grade;
  onSelectTopic: (topic: TopicMetadata) => void;
  onBack?: () => void;
}

type BrowseLevel = 'subject' | 'category' | 'topic';

export function TopicBrowser({ grade, onSelectTopic, onBack }: Props) {
  const t = useT();
  const topics = useMemo(() => getTopicsForGrade(grade), [grade]);
  const subjects = getSubjectsForGrade(grade);

  const [level, setLevel] = useState<BrowseLevel>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBySubject = selectedSubject
    ? topics.filter((t) => t.subject === selectedSubject)
    : topics;

  const categories = [...new Set(filteredBySubject.map((t) => t.category))];
  const filteredByCategory = selectedCategory
    ? filteredBySubject.filter((t) => t.category === selectedCategory)
    : filteredBySubject;

  const handleBack = () => {
    if (level === 'topic') {
      setLevel('category');
      setSelectedCategory(null);
    } else if (level === 'category') {
      setLevel('subject');
      setSelectedSubject(null);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <OlyLogo size="sm" />
        <Button variant="ghost" size="sm" onClick={handleBack}>
          {t('common.back')}
        </Button>
        <Badge variant="secondary">{grade}. {t('grade.label')}</Badge>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {/* Subject level */}
        {level === 'subject' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((subj) => {
              const meta = getSubjectMeta(subj);
              const count = topics.filter((t) => t.subject === subj).length;
              return (
                <Card
                  key={subj}
                  className={cn('cursor-pointer hover:shadow-md transition-shadow', meta.bgClass)}
                  onClick={() => {
                    setSelectedSubject(subj);
                    setLevel('category');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{meta.emoji}</div>
                    <h3 className="text-lg font-bold">{meta.label}</h3>
                    {meta.hook && <p className="text-sm text-muted-foreground mt-1">{meta.hook}</p>}
                    <Badge variant="secondary" className="mt-2">{count} temat</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Category level */}
        {level === 'category' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const count = filteredBySubject.filter((t) => t.category === cat).length;
              return (
                <Card
                  key={cat}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setLevel('topic');
                  }}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold">{cat}</h3>
                    <Badge variant="secondary" className="mt-2">{count} temat</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Topic level */}
        {level === 'topic' && (
          <div className="space-y-3">
            {filteredByCategory.map((topic) => (
              <Card
                key={topic.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectTopic(topic)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.briefDescription}</p>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {topic.gradeRange[0]}-{topic.gradeRange[1]}. r.
                    </Badge>
                    <Badge variant="secondary" className="text-xs">{topic.inputType}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
