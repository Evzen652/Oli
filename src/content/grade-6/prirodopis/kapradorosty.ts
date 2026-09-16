/**
 * Přírodopis 6. ročník — Kapraďorosty: kapradiny, přesličky, plavuně (select_one).
 *
 * Kapraďorosty mají kořen, stonek (často podzemní oddenek) a listy s cévními
 * svazky, proto dorůstají výš než mechy. Nekvetou, nemají semena a rozmnožují
 * se výtrusy z výtrusnic. Kapradiny mají výtrusnice v kupkách na rubu listů,
 * přeslička rolní článkovaný stonek s křemíkem a jarní hnědou lodyhu s klasem,
 * plavuně drobné hustě nahloučené lístky a výtrusnice v klasech. Pravěké
 * stromovité kapraďorosty z prvohor daly vznik černému uhlí.
 *
 * Chybový model (každý distraktor = jedna z těchto chyb):
 *  • kapradina kvete a má semena (pověst o kvetoucím kapradí);
 *  • hnědé kupky na rubu listu = nemoc, plíseň nebo vajíčka hmyzu;
 *  • záměna s mechem (bez kořenů a cévních svazků), přesličky s trávou nebo
 *    s mladým jehličnanem, plavuně s mechem;
 *  • černé uhlí z dinosaurů nebo z jehličnanů.
 *
 *  • L1 — zapamatování: jeden fakt (rozmnožování, výtrusnice, stavba, zařazení zástupce).
 *  • L2 — použití: výběr zástupce, funkce části těla, dvě lodyhy přesličky, prostředí a ochrana.
 *  • L3 — přenos: poznání rostliny z popisu s klamavým vzhledem, neznámý případ,
 *         pravěk a zkameněliny, znak → nový důsledek.
 *
 * Nápovědy jsou psané ručně pro každou položku (velká je aspoň o pětinu delší
 * než malá). Obecná strategická věta z `buildChoiceTask` se nepřidává —
 * opakovala se a u rostlin zněla divně.
 *
 * Každá úroveň má čtyři šablony po čtyřech položkách; banka je seřazená
 * střídavě (a, b, c, d, a, b, …), rotace začíná na náhodném místě uvnitř gen().
 * Modul nemá stav.
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

const uloha = (p: Polozka): PracticeTask | null => {
  const t = choice(p.q, p.key, shuffle(p.ds.map(([value, why]) => ({ value, why }))), { hints: [...p.h], explanation: p.ex });
  // Nápovědy přesně podle položky, bez přilepené obecné strategie.
  if (t) t.hints = [...p.h];
  return t;
};

// Opakované diagnózy chyb (stejná miskoncepce → stejné vysvětlení).
const FB_SEMENA = "Kapraďorosty nekvetou a semena nemají. Rozmnožují se výtrusy z výtrusnic. Pověst o kvetoucím kapradí je jen pověst.";
const FB_KVETY = "Kapraďorosty nikdy nekvetou. Květy a semena mají až semenné rostliny, kapraďorosty mají výtrusy.";
const FB_MECH = "Mechy nemají pravé kořeny ani cévní svazky, proto zůstávají nízké. Kapraďorosty kořeny i cévní svazky mají.";
const FB_TRAVA = "Tráva má také článkované stéblo, ale kvete a tvoří semena. Přeslička nekvete a její klas nese výtrusy.";
const FB_JEHLICNAN = "Jehličnan má dřevnatý kmen, jehlice a šišky se semeny. Přeslička ani plavuň jehlice nemají a jejich klasy nesou výtrusy.";
const FB_PLAVUN_MECH = "Plavuň se mechu na první pohled podobá, ale má pravé kořeny a cévní svazky. Mechy je nemají.";
const FB_DINO = "Dinosauři žili až v druhohorách a uhlí z jejich těl nevzniklo. Černé uhlí vzniklo hlavně z pravěkých stromovitých kapraďorostů v prvohorách.";
const FB_FOTO_TMA = "Fotosyntéza potřebuje světlo a zelené barvivo. Pod zemí ani v hnědé lodyze bez zeleného barviva neprobíhá.";

/** Seřadí šablony střídavě: a1, b1, c1, d1, a2, b2, … */
function stridave(...sablony: Polozka[][]): Polozka[] {
  const out: Polozka[] = [];
  const n = Math.max(...sablony.map((s) => s.length));
  for (let i = 0; i < n; i++) for (const s of sablony) if (s[i]) out.push(s[i]);
  return out;
}

// ══ L1 — zapamatování ═══════════════════════════════════════════════════════

// (a) rozmnožování a obecná stavba
const L1_A: Polozka[] = [
  {
    q: "Čím se rozmnožují kapraďorosty?",
    key: "výtrusy",
    ds: [
      ["semeny", FB_SEMENA],
      ["květy", FB_KVETY],
      ["jen kousky oddenku", "Kousek oddenku může dorůst, ale to je jen doplněk. Hlavní rozmnožování kapraďorostů probíhá drobnými částicemi z výtrusnic."],
    ],
    h: [
      "Kapraďorosty nikdy nekvetou. Čím se tedy může šířit rostlina, která nemá květy?",
      "Hledej drobné částice, které vznikají ve výtrusnicích: u kapradin v hnědých kupkách, u přesliček a plavuní v klasech.",
    ],
    ex: "Kapraďorosty nekvetou a nemají semena. Rozmnožují se výtrusy, které vznikají ve výtrusnicích a roznáší je vítr.",
  },
  {
    q: "Co kapraďorosty během celého života nikdy nevytvoří?",
    key: "květy ani semena",
    ds: [
      ["výtrusy ani výtrusnice", "Výtrusy a výtrusnice kapraďorosty mají, právě jimi se rozmnožují."],
      ["kořeny ani oddenky", "Kapraďorosty mají pravé kořeny a mnohé i podzemní oddenek. Tím se liší od mechů."],
      ["zelené listy ani stonky", "Kapraďorosty mají stonek i zelené listy, ve kterých probíhá fotosyntéza."],
    ],
    h: [
      "Vzpomeň si, čím se kapraďorosty liší od třešně nebo od pampelišky.",
      "Kořeny, stonek i listy kapraďorosty mají. Chybí jim ty části, ze kterých u jiných rostlin vznikají plody.",
    ],
    ex: "Kapraďorosty nikdy nekvetou a nemají semena. Mají kořeny, stonek i listy a rozmnožují se výtrusy.",
  },
  {
    q: "V čem se tvoří výtrusy kapraďorostů?",
    key: "ve výtrusnicích",
    ds: [
      ["v semenících", "Semeník je součást květu a vznikají v něm semena. Kapraďorosty květy ani semena nemají."],
      ["v šiškách", "Šišky mají jehličnany a jsou v nich semena. Kapraďorosty mají výtrusy v jiných útvarech."],
      ["v kořenových hlízách", "Kořeny sají vodu a drží rostlinu v půdě. Výtrusy v nich nevznikají."],
    ],
    h: [
      "Název útvaru, ve kterém výtrusy vznikají, je od slova výtrus odvozený.",
      "U kapradin jsou tyto útvary shluknuté do hnědých kupek na listech, u přesliček a plavuní v klasech.",
    ],
    ex: "Výtrusy vznikají ve výtrusnicích. Kapradiny je mají v kupkách na rubu listů, přesličky a plavuně v klasech.",
  },
  {
    q: "Jaký stonek mají kapradiny v našich lesích nejčastěji?",
    key: "podzemní oddenek",
    ds: [
      ["vysoký dřevnatý kmen", "Stromovité kapradiny rostly v pravěku a dnes rostou v tropech. Naše kapradiny kmen nemají."],
      ["duté článkované stéblo", "Duté článkované stéblo má tráva, podobně článkovaný je stonek přesličky. Kapradina ho nemá."],
      ["drobnou lodyžku jako mech", FB_MECH],
    ],
    h: [
      "Nad zemí u kapradě vidíš hlavně velké listy. Kde asi bude její stonek?",
      "Stonek naší kapradiny je ukrytý v půdě a ukládá zásoby. Z něj každé jaro vyrážejí nové listy.",
    ],
    ex: "Naše kapradiny mají stonek pod zemí jako oddenek. Nad zem z něj vyrůstají jen listy.",
  },
];

// (b) výtrusnice a výtrusy
const L1_B: Polozka[] = [
  {
    q: "Kde najdeš výtrusnice u kapradě samce?",
    key: "na rubu listů",
    ds: [
      ["v květech na vrcholu", FB_KVETY],
      ["v kořenech pod zemí", "Kořeny sají vodu a drží rostlinu. Výtrusy pod zemí nevznikají, vítr by je odtud neroznesl."],
      ["na líci listů", "Líc je horní strana listu. Hnědé kupky výtrusnic má kapradina na opačné straně."],
    ],
    h: [
      "Otoč list kapradě a prohlédni si obě jeho strany. Kde jsou hnědé kupky?",
      "Vzpomeň si, jak se říká horní a spodní straně listu. Kupky nejsou na té straně, na kterou svítí slunce.",
    ],
    ex: "Kapraď samec má výtrusnice v hnědých kupkách na rubu, tedy na spodní straně listů.",
  },
  {
    q: "Jak se zralé výtrusy kapraďorostů dostanou daleko od mateřské rostliny?",
    key: "roznese je vítr",
    ds: [
      ["roznesou je včely při opylování", "Včely přenášejí pyl z květu na květ. Kapraďorosty nekvetou a včely kvůli nim nepřilétají."],
      ["odnesou je mravenci jako semínka", FB_SEMENA],
      ["zůstanou v listu, dokud neshnije", "Zralá výtrusnice se otevře a výtrusy se z ní vysypou. V listu nezůstanou."],
    ],
    h: [
      "Výtrusy jsou tak drobné a lehké, že je jednotlivě okem neuvidíš. Co je může unést?",
      "Kapraďorosty nekvetou, a proto k nim nepřilétá hmyz za pylem. Výtrusy odnáší něco, co v lese proudí mezi stromy.",
    ],
    ex: "Zralá výtrusnice se otevře a drobné lehké výtrusy roznese vítr. Hmyz ani zvířata k tomu kapraďorosty nepotřebují.",
  },
  {
    q: "Kde má výtrusnice přeslička rolní?",
    key: "v klasu na jarní lodyze",
    ds: [
      ["na rubu letních listů", "Výtrusnice na rubu listů mají kapradiny. Přeslička má výtrusnice v klasu."],
      ["v drobných květech", FB_KVETY],
      ["v šišce u kořene", "Šišky mají jehličnany a jsou v nich semena. Přeslička šišky nemá."],
    ],
    h: [
      "Přeslička rolní má během roku dva druhy lodyh. Která z nich nese výtrusnice?",
      "Na jaře vyroste hnědá lodyha bez zeleného barviva a na jejím vrcholu je útvar podobný malé paličce.",
    ],
    ex: "Přeslička rolní má výtrusnice v klasu na vrcholu jarní hnědé lodyhy. Letní zelená lodyha slouží k fotosyntéze.",
  },
  {
    q: "Kde nese výtrusnice plavuň vidlačka?",
    key: "v klasech na vrcholu lodyh",
    ds: [
      ["v kupkách na rubu listů", "Kupky na rubu listů mají kapradiny. Plavuň má jen drobné lístky a výtrusnice v klasech."],
      ["v květech mezi lístky", FB_KVETY],
      ["v semenících na lodyze", "Semeník je součást květu a vznikají v něm semena. Plavuň nekvete a výtrusnice nese v klasech."],
    ],
    h: [
      "Plavuň má jen drobné lístky, na kterých se kupky nevejdou. Kde jinde mohou výtrusnice být?",
      "Z plazivého stonku se zvedají větvičky a na jejich koncích jsou nápadné protáhlé útvary, často dva vedle sebe.",
    ],
    ex: "Plavuň vidlačka nese výtrusnice v klasech na vrcholu vztyčených lodyh, často po dvou jako vidlička.",
  },
];

// (c) stavba těla a srovnání s mechy
const L1_C: Polozka[] = [
  {
    q: "Kterou část těla mají kapraďorosty, ale mechy ne?",
    key: "pravé kořeny",
    ds: [
      ["zelené lístky", "Zelené lístky mají i mechy. Rozdíl je v tom, co mají kapraďorosty pod zemí."],
      ["výtrusy", "Výtrusy mají mechy i kapraďorosty, obě skupiny se jimi rozmnožují."],
      ["květy", FB_KVETY],
    ],
    h: [
      "Mech se k zemi jen přichytí tenkými vlákny. Co drží v půdě kapradinu?",
      "Hledej část těla, která saje vodu z půdy a vede ji dál do rostliny. Mechy mají místo ní jen příchytná vlákna.",
    ],
    ex: "Kapraďorosty mají pravé kořeny, mechy se přichycují jen příchytnými vlákny.",
  },
  {
    q: "Čím se v těle kapraďorostu vede voda od kořene k listům?",
    key: "cévními svazky",
    ds: [
      ["příchytnými vlákny", "Příchytná vlákna mají mechy, rostlinu jen přichytí. Vodu vysoko nevedou."],
      ["jen povrchem těla", "Povrchem přijímají vodu mechy. Kapraďorosty mají uvnitř těla zvláštní vodivá pletiva."],
      ["dutými chlupy na listech", "Voda neproudí chlupy na listech. Kapraďorosty ji vedou vodivými pletivy uvnitř stonku a listů."],
    ],
    h: [
      "Kapraďorosty dorůstají výš než mechy. Co musí mít uvnitř těla, aby se voda dostala nahoru?",
      "Uvnitř stonku a listů běží tenké trubičky, podobně jako žilky v listu stromu. Jak se jim říká? Příchytná vlákna to nejsou, ta mají mechy.",
    ],
    ex: "Kapraďorosty mají cévní svazky, které vedou vodu od kořene do listů. Proto dorostou výš než mechy.",
  },
  {
    q: "Jak vypadá mladý list kapradiny, když raší?",
    key: "je stočený do spirály",
    ds: [
      ["je složený v poupěti", "Poupě je nerozvitý květ. Kapradiny nekvetou a poupata nemají."],
      ["je ukrytý v semeni", FB_SEMENA],
      ["je svinutý v šišce", "Šišky mají jehličnany. Mladý list kapradiny v šišce není."],
    ],
    h: [
      "Vzpomeň si na jaro v lese: mladé listy kapradin vypadají jako hlavička houslí.",
      "Svinutý list se postupně narovnává od spodní části ke špičce, podobně jako když se rozbaluje srolovaný koberec.",
    ],
    ex: "Mladé listy kapradin jsou stočené do spirály a postupně se rozvinují od spodní části ke špičce.",
  },
  {
    q: "Jaké listy má plavuň vidlačka?",
    key: "drobné nahloučené lístky",
    ds: [
      ["velké zpeřené listy", "Velké zpeřené listy mají kapradiny. Plavuň má lístky úplně drobné."],
      ["přesleny tenkých větévek", "Přesleny tenkých větévek má přeslička. Plavuň má stonek pokrytý lístky."],
      ["dlouhé tuhé jehlice", "Jehlice mají jehličnany. Plavuň jehlice nemá a její klasy nesou výtrusy, ne semena."],
    ],
    h: [
      "Plavuň je nízká plazivá rostlina a její stonek je hustě porostlý. Čím?",
      "Kapradiny mají velké listy a přesličky kruhy větévek. Stonek plavuně vypadá jako zelený chlupatý provázek.",
    ],
    ex: "Plavuň vidlačka má stonek hustě pokrytý drobnými lístky, které jsou těsně vedle sebe.",
  },
];

// (d) zařazení zástupce (název zástupce neobsahuje odpověď)
const L1_D: Polozka[] = [
  {
    q: "Do které skupiny rostlin patří hasivka orličí?",
    key: "kapradiny",
    ds: [
      ["přesličky", "Přesličky mají článkovaný stonek s přesleny větévek. Hasivka má velké zpeřené listy."],
      ["plavuně", "Plavuně jsou nízké a mají drobné lístky. Hasivka má velké zpeřené listy."],
      ["mechy", FB_MECH],
    ],
    h: [
      "Hasivka orličí má velké zpeřené listy, které mohou dorůst až do výšky člověka.",
      "Velké zpeřené listy s výtrusnicemi na spodní straně jsou znakem jedné skupiny kapraďorostů. Přesličky ani plavuně takové listy nemají.",
    ],
    ex: "Hasivka orličí má velké zpeřené listy s výtrusnicemi na rubu, patří mezi kapradiny.",
  },
  {
    q: "Do které skupiny rostlin patří sleziník routička?",
    key: "kapradiny",
    ds: [
      ["přesličky", "Přesličky mají článkovaný stonek s přesleny větévek. Sleziník má drobné zpeřené listy."],
      ["plavuně", "Plavuně mají drobné nečleněné lístky a výtrusnice v klasech. Sleziník má kupky na rubu listů."],
      ["mechy", "Sleziník roste ve škvírách zdí jako mech, ale má pravé kořeny a cévní svazky. Mech je nemá."],
    ],
    h: [
      "Sleziník routička roste ve škvírách zdí a skal a má drobné zpeřené listy s kupkami na rubu.",
      "Kupky výtrusnic na spodní straně zpeřeného listu prozrazují skupinu i u takto drobné rostlinky. Přesličky a plavuně mají výtrusnice v klasech.",
    ],
    ex: "Sleziník routička má zpeřené listy s kupkami výtrusnic na rubu, patří mezi kapradiny.",
  },
  {
    q: "Kam zařadíš přesličku rolní?",
    key: "mezi kapraďorosty",
    ds: [
      ["mezi trávy", FB_TRAVA],
      ["mezi mechy", FB_MECH],
      ["mezi jehličnany", FB_JEHLICNAN],
    ],
    h: [
      "Přeslička rolní má pravé kořeny a cévní svazky, ale nikdy nekvete.",
      "Rozmnožuje se výtrusy z klasu na jarní lodyze. Do které velké skupiny patří spolu s kapradinami a plavuněmi?",
    ],
    ex: "Přeslička rolní má kořeny a cévní svazky, nekvete a rozmnožuje se výtrusy. Je to kapraďorost.",
  },
  {
    q: "Kam zařadíš plavuň vidlačku?",
    key: "mezi kapraďorosty",
    ds: [
      ["mezi mechy", FB_PLAVUN_MECH],
      ["mezi lišejníky", "Lišejník je soužití houby a řasy nebo sinice. Plavuň je rostlina s kořeny a cévními svazky."],
      ["mezi jehličnany", FB_JEHLICNAN],
    ],
    h: [
      "Plavuň vidlačka je nízká a zelená, ale má pravé kořeny a cévní svazky.",
      "Nekvete a výtrusy nese v klasech. Stejnou stavbu těla i rozmnožování mají kapradiny a přesličky.",
    ],
    ex: "Plavuň vidlačka má kořeny a cévní svazky, nekvete a rozmnožuje se výtrusy. Je to kapraďorost.",
  },
];

const BANKA_L1 = stridave(L1_A, L1_B, L1_C, L1_D);

// ══ L2 — použití ═══════════════════════════════════════════════════════════

// (a) výběr zástupce
const L2_A: Polozka[] = [
  {
    q: "Která z těchto rostlin patří mezi kapraďorosty?",
    key: "hasivka orličí",
    ds: [
      ["rašeliník bahenní", "Rašeliník je mech, nemá pravé kořeny ani cévní svazky."],
      ["pýr plazivý", "Pýr je tráva. Kvete a tvoří semena, kapraďorost to není."],
      ["smrk ztepilý", "Smrk je jehličnan se šiškami a semeny. Kapraďorosty semena nemají."],
    ],
    h: [
      "Hledej rostlinu, která má kořeny a cévní svazky, ale nikdy nekvete.",
      "Vyřaď nejdřív rostlinu bez kořenů a pak ty, které kvetou nebo tvoří semena v šiškách.",
    ],
    ex: "Hasivka orličí je kapradina, tedy kapraďorost. Rašeliník je mech, pýr tráva a smrk jehličnan.",
  },
  {
    q: "Která z těchto lesních rostlin se rozmnožuje výtrusy z kupek na rubu listů?",
    key: "kapraď samec",
    ds: [
      ["ploník obecný", "Ploník je mech. Výtrusy má v tobolce na štětu, ne v kupkách na listech."],
      ["borůvka černá", "Borůvka kvete a tvoří plody se semeny. Výtrusnice nemá."],
      ["jedle bělokorá", "Jedle je jehličnan a má semena v šiškách. Výtrusnice na listech nemá."],
    ],
    h: [
      "Kupky výtrusnic na spodní straně listu jsou typické pro jednu skupinu kapraďorostů.",
      "Vyřaď rostliny, které kvetou nebo mají šišky. Pak vyřaď i mech, který nese výtrusy v tobolce na štětu, ne v kupkách.",
    ],
    ex: "Kupky výtrusnic na rubu listů má kapraď samec. Ploník je mech s tobolkou, borůvka kvete a jedle má šišky.",
  },
  {
    q: "Která z těchto rostlin má pravé kořeny a cévní svazky a rozmnožuje se výtrusy?",
    key: "přeslička lesní",
    ds: [
      ["rašeliník", "Rašeliník má výtrusy, ale nemá pravé kořeny ani cévní svazky. Je to mech."],
      ["pampeliška lékařská", "Pampeliška kvete a rozmnožuje se semeny s chmýrem."],
      ["smrk ztepilý", "Smrk má kořeny i cévní svazky, ale rozmnožuje se semeny ze šišek."],
    ],
    h: [
      "Všechny tři znaky zároveň platí jen pro kapraďorosty.",
      "Výtrusy mají i mechy, ale ty nemají kořeny. Kořeny mají i semenné rostliny, ale ty mají semena.",
    ],
    ex: "Kořeny, cévní svazky a výtrusy zároveň má jen kapraďorost, tedy přeslička lesní.",
  },
  {
    q: "Který z těchto zástupců NENÍ kapraďorost?",
    key: "ploník obecný",
    ds: [
      ["sleziník routička", "Sleziník je kapradina, tedy kapraďorost."],
      ["plavuník zploštělý", "Plavuník patří mezi plavuně, tedy mezi kapraďorosty."],
      ["přeslička rolní", "Přeslička je kapraďorost s článkovaným stonkem."],
    ],
    h: [
      "Tři z rostlin jsou kapradina, přeslička a plavuň. Jedna do této skupiny nepatří.",
      "Hledej rostlinu, která nemá pravé kořeny ani cévní svazky a výtrusy nese v tobolce. Kapradina, přeslička i plavuň kořeny mají.",
    ],
    ex: "Ploník obecný je mech, nemá pravé kořeny ani cévní svazky. Ostatní tři rostliny jsou kapraďorosty.",
  },
];

// (b) funkce části těla
const L2_B: Polozka[] = [
  {
    q: "K čemu slouží kapradině podzemní oddenek?",
    key: "ukládá zásoby a přečká v něm zimu",
    ds: [
      ["tvoří v něm semena na jaro", FB_SEMENA],
      ["probíhá v něm fotosyntéza", FB_FOTO_TMA],
      ["nese na sobě výtrusnice", "Výtrusnice má kapradina v kupkách na rubu listů, ne na podzemním stonku."],
    ],
    h: [
      "Oddenek je stonek ukrytý v půdě. Co se s kapradinou děje v zimě nad zemí?",
      "Listy na podzim odumřou, ale na jaře kapradina znovu vyraší ze stejného místa. Odkud na to bere sílu a živiny?",
    ],
    ex: "Podzemní oddenek ukládá zásoby. Kapradina v něm přečká zimu a na jaře z něj vyrostou nové listy.",
  },
  {
    q: "Proč jsou lodyhy přesličky drsné?",
    key: "jsou prosycené křemíkem",
    ds: [
      ["jsou pokryté drobnými trny", "Přeslička trny nemá. Drsnost způsobuje látka uložená v jejím stonku."],
      ["jsou obalené zaschlými výtrusy", "Výtrusy vznikají jen v klasu a vítr je odnese. Drsnost lodyhy nezpůsobují."],
      ["jsou pokryté tvrdými jehlicemi", "Přeslička jehlice nemá. Tenké zelené větévky v přeslenech nejsou jehlice a drsnost nezpůsobují."],
    ],
    h: [
      "Drsnost nezpůsobují trny ani chlupy. Hledej látku uloženou v pletivech stonku.",
      "Přeslička má tu látku hlavně v pokožce stonku. Stejná látka je i v písku a skle, proto se přesličkou dřív drhlo nádobí.",
    ],
    ex: "Lodyhy přesličky mají v pletivech, hlavně v pokožce, hodně křemíku, a proto jsou drsné a tvrdé.",
  },
  {
    q: "Proč dorůstají kapraďorosty výš než mechy?",
    key: "mají cévní svazky, které vedou vodu",
    ds: [
      ["mají semena s velkými zásobami", FB_SEMENA],
      ["mají příchytná vlákna místo kořenů", "Příchytná vlákna mají mechy. Kapraďorosty mají pravé kořeny."],
      ["mají dřevnatý kmen jako stromy", "Naše kapraďorosty jsou byliny bez dřevnatého kmene. Výšku jim umožňuje vodivé pletivo."],
    ],
    h: [
      "Vysoká rostlina musí dostat vodu až do horních listů. Co k tomu potřebuje?",
      "Mech přijímá vodu povrchem, a proto zůstává nízký. Kapraďorost má uvnitř těla vodivé trubičky.",
    ],
    ex: "Kapraďorosty mají cévní svazky, které vedou vodu z kořenů vysoko do listů. Mechy je nemají, proto zůstávají nízké.",
  },
  {
    q: "K čemu kapradině slouží kořeny?",
    key: "drží rostlinu v půdě a sají vodu s minerálními látkami",
    ds: [
      ["tvoří výtrusy a pouštějí je do půdy", "Výtrusy vznikají ve výtrusnicích na rubu listů a roznáší je vítr."],
      ["vyrábějí živiny fotosyntézou", FB_FOTO_TMA],
      ["jen ji drží, vodu přijímá povrchem listů", "Povrchem přijímají vodu mechy. Kapradina ji saje kořeny a vede cévními svazky."],
    ],
    h: [
      "Kořeny kapradiny jsou pravé, ne jen příchytná vlákna jako u mechu. Co tedy dokážou navíc?",
      "Kořeny mají dva úkoly: jeden se týká pevnosti rostliny, druhý toho, co rostlina potřebuje z půdy. Fotosyntéza ani výtrusy to nejsou.",
    ],
    ex: "Pravé kořeny kapradinu drží v půdě a sají vodu s minerálními látkami, kterou pak vedou cévní svazky.",
  },
];

// (c) dvě lodyhy přesličky rolní
const L2_C: Polozka[] = [
  {
    q: "Jaký úkol má jarní hnědá lodyha přesličky rolní?",
    key: "nese klas s výtrusnicemi",
    ds: [
      ["vyrábí živiny fotosyntézou", FB_FOTO_TMA],
      ["ukládá zásoby na zimu", "Zásoby ukládá podzemní oddenek. Jarní lodyha brzy odumře."],
      ["nese květy pro opylení", FB_KVETY],
    ],
    h: [
      "Jarní lodyha je hnědá, bez zeleného barviva. Fotosyntézu tedy dělat nemůže.",
      "Na vrcholu jarní lodyhy je útvar podobný paličce. Co v něm vzniká a k čemu to rostlině slouží?",
    ],
    ex: "Jarní hnědá lodyha nese na vrcholu klas s výtrusnicemi. Nemá zelené barvivo, takže fotosyntézu nedělá.",
  },
  {
    q: "Jaký úkol má letní zelená lodyha přesličky rolní?",
    key: "vyrábí živiny fotosyntézou",
    ds: [
      ["nese klas s výtrusnicemi", "Klas s výtrusnicemi nese jarní hnědá lodyha. Letní lodyha klas nemá."],
      ["nese semena ve šiškách", "Přeslička nemá semena ani šišky. Výtrusy nese jarní hnědá lodyha v klasu."],
      ["chrání jarní lodyhu před mrazem", "Jarní lodyha v létě už nežije. Letní lodyha má jiný úkol, který souvisí se zelenou barvou."],
    ],
    h: [
      "Letní lodyha je zelená a má přesleny větévek. K čemu rostlina potřebuje zelené barvivo?",
      "Výtrusy už rostlina vytvořila na jaře v klasu. V létě si musí zajistit potravu pro sebe i pro podzemní oddenek. Jak ji zelená rostlina vyrábí?",
    ],
    ex: "Letní zelená lodyha má zelené barvivo a vyrábí fotosyntézou živiny pro celou rostlinu.",
  },
  {
    q: "Proč se přeslička rolní dříve používala na drhnutí nádobí?",
    key: "její lodyhy jsou drsné díky křemíku",
    ds: [
      ["její lodyhy obsahují mýdlovou šťávu", "Přeslička mýdlo neobsahuje. Nádobí drhla díky drsnosti lodyh."],
      ["její lodyhy jsou pokryté ostrými trny", "Přeslička trny nemá. Drsná je díky látce uložené ve stonku."],
      ["její výtrusy fungují jako písek", "Výtrusy jsou drobné a vznikají jen v jarním klasu. Na drhnutí se používaly letní lodyhy."],
    ],
    h: [
      "Na drhnutí je potřeba něco drsného. Co dělá přesličku drsnou?",
      "Hledej látku, kterou obsahuje i písek. Přeslička ji má uloženou přímo ve stonku, hlavně v pokožce.",
    ],
    ex: "Lodyhy přesličky obsahují křemík, jsou drsné, a proto se jimi dřív drhlo nádobí.",
  },
  {
    q: "Jaký je rozdíl mezi jarní a letní lodyhou přesličky rolní?",
    key: "jarní je hnědá s klasem, letní je zelená s přesleny větévek",
    ds: [
      ["jarní je zelená s květy, letní je hnědá se semeny", FB_KVETY],
      ["jarní je hnědá se šiškou semen, letní je zelená s jehlicemi", "Přeslička nemá šišky, semena ani jehlice. Jarní lodyha nese klas s výtrusy, letní má tenké zelené větévky."],
      ["jde o dvě různé rostliny, které jen rostou vedle sebe", "Obě lodyhy vyrůstají ze stejného podzemního oddenku jedné rostliny."],
    ],
    h: [
      "Přeslička nekvete ani netvoří semena. Která lodyha nese výtrusnice a která dělá fotosyntézu?",
      "Lodyha bez zeleného barviva se objeví jako první a nese výtrusy. Zelená lodyha přijde později, má kruhy tenkých větévek a živí celou rostlinu.",
    ],
    ex: "Jarní lodyha je hnědá a nese klas s výtrusnicemi, letní je zelená, má přesleny větévek a dělá fotosyntézu.",
  },
];

// (d) prostředí a ochrana
const L2_D: Polozka[] = [
  {
    q: "Kde v české přírodě nejčastěji roste kapraď samec?",
    key: "na stinných vlhkých místech v lese",
    ds: [
      ["na suché slunné louce", "Na suché louce by kapradina strádala. Pro rozmnožování potřebuje vlhko."],
      ["na dně rybníka pod vodou", "Kapraď samec není vodní rostlina, roste na souši."],
      ["na poli mezi obilím", "Pole je suché a slunné a pravidelně se orá. Kapraď tam neroste."],
    ],
    h: [
      "Kapraďorosty potřebují k rozmnožování vodu. Jaké prostředí jim tedy vyhovuje?",
      "Představ si les, kde je pod stromy stín a půda dlouho zůstává mokrá. Právě tam mohou výtrusy vyklíčit.",
    ],
    ex: "Kapraď samec roste hlavně ve vlhkých stinných lesích, protože k rozmnožování potřebuje vlhko.",
  },
  {
    q: "Proč se plavuně v přírodě nesmějí trhat?",
    key: "jsou chráněné a obnovují se velmi pomalu",
    ds: [
      ["jsou jedovaté a pálí na kůži", "Důvodem zákazu není jedovatost. Plavuně jsou vzácné a obnovují se velmi dlouho."],
      ["jsou to vzácné houby", "Plavuně nejsou houby. Jsou to kapraďorosty s kořeny a cévními svazky."],
      ["jsou to obyčejné mechy, kterých je všude dost", "Plavuně nejsou mechy, mají pravé kořeny a cévní svazky. A obyčejné nejsou: jsou vzácné a chráněné."],
    ],
    h: [
      "Zamysli se, jak často plavuně v lese potkáš a jak rychle přibývají nové.",
      "Nová plavuň vyrůstá z výtrusu mnoho let. Rostlina, která je vzácná a obnovuje se tak dlouho, potřebuje ochranu zákonem.",
    ],
    ex: "Plavuně jsou vzácné a obnovují se velmi pomalu, protože nová rostlina z výtrusu roste mnoho let. Proto jsou u nás chráněné a nesmějí se trhat.",
  },
  {
    q: "Proč přeslička rolní obtěžuje zahrádkáře a těžko se hubí?",
    key: "její oddenky sahají hluboko a znovu obrážejí",
    ds: [
      ["její semena přečkají v zemi mnoho let", FB_SEMENA],
      ["její květy opylují včely každé jaro", FB_KVETY],
      ["její kořeny otráví okolní rostliny", "Přeslička okolní rostliny neotravuje. Potíž je v jejích podzemních stoncích."],
    ],
    h: [
      "Když přesličku vytrhneš, nad zemí zmizí. Co ale zůstane pod zemí?",
      "Podzemní stonek přesličky je dlouhý a hluboko uložený. Z každého kousku může vyrůst nová lodyha.",
    ],
    ex: "Přeslička rolní má hluboké podzemní oddenky, ze kterých znovu obráží. Proto se ze zahrady těžko odstraňuje.",
  },
  {
    q: "Kde v přírodě nejčastěji najdeš přesličku lesní?",
    key: "na vlhkých místech ve světlých lesích",
    ds: [
      ["na suchých písčitých stráních", "Na suchých stráních přeslička nevydrží. K rozmnožování potřebuje vlhko."],
      ["na holých skalách nad lesem", "Na holé skále chybí půda a voda. Přeslička potřebuje vlhkou půdu pro kořeny."],
      ["ve vodě uprostřed hlubokého rybníka", "Přeslička lesní není vodní rostlina, roste na vlhké půdě."],
    ],
    h: [
      "Přeslička lesní je kapraďorost. Na jakých místech se kapraďorostům daří nejlépe?",
      "Její jméno napovídá, kde roste. Doplň, jakou půdu tam potřebuje, aby se mohla rozmnožovat. Suché ani holé místo to není.",
    ],
    ex: "Přeslička lesní roste na vlhkých místech v lesích, protože jako kapraďorost potřebuje k rozmnožování vodu.",
  },
];

const BANKA_L2 = stridave(L2_A, L2_B, L2_C, L2_D);

// ══ L3 — přenos ════════════════════════════════════════════════════════════

// (a) poznej rostlinu z popisu — vzhled klame, rozhodují znaky (dva kroky:
//     odmítnout návnadu, pak zařadit podle stavby těla)
const L3_A: Polozka[] = [
  {
    q: "Na mokré louce roste rostlina, která z dálky vypadá jako tráva. Její dutý stonek je ale složený z článků, z uzlin vyrůstají kruhy tenkých zelených větévek a nikdy nekvete. Kam ji zařadíš?",
    key: "mezi přesličky",
    ds: [
      ["mezi trávy", "Tráva má také kolénkaté stéblo, ale kvete a kruhy zelených větévek z uzlin nemá. Rostlina, která nikdy nekvete, trávou být nemůže."],
      ["mezi plavuně", "Plavuně mají plazivý stonek porostlý drobnými lístky, ne článkovaný stonek s kruhy větévek."],
      ["mezi kapradiny", "Kapradiny mají velké zpeřené listy a stonek ukrytý v půdě. Článkovaný stonek s kruhy větévek nemají."],
    ],
    h: [
      "Nejdřív vyřaď skupinu, která kvete. Pak porovnej, jak vypadá stonek.",
      "Kapradiny mají velké zpeřené listy a plavuně drobné nahloučené lístky. Která skupina má stonek z článků s kruhy větévek?",
    ],
    ex: "Tráva kvete, tahle rostlina ne. Článkovaný dutý stonek s kruhy (přesleny) zelených větévek mají přesličky.",
  },
  {
    q: "V jehličnatém lese roste nízká plazivá rostlina, která na první pohled připomíná mech. Stonek má hustě porostlý drobnými lístky, v půdě pravé kořeny a na vztyčených větvičkách klasy výtrusnic. Kam ji zařadíš?",
    key: "mezi plavuně",
    ds: [
      ["mezi mechy", FB_PLAVUN_MECH],
      ["mezi jehličnany", "Drobné lístky nejsou jehlice a klasy nejsou šišky. Nesou výtrusy, ne semena."],
      ["mezi přesličky", "Přesličky mají článkovaný stonek s přesleny větévek, ne plazivý stonek porostlý lístky."],
    ],
    h: [
      "Vzhled mechu klame. Rozhoduje, jestli má rostlina pravé kořeny.",
      "Kapradiny mají velké zpeřené listy, přesličky článkovaný stonek. Která skupina kapraďorostů má drobné lístky a klasy?",
    ],
    ex: "Pravé kořeny vylučují mech. Plazivý stonek s drobnými lístky a klasy výtrusnic mají plavuně.",
  },
  {
    q: "V květináči roste rostlina s velkými zpeřenými listy, které připomínají malou palmu. Nikdy nekvete, mladé listy jsou stočené a na jejich spodní straně jsou hnědé kupky. Kam ji zařadíš?",
    key: "mezi kapradiny",
    ds: [
      ["mezi palmy", "Palmy kvetou a tvoří plody se semeny. Tahle rostlina nikdy nekvete a hnědé kupky jsou výtrusnice."],
      ["mezi plavuně", "Plavuně mají jen drobné lístky a výtrusnice v klasech, ne velké zpeřené listy."],
      ["mezi mechy", FB_MECH],
    ],
    h: [
      "Podobnost s palmou klame. Palmy kvetou. Co tedy asi jsou hnědé kupky na listech?",
      "Plavuně mají drobné lístky, přesličky článkovaný stonek a mechy nemají kořeny ani velké listy. Která skupina zbývá?",
    ],
    ex: "Rostlina nekvete, takže to palma není. Velké zpeřené listy, stočené mladé listy a kupky výtrusnic na rubu jsou znaky kapradin.",
  },
  {
    q: "Rostlina tvoří nízký zelený polštář a na první pohled připomíná drobnou plavuň. Nemá však pravé kořeny ani cévní svazky a výtrusy dozrávají v tobolce na tenkém štětu. Kam ji zařadíš?",
    key: "mezi mechy",
    ds: [
      ["mezi plavuně", "Plavuně jsou také nízké, ale mají pravé kořeny, cévní svazky a výtrusnice v klasech."],
      ["mezi kapradiny", "Kapradiny mají pravé kořeny a cévní svazky a výtrusnice v kupkách na listech."],
      ["mezi přesličky", "Přesličky mají pravé kořeny, cévní svazky a článkovaný stonek."],
    ],
    h: [
      "Vzhled může klamat. Který znak rozhoduje, jestli je rostlina kapraďorost?",
      "Všechny kapraďorosty mají pravé kořeny a cévní svazky. Tobolka na štětu patří jiné skupině výtrusných rostlin.",
    ],
    ex: "Rostlina bez pravých kořenů a cévních svazků s tobolkou na štětu je mech, ne kapraďorost, i když se plavuni podobá.",
  },
];

// (b) rozhodni o neznámém případu
const L3_B: Polozka[] = [
  {
    q: "Botanik našel rostlinu s kořeny a cévními svazky, bez květů, která se rozmnožuje výtrusy. Co z toho plyne?",
    key: "je to kapraďorost",
    ds: [
      ["je to mech", FB_MECH],
      ["je to krytosemenná rostlina", "Krytosemenné rostliny kvetou a tvoří semena v plodech. Tahle rostlina květy nemá."],
      ["je to plavuň, tedy mech", "Plavuň mech není, je to kapraďorost. Mechy nemají kořeny ani cévní svazky, a z popisu navíc nepoznáš, že jde právě o plavuň."],
    ],
    h: [
      "Porovnej tři znaky: kořeny a cévní svazky, květy, výtrusy. Která skupina splňuje všechny?",
      "Mech kořeny nemá a krytosemenná rostlina kvete. Z popisu nepoznáš, která skupina kapraďorostů to přesně je.",
    ],
    ex: "Kořeny, cévní svazky, žádné květy a rozmnožování výtrusy dohromady ukazují na kapraďorost.",
  },
  {
    q: "Rostlina má výtrusy, ale nemá pravé kořeny ani cévní svazky. Může to být kapraďorost?",
    key: "ne, bez kořenů a cévních svazků to bude mech",
    ds: [
      ["ano, každá rostlina s výtrusy je kapraďorost", "Výtrusy mají i mechy. Kapraďorost poznáš podle kořenů a cévních svazků."],
      ["ano, kapraďorosty kořeny ani cévní svazky nemají", "Kapraďorosty pravé kořeny i cévní svazky mají, to je jejich hlavní znak."],
      ["ne, kapraďorosty se výtrusy vůbec nerozmnožují", "Kapraďorosty se výtrusy rozmnožují. Rozhoduje to, že rostlině chybí kořeny."],
    ],
    h: [
      "Výtrusy mají dvě skupiny rostlin. Který znak je od sebe odliší?",
      "Kapraďorost má vždy kořeny a vodivá pletiva. Když chybí, jde o jinou skupinu výtrusných rostlin, která má výtrusy v tobolce.",
    ],
    ex: "Výtrusy mají mechy i kapraďorosty. Kapraďorosty ale mají pravé kořeny a cévní svazky. Rostlina bez nich je mech.",
  },
  {
    q: "Tomáš našel list se spodní stranou posetou řadami hnědých kupek a myslí si, že list napadla nemoc. Jak to je?",
    key: "list je zdravý, kupky jsou výtrusnice kapradiny",
    ds: [
      ["list napadla plíseň, je třeba ho spálit", "Plíseň by tvořila povlak, ne pravidelné kupky. Kupky na rubu listu jsou u kapradin běžné."],
      ["na listu jsou vajíčka hmyzu, brzy se vylíhnou", "Vajíčka hmyzu nejsou v pravidelných řadách na každém listu. Kupky patří k rostlině samotné."],
      ["list je zdravý, kupky jsou zralá semena kapradiny", FB_SEMENA],
    ],
    h: [
      "Pravidelné hnědé kupky na spodní straně listu mají i úplně zdravé rostliny. Které?",
      "Kupky slouží k rozmnožování. Pozor: rostlina, která je má, nikdy netvoří semena. Nemoc ani hmyz by netvořily tak pravidelné řady.",
    ],
    ex: "Hnědé kupky na rubu listu jsou výtrusnice kapradiny. List je zdravý a kapradina semena nemá.",
  },
  {
    q: "Tereza našla v lese rostlinu s článkovaným stonkem a s přesleny tenkých zelených větévek. Petr tvrdí, že je to mladý smrček. Proč nemá pravdu?",
    key: "smrček má jehlice na větvích, tohle je přeslička",
    ds: [
      ["tohle je tráva s kolénkatým stéblem", "Tráva nemá přesleny zelených větévek a kvete. Článkovaný stonek s přesleny větévek má přeslička."],
      ["smrček má článkovaný stonek, tohle je opravdu smrček", "Smrk nemá článkovaný stonek. Jeho větve jsou dřevnaté a nesou jehlice, takže Petr se mýlí."],
      ["smrček má jehlice, tohle je plavuň", "Jehlice smrček opravdu má, ale plavuň nemá článkovaný stonek ani přesleny větévek. Má plazivý stonek s drobnými lístky."],
    ],
    h: [
      "Porovnej větévky: jsou tuhé a dřevnaté, nebo měkké, zelené a složené z článků?",
      "Kruhy zelených větévek z článkovaného stonku vypadají jako jehličí, ale jde o kapraďorost. Který má článkovaný stonek?",
    ],
    ex: "Článkovaný stonek s přesleny zelených větévek má přeslička. Smrček má jehlice na dřevnatých větvích.",
  },
];

// (c) pravěk a zkameněliny — každá položka jiný fakt
const L3_C: Polozka[] = [
  {
    q: "Z čeho asi hlavně vzniklo černé uhlí?",
    key: "z pravěkých stromovitých kapraďorostů",
    ds: [
      ["z těl dinosaurů, kteří vymřeli v pravěku", FB_DINO],
      ["z pravěkých jehličnatých lesů", "Jehličnany se rozšířily později. Černé uhlí vzniklo hlavně z lesů stromovitých plavuní, přesliček a kapradin."],
      ["z ropy, která pod zemí ztvrdla", "Uhlí nevzniká z ropy. Vzniklo z rostlinných těl, která se nahromadila a byla zasypána."],
    ],
    h: [
      "Uhlí vzniklo z rostlin, které tvořily nejstarší rozsáhlé lesy na souši. Jaké rostliny to byly?",
      "Uhlí vzniklo z rostlinných těl. Vyřaď možnosti, které nejsou rostliny nebo které v době nejstarších lesů ještě nerostly.",
    ],
    ex: "Černé uhlí vzniklo hlavně z pravěkých stromovitých plavuní, přesliček a kapradin, které rostly v prvohorách.",
  },
  {
    q: "Dnešní přesličky a plavuně jsou nízké byliny. Co o jejich pravěkých příbuzných prozrazují zkameněliny z nejstarších lesů?",
    key: "někteří dorůstali výšky stromů",
    ds: [
      ["byli drobní jako dnešní mechy", "Zkameněliny ukazují opak: pravěcí příbuzní přesliček a plavuní dorůstali výšky stromů."],
      ["měli velké květy a semena", FB_KVETY],
      ["rostli jen v moři jako řasy", "Zkameněliny z uhelných vrstev ukazují suchozemské lesy, ne mořské řasy."],
    ],
    h: [
      "Ve zkamenělinách se najdou i otisky kmenů. Jakou rostlinu prozrazuje kmen?",
      "Otisk kmene tlustého jako u dnešního stromu nemohla zanechat nízká bylina. Co to říká o velikosti tehdejších rostlin?",
    ],
    ex: "Zkameněliny ukazují, že pravěcí příbuzní plavuní a přesliček tvořili i vysoké stromy. Dnešní zástupci jsou jen nízké byliny.",
  },
  {
    q: "V uhelných vrstvách se najdou otisky kmenů rozdělených na články, z jejichž uzlin vyrůstaly kruhy větví. Kterým dnešním rostlinám byly tyto stromy příbuzné?",
    key: "přesličkám",
    ds: [
      ["smrkům", "Smrk má větve v kruzích, ale jeho kmen na články rozdělený není. Článkovaný kmen s kruhy větví měly pravěké stromovité přesličky."],
      ["trávám", "Tráva má kolénkaté stéblo, ale nemá kruhy větví a stromů nedorůstá. V době uhelných lesů navíc ještě nerostla."],
      ["plavuním", "Plavuně mají stonek porostlý drobnými lístky, bez článků a bez kruhů větví."],
    ],
    h: [
      "Který dnešní kapraďorost má stonek složený z článků a z uzlin kruhy větévek?",
      "Smrk má větve v kruzích, ale jeho kmen článkovaný není. Hledej dnešní skupinu, která má obojí: články i kruhy větévek.",
    ],
    ex: "Článkovaný stonek s přesleny větévek mají dnešní přesličky. Pravěké stromovité přesličky měly stejnou stavbu, jen byly mnohem větší.",
  },
  {
    q: "Proč se ve vrstvách černého uhlí z prvohor nenacházejí zkamenělé květy?",
    key: "kvetoucí rostliny tehdy ještě nerostly",
    ds: [
      ["květy byly příliš drobné, aby zkameněly", "Zkamenět mohou i drobné části, třeba výtrusy. Květy chybí, protože tehdejší rostliny nekvetly."],
      ["kapraďorosty tehdy kvetly, ale jen krátce", FB_KVETY],
      ["kvetoucí rostliny tehdy rostly jen v moři", "Kvetoucí rostliny v té době neexistovaly vůbec, ani v moři, ani na souši."],
    ],
    h: [
      "Zamysli se, čím se rozmnožovaly rostliny, ze kterých uhlí vzniklo.",
      "Seřaď v čase: první lesy na souši, první dinosauři, první květy. Do které doby patří prvohory a co v ní ještě nebylo?",
    ],
    ex: "Uhelné lesy prvohor tvořily rostliny s výtrusy. Kvetoucí rostliny se objevily až mnohem později, proto v uhlí zkamenělé květy nejsou.",
  },
];

// (d) znak → nový důsledek
const L3_D: Polozka[] = [
  {
    q: "Proč kapradiny rostou hlavně na vlhkých místech, přestože mají kořeny?",
    key: "výtrusy klíčí a oplození probíhá jen ve vlhku",
    ds: [
      ["kořeny kapradin sají vodu jen z bahna", "Kořeny kapradin sají vodu z běžné vlhké půdy, bahno nepotřebují."],
      ["na slunci by jim uschly květy", FB_KVETY],
      ["semena kapradin klíčí jen v bahně", FB_SEMENA],
    ],
    h: [
      "Kořeny vodu obstarají. Která část životního cyklu kapradiny ale bez vody neproběhne?",
      "Mysli na to, co se děje s výtrusem, když dopadne na zem, a co potřebuje, aby vznikla nová rostlina. Květy ani semena kapradina nemá.",
    ],
    ex: "Výtrusy klíčí jen ve vlhku a k oplození je potřeba voda. Proto kapradiny rostou hlavně na vlhkých místech.",
  },
  {
    q: "Kapradina roste v tmavém smrkovém lese, kam k zemi dopadá málo světla. Jak jí pomáhají velké rozložené listy?",
    key: "zachytí víc světla pro fotosyntézu",
    ds: [
      ["chrání výtrusnice na rubu před deštěm", "Déšť výtrusnicím neublíží tak, aby kvůli tomu kapradina potřebovala velké listy. Ve stinném lese jí chybí hlavně světlo."],
      ["lákají hmyz, který ji opyluje", FB_KVETY],
      ["zadrží pod sebou teplo na zimu", "Listy kapradiny pracují hlavně od jara do podzimu. Ve stinném lese jí chybí světlo, ne teplo."],
    ],
    h: [
      "Ve stínu je světla málo. K čemu rostlina světlo potřebuje?",
      "Čím větší plochu list má, tím víc toho na něj dopadne. Co z toho rostlina v tmavém lese nejvíc potřebuje?",
    ],
    ex: "Velké rozložené listy zachytí víc světla. Kapradina tak může i ve stinném lese vyrábět fotosyntézou dost živin.",
  },
  {
    q: "Přeslička má ve stoncích hodně křemíku. Jak jí to asi pomáhá?",
    key: "stonek je pevný a zvířata ho nerada žerou",
    ds: [
      ["slouží jí přes zimu jako zásoba živin pro nové lodyhy", "Křemík není živina. Zásoby na zimu ukládá podzemní oddenek."],
      ["vede v ní vodu místo cévních svazků", "Vodu vedou cévní svazky. Křemík je uložený v pletivech a stonek zpevňuje."],
      ["díky němu může kvést i v zimě", FB_KVETY],
    ],
    h: [
      "Vzpomeň si, k čemu se přeslička dřív používala v kuchyni. Jaký je díky křemíku její stonek?",
      "Křemík není živina. Hledej výhodu, kterou rostlině dává tvrdý a drsný stonek, třeba když kolem jde hladové zvíře.",
    ],
    ex: "Křemík stonek přesličky zpevňuje a dělá ho tvrdým a drsným. Takovou rostlinu zvířata nerada spásají.",
  },
  {
    q: "Z výtrusu plavuně vyroste nová rostlina až za mnoho let. Co z toho plyne pro její ochranu?",
    key: "utržená by se obnovovala velmi dlouho",
    ds: [
      ["utržená rychle doroste během jednoho léta", "Plavuně se obnovují velmi pomalu, během jednoho léta nová rostlina nevyroste."],
      ["utrhnout se smí, šíří se přece semeny", FB_SEMENA],
      ["chránit ji netřeba, je to obyčejný mech", "Plavuň není mech, má kořeny a cévní svazky. A chráněná je právě kvůli pomalé obnově."],
    ],
    h: [
      "Když nová rostlina vzniká tak dlouho, co se stane s místem, kde plavuně někdo vytrhal?",
      "Rostlina, která se obnovuje pomalu, snadno z přírody zmizí. Proto ji zákon chrání a trhat se nesmí. Vyřaď možnosti, které počítají s rychlým dorůstáním.",
    ],
    ex: "Plavuně se obnovují velmi pomalu, nová rostlina z výtrusu roste mnoho let. Utržená by chyběla dlouho, proto jsou plavuně chráněné.",
  },
];

const BANKA_L3 = stridave(L3_A, L3_B, L3_C, L3_D);

/** Rotace s náhodným začátkem uvnitř gen(): sada se mezi sezeními liší, šablony se střídají. */
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
export const KAPRADOROSTY: TopicMetadata[] = [
  {
    id: "g6-pri-kapradorosty-6",
    rvpNodeId: "g6-prirodopis-biologie-rostlin-nizsi-rostliny-kapradorosty-kapradiny-preslicky-plavune",
    displayName: "Kapradiny, přesličky a plavuně",
    title: "Kapraďorosty - kapradiny, přesličky, plavuně",
    studentTitle: "Kapradiny, přesličky a plavuně",
    subject: "prirodopis",
    category: "Biologie rostlin",
    // „Nižší rostliny“ je štítek z RVP datasetu (data/rvp_data.json), ne tvrzení
    // obsahu; žákovi se v úlohách nikde neříká, že kapraďorosty jsou nižší rostliny.
    topic: "Nižší rostliny",
    briefDescription: "Poznáš kapradinu, přesličku i plavuň a víš, čím se rozmnožují.",
    keywords: [
      "kapraďorosty", "kapradiny", "přesličky", "plavuně", "výtrusy", "výtrusnice",
      "oddenek", "cévní svazky", "kapraď samec", "přeslička rolní", "plavuň vidlačka", "černé uhlí",
    ],
    goals: [
      "Poznat kapraďorost podle kořenů, cévních svazků a výtrusů bez květů a semen.",
      "Zařadit rostlinu mezi kapradiny, přesličky nebo plavuně podle jejích znaků.",
      "Spojit znak kapraďorostu s jeho funkcí a s významem v přírodě i v pravěku.",
    ],
    boundaries: [
      "Jen čeští zástupci, bez latinských názvů.",
      "Bez pojmu prokel a bez podrobné rodozměny.",
      "Bez přesných letopočtů, doba vzniku uhlí jen jako prvohory.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Kapraďorosty mají kořeny, stonek, listy a cévní svazky, ale nekvetou a nemají semena. Rozmnožují se výtrusy.",
      steps: [
        "Zjisti, jestli má rostlina pravé kořeny a cévní svazky (jinak je to mech).",
        "Podívej se na stonek a listy: velké zpeřené listy, článkovaný stonek s přesleny, nebo drobné nahloučené lístky?",
        "Podle toho ji zařaď mezi kapradiny, přesličky nebo plavuně.",
      ],
      commonMistake: "Myslet si, že kapradina kvete a má semena, nebo považovat plavuň za mech.",
      example: "Článkovaný stonek s přesleny větévek a jarní klas s výtrusy → přeslička.",
    },
  },
];
