/**
 * Fyzika 6. ročník — Jednoduchý elektrický obvod: zdroj, vodič, spotřebič, spínač.
 *
 * Druhé téma okruhu „Elektrické vlastnosti látek“. `elektrickyNaboj.ts` nechalo
 * náboj stát na místě — držel se na zelektrovaném tělese a nikam netekl. Tady se
 * rozeběhne a vznikne z toho obvod.
 *
 * **Miskoncepce, na kterých téma stojí:**
 *  1. Jeden drát stačí. (Nestačí. Nejčastější dětská kresba je baterie, jeden
 *     drát a žárovka — proud podle ní ze zdroje vyteče a ve spotřebiči skončí.)
 *  2. Proud se ve spotřebiči spotřebuje. (Nespotřebuje. Do baterie se vrací
 *     přesně tolik proudu, kolik z ní vyteklo. Spotřebovává se energie.)
 *  3. Na tom, kde je spínač, záleží. (Nezáleží. Rozpojí obvod, ať je kdekoli.)
 *  4. Zkrat je totéž co přerušený obvod. (Je to přesný opak — proud má naráz
 *     příliš snadnou cestu a drát se rozpálí.)
 *
 * Gradace:
 *  • **L1 rozpoznání** — jakou úlohu má součástka v obvodu. Čtyři role se
 *    v klíči střídají, takže se úroveň nedá projít jedním zvykem.
 *  • **L2 aplikace** — rozhodni o konkrétním zapojení: rozsvítí se, nebo ne,
 *    a co s tím udělá plastové pravítko, tuha z tužky nebo rozepnutý spínač.
 *  • **L3 přenos** — proud se nespotřebovává a z toho plyne zbytek: proč
 *    zhasnou obě žárovky za sebou, proč ne obě vedle sebe, proč se baterie
 *    přesto vybije a proč je zkrat nebezpečný.
 *
 * ## Rozhodnutí, která stojí za vysvětlení
 *
 * **Sériové a paralelní zapojení tu je, ale jen slovně a bez názvu.** „Dvě
 * žárovky za sebou“ a „každá ve vlastní větvi“ šestka pochopí z popisu; pojmy
 * i výpočty patří k Ohmovu zákonu do vyšších ročníků. Bez téhle dvojice by ale
 * nešlo ukázat nejsilnější důsledek toho, že se proud nespotřebovává.
 *
 * **Schematické značky se zkoušejí slovním popisem, ne obrázkem.** Téma je
 * `select_one` a obrázkové typy zatím nejsou v šestce ověřené (viz plán,
 * bod 1.6). Popis „delší tenká čárka a kratší silná“ dělá touž práci.
 *
 * **Tuha z tužky je v bance schválně.** Je to jediný běžný nekovový vodič,
 * který dítě má doma, a rozbíjí zkratku „vede = je to kov“.
 *
 * **Bez ampérů, voltů, ohmů a Ohmova zákona.** Proud se popisuje slovy
 * (teče, neteče, stejně velký, větší), nepočítá se.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as task, ruzneUlohy } from "./_shared";

/* ------------------------------------------------------------------ L1 --- */

type Role = "zdroj" | "vodic" | "spotrebic" | "spinac";

const ROLE_ODPOVED: Record<Role, string> = {
  zdroj: "je zdrojem energie",
  vodic: "je vodičem",
  spotrebic: "je spotřebičem",
  spinac: "je spínačem",
};

/** Co ta role v obvodu obstarává — hlavička chybového vysvětlení. */
const ROLE_DEF: Record<Role, string> = {
  zdroj: "Zdroj do obvodu dodává energii — třeba baterie nebo dynamo.",
  vodic: "Vodič proud jen vede z místa na místo a sám nic nedělá.",
  spotrebic: "Spotřebič odebranou energii mění na světlo, zvuk, teplo nebo pohyb.",
  spinac: "Spínač cestu proudu rozpojí nebo zase spojí.",
};

/**
 * Součástky pro L1. `jmeno` je první pád (podmět otázky), `koho` druhý pád
 * pro vazbu „bez čeho“ v nápovědě — z prvního se odvodit nedá a přesně na
 * tomhle vznikly v téhle dávce už čtyři neshody. `cinnost` je celá věta, která
 * se dostane do chybového vysvětlení až po odpovědi.
 */
const SOUCASTKY: { jmeno: string; koho: string; role: Role; cinnost: string }[] = [
  {
    jmeno: "plochá baterie",
    koho: "ploché baterie",
    role: "zdroj",
    cinnost: "Plochá baterie energii do obvodu dodává, sama ji neodebírá ani nic nespíná.",
  },
  {
    jmeno: "tužková baterie",
    koho: "tužkové baterie",
    role: "zdroj",
    cinnost: "Tužková baterie je zásobárna energie pro celý obvod, ne její spotřebitel.",
  },
  {
    jmeno: "autobaterie",
    koho: "autobaterie",
    role: "zdroj",
    cinnost: "Autobaterie dodává energii startéru i světlům, sama žádnou neodebírá.",
  },
  {
    jmeno: "dynamo na kole",
    koho: "dynama na kole",
    role: "zdroj",
    cinnost: "Dynamo na kole vyrábí energii z tvého šlapání a posílá ji do obvodu.",
  },
  {
    jmeno: "měděný drát",
    koho: "měděného drátu",
    role: "vodic",
    cinnost: "Měděný drát proud jen propustí dál — nedodává energii ani ji na nic nemění.",
  },
  {
    jmeno: "propojovací kabel s krokosvorkami",
    koho: "propojovacího kabelu s krokosvorkami",
    role: "vodic",
    cinnost: "Propojovací kabel jen spojuje dvě místa obvodu, aby tudy mohl projít proud.",
  },
  {
    jmeno: "hliníkový drát",
    koho: "hliníkového drátu",
    role: "vodic",
    cinnost: "Hliníkový drát proud vede stejně jako měděný a sám na něm nic nemění.",
  },
  {
    jmeno: "kovová sponka, kterou jsi spojil mezeru v obvodu",
    koho: "kovové sponky",
    role: "vodic",
    cinnost: "Sponka jen zaplnila mezeru, aby měl proud kudy projít.",
  },
  {
    jmeno: "žárovka",
    koho: "žárovky",
    role: "spotrebic",
    cinnost: "Žárovka energii z obvodu odebírá a mění ji na světlo a teplo.",
  },
  {
    jmeno: "bzučák",
    koho: "bzučáku",
    role: "spotrebic",
    cinnost: "Bzučák odebranou energii mění na zvuk.",
  },
  {
    jmeno: "malý elektromotorek",
    koho: "malého elektromotorku",
    role: "spotrebic",
    cinnost: "Elektromotorek odebranou energii mění na pohyb.",
  },
  {
    jmeno: "topná spirála v rychlovarné konvici",
    koho: "topné spirály",
    role: "spotrebic",
    cinnost: "Topná spirála odebranou energii mění na teplo.",
  },
  {
    jmeno: "LED dioda v baterce",
    koho: "LED diody",
    role: "spotrebic",
    cinnost: "LED dioda odebranou energii mění na světlo, jen mnohem úsporněji než žárovka.",
  },
  {
    jmeno: "vypínač na zdi",
    koho: "vypínače na zdi",
    role: "spinac",
    cinnost: "Vypínač na zdi jen udělá v cestě proudu mezeru nebo ji zase zavře.",
  },
  {
    jmeno: "tlačítko domovního zvonku",
    koho: "tlačítka domovního zvonku",
    role: "spinac",
    cinnost: "Tlačítko zvonku obvod spojí, dokud ho držíš, a po puštění ho zase rozpojí.",
  },
  {
    jmeno: "páčkový spínač na kabelu lampičky",
    koho: "páčkového spínače",
    role: "spinac",
    cinnost: "Páčkový spínač jen přerušuje a obnovuje cestu proudu, energii žádnou nedodává.",
  },
];

const KROKY_L1 = [
  "Zeptej se, co ta součástka v obvodu doopravdy dělá.",
  "Dodává energii = zdroj. Vede proud = vodič.",
  "Mění energii na světlo, zvuk, teplo nebo pohyb = spotřebič. Rozpojuje cestu = spínač.",
];

function genL1(): PracticeTask {
  const s = pick(SOUCASTKY);
  const role: Role[] = ["zdroj", "vodic", "spotrebic", "spinac"];
  return task(
    `Jakou úlohu má v elektrickém obvodu ${s.jmeno}?`,
    ROLE_ODPOVED[s.role],
    role
      .filter((r) => r !== s.role)
      .map((r) => ({ value: ROLE_ODPOVED[r], why: `${ROLE_DEF[r]} ${s.cinnost}` })),
    {
      hints: [
        `Zamysli se nad jedinou věcí: co v obvodu dělá ${s.jmeno}.`,
        `V každém obvodu se rozdělují čtyři úlohy. Něco energii dodává, něco ji jen vede z místa na místo, něco ji mění na světlo, zvuk, teplo nebo pohyb a něco cestu proudu rozpojuje a zase spojuje. Zkus si ten obvod představit bez ${s.koho} — co přestane fungovat a co zůstane?`,
      ],
      solutionSteps: KROKY_L1,
      explanation: `${s.cinnost} ${ROLE_DEF[s.role]}`,
    },
  );
}

/* --------------------------------------------------------------- L2, L3 --- */

/** Ručně psaná položka banky: celá úloha včetně vlastního chybového modelu. */
interface Polozka {
  otazka: string;
  klic: string;
  chybne: { value: string; why: string }[];
  h0: string;
  h1: string;
  vysvetleni: string;
}

const ZAPOJENI: Polozka[] = [
  {
    otazka:
      "Máš baterii, žárovku a jeden jediný drát. Drát vede od jednoho pólu baterie k žárovce a tam končí. Co je potřeba udělat, aby se žárovka rozsvítila?",
    klic: "Přidat druhý drát od žárovky zpátky na druhý pól baterie.",
    chybne: [
      {
        value: "Nic, takhle je zapojení v pořádku a žárovka svítit bude.",
        why: "Nebude. Proud potřebuje uzavřenou cestu tam i zpátky, jinak se nerozeběhne vůbec.",
      },
      {
        value: "Vyměnit baterii za silnější.",
        why: "Ani sebesilnější baterie nepomůže, dokud je cesta přerušená.",
      },
      {
        value: "Připojit ten jeden drát na druhý pól baterie.",
        why: "Pak by byla baterie spojená sama se sebou a žárovka by zůstala mimo obvod.",
      },
    ],
    h0: "Spočítej, kolik pólů baterie je v tvém zapojení použitých.",
    h1: "Baterie má dva póly a proud musí z jednoho vyjít, projít celým obvodem a druhým se vrátit zpátky. Dokud je použitý jen jeden pól, je cesta přerušená a proud se nerozeběhne ani na chvilku. Právě tohle je nejčastější chyba na dětských obrázcích obvodu.",
    vysvetleni:
      "Aby obvodem tekl proud, musí být uzavřený: ze zdroje přes spotřebič a zase zpátky do zdroje. Jeden drát na to nikdy nestačí.",
  },
  {
    otazka:
      "Obvod je správně zapojený, ale spínač je rozepnutý. Co se v obvodu děje?",
    klic: "Proud neteče vůbec, protože rozepnutý spínač udělal v cestě mezeru.",
    chybne: [
      {
        value: "Proud teče, jen je slabší.",
        why: "Slabší ne — neteče vůbec. Mezera v obvodu proud zastaví úplně.",
      },
      {
        value: "Proud teče až ke spínači a tam se hromadí.",
        why: "Nikde se nic nehromadí. Dokud není cesta uzavřená celá, proud se nerozeběhne.",
      },
      {
        value: "Proud teče dál, spínač ovlivňuje jen žárovku.",
        why: "Spínač působí na celý obvod. Je jedno, na kterém místě je zapojený.",
      },
    ],
    h0: "Rozepnutý spínač není nic jiného než mezera v drátu.",
    h1: "Proud potřebuje uzavřenou cestu po celé délce obvodu. Rozepnutý spínač ji přeruší a je jedno, jestli je hned u baterie nebo až za žárovkou — obvod je rozpojený stejně. Proto taky žárovka zhasne okamžitě, ne postupně.",
    vysvetleni:
      "Rozepnutý spínač obvod přeruší a proud přestane téct v celém obvodu naráz. Sepnutím se cesta zase uzavře.",
  },
  {
    otazka:
      "V obvodu je mezera a ty do ní vložíš plastové pravítko tak, aby se dotýkalo obou konců drátu. Co se stane?",
    klic: "Nic, žárovka nesvítí — plast je izolant a proud jím neprojde.",
    chybne: [
      {
        value: "Žárovka se rozsvítí, mezera je přece zaplněná.",
        why: "Nestačí mezeru zaplnit čímkoli. Musí tam být látka, která proud vede.",
      },
      {
        value: "Žárovka se rozsvítí slabě.",
        why: "Ani slabě. Přes izolant neprojde proud vůbec.",
      },
      {
        value: "Pravítko se rozžhaví a pak proud propustí.",
        why: "Nic se nerozžhaví, protože jím žádný proud neteče.",
      },
    ],
    h0: "Neptej se, jestli je mezera zaplněná, ale čím je zaplněná.",
    h1: "Látky se dělí na vodiče a izolanty podle toho, jestli se v nich náboj může pohybovat. V kovu ano, v plastu ne. Zaplnit mezeru izolantem je proto z hlediska obvodu totéž, jako by tam zůstal vzduch — cesta je pořád přerušená.",
    vysvetleni:
      "Obvod uzavře jen vodič. Plast je izolant, takže mezeru sice vyplní, ale proud jí neprojde a žárovka nesvítí.",
  },
  {
    otazka:
      "Do mezery v obvodu vložíš tuhu vyndanou z obyčejné tužky tak, aby se dotýkala obou konců drátu. Co se stane?",
    klic: "Žárovka se rozsvítí — tuha proud vede, přestože to není kov.",
    chybne: [
      {
        value: "Nic, tuha není kov, takže proud nevede.",
        why: "Vodivé nejsou jen kovy. Tuha je z grafitu a ten proud vede také.",
      },
      {
        value: "Nic, tuha se okamžitě rozlomí.",
        why: "Tuha vydrží. A i kdyby se rozlomila, vyzkoušet se to dá s celou.",
      },
      {
        value: "Žárovka se rozsvítí, protože je tuha z olova.",
        why: "V tužce žádné olovo není, i když se jí tak lidově říká. Je z grafitu, což je jedna z podob uhlíku.",
      },
    ],
    h0: "Nezastavuj se u otázky, jestli je to kov. Ptej se, jestli se v té látce může náboj pohybovat.",
    h1: "Vodiče nejsou jen kovy. Grafit, ze kterého je tuha, vede proud také, i když hůř než měď — je to jeden z mála běžných nekovových vodičů, které máš doma. Vodivá je i slaná voda nebo grafitová vrstva v tužce po tahu na papíře.",
    vysvetleni:
      "Grafit v tužce je nekovový vodič. Rozbíjí to obvyklou zkratku „vede proud = je to kov“, která u vodičů a izolantů často vzniká.",
  },
  {
    otazka:
      "Obvod je zapojený správně, všechno drží, a žárovka přesto nesvítí. Uvnitř jednoho drátu je pod neporušenou izolací přerušený vodič. Proč to nejde poznat pohledem?",
    klic: "Izolace zůstala celá, takže přerušení je schované uvnitř.",
    chybne: [
      {
        value: "Přerušený drát vypadá jinak, jen je to málo vidět.",
        why: "Zvenku se nezmění nic. Celá izolace vypadá stejně, ať je drát uvnitř celý, nebo ne.",
      },
      {
        value: "Drát se přerušením zkrátí, a to je vidět.",
        why: "Nezkrátí se. Zůstane stejně dlouhý, jen uvnitř nedrží pohromadě.",
      },
      {
        value: "Přerušený drát by se zahříval, a to by šlo nahmatat.",
        why: "Zahřívá se jen tam, kudy něco teče. Přerušeným drátem neteče nic, takže zůstane studený.",
      },
    ],
    h0: "Přerušení je uvnitř. Zamysli se, co všechno o vnitřku drátu prozradí pohled zvenku.",
    h1: "Drát se skládá z vodivého jádra a izolace kolem něj. Prasknout může jádro, aniž se izolace poruší — třeba po mnohém ohýbání u nabíječky. Zvenku to vypadá jako nový kabel, ale obvod je přerušený úplně stejně jako by byl s nůžkami přestřiženým drátem.",
    vysvetleni:
      "Obvod přeruší i závada, kterou není vidět. Proto se zapojení zkouší postupným přemostěním úseků, ne jen prohlídkou.",
  },
  {
    otazka: "Proč jsou dráty v elektrických spotřebičích obalené plastem?",
    klic: "Aby proud zůstal uvnitř drátu, nedostal se, kam nemá, a nešel chytit do ruky.",
    chybne: [
      {
        value: "Aby se drát neohnul.",
        why: "Plast drát nezpevňuje. Kabely se ohýbají velmi snadno.",
      },
      {
        value: "Aby drát nerezavěl.",
        why: "Proti korozi se používá jiná ochrana. Plast je tam kvůli tomu, že nevede proud.",
      },
      {
        value: "Aby lépe vedl proud.",
        why: "Vedení se izolací nezlepší. Vede vodivé jádro uvnitř, plast naopak nevede vůbec.",
      },
    ],
    h0: "Vzpomeň si, co plast s proudem dělá — a co by se stalo, kdyby tam nebyl.",
    h1: "Plast je izolant, takže proudu nedovolí opustit drát. Bez izolace by se dva dráty vedle sebe spojily a proud by si zkrátil cestu, a hlavně by se dal chytit do ruky. Obojí je důvod, proč se izolace nikdy neodstraňuje jinde než na koncích, které se zapojují.",
    vysvetleni:
      "Izolace je z izolantu a udrží proud uvnitř vodiče. Chrání tím obvod před zkratem a člověka před úrazem.",
  },
  {
    otazka:
      "Ve schématu se zdroj kreslí jako dvě rovnoběžné čárky: jedna delší a tenká, druhá kratší a silná. Co znamená ta delší tenká?",
    klic: "Kladný pól zdroje.",
    chybne: [
      {
        value: "Záporný pól zdroje.",
        why: "Záporný pól má značka kratší a silnější čáru. Delší tenká patří kladnému.",
      },
      {
        value: "Směr, kterým se schéma čte.",
        why: "Schéma se dá číst z obou stran. Čárky označují póly, ne směr čtení.",
      },
      {
        value: "Silnější drát na jedné straně zdroje.",
        why: "Tloušťka čáry ve schématu o drátu nic neříká. Značí póly zdroje.",
      },
    ],
    h0: "Značka má obě čárky různé schválně, aby se póly nedaly zaměnit.",
    h1: "Schematické značky jsou dohodnuté tak, aby se daly nakreslit a přečíst kdekoli na světě. U zdroje je delší tenká čára kladný pól a kratší silná záporný. Právě proto se ve schématu pozná, kterým směrem je zdroj zapojený, i když na papíře žádná baterie není.",
    vysvetleni:
      "Ve značce zdroje označuje delší tenká čára kladný pól a kratší silná záporný. Také žárovka, spínač a každá další součástka mají svou vlastní dohodnutou značku.",
  },
  {
    otazka:
      "Baterie leží sama na stole a není nikam připojená. Co o ní platí?",
    klic: "Má v sobě připravenou energii, ale žádný proud z ní neteče.",
    chybne: [
      {
        value: "Vysílá z pólů slabý proud, a proto se sama od sebe vybíjí.",
        why: "Ležící baterie se opravdu pomalu vybíjí, jenže vnitřními ději, ne proudem ven. Ven z ní nic neteče.",
      },
      {
        value: "Hromadí se v ní proud, který čeká na připojení.",
        why: "Proud bez uzavřené cesty nevznikne vůbec. Není to tak, že by někde čekal nashromážděný.",
      },
      {
        value: "Mezi póly jí protéká vzduchem slabý proud.",
        why: "Suchý vzduch je izolant a proud jím neprojde.",
      },
    ],
    h0: "Baterie je zdroj, ne zásobník proudu. Ptej se, co musí být splněné, aby se proud rozeběhl.",
    h1: "Baterie v sobě má připravenou energii, jenže proud se rozeběhne teprve tehdy, když mezi jejími póly vznikne uzavřená vodivá cesta. Do té doby se neděje nic. Proto baterie v šuplíku vydrží roky, kdežto tatáž baterie v rozsvícené baterce pár hodin.",
    vysvetleni:
      "Zdroj sám o sobě proud nevysílá. Proud vznikne až v uzavřeném obvodu, kde má kudy projít a vrátit se zpátky.",
  },
  {
    otazka: "K čemu je v obvodu spínač?",
    klic: "Rozpojuje a zase spojuje cestu proudu, aniž by se muselo cokoli odpojovat.",
    chybne: [
      {
        value: "Zesiluje nebo zeslabuje proud.",
        why: "Spínač nic nezesiluje. Buď je proud zapnutý, nebo vypnutý, nic mezi tím.",
      },
      {
        value: "Chrání obvod před zkratem.",
        why: "Před zkratem chrání pojistka. Spínač obvod jen zapíná a vypíná.",
      },
      {
        value: "Dodává do obvodu energii, když se stiskne.",
        why: "Energii dodává zdroj. Spínač jen otevírá a zavírá cestu.",
      },
    ],
    h0: "Zeptej se, co by se stalo, kdyby spínač v obvodu nebyl — šlo by lampičku vypnout?",
    h1: "Bez spínače by se musel obvod pokaždé rozpojit vytažením drátu. Spínač dělá přesně totéž, jen pohodlně a opakovaně: sepnutý je obvod uzavřený a proud teče, rozepnutý je v cestě mezera a proud neteče vůbec. Nic mezi tím spínač neumí.",
    vysvetleni:
      "Spínač uzavírá a otevírá obvod. Mezistav neexistuje: obvod je buď uzavřený, nebo přerušený.",
  },
  {
    otazka:
      "Žárovku v obvodu vyšroubuješ z objímky a necháš ji ležet vedle. Co se stane se zbytkem obvodu?",
    klic: "Obvod se tím přeruší a proud přestane téct celým obvodem.",
    chybne: [
      {
        value: "Proud teče dál, jen se nemá kde projevit.",
        why: "Nemá kudy projít. Vyšroubovaná žárovka udělá v cestě mezeru stejně jako rozepnutý spínač.",
      },
      {
        value: "Proud poteče vzduchem přes prázdnou objímku.",
        why: "Vzduch je izolant. Proud jím v obvodu s baterií nepřeskočí.",
      },
      {
        value: "Baterie se začne rychleji vybíjet.",
        why: "Bude to naopak — přerušeným obvodem neteče nic, takže se baterie přestane vybíjet.",
      },
    ],
    h0: "Prázdná objímka je v obvodu totéž co rozepnutý spínač.",
    h1: "Žárovka není jen ozdoba na konci drátu, ale součást cesty, kterou proud prochází. Když ji vyndáš, zůstane v obvodu mezera a proud se zastaví úplně. Z hlediska obvodu je to stejná změna, jako kdybys rozepnul spínač nebo přestřihl drát.",
    vysvetleni:
      "Spotřebič je součástí cesty proudu. Jeho vyjmutí obvod přeruší úplně stejně jako rozepnutý spínač.",
  },
  {
    otazka:
      "Které z těchto věcí by po vložení do mezery v obvodu žárovku rozsvítily: sklenice, hliníková lžíce, guma, mince?",
    klic: "Hliníková lžíce a mince.",
    chybne: [
      {
        value: "Jen hliníková lžíce.",
        why: "Mince je také z kovu, takže proud vede stejně dobře.",
      },
      {
        value: "Hliníková lžíce, mince a sklenice.",
        why: "Sklo je izolant. Proud jím neprojde, i když je průhledné.",
      },
      {
        value: "Všechny čtyři.",
        why: "Guma i sklo jsou izolanty. Právě proto se z gumy dělají rukavice pro práci s elektřinou.",
      },
    ],
    h0: "Projdi si ty čtyři věci jednu po druhé a u každé se zeptej, z čeho je.",
    h1: "Vodiče jsou hlavně kovy, izolanty naopak plast, guma, sklo, suché dřevo nebo suchý vzduch. Hliník i kov v minci proud vedou, sklo a guma ne. Právě proto mají kleště elektrikáře gumové rukojeti a proč se drát obaluje plastem.",
    vysvetleni:
      "Obvod uzavřou jen vodiče. Z běžných věcí to bývají kovy, kdežto sklo, guma a plast jsou izolanty.",
  },
  {
    otazka:
      "Sestavíš obvod z baterie, žárovky, dvou drátů a spínače. Spínač sepneš, ale žárovka nesvítí. Co má smysl zkontrolovat jako první?",
    klic: "Jestli jsou všechny spoje pevné a obvod je opravdu uzavřený po celé délce.",
    chybne: [
      {
        value: "Jestli je baterie zapojená správným pólem.",
        why: "Žárovce na směru proudu nezáleží, rozsvítí se při obou zapojeních.",
      },
      {
        value: "Jestli jsou dráty dost dlouhé.",
        why: "Na délce drátu to nezávisí. Krátký i dlouhý drát proud vedou.",
      },
      {
        value: "Jestli není spínač příliš slabý pro takovou žárovku.",
        why: "Spínač obvod jen otevírá a zavírá. Sílu proudu neurčuje.",
      },
    ],
    h0: "Nejčastější závada bývá ta nejnudnější. Zamysli se, co se v takovém zapojení nejsnáz uvolní.",
    h1: "Obvod funguje jen tehdy, když je uzavřený po celé délce, takže stačí jediný uvolněný konec drátu a nestane se nic. Proto se hledání závady začíná spoji: kroucený drát pod šroubkem, krokosvorka, která jen leží, nebo špatně dotažená objímka. Teprve když spoje sedí, zkouší se součástky.",
    vysvetleni:
      "V nefunkčním obvodu se nejdřív hledá přerušení, ne vadná součástka. Uvolněný spoj je nejčastější a nejméně nápadná příčina.",
  },
];

const PROUD: Polozka[] = [
  {
    otazka:
      "Obvodem s jedinou žárovkou teče proud. Kolik proudu se vrací do baterie oproti tomu, co z ní vyteklo?",
    klic: "Přesně tolik, kolik z ní vyteklo — proud se cestou nespotřebovává.",
    chybne: [
      {
        value: "Méně, část proudu žárovka spotřebovala.",
        why: "Žárovka spotřebovává energii, ne proud. Ten se vrací celý.",
      },
      {
        value: "Nic, proud v žárovce skončí.",
        why: "Kdyby v ní skončil, netekl by vůbec — obvod by nebyl uzavřený.",
      },
      {
        value: "Víc, protože žárovka proud zesílí.",
        why: "Žárovka nic nezesiluje. Odebírá energii, ne že by proud přidávala.",
      },
    ],
    h0: "Rozlišuj dvě různé věci: proud a energii. Jen jedna z nich se v obvodu spotřebovává.",
    h1: "Proud je uspořádaný pohyb částic po uzavřené cestě, takže se nemá kde ztratit — do zdroje se jich vrátí přesně tolik, kolik z něj vyšlo. Co se spotřebuje, je energie, kterou částice po cestě předají žárovce. Proto baterie časem dojde, i když jí proudu neubývá.",
    vysvetleni:
      "V nerozvětveném obvodu je proud všude stejně velký. Spotřebovává se energie, ne proud — a tenhle rozdíl je jádrem celého tématu.",
  },
  {
    otazka: "Co se v obvodu spotřebovává, když ne proud?",
    klic: "Energie, kterou zdroj dodává a spotřebič mění na světlo, teplo, zvuk nebo pohyb.",
    chybne: [
      {
        value: "Náboj — částice se ve spotřebiči spotřebují.",
        why: "Částice zůstávají v obvodu všechny. Jen cestou odevzdají energii.",
      },
      {
        value: "Dráty, které se pomalu opotřebují.",
        why: "Drát se běžným provozem nespotřebovává. Vybíjí se zdroj, ne vodiče.",
      },
      {
        value: "Nic, obvod běží pořád dokola bez ztráty.",
        why: "Kdyby se nespotřebovávalo nic, baterie by vydržela navěky.",
      },
    ],
    h0: "Baterie jednou dojde. Ptej se, čeho v ní vlastně ubývá.",
    h1: "Zdroj dodává do obvodu energii a spotřebič ji mění na něco užitečného. Částice, které proud tvoří, se přitom nikam neztrácejí — kolují dokola a energii jen předávají dál. Vybitá baterie proto neznamená, že došly částice, ale že došla zásoba energie.",
    vysvetleni:
      "Zdroj dodává energii, spotřebič ji mění. Proud ani částice se nespotřebovávají, jen energii přenášejí.",
  },
  {
    otazka:
      "V obvodu jsou dvě žárovky zapojené za sebou v jedné řadě. Jednu z nich vyšroubuješ. Co udělá ta druhá?",
    klic: "Zhasne také, protože se přerušila společná cesta proudu.",
    chybne: [
      {
        value: "Bude svítit dál, dokonce jasněji.",
        why: "Jasněji by svítila, kdyby zůstala v uzavřeném obvodu sama. Vyšroubováním se ale cesta přerušila.",
      },
      {
        value: "Bude svítit dál, jen slaběji.",
        why: "Slaběji ne — zhasne úplně. Přerušeným obvodem neteče žádný proud.",
      },
      {
        value: "Chvíli ještě svítí a pak pomalu zhasne.",
        why: "Zhasne okamžitě. Proud se zastaví ve chvíli, kdy vznikne mezera.",
      },
    ],
    h0: "Obě žárovky leží na jedné a téže cestě. Zamysli se, co s ní udělá mezera kdekoli.",
    h1: "Zapojení za sebou znamená jedinou cestu, po které proud postupně projde oběma žárovkami. Jakmile v té cestě vznikne mezera, zastaví se proud v celém obvodu a zhasne všechno. Takhle bývaly zapojené staré vánoční řetězy — stačila jedna vadná žárovička a zhasla celá řada.",
    vysvetleni:
      "V zapojení za sebou je jediná cesta proudu. Její přerušení kdekoli vypne celý obvod naráz.",
  },
  {
    otazka:
      "Dvě žárovky jsou zapojené každá ve vlastní větvi, obě rovnou k téže baterii. Jednu vyšroubuješ. Co udělá ta druhá?",
    klic: "Svítí dál, protože má vlastní uzavřenou cestu k baterii.",
    chybne: [
      {
        value: "Zhasne také, obě jsou na téže baterii.",
        why: "Společná baterie nestačí. Rozhoduje, jestli má druhá žárovka pořád svou vlastní uzavřenou cestu — a tu má.",
      },
      {
        value: "Bude svítit slaběji, protože přišla o pomoc té druhé.",
        why: "Druhá žárovka jí nijak nepomáhala. Každá má svou vlastní cestu.",
      },
      {
        value: "Rozsvítí se, jen pokud se vymění baterie.",
        why: "Baterie je pořád táž a její cesta k té druhé žárovce zůstala nedotčená.",
      },
    ],
    h0: "Nakresli si obě cesty proudu zvlášť. Kolik z nich vyšroubovaná žárovka přeruší?",
    h1: "Když má každá žárovka svou vlastní větev, vedou od baterie dvě oddělené cesty. Vyšroubováním se přeruší jen ta jedna a druhá zůstane celá, takže po ní proud teče dál. Přesně takhle je zapojené osvětlení v domě — zhasnutá lampa v kuchyni nevypne světlo v pokoji.",
    vysvetleni:
      "Ve větvích jsou cesty proudu oddělené. Přerušení jedné větve se druhé nedotkne — proto se tak zapojuje osvětlení v budovách.",
  },
  {
    otazka:
      "Spínač zapojíš jednou hned u baterie a podruhé až za žárovkou. Jak se ta změna projeví?",
    klic: "Nijak — obvod se rozepne stejně, ať je spínač kdekoli.",
    chybne: [
      {
        value: "U baterie vypne rychleji, protože je blíž zdroji.",
        why: "Rozdíl v čase nepoznáš. Proud se zastaví v celém obvodu prakticky okamžitě.",
      },
      {
        value: "Za žárovkou nevypne vůbec, protože je proud už spotřebovaný.",
        why: "Proud se ve spotřebiči nespotřebovává — za žárovkou je pořád stejně velký jako před ní.",
      },
      {
        value: "U baterie šetří energii, za žárovkou ne.",
        why: "Rozepnutý obvod nespotřebuje energii ani v jednom případě.",
      },
    ],
    h0: "Když je obvod přerušený na jednom místě, na kolika místech po něm teče proud?",
    h1: "Obvod je jediná uzavřená smyčka a mezera kdekoli v ní zastaví proud všude. Proto je jedno, jestli spínač sedí hned u baterie, mezi drátem a žárovkou, nebo až za ní. Vypínač u dveří vypíná lampu u stropu úplně stejně dobře jako vypínač na jejím kabelu.",
    vysvetleni:
      "Poloha spínače v nerozvětveném obvodu nehraje roli. Rozpojení kdekoli zastaví proud v celé smyčce.",
  },
  {
    otazka:
      "Póly baterie spojíš jenom drátem, bez jakéhokoli spotřebiče. Co se stane?",
    klic: "Proud se prudce rozeběhne, drát se rozpálí a baterie se rychle vybije — tomu se říká zkrat.",
    chybne: [
      {
        value: "Nestane se nic, chybí přece spotřebič.",
        why: "Stane se toho hodně. Uzavřený obvod stačí a proud se rozeběhne i bez spotřebiče, dokonce mnohem silněji.",
      },
      {
        value: "Proud poteče pomalu, protože nemá co napájet.",
        why: "Je to naopak. Bez spotřebiče má proud cestu příliš snadnou a je velmi silný.",
      },
      {
        value: "Baterie se naopak nabije.",
        why: "Baterie se tímhle nenabíjí, ale velmi rychle vybíjí.",
      },
    ],
    h0: "Spotřebič proudu cestu ztěžuje. Domysli, co se stane, když mu ji nic neztěžuje.",
    h1: "Spotřebič klade proudu odpor a tím ho drží v rozumné velikosti. Když se póly spojí holým drátem, zbude cesta, která mu skoro nic nebrání, takže proud vyskočí a všechna energie se změní na teplo přímo v drátu. Ten se rozpálí a baterie se během chvilky vyčerpá. Proto se póly nikdy nespojují napřímo a proto se do domovních rozvodů dávají pojistky.",
    vysvetleni:
      "Zkrat je spojení pólů zdroje cestou bez spotřebiče. Proud prudce vzroste, vodič se zahřeje a hrozí popálení i požár. Není to totéž co přerušený obvod — je to přesný opak.",
  },
  {
    otazka:
      "Baterka svítí dva večery a pak baterie dojde. Jak to, když se proud v obvodu nespotřebovává?",
    klic: "Nedošel proud, ale zásoba energie, kterou baterie do obvodu dodávala.",
    chybne: [
      {
        value: "V baterii došly částice, které proud tvoří.",
        why: "Částice zůstávají v obvodu i v baterii. Došla energie, ne částice.",
      },
      {
        value: "Proud se přece jen trochu spotřebovává, jen velmi pomalu.",
        why: "Nespotřebovává vůbec. Do zdroje se vrací přesně tolik, kolik z něj vyšlo.",
      },
      {
        value: "Žárovka se opotřebovala a přestala proud propouštět.",
        why: "Vyčerpaná je baterie, ne žárovka. V nové baterce tatáž žárovka svítí dál.",
      },
    ],
    h0: "Vybitá baterie neznamená, že něco z obvodu zmizelo. Ptej se, čeho v ní ubylo.",
    h1: "Baterie je zásobárna energie, ne zásobárna proudu. Částice po obvodu jenom kolují a cestou předávají energii žárovce, která ji mění na světlo a teplo. Jakmile je zásoba v baterii vyčerpaná, nemá už co částicím dodávat a proud se zastaví — částic je přitom v obvodu pořád stejně.",
    vysvetleni:
      "Vybití baterie je vyčerpání zásoby energie. Proud ani částice se přitom nespotřebovávají.",
  },
  {
    otazka:
      "Dvě žárovky zapojené za sebou svítí slaběji než jedna jediná na téže baterii. Čím to je?",
    klic: "Dvě žárovky kladou proudu dohromady větší odpor, takže obvodem teče menší proud.",
    chybne: [
      {
        value: "První žárovka spotřebuje část proudu a na druhou zbude méně.",
        why: "Proud je v obou žárovkách stejně velký. Kdyby první ubírala, druhá by svítila slaběji než ona — a ony svítí stejně.",
      },
      {
        value: "Energie se musí rozdělit, takže každá dostane polovinu proudu.",
        why: "Energie se opravdu dělí, jenže proud je v celé řadě všude týž. Menší je proto, že je cesta obtížnější.",
      },
      {
        value: "Baterie na dvě žárovky nestačí a dodá méně energie.",
        why: "Baterie je táž. Změnila se cesta, po které proud jde.",
      },
    ],
    h0: "Obě žárovky svítí stejně, ne první víc a druhá míň. To samo o sobě vyvrací jedno z vysvětlení.",
    h1: "Každá žárovka klade proudu odpor a dvě za sebou ho kladou víc než jedna. Proud je proto v celém obvodu menší a obě žárovky svítí slaběji — ale obě stejně. Právě tím se pozná, že se proud po cestě nespotřebovává: kdyby ho první ubírala, druhá by musela svítit slaběji než ona.",
    vysvetleni:
      "Víc spotřebičů za sebou znamená menší proud v celém obvodu. Všechny přitom svítí stejně, protože proud je v nerozvětveném obvodu všude stejný.",
  },
  {
    otazka:
      "Ve starém vánočním řetězu zhasla celá řada, přestože je vadná jen jedna žárovička. Co z toho poznáš o jeho zapojení?",
    klic: "Žárovičky jsou zapojené za sebou v jediné smyčce.",
    chybne: [
      {
        value: "Každá žárovička má vlastní větev.",
        why: "Pak by zhasla jen ta vadná a zbytek by svítil dál.",
      },
      {
        value: "Vadná žárovička spálila i ty ostatní.",
        why: "Ostatní jsou v pořádku. Po výměně té jedné se celá řada zase rozsvítí.",
      },
      {
        value: "Došlo ke zkratu v celém řetězu.",
        why: "Při zkratu by se naopak rozeběhl velký proud. Tady neteče žádný, protože je řada přerušená.",
      },
    ],
    h0: "Porovnej to se svítidly v bytě: tam zhasnutá lampa ostatní nevypne.",
    h1: "Když kvůli jedné vadné žárovičce zhasne celá řada, musí všechny ležet na téže cestě proudu — tedy být zapojené za sebou. Kdyby měla každá vlastní větev, přerušila by se jen jedna a zbytek by svítil dál. Proto se novější řetězy zapojují po kratších úsecích, aby nezhasl celý.",
    vysvetleni:
      "Chování obvodu při jedné závadě prozradí jeho zapojení. Zhasne-li všechno naráz, je zapojení za sebou.",
  },
  {
    otazka:
      "Žárovku v obvodu otočíš naopak a svítí úplně stejně. Tentýž pokus s malým motorkem dopadne jinak — otočí se na druhou stranu. Co z toho plyne?",
    klic: "Žárovce na směru proudu nezáleží, motorku ano.",
    chybne: [
      {
        value: "Motorek je vadný, správně by se choval jako žárovka.",
        why: "Chová se tak správně. Podle směru proudu se točí na jednu nebo na druhou stranu.",
      },
      {
        value: "Žárovka směr proudu vyrovnává.",
        why: "Nic nevyrovnává. Prostě jen na směru nezávisí — vlákno se rozžhaví tak jako tak.",
      },
      {
        value: "V otočeném obvodu teče proud slaběji.",
        why: "Proud je stejně velký. Mění se jen jeho směr.",
      },
    ],
    h0: "U obou součástek je změna táž — otočený směr proudu. Liší se až to, jak na to zareagují.",
    h1: "Vlákno žárovky se rozžhaví bez ohledu na to, kterým směrem jím proud jde, takže otočení nepoznáš. Motorek si ale ze směru odvozuje, na kterou stranu se má točit, a otočením se roztočí obráceně. Stejně citlivá na směr je i LED dioda: zapojená naopak nesvítí vůbec.",
    vysvetleni:
      "Některým spotřebičům na směru proudu nezáleží (žárovka, topná spirála), jiným ano (motorek, LED dioda). Proto se u nich hlídá, kterým pólem se zapojují.",
  },
  {
    otazka:
      "Proč musí mít baterie dva póly a proč by jeden nestačil?",
    klic: "Proud musí mít cestu tam i zpátky — z jednoho pólu vyjít a druhým se vrátit.",
    chybne: [
      {
        value: "Aby se dala zapojit z obou stran.",
        why: "Otočit se dá, jenže oba póly se použijí vždycky naráz, ne jeden nebo druhý.",
      },
      {
        value: "Aby dodala dvakrát tolik energie.",
        why: "Energii dodává baterie jako celek. Dva póly nejsou dva zdroje.",
      },
      {
        value: "Jeden pól je zásobní pro případ, že se druhý vybije.",
        why: "Vybíjí se celá baterie naráz. Zásobní pól neexistuje.",
      },
    ],
    h0: "Vzpomeň si na obvod s jedním drátem a domysli, proč nefungoval.",
    h1: "Proud není něco, co by se dalo vyslat jedním směrem a tam nechat. Je to uzavřený koloběh: částice z jednoho pólu vyjdou, projdou celým obvodem a druhým pólem se vrátí zpátky. Kdyby měl zdroj jediný pól, nebylo by kam se vracet a proud by se nerozeběhl vůbec.",
    vysvetleni:
      "Obvod musí být uzavřený, a proto má zdroj dva póly. Jedním proud vychází a druhým se vrací.",
  },
  {
    otazka:
      "V obvodu se dvěma žárovkami za sebou změříš proud před první žárovkou a pak mezi oběma. Jaké hodnoty naměříš?",
    klic: "Obě stejné — proud je v celé řadě všude stejně velký.",
    chybne: [
      {
        value: "Za první žárovkou menší, protože část spotřebovala.",
        why: "Žárovka spotřebovává energii, ne proud. Za ní je proud stejně velký jako před ní.",
      },
      {
        value: "Za první žárovkou větší, protože ji rozproudila.",
        why: "Nic se nerozproudí. Žárovka proud nepřidává.",
      },
      {
        value: "Mezi žárovkami nulové, tam už proud není potřeba.",
        why: "Kdyby tam byl nulový, nesvítila by druhá žárovka vůbec.",
      },
    ],
    h0: "Zamysli se, co by muselo platit, aby druhá žárovka svítila úplně stejně jako první.",
    h1: "Proud se po cestě nemá kde ztratit, takže je v nerozvětveném obvodu všude stejně velký — před první žárovkou, mezi nimi i za druhou. Právě proto obě svítí stejně. Kdyby první ubírala, byla by druhá viditelně slabší a to se nestává.",
    vysvetleni:
      "V nerozvětveném obvodu je proud všude stejně velký. Rozdíl mezi spotřebiči je v energii, kterou odeberou, ne v proudu, který jimi projde.",
  },
];

const KROKY_L2 = [
  "Projdi cestu proudu od jednoho pólu zdroje ke druhému.",
  "Najdi, jestli je někde mezera — rozepnutý spínač, izolant, uvolněný spoj.",
  "Uzavřený obvod z vodičů znamená, že proud poteče. Jinak neteče vůbec.",
];

const KROKY_L3 = [
  "Proud se nespotřebovává — v nerozvětveném obvodu je všude stejně velký.",
  "Spotřebovává se energie, kterou dodává zdroj.",
  "Jedna společná cesta = přerušení vypne všechno. Vlastní větve = ne.",
];

function zBanky(p: Polozka, kroky: string[]): PracticeTask {
  return task(p.otazka, p.klic, p.chybne, {
    hints: [p.h0, p.h1],
    solutionSteps: kroky,
    explanation: p.vysvetleni,
  });
}

function gen(level: number): PracticeTask[] {
  return ruzneUlohy(() =>
    level === 1
      ? genL1()
      : level === 2
        ? zBanky(pick(ZAPOJENI), KROKY_L2)
        : zBanky(pick(PROUD), KROKY_L3),
  );
}

export const ELEKTRICKY_OBVOD: TopicMetadata[] = [
  {
    id: "g6-fyz-elektricky-obvod-6",
    rvpNodeId:
      "g6-fyzika-elektricke-vlastnosti-latek-elektricky-naboj-a-magnetismus-jednoduchy-elektricky-obvod-zdroj-vodic-spotrebic-spinac",
    displayName: "Elektrický obvod",
    title: "Jednoduchý elektrický obvod – zdroj, vodič, spotřebič, spínač",
    studentTitle: "Elektrický obvod",
    subject: "fyzika",
    category: "Elektrické vlastnosti látek",
    topic: "Elektrický náboj a magnetismus",
    briefDescription: "Zjistíš, proč jeden drát nestačí a proč se proud nespotřebuje.",
    keywords: [
      "elektrický obvod", "zdroj", "vodič", "spotřebič", "spínač",
      "uzavřený obvod", "izolant", "zkrat", "schéma obvodu", "elektrický proud",
    ],
    goals: [
      "Určit úlohu součástky v obvodu: zdroj, vodič, spotřebič, spínač.",
      "Rozhodnout o konkrétním zapojení, jestli obvodem poteče proud.",
      "Vysvětlit, že se v obvodu spotřebovává energie, a ne proud.",
    ],
    boundaries: [
      "Bez ampérů, voltů, ohmů a Ohmova zákona — proud se popisuje slovy.",
      "Zapojení za sebou a ve větvích se popisuje slovně, bez názvů sériové a paralelní.",
      "Schematické značky se zkoušejí slovním popisem, ne obrázkem.",
      "Bez střídavého proudu a bez domovních rozvodů nad rámec zmínky o pojistce.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-elektricky-naboj-6"],
    generator: gen,
    helpTemplate: {
      hint: "Obvod musí být uzavřený: ze zdroje přes spotřebič a zase zpátky do zdroje.",
      steps: [
        "Zdroj dodává energii, vodič vede, spotřebič mění, spínač rozpojuje.",
        "Mezera kdekoli v obvodu zastaví proud všude.",
        "Proud se nespotřebovává — spotřebovává se energie.",
      ],
      commonMistake: "Myslet si, že jeden drát stačí a že se proud ve spotřebiči spotřebuje.",
      example: "Dvě žárovky za sebou: vyšroubuj jednu a zhasne i druhá. Ve vlastních větvích ne.",
    },
  },
];
