import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useChildren, type Child } from "@/hooks/useChildren";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/lib/i18n";
import type { Grade } from "@/lib/types";
import { BackButton } from "@/components/BackButton";
import { getAnonProgressSummary, migrateAnonProgress } from "@/lib/anonMigration";
import { pad } from "@/lib/czechGrammar";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function ParentOnboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const { addChild } = useChildren();
  const t = useT();

  // Anon pokrok z téhož prohlížeče (rodič zkusil appku, teď se registruje).
  const [anonSummary] = useState(() => getAnonProgressSummary());

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [locale, setLocale] = useState("cs");
  const [childName, setChildName] = useState("");
  const [grade, setGrade] = useState<Grade>((anonSummary?.grade as Grade) ?? 3);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [newChildId, setNewChildId] = useState<string | null>(null);
  const [claimState, setClaimState] = useState<"idle" | "claiming" | "done" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStep1 = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateProfile({ display_name: displayName.trim(), locale });
      setStep(2);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    if (!childName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const child = await addChild(childName.trim(), grade);
      setPairingCode(child.pairing_code);
      setNewChildId(child.id);
      setStep(3);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // F3: rodič zkusil appku anonymně ve stejném prohlížeči → převezme pokrok
  // přímo na nově vytvořené dítě (bez párovacího kódu).
  const handleClaimProgress = async () => {
    if (!newChildId) return;
    setClaimState("claiming");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const res = await migrateAnonProgress(user.id, newChildId);
      setClaimState(res.ok ? "done" : "error");
    } catch {
      setClaimState("error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <BackButton to="/" label="Zpět na úvod" />
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Odhlásit se
        </button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {step === 1 && t("onboarding.step1.title")}
            {step === 2 && t("onboarding.step2.title")}
            {step === 3 && t("onboarding.step3.title")}
          </CardTitle>
          <div className="flex justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">{t("onboarding.step1.name_label")}</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jan Novák"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("onboarding.step1.language_label")}</Label>
                <Select value={locale} onValueChange={setLocale}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Čeština</SelectItem>
                    <SelectItem value="pl" disabled>Polština (brzy)</SelectItem>
                    <SelectItem value="de" disabled>Němčina (brzy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleStep1} disabled={loading || !displayName.trim()} className="w-full">
                {loading ? t("auth.loading") : t("onboarding.step1.next")}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="childName">{t("onboarding.step2.child_name")}</Label>
                <Input
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Péťa"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("onboarding.step2.grade")}</Label>
                <Select value={String(grade)} onValueChange={(v) => setGrade(Number(v) as Grade)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={String(g)}>{g}. {t("parent.grade_label")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleStep2} disabled={!childName.trim() || loading} className="w-full">
                {loading ? t("auth.loading") : t("onboarding.step2.add")}
              </Button>
            </>
          )}

          {step === 3 && pairingCode && (
            <>
              {anonSummary && (
                <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-4 space-y-2 text-center">
                  <p className="text-sm font-semibold text-violet-900">
                    📈 Našli jsme pokrok z tvé zkoušky — {pad(anonSummary.completedCount, "ÚKOL")}.
                  </p>
                  {claimState === "done" ? (
                    <p className="text-sm font-medium text-emerald-700">✓ Pokrok přidán pro {childName}.</p>
                  ) : claimState === "error" ? (
                    <p className="text-sm text-destructive">Přenos se teď nepovedl — zkus to později z přehledu.</p>
                  ) : (
                    <Button onClick={handleClaimProgress} disabled={claimState === "claiming"} size="sm" className="w-full">
                      {claimState === "claiming" ? t("auth.loading") : `Převzít pokrok pro ${childName}`}
                    </Button>
                  )}
                </div>
              )}
              <p className="text-center text-muted-foreground">
                {t("onboarding.step3.instruction")}
              </p>
              <div className="flex justify-center">
                <div className="rounded-xl border-2 border-dashed border-primary bg-muted px-8 py-6">
                  <p className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">
                    {pairingCode}
                  </p>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {t("onboarding.step3.expires")}
              </p>
              <Button onClick={() => navigate("/parent")} className="w-full">
                {t("onboarding.step3.done")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
