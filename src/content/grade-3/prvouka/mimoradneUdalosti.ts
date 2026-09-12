import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Chybná možnost = konkrétní typická chyba + vysvětlení, proč právě ta nesedí. */
interface Chybna {
  o: string;
  why: string;
}

/**
 * Výběrová úloha s kompletní dokumentací (CONTENT_AUTHORING §0):
 * dvě vlastní nápovědy, vysvětlení PROČ a zpětná vazba u KAŽDÉ chybné možnosti.
 */
function q(
  question: string,
  correctAnswer: string,
  chybne: [Chybna, Chybna, Chybna],
  hints: [string, string],
  explanation: string,
): PracticeTask {
  const optionFeedback: Record<string, string> = {};
  for (const c of chybne) optionFeedback[c.o] = c.why;
  return {
    question,
    correctAnswer,
    options: shuffle([correctAnswer, ...chybne.map((c) => c.o)]),
    optionFeedback,
    hints,
    explanation,
  };
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (čísla, definice pojmů, signály)
//   L2 = aplikace:   konkrétní scénář → jedna správná reakce
//   L3 = transfer:   zdůvodnění, dvoukrokové uvažování, miskoncepce a pasti
// Fakt-check dle metodiky HZS ČR: 150 hasiči, 155 zdrav. záchranná služba,
//   158 policie, 112 jednotné evropské číslo. Zkouška sirén = rovný
//   (nepřerušovaný) tón, každou 1. středu v měsíci ve 12 h. Varovný signál
//   „Všeobecná výstraha" = kolísavý tón 140 s.
//
// Opraveno 2026-09-12 (inventura obsahu): doplněna zpětná vazba u všech
// chybných možností a odstupňované nápovědy (velká je podrobnější a delší).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  q(
    "Které tísňové číslo patří hasičům?",
    "150",
    [
      { o: "155", why: "Číslo 155 patří zdravotnické záchranné službě." },
      { o: "158", why: "Číslo 158 patří policii." },
      { o: "112", why: "Číslo 112 je jednotná evropská linka, ne přímá linka hasičů." },
    ],
    [
      "Hasiči hasí oheň a z české trojice mají to nejnižší číslo.",
      "Zapamatuj si celou trojici podle toho, kdo přijede: nejdřív ti, kdo hasí, potom ti, kdo léčí, a nakonec ti, kdo vyšetřují. Čísla jdou ve stejném pořadí od nejmenšího po největší a všechna začínají stejnou číslicí.",
    ],
    "Hasiči mají číslo 150. Celá trojice zní: 150 hasiči (oheň), 155 záchranná služba (nemoc a úraz), 158 policie (zločin). Navíc 112 je jednotná evropská tísňová linka.",
  ),
  q(
    "Které tísňové číslo patří záchranné službě (sanitce)?",
    "155",
    [
      { o: "150", why: "Číslo 150 přivolá hasiče k požáru." },
      { o: "158", why: "Číslo 158 přivolá policii." },
      { o: "112", why: "Číslo 112 je evropská linka, která tě k záchranářům teprve přepojí." },
    ],
    [
      "Sanitka jezdí k lidem, kterým je špatně nebo se zranili.",
      "Z české trojice čísel je to to prostřední. Vyřaď proto nejdřív linku, po které přijedou lidé s hadicemi, a potom linku, po které přijede policie. Zbude ti číslo pro zdravotníky.",
    ],
    "Záchranná služba má číslo 155. Jezdí k lidem, kteří jsou zranění, náhle onemocněli nebo jsou v ohrožení života.",
  ),
  q(
    "Které tísňové číslo patří policii?",
    "158",
    [
      { o: "150", why: "Číslo 150 patří hasičům." },
      { o: "155", why: "Číslo 155 patří záchranné službě." },
      { o: "112", why: "Číslo 112 je evropská linka; policii přivolá až přes operátora." },
    ],
    [
      "Policie řeší krádeže, napadení a dopravní nehody.",
      "Z české trojice je to číslo poslední, tedy největší. Vyřaď proto nejdřív linku k požárům a potom linku ke zraněným lidem. Zbude ti ta, která řeší porušení zákona.",
    ],
    "Policie má číslo 158. Voláme ji při krádeži, napadení nebo dopravní nehodě.",
  ),
  q(
    "Které jediné tísňové číslo funguje ve všech zemích Evropské unie?",
    "112",
    [
      { o: "150", why: "Číslo 150 platí jen v Česku." },
      { o: "155", why: "Číslo 155 je česká linka záchranné služby." },
      { o: "158", why: "Číslo 158 je česká linka policie." },
    ],
    [
      "Zavoláš ho i na dovolené v cizině, a to i bez kreditu.",
      "Tohle číslo se ostatním třem nepodobá — nezačíná stejnou číslicí jako ona. Funguje po celé Evropské unii a operátor tě podle potřeby přepojí k hasičům, k záchranářům i k policii.",
    ],
    "Číslo 112 je jednotná evropská tísňová linka. Funguje ve všech zemích EU, i bez kreditu a bez SIM karty. Operátor tě přepojí tam, kde je pomoc potřeba.",
  ),
  q(
    "Koho přivoláš, když vytočíš 150?",
    "hasiče",
    [
      { o: "záchrannou službu", why: "Záchranná služba má vlastní číslo 155." },
      { o: "policii", why: "Policie má vlastní číslo 158." },
      { o: "opraváře plynu", why: "Poruchu plynu hlásíš na jinou linku, ne na tísňové číslo." },
    ],
    [
      "Tohle číslo voláš, když někde hoří.",
      "Vybav si, kdo přijede velkým červeným vozem s hadicemi a žebříkem. Jejich úkolem není léčit ani vyšetřovat, ale zvládnout oheň a vyprostit lidi z nebezpečí.",
    ],
    "Číslo 150 patří hasičům. Přijedou s vodou a speciálním vybavením k požárům, ale i k nehodám a k vyprošťování lidí.",
  ),
  q(
    "Co znamená pojem „místo srazu“ při požáru?",
    "předem dohodnuté místo venku, kde se všichni sejdou po opuštění budovy",
    [
      { o: "místo, kde je uschovaná voda na hašení", why: "Voda na hašení bývá v hydrantu, s tímto pojmem to nesouvisí." },
      { o: "místo, odkud se vždy volá na tísňovou linku", why: "Volat můžeš odkudkoli z bezpečí, pevné místo pro to není." },
      { o: "místnost, do které se při požáru všichni schovají", why: "Při požáru se nikam neschováváme, budovu naopak opouštíme." },
    ],
    [
      "Slouží k tomu, aby se zjistilo, kdo je venku a kdo možná zůstal uvnitř.",
      "Domlouvá se dopředu, ještě než se cokoli stane, a bývá to nějaký nepřehlédnutelný bod na ulici — roh, strom nebo lavička. Až se tam sejde celá rodina, hned je jasné, jestli někdo chybí.",
    ],
    "Místo srazu je předem dohodnutý bod venku, kam po opuštění hořící budovy přijdou všichni lidé. Hasiči tak okamžitě poznají, jestli někdo uvízl uvnitř.",
  ),
  q(
    "Co je stabilizovaná (zotavovací) poloha?",
    "poloha na boku, do které uložíme člověka v bezvědomí, který sám dýchá",
    [
      { o: "poloha vsedě pro člověka, kterého bolí hlava", why: "Bolest hlavy se polohou na boku neřeší." },
      { o: "poloha na zádech s nohama nahoře pro odpočinek", why: "Na zádech hrozí, že jazyk zapadne a ucpe dýchací cesty." },
      { o: "poloha vestoje s oporou o zeď", why: "Člověk v bezvědomí stát nedokáže." },
    ],
    [
      "Zamysli se nad situací, kdy někdo nereaguje, ale hrudník se mu stále zvedá.",
      "Rozhodující je, aby se postižený nezadusil vlastním jazykem nebo zvratky. Vleže na zádech se to stát může. Existuje proto uložení, při kterém všechno volně odteče ven a dýchací cesty zůstanou průchodné.",
    ],
    "Stabilizovaná poloha je poloha na boku s mírně zakloněnou hlavou. Ukládáme do ní člověka v bezvědomí, který sám dýchá — jazyk ani zvratky mu tak neucpou dýchací cesty.",
  ),
  q(
    "Kdy se koná pravidelná zkouška sirén?",
    "každou první středu v měsíci ve 12 hodin",
    [
      { o: "každé ráno v 7 hodin", why: "Siréna nehouká denně, zkouška je jen jednou za měsíc." },
      { o: "první pondělí v měsíci o půlnoci", why: "V noci by zkouška lidi jen budila, koná se za světla a jiný den." },
      { o: "jen na Nový rok", why: "Zkouška se opakuje pravidelně každý měsíc, ne jednou za rok." },
    ],
    [
      "Koná se jednou za měsíc a vždy v poledne.",
      "Spadá vždy na začátek měsíce, na den uprostřed pracovního týdne, a zazní přesně v okamžiku, kdy jsou obě ručičky hodin nahoře. Podle toho poznáš jak hodinu, tak den v týdnu.",
    ],
    "Zkouška sirén se koná každou první středu v měsíci ve 12:00. Ověřuje se jen to, že sirény fungují — nic se neděje.",
  ),
  q(
    "Jaký zvuk vydává siréna při pravidelné zkoušce?",
    "rovný, nepřerušovaný tón",
    [
      { o: "kolísavý tón, který sílí a slábne", why: "Kolísání znamená skutečné varování, ne zkoušku." },
      { o: "krátká rychlá pípnutí", why: "Takový signál sirény nepoužívají." },
      { o: "zvonění jako budík", why: "Siréna nezvoní, vydává houkavý tón." },
    ],
    [
      "Zkušební signál se vůbec nemění a zní pořád stejně.",
      "Představ si dlouhé jednolité houkání bez jediné změny hlasitosti. Takový zvuk má uklidnit, ne vyděsit — jen se ověřuje, že reproduktory fungují. Skutečné varování naopak střídavě stoupá a klesá.",
    ],
    "Zkouška sirén má rovný, nepřerušovaný tón, který se nemění. Naopak tón, který sílí a slábne, je skutečné varování před nebezpečím.",
  ),
  q(
    "V jaké situaci voláš záchrannou službu na čísle 155?",
    "když je někdo zraněný nebo náhle onemocněl",
    [
      { o: "když v lese vypukl požár", why: "K požáru voláš hasiče." },
      { o: "když někdo ukradl kolo", why: "Krádež hlásíš policii." },
      { o: "když ti doma nejde internet", why: "Porucha internetu není ohrožení života a na tísňovou linku nepatří." },
    ],
    [
      "Tohle číslo vytáčíš kvůli zdraví člověka.",
      "Projdi situace jednu po druhé a u každé se zeptej, jestli je ohrožené něčí tělo a život. Oheň i krádež jsou také vážné, řeší je ale jiné složky. Porucha přístroje na tísňovou linku nepatří vůbec.",
    ],
    "Záchrannou službu (155) voláš, když je někdo zraněný, náhle onemocněl nebo je v ohrožení života. K požáru voláš hasiče (150), ke krádeži policii (158).",
  ),
  q(
    "V jaké situaci voláš hasiče na čísle 150?",
    "když někde hoří nebo hrozí požár",
    [
      { o: "když tě bolí v krku", why: "Bolest v krku řeší lékař, ne tísňová linka." },
      { o: "když ztratíš klíče od domu", why: "Ztracené klíče nejsou mimořádná událost." },
      { o: "když se pohádáš s kamarádem", why: "Hádku s kamarádem tísňová linka neřeší." },
    ],
    [
      "Tohle číslo souvisí s ohněm a s kouřem.",
      "Voláš je i tehdy, když ještě nic nehoří, ale cítíš kouř nebo vidíš jiskry. Nemoc, ztracená věc ani hádka mezi tísňové události nepatří — od těch jsou lékaři, rodiče nebo učitelé.",
    ],
    "Hasiče (150) voláš, když někde hoří nebo požár teprve hrozí — třeba když cítíš kouř. K nemoci nebo úrazu voláš záchrannou službu (155).",
  ),
  q(
    "Které tři informace potřebuje dispečink slyšet při každém tísňovém volání?",
    "kde jsem, co se stalo a kolik je zraněných",
    [
      { o: "jak se jmenuji, kolik mi je let a do jaké chodím školy", why: "Jméno ani škola k výjezdu nestačí, chybí místo i popis události." },
      { o: "kolik je hodin a jaké je počasí", why: "Čas ani počasí o události nic podstatného neřeknou." },
      { o: "jaké mám telefonní číslo a číslo pojišťovny", why: "Pojišťovnu řeší až nemocnice, ne tísňová linka." },
    ],
    [
      "Nejdůležitější je, aby záchranáři věděli, kam mají vyrazit.",
      "Zapamatuj si tři krátká tázací slova v pořadí od nejdůležitějšího: první se ptá na místo, druhé na událost a třetí na počet postižených lidí. Podle nich dispečink pozná, koho a kolik posádek poslat.",
    ],
    "Dispečinku vždy řekni tři věci: KDE jsi (adresa nebo popis místa), CO se stalo a KOLIK je zraněných. Bez místa nemohou záchranáři vyjet.",
  ),
  q(
    "Jaký zvuk vydává siréna, když skutečně varuje před nebezpečím?",
    "kolísavý tón, který střídavě sílí a slábne",
    [
      { o: "rovný tón, který zní pořád stejně", why: "Neměnný zvuk je jen pravidelná měsíční zkouška." },
      { o: "krátké tiché cinknutí", why: "Varovný signál musí být hlasitý a dlouhý, ne tiché cinknutí." },
      { o: "melodie jako z písničky", why: "Sirény žádnou melodii nehrají." },
    ],
    [
      "Varovný signál se mění — houká nahoru a dolů.",
      "Trvá přibližně dvě a půl minuty a je slyšet zdaleka, protože má lidi přimět jít dovnitř. Právě tím se liší od klidného zvuku, který zní pořád stejně a znamená pouhé ověření techniky.",
    ],
    "Skutečné varování (Všeobecná výstraha) je tón, který střídavě sílí a slábne, a trvá asi 140 sekund. Rovný nepřerušovaný tón je jen měsíční zkouška.",
  ),
];

const POOL_L2: PracticeTask[] = [
  q(
    "Hoří byt u sousedů v paneláku a valí se z něj kouř. Které číslo vytočíš?",
    "150",
    [
      { o: "155", why: "Číslo 155 je linka záchranné služby, tady ale jde o oheň." },
      { o: "158", why: "Číslo 158 je linka policie." },
      { o: "156", why: "Číslo 156 patří městské policii, požár ale hasí jiná složka." },
    ],
    [
      "Rozhoduje to, co se právě děje — tady jde o oheň a kouř.",
      "Nejdřív urči, koho k události potřebuješ: někoho, kdo uhasí plameny a dostane lidi z domu ven. Teprve potom vyber jeho číslo. Ze zbytku vyřaď linku pro nemocné, linku pro zločiny i číslo městských strážníků.",
    ],
    "Při požáru voláš hasiče na čísle 150, případně 112, kde tě přepojí. Nejdřív ale odejdi do bezpečí a teprve pak volej.",
  ),
  q(
    "Saháš na dveře a jsou horké, kolem rámu se plazí kouř. Co uděláš?",
    "dveře neotevřu a hledám jiný únikový východ",
    [
      { o: "otevřu je dokořán, ať se místnost vyvětrá", why: "Čerstvý vzduch by oheň rozdmýchal a plameny by vyšlehly ven." },
      { o: "otevřu je jen kousek a podívám se dovnitř", why: "I škvíra pustí dovnitř vzduch a ven horký kouř." },
      { o: "opřu se do nich a proběhnu skrz", why: "Za dveřmi hoří, proběhnutí by znamenalo těžké popáleniny." },
    ],
    [
      "Horko na dveřích prozrazuje, co je za nimi.",
      "Teplá klika a kouř u rámu znamenají, že na druhé straně hoří. Kdybys otevřel, dostane se k ohni vzduch a plameny vyšlehnou směrem k tobě. Hledej proto možnost, která tuhle cestu úplně vyloučí a nabídne jinou.",
    ],
    "Horké dveře nebo kouř kolem rámu znamenají oheň na druhé straně. Neotvírej je — vzduch by plameny rozdmýchal a kouř by tě omámil. Hledej jinou cestu ven.",
  ),
  q(
    "V zakouřené chodbě se snažíš dostat ven. Jak se pohybuješ?",
    "plazím se nízko u podlahy a ústa si zakryju tričkem",
    [
      { o: "běžím vzpřímeně co nejrychleji", why: "Ve výšce hlavy je nejvíc horkého a jedovatého kouře." },
      { o: "vylezu si na skříň, co nejvýš to jde", why: "Nahoře se kouř hromadí úplně nejdřív." },
      { o: "lehnu si a počkám, až kouř zmizí", why: "Kouře bude naopak přibývat, čekání je nebezpečné." },
    ],
    [
      "Kde v zakouřené místnosti zůstává vzduch, který se dá dýchat?",
      "Kouř je horký, a proto stoupá ke stropu. Nejčistší vzduch zůstává těsně nad zemí. Zároveň si chraň nos i ústa vším, co máš po ruce, aby ses nenadýchal jedovatých zplodin. Hledej možnost, která obojí spojuje.",
    ],
    "Kouř stoupá ke stropu, u podlahy zůstává vzduch s kyslíkem. Proto se plaz, zakryj si nos a ústa a co nejrychleji miř k východu.",
  ),
  q(
    "Řeka se vylévá z břehů a ty bydlíš v přízemí. Co uděláš nejdřív?",
    "přesunu se do vyššího patra nebo na jiné bezpečné vyvýšené místo",
    [
      { o: "zůstanu v přízemí a sleduji, jak voda stoupá", why: "Voda může stoupnout rychle a odříznout ti cestu nahoru." },
      { o: "seběhnu do sklepa pro důležité věci", why: "Sklep zaplaví jako první, hrozí uvěznění pod vodou." },
      { o: "půjdu ven k řece se podívat, jak je vysoko", why: "U rozvodněné řeky se břeh podemílá a hrozí pád do proudu." },
    ],
    [
      "Voda stoupá odspodu — kde jí unikneš?",
      "Rozvodněná řeka zaplaví nejdřív sklepy a přízemí a teprve potom stoupá výš. Získat výšku je proto jediná spolehlivá ochrana. Vyber možnost, po které budeš nad hladinou, ne tu, při které zůstaneš v její cestě.",
    ],
    "Při povodni voda rychle stoupá. Přesuň se do vyššího patra nebo na vyvýšené místo. Nikdy nezůstávej v přízemí ani ve sklepě — ty zaplaví nejdřív.",
  ),
  q(
    "Voláš na tísňovou linku. Kterou informaci musíš říct úplně jako první?",
    "kde jsem — adresu nebo popis místa",
    [
      { o: "jak se jmenuji", why: "Jméno operátor potřebuje, ale až později." },
      { o: "kolik mi je let", why: "Věk volajícího o události nic neřekne." },
      { o: "jaké mám doma zvíře", why: "To s tísňovým voláním vůbec nesouvisí." },
    ],
    [
      "Bez této informace se pomoc nemůže vydat na cestu.",
      "Představ si dispečera, který zvedne telefon. I když ví, co se stalo, bez jediného údaje nemůže nikoho poslat. Pomůže mu ulice, číslo domu nebo blízký orientační bod — hřiště, obchod, zastávka.",
    ],
    "Nejdůležitější je říct, KDE jsi. Bez adresy nebo popisu místa nemohou záchranáři přijet. Teprve pak řekni, co se stalo a kolik je zraněných.",
  ),
  q(
    "Kamarád na hřišti náhle omdlel a nereaguje. Které číslo vytočíš?",
    "155",
    [
      { o: "150", why: "Číslo 150 přivolá hasiče, tady ale nehoří." },
      { o: "158", why: "Číslo 158 přivolá policii, nejde ale o trestný čin." },
      { o: "156", why: "Číslo 156 patří městské policii, ne zdravotníkům." },
    ],
    [
      "Jde o zdraví člověka, ne o oheň ani o zločin.",
      "Přijet má vůz se zdravotníky, kteří umí ošetřit člověka v bezvědomí. Z nabídky proto vyřaď obě čísla složek, které řeší oheň a porušení zákona, a také číslo městských strážníků.",
    ],
    "Když je někdo zraněný nebo v bezvědomí, voláš záchrannou službu 155 (případně 112). Řekni, kde jste, co se stalo a že kamarád nereaguje.",
  ),
  q(
    "Vidíš, jak cizí člověk páčí dveře zaparkovaného auta a bere z něj věci. Které číslo vytočíš?",
    "158",
    [
      { o: "150", why: "Číslo 150 přivolá hasiče, žádný požár tu ale není." },
      { o: "155", why: "Číslo 155 přivolá záchrannou službu ke zraněným." },
      { o: "156", why: "Číslo 156 patří městské policii; krádež vyšetřuje státní policie na jiné lince." },
    ],
    [
      "Děje se něco protiprávního — někdo bere cizí majetek.",
      "Nejde o oheň ani o zraněného člověka, ale o porušení zákona. Hledej tedy přímou linku složky, která vyšetřuje krádeže a zadržuje pachatele. Sám do ničeho nezasahuj, jen si dobře zapamatuj, jak zloděj vypadal.",
    ],
    "Krádež nebo jiný zločin hlásíš policii na čísle 158. Sám nezasahuj — zapamatuj si vzhled pachatele a řekni to policii.",
  ),
  q(
    "Siréna houká tónem, který sílí a slábne, sílí a slábne. Co to znamená a co uděláš?",
    "je to varování — jdu dovnitř a zapnu rádio nebo televizi",
    [
      { o: "je to jen zkouška — nemusím dělat nic", why: "Zkouška má neměnný rovný zvuk, tenhle se ale mění." },
      { o: "je to signál k přestávce ve škole", why: "Sirény se ke zvonění ve škole nepoužívají." },
      { o: "je to hlášení o počasí — jdu ven se podívat", why: "Při varování se jde dovnitř, rozhodně ne ven." },
    ],
    [
      "Zvuk, který stoupá a klesá, není obyčejné ověření techniky.",
      "Po varovném signálu vždy následují další pokyny, které se vysílají ve zprávách. Nejdřív se ale musíš dostat pod střechu a zavřít okna. Hledej proto možnost, která spojuje přesun do bezpečí s hledáním informací.",
    ],
    "Tón, který sílí a slábne, je skutečné varování. Okamžitě jdi do nejbližší budovy, zavři okna a dveře a pusť si zprávy, kde se dozvíš, co se děje a co dělat.",
  ),
  q(
    "Utíkáš z hořícího domu ven. Na co nesmíš zapomenout?",
    "jít na dohodnuté místo srazu a nevracet se dovnitř",
    [
      { o: "vzít si s sebou všechny hračky", why: "Sbírání věcí zdržuje a kouř se šíří velmi rychle." },
      { o: "vrátit se pro nabíječku k telefonu", why: "Návrat do hořícího domu je životu nebezpečný." },
      { o: "schovat se pod postel a počkat tam", why: "Pod postelí tě kouř najde a hasiči hůř." },
    ],
    [
      "Věci se dají nahradit — na čem záleží nejvíc?",
      "Hasiči po příjezdu okamžitě potřebují vědět, jestli je někdo ještě uvnitř. To zjistí jen tehdy, když se všichni sejdou na jednom předem domluveném bodě. Návrat do domu je přitom největší chyba, jakou lze udělat.",
    ],
    "Z hořícího domu odejdi rychle a nic neber. Sejdi se s ostatními na dohodnutém místě srazu, aby hasiči věděli, že jsi venku. Nikdy se nevracej dovnitř.",
  ),
  q(
    "Jsi s rodiči na dovolené v Itálii a stane se vážná nehoda. Které číslo zavoláš?",
    "112",
    [
      { o: "150", why: "Číslo 150 platí v Česku, v Itálii nefunguje." },
      { o: "155", why: "Číslo 155 je česká linka záchranné služby." },
      { o: "158", why: "Číslo 158 je česká linka policie." },
    ],
    [
      "Česká čísla v cizině fungovat nemusí.",
      "Existuje jediné číslo platné ve všech zemích Evropské unie. Funguje i bez kreditu a operátor na něm rozumí i jinému jazyku než místnímu. Vyřaď proto všechna čísla, která platí jen u nás doma.",
    ],
    "V zahraničí voláš evropskou tísňovou linku 112. Funguje po celé EU a operátor tě přepojí tam, kde je pomoc potřeba.",
  ),
  q(
    "Ulicí se po povodni valí voda. Kamarád navrhuje, ať ji přebrodíte. Co uděláš?",
    "do vody nevstoupím a najdu vyšší suchou cestu",
    [
      { o: "vejdu do vody, vypadá jen po kotníky", why: "Hloubku nelze odhadnout, pod hladinou může být díra." },
      { o: "půjdu první, ať to kamarád vidí", why: "Nebezpečí se tím nezmenší, jen ohrozíš sám sebe." },
      { o: "přeskákám po viditelných kamenech", why: "Mokré kameny kloužou a proud snadno strhne." },
    ],
    [
      "Zaplavená ulice vypadá klidně, ale proud bývá silný.",
      "Pod kalnou hladinou nevidíš, jestli tam není otevřený kanál nebo díra. I voda po kolena dokáže dítě porazit. Hledej proto možnost, která se zaplavenému místu úplně vyhne, ne tu, která ho jen opatrně zkouší.",
    ],
    "Do zaplavené ulice nikdy nevstupuj. I mělká rychlá voda může dítě strhnout a pod hladinou bývají otevřené kanály a předměty. Hledej vyšší suchou cestu.",
  ),
  q(
    "Doma v noci ucítíš kouř. Co uděláš jako první?",
    "vzbudím ostatní a rychle jdeme společně ven",
    [
      { o: "dokoukám pohádku a pak se podívám", why: "Kouř se šíří rychle, každá vteřina rozhoduje." },
      { o: "schovám se pod deku a počkám do rána", why: "Deka před kouřem nechrání a spící člověk se snadno otráví." },
      { o: "otevřu okno a jdu zase spát", why: "Otevřené okno ohni přivede vzduch a nebezpečí zůstane." },
    ],
    [
      "Kouř v noci je vážné nebezpečí a čas hraje hlavní roli.",
      "Spící člověk kouř neucítí a zplodiny ho velmi rychle omámí. Proto je první úkol probudit každého v bytě a společně opustit dům. Telefonovat budeš až venku, kde je čistý vzduch.",
    ],
    "Kouř v noci znamená možný požár. Hned vzbuď ostatní, společně odejděte ven a teprve venku volejte 150. Kouř spícího člověka omámí velmi rychle.",
  ),
  q(
    "Po povodni máš žízeň a z kohoutku teče voda. Co uděláš?",
    "napiju se jen balené vody nebo počkám na svolení dospělých",
    [
      { o: "napiju se z kohoutku, voda přece teče", why: "Po povodni bývá znečištěná i voda z kohoutku." },
      { o: "naberu si vodu z kaluže na dvoře", why: "Kaluž po povodni obsahuje bahno i splašky." },
      { o: "napiju se ze studny za domem", why: "Studnu povodeň zaplaví a voda v ní je pitná až po rozboru." },
    ],
    [
      "Povodňová voda se dostane i do potrubí a do studní.",
      "Do zatopených míst se rozlije obsah kanalizace i chemikálie ze skladů a odtud proniknou do zdrojů. Bezpečná je proto jen voda z uzavřené lahve nebo ta, kterou dospělí nechali prověřit. Hledej možnost, která na jistotu počká.",
    ],
    "Po povodni může být voda z kohoutku i ze studny znečištěná. Pij jen balenou vodu nebo takovou, o které dospělí vědí, že je nezávadná.",
  ),
];

const POOL_L3: PracticeTask[] = [
  q(
    "Zaplavená ulice vypadá klidně a voda sahá jen po kotníky. Proč je i tak nebezpečné do ní vejít?",
    "proud může strhnout i dítě a pod vodou nevidíš otevřené kanály a předměty",
    [
      { o: "voda bývá studená, takže bys mohl prochladnout", why: "Prochladnutí je nepříjemné, ale hrozí něco mnohem horšího — proud a kanály skryté pod hladinou." },
      { o: "na mokré dlažbě by ti mohly uklouznout nohy", why: "Uklouznout se dá i na chodníku. Tady navíc nevidíš, kam šlapeš, a tlačí do tebe proud." },
      { o: "nebezpečné je to teprve tehdy, když voda sahá nad pás", why: "I voda po kolena dokáže dítě porazit a odnést." },
    ],
    [
      "Přemýšlej o dvou skrytých nebezpečích najednou: o síle vody a o tom, co není vidět.",
      "Klidná hladina neznamená, že je pod ní bezpečno. Povodeň odnese poklopy z kanálů a nanese kusy plotů i větve. Zároveň dokáže i mělká rychlá voda podrazit člověku nohy. Hledej možnost, která pojmenuje obojí zároveň.",
    ],
    "I mělká, ale rychlá voda dokáže dítě porazit a odnést. Navíc pod kalnou hladinou nevidíš otevřené kanály, díry nebo popadané kabely. Proto do zaplavené ulice nikdy nevstupuj.",
  ),
  q(
    "Proč se po povodni nesmí pít voda z kohoutku ani ze studny v zatopené oblasti?",
    "povodeň smíchá vodu s kanalizací a chemikáliemi, takže může být jedovatá",
    [
      { o: "voda je po povodni jen příliš studená", why: "Teplota není problém, jde o obsah škodlivin." },
      { o: "voda by měla nezvyklou chuť, jinak nevadí", why: "Bakterie ani jedy nemusí být vůbec cítit." },
      { o: "je to zbytečné varování, voda je v pořádku", why: "Po povodni bývá voda skutečně nebezpečná." },
    ],
    [
      "Kam všude se povodňová voda dostane, než doteče až k tobě?",
      "Zaplaví silnice, sklepy, hnojiště i skládky a všechno, co tam leží, si vezme s sebou. Potom pronikne netěsnostmi do potrubí a do studní. Zamysli se, co se do takové směsi cestou přidá a proč se z ní nedá pít.",
    ],
    "Povodeň zaplaví kanalizaci, sklepy i skládky a špinavá voda pronikne do potrubí i do studní. Bakterie a chemikálie v ní mohou způsobit vážnou nemoc, proto ji nepij.",
  ),
  q(
    "Najdeš člověka v bezvědomí a vidíš, že klidně a pravidelně dýchá. Co je správné udělat?",
    "uložit ho do stabilizované polohy na bok a přivolat pomoc",
    [
      { o: "nechat ho ležet na zádech a odejít pryč", why: "Na zádech hrozí zapadnutí jazyka a odejít v žádném případě nesmíš." },
      { o: "posadit ho a dát mu napít vody", why: "Člověk v bezvědomí polykat nedokáže, hrozí vdechnutí." },
      { o: "zkusit ho probudit tím, že s ním zatřeseš", why: "Třesením se člověk neprobere a můžeš mu ublížit." },
    ],
    [
      "Když člověk sám dýchá, jde hlavně o to, aby se nezadusil.",
      "V bezvědomí ochabnou svaly a jazyk může zapadnout do krku. Když ale tělo leží na boku, všechno volně odteče ven a dýchací cesty zůstanou průchodné. Nezapomeň, že vedle správného uložení je vždy potřeba i telefonát.",
    ],
    "Člověka v bezvědomí, který sám dýchá, ulož na bok do stabilizované polohy a přivolej pomoc (155). Na boku mu jazyk ani zvratky neucpou dýchací cesty.",
  ),
  q(
    "Člověk je v bezvědomí a NEdýchá. Je správné dát ho do stabilizované polohy na bok?",
    "ne — hned volám 155 a řídím se pokyny záchranáře",
    [
      { o: "ano, poloha na boku pomůže vždy", why: "Na boku se ukládá jen ten, kdo sám dýchá." },
      { o: "ano, ale nejdřív mu dám napít", why: "Člověku v bezvědomí se nic nepodává." },
      { o: "ne, počkám, jestli se sám neprobere", why: "Čekání je nejhorší volba, každá vteřina rozhoduje." },
    ],
    [
      "Stabilizovaná poloha pomáhá jen tomu, kdo sám dýchá.",
      "Když člověk nedýchá, jde o přímé ohrožení života a uložení na bok mu nepomůže. V takové chvíli potřebuješ okamžitě odborníka na telefonu, který ti krok za krokem poradí, co dělat, než přijede sanitka.",
    ],
    "Stabilizovaná poloha se používá jen u člověka, který sám dýchá. Když nedýchá, okamžitě volej 155 nebo 112 a přesně dělej to, co ti záchranář řekne.",
  ),
  q(
    "Při požáru někdo navrhne otevřít všechna okna, ať kouř odejde. Proč je to špatný nápad?",
    "čerstvý vzduch oheň rozdmýchá a plameny zesílí",
    [
      { o: "kouř je těžší než vzduch, takže by oknem stejně neodešel", why: "Kouř je naopak horký a lehký a stoupá vzhůru. Rozhoduje ale přívod vzduchu k ohni." },
      { o: "sklo by od horka prasklo a mohlo by tě pořezat", why: "Prasklé sklo je až následek. Hlavní riziko je, že otevřeným oknem se k ohni dostane vzduch." },
      { o: "otevřít okno je při požáru vždy správné", why: "Naopak: okna i dveře do hořící místnosti se zavírají." },
    ],
    [
      "Co oheň potřebuje, aby hořel víc? Zamysli se nad prouděním.",
      "Plamen potřebuje ke svému hoření tři věci: palivo, teplo a přísun kyslíku. Když jednu z nich odebereš, oheň slábne, a když ji naopak přidáš, sílí. Otevřené okno přidává právě tu třetí z nich.",
    ],
    "Oheň ke svému hoření potřebuje vzduch. Otevřením oken bys mu ho dodal a plameny by zesílily. Při požáru okna i dveře do hořící místnosti naopak zavírej.",
  ),
  q(
    "V kuchyni začne hořet hrnec a zároveň babička upadla a nemůže vstát. Které volání přivolá pomoc nejrychleji?",
    "112 — jedním voláním přivolám pomoc k požáru i ke zraněné babičce",
    [
      { o: "zavolám jen 150 a o babičce se nezmíním", why: "Babička by zůstala bez ošetření." },
      { o: "zavolám jen 155 a hořící hrnec nechám být", why: "Oheň by se mezitím rozšířil po celé kuchyni." },
      { o: "nevolám nikam, zvládnu obojí sám", why: "Dítě takovou situaci samo zvládnout nemůže." },
    ],
    [
      "Děje se víc věcí najednou — potřebuješ hasiče i zdravotníky.",
      "Kdybys volal jen jednu linku, druhá polovina problému by zůstala neřešená. Existuje ale číslo, u kterého operátor vyslechne celý popis a pošle všechny složky, které jsou potřeba. Právě to je v takové situaci nejrychlejší.",
    ],
    "Když se děje víc věcí najednou (oheň i zraněný člověk), zavolej 112. Operátor pošle hasiče i záchrannou službu podle toho, co mu popíšeš. Nejdřív ale odejdi do bezpečí.",
  ),
  q(
    "Venku zazní kolísavý tón sirény. Jaké je správné pořadí toho, co uděláš?",
    "jdu do budovy, zavřu okna a dveře, zapnu rádio nebo televizi",
    [
      { o: "zůstanu venku a natáčím, co se děje", why: "Venku jsi v ohrožení a natáčení nic neřeší." },
      { o: "otevřu okna dokořán a vykláním se ven", why: "Otevřenými okny by se dovnitř dostaly škodliviny." },
      { o: "utíkám co nejdál od domu do polí", why: "V poli nejsi chráněný a žádné pokyny se nedozvíš." },
    ],
    [
      "Nejdřív se dostaň do bezpečí, teprve potom hledej informace.",
      "Postup má tři kroky a jejich pořadí není náhodné. Nejdřív střecha nad hlavou, potom uzavření všech otvorů, aby dovnitř nic nepronikalo, a nakonec zdroj zpráv. Hledej možnost, která má právě takové pořadí.",
    ],
    "Při varovném (kolísavém) tónu jdi nejdřív do nejbližší budovy, zavři okna a dveře a teprve pak si pusť zprávy. Tam se dozvíš, co se stalo a co dělat dál.",
  ),
  q(
    "Právě jsi utekl z hořícího bytu, ale uvědomíš si, že tam zůstal tvůj telefon. Vrátíš se pro něj?",
    "ne — věci se dají nahradit a kouř omámí během chvilky; řeknu to hasičům",
    [
      { o: "ano, telefon je drahý, rychle si pro něj doběhnu", why: "Žádná věc nestojí za riziko udušení." },
      { o: "ano, ale nejdřív se nadechnu a zadržím dech", why: "Se zadrženým dechem nevydržíš ani cestu tam." },
      { o: "pošlu pro něj mladšího sourozence", why: "Do hořícího domu nesmíš poslat vůbec nikoho." },
    ],
    [
      "Co je cennější — věc, nebo tvoje bezpečí?",
      "V zakouřeném bytě stačí několik nádechů a člověk ztratí vědomí. Než bys stihl přeběhnout pokoj a dostat se zpátky, může být pozdě. To, co uvnitř zůstalo, ale můžeš popsat těm, kdo mají ochranné dýchací přístroje.",
    ],
    "Do hořící budovy se nikdy nevracej, ani pro cenné věci. Kouř omámí člověka během několika nádechů. Věci se nahradí — hasičům jen řekni, co a kde zůstalo.",
  ),
  q(
    "Voláš 155, už jsi řekl, co se stalo, ale operátor se pořád ptá. Kdy hovor ukončíš?",
    "až když to řekne operátor — nikdy nezavěšuji první",
    [
      { o: "hned, jak řeknu, co se stalo", why: "Dispečer potřebuje ještě doplňující údaje." },
      { o: "když mě otázky začnou unavovat", why: "Otázky nejsou zbytečné, pomáhají posádce se připravit." },
      { o: "jakmile uslyším v dálce sanitku", why: "Siréna v dálce nemusí mířit zrovna k tobě." },
    ],
    [
      "Rozhoduje ten, kdo na druhé straně řídí celou pomoc.",
      "Dispečer se doptává na podrobnosti, aby poslal správnou posádku a aby ti mezitím poradil, co dělat. Kdybys zavěsil dřív, ztratil by možnost se doptat i poradit. Hledej proto možnost, ve které o konci hovoru rozhoduje on.",
    ],
    "Při tísňovém volání nezavěšuj první. Dispečer se ptá, aby přesně věděl, koho a s čím poslat, a může ti radit, co dělat. Hovor ukonči, teprve až to řekne on.",
  ),
  q(
    "Jaký je rozdíl mezi rovným a kolísavým tónem sirény?",
    "rovný tón je jen zkouška, kolísavý tón je skutečné varování",
    [
      { o: "rovný tón je varování, kolísavý tón je zkouška", why: "Je to přesně naopak, dvojice jsou prohozené." },
      { o: "oba tóny znamenají to samé", why: "Liší se, právě proto se používají dva různé signály." },
      { o: "rovný tón hlásí počasí, kolísavý začátek školy", why: "Sirény počasí ani začátek vyučování nehlásí." },
    ],
    [
      "Spoj si dvě věci dohromady: který zvuk znamená klid a který nebezpečí.",
      "Neměnné houkání se opakuje každý měsíc v poledne a nic se při něm neděje. Zvuk, který stoupá a klesá, naopak zazní jen tehdy, když opravdu hrozí nebezpečí. Hledej možnost, ve které jsou obě dvojice přiřazené správně.",
    ],
    "Rovný nepřerušovaný tón je pravidelná zkouška — nic se neděje. Kolísavý tón, který sílí a slábne, je skutečné varování: jdi dovnitř a pusť si zprávy.",
  ),
  q(
    "Blíží se povodeň a máš ještě čas, než voda dorazí. Co je nejrozumnější udělat?",
    "s dospělými připravit potřebné věci a přejít na vyvýšené místo, dokud je čas",
    [
      { o: "počkat, až voda opravdu přijde, a teprve pak něco řešit", why: "Na poslední chvíli bývá cesta už zaplavená." },
      { o: "jít se dívat k řece, jak rychle stoupá", why: "Podemletý břeh se může utrhnout i pod tebou." },
      { o: "nedělat nic, ono to určitě přejde samo", why: "Spoléhat při povodni na náhodu nelze." },
    ],
    [
      "Čas navíc se vyplatí využít, ne promarnit.",
      "Když voda teprve stoupá, dá se v klidu sbalit léky, doklady i teplé oblečení a odejít po suché cestě. Až přijde velká voda, budou silnice neprůjezdné a odchod nebezpečný. Rozhodni, která možnost náskok využívá.",
    ],
    "Když je čas, využij ho: s dospělými připrav nejnutnější věci a doklady a včas se přesuň na vyvýšené bezpečné místo. Čekat na poslední chvíli je nebezpečné, protože voda stoupá rychle.",
  ),
  q(
    "Proč se při požáru plazíš u země místo toho, abys běžel vzpřímeně?",
    "horký a jedovatý kouř stoupá ke stropu, u podlahy zůstává vzduch s kyslíkem",
    [
      { o: "u podlahy se běží rychleji než vestoje", why: "Plazení je naopak pomalejší, jde tu o dýchání." },
      { o: "aby tě přes kouř nebylo vidět", why: "Před nikým se schovávat nepotřebuješ." },
      { o: "protože vestoje bys uklouzl", why: "Kluzká podlaha není důvod, proč se plazit." },
    ],
    [
      "Kam se v místnosti hromadí kouř — nahoru, nebo dolů?",
      "Horký plyn je lehčí než okolí, a proto stoupá vzhůru a plní místnost odshora dolů. U země proto ještě chvíli zůstane vrstva, ve které se dá dýchat a ve které zároveň lépe uvidíš cestu ven.",
    ],
    "Horký kouř plný jedovatých látek stoupá ke stropu. U podlahy proto zůstává chladnější vzduch s kyslíkem. Když se plazíš, dýcháš čistší vzduch a lépe vidíš cestu ven.",
  ),
  q(
    "Proč je lepší volat přímo 150, 155 nebo 158, když víš, kdo má přijet, a 112 nechat na složité případy a na zahraničí?",
    "Protože přímá linka tě spojí rovnou s tou složkou a nikdo hovor nemusí přepojovat",
    [
      { o: "Protože 112 v Česku vůbec nefunguje", why: "Funguje, jen hovor vyřizuje operátor, který ho předá dál." },
      { o: "Protože přímá čísla jsou zdarma a 112 se platí", why: "Tísňová volání jsou zdarma úplně všechna." },
      { o: "Protože 112 smějí volat jen dospělí", why: "Volat může kdokoli, kdo potřebuje pomoc, i dítě." },
    ],
    [
      "Zamysli se, kolik kroků musí hovor projít, než dorazí ke správné posádce.",
      "Na jednotné lince sedí operátor, který nejdřív zjistí, co se děje, a teprve potom hovor předá dál. Když už víš, koho potřebuješ, ušetříš tenhle mezikrok. V cizině nebo při složité události je naopak výhodou, že rozhodne za tebe.",
    ],
    "Přímé linky 150, 155 a 158 tě spojí rovnou s hasiči, záchrannou službou nebo policií, takže odpadá přepojování. Linka 112 je nenahraditelná v zahraničí a tehdy, když se děje víc věcí najednou nebo nevíš, koho volat.",
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const MIMORADNEUDALOSTI: TopicMetadata[] = [
  {
    id: "g3-prvouka-clovek-a-jeho-zdravi-bezpecnost-a-prvni-pomoc-mimoradne-udalosti-pozar-povoden-chovani-pri-ohrozeni",
    rvpNodeId: "g3-prvouka-clovek-a-jeho-zdravi-bezpecnost-a-prvni-pomoc-mimoradne-udalosti-pozar-povoden-chovani-pri-ohrozeni",
    title: "Mimořádné události — požár, povodeň",
    studentTitle: "Bezpečnost a záchrana",
    subject: "prvouka",
    category: "Člověk a jeho zdraví",
    topic: "Bezpečnost a první pomoc",
    briefDescription: "Víš, jak se zachovat při požáru, povodni nebo jiném ohrožení.",
    keywords: [
      "požár",
      "povodeň",
      "hasiči",
      "150",
      "155",
      "158",
      "112",
      "siréna",
      "evakuace",
      "místo srazu",
      "stabilizovaná poloha",
      "tísňová čísla",
      "záchranná služba",
      "nebezpečí",
      "mimořádná událost",
    ],
    goals: [
      "Znát tísňová čísla 150, 155, 158 a 112 a vědět, kdy každé z nich použít.",
      "Vědět, co dělat při požáru — nekoukat, plazit se, místo srazu.",
      "Vědět, co dělat při povodni — přesun do výšky, nešlapat do vody.",
      "Vědět, co říct záchranářům při tísňovém volání.",
      "Rozumět signálům sirény a znát stabilizovanou polohu.",
    ],
    boundaries: [
      "Bez děsivých nebo traumatizujících popisů katastrof.",
      "Základní pravidla chování při mimořádných událostech, přiměřená věku 8–9 let.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 8,
    generator: gen,
    helpTemplate: {
      hint: "150 = hasiči, 155 = záchranná služba, 158 = policie, 112 = evropská tísňová linka. Při požáru: plaz se, neotvírej teplé dveře, jdi na místo srazu. Při povodni: jdi do výšky, nestoupej do vody.",
      steps: [
        "Tísňová čísla: 150 hasiči, 155 záchranka, 158 policie, 112 vše v Evropě.",
        "Požár: neotvírej teplé dveře, plaz se nízko, odejdi na místo srazu.",
        "Povodeň: přejdi do vyšších pater, nestoupej do zaplavené ulice, nepij zatopenou vodu.",
        "Volání záchranářů: řekni KDE jsi, CO se stalo, KOLIK je zraněných.",
        "Siréna — rovný tón: zkouška (1. středa v měsíci v 12 h). Kolísavý tón: skutečné varování.",
      ],
      commonMistake: "Záměna 150 (hasiči) a 155 (záchranná služba). Hasiči hasí oheň, záchranná služba jezdí k zraněným a nemocným.",
      example: "Hoří v kuchyni → volej 150 (hasiči). Soused omdlel → volej 155 (záchranná služba). Jsi v zahraničí a stane se nehoda → volej 112.",
    },
  },
];
