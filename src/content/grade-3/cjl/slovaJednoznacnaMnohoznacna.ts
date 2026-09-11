import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Chyběla zpětná vazba u všech úloh,
// malá nápověda byla jedna pro 39 úloh a L3 měla jen 10 úloh. Teď tři
// oddělené banky, každá úloha s vlastními nápověďmi a diagnostikou chyb:
// L1 význam slova podle věty (kontext → význam)
// · L2 obráceně: ve které větě má slovo daný význam (projít všechny věty)
// · L3 najít jedno slovo, které se hodí do dvou vět s různým významem
//   (žák sám musí přijít na mnohoznačné slovo — přenos pojmu).

type D = [string, string]; // [chybná možnost, proč je špatně]
const dd = (d: [D, D, D]) => d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];

// ── L1: co znamená slovo v této větě ─────────────────────────────────────
interface VyznamVeVete {
  slovo: string;
  veta: string;
  a: string;
  /** Na co se ve větě dívat — jde do velké nápovědy, výsledek neříká. */
  vodítko: string;
  e: string;
  d: [D, D, D];
}

const L1: VyznamVeVete[] = [
  {
    slovo: "koruna", veta: "Jogurt stojí dvanáct korun.", a: "české peníze",
    vodítko: "Věta mluví o tom, kolik jogurt stojí v obchodě.",
    e: "Věta říká cenu jogurtu a cenu platíme penězi. Koruna je česká peněžní jednotka, proto tu slovo znamená peníze.",
    d: [
      ["ozdoba na hlavě krále", "Královskou ozdobou se v obchodě neplatí — věta mluví o ceně."],
      ["vršek stromu s větvemi", "Žádný strom ve větě není; věta říká, kolik jogurt stojí."],
      ["věnec z květin", "Věnec se nosí na hlavě, s cenou jogurtu nijak nesouvisí."],
    ],
  },
  {
    slovo: "koruna", veta: "Veverka vyšplhala až do koruny stromu.", a: "horní část stromu s větvemi",
    vodítko: "Kam se dá na stromě vyšplhat? Věta mluví o stromě, ne o králi ani o obchodě.",
    e: "Veverka šplhá po stromě nahoru mezi větve. Korunou stromu říkáme jeho horní část s větvemi a listy.",
    d: [
      ["ozdoba na hlavě krále", "Na královu ozdobu by veverka nešplhala — věta mluví o stromě."],
      ["české peníze", "Do peněz se vyšplhat nedá; věta mluví o stromě."],
      ["kmen stromu", "Kmen je spodní část stromu, po které veverka teprve leze. Koruna je až nahoře."],
    ],
  },
  {
    slovo: "list", veta: "Vytrhl jsem ze sešitu jeden list.", a: "jedna stránka papíru",
    vodítko: "Ze sešitu se dá vytrhnout jen něco, co v sešitu je.",
    e: "V sešitu jsou stránky z papíru. Když jednu vytrhnu, vytrhl jsem list — tady tedy znamená kus papíru.",
    d: [
      ["zelená část rostliny", "V sešitu žádné rostliny nerostou — věta mluví o sešitu."],
      ["celý sešit", "Vytrhl jsi jen jeden kus ze sešitu, ne celý sešit."],
      ["obálka na dopis", "Obálka se ze sešitu nevytrhává."],
    ],
  },
  {
    slovo: "list", veta: "Housenka ožírala list jabloně.", a: "zelená část rostliny",
    vodítko: "Co roste na jabloni a co housenky rády jedí?",
    e: "Housenky jedí zelené části rostlin. List jabloně je zelená plochá část, která roste na větvích.",
    d: [
      ["stránka papíru", "Na jabloni žádný papír neroste — věta mluví o stromě."],
      ["kůra stromu", "Kůra je hnědý obal kmene; housenka tu jí to, co na jabloni zelená."],
      ["plod jabloně", "Plod jabloně je jablko — to by věta řekla slovem jablko."],
    ],
  },
  {
    slovo: "kolo", veta: "Po škole jezdím na kole.", a: "jízdní kolo",
    vodítko: "Na čem se dá po škole jezdit?",
    e: "Jezdit se dá na jízdním kole — sedíme na něm a šlapeme do pedálů. Proto tu kolo znamená dopravní prostředek.",
    d: [
      ["část soutěže", "Na části soutěže se jezdit nedá."],
      ["kruh tanečníků", "Na kruhu z lidí nikdo nejezdí."],
      ["kolo od auta", "Na jednom kole od auta nikdo nejezdí; jezdíme na celém jízdním kole."],
    ],
  },
  {
    slovo: "kolo", veta: "Naše třída postoupila do druhého kola soutěže.", a: "část soutěže",
    vodítko: "Věta mluví o soutěži. Do čeho se v soutěži postupuje?",
    e: "Soutěž má několik částí. Kdo vyhraje první část, postoupí do další — tu nazýváme kolo soutěže.",
    d: [
      ["jízdní kolo", "Třída nemůže postoupit do bicyklu; věta mluví o soutěži."],
      ["kolo od auta", "Auto ve větě není, jde o soutěž."],
      ["kruh na papíře", "Do nakresleného kruhu se postoupit nedá."],
    ],
  },
  {
    slovo: "zámek", veta: "Na výletě jsme si prohlédli zámek s velkou zahradou.", a: "stavba, kde bydleli šlechtici",
    vodítko: "Co se dá na výletě prohlížet a co může mít velkou zahradu?",
    e: "Velkou zahradu má jen velká stavba. Zámek je historická budova, ve které dřív bydleli šlechtici, a na výletě si ji můžeme prohlédnout.",
    d: [
      ["zařízení na zamykání dveří", "Zařízení na dveřích nemá zahradu."],
      ["klíč od dveří", "Klíč je malá věc do kapsy, žádnou zahradu nemá."],
      ["malá dřevěná chata", "Chata není stavba, kterou se chodí prohlížet na výlet, a velkou zahradu nemívá."],
    ],
  },
  {
    slovo: "zámek", veta: "Klíč se v zámku zasekl.", a: "zařízení na zamykání dveří",
    vodítko: "Kam strkáme klíč, když zamykáme?",
    e: "Klíč strkáme do zařízení na dveřích, kterým se zamyká. I to se jmenuje zámek.",
    d: [
      ["stavba, kde bydleli šlechtici", "Klíč se nemůže zaseknout v celé budově; zasekne se v něčem malém na dveřích."],
      ["klika u dveří", "Klikou dveře otevíráš rukou, klíč do ní nestrkáš."],
      ["kapsa na klíče", "Klíč se v kapse nezasekává, jen se v ní nosí."],
    ],
  },
  {
    slovo: "ucho", veta: "Hrnek s ulomeným uchem jsme vyhodili.", a: "držadlo hrnku",
    vodítko: "Hrnek neslyší. Co se mu může ulomit a za co ho při pití držíme?",
    e: "Hrnek neslyší, takže nejde o část hlavy. Uchem hrnku říkáme držadlo, za které ho držíme.",
    d: [
      ["část hlavy, kterou slyšíme", "Hrnek nemá hlavu a neslyší."],
      ["okraj hrnku", "Okraj je místo, odkud piješ; ulomené ucho je ta část, za kterou hrnek držíš."],
      ["dno hrnku", "Na dně hrnek stojí; kdyby se ulomilo dno, věta by řekla dno."],
    ],
  },
  {
    slovo: "noha", veta: "Židle má jednu nohu kratší, a proto se kývá.", a: "část židle, na které stojí",
    vodítko: "Kvůli čemu se může židle kývat?",
    e: "Židle stojí na několika částech dole. Když je jedna kratší, židle se kývá. Těm částem říkáme nohy, i když to nejsou lidské nohy.",
    d: [
      ["část lidského těla", "Židle není člověk; jde o část židle."],
      ["opěradlo židle", "O opěradlo se opíráš zády, kvůli němu se židle nekývá."],
      ["sedátko židle", "Na sedátku sedíš; kývání způsobí kratší část dole."],
    ],
  },
  {
    slovo: "oko", veta: "Babička při pletení upustila oko.", a: "smyčka z příze při pletení",
    vodítko: "Věta mluví o pletení. Z čeho se pletení skládá?",
    e: "Pletení se skládá z malých smyček příze. Jedné smyčce se říká oko, protože je kulatá jako oko.",
    d: [
      ["orgán, kterým vidíme", "Babička nemůže upustit oko z obličeje; věta mluví o pletení."],
      ["jehlice na pletení", "Jehlicí se plete, oko je to, co na ní visí."],
      ["klubko vlny", "Klubko je celá namotaná příze, ne jedna smyčka."],
    ],
  },
  {
    slovo: "hlava", veta: "Dědeček je hlavou celé rodiny.", a: "ten, kdo rodinu vede",
    vodítko: "Nejde tu o tělo. Co znamená být hlavou nějaké skupiny lidí?",
    e: "Hlava je na těle nahoře a řídí ho. Proto hlavou rodiny říkáme tomu, kdo rodinu vede — je to přenesený význam.",
    d: [
      ["část těla na krku", "Dědeček nemůže být částí těla jiných lidí; jde o přenesený význam."],
      ["nejchytřejší člen rodiny", "Věta neříká, kdo je nejchytřejší, ale kdo rodinu vede."],
      ["nejvyšší člověk v rodině", "Nejde o výšku postavy, ale o to, kdo rodinu vede."],
    ],
  },
  {
    slovo: "myš", veta: "Na obrazovce klikni myší na obrázek.", a: "ovládací zařízení k počítači",
    vodítko: "Čím se kliká na obrázek na obrazovce?",
    e: "Na obrázek na obrazovce klikáme zařízením, které držíme v ruce a posouváme po stole. Říká se mu myš, protože trochu připomíná zvířátko s ocáskem.",
    d: [
      ["malý hlodavec", "Zvířátkem se na obrázek kliknout nedá."],
      ["klávesnice", "Na klávesnici se píše; kliká se jiným zařízením."],
      ["obrazovka", "Na obrazovku se díváš, neklikáš s ní."],
    ],
  },
  {
    slovo: "pero", veta: "Straka ztratila na zahradě černé pero.", a: "pírko z ptačího peří",
    vodítko: "Straka je pták. Co může pták ztratit?",
    e: "Ptáci mají tělo pokryté peřím a jednotlivá pírka jim občas vypadnou. Jednomu pírku říkáme pero.",
    d: [
      ["psací potřeba", "Straka nepíše; ztratila část svého peří."],
      ["ptačí zobák", "Zobák ptáci neztrácejí, drží pevně na hlavě."],
      ["ptačí vajíčko", "Vajíčka ptáci snášejí do hnízda, neztrácejí je jako peří."],
    ],
  },
  {
    slovo: "jazyk", veta: "Petr se ve škole učí cizí jazyk.", a: "řeč, kterou lidé mluví",
    vodítko: "Co se dá ve škole učit a může to být cizí?",
    e: "Cizí jazyk je řeč lidí z jiné země, třeba angličtina. Tu se ve škole učíme — nejde o jazyk v puse.",
    d: [
      ["orgán v ústech", "Jazyk v puse se ve škole neučíme, ten už máme."],
      ["jazyk u boty", "Jazyk u boty je kus kůže pod tkaničkami; ten se neučí."],
      ["nové písmo", "Písmo je jen způsob zápisu; učíme se celou řeč."],
    ],
  },
];

function vyznam(t: VyznamVeVete): PracticeTask {
  return choice(`Co znamená slovo „${t.slovo}“ ve větě „${t.veta}“?`, t.a, dd(t.d), {
    hints: [
      `Přečti celou větu „${t.veta}“. O čem nebo o kom se v ní mluví?`,
      `${t.vodítko} Pak zkus každý význam z nabídky dosadit místo slova „${t.slovo}“. Dává věta pořád smysl?`,
    ],
    explanation: t.e,
  });
}

// ── L2: ve které větě má slovo tento význam ──────────────────────────────
interface KteraVeta {
  slovo: string;
  /** hledaný význam (jde do otázky) */
  vyznam: string;
  /** všechny významy slova — do velké nápovědy */
  vyznamy: string;
  a: string;
  /** [věta s jiným významem, jaký význam tam slovo má] */
  d: [D, D, D];
}

const L2: KteraVeta[] = [
  { slovo: "koruna", vyznam: "peníze", vyznamy: "ozdobu krále, horní část stromu nebo peníze", a: "Za zmrzlinu jsem zaplatil třicet korun.",
    d: [["Král si nasadil zlatou korunu.", "ozdobu na hlavě krále"], ["Na koruně stromu sedí vrána.", "horní část stromu"], ["Koruna staré lípy šumí ve větru.", "horní část stromu"]] },
  { slovo: "list", vyznam: "kus papíru", vyznamy: "část rostliny nebo kus papíru", a: "Z bloku jsem vytrhl čistý list.",
    d: [["Na kaštanu žloutne první list.", "část rostliny"], ["Housenka má ráda šťavnatý list.", "část rostliny"], ["Z lípy spadl list ve tvaru srdce.", "část rostliny"]] },
  { slovo: "kolo", vyznam: "část soutěže", vyznamy: "jízdní kolo, kolo od auta, kruh lidí nebo část soutěže", a: "V prvním kole soutěže jsme vyhráli.",
    d: [["Na kole jezdím vždycky v helmě.", "jízdní kolo"], ["Autu se píchlo přední kolo.", "kolo od auta"], ["Děti tančily v kole kolem stromu.", "kruh lidí"]] },
  { slovo: "oko", vyznam: "díra v síti", vyznamy: "orgán k vidění, kapku tuku na polévce nebo díru v síti", a: "Rybka proklouzla okem v síti.",
    d: [["Do oka mi spadla řasa.", "orgán, kterým vidíme"], ["Kočka mhouří jedno oko.", "orgán, kterým vidíme"], ["Na polévce plavou mastná oka.", "kapky tuku na polévce"]] },
  { slovo: "ucho", vyznam: "držadlo", vyznamy: "část hlavy, kterou slyšíme, nebo držadlo nádoby", a: "Konvice má velké ucho.",
    d: [["Zajíc nastražil ucho.", "část hlavy, kterou slyšíme"], ["Šeptal mi do ucha tajemství.", "část hlavy, kterou slyšíme"], ["Po koupání mě bolí ucho.", "část hlavy, kterou slyšíme"]] },
  { slovo: "noha", vyznam: "část nábytku", vyznamy: "část těla nebo část nábytku, na které stojí", a: "Stůl má čtyři dřevěné nohy.",
    d: [["Při běhu mě rozbolela noha.", "část těla"], ["Čáp stojí na jedné noze.", "část těla ptáka"], ["Ráno jsem si obul na nohu ponožku.", "část těla"]] },
  { slovo: "hlava", vyznam: "ten, kdo vede", vyznamy: "část těla nebo toho, kdo vede skupinu lidí", a: "Hlavou naší obce je paní starostka.",
    d: [["Na hlavě nosím čepici.", "část těla"], ["Pes položil hlavu na tlapky.", "část těla psa"], ["Po dlouhém čtení mě bolí hlava.", "část těla"]] },
  { slovo: "zámek", vyznam: "stavba", vyznamy: "starou stavbu šlechticů nebo zařízení na zamykání", a: "Na zámku kdysi bydlela kněžna.",
    d: [["Na brance visí zrezivělý zámek.", "zařízení na zamykání"], ["Do zámku jsem strčil klíč.", "zařízení na zamykání"], ["Zámek na kole se zasekl.", "zařízení na zamykání kola"]] },
  { slovo: "myš", vyznam: "zvíře", vyznamy: "malého hlodavce nebo zařízení k počítači", a: "Ve spíži se schovává myš.",
    d: [["Počítačová myš nefunguje.", "zařízení k počítači"], ["Klikni myší na tlačítko.", "zařízení k počítači"], ["Myš k notebooku potřebuje baterku.", "zařízení k počítači"]] },
  { slovo: "pero", vyznam: "věc na psaní", vyznamy: "ptačí pírko nebo věc na psaní", a: "Paní učitelka opravuje sešity červeným perem.",
    d: [["Z holuba vypadlo šedé pero.", "ptačí pírko"], ["Indián měl ve vlasech orlí pero.", "ptačí pírko"], ["Na dvoře leželo husí pero.", "ptačí pírko"]] },
  { slovo: "zub", vyznam: "část hřebenu", vyznamy: "zub v puse nebo špičatou část nástroje", a: "Hřeben má jeden zub vylomený.",
    d: [["U zubaře mi spravili zub.", "zub v puse"], ["Miminku roste první zub.", "zub v puse"], ["Pes cenil zuby na pošťáka.", "zuby v tlamě"]] },
  { slovo: "jazyk", vyznam: "řeč", vyznamy: "orgán v ústech, kus kůže u boty nebo řeč", a: "Babička umí německý jazyk.",
    d: [["Pes mi olízl ruku jazykem.", "orgán v tlamě"], ["Horký čaj mi spálil jazyk.", "orgán v ústech"], ["U boty se mi zmačkal jazyk.", "kus kůže pod tkaničkami"]] },
  { slovo: "hvězda", vyznam: "slavný člověk", vyznamy: "těleso na obloze, ozdobu ve tvaru hvězdy nebo slavného člověka", a: "Na koncertě zpívala známá hvězda.",
    d: [["Večer na obloze svítí první hvězda.", "těleso na obloze"], ["Na špičku stromku dáme hvězdu.", "ozdobu ve tvaru hvězdy"], ["Nakreslil jsem hvězdu s pěti cípy.", "tvar s cípy"]] },
  { slovo: "hřeben", vyznam: "vršek hor", vyznamy: "věc na česání, ozdobu na hlavě kohouta nebo vršek hor", a: "Po hřebeni hor vede turistická cesta.",
    d: [["Učesal jsem se hřebenem.", "věc na česání"], ["Kohout má červený hřeben.", "ozdobu na hlavě kohouta"], ["Na hřebenu chybí jeden zub.", "věc na česání"]] },
];

function kteraVeta(t: KteraVeta): PracticeTask {
  return choice(`Ve které větě znamená slovo „${t.slovo}“ ${t.vyznam}?`, t.a,
    dd(t.d.map(([veta, jiny]) => [veta, `Tady „${t.slovo}“ znamená ${jiny}, ne ${t.vyznam}.`]) as [D, D, D]), {
      hints: [
        `Zkus v každé větě nahradit slovo „${t.slovo}“ slovy „${t.vyznam}“. Kde věta pořád dává smysl?`,
        `Slovo „${t.slovo}“ je mnohoznačné: může znamenat ${t.vyznamy}. U každé věty si řekni, který z těch významů tam je — hledáš jedinou větu s významem „${t.vyznam}“.`,
      ],
      explanation: `Ve větě „${t.a}“ znamená „${t.slovo}“ ${t.vyznam}. V ostatních větách má jiný význam: ${[...new Set(t.d.map(([, j]) => j))].join(", ")}. Poznáme to podle ostatních slov ve větě.`,
    });
}

// ── L3: jedno slovo do dvou vět ──────────────────────────────────────────
interface DoObou {
  v1: string;
  v2: string;
  a: string;
  /** Jak se liší oba významy — do velké nápovědy, slovo samo neříká. */
  rozdil: string;
  e: string;
  /** [chybná možnost, do které věty se hodí: 1 / 2] */
  d: [[string, 1 | 2], [string, 1 | 2], [string, 1 | 2]];
}

const L3: DoObou[] = [
  { v1: "Dopis napíšu na čistý ___ papíru.", v2: "Na podzim spadl ze stromu ___.", a: "list", rozdil: "v první větě jde o papír, ve druhé o strom",
    e: "„List“ je mnohoznačné slovo: list papíru je kus, na který píšeme, a list stromu je jeho zelená část. Proto se hodí do obou vět.",
    d: [["arch", 1], ["kaštan", 2], ["žalud", 2]] },
  { v1: "Král má na hlavě zlatou ___.", v2: "Za rohlík jsem dal jednu ___.", a: "korunu", rozdil: "v první větě jde o krále, ve druhé o placení",
    e: "Koruna je ozdoba na hlavě krále a zároveň česká peněžní jednotka. Jedno slovo s více významy se hodí do obou vět.",
    d: [["čepici", 1], ["minci", 2], ["stovku", 2]] },
  { v1: "Tatínek mi koupil nové ___.", v2: "V soutěži nás čeká už jen poslední ___.", a: "kolo", rozdil: "jednou jde o věc, na které se jezdí, podruhé o část soutěže",
    e: "Kolo může být jízdní kolo i část soutěže. Protože má slovo více významů, dá se použít v obou větách.",
    d: [["auto", 1], ["úkol", 2], ["finále", 2]] },
  { v1: "Na kopci stojí starý ___.", v2: "Na dveřích visel rezavý ___.", a: "zámek", rozdil: "jednou jde o velkou stavbu, podruhé o něco malého na dveřích",
    e: "Zámek je stavba, kde bydleli šlechtici, i zařízení na zamykání. Slovo je mnohoznačné, proto sedí do obou vět.",
    d: [["hrad", 1], ["klíč", 2], ["řetěz", 2]] },
  { v1: "Hrnku se ulomilo ___.", v2: "Babičku bolí levé ___.", a: "ucho", rozdil: "jednou jde o část hrnku, podruhé o část těla",
    e: "Ucho je část hlavy, kterou slyšíme, a také držadlo hrnku. Jedno slovo, dva významy — hodí se do obou vět.",
    d: [["držadlo", 1], ["koleno", 2], ["rameno", 2]] },
  { v1: "Stůl má jednu ___ kratší.", v2: "Při fotbale jsem si narazil ___.", a: "nohu", rozdil: "jednou jde o část stolu, podruhé o část těla",
    e: "Nohu má člověk i stůl — stůl na nohách stojí. Slovo je mnohoznačné, proto se hodí do obou vět.",
    d: [["desku", 1], ["ruku", 2], ["hlavu", 2]] },
  { v1: "Kočka má jedno ___ zelené a druhé modré.", v2: "V síti se roztrhlo jedno ___.", a: "oko", rozdil: "jednou jde o obličej kočky, podruhé o síť",
    e: "Oko je orgán, kterým vidíme, a také díra v síti. Protože má slovo oba významy, hodí se do obou vět.",
    d: [["ucho", 1], ["lano", 2], ["vlákno", 2]] },
  { v1: "Horkou polévkou jsem si spálil ___.", v2: "Každý národ má svůj ___.", a: "jazyk", rozdil: "jednou jde o část těla, podruhé o řeč",
    e: "Jazyk máme v ústech, ale jazykem říkáme i řeči, kterou mluví lidé jednoho národa. Jedno slovo se hodí do obou vět.",
    d: [["prst", 1], ["ret", 1], ["prapor", 2]] },
  { v1: "Na umyvadle ležel ___ plný vlasů.", v2: "Nad vesnicí se táhl dlouhý horský ___.", a: "hřeben", rozdil: "jednou jde o věc na česání, podruhé o hory",
    e: "Hřebenem se češeme, ale hřeben mají i hory — je to jejich dlouhý vršek. Slovo je mnohoznačné, proto sedí do obou vět.",
    d: [["kartáč", 1], ["hřbet", 2], ["les", 2]] },
  { v1: "Kočka chytila malou ___.", v2: "K počítači jsem si koupil novou ___.", a: "myš", rozdil: "jednou jde o zvíře, podruhé o počítač",
    e: "Myš je hlodavec a také zařízení, kterým ovládáme počítač. Jedno slovo s dvěma významy se hodí do obou vět.",
    d: [["krysu", 1], ["klávesnici", 2], ["podložku", 2]] },
  { v1: "Na dvoře pobíhal malý ___.", v2: "Zavři ___, ať neteče voda.", a: "kohoutek", rozdil: "jednou jde o zvíře na dvoře, podruhé o vodu",
    e: "Kohoutek je malý kohout a také uzávěr vody u umyvadla. Protože má slovo dva významy, hodí se do obou vět.",
    d: [["pejsek", 1], ["králíček", 1], ["ventil", 2]] },
  { v1: "Na obloze svítila jasná ___.", v2: "Na koncert přijela slavná filmová ___.", a: "hvězda", rozdil: "jednou jde o oblohu, podruhé o slavného člověka",
    e: "Hvězda svítí na obloze, ale hvězdou říkáme i slavnému herci nebo zpěvákovi. Slovo je mnohoznačné, hodí se do obou vět.",
    d: [["luna", 1], ["zpěvačka", 2], ["herečka", 2]] },
  { v1: "Po běhu mě bolí ___.", v2: "Tatínek je ___ naší rodiny.", a: "hlava", rozdil: "jednou jde o část těla, podruhé o toho, kdo rodinu vede",
    e: "Hlava je část těla a přeneseně i ten, kdo rodinu nebo skupinu vede. Jedno slovo se proto hodí do obou vět.",
    d: [["noha", 1], ["záda", 1], ["pýcha", 2]] },
  { v1: "Do penálu jsem si dal nové ___.", v2: "Papoušek ztratil barevné ___.", a: "pero", rozdil: "jednou jde o věc do školy, podruhé o ptáka",
    e: "Perem píšeme a pero je i ptačí pírko. Slovo má oba významy, proto se hodí do obou vět.",
    d: [["pravítko", 1], ["kružítko", 1], ["peří", 2]] },
];

function doObou(t: DoObou): PracticeTask {
  const vetaCislo = (n: 1 | 2) => (n === 1 ? `„${t.v1}“` : `„${t.v2}“`);
  return choice(`Které slovo doplníš do obou vět? ${`„${t.v1}“ „${t.v2}“`}`, t.a,
    t.d.map(([value, kam]) => ({
      value,
      why: `„${value}“ se hodí jen do věty ${vetaCislo(kam)}. Do věty ${vetaCislo(kam === 1 ? 2 : 1)} nesedí, protože tam jde o něco jiného.`,
    })) as [Distractor, Distractor, Distractor], {
      hints: [
        `Dosaď každé slovo z nabídky nejdřív do věty „${t.v1}“. Která slova tam dávají smysl?`,
        `Hledané slovo musí sedět i do věty „${t.v2}“ — ${t.rozdil}. Jde tedy o jedno slovo se dvěma různými významy. Zkoušej jen ta slova, která prošla první větou.`,
      ],
      explanation: t.e,
    });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(vyznam);
  if (level === 2) return shuffle(L2).map(kteraVeta);
  return shuffle(L3).map(doObou);
}

export const SLOVAJEDNOZNACNAMNOHO: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
    title: "Slova jednoznačná a mnohoznačná",
    studentTitle: "Jedno slovo, víc významů",
    illustrationDesc: "velký nápis KORUNA uprostřed, od něj šipky ke třem obrázkům — královská koruna, mince a strom s korunou, veselé kreslené provedení",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš, že jedno slovo může mít více různých významů.",
    keywords: ["jednoznačná slova", "mnohoznačná slova", "polysémie", "kontext", "význam slov"],
    goals: [
      "Rozlišit jednoznačná a mnohoznačná slova.",
      "Určit správný význam slova podle věty.",
      "Uvést příklady různých významů mnohoznačného slova.",
    ],
    boundaries: ["Základní příklady z každodenního jazyka", "Bez homonym (stejný tvar, jiný původ)"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Mnohoznačné slovo: 'koruna' = na hlavě krále / peníze / horní část stromu. Vždy hledej kontext věty.",
      steps: [
        "Přečti si celou větu, ne jen samotné slovo.",
        "Podle kontextu (co se v větě děje) urči, jaký význam se zde myslí.",
      ],
      commonMistake: "Žáci si vyberou první/nejčastější význam bez ohledu na větu.",
      example: "'List papíru' = arch papíru. 'List stromu' = zelená část rostliny. Stejné slovo, jiný kontext!",
    },
  },
];
