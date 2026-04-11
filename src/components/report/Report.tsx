import { useSearchParams } from 'react-router-dom';
import { useChildStats } from '@/hooks/useChildStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useT } from '@/app/LocaleProvider';

export function Report() {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const childId = params.get('child');
  const stats = useChildStats(childId);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← {t('common.back')}
        </Button>
        <h1 className="font-semibold">{t('report.title')}</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prehled za posledni tyden</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.loading ? (
              <div className="animate-pulse h-20 bg-muted rounded" />
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">{stats.sessions}</div>
                  <div className="text-sm text-muted-foreground">Cviceni</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.tasks}</div>
                  <div className="text-sm text-muted-foreground">Uloh</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Uspesnost</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailni analyza</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Podrobna analyza mastery per-skill, slabych vzorcu a trendu bude dostupna v premium verzi.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
