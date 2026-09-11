/**
 * Přírodověda 4. ročník — Les, louka, pole, rybník: rostliny a živočichové.
 *
 * Přepsáno 2026-09-11. Předchozí verze měla jediný typ úlohy (přiřaď
 * organismus k prostředí) na všech třech úrovních, bez nápověd a vysvětlení,
 * a cíle tématu (patra lesa, potravní řetězec, rozkladači) necvičila vůbec.
 * Obsahovala i chyby: vymyšlený „Klouzatec", slimák plzák (suchozemský)
 * u rybníka, luční tráva ovsík u pole, bobr v lese, divoké prase na poli.
 *
 * Všechny úlohy jsou match_pairs — téma typy nemíchá (audit Cause C).
 * Každá úloha má PRÁVĚ JEDNO úplné přiřazení: i když by nějaké zvíře občas
 * snědlo i jinou potravu, zbylé dvojice ho k jedné možnosti donutí.
 *
 * Gradace:
 *  • L1 — přiřadit typický organismus k prostředí (rozpoznání).
 *  • L2 — patra lesa a hlavní potrava živočichů (použití znalosti).
 *  • L3 — úlohy v potravním řetězci, konec řetězce, jak člověk
 *         jednotlivá prostředí vytváří a ohrožuje (vztahy a úvaha).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { match, shuffle } from "./_shared";

const Q_PLACE = "Spoj živočicha nebo rostlinu s místem, kde nejčastěji žije.";
const pl = (rybnik: string, les: string, louka: string, pole: string) => [
  { left: rybnik, right: "Rybník" },
  { left: les, right: "Les" },
  { left: louka, right: "Louka" },
  { left: pole, right: "Pole" },
];

const POOL_L1: PracticeTask[] = [
  match(Q_PLACE, pl("Kapr", "Veverka", "Kopretina", "Pšenice"), {
    hints: ["Začni tím, co nemůže žít bez vody.", "Kapr dýchá žábrami a veverka skáče po stromech. Kopretina roste sama mezi trávou, pšenici někdo zasel."],
    explanation: "Kapr je ryba, žije ve vodě rybníka. Veverka potřebuje stromy, proto žije v lese. Kopretina roste sama mezi trávou na louce. Pšenici zasévá zemědělec na pole.",
  }),
  match(Q_PLACE, pl("Leknín", "Datel", "Kobylka", "Skřivan polní"), {
    hints: ["Jedna rostlina má listy, které plavou na vodě.", "Datel tluče zobákem do kmenů stromů. Skřivan zpívá vysoko nad obilím a kobylka skáče ve vysoké trávě."],
    explanation: "Leknín má listy a květy na hladině rybníka. Datel hledá hmyz v kmenech stromů v lese. Kobylka žije v trávě na louce. Skřivan polní hnízdí na zemi mezi obilím.",
  }),
  match(Q_PLACE, pl("Štika", "Smrk", "Jetel luční", "Chrpa modrá"), {
    hints: ["Jeden živočich je dravá ryba.", "Smrk je jehličnatý strom. Jetel kvete růžově mezi trávou a chrpa kvete modře mezi obilím."],
    explanation: "Štika je dravá ryba, loví v rybníce. Smrk je nejčastější strom českých lesů. Jetel luční roste na loukách a chrpa modrá kvete na polích mezi obilím.",
  }),
  match(Q_PLACE, pl("Rákos", "Borůvka", "Zvonek", "Koroptev"), {
    hints: ["Rákos roste na březích, kde je stále mokro.", "Borůvky se sbírají pod stromy. Zvonek kvete modře v trávě a koroptev si staví hnízdo na zemi mezi obilím."],
    explanation: "Rákos roste v mělké vodě u břehů rybníka. Borůvka je nízký keřík ve stínu lesa. Zvonek kvete na loukách. Koroptev je polní pták, hnízdí mezi obilím.",
  }),
  match(Q_PLACE, pl("Kachna divoká", "Mravenec lesní", "Sedmikráska", "Řepka"), {
    hints: ["Kachna má mezi prsty plovací blány. Kde se jí hodí?", "Mravenec lesní staví velké kupy z jehličí. Sedmikráska kvete v nízké trávě a řepku zasévá zemědělec."],
    explanation: "Kachna divoká plave po rybníce a potravu hledá ve vodě. Mravenec lesní staví mraveniště z jehličí v lese. Sedmikráska roste v trávě na louce. Řepka se pěstuje na polích.",
  }),
  match(Q_PLACE, pl("Skokan zelený", "Kapradina", "Modrásek", "Hraboš polní"), {
    hints: ["Skokan klade vajíčka do vody.", "Kapradina roste ve stínu stromů. Motýl modrásek sedá na květy v trávě a hraboš si hrabe chodby mezi obilím."],
    explanation: "Skokan zelený žije u vody a klade do ní vajíčka. Kapradina potřebuje stín a vlhko lesa. Modrásek poletuje po kvetoucí louce. Hraboš polní žije v norách na polích.",
  }),
  match(Q_PLACE, pl("Orobinec", "Jelen", "Kohoutek luční", "Vlčí mák"), {
    hints: ["Orobinec má hnědé palice a roste v mělké vodě u břehu.", "Jelen se schovává mezi stromy. Kohoutek luční kvete růžově v trávě a vlčí mák svítí červeně v obilí."],
    explanation: "Orobinec roste v mělké vodě rybníka. Jelen žije v lese. Kohoutek luční kvete na vlhkých loukách. Vlčí mák roste na polích mezi obilím.",
  }),
  match(Q_PLACE, pl("Labuť", "Sojka", "Pampeliška", "Ječmen"), {
    hints: ["Labuť plave a potravu hledá pod hladinou.", "Sojka schovává žaludy mezi stromy. Pampeliška žlutě kvete v trávě a ječmen sklízí kombajn."],
    explanation: "Labuť žije na rybníce a spásá vodní rostliny. Sojka je lesní pták, na podzim schovává žaludy. Pampeliška kvete na loukách. Ječmen je obilnina z pole.",
  }),
  match(Q_PLACE, pl("Lín", "Jezevec", "Krtek", "Křeček polní"), {
    hints: ["Lín je ryba, která se ráda zavrtává do bahna.", "Jezevec si hrabe noru mezi stromy. Krtek dělá krtince v trávě a křeček si nosí do nory zrní z obilí."],
    explanation: "Lín žije v bahnitých rybnících. Jezevec má noru v lese. Krtek loví žížaly pod loukou a nahoře po něm zůstávají krtince. Křeček polní žije na polích a do nory si nosí zrní.",
  }),
  match(Q_PLACE, pl("Vodoměrka", "Mech", "Řebříček", "Kukuřice"), {
    hints: ["Vodoměrka běhá po hladině a nepotopí se.", "Mech roste ve stínu na zemi mezi stromy. Řebříček má bílé okolíky v trávě a kukuřici zasévá zemědělec."],
    explanation: "Vodoměrka běhá po hladině rybníka. Mech pokrývá vlhkou zem v lese. Řebříček roste na loukách. Kukuřice se pěstuje na polích.",
  }),
  match(Q_PLACE, pl("Lyska", "Puštík", "Šťovík", "Bažant"), {
    hints: ["Lyska je černý pták s bílou skvrnou na čele a skvěle se potápí.", "Puštík přes den spí v dutině stromu. Šťovík roste mezi trávou a bažant hledá zrní na polích."],
    explanation: "Lyska plave a potápí se na rybníce. Puštík je sova, žije v lese a hnízdí v dutinách stromů. Šťovík roste na loukách. Bažant sbírá zrní a semena na polích.",
  }),
  match(Q_PLACE, pl("Okřehek", "Buk", "Koník luční", "Zajíc polní"), {
    hints: ["Okřehek jsou drobné zelené lístky, které pokrývají hladinu.", "Buk je listnatý strom s hladkou šedou kůrou. Koník cvrká v trávě a zajíc se krčí v brázdě na poli."],
    explanation: "Okřehek je drobná rostlinka plovoucí na hladině rybníka. Buk je strom listnatých lesů. Koník luční žije v trávě na louce. Zajíc polní se živí na polích a spí v mělkém důlku v zemi.",
  }),
];

const Q_PATRO = "Spoj rostlinu nebo houbu s patrem lesa, ve kterém roste.";
const pa = (strom: string, ker: string, bylina: string, mech: string) => [
  { left: strom, right: "Stromové patro" },
  { left: ker, right: "Keřové patro" },
  { left: bylina, right: "Bylinné patro" },
  { left: mech, right: "Mechové patro" },
];
const Q_FOOD = "Spoj živočicha s jeho hlavní potravou.";

const POOL_L2: PracticeTask[] = [
  match(Q_PATRO, pa("Smrk", "Líska", "Konvalinka", "Mech"), {
    hints: ["Patra lesa jsou jako poschodí domu, od nejvyššího po nejnižší.", "Smrk je nejvyšší. Líska je keř, konvalinka bylina, která na jaře kvete bíle, a mech roste úplně při zemi."],
    explanation: "Les roste v patrech jako dům. Nahoře jsou stromy (smrk), pod nimi keře (líska), níž byliny (konvalinka) a úplně při zemi mechy.",
  }),
  match(Q_PATRO, pa("Buk", "Maliník", "Kapradina", "Hřib (houba)"), {
    hints: ["Seřaď si je podle toho, jak jsou vysoké.", "Buk je vysoký strom, maliník keř s plody, kapradina bylina s velkými listy a hřib roste úplně u země mezi mechem."],
    explanation: "Buk tvoří stromové patro, maliník keřové, kapradina bylinné. Houby jako hřib rostou při zemi v mechovém patře spolu s mechy.",
  }),
  match(Q_PATRO, pa("Borovice", "Ostružiník", "Sasanka hajní", "Mech ploník"), {
    hints: ["Najdi nejdřív tu úplně nejnižší rostlinu.", "Ploník je druh mechu. Sasanka je drobná bílá bylinka, ostružiník pichlavý keř a borovice vysoký strom."],
    explanation: "Borovice patří do stromového patra, ostružiník do keřového a sasanka hajní do bylinného. Ploník je mech, roste v mechovém patře.",
  }),
  match(Q_PATRO, pa("Dub", "Bez černý", "Šťavel kyselý", "Muchomůrka (houba)"), {
    hints: ["Která rostlina má silný kmen a je ze všech nejvyšší?", "Bez černý je keř s černými bobulemi. Šťavel je nízká bylinka s lístky jako jetel a muchomůrka je houba u samé země."],
    explanation: "Dub je strom, bez černý keř a šťavel kyselý bylina. Muchomůrka je houba a roste při zemi v mechovém patře.",
  }),
  match(Q_FOOD, [
    { left: "Srnec", right: "Tráva a výhonky" },
    { left: "Liška", right: "Myši a hraboši" },
    { left: "Datel", right: "Hmyz pod kůrou" },
    { left: "Veverka", right: "Semena a oříšky" },
  ], {
    hints: ["Začni tím, kdo má ostré zuby a loví.", "Datel dobývá potravu zobákem ze stromů, veverka louská šišky a oříšky a srnec se pase."],
    explanation: "Srnec je býložravec a spásá trávu a výhonky. Liška je šelma a loví hlavně myši a hraboše. Datel vytahuje hmyz zpod kůry. Veverka jí semena ze šišek a oříšky.",
  }),
  match(Q_FOOD, [
    { left: "Kapr", right: "Larvy a červi ze dna" },
    { left: "Štika", right: "Menší ryby" },
    { left: "Skokan zelený", right: "Létající hmyz" },
    { left: "Labuť", right: "Vodní rostliny" },
  ], {
    hints: ["Kdo z nich umí vystřelit jazyk a chytit mouchu?", "Štika je dravá ryba, kapr se hrabe v bahně na dně a labuť strká dlouhý krk pod vodu k rostlinám."],
    explanation: "Kapr vyhrabává ze dna larvy a červy. Štika je dravec a loví menší ryby. Skokan chytá jazykem hmyz. Labuť spásá vodní rostliny.",
  }),
  match(Q_FOOD, [
    { left: "Koník luční", right: "Listy trav" },
    { left: "Motýl", right: "Nektar z květů" },
    { left: "Krtek", right: "Žížaly a larvy" },
    { left: "Čáp bílý", right: "Žáby a myši" },
  ], {
    hints: ["Kdo z nich loví pod zemí?", "Motýl má dlouhý sosák, kterým saje z květů. Koník okusuje trávu a čáp chodí po louce a chňape dlouhým zobákem."],
    explanation: "Koník luční okusuje listy trav. Motýl sosákem saje nektar z květů. Krtek loví pod zemí žížaly a larvy. Čáp chytá na louce žáby a myši.",
  }),
  match(Q_FOOD, [
    { left: "Křeček polní", right: "Zrní, které si nosí do nory" },
    { left: "Poštolka", right: "Hraboši a myši" },
    { left: "Skřivan polní", right: "Semena a hmyz" },
    { left: "Zajíc polní", right: "Jetel a tráva" },
  ], {
    hints: ["Kdo z nich loví z výšky?", "Poštolka se třepotá nad polem a vrhá se dolů. Křeček si dělá zásoby v noře a zajíc noru nemá, pase se."],
    explanation: "Křeček polní si nosí zrní do nory jako zásobu. Poštolka loví hraboše a myši. Skřivan sbírá semena a hmyz. Zajíc je býložravec a spásá jetel a trávu.",
  }),
  match(Q_FOOD, [
    { left: "Rys", right: "Srnci a zajíci" },
    { left: "Sojka", right: "Žaludy a semena" },
    { left: "Kůrovec", right: "Lýko smrků" },
    { left: "Jelen", right: "Tráva, listí a kůra" },
  ], {
    hints: ["Kdo z nich je velká lesní kočkovitá šelma?", "Kůrovec je malý brouk, který žije pod kůrou smrku. Sojka schovává na zimu žaludy a jelen okusuje rostliny."],
    explanation: "Rys je šelma a loví hlavně srnce. Sojka jí žaludy a semena. Kůrovec žere lýko pod kůrou smrků, a proto stromy usychají. Jelen je býložravec.",
  }),
  match(Q_FOOD, [
    { left: "Vydra", right: "Ryby a raci" },
    { left: "Vážka", right: "Létající hmyz" },
    { left: "Kachna divoká", right: "Vodní rostliny a semena" },
    { left: "Bobr", right: "Kůra a větvičky" },
  ], {
    hints: ["Kdo z nich loví za letu?", "Vážka chytá ve vzduchu komáry, vydra se potápí za rybami a bobr hlodá stromy u břehu."],
    explanation: "Vydra loví ve vodě ryby a raky. Vážka chytá za letu drobný hmyz. Kachna divoká spásá vodní rostliny a semena. Bobr je býložravec a hlodá kůru a větvičky.",
  }),
  match(Q_FOOD, [
    { left: "Ježek", right: "Hmyz, žížaly a slimáci" },
    { left: "Čmelák", right: "Nektar a pyl" },
    { left: "Káně", right: "Hraboši" },
    { left: "Housenka babočky", right: "Listy kopřivy" },
  ], {
    hints: ["Kdo z nich létá od květu ke květu?", "Housenka okusuje listy jedné pálivé rostliny. Káně krouží nad polem a ježek v noci sbírá drobné živočichy na zahradě."],
    explanation: "Ježek se živí hmyzem, žížalami a slimáky. Čmelák sbírá nektar a pyl. Káně loví hlavně hraboše. Housenky babočky žerou listy kopřiv.",
  }),
  match(Q_FOOD, [
    { left: "Sýkora", right: "Hmyz a semena" },
    { left: "Kos", right: "Žížaly a bobule" },
    { left: "Plch", right: "Oříšky a plody" },
    { left: "Hlemýžď", right: "Listy rostlin" },
  ], {
    hints: ["Kdo z nich loví žížaly na trávníku?", "Hlemýžď pomalu leze po listech, plch v noci šplhá za oříšky a sýkora v zimě chodí na krmítko pro semínka."],
    explanation: "Sýkora jí hmyz a v zimě semena. Kos vytahuje žížaly z trávníku a na podzim zobe bobule. Plch jí oříšky a plody. Hlemýžď okusuje listy rostlin.",
  }),
];

const Q_ROLE = "Spoj člena přírody s jeho úlohou v potravním řetězci.";
const ro = (producent: string, bylinozravec: string, dravec: string, rozkladac: string) => [
  { left: producent, right: "Vyrábí si potravu ze světla" },
  { left: bylinozravec, right: "Živí se rostlinami" },
  { left: dravec, right: "Loví jiné živočichy" },
  { left: rozkladac, right: "Rozkládá odumřelé zbytky" },
];
const Q_CHAIN = "Spoj potravní řetězec se zvířetem, které je na jeho konci.";
const Q_PLACE_RULE = "Spoj místo s tím, co pro něj platí.";

const POOL_L3: PracticeTask[] = [
  match(Q_ROLE, ro("Tráva", "Hraboš", "Poštolka", "Žížala"), {
    hints: ["Kdo z nich nepotřebuje nic jíst, protože mu stačí slunce a voda?", "Hraboš okusuje trávu, poštolka ho loví a žížala v zemi zpracovává spadané listí."],
    explanation: "Tráva si potravu vyrábí ze světla, vody a vzduchu. Hraboš ji spásá, poštolka loví hraboše a žížala rozkládá odumřelé listí na úrodnou půdu.",
  }),
  match(Q_ROLE, ro("Leknín", "Labuť", "Štika", "Bakterie v bahně"), {
    hints: ["Najdi nejdřív rostlinu — ta si potravu vyrábí sama.", "Labuť spásá vodní rostliny a štika loví ryby. Drobné bakterie na dně nikoho neloví a živé rostliny nejedí."],
    explanation: "Leknín si potravu vyrábí ze světla. Labuť se živí vodními rostlinami, štika loví ryby. Bakterie v bahně rozkládají odumřelé zbytky rostlin i živočichů.",
  }),
  match(Q_ROLE, ro("Buk", "Srnec", "Rys", "Mnohonožka"), {
    hints: ["Který z nich roste ze země a má zelené listy?", "Srnec okusuje listy a výhonky a rys loví srnce. Mnohonožka žije v tlejícím listí na zemi."],
    explanation: "Buk si potravu vyrábí ze světla. Srnec je býložravec, rys ho loví. Mnohonožka žere tlející listí a pomáhá ho rozložit.",
  }),
  match(Q_ROLE, ro("Jetel", "Zajíc", "Liška", "Hrobařík"), {
    hints: ["Jen jeden z nich kvete.", "Zajíc se pase a liška loví. Hrobařík je brouk, který zahrabává mrtvá drobná zvířata."],
    explanation: "Jetel je rostlina, potravu si vyrábí ze světla. Zajíc ho spásá, liška zajíce loví. Hrobařík rozkládá těla uhynulých drobných zvířat.",
  }),
  match(Q_ROLE, ro("Pšenice", "Křeček polní", "Káně", "Houby v půdě"), {
    hints: ["Pšenici někdo zasel. Co potřebuje, aby rostla?", "Křeček si nosí zrní a káně krouží nad polem a loví. Houby v půdě se živí tím, co už odumřelo."],
    explanation: "Pšenice si potravu vyrábí ze světla. Křeček se živí jejím zrním, káně loví drobné hlodavce. Houby v půdě rozkládají odumřelé zbytky rostlin.",
  }),
  match(Q_CHAIN, [
    { left: "Tráva → srnec → ?", right: "Rys" },
    { left: "Listy → housenka → ?", right: "Sýkora" },
    { left: "Zrní → hraboš → ?", right: "Poštolka" },
    { left: "Drobní vodní živočichové → kapr → ?", right: "Vydra" },
  ], {
    hints: ["Začni řetězcem, na jehož konec se hodí jen jedno zvíře.", "Kapra uloví jen zvíře, které se potápí. Housenku sezobne malý pták a srnce uloví velká lesní šelma."],
    explanation: "Srnce loví rys, housenky sbírá sýkora, hraboše loví poštolka a kapra uloví vydra, protože se umí potápět. Každý řetězec začíná rostlinou nebo drobnými živočichy a končí lovcem.",
  }),
  match(Q_CHAIN, [
    { left: "Tráva → zajíc → ?", right: "Liška" },
    { left: "Semena → myš → ?", right: "Poštolka" },
    { left: "Hmyz → žába → ?", right: "Užovka" },
    { left: "Listí → žížala → ?", right: "Krtek" },
  ], {
    hints: ["Najdi zvíře, které loví pod zemí.", "Krtek loví pod zemí, užovka polyká žáby vcelku, poštolka se vrhá na myši z výšky a liška dohoní i zajíce."],
    explanation: "Zajíce uloví liška, myš poštolka, žábu užovka a žížalu krtek pod zemí. Na začátku každého řetězce je potrava z rostlin nebo drobní živočichové.",
  }),
  match(Q_CHAIN, [
    { left: "Tráva → jelen → ?", right: "Vlk" },
    { left: "Semena → hraboš → ?", right: "Káně" },
    { left: "Vodní hmyz → plotice → ?", right: "Volavka" },
    { left: "Kůra smrku → kůrovec → ?", right: "Datel" },
  ], {
    hints: ["Kdo z nich umí vytáhnout brouka zpod kůry?", "Jelena uloví jen velká šelma. Rybu chytí pták, který se brodí vodou, a hraboše pták, který krouží nad polem."],
    explanation: "Jelena loví vlk, hraboše káně, plotici volavka a kůrovce vyklove datel zpod kůry. Datel tak pomáhá chránit smrky.",
  }),
  match(Q_PLACE_RULE, [
    { left: "Pole", right: "Člověk ho každý rok oře a oseje" },
    { left: "Louka", right: "Musí se kosit, jinak zaroste keři" },
    { left: "Rybník", right: "Vznikl, když lidé postavili hráz" },
    { left: "Les", right: "Roste i bez setí a sečení" },
  ], {
    hints: ["U každého místa si představ, co by se stalo, kdyby se o něj nikdo nestaral.", "Bez hráze by voda odtekla, bez orby by pole zarostlo plevelem a bez kosení by na louce vyrostly keře. Jen jedno z těch míst roste samo."],
    explanation: "Pole člověk každý rok oře a oseje. Louka se musí kosit nebo spásat, jinak zaroste keři a nakonec lesem. Rybníky u nás postavili lidé hrázemi. Les roste sám.",
  }),
  match(Q_PLACE_RULE, [
    { left: "Pole", right: "Roste tu jen jedna plodina" },
    { left: "Louka", right: "Kvete tu mnoho druhů trav a květin" },
    { left: "Rybník", right: "Na podzim se tu loví ryby" },
    { left: "Les", right: "Rostliny tu rostou v několika patrech" },
  ], {
    hints: ["Kde bývá na podzim výlov kaprů?", "Na poli zemědělec vyseje jednu plodinu, na louce roste pestrá směs a v lese jsou stromy, keře, byliny a mechy nad sebou."],
    explanation: "Na poli roste obvykle jedna plodina, kterou zemědělec zasel. Na louce roste mnoho druhů trav a květin. Rybník se na podzim vypouští a loví se kapři. Les má patra.",
  }),
  match(Q_PLACE_RULE, [
    { left: "Rybník", right: "Na jaře tu kvákají žáby" },
    { left: "Louka", right: "V červnu se tu seče seno" },
    { left: "Pole", right: "V létě tu jezdí kombajny" },
    { left: "Les", right: "Na podzim tu padají žaludy" },
  ], {
    hints: ["Kde se suší tráva na seno pro krávy?", "Kombajn sklízí obilí, žáby kvákají u vody a žaludy padají z dubů."],
    explanation: "Žáby se na jaře scházejí u vody rybníka. Z posečené trávy na louce se suší seno. Kombajny sklízejí v létě obilí na polích. Žaludy padají z dubů v lese.",
  }),
  match(Q_PLACE_RULE, [
    { left: "Pole", right: "Postřiky proti škůdcům ubírají hmyz" },
    { left: "Rybník", right: "Znečištěná voda škodí rybám" },
    { left: "Les", right: "Kůrovec napadá smrky" },
    { left: "Louka", right: "Když se nekosí, zaroste keři" },
  ], {
    hints: ["Kůrovec je brouk, který žije pod kůrou stromů.", "Znečištění vody pocítí jako první ryby. Postřiky dopadnou na hmyz v obilí a louka bez kosení časem zaroste."],
    explanation: "Každé místo ohrožuje něco jiného: pole postřiky, které hubí i užitečný hmyz, rybník znečištěná voda, les kůrovec a louku to, že ji nikdo nekosí.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const LESLOUKAPOLERYBNIKROSTLINYAZIVOCICHOVE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ekosystemy-les-louka-pole-rybnik-rostliny-a-zivocichove",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ekosystemy-les-louka-pole-rybnik-rostliny-a-zivocichove",
    title: "Les, louka, pole, rybník - rostliny a živočichové",
    studentTitle: "Ekosystémy ČR",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš rostliny a živočichy čtyř ekosystémů a pochopíš potravní řetězec.",
    keywords: ["les", "louka", "pole", "rybník", "potravní řetězec", "ekosystém", "patra lesa", "rozkladač"],
    goals: [
      "Uvést typické rostliny a živočichy lesa, louky, pole a rybníka",
      "Popsat patra lesa",
      "Sestavit jednoduchý potravní řetězec",
      "Rozlišit, kdo si potravu vyrábí, kdo se živí rostlinami, kdo loví a kdo rozkládá",
    ],
    boundaries: ["Podrobná taxonomie živočichů není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "mixed",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Zeptej se, co to zvíře nebo rostlina potřebuje k životu — vodu, stín, trávu, nebo obilí.",
      steps: [
        "Les: 4 patra (stromové, keřové, bylinné, mechové).",
        "Louka: trávy a květiny, které se kosí.",
        "Rybník: voda, ryby, rákos, leknín.",
        "Pole: plodina, kterou zasel zemědělec.",
      ],
      commonMistake: "Houby a bakterie si potravu nevyrábějí — rozkládají odumřelé zbytky.",
      example: "Potravní řetězec louky: tráva → hraboš → poštolka.",
    },
  },
];
