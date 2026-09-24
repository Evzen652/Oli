/**
 * Výchova k občanství 6. ročník — Vrstevnické vztahy, kamarádství, řešení
 * konfliktů (select_one).
 *
 * Tři disjunktní autorské pooly (žádné náhodné dosazování čísel — obsah je
 * jazykový a situační, takže je psaný ručně, jako u faktických témat
 * přírodopisu/dějepisu):
 *  • L1 — rozpoznání pravidla/pojmu: definice kamarádství, definice já-výroku,
 *    zjevně vhodná reakce mezi zjevně nevhodnými (křičet, mlčet, prosadit se
 *    silou). Bez nutnosti domýšlet kontext.
 *  • L2 — aplikace: konkrétní běžná situace mezi vrstevníky (neshoda při hře,
 *    nedorozumění, zapomenutá půjčená věc) a výběr nejvhodnějšího kroku mezi
 *    věrohodnými, blízkými distraktory.
 *  • L3 — transfer/analýza: rozlišení jazykově podobných, obsahově odlišných
 *    jevů — pravý já-výrok vs. skrytá výtka formulovaná jako „já…“, skutečný
 *    kompromis (ústupek obou stran) vs. jednostranný ústupek, a posouzení,
 *    zda jde o běžnou neshodu, kterou si děti vyřeší samy, nebo o situaci,
 *    kde je namístě přivolat dospělého (bez líčení konkrétního ubližování).
 *
 * Chybový model (viz distraktory): já-výrok jen podle slova „já“ bez ohledu
 * na obsah; kompromis ztotožněný s jednostranným ústupkem; pasivní vyhýbání
 * se (mlčet, čekat) nebo prosazení silou/hlasitěji považované za řešení;
 * špatný odhad přiměřenosti reakce (zbytečná eskalace k dospělému u
 * banality, nebo naopak „vyřešte si to sami“ u opakované nerovné situace).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, ruzneUlohy, losUlohy, buildChoiceTask as choice } from "./_shared";

/** Wrapper: naše distraktory jsou vždy tři různé, takže choice() nikdy nevrátí null. */
function c(
  question: string,
  correct: string,
  distractors: { value: string; why: string }[],
  parts: { hints: string[]; explanation: string },
): () => PracticeTask {
  return () => {
    const t = choice(question, correct, distractors, parts);
    if (!t) throw new Error(`vrstevnickeVztahyReseniKonfliktu: ambiguous options — ${question}`);
    return t;
  };
}

// ── L1 — rozpoznání definice/pojmu ─────────────────────────────────────────

// L1-A — definice kamarádství (vs. známost / soupeření / lhostejnost / užitek).
const L1_KAMARADSTVI: (() => PracticeTask)[] = [
  c(
    "Co nejlépe vystihuje, čím se liší kamarádství od pouhé známosti?",
    "Kamarádství navíc znamená vzájemnou důvěru a ochotu si pomoct",
    [
      { value: "Kamarádství znamená hlavně sedět spolu ve stejné lavici", why: "To je jen společné místo, ne kamarádství. Kamarádství navíc potřebuje důvěru a ochotu si pomoct." },
      { value: "Kamarádství znamená hlavně být ve všem lepší než ten druhý", why: "Snaha být lepší než kamarád je spíš soupeření. Kamarádství je naopak o vzájemné pomoci, ne o soupeření." },
      { value: "Kamarádství znamená trávit spolu čas, i když jeden druhého vlastně nezajímá", why: "Bez skutečného zájmu o druhého jde jen o společně trávený čas, ne o kamarádství." },
    ],
    {
      hints: [
        "Kamarádství je víc než to, že jsou děti spolu na jednom místě — co k tomu ještě musí přibýt?",
        "Zkus si vzpomenout na vlastního kamaráda: co mezi vámi je navíc oproti spolužákovi, se kterým jen sedíš ve třídě?",
      ],
      explanation: "Kamarádství se od pouhé známosti liší tím, že k sobě navíc mají vzájemnou důvěru a ochotu si pomoct — ne jen společné místo, soupeření nebo lhostejnost.",
    },
  ),
  c(
    "Které tvrzení o kamarádství je správné?",
    "Kamarádi si navzájem pomáhají a sdílejí společné zájmy",
    [
      { value: "Kamarádi spolu musí mít úplně stejný názor na všechno", why: "Kamarádi můžou mít různé názory — kamarádství není o tom mít vždy stejný názor, ale o vzájemné pomoci a společných zájmech." },
      { value: "Kamarádi si navzájem pomáhají, jen když z toho něco mají", why: "Pomoc jen za odměnu není opravdové kamarádství. To je pomoc bez očekávání odměny." },
      { value: "Kamarádi jsou lidé, kteří spolu bydlí ve stejné ulici", why: "Bydlet blízko sebe je jen náhoda, ne kamarádství. To vzniká na základě důvěry a společných zájmů." },
    ],
    {
      hints: [
        "Co dělá kamarády kamarády — jen to, že spolu bydlí blízko, nebo něco víc?",
        "Zamysli se, jestli kamarádství znamená mít vždy stejný názor, pomáhat jen za odměnu, nebo něco jiného.",
      ],
      explanation: "Kamarádství stojí na tom, že si lidé navzájem pomáhají a mají společné zájmy — ne na stejném názoru na všechno, na pomoci jen za odměnu nebo na bydlišti.",
    },
  ),
  c(
    "Co odlišuje opravdové kamarádství od pouhého soupeření?",
    "V kamarádství si lidé navzájem pomáhají, nesnaží se jeden druhého porazit",
    [
      { value: "V kamarádství jde hlavně o to, kdo je lepší ve sportu nebo ve škole", why: "To je popis soupeření, ne kamarádství. Kamarádi si spíš pomáhají, než by se snažili jeden druhého porazit." },
      { value: "Kamarádství je založené na tom, že spolu chodí do stejného kroužku", why: "Společný kroužek je jen příležitost se potkávat, samo o sobě kamarádství nedělá." },
      { value: "Opravdové kamarádství znamená vždy souhlasit s tím, co chce kamarád", why: "Souhlasit se vším není kamarádství, ale podřizování se. Kamarádství je o vzájemné pomoci, ne o vzdání se vlastního názoru." },
    ],
    {
      hints: [
        "Je kamarádství o tom, kdo je lepší, nebo o něčem jiném?",
        "Rozmysli si, čím se liší kamarádství od soupeření a od pouhého společného kroužku.",
      ],
      explanation: "Opravdové kamarádství znamená vzájemnou pomoc, ne snahu jeden druhého porazit, společný kroužek sám o sobě ani podřizování se všemu, co kamarád chce.",
    },
  ),
  c(
    "Která vlastnost patří ke kamarádství nejvíc?",
    "Důvěra — kamarádovi se dá věřit a spolehnout se na něj",
    [
      { value: "Podobnost — kamarádi musí mít úplně stejné koníčky", why: "Kamarádi mohou mít různé koníčky. Důležitější než stejné zájmy je důvěra a ochota si pomoct." },
      { value: "Užitečnost — kamarád je hlavně ten, kdo mi půjčuje věci", why: "Pokud jde jen o půjčování věcí, je to výhodný vztah, ne kamarádství. To stojí na důvěře, ne na užitku." },
      { value: "Poslušnost — dobrý kamarád vždycky udělá, co po něm chci", why: "Kamarádství neznamená poslouchat na povel. Je o vzájemné důvěře a pomoci, ne o podřízenosti." },
    ],
    {
      hints: [
        "Která vlastnost dělá vztah kamarádstvím, a ne jen výhodným spojenectvím?",
        "Zvaž, jestli je nejdůležitější stejné koníčky, užitečnost, poslušnost, nebo něco jiného.",
      ],
      explanation: "Nejdůležitější pro kamarádství je důvěra — že se na kamaráda dá spolehnout. Stejné koníčky, užitečnost ani poslušnost to nenahradí.",
    },
  ),
];

// L1-B — definice já-výroku (abstraktní, bez konkrétní věty k rozboru).
const L1_JA_VYROK: (() => PracticeTask)[] = [
  c(
    "Co přesně je já-výrok?",
    "Věta, ve které popíšu svůj vlastní pocit a přání, ne to, co druhý udělal špatně",
    [
      { value: "Jakákoli věta, která začíná slovem já", why: "Nezáleží na tom, jestli věta začíná slovem já. Pokud v ní hodnotíš nebo obviňuješ druhého, já-výrok to není." },
      { value: "Věta, kterou řeknu nahlas a důrazně", why: "Já-výrok není o hlasitosti nebo důrazu, ale o tom, že popisuje můj vlastní pocit, ne chování druhého." },
      { value: "Věta, ve které řeknu kamarádovi, co dělá špatně", why: "To je spíš výtka nebo obvinění. Já-výrok mluví o mém pocitu, ne o tom, co druhý dělá špatně." },
    ],
    {
      hints: [
        "Zamysli se, o čem má já-výrok mluvit — o mně, nebo o tom druhém?",
        "Slovo já na začátku věty samo o sobě nic neurčuje. Podstatné je, co věta popisuje.",
      ],
      explanation: "Já-výrok popisuje můj vlastní pocit a přání, ne to, co druhý udělal špatně. Nezáleží na hlasitosti ani na tom, že věta začíná slovem já.",
    },
  ),
  c(
    "Jak je já-výrok postavený?",
    "Popisuje, co cítím a co bych potřeboval, bez obviňování druhého",
    [
      { value: "Popisuje, co si myslím o chování druhého člověka", why: "To je hodnocení druhého, ne popis vlastního pocitu. Já-výrok mluví o mně, ne o tom, co si myslím o druhém." },
      { value: "Popisuje, čeho se kamarád dopustil", why: "Popis toho, co udělal druhý, je obvinění, ne já-výrok. Já-výrok popisuje můj pocit a potřebu." },
      { value: "Popisuje, jak by se měl kamarád příště chovat", why: "Radit druhému, jak se má chovat, není já-výrok. Ten mluví jen o mém vlastním pocitu a potřebě." },
    ],
    {
      hints: [
        "Má já-výrok popisovat, co si myslím o druhém, nebo co cítím sám?",
        "Rozmysli si rozdíl mezi popsat vlastní pocit a hodnotit chování druhého.",
      ],
      explanation: "Já-výrok popisuje, co cítím a co bych potřeboval — ne to, co si myslím o druhém, co udělal, nebo jak by se měl chovat.",
    },
  ),
  c(
    "K čemu je já-výrok dobrý?",
    "Řekne druhému můj pocit tak, aby se necítil obviněný",
    [
      { value: "K tomu, aby druhý pochopil, že udělal chybu", why: "Cílem já-výroku není ukázat druhému jeho chybu, ale sdělit vlastní pocit, aniž bych ho obviňoval." },
      { value: "K tomu, aby si kamarád uvědomil, jak je sobecký", why: "Nálepkovat druhého je hodnocení, ne já-výrok. Ten popisuje jen můj pocit, žádné hodnocení druhého." },
      { value: "K tomu, abych dal jasně najevo, kdo za konflikt může", why: "Hledání viníka není cílem já-výroku. Ten má sdělit můj pocit, ne určit, kdo za co může." },
    ],
    {
      hints: [
        "Má být cílem já-výroku ukázat druhému jeho chybu, nebo něco jiného?",
        "Zamysli se, čím se liší sdělení vlastního pocitu od hledání viníka.",
      ],
      explanation: "Já-výrok má sdělit druhému můj pocit tak, aby se necítil obviněný — ne ukázat mu chybu, nálepkovat ho nebo hledat viníka.",
    },
  ),
  c(
    "Co má já-výrok navíc oproti obyčejné výtce?",
    "Mluví o mém pocitu, ne o chybě toho druhého",
    [
      { value: "Je vyslovený tišeji a klidněji než výtka", why: "Rozdíl není v hlasitosti, ale v obsahu — já-výrok popisuje můj pocit, výtka popisuje chybu druhého." },
      { value: "Obsahuje víc podrobností o tom, co se stalo", why: "Množství podrobností já-výrok nedělá. Rozhoduje to, jestli věta mluví o mém pocitu, nebo o chybě druhého." },
      { value: "Je delší a zdvořilejší formulace téže výtky", why: "I zdvořilá věta zůstává výtkou, pokud mluví o chybě druhého. Já-výrok musí mluvit o mém vlastním pocitu." },
    ],
    {
      hints: [
        "Co je hlavním rozdílem mezi já-výrokem a obyčejnou výtkou?",
        "Zvaž, jestli rozhoduje hlasitost, délka věty, nebo to, o kom věta mluví.",
      ],
      explanation: "Já-výrok mluví o mém pocitu, ne o chybě toho druhého. Rozdíl od výtky není v hlasitosti ani v délce věty.",
    },
  ),
];

// L1-C — zjevně vhodná reakce mezi zjevně nevhodnými (křičet / mlčet a čekat / prosadit se silou).
const L1_REAKCE: (() => PracticeTask)[] = [
  c(
    "Dva kamarádi se neshodnou na tom, jakou hru budou hrát. Která reakce je vhodná?",
    "Klidně říct, co by ho bavilo, a vyslechnout si i názor kamaráda",
    [
      { value: "Křičet, dokud kamarád neustoupí", why: "Křik nic neřeší a spíš konflikt zhoršuje." },
      { value: "Mlčet a čekat, až to samo přejde", why: "Mlčení neshodu nevyřeší, jen ji odloží." },
      { value: "Prosadit si svoje, i kdyby to znamenalo hádku", why: "Prosazovat se za každou cenu znamená nebrat ohled na kamaráda." },
    ],
    {
      hints: [
        "Vyřeší se taková neshoda křikem, mlčením nebo tvrdým prosazováním se, nebo to jde i jinak?",
        "Zamysli se, jestli křik, mlčení nebo prosazení síly neshodu doopravdy řeší.",
      ],
      explanation: "Nejvhodnější je klidně říct, co by kamaráda bavilo, a vyslechnout si i názor toho druhého — křik, mlčení a prosazování se za každou cenu neshodu neřeší.",
    },
  ),
  c(
    "Sourozenci se nemohou shodnout, který film pustí. Která reakce je vhodná?",
    "Říct, co by chtěl dívat, a společně najít řešení, které vyhovuje oběma",
    [
      { value: "Zvýšit hlas, aby ten druhý ustoupil", why: "Zvyšovat hlas problém neřeší, spíš druhého odradí od domluvy." },
      { value: "Nechat to být a tvářit se, že je to jedno", why: "Předstírat, že na tom nezáleží, neshodu jen skryje, nevyřeší." },
      { value: "Trvat na svém filmu, ať to stojí, co to stojí", why: "Trvat na svém bez ohledu na druhého vede k dalšímu konfliktu." },
    ],
    {
      hints: [
        "Vede ke shodě zvyšování hlasu, předstíraná lhostejnost nebo tvrdošíjné trvání na svém, nebo je vhodnější jiný postup?",
        "Zvaž, jestli předstírání, že na tom nezáleží, neshodu doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je říct svůj názor a společně najít řešení, které vyhovuje oběma — zvyšování hlasu, předstírání lhostejnosti ani trvání na svém domluvě nepomůžou.",
    },
  ),
  c(
    "Dva spolužáci se přou o to, kdo bude ve hře na tahu první. Která reakce je vhodná?",
    "Popsat, proč mi na tom záleží, a poslechnout si, proč na tom záleží kamarádovi",
    [
      { value: "Hádat se čím dál hlasitěji, dokud jeden nevyhraje", why: "Hlasitá hádka spor jen vyostří." },
      { value: "Přestat s kamarádem mluvit a čekat, co udělá on", why: "Odmlčení problém sám nevyřeší." },
      { value: "Prostě si vzít první tah, i když s tím kamarád nesouhlasí", why: "Prosadit se bez souhlasu druhého konflikt jen prodlouží." },
    ],
    {
      hints: [
        "Vyřeší spor hlasitá hádka, mlčení nebo prosazení bez souhlasu druhého, nebo existuje lepší cesta?",
        "Zamysli se, jestli mlčení nebo prosazení bez souhlasu druhého neshodu doopravdy uzavře.",
      ],
      explanation: "Nejvhodnější je popsat svůj důvod a vyslechnout si i důvod kamaráda — hlasitá hádka, odmlčení nebo prosazení bez souhlasu neshodu jen prodlouží.",
    },
  ),
  c(
    "Kamarádi se neshodnou, kam půjdou o přestávce. Která reakce je vhodná?",
    "Vysvětlit, co by chtěl dělat, a společně najít shodu",
    [
      { value: "Křičet na kamaráda, ať jde tam, kam chce on", why: "Křik na druhého situaci jen zhorší." },
      { value: "Odejít bez slova a nechat kamaráda, ať si to vyřeší sám", why: "Mlčky odejít problém neřeší, jen ho obchází." },
      { value: "Prosadit svůj nápad silněji, dokud kamarád nesouhlasí", why: "Prosazovat se silou k dohodě nevede." },
    ],
    {
      hints: [
        "Vede k dohodě křik, tiché odejití nebo silnější prosazování vlastního nápadu, nebo to jde i jinak?",
        "Zvaž, jestli tiché odejití problém doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je vysvětlit svůj návrh a společně najít shodu — křik, tiché odejití ani silnější prosazování nápadu k dohodě nevedou.",
    },
  ),
  c(
    "Kamarádi se nemohou domluvit, kdo bude mít v družstvu jakou roli. Která reakce je vhodná?",
    "Říct, jakou roli bych chtěl, a vyslechnout si přání kamaráda",
    [
      { value: "Hlasitě trvat na tom, že rozhodne ten silnější", why: "Rozhodovat podle síly nebo hlasitosti spor jen prohloubí." },
      { value: "Mlčky přijmout roli, kterou určí kamarád, i když se mi nelíbí", why: "Mlčky se podřídit není řešení, je to jen odložení nespokojenosti." },
      { value: "Odmítnout hrát, dokud nedostanu roli, jakou chci", why: "Odmítnutí hry jako nátlak konflikt neřeší." },
    ],
    {
      hints: [
        "Rozhodne o rolích síla, mlčenlivé podřízení se nebo odmítnutí hrát, nebo je vhodnější jiný přístup?",
        "Zamysli se, jestli mlčky přijmout, nebo odmítnout hrát neshodu doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je říct svoje přání a vyslechnout si i přání kamaráda — rozhodování podle síly, mlčky přijaté podřízení ani odmítnutí hrát k dohodě nevedou.",
    },
  ),
];

function genL1(): PracticeTask {
  return pick([...L1_KAMARADSTVI, ...L1_JA_VYROK, ...L1_REAKCE])();
}

// ── L2 — aplikace na konkrétní situaci ─────────────────────────────────────

// L2 skupina 1 — neshoda při hře → skutečný kompromis (ne jednostranný ústupek, ne síla, ne pasivita).
const L2_HRA: (() => PracticeTask)[] = [
  c(
    "Tomáš a Filip hrají spolu deskovou hru a neshodnou se, podle jakých pravidel budou hrát. Co je nejvhodnější krok?",
    "Navrhnout pravidlo, které bude aspoň trochu vyhovovat oběma, a společně ho dohodnout",
    [
      { value: "Nechat rozhodnout Filipa, protože Tomáš už nemá sílu se dál dohadovat", why: "To není kompromis, ale jednostranný ústupek — rozhodne jen jeden a druhý se prostě vzdá." },
      { value: "Hrát dál a hlasitě prosazovat svoje pravidlo, dokud kamarád neustoupí", why: "Prosazovat se hlasitěji je nátlak, ne domluva." },
      { value: "Přestat hru hrát a mlčky odejít", why: "Odejít bez slova neshodu neřeší, jen ji odloží." },
    ],
    {
      hints: [
        "Rozhodne o pravidlech jen jeden, nebo hlasitější hráč, nebo tichý odchod ze hry, nebo se to dá řešit jinak?",
        "Zamysli se, jestli hlasité prosazování nebo tiché odejití spor doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je navrhnout pravidlo, které bude vyhovovat aspoň trochu oběma, a domluvit se na něm společně — nechat rozhodnout jen jednoho, prosazovat se hlasitěji nebo mlčky odejít problém nevyřeší.",
    },
  ),
  c(
    "Ema a Nikola si chtějí hrát na hřišti, ale každá chce jinou hru. Co je nejvhodnější krok?",
    "Domluvit se, že chvíli budou hrát jednu hru a chvíli druhou",
    [
      { value: "Nechat vždycky vyhrát Nikolu, protože je hlasitější", why: "Rozhodovat podle toho, kdo je hlasitější, není domluva, je to prosazení silou." },
      { value: "Ema ať ustoupí a souhlasí s Nikolinou hrou, aby měla klid", why: "To je jednostranný ústupek jedné strany, ne domluva vyhovující oběma." },
      { value: "Obě mlčky sedět, dokud jedna nenavrhne, co bude", why: "Čekání v tichosti problém neřeší." },
    ],
    {
      hints: [
        "Rozhodne to, kdo je hlasitější, nebo to, že jedna z nich prostě ustoupí, nebo se to dá vyřešit jinak?",
        "Zvaž, jestli rozhodovat podle hlasitosti nebo nechat jednu stranu ustoupit je opravdová domluva.",
      ],
      explanation: "Nejvhodnější je domluvit se, že si zahrají chvíli jednu hru a chvíli druhou — rozhodování podle hlasitosti ani jednostranný ústupek to nenahradí.",
    },
  ),
  c(
    "Jakub a David se neshodnou, čí je řada na houpačce. Co je nejvhodnější krok?",
    "Domluvit se na tom, jak dlouho se bude každý houpat, aby se vystřídali",
    [
      { value: "Jakub ať se houpačky rovnou vzdá, aby nebyl spor", why: "Vzdát se bez domluvy je jednostranný ústupek, ne řešení pro oba." },
      { value: "Kdo se dřív na houpačku pověsí silou, ten vyhrává", why: "Rozhodovat silou je nátlak, ne domluva." },
      { value: "Oba mlčky čekat, až se ten druhý sám unaví", why: "Čekání beze slova problém neřeší." },
    ],
    {
      hints: [
        "Rozhodne o houpačce síla, nebo to, že se jeden rovnou vzdá, nebo existuje lepší způsob?",
        "Zamysli se, jestli vzdát se bez řeči nebo mlčky čekat neshodu doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je domluvit se, jak dlouho se bude každý houpat, aby se vystřídali — rozhodování silou, vzdání se bez domluvy ani tiché čekání to nenahradí.",
    },
  ),
  c(
    "Karolína a Matěj hrají fotbal a neshodnou se, kdo bude v jaké pozici. Co je nejvhodnější krok?",
    "Říct si navzájem, jakou pozici by kdo chtěl, a domluvit se, jak se vystřídají",
    [
      { value: "Karolína ať přijme pozici, kterou určí Matěj, aby to měli rychle za sebou", why: "To je jednostranný ústupek, ne domluva." },
      { value: "Kdo si hlasitěji řekne o pozici, ten ji dostane", why: "Rozhodovat podle hlasitosti je prosazování silou." },
      { value: "Přestat hrát a čekat, až přijde někdo další, kdo to rozhodne", why: "Čekání na někoho jiného problém neřeší." },
    ],
    {
      hints: [
        "Rozhodne o pozici jen jeden, nebo hlasitost, nebo je vhodnější jiný postup?",
        "Zvaž, jestli tu rozhoduje hlasitost, nebo domluva mezi oběma.",
      ],
      explanation: "Nejvhodnější je říct si navzájem, jakou pozici by kdo chtěl, a domluvit se na střídání — jednostranné přijetí, rozhodování podle hlasitosti ani čekání na někoho jiného to nenahradí.",
    },
  ),
  c(
    "Barbora a Jakub se neshodnou, jakou stavbu budou spolu stavět z kostek. Co je nejvhodnější krok?",
    "Domluvit se na společné stavbě, do které přidá nápad každý z nich",
    [
      { value: "Barbora ať nechá rozhodnout jen Jakuba, aby to bylo rychle vyřešené", why: "To je jednostranný ústupek, ne domluva." },
      { value: "Kdo si hlasitěji řekne o svém nápadu, ten rozhoduje", why: "Rozhodovat podle hlasitosti je prosazování silou." },
      { value: "Přestat stavět a čekat, až přijde někdo, kdo to rozhodne za ně", why: "Čekání na někoho jiného problém neřeší." },
    ],
    {
      hints: [
        "Rozhodne o stavbě jen jeden nápad, nebo hlasitost, nebo se dá postupovat jinak?",
        "Zamysli se, jestli hlasitost nebo čekání na někoho jiného spor doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je domluvit se na společné stavbě, do které přidá nápad každý z nich — nechat rozhodnout jen jednoho, hlasitost ani čekání na někoho jiného to nenahradí.",
    },
  ),
];

// L2 skupina 2 — nedorozumění → pravý já-výrok + otázka (ne nálepka, ne mlčení, ne odplata).
const L2_NEDOROZUMENI: (() => PracticeTask)[] = [
  c(
    "Petra si myslí, že ji Šimon o přestávce ignoroval, ale ve skutečnosti si jen nevšiml, že přišla. Co je nejvhodnější krok pro Petru?",
    "Říct Šimonovi, že ji mrzelo, že si jí nevšiml, a zeptat se, jak to bylo",
    [
      { value: "Říct Šimonovi, že je sobec, protože si jí vůbec nevšímá", why: "To je nálepkování a obvinění, ne popis vlastního pocitu." },
      { value: "Mlčky se na Šimona urazit a nemluvit s ním", why: "Mlčení nedorozumění nevyřeší, jen ho prodlouží." },
      { value: "Nahlas před ostatními říct, že si jí Šimon nikdy nevšímá", why: "Veřejné obviňování situaci jen zhorší." },
    ],
    {
      hints: [
        "Má Petra hodnotit Šimona, nebo popsat, co sama cítila?",
        "Zvaž, jestli mlčení nebo veřejné obviňování nedorozumění doopravdy vysvětlí.",
      ],
      explanation: "Nejvhodnější je říct Šimonovi, že ji mrzelo, že si jí nevšiml, a zeptat se, jak to bylo — nálepkování, mlčení ani veřejné obviňování nedorozumění nevyjasní.",
    },
  ),
  c(
    "Filip si myslí, že mu Anna schválně neopětovala pozdrav, i když ho možná jen neslyšela. Co je nejvhodnější krok?",
    "Říct Anně, že ho mrzelo, že nezareagovala, a zeptat se, jestli ho slyšela",
    [
      { value: "Říct Anně, že je namyšlená, protože ho ignoruje", why: "Nálepka je hodnocení osoby, ne popis vlastního pocitu." },
      { value: "Přestat Anně příště pozdravit, aby to pocítila taky", why: "Oplácet stejným je pasivní odplata, ne řešení nedorozumění." },
      { value: "Nahlas si před ostatními stěžovat, jak je Anna neslušná", why: "Veřejná stížnost nedorozumění nevyřeší, jen ho zhorší." },
    ],
    {
      hints: [
        "Má Filip nálepkovat Annu, nebo popsat svůj vlastní pocit?",
        "Zamysli se, jestli oplácet stejným nebo si stěžovat před ostatními nedorozumění doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je říct Anně, že ho mrzelo, že nezareagovala, a zeptat se, jestli ho slyšela — nálepka, oplácení ani veřejná stížnost nedorozumění nevyjasní.",
    },
  ),
  c(
    "Tereza si myslí, že se jí Adam vysmál, i když se možná smál něčemu jinému. Co je nejvhodnější krok?",
    "Říct Adamovi, že ji zamrzelo, že se smál, a zeptat se, čemu se vlastně smál",
    [
      { value: "Říct Adamovi, že je zlý, protože se jí posmívá", why: "To je hodnocení a obvinění druhého, ne popis vlastního pocitu." },
      { value: "Přestat s Adamem mluvit a čekat, jestli si toho všimne", why: "Mlčení nedorozumění samo nevyřeší." },
      { value: "Okamžitě mu to hlasitě vrátit stejným posměchem", why: "Odplácet posměchem konflikt jen prohloubí." },
    ],
    {
      hints: [
        "Má Tereza Adama obvinit, nebo popsat, co sama cítí?",
        "Zvaž, jestli mlčení nebo odplácení stejným posměchem nedorozumění doopravdy vysvětlí.",
      ],
      explanation: "Nejvhodnější je říct Adamovi, že ji zamrzelo, že se smál, a zeptat se, čemu se smál — obvinění, mlčení ani odplácení posměchem nedorozumění nevyjasní.",
    },
  ),
  c(
    "Matěj si myslí, že ho Ema schválně nepočkala cestou ze školy, i když možná pospíchala domů. Co je nejvhodnější krok?",
    "Říct Emě, že ho mrzelo, že nepočkala, a zeptat se, co se dělo",
    [
      { value: "Říct Emě, že je nekamarádská, protože na něj nečeká", why: "Nálepka je hodnocení, ne popis pocitu." },
      { value: "Přestat s Emou chodit ze školy, aby si to uvědomila", why: "Tiché vyhýbání se problém neřeší, jen ho skrývá." },
      { value: "Nahlas si na ni postěžovat před ostatními spolužáky", why: "Veřejné stěžování situaci zhorší." },
    ],
    {
      hints: [
        "Má Matěj Emu nálepkovat, nebo popsat, co sám cítí?",
        "Zamysli se, jestli tiché vyhýbání se nebo veřejné stěžování nedorozumění doopravdy vyřeší.",
      ],
      explanation: "Nejvhodnější je říct Emě, že ho mrzelo, že nepočkala, a zeptat se, co se dělo — nálepka, vyhýbání se ani veřejné stěžování nedorozumění nevyjasní.",
    },
  ),
];

// L2 skupina 3 — zapomenutá půjčená věc → klidná žádost o vrácení (ne nálepka, ne mlčení, ne odplata).
const L2_PUJCENA_VEC: (() => PracticeTask)[] = [
  c(
    "Anna si od Kláry půjčila pastelky a zapomněla je vrátit. Klára je teď naštvaná. Co je pro Kláru nejvhodnější krok?",
    "Říct Anně, že jí ty pastelky chybí a že by je ráda dostala zpátky",
    [
      { value: "Říct Anně před celou třídou, že je nespolehlivá", why: "Veřejné obvinění situaci zhorší a je to hodnocení osoby, ne popis potřeby." },
      { value: "Přestat Anně cokoliv půjčovat a nic jí neříct", why: "Mlčky přestat půjčovat problém neřeší, Anna se ani nedozví, co se stalo." },
      { value: "Vzít si bez dovolení něco Annino, aby to bylo vyrovnané", why: "Brát si věci bez dovolení je nesprávné řešení." },
    ],
    {
      hints: [
        "Vyřeší to veřejné obvinění, mlčky přestat půjčovat, nebo vzít si něco na oplátku, nebo je lepší jiný způsob?",
        "Zvaž, jestli mlčení nebo braní si věcí bez dovolení věc doopravdy vrátí.",
      ],
      explanation: "Nejvhodnější je říct Anně, že jí pastelky chybí a že by je ráda dostala zpátky — veřejné obvinění, mlčení ani braní si věcí bez dovolení věc nezajistí.",
    },
  ),
  c(
    "Ondřej zapomněl Petrovi vrátit půjčenou knihu. Petr ji teď potřebuje. Co je pro Petra nejvhodnější krok?",
    "Připomenout Ondřejovi, že knihu potřebuje, a požádat ho, aby ji přinesl",
    [
      { value: "Nahlas Ondřeje před spolužáky obvinit, že si věci nechává", why: "Veřejné obviňování situaci jen zhorší." },
      { value: "Mlčky čekat, jestli si Ondřej sám vzpomene", why: "Čekání beze slova problém neřeší, Ondřej se to ani nedozví." },
      { value: "Vzít si na oplátku bez dovolení něco Ondřejovo", why: "Brát si věci bez dovolení konflikt jen prohloubí." },
    ],
    {
      hints: [
        "Vyřeší to veřejné obvinění, tiché čekání, nebo vzít si něco na oplátku, nebo existuje lepší cesta?",
        "Zamysli se, jestli čekání nebo braní si věcí bez dovolení knihu doopravdy vrátí.",
      ],
      explanation: "Nejvhodnější je připomenout Ondřejovi, že knihu potřebuje, a požádat ho, aby ji přinesl — veřejné obvinění, čekání ani braní si věcí bez dovolení to nezajistí.",
    },
  ),
  c(
    "Nikola zapomněla Davidovi vrátit sešit, který si od něj půjčila. David ho potřebuje na úkol. Co je pro Davida nejvhodnější krok?",
    "Klidně Nikole říct, že sešit potřebuje, a domluvit se, kdy jí ho vrátí",
    [
      { value: "Říct Nikole, že je zapomnětlivá a nespolehlivá", why: "To je hodnocení osoby, ne sdělení potřeby." },
      { value: "Přestat si s Nikolou o přestávkách povídat", why: "Mlčky se odtáhnout problém s vráceným sešitem nevyřeší." },
      { value: "Hlasitě jí to vyčítat před ostatními spolužáky", why: "Veřejné vyčítání situaci zhorší." },
    ],
    {
      hints: [
        "Vyřeší to nálepkování, tiché odtažení se, nebo veřejné vyčítání, nebo je lepší jiný způsob?",
        "Zvaž, jestli odtažení se nebo veřejné vyčítání sešit doopravdy vrátí.",
      ],
      explanation: "Nejvhodnější je klidně Nikole říct, že sešit potřebuje, a domluvit se na vrácení — nálepka, odtažení se ani veřejné vyčítání to nezajistí.",
    },
  ),
  c(
    "Šimon zapomněl Kateřině vrátit fixy, které si od ní půjčil na projekt. Co je pro Kateřinu nejvhodnější krok?",
    "Slušně Šimona poprosit, aby jí fixy vrátil, protože je zase potřebuje",
    [
      { value: "Říct Šimonovi, že je sobec, protože jí fixy nevrátil", why: "Nálepka je hodnocení osoby, ne sdělení potřeby." },
      { value: "Nechat to být a už mu nic nepůjčovat, aniž by mu to řekla", why: "Mlčky přestat půjčovat věc nevyřeší — Šimon se to ani nedozví." },
      { value: "Vzít mu bez dovolení jinou věc jako náhradu", why: "Brát si věci bez dovolení je špatné řešení." },
    ],
    {
      hints: [
        "Vyřeší to nálepkování, mlčky přestat půjčovat, nebo vzít si jinou věc bez dovolení, nebo existuje lepší způsob?",
        "Zamysli se, jestli mlčení nebo braní si jiné věci fixy doopravdy vrátí.",
      ],
      explanation: "Nejvhodnější je slušně Šimona poprosit, aby fixy vrátil, protože je zase potřebuje — nálepka, mlčení ani braní si jiné věci to nezajistí.",
    },
  ),
];

function genL2(): PracticeTask {
  return pick([...L2_HRA, ...L2_NEDOROZUMENI, ...L2_PUJCENA_VEC])();
}

// ── L3 — transfer: rozlišení podobných, ale odlišných jevů ─────────────────

// L3-a — pravý já-výrok (popis pocitu) vs. skrytá výtka (hodnocení druhého formulované jako „já…").
const L3_JA_VYROK: (() => PracticeTask)[] = [
  c(
    "Petra řekla Filipovi: „Já myslím, že jsi vážně sobec.“ Co tahle věta doopravdy je?",
    "Skrytá výtka – jen vypadá jako já-výrok, ale ve skutečnosti hodnotí Filipa",
    [
      { value: "Skutečný já-výrok, protože začíná slovem já", why: "Slovo já na začátku samo o sobě já-výrok nedělá. Věta hodnotí Filipa (je sobec), takže je to skrytá výtka." },
      { value: "Kompromis, protože Petra řekla svůj názor", why: "Kompromis je společné řešení sporu s ústupkem na obou stranách, ne vyjádření názoru o druhém." },
      { value: "Aktivní naslouchání, protože Petra mluví o svých pocitech", why: "Věta nepopisuje Petřin pocit, ale hodnotí Filipa jako sobeckého." },
    ],
    {
      hints: [
        "Podívej se, jestli věta popisuje pocit Petry, nebo hodnotí Filipa.",
        "Nezáleží na tom, že věta začíná slovem já — rozhoduje, o čem doopravdy mluví.",
      ],
      explanation: "Věta hodnotí Filipa (že je sobec), takže je to jen skrytá výtka v přestrojení za já-výrok — nejde o popis vlastního pocitu.",
    },
  ),
  c(
    "Tomáš řekl Emě: „Já jsem naštvaný, protože jsme se domluvili na jinou hodinu a ty jsi nepřišla.“ Co tahle věta doopravdy je?",
    "Skutečný já-výrok – popisuje Tomášův pocit a důvod, ne hodnocení Emy",
    [
      { value: "Skrytá výtka, protože obsahuje slovo naštvaný", why: "Popsat vlastní pocit (naštvaný) není hodnocení druhého. Věta mluví o Tomášově pocitu a jeho důvodu." },
      { value: "Jednostranný ústupek, protože Tomáš přiznává svůj pocit", why: "Ústupek znamená vzdát se něčeho ve sporu, ne popsat pocit." },
      { value: "Prosazení silou, protože Tomáš mluví o tom, co se stalo", why: "Věta nikoho k ničemu nenutí, jen klidně popisuje pocit a důvod." },
    ],
    {
      hints: [
        "Podívej se, jestli věta hodnotí Emu, nebo popisuje Tomášův pocit a jeho důvod.",
        "Slovo naštvaný samo o sobě obvinění neznamená — záleží, co věta dál říká.",
      ],
      explanation: "Věta popisuje Tomášův pocit (naštvaný) a jeho důvod, aniž by Emu hodnotila — je to skutečný já-výrok.",
    },
  ),
  c(
    "David řekl Nikole: „Já si myslím, že se vůbec nesnažíš a je to jen tvoje chyba.“ Co tahle věta doopravdy je?",
    "Skrytá výtka – hodnotí Nikolu, i když začíná slovem já",
    [
      { value: "Skutečný já-výrok, protože David mluví v první osobě", why: "Mluvení v první osobě samo o sobě já-výrok nedělá. Věta hodnotí Nikolu (nesnaží se, je to její chyba)." },
      { value: "Aktivní naslouchání, protože David vyjadřuje svůj názor", why: "Naslouchání znamená poslouchat druhého, ne vyslovit soud o jeho chování." },
      { value: "Kompromis, protože David řekl, co si myslí", why: "Kompromis je společná dohoda s ústupkem obou stran, ne vyslovení kritiky." },
    ],
    {
      hints: [
        "Podívej se, jestli věta popisuje Davidův pocit, nebo hodnotí Nikolu.",
        "První osoba (já si myslím) sama o sobě já-výrok nedělá — záleží, co věta o Nikole říká.",
      ],
      explanation: "Věta hodnotí Nikolu (nesnaží se, je to její chyba), takže jde o skrytou výtku, i když začíná slovem já.",
    },
  ),
  c(
    "Karolína řekla Adamovi: „Je mi líto, že jsme se nedomluvili na čase, a mrzí mě, že jsme kvůli tomu nestihli program.“ Co tahle věta doopravdy je?",
    "Skutečný já-výrok – popisuje Karolínin pocit, ne Adamovu vinu",
    [
      { value: "Skrytá výtka, protože mluví o zmeškaném programu", why: "Popsat, co se stalo, a jak se kvůli tomu Karolína cítí, není obviňování." },
      { value: "Jednostranný ústupek, protože Karolína se omlouvá", why: "Ústupek znamená vzdát se něčeho ve sporu (například souhlasit s tím, co vlastně nechci). Slova „je mi líto“ tu vyjadřují lítost nad tím, co se stalo, ne vzdání se vlastního přání — Karolína se ničeho nevzdává, jen popisuje svůj pocit." },
      { value: "Přivolání dospělého, protože jde o vážnou situaci", why: "Tahle věta neřeší, koho zavolat na pomoc, jen popisuje pocit mezi dvěma kamarády." },
    ],
    {
      hints: [
        "Ústupek znamená, že se někdo něčeho vzdal ve sporu (třeba souhlasil s tím, co nechtěl) — zkontroluj, jestli se Karolína ve větě něčeho takového vzdává.",
        "Slova „je mi líto“ a „mrzí mě“ mohou znít jako omluva, ale samy o sobě neznamenají vzdání se vlastního přání — rozhoduje, jestli věta jen popisuje pocit, nebo naopak hodnotí toho druhého.",
      ],
      explanation: "Věta popisuje Karolínin pocit ze zmeškaného programu, aniž by hodnotila Adama — je to skutečný já-výrok. Nejde o ústupek, protože Karolína se ničeho nevzdává (nikomu nic neslibuje ani s ničím nesouhlasí) — jen říká, jak jí je.",
    },
  ),
  c(
    "Jakub řekl Tereze: „Já jsem z toho smutný, že jsme si nerozuměli, a chtěl bych to spolu probrat.“ Co tahle věta doopravdy je?",
    "Skutečný já-výrok – popisuje Jakubův pocit a přání, ne Terezinu vinu",
    [
      { value: "Skrytá výtka, protože zmiňuje, že si nerozuměli", why: "Zmínit, co se stalo, a popsat vlastní pocit není hodnocení druhého." },
      { value: "Prosazení silou, protože Jakub chce věc probrat", why: "Chtít věc v klidu probrat není nátlak ani prosazování se silou." },
      { value: "Jednostranný ústupek, protože Jakub navrhuje rozhovor", why: "Ústupek znamená vzdát se něčeho ve sporu, ne navrhnout rozhovor." },
    ],
    {
      hints: [
        "Podívej se, jestli věta hodnotí Terezu, nebo popisuje Jakubův pocit a přání.",
        "Návrh na rozhovor sám o sobě obvinění neznamená — záleží, co věta o Tereze říká.",
      ],
      explanation: "Věta popisuje Jakubův pocit a jeho přání si promluvit, aniž by Terezu hodnotila — je to skutečný já-výrok.",
    },
  ),
];

// L3-b — skutečný kompromis (ústupek obou stran) vs. jednostranný ústupek (vzdal se jen jeden).
const L3_KOMPROMIS: (() => PracticeTask)[] = [
  c(
    "Ema a Petr se neshodli, jestli o víkendu půjdou na kolo, nebo do parku. Nakonec pojedou půl cesty na kole a půl si zahrají v parku. Co to je?",
    "Skutečný kompromis – oba dostali aspoň část toho, co chtěli",
    [
      { value: "Jednostranný ústupek, protože nakonec jeli i na kolo", why: "Jednostranný ústupek by byl, kdyby jeden úplně ustoupil a druhý dostal všechno. Tady dostali oba část svého přání." },
      { value: "Prosazení silou, protože se museli domlouvat", why: "Domluva sama o sobě prosazování silou není." },
      { value: "Vyřešení dospělým, protože si to museli naplánovat", why: "V situaci nikdo dospělý nerozhodoval, Ema a Petr se domluvili sami." },
    ],
    {
      hints: [
        "Dostali z toho, co chtěli, oba dva, nebo jen jeden?",
        "Podívej se, jestli si domluva rozdělila čas mezi obě přání, nebo jedno přání úplně vyhrálo.",
      ],
      explanation: "Ema i Petr strávili čas jak na kole, tak v parku — oba dostali aspoň část toho, co chtěli, takže jde o skutečný kompromis.",
    },
  ),
  c(
    "Filip chtěl hrát fotbal, Matěj chtěl hrát honičku bez míče. Filip nakonec bez námitek souhlasil s honičkou, protože se mu nechtělo dál přesvědčovat. Co to je?",
    "Jednostranný ústupek – ustoupil jen Filip, Matěj dostal, co chtěl celé",
    [
      { value: "Skutečný kompromis, protože se nakonec dohodli", why: "Dohoda sama o sobě kompromis nedělá. Kompromis potřebuje ústupek na obou stranách — tady ustoupil jen Filip." },
      { value: "Aktivní naslouchání, protože Filip souhlasil", why: "Souhlasit bez vysloveného vlastního přání není naslouchání." },
      { value: "Přivolání dospělého, protože se museli domluvit", why: "V situaci žádný dospělý nezasahoval, Filip se jen sám vzdal svého přání." },
    ],
    {
      hints: [
        "Vzdal se něčeho jen jeden z kamarádů, nebo oba?",
        "Podívej se, jestli Matěj taky v něčem ustoupil, nebo dostal svou honičku celou.",
      ],
      explanation: "Matěj dostal honičku celou a Filip se svého přání úplně vzdal — vzdal se jen jeden, takže jde o jednostranný ústupek.",
    },
  ),
  c(
    "Anna chtěla poslouchat jednu skupinu hudby, Šimon jinou. Domluvili se, že si na cestě poslechnou obě, každou půlku cesty. Co to je?",
    "Skutečný kompromis – obě strany dostaly aspoň část toho, co chtěly",
    [
      { value: "Jednostranný ústupek, protože si poslechli Šimonovu hudbu", why: "Poslechli si hudbu obou, ne jen jednoho z nich." },
      { value: "Prosazení silou, protože si museli hudbu rozdělit", why: "Rozdělení podle domluvy není prosazování silou." },
      { value: "Skrytá výtka, protože si nejdřív nerozuměli", why: "V situaci nikdo druhého nehodnotil ani neobviňoval, jen se domluvili na rozdělení." },
    ],
    {
      hints: [
        "Poslechli si hudbu jen jednoho z nich, nebo obou?",
        "Podívej se, jestli si domluva rozdělila cestu mezi obě přání, nebo jedno úplně vyhrálo.",
      ],
      explanation: "Anna i Šimon si poslechli svou hudbu na polovině cesty — oba dostali část toho, co chtěli, takže jde o skutečný kompromis.",
    },
  ),
  c(
    "Kateřina chtěla malovat, Ondřej chtěl stavět z kostek. Kateřina nakonec bez řeči souhlasila se stavěním, aby se nemuseli dál dohadovat. Co to je?",
    "Jednostranný ústupek – ustoupila jen Kateřina, Ondřej dostal, co chtěl celé",
    [
      { value: "Skutečný kompromis, protože přestali se dohadovat", why: "To, že se přestali hádat, ještě neznamená kompromis. Kompromis potřebuje ústupek na obou stranách." },
      { value: "Já-výrok, protože Kateřina souhlasila potichu", why: "Já-výrok je věta popisující pocit, ne tiché podřízení se. Kateřina navíc svůj pocit vůbec nevyjádřila." },
      { value: "Přivolání dospělého, protože museli dojít k dohodě", why: "V situaci žádný dospělý nezasahoval. Kateřina se sama vzdala svého přání." },
    ],
    {
      hints: [
        "Vzdala se něčeho jen Kateřina, nebo i Ondřej?",
        "Podívej se, jestli Ondřej taky v něčem ustoupil, nebo dostal stavění celé.",
      ],
      explanation: "Ondřej dostal stavění celé a Kateřina se svého přání úplně vzdala beze slova — vzdala se jen jedna strana, takže jde o jednostranný ústupek.",
    },
  ),
];

// L3-c — posouzení: běžná neshoda, kterou si děti vyřeší samy, vs. situace, kde je namístě přivolat dospělého.
const L3_PRIVOLAT: (() => PracticeTask)[] = [
  c(
    "Dva kamarádi se poprvé pohádali o to, čí je řada na tahu ve hře, ale během chvíle se sami udobřili. Je namístě volat dospělého?",
    "Ne, je to běžná drobná neshoda, kterou si mohou vyřešit sami",
    [
      { value: "Ano, každý spor mezi kamarády musí vyřešit dospělý", why: "Dospělého není potřeba volat na každou drobnou neshodu." },
      { value: "Ano, protože šlo o hádku, a hádky nikdy nemají řešit děti samy", why: "Krátká, jednorázová hádka, kterou si děti samy vyřeší, dospělého nepotřebuje." },
      { value: "Ne, protože o hru vůbec nejde", why: "O hru šlo, to není důvod, proč dospělého nevolat. Důvodem je, že jde o běžnou, jednorázovou a rychle vyřešenou neshodu." },
    ],
    {
      hints: [
        "Stalo se to jednou, nebo se to opakuje a nemění se to?",
        "Podívej se, jestli si kamarádi poradili sami, nebo situace přesahuje jejich síly.",
      ],
      explanation: "Šlo o jednorázovou hádku, kterou si kamarádi rychle sami vyřešili — takovou drobnou a jednorázovou neshodu není třeba hlásit dospělému.",
    },
  ),
  c(
    "Jeden ze spolužáků opakovaně a dlouhodobě rozhoduje za celou skupinu, ostatní se mu nemohou nijak vzepřít a nic se na tom nemění. Je namístě přivolat dospělého?",
    "Ano, jde o opakovanou a nerovnou situaci, na kterou by si děti samy nemusely stačit",
    [
      { value: "Ne, děti si mají všechno vyřešit vždy jen samy mezi sebou", why: "U opakované a dlouhodobě nerovné situace, kterou se dětem samotným nedaří změnit, je vhodné přivolat dospělého." },
      { value: "Ano, ale jen proto, že je ve skupině jeden hlasitější člověk", why: "Nejde jen o to, že je někdo hlasitější, ale o to, že je situace opakovaná, nerovná a sama se nemění." },
      { value: "Ne, protože žádný konkrétní incident se nestal", why: "Přivolání dospělého nezávisí jen na jednom konkrétním incidentu — stačí, že jde o dlouhodobou a nerovnou situaci, kterou se nedaří změnit." },
    ],
    {
      hints: [
        "Opakuje se to, a daří se ostatním situaci sami změnit?",
        "Podívej se, jestli jde o jednorázovou drobnost, nebo o dlouhodobě nerovnou situaci.",
      ],
      explanation: "Situace se opakuje, je dlouhodobě nerovná a ostatní se jí sami nedokážou vzepřít — v takovém případě je vhodné přivolat dospělého.",
    },
  ),
  c(
    "Dvě kamarádky se jednorázově pohádaly kvůli tomu, čí je kniha, ale hned si to vysvětlily a spor skončil. Je namístě volat dospělého?",
    "Ne, jde o jednorázovou a rychle vyřešenou neshodu",
    [
      { value: "Ano, u jakéhokoliv majetku musí rozhodovat vždy dospělý", why: "Jednorázová neshoda, kterou si dívky hned samy vysvětlily, dospělého nepotřebuje." },
      { value: "Ano, protože šlo o hádku o věc", why: "Předmět hádky není důvod pro přivolání dospělého. Rozhoduje spíš to, že šlo o jednorázovou a rychle vyřešenou situaci." },
      { value: "Ne, protože kamarádky spolu nejsou blízké", why: "Blízkost kamarádek s tím nesouvisí. Důvodem, proč dospělého nevolat, je to, že spor byl jednorázový a rychle vyřešený." },
    ],
    {
      hints: [
        "Stalo se to jednou, a vyřešilo se to hned samo?",
        "Podívej se, jestli jde o opakovaný problém, nebo o rychle vysvětlenou drobnost.",
      ],
      explanation: "Šlo o jednorázovou neshodu, kterou si dívky hned samy vysvětlily — takovou drobnou situaci není třeba hlásit dospělému.",
    },
  ),
  c(
    "Jeden spolužák se opakovaně a dlouhodobě staví nad ostatní, rozhoduje za ně a nikdo z nich s tím nemůže nic udělat, i když už to zkoušeli. Je namístě přivolat dospělého?",
    "Ano, situace se opakuje, je nerovná a sami s ní nic nezmohou",
    [
      { value: "Ne, děti mají zvládnout úplně všechno bez pomoci dospělého", why: "Opakovaná, nerovná situace, kterou se dětem nedaří samy změnit ani po vlastních pokusech, je důvod přivolat dospělého." },
      { value: "Ano, ale jen protože je to nepříjemné", why: "Nepříjemnost sama o sobě nerozhoduje. Rozhoduje to, že se situace opakuje, je nerovná a děti ji samy nezvládly změnit." },
      { value: "Ne, protože se to netýká celé třídy", why: "Nezáleží na tom, kolika lidí se to týká. Rozhoduje opakování, nerovnost a to, že to sami nezvládli změnit." },
    ],
    {
      hints: [
        "Opakuje se to, a zkoušeli to spolužáci už sami změnit?",
        "Podívej se, jestli jde o jednorázovou drobnost, nebo o dlouhodobě nerovnou situaci, kterou se nedaří změnit.",
      ],
      explanation: "Situace se opakuje, je dlouhodobě nerovná a spolužáci ji sami přes pokusy nezvládli změnit — proto je vhodné přivolat dospělého.",
    },
  ),
  c(
    "Dva kamarádi mají jednou za čas drobnou neshodu na hřišti, ale pokaždé se spolu rychle domluví a zase si spolu hrají. Je namístě volat dospělého?",
    "Ne, jde o běžné drobné neshody, které si sami úspěšně řeší",
    [
      { value: "Ano, protože se to opakuje", why: "Nejde jen o to, jestli se něco opakuje, ale jestli si to děti dokážou samy úspěšně vyřešit. Tady se jim to daří." },
      { value: "Ano, dospělý musí rozhodovat o každé hře na hřišti", why: "Přivolání dospělého se týká vážnějších nebo neřešitelných situací, ne běžných her na hřišti." },
      { value: "Ne, protože se to děje na hřišti, a tam dospělí nechodí", why: "Místo, kde se neshoda odehrává, není důvod. Rozhoduje to, že jde o drobnou, řešitelnou neshodu, kterou si sami úspěšně vyřeší." },
    ],
    {
      hints: [
        "Opakuje se to, a daří se kamarádům situaci pokaždé sami vyřešit?",
        "Podívej se, jestli jde o problém, který přesahuje jejich síly, nebo o drobnost, kterou zvládají sami.",
      ],
      explanation: "Jde o drobné neshody, které kamarádi pokaždé sami rychle vyřeší — takovou situaci není třeba hlásit dospělému.",
    },
  ),
];

function genL3(): PracticeTask {
  return pick([...L3_JA_VYROK, ...L3_KOMPROMIS, ...L3_PRIVOLAT])();
}

function gen(level: number): PracticeTask[] {
  const genLx = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(genLx));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const VRSTEVNICKE_VZTAHY_RESENI_KONFLIKTU: TopicMetadata[] = [
  {
    id: "g6-vko-vrstevnicke-vztahy-reseni-konfliktu-6",
    rvpNodeId:
      "g6-vko-clovek-ve-spolecnosti-lidska-setkavani-a-kultura-vrstevnicke-vztahy-kamaradstvi-reseni-konfliktu",
    displayName: "Řešení konfliktů mezi kamarády",
    title: "Vrstevnické vztahy, kamarádství, řešení konfliktů",
    studentTitle: "Řešení konfliktů mezi kamarády",
    subject: "vko",
    category: "Člověk ve společnosti",
    topic: "Lidská setkávání a kultura",
    briefDescription: "Poznáš vhodné a bezpečné způsoby, jak řešit neshody mezi kamarády.",
    keywords: [
      "kamarádství", "konflikt", "řešení konfliktu", "já-výrok", "kompromis",
      "naslouchání", "vrstevníci", "neshoda", "přivolání dospělého", "důvěra",
    ],
    goals: [
      "Rozpoznat definici kamarádství a odlišit ji od pouhé známosti nebo soupeření.",
      "Poznat správně postavený já-výrok a odlišit ho od skryté výtky.",
      "Vybrat vhodnou reakci na neshodu mezi kamarády pro konkrétní situaci.",
      "Rozlišit skutečný kompromis od jednostranného ústupku.",
      "Posoudit, kdy je vhodné konflikt řešit samostatně a kdy přivolat dospělého.",
    ],
    boundaries: [
      "Žádný konkrétní scénář šikany ani ubližování — jen obecné a bezpečné strategie.",
      "Žádná rada, která by mohla v realitě uškodit (nikdy neradit mlčet nebo řešit silou).",
      "Jen vrstevnické vztahy mezi dětmi, ne rodinné ani autoritativní vztahy.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Kamarádství = důvěra a vzájemná pomoc. Já-výrok popisuje můj pocit, ne chybu druhého. Kompromis znamená ústupek na obou stranách. Dospělého volej u opakované a nerovné situace, ne u drobné jednorázové neshody.",
      steps: [
        "Zjisti, jestli věta nebo reakce popisuje pocit mluvčího, nebo hodnotí druhého.",
        "U kompromisu zkontroluj, jestli něco získají obě strany, nebo jen jedna.",
        "U rozhodování o dospělém zvaž, jestli je situace jednorázová, nebo se opakuje a je nerovná.",
      ],
      commonMistake: "Považovat za já-výrok každou větu začínající slovem já, i když ve skutečnosti hodnotí druhého, nebo považovat jednostranný ústupek za kompromis.",
      example: "„Já jsem smutný, že jsme si nerozuměli“ = pravý já-výrok. „Já myslím, že jsi sobec“ = skrytá výtka, i když začíná stejně.",
    },
  },
];
