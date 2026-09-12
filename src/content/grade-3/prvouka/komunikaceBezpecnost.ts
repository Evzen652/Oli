import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná fakta (čísla, definice, pravidla)
//   L2 = aplikace:   konkrétní scénář → jedna správná reakce
//   L3 = transfer:   hraniční/kombinované scénáře (2 kroky uvažování:
//                    nejdřív rozpoznat situaci, pak zvolit reakci)
// Každá úloha: dvě vlastní nápovědy, zpětná vazba u každé chybné možnosti
// a vysvětlení PROČ (CONTENT_AUTHORING §0).
// ─────────────────────────────────────────────────────────

type Chyba = [string, string];

function t(
  question: string,
  correct: string,
  chyby: [Chyba, Chyba, Chyba],
  h0: string,
  h1: string,
  explanation: string,
): PracticeTask {
  const d = chyby.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  return choice(question, correct, d, { hints: [h0, h1], explanation });
}

const POOL_L1: PracticeTask[] = [
  t(
    "Jaké je telefonní číslo hasičů?",
    "150",
    [
      ["155", "155 je záchranná služba — ta jezdí k nemocným a zraněným, ne k požáru."],
      ["158", "158 je policie — ta řeší zločiny a pořádek."],
      ["112", "112 je evropská tísňová linka pro všechno. Hasiči mají i vlastní číslo."],
    ],
    "Hasiči hasí požáry. Jejich číslo začíná na 15.",
    "Tři česká tísňová čísla začínají na 15 a liší se poslední číslicí. V řadě „oheň – zdraví – zločin“ jsou hasiči první, takže mají nejnižší poslední číslici.",
    "Hasiči mají číslo 150. Pomůcka: 150 = oheň, 155 = zdraví (záchranka), 158 = zločin (policie). Číslo 112 je evropská linka pro všechny druhy nouze.",
  ),
  t(
    "Jaké je telefonní číslo záchranné služby?",
    "155",
    [
      ["150", "150 jsou hasiči — ti hasí požáry."],
      ["158", "158 je policie — ta řeší zločiny."],
      ["112", "112 je evropská linka pro všechno. Záchranka má i své vlastní číslo."],
    ],
    "Záchranná služba pomáhá nemocným a zraněným lidem.",
    "V řadě „oheň – zdraví – zločin“ je zdraví uprostřed. Hledej číslo na 15, jehož poslední číslice leží mezi čísly hasičů a policie.",
    "Záchranná služba má číslo 155. Jezdí k lidem, kteří jsou nemocní nebo zranění a potřebují rychlou lékařskou pomoc.",
  ),
  t(
    "Jaké je telefonní číslo policie?",
    "158",
    [
      ["150", "150 jsou hasiči — ti hasí požáry, ne zločiny."],
      ["155", "155 je záchranná služba — ta ošetřuje zraněné."],
      ["112", "112 je evropská linka pro všechno. Policie má i své vlastní číslo."],
    ],
    "Policie řeší zločiny a chrání pořádek.",
    "V řadě „oheň – zdraví – zločin“ je zločin poslední, takže policie má z čísel začínajících na 15 tu nejvyšší poslední číslici.",
    "Policie má číslo 158. Voláme ji, když vidíme trestný čin nebo potřebujeme pomoc s bezpečností.",
  ),
  t(
    "Co je číslo 112?",
    "Tísňová linka platná v celé Evropě",
    [
      ["Číslo určené jen pro děti", "Linka 112 slouží všem, dětem i dospělým."],
      ["Číslo hasičů v Praze", "Hasiči mají po celé republice číslo 150. Linka 112 platí všude a pro všechno."],
      ["Informační linka pro turisty", "112 není informační linka — volá se na ni jen v nouzi."],
    ],
    "Tohle číslo si můžeš vzít s sebou i na dovolenou za hranice.",
    "Na 112 zavoláš ve Francii, v Itálii i u nás a operátor tě spojí s hasiči, záchrankou nebo policií. Kde všude tedy platí?",
    "Číslo 112 je evropská tísňová linka. Funguje ve všech zemích Evropské unie, i bez kreditu. Operátor tě přepojí na hasiče, záchranku nebo policii podle toho, co se děje.",
  ),
  t(
    "Kolik stojí volání na tísňová čísla 150, 155, 158 nebo 112?",
    "Nic — volání je vždy zdarma",
    [
      ["Podle tarifu mobilu", "Tísňová volání se do tarifu nepočítají, nikdo za ně neplatí."],
      ["Jen když máš kredit, jinak to nejde", "Tísňová čísla fungují i bez kreditu."],
      ["Musíš mít speciální aplikaci", "Stačí obyčejný telefon, žádná aplikace není potřeba."],
    ],
    "Na tísňové číslo se dovoláš i bez kreditu na mobilu.",
    "Když někdo potřebuje pomoc, nesmí ho zastavit, že nemá peníze. Kolik tedy asi takové volání stojí?",
    "Volání na tísňová čísla je vždy zdarma a funguje i bez kreditu. Peníze nesmí být překážkou, když jde o život nebo zdraví.",
  ),
  t(
    "Co znamená slovo šikana?",
    "Úmyslné a opakované ubližování druhému",
    [
      ["Jednorázová hádka mezi kamarády", "Jedna hádka šikana není — šikana se opakuje a má za cíl ublížit."],
      ["Hlasitý smích ve třídě", "Smích sám o sobě nikomu neubližuje."],
      ["Soutěž mezi spolužáky", "Soutěž je hra podle pravidel, šikana je ubližování."],
    ],
    "Šikana se neděje jen jednou.",
    "Hledej možnost, kde se ubližuje schválně a znovu a znovu. Jedna hádka ani hra to nejsou.",
    "Šikana je úmyslné a opakované ubližování — fyzické (bití, strkání) nebo psychické (posměch, vylučování z party). Opakování a zlý úmysl ji odlišují od hádky nebo hry.",
  ),
  t(
    "Je jednorázový žert mezi kamarády totéž co šikana?",
    "Ne — žertu chybí opakování a záměr ublížit",
    [
      ["Ano, je to úplně stejné", "Není — žert je jednorázový a nemá ublížit, šikana se schválně opakuje."],
      ["Ano, pokud se někdo zasměje", "Smích o šikaně nerozhoduje, rozhoduje opakování a záměr ublížit."],
      ["Ne, protože šikana neexistuje", "Šikana bohužel existuje. Jeden žert to ale není."],
    ],
    "Vzpomeň si, podle čeho se šikana pozná.",
    "Šikana má dva znaky: děje se opakovaně a někdo chce druhému ublížit. Má tyhle znaky jeden žert mezi kamarády?",
    "Šikana se opakuje a jejím cílem je ublížit. Jednorázový žert nebo škádlení bez zlého úmyslu tyto znaky nemá, proto šikanou není.",
  ),
  t(
    "Kdo je pro dítě důvěryhodný dospělý?",
    "Rodič, učitel nebo jiný blízký dospělý",
    [
      ["Kdokoli starší osmnácti let", "Věk nestačí — důvěryhodný je ten, koho dobře znáš."],
      ["Jen rodič a nikdo další", "Důvěřovat můžeš i učiteli, prarodiči nebo trenérovi, nejen rodičům."],
      ["Cizí člověk, který vypadá mile", "Milý vzhled neznamená, že je člověk důvěryhodný. Cizího neznáš."],
    ],
    "Důvěryhodný znamená, že mu věříš a dobře ho znáš.",
    "Přemýšlej o dospělých, které vídáš každý den — doma, ve škole, na kroužku. Je to jen jeden člověk, nebo jich může být víc?",
    "Důvěryhodný dospělý je člověk, kterého dobře znáš a kterému věříš: rodič, prarodič, učitel nebo trenér. Nemusí to být jen rodič, ale nikdy to není cizí člověk.",
  ),
  t(
    "Co NESMÍŠ sdílet s cizími lidmi na internetu?",
    "Svou adresu a telefonní číslo",
    [
      ["Oblíbenou barvu", "Oblíbená barva nic neprozradí o tom, kde bydlíš."],
      ["Název oblíbeného seriálu", "Seriál tě nijak neprozradí, ten sdílet můžeš."],
      ["Obrázek krajiny", "Obrázek krajiny bez tebe a bez adresy je v pořádku."],
    ],
    "Hledej údaje, podle kterých by tě cizí člověk mohl najít.",
    "Barva, seriál ani obrázek krajiny neřeknou, kde bydlíš. Která možnost by cizímu člověku ukázala cestu k tobě domů nebo ke tvému telefonu?",
    "Adresa a telefonní číslo jsou osobní údaje — podle nich tě cizí člověk může najít nebo ti volat. Proto je cizím lidem na internetu neříkáme.",
  ),
  t(
    "Smíš poslat svou fotku cizímu člověku, kterého znáš jen z internetu?",
    "Ne — fotky cizím lidem neposílám",
    [
      ["Ano, pokud si píšeme dlouho", "Ani dlouhé psaní z cizího člověka neudělá známého — pořád nevíš, kdo to je."],
      ["Ano, když o to hezky poprosí", "Zdvořilá prosba nic nemění. Fotku by mohl zneužít."],
      ["Ano, ale jen jednu fotku", "I jedna fotka se dá zneužít a rozeslat dál."],
    ],
    "Fotka je tvůj osobní údaj — ukazuje, jak vypadáš.",
    "Člověk z internetu může být ve skutečnosti úplně jiný, než tvrdí, a fotku může poslat dál. Změní na tom něco, jak dlouho si píšete?",
    "Fotku cizímu člověku z internetu neposílej, ani když si dlouho píšete nebo hezky prosí. Nevíš, kdo to doopravdy je a co s fotkou udělá. Když o ni někdo žádá, řekni to dospělému.",
  ),
  t(
    "Proč je dobré znát tísňová čísla 150, 155, 158 a 112 zpaměti?",
    "Abych mohl rychle zavolat pomoc v nebezpečí",
    [
      ["Jen kvůli školnímu testu", "Čísla nejsou jen na test — jednou mohou zachránit život."],
      ["Abych mohl kamarádům volat zdarma", "Tísňová čísla nejsou na hovory s kamarády. Zbytečné volání zdržuje záchranáře."],
      ["Abych mohl vyzkoušet, jestli fungují", "Na tísňová čísla se nevolá na zkoušku — blokuješ linku lidem v nouzi."],
    ],
    "Ve vážné situaci není čas hledat čísla v telefonu.",
    "Když hoří nebo je někdo zraněný, rozhodují minuty. Proč je dobré mít čísla v hlavě dopředu, a ne je až hledat?",
    "V nebezpečí rozhoduje každá minuta. Kdo zná tísňová čísla zpaměti, zavolá pomoc hned a může zachránit život — svůj nebo někoho jiného.",
  ),
  t(
    "Které tísňové číslo funguje i v zahraničí a bez kreditu na mobilu?",
    "112",
    [
      ["150", "150 jsou čeští hasiči — v cizině to číslo fungovat nemusí."],
      ["155", "155 je česká záchranka, v jiných zemích mají jiná čísla."],
      ["158", "158 je česká policie, v zahraničí platí jiné číslo."],
    ],
    "Hledej číslo, které není jen české.",
    "Tři z nabízených čísel platí jen u nás a každé je pro jednu službu. Jedno je společné pro celou Evropu a pro všechny druhy nouze — které to je?",
    "Číslo 112 je evropská tísňová linka: funguje ve všech zemích Evropské unie i bez kreditu. Čísla 150, 155 a 158 jsou česká.",
  ),
  t(
    "Jaká může být šikana?",
    "Fyzická i psychická (posměch, vyloučení)",
    [
      ["Jen fyzická (bití, strkání)", "Nejen — ubližovat se dá i slovy a vylučováním z party."],
      ["Jen psychická (posměch)", "Nejen — patří sem i bití a strkání."],
      ["Jen slovní nadávky", "Nadávky jsou jen jedna podoba. Šikana může být i fyzická."],
    ],
    "Ubližovat se dá tělem, ale i slovy.",
    "Vzpomeň si: bití a strkání je jeden druh, posměch a nechat někoho stranou je druhý. Patří k šikaně jen jeden z nich, nebo oba?",
    "Šikana může být fyzická (bití, strkání) i psychická (posměch, pomlouvání, vylučování ze skupiny). Obě podoby ubližují a obě jsou stejně vážné.",
  ),
];

const POOL_L2: PracticeTask[] = [
  t(
    "Hoří odpadkový koš na dvoře vašeho domu. Koho zavoláš?",
    "Hasiče — 150",
    [
      ["Záchrannou službu — 155", "Záchranka jezdí k nemocným a zraněným. Oheň hasí jiní."],
      ["Policii — 158", "Policie řeší zločiny, požár neuhasí."],
      ["Nikoho, počkám, až oheň sám zhasne", "Oheň se může rychle rozšířit — nikdy nečekej."],
    ],
    "Jde o požár — kdo přijede oheň uhasit?",
    "Rozlišuj: oheň, zdraví, zločin. Tady je problém oheň — hledej službu, která s ním umí zacházet, a její číslo.",
    "Při požáru voláme hasiče na číslo 150. Nikdy nečekáme, až oheň zhasne sám — může se rychle rozšířit na dům.",
  ),
  t(
    "Spolužák spadl na hřišti a nemůže vstát, hodně ho bolí noha. Koho zavoláš?",
    "Záchrannou službu — 155",
    [
      ["Hasiče — 150", "Hasiči hasí požáry, tady nic nehoří."],
      ["Policii — 158", "Nikdo nespáchal zločin, spolužák potřebuje lékaře."],
      ["Jen rodiče spolužáka a nikoho dalšího", "Rodiče se to dozvědí, ale při vážném zranění je nutná rychlá odborná pomoc."],
    ],
    "Jde o zranění — kdo umí ošetřit zraněného?",
    "Rozlišuj: oheň, zdraví, zločin. Bolavá noha, na kterou nejde stoupnout, je věc zdraví — kdo k ní přijede s lékařem?",
    "Záchranná služba (155) jezdí k nemocným a zraněným. Samotné zavolání rodičům nestačí — spolužák potřebuje rychlou odbornou pomoc.",
  ),
  t(
    "Vidíš cizího muže, jak se snaží vypáčit dveře zaparkovaného auta. Co uděláš?",
    "Zavolám policii — 158",
    [
      ["Zavolám hasiče — 150", "Nic nehoří. Krádež řeší jiná služba."],
      ["Půjdu se na to podívat zblízka", "K místu se nepřibližuj, mohlo by ti hrozit nebezpečí."],
      ["Nebudu si toho všímat", "Když vidíš možnou krádež, je správné ji nahlásit."],
    ],
    "Vypáčit cizí auto je krádež.",
    "Rozlišuj: oheň, zdraví, zločin. Krádež je zločin — kdo ho vyšetřuje? Ke zloději se přitom nepřibližuj.",
    "Krádež je zločin, a ten řeší policie na čísle 158. K místu se nepřibližujeme, aby nám nehrozilo nebezpečí.",
  ),
  t(
    "Neznámý muž na ulici ti nabízí, že tě sveze domů autem. Co uděláš?",
    "Odmítnu a rychle odejdu k jiným lidem nebo do obchodu",
    [
      ["Nastoupím, protože vypadá mile", "Milý vzhled nic nezaručuje. Do auta cizího člověka nikdy nenastupuj."],
      ["Počkám, co mi chce říct", "Čekáním dáváš cizímu člověku čas. Bezpečnější je hned odejít."],
      ["Dám mu své telefonní číslo", "Telefonní číslo je osobní údaj, cizímu ho nedávej."],
    ],
    "Do auta cizího člověka se nenastupuje.",
    "Bezpečí je důležitější než zdvořilost — smíš říct ne. Kam je pak nejlepší jít, aby byl kolem někdo, kdo ti pomůže?",
    "Do auta cizího člověka nikdy nenastupuj, i kdyby byl velmi milý. Odmítni a rychle odejdi tam, kde jsou další lidé — třeba do obchodu.",
  ),
  t(
    "Cizí žena tě žádá, abys jí ukázal cestu na opuštěné parkoviště na kraji města. Co uděláš?",
    "Odmítnu — s neznámou osobou na odlehlé místo nechodím",
    [
      ["Půjdu, protože pomoc potřebuje", "Dospělý, který opravdu potřebuje pomoc, se zeptá jiného dospělého."],
      ["Půjdu, ale budu dávat pozor", "Opatrnost nestačí — na odlehlém místě ti nikdo nepomůže."],
      ["Zavolám kamaráda, ať jde se mnou", "Ani ve dvou s cizím člověkem na odlehlé místo nechoďte."],
    ],
    "Kdo by ti na opuštěném parkovišti mohl pomoct, kdyby se něco stalo?",
    "Dospělí si cestu zjistí sami — z mapy nebo od jiného dospělého. Proč by potřebovali právě dítě, a právě na místo, kde nikdo není?",
    "S neznámou osobou na odlehlé místo nikdy nechoď. Dospělý, který opravdu potřebuje poradit cestu, se zeptá jiného dospělého, ne dítěte.",
  ),
  t(
    "Ztratil ses v obchodním domě. Koho požádáš o pomoc?",
    "Prodavače nebo ochranku v obchodě",
    [
      ["Prvního cizího muže na ulici", "Cizí člověk na ulici není bezpečná volba — a navíc jsi v obchodě."],
      ["Nikoho — počkám sám", "Sám se ztracený jen těžko najdeš. Požádej zaměstnance."],
      ["Náhodné dítě stejného věku", "Dítě ti nepomůže — nemůže rodiče vyhlásit rozhlasem."],
    ],
    "V obchodě jsou dospělí, kteří tam pracují.",
    "Zaměstnanec obchodu zná prostředí a může rodiče vyhlásit rozhlasem. Kdo z nabízených lidí je v obchodě v práci?",
    "Prodavač nebo ochranka pracují na veřejném místě a vědí, co dělat: zavolají rodiče nebo je vyhlásí rozhlasem. Proto jsou nejlepší volbou.",
  ),
  t(
    "Ztratil ses na náměstí ve městě. Koho požádáš o pomoc?",
    "Policistu nebo strážníka v uniformě",
    [
      ["Kohokoli, kdo vypadá hodný", "Hodný vzhled nic nezaručuje. Obrať se na člověka v uniformě."],
      ["Jen mládež na skateboardu", "Náhodní kluci nemají povinnost ani možnost ti pomoct."],
      ["Nikoho, budu bloudit dál", "Bloudit dál je nebezpečné — je lepší požádat o pomoc."],
    ],
    "Hledej člověka, kterého poznáš podle oblečení.",
    "Uniforma prozradí, že má člověk za úkol pomáhat lidem a může kontaktovat tvé rodiče. Kdo na náměstí nosí uniformu?",
    "Policistu nebo strážníka v uniformě poznáš snadno a mají povinnost ti pomoci. Mohou zavolat tvým rodičům nebo tě bezpečně odvést.",
  ),
  t(
    "Neznámý člověk na internetu se tě ptá, kde přesně bydlíš. Co uděláš?",
    "Neřeknu mu to a řeknu to rodiči nebo učiteli",
    [
      ["Řeknu mu jen název ulice", "I název ulice pomůže cizímu člověku tě najít."],
      ["Řeknu mu to, když je milý", "Na internetu nepoznáš, kdo je doopravdy milý."],
      ["Nejdřív se zeptám proč, pak mu to řeknu", "Důvod může být vymyšlený. Adresu cizímu neříkej nikdy."],
    ],
    "Adresa je údaj, podle kterého tě cizí člověk najde.",
    "Nejde jen o to adresu neprozradit — kdo z dospělých by se měl dozvědět, že se na ni někdo vyptává?",
    "Adresu cizímu člověku na internetu neříkáme, ani po částech. Když se na ni někdo vyptává, řekneme to rodiči nebo učiteli, aby mohli zasáhnout.",
  ),
  t(
    "Cizí člověk na internetu tě žádá, abys mu poslal svou fotku. Co uděláš?",
    "Neposílám — řeknu to rodiči nebo učiteli",
    [
      ["Pošlu, když vypadá přátelsky", "Přátelské zprávy nic nezaručují."],
      ["Pošlu fotku, na které nejsem vidět celý", "I část fotky se dá zneužít. Neposílej nic."],
      ["Pošlu fotku kamaráda místo sebe", "Kamarádovu fotku bez jeho svolení posílat nesmíš — a cizímu už vůbec ne."],
    ],
    "Fotka je osobní — cizí člověk ji může zneužít.",
    "Nestačí jen fotku neposlat. Kdo by měl vědět, že tě o ni cizí člověk z internetu žádal, aby tě mohl ochránit?",
    "Fotku cizímu na internetu neposílej. Nevíš, kdo to doopravdy je a co s fotkou udělá. Když tě o ni někdo žádá, hned to řekni dospělému.",
  ),
  t(
    "Spolužák ti každý den o přestávce schválně strčí a nadává ti před ostatními. Co to je?",
    "Šikana",
    [
      ["Jednorázový žert", "Neděje se to jednou — opakuje se to každý den."],
      ["Přátelské škádlení", "Škádlení je vzájemná legrace. Tady je strkání schválně a nadávky."],
      ["Normální chování mezi kamarády", "Kamarádi si schválně neubližují každý den."],
    ],
    "Všimni si slov „každý den“ a „schválně“.",
    "Když někdo někomu ubližuje úmyslně a pořád znovu, má to svůj název. Znáš ho z hodin o bezpečí.",
    "Strkání a nadávky, které se opakují každý den a jsou schválně, jsou šikana. Opakování a záměr ublížit ji odlišují od žertu.",
  ),
  t(
    "Vidíš, že silnější spolužák už po několikáté bere mladšímu svačinu a nadává mu. Co bys měl udělat?",
    "Říct to učiteli nebo jinému dospělému",
    [
      ["Nic, není to moje věc", "Je — když šikanu mlčky přihlížíš, pomáháš, aby pokračovala."],
      ["Počkat, jestli přestane sám", "Šikana sama nepřestává, opakuje se už několikrát."],
      ["Vzít mladšímu svačinu taky", "Tím by ses k šikaně přidal."],
    ],
    "Opakované braní svačiny a nadávky jsou šikana.",
    "Šikanu nemá řešit dítě samo. Kdo ve škole má moc ji zastavit, a komu to tedy řekneš?",
    "Opakované ubližování je šikana a tu má řešit dospělý. Když to řekneš učiteli, pomůžeš mladšímu spolužákovi — mlčení šikanu nezastaví.",
  ),
  t(
    "Jsi na výletě mimo město a stane se něco nebezpečného, ale nejsi si jistý, jaké číslo zavolat. Co uděláš?",
    "Zavolám 112 — funguje vždy a přepojí mě dál",
    [
      ["Nezavolám nikomu, protože si nejsem jistý", "Nejistota není důvod nevolat — existuje číslo pro všechno."],
      ["Počkám, až najdu správné číslo", "Čekáním ztrácíš čas, který může rozhodovat."],
      ["Zavolám kamarádovi, ať to vyřeší", "Kamarád pomoc nepošle. Zavolej tísňovou linku."],
    ],
    "Existuje číslo, které funguje pro každý druh nouze.",
    "Když nevíš, jestli volat hasiče, záchranku, nebo policii, zavolej linku, kde operátor rozhodne za tebe. Které číslo to je?",
    "Když si nejsi jistý, zavolej 112. Tahle linka funguje vždy a operátor tě přepojí na hasiče, záchranku nebo policii.",
  ),
  t(
    "Neznámý muž ti nabízí bonbony a zve tě k sobě domů podívat se na štěňata. Co uděláš?",
    "Odmítnu, odejdu a řeknu to dospělému",
    [
      ["Půjdu se jen podívat na štěňata", "Právě lákavá nabídka je past. K cizímu domů nechoď."],
      ["Vezmu si bonbony, ale dovnitř nepůjdu", "Ani sladkosti od cizího člověka nepřijímej."],
      ["Zeptám se, jestli tam budou i jiné děti", "Ani přítomnost jiných dětí nic nezaručuje. Odmítni."],
    ],
    "Lákavá nabídka od cizího člověka je varování.",
    "Štěňata i bonbony jsou jen návnada. Co je bezpečné udělat hned a komu o tom potom povědět?",
    "Nabídku sladkostí nebo pozvání domů od cizího člověka vždy odmítni a odejdi. Pak to řekni rodiči nebo jinému dospělému, i kdyby to vypadalo neškodně.",
  ),
];

const POOL_L3: PracticeTask[] = [
  t(
    "Dva spolužáci si spolu hrají na honěnou, smějí se a občas do sebe žertem strčí. Je to šikana?",
    "Ne — chybí opakované a úmyslné ubližování",
    [
      ["Ano, protože do sebe strkají", "Strčit se při hře ještě není šikana — oba se smějí a hrají dobrovolně."],
      ["Ano, protože se to děje o přestávce", "Kdy se to děje, nerozhoduje. Rozhoduje, jestli někdo chce ubližovat."],
      ["Ne, protože šikana je jen mezi dospělými", "Šikana se bohužel děje i mezi dětmi. Tady ale jde o hru."],
    ],
    "Nejdřív rozpoznej, o jakou situaci jde — je to hra, nebo ubližování?",
    "Porovnej se znaky šikany: chce jeden druhému ublížit? Smějí se oba? Hrají si dobrovolně? Podle toho rozhodni.",
    "Jde o hru, ne o šikanu: obě děti se smějí a hrají dobrovolně, nikdo nechce druhému ublížit. Šikanu je potřeba odlišit od běžného škádlení nebo hry.",
  ),
  t(
    "Kamarád ti řekne, že mu spolužák bere svačinu úplně každý den a vyhrožuje, že mu ublíží, když to řekne. Co to je a co má udělat jako první?",
    "Je to šikana — měl by to hned říct dospělému",
    [
      ["Je to jen legrace — nemusí nic dělat", "Výhrůžky a každodenní braní svačiny nejsou legrace."],
      ["Je to šikana, ale musí ji vyřešit sám", "Šikanu dítě samo neřeší — potřebuje pomoc dospělého."],
      ["Není to šikana, jde jen o svačinu", "Nejde o svačinu, ale o opakované ubližování a výhrůžky."],
    ],
    "Nejdřív rozpoznej situaci: opakuje se to a je tam vyhrožování.",
    "Pak zvol reakci. Výhrůžka „když to řekneš, bude hůř“ má kamaráda umlčet — právě proto potřebuje někoho, kdo ho ochrání. Kdo to je?",
    "Každodenní braní svačiny s výhrůžkami je šikana. První krok je říct to co nejdřív důvěryhodnému dospělému — sám by to kamarád řešit neměl.",
  ),
  t(
    "Jsi na výletě v lese, kamarád spadl ze stromu a hodně krvácí. Jste daleko od města a nevíš přesně, jaké číslo použít. Co uděláš?",
    "Zavolám 112 — funguje všude a přepojí mě na správnou pomoc",
    [
      ["Nezavolám, protože nevím přesné číslo", "Neznalost čísla není důvod nevolat — zbývá jedno univerzální."],
      ["Počkám, až budeme blíž městu", "Při silném krvácení nečekej, pomoc musí přijet co nejdřív."],
      ["Zavolám 158, protože je to nejsnazší číslo", "158 je policie. Zraněný potřebuje lékaře, ne policii."],
    ],
    "Uvědom si, že jde o zdravotní nebezpečí, ale přesné číslo si nepamatuješ.",
    "Když si nejsi jistý číslem, zvol linku, která funguje všude a kde tě operátor spojí se správnou službou. Čekat na lepší místo se nevyplácí.",
    "Když přesné číslo nevíš, zavolej 112 — funguje všude, i v lese, a operátor tě spojí se záchrankou. Při silném krvácení se nečeká.",
  ),
  t(
    "Kamarád ti pošle odkaz na neznámou hru a tvrdí, že je úplně bezpečná, protože ji dostal od svého bratra. Co uděláš jako první?",
    "Nejdřív se zeptám dospělého, jestli je stránka bezpečná",
    [
      ["Hned kliknu, protože to poslal kamarád", "Kamarád nemusí vědět, odkud odkaz pochází. Nejdřív ověř."],
      ["Pošlu odkaz dál celé třídě", "Tím bys případné nebezpečí rozšířil na všechny."],
      ["Kliknu, ale nezadám žádné heslo", "Nebezpečná stránka může škodit i bez hesla, stačí na ni kliknout."],
    ],
    "Uvědom si, že i kamarád může nevědomky poslat nebezpečný odkaz.",
    "Neznámý odkaz je jako neznámý balíček — nejdřív zjisti, co v něm je. Kdo ti umí posoudit, jestli je v pořádku?",
    "I odkaz od kamaráda může být nebezpečný, protože ani on nemusí vědět, odkud pochází. Proto se nejdřív zeptej dospělého a teprve pak klikej.",
  ),
  t(
    "Neznámá paní čeká před školou a řekne ti, že ji poslala maminka, protože měla nehodu, a máš jít s ní. Co uděláš?",
    "Neodejdu s ní — ověřím to u učitele nebo zavolám rodičům",
    [
      ["Půjdu s ní, protože zná jméno mojí maminky", "Jméno maminky může cizí člověk zjistit snadno. Nic to nedokazuje."],
      ["Půjdu s ní, ale budu se bát", "Strach je signál, že to není v pořádku. Nechoď."],
      ["Řeknu jí, kde bydlím, ať mě tam odveze", "Adresu cizímu neříkej a s cizím nikam nejezdi."],
    ],
    "Tvrzení cizího člověka nemusí být pravdivé, i když zní naléhavě.",
    "Rodiče by ti předem řekli, kdo pro tebe přijde. Jak si můžeš ověřit, jestli ta paní mluví pravdu, aniž bys s ní odešel?",
    "I naléhavé tvrzení cizí osoby je potřeba ověřit u učitele nebo rodičů. Cizí lidé mohou znát jméno rodiče, a přesto lhát. S cizím nikam neodcházej.",
  ),
  t(
    "Na internetu ti píše někdo, kdo tvrdí, že je stejně starý jako ty, a chce vědět, do jaké školy chodíš a kde bydlíš, abyste se mohli kamarádit. Co uděláš?",
    "Neřeknu mu to a řeknu to dospělému",
    [
      ["Řeknu mu jen školu, ne adresu", "I podle školy tě může cizí člověk najít."],
      ["Řeknu mu to, protože je to dítě jako já", "Na internetu nepoznáš, jestli je to opravdu dítě."],
      ["Nejdřív chci jeho adresu, pak mu dám svou", "Výměna nic nezaručuje — jeho adresa může být vymyšlená."],
    ],
    "Na internetu nikdy nevíš jistě, kdo s tebou opravdu píše.",
    "Škola i adresa jsou údaje, podle kterých tě někdo najde. Kromě toho, že je neprozradíš, komu o takové zprávě povíš?",
    "Na internetu si nemůžeš být jistý, kdo s tebou píše, i kdyby tvrdil, že je dítě. Školu ani adresu neříkej a zprávu ukaž dospělému.",
  ),
  t(
    "Dva spolužáci se jednou pohádali o pravítko a jeden druhého strčil. Od té doby se to už nestalo. Je to šikana?",
    "Ne — chybí opakování, šlo o jednu hádku",
    [
      ["Ano, protože došlo ke strkání", "Jedno strčení v hádce ještě šikanou není — chybí opakování."],
      ["Ano, protože to bylo o přestávce", "Čas ani místo nerozhodují. Rozhoduje opakování a záměr."],
      ["Ne, protože šlo jen o kluky", "Šikana může být mezi kýmkoli. Šikanou to není proto, že se to neopakuje."],
    ],
    "Zjisti, jestli se ubližování opakuje, nebo šlo o jednu příhodu.",
    "Šikana potřebuje, aby se ubližování opakovalo. Stalo se to tady víckrát, nebo jen jednou při sporu o pravítko?",
    "Jednorázová hádka se strčením není šikana, protože chybí opakování a dlouhodobý záměr ublížit. Je to konflikt, který se dá vyřešit domluvou.",
  ),
  t(
    "Ztratil ses ve městě a jediný dospělý poblíž je muž bez uniformy, který nabízí, že tě odvede na policii. Co je nejbezpečnější?",
    "Dojdu sám do nejbližšího obchodu nebo za policistou v uniformě",
    [
      ["Půjdu s ním, protože nabízí pomoc", "Nabídka pomoci od cizího nic nezaručuje."],
      ["Počkám na místě a nikoho neoslovím", "Jen čekat nic nevyřeší — bezpečnou pomoc si můžeš najít sám."],
      ["Půjdu s ním, ale budu si dávat pozor", "Opatrnost nestačí, když jdeš s cizím člověkem."],
    ],
    "Nabídka pomoci od cizího člověka bez uniformy není jistota bezpečí.",
    "Porovnej, kde je víc lidí a kdo má povinnost ti pomoct. Kam bys mohl dojít sám, místo abys šel s cizím?",
    "I dobře míněná nabídka cizího člověka je méně bezpečná než dojít sám do obchodu nebo za policistou v uniformě. Tam jsou lidé, kteří mají povinnost pomoct.",
  ),
  t(
    "V lese hoří ohniště a zároveň je jeden z kamarádů popálený na ruce. Nevíš, koho zavolat dřív. Co uděláš?",
    "Zavolám 112 — operátor pošle hasiče i záchranku",
    [
      ["Zavolám jen 150, zraněný počká", "Popálený kamarád potřebuje ošetření taky, ne až po uhašení."],
      ["Počkám, až přijde dospělý", "Oheň i popálenina potřebují pomoc hned."],
      ["Zavolám kamarádovi domů", "Kamarád pomoc nepošle, zavolej tísňovou linku."],
    ],
    "Uvědom si, že jde o dvě věci najednou — oheň i zranění.",
    "Místo dvou hovorů stačí jeden: na lince, která platí pro všechny druhy nouze, operátor vyšle obě služby naráz. Která to je?",
    "Když je potřeba víc druhů pomoci najednou, zavolej 112. Operátor zajistí hasiče i záchrannou službu, aniž bys musel volat dvakrát.",
  ),
  t(
    "Spolužák ti ukáže modřiny a řekne, že mu je dělá stejný kluk už potřetí a vyhrožuje, že to bude horší, když to řekne. Co má udělat jako první?",
    "Říct to co nejdřív důvěryhodnému dospělému",
    [
      ["Počkat, jestli přestane sám", "Ubližování už se opakovalo třikrát — samo nepřestane."],
      ["Vyřešit si to s tím klukem sám", "Proti tomu, kdo ubližuje a vyhrožuje, dítě samo nestačí."],
      ["Nic neříkat, aby nebylo hůř", "Právě mlčení chce ten, kdo vyhrožuje. Hůř bude spíš, když se to nikdo nedozví."],
    ],
    "Opakované ubližování s výhrůžkami je šikana.",
    "Výhrůžka má spolužáka umlčet. Co je tedy nejdůležitější první krok — mlčet, bojovat sám, nebo získat někoho silnějšího na svou stranu?",
    "Opakované ubližování a výhrůžky jsou šikana. Šikanista se vyhrožováním snaží spolužáka umlčet, proto je nejdůležitější co nejdřív to říct dospělému.",
  ),
  t(
    "Kamarádka ti napíše, že jí neznámý člověk z internetu nabízí schůzku a ptá se, jestli má jít. Co jí poradíš?",
    "Ať to řekne rodičům a s cizím člověkem se nesetkává",
    [
      ["Ať jde, ale vezme si kamarádku s sebou", "Ani ve dvou se s cizím z internetu nescházejte."],
      ["Ať se nejdřív zeptá, jak ten člověk vypadá", "Fotka nebo popis může být falešný."],
      ["Ať mu pošle adresu, aby věděl, kam přijít", "Adresu cizímu nikdy neposílej."],
    ],
    "Setkání s někým, koho znáš jen z internetu, je vždy rizikové.",
    "Kdo by měl o takové pozvánce vědět, aby mohl posoudit riziko a kamarádku ochránit? A má se vůbec scházet?",
    "S cizím člověkem, kterého znáš jen z internetu, se nesetkáváme, ani ve dvou. Správný postup je říct to rodičům, kteří situaci vyřeší.",
  ),
  t(
    "Starší spolužák tě požádá, abys mu jako srandu pomohl schovat penál mladšímu klukovi. Děje se to už podruhé a ten mladší kvůli tomu brečí. Co to je a co uděláš?",
    "Je to šikana — odmítnu pomáhat a řeknu to dospělému",
    [
      ["Je to jen legrace, tak mu pomůžu", "Legrace to není, když mladší kvůli tomu brečí."],
      ["Je to šikana, ale nebudu se do toho plést", "Když o šikaně víš a mlčíš, pomáháš, aby pokračovala."],
      ["Není to šikana, jde jen o penál", "Nejde o penál, ale o opakované trápení mladšího."],
    ],
    "Opakování a slzy mladšího ukazují, že nejde o neškodnou legraci.",
    "Pak zvol reakci: když pomáháš schovávat penál, stáváš se součástí trápení. Co udělat místo toho a komu to říct?",
    "Opakované schovávání věcí, které mladšímu ubližuje, je šikana, i když to starší nazývá srandou. Správně je odmítnout se na tom podílet a říct to dospělému.",
  ),
  t(
    "Někdo ti na internetu napíše, že jsi vyhrál tablet, a chce jen tvoje celé jméno, adresu a heslo k účtu. Co uděláš?",
    "Nic nevyplním a ukážu zprávu dospělému",
    [
      ["Vyplním to, tablet se hodí", "Výhra je návnada. Údaje a heslo by se daly zneužít."],
      ["Pošlu jen jméno a adresu, heslo ne", "I jméno s adresou prozradí, kde bydlíš."],
      ["Pošlu jen heslo, adresu ne", "Heslo nesmí znát nikdo cizí — otevírá tvůj účet."],
    ],
    "Výhra, o kterou jsi nesoutěžil, je podezřelá.",
    "Nejdřív si uvědom, co ten člověk chce doopravdy — tvoje osobní údaje. Pak rozhodni, co se zprávou udělat a komu ji ukázat.",
    "Falešná výhra je častý trik, jak od dětí získat osobní údaje a hesla. Nic nevyplňuj, neposílej ani část údajů a zprávu ukaž rodiči nebo učiteli.",
  ),
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
