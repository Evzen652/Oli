import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OlyLogo } from '@/components/shared/OlyLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useT } from '@/app/LocaleProvider';

export function Demo() {
  const t = useT();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'child' | 'parent' | 'admin'>('child');

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <OlyLogo size="md" />
        <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
          {t('auth.login')}
        </Button>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center">{t('demo.title')}</h1>
        <p className="text-center text-muted-foreground">
          Podivejte se, jak Oly funguje pro zaky, rodice i spravce obsahu.
        </p>

        {/* Tab navigation */}
        <div className="flex gap-2 justify-center">
          {(['child', 'parent', 'admin'] as const).map((t_) => (
            <Button
              key={t_}
              variant={tab === t_ ? 'default' : 'outline'}
              onClick={() => setTab(t_)}
            >
              {t_ === 'child' ? t('demo.childTab') : t_ === 'parent' ? t('demo.parentTab') : t('demo.adminTab')}
            </Button>
          ))}
        </div>

        {/* Child demo */}
        {tab === 'child' && (
          <Card>
            <CardHeader>
              <CardTitle>Zakovky pohled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Zak si vybere rocnik a tema, procvicuje ulohy s okamzitou zpetnou vazbou.
                Adaptivni system prizpusobuje obtiznost.
              </p>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl mb-2">15 + 7 = ?</p>
                <p className="text-sm text-muted-foreground">Numericky input s virtualnim numpadem</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 rounded bg-success-bg">Spravne: 4</div>
                <div className="p-2 rounded bg-warning-bg">S napovedi: 1</div>
                <div className="p-2 rounded bg-error-bg">Spatne: 1</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parent demo */}
        {tab === 'parent' && (
          <Card>
            <CardHeader>
              <CardTitle>Rodicovky pohled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Rodic vidi aktivitu svych deti, muze zadavat ukoly a sledovat pokrok.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold">P</div>
                  <div>
                    <div className="font-bold">Peta</div>
                    <div className="text-sm text-muted-foreground">3. rocnik</div>
                  </div>
                </div>
                <p className="text-sm">5 cviceni, 82% uspesnost tento tyden</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin demo */}
        {tab === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin pohled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Spravce obsahu muze prohlizet kurikulum, editovat dovednosti, generovat obsah pomoci AI.
              </p>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex gap-2">
                  <span className="text-2xl">🔢</span>
                  <div>
                    <div className="font-bold">Matematika</div>
                    <div className="text-sm text-muted-foreground">18 dovednosti</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-2xl">📝</span>
                  <div>
                    <div className="font-bold">Cestina</div>
                    <div className="text-sm text-muted-foreground">8 dovednosti</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center pt-4">
          <Button size="lg" onClick={() => navigate('/auth')}>
            Zaregistrovat se zdarma
          </Button>
        </div>
      </main>
    </div>
  );
}
