/**
 * Dějepis 6. ročník — Starověký Egypt: faraoni, pyramidy, hieroglyfy (select_one).
 *
 * Faktické téma → banky úloh, ne šablona. Tři disjunktní banky (POOL_L1/L2/L3),
 * každá s vlastním zněním, vlastní dvojicí nápověd a vlastním vysvětlením.
 *
 * Chybový model (každý distraktor = jedna typická chyba):
 *  • záměna s Mezopotámií — klínové písmo, zikkurat, Chammurapi, Eufrat a Tigris, Babylon;
 *  • funkce podle dnešní představy — pyramida jako palác nebo chrám, mumie jako trest;
 *  • nilská záplava jako pohroma — ve skutečnosti přinášela úrodné bahno;
 *  • záměna osob a objevů — Champollion × Carter, Tutanchamon × Cheops;
 *    faraon jako volený vůdce nebo „jen kněz“, písař vážený kvůli bohatství.
 *
 *  • L1 — zapamatování: popis → pojem.
 *  • L2 — použití: výjev ze života nebo z objevu → pojem, osoba, věc.
 *  • L3 — analýza: příčina, důsledek, oprávněný závěr (i práce s pramenem).
 *
 * Sporné údaje se nepoužívají: „pyramidy stavěli otroci“ ani jako klíč, ani
 * jako distraktor; Stará, Střední a Nová říše ani přesná data sjednocení ne.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { buildChoiceTask as choice, type Distractor } from "./_shared";
import { ruzneUlohy } from "../fyzika/_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const MEZO = "To je Mezopotámie (Sumer, Babylonie), ne Egypt.";

// ── L1 — ZAPAMATOVÁNÍ: popis → pojem ────────────────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Jak se jmenoval panovník starověkého Egypta, kterého lidé uctívali jako boha?",
    correct: "Faraon",
    distractors: [
      { value: "Chammurapi", why: `${MEZO} Chammurapi byl babylonský král, známý svým zákoníkem. Egyptský vládce nesl titul faraon.` },
      { value: "Písař", why: "Písař byl úředník, který uměl psát a vedl záznamy. Zemi nevládl a za boha ho nikdo nepovažoval." },
      { value: "Velekněz", why: "Velekněz sloužil bohům v chrámu, ale zemi nevládl. Panovníkem uctívaným jako bůh byl faraon." },
    ],
    hints: [
      "Hledáš titul egyptských vládců, ne vlastní jméno jednoho konkrétního krále.",
      "Vlastní jména králů patří jednotlivým říším a lidem. Egyptští vládci měli společný titul, který se dědil v rodině a spojoval vládce s bohy. Vyřaď také povolání, která zemi nevládla.",
    ],
    explanation: "Egyptský panovník se nazýval faraon. Vládl dědičně a Egypťané ho uctívali jako boha na zemi, proto měl nad zemí téměř neomezenou moc.",
  },
  {
    q: "Na jaký materiál vyrobený z rostliny, která rostla u řeky, Egypťané psali?",
    correct: "Papyrus",
    distractors: [
      { value: "Hliněné tabulky", why: `${MEZO} Do měkké hlíny se vtlačovalo klínové písmo. Egypťané psali na listy z rostliny.` },
      { value: "Pergamen", why: "Pergamen se vyráběl ze zvířecí kůže, ne z rostliny, a rozšířil se až mnohem později." },
      { value: "Kamenné desky", why: "Do kamene Egypťané nápisy tesali, ale kámen není rostlina. Na běžné psaní používali lehčí materiál z rostliny." },
    ],
    hints: [
      "Všimni si, že zadání chce materiál z rostliny. Který z nabídky z rostliny opravdu je?",
      "Vyřaď nejdřív materiály z hlíny, kůže nebo kamene. Zbude ten, který se vyráběl z rákosovité rostliny rostoucí v bažinách u řeky: stonky se nařezaly na proužky a slisovaly do listů.",
    ],
    explanation: "Egypťané psali na papyrus. Vyráběl se ze stonků rostliny papyrusu, která rostla v bažinách u Nilu. Proužky se kladly křížem přes sebe a slisovaly do listů, ze kterých se lepily svitky.",
  },
  {
    q: "Která řeka dávala starověkému Egyptu úrodnou půdu?",
    correct: "Nil",
    distractors: [
      { value: "Eufrat", why: `${MEZO} Eufrat protéká Mezopotámií. Egypt ležel u jiné řeky v Africe.` },
      { value: "Tigris", why: `${MEZO} Tigris a Eufrat vymezují Mezopotámii. Egypt ležel u jiné řeky v Africe.` },
      { value: "Indus", why: "Indus protéká dnešním Pákistánem a u něj vznikla indická civilizace, ne egyptská." },
    ],
    hints: [
      "Vybav si mapu: Egypt leží v severovýchodní Africe. Která z řek teče právě tam?",
      "Dvě z nabízených řek patří k Mezopotámii (území mezi dvěma řekami v Asii) a jedna k Indii. Egyptská řeka teče z vnitrozemí Afriky na sever do Středozemního moře.",
    ],
    explanation: "Egypt ležel podél Nilu. Řeka se každý rok rozlila a zanechala na polích úrodné bahno, takže uprostřed pouště mohli lidé pěstovat obilí. Eufrat a Tigris patří k Mezopotámii.",
  },
  {
    q: "K čemu sloužily pyramidy v Gíze?",
    correct: "Byly to hrobky faraonů",
    distractors: [
      { value: "Byly to paláce faraonů", why: "Pyramida nebyla obydlí. Byla to hrobka, která měla ochránit tělo faraona pro posmrtný život." },
      { value: "Byly to chrámy pro lid", why: "Do pyramidy lidé nechodili na bohoslužby. Uvnitř byla pohřební komora faraona." },
      { value: "Byly to sýpky na obilí", why: "Obilí se skladovalo v sýpkách u měst. Pyramidy byly hrobky faraonů." },
    ],
    hints: [
      "Uvnitř pyramidy je malá komora a úzké chodby, žádné obytné místnosti. Co tam asi bylo uložené?",
      "Vzpomeň si, čemu Egypťané věřili o životě po smrti a jak se starali o tělo panovníka. Obrovská kamenná stavba měla chránit to nejcennější, ne sloužit živým lidem k bydlení nebo k modlitbám.",
    ],
    explanation: "Pyramidy v Gíze byly hrobky faraonů. Egypťané věřili v posmrtný život, a proto chtěli tělo panovníka i jeho výbavu co nejlépe ochránit.",
  },
  {
    q: "Jak říkáme obrázkovému písmu starých Egypťanů?",
    correct: "Hieroglyfy",
    distractors: [
      { value: "Klínové písmo", why: `${MEZO} Klínové písmo se vtlačovalo do hlíny. Egypťané psali obrázkovým písmem.` },
      { value: "Hlaholice", why: "Hlaholice je slovanské písmo z doby Velké Moravy, o tisíce let mladší než egyptské písmo." },
      { value: "Latinka", why: "Latinku používali Římané a dnes ji používáme my. Egypťané měli vlastní obrázkové písmo." },
    ],
    hints: [
      "Vyřaď písma, která vznikla v jiné zemi nebo v úplně jiné době.",
      "Jedno písmo z nabídky patří Mezopotámii, dvě jsou evropská a mnohem mladší. Zbude písmo složené z drobných obrázků ptáků, očí nebo rostlin, které Egypťané tesali do kamene.",
    ],
    explanation: "Egyptské písmo se nazývá hieroglyfy. Jeho znaky mají podobu obrázků, ale neoznačují jen věci, často i hlásky. Klínové písmo patří Mezopotámii.",
  },
  {
    q: "Kvůli čemu Egypťané pečlivě uchovávali těla zemřelých?",
    correct: "Věřili v posmrtný život",
    distractors: [
      { value: "Chtěli zemřelé potrestat", why: "Uchování těla nebylo trest, ale péče. Tělo mělo zemřelému sloužit v životě po smrti." },
      { value: "Báli se šíření nemocí", why: "Kvůli nemocem by stačilo tělo pohřbít. Egypťané tělo naopak chránili, aby vydrželo pro život po smrti." },
      { value: "Chtěli je vystavovat lidem", why: "Mumie dnes vidíme v muzeích, ale Egypťané je ukládali do uzavřených hrobek. Tělo mělo sloužit zemřelému v životě po smrti." },
    ],
    hints: [
      "Zeptej se, co podle Egypťanů čekalo člověka po smrti a k čemu by mu tělo bylo.",
      "Egypťané dávali do hrobů i jídlo a předměty denní potřeby. Kdo by je potřeboval a kdy? Stejný důvod vede i k pečlivé péči o tělo zemřelého.",
    ],
    explanation: "Egypťané věřili, že život po smrti pokračuje a duše se k tělu vrací. Tělo proto muselo zůstat zachované, a tak ho mumifikovali.",
  },
  {
    q: "Kterého boha uctívali Egypťané jako boha slunce?",
    correct: "Bůh Ra",
    distractors: [
      { value: "Bůh Osiris", why: "Osiris byl bůh podsvětí a posmrtného života, soudil duše zemřelých. Slunce patřilo jinému bohu." },
      { value: "Bůh Marduk", why: `${MEZO} Marduk byl hlavní bůh Babylonu.` },
      { value: "Bůh Zeus", why: "Zeus byl nejvyšší bůh Řeků, ne Egypťanů." },
    ],
    hints: [
      "Vyřaď nejdřív bohy, které uctívali jiné národy než Egypťané.",
      "Jeden z bohů v nabídce patří Babylonu a jeden Řekům. Ze dvou egyptských bohů jeden vládl podsvětí a soudil zemřelé, druhý každý den plul po obloze ve sluneční lodi.",
    ],
    explanation: "Bohem slunce byl pro Egypťany Ra. Věřili, že každý den pluje po nebi ve sluneční lodi. Osiris vládl podsvětí, Marduk patřil Babylonu a Zeus Řekům.",
  },
  {
    q: "Který egyptský bůh vládl podsvětí a soudil duše zemřelých?",
    correct: "Bůh Osiris",
    distractors: [
      { value: "Bůh Ra", why: "Ra byl egyptský bůh slunce. Podsvětí a soud zemřelých patřily jinému bohu." },
      { value: "Bůh Marduk", why: `${MEZO} Marduk byl hlavní bůh Babylonu.` },
      { value: "Bůh Hádés", why: "Hádés vládl podsvětí v řeckých bájích. Egypťané měli vlastního boha podsvětí." },
    ],
    hints: [
      "Hledáš egyptského boha, takže bohy jiných národů můžeš vyřadit.",
      "Hádés patří řeckým bájím a Marduk Babylonu. Ze dvou egyptských bohů v nabídce je jeden spojený se sluncem a nebem, a tak k podsvětí nepatří.",
    ],
    explanation: "Podsvětí vládl Osiris. Egypťané věřili, že před ním duše zemřelého skládá účty ze svého života. Ra byl bohem slunce.",
  },
  {
    q: "Jak se jmenovalo povolání Egypťana, který se léta učil hieroglyfy a vedl úřední záznamy?",
    correct: "Písař",
    distractors: [
      { value: "Stavitel", why: "Stavitel řídil stavby, například chrámy a hrobky. Úřední záznamy vedl jiný člověk." },
      { value: "Rolník", why: "Rolník obdělával pole a psát většinou neuměl. Záznamy o jeho sklizni vedl úředník." },
      { value: "Hrnčíř", why: "Hrnčíř vyráběl nádoby z hlíny. Psát se učil jen málokdo a hrnčíř k takovým lidem nepatřil." },
    ],
    hints: [
      "Které povolání potřebovalo umět psát? U ostatních si představ, co dělali rukama.",
      "Rolník, hrnčíř i stavitel pracovali hlavně rukama. Psaní se učilo dlouhé roky ve škole a stát ho potřeboval k zapisování daní, zásob a rozkazů. Takový člověk pracoval jako úředník.",
    ],
    explanation: "Úřední záznamy vedli písaři. Psát hieroglyfy se učili mnoho let, a protože to umělo jen málo lidí, byli pro stát nepostradatelní.",
  },
  {
    q: "Jak se nazývá zachované tělo zemřelého, které Egypťané připravili pro posmrtný život?",
    correct: "Mumie",
    distractors: [
      { value: "Sfinga", why: "Sfinga je kamenná socha lva s lidskou hlavou, ne tělo zemřelého." },
      { value: "Obelisk", why: "Obelisk je vysoký kamenný sloup se špičkou, stával před chrámy. Tělem zemřelého není." },
      { value: "Urna", why: "Do urny se ukládá popel po spálení těla. Egypťané tělo naopak celé zachovávali." },
    ],
    hints: [
      "Hledáš tělo, ne stavbu ani sochu. Které slovo v nabídce označuje člověka, ne kámen?",
      "Sfinga a obelisk jsou kamenná díla. Do urny se ukládal popel, jenže Egypťané tělo nepálili, ale vysušili a zabalili do plátna, aby vydrželo tisíce let.",
    ],
    explanation: "Vysušené a do plátna zabalené tělo se nazývá mumie. Egypťané ho tak připravovali, protože věřili, že tělo bude zemřelý potřebovat v posmrtném životě.",
  },
  {
    q: "Jak se nazývá kamenná deska se stejným textem ve třech písmech, díky které se podařilo přečíst hieroglyfy?",
    correct: "Rosettská deska",
    distractors: [
      { value: "Chammurapiho zákoník", why: `${MEZO} Chammurapiho zákoník je sloup s babylonskými zákony v klínovém písmu, k hieroglyfům klíč nedává.` },
      { value: "Hliněná tabulka", why: `${MEZO} Hliněné tabulky nesly klínové písmo, nepomohly přečíst egyptské písmo.` },
      { value: "Kamenný obelisk", why: "Běžný obelisk nese nápis jen v hieroglyfech. Chybí na něm stejný text v písmu, které badatelé znali, a tak podle něj hieroglyfy přečíst nešlo." },
    ],
    hints: [
      "Neznámé písmo se dá přečíst, když máš stejný text i v písmu, které znáš. Který předmět takový text měl?",
      "Vyřaď předměty z Mezopotámie, ty nesou klínové písmo. Pomohl předmět nalezený u ústí Nilu, na kterém byl tentýž text v hieroglyfech, v další egyptské podobě písma a také řecky.",
    ],
    explanation: "Klíčem k hieroglyfům byla Rosettská deska. Nesla stejný text ve třech podobách písma, včetně řečtiny, kterou badatelé znali, a tak šlo porovnávat.",
  },
  {
    q: "Co přinášely každoroční záplavy Nilu na egyptská pole?",
    correct: "Úrodné černé bahno",
    distractors: [
      { value: "Slanou mořskou vodu", why: "Nil je sladkovodní řeka a tekl z vnitrozemí. Záplava pole nezasolila, ale zúrodnila." },
      { value: "Písek z okolní pouště", why: "Písek pole neúrodní a záplava ho nepřinášela. Po opadnutí vody zůstalo na polích bahno." },
      { value: "Trosky zničených domů", why: "Tak vypadají dnešní ničivé povodně. Nilská záplava přicházela pomalu a pravidelně a po opadnutí vody zůstala na polích jemná vrstva, ve které rostlo obilí." },
    ],
    hints: [
      "Záplava nebyla pro Egypťany pohroma. Co mohla řeka nechat na polích, aby se na nich dobře dařilo?",
      "Přemýšlej, co zbude na zemi, když voda z řeky pomalu opadne. Není to nic z pouště ani z moře, ale jemná vrstva, kterou řeka nesla z vnitrozemí Afriky a která byla plná živin.",
    ],
    explanation: "Nil se každý rok rozlil a po opadnutí zanechal na polích černé bahno plné živin. Díky němu byla pole úrodná, i když v Egyptě skoro nepršelo.",
  },
  {
    q: "Která stavba patří do starověkého Egypta, a ne do Mezopotámie?",
    correct: "Pyramida v Gíze",
    distractors: [
      { value: "Zikkurat v Uru", why: `${MEZO} Zikkurat je stupňovitá chrámová věž, stála v sumerském městě Ur.` },
      { value: "Ištařina brána", why: `${MEZO} Modrá Ištařina brána byla jednou z hlavních bran Babylonu.` },
      { value: "Palác v Ninive", why: `${MEZO} Ninive bylo hlavní město Asyrské říše na Tigridu.` },
    ],
    hints: [
      "U každé stavby se zeptej, ve kterém městě stála a u které řeky to město leží.",
      "Ur, Babylon i Ninive byla města u Eufratu a Tigridu. Hledej stavbu, která stojí u jiné řeky, na kraji pouště blízko dnešní Káhiry.",
    ],
    explanation: "Pyramidy v Gíze stojí v Egyptě u Nilu a sloužily jako hrobky faraonů. Zikkurat v Uru, Ištařina brána v Babylonu i palác v Ninive patří Mezopotámii.",
  },
  {
    q: "Jak se nazývá vysoký čtyřhranný kamenný sloup se špičkou, který Egypťané stavěli před chrámy?",
    correct: "Obelisk",
    distractors: [
      { value: "Pyramida", why: "Pyramida je obrovská hrobka se čtvercovou podstavou, ne úzký sloup před chrámem." },
      { value: "Zikkurat", why: `${MEZO} Zikkurat je stupňovitá chrámová věž, ne úzký sloup.` },
      { value: "Sfinga", why: "Sfinga je socha lva s lidskou hlavou, ne sloup." },
    ],
    hints: [
      "Představ si úzký a vysoký kámen. Která z nabízených věcí je spíš sloup než široká stavba nebo socha?",
      "Pyramida je široká hrobka, sfinga je socha zvířete s lidskou hlavou a zikkurat patří Mezopotámii. Hledáš jediný kus kamene, který se nahoře zužuje do špičky a bývá pokrytý nápisy.",
    ],
    explanation: "Obelisk je vysoký úzký sloup z jednoho kusu kamene zakončený špičkou. Egypťané je stavěli před chrámy a zdobili nápisy na počest bohů a faraonů.",
  },
];

// ── L2 — POUŽITÍ: výjev → pojem, osoba, věc ─────────────────────────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Úředník zapisuje, kolik obilí odevzdal rolník do sýpek panovníka. Kdo to je?",
    correct: "Písař",
    distractors: [
      { value: "Faraon", why: "Faraon zemi vládl, ale obilí sám nezapisoval. Na to měl úředníky, kteří uměli psát." },
      { value: "Rolník", why: "Rolník obilí odevzdává, nezapisuje ho. Psát většinou neuměl." },
      { value: "Stavitel", why: "Stavitel řídil stavby, ne evidenci zásob. Záznamy o obilí vedl jiný úředník." },
    ],
    hints: [
      "Kdo v Egyptě uměl psát a pracoval pro stát? Rolník to být nemůže, ten obilí odevzdává.",
      "Vyřaď toho, kdo obilí přináší, toho, kdo zemi vládne, a toho, kdo řídí stavby. Zapisovat mohl jen člověk, který se léta učil hieroglyfy a pracoval jako úředník.",
    ],
    explanation: "Záznamy o daních a zásobách vedl písař. Stát potřeboval vědět, kolik obilí má v sýpkách, a psát umělo jen málo lidí.",
  },
  {
    q: "Francouzský badatel porovnal stejný text ve třech písmech na kamenné desce a jako první přečetl egyptské písmo. Kdo to byl?",
    correct: "Jean-François Champollion",
    distractors: [
      { value: "Howard Carter", why: "Howard Carter objevil roku 1922 hrobku v Údolí králů. Písmo rozluštil někdo jiný už o sto let dřív." },
      { value: "Heinrich Schliemann", why: "Heinrich Schliemann vykopával Tróju, egyptské písmo nerozluštil." },
      { value: "Napoleon Bonaparte", why: "Deska se našla během Napoleonovy výpravy do Egypta, ale přečetl ji až francouzský jazykovědec." },
    ],
    hints: [
      "Rozlišuj, kdo písmo přečetl a kdo v Egyptě něco objevil nebo dobyl.",
      "Jeden z mužů v nabídce byl vojevůdce, druhý vykopával Tróju a třetí objevil hrobku až ve 20. století. Hledáš jazykovědce, který na začátku 19. století porovnával řecký text s hieroglyfy.",
    ],
    explanation: "Hieroglyfy rozluštil roku 1822 Jean-François Champollion. Porovnal na Rosettské desce řecký text se stejným textem v egyptském písmu. Howard Carter objevil hrobku v Údolí králů až o sto let později.",
  },
  {
    q: "Nejslavnější egyptská zlatá pohřební maska zakrývala mumii faraona, který zemřel jako mladík. Komu patřila?",
    correct: "Tutanchamonovi",
    distractors: [
      { value: "Cheopsovi", why: "Cheops byl pohřben ve Velké pyramidě v Gíze o víc než tisíc let dřív. Jeho pohřební výbava se nedochovala." },
      { value: "Ramessovi II.", why: "Ramesse II. vládl přes šedesát let a zemřel starý. Jeho hrobku vykradli už ve starověku." },
      { value: "Chammurapimu", why: `${MEZO} Chammurapi byl babylonský král, jeho hrob v Egyptě nebyl.` },
    ],
    hints: [
      "Všimni si dvou údajů: maska je egyptská a faraon zemřel mladý.",
      "Vyřaď panovníka, který nebyl egyptský, i faraona z doby pyramid, jehož výbava se nedochovala. Ze zbylých dvou jeden vládl přes šedesát let a zemřel starý. Masku našli v hrobce, do které vykradači vnikli jen krátce po pohřbu a jejíž vchod pak na tisíce let zasypaly sutě.",
    ],
    explanation: "Zlatá maska patřila Tutanchamonovi, který zemřel mladý. Vykradači do jeho hrobky vnikli jen krátce po pohřbu a hrobku znovu zapečetili. Vchod pak zasypaly sutě z pozdějších staveb, takže se na ni zapomnělo a většina pokladu se zachovala.",
  },
  {
    q: "Kdo roku 1922 objevil v Údolí králů téměř nevykradenou hrobku mladého faraona?",
    correct: "Howard Carter",
    distractors: [
      { value: "Jean-François Champollion", why: "Champollion rozluštil hieroglyfy roku 1822, o sto let dřív. Hrobku neobjevil." },
      { value: "Heinrich Schliemann", why: "Heinrich Schliemann vykopával Tróju a zemřel dávno před rokem 1922." },
      { value: "Napoleon Bonaparte", why: "Napoleon vedl výpravu do Egypta kolem roku 1800, o víc než sto let dřív." },
    ],
    hints: [
      "Porovnej, kdy který z mužů žil. Kdo mohl v Egyptě pracovat v roce 1922?",
      "Vojevůdce působil kolem roku 1800, jazykovědec o dvacet let později a objevitel Tróje zemřel v 19. století. Hledáš britského archeologa, který v Údolí králů kopal na začátku 20. století.",
    ],
    explanation: "Tutanchamonovu hrobku objevil roku 1922 britský archeolog Howard Carter. Champollion rozluštil písmo už o sto let dřív.",
  },
  {
    q: "Každé léto se řeka rozlije a po opadnutí vody zůstane na polích černá vrstva. Co to znamená pro rolníky?",
    correct: "Pole budou úrodná a dají dobrou sklizeň",
    distractors: [
      { value: "Pole jsou zničená a musí se opustit", why: "Záplava nebyla pohroma. Černá vrstva je úrodné bahno, na kterém se obilí dařilo." },
      { value: "Pole jsou zasolená a nic tam nevyroste", why: "Nil je sladkovodní řeka, pole nezasolil. Bahno je naopak zúrodnilo." },
      { value: "Pole se musí celý rok jen vysoušet", why: "Po opadnutí vody se hned selo. Bahno pole zúrodnilo, nebylo ho potřeba vysoušet." },
    ],
    hints: [
      "Neber to podle dnešních povodní. Zeptej se, k čemu Egypťané potřebovali řeku, když skoro nepršelo.",
      "Černá vrstva, kterou řeka přinesla z vnitrozemí, je plná živin. Představ si, co by rolník na takové zemi zasel a jak by se mu dařilo, kdyby jinak kolem byla jen poušť.",
    ],
    explanation: "Nilská záplava přinášela úrodné černé bahno. Po opadnutí vody rolníci zaseli a sklizeň byla bohatá, proto Egypťané záplavu vítali.",
  },
  {
    q: "Tisíce dělníků léta lámou a přesouvají kamenné kvádry na stavbu, do které bude uloženo tělo panovníka. Co stavějí?",
    correct: "Pyramidu",
    distractors: [
      { value: "Zikkurat", why: `${MEZO} Zikkurat byla chrámová věž z cihel, nikdo v ní nebyl pohřben.` },
      { value: "Palác", why: "V paláci panovník za života bydlel. Stavba pro uložení jeho těla byla hrobka." },
      { value: "Obelisk", why: "Obelisk je sloup z jednoho kusu kamene. Nikdo do něj nemohl být uložen." },
    ],
    hints: [
      "Rozhodující je, k čemu stavba poslouží: bude v ní uloženo tělo. Která stavba je hrobka?",
      "V paláci se bydlí, zikkurat byla chrámová věž v Mezopotámii a obelisk je jediný kámen. Hledáš obrovskou egyptskou stavbu z kamenných kvádrů s pohřební komorou uvnitř.",
    ],
    explanation: "Dělníci stavějí pyramidu, hrobku faraona. Stavba trvala mnoho let a vyžadovala tisíce lidí, zásoby a kámen.",
  },
  {
    q: "Na malbě v hrobce leží na jedné misce vah srdce zemřelého a na druhé pírko. Co výjev zobrazuje?",
    correct: "Soud nad zemřelým v podsvětí",
    distractors: [
      { value: "Vážení zboží na trhu", why: "Na trhu se neváží lidské srdce. Výjev patří do hrobky a týká se toho, co čekalo zemřelého po smrti." },
      { value: "Přípravu těla na mumifikaci", why: "Při mumifikaci se srdce nevážilo, naopak se nechávalo v těle. Váhy se srdcem patří k soudu po smrti." },
      { value: "Oběť jídla bohu slunce", why: "Oběti se zobrazovaly s jídlem a dary na stole, ne se srdcem na vahách. Výjev patří k soudu po smrti." },
    ],
    hints: [
      "Srdce bylo pro Egypťany sídlem svědomí. Proč by ho někdo vážil?",
      "Vzpomeň si, co podle Egypťanů čekalo zemřelého, než mohl vstoupit do posmrtného života, a který bůh při tom rozhodoval. Pak vyřaď výjevy, ve kterých by srdce na vahách nedávalo smysl.",
    ],
    explanation: "Výjev zobrazuje soud v podsvětí. Srdce zemřelého se vážilo proti pírku bohyně pravdy. Když nebylo těžší, zemřelý obstál a mohl vstoupit do posmrtného života. Soudu předsedal bůh Osiris.",
  },
  {
    q: "Turisté v Gíze fotí největší z pyramid, postavenou pro jednoho faraona asi před 4500 lety. Čí je to pyramida?",
    correct: "Cheopsova",
    distractors: [
      { value: "Tutanchamonova", why: "Tutanchamon žil o víc než tisíc let později a byl pohřben ve skalní hrobce v Údolí králů." },
      { value: "Ramessova (Ramesse II.)", why: "Ramesse II. žil o víc než tisíc let později a pyramidu si nestavěl." },
      { value: "Chammurapiho", why: `${MEZO} Chammurapi byl babylonský král a v Egyptě nestavěl.` },
    ],
    hints: [
      "Pyramidy v Gíze patří k nejstarším egyptským stavbám. Který faraon žil tak dávno?",
      "Vyřaď krále, který nebyl egyptský. Dva zbylí faraoni vládli o víc než tisíc let později, kdy se už pyramidy nestavěly a faraoni se pohřbívali do skalních hrobek.",
    ],
    explanation: "Největší pyramida v Gíze je Cheopsova (Velká pyramida). Postavili ji asi před 4500 lety. Tutanchamon a Ramesse II. žili mnohem později a pyramidy už nestavěli.",
  },
  {
    q: "U pyramid v Gíze leží obří kamenný lev s lidskou tváří, vytesaný přímo ze skály. Co to je?",
    correct: "Sfinga",
    distractors: [
      { value: "Zikkurat", why: `${MEZO} Zikkurat je stupňovitá věž, ne socha lva.` },
      { value: "Obelisk", why: "Obelisk je úzký sloup se špičkou, žádnou postavu nezobrazuje." },
      { value: "Mumie", why: "Mumie je vysušené tělo zemřelého, ne kamenná socha." },
    ],
    hints: [
      "Hledáš sochu, ne budovu, sloup ani tělo. Které slovo v nabídce označuje sochu?",
      "Zikkurat je věž z Mezopotámie, obelisk je jednoduchý sloup a mumie je zachované tělo. Zbude kamenná postava ležícího zvířete s hlavou člověka, která podle Egypťanů hlídala hrobky.",
    ],
    explanation: "Je to Velká sfinga, socha ležícího lva s lidskou hlavou. Stojí u pyramid v Gíze a měla chránit pohřebiště faraonů.",
  },
  {
    q: "Rolník po sklizni odveze část obilí do státních sýpek a písař to zapíše. Co tím rolník platí?",
    correct: "Daň pro faraona",
    distractors: [
      { value: "Pokutu za povodeň", why: "Za záplavu nikdo neplatil, záplava byla vítaná. Odvedené obilí byla pravidelná daň." },
      { value: "Clo za vývoz", why: "Clo se platí za zboží vezené přes hranice. Rolník obilí nevyvážel, odváděl ho státu." },
      { value: "Nájem kupcům", why: "Kupci obilí nevybírali, sýpky patřily státu. Rolník platil daň panovníkovi." },
    ],
    hints: [
      "Sýpky jsou státní a zápis dělá úředník. Komu tedy obilí putuje a proč pravidelně?",
      "Kupci ani cizí země s tím nemají co dělat a za záplavu nikdo netrestal. Přemýšlej, z čeho stát živil úředníky, vojáky a dělníky na stavbách, když se ještě neplatilo mincemi.",
    ],
    explanation: "Rolník odváděl daň v obilí. Stát ji skladoval v sýpkách, písaři ji zapisovali a ze zásob se živili úředníci, vojáci i dělníci na stavbách faraona.",
  },
  {
    q: "Faraon nemohl sám řídit celou zemi. Jmenoval proto nejvyššího úředníka, který za něj dohlížel na písaře, soudy a sýpky. Kdo to byl?",
    correct: "Vezír",
    distractors: [
      { value: "Velekněz", why: "Velekněz řídil službu bohům v chrámu. Správu země, soudy a sýpky vedl jiný hodnostář." },
      { value: "Písař", why: "Písařů bylo mnoho a psali záznamy. Na písaře naopak dohlížel nejvyšší úředník." },
      { value: "Vojevůdce", why: "Vojevůdce velel vojsku, ne úředníkům, soudům a sýpkám." },
    ],
    hints: [
      "Hledáš člověka, který stál nad ostatními úředníky, ale pod faraonem.",
      "Písař byl jen jeden z mnoha úředníků, velekněz se staral o chrámy a vojevůdce o vojsko. Hledáš titul muže, který byl faraonovou pravou rukou a řídil správu celé země.",
    ],
    explanation: "Nejvyšším úředníkem byl vezír. Za faraona řídil správu země, dohlížel na písaře, soudy a sýpky a podával panovníkovi zprávy o stavu země.",
  },
  {
    q: "Na stěnách hrobky jsou řady drobných obrázků: sova, oko, had a sedící postava. Co to je?",
    correct: "Hieroglyfické písmo",
    distractors: [
      { value: "Klínové písmo", why: `${MEZO} Klínové písmo tvoří klínky vtlačené do hlíny, ne obrázky zvířat.` },
      { value: "Jen výzdoba bez významu", why: "Obrázky nejsou jen ozdoba. Jsou to znaky písma, které se dají přečíst." },
      { value: "Řecká abeceda", why: "Řecká písmena nejsou obrázky zvířat a lidí. Řádky sov, očí a hadů jsou znaky jiného písma." },
    ],
    hints: [
      "Obrázky jdou v řadách za sebou jako slova v knize. Co z toho vyplývá?",
      "Klínky v hlíně patří Mezopotámii a řecká písmena obrázky nejsou. Kdyby šlo jen o ozdobu, obrázky by se neřadily do pravidelných řádků a neopakovaly by se jako znaky.",
    ],
    explanation: "Jsou to hieroglyfy, egyptské písmo. Obrázkové znaky se čtou a označují slova i hlásky. Proto se po jejich rozluštění daly nápisy v hrobkách přečíst.",
  },
  {
    q: "Kněží vyjmou z těla zemřelého vnitřní orgány, tělo vysuší solí a zabalí do lněných pásů. Co připravují?",
    correct: "Mumii pro pohřeb",
    distractors: [
      { value: "Oběť pro bohy", why: "Nejde o oběť bohům. Tělo se připravuje, aby vydrželo pro zemřelého v posmrtném životě." },
      { value: "Trest pro zločince", why: "Uchování těla nebylo trest, ale pocta a péče o zemřelého." },
      { value: "Lék pro nemocné", why: "Z těla zemřelého se lék nevyráběl. Tělo se chránilo pro posmrtný život." },
    ],
    hints: [
      "Tělo se vysušuje a balí, aby se nerozpadlo. Proč by ho Egypťané chtěli zachovat?",
      "Vzpomeň si, čemu Egypťané věřili o životě po smrti. Tělo zemřelého tu nikomu neslouží ani ho nikdo netrestá. Připravuje se k uložení do hrobky, aby vydrželo tisíce let.",
    ],
    explanation: "Kněží připravují mumii. Vysušené a zabalené tělo vydrželo tisíce let, a to bylo důležité, protože Egypťané věřili v posmrtný život.",
  },
  {
    q: "V Egyptě skoro neprší, přesto rolníci sklízejí obilí i na polích daleko od břehu. Co jim to umožnilo?",
    correct: "Zavlažovací kanály",
    distractors: [
      { value: "Časté letní deště", why: "V Egyptě téměř neprší, na dešti se spolehnout nedalo. Vodu přiváděli z řeky." },
      { value: "Hnojení popelem", why: "Hnojení nenahradí vodu. Bez zavlažování by obilí na suchém poli nevyrostlo." },
      { value: "Chov velbloudů", why: "Velbloud vodu na pole nepřinese. Rolníkům pomohly stavby, které vedly vodu z řeky." },
    ],
    hints: [
      "Déšť nepadá, ale řeka je blízko. Jak dostat vodu z řeky na pole, které leží daleko od ní?",
      "Hnojivo ani zvířata vodu nenahradí a na déšť se v Egyptě spolehnout nedalo. Rolníci museli společně vykopat stavby, kterými voda z řeky tekla až na vzdálená pole.",
    ],
    explanation: "Egypťané kopali zavlažovací kanály a hráze. Vodu z Nilu tak dostali i na pole daleko od břehu. Stavba a údržba kanálů vyžadovala spolupráci mnoha lidí.",
  },
  {
    q: "Na nástěnné malbě je muž mnohem větší než ostatní postavy, nosí korunu a v rukou drží žezlo. Koho zobrazuje?",
    correct: "Faraona",
    distractors: [
      { value: "Písaře", why: "Písař korunu ani žezlo nenosil. Byl to úředník, ne vládce." },
      { value: "Rolníka", why: "Rolník by na malbě nebyl největší a neměl by korunu. Koruna a žezlo patřily vládci." },
      { value: "Chammurapiho", why: `${MEZO} Chammurapi byl babylonský král, egyptské malby ho nezobrazovaly.` },
    ],
    hints: [
      "Na egyptských malbách je nejdůležitější člověk kreslený největší. Kdo byl v Egyptě nejdůležitější?",
      "Koruna a žezlo jsou znaky vlády. Vyřaď lidi, kteří nevládli, i krále, který nebyl egyptský. Zbude vládce, kterého Egypťané uctívali jako boha.",
    ],
    explanation: "Malba zobrazuje faraona. Koruna a žezlo byly znaky jeho moci a malíři ho kreslili větší než ostatní, protože byl nejdůležitější osobou v zemi.",
  },
];

// ── L3 — ANALÝZA: příčina, důsledek, oprávněný závěr ────────────────────────
// Distraktory L3 jsou chyby v úvaze (obrácená příčina a důsledek, přehnané
// zobecnění, představa podle dneška), ne záměna s Mezopotámií — ta patří L1/L2.
export const POOL_L3: Polozka[] = [
  {
    q: "Proč vznikl jeden z nejstarších států právě podél Nilu?",
    correct: "Protože správa vody a zásob vyžadovala spolupráci a řízení",
    distractors: [
      { value: "Protože lidé museli každý rok utíkat před povodněmi", why: "Záplava nebyla pohroma, přinášela úrodné bahno. Před vodou se neutíkalo, vodu bylo potřeba rozvést na pole a zásoby uložit." },
      { value: "Protože kolem hotových pyramid vyrostla první města", why: "Tady se plete příčina a důsledek. Pyramidy mohl stavět až stát, který už existoval a měl úředníky i zásoby." },
      { value: "Protože v okolní poušti bylo nejvíc zlata na světě", why: "Zlato samo stát nevytvoří. Důležitější bylo řídit vodu, sklizeň a zásoby." },
    ],
    hints: [
      "Zeptej se, k čemu Egypťané potřebovali řeku, když skoro nepršelo, a kdo to všechno musel zorganizovat.",
      "U každé možnosti ověř dvě věci: jestli sedí s tím, co víš o záplavách Nilu, a jestli nepovažuje za příčinu něco, co vzniklo až později. Pak se zeptej, co musel někdo každý rok naplánovat a jestli by to každá rodina zvládla sama.",
    ],
    explanation: "Život u Nilu závisel na záplavách. Kanály, hráze a sýpky vyžadovaly plánování a spolupráci mnoha vesnic. To byl jeden z hlavních důvodů, proč vznikla silná ústřední moc v čele s faraonem. Ke sjednocení Egypta přispělo i spojování a dobývání menších území.",
  },
  {
    q: "Faraon dokázal léta zajistit tisíce dělníků, jídlo i kámen pro jedinou pyramidu. Co z toho vyplývá?",
    correct: "Že měl obrovskou moc nad lidmi i zásobami",
    distractors: [
      { value: "Že si ho lidé zvolili na několik let", why: "Faraon nebyl volen. Vládl dědičně až do smrti a byl uctíván jako bůh." },
      { value: "Že Egypt tehdy neměl žádné úředníky a písaře", why: "Naopak. Bez úředníků by nikdo nezorganizoval jídlo a práci pro tisíce lidí." },
      { value: "Že mu pyramida sloužila jako palác k bydlení", why: "Pyramida nebyla obydlí, ale hrobka faraona pro posmrtný život." },
    ],
    hints: [
      "Představ si, kolik lidí, jídla a úředníků je potřeba na desítky let stavby. Kdo to mohl nařídit?",
      "Tak velký úkol nezvládne vůdce zvolený na pár let ani stát bez úředníků. Zamysli se, co všechno musel mít pod kontrolou ten, kdo stavbu vedl, a kolik lidí ho muselo poslechnout.",
    ],
    explanation: "Stavba pyramidy vyžadovala řízení práce, zásob a dopravy kamene po mnoho let. To zvládl jen panovník s obrovskou mocí nad celou zemí a s úředníky, kteří jeho příkazy prováděli.",
  },
  {
    q: "V hrobě chudého Egypťana našli archeologové jen hliněné nádoby se zbytky jídla. Který závěr je oprávněný?",
    correct: "Že i chudí věřili, že zemřelý bude jídlo potřebovat",
    distractors: [
      { value: "Že chudí Egypťané v posmrtný život nevěřili", why: "Právě jídlo v hrobě ukazuje opak. Rodina ho dala zemřelému, protože věřila, že ho bude potřebovat po smrti." },
      { value: "Že se nádobami platilo kněžím za pohřeb", why: "Platba kněžím by v zapečetěném hrobě nezůstala. Nádoby s jídlem byly určené zemřelému." },
      { value: "Že tak skromné hroby měli úplně všichni Egypťané", why: "Jeden hrob nevypovídá o všech. Bohatí lidé a faraoni měli hrobky plné nábytku a šperků." },
    ],
    hints: [
      "Pramen je jediný hrob. Co z něj plyne o víře rodiny a co by už bylo přehnané zobecnění?",
      "Zeptej se, proč by někdo dával zemřelému jídlo, kdyby po smrti nic nečekal. Pak ověř, jestli závěr nemluví o všech Egypťanech, když máš jediný hrob, a jestli nepřidává něco, co v hrobě vůbec není.",
    ],
    explanation: "Jídlo v hrobě dokládá, že i chudá rodina věřila v posmrtný život, ve kterém ho zemřelý bude potřebovat. Víra se tedy netýkala jen faraonů. O všech pohřbech ani o platbách kněžím ale jeden hrob nic neříká.",
  },
  {
    q: "Proč bychom bez rozluštění hieroglyfů věděli o egyptských dějinách mnohem méně?",
    correct: "Protože by nápisy a papyry zůstaly nečitelné",
    distractors: [
      { value: "Protože bez písma by nikdo nenašel pyramidy", why: "Pyramidy stojí na povrchu a lidé o nich vždy věděli. Chyběly by jen písemné zprávy." },
      { value: "Protože předměty bez nápisů o minulosti nic neřeknou", why: "Předměty bez nápisů o minulosti hodně vypovídají a archeologové je zkoumají. Bez rozluštění by chyběly jen zprávy, které Egypťané sami zapsali." },
      { value: "Protože se z Egypta nedochovaly žádné stavby", why: "Stavby a předměty se dochovaly ve velkém. Bez rozluštění bychom ale nepřečetli, co o sobě Egypťané napsali." },
    ],
    hints: [
      "Rozliš dva druhy pramenů: věci, na které se díváme, a texty, které musíme přečíst. Který druh by bez rozluštění chyběl?",
      "Pyramidy, sochy a nástroje bychom viděli i tak. Jména faraonů, zákony, dopisy a záznamy o daních jsou ale zapsané znaky, kterým bez klíče nikdo nerozumí.",
    ],
    explanation: "Hmotné prameny (stavby, předměty) by se daly zkoumat i bez písma. Písemné prameny, tedy nápisy a papyry, by ale zůstaly němé. Proto rozluštění hieroglyfů tolik rozšířilo naše poznání.",
  },
  {
    q: "Proč byli písaři v Egyptě vážení, i když většinou nepatřili ke šlechtě?",
    correct: "Protože psát umělo málo lidí a stát je potřeboval",
    distractors: [
      { value: "Protože patřili k nejbohatším lidem v zemi", why: "Písaři nebyli váženi kvůli majetku. Cenilo se, že umějí psát, což stát nutně potřeboval." },
      { value: "Protože je lidé uctívali jako syny boha Ra", why: "Jako božského vládce lidé uctívali faraona, ne písaře." },
      { value: "Protože se na písaře ve škole učil každý chlapec", why: "To je představa podle dnešních škol. Psát se v Egyptě učilo jen málo chlapců a většina lidí psát neuměla." },
    ],
    hints: [
      "Zeptej se, co písař uměl, co většina lidí neuměla, a k čemu se to hodilo úřadům faraona.",
      "Vyřaď důvody, které se neshodují s tím, co víš o egyptských úřednících, o víře a o tehdejších školách. U zbylého se zeptej, co písaři dělali každý den a jestli by je v tom mohl snadno nahradit kdokoli jiný.",
    ],
    explanation: "Psát hieroglyfy se učilo dlouhé roky a umělo to jen málo lidí. Stát bez nich nemohl evidovat daně, zásoby ani vydávat příkazy, a proto byli písaři vážení.",
  },
  {
    q: "Na stěně hrobky je malba sklizně obilí. Který závěr z ní smíme vyvodit?",
    correct: "Že se v Egyptě pěstovalo obilí a sklizeň byla důležitá",
    distractors: [
      { value: "Že zemřelý byl chudý rolník, který sám sklízel", why: "Malované hrobky si mohli dovolit bohatí lidé. Malba nedokazuje, že zemřelý sám pracoval na poli." },
      { value: "Že úroda byla každý rok stejně bohatá jako na malbě", why: "Jedna malba nemůže doložit všechny roky. Závěr přesahuje to, co pramen ukazuje." },
      { value: "Že malíř zachytil sklizeň přesně tak, jak proběhla", why: "Malba není fotografie. Malíř mohl výjev přikrášlit nebo zobrazit, jak by sklizeň měla vypadat." },
    ],
    hints: [
      "Pramen dokládá jen to, co opravdu zobrazuje. Vyřaď závěry, které jdou dál než samotná malba.",
      "Malba ukazuje lidi při sklizni, nic víc. Nezjistíš z ní, jestli zemřelý sám pracoval, jaká byla úroda v jiných letech, ani jestli malíř nic nepřikrášlil. Hledej závěr, který z výjevu přímo plyne.",
    ],
    explanation: "Z malby smíme vyvodit jen to, co opravdu zobrazuje: v Egyptě se pěstovalo a sklízelo obilí a bylo to tak důležité, že se to malovalo i do hrobek. Ostatní závěry jdou za hranici pramene.",
  },
  {
    q: "Proč Egypťané na rozdíl od Mezopotámie stavěli své velké stavby z kamene?",
    correct: "Protože u Nilu byl dostatek kvalitního kamene",
    distractors: [
      { value: "Protože u Nilu chyběla hlína na výrobu cihel", why: "Nil přinášel spoustu bahna a Egypťané z něj cihly vyráběli. Na velké stavby ale měli po ruce kámen." },
      { value: "Protože Egypťané vůbec neuměli vyrábět cihly", why: "Egypťané cihly z bahna běžně vyráběli, domy stavěli právě z nich." },
      { value: "Protože se z kamene stavělo rychleji než z cihel", why: "Z kamene se stavělo naopak pomaleji, kvádry se musely vylámat, opracovat a dopravit. Rozhodlo, že kámen měli Egypťané nablízku." },
    ],
    hints: [
      "Porovnej, jaké stavební suroviny měla v okolí Mezopotámie a jaké Egypt.",
      "Porovnej, jaké suroviny měli stavitelé v okolí každé z obou řek a co by se vyplatilo převážet zdaleka. Ověř také, jestli každá možnost souhlasí s tím, z čeho Egypťané stavěli obyčejné domy.",
    ],
    explanation: "V Egyptě byly podél Nilu lomy s vápencem a žulou a kámen se po řece dal dopravovat. V Mezopotámii kamene chybělo, proto se tam stavělo z hliněných cihel.",
  },
  {
    q: `Proč Egypťané pozorovali oblohu a sestavili kalendář, podle kterého rok trvá ${pad(365, "DEN")}?`,
    correct: "Protože potřebovali vědět, kdy přijde záplava",
    distractors: [
      { value: "Protože chtěli předpovídat bouřky a deště", why: "V Egyptě skoro nepršelo. Pro zemědělství byla rozhodující záplava Nilu." },
      { value: "Protože podle hvězd určovali, kdy stavět pyramidy", why: "Stavba pyramidy se neopakovala každý rok. Kalendář s ročním během potřebovali hlavně rolníci kvůli záplavám Nilu." },
      { value: "Protože hvězdy určovaly příštího faraona", why: "Faraon vládl dědičně, hvězdy o nástupci nerozhodovaly. Kalendář sloužil zemědělství." },
    ],
    hints: [
      "Zeptej se, na čem v Egyptě nejvíc záviselo, kdy sít a kdy sklízet.",
      "Zeptej se, co musel rolník každý rok naplánovat a na čem to v zemi téměř bez deště záviselo. Pak vyřaď důvody, které se neopakovaly pravidelně každý rok, nebo které odporují tomu, jak se faraon dostal na trůn.",
    ],
    explanation: "Celý zemědělský rok řídila záplava Nilu. Egypťané proto pozorovali oblohu, zjistili, že se záplava vrací zhruba po roce, a sestavili kalendář, podle kterého se připravovali na setí i sklizeň.",
  },
  {
    q: "Hrobka Tutanchamona byla roku 1922 nalezena téměř nevykradená. Co z toho vyplývá pro historiky?",
    correct: "Že mohli poznat faraonův pohřeb s téměř celou výbavou",
    distractors: [
      { value: "Že Tutanchamon byl nejmocnější faraon egyptských dějin", why: "Slávu mu přinesl objev hrobky, ne jeho moc. Vládl krátce a zemřel mladý." },
      { value: "Že Egypťané hrobky svých faraonů nevykrádali", why: "Většina hrobek byla vykradena už ve starověku. I do této vnikli vykradači krátce po pohřbu, ale většina pokladu zůstala." },
      { value: "Že v Údolí králů už nejsou žádné další hrobky", why: "Jeden objev nedokazuje, že jinde nic není. Z nálezu plyne jen to, co v hrobce bylo." },
    ],
    hints: [
      "Rozliš, co nález opravdu dokládá a co by bylo přehnané zobecnění.",
      "Většinu hrobek vykradači dávno vyprázdnili. Zamysli se, co mohli badatelé zkoumat v hrobce, kde zůstalo skoro všechno na svém místě, a vyřaď závěry o celých dějinách nebo celém údolí.",
    ],
    explanation: "Téměř nevykradená hrobka dala historikům vzácnou příležitost vidět skoro celou výbavu faraonova pohřbu. Neplyne z ní, že Tutanchamon byl mocný, ani že se hrobky nevykrádaly.",
  },
  {
    q: "Proč Egypťané faraona poslouchali a plnili jeho příkazy?",
    correct: "Protože vládl dědičně a uctívali ho jako boha",
    distractors: [
      { value: "Protože ho lidé zvolili jako nejstatečnějšího válečníka", why: "Faraon nebyl volen. Trůn se dědil v rodině a lidé panovníka uctívali jako boha." },
      { value: "Protože si moc zasloužil až stavbou pyramid", why: "Tady se plete příčina a důsledek. Pyramidu mohl stavět jen faraon, který moc už měl." },
      { value: "Protože jako jediný v zemi vlastnil zbraně", why: "Zbraně měli i vojáci. Poslušnost vycházela z víry, že faraon je bůh." },
    ],
    hints: [
      "Zeptej se, jak se člověk stal faraonem a za koho ho lidé považovali.",
      "U každé možnosti rozliš, jestli popisuje, odkud se moc vzala, nebo co faraon s mocí teprve dokázal. Ověř také, jestli sedí s tím, co víš o nástupnictví na trůn a o víře Egypťanů.",
    ],
    explanation: "Faraon vládl dědičně a Egypťané ho považovali za boha na zemi. Poslušnost vůči němu byla i náboženskou povinností, proto nepotřeboval žádnou volbu.",
  },
  {
    q: "Egypťané dávali zemřelým do hrobu svitky s modlitbami pro soud boha Osirise. Který závěr je oprávněný?",
    correct: "Že věřili v život po smrti a v posouzení činů",
    distractors: [
      { value: "Že se zemřelí měli v hrobě učit číst", why: "Svitky nebyly učebnice. Měly zemřelému pomoci obstát na soudu v podsvětí." },
      { value: "Že svitek zaručil úspěch na soudu každému zemřelému", why: "Pramen ukazuje jen, že se o úspěch snažili. Soud znamenal, že se činy posuzují, a výsledek jistý nebyl." },
      { value: "Že modlitby chránily hrob před záplavou", why: "Hrobky ležely mimo dosah záplav. Modlitby se týkaly soudu po smrti." },
    ],
    hints: [
      "Zeptej se, k čemu by zemřelý potřeboval modlitby, kdyby po smrti nic nečekal.",
      "Soud znamená, že se někdo posuzuje. Z pramenu plyne jen víra, kterou svitky prozrazují. Vyřaď závěry, které mluví o škole, o vodě nebo o výsledku, který by pramen nemohl zaručit.",
    ],
    explanation: "Svitky s modlitbami pro soud dokládají, že Egypťané věřili v život po smrti, kde se posuzuje, jak člověk žil. Jiné závěry z takového pramenu neplynou.",
  },
  {
    q: "Proč by samotné hieroglyfy bez řeckého textu na Rosettské desce k rozluštění nestačily?",
    correct: "Protože neznámé znaky nebylo s čím porovnat",
    distractors: [
      { value: "Protože hieroglyfy nejsou písmo, jen ozdobné obrázky", why: "Hieroglyfy jsou písmo, znaky označují slova i hlásky. Potíž byla v tom, že je nikdo neuměl číst." },
      { value: "Protože se znaky daly číst jen s egyptským slovníkem", why: "Slovník hieroglyfů tehdy neexistoval, vznikl až po rozluštění. Badatelé museli znaky nejdřív porovnat se známým textem." },
      { value: "Protože by bez překladu nikdo nepoznal stáří desky", why: "Stáří předmětu se dá určit i bez čtení nápisu. Otázka je, jak zjistit, co znamenají neznámé znaky." },
    ],
    hints: [
      "Představ si text v písmu, které nikdo na světě neumí. Jak se dá zjistit, co znamená?",
      "Rozliš, co je potřeba ke čtení neznámého písma a co s tím nesouvisí, třeba stáří předmětu. Ověř také, jestli možnost souhlasí s tím, co víš o hieroglyfech. Zamysli se, jak luštíš šifru a co ti při tom nejvíc pomůže.",
    ],
    explanation: "Samotné hieroglyfy nikdo neuměl přečíst a nebylo je s čím srovnat. Teprve tentýž text v řečtině, kterou badatelé znali, umožnil Champollionovi porovnávat jména a slova a zjistit, co znaky znamenají. Slovník hieroglyfů vznikl až po rozluštění.",
  },
  {
    q: "Proč Egypťané žili a hospodařili hlavně v úzkém pruhu podél řeky, a ne v poušti?",
    correct: "Protože jen tam byla voda a úrodná půda z bahna",
    distractors: [
      { value: "Protože v poušti hrozily ničivé povodně", why: "Povodně se týkaly okolí řeky, ne pouště. U řeky se naopak žilo kvůli vodě a bahnu." },
      { value: "Protože faraon lidem zakázal usazovat se v poušti", why: "Žádný takový zákaz nebyl potřeba. V poušti chyběla voda a úrodná půda, takže se tam hospodařit nedalo." },
      { value: "Protože řeka chránila města před nepřáteli", why: "Před nepřáteli Egypt chránila spíš poušť. K řece lidi táhla voda a úroda." },
    ],
    hints: [
      "Co člověk potřebuje, aby vypěstoval jídlo? Porovnej, kde to v Egyptě bylo a kde ne.",
      "Rozliš důvody, které vycházejí z přírody, od těch, které by musel někdo nařídit. Pak ověř, jestli každá možnost sedí s tím, co víš o záplavách Nilu a o tom, co Egypt chránilo před nepřáteli.",
    ],
    explanation: "Mimo okolí Nilu byla jen suchá poušť. Pole a sídla se proto soustředila do úzkého pruhu u řeky, kde byla voda a úrodné bahno po záplavách.",
  },
  {
    q: "Lékaři vyšetřili egyptskou mumii a zjistili její věk a nemoci. Který závěr z toho smí historik vyvodit?",
    correct: "Že poznal zdraví jednoho člověka z té doby",
    distractors: [
      { value: "Že všichni Egypťané měli stejné nemoci", why: "Jedna mumie nevypovídá o všech lidech. To by bylo přehnané zobecnění." },
      { value: "Že mumifikace trestala zemřelého za jeho zlé činy", why: "Mumifikace nebyla trest, ale příprava těla pro posmrtný život." },
      { value: "Že z těla zjistil i jméno a povolání toho člověka", why: "Z vyšetření těla se jméno ani povolání zjistit nedá. To by musel doložit jiný pramen, například nápis na rakvi." },
    ],
    hints: [
      "Kolik lidí vyšetření zkoumalo? Z toho odvoď, jak široký závěr je oprávněný.",
      "Pramen tu je tělo jediného člověka. Vyřaď závěry, které mluví o celém národě, i ty, které mumii přisuzují jiný účel nebo z těla vyčtou víc, než samo může prozradit.",
    ],
    explanation: "Mumie je hmotný pramen o jednom konkrétním člověku. Historik z ní pozná jeho věk a nemoci, ale neoprávněně by z ní usuzoval na zdraví všech Egypťanů.",
  },
  {
    q: "Egypťané vedli v sýpkách přesné záznamy o sklizni a daních. Co z toho vyplývá o jejich státu?",
    correct: "Že měl úředníky a přehled o zásobách v zemi",
    distractors: [
      { value: "Že si rolníci nechávali celou úrodu", why: "Záznamy o daních dokládají opak: část úrody se odváděla státu." },
      { value: "Že se obilí v Egyptě nesmělo prodávat ani vyměňovat", why: "Záznamy o zásobách nic takového nedokládají. Ukazují, že stát vedl evidenci." },
      { value: "Že v Egyptě uměl každý rolník číst a psát", why: "Záznamy psali úředníci, kteří se psaní léta učili. Většina rolníků psát neuměla." },
    ],
    hints: [
      "Kdo musel záznamy psát a k čemu je stát mohl potřebovat?",
      "Přesné záznamy nepíše každý a nevznikají bez důvodu. Z pramenu plyne jen to, co dokládá: někdo zapisoval, kolik obilí přišlo a kolik ho zbývá, a podle toho mohl stát plánovat.",
    ],
    explanation: "Záznamy o sklizni a daních dokládají, že stát měl gramotné úředníky a sledoval, kolik zásob má. Díky tomu mohl živit dělníky a přečkat slabší roky.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function zBanky(pool: Polozka[]): PracticeTask[] {
  let i = 0;
  return ruzneUlohy(() => vytvor(pool[i++ % pool.length]), pool.length, pool.length);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(POOL_L1);
  if (level === 2) return zBanky(POOL_L2);
  return zBanky(POOL_L3);
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const STAROVEKY_EGYPT: TopicMetadata[] = [
  {
    id: "g6-dej-staroveky-egypt-6",
    rvpNodeId:
      "g6-dejepis-starovek-nejstarsi-staty-mezopotamie-a-egypt-staroveky-egypt-faraoni-pyramidy-hieroglyfy",
    displayName: "Starověký Egypt",
    title: "Starověký Egypt - faraoni, pyramidy, hieroglyfy",
    studentTitle: "Starověký Egypt",
    subject: "dejepis",
    category: "Starověk",
    topic: "Nejstarší státy - Mezopotámie a Egypt",
    briefDescription: "Poznáš faraony, pyramidy a hieroglyfy a vysvětlíš, proč Egypt vzkvétal u Nilu.",
    keywords: [
      "Egypt", "starověký Egypt", "Nil", "faraon", "pyramida", "mumie", "hieroglyfy",
      "papyrus", "písař", "sfinga", "Rosettská deska", "Champollion", "Tutanchamon",
    ],
    goals: [
      "Poznat základní reálie starověkého Egypta a odlišit je od Mezopotámie.",
      "Vysvětlit, k čemu sloužily pyramidy, mumifikace a písmo.",
      "Zdůvodnit, proč stát vznikl u Nilu a z čeho plynula moc faraona.",
    ],
    boundaries: [
      "Jen nesporná fakta z učebnic 6. ročníku; žádné přesné datace Staré, Střední a Nové říše.",
      "Tvrzení „pyramidy stavěli otroci“ se nepoužívá.",
      "Mezopotámie jen jako zdroj záměn, ne jako samostatné učivo.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Egypt = Nil, faraon, pyramidy, hieroglyfy, papyrus. Mezopotámie = Eufrat a Tigris, zikkurat, klínové písmo, Chammurapi.",
      steps: [
        "Zkontroluj, jestli možnost nepatří Mezopotámii.",
        "Zeptej se, k čemu věc sloužila (hrobka, písmo, zavlažování).",
        "U „proč“ hledej příčinu, která vysvětluje, ne jen popisuje.",
      ],
      commonMistake: "Přiřadit Egyptu klínové písmo nebo zikkurat, brát pyramidu jako palác a nilskou záplavu jako pohromu.",
      example: "Pyramida byla hrobka faraona, protože Egypťané věřili v posmrtný život.",
    },
  },
];
