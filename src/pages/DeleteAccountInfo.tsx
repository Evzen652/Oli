import { Link } from "react-router-dom";
import { LegalLayout, LegalSection, Doplnit } from "@/components/LegalLayout";
import { PROVOZOVATEL, LHUTA_SMAZANI_2P, LHUTA_ANON_6P, chybi } from "@/content/legal";

/** Vypíše hodnotu, nebo viditelný zástupný text, když ji provozovatel nedoplnil. */
function Udaj({ hodnota, co }: { hodnota: string | null; co: string }) {
  if (hodnota === null) return null;
  return chybi(hodnota) ? <Doplnit co={co} /> : <>{hodnota}</>;
}

/**
 * Veřejná stránka „jak smazat účet".
 *
 * Google Play vyžaduje kromě mazání v aplikaci i webovou adresu, na které jde
 * o smazání požádat BEZ instalace — tuhle URL se vyplňuje do Play Console.
 * Proto musí být dostupná odhlášenému a nesmí nic vyžadovat.
 *
 * Účelně obsahuje obě cesty: v aplikaci (rychlá) i e-mailem (funguje vždycky,
 * i když člověk aplikaci už odinstaloval nebo se nemůže přihlásit).
 */
export default function DeleteAccountInfo() {
  return (
    <LegalLayout
      title="Jak smazat účet"
      perex="Účet i všechna data dětí smažeme na požádání. Jsou na to dvě cesty — vyberte si, která je pro vás jednodušší."
    >
      <LegalSection id="v-aplikaci" title="V aplikaci (nejrychlejší)">
        <p>
          Přihlaste se jako rodič, sjeďte na konec přehledu a v části{" "}
          <strong className="text-foreground">Smazat účet</strong> klikněte na stejnojmenné
          tlačítko. Pro jistotu vás požádáme o opsání slova, ať se to nestane omylem.
        </p>
        <p>Smazání proběhne hned.</p>
      </LegalSection>

      <LegalSection id="emailem" title="E-mailem (když se nemůžete přihlásit)">
        <p>
          Napište nám z e-mailu, kterým jste se registrovali, na{" "}
          <strong className="text-foreground"><Udaj hodnota={PROVOZOVATEL.email} co="kontaktní e-mail" /></strong>.
          Stačí věta, že chcete účet smazat.
        </p>
        <p>Vyřídíme to do {LHUTA_SMAZANI_2P}.</p>
      </LegalSection>

      <LegalSection id="co-se-smaze" title="Co se smaže">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>přihlašovací účet rodiče;</li>
          <li>profily všech dětí včetně jmen a ročníků;</li>
          <li>historie procvičování, výsledky a přehledy;</li>
          <li>zadané úkoly a pozvánky.</li>
        </ul>
        <p>
          Smazání je trvalé — data nedokážeme obnovit ani na požádání. Pokud si
          chcete přehled o učení nechat, uložte si ho ještě před smazáním.
        </p>
      </LegalSection>

      <LegalSection id="bez-uctu" title="Když jste se nikdy neregistrovali">
        <p>
          Používáte-li Oli bez účtu, žádné vaše osobní údaje nemáme — pokrok visí
          na náhodném identifikátoru v prohlížeči. Zmizí, když v prohlížeči smažete
          data webu. Serverovou kopii mažeme po {LHUTA_ANON_6P} bez aktivity.
        </p>
      </LegalSection>

      <LegalSection id="dal" title="Souvisí">
        <p>
          Co všechno o vás ukládáme a proč, popisují{" "}
          <Link to="/soukromi" className="font-medium text-primary hover:text-primary-hover hover:underline">
            zásady ochrany osobních údajů
          </Link>
          . Pravidla používání najdete v{" "}
          <Link to="/podminky" className="font-medium text-primary hover:text-primary-hover hover:underline">
            podmínkách
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
