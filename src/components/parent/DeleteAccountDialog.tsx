import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { PROVOZOVATEL, chybi } from "@/content/legal";
import { pad } from "@/lib/czechGrammar";
import type { Child } from "@/hooks/useChildren";

/** Slovo, které musí rodič opsat. Krátké, ale ne omylem napsatelné. */
const POTVRZENI = "SMAZAT";

/**
 * Znamená tahle chyba, že edge funkce vůbec neběží?
 *
 * Rozdíl je zásadní, a proto to stojí zvlášť a je to otestované: při
 * nedostupné funkci víme jistě, že se NIC nesmazalo, a musíme to říct
 * naplno. U ostatních chyb (500 uprostřed mazání) jistotu nemáme, takže
 * nesmíme tvrdit ani „smazáno", ani „nic se nestalo".
 */
export function funkceNedostupna(error: unknown): boolean {
  if (!error) return false;
  const e = error as { message?: string; context?: { status?: number } };
  if (e.context?.status === 404) return true;
  return /Failed to (send a request|fetch)/i.test(e.message ?? "");
}

interface Props {
  /** Záměrně NE `children`: ten název má v Reactu vlastní význam a tady jde
      o data, ne o vnořený obsah. */
  deti: Child[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Trvalé smazání rodičovského účtu.
 *
 * Google Play i Apple vyžadují mazání účtu přímo v aplikaci u každé služby,
 * která umí účet založit. Bez tohohle dialogu se aplikace do obchodů nedostane.
 *
 * ── Proč opisování slova ────────────────────────────────────────────────────
 * Prosté „Opravdu?" se odklikne bez čtení. Opsání slova vyžaduje, aby si člověk
 * přečetl, co maže — a u akce, která nejde vrátit, to za tu vteřinu stojí.
 *
 * ── Proč se výslovně řeší nenasazená funkce ─────────────────────────────────
 * Mazání běží přes edge funkci `delete-account`, kterou nasazuje provozovatel.
 * Dokud nasazená není, vrací volání 404. Nejhorší možné chování by bylo tvářit
 * se, že se účet smazal — uživatel by odešel v přesvědčení, že jeho data jsou
 * pryč, a ona by tam byla dál. Proto se při 404 NEODHLAŠUJEME, nic netvrdíme
 * a nabídneme cestu, která funguje vždycky: napsat na kontaktní e-mail.
 */
export function DeleteAccountDialog({ deti, open, onOpenChange }: Props) {
  const [opis, setOpis] = useState("");
  const [maze, setMaze] = useState(false);
  const [chyba, setChyba] = useState<string | null>(null);

  const potvrzeno = opis.trim().toUpperCase() === POTVRZENI;

  const zavri = (dalsi: boolean) => {
    if (maze) return; // uprostřed mazání dialog nezavírej
    if (!dalsi) {
      setOpis("");
      setChyba(null);
    }
    onOpenChange(dalsi);
  };

  const smaz = async () => {
    if (!potvrzeno || maze) return;
    setMaze(true);
    setChyba(null);

    try {
      const { data, error } = await supabase.functions.invoke("delete-account", {
        body: { confirm: POTVRZENI },
      });

      if (error) {
        setChyba(
          funkceNedostupna(error)
            ? "Mazání účtu se teď nepodařilo spustit. Účet je pořád aktivní — nic jsme nesmazali. " +
                `Napište nám prosím na ${kontakt()} a smažeme ho ručně.`
            : "Účet se nepodařilo smazat. Zkuste to prosím znovu, nebo nám napište na " +
                `${kontakt()}.`,
        );
        setMaze(false);
        return;
      }

      // Funkce vrací `error` i ve 200 větvi jen výjimečně; kdyby se to stalo,
      // radši to přiznáme, než abychom uživatele odhlásili do prázdna.
      if (data && typeof data === "object" && "error" in data) {
        setChyba(String((data as { error: unknown }).error));
        setMaze(false);
        return;
      }

      // Účet už neexistuje — session je bezcenná. `signOut` může selhat
      // (token neplatí), na tom ale nezáleží, tak se jeho výsledkem neřídíme.
      await supabase.auth.signOut().catch(() => undefined);
      window.location.href = "/";
    } catch {
      setChyba(
        `Účet se nepodařilo smazat. Napište nám prosím na ${kontakt()}.`,
      );
      setMaze(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={zavri}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-destructive-muted">
            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden />
          </div>
          <DialogTitle>Smazat účet</DialogTitle>
          <DialogDescription>
            Tohle nejde vzít zpět. Smažeme váš účet i všechno, co jsme si o učení
            uložili.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted p-4">
            <p className="text-sm font-semibold text-foreground">Zmizí tím:</p>
            <ul className="mt-2 space-y-1 text-sm text-foreground-soft">
              <li>• váš přihlašovací účet</li>
              {deti.length > 0 && (
                <li>
                  • {pad(deti.length, "PROFIL")} dětí — {deti.map((d) => d.child_name).join(", ")}
                </li>
              )}
              <li>• historie procvičování a všechny přehledy</li>
              <li>• zadané úkoly</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="potvrzeni-smazani" className="block text-sm text-foreground-soft">
              Pro potvrzení opište slovo{" "}
              <strong className="font-mono font-semibold text-foreground">{POTVRZENI}</strong>:
            </label>
            <Input
              id="potvrzeni-smazani"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              autoComplete="off"
              disabled={maze}
              placeholder={POTVRZENI}
              aria-describedby={chyba ? "chyba-smazani" : undefined}
            />
          </div>

          {chyba && (
            <p
              id="chyba-smazani"
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive-muted p-3 text-sm leading-relaxed text-destructive"
            >
              {chyba}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => zavri(false)} disabled={maze}>
            Nechat účet
          </Button>
          <Button variant="destructive" onClick={smaz} disabled={!potvrzeno || maze}>
            {maze && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {maze ? "Mažu…" : "Smazat účet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Kontakt z právních údajů; když ho provozovatel nedoplnil, řekni to rovnou. */
function kontakt(): string {
  return chybi(PROVOZOVATEL.email)
    ? "kontaktní e-mail uvedený v zásadách ochrany osobních údajů"
    : PROVOZOVATEL.email;
}
