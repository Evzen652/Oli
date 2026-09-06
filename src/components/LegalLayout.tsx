import { LandingNav } from "@/pages/LandingNav";
import { BackButton } from "@/components/BackButton";
import { UCINNE_OD, chybiCokoliv } from "@/content/legal";

interface LegalLayoutProps {
  title: string;
  perex: string;
  children: React.ReactNode;
}

/**
 * Společný rám pro Zásady soukromí a Podmínky použití.
 *
 * Obě stránky musí být čitelné BEZ přihlášení — recenzent Google Play i App
 * Store je otevírá odhlášený a z URL, kterou vyplníš do formuláře. Proto sem
 * nepatří nic, co by vyžadovalo session.
 *
 * Šířka textu je omezená na ~68 znaků: právní text se čte hůř než běžný a
 * dlouhé řádky ho dělají ještě nepřístupnějším.
 */
export function LegalLayout({ title, perex, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Ve vývoji křičí, dokud nejsou vyplněné údaje provozovatele. V produkci
          se místo banneru zvýrazní přímo ta konkrétní chybějící hodnota v textu. */}
      {import.meta.env.DEV && chybiCokoliv() && (
        <div className="border-b border-warning/40 bg-warning-muted px-4 py-2.5 text-center">
          <p className="text-sm font-semibold text-warning">
            Nevyplněné údaje provozovatele — viz <code className="font-mono">src/content/legal.ts</code>.
            Takhle se stránka nesmí nasadit.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="mb-8">
          <BackButton to="/" />
        </div>

        <header className="space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="text-base leading-relaxed text-foreground-soft">{perex}</p>
          <p className="text-sm text-muted-foreground">Účinné od {UCINNE_OD}.</p>
        </header>

        <div className="space-y-10 py-10">{children}</div>

        <footer className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Máte k tomuhle dokumentu otázku? Napište nám — kontakt najdete výš v části
            o správci údajů.
          </p>
        </footer>
      </div>
    </div>
  );
}

/** Jedna očíslovaná část dokumentu. */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3 scroll-mt-24">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="space-y-3 text-base leading-relaxed text-foreground-soft">
        {children}
      </div>
    </section>
  );
}

/**
 * Hodnota, kterou musí doplnit provozovatel. Dokud chybí, je vidět — schválně.
 * Tichý zástupný text v právním dokumentu je horší než křiklavý.
 */
export function Doplnit({ co }: { co: string }) {
  return (
    <mark className="rounded bg-warning-muted px-1 py-0.5 font-mono text-sm font-semibold text-warning">
      [doplnit: {co}]
    </mark>
  );
}
