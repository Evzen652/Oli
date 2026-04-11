import { useEffect, useState } from 'react';
import type { Grade, TopicMetadata } from '@/lib/engine/types';
import { useAuth } from '@/app/AuthProvider';
import { useChildStats } from '@/hooks/useChildStats';
import { supabase } from '@/integrations/supabase/client';
import { getTopicById } from '@/lib/content/contentRegistry';
import { getSubjectEmoji } from '@/lib/utils/subjectRegistry';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OlyLogo } from '@/components/shared/OlyLogo';
import { useT } from '@/app/LocaleProvider';

interface Props {
  grade: Grade;
  onSelectTopic: (topic: TopicMetadata) => void;
  onBrowseTopics: () => void;
}

interface Assignment {
  id: string;
  skill_id: string;
  note: string | null;
  due_date: string | null;
  status: string;
}

export function ChildHomePage({ grade: _grade, onSelectTopic, onBrowseTopics }: Props) {
  const t = useT();
  const { user, signOut } = useAuth();
  const [childName, setChildName] = useState('');
  const [childId, setChildId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const stats = useChildStats(childId);

  useEffect(() => {
    if (!user) return;
    // Fetch child info
    supabase
      .from('children')
      .select('id, name')
      .eq('child_user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setChildName(data.name);
          setChildId(data.id);
        }
      });
  }, [user]);

  useEffect(() => {
    if (!childId) return;
    supabase
      .from('parent_assignments')
      .select('*')
      .eq('child_id', childId)
      .eq('status', 'pending')
      .then(({ data }) => {
        setAssignments((data as Assignment[]) ?? []);
      });
  }, [childId]);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <OlyLogo size="sm" />
        <Button variant="ghost" size="sm" onClick={signOut}>
          {t('common.signOut')}
        </Button>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">
          {t('child.hello')}, {childName || 'zaku'}!
        </h1>

        {/* Weekly stats */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">{t('child.thisWeek')}</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.sessions}</div>
                <div className="text-xs text-muted-foreground">{t('child.exercises')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.tasks}</div>
                <div className="text-xs text-muted-foreground">{t('child.tasks')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.accuracy}%</div>
                <div className="text-xs text-muted-foreground">{t('child.accuracy')}</div>
              </div>
            </div>
            {stats.accuracy >= 80 && (
              <p className="text-center text-sm text-success mt-2 font-medium">{t('session.greatJob')}</p>
            )}
          </CardContent>
        </Card>

        {/* Assignments */}
        <div>
          <h2 className="font-semibold mb-3">{t('child.assignments')}</h2>
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('child.noAssignments')}</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => {
                const topic = getTopicById(assignment.skill_id);
                return (
                  <Card key={assignment.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{topic ? getSubjectEmoji(topic.subject) : ''}</span>
                          <span className="font-medium">
                            {topic?.title ?? assignment.skill_id}
                          </span>
                        </div>
                        {assignment.note && (
                          <p className="text-sm text-muted-foreground mt-1">{assignment.note}</p>
                        )}
                        {assignment.due_date && (
                          <p className="text-xs text-muted-foreground">
                            Do {new Date(assignment.due_date).toLocaleDateString('cs-CZ')}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        disabled={!topic}
                        onClick={() => topic && onSelectTopic(topic)}
                      >
                        {t('child.startAssignment')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Self practice */}
        <div className="text-center pt-4">
          <div className="text-muted-foreground text-sm mb-3">nebo</div>
          <Button size="lg" variant="outline" onClick={onBrowseTopics}>
            {t('child.selfPractice')}
          </Button>
        </div>
      </main>
    </div>
  );
}
