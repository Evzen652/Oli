/**
 * Přírodopis 6. ročník — Prvoci: zástupci (trepka, měňavka, krásnoočko) a nemoci (select_one).
 *
 * Fakta, na kterých se shodují učebnice 6. ročníku (Fraus, Nová škola, SPN):
 * prvok = jednobuněčný organismus s jádrem; trepka (brvy, tvar střevíčku,
 * buněčná ústa, stažitelné vakuoly, tůně a senný nálev); měňavka (panožky,
 * proměnlivý tvar, pohlcuje potravu); krásnoočko (bičík, chloroplasty,
 * světločivá skvrna, ve tmě přijímá hotovou potravu); rozmnožování dělením;
 * malárie (původce zimnička, přenašeč komár anofeles, tropy, červené krvinky);
 * spavá nemoc (trypanozoma, moucha tse-tse, Afrika).
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • záměna pohybových útvarů (brvy × bičík × panožky),
 *  • prvok jako „malé zvířátko“ nebo jako bakterie či virus,
 *  • krásnoočko jako „rostlina“ (ve tmě zahyne) nebo naopak bez chloroplastů,
 *  • záměna přenašečů a cesty nákazy (voda, klíště, komár × tse-tse).
 *
 *  • L1 — zapamatování: přímá otázka na fakt (pojem → organismus nebo útvar).
 *  • L2 — použití: popis dvou znaků nebo situace → zástupce, nemoc, důsledek.
 *  • L3 — přenos: neznámý případ, „proč“, „co lze usoudit“, prevence ve dvou krocích.
 *
 * Každá otázka má pevně tři distraktory, takže jedna otázka = jedna úloha
 * a `ruzneUlohy()` vrátí celou banku úrovně. Generátor nemá stav na úrovni modulu.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

interface Fakt {
  q: string;
  key: string;
  /** Přesně tři distraktory: [možnost, proč je to chyba]. */
  d: [string, string][];
  h: [string, string];
  e: string;
}

const uloha = (f: Fakt): PracticeTask | null =>
  choice(
    f.q,
    f.key,
    f.d.map(([value, why]) => ({ value, why })),
    { hints: f.h, explanation: f.e },
  );

// Opakované vysvětlení záměn pohybových útvarů.
const FB_BICIK = "Bičík je jeden dlouhý útvar, jaký má krásnoočko.";
const FB_BRVY = "Brvy jsou mnoho krátkých vláken po celém povrchu, jaké má trepka.";
const FB_PANOZKY = "Panožky jsou výběžky těla, jaké vysouvá měňavka.";
const FB_NOZKY = "Prvok není malé zvířátko s nohama. Je to jediná buňka, která žádné nožky nemá.";

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const L1: Fakt[] = [
  {
    q: "Kterým útvarem se pohybuje trepka?",
    key: "brvami",
    d: [
      ["bičíkem", `${FB_BICIK} Trepka má na povrchu mnoho krátkých brv.`],
      ["panožkami", `${FB_PANOZKY} Trepka má stálý tvar střevíčku a výběžky nevysouvá.`],
      ["nožičkami", FB_NOZKY],
    ],
    h: [
      "Vybav si trepku pod mikroskopem: má na povrchu jeden dlouhý útvar, nebo mnoho krátkých?",
      "Prvoci se pohybují třemi způsoby: jedním dlouhým vláknem, výběžky těla, nebo spoustou krátkých vláken, která kmitají jako vesla. Trepka má stálý tvar a celý její povrch je porostlý.",
    ],
    e: "Trepka má celý povrch pokrytý brvami, mnoha krátkými vlákny. Brvy kmitají jako vesla a trepku posouvají vodou. Bičík má krásnoočko, panožky měňavka.",
  },
  {
    q: "Čím se pohybuje měňavka?",
    key: "panožkami",
    d: [
      ["brvami", `${FB_BRVY} Měňavka žádná vlákna nemá.`],
      ["bičíkem", `${FB_BICIK} Měňavka se pohybuje jinak, přeléváním těla.`],
      ["nožičkami", FB_NOZKY],
    ],
    h: [
      "Měňavka nemá stálý tvar těla. Jak se asi posouvá, když nemá žádná vlákna?",
      "Vylučuj: jedno dlouhé vlákno má krásnoočko, mnoho krátkých vláken trepka. Měňavka vysouvá část své buňky dopředu jako výběžek a zbytek těla do něj přelije.",
    ],
    e: "Měňavka vysouvá panožky, výběžky své buňky, a tělo do nich přelévá. Proto nemá stálý tvar. Panožkami také obtéká potravu.",
  },
  {
    q: "Čím se pohybuje krásnoočko?",
    key: "bičíkem",
    d: [
      ["brvami", `${FB_BRVY} Krásnoočko má jen jeden dlouhý útvar na přední straně.`],
      ["panožkami", `${FB_PANOZKY} Krásnoočko má stálý protáhlý tvar.`],
      ["nožičkami", FB_NOZKY],
    ],
    h: [
      "Krásnoočko má na přední straně jediný dlouhý útvar, kterým ve vodě víří. Jak se jmenuje?",
      "Rozliš tři pohybové útvary prvoků: mnoho krátkých vláken po celém těle, výběžky proměnlivého těla a jedno dlouhé vlákno. Krásnoočko má stálý tvar a jen jedno vlákno.",
    ],
    e: "Krásnoočko má na přední straně jeden dlouhý bičík. Bičíkem víří a táhne se vodou dopředu. Brvy má trepka, panožky měňavka.",
  },
  {
    q: "Který prvok způsobuje malárii?",
    key: "zimnička",
    d: [
      ["trypanozoma", "Trypanozomu přenáší moucha tse-tse a způsobuje spavou nemoc."],
      ["trepka", "Trepka žije volně v tůních a nálevech, v krvi nežije."],
      ["krásnoočko", "Krásnoočko žije volně ve vodě a nemoci nezpůsobuje."],
    ],
    h: [
      "Trepka a krásnoočko žijí volně v tůních a nemoci nepůsobí. Zbývají dva původci nemocí. Který z nich patří k malárii?",
      "Jednoho parazita přenáší africká moucha a způsobuje spavou nemoc. Druhého přenáší komár anofeles a ten v krvi ničí červené krvinky.",
    ],
    e: "Malárii způsobuje prvok zimnička. Do krve ho přenáší komár anofeles a zimnička pak ničí červené krvinky.",
  },
  {
    q: "Ve kterém útvaru trepka tráví přijatou potravu?",
    key: "v potravní vakuole",
    d: [
      ["ve stažitelné vakuole", "Stažitelná vakuola vyhání z buňky přebytečnou vodu, potravu netráví."],
      ["v buněčných ústech", "Buněčnými ústy potrava do buňky jen vstupuje. Tráví se až uvnitř buňky."],
      ["v buněčném jádře", "Jádro řídí život buňky, potravu netráví."],
    ],
    h: [
      "Potrava projde buněčnými ústy dovnitř buňky a obalí se měchýřkem. Jak se ten měchýřek jmenuje?",
      "Trepka má dva druhy vakuol. Jedny se pravidelně stahují a vyhánějí vodu, druhé vznikají kolem sousta a rozkládají ho.",
    ],
    e: "Potrava se v trepce tráví v potravní vakuole. Ta vznikne kolem sousta, které projde buněčnými ústy. Stažitelná vakuola jen vyhání vodu.",
  },
  {
    q: "Který prvok má bičík a zelené chloroplasty?",
    key: "krásnoočko",
    d: [
      ["trepka", "Trepka nemá bičík ani chloroplasty. Pohybuje se brvami a přijímá hotovou potravu."],
      ["měňavka", "Měňavka nemá bičík ani zelené barvivo. Pohybuje se panožkami."],
      ["sinice", "Sinice je bakterie, ne prvok. Chloroplasty ani bičík nemá."],
    ],
    h: [
      "Chloroplasty dávají zelenou barvu a slouží k výrobě potravy na světle. Který prvok je zelený?",
      "Hledej prvoka, který umí na světle vyrábět potravu jako rostlina a zároveň plave pomocí jednoho dlouhého vlákna. V přední části má i skvrnu citlivou na světlo, podle které dostal jméno.",
    ],
    e: "Bičík a chloroplasty má krásnoočko. Chloroplasty mu na světle umožňují vyrábět potravu, bičíkem plave za světlem.",
  },
  {
    q: "Z kolika buněk je tělo prvoka?",
    key: "z jediné buňky",
    d: [
      ["z tisíců buněk", "Prvok není malé zvířátko. Mnoho buněk mají živočichové, prvok je jednobuněčný."],
      ["ze dvou buněk", "Při dělení vzniknou dva noví prvoci, každý z nich je ale zase jen jedna buňka."],
      ["z žádné, nemá buňky", "Buněčnou stavbu nemají viry. Prvok je buňka s jádrem."],
    ],
    h: [
      "Prvok patří mezi jednobuněčné organismy. Co z toho názvu plyne?",
      "Uvnitř prvoka najdeš jádro, vakuoly a další útvary, ale všechno je to uvnitř jednoho celku. Ten jediný celek sám dýchá, přijímá potravu i se rozmnožuje.",
    ],
    e: "Prvok je jednobuněčný organismus: celé jeho tělo tvoří jediná buňka s jádrem a ta zvládá všechny životní funkce.",
  },
  {
    q: "Kterou nemoc přenáší komár anofeles?",
    key: "malárii",
    d: [
      ["spavou nemoc", "Spavou nemoc přenáší moucha tse-tse, ne komár."],
      ["klíšťovou encefalitidu", "Klíšťovou encefalitidu přenáší klíště, ne komár."],
      ["chřipku", "Chřipku způsobuje virus a šíří se kapénkami, komáři ji nepřenášejí."],
    ],
    h: [
      "Komár anofeles bodá člověka a saje krev. Která nemoc s prvokem v krvi se tak šíří?",
      "Každá nemoc má svého přenašeče: jednu přenáší moucha tse-tse, jinou klíště, další se šíří kapénkami. Komár anofeles přenáší prvoka, který napadá červené krvinky a způsobuje vysoké horečky.",
    ],
    e: "Komár anofeles přenáší malárii. Při bodnutí dostane do krve člověka prvoka zimničku, který napadá červené krvinky.",
  },
  {
    q: "Který živočich přenáší spavou nemoc?",
    key: "moucha tse-tse",
    d: [
      ["komár anofeles", "Komár anofeles přenáší malárii, ne spavou nemoc."],
      ["klíště obecné", "Klíště přenáší klíšťovou encefalitidu a boreliózu, ne spavou nemoc."],
      ["blecha krysí", "Blecha krysí přenáší mor, ne spavou nemoc."],
    ],
    h: [
      "Vylučuj: komár anofeles šíří malárii, klíště nemoci u nás a blecha mor. Který přenašeč zbývá?",
      "Spavá nemoc se vyskytuje jen v tropické Africe. Hledej přenašeče, který žije právě tam a jinde ve světě ne.",
    ],
    e: "Spavou nemoc přenáší africká moucha tse-tse. Při bodnutí předá člověku prvoka trypanozomu.",
  },
  {
    q: "Kterého prvoka přenáší do krve člověka moucha tse-tse?",
    key: "trypanozomu",
    d: [
      ["zimničku", "Zimničku přenáší komár anofeles a způsobuje malárii."],
      ["trepku", "Trepka žije volně ve vodě a nemoci nezpůsobuje."],
      ["krásnoočko", "Krásnoočko žije volně v tůních a v krvi nežije."],
    ],
    h: [
      "Trepka a krásnoočko žijí volně ve vodě. Ze dvou parazitů vyber toho, kterého přenáší africký hmyz, ne komár.",
      "Původce malárie ničí červené krvinky a přenáší ho komár. Původce spavé nemoci napadá nakonec nervovou soustavu. Které jméno patří k němu?",
    ],
    e: "Moucha tse-tse přenáší prvoka trypanozomu, původce spavé nemoci. Zimnička je původce malárie a přenáší ji komár.",
  },
  {
    q: "Kde žije trepka?",
    key: "v tůních a nálevech",
    d: [
      ["v lidské krvi", "V krvi žije původce malárie, ne trepka. Trepka žije volně ve vodě."],
      ["na suchých kamenech", "Prvok potřebuje vodu nebo vlhko, jinak by jeho buňka vyschla."],
      ["ve slané mořské vodě", "Trepka je sladkovodní, žije ve stojaté sladké vodě."],
    ],
    h: [
      "Trepku najdeš ve stojaté sladké vodě. Kde se taková voda vyskytuje?",
      "Trepky se dají snadno vypěstovat doma: stačí zalít seno vodou a nechat ho pár dní stát. Ve volné přírodě žijí ve stojatých sladkých vodách s rozkládajícími se zbytky rostlin.",
    ],
    e: "Trepka žije ve stojaté sladké vodě, v tůních a rybnících, a dá se vypěstovat v senném nálevu. Živí se tam bakteriemi.",
  },
  {
    q: "Čím dýchá prvok?",
    key: "celým povrchem buňky",
    d: [
      ["buněčnými ústy", "Buněčnými ústy trepka přijímá potravu, kyslík jimi nenasává."],
      ["stažitelnou vakuolou", "Stažitelná vakuola vyhání z buňky přebytečnou vodu, k dýchání neslouží."],
      ["chloroplasty", "V chloroplastech krásnoočko na světle vyrábí potravu. Dýchání to není."],
    ],
    h: [
      "Prvok je jediná buňka bez orgánů. Kudy do ní může vstoupit kyslík z vody?",
      "Buněčná ústa slouží k příjmu potravy, stažitelná vakuola k vyhánění vody a chloroplasty k výrobě potravy. Kyslík si buňka bere z okolní vody bez zvláštního útvaru.",
    ],
    e: "Prvok nemá dýchací orgány. Kyslík z vody přijímá celým povrchem své buňky a stejně tak odevzdává oxid uhličitý.",
  },
  {
    q: "Který útvar vyvrhuje z buňky trepky přebytečnou vodu?",
    key: "stažitelná vakuola",
    d: [
      ["potravní vakuola", "Potravní vakuola tráví potravu, vodu z buňky nevyhání."],
      ["buněčná ústa", "Buněčnými ústy trepka potravu přijímá, nevyvrhuje jimi vodu."],
      ["buněčné jádro", "Jádro řídí život buňky, s vodou nepracuje."],
    ],
    h: [
      "Hledej útvar, který se pravidelně zvětšuje a pak smrští, jako by pumpoval.",
      "Do trepky ze sladké vody stále proniká voda. Útvar, který ji vyhání ven, se střídavě plní a stahuje. Má podobné jméno jako útvar, ve kterém se tráví potrava.",
    ],
    e: "Přebytečnou vodu vyvrhuje stažitelná vakuola. Plní se vodou a pak se stáhne a vyprázdní ji ven. Trepka má dvě.",
  },
  {
    q: "Jak se nazývá útvar, kterým trepka přijímá potravu?",
    key: "buněčná ústa",
    d: [
      ["stažitelná vakuola", "Stažitelná vakuola vyvrhuje přebytečnou vodu, potravu nepřijímá."],
      ["panožka", "Panožky má měňavka, trepka ne."],
      ["bičík", "Bičík má krásnoočko a slouží k pohybu."],
    ],
    h: [
      "Trepka má na boku prohlubeň, do které brvy vhánějí potravu. Jak se jmenuje?",
      "Vylučuj: brvy trepku pohánějí, stažitelné vakuoly vyhánějí vodu a potravní vakuoly potravu tráví. Který útvar zbývá pro vstup potravy do buňky?",
    ],
    e: "Trepka přijímá potravu buněčnými ústy. Brvy do nich vhánějí bakterie, které se pak tráví v potravních vakuolách.",
  },
  {
    q: "Který útvar krásnoočku ukazuje, kam má plavat?",
    key: "světločivá skvrna",
    d: [
      ["chloroplast", "Chloroplasty světlo využívají k výrobě potravy, ale krásnoočko jimi světlo nevnímá."],
      ["stažitelná vakuola", "Stažitelná vakuola vyhání přebytečnou vodu, na světlo nereaguje."],
      ["buněčné jádro", "Jádro řídí buňku, světlo nevnímá."],
    ],
    h: [
      "Krásnoočko dostalo jméno podle útvaru, který vypadá jako malé očko. Co to je?",
      "V přední části krásnoočka je červená tečka, díky které pozná, kde je světlo, a plave tam. Zelené útvary světlo nevnímají, jen ho využívají.",
    ],
    e: "Na světlo reaguje světločivá skvrna. Krásnoočko podle ní plave ke světlu, kde může v chloroplastech vyrábět potravu.",
  },
  {
    q: "Ve kterých oblastech světa se šíří malárie?",
    key: "v teplých tropických krajích",
    d: [
      ["v chladných horských oblastech", "V chladu se původce malárie v komárovi nevyvine, proto se tam nemoc nešíří."],
      ["u českých rybníků a řek", "Komáři anofeles u nás žijí, ale pro vývoj původce je u nás chladno a nakažení lidé tu nejsou."],
      ["ve studených polárních krajích", "V polárním chladu se původce malárie v komárovi nevyvine, nemoc se tam nešíří."],
    ],
    h: [
      "Původce malárie se v komárovi vyvíjí jen při vysokých teplotách. Kde je teplo po celý rok?",
      "Malárie trápí hlavně Afriku, jih Asie a Jižní Ameriku. Co mají tyto oblasti společné z hlediska podnebí?",
    ],
    e: "Malárie se šíří v teplých tropických krajích, kde je dost tepla pro vývoj jejího původce a kde je hodně nakažených komárů anofeles. Kdo tam cestuje, musí se chránit před bodnutím.",
  },
  {
    q: "Jak se prvok nejčastěji rozmnožuje?",
    key: "dělením buňky na dvě",
    d: [
      ["kladením drobných vajíček", "Prvok není malé zvířátko. Vajíčka nekladou jednobuněčné organismy."],
      ["výtrusy jako houba", "Výtrusy mají houby a mechy. Prvok se nejčastěji jen rozdělí."],
      ["pučením jako nezmar", "Pučením se rozmnožuje mnohobuněčný nezmar. Prvok se rozdělí."],
    ],
    h: [
      "Prvok je jediná buňka. Jak z jedné buňky nejjednodušeji vzniknou dvě?",
      "Buňka nejdřív zdvojí jádro a pak se rozdělí. Vzniknou dva stejní noví prvoci. Vajíčka, výtrusy ani pupeny k tomu nejsou potřeba.",
    ],
    e: "Prvok se nejčastěji rozmnožuje dělením: jeho buňka se rozdělí na dvě a vzniknou dva noví prvoci.",
  },
  {
    q: "Do které skupiny organismů patří původci malárie a spavé nemoci?",
    key: "mezi prvoky",
    d: [
      ["mezi bakterie", "Bakterie nemají jádro. Původci obou nemocí jsou jednobuněční organismy s jádrem."],
      ["mezi viry", "Viry nemají buněčnou stavbu. Původci obou nemocí jsou buňky s jádrem."],
      ["mezi houby", "Houby to nejsou. Původci obou nemocí jsou jednobuněční prvoci s jádrem."],
    ],
    h: [
      "Původci obou nemocí jsou jednobuněční a mají jádro. Která skupina to splňuje?",
      "Bakterie nemají jádro, viry nemají buňku vůbec. Hledej skupinu jednobuněčných organismů s jádrem, kam patří i trepka a měňavka.",
    ],
    e: "Zimnička (malárie) i trypanozoma (spavá nemoc) jsou prvoci: jednobuněčné organismy s jádrem. Nejsou to bakterie ani viry.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const KTEREHO = "O kterého prvoka jde?";
const L2: Fakt[] = [
  {
    q: `Prvok mění tvar těla a potravu obtéká výběžky. ${KTEREHO}`,
    key: "měňavka",
    d: [
      ["trepka", "Trepka má stálý tvar střevíčku a potravu nabírá buněčnými ústy."],
      ["krásnoočko", "Krásnoočko má stálý tvar a bičík, výběžky nevysouvá."],
      ["nezmar", "Nezmar není prvok, je mnohobuněčný a potravu chytá chapadly."],
    ],
    h: [
      "Dva znaky: proměnlivý tvar a výběžky těla. Který prvok nemá stálý tvar?",
      "Výběžky, kterými prvok obtéká potravu, jsou panožky. Stejné výběžky mu slouží i k pohybu. Prvok se stálým tvarem to neumí.",
    ],
    e: "Proměnlivý tvar a výběžky (panožky), kterými obtéká a pohlcuje potravu, má měňavka.",
  },
  {
    q: `Prvok ze senného nálevu má tvar střevíčku a celé tělo pokryté drobnými vlákny. ${KTEREHO}`,
    key: "trepka",
    d: [
      ["měňavka", "Měňavka nemá stálý tvar ani vlákna, pohybuje se panožkami."],
      ["krásnoočko", "Krásnoočko má jen jeden dlouhý bičík, ne vlákna po celém těle."],
      ["sinice", "Sinice je bakterie, ne prvok, a vlákna po těle nemá."],
    ],
    h: [
      "Drobná vlákna po celém těle jsou brvy. Který prvok je má?",
      "Tvar podrážky boty a mnoho krátkých vláken, která kmitají jako vesla, patří prvokovi, kterého si lze vypěstovat, když se seno zalije vodou.",
    ],
    e: "Tvar střevíčku, brvy po celém těle a život v senném nálevu jsou znaky trepky.",
  },
  {
    q: `Zelený prvok si na světle vyrábí potravu jako rostlina, ve tmě přijímá hotovou. ${KTEREHO}`,
    key: "krásnoočko",
    d: [
      ["nezmar zelený", "Nezmar zelený není prvok. Je mnohobuněčný a zelenou barvu mu dávají drobné řasy, které žijí v jeho buňkách."],
      ["sinice", "Sinice je bakterie, ne prvok."],
      ["trepka", "Trepka není zelená a potravu si vyrábět neumí."],
    ],
    h: [
      "Zelenou barvu dávají chloroplasty. Který prvok je má?",
      "Tento prvok umí dvojí výživu: na světle ji vyrábí v chloroplastech, ve tmě přijímá hotovou. Plave bičíkem a má skvrnu citlivou na světlo.",
    ],
    e: "Krásnoočko má chloroplasty, takže na světle si potravu vyrábí. Ve tmě přežije, protože umí přijímat i hotovou potravu.",
  },
  {
    q: `Prvok plave ke světlu, protože ho vnímá červenou skvrnou. ${KTEREHO}`,
    key: "krásnoočko",
    d: [
      ["trepka", "Trepka světločivou skvrnu nemá, živí se hotovou potravou."],
      ["měňavka", "Měňavka světločivou skvrnu nemá a světlo nepotřebuje."],
      ["nezmar", "Nezmar není prvok, ale mnohobuněčný živočich."],
    ],
    h: [
      "Proč by prvok vyhledával světlo? Který prvok ho potřebuje k výrobě potravy?",
      "Červená světločivá skvrna připomíná oko a dala prvokovi jméno. Světlo mu slouží k výrobě potravy v zelených chloroplastech.",
    ],
    e: "Světločivou skvrnu má krásnoočko. Pozná jí, kde je světlo, a plave tam, protože na světle si vyrábí potravu.",
  },
  {
    q: `Prvok z tůně má na boku prohlubeň, do které víří potravu, a dvě vakuoly, které se střídavě plní a stahují. ${KTEREHO}`,
    key: "trepka",
    d: [
      ["měňavka", "Stažitelnou vakuolu má i měňavka, ale prohlubeň na potravu nemá. Sousto obtéká panožkami."],
      ["krásnoočko", "Stažitelnou vakuolu má i krásnoočko. Pozná se ale podle zeleného barviva a bičíku."],
      ["nezmar", "Nezmar není prvok, je mnohobuněčný a potravu chytá chapadly."],
    ],
    h: [
      "Stahující se vakuoly má víc prvoků. Rozhodni podle prohlubně, kterou potrava vstupuje do buňky.",
      "Prohlubeň na boku jsou buněčná ústa a potravu do nich víří krátká vlákna po celém těle. Který prvok je má?",
    ],
    e: "Buněčná ústa (prohlubeň na boku) a dvě stažitelné vakuoly má trepka. Stažitelné vakuoly mají i jiní prvoci, rozhodují tedy buněčná ústa.",
  },
  {
    q: "Pod mikroskopem vidíš, jak se v trepce jeden útvar pravidelně zvětšuje a pak se náhle smrští. Co tím útvarem trepka dělá?",
    key: "vyhání z buňky vodu",
    d: [
      ["tráví pohlcenou potravu", "Potravu tráví potravní vakuola. Ta se pravidelně nestahuje."],
      ["přijímá potravu z okolí", "Potravu trepka přijímá buněčnými ústy na povrchu, ne útvarem, který se smršťuje."],
      ["vnímá, kde je světlo", "Světlo vnímá světločivá skvrna krásnoočka. Trepka ji nemá."],
    ],
    h: [
      "Útvar, který se rytmicky plní a stahuje, je stažitelná vakuola. K čemu slouží?",
      "Trepka žije ve sladké vodě, která do buňky stále proniká. Pomysli, čeho se buňka musí pravidelně zbavovat.",
    ],
    e: "Pravidelně se plní a smršťuje stažitelná vakuola. Vyhání z buňky přebytečnou vodu, která do trepky ze sladké vody stále proniká.",
  },
  {
    q: "V tropické vesnici bydlí zdravý člověk vedle nemocného s malárií. Jak se od něj může nakazit?",
    key: "bodnutím komára anofela",
    d: [
      ["podáním ruky", "Malárie se nepřenáší dotykem. Původce je v krvi a do krve jiného člověka ho dostane komár."],
      ["pitím ze společné studny", "Malárie se nešíří vodou, přenáší ji bodnutí komára."],
      ["vdechnutím kapének při kašli", "Kapénkami se šíří třeba chřipka. Malárie se kašlem nepřenáší."],
    ],
    h: [
      "Původce malárie žije v krvi nemocného. Jak se může dostat z krve jednoho člověka do krve druhého?",
      "Malárie se nešíří dotykem, vodou ani vzduchem. Potřebuje přenašeče, který saje krev.",
    ],
    e: "Komár anofeles nasaje s krví nemocného původce malárie. Když pak bodne zdravého souseda, předá mu ho do krve. Dotykem, vodou ani kapénkami se malárie nešíří.",
  },
  {
    q: `Sklenici s vodou z tůně nechal žák na slunném okně a za týden voda zezelenala. Pod mikroskopem v ní plavou prvoci, kteří se natáčejí ke světlu. ${KTEREHO}`,
    key: "krásnoočko",
    d: [
      ["trepka", "Trepka není zelená, živí se bakteriemi a ke světlu se nenatáčí."],
      ["měňavka", "Měňavka není zelená a leze po dně, světlo k výživě nepotřebuje."],
      ["sinice", "Sinice také barví vodu do zelena, ale není to prvok. Je to bakterie."],
    ],
    h: [
      "Vodu barví do zelena organismy, které si na světle vyrábějí potravu. Který prvok to umí?",
      "Vyluč organismy, které nejsou prvoci. Z prvoků má chloroplasty a skvrnu citlivou na světlo jen jeden.",
    ],
    e: "Zelené prvoky, kteří plavou ke světlu, tvoří krásnoočko. Má chloroplasty a světločivou skvrnu. Sinice vodu také zbarví, ale prvok to není.",
  },
  {
    q: "Co se děje v těle člověka nakaženého malárií?",
    key: "původce napadá červené krvinky",
    d: [
      ["bakterie se množí v plicích", "Malárii nezpůsobuje bakterie, ale prvok. Napadá krev, ne plíce."],
      ["virus poškozuje nervové buňky", "Malárii nezpůsobuje virus, ale jednobuněčný prvok s jádrem."],
      ["původce se množí ve střevech", "Malárie se nešíří jídlem ani vodou. Původce se dostane do krve bodnutím komára."],
    ],
    h: [
      "Malárii přenáší komár, který bodá do kůže a saje krev. Kam se tedy původce dostane?",
      "Původce malárie je prvok. Po bodnutí se dostane do krve a množí se v buňkách, které roznášejí kyslík. Když je rozbije, přicházejí vysoké horečky.",
    ],
    e: "Původce malárie, prvok zimnička, se po bodnutí komárem dostane do krve a napadá červené krvinky. Při jejich rozpadu má nemocný vysoké horečky.",
  },
  {
    q: "Proč se aktivní prvok neobejde bez vody nebo vlhka?",
    key: "jeho jediná buňka by vyschla",
    d: [
      ["dýchá žábrami jako ryba", "Prvok žábry nemá, dýchá celým povrchem buňky."],
      ["potřebuje vodu jen k pití", "Prvok nepije jako zvíře. Voda ho obklopuje a chrání před vyschnutím."],
      ["voda mu nahrazuje kostru těla", "Voda kostru nenahrazuje. Prvok potřebuje vodu, aby jeho buňka nevyschla."],
    ],
    h: [
      "Prvok je jediná drobná buňka. Co se s ní stane na suchu?",
      "Mnohobuněčné organismy chrání kůže, šupiny nebo kůra. Tělo prvoka tvoří jen jedna buňka, a ta sama ztrátu vody nevydrží.",
    ],
    e: "Tělo prvoka je jediná buňka a na suchu by vyschla. Proto prvoci žijí ve vodě nebo ve vlhku. Některé přečkají sucho v odolné cystě, v ní ale nejsou aktivní.",
  },
  {
    q: "Turistu v tropické Africe bodla velká moucha. Po čase má horečky a později poruchy chování, protože nemoc napadla nervovou soustavu. Kterou nemoc mohl dostat?",
    key: "spavou nemoc",
    d: [
      ["malárii", "Horečky má i malárie, ale přenáší ji komár anofeles, ne moucha."],
      ["klíšťovou encefalitidu", "Nervovou soustavu napadá i klíšťová encefalitida, ale přenáší ji klíště."],
      ["chřipku", "Chřipku způsobuje virus a šíří se kapénkami, ne bodnutím."],
    ],
    h: [
      "Dva údaje: kdo nemocného bodl a kterou soustavu nemoc napadla. Vyluč nemoci, které přenáší jiný živočich.",
      "Komár šíří malárii, klíště encefalitidu a chřipka se šíří kapénkami. Která nemoc přenášená mouchou z tropické Afriky napadá nervovou soustavu?",
    ],
    e: "Moucha tse-tse z tropické Afriky přenáší spavou nemoc. Její původce, prvok trypanozoma, nakonec napadá nervovou soustavu, proto je nemocný zmatený a ospalý.",
  },
  {
    q: "Po návratu z tropů, kde ho často štípali komáři, má cestovatel opakované vysoké horečky. Na kterou nemoc ho lékař vyšetří?",
    key: "na malárii",
    d: [
      ["na spavou nemoc", "Spavou nemoc přenáší moucha tse-tse, ne komár."],
      ["na klíšťovou encefalitidu", "Tu přenáší klíště, ne komár."],
      ["na tuberkulózu", "Tuberkulózu způsobuje bakterie a komáři ji nepřenášejí."],
    ],
    h: [
      "Dva údaje: bodnutí komárem v tropech a opakované horečky. Kterou nemoc přenáší komár?",
      "Horečky se vracejí pokaždé, když původce rozbije další várku červených krvinek. Nemoc přenáší komár anofeles v teplých krajích.",
    ],
    e: "Bodnutí komárem v tropech a opakované vysoké horečky ukazují na malárii. Její původce se množí v červených krvinkách a při jejich rozpadu přichází horečka.",
  },
  {
    q: "Čím se liší výživa krásnoočka od výživy měňavky?",
    key: "krásnoočko si umí potravu vyrobit",
    d: [
      ["měňavka si umí potravu vyrobit", "Měňavka nemá chloroplasty, potravu jen pohlcuje. Vyrobit si ji umí krásnoočko."],
      ["obě si potravu vyrábějí na světle", "Měňavka chloroplasty nemá, takže si potravu vyrobit neumí."],
      ["obě přijímají jen hotovou potravu", "Krásnoočko má chloroplasty a na světle si potravu vyrábí."],
    ],
    h: [
      "K výrobě potravy na světle jsou potřeba zelené chloroplasty. Kdo z těch dvou je má?",
      "Jeden z prvoků je zelený a na světle si potravu vyrábí, druhý je bezbarvý a potravu obtéká výběžky. Zjisti, který je který.",
    ],
    e: "Krásnoočko má chloroplasty, a proto si na světle potravu vyrobí. Měňavka je nemá a potravu jen pohlcuje panožkami.",
  },
];

// ── L3 — přenos ─────────────────────────────────────────────────────────────
const L3: Fakt[] = [
  {
    q: "V kapce z louže je buňka, která se pohybuje bičíkem a nemá zelené barvivo. Co o ní lze usoudit?",
    key: "přijímá hotovou potravu z okolí",
    d: [
      ["vyrábí si potravu na světle", "Bez zeleného barviva (chloroplastů) si buňka potravu vyrobit nemůže."],
      ["je to mnohobuněčný živočich", "Ve vzorku je jediná buňka, takže nejde o mnohobuněčný organismus."],
      ["je to sinice, tedy bakterie", "Sinice bičík nemá a je modrozelená. Tahle buňka barvivo nemá vůbec."],
    ],
    h: [
      "Bičík prozrazuje pohyb, ale ne výživu. O výživě rozhoduje zelené barvivo. Co plyne z toho, že chybí?",
      "Krok 1: zelené barvivo (chloroplasty) je potřeba k výrobě potravy na světle. Krok 2: buňka ho nemá, takže si potravu vyrobit nemůže a musí ji získat jinak.",
    ],
    e: "Bez chloroplastů si buňka potravu vyrobit nemůže, musí tedy přijímat hotovou potravu z okolí. Bičík o výživě nic neříká.",
  },
  {
    q: "Co lze očekávat u trepky, jejíž brvy přestanou kmitat?",
    key: "přestane plavat a hůř získá potravu",
    d: [
      ["začne si vyrábět potravu na světle", "Trepka nemá chloroplasty, potravu si vyrobit neumí."],
      ["začne se pohybovat bičíkem", "Trepka bičík nemá a pohybové útvary se jí nevymění."],
      ["přestane vyhánět vodu z buňky", "Vodu vyhánějí stažitelné vakuoly, ne brvy."],
    ],
    h: [
      "Krok 1: k čemu všemu trepka brvy používá? Krok 2: co z toho bez nich nezvládne?",
      "Brvy trepku pohánějí vodou a zároveň víří vodu s bakteriemi k buněčným ústům. Vodu z buňky vyhánějí jiné útvary.",
    ],
    e: "Brvy trepku pohánějí a zároveň vhánějí potravu do buněčných úst. Bez kmitání brv trepka nepopluje a hůř získá potravu. Vodu dál vyhánějí stažitelné vakuoly.",
  },
  {
    q: "Proč měňavka nepotřebuje stálý tvar těla?",
    key: "výběžky obtéká a pohlcuje potravu",
    d: [
      ["voda ji tlačí do různých tvarů", "Tvar nemění proud vody. Měňavka ho mění sama, když vysouvá panožky."],
      ["tvar mění, aby ji nesežrali", "Proměnlivý tvar jí slouží k pohybu a k lovu, ne k maskování."],
      ["tvar mění, jen když se dělí", "Měňavka mění tvar neustále, i když se nedělí."],
    ],
    h: [
      "Co všechno měňavka dělá pomocí panožek? Přemýšlej o pohybu i o jídle.",
      "Krok 1: panožky vznikají tak, že se část těla vysune. Krok 2: stejným způsobem může měňavka sousto obklopit ze všech stran. K tomu jí stálý tvar nepomůže.",
    ],
    e: "Měňavka vysouvá panožky, kterými se pohybuje a kterými potravu obtéká a pohltí. Proměnlivý tvar je pro ni výhoda.",
  },
  {
    q: "Rodina jede do tropické Afriky, kde se vyskytuje malárie. Co ji ochrání nejvíc?",
    key: "moskytiéra, repelent a léky od lékaře",
    d: [
      ["převařená voda a mýdlo na ruce", "Malárie se nešíří vodou ani špinavýma rukama, ale bodnutím komára."],
      ["očkování proti klíšťové encefalitidě", "Toto očkování chrání jen před nemocí od klíštěte, na malárii nepůsobí."],
      ["antibiotika z domácí lékárničky", "Léky proti malárii vybírá lékař před cestou podle oblasti. Náhodná antibiotika z domácí lékárničky před nákazou neochrání."],
    ],
    h: [
      "Krok 1: jak se malárie šíří? Krok 2: co zabrání právě této cestě nákazy?",
      "Malárii přenáší komár, který bodá hlavně večer a v noci. Ochrana tedy musí bránit bodnutí a lékař může předepsat léky, které se berou před cestou i během ní.",
    ],
    e: "Malárii přenáší bodnutí komára anofela. Nejlépe chrání moskytiéra nad postelí, repelent na kůži a preventivní léky, které předepíše lékař před cestou.",
  },
  {
    q: "Proč proti malárii nepomůže převařit pitnou vodu?",
    key: "původce se šíří bodnutím komára",
    d: [
      ["původce přežije i var vody", "Var by prvoka zničil, jenže ve vodě původce malárie není."],
      ["malárii způsobuje virus v jídle", "Malárii nezpůsobuje virus a jídlem se nešíří. Původce je prvok."],
      ["nákaza se šíří kapénkami ve vzduchu", "Kapénkami se šíří třeba chřipka. Malárii přenáší komár."],
    ],
    h: [
      "Převaření vody chrání jen před nemocemi, které se šíří vodou. Šíří se tak malárie?",
      "Krok 1: najdi cestu, kterou se původce malárie dostane do krve. Krok 2: posuď, jestli s ní má pitná voda něco společného.",
    ],
    e: "Původce malárie se do krve dostane bodnutím komára anofela, ne vodou. Převařená voda proto před malárií neochrání.",
  },
  {
    q: "Kterou vlastnost mají trepka, měňavka i krásnoočko společnou?",
    key: "tělo tvoří jediná buňka",
    d: [
      ["pohybují se pomocí brv", "Brvy má jen trepka. Měňavka má panožky, krásnoočko bičík."],
      ["vyrábějí si potravu na světle", "Potravu si vyrábí jen krásnoočko, které má chloroplasty."],
      ["žijí jen v lidské krvi", "Všechny tři žijí volně ve vodě. V krvi žije původce malárie."],
    ],
    h: [
      "Porovnej postupně pohyb, výživu a místo, kde žijí. Ve kterém znaku se všichni tři shodují?",
      "Pohyb se liší (vlákna, výběžky, bičík) a výživa také (jen jeden je zelený). Shodu hledej ve stavbě těla, kvůli které patří do stejné skupiny.",
    ],
    e: "Trepka, měňavka i krásnoočko jsou prvoci: tělo každého z nich tvoří jediná buňka, která zvládá všechny životní funkce.",
  },
  {
    q: "Krásnoočko dáme na několik týdnů do tmy s potravou ve vodě. Co lze očekávat?",
    key: "přežije a živí se hotovou potravou",
    d: [
      ["zahyne jako rostlina bez světla", "Krásnoočko není rostlina. Ve tmě umí přijímat hotovou potravu."],
      ["začne se pohybovat panožkami", "Panožky má měňavka. Krásnoočko se pohybuje bičíkem i ve tmě."],
      ["rozpadne se na mnoho buněk", "Prvok zůstává jednobuněčný, tma na tom nic nezmění."],
    ],
    h: [
      "Krok 1: co krásnoočko bez světla nemůže dělat? Krok 2: jakou náhradní výživu umí?",
      "Na světle si krásnoočko vyrábí potravu v chloroplastech. Ve tmě to nejde, ale tento prvok umí i to, co trepka a měňavka.",
    ],
    e: "Ve tmě si krásnoočko potravu vyrobit nemůže, ale umí přijímat hotovou potravu z vody. Proto přežije.",
  },
  {
    q: "Proč spavá nemoc nehrozí člověku, který žije v Česku?",
    key: "moucha tse-tse u nás nežije",
    d: [
      ["u nás převaříme pitnou vodu", "Spavá nemoc se nešíří vodou, takže převaření vody s tím nesouvisí."],
      ["komáři u nás v zimě zmrznou", "Spavou nemoc nepřenáší komár, ale moucha tse-tse."],
      ["u nás ji přenáší jen klíště", "Klíště spavou nemoc nepřenáší vůbec."],
    ],
    h: [
      "Krok 1: kdo spavou nemoc přenáší? Krok 2: žije tento přenašeč v Česku?",
      "Nemoc s přenašečem se může šířit jen tam, kde přenašeč žije. Přenašeč spavé nemoci je hmyz z tropické Afriky.",
    ],
    e: "Spavou nemoc přenáší moucha tse-tse, která žije v tropické Africe. Kde přenašeč chybí, nemoc se nešíří.",
  },
  {
    q: "V krvi nemocného, který se vrátil z tropů, našel lékař prvoky ničící červené krvinky. Co lze usoudit?",
    key: "nakazil se malárií od komára",
    d: [
      ["nakazil se malárií z vody", "Malárie se nešíří vodou, ale bodnutím komára."],
      ["nakazil se spavou nemocí od klíštěte", "Spavou nemoc přenáší moucha tse-tse, ne klíště. Krvinky ničí původce malárie."],
      ["nakazil se malárií od klíštěte", "Klíště malárii nepřenáší. Přenašeč je komár anofeles."],
    ],
    h: [
      "Krok 1: který prvok ničí červené krvinky? Krok 2: kdo ho přenáší?",
      "Z nálezu v krvi urči nemoc, pak k ní přiřaď přenašeče. Pozor: možnost musí mít správně obojí, nemoc i přenašeče.",
    ],
    e: "Prvoci, kteří ničí červené krvinky, jsou původci malárie. Malárii přenáší komár anofeles v tropech, takže se nemocný nakazil jeho bodnutím.",
  },
  {
    q: "Proč krásnoočko plave ke světlu?",
    key: "na světle si vyrábí potravu",
    d: [
      ["na světle vidí kořist očima", "Krásnoočko nemá oči. Světločivá skvrna rozliší jen světlo a tmu."],
      ["na světle ho nevidí dravci", "Na světle je naopak nejlépe vidět. Důvodem je výživa."],
      ["světlo mu nahrazuje dýchání", "Prvok dýchá celým povrchem buňky, světlo k tomu nepotřebuje."],
    ],
    h: [
      "Krok 1: co má krásnoočko zelené? Krok 2: k čemu ty zelené útvary potřebují světlo?",
      "Světločivá skvrna jen ukazuje, kde je světlo. Důvod, proč tam krásnoočko plave, souvisí s chloroplasty a s tím, jak se živí.",
    ],
    e: "Krásnoočko má chloroplasty a na světle v nich vyrábí potravu. Světločivou skvrnou pozná, kde je světlo, a plave tam.",
  },
  {
    q: "Co lze očekávat u trepky, jejíž stažitelné vakuoly přestanou fungovat?",
    key: "buňka se přeplní vodou a praskne",
    d: [
      ["přestane přijímat potravu", "Potravu přijímá buněčnými ústy. Ta na stažitelných vakuolách nezávisí."],
      ["začne se pohybovat panožkami", "Pohybové útvary se nezmění, trepka má dál brvy."],
      ["buňka vyschne a scvrkne se", "Je to naopak: voda do buňky ze sladké vody proniká, takže se jí v buňce hromadí příliš."],
    ],
    h: [
      "Krok 1: co stažitelné vakuoly dělají? Krok 2: co se stane, když to přestanou dělat?",
      "Trepka žije ve sladké vodě, která do buňky stále proniká. Když ji nic nevyhání ven, kam se ta voda poděje?",
    ],
    e: "Do trepky ze sladké vody neustále proniká voda a stažitelné vakuoly ji vyhánějí ven. Když přestanou fungovat, voda se v buňce hromadí, až se buňka přeplní a praskne.",
  },
  {
    q: "Co lze usoudit o organismu, který má jedinou buňku s jádrem a pohybuje se panožkami?",
    key: "je to prvok podobný měňavce",
    d: [
      ["je to bakterie, protože má jednu buňku", "Bakterie nemá jádro. Buňka s jádrem ukazuje na prvoka."],
      ["je to mnohobuněčný živočich", "Organismus má jedinou buňku, nemůže být mnohobuněčný."],
      ["je to vir, protože je tak malý", "Viry nemají buněčnou stavbu. Tento organismus je buňka."],
    ],
    h: [
      "Krok 1: kterou skupinu určuje jediná buňka s jádrem? Krok 2: kdo v ní má panožky?",
      "Bakterie nemají jádro a viry nemají buňku. Jednobuněčné organismy s jádrem jsou prvoci. Z nich se výběžky těla pohybuje ten, který mění tvar.",
    ],
    e: "Jediná buňka s jádrem znamená prvoka. Panožky má měňavka, takže jde o prvoka podobného měňavce.",
  },
  {
    q: "Co lze usoudit o prvokovi, který má chloroplasty?",
    key: "umí si na světle vyrobit potravu",
    d: [
      ["ve tmě bez výjimky zahyne", "Nemusí. Krásnoočko má chloroplasty, a ve tmě přesto přežije díky hotové potravě."],
      ["pohybuje se jen panožkami", "Chloroplasty o pohybu nic neříkají. Krásnoočko má bičík."],
      ["nemůže přijímat hotovou potravu", "Může. Krásnoočko má chloroplasty a hotovou potravu přijímat umí."],
    ],
    h: [
      "K čemu slouží chloroplasty? To je jediné, co z nich jistě plyne.",
      "Krok 1: urči funkci chloroplastů. Krok 2: ověř ostatní tvrzení na krásnoočku, které chloroplasty má. Co u něj neplatí, nelze usoudit.",
    ],
    e: "Chloroplasty slouží k výrobě potravy na světle, to platí jistě. Krásnoočko ukazuje, že takový prvok může ve tmě přijímat i hotovou potravu.",
  },
  {
    q: "Proč se do oblastí s malárií bere moskytiéra na spaní?",
    key: "komáři anofeles bodají hlavně v noci",
    d: [
      ["mouchy tse-tse bodají hlavně v noci", "Moucha tse-tse přenáší spavou nemoc, ne malárii."],
      ["původce se šíří v nočním prachu", "Původce malárie se prachem nešíří. Přenáší ho komár."],
      ["klíšťata padají v noci ze stromů", "Klíšťata ze stromů nepadají a malárii nepřenášejí."],
    ],
    h: [
      "Krok 1: kdo malárii přenáší? Krok 2: kdy tento přenašeč nejčastěji útočí?",
      "Síť kolem postele zastaví jen létající hmyz. Přemýšlej, který létající přenašeč malárie bodá ve chvíli, kdy člověk spí.",
    ],
    e: "Malárii přenáší komár anofeles, který bodá hlavně večer a v noci. Moskytiéra nad postelí ho ke spícímu člověku nepustí.",
  },
];

const genL1 = () => uloha(pick(L1));
const genL2 = () => uloha(pick(L2));
const genL3 = () => uloha(pick(L3));

function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const PRVOCI_ZASTUPCI_NEMOCI: TopicMetadata[] = [
  {
    id: "g6-pri-prvoci-zastupci-nemoci-6",
    rvpNodeId: "g6-prirodopis-nebunecni-a-bakterie-sinice-a-prvoci-prvoci-zastupci-trepka-menavka-nemoci",
    displayName: "Prvoci – zástupci a nemoci",
    title: "Prvoci - zástupci (trepka, měňavka), nemoci",
    studentTitle: "Prvoci – trepka, měňavka a nemoci",
    subject: "prirodopis",
    category: "Nebuněční a bakterie",
    topic: "Sinice a prvoci",
    briefDescription: "Poznáš trepku, měňavku a krásnoočko a víš, jak se šíří malárie.",
    keywords: [
      "prvoci", "prvok", "trepka", "měňavka", "krásnoočko", "brvy", "bičík", "panožky",
      "malárie", "spavá nemoc", "komár anofeles", "moucha tse-tse", "jednobuněčný",
    ],
    goals: [
      "Rozpoznat trepku, měňavku a krásnoočko podle pohybu, výživy a prostředí.",
      "Vysvětlit, jak se šíří malárie a spavá nemoc a kdo je přenáší.",
      "Vybrat vhodnou ochranu před malárií a zdůvodnit ji.",
    ],
    boundaries: [
      "Jen zástupci z běžných učebnic 6. ročníku; latinské názvy nejsou klíčem.",
      "Životní cyklus zimničky se nerozebírá, stačí přenašeč a napadení červených krvinek.",
      "Léčbu určuje lékař; úlohy učí prevenci, ne léčení.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Prvok je jediná buňka s jádrem. Pohyb prozradí zástupce: brvy = trepka, panožky = měňavka, bičík = krásnoočko. Malárii přenáší komár anofeles, spavou nemoc moucha tse-tse.",
      steps: [
        "Najdi v zadání znak: pohyb, barvu, výživu nebo prostředí.",
        "Přiřaď znak k zástupci nebo k nemoci a jejímu přenašeči.",
        "U prevence se ptej, jakou cestou se nemoc šíří, a vyber ochranu právě proti ní.",
      ],
      commonMistake: "Splést brvy s bičíkem, nebo si myslet, že malárie se šíří vodou či že ji přenáší klíště.",
      example: "Zelený prvok s bičíkem, který plave ke světlu, je krásnoočko. Proti malárii chrání moskytiéra a repelent, protože ji přenáší komár.",
    },
  },
];
