import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getTopicById } from '@/lib/content/contentRegistry';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useT } from '@/app/LocaleProvider';

interface SessionGroup {
  session_id: string;
  skill_id: string;
  total: number;
  correct: number;
  created_at: string;
}

export function SessionHistory() {
  const t = useT();
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) return;
    supabase
      .from('session_logs')
      .select('session_id, skill_id, correct, created_at')
      .eq('child_id', childId)
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (!data) { setLoading(false); return; }

        const grouped = new Map<string, SessionGroup>();
        for (const row of data) {
          const existing = grouped.get(row.session_id);
          if (existing) {
            existing.total++;
            if (row.correct) existing.correct++;
          } else {
            grouped.set(row.session_id, {
              session_id: row.session_id,
              skill_id: row.skill_id,
              total: 1,
              correct: row.correct ? 1 : 0,
              created_at: row.created_at,
            });
          }
        }

        setSessions(Array.from(grouped.values()));
        setLoading(false);
      });
  }, [childId]);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← {t('common.back')}
        </Button>
        <h1 className="font-semibold">{t('report.sessionHistory')}</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-16 bg-muted rounded" />)}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-muted-foreground">Zadna historie</p>
        ) : (
          sessions.map((s) => {
            const topic = getTopicById(s.skill_id);
            const accuracy = Math.round((s.correct / s.total) * 100);
            return (
              <Card key={s.session_id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{topic?.title ?? s.skill_id}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.correct}/{s.total}</span>
                    <Badge variant={accuracy >= 80 ? 'success' : accuracy >= 50 ? 'warning' : 'destructive'}>
                      {accuracy}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </main>
    </div>
  );
}
