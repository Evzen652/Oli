/**
 * Zeměpis 6. ročník — Antarktida: poloha, klima, výzkum, ochrana (select_one).
 *
 * Celé téma emituje jen úlohy s možnostmi (žádné míchání typů). K obsahu nejsou
 * mapy ani obrázky, poloha se proto popisuje souřadnicemi nebo sousedstvím.
 *
 * Gradace:
 *  • L1 — banka faktů: poloha kolem jižního pólu, pevnina pod pevninským
 *    ledovcem, superlativy (nejchladnější, nejsušší, v průměru nejvyšší),
 *    žádní trvalí obyvatelé, typičtí živočichové, status podle smlouvy.
 *  • L2 — jedno pravidlo se použije na případ: sklon osy → polární den a jižní
 *    léto; souřadnice → polární oblast / mírný pás (s `solutionSteps`);
 *    podnebí → život (stromy, život u pobřeží, ledová poušť).
 *  • L3 — rozhodování o případu, který v L1 nezazněl: poznej oblast z popisu,
 *    vysvětli příčinu (tání pevninského × mořského ledu, ledová jádra, odpad),
 *    posuď neznámý návrh podle Antarktické smlouvy. Znění L1 a L3 jsou
 *    disjunktní — každá úroveň má vlastní banku.
 *
 * Chybový model: Arktida ↔ Antarktida (zamrzlý oceán × pevnina), lední medvěd
 * na jihu a tučňák na severu, prosinec = zima, vzdálenost od Slunce místo
 * sklonu osy, „hodně ledu = hodně srážek“, „co nikomu nepatří, to si smím vzít“.
 *
 * Čísla, na kterých se učebnice neshodují (tloušťka ledu na metry, teplotní
 * rekord, rozloha, rok podpisu smlouvy), se v klíči nevyskytují — používá se
 * řád („přes tři kilometry“) nebo pořadí („nejchladnější“). Rotace šablon se
 * nastavuje uvnitř gen(), modul nedrží žádný stav mezi voláními.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  pick,
  rnd,
  cis,
  shuffle,
  sirka,
  delka,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí obsahovat klíč ve znění otázky — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  return t.question.includes(t.correctAnswer) ? null : t;
}

interface Fakt {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const fakt = (f: Fakt): PracticeTask | null =>
  hlidej(
    choice(
      f.q,
      f.key,
      f.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: f.hints, explanation: f.explanation },
    ),
  );

// ── L1: banka faktů ────────────────────────────────────────────────────────

const BANKA_L1: Fakt[] = [
  {
    q: "Co je Antarktida?",
    key: "světadíl, tedy pevnina pokrytá silným ledovcem",
    d: [
      ["zamrzlá část oceánu, pod ledem žádná pevnina není", "Takhle vypadá Arktida kolem severního pólu: led tam plave na hluboké vodě. Na jihu je pod ledem skutečná pevnina s pohořími."],
      ["největší ostrov světa, který patří Dánsku", "Největší ostrov světa je Grónsko a leží na severní polokouli. Oblast kolem jižního pólu je samostatný světadíl a nepatří nikomu."],
      ["souostroví mnoha malých ostrovů bez souvislého ledu", "Malé ostrovy kolem pobřeží tam jsou, ale hlavní část je jedna obrovská souvislá pevnina pod ledovcem."],
    ],
    hints: [
      "Rozmysli si, co je pod ledem: voda, nebo kámen? Právě tím se obě polární oblasti liší.",
      "Nejdřív rozhodni, jestli je pod tamním ledem kámen, nebo voda, a teprve pak hledej mezi možnostmi. Podle toho, co je pod ledem, se oblast zařazuje.",
    ],
    explanation: "Antarktida je samostatný světadíl: pod ledem je skutečná pevnina s pohořími a údolími, na které leží pevninský ledovec. Arktida naopak žádnou souvislou pevninu pod ledem nemá — je to zamrzlá část oceánu.",
  },
  {
    q: "Kde leží Antarktida?",
    key: "kolem jižního pólu",
    d: [
      ["kolem severního pólu", "Kolem severního pólu leží Arktida. Obě polární oblasti se snadno zamění, rozhodni se podle polokoule."],
      ["kolem jižního obratníku", "Jižní obratník leží na 23,5° j. š., to je hranice tropického pásu. Ledový světadíl leží mnohem dál na jih."],
      ["kolem nultého poledníku", "Nultý poledník vede od pólu k pólu přes Evropu a Afriku. Polohu polární oblasti určuje zeměpisná šířka, ne délka."],
    ],
    hints: [
      "Ptej se, u kterého pólu ta oblast leží — tím se rozhodne skoro všechno ostatní.",
      "Celá ta oblast leží za polárním kruhem na té polokouli, kde je v prosinci léto. Polohu určuje zeměpisná šířka, ne délka.",
    ],
    explanation: "Antarktida se rozkládá kolem jižního pólu a téměř celá leží jižně od jižního polárního kruhu (66,5° j. š.). Proto je tam v prosinci a v lednu léto a polární den.",
  },
  {
    q: "Který oceán obtéká Antarktidu dokola?",
    key: "Jižní oceán",
    d: [
      ["Severní ledový oceán", "Severní ledový oceán obklopuje severní pól a Arktidu. Kolem jižního pólu je to jiný oceán."],
      ["Tichý oceán jako jediný", "Tichý oceán se ledového světadílu dotýká, ale jen z jedné strany. Dokola ho obtéká oceán, který se podle polohy jmenuje podle jihu."],
      ["Indický oceán jako jediný", "Indický oceán k ledovému světadílu přiléhá jen jednou částí. Vody kolem celého pobřeží se počítají jako samostatný oceán."],
    ],
    hints: [
      "Ten oceán se jmenuje podle strany světa, na které leží — stejně jako oceán kolem severního pólu.",
      "Vody kolem celého pobřeží se spojují do jednoho studeného oceánu. Jeho jméno najdeš tak, že řekneš, na které polokouli jsi. Někdy se mu říká i Antarktický oceán.",
    ],
    explanation: "Vody kolem celého antarktického pobřeží se dnes počítají jako samostatný Jižní (Antarktický) oceán. Severní ledový oceán je jeho protějšek na opačné straně Země — obklopuje Arktidu.",
  },
  {
    q: "Kdo na Antarktidě žije trvale?",
    key: "nikdo, jsou tam jen posádky vědeckých stanic",
    d: [
      ["původní obyvatelé, kteří loví na ledu", "Původní obyvatelé lovící na ledu žijí v Arktidě, například Inuité. Na jih se žádný národ nikdy nedostal."],
      ["chovatelé sobů, kteří putují za stády", "Se stády sobů putují pastevci v severské tundře. Kolem jižního pólu sobi nežijí a není tam co pást."],
      ["obyvatelé několika stálých měst na pobřeží", "Na pobřeží stojí vědecké stanice, ne města. Posádky se střídají a nikdo tam nezůstává natrvalo."],
    ],
    hints: [
      "Přemýšlej, z čeho by se tam dalo žít bez lodí a letadel, která vozí zásoby.",
      "Ledový světadíl nemá pole, lesy ani pastviny a na souši není co lovit. Lidé tam proto jen dočasně pracují a po čase se vystřídají.",
    ],
    explanation: "Na Antarktidě není žádné stálé obyvatelstvo. Pracují tam jen posádky vědeckých stanic, které se po několika měsících střídají a všechno jídlo i palivo si přivážejí.",
  },
  {
    q: "Co se skrývá pod antarktickým ledovcem?",
    key: "pevnina s pohořími a údolími",
    d: [
      ["hladina oceánu, led na ní jen plave", "Takhle je to v Arktidě: tam led plave na hluboké vodě. Na jihu ledovec leží na kameni."],
      ["vrstva sněhu až do velké hloubky, nic pevného", "Sníh se dole vlastní vahou mění v led, ale ten na něčem musí ležet. Pod ním je skutečný pevný podklad."],
      ["písek jako v poušti, protože je tam velké sucho", "Sucho tam opravdu je, ale poušť se pozná podle srážek, ne podle písku. Pod ledem je kámen, ne duny."],
    ],
    hints: [
      "Odpověď souvisí s tím, proč se Antarktida počítá mezi světadíly, a Arktida ne.",
      "Vědci pod ledem měřili radarem hory i údolí hluboko pod hladinou moře. Ledovec tedy na něčem pevném leží — a právě to z té oblasti dělá světadíl.",
    ],
    explanation: "Pod pevninským ledovcem je skutečná pevnina: pohoří, údolí i sopky. Ledovec leží na kameni, a proto je Antarktida světadíl. V Arktidě naopak led plave na oceánu.",
  },
  {
    q: "Jak silný je pevninský ledovec ve vnitrozemí Antarktidy?",
    key: "přes tři kilometry",
    d: [
      ["asi tři metry", "Metr až dva měří mořský led, který kolem Antarktidy každou zimu zamrzne na hladině. Ledovec na pevnině se vrství tisíce let, a je proto o celé řády mocnější."],
      ["necelých třicet metrů", "Třicet metrů je výška většího ledovcového čela. Vnitrozemský ledovec je ještě o dva řády mocnější."],
      ["asi tři sta metrů", "Několik set metrů měří horské ledovce v Alpách. Antarktický vnitrozemský led je proti nim mnohonásobně mocnější — měří se v kilometrech."],
    ],
    hints: [
      "Porovnej si tloušťku ledu s výškou hor — ledovec ve vnitrozemí je opravdu velmi mocný.",
      "Povrch vnitrozemí leží víc než dva tisíce metrů nad mořem, ale skála pod ním je u hladiny. Ten rozdíl vyplňuje samotný led, a tak se měří v kilometrech, ne v metrech.",
    ],
    explanation: "Ve vnitrozemí je pevninský ledovec silný přes tři kilometry. Právě proto je Antarktida v průměru nejvyšším světadílem — je to hlavně výška ledu, ne skály.",
  },
  {
    q: "Který světadíl je nejchladnější?",
    key: "Antarktida",
    d: [
      ["Arktida", "Arktida je opravdu studená, ale není to světadíl — je to zamrzlá část oceánu kolem severního pólu. A navíc je tam v průměru tepleji než na jihu."],
      ["Asie", "Na Sibiři jsou nejchladnější trvale obydlená místa světa, jenže Asie sahá až k rovníku — průměrem teplot proto nevyniká. Ledový světadíl je mnohem chladnější."],
      ["Severní Amerika", "Na Aljašce a v severní Kanadě je krutá zima, ale velká část světadílu leží v mírném a tropickém pásu."],
    ],
    hints: [
      "Hledej světadíl, který leží celý za polárním kruhem a ještě vysoko nad hladinou moře.",
      "Zima sílí dvěma způsoby: čím dál od rovníku a čím výš nad mořem. Jeden světadíl má obojí naráz, a proto nemá konkurenci.",
    ],
    explanation: "Antarktida je nejchladnější světadíl: leží celá kolem jižního pólu a její povrch je navíc kilometry vysoko, protože ho tvoří ledovec. Obojí dohromady teplotu sráží nejníž na Zemi.",
  },
  {
    q: "Který světadíl leží Antarktidě nejblíž?",
    key: "Jižní Amerika",
    d: [
      ["Austrálie", "Austrálie je od ledového světadílu vzdálená tisíce kilometrů otevřeného oceánu. Nejužší místo je jinde."],
      ["Afrika", "Afrika končí daleko na sever od polárního kruhu a mezi ní a ledem je široký úsek Jižního oceánu."],
      ["Asie", "Asie leží skoro celá na severní polokouli, k jižnímu pólu je to z ní tedy velmi daleko. Nejblíž ledovému světadílu sahá jiná pevnina."],
    ],
    hints: [
      "Ledový světadíl má jeden výběžek, který míří na sever k nejbližší pevnině.",
      "Severní výběžek ledového světadílu míří ke špičce jednoho světadílu a dělí je jen bouřlivý průliv široký zhruba tisíc kilometrů. Hledej pevninu, která sahá nejdál na jih.",
    ],
    explanation: "Nejblíž Antarktidě leží Jižní Amerika: její jižní špičku a Antarktický poloostrov dělí jen bouřlivý průliv. Právě tudy se do ledových vod nejčastěji pluje.",
  },
  {
    q: "Který světadíl leží v průměru nejvýš nad hladinou moře?",
    key: "Antarktida",
    d: [
      ["Asie", "V Asii je nejvyšší hora i nejvyšší velehorská plošina světa, ale zbytek světadílu je většinou nízký. Průměrem vede jiná oblast."],
      ["Jižní Amerika", "Andami vede přes celou Jižní Ameriku dlouhé velehorské pásmo, jenže vedle nich leží obrovské nížiny kolem Amazonky."],
      ["Afrika", "Afrika je z velké části vysoká plošina, průměrná výška je tam proto slušná. Nejvyšší průměr má ale světadíl, jehož povrch tvoří led."],
    ],
    hints: [
      "Nadmořskou výšku má i povrch ledovce, ne jen skála pod ním.",
      "Jeden světadíl je celý překrytý ledem silným kilometry. Jeho povrch tedy leží vysoko, i když skála pod ledem je mnohem níž.",
    ],
    explanation: "V průměru nejvýš leží Antarktida, protože její povrch netvoří skála, ale kilometry silný ledovec. Jinde se vysoké hory počítají s rozsáhlými nížinami, a průměr proto klesne.",
  },
  {
    q: "Který živočich žije ve volné přírodě na antarktickém pobřeží?",
    key: "tučňák císařský",
    d: [
      ["lední medvěd", "Lední medvěd žije jen na severu kolem Arktidy. S tučňáky se ve volné přírodě nikdy nepotká — dělí je celá Země."],
      ["mrož", "Mroži žijí v Severním ledovém oceánu a na arktickém pobřeží. Na jižní polokouli se nevyskytují."],
      ["polární liška", "Polární liška obývá tundru a arktické ostrovy na severu. Na ledový světadíl by se přes oceán nedostala."],
    ],
    hints: [
      "Rozděl si polární živočichy na severní a jižní — sever a jih mají úplně jiná zvířata.",
      "Na severu žijí velcí lovci srstnatých zvířat, na jihu ptáci, kteří neumí létat, ale výborně plavou. Ve volné přírodě se nikdy nesetkají.",
    ],
    explanation: "Na antarktickém pobřeží žijí tučňáci: kroužkový hnízdí v koloniích na plochách bez ledu, císařský vysedává vejce na mořském ledu přimrzlém k pobřeží. Odpočívají tam tuleni a v moři loví kosatky. Lední medvěd, mrož ani polární liška tam nežijí — ti patří do Arktidy.",
  },
  {
    q: "Co v Antarktidě roste?",
    key: "drobné mechy a lišejníky na skalách bez ledu",
    d: [
      ["jehličnaté lesy odolné proti mrazu", "Jehličnaté lesy rostou v tajze na severní polokouli. Za polárním kruhem u jižního pólu je na stromy příliš velký mráz a sucho."],
      ["tundra s trávou a nízkými keři", "Tundra s keři lemuje severní polární oblast. Na jihu chybí půda i teplo, a tak souvislá tundra nevzniká."],
      ["vůbec nic, ani ty nejmenší organismy", "Úplně bez života to není: na skalách bez ledu u pobřeží se drobné organismy udrží. Jen nic většího už nepřežije."],
    ],
    hints: [
      "Ptej se, kde je vůbec nezakrytá skála a aspoň na chvíli v roce trochu tepla.",
      "Skoro celý povrch kryje led, takže kořeny nemají kam. Zbývají jen malé plochy holé skály u pobřeží, a tam vydrží jen ty nejodolnější a nejmenší organismy.",
    ],
    explanation: "Antarktida nemá stromy ani keře. Na skalách bez ledu u pobřeží rostou mechy a lišejníky (lišejník je soužití houby a řasy); na nejteplejším Antarktickém poloostrově se udrží i dvě drobné kvetoucí rostliny, mimo jiné metlička antarktická. Souvislá tundra tam ale nevzniká a hlavní život je v moři.",
  },
  {
    q: "Komu podle Antarktické smlouvy Antarktida patří?",
    key: "žádnému státu, slouží jen mírovému výzkumu",
    d: [
      ["Austrálii, protože k ní leží nejblíž", "Nejblíž Antarktidě navíc neleží Austrálie, ale Jižní Amerika — a blízkost stejně nic nezakládá. Smlouva územní nároky zmrazila a žádný stát tam vlastníkem není."],
      ["státu, který si ji zabere jako první", "Zabrat území tam nelze. Právě proto smlouva vznikla — aby se o ledový světadíl státy nepřetahovaly."],
      ["zemi, která tam postavila nejvíc stanic", "Stanice tam má mnoho států, ale stanice vlastnictví území nezakládá. Všichni tam pracují podle společných pravidel."],
    ],
    hints: [
      "Ta smlouva vznikla právě proto, aby se o oblast nikdo nepřetahoval.",
      "Státy se dohodly, že území nikomu nepřiřknou a že se tam bude jen mírově bádat. Vojenská činnost je zakázaná a podle pozdějších dodatků i těžba nerostů.",
    ],
    explanation: "Podle Antarktické smlouvy nepatří Antarktida žádnému státu. Územní nároky jsou zmrazené, povolený je jen mírový vědecký výzkum a podle dodatků smlouvy je těžba nerostů zakázaná.",
  },
  {
    q: "Co je antarktická vědecká stanice?",
    key: "základna, kde vědci bydlí a pracují po určitou dobu",
    d: [
      ["město, ve kterém se lidé rodí a zůstávají natrvalo", "Žádné město tam není. Posádky se střídají a nikdo z nich tam nezůstává trvale."],
      ["pevnost, která hlídá hranice území svého státu", "Hranice se tam nehlídají — území nikomu nepatří a vojenská činnost je zakázaná."],
      ["továrna, která zpracovává vytěžené nerostné suroviny", "Těžba nerostů je v Antarktidě podle dodatků smlouvy zakázaná, a tak tam není co zpracovávat."],
    ],
    hints: [
      "Rozmysli si, co jediné je na tom světadíle podle smlouvy povolené.",
      "Povolený je jen mírový výzkum. Budovy tam tedy slouží lidem, kteří měří, pozorují a zkoumají, a po několika měsících odjedou.",
    ],
    explanation: "Vědecká stanice je základna s laboratořemi a ubytováním, kde posádka po určitou dobu bádá a pak se vystřídá. Města, pevnosti ani továrny tam podle Antarktické smlouvy být nesmějí.",
  },
  {
    q: "Kolik sladké vody na Zemi je uloženo v antarktickém ledovci?",
    key: "většina veškeré sladké vody světa",
    d: [
      ["méně, než je ve všech řekách dohromady", "Řeky drží jen nepatrný zlomek sladké vody. V ledovcích je jí nesrovnatelně víc."],
      ["žádná, protože led vznikl ze zmrzlé mořské vody", "Pevninský ledovec vznikl ze sněhu, a je proto sladký. Zamrzlá mořská voda je jen tenký led na hladině."],
      ["zhruba tolik, kolik drží ledovce v Alpách", "Horské ledovce v Alpách jsou proti tomu nepatrné. Rozdíl je v tisících kilometrů plochy i v kilometrech tloušťky."],
    ],
    hints: [
      "Sladká voda není jen v řekách a jezerech — největší zásoba je ve skupenství, na které se běžně nemyslí.",
      "Led z ledovce vznikl ze sněhu, takže je sladký. A tohoto ledu je tolik, že proti němu vypadají všechny řeky a jezera světa nepatrně.",
    ],
    explanation: "V antarktickém pevninském ledovci je uložena většina veškeré sladké vody na Zemi. Vznikl ze sněhu, takže je sladký, a jeho objem daleko převyšuje všechny řeky, jezera i ostatní ledovce.",
  },
  {
    q: "Jak se jmenuje led, který v Antarktidě leží na souši?",
    key: "pevninský ledovec",
    d: [
      ["mořský led", "Mořský led vzniká zamrznutím hladiny oceánu. Kolem Antarktidy je ho hodně, ale na souši neleží."],
      ["plovoucí kra", "Kra je kus ledu na vodě. Led na souši nepluje — leží vlastní vahou na skále."],
      ["firn (zrnitý sníh)", "Firn je zrnitý sníh, ze kterého se led teprve tvoří — sám o sobě ledovec ještě není. Hotový útvar na souši se jmenuje jinak."],
    ],
    hints: [
      "Rozlišuj led podle toho, na čem leží: na kameni, nebo na vodě.",
      "Zeptej se, na čem ten led spočívá, a odvoď název z toho, co je pod ním. Pomůže i to, jak vznikl: sníh se vrství a vlastní vahou se postupně mění v led.",
    ],
    explanation: "Led ležící na souši je pevninský ledovec — vzniká z nahromaděného sněhu a v Antarktidě je silný přes tři kilometry. Mořský led naopak zamrzá na hladině a měří jen metry.",
  },
  {
    q: "Který velký mořský dravec loví v antarktických vodách tuleně a tučňáky?",
    key: "kosatka",
    d: [
      ["tuleň Weddellův", "Tuleň Weddellův v antarktických vodách opravdu žije, ale loví ryby a olihně pod ledem. Sám bývá kořistí většího dravce."],
      ["albatros stěhovavý", "Albatros stěhovavý je velký mořský pták s obrovským rozpětím křídel. Sbírá však z hladiny olihně a ryby — na tuleně ani tučňáky nestačí."],
      ["krunýřovka (kril)", "Kril je drobný korýš dlouhý několik centimetrů. Sám je hlavní potravou velryb i tučňáků, žádného velkého živočicha neuloví."],
    ],
    hints: [
      "Hledej dravce, který loví přímo v moři a patří mezi savce žijící ve vodě.",
      "Rozděl si možnosti podle velikosti kořisti, kterou zvládnou. Největší lovec antarktických vod je kytovec, který loví ve smečce.",
    ],
    explanation: "V antarktických vodách loví kosatka — kytovec, který ve smečce pronásleduje tuleně i tučňáky. Ostatní uvedení živočichové tam také žijí, ale tak velkou kořist neloví: tuleň Weddellův a albatros berou ryby a olihně, kril se živí planktonem.",
  },
];

const faktL1 = (): PracticeTask | null => fakt(pick(BANKA_L1));

// ── L2a: souřadnice → polární oblast, nebo mírný pás ───────────────────────

/**
 * Klíč pojmenovává OBLAST, ne povrch: bod za polárním kruhem může padnout na
 * led, na skálu i na moře (např. 70° j. š., 166° z. d. je Amundsenovo moře).
 * Proto „polární oblast“, ne „v Antarktidě“ / „v Arktidě“.
 */
const OBL_ANT = "v jižní polární oblasti";
const OBL_ARK = "v severní polární oblasti";
const OBL_MIR_J = "v mírném pásu jižní polokoule";
const OBL_MIR_S = "v mírném pásu severní polokoule";

// Souřadnice končí zkratkou s tečkou („19° v. d.“), takže za ní nesmí následovat
// další tečka — věty se proto oddělují pomlčkou.
const UVODY = [
  (s: string, d: string) => `Čteš souřadnice kdekoli na Zemi, nejen v Antarktidě. Místo má souřadnice ${s}, ${d} — ve které oblasti leží?`,
  (s: string, d: string) => `Souřadnice nemusí patřit Antarktidě. Určuješ polohu bodu ${s}, ${d} — ve které oblasti se nachází?`,
  (s: string, d: string) => `Bod může ležet kdekoli na Zemi. Zápis polohy zní ${s}, ${d} — ve které oblasti je to místo?`,
];

/**
 * Souřadnicová linka: písmena za šířkou určí polokouli, |šířka| vs. 66,5°
 * rozhodne o polární oblasti. Zeměpisná délka je vždy jen rušivý údaj.
 *
 * Polokouli a pás předává volající (`gen`), ne náhoda uvnitř: v tématu
 * o Antarktidě musí v sezení převažovat jižní šířka, jinak žák pod nadpisem
 * „Antarktida“ řeší dvě severní souřadnice po sobě a o poloze Antarktidy
 * nerozhodne ani jednou.
 *
 * Nepolární rozsah je 42–58°, aby šlo skutečně o mírný pás: pod 42° začínají
 * subtropy a nad 58° subpolární pás pětipásového dělení — obojí se v 6. ročníku
 * odlišuje, takže hraniční hodnoty by neměly jednoznačný klíč.
 */
function souradnice(jih: boolean, polarni: boolean): PracticeTask | null {
  const st = polarni ? rnd(68, 88) : rnd(42, 58);
  const vychod = Math.random() < 0.5;
  const dl = rnd(5, 170) * (vychod ? 1 : -1);
  const sTxt = sirka(jih ? -st : st);
  const dTxt = delka(dl);
  const stC = cis(st);
  const kruh = cis(66.5);

  const key = polarni ? (jih ? OBL_ANT : OBL_ARK) : jih ? OBL_MIR_J : OBL_MIR_S;
  const polokouleTxt = jih ? "j. š., tedy jižní šířka" : "s. š., tedy severní šířka";
  const spravnaPol = jih ? "jižní" : "severní";
  const opacnaPol = jih ? "severní" : "jižní";

  // protějšek na správné polokouli, ale ve špatném pásu
  const spatnyPas = polarni ? (jih ? OBL_MIR_J : OBL_MIR_S) : jih ? OBL_ANT : OBL_ARK;
  // protějšek ve správném pásu, ale na špatné polokouli
  const spatnaPolokoule = polarni ? (jih ? OBL_ARK : OBL_ANT) : jih ? OBL_MIR_S : OBL_MIR_J;
  // obě chyby naráz
  const obojiSpatne = polarni ? (jih ? OBL_MIR_S : OBL_MIR_J) : jih ? OBL_ARK : OBL_ANT;

  const pasChyba = polarni
    ? `Polokouli máš správně, ale ${stC}° je víc než ${kruh}°, takže místo leží až za ${spravnaPol}m polárním kruhem.`
    : `Polokouli máš správně, ale ${stC}° je míň než ${kruh}°, takže místo do polární oblasti nesahá — leží v mírném pásu.`;
  const polChyba = `Za číslem je ${polokouleTxt} — místo je na ${spravnaPol} polokouli, ne na ${opacnaPol}.`;
  const obeChyby = `Tady jsou obě chyby naráz: ${polokouleTxt}, a navíc ${stC}° je ${polarni ? "víc" : "míň"} než ${kruh}°.`;
  // Dovětek spojí pojem „polární oblast“ s názvem, který žák zná z ostatních úloh.
  const coToJe = !polarni
    ? ""
    : jih
      ? " Jižní polární oblast tvoří Antarktida a moře kolem ní."
      : " Severní polární oblast tvoří Arktida, tedy zamrzlý oceán a okolní souše.";

  return hlidej(
    choice(
      pick(UVODY)(sTxt, dTxt),
      key,
      [
        { value: spatnyPas, why: pasChyba },
        { value: spatnaPolokoule, why: polChyba },
        { value: obojiSpatne, why: obeChyby },
      ],
      {
        hints: polarni
          ? [
              `Písmena za číslem ti řeknou polokouli; ${stC}° je vysoké číslo, tak se podívej, jestli už přesáhlo polární kruh.`,
              `Zeměpisná délka o pásu nerozhoduje, ta určuje jen východ a západ. Podstatná je šířka: ${stC}° porovnej s ${kruh}° a podle písmen dopočti, u kterého pólu jsi.`,
            ]
          : [
              "Nejdřív urči polokouli podle písmen za číslem, teprve potom porovnávej velikost šířky.",
              `Zeměpisná délka o pásu nerozhoduje, ta určuje jen východ a západ. Podstatná je šířka: hranice polární oblasti je ${kruh}°, a tady ji šířka nepřekročila — zbývá tedy pás mezi tropy a polární oblastí.`,
            ],
        explanation: `Písmena za číslem určují polokouli (${polokouleTxt}) a hodnota šířky pás: hranice polární oblasti je polární kruh na ${kruh}°. Tady je ${stC}° ${polarni ? `víc než ${kruh}°, místo tedy leží za ${spravnaPol}m polárním kruhem` : `míň než ${kruh}°, místo tedy do polární oblasti nesahá`}. Zeměpisná délka ${dTxt} je jen doplňující údaj.${coToJe}`,
        solutionSteps: [
          `Písmena za číslem: ${sTxt} → ${spravnaPol} polokoule.`,
          `Porovnej velikost šířky s polárním kruhem: ${stC}° a ${kruh}° → ${stC}° je ${polarni ? "větší" : "menší"}.`,
          polarni
            ? `Šířka větší než ${kruh}° znamená polární oblast — u jižního pólu jižní, u severního severní; délka ${dTxt} na tom nic nemění.`
            : `Šířka menší než ${kruh}° znamená, že místo do polární oblasti nesahá — leží v mírném pásu ${spravnaPol} polokoule; délka ${dTxt} na tom nic nemění.`,
        ],
      },
    ),
  );
}

// ── L2b: použití pravidla (sklon osy, podnebí → život) ─────────────────────

const BANKA_L2: Fakt[] = [
  {
    q: "Na stanici hluboko v Antarktidě svítí Slunce celý leden ve dne i v noci. Čím je to dané?",
    key: "Jižní polokoule je nakloněná ke Slunci a hluboko za polárním kruhem Slunce nezapadá.",
    d: [
      ["Země je v lednu ke Slunci nejblíž, a proto tam Slunce vůbec nezapadá.", "Země je v lednu opravdu Slunci nejblíž — a přesto je u nás zima. Délku dne to tedy nezpůsobuje, rozhoduje sklon zemské osy."],
      ["Led odráží tolik světla, že je od něj v noci vidět jako ve dne.", "Led odráží sluneční paprsky, ale jen když nějaké dopadají. Kdyby Slunce zapadlo, byla by tma."],
      ["Stanice leží blízko rovníku, kde je den stejně dlouhý po celý rok.", "Stanice ale u rovníku neleží, je až za polárním kruhem. A na rovníku trvá den dvanáct hodin, ne celých čtyřiadvacet."],
    ],
    hints: [
      "Připomeň si, co na Zemi způsobuje střídání ročních dob, a přenes to na opačnou polokouli.",
      "Roční doby nedělá vzdálenost od Slunce, ale sklon zemské osy. Rozhodni nejdřív, která polokoule je v lednu ke Slunci přivrácená, a teprve potom, co to udělá s délkou dne blízko pólu.",
    ],
    explanation: "V lednu je ke Slunci nakloněná jižní polokoule, takže tam vrcholí léto. Za jižním polárním kruhem se přitom Slunce drží nad obzorem po celý den i noc — to je polární den. Čím blíž k pólu, tím déle trvá: přímo na polárním kruhu jen kolem jediného dne v prosinci, hluboko ve vnitrozemí celé týdny i měsíce.",
  },
  {
    q: "Proč se posádky antarktických stanic střídají hlavně v prosinci a v lednu?",
    key: "V té době je tam jižní léto: nejtepleji a světlo po celý den.",
    d: [
      ["V té době je tam polární noc, a tak se na stanici lépe spí.", "Polární noc je na jihu kolem června a července, ne v prosinci. A tma cestu i práci naopak znesnadňuje."],
      ["Jen tehdy moře kolem pobřeží zamrzne a náklad dojede po ledu.", "Zásoby vozí lodě a letadla, ne cesty po mořském ledu. V jižním létě led kolem pobřeží naopak ustupuje a loď dopluje blíž."],
      ["Roční doba to neovlivňuje, termín určuje jen dohoda států.", "Rozhodují přírodní podmínky. V jižní zimě je tma a krutý mráz, takže se tam tehdy skoro nedá přistát."],
    ],
    hints: [
      "Přenes naše roční doby na opačnou polokouli a mysli na to, kdy je cesta nejschůdnější.",
      "Naše zimní měsíce jsou na jihu léto. Tehdy tam bývá nejmírnější mráz, moře je nejpřístupnější a Slunce svítí i v noci.",
    ],
    explanation: "Prosinec a leden je na jižní polokouli léto. Tehdy je nejmírnější mráz, pobřeží je nejlépe dostupné pro lodě i letadla a díky polárnímu dni je stále světlo — proto se posádky střídají právě tehdy.",
  },
  {
    q: "Proč je na antarktické stanici nejtepleji v lednu a nejchladněji v červenci?",
    key: "Leží na jižní polokouli, která je ke Slunci nakloněná v době naší zimy.",
    d: [
      ["V červenci je Země od Slunce nejdál, a proto tam tehdy mrzne nejvíc.", "Země je v červenci opravdu od Slunce nejdál — a u nás je přitom léto. Roční doby tedy nedělá vzdálenost, ale sklon zemské osy."],
      ["Je tam takové sucho, že se tam teplo drží v jinou roční dobu než u nás.", "Srážky ani sucho roční doby neposouvají. Rozhoduje, kdy je daná polokoule ke Slunci nakloněná."],
      ["Sníh v lednu roztaje a odkrytá půda se na slunci rychle ohřeje.", "Led ve vnitrozemí neroztává ani v létě a žádná půda se tam neodkryje — teplota tam zůstává hluboko pod nulou po celý rok. Nad nulu vystoupí jen na pobřeží a na Antarktickém poloostrově."],
    ],
    hints: [
      "Rozhoduje, která polokoule je právě nakloněná ke Slunci — a ta se během roku střídá.",
      "Obě polokoule mají roční doby posunuté o půl roku: když je ke Slunci nakloněná jedna, druhá je od něj odkloněná. Naše zimní měsíce jsou proto na opačné straně Země těmi nejteplejšími.",
    ],
    explanation: "Roční doby způsobuje sklon zemské osy. V lednu je ke Slunci nakloněná jižní polokoule, takže je tam léto, a v červenci je odkloněná, takže je tam zima. Oproti nám je to posunuté o půl roku.",
  },
  {
    q: "Na stanici daleko ve vnitrozemí Antarktidy nevyjde Slunce od května do srpna. Čím je to dané?",
    key: "Jižní polokoule je od Slunce odkloněná a hluboko za polárním kruhem Slunce nevychází.",
    d: [
      ["V té době Země na několik týdnů přeruší svůj oběh kolem Slunce.", "Země obíhá neustále a nikdy se nezastaví. Střídání světla a tmy na pólu způsobuje sklon zemské osy, ne přerušený oběh."],
      ["Mraky nad vnitrozemím jsou tak husté, že sluneční světlo nepropustí.", "Nad vnitrozemím je naopak velmi jasno, protože je tam nejsušší podnebí na světě. Slunce prostě nevystoupí nad obzor."],
      ["Slunce svítí jen na obydlené části Země, a tam nikdo trvale nežije.", "Slunce osvětluje vždy celou přivrácenou polovinu Země bez ohledu na lidi. Rozhoduje naklonění osy, ne osídlení."],
    ],
    hints: [
      "Je to obrácená situace než polární den — mysli na to, která polokoule je v našem létě ke Slunci nakloněná.",
      "V našich letních měsících je ke Slunci nakloněná severní polokoule — rozmysli si nejdřív, jak je na tom tehdy jih. A teprve potom, co to znamená pro místo blízko pólu.",
    ],
    explanation: "Od května do srpna je ke Slunci nakloněná severní polokoule. Jižní je odkloněná, a tak hluboko za jižním polárním kruhem Slunce po celé týdny vůbec nevystoupí nad obzor — je tam polární noc. Čím blíž k pólu, tím déle noc trvá.",
  },
  {
    q: "Proč v Antarktidě nerostou stromy?",
    key: "Mráz po většinu roku, sucho a led místo půdy jim růst nedovolí.",
    d: [
      ["Chybí tam sluneční světlo po celý rok, a tak nemají z čeho růst.", "Světla je tam v létě naopak víc než u nás — Slunce několik týdnů vůbec nezapadá. Chybí teplo a půda, ne světlo."],
      ["Vítr by jim odvál semena, jinak by tam stromy vyrostly.", "Vítr tam opravdu fouká silně, ale hlavní překážkou je trvalý mráz a led, pod kterým nejsou kořeny kam zapustit."],
      ["Stromy tam rostou, jen jsou celé schované pod sněhem.", "Pod sněhem by strom nepřežil ani jedno léto. Na skalách bez ledu se udrží jen mechy a lišejníky."],
    ],
    hints: [
      "Projdi si, co strom potřebuje: teplo, vodu v kapalném stavu a půdu pro kořeny.",
      "Projdi si ty podmínky jednu po druhé: kolik je tam za rok tepla, v jakém skupenství je většinu času voda a co pokrývá povrch tam, kde by kořeny potřebovaly půdu. Teprve pak rozhodni, jestli je některá z nich pro strom splněná.",
    ],
    explanation: "Stromu chybí v Antarktidě všechno podstatné: teplo (na většině světadílu zůstává teplota pod nulou i v létě, jen na pobřeží a na Antarktickém poloostrově krátce vystoupí nad ni), kapalná voda a půda, protože povrch kryje ledovec. Udrží se tam jen mechy a lišejníky na holých skalách.",
  },
  {
    q: "Proč se skoro všechen antarktický život drží u pobřeží a v moři?",
    key: "Moře je teplejší než vnitrozemí a je v něm dost potravy.",
    d: [
      ["Ve vnitrozemí je mokro a bahno, zvířata by se tam bořila.", "Vnitrozemí je ledová poušť — suché a mrazivé místo pod kilometry ledu. Žádné bahno tam není."],
      ["Zvířata u pobřeží čekají, až jim potravu přiveze loď ze stanice.", "Krmit antarktická zvířata je zakázané. Potravu si loví sama v moři, a proto se od něj nevzdalují."],
      ["Do vnitrozemí je zvířatům vstup zakázaný podle smlouvy.", "Smlouva omezuje činnost lidí, ne pohyb zvířat. Vnitrozemí je pro ně nehostinné samo o sobě."],
    ],
    hints: [
      "Ptej se, kde je pro živočichy potrava a kde jsou mírnější teploty.",
      "Vnitrozemí je vysoko položená ledová poušť bez potravy. Oceán naopak nikdy neklesne pod bod mrazu mořské vody a žije v něm obrovské množství drobných korýšů a ryb.",
    ],
    explanation: "Vnitrozemí je vysoká ledová poušť bez potravy. V moři je naopak teplota stálá a plno krilu a ryb, a proto se tučňáci, tuleni i kosatky drží u pobřeží a ve vodě.",
  },
  {
    q: "Proč se vnitrozemí Antarktidy označuje jako ledová poušť, když je tam tolik ledu?",
    key: "Spadne tam méně srážek než v mnoha pouštích, led se jen po tisíce let vrství.",
    d: [
      ["Padá tam nejvíc srážek na celém světě, jen okamžitě zmrznou na led.", "Tohle je nejčastější omyl: hodně ledu neznamená hodně srážek. Ten led se hromadil tisíce let z mála sněhu."],
      ["Pod ledem je opravdová písečná poušť s dunami jako na Sahaře.", "Pod ledem je kámen, ne duny. Poušť se navíc určuje podle srážek, ne podle písku."],
      ["Poušť se tomu říká jen proto, že tam nikdo trvale nebydlí.", "Poušť není podle lidí, ale podle srážek. I obydlené kraje mohou mít srážek dost a pusté kraje naopak málo."],
    ],
    hints: [
      "Poušť se určuje podle srážek za rok, ne podle teploty ani podle toho, co na povrchu leží.",
      "Poušť se pozná podle množství srážek za rok. Porovnej tedy dvě různé věci: kolik sněhu tam za jediný rok opravdu napadne a za jak dlouhou dobu se ten led nashromáždil.",
    ],
    explanation: "Ledová poušť znamená území s nepatrnými srážkami. Ve vnitrozemí Antarktidy spadne méně srážek než v mnoha pouštích — led je tam jen proto, že to málo sněhu, které spadne, nikdy neroztaje a vrství se po tisíce let.",
  },
  {
    q: "Proč ve vnitrozemí Antarktidy neroztaje led ani v létě, když tam Slunce nezapadá?",
    key: "Teplota tam zůstává i uprostřed léta hluboko pod bodem mrazu.",
    d: [
      ["Slunce v létě nad vnitrozemím vůbec nevyjde.", "V létě je to obráceně: za polárním kruhem Slunce po celé týdny nezapadá. Chybí tam teplo, ne světlo."],
      ["Led je slaný, a proto taje až při mnohem vyšší teplotě.", "Ledovec vznikl ze sněhu, takže je sladký. A sůl bod tání naopak snižuje, nezvyšuje."],
      ["Ledovec je pořád doplňovaný vydatným deštěm, který ihned zmrzne.", "Srážek je tam ze všech světadílů nejmíň a padají jako sníh. Led vydrží proto, že netaje, ne proto, že se rychle doplňuje."],
    ],
    hints: [
      "Rozliš dvě různé věci: kolik je tam světla a jak je tam teplo.",
      "Tát začne led až nad nulou, samotné svícení nestačí. Rozmysli si proto, pod jakým úhlem tam paprsky dopadají a kolik jich bílý povrch odrazí zpátky — a z toho odvoď, jak vysoko teplota vůbec vystoupí.",
    ],
    explanation: "Tání potřebuje teplotu nad nulou, ne jen světlo. Paprsky dopadají u pólu velmi šikmo a od bílého ledu se z velké části odrážejí, takže ve vnitrozemí zůstává i v létě hluboko pod bodem mrazu. Jen na pobřeží a na Antarktickém poloostrově teplota v létě krátce vystoupí nad nulu a povrch tam taje.",
  },
];

const faktL2 = (): PracticeTask | null => fakt(pick(BANKA_L2));

// ── L3: analýza a přenos ───────────────────────────────────────────────────

const BANKA_L3: Fakt[] = [
  {
    q: "Popis oblasti: rozlehlá souš s pohořími, na nichž leží ledovec silný několik kilometrů, u pobřeží hnízdí kolonie tučňáků. O kterou oblast jde a proč?",
    key: "Antarktida — led leží na souši a tučňáci hnízdí jen na jižní polokouli.",
    d: [
      ["Arktida — i tam je souvislý led a na pobřeží hnízdí mořští ptáci.", "V Arktidě led plave na oceánu a souvislá souš pod ním není. Tučňáci tam navíc nežijí vůbec."],
      ["Grónsko — největší ostrov světa, také pokrytý mocným pevninským ledovcem.", "Grónsko opravdu pevninský ledovec má, ale je to ostrov u Severní Ameriky. Tučňáci na severní polokouli nehnízdí."],
      ["Sibiř — nejchladnější obydlená oblast s tundrou a věčně zmrzlou půdou.", "Sibiř je část Asie: má tundru a tajgu, ne kilometry silný ledovec, a je trvale obydlená."],
    ],
    hints: [
      "Vem si z popisu dva rozhodující znaky: na čem led leží a jaký živočich tam hnízdí.",
      "Led na souši vylučuje zamrzlý oceán u severního pólu. A pták, který neumí létat, ale výborně plave, se ve volné přírodě vyskytuje jen na jedné polokouli — tím je to jednoznačné.",
    ],
    explanation: "Rozhodují dva znaky. Led leží na souši, takže nejde o zamrzlý oceán, a kolonie tučňáků znamenají jižní polokouli. Popis proto odpovídá Antarktidě, ne Arktidě ani Grónsku.",
  },
  {
    q: "Popis oblasti: souvislá vrstva ledu plave na hluboké vodě, v létě praská na kry a velká šelma loví u díry v ledu. O kterou oblast jde a proč?",
    key: "Arktida — led plave na oceánu a lovící šelma žije jen na severu.",
    d: [
      ["Antarktida — také tam je souvislý led a loví tam velké šelmy.", "V Antarktidě leží led na pevnině a suchozemské šelmy tam nežijí žádné. Lovcem je tam kosatka, a ta loví v moři, ne u díry v ledu."],
      ["Austrálie — nejsušší obydlený světadíl s velkými pouštěmi.", "Austrálie leží z velké části v tropickém a mírném pásu a led na moři se u ní netvoří."],
      ["Jižní oceán — moře, které dokola obtéká ledový světadíl na jihu.", "Jižní oceán kolem pobřeží opravdu zamrzá, ale nežije tam žádná velká suchozemská šelma, která by číhala u průduchu v ledu — tu najdeš jen na severu."],
    ],
    hints: [
      "Zaměř se na to, co je pod ledem, a na to, jaký živočich tam loví.",
      "Led plovoucí na hluboké vodě vylučuje světadíl. A velká suchozemská šelma, která loví tuleně u průduchů v ledu, žije jen kolem jednoho z pólů.",
    ],
    explanation: "Led plovoucí na oceánu a lední medvěd lovící u průduchu jsou znaky Arktidy. V Antarktidě leží led na pevnině a žádná velká suchozemská šelma tam nežije.",
  },
  {
    q: "Popis oblasti: pod kilometry ledu leží pohoří i sopky, k nejbližšímu jinému světadílu se pluje přes bouřlivý průliv, nikdo tam nebydlí trvale. O kterou oblast jde a proč?",
    key: "Antarktida — je to pevnina pod ledovcem a bez stálých obyvatel.",
    d: [
      ["Arktida — také leží za polárním kruhem a není trvale obydlená.", "V Arktidě žijí původní obyvatelé už po staletí a pod ledem je oceán, ne pohoří se sopkami."],
      ["Grónsko — ostrov pod ledovcem, k němuž se pluje přes chladné moře.", "Grónsko má sice ledovec, ale má i stálé obyvatele a města, takže druhý znak nesedí."],
      ["Island — ostrov se sopkami a ledovci uprostřed studeného oceánu.", "Island má sopky i ledovce, jenže je trvale obydlený a led tam nepokrývá zdaleka celé území."],
    ],
    hints: [
      "Hledej oblast, která splní oba znaky naráz: pevninu pod ledem a nepřítomnost stálých obyvatel.",
      "Sopky a pohoří pod ledem vylučují zamrzlý oceán. A žádné trvalé osídlení vylučuje ostrovy, kde lidé žijí po staletí — zbude jediné místo na Zemi.",
    ],
    explanation: "Oba znaky platí naráz jen pro Antarktidu: pod ledovcem je skutečná pevnina s pohořími i sopkami a jako jediné velké území na Zemi nemá stálé obyvatelstvo.",
  },
  {
    q: "Popis oblasti: led plave na moři, kolem žijí mroži a lidé, kteří tam loví už po staletí, a v červnu tam Slunce nezapadá. O kterou oblast jde a proč?",
    key: "Arktida — v červnu je polární den na severu a mroži žijí jen tam.",
    d: [
      ["Antarktida — v červnu tam také Slunce nezapadá a žijí tam mořští savci.", "V Antarktidě je v červnu naopak polární noc a nikdo tam neloví po staletí. Mroži na jižní polokouli nežijí."],
      ["Jižní oceán — moře kolem ledového světadílu, kde žijí tuleni a kosatky.", "V Jižním oceánu mroži nežijí a nikdo kolem něj po staletí neloví. Polární den tam navíc připadá na prosinec a leden."],
      ["Sahara — největší horká poušť světa, kde kočovníci žijí už po staletí.", "Sahara leží v severní Africe, v tropickém a subtropickém pásu. Moře, led ani polární den tam nenajdeš."],
    ],
    hints: [
      "Spoj dva znaky: kdy je v té oblasti nepřetržitý den a jací živočichové tam žijí.",
      "Polární den v červnu ukazuje na polokouli, která je tehdy nakloněná ke Slunci. Přidej k tomu mrože a dlouhodobé osídlení a zbude jediná oblast.",
    ],
    explanation: "Polární den v červnu patří severní polokouli, mroži žijí jen tam a původní obyvatelé tam loví po staletí. Popis tedy odpovídá Arktidě — u jižního pólu je v červnu polární noc a nikdo tam trvale nežije.",
  },
  {
    q: "Proč tání antarktického pevninského ledovce zvedá hladinu moří, kdežto tání mořského ledu v Arktidě skoro ne?",
    key: "Voda ze souše do moře teprve přibude, kdežto plovoucí led v něm místo už zabírá.",
    d: [
      ["Antarktického ledu je mnohem víc než arktického, žádný jiný rozdíl v tom není.", "Množství samo nerozhoduje. I malý ledovec na souši hladinu zvedne, kdežto obrovská plocha plovoucího ledu skoro ne."],
      ["Antarktický led je sladký a sladká voda zabírá v moři mnohem víc místa než slaná.", "Rozdíl v objemu sladké a slané vody je nepatrný. Rozhoduje, odkud se voda do moře dostane."],
      ["Arktický mořský led netaje, protože je na severu podstatně chladněji.", "Arktický mořský led v létě ubývá a je ho čím dál míň. Hladinu ale nezvedá, protože už v moři plave."],
    ],
    hints: [
      "Porovnej, kde ten led leží, než roztaje — a jestli už tím vytlačuje vodu.",
      "Plovoucí těleso vytlačí přesně tolik vody, kolik váží. Když roztaje, zaujme právě ten vytlačený objem. Led ležící na souši ale do moře zatím vůbec nepatří.",
    ],
    explanation: "Plovoucí led už vodu vytlačuje, a tak po roztátí objem moře prakticky nezmění. Led ležící na pevnině naopak v moři zatím není — když roztaje, voda do oceánu přiteče navíc a hladina stoupne.",
  },
  {
    q: "Proč vědci vyvrtávají z antarktického ledovce hluboká jádra a rozebírají jejich vrstvy?",
    key: "Ve vrstvách je zapsané podnebí i složení vzduchu z dávné minulosti.",
    d: [
      ["Hledají v nich zamrzlé nerostné suroviny, které by se daly někdy vytěžit.", "Těžba nerostů je v Antarktidě zakázaná Antarktickou smlouvou. Jádra slouží výzkumu, ne surovinám."],
      ["Chtějí zjistit, jestli je pod ledem pevnina, nebo hluboký oceán.", "Co je pod ledem, se dnes měří radarem z letadla. Kvůli tomu by se vrstvy ledu nerozebíraly."],
      ["Získávají tak pitnou vodu pro celou posádku výzkumné stanice.", "Vodu si stanice vyrábí tavením sněhu z povrchu. Hluboký vrt by na to byl zbytečně náročný."],
    ],
    hints: [
      "Uvědom si, jak ledovec vzniká: co se v něm ukládá každý rok a co v něm zůstane uzavřené.",
      "Každý rok přibude nová vrstva sněhu a v ní zůstanou uzavřené bublinky vzduchu. Vrstvy se pak čtou odshora dolů jako letokruhy stromu.",
    ],
    explanation: "Ledovec se vrství rok za rokem a v každé vrstvě zůstanou uzavřené bublinky tehdejšího vzduchu. Z hlubokých jader se proto dá číst podnebí i složení atmosféry stovky tisíc let nazpět.",
  },
  {
    q: "Proč se z antarktických stanic odváží odpad zpět do domovských zemí?",
    key: "V trvalém mrazu se nic nerozloží a smlouva tamní přírodu chrání.",
    d: [
      ["Odvoz je jen zvyk, odpad by se dal stejně dobře zakopat do ledu.", "Zakopaný odpad nikam nezmizí: v trvalém mrazu se nerozloží a zůstane v ledu po staletí. Chráněný je navíc celý světadíl, ne jen to, co je vidět na povrchu."],
      ["V ledu by odpad shnil už během jediného léta a zapáchal by.", "V trvalém mrazu se rozklad téměř zastaví — právě proto by odpad zůstal na místě po staletí."],
      ["Ve vnitrozemí není kam odpad uložit, na pobřeží by to nikomu nevadilo.", "Chráněný je celý světadíl včetně pobřeží a okolního moře, ne jen vnitrozemí."],
    ],
    hints: [
      "Přemýšlej, jak rychle se v mrazu rozkládá to, co po lidech zůstane.",
      "Rozklad potřebuje teplo a vodu. Tam, kde je trvale hluboko pod nulou, se skoro zastaví — cokoli se odloží, zůstane na místě po staletí.",
    ],
    explanation: "V trvalém mrazu se odpad prakticky nerozkládá a zůstal by tam po staletí. Antarktická smlouva a její dodatky proto ukládají odvézt všechno zpátky, aby světadíl zůstal nedotčený.",
  },
  {
    q: "Stát oznámí, že chce na Antarktidě otevřít důl na uhlí. Co z Antarktické smlouvy plyne?",
    key: "Těžba nerostů je tam zakázaná, důl otevřít nesmí.",
    d: [
      ["Zabrat si území a těžit smí ten stát, který tam přijde první.", "Zabírat území tam nelze — smlouva územní nároky zmrazila právě proto, aby se o světadíl nikdo nepřetahoval."],
      ["Těžit smí, pokud se o zisk podělí s ostatními státy.", "Dělení zisku na věci nic nemění. Těžba nerostů je zakázaná všem bez výjimky."],
      ["Těžit může, protože Antarktida nepatří žádnému státu.", "To, že území nikomu nepatří, neznamená volnou ruku. Právě proto se státy dohodly na společných pravidlech."],
    ],
    hints: [
      "Uvědom si, k čemu jedinému ta smlouva ledový světadíl vyhradila.",
      "Smlouva vyhradila celý světadíl mírovému vědeckému výzkumu. Z toho plyne, co tam naopak nemá místo: vojenská činnost a hospodářské využívání nerostného bohatství.",
    ],
    explanation: "Antarktická smlouva a její dodatky vyhrazují celý světadíl mírovému výzkumu a těžbu nerostných surovin zakazují. Na tom nic nemění ani to, že území nikomu nepatří — právě proto společná pravidla vznikla.",
  },
  {
    q: "Stát chce v Antarktidě postavit vojenskou základnu s vojáky a zbraněmi. Co z Antarktické smlouvy plyne?",
    key: "Vojenská činnost je tam zakázaná, základna vzniknout nesmí.",
    d: [
      ["Postavit ji smí, pokud u ní bude stát i vědecká stanice.", "Vědecká stanice vojenskou základnu neospravedlní. Smlouva vojenskou činnost zakazuje bez ohledu na to, co stojí vedle."],
      ["Postavit ji smí stát, jehož území leží Antarktidě nejblíž.", "Blízkost nezakládá žádné právo. Územní nároky jsou zmrazené a platí stejná pravidla pro všechny."],
      ["Základnu smí postavit kterýkoli stát, protože území nikomu nepatří.", "Z toho, že území nikomu nepatří, plyne pravý opak: platí tam společná pravidla, a ta vojenskou činnost zakazují."],
    ],
    hints: [
      "Ta smlouva vznikla v době napětí mezi velmocemi — rozmysli si, čemu chtěla především zabránit.",
      "Státy se dohodly, že ledový světadíl zůstane vyhrazený mírovému bádání. Vše, co s bojem a zbraněmi souvisí, je proto vyloučené.",
    ],
    explanation: "Antarktická smlouva zakazuje veškerou vojenskou činnost — základny, manévry i zkoušky zbraní. Světadíl je vyhrazený mírovému vědeckému výzkumu a otevřený vzájemným kontrolám.",
  },
  {
    q: "Turistická loď chce u kolonie tučňáků vysadit skupinu návštěvníků, kteří je budou krmit. Co je na tom podle pravidel ochrany Antarktidy špatně?",
    key: "Krmit a rušit zvířata je zakázané, příroda má zůstat nedotčená.",
    d: [
      ["Není na tom nic špatně, ptáci by se jinak zdaleka tak dobře nenajedli.", "Potravu si loví sami v moři a lidská strava jim škodí. Krmení navíc mění jejich chování."],
      ["Špatně je jen to, že loď připlula v jižním létě.", "V jižním létě je pobřeží dostupné a návštěvy se konají právě tehdy. Závadné je zacházení se zvířaty, ne termín."],
      ["Návštěvníci na Antarktidu vůbec nesmějí, ani se jen dívat.", "Navštívit ji lze, ale za přísných pravidel: dodržovat odstup, nic tam nenechat a zvířata nekrmit."],
    ],
    hints: [
      "Ptej se, co pravidla chrání především — pohodlí lidí, nebo původní stav přírody.",
      "Smyslem ochrany je nechat tamní přírodu tak, jak je. Zvířata si potravu obstarávají sama a jakýkoli zásah člověka jim mění chování i zdraví.",
    ],
    explanation: "Pravidla ochrany Antarktidy zakazují zvířata krmit, dotýkat se jich a rušit je. Návštěva je možná, ale musí po sobě nenechat žádnou stopu — jinak by světadíl přestal být nedotčený.",
  },
  {
    q: "Zpráva tvrdí, že vědci našli na antarktickém pobřeží uhynulého ledního medvěda. Proč je taková zpráva podezřelá?",
    key: "Lední medvědi žijí jen kolem severního pólu, na jihu se nevyskytují.",
    d: [
      ["Není na tom nic divného, lední medvědi doplavou postupně k oběma pólům.", "Mezi oběma polárními oblastmi jsou tisíce kilometrů teplého oceánu. Lední medvěd je nepřekoná."],
      ["Divné je jen to, že medvěd v antarktickém mrazu uhynul.", "Mráz ledním medvědům nevadí, jsou na něj stavění. Divné je, že se tam vůbec nemohou dostat."],
      ["Podivné je jen to místo — medvědi se drží vnitrozemí, ne mořského pobřeží.", "Lední medvěd loví právě u moře na ledu. Nesedí polokoule, ne vzdálenost od pobřeží."],
    ],
    hints: [
      "Porovnej, kde ten živočich ve skutečnosti žije, s tím, kde ho zpráva umisťuje.",
      "Polární živočichové se dělí na severní a jižní a tropický pás mezi nimi je nepřekonatelná hranice. Zpráva ze špatné polokoule proto neobstojí.",
    ],
    explanation: "Lední medvěd žije výhradně v Arktidě na severní polokouli. Mezi oběma polárními oblastmi leží tropická moře, která nepřekoná, a proto se v Antarktidě vyskytnout nemůže.",
  },
  {
    q: "Kolem Antarktidy plave široká plocha mořského ledu, která v jižním létě ubývá a v zimě znovu narůstá. Čím se liší od pevninského ledovce?",
    key: "Plave na moři, kdežto ledovec leží na souši a vrství se tisíce let.",
    d: [
      ["Ničím podstatným — je to úplně týž led, jen se nachází na jiném místě.", "Liší se původem i chováním: jeden vzniká zamrznutím moře každý rok, druhý se vrství ze sněhu po tisíciletí."],
      ["Je slaný, a proto jeho tání zvedá hladinu moře mnohem víc.", "Plovoucí led už v moři místo zabírá, a tak hladinu po roztátí prakticky nezmění. Zvedá ji naopak led ze souše."],
      ["Je mnohem mocnější než led ležící na souši.", "Je to naopak: mořský led měří metry, ledovec na souši kilometry."],
    ],
    hints: [
      "Všimni si dvou rozdílů: na čem ten led leží a za jak dlouho vznikne.",
      "Jeden druh ledu vzniká každou zimu zamrznutím hladiny a v létě zase zmizí. Druhý se ze sněhu vrství po tisíciletí a neroztaje nikdy.",
    ],
    explanation: "Mořský led vzniká každou zimu zamrznutím hladiny, je silný jen metry a v létě z velké části zmizí. Pevninský ledovec leží na souši, vrství se ze sněhu po tisíce let a měří kilometry.",
  },
  {
    q: "Proč je v Antarktidě chladněji než v Arktidě, přestože obě oblasti leží u pólu?",
    key: "Je to vysoká pevnina pod ledem, pod arktickým ledem hřeje oceán.",
    d: [
      ["Leží o poznání dál od Slunce než oblast kolem severního pólu.", "Obě oblasti jsou od Slunce prakticky stejně daleko. Rozdíl dělá nadmořská výška a podklad pod ledem."],
      ["Dopadá na ni méně slunečních paprsků, protože má mnohem menší rozlohu.", "Rozloha o teplotě nerozhoduje. Sluneční paprsky dopadají u obou pólů stejně šikmo."],
      ["Je celá pokrytá sněhem, kdežto arktický led žádný sníh nemá.", "Sníh a led jsou na obou stranách. Rozdíl je v tom, že jižní povrch leží kilometry vysoko nad mořem."],
    ],
    hints: [
      "Porovnej, co je pod ledem v každé z obou oblastí, a v jaké nadmořské výšce ten led leží.",
      "Platí dvě pravidla: s nadmořskou výškou teplota klesá a voda pod ledem působí jako zásobárna tepla. Rozhodni sám, která z obou oblastí je vysoká souš a která hladina oceánu.",
    ],
    explanation: "Antarktida je pevnina, jejíž povrch leží kilometry vysoko, a s výškou teplota klesá. Pod arktickým ledem je naopak oceán, který zdola stále trochu hřeje — proto je na jihu mnohem větší mráz.",
  },
  {
    q: "Ledovec se z antarktického vnitrozemí pomalu sune k pobřeží a tam se od něj odlamují kry velké jako ostrov. Čím je to dané?",
    key: "Vlastní vahou se led sune na moře a tam se jeho okraj rozlomí.",
    d: [
      ["Kry vznikají tím, že v zimě zamrzne mořská voda podél pobřeží.", "Zamrznutím moře vzniká jen tenký mořský led o síle metrů. Obří kry se odlamují od okraje pevninského ledovce vysunutého na moře."],
      ["Vítr odfoukne z pevniny velké kusy zmrzlého sněhu na moře.", "Vítr unese sníh, ne bloky ledu vážící miliony tun. Ty se odlomí vahou samotného ledovce."],
      ["Vědci kry odřezávají, aby se ledovec dál nezvětšoval.", "Do ledovce nikdo takto nezasahuje — bylo by to nemožné a smlouva navíc přírodu chrání."],
    ],
    hints: [
      "Mysli na to, že led je sice pevný, ale pod velkou vahou se pomalu deformuje a teče.",
      "Ve vnitrozemí stále přibývá sníh a vahou tlačí led do stran. Okraj se nakonec vysune na hladinu, kde ho ohýbají vlny a příliv, až praskne.",
    ],
    explanation: "Ledovec se vlastní vahou velmi pomalu sune od vnitrozemí k pobřeží. Tam se vysune na moře a plave; vlny, příliv a tlak ledu zezadu ho postupně rozlámou a odlomená kra odpluje.",
  },
];

const faktL3 = (): PracticeTask | null => fakt(pick(BANKA_L3));

// ── Skladba sezení ─────────────────────────────────────────────────────────

/**
 * Sezení = PRVNÍCH `sessionTaskCount` úloh poolu (`generateMockBatch` pool jen
 * ořízne). Zamíchat celý pool proto nestačí: dvojice blízkých úloh se sešly
 * v jedné šestici (dva živočichové s toutéž trojicí distraktorů vedle sebe,
 * dvakrát lední medvěd, dvě rostlinné otázky) a druhá z nich se řešila bez
 * přemýšlení. Výlučnost se proto hlídá v úvodní šestici — zbytek poolu zůstává
 * úplný, ať se při dalším sezení dostane na všechno.
 */
type Skupiny = [RegExp, string][];

const skupinaPodle = (tabulka: Skupiny) => (t: PracticeTask): string | null =>
  tabulka.find(([r]) => r.test(t.question))?.[1] ?? null;

/** Úlohy ze stejné skupiny nad limit odsune za hranici sezení (pořadí jinak zachová). */
function omezSezeni(
  pool: PracticeTask[],
  kolik: number,
  skupina: (t: PracticeTask) => string | null,
  limity: Record<string, number> = {},
): PracticeTask[] {
  const pouzito = new Map<string, number>();
  const sezeni: PracticeTask[] = [];
  const zbytek: PracticeTask[] = [];
  for (const t of pool) {
    const g = skupina(t);
    const max = g ? (limity[g] ?? 1) : Infinity;
    if (sezeni.length < kolik && (!g || (pouzito.get(g) ?? 0) < max)) {
      if (g) pouzito.set(g, (pouzito.get(g) ?? 0) + 1);
      sezeni.push(t);
    } else {
      zbytek.push(t);
    }
  }
  return [...sezeni, ...zbytek];
}

const SKUPINY_L1: Skupiny = [
  // táž dvojice „sever × jih“, druhá otázka se pak řeší vylučováním
  [/Který živočich žije ve volné přírodě|Který velký mořský dravec/, "zvirata"],
  // obě mají klíč „Antarktida“
  [/Který světadíl je nejchladnější|Který světadíl leží v průměru nejvýš/, "superlativ"],
  // obě odpovídají „pod ledem je pevnina“
  [/^Co je Antarktida|Co se skrývá pod antarktickým ledovcem/, "podklad"],
  // obě o tom, že tam lidé jen dočasně pracují
  [/Kdo na Antarktidě žije trvale|Co je antarktická vědecká stanice/, "lide"],
];

const SKUPINY_L2: Skupiny = [
  [/svítí Slunce celý leden|nevyjde Slunce od května do srpna|nejtepleji v lednu|posádky antarktických stanic střídají/, "sklon"],
  [/Proč v Antarktidě nerostou stromy|život drží u pobřeží a v moři/, "zivot"],
];

const SKUPINY_L3: Skupiny = [
  // lední medvěd jako klíčový znak i jako celá úloha — v sezení jen jednou
  [/velká šelma loví u díry v ledu|uhynulého ledního medvěda/, "medved"],
  // dvakrát „co smí a nesmí podle smlouvy“ se stejnou stavbou
  [/otevřít důl na uhlí|vojenskou základnu/, "smlouva"],
  // obě staví na rozdílu mořský led × pevninský ledovec
  [/zvedá hladinu moří|mořského ledu, která v jižním létě ubývá/, "led"],
];

// ── Generátor ──────────────────────────────────────────────────────────────

/**
 * Souřadnicová linka je nevyčerpatelná, kdežto faktická banka konečná — bez
 * stropu by souřadnice zaplnily pool a v šestiúlohovém sezení by se táž šablona
 * objevila několikrát. Do sezení jde proto právě JEDNA souřadnicová úloha,
 * a to s jižní šířkou ve čtyřech případech z pěti: v tématu o Antarktidě
 * svádí severní souřadnice k odpovědi „jižní polární oblast“ podle nadpisu.
 * Zbylé čtyři instance (obě polokoule × oba pásy) čekají v zbytku poolu.
 */
const KOMBINACE: [boolean, boolean][] = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
];

function gen(level: number): PracticeTask[] {
  if (level === 2) {
    const doSezeni = losUlohy(() => souradnice(Math.random() < 0.8, Math.random() < 0.6));
    const zaloha = KOMBINACE.map(([j, p]) => losUlohy(() => souradnice(j, p)));
    const fakta = omezSezeni(ruzneUlohy(() => losUlohy(faktL2), 20), 5, skupinaPodle(SKUPINY_L2), {
      sklon: 2,
    });
    return [
      ...shuffle([doSezeni, ...fakta.slice(0, 5)]),
      ...shuffle([...fakta.slice(5), ...zaloha]),
    ];
  }
  const tvurce: Tvurce = level === 1 ? faktL1 : faktL3;
  const skupina = skupinaPodle(level === 1 ? SKUPINY_L1 : SKUPINY_L3);
  return omezSezeni(ruzneUlohy(() => losUlohy(tvurce)), 6, skupina);
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const ANTARKTIDA_POLOHA_KLIMA: TopicMetadata[] = [
  {
    id: "g6-zem-antarktida-poloha-klima-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-polarni-oblasti-antarktida-poloha-klima-vyzkum-ochrana",
    displayName: "Antarktida",
    title: "Antarktida - poloha, klima, výzkum, ochrana",
    studentTitle: "Ledový světadíl na jižním konci světa",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Polární oblasti",
    briefDescription: "Poloha, led, život a pravidla nejjižnějšího světadílu a čím se liší od Arktidy.",
    keywords: [
      "Antarktida", "jižní pól", "jižní polární kruh", "pevninský ledovec", "Jižní oceán",
      "tučňák", "polární den", "polární noc", "ledová poušť", "Antarktická smlouva",
      "vědecká stanice", "Arktida",
    ],
    goals: [
      "Popsat polohu Antarktidy kolem jižního pólu a odlišit ji od Arktidy.",
      "Odvodit z polohy za polárním kruhem polární den, jižní léto a životní podmínky.",
      "Podle souřadnic rozhodnout, zda místo leží v polární oblasti, nebo v mírném pásu.",
      "Vysvětlit, proč je Antarktida chráněná a co Antarktická smlouva zakazuje.",
    ],
    boundaries: [
      "Jižní polární kruh 66,5° j. š., sklon zemské osy 23,5°; roční doby dělá sklon osy, ne vzdálenost od Slunce.",
      "Přesná čísla (tloušťka ledu na metry, teplotní rekord, rok podpisu smlouvy) se v klíči nepoužívají — jen řád nebo pořadí.",
      "Zeměpisná délka o zařazení do pásu nerozhoduje, rozhoduje jen zeměpisná šířka.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Antarktida je pevnina kolem jižního pólu pokrytá pevninským ledovcem; Arktida je zamrzlý oceán kolem severního pólu. Polární kruh leží na 66,5°.",
      steps: [
        "U souřadnic nejdřív podle písmen urči polokouli (j. š. = jižní, s. š. = severní).",
        "Velikost šířky porovnej s polárním kruhem 66,5°: víc znamená polární oblast, míň mírný pás.",
        "U podmínek si připomeň sklon zemské osy: v prosinci a lednu je jižní polokoule ke Slunci nakloněná.",
      ],
      commonMistake: "Zaměnit Antarktidu s Arktidou (pevnina × zamrzlý oceán, tučňák × lední medvěd) nebo čekat na jižní polokouli naše roční doby.",
      example: "Místo na 78° j. š. leží v jižní polární oblasti (Antarktida): j. š. znamená jižní polokouli a 78° je víc než 66,5°, tedy za jižním polárním kruhem.",
    },
  },
];
