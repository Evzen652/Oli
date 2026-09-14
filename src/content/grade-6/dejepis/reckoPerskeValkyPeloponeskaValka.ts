/**
 * Dějepis 6. ročník — Řecko-perské války a peloponéská válka (select_one).
 *
 * Faktický vzor (mezopotamie / starovekyEgypt): pevné banky úloh, každá s vlastní
 * malou i velkou nápovědou, vysvětlením PROČ a optionFeedback. Generátor vrací
 * celou banku zamíchanou, takže na každé úrovni je vždy ≥ 12 různých úloh.
 *
 * Chybový model — každý distraktor je jeden typický omyl:
 *  1. záměna perských králů (Dáreios I. = Marathón 490, Xerxés = Thermopyly a Salamína 480);
 *  2. záměna řeckých osobností (Miltiadés = Marathón, Leónidás = Thermopyly,
 *     Themistoklés = Salamína, Periklés a Lýsandros = peloponéská válka);
 *  3. smíchání dvou válek (Řekové proti Persii × Athény proti Spartě);
 *  4. letopočty př. n. l. čtené jako n. l. (vyšší číslo = později), rok navíc/ubraný,
 *     zapomenutá vypůjčená desítka a hrdinská porážka u Thermopyl brána jako vítězství.
 *
 *  • L1 — zapamatování: jedna vazba fakt → fakt (osoba, místo, spolek, vítěz).
 *  • L2 — použití: popis bez jména → bitva / válka / osoba; pořadí a rozdíl letopočtů.
 *  • L3 — analýza: příčina, důsledek, srovnání válek, parafráze dějepisce, „co by“.
 *
 * Sporné údaje (běžec z Marathónu, počty vojáků, rok vzniku délského spolku)
 * na klíč nejdou.
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
    q: "Který perský král poslal výpravu, jež skončila bitvou u Marathónu?",
    key: "Dáreios I.",
    d: [
      ["Xerxés", "Xerxés vedl až druhou, větší výpravu o deset let později. K Marathónu poslal vojsko jeho otec."],
      ["Miltiadés", "Miltiadés u Marathónu opravdu byl, ale na straně Řeků. Velel Athéňanům, kteří Peršany porazili."],
      ["Kýros Veliký", "Kýros Veliký perskou říši založil, ale zemřel desítky let před řecko-perskými válkami (530 př. n. l.)."],
    ],
    hints: [
      "Hledej perského panovníka, který vojsko vyslal, ne řeckého vojevůdce. Marathón ukončil první velkou perskou výpravu proti Athénám.",
      "Zakladatel říše zemřel desítky let před válkami s Řeky a známější král vedl osobně až druhou výpravu. Hledej jeho otce, který chtěl Athény potrestat za pomoc vzbouřeným řeckým městům.",
    ],
    explanation: "Výpravu, která skončila porážkou u Marathónu (490 př. n. l.), poslal perský král Dáreios I. Jeho syn Xerxés vedl druhou výpravu roku 480 př. n. l., Kýros Veliký žil dřív a Miltiadés velel Athéňanům.",
  },
  {
    q: "Kdo velel Sparťanům u Thermopyl?",
    key: "Leónidás",
    d: [
      ["Miltiadés", "Miltiadés byl athénský vojevůdce a proslavil se o deset let dřív u Marathónu."],
      ["Themistoklés", "Themistoklés byl Athéňan a velel lodím. Proslavil se v námořní bitvě u Salamíny."],
      ["Lýsandros", "Lýsandros byl sice Sparťan, ale žil o víc než půl století později a bojoval proti Athénám v peloponéské válce."],
    ],
    hints: [
      "U Thermopyl bránil průsmyk spartský král se svou družinou. Hledej Sparťana z doby perských válek.",
      "Athénské vojevůdce vyřaď, velitel u Thermopyl byl Sparťan. Jeden spartský vojevůdce ale patří až do války Sparty s Athénami. Hledej krále, který v průsmyku padl i se svými muži.",
    ],
    explanation: "U Thermopyl (480 př. n. l.) velel spartský král Leónidás, který v bitvě padl. Miltiadés vedl Athéňany u Marathónu, Themistoklés loďstvo u Salamíny a Lýsandros bojoval až v peloponéské válce.",
  },
  {
    q: "Který athénský vojevůdce vedl Řeky k vítězství u Marathónu?",
    key: "Miltiadés",
    d: [
      ["Themistoklés", "Themistoklés byl také Athéňan, ale proslavil se o deset let později loďstvem u Salamíny."],
      ["Leónidás", "Leónidás byl spartský král a padl u Thermopyl. Sparťané k Marathónu dorazili až po bitvě."],
      ["Periklés", "Periklés vedl Athény až o dvě generace později, na začátku peloponéské války."],
    ],
    hints: [
      "U Marathónu bojovali hlavně Athéňané. Hledej athénského vojevůdce z první perské výpravy.",
      "Spartského krále vyřaď, Sparťané přišli pozdě. Jeden Athéňan velel lodím až o deset let později a jiný vedl Athény až ve válce se Spartou. Zbývá velitel pozemní bitvy roku 490 př. n. l.",
    ],
    explanation: "U Marathónu (490 př. n. l.) vedl Athéňany k vítězství Miltiadés. Themistoklés se proslavil až u Salamíny, Leónidás padl u Thermopyl a Periklés vedl Athény v peloponéské válce.",
  },
  {
    q: "Kdo prosadil stavbu athénského loďstva před druhou perskou výpravou?",
    key: "Themistoklés",
    d: [
      ["Miltiadés", "Miltiadés zvítězil na souši u Marathónu. Loďstvo prosadil jiný athénský politik."],
      ["Leónidás", "Leónidás byl spartský král, o athénských lodích nerozhodoval. Padl u Thermopyl."],
      ["Periklés", "Periklés vedl Athény až později. Loďstvo, které zdědil, vzniklo před bitvou u Salamíny."],
    ],
    hints: [
      "Loďstvo se stavělo mezi první a druhou perskou výpravou. Hledej Athéňana, jehož plán se osvědčil v námořní bitvě.",
      "Spartský král o athénských lodích nerozhodoval a vítěz od Marathónu bojoval na souši. Politik z doby peloponéské války žil později. Hledej toho, kdo pak u Salamíny vedl athénské lodě.",
    ],
    explanation: "Stavbu loďstva prosadil Themistoklés a jeho lodě pak roku 480 př. n. l. zvítězily u Salamíny. Miltiadés vyhrál pozemní bitvu u Marathónu, Leónidás byl spartský král a Periklés žil později.",
  },
  {
    q: "Který perský král vedl druhou velkou výpravu do Řecka roku 480 př. n. l.?",
    key: "Xerxés",
    d: [
      ["Dáreios I.", "Dáreios I. poslal první výpravu, která skončila u Marathónu. Druhou vedl až jeho syn."],
      ["Kýros Veliký", "Kýros Veliký perskou říši založil, ale zemřel desítky let před řecko-perskými válkami (530 př. n. l.)."],
      ["Leónidás", "Leónidás nebyl perský, ale spartský král. Proti druhé perské výpravě bojoval u Thermopyl."],
    ],
    hints: [
      "Druhá výprava přišla deset let po Marathónu. Vedl ji nový král, ne ten, kdo poslal první.",
      "Zakladatel říše žil dřív a spartský král stál na straně Řeků. Z perských králů hledej syna toho, jehož vojsko prohrálo u Marathónu.",
    ],
    explanation: "Druhou výpravu roku 480 př. n. l. vedl osobně král Xerxés, syn Dáreia I. Dáreios poslal první výpravu k Marathónu, Kýros Veliký žil dřív a Leónidás byl spartský král.",
  },
  {
    q: "Kde se bojovalo v bitvě u Salamíny?",
    key: "Na moři mezi loďstvy",
    d: [
      ["V úzkém horském průsmyku", "Úzký průsmyk mezi horami a mořem bránili Řekové u Thermopyl, ne u Salamíny."],
      ["Na pláni u mořského břehu", "Na pláni u moře se bojovalo u Marathónu. U Salamíny proti sobě stály lodě."],
      ["Pod hradbami Athén", "Obyvatelé Athény před Peršany opustili a rozhodlo se jinde. U Salamíny bojovaly lodě."],
    ],
    hints: [
      "Salamína je ostrov kousek od Athén. Vzpomeň si, na co Athéňané před touto bitvou vydali peníze.",
      "Průsmyk patří k Thermopylám a pláň u břehu k Marathónu. Athéňané opustili město a spolehli se na zbraň, kterou Themistoklés prosadil. Kde se s ní bojuje?",
    ],
    explanation: "U Salamíny (480 př. n. l.) se svedla námořní bitva: řecké lodě porazily perskou flotilu v úžině u ostrova. Průsmyk patří k Thermopylám, pláň k Marathónu a Athény obyvatelé předtím opustili.",
  },
  {
    q: "Kdo proti sobě stál v peloponéské válce?",
    key: "Athény se spojenci proti Spartě",
    d: [
      ["Řecké obce proti Perské říši", "To byly řecko-perské války. V peloponéské válce bojovali Řekové proti Řekům."],
      ["Sparta s Athénami proti Persii", "Proti Persii stály Sparta a Athény spolu v perských válkách. V peloponéské válce se obrátily proti sobě."],
      ["Řecké obce proti Makedonii", "Makedonie ovládla Řecko až za Filipa II. a Alexandra Velikého, dlouho po peloponéské válce."],
    ],
    hints: [
      "Peloponéská válka byla válka Řeků mezi sebou. Hledej dvě nejsilnější řecké obce.",
      "Proti Peršanům bojovali Řekové spolu, ta válka je starší. Makedonie přišla na řadu až později. Hledej dvojici, v níž na jedné straně stojí námořní mocnost a na druhé obec slavných pěšáků.",
    ],
    explanation: "V peloponéské válce (431–404 př. n. l.) bojovaly Athény s délským spolkem proti Spartě a jejímu peloponéskému spolku. Proti Persii stáli Řekové spolu dřív, Makedonie Řecko ovládla až později.",
  },
  {
    q: "Který dějepisec popsal peloponéskou válku?",
    key: "Thúkydidés",
    d: [
      ["Hérodotos", "Hérodotos popsal starší války Řeků s Peršany. Peloponéskou válku sepsal Athéňan, který v ní sám bojoval."],
      ["Homér", "Homér je básník Iliady a Odyssey, které vyprávějí o trojské válce. Dějepisec to nebyl."],
      ["Periklés", "Periklés válku vedl jako politik, ale nepopsal ji. Zemřel na mor na jejím začátku."],
    ],
    hints: [
      "Hledej dějepisce, ne politika ani básníka. Sám ve válce Athén se Spartou bojoval jako velitel.",
      "Básník vyprávěl o Tróji a politik válku řídil, ale nesepsal. Ze dvou dějepisců jeden popsal starší války s Peršany. Zbývá ten, kdo pátral po příčinách války Řeků mezi sebou.",
    ],
    explanation: "Peloponéskou válku popsal athénský dějepisec Thúkydidés, který v ní sám velel. Hérodotos psal o perských válkách, Homér byl básník a Periklés politik.",
  },
  {
    q: "Který dějepisec popsal války Řeků s Peršany?",
    key: "Hérodotos",
    d: [
      ["Thúkydidés", "Thúkydidés popsal pozdější peloponéskou válku, ne války s Peršany."],
      ["Homér", "Homér je básník trojské války a žil staletí před perskými válkami."],
      ["Sókratés", "Sókratés byl athénský filozof. Nic nesepsal, jeho myšlenky známe od žáků."],
    ],
    hints: [
      "Tomuto dějepisci se říká „otec dějepisu“. Cestoval po světě a zapisoval, co se dozvěděl o Peršanech a Řecích.",
      "Filozof nepsal a básník žil mnohem dřív. Ze dvou dějepisců jeden popsal válku Athén se Spartou. Hledej toho staršího, který se narodil v Malé Asii.",
    ],
    explanation: "Války Řeků s Peršany popsal Hérodotos, „otec dějepisu“. Thúkydidés psal o peloponéské válce, Homér byl básník trojské války a Sókratés filozof.",
  },
  {
    q: "Jak se jmenoval spolek řeckých obcí vedený Athénami?",
    key: "Délský námořní spolek",
    d: [
      ["Peloponéský spolek", "Peloponéský spolek vedla Sparta. Právě s ním Athény v peloponéské válce bojovaly."],
      ["Korintský spolek", "Korintský spolek založil až makedonský král Filip II., víc než sto let po perských válkách."],
      ["Boiótský spolek", "Boiótský spolek vedly Théby, ne Athény."],
    ],
    hints: [
      "Spolek vznikl po vítězství nad Peršany a jeho pokladna ležela zprvu na ostrově v Egejském moři.",
      "Athény byly námořní mocnost a jejich spolek chránil moře. Spolek pojmenovaný po poloostrově vedla Sparta, jiný vznikl až za Makedonců a další vedly Théby. Hledej název, který odkazuje na ostrov i na moře.",
    ],
    explanation: "Po perských válkách vedly Athény délský námořní spolek, pojmenovaný po ostrově Délos, kde byla zprvu pokladna. Peloponéský spolek vedla Sparta, Korintský spolek vznikl až za Makedonců a Boiótský spolek vedly Théby.",
  },
  {
    q: "Jak se jmenoval spolek, v jehož čele stála Sparta?",
    key: "Peloponéský spolek",
    d: [
      ["Délský námořní spolek", "Délský námořní spolek vedly Athény. Sparta do něj nepatřila."],
      ["Korintský spolek", "Korint byl spartským spojencem, ale Korintský spolek založil až makedonský král Filip II. mnohem později."],
      ["Boiótský spolek", "Boiótský spolek vedly Théby, ne Sparta."],
    ],
    hints: [
      "Sparta ležela na jihu Řecka na velkém poloostrově. Podle něj se spolek jmenoval.",
      "Námořní spolek vedly Athény, další spolek vznikl až za Makedonců a Boiótský spolek patřil Thébám. Hledej název podle krajiny, v níž Sparta ležela.",
    ],
    explanation: "Sparta vedla peloponéský spolek, pojmenovaný po poloostrově Peloponés. Délský námořní spolek vedly Athény, Korintský spolek vznikl až za Makedonců a Boiótský spolek vedly Théby.",
  },
  {
    q: "Kde padl Leónidás se svými Sparťany?",
    key: "U Thermopyl",
    d: [
      ["U Marathónu", "U Marathónu bojovali o deset let dřív hlavně Athéňané a zvítězili. Sparťané dorazili až po bitvě."],
      ["U Salamíny", "U Salamíny se bojovalo na moři a Řekové vyhráli. Leónidás tou dobou už nežil."],
      ["U Platají", "U Platají Sparťané o rok později Peršany porazili, ale vedl je jiný velitel."],
    ],
    hints: [
      "Leónidás bránil s malým oddílem úzký průsmyk mezi horami a mořem.",
      "Marathón a Plataje byly vítězné pozemní bitvy, u ostrova bojovaly lodě. Hledej místo, kde Řekové prohráli, protože zrádce ukázal Peršanům horskou stezku.",
    ],
    explanation: "Leónidás padl roku 480 př. n. l. v průsmyku u Thermopyl, když obránce obešli Peršané horskou stezkou. Marathón a Plataje byly řecká vítězství na souši, u Salamíny zvítězily lodě.",
  },
  {
    q: "Kde Athéňané porazili Peršany roku 490 př. n. l.?",
    key: "U Marathónu",
    d: [
      ["U Thermopyl", "U Thermopyl se bojovalo o deset let později a Řekové prohráli."],
      ["U Salamíny", "U Salamíny zvítězily řecké lodě až roku 480 př. n. l."],
      ["U Platají", "U Platají Řekové porazili Peršany až roku 479 př. n. l."],
    ],
    hints: [
      "Rok 490 př. n. l. patří k první perské výpravě. Vzpomeň si, kde se vylodilo vojsko krále Dáreia.",
      "Bitvy u průsmyku a u ostrova patří k druhé výpravě o deset let později a Plataje ještě o rok později. Hledej pláň u moře severovýchodně od Athén.",
    ],
    explanation: "Roku 490 př. n. l. porazili Athéňané Peršany u Marathónu. Thermopyly a Salamína patří k druhé výpravě (480 př. n. l.), Plataje k roku 479 př. n. l.",
  },
  {
    q: "Který athénský politik vedl Athény na začátku peloponéské války?",
    key: "Periklés",
    d: [
      ["Themistoklés", "Themistoklés vedl Athény v perských válkách. Za peloponéské války už nežil."],
      ["Miltiadés", "Miltiadés zvítězil u Marathónu, o dvě generace dřív."],
      ["Lýsandros", "Lýsandros nebyl Athéňan, ale spartský vojevůdce, který Athény na konci války porazil."],
    ],
    hints: [
      "Tento politik vedl Athény v době jejich největšího rozkvětu a dal postavit chrámy na Akropoli.",
      "Dva Athéňané v nabídce patří do perských válek a jeden vojevůdce byl Sparťan. Hledej politika, který radil Athéňanům schovat se za hradby a zemřel na mor.",
    ],
    explanation: "Na začátku peloponéské války vedl Athény Periklés, který zemřel na mor. Themistoklés a Miltiadés patří do perských válek a Lýsandros byl spartský vojevůdce.",
  },
  {
    q: "Který spartský vojevůdce porazil athénské loďstvo na konci peloponéské války?",
    key: "Lýsandros",
    d: [
      ["Leónidás", "Leónidás byl spartský král, ale padl u Thermopyl v perských válkách, dávno předtím."],
      ["Themistoklés", "Themistoklés byl Athéňan a s loďstvem porazil Peršany, ne Athény."],
      ["Periklés", "Periklés byl athénský politik, stál na straně Athén a zemřel na začátku války."],
    ],
    hints: [
      "Hledej Sparťana, a to z konce války Sparty s Athénami, ne z doby perských válek.",
      "Dva muži v nabídce byli Athéňané. Spartský král z nabídky padl už v perských válkách. Zbývá velitel, který za perské peníze postavil spartské lodě.",
    ],
    explanation: "Athénské loďstvo zničil spartský vojevůdce Lýsandros a roku 404 př. n. l. se Athény vzdaly. Leónidás padl u Thermopyl, Themistoklés a Periklés byli Athéňané.",
  },
  {
    q: "Který stát zvítězil v peloponéské válce?",
    key: "Sparta",
    d: [
      ["Athény", "Athény ovládaly moře, ale válku prohrály. Roku 404 př. n. l. se musely vzdát."],
      ["Perská říše", "Persie platila lodě jedné straně, ale válku vedli a vybojovali Řekové mezi sebou."],
      ["Théby", "Théby byly jen spojencem vítězné strany. Hlavní silou Řecka se staly až později."],
    ],
    hints: [
      "Válka skončila tím, že se jedna ze dvou hlavních obcí musela vzdát a zbořit hradby.",
      "Persie dávala peníze a Théby byly jen spojencem. Ze dvou hlavních soupeřů prohrál ten, kdo přišel o celé loďstvo a jehož město bylo obleženo.",
    ],
    explanation: "Peloponéskou válku vyhrála Sparta. Athény přišly o loďstvo a roku 404 př. n. l. se vzdaly. Persie jen platila lodě a Théby byly spojencem.",
  },
];

// ── L2 — použití (popis bez jména, zařazení k válce, pořadí a rozdíl let) ───
const VALKY_FB = {
  perske: "K řecko-perským válkám",
  pel: "K peloponéské válce",
  troj: "K trojské válce",
  alex: "K výpravám Alexandra Velikého",
};

interface Udalost {
  label: string; // na začátku možnosti
  nom: string; // uvnitř věty
  rok: number; // př. n. l.
}
const U = {
  ionske: { label: "Začátek iónského povstání", nom: "začátek iónského povstání", rok: 499 },
  marathon: { label: "Bitva u Marathónu", nom: "bitva u Marathónu", rok: 490 },
  salamina: { label: "Bitva u Salamíny", nom: "bitva u Salamíny", rok: 480 },
  zacatekPel: { label: "Začátek peloponéské války", nom: "začátek peloponéské války", rok: 431 },
} satisfies Record<string, Udalost>;

/** Odčítání vyžaduje přechod přes desítku (jednotky menšence < jednotky menšitele). */
const prechod = (vetsi: number, mensi: number) => vetsi % 10 < mensi % 10;

/** „Co bylo dřív a o kolik“: [první uvedená, druhá uvedená]. */
function poradi(a: Udalost, b: Udalost): Uloha {
  const [driv, pozdeji] = a.rok > b.rok ? [a, b] : [b, a];
  const rozdil = driv.rok - pozdeji.rok;
  // blízká chyba: zapomenutá vypůjčená desítka, jinak rok navíc
  const vypujcka = prechod(driv.rok, pozdeji.rok);
  const spatne = vypujcka ? rozdil + 10 : rozdil + 1;
  const chybaRozdilu = vypujcka
    ? "při přechodu přes desítku se zapomnělo ubrat vypůjčenou desítku"
    : "připočetl se jeden rok navíc, přitom rozdíl letopočtů už sám udává, kolik let uplynulo";
  const moznost = (u: Udalost, n: number) => `${u.label}, o ${pad(n, "ROK")} dřív`;
  return {
    q: `Co proběhlo dřív a o kolik let: ${a.nom} (${a.rok} př. n. l.), nebo ${b.nom} (${b.rok} př. n. l.)?`,
    key: moznost(driv, rozdil),
    d: [
      [moznost(pozdeji, rozdil), "Rozdíl sedí, ale pořadí ne. Letopočty se četly jako v našem letopočtu, kde vyšší číslo znamená později. Před naším letopočtem se počítá pozpátku, takže vyšší číslo je dřív."],
      [moznost(driv, spatne), `Pořadí sedí, ale rozdíl ne: ${chybaRozdilu}.`],
      [moznost(pozdeji, spatne), `Tady jsou chyby dvě: vyšší číslo před naším letopočtem znamená dřív a u rozdílu se ${vypujcka ? "zapomnělo ubrat vypůjčenou desítku" : "připočetl rok navíc"}.`],
    ],
    hints: [
      `Oba letopočty jsou před naším letopočtem. Rozmysli si, jestli rok ${a.rok} př. n. l. leží blíž k narození Krista, nebo dál než rok ${b.rok} př. n. l.`,
      `Před naším letopočtem se roky počítají pozpátku, proto má dřívější událost vyšší číslo. Když ${a.nom} i ${b.nom} leží na stejné straně od narození Krista, rozdíl zjistíš odečtením menšího letopočtu od většího.`,
    ],
    explanation: `Před naším letopočtem se počítá pozpátku, takže vyšší číslo znamená dřívější rok. Dřív je proto ${driv.nom} (${driv.rok} př. n. l.). Oba roky jsou na stejné straně od narození Krista, a tak se odečítají: rozdíl je ${pad(rozdil, "ROK")}.`,
    steps: [
      `Oba roky jsou před n. l., vyšší číslo znamená dřív: ${driv.rok} > ${pozdeji.rok}.`,
      `Rozdíl: ${driv.rok} − ${pozdeji.rok} = ${rozdil}.`,
      `Dřív je ${driv.nom}, o ${pad(rozdil, "ROK")}.`,
    ],
  };
}

/** Kolik let uplynulo mezi dvěma roky př. n. l. (od → do). */
function delka(q: string, od: number, doRoku: number): Uloha {
  const n = od - doRoku;
  const vypujcka = prechod(od, doRoku);
  const d: [string, string][] = [
    [pad(n + 1, "ROK"), "Tady se připočetl jeden rok navíc. Rozdíl letopočtů už sám udává, kolik let uplynulo."],
    [pad(n - 1, "ROK"), "Tady se jeden rok ubral. Rozdíl letopočtů přímo udává, kolik let uplynulo."],
  ];
  d.push(
    vypujcka
      ? [pad(n + 10, "ROK"), `Chyba při odčítání: u jednotek ${od % 10} − ${doRoku % 10} nejde bez vypůjčení desítky a vypůjčená desítka se pak zapomněla ubrat.`]
      : [pad(n + 2, "ROK"), "Tady se přidaly dva roky navíc, jako by se počítal celý první i celý poslední rok. Rozdíl letopočtů už sám udává, kolik let uplynulo."],
  );
  return {
    q,
    key: pad(n, "ROK"),
    d,
    hints: [
      `Oba roky (${od} i ${doRoku} př. n. l.) jsou na stejné straně od narození Krista. Mají se v tom případě sčítat, nebo odečítat?`,
      `Od vyššího letopočtu (${od} př. n. l.) odečti nižší (${doRoku} př. n. l.).${vypujcka ? ` U jednotek ${od % 10} − ${doRoku % 10} nejde bez vypůjčení, pohlídej přechod přes desítku.` : ""} Nic nepřičítej ani neubírej.`,
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
    q: "Malý řecký oddíl bránil úzký průsmyk mezi horami a mořem, dokud ho zrada neobešla. O kterou bitvu šlo?",
    key: "O bitvu u Thermopyl",
    d: [
      ["O bitvu u Marathónu", "U Marathónu se bojovalo na otevřené pláni a Řekové zvítězili."],
      ["O bitvu u Salamíny", "U Salamíny se bojovalo na moři, ne v horském průsmyku."],
      ["O bitvu u Platají", "U Platají svedlo velké řecké vojsko vítěznou bitvu na souši. Nebyl to malý oddíl v průsmyku."],
    ],
    hints: [
      "Všimni si místa: úzký průsmyk mezi horami a mořem. Která bitva se svedla právě tam?",
      "Pláň, moře a vítězství velkého vojska vyřaď. Hledej bitvu druhé perské výpravy, v níž obránci prohráli, když je Peršané obešli horskou stezkou.",
    ],
    explanation: "Průsmyk mezi horami a mořem bránili Řekové s Leónidem u Thermopyl (480 př. n. l.). Zrádce ukázal Peršanům stezku, obránci, kteří zůstali s Leónidem, byli obklíčeni a většinou padli. Marathón byl na pláni, Salamína na moři a Plataje velké vítězství na souši.",
  },
  {
    q: "Řecké lodě vlákaly perskou flotilu do úzké úžiny u ostrova nedaleko Athén a rozbily ji. O kterou bitvu šlo?",
    key: "O bitvu u Salamíny",
    d: [
      ["O bitvu u Thermopyl", "U Thermopyl se bránil průsmyk na souši a Řekové prohráli."],
      ["O bitvu u Marathónu", "U Marathónu bojovali pěšáci na pláni, ne lodě."],
      ["O bitvu u Platají", "U Platají se bojovalo na souši, rok po námořní bitvě."],
    ],
    hints: [
      "Rozhoduje, že bojovaly lodě. Která z nabízených bitev byla námořní?",
      "Průsmyk, pláň i Plataje jsou pozemní bitvy. Hledej vítězství loďstva, které Athéňanům prosadil Themistoklés.",
    ],
    explanation: "Námořní vítězství v úžině u ostrova nedaleko Athén je bitva u Salamíny (480 př. n. l.). Ostatní tři bitvy se odehrály na souši.",
  },
  {
    q: "Athéňané téměř bez pomoci ostatních Řeků porazili na pláni u moře vojsko, které poslal Dáreios I. O kterou bitvu šlo?",
    key: "O bitvu u Marathónu",
    d: [
      ["O bitvu u Thermopyl", "U Thermopyl už Peršany vedl Xerxés a Řekové prohráli."],
      ["O bitvu u Salamíny", "U Salamíny bojovaly lodě proti vojsku Xerxa, ne pěšáci na pláni."],
      ["O bitvu u Platají", "U Platají bojovala spojená řecká vojska a Peršany už vedli Xerxovi velitelé."],
    ],
    hints: [
      "Dáreios I. poslal na Řecko první výpravu. Která bitva ji ukončila?",
      "Druhou výpravu vedl až Xerxés a patří k ní průsmyk, námořní bitva i závěrečná bitva o rok později. Hledej bitvu z roku 490 př. n. l.",
    ],
    explanation: "Vojsko Dáreia I. porazili Athéňané roku 490 př. n. l. u Marathónu. Thermopyly, Salamína a Plataje patří k druhé výpravě, kterou vedl Xerxés.",
  },
  {
    q: "Ve přeplněném městě za hradbami vypukl mor a zemřel na něj i Periklés. Ke které válce ta událost patří?",
    key: VALKY_FB.pel,
    d: [
      [VALKY_FB.perske, "V perských válkách Periklés ještě Athény nevedl. Mor přišel až ve válce Athén se Spartou."],
      [VALKY_FB.troj, "Trojská válka je mnohem starší a známe ji hlavně z Homérových eposů."],
      [VALKY_FB.alex, "Alexandr Veliký žil o sto let později a Periklés byl dávno mrtvý."],
    ],
    hints: [
      "Pomůže ti jméno. Kdy vedl Periklés Athény?",
      "Lidé z venkova utekli za hradby, protože nepřátelské pozemní vojsko pustošilo okolí. Kdo byl tehdy nepřítel Athén: Peršané, nebo jiní Řekové?",
    ],
    explanation: "Mor v přeplněných Athénách (430 př. n. l.), na který zemřel i Periklés, patří k peloponéské válce. Lidé z venkova se tehdy schovali za hradby před spartským vojskem.",
  },
  {
    q: "Spartský vojevůdce Lýsandros zničil athénské loďstvo a Athény se musely vzdát. Ke které válce ta událost patří?",
    key: VALKY_FB.pel,
    d: [
      [VALKY_FB.perske, "V perských válkách Sparta a Athény bojovaly na stejné straně, ne proti sobě."],
      [VALKY_FB.troj, "Trojská válka je pověst o Řecích proti Tróji. Athény a Sparta v ní soupeři nebyli."],
      [VALKY_FB.alex, "Za Alexandra Velikého už Řecko ovládala Makedonie. Porážka Athén Spartou je starší."],
    ],
    hints: [
      "Kdo tu bojuje proti komu? Jde o nepřítele zvenčí, nebo o Řeky proti Řekům?",
      "Sparta a Athény bojovaly proti Peršanům spolu. Když Sparťan poráží Athéňany, patří událost do války, v níž se obě obce obrátily proti sobě.",
    ],
    explanation: "Lýsandros zničil athénské loďstvo na konci peloponéské války a roku 404 př. n. l. se Athény vzdaly. V perských válkách stály Sparta a Athény na stejné straně.",
  },
  {
    q: "Perský král Xerxés dal přes mořskou úžinu postavit most z lodí, aby převedl vojsko do Evropy. Ke které válce ta událost patří?",
    key: VALKY_FB.perske,
    d: [
      [VALKY_FB.pel, "V peloponéské válce Persie jen posílala Spartě peníze. Perský král do Řecka s vojskem netáhl."],
      [VALKY_FB.troj, "Trojská válka je o staletí starší a Peršané v ní nevystupují."],
      [VALKY_FB.alex, "Alexandr Veliký táhl opačně, z Evropy na Persii, a to skoro o sto padesát let později."],
    ],
    hints: [
      "Pomůže ti jméno panovníka. Proti komu Xerxés táhl?",
      "Ve válce Athén se Spartou perský král sám do Evropy netáhl. Trojská válka a Alexandr patří jiným dobám. Hledej válku, v níž Peršané vpadli do Řecka.",
    ],
    explanation: "Most z lodí dal postavit Xerxés, když roku 480 př. n. l. vedl druhou výpravu proti Řekům. Patří tedy k řecko-perským válkám.",
  },
  {
    q: "Řecká města v Malé Asii se vzbouřila proti perské nadvládě a Athény jim poslaly lodě na pomoc. Ke které válce ta událost vedla?",
    key: VALKY_FB.perske,
    d: [
      [VALKY_FB.pel, "Peloponéská válka byla válka Athén se Spartou. Povstání proti Peršanům ji nezpůsobilo."],
      [VALKY_FB.troj, "Trojská válka s perskou nadvládou nesouvisí, je to mnohem starší pověst."],
      [VALKY_FB.alex, "Alexandr sice Malou Asii Peršanům vzal, ale až o víc než sto šedesát let později."],
    ],
    hints: [
      "Proti komu se města vzbouřila? Kdo se pak chtěl Athénám pomstít?",
      "Perský král chtěl Athény potrestat za pomoc vzbouřencům a poslal na Řecko vojsko. Povstání tak stojí na začátku válek, jejichž první velká bitva byla u Marathónu.",
    ],
    explanation: "Iónské povstání (499–494 př. n. l.) a athénská pomoc vzbouřencům vedly k řecko-perským válkám: Dáreios I. chtěl Athény potrestat a poslal vojsko, které prohrálo u Marathónu.",
  },
  {
    q: "Sparťané v prvních letech války opakovaně pustošili pole v Attice a Athéňané se schovávali za hradbami. Ke které válce to patří?",
    key: VALKY_FB.pel,
    d: [
      [VALKY_FB.perske, "V perských válkách Sparťané Athéňanům pomáhali. Attiku tehdy pustošili Peršané, ne Sparťané."],
      [VALKY_FB.troj, "Trojská válka se vedla u Tróje v Malé Asii, ne v okolí Athén."],
      [VALKY_FB.alex, "Za Alexandra Velikého už Sparta s Athénami o moc nesoupeřila, Řecko ovládala Makedonie."],
    ],
    hints: [
      "Kdo tu komu ničí pole? Jsou to cizí nájezdníci, nebo sousední Řekové?",
      "Attika je krajina kolem Athén. Když ji pustoší spartské vojsko, nejde o obranu proti Persii, ale o válku dvou řeckých obcí.",
    ],
    explanation: "Spartské vojsko pustošilo Attiku na začátku peloponéské války. Periklés nechal Athéňany schovat se za hradby a spoléhal na loďstvo.",
  },
  poradi(U.marathon, U.ionske),
  poradi(U.salamina, U.zacatekPel),
  {
    q: "Seřaď události od nejstarší: bitva u Salamíny (480 př. n. l.), začátek iónského povstání (499 př. n. l.), začátek peloponéské války (431 př. n. l.). Které pořadí je správné?",
    key: "Iónské povstání, Salamína, peloponéská válka",
    d: [
      ["Peloponéská válka, Salamína, iónské povstání", "Tady se letopočty četly jako v našem letopočtu. Před naším letopočtem se počítá pozpátku, takže nejvyšší číslo je nejstarší."],
      ["Salamína, iónské povstání, peloponéská válka", "Tady se jen opsalo pořadí ze zadání. Události v něm nejsou seřazené podle letopočtů."],
      ["Iónské povstání, peloponéská válka, Salamína", "Iónské povstání je opravdu nejstarší, ale 480 př. n. l. je vyšší číslo než 431 př. n. l., takže Salamína byla dřív."],
    ],
    hints: [
      "Před naším letopočtem se roky počítají pozpátku. Která ze tří událostí má nejvyšší číslo?",
      "Nejstarší je událost s nejvyšším letopočtem, nejmladší s nejnižším. Porovnej 499, 480 a 431 př. n. l. a nepřebírej pořadí ze zadání.",
    ],
    explanation: "Vyšší letopočet před naším letopočtem znamená dřívější událost: 499 > 480 > 431. Nejdřív proto začalo iónské povstání (499 př. n. l.), pak byla bitva u Salamíny (480 př. n. l.) a nakonec začala peloponéská válka (431 př. n. l.).",
  },
  delka("Peloponéská válka trvala od roku 431 do roku 404 př. n. l. Kolik let trvala?", 431, 404),
  delka(
    "Kolik let uplynulo od bitvy u Marathónu (490 př. n. l.) do začátku peloponéské války (431 př. n. l.)?",
    490,
    431,
  ),
  {
    q: "Athéňané za peníze ze stříbrných dolů postavili lodě, protože se báli návratu vojska, které porazili u Marathónu. Ke které válce ta událost patří?",
    key: VALKY_FB.perske,
    d: [
      [VALKY_FB.pel, "V peloponéské válce už Athény silné loďstvo měly, ale postavily ho o víc než čtyřicet let dřív, když hrozil návrat Peršanů."],
      [VALKY_FB.troj, "Trojská válka je pověst o mnohem starší době a s bitvou u Marathónu nesouvisí."],
      [VALKY_FB.alex, "Alexandr Veliký žil o víc než sto let později. Athény tehdy o moc na moři nerozhodovaly."],
    ],
    hints: [
      "Rozhoduje Marathón. Kdo tam proti Athéňanům bojoval a čeho se Athény bály dál?",
      "U Marathónu Athéňané porazili vojsko, které poslal Dáreios I. Lodě se stavěly před jeho druhou výpravou, dlouho před válkou se Spartou. Do které války tedy patří?",
    ],
    explanation: "Stavbu lodí za peníze ze stříbrných dolů prosadil Themistoklés mezi bitvou u Marathónu a druhou perskou výpravou. Patří tedy k řecko-perským válkám a tyto lodě pak roku 480 př. n. l. zvítězily u Salamíny.",
  },
  {
    q: "Athénský dějepisec sám velel ve válce, kterou pak popsal, a pátral po jejích příčinách. Která událost patří do války, kterou popsal?",
    key: "Mor, na který v Athénách zemřel Periklés",
    d: [
      ["Bitva u Salamíny, kde lodě porazily Peršany", "Salamína patří do starších válek s Persií. Ty popsal Hérodotos, ne athénský velitel."],
      ["Dobytí Tróje pomocí dřevěného koně", "O Tróji vypráví pověst, kterou známe z Homérových eposů. Dějepisec ji nezažil."],
      ["Tažení Alexandra Velikého do Persie", "Alexandr Veliký žil o několik desítek let později, než athénský dějepisec psal."],
    ],
    hints: [
      "Nejdřív urči, kterou válku ten dějepisec popsal. Ve které válce Athéňané bojovali proti jiným Řekům?",
      "Dějepisec, který sám velel, psal o válce Athén se Spartou. Bitva s perskými loďmi patří starší válce, dřevěný kůň pověsti a Alexandr pozdější době.",
    ],
    explanation: "Athénský velitel a dějepisec Thúkydidés popsal peloponéskou válku (431–404 př. n. l.). Do ní patří mor v Athénách (430 př. n. l.), na který zemřel Periklés. Salamína patří k perským válkám, dobytí Tróje k pověsti a Alexandr žil později.",
  },
];

// ── L3 — analýza (příčina, důsledek, srovnání, dějepisec, „co by“) ─────────
const L3: Uloha[] = [
  {
    q: "Proč Themistoklův plán stavět lodě rozhodl válku s Persií?",
    key: "Protože lodě pak porazily perskou flotilu u Salamíny",
    d: [
      ["Protože lodě včas dopravily Sparťany k Thermopylám", "U Thermopyl se bojovalo na souši a Řekové tam prohráli. Válku rozhodlo vítězství lodí v jiné bitvě."],
      ["Protože lodě u Marathónu odrazily první perskou výpravu", "Marathón byl o deset let dřív a bojovalo se na souši. Loďstvo tehdy ještě nebylo postavené."],
      ["Protože lodě pak Athénám zajistily vítězství nad Spartou", "Athény peloponéskou válku prohrály a navíc to byla jiná, pozdější válka."],
    ],
    hints: [
      "Kdy se lodě stavěly a ve které bitvě se pak použily? Nejdřív si ujasni pořadí událostí.",
      "Loďstvo vzniklo až po první perské výpravě, takže na ni vliv mít nemohlo. V průsmyku se bojovalo na souši a Spartu Athény nakonec neporazily. Kde tedy nové lodě rozhodly?",
    ],
    explanation: "Themistoklés prosadil stavbu lodí po Marathónu. Roku 480 př. n. l. porazilo řecké loďstvo Peršany u Salamíny. Xerxés přišel o velkou část flotily, bez ní nemohl zásobovat obrovské vojsko a sám se vrátil do Asie. Rok nato Řekové porazili zbytek vojska u Platají.",
  },
  {
    q: "Proč vítězství nad Peršany nakonec vedlo ke sporu Athén se Spartou?",
    key: "Protože Athény v čele námořního spolku zbohatly a Sparta se jich bála",
    d: [
      ["Protože Athény zradily Spartu u Thermopyl a pustily Peršany dál", "U Thermopyl zradil místní Řek, který Peršanům ukázal stezku, ne Athény. Athény a Sparta tehdy bojovaly spolu."],
      ["Protože se Sparta hned po válce spojila s Peršany proti Athénám", "Perské peníze dostala Sparta až v závěru peloponéské války. Příčinou sporu to nebylo."],
      ["Protože Athény prohrály u Salamíny a svalily vinu na Spartu", "U Salamíny Řekové vyhráli. Spor vyrostl z vítězství, ne z porážky."],
    ],
    hints: [
      "Co Athény po válce získaly? Mysli na spolek obcí a na jeho pokladnu.",
      "Obě obce proti Peršanům bojovaly na stejné straně a u ostrova zvítězily. Po válce ale jedna z nich vedla spojence, vybírala od nich peníze a sílila. Jak se na to asi dívala druhá mocnost?",
    ],
    explanation: "Po vítězství nad Persií vedly Athény délský námořní spolek, vybíraly od spojenců peníze a staly se nejbohatší a nejmocnější obcí. Sparta se obávala jejich moci a napětí vyústilo v peloponéskou válku (431 př. n. l.).",
  },
  {
    q: "Proč Sparta nakonec vyhrála, přestože Athény ovládaly moře?",
    key: "Protože za perské peníze postavila lodě a athénské loďstvo zničila",
    d: [
      ["Protože ji Athény zradily u Thermopyl a přešly na stranu Peršanů", "U Thermopyl bojovaly Athény a Sparta proti Peršanům spolu. Peloponéská válka začala o půl století později."],
      ["Protože Athény samy rozpustily spolek a vzdaly se svých lodí", "Athény se spolku ani lodí dobrovolně nevzdaly. O loďstvo přišly v bitvě a spolek zanikl až s porážkou."],
      ["Protože Peršané sami dobyli Athény a předali je Spartě", "Athény vypálili Peršané roku 480 př. n. l., tedy v perských válkách. V peloponéské válce Persie jen platila."],
    ],
    hints: [
      "Athény byly silné na moři, Sparta na souši. Co Spartě chybělo, aby mohla Athény porazit?",
      "Sparta potřebovala loďstvo a na lodě neměla peníze. Kdo byl ochoten zaplatit, aby oslabil Athény? Mysli i na to, jak Athény předtím oslabila nemoc.",
    ],
    explanation: "Athény oslabil mor i dlouhá válka. Sparta dostala od Persie peníze, postavila loďstvo a Lýsandros athénské lodě zničil. Bez loďstva nemohly Athény dovážet obilí a roku 404 př. n. l. se vzdaly.",
  },
  {
    q: "Co mají řecko-perské války a peloponéská válka společné a čím se zásadně liší?",
    key: "Obě vedli Řekové, poprvé proti Persii, podruhé mezi sebou",
    d: [
      ["Obě vedli Řekové proti Persii, jen každou v jiném století", "Proti Persii byly jen řecko-perské války. V peloponéské válce stály Athény proti Spartě."],
      ["Obě vyhrály Athény, poprvé na souši, podruhé na moři", "Peloponéskou válku Athény prohrály, zvítězila Sparta."],
      ["Obě vedla Sparta proti Athénám, poprvé s pomocí Persie", "V perských válkách stály Sparta a Athény na stejné straně proti Persii."],
    ],
    hints: [
      "Pro každou válku si řekni, kdo proti komu stál a kdo vyhrál. Pak obě porovnej.",
      "V jedné válce přišel nepřítel zvenčí, ve druhé ne. Ověř u každé možnosti, zda sedí soupeři i vítěz v obou válkách zároveň.",
    ],
    explanation: "Obě války vedli Řekové. V řecko-perských válkách se spojili proti cizí říši a zvítězili, v peloponéské válce bojovali Athény a Sparta proti sobě a vyhrála Sparta.",
  },
  {
    q: "Dějepisec napsal, že válku nezpůsobily drobné spory, ale strach Sparty z rostoucí moci Athén. O které válce a o jaké příčině mluví?",
    key: "O peloponéské válce: Athény díky délskému spolku zbohatly a zesílily",
    d: [
      ["O řecko-perských válkách: Persie se bála rostoucí síly Athén", "Výrok mluví o strachu Sparty, ne Persie. V perských válkách stály Sparta a Athény na stejné straně."],
      ["O peloponéské válce: v Athénách vypukl mor a oslabil je", "Mor vypukl až ve druhém roce války. Nemohl ji tedy způsobit."],
      ["O peloponéské válce: Athény poslaly lodě na pomoc vzbouřeným Iónům", "Pomoc Athén vzbouřeným Iónům stála na začátku válek s Persií, ne války se Spartou."],
    ],
    hints: [
      "Kdo se ve výroku bojí koho? Stojí proti sobě Řekové a Peršané, nebo dvě řecké obce?",
      "Příčina musí přijít před válkou, ne během ní, a musí vysvětlit, proč by se Sparta bála. Co Athénám po vítězství nad Peršany přineslo peníze a sílu?",
    ],
    explanation: "Tak vysvětloval příčinu peloponéské války Thúkydidés: Athény v čele délského spolku zbohatly a zesílily a Sparta se jejich moci bála. Mor přišel až během války a pomoc Iónům patří k začátku válek s Persií.",
  },
  {
    q: "Dějepisec napsal, že Řekové šli do boje svobodně, zatímco vojáky velkého krále (tak Řekové říkali perskému panovníkovi) hnali do boje velitelé biči. Co tím o válkách s Persií říká?",
    key: "Řekové jako svobodní občané bránili své obce",
    d: [
      ["Řeky vedl do boje jeden společný velký král", "Velký král vládl Persii. Řekové žili v samostatných obcích a jednoho krále neměli."],
      ["Peršané vyhráli, protože měli přísnější velitele", "Peršané války s Řeky prohráli. Výrok navíc chválí svobodu, ne přísnost."],
      ["Řekové měli víc vojáků než perský král", "Početní převahu měli Peršané. Výrok nemluví o počtech, ale o tom, proč kdo šel do boje."],
    ],
    hints: [
      "Výrok staví vedle sebe dvě skupiny vojáků. Čím se liší v tom, proč jdou do boje?",
      "Řekové žili v samostatných obcích, kde o válce rozhodovali sami občané, kdežto Peršané byli poddaní jednoho vládce. Ověř také, kdo války s Persií vyhrál a kdo měl víc vojáků.",
    ],
    explanation: "Výrok (podobně píše Hérodotos) srovnává svobodné řecké občany s poddanými perského krále. Řekové z mnoha samostatných obcí bránili svou svobodu, perské vojáky nutili do boje velitelé. Peršané přitom měli početní převahu, a přesto prohráli.",
  },
  {
    q: "Proč se na bitvu u Thermopyl vzpomíná jako na hrdinský čin, přestože ji Řekové prohráli?",
    key: "Protože obránci zdrželi Peršany a nevzdali se ani v obklíčení",
    d: [
      ["Protože obránci Peršany zastavili a zahnali je zpět do Asie", "U Thermopyl obránci padli a Peršané postoupili až k Athénám. Zastavilo je až loďstvo u Salamíny."],
      ["Protože obránci přešli k Peršanům a zachránili tak své město", "Leónidás a jeho muži se nevzdali. Stezku Peršanům ukázal zrádce, obránci bojovali do konce."],
      ["Protože obránci pak nastoupili na lodě a vyhráli u Marathónu", "Marathón byl o deset let dřív než Thermopyly a byla to pozemní bitva."],
    ],
    hints: [
      "Porážka může být slavná, když obránci něčeho dosáhli. Co udělali s perským postupem a jak se zachovali na konci?",
      "Vítězství to nebylo a Marathón se odehrál o deset let dřív. Obránci věděli, že je Peršané obešli, a přesto zůstali. Co tím získali pro ostatní Řeky?",
    ],
    explanation: "Leónidás se Sparťany a spojenci několik dní držel průsmyk proti přesile. Když je Peršané obešli, zůstal se Sparťany a Thespijskými a téměř všichni padli. Zdrželi tím Peršany a dali ostatním Řekům čas, proto se na ně vzpomíná jako na hrdiny.",
  },
  {
    q: "Co by Peršané nejspíš udělali s Athénami, kdyby u Marathónu zvítězili?",
    key: "Potrestali by je za pomoc městům v iónském povstání",
    d: [
      ["Potrestali by je za válku, kterou vedly proti Spartě", "Válka Athén se Spartou začala až skoro o šedesát let později. Roku 490 př. n. l. nemohla být důvodem."],
      ["Potrestali by je za porážku perského loďstva u Salamíny", "Salamína proběhla až o deset let později. Trest za ni nemohl být cílem první výpravy."],
      ["Potrestali by je za smrt krále Leónida u Thermopyl", "Leónidás byl Sparťan, padl až o deset let později a zabili ho sami Peršané."],
    ],
    hints: [
      "Důvod trestu musí předcházet roku 490 př. n. l. Seřaď si události podle letopočtů.",
      "Bitva u ostrova, bitva v průsmyku i válka se Spartou proběhly až po Marathónu, nemohly tedy být důvodem. Co Athény udělaly proti Persii ještě před první výpravou?",
    ],
    explanation: "Athény poslaly lodě na pomoc řeckým městům v Malé Asii, která se v iónském povstání (499–494 př. n. l.) vzbouřila proti Persii. Dáreios I. proto poslal výpravu, aby Athény potrestal. Ostatní události přišly až po roce 490 př. n. l.",
    steps: [
      "Iónské povstání 499 př. n. l. → před Marathónem (490).",
      "Thermopyly a Salamína 480 př. n. l. → po Marathónu.",
      "Peloponéská válka 431 př. n. l. → dlouho po Marathónu.",
    ],
  },
  {
    q: "Proč stály v čele námořního spolku po válce s Persií Athény, a ne Sparta?",
    key: "Protože Athény měly nejsilnější loďstvo a spolek měl chránit moře",
    d: [
      ["Protože Sparta měla nejsilnější loďstvo, ale vést spolek odmítla", "Sparta byla silná na souši. Nejsilnější loďstvo měly Athény."],
      ["Protože Athény vyhrály u Thermopyl úplně bez pomoci Sparty", "U Thermopyl Řekové prohráli a velel tam spartský král."],
      ["Protože Sparta tehdy už s Athénami válčila o moc", "Spolek vznikl roku 478 př. n. l., kdy Sparta a Athény ještě byly spojenci. Peloponéská válka začala až roku 431 př. n. l."],
    ],
    hints: [
      "Spolek měl bránit ostrovy a pobřeží před návratem Peršanů. Kdo k tomu měl potřebnou sílu?",
      "Sparta byla mocná na souši, u průsmyku Řekové prohráli a válka mezi oběma obcemi přišla až později. Kterou zbraň potřebuje spolek, jenž hlídá moře?",
    ],
    explanation: "Spolek měl chránit ostrovy a pobřeží Egejského moře před Peršany, a k tomu bylo potřeba loďstvo. Nejsilnější loďstvo měly od dob Themistokla Athény, Sparta byla mocí na souši.",
  },
  {
    q: "Co z toho plyne, že Athény přenesly pokladnu spolku do svého města a z peněz spojenců stavěly chrámy?",
    key: "Athény ze spolku udělaly nástroj své moci a bohatství",
    d: [
      ["Athény spolek zrušily, protože Peršané už nehrozili", "Spolek Athény nezrušily, naopak ho držely pevně v rukou. Spojence, kteří chtěli odejít, si podrobily."],
      ["Athény peníze vracely spojencům jako odměnu za boj", "Peníze šly do athénské pokladny a na athénské stavby, spojencům se nevracely."],
      ["Athény tím splácely Spartě pomoc proti Peršanům", "Pokladna spolku Spartě nepatřila. Sparta naopak s obavami sledovala, jak Athény bohatnou."],
    ],
    hints: [
      "Komu peníze patřily a kdo o nich teď rozhodoval?",
      "Spojenci platili na společnou obranu proti Peršanům. Když peníze skončily v jednom městě a platily jeho stavby, kdo z toho měl prospěch? A jak to mohla vidět Sparta?",
    ],
    explanation: "Peníze spojenců měly sloužit společné obraně, ale Athény je převzaly do své pokladny a platily z nich stavby na Akropoli. Ze spolku rovných se stala athénská říše, a to posílilo obavy Sparty.",
  },
  {
    q: "Proč Peršané po roce 479 př. n. l. už na Řecko nevytáhli s velkou výpravou?",
    key: "Protože u Salamíny a Platají přišli o loďstvo i vojsko",
    d: [
      ["Protože u Thermopyl uzavřeli s Řeky trvalý mír", "U Thermopyl se bojovalo, žádný mír se tam neuzavřel. Peršané po bitvě naopak postupovali dál."],
      ["Protože u Marathónu zahynul král Xerxés i jeho vojsko", "Xerxés u Marathónu nebyl, první výpravu poslal jeho otec Dáreios. Xerxés válku přežil."],
      ["Protože Sparta a Athény tehdy už válčily mezi sebou", "Peloponéská válka začala až roku 431 př. n. l., skoro o padesát let později."],
    ],
    hints: [
      "Které dvě bitvy v letech 480 a 479 př. n. l. Řekové vyhráli? Co v nich Peršané ztratili?",
      "U průsmyku Řekové prohráli, Marathón byl dřív a válka Sparty s Athénami přišla až o desítky let později. Říše bez flotily a s poraženým vojskem už nemohla znovu vtrhnout přes moře.",
    ],
    explanation: "U Salamíny (480 př. n. l.) přišli Peršané o velkou část loďstva a u Platají (479 př. n. l.) byla poražena jejich pozemní armáda. Bez flotily a vojska už velkou výpravu do Řecka nepodnikli.",
  },
  {
    q: "Proč mor na začátku peloponéské války zasáhl Athény tak těžce?",
    key: "Protože se za hradbami tísnilo mnoho lidí z venkova",
    d: [
      ["Protože se za hradbami tísnili zajatí perští vojáci", "Perští zajatci patří do jiné, starší války. Za hradbami se tísnili Athéňané z okolí."],
      ["Protože se Athény už vzdaly a Sparťané obsadili město", "Athény se vzdaly až na konci války roku 404 př. n. l. Mor přišel na jejím začátku."],
      ["Protože se Athéňané schovali na lodích u Salamíny", "Na lodě a na Salamínu se Athéňané uchýlili v perských válkách. V peloponéské válce zůstali za hradbami."],
    ],
    hints: [
      "Kde byli Athéňané, když vypukla nemoc? Mysli na Periklův plán obrany.",
      "Periklés nechal lidi z Attiky přejít do města, protože okolí pustošilo spartské vojsko. Jak se šíří nemoc tam, kde je lidí mnohem víc než obvykle?",
    ],
    explanation: "Periklés nechal obyvatele Attiky schovat se za athénské hradby. Ve přeplněném městě se mor rychle šířil a zemřela velká část obyvatel včetně Perikla. To Athény na dlouho oslabilo.",
  },
  {
    q: "Které tvrzení vysvětluje, proč Sparta v peloponéské válce potřebovala peníze od Persie?",
    key: "Sparta měla silné pozemní vojsko, ale na loďstvo neměla prostředky",
    d: [
      ["Sparta měla silné loďstvo, ale neměla dost pozemních vojáků", "Je to naopak: Sparťané byli slavní pěšáci a silné loďstvo měly Athény."],
      ["Sparta byla od perských válek věrným spojencem Persie", "V perských válkách Sparta proti Persii bojovala a u Thermopyl padl její král."],
      ["Sparta prohrála u Thermopyl a musela Persii platit daně", "U Thermopyl Řekové prohráli, ale válku nakonec vyhráli. Sparta Persii daně neplatila."],
    ],
    hints: [
      "V čem byla Sparta silná a v čem Athény? Co Spartě chybělo, aby mohla Athény porazit?",
      "Athény držely moře díky lodím a lodě stojí hodně peněz. Ověř také, na které straně stála Sparta v perských válkách.",
    ],
    explanation: "Sparťané byli nejlepší pěšáci Řecka, ale Athény ovládaly moře. Aby je Sparta mohla porazit, potřebovala loďstvo, a na to jí peníze dala Persie, která chtěla Athény oslabit.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  return pickN(pool, pool.length).map(build);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const RECKO_PERSKE_VALKY_PELOPONESKA_VALKA: TopicMetadata[] = [
  {
    id: "g6-dej-recko-perske-valky-peloponeska-valka-6",
    rvpNodeId: "g6-dejepis-starovek-antika-recko-recko-perske-valky-peloponeska-valka",
    displayName: "Řecko-perské války a peloponéská válka",
    title: "Řecko-perské války, peloponéská válka",
    studentTitle: "Řekové proti Peršanům a Athény proti Spartě",
    subject: "dejepis",
    category: "Starověk",
    topic: "Antika - Řecko",
    briefDescription: "Marathón, Thermopyly, Salamína a válka Athén se Spartou – kdo, kdy a proč.",
    keywords: [
      "řecko-perské války", "peloponéská válka", "Marathón", "Thermopyly", "Salamína", "Plataje",
      "Dáreios I.", "Xerxés", "Miltiadés", "Leónidás", "Themistoklés", "Periklés", "Lýsandros",
      "Hérodotos", "Thúkydidés", "délský námořní spolek", "Sparta", "Athény",
    ],
    goals: [
      "Přiřadit bitvu, osobnost a spolek ke správné válce řeckého světa.",
      "Určit pořadí událostí a rozdíl letopočtů před naším letopočtem.",
      "Vysvětlit, proč Řekové porazili Peršany a proč se pak Athény střetly se Spartou.",
      "Rozpoznat z výroku dějepisce, o kterou válku a jakou příčinu jde.",
    ],
    boundaries: [
      "Jen nesporná učebnicová fakta; pověst o běžci z Marathónu ani počty vojáků nejsou klíčem.",
      "Nezahrnuje Alexandra Velikého a helénismus (samostatné téma), jen jako distraktor.",
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
      hint: "Řecko-perské války: Řekové spolu proti Persii. Marathón 490 př. n. l. (Dáreios I. × Miltiadés), Thermopyly 480 (Xerxés × Leónidás, porážka Řeků), Salamína 480 (Themistoklés, lodě), Plataje 479. Peloponéská válka 431–404 př. n. l.: Athény proti Spartě, mor, Periklés, vítězí Sparta.",
      steps: [
        "Najdi v zadání jméno, místo nebo letopočet.",
        "Rozhodni, jestli jde o boj Řeků s Peršany, nebo Řeků mezi sebou.",
        "U letopočtů před n. l. pamatuj: vyšší číslo = dřív, rozdíl se odečítá.",
        "U příčin ověř, že příčina proběhla před tím, co způsobila.",
      ],
      commonMistake: "Připsat Marathón Xerxovi, nebo si myslet, že Salamína (480) byla před Marathónem (490), protože má menší číslo.",
      example: "Marathón 490 a Salamína 480 př. n. l.: 490 − 480 = 10, Marathón byl o 10 let dřív.",
    },
  },
];
