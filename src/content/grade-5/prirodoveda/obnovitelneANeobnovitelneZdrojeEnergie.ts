import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a zpětné vazby a na L2/L3 jen pět až sedm různých otázek. Teď:
// L1 obnovitelné a neobnovitelné zdroje, elektrárny · L2 výhody a nevýhody,
// skleníkový efekt, uhlíková stopa · L3 rozhodování v běžných situacích.

const L1: PracticeTask[] = [
  choice("Který zdroj energie je obnovitelný?", "sluneční záření", [
    { value: "uhlí", why: "Uhlí vznikalo miliony let a jeho zásoby dojdou." },
    { value: "ropa", why: "Ropa vznikala miliony let a jejích zásob ubývá." },
    { value: "zemní plyn", why: "Zemní plyn se neobnovuje — jednou dojde." },
  ], {
    hints: ["Který zdroj bude k dispozici pořád, i když ho využíváme?", "Obnovitelný zdroj se v přírodě stále doplňuje — třeba světlo, které každý den dopadá na Zemi."],
    explanation: "Sluneční záření se neustále obnovuje, uhlí, ropa a plyn ne.",
  }),
  choice("Který zdroj energie je neobnovitelný?", "uhlí", [
    { value: "vítr", why: "Vítr fouká stále znovu — je obnovitelný." },
    { value: "voda v řece", why: "Řeka teče pořád — je to obnovitelný zdroj." },
    { value: "sluneční záření", why: "Slunce svítí každý den — je obnovitelné." },
  ], {
    hints: ["Který zdroj se těží z hlubin a jednou dojde?", "Tento zdroj vznikl z pravěkých rostlin a spaluje se v tepelných elektrárnách."],
    explanation: "Uhlí vznikalo miliony let; co spálíme, se už neobnoví.",
  }),
  choice("Co pohání větrnou elektrárnu?", "proudění vzduchu", [
    { value: "pára z uhlí", why: "Pára z uhlí pohání tepelnou elektrárnu." },
    { value: "padající voda", why: "Padající voda pohání vodní elektrárnu." },
    { value: "sluneční světlo", why: "Sluneční světlo využívají fotovoltaické panely." },
  ], {
    hints: ["Co roztáčí lopatky vysokých stožárů na kopcích?", "Lopatky se točí, když se do nich opře pohybující se vzduch."],
    explanation: "Větrnou elektrárnu pohání vítr — proudící vzduch roztočí lopatky.",
  }),
  choice("Co pohání vodní elektrárnu?", "proudící voda", [
    { value: "vítr", why: "Vítr pohání větrnou elektrárnu." },
    { value: "spalované uhlí", why: "Uhlí se spaluje v tepelné elektrárně." },
    { value: "štěpení uranu", why: "Uran se štěpí v jaderné elektrárně." },
  ], {
    hints: ["Proč se takové elektrárny stavějí u přehrad?", "Řeka se zadrží hrází a pak ze značné výšky padá na lopatky turbín."],
    explanation: "Vodní elektrárnu pohání proudící nebo padající voda.",
  }),
  choice("Které zařízení mění sluneční světlo přímo na elektřinu?", "fotovoltaický panel", [
    { value: "větrná turbína", why: "Turbína se točí větrem." },
    { value: "parní kotel", why: "Kotel vyrábí páru spalováním paliva." },
    { value: "přehrada", why: "Přehrada zadržuje vodu pro vodní elektrárnu." },
  ], {
    hints: ["Na střechách domů bývají tmavé desky, které se natáčejí ke slunci. Co to je?", "Tyto desky vyrábějí proud, jen když na ně svítí slunce."],
    explanation: "Fotovoltaický (solární) panel mění světlo přímo na elektřinu.",
  }),
  choice("Z čeho vzniklo uhlí, ropa a zemní plyn?", "ze zbytků pravěkých organismů", [
    { value: "z obyčejného kamení", why: "Kamení nehoří a paliva z něj nevznikla." },
    { value: "ze sopečné lávy", why: "Z lávy vznikají vyvřelé horniny." },
    { value: "z mořské vody", why: "Z mořské vody vzniká sůl, ne paliva." },
  ], {
    hints: ["Tato paliva hoří. Co živého bylo kdysi zasypáno?", "Pravěké rostliny a drobní živočichové se pod zemí miliony let měnili v paliva."],
    explanation: "Uhlí, ropa a plyn vznikly ze zbytků pravěkých rostlin a živočichů — proto se jim říká fosilní paliva.",
  }),
  choice("Proč se uhlí, ropa a plyn nazývají neobnovitelné?", "jejich zásoby se vyčerpají", [
    { value: "nedají se spálit", why: "Spálit se dají — proto se používají." },
    { value: "obnovují se každý rok", why: "Vznikaly miliony let." },
    { value: "jsou zadarmo", why: "Cena s obnovitelností nesouvisí." },
  ], {
    hints: ["Jak rychle tato paliva vznikají a jak rychle je spotřebujeme?", "Vznikala miliony let, ale lidstvo je spotřebuje za pár set let."],
    explanation: "Zásoby fosilních paliv jsou omezené a za lidský život se neobnoví.",
  }),
  choice("Která elektrárna spaluje uhlí?", "tepelná elektrárna", [
    { value: "vodní elektrárna", why: "Vodní elektrárna využívá proudící vodu." },
    { value: "větrná elektrárna", why: "Větrná elektrárna využívá vítr." },
    { value: "sluneční elektrárna", why: "Sluneční elektrárna využívá světlo." },
  ], {
    hints: ["Která elektrárna má vysoký komín, ze kterého stoupá kouř?", "Spalováním paliva se ohřívá voda na páru a ta roztáčí turbínu."],
    explanation: "Uhlí se spaluje v tepelných elektrárnách.",
  }),
  choice("Který plyn vzniká při spalování uhlí a otepluje planetu?", "oxid uhličitý", [
    { value: "kyslík", why: "Kyslík se při hoření naopak spotřebovává." },
    { value: "vodík", why: "Vodík při spalování uhlí nevzniká." },
    { value: "dusík", why: "Dusík je ve vzduchu, ale oteplování nezpůsobuje." },
  ], {
    hints: ["Ten plyn také vydechujeme.", "Tento plyn se hromadí v ovzduší a zadržuje teplo jako skleník."],
    explanation: "Spalováním vzniká oxid uhličitý, který v ovzduší zadržuje teplo.",
  }),
  choice("Který zdroj nevyrábí v noci elektřinu?", "sluneční energie", [
    { value: "vodní energie", why: "Voda teče i v noci." },
    { value: "uhlí", why: "Uhlí se může spalovat kdykoli." },
    { value: "jaderná energie", why: "Jaderná elektrárna běží ve dne i v noci." },
  ], {
    hints: ["Co v noci chybí?", "V noci nesvítí slunce, a panely proto nic nevyrábějí."],
    explanation: "Sluneční panely vyrábějí jen za světla; v noci pomohou jen baterie.",
  }),
  choice("Jak můžeš doma šetřit energií?", "zhasínat, když odcházím z místnosti", [
    { value: "nechat běžet televizi, i když se nedívám", why: "Zapnutá televize spotřebovává energii zbytečně." },
    { value: "větrat při zapnutém topení s oknem dokořán", why: "Teplo uniká ven a topení musí topit víc." },
    { value: "svítit ve dne v celém bytě", why: "Ve dne stačí denní světlo." },
  ], {
    hints: ["Kdy svítí světlo zbytečně?", "Každá žárovka, která svítí v prázdné místnosti, spotřebovává elektřinu úplně zbytečně."],
    explanation: "Zhasínání v prázdných místnostech šetří elektřinu.",
  }),
  choice("Který zdroj tepla je obnovitelný, když se les znovu vysazuje?", "dřevo", [
    { value: "uhlí", why: "Uhlí se neobnovuje." },
    { value: "ropa", why: "Ropa se neobnovuje." },
    { value: "zemní plyn", why: "Zemní plyn se neobnovuje." },
  ], {
    hints: ["Co roste v lese a dá se spálit v kamnech?", "Pokácené stromy mohou dorůst — musí se ale znovu vysazovat."],
    explanation: "Dřevo je obnovitelné, pokud se les znovu vysazuje a dorůstá.",
  }),
  choice("Co je obnovitelný zdroj energie?", "zdroj, který se v přírodě stále obnovuje", [
    { value: "zdroj, který se spotřebuje a už se nevrátí", why: "To je zdroj neobnovitelný." },
    { value: "zdroj, který se dá koupit jen v obchodě", why: "O tom, kde se kupuje, to nerozhoduje." },
    { value: "zdroj, který funguje jen v zimě", why: "Obnovitelnost s ročním obdobím nesouvisí." },
  ], {
    hints: ["Co znamená slovo obnovit?", "Takový zdroj se doplňuje sám — slunce svítí, vítr fouká a řeky tečou pořád znovu."],
    explanation: "Obnovitelný zdroj se v přírodě stále doplňuje — slunce, vítr, voda, dřevo.",
  }),
];

const L2: PracticeTask[] = [
  choice("Jaká je nevýhoda sluneční elektrárny?", "vyrábí jen za světla", [
    { value: "znečišťuje vzduch kouřem", why: "Sluneční elektrárna nic nespaluje." },
    { value: "spotřebovává uhlí", why: "Uhlí nepotřebuje." },
    { value: "vyčerpá zásoby Slunce", why: "Slunce bude svítit miliardy let." },
  ], {
    hints: ["Kdy panely nevyrábějí?", "V noci a za hustých mraků panely vyrobí málo nebo nic."],
    explanation: "Sluneční elektrárna vyrábí jen za světla a méně za zataženého počasí.",
  }),
  choice("Jaká je nevýhoda větrné elektrárny?", "když nefouká, nevyrábí", [
    { value: "vypouští oxid uhličitý", why: "Větrná elektrárna nic nespaluje." },
    { value: "potřebuje uhlí", why: "Uhlí nepotřebuje." },
    { value: "funguje jen v noci", why: "Funguje kdykoli fouká." },
  ], {
    hints: ["Na čem výroba závisí?", "Lopatky se točí jen tehdy, když se do nich opře vzduch."],
    explanation: "Větrná elektrárna vyrábí jen za větru.",
  }),
  choice("Jaká je nevýhoda uhelné elektrárny?", "znečišťuje vzduch a otepluje planetu", [
    { value: "vyrábí jen za silného větru", why: "To je nevýhoda větrné elektrárny." },
    { value: "nemůže běžet v noci", why: "Uhelná elektrárna běží i v noci." },
    { value: "potřebuje velký spád řeky", why: "Spád potřebuje vodní elektrárna." },
  ], {
    hints: ["Co stoupá z komínů uhelných elektráren?", "Spalováním vzniká kouř, prach a oxid uhličitý."],
    explanation: "Uhelná elektrárna znečišťuje ovzduší a zvyšuje množství oxidu uhličitého.",
  }),
  choice("Proč se vodní elektrárny staví u přehrad?", "padající voda roztočí turbíny", [
    { value: "voda v přehradě ohřívá turbíny", why: "Turbíny se neohřívají, ale roztáčejí." },
    { value: "přehrada zachycuje sluneční světlo", why: "Světlo zachytávají fotovoltaické panely." },
    { value: "voda chladí uhlí", why: "Ve vodní elektrárně žádné uhlí není." },
  ], {
    hints: ["Proč musí voda padat z výšky?", "Čím z větší výšky voda padá, tím větší silou roztočí lopatky turbíny."],
    explanation: "Přehrada zvedne hladinu; voda padá dolů a roztáčí turbíny.",
  }),
  choice("Co je skleníkový efekt?", "plyny v ovzduší zadržují teplo u Země", [
    { value: "sklo skleníku chladí zeleninu", why: "Skleník naopak hřeje." },
    { value: "Slunce se přibližuje k Zemi", why: "Vzdálenost Slunce se kvůli tomu nemění." },
    { value: "díra v ozonu pouští chlad", why: "Ozonová vrstva chrání před zářením, ne před chladem." },
  ], {
    hints: ["Proč je ve skleníku tepleji než venku?", "Některé plyny v ovzduší fungují jako sklo skleníku: pustí sluneční teplo dovnitř, ale špatně ven."],
    explanation: "Skleníkové plyny zadržují teplo u Země; když jich přibývá, Země se otepluje.",
  }),
  choice("Proč se Země v posledních desetiletích rychle otepluje?", "lidé spalují hodně uhlí, ropy a plynu", [
    { value: "Slunce je každý rok blíž k Zemi", why: "Vzdálenost Země od Slunce se nemění." },
    { value: "Země se začala točit rychleji", why: "Rychlost otáčení teplotu nezvyšuje." },
    { value: "na Zemi je stále víc sopek", why: "Sopky oteplování nevysvětlují." },
  ], {
    hints: ["Který plyn vzniká při spalování paliv?", "Oxidu uhličitého v ovzduší přibývá hlavně kvůli elektrárnám, autům a továrnám."],
    explanation: "Spalováním fosilních paliv přibývá skleníkových plynů, a Země se otepluje.",
  }),
  choice("Co je uhlíková stopa?", "kolik oxidu uhličitého vznikne kvůli našemu jednání", [
    { value: "černý otisk uhlí na podlaze", why: "Nejde o skutečnou stopu." },
    { value: "množství uhlí, které zbývá v dolech", why: "Nejde o zásoby uhlí." },
    { value: "stopa, kterou zanechá auto na silnici", why: "Nejde o otisk pneumatik." },
  ], {
    hints: ["Stopa nemusí být otisk v blátě. Co zanechá jízda autem nebo let letadlem?", "Když jedeme autem, svítíme nebo topíme, vzniká oxid uhličitý. Jeho součet se jmenuje stopa…"],
    explanation: "Uhlíková stopa vyjadřuje, kolik oxidu uhličitého vznikne kvůli tomu, co děláme.",
  }),
  choice("Který dopravní prostředek má nejmenší uhlíkovou stopu?", "jízdní kolo", [
    { value: "auto", why: "Auto spaluje benzín nebo naftu." },
    { value: "letadlo", why: "Letadlo spaluje hodně paliva." },
    { value: "motorka", why: "Motorka spaluje benzín." },
  ], {
    hints: ["Který z nich nespaluje žádné palivo?", "Tento dopravní prostředek pohání jen síla tvých nohou."],
    explanation: "Kolo nespaluje žádné palivo — jeho uhlíková stopa je nejmenší.",
  }),
  choice("Která česká elektrárna je jaderná?", "Temelín", [
    { value: "Orlík", why: "Orlík je vodní elektrárna na Vltavě." },
    { value: "Prunéřov", why: "Prunéřov je uhelná elektrárna." },
    { value: "Lipno", why: "Lipno je vodní elektrárna na Vltavě." },
  ], {
    hints: ["Jaderné elektrárny máme v Česku dvě — jednu na jihu Čech a jednu na jihu Moravy.", "Tato elektrárna leží nedaleko Českých Budějovic a má čtyři obří chladicí věže."],
    explanation: "Temelín (a také Dukovany) jsou jaderné elektrárny.",
  }),
  choice("Je uran obnovitelný zdroj?", "ne, jeho zásoby jsou omezené", [
    { value: "ano, doroste v zemi", why: "Uran nedorůstá." },
    { value: "ano, vyrábí ho Slunce", why: "Uran se na Zemi těží ze starých zásob." },
    { value: "ano, je ho nekonečně mnoho", why: "Zásoby uranu jsou omezené." },
  ], {
    hints: ["Odkud se uran bere?", "Uran se těží z hornin v dolech; co se vytěží, znovu nevznikne."],
    explanation: "Uran se těží z omezených zásob — obnovitelný není.",
  }),
  choice("Jaká je výhoda jaderné elektrárny?", "nevypouští oxid uhličitý", [
    { value: "nevzniká v ní žádný odpad", why: "Vzniká radioaktivní odpad, který se musí bezpečně uložit." },
    { value: "pohání ji jen vítr", why: "Jaderná elektrárna vítr nevyužívá." },
    { value: "nepotřebuje žádné palivo", why: "Palivem je uran." },
  ], {
    hints: ["Co stoupá z chladicích věží jaderné elektrárny?", "Z věží stoupá jen vodní pára; nic se tam nespaluje."],
    explanation: "Jaderná elektrárna nic nespaluje, a proto nevypouští oxid uhličitý; problémem je radioaktivní odpad.",
  }),
  choice("Jak se jmenuje soustava přehrad a vodních elektráren na Vltavě?", "Vltavská kaskáda", [
    { value: "Moravská brána", why: "Moravská brána je průchod mezi horami." },
    { value: "Krkonošský hřeben", why: "To je hřeben hor." },
    { value: "Šumavské pláně", why: "To je náhorní plošina na Šumavě." },
  ], {
    hints: ["Přehrady na Vltavě jdou jedna za druhou jako schody.", "Patří k ní Lipno, Orlík i Slapy; přehrady jdou po řece jedna za druhou jako schody a nesou jméno té řeky."],
    explanation: "Vltavská kaskáda je řada přehrad s elektrárnami — Lipno, Orlík, Slapy a další.",
  }),
  choice("Proč je výhodné třídit odpad?", "šetří se suroviny i energie na výrobu", [
    { value: "koše pak méně voní", why: "Nejde o vůni, ale o suroviny." },
    { value: "odpad pak zmizí", why: "Odpad nezmizí — tříděný se znovu využije." },
    { value: "je to jen povinnost bez užitku", why: "Recyklace přináší velký užitek." },
  ], {
    hints: ["Co se stane s vytříděným papírem nebo plastem?", "Z recyklovaného papíru se vyrobí nový papír a nemusí se kvůli tomu kácet stromy ani spotřebovat tolik energie."],
    explanation: "Recyklace šetří suroviny i energii potřebnou na výrobu nových věcí.",
  }),
];

const L3: PracticeTask[] = [
  choice("Rodina chce ušetřit co nejvíc energie na topení. Co pomůže nejvíc?", "zateplit dům", [
    { value: "koupit větší televizi", why: "Televize topení neušetří." },
    { value: "nechat přes den otevřená okna", why: "Otevřenými okny uniká teplo." },
    { value: "topit víc a kratší dobu", why: "Tím se energie neušetří." },
  ], {
    hints: ["Kudy z domu uniká teplo?", "Teplo uniká zdmi, střechou a okny; když je dům dobře izolovaný, stačí topit méně."],
    explanation: "Zateplení zabrání úniku tepla, a dům potřebuje méně energie na vytápění.",
  }),
  choice("Proč nemůžeme hned vypnout všechny uhelné elektrárny?", "chyběla by elektřina z jiných zdrojů", [
    { value: "uhlí je nevyčerpatelné", why: "Zásoby uhlí jsou omezené." },
    { value: "uhelné elektrárny neškodí", why: "Znečišťují ovzduší." },
    { value: "větrné elektrárny jsou zakázané", why: "Nejsou zakázané, jen jich zatím nestačí." },
  ], {
    hints: ["Kolik elektřiny se u nás vyrábí z uhlí?", "Z uhlí se zatím vyrábí velká část elektřiny; jiné zdroje se musí nejdřív postavit."],
    explanation: "Uhelné elektrárny se nahrazují postupně, aby elektřina nikde nechyběla.",
  }),
  choice("Solární panely vyrobí přes den víc elektřiny, než dům spotřebuje. Co s přebytkem?", "uloží se do baterie nebo pošle do sítě", [
    { value: "přebytek prostě zmizí", why: "Elektřinu lze uložit nebo poslat dál." },
    { value: "přebytkem se dům ochladí", why: "Přebytek elektřiny dům nechladí." },
    { value: "z přebytku se vyrobí uhlí", why: "Z elektřiny uhlí nevzniká." },
  ], {
    hints: ["Jak se dá elektřina schovat na večer?", "Elektřinu lze uskladnit v domácím akumulátoru na večer, anebo ji předat do rozvodné soustavy pro ostatní."],
    explanation: "Přebytek se ukládá do baterií nebo posílá do sítě.",
  }),
  choice("Která volba snižuje uhlíkovou stopu?", "jet do školy autobusem místo autem", [
    { value: "letět na víkend do zahraničí letadlem", why: "Let letadlem má velkou uhlíkovou stopu." },
    { value: "kupovat jahody dovezené letadlem v zimě", why: "Dovoz letadlem stopu zvyšuje." },
    { value: "nechat stojící auto s běžícím motorem", why: "Běžící motor spaluje palivo zbytečně." },
  ], {
    hints: ["Ve které volbě se spálí méně paliva na jednoho člověka?", "Autobus sveze desítky lidí najednou, auto obvykle jednoho nebo dva."],
    explanation: "Autobus veze mnoho lidí najednou, a na každého připadne méně spáleného paliva.",
  }),
  choice("Proč se malé vodní elektrárny stavějí na horských potocích?", "voda tam má velký spád", [
    { value: "voda je tam teplejší", why: "Teplota vody výrobu neovlivní." },
    { value: "na horách víc svítí slunce", why: "Slunce vodní elektrárnu nepohání." },
    { value: "na horách víc fouká", why: "Vítr pohání větrnou, ne vodní elektrárnu." },
  ], {
    hints: ["Co roztáčí turbínu vodní elektrárny?", "Čím strměji voda padá, tím víc síly má. V horách teče potok z kopce prudce dolů."],
    explanation: "Na horských potocích voda prudce padá a roztáčí turbíny i bez velké přehrady.",
  }),
  choice("Kdy vyrobí větrná elektrárna nejvíc elektřiny?", "při silném a stálém větru", [
    { value: "za úplného bezvětří", why: "Za bezvětří se lopatky netočí." },
    { value: "v tichém letním parnu", why: "V parnu obvykle moc nefouká." },
    { value: "jen v noci", why: "Záleží na větru, ne na denní době." },
  ], {
    hints: ["Jak se lopatky točí za bezvětří a jak za silného větru?", "Čím silněji a vytrvaleji fouká, tím rychleji se lopatky točí; při extrémní vichřici se ale elektrárna pro jistotu zastaví."],
    explanation: "Nejvíc vyrábí při silném stálém větru.",
  }),
  choice("Proč je dřevo obnovitelné, jen když se les vysazuje?", "stromy dorůstají desítky let", [
    { value: "dřevo se samo obnoví za týden", why: "Strom roste desítky let." },
    { value: "dřevo vůbec nehoří", why: "Dřevo hoří." },
    { value: "les se vysazovat nemusí", why: "Bez vysazování by les ubýval." },
  ], {
    hints: ["Jak dlouho roste strom?", "Pokácený strom nahradí nový až za mnoho let; kdo kácí a nesází, les spotřebuje."],
    explanation: "Dřevo se obnoví jen tehdy, když za pokácené stromy vyrostou nové.",
  }),
  choice("Co mají společného uhlí, ropa a zemní plyn?", "vznikly ze zbytků organismů před miliony let", [
    { value: "všechny jsou obnovitelné", why: "Všechny tři jsou neobnovitelné." },
    { value: "vyrábí je Slunce každý den", why: "Vznikaly miliony let pod zemí." },
    { value: "všechny tři jsou kovy", why: "Nejsou to kovy, ale paliva." },
  ], {
    hints: ["Jak se těmto palivům souhrnně říká?", "Říká se jim fosilní paliva — jako fosilie, zkameněliny pravěkého života."],
    explanation: "Uhlí, ropa a plyn jsou fosilní paliva ze zbytků pravěkých organismů.",
  }),
  choice("Proč nejsou elektromobily úplně bez uhlíkové stopy?", "elektřina se často vyrábí z uhlí", [
    { value: "elektromobily spalují benzín", why: "Elektromobil benzín nespaluje." },
    { value: "baterie samy vyrábějí uhlí", why: "Baterie uhlí nevyrábějí." },
    { value: "elektřina je vždy jen z uhlí", why: "Elektřina je i z vody, slunce a jádra." },
  ], {
    hints: ["Odkud se bere elektřina, kterou se elektromobil nabíjí?", "Když se proud vyrobí v uhelné elektrárně, vznikne oxid uhličitý — jen jinde než u auta."],
    explanation: "Stopa záleží na tom, z čeho se elektřina vyrábí; část je stále z uhlí.",
  }),
  choice("Která elektrárna nejméně závisí na počasí?", "jaderná", [
    { value: "sluneční", why: "Sluneční závisí na světle." },
    { value: "větrná", why: "Větrná závisí na větru." },
    { value: "malá vodní na potoce", why: "Za sucha má potok málo vody." },
  ], {
    hints: ["Která elektrárna nepotřebuje slunce, vítr ani déšť?", "Tato elektrárna vyrábí teplo z paliva uvnitř reaktoru, ať je venku jakkoli."],
    explanation: "Jaderná elektrárna vyrábí stejně ve dne i v noci, za větru i bezvětří.",
  }),
  choice("Proč je výhodné mít více druhů zdrojů elektřiny?", "když jeden nevyrábí, zastoupí ho jiný", [
    { value: "aby byla elektřina dražší", why: "Cílem není zdražení." },
    { value: "protože jeden druh je zakázaný", why: "Nejde o zákaz." },
    { value: "aby se víc znečišťovalo", why: "Cílem je spolehlivost, ne znečištění." },
  ], {
    hints: ["Co se stane, když bude bezvětří a zataženo?", "Když nefouká a nesvítí, musí dodávat proud jiné zdroje — voda nebo jádro."],
    explanation: "Různé zdroje se doplňují, a elektřina tak nechybí.",
  }),
  choice("Proč potřebuje tepelná elektrárna hodně vody?", "na výrobu páry a chlazení", [
    { value: "na pití zaměstnanců", why: "Pitné vody stačí málo." },
    { value: "na mytí uhlí", why: "Nejde o mytí." },
    { value: "aby turbíny nerezavěly", why: "Voda by turbíny spíš ohrozila." },
  ], {
    hints: ["Co roztáčí turbínu v tepelné elektrárně?", "Voda se ohřeje na páru, pára roztočí turbínu a pak se musí znovu ochladit."],
    explanation: "Voda se mění na páru, která pohání turbíny, a pak se chladí.",
  }),
  choice("Čím nahradíš starou žárovku, když chceš šetřit?", "úspornou LED žárovkou", [
    { value: "dvěma starými žárovkami", why: "Spotřeba by se zdvojnásobila." },
    { value: "silnější žárovkou", why: "Silnější žárovka spotřebuje víc." },
    { value: "starou klasickou žárovkou", why: "Klasická žárovka mění většinu energie na teplo." },
  ], {
    hints: ["Která žárovka mění víc elektřiny na světlo a méně na teplo?", "Tato žárovka svítí stejně jasně a spotřebuje mnohem méně elektřiny."],
    explanation: "LED žárovka svítí stejně a spotřebuje zlomek elektřiny.",
  }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level >= 3 ? L3 : level === 2 ? L2 : L1);
}

export const OBNOVITELNEANEOBNOVITELNEZDROJEENERGIE: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie",
    title: "Obnovitelné a neobnovitelné zdroje energie",
    studentTitle: "Zdroje energie",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Energie a její zdroje",
    briefDescription: "Poznáš rozdíl mezi obnovitelnými a neobnovitelnými zdroji energie.",
    keywords: ["obnovitelné", "neobnovitelné", "uhlí", "ropa", "slunce", "vítr", "solární", "CO₂", "skleníkový efekt"],
    goals: ["Rozlišit obnovitelné a neobnovitelné zdroje energie", "Popsat výhody a nevýhody různých zdrojů", "Vysvětlit skleníkový efekt a uhlíkovou stopu"],
    boundaries: ["Neprobírá energetiku na úrovni fyziky", "Neprobírá ekonomii energetiky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Obnovitelné: slunce, vítr, voda, biomasa, geotermální. Neobnovitelné: uhlí, ropa, zemní plyn, uran.",
      steps: [
        "Obnovitelné: nevyčerpatelné v lidském časovém horizontu.",
        "Neobnovitelné: vznikaly miliony let – zásoby jsou konečné.",
        "Spalování fosilních paliv uvolňuje oxid uhličitý a zesiluje skleníkový efekt.",
        "Úspora energie: LED, izolace, veřejná doprava.",
      ],
      commonMistake: "Jaderná energie NENÍ obnovitelná – uran je neobnovitelný nerost.",
      example: "Solární panely jsou obnovitelný zdroj, uhlí neobnovitelný a při spalování uvolňuje oxid uhličitý.",
    },
  },
];
