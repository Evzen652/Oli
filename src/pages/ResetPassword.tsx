import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { mapAuthError } from "@/lib/authErrors";

type Stav = "nacitani" | "formular" | "neplatny";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stav, setStav] = useState<Stav>("nacitani");
  const navigate = useNavigate();
  const t = useT();

  useEffect(() => {
    let aktivni = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStav("formular");
    });

    // Propadlý nebo použitý odkaz vrací Supabase jako `#error=…` v adrese.
    const hash = window.location.hash;
    if (hash.includes("error")) setStav("neplatny");
    else if (hash.includes("type=recovery")) setStav("formular");

    // Klient Supabase zpracuje token z odkazu hned při startu aplikace a adresu
    // vyčistí — dřív, než se tahle stránka připojí. Pak tu nezbude ani hash,
    // ani událost PASSWORD_RECOVERY, a stránka do 15. 9. 2026 ukazovala
    // „Načítání…" navždy. `getSession` počká na dokončení startu: přihlášení
    // z odkazu je v tu chvíli už hotové, jinak odkaz neplatil.
    supabase.auth.getSession().then(({ data }) => {
      if (!aktivni) return;
      setStav((s) => (s !== "nacitani" ? s : data.session ? "formular" : "neplatny"));
    });

    return () => {
      aktivni = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(t("auth.new_password.mismatch"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(mapAuthError(error.message));
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  if (stav === "nacitani" && !done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground text-center">{t("loading")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (stav === "neplatny" && !done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl">{t("auth.new_password.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">{t("auth.new_password.invalid")}</p>
            <Button className="w-full" onClick={() => navigate("/auth/forgot-password")}>
              {t("auth.new_password.request_again")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">{t("auth.new_password.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {done ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">{t("auth.new_password.success")}</p>
              <Button className="w-full" onClick={() => navigate("/auth")}>
                {t("auth.submit.login")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.new_password.label")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">{t("auth.new_password.confirm")}</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t("auth.loading") : t("auth.new_password.submit")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
