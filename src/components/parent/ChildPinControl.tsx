import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/lib/i18n";
import { KeyRound } from "lucide-react";
import type { Child } from "@/hooks/useChildren";

interface Props {
  child: Child;
  onChanged: () => void | Promise<void>;
  /** "onDark" = do tmavé hlavičky; "icon" = malé ikonové tlačítko ke správě účtu (vedle tužky/koše). */
  tone?: "default" | "onDark" | "icon";
}

// Rodič nastaví/změní/smaže 4místný PIN dítěte. S PINem se dítě po odhlášení
// vrátí do svého účtu jen jeho zadáním, bez nového párovacího kódu.
export function ChildPinControl({ child, onChanged, tone = "default" }: Props) {
  const t = useT();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const hasPin = !!child.pin_hash;

  const save = async (value: string | null) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("set-child-pin", {
        body: { child_id: child.id, pin: value },
      });
      if (error || data?.error) {
        toast({ description: data?.error || t("parent.pin.toast_error"), variant: "destructive" });
        setLoading(false);
        return;
      }
      toast({ description: value === null ? t("parent.pin.toast_cleared") : t("parent.pin.toast_saved") });
      setOpen(false);
      setPin("");
      await onChanged();
    } catch {
      toast({ description: t("parent.pin.toast_error"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {tone === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => { setPin(""); setOpen(true); }}
          aria-label={hasPin ? t("parent.pin.change") : t("parent.pin.set")}
          title={hasPin ? t("parent.pin.change") : t("parent.pin.hint_paired").replace("{name}", child.child_name)}
        >
          <KeyRound className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className={
            tone === "onDark"
              ? "gap-1 rounded-full bg-white/15 border-white/40 text-white hover:bg-white/25 hover:text-white"
              : "gap-1 rounded-full border-primary/30 text-primary hover:bg-accent"
          }
          onClick={() => { setPin(""); setOpen(true); }}
        >
          <KeyRound className="h-3 w-3" />
          {hasPin ? t("parent.pin.change") : t("parent.pin.set")}
        </Button>
      )}

      <Dialog open={open} onOpenChange={(o) => { if (!loading) setOpen(o); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("parent.pin.dialog_title").replace("{name}", child.child_name)}</DialogTitle>
            <DialogDescription>{t("parent.pin.dialog_desc")}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-2">
            <InputOTP maxLength={4} value={pin} onChange={setPin} inputMode="numeric" pattern="\d*">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={() => save(pin)} disabled={pin.length !== 4 || loading} className="w-full">
              {loading ? t("auth.loading") : t("parent.pin.save")}
            </Button>
            {hasPin && (
              <Button
                variant="ghost"
                onClick={() => save(null)}
                disabled={loading}
                className="w-full text-destructive hover:text-destructive"
              >
                {t("parent.pin.clear")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
