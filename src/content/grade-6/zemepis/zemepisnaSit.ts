/**
 * Zeměpis 6. ročník — Zeměpisná síť: rovnoběžky, poledníky, souřadnice.
 *
 * Stavba podle výpočetního vzoru `../fyzika/mereniDelky.ts`, helpery jen
 * z `./_shared.ts`. Téma emituje výhradně select_one: souřadnice mají ustálený
 * zápis („12° s. š., 30° z. d.“) a výběr ze čtyř tvarů dovolí, aby každý
 * distraktor byl jedna konkrétní záměna.
 *
 *  • L1 — pojmy a rozsahy z banky (rovnoběžka × poledník, rovník, nultý
 *    poledník, 0–90° a 0–180°, zkratky polokoulí). Žádná dvojice souřadnic.
 *  • L2 — zápis a čtení: slovní popis → zápis, zápis → polokoule, která ze
 *    čtyř lodí je nejseverněji / nejblíž rovníku, město podle polokoulí, krok
 *    po síti s pevným rozestupem.
 *  • L3 — dva kroky: let po poledníku přes rovník, let po rovnoběžce přes
 *    nultý poledník, přes poledník 180°, vzdálenost dvou míst na poledníku,
 *    zápis z popisu (dvě znění). Znění vždy s konkrétním bodem a pohybem.
 *
 * Šablon je v L2 pět a v L3 šest schválně: sezení bere PRVNÍCH šest úloh
 * (`aiExecution.ts`), takže při čtyřech šablonách dostal žák dvě z nich
 * dvakrát. Pořadí šablon (a v L1 pořadí banky pojmů) se navíc v `gen()` míchá.
 *
 * Souřadnice se v programu drží jako znaménková čísla (sever a východ +,
 * jih a západ −) a píšou se jen přes `sirka()` / `delka()`. Rotace šablon se
 * nastaví uvnitř gen(), modul nemá stav mezi voláními.
 *
 * Přepočet na kilometry ani časová pásma se tu nepoužívají.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  buildChoiceTask as uloha,
  losUlohy,
  ruzneUlohy,
  pick,
  shuffle,
  rnd,
  cis,
  sirka,
  delka,
  type Distractor,
} from "./_shared";

// ── Pomocné funkce ─────────────────────────────────────────────────────────
const znam = (x: number): 1 | -1 => (x < 0 ? -1 : 1);
const nahodneZnam = (): 1 | -1 => (Math.random() < 0.5 ? 1 : -1);
const zapis = (f: number, l: number): string => `${sirka(f)}, ${delka(l)}`;

const polS = (f: number): string => (f > 0 ? "severní" : "jižní");
const polV = (l: number): string => (l > 0 ? "východní" : "západní");
const smerS = (f: number): string => (f > 0 ? "severně" : "jižně");
const smerV = (l: number): string => (l > 0 ? "východně" : "západně");
const zkrS = (f: number): string => (f > 0 ? "s. š." : "j. š.");
const zkrV = (l: number): string => (l > 0 ? "v. d." : "z. d.");

/**
 * Tečka na konci věty za souřadnicí. Zápis šířky i délky končí zkratkou, která
 * tečku už má („74° v. d.“), a česky se druhá tečka nepíše. `sirka()`/`delka()`
 * ale vracejí i tvary bez tečky („0° (rovník)“, „180°“) — o tu se postará
 * tohle. Ve znění otázky, v nápovědě i ve vysvětlení se proto místo
 * `${delka(l)}.` píše `${veta(delka(l))}`.
 */
const veta = (s: string): string => (s.endsWith(".") ? s : `${s}.`);

/** Číslovka slovy pro 2–4 (aby ve znění nestálo „o 3 rovnoběžky“ s číslicí). */
const POCET_Z = ["", "", "dvě", "tři", "čtyři"]; // ženský rod: rovnoběžky
const POCET_M = ["", "", "dva", "tři", "čtyři"]; // mužský rod: poledníky

// ── L1: banka pojmů ────────────────────────────────────────────────────────
interface Pojem {
  q: string;
  a: string;
  d: Distractor[];
  h: [string, string];
  e: string;
}

const BANKA_L1: Pojem[] = [
  {
    q: "Jak se jmenuje kružnice, která obíhá Zemi ze západu na východ a určuje zeměpisnou šířku?",
    a: "rovnoběžka",
    d: [
      { value: "poledník", why: "Poledník vede od severního pólu k jižnímu a určuje zeměpisnou délku, ne šířku." },
      { value: "zemská osa", why: "Zemská osa je myšlená přímka, kolem které se Země otáčí. Na povrchu glóbu neleží." },
      { value: "nultý poledník", why: "Nultý poledník je jeden z poledníků. Vede od pólu k pólu přes Greenwich a určuje délku, ne šířku." },
    ],
    h: [
      "Název té čáry říká, že je od rovníku po celé délce stejně daleko.",
      "Čáry, které vedou od pólu k pólu, mají jiný název a na pólech se sbíhají. Tahle čára se nikde nesbíhá a k pólům se postupně zkracuje.",
    ],
    e: "Rovnoběžky jsou kružnice souběžné s rovníkem. Určují zeměpisnou šířku a směrem k pólům se zkracují.",
  },
  {
    q: "Jak se jmenuje půlkružnice na glóbu, která spojuje severní pól s jižním pólem?",
    a: "poledník",
    d: [
      { value: "rovnoběžka", why: "Rovnoběžky vedou souběžně s rovníkem ze západu na východ. Póly nespojují." },
      { value: "rovník", why: "Rovník obepíná Zemi uprostřed mezi póly. Póly nespojuje." },
      { value: "obratník", why: "Obratníky jsou rovnoběžky asi 23,5° od rovníku. Vedou napříč, ne od pólu k pólu." },
    ],
    h: [
      "Ta čára vede ve směru sever–jih a všechny takové čáry se sbíhají na pólech.",
      "Název souvisí se slovem poledne: všechna místa na téže čáře mají poledne ve stejnou chvíli. Rovník a čáry souběžné s ním naopak vedou napříč, ze západu na východ.",
    ],
    e: "Poledníky jsou stejně dlouhé půlkružnice od pólu k pólu. Určují zeměpisnou délku.",
  },
  {
    q: "Která rovnoběžka má zeměpisnou šířku 0°?",
    a: "rovník",
    d: [
      { value: "nultý poledník", why: "Nultý poledník má 0° zeměpisné délky a vede od pólu k pólu. Rovnoběžka to není." },
      { value: "severní polární kruh", why: "Severní polární kruh leží daleko na severu, asi na 66,5° s. š." },
      { value: "obratník Raka", why: "Obratník Raka leží asi na 23,5° s. š., ne na nule." },
    ],
    h: [
      "Zeměpisná šířka se počítá od jedné výjimečné čáry, která dělí Zemi na severní a jižní polokouli.",
      "Od této čáry se stupně šířky počítají na sever i na jih, takže sama má nulu. Leží přesně uprostřed mezi oběma póly a ze všech rovnoběžek je nejdelší.",
    ],
    e: "Rovník je rovnoběžka 0°. Od něj se zeměpisná šířka měří na sever (s. š.) i na jih (j. š.).",
  },
  {
    q: "Kudy prochází nultý (základní) poledník?",
    a: "přes Greenwich u Londýna",
    d: [
      { value: "přes Prahu ve střední Evropě", why: "Praha leží asi na 14° v. d., tedy východně od nultého poledníku." },
      { value: "podél rovníku napříč Afrikou", why: "Poledník vede od pólu k pólu, ne podél rovníku. Rovník a nultý poledník jsou dvě různé čáry." },
      { value: "přes Tichý oceán, daleko od Evropy", why: "Tichým oceánem vede poledník 180°. Leží na opačné straně Země než nultý poledník." },
    ],
    h: [
      "Nultý poledník vede od severního pólu k jižnímu a byl vybrán mezinárodní dohodou.",
      "Vybrali ho tak, aby procházel slavnou hvězdárnou ve Velké Británii. Od něj se pak měří, jak daleko je každé místo na východ nebo na západ.",
    ],
    e: "Nultý poledník prochází hvězdárnou v Greenwichi u Londýna. Poledník 180° leží na opačné straně Země.",
  },
  {
    q: "V jakém rozmezí stupňů se pohybuje zeměpisná šířka?",
    a: "od 0° do 90°",
    d: [
      { value: "od 0° do 180°", why: "Do 180° sahá zeměpisná délka. Šířka končí na pólu a od rovníku k pólu je jen čtvrtina kružnice, tedy 90°." },
      { value: "od 0° do 360°", why: "360° má celá kružnice. Od rovníku k pólu je jen její čtvrtina." },
      { value: "od 1° do 90°", why: "Rovník má šířku 0°, takže hodnoty začínají nulou, ne jedničkou." },
    ],
    h: [
      "Šířka se počítá od rovníku až k pólu. Jakou část celé kružnice ta cesta tvoří?",
      "Celá kružnice má 360°. Od rovníku přes pól až na druhou stranu rovníku je polovina kružnice, od rovníku k pólu jen čtvrtina. A jakou šířku má sám rovník?",
    ],
    e: "Šířka se měří od rovníku (0°) k pólu (90°). Od rovníku k pólu je čtvrtina kružnice: 360° : 4 = 90°.",
  },
  {
    q: "V jakém rozmezí stupňů se pohybuje zeměpisná délka?",
    a: "od 0° do 180°",
    d: [
      { value: "od 0° do 90°", why: "Do 90° sahá zeměpisná šířka. Délka se počítá od nultého poledníku na východ i na západ až k poledníku na opačné straně Země." },
      { value: "od 0° do 360°", why: "Délka se nepočítá kolem celé Země jedním směrem. Na východ i na západ se jde jen do poloviny kružnice." },
      { value: "od 0° do 24°", why: "24 je počet hodin ve dni, ne počet stupňů zeměpisné délky." },
    ],
    h: [
      "Délka se počítá od nultého poledníku zvlášť na východ a zvlášť na západ.",
      "Na východ i na západ se jde jen k poledníku, který leží na opačné straně Země. Jakou část celé kružnice (360°) taková cesta tvoří?",
    ],
    e: "Délka se měří od nultého poledníku (0°) na východ i na západ až k poledníku na opačné straně Země. To je polovina kružnice: 360° : 2 = 180°.",
  },
  {
    q: "Co udává zeměpisná šířka místa?",
    a: "úhlovou vzdálenost od rovníku",
    d: [
      { value: "úhlovou vzdálenost od nultého poledníku", why: "Vzdálenost od nultého poledníku udává zeměpisná délka." },
      { value: "úhlovou vzdálenost od severního pólu", why: "Šířka se neměří od pólu. Pól má šířku 90°, nulu má jiná čára." },
      { value: "délku rovnoběžky v kilometrech", why: "Šířka se udává ve stupních, ne v kilometrech, a neříká, jak dlouhá je rovnoběžka." },
    ],
    h: [
      "Šířka se udává ve stupních a určují ji rovnoběžky.",
      "Hodnotu 0° má ta rovnoběžka, od které se šířka počítá na sever i na jih. Hodnotu 90° mají póly, které jsou od ní nejdál.",
    ],
    e: "Zeměpisná šířka říká, o kolik stupňů je místo severně nebo jižně od rovníku.",
  },
  {
    q: "Co udává zeměpisná délka místa?",
    a: "úhlovou vzdálenost od nultého poledníku",
    d: [
      { value: "úhlovou vzdálenost od rovníku", why: "Vzdálenost od rovníku udává zeměpisná šířka." },
      { value: "úhlovou vzdálenost od poledníku 180°", why: "Poledník 180° je konec počítání, ne začátek. Délka začíná na 0°." },
      { value: "délku poledníku v kilometrech od pólu", why: "Délka se udává ve stupních. Všechny poledníky jsou navíc stejně dlouhé." },
    ],
    h: [
      "Délku určují poledníky a udává se ve stupních na východ nebo na západ.",
      "Hodnotu 0° má ten poledník, od kterého se délka počítá, a prochází Greenwichem u Londýna. Na opačné straně Země leží poledník 180°.",
    ],
    e: "Zeměpisná délka říká, o kolik stupňů je místo východně nebo západně od nultého poledníku.",
  },
  {
    q: "Co je na zemském povrchu místo se zeměpisnou šířkou 90° s. š.?",
    a: "severní pól, tedy jen bod",
    d: [
      { value: "nejdelší rovnoběžka na Zemi", why: "Nejdelší rovnoběžka je rovník (0°). K pólům se rovnoběžky zkracují, až na 90° zbude jen bod." },
      { value: "severní polární kruh", why: "Severní polární kruh leží asi na 66,5° s. š., ještě daleko od pólu." },
      { value: "rovnoběžka dlouhá jako rovník", why: "Rovnoběžky se k pólům zkracují. Stejně dlouhá jako rovník není žádná jiná." },
    ],
    h: [
      "Rovnoběžky se směrem od rovníku k pólům zkracují.",
      "Představ si, co zbude z rovnoběžky, když dojdeš až na úplný sever, 90° od rovníku. Kružnice se tam smrskne na nejmenší možnou velikost.",
    ],
    e: "Šířka 90° s. š. patří severnímu pólu. Rovnoběžky se k pólu zkracují, až z nich zbude jediný bod.",
  },
  {
    q: "Místo má zeměpisnou šířku se zkratkou j. š. Na které polokouli leží?",
    a: "na jižní polokouli",
    d: [
      { value: "na západní polokouli", why: "Západní polokouli určuje délka se zkratkou z. d. Písmeno j znamená jih." },
      { value: "na severní polokouli", why: "Severní polokouli označuje zkratka s. š. Písmeno j znamená jih." },
      { value: "na východní polokouli", why: "Východní polokouli určuje délka se zkratkou v. d., ne šířka." },
    ],
    h: [
      "První písmeno zkratky je první písmeno světové strany, druhé říká, jestli jde o šířku, nebo délku.",
      "Šířka (š.) říká, jestli je místo severně, nebo jižně od rovníku. Západ a východ určuje až délka (d.).",
    ],
    e: "Zkratka j. š. znamená jižní šířku: místo leží jižně od rovníku, tedy na jižní polokouli.",
  },
  {
    q: "Místo leží západně od nultého poledníku. Jakou zkratku má jeho zeměpisná délka?",
    a: "z. d.",
    d: [
      { value: "v. d.", why: "v. d. znamená východní délku a patří místům východně od nultého poledníku." },
      { value: "j. š.", why: "j. š. je zkratka jižní šířky. Ta se měří od rovníku, ne od nultého poledníku." },
      { value: "z. š.", why: "Západ a východ určuje délka, ne šířka. Zkratka z. š. se nepoužívá." },
    ],
    h: [
      "Zkratka délky má dvě písmena: první světovou stranu a za ní písmeno pro délku.",
      "Délka se měří od nultého poledníku na východ nebo na západ. První písmeno zkratky je první písmeno té strany, na které místo leží.",
    ],
    e: "Místa západně od nultého poledníku mají západní délku, zkratka je z. d.",
  },
  {
    q: "Místo leží severně od rovníku. Jakou zkratku má jeho zeměpisná šířka?",
    a: "s. š.",
    d: [
      { value: "j. š.", why: "j. š. znamená jižní šířku a patří místům jižně od rovníku." },
      { value: "v. d.", why: "v. d. je východní délka. Sever a východ jsou různé strany a délka se měří od nultého poledníku." },
      { value: "s. d.", why: "Sever a jih určuje šířka, ne délka. Zkratka s. d. se nepoužívá." },
    ],
    h: [
      "Zkratka šířky má dvě písmena: první světovou stranu a za ní písmeno pro šířku.",
      "Šířka se měří od rovníku na sever nebo na jih. První písmeno zkratky je první písmeno té strany, na které místo leží.",
    ],
    e: "Místa severně od rovníku mají severní šířku, zkratka je s. š.",
  },
  {
    q: "Která rovnoběžka je na Zemi nejdelší?",
    a: "rovník",
    d: [
      { value: "severní polární kruh", why: "Polární kruh leží blízko pólu, a proto je kratší." },
      { value: "obratník Kozoroha", why: "Obratník Kozoroha leží asi na 23,5° j. š. a je kratší než rovnoběžka 0°." },
      { value: "rovnoběžka 90° s. š.", why: "Na 90° s. š. je severní pól. To je jen bod, ne dlouhá kružnice." },
    ],
    h: [
      "Rovnoběžky se směrem k pólům zkracují.",
      "Nejdelší je tedy ta, která je od obou pólů nejdál, přesně uprostřed mezi nimi. Její zeměpisná šířka je 0°.",
    ],
    e: "Rovník vede kolem nejširšího místa Země. Ostatní rovnoběžky jsou kratší, a čím blíž pólu, tím kratší jsou.",
  },
  {
    q: "Jak se od sebe liší délky jednotlivých poledníků?",
    a: "všechny jsou stejně dlouhé",
    d: [
      { value: "nejdelší je nultý poledník", why: "Nultý poledník je zvláštní jen tím, že se od něj počítá délka. Dlouhý je stejně jako ostatní." },
      { value: "směrem k pólům se zkracují", why: "Zkracují se rovnoběžky. Poledníky vedou všechny od pólu k pólu." },
      { value: "nejdelší je poledník 180°", why: "Poledník 180° je stejně dlouhý jako ostatní, jen leží naproti nultému." },
    ],
    h: [
      "Každý poledník začíná a končí na stejných dvou místech.",
      "Všechny poledníky spojují severní pól s jižním a každý je polovinou kružnice kolem Země. Porovnej to s rovnoběžkami, z nichž každá obíhá Zemi v jiné vzdálenosti od rovníku.",
    ],
    e: "Každý poledník je půlkružnice od severního pólu k jižnímu, proto jsou všechny stejně dlouhé.",
  },
  {
    q: "Kolik stupňů zeměpisné šířky je od rovníku k severnímu pólu?",
    a: "90°",
    d: [
      { value: "180°", why: "180° je cesta od severního pólu až k jižnímu, tedy dvakrát delší." },
      { value: "360°", why: "360° má celá kružnice kolem Země." },
      { value: "45°", why: "45° je jen polovina cesty od rovníku k pólu." },
    ],
    h: [
      "Celá kružnice kolem Země přes oba póly má 360°.",
      "Od rovníku přes severní pól, jižní pól a zpět k rovníku je celá kružnice. Úsek od rovníku k severnímu pólu je jedna ze čtyř stejných částí.",
    ],
    e: "Od rovníku k pólu je čtvrtina kružnice: 360° : 4 = 90°. Proto má pól šířku 90°.",
  },
  {
    q: "Jak se jmenuje poledník se zeměpisnou délkou 0°?",
    a: "nultý (základní) poledník",
    d: [
      { value: "rovník, nejdelší rovnoběžka", why: "Rovník má 0° zeměpisné šířky a je to rovnoběžka, ne poledník." },
      { value: "obratník Raka na severu", why: "Obratník Raka je rovnoběžka asi na 23,5° s. š." },
      { value: "poledník procházející Prahou", why: "Prahou vede poledník asi 14° v. d. Nula to není." },
    ],
    h: [
      "Poledník s hodnotou 0° je ten, od kterého se délka začíná počítat.",
      "Vede od pólu k pólu přes hvězdárnu v Greenwichi u Londýna. Jeho název vyjadřuje, že se od něj všechno počítá.",
    ],
    e: "Nultý neboli základní poledník má délku 0° a prochází Greenwichem. Od něj se délka měří na východ i na západ.",
  },
  {
    q: "V jakém pořadí se zapisují zeměpisné souřadnice místa?",
    a: "nejdřív šířka, potom délka",
    d: [
      { value: "nejdřív délka, potom šířka", why: "Dohoda je opačná. Za čárkou se píše až druhá souřadnice." },
      { value: "na pořadí vůbec nezáleží", why: "Na pořadí záleží. Obě čísla jsou ve stupních a bez pevného pořadí by se pletla." },
      { value: "nejdřív polokoule, potom stupně", why: "Stupně se píšou před zkratkou polokoule. Zápis má dvě části, šířku a délku." },
    ],
    h: [
      "Zkratka š. znamená šířku a zkratka d. délku. Vzpomeň si, jak vypadá zápis polohy nějakého místa.",
      "V atlasu je poloha Prahy zapsaná jako 50° s. š., 14° v. d. Podívej se, která ze zkratek š. a d. stojí v zápisu na prvním místě.",
    ],
    e: "Souřadnice se zapisují v pevném pořadí: první je zeměpisná šířka, za čárkou zeměpisná délka.",
  },
  {
    q: "Jak se mění délka rovnoběžek směrem od rovníku k pólům?",
    a: "postupně se zkracují",
    d: [
      { value: "postupně se prodlužují", why: "Nejdelší rovnoběžka je rovník. Blíž k pólům obíhají Zemi menší kružnice." },
      { value: "zůstávají stejně dlouhé", why: "Stejně dlouhé jsou poledníky. Rovnoběžky se mění." },
      { value: "nejdřív rostou, pak se krátí", why: "Rovník je nejdelší hned na začátku. Dál od něj se rovnoběžky už jen zkracují." },
    ],
    h: [
      "Představ si glóbus a kružnice, které ho obepínají souběžně s rovníkem.",
      "Rovník vede kolem nejširšího místa Země. U pólů je Země úzká, takže kružnice kolem ní tam musí být menší.",
    ],
    e: "Rovník je nejdelší rovnoběžka. Směrem k pólům se rovnoběžky zkracují a na pólu z nich zbude bod.",
  },
];

function genL1(p: Pojem): PracticeTask | null {
  return uloha(p.q, p.a, p.d, { hints: p.h, explanation: p.e });
}

// ── L2: zápis a čtení souřadnic ────────────────────────────────────────────
const SWAP_WHY =
  "Šířku určují rovnoběžky a měří se od rovníku na sever nebo na jih, délku poledníky od nultého poledníku. Tady se čísla prohodila.";

/** (A) Slovní popis → zápis. */
function genL2Zapis(): PracticeTask | null {
  let f = nahodneZnam() * rnd(1, 85);
  let l = nahodneZnam() * rnd(1, 175);
  const nula = Math.random();
  if (nula < 0.05) {
    f = 0;
    l = nahodneZnam() * rnd(1, 90);
  } else if (nula < 0.1) {
    l = 0;
  }
  const popisS = f === 0 ? "přímo na rovníku" : `${cis(Math.abs(f))}° ${smerS(f)} od rovníku`;
  const popisV = l === 0 ? "přímo na nultém poledníku" : `${cis(Math.abs(l))}° ${smerV(l)} od nultého poledníku`;
  const klic = zapis(f, l);

  const dis: Distractor[] = [];
  if (Math.abs(l) <= 90) {
    const sf = f !== 0 ? znam(f) : 1;
    const sl = l !== 0 ? znam(l) : 1;
    dis.push({ value: zapis(sf * Math.abs(l), sl * Math.abs(f)), why: SWAP_WHY });
    if (f === 0 || l === 0) dis.push({ value: zapis(-sf * Math.abs(l), -sl * Math.abs(f)), why: SWAP_WHY });
  }
  const strany: Distractor[] = [];
  if (f !== 0) {
    strany.push({
      value: zapis(-f, l),
      why: `Bod leží ${smerS(f)} od rovníku, a proto má ${polS(f)} šířku (${zkrS(f)}). Tady je strana od rovníku obrácená.`,
    });
  }
  if (l !== 0) {
    strany.push({
      value: zapis(f, -l),
      why: `Zkratka říká, na kterou stranu od nultého poledníku bod leží. ${smerV(l) === "západně" ? "Západně" : "Východně"} = ${zkrV(l)}, ne ${veta(zkrV(-l))}`,
    });
  }
  if (f !== 0 && l !== 0) {
    strany.push({
      value: zapis(-f, -l),
      why: "Obě zkratky jsou obráceně. Sever je s. š., jih j. š., východ v. d. a západ z. d.",
    });
  }
  dis.push(...shuffle(strany));

  return uloha(`Bod leží ${popisS} a ${popisV}. Který zápis jeho zeměpisných souřadnic je správný?`, klic, dis, {
    hints: [
      `Nejdřív urči šířku: měří se od rovníku na sever (s. š.) nebo na jih (j. š.). Ze zadání k ní patří údaj „${popisS}“.`,
      `Pak urči délku: měří se od nultého poledníku na východ (v. d.) nebo na západ (z. d.). K ní patří údaj „${popisV}“. Souřadnice se píšou v pořadí šířka, potom délka, a oddělují se čárkou.`,
    ],
    solutionSteps: [
      `Šířka: ${popisS} → ${sirka(f)}`,
      `Délka: ${popisV} → ${delka(l)}`,
      `Zápis (nejdřív šířka, potom délka): ${klic}`,
    ],
    explanation: `Rovnoběžky určují šířku a měří se od rovníku, poledníky určují délku a měří se od nultého poledníku. Údaj „${popisS}“ proto dává šířku ${sirka(f)} a údaj „${popisV}“ délku ${veta(delka(l))}`,
  });
}

/** (B) Zápis → polokoule. */
function genL2Polokoule(): PracticeTask | null {
  const f = nahodneZnam() * rnd(1, 85);
  const l = nahodneZnam() * rnd(1, 175);
  const text = (a: number, b: number): string => `na ${polS(a)} a ${polV(b)} polokouli`;
  const klic = text(f, l);
  const dis: Distractor[] = shuffle([
    {
      value: text(-f, l),
      why: `Zkratka ${zkrS(f)} znamená ${polS(f)} šířku, takže místo leží ${smerS(f)} od rovníku, ne ${smerS(-f)}.`,
    },
    {
      value: text(f, -l),
      why: `Zkratka ${zkrV(l)} znamená ${polV(l)} délku, takže místo leží ${smerV(l)} od nultého poledníku. ${smerV(-l) === "západně" ? "Západně" : "Východně"} by bylo ${veta(zkrV(-l))}`,
    },
    {
      value: text(-f, -l),
      why: "Obě polokoule jsou obráceně. O severní a jižní polokouli rozhoduje šířka (s. š., j. š.), o východní a západní délka (v. d., z. d.).",
    },
  ]);
  return uloha(
    `Místo má zeměpisné souřadnice ${veta(zapis(f, l))} Na kterých dvou polokoulích leží?`,
    klic,
    dis,
    {
      hints: [
        `Rozděl zápis ${zapis(f, l)} na dvě části: první je zeměpisná šířka, druhá zeměpisná délka.`,
        `Šířka ${sirka(f)} rozhodne, jestli je místo na severní, nebo jižní polokouli. Délka ${delka(l)} rozhodne mezi východní a západní polokoulí. Písmeno ve zkratce je první písmeno světové strany.`,
      ],
      solutionSteps: [
        `${sirka(f)} → ${smerS(f)} od rovníku → ${polS(f)} polokoule`,
        `${delka(l)} → ${smerV(l)} od nultého poledníku → ${polV(l)} polokoule`,
      ],
      explanation: `Šířka ${sirka(f)} znamená, že místo je ${smerS(f)} od rovníku, a délka ${delka(l)}, že je ${smerV(l)} od nultého poledníku. Leží tedy ${klic}.`,
    },
  );
}

/** (C) Čtyři lodě — nejseverněji, nebo nejblíž rovníku. */
const LODE = ["Albatros", "Delfín", "Racek", "Tuleň"];

/**
 * Oceánské koridory: pásy, které jsou v celém uvedeném rozsahu šířek otevřené
 * moře. Polohy lodí se NElosují volně — dokud se losovaly, hlásila loď polohu
 * z alžírské Sahary, z vnitrozemí Číny nebo z antarktického ledového štítu
 * (80° j. š. je stovky kilometrů od nejjižnější splavné vody, která končí
 * kolem 78° j. š.). Šířka tu nikde nepřesáhne 55°.
 */
interface Koridor {
  lat: [number, number];
  lon: [number, number];
}
const OCEANY: Koridor[] = [
  { lat: [8, 50], lon: [-45, -25] },     // severní Atlantik
  { lat: [-50, -5], lon: [-25, -8] },    // jižní Atlantik
  { lat: [-40, -8], lon: [60, 95] },     // Indický oceán
  { lat: [-40, 28], lon: [-135, -115] }, // východní Pacifik
  { lat: [-35, 40], lon: [-170, -145] }, // střední Pacifik
  { lat: [-25, 35], lon: [155, 175] },   // západní Pacifik
];
/** Koridor s velkým číslem délky — pro distraktor „velké číslo, ale je to délka“. */
const dalekoOdNuly = (k: Koridor): boolean => Math.min(Math.abs(k.lon[0]), Math.abs(k.lon[1])) >= 60;
/** Koridor, který nesahá dál na východ než 95° — nejvýchodnější zůstane jedna loď. */
const neNaVychode = (k: Koridor): boolean => k.lon[1] <= 95;

/** Zeměpisná délka otevřeného moře pro danou šířku. */
function naMori(f: number, filtr: (k: Koridor) => boolean = () => true): number {
  const k = pick(OCEANY.filter((o) => f >= o.lat[0] && f <= o.lat[1] && filtr(o)));
  return rnd(k.lon[0], k.lon[1]);
}

function genL2Lode(): PracticeTask | null {
  const [K, X, Y, Z] = shuffle(LODE);
  const pozice = new Map<string, [number, number]>();
  let otazka: string;
  let dis: Distractor[];
  let postup: string;
  let vysvetleni: string;
  let napoveda: [string, string];

  if (Math.random() < 0.5) {
    // nejseverněji
    const a = rnd(10, 38);
    const b = rnd(a + 10, 50);
    const c = rnd(1, a - 5);
    const z = rnd(1, 9);
    pozice.set(K, [a, naMori(a, neNaVychode)]);
    pozice.set(X, [-b, naMori(-b, neNaVychode)]);
    pozice.set(Y, [c, naMori(c, (k) => dalekoOdNuly(k) && neNaVychode(k))]);
    pozice.set(Z, [-z, rnd(155, 175)]);
    otazka = "Která loď je nejseverněji?";
    dis = [
      { value: X, why: `${X} má sice u šířky největší číslo, ale zkratka j. š. znamená, že pluje jižně od rovníku. Čím víc stupňů jižní šířky, tím jižněji.` },
      { value: Y, why: `U lodi ${Y} je velké číslo zeměpisné délky. Délka říká, jak daleko je loď na východ nebo na západ, ne na sever. Porovnávej šířku.` },
      { value: Z, why: `${Z} je ze všech lodí nejdál na východ (v. d.), ne na sever. Na sever ukazuje šířka se zkratkou s. š.` },
    ];
    napoveda = [
      "Kdo je nejseverněji, rozhoduje jen zeměpisná šířka, tedy první údaj v zápisu.",
      "Lodě se zkratkou s. š. jsou severně od rovníku, lodě s j. š. jižně od něj. Mezi loděmi na severní polokouli je nejseverněji ta, která má u s. š. největší číslo. Délky (v. d., z. d.) si nevšímej.",
    ];
    postup = "Nejseverněji je loď se severní šířkou a s největším číslem u s. š.";
    vysvetleni = `Na severní polokouli (s. š.) plují jen ${K} a ${Y}. Z nich má ${K} větší severní šířku (${sirka(a)}), a je proto nejseverněji.`;
  } else {
    // nejblíž rovníku
    const a = rnd(2, 12);
    const s = nahodneZnam();
    const yLat = a + rnd(2, 6);
    const zLat = a + rnd(8, 15);
    // Loď Z má schválně malé číslo délky: kdo sečte šířku s délkou, vyjde mu
    // jako „nejblíž rovníku“ právě ona. Malá délka je tu jižní Atlantik.
    pozice.set(K, [s * a, naMori(s * a, dalekoOdNuly)]);
    pozice.set(X, [-rnd(40, 55), 0]);
    pozice.set(Y, [-s * yLat, naMori(-s * yLat, dalekoOdNuly)]);
    pozice.set(Z, [-zLat, nahodneZnam() * rnd(3, 10)]);
    otazka = "Která loď je nejblíž rovníku?";
    dis = [
      { value: X, why: `${X} pluje po nultém poledníku, ne po rovníku. Nultý poledník vede od pólu k pólu, rovník obepíná Zemi napříč. O vzdálenosti od rovníku rozhoduje šířka.` },
      { value: Y, why: `${Y} je od rovníku ${cis(yLat)}°. Zkratka s. š. nebo j. š. jen říká, na které straně rovníku loď je. Blíž rovníku je ta, která má menší číslo šířky.` },
      { value: Z, why: `Tady se sečetla šířka s délkou. Vzdálenost od rovníku ale určuje jen šířka a ${Z} je od rovníku ${cis(zLat)}°.` },
    ];
    napoveda = [
      "Vzdálenost od rovníku udává jen zeměpisná šířka, tedy první údaj v zápisu.",
      "Nezáleží na tom, jestli je loď severně (s. š.), nebo jižně (j. š.). Porovnej jen počet stupňů šířky: rovník má šířku 0°, takže čím menší číslo šířky, tím blíž rovníku. Délku (v. d., z. d.) neber v úvahu.",
    ];
    postup = "Nejblíž rovníku je loď s nejmenším číslem šířky, ať je s. š., nebo j. š.";
    vysvetleni = `Rovník má šířku 0°. Nejmenší číslo šířky má ${K} (${sirka(s * a)}), a je proto rovníku nejblíž.`;
  }

  const poradi = shuffle(LODE);
  const hlaseni = poradi.map((n) => {
    const [f, l] = pozice.get(n)!;
    return `${n}: ${veta(zapis(f, l))}`;
  });
  const sirky = poradi.map((n) => `${n} ${sirka(pozice.get(n)![0])}`).join("; ");
  return uloha(`Čtyři lodě hlásí svou polohu. ${hlaseni.join(" ")} ${otazka}`, K, dis, {
    // Nápověda schválně nevyjmenovává lodě: jméno hledané lodi by v ní bylo
    // taky a nápověda by odpověď prozradila.
    hints: [napoveda[0], napoveda[1]],
    solutionSteps: [`Šířky: ${sirky}`, postup],
    explanation: vysvetleni,
  });
}

/** (D) Město podle polokoulí. Klíč nezávisí na přesném čísle: každá možnost je z jiné čtvrtiny. */
interface Mesto {
  jmeno: string;
  f: number;
  l: number;
}
const MESTA: Mesto[] = [
  { jmeno: "Praha", f: 50, l: 14 },
  { jmeno: "Tokio", f: 36, l: 140 },
  { jmeno: "Peking", f: 40, l: 116 },
  { jmeno: "Dillí", f: 29, l: 77 },
  { jmeno: "New York", f: 41, l: -74 },
  { jmeno: "Los Angeles", f: 34, l: -118 },
  { jmeno: "Sydney", f: -34, l: 151 },
  { jmeno: "Kapské Město", f: -34, l: 18 },
  { jmeno: "Jakarta", f: -6, l: 107 },
  { jmeno: "Nairobi", f: -1, l: 37 },
  { jmeno: "Rio de Janeiro", f: -23, l: -43 },
  { jmeno: "Buenos Aires", f: -35, l: -58 },
  { jmeno: "Lima", f: -12, l: -77 },
];
const ctvrt = (m: { f: number; l: number }): string => `${znam(m.f)}${znam(m.l)}`;

function genL2Mesto(): PracticeTask | null {
  const k = pick(MESTA);
  const ctvrti = ["11", "1-1", "-11", "-1-1"].filter((c) => c !== ctvrt(k));
  const dis: Distractor[] = ctvrti.map((c) => {
    const m = pick(MESTA.filter((x) => ctvrt(x) === c));
    const duvody: string[] = [];
    if (znam(m.f) !== znam(k.f)) duvody.push(`${sirka(k.f)} znamená ${smerS(k.f)} od rovníku`);
    if (znam(m.l) !== znam(k.l)) duvody.push(`${delka(k.l)} znamená ${smerV(k.l)} od nultého poledníku`);
    return {
      value: m.jmeno,
      why: `${m.jmeno} leží na ${polS(m.f)} a ${polV(m.l)} polokouli. Jenže ${duvody.join(" a ")}.`,
    };
  });
  const zadani = zapis(k.f, k.l);
  return uloha(`Které z těchto měst leží přibližně na ${zadani}?`, k.jmeno, shuffle(dis), {
    hints: [
      `Nejdřív urči polokouli podle šířky ${sirka(k.f)}: s. š. je severní, j. š. jižní polokoule.`,
      `Pak urči polokouli podle délky ${delka(k.l)}: v. d. leží východně od nultého poledníku, z. d. západně. Vyber město, které leží na obou polokoulích zároveň. Nultý poledník prochází Londýnem, takže celá Amerika leží západně od něj.`,
    ],
    solutionSteps: [
      `${sirka(k.f)} → ${polS(k.f)} polokoule`,
      `${delka(k.l)} → ${polV(k.l)} polokoule`,
      `Ze čtyř měst leží na ${polS(k.f)} a ${polV(k.l)} polokouli jen jedno.`,
    ],
    explanation: `Šířka ${sirka(k.f)} ukazuje na ${polS(k.f)} polokouli a délka ${delka(k.l)} na ${polV(k.l)}. Z nabízených měst leží na ${polS(k.f)} a ${polV(k.l)} polokouli jen ${k.jmeno}, ostatní jsou každé na jiné dvojici polokoulí.`,
  });
}

/**
 * (E) Krok po síti s pevným rozestupem. Čtvrtá šablona nestačila: v sezení se
 * bere prvních šest úloh, takže při čtyřech šablonách se dvě z nich objevily
 * dvakrát. Tahle je jiná i tvarem — nepracuje s dvojicí souřadnic, ale
 * s jedinou čárou sítě a s počítáním rozestupů.
 */
function genL2Krok(): PracticeTask | null {
  const sirkova = Math.random() < 0.5;
  const krok = pick([10, 15, 20, 30]);
  const n = rnd(2, 4);
  const posun = krok * n;
  const mez = sirkova ? 90 : 175;
  const car = Math.floor(mez / krok); // kolik čar se vejde od nuly k mezi
  if (car <= n) return null;
  // Bod se pohybuje po jedné polokouli: rovník ani nultý poledník nepřekročí.
  const odStredu = Math.random() < 0.5;
  const absStart = krok * (odStredu ? rnd(1, car - n) : rnd(n + 1, car));
  const m = odStredu ? 1 : -1;
  const absCil = absStart + m * posun;
  // „175° v. d.“ ve znění by obsahovalo klíč „75° v. d.“ jako podřetězec.
  if (String(absStart).endsWith(String(absCil))) return null;

  const s = nahodneZnam();
  const fmt = sirkova ? sirka : delka;
  const pol = sirkova ? polS : polV;
  const zkr = sirkova ? zkrS : zkrV;
  const stred = sirkova ? "rovník" : "nultý poledník";
  const odStredu2 = sirkova ? "rovníku" : "nultého poledníku";
  const cara = sirkova ? "rovnoběžka" : "poledník";
  const caru = sirkova ? "rovnoběžku" : "poledník";
  const cary = sirkova ? "rovnoběžky" : "poledníky";
  const car2 = sirkova ? "rovnoběžek" : "poledníků";
  const kde = sirkova ? "které rovnoběžce" : "kterém poledníku";
  const pocet = (sirkova ? POCET_Z : POCET_M)[n];
  const smer = sirkova ? (s * m > 0 ? "na sever" : "na jih") : s * m > 0 ? "na východ" : "na západ";
  const klic = fmt(s * absCil);

  const dis: Distractor[] = [
    {
      value: fmt(s * (absStart + m * krok)),
      why: `Tohle je posun jen o jednu ${caru}. Rozestup je ${krok}°, takže celý posun je ${n} × ${krok}° = ${posun}°.`,
    },
    {
      value: fmt(s * (absStart + m * n)),
      why: `Tady se připočetl počet čar, ne stupně. Každá ${cara} je o ${krok}° dál, takže se počítá ${n} × ${krok}°.`,
    },
    {
      value: fmt(-s * absCil),
      why: `Číslo sedí, ale bod ${stred} nepřekročil, a zůstává proto na ${pol(s)} polokouli se zkratkou ${veta(zkr(s))}`,
    },
  ];
  const opacny = absStart - m * posun;
  if (opacny > 0 && opacny <= mez) {
    dis.push({
      value: fmt(s * opacny),
      why: `Posun ${smer} vede od ${odStredu2} ${odStredu ? "pryč, takže číslo roste" : "blíž, takže číslo klesá"}. Tady se počítalo na opačnou stranu.`,
    });
  }

  return uloha(
    `Na glóbu jsou ${cary} nakresleny po ${krok}°. Bod leží na ${fmt(s * absStart)} a posune se ${smer} o ${pocet} ${cary}. Na ${kde} pak bude?`,
    klic,
    dis,
    {
      hints: [
        `Rozestup ${car2} je ${krok}°. Spočítej nejdřív, o kolik stupňů se bod celkem posune.`,
        `Celý posun je ${n} × ${krok}° = ${posun}°. Pak rozhodni, jestli se bod od ${odStredu2} vzdaluje (číslo roste), nebo se k němu blíží (číslo klesá). Zkratka se mění, jen když bod ${stred} překročí.`,
      ],
      solutionSteps: [
        `Posun: ${n} × ${krok}° = ${posun}°`,
        `Vzdálenost od ${odStredu2}: ${cis(absStart)}° ${m > 0 ? "+" : "−"} ${cis(posun)}° = ${cis(absCil)}°`,
        `Bod ${stred} nepřekročil, zkratka zůstává ${zkr(s)} → ${klic}`,
      ],
      explanation: `Sousední ${cary} jsou od sebe ${krok}°, takže ${pocet} ${cary} jsou ${n} × ${krok}° = ${posun}°. Bod se posune ${smer} z ${fmt(s * absStart)} na ${veta(klic)} Nepřekročil přitom ${stred}, a proto zůstává zkratka ${veta(zkr(s))}`,
    },
  );
}

// ── L3: dva kroky a přenos ─────────────────────────────────────────────────
/** (A) Let po poledníku přes rovník. */
function genL3PresRovnik(): PracticeTask | null {
  const f0 = nahodneZnam() * rnd(10, 70);
  const r = rnd(5, 60);
  const d = Math.abs(f0) + r;
  const l = nahodneZnam() * rnd(5, 150);
  const smer = f0 > 0 ? "jih" : "sever";
  const f1 = -znam(f0) * r;
  const klic = zapis(f1, l);
  const soucet = Math.abs(f0) + d;

  const dis: Distractor[] = [
    {
      value: zapis(znam(f0) * r, l),
      why: `Když letadlo přeletí rovník, dostane se na ${polS(f1)} polokouli. Zbytek cesty se měří od rovníku na ${smer}, takže zkratka šířky se mění.`,
    },
  ];
  if (soucet <= 90) {
    dis.push({
      value: zapis(f1 * (soucet / r), l),
      why: `Čísla se tu sečetla. Cesta ale nejdřív vede k rovníku (${cis(Math.abs(f0))}°) a teprve zbytek pokračuje za něj, proto se ${cis(Math.abs(f0))}° od ${cis(d)}° odečítá.`,
    });
  }
  // Distraktor „uražené stupně se přičetly i k délce“ se nabídne, jen když
  // součet dává platnou délku. Dřív se v opačném případě potichu odečítalo
  // a nabídnuté číslo pak neodpovídalo žádné chybě, kterou by žák udělal.
  const extra: Distractor[] = [
    {
      value: zapis(f1, -l),
      why: "Přes rovník se mění jen strana u šířky. Délka zůstává stejná jako na startu, protože letadlo se drží stále téhož poledníku.",
    },
  ];
  if (Math.abs(l) + r <= 175) {
    extra.push({
      value: zapis(f1, znam(l) * (Math.abs(l) + r)),
      why: "Při letu po poledníku se zeměpisná délka nemění, letadlo se neposouvá na východ ani na západ.",
    });
  }
  dis.push(...shuffle(extra));
  // Záloha, aby po vyřazení podmíněných distraktorů zůstaly tři.
  dis.push({
    value: zapis(-znam(f0) * (90 - r), l),
    why: `Zbytek cesty za rovníkem se měří od rovníku, ne od pólu. Za rovníkem letadlo urazí ${cis(r)}°, a právě tolik je od rovníku daleko.`,
  });

  return uloha(
    `Letadlo startuje z bodu ${zapis(f0, l)} a letí stále po témže poledníku na ${smer}. Urazí přitom ${cis(d)}° zeměpisné šířky. Kde přistane?`,
    klic,
    dis,
    {
      hints: [
        `Rozděl let na dva úseky: z ${sirka(f0)} k rovníku a od rovníku dál na ${smer}.`,
        `Kolik stupňů z celkových ${cis(d)}° zbude po přeletu rovníku? Ten zbytek se měří od rovníku na druhé polokouli, takže se změní i zkratka šířky. Zeměpisná délka zůstává stejná, protože letadlo se drží jednoho poledníku.`,
      ],
      solutionSteps: [
        `Z ${sirka(f0)} k rovníku: ${cis(Math.abs(f0))}°`,
        `Za rovníkem zbývá: ${cis(d)}° − ${cis(Math.abs(f0))}° = ${cis(r)}°`,
        `Šířka: ${sirka(f1)} (za rovníkem je ${polS(f1)} polokoule)`,
        `Délka se nemění: ${delka(l)}`,
      ],
      explanation: `Po ${cis(Math.abs(f0))}° letadlo dosáhne rovníku a zbylých ${cis(r)}° letí už na ${polS(f1)} polokouli. Šířka je proto ${veta(sirka(f1))} Po poledníku se letí jen na sever nebo na jih, a délka tak zůstává ${veta(delka(l))}`,
    },
  );
}

/** (B) Let po rovnoběžce přes nultý poledník. */
function genL3PresNulty(): PracticeTask | null {
  const l0 = nahodneZnam() * rnd(5, 80);
  const r = rnd(5, 90);
  const d = Math.abs(l0) + r;
  const f = nahodneZnam() * rnd(5, 80);
  const smer = l0 > 0 ? "západ" : "východ";
  const l1 = -znam(l0) * r;
  const klic = zapis(f, l1);
  const soucet = Math.abs(l0) + d;

  const dis: Distractor[] = [
    {
      value: zapis(f, znam(l0) * r),
      why: `Po přeletu nultého poledníku je letadlo na ${polV(l1)} polokouli. Zbytek cesty se měří od nultého poledníku na ${smer}, takže zkratka délky se mění.`,
    },
  ];
  if (soucet < 180) {
    dis.push({
      value: zapis(f, -znam(l0) * soucet),
      why: `Čísla se tu sečetla. Cesta ale nejdřív vede k nultému poledníku (${cis(Math.abs(l0))}°) a teprve zbytek pokračuje za něj, proto se ${cis(Math.abs(l0))}° od ${cis(d)}° odečítá.`,
    });
  }
  // Distraktor „uražené stupně se přičetly i k šířce“ se nabídne, jen když
  // součet dává platnou šířku. Dřív se jinak potichu odečítalo a výsledek
  // přeskočil na druhou polokouli — nabídnutá hodnota (třeba 72° j. š. při
  // startu na 13° s. š.) pak neplynula ze zadání a odůvodnění k ní nesedělo.
  const lzeSecist = Math.abs(f) + r <= 89;
  const extra: Distractor[] = [
    {
      value: zapis(-f, l1),
      why: `Při letu na ${smer} se mění jen délka. Šířka zůstává stejná jako na startu, protože letadlo se drží stále téže rovnoběžky.`,
    },
  ];
  if (lzeSecist) {
    extra.push({
      value: zapis(znam(f) * (Math.abs(f) + r), l1),
      why: "Při letu po rovnoběžce se zeměpisná šířka nemění, letadlo se neposouvá na sever ani na jih.",
    });
  }
  dis.push(...shuffle(extra));
  // Záloha, aby po vyřazení podmíněných distraktorů zůstaly tři.
  dis.push({
    value: zapis(f, -znam(l0) * (180 - r)),
    why: `Za nultým poledníkem se délka měří od něj, ne od poledníku 180°. Letadlo je za ním ${cis(r)}°, a právě tolik je jeho délka.`,
  });

  return uloha(
    `Letadlo startuje z bodu ${zapis(f, l0)} a letí stále po téže rovnoběžce na ${smer}. Urazí přitom ${cis(d)}° zeměpisné délky. Kde přistane?`,
    klic,
    dis,
    {
      hints: [
        `Rozděl let na dva úseky: z ${delka(l0)} k nultému poledníku a od něj dál na ${smer}.`,
        `Kolik stupňů z celkových ${cis(d)}° zbude po přeletu nultého poledníku? Ten zbytek se měří od nultého poledníku na druhé polokouli, takže se změní i zkratka délky. Zeměpisná šířka zůstává stejná, protože letadlo se drží jedné rovnoběžky.`,
      ],
      solutionSteps: [
        `Z ${delka(l0)} k nultému poledníku: ${cis(Math.abs(l0))}°`,
        `Za nultým poledníkem zbývá: ${cis(d)}° − ${cis(Math.abs(l0))}° = ${cis(r)}°`,
        `Délka: ${delka(l1)} (za nultým poledníkem je ${polV(l1)} polokoule)`,
        `Šířka se nemění: ${sirka(f)}`,
      ],
      explanation: `Po ${cis(Math.abs(l0))}° letadlo dosáhne nultého poledníku a zbylých ${cis(r)}° letí už na ${polV(l1)} polokouli. Délka je proto ${veta(delka(l1))} Po rovnoběžce se letí jen na východ nebo na západ, a šířka tak zůstává ${veta(sirka(f))}`,
    },
  );
}

/** (C) Let přes poledník 180°. */
function genL3Pres180(): PracticeTask | null {
  const sv = nahodneZnam(); // +1 = start na východní polokouli, letí na východ
  const l0 = rnd(150, 178);
  const kHranici = 180 - l0;
  const za = rnd(3, 38); // kolik stupňů za poledníkem 180°
  const d = kHranici + za;
  const r = 180 - za; // výsledná délka na druhé polokouli
  if (r === za) return null;
  const f = nahodneZnam() * rnd(5, 70);
  const smer = sv > 0 ? "východ" : "západ";
  const start = sv * l0;
  const cil = -sv * r;
  const klic = zapis(f, cil);
  const druha = polV(cil);

  const dis: Distractor[] = [
    {
      value: zapis(f, sv * r),
      why: `Číslo sedí, ale po přeletu poledníku 180° je letadlo na ${druha} polokouli, takže délka musí mít zkratku ${veta(zkrV(cil))}`,
    },
    {
      value: zapis(f, -sv * za),
      why: `${cis(za)}° je jen úsek za poledníkem 180°. Na ${druha} polokouli se ale délka měří od nultého poledníku, takže se ten úsek od 180° odečítá.`,
    },
    {
      value: zapis(f, sv * za),
      why: `Tady se od součtu odečetlo 180° a zůstala ${polV(start)} délka. Za poledníkem 180° začíná ${druha} polokoule a délka se tam od 180° zmenšuje.`,
    },
  ];

  return uloha(
    // Znění schválně jiné než u ostatních dvou letů: v sezení jdou úlohy za
    // sebou a tři stejně začínající věty působí, že je to pořád totéž.
    `Letadlo vzlétlo na poledníku ${veta(delka(start))} Letí po rovnoběžce ${sirka(f)} stále na ${smer} a urazí ${cis(d)}° zeměpisné délky. Jaké souřadnice má místo přistání?`,
    klic,
    shuffle(dis),
    {
      hints: [
        `Nejdřív spočítej, kolik stupňů chybí z ${delka(start)} k poledníku 180°.`,
        `Zbytek z celkových ${cis(d)}° pokračuje za poledníkem 180° na ${druha} polokouli. Tam se délka měří od nultého poledníku, takže směrem od 180° se číslo délky zmenšuje. Šířka zůstává stejná, protože letadlo se drží jedné rovnoběžky.`,
      ],
      solutionSteps: [
        `Z ${delka(start)} k poledníku 180°: 180° − ${cis(l0)}° = ${cis(kHranici)}°`,
        `Za poledníkem 180° zbývá: ${cis(d)}° − ${cis(kHranici)}° = ${cis(za)}°`,
        `Na ${druha} polokouli se délka od 180° zmenšuje: 180° − ${cis(za)}° = ${cis(r)}°, tedy ${delka(cil)}`,
        `Šířka se nemění: ${sirka(f)}`,
      ],
      explanation: `Poledník 180° odděluje východní a západní délku na opačné straně Země než nultý poledník. Letadlo ho mine po ${cis(kHranici)}° a dalších ${cis(za)}° letí po ${druha} polokouli, kde se délka počítá od nultého poledníku. Proto je délka 180° − ${cis(za)}° = ${cis(r)}°, tedy ${veta(delka(cil))}`,
    },
  );
}

/** (D) Úhlová vzdálenost dvou míst na témže poledníku. */
function genL3Vzdalenost(): PracticeTask | null {
  const stejna = Math.random() < 0.5;
  let a: number, b: number, klic: number;
  const dis: Distractor[] = [];
  const s = nahodneZnam();
  let f1: number, f2: number;
  if (stejna) {
    b = rnd(5, 28);
    a = rnd(2 * b + 3, 85);
    klic = a - b;
    [f1, f2] = shuffle([s * a, s * b]);
    dis.push(
      { value: `${cis(a + b)}°`, why: "Obě místa leží na stejné straně rovníku, takže cesta mezi nimi rovníkem neprochází. Vzdálenosti od rovníku se proto odečítají, ne sčítají." },
      { value: `${cis(a)}°`, why: `${cis(a)}° je vzdálenost vzdálenějšího místa od rovníku, ne vzdálenost mezi místy. Bližší místo je od rovníku ${cis(b)}° a tenhle úsek se musí odečíst.` },
      { value: `${cis(b)}°`, why: `${cis(b)}° je jen vzdálenost bližšího místa od rovníku. Mezi místy leží úsek od ${cis(b)}° do ${cis(a)}°.` },
      { value: `${cis(2 * a)}°`, why: `Tady se vzala dvakrát větší šířka, jako by obě místa byla ${cis(a)}° od rovníku.` },
    );
  } else {
    a = rnd(10, 70);
    b = rnd(5, 70);
    if (a === b) return null;
    klic = a + b;
    [f1, f2] = shuffle([s * a, -s * b]);
    const max = Math.max(a, b), min = Math.min(a, b);
    dis.push(
      { value: `${cis(max - min)}°`, why: "Místa leží každé na jiné straně rovníku, takže se vzdálenosti od rovníku sčítají: nejdřív k rovníku, pak za něj. Tady se odečetly." },
      { value: `${cis(max)}°`, why: `Tady se počítala jen cesta od rovníku k místu vzdálenému ${cis(max)}°. Chybí úsek od rovníku k druhému místu (${cis(min)}°).` },
      { value: `${cis(2 * max)}°`, why: `Tady se vzala dvakrát větší šířka, jako by obě místa byla ${cis(max)}° od rovníku. Druhé místo je od rovníku jen ${cis(min)}°.` },
    );
  }
  // Poledník v zadání nesmí končit číslicemi klíče: „160° v. d.“ by u klíče
  // „60°“ vypadalo jako prozrazená odpověď ve znění otázky.
  const zakaz = String(klic);
  const moznosti: number[] = [];
  for (let x = 5; x <= 175; x++) if (!String(x).endsWith(zakaz)) moznosti.push(x);
  const l = nahodneZnam() * pick(moznosti);

  const kroky = stejna
    ? [
        `${sirka(f1)} i ${sirka(f2)} jsou ${smerS(s)} od rovníku, cesta mezi místy rovníkem neprochází.`,
        `Vzdálenost: ${cis(a)}° − ${cis(b)}° = ${cis(klic)}°`,
      ]
    : [
        `${sirka(f1)} je ${smerS(f1)} od rovníku, ${sirka(f2)} ${smerS(f2)}. Cesta mezi místy vede přes rovník.`,
        `Vzdálenost: ${cis(Math.abs(f1))}° + ${cis(Math.abs(f2))}° = ${cis(klic)}°`,
      ];

  return uloha(
    `Dvě místa leží na stejném poledníku ${veta(delka(l))} První má zeměpisnou šířku ${sirka(f1)}, druhé ${veta(sirka(f2))} Kolik stupňů zeměpisné šířky je mezi nimi?`,
    `${cis(klic)}°`,
    dis,
    {
      hints: [
        `Podívej se, jestli jsou obě místa na stejné straně rovníku: porovnej zkratky u ${sirka(f1)} a ${veta(sirka(f2))}`,
        `Místa jsou od rovníku ${cis(Math.abs(f1))}° a ${cis(Math.abs(f2))}°. Když leží na stejné straně, cesta mezi nimi rovník nepřekročí. Když leží na opačných stranách, cesta vede přes rovník: nejdřív k němu a pak za něj. Podle toho vzdálenosti od rovníku buď sečti, nebo odečti.`,
      ],
      solutionSteps: kroky,
      explanation: stejna
        ? `Obě místa jsou ${smerS(s)} od rovníku, takže vzdálenost mezi nimi je rozdíl jejich šířek: ${cis(a)}° − ${cis(b)}° = ${cis(klic)}°.`
        : `Místa leží na opačných stranách rovníku. Cesta vede k rovníku a pak za něj, a proto se šířky sčítají: ${cis(a)}° + ${cis(b)}° = ${cis(klic)}°.`,
    },
  );
}

/** (E) Zápis z kombinovaného popisu (rovnoběžka, poledník, polokoule, Greenwich). */
function genL3Popis(greenwich: boolean): PracticeTask | null {
  const f = nahodneZnam() * rnd(5, 85);
  const l = nahodneZnam() * rnd(5, 89);
  if (Math.abs(f) === Math.abs(l)) return null;
  const F = cis(Math.abs(f)), L = cis(Math.abs(l));
  const otazka = greenwich
    ? `Bod leží na ${polS(f)} polokouli, a to na rovnoběžce ${F}°. Zároveň je ${L}° ${smerV(l)} od Greenwiche. Který zápis jeho souřadnic je správný?`
    : `O bodu víme tři věci: leží na poledníku ${L}°, na rovnoběžce ${F}° a zároveň na ${polS(f)} a ${polV(l)} polokouli. Který zápis jeho souřadnic tomu odpovídá?`;
  const klic = zapis(f, l);
  const dis: Distractor[] = [
    {
      value: zapis(znam(f) * Math.abs(l), znam(l) * Math.abs(f)),
      why: "Rovnoběžky určují zeměpisnou šířku, poledníky zeměpisnou délku. Tady se čísla prohodila: číslo rovnoběžky patří k šířce.",
    },
    ...shuffle<Distractor>([
      {
        value: zapis(-f, l),
        why: `Bod leží na ${polS(f)} polokouli, takže šířka musí mít zkratku ${veta(zkrS(f))} Zkratka ${zkrS(-f)} patří bodům ${smerS(-f)} od rovníku.`,
      },
      {
        value: zapis(f, -l),
        why: greenwich
          ? `Greenwich leží na nultém poledníku. Bod ${smerV(l)} od něj má ${polV(l)} délku (${zkrV(l)}).`
          : `Bod leží na ${polV(l)} polokouli, takže délka má zkratku ${zkrV(l)}, ne ${veta(zkrV(-l))}`,
      },
      {
        value: zapis(-f, -l),
        why: "Obě zkratky jsou obráceně. Severní polokoule je s. š., jižní j. š., východní v. d. a západní z. d.",
      },
    ]),
  ];
  return uloha(otazka, klic, dis, {
    hints: [
      `Rozhodni nejdřív, který údaj patří k šířce: šířku určují rovnoběžky, délku poledníky. V zadání jsou čísla ${F}° a ${L}°.`,
      `Pak přiřaď zkratky podle polokoulí: severní polokoule s. š., jižní j. š., východní v. d., západní z. d.${greenwich ? " Greenwich leží na nultém poledníku, od kterého se měří délka." : ""} Nakonec zapiš nejdřív šířku a za čárku délku.`,
    ],
    solutionSteps: [
      `Rovnoběžka ${F}° → šířka ${F}°, ${polS(f)} polokoule → ${sirka(f)}`,
      greenwich
        ? `${L}° ${smerV(l)} od Greenwiche (nultý poledník) → ${delka(l)}`
        : `Poledník ${L}° → délka ${L}°, ${polV(l)} polokoule → ${delka(l)}`,
      `Zápis: ${klic}`,
    ],
    explanation: `Číslo rovnoběžky (${F}°) je zeměpisná šířka a ${polS(f)} polokoule jí dává zkratku ${veta(zkrS(f))} Délka ${L}° se měří od nultého poledníku a bod leží ${smerV(l)} od něj, proto ${veta(zkrV(l))} Výsledek je ${veta(klic)}`,
  });
}

// Dvě samostatné šablony: v sezení se bere prvních šest úloh, a s pěti
// šablonami se jedna z nich objevila dvakrát. Obě znění se čtou jinak.
const genL3PopisGreenwich = (): PracticeTask | null => genL3Popis(true);
const genL3PopisTriVeci = (): PracticeTask | null => genL3Popis(false);

// ── Generátor ──────────────────────────────────────────────────────────────
const SABLONY_L2 = [genL2Zapis, genL2Polokoule, genL2Lode, genL2Mesto, genL2Krok];
const SABLONY_L3 = [
  genL3PresRovnik,
  genL3PresNulty,
  genL3Pres180,
  genL3Vzdalenost,
  genL3PopisGreenwich,
  genL3PopisTriVeci,
];

function gen(level: number): PracticeTask[] {
  // Rotace se nastavuje tady, ne na úrovni modulu: gen() nemá stav mezi voláními.
  // Pořadí se míchá, protože sezení bere PRVNÍCH šest úloh: bez zamíchání by se
  // opakovala pořád tatáž šablona (a v L1 pořád prvních šest pojmů z banky).
  let i = 0;
  if (level <= 1) {
    const banka = shuffle(BANKA_L1);
    return ruzneUlohy(() => losUlohy(() => genL1(banka[i++ % banka.length])));
  }
  const s = shuffle(level === 2 ? SABLONY_L2 : SABLONY_L3);
  return ruzneUlohy(() => losUlohy(s[i++ % s.length]));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const ZEMEPISNA_SIT: TopicMetadata[] = [
  {
    id: "g6-zem-zemepisna-sit-6",
    rvpNodeId: "g6-zemepis-geograficke-informace-zdroje-dat-kartogr-mapa-a-globus-zemepisna-sit-rovnobezky-poledniky-souradnice",
    displayName: "Zeměpisná síť a souřadnice",
    title: "Zeměpisná síť - rovnoběžky, poledníky, souřadnice",
    studentTitle: "Zeměpisná síť a souřadnice",
    subject: "zemepis",
    category: "Geografické informace, zdroje dat, kartografie",
    topic: "Mapa a glóbus",
    briefDescription: "Poznáš rovnoběžky a poledníky a určíš, kde bod na Zemi leží.",
    keywords: [
      "zeměpisná síť", "rovnoběžka", "poledník", "rovník", "nultý poledník", "Greenwich",
      "zeměpisná šířka", "zeměpisná délka", "souřadnice", "polokoule", "s. š.", "v. d.",
    ],
    goals: [
      "Rozlišit rovnoběžky a poledníky a znát rovník a nultý poledník.",
      "Znát rozsah zeměpisné šířky (0–90°) a délky (0–180°).",
      "Zapsat a přečíst zeměpisné souřadnice bodu a určit jeho polokoule.",
      "Odvodit nové souřadnice po posunu přes rovník, nultý poledník nebo poledník 180°.",
    ],
    boundaries: [
      "Jen celé stupně, bez minut.",
      "Bez přepočtu stupňů na kilometry a bez časových pásem.",
      "Poloha se popisuje slovy a souřadnicemi, bez mapy a obrázku.",
      "Žák vybírá ze čtyř možností, nepíše vlastní odpověď.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Šířka se měří od rovníku (s. š., j. š.), délka od nultého poledníku (v. d., z. d.). Zapisuje se nejdřív šířka, pak délka.",
      steps: [
        "Urči, který údaj patří k šířce (rovnoběžky, rovník) a který k délce (poledníky, Greenwich).",
        "Podle strany od rovníku a od nultého poledníku přiřaď zkratky.",
        "Při posunu přes rovník nebo nultý poledník rozděl cestu na dva úseky a změň stranu.",
      ],
      commonMistake: "Prohodit šířku s délkou nebo po přeletu rovníku zapomenout změnit s. š. na j. š.",
      example: "Z 40° s. š., 20° v. d. letadlo letí 55° na jih: 40° k rovníku, zbytek 15° za ním → 15° j. š., 20° v. d.",
    },
  },
];
