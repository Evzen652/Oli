/**
 * Přírodopis 6. ročník — Lišejníky: symbióza, význam (select_one).
 *
 * Lišejník = soužití (symbióza) houby a řasy nebo sinice. Houba (vlákna) dává
 * vodu, minerální látky, oporu a ochranu před vyschnutím; řasa nebo sinice
 * vyrábí fotosyntézou organické živiny. Z toho plyne průkopnictví na holé skále
 * a použití lišejníků jako ukazatele čistoty ovzduší.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • lišejník je rostlina / mech;
 *  • fotosyntézu dělá houba (nebo lišejník „sám“);
 *  • symbióza zaměněná za cizopasení;
 *  • obrácená bioindikace („kde je lišejníků hodně, je špína“), záměna s plísní.
 *
 *  • L1 — zapamatování: banka faktických otázek („Který…/Co…/Jak se…“).
 *  • L2 — použití: co který partner dává, proč průkopník, proč přežije, k čemu je.
 *  • L3 — přenos: neznámý případ (dvě místa, pokus v představě, popis znaků,
 *         holá skála, pomalý růst) → rozhodnutí z příčiny.
 *
 * Rotace šablon/banky začíná na náhodném místě (lokální počítadlo v gen()), modul nemá stav.
 * Pořadí je zvolené tak, aby se v šesti po sobě jdoucích úlohách neopakovala šablona ani klíč.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, shuffle, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

/** Jedna položka banky: otázka, klíč, distraktory [možnost, proč je to chyba], dvě nápovědy, vysvětlení. */
interface Polozka {
  q: string;
  key: string;
  ds: [string, string][];
  h: [string, string];
  ex: string;
}

const uloha = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.key, shuffle(p.ds.map(([value, why]) => ({ value, why }))), { hints: [...p.h], explanation: p.ex });

const velke = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Opakované diagnózy chyb (stejná miskoncepce → stejné vysvětlení).
const FB_MECH = "Mech je rostlina se stonkem a drobnými lístky. Lišejník je soužití houby a řasy nebo sinice, rostlinou není.";
const FB_PLONIK = "Ploník je mech, tedy rostlina se stonkem a drobnými lístky. Lišejník to není.";
const FB_RASELINIK = "Rašeliník je mech, tedy rostlina se stonkem a drobnými lístky, která roste v mokrých rašeliništích. Lišejník to není.";
const FB_HOUBA_FOTO = "Houba nemá zelené barvivo a fotosyntézu neumí. Živiny vyrábí řasa nebo sinice.";
const FB_PARAZIT = "Při cizopasení má prospěch jen jeden. V lišejníku mají prospěch oba: houba dostává živiny a řasa vodu a ochranu.";
const FB_PLISEN = "Plíseň je houba bez zelených buněk, která rozkládá potraviny. Lišejník je soužití houby s řasou nebo sinicí.";
const FB_KORENY = "Lišejník nemá kořeny, stonek ani listy. Vodu mu zadržují houbová vlákna.";

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const BANKA_L1: Polozka[] = [
  {
    q: "Z jakých organismů se skládá lišejník?",
    key: "z houby a řasy nebo sinice",
    ds: [
      ["z mechu a řasy nebo sinice", FB_MECH],
      ["z houby a drobného mechu", "Mech v lišejníku není. Zelený partner houby je řasa nebo sinice, která dělá fotosyntézu."],
      ["jen z jedné zelené rostliny", "Lišejník není jeden organismus ani rostlina. Jsou to dva partneři, kteří žijí spolu."],
    ],
    h: [
      "Lišejník není jeden organismus, ale dva partneři. Jeden je z říše hub, jaký je ten druhý?",
      "Jeden partner tvoří vlákna a neumí fotosyntézu, druhý je zelený a živiny si vyrábí na světle. Hledej možnost, která jmenuje oba.",
    ],
    ex: "Lišejník je soužití dvou organismů: houby, která tvoří vlákna, a zeleného partnera, kterým je řasa nebo sinice.",
  },
  {
    q: "Který partner v lišejníku vyrábí živiny fotosyntézou?",
    key: "řasa nebo sinice",
    ds: [
      ["houba svými vlákny", FB_HOUBA_FOTO],
      ["houba i řasa společně", "Fotosyntézu umí jen zelený partner. Houba nemá zelené barvivo, proto živiny sama vyrobit nedokáže."],
      ["celý lišejník jako rostlina", "Lišejník není rostlina. Fotosyntézu v něm dělá jen jeden z partnerů, ten zelený."],
    ],
    h: [
      "Fotosyntéza potřebuje zelené barvivo. Který z partnerů lišejníku je zelený?",
      "Houby zelené barvivo nemají, proto si živiny vyrobit neumějí. V lišejníku je proto dodává ten druhý, zelený partner.",
    ],
    ex: "Fotosyntézu umí jen organismy se zeleným barvivem. V lišejníku je to řasa nebo sinice, houba ji dělat neumí.",
  },
  {
    q: "Jak se nazývá soužití, ze kterého mají prospěch oba partneři?",
    key: "symbióza",
    ds: [
      ["cizopasení", FB_PARAZIT],
      ["fotosyntéza", "Fotosyntéza je děj, při kterém zelený organismus vyrábí živiny z vody a oxidu uhličitého pomocí světla. Není to druh soužití."],
      ["rozklad", "Rozklad je rozpad odumřelých těl. S výhodným soužitím dvou živých partnerů nesouvisí."],
    ],
    h: [
      "Hledáš odborné slovo pro soužití, kde oba partneři něco dávají i dostávají.",
      "Pozor na soužití, kde jeden druhého jen využívá — to je opak. Tady mají oba z vazby užitek, jako houba a řasa v lišejníku.",
    ],
    ex: "Soužití, ze kterého mají prospěch oba partneři, se nazývá symbióza. Lišejník je její známý příklad.",
  },
  {
    q: "Kde běžně najdeme lišejníky?",
    key: "na kůře stromů a na kamenech",
    ds: [
      ["pod vodou v rybnících a tůních", "Ve vodě žijí samotné řasy. Lišejníky rostou na suchu a vodu jim zadrží houbová vlákna."],
      ["v úrodné půdě mezi kořeny", FB_KORENY],
      ["na plesnivém chlebu a ovoci", FB_PLISEN],
    ],
    h: [
      "Vzpomeň si na šedé a žluté povlaky, které jsi viděl na výletě. Na čem rostly?",
      "Lišejníky nepotřebují půdu ani vodu kolem sebe, stačí jim pevný podklad na světle. Najdeš je i na střechách a zdech.",
    ],
    ex: "Lišejníky rostou na pevném podkladu na světle: na kůře stromů, na kamenech, skalách, zdech i střechách.",
  },
  {
    q: "Který lišejník roste v lese na zemi a tvoří šedé keříčky?",
    key: "dutohlávka",
    ds: [
      ["provazovka", "Provazovka je také lišejník, ale visí z větví horských stromů jako šedé vousy. Na zemi keříčky netvoří."],
      ["ploník", FB_PLONIK],
      ["terčovník", "Terčovník tvoří žluté až oranžové skvrny na zdech a kůře, ne šedé keříčky na zemi."],
    ],
    h: [
      "Hledáš lišejník z lesní půdy. Vybav si, kterým lišejníkem se v zimě živí sobi na dalekém severu.",
      "Tento lišejník pokrývá velké plochy severské tundry a u nás roste hlavně v suchých borových lesích a na písčitých místech. Jeho šedé keříčky jsou za sucha křehké a snadno se lámou.",
    ],
    ex: "Na zemi v lese rostou šedé keříčky dutohlávky. Je to lišejník, na severu je hlavní zimní potravou sobů.",
  },
  {
    q: "Jak se říká organismům, které jako první osídlí holé místo, kde ještě nic neroste?",
    key: "průkopníci",
    ds: [
      ["cizopasníci", "Cizopasník žije na jiném živém organismu a škodí mu. Na holém místě nemá koho využívat."],
      ["rozkladači", "Rozkladači rozkládají odumřelá těla. Na úplně holém místě zatím nic odumřelého neleží."],
      ["škůdci", "Škůdci poškozují rostliny nebo zásoby. S osídlením holého místa to nesouvisí."],
    ],
    h: [
      "Hledáš slovo pro toho, kdo jde někam úplně první a připraví cestu ostatním.",
      "Lišejníky se uchytí na holé skále dřív než mechy a rostliny. Rozrušují kámen a po letech tam zanechají první tenkou vrstvu půdy, do které přijdou další organismy.",
    ],
    ex: "Organismy, které jako první osídlí holé místo, se nazývají průkopníci. Typickým průkopníkem na skále jsou lišejníky.",
  },
  {
    q: "Jak se nazývá lišejník, který tvoří žluté až oranžové skvrny na zdech a kůře?",
    key: "terčovník",
    ds: [
      ["dutohlávka", "Dutohlávka tvoří šedé keříčky na zemi v lese, ne žluté skvrny na zdech."],
      ["rez", "Rez je houba, která cizopasí na rostlinách. Není to lišejník a na zdech neroste."],
      ["plíseň", FB_PLISEN],
    ],
    h: [
      "Hledáš lišejník, který připomíná žlutou barvu rozlitou po zdi nebo kůře.",
      "Tvoří žluté ploché růžice, roste i na střechách a zídkách ve městě a patří k nejběžnějším lišejníkům u nás. Snese i méně čistý vzduch.",
    ],
    ex: "Žluté až oranžové skvrny na zdech, střechách a kůře tvoří terčovník zední, jeden z nejběžnějších lišejníků.",
  },
  {
    q: "Jak rychle lišejníky rostou?",
    key: "velmi pomalu, jen o milimetry za rok",
    ds: [
      ["velmi rychle, o centimetry za den", "Tak rychle se šíří plíseň. Lišejník roste velmi pomalu, přibývá mu jen trochu za celý rok."],
      ["přes noc, hlavně hned po dešti", "Přes noc po dešti vyrůstají plodnice hub. Lišejník roste mnohem pomaleji."],
      ["rychle na jaře, v létě pak odumírají", "Lišejníky nejsou jednoleté. Žijí mnoho let a rostou pomalu."],
    ],
    h: [
      "Lišejník na staré zdi vypadá rok co rok skoro stejně. Co to říká o jeho růstu?",
      "Zelený partner vyrobí jen málo živin a lišejník často vysychá, a tak přibývá jen málo. Velké lišejníky bývají staré desítky let.",
    ],
    ex: "Lišejníky rostou velmi pomalu, jen o milimetry za rok. Velký lišejník proto bývá starý mnoho let.",
  },
  {
    q: "Který lišejník se tradičně používá jako lék proti kašli?",
    key: "pukléřka islandská",
    ds: [
      ["terčovník zední", "Terčovník zední je běžný lišejník na zdech. Tradičním lékem proti kašli není, ten se dělá z jiného, horského lišejníku."],
      ["provazovka", "Provazovka visí z větví horských smrků. Tradičním lékem proti kašli není."],
      ["dutohlávka", "Dutohlávka je hlavně zimní potrava sobů. Tradiční lék proti kašli se dělá z jiného horského lišejníku."],
    ],
    h: [
      "Vybav si lišejník, který se sbírá v horách a na severu a suší se na čaj.",
      "Z tohoto lišejníku se odedávna vaří čaj nebo sirup, který se pije při kašli a nachlazení. Roste na zemi v horách, hlavně na holých hřebenech.",
    ],
    ex: "Pukléřka islandská je lišejník, ze kterého se připravují přípravky proti kašli. Lišejníky slouží i jako léčiva.",
  },
  {
    q: "Který lišejník visí jako šedé vousy z větví stromů v horách?",
    key: "provazovka",
    ds: [
      ["dutohlávka", "Dutohlávka roste na zemi jako šedé keříčky, z větví nevisí."],
      ["terčovník", "Terčovník tvoří žluté ploché skvrny, ne visící vousy."],
      ["rašeliník", FB_RASELINIK],
    ],
    h: [
      "Roste jen v čistém horském vzduchu a visí z větví. Mechy mezi možnostmi nehledej.",
      "Tento lišejník tvoří dlouhé šedozelené chomáče na smrcích v horách. Protože snese jen velmi čistý vzduch, u měst a továren ho skoro nenajdeš.",
    ],
    ex: "Z větví horských smrků visí provazovka. Roste jen v čistém vzduchu, proto je jí u měst málo.",
  },
  {
    q: "Z čeho se skládá tělo houby uvnitř lišejníku?",
    key: "z tenkých propletených vláken",
    ds: [
      ["z kořínků, stonku a lístků", "Kořínky, stonek a lístky mají rostliny. Houba je tvořena vlákny."],
      ["z jediné velké zelené buňky", "Zelené buňky patří řase. Houba zelená není a skládá se z vláken."],
      ["z tvrdých dřevnatých stonků", "Dřevnaté stonky mají stromy a keře. Houba tvoří měkká vlákna."],
    ],
    h: [
      "Vzpomeň si, co vidíš pod plodnicí houby, když ji opatrně vytáhneš z hrabanky.",
      "Tělo hub tvoří podhoubí, které vypadá jako jemná bílá síť. V lišejníku tahle síť obaluje zelené buňky řasy a drží v sobě vodu.",
    ],
    ex: "Tělo houby tvoří tenká propletená vlákna. V lišejníku tvoří síť, ve které jsou uložené buňky řasy nebo sinice.",
  },
  {
    q: "Který partner v lišejníku nemá zelené barvivo?",
    key: "houba",
    ds: [
      ["řasa", "Řasa zelené barvivo má, proto dělá fotosyntézu a vyrábí živiny pro oba."],
      ["sinice", "Sinice má barvivo pro fotosyntézu a stejně jako řasa vyrábí živiny."],
      ["žádný, oba jsou zelené", FB_HOUBA_FOTO],
    ],
    h: [
      "Který z partnerů si neumí vyrobit živiny ze světla?",
      "Organismus bez zeleného barviva fotosyntézu nedělá. Vzpomeň si, jakou barvu mají plodnice a podhoubí v lese.",
    ],
    ex: "Houby zelené barvivo nemají, proto si neumí vyrobit živiny. V lišejníku je dostávají od řasy nebo sinice.",
  },
  {
    q: "Co je lišejník?",
    key: "soužití houby a řasy nebo sinice",
    ds: [
      ["zvláštní druh mechu rostoucí na kůře", FB_MECH],
      ["nižší zelená rostlina s drobnými kořínky", FB_KORENY],
      ["plíseň rostoucí na kamenech", FB_PLISEN],
    ],
    h: [
      "Lišejník není jeden organismus. Kolik partnerů v něm žije?",
      "Pod mikroskopem uvidíš v lišejníku bezbarvá vlákna a mezi nimi zelené buňky. Každá z těch částí patří jinému organismu.",
    ],
    ex: "Lišejník je soužití (symbióza) houby a řasy nebo sinice. Není to rostlina ani mech.",
  },
  {
    q: "Jak se jmenuje děj, při kterém řasa v lišejníku vyrábí živiny?",
    key: "fotosyntéza",
    ds: [
      ["dýchání", "Dýcháním organismus živiny spotřebovává a získává z nich energii. Nevyrábí je."],
      ["kvašení", "Kvašení je rozklad cukru kvasinkami. Kvašením se živiny pomocí světla nevyrábějí."],
      ["rozklad", "Rozkladem se odumřelá těla rozpadají. Nové živiny se tak nevyrábějí."],
    ],
    h: [
      "Při tomto ději zelené buňky potřebují světlo, vodu a oxid uhličitý.",
      "Tento děj probíhá v zelených částech rostlin a řas. Vzniká při něm cukr a uvolňuje se kyslík.",
    ],
    ex: "Řasa vyrábí živiny fotosyntézou: ze světla, vody a oxidu uhličitého vzniká cukr a kyslík.",
  },
  {
    q: "Který organismus může v lišejníku žít místo řasy?",
    key: "sinice",
    ds: [
      ["mech", FB_MECH],
      ["plíseň", FB_PLISEN],
      ["kapradina", "Kapradina je velká rostlina s kořeny a listy. Do lišejníku se nevejde a partnerem houby není."],
    ],
    h: [
      "Hledáš drobný organismus, který stejně jako řasa umí fotosyntézu.",
      "Tento partner je velmi jednoduchý, nemá buněčné jádro a žije i ve vodě, kde se v létě přemnoží a zbarví ji do zelena.",
    ],
    ex: "Místo řasy může v lišejníku žít sinice. Umí fotosyntézu, a proto houbě dodá živiny stejně jako řasa.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const BANKA_L2: Polozka[] = [
  // (a) co zajišťuje houba
  {
    q: "Co v lišejníku zajišťuje houba?",
    key: "vodu s minerálními látkami a ochranu před vyschnutím",
    ds: [
      ["organické živiny, které vyrábí fotosyntézou na světle", FB_HOUBA_FOTO],
      ["zelené barvivo, kterým lišejník zachytí sluneční světlo", FB_HOUBA_FOTO],
      ["kořeny, kterými lišejník saje vodu hluboko z kamene", FB_KORENY],
    ],
    h: [
      "Houba neumí fotosyntézu. Co tedy může řase nabídnout výměnou za živiny?",
      "Houbová vlákna fungují jako houbička na nádobí: nasají a drží v sobě to, co přinese déšť a mlha, a obalují zelené buňky.",
    ],
    ex: "Houba svými vlákny nasaje a zadrží vodu s rozpuštěnými minerálními látkami a chrání řasu před vyschnutím. Živiny vyrábí řasa.",
  },
  {
    q: "Proč houba v lišejníku potřebuje svou síť vláken?",
    key: "zadržuje v ní vodu a chrání řasu před vyschnutím",
    ds: [
      ["vyrábí v ní cukry z vody, vzduchu a slunečního světla", FB_HOUBA_FOTO],
      ["vysává přes ni z řasy všechnu vodu a potom ji zničí", FB_PARAZIT],
      ["vrůstá s ní do skály stejně jako kořeny rostliny", FB_KORENY],
    ],
    h: [
      "Vlákna obalují zelené buňky řasy. K čemu je takový obal dobrý na suché skále?",
      "Síť vláken funguje jako houbička: po dešti se napije a pomalu vodu vydává. Zároveň tvoří pevný obal kolem řasy.",
    ],
    ex: "Síť houbových vláken zadrží vodu z deště a mlhy a obalí buňky řasy, takže řasa nevyschne.",
  },
  {
    q: "Čím houba v lišejníku pomáhá řase?",
    key: "dodává jí vodu a minerální látky a chrání ji",
    ds: [
      ["dodává jí cukry, které sama vyrobí na světle", FB_HOUBA_FOTO],
      ["dodává jí zelené barvivo potřebné k fotosyntéze", "Zelené barvivo má řasa sama. Houba ho nemá, a proto ho ani nemůže dodat."],
      ["nijak jí nepomáhá, jen z ní bere živiny a ničí ji", FB_PARAZIT],
    ],
    h: [
      "V symbióze dávají oba partneři. Řasa dává živiny. Co může dát houba, která neumí fotosyntézu?",
      "Samotná řasa by na skále rychle uschla a chyběly by jí látky rozpuštěné ve vodě. Houbová vlákna tohle obstarají.",
    ],
    ex: "Houba řase dodává vodu s minerálními látkami a svými vlákny ji chrání před vyschnutím. Obě strany mají užitek.",
  },
  // (b) co dává řasa
  {
    q: "Co dostává houba v lišejníku od řasy?",
    key: "organické živiny, hlavně cukry z fotosyntézy",
    ds: [
      ["vodu a minerální látky, které nachytá z deště", "Obráceně: vodu a minerální látky zadržuje houba. Řasa dodává živiny z fotosyntézy."],
      ["pevnou oporu a ochranu, aby na skále nevyschla", "Obráceně: oporu a ochranu dává houba řase. Řasa dodává živiny."],
      ["nic, řasa se na houbě jen přiživuje jako cizopasník", FB_PARAZIT],
    ],
    h: [
      "Řasa je zelená. Co umí vyrobit a houba ne?",
      "Houba si sama potravu vyrobit neumí, musí ji od někoho dostat. Zelený partner ji vyrábí na světle a část předává houbě.",
    ],
    ex: "Řasa vyrábí fotosyntézou organické živiny (cukry) a část z nich dostává houba, která si je sama vyrobit neumí.",
  },
  {
    q: "Proč houba v lišejníku nemůže žít bez řasy nebo sinice?",
    key: "sama si neumí vyrobit živiny fotosyntézou",
    ds: [
      ["sama si neumí nasát vodu z deště ani z mlhy", "Vodu umí zadržet právě houba svými vlákny. Chybělo by jí něco jiného."],
      ["potřebuje, aby jí řasa vytvořila kořeny", FB_KORENY],
      ["řasa ji chrání před vyschnutím a mrazem", "Obráceně: před vyschnutím chrání houba řasu, ne řasa houbu."],
    ],
    h: [
      "Houba nemá zelené barvivo. Co jí kvůli tomu chybí?",
      "Každý organismus potřebuje potravu. Rostliny a řasy si ji vyrábějí na světle, houby ji musí získat od jiných.",
    ],
    ex: "Houba nemá zelené barvivo, a tak si živiny nevyrobí. V lišejníku jí je dodává řasa nebo sinice.",
  },
  {
    q: "K čemu slouží zelené buňky uvnitř lišejníku?",
    key: "vyrábějí fotosyntézou živiny pro oba partnery",
    ds: [
      ["nasávají a zadržují vodu z deště pro celý lišejník", "Vodu zadržují bezbarvá houbová vlákna, ne zelené buňky."],
      ["tvoří pevný obal, který chrání lišejník před suchem", "Obal a ochranu tvoří houba. Zelené buňky jsou uvnitř a jsou chráněné."],
      ["jsou to lístky mechu, který v lišejníku roste", FB_MECH],
    ],
    h: [
      "Zelené buňky patří řase nebo sinici. K čemu slouží zelené barvivo?",
      "Zelené barvivo zachycuje světlo. S jeho pomocí vzniká z vody a oxidu uhličitého cukr, ze kterého žije celý lišejník.",
    ],
    ex: "Zelené buňky jsou řasa nebo sinice. Fotosyntézou vyrábějí živiny, ze kterých žije ona i houba.",
  },
  // (c) průkopník
  {
    q: "Proč se lišejníkům říká průkopníci?",
    key: "osídlí holou skálu jako první a začnou tvořit půdu",
    ds: [
      ["rostou jen tam, kde už leží silná vrstva úrodné půdy", FB_KORENY],
      ["jako první ze všech organismů vůbec vznikly na Zemi", "Průkopník tu neznamená nejstarší organismus. Jde o to, kdo první osídlí holé místo."],
      ["rychle zarostou pole a vytlačí z něj ostatní rostliny", "Lišejníky rostou velmi pomalu a na polích nepřevládnou. Průkopníci jsou na holých místech."],
    ],
    h: [
      "Průkopník jde první tam, kde ještě nikdo není. Kam se lišejník dostane dřív než ostatní?",
      "Lišejník nepotřebuje půdu, a tak přežije i na holém kameni. Po letech po něm na kameni zůstane vrstva, do které se uchytí další organismy.",
    ],
    ex: "Lišejníky osídlí holou skálu jako první. Rozrušují kámen a z jejich zbytků vzniká první půda, do které se pak uchytí mechy a rostliny.",
  },
  {
    q: "Proč mohou lišejníky růst i na holém kameni, kde není půda?",
    key: "nepotřebují kořeny, vodu drží houba a živiny vyrábí řasa",
    ds: [
      ["mají dlouhé tenké kořeny, kterými prorostou hluboko do kamene", FB_KORENY],
      ["živí se samotným kamenem, podobně jako plíseň chlebem", FB_PLISEN],
      ["vodu i všechny živiny si vyrobí z kamene úplně samy", "Z kamene se voda ani živiny vyrobit nedají. Vodu zachytí z deště houba a živiny vyrobí zelený partner."],
    ],
    h: [
      "Co rostliny berou z půdy? A kdo to v lišejníku obstará jinak?",
      "Rostlina bere z půdy vodu. Lišejník ji zachytí z deště a mlhy do vláken jednoho partnera a potravu si vyrobí druhý partner na světle.",
    ],
    ex: "Lišejník půdu nepotřebuje: vodu z deště zadrží houbová vlákna a živiny vyrobí řasa fotosyntézou. Stačí mu tedy kámen, světlo a vzduch.",
  },
  {
    q: "Jak lišejníky pomáhají vzniku půdy na holé skále?",
    key: "rozrušují povrch kamene a z jejich zbytků vzniká půda",
    ds: [
      ["rozlámou skálu svými silnými kořeny na drobné kamínky", FB_KORENY],
      ["přinášejí na skálu půdu z lesa ve svých výtrusech", "Výtrusy půdu nepřenášejí. Půda vzniká přímo na skále z rozrušeného kamene a odumřelých lišejníků."],
      ["vyrábějí půdu fotosyntézou přímo ze vzduchu a vody", "Fotosyntézou vzniká cukr, ne půda. Půda vzniká z kamene a odumřelých těl."],
    ],
    h: [
      "Půda obsahuje drobné kousky horniny a zbytky odumřelých organismů. Odkud se to na skále vezme?",
      "Lišejníky vylučují látky, které pomalu narušují kámen. Když části lišejníku odumřou, zůstanou na skále a smíchají se s rozdrobeným kamenem.",
    ],
    ex: "Lišejníky rozrušují povrch kamene a jejich odumřelé zbytky se mísí s drobty horniny. Tak vzniká první tenká vrstva půdy.",
  },
  // (d) proč přežije
  {
    q: "Proč lišejník přežije na suché skále, kde by samotná řasa uschla?",
    key: "houbová vlákna drží vodu a chrání řasu před vyschnutím",
    ds: [
      ["řasa v lišejníku si umí vyrobit vodu fotosyntézou", "Fotosyntéza vodu spotřebovává, nevyrábí. Vodu lišejníku zadržuje houba."],
      ["lišejník má dlouhé kořeny, které sahají až k vodě", FB_KORENY],
      ["řasa v lišejníku přestane dýchat a vodu nepotřebuje", "Každý živý organismus vodu potřebuje. Řasa ji v lišejníku dostane od houby."],
    ],
    h: [
      "Co má lišejník navíc oproti samotné řase?",
      "Samotná řasa potřebuje vlhko, na slunci rychle vyschne. V lišejníku je obalená sítí, která po dešti nasaje vodu a dlouho ji drží.",
    ],
    ex: "Řasu v lišejníku obalují houbová vlákna. Zadržují vodu a chrání řasu před vyschnutím, proto lišejník přežije i na suché skále.",
  },
  {
    q: "Proč samotná houba z lišejníku na holé skále nepřežije?",
    key: "chyběly by jí živiny, které vyrábí řasa nebo sinice",
    ds: [
      ["chyběla by jí voda, kterou dodává řasa nebo sinice", "Obráceně: vodu zadržuje houba. Řasa nebo sinice dodává něco jiného."],
      ["chyběly by jí kořeny, kterými saje živiny z kamene", FB_KORENY],
      ["chyběla by jí zelená barva, kterou si vyrábí sama", FB_HOUBA_FOTO],
    ],
    h: [
      "Houba neumí fotosyntézu. Kdo jí v lišejníku dodává to, co si sama nevyrobí?",
      "Na holé skále nejsou žádné zbytky rostlin ani živočichů, ze kterých by houba mohla žít. Potravu jí tedy musí dát zelený partner.",
    ],
    ex: "Houba si živiny nevyrobí a na holé skále nemá z čeho žít. V lišejníku jí je dodává řasa nebo sinice, bez nich by zahynula.",
  },
  {
    q: "Proč lišejníky vydrží dlouhé sucho i mráz?",
    key: "houbový obal chrání řasu a po dešti lišejník zase ožije",
    ds: [
      ["mají hluboké kořeny, ve kterých si drží zásobu vody", FB_KORENY],
      ["řasa si v suchu vyrobí vodu fotosyntézou ze vzduchu", "Fotosyntéza vodu nevyrábí, ale spotřebovává. Před suchem chrání řasu houba."],
      ["v suchu i mrazu odumřou a pak vyrostou znovu ze semen", "Lišejníky nemají semena, semena mají jen semenné rostliny. Lišejník sucho přečká živý."],
    ],
    h: [
      "Který partner tvoří kolem zelených buněk ochranu?",
      "Lišejník umí v suchu vyschnout a přestat růst, aniž by zahynul. Zelené buňky přitom leží schované uvnitř sítě vláken.",
    ],
    ex: "Houbová vlákna tvoří obal, který chrání řasu. Lišejník v suchu a mrazu jen vyschne a přestane růst, po dešti se znovu probudí.",
  },
  // (e) využití
  {
    q: "K čemu lidé využívají lišejníky?",
    key: "jako ukazatele čistoty ovzduší",
    ds: [
      ["jako krmivo pro domácí dobytek u nás", "U nás se dobytek lišejníky nekrmí, rostou na to příliš pomalu. Lišejníky spásají hlavně sobi na dalekém severu."],
      ["jako jedlé houby do polévky", "Lišejník není houba s plodnicí na jídlo. Je to soužití houby a řasy."],
      ["jako hnojivo, které zúrodní pole", "Lišejníky rostou velmi pomalu, jako hnojivo se nepoužívají. Pomáhají jinak."],
    ],
    h: [
      "Lišejníky jsou citlivé na to, co je ve vzduchu. Jak toho mohou lidé využít?",
      "Tam, kde lišejníky mizí, je něco špatně. Vědci proto sledují, kolik jich roste na stromech v různých místech. Lidé z nich dělají i barviva a léčiva.",
    ],
    ex: "Lišejníky ve znečištěném vzduchu hynou, proto podle nich poznáme, jak čisté je ovzduší. Slouží i jako potrava sobů, barviva a léčiva.",
  },
  {
    q: "Proč lišejníky slouží jako ukazatel čistoty vzduchu?",
    key: "jsou citlivé na znečištěné ovzduší a hynou v něm",
    ds: [
      ["nejlépe rostou ve znečištěném vzduchu u továren", "Obráceně: u továren lišejníků ubývá. Hodně jich roste tam, kde je vzduch čistý."],
      ["vysávají ze vzduchu škodliviny, a tím ho čistí", "Škodliviny lišejníky sice přijímají, ale vzduch tím nevyčistí. Právě proto, že je nasávají, jim škodí a ve špinavém vzduchu mizí."],
      ["ve špinavém vzduchu změní barvu z šedé na černou", "Změna barvy na černou není ukazatel znečištění. Ve špinavém vzduchu lišejníky chřadnou, blednou a nakonec z kmenů mizí."],
    ],
    h: [
      "Co se stane s lišejníkem, když dýchá špinavý vzduch?",
      "Lišejník nemá na povrchu voskovou vrstvu jako listy rostlin a vodu i látky ze vzduchu přijímá celým povrchem. Škodliviny se v něm proto hromadí a poškodí zelené buňky.",
    ],
    ex: "Lišejníky přijímají vodu a látky ze vzduchu celým povrchem, proto jim škodliviny rychle ublíží. Kde jich je hodně, je vzduch čistý.",
  },
  // (f) další použití: pastva, šíření, stavba
  {
    q: "Pastevci na severu převádějí stáda sobů na nové pastviny s dutohlávkou a na spasená místa se vracejí až po mnoha letech. Proč?",
    key: "spasená dutohlávka dorůstá jen velmi pomalu",
    ds: [
      ["spasená dutohlávka doroste do příští zimy", "Za rok dutohlávce přibudou jen milimetry. Obnova spasené pastviny trvá mnoho let."],
      ["dutohlávka po spasení vyroste znovu jen ze semen", "Lišejníky semena nemají. Dorůstají ze zbylých kousků, jen to trvá dlouho."],
      ["spasená místa hned zaroste plíseň a dutohlávku vytlačí", FB_PLISEN],
    ],
    h: [
      "Vzpomeň si, jak rychle rostou lišejníky. Kolik dutohlávky přibude za jeden rok?",
      "Sobi spasou keříčky skoro až k zemi. Zbylé kousky rostou dál, ale přibývají jen o milimetry za rok, takže hustý porost je tu zase až po letech.",
    ],
    ex: "Dutohlávka roste jen o milimetry za rok. Spasená pastvina se proto obnovuje mnoho let a pastevci mezitím vodí soby jinam.",
  },
  {
    q: "Proč nový lišejník nejsnáze vyroste z odlomeného kousku starého lišejníku?",
    key: "v úlomku je houba i řasa najednou",
    ds: [
      ["v úlomku jsou drobné kořínky, které se hned uchytí", FB_KORENY],
      ["v úlomku jsou semena, ze kterých lišejník vyklíčí", "Lišejníky semena nemají, ta mají jen semenné rostliny. Úlomek je výhodný z jiného důvodu."],
      ["v úlomku je jen houba, která si řasu vyrobí sama", "Houba si řasu vyrobit nedokáže. Nový lišejník potřebuje oba partnery."],
    ],
    h: [
      "Lišejník tvoří dva partneři. Co musí mít nový lišejník hned od začátku, aby mohl žít?",
      "Kdyby na nové místo dopadl jen jeden z partnerů, musel by čekat, až tam náhodou najde toho druhého. Odlomený kousek tenhle problém řeší, protože nese celé soužití.",
    ],
    ex: "Odlomený kousek lišejníku obsahuje houbová vlákna i buňky řasy. Nový lišejník tak má oba partnery hned a nemusí je hledat.",
  },
  {
    q: "Proč v lišejníku leží zelené buňky řasy uvnitř a povrch tvoří houba?",
    key: "houba na povrchu chrání řasu před suchem a prudkým sluncem",
    ds: [
      ["řasa uvnitř světlo vůbec nepotřebuje, a proto se tam schovává","Řasa světlo potřebuje k výrobě živin. Tenká houbová vrstva ho k ní propustí dost."],
      ["houba na povrchu zachytí světlo a vyrobí z něj živiny", FB_HOUBA_FOTO],
      ["houba řasu uvnitř uvěznila a jen se jí živí", FB_PARAZIT],
    ],
    h: [
      "Který partner snáší sucho hůř? A kde je v lišejníku bezpečněji?",
      "Samotná řasa na slunci a větru rychle vysychá. Vlákna na povrchu drží vodu a tvoří kolem zelených buněk vrstvu, která je stíní, ale světlo k nim ještě propustí.",
    ],
    ex: "Povrch lišejníku tvoří hustá houbová vlákna. Chrání řasu uvnitř před vyschnutím a prudkým sluncem, přitom k ní propustí dost světla na fotosyntézu.",
  },
];

/** Pořadí rotace L2: typy úloh se střídají, aby v jedné sadě nebyly jen otázky „kdo komu co dává“. */
const PORADI_L2 = [0, 6, 15, 3, 12, 9, 1, 16, 7, 4, 14, 10, 2, 13, 8, 5, 11];

// ── L3 — analýza a přenos ───────────────────────────────────────────────────
const JMENA = [
  { jm: "Tereza", a: "a" },
  { jm: "Ondřej", a: "" },
  { jm: "Klára", a: "a" },
  { jm: "Matěj", a: "" },
  { jm: "Eliška", a: "a" },
  { jm: "Jakub", a: "" },
];

/** Dvojice míst: málo lišejníků (znečištěné) × hodně lišejníků (čisté). Předložka je součást tvaru. */
const MISTA: [string, string][] = [
  ["ve městě", "ve vesnici"],
  ["u továrny", "v lese"],
  ["u dálnice", "v lázních"],
  ["u elektrárny", "na horách"],
  ["u křižovatky", "v lesoparku"],
];

function l3Bioindikace(): PracticeTask | null {
  const [malo, hodne] = pick(MISTA);
  const o = pick(JMENA);
  const q = Math.random() < 0.5
    ? `${o.jm} porovnal${o.a} kmeny stromů na dvou místech. ${velke(malo)} na nich skoro nebyly lišejníky, ${hodne} jich rostlo hodně. Co z toho nejspíš vyplývá?`
    : `Vědci zjistili, že ${malo} na kmenech stromů skoro nerostou lišejníky, zatímco ${hodne} jich je hodně. Co z toho nejspíš vyplývá?`;
  return choice(
    q,
    `vzduch ${malo} je znečištěnější`,
    [
      { value: `vzduch ${hodne} je znečištěnější`, why: "Obrácená úvaha. Lišejníky jsou citlivé na znečištěné ovzduší, takže kde jich roste hodně, je vzduch čistší." },
      { value: `vzduch ${malo} je čistší, protože ho lišejníky nezanášejí`, why: "Lišejníky vzduch nezanášejí ani nečistí. Kde jich roste málo, škodí jim znečištěný vzduch." },
      { value: `vzduch na obou místech je stejně čistý`, why: "Lišejníky na znečištění reagují. Když se místa v počtu lišejníků liší, liší se i vzduch." },
    ],
    {
      hints: [
        `Lišejníky snášejí jen čistý vzduch. Na kterém místě jich roste málo: ${malo}, nebo ${hodne}?`,
        `Škodliviny ze vzduchu lišejníky poškozují, proto tam, kde je jich málo, jim něco škodí. Porovnej obě místa (${hodne} a ${malo}) a zvaž, kde je víc aut, kouře nebo výroby.`,
      ],
      explanation: `Lišejníky jsou citlivé na znečištěné ovzduší a slouží jako jeho ukazatel. ${velke(malo)} jich roste málo, takže tam je vzduch znečištěnější než ${hodne}.`,
    },
  );
}

function l3PokusHouba(): PracticeTask | null {
  const partner = pick(["řasy", "sinice"]);
  return choice(
    `Vědci v pokusu odstranili z lišejníku na kameni všechny buňky ${partner} a houbu nechali na kameni. Co se s ní nejspíš stane?`,
    "zahyne, protože nebude mít zdroj živin",
    [
      { value: "poroste dál, protože si živiny vyrobí sama", why: FB_HOUBA_FOTO },
      { value: "zahyne, protože nebude mít žádnou vodu", why: "Vodu zadržuje právě houba. Po odstranění zeleného partnera jí chybí něco jiného." },
      { value: "zezelená a začne sama dělat fotosyntézu", why: FB_HOUBA_FOTO },
    ],
    {
      hints: [
        `Co dávaly buňky ${partner} houbě? A umí si to houba obstarat sama?`,
        "Houba nemá zelené barvivo. Na holém kameni nejsou ani zbytky rostlin, ze kterých by mohla žít. Rozmysli, co jí po pokusu chybí a jestli to dokáže nahradit.",
      ],
      explanation: `Houba si neumí vyrobit organické živiny, v lišejníku je dostávala od ${partner}. Na kameni nemá z čeho jinde žít, a tak bez zeleného partnera zahyne.`,
    },
  );
}

function l3PokusRasa(): PracticeTask | null {
  const kde = pick(["na suchém kameni", "na slunné skále"]);
  return choice(
    `Vědci oddělili řasu z lišejníku (tahle řasa volně na suchu nežije) a nechali ji růst samotnou ${kde}. Co se s ní nejspíš stane?`,
    "uschne, protože ji nechrání houbová vlákna",
    [
      { value: "poroste líp, protože ji houba už nevysává", why: FB_PARAZIT },
      { value: "uschne, protože nemá od houby živiny", why: "Živiny si řasa vyrábí sama fotosyntézou. Od houby dostávala něco jiného." },
      { value: "vytvoří si kořeny a vodu najde sama", why: FB_KORENY },
    ],
    {
      hints: [
        `Co řasa dostávala od houby? Najde to sama ${kde}?`,
        "Řasa umí fotosyntézu, takže potravu má. Tahle řasa ale potřebuje vlhko, které jí v lišejníku zajišťoval partner.",
      ],
      explanation: `Řasa si živiny vyrobí sama, ale ${kde} rychle vyschne. Tahle řasa bez houby sucho nesnese, v lišejníku ji chránila houbová vlákna, která zadržovala vodu.`,
    },
  );
}

function l3PokusTma(): PracticeTask | null {
  const o = pick(JMENA);
  return choice(
    `Na výletě si ${o.jm} odnesl${o.a} kámen s lišejníkem domů a zavřel${o.a} ho do tmavé skříně. Co se s lišejníkem nejspíš stane?`,
    "uhyne, protože řasa bez světla nevyrobí živiny",
    [
      { value: "poroste dál, protože houba živiny vyrobí i ve tmě", why: FB_HOUBA_FOTO },
      { value: "uhyne, protože ve skříni chybí kořenům půda", why: FB_KORENY },
      { value: "poroste rychleji, protože ho tma chrání před sluncem", why: "Lišejník slunce nevadí. Bez světla naopak zelený partner nemůže vyrábět potravu." },
    ],
    {
      hints: [
        "Co potřebuje zelený partner k výrobě živin? Je to ve skříni?",
        "Fotosyntéza probíhá jen za světla. Rozmysli, kdo v lišejníku živiny vyrábí a co se stane s oběma partnery, když výroba přestane.",
      ],
      explanation: "Řasa nebo sinice vyrábí živiny fotosyntézou, a ta potřebuje světlo. Ve tmě výroba přestane, houba ani řasa nemají potravu a lišejník časem uhyne.",
    },
  );
}

/** Rozpoznání + druhý krok: z popisu urči lišejník a odvoď, co potřebuje k životu. */
function l3RozpoznaniPotreby(): PracticeTask | null {
  const o = pick(JMENA);
  return choice(
    `Na výletě ${o.a ? "našla" : "našel"} ${o.jm} na skále šedozelený povlak. Nemá kořeny ani lístky a pod mikroskopem je složený z bezbarvých vláken a zelených buněk. Co tento organismus potřebuje, aby na holé skále přežil?`,
    "světlo a občas déšť nebo mlhu",
    [
      { value: "půdu, do které zapustí kořeny", why: FB_KORENY },
      { value: "tlející zbytky rostlin, ze kterých bere potravu", why: "Tak se živí samotná houba nebo plíseň. Tady jsou i zelené buňky, které si potravu vyrobí samy." },
      { value: "stálou vodu, ve které bude ponořený", why: "Ve vodě žijí samotné řasy. Tady jsou i houbová vlákna, která zadrží vodu z deště, takže stačí občasná vláha." },
    ],
    {
      hints: [
        "Nejdřív urči, co je to za organismus. Komu patří bezbarvá vlákna a komu zelené buňky?",
        "Rozmysli, co potřebuje každá z obou částí: zelené buňky k výrobě potravy a vlákna k tomu, aby měla co zadržet. Půdu ani kořeny tento organismus nemá.",
      ],
      explanation: "Vlákna houby a zelené buňky řasy tvoří lišejník. Řasa potřebuje světlo k výrobě živin a houba zadrží vodu z deště nebo mlhy. Půdu lišejník nepotřebuje.",
    },
  );
}

/** Přenos: barva povrchu neprozrazuje, jestli uvnitř probíhá fotosyntéza. */
function l3RozpoznaniBarva(): PracticeTask | null {
  const o = pick(JMENA);
  const kde = pick(["na staré zdi", "na plechové střeše", "na kůře topolu u cesty"]);
  return choice(
    `Na výletě uviděl${o.a} ${o.jm} ${kde} žlutooranžové ploché skvrny. Pod mikroskopem jsou z bezbarvých vláken a mezi nimi leží zelené buňky. Spolužák tvrdí, že skvrny nemohou dělat fotosyntézu, protože nejsou zelené. Má pravdu?`,
    "nemá, zelené buňky uvnitř fotosyntézu dělají",
    [
      { value: "má, fotosyntézu dělají jen organismy zelené na povrchu", why: "Barva povrchu nerozhoduje. Na povrchu je zbarvená houba a pod ní leží zelené buňky řasy, které fotosyntézu dělají." },
      { value: "nemá, fotosyntézu tu dělají bezbarvá vlákna", why: FB_HOUBA_FOTO },
      { value: "má, skvrny berou všechnu potravu z podkladu", why: "Lišejník z podkladu potravu nebere, podklad mu slouží jen jako opora. Živiny vyrábí řasa." },
    ],
    {
      hints: [
        "Barva povrchu nemusí prozradit, co je uvnitř. Kde v povlaku leží zelené buňky a k čemu slouží?",
        "Bezbarvá vlákna patří houbě a ta tvoří povrch, který může být zbarvený. Zelené buňky patří druhému partnerovi. Rozhodni, kterému z nich fotosyntéza patří.",
      ],
      explanation: "Skvrny jsou lišejník (terčovník). Žlutooranžovou barvu má houba na povrchu, pod ní leží zelené buňky řasy, které fotosyntézu dělají. Spolužák proto pravdu nemá.",
    },
  );
}

/** Rozpoznání + druhý krok: který ze dvou vzorků přežije na holé skále. */
function l3RozpoznaniVzorky(): PracticeTask | null {
  const o = pick(JMENA);
  return choice(
    `${o.jm} porovnal${o.a} pod mikroskopem dva vzorky z kůry stromu. Vzorek A tvoří jen bílá vlákna bez zelené barvy, vzorek B vlákna propletená se zelenými buňkami. Který vzorek by dokázal žít i na holé slunné skále?`,
    "B, protože jeho zelené buňky vyrábějí živiny",
    [
      { value: "A, protože jeho vlákna vyrábějí živiny", why: FB_HOUBA_FOTO },
      { value: "oba, protože oba mají vlákna, která drží vodu", why: "Vlákna vodu zadrží, ale potravu nevyrobí. Vzorek A by na skále neměl z čeho žít." },
      { value: "žádný, protože na skále chybí půda", why: "Vzorek B půdu nepotřebuje: vodu zadrží vlákna a živiny vyrobí zelené buňky." },
    ],
    {
      hints: [
        "Nejdřív urči, co je vzorek A a co vzorek B. Komu patří vlákna a komu zelené buňky?",
        "Na holé skále nejsou zbytky rostlin ani živočichů, ze kterých by se dalo žít. Přežije jen ten, kdo si potravu dokáže vyrobit a zároveň udrží vodu.",
      ],
      explanation: "Vzorek A je samotná houba, vzorek B lišejník. Na holé skále přežije jen B: houbová vlákna zadrží vodu a zelené buňky řasy vyrobí živiny. Samotná houba by neměla potravu.",
    },
  );
}

function l3RozpoznaniSliz(): PracticeTask | null {
  const o = pick(JMENA);
  const FB: Record<string, string> = {
    lišejník: "Lišejník by pod mikroskopem ukázal i bezbarvá vlákna houby, tady jsou jen zelené buňky.",
    mech: "Mech má stonek a drobné lístky. Tady je jen sliz ze zelených buněk.",
    plíseň: "Plíseň je houba bez zelených buněk a roste hlavně na potravinách.",
  };
  return choice(
    `Na výletě ${o.a ? "našla" : "našel"} ${o.jm} v tůni zelený sliz. Pod mikroskopem je složený jen z drobných zelených buněk, bez vláken houby. Co to nejspíš je?`,
    "řasa",
    Object.entries(FB).map(([value, why]) => ({ value, why })),
    {
      hints: [
        "Vzorek má zelené buňky, ale chybí mu vlákna. Který organismus je jen ze zelených buněk?",
        "Soužití s houbou by vlákna mělo. Rostlina by měla lístky a plíseň by nebyla zelená. Zbývá organismus, který žije hlavně ve vodě.",
      ],
      explanation: "Jen zelené buňky bez houbových vláken a výskyt ve vodě ukazují na řasu. Lišejník by měl i vlákna houby.",
    },
  );
}

function l3PrukopnikSkala(): PracticeTask | null {
  const misto = pick(["po sesuvu svahu", "v opuštěném lomu", "po ústupu ledovce"]);
  return choice(
    `Vědci sledovali novou holou skálu ${misto}, kde zatím nic neroste. Které organismy se na ní nejspíš uchytí jako první?`,
    "lišejníky",
    [
      { value: "mechy", why: "Mechy potřebují aspoň trochu půdy a vlhka. Přicházejí až po lišejnících." },
      { value: "kapradiny", why: "Kapradiny mají kořeny a potřebují půdu. Na holou skálu přicházejí až později." },
      { value: "stromy", why: "Stromy potřebují hlubokou půdu. Na holé skále se uchytí až po mnoha letech." },
    ],
    {
      hints: [
        "Na holé skále není půda ani stín. Který organismus nepotřebuje kořeny ani půdu?",
        "Hledej soužití, ve kterém jeden partner zadrží vodu z deště a druhý si vyrobí potravu na světle. Takový organismus vydrží i na holém kameni.",
      ],
      explanation: "Jako první osídlí holou skálu lišejníky, protože nepotřebují půdu. Z jejich zbytků a rozrušeného kamene vznikne půda pro mechy a později rostliny.",
    },
  );
}

function l3PrukopnikLava(): PracticeTask | null {
  return choice(
    "Vědci zjistili, že na ztuhlé lávě se jako první objevily šedé povlaky bez kořenů, složené z vláken a zelených buněk. Proč právě ony?",
    "houba drží vodu a řasa vyrábí živiny pomocí světla",
    [
      { value: "mají kořeny, které prorazí i tvrdou lávu", why: FB_KORENY },
      { value: "živí se teplem, které láva ještě vydává", why: "Teplo není potrava. Živiny musí vyrobit zelený partner fotosyntézou." },
      { value: "rozkládají popel stejně jako plíseň chléb", why: FB_PLISEN },
    ],
    {
      hints: [
        "Povlak tvoří dva partneři. Co dělá každý z nich, když chybí půda?",
        "Na lávě není půda. Rozmysli, co by rostlina brala z půdy a který partner v povlaku to zajistí jinak.",
      ],
      explanation: "Povlaky jsou lišejníky. Houbová vlákna zadrží vodu a řasa vyrobí živiny fotosyntézou, takže na lávě nepotřebují půdu.",
    },
  );
}

function l3PrukopnikMech(): PracticeTask | null {
  const o = pick(JMENA);
  return choice(
    `${o.jm} porovnal${o.a} dvě skály: jednu pokrývají lišejníky, druhá je úplně holá. Na které se dřív uchytí mech?`,
    "na té s lišejníky, protože pod nimi vzniká půda",
    [
      { value: "na té holé, protože mech nesnese stín lišejníků", why: "Lišejníky jsou nízké a stín mechu nedělají. Mech naopak potřebuje půdu, kterou lišejníky připraví." },
      { value: "na obou stejně, protože mech půdu nepotřebuje", why: "Mech potřebuje aspoň tenkou vrstvu půdy a vlhko. Na holé skále ji nenajde." },
      { value: "na té holé, protože lišejníky mech otráví", why: "Lišejníky mech neničí, naopak mu připravují podmínky. Proto jsou průkopníci." },
    ],
    {
      hints: [
        "Co potřebuje mech, aby se uchytil? Kde to na skále najde?",
        "Lišejníky pomalu rozrušují kámen a jejich zbytky na něm zůstávají. Na které skále tak po letech vznikne vrstva, do které se mech zachytí?",
      ],
      explanation: "Lišejníky jsou průkopníci: rozrušují kámen a z jejich zbytků vzniká tenká vrstva půdy. Do ní se pak uchytí mech.",
    },
  );
}

function l3RustStari(): PracticeTask | null {
  const o = pick(JMENA);
  const cm = pick([3, 4, 5, 6, 8]);
  const kde = pick(["na staré zdi hradu", "na kamenném mostě", "na starém náhrobku"]);
  return choice(
    `Na výletě si ${o.jm} všiml${o.a} lišejníku ${kde}, který měřil jen asi ${cm} cm. Co se dá říct o jeho stáří?`,
    "může být starý mnoho let, protože roste velmi pomalu",
    [
      { value: "je starý jen pár dní, protože roste rychle jako plíseň", why: FB_PLISEN },
      { value: "je starý asi týden, protože roste jako houby po dešti", why: "Po dešti rychle vyrůstají plodnice hub. Lišejník roste mnohem pomaleji." },
      { value: "stáří nejde odhadnout, protože lišejník vůbec neroste", why: "Lišejník roste, jen velmi pomalu. Podle velikosti lze stáří aspoň odhadnout." },
    ],
    {
      hints: [
        `Lišejník měří asi ${cm} cm. Kolik mu přibude za jeden rok?`,
        "Zelený partner vyrobí málo živin a lišejník často vysychá, a tak přibývá jen o kousek za rok. Porovnej to s tím, jak rychle se šíří plíseň.",
      ],
      explanation: `Lišejníky rostou jen o milimetry za rok. I lišejník velký asi ${cm} cm proto může být starý mnoho let.`,
    },
  );
}

function l3RustPresadit(): PracticeTask | null {
  const o = pick(JMENA);
  const kde = pick(["z kamene u lesní cesty", "ze skály v přírodní rezervaci", "z kůry starého buku"]);
  return choice(
    `${o.jm} chtěl${o.a} odloupnout lišejník ${kde} a přesadit ho na zahradu. Proč je lepší ho nechat na místě?`,
    "poškozený lišejník dorůstá mnoho let, protože roste pomalu",
    [
      { value: "je jedovatý a na zahradě by otrávil ostatní rostliny", why: "Lišejníky rostliny neotráví. Důvod ochrany je jejich velmi pomalý růst." },
      { value: "na zahradě by mu chyběla hluboká půda pro kořeny", why: FB_KORENY },
      { value: "na zahradě by rychle přerostl a vytlačil trávu", why: "Lišejníky rostou jen o milimetry za rok, trávu nevytlačí. Důvodem je právě jejich velmi malý přírůstek." },
    ],
    {
      hints: [
        "Jak rychle lišejník roste? Co to znamená, když ho poškodíš?",
        "Lišejník nemá kořeny, takže přesazení mu nepomůže. Rozmysli, jak dlouho by trvalo, než by na kameni znovu narostl do stejné velikosti.",
      ],
      explanation: "Lišejníky rostou jen o milimetry za rok. Poškozený lišejník by dorůstal mnoho let, proto ho necháváme na místě.",
    },
  );
}

/** Každá položka = jiná šablona; sousední šablony jsou z různých okruhů, takže se v sadě šest úloh neopakují. */
const SABLONY_L3 = [
  l3Bioindikace, l3PokusHouba, l3RozpoznaniPotreby, l3PrukopnikSkala, l3RustStari,
  l3RozpoznaniBarva, l3PokusRasa, l3PrukopnikLava, l3RozpoznaniVzorky, l3RustPresadit,
  l3PokusTma, l3RozpoznaniSliz, l3PrukopnikMech,
];

/** Rotace s náhodným začátkem: sada (prvních šest úloh) se mezi sezeními liší, ale v jedné sadě se šablona neopakuje. */
function rotace<T>(seznam: T[]): () => T {
  let i = Math.floor(Math.random() * seznam.length);
  return () => seznam[i++ % seznam.length];
}

function gen(level: number): PracticeTask[] {
  if (level === 3) {
    const dalsi = rotace(SABLONY_L3);
    return ruzneUlohy(() => losUlohy(() => dalsi()()));
  }
  const dalsi = level === 1 ? rotace(BANKA_L1) : rotace(PORADI_L2.map((k) => BANKA_L2[k]));
  return ruzneUlohy(() => losUlohy(() => uloha(dalsi())));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const LISEJNIKY_SYMBIOZA: TopicMetadata[] = [
  {
    id: "g6-pri-lisejniky-symbioza-6",
    rvpNodeId: "g6-prirodopis-biologie-hub-houby-a-lisejniky-lisejniky-symbioza-vyznam",
    displayName: "Lišejníky – houba a řasa spolu",
    title: "Lišejníky - symbióza, význam",
    studentTitle: "Lišejníky – houba a řasa spolu",
    subject: "prirodopis",
    category: "Biologie hub",
    topic: "Houby a lišejníky",
    briefDescription: "Jak spolu žije houba a řasa a co nám lišejníky prozradí o vzduchu.",
    keywords: [
      "lišejník", "lišejníky", "symbióza", "soužití", "houba", "řasa", "sinice",
      "fotosyntéza", "průkopník", "bioindikátor", "čistota ovzduší", "dutohlávka", "terčovník",
    ],
    goals: [
      "Vysvětlit lišejník jako soužití houby a řasy nebo sinice.",
      "Přiřadit každému partnerovi, co do soužití dává.",
      "Odvodit, proč jsou lišejníky průkopníky a ukazateli čistoty ovzduší.",
    ],
    boundaries: [
      "Jen běžní zástupci české přírody (terčovník, dutohlávka, pukléřka, provazovka).",
      "Bez latinských názvů a bez typů stélek.",
      "Bez přesného taxonomického zařazení.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Lišejník = houba + řasa nebo sinice. Houba drží vodu a chrání, řasa vyrábí živiny fotosyntézou pomocí světla.",
      steps: [
        "Urči, kterého partnera se otázka týká.",
        "Vzpomeň si, co tento partner umí a co mu chybí.",
        "Z toho odvoď, co se stane v popsané situaci.",
      ],
      commonMistake: "Považovat lišejník za mech nebo rostlinu, nebo si myslet, že fotosyntézu dělá houba.",
      example: "Na kmenech u továrny skoro nejsou lišejníky → vzduch u továrny je znečištěnější.",
    },
  },
];
