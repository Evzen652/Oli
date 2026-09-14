/**
 * Dějepis 6. ročník — Lovci mamutů, Věstonická venuše (select_one).
 *
 * Faktické téma: z nálezů z Dolních Věstonic a Pavlova usoudit, jak žili lovci
 * mamutů v mladém paleolitu na jižní Moravě. Venuše je důkaz, ne kvíz na letopočet.
 *
 * Stavba podle zlatého vzoru `periodizaceLetopocet.ts`, jen s bankami místo
 * výpočtu: disjunktní POOL_L1 / POOL_L2 / POOL_L3 (každý 15 položek).
 * Unikátnost je deterministická (vzor `ruzneUlohy()`): úloha = položka banky
 * × rotace pořadí možností, žádné losování.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • záměna epochy — lovcům přiřadit zemědělství, chov, hrnce, kovy, vesnice;
 *  • materiálová záměna — venuše z kamene / z mamutoviny / z nepálené hlíny;
 *  • doslovné čtení symbolu — portrét, hračka, římská bohyně Venuše;
 *  • časová zkratka — řád stáří, souběh s písmem či neandertálcem.
 *
 *  • L1 — zapamatování: přímá fakta z jedné věty.
 *  • L2 — použití: popsaný nález nebo situace → účel, materiál, co lovci nemohli.
 *  • L3 — analýza: proč, co z toho plyne (pohřeb, otisky tkanin), jediný nález, který by tvrzení vyvrátil.
 *
 * Fakta jen ta, na kterých se shodují učebnice 6. ročníku; stáří vždy s „asi“.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { form } from "@/lib/czechGrammar";
import { buildChoiceTask as choice, type Distractor } from "./_shared";

/** Počet let s oddělenými tisíci a tvarem podle czechGrammar („25 000 let“). */
const let_ = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${form(n, "ROK")}`;

interface Polozka {
  q: string;
  key: string;
  d: [Distractor, Distractor, Distractor];
  hints: [string, string];
  explanation: string;
}

// ── L1 — zapamatování ────────────────────────────────────────────────────
const POOL_L1: Polozka[] = [
  {
    q: "Z jakého materiálu je vyrobena Věstonická venuše?",
    key: "z pálené hlíny s popelem z kostí",
    d: [
      { value: "z vápence vytesaného pazourkem", why: "Kamenné jsou jiné pravěké sošky, třeba ta z rakouského Willendorfu. Věstonická venuše je vypálená keramická hmota." },
      { value: "z vyřezaného mamutího klu", why: "Z mamutoviny lovci vyřezávali ozdoby i sošky, ale venuše je vypálená hlína s práškem z kostí." },
      { value: "z hlíny jen sušené na slunci", why: "Sušená hlína by se za tisíce let rozpadla. Venuše prošla ohněm, a proto je nejstarším známým užitím pálené hlíny." },
    ],
    hints: [
      "Vzpomeň si, proč se o sošce říká, že je výjimečná i v dějinách techniky, a ne jen v dějinách umění.",
      "Mnoho pravěkých sošek je z kamene nebo z mamutoviny. Věstonická se od nich liší tím, jak vznikla. Zeptej se, jestli hmota sošky prošla ohněm a co do ní lovci přimíchali.",
    ],
    explanation: "Věstonická venuše je z pálené hlíny, do které byl přimíchán popel nebo prášek z kostí. Je to nejstarší známé užití vypálené keramické hmoty, a proto je soška tak výjimečná.",
  },
  {
    q: "Pod kterým pohořím leží naleziště nejslavnější pravěké sošky z našeho území?",
    key: "pod Pálavou na jižní Moravě",
    d: [
      { value: "pod Sněžkou v Krkonoších", why: "Krkonoše leží na severu Čech. Tábořiště lovců se soškou leží na jižní Moravě u řeky Dyje." },
      { value: "pod Řípem ve středních Čechách", why: "Říp je spojený s pověstí o praotci Čechovi, ne s nálezy lovců mamutů." },
      { value: "pod Beskydami na severní Moravě", why: "Morava je správně, ale sever ne. Naleziště leží na jihu Moravy, u Dolních Věstonic." },
    ],
    hints: [
      "Soška nese jméno obce, u které byla nalezena. Najdi si tu obec na mapě a podívej se, jaké kopce se nad ní zvedají.",
      "Obec leží u vodních nádrží na řece Dyji. Nad ní se zvedají vápencové kopce, které jsou chráněnou krajinnou oblastí. Jak se ty kopce jmenují?",
    ],
    explanation: "Dolní Věstonice i Pavlov leží pod Pálavou na jižní Moravě. Stáda zvěře tu táhla údolím Dyje, a proto tu lovci mamutů tábořili.",
  },
  {
    q: "Ve kterém období archeologové Věstonickou venuši objevili?",
    key: "v první polovině dvacátého století",
    d: [
      { value: "ve středověku za Karla IV.", why: "Ve středověku se pravěké nálezy soustavně nekopaly a archeolog, který vykopávky vedl, tehdy ještě nežil." },
      { value: "v osmnáctém století za Marie Terezie", why: "Za Marie Terezie se u nás archeologické vykopávky ještě nevedly. Vedoucí výzkumu se narodil až o sto let později." },
      { value: "na počátku jednadvacátého století", why: "Na počátku 21. století byla soška už desítky let v muzeu. Našla se mnohem dřív." },
    ],
    hints: [
      "Rozliš dvě různé věci: kdy soška vznikla a kdy ji někdo vykopal. Otázka se ptá na to druhé.",
      "Vykopávky vedl archeolog Karel Absolon, který se narodil roku 1877. Spočítej, ve kterém období mohl jako dospělý muž výzkum vést, a porovnej to s nabídkou.",
    ],
    explanation: `Věstonickou venuši našli roku 1925, tedy v první polovině dvacátého století, při vykopávkách, které vedl Karel Absolon (narozen 1877). Samotná soška je ale mnohem starší, asi ${let_(25000)}.`,
  },
  {
    q: "Do kterého období pravěku patří tábořiště z Dolních Věstonic a Pavlova?",
    key: "do starší doby kamenné (paleolitu)",
    d: [
      { value: "do mladší doby kamenné (neolitu)", why: "V neolitu už lidé pěstovali obilí a žili ve vesnicích. Lovci z Dolních Věstonic žili dávno předtím." },
      { value: "do doby bronzové (věku kovů)", why: "Kovy lidé začali zpracovávat až tisíce let po lovcích mamutů. Na tábořištích není jediný kovový předmět." },
      { value: "do doby železné (doby Keltů)", why: "Keltové přišli až v době železné. Lovci mamutů žili o desítky tisíc let dřív." },
    ],
    hints: [
      "Podívej se, z čeho byly nástroje z tábořišť: z kamene, nebo z kovu? A lidé tam lovili, nebo pěstovali obilí?",
      "Pravěk dělíme podle materiálu nástrojů na dobu kamennou a dobu kovů. Doba kamenná má starší část s lovci a sběrači a mladší část se zemědělci. Rozhodni, do které části patří lidé, kteří lovili mamuty.",
    ],
    explanation: "Lovci mamutů žili ve starší době kamenné (paleolitu), přesněji v jejím mladém úseku. Žili z lovu a sběru, nástroje měli z kamene, kostí a parohů. Zemědělství ani kovy ještě neznali.",
  },
  {
    q: "Jaké přibližné stáří odborníci přisuzují Věstonické venuši?",
    key: `asi ${let_(25000)}`,
    d: [
      { value: `asi ${let_(2500)}`, why: "Posunul ses o celý řád. Tolik let je stará třeba doba Keltů. Soška je asi desetkrát starší." },
      { value: `asi ${let_(250000)}`, why: "Tak dávno žili v Evropě starší druhy lidí, ne člověk dnešního typu, který venuši vytvořil." },
      { value: `asi ${let_(500)}`, why: "Tolik let je stará gotická katedrála, ne pravěká soška. Soška pochází z doby ledové." },
    ],
    hints: [
      "Stáří sošky odhadni podle řádu: je to stovky, tisíce, desítky tisíc, nebo stovky tisíc let?",
      "Použij kotvy na časové ose: písmo vzniklo asi před pěti tisíci lety, neandertálci v Evropě vymřeli asi před čtyřiceti tisíci lety. Soška je mladší než neandertálci, ale starší než písmo. Která možnost do tohoto rozmezí padne?",
    ],
    explanation: `Věstonická venuše je stará asi ${let_(25000)} (učebnice uvádějí 25 až 29 tisíc). Je tedy o celé desítky tisíc let starší než písmo i první zemědělci.`,
  },
  {
    q: "Kterou zvěř lovci pod Pálavou lovili kromě mamutů?",
    key: "soby a divoké koně",
    d: [
      { value: "ovce a kozy z vlastních stád", why: "Ovce a kozy chovali až zemědělci v mladší době kamenné. Lovci doby ledové žádná stáda neměli." },
      { value: "srnce a divočáky z listnatých lesů", why: "Srnci a divočáci patří do listnatých lesů, které se rozšířily hlavně po oteplení. Ve stepi doby ledové se pásla jiná zvířata." },
      { value: "domácí koně a tury", why: "Divoké koně lovci opravdu lovili, ale koně ani tury tehdy nikdo nechoval. Domestikace přišla o mnoho tisíc let později." },
    ],
    hints: [
      "Na tábořištích leží kromě mamutích i kosti dalších zvířat. Zamysli se, která zvířata žila v chladné stepi doby ledové.",
      "U každé dvojice se zeptej: 1) chovali tato zvířata lidé doma? 2) žijí v otevřené chladné krajině, nebo v teplém listnatém lese? Obojí porovnej s tím, co víš o době ledové.",
    ],
    explanation: "Kromě mamutů lovci pod Pálavou lovili hlavně soby a divoké koně, kteří se pásli ve stepi doby ledové. Domácí zvířata ještě nikdo nechoval a zvěř listnatých lesů se rozšířila až po oteplení.",
  },
  {
    q: "Který druh člověka zanechal tábořiště a sošky pod Pálavou?",
    key: "člověk dnešního typu (Homo sapiens)",
    d: [
      { value: "neandertálec z dávné doby ledové", why: "Neandertálci v Evropě vymřeli dřív, než soška vznikla. Tábořiště zanechal člověk dnešního typu." },
      { value: "zručný člověk (Homo habilis)", why: "Zručný člověk žil před více než milionem let v Africe, ne na Moravě." },
      { value: "vzpřímený člověk (Homo erectus)", why: "Vzpřímený člověk žil statisíce let před lovci mamutů. Umělecké sošky vytvořil až člověk dnešního typu." },
    ],
    hints: [
      "Soška je umělecké dílo z doby ledové. Zamysli se, které druhy lidí v té době po Evropě ještě chodily.",
      `Seřaď nabízené druhy na časové ose podle toho, kdy žili, a porovnej je se stářím sošky (asi ${let_(25000)}). Ověř u každého, jestli se jeho doba se vznikem sošky překrývá.`,
    ],
    explanation: "Lovci mamutů pod Pálavou patřili k člověku dnešního typu (Homo sapiens), tedy ke stejnému druhu jako my. Starší druhy lidí tu v té době už nežily.",
  },
  {
    q: "Co je Věstonická venuše?",
    key: "malá soška ženské postavy",
    d: [
      { value: "malá soška mamuta z hlíny", why: "Figurky zvířat se v Dolních Věstonicích a Pavlově našly také, ale venuše zobrazuje ženu." },
      { value: "kamenný hrot oštěpu", why: "Hroty byly nástroje k lovu. Venuše je umělecké dílo, soška." },
      { value: "zdobená hliněná nádoba", why: "Hliněné nádoby přišly až se zemědělci v neolitu. Venuše je soška, ne nádoba." },
    ],
    hints: [
      "Rozliš tři druhy nálezů z tábořišť: nástroje na lov a práci, nádoby a umělecká díla. Kam patří Věstonická venuše?",
      "Nástroj má ostří nebo hrot, nádoba má dutinu. Když víš, o jaký druh předmětu jde, vzpomeň si na obrázek z učebnice a rozhodni, co přesně zobrazuje.",
    ],
    explanation: "Věstonická venuše je malá soška ženské postavy. Jméno dostala podle římské bohyně krásy Venuše, ale s Římany nemá nic společného. Je o desítky tisíc let starší.",
  },
  {
    q: "Ve kterém muzeu je Věstonická venuše dnes uložena?",
    key: "v Moravském muzeu v Brně",
    d: [
      { value: "v Národním muzeu v Praze", why: "Národní muzeum je největší české muzeum, ale venuše patří do sbírek na Moravě, kde byla nalezena." },
      { value: "v Přírodovědném muzeu ve Vídni", why: "Ve Vídni je uložena Willendorfská venuše z Rakouska, ne ta z Dolních Věstonic." },
      { value: "v muzeu Louvre v Paříži", why: "Louvre je slavný, ale Věstonická venuše zůstala v Česku, v zemi, kde byla nalezena." },
    ],
    hints: [
      "Soška zůstala v zemi, kde se našla. Ve které části Česka leží Dolní Věstonice?",
      "Významné nálezy obvykle zůstávají v zemském muzeu té části republiky, kde byly nalezeny. Podle toho posuď každé muzeum z nabídky.",
    ],
    explanation: "Věstonická venuše je uložena v Moravském muzeu v Brně. Kvůli křehkosti se vystavuje jen výjimečně, běžně se ukazuje její kopie.",
  },
  {
    q: "Kde leží naleziště Pavlov?",
    key: "u Dolních Věstonic na jižní Moravě",
    d: [
      { value: "u Prahy ve středních Čechách", why: "Pavlov neleží v Čechách. Je to obec pod Pálavou na jižní Moravě." },
      { value: "v Moravském krasu u Blanska", why: "V Moravském krasu jsou jeskyně s pravěkými nálezy, ale Pavlov leží jižněji, pod Pálavou." },
      { value: "na Šumavě v jižních Čechách", why: "Na Šumavě se tábořiště lovců mamutů nenacházejí. Pavlov je na jižní Moravě." },
    ],
    hints: [
      "Pavlov a nejslavnější naleziště venuše jsou tak blízko, že se o nich mluví jedním dechem. Kde leží to druhé?",
      "Obě obce leží vedle sebe pod vápencovými kopci Pálavy u řeky Dyje. Najdi mezi možnostmi tu, která uvádí sousední obec i správnou část republiky.",
    ],
    explanation: "Pavlov leží hned vedle Dolních Věstonic pod Pálavou na jižní Moravě. Obě naleziště patří ke stejné kultuře lovců mamutů.",
  },
  {
    q: "Který archeolog vedl vykopávky, při nichž se Věstonická venuše našla?",
    key: "Karel Absolon",
    d: [
      { value: "Jindřich Wankel", why: "Jindřich Wankel zkoumal jeskyně Moravského krasu, třeba Býčí skálu, a zemřel dávno před nálezem venuše." },
      { value: "Bohuslav Klíma", why: "Bohuslav Klíma v Dolních Věstonicích a Pavlově opravdu kopal, ale až po druhé světové válce. Venuše se našla dřív." },
      { value: "Jiří Svoboda", why: "Jiří Svoboda zkoumá Pavlov a Dolní Věstonice od konce 20. století, dlouho po nálezu venuše." },
    ],
    hints: [
      "Pod Pálavou kopalo víc archeologů v různých dobách. Rozhoduje, kdo vedl výzkum právě tehdy, když se venuše našla.",
      "Nález se připisuje vedoucímu výzkumu. Vzpomeň si, se kterým muzeem je soška spojená a který jeho badatel pod Pálavou kopal v první polovině 20. století.",
    ],
    explanation: "Vykopávky v Dolních Věstonicích vedl archeolog Karel Absolon z Moravského muzea, venuše se našla roku 1925. Bohuslav Klíma a Jiří Svoboda zkoumali naleziště až později, Jindřich Wankel dříve a jinde.",
  },
  {
    q: "Z jaké suroviny lovci štípali ostré čepele nožů a škrabadel?",
    key: "z pazourku a jiných tvrdých kamenů",
    d: [
      { value: "z bronzu odlitého do hliněných forem", why: "Bronz se začal odlévat až tisíce let po lovcích mamutů. Na tábořištích pod Pálavou není jediný kovový předmět." },
      { value: "ze železa vykovaného nad ohněm", why: "Železo přišlo ještě později než bronz, až v době Keltů. Lovci mamutů kov vůbec neznali." },
      { value: "z pálené hlíny tvrzené v ohni", why: "Pálená hlína je křehká a ostří z ní neudržíš. Venuše z ní je, ale nástroje se štípaly z kamene." },
    ],
    hints: [
      "Slovo štípat napovídá: surovina se musela lámat na ostré hrany. Který materiál se tak dá opracovat?",
      "Doba se jmenuje podle materiálu, ze kterého lidé dělali nástroje. Kovy lovci ještě neznali a hlína se na ostří nehodí. Vyber tvrdou horninu, která se štípe na ostré úlomky.",
    ],
    explanation: "Čepele a škrabadla lovci štípali z pazourku a jiných tvrdých kamenů. Kovy přišly až o mnoho tisíc let později, proto se tomu období říká doba kamenná.",
  },
  {
    q: "Jaký pohřební zvyk dokládají hroby lidí z tábořišť pod Pálavou?",
    key: "posypání zemřelého červeným okrem",
    d: [
      { value: "spálení těla a uložení popela do urny", why: "Spalování mrtvých a ukládání popela do uren přišlo až o mnoho tisíc let později, rozšířilo se hlavně v době bronzové. Lovci mamutů své mrtvé nespalovali." },
      { value: "uložení mumie do kamenné pyramidy", why: "Mumie a pyramidy patří starověkému Egyptu, který vznikl o desítky tisíc let později." },
      { value: "navršení vysoké kamenné mohyly", why: "Mohyly stavěli lidé až v pozdějších obdobích pravěku. V hrobech lovců se našla kostra s barvivem." },
    ],
    hints: [
      "Každý z nabízených zvyků zanechává v hrobě jinou stopu. Zamysli se, který z nich patří do doby ledové, a ne do pozdějších období nebo jiných krajů.",
      "Vylučuj podle doby: lovci mamutů neznali kovy, nestavěli velké stavby a nežili ve státě s vládci. U každého zvyku se zeptej, jestli ho bez těchto věcí mohli dodržovat.",
    ],
    explanation: "Lovci mamutů své mrtvé pohřbívali a posypávali je červeným okrem (barvivem z hlinky). Urny, mohyly i pyramidy patří až pozdějším obdobím.",
  },
  {
    q: "Jaké podnebí panovalo na jižní Moravě v době lovců mamutů?",
    key: "chladné podnebí doby ledové",
    d: [
      { value: "teplé a vlhké podnebí s pralesy", why: "Teplo a lesy přišly až po skončení doby ledové. Mamuti žili v chladné stepi." },
      { value: "suché pouštní podnebí s oázami", why: "Poušť není krajina mamutů. Mamut měl hustou srst, protože žil v chladu." },
      { value: "mírné podnebí vhodné pro pole", why: "Mírné podnebí přišlo až po skončení doby ledové. Mamuti žili v chladné stepi." },
    ],
    hints: [
      "Podívej se na mamuta: měl hustou dlouhou srst a vrstvu tuku. V jakém podnebí se takové zvíře hodí?",
      "Porovnej mamuta s dnešními zvířaty: hustou srst a tukovou vrstvu mají zvířata ze severu, ne z pouště ani z pralesa. Z toho odvoď, jaké bylo tehdy na Moravě počasí.",
    ],
    explanation: "Lovci mamutů žili v chladném podnebí doby ledové. Krajina byla step s řídkými lesíky u řek, ve které se pásla stáda mamutů, sobů a koní.",
  },
  {
    q: "Jak se živili lidé na tábořištích pod Pálavou?",
    key: "lovem zvěře a sběrem plodů",
    d: [
      { value: "pěstováním obilí a chovem ovcí", why: "Obilí a ovce přinesli na Moravu až první zemědělci v mladší době kamenné, dlouho po lovcích mamutů." },
      { value: "obchodem s bronzovými nástroji", why: "Bronz ještě nikdo neuměl vyrobit. Lovci mamutů žili z toho, co ulovili a nasbírali." },
      { value: "rybolovem na mořském pobřeží", why: "V té době jižní Morava u moře neležela. Lidé tu lovili hlavně velkou zvěř stepi." },
    ],
    hints: [
      "Podívej se, co archeologové na tábořištích našli, a zeptej se, jaký způsob obživy tyto nálezy dokládají.",
      "U každé možnosti se zeptej: znali to už lidé doby ledové, nebo to přišlo až s poli, stády a kovy? A dá se to dělat tam, kde tehdy jižní Morava ležela?",
    ],
    explanation: "Lidé pod Pálavou žili z lovu zvěře a ze sběru plodů. Zemědělství a chov zvířat přišly až v mladší době kamenné.",
  },
];

// ── L2 — použití ─────────────────────────────────────────────────────────
const POOL_L2: Polozka[] = [
  {
    q: "Archeologové našli na tábořišti pod Pálavou kruh velkých mamutích kostí a klů zapuštěných do země. K čemu nejspíš sloužil?",
    key: "jako zpevnění spodku obydlí z kůží",
    d: [
      { value: "jako ohrada pro chovaná zvířata", why: "Zvířata lovci nechovali, lovili je. Ohrady pro dobytek stavěli až zemědělci." },
      { value: "jako pec na tavení kovů", why: "Kovy lovci mamutů neznali. Tavení přišlo až v době bronzové." },
      { value: "jako hrob pod kamennou mohylou", why: "V kruhu nejsou lidské kosti, ale mamutí. Mohyly se stavěly až v pozdějších obdobích." },
    ],
    hints: [
      "Kosti leží v kruhu a jsou zapuštěné do země. Zamysli se, jaká stavba má kruhový půdorys.",
      "Uvnitř kruhu nejsou lidské kosti ani stopy po kovu. Představ si stan z kůží natažených na dřevěných kůlech ve větrné stepi. K čemu by se hodily těžké a pevné kosti?",
    ],
    explanation: "Kosti a kly zatěžovaly a zpevňovaly stěny chýše z kůží natažených na kůlech. Dřeva bylo ve stepi méně, kostí z ulovených mamutů dost.",
  },
  {
    q: "Archeologové našli tenký kostěný předmět s ouškem na tupém konci. K čemu ho lovec potřeboval?",
    key: "k sešívání oděvů z kůží",
    d: [
      { value: "k vrtání dírek do mamutích klů", why: "Kost je na vrtání do klu příliš měkká a ouško by při tom k ničemu nebylo. Ouško slouží k provlečení šlachy." },
      { value: "k zapínání bronzové spony", why: "Bronz lovci neznali. Kostěná jehla s ouškem sloužila k šití." },
      { value: "k vyrývání znaků písma", why: "Písmo vzniklo až o desítky tisíc let později. Ouško slouží k provlečení nitě." },
    ],
    hints: [
      "Proč má předmět ouško? Co se jím asi provlékalo?",
      "Předmět s ouškem a hrotem známe i dnes. Lovci neměli vlnu ani len z polí. Oděvy šili hlavně z kůží, které spojovali šlachami. Jakou práci by takový předmět umožnil?",
    ],
    explanation: "Je to kostěná jehla. Lovci jí sešívali oděvy z kůží, ouškem provlékali šlachu. Ovčí vlnu a len z polí přinesli až zemědělci.",
  },
  {
    q: "Na tábořišti leží ostré štípané čepele z pazourku a vedle nich zvířecí kosti se zářezy. Co s čepelemi lovci dělali?",
    key: "porcovali maso a stahovali kůže",
    d: [
      { value: "sklízeli jimi zralé obilí", why: "Obilí se tu začalo pěstovat až v mladší době kamenné. Na tábořištích lovců nejsou zrna, jen kosti zvěře se zářezy." },
      { value: "brousili jimi bronzové hroty", why: "Bronz lovci neznali a pazourek se na broušení kovu nepoužíval." },
      { value: "řezali trámy na stavbu domů", why: "Tenká pazourková čepel se na trámy nehodí a domy z trámů lovci nestavěli." },
    ],
    hints: [
      "Všimni si, co leží hned vedle čepelí: kosti se zářezy. Co musel lovec udělat s ulovenou zvěří?",
      "Zářezy na kostech vznikají, když ostří sjede po kosti při oddělování masa. Vyber činnost, při které se s ulovenou zvěří pracuje ostrým nožem.",
    ],
    explanation: "Pazourkové čepele sloužily jako nože: lovci jimi porcovali maso a stahovali kůže. Zářezy na kostech jsou stopy právě po této práci.",
  },
  {
    q: "Lovec potřeboval nový teplý oděv na zimu. Z jakého materiálu si ho mohl vyrobit?",
    key: "z kožešin a kůží ulovené zvěře",
    d: [
      { value: "z vlněné látky z ovčí srsti", why: "Ovce k nám přivedli až zemědělci v mladší době kamenné. Lovci mamutů vlnu neměli." },
      { value: "z plátna ze lnu vypěstovaného na poli", why: "Len se pěstuje na poli a pole měli až zemědělci. Teplý zimní oděv lovci šili z kožešin." },
      { value: "z kovových plátů spojených nýty", why: "Kovy lovci neznali. Oděv si dělali z toho, co jim dala ulovená zvěř." },
    ],
    hints: [
      "Zeptej se, jestli lidé té doby už chovali ovce a pěstovali len. Pokud ne, odkud brali materiál?",
      "Ovce, len i kov přišly až tisíce let po době ledové. Lovec měl k dispozici jen to, co mu dal lov. Která část zvířete hřeje?",
    ],
    explanation: "Lovec si oděv šil z kožešin a kůží ulovené zvěře. Vlnu, len i kov lidé začali zpracovávat až v pozdějších obdobích pravěku.",
  },
  {
    q: "Na tábořišti lovců chtějí archeologové popsat jejich běžný den. Kterou činnost lovci pod Pálavou dělat NEMOHLI?",
    key: "pěstovat obilí na polích",
    d: [
      { value: "lovit mamuty a soby", why: "Tohle lovci dělali, dokládají to kosti na tábořišti. Hledáš činnost, která do jejich doby nepatří." },
      { value: "štípat nástroje z pazourku", why: "Pazourkové nástroje leží na každém tábořišti. Hledáš činnost, kterou lovci ještě neznali." },
      { value: "šít oděvy kostěnou jehlou", why: "Kostěné jehly se na tábořištích našly. Hledáš činnost, která přišla až později." },
    ],
    hints: [
      "U každé možnosti se zeptej: dokládají ji nálezy z tábořišť doby ledové, nebo patří až pozdějším lidem?",
      "Tři činnosti mají stopu v nálezech lovců: kosti zvěře, pazourek, kostěné jehly. Jedna patří až zemědělcům mladší doby kamenné. Najdi ji.",
    ],
    explanation: "Lovci mamutů nepěstovali obilí. Zemědělství přišlo až v mladší době kamenné. Lov, štípání pazourku i šití kostěnou jehlou dokládají nálezy z tábořišť.",
  },
  {
    q: "Lovec potřeboval opravit hrot oštěpu. Který postup mu v jeho době NEBYL k dispozici?",
    key: "odlít nový hrot z bronzu",
    d: [
      { value: "vyštípat hrot z pazourku", why: "Tohle lovci uměli, pazourkové hroty se našly. Hledáš postup, který přišel až později." },
      { value: "vybrousit hrot z parohu", why: "Nástroje z parohů lovci běžně vyráběli. Hledáš postup, který ještě neznali." },
      { value: "vyřezat hrot z mamutí kosti", why: "Kostěné hroty lovci vyráběli. Hledáš postup, který do jejich doby nepatří." },
    ],
    hints: [
      "Rozděl možnosti podle materiálu: které suroviny lovci v době kamenné měli a která přišla až s novou dobou?",
      "Kámen, kost i paroh lovci opracovávali štípáním, řezáním a broušením. Jeden materiál se musí nejdřív tavit a lít do formy, a to se naučili lidé až o mnoho tisíc let později.",
    ],
    explanation: "Odlít hrot z bronzu lovec nemohl, protože kovy lidé začali tavit až v době bronzové. Hroty z pazourku, parohu i kosti lovci mamutů vyráběli.",
  },
  {
    q: "Archeologové odkryli místo, kde lovci pod Pálavou bydleli. Která stavba tam NEMOHLA stát?",
    key: "hliněné domy vesnice u polí",
    d: [
      { value: "chýše zpevněné mamutími kly", why: "Obydlí z mamutích kostí a klů jsou pro lovce typická. Hledáš stavbu, která přišla později." },
      { value: "stany z kůží na kostěné kostře", why: "Stany z kůží lovci stavěli. Hledáš stavbu zemědělců." },
      { value: "ohniště obložené velkými kostmi", why: "Ohniště obložená kostmi se na tábořištích našla. Hledáš stavbu z jiné doby." },
    ],
    hints: [
      "Lovci táhli za zvěří a na místa se vraceli. Která stavba potřebuje, aby lidé zůstali na jednom místě natrvalo?",
      "Chýše, stany i ohniště postavíš z toho, co dá lov. Jedna stavba patří lidem, kteří obdělávali půdu a žili pořád na jednom místě. Ti přišli až v mladší době kamenné.",
    ],
    explanation: "Vesnice s hliněnými domy u polí stavěli až zemědělci v mladší době kamenné. Lovci mamutů bydleli v chýších a stanech z kůží, kostí a klů.",
  },
  {
    q: "Tábořiště vzniklo na svahu pod Pálavou nad údolím řeky Dyje. Proč si lovci vybrali právě toto místo?",
    key: "údolím táhla stáda a byl odtud výhled",
    d: [
      { value: "byla tam úrodná pole pro obilí", why: "Pole zakládali až zemědělci o mnoho tisíc let později. Lovci hledali místo, kde najdou zvěř." },
      { value: "blízko ležely doly na měděnou rudu", why: "Kovy lovci neznali, rudu by k ničemu nepotřebovali." },
      { value: "stály tam hradby starší vesnice", why: "Vesnice ani hradby tu tehdy nebyly. Lovci mamutů patří k nejstarším obyvatelům místa." },
    ],
    hints: [
      "Na čem lovci záviseli? Hledej výhodu místa, která souvisí s lovem.",
      "Zvěř se v krajině pohybuje údolími řek. Lovec na svahu nad údolím vidí daleko. Vyber důvod, který spojuje obě tyto výhody.",
    ],
    explanation: "Údolím Dyje táhla stáda mamutů, sobů a koní a ze svahu pod Pálavou byl dobrý výhled. Pro lovce ideální místo. Pole, rudu ani vesnice tu tehdy nikdo nepotřeboval.",
  },
  {
    q: "Na hliněné sošce z Dolních Věstonic našli badatelé otisk lidského prstu, který vznikl ještě před vypálením. Co z toho plyne?",
    key: "že ji člověk ručně tvaroval z měkké hmoty",
    d: [
      { value: "že ji vylisovali do formy jako cihlu", why: "Formy na sošky lovci neměli. Otisk prstu ukazuje přímou práci rukou." },
      { value: "že otisk nechal pracovník až v muzeu", why: "Otisk vznikl před vypálením, tedy v době vzniku sošky, ne v muzeu." },
      { value: "že ji vypálili dřív, než ji tvarovali", why: "Vypálená hlína je tvrdá a otisk do ní nejde. Otisk vznikl, když byla hmota ještě měkká." },
    ],
    hints: [
      "Kdy se dá do hlíny otisknout prst? Když je měkká, nebo tvrdá po vypálení?",
      "Otisk vznikl před výpalem, tedy během výroby. Kdo a čím sošku v tu chvíli držel a tvaroval?",
    ],
    explanation: "Otisk prstu z doby před vypálením dokazuje, že sošku ručně modeloval člověk z ještě měkké hmoty. Soška tak nese stopu konkrétního výrobce.",
  },
  {
    q: "Na tábořišti v Pavlově leží mnoho zlomků vypálených hliněných figurek zvířat. Co tento nález dokazuje?",
    key: "že lovci uměli vypálit hlínu v ohni",
    d: [
      { value: "že lovci vařili jídlo v hliněných hrncích", why: "Figurka není nádoba. Hrnce z pálené hlíny začali dělat až zemědělci, lovci vypalovali jen figurky." },
      { value: "že lovci chovali zvířata, která zobrazovali", why: "Zobrazit zvíře neznamená chovat ho. Lovci zvířata lovili, chov přišel až se zemědělci." },
      { value: "že figurky sem přinesli pozdější zemědělci", why: "Figurky leží ve stejné vrstvě jako nástroje lovců. Patří tedy lovcům, ne pozdějším lidem." },
    ],
    hints: [
      "Zaměř se na slovo vypálených. Co musel člověk umět, aby hlína ztvrdla a vydržela tisíce let?",
      "Figurka nádobou není, takže o hrncích nic neříká. A to, že člověk zvíře zobrazí, neznamená, že ho chová. Vyber jen to, co nález opravdu dokládá.",
    ],
    explanation: "Vypálené figurky dokazují, že lovci uměli hlínu vypálit v ohni. Nádoby z pálené hlíny ale začali dělat až zemědělci o mnoho tisíc let později.",
  },
  {
    q: "Lovec potřeboval ulovit mamuta, který byl mnohem silnější a těžší než člověk. Jak to lovci nejspíš dělali?",
    key: "lovili ve skupině a spolupracovali",
    d: [
      { value: "lovili sami s bronzovým mečem", why: "Bronz ještě nikdo neznal a jeden člověk by mamuta neulovil." },
      { value: "chytali mamuty do ohrad a chovali je", why: "Mamuty nikdy nikdo nechoval. Chov zvířat přišel až se zemědělci a mamuti už tou dobou vymřeli." },
      { value: "bodali je oštěpy se železnými hroty", why: "Oštěpy lovci měli, ale hroty z kamene, kosti nebo parohu. Železo přišlo až v době železné." },
    ],
    hints: [
      "Vzpomeň si, jaké zbraně lovci doby ledové měli a z čeho byly.",
      "Vylučuj možnosti s kovem a s chovem, ty do doby ledové nepatří. U zbylé porovnej sílu a váhu jednoho člověka se silou a váhou dospělého mamuta.",
    ],
    explanation: "Mamuta lovci lovili ve skupině a spolupracovali, zbraně měli z kamene, kosti a parohu. Kovy ani chov zvířat v té době nikdo neznal.",
  },
  {
    q: "Archeologové našli v jedné vrstvě mamutí kosti, pazourkové nástroje a uhlíky z ohniště. Jak tuto vrstvu nejlépe určit?",
    key: "jako stopy lovců ze starší doby kamenné",
    d: [
      { value: "jako pozůstatek vesnice prvních zemědělců", why: "Ve vrstvě nejsou zrna, srpy ani hrnce. Kosti mamutů a pazourek patří lovcům." },
      { value: "jako dílnu kovářů z doby železné", why: "Ve vrstvě není žádný kov ani struska. Pazourek ukazuje na dobu kamennou." },
      { value: "jako skládku odpadu z doby bronzové", why: "V době bronzové už mamuti dávno vyhynuli. Mamutí kosti ukazují na dobu ledovou." },
    ],
    hints: [
      "Který z nálezů prozrazuje dobu nejspolehlivěji? Kdy žili mamuti?",
      "Mamuti vyhynuli na konci doby ledové. Pazourek bez jediného kovu ukazuje na dobu kamennou. Spoj obě stopy dohromady.",
    ],
    explanation: "Mamutí kosti, pazourkové nástroje a ohniště bez kovů a bez zemědělských nálezů jsou typické stopy lovců ze starší doby kamenné.",
  },
  {
    q: "Lovec potřeboval nosit vodu a zásoby. Která nádoba mu v jeho době NEBYLA k dispozici?",
    key: "hliněný hrnec vypálený v peci",
    d: [
      { value: "vak ušitý ze zvířecí kůže", why: "Kůže lovci měli dost a vaky si z ní šili. Hledáš nádobu, která přišla později." },
      { value: "miska z vydlabané kosti", why: "Kosti lovci běžně opracovávali. Hledáš nádobu, kterou ještě neznali." },
      { value: "kožený měch svázaný šlachou", why: "Kožené měchy si lovci mohli ušít. Hledáš nádobu z pozdější doby." },
    ],
    hints: [
      "Pozor na past: lovci uměli vypálit sošku. Znamená to, že dělali i nádoby?",
      "U každé nádoby si představ, z čeho je a jak se vyrábí. Pak ji porovnej s materiály a postupy, které lovci doby ledové prokazatelně používali na běžné věci.",
    ],
    explanation: "Hrnce z pálené hlíny lovci neměli. Keramické nádoby přišly až se zemědělci v neolitu. Lovci mamutů používali vaky, měchy a misky z kůže a kosti.",
  },
  {
    q: "Na tábořišti archeologové našli provrtané zvířecí zuby a ulity měkkýšů. K čemu je lovci nejspíš používali?",
    key: "jako ozdoby navlečené na šňůrce",
    d: [
      { value: "jako peníze na placení na trhu", why: "Peníze a trhy vznikly o desítky tisíc let později. Provrtání slouží k navlečení." },
      { value: "jako nástroje k obdělávání polí", why: "Pole lovci neměli a malý zub s dírkou by půdu nezryl. Provrtání slouží k navlečení." },
      { value: "jako hroty oštěpů k lovu zvěře", why: "Hrot potřebuje ostrou špičku, ne dírku. Provrtání ukazuje, že se předměty navlékaly." },
    ],
    hints: [
      "Proč je v zubech a ulitách vyvrtaná dírka? Co se jí dá provléct?",
      "Hrot potřebuje špičku, nástroj ostří. Zuby a ulity s dírkou nemají ani jedno. Vylučuj i peníze a pole, ty do doby ledové nepatří. K čemu tedy dírka slouží?",
    ],
    explanation: "Provrtané zuby a ulity lovci navlékali na šňůrky a nosili jako ozdoby. Dokládá to, že se zdobili, dávno předtím, než vznikly peníze nebo pole.",
  },
];

// ── L3 — analýza a transfer ──────────────────────────────────────────────
const POOL_L3: Polozka[] = [
  {
    q: "Proč je Věstonická venuše důležitá i pro dějiny techniky, nejen pro dějiny umění?",
    key: "keramiku pálili dávno před prvními hrnci",
    d: [
      { value: "je to první kovový předmět u nás", why: "Venuše není kovová. Kovy přišly o desítky tisíc let později." },
      { value: "dokládá nejstarší písmo vyryté do hlíny", why: "Na venuši žádné písmo není. Písmo vzniklo až ve starověku." },
      { value: "ukazuje první použití hrnčířského kruhu", why: "Venuše je modelovaná rukou. Hrnčířský kruh přišel až v době kovů, tisíce let po lovcích mamutů." },
    ],
    hints: [
      "Rozmysli ve dvou krocích: 1) z čeho a jak soška vznikla, 2) kdy lidé tu techniku podle učebnice obvykle začali používat.",
      "Obvykle se učí, že vypalování hlíny přišlo se zemědělci a jejich nádobami. Porovnej to se stářím sošky z doby ledové. Co z toho srovnání vyplyne pro dějiny techniky?",
    ],
    explanation: "Venuše je z pálené hlíny, a je tak mnohem starší než hrnčířství mladší doby kamenné. Lidé tedy uměli vypálit keramickou hmotu dávno předtím, než z ní začali dělat nádoby.",
  },
  {
    q: "Který nález by VYVRÁTIL, že vrstva patří tábořišti lovců mamutů?",
    key: "kamenný srp se zrny obilí",
    d: [
      { value: "kostěná jehla s ouškem", why: "Kostěné jehly lovci mamutů vyráběli. Tvrzení by jehla potvrdila, ne vyvrátila." },
      { value: "pazourková čepel se zářezy", why: "Pazourkové čepele jsou pro lovce typické. Tvrzení by podpořila." },
      { value: "zub mamuta s rýhami po řezání", why: "Mamutí kosti a zuby s rýhami jsou přesně to, co na tábořišti lovců čekáme." },
    ],
    hints: [
      "Otoč otázku: co by na tábořišti lovců být NEMĚLO, protože to patří jiné době?",
      "Tři nálezy odpovídají lovu a zpracování zvěře. Hledej ten, který prozrazuje úplně jiný způsob obživy, jaký přišel až v mladší době kamenné.",
    ],
    explanation: "Srp se zrny obilí patří zemědělcům mladší doby kamenné. Kdyby ležel ve vrstvě, nešlo by o tábořiště lovců mamutů. Jehla, čepel i mamutí zub tvrzení naopak podporují.",
  },
  {
    q: "Proč historici soudí, že Věstonická venuše nezobrazuje podobu konkrétní ženy?",
    key: "obličej má jen naznačený a přehání znaky plodnosti",
    d: [
      { value: "jméno Venuše ukazuje na římskou bohyni", why: "Jméno dali soškám až moderní archeologové. O významu pro lovce nic neříká." },
      { value: "je příliš malá, aby mohla být podobou", why: "Velikost o významu nerozhoduje, i malý obrázek může být podobizna. Rozhoduje, co soška zdůrazňuje." },
      { value: "sochař neuměl zachytit rysy tváře", why: "Z Dolních Věstonic je i řezba hlavy s rysy obličeje. Lovci to uměli, u venuše to prostě nechtěli." },
    ],
    hints: [
      "Postupuj ve dvou krocích: 1) co na sošce chybí a co je naopak přehnané, 2) co by portrét konkrétního člověka musel mít.",
      "Portrét zachycuje hlavně tvář, podle které člověka poznáš. Venuše má tvar postavy upravený: široké boky, velká prsa. Co takové zdůraznění vypovídá o účelu sošky?",
    ],
    explanation: "Obličej venuše je jen naznačený dvěma zářezy očí, bez individuálních rysů, zato boky a prsa jsou přehnané. To jsou znaky plodnosti a mateřství. Proto se vykládá jako symbol plodnosti, spojený s obřady, a ne jako podobizna určité ženy.",
  },
  {
    q: "Proč o životě lidí z tábořišť pod Pálavou nemáme žádný písemný pramen?",
    key: "písmo vzniklo až o mnoho tisíc let později",
    d: [
      { value: "písemné prameny shořely při požáru tábořiště", why: "Nic neshořelo, protože nic napsaného nikdy neexistovalo. Písmo tehdy ještě nebylo." },
      { value: "texty psané na kůžích se rozpadly v zemi", why: "Kůže se sice rozpadají, ale lovci na ně nepsali. Písmo vzniklo až ve starověku." },
      { value: "lovci psali, ale jejich písmu nerozumíme", why: "Nečitelná písma existují, ale z doby lovců mamutů žádné neznáme. Písmo ještě nebylo." },
    ],
    hints: [
      "Seřaď si dvě věci na časové ose: kdy žili lovci pod Pálavou a kdy lidé začali zapisovat řeč znaky.",
      "Pravěk končí právě tam, kde začínají písemné prameny. Lovci mamutů žili hluboko v pravěku. Proto o nich víme jen z hmotných pramenů: kostí, nástrojů a sošek.",
    ],
    explanation: "Písemné prameny chybějí, protože písmo vzniklo až ve starověku, o mnoho tisíc let později. O lovcích mamutů víme jen z hmotných pramenů, například z kostí, nástrojů a sošek.",
  },
  {
    q: "Co z toho plyne, že na jednom tábořišti leží kosti velkého množství mamutů?",
    key: "místo využívaly skupiny lidí po mnoho generací",
    d: [
      { value: "jeden lovec zabil všechny mamuty za den", why: "Jeden člověk by mamuta neulovil a tolik zvířat by za den nikdo nezvládl." },
      { value: "mamuti tam byli chováni ve velkých ohradách", why: "Mamuty nikdy nikdo nechoval. Chov zvířat přišel až se zemědělci a mamuti už tou dobou vymřeli." },
      { value: "mamuti vyhynuli právě kvůli tomuto táboru", why: "Jedno tábořiště nemohlo vyhubit celý druh. Mamuti vymřeli hlavně s oteplením." },
    ],
    hints: [
      "Rozmysli ve dvou krocích: 1) kolik lidí je potřeba na jeden mamutí lov, 2) za jak dlouho se může nahromadit kostí velkého množství zvířat.",
      "Mamut se loví ve skupině a tolik kostí se nashromáždí za dlouhou dobu, lovem i sběrem kostí. Vyber vysvětlení, které počítá se spoluprací i s dlouhým časem.",
    ],
    explanation: "Kosti velkého množství mamutů ukazují, že se na místo vracely skupiny lidí po dlouhou dobu, lovily společně a sbíraly i kosti. Nešlo o jeden lov jednoho člověka.",
  },
  {
    q: "Co z toho plynulo pro lidi na jižní Moravě, když po skončení doby ledové mamuti vyhynuli a krajina zarostla lesem?",
    key: "začali lovit menší zvěř v lesích",
    d: [
      { value: "hned začali tavit železo na zbraně", why: "Železo přišlo o mnoho tisíc let později. Nejbližší změna se týkala toho, co lidé lovili." },
      { value: "přestali lovit a žili jen z obchodu", why: "Obchod potravu nedá. Lidé dál lovili, jen jiná zvířata." },
      { value: "odešli za mamuty do teplých krajin", why: "Mamuti do teplých krajin netáhli, vymřeli. Lidé zůstali a přizpůsobili se." },
    ],
    hints: [
      "Hledej NEJBLIŽŠÍ důsledek, ne to, co přišlo o tisíce let později. Co se změnilo v krajině a ve zvěři?",
      "Když zmizí hlavní kořist a step se změní v les, lidé musí najít jinou potravu, ale kovy ani zemědělství ještě neznají. Jaká zvěř žije v lese?",
    ],
    explanation: "Po oteplení se step změnila v les a mamuti vymřeli. Nejbližším důsledkem byl lov menší lesní zvěře (jelenů, srn, divočáků). Zemědělství a kovy přišly až mnohem později.",
  },
  {
    q: "Co z toho plyne, když porovnáš stáří Věstonické venuše a egyptských pyramid?",
    key: `venuše je asi o ${let_(20000)} starší`,
    d: [
      { value: `venuše je asi o ${let_(2000)} starší`, why: `Posunul ses o řád. Pyramidy jsou staré asi ${let_(4500)}, venuše asi ${let_(25000)}.` },
      { value: `pyramidy jsou asi o ${let_(20000)} starší`, why: "Obrátil jsi pořadí. Pyramidy stavěli ve starověku, venuše pochází z doby ledové." },
      { value: "obě díla vznikla přibližně ve stejné době", why: "Pravěk není jedno období. Mezi dobou ledovou a starověkým Egyptem leží desítky tisíc let." },
    ],
    hints: [
      "Neurčuj přesná čísla, porovnej řády: je jedno dílo staré tisíce let a druhé desítky tisíc let?",
      "Pyramidy patří starověku, tedy době s písmem, zhruba před čtyřmi a půl tisíci lety. Venuše vznikla v době ledové. Odečti v duchu menší stáří od většího a zaokrouhli.",
    ],
    explanation: `Venuše je stará asi ${let_(25000)}, pyramidy asi ${let_(4500)}. Venuše je tedy asi o ${let_(20000)} starší. Pravěk je nesrovnatelně delší než starověk.`,
  },
  {
    q: "Proč je každá rekonstrukce obydlí lovců mamutů jen hypotéza?",
    key: "kůže a dřevo shnily, zbyly kosti a stopy",
    d: [
      { value: "žádné obydlí archeologové zatím nevykopali", why: "Obrysy obydlí se našly. Chybí ale materiály, které se rozpadly." },
      { value: "plánky obydlí vyryté do kosti jsou nečitelné", why: "Lovci plánky nezanechali. Rekonstrukce vychází z toho, co v zemi zbylo." },
      { value: "obydlí rozbourali pozdější Keltové", why: "Keltové přišli o desítky tisíc let později. Obydlí zmizelo samo, rozkladem." },
    ],
    hints: [
      "Rozmysli, které materiály vydrží v zemi desítky tisíc let a které se rozloží.",
      "Archeolog najde kruh kostí, ohniště a jamky. Nenajde ale to, co bylo nahoře a z čeho byly stěny. Proto musí zbytek domýšlet. Proč?",
    ],
    explanation: "Kůže, dřevo a šlachy se rozložily, zbyly jen kosti, ohniště a stopy v zemi. Jak obydlí vypadalo nahoře, se proto jen odhaduje. Rekonstrukce je hypotéza.",
  },
  {
    q: "Proč se sošky z pálené hlíny dochovaly desítky tisíc let, zatímco předměty ze dřeva a kůže ne?",
    key: "vypálená hlína nehnije a snese vlhko",
    d: [
      { value: "lovci je ukládali do bronzových schránek", why: "Bronz lovci neznali, přišel až o mnoho tisíc let později. Sošky ležely volně v zemi." },
      { value: "lovci dřevo ani kůže vůbec nepoužívali", why: "Kůže a dřevo lovci používali, jen se nedochovaly. Otázka se ptá, proč přetrvala hlína." },
      { value: "sošky vždy ležely v suchých jeskyních", why: "Tábořiště pod Pálavou nejsou jeskyně, sošky ležely v zemi pod širým nebem." },
    ],
    hints: [
      "Co se stane s hlínou v ohni? A co se stane s kůží, když leží tisíce let ve vlhké zemi?",
      "Oheň z měkké hlíny udělá tvrdý kámen, který voda nerozmočí a bakterie nerozloží. Kůže a dřevo jsou z živé hmoty. Porovnej, jak na ně působí vlhko.",
    ],
    explanation: "Vypálená hlína nehnije a vlhko jí neublíží, proto se sošky dochovaly. Kůže a dřevo lovci používali také, ale v zemi se rozložily.",
  },
  {
    q: "Co z toho plyne, že lovci pod Pálavou používali pazourek, který se v jejich okolí nevyskytoval a nosil se z velké dálky?",
    key: "cestovali daleko nebo si suroviny vyměňovali",
    d: [
      { value: "platili za pazourek penězi na trzích", why: "Peníze a trhy vznikly až o desítky tisíc let později. Lovci si suroviny mohli jen vyměňovat." },
      { value: "pazourek tam dovezli až Keltové na vozech", why: "Pazourek leží ve stejné vrstvě jako nástroje lovců. Keltové přišli o desítky tisíc let později." },
      { value: "řeka ho sama přinesla až k tábořišti", why: "Řeka neroznáší pazourek po stovkách kilometrů. Někdo ho musel přinést." },
    ],
    hints: [
      "Rozmysli ve dvou krocích: 1) pazourek k tábořišti někdo dopravil, 2) jak to lidé bez peněz, vozů a obchodů mohli zařídit?",
      "Suroviny se k lovcům mohly dostat dvěma cestami: sami za nimi došli, nebo je dostali od jiné skupiny za něco jiného. Vyřaď možnosti, které do doby ledové nepatří.",
    ],
    explanation: "Pazourek z velké dálky ukazuje, že lovci putovali daleko nebo si suroviny vyměňovali s jinými skupinami. Peníze, trhy i Keltové patří až mnohem pozdější době.",
  },
  {
    q: "Proč Věstonickou venuši nemohl vytvořit neandertálec, i když i on kdysi žil v Evropě?",
    key: "neandertálci vymřeli dřív, než soška vznikla",
    d: [
      { value: "neandertálci nikdy neuměli pracovat s ohněm", why: "Neandertálci oheň používali. Rozhoduje, kdy žili." },
      { value: "soška vznikla až v době římské říše", why: "Soška je o desítky tisíc let starší než Řím. Jméno venuše ji s Římem jen zdánlivě spojuje." },
      { value: "neandertálci žili až po lovcích mamutů", why: "Obrátil jsi pořadí. Neandertálci žili před lovci mamutů, ne po nich." },
    ],
    hints: [
      "Zamysli se, co musí platit, aby někdo mohl vyrobit určitou věc: musí žít ve stejné době a na stejném místě, kde věc vznikla.",
      `Najdi na časové ose, kdy neandertálci v Evropě žili, a porovnej to se stářím sošky (asi ${let_(25000)}). Pak rozhodni, jestli se ty dvě doby překrývají.`,
    ],
    explanation: "Neandertálci v Evropě vymřeli dřív, než venuše vznikla. Vytvořil ji tedy člověk dnešního typu. Neandertálci přitom oheň znali, rozhoduje čas.",
  },
  {
    q: "Proč lovci na jižní Moravě nestavěli obydlí z trámů, jako to později dělali lidé ve vesnicích?",
    key: "dřeva bylo v krajině málo, kostí dost",
    d: [
      { value: "lovci neměli nástroje na práci se dřevem", why: "Pazourkové nástroje na opracování dřeva lovci měli. Rozhodovalo, čeho bylo v krajině dost." },
      { value: "lesy tu vykáceli pro pole první zemědělci", why: "Zemědělci přišli až po lovcích. V době ledové tu souvislé lesy nebyly." },
      { value: "dřevo spotřebovaly pece na tavení bronzu", why: "Bronz se u nás tavil až tisíce let po lovcích mamutů. S jejich obydlím to nijak nesouvisí." },
    ],
    hints: [
      "Rozmysli ve dvou krocích: 1) jaká krajina byla na Moravě v době ledové, 2) co v takové krajině chybí a čeho je naopak dost.",
      "Zamysli se, v jaké krajině se pásli mamuti, sobi a koně a kolik stromů v ní roste. Pak zvaž, co lovcům zbylo z každého ulovu a na co dalšího potřebovali dřevo každý den.",
    ],
    explanation: "Krajina doby ledové byla step jen s menšími lesíky u řek. Dřevo lovci potřebovali hlavně na ohně, na obydlí použili kůly, kůže a zpevnění z mamutích kostí, kterých měli z lovu dost. Domy z trámů stavěli až zemědělci.",
  },
  {
    q: "Co z toho plyne, že archeologové pod Pálavou našli hrob, v němž kostru pokrývalo červené barvivo (okr) a vedle ležely ozdoby?",
    key: "lidé pohřbívali mrtvé s obřadem",
    d: [
      { value: "okr byl jen náhodná hlína z okolí", why: "Barvivo leží přímo na kostře a u ní ozdoby. To je záměr, ne náhoda." },
      { value: "okr měl tělo jen chránit před zvěří", why: "Tenká vrstva barviva tělo před zvěří neochrání a ozdoby by k tomu nebyly potřeba. Jde o péči o mrtvého." },
      { value: "mrtvého pohřbili křesťanští kněží", why: "Křesťanství vzniklo o desítky tisíc let později. Hrob patří lovcům doby ledové." },
    ],
    hints: [
      "Proč by někdo mrtvého pečlivě barvil a dával mu ozdoby, když to k přežití nepotřeboval?",
      "Rozmysli ve dvou krocích: 1) jsou barva a ozdoby v hrobě náhoda, nebo úmysl? 2) co úmyslné jednání u mrtvého vypovídá o představách lidí o smrti?",
    ],
    explanation: "Pečlivé pohřbení s okrem a ozdobami je záměrné jednání, tedy pohřební obřad. Nejspíš to znamená, že lovci měli představy o tom, co přichází po smrti. Jistě to nevíme, protože písemné prameny chybějí.",
  },
  {
    q: "Co z toho plyne, že se v pálené hlíně z Pavlova a Dolních Věstonic dochovaly otisky provázků, sítí a tkanin?",
    key: "lovci uměli zpracovat vlákna z rostlin",
    d: [
      { value: "lovci pěstovali len na vlastních polích", why: "Vlákna se dala nasbírat z divokých rostlin. Pole a pěstovaný len přišly až se zemědělci." },
      { value: "otisky do hlíny vtiskli až archeologové", why: "Otisky jsou ve vypálené hlíně. Do tvrdé hlíny se po vypálení nic vtisknout nedá, vznikly tedy v době lovců." },
      { value: "lovci přestali šít oděvy z kůží", why: "Otisky ukazují dovednost navíc, ne konec té staré. Teplé oděvy lovci dál šili z kožešin." },
    ],
    hints: [
      "Rozmysli ve dvou krocích: 1) kdy otisk do hlíny vznikl, 2) co musel umět člověk, který měl provázek nebo síť.",
      "Pole ani ovce lovci neměli. Zamysli se, co v přírodě kolem tábořiště rostlo nebo žilo a dalo se z toho stočit provázek, a porovnej to s nabídkou.",
    ],
    explanation: "Otisky provázků, sítí a tkanin ve vypálené hlíně ukazují, že lovci pod Pálavou uměli z vláken divokých rostlin stáčet provázky, plést sítě a tkát jednoduché látky. Patří k nejstarším takovým dokladům na světě. Teplé oděvy přitom dál šili z kůží, pole ani len neměli.",
  },
];

/** Deterministická rotace nabídky: úloha i má klíč na pozici (i mod 4). */
function rotace<T>(arr: T[], k: number): T[] {
  const n = arr.length;
  const s = ((k % n) + n) % n;
  return [...arr.slice(n - s), ...arr.slice(0, n - s)];
}

function uloha(p: Polozka, i: number): PracticeTask {
  const t = choice(p.q, p.key, p.d, { hints: p.hints, explanation: p.explanation });
  t.options = rotace([p.key, ...p.d.map((x) => x.value)], i);
  return t;
}

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return pool.map(uloha);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const LOVCI_MAMUTU_VESTONICKA_VENUSE: TopicMetadata[] = [
  {
    id: "g6-dej-lovci-mamutu-vestonicka-venuse-6",
    rvpNodeId: "g6-dejepis-pravek-pravek-na-nasem-uzemi-lovci-mamutu-vestonicka-venuse",
    displayName: "Lovci mamutů a Věstonická venuše",
    title: "Lovci mamutů, Věstonická venuše",
    studentTitle: "Lovci mamutů a Věstonická venuše",
    subject: "dejepis",
    category: "Pravěk",
    topic: "Pravěk na našem území",
    briefDescription: "Jak žili lovci mamutů pod Pálavou a co prozrazuje Věstonická venuše",
    keywords: [
      "lovci mamutů", "Věstonická venuše", "Dolní Věstonice", "Pavlov", "Pálava",
      "paleolit", "starší doba kamenná", "pazourek", "pálená hlína", "Moravské muzeum",
    ],
    goals: [
      "Popsat, jak lovci mamutů pod Pálavou žili, lovili a stavěli.",
      "Z nálezu usoudit, k čemu sloužil a co dokazuje.",
      "Odlišit lovce mamutů od zemědělců a lidí doby kovů a vysvětlit význam Věstonické venuše.",
    ],
    boundaries: [
      "Jen lovci mamutů na jižní Moravě v mladém paleolitu (Dolní Věstonice, Pavlov).",
      `Stáří jen přibližně (asi ${let_(25000)}), žádné přesné datace.`,
      "Sporné výklady (např. komu patří otisk prstu) se nezkouší.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Lovci mamutů žili ve starší době kamenné: lovili a sbírali, nástroje měli z kamene, kostí a parohů. Zemědělství, hrnce i kovy přišly až později.",
      steps: [
        "Urči, do které doby nález nebo činnost patří.",
        "Zeptej se, jestli ji lidé doby ledové mohli znát (lov a sběr ano, pole, chov a kovy ne).",
        `U venuše odliš materiál (pálená hlína), stáří (asi ${let_(25000)}) a význam (symbol plodnosti).`,
      ],
      commonMistake: "Brát pravěk jako jedno období a přiřadit lovcům mamutů pole, hrnce nebo bronz.",
      example: "Kruh mamutích kostí na tábořišti = zpevnění obydlí z kůží, protože kostí bylo dost a dřeva ve stepi méně.",
    },
  },
];
