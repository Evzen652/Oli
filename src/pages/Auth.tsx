import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
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
        }
        setMessage(t("auth.register_success"));
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {isLogin ? t("auth.title.login") : t("auth.title.register")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="default"
              className="w-full"
              type="button"
            >
              {t("auth.role.parent")}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => navigate("/auth/child")}
            >
              {t("auth.role.child")}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
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
              {loading ? t("auth.loading") : isLogin ? t("auth.submit.login") : t("auth.submit.register")}
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
            {isLogin ? t("auth.switch_to_register") : t("auth.switch_to_login")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
