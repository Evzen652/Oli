/**
 * Zeměpis 6. ročník — Pedosféra a biosféra: půdy a životní prostředí (select_one).
 *
 * Téma vede jednu myšlenkovou linku: podnebí → půda → rostlinstvo. Z ní plyne
 * i gradace:
 *  • L1 — zapamatování: z čeho půda vzniká, co je humus, ornice, matečná
 *    hornina, zvětrávání, co znamená pedosféra a biosféra, a jméno krajinné
 *    zóny podle jednoho typického znaku.
 *  • L2 — použití jedním krokem: z popisu podnebí (zeměpisná šířka, roční
 *    srážky, teploty, délka vegetačního období) žák určí krajinu i půdu, nebo
 *    obráceně z uvedené krajiny odvodí vlastnost její půdy.
 *  • L3 — analýza a přenos: dvoukrokové případy, ve kterých se vybírá PŘÍČINA
 *    nebo ROZHODNUTÍ (eroze po vykácení svahu, vyhořelé tropické pole,
 *    zasolení po dlouhém zavlažování, výšková stupňovitost, ochrana půdy).
 *
 * Chybový model (každý distraktor = jedna konkrétní miskoncepce):
 *  • půda = jen rozdrcený kámen, živá složka se nepočítá;
 *  • bujná vegetace = úrodná půda (tropický deštný les jako nejúrodnější);
 *  • záměna chladných zón (tundra ↔ tajga) a step ↔ poušť;
 *  • eroze svalená na „silnější déšť“ místo na chybějící porost;
 *  • „čím víc se zalévá, tím úrodnější“ místo zasolení.
 *
 * K obsahu nejsou mapy ani obrázky: poloha se zadává jen souřadnicí, podnebí
 * čísly a slovy. Čísla jsou zaokrouhlená a nesporná (deštný les přes 2 000 mm
 * za rok, poušť pod 250 mm), žádné rozlohy ani údaje závislé na aktuálním dění.
 *
 * Rotace bank se nastavuje při každém volání gen(), modul si mezi voláními
 * nedrží žádný stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, cis, sirka, type Distractor } from "./_shared";

/**
 * Položka banky. `klic` = rozlišovací slovo správné odpovědi; test hlídá, že se
 * neobjeví ve znění otázky ani v nápovědách (nápověda smí učit metodu, ne
 * prozradit výsledek).
 */
export interface Polozka {
  q: string;
  correct: string;
  klic: string;
  distractors: [Distractor, Distractor, Distractor];
  hints: [string, string];
  explanation: string;
}

const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

// ── L1 — ZAPAMATOVÁNÍ: pojmy pedosféry a biosféry, jména zón podle znaku ────
export const POOL_L1: Polozka[] = [
  {
    q: "Z čeho vzniká půda?",
    correct: "Ze zvětralé horniny a z rozložených zbytků organismů",
    klic: "zvětralé",
    distractors: [
      { value: "Jen z rozdrcené horniny, bez jakýchkoli zbytků organismů", why: "Rozdrcená hornina je teprve kostra půdy. Aby vznikla půda, musí se přidat rozložené zbytky odumřelých organismů." },
      { value: "Z prachu, který do kraje navál vítr ze vzdálených oblastí", why: "Navátý prach je jen nerostný materiál — sám o sobě půdou není. Stane se z něj podklad, ze kterého půda vzniká teprve tím, že se přidají rozložené zbytky organismů." },
      { value: "Z vody, která se v krajině usadila a postupně ztvrdla", why: "Voda v půdě koluje, ale sama půdu nevytvoří. Základ dává rozpadlá hornina a rozložená odumřelá hmota." },
    ],
    hints: [
      "Půda má dvě složky: jednu neživého původu a jednu, která kdysi žila. Zkus obě pojmenovat.",
      "Když kopneš rýčem do pole, najdeš drobné kamínky i tmavou drobivou hmotu. Kamínky se uvolnily z horniny pod polem, tmavá hmota vznikla z těl a zbytků, které odumřely a rozložily se. Vyber možnost, ve které jsou obě složky zároveň.",
    ],
    explanation: "Půda vzniká dvěma cestami zároveň: hornina pod ní se mrazem, vodou a teplem rozpadá na drobné úlomky a odumřelé zbytky organismů se rozkládají na humus. Bez živé složky by zůstal jen štěrk a písek, na kterém se rostlinám nedaří.",
  },
  {
    q: "Co je humus?",
    correct: "Tmavá hmota z rozložených zbytků organismů, která drží živiny",
    klic: "tmavá",
    distractors: [
      { value: "Jemný písek, který dává půdě potřebnou úrodnost", why: "Písek je jen rozdrcená hornina. Úrodnost dává rozložená odumřelá hmota, ne velikost zrnek." },
      { value: "Tvrdá hornina, která leží hluboko pod celou půdou", why: "To je matečná hornina. Dodává půdě nerostnou část i některé živiny, ale tmavá zásobárna, která živiny a vodu v půdě drží, vzniká z rozložené odumřelé hmoty." },
      { value: "Voda s rozpuštěnými solemi, kterou nasávají kořeny", why: "Půdní roztok kořeny opravdu nasávají, zásobárnou živin je ale rozložená odumřelá hmota." },
    ],
    hints: [
      "Proč je hlína z pole tmavší než hlína vykopaná z hloubky dvou metrů? Co v ní navíc je?",
      "Odhrň v lese listí a pod ním najdeš drobivou vrstvu, která voní zemí. Vznikla z toho, co na zem spadlo a rozložilo se. Právě ona drží vodu i živiny. Vyber možnost, která mluví o rozložené odumřelé hmotě, ne o hornině ani o vodě.",
    ],
    explanation: "Humus vzniká rozkladem odumřelých zbytků rostlin a živočichů. Drží v sobě živiny i vodu, proto je půda s velkým množstvím humusu úrodná a půda bez něj chudá.",
  },
  {
    q: "Kde je v půdě humusu nejvíc?",
    correct: "V nejvyšší vrstvě, které se říká ornice",
    klic: "ornice",
    distractors: [
      { value: "V nejhlubší vrstvě těsně nad matečnou horninou", why: "Dole je odumřelé hmoty nejméně. Zbytky rostlin a živočichů padají na povrch, proto je humusu nejvíc nahoře." },
      { value: "Rovnoměrně ve všech vrstvách půdy", why: "Rovnoměrně rozložený humus v půdě není. Směrem do hloubky ho ubývá, protože odumřelá hmota přichází shora." },
      { value: "Až v matečné hornině pod půdou", why: "Matečná hornina je neživý podklad. Rozložená odumřelá hmota se ukládá nahoře, ne pod půdou." },
    ],
    hints: [
      "Odkud se do půdy dostávají odumřelé listy, stébla a těla drobných živočichů?",
      "Zbytky rostlin a živočichů dopadají na povrch a rozkládají se právě tam. Do hloubky se dostane jen malá část, takže dole zůstává skoro samá zvětralá hornina. Vyber proto vrstvu, která je povrchu nejblíž.",
    ],
    explanation: "Odumřelé zbytky se hromadí na povrchu, proto je svrchní vrstva půdy nejtmavší a nejbohatší na humus. Směrem do hloubky humusu ubývá, až přejde do zvětralé horniny.",
  },
  {
    q: "Který popis sedí na matečnou horninu?",
    correct: "Podklad pod půdou, z jehož zvětrávání půda vzniká",
    klic: "zvětrávání",
    distractors: [
      { value: "Nejúrodnější vrstva půdy, ve které rostou kořeny", why: "To je ornice. Neživý podklad, ze kterého se půda tvoří, leží až pod celým půdním profilem." },
      { value: "Vrstva, ve které se hromadí voda po vydatném dešti", why: "Voda se zdržuje hlavně ve svrchních vrstvách. Podklad půdy se pozná podle původu, ne podle vody." },
      { value: "Vrstva odumřelého listí a jehličí ležící na povrchu", why: "Opad na povrchu se teprve mění na humus. Neživý podklad je naopak úplně dole, pod půdou." },
    ],
    hints: [
      "Rozmysli si, co v půdním profilu leží úplně dole a odkud se bere nerostná část půdy.",
      "Kopej dolů: nejdřív tmavá úrodná vrstva, pak světlejší půda a nakonec pevný podklad, který se teprve rozpadá na úlomky. Právě z jeho rozpadu se bere písek a prach v půdě nad ním. Vyber možnost, která popisuje tenhle spodní podklad.",
    ],
    explanation: "Matečná hornina je pevný podklad pod půdou. Mráz a změny teploty ji drobí na úlomky, voda z ní navíc rozpouští a přeměňuje některé nerosty — tak vzniká písek, prach i jíl, tedy nerostná část půdy. Právě proto mají půdy na vápenci jiné vlastnosti než půdy na žule.",
  },
  {
    q: "Co označuje pojem pedosféra?",
    correct: "Půdní obal Země",
    klic: "půdní",
    distractors: [
      { value: "Vzdušný obal Země", why: "Vzdušný obal se jmenuje atmosféra. Tady jde o obal, ve kterém rostou kořeny." },
      { value: "Vodní obal Země", why: "Vodní obal se jmenuje hydrosféra — oceány, řeky, jezera i podzemní voda." },
      { value: "Kamenný obal Země", why: "Kamenný obal se jmenuje litosféra. Na jejím povrchu teprve vzniká obal, o který tu jde." },
    ],
    hints: [
      "Každý obal Země se jmenuje podle toho, z čeho je. Který obal ještě mezi známými názvy chybí?",
      "Atmosféra je z plynů, hydrosféra z vody, litosféra z hornin. Zbývá tenká vrstva na povrchu souše, ve které rostou kořeny a žijí žížaly — a ta má svůj vlastní název. Vyber možnost, která ji pojmenuje.",
    ],
    explanation: "Pedosféra je půdní obal Země, tedy souvislá tenká vrstva půdy na povrchu souše. Leží na styku horninového, vzdušného a vodního obalu a prorůstá jí všechno živé.",
  },
  {
    q: "Co označuje pojem biosféra?",
    correct: "Obal Země, který tvoří všechny žijící organismy dohromady",
    klic: "organism",
    distractors: [
      { value: "Obal Země, který tvoří jen rostliny a jejich podzemní kořeny", why: "Do tohoto obalu patří všechny organismy, tedy i živočichové, houby a bakterie, ne jen rostliny." },
      { value: "Obal Země, který tvoří půda a zvětralá hornina", why: "Půdní obal se jmenuje pedosféra. Tenhle pojem označuje všechno živé na Zemi." },
      { value: "Obal Země, který tvoří vzduch okolo nás", why: "Vzdušný obal je atmosféra. Organismy v ní žijí, ale samotný vzduch tímto pojmem myšlený není." },
    ],
    hints: [
      "Předpona bio- se objevuje ve slovech biologie nebo bionafta. Co mají společného?",
      "Předpona bio- znamená život. Hledaný obal proto nedržíš v ruce jako hroudu ani ho nenalijeme do sklenice: je to všechno živé dohromady, od bakterií v půdě po ptáky nad ní. Vyber možnost, která mluví o všem živém, ne o jedné jeho skupině.",
    ],
    explanation: "Biosféra je oživený obal Země, který tvoří vše živé: zasahuje do půdy, do vody i do spodní části ovzduší a patří do ní všechny organismy — rostliny, živočichové, houby, bakterie i sinice.",
  },
  {
    q: "Která půda patří u nás k nejúrodnějším?",
    correct: "Černozem z teplých rovin",
    klic: "černozem",
    distractors: [
      { value: "Písčitá půda z borových lesů", why: "Písčitá půda rychle propouští vodu a humusu má málo, proto k úrodným nepatří." },
      { value: "Mělká kamenitá půda z hor", why: "V horách je vrstva půdy tenká a chudá na humus: rozklad je tam pomalý a materiál se splavuje dolů." },
      { value: "Rašelinná půda z mokřadů", why: "Odumřelé hmoty je v rašelině hodně, je ale kyselá a zamokřená, takže se na ní běžným plodinám nedaří." },
    ],
    hints: [
      "Úrodnost dává množství humusu. Kde se ho nastřádá nejvíc: tam, kde voda rychle protéká pískem, nebo tam, kde je teplo a každý rok odumírá hustý porost?",
      "Nejlepší půdy u nás vznikly tam, kde bylo dost tepla a kde kdysi rostl hustý travnatý porost. Traviny každoročně odumíraly i s kořeny, takže se v půdě nastřádala mocná tmavá vrstva bohatá na humus. Vyber možnost, která takovou tmavou půdu popisuje.",
    ],
    explanation: "Nejúrodnější půdy u nás jsou černozemě v teplých rovinách jižní Moravy a Polabí. Vznikly pod travnatým porostem, jehož kořeny každý rok odumíraly, takže mají mocnou tmavou vrstvu bohatou na humus.",
  },
  {
    q: "Jak se jmenuje krajinná zóna, kde je podloží trvale zmrzlé a rostou tam jen mechy, lišejníky a zakrslé keříky?",
    correct: "Tundra",
    klic: "tundra",
    distractors: [
      { value: "Tajga", why: "V tajze rostou vzrostlé jehličnaté stromy. Ty by ve zmrzlém podloží a při sotva dvouměsíčním létě neobstály." },
      { value: "Step", why: "Step je souvislá travnatá pláň mírného pásu s horkým létem, ne chladná krajina mechů a lišejníků." },
      { value: "Savana", why: "Savana leží v horkém tropickém pásu, střídá se v ní období dešťů a sucha a zmrzlé podloží tam není." },
    ],
    hints: [
      "Která zóna leží nejblíž k pólu, hned za posledními vzrostlými stromy?",
      "Když jdeš od severního pólu k jihu, přijde nejdřív pás bez stromů, kde půda přes léto rozmrzne jen do hloubky několika centimetrů, a teprve za ním souvislý les. Vyber jméno toho bezlesého pásu.",
    ],
    explanation: "Popis odpovídá tundře: rozkládá se v nejsevernějších krajích za severní hranicí lesa, léto tam trvá jen několik týdnů a podloží zůstává trvale zmrzlé, takže kořeny stromů nemají kam růst. Proto tam rostou jen mechy, lišejníky a zakrslé keříky.",
  },
  {
    q: "Jak se jmenuje pás jehličnatých lesů táhnoucí se severní Evropou, Sibiří a Kanadou?",
    correct: "Tajga",
    klic: "tajga",
    distractors: [
      { value: "Tundra", why: "V tundře stromy nerostou — brání jim krátké léto a trvale zmrzlé podloží." },
      { value: "Step", why: "Step je bezlesá travnatá pláň mírného pásu, ne souvislý les jehličnatých stromů." },
      { value: "Savana", why: "Savana je horká tropická krajina vysokých travin s ojedinělými stromy a leží blízko rovníku." },
    ],
    hints: [
      "Rozhodni nejdřív, jestli hledaná zóna leží v tropickém, nebo v chladném pásu. Tím vypadnou dvě možnosti.",
      "Popis mluví o severu, takže obě teplé krajiny můžeš rovnou škrtnout. Zbývají dvě chladné a liší se jedinou věcí: v jedné stromy rostou, ve druhé ne. Vyber jméno té, která je souvislým lesem.",
    ],
    explanation: "Souvislý pás jehličnatých lesů na severu Evropy, Asie a Ameriky se jmenuje tajga. Zima je tam dlouhá a mrazivá, ale podloží přes léto rozmrzne, takže kořeny stromů mají kam růst.",
  },
  {
    q: "Jak se jmenuje souvislá travnatá pláň mírného pásu s horkým suchým létem a téměř bez stromů?",
    correct: "Step",
    klic: "step",
    distractors: [
      { value: "Poušť", why: "Na poušti rostliny téměř nejsou, protože srážek je pod 250 mm za rok. Tady jde o souvislý travnatý porost." },
      { value: "Tajga", why: "Tajga je souvislý les jehličnatých stromů chladného severu, ne bezlesá travnatá pláň." },
      { value: "Savana", why: "Savana leží v tropickém pásu, má vysoké traviny i ojedinělé stromy a střídá se v ní období dešťů a sucha." },
    ],
    hints: [
      "Rozhodni nejdřív, jestli jde o krajinu tropickou, nebo z mírného pásu — tím vypadne polovina možností.",
      "Popis mluví o mírném pásu, takže tropické krajiny můžeš škrtnout. Zbývá rozhodnout mezi souvislým lesem a bezlesou travnatou plání. Ta druhá vzniká tam, kde je pro stromy srážek málo, ale trávě ještě stačí. Vyber jméno té travnaté.",
    ],
    explanation: "Popis sedí na step: leží v mírném pásu, ročních srážek je jen asi 400 mm a hlavně v létě je sucho. Stromům to nestačí, travám ano — a jejich odumřelé kořeny vytvořily nejúrodnější půdy světa, černozemě.",
  },
  {
    q: "Jak se jmenuje krajina vysokých travin s ojedinělými stromy, ve které se pravidelně střídá období dešťů s obdobím sucha?",
    correct: "Savana",
    klic: "savana",
    distractors: [
      { value: "Step", why: "Step leží v mírném pásu s mrazivou zimou a stromy v ní prakticky nerostou. Celoroční horko ani půlroční období dešťů tam nenajdeš." },
      { value: "Tajga", why: "Tajga je souvislý les jehličnatých stromů chladného severu, ne krajina vysokých travin." },
      { value: "Tundra", why: "V tundře rostou jen mechy, lišejníky a zakrslé keříky, protože podloží je trvale zmrzlé." },
    ],
    hints: [
      "Střídání období dešťů a sucha je znak jednoho konkrétního podnebného pásu. Kterého?",
      "Takhle ostré střídání období dešťů a období sucha při celoročním horku je znak tropického pásu — v chladných krajinách ho nenajdeš, takže obě můžeš vyřadit. Ze zbylých hledej tu, ve které je stromů málo a rozhodují traviny vysoké skoro jako člověk. Vyber její jméno.",
    ],
    explanation: "Popis odpovídá savaně. Leží v tropickém pásu mezi deštnými lesy a pouštěmi, prší tam jen půl roku a v době sucha traviny uschnou. Stromy se udrží jen jednotlivě, protože na souvislý les je srážek málo.",
  },
  {
    q: "Jak se jmenuje krajinná zóna u rovníku, kde je stále horko, srážky padají po celý rok a stromy tvoří několik pater?",
    correct: "Tropický deštný les",
    klic: "deštný",
    distractors: [
      { value: "Opadavý listnatý les", why: "Opadavý les shazuje listí na zimu a roste v mírném pásu, kde se střídají čtyři roční doby." },
      { value: "Severský jehličnatý les", why: "Jehličnatý les severu roste v chladném podnebí s dlouhou mrazivou zimou, ne u rovníku." },
      { value: "Travnatá savana", why: "V savaně je půl roku sucho a souvislý les tam nevznikne, stromy stojí jen jednotlivě." },
    ],
    hints: [
      "Nejdřív rozhodni podle teploty: která z nabízených krajin roste v pásu, kde nikdy nemrzne?",
      "U rovníku nejsou roční doby v našem smyslu — je stále horko a vydatně prší po celý rok. Rostliny tam proto nikdy nemusejí shazovat listí ani přečkávat sucho a rostou v několika patrech nad sebou. Vyber možnost, která takový les pojmenuje.",
    ],
    explanation: "Popis odpovídá tropickému deštnému lesu. Ročně tam spadne přes 2 000 mm srážek a průměrná teplota se drží kolem 26 °C, takže rostliny rostou po celý rok a tvoří několik pater nad sebou.",
  },
  {
    q: "Co znamená, že půda podléhá erozi?",
    correct: "Je odnášena vodou nebo větrem pryč z místa",
    klic: "odnášena",
    distractors: [
      { value: "Je poškozena solemi z dlouholetého zavlažování", why: "To je zasolení, jiný druh poškození. Tady jde o to, že půda z místa úplně zmizí." },
      { value: "Je rozorána pluhem do hlubokých brázd", why: "Orba půdu jen nakypří na místě. Poškození, o které jde, znamená ztrátu půdy z pozemku." },
      { value: "Je promrzlá až k matečné hornině", why: "Mráz půdu drobí, ale neodnáší. Rozhodující je tu ztráta půdy z místa, kde byla." },
    ],
    hints: [
      "Rozlišuj dvě různé věci: jestli se půda na místě jen změní, nebo jestli o ni pole přijde úplně.",
      "Voda a vítr fungují jako dopravní prostředek: naberou drobné částečky a odnesou je jinam. Jde tedy o poškození, po kterém je pole o vrstvu tenčí a hlína leží někde dole pod svahem. Vyber možnost, která mluví o odnosu, ne o změně na místě.",
    ],
    explanation: "Eroze je odnos půdy vodou nebo větrem. Nejvíc jí hrozí holé pole na svahu: dešťové kapky rozbijí povrch a stékající voda ornici odplaví. Vrstva, která vzniká stovky let, tak může zmizet během několika dešťů.",
  },
  {
    q: "Kdo v půdě rozkládá odumřelé zbytky rostlin a živočichů?",
    correct: "Půdní bakterie, houby a drobní živočichové jako žížaly",
    klic: "bakterie",
    distractors: [
      { value: "Kořeny rostlin, které si zbytky samy nasají i s živinami", why: "Kořeny přijímají živiny už rozpuštěné ve vodě. Odumřelou hmotu na ně musí nejdřív rozložit někdo jiný." },
      { value: "Déšť, který zbytky během několika hodin rozpustí", why: "Voda zbytky rozmělní a odplaví, na humus je ale mění živé organismy v půdě." },
      { value: "Mráz, který zbytky v zimě rozdrtí na drobný prach", why: "Mráz drobí horninu i zbytky, vlastní rozklad na humus však provádějí půdní organismy." },
    ],
    hints: [
      "Kdo v lese „uklidí“ spadané listí? Podívej se, co se pod hromadou listí na podzim hemží.",
      "Odumřelou hmotu mění na humus živá část půdy: od bakterií a hub, které nejsou vidět, až po žížaly, které listí vtahují do svých chodbiček. Bez nich by opad ležel na místě dál. Vyber možnost, ve které jsou právě tyhle organismy.",
    ],
    explanation: "Rozklad odumřelých zbytků obstarávají půdní organismy — bakterie, houby a drobní živočichové v čele se žížalami. Uvolní z nich živiny zpět do půdy a zbytek přemění na humus, takže koloběh látek může pokračovat.",
  },
  {
    q: "Co je zvětrávání?",
    correct: "Rozpad horniny na úlomky a přeměna jejích nerostů vodou",
    klic: "přeměna",
    distractors: [
      { value: "Změna odumřelých těl organismů na tmavý humus", why: "To je rozklad a starají se o něj půdní organismy. Tady jde o horninu, tedy o neživou část." },
      { value: "Postupný odnos svrchní úrodné vrstvy půdy vodou a větrem", why: "To je eroze, tedy ztráta už hotové půdy. Tady jde o to, jak se z horniny teprve stanou úlomky." },
      { value: "Usazování jemného prachu, který navál vítr z dálky", why: "Navátý prach půdu jen doplní. Zde jde o rozrušování pevné horniny přímo na místě." },
    ],
    hints: [
      "Voda zateče do praskliny, v zimě zmrzne a zvětší svůj objem. Co to s horninou udělá?",
      "Mráz a střídání tepla a chladu trhají horninu na menší a menší kousky, až z nich zůstane štěrk, písek a prach. Voda k tomu přidává druhou cestu: některé nerosty z horniny rozpouští a jiné mění na jílovou hmotu. Obojí je děj čistě neživý a probíhá přímo tam, kde hornina leží. Vyber možnost, ve které jsou obě cesty.",
    ],
    explanation: "Zvětrávání je rozrušování horniny přímo na místě, a to dvěma cestami zároveň. Mráz (voda v puklině zmrzne a zvětší objem) a střídání teplot ji drobí na úlomky, ze kterých je štěrk, písek a prach. Voda k tomu některé nerosty rozpouští a jiné přeměňuje na jíl. Z obojího vzniká nerostná část půdy, do které se pak přidá humus.",
  },
];

// ── L2 — POUŽITÍ: podnebí → krajina a půda, a obrácený směr ────────────────
/** Nabídky „krajina + půda“ jsou společné, aby se distraktory daly kombinovat. */
const Z = {
  tundra: "Tundra — tenká půda a porost mechů, lišejníků a keříků",
  tajga: "Tajga — jehličnatý les na kyselé půdě s pomalým rozkladem",
  step: "Step — travnatá pláň na černozemi s mocnou vrstvou humusu",
  savana: "Savana — vysoké traviny a ojedinělé stromy na suché půdě",
  prales: "Tropický deštný les — patra stromů na půdě chudé na živiny",
  pralesMyt: "Tropický deštný les — patra stromů na nejúrodnější půdě světa",
  poust: "Poušť — holý písek a štěrk a půda téměř bez humusu",
  les: "Listnatý les mírného pásu — hnědá lesní půda pod opadem",
} as const;

export const POOL_L2: Polozka[] = [
  {
    q: `V oblasti kolem ${sirka(68)} padne za rok asi ${cis(300)} mm srážek, nejteplejší měsíc má průměrně 7 °C a podloží zůstává i v létě do hloubky zmrzlé. Jaká krajina a jaká půda tam vzniknou?`,
    correct: Z.tundra,
    klic: "tundra",
    distractors: [
      { value: Z.tajga, why: "Jehličnaté stromy potřebují, aby jim podloží přes léto rozmrzlo a kořeny měly kam růst. Při zmrzlém podloží a 7 °C v nejteplejším měsíci se neuchytí." },
      { value: Z.step, why: "Travnatá pláň patří do mírného pásu s horkým létem. Při 7 °C v nejteplejším měsíci by souvislý travnatý porost nevyrostl." },
      { value: Z.poust, why: "Srážek je opravdu málo, ale v takovém chladu se voda skoro neodpařuje a zmrzlé podloží ji drží u povrchu, takže na nízký porost vláha stačí." },
    ],
    hints: [
      "Projdi popis po částech: daleko na severu, srážek málo a podloží i v létě zmrzlé. Co takové místo rostlinám dovolí?",
      "Kořeny potřebují rozmrzlou půdu a vzrostlé stromy potřebují delší léto než dva měsíce. Zůstanou proto jen nízké rostliny, kterým stačí pár centimetrů rozmrzlé vrstvy u povrchu. A protože se v chladu odumřelá hmota rozkládá pomalu, je i vrstva půdy tenká. Vyber možnost, která spojuje nízký porost s tenkou půdou.",
    ],
    explanation: `Na ${sirka(68)} je léto krátké a chladné a podloží zůstává trvale zmrzlé, takže kořeny nemají kam růst — vznikne tundra. Rozklad je v chladu pomalý a půda zůstává tenká, porost tvoří mechy, lišejníky a zakrslé keříky.`,
  },
  {
    q: `V oblasti kolem ${sirka(60)} padne za rok asi ${cis(500)} mm srážek, zima trvá půl roku a je mrazivá, léto je krátké a vlhké a vegetační období trvá sotva ${pad(3, "MĚSÍC")}. Jaká krajina a jaká půda tam vzniknou?`,
    correct: Z.tajga,
    klic: "tajga",
    distractors: [
      { value: Z.tundra, why: "Mechy a lišejníky by tu rostly, kdyby podloží zůstávalo zmrzlé. Tady přes léto rozmrzne, takže se uchytí i vzrostlé stromy." },
      { value: Z.les, why: "Opadavým stromům by tříměsíční vegetační období nestačilo: musely by každý rok znovu vytvořit celé olistění a pak ho shodit." },
      { value: Z.step, why: "Travnatá pláň vzniká tam, kde je pro stromy málo srážek. Tady jich padne asi 500 mm a léto je vlhké, takže les se udrží." },
    ],
    hints: [
      "Zima je tvrdá, ale podloží přes léto rozmrzne. Stačí to na souvislý les, nebo jen na nízké rostliny?",
      "Když podloží v létě rozmrzne, mají kořeny kam růst a les se udrží. Krátké léto ale zvládnou hlavně stromy, které nemusejí každý rok obnovovat celé olistění. Jejich opad se v chladu rozkládá pomalu, takže půda pod nimi kysne a humusu je v ní málo. Vyber možnost, která tomu odpovídá.",
    ],
    explanation: `Na ${sirka(60)} s vlhkým, ale krátkým létem vzniká tajga. Podloží přes léto rozmrzne, takže se udrží les jehličnatých stromů, které nemusejí každý rok tvořit nové olistění. Jejich opad se rozkládá pomalu a okyseluje půdu, proto je humusu málo.`,
  },
  {
    q: `V oblasti kolem ${sirka(48)} padne za rok asi ${cis(400)} mm srážek, léto je horké a suché, zima mrazivá a srážky přicházejí hlavně na jaře. Jaká krajina a jaká půda tam vzniknou?`,
    correct: Z.step,
    klic: "step",
    distractors: [
      { value: Z.poust, why: "Při 400 mm srážek za rok porost nezmizí. Holý povrch bez rostlin začíná až pod 250 mm ročních srážek." },
      { value: Z.les, why: "Na souvislý listnatý les je 400 mm srážek málo, zvlášť když v létě přichází sucho. Stromy potřebují vláhu i v době růstu." },
      { value: Z.savana, why: "Takové střídání období dešťů a období sucha při celoročním horku patří do tropů. Na 48° je mrazivá zima, takže o tropickou krajinu nejde." },
    ],
    hints: [
      "Srážek je asi 400 mm a hlavně na jaře. Komu to stačí: stromům, které potřebují vláhu celé léto, nebo travám?",
      "Trávy stihnou vyrůst a vysemenit se z jarní vláhy a suché léto přečkají v kořenech. Stromům by srážek nestačilo. Tráva každý rok odumře i s hustými kořeny, takže se v půdě nastřádá mocná tmavá vrstva bohatá na humus. Vyber možnost, která takhle spojuje porost s půdou.",
    ],
    explanation: `Na ${sirka(48)} se 400 mm srážek a suchým létem vzniká step. Stromům je vláhy málo, travám stačí jarní srážky. Každoročně odumřelé kořeny travin se mění na humus, proto se pod stepí vytvořily černozemě — nejúrodnější půdy světa.`,
  },
  {
    q: `V oblasti kolem ${sirka(12)} padne za rok asi ${cis(900)} mm srážek, teplo je po celý rok a pravidelně se střídá období dešťů s obdobím sucha. Jaká krajina a jaká půda tam vzniknou?`,
    correct: Z.savana,
    klic: "savana",
    distractors: [
      { value: Z.prales, why: "Souvislý les několika pater potřebuje srážky po celý rok. Tady přijde půlroční sucho, které by stromy v patrech nepřečkaly." },
      { value: Z.step, why: "Travnatá pláň mírného pásu má mrazivou zimu a jarní srážky. Tady je teplo po celý rok, takže jde o tropickou krajinu." },
      { value: Z.poust, why: "Při 900 mm srážek za rok porost nezmizí. Po deštích tu traviny vyrostou skoro do výšky člověka." },
    ],
    hints: [
      "Teplo po celý rok znamená tropy. Rozhodni tedy jen mezi tropickými krajinami podle toho, jak jsou rozložené srážky.",
      "Deště přicházejí jen půl roku, takže na souvislý les několika pater to nestačí — ten potřebuje vláhu pořád. Traviny to ale zvládnou: v době dešťů rychle vyrostou a v suchu uschnou. Stromy se udrží jen jednotlivě a půda v době sucha vysychá. Vyber možnost, která to takhle popisuje.",
    ],
    explanation: `Na ${sirka(12)} s 900 mm srážek a půlročním suchem vzniká savana. Vláha stačí na vysoké traviny, ne na souvislý les, takže stromy stojí jen jednotlivě. V období sucha traviny uschnou a půda vysychá a tvrdne.`,
  },
  {
    q: `V oblasti kolem ${sirka(3)} spadne za rok přes ${cis(2000)} mm srážek, průměrná teplota se drží kolem 26 °C a suché období nepřichází. Jaká krajina a jaká půda tam vzniknou?`,
    correct: Z.prales,
    klic: "chudé na živiny",
    distractors: [
      { value: Z.pralesMyt, why: "Krajinu máš správně, ale půdu ne: živiny jsou tu uložené v samotných rostlinách a hned se vracejí do koloběhu. Půda je sice mocná, ale humusu má jen tenkou vrstvu a vydatné deště z ní živiny vyplavují do hloubky." },
      { value: Z.savana, why: "Vysoké traviny s ojedinělými stromy vzniknou tam, kde se střídá období dešťů a sucha. Tady prší po celý rok, takže se udrží souvislý les." },
      { value: Z.les, why: "Opadavý les mírného pásu shazuje listí na zimu. U rovníku se roční doby v našem smyslu nestřídají, takže listí shazovat nemusí." },
    ],
    hints: [
      "Rozděl rozhodování na dva kroky: nejdřív jaký porost, potom jaká půda tam pod stromy vznikne.",
      "Stálé teplo a vydatné srážky po celý rok znamenají souvislý les, ve kterém rostliny rostou nepřetržitě a tvoří několik pater. Pozor ale na druhou část odpovědi: rozkladači tu v teple a vlhku pracují tak rychle, že uvolněné živiny hned přeberou kořeny, a co zbude, spláchne déšť do hloubky. Rozmysli si tedy, kde je v takovém lese uložena zásoba živin — v půdě, nebo v samotných rostlinách.",
    ],
    explanation: `U rovníku při srážkách přes 2 000 mm a teplotě kolem 26 °C roste tropický deštný les. Vrstva půdy je tam díky stálému teplu a vlhku mocná, ale na živiny chudá: humusu je jen tenká vrstva při povrchu, zásoba živin je uložená v samotných rostlinách a vydatné deště ji z půdy vyplavují do hloubky.`,
  },
  {
    q: `V oblasti kolem ${sirka(25)} padne za rok sotva ${cis(100)} mm srážek, přes den je velké horko a v noci teplota prudce klesá. Jaká krajina a jaká půda tam vzniknou?`,
    correct: Z.poust,
    klic: "poušť",
    distractors: [
      { value: Z.step, why: "Souvislý travnatý porost potřebuje aspoň několikanásobek těchto srážek. Při 100 mm za rok se trávník neudrží." },
      { value: Z.savana, why: "Vysoké traviny savany vyrostou v období dešťů, kdy spadne kolem 900 mm. Tady žádné období dešťů nepřijde." },
      { value: Z.les, why: "Les mírného pásu potřebuje srážky rozložené po celém roce a mírnou zimu. Zde je srážek zhruba sedmkrát méně." },
    ],
    hints: [
      "Začni u čísla srážek a porovnej ho s tím, co potřebuje souvislý travnatý porost.",
      "Sto milimetrů za rok je asi sedmina toho, co spadne u nás. Na takové místo se dostane jen několik zvláště odolných rostlin, a tak na zem padá málo odumřelé hmoty. Vyber možnost, ve které je povrch prakticky holý a humusu v půdě skoro žádný.",
    ],
    explanation: `Při ročních srážkách pod 250 mm vzniká poušť. Rostlin je málo, takže do půdy padá málo odumřelé hmoty a humusu je v ní minimum. Povrch tvoří hlavně písek, štěrk a holá skála a velké rozdíly teplot navíc horninu drolí.`,
  },
  {
    q: `V oblasti kolem ${sirka(50)} padne za rok asi ${cis(700)} mm srážek, střídají se čtyři roční doby a zima je mírná, bez půlročních mrazů. Jaká krajina a jaká půda tam vzniknou?`,
    correct: Z.les,
    klic: "hnědá lesní",
    distractors: [
      { value: Z.tajga, why: "Jehličnaté lesy severu patří k půlroční mrazivé zimě. Tady je zima mírná, takže se udrží i stromy, které na zimu shazují listí." },
      { value: Z.step, why: "Bezlesá travnatá pláň vzniká tam, kde je pro stromy málo srážek. Při 700 mm rozložených po celém roce les vyroste." },
      { value: Z.tundra, why: "Mechy a lišejníky se prosadí až tam, kde je podloží trvale zmrzlé. Při mírné zimě a 700 mm srážek roste les." },
    ],
    hints: [
      "Čtyři roční doby a mírná zima jsou znakem jednoho pásu. Jaké stromy si takové podmínky mohou dovolit?",
      "Sedm set milimetrů srážek rozložených po celém roce stromům bohatě stačí, takže vznikne souvislý les. Mírná zima navíc dovolí stromům, aby listí na zimu shodily a na jaře vytvořily nové. Jejich opad se rozkládá rychleji než jehličí, takže půda pod ním není kyselá. Vyber možnost, která tomu odpovídá.",
    ],
    explanation: `Na ${sirka(50)} při 700 mm srážek a mírné zimě roste listnatý a smíšený les mírného pásu. Opadané listí se rozkládá poměrně rychle, proto pod ním vzniká hnědá lesní půda — středně úrodná, s vrstvou opadu na povrchu.`,
  },
  {
    q: "Proč je v tundře vrstva půdy tenká a humusu je v ní málo?",
    correct: "V chladu vzniká půda velmi pomalu a zmrzlé podloží jí nedovolí sahat hlouběji",
    klic: "chladu",
    distractors: [
      { value: "Rostliny tam nerostou vůbec, a tak se nemá z čeho vytvořit ani tenká vrstva", why: "Rostliny tam rostou, jen nízké — mechy, lišejníky a zakrslé keříky. Půdu brzdí hlavně chlad a trvale zmrzlé podloží." },
      { value: "Silný vítr odnese všechnu ornici dřív, než se stihne vytvořit", why: "Vítr tam fouká, ale souvislý porost mechů a keříků povrch drží. Rozhodující je pomalé zvětrávání v chladu." },
      { value: "Voda z tajícího sněhu vyplaví humus hluboko do podloží", why: "Zmrzlé podloží vodu nepropouští, takže zůstává u povrchu a krajina se podmáčí. Humusu je málo kvůli pomalému rozkladu." },
    ],
    hints: [
      "Půda vzniká dvěma pomalými ději: rozpadem horniny a rozkladem odumřelé hmoty. Jak oba probíhají při teplotě kolem nuly?",
      "Rozkladači i zvětrávání pracují tím pomaleji, čím je chladněji — proto se tu za stejnou dobu vytvoří mnohem méně půdy než u nás. A i kdyby se tvořila rychleji, narazí pár desítek centimetrů pod povrchem na vrstvu, která nikdy nerozmrzne. Vyber možnost, která pracuje s teplotou, ne s odnosem půdy.",
    ],
    explanation: "V tundře je rozhodující chlad: hornina zvětrává pomalu a odumřelé zbytky se rozkládají také pomalu, takže půdy přibývá jen nepatrně. Navíc pod povrchem leží trvale zmrzlá vrstva, do které kořeny ani půda nemohou.",
  },
  {
    q: "Proč je ve stepi mocná vrstva tmavé půdy bohaté na humus?",
    correct: "Traviny každý rok odumírají i s hustými kořeny a jejich zbytky zůstanou v půdě",
    klic: "traviny",
    distractors: [
      { value: "Padá tam hodně srážek a ty do půdy splaví živiny z okolí", why: "Srážek je ve stepi jen asi 400 mm za rok. Humus dodává každoročně odumírající travnatý porost, ne voda." },
      { value: "Rozkládá se tam každý podzim opadané listí stromů, kterých je v krajině plno", why: "Stromy ve stepi prakticky nerostou. Odumřelou hmotu dodávají trávy, hlavně jejich husté kořeny v půdě." },
      { value: "Vysoké letní teploty samy promění horninu pod polem v humus", why: "Teplo rozklad urychlí, ale humus vzniká jen z odumřelých těl organismů. Z horniny se stane písek a jíl, ne humus." },
    ],
    hints: [
      "Kde má tráva většinu své hmoty — nad zemí, nebo pod ní? A co se s tou částí děje každý podzim?",
      "Nadzemní část travnatého porostu je jen menšina, pod povrchem je hustá spleť kořenů. Ta každou zimu odumře a na jaře se obnoví, takže se do půdy rok co rok dostane velké množství odumřelé hmoty přímo do hloubky. Vyber možnost, která pracuje právě s tímto opakovaným odumíráním.",
    ],
    explanation: "Stepní trávy mají většinu hmoty v hustých kořenech. Ty každý rok odumírají přímo v půdě a mění se na humus, takže se tmavá vrstva neustále doplňuje do hloubky. Tak vznikly černozemě, nejúrodnější půdy světa.",
  },
  {
    q: "Proč má tropický deštný les půdu chudou na živiny, i když v něm roste tolik rostlin?",
    correct: "Živiny jsou uložené v rostlinách a vydatné deště je z půdy rychle vyplaví",
    klic: "vyplaví",
    distractors: [
      { value: "Rostliny tam rostou rovnou na holé hornině a žádná půda pod nimi není", why: "Půda tam je, a v trvalém teple a vlhku dokonce mocná. Živiny v ní ale nevydrží, protože je hned přeberou kořeny a zbytek spláchne déšť." },
      { value: "Rozkladači v tom horku nepracují, takže se odumřelá hmota vůbec nemění", why: "V teple a vlhku pracují rozkladači nejrychleji na světě. Právě proto živiny v půdě nezůstanou ležet." },
      { value: "Půdu odnáší vítr, protože je pod korunami stromů trvale sucho", why: "Pod hustým lesem skoro nefouká a sucho tam není. Půda chudne vyplavováním živin, ne odnosem větrem." },
    ],
    hints: [
      "Zamysli se, kde je v takovém lese uložena většina živin: v půdě, nebo v samotných rostlinách?",
      "Spadlý list tu zmizí za pár týdnů a uvolněné živiny hned přeberou kořeny, které jsou nahloučené těsně pod povrchem. V půdě tak nemá co zůstat — a to málo, co zbude, spláchne do hloubky každodenní liják. Bujný porost proto o úrodnosti půdy nic neříká.",
    ],
    explanation: "Zásoba živin tropického deštného lesa není v půdě, ale v živých rostlinách. Rozklad je tak rychlý, že se živiny okamžitě vracejí kořenům, a vydatné deště zbytek vyplaví do hloubky. Proto je i mocná tropická půda na živiny chudá a humusu má jen tenkou vrstvu při povrchu.",
  },
  {
    q: "Proč je půda pod severským jehličnatým lesem chudá na humus a kyselá?",
    correct: "Opad se v chladu rozkládá pomalu a při rozkladu půdu okyseluje",
    klic: "opad",
    distractors: [
      { value: "Stromy si všechen humus z půdy nasají a uloží ho do dřeva", why: "Stromy přijímají rozpuštěné živiny, humus samotný ale nespotřebovávají. Kyselost způsobuje pomalý rozklad jehličí." },
      { value: "Sníh, který tam leží půl roku, půdu postupně rozpustí", why: "Sníh půdu neruší, spíš ji chrání před mrazem. Kyselá reakce vzniká z jehličí, které se rozkládá pomalu." },
      { value: "Časté požáry spálí odumřelou hmotu dřív, než se rozloží", why: "Požáry se tam občas objeví, ale kyselá a chudá půda je tam i bez nich. Rozhoduje pomalý chladný rozklad." },
    ],
    hints: [
      "Porovnej dvě věci: jak rychle mizí listí u nás v listnatém lese a jak rychle mizí jehličí na severu.",
      "Jehlice jsou tvrdé, pokryté voskem a rozkladačům dlouho odolávají — a v chladu jde všechno ještě pomaleji. Na zemi se proto hromadí silná vrstva nerozložených zbytků a při jejich pomalém rozkladu se uvolňují látky, které půdu okyselují. Vyber možnost, která pracuje s tímhle pomalým rozkladem.",
    ],
    explanation: "Jehličí se rozkládá pomalu a v chladu ještě pomaleji, takže na zemi leží roky a půda pod ním kysne. Humusu se proto nastřádá málo a živiny se vyplavují do hloubky — vznikne chudá kyselá půda, v Česku známá hlavně z horských lesů.",
  },
  {
    q: "Proč je v pouštní půdě humusu téměř nula?",
    correct: "Roste tam málo rostlin, takže na zem padá málo odumřelé hmoty",
    klic: "odumřelé",
    distractors: [
      { value: "Písek humus pohltí a promění ho zpátky na horninu", why: "Písek je jen drobná hornina a humus v něm nezaniká. Chybí proto, že se nemá z čeho vytvořit." },
      { value: "Velké denní horko humus spálí hned, jak se v půdě stihne vytvořit", why: "Horko rozklad urychlí, ale samo humus nezničí. Hlavní příčinou je, že odumřelé hmoty je málo." },
      { value: "Noční mráz humus rozdrtí na prach, který odvane vítr", why: "Chlad rozklad naopak zpomaluje. Rozhoduje nedostatek rostlin, tedy nedostatek materiálu pro humus." },
    ],
    hints: [
      "Z čeho humus vzniká? A najde se toho na poušti dost?",
      "Humus se tvoří z toho, co na zem spadne a rozloží se: z listů, stébel, kořenů a těl drobných živočichů. Tam, kde se rostlina udrží jen tu a tam mezi kameny, se takového materiálu sejde nepatrně, a tak se ani při nejlepší vůli nemá z čeho vytvořit. Vyber možnost, která pracuje právě s tímto nedostatkem.",
    ],
    explanation: "Humus vzniká jedině z odumřelých zbytků organismů. Na poušti rostlin téměř není, takže do půdy prakticky nic nepřibývá — půda je tam proto jen zvětralá hornina bez tmavé úrodné vrstvy.",
  },
  {
    q: "Proč má listnatý les mírného pásu úrodnější půdu než les severský?",
    correct: "Opadané listí se ve vlhkém teple rozloží rychleji a dodá víc humusu",
    klic: "rychleji",
    distractors: [
      { value: "Listnatých stromů roste v každém takovém lese vždycky mnohem víc než jiných", why: "O úrodnosti nerozhoduje počet stromů, ale to, jak rychle se jejich opad mění na humus." },
      { value: "V mírném pásu prší tolik, že s vodou do půdy přibývá i humus", why: "Voda humus nepřináší, spíš ho z půdy vyplavuje. Humus vzniká rozkladem odumřelé hmoty na místě." },
      { value: "Listnaté stromy mají kořeny, které humus samy vyrábějí", why: "Kořeny živiny přijímají a po odumření se na humus mění, samy ho ale nevyrábějí. Dělají to rozkladači." },
    ],
    hints: [
      "Porovnej, co se stane se spadaným listím u nás do jara a co s jehličím na severu za stejnou dobu.",
      "Úrodnost nezávisí jen na tom, kolik opadu spadne, ale hlavně na tom, jak rychle se změní na humus. Rozkladačům svědčí teplo a vláha a vadí jim chlad a tvrdý voskovitý opad. Vyber možnost, která staví na rozdílné rychlosti téhle přeměny.",
    ],
    explanation: "Rozhoduje rychlost rozkladu: měkké listí se v mírném pásu rozloží zhruba během roku, kdežto jehličí na chladném severu leží roky. V listnatém lese se proto humus průběžně doplňuje a vzniká úrodnější hnědá lesní půda.",
  },
  {
    q: "Jaká půda vznikne pod hustým travnatým porostem mírného pásu, kde je horké a suché léto?",
    correct: "Černozem s mocnou tmavou vrstvou bohatou na humus",
    klic: "černozem",
    distractors: [
      { value: "Kyselá půda s mocnou vrstvou nerozloženého jehličí", why: "Taková půda vzniká pod jehličnatým lesem chladného severu. Pod travnatým porostem se hromadí humus z odumřelých kořenů." },
      { value: "Tenká půda ležící na trvale zmrzlém podloží", why: "To je půda tundry. V mírném pásu s horkým létem žádné trvale zmrzlé podloží není." },
      { value: "Vysychavá červená půda chudá na humus", why: "Taková půda patří do tropů se střídáním dešťů a sucha. V mírném pásu se pod travinami humus udrží." },
    ],
    hints: [
      "Trávy mají většinu hmoty v kořenech a ty každý rok odumřou. Kam se ta hmota poděje?",
      "Odumřelé kořeny se rozkládají přímo v půdě, a to rovnou do hloubky — ne jen na povrchu jako spadané listí. Suché léto navíc rozklad na pár měsíců zabrzdí, takže se humus nestihne spotřebovat a hromadí se. Vyber možnost, která takovou půdu pojmenuje.",
    ],
    explanation: "Pod travnatým porostem se humus hromadí do hloubky, protože odumírají hlavně husté kořeny. Suché léto rozklad navíc přibrzdí. Tak vznikla černozem — nejúrodnější půda, u nás na jižní Moravě a v Polabí.",
  },
];

// ── L3 — ANALÝZA A PŘENOS: příčina jevu nebo rozhodnutí v neznámém případě ─
export const POOL_L3: Polozka[] = [
  {
    q: "Ze strmého svahu vykácel majitel les. Po prvním vydatném dešti byla většina ornice pryč. Co bylo hlavní příčinou?",
    correct: "Déšť dopadal na nechráněnou půdu a splavil ji po svahu dolů",
    klic: "splavil",
    distractors: [
      { value: "Déšť byl toho roku silnější než jindy, na kácení nezáleželo", why: "Stejný déšť by v lese škodu neudělal: koruny tlumí náraz kapek a kořeny drží půdu. Rozhodl chybějící porost." },
      { value: "Pokácené stromy odnesly ornici na svých kořenech s sebou", why: "Na kořenech ulpí jen nepatrná část půdy. Ornici odnesla voda, protože ji po kácení nemělo co zadržet." },
      { value: "Holá půda na slunci vyschla a rozpadla se na jemný prach", why: "Vyschlou půdu odnáší hlavně vítr a trvá to déle. Tady ji během jediného deště odplavila stékající voda." },
    ],
    hints: [
      "Porovnej, co dělá dešťová kapka, když dopadne do lesa, a co, když dopadne na holou hlínu na svahu.",
      "V lese kapky nejdřív narazí do listí a stékají po kmenech, půdu drží kořeny a voda se stihne vsáknout. Na holém svahu kapka udeří přímo do povrchu, rozbije ho a voda se nestihne vsakovat — začne téci po svahu a bere hlínu s sebou. Vyber možnost, která spojuje kácení s tím, co pak udělala voda.",
    ],
    explanation: "Les chrání půdu dvakrát: korunami tlumí náraz kapek a kořeny půdu drží pohromadě. Po vykácení dopadá déšť přímo na povrch, voda se nevsakuje a stéká po svahu i s ornicí. Vrstva, která vznikala stovky let, tak zmizí během jednoho deště.",
  },
  {
    q: "Pole vypálené uprostřed tropického deštného lesa dává dobrou úrodu jen dva tři roky a pak přestane rodit. Proč?",
    correct: "Živiny byly uložené v rostlinách a deště je z holé půdy brzy vyplavily",
    klic: "vyplavily",
    distractors: [
      { value: "Půda tam měla tlustou vrstvu humusu a plodiny ji rychle vyčerpaly", why: "Tlustá vrstva humusu tam není — půda deštného lesa bývá mocná, ale humusu má jen tenkou vrstvu a živin málo. Zásoba živin byla v samotných rostlinách." },
      { value: "Popel z vypálených stromů půdu natrvalo zasolil a spálil", why: "Popel naopak na první roky živiny dodá. Zasolení hrozí jinde: při dlouhém zavlažování v suchých oblastech." },
      { value: "Plodinám tam chybělo teplo, a proto po čase přestaly růst", why: "Teplo je v tropech po celý rok. Úroda skončí proto, že v půdě nezůstanou živiny." },
    ],
    hints: [
      "Rozmysli si dva kroky: kde byly živiny uložené, dokud les stál, a kam se poděly, když les shořel.",
      "Dokud les stál, kolovaly živiny stále dokola mezi rostlinami a tenkou vrstvou humusu při povrchu a kořeny je hned zachytily. Po vypálení zůstal popel na holé půdě a už nebylo nic, co by je udrželo — každodenní lijáky je během několika let odnesly do hloubky. Vyber možnost, která pracuje s tímhle přesunem živin.",
    ],
    explanation: "Zásoba živin tropického lesa je v rostlinách, ne v půdě. Popel po vypálení dodá živiny na dva tři roky, pak je vydatné deště z holé půdy vyplaví do hloubky a pole přestane rodit. Proto se taková pole opouštějí a vypaluje se další kus lesa.",
  },
  {
    q: "Pole v suché oblasti se desítky let zavlažovalo. Dnes má na povrchu bílý povlak a nic na něm neroste. Co se stalo?",
    correct: "Voda se v horku vypařila a rozpuštěné soli po ní zůstaly v půdě",
    klic: "soli",
    distractors: [
      { value: "Čím víc se pole zalévá, tím je úrodnější — bílá vrstva je humus", why: "Humus je tmavý, ne bílý. Zalévání v horku půdě navíc uškodí: odpařená voda v ní nechá to, co přinesla rozpuštěné." },
      { value: "Voda vyplavila z půdy všechen humus a zbyl po něm bílý písek", why: "Vyplavování živin hrozí ve vlhkých tropech. V suché oblasti se voda odpaří dřív, než stihne něco odnést." },
      { value: "Bílý povlak je vápenec, který na povrch vytlačily kořeny rostlin", why: "Kořeny horninu na povrch nedostanou. Bílá vrstva vznikla z látek, které do půdy přinesla zavlažovací voda." },
    ],
    hints: [
      "Voda nikdy není úplně čistá. Co z ní zůstane, když se v horku odpaří — a co odejde pryč?",
      "Při odpařování odchází jen samotná voda, všechno, co v ní bylo rozpuštěné, zůstane na místě. Když se takhle pole zalévá desítky let, přibývá toho v půdě rok co rok trochu víc, až vznikne souvislá bílá kůra, ve které kořeny nepřežijí. Vyber možnost, která tenhle postupný nános vysvětlí.",
    ],
    explanation: "Zavlažovací voda vždy obsahuje rozpuštěné soli. V horku se voda odpaří a soli zůstanou v půdě — rok co rok jich přibývá, až vytvoří bílou kůru, ve které rostliny neporostou. Tomuto poškození se říká zasolení.",
  },
  {
    q: "Dvě místa leží na stejné zeměpisné šířce. Na prvním roste hustý les, na druhém jen nízké traviny a mechy. Čím to nejspíš je?",
    correct: "Druhé místo leží vysoko nad mořem, kde je podstatně chladněji",
    klic: "nad mořem",
    distractors: [
      { value: "Druhé místo leží blíž k pólu, a proto je na něm chladněji", why: "Blíž k pólu být nemůže: obě místa mají stejnou zeměpisnou šířku, tedy stejnou vzdálenost od rovníku." },
      { value: "Druhé místo přitahuje Země slaběji, a tak tam stromy nerostou", why: "Přitažlivost je na Zemi prakticky stejná a s růstem stromů nesouvisí. Rozhoduje teplota." },
      { value: "Druhé místo nemá žádnou půdu, protože tam nikdy nepršelo", why: "Bez srážek by nerostly ani traviny a mechy. Porost se mění proto, že s výškou ubývá tepla." },
    ],
    hints: [
      "Zeměpisná šířka je u obou stejná, takže sluneční paprsky dopadají stejně šikmo. Co jiného ještě teplotu srazí dolů?",
      "Teplota neklesá jen směrem k pólům, ale také směrem vzhůru — asi o 0,6 °C na každých sto metrů výstupu. Krajina se proto při výstupu mění podobně jako při cestě na sever: les nejdřív zřídne a nahoře zůstanou jen nízké rostliny. Vyber možnost, která pracuje s výškou nad hladinou moře.",
    ],
    explanation: "Kromě šířkové pásmovitosti (podle vzdálenosti od rovníku) existuje i výšková stupňovitost. S každými sto metry výšky ubude asi 0,6 °C, takže na stejné šířce najdeš dole les a nahoře bezlesou krajinu podobnou tundře.",
  },
  {
    q: "Zemědělec hospodaří na svažitém poli a chce zabránit ztrátě ornice. Které opatření mu opravdu pomůže?",
    correct: "Orat po vrstevnici, tedy napříč svahem, a ponechat travnaté meze",
    klic: "vrstevnici",
    distractors: [
      { value: "Orat po spádnici shora dolů, aby voda z pole rychleji odtekla", why: "Brázdy vedené po spádu udělají z pole dráhy pro vodu a ta ornici odnese rychleji. Vodu je potřeba naopak zdržet." },
      { value: "Rozorat meze i keře, aby vzniklo jedno velké nepřerušené pole", why: "Meze a keře vodu i vítr brzdí. Po jejich rozorání se dráha vody prodlouží a odnos půdy zesílí." },
      { value: "Nechat pole přes zimu holé, aby mráz půdu pořádně rozdrobil", why: "Holá půda je proti dešti a tání bezbranná. Přes zimu ji nejlépe ochrání porost, například meziplodina." },
    ],
    hints: [
      "Půdu ze svahu odnáší tekoucí voda. Chceš jí tedy cestu dolů usnadnit, nebo co nejvíc zkomplikovat?",
      "Čím rychleji voda po svahu teče a čím delší dráhu má, tím víc hlíny unese. Pomůže proto všechno, co jí postaví do cesty překážku napříč sklonem a donutí ji zpomalit a vsáknout se. Vyber možnost, která pracuje právě s takovou překážkou přes celé pole.",
    ],
    explanation: "Proti erozi na svahu funguje všechno, co vodě zkrátí a zpomalí cestu dolů: orba napříč sklonem, travnaté meze, remízky (pruhy trávy a keřů mezi poli) a trvalý porost. Naopak orba po spádu a rozorané meze odnos půdy zrychlí.",
  },
  {
    q: "Po scelení pozemků do velkých lánů začal z rovinatého pole odnášet vítr svrchní vrstvu půdy. Co odnosu zabrání nejlépe?",
    correct: "Pole rozdělit pásy stromů a keřů, které vítr při zemi zbrzdí",
    klic: "pásy",
    distractors: [
      { value: "Pole častěji orat, aby povrch zůstal kyprý a lépe nasákavý", why: "Kyprá holá půda se odnáší nejsnáz. Vítr je potřeba zpomalit a povrch přikrýt porostem." },
      { value: "Pole pravidelně zalévat, aby zvlhlá půda větru lépe odolala", why: "Vlhkost pomůže na pár hodin, po vyschnutí je problém zpátky. Trvale pomůže překážka, která vítr zbrzdí." },
      { value: "Pole ještě zvětšit, aby se vítr na širší ploše lépe rozptýlil", why: "Na delší volné ploše vítr naopak nabere rychlost a odnese víc půdy. Potřebuje překážky, ne prostor." },
    ],
    hints: [
      "Proč se odnos objevil až po scelení? Co na poli po zrušení mezí zmizelo?",
      "Vítr nabírá rychlost na dlouhé volné ploše: čím delší rozběh, tím víc suché hlíny unese. Dřív mu v tom bránily meze, křoviny a stromořadí mezi malými poli. Pomůže proto všechno, co velkou plochu zase rozdělí a vítr u země zpomalí. Vyber možnost, která takovou překážku obnoví.",
    ],
    explanation: "Větrná eroze hrozí hlavně na velkých rovinatých lánech bez překážek. Pásy stromů a keřů (větrolamy) vítr při zemi zpomalí, takže nemá sílu suchou půdu zvedat. Pomáhá také dělení lánů a porost přes zimu.",
  },
  {
    q: "Na okraji suché oblasti se pase tolik dobytka, že tráva nestačí dorůstat, a krajina se mění v poušť. Proč?",
    correct: "Stáda spasou porost a holou půdu pak rozvane vítr a odplaví déšť",
    klic: "holou",
    distractors: [
      { value: "Dobytek svým dechem oteplí vzduch natolik, že přestane pršet", why: "Stáda podnebí takto nemění. Krajina pustne proto, že přišla o porost a s ním i o půdu." },
      { value: "Dobytek vypije všechnu podzemní vodu, která v celém kraji je", why: "Stáda spotřebují jen zlomek zásob. Rozhodující je zničený porost, po kterém mizí nechráněná půda." },
      { value: "Spasená tráva vypouští do půdy jed, který brání růstu nové", why: "Trávy nic takového nevylučují. Nové rostlině chybí hlavně půda, kterou mezitím odnesl vítr a voda." },
    ],
    hints: [
      "Rozděl si to na dva kroky: co se stane nejdřív s porostem a co teprve potom s půdou pod ním.",
      "Dokud rostliny povrch kryjí, drží kořeny půdu na místě a listy tlumí náraz kapek i sílu větru. Když je dobytek spase rychleji, než stačí dorůst, zůstane holý povrch bez ochrany — a v suché oblasti je půdy málo a obnovuje se pomalu, takže se už nevrátí. Vyber možnost, která tenhle sled kroků popisuje.",
    ],
    explanation: "Nadměrná pastva odstraní porost a holou půdu pak odnese vítr i přívalový déšť. Bez půdy se rostliny nemají kde uchytit a poušť se rozšíří na dříve travnatou krajinu. Tomuto ději se říká dezertifikace.",
  },
  {
    q: "V severském jehličnatém lese leží opad na zemi celé roky, v tropickém deštném lese je spadlé listí pryč za pár týdnů. Čím to je?",
    correct: "V teple a vlhku pracují rozkladači mnohem rychleji než v chladu",
    klic: "vlhku",
    distractors: [
      { value: "Jehlice jsou z tak tvrdého dřeva, že se rozložit vůbec nedají", why: "Rozložit se dá i jehličí, jen to v chladu trvá roky. Rychlost rozkladu určuje hlavně teplota a vlhkost." },
      { value: "V tropickém lese spadlé listí odplaví déšť dřív, než se rozloží", why: "Déšť listí přemísťuje, ale nezničí. Mizí proto, že ho půdní organismy v teple rychle spotřebují." },
      { value: "Na severu se rozkladači v půdě vůbec nevyskytují, na jihu ano", why: "Půdní organismy žijí i v chladu, jen pracují pomalu. Proto tam opad leží mnohem déle." },
    ],
    hints: [
      "Rozklad obstarávají živé organismy. Za jakého počasí bývají nejaktivnější a kdy naopak skoro nepracují?",
      "Půdní organismy potřebují ke své práci stejné podmínky jako většina života. Na severu jsou proto aktivní jen pár týdnů v roce, u rovníku naopak nepřetržitě. Stejný list tak na jednom místě vydrží roky a na druhém zmizí během pár týdnů. Vyber možnost, která staví na podmínkách pro jejich práci, ne na tvrdosti opadu.",
    ],
    explanation: "Rychlost rozkladu řídí hlavně teplota a vlhkost. U rovníku pracují půdní organismy nepřetržitě, takže opad zmizí za pár týdnů. Na chladném severu jsou aktivní jen krátce v létě, proto se opad hromadí a půda kysne.",
  },
  {
    q: "Na horském hřbetu je vrstva půdy tenká, i když tam padá hodně srážek. Proč?",
    correct: "Zvětralý materiál se ze svahu splavuje dolů rychleji, než stačí vznikat",
    klic: "splavuje",
    distractors: [
      { value: "Ve výšce je vzduch řidší, takže se hornina vůbec nerozpadá", why: "Hornina se ve výšce rozpadá naopak rychle, hlavně vlivem mrazu. Půda se tam ale neudrží." },
      { value: "Déšť horninu rozpustí, takže z ní žádná půda nemůže vzniknout", why: "Rozpustit se dá jen část hornin a trvá to velmi dlouho. Vrstva je tenká proto, že materiál odtéká po svahu." },
      { value: "Vysoko nad mořem se odumřelá hmota mění rovnou zpátky na pevnou horninu", why: "Odumřelá hmota se mění na humus, ne na kámen. Půda je tenká proto, že ji svah neudrží." },
    ],
    hints: [
      "Půda na svahu se netvoří jen tam, kde leží. Přemýšlej i o tom, co s ní dělá tekoucí voda.",
      "Na vrcholu a na prudkém svahu nemá rozpadlá hornina kde zůstat: pokaždé, když prší, část ho odteče níž. Dole na úpatí se naopak hromadí a bývá tam půda mocná. Vyber možnost, která pracuje s přesunem materiálu po svahu, ne s tím, že by se nestihl vytvořit.",
    ],
    explanation: "Na hřbetu a na prudkém svahu voda zvětralý materiál stále odnáší dolů, takže se vrstva nestihne vytvořit. Proto je v horách půda tenká a kamenitá, kdežto na úpatí a v nížinách jsou půdy mocné.",
  },
  {
    q: "Rodina nechala na podzim svažitý záhon bez porostu a na jaře našla na jeho spodním okraji nános hlíny. Co se stalo?",
    correct: "Tající sníh a déšť odnesly část nekryté půdy po svahu dolů",
    klic: "tající",
    distractors: [
      { value: "Hlína na spodním okraji narostla sama, protože půda přes zimu odpočívala", why: "Půda sama takhle rychle nepřibývá. Nános vznikl z hlíny, kterou z horní části svahu odnesla voda." },
      { value: "Mráz půdu nafoukl, a tím ji posunul až na spodní okraj záhonu", why: "Mráz půdu nadzvedne a rozdrobí, ale po svahu ji přemístí až stékající voda." },
      { value: "Nános navál vítr, protože přes zimu fouká vždycky nejsilněji", why: "Vítr odnáší hlavně suchou půdu. V zimě a na jaře je půda vlhká a přemísťuje ji voda." },
    ],
    hints: [
      "Kde se hlína na jaře objevila a kde jí naopak ubylo? Co mezi těmi dvěma místy přes zimu teklo?",
      "Nános leží dole, tedy ve směru, kterým odtéká voda. Přes zimu a při jarním tání jí přes záhon proteklo hodně a nekrytý povrch jí nekladl žádný odpor. Postupně tak odnesla tenkou vrstvu shora a složila ji na dolním okraji. Vyber možnost, která tenhle přesun vodou popisuje.",
    ],
    explanation: "Je to eroze v malém: na nekrytém svažitém záhonu voda z tání a deště odnese svrchní vrstvu a uloží ji níž. Proto se doporučuje nechat přes zimu porost nebo povrch aspoň přikrýt.",
  },
  {
    q: "Proč se na svažitém poli doporučuje nechat přes zimu porost, například trávu nebo meziplodinu?",
    correct: "Porost tlumí listy náraz kapek a kořeny drží půdu na místě",
    klic: "tlumí",
    distractors: [
      { value: "Porost půdu zahřeje, takže nepromrzne a nerozpadne se na prach", why: "Promrznutí půdě neškodí, mráz ji naopak drobí. Porost chrání hlavně před vodou, která by ornici splavila." },
      { value: "Porost vysaje z půdy přebytečnou vodu, a ta pak nemá kudy téct", why: "Rostliny v zimě téměř nerostou a tolik vody nespotřebují. Chrání hlavně tím, že kryjí povrch." },
      { value: "Porost odežene živočichy, kteří by v půdě hloubili chodbičky", why: "Chodbičky žížal a dalších živočichů půdě prospívají: provzdušňují ji a pomáhají vsakování vody." },
    ],
    hints: [
      "Představ si jednu dešťovou kapku. Co udělá, když dopadne na holou hlínu, a co, když nejdřív narazí do listu?",
      "Kapka padající na holý povrch ho rozbije a rozstříkne drobné částečky do stran — a voda, která se nevsákne, je pak splaví po svahu. List její náraz zachytí a voda steče po stéble pomalu dolů. K tomu se přidá druhá ochrana, kterou porost nabízí pod povrchem. Vyber možnost, ve které jsou obě.",
    ],
    explanation: "Porost chrání půdu dvakrát: nadzemní částí tlumí náraz kapek, takže se povrch nerozbije, a kořeny drží půdu pohromadě a zlepšují vsakování. Holé pole na svahu je proto přes zimu nejohroženější.",
  },
  {
    q: "Z lesa se odvážejí pokácené stromy i s větvemi a listím a po mnoha letech je půda chudší. Proč?",
    correct: "Do půdy se nevrací odumřelá hmota, ze které by vznikal humus",
    klic: "nevrací",
    distractors: [
      { value: "Odvozem se z lesa odstraní i zvětralá hornina pod stromy", why: "Hornina zůstává na místě. Chybí odumřelá hmota, ze které se tvoří humus." },
      { value: "Kdyby větve zůstaly, odčerpaly by z půdy zbylé živiny", why: "Je to obráceně: když větve a listí na místě zůstanou, živiny z nich se do půdy vrátí." },
      { value: "Bez odvozu by se půda v zimě neudržela dostatečně teplá", why: "Teplota tu nerozhoduje. Půda chudne proto, že se do ní nevrací odumřelá hmota." },
    ],
    hints: [
      "V lese platí koloběh: co si strom vzal z půdy, do ní po čase zase vrátí. Kdy se koloběh přeruší?",
      "Dokud spadané listí a odumřelé větve zůstávají v lese, rozloží se a živiny se vrátí tam, odkud si je kořeny vzaly. Když se z lesa odveze všechno, odchází s tím pryč i zásoba, ze které se tvoří tmavá úrodná vrstva, a půdě se nemá co vracet. Vyber možnost, která pracuje s tímto přerušeným koloběhem.",
    ],
    explanation: "V lese koluje hmota dokola: opad a odumřelé dřevo se rozloží a živiny se vrátí do půdy. Když se odveze celý strom i s větvemi a listím, koloběh se přeruší a půda o živiny i o zdroj humusu přichází. Proto se dnes doporučuje větve v lese ponechat.",
  },
  {
    q: "Obec pod strmým odlesněným svahem zaplavuje po přívalových deštích bahno, dřív se to nestávalo. Jak to spolu souvisí?",
    correct: "Voda se bez lesa nevsakuje, rychle stéká a bere s sebou půdu ze svahu",
    klic: "nevsakuje",
    distractors: [
      { value: "Bahno přiteklo do svahu zdola, protože voda hledá vyšší místo", why: "Voda teče vždy dolů. Bahno přišlo shora ze svahu, na kterém ji nic nezadrželo." },
      { value: "Les by déšť zastavil úplně, takže by do obce vůbec nedopadl", why: "Déšť spadne i na les. Rozdíl je v tom, že v lese se voda vsákne a nestrhne s sebou půdu." },
      { value: "Půda se bez stromů mění na bahno sama od sebe už během dlouhého sucha", why: "Bahno vznikne, až když se půda promísí s vodou. Bez lesa jí ale voda odnese mnohem víc." },
    ],
    hints: [
      "Porovnej dvě věci: kolik vody se vsákne v lese a kolik na holém svahu — a co ta nevsáknutá voda unese.",
      "Lesní půda je provrtaná kořeny a chodbičkami, takže do sebe vodu nasaje jako houba a pouští ji dál pomalu. Po vykácení se povrch zpevní a rozbije se nárazy kapek, takže se voda nevsákne a stéká po svahu — a čím rychleji teče, tím víc hlíny unese. Vyber možnost, která spojuje vsakování s odnosem půdy.",
    ],
    explanation: "Les funguje jako houba: kořeny a chodbičky v půdě vodu vsáknou a uvolňují ji pomalu. Na holém svahu se voda nevsakuje, rychle stéká a bere s sebou půdu, takže se do obce přivalí bahno. Odlesnění svahů tak zvyšuje i povodňové riziko.",
  },
  {
    q: "Který postup zmenší ztrátu ornice na dlouhém mírném svahu nejvíc?",
    correct: "Rozdělit svah napříč sklonem pásy trvalého travnatého porostu",
    klic: "trvalého",
    distractors: [
      { value: "Shrnout postupně hlínu k dolnímu okraji, aby svah nebyl tak dlouhý", why: "Přesunutá hlína svah nezkrátí a voda ji odnese dál. Pomůže rozdělení svahu porostem napříč sklonem." },
      { value: "Vyhloubit po spádu rýhy, kterými voda z pole rychleji odteče", why: "Rýhy vedené po spádu vodu zrychlí a odnos půdy zesílí. Vodu je naopak potřeba zpomalit a zdržet." },
      { value: "Zaorávat pole dvakrát ročně, aby půda zůstala pořád kyprá", why: "Kyprá holá půda se odnáší nejsnáz. Nejvíc pomůže trvalý porost vedený napříč svahem." },
    ],
    hints: [
      "Voda nabírá na svahu rychlost tím víc, čím delší dráhu urazí. Jak tu dráhu přerušit?",
      "Krátký svah odnese málo, dlouhý hodně — a rozhoduje právě to, jak daleko voda poteče bez překážky. Nejlépe proto funguje něco, co ji zastaví několikrát po cestě, drží půdu kořeny a vydrží tam po celý rok, ne jen pár měsíců. Vyber možnost, která tohle splňuje.",
    ],
    explanation: "Na dlouhém svahu se voda rozběhne a odnese nejvíc. Pásy trvalého porostu vedené napříč sklonem svah rozdělí na krátké úseky, vodu zpomalí a zachytí smytou hlínu, takže ztráta ornice výrazně klesne.",
  },
];

// ── Generátor ──────────────────────────────────────────────────────────────
/** Rotace banky se nastavuje při každém volání — mezi voláními žádný stav. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  let i = 0;
  const los = () => vytvor(pool[i++ % pool.length]);
  return ruzneUlohy(() => losUlohy(los), pool.length, pool.length * 4);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const PEDOSFERA_BIOSFERA: TopicMetadata[] = [
  {
    id: "g6-zem-pedosfera-biosfera-6",
    rvpNodeId: "g6-zemepis-prirodni-obraz-zeme-krajinne-sfery-pedosfera-a-biosfera-pudy-zivotni-prostredi",
    displayName: "Půda a krajinné zóny",
    title: "Pedosféra a biosféra - půdy, životní prostředí",
    studentTitle: "Půda pod nohama a krajiny světa",
    subject: "zemepis",
    category: "Přírodní obraz Země",
    topic: "Krajinné sféry",
    briefDescription: "Jak vzniká půda, co ji ničí a jaká krajina roste v jakém podnebí.",
    keywords: [
      "pedosféra", "biosféra", "půda", "humus", "ornice", "matečná hornina",
      "zvětrávání", "černozem", "eroze", "zasolení", "krajinné zóny", "tundra",
      "tajga", "step", "savana", "tropický deštný les", "poušť",
      "šířková pásmovitost", "výšková stupňovitost",
    ],
    goals: [
      "Vysvětlit, z čeho půda vzniká a proč je humus zdrojem její úrodnosti.",
      "Z popisu podnebí určit krajinnou zónu a vlastnosti její půdy.",
      "Najít příčinu poškození půdy (eroze, zasolení) a vybrat opatření, které jí pomůže.",
    ],
    boundaries: [
      "Krajinné zóny jen v základním výčtu: tundra, tajga, listnatý les, step, poušť, savana, tropický deštný les.",
      "Čísla jen zaokrouhlená a nesporná (deštný les přes 2 000 mm, poušť pod 250 mm za rok).",
      "Bez map a obrázků — poloha se zadává zeměpisnou šířkou, podnebí slovy a čísly.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Půda = zvětralá hornina + rozložené zbytky organismů (humus). Typ půdy i rostlinstva určuje podnebí, proto se krajinné zóny řadí podle zeměpisné šířky a v horách podle nadmořské výšky.",
      steps: [
        "U popisu podnebí si všimni tří údajů: zeměpisné šířky, ročních srážek a délky teplého období.",
        "Z nich odvoď porost: souvislý les potřebuje vláhu i teplo, travám stačí míň, při srážkách pod 250 mm porost mizí.",
        "Podle porostu a rychlosti rozkladu odhadni půdu: hodně odumřelých kořenů = mocný humus, chlad = tenká půda, vyplavování v tropech = půda chudá na živiny.",
      ],
      commonMistake: "Myslet si, že bujný tropický deštný les roste na nejúrodnější půdě, nebo svádět erozi na silný déšť místo na chybějící porost.",
      example: "Kolem 48° s. š., asi 400 mm srážek a suché léto: na stromy je vláhy málo, trávy ji zvládnou — vznikne step a pod ní černozem z každoročně odumřelých kořenů.",
    },
  },
];
