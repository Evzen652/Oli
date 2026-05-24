import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { hasAnonProgress, getAnonProgressSummary } from "@/lib/anonMigration";

const PARENT_BENEFITS = [
  { icon: "📚", text: "Zadávat dítěti úkoly z předmětů, ve kterých potřebuje pomoct" },
  { icon: "📊", text: "Sledovat pokrok — co dítě zvládá a kde se zasekává" },
  { icon: "📝", text: "Připravit ho na konkrétní písemku nebo zkoušení" },
  { icon: "📬", text: "Dostávat týdenní shrnutí, jak se dítěti daří" },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const anonSummary = hasAnonProgress() ? getAnonProgressSummary() : null;
  const inviteId = searchParams.get("invite");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setError(error.message);
      } else {
        // Assign parent role after signup
        if (data.user) {
          await supabase.from("user_roles").insert({ user_id: data.user.id, role: "parent" });
          // Pokud rodič přišel z invite linku, označ pozvánku jako accepted
          if (inviteId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
              .from("parent_invitations")
              .update({ status: "accepted", accepted_at: new Date().toISOString() })
              .eq("id", inviteId);
          }
        }
        setMessage(t("auth.register_success"));
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className={`w-full ${isLogin ? "max-w-sm" : "max-w-3xl"} grid gap-6 ${isLogin ? "" : "md:grid-cols-2"}`}>
        {/* Benefity — jen u registrace */}
        {!isLogin && (
          <div className="space-y-4 p-6 md:p-2 md:pr-6 md:pt-8">
            <h2 className="font-bold text-xl text-foreground">S účtem rodiče můžete:</h2>
            <ul className="space-y-3">
              {PARENT_BENEFITS.map((b) => (
                <li key={b.text} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="text-lg shrink-0" aria-hidden>{b.icon}</span>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-violet-50 border border-violet-100 px-3 py-2.5 text-xs text-violet-700">
              <strong>14 dní zdarma</strong> — bez platební karty. Pak 149 Kč měsíčně. Můžete kdykoli zrušit.
            </div>
          </div>
        )}

        {/* Formulář */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {isLogin ? t("auth.title.login") : "Registrace rodiče"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Invite banner — rodič přišel z pozvánky od dítěte */}
            {inviteId && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
                👪 <strong>Pozvánka od dítěte</strong> — registruj se a po dokončení tě dítě propojí.
              </div>
            )}

            {/* Anon progress hint — pokud dítě procvičovalo a teď se rodič registruje */}
            {anonSummary && (
              <div className="rounded-xl bg-violet-50 border border-violet-200 px-3 py-2 text-xs text-violet-700">
                Dítě má splněno <strong>{anonSummary.completedCount} úkolů</strong> ({anonSummary.grade}. třída).
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
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
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
              onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
            >
              {isLogin ? "Ještě nemám účet — vytvořit nový" : "Už mám účet — přihlásit se"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
