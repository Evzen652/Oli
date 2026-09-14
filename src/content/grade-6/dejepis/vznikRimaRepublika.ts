/**
 * Dějepis 6. ročník — Vznik Říma, království, republika, krize republiky (select_one).
 *
 * Faktický vzor (reckoPerskeValkyPeloponeskaValka): pevné banky úloh, každá
 * s vlastní malou i velkou nápovědou, vysvětlením PROČ a optionFeedback.
 * Generátor vrací celou banku zamíchanou, takže na každé úrovni je vždy
 * ≥ 12 různých úloh (deterministicky, žádné losování a doufání).
 *
 * Chybový model — každý distraktor je jeden typický omyl:
 *  1. letopočty př. n. l. čtené jako n. l. (vyšší číslo = později), u trvání
 *     sčítání místo odčítání, pravidlo přelomu letopočtu použité mimo přelom,
 *     odčítání po řádech bez vypůjčení;
 *  2. záměna úřadů republiky (konzul × tribun lidu × senátor × diktátor);
 *  3. anachronismus mezi fázemi (Caesar jako císař, král v republice,
 *     Spartakus nebo Kartágo ve špatné době);
 *  4. přenos z látky o Řecku a Orientu (Athény, Persie, Sparta, Chammurapi).
 *
 *  • L1 — zapamatování: kdo, co, jak se jmenoval.
 *  • L2 — použití: popis situace → fáze, pravomoc → úřad, nejstarší/nejmladší událost.
 *  • L3 — analýza: příčina, důsledek, výpočet trvání přes letopočty př. n. l.
 *
 * Datace: založení Říma 753 př. n. l. vždy „podle pověsti“, vyhnání krále
 * „asi“ 510 a Zákony dvanácti desek „kolem“ 450 př. n. l. Augustus
 * a císařství jen jako distraktor (patří do sousedního podtématu).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { pickN, buildChoiceTask as choice } from "./_shared";

interface Uloha {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
  steps?: string[];
}

const build = (u: Uloha): PracticeTask =>
  choice(u.q, u.key, u.d.map(([value, why]) => ({ value, why })), {
    hints: u.hints,
    explanation: u.explanation,
    solutionSteps: u.steps,
  });

// ── L1 — zapamatování ──────────────────────────────────────────────────────
const L1: Uloha[] = [
  {
    q: "Jak se podle pověsti jmenovali bratři, kteří založili Řím?",
    key: "Romulus a Remus",
    d: [
      ["Kastor a Pollux", "Kastor a Pollux jsou blíženci z řeckých bájí. Řím podle pověsti založila jiná dvojčata."],
      ["Tiberius a Gaius Grakchus", "Bratři Grakchové žili až v době republiky, přes šest set let po založení Říma. Prosazovali půdu pro chudé."],
      ["Caesar a Pompeius", "Caesar a Pompeius nebyli bratři a žili až na konci republiky. Nejdřív byli spojenci, pak spolu válčili."],
    ],
    hints: [
      "Vzpomeň si na pověst o dvojčatech, která byla odložena u řeky Tiberu a která kojila vlčice.",
      "Blíženci z řeckých bájí s Římem nesouvisí a ostatní dvojice žily až za republiky. Hledej dvojčata z pověsti. Podle jednoho z nich dostalo město své jméno.",
    ],
    explanation: "Podle pověsti založili Řím roku 753 př. n. l. dvojčata Romulus a Remus, která kojila vlčice. Romulus bratra zabil a město pojmenoval po sobě. Kastor a Pollux patří do řeckých bájí, Grakchové a Caesar s Pompeiem žili o staletí později.",
  },
  {
    q: "Jak se jmenoval kartáginský vojevůdce, který přešel se slony Alpy?",
    key: "Hannibal",
    d: [
      ["Spartakus", "Spartakus nebyl Kartáginec, ale gladiátor. Vedl povstání otroků v Itálii až ve 1. století př. n. l."],
      ["Scipio", "Scipio byl Říman. Právě on nakonec kartáginského vojevůdce porazil."],
      ["Xerxés", "Xerxés byl perský král a táhl na Řecko, ne přes Alpy na Řím. To patří k řecko-perským válkám."],
    ],
    hints: [
      "Hledej nepřítele Říma z doby punských válek. Musí to být muž z Kartága, ne Říman ani vzbouřený otrok.",
      "Perský král patří k válkám s Řeky a gladiátor vedl vzpouru otroků o víc než sto let později. Z vojevůdců punských válek vyber toho, kdo nebyl Říman a přivedl do Itálie válečné slony.",
    ],
    explanation: "Kartáginský vojevůdce Hannibal přešel ve 2. punské válce se slony přes Alpy a dlouho porážel Římany v Itálii. Porazil ho až Říman Scipio. Spartakus vedl povstání otroků a Xerxés byl perský král.",
  },
  {
    q: "Kolik konzulů volili Římané za republiky a na jak dlouho?",
    key: "Dva, vždy na jeden rok",
    d: [
      ["Jednoho, vždy na jeden rok", "Jediný vládce by měl moc jako král, a právě tomu chtěli Římané zabránit. Konzulové byli proto dva a hlídali se."],
      ["Tři, vždy na jeden rok", "První triumvirát (Caesar, Pompeius, Crassus) nebyl úřad, ale soukromá dohoda tří mužů z konce republiky. Konzulů bylo méně."],
      ["Dva, na celý život", "Doživotně vládl král. Konzulové se naopak pravidelně střídali, aby nikdo neměl moc natrvalo."],
    ],
    hints: [
      "Vzpomeň si, proč Římané vyhnali krále. Kolik nejvyšších úředníků a na jak dlouho by zajistilo, že si nikdo moc nepřivlastní?",
      "Jeden muž by vládl jako král a doživotní úřad by byl stejně nebezpečný. Dohoda Caesara, Pompeia a Crassa přišla až v krizi republiky a úřadem nebyla. Hledej počet, při kterém se úředníci navzájem hlídají, a krátkou dobu úřadu.",
    ],
    explanation: "Římané volili každý rok dva konzuly. Byli dva, aby jeden mohl zastavit druhého, a jen na rok, aby se nikdo nestal novým králem. První triumvirát byl soukromá dohoda tří mužů, ne úřad.",
  },
  {
    q: "Jak se nazývali bohatí urození Římané z nejstarších rodů?",
    key: "Patricijové",
    d: [
      ["Plebejové", "Plebejové byli naopak prostí svobodní lidé: rolníci, řemeslníci a obchodníci. Dlouho neměli stejná práva."],
      ["Otroci", "Otroci nebyli svobodní a nepatřili k žádným urozeným rodům. Byli majetkem svých pánů."],
      ["Spartiaté", "Spartiaté byli plnoprávní občané řecké Sparty. Do římských dějin nepatří."],
    ],
    hints: [
      "V Římě se svobodní občané dělili na dvě skupiny: urozenou bohatou a prostou. Hledej název té urozené.",
      "Spartiaté patří do Řecka a otroci nebyli svobodní. Ze dvou římských skupin svobodných občanů vyber tu, z jejíchž rodů pocházeli první senátoři a úředníci, ne tu, do které patřili rolníci a řemeslníci.",
    ],
    explanation: "Patricijové byli bohatí Římané z nejstarších rodů a zpočátku jen oni zastávali úřady. Plebejové byli prostí svobodní lidé, otroci nebyli svobodní vůbec a Spartiaté byli občané Sparty.",
  },
  {
    q: "Jak se nazývali prostí svobodní Římané, například rolníci, řemeslníci a obchodníci?",
    key: "Plebejové",
    d: [
      ["Patricijové", "Patricijové byli naopak bohatí urození Římané z nejstarších rodů. Prostí lidé to nebyli."],
      ["Otroci", "Otroci nebyli svobodní. V zadání jde o svobodné občany, kteří jen neměli urozený původ."],
      ["Heloti", "Heloti byli nesvobodní rolníci ve Spartě. S římskými občany nemají nic společného."],
    ],
    hints: [
      "Hledej název pro svobodné občany, kteří nepocházeli z urozených rodů. Heloty a otroky vyřaď, nebyli svobodní.",
      "Spartské nesvobodné rolníky i otroky vyřaď. Ze dvou skupin svobodných Římanů vyber tu, která si postupně vybojovala vlastní úředníky a sepsané zákony, protože zpočátku neměla stejná práva.",
    ],
    explanation: "Plebejové byli prostí svobodní Římané. Dlouho neměli stejná práva jako patricijové a postupně si vymohli tribuny lidu a sepsané zákony. Otroci ani spartští heloti nebyli svobodní.",
  },
  {
    q: "S kým vedl Řím punské války?",
    key: "S Kartágem",
    d: [
      ["S Perskou říší", "Perská říše válčila s Řeky, ne v punských válkách s Římem. To je záměna s řecko-perskými válkami."],
      ["S Athénami", "Athény bojovaly se Spartou v peloponéské válce. Punské války vedl Řím s obchodním městem v Africe."],
      ["Se Spartou", "Sparta patří do dějin Řecka. Soupeř Říma v punských válkách ležel v severní Africe."],
    ],
    hints: [
      "Slovo punský pochází z latinského jména pro Féničany. Hledej město, které Féničané založili v severní Africe.",
      "Perská říše, Athény i Sparta patří do dějin Řecka a Orientu. Soupeřem Říma v punských válkách bylo bohaté obchodní město féničanského původu, které Římané nakonec srovnali se zemí.",
    ],
    explanation: "Punské války vedl Řím s Kartágem, obchodním městem v severní Africe, které založili Féničané (latinsky Poeni, odtud punské). Roku 146 př. n. l. Římané Kartágo zničili. Persie, Athény a Sparta patří do dějin Řecka.",
  },
  {
    q: "Který sbor složený z bývalých úředníků radil konzulům?",
    key: "Senát",
    d: [
      ["Lidové shromáždění", "Lidové shromáždění tvořili všichni občané a volili úředníky. Bývalí úředníci v něm zvlášť nezasedali."],
      ["Triumvirát", "Triumvirát byla dohoda tří mocných mužů na konci republiky, ne stálý sbor."],
      ["Tribunové lidu", "Tribunové lidu byli volení úředníci plebejců. Radou pro konzuly nebyli."],
    ],
    hints: [
      "Hledej stálou radu, ve které zasedali muži, kteří už dříve zastávali úřady. Nejsou to všichni občané.",
      "Dohoda tří mužů vznikla až v krizi, tribunové byli úředníci a shromáždění tvořili všichni občané. Zbývá rada zkušených mužů, jejíž název souvisí s latinským slovem pro starce.",
    ],
    explanation: "Konzulům radil senát, složený z bývalých úředníků, většinou z bohatých rodů. Lidové shromáždění tvořili všichni občané, tribunové lidu byli úředníci a triumvirát byla dohoda tří mužů.",
  },
  {
    q: "Jak se jmenoval poslední římský král, kterého Římané vyhnali?",
    key: "Tarquinius Pyšný",
    d: [
      ["Romulus", "Romulus byl podle pověsti první král a zakladatel města, ne poslední král."],
      ["Julius Caesar", "Julius Caesar nebyl král. Žil na konci republiky, stal se diktátorem a byl zavražděn."],
      ["Augustus", "Augustus byl první císař a vládl až po republice, téměř pět set let po posledním králi."],
    ],
    hints: [
      "Hledej krále, ne pozdějšího vládce. Vzpomeň si, jak si poslední král počínal.",
      "Zakladatel byl první král, ne poslední, a další dva muži žili až na konci republiky a po ní. Vzpomeň si, jak si poslední král počínal a proč ho Římané z města vyhnali.",
    ],
    explanation: "Posledním římským králem byl Tarquinius Pyšný. Římané ho asi roku 510 př. n. l. vyhnali a založili republiku. Romulus byl první král, Caesar diktátor a Augustus první císař.",
  },
  {
    q: "Jak se jmenovaly nejstarší sepsané římské zákony?",
    key: "Zákony dvanácti desek",
    d: [
      ["Chammurapiho zákoník", "Chammurapiho zákoník je z Mezopotámie, o víc než tisíc let starší. S Římem nesouvisí."],
      ["Solónovy zákony", "Solónovy zákony platily v Athénách. To je přenos z dějin Řecka."],
      ["Zákony bratří Grakchů", "Bratři Grakchové prosazovali zákony o půdě až zhruba o tři sta let později, v krizi republiky."],
    ],
    hints: [
      "Hledej římské zákony z raného období republiky. Byly vystavené veřejně, aby je znal každý.",
      "Zákoník z Mezopotámie a zákony z Athén do Říma nepatří a Grakchové žili až v krizi republiky. Vzpomeň si, na co Římané své nejstarší zákony vyryli a kde je vystavili.",
    ],
    explanation: "Nejstarší sepsané římské zákony jsou Zákony dvanácti desek z doby kolem roku 450 př. n. l. Vystavili je veřejně, aby je patricijové nemohli vykládat, jak se jim hodí. Chammurapi a Solón patří do jiných zemí, Grakchové do pozdější doby.",
  },
  {
    q: "Kdo vedl v letech 73–71 př. n. l. povstání otroků proti Římu?",
    key: "Spartakus",
    d: [
      ["Hannibal", "Hannibal byl kartáginský vojevůdce a bojoval proti Římu o víc než sto let dřív. Otrokem nebyl."],
      ["Tiberius Grakchus", "Tiberius Grakchus byl svobodný Říman a tribun lidu. Prosazoval půdu pro rolníky, ne vzpouru otroků."],
      ["Leónidás", "Leónidás byl spartský král a padl u Thermopyl. Jméno vůdce povstání jen zní podobně jako Sparta."],
    ],
    hints: [
      "Vůdce povstání byl sám otrok vycvičený jako gladiátor. Vyřaď muže, kteří byli svobodní nebo králové.",
      "Kartáginec bojoval proti Římu o víc než sto let dřív, tribun lidu byl svobodný Říman a spartský král patří do Řecka. Hledej gladiátora z Thrákie, kterého nakonec porazil Crassus.",
    ],
    explanation: "Povstání otroků v letech 73–71 př. n. l. vedl gladiátor Spartakus. Jeho vojsko porazil Crassus. Hannibal byl Kartáginec, Tiberius Grakchus tribun lidu a Leónidás spartský král.",
  },
  {
    q: "Kdo uzavřel spojenectví zvané první triumvirát?",
    key: "Caesar, Pompeius a Crassus",
    d: [
      ["Caesar, Augustus a Pompeius", "Augustus (tehdy ještě Gaius Octavius) byl malé dítě. Do politiky vstoupil až po Caesarově smrti."],
      ["Caesar, Pompeius a Hannibal", "Hannibal žil o víc než sto let dřív a byl nepřítel Říma, ne římský politik."],
      ["Crassus, Pompeius a Spartakus", "Spartakus byl vzbouřený otrok. Crassus jeho povstání potlačil, spojenci nebyli."],
    ],
    hints: [
      "Triumvirát znamená spolek tří mužů. Hledej tři mocné Římany ze stejné doby na konci republiky.",
      "Nepřítel z punských válek žil dřív, vzbouřený otrok nemohl být spojencem římských politiků a pozdější císař byl ještě dítě. Hledej trojici, v níž je vojevůdce, bohatý muž a pozdější dobyvatel Galie.",
    ],
    explanation: "První triumvirát uzavřeli Caesar, Pompeius a Crassus, tři mocní muži, kteří si rozdělili vliv ve státě. Hannibal žil dřív, Spartakus byl vzbouřený otrok a Augustus byl tehdy ještě dítě.",
  },
  {
    q: "Jakou hraniční řeku překročil Caesar s vojskem roku 49 př. n. l.?",
    key: "Rubikon",
    d: [
      ["Tiber", "Na Tiberu leží samotný Řím. Hraniční řeka, kterou Caesar překročil, tekla severněji."],
      ["Nil", "Nil je řeka v Egyptě. Caesar v Egyptě byl, ale válku o Řím začal na hranici Itálie."],
      ["Eufrat", "Eufrat teče v Mezopotámii. To je přenos z dějin starověkého Orientu."],
    ],
    hints: [
      "Tahle řeka byla hranicí, přes kterou nesměl vojevůdce vést vojsko do Itálie. Dnes se podle ní říká rozhodnutí, ze kterého není návratu.",
      "Egyptská ani mezopotámská řeka hranici Itálie netvořila a na řece, kde leží Řím, hranice nebyla. Vzpomeň si na úsloví o překročení řeky, když někdo udělá krok, který už nejde vrátit.",
    ],
    explanation: "Roku 49 př. n. l. překročil Caesar s vojskem hraniční řeku Rubikon. Tím porušil zákon a začala občanská válka s Pompeiem. Odtud úsloví „překročit Rubikon“. Tiber teče Římem, Nil Egyptem a Eufrat Mezopotámií.",
  },
  {
    q: "Kdo byl zavražděn spiklenci v senátu roku 44 př. n. l.?",
    key: "Julius Caesar",
    d: [
      ["Augustus", "Augustus vládl ještě desítky let jako první císař a zemřel přirozenou smrtí."],
      ["Pompeius", "Pompeius prohrál válku s Caesarem a byl zabit už dřív v Egyptě, ne v senátu."],
      ["Tarquinius Pyšný", "Tarquinius Pyšný byl poslední král a Římané ho vyhnali, ne zavraždili. Žil o víc než čtyři sta let dřív."],
    ],
    hints: [
      "Spiklenci se báli, že tento muž zničí republiku a bude vládnout sám. Vládl jako diktátor.",
      "Král byl vyhnán o staletí dřív, Caesarův soupeř zemřel už předtím v Egyptě a první císař vládl až potom. Hledej diktátora, který kdysi překročil s vojskem hraniční řeku.",
    ],
    explanation: "Roku 44 př. n. l. zavraždili spiklenci v senátu Julia Caesara, protože se stal doživotním diktátorem a báli se o republiku. Pompeius zemřel dřív, Tarquinius byl vyhnán a Augustus vládl až potom.",
  },
  {
    q: "Kdo jako tribun lidu prosazoval, aby chudí rolníci dostali státní půdu?",
    key: "Bratři Grakchové",
    d: [
      ["Bratři Romulus a Remus", "Romulus a Remus jsou zakladatelé Říma z pověsti. Tribunové lidu v jejich době ještě neexistovali."],
      ["Senátoři z bohatých rodů", "Bohatí senátoři vlastnili velké statky a rozdělování půdy se naopak bránili."],
      ["Spartakus a jeho otroci", "Otroci nebyli občané a nemohli být tribuny. Spartakus bojoval o svobodu zbraněmi."],
    ],
    hints: [
      "Tribuny lidu volili plebejové. Hledej svobodné Římany z doby, kdy chudí rolníci přicházeli o půdu.",
      "Zakladatelé z pověsti žili před republikou, otroci nemohli být úředníky a bohatí statkáři půdu chránili pro sebe. Hledej dva sourozence, kteří jako tribunové zaplatili za své návrhy životem.",
    ],
    explanation: "Tribunové lidu Tiberius a Gaius Grakchus chtěli dát chudým rolníkům státní půdu. Bohatí senátoři se bránili a oba bratři postupně zahynuli v nepokojích (starší roku 133, mladší roku 121 př. n. l.). Tím začala krize republiky.",
  },
  {
    q: "Na které řece leží město Řím?",
    key: "Tiber",
    d: [
      ["Rubikon", "Rubikon byla hraniční říčka na severu Itálie, kterou Caesar překročil s vojskem. Řím na ní neleží."],
      ["Nil", "Na Nilu vznikl starověký Egypt, ne Řím."],
      ["Eufrat", "Eufrat teče v Mezopotámii. To je přenos z dějin starověkého Orientu."],
    ],
    hints: [
      "Vzpomeň si na pověst: dvojčata odložená v košíku připlula po řece až k místu budoucího města.",
      "Egyptská a mezopotámská řeka do Itálie nepatří a hraniční říčka, kterou kdysi překročil Caesar, tekla daleko na severu. Hledej řeku, po které podle pověsti připlul košík s dvojčaty.",
    ],
    explanation: "Řím leží na řece Tiberu ve střední Itálii. Podle pověsti tam voda vynesla košík s Romulem a Remem. Rubikon byla hraniční řeka na severu, Nil teče Egyptem a Eufrat Mezopotámií.",
  },
];

// ── L2 — použití ───────────────────────────────────────────────────────────
// (a) situace → fáze
const FAZE = {
  K: "V době království",
  R: "V době republiky před krizí",
  C: "V době krize republiky",
  E: "V době císařství",
} as const;
type Faze = keyof typeof FAZE;

const FAZE_FB: Record<"K" | "R" | "C", Partial<Record<Faze, string>>> = {
  K: {
    R: "Republika vznikla až po vyhnání posledního krále. Moc v ní měli volení úředníci na omezenou dobu, ne jeden vládce bez časového omezení.",
    C: "V krizi republiky se o moc přetahovali vojevůdci, ale konzulové a senát pořád existovali. Vláda jednoho muže bez úředníků patří na začátek římských dějin.",
    E: "Císař také vládl sám a doživotně, ale císařství přišlo až po republice. Na začátku římských dějin vládli králové.",
  },
  R: {
    K: "Za království vládl jeden muž doživotně. Volené úředníky, sepsané zákony a ochranu plebejců přinesla až doba po vyhnání posledního krále.",
    C: "Tady úřady fungují, jak mají: moc je rozdělená a nikdo si ji nebere silou. Krize přišla, až když se vojevůdci začali opírat o vlastní vojska.",
    E: "Císařství přišlo až po republice a jejích krizích. Tady se moc dělí mezi volené úředníky, císař by vládl sám a doživotně.",
  },
  C: {
    K: "Králové vládli Římu na začátku jeho dějin. Boje o moc, povstání a vojevůdci s vlastními vojsky patří do posledního století republiky.",
    R: "Úřady republiky tu sice ještě existují, ale nerozhoduje senát ani volení úředníci. Rozhoduje síla vojska nebo nepokoje, a to je znak krize.",
    E: "Julius Caesar nebyl císař, ale diktátor. Prvním císařem se stal Augustus až po těchto bojích, takže jde ještě o krizi republiky.",
  },
};

function faze(
  q: string,
  key: "K" | "R" | "C",
  hints: [string, string],
  explanation: string,
  opt: { otazka?: string; fb?: Partial<Record<Faze, string>> } = {},
): Uloha {
  const others = (Object.keys(FAZE) as Faze[]).filter((f) => f !== key);
  return {
    q: `${q} ${opt.otazka ?? "Kdy se to v římských dějinách dělo?"}`,
    key: FAZE[key],
    d: others.map((f) => [FAZE[f], opt.fb?.[f] ?? FAZE_FB[key][f]!]),
    hints,
    explanation,
  };
}

// (b) pravomoc → úřad
const URAD = { T: "Tribun lidu", Ko: "Konzul", S: "Senátor", D: "Diktátor" } as const;
type Urad = keyof typeof URAD;
const URAD_FB: Record<Urad, Partial<Record<Urad, string>>> = {
  T: {
    Ko: "Konzul vedl stát a vojsko. Právo zakázat rozhodnutí na ochranu plebejců měl úředník, kterého si vymohli sami plebejové.",
    S: "Senátor jen radil v senátu a patřil většinou k bohatým rodům. Prosté občany chránil jiný úředník.",
    D: "Diktátor dostal moc v nouzi, aby zachránil stát. Ochrana plebejců byla úkolem jiného úřadu.",
  },
  D: {
    T: "Tribun lidu chránil plebejce vetem. Velení nad celým státem v nouzi nedostával.",
    Ko: "Konzulové byli dva, vládli rok a navzájem se hlídali. Jeden muž s mimořádnou mocí nanejvýš na šest měsíců je jiný úřad.",
    S: "Senátorů bylo kolem tří set a jen radili. Mimořádnou moc jednoho muže svěřoval senát někomu jinému.",
  },
  Ko: {
    T: "Tribun lidu hájil plebejce, vojsku nevelel a stát nevedl.",
    S: "Senátor nebyl volený na rok a vojsku nevelel. Zasedal v radě a doporučoval.",
    D: "Diktátor byl vždy jen jeden a jmenoval se jen v nouzi. Dva úředníci na rok jsou jiný úřad.",
  },
  S: {
    T: "Tribun lidu byl volený úředník plebejců, ne člen rady z bohatých rodů.",
    Ko: "Konzul byl volený úředník na jeden rok, který vedl stát. Rada, která mu doporučovala, se skládala z jiných mužů.",
    D: "Diktátor vládl sám v nouzi. Tady jde o člena rady, která jen doporučuje.",
  },
};

function urad(q: string, key: Urad, hints: [string, string], explanation: string): Uloha {
  const others = (Object.keys(URAD) as Urad[]).filter((u) => u !== key);
  return { q, key: URAD[key], d: others.map((u) => [URAD[u], URAD_FB[key][u]!]), hints, explanation };
}

// (c) chronologie výběrem — rank-tabulka událostí
interface Udalost {
  label: string; // možnost
  veta: string; // věta do zadání (s datací)
  nazev: string; // krátký opis do nápovědy (není shodný s možností)
  rok: number; // př. n. l.
}
const UD: Udalost[] = [
  { label: "Založení Říma podle pověsti", veta: "Řím byl podle pověsti založen roku 753 př. n. l.", nazev: "pověst o vlčici a dvojčatech", rok: 753 },
  { label: "Vyhnání posledního krále", veta: "Římané vyhnali posledního krále asi roku 510 př. n. l.", nazev: "konec vlády králů", rok: 510 },
  { label: "Sepsání Zákonů dvanácti desek", veta: "Zákony dvanácti desek vznikly kolem roku 450 př. n. l.", nazev: "desky se zákony", rok: 450 },
  { label: "Zničení Kartága Římany", veta: "Římané srovnali Kartágo se zemí roku 146 př. n. l.", nazev: "pád Kartága", rok: 146 },
  { label: "Začátek Spartakova povstání", veta: "Spartakovo povstání vypuklo roku 73 př. n. l.", nazev: "vzpoura otroků", rok: 73 },
  { label: "Caesarovo překročení Rubikonu", veta: "Caesar vedl vojsko přes Rubikon roku 49 př. n. l.", nazev: "cesta vojska přes hraniční řeku", rok: 49 },
  { label: "Zavraždění Julia Caesara", veta: "Julius Caesar zemřel rukou spiklenců roku 44 př. n. l.", nazev: "smrt diktátora", rok: 44 },
];
/** Datace s povinnou výhradou (pověst / asi / kolem). */
const datace = (u: Udalost) =>
  u.rok === 753 ? `podle pověsti ${u.rok} př. n. l.` : u.rok === 510 ? `asi ${u.rok} př. n. l.` : u.rok === 450 ? `kolem ${u.rok} př. n. l.` : `${u.rok} př. n. l.`;

function poradi(idx: [number, number, number, number], smer: "nejdříve" | "nejpozději"): Uloha {
  const ev = idx.map((i) => UD[i]);
  // v zadání neřadit chronologicky
  const vZadani = [ev[2], ev[0], ev[3], ev[1]];
  const key = smer === "nejdříve" ? ev.reduce((m, e) => (e.rok > m.rok ? e : m)) : ev.reduce((m, e) => (e.rok < m.rok ? e : m));
  const opacny = smer === "nejdříve" ? ev.reduce((m, e) => (e.rok < m.rok ? e : m)) : ev.reduce((m, e) => (e.rok > m.rok ? e : m));
  const seznam = vZadani.map((e) => e.nazev);
  const seznamText = `${seznam.slice(0, 3).join(", ")} a ${seznam[3]}`;
  return {
    q: `Víme, že ${vZadani[0].veta}, ${vZadani[1].veta}, ${vZadani[2].veta} a ${vZadani[3].veta} Která z těchto událostí proběhla ${smer}?`,
    key: key.label,
    d: ev
      .filter((e) => e !== key)
      .map((e): [string, string] => [
        e.label,
        e === opacny
          ? `Tady se letopočet četl jako v našem letopočtu, kde vyšší číslo znamená později. Před naším letopočtem se roky počítají pozpátku, vyšší číslo je starší. Tahle událost (${datace(e)}) proběhla ze všech ${smer === "nejdříve" ? "nejpozději" : "nejdříve"}.`
          : smer === "nejdříve"
            ? `Tahle událost (${datace(e)}) má menší číslo než ${datace(key)}, a před naším letopočtem to znamená, že proběhla později.`
            : `Tahle událost (${datace(e)}) má větší číslo než ${datace(key)}, a před naším letopočtem to znamená, že proběhla dříve.`,
      ]),
    hints: [
      `Porovnáváš tyto události: ${seznamText}. Všechny proběhly před naším letopočtem. Znamená tam větší číslo roku dřív, nebo později?`,
      `Před naším letopočtem se roky počítají pozpátku směrem k narození Krista, takže čím větší číslo, tím dál v minulosti. Vypiš si ze zadání čísla let u událostí ${seznamText} a vyber tu, jejíž číslo je ${smer === "nejdříve" ? "největší" : "nejmenší"}.`,
    ],
    explanation: `Před naším letopočtem se roky počítají pozpátku, takže vyšší číslo znamená dřívější událost. ${smer === "nejdříve" ? "Nejvyšší" : "Nejnižší"} číslo má ${key.nazev} (${datace(key)}), proto je správně „${key.label}“.`,
    steps: [
      `Letopočty v zadání (od nejstaršího): ${[...ev].sort((a, b) => b.rok - a.rok).map(datace).join("; ")}`,
      "Před n. l. platí: vyšší číslo = starší událost.",
      `${smer === "nejdříve" ? "Nejstarší" : "Nejmladší"} je událost „${key.label}“.`,
    ],
  };
}

const L2: Uloha[] = [
  faze(
    "Městu vládne jeden muž doživotně a po jeho smrti nastoupí další vládce.",
    "K",
    [
      "Všimni si, jak dlouho tu jeden muž vládne. Ve kterém období Římané ještě neznali úřady s omezenou dobou?",
      "Omezení moci na rok přišlo, až když Římané vyhnali vládce, a císaři přišli až na samém konci. Vláda jednoho muže až do smrti, na kterou navazuje další, patří na úplný začátek dějin města.",
    ],
    "Jeden doživotní vládce, po kterém nastoupí další, je znak království. Tak Řím podle tradice vedlo sedm králů, dokud Římané asi roku 510 př. n. l. nevyhnali Tarquinia Pyšného. Císařství přišlo až po republice.",
  ),
  faze(
    "Malé město řídí panovník s radou starších a prostí lidé ještě nemají žádné vlastní úředníky.",
    "K",
    [
      "Kdo tu rozhoduje? Jeden panovník a lidé bez vlastních úředníků. Do kterého období to patří?",
      "Vlastní úředníky si prostí lidé vymohli až po vyhnání vládce, kdy vládli volení úředníci. Císařství přišlo mnohem později, kdy už Řím nebyl malé město. Hledej nejstarší období.",
    ],
    "Malé město s panovníkem a radou starších, kde prostí lidé nemají vlastní úředníky, je Řím v době království. Tribuny lidu si plebejové vymohli až v republice.",
  ),
  faze(
    "Jediný vládce rozhoduje o válce i o soudech a jeho moc žádná lhůta neomezuje. Podle tradice jich město mělo sedm za sebou.",
    "K",
    [
      "Počet sedm vládců za sebou je silná stopa. Který typ vlády měl Řím na začátku?",
      "Úředníci republiky se střídali po roce, takže moc měli omezenou lhůtou. Císaři vládli až po republice a ten počet k nim nepatří. Vzpomeň si, kolik panovníků podle tradice vládlo před vznikem republiky.",
    ],
    "Sedm vládců bez časového omezení moci je tradiční počet římských králů. Jde tedy o dobu království, která skončila vyhnáním Tarquinia Pyšného.",
  ),
  faze(
    "Římané vyhnali vládce, který si počínal krutě. Od té doby si každý rok volili dva nejvyšší úředníky.",
    "R",
    [
      "Otázka se ptá na každoroční volby, ne na vládu vyhnaného vládce. Ve kterém období drželi moc dva úředníci volení na rok?",
      "Doba jednoho vládce vyhnáním skončila a krize s vojevůdci přišla až o staletí později. Císaře Řím ještě dlouho mít nebude. Hledej období, které vyhnáním vládce začalo a ve kterém úřady ještě fungovaly.",
    ],
    "Vyhnáním posledního krále (asi 510 př. n. l.) doba králů skončila a začala republika. Volba dvou konzulů na rok patří do republiky, kdy úřady ještě fungovaly. Moc se dělila, aby ji nikdo nezískal natrvalo.",
    {
      otazka: "Kdy se takové volby v římských dějinách konaly?",
      fb: {
        K: "Doba králů vyhnáním vládce skončila. Každoroční volby dvou úředníků přišly až po ní.",
        C: "Volby dvou konzulů na rok začaly hned po vyhnání krále. Krize s Grakchy a vojevůdci přišla o staletí později.",
      },
    },
  ),
  faze(
    "Plebejové si vymohli vlastní úředníky, kteří mohou zakázat rozhodnutí poškozující prosté lidi.",
    "R",
    [
      "Prostí lidé tu získávají ochranu přes nové úředníky. Ve kterém období se moc takhle dělila?",
      "Za králů prostí lidé vlastní úředníky neměli a v krizi rozhodovala spíš síla vojsk. Hledej období, kdy si plebejové postupně vybojovali práva a moc se dělila mezi několik úřadů.",
    ],
    "Tribuny lidu s právem veta si plebejové vymohli v době republiky. Byla to jedna z pojistek, aby bohatí patricijové nemohli rozhodovat sami.",
  ),
  faze(
    "Stát poprvé sepíše zákony a vystaví je na náměstí, aby je znali i obyčejní občané.",
    "R",
    [
      "Sepsané a veřejné zákony chrání obyčejné lidi před libovůlí mocných. Ve kterém období Římané takové zákony poprvé sepsali?",
      "Za králů rozhodoval vládce a zákony se nesepisovaly. Krize přišla až po staletích. Vzpomeň si na desky se zákony a na to, kdo si jejich sepsání vymohl po konci vlády králů.",
    ],
    "Zákony dvanácti desek vznikly kolem roku 450 př. n. l. v době republiky. Vymohli si je plebejové, aby patricijové nemohli zákony vykládat, jak se jim hodí.",
  ),
  faze(
    "Válku s Kartágem řídí senát a vojska vedou konzulové volení na jeden rok.",
    "R",
    [
      "Kdo tu rozhoduje o válce? Senát a volení úředníci. Do kterého období to patří?",
      "Za králů senát jen radil panovníkovi a krize nastala, až když vojevůdci přestali poslouchat senát. Hledej dobu, kdy se Řím díky fungujícím úřadům dokázal ubránit Kartágu.",
    ],
    "Punské války s Kartágem vedla republika: rozhodoval senát a vojska vedli konzulové volení na rok. Úřady tehdy ještě fungovaly, krize přišla později.",
  ),
  faze(
    "Dva bratři, tribunové lidu, chtějí rozdělit státní půdu chudým. Nejdřív jeden a o několik let později i druhý zahyne v nepokojích, které proti nim rozpoutali bohatí statkáři.",
    "C",
    [
      "Spory o půdu tu končí násilím a smrtí úředníků. Co takové násilí prozrazuje o stavu státu?",
      "Tribunové už existují, takže doba králů nepřipadá v úvahu, a císaři přišli až po republice. Když se politické spory začnou řešit vraždami, dělení moci přestává fungovat. Jak se tomu období říká?",
    ],
    "Smrt bratří Grakchů v nepokojích kvůli půdě ukázala, že spory se už neřeší zákony, ale násilím. Tím začala krize republiky.",
  ),
  faze(
    "Vojáci slouží celé roky pod jedním vojevůdcem a poslouchají víc jeho než senát.",
    "C",
    [
      "Komu tu vojáci patří? Když vojsko poslouchá vojevůdce a ne stát, je to zdravý stav?",
      "Za fungujících úřadů velel vojsku konzul jen rok a pak se vrátil. Císař přišel až potom. Když má vojevůdce vlastní věrné vojsko, může ho obrátit proti státu. Ve kterém období se to dělo?",
    ],
    "Vojsko věrné svému vojevůdci, a ne senátu, je typický znak krize republiky. Vojevůdci jako Caesar nebo Pompeius pak s těmito vojsky bojovali o moc.",
  ),
  faze(
    "Otroci pod vedením gladiátora povstanou a dva roky porážejí římská vojska v Itálii.",
    "C",
    [
      "Vzpomeň si, kdo vedl vzpouru otroků a kdy to bylo. Stát, který nezvládne vzpouru ve vlastní zemi, je v dobrém stavu?",
      "Za králů byl Řím malé město bez velkých statků plných otroků a císař přišel až po republice. Velké povstání otroků v Itálii patří do posledního století před naším letopočtem. Jak se ta doba nazývá?",
    ],
    "Spartakovo povstání (73–71 př. n. l.) proběhlo v posledním století republiky. Ukázalo, jak nespokojení jsou otroci na velkých statcích, a patří ke krizi republiky.",
  ),
  faze(
    "Tři mocní muži si tajnou dohodou rozdělí vliv ve státě, aby prosadili, co chtějí.",
    "C",
    [
      "Tady o státě rozhoduje soukromá dohoda tří mužů, ne volené úřady. Co to vypovídá o stavu republiky?",
      "Za králů vládl jeden muž a za fungujících úřadů rozhodoval senát s úředníky. Když si moc rozdělí soukromí spojenci mimo úřady, dělení moci přestává fungovat. Ve kterém období se to stalo?",
    ],
    "Dohoda Caesara, Pompeia a Crassa (první triumvirát) obešla úřady republiky. Je to znak krize republiky, ne císařství: Caesar se císařem nikdy nestal.",
  ),
  faze(
    "Vojevůdce překročí s vojskem hraniční řeku, porazí svého soupeře v občanské válce a nechá se jmenovat diktátorem bez časového omezení.",
    "C",
    [
      "Diktátor měl vládnout jen krátce v nouzi. Co znamená, když si někdo tuto moc ponechá bez omezení?",
      "Za králů úřad diktátora neexistoval a prvním císařem byl až jiný muž. Tady vojevůdce silou vojska rozbil dělení moci, ale formálně je ještě diktátor. Ve kterém období se to odehrálo?",
    ],
    "Caesar překročil Rubikon, v občanské válce porazil Pompeia a stal se doživotním diktátorem. To je vrchol krize republiky. Císařem nebyl, prvním císařem se stal až Augustus.",
  ),
  urad(
    "Úředník smí zakázat rozhodnutí, které by poškodilo chudé občany. O koho jde?",
    "T",
    [
      "Zaměř se na to, koho úředník chrání. Který úřad si vymohli prostí lidé pro svou ochranu?",
      "Nejvyšší úředníci vedli stát a vojsko, člen rady jen doporučoval a mimořádný vládce v nouzi zachraňoval celý stát. Hledej úřad, jehož hlavní zbraní bylo slovo veto, tedy zakazuji.",
    ],
    "Právo veta na ochranu plebejců měl tribun lidu. Mohl zastavit rozhodnutí úředníků i senátu, když poškozovalo prosté lidi.",
  ),
  urad(
    "Plebejové si vymohli úředníka, který jejich zájmy hájí proti patricijům, a kdo by mu ublížil, propadl smrti. O koho jde?",
    "T",
    [
      "Kdo si tento úřad vymohl a proti komu měl chránit? Takový úřad nevznikl pro bohaté rody.",
      "Rada bývalých úředníků se skládala z bohatých rodů, zpočátku hlavně z patricijů, a nejvyšší úředníci vedli celý stát. Mimořádný vládce v nouzi nechránil jednu skupinu. Hledej úředníka voleného plebejci, jehož osoba byla nedotknutelná.",
    ],
    "Úředník, kterého si vymohli plebejové a jehož osoba byla nedotknutelná, byl tribun lidu. Chránil plebejce proti patricijům právem veta.",
  ),
  urad(
    "Když Římu hrozí velké nebezpečí, dostane jeden muž mimořádnou moc, ale nejvýš na půl roku. O koho jde?",
    "D",
    [
      "Rozhodující je, že moc dostane jediný muž, a to jen v nouzi. Jak se takový úřad jmenoval?",
      "Nejvyšší úředníci byli vždy dva, člen rady moc neměl a ochránce plebejců nevládl státu. Hledej úřad, jehož název dnes označuje vládce s neomezenou mocí, přestože v Římě byl časově omezený.",
    ],
    "Jediného muže s mimořádnou mocí nanejvýš na šest měsíců jmenovali Římané v nouzi. Byl to diktátor. Po zažehnání nebezpečí musel moc vrátit.",
  ),
  urad(
    "Nepřítel stojí u hranic a stát svěří jedinému muži velení nad vším. Nejpozději po šesti měsících musí moc vrátit. O koho jde?",
    "D",
    [
      "Jeden muž, veškerá moc, přísná lhůta. Který úřad republika používala jen výjimečně?",
      "Dva nejvyšší úředníci se o moc dělili, člen rady jen radil a tribun hájil prosté lidi. Když šlo o záchranu státu, dostal výjimečně moc jediný muž. Jak se ten úřad jmenoval? Jeho název se používá dodnes.",
    ],
    "Velení nad vším nanejvýš na šest měsíců dostával v nouzi diktátor. Lhůta měla zabránit, aby se z něj stal nový král.",
  ),
  urad(
    "Římané každý rok volí dva nejvyšší úředníky, kteří velí vojsku a vedou stát. Jak se nazývá každý z nich?",
    "Ko",
    [
      "Dva úředníci a jen na rok. Jak se jmenoval nejvyšší úřad republiky?",
      "Mimořádný vládce byl vždy jen jeden, člen rady nevelel vojsku a ochránce plebejců stát nevedl. Hledej název úředníků, podle kterých Římané dokonce pojmenovávali roky.",
    ],
    "Dva nejvyšší úředníci volení na rok byli konzulové. Vedli stát i vojsko a navzájem se hlídali.",
  ),
  urad(
    "Válku proti Kartágu vede jeden ze dvou nejvyšších úředníků volených na rok. Jak se takový úředník nazývá?",
    "Ko",
    [
      "Kdo v republice velel vojskům? Všimni si, že nejvyšší úředníci byli dva a volili se na rok.",
      "Mimořádný vládce se jmenoval jen v nouzi a vždy sám, členové rady vojsku nevelili a tribun hájil plebejce. Hledej úřad, který vedl republiku v míru i ve válce vždy po dvojicích.",
    ],
    "Vojska v punských válkách vedli hlavně konzulové, dva nejvyšší úředníci volení na rok. Zkušeným velitelům senát někdy velení prodloužil.",
  ),
  urad(
    "Muž, který dříve zastával vysoký úřad, zasedá v radě, jež schvaluje peníze státu a jedná s cizími posly. O koho jde?",
    "S",
    [
      "Tento muž už úřad nezastává, ale zasedá v radě. Jak se nazýval člen té rady?",
      "Volení úředníci měli moc jen po omezenou dobu, mimořádný vládce vládl sám a tribun chránil plebejce. Hledej člena stálé rady bývalých úředníků, která rozhodovala o penězích a jednala s cizinou.",
    ],
    "Bývalí úředníci zasedali v senátu a byli to senátoři. Senát schvaloval peníze, jednal s cizími státy a radil konzulům.",
  ),
  urad(
    "Člen sboru převážně z bohatých a urozených rodů, jehož doporučení úředníci obvykle poslechli. O koho jde?",
    "S",
    [
      "Nejde o úředníka, ale o člena sboru, který doporučuje. Jak se takový člen nazýval?",
      "Úředník plebejců hájil prosté lidi, mimořádný vládce doporučení nedával a nejvyšší úředníci ho naopak dostávali. Hledej člena nejvážnější rady republiky.",
    ],
    "Sbor bohatých rodů, jehož rady úředníci poslouchali, byl senát a jeho člen senátor. Formálně jen doporučoval, ve skutečnosti měl velkou moc.",
  ),
  poradi([1, 3, 5, 6], "nejdříve"),
  poradi([2, 3, 4, 6], "nejdříve"),
  poradi([3, 4, 5, 6], "nejdříve"),
  poradi([0, 2, 4, 5], "nejdříve"),
  poradi([1, 2, 4, 6], "nejdříve"),
  poradi([2, 3, 5, 6], "nejdříve"),
  poradi([0, 1, 3, 4], "nejpozději"),
  poradi([0, 2, 3, 5], "nejpozději"),
  poradi([1, 2, 3, 6], "nejpozději"),
  poradi([0, 1, 2, 3], "nejpozději"),
  poradi([1, 3, 4, 5], "nejpozději"),
  poradi([2, 4, 5, 6], "nejpozději"),
];

// ── L3 — analýza (příčina, důsledek, výpočet trvání) ───────────────────────
/** Odčítání po řádech bez vypůjčení: v každém řádu menší číslice od větší. */
function poRadech(a: number, b: number): number {
  const sa = String(a), sb = String(b).padStart(sa.length, "0");
  return Number([...sa].map((c, i) => Math.abs(Number(c) - Number(sb[i]))).join(""));
}

function trvani(q: string, a: Udalost, b: Udalost, zhruba: boolean): Uloha {
  const n = a.rok - b.rok;
  const bezVypujceni = poRadech(a.rok, b.rok);
  const d: [string, string][] = [
    [pad(a.rok + b.rok, "ROK"), `Tady se letopočty sečetly (${a.rok} + ${b.rok}). Sčítá se jen tehdy, když jedna událost leží před naším letopočtem a druhá po něm. Obě tyto události jsou před naším letopočtem, proto se odčítá.`],
    [pad(n - 1, "ROK"), "Tady se od rozdílu ubral jeden rok za chybějící rok 0. To se dělá jen při přechodu přes přelom letopočtu. Obě události leží před naším letopočtem, a tak stačí odečíst."],
    bezVypujceni !== n
      ? [pad(bezVypujceni, "ROK"), `Tady se v každém řádu odečetla menší číslice od větší, bez vypůjčení z vyššího řádu. U ${a.rok} − ${b.rok} je potřeba si při odčítání půjčit.`]
      : [pad(n + 1, "ROK"), "Tady se přičetl jeden rok navíc. Rozdíl letopočtů už sám udává, kolik let uplynulo."],
  ];
  return {
    q,
    key: pad(n, "ROK"),
    d,
    hints: [
      `Obě události, ${a.nazev} i ${b.nazev}, leží před naším letopočtem. Mají se letopočty v takovém případě sčítat, nebo odečítat?`,
      `Na stejné straně od narození Krista se od vyššího letopočtu odečte nižší, tedy ${a.rok} − ${b.rok}. Nic nepřičítej ani neubírej za rok 0, přelom letopočtu tu nepřekračuješ. Počítej pečlivě po řádech a kde je potřeba, vypůjč si z vyššího řádu.`,
    ],
    explanation: `Obě události jsou před naším letopočtem, proto se letopočty odečítají: ${a.rok} − ${b.rok} = ${n}. Uplynulo ${zhruba ? "zhruba " : ""}${pad(n, "ROK")}. Sčítalo by se jen tehdy, kdyby jedna událost ležela před naším letopočtem a druhá po něm.`,
    steps: [
      `Obě data (${datace(a)} a ${datace(b)}) leží před n. l., proto se odčítá, nesčítá.`,
      `Mezivýsledek: ${a.rok} − ${b.rok} = ${n}.`,
      `Výsledek: ${zhruba ? "zhruba " : ""}${pad(n, "ROK")}.`,
    ],
  };
}

const L3: Uloha[] = [
  trvani("Poslední král byl z Říma vyhnán asi roku 510 př. n. l. a Julius Caesar byl zavražděn roku 44 př. n. l. Kolik let zhruba uplynulo mezi těmito událostmi?", UD[1], UD[6], true),
  trvani("Řím byl podle pověsti založen roku 753 př. n. l. a posledního krále Římané vyhnali asi roku 510 př. n. l. Jak dlouho zhruba trvalo římské království?", UD[0], UD[1], true),
  trvani("Zákony dvanácti desek sepsali Římané kolem roku 450 př. n. l. a Kartágo padlo roku 146 př. n. l. Kolik let zhruba dělí tyto dvě události?", UD[2], UD[3], true),
  trvani("Římané zničili Kartágo roku 146 př. n. l. Kolik let nato byl zavražděn Julius Caesar (44 př. n. l.)?", UD[3], UD[6], false),
  trvani("Spartakovo povstání vypuklo roku 73 př. n. l. Kolik let nato zemřel Julius Caesar rukou spiklenců (44 př. n. l.)?", UD[4], UD[6], false),
  trvani("Kolik let uplynulo od zničení Kartága (146 př. n. l.) do chvíle, kdy Caesar přešel s vojskem Rubikon (49 př. n. l.)?", UD[3], UD[5], false),
  {
    q: "Po zkušenosti s posledním králem začali Římané volit dva nejvyšší úředníky na jediný rok. Čemu tím chtěli zabránit?",
    key: "Aby moc nezískal natrvalo jediný člověk",
    d: [
      ["Aby měli dost velitelů na válku s Kartágem", "Punské války přišly až o víc než dvě stě let později. Dva úředníci na rok byli odpovědí na zkušenost s králem."],
      ["Aby všichni občané rozhodovali přímo jako v Athénách", "Jednání všech občanů o všem na sněmu je znak aténské demokracie. V Římě lidová shromáždění volila úředníky a hlasovala o zákonech, ale vládli volení úředníci a senát."],
      ["Aby patricijové ztratili všechnu moc ve státě", "Patricijové naopak v rané republice ovládali úřady i senát. Opatření mířilo proti jedinému vládci."],
    ],
    hints: [
      "Přemýšlej, co se Římanům na vládě posledního krále nelíbilo. Jak pomůže, když jsou úředníci dva a jen na rok?",
      "Válka s Kartágem přišla až o staletí později, přímé rozhodování všech občanů patří do Athén a patricijové si moc naopak udrželi. Dva úředníci se navzájem hlídají a krátká lhůta brání tomu, aby si někdo moc ponechal.",
    ],
    explanation: "Římané měli zkušenost s krutým Tarquiniem Pyšným. Proto rozdělili nejvyšší moc mezi dva konzuly (jeden mohl zastavit druhého) a omezili ji na rok. Tak nikdo nemohl získat moc natrvalo a stát se novým králem.",
  },
  {
    q: "Drobní rolníci po dlouhých válkách přišli o půdu a odcházeli do Říma. Co z toho pro republiku vyplynulo?",
    key: "Přibylo chudiny a vojáci začali poslouchat hlavně své vojevůdce",
    d: [
      ["Přibylo otroků na statcích a plebejové si proto vymohli tribuny lidu", "Otroků na statcích opravdu přibylo, ale tribuny lidu měli plebejové už od rané republiky, staletí před touto krizí. Tady se zaměnila příčina i doba."],
      ["Přibylo patricijů, protože rolníci zbohatli z válečné kořisti", "Rolníci naopak zchudli a o půdu přišli. Patricijem se navíc člověk rodil, nestával se jím."],
      ["Přibylo občanů, kteří pak rozhodovali o všem přímo jako v Athénách", "Řím nikdy neměl demokracii, kde by o všem jednali všichni občané na sněmu jako v Athénách. Chudina bez půdy spíš ohrožovala pořádek v republice."],
    ],
    hints: [
      "Kdo dřív tvořil římské vojsko a z čeho žil? Co se stane, když tito lidé přijdou o půdu?",
      "Tribuny měli plebejové už dávno předtím, patricijem se člověk rodil a o všem na sněmu jako v Athénách Římané nejednali. Chudí bez půdy hledali obživu a vojsko se změnilo v armádu, která čekala odměnu od svého velitele. Co to znamenalo pro moc vojevůdců?",
    ],
    explanation: "Drobní rolníci tvořili jádro vojska. Když přišli o půdu, v Římě přibylo chudiny a vojáci začali sloužit za žold a odměnu od vojevůdce. Vojsko pak poslouchalo spíš vojevůdce než senát, a to vedlo ke krizi republiky.",
  },
  {
    q: "Který jev nejlépe ukazuje, že republika na konci přestávala fungovat?",
    key: "Vojevůdce táhne s vlastním vojskem na Řím",
    d: [
      ["Konzulové se po roce vystřídají s novými konzuly", "Pravidelné střídání konzulů je naopak znak, že republika funguje, jak má."],
      ["Tribun lidu zakáže zákon, který škodí plebejům", "Veto tribuna je řádná pojistka republiky. Ukazuje, že dělení moci funguje."],
      ["Senát radí konzulům, jak vést válku s Kartágem", "Senát radil konzulům po celou republiku. V době punských válek úřady ještě fungovaly."],
    ],
    hints: [
      "Tři možnosti popisují běžný chod úřadů. Hledej tu, která dělení moci porušuje.",
      "Střídání úředníků, veto na ochranu plebejců i rady senátu patří k tomu, jak republika měla fungovat. Rozbitá republika je ta, kde místo zákonů a úřadů rozhoduje síla. Co by to znamenalo pro vojsko?",
    ],
    explanation: "Když vojevůdce vede vlastní vojsko proti Římu, neposlouchá už senát ani zákony a o moci rozhoduje síla. To se stalo, když Caesar překročil Rubikon. Ostatní možnosti popisují normální chod republiky.",
  },
  {
    q: "Proč směl diktátor vládnout nanejvýš šest měsíců?",
    key: "Aby se z vládce v nouzi nestal nový král",
    d: [
      ["Aby se mohl střídat s druhým diktátorem jako konzulové", "Diktátor byl vždy jen jeden, to je rozdíl oproti dvěma konzulům. Lhůta měla jiný důvod."],
      ["Aby mohl po půl roce předat moc konzulům na zbytek války", "Předání moci konzulům bylo jen to, co po lhůtě následovalo. Důvodem lhůty byl strach, že si jeden muž mimořádnou moc ponechá."],
      ["Aby se senát mohl po půl roce rozhodnout, jestli ho ponechá doživotně", "Doživotní diktatura byla proti pravidlům republiky a senát ji běžně neuděloval. Až Caesar si ji vynutil silou svého vojska."],
    ],
    hints: [
      "Diktátor měl obrovskou moc. Čeho se Římané po zkušenosti s posledním králem báli nejvíc?",
      "Diktátor byl vždy jen jeden, předání moci konzulům bylo jen to, co po lhůtě následovalo, a doživotní moc republika nikomu dávat nechtěla. Úplná moc v rukou jednoho člověka je nebezpečná, když trvá dlouho. Co by mohlo nastat bez lhůty?",
    ],
    explanation: "Diktátor měl v nouzi úplnou moc. Krátká lhůta (nanejvýš šest měsíců) měla zajistit, že moc vrátí a nestane se z něj nový král. Když si Caesar diktaturu ponechal doživotně, republika se tím rozpadala.",
  },
  {
    q: "Proč si plebejové vymohli, aby římské zákony byly sepsané a vystavené na veřejnosti?",
    key: "Aby je patricijové nemohli vykládat, jak se jim hodí",
    d: [
      ["Aby mohli patricijům zakázat vstup do senátu", "Sepsané zákony patricije ze senátu nevyloučily. Šlo o to, aby všichni znali pravidla."],
      ["Aby král nemohl zákony měnit podle své vůle", "Zákony dvanácti desek vznikly v republice, kdy už Řím krále neměl."],
      ["Aby o zákonech mohl jednat a navrhovat je každý občan na sněmu jako v Athénách", "V Římě lidová shromáždění o zákonech hlasovala, ale návrhy předkládali jen úředníci. Sepsání zákonů mělo hlavně zajistit, aby pravidla znal každý."],
    ],
    hints: [
      "Kdo dřív znal zákony a soudil podle nich? Co se stane, když zákon zná jen soudce z bohatého rodu?",
      "Král už v té době nevládl, patricijové zůstali v senátu a navrhovat zákony smějí v Římě jen úředníci, ne každý občan jako v Athénách. Když je zákon napsaný a vystavený, každý si ho může přečíst. Komu to bránilo v libovůli?",
    ],
    explanation: "Zákony dřív znali a vykládali jen patricijové, a mohli je tak ohýbat ve svůj prospěch. Plebejové si proto kolem roku 450 př. n. l. vymohli Zákony dvanácti desek, vystavené veřejně, aby pravidla znal každý.",
  },
  {
    q: "Co následovalo, když Caesar roku 49 př. n. l. porušil zákon a vedl vojsko do Itálie?",
    key: "Začala občanská válka mezi Caesarem a Pompeiem",
    d: [
      ["Začala třetí punská válka a zničení Kartága", "Kartágo bylo zničeno roku 146 př. n. l., téměř o sto let dřív."],
      ["Začalo Spartakovo povstání otroků v Itálii", "Spartakovo povstání proběhlo v letech 73–71 př. n. l., tedy dřív."],
      ["Začalo římské císařství s Caesarem jako prvním císařem", "Caesar se nikdy nestal císařem, byl diktátorem. Prvním císařem byl až Augustus po Caesarově smrti."],
    ],
    hints: [
      "Proti komu Caesar s vojskem táhl? V Římě tehdy měl vliv jeho bývalý spojenec z triumvirátu.",
      "Kartágo padlo o sto let dřív a povstání otroků skončilo před více než dvaceti lety. Císařem se Caesar nikdy nestal. Když vojevůdce vede vojsko proti vlastnímu státu, bojují proti sobě Římané s Římany. Jak se takové válce říká?",
    ],
    explanation: "Překročením Rubikonu roku 49 př. n. l. porušil Caesar zákon a začala občanská válka s Pompeiem, kterou Caesar vyhrál. Kartágo padlo roku 146 př. n. l. a Spartakus bojoval v letech 73–71 př. n. l. Císařem Caesar nebyl.",
  },
  {
    q: "Proč vražda Caesara roku 44 př. n. l. republiku nezachránila?",
    key: "Protože o moc hned začali bojovat další vojevůdci",
    d: [
      ["Protože Caesar byl už korunovaný císař a měl nástupce", "Caesar nebyl císař, ale doživotní diktátor. Prvním císařem se stal až Augustus po dalších válkách."],
      ["Protože spiklenci sami chtěli vládnout jako noví králové", "Spiklenci naopak chtěli obnovit republiku, proto Caesara zabili. Nezachránili ji, protože vojska dál poslouchala vojevůdce."],
      ["Protože senát po vraždě hned zvolil Caesarova dědice císařem", "Senát nikoho hned císařem nezvolil. Caesarův dědic Octavianus získal moc až po dalších letech občanských válek."],
    ],
    hints: [
      "Spiklenci odstranili jednoho muže. Zmizela tím ale příčina krize: vojevůdci s věrnými vojsky?",
      "Spiklenci chtěli republiku obnovit, císařem Caesar nebyl a jeho dědic se k moci teprve musel probojovat. Vojska věrná vojevůdcům ale zůstala. Co asi udělali Caesarovi přátelé a další mocní muži, když se uvolnilo místo?",
    ],
    explanation: "Vražda Caesara neodstranila příčinu krize: vojska poslouchala vojevůdce, ne senát. Hned začaly další občanské války, ze kterých vyšel vítězně Caesarův dědic Octavianus, pozdější Augustus. Tím republika skončila.",
  },
  {
    q: "Který z těchto kroků nejvíc ohrozil dělení moci v republice?",
    key: "Caesar se nechal jmenovat diktátorem doživotně",
    d: [
      ["Plebejové si vymohli sepsané Zákony dvanácti desek", "Sepsané zákony naopak omezily libovůli mocných. Dělení moci posílily."],
      ["Konzul jmenoval v nouzi diktátora na půl roku", "Diktátor nanejvýš na šest měsíců byl řádná pojistka republiky pro dobu války."],
      ["Konzul předal po roce svůj úřad nástupci", "Předání úřadu po roce je přesně to, jak měla republika fungovat."],
    ],
    hints: [
      "Porovnej, jestli krok moc dělí a omezuje, nebo ji soustřeďuje u jednoho člověka bez lhůty.",
      "Sepsané zákony, diktátor s lhůtou i střídání úředníků moc omezovaly. Nebezpečný je krok, kterým jeden muž získá výjimečnou moc a nemusí ji nikdy vrátit. Který krok tuto pojistku zrušil?",
    ],
    explanation: "Diktátor měl vládnout nanejvýš šest měsíců. Když se Caesar nechal jmenovat diktátorem doživotně, zrušil hlavní pojistku republiky: časové omezení moci. Ostatní kroky moc dělily a omezovaly.",
  },
  {
    q: "Proč chtěli bratři Grakchové rozdělit státní půdu chudým rolníkům?",
    key: "Aby rolníci mohli znovu živit rodinu a sloužit ve vojsku",
    d: [
      ["Aby stát z nové půdy vybral víc daní na války", "Grakchům nešlo o daně. Chtěli, aby chudí rolníci měli z čeho žít a mohli znovu sloužit ve vojsku."],
      ["Aby otroci po Spartakově povstání dostali svobodu a půdu", "Grakchové působili zhruba o padesát až šedesát let dřív než Spartakus (133–121 př. n. l.) a půdu chtěli pro svobodné rolníky, ne pro otroky."],
      ["Aby plebejové získali místa v senátu", "Grakchové o místa v senátu neusilovali. Šlo jim o půdu, ze které by chudí rolníci uživili rodinu."],
    ],
    hints: [
      "Z koho se dřív skládalo římské vojsko? Rolník bez půdy neměl z čeho žít ani za co si koupit zbroj.",
      "Nešlo o daně ani o místa v senátu a Spartakus žil až později. Drobný rolník s vlastním polem uživil rodinu a mohl bránit stát. Co tedy chtěli bratři obnovit?",
    ],
    explanation: "Vojsko republiky tvořili drobní rolníci, kteří si sami kupovali zbroj. Když přišli o půdu, zchudli a nemohli sloužit. Grakchové chtěli dát rolníkům státní půdu, aby uživili rodiny a znovu tvořili vojsko.",
  },
  {
    q: "V čem se římská republika nejvíc lišila od aténské demokracie?",
    key: "Hlavně rozhodovali volení úředníci a senát",
    d: [
      ["Hlavně rozhodovali všichni občané přímo na sněmu", "Jednání všech občanů o všem na sněmu je popis aténské demokracie. V Římě shromáždění sice hlasovala, ale návrhy předkládali úředníci a velký vliv měl senát."],
      ["Hlavně rozhodoval doživotně jediný král s radou", "Doživotní král vládl v Římě jen v době království. Republika krále zrušila."],
      ["Hlavně rozhodovala dohoda tří mocných mužů", "Triumviráty vznikly až v krizi republiky. Běžná republika tak nefungovala."],
    ],
    hints: [
      "V Athénách rozhodovali občané přímo na sněmu. Kdo rozhodoval v Římě, když už tam nevládl král?",
      "Jednání všech občanů na sněmu je aténský vzor, král patří do doby před republikou a dohoda tří mužů do její krize. Hledej možnost, kde moc drží lidé zvolení na omezenou dobu a rada zkušených mužů.",
    ],
    explanation: "V Athénách rozhodovali všichni občané přímo na sněmu. V římské republice volili občané úředníky (konzuly, tribuny) a shromáždění hlasovala o zákonech, které navrhli úředníci. Velký vliv měl senát. Král patří do doby před republikou, triumvirát do její krize.",
  },
];

const zamichej = (s: Uloha[]) => pickN(s, s.length);

/** Střídá šablony: z každé skupiny (v daném pořadí) bere `po[i]` úloh za kolo, dokud něco zbývá. */
function proloz(skupiny: Uloha[][], po: number[]): Uloha[] {
  const fronty = skupiny.map((s) => [...s]);
  const out: Uloha[] = [];
  while (fronty.some((f) => f.length)) {
    fronty.forEach((f, i) => out.push(...f.splice(0, po[i])));
  }
  return out;
}

// Rozsahy bank podle šablony (pořadí v polích L2 a L3 výše).
const L2_SITUACE = L2.slice(0, 12);
const L2_URADY = L2.slice(12, 20);
const L2_DRIVE = L2.slice(20, 26);
const L2_POZDEJI = L2.slice(26, 32);
const L3_TRVANI = L3.slice(0, 6);
const L3_UVAHY = L3.slice(6);

function gen(level: number): PracticeTask[] {
  if (level === 1) return pickN(L1, L1.length).map(build);
  if (level === 2) {
    // v šestici sezení: 2 situace, 2 úřady, 2 chronologie (jedna „nejdříve“, jedna „nejpozději“)
    const poradi = proloz([zamichej(L2_DRIVE), zamichej(L2_POZDEJI)], [1, 1]);
    return proloz([zamichej(L2_SITUACE), zamichej(L2_URADY), poradi], [1, 1, 1]).map(build);
  }
  // v šestici sezení nanejvýš jeden výpočet trvání
  return proloz([zamichej(L3_UVAHY), zamichej(L3_TRVANI)], [5, 1]).map(build);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const VZNIK_RIMA_KRALOVSTVI_REPUBLIKA: TopicMetadata[] = [
  {
    id: "g6-dej-vznik-rima-republika-6",
    rvpNodeId: "g6-dejepis-starovek-antika-rim-vznik-rima-kralovstvi-republika-krize-republiky",
    displayName: "Vznik Říma, království a republika",
    title: "Vznik Říma, království, republika, krize republiky",
    studentTitle: "Jak se z malého města stala římská republika",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řím",
    briefDescription: "Romulus a Remus, králové, konzulové a senát, punské války a Caesar – co kdy.",
    keywords: [
      "Řím", "Romulus a Remus", "království", "Tarquinius Pyšný", "republika", "konzul", "senát",
      "tribun lidu", "diktátor", "patricijové", "plebejové", "Zákony dvanácti desek", "punské války",
      "Kartágo", "Hannibal", "Grakchové", "Spartakus", "triumvirát", "Rubikon", "Julius Caesar",
    ],
    goals: [
      "Zařadit událost, osobu nebo instituci raného Říma do království, republiky nebo krize republiky.",
      "Rozlišit úřady republiky: konzul, senát, tribun lidu, diktátor.",
      "Určit pořadí událostí a spočítat trvání přes letopočty před naším letopočtem.",
      "Vysvětlit, proč republika dělila moc a proč se v krizi rozpadala.",
    ],
    boundaries: [
      "Založení Říma 753 př. n. l. jen jako údaj podle pověsti; vyhnání krále a Dvanáct desek jen přibližně.",
      "Augustus a císařství patří do sousedního tématu, tady jen jako distraktor.",
      "Letopočty vždy před naším letopočtem, jen celá čísla, bez přechodu přes přelom letopočtu.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Království: podle pověsti od 753 př. n. l., vyhnání Tarquinia Pyšného asi 510 př. n. l. Republika: dva konzulové na rok, senát, tribun lidu s vetem, diktátor v nouzi nanejvýš na 6 měsíců, Zákony dvanácti desek kolem 450 př. n. l., punské války (Kartágo zničeno 146 př. n. l.). Krize: Grakchové, Spartakus 73–71, triumvirát, Rubikon 49, vražda Caesara 44 př. n. l.",
      steps: [
        "Najdi v zadání jméno, úřad nebo letopočet.",
        "Rozhodni, jestli vládne jeden muž (království), volení úředníci (republika), nebo vojevůdci silou (krize).",
        "U letopočtů před n. l. pamatuj: vyšší číslo = dřív, rozdíl se odečítá.",
        "U příčin ověř, že příčina proběhla dřív než to, co způsobila.",
      ],
      commonMistake: "Považovat Caesara za prvního císaře, nebo si myslet, že 44 př. n. l. bylo dřív než 146 př. n. l., protože má menší číslo.",
      example: `Kartágo zničeno 146 př. n. l., Caesar zavražděn 44 př. n. l.: 146 − 44 = 102, Kartágo padlo o ${pad(102, "ROK")} dřív.`,
    },
  },
];
