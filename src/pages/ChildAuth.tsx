import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useT } from "@/lib/i18n";

export default function ChildAuth() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useT();

  const handleSubmit = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnErr } = await supabase.functions.invoke("pair-child", {
        body: { pairing_code: code.toUpperCase() },
      });

      if (fnErr || data?.error) {
        setError(data?.error || fnErr?.message || "Něco se pokazilo.");
        setLoading(false);
        return;
      }

      // Set session from edge function response
      if (data?.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        // Reload to trigger auth state change
        window.location.href = "/";
      }
    } catch {
      setError("Nepodařilo se připojit k serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">{t("auth.child.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {t("auth.child.instruction")}
          </p>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={code.length !== 6 || loading}
            className="w-full"
          >
            {loading ? t("auth.loading") : t("auth.child.submit")}
          </Button>

          <Button
            variant="link"
            className="w-full text-sm text-muted-foreground"
            onClick={() => navigate("/auth")}
          >
            {t("auth.child.back")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
