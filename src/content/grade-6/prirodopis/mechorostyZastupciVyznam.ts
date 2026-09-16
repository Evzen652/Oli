/**
 * Přírodopis 6. ročník — Mechorosty: zástupci, význam (select_one).
 *
 * Mechorosty jsou zelené rostliny s lodyžkou a lístky (porostnice má plochou
 * stélku). Místo kořenů mají jen příchytná vlákna, vodu přijímají celým
 * povrchem, rozmnožují se výtrusy z tobolky a k oplození potřebují vodu.
 * Zástupci: ploník (nejvyšší, tuhá lodyžka, chlupatá čepička), rašeliník
 * (bělavý, nasákavý, spodek odumírá v rašelinu), měřík (vlhké stinné lesy a břehy
 * potoků, široké vlnité lístky, za sucha svraštělé), porostnice (plochá játrovka).
 * Význam: zadržují vodu, chrání půdu, tvoří první půdu, úkryt živočichů,
 * rašelina v zahradnictví a lázních.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • mech má kořeny a vodu čerpá z hloubky;
 *  • mech kvete, tobolka je květ/plod, rozmnožuje se semeny;
 *  • mech je houba, lišejník nebo řasa;
 *  • záměna zástupců podle jednoho znaku; „mech na stromě je cizopasník“;
 *    „mech roste jen na severní straně“ (jen jako vyvrácená miskoncepce).
 *
 *  • L1 — zapamatování: „Který / Čím / Co…“, klíč = jeden pojem.
 *  • L2 — použití: situace (les po dešti, substrát, svah, parapet…).
 *  • L3 — přenos: poznej zástupce z popisu více znaků, spoj znak s funkcí,
 *         rozhodni o tvrzení nebo o neznámém případu.
 *
 * Rotace banky začíná na náhodném místě (lokální počítadlo v gen()), modul nemá stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { shuffle, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

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

// Opakované diagnózy chyb (stejná miskoncepce → stejné vysvětlení).
const FB_KORENY = "Mech pravé kořeny nemá. Drží ho jen tenká příchytná vlákna a vodu přijímá celým povrchem těla.";
const FB_SEMENA = "Mechy nekvetou, a proto nemají květy, plody ani semena. V tobolce na stopce vznikají drobné výtrusy.";
const FB_HOUBA = "Mech není houba. Je to zelená rostlina s lodyžkou a lístky, která si potravu (cukry) vyrábí sama fotosyntézou.";
const FB_LISEJNIK = "Lišejník je soužití houby a řasy nebo sinice a nemá lodyžku ani lístky. Mech je zelená rostlina.";
const FB_RASA = "Řasa nemá lodyžku ani lístky a většinou žije ve vodě. Mech je rostlina s lodyžkou a lístky, která roste na souši.";
const FB_SEVER = "Mech neroste podle světové strany. Roste tam, kde je vlhko a stín, a to může být na kterékoli straně.";
const FB_PARAZIT = "Mech stromu nic nebere. Je k podkladu jen přichycený, vodu a minerální látky přijímá povrchem z deště a cukry si vyrábí sám fotosyntézou.";

// ── Zástupci (pro L1 a určovací úlohy L3) ─────────────────────────────────
type Zastupce = "ploník" | "rašeliník" | "měřík" | "porostnice";
const ZASTUPCI: Zastupce[] = ["ploník", "rašeliník", "měřík", "porostnice"];

const ZNAKY: Record<Zastupce, string> = {
  ploník: "Ploník je náš nejvyšší mech s tuhou přímou lodyžkou a tobolkou s chlupatou čepičkou.",
  rašeliník: "Rašeliník je bělavě zelený mech z rašelinišť, nasákne velmi mnoho vody a spodní část mu odumírá.",
  měřík: "Měřík je mech vlhkých stinných lesů a břehů potoků se širokými vlnitými lístky, které se za sucha svraští.",
  porostnice: "Porostnice je játrovka s plochou stélkou bez lodyžky a lístků.",
};

/**
 * Feedback k chybně zvolenému zástupci.
 * `popis = true` (L3): úloha popisuje rostlinku, feedback se na popis odvolá.
 * `popis = false` (L1): otázka nic nepopisuje, feedback jen věcně řekne, co ten zástupce je.
 */
function fbZastupce(spatny: Zastupce, klic: Zastupce, popis: boolean): string {
  if (!popis) {
    if (spatny === "porostnice") return "Porostnice není mech s lodyžkou a lístky, ale játrovka s plochou stélkou.";
    return `${ZNAKY[spatny]} Hledaný mechorost je ale jiný.`;
  }
  if (spatny === "porostnice") return `${ZNAKY.porostnice} Popsaná rostlinka ale lodyžku s lístky má.`;
  if (klic === "porostnice") return `${ZNAKY[spatny]} Popsaná rostlinka ale lodyžku ani lístky nemá.`;
  return `${ZNAKY[spatny]} Takové znaky v popisu nejsou.`;
}

const urceni = (q: string, klic: Zastupce, h: [string, string], ex: string, popis = true): Polozka => ({
  q,
  key: klic,
  ds: ZASTUPCI.filter((z) => z !== klic).map((z) => [z, fbZastupce(z, klic, popis)] as [string, string]),
  h,
  ex,
});

// ── L1 — zapamatování ───────────────────────────────────────────────────────
const BANKA_L1: Polozka[] = [
  {
    q: "Čím se mech přichytí k podkladu?",
    key: "příchytnými vlákny",
    ds: [
      ["tenkými kořeny", FB_KORENY],
      ["kořenovými vlásky", FB_KORENY],
      ["lepkavými lístky", "Lístky mech nelepí, slouží k fotosyntéze a k příjmu vody. K podkladu ho drží útvary na spodu lodyžky."],
    ],
    h: [
      "Mech nemá stejné orgány jako třeba pampeliška. Co mu místo nich drží lodyžku v podkladu?",
      "Pravé kořeny mají až složitější rostliny. Mech má na spodu lodyžky jen tenké útvary, které ho drží, ale vodu z hloubky nevedou.",
    ],
    ex: "Mech nemá pravé kořeny. K podkladu ho drží příchytná vlákna (rhizoidy), vodu přijímá celým povrchem.",
  },
  {
    q: "Čím se mechy rozmnožují?",
    key: "výtrusy",
    ds: [
      ["semeny", FB_SEMENA],
      ["cibulkami", "Cibulky mají některé kvetoucí rostliny, třeba tulipán. Mech se šíří drobnými tělísky z tobolky."],
      ["plody", "Plody mají jen kvetoucí rostliny. Mech nekvete a tobolka není plod."],
    ],
    h: [
      "Mechy nekvetou. Čím se tedy mohou šířit rostliny bez květů?",
      "Nad mechem sedí na stopce malá nádobka. Uvnitř vznikají velmi drobná tělíska, která roznáší vítr.",
    ],
    ex: "Mechy se rozmnožují výtrusy. Vznikají v tobolce na stopce a roznáší je vítr.",
  },
  {
    q: "Jak se jmenuje útvar na stopce, ve kterém mechu dozrávají výtrusy?",
    key: "tobolka",
    ds: [
      ["květ", "Mechy nekvetou. Útvar na stopce není květ, ale nádobka s výtrusy."],
      ["šiška", "Šišky mají jehličnany a jsou v nich semena. Mech šišky nemá."],
      ["lusk", "Lusk je plod bobovitých rostlin se semeny. Mech plody nemá."],
    ],
    h: [
      "Hledáš název malé nádobky na tenké stopce, která vyrůstá nad mechovým polštářem.",
      "Tento útvar není květ ani plod, protože mech nekvete. Když dozraje, otevře se a vysype prášek z drobných tělísek.",
    ],
    ex: "Výtrusy mechu dozrávají v tobolce, která sedí na stopce nad polštářem.",
  },
  urceni(
    "Který náš mechorost bývá nejvyšší?",
    "ploník",
    [
      "Vzpomeň si na mech s tuhými přímými lodyžkami, který roste ve vlhkých lesích.",
      "Tento mech má na tobolce chlupatou čepičku a jeho lodyžky mohou být delší než dlaň.",
    ],
    "Naším nejvyšším mechem je ploník. Má tuhou přímou lodyžku a tobolku s chlupatou čepičkou.",
    false,
  ),
  urceni(
    "Který mechorost roste v horských mokřadech a nasaje velmi mnoho vody?",
    "rašeliník",
    [
      "Hledáš mech z podmáčených míst, který drží vodu jako houbička.",
      "Tento mech je bělavě zelený, nahoře roste a dole odumírá. Z jeho zbytků vzniká hmota používaná v zahradnictví.",
    ],
    "V mokřadech roste rašeliník. Zadrží mnohonásobek své hmotnosti vody a spodní část mu odumírá.",
    false,
  ),
  {
    q: "Jaká hnědá hmota se v mokřadech hromadí z odumřelých mechů?",
    key: "rašelina",
    ds: [
      ["černé uhlí", "Černé uhlí vzniklo před miliony let hlavně z pradávných kapraďorostů, ne z mechů."],
      ["vápenec", "Vápenec vznikl ze schránek mořských živočichů, ne z mechů."],
      ["ropa", "Ropa vznikla z drobných mořských organismů, ne z mechů."],
    ],
    h: [
      "Vzpomeň si, co se těží v mokřadech a přidává do zahradních substrátů.",
      "Ve vodě bez vzduchu se zbytky mechů skoro nerozloží a po staletí se hromadí ve vrstvách.",
    ],
    ex: "Odumřelé části mechů, hlavně rašeliníku, se ve vodě skoro nerozkládají a velmi pomalu se z nich hromadí rašelina.",
  },
  {
    q: "Kde nejčastěji roste měřík?",
    key: "ve vlhkých stinných lesích",
    ds: [
      ["jen ve vodě rybníků", "Měřík není vodní rostlina. Roste na zemi na vlhkých stinných místech a u potoků."],
      ["jen na severní straně kmenů", FB_SEVER],
      ["na suchých slunných skalách", "Na suchých slunných skalách se daří lišejníkům. Měřík potřebuje vlhko a stín."],
    ],
    h: [
      "Měřík je běžný mech s lodyžkou a lístky. Jaké podmínky potřebuje většina mechů?",
      "Mech potřebuje vlhko a stín, ale ne stálou vodu. Hledej místa, kde je půda zastíněná a stále vlhká.",
    ],
    ex: "Měřík roste ve vlhkých stinných lesích a na březích potoků, kde je dost vlhka.",
  },
  {
    q: "Do které skupiny organismů patří mechy?",
    key: "rostliny",
    ds: [
      ["houby", FB_HOUBA],
      ["lišejníky", FB_LISEJNIK],
      ["řasy", FB_RASA],
    ],
    h: [
      "Mech je zelený, má lodyžku a lístky a potravu si vyrábí na světle. Kterým organismům je to vlastní?",
      "Houby nemají chlorofyl (zelené barvivo k fotosyntéze) a lišejník je soužití dvou partnerů. Mech je jeden zelený organismus s lodyžkou.",
    ],
    ex: "Mechy jsou zelené rostliny. Mají lodyžku a lístky a potravu (cukry) si vyrábějí fotosyntézou.",
  },
  {
    q: "Jak mech získává cukry, které potřebuje k životu?",
    key: "vyrábí si je fotosyntézou",
    ds: [
      ["bere je z kořenů stromu", FB_PARAZIT],
      ["rozkládá odumřelé listí", "Rozkladem odumřelých zbytků se živí houby. Mech je zelený a cukry si vyrábí na světle."],
      ["nasává je kořeny z půdy", FB_KORENY],
    ],
    h: [
      "Mech je zelený. K čemu rostlinám slouží zelené barvivo?",
      "Zelené rostliny potřebují k výrobě potravy jen vzduch, vodu a světlo. Od jiných organismů ji brát nemusí.",
    ],
    ex: "Mech je zelená rostlina, takže si cukry vyrábí sám fotosyntézou z vody, oxidu uhličitého a světla. Minerální látky přijímá povrchem z vody.",
  },
  {
    q: "Čím mech přijímá vodu?",
    key: "celým povrchem těla",
    ds: [
      ["kořeny z hluboké půdy", FB_KORENY],
      ["jen tobolkou na stopce", "Tobolka slouží k tvorbě výtrusů, vodu nepřijímá."],
      ["jen příchytnými vlákny", "Příchytná vlákna mech hlavně drží v podkladu. Vodu přijímá lístky a lodyžkou."],
    ],
    h: [
      "Mech nemá kořeny ani cévy, které by vodu rozváděly. Jak ji tedy musí dostat?",
      "Mohla by se voda z jednoho místa mechu dostat do celé rostliny? Kde všude se ho tedy musí dotknout?",
    ],
    ex: "Mech nemá kořeny ani cévy, proto vodu přijímá celým povrchem, hlavně lístky.",
  },
  {
    q: "Co mech nutně potřebuje, aby mohlo dojít k oplození?",
    key: "vodu",
    ds: [
      ["hmyz opylovače", "Opylovače potřebují kvetoucí rostliny. Mech nekvete a opylovat ho není potřeba."],
      ["silné sluneční světlo", "Světlo mech potřebuje k fotosyntéze, ale samotné oplození bez vlhka proběhnout nemůže."],
      ["vítr", "Vítr roznáší až hotové výtrusy. Samotné oplození se bez vlhka neobejde."],
    ],
    h: [
      "Samčí buňky mechu se k samičím musí dostat samy, nikdo je nepřenáší. V čem se mohou pohybovat?",
      "Porovnej, které z možností pomáhají jen kvetoucím rostlinám a co se s mechem děje až po oplození.",
    ],
    ex: "Samčí buňky mechu doplavou k samičím jen v kapce vody, proto mech k oplození potřebuje vodu, třeba rosu nebo déšť.",
  },
  {
    q: "Kde mechy nejčastěji rostou?",
    key: "na vlhkých a stinných místech",
    ds: [
      ["na suchých slunných místech", "Na suchu by mech vyschl a nemohl by se rozmnožovat. Daří se mu tam, kde je vlhko a stín."],
      ["jen na severní straně stromů", FB_SEVER],
      ["jen v tekoucí vodě potoků", "Mechy většinou rostou na souši. Potřebují vlhko, ne stálý proud vody."],
    ],
    h: [
      "Mech vodu přijímá celým povrchem a snadno vysychá. Jaké místo mu tedy vyhovuje?",
      "K oplození potřebuje mech kapku vody a přímé slunce by ho vysušilo. Hledej místo, kde vlhkost vydrží.",
    ],
    ex: "Mechy rostou hlavně na vlhkých a stinných místech, protože vodu přijímají povrchem a potřebují ji k oplození.",
  },
  urceni(
    "Který mechorost roste ve vlhkých stinných lesích a u potoků a má široké vlnité lístky?",
    "měřík",
    [
      "Hledáš mech s lodyžkou a lístky. Ne ten nejvyšší s chlupatou čepičkou, ani bělavý z mokřadů.",
      "Lístky tohoto mechu jsou širší než u ploníku a za sucha se svraští. Jeho lodyžky nejsou tuhé ani vzpřímené.",
    ],
    "Ve vlhkých stinných lesích a u potoků roste měřík. Má široké vlnité lístky, které se za sucha svraští.",
    false,
  ),
  urceni(
    "Jak se jmenuje plochá játrovka, která roste na vlhkých kamenech a březích?",
    "porostnice",
    [
      "Játrovky nemají vždy lodyžku a lístky. Který mechorost tvoří jen plochou zelenou stélku?",
      "Tato rostlinka je přitisknutá k podkladu jako zelený pásek a roste u studní, potoků a na vlhkých zdech.",
    ],
    "Porostnice je játrovka. Nemá lodyžku ani lístky, jen plochou stélku, a roste na vlhkých místech.",
    false,
  ),
  {
    q: "Kolik vody dokáže rašeliník nasát?",
    key: "mnohonásobek své hmotnosti",
    ds: [
      ["jen pár kapek na povrch", "Rašeliník má v lístcích prázdné buňky, které vodu nasají jako houbička. Zadrží jí velmi mnoho."],
      ["zhruba polovinu své hmotnosti", "Polovina je málo. Rašeliník zadrží vody mnohem víc, než sám váží."],
      ["zhruba tolik, kolik sám váží", "To je málo. Prázdné buňky v lístcích rašeliníku pojmou vody mnohem víc, než sám váží."],
    ],
    h: [
      "Vzpomeň si, co se stane, když rašeliník zmáčkneš v dlani.",
      "V lístcích má tento mech prázdné buňky, které se plní vodou. Porovnej, kolik váží suchý a kolik nasáklý.",
    ],
    ex: "Rašeliník má v lístcích prázdné buňky, které se plní vodou, a proto zadrží mnohonásobek své hmotnosti.",
  },
  {
    q: "Z čeho se skládá tělo ploníku?",
    key: "z lodyžky a lístků",
    ds: [
      ["z kořene, stonku a listů", FB_KORENY],
      ["z klobouku a třeně", "Klobouk a třeň má plodnice houby. Ploník je rostlina, ne houba."],
      ["z ploché stélky", "Plochou stélku má porostnice, která je játrovka. Ploník má přímé tělo."],
    ],
    h: [
      "Ploník je mech. Jaké části má mech místo stonku a listů kvetoucích rostlin?",
      "Pravé kořeny mech nemá a plochý není. Jeho tělo tvoří tuhá přímá osa porostlá drobnými zelenými útvary.",
    ],
    ex: "Tělo ploníku tvoří lodyžka s lístky. Pravé kořeny, stonek a listy mají až kapraďorosty a semenné rostliny.",
  },
];

// ── L2 — použití ────────────────────────────────────────────────────────────
const BANKA_L2: Polozka[] = [
  {
    q: "Po dešti je mechový polštář v lese těžký a mokrý. Jakou službu tím mech lesu dělá?",
    key: "vodu zadržuje a pomalu ji uvolňuje",
    ds: [
      ["vodu rychle odvádí do potoka", "Kdyby vodu odváděl, polštář by po dešti nebyl těžký. Mech vodu drží jako houbička."],
      ["vodu nasává kořeny z hloubky", FB_KORENY],
      ["vodu z lesa odpaří najednou", "Mech vodu neodpařuje najednou. Pouští ji pomalu, a les proto déle nevysychá."],
    ],
    h: [
      "Polštář je těžký, protože v sobě něco drží. Co se s tím stane v dalších dnech?",
      "Mech funguje jako houbička. Rozmysli, jak to pomáhá lesu v suchých dnech po dešti.",
    ],
    ex: "Mech nasákne dešťovou vodu a pomalu ji pouští. Les tak méně vysychá a voda neodteče hned.",
  },
  {
    q: "Zahradník kupuje pytel kyselého substrátu pro borůvky. Z čeho substrát nejspíš je?",
    key: "z odumřelých rašeliníků",
    ds: [
      ["z rozdrcených lišejníků", "Lišejníky se na substráty nepoužívají, rostou velmi pomalu. Kyselý substrát je z rašeliny."],
      ["z drcených plodnic hub", "Plodnice hub se k výrobě substrátu nepoužívají. Kyselý substrát se dělá z rašeliny."],
      ["z mletého černého uhlí", "Uhlí se jako substrát nepoužívá. Borůvkám se dává kyselá rašelina."],
    ],
    h: [
      "Která hnědá hmota vzniká v mokřadech a používá se v zahradnictví?",
      "Tato hmota vzniká velmi pomalu z mechu, kterému dole odumírá tělo, zatímco nahoře roste dál.",
    ],
    ex: "Kyselé substráty se dělají z rašeliny, tedy z odumřelých rašeliníků, které se ve vodě nerozložily.",
  },
  {
    q: "Proč mechy rostou hlavně na vlhkých a stinných místech?",
    key: "potřebují vodu k oplození i k životu",
    ds: [
      ["ve vlhku jim rostou delší a silnější kořeny", FB_KORENY],
      ["na slunci by jim uvadly květy", FB_SEMENA],
      ["ve stínu nemusí dělat fotosyntézu", "Fotosyntézu dělají mechy i ve stínu, bez ní by neměly živiny. Vlhko potřebují kvůli vodě."],
    ],
    h: [
      "Mech přijímá vodu celým povrchem a nemá cévy. Co se s ním stane na přímém slunci?",
      "Vzpomeň si také, co mech potřebuje, aby se samčí buňka dostala k samičí.",
    ],
    ex: "Mech přijímá vodu povrchem a snadno vysychá. Voda mu musí být nablízku i k oplození, proto roste ve vlhku a stínu.",
  },
  {
    q: "Na holé skále se po lišejnících uchytí mech. Co tím pro další rostliny udělá?",
    key: "pomůže vytvořit vrstvu půdy",
    ds: [
      ["rozpustí skálu svými kořeny", FB_KORENY],
      ["zastíní je a nedovolí jim růst", "Mech další rostliny nevytlačuje, naopak jim připravuje půdu a vlhko."],
      ["vysaje ze skály všechnu vodu", "Mech vodu ze skály nesaje, zadržuje ji. Z jeho zbytků a prachu vzniká půda."],
    ],
    h: [
      "Na holé skále nic dalšího neroste, protože tam něco chybí. Co to je?",
      "Mech zachytává prach a jeho odumřelé části se rozkládají. Co z toho postupně vzniká?",
    ],
    ex: "Mech zachytí prach a vlhko a jeho odumřelé části se rozkládají. Vzniká tenká vrstva půdy, do které se uchytí další rostliny.",
  },
  {
    q: "Obec chce odvodnit horské rašeliniště a udělat z něj pole. Ochránci přírody jsou proti. Proč?",
    key: "zadržuje vodu a rašelina se tvoří velmi pomalu",
    ds: [
      ["žijí tam vzácné houby, které dělají fotosyntézu", "Houby fotosyntézu nedělají. Rašeliniště se chrání kvůli vodě a pomalu vznikající rašelině."],
      ["rašeliník má hluboké kořeny, které drží hráz", FB_KORENY],
      ["mechy tam kvetou a opylují je vzácné včely", FB_SEMENA],
    ],
    h: [
      "Co rašeliník dělá s vodou? A jak rychle přibývá hmota z jeho odumřelých částí?",
      "Po odvodnění by zmizela zásoba vody v krajině. Rozmysli, jak dlouho by trvalo, než by vše znovu vzniklo.",
    ],
    ex: "Rašeliniště zadržuje v krajině mnoho vody a rašelina přibývá jen velmi pomalu. Zničené rašeliniště by se obnovovalo velmi dlouho.",
  },
  {
    q: "Po vykácení lesa se na svahu začala půda splavovat deštěm. Jak by tomu pomohl souvislý mechový porost?",
    key: "zpevní povrch a zadrží vodu",
    ds: [
      ["zapustí kořeny hluboko do svahu", FB_KORENY],
      ["vytvoří semena nových stromů", FB_SEMENA],
      ["odvede vodu rychleji dolů", "Rychlejší odtok by půdu splavoval ještě víc. Mech vodu naopak drží."],
    ],
    h: [
      "Půdu odnáší voda, která rychle teče po holém povrchu. Co s tou vodou udělá mechový koberec?",
      "Mech pokryje povrch jako deka a nasákne vodu. Rozmysli, jak to zpomalí její tok.",
    ],
    ex: "Mechový porost kryje povrch a nasákne vodu, takže déšť půdu tolik neodnáší. Tak mechy chrání půdu před erozí.",
  },
  {
    q: "Proč je mechový polštář v lese dobrým úkrytem pro drobné živočichy?",
    key: "je v něm stále vlhko a stín",
    ds: [
      ["má květy s nektarem k jídlu", FB_SEMENA],
      ["kořeny v něm tvoří pevné nory", FB_KORENY],
      ["hřeje, protože sám vyrábí teplo", "Mech teplo nevyrábí. Živočichy chrání tím, že je v něm skrýš a stálé vlhké podmínky."],
    ],
    h: [
      "Drobní živočichové jako žížaly nebo stonožky snadno vysychají. Co jim mech nabízí?",
      "Mech drží vodu a je hustý. Rozmysli, jaké podmínky jsou uvnitř polštáře v horkém dni.",
    ],
    ex: "Mech drží vodu a je hustý, takže je v něm vlhko a stín. Drobní živočichové v něm nevyschnou a mají se kde skrýt.",
  },
  {
    q: "V lázních dávají pacientům teplé zábaly. Z čeho se tyto zábaly nejčastěji připravují?",
    key: "z rašeliny",
    ds: [
      ["z mletých hub", "Zábaly z hub se nedělají. V lázních se používá hmota z rostlinných zbytků, které se v podmáčené půdě nerozložily."],
      ["z drceného uhlí", "Uhlí se na zábaly nepoužívá. Používá se rašelina nebo podobná slatina z podmáčených míst."],
      ["z čerstvého měříku", "Živý mech se na zábaly nepoužívá. Používá se hmota z dávno odumřelých rostlinných zbytků z podmáčených míst."],
    ],
    h: [
      "Hledáš hnědou hmotu, která dlouho drží teplo a vodu a těží se v mokřadech.",
      "Tato hmota vzniká z rostlinných zbytků, které se v podmáčené půdě nerozložily.",
    ],
    ex: "Lázeňské zábaly se dělají z rašeliny nebo z podobné slatiny. Obě vznikají z rostlinných zbytků, které se v podmáčené půdě nerozložily, a dlouho drží teplo.",
  },
  {
    q: "Tomáš zaléval mech jen do půdy pod polštářem, a mech přesto vysychal. Proč mu to nepomohlo?",
    key: "vodu přijímá hlavně lístky a lodyžkou",
    ds: [
      ["vodu přijímá jen kořeny z hloubky", FB_KORENY],
      ["vodu přijímá jen tobolkou na stopce", "Tobolka slouží k tvorbě výtrusů, vodu nepřijímá."],
      ["vodu přijímá hlavně vlákny ze země", "Příchytná vlákna mech hlavně drží v podkladu. Vodu přijímá lístky a lodyžkou, proto mu zalévání půdy nestačí."],
    ],
    h: [
      "Mech nemá pravé kořeny ani cévy. Kudy se do něj voda dostane?",
      "Rozmysli, proč mech po dešti zezelená, i když půda pod ním je ještě suchá.",
    ],
    ex: "Mech nemá kořeny ani cévy, vodu přijímá celým povrchem. Zalévání jen do půdy mu proto nestačí, je potřeba ho kropit.",
  },
  {
    q: "Na lesní cestě našla Eva hnědou nádobku na tenké stopce, která vyrůstala z mechu. Co to je?",
    key: "tobolka s výtrusy",
    ds: [
      ["květ se semeny", FB_SEMENA],
      ["plod se semenem", FB_SEMENA],
      ["plodnice houby", FB_HOUBA],
    ],
    h: [
      "Vyrůstá přímo z mechu, a patří tedy k němu. Kvete mech, nebo ne?",
      "Mech se šíří drobnými tělísky, která roznáší vítr. Kde vznikají?",
    ],
    ex: "Nádobka na stopce je tobolka. Mech nekvete, v tobolce dozrávají výtrusy.",
  },
  {
    q: "Na zahradě se mech rozrůstá v trávníku pod stromy, ale na slunném kraji ne. Proč?",
    key: "pod stromy je vlhčí a stinnější místo",
    ds: [
      ["pod stromy mu kořeny stromů dávají vodu", FB_PARAZIT],
      ["pod stromy padá víc semen mechu", FB_SEMENA],
      ["pod stromy mu houby vyrábějí živiny", "Mech si potravu vyrábí sám fotosyntézou, houby mu ji nedodávají."],
    ],
    h: [
      "Porovnej obě místa: kde déle vydrží rosa a kde svítí slunce celý den?",
      "Mech přijímá vodu povrchem a na přímém slunci vysychá. Které místo mu proto vyhovuje?",
    ],
    ex: "Pod stromy je stín a vlhko vydrží déle. Mech přijímá vodu povrchem, takže tam neuschne.",
  },
  {
    q: "Po přívalovém dešti se voda z holého svahu hned valila do údolí, z lesa s mechem přitékala až později. Čím to?",
    key: "mech vodu nasákne a pouští ji pomalu",
    ds: [
      ["mech vodu vede kořeny hluboko do země", FB_KORENY],
      ["mech vodu hned odpaří do vzduchu", "Mech vodu neodpaří najednou. Nasákne ji a pomalu pouští."],
      ["mech vodu promění v rašelinu", "Rašelina vzniká z odumřelých rašeliníků, ne z vody. Mech vodu hlavně drží."],
    ],
    h: [
      "Na holém svahu voda nemá co zdržet. Co se s ní stane v lese s mechem?",
      "Mech funguje jako houbička. Rozmysli, jak rychle houbička vodu pouští.",
    ],
    ex: "Mech nasákne velké množství vody a pouští ji pomalu. Krajina s mechy tak brání rychlému odtoku a povodním.",
  },
  {
    q: "Jirka zvedl z mokřadu hrst rašeliníku a z mechu crčela voda. Čím to, že rašeliník udrží tolik vody?",
    key: "má v lístcích prázdné buňky, které ji nasají",
    ds: [
      ["má dlouhé kořeny sahající k podzemní vodě", FB_KORENY],
      ["má v tobolkách zásobu vody na zimu", "Tobolka slouží k tvorbě výtrusů, vodu neskladuje."],
      ["má na lístcích voskovou vrstvu proti vodě", "Vosková vrstva by vodu odpuzovala. Rašeliník ji naopak nasává."],
    ],
    h: [
      "Rašeliník vodu nevede z hloubky. Kde v jeho těle se tedy může držet?",
      "Podívej se pod lupou na lístek: některé buňky jsou živé a zelené, jiné velké a průhledné. K čemu slouží ty velké?",
    ],
    ex: "Rašeliník má v lístcích velké prázdné buňky, které se plní vodou. Proto zadrží mnohonásobek své hmotnosti.",
  },
  {
    q: "Proč mech dokáže růst i na střeše nebo na zdi, kde skoro není půda?",
    key: "drží se vlákny a vodu bere z deště",
    ds: [
      ["prorazí kořeny zdí až k vodě", FB_KORENY],
      ["živí se rozkladem malty jako houba", FB_HOUBA],
      ["semena mu tam přinášejí ptáci", FB_SEMENA],
    ],
    h: [
      "Mech nepotřebuje hlubokou půdu. Čím se udrží a odkud dostane vodu?",
      "Mech vodu přijímá celým povrchem. Rozmysli, co na střechu padá z nebe.",
    ],
    ex: "Mech se jen přichytí příchytnými vlákny a vodu přijímá povrchem z deště a rosy. Hlubokou půdu proto nepotřebuje.",
  },
  {
    q: "Petr chce doma pěstovat mech v misce na slunném parapetu a nezalévat ho. Co se stane?",
    key: "mech vyschne a přestane růst",
    ds: [
      ["mech vykvete a udělá semena", FB_SEMENA],
      ["mech zapustí kořeny do misky", FB_KORENY],
      ["mech bude růst rychleji než v lese", "Na slunci a bez vody mech nemá čím přijímat vodu z okolí, a proto nemůže růst."],
    ],
    h: [
      "Mech přijímá vodu povrchem. Co s ním udělá slunce, když ho nikdo nekropí?",
      "Vzpomeň si, kde mech v přírodě roste. Je slunný parapet podobné místo?",
    ],
    ex: "Mech potřebuje vlhko a stín. Na slunném parapetu bez vody vyschne a přestane růst.",
  },
  {
    q: "Hajný vysvětluje dětem, proč nemají v lese trhat mech na vánoční betlém. Který důvod je správný?",
    key: "mech drží vodu a skrývá drobné živočichy",
    ds: [
      ["utržený mech hned doroste, jen je to zakázané", "Mech roste velmi pomalu a utržené místo dorůstá roky. Netrháme ho kvůli službě, kterou lesu dělá."],
      ["mech je houba a jeho výtrusy škodí dětem", FB_HOUBA],
      ["mech má kořeny, které drží stromy", FB_KORENY],
    ],
    h: [
      "Vzpomeň si, co mech v lese dělá s vodou a kdo v něm bydlí.",
      "Utržený mech dorůstá dlouho. Co by les na tom místě ztratil?",
    ],
    ex: "Mech zadržuje v lese vodu a je domovem a úkrytem drobných živočichů. Proto ho v lese netrháme.",
  },
];

// ── L3 — přenos: poznej zástupce, spoj znak s funkcí, rozhodni o tvrzení ────
const BANKA_L3: Polozka[] = [
  urceni(
    "Ve vlhkém lese roste mech výrazně vyšší než okolní mechy, s tuhou přímou lodyžkou. Na stopce nese tobolku s chlupatou čepičkou. Který mech to je?",
    "ploník",
    ["Porovnej výšku rostlinky a tvar její lodyžky se znaky zástupců, které znáš.", "Nejvýraznější znak je tu čepička na tobolce pokrytá chloupky. Který mech ji má?"],
    "Tuhá přímá lodyžka, velká výška a tobolka s chlupatou čepičkou jsou znaky ploníku.",
  ),
  {
    q: "Proč sedí tobolka mechu na dlouhé stopce vysoko nad polštářem?",
    key: "vítr výtrusy z výšky roznese dál",
    ds: [
      ["hmyz na ni lépe dosáhne a opylí ji", "Mechy nekvetou a opylovat je není potřeba. Stopka zvedá tobolku kvůli šíření výtrusů."],
      ["semena z ní dopadnou do hlubší půdy", FB_SEMENA],
      ["stopka tobolce vede vodu z kořenů", FB_KORENY],
    ],
    h: [
      "Co je v tobolce a čím se to šíří do okolí?",
      "Porovnej to s pampeliškou, kterou foukáš: odkud doletí chmýří dál, zezdola, nebo z výšky?",
    ],
    ex: "Tobolka obsahuje výtrusy a ty roznáší vítr. Z vysoké stopky je vítr zachytí snáz a odnese je dál od mateřské rostliny.",
  },
  urceni(
    "Bělavě zelený mech z podmáčené louky: když ho zmáčkneš, vyteče z něj hodně vody, a spodní část je hnědá a odumřelá. Co to je?",
    "rašeliník",
    ["Začni barvou a tím, jak rostlinka drží vodu. Pak zvaž, kde roste.", "Všimni si barvy, množství vody a toho, co se děje se spodní částí. Který mech dole odumírá a nahoře roste?"],
    "Bělavá barva, velká nasákavost a odumírající spodní část jsou znaky rašeliníku.",
  ),
  {
    q: "Pod lupou vidíš, že rašeliník má v lístcích mnoho velkých prázdných buněk. Co se stane, když jeho suchý polštář na hodinu položíš do misky s vodou?",
    key: "nasákne vodu a mnohonásobně ztěžkne",
    ds: [
      ["zůstane lehký, vodu berou jen kořeny", FB_KORENY],
      ["zůstane suchý, lístky vodu odpuzují", "Lístky rašeliníku vodu neodpuzují. Prázdné buňky se vodou naopak plní."],
      ["nasákne jen spodní hnědá část", "Vodu nasávají prázdné buňky v lístcích po celé rostlině, ne jen odumřelá spodní část."],
    ],
    h: [
      "K čemu může rostlině sloužit buňka, která je prázdná a má otvor ven?",
      "Rašeliník nemá kořeny ani cévy. Co se s prázdnými buňkami stane, když se celý ponoří?",
    ],
    ex: "Prázdné buňky v lístcích se naplní vodou, takže suchý rašeliník nasákne a zadrží mnohonásobek své hmotnosti. Proto rašeliniště drží v krajině tolik vody.",
  },
  {
    q: "Soused tvrdí, že mech na kmeni stromu vysává stromu šťávu. Jak to je?",
    key: "mech je jen přichycený a živí se fotosyntézou",
    ds: [
      ["má pravdu, mech kořeny čerpá šťávu z kmene", FB_KORENY],
      ["má pravdu, mech je houba a kmen rozkládá", FB_HOUBA],
      ["mech šťávu bere jen ze severní strany kmene", "Mech stromu šťávu nebere z žádné strany. Roste tam, kde je vlhko a stín, a potravu si vyrábí sám."],
    ],
    h: [
      "Mech je zelený. Potřebuje od stromu potravu, nebo si ji umí vyrobit?",
      "Čím se mech drží podkladu a odkud bere vodu? Rozmysli, jestli by stejně rostl i na kameni.",
    ],
    ex: "Mech na kmeni je jen přichycený příchytnými vlákny. Vodu a minerální látky přijímá povrchem z deště, cukry si vyrábí fotosyntézou a stromu nic nebere.",
  },
  urceni(
    "Plochá zelená rostlinka bez lodyžky a lístků je přitisknutá k vlhkému kameni u potoka. Co to je?",
    "porostnice",
    ["Nejdřív zjisti, jestli má rostlinka tělo rozdělené na lodyžku a lístky.", "Popsaná rostlinka nemá lodyžku ani lístky. Který mechorost má jen plochou stélku?"],
    "Plochá stélka bez lodyžky a lístků na vlhkém místě patří porostnici, která je játrovka.",
  ),
  {
    q: "Honza tvrdí, že mech na kmeni ukazuje vždy na sever, a chce se podle toho v lese orientovat. Jak to je?",
    key: "nemá pravdu, mech roste tam, kde je vlhko a stín",
    ds: [
      ["má pravdu, mech roste vždy jen na severní straně", FB_SEVER],
      ["má pravdu, na jižní straně mech vždy uschne", "V hustém lese bývá stín a vlhko i na jižní straně kmene, takže tam mech roste také."],
      ["nemá pravdu, mech roste jen na jižní straně kmene", "Ani jižní strana není pravidlo. Mech roste podle vlhka a stínu, ne podle světové strany."],
    ],
    h: [
      "Co mech potřebuje, aby rostl? Závisí to na světové straně, nebo na podmínkách u kmene?",
      "V hustém lese nebo u potoka bývá vlhko na všech stranách kmene. Jak by tam mech rostl?",
    ],
    ex: "Mech roste tam, kde je vlhko a stín. To bývá často, ale ne vždy, na severní straně, proto k orientaci spolehlivý není.",
  },
  urceni(
    "Karel našel v mokrém smrkovém lese tmavozelené polštáře. Každá rostlinka má tuhou nerozvětvenou lodyžku a tobolku přikrytou chlupatou čepičkou. Co to je?",
    "ploník",
    ["Tmavozelenou barvu mají mnohé mechy. Hledej znak, který má jen jeden z nich.", "Barva a stanoviště tu nerozhodnou. Soustřeď se na lodyžku a na čepičku tobolky."],
    "Tuhá nerozvětvená lodyžka a chlupatá čepička tobolky jsou znaky ploníku.",
  ),
  {
    q: "Mech na skalce byl celé suché léto hnědý a nové tobolky nevytvořil. Po deštivém období na něm později vyrostly nové tobolky. Co mu déšť umožnil?",
    key: "samčí buňky doplavaly k samičím",
    ds: [
      ["hmyz ho konečně mohl opylit", "Mech nekvete a hmyz ho neopyluje. K oplození potřebuje vodu, ve které samčí buňky plavou."],
      ["kořeny nasály vodu z hloubky", FB_KORENY],
      ["vítr roznesl loňské výtrusy", "Roznesené výtrusy by daly vznik novým rostlinkám jinde, ne tobolkám na tomto mechu. Tobolka roste až po oplození."],
    ],
    h: [
      "Tobolka vyroste až po jednom důležitém ději. Který to je a co k němu mech potřebuje?",
      "Pohlavní buňky mechu nikdo nepřenáší. Jak se k sobě dostanou, když je mech mokrý?",
    ],
    ex: "Tobolka s výtrusy vzniká až po oplození. K němu musí samčí buňky doplavat k samičím v kapce vody, a to za sucha nejde. Proto tobolky přibyly až po deštích.",
  },
  urceni(
    "V horském mokřadu roste světlý, skoro bělavý mech. Nahoře stále přirůstá, dole odumírá a hnědne. Který mech to je?",
    "rašeliník",
    ["Světlá barva a mokřad jsou první stopa. Co prozrazuje způsob, jakým rostlinka roste?", "Který mech roste jen nahoře, zatímco jeho spodek se mění v hnědou hmotu?"],
    "Bělavá barva, mokřad a spodní část, která odumírá, jsou znaky rašeliníku.",
  ),
  {
    q: "Porostnice nemá lodyžku ani lístky, a přesto ji řadíme k mechorostům spolu s mechy. Co mají společné?",
    key: "obě se šíří výtrusy a k oplození potřebují vodu",
    ds: [
      ["obě mají pravé kořeny a vodu vedou cévami", FB_KORENY],
      ["obě kvetou drobnými zelenými květy bez vůně", FB_SEMENA],
      ["obě jsou houby, které rostou jen na vlhku", "Porostnice ani mech nejsou houby. Obě jsou zelené a potravu si vyrábějí fotosyntézou."],
    ],
    h: [
      "Tvar těla je u nich jiný. Podle čeho dalšího můžeme rostliny zařadit do jedné skupiny?",
      "Vzpomeň si, jak se mechy rozmnožují a co k tomu potřebují. Platí to i pro játrovky?",
    ],
    ex: "Mechy i játrovky jako porostnice nemají pravé kořeny ani cévy, šíří se výtrusy a k oplození potřebují vodu. Proto patří do jedné skupiny, i když se tvarem těla liší.",
  },
  {
    q: "Mechy rostou na holých skalách vysoko v horách, ale na holých skalách v poušti skoro ne, i když půda chybí na obou místech. Proč?",
    key: "v horách mech často zvlhčí mlha a déšť",
    ds: [
      ["v poušti je tolik světla, že fotosyntéza nejde", "Světlo fotosyntézu neznemožní. V poušti mechu chybí voda, kterou by přijal povrchem."],
      ["v horách mech zapustí kořeny do puklin", FB_KORENY],
      ["v poušti chybí hmyz, který by mech opylil", "Mech nekvete a hmyz nepotřebuje. V poušti mu chybí voda."],
    ],
    h: [
      "Půda chybí na obou místech, takže o výsledku nerozhoduje. Čím se hory a poušť liší?",
      "Mech se drží jen vlákny a vodu přijímá povrchem. Odkud ji na holé skále dostane?",
    ],
    ex: "Mech hlubokou půdu nepotřebuje, drží se příchytnými vlákny. Vodu ale přijímá povrchem ze srážek a mlhy. Těch je v horách dost, v poušti skoro žádné.",
  },
  urceni(
    "U lesního potoka poléhá mech se širokými vlnitými lístky, které se za sucha svraští. Lodyžky nejsou tuhé ani vzpřímené a rostlinka je sytě zelená. Který mech to je?",
    "měřík",
    ["Jeden znak sám nestačí. Vlhko u potoka mají rády i jiné mechy, rozhodují lístky a lodyžka.", "Který zástupce má široké zvlněné lístky a přitom není tuhý a vzpřímený jako náš nejvyšší mech?"],
    "Široké vlnité lístky, které se za sucha svraští, a poléhavé lodyžky jsou znaky měříku. Tuhou vzpřímenou lodyžku má ploník, bělavou barvu rašeliník.",
  ),
  {
    q: "V horském mokřadu vyvrtali vědci hluboký vrt. I několik metrů pod povrchem našli zbytky mechu, na kterých šly ještě poznat lístky. Proč se nerozložily?",
    key: "ve vodě bez vzduchu se skoro nerozkládají",
    ds: [
      ["v hloubce je tepleji a rozklad je rychlejší", "Rychlejší rozklad by zbytky naopak zničil. Ve vodou nasáklé vrstvě chybí vzduch, a rozkladači tam skoro nepracují."],
      ["zbytky mechu tam dole pořád žijí a rostou", "Bez světla mech nemůže dělat fotosyntézu, v hloubce nežije. Jsou to odumřelé zbytky."],
      ["mech má tvrdé kořeny, které nic nerozloží", FB_KORENY],
    ],
    h: [
      "Co potřebují houby a bakterie, aby mohly rozkládat odumřelé zbytky?",
      "Mokřad je stále nasáklý vodou. Co ve vodou nasáklé vrstvě chybí?",
    ],
    ex: "Ve vodou nasáklé vrstvě chybí vzduch, takže rozkladači skoro nepracují. Zbytky mechů se proto zachovají a postupně z nich vzniká rašelina.",
  },
  urceni(
    "Na vlhké zdi u studny roste zelená stélka rozvětvená jako plochý pásek. Lodyžku ani lístky nemá. Který mechorost to je?",
    "porostnice",
    ["Zeď u studny je vlhká, to mají rády všechny mechorosty. Rozhodne až tvar těla.", "Tělo tu není rozdělené na lodyžku a lístky. Který mechorost patří mezi játrovky?"],
    "Plochá rozvětvená stélka bez lodyžky a lístků je znak porostnice, která je játrovka.",
  ),
  {
    q: "Ve sbírce jsou čtyři zelenavé vzorky. Který z nich je mech?",
    key: "rostlinka s lodyžkou, lístky a tobolkou",
    ds: [
      ["šedozelený keříček bez lístků", FB_LISEJNIK],
      ["zelený sliz z hladiny rybníka", FB_RASA],
      ["zelenavý chlupatý povlak na chlebu", "Povlak na chlebu je plíseň, tedy houba. Některé plísně bývají zelenavé, ale chlorofyl nemají a živí se rozkladem cizích látek."],
    ],
    h: [
      "Jaké části má mech? Hledej vzorek, který je má všechny.",
      "Lišejník, řasa ani plíseň nemají tělo rozdělené na části jako rostlina. Porovnej vzorky podle stavby.",
    ],
    ex: "Mech je rostlina s lodyžkou a lístky, na stopce nese tobolku. Keříček je lišejník, sliz řasa a povlak plíseň.",
  },
  {
    q: "Představ si, že by mech měl pravé kořeny a cévy jako tráva. Co by mu to umožnilo?",
    key: "brát vodu z půdy a dorůst výš",
    ds: [
      ["obejít se bez světla k fotosyntéze", "Kořeny a cévy vedou vodu. Světlo k fotosyntéze potřebuje každá zelená rostlina."],
      ["začít kvést a tvořit semena", "Kořeny a cévy s květy nesouvisí. Kapraďorosty je mají také, a přesto nekvetou."],
      ["přijímat vodu jen z deště", "Z deště mech vodu bere i teď. Kořeny a cévy by mu umožnily brát ji i z půdy."],
    ],
    h: [
      "K čemu slouží rostlinám kořeny a k čemu cévy?",
      "Proč jsou mechy nízké? Co jim chybí, aby mohly vést vodu do výšky?",
    ],
    ex: "Kořeny berou vodu z půdy a cévy ji vedou vzhůru. Mech je nemá, proto je nízký a vodu přijímá povrchem. S nimi by mohl brát vodu z půdy a dorůst výš.",
  },
  urceni(
    "Houbovitý světlý mech z podmáčeného lesa nasákne tolik vody, že ho musíš vyždímat jako hadr. Který mech to je?",
    "rašeliník",
    ["Nasákavost je znak, ve kterém se mechy hodně liší. Který zástupce drží nejvíc vody?", "Hlavní znak je tu obrovská nasákavost. Který mech má v lístcích prázdné buňky na vodu?"],
    "Světlý mech z podmáčených míst, který nasákne mnohonásobek své hmotnosti vody, je rašeliník.",
  ),
];

/** Rotace s náhodným začátkem: sada se mezi sezeními liší, ale v jedné sadě se položka neopakuje. */
function rotace<T>(seznam: T[]): () => T {
  let i = Math.floor(Math.random() * seznam.length);
  return () => seznam[i++ % seznam.length];
}

function gen(level: number): PracticeTask[] {
  const banka = level === 1 ? BANKA_L1 : level === 2 ? BANKA_L2 : BANKA_L3;
  const dalsi = rotace(banka);
  return ruzneUlohy(() => losUlohy(() => uloha(dalsi())));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const MECHOROSTY_ZASTUPCI_VYZNAM: TopicMetadata[] = [
  {
    id: "g6-pri-mechorosty-zastupci-vyznam-6",
    rvpNodeId: "g6-prirodopis-biologie-rostlin-nizsi-rostliny-mechorosty-zastupci-vyznam",
    displayName: "Mechy kolem nás",
    title: "Mechorosty - zástupci, význam",
    studentTitle: "Mechy kolem nás",
    subject: "prirodopis",
    category: "Biologie rostlin",
    topic: "Nižší rostliny",
    briefDescription: "Poznáš ploník, rašeliník a měřík a zjistíš, proč jsou mechy důležité.",
    keywords: [
      "mech", "mechy", "mechorosty", "ploník", "rašeliník", "měřík", "porostnice", "játrovka",
      "tobolka", "výtrusy", "příchytná vlákna", "rašelina", "rašeliniště", "zadržování vody",
    ],
    goals: [
      "Poznat ploník, rašeliník, měřík a porostnici podle znaků a stanoviště.",
      "Popsat stavbu mechu a rozmnožování výtrusy.",
      "Vysvětlit význam mechů pro vodu, půdu, živočichy a člověka.",
    ],
    boundaries: [
      "Jen běžní zástupci české přírody (ploník, rašeliník, měřík, porostnice).",
      "Bez latinských názvů a bez podrobného rodozměnu.",
      "Bez zařazení mezi nižší či vyšší rostliny a bez přesných čísel výšky a nasákavosti.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Mech = zelená rostlina s lodyžkou a lístky, bez kořenů (jen příchytná vlákna). Vodu přijímá povrchem, šíří se výtrusy z tobolky.",
      steps: [
        "Najdi v zadání znaky: výšku, barvu, stanoviště, tvar těla.",
        "Porovnej je se znaky zástupců nebo s tím, jak mech hospodaří s vodou.",
        "Vyřaď možnosti s kořeny, květy, semeny nebo houbou.",
      ],
      commonMistake: "Myslet si, že mech má kořeny a kvete, nebo že mech na stromě stromu škodí.",
      example: "Bělavý mech z mokřadu, ze kterého po zmáčknutí teče voda → rašeliník.",
    },
  },
];
