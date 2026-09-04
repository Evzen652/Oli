import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (čísla, definice, pravidla)
//   L2 = aplikace:   konkrétní scénář → jedna správná reakce
//   L3 = transfer:   hraniční/kombinované scénáře (2 kroky uvažování)
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Jaké je telefonní číslo hasičů?",
    correctAnswer: "150",
    options: ["150", "155", "158", "112"],
    hints: [
      "Hasiči hasí požáry. Jejich číslo začíná na 15.",
      "Popros doma rodiče, ať ti ukážou, kde máte napsaná důležitá telefonní čísla — třeba na lednici nebo v mobilu.",
    ],
    explanation: "Hasiči mají číslo 150. Pamatuj si: 150 = hasiči (oheň), 155 = záchranná služba (nemoc), 158 = policie (zločin), 112 = evropská tísňová linka pro všechno.",
  },
  {
    question: "Jaké je telefonní číslo záchranné služby?",
    correctAnswer: "155",
    options: ["150", "155", "158", "112"],
    hints: [
      "Záchranná služba pomáhá nemocným a zraněným lidem.",
      "Zkus se doma zeptat, jestli máte důležitá telefonní čísla napsaná někde na viditelném místě.",
    ],
    explanation: "Záchranná služba má číslo 155. Jezdí k lidem, kteří jsou nemocní, zranění nebo potřebují rychlou lékařskou pomoc.",
  },
  {
    question: "Jaké je telefonní číslo policie?",
    correctAnswer: "158",
    options: ["150", "155", "158", "112"],
    hints: [
      "Policie řeší zločiny a chrání pořádek.",
      "Nejlepší způsob, jak si důležitá čísla zapamatovat, je zeptat se doma a pak si je párkrát zopakovat nahlas.",
    ],
    explanation: "Policie má číslo 158. Voláme ji, když jsme svědky trestného činu nebo potřebujeme pomoc s bezpečností.",
  },
  {
    question: "Co je číslo 112?",
    correctAnswer: "Tísňová linka platná v celé Evropě",
    options: ["Číslo určené jen pro děti", "Číslo hasičů v Praze", "Informační linka pro turisty", "Tísňová linka platná v celé Evropě"],
    hints: [
      "Tohle číslo si můžeš vzít i na dovolenou za hranice.",
      "Lze volat i ze zahraničí nebo bez kreditu na mobilu.",
    ],
    explanation: "Číslo 112 je evropská tísňová linka. Funguje ve všech zemích EU, i bez kreditu a SIM karty. Operátor tě přepojí na hasiče, záchranku nebo policii podle toho, co potřebuješ.",
  },
  {
    question: "Kolik stojí volání na tísňová čísla 150, 155, 158 nebo 112?",
    correctAnswer: "Nic — volání je vždy zdarma",
    options: ["Nic — volání je vždy zdarma", "Podle tarifu mobilu", "Jen když máš kredit", "Musíš mít speciální aplikaci"],
    hints: [
      "Tísňová čísla fungují i bez kreditu na mobilu.",
      "Na tísňová čísla se dá volat i bez SIM karty.",
    ],
    explanation: "Volání na tísňová čísla je vždy zdarma a funguje i bez kreditu nebo SIM karty — peníze nesmí být překážkou při volání o pomoc.",
  },
  {
    question: "Co znamená slovo šikana?",
    correctAnswer: "Úmyslné a opakované ubližování druhému",
    options: ["Jednorázová hádka mezi kamarády", "Úmyslné a opakované ubližování druhému", "Hlasitý smích ve třídě", "Soutěž mezi spolužáky"],
    hints: [
      "Klíčová slova jsou „úmyslně“ a „opakovaně“.",
      "Šikana se neděje jen jednou — trvá a opakuje se.",
    ],
    explanation: "Šikana je úmyslné a opakované ubližování druhému — fyzické (bití, strkání) nebo psychické (posměch, vyloučení ze skupiny).",
  },
  {
    question: "Je jednorázový žert mezi kamarády totéž co šikana?",
    correctAnswer: "Ne — šikaně chybí opakování a záměr ublížit",
    options: ["Ano, je to úplně stejné", "Ano, pokud se někdo zasměje", "Ne — šikaně chybí opakování a záměr ublížit", "Ne, protože šikana neexistuje"],
    hints: [
      "Šikana se pozná podle opakování a úmyslu ublížit.",
      "Jednorázový žert bez záměru ublížit šikana není.",
    ],
    explanation: "Šikana vyžaduje opakování a úmyslné ubližování. Jednorázový žert nebo škádlení bez zlého úmyslu šikanou není.",
  },
  {
    question: "Kdo je pro dítě důvěryhodný dospělý?",
    correctAnswer: "Rodič, učitel nebo jiný blízký dospělý",
    options: ["Kdokoliv starší osmnácti let", "Jen rodič a nikdo další", "Cizí člověk s hodnou tváří", "Rodič, učitel nebo jiný blízký dospělý"],
    hints: [
      "Důvěryhodný = takový, komu věříme a koho dobře známe.",
      "Přemýšlej o dospělých, které dítě dobře zná ze svého každodenního života — doma, ve škole, na kroužku.",
    ],
    explanation: "Důvěryhodný dospělý je člověk, kterého dobře znáš a kterému věříš — rodič, prarodič, učitel, trenér nebo soused. Nemusí to být jen rodič.",
  },
  {
    question: "Co NESMÍŠ sdílet s cizími lidmi na internetu?",
    correctAnswer: "Svou adresu a telefonní číslo",
    options: [
      "Svou adresu a telefonní číslo",
      "Oblíbenou barvu",
      "Název svého oblíbeného seriálu",
      "Obrázek krajiny",
    ],
    hints: [
      "Adresa a telefon jsou osobní údaje — s jejich pomocí tě cizí člověk může najít.",
      "Jméno, adresa, škola, telefon = nikdy cizím na internetu.",
    ],
    explanation: "Adresa a telefonní číslo jsou osobní údaje, díky nimž tě cizí člověk může fyzicky najít. Proto tyto údaje nikomu cizímu na internetu neříkáme.",
  },
  {
    question: "Smíš poslat svou fotku cizímu člověku, kterého znáš jen z internetu?",
    correctAnswer: "Ne — nikdy neposílám fotky cizím lidem",
    options: ["Ano, pokud si píšeme dlouho", "Ne — nikdy neposílám fotky cizím lidem", "Ano, když o to hezky poprosí", "Ano, ale jen jednu fotku"],
    hints: [
      "Fotky jsou osobní — cizí člověk by je mohl zneužít.",
      "Cizí člověk na internetu může být ve skutečnosti úplně jiný, než tvrdí.",
    ],
    explanation: "Fotky nikomu cizímu na internetu neposílej, ani když si dlouho píšete. Pokud tě o to někdo požádá, řekni to rodiči, učiteli nebo jinému důvěryhodnému dospělému.",
  },
  {
    question: "Proč je dobré znát tísňová čísla 150, 155, 158 a 112?",
    correctAnswer: "Abych mohl rychle zavolat pomoc v nebezpečné situaci",
    options: ["Jen pro případ školního testu", "Abych mohl volat zdarma", "Abych mohl rychle zavolat pomoc v nebezpečné situaci", "Jsou povinná pro všechny od 6 let"],
    hints: [
      "Tísňová čísla fungují i bez kreditu na mobilu.",
      "V nebezpečí je každá sekunda důležitá.",
    ],
    explanation: "Znát tísňová čísla může jednoho dne zachránit život — tvůj nebo někoho blízkého. Volání na 150, 155, 158 nebo 112 je zdarma a funguje i bez kreditu nebo SIM karty.",
  },
  {
    question: "Jaké číslo funguje i v zahraničí a bez kreditu na mobilu?",
    correctAnswer: "112",
    options: ["150", "155", "158", "112"],
    hints: [
      "Toto číslo funguje ve všech zemích EU.",
      "Je to evropská tísňová linka.",
    ],
    explanation: "Číslo 112 funguje ve všech zemích EU, i bez kreditu a SIM karty. Operátor tě přepojí na hasiče, záchranku nebo policii.",
  },
  {
    question: "Jaké může být šikana?",
    correctAnswer: "Fyzická i psychická (posměch, vyloučení)",
    options: ["Fyzická i psychická (posměch, vyloučení)", "Jen fyzická (bití, strkání)", "Jen psychická (posměch)", "Jen slovní"],
    hints: [
      "Ubližovat se dá tělem, ale i slovy nebo vyloučením z party.",
      "Šikana není jen bití — patří sem i posměch nebo vyloučení ze skupiny.",
    ],
    explanation: "Šikana může být fyzická (bití, strkání) i psychická (posměch, pomlouvání, vyloučení ze skupiny). Obojí je stejně vážné.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Hoří odpadkový koš na dvoře vašeho domu. Koho zavoláš?",
    correctAnswer: "Hasiče — 150",
    options: ["Záchrannou službu — 155", "Hasiče — 150", "Policii — 158", "Nikoho, počkám, až to samo zhasne"],
    hints: [
      "Jde o požár — kdo hasí oheň?",
      "150 = hasiči.",
    ],
    explanation: "Při požáru voláme hasiče na číslo 150. Nikdy nečekáme, až oheň zhasne sám — může se rychle rozšířit.",
  },
  {
    question: "Spolužák spadl na hřišti a nemůže vstát, hodně ho bolí noha. Koho zavoláš?",
    correctAnswer: "Záchrannou službu — 155",
    options: ["Hasiče — 150", "Policii — 158", "Záchrannou službu — 155", "Rodiče spolužáka, ale nikoho jiného"],
    hints: [
      "Jde o zdravotní příhodu — potřebujeme lékaře.",
      "Záchranná služba má číslo 155.",
    ],
    explanation: "Záchranná služba (155) jezdí k nemocným a zraněným lidem. Zavolat jen rodičům nestačí — potřebná je rychlá odborná pomoc.",
  },
  {
    question: "Vidíš cizího muže, jak se snaží vypáčit dveře zaparkovaného auta. Co uděláš?",
    correctAnswer: "Zavolám policii — 158",
    options: ["Zavolám hasiče — 150", "Půjdu se na to podívat blíž", "Nebudu si toho všímat", "Zavolám policii — 158"],
    hints: [
      "Vypáčení auta je trestná činnost — kdo ji řeší?",
      "Policie chrání pořádek a řeší zločiny.",
    ],
    explanation: "Policie má číslo 158. Voláme ji, když jsme svědky trestného činu. K místu se nepřibližujeme, aby nám nehrozilo nebezpečí.",
  },
  {
    question: "Neznámý muž na ulici ti nabízí, že tě sveze domů autem. Co uděláš?",
    correctAnswer: "Odmítnu a rychle odejdu k jiným lidem nebo do obchodu",
    options: [
      "Odmítnu a rychle odejdu k jiným lidem nebo do obchodu",
      "Nastoupím, protože vypadá hodně",
      "Počkám, co chce říct",
      "Dám mu své telefonní číslo",
    ],
    hints: [
      "Do auta cizího člověka nikdy nenastupujeme.",
      "Bezpečí je důležitější než zdvořilost — smíš říct ne.",
    ],
    explanation: "Do auta cizího člověka nikdy nenastupuj, i kdyby byl velmi milý. Bezpečný dospělý nepotřebuje pomoc od dítěte. Rychle odejdi tam, kde jsou další lidé.",
  },
  {
    question: "Cizí žena tě žádá, abys jí ukázal cestu na opuštěné parkoviště na kraji města. Co uděláš?",
    correctAnswer: "Odmítnu — s neznámou osobou na odlehlé místo nechodím",
    options: ["Půjdu, protože to potřebuje", "Odmítnu — s neznámou osobou na odlehlé místo nechodím", "Půjdu, ale budu se jí bát", "Zavolám kamaráda, ať jde taky"],
    hints: [
      "Přemýšlej, proč by tě neznámý dospělý chtěl vzít právě tam, kde není nikdo jiný, kdo by ti mohl pomoct.",
      "Dospělí si cestu mohou zjistit sami, nepotřebují doprovod od dítěte.",
    ],
    explanation: "S neznámou osobou na odlehlé nebo opuštěné místo nikdy nechoď. Dospělý, který potřebuje opravdovou pomoc, se zeptá jiného dospělého, ne dítěte.",
  },
  {
    question: "Ztratil ses v obchodním domě. Koho požádáš o pomoc?",
    correctAnswer: "Prodavače nebo ochranku v obchodě",
    options: ["Prvního cizího muže na ulici", "Nikoho — počkám sám", "Prodavače nebo ochranku v obchodě", "Náhodné dítě stejného věku"],
    hints: [
      "V obchodě jsou dospělí, kteří tam pracují — znají prostředí a mohou zavolat rodiče.",
      "Zaměstnanci jsou bezpečnější volba než náhodný cizinec.",
    ],
    explanation: "Prodavač nebo bezpečnostní pracovník (ochranka) jsou důvěryhodní dospělí — pracují na veřejném místě a mohou pomoci zavolat rodiče nebo ohlásit ztrátu dítěte přes rozhlas.",
  },
  {
    question: "Ztratil ses na náměstí ve městě. Koho požádáš o pomoc?",
    correctAnswer: "Policistu nebo strážníka v uniformě",
    options: ["Kohokoliv, kdo vypadá hodně", "Jen mládež na skateboardu", "Nikoho cizího", "Policistu nebo strážníka v uniformě"],
    hints: [
      "Uniforma označuje osobu, která má povinnost pomáhat.",
      "Policista má služební číslo a musí se prokázat.",
    ],
    explanation: "Policistu nebo strážníka v uniformě poznáš snadno a jsou povinni ti pomoci. Mohou kontaktovat tvoje rodiče nebo tě bezpečně dopravit na místo.",
  },
  {
    question: "Neznámý člověk na internetu se tě ptá, kde přesně bydlíš. Co uděláš?",
    correctAnswer: "Neřeknu mu to a řeknu to rodiči nebo učiteli",
    options: [
      "Neřeknu mu to a řeknu to rodiči nebo učiteli",
      "Řeknu mu jen název ulice",
      "Řeknu mu to, když je milý",
      "Zeptám se ho, proč to chce vědět, a pak mu to řeknu",
    ],
    hints: [
      "Adresa je osobní údaj, kterým tě může cizí člověk najít.",
      "Vždy to řekni dospělému, i kdyby ten člověk působil mile.",
    ],
    explanation: "Adresu nikdy cizímu na internetu neříkáme, ani po částech. Pokud se na ni někdo ptá, řekni to rodiči nebo učiteli.",
  },
  {
    question: "Cizí člověk na internetu tě žádá, abys mu poslal svou fotku. Co uděláš?",
    correctAnswer: "Neposílám — řeknu to rodiči nebo učiteli",
    options: ["Pošlu, když vypadá přátelsky", "Neposílám — řeknu to rodiči nebo učiteli", "Pošlu anonymní fotku", "Pošlu fotku kamaráda místo sebe"],
    hints: [
      "Fotky jsou osobní — cizí člověk by je mohl zneužít.",
      "Pokud tě někdo na internetu žádá o fotky, vždy to řekni dospělému.",
    ],
    explanation: "Fotky nikomu cizímu na internetu neposílej. Cizí člověk může být ve skutečnosti úplně jiný, než tvrdí. Pokud tě o to někdo požádá, ihned to řekni dospělému.",
  },
  {
    question: "Spolužák ti každý den o přestávce schválně strčí a nadává ti před ostatními. Co to je?",
    correctAnswer: "Šikana",
    options: ["Jednorázový žert", "Přátelské škádlení", "Šikana", "Normální chování mezi kamarády"],
    hints: [
      "Klíčové slovo: opakuje se to každý den.",
      "Jak se nazývá situace, kdy někdo někomu úmyslně a opakovaně ubližuje? Znáš ten pojem z jiných lekcí.",
    ],
    explanation: "Šikana je úmyslné a opakované ubližování — fyzické (strkání) nebo psychické (nadávky). Opakování a záměr ublížit ji odlišují od žertu.",
  },
  {
    question: "Vidíš, že silnější spolužák už po několikáté bere mladšímu svačinu a nadává mu. Co bys měl udělat?",
    correctAnswer: "Říct to učiteli nebo jinému dospělému",
    options: ["Nic, není to moje věc", "Počkat, jestli přestane sám", "Vzít mladšímu svačinu taky", "Říct to učiteli nebo jinému dospělému"],
    hints: [
      "Opakované ubližování je šikana, kterou má řešit dospělý.",
      "Přihlížet mlčky šikaně situaci neřeší.",
    ],
    explanation: "Když vidíš opakované ubližování, řekni to učiteli nebo jinému dospělému. Sám to řešit nemusíš a přihlížení bez zásahu situaci nezlepší.",
  },
  {
    question: "Jsi na výletě mimo město a stane se něco nebezpečného, ale nejsi si jistý, jaké přesné číslo zavolat. Co uděláš?",
    correctAnswer: "Zavolám 112 — funguje vždy a přepojí mě dál",
    options: [
      "Zavolám 112 — funguje vždy a přepojí mě dál",
      "Nezavolám nikomu, protože si nejsem jistý",
      "Počkám, až najdu správné číslo",
      "Zavolám kamarádovi, ať to vyřeší",
    ],
    hints: [
      "112 je univerzální číslo pro všechny druhy nebezpečí.",
      "Operátor tě podle potřeby přepojí na hasiče, záchranku nebo policii.",
    ],
    explanation: "Když si nejsi jistý, jaké přesné číslo použít, zavolej 112. Toto univerzální číslo funguje vždy a operátor tě přepojí na správnou pomoc.",
  },
  {
    question: "Neznámý muž ti nabízí bonbony a zve tě k sobě domů podívat se na štěňata. Co uděláš?",
    correctAnswer: "Odmítnu a odejdu pryč, případně to řeknu dospělému",
    options: ["Půjdu se jen podívat na štěňata", "Odmítnu a odejdu pryč, případně to řeknu dospělému", "Vezmu si bonbony, ale dovnitř nepůjdu", "Zeptám se, jestli tam budou i jiné děti"],
    hints: [
      "Nabídky od cizích lidí, i lákavé, je bezpečnější odmítnout.",
      "K cizímu člověku domů nikdy nechodíme.",
    ],
    explanation: "Nabídky sladkostí nebo pozvání domů od cizího člověka vždy odmítni a odejdi pryč. Řekni to rodiči nebo jinému dospělému, i kdyby to vypadalo neškodně.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Dva spolužáci si spolu hrají na honěnou, smějí se a občas do sebe žertem strčí. Je to šikana?",
    correctAnswer: "Ne — chybí opakované a úmyslné ubližování",
    options: ["Ano, protože do sebe strkají", "Ano, protože jsou dva proti jednomu", "Ne — chybí opakované a úmyslné ubližování", "Ne, protože šikana může být jen mezi dospělými"],
    hints: [
      "Nejdřív rozpoznej, o jakou situaci jde — je to hra, nebo ubližování?",
      "Šikana potřebuje opakování a záměr ublížit, obyčejná hra ne.",
    ],
    explanation: "Jde o hru, ne o šikanu — chybí opakované a úmyslné ubližování, obě děti se smějí a hrají dobrovolně. Šikanu je potřeba odlišit od běžného škádlení nebo hry.",
  },
  {
    question: "Kamarád ti řekne, že mu spolužák bere svačinu úplně každý den a vyhrožuje mu, že mu ublíží, když to řekne. Co to je a co má udělat jako první?",
    correctAnswer: "Je to šikana — měl by to hned říct dospělému",
    options: ["Je to jen legrace — nemusí nic dělat", "Je to šikana, ale musí to vyřešit sám", "Není to šikana, protože jde jen o svačinu", "Je to šikana — měl by to hned říct dospělému"],
    hints: [
      "Nejdřív rozpoznej: opakuje se to a je tam vyhrožování — to je šikana.",
      "Pak zvol správnou reakci: sám ji řešit nemá, potřebuje dospělého.",
    ],
    explanation: "Opakované braní svačiny s vyhrožováním je šikana. Nejdůležitější první krok je říct to co nejdřív důvěryhodnému dospělému — sám by to řešit neměl.",
  },
  {
    question: "Jsi na výletě v lese, kamarád spadl ze stromu a hodně krvácí, jste daleko od města a nevíš přesně, jaké číslo použít. Co uděláš?",
    correctAnswer: "Zavolám 112 — funguje všude a přepojí mě na správnou pomoc",
    options: [
      "Zavolám 112 — funguje všude a přepojí mě na správnou pomoc",
      "Nezavolám nikomu, protože nevím přesné číslo",
      "Počkám, až se dostaneme blíž k městu",
      "Zavolám 158, protože je to nejjednodušší číslo",
    ],
    hints: [
      "Nejdřív si uvědom, že jde o zdravotní nebezpečí, ale nevíš přesné číslo.",
      "Když si nejsi jistý, zvol univerzální tísňovou linku.",
    ],
    explanation: "Když nevíš přesné číslo nebo si nejsi jistý, zavolej 112 — funguje všude, i mimo město, a operátor tě propojí se záchrannou službou.",
  },
  {
    question: "Kamarád ti pošle odkaz na neznámou hru a tvrdí, že je úplně bezpečná, protože ji dostal od svého bratra. Co uděláš jako první?",
    correctAnswer: "Nejdřív se zeptám dospělého, jestli je stránka bezpečná",
    options: ["Hned kliknu, protože to poslal kamarád", "Nejdřív se zeptám dospělého, jestli je stránka bezpečná", "Pošlu odkaz dál celé třídě", "Kliknu, ale nezadám žádné heslo"],
    hints: [
      "Nejdřív si uvědom, že i důvěryhodný kamarád může nevědomky poslat nebezpečný odkaz.",
      "Pak zvol správnou reakci: ověření u dospělého, ne kliknutí.",
    ],
    explanation: "I odkaz od kamaráda může být nebezpečný, protože ani on nemusí vědět, odkud pochází. Vždy se nejdřív zeptej dospělého, než na neznámý odkaz klikneš.",
  },
  {
    question: "Neznámá paní čeká před školou a řekne ti, že ji poslala maminka, protože měla nehodu, a máš jít s ní. Co uděláš?",
    correctAnswer: "Neodejdu s ní — ověřím to u učitele nebo zavolám rodičům",
    options: ["Půjdu s ní, protože zná jméno mojí maminky", "Půjdu s ní, ale budu se bát", "Neodejdu s ní — ověřím to u učitele nebo zavolám rodičům", "Řeknu jí, kde bydlím, ať mě tam odveze"],
    hints: [
      "Nejdřív si uvědom, že tvrzení cizího člověka nemusí být pravdivé, i když zní naléhavě.",
      "Pak zvol bezpečnou reakci: ověřit u známého dospělého, ne jít s cizí osobou.",
    ],
    explanation: "I naléhavé nebo věrohodně znějící tvrzení cizí osoby je potřeba ověřit u učitele nebo rodičů, než s ní kamkoliv odejdeš. Cizí lidé mohou znát jméno rodiče a přesto lhát.",
  },
  {
    question: "Na internetu ti píše někdo, kdo tvrdí, že je stejně starý jako ty, a chce vědět, do jaké školy chodíš a kde bydlíš, abyste se mohli kamarádit.",
    correctAnswer: "Neřeknu mu to a řeknu to dospělému",
    options: ["Řeknu mu jen školu, ne adresu", "Řeknu mu to, protože je to jen dítě jako já", "Zeptám se ho nejdřív na jeho adresu", "Neřeknu mu to a řeknu to dospělému"],
    hints: [
      "Nejdřív si uvědom, že na internetu nikdy nevíš jistě, kdo s tebou opravdu píše.",
      "Pak zvol pravidlo: osobní údaje nesdílet a situaci nahlásit dospělému.",
    ],
    explanation: "Na internetu si nikdy nemůžeš být jistý, kdo s tebou opravdu píše, i kdyby tvrdil, že je dítě. Školu ani adresu neříkej a řekni to dospělému.",
  },
  {
    question: "Dva spolužáci se jednou pohádali o pravítko a jeden druhého strčil. Od té doby se to už nestalo. Je to šikana?",
    correctAnswer: "Ne — chybí opakování, šlo o jednorázovou hádku",
    options: [
      "Ne — chybí opakování, šlo o jednorázovou hádku",
      "Ano, protože došlo ke strkání",
      "Ano, protože to bylo o přestávce",
      "Ne, protože šlo jen o kluky",
    ],
    hints: [
      "Nejdřív zjisti, jestli se ubližování opakuje, nebo šlo o jednu příhodu.",
      "Šikana potřebuje opakování — jednorázová hádka to nesplňuje.",
    ],
    explanation: "Jednorázová hádka se strčením není šikana, protože chybí opakování a dlouhodobý záměr ublížit. Je potřeba odlišit ojedinělý konflikt od skutečné šikany.",
  },
  {
    question: "Ztratil ses ve městě a jediný dospělý poblíž je muž bez uniformy, který nabízí, že tě odvede na policii. Co je nejbezpečnější?",
    correctAnswer: "Radši dojdu sám do nejbližšího obchodu nebo za policistou v uniformě",
    options: ["Půjdu s ním, protože nabízí pomoc", "Radši dojdu sám do nejbližšího obchodu nebo za policistou v uniformě", "Počkám na místě a nikoho neoslovím", "Půjdu s ním, ale budu si dávat pozor"],
    hints: [
      "Nejdřív si uvědom, že nabídka pomoci od cizího člověka bez uniformy není jistota bezpečí.",
      "Pak zvol bezpečnější variantu: obchod nebo osoba v uniformě.",
    ],
    explanation: "I dobře míněná nabídka od cizího člověka bez uniformy je méně bezpečná než dojít sám do obchodu nebo za policistou či strážníkem v uniformě, kterého snadno poznáš.",
  },
  {
    question: "V lese hoří ohniště a zároveň je jeden z kamarádů popálený na ruce. Nevíš, koho zavolat dřív.",
    correctAnswer: "Zavolám 112 — operátor zajistí hasiče i záchranku najednou",
    options: ["Zavolám nejdřív 150, pak zkusím 155", "Počkám, až přijde dospělý", "Zavolám 112 — operátor zajistí hasiče i záchranku najednou", "Zavolám kamarádovi domů"],
    hints: [
      "Nejdřív si uvědom, že jde o dvě různé situace najednou — požár i zranění.",
      "Univerzální číslo dokáže zajistit obě pomoci současně.",
    ],
    explanation: "Když je potřeba víc druhů pomoci najednou (hasiči i záchranná služba), zavolej 112 — operátor zajistí obě služby, aniž bys musel volat dvakrát.",
  },
  {
    question: "Spolužák ti ukáže modřiny a řekne, že mu je dělá stejný kluk už potřetí a že mu vyhrožuje, že to bude horší, když to řekne. Co má udělat jako první?",
    correctAnswer: "Říct to co nejdřív důvěryhodnému dospělému",
    options: ["Počkat, jestli přestane sám", "Vyřešit si to s tím klukem sám", "Nic neříkat, aby nebylo hůř", "Říct to co nejdřív důvěryhodnému dospělému"],
    hints: [
      "Nejdřív rozpoznej, že opakované ubližování s výhrůžkami je šikana.",
      "Pak zvol správnou první reakci — pomoc dospělého, ne mlčení.",
    ],
    explanation: "Opakované ubližování a výhrůžky jsou šikana. Přestože se šikanista vyhrožováním snaží spolužáka umlčet, nejdůležitější je co nejdřív říct to dospělému.",
  },
  {
    question: "Kamarádka ti pošle zprávu, že jí neznámý člověk na internetu nabízí schůzku osobně a ptá se, jestli má jít. Co jí poradíš?",
    correctAnswer: "Ať to řekne rodičům a s cizím člověkem se osobně nesetkává",
    options: [
      "Ať to řekne rodičům a s cizím člověkem se osobně nesetkává",
      "Ať jde, ale vezme si kamarádku s sebou",
      "Ať se nejdřív zeptá, jak ten člověk vypadá",
      "Ať mu pošle svou adresu, aby věděl, kam přijít",
    ],
    hints: [
      "Nejdřív si uvědom, že setkání naživo s někým, koho znáš jen z internetu, je vždy rizikové — i pro kamarádku.",
      "Kdo by měl o takové situaci vědět, aby mohl pomoct posoudit riziko a rozhodnout?",
    ],
    explanation: "S cizím člověkem, kterého znáš jen z internetu, se osobně nesetkáváme, ani ve dvou. Správný postup je říct to rodičům, kteří pomohou situaci vyřešit.",
  },
  {
    question: "Starší spolužák tě požádá, abys mu jako srandu pomohl schovat penál mladšímu klukovi. Když se to stane už podruhé a ten mladší kvůli tomu brečí, co to je a co uděláš?",
    correctAnswer: "Je to šikana — odmítnu pomáhat a řeknu to dospělému",
    options: ["Je to jen legrace, tak mu pomůžu", "Je to šikana — odmítnu pomáhat a řeknu to dospělému", "Je to šikana, ale nemám se do toho plést", "Není to šikana, protože jde jen o penál"],
    hints: [
      "Nejdřív rozpoznej: opakování a slzy mladšího ukazují, že nejde o neškodnou legraci.",
      "Pak zvol správnou reakci: nepomáhat a nahlásit to dospělému.",
    ],
    explanation: "Opakované schovávání věcí, které mladšímu spolužákovi ubližuje, je šikana, i když to starší spolužák nazývá srandou. Správně je odmítnout se na tom podílet a říct to dospělému.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const KOMUNIKACEBEZPECNOST: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-komunikace-jednani-s-neznamymi-lidmi-bezpecnost",
    rvpNodeId: "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-komunikace-jednani-s-neznamymi-lidmi-bezpecnost",
    title: "Komunikace a bezpečnost",
    studentTitle: "Bezpečně mezi lidmi",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití a komunikace",
    briefDescription: "Víš, jak se chovat s neznámými lidmi a jak zůstat v bezpečí.",
    keywords: [
      "bezpečnost",
      "neznámý člověk",
      "tísňová čísla",
      "hasiči",
      "záchranná služba",
      "policie",
      "šikana",
      "internet",
      "osobní údaje",
      "důvěryhodný dospělý",
    ],
    goals: [
      "Znát tísňová čísla 150, 155, 158 a 112.",
      "Vědět, co nedělat s neznámým člověkem.",
      "Vědět, na koho se obrátit, když se ztratím.",
      "Chránit své osobní údaje na internetu.",
      "Rozumět pojmu šikana a vědět, jak ji řešit.",
    ],
    boundaries: [
      "Bez podrobností o kriminalitě nebo děsivých scénářů.",
      "Základní pravidla bezpečnosti přiměřená věku 8–9 let.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 8,
    generator: gen,
    helpTemplate: {
      hint: "150 = hasiči, 155 = záchranná služba, 158 = policie, 112 = tísňová linka. S cizím člověkem nenastupuj do auta a nechodím na odlehlá místa.",
      steps: [
        "Zapamatuj si čísla: 150 hasiči, 155 záchranka, 158 policie, 112 vše.",
        "S cizím člověkem: nenastupuj do auta, nechoď na odlehlé místo.",
        "Ztratíš-li se: jdi k prodavači nebo policistovi v uniformě.",
        "Na internetu: nesdílej adresu, telefon ani fotky.",
        "Šikana: řekni to dospělému — rodiči nebo učiteli.",
      ],
      commonMistake: "Zaměňování čísel 150 a 155 — 150 jsou hasiči (oheň), 155 je záchranná služba (zdraví).",
      example: "Hoří sousedovo auto → voláš 150 (hasiči). Kamarád je zraněný → voláš 155 (záchranná služba).",
    },
  },
];
