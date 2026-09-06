import { LegalLayout, LegalSection, Doplnit } from "@/components/LegalLayout";
import {
  PROVOZOVATEL,
  PRIJEMCI,
  LHUTA_SMAZANI,
  LHUTA_ANON,
  chybi,
} from "@/content/legal";

/** Vypíše hodnotu, nebo viditelný zástupný text, když ji provozovatel nedoplnil. */
function Udaj({ hodnota, co }: { hodnota: string | null; co: string }) {
  if (hodnota === null) return null;
  return chybi(hodnota) ? <Doplnit co={co} /> : <>{hodnota}</>;
}

/**
 * Zásady ochrany osobních údajů.
 *
 * Text popisuje SKUTEČNÉ chování aplikace, ověřené proti kódu 6. 9. 2026 —
 * ne obecnou šablonu. Konkrétně:
 *   • seznam příjemců odpovídá voláním ven (viz `PRIJEMCI` v content/legal.ts),
 *   • tvrzení „žádná analytika" je ověřené: v repu není gtag, Plausible,
 *     PostHog, Sentry ani reklamní SDK,
 *   • mazání účtu je popsané jako žádost e-mailem, protože tlačítko v aplikaci
 *     zatím NEEXISTUJE. Až vznikne, přepiš část „Vaše práva" — do té doby by
 *     zmínka o něm byla nepravdivá.
 *
 * Tenhle text není právní posudek. Před spuštěním ho nech projít právníkem;
 * u služby mířené na děti to není formalita.
 */
export default function Privacy() {
  return (
    <LegalLayout
      title="Zásady ochrany osobních údajů"
      perex="Oli je aplikace pro děti, takže k datům přistupujeme opatrněji než je běžné. Neprodáváme je, neměříme chování napříč weby a nezobrazujeme reklamu. Níže je popsané, co konkrétně ukládáme a proč."
    >
      <LegalSection id="spravce" title="Kdo za data odpovídá">
        <p>
          Správcem osobních údajů je <strong className="text-foreground"><Udaj hodnota={PROVOZOVATEL.nazev} co="jméno nebo firma provozovatele" /></strong>
          {PROVOZOVATEL.ico !== null && (
            <>, IČO <Udaj hodnota={PROVOZOVATEL.ico} co="IČO" /></>
          )}
          , se sídlem <Udaj hodnota={PROVOZOVATEL.adresa} co="adresa sídla" />.
        </p>
        <p>
          Ve všem, co se týká vašich údajů, se na nás obraťte na{" "}
          <strong className="text-foreground"><Udaj hodnota={PROVOZOVATEL.email} co="kontaktní e-mail" /></strong>.
          Na žádosti odpovídáme nejpozději do jednoho měsíce.
        </p>
      </LegalSection>

      <LegalSection id="bez-uctu" title="Když aplikaci používáte bez registrace">
        <p>
          Oli jde spustit rovnou — dítě si vybere ročník a začne. V tom režimu{" "}
          <strong className="text-foreground">neukládáme jméno, e-mail ani nic, podle čeho by šlo dítě identifikovat.</strong>
        </p>
        <p>
          V prohlížeči vznikne náhodný technický identifikátor a k němu se ukládá
          zvolený ročník, otevřená témata a výsledky procvičování. Slouží k jedinému
          účelu: aby pokrok nezmizel při zavření stránky. Kopie je i na našem serveru,
          aby se pokrok neztratil při výměně zařízení.
        </p>
        <p>
          Když v prohlížeči smažete data webu, vazba na tenhle pokrok zanikne a
          nedokážeme ho k nikomu přiřadit. Serverovou kopii mažeme po{" "}
          {LHUTA_ANON} bez aktivity.
        </p>
      </LegalSection>

      <LegalSection id="ucet" title="Když si rodič založí účet">
        <p>Po registraci zpracováváme:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong className="text-foreground">e-mail rodiče</strong> — kvůli přihlášení, obnově hesla a
            e-mailům o dítěti;
          </li>
          <li>
            <strong className="text-foreground">jméno rodiče</strong>, pokud ho vyplní — jen kvůli oslovení
            v aplikaci;
          </li>
          <li>
            <strong className="text-foreground">jméno dítěte a jeho ročník</strong> — zadává je rodič.
            Klidně použijte přezdívku, aplikace nepotřebuje jméno skutečné.
          </li>
        </ul>
        <p>
          Právním základem je plnění smlouvy — bez těchto údajů službu poskytnout
          nedokážeme.
        </p>
      </LegalSection>

      <LegalSection id="dite" title="Co ukládáme o učení dítěte">
        <p>
          O každém procvičování si vedeme, jaké téma a úroveň dítě dělalo, kolik
          odpovědí bylo správně, jestli si vzalo nápovědu a jak dlouho odpovídalo.
          Z toho skládáme přehled pro rodiče a doporučení, co procvičit dál.
        </p>
        <p>
          K výsledkům dítěte má přístup <strong className="text-foreground">jen ten rodič, ke kterému je dítě
          připojené</strong>. Jiní rodiče ani jiné děti je nevidí.
        </p>
      </LegalSection>

      <LegalSection id="co-nedelame" title="Co neděláme">
        <p>
          Tahle část je stejně důležitá jako ta předchozí, tak ji píšeme natvrdo.
          V aplikaci <strong className="text-foreground">není žádný analytický ani reklamní nástroj</strong> —
          neměříme chování napříč weby, nesestavujeme profily pro cílení reklamy a
          nezobrazujeme reklamu žádného druhu.
        </p>
        <p>
          Osobní údaje <strong className="text-foreground">neprodáváme a nepředáváme je nikomu k jeho vlastním
          účelům.</strong> Předáváme je jen tomu, kdo je nutný k provozu služby — a ty
          vyjmenováváme v další části.
        </p>
      </LegalSection>

      <LegalSection id="prijemci" title="Komu se data dostanou do rukou">
        <p>
          Tenhle seznam odpovídá skutečným voláním v kódu, ne obecné formulaci.
          Každý z uvedených zpracovává data jen podle našich pokynů.
        </p>
        <div className="space-y-3">
          {PRIJEMCI.map((p) => (
            <div key={p.nazev} className="rounded-xl border border-border bg-card p-4 shadow-e1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="font-semibold text-foreground">{p.nazev}</p>
                <p className="text-sm text-muted-foreground">{p.umisteni}</p>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-soft">{p.ucel}</p>
            </div>
          ))}
        </div>
        <p>
          U příjemců mimo Evropskou unii je předání kryté standardními smluvními
          doložkami podle rozhodnutí Evropské komise.
        </p>
      </LegalSection>

      <LegalSection id="ai" title="Kde se do toho plete umělá inteligence">
        <p>
          Slovní hodnocení po procvičování a týdenní shrnutí pro rodiče píše jazykový
          model. Posílá se mu <strong className="text-foreground">téma, úroveň a počet správných odpovědí</strong> —
          ne jméno dítěte a ne text jeho odpovědí.
        </p>
        <p>
          Cvičení samotná <strong className="text-foreground">umělá inteligence negeneruje</strong>. Píšou se
          předem a ukládají do aplikace jako pevný obsah, takže dítěti se nikdy
          nezobrazí úloha, kterou by nikdo předtím neviděl.
        </p>
      </LegalSection>

      <LegalSection id="jak-dlouho" title="Jak dlouho data držíme">
        <p>
          Údaje účtu a výsledky dítěte máme po dobu, kdy účet trvá. Po jeho zrušení
          je mažeme do {LHUTA_SMAZANI} — ta lhůta je pojistka proti omylu, ne archiv.
        </p>
        <p>Pokrok z používání bez registrace mažeme po {LHUTA_ANON} bez aktivity.</p>
      </LegalSection>

      <LegalSection id="prava" title="Vaše práva">
        <p>
          Máte právo na přístup ke svým údajům, na jejich opravu, na výmaz, na
          omezení zpracování, na přenesení k jiné službě a právo vznést námitku.
          Uplatníte je e-mailem na{" "}
          <strong className="text-foreground"><Udaj hodnota={PROVOZOVATEL.email} co="kontaktní e-mail" /></strong>.
        </p>
        <p>
          O smazání účtu a všech dat dítěte nás požádejte na tomtéž e-mailu; vyřídíme
          to do {LHUTA_SMAZANI}.
        </p>
        <p>
          Když budete mít za to, že s údaji nakládáme špatně, můžete si stěžovat u
          Úřadu pro ochranu osobních údajů, Pplk. Sochora 27, Praha 7.
        </p>
      </LegalSection>

      <LegalSection id="zmeny" title="Změny">
        <p>
          Když se zásady změní, uvedeme nové datum účinnosti nahoře. U podstatných
          změn dáme vědět registrovaným rodičům e-mailem.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
