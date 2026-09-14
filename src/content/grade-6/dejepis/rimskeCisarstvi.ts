/**
 * Dějepis 6. ročník — Římské císařství: Caesar, Augustus, Pax Romana (select_one).
 *
 * Faktický vzor (reckoPerskeValkyPeloponeskaValka): pevné disjunktní banky
 * POOL_L1 / POOL_L2 / POOL_L3, každá úloha s vlastní malou i velkou nápovědou,
 * vysvětlením PROČ a optionFeedback. Generátor vrací celou banku zamíchanou,
 * takže na každé úrovni je deterministicky ≥ 14 různých úloh.
 *
 * Chybový model — každý distraktor je jeden typický omyl:
 *  1. Caesar = první císař (kvůli slovům „císař“ a „kaiser“); ve skutečnosti byl
 *     doživotní diktátor a prvním císařem se stal Octavianus Augustus.
 *  2. Letopočty př. n. l. čtené jako n. l. (větší číslo = později), sčítání místo
 *     odčítání, rok ubraný navíc (plotový omyl).
 *  3. Záměna postav téhož příběhu (Octavianus × Antonius × Brutus × Pompeius).
 *  4. Pax Romana doslova jako „žádná válka nikde“ nebo jako Caesarova zásluha.
 *
 *  • L1 — zapamatování: jedna vazba otázka → fakt.
 *  • L2 — použití: popis bez jména → osoba/období; počítání let a pořadí př. n. l.
 *  • L3 — analýza: příčiny, důsledky, rozdíly, práce s pramenem, hledání chyby.
 *
 * Sporné údaje (přesný konec Pax Romana, výroky „podle tradice“) na klíč nejdou
 * jinak než s „asi“ nebo s poznámkou o tradici.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { pickN, buildChoiceTask as choice } from "./_shared";

interface Uloha {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
  steps?: string[];
  /** Úlohy se stejnou myšlenkou — generátor je rozmístí tak, aby se nepotkaly v jednom sezení. */
  skupina?: string;
}

const build = (u: Uloha): PracticeTask =>
  choice(u.q, u.key, u.d.map(([value, why]) => ({ value, why })), {
    hints: u.hints,
    explanation: u.explanation,
    solutionSteps: u.steps,
  });

// ── L1 — zapamatování ──────────────────────────────────────────────────────
const POOL_L1: Uloha[] = [
  {
    q: "Kdo se stal prvním římským císařem?",
    key: "Augustus",
    d: [
      ["Caesar", "Caesar byl doživotní diktátor, ne císař. Vládl sám, ale bez císařského titulu. Prvním císařem se stal jeho adoptivní syn."],
      ["Antonius", "Marcus Antonius o moc v Římě bojoval, ale u Actia prohrál. Císařem se stal jeho vítězný soupeř."],
      ["Nero", "Nero byl sice slavný římský císař, ale vládl až o víc než padesát let později. První to nebyl."],
    ],
    hints: [
      "Prvním císařem nebyl ten, podle koho se císařům začalo říkat. Hledej vítěze občanských válek po vraždě na březnové idy.",
      "Diktátor zavražděný roku 44 př. n. l. císařem nebyl. Hledej jeho adoptivního syna, který porazil soupeře u Actia a od senátu pak dostal čestné jméno.",
    ],
    explanation: "Prvním římským císařem byl Octavianus, kterému senát roku 27 př. n. l. udělil jméno Augustus. Caesar byl doživotní diktátor, Antonius prohrál u Actia a Nero vládl mnohem později.",
  },
  {
    q: "Jaké čestné jméno dostal Octavianus od senátu roku 27 př. n. l.?",
    key: "Augustus",
    d: [
      ["Caesar", "Jméno Caesar přijal Octavianus už po adopci, když byl Caesar zavražděn. Roku 27 př. n. l. mu senát dal jiné, nové jméno."],
      ["Magnus", "Přídomek Magnus (Veliký) nosil Pompeius, Caesarův soupeř. Octavianus dostal jiné jméno."],
      ["Africanus", "Přídomek Africanus dostal vojevůdce Scipio za vítězství nad Kartágem, dávno před Octavianem."],
    ],
    hints: [
      "Jméno mělo ukázat, že jeho nositel je „vznešený“ a „posvátný“, víc než obyčejný vojevůdce.",
      "Jméno po adoptivním otci měl Octavianus už dřív, takže to nebude ono. Přídomky vojevůdců z válek s Kartágem nebo z doby republiky také vyřaď. Z hledaného jména se později stal i latinský název jednoho letního měsíce.",
    ],
    explanation: "Roku 27 př. n. l. senát udělil Octavianovi čestné jméno Augustus (vznešený). Jméno Caesar měl už po adopci, Magnus byl Pompeius a Africanus Scipio.",
  },
  {
    q: "Který měsíc nese jméno po Gaiu Iuliovi Caesarovi?",
    key: "červenec",
    d: [
      ["srpen", "Srpen (latinsky Augustus) je pojmenovaný po prvním císaři. Po Caesarovi se jmenuje měsíc před ním."],
      ["březen", "V březnu, na idy březnové, byl Caesar zavražděn. Jméno po něm ale nese jiný měsíc."],
      ["červen", "Červen se latinsky jmenuje Iunius, ne Iulius. Liší se jen jedním písmenem, proto se plete."],
    ],
    hints: [
      "Latinsky se měsíc jmenuje Iulius, podle Caesarova rodového jména. Najdi jeho české jméno.",
      "Měsíc pojmenovaný po prvním císaři nehledáš a měsíc Caesarovy smrti také ne. Pozor na dvojici Iunius a Iulius: liší se jen jedním písmenem. Který z nich nese Caesarovo rodové jméno a jak se jmenuje česky?",
    ],
    explanation: "Po Caesarovi (rodem Iulius) se latinsky jmenuje měsíc Iulius, česky červenec. Srpen nese jméno Augusta, v březnu byl Caesar zavražděn a červen je Iunius.",
  },
  {
    q: "Který měsíc je pojmenovaný po prvním římském císaři?",
    key: "srpen",
    d: [
      ["červenec", "Červenec (Iulius) je pojmenovaný po Caesarovi, který císařem nebyl. Po prvním císaři se jmenuje měsíc hned po něm."],
      ["září", "Září se latinsky jmenuje September, tedy „sedmý“ podle nejstaršího římského kalendáře. Po císaři pojmenované není."],
      ["březen", "Březen (Martius) nese jméno boha války Marta, ne císaře."],
    ],
    hints: [
      "Latinsky se ten měsíc jmenuje stejně jako čestné jméno prvního císaře.",
      "Měsíc Iulius patří Caesarovi, který císařem nebyl. September znamená jen „sedmý“ a Martius je bůh války. Vzpomeň si, jaké čestné jméno dostal Octavianus roku 27 př. n. l., a hledej měsíc, který latinsky zní stejně.",
    ],
    explanation: "Po prvním císaři Augustovi se jmenuje měsíc Augustus, česky srpen. Červenec patří Caesarovi, září je „sedmý měsíc“ a březen boha Marta.",
  },
  {
    q: "Kterou řeku překročil Caesar s vojskem roku 49 př. n. l., když vytáhl do Itálie proti senátu?",
    key: "Rubikon",
    d: [
      ["Tiberu", "Tibera protéká přímo Římem. Caesar překročil menší hraniční řeku na severu Itálie."],
      ["Nil", "Nil je řeka v Egyptě, kde Caesar pobýval u Kleopatry až později. Do Itálie proti senátu tudy nevedl."],
      ["Dunaj", "Na Dunaji později vedla část hranice říše. S Caesarovým tažením proti senátu nesouvisí."],
    ],
    hints: [
      "Hledej malou řeku, která oddělovala provincii Galii od samotné Itálie. Vojevůdce ji nesměl překročit s vojskem.",
      "Řeka protékající Římem ani egyptská a podunajská řeka to nebyly. Hledej hraniční říčku na severu Itálie, u které podle tradice zaznělo „Kostky jsou vrženy“.",
    ],
    explanation: "Roku 49 př. n. l. překročil Caesar s vojskem řeku Rubikon, hranici mezi Galií a Itálií. Tím zahájil občanskou válku se senátem. Tibera teče Římem, Nil Egyptem a Dunaj daleko na severu.",
  },
  {
    q: "V kterém roce byl Caesar zavražděn?",
    key: "44 př. n. l.",
    d: [
      ["49 př. n. l.", "Roku 49 př. n. l. Caesar překročil Rubikon a začala občanská válka. Zavražděn byl až o několik let později."],
      ["27 př. n. l.", "Roku 27 př. n. l. dostal Octavianus jméno Augustus. Caesar v té době už nežil."],
      ["44 n. l.", "Číslo sedí, ale éra ne. Caesar žil před naším letopočtem, ne v něm."],
    ],
    hints: [
      "Caesar byl zavražděn na idy březnové, pět let po překročení Rubikonu. Pozor také na éru.",
      "Rubikon překročil roku 49 př. n. l. a u letopočtů před naším letopočtem čísla s časem ubývají. Od čísla 49 odečti pět a nezapomeň, že celý Caesarův život patří do doby před naším letopočtem.",
    ],
    explanation: "Caesar byl zavražděn na idy březnové (15. března) roku 44 př. n. l. Rok 49 př. n. l. je překročení Rubikonu, 27 př. n. l. titul Augustus a 44 n. l. je ve špatné éře.",
  },
  {
    q: "Jak se nazývá opevněná hranice římské říše?",
    key: "limes",
    d: [
      ["akvadukt", "Akvadukt je vodovod, který přiváděl vodu do měst. Hranici nehlídal."],
      ["fórum", "Fórum bylo náměstí uprostřed města, kde se obchodovalo a jednalo. Na hranici neleželo."],
      ["Koloseum", "Koloseum je amfiteátr v Římě pro zápasy gladiátorů, žádná hranice."],
    ],
    hints: [
      "Hledej latinské slovo pro val se strážními věžemi a pevnostmi, kde stály legie.",
      "Vodovod, městské náměstí ani amfiteátr na hranici nestály. Hledej pojem pro opevněnou čáru, kterou vojáci střežili třeba podél Dunaje a Rýna.",
    ],
    explanation: "Opevněná hranice říše se nazývala limes: valy, příkopy, strážní věže a tábory legií. Akvadukt je vodovod, fórum náměstí a Koloseum amfiteátr.",
  },
  {
    q: "Co v překladu znamená Pax Romana?",
    key: "římský mír",
    d: [
      ["římské právo", "Římské právo se latinsky řekne ius Romanum. Slovo pax znamená něco jiného."],
      ["římská říše", "Římská říše je latinsky Imperium Romanum. Pax neznamená říše."],
      ["římský lid", "Římský lid je populus Romanus. Pax je slovo, které známe z pacifismu."],
    ],
    hints: [
      "Slovo Romana znamená „římský“. Co znamená pax? Pomůže slovo pacifista.",
      "Pro právo, říši i lid mají Římané jiná slova (ius, imperium, populus). Pax najdeš ve slově pacifista, tedy člověk, který odmítá válku. Co je opakem války?",
    ],
    explanation: "Pax Romana znamená římský mír (pax = mír). Právo je ius, říše imperium a lid populus.",
  },
  {
    q: "Jak se jmenovala egyptská královna, spojenkyně Caesara a Marka Antonia?",
    key: "Kleopatra",
    d: [
      ["Nefertiti", "Nefertiti byla egyptská královna, ale žila asi o 1 300 let dřív, v době faraona Achnatona."],
      ["Hatšepsut", "Hatšepsut vládla Egyptu jako faraon, ale dávno před Římany."],
      ["Livia", "Livia byla manželkou Octaviana Augusta, ne egyptská královna."],
    ],
    hints: [
      "Hledej poslední královnu samostatného Egypta, která po porážce u Actia zemřela.",
      "Dvě jména patří egyptským vládkyním z doby o mnoho staletí starší a jedno ženě prvního císaře. Hledej královnu z řecké dynastie Ptolemaiovců.",
    ],
    explanation: "Spojenkyní Caesara a pak Marka Antonia byla Kleopatra, poslední královna samostatného Egypta. Nefertiti a Hatšepsut žily mnohem dřív a Livia byla Augustova manželka.",
  },
  {
    q: "Kdo patřil ke spiklencům, kteří zavraždili Caesara?",
    key: "Brutus",
    d: [
      ["Antonius", "Marcus Antonius byl Caesarův přítel a po vraždě se naopak postavil proti spiklencům."],
      ["Octavianus", "Octavianus byl Caesarův adoptivní syn. Jeho vrahy později porazil."],
      ["Pompeius", "Pompeius byl Caesarův soupeř, ale zemřel v Egyptě už roku 48 př. n. l., tedy před vraždou."],
    ],
    hints: [
      "Hledej senátora, kterému Caesar důvěřoval, a přesto se připojil k vrahům.",
      "Caesarův přítel a jeho adoptivní syn vrahy naopak pronásledovali. Caesarův starý soupeř zemřel dřív. Hledej muže, kterému podle tradice Caesar řekl „I ty, synu?“.",
    ],
    explanation: "Ke spiklencům patřili Brutus a Cassius. Antonius a Octavianus Caesarovu smrt pomstili a Pompeius v té době už nežil.",
  },
  {
    q: "Jak se jmenuje kalendář, který zavedl Caesar?",
    key: "juliánský",
    d: [
      ["gregoriánský", "Gregoriánský kalendář používáme dnes. Zavedl ho papež Řehoř XIII. až roku 1582."],
      ["egyptský", "Egypťané měli vlastní sluneční kalendář, který byl Caesarovi vzorem. Kalendář zavedený v Římě ale nese jméno podle Caesara."],
      ["babylonský", "Babylonský kalendář se řídil Měsícem a patří do Mezopotámie, ne do Říma."],
    ],
    hints: [
      "Název kalendáře je odvozený od Caesarova rodového jména Iulius.",
      "Dnešní kalendář zavedl až papež v 16. století. Egyptský kalendář byl jen vzorem a babylonský patří jiné říši. Hledej přídavné jméno od slova Iulius.",
    ],
    explanation: "Caesar zavedl juliánský kalendář (podle rodu Iuliů) s 365 dny a přestupným rokem. Gregoriánský přišel až 1582, egyptský byl vzorem a babylonský patří Mezopotámii.",
  },
  {
    q: "Jak se nazýval Augustův titul „první občan“?",
    key: "princeps",
    d: [
      ["diktátor", "Diktátor byl mimořádný úřad se vší mocí, kterou měl Caesar. Augustus se takto nazývat nechtěl."],
      ["konzul", "Konzul byl nejvyšší úředník republiky volený na jeden rok, dva zároveň. Neznamená „první občan“."],
      ["tribun", "Tribun lidu hájil prosté občany. Titul „první občan“ se jmenoval jinak."],
    ],
    hints: [
      "Latinsky „první“ je primus. Hledej titul, který z tohoto slova vychází a od kterého je odvozen název principát, tedy způsob vlády, který zavedl Augustus.",
      "Diktátor měl otevřeně neomezenou moc a konzul s tribunem byli roční úředníci republiky. Hledej titul, který nezněl jako úřad s mocí, ale jen jako označení prvního mezi občany.",
    ],
    explanation: "Augustus se nechal nazývat princeps, první občan. Od toho je odvozeno slovo principát. Diktátor, konzul i tribun byly jiné úřady.",
  },
  {
    q: "Jak dlouho zhruba trval římský mír?",
    key: `asi ${pad(200, "ROK")}`,
    d: [
      [`asi ${pad(40, "ROK")}`, "Asi 40 let vládl Augustus. Mír ale pokračoval i za dalších císařů."],
      [`asi ${pad(100, "ROK")}`, "Mír nepokryl jen jedno století. Trval od Augusta přes celé 1. století až asi do konce 2. století n. l."],
      [`asi ${pad(500, "ROK")}`, "Asi 500 let trvalo celé římské císařství na západě. Klidné období bylo mnohem kratší."],
    ],
    hints: [
      "Mír začal za Augusta, kolem přelomu letopočtu, a skončil zhruba ke konci 2. století našeho letopočtu.",
      "Vláda jednoho císaře to být nemůže, mír pokračoval i za jeho nástupců. Celé císařství ale trvalo mnohem déle. Spočítej, kolik zhruba století leží mezi začátkem našeho letopočtu a koncem 2. století.",
    ],
    explanation: "Pax Romana trvala asi dvě století: od Augusta až zhruba do konce 2. století n. l. Augustus sám vládl asi 40 let a císařství na západě trvalo asi 500 let.",
  },
  {
    q: "Kde byl Caesar zavražděn?",
    key: "na zasedání senátu",
    d: [
      ["v bitvě u Actia", "U Actia se bojovalo až roku 31 př. n. l., kdy už Caesar nežil. Porazil tam Octavianus Antonia."],
      ["v Alexandrii v Egyptě", "V Alexandrii pobýval Caesar u Kleopatry, ale zavražděn byl v Římě."],
      ["na březích Rubikonu", "Rubikon překročil roku 49 př. n. l. Zavražděn byl o pět let později a jinde."],
    ],
    hints: [
      "Spiklenci byli senátoři. Kde se mohli ke Caesarovi dostat nejblíž, aniž by to budilo podezření?",
      "Vražda se stala v Římě na idy březnové, v den, kdy měl Caesar úřední povinnosti. Který z nabízených dějů se odehrál přímo v Římě?",
    ],
    explanation: "Caesar byl zavražděn na idy březnové 44 př. n. l. na zasedání senátu. Spiklenci byli senátoři, proto se k němu dostali. Actium, Alexandrie i Rubikon patří k jiným událostem.",
  },
  {
    q: "Kdo porazil Antonia a Kleopatru v bitvě u Actia?",
    key: "Octavianus",
    d: [
      ["Caesar", "Caesar byl zavražděn roku 44 př. n. l., bitva u Actia byla až roku 31 př. n. l."],
      ["Brutus", "Brutus, jeden z Caesarových vrahů, zemřel už roku 42 př. n. l. po porážce u Filipp."],
      ["Pompeius", "Pompeius zemřel už roku 48 př. n. l. v Egyptě, dávno před Actiem."],
    ],
    hints: [
      "Bitva u Actia byla roku 31 př. n. l. Hledej muže, který tehdy ještě žil a bojoval o vládu nad Římem.",
      "Diktátor i jeho vrah i jeho starý soupeř v té době už nežili. Hledej Caesarova adoptivního syna, který se o čtyři roky později stal prvním císařem.",
    ],
    explanation: "U Actia (31 př. n. l.) porazil Antonia a Kleopatru Octavianus, pozdější Augustus. Caesar, Brutus i Pompeius byli v té době už mrtví.",
  },
  {
    q: "Které území dobyl Caesar v letech 58–51 př. n. l.?",
    key: "Galii",
    d: [
      ["Egypt", "Egypt připojil k říši až Octavianus po vítězství u Actia (30 př. n. l.)."],
      ["Dácii", "Dácii (dnešní Rumunsko) dobyl až císař Traján, přes 150 let po Caesarovi."],
      ["Řecko", "Řecko ovládli Římané už roku 146 př. n. l., dávno před Caesarem."],
    ],
    hints: [
      "Caesar o své válce napsal knihu Zápisky o válce galské. Tamní obyvatelé se jmenovali Galové.",
      "Egypt a Dácie přibyly k říši až po Caesarovi, Řecko už dávno před ním. Hledej zemi Galů, dnešní Francii.",
    ],
    explanation: "V letech 58–51 př. n. l. dobyl Caesar Galii (dnešní Francie a Belgie). Egypt připojil Octavianus, Dácii Traján a Řecko Římané ovládli dřív.",
  },
  {
    q: "Jakou funkci měl Caesar, když byl zavražděn?",
    key: "doživotní diktátor",
    d: [
      ["první římský císař", "Caesar císařem nebyl. Z jeho jména sice vzniklo slovo „císař“, ale prvním císařem byl až jeho adoptivní syn."],
      ["římský král", "Královskou korunu Caesar veřejně odmítl, Římané krále nenáviděli. Podezření, že chce být králem, ho ale stálo život."],
      ["princeps (první občan)", "Titul princeps (první občan) si zvolil až Augustus. Caesar měl jiný, otevřenější úřad."],
    ],
    hints: [
      "Úřad, který v krizi dostal jeden muž se vší mocí, byl v republice jen na krátkou dobu. Caesar ho získal bez časového omezení.",
      "Císařství vzniklo až po Caesarově smrti a královskou korunu odmítl. Titul „první občan“ si zvolil až jeho nástupce. Hledej mimořádný republikánský úřad, který Caesar držel napořád.",
    ],
    explanation: "Caesar byl doživotní diktátor: měl moc jako panovník, ale bez titulu krále nebo císaře. Prvním císařem byl Augustus, který také zvolil titul princeps.",
  },
];

// ── L2 — použití ───────────────────────────────────────────────────────────

/**
 * Rozdíl dvou letopočtů př. n. l. Sady distraktorů se střídají, aby se úlohy
 * nedaly odpovídat podle vzoru:
 *  A — sčítání, rok ubraný navíc, jen pozdější letopočet
 *  B — sčítání, rok přidaný navíc (počítány oba krajní roky), jen starší letopočet
 *  C — výpočet jako přes přelom (a + b − 1), rok přidaný navíc, rok ubraný navíc
 */
function kolikLet(odUdalost: string, a: number, doUdalost: string, b: number, sada: "A" | "B" | "C", h0: string, h1: string): Uloha {
  const ans = a - b;
  const vypocet = `${a} − ${b} = ${ans}`;
  const soucet: [string, string] = [pad(a + b, "ROK"), `Sčítal jsi. Oba roky jsou před naším letopočtem, tedy ve stejné éře, a proto se odčítají: ${vypocet}.`];
  const minus1: [string, string] = [pad(ans - 1, "ROK"), `Ubral jsi rok navíc. Odečítá se 1 jen přes přelom letopočtu (rok 0 neexistuje). Tady jsou oba roky př. n. l.: ${vypocet}.`];
  const plus1: [string, string] = [pad(ans + 1, "ROK"), `Přidal jsi rok navíc, jako bys počítal oba krajní roky. Rozdíl je prosté odečtení: ${vypocet}.`];
  const d: Record<typeof sada, [string, string][]> = {
    A: [soucet, minus1, [pad(b, "ROK"), `To je jen letopočet pozdější události, ne počet let mezi nimi. Odečti ho od staršího: ${vypocet}.`]],
    B: [soucet, plus1, [pad(a, "ROK"), `To je jen letopočet starší události, ne počet let mezi nimi. Odečti od něj pozdější: ${vypocet}.`]],
    C: [[pad(a + b - 1, "ROK"), `Počítal jsi jako přes přelom letopočtu (sečíst a ubrat 1). Tady jsou ale oba roky před naším letopočtem: ${vypocet}.`], plus1, minus1],
  };
  return {
    q: `Kolik let uplynulo od ${odUdalost} (${a} př. n. l.) do ${doUdalost} (${b} př. n. l.)?`,
    key: pad(ans, "ROK"),
    d: d[sada],
    hints: [h0, h1],
    steps: [
      `Oba roky jsou př. n. l., starší je ${a} (větší číslo).`,
      `Ve stejné éře se odčítá: ${a} − ${b} = ${ans}.`,
    ],
    explanation: `Obě události se staly před naším letopočtem, čísla let tehdy ubývala. Rozdíl je proto prosté odečtení: ${a} − ${b}, uplynulo ${pad(ans, "ROK")}.`,
  };
}

const RUB = "překročení Rubikonu (49 př. n. l.)";
const SMRT_C = "Caesarova smrt (44 př. n. l.)";
const ACT = "bitva u Actia (31 př. n. l.)";
const TIT = "titul Augustus pro Octaviana (27 př. n. l.)";
const SMRT_A = "smrt Augusta (14 n. l.)";
const TEUT = "porážka Římanů v Teutoburském lese (9 n. l.)";

const POOL_L2: Uloha[] = [
  {
    q: "Vojevůdce podle tradice zvolal „Kostky jsou vrženy“ a vytáhl s vojskem proti senátu. O koho jde?",
    key: "Caesar",
    d: [
      ["Augustus", "Augustus proti senátu nevytáhl, naopak si na dobrých vztazích se senátem zakládal. Výrok patří jeho adoptivnímu otci."],
      ["Pompeius", "Pompeius stál naopak na straně senátu a proti vojevůdci, který překročil Rubikon, bojoval."],
      ["Antonius", "Antonius byl tehdy tribun lidu a Caesarův stoupenec, který k němu z Říma uprchl. Výrok i tažení patří jeho veliteli Caesarovi."],
    ],
    hints: [
      "Výrok podle tradice zazněl u hraniční řeky Rubikonu roku 49 př. n. l.",
      "Obránce senátu i pozdější císař to nebyli a tribun lidu, který za vojskem uprchl z Říma, to také nebyl. Hledej dobyvatele Galie, který se vracel s legiemi do Itálie.",
    ],
    explanation: "Podle tradice pronesl „Kostky jsou vrženy“ Caesar, když roku 49 př. n. l. překročil Rubikon a začal válku se senátem, jehož vojsko vedl Pompeius.",
  },
  {
    q: "Po vítězství v občanských válkách slavnostně „vrátil“ moc senátu, ale o vojsku i penězích dál rozhodoval sám. O koho jde?",
    key: "Augustus",
    d: [
      ["Caesar", "Caesar senátu nic nevracel. Nechal se otevřeně jmenovat doživotním diktátorem, a proto byl zavražděn."],
      ["Brutus", "Brutus byl jeden ze spiklenců. Moc v Římě nikdy nezískal a zemřel po porážce u Filipp."],
      ["Antonius", "Antonius prohrál u Actia, takže po občanských válkách žádnou moc nevracel."],
    ],
    hints: [
      "Hledej vládce, který se chtěl odlišit od zavražděného diktátora: navenek zachoval republiku.",
      "Otevřený doživotní diktátor to nebyl, ten skončil zavražděn. Spiklenec ani poražený u Actia moc nezískali. Hledej vítěze, kterému senát za „vrácení“ moci roku 27 př. n. l. dal čestné jméno.",
    ],
    explanation: "Tak vládl Augustus: roku 27 př. n. l. „vrátil“ moc senátu a lidu, ale velel legiím a spravoval peníze. Caesar vládl jako diktátor otevřeně, Brutus a Antonius moc nezískali.",
  },
  {
    q: "Doba, kdy se po silnicích a mořích říše bezpečně obchodovalo od Británie po Egypt. Jak se jí říká?",
    key: "Pax Romana",
    d: [
      ["krize republiky", "Krize republiky byla doba občanských válek, kdy bezpečí chybělo. Bezpečný obchod přinesla až pozdější doba."],
      ["punské války", "Punské války byly boje Říma s Kartágem. Tehdy moře bezpečné nebylo."],
      ["doba královská", "V době králů byl Řím jen malé město. Británie ani Egypt k němu nepatřily."],
    ],
    hints: [
      "Hledej období, které začalo za prvního císaře a dostalo jméno podle klidu uvnitř říše.",
      "Války s Kartágem a občanské války bezpečí nepřinesly a za králů byl Řím malé město. Hledej latinský název období asi dvou set let, kdy byla říše největší a uvnitř klidná.",
    ],
    explanation: "Tak se popisuje Pax Romana, římský mír: uvnitř říše vládl klid, silnice i moře byly bezpečné. Krize republiky a punské války byly doby válek a za králů byl Řím malý.",
  },
  {
    q: "Podle tradice oznámil vítězství v Malé Asii slovy „Přišel jsem, viděl jsem, zvítězil jsem“. Kdo to byl?",
    key: "Caesar",
    d: [
      ["Augustus", "Augustus je známý spíš mírem a stavbami. Tento stručný výrok patří jeho adoptivnímu otci."],
      ["Pompeius", "Pompeius byl také slavný vojevůdce, ale tento výrok se mu nepřipisuje. Patří jeho soupeři."],
      ["Crassus", "Crassus byl bohatý vojevůdce a Caesarův spojenec, ale zahynul v boji s Parthy už roku 53 př. n. l. Výrok z roku 47 př. n. l. mu patřit nemůže."],
    ],
    hints: [
      "Výrok je latinsky Veni, vidi, vici. Připisuje se vojevůdci, který také dobyl Galii.",
      "Pozdější císař v té době ještě neválčil, Crassus už nežil a Pompeiovi se výrok nepřipisuje. Hledej diktátora, který byl roku 44 př. n. l. zavražděn.",
    ],
    explanation: "Podle tradice napsal Veni, vidi, vici Caesar po rychlém vítězství v Malé Asii (47 př. n. l.). Augustus tehdy ještě neválčil a Crassus i Pompeius už nežili.",
  },
  {
    q: "Mladík, kterého Caesar v závěti adoptoval a který pak porazil všechny soupeře. Jak se jmenoval, než dostal čestné jméno od senátu?",
    key: "Octavianus",
    d: [
      ["Antonius", "Antonius byl Caesarův přítel a důstojník, ale adoptovaný nebyl. Stal se soupeřem adoptivního syna."],
      ["Brutus", "Brutus patřil ke spiklencům, kteří Caesara zavraždili. Caesarův dědic ho porazil."],
      ["Cassius", "Cassius byl spolu s Brutem vůdcem spiknutí proti Caesarovi, ne jeho dědic."],
    ],
    hints: [
      "Hledej Caesarova prasynovce, kterému bylo v době vraždy teprve 18 let.",
      "Spiklenci dědici být nemohli a Caesarův přítel se stal soupeřem dědice. Hledej jméno, pod kterým vítěz od Actia vystupoval do roku 27 př. n. l.",
    ],
    explanation: "Caesar v závěti adoptoval svého prasynovce Octaviana. Ten porazil vrahy Bruta a Cassia a později i Antonia. Roku 27 př. n. l. dostal jméno Augustus.",
  },
  {
    q: "Římský vojevůdce a Kleopatřin spojenec, kterého Octavianus porazil u Actia. Kdo to byl?",
    key: "Antonius",
    d: [
      ["Caesar", "Caesar byl sice také Kleopatřin spojenec, ale zemřel roku 44 př. n. l., třináct let před Actiem."],
      ["Brutus", "Brutus zemřel už roku 42 př. n. l. a s Kleopatrou spojencem nebyl."],
      ["Pompeius", "Pompeius byl zabit v Egyptě roku 48 př. n. l., dávno před Actiem."],
    ],
    hints: [
      "Hledej muže, který byl kdysi Caesarovým přítelem a po jeho smrti se s Octavianem o moc rozešel.",
      "Diktátor, jeho vrah i jeho starý soupeř v roce 31 př. n. l. už nežili. Hledej Caesarova důstojníka, který se usadil v Egyptě u královny.",
    ],
    explanation: "U Actia (31 př. n. l.) prohrál Marcus Antonius, spojenec a partner Kleopatry. Caesar, Brutus i Pompeius byli v té době mrtví.",
  },
  {
    q: "Senátor, kterého Caesar považoval za přítele, a přesto se postavil do čela spiknutí. Kdo to byl?",
    key: "Brutus",
    d: [
      ["Antonius", "Antonius byl Caesarovi věrný. Po vraždě spiklence pronásledoval a pomstil ho."],
      ["Octavianus", "Octavianus byl Caesarův adoptivní syn a vrahy potrestal."],
      ["Pompeius", "Pompeius byl Caesarův otevřený soupeř a zemřel čtyři roky před vraždou."],
    ],
    hints: [
      "Hledej muže, kterému se připisuje, že Caesarovi zasadil jednu z ran na idy březnové.",
      "Adoptivní syn i věrný přítel stáli na Caesarově straně a starý soupeř už nežil. Hledej spiklence, který pak s Cassiem prohrál u Filipp.",
    ],
    explanation: "V čele spiknutí stál Brutus spolu s Cassiem. Antonius a Octavianus Caesara pomstili a Pompeius zemřel už roku 48 př. n. l.",
  },
  kolikLet("Caesarovy smrti", 44, "udělení jména Augustus", 27, "A",
    "Oba letopočty, 44 a 27, jsou před naším letopočtem. Který rok je starší a jakou početní operaci použiješ?",
    "Před naším letopočtem čísla let s časem ubývají, takže starší událost má větší číslo. Ve stejné éře rozdíl spočítáš tak, že od většího čísla odečteš menší. Rok 0 tu nehraje roli."),
  kolikLet("začátku dobývání Galie", 58, "překročení Rubikonu", 49, "B",
    "Caesar nejdřív dobýval Galii a pak se s vojskem vrátil k Rubikonu. Obě čísla, 58 a 49, jsou před naším letopočtem. Co s nimi uděláš?",
    "Nepočítej oba krajní roky zvlášť a nesčítej. Když jsou oba roky ve stejné éře, stačí od většího čísla odečíst menší."),
  kolikLet("bitvy u Actia", 31, "udělení jména Augustus", 27, "C",
    "Bitva u Actia a jméno pro Octaviana: čísla 31 a 27 jsou v téže éře. Které číslo je starší a jak spočítáš rozdíl?",
    "Přes přelom letopočtu se nepřechází, obě události jsou před ním. Rok navíc proto neubírej ani nepřidávej, jen od většího čísla odečti menší."),
  kolikLet("Caesarova vítězství v Malé Asii", 47, "bitvy u Actia", 31, "A",
    "Od Caesarova slavného vítězství po rozhodující bitvu Octaviana: roky 47 a 31 jsou oba před naším letopočtem. Sčítat, nebo odčítat?",
    "Starší událost před naším letopočtem má větší číslo. Rozdíl dvou roků ve stejné éře zjistíš odečtením menšího čísla od většího, bez jakékoli opravy o rok."),
  kolikLet("bitvy u Filipp", 42, "bitvy u Actia", 31, "B",
    "U Filipp porazili Caesarovi stoupenci jeho vrahy, u Actia se pak utkali mezi sebou. Čísla 42 a 31 jsou ve stejné éře. Který rok je dřív?",
    "Nejdřív urči, která bitva byla starší: před naším letopočtem je to ta s větším číslem. Pak od většího čísla odečti menší, a počet let je hotový."),
  kolikLet("překročení Rubikonu", 49, "Caesarovy smrti", 44, "C",
    "Rubikon a vražda Caesara: čísla 49 a 44 jsou obě před naším letopočtem. Který rok byl dřív a co s čísly uděláš?",
    "Mezi těmito událostmi neleží přelom letopočtu, takže žádné sčítání ani ubírání roku. Od většího z obou čísel odečti menší."),
  {
    q: "Která z těchto událostí se stala nejdříve?",
    key: RUB,
    d: [
      [SMRT_C, "Caesar byl zavražděn roku 44 př. n. l. U letopočtů př. n. l. je větší číslo starší a 49 > 44, takže Rubikon byl dřív."],
      [ACT, "Rok 31 př. n. l. je mladší než 49 př. n. l. Před naším letopočtem větší číslo znamená dřív."],
      [TIT, "Máš opačný směr času: 27 je nejmenší číslo, a proto u letopočtů př. n. l. nejmladší událost. Nejstarší má největší číslo."],
    ],
    hints: [
      "Všechny čtyři události jsou před naším letopočtem. Porovnej čísla 49, 44, 31 a 27 a rozmysli si, jestli větší číslo znamená dřív, nebo později.",
      "Před naším letopočtem se roky počítají směrem do minulosti: rok 31 př. n. l. byl dřív než 27 př. n. l. Nejstarší je proto událost s největším číslem.",
    ],
    explanation: "U letopočtů př. n. l. je větší číslo starší. Pořadí je 49 (Rubikon) → 44 (Caesarova smrt) → 31 (Actium) → 27 (jméno Augustus), nejdříve tedy překročení Rubikonu.",
  },
  {
    q: "Která z těchto událostí se stala nejpozději?",
    key: SMRT_A,
    d: [
      [RUB, "Máš opačný směr času: 49 je sice největší číslo, ale před naším letopočtem to znamená nejstarší událost."],
      [ACT, "Actium (31 př. n. l.) patří ještě do doby před naším letopočtem. Poslední je událost už z našeho letopočtu."],
      [TEUT, "Porážka v Teutoburském lese (9 n. l.) je sice z našeho letopočtu, ale 9 je méně než 14. V našem letopočtu čísla s časem rostou, takže byla dřív."],
    ],
    hints: [
      "Roztřiď události podle éry: které jsou před naším letopočtem a které v něm? Která éra je pozdější?",
      "Cokoli z našeho letopočtu (n. l.) se stalo později než cokoli před ním (př. n. l.). Pozor na směr čísel: před naším letopočtem větší číslo znamená dřív, v našem letopočtu naopak později.",
    ],
    explanation: "Dvě události jsou před naším letopočtem (49 a 31 př. n. l.), dvě v něm (9 a 14 n. l.). Pozdější jsou ty z našeho letopočtu a mezi nimi je pozdější větší číslo, proto je poslední smrt Augusta (14 n. l.).",
  },
  {
    q: "Která z těchto událostí před naším letopočtem se stala jako poslední?",
    key: TIT,
    d: [
      [RUB, "Máš opačný směr času: 49 je největší číslo, tedy před naším letopočtem nejstarší událost, ne nejmladší."],
      [SMRT_C, "Rok 44 př. n. l. je starší než 27 př. n. l. Po Caesarově smrti přišly ještě další události."],
      [ACT, "Actium (31 př. n. l.) bylo o čtyři roky dřív než událost s číslem 27. Poslední je ta s nejmenším číslem."],
    ],
    hints: [
      "Porovnej čísla 49, 44, 31 a 27. U letopočtů před naším letopočtem čísla s časem ubývají.",
      "Protože čísla let před naším letopočtem s časem klesají, nejpozdější událost má nejmenší číslo. Pomůže i příběh: nejdřív občanská válka a vražda, pak rozhodující bitva a nakonec se vítěz stal vládcem.",
    ],
    explanation: "Před naším letopočtem čísla let ubývají, takže poslední je událost s nejmenším číslem: 27 př. n. l., kdy Octavianus dostal jméno Augustus. Pořadí je 49 → 44 → 31 → 27.",
  },
  {
    q: "Co z toho se stalo nejdříve?",
    key: SMRT_C,
    d: [
      [SMRT_A, "Smrt Augusta (14 n. l.) je z našeho letopočtu, a proto nejpozdější ze všech. Nejstarší je událost před naším letopočtem s největším číslem."],
      [TIT, "Rok 27 př. n. l. je mladší než 31 i 44 př. n. l. Máš opačný směr času: větší číslo př. n. l. je starší."],
      [ACT, "Actium (31 př. n. l.) je starší než jméno Augustus, ale mladší než rok 44 př. n. l."],
    ],
    hints: [
      "Roztřiď možnosti podle éry: jedna je z našeho letopočtu, tři před ním. Která éra je starší?",
      "Možnost z našeho letopočtu vyřaď, stala se nejpozději. U zbylých tří letopočtů př. n. l. (44, 31 a 27) je nejstarší ta s největším číslem. Bez smrti vládce by nevypukly další boje o moc.",
    ],
    explanation: "Letopočty př. n. l. jsou starší než n. l. a mezi nimi je nejstarší největší číslo: 44 př. n. l., Caesarova smrt. Pak přišlo Actium (31), jméno Augustus (27) a smrt Augusta (14 n. l.).",
  },
];

// ── L3 — analýza ───────────────────────────────────────────────────────────
const POOL_L3: Uloha[] = [
  {
    q: "Proč se Octavianus nenechal nazývat králem, ale jen princepsem (prvním občanem)?",
    key: "Protože Římané krále nenáviděli a Caesarova smrt ukázala, jak je to nebezpečné",
    d: [
      ["Protože se chtěl vrátit k republice a moc brzy předal zvoleným konzulům", "Takhle to navenek vypadalo, ale moc nepředal: velel legiím a rozhodoval o penězích až do smrti."],
      ["Protože titul princeps znamenal v Římě víc moci než titul krále", "Titul princeps sám žádnou moc nedával. Moc měl Augustus díky vojsku a úřadům, titul ji jen skromně zakrýval."],
      ["Protože mu senát zakázal vládnout a nechal mu jen velení na hranicích", "Senát mu nic nezakazoval, naopak ho zahrnul tituly. Rozhodoval o vojsku i penězích v celé říši."],
    ],
    hints: [
      "Vzpomeň si, co se stalo Caesarovi.",
      "Titul sám moc nedával a moc Octavianus nikomu nepředal. Jak skončil poslední vládce z doby královské a jak skončil muž, o kterém se šířilo, že chce korunu? Co z toho plynulo pro někoho, kdo chtěl vládnout dlouho a v bezpečí?",
    ],
    skupina: "republika-navenek",
    explanation: "Římané od vyhnání krále Tarquinia slovo „král“ nenáviděli a Caesar byl zavražděn i proto, že vypadal jako budoucí král. Octavianus proto moc zakryl skromným titulem princeps, i když ve skutečnosti vládl sám.",
  },
  {
    q: "Proč se v době Pax Romana tolik rozvinul obchod?",
    key: "Protože v říši byl klid, cesty bezpečné a téměř všude platily římské peníze",
    d: [
      ["Protože Řím zrušil vojsko a peníze na legie dostali obchodníci", "Vojsko Řím nezrušil. Legie dál hlídaly hranice a právě díky nim byl uvnitř říše klid."],
      ["Protože Caesar uzavřel s Galy mír a otevřel jim římské trhy", "Caesar Galii dobyl válkou a římský mír začal až za Augusta."],
      ["Protože obchodníci přestali platit daně a cla na hranicích provincií", "Daně a cla se platily dál. Obchodu pomohl klid, silnice a římské mince obíhající po celé říši, ne zrušení daní."],
    ],
    hints: [
      "Představ si obchodníka, který veze zboží z Hispánie do Galie. Co potřebuje, aby dojel a zboží prodal?",
      "Legie Řím nezrušil a daně se platily dál. Mír také nezačal za Caesara. Mysli na tři věci: jestli na cestě hrozí přepadení, jak kvalitní jsou silnice a čím se v cizí provincii platí.",
    ],
    explanation: "Za Pax Romana byl uvnitř říše klid, silnice a moře hlídalo vojsko a římské mince obíhaly po celé říši. Proto se obchodovalo od Británie po Egypt. Vojsko zůstalo, daně také a mír začal až s Augustem.",
  },
  {
    q: "Který rozdíl mezi Caesarem a Augustem je uvedený správně?",
    key: "Caesar byl doživotní diktátor, Augustus se stal prvním císařem",
    d: [
      ["Caesar byl prvním císařem, Augustus jeho nástupcem na trůnu", "Caesar císařem nebyl, i když z jeho jména vzniklo slovo „císař“. Byl zavražděn jako diktátor a prvním císařem byl až Augustus."],
      ["Caesar vládl za Pax Romana, Augustus předtím dobyl Galii", "Je to obráceně: Galii dobyl Caesar a římský mír začal za Augusta."],
      ["Caesar vládl jako princeps, Augustus jako doživotní diktátor", "Role jsou prohozené. Titul princeps zvolil Augustus, doživotním diktátorem byl Caesar."],
    ],
    hints: [
      "U každé možnosti si ověř zvlášť, co platí o Caesarovi a co o Augustovi. Správná musí sedět v obou půlkách.",
      "Slovo „císař“ pochází z Caesarova jména, ale to neznamená, že byl císařem. Zeptej se: kdo byl zavražděn roku 44 př. n. l. a jaký úřad tehdy měl? A kdo dostal roku 27 př. n. l. čestné jméno a vládl až do smrti?",
    ],
    explanation: "Caesar byl doživotní diktátor zavražděný roku 44 př. n. l. Augustus se roku 27 př. n. l. stal prvním císařem a zvolil titul princeps. Za jeho vlády začal Pax Romana, Galii dobyl Caesar.",
  },
  {
    q: "Augustus o sobě napsal (volně podle jeho zprávy Res gestae): „Předal jsem stát ze své moci senátu a lidu. Za to mi byl dán čestný titul. Od té doby jsem všechny převyšoval vážností, ale moci jsem neměl víc než ti, kdo byli mými kolegy v úřadech.“ Co z úryvku plyne o tom, jak chtěl působit?",
    skupina: "republika-navenek",
    key: "Chtěl působit jako obnovitel republiky, ne jako samovládce",
    d: [
      ["Chtěl, aby ho Římané veřejně uznali za svého krále", "V úryvku se o králi nemluví, naopak zdůrazňuje, že moc předal senátu. Král by v Římě vyvolal odpor."],
      ["Chtěl přiznat, že moc senátu nadobro zrušil", "Úryvek tvrdí opak: stát prý předal senátu a lidu. Senát navenek dál zasedal."],
      ["Chtěl ukázat, že moc zdědil po Caesarovi", "O dědictví po Caesarovi úryvek nemluví. Augustus se tu představuje jako ten, kdo moc vrátil, ne zdědil."],
    ],
    hints: [
      "Všimni si sloves v úryvku: co tvrdí, že udělal s mocí, a čím se prý od ostatních liší?",
      "Úryvek neříká nic o koruně ani o dědictví a senát v něm nezaniká. Autor zdůrazňuje „předal jsem stát“ a „moci jsem neměl víc“. Jakou roli chce tímhle ukázat Římanům, kteří nesnášeli samovládu?",
    ],
    explanation: "Augustus v úryvku tvrdí, že moc vrátil senátu a lidu a vyniká jen vážností. Chtěl tedy vypadat jako obnovitel republiky, ne jako vládce se vší mocí. O králi ani o dědictví nemluví.",
  },
  {
    q: "Augustus v úryvku své zprávy tvrdí, že neměl víc moci než jeho kolegové v úřadech. Přitom velel téměř všem legiím a ovládal provincie s vojskem i bohatý Egypt. Co z toho plyne pro práci s tímto pramenem?",
    key: "Pramen psal sám vládce, a proto svou moc spíš zlehčuje",
    d: [
      ["Pramen je nepravdivý, a proto se z něj nedá nic zjistit", "I zaujatý pramen je užitečný: dozvíme se z něj, jak chtěl vládce působit. Stačí ho porovnat s jinými zprávami."],
      ["Pramen dokazuje, že Augustus měl jen malou moc", "Pramen to tvrdí, ale jiné údaje (velení legiím, peníze) ukazují opak. Tvrzení autora o sobě se musí ověřit."],
      ["Pramen napsal senát, a proto Augusta tolik chválí", "Zprávu Res gestae sepsal Augustus sám o sobě, ne senát."],
    ],
    hints: [
      "Zeptej se, kdo je autorem pramene a jestli měl důvod popsat se lépe, než jaká byla skutečnost.",
      "Autor píše sám o sobě, takže je zaujatý. To ale neznamená, že je pramen bezcenný, ani že mu máme věřit doslova. Porovnej tvrzení pramene s tím, co víme o legiích a provinciích.",
    ],
    explanation: "Res gestae napsal Augustus o sobě, a proto svou moc zlehčuje. Porovnání s fakty (velení legiím, správa provincií s vojskem) to odhalí. Pramen přesto není bezcenný: ukazuje, jak chtěl vládce působit.",
  },
  {
    q: "Které tvrzení obsahuje chybu, protože je v něm zaměněná osoba?",
    key: "Augustus překročil s vojskem Rubikon a vytáhl proti senátu",
    d: [
      ["Octavianus porazil v bitvě u Actia Antonia a Kleopatru", "Tohle je pravda. U Actia roku 31 př. n. l. zvítězil Octavianus nad Antoniem a Kleopatrou."],
      ["Caesar dobyl Galii a zavedl v Římě nový kalendář", "Tohle je pravda. Caesar dobyl Galii (58–51 př. n. l.) a zavedl juliánský kalendář."],
      ["Brutus patřil k senátorům, kteří zavraždili Caesara", "Tohle je pravda. Brutus s Cassiem vedli spiknutí na idy březnové."],
    ],
    hints: [
      "U každého tvrzení si polož otázku: pasuje ten čin k té osobě, nebo patří někomu jinému ze stejného příběhu?",
      "U každého tvrzení porovnej rok činu s tím, kdy daná osoba začala hrát roli v politice. Kdo z nich byl v době činu ještě dítě nebo už nežil?",
    ],
    explanation: "Chybné je tvrzení o Rubikonu: roku 49 př. n. l. ho s vojskem překročil Caesar, ne Augustus. Ostatní tvrzení o Actiu, Galii a kalendáři a o Brutovi jsou pravdivá.",
  },
  {
    q: "Které tvrzení o Caesarovi, Augustovi a římském míru neplatí?",
    key: "Caesar vládl jako první císař v době Pax Romana",
    d: [
      ["Augustus dostal od senátu čestné jméno roku 27 př. n. l.", "Tohle platí. Roku 27 př. n. l. udělil senát Octavianovi jméno Augustus."],
      ["Za Pax Romana legie dál střežily hranice říše", "Tohle platí. Mír byl uvnitř říše, na limitu legie hlídaly a bojovaly dál."],
      ["Caesar byl zavražděn na zasedání senátu", "Tohle platí. Spiklenci zabili Caesara na idy březnové 44 př. n. l. při zasedání senátu."],
    ],
    hints: [
      "Ověř u každého tvrzení dvě věci: jaký úřad osoba měla a kdy žila vzhledem k období míru.",
      "Římský mír začal s prvním císařem. Zeptej se, jestli osoba z tvrzení tehdy ještě žila a jestli vůbec byla císařem. Zbylá tvrzení porovnej s tím, co víš o čestném jménu, o hranicích a o idách březnových.",
    ],
    explanation: "Neplatí, že Caesar vládl jako první císař za Pax Romana: byl doživotní diktátor a zemřel roku 44 př. n. l., mír začal až s Augustem. Ostatní tvrzení jsou pravdivá.",
  },
  {
    q: "Co by se nejspíš stalo, kdyby legie přestaly střežit limes?",
    key: "Do říše by pronikly cizí kmeny a obchod by přestal být bezpečný",
    d: [
      ["Nic zvláštního, protože za Pax Romana už žádní nepřátelé nebyli", "Pax Romana neznamenala svět bez nepřátel. Mír uvnitř říše držely právě legie na hranicích."],
      ["Obchod by vzrostl, protože by se ušetřilo za drahé vojsko", "Úspora by nepomohla: bez ochrany hranic by přišly nájezdy a obchodníci by přestali být v bezpečí."],
      ["Senát by musel znovu zvolit krále, aby říši ochránil", "Krále Římané nevolili od konce doby královské a za císařství o obraně rozhodoval císař, ne senát."],
    ],
    hints: [
      "K čemu limes sloužil? Mysli na to, kdo žil za hranicí a proč tam stály strážní věže.",
      "Mír uvnitř říše neznamenal, že za hranicemi nikdo nebyl. Legie na limitu odrážely nájezdy. Domysli, co by se stalo s bezpečím na silnicích a s obchodem, kdyby hranici nikdo nehlídal.",
    ],
    explanation: "Limes chránil říši před nájezdy kmenů zpoza hranic. Bez stráží by do říše pronikli nepřátelé a skončilo by bezpečí, na kterém stál obchod za Pax Romana. Mír tedy nebyl bez vojska.",
  },
  {
    q: "Proč se vládě, kterou zavedl Augustus, říká principát, i když senát dál zasedal?",
    skupina: "republika-navenek",
    key: "Protože skutečnou moc měl princeps a senát jen potvrzoval jeho vůli",
    d: [
      ["Protože senát volil každý rok nového principa, jako dřív konzuly", "Princeps se nevolil každý rok. Augustus vládl až do smrti a pak nastoupil jeho nástupce."],
      ["Protože princeps byl jen čestný titul a vládl dál senát jako dřív", "Titul byl skromný, ale moc skutečná: princeps velel legiím a rozhodoval o penězích. Senát byl jen zdání republiky."],
      ["Protože Augustus senát zrušil a vládl sám jako král", "Senát zrušen nebyl, zasedal dál. Právě v tom je principát zvláštní: republika navenek, vláda jednoho ve skutečnosti."],
    ],
    hints: [
      "Rozliš, jak stát vypadal navenek (úřady, senát) a kdo ve skutečnosti rozhodoval o vojsku a penězích.",
      "Senát nezrušil nikdo a princeps se nevolil na rok. Zeptej se, kdo velel legiím. Název období je odvozený od titulu člověka, který skutečně vládl, ne od instituce, která jen zasedala.",
    ],
    explanation: "Principát je pojmenovaný po princepsovi, tedy Augustovi. Senát dál zasedal a republika navenek trvala, ale o vojsku a penězích rozhodoval princeps a senát jen schvaloval jeho vůli.",
  },
  {
    q: "Proč Caesarova vražda republiku nezachránila?",
    key: "Protože po ní vypukly nové občanské války a vítěz získal moc sám",
    d: [
      ["Protože se Brutus po vraždě stal doživotním diktátorem místo Caesara", "Brutus moc nezískal. Musel z Říma uprchnout a zemřel po porážce u Filipp."],
      ["Protože se Antonius přidal ke spiklencům a pomohl jim vládnout", "Antonius byl Caesarův přítel. Proti spiklencům bojoval, nepomáhal jim."],
      ["Protože senát hned po vraždě zvolil nového krále z Caesarova rodu", "Krále už Římané od vyhnání Tarquinia nevolili. Moc převzal Caesarův dědic až po letech bojů."],
    ],
    hints: [
      "Mysli na to, co následovalo po idách březnových: kdo se o moc přel a jak to skončilo.",
      "Spiklenci moc neudrželi, Caesarův přítel stál proti nim a krále nikdo nevolil. Sleduj řetěz událostí: pomsta, spor dvou vítězů, bitva u Actia. Kdo z toho vyšel jako jediný vládce?",
    ],
    explanation: "Vražda moc jednoho muže neodstranila. Vypukly nové války, nejdřív proti spiklencům, pak mezi Octavianem a Antoniem. Octavianus po Actiu zůstal sám a stal se prvním císařem.",
  },
  {
    q: "Proč bylo překročení Rubikonu tak vážný krok?",
    key: "Protože vojsko nesmělo vstoupit do Itálie a Caesar tím začal válku",
    d: [
      ["Protože Rubikon byl hranicí s Egyptem a Caesar tím napadl Kleopatru", "Rubikon tekl na severu Itálie, ne u Egypta. S Kleopatrou byl Caesar spojencem."],
      ["Protože za řekou začínala Galie, kterou Řím tehdy ještě neovládal", "Je to obráceně: Caesar se z dobyté Galie vracel do Itálie. Za Rubikonem ležel Řím, ne cizí země."],
      ["Protože se překročením řeky Caesar podle zákona stal císařem", "Žádný zákon nikoho císařem nedělal a Caesar císařem nebyl. Překročením porušil zákon."],
    ],
    hints: [
      "Rubikon odděloval provincii, kde Caesar velel, od Itálie. Co zákon říkal o vojsku v Itálii?",
      "Řeka neležela u Egypta a za ní nebyla cizí země, ale samotná Itálie s Římem. Zákon zakazoval vojevůdcům přivést legie do Itálie. Co tedy znamenalo, když to Caesar přesto udělal?",
    ],
    explanation: "Vojevůdce musel vojsko na hranici Itálie rozpustit. Caesar roku 49 př. n. l. s legiemi Rubikon překročil, porušil zákon a zahájil občanskou válku proti senátu a Pompeiovi.",
  },
  {
    q: "Co měli Caesar a Augustus společné?",
    key: "Oba soustředili moc v rukou jednoho muže, i když senát dál existoval",
    d: [
      ["Oba byli zavražděni spiklenci na zasedání senátu", "Zavražděn byl jen Caesar. Augustus zemřel přirozeně roku 14 n. l."],
      ["Oba nosili titul císař a vládli za Pax Romana", "Císařem byl jen Augustus a mír začal až za něj. Caesar byl diktátor."],
      ["Oba porazili Antonia a Kleopatru v bitvě u Actia", "U Actia zvítězil jen Octavianus (Augustus). Caesar byl v té době 13 let mrtvý."],
    ],
    hints: [
      "Zkontroluj každou možnost pro oba muže zvlášť. Společné je jen to, co platí pro oba.",
      "Jeden zemřel násilně a druhý přirozeně, jen jeden byl císař a jen jeden bojoval u Actia. Co ale dělali oba se senátem a s mocí, když senát nezrušili?",
    ],
    explanation: "Caesar jako doživotní diktátor i Augustus jako princeps soustředili moc v rukou jednoho muže, zatímco senát dál zasedal. Zavražděn byl jen Caesar a císařem i vítězem od Actia jen Augustus.",
  },
  {
    q: "Proč Pax Romana neznamenala, že Řím vůbec nebojoval?",
    key: "Protože na hranicích legie dál odrážely nájezdy a vedly války",
    d: [
      ["Protože mír platil jen v Římě a v provinciích se bojovalo stále", "V provinciích byl většinou klid, jen občas vypuklo povstání. Soustavně se bojovalo hlavně na hranicích."],
      ["Protože Pax Romana skončila hned po Augustově smrti", "Mír trval asi dvě století, dlouho po Augustovi. Tím se to nevysvětlí."],
      ["Protože mír uzavřel jen Caesar s Galy a jinde neplatil", "Pax Romana nebyla smlouva s Galy a nezačala za Caesara. Začala s Augustem."],
    ],
    hints: [
      "Rozliš, kde byl klid a kde ne: uvnitř říše, nebo na jejím okraji?",
      "Mír trval dlouho po prvním císaři a nebyla to smlouva s jedním národem. V provinciích byl většinou klid. Kde tedy vojáci dál bojovali, aby uvnitř mohl být mír?",
    ],
    explanation: "Pax Romana byl klid uvnitř říše. Na hranicích (limes) legie odrážely nájezdy a vedly války. Uvnitř říše byl většinou klid, jen občas vypuklo povstání (třeba Boudica v Británii). Mír trval asi 200 let a začal s Augustem, ne smlouvou Caesara.",
  },
  {
    q: "Proč byla bitva u Actia pro vznik císařství rozhodující?",
    key: "Protože Octavianus porazil posledního soupeře a zůstal jediným vládcem",
    d: [
      ["Protože v ní padl Caesar a republika tím hned skončila", "Caesar byl zavražděn v senátu roku 44 př. n. l., u Actia (31 př. n. l.) už nežil."],
      ["Protože Brutus v ní porazil Antonia a vrátil moc senátu", "Brutus zemřel už roku 42 př. n. l. U Actia proti Antoniovi bojoval Octavianus."],
      ["Protože Kleopatra v ní zvítězila a Egypt ovládl Řím", "Kleopatra s Antoniem u Actia prohráli. Egypt se naopak stal římskou provincií."],
    ],
    hints: [
      "Kdo proti sobě u Actia stál a kolik mocných soupeřů zbylo po bitvě?",
      "Diktátor ani spiklenec tehdy už nežili a Egypt nezvítězil. Sleduj, co se stalo s poraženými a proč už vítězi nikdo nemohl moc vzít.",
    ],
    explanation: "U Actia (31 př. n. l.) porazil Octavianus Antonia a Kleopatru, své poslední soupeře. Zůstal jediným vládcem a roku 27 př. n. l. se stal prvním císařem. Caesar ani Brutus tehdy nežili.",
  },
  {
    q: "Proč jméno Caesar přežilo ve slovech císař a kaiser (německy císař), i když prvním císařem byl jiný muž?",
    key: "Protože další vládci přijímali jméno Caesar jako titul na znamení moci",
    d: [
      ["Protože Caesar byl ve skutečnosti první císař a Augustus jen rádce", "Caesar císařem nebyl, byl doživotní diktátor. Augustus nebyl rádce, ale první císař."],
      ["Protože Augustus zakázal používat své jméno, a tak se užívalo jiné", "Takový zákaz neexistoval. Jméno Augustus císaři také nosili jako titul."],
      ["Protože Caesarovi potomci vládli Římu tisíc let bez přestávky", "Caesarův rod nevládl tisíc let. Jméno se předávalo jako titul, ne jako rodová linie."],
    ],
    hints: [
      "Octavianus přijal jméno adoptivního otce. Co se s tím jménem stalo u dalších vládců?",
      "Prvním císařem nebyl diktátor zavražděný na idy březnové a žádný rod nevládl tisíc let. Z vlastního jména se stalo označení úřadu, podobně jako když se jméno změní v obecné slovo.",
    ],
    explanation: "Octavianus přijal jméno Caesar po adoptivním otci a další císaři ho nosili jako titul. Tak se z vlastního jména stalo slovo císař (a kaiser, car). Caesar sám císařem nebyl.",
  },
];

/** Velikost sezení — úlohy téže skupiny rozmístíme vždy do jiného úseku této délky. */
const SEZENI = 6;

/**
 * Zamíchá banku a úlohy se stejnou myšlenkou (skupina) rozmístí po jedné do
 * po sobě jdoucích úseků délky SEZENI. Sezení bere prvních SEZENI úloh, takže
 * se dvě úlohy téže skupiny v jednom sezení nepotkají.
 */
function rozmisti(pool: Uloha[]): Uloha[] {
  const volne = pickN(pool.filter((u) => !u.skupina), pool.length);
  const skupiny = new Map<string, Uloha[]>();
  for (const u of pool) if (u.skupina) skupiny.set(u.skupina, [...(skupiny.get(u.skupina) ?? []), u]);
  const out: (Uloha | null)[] = new Array(pool.length).fill(null);
  for (const clenove of skupiny.values()) {
    pickN(clenove, clenove.length).forEach((u, i) => {
      const start = i * SEZENI;
      const sloty = [];
      for (let p = start; p < Math.min(start + SEZENI, pool.length); p++) if (!out[p]) sloty.push(p);
      out[sloty.length ? pickN(sloty, 1)[0] : out.indexOf(null)] = u;
    });
  }
  return out.map((u) => u ?? volne.shift()!);
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return rozmisti(pool).map(build);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const RIMSKE_CISARSTVI_TOPICS: TopicMetadata[] = [
  {
    id: "g6-dej-rimske-cisarstvi-6",
    rvpNodeId: "g6-dejepis-starovek-antika-rim-rimske-cisarstvi-caesar-augustus-pax-romana",
    displayName: "Caesar, Augustus a římský mír",
    title: "Římské císařství - Caesar, Augustus, Pax Romana",
    studentTitle: "Caesar, Augustus a římský mír",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řím",
    briefDescription: "Kdo byl Caesar, kdo první císař a proč nastal římský mír.",
    keywords: [
      "Caesar", "Augustus", "Octavianus", "Pax Romana", "římský mír", "Rubikon",
      "idy březnové", "Actium", "Kleopatra", "Marcus Antonius", "Brutus", "princeps",
      "principát", "limes", "juliánský kalendář", "císařství",
    ],
    goals: [
      "Rozlišit, co v přechodu od republiky k císařství patří Caesarovi a co Augustovi.",
      "Seřadit události Rubikon, idy březnové, Actium a titul Augustus a spočítat roky mezi nimi.",
      "Vysvětlit, co byla Pax Romana a proč za ní rozkvetl obchod.",
      "Rozpoznat v prameni rozdíl mezi tím, jak vláda vypadala, a kdo skutečně vládl.",
    ],
    boundaries: [
      "Jen nesporná učebnicová fakta; výroky „Kostky jsou vrženy“ a „Přišel jsem, viděl jsem…“ jen podle tradice.",
      "Konec Pax Romana se udává jen přibližně (asi 200 let), přesný rok není klíčem.",
      "Počítání let jen v rámci doby před naším letopočtem, bez přechodu přes přelom.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Caesar: dobyl Galii, 49 př. n. l. překročil Rubikon, doživotní diktátor, zavražděn 44 př. n. l. Octavianus: porazil Antonia a Kleopatru u Actia 31 př. n. l., roku 27 př. n. l. jméno Augustus, první císař (princeps). Pax Romana: asi 200 let klidu uvnitř říše, legie hlídaly limes.",
      steps: [
        "Najdi v zadání jméno, čin nebo letopočet.",
        "Rozhodni, jestli jde o Caesara (diktátor), Augusta (první císař), nebo o dobu římského míru.",
        "U letopočtů př. n. l. pamatuj: větší číslo = dřív, rozdíl ve stejné éře se odečítá.",
        "U příčin rozliš, jak věci vypadaly navenek a kdo skutečně vládl.",
      ],
      commonMistake: "Myslet si, že prvním císařem byl Caesar, protože z jeho jména vzniklo slovo „císař“.",
      example: "Smrt Pompeia 48 př. n. l. a bitva u Filipp 42 př. n. l.: 48 − 42 = 6, uplynulo 6 let.",
    },
  },
];
