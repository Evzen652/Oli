import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { mapAuthError } from "@/lib/authErrors";
import { hasAnonProgress, getAnonProgressSummary } from "@/lib/anonMigration";
import { pad } from "@/lib/czechGrammar";
import { Mail } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { LandingNav } from "@/pages/LandingNav";

type Role = "parent" | "child" | null;

export default function Auth() {
  const [searchParams] = useSearchParams();
  const anonSummary = hasAnonProgress() ? getAnonProgressSummary() : null;
  const inviteId = searchParams.get("invite");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [role, setRole] = useState<Role>("parent");

  useEffect(() => {
    setIsLogin(searchParams.get("mode") !== "register");
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(mapAuthError(error.message));
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { role: "parent" } },
      });
      if (error) {
        setError(mapAuthError(error.message));
      } else {
        if (data.user && inviteId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("parent_invitations")
            .update({ status: "accepted", accepted_at: new Date().toISOString() })
            .eq("id", inviteId);
        }
        setRegisteredEmail(email);
      }
    }
    setLoading(false);
  };

  // Potvrzení registrace
  if (registeredEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
        <LandingNav />
        <div className="mx-auto max-w-md px-4 py-16 flex flex-col items-center gap-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 ring-4 ring-violet-100 flex items-center justify-center shadow-sm">
            <Mail className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="font-bold text-2xl text-foreground">Zkontroluj e-mail</h2>
          <p className="text-[15px] text-foreground/80 max-w-sm">
            Poslali jsme ověřovací odkaz na <strong className="break-all">{registeredEmail}</strong>.
            Klikni na něj a pak se přihlas.
          </p>
          <p className="text-xs text-muted-foreground max-w-sm">
            E-mail nedorazil? Zkontroluj složku se spamem.
          </p>
          <Button className="w-full max-w-xs" onClick={() => { setRegisteredEmail(null); setIsLogin(true); setRole("parent"); }}>
            Přejít na přihlášení
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
      <LandingNav />
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        <div className="space-y-4">

          {/* Výběr role — vždy nahoře */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setRole("parent"); setError(null); }}
              className={`rounded-2xl border-2 px-4 py-4 text-left transition-all ${
                role === "parent"
                  ? "border-emerald-400 bg-emerald-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50"
              }`}
            >
              <div className="text-2xl mb-1">👨‍👩‍👧</div>
              <p className="font-bold text-sm text-slate-900">Jsem rodič</p>
              <p className="text-xs text-slate-500 mt-0.5">Sledovat pokrok dítěte</p>
            </button>
            <button
              onClick={() => navigate("/auth/child")}
              className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-left hover:border-violet-200 hover:bg-violet-50/50 transition-all"
            >
              <div className="text-2xl mb-1">🎒</div>
              <p className="font-bold text-sm text-slate-900">Jsem žák</p>
              <p className="text-xs text-slate-500 mt-0.5">Přihlásit se kódem</p>
            </button>
          </div>

          {/* Rodičovský formulář */}
          {role === "parent" && (
            <Card className="w-full shadow-xl border-violet-100/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-xl font-bold">
                  {isLogin ? t("auth.title.login") : "Registrace rodiče"}
                </CardTitle>
                {!isLogin && (
                  <p className="text-center text-sm text-muted-foreground mt-1">
                    Stačí e-mail a heslo. Dítě propojíte kódem po registraci.
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {inviteId && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
                    👪 <strong>Pozvánka od dítěte</strong> — registruj se a po dokončení tě dítě propojí.
                  </div>
                )}
                {anonSummary && (
                  <div className="rounded-xl bg-violet-50 border border-violet-200 px-3 py-2 text-xs text-violet-700">
                    Dítě má splněno <strong>{pad(anonSummary.completedCount, "ÚKOL")}</strong> ({anonSummary.grade}. třída).
                    Pokrok se přenese po propojení dítěte přes kód.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? t("auth.loading") : isLogin ? t("auth.submit.login") : "Vytvořit účet"}
                  </Button>
                </form>
                {isLogin && (
                  <Button
                    variant="link"
                    className="w-full text-sm text-muted-foreground"
                    onClick={() => navigate("/auth/forgot-password")}
                  >
                    {t("auth.forgot_password")}
                  </Button>
                )}
                <Button
                  variant="link"
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => { setIsLogin(!isLogin); setError(null); }}
                >
                  {isLogin ? "Ještě nemám účet — vytvořit nový" : "Už mám účet — přihlásit se"}
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
