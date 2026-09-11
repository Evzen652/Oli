import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původně L1 a L2 tvořily jen
// úlohy Ano/Ne (polovina se dala uhodnout) bez zpětné vazby a L3 chtěla
// odborné názvy technik („bandwagon“, „emocionální apel“, „falešná
// autorita“). Triky se teď jmenují tak, jak by je popsalo dítě, a každá
// úloha má čtyři možnosti s vysvětlením.
//
// L1 = k čemu reklama je a jak se nenechat nachytat
// L2 = poznej trik ve sloganu · L3 = co udělat, na co se zeptat, co je poctivé.

type Trik = "slavný člověk to chválí" | "všichni to mají" | "spěchej, jinak to zmizí" | "slibuje hezký pocit"
  | "odborníci bez důkazu" | "nejlepší bez srovnání" | "podmínka malým písmem" | "strašení";

const NENI: Record<Trik, string> = {
  "slavný člověk to chválí": "Nevystupuje tu žádná slavná osobnost.",
  "všichni to mají": "Slogan netvrdí, že to mají všichni ostatní.",
  "spěchej, jinak to zmizí": "Slogan netlačí na čas ani na poslední kusy.",
  "slibuje hezký pocit": "Slogan nespojuje výrobek s radostí nebo pohodou.",
  "odborníci bez důkazu": "Slogan se neodvolává na vědce ani odborníky.",
  "nejlepší bez srovnání": "Slogan netvrdí, že je výrobek nejlepší.",
  "podmínka malým písmem": "Není tu žádná podmínka schovaná malým písmem.",
  "strašení": "Slogan tě ničím nestraší.",
};

const RADA: Record<Trik, string> = {
  "slavný člověk to chválí": "Kdo za výrobek mluví? Dostal za to zaplaceno?",
  "všichni to mají": "Slogan tě chce přesvědčit, že nechceš zůstat pozadu za ostatními.",
  "spěchej, jinak to zmizí": "Slogan chce, aby ses rozhodl nebo rozhodla hned a nestihl nebo nestihla přemýšlet.",
  "slibuje hezký pocit": "Slogan neříká nic o výrobku, jen ho spojuje s příjemným pocitem.",
  "odborníci bez důkazu": "Slogan se opírá o někoho chytrého, ale neříká, kdo to je a jak to zjistil.",
  "nejlepší bez srovnání": "Slogan chválí výrobek nejvyšším stupněm, ale neříká, s čím ho srovnali.",
  "podmínka malým písmem": "Podívej se na hvězdičku nebo drobný text — co v něm je?",
  "strašení": "Slogan ti naznačuje, že se stane něco zlého, když výrobek nekoupíš.",
};

function trik(slogan: string, klic: Trik, spatne: [Trik, Trik, Trik], slova: string, explanation: string): PracticeTask {
  return choice(`Jaký trik používá slogan „${slogan}“?`, klic,
    spatne.map((t) => ({ value: t, why: NENI[t] })) as never, {
      hints: [`Všimni si slov „${slova}“. Čím se tě snaží přesvědčit?`, `${RADA[klic]} Přečti si znovu „${slova}“ a zeptej se, jestli to o výrobku opravdu něco dokazuje.`],
      explanation,
    });
}

const L1: PracticeTask[] = [
  choice("Proč vzniká reklama?", "aby lidé něco koupili", [
    { value: "aby lidé znali všechny nevýhody", why: "O nevýhodách reklama většinou mlčí." },
    { value: "aby se lidé naučili číst", why: "Učit číst reklama nechce." },
    { value: "aby byl pořad v televizi delší", why: "Reklama pořad jen přerušuje." },
  ], {
    hints: ["Kdo reklamu platí a co z toho chce mít?", "Reklamu platí firma, která chce něco prodat. Všechno v reklamě tomu slouží."],
    explanation: "Reklamu platí ten, kdo chce něco prodat — jejím cílem je, abychom výrobek koupili.",
  }),
  choice("Reklama ukazuje jen dobré vlastnosti výrobku. Proč?", "chce výrobek prodat", [
    { value: "výrobek žádné nevýhody nemá", why: "Každý výrobek nějaké nevýhody má." },
    { value: "nevýhody jsou tajné", why: "Nevýhody tajné nejsou — reklama o nich jen mlčí." },
    { value: "reklama neumí mluvit o nevýhodách", why: "Umí, ale nechce — nevýhody by prodej zbrzdily." },
  ], {
    hints: ["Mluvil by prodavač o tom, co je na jeho zboží špatně?", "Kdo něco prodává, ukazuje to nejlepší. O tom, co by tě odradilo, raději mlčí."],
    explanation: "Reklama chce prodat, a proto ukazuje jen to dobré a o nevýhodách mlčí.",
  }),
  choice("Co je slogan?", "krátká věta, která se dobře pamatuje", [
    { value: "cena výrobku na obalu", why: "Cena slogan není." },
    { value: "návod, jak výrobek použít", why: "Návod je dlouhý a nic neprodává." },
    { value: "seznam složení na obalu", why: "Složení je napsané na obalu, slogan je věta z reklamy." },
  ], {
    hints: ["Kterou větu z reklamy si pamatuješ, i když nechceš?", "Slogan je krátký, často rýmovaný a opakuje se pořád dokola, aby ti utkvěl v hlavě."],
    explanation: "Slogan je krátká chytlavá věta z reklamy, kterou si snadno zapamatujeme.",
  }),
  choice("Slavný fotbalista v reklamě chválí jogurt. Znamená to, že je jogurt dobrý?", "ne, za reklamu dostal zaplaceno", [
    { value: "ano, fotbalisté se vyznají v jídle", why: "Fotbalista je odborník na fotbal, ne na jogurty." },
    { value: "ano, slavní lidé nelžou", why: "I slavní lidé v reklamě mluví hlavně kvůli penězům." },
    { value: "ne, fotbalisté jogurty nejedí", why: "Jíst je mohou — o kvalitě to ale nic neříká." },
  ], {
    hints: ["Proč fotbalista v reklamě vystupuje?", "Firma platí slavné lidi, aby jejich obliba přešla na výrobek. O kvalitě jogurtu to nic neříká."],
    explanation: "Slavný člověk v reklamě dostává zaplaceno. Jeho sláva o kvalitě výrobku nic neříká.",
  }),
  choice("Reklama volá „Jen dnes!“. Co tím chce?", "abychom nakoupili hned a nepřemýšleli", [
    { value: "abychom věděli, kolik je hodin", why: "Čas tu slouží jen k tomu, aby na nás tlačil." },
    { value: "abychom přišli až zítra", why: "Naopak — chce, abychom přišli hned." },
    { value: "abychom nic nekupovali", why: "Reklama chce, abychom koupili." },
  ], {
    hints: ["Jak se rozhoduješ, když na tebe někdo spěchá?", "Když máme málo času, nerozmyslíme si, jestli věc opravdu potřebujeme. To reklama využívá."],
    explanation: "„Jen dnes!“ na nás tlačí, abychom nakoupili hned a nestihli si to rozmyslet.",
  }),
  choice("Reklama na čokoládu ukazuje šťastnou rodinu. Co tím chce?", "abychom si čokoládu spojili s radostí", [
    { value: "ukázat, jak se čokoláda vyrábí", why: "Výroba v reklamě vůbec není." },
    { value: "říct, kolik čokoláda stojí", why: "Cenu šťastná rodina neukazuje." },
    { value: "varovat před sladkostmi", why: "Reklama chce prodat, ne varovat." },
  ], {
    hints: ["Co ti o čokoládě řekne usmívající se rodina?", "O čokoládě samotné nic. Reklama chce, abys měl nebo měla při pohledu na ni příjemný pocit."],
    explanation: "Šťastná rodina má v nás vyvolat hezký pocit, který si pak spojíme s čokoládou.",
  }),
  choice("Reklama slibuje „Nejlepší vysavač na světě!“. Můžeme tomu věřit?", "ne, chybí, s čím ho srovnali", [
    { value: "ano, když je to velkými písmeny", why: "Velká písmena nic nedokazují." },
    { value: "ano, protože to říkají v televizi", why: "Televize reklamu jen vysílá, nepravdivost neověřuje." },
    { value: "ne, vysavače se nesmí prodávat", why: "Vysavače se prodávat smí." },
  ], {
    hints: ["Nejlepší ze všech? Kdo to zkoumal a jak?", "Slovo „nejlepší“ zní silně, ale reklama neříká, s kterými vysavači a podle čeho výrobek srovnala."],
    explanation: "Tvrzení „nejlepší“ bez srovnání nejde ověřit. Je to chvála, ne důkaz.",
  }),
  choice("Na plakátu je velké „ZDARMA*“ a dole malá hvězdička. Co to znamená?", "platí podmínka napsaná malým písmem", [
    { value: "vše je opravdu úplně zadarmo", why: "Hvězdička skoro vždy odkazuje na podmínku." },
    { value: "hvězdička je jen ozdoba", why: "Hvězdička odkazuje na drobný text." },
    { value: "výrobek je hvězdou reklamy", why: "Hvězdička tu neznamená slávu." },
  ], {
    hints: ["Kam hvězdička odkazuje?", "Velkými písmeny je napsáno to lákavé, drobnými to, co by tě mohlo odradit. Vždy si drobný text přečti."],
    explanation: "Hvězdička odkazuje na podmínku napsanou drobně — třeba „při nákupu nad 1 000 Kč“.",
  }),
  choice("Kdo reklamu platí?", "ten, kdo chce výrobek prodat", [
    { value: "diváci v televizi", why: "Diváci reklamu jen sledují." },
    { value: "škola", why: "Škola reklamy neplatí." },
    { value: "nikdo, je zadarmo", why: "Reklama stojí hodně peněz." },
  ], {
    hints: ["Kdo z reklamy vydělá?", "Reklama stojí peníze. Platí ji ten, kdo doufá, že díky ní prodá víc."],
    explanation: "Reklamu platí výrobce nebo prodejce, který chce, abychom jeho zboží koupili.",
  }),
  choice("Proč reklama opakuje stejnou písničku pořád dokola?", "abychom si výrobek zapamatovali", [
    { value: "protože nemá jiné písničky", why: "Opakování je záměr, ne nouze." },
    { value: "aby nás uspala", why: "Reklama nás chce spíš upoutat." },
    { value: "protože je to povinné", why: "Povinné to není." },
  ], {
    hints: ["Proč si pamatuješ písničku z reklamy?", "Co slyšíme pořád dokola, to nám utkví v hlavě — a v obchodě si na to vzpomeneme."],
    explanation: "Opakováním si písničku i výrobek zapamatujeme a v obchodě si na něj vzpomeneme.",
  }),
  choice("Která otázka ti pomůže nenechat se reklamou nachytat?", "Opravdu to potřebuju?", [
    { value: "Kolik reklam dnes uvidím?", why: "Počet reklam o výrobku nic neřekne." },
    { value: "Jakou barvu má logo?", why: "Barva loga o kvalitě nic neříká." },
    { value: "Je herec v reklamě hezký?", why: "Vzhled herce s výrobkem nesouvisí." },
  ], {
    hints: ["Která otázka tě přiměje přemýšlet o sobě, a ne o reklamě?", "Nejlepší obrana proti reklamě je zastavit se a zeptat se, jestli věc opravdu chceme a potřebujeme."],
    explanation: "Otázka „Opravdu to potřebuju?“ nás přiměje zastavit se a nekupovat jen kvůli reklamě.",
  }),
  choice("Co udělá rozumný zákazník, než koupí něco z reklamy?", "porovná to s jinými výrobky", [
    { value: "koupí to hned", why: "Tak by se nechal nachytat." },
    { value: "koupí to dvakrát", why: "Dvakrát koupit nic nevyřeší." },
    { value: "věří všemu z reklamy", why: "Reklama ukazuje jen to dobré." },
  ], {
    hints: ["Jak zjistíš, jestli je výrobek opravdu dobrý?", "Srovnání s dalšími podobnými věcmi a názory lidí, kteří je mají, řeknou víc než reklama."],
    explanation: "Rozumný zákazník porovná výrobek s jinými a zjistí si o něm víc, než koupí.",
  }),
  choice("Reklama na hračku běží hlavně při dětských pořadech. Proč?", "děti pak hračku chtějí po rodičích", [
    { value: "dospělí se na televizi nedívají", why: "Dívají, ale hračky chtějí hlavně děti." },
    { value: "jindy je reklama zakázaná", why: "Zakázaná není, jen by nepřinesla tolik." },
    { value: "hračky jsou zadarmo", why: "Hračky zadarmo nejsou." },
  ], {
    hints: ["Kdo se dívá na dětské pořady a kdo nakonec hračku kupuje?", "Reklama míří na ty, kdo hračku budou chtít. Potom prosí rodiče, aby ji koupili."],
    explanation: "Reklama míří na děti, protože ty pak hračku chtějí a prosí o ni rodiče.",
  }),
];

const L2: PracticeTask[] = [
  trik("Tuhle mikinu už má celá třída. A ty?", "všichni to mají", ["podmínka malým písmem", "strašení", "odborníci bez důkazu"], "celá třída… A ty?",
    "Slogan tlačí na to, abys nezůstal nebo nezůstala pozadu za ostatními — trik „všichni to mají“."),
  trik("Poslední tři kusy! Jen do půlnoci!", "spěchej, jinak to zmizí", ["slavný člověk to chválí", "slibuje hezký pocit", "nejlepší bez srovnání"], "Poslední tři kusy… jen do půlnoci",
    "Poslední kusy a čas do půlnoci tlačí k rychlému rozhodnutí — trik „spěchej, jinak to zmizí“."),
  trik("Zubaři doporučují naši pastu!", "odborníci bez důkazu", ["všichni to mají", "spěchej, jinak to zmizí", "strašení"], "Zubaři doporučují",
    "Nevíme, kteří zubaři a kolik jich — trik „odborníci bez důkazu“."),
  trik("Kupte dětem radost.", "slibuje hezký pocit", ["odborníci bez důkazu", "podmínka malým písmem", "všichni to mají"], "radost",
    "Slogan spojuje výrobek s radostí, o výrobku samém nic neříká — „slibuje hezký pocit“."),
  trik("Náš vysavač je nejlepší na trhu!", "nejlepší bez srovnání", ["strašení", "slavný člověk to chválí", "spěchej, jinak to zmizí"], "nejlepší na trhu",
    "„Nejlepší“ bez uvedeného srovnání nejde ověřit — trik „nejlepší bez srovnání“."),
  trik("Zdarma!* (*při nákupu nad 1 500 Kč)", "podmínka malým písmem", ["slibuje hezký pocit", "nejlepší bez srovnání", "slavný člověk to chválí"], "*při nákupu nad 1 500 Kč",
    "Velké „zdarma“ láká, podmínka je schovaná za hvězdičkou — „podmínka malým písmem“."),
  trik("Bez našeho krému budete mít vrásky!", "strašení", ["všichni to mají", "odborníci bez důkazu", "podmínka malým písmem"], "Bez našeho krému",
    "Slogan vyvolává strach z vrásek a krém nabízí jako záchranu — „strašení“."),
  trik("Slavná zpěvačka pije jen naši limonádu.", "slavný člověk to chválí", ["spěchej, jinak to zmizí", "strašení", "odborníci bez důkazu"], "Slavná zpěvačka",
    "Oblíbenost zpěvačky má přejít na limonádu — „slavný člověk to chválí“."),
  trik("Každá správná máma vaří z naší mouky.", "všichni to mají", ["nejlepší bez srovnání", "slibuje hezký pocit", "podmínka malým písmem"], "Každá správná máma",
    "Slogan naznačuje, že kdo mouku nepoužívá, není „správná máma“ — trik „všichni to mají“."),
  trik("Vědci zjistili, že naše tableta funguje o 50 % lépe!", "odborníci bez důkazu", ["strašení", "všichni to mají", "slavný člověk to chválí"], "Vědci zjistili",
    "Neví se, kteří vědci a o 50 % lépe než co — „odborníci bez důkazu“."),
  trik("Kupte teď a budete mít klid na celý týden.", "slibuje hezký pocit", ["podmínka malým písmem", "nejlepší bez srovnání", "odborníci bez důkazu"], "klid na celý týden",
    "Slogan slibuje pocit klidu, o výrobku nic neříká — „slibuje hezký pocit“."),
  trik("Akce končí za 10 minut!", "spěchej, jinak to zmizí", ["slibuje hezký pocit", "strašení", "všichni to mají"], "za 10 minut",
    "Krátký čas tlačí k rychlému nákupu bez rozmyslu — „spěchej, jinak to zmizí“."),
  trik("Nejrychlejší internet ve vesmíru!", "nejlepší bez srovnání", ["podmínka malým písmem", "slavný člověk to chválí", "spěchej, jinak to zmizí"], "Nejrychlejší… ve vesmíru",
    "Přehnané „nejrychlejší“ bez srovnání nejde ověřit — „nejlepší bez srovnání“."),
];

const L3: PracticeTask[] = [
  choice("Jak ověříš, že je výrobek opravdu dobrý?", "zjistím, co o něm říkají lidé, kteří ho mají", [
    { value: "podívám se na reklamu ještě jednou", why: "Reklama řekne zase jen to dobré." },
    { value: "zeptám se jen firmy, která ho vyrábí", why: "Firma chce prodat, nebude nestranná." },
    { value: "koupím ho a uvidím", why: "Pak už je pozdě — peníze jsou pryč." },
  ], {
    hints: ["Kdo ti řekne pravdu — ten, kdo prodává, nebo ten, kdo výrobek používá?", "Nejlepší zdroj je ten, kdo z prodeje nic nemá: zákazníci, kteří výrobek už mají, nebo nezávislé testy."],
    explanation: "Zkušenosti lidí, kteří výrobek mají, jsou nestrannější než reklama nebo výrobce.",
  }),
  choice("Reklama říká „Doporučuje 9 z 10 zubařů“. Na co se zeptáš?", "Kolik zubařů se ptali a kdo je vybral?", [
    { value: "Jakou barvu má pasta?", why: "Barva s doporučením nesouvisí." },
    { value: "Kolik stojí návštěva zubaře?", why: "S reklamou na pastu to nesouvisí." },
    { value: "Proč je pasta v tubě?", why: "Tuba o doporučení nic neřekne." },
  ], {
    hints: ["Mohli se zeptat jen deseti zubařů, které si sami vybrali?", "Číslo zní přesvědčivě, ale bez toho, kolik lidí se ptali a kdo je vybral, nic nedokazuje."],
    explanation: "Musíme vědět, kolik zubařů se ptali a kdo je vybral — jinak číslo nic nedokazuje.",
  }),
  choice("Reklama říká „O 20 % lepší!“. Co v ní chybí?", "s čím výrobek srovnávají", [
    { value: "cena výrobku", why: "Cena by nevysvětlila, proč je „lepší“." },
    { value: "barva obalu", why: "Barva s tvrzením nesouvisí." },
    { value: "nic, je to jasné", why: "Není jasné, lepší než co." },
  ], {
    hints: ["O 20 % lepší… než co?", "Srovnání potřebuje dvě věci. Reklama řekla jen jednu."],
    explanation: "Chybí, s čím výrobek srovnávají — „lepší než co?“. Bez toho tvrzení nic neznamená.",
  }),
  choice("Který slogan je poctivý, a ne manipulativní?", "Jablečný džus, 1 litr, 35 Kč.", [
    { value: "Džus, bez kterého nebudeš šťastný!", why: "Strašení a slib štěstí." },
    { value: "Poslední kusy, rychle!", why: "Tlačí na spěch." },
    { value: "Pije ho každý, jen ty ne!", why: "Tlak, že ho mají všichni ostatní." },
  ], {
    hints: ["Který slogan jen věcně říká, co to je a kolik to stojí?", "Poctivá informace neslibuje štěstí, netlačí na čas a nestraší. Jen řekne fakta."],
    explanation: "Věcná informace (co to je, kolik toho je, kolik to stojí) netlačí ani nestraší — je poctivá.",
  }),
  choice("Kamarád chce koupit tenisky, protože je nosí slavný sportovec. Co mu poradíš?", "ať zjistí, jestli je opravdu potřebuje", [
    { value: "ať je koupí hned", why: "Tak by koupil jen kvůli reklamě." },
    { value: "ať koupí rovnou dvoje", why: "To by byla ještě větší útrata." },
    { value: "ať věří každé reklamě", why: "Reklama chce hlavně prodat." },
  ], {
    hints: ["Proč sportovec tenisky nosí v reklamě?", "Sportovec dostává za reklamu zaplaceno. Důležité je, jestli budou tenisky dobré právě kamarádovi."],
    explanation: "Důležité je, jestli budou tenisky pohodlné a jestli je kamarád potřebuje — ne kdo je nosí v reklamě.",
  }),
  choice("Proč je dobré s nákupem z reklamy den počkat?", "rozmyslím si, jestli to opravdu chci", [
    { value: "výrobek se mezitím zlepší", why: "Za den se výrobek nezmění." },
    { value: "zítra bude všechno zadarmo", why: "To se nestane." },
    { value: "reklama zmizí z televize", why: "O reklamu nejde, jde o tvé rozhodnutí." },
  ], {
    hints: ["Chceš tu věc i druhý den?", "Reklama chce, abychom se rozhodli hned. Když počkáme, rozhodneme se s klidnou hlavou."],
    explanation: "Když den počkáme, reklama na nás přestane tlačit a rozmyslíme si, jestli věc opravdu chceme.",
  }),
  choice("Na obalu stojí „100% přírodní“. Znamená to, že výrobek nemá žádné přidané látky?", "ne nutně, je dobré přečíst složení", [
    { value: "ano, vždycky", why: "„Přírodní“ je slovo z reklamy, ne záruka." },
    { value: "ano, přírodní znamená zdravý", why: "I přírodní věci mohou být nezdravé." },
    { value: "ne, přírodní výrobky neexistují", why: "Existují — jen to slovo samo nic nezaručuje." },
  ], {
    hints: ["Kde na obalu zjistíš, co v něm opravdu je?", "Slova na přední straně obalu chtějí prodat. Pravdu řekne složení vzadu drobným písmem."],
    explanation: "„Přírodní“ zní dobře, ale nic nezaručuje. Pravdu řekne složení na obalu.",
  }),
  choice("Která reklama straší?", "Bez naší vitamínové žvýkačky budeš pořád nemocný!", [
    { value: "Naše sušenky — chuť rodinné pohody.", why: "Tahle slibuje hezký pocit." },
    { value: "Jen dnes o polovinu levnější!", why: "Tahle tlačí na spěch." },
    { value: "Má to celá třída!", why: "Tahle tlačí na to, že to mají všichni." },
  ], {
    hints: ["Která reklama ti naznačuje, že se ti stane něco zlého?", "Strašení funguje tak, že nás vyleká a výrobek nabídne jako záchranu."],
    explanation: "Reklama vyhrožuje nemocí a žvýkačku nabízí jako záchranu — to je strašení.",
  }),
  choice("Která reklama slibuje hezký pocit?", "Naše sušenky — chuť rodinné pohody.", [
    { value: "Bez našich vitamínů budeš pořád nemocný!", why: "Tahle straší." },
    { value: "Jen dnes o polovinu levnější!", why: "Tahle tlačí na spěch." },
    { value: "Doporučeno odborníky!", why: "Tahle se opírá o odborníky bez důkazu." },
  ], {
    hints: ["Ve které reklamě nejde o sušenky, ale o pocit?", "Některé reklamy nic neříkají o výrobku, jen ho spojí s pohodou, láskou nebo radostí."],
    explanation: "„Chuť rodinné pohody“ spojuje sušenky s příjemným pocitem, o sušenkách nic neříká.",
  }),
  choice("Reklama na hru na mobil láká „Stáhni zdarma!“. Na co si dát pozor?", "hra může chtít peníze až uvnitř", [
    { value: "zdarma je vždy úplně zdarma", why: "Mnoho her „zdarma“ chce platit za věci ve hře." },
    { value: "stahovat se nesmí nic", why: "Stahovat se smí, jen je dobré dávat pozor." },
    { value: "hra se sama smaže", why: "O to v reklamě nejde." },
  ], {
    hints: ["Jak na hře „zdarma“ firma vydělá?", "Stažení bývá zdarma, ale uvnitř se často nabízejí placené věci. Než něco zaplatíš, poraď se s rodiči."],
    explanation: "Hra „zdarma“ často chce peníze za věci uvnitř hry — je dobré na to myslet a poradit se s rodiči.",
  }),
  choice("Co mají reklamní triky společné?", "chtějí, abychom koupili bez přemýšlení", [
    { value: "všechny jsou zakázané", why: "Většina triků zakázaná není." },
    { value: "všechny říkají celou pravdu", why: "Triky naopak ukazují jen část pravdy." },
    { value: "všechny jsou jen pro dospělé", why: "Mnoho triků míří i na děti." },
  ], {
    hints: ["Proč reklama spěchá, straší nebo slibuje pocity?", "Všechny triky se snaží obejít rozum — abychom se rozhodli podle pocitu, ne podle toho, co opravdu potřebujeme."],
    explanation: "Reklamní triky chtějí, abychom koupili rychle a bez přemýšlení.",
  }),
  choice("Pod obrázkem kola je hvězdička: „*cena bez sedla a brzd“. Co je to za trik?", "podmínka malým písmem", [
    { value: "slavný člověk to chválí", why: "Nikdo slavný tu není." },
    { value: "strašení", why: "Nic tu nestraší." },
    { value: "slibuje hezký pocit", why: "Nejde tu o pocit, ale o schovanou informaci." },
  ], {
    hints: ["Co je napsané u hvězdičky?", "Lákavá cena je velká, důležitá informace, že kolo je bez sedla a brzd, je schovaná drobně."],
    explanation: "Důležitá informace (bez sedla a brzd) je schovaná u hvězdičky — podmínka malým písmem.",
  }),
  choice("Kdo ti o výrobku nejspíš řekne pravdu?", "nezávislý test výrobků", [
    { value: "reklama výrobce", why: "Výrobce chce prodat." },
    { value: "prodavač, který výrobek prodává", why: "Prodavač chce, abys koupil nebo koupila." },
    { value: "slogan na obalu", why: "Slogan je reklama." },
  ], {
    hints: ["Kdo z tvého nákupu nic nemá?", "Pravdu řekne spíš ten, kdo na prodeji nevydělá — třeba časopis nebo organizace, která výrobky testuje."],
    explanation: "Nezávislý test výrobek jen zkouší a nic neprodává — je nejspolehlivější.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const MANIPULATIVNIKOMUNIKACEVREKLAME: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-manipulativni-komunikace-v-reklame",
    displayName: "Triky v reklamě",
    title: "Manipulativní komunikace v reklamě",
    studentTitle: "Triky v reklamě",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Poznáš, jak reklamy manipulují, a naučíš se jim nepodléhat.",
    keywords: ["reklama", "slogan", "manipulace", "trik", "kritické myšlení", "spotřebitel"],
    goals: [
      "Poznat, k čemu reklama slouží",
      "Rozpoznat běžné reklamní triky",
      "Ověřit si tvrzení z reklamy",
    ],
    boundaries: ["Bez analýzy politické propagandy", "Bez odborných názvů technik"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky"],
    generator: gen,
    helpTemplate: {
      hint: "Reklama chce prodat. Ptej se: Kdo to říká? Co z toho má? Opravdu to potřebuju?",
      steps: [
        "Kdo reklamu platí a co chce?",
        "Jaký trik používá (slavný člověk, všichni to mají, spěch, pocit, odborníci, nejlepší, hvězdička, strach)?",
        "Dá se tvrzení ověřit?",
        "Opravdu tu věc potřebuju?",
      ],
      commonMistake: "Věřit, že slavný člověk nebo slovo „nejlepší“ dokazuje kvalitu výrobku",
      example: "„Poslední tři kusy!“ → trik: spěchej, jinak to zmizí",
    },
  },
];
