import { Link } from "react-router-dom";
import { LegalLayout, LegalSection, Doplnit } from "@/components/LegalLayout";
import { PROVOZOVATEL, LHUTA_SMAZANI, chybi } from "@/content/legal";

/** Vypíše hodnotu, nebo viditelný zástupný text, když ji provozovatel nedoplnil. */
function Udaj({ hodnota, co }: { hodnota: string | null; co: string }) {
  if (hodnota === null) return null;
  return chybi(hodnota) ? <Doplnit co={co} /> : <>{hodnota}</>;
}

/**
 * Podmínky použití.
 *
 * Držet v souladu s tím, co slibuje landing. Konkrétně: ceník na landingu má
 * placené plány označené jako „Připravujeme" a větu „Placené plány zatím
 * nespouštíme". Část „Kolik to stojí" níž říká totéž — když se jedno změní,
 * musí se změnit i druhé, jinak si dokumenty odporují.
 *
 * Není to právní posudek; před spuštěním nech projít právníkem.
 */
export default function Terms() {
  return (
    <LegalLayout
      title="Podmínky použití"
      perex="Krátce a bez právničiny: co Oli je, co od nás můžete čekat a co čekáme my od vás. Používáním aplikace s těmito podmínkami souhlasíte."
    >
      <LegalSection id="kdo" title="Kdo službu provozuje">
        <p>
          Oli provozuje{" "}
          <strong className="text-foreground"><Udaj hodnota={PROVOZOVATEL.nazev} co="jméno nebo firma provozovatele" /></strong>
          {PROVOZOVATEL.ico !== null && (
            <>, IČO <Udaj hodnota={PROVOZOVATEL.ico} co="IČO" /></>
          )}
          . Kontakt:{" "}
          <strong className="text-foreground"><Udaj hodnota={PROVOZOVATEL.email} co="kontaktní e-mail" /></strong>.
        </p>
      </LegalSection>

      <LegalSection id="co-to-je" title="Co Oli je a co není">
        <p>
          Oli je pomůcka na procvičování učiva základní školy. Připraví dítěti
          cvičení podle ročníku a tématu a rodiči ukáže, jak mu to jde.
        </p>
        <p>
          <strong className="text-foreground">Oli nenahrazuje školu ani učitele</strong> a není diagnostický
          nástroj. Výsledky v aplikaci neříkají nic o inteligenci ani o studijních
          předpokladech dítěte — ukazují jen, jak mu šla konkrétní cvičení. Podle
          nich nedělejte závažná rozhodnutí o vzdělávání dítěte.
        </p>
        <p>
          Obsah připravujeme podle Rámcového vzdělávacího programu, ale nemůžeme
          zaručit, že přesně odpovídá tomu, co se dítě zrovna učí ve své třídě.
        </p>
      </LegalSection>

      <LegalSection id="ucet" title="Účet a děti">
        <p>
          Účet si zakládá <strong className="text-foreground">dospělý</strong> — rodič nebo jiný zákonný
          zástupce. Zakládáte-li účet, potvrzujete, že jste zletilí a že jste
          oprávněni jednat za dítě, jehož profil vytvoříte.
        </p>
        <p>
          Dítě se do aplikace dostane buď kódem od rodiče, nebo bez registrace, jen
          výběrem ročníku. Bez registrace neukládáme nic, podle čeho by šlo dítě
          identifikovat — podrobně to popisují{" "}
          <Link to="/soukromi" className="font-medium text-primary hover:text-primary-hover hover:underline">
            zásady ochrany osobních údajů
          </Link>
          .
        </p>
        <p>
          Za používání aplikace dítětem odpovídá rodič. Heslo ani párovací kód
          nikomu dalšímu nepředávejte.
        </p>
      </LegalSection>

      <LegalSection id="cena" title="Kolik to stojí">
        <p>
          <strong className="text-foreground">Momentálně nic.</strong> Registrace i veškerý hotový obsah jsou
          zdarma a platební kartu po vás nechceme.
        </p>
        <p>
          V ceníku ukazujeme plány, které teprve připravujeme, abyste dopředu věděli,
          s čím počítat. Dokud je nespustíme, neplatí se nic. Kdybychom placené plány
          zavedli, dáme vědět předem a nikdy se nezpoplatní zpětně to, co jste už
          používali zdarma.
        </p>
      </LegalSection>

      <LegalSection id="pravidla" title="Co od vás čekáme">
        <p>Při používání Oli, prosím:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>nepokoušejte se obcházet zabezpečení ani se dostat k cizím účtům;</li>
          <li>nezatěžujte službu automatizovanými nástroji;</li>
          <li>nekopírujte obsah cvičení a nešiřte ho dál mimo aplikaci.</li>
        </ul>
        <p>
          Při závažném nebo opakovaném porušení můžeme účet omezit nebo zrušit.
          Pokud to jde, ozveme se předem.
        </p>
      </LegalSection>

      <LegalSection id="obsah" title="Obsah aplikace">
        <p>
          Cvičení, texty a ilustrace v Oli jsou naše dílo chráněné autorským právem.
          Můžete je používat pro vlastní potřebu a pro učení svých dětí. K jinému
          užití — třeba k výuce ve škole nebo k dalšímu šíření — nás napřed
          požádejte o souhlas.
        </p>
      </LegalSection>

      <LegalSection id="dostupnost" title="Dostupnost a odpovědnost">
        <p>
          Snažíme se, aby Oli fungovalo pořád, ale nemůžeme to zaručit. Službu
          můžeme na nezbytnou dobu odstavit kvůli údržbě nebo aktualizaci.
        </p>
        <p>
          Za škodu odpovídáme v rozsahu, který stanoví české právo. Neodpovídáme za
          výpadky způsobené vaším připojením, zařízením nebo zásahem vyšší moci.
          U bezplatné služby neodpovídáme za ušlý zisk ani za nepřímou škodu.
        </p>
      </LegalSection>

      <LegalSection id="ukonceni" title="Ukončení">
        <p>
          Používání můžete kdykoli ukončit. Účet smažete přímo v aplikaci — jako rodič
          dole v přehledu. Když se nemůžete přihlásit, napište nám na kontaktní e-mail
          výš a vyřídíme to do {LHUTA_SMAZANI}. Postup popisuje stránka{" "}
          <Link to="/smazani-uctu" className="font-medium text-primary hover:text-primary-hover hover:underline">
            jak smazat účet
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="zmeny" title="Změny podmínek">
        <p>
          Podmínky můžeme upravit. Nové znění zveřejníme tady a u podstatných změn
          dáme registrovaným rodičům vědět e-mailem. Když se změnou nebudete
          souhlasit, můžete používání ukončit.
        </p>
      </LegalSection>

      <LegalSection id="pravo" title="Rozhodné právo">
        <p>
          Vztah se řídí právem České republiky. Spory řeší české soudy. Jste-li
          spotřebitel, můžete se obrátit na Českou obchodní inspekci jako orgán
          mimosoudního řešení spotřebitelských sporů (
          <a
            href="https://www.coi.cz"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-primary hover:text-primary-hover hover:underline"
          >
            coi.cz
          </a>
          ).
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
