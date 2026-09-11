import { useCallback, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";

/**
 * Rodičovská brána — překážka, kterou projde dospělý a malé dítě ne.
 *
 * Google Play Families i Apple Kids Category ji vyžadují všude, kde by dítě
 * mohlo opustit dětskou část aplikace, něco zaplatit nebo poslat data ven.
 * Bez ní aplikace pro děti neprojde kontrolou.
 *
 * ── Proč zrovna procenta ────────────────────────────────────────────────────
 * Obvyklá výtka: „Oli je aplikace na procvičování matematiky, tak je početní
 * úloha na bránu divná." Je to oprávněné a stojí za vysvětlení.
 *
 * Brána musí být nad rámec toho, co umí CÍLOVÉ dítě. Oli má otevřené ročníky
 * 2–6 a procenta jsou podle RVP učivo až 7. ročníku — „30 % z 240" je tedy
 * nad možnostmi dnešních uživatelů, a přitom pro dospělého běžná věc (sleva
 * v obchodě). Do 2026-09-11 tu bylo dvojciferné násobení; to učí 5. ročník,
 * takže s jeho otevřením přestalo stačit.
 *
 * ⚠️ POZOR NA BUDOUCNOST: jakmile se otevře 7. ročník, zeslábne i tahle brána
 * (hlídá to `src/test/parent-gate.test.ts`). Pak vyměň úlohu za něco, co se
 * na základní škole neučí.
 *
 * ── Proč se nepamatuje natrvalo ─────────────────────────────────────────────
 * Úspěch platí jen krátce a jen v paměti — žádné `localStorage`. Kdyby se
 * uložil, dítě by po jednom projití rodiče mělo bránu otevřenou napořád.
 */

/** Jak dlouho po úspěchu se brána znovu neptá (ms). */
const PLATNOST_MS = 3 * 60 * 1000;

/** Kolik špatných pokusů, než se úloha vymění (brání hádání). */
const POKUSU_NA_ULOHU = 3;

interface Uloha {
  procento: number;
  zaklad: number;
  vysledek: number;
}

const PROCENTA = [10, 20, 25, 30, 40, 60, 75, 80];

/** Úloha „X % ze Y" s celým výsledkem; ne ze sta a ne polovina (to by bylo zadarmo). */
export function novaUloha(): Uloha {
  const procento = PROCENTA[Math.floor(Math.random() * PROCENTA.length)];
  let zaklad = 100;
  // Násobky 20 od 60 do 480: s každým procentem ze seznamu vyjde celé číslo.
  while (zaklad === 100) zaklad = 20 * (3 + Math.floor(Math.random() * 22));
  return { procento, zaklad, vysledek: (procento * zaklad) / 100 };
}

export function useParentGate() {
  const [open, setOpen] = useState(false);
  const [uloha, setUloha] = useState<Uloha>(novaUloha);
  const [odpoved, setOdpoved] = useState("");
  const [chyba, setChyba] = useState<string | null>(null);
  const [pokusy, setPokusy] = useState(0);

  /** Akce, která se spustí po úspěšném projití. */
  const akce = useRef<(() => void) | null>(null);
  /** Kdy naposledy někdo bránou prošel. Jen v paměti, schválně. */
  const posledniUspech = useRef<number>(0);

  const requireParent = useCallback((action: () => void) => {
    if (Date.now() - posledniUspech.current < PLATNOST_MS) {
      action();
      return;
    }
    akce.current = action;
    setUloha(novaUloha());
    setOdpoved("");
    setChyba(null);
    setPokusy(0);
    setOpen(true);
  }, []);

  const zavri = useCallback(() => {
    akce.current = null;
    setOpen(false);
  }, []);

  const overit = useCallback(() => {
    const zadano = Number(odpoved.trim());
    if (!Number.isFinite(zadano) || odpoved.trim() === "") {
      setChyba("Zadejte prosím výsledek číslicemi.");
      return;
    }
    if (zadano === uloha.vysledek) {
      posledniUspech.current = Date.now();
      setOpen(false);
      const spustit = akce.current;
      akce.current = null;
      spustit?.();
      return;
    }

    const dalsi = pokusy + 1;
    setPokusy(dalsi);
    setOdpoved("");
    if (dalsi >= POKUSU_NA_ULOHU) {
      // Nová úloha místo dalšího hádání téže.
      setUloha(novaUloha());
      setPokusy(0);
      setChyba("To nesedí. Zkuste tenhle příklad.");
    } else {
      setChyba("To nesedí, zkuste to znovu.");
    }
  }, [odpoved, uloha, pokusy]);

  const gateElement = (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : zavri())}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-accent">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <DialogTitle>Tohle je pro rodiče</DialogTitle>
          <DialogDescription>
            Ověříme, že u zařízení je dospělý. Kolik je:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p
            className="text-center font-display text-3xl font-bold tabular-nums text-foreground"
            aria-live="polite"
          >
            {uloha.procento} % z {uloha.zaklad}
          </p>

          <div className="space-y-2">
            <label htmlFor="rodicovska-brana" className="sr-only">
              Kolik je {uloha.procento} procent z {uloha.zaklad}
            </label>
            <Input
              id="rodicovska-brana"
              inputMode="numeric"
              autoComplete="off"
              value={odpoved}
              onChange={(e) => {
                setOdpoved(e.target.value);
                setChyba(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") overit();
              }}
              placeholder="Výsledek"
              className="text-center text-lg"
              aria-describedby={chyba ? "brana-chyba" : undefined}
              autoFocus
            />
            {chyba && (
              <p id="brana-chyba" role="alert" className="text-sm text-destructive">
                {chyba}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={zavri} className="flex-1">
              Zpět
            </Button>
            <Button onClick={overit} disabled={!odpoved.trim()} className="flex-1">
              Pokračovat
            </Button>
          </div>

          <p className="text-center text-caption text-muted-foreground">
            Tenhle krok chrání děti — vede odsud do části pro dospělé.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { requireParent, gateElement };
}
