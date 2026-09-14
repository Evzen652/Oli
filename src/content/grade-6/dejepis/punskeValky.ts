/**
 * Dějepis 6. ročník — Punské války a dobytí Středomoří (select_one).
 *
 * Faktický vzor (reckoPerskeValkyPeloponeskaValka / periodizaceLetopocet): pevné
 * banky úloh, každá s vlastní malou i velkou nápovědou, vysvětlením PROČ
 * a optionFeedback. Generátor vrací celou banku zamíchanou, takže na každé
 * úrovni je deterministicky ≥ 12 různých úloh.
 *
 * Chybový model — každý distraktor je jeden typický omyl:
 *  1. záměna stran a osobností (Hannibal × Scipio, Hamilkar a Cato na špatném místě);
 *  2. letopočty př. n. l. čtené jako n. l. (vyšší číslo = později), sčítání místo
 *     odečítání, rok navíc nebo ubraný, zapomenutá vypůjčená desítka;
 *  3. slavná bitva = vítězství (Kanny brány jako úspěch Říma, Hannibal jako vítěz války);
 *  4. smíchání válek a epoch (Sicílie × Alpy × zničení Kartága; Caesar, Alexandr
 *     Veliký, řecko-perské války; Kartágo řazené do Řecka nebo na Sicílii).
 *
 *  • L1 — zapamatování: jedna vazba fakt → fakt, otázka se ptá jménem nebo pojmem.
 *  • L2 — použití: popis bez jména → válka / osoba / bitva; pořadí a rozdíl letopočtů.
 *  • L3 — analýza: příčina, důsledek, paradox, výrok, srovnání, „co by“.
 *
 * Sporné údaje (počty slonů a vojáků, padlí u Kann, solení půdy, Hannibalova
 * přísaha, rok založení Kartága) na klíč nejdou.
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
    q: "Kdo byl Hannibal?",
    key: "Kartaginský vojevůdce",
    d: [
      ["Římský vojevůdce", "Hannibal bojoval proti Římu, ne za něj. Římským vojevůdcem, který ho porazil, byl Scipio."],
      ["Řecký vojevůdce", "Hannibal nebyl Řek. Pocházel z města, které leželo v severní Africe a soupeřilo s Římem."],
      ["Římský senátor", "V římském senátu mluvil proti Kartágu Cato starší. Hannibal stál na opačné straně."],
    ],
    hints: [
      "Rozmysli si, na které straně Hannibal v punských válkách stál: za Řím, nebo proti němu?",
      "Hannibal vedl vojsko se slony přes Alpy a u Kann porazil Římany. Z kterého města pocházel člověk, který takhle napadl Itálii?",
    ],
    explanation: "Hannibal byl kartaginský vojevůdce ve 2. punské válce. Vedl vojsko přes Alpy do Itálie a porazil Římany u Kann, až ho roku 202 př. n. l. porazil Říman Scipio u Zamy.",
  },
  {
    q: "Který národ založil Kartágo?",
    key: "Féničané",
    d: [
      ["Řekové", "Řekové zakládali osady hlavně na Sicílii a v jižní Itálii. Kartágo založil jiný národ mořeplavců."],
      ["Římané", "Římané Kartágo nezaložili, naopak ho roku 146 př. n. l. zničili."],
      ["Egypťané", "Kartágo sice leželo v Africe, ale Egypťané ho nezaložili. Založili ho mořeplavci z východního pobřeží Středozemního moře."],
    ],
    hints: [
      "Římané Kartagince nazývali Punové. To slovo v latině označuje národ, odkud zakladatelé přišli.",
      "Římané Kartágo nezaložili, naopak ho zničili. Hledej národ zkušených mořeplavců a obchodníků z východního pobřeží Středozemního moře, který vynalezl hláskové písmo.",
    ],
    explanation: "Kartágo založili Féničané, mořeplavci z východního pobřeží Středozemního moře. Proto Římané Kartagincům říkali Punové (latinsky Féničané) a války s nimi se nazývají punské.",
  },
  {
    q: "Kde leželo Kartágo?",
    key: "Na pobřeží severní Afriky",
    d: [
      ["Na ostrově Sicílii", "O Sicílii se Řím s Kartágem přel v 1. punské válce, ale samotné Kartágo tam neleželo."],
      ["Na jihu Řecka", "Na jihu Řecka ležela Sparta nebo Korint. Kartágo bylo mimo Evropu."],
      ["Na pobřeží Fénicie", "Z Fénicie pocházeli zakladatelé Kartága, ale město postavili daleko na západě, v jiném světadílu."],
    ],
    hints: [
      "Hledej místo, kam se Scipio musel s vojskem přeplavit, aby Kartágo ohrozil. Leží v dnešním Tunisku.",
      "Sicílie byla předmětem sporu, ne sídlem Kartága. Vezmi si mapu Středomoří a hledej, co leží naproti Sicílii přes moře, v jiném světadílu než Řím.",
    ],
    explanation: "Kartágo leželo na pobřeží severní Afriky, v dnešním Tunisku. Založili ho Féničané z Fénicie, ale daleko na západě. Sicílie ležela mezi Kartágem a Itálií, a proto se o ni vedla první válka.",
  },
  {
    q: "O který ostrov se vedla 1. punská válka?",
    key: "Sicílie",
    d: [
      ["Kréta", "Kréta leží v Egejském moři u Řecka a s punskými válkami nesouvisí. Mínojská Kréta patří do mnohem starší doby."],
      ["Kypr", "Kypr leží na východě Středozemního moře, daleko od Říma i Kartága."],
      ["Rhodos", "Rhodos je řecký ostrov v Egejském moři. Řím s Kartágem soupeřil o ostrov na západě."],
    ],
    hints: [
      "Hledej velký ostrov, který leží přímo mezi Itálií a severní Afrikou.",
      "Rhodos leží v Egejském moři u Řecka, daleko od obou soupeřů. U ostatních si na mapě ověř, jak daleko leží od Itálie a od Kartága, a hledej ten, na kterém Řím pak zřídil první provincii.",
    ],
    explanation: "První punská válka (264–241 př. n. l.) se vedla o Sicílii, velký ostrov mezi Itálií a Kartágem. Řím zvítězil a Sicílie se stala jeho první provincií. Kréta, Kypr ani Rhodos s touto válkou nesouvisí.",
  },
  {
    q: "Kdo porazil Hannibala u Zamy?",
    key: "Scipio",
    d: [
      ["Hamilkar Barkas", "Hamilkar Barkas byl Hannibalův otec a také Kartaginec. Proti vlastnímu synovi nebojoval a u Zamy už nežil."],
      ["Julius Caesar", "Julius Caesar se narodil až sto let po bitvě u Zamy. S punskými válkami nemá nic společného."],
      ["Cato starší", "Cato starší se proslavil v senátu výrokem, že Kartágo musí být zničeno. Vítězem od Zamy nebyl."],
    ],
    hints: [
      "Hledej římského vojevůdce z 2. punské války, který přenesl boj do Afriky.",
      "Hannibalův otec byl Kartaginec, proti vlastnímu synovi by nebojoval. U ostatních si ověř, kdy žili a čím se proslavili. Vítěz od Zamy dostal přídomek Africanus.",
    ],
    explanation: "U Zamy v Africe porazil Hannibala roku 202 př. n. l. římský vojevůdce Scipio, který za to dostal přídomek Africanus. Hamilkar byl Hannibalův otec, Cato mluvil v senátu a Caesar žil mnohem později.",
  },
  {
    q: "Kdo v římském senátu stále opakoval, že Kartágo musí být zničeno?",
    key: "Cato starší",
    d: [
      ["Scipio", "Scipio porazil Hannibala u Zamy, ale výrok o zničení Kartága proslavil jiný Říman."],
      ["Hannibal", "Hannibal byl Kartaginec. Nechtěl zničit vlastní město, bojoval proti Římu."],
      ["Julius Caesar", "Julius Caesar se narodil až asi padesát let po zničení Kartága, v senátu tehdy nemohl mluvit."],
    ],
    hints: [
      "Výrok zazníval v době před 3. punskou válkou. Hledej římského politika, ne vojevůdce z bitvy.",
      "Kartaginec by nežádal zničení vlastního města. U Římanů v nabídce si ověř, kdy žili a jestli se proslavili v boji, nebo řečmi. Hledej přísného senátora, který svou řeč prý končil vždy stejně.",
    ],
    explanation: "Cato starší prý každou řeč v senátu končil tím, že Kartágo musí být zničeno. Jeho názor se prosadil ve 3. punské válce. Scipio byl vojevůdce, Hannibal Kartaginec a Caesar žil později.",
  },
  {
    q: "Jak Římané nazývali dobyté území mimo Itálii, které spravoval římský úředník?",
    key: "Provincie",
    d: [
      ["Kolonie", "Kolonie je osada, kterou zakládali přistěhovalci, třeba Féničané nebo Řekové. Dobyté a spravované území se jmenovalo jinak."],
      ["Městský stát", "Městský stát (polis) je samostatná obec, jako Athény nebo Sparta. Dobyté římské území samostatné nebylo."],
      ["Satrapie", "Satrapie byla správní oblast Perské říše. Římané pro svá území používali jiný název."],
    ],
    hints: [
      "Hledej slovo, které se používá i dnes pro velkou oblast mimo hlavní město. První takové území získal Řím po 1. punské válce.",
      "Satrapie patřila Perské říši, ne Římu. U ostatních se ptej, jestli jde o území, které Řím dobyl, platilo mu daně a řídil ho římský místodržitel, nebo o osadu či samostatnou obec.",
    ],
    explanation: "Dobyté území mimo Itálii Římané nazývali provincie. Spravoval ho římský místodržitel a provincie odváděla daně, obilí nebo stříbro. První provincií byla Sicílie.",
  },
  {
    q: "Jak Římané nazývali Středozemní moře, když ovládli jeho břehy?",
    key: "Naše moře",
    d: [
      ["Punské moře", "Punové byli Kartaginci, kteří moře ztratili. Římané by svému moři nedali jméno poraženého soupeře."],
      ["Řecké moře", "Řekové ovládali hlavně Egejské moře a Řím si je později podrobil. Římané moři říkali jinak."],
      ["Velké moře", "Velké moře mu říkali jiné starověké národy. Římané použili slovo, které vyjadřovalo, že moře patří jim."],
    ],
    hints: [
      "Latinsky se to řekne mare nostrum. Zkus to přeložit.",
      "Jméno poraženého soupeře to není. Zamysli se, co chtěli Římané názvem říct o tom, kdo na moři vládne, a přelož latinský název slovo po slovu.",
    ],
    explanation: "Římané Středozemnímu moři říkali mare nostrum, tedy naše moře. Porážkou Kartága Řím odstranil hlavního námořního soupeře. Když postupně ovládl celé pobřeží, začali Římané moři říkat naše moře.",
  },
  {
    q: "Kterého roku Římané zničili Kartágo?",
    key: "146 př. n. l.",
    d: [
      ["202 př. n. l.", "Roku 202 př. n. l. Scipio porazil Hannibala u Zamy. Kartágo tehdy ještě zničeno nebylo, jen prohrálo 2. válku."],
      ["241 př. n. l.", "Roku 241 př. n. l. skončila 1. punská válka ztrátou Sicílie. Kartágo pak žilo ještě skoro sto let (95 let)."],
      ["146 n. l.", "Číslo sedí, ale letopočet ne. Kartágo bylo zničeno před naším letopočtem, v době punských válek."],
    ],
    hints: [
      "Kartágo zničila až 3. punská válka, poslední ze tří. Ve kterém roce skončila?",
      "Pamatuj, že všechny punské války proběhly před naším letopočtem. Pak si ke zbylým letopočtům přiřaď události: kdy skončila 1. válka a kdy padlo rozhodnutí u Zamy?",
    ],
    explanation: "Kartágo zničili Římané na konci 3. punské války, roku 146 př. n. l. Rok 241 př. n. l. je konec 1. války, rok 202 př. n. l. bitva u Zamy a všechny tyto události proběhly před naším letopočtem.",
  },
  {
    q: "Čím Hannibal na začátku 2. punské války Římany překvapil?",
    key: "Přešel s vojskem a slony přes Alpy",
    d: [
      ["Připlul s loďstvem přímo k Římu", "Po moři Hannibal nepřišel. Moře po 1. punské válce ovládali Římané."],
      ["Vylodil se s vojskem na Sicílii", "O Sicílii se bojovalo v 1. punské válce. Hannibal ve 2. válce přišel do Itálie ze severu."],
      ["Přitáhl s vojskem přes Řecko", "Hannibal netáhl přes Řecko, vyrazil z Hispánie na západě a do Itálie vstoupil ze severu."],
    ],
    hints: [
      "Římané čekali útok z moře nebo ze Sicílie. Hannibal přišel odjinud, ze severu Itálie.",
      "Moře tehdy ovládal Řím. Najdi na mapě Hispánii, odkud Hannibal vyrazil, a severní Itálii, kam dorazil. Co leží mezi nimi?",
    ],
    explanation: "Hannibal roku 218 př. n. l. vyrazil z Hispánie a přešel s vojskem i válečnými slony přes Alpy do Itálie. Římané takový útok nečekali, protože moře ovládali oni a hory považovali za překážku.",
  },
  {
    q: "Jak se jmenoval Hannibalův otec, vojevůdce z 1. punské války?",
    key: "Hamilkar Barkas",
    d: [
      ["Scipio", "Scipio byl Říman a Hannibala porazil u Zamy. Jeho otcem rozhodně nebyl."],
      ["Cato starší", "Cato starší byl římský senátor, který chtěl Kartágo zničit. S Hannibalem nebyl příbuzný."],
      ["Hasdrubal Barkas", "Hasdrubal Barkas byl Hannibalův bratr, ne otec. Kartagincům velel až ve 2. punské válce."],
    ],
    hints: [
      "Otec i syn byli Kartaginci. Otec bojoval s Římany na Sicílii ještě v 1. punské válce.",
      "Pozor, v Hannibalově rodu bylo víc vojevůdců. Hledej toho, který velel už v 1. válce a potom upevnil moc Kartága v Hispánii, odkud jeho syn vyrazil přes Alpy.",
    ],
    explanation: "Hannibalovým otcem byl Hamilkar Barkas. V 1. punské válce velel Kartagincům na Sicílii a po válce upevnil moc Kartága v Hispánii. Hasdrubal byl Hannibalův bratr, Scipio a Cato byli Římané.",
  },
  {
    q: "Jak se nazývají války, které vedl Řím s Kartágem?",
    key: "Punské války",
    d: [
      ["Perské války", "Perské války vedli Řekové proti Perské říši. Řím ani Kartágo v nich nebojovaly."],
      ["Makedonské války", "Makedonské války vedl Řím proti Makedonii na východě. Kartágo v nich nebojovalo."],
      ["Galské války", "Galské války vedl Julius Caesar v Galii až dlouho po zničení Kartága."],
    ],
    hints: [
      "Název vznikl z latinského jména pro Kartagince. Římané jim říkali Punové.",
      "Války Řeků s Peršany vyřaď, tam Řím nebojoval. U ostatních se ptej, proti komu Řím bojoval, a hledej název odvozený od toho, jak Římané nazývali Kartagince.",
    ],
    explanation: "Války Říma s Kartágem se nazývají punské, protože Římané Kartagincům říkali Punové. Byly tři, od roku 264 do roku 146 př. n. l. Perské války patří do dějin Řecka, makedonské a galské války vedl Řím s jinými soupeři.",
  },
  {
    q: "Kde Hannibal roku 216 př. n. l. rozdrtil římské vojsko?",
    key: "U Kann",
    d: [
      ["U Zamy", "U Zamy Hannibal nevyhrál. Roku 202 př. n. l. tam naopak prohrál se Scipiem."],
      ["U Marathónu", "U Marathónu zvítězili Athéňané nad Peršany roku 490 př. n. l. Řím ani Hannibal tam nebojovali."],
      ["U Thermopyl", "U Thermopyl bránili Sparťané průsmyk proti Peršanům. S punskými válkami ta bitva nesouvisí."],
    ],
    hints: [
      "Bitva se odehrála v jižní Itálii, dva roky po přechodu Alp.",
      "U Zamy Hannibal prohrál, tu vyřaď. Zbylé bitvy zkus zařadit do dějin: které z nich patří k válkám Řeků s Peršany a která k Hannibalovu tažení Itálií?",
    ],
    explanation: "Roku 216 př. n. l. Hannibal obklíčil a zničil velké římské vojsko u Kann v jižní Itálii. U Zamy (202 př. n. l.) naopak prohrál a Marathón i Thermopyly patří k řecko-perským válkám.",
  },
];

// ── L2 — použití ─────────────────────────────────────────────────────────────
interface Udalost { label: string; nom: string; rok: number }
const KANNY: Udalost = { label: "Bitva u Kann", nom: "bitva u Kann", rok: 216 };
const ZAMA: Udalost = { label: "Bitva u Zamy", nom: "bitva u Zamy", rok: 202 };
const ZNICENI: Udalost = { label: "Zničení Kartága", nom: "zničení Kartága", rok: 146 };

/** Jestli se při odčítání jednotek musí vypůjčit desítka. */
const prechod = (vyssi: number, nizsi: number) => vyssi % 10 < nizsi % 10;

/** Co bylo dřív a o kolik let (oba roky př. n. l.). */
function driv(a: Udalost, b: Udalost): Uloha {
  const [starsi, mladsi] = a.rok > b.rok ? [a, b] : [b, a];
  const rozdil = starsi.rok - mladsi.rok;
  const vypujcka = prechod(starsi.rok, mladsi.rok);
  const spatne = vypujcka ? rozdil + 10 : rozdil + 1;
  const chyba = vypujcka
    ? "při odčítání jednotek se vypůjčila desítka, ale pak se zapomněla ubrat"
    : "připočetl se jeden rok navíc, přitom rozdíl letopočtů už sám udává, kolik let uplynulo";
  const moznost = (u: Udalost, n: number) => `${u.label}, o ${pad(n, "ROK")} dřív`;
  return {
    q: `Co proběhlo dřív a o kolik let: ${a.nom} (${a.rok} př. n. l.), nebo ${b.nom} (${b.rok} př. n. l.)?`,
    key: moznost(starsi, rozdil),
    d: [
      [moznost(mladsi, rozdil), "Rozdíl sedí, ale pořadí ne. Menší číslo se bralo jako dřívější, jako v našem letopočtu. Před naším letopočtem se počítá pozpátku, takže vyšší číslo je dřív."],
      [moznost(starsi, spatne), `Pořadí sedí, ale rozdíl ne: ${chyba}.`],
      [moznost(mladsi, spatne), `Tady jsou chyby dvě: před naším letopočtem znamená vyšší číslo dřív a u rozdílu se ${vypujcka ? "zapomněla ubrat vypůjčená desítka" : "připočetl rok navíc"}.`],
    ],
    hints: [
      `Oba letopočty jsou před naším letopočtem. Který z roků ${a.rok} a ${b.rok} př. n. l. leží dál od narození Krista?`,
      `Před naším letopočtem se roky počítají pozpátku, dřívější událost má proto vyšší číslo. Protože ${a.nom} i ${b.nom} leží na stejné straně od narození Krista, rozdíl zjistíš odečtením nižšího letopočtu od vyššího.${vypujcka ? " Pohlídej vypůjčenou desítku." : ""}`,
    ],
    explanation: `Před naším letopočtem se počítá pozpátku, takže vyšší číslo znamená dřívější rok. Dřív proto proběhla ${starsi.nom} (${starsi.rok} př. n. l.). Oba roky leží před naším letopočtem, a proto se odečítají: rozdíl je ${pad(rozdil, "ROK")}.`,
    steps: [
      `Oba roky jsou před n. l., vyšší číslo znamená dřív: ${starsi.rok} > ${mladsi.rok}.`,
      `Rozdíl: ${starsi.rok} − ${mladsi.rok} = ${rozdil}.`,
      `Dřív byla ${starsi.nom}, o ${pad(rozdil, "ROK")}.`,
    ],
  };
}

/** Kolik let uplynulo mezi dvěma roky př. n. l. (od → do). */
function delka(q: string, od: number, doRoku: number): Uloha {
  const n = od - doRoku;
  const vypujcka = prechod(od, doRoku);
  const d: [string, string][] = [
    [pad(od + doRoku, "ROK"), `Tady se letopočty sečetly (${od} + ${doRoku}). Sčítá se jen tehdy, když jedna událost leží před naším letopočtem a druhá po něm. Tady jsou obě před ním.`],
    [pad(n + 1, "ROK"), "Tady se připočetl jeden rok navíc. Rozdíl letopočtů už sám udává, kolik let uplynulo."],
  ];
  d.push(
    vypujcka
      ? [pad(n + 10, "ROK"), `Chyba při odčítání: u jednotek ${od % 10} − ${doRoku % 10} se musí vypůjčit desítka a ta se pak zapomněla ubrat.`]
      : [pad(n - 1, "ROK"), "Tady se jeden rok ubral. Rozdíl letopočtů přímo udává, kolik let uplynulo."],
  );
  return {
    q,
    key: pad(n, "ROK"),
    d,
    hints: [
      `Oba roky (${od} i ${doRoku} př. n. l.) leží na stejné straně od narození Krista. Mají se v tom případě sčítat, nebo odečítat?`,
      `Od vyššího letopočtu (${od} př. n. l.) odečti nižší (${doRoku} př. n. l.).${vypujcka ? ` U jednotek ${od % 10} − ${doRoku % 10} to bez vypůjčení nejde, pohlídej přechod přes desítku.` : ""} Nic nepřičítej ani neubírej. Výsledek si ověř zpětně: když ho přičteš k ${doRoku}, musí ti vyjít ${od}.`,
    ],
    explanation: `Oba roky jsou před naším letopočtem, proto se odečítají: ${od} − ${doRoku} = ${n}. Uplynulo tedy ${pad(n, "ROK")}. Sčítalo by se jen tehdy, kdyby jedna událost ležela před naším letopočtem a druhá po něm.`,
    steps: [
      "Oba roky leží před n. l., proto se odečítá, nesčítá.",
      `${od} − ${doRoku} = ${n}`,
      `Výsledek: ${pad(n, "ROK")}.`,
    ],
  };
}

const L2: Uloha[] = [
  {
    q: "Ve které válce se Řím poprvé naučil bojovat na moři a postavil si loďstvo?",
    key: "V první punské válce",
    d: [
      ["Ve druhé punské válce", "Ve druhé válce už Řím moře ovládal. Právě proto musel Hannibal jít do Itálie po souši přes Alpy."],
      ["Ve třetí punské válce", "Ve třetí válce Řím obléhal a zničil Kartágo. Loďstvo měl už dávno."],
      ["V řecko-perských válkách", "V řecko-perských válkách bojovali Řekové proti Peršanům. Řím v nich nehrál žádnou roli."],
    ],
    hints: [
      "Loďstvo Řím potřeboval, když se poprvé střetl s Kartágem o území za mořem.",
      "Válka Řeků s Peršany Řím nezasáhla. U punských válek si vzpomeň, o co se v které bojovalo a ve které se Řím s Kartágem střetl poprvé.",
    ],
    explanation: "Loďstvo si Řím postavil v 1. punské válce (264–241 př. n. l.), protože se bojovalo o ostrov Sicílii a Kartágo bylo silné na moři. Ve 2. válce už Řím moře ovládal a ve 3. válce Kartágo jen dobyl.",
  },
  {
    q: "Kartaginci obklíčili v jižní Itálii velké římské vojsko a téměř ho zničili. Kde se to stalo a kdo nakonec vyhrál celou válku?",
    key: "U Kann, válku nakonec vyhrál Řím",
    d: [
      ["U Kann, válku nakonec vyhrálo Kartágo", "Bitva sedí, ale válka ne. Vítězství v jedné bitvě nerozhodlo: Řím se nevzdal a roku 202 př. n. l. porazil Hannibala u Zamy."],
      ["U Zamy, válku nakonec vyhrál Řím", "Válka sedí, ale bitva ne. U Zamy v Africe Řím zvítězil. Obklíčení Římanů v Itálii se stalo u Kann."],
      ["U Zamy, válku nakonec vyhrálo Kartágo", "Tady jsou chyby dvě: u Zamy v Africe Kartaginci prohráli, a proto válku vyhrál Řím. Obklíčení v Itálii se stalo u Kann."],
    ],
    hints: [
      "Nejdřív urči bitvu: odehrála se v Itálii a vyhrál ji Hannibal. Pak zvlášť rozhodni, jak skončila celá 2. punská válka.",
      "Prohraná bitva ještě neznamená prohranou válku. Kde se odehrála poslední bitva 2. punské války, kdo v ní zvítězil a kdo potom musel přijmout tvrdý mír?",
    ],
    explanation: "Obklíčení a zničení velkého římského vojska se odehrálo u Kann roku 216 př. n. l. Byla to jedna z nejtěžších porážek v římských dějinách. Řím se přesto nevzdal, doplnil vojsko a roku 202 př. n. l. Scipio porazil Hannibala u Zamy. Válku tedy vyhrál Řím.",
    steps: [
      "Bitva v jižní Itálii, v níž Kartaginci obklíčili Římany: Kanny (216 př. n. l.).",
      "Konec 2. punské války: Scipio porazil Hannibala u Zamy (202 př. n. l.).",
      "Bitvu u Kann vyhrálo Kartágo, válku vyhrál Řím.",
    ],
  },
  {
    q: "Který vojevůdce přenesl válku do Afriky a donutil tak Hannibala opustit Itálii?",
    key: "Scipio",
    d: [
      ["Hamilkar Barkas", "Hamilkar Barkas byl Kartaginec a Hannibalův otec. Zemřel dřív, než 2. punská válka začala."],
      ["Julius Caesar", "Julius Caesar se narodil až sto let po bitvě u Zamy a s Hannibalem se nikdy nesetkal."],
      ["Alexandr Veliký", "Alexandr Veliký byl makedonský král a zemřel sto let před 2. punskou válkou. Proti Římu nebojoval."],
    ],
    hints: [
      "Hannibal musel z Itálie odplout, protože nepřítel ohrožoval jeho domovské město. Kdo ho ohrožoval?",
      "Hannibalův otec byl Kartaginec a zemřel ještě před 2. válkou. U ostatních si ověř, kdy žili, a hledej římského vojevůdce, který pak zvítězil u Zamy.",
    ],
    explanation: "Válku do Afriky přenesl Říman Scipio. Kartágo proto povolalo Hannibala z Itálie domů a roku 202 př. n. l. ho Scipio porazil u Zamy. Hamilkar byl Kartaginec, Alexandr a Caesar žili v jiné době.",
  },
  {
    q: "Ve které válce Římané dobyli Kartágo a srovnali ho se zemí?",
    key: "Ve třetí punské válce",
    d: [
      ["V první punské válce", "První válka skončila ztrátou Sicílie. Kartágo samotné přežilo ještě téměř sto let."],
      ["Ve druhé punské válce", "Druhá válka skončila porážkou Hannibala u Zamy a tvrdým mírem. Město tehdy zničeno nebylo."],
      ["V peloponéské válce", "Peloponéská válka byla válka Athén se Spartou v Řecku. S Kartágem nesouvisí."],
    ],
    hints: [
      "Kartágo nejdřív přišlo o Sicílii, pak o vojsko a teprve nakonec o samotné město. Která válka byla poslední?",
      "Válka Athén se Spartou do dějin Říma nepatří. Vzpomeň si, co Kartágo ztratilo v které válce, a hledej tu, ve které se prosadil Catonův požadavek.",
    ],
    explanation: "Kartágo Římané dobyli a zničili ve 3. punské válce (149–146 př. n. l.). V 1. válce Kartágo ztratilo Sicílii, ve 2. válce vojsko u Zamy a peloponéská válka patří k dějinám Řecka.",
  },
  driv(ZAMA, KANNY),
  driv(ZNICENI, ZAMA),
  {
    q: "Které pořadí je správné od nejstarší události: bitva u Zamy (202 př. n. l.), přechod Alp (218 př. n. l.), bitva u Kann (216 př. n. l.)?",
    key: "Přechod Alp, Kanny, Zama",
    d: [
      ["Zama, Kanny, přechod Alp", "Tohle je pořadí od nejmladší. Menší číslo se bralo jako dřívější, ale před naším letopočtem je vyšší číslo dřív."],
      ["Kanny, přechod Alp, Zama", "Zama je správně poslední, ale Kanny nemohly být před přechodem Alp: Hannibal musel do Itálie nejdřív dojít. Rok 218 je vyšší než 216, a proto dřív."],
      ["Přechod Alp, Zama, Kanny", "Přechod Alp je správně první, ale Zama (202) a Kanny (216) jsou prohozené. Před naším letopočtem je vyšší číslo dřív."],
    ],
    hints: [
      "Všechny tři roky jsou před naším letopočtem. Který letopočet je nejvyšší, a leží tedy nejdál v minulosti?",
      "Seřaď čísla od největšího po nejmenší, to je pořadí od nejstarší události. Kontrola podle souvislostí: Hannibal musel nejdřív dojít do Itálie, pak tam bojovat a nakonec se vrátil bránit Afriku.",
    ],
    explanation: "Před naším letopočtem se roky počítají pozpátku, takže nejstarší událost má nejvyšší číslo: 218 > 216 > 202. Hannibal nejdřív přešel Alpy, pak u Kann porazil Římany v Itálii a nakonec prohrál u Zamy v Africe.",
    steps: [
      "Všechny roky jsou před n. l., vyšší číslo znamená dřív.",
      "Od největšího: 218 > 216 > 202.",
      "Přechod Alp (218), Kanny (216), Zama (202).",
    ],
  },
  delka("Kolik let trvala 1. punská válka (264–241 př. n. l.)?", 264, 241),
  delka("Kolik let uplynulo od konce 2. punské války (201 př. n. l.) do zničení Kartága (146 př. n. l.)?", 201, 146),
  {
    q: "Ze které země vyrazil Hannibal na pochod do Itálie?",
    key: "Z Hispánie",
    d: [
      ["Ze Sicílie", "Sicílii Kartágo ztratilo už po 1. punské válce. Hannibal vyrazil z území na západě Evropy."],
      ["Z Řecka", "Řecko leží na východ od Itálie, ale Hannibal přišel ze západu a ze severu přes Alpy."],
      ["Z Egypta", "Egypt s punskými válkami nesouvisí. Hannibal vyrazil z území, které Kartágo ovládalo v Evropě."],
    ],
    hints: [
      "Hannibal šel po souši přes Alpy, takže musel vyrazit z území, které leží na západ od nich.",
      "Sicílii Kartágo ztratilo už v 1. válce, odtud vyrazit nemohl. U ostatních si na mapě ověř, jestli leží na západ od Alp a jestli je po 1. válce ovládal Hannibalův rod.",
    ],
    explanation: "Hannibal vyrazil roku 218 př. n. l. z Hispánie (dnešního Španělska), kterou ovládali Kartaginci. Odtud táhl přes Pyreneje a Alpy do Itálie. Sicílii Kartágo už ztratilo a Řecko ani Egypt nepřipadají v úvahu.",
  },
  {
    q: "Po 1. punské válce ovládali moře Římané. Jakou cestu z Hispánie do Itálie proto musel zvolit kartaginský vojevůdce?",
    key: "Pochod po souši přes hory do severní Itálie",
    d: [
      ["Plavbu s vojskem kolem Sicílie přímo k Římu", "Po moři Hannibal nemohl, moře ovládali Římané. Většina Sicílie navíc tehdy patřila Římu."],
      ["Vylodění z Afriky na jihu Itálie", "Vylodění by znamenalo plavbu po moři, které ovládal Řím. Hannibal navíc vyrazil z Hispánie, ne z Afriky."],
      ["Pochod po souši přes Balkán a Řecko", "Balkán a Řecko leží na východ od Itálie. Z Hispánie na západě by to byla cesta na opačnou stranu."],
    ],
    hints: [
      "Rozmysli si, co pro Kartagince znamenalo, že moře ovládal Řím.",
      "Najdi na mapě Hispánii a Itálii. Kudy mezi nimi vede cesta, na které se vojsko nesetká s římskými loděmi, a co na ní stojí v cestě?",
    ],
    explanation: "Moře ovládal Řím, proto plavba ani vylodění nepřicházely v úvahu. Hannibal šel z Hispánie po souši přes Pyreneje a Alpy do severní Itálie. Balkán a Řecko leží na opačné straně Itálie.",
  },
  {
    q: "Která událost patří do 2. punské války?",
    key: "Bitva u Kann",
    d: [
      ["Boje o Sicílii", "O Sicílii se Řím s Kartágem přel už v 1. punské válce."],
      ["Zničení Kartága", "Kartágo bylo zničeno až ve 3. punské válce, roku 146 př. n. l."],
      ["Zničení Korintu", "Korint zničili Římané roku 146 př. n. l., tedy v době 3. punské války, ne druhé."],
    ],
    hints: [
      "Druhá punská válka je válka s Hannibalem. Hledej událost, v níž Hannibal hraje hlavní roli.",
      "Spor o ostrov patří k první válce. Zbylé události si přiřaď k letopočtům a porovnej je s léty 2. války, 218–201 př. n. l.",
    ],
    explanation: "Do 2. punské války (218–201 př. n. l.) patří bitva u Kann roku 216 př. n. l., v níž Hannibal porazil Římany. Boje o Sicílii patří k 1. válce a zničení Kartága i Korintu k roku 146 př. n. l.",
  },
  {
    q: "Která událost patří do 1. punské války?",
    key: "Boje o Sicílii",
    d: [
      ["Bitva u Kann", "Bitva u Kann (216 př. n. l.) patří do 2. punské války, kdy Hannibal táhl Itálií."],
      ["Zničení Kartága", "Zničení Kartága (146 př. n. l.) ukončilo až 3. punskou válku."],
      ["Bitva u Zamy", "Bitva u Zamy (202 př. n. l.) rozhodla 2. punskou válku."],
    ],
    hints: [
      "První punská válka začala roku 264 př. n. l. a Hannibal v ní ještě nebojoval. O co se tehdy Řím s Kartágem přel?",
      "Zničení Kartága ukončilo až poslední válku. U zbylých možností si vzpomeň, jestli v nich už bojoval Hannibal, a porovnej je s léty 264–241 př. n. l.",
    ],
    explanation: "První punská válka (264–241 př. n. l.) se vedla o Sicílii. Bitvy u Kann a Zamy patří do 2. války s Hannibalem a zničení Kartága do 3. války.",
  },
  {
    q: "Mezi roky 149 a 146 př. n. l. Římané obléhali a dobyli velké město v severní Africe. Které to bylo?",
    key: "Kartágo",
    d: [
      ["Korint", "Korint Římané zničili také roku 146 př. n. l., ale leží v Řecku, ne v Africe."],
      ["Alexandrie", "Alexandrie v Egyptě byla helénistické město a Římané ji tehdy nedobyli."],
      ["Syrakusy", "Syrakusy leží na Sicílii a Římané je dobyli už ve 2. punské válce."],
    ],
    hints: [
      "Roky 149–146 př. n. l. jsou 3. punská válka. Které město bylo jejím cílem?",
      "Syrakusy Řím dobyl dřív, ve 2. punské válce. Zbylá města najdi na mapě a vzpomeň si, proti kterému z nich vedl Řím tři války.",
    ],
    explanation: "V letech 149–146 př. n. l. probíhala 3. punská válka. Římané obléhali a zničili Kartágo v severní Africe. Korint zničili téhož roku v Řecku, Syrakusy dobyli dřív a Alexandrii tehdy nedobyli.",
  },
];

// ── L3 — analýza ─────────────────────────────────────────────────────────────
const L3: Uloha[] = [
  {
    q: "Proč si Řím v první válce s Kartágem musel postavit loďstvo?",
    key: "Protože Kartágo vládlo moři a o ostrov se bez lodí bojovat nedalo",
    d: [
      ["Protože Hannibal vedl vojsko se slony přes Alpy přímo na Řím", "Přechod Alp patří až do 2. punské války. V 1. válce se bojovalo o Sicílii a Hannibal ještě nevelel."],
      ["Protože Kartágo leželo na Sicílii a jinak se k němu dostat nedalo", "Kartágo neleželo na Sicílii, ale v severní Africe. O Sicílii se jen vedl spor."],
      ["Protože se Římané báli, že Peršané znovu vtrhnou do Itálie", "Perské výpravy mířily na Řecko o dvě století dřív. Do Itálie Peršané nikdy nevtrhli."],
    ],
    hints: [
      "Kde leží území, o které se v 1. punské válce bojovalo, a jak se k němu dostaneš?",
      "Hannibalův pochod přes hory patří až do pozdější války. Zaměř se na to, v čem bylo Kartágo silnější než Řím a co bylo předmětem sporu.",
    ],
    explanation: "V 1. punské válce šlo o Sicílii, tedy o ostrov. Kartágo mělo silné loďstvo a vládlo moři. Řím, dosud pozemní mocnost, si proto musel postavit lodě s můstky, aby mohl bojovat na moři.",
  },
  {
    q: "Proč Hannibal táhl do Itálie po souši přes hory, a ne po moři?",
    key: "Protože moře po první punské válce ovládalo římské loďstvo",
    d: [
      ["Protože Kartaginci nikdy neuměli stavět lodě ani na nich plout", "Kartágo založili Féničané, zkušení mořeplavci, a v 1. válce mělo silné loďstvo. Moře ale pak ztratilo."],
      ["Protože sloni by na moři zahynuli a bez nich nechtěl jít", "Slony Kartaginci po moři převážet uměli. Rozhodlo, kdo moře po 1. válce ovládal."],
      ["Protože Alpy byly nejkratší cestou z Afriky až k Římu", "Z Afriky do Itálie je nejkratší cesta po moři přes Sicílii. Pochod z Hispánie přes Alpy byl dlouhý a těžký."],
    ],
    hints: [
      "Jak skončila 1. punská válka a kdo potom vládl Středozemnímu moři?",
      "Kartaginci byli potomci mořeplavců, lodě stavět i řídit uměli. Co by Hannibalovi hrozilo, kdyby se s celým vojskem plavil po moři, které ovládal někdo jiný?",
    ],
    explanation: "Po 1. punské válce ovládal moře Řím. Plavba s celým vojskem by skončila v boji s římskými loděmi. Hannibal proto zvolil dlouhou, ale nečekanou cestu z Hispánie po souši přes Alpy.",
  },
  {
    q: "Proč Hannibal vyhrál bitvu u Kann, ale válku přesto prohrál?",
    key: "Protože Řím se nevzdal a Hannibal neměl posily ani obléhací stroje",
    d: [
      ["Protože mu hned po Kannách došly zásoby a musel z Itálie odtáhnout", "Hannibal zůstal v Itálii ještě přes deset let a zásoby bral z krajiny. Odtáhl, až když ho Kartágo povolalo domů."],
      ["Protože po Kannách uzavřel s Římem mír a vrátil se s vojskem domů", "Žádný mír po Kannách nebyl. Hannibal zůstal v Itálii ještě mnoho let, dokud ho Kartágo nepovolalo."],
      ["Protože ho v Itálii porazil Cato starší se senátním vojskem", "Cato starší se proslavil řečmi v senátu. Hannibala porazil Scipio, a to v Africe u Zamy."],
    ],
    hints: [
      "Vítězství v jedné bitvě nestačí, když soupeř nekapituluje. Co Řím po porážce udělal a co Hannibalovi chybělo?",
      "Senátor, který chtěl zničit Kartágo, neporazil nikoho v poli. Ověř si, jak dlouho Hannibal v Itálii zůstal, a přemýšlej, čím mohl Řím doplňovat vojsko a jak se dobývají hradby.",
    ],
    explanation: "U Kann Hannibal zvítězil, ale Řím nekapituloval. Měl zálohy a spojence v Itálii, kdežto Hannibal nedostával posily a bez obléhacích strojů nemohl dobýt Řím. Nakonec ho Scipio porazil u Zamy.",
  },
  {
    q: "Cato starší v senátu stále opakoval, že Kartágo musí být zničeno. Jaké nové území Římu jeho požadavek nakonec přinesl?",
    key: "Novou provincii Afriku na území poraženého Kartága",
    d: [
      ["Hispánii, kterou Kartágo ztratilo po Hannibalově porážce", "Hispánii Řím získal už po 2. punské válce, dávno předtím, než Cato začal zničení Kartága žádat."],
      ["Sicílii, o kterou se Řím s Kartágem přel jako první", "Sicílii Řím získal už po 1. punské válce. Catonův požadavek se týkal až 3. války."],
      ["Vládu nad Egyptem, který Kartágo předtím ovládalo", "Egypt Kartágu nikdy nepatřil. Řím ho ovládl až roku 30 př. n. l."],
    ],
    hints: [
      "Catonův požadavek se splnil ve 3. punské válce. Co se stalo s územím Kartága, když samotné město zmizelo?",
      "Sicílii Řím získal už v první válce, na tu Cato čekat nemusel. Zkus odpovědět ve dvou krocích: jak 3. válka skončila a co Řím obvykle dělal s dobytým územím mimo Itálii?",
    ],
    explanation: "Cato se prosadil ve 3. punské válce. Římané roku 146 př. n. l. Kartágo zničili a jeho území v severní Africe proměnili v provincii Afrika. Sicílii Řím získal už v 1. válce, Hispánii ve 2. válce a Egypt Kartágu nikdy nepatřil.",
  },
  {
    q: "Proč chtěl Řím zničit Kartágo, i když už po druhé punské válce nebylo vojensky silné?",
    key: "Protože znovu bohatlo obchodem a Římané se báli jeho obnovené moci",
    d: [
      ["Protože Hannibal znovu táhl přes Alpy s novým vojskem a slony", "Druhý pochod přes Alpy nebyl. Hannibal už do Itálie nikdy nevtrhl a zemřel dřív, než 3. punská válka začala."],
      ["Protože Kartágo spojilo síly s Alexandrem Velikým proti Římu", "Alexandr Veliký zemřel skoro dvě stě let před 3. punskou válkou. Spojit se s ním nešlo."],
      ["Protože Kartágo po Zamě vyhrálo novou válku o ostrov Sicílii", "O Sicílii se bojovalo v 1. válce a Řím ji vyhrál. Po Zamě Kartágo žádnou válku nevyhrálo."],
    ],
    hints: [
      "Město bez vojska může být silné i jinak. Čím se Kartágo odjakživa živilo?",
      "Hannibal už do Itálie nikdy nevtrhl a v době 3. války nežil. Hledej důvod, proč se Řím mohl bát soupeře, který byl na válku slabý.",
    ],
    explanation: "Po 2. válce Kartágo ztratilo vojsko i loďstvo, ale znovu zbohatlo obchodem. Římané se báli, že obnoví i svou moc, a proto ve 3. válce město zničili. Vojenskou hrozbou už Kartágo nebylo.",
  },
  {
    q: "Čím se třetí punská válka lišila od prvních dvou?",
    key: "Kartágo už Římu nehrozilo a cílem bylo jeho úplné zničení",
    d: [
      ["Kartágo v ní poprvé zaútočilo na Itálii přes hory se slony", "Útok přes Alpy patří do 2. punské války. Ve 3. válce Kartágo na Itálii neútočilo, samo bylo obléháno."],
      ["Bojovalo se v ní hlavně na moři o ostrov Sicílii a jeho města", "Boje o Sicílii na moři patří do 1. punské války. Ve 3. válce Římané obléhali Kartágo v Africe."],
      ["Kartágo v ní zvítězilo a Řím přišel o všechny své provincie", "Kartágo ve 3. válce nezvítězilo, naopak bylo roku 146 př. n. l. zničeno."],
    ],
    hints: [
      "Porovnej, o co se bojovalo v jednotlivých válkách a jak silné bylo Kartágo na začátku té poslední.",
      "Spor o ostrov patří k první válce a útok z hor ke druhé. Ověř si také, kdo válku vyhrál. Pak se zeptej, jestli ve třetí válce šlo ještě o nějaké území, nebo o něco jiného.",
    ],
    explanation: "V 1. válce šlo o Sicílii, ve 2. o nadvládu a Kartágo útočilo na Itálii. Ve 3. válce už Kartágo Římu nehrozilo. Řím chtěl soupeře úplně odstranit a roku 146 př. n. l. město zničil.",
  },
  {
    q: "Které tvrzení nejlépe vystihuje, co Římu přinesla vítězství nad Kartágem?",
    key: "Provincie, obilí, stříbro, otroky a nadvládu nad západním Středomořím",
    d: [
      ["Jen ostrov Sicílii, protože další území si Kartágo ubránilo", "Sicílie byla jen první zisk. Po 2. válce Řím získal Hispánii a po 3. válce i území samotného Kartága."],
      ["Nadvládu nad Persií a Egyptem, které předtím patřily Kartágu", "Persie ani Egypt Kartágu nikdy nepatřily. Kartágo ovládalo západní Středomoří."],
      ["Hlavně ztráty, protože Hannibal Řím dobyl a celý ho vyplenil", "Hannibal Řím nikdy nedobyl, neměl obléhací stroje. Řím z válek naopak velmi zbohatl."],
    ],
    hints: [
      "Mysli na to, co získává vítěz: území, suroviny i lidi. A komu pak patřilo moře?",
      "Hannibal samotné město Řím nikdy nedobyl. Vzpomeň si, co přinášely Římu provincie a zajatci a kterou část Středomoří předtím ovládalo Kartágo.",
    ],
    explanation: "Vítězství nad Kartágem přinesla Římu provincie (Sicílii, Hispánii, Afriku), obilí, stříbro z dolů a mnoho otroků. Bez silného soupeře Řím ovládl západní Středomoří. Východ, třeba Řecko a Egypt, získal až v jiných válkách.",
  },
  {
    q: "Roku 146 př. n. l. Římané zničili Kartágo i řecký Korint. Co z toho plyne pro postavení Říma?",
    key: "Řím ovládal západ Středomoří a zároveň i Řecko na východě",
    d: [
      ["Řím přišel o Sicílii, ale jako náhradu za ni získal Řecko", "Sicílii Řím neztratil, byla jeho provincií od 1. punské války. Rok 146 př. n. l. mu přinesl další zisky."],
      ["Řím ovládl Řecko, ale západ Středomoří dál ovládalo Kartágo", "Kartágo bylo téhož roku zničeno, takže západ Středomoří už ovládat nemohlo. Řím získal obojí."],
      ["Řím ovládl celou Perskou říši a Egypt až k hranicím Indie", "Až k Indii dotáhl Alexandr Veliký, ne Řím. Roku 146 př. n. l. Řím získal Kartágo a Řecko."],
    ],
    hints: [
      "Kde leželo Kartágo a kde Korint? Spoj si obě místa na mapě Středomoří.",
      "Tažení k Indii patří makedonskému králi, ne Římu. Pak si polož otázku: co znamená, když vítěz téhož roku zničí soupeře v Africe i v Řecku, a kdo potom vládne kterému břehu?",
    ],
    explanation: "Kartágo leželo v severní Africe a Korint v Řecku. Když je Řím roku 146 př. n. l. zničil, ovládal západní Středomoří i Řecko. Tím se stal nejsilnější mocností kolem Středozemního moře.",
  },
  {
    q: "Co by se nejspíš stalo, kdyby Řím po první punské válce neovládal moře?",
    key: "Hannibal mohl připlout do Itálie a nemusel pochodovat přes Alpy",
    d: [
      ["Kartágo by nikdy nemohlo založit své osady v severní Africe", "Kartágo založili Féničané dávno před punskými válkami. Na tom by římské loďstvo nic nezměnilo."],
      ["Řím by stejně zvítězil u Kann a válka by skončila o dost dřív", "U Kann Řím nezvítězil, prohrál. Bez vlády nad mořem by na tom byl ještě hůř."],
      ["Hannibal by i tak musel jít přes Alpy, protože jiná cesta do Itálie nevede", "Jiná cesta vede: z Afriky i z Hispánie se dá do Itálie doplout. Přes Alpy šel Hannibal právě proto, že moře ovládal Řím."],
    ],
    hints: [
      "Vzpomeň si, proč Hannibal ve 2. válce volil těžkou cestu přes hory. Co by se změnilo, kdyby ten důvod odpadl?",
      "Založení Kartága proběhlo dávno před punskými válkami, na to by lodě vliv neměly. Jakou cestu by Kartaginci zvolili, kdyby na moři nepotkali římské lodě?",
    ],
    explanation: "Hannibal šel přes Alpy jen proto, že moře ovládal Řím. Kdyby Řím moře neovládal, mohl Hannibal přeplout s vojskem přímo do Itálie a ušetřit si dlouhý pochod, v němž ztratil mnoho mužů i slonů.",
  },
  {
    q: "Provincie bylo dobyté území mimo Itálii a první římskou provincií se stala Sicílie. Proč Řím o tento ostrov s Kartágem bojoval?",
    key: "Protože leží hned u Itálie a byla bohatá na obilí",
    d: [
      ["Protože na ní leželo Kartágo, hlavní město soupeře", "Kartágo leželo v severní Africe, ne na Sicílii. O ostrov se vedl spor, protože ležel mezi oběma soupeři."],
      ["Protože tam ležely bohaté stříbrné doly soupeře", "Stříbrné doly získal Řím až v Hispánii po 2. punské válce. Sicílie byla cenná hlavně obilím."],
      ["Protože odtud Hannibal vyrazil se slony na Řím", "Hannibal vyrazil z Hispánie a šel přes Alpy, ne ze Sicílie. Řím navíc získal kartaginskou část Sicílie už roku 241 př. n. l."],
    ],
    hints: [
      "Podívej se na mapu: kde Sicílie leží vůči Itálii? A co Řím z dobytých území nejvíc potřeboval?",
      "Kartágo mělo sídlo v severní Africe, ne na ostrově. Mysli ve dvou krocích: čím byla Sicílie proslulá a proč by cizí vojsko na ostrově mohlo ohrožovat Itálii.",
    ],
    explanation: "Sicílie leží hned u jižní Itálie a byla bohatá na obilí. Kdo ji držel, mohl ohrožovat Itálii i ovládat plavbu mezi Itálií a Afrikou, proto se o ni Řím s Kartágem přel. Mírem roku 241 př. n. l. získal Řím kartaginskou část ostrova. Brzy potom Řím zabral Sardinii a Korsiku, další provincie přinesla 2. punská válka.",
  },
  {
    q: "Proč Řím nechal Hannibala v Itálii a vyslal vojsko přímo do Afriky?",
    key: "Protože útokem na Kartágo donutil Hannibala vrátit se domů a bránit ho",
    d: [
      ["Protože Hannibal už v Itálii prohrál u Kann a z Itálie utekl", "U Kann Hannibal vyhrál. Z Itálie neutekl, zůstal tam, dokud ho Kartágo nepovolalo domů."],
      ["Protože Řím chtěl v Africe dobýt Egypt a jeho bohaté obilí", "Scipio neútočil na Egypt, ale na Kartágo. Cílem bylo odlákat Hannibala z Itálie."],
      ["Protože Cato starší žádal zničení Kartága už během této války", "Catonův požadavek zazníval až před 3. punskou válkou, o padesát let později."],
    ],
    hints: [
      "Co udělá vojevůdce, když nepřítel ohrožuje jeho vlastní město? Zkus to domyslet z pohledu Kartága.",
      "Senátorův výrok patří až do doby před poslední válkou. Uvaž, jak silný byl Hannibal v Itálii a proč Kartágo povolalo svého nejlepšího vojevůdce zpátky.",
    ],
    explanation: "Hannibala se v Itálii porazit nedařilo. Scipio proto vytáhl do Afriky a ohrozil přímo Kartágo. To povolalo Hannibala domů a roku 202 př. n. l. ho Scipio porazil u Zamy.",
  },
  {
    q: "Proč Římané Středozemnímu moři později začali říkat „naše moře“?",
    key: "Protože po porážce Kartága na moři neměli silného soupeře",
    d: [
      ["Protože Středozemní moře jako první objevili a přepluli Římané", "Po Středozemním moři pluli Féničané, Řekové i Egypťané dávno před Římany."],
      ["Protože jim Kartágo moře po Zamě darovalo ve smlouvě o míru", "Moře se smlouvou darovat nedá. Rozhodlo, kdo ho svým loďstvem skutečně ovládal."],
      ["Protože Římané založili všechna města na jeho pobřeží", "Města na pobřeží zakládali i Féničané a Řekové, třeba Kartágo nebo Korint. Římané je většinou dobyli."],
    ],
    hints: [
      "Komu moře patřilo před punskými válkami a komu po nich?",
      "Moře se smlouvou darovat nedá, rozhoduje, kdo ho skutečně ovládá. Co se stalo s jediným silným námořním soupeřem Říma a čí pak byly břehy moře?",
    ],
    explanation: "Před punskými válkami vládlo západnímu Středomoří Kartágo. Porážkou Kartága Řím odstranil hlavního námořního soupeře. Když postupně ovládl celé pobřeží, začali Římané moři říkat naše moře.",
  },
  {
    q: "Kartágo i Athény byly silné na moři, Řím i Sparta hlavně na souši. Co museli Řím i Sparta udělat, aby svého soupeře porazili?",
    key: "Postavit si silné loďstvo a porazit soupeře i na moři",
    d: [
      ["Vyhnout se moři a vyhrát jen bitvami na souši", "Námořní mocnost se jen na souši porazit nedala. Řím vyhrál 1. punskou válku až bitvami na moři a Sparta rozhodla válku s Athénami také loďstvem."],
      ["Spojit se proti nim a bojovat společně", "Řím a Sparta se nikdy nespojily. Peloponéská válka skončila víc než sto let před první punskou válkou."],
      ["Dobýt nejdřív ostrovy, na kterých soupeři sídlili", "Kartágo leželo v severní Africe a Athény v Řecku, ne na ostrovech. Rozhodující bylo, kdo ovládne moře."],
    ],
    hints: [
      "V čem byli Kartaginci a Athéňané silnější než jejich soupeři? Tam je potřeba je porazit.",
      "Kartágo ani Athény neležely na ostrově. Vzpomeň si, co musel Řím udělat v 1. punské válce, než mohl s Kartágem bojovat o Sicílii, a jak skončila válka Athén se Spartou.",
    ],
    explanation: "Kartágo i Athény byly námořní mocnosti a pozemní soupeř je nemohl porazit, dokud je nepřekonal i na moři. Řím si v 1. punské válce postavil loďstvo. Sparta si loďstvo postavila s pomocí perských peněz a jeho vítězství rozhodlo peloponéskou válku.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  return pickN(pool, pool.length).map(build);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const PUNSKE_VALKY_DOBYTI_STREDOMORI: TopicMetadata[] = [
  {
    id: "g6-dej-punske-valky-dobyti-stredomori-6",
    rvpNodeId: "g6-dejepis-starovek-antika-rim-punske-valky-dobyti-stredomori",
    displayName: "Punské války a dobytí Středomoří",
    title: "Punské války, dobytí Středomoří",
    studentTitle: "Řím proti Kartágu",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řím",
    briefDescription: "Hannibal, sloni v Alpách, Kanny, Zama a jak Řím ovládl Středomoří.",
    keywords: [
      "punské války", "Kartágo", "Punové", "Féničané", "Hannibal", "Scipio", "Hamilkar Barkas",
      "Cato starší", "Sicílie", "Hispánie", "Alpy", "Kanny", "Zama", "provincie", "naše moře", "Korint",
    ],
    goals: [
      "Zařadit osobnost, bitvu nebo událost do správné punské války a na správnou stranu.",
      "Určit pořadí událostí a rozdíl letopočtů před naším letopočtem.",
      "Vysvětlit, proč Řím Kartágo porazil a jak díky tomu ovládl Středomoří.",
    ],
    boundaries: [
      "Jen nesporná učebnicová fakta; počty slonů a vojáků, solení půdy ani Hannibalova přísaha nejsou klíčem.",
      "Caesar, Alexandr Veliký a řecké války se objevují jen jako distraktory.",
      "Letopočty vždy s „př. n. l.“, počítá se jen s celými čísly.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "1. punská válka 264–241 př. n. l.: o Sicílii, Řím staví loďstvo. 2. punská válka 218–201: Hannibal z Hispánie přes Alpy, vítězí u Kann 216, Scipio ho porazí u Zamy 202. 3. punská válka 149–146: Cato starší, Kartágo zničeno 146, téhož roku Korint.",
      steps: [
        "Najdi v zadání jméno, místo nebo letopočet.",
        "Rozhodni, o kterou ze tří válek jde a na které straně osoba stála.",
        "U letopočtů před n. l. pamatuj: vyšší číslo = dřív, rozdíl se odečítá.",
        "U příčin ověř, že příčina proběhla před tím, co způsobila.",
      ],
      commonMistake: "Myslet si, že Kanny vyhrál Řím, nebo že událost s menším letopočtem př. n. l. proběhla dřív.",
      example: "Začátek 1. punské války 264 a přechod Alp 218 př. n. l.: 264 − 218 = 46, válka začala o 46 let dřív.",
    },
  },
];
