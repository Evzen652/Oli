import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { isAre, pad } from "@/lib/czechGrammar";
import { choice } from "../_shared";
import { ciselnaUloha, pick, rnd, sada, shuffle } from "./_mat";

// Přepsáno 2026-09-12 (inventura obsahu). Předchozí verze měla na L3 nápovědu
// složenou jen ze vzdálenosti bodu od osy (6 hodnot → každá malá nápověda se
// opakovala u deseti úloh), L2 mělo u obrazců velkou nápovědu kratší než malou
// a L1 jen 13 úloh.
//
// Teď: L1 rozpoznání pojmu (co je osa, co se při překlopení mění a co ne)
// · L2 aplikace pravidla (kolik os má písmeno nebo obrazec)
// · L3 transfer a inverze (sestrojení obrazu ve čtvercové síti, určení osy ze
//   dvou bodů, vzdálenost obrazu a zpětný výpočet vzdálenosti od osy).
// Každá nápověda nese všechna data své úlohy, takže se neopakuje; `overeno()`
// navíc zahodí instanci, kde by klíč prosákl do nápovědy nebo do zadání.

// ── Pojistka proti prozrazení ────────────────────────────────────────────────

const bezInterpunkce = (s: string) => s.replace(/(?<!\d)[.,](?!\d)/g, " ").replace(/[;:!?"'„“()×]/g, " ");

function obsahujeCislo(text: string, cislo: string): boolean {
  return new RegExp(`(^|[^\\d.,])${cislo.replace(".", "\\.")}([^\\d.,]|$)`).test(bezInterpunkce(text));
}

/**
 * Číselné jádro klíče — jen tvary, které detektor prozrazení hlídá: holé číslo
 * a číslo s jednotkou. U víceslovných klíčů s několika čísly („3 čtverečky
 * vpravo od osy, 5 čtverečků nad okrajem") jádro není, protože čísla jsou
 * převzatá ze zadání a nápověda je smí zopakovat.
 */
function jadro(key: string): string | null {
  if (/^-?\d+(?:[.,]\d+)?$/.test(key)) return key;
  return key.match(/^(-?\d+(?:[.,]\d+)?)\s+\p{L}[\p{L}\s/²³°]*$/u)?.[1] ?? null;
}

function overeno(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  const key = String(t.correctAnswer);
  if (t.question.toLowerCase().includes(key.toLowerCase())) return null;
  const cislo = jadro(key);
  if (cislo && !obsahujeCislo(t.question, cislo) && (t.hints ?? []).some((h) => obsahujeCislo(h, cislo))) return null;
  return t;
}

// ── L1 · rozpoznání pojmu ────────────────────────────────────────────────────

const L1: PracticeTask[] = [
  choice("Co je osa souměrnosti?", "přímka, podle které se obrazec dá přeložit na sebe", [
    { value: "nejdelší strana obrazce", why: "Osa vůbec nemusí ležet na okraji obrazce — u srdce nebo motýla vede jeho středem." },
    { value: "libovolná čára, která obrazec rozdělí na dvě části", why: "Rozdělit na dvě části jde obrazec spoustou čar. Osa musí ty dvě části udělat zrcadlově shodné." },
    { value: "bod uprostřed obrazce", why: "Osa je čára, ne bod. Podle bodu se obrazec překládat nedá." },
  ], {
    hints: [
      "Vzpomeň si, co se s osově souměrným obrázkem dělá, když ho skládáš napůl.",
      "Papír se ohýbá podél čáry, ne kolem bodu. Po ohnutí musí jedna polovina padnout přesně na druhou — a teprve čára, u které to vyjde, si zaslouží ten název.",
    ],
    explanation: "Osa souměrnosti je čára, podél které se obrazec přeloží tak, že se obě poloviny přesně kryjí.",
  }),
  choice("Kde leží obraz bodu v osové souměrnosti?", "stejně daleko od osy jako bod, ale na opačné straně", [
    { value: "dvakrát dál od osy než původní bod", why: "Vzdálenost od osy se překlopením nemění, jen se odměří na druhou stranu." },
    { value: "vždycky přímo na ose", why: "Na ose leží jen obraz toho bodu, který na ose sám je." },
    { value: "na téže straně osy jako původní bod", why: "Obraz vzniká za osou, jako odraz za zrcadlem — jinak by splynul s původním bodem." },
  ], {
    hints: [
      "Představ si zrcadlo postavené na osu. Kde v něm vidíš svůj odraz a jak daleko od skla?",
      "Odraz v zrcadle není nikdy blíž ani dál od skla než ty sám a vždycky je za sklem. Osová souměrnost pracuje úplně stejně: obraz vznikne na kolmici k ose a od osy má tutéž vzdálenost jako původní bod.",
    ],
    explanation: "Bod i jeho obraz mají od osy tutéž vzdálenost, jen každý leží z jiné strany — proto se po přeložení potkají.",
  }),
  choice("Bod leží přímo na ose souměrnosti. Kde je jeho obraz?", "ve stejném místě jako původní bod", [
    { value: "na opačné straně osy", why: "Bod na ose má od osy vzdálenost nula, takže se nemá kam překlopit." },
    { value: "dvakrát dál od osy", why: "Dvojnásobek nuly je pořád nula." },
    { value: "nikde, takový bod obraz nemá", why: "Obraz má v osové souměrnosti každý bod bez výjimky." },
  ], {
    hints: [
      "Jak velká je vzdálenost od osy u bodu, který na ní přímo leží?",
      "Obraz má od osy tutéž vzdálenost jako bod sám, jen se odměřuje z druhé strany. Když je ta vzdálenost nulová, není kam se posunout, a obraz proto s bodem splyne.",
    ],
    explanation: "Body na ose se při překlopení nehýbou — jsou samy sobě obrazem.",
  }),
  choice("Který z nabízených tvarů je osově souměrný?", "srdce", [
    { value: "velké tiskací písmeno F", why: "Po přeložení se F obrátí — nožičky míří na opačnou stranu." },
    { value: "číslice 7", why: "Sedmička se v zrcadle převrátí a s původním tvarem se nekryje." },
    { value: "velké tiskací písmeno Z", why: "Z vypadá stejně až po otočení, a otočení není překlopení podle osy." },
  ], {
    hints: [
      "Který z těch tvarů můžeš přeložit napůl tak, že se obě půlky přesně kryjí?",
      "Postav si v duchu doprostřed každého tvaru zrcátko a dívej se, jestli odraz doplní přesně tu chybějící polovinu. U nesouměrných tvarů vznikne něco jiného, než co bylo na papíře.",
    ],
    explanation: "Srdce má svislou osu: levá a pravá půlka jsou zrcadlově stejné.",
  }),
  choice("Co v přírodě je osově souměrné?", "křídla motýla", [
    { value: "ulita hlemýždě", why: "Ulita je stočená do spirály, takže žádné přeložení ji na sebe nepoloží." },
    { value: "klikatá řeka", why: "Řeka se vine nepravidelně, každý zákrut je jiný." },
    { value: "rozbitý kámen", why: "Úlomky mají nahodilý tvar, jedna strana se s druhou nekryje." },
  ], {
    hints: [
      "Co v přírodě vypadá, jako by to někdo namaloval na jednu půlku papíru a pak papír přeložil?",
      "U souměrných věcí bývá levá půlka zrcadlovým obrazem pravé. Zkus se u každé možnosti zeptat, jestli se dá najít čára, podle které by šla jedna půlka položit přesně na druhou.",
    ],
    explanation: "Motýl má obě křídla zrcadlově stejná, osa vede středem jeho těla.",
  }),
  choice("Jak ověříš, že je obrázek osově souměrný?", "postavím na čáru zrcátko nebo papír přeložím", [
    { value: "změřím obvod obrázku", why: "Obvod říká, jak je obrázek velký, ne jestli jsou jeho půlky shodné." },
    { value: "spočítám, kolik má obrázek stran", why: "Počet stran o souměrnosti nerozhoduje — trojúhelník ji mít může i nemusí." },
    { value: "otočím obrázek vzhůru nohama", why: "Otočení je jiná proměna než překlopení podle osy." },
  ], {
    hints: [
      "Co ti ukáže druhou polovinu obrázku, i když ji zakryješ?",
      "Existují dva jednoduché způsoby. Papír se dá ohnout a podívat se, jestli se poloviny kryjí. Nebo se na čáru postaví zrcátko, které chybějící polovinu doplní — a když ta doplněná polovina vypadá jinak než skutečná, souměrnost to není.",
    ],
    explanation: "Souměrnost se ověřuje překlopením: obě poloviny se musí krýt.",
  }),
  choice("Je velké tiskací písmeno N osově souměrné?", "ne, žádnou osu souměrnosti nemá", [
    { value: "ano, má svislou osu", why: "Po svislém přeložení se šikmá čára v N obrátí na druhou stranu." },
    { value: "ano, má vodorovnou osu", why: "Po vodorovném přeložení míří šikmá čára opačně než původně." },
    { value: "ano, má dokonce dvě osy", why: "Písmeno N nemá ani jednu osu, natož dvě." },
  ], {
    hints: [
      "Napiš si velké N na papír a zkus ho přeložit nejdřív svisle uprostřed, pak vodorovně. Kryjí se půlky?",
      "Šikmá čára uprostřed písmene míří po každém překlopení jinam, a proto se s původním tvarem nikdy nesejde. Stejný tvar dostaneš u N jen otočením o půl kruhu, což je ale jiná proměna než překlopení.",
    ],
    explanation: "Písmeno N vypadá stejně po otočení, ne po překlopení — osu souměrnosti tedy nemá.",
  }),
  choice("Bod posuneme blíž k ose souměrnosti. Co udělá jeho obraz?", "také se přiblíží k ose", [
    { value: "vzdálí se od osy", why: "Obraz se hýbe souhlasně s bodem, ne proti němu." },
    { value: "zůstane na svém místě", why: "Poloha obrazu je dána polohou bodu — když se pohne bod, pohne se i obraz." },
    { value: "přeskočí na stranu, kde je původní bod", why: "Obraz zůstává za osou, jinak by přestal být odrazem." },
  ], {
    hints: [
      "Co udělá tvůj odraz v zrcadle ve chvíli, kdy k zrcadlu přistoupíš?",
      "Bod a jeho obraz mají od osy pořád stejnou vzdálenost. Když se jedna z nich zmenší, musí se zmenšit i ta druhá, takže se obě strany hýbou zároveň a zůstávají si naproti.",
    ],
    explanation: "Vzdálenost obrazu od osy je vždy táž jako vzdálenost bodu, takže se mění společně.",
  }),
  choice("Jak velký je obraz obrazce v osové souměrnosti?", "stejně velký jako původní obrazec", [
    { value: "dvakrát větší", why: "Překlopení nic nezvětšuje, jen mění stranu." },
    { value: "dvakrát menší", why: "Překlopení nic nezmenšuje — všechny vzdálenosti zůstávají stejné." },
    { value: "pokaždé jinak velký, záleží na vzdálenosti od osy", why: "Vzdálenost od osy rozhoduje o poloze obrazu, ne o jeho velikosti." },
  ], {
    hints: [
      "Představ si obtisk mokré barvy po přeložení papíru. Změní se přitom velikost obrázku?",
      "Překlopení funguje jako obtisk: všechny body se přenesou na druhou stranu, ale žádná vzdálenost mezi nimi se nezmění. Obraz má proto i stejně dlouhé strany a stejně velké úhly jako obrazec, ze kterého vznikl.",
    ],
    explanation: "Osová souměrnost zachovává velikost — mění jen stranu a orientaci.",
  }),
  choice("Jak může být osa souměrnosti položená?", "svisle, vodorovně i šikmo", [
    { value: "jen svisle", why: "Svislá osa je nejznámější, ale třeba obdélník má i vodorovnou." },
    { value: "jen vodorovně", why: "Vodorovná osa je jen jedna z možností, čtverec má osy i šikmé." },
    { value: "jen svisle nebo vodorovně", why: "Úhlopříčky čtverce jsou šikmé osy, a přesto to osy jsou." },
  ], {
    hints: [
      "Vzpomeň si na čtverec: podle kterých všech čar ho můžeš přeložit, aby se půlky kryly?",
      "Osou je každá čára, po jejímž přeložení se poloviny kryjí. Nikde není psáno, jak musí být položená — u čtverce vedou dvě osy středy stran a další dvě šikmo jeho rohy.",
    ],
    explanation: "Směr osy nerozhoduje, důležité je jen to, že se po přeložení poloviny kryjí.",
  }),
  choice("Papír přeložíme a obě poloviny obrázku se přesně kryjí. Co to znamená?", "obrázek je souměrný podle čáry přeložení", [
    { value: "obrázek je nakreslený přesně uprostřed papíru", why: "Kde obrázek na papíře leží, se souměrností nesouvisí." },
    { value: "obě poloviny obrázku jsou stejně velké, ale jinak vypadají", why: "Kdyby vypadaly jinak, po přeložení by se nekryly." },
    { value: "obrázek má tvar čtverce", why: "Krýt se po přeložení může i srdce, motýl nebo písmeno — tvar to neurčuje." },
  ], {
    hints: [
      "Podle čeho se pozná, že čára, kde je papír ohnutý, je zrovna ta hledaná?",
      "Kryjící se poloviny jsou přesně ta podmínka, kterou souměrnost vyžaduje. Čára ohybu tedy není ledajaká čára — je to právě ta, podle které se obrazec zobrazí sám na sebe.",
    ],
    explanation: "Kryjící se poloviny znamenají, že čára ohybu je osou souměrnosti obrázku.",
  }),
  choice("Jak dlouhý je obraz úsečky v osové souměrnosti?", "stejně dlouhý jako původní úsečka", [
    { value: "dvakrát delší, protože je za osou", why: "Poloha za osou délku nemění, mění jen stranu." },
    { value: "kratší, čím dál od osy úsečka leží", why: "Vzdálenost od osy neovlivňuje délku, jen to, kam obraz padne." },
    { value: "to se nedá určit bez měření", why: "Určit to jde vždy: překlopení délky zachovává." },
  ], {
    hints: [
      "Když přeložíš papír s narýsovanou úsečkou, změní se něco na její délce?",
      "Každý bod úsečky se překlopí na druhou stranu osy a vzdálenosti mezi body přitom zůstanou beze změny. Obraz úsečky proto vypadá jako její přesná kopie, jen otočená na druhou stranu osy.",
    ],
    explanation: "Osová souměrnost délky zachovává — obraz úsečky je s ní shodný.",
  }),
  choice("Které slovo nejlíp vystihuje, co osová souměrnost s obrazcem dělá?", "zrcadlení", [
    { value: "zvětšování", why: "Velikost se při překlopení vůbec nemění." },
    { value: "posouvání", why: "Při posouvání by obrazec zůstal otočený stejně, jen o kus dál." },
    { value: "otáčení", why: "Otočením vznikne jiný výsledek než překlopením — u písmene N je to dobře vidět." },
  ], {
    hints: [
      "Jaké zařízení z koupelny dělá s obrázkem přesně to, co osa?",
      "Osa funguje jako sklo, které obraz převrátí na druhou stranu, ale nezmění jeho velikost ani tvar. Levá strana se stane pravou — přesně to, co vidíš ráno v koupelně.",
    ],
    explanation: "Osová souměrnost je zrcadlové zobrazení podle přímky.",
  }),
  choice("Co musí platit, aby byla čára osou souměrnosti obrazce?", "obě části podél ní musí být zrcadlově shodné", [
    { value: "musí rozdělit obrazec na dvě stejně velké části", why: "Stejně velké části ještě nestačí — musí být i zrcadlově shodné, ne jen stejně veliké." },
    { value: "musí procházet středem obrazce", why: "Ne každá čára středem je osa: úhlopříčka obdélníku středem prochází, a osou přesto není." },
    { value: "musí být kolmá k některé straně obrazce", why: "Kolmost k nějaké straně nic nezaručuje. Rozhoduje jen to, jestli se po přeložení půlky kryjí." },
  ], {
    hints: [
      "Stačí, aby čára rozdělila obrazec na dva stejně velké kusy, nebo je potřeba víc?",
      "Obdélník se dá rozdělit úhlopříčkou na dva stejně velké trojúhelníky, a přesto úhlopříčka osou není: po přeložení jeden trojúhelník na druhý nesedne. Podmínka je proto přísnější než stejná velikost.",
    ],
    explanation: "Rozhoduje krytí po přeložení, tedy zrcadlová shodnost obou částí, ne jen jejich velikost.",
  }),
  choice("Která z těchto věcí kolem nás je osově souměrná?", "sněhová vločka", [
    { value: "šlápota v blátě", why: "Otisk boty má patu jinou než špičku, po přeložení se nekryje." },
    { value: "zmuchlaný papír", why: "Zmuchlaný tvar je úplně nahodilý." },
    { value: "písmeno G na ceduli", why: "G má háček jen na jedné straně, takže se po přeložení nekryje." },
  ], {
    hints: [
      "Která z těch věcí vypadá po obou stranách pomyslné čáry úplně stejně?",
      "Souměrné bývají věci s pravidelným tvarem, který se kolem čáry opakuje. U každé možnosti si zkus představit čáru a zeptat se, jestli se po jejím přeložení obě poloviny přesně potkají.",
    ],
    explanation: "Sněhová vločka je pravidelná, a proto osově souměrná hned podle několika čar.",
  }),
  choice("Bod A je od osy vzdálený 3 čtverečky. Jak daleko od osy leží jeho obraz?", "také 3 čtverečky", [
    { value: "6 čtverečků", why: "Šest čtverečků je celý úsek od bodu k obrazu, ne vzdálenost obrazu od osy." },
    { value: "1 čtvereček", why: "Vzdálenost se překlopením nezmenšuje, zůstává táž." },
    { value: "to podle zadání nejde určit", why: "Určit to jde vždy: vzdálenost obrazu od osy je stejná jako u původního bodu." },
  ], {
    hints: [
      "Zkus si představit, že papír přeložíš přesně po ose. Kam se bod A dostane?",
      "Po přeložení musí bod padnout přesně na svůj obraz. To se povede jen tehdy, když je obraz od ohybu stejně daleko jako původní bod, jen na druhé straně.",
    ],
    explanation: "Překlopení vzdálenost od osy zachovává, mění jen stranu.",
  }),
];

// ── L2 · aplikace pravidla (kolik os) ────────────────────────────────────────

/** Velká tiskací písmena: [písmeno, počet os, popis os]. */
const PISMENA: [string, number, string][] = [
  ["A", 1, "jednu svislou osu"], ["B", 1, "jednu vodorovnou osu"], ["C", 1, "jednu vodorovnou osu"],
  ["D", 1, "jednu vodorovnou osu"], ["E", 1, "jednu vodorovnou osu"], ["H", 2, "svislou i vodorovnou osu"],
  ["I", 2, "svislou i vodorovnou osu"], ["K", 1, "jednu vodorovnou osu"], ["M", 1, "jednu svislou osu"],
  ["O", 2, "svislou i vodorovnou osu"], ["T", 1, "jednu svislou osu"], ["U", 1, "jednu svislou osu"],
  ["V", 1, "jednu svislou osu"], ["W", 1, "jednu svislou osu"], ["X", 2, "svislou i vodorovnou osu"],
  ["Y", 1, "jednu svislou osu"], ["F", 0, "žádnou osu"], ["G", 0, "žádnou osu"], ["J", 0, "žádnou osu"],
  ["L", 0, "žádnou osu"], ["P", 0, "žádnou osu"], ["R", 0, "žádnou osu"], ["S", 0, "žádnou osu"],
  ["Z", 0, "žádnou osu"],
];

function pismeno(): PracticeTask | null {
  const [p, n, popis] = pick(PISMENA);
  const chyby = ["0", "1", "2", "4"].filter((v) => v !== String(n)).map((v) => ({
    value: v,
    why: Number(v) > n
      ? `Tolik os písmeno ${p} nemá — po většině přeložení se půlky rozejdou. Ve skutečnosti má ${popis}.`
      : `Některé přeložení zůstalo nevyzkoušené: písmeno ${p} má ${popis}.`,
  }));
  return overeno(ciselnaUloha(
    `Kolik os souměrnosti má velké tiskací písmeno ${p}?`,
    String(n),
    chyby,
    [
      `Napiš si velké ${p} na papír a zkus ho přeložit nejdřív svisle uprostřed, potom vodorovně. U kolika z těch dvou přeložení se obě půlky přesně kryjí?`,
      `Osa souměrnosti rozdělí písmeno na dvě zrcadlově shodné půlky. U tiskacích písmen stačí prozkoumat dvě možnosti — svislou osu uprostřed a vodorovnou osu v polovině výšky — a každou posoudit zvlášť. Písmeno může vyhovět oběma, jen jedné, nebo taky žádné z nich. Pozor na tvary, které vypadají stejně až po otočení: otočení mezi osy souměrnosti nepatří.`,
    ],
    [`Písmeno ${p} má ${popis}.`],
  ));
}

/** Obrazce mimo L1: [název, počet os, chybné možnosti, pravidlo do velké nápovědy]. */
const OBRAZCE: [string, string, [string, string][], string][] = [
  ["kosočtverec, který není čtverec", "2", [
    ["4", "Čtyři osy má čtverec. Kosočtverec nemá pravé úhly, takže přeložení středy stran mu nevyjde."],
    ["1", "Osy má kosočtverec v obou úhlopříčkách, ne jen v jedné."],
    ["0", "Podle úhlopříček se kosočtverec přeložit dá, takže souměrný je."],
  ], "Kosočtverec má všechny strany stejně dlouhé, ale úhly různé. Přeložit se proto dá jen podle úhlopříček, ne podél čar spojujících středy stran."],
  ["pravidelný šestiúhelník", "6", [
    ["3", "Osy vedou nejen protějšími vrcholy, ale i středy protějších stran."],
    ["2", "Os je u pravidelného šestiúhelníku podstatně víc."],
    ["12", "Každá osa spojuje dva protilehlé body, takže se nepočítá dvakrát."],
  ], "U pravidelného mnohoúhelníku je os tolik, kolik má stran. U šestiúhelníku vedou tři osy protějšími vrcholy a tři středy protějších stran."],
  ["pravidelný pětiúhelník", "5", [
    ["1", "Osa vede každým vrcholem, ne jen jedním."],
    ["10", "Každá osa vede vrcholem a zároveň středem protější strany, takže se nepočítá dvakrát."],
    ["0", "Pravidelný pětiúhelník souměrný je, má všechny strany i úhly stejné."],
  ], "U pravidelného mnohoúhelníku je os tolik, kolik má stran. U pětiúhelníku vede každá osa jedním vrcholem a středem protější strany."],
  ["kosodélník, který není obdélník", "0", [
    ["2", "Ani jedna z čar spojujících středy protějších stran kosodélník nepřeloží na sebe — strany jsou šikmé."],
    ["1", "Žádné přeložení kosodélníku nedá dvě kryjící se poloviny."],
    ["4", "Tolik os má čtverec, kosodélník ani jednu."],
  ], "Kosodélník vznikne z obdélníku nakloněním. Naklonění souměrnost zruší: po každém přeložení míří šikmé strany opačně."],
  ["různostranný trojúhelník", "0", [
    ["1", "Jedna osa by vyžadovala dvě stejně dlouhá ramena, ta ale různostranný trojúhelník nemá."],
    ["3", "Tři osy má jen rovnostranný trojúhelník."],
    ["2", "Dvě osy nemá žádný trojúhelník — buď jednu, nebo tři, nebo žádnou."],
  ], "Osa trojúhelníku vede vždy vrcholem mezi dvěma stejně dlouhými stranami. Když jsou všechny tři strany různé, není odkud ji vést."],
  ["rovnoramenný lichoběžník", "1", [
    ["2", "Vodorovné přeložení lichoběžník nesloží: základny jsou různě dlouhé."],
    ["0", "Rovnoramenný lichoběžník souměrný je, ramena má stejně dlouhá."],
    ["4", "Tolik os má čtverec, lichoběžník jedinou."],
  ], "Rovnoramenný lichoběžník má dvě rovnoběžné základny různé délky a ramena stejná. Osa proto vede středy obou základen."],
  ["půlkruh", "1", [
    ["2", "Podél rovné strany se půlkruh nepřeloží — oblouk je jen na jedné straně."],
    ["0", "Půlkruh souměrný je, přeložit ho lze uprostřed."],
    ["nekonečně mnoho", "Nekonečně mnoho os má celý kruh. Rovná strana půlkruhu ostatní osy ruší."],
  ], "Půlkruh vznikne rozpůlením kruhu. Zbude mu jediná osa — ta, která je kolmá k rovné straně a prochází jejím středem."],
  ["ovál (elipsa)", "2", [
    ["nekonečně mnoho", "Nekonečně mnoho os má kruh. Ovál je protáhlý, takže šikmá přeložení mu nevyjdou."],
    ["1", "Ovál se dá přeložit podél i napříč, tedy dvakrát."],
    ["4", "Šikmo se ovál přeložit nedá, protože v jednom směru je delší než ve druhém."],
  ], "Ovál je protažený kruh. Přeložit se dá podél nejdelšího směru i kolmo na něj, jiné přeložení mu nevyjde."],
];

function obrazec(): PracticeTask | null {
  const [nazev, n, chyby, pravidlo] = pick(OBRAZCE);
  return overeno(ciselnaUloha(
    `Kolik os souměrnosti má ${nazev}?`,
    n,
    chyby.map(([value, why]) => ({ value, why })),
    [
      `Nakresli si, jak vypadá ${nazev}, a hledej všechny čáry, podle kterých ho lze přeložit tak, aby se poloviny kryly. Zkoušej čáry přes vrcholy i čáry přes středy stran.`,
      `${pravidlo} Postupuj proto systematicky: nejdřív vyzkoušej čáry vedoucí vrcholy, pak čáry středy stran, a u každé se zeptej, jestli se po přeložení obě poloviny opravdu kryjí. Čára, která obrazec jen rozdělí na dva stejně velké kusy, osou ještě není.`,
    ],
    [`Osy souměrnosti: ${pravidlo}`],
  ));
}

// ── L3 · transfer a inverze ──────────────────────────────────────────────────

function obrazBodu(): PracticeTask | null {
  const svisla = Math.random() < 0.5;
  const a = rnd(1, 6), b = rnd(1, 6);
  if (a === b) return null;
  const [tam, zpet, druha] = svisla
    ? ["vlevo od osy", "vpravo od osy", "nad spodním okrajem sítě"]
    : ["nad osou", "pod osou", "od levého okraje sítě"];
  const P = (x: number, strana: string, y: number) => `${pad(x, "ČTVEREČEK")} ${strana}, ${pad(y, "ČTVEREČEK")} ${druha}`;
  return overeno(ciselnaUloha(
    `Ve čtvercové síti je ${svisla ? "svislá" : "vodorovná"} osa souměrnosti. Bod A leží ${pad(a, "ČTVEREČEK")} ${tam} a ${pad(b, "ČTVEREČEK")} ${druha}. Kde leží jeho obraz?`,
    P(a, zpet, b),
    [
      { value: P(a, tam, b), why: "To je místo původního bodu A. Obraz musí být za osou, jinak by se s bodem kryl." },
      { value: P(b, zpet, a), why: `Obě čísla se prohodila. Vzdálenost od osy zůstává ${pad(a, "ČTVEREČEK")} a druhá vzdálenost ${pad(b, "ČTVEREČEK")}.` },
      { value: P(2 * a, zpet, b), why: "Vzdálenost od osy se zdvojnásobila. Obraz je od osy stejně daleko jako bod, ne dvakrát dál." },
      { value: P(a + 1, zpet, b), why: `Vzdálenost od osy se změnila o jeden čtvereček. Překlopení ji ale nechává přesně takovou, jaká je: ${pad(a, "ČTVEREČEK")}.` },
    ],
    [
      `Bod A je od osy vzdálený ${pad(a, "ČTVEREČEK")} a zároveň leží ${pad(b, "ČTVEREČEK")} ${druha}. Která z těch dvou vzdáleností se překlopením přes ${svisla ? "svislou" : "vodorovnou"} osu změní a která zůstane?`,
      `Obraz vzniká na kolmici k ose: od osy má tutéž vzdálenost jako bod A, jen z opačné strany. Druhá vzdálenost, tedy ta ${druha}, se nemění, protože se při překlopení přes ${svisla ? "svislou" : "vodorovnou"} osu posouváš jen ${svisla ? "vodorovně" : "svisle"}. Obě čísla ze zadání tedy zůstanou stejná, jiná je jen strana osy.`,
    ],
    [
      `Vzdálenost od osy se zachovává: ${pad(a, "ČTVEREČEK")}, ale z druhé strany.`,
      `Druhá vzdálenost (${pad(b, "ČTVEREČEK")} ${druha}) se překlopením nemění.`,
      `Obraz proto leží ${P(a, zpet, b)}.`,
    ],
  ));
}

function osaMezi(): PracticeTask | null {
  const p = rnd(1, 10), d = rnd(2, 6);
  if (p === d || p + 1 === d) return null;
  const q = p + 2 * d, m = p + d;
  return overeno(ciselnaUloha(
    `Ve čtvercové síti jsou sloupce očíslované zleva. Bod A leží ve sloupci ${p}, jeho obraz v osové souměrnosti ve sloupci ${q}. Ve kterém sloupci leží osa souměrnosti?`,
    String(m),
    [
      { value: String(d), why: `${d} je polovina vzdálenosti mezi oběma sloupci, ne číslo sloupce. Tuhle polovinu je ještě potřeba přičíst k sloupci ${p}.` },
      { value: String(2 * d), why: `${2 * d} je celá vzdálenost mezi sloupci ${p} a ${q}. Osa leží uprostřed, tedy jen o polovinu té vzdálenosti dál.` },
      { value: String(m + 1), why: `O sloupec vedle: od sloupce ${p} by k ose bylo ${pad(d + 1, "SLOUPEC")}, ale od ní k obrazu ve sloupci ${q} už jen ${pad(d - 1, "SLOUPEC")}. Osa musí mít na obě strany stejně.` },
      { value: String(q), why: `${q} je sloupec obrazu. Osa leží mezi bodem a obrazem, ne přímo v obrazu.` },
    ],
    [
      `Osa má k bodu i k jeho obrazu stejně daleko. O kolik sloupců se liší sloupec ${p} a sloupec ${q} — a co s tím rozdílem uděláš?`,
      `Bod a jeho obraz leží od osy ve stejné vzdálenosti, takže osa rozdělí úsek mezi nimi přesně napůl. Spočítej proto, o kolik sloupců se čísla ${p} a ${q} liší, rozdíl rozpul a tuhle polovinu přičti k menšímu z obou čísel. Hledá se číslo sloupce, ne vzdálenost — samotná polovina proto odpovědí není, dokud ji od sloupce ${p} neodpočítáš doprava.`,
    ],
    [
      `Vzdálenost sloupců: ${q} − ${p} = ${2 * d}`,
      `Osa leží uprostřed, tedy o ${d} dál než bod: ${p} + ${d} = ${m}.`,
      `Kontrola: od sloupce ${m} je k bodu i k obrazu stejně daleko.`,
    ],
  ));
}

function odstupObrazu(): PracticeTask | null {
  const a = rnd(1, 8);
  return overeno(ciselnaUloha(
    `Bod B je od osy souměrnosti vzdálený ${pad(a, "ČTVEREČEK")}. Kolik čtverečků je mezi bodem B a jeho obrazem?`,
    2 * a,
    [
      { value: a, why: "To je jen vzdálenost bodu od osy, tedy jedna polovina cesty. Druhá polovina, od osy k obrazu, chybí." },
      { value: 2 * a + 1, why: "Osa se připočítala jako další čtvereček. Osa je ale čára mezi čtverečky, žádný z nich sama nezabírá." },
      { value: 4 * a, why: "Vzdálenost se zdvojnásobila dvakrát. Obraz je od osy stejně daleko jako bod, ne dvakrát dál." },
    ],
    [
      `Obraz leží na druhé straně osy, ale od osy je stejně daleko jako bod B, tedy také ${pad(a, "ČTVEREČEK")}. Cesta z bodu B k obrazu vede přes osu — z kolika takových stejných úseků se skládá?`,
      `Vzdálenost bodu od osy a vzdálenost obrazu od osy jsou vždy stejné. Úsek mezi bodem B a jeho obrazem se proto skládá ze dvou takových kousků, jednoho na každé straně osy. Stačí tedy vzít vzdálenost ze zadání a použít ji dvakrát. Osa sama žádný čtvereček nezabírá, takže se do počtu nepřidává.`,
    ],
    [
      `Od bodu B k ose: ${pad(a, "ČTVEREČEK")}.`,
      `Od osy k obrazu tatáž vzdálenost: ${pad(a, "ČTVEREČEK")}.`,
      `Dohromady ${a} + ${a} = ${2 * a}, tedy ${pad(2 * a, "ČTVEREČEK")}.`,
    ],
  ));
}

function zOdstupu(): PracticeTask | null {
  const a = rnd(2, 9);
  return overeno(ciselnaUloha(
    `Mezi bodem C a jeho obrazem v osové souměrnosti ${isAre(2 * a)} ${pad(2 * a, "ČTVEREČEK")}. Jak daleko od osy leží bod C?`,
    a,
    [
      { value: 2 * a, why: "To je celá vzdálenost mezi bodem a obrazem. Osa leží uprostřed, takže bod C má k ní jen polovinu." },
      { value: 4 * a, why: "Vzdálenost se zdvojnásobila, místo aby se rozpůlila. Bod C je k ose blíž než jeho obraz k bodu." },
      { value: a + 1, why: "Počítaly se body místo mezer. Osa dělí úsek přesně napůl, žádný čtvereček navíc se nepřidává." },
    ],
    [
      `Osa leží přesně uprostřed mezi bodem C a jeho obrazem, takže úsek ${pad(2 * a, "ČTVEREČEK")} rozdělí na dvě stejné části. Kterou operací jednu takovou část spočítáš?`,
      `Bod a jeho obraz mají od osy stejnou vzdálenost, proto osa dělí úsek mezi nimi přesně napůl. Z celé vzdálenosti ${pad(2 * a, "ČTVEREČEK")} tedy hledáš polovinu, a k tomu slouží dělení dvěma. Zdvojnásobení by vedlo opačným směrem: to je cesta od vzdálenosti bodu k celému úseku, ne zpátky.`,
    ],
    [
      `Celý úsek mezi bodem a obrazem: ${pad(2 * a, "ČTVEREČEK")}.`,
      `Osa je uprostřed, takže ${2 * a} : 2 = ${a}.`,
      `Bod C je od osy vzdálený ${pad(a, "ČTVEREČEK")}.`,
    ],
  ));
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1);
  if (level === 2) return sada(24, (i) => (i % 3 === 2 ? obrazec() : pismeno()));
  const t = [obrazBodu, osaMezi, odstupObrazu, zOdstupu];
  return sada(30, (i) => t[i % 4]());
}

export const OSOVASOUMERNOSTSESTROJENIOBRAZUURCENIOSY: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy",
    title: "Osová souměrnost - sestrojení obrazu, určení osy",
    studentTitle: "Osová souměrnost",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Souměrnost",
    briefDescription: "Poznáš osovou souměrnost a naučíš se sestrojit obraz.",
    keywords: ["osová souměrnost", "osa souměrnosti", "zrcadlový obraz", "přeložení", "souměrný"],
    goals: [
      "Vysvětlit, co je osová souměrnost",
      "Určit osy souměrnosti obrazce",
      "Sestrojit obraz bodu nebo úsečky při osové souměrnosti",
      "Rozpoznat osově souměrné tvary v přírodě a každodenním životě",
    ],
    boundaries: ["Bez středové souměrnosti", "Bez analytické geometrie"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osová souměrnost je jako přeložení papíru nebo zrcadlový odraz. Bod a jeho obraz jsou stejně daleko od osy, na opačných stranách.",
      steps: [
        "Najdi osu souměrnosti (přímku překládání).",
        "Z každého bodu veď kolmici na osu.",
        "Odměř stejnou vzdálenost na druhou stranu.",
        "Spoj body — to je obraz.",
      ],
      commonMistake: "Chyba: obraz není stejně daleko od osy jako originál. Vzdálenost bodu od osy = vzdálenost obrazu od osy.",
      example: "Čtverec se stranou 4 cm má 4 osy souměrnosti: 2 přes střednice stran, 2 přes úhlopříčky.",
    },
  },
];
