import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useT } from "@/lib/i18n";
import { AnonMigrationDialog } from "@/components/AnonMigrationDialog";
import { hasAnonProgress, migrateAnonProgress, clearAnonData } from "@/lib/anonMigration";
import { BackButton } from "@/components/BackButton";
import { LandingNav } from "@/pages/LandingNav";

export default function ChildAuth() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useT();

  const [showMigration, setShowMigration] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [pairedUserId, setPairedUserId] = useState<string | null>(null);
  const [pairedChildId, setPairedChildId] = useState<string | null>(null);

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

      if (data?.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        const userId = data.session.user?.id ?? data.user?.id;
        const childId = data.child?.id ?? data.child_id;

        if (userId && childId && hasAnonProgress()) {
          setPairedUserId(userId);
          setPairedChildId(childId);
          setShowMigration(true);
          setLoading(false);
          return;
        }

        window.location.href = "/";
      }
    } catch {
      setError("Nepodařilo se připojit k serveru.");
    } finally {
      if (!showMigration) setLoading(false);
    }
  };

  const handleMigrationConfirm = async () => {
    if (!pairedUserId || !pairedChildId) return;
    setMigrationLoading(true);
    const result = await migrateAnonProgress(pairedUserId, pairedChildId);
    setMigrationLoading(false);
    setShowMigration(false);
    if (!result.ok) {
      setError(`Přenos pokroku selhal: ${result.error ?? "neznámá chyba"}`);
      return;
    }
    window.location.href = "/";
  };

  const handleMigrationSkip = () => {
    clearAnonData();
    setShowMigration(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-orange-50">
      <LandingNav />
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="mb-6">
          <BackButton to="/auth" />
        </div>

        <div className="space-y-4">

          {/* Výběr role — žák zvýrazněný */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-left hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
            >
              <div className="text-2xl mb-1">👨‍👩‍👧</div>
              <p className="font-bold text-sm text-slate-900">Jsem rodič</p>
              <p className="text-xs text-slate-500 mt-0.5">Sledovat pokrok dítěte</p>
            </button>
            <button
              className="rounded-2xl border-2 border-violet-400 bg-violet-50 px-4 py-4 text-left shadow-md cursor-default"
            >
              <div className="text-2xl mb-1">🎒</div>
              <p className="font-bold text-sm text-slate-900">Jsem žák</p>
              <p className="text-xs text-violet-600 mt-0.5">Přihlásit se kódem</p>
            </button>
          </div>

          {/* Formulář */}
          <Card className="w-full shadow-xl border-violet-100/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl font-bold">
                {t("auth.child.title")}
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground mt-1">
                {t("auth.child.instruction")}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                <p className="font-bold mb-1">Nemáš kód?</p>
                <p className="text-amber-800 text-xs">Kód ti musí vygenerovat rodič v Oli. Požádej ho, ať se zaregistruje na <strong>oli-edu.com</strong>, přidá tě a ukáže ti kód.</p>
                <Button
                  variant="link"
                  className="mt-1 h-auto p-0 text-sm text-amber-700 font-semibold"
                  onClick={() => navigate("/student")}
                >
                  Zatím pokračovat bez přihlášení →
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {showMigration && (
        <AnonMigrationDialog
          onConfirm={handleMigrationConfirm}
          onSkip={handleMigrationSkip}
          loading={migrationLoading}
        />
      )}
    </div>
  );
}
