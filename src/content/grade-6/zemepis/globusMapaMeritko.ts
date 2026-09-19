/**
 * Zeměpis 6. ročník — Glóbus a mapa, měřítko, druhy map.
 *
 * Výpočetní téma (select_one na všech úrovních), stavba podle
 * `fyzika/mereniDelky.ts`, helpery jen ze `zemepis/_shared.ts`.
 *
 *  • L1 — rozpoznání: glóbus × mapa (banka), druh mapy podle obsahu a podle
 *    měřítka (banka), co znamená zápis měřítka (jeden převod).
 *  • L2 — aplikace: skutečná vzdálenost z mapy a délka na mapě ze skutečnosti.
 *  • L3 — dva kroky: měřítko z délek (inverze), porovnání dvou map, volba mapy
 *    k účelu, čas cesty podle mapy.
 *
 * Distraktory jsou výsledky konkrétních chyb ze stejných čísel: převod o řád
 * vedle, škrtnuté jen dvě nuly (metry místo kilometrů), násobení místo dělení
 * a záměna „větší číslo za dvojtečkou = větší měřítko“.
 *
 * K úlohám nejsou obrázky map — všechno jde vyřešit ze slov.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { form } from "@/lib/czechGrammar";
import {
  buildChoiceTask as task,
  cis,
  losUlohy,
  meritko,
  pick,
  pickN,
  ruzneUlohy,
  shuffle,
  type Distractor,
} from "./_shared";

// ── Pomocné funkce ─────────────────────────────────────────────────────────

/** Nejvýš jedno desetinné místo (s tolerancí na plovoucí čárku). */
const jednoDesetinne = (x: number): boolean => Math.abs(Math.round(x * 10) - x * 10) < 1e-6;
const zaokr = (x: number): number => Math.round(x * 1000) / 1000;

/** Vzdálenost v metrech přirozenou jednotkou: pod 1 km v metrech, jinak v km. */
function prirozene(metru: number): string {
  return metru < 1000 ? `${cis(metru)} m` : `${cis(zaokr(metru / 1000))} km`;
}

/**
 * Počet hodin i s tvarem slova. U desetinného čísla se pojí 2. pád jednotného
 * čísla („0,5 hodiny“), který je u slova hodina shodný s tvarem pro 2–4.
 */
function hodin(h: number): string {
  const tvar = Number.isInteger(h) ? form(h, "HODINA") : form(2, "HODINA");
  return `${cis(h)} ${tvar}`;
}

/** Co představuje 1 cm na mapě v měřítku 1 : n (text). */
const naCm = (n: number): string => prirozene(n / 100);

/**
 * Kroky převodu jmenovatele: n cm → m (→ km).
 *
 * Km-krok se přidává podle jednotky, ve které se dál počítá, ne podle velikosti
 * čísla — jinak by se v dalším řádku objevila hodnota v kilometrech „odnikud“
 * (1 : 50 000 → „500 m“, a hned pak „3 km : 0,5 km“).
 */
function krokyPrevodu(n: number, vMetrech: boolean): string[] {
  const kroky = [
    `1 cm na mapě = ${cis(n)} cm ve skutečnosti.`,
    `${cis(n)} cm : 100 = ${cis(n / 100)} m`,
  ];
  if (!vMetrech) kroky.push(`${cis(n / 100)} m : 1 000 = ${cis(n / 100000)} km`);
  return kroky;
}

// ── L1 (a) — glóbus × mapa ─────────────────────────────────────────────────

interface Fakt {
  q: string;
  key: string;
  d: Distractor[];
  hints: [string, string];
  explanation: string;
}

const GLOBUS_MAPA: Fakt[] = [
  {
    q: "Který popis glóbu je správný?",
    key: "Zmenšený kulový model Země, který nezkresluje tvary ani plochy",
    d: [
      { value: "Zmenšený rovinný obraz Země, který zkresluje hlavně velká území", why: "To je popis mapy. Glóbus není rovinný, má tvar koule jako Země." },
      { value: "Zmenšený kulový model Země, který zkresluje tvary, protože je zakřivený", why: "Zakřivení glóbu naopak odpovídá tvaru Země, a proto glóbus tvary nezkresluje." },
      { value: "Kulový model Země ve velkém měřítku, na kterém najdeš každou ulici", why: "Glóbus je zmenšený tolik, že podrobnosti jako ulice na něm vidět nejsou." },
    ],
    hints: ["Představ si, jaký tvar má Země a jaký tvar má glóbus.", "Když má model stejný tvar jako skutečnost, musí se při zmenšení něco natahovat nebo trhat?"],
    explanation: "Glóbus má stejný kulový tvar jako Země, jen je zmenšený. Proto zachovává tvary i poměry ploch pevnin a oceánů.",
  },
  {
    q: "Co platí o mapě?",
    key: "Je zmenšený a zjednodušený obraz zemského povrchu v rovině",
    d: [
      { value: "Je zmenšený kulový model Země se všemi pevninami a oceány", why: "Kulový model Země je glóbus. Mapa je nakreslená na rovném listu." },
      { value: "Je přesný obraz zemského povrchu, který nic nezkresluje", why: "Každá mapa zakřivený povrch Země přenáší do roviny, a proto vždy něco zkresluje." },
      { value: "Je obraz zemského povrchu nakreslený ve skutečné velikosti", why: "Mapa je vždy zmenšená. Kolikrát, to udává měřítko." },
    ],
    hints: ["Mysli na to, na čem je mapa nakreslená a jak velká je ve srovnání s krajinou.", "Mapa se vejde do batohu a nezobrazuje každý kámen ani strom. Která dvě slova takový obraz krajiny vystihují — a na jaké ploše je nakreslený?"],
    explanation: "Mapa je zmenšená (má měřítko), zjednodušená (zobrazuje jen vybrané jevy) a rovinná, protože je na papíře nebo na obrazovce.",
  },
  {
    q: "Proč mapa světa zkresluje tvary a plochy pevnin?",
    key: "Zakřivený povrch Země nejde přenést do roviny beze změn",
    d: [
      { value: "Kartografové zvětšují státy, které mají víc obyvatel", why: "Počet obyvatel na velikost pevniny na mapě světa vliv nemá. Zkreslení vzniká převodem koule do roviny." },
      { value: "Pevniny ve skutečnosti mají přesně takové tvary jako na mapě", why: "Skutečné tvary pevnin ukazuje glóbus. Mapa je musí při převodu do roviny zdeformovat." },
      { value: "Mapa světa je podrobnější, a proto zvětšuje severní území", why: "Podrobnost se zkreslením nesouvisí. Severní území se zvětšují kvůli rozvinutí koule do roviny." },
    ],
    hints: ["Zkus v duchu rozložit slupku pomeranče na stůl.", "Co se stane se slupkou, když ji chceš úplně narovnat — zůstane celá a stejně velká?"],
    explanation: "Povrch koule nejde rozložit do roviny bez natažení nebo roztržení. Proto každá mapa světa něco zkresluje, nejvíc u pólů.",
  },
  {
    q: "Na mnoha mapách světa vypadá Grónsko větší než Austrálie. Jak je to ve skutečnosti?",
    key: "Grónsko je menší, na mapě ho zvětšuje zkreslení",
    d: [
      { value: "Grónsko je větší, mapa ukazuje skutečnou rozlohu", why: "Mapa světa zkresluje hlavně území blízko pólů. Na glóbu je vidět, že Austrálie je několikrát větší." },
      { value: "Grónsko je větší, protože je to samostatný světadíl", why: "Grónsko není světadíl, je to ostrov. Austrálie je světadíl a je mnohem větší." },
      { value: "Obě území jsou stejně velká, mapa je jen posunula", why: "Rozlohy se liší hodně: Austrálie je několikrát větší než Grónsko. Mapa u pólů plochy zvětšuje." },
    ],
    hints: ["Grónsko leží daleko na severu, Austrálie blíž rovníku.", "Kde je zkreslení na mapě světa největší? A co by ukázal glóbus, který nezkresluje?"],
    explanation: "Mapa světa nejvíc zkresluje území u pólů. Grónsko proto vypadá obrovské, ale ve skutečnosti je Austrálie několikrát větší — ukáže to glóbus.",
  },
  {
    q: "Kdy se víc hodí glóbus než mapa?",
    key: "Když chceš porovnat skutečné tvary a velikosti světadílů",
    d: [
      { value: "Když plánuješ pěší výlet po lesních cestách kolem obce", why: "Na výlet potřebuješ podrobnosti malého území. Ty ukáže mapa, glóbus je na to moc zmenšený." },
      { value: "Když hledáš konkrétní ulici a dům ve svém městě", why: "Ulice a domy ukáže jen plán města, tedy mapa ve velkém měřítku." },
      { value: "Když chceš mít s sebou v batohu obraz krajiny do terénu", why: "Glóbus se do terénu nosí špatně a podrobnosti nemá. Do batohu patří mapa." },
    ],
    hints: ["Glóbus nezkresluje, ale je hodně zmenšený.", "Vyber situaci, kde záleží na celé Zemi a věrných tvarech, ne na podrobnostech okolí."],
    explanation: "Glóbus věrně ukazuje tvary a velikosti pevnin, ale je hodně zmenšený. Hodí se tedy na celou Zemi, ne na podrobnosti.",
  },
  {
    q: "Proč si na túru bereš mapu, a ne glóbus?",
    key: "Glóbus nezobrazí podrobnosti okolí a špatně se nosí",
    d: [
      { value: "Glóbus zkresluje tvary, a proto je v terénu nepřesný", why: "Glóbus tvary nezkresluje. Nevhodný je proto, že je moc zmenšený a nese se špatně." },
      { value: "Glóbus zobrazuje jen státy, a ne řeky ani pohoří", why: "Na glóbu bývají i řeky a pohoří, jen bez podrobností. Důvodem je velké zmenšení." },
      { value: "Mapa je přesnější než glóbus ve všem, co zobrazuje", why: "Mapa je podrobnější, ale zkresluje. Věrnější tvary pevnin má glóbus." },
    ],
    hints: ["Mysli na to, jak velký kus krajiny projdeš za den a jak malý by byl na glóbu.", "Porovnej, co ti na túře pomůže víc: podrobnosti okolní krajiny, nebo celá Země najednou? A zkus si představit, jak se takový pomocník nese v batohu."],
    explanation: "Na túru potřebuješ podrobnosti malého území — cesty, potoky, chaty. Glóbus je tak zmenšený, že by celá túra zabrala méně než tečku.",
  },
  {
    q: "Který výrok o glóbu a mapě je pravdivý?",
    key: "Glóbus věrně zachycuje tvary, mapa zase ukáže víc podrobností",
    d: [
      { value: "Mapa je vždy přesnější než glóbus, protože je podrobnější", why: "Podrobnost není totéž co přesnost tvarů. Mapa tvary zkresluje, glóbus ne." },
      { value: "Glóbus zkresluje tvary pevnin, protože je zakřivený povrch", why: "Země je také kulatá, takže zakřivený glóbus tvary zachovává. Zkresluje mapa." },
      { value: "Mapa i glóbus zobrazují Zemi úplně bez jakéhokoli zkreslení", why: "Bez zkreslení je jen glóbus. Mapa převádí kouli do roviny, a to bez zkreslení nejde." },
    ],
    hints: ["Každý z obou pomocníků má jednu silnou stránku.", "Jeden má stejný tvar jako Země, druhý může být mnohem méně zmenšený."],
    explanation: "Glóbus má tvar Země, proto nezkresluje. Mapa může být zmenšená méně, a proto ukáže víc podrobností, ale tvary zkresluje.",
  },
  {
    q: "Na mapě kterého území je zkreslení nejmenší?",
    key: "Na mapě malého území, třeba jedné obce",
    d: [
      { value: "Na mapě celého světa i se všemi oceány", why: "Čím větší kus zakřivené Země mapa zobrazuje, tím víc zkresluje. Mapa světa zkresluje nejvíc." },
      { value: "Na mapě celého světadílu, třeba Asie", why: "Světadíl je velké území, jeho zakřivení se do roviny přenáší se znatelným zkreslením." },
      { value: "Na mapě obou polokoulí najednou", why: "Mapa polokoulí zobrazuje celou Zemi, takže zkresluje hodně." },
    ],
    hints: ["Zkreslení vzniká tím, že se zakřivený povrch narovnává.", "Malý kousek koule je skoro rovný. Na jaké mapě tedy narovnávání skoro nevadí?"],
    explanation: "Malý kus zemského povrchu je téměř rovný, takže mapa obce ho do roviny přenese skoro beze změn. Mapy velkých území zkreslují víc.",
  },
  {
    q: "Čím se liší glóbus od mapy?",
    key: "Glóbus je kulový model, mapa je obraz v rovině",
    d: [
      { value: "Glóbus je obraz v rovině, mapa je kulový model", why: "Tady jsou pojmy prohozené. Kulatý je glóbus, na rovném listu je mapa." },
      { value: "Glóbus je zvětšený, mapa je naopak zmenšená", why: "Obojí je zmenšené. Glóbus je model Země, ne její zvětšenina." },
      { value: "Glóbus zobrazuje jen pevninu, mapa i moře", why: "Glóbus zobrazuje pevniny i oceány. Rozdíl je v tvaru, ne v obsahu." },
    ],
    hints: ["Vezmi do ruky glóbus a atlas. Čím se liší na první pohled?", "Jeden se dá roztočit v ruce, druhý se dá položit na stůl a složit. Jaký tvar tedy každý z nich má?"],
    explanation: "Glóbus má tvar koule jako Země, mapa je plochá. Z toho plyne, že glóbus nezkresluje a mapa ano.",
  },
  {
    q: "Co znamená, že je mapa zjednodušená (zevšeobecněná)?",
    key: "Zobrazuje jen vybrané jevy a drobnosti vynechává",
    d: [
      { value: "Zobrazuje každý dům, strom i cestu v krajině", why: "To by nebylo zjednodušení. Mapa vybírá jen to důležité a drobnosti vynechá." },
      { value: "Zobrazuje celou Zemi jako kouli bez zkreslení", why: "Kulový model bez zkreslení je glóbus. Zjednodušení se týká výběru jevů." },
      { value: "Zobrazuje území ve skutečné velikosti a tvaru", why: "Mapa je vždy zmenšená. Zjednodušení znamená, že na ní není všechno." },
    ],
    hints: ["Na mapě celé republiky se všechno nevejde.", "Co musí kartograf udělat s maličkostmi, aby byla mapa čitelná?"],
    explanation: "Zmenšená mapa by byla nečitelná, kdyby obsahovala všechno. Kartograf proto vybírá důležité jevy a drobnosti vynechává nebo slučuje.",
  },
];

// ── L1 (b) — druhy map ─────────────────────────────────────────────────────

const OB = "obecně zeměpisná mapa";
const POL = "tematická mapa – politická";
const POD = "tematická mapa – podnebná";
const TUR = "tematická mapa – turistická";
const GEO = "tematická mapa – geologická";
const OBY = "tematická mapa – obyvatelstvo";
const HOS = "tematická mapa – hospodářská";
// Plán města patří mezi možnosti, aby u otázky s klíčem OB nezačínaly všechny
// tři špatné možnosti slovem „tematická" (klíč by šel poznat tvarem, check:options).
const PLAN = "plán města";

const DRUHY_OBSAH: Fakt[] = [
  {
    q: "Mapa ukazuje barvami nadmořskou výšku (nížiny zeleně, hory hnědě) a k tomu řeky, jezera a města. O jaký druh mapy jde?",
    key: OB,
    d: [
      { value: POL, why: "Politická mapa barví státy, ne výšky. Výšky, řeky a sídla dohromady ukazuje obecně zeměpisná mapa." },
      { value: TUR, why: "Turistická mapa zdůrazňuje značené cesty a chaty. Tady jde o celkový obraz krajiny." },
      { value: PLAN, why: "Plán města zachycuje jedno město s ulicemi a domy ve velmi podrobném měřítku. Tahle mapa ukazuje celou krajinu s horami a řekami." },
    ],
    hints: ["Zeptej se, jestli mapa ukazuje jedno vybrané téma, nebo celkový obraz krajiny.", "Výšky, vodstvo a sídla patří k základnímu obsahu, který mají mapy v atlasu na úvod kapitoly. Taková mapa se nesoustředí na jedno vybrané téma."],
    explanation: "Obecně zeměpisná mapa ukazuje celkový obraz krajiny: výškopis (barvy podle výšky), vodstvo a sídla. Tematická mapa se soustředí na jedno téma.",
  },
  {
    q: "Každý stát je na mapě jinou barvou a jsou na ní vyznačené hranice a hlavní města. O jaký druh mapy jde?",
    key: POL,
    d: [
      { value: OB, why: "Tahle mapa neukazuje výšky ani povrch, jen státy. Mapa států a hranic je tematická, i když ji vídáš často." },
      { value: GEO, why: "Geologická mapa barví horniny, ne státy." },
      { value: OBY, why: "Mapa obyvatelstva ukazuje, kde žije kolik lidí, ne hranice států." },
    ],
    hints: ["Všimni si, co znamenají barvy: jde o přírodu, nebo o státy?", "Mapa zaměřená na jedno téma je tematická. Jaké téma tu barvy a vyznačené hranice ukazují?"],
    explanation: "Státy, hranice a hlavní města jsou jedno konkrétní téma, proto jde o tematickou mapu — politickou. Obecně zeměpisná by ukazovala hlavně povrch a vodstvo.",
  },
  {
    q: "Mapa ukazuje průměrné teploty v lednu a v červenci a roční množství srážek. O jaký druh mapy jde?",
    key: POD,
    d: [
      { value: OB, why: "Teploty a srážky nejsou základní obraz krajiny. Mapa zaměřená na ně je tematická." },
      { value: HOS, why: "Hospodářská mapa ukazuje pole, doly a továrny, ne počasí dlouhodobě." },
      { value: OBY, why: "Mapa obyvatelstva ukazuje lidi, ne teploty a srážky." },
    ],
    hints: ["Teploty a srážky dohromady popisují dlouhodobý ráz počasí.", "Jak se takovému dlouhodobému rázu počasí říká? Podle toho je pojmenovaná i mapa."],
    explanation: "Průměrné teploty a srážky popisují podnebí. Mapa zaměřená na podnebí je tematická — podnebná.",
  },
  {
    q: "Mapa ukazuje barevně značené pěší cesty, chaty, rozhledny a studánky. O jaký druh mapy jde?",
    key: TUR,
    d: [
      { value: OB, why: "Značené cesty a chaty jsou vybrané téma pro určitou skupinu lidí. Taková mapa je tematická." },
      { value: POL, why: "Politická mapa ukazuje státy a hranice, ne cesty a chaty." },
      { value: HOS, why: "Hospodářská mapa ukazuje výrobu a těžbu, ne cíle výletů." },
    ],
    hints: ["Zamysli se, komu taková mapa nejvíc poslouží.", "Kdo potřebuje vědět, kudy vede značená cesta a kde je rozhledna?"],
    explanation: "Značené cesty, chaty a rozhledny slouží lidem na výletě. Je to tematická mapa — turistická.",
  },
  {
    q: "Mapa ukazuje, z jakých hornin je území složené, třeba kde je žula, vápenec nebo pískovec. O jaký druh mapy jde?",
    key: GEO,
    d: [
      { value: OB, why: "Horniny pod povrchem nejsou základní obraz krajiny. Mapa zaměřená na ně je tematická." },
      { value: HOS, why: "Hospodářská mapa ukazuje doly a továrny, ne druh hornin v celém území." },
      { value: POD, why: "Podnebná mapa ukazuje teploty a srážky, ne horniny." },
    ],
    hints: ["Žula, vápenec a pískovec jsou horniny.", "Věda o stavbě a horninách Země se jmenuje podobně jako tahle mapa."],
    explanation: "Mapa hornin je tematická — geologická (geologie zkoumá stavbu Země a horniny).",
  },
  {
    q: "Mapa ukazuje, kolik lidí žije na jednom čtverečním kilometru v různých částech státu. O jaký druh mapy jde?",
    key: OBY,
    d: [
      { value: POL, why: "Politická mapa ukazuje hranice a města, ale ne to, kolik lidí kde žije." },
      { value: OB, why: "Počet lidí není základní obraz krajiny. Mapa zaměřená na něj je tematická." },
      { value: HOS, why: "Hospodářská mapa ukazuje výrobu a těžbu, ne hustotu lidí." },
    ],
    hints: ["Mapa se soustředí na jedno téma: na lidi.", "Kolik lidí kde žije, popisuje hustota zalidnění. K jaké skupině témat patří?"],
    explanation: "Hustota zalidnění je téma obyvatelstva, proto jde o tematickou mapu obyvatelstva.",
  },
  {
    q: "Mapa ukazuje pole, doly, elektrárny a továrny. O jaký druh mapy jde?",
    key: HOS,
    d: [
      { value: GEO, why: "Doly souvisejí s horninami, ale mapa ukazuje hlavně lidskou činnost, tedy hospodářství." },
      { value: OB, why: "Továrny a pole jsou vybrané téma — výroba. Taková mapa je tematická." },
      { value: TUR, why: "Turistická mapa ukazuje cesty a cíle výletů, ne továrny a elektrárny." },
    ],
    hints: ["Pole, doly i továrny mají společné to, že v nich lidé pracují a něco vyrábějí.", "Jak se souhrnně říká zemědělství, těžbě, energetice a průmyslu dohromady? Podle toho je pojmenovaná i mapa, která je zobrazuje."],
    explanation: "Zemědělství, těžba, energetika a průmysl tvoří hospodářství. Mapa je tematická — hospodářská.",
  },
  {
    q: "Mapa celého světadílu ukazuje nížiny, vysočiny, pohoří, řeky a jezera. O jaký druh mapy jde?",
    key: OB,
    d: [
      { value: GEO, why: "Pohoří a nížiny jsou tvary povrchu, ne druhy hornin. Horniny ukazuje geologická mapa." },
      { value: POL, why: "Politická mapa ukazuje státy a hranice, ne pohoří a řeky." },
      { value: POD, why: "Podnebná mapa ukazuje teploty a srážky, ne tvary povrchu." },
    ],
    hints: ["Nížiny, vysočiny a pohoří jsou tvary povrchu, řeky a jezera vodstvo.", "Mapa, která ukazuje povrch a vodstvo dohromady, nemá jedno vybrané téma. Jak se jmenuje?"],
    explanation: "Povrch a vodstvo jsou základní obraz krajiny, který ukazuje obecně zeměpisná mapa.",
  },
  {
    q: "Mapa ukazuje, kudy vedou hranice krajů a kde leží krajská města. O jaký druh mapy jde?",
    key: POL,
    d: [
      { value: OB, why: "Hranice krajů jsou dané lidmi, ne přírodou. Mapa zaměřená na ně je tematická." },
      { value: OBY, why: "Mapa obyvatelstva ukazuje, kolik lidí kde žije, ne hranice krajů." },
      { value: TUR, why: "Turistická mapa ukazuje cesty a chaty, ne správní hranice." },
    ],
    hints: ["Hranice krajů určili lidé, v krajině je nevidíš.", "Mapa o hranicích a správních celcích patří ke stejné skupině jako mapa států."],
    explanation: "Hranice a správní celky jsou téma politické mapy. Je to tedy tematická mapa — politická.",
  },
  {
    q: "Mapa ukazuje podnebné pásy Země od rovníku k pólům. O jaký druh mapy jde?",
    key: POD,
    d: [
      { value: OB, why: "Podnebné pásy nejsou základní obraz krajiny, jsou to vybrané téma." },
      { value: GEO, why: "Geologická mapa ukazuje horniny, ne podnebí." },
      { value: POL, why: "Podnebné pásy nesouvisejí s hranicemi států." },
    ],
    hints: ["Pásy od rovníku k pólům se liší teplotou a srážkami.", "Tematická mapa se jmenuje podle toho, co ukazuje. Co se mění od rovníku k pólům?"],
    explanation: "Podnebné pásy jsou téma podnebí, proto jde o tematickou mapu — podnebnou.",
  },
];

const VELKE = "velké měřítko – podrobná mapa menšího území";
const MALE = "malé měřítko – přehledná mapa velkého území";
const STREDNI = "střední měřítko – mapa kraje nebo menšího státu";
const VELKE_PREHLED = "velké měřítko – přehledná mapa velkého území";
const MALE_PODROBNE = "malé měřítko – podrobná mapa menšího území";

type Trida = "velké" | "střední" | "malé";
const DRUH_MERITKA: { n: number; trida: Trida }[] = [
  { n: 10000, trida: "velké" },
  { n: 25000, trida: "velké" },
  { n: 50000, trida: "velké" },
  { n: 500000, trida: "střední" },
  { n: 5000000, trida: "malé" },
  { n: 10000000, trida: "malé" },
  { n: 50000000, trida: "malé" },
];

function genDruhMeritka(): PracticeTask | null {
  const { n, trida } = pick(DRUH_MERITKA);
  const s = meritko(n);
  const per = naCm(n);
  const zamena = `Větší číslo za dvojtečkou neznamená větší měřítko. Mapa ${s} je zmenšená ${cis(n)}krát`;
  let key: string;
  let d: Distractor[];
  if (trida === "velké") {
    key = VELKE;
    d = [
      { value: MALE_PODROBNE, why: `Podrobná mapa malého území má velké měřítko, ne malé. U mapy ${s} je číslo za dvojtečkou malé, takže měřítko je velké.` },
      { value: MALE, why: `Mapa ${s} je zmenšená jen málo: 1 cm na ní odpovídá ${per}. Přehled velkého území to není.` },
      { value: STREDNI, why: `Střední měřítko začíná až nad 1 : 200 000. Mapa ${s} je zmenšená mnohem méně.` },
    ];
  } else if (trida === "malé") {
    key = MALE;
    d = [
      { value: VELKE_PREHLED, why: `${zamena}, takže má malé měřítko.` },
      { value: VELKE, why: `${zamena}: 1 cm na ní odpovídá ${per}. Podrobnosti na ní nejsou.` },
      { value: STREDNI, why: `Střední měřítko končí u 1 : 1 000 000. Mapa ${s} je zmenšená ještě mnohem víc.` },
    ];
  } else {
    key = STREDNI;
    d = [
      { value: VELKE, why: `Velké měřítko končí u 1 : 200 000. Mapa ${s} je zmenšená víc, podrobný plán to není.` },
      { value: MALE, why: `Malé měřítko začíná až nad 1 : 1 000 000. Mapa ${s} je zmenšená méně.` },
      { value: VELKE_PREHLED, why: `Přehledná mapa velkého území má malé měřítko, ne velké. A mapa ${s} není ani jedno z toho.` },
    ];
  }
  return task(
    `Do jaké skupiny podle měřítka patří mapa v měřítku ${s}?`,
    key,
    d,
    {
      hints: [
        `Zjisti, jak velké skutečné vzdálenosti odpovídá 1 cm na mapě ${s}.`,
        "Čím méně je mapa zmenšená, tím je její měřítko větší. Velké měřítko sahá do 1 : 200 000, malé začíná nad 1 : 1 000 000.",
      ],
      explanation: `Na mapě ${s} odpovídá 1 cm ${per} ve skutečnosti. Měřítko je ${trida}: velké měřítko sahá do 1 : 200 000, střední do 1 : 1 000 000 a malé je nad touto hranicí.`,
    },
  );
}

// ── L1 (c) — co znamená zápis měřítka ─────────────────────────────────────

const JMENOVATELE_L1 = [10000, 25000, 50000, 100000, 200000, 500000, 1000000, 5000000];

function genVyznamMeritka(): PracticeTask | null {
  const n = pick(JMENOVATELE_L1);
  const s = meritko(n);
  const metru = n / 100;
  const zapis = (vzd: string) => `1 cm na mapě = ${vzd} ve skutečnosti`;
  const q = pick([
    `Co znamená měřítko mapy ${s}?`,
    `Na okraji mapy je napsáno měřítko ${s}. Co tento zápis říká?`,
  ]);
  const prevod = `${cis(n)} cm = ${cis(metru)} m${metru >= 1000 ? ` = ${cis(metru / 1000)} km` : ""}`;
  return task(q, zapis(prirozene(metru)), [
    { value: zapis(`${cis(metru)} km`), why: `Škrtnutím dvou nul vzniknou metry, ne kilometry: ${cis(n)} cm = ${cis(metru)} m.` },
    { value: zapis(prirozene(metru * 10)), why: `Výsledek je o řád větší, než má být. Platí 100 cm = 1 m a 1 000 m = 1 km.` },
    { value: zapis(prirozene(metru / 10)), why: `Výsledek je o řád menší, než má být. Platí 100 cm = 1 m a 1 000 m = 1 km.` },
    { value: zapis(`${cis(n)} m`), why: `Číslo za dvojtečkou udává centimetry, ne metry. Je potřeba ho převést.` },
  ], {
    hints: [
      "Číslo za dvojtečkou udává, kolik centimetrů ve skutečnosti odpovídá 1 cm na mapě.",
      `Převeď ${cis(n)} cm na větší jednotku: 100 cm je 1 m, takže dělením stem vyjdou metry. Když je metrů aspoň 1 000, převeď je ještě dělením tisícem na kilometry.`,
    ],
    explanation: `Měřítko ${s} znamená, že 1 cm na mapě odpovídá ${cis(n)} cm ve skutečnosti. Po převodu: ${prevod}.`,
  });
}

function genFakt(f: Fakt): PracticeTask | null {
  return task(f.q, f.key, f.d, { hints: [...f.hints], explanation: f.explanation });
}

function genL1(sablona: number): PracticeTask | null {
  if (sablona === 0) return genFakt(pick(GLOBUS_MAPA));
  if (sablona === 1) return Math.random() < 0.55 ? genFakt(pick(DRUHY_OBSAH)) : genDruhMeritka();
  return genVyznamMeritka();
}

// ── L2 — výpočet vzdálenosti ──────────────────────────────────────────────

interface Kontext {
  jmeno: string;
  /** Povolené jmenovatele (aby vzdálenost dávala smysl). */
  n: number[];
  mapaNaSkut: (s: string, a: string) => string;
  skutNaMapu: (s: string, d: string) => string;
}

const KONTEXTY: Kontext[] = [
  {
    jmeno: "obce",
    n: [25000, 50000, 100000, 200000, 500000, 1000000],
    mapaNaSkut: (s, a) => `Na mapě v měřítku ${s} jsou dvě obce od sebe vzdálené ${a}. Jaká je jejich skutečná vzdálenost?`,
    skutNaMapu: (s, d) => `Dvě obce jsou od sebe ve skutečnosti vzdálené ${d}. Jak daleko od sebe budou na mapě v měřítku ${s}?`,
  },
  {
    jmeno: "trasa",
    n: [10000, 25000, 50000, 100000, 200000],
    mapaNaSkut: (s, a) => `Turistická trasa měří na mapě v měřítku ${s} celkem ${a}. Jak dlouhá je ve skutečnosti?`,
    skutNaMapu: (s, d) => `Turistická trasa je ve skutečnosti dlouhá ${d}. Kolik centimetrů bude měřit na mapě v měřítku ${s}?`,
  },
  {
    jmeno: "řeka",
    n: [10000, 25000, 50000, 100000],
    mapaNaSkut: (s, a) => `Úsek řeky mezi dvěma mosty je na mapě v měřítku ${s} dlouhý ${a}. Jak dlouhý je ve skutečnosti?`,
    skutNaMapu: (s, d) => `Úsek řeky mezi dvěma mosty měří ve skutečnosti ${d}. Jak dlouhý bude na mapě v měřítku ${s}?`,
  },
  {
    jmeno: "cyklostezka",
    n: [10000, 25000, 50000, 100000, 200000],
    mapaNaSkut: (s, a) => `Cyklostezka podél řeky je na mapě v měřítku ${s} dlouhá ${a}. Kolik měří ve skutečnosti?`,
    skutNaMapu: (s, d) => `Cyklostezka podél řeky měří ve skutečnosti ${d}. Jak dlouhou čarou ji zakreslíš do mapy v měřítku ${s}?`,
  },
  {
    jmeno: "vrcholy",
    n: [10000, 50000, 100000, 200000, 500000, 1000000],
    mapaNaSkut: (s, a) => `Dva vrcholy hor jsou na mapě v měřítku ${s} od sebe vzdálené ${a}. Jaká je jejich skutečná vzdálenost vzdušnou čarou?`,
    skutNaMapu: (s, d) => `Dva vrcholy hor dělí vzdušnou čarou ${d}. Jak daleko od sebe budou na mapě v měřítku ${s}?`,
  },
];

const DELKY_MAPA = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10, 11, 12];

function genL2(smer: number): PracticeTask | null {
  const k = pick(KONTEXTY);
  const n = pick(k.n);
  const c = pick(DELKY_MAPA); // délka na mapě v cm
  const s = meritko(n);
  // Jednotku určuje výsledek, ne měřítko: vzdálenost pod 1 km se počítá i
  // odpovídá v metrech (500 m, ne 0,5 km — a nikdy ne 0,05 km).
  const skutCm = c * n;
  const vMetrech = n === 10000 || skutCm < 100000;
  const jedn = vMetrech ? "m" : "km";
  const perVal = vMetrech ? n / 100 : n / 100000; // 1 cm = perVal jedn
  const skut = zaokr(c * perVal); // skutečná vzdálenost v jedn
  if (!jednoDesetinne(skut)) return null;
  const perTxt = `${cis(perVal)} ${jedn}`;
  const kroky = krokyPrevodu(n, vMetrech);
  /** Tištěná možnost smí mít nejvýš jedno desetinné místo (hranice tématu). */
  const jedno1 = (x: number) => jednoDesetinne(zaokr(x));

  if (smer === 0) {
    // mapa → skutečnost
    const key = `${cis(skut)} ${jedn}`;
    const d: Distractor[] = vMetrech
      ? [
          { value: `${cis(skut * 100)} m`, why: `Součin ${cis(c)} · ${cis(n)} vyjde v centimetrech, ne v metrech. Na metry je potřeba ho ještě vydělit 100.` },
          { value: `${cis(skut * 10)} m`, why: "Výsledek je o řád vedle: 1 m = 100 cm, takže centimetry se na metry dělí 100, ne 10." },
          ...(jedno1(skut / 10)
            ? [{ value: `${cis(zaokr(skut / 10))} m`, why: "Výsledek je o řád vedle: dělilo se 1 000, ale 1 m = 100 cm, takže se dělí jen 100." }]
            : [{ value: `${cis(skut * 1000)} m`, why: "Výsledek je o dva řády vedle: dělilo se jen 10, ale 1 m = 100 cm." }]),
        ]
      : [
          { value: `${cis(skut * 1000)} km`, why: `Po škrtnutí dvou nul jsou to metry, ne kilometry: ${cis(n)} cm = ${cis(n / 100)} m. Metry je potřeba ještě vydělit 1 000.` },
          { value: `${cis(skut * 10)} km`, why: "Výsledek je o řád vedle. Na kilometry se centimetry převádějí dělením 100 000 (100 cm = 1 m, 1 000 m = 1 km), ne 10 000." },
          ...(jedno1(skut / 10)
            ? [{ value: `${cis(zaokr(skut / 10))} km`, why: "Výsledek je o řád vedle na druhou stranu: 1 km = 100 000 cm, takže se dělí 100 000, ne 1 000 000." }]
            : [{ value: `${cis(skut * 100)} km`, why: "Výsledek je o dva řády vedle — převod jednotek se nepovedl. 1 km = 100 000 cm." }]),
        ];
    return task(k.mapaNaSkut(s, `${cis(c)} cm`), key, d, {
      hints: [
        `Nejdřív zjisti, jakou skutečnou vzdálenost představuje 1 cm na mapě v měřítku ${s}.`,
        `Číslo za dvojtečkou jsou centimetry: dělením 100 dostaneš metry, dalším dělením 1 000 kilometry. Touto vzdáleností pak vynásob ${cis(c)} cm z mapy.`,
      ],
      solutionSteps: [...kroky, `${cis(c)} · ${perTxt} = ${key}`],
      explanation: `V měřítku ${s} odpovídá 1 cm na mapě ${perTxt} ve skutečnosti. ${cis(c)} cm na mapě je proto ${cis(c)} · ${perTxt} = ${key}.`,
    });
  }

  // skutečnost → mapa
  const key = `${cis(c)} cm`;
  const skutTxt = `${cis(skut)} ${jedn}`;
  const d: Distractor[] = [
    ...(jedno1(skut * perVal)
      ? [{ value: `${cis(zaokr(skut * perVal))} cm`, why: `Tady se násobilo, ale na mapě se skutečnost zmenšuje. ${skutTxt} je potřeba vydělit tím, co představuje 1 cm (${perTxt}).` }]
      : []),
    { value: `${cis(c * 10)} cm`, why: "Výsledek je o řád vedle. Zkontroluj převod: 1 km = 100 000 cm a 1 m = 100 cm." },
    ...(jedno1(c / 10)
      ? [{ value: `${cis(zaokr(c / 10))} cm`, why: "Výsledek je o řád vedle na druhou stranu. Zkontroluj převod: 1 km = 100 000 cm a 1 m = 100 cm." }]
      : []),
    { value: `${cis(c * 100)} cm`, why: "Výsledek je o dva řády vedle — převod jednotek se nepovedl. 1 km = 100 000 cm." },
  ];
  return task(k.skutNaMapu(s, skutTxt), key, d, {
    hints: [
      `Zjisti, jaké skutečné vzdálenosti odpovídá 1 cm na mapě v měřítku ${s}.`,
      `Pak zjisti, kolikrát se tato vzdálenost vejde do ${skutTxt}. Tolik centimetrů bude úsek na mapě měřit — dělíš, protože mapa skutečnost zmenšuje.`,
    ],
    solutionSteps: [...kroky, `${skutTxt} : ${perTxt} = ${cis(c)}, na mapě je to tedy ${key}`],
    explanation: `V měřítku ${s} představuje každý centimetr na mapě ${perTxt}. ${skutTxt} se do mapy vejde jako ${cis(skut)} : ${cis(perVal)} = ${key}.`,
  });
}

// ── L2 (c) — tentýž úsek na dvou mapách ────────────────────────────────────

/** Dvojice měřítek s celočíselným poměrem: [podrobnější, zmenšenější]. */
const PARY_L2: [number, number][] = [
  [25000, 50000], [25000, 100000], [50000, 100000], [50000, 200000],
  [100000, 200000], [100000, 500000], [200000, 1000000], [250000, 500000],
];

const USEKY_L2 = ["silnice", "železniční tratě", "cyklostezky", "řeky", "turistické trasy"];

/**
 * Poměr dvou měřítek bez převodu na kilometry — jiná úvaha než „přepočti cm na
 * km“, kterou dělají obě zbylé L2 šablony.
 */
function genDveMapy(): PracticeTask | null {
  const [podrobna, prehledna] = pick(PARY_L2);
  const k = prehledna / podrobna; // kolikrát je úsek delší na podrobnější mapě
  const zPodrobne = Math.random() < 0.5; // zadaná délka je z podrobnější mapy
  const nDano = zPodrobne ? podrobna : prehledna;
  const nHledano = zPodrobne ? prehledna : podrobna;
  const cDano = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);
  const cHledano = zaokr(zPodrobne ? cDano / k : cDano * k);
  if (cHledano < 1 || cHledano > 40 || !jednoDesetinne(cHledano)) return null;
  const opacne = zaokr(zPodrobne ? cDano * k : cDano / k); // obrácená operace
  if (!jednoDesetinne(opacne)) return null;
  const usek = pick(USEKY_L2);
  const cm = (x: number) => `${cis(x)} cm`;
  return task(
    `Tentýž úsek ${usek} je zakreslený na dvou mapách. Na mapě v měřítku ${meritko(nDano)} měří ${cm(cDano)}. Kolik centimetrů bude měřit na mapě v měřítku ${meritko(nHledano)}?`,
    cm(cHledano),
    [
      {
        value: cm(opacne),
        why: zPodrobne
          ? `Tady se násobilo. Mapa ${meritko(nHledano)} je zmenšená víc, takže tentýž úsek je na ní kratší — délku je potřeba vydělit.`
          : `Tady se dělilo. Mapa ${meritko(nHledano)} je zmenšená méně, takže tentýž úsek je na ní delší — délku je potřeba vynásobit.`,
      },
      { value: cm(cDano), why: "Měřítko se tu nepoužilo vůbec. Na mapě zmenšené jinak má tentýž úsek jinou délku, i když ve skutečnosti se nic nezměnilo." },
      { value: cm(zaokr(cHledano * 10)), why: `Výsledek je o řád vedle. Poměr obou map je ${cis(prehledna)} : ${cis(podrobna)} = ${cis(k)}, ne ${cis(k * 10)}.` },
    ],
    {
      hints: [
        `Zjisti, kolikrát je mapa ${meritko(prehledna)} zmenšená víc než mapa ${meritko(podrobna)} — vyděl větší číslo za dvojtečkou tím menším.`,
        `Na mapě zmenšené méně (menší číslo za dvojtečkou) je tentýž úsek tímto poměrem delší, na mapě zmenšené víc je tímto poměrem kratší. Podle toho zadanou délku vynásob, nebo vyděl.`,
      ],
      solutionSteps: [
        `Poměr měřítek: ${cis(prehledna)} : ${cis(podrobna)} = ${cis(k)}`,
        `Mapa ${meritko(podrobna)} je zmenšená ${cis(k)}krát méně, úsek je na ní proto ${cis(k)}krát delší.`,
        zPodrobne ? `${cm(cDano)} : ${cis(k)} = ${cm(cHledano)}` : `${cm(cDano)} · ${cis(k)} = ${cm(cHledano)}`,
      ],
      explanation: `Skutečná délka úseku se nemění, mění se jen zmenšení. Mapa ${meritko(prehledna)} je zmenšená ${cis(k)}krát víc než mapa ${meritko(podrobna)}, takže úsek dlouhý ${cm(cDano)} na mapě ${meritko(nDano)} měří na mapě ${meritko(nHledano)} ${cm(cHledano)}.`,
    },
  );
}

// ── L3 (a) — inverze: měřítko z délek ──────────────────────────────────────

const USEKY = ["Silnice", "Naučná stezka", "Železniční trať", "Běžecká lyžařská trať", "Hráz rybníka"];
const JMENOVATELE_INV = [10000, 20000, 25000, 50000, 100000, 200000, 250000, 500000];

function genInverze(): PracticeTask | null {
  const n = pick(JMENOVATELE_INV);
  const c = pick(DELKY_MAPA);
  const usek = pick(USEKY);
  const skutCm = c * n;
  if (usek === "Hráz rybníka" && skutCm > 200000) return null; // hráz nemá kilometry
  let skutTxt: string;
  if (skutCm < 100000) {
    if (!Number.isInteger(skutCm / 100)) return null;
    skutTxt = `${cis(skutCm / 100)} m`;
  } else {
    const km = skutCm / 100000;
    if (!jednoDesetinne(km)) return null;
    skutTxt = `${cis(zaokr(km))} km`;
  }
  // Distraktor „násobil místo dělil“ počítá ze stejné jednotky jako klíč (cm),
  // aby si ho žák mohl podle zpětné vazby doslova ověřit.
  const nasobeno = skutCm * c;
  const d: Distractor[] = [];
  if (Number.isInteger(nasobeno)) {
    d.push({ value: meritko(nasobeno), why: `Skutečná délka a délka na mapě se tu v centimetrech vynásobily: ${cis(skutCm)} · ${cis(c)} = ${cis(nasobeno)}. Měřítko ale udává, kolikrát je skutečnost větší než mapa, a to zjistíš dělením.` });
  }
  d.push(
    { value: meritko(n * 10), why: "Výsledek je o řád vedle. Převeď skutečnou délku přesně na centimetry: 1 km = 100 000 cm, 1 m = 100 cm." },
    { value: meritko(n / 10), why: "Výsledek je o řád vedle na druhou stranu. Převeď skutečnou délku přesně na centimetry: 1 km = 100 000 cm, 1 m = 100 cm." },
    { value: meritko(n / 100), why: "Skutečná délka je převedená jen na metry, ne na centimetry. Obě délky musí být ve stejné jednotce — v centimetrech." },
  );
  return task(
    `${usek} dlouhá ${skutTxt} měří na mapě ${cis(c)} cm. V jakém měřítku je mapa nakreslená?`,
    meritko(n),
    d,
    {
      hints: [
        `Převeď ${skutTxt} na centimetry, aby obě délky byly ve stejné jednotce.`,
        `Pak zjisti, kolikrát je skutečná délka větší než ${cis(c)} cm na mapě. To číslo se píše za dvojtečku.`,
      ],
      solutionSteps: [
        `${skutTxt} = ${cis(skutCm)} cm`,
        `${cis(skutCm)} cm : ${cis(c)} cm = ${cis(n)}`,
        `1 cm na mapě odpovídá ${cis(n)} cm ve skutečnosti.`,
      ],
      explanation: `Měřítko 1 : n říká, kolikrát je skutečnost větší než mapa. ${skutTxt} je ${cis(skutCm)} cm a to je ${cis(n)}krát víc než ${cis(c)} cm.`,
    },
  );
}

// ── L3 (b) — porovnání dvou map ────────────────────────────────────────────

const DVOJICE: [number, number][] = [
  [25000, 50000], [25000, 100000], [50000, 100000], [50000, 200000],
  [100000, 200000], [100000, 500000], [200000, 500000],
];

function genRozdil(): PracticeTask | null {
  const [n1, n2] = pick(DVOJICE);
  const D = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30]);
  const cA = zaokr((D * 100000) / n1);
  const cB = zaokr((D * 100000) / n2);
  const rozdil = zaokr(cA - cB);
  if (cA > 50 || cB < 1 || ![cA, cB, rozdil].every(jednoDesetinne)) return null;
  const cmTxt = (x: number) => `${cis(x)} cm`;
  const skutCm = D * 100000;
  return task(
    `Tatáž trasa dlouhá ${cis(D)} km je zakreslená na mapě A v měřítku ${meritko(n1)} a na mapě B v měřítku ${meritko(n2)}. O kolik centimetrů je na mapě A delší než na mapě B?`,
    cmTxt(rozdil),
    [
      { value: cmTxt(zaokr(cA + cB)), why: "Délky na obou mapách se tu sečetly. Otázka se ptá, o kolik je jedna delší — to je rozdíl." },
      { value: cmTxt(cA), why: "To je jen délka trasy na mapě A. Ještě od ní odečti délku na mapě B." },
      { value: cmTxt(cB), why: "To je délka trasy na mapě B, ne rozdíl obou délek." },
      { value: cmTxt(zaokr(rozdil * 10)), why: "Výsledek je o řád vedle. Zkontroluj převod: 1 km = 100 000 cm." },
    ],
    {
      hints: [
        `Převeď ${cis(D)} km na centimetry a spočítej, jak dlouhá je trasa na každé mapě zvlášť.`,
        `Na mapě A děl číslem ${cis(n1)}, na mapě B číslem ${cis(n2)}. Nakonec obě délky v centimetrech od sebe odečti — ptáme se, o kolik je jedna delší, ne jak jsou dlouhé dohromady.`,
      ],
      solutionSteps: [
        `${cis(D)} km = ${cis(skutCm)} cm`,
        `Mapa A: ${cis(skutCm)} : ${cis(n1)} = ${cmTxt(cA)}`,
        `Mapa B: ${cis(skutCm)} : ${cis(n2)} = ${cmTxt(cB)}`,
        `Rozdíl: ${cis(cA)} − ${cis(cB)} = ${cmTxt(rozdil)}`,
      ],
      explanation: `Mapa A má větší měřítko (menší číslo za dvojtečkou), proto je na ní trasa delší: ${cmTxt(cA)} proti ${cmTxt(cB)} na mapě B. Rozdíl je ${cmTxt(rozdil)}.`,
    },
  );
}

/** Skupiny se stejným počtem číslic — klíč se nepozná podle délky zápisu. */
const SKUPINY_MERITEK = [
  [10000, 20000, 25000, 50000, 75000],
  [100000, 200000, 250000, 500000, 750000],
  [1000000, 2000000, 2500000, 5000000, 7500000],
];

function genPodrobnost(): PracticeTask | null {
  const vyber = [...pickN(pick(SKUPINY_MERITEK), 4)].sort((a, b) => a - b);
  const min = vyber[0];
  const max = vyber[3];
  const prostredni = pick(vyber.slice(1, 3));
  const podrobnost = Math.random() < 0.5;
  const uvod = "Čtyři mapy jsou vytištěné na stejně velkém listu a liší se jen měřítkem.";
  const hints = [
    `U každé mapy zjisti, kolik ve skutečnosti představuje 1 cm — třeba u mapy ${meritko(prostredni)} je to ${naCm(prostredni)}.`,
    "Čím víc je mapa zmenšená, tím větší kus krajiny se na stejně velký list vejde, ale tím méně podrobností na ní uvidíš. Porovnej proto čísla za dvojtečkou a vyber podle toho, na co se otázka ptá.",
  ];
  if (podrobnost) {
    const d: Distractor[] = vyber.slice(1).map((n) => ({
      value: meritko(n),
      why: n === max
        ? "Tohle je z nabídky nejmenší měřítko. Větší číslo za dvojtečkou znamená, že je mapa zmenšená víc, a ukáže proto nejméně podrobností."
        : `Mapa ${meritko(n)} je zmenšená méně než ${meritko(max)}, ale v nabídce je mapa s ještě menším číslem za dvojtečkou, tedy zmenšená nejméně.`,
    }));
    return task(`${uvod} Na které z nich uvidíš nejvíc podrobností?`, meritko(min), shuffle(d), {
      hints,
      explanation: `Čím menší je číslo za dvojtečkou, tím méně je mapa zmenšená a tím větší má měřítko. Na mapě ${meritko(min)} odpovídá 1 cm jen ${naCm(min)}, proto ukáže nejvíc podrobností.`,
    });
  }
  const d: Distractor[] = vyber.slice(0, 3).map((n) => ({
    value: meritko(n),
    why: n === min
      ? "Tahle mapa má z nabídky největší měřítko — je nejpodrobnější, a proto se na list vejde nejmenší území. Malé číslo za dvojtečkou neznamená malé měřítko."
      : `Mapa ${meritko(n)} zobrazí větší území než ${meritko(min)}, ale v nabídce je mapa zmenšená ještě víc — s větším číslem za dvojtečkou.`,
  }));
  return task(`${uvod} Která z nich zobrazí největší kus zemského povrchu?`, meritko(max), shuffle(d), {
    hints,
    explanation: `Čím větší je číslo za dvojtečkou, tím víc je mapa zmenšená. Na mapě ${meritko(max)} odpovídá 1 cm hned ${naCm(max)}, proto se na stejný list vejde největší území — za cenu menší podrobnosti.`,
  });
}

// ── L3 (c) — volba mapy k účelu ────────────────────────────────────────────

interface Ucel {
  q: string;
  n: number;
  d: { n: number; why: string }[];
  hints: [string, string];
  explanation: string;
}

const PRILIS_PODROBNA = "Taková mapa je zmenšená jen málo, takže by celé území zabralo obrovský list nebo stovky listů.";
const ZAMENA = "Větší číslo za dvojtečkou neznamená podrobnější mapu — naopak, mapa je zmenšená víc a podrobnosti na ní chybí.";

const UCELY: Ucel[] = [
  {
    q: "Chystáš celodenní pěší výlet po lesních cestách a potřebuješ vidět každou odbočku a potok. Jakou mapu si vezmeš?",
    n: 50000,
    d: [
      { n: 10000000, why: "To je mapa celého světadílu. Na ní by byl celý výlet menší než tečka." },
      { n: 5000000, why: ZAMENA },
      { n: 1000000, why: "Na mapě 1 : 1 000 000 odpovídá 1 cm 10 km — lesní cesty a potoky na ní nenajdeš." },
    ],
    hints: ["Za den ujdeš asi 15 až 25 km a potřebuješ drobné podrobnosti.", "Vyber mapu, na které 1 cm odpovídá jen několika stům metrů — jen na takové uvidíš každou odbočku i potok."],
    explanation: "Na pěší výlet potřebuješ podrobnou mapu malého území, tedy velké měřítko. Na mapě 1 : 50 000 odpovídá 1 cm 500 m, takže je vidět každá cesta.",
  },
  {
    q: "Letíš letadlem přes Evropu a chceš sledovat, nad kterými státy právě jsi. Jaká mapa se hodí?",
    n: 10000000,
    d: [
      { n: 5000, why: `Plán města je velmi podrobný. ${PRILIS_PODROBNA}` },
      { n: 50000, why: `Turistická mapa je na celou Evropu moc podrobná. ${PRILIS_PODROBNA}` },
      { n: 200000, why: `Automapa kraje je na celou Evropu pořád moc podrobná. ${PRILIS_PODROBNA}` },
    ],
    hints: ["Letadlo urazí za hodinu stovky kilometrů a ty potřebuješ vidět celé státy.", "Hledáš přehled velkého území, ne podrobnosti — tedy mapu hodně zmenšenou, na které 1 cm odpovídá desítkám až stovkám kilometrů."],
    explanation: "Na přehled celé Evropy potřebuješ malé měřítko. Na mapě 1 : 10 000 000 odpovídá 1 cm 100 km, takže se celý světadíl vejde na jeden list.",
  },
  {
    q: "Hledáš v neznámé čtvrti konkrétní ulici a číslo domu. Jaká mapa ti pomůže?",
    n: 5000,
    d: [
      { n: 5000000, why: ZAMENA },
      { n: 500000, why: "Na mapě 1 : 500 000 odpovídá 1 cm 5 km. Ulice a domy na ní nejsou." },
      { n: 100000, why: "Na mapě 1 : 100 000 odpovídá 1 cm 1 km — celá čtvrť by byla jen malá skvrna." },
    ],
    hints: ["Dům a ulice jsou velmi malé objekty.", "Vyber mapu, na které 1 cm odpovídá jen desítkám metrů."],
    explanation: "Ulice a domy ukáže jen plán města ve velmi velkém měřítku. Na mapě 1 : 5 000 odpovídá 1 cm 50 m.",
  },
  {
    q: "Jedeš autem přes celou republiku a potřebuješ vidět dálnice a silnice mezi městy. Jaká mapa se hodí?",
    n: 500000,
    d: [
      { n: 5000, why: `Plán města je na cestu přes republiku moc podrobný. ${PRILIS_PODROBNA}` },
      { n: 50000000, why: "Mapa světa je zmenšená tolik, že silnice mezi městy na ní vůbec nejsou." },
      { n: 25000, why: `Turistická mapa je na cestu autem přes republiku moc podrobná. ${PRILIS_PODROBNA}` },
    ],
    hints: ["Republika měří stovky kilometrů a silnice mezi městy jsou středně velké podrobnosti.", "Hledáš mapu mezi podrobným plánem města a mapou světa — takovou, na které 1 cm odpovídá jednotkám kilometrů."],
    explanation: "Automapa celého státu má střední měřítko. Na mapě 1 : 500 000 odpovídá 1 cm 5 km — celá republika se vejde do autoatlasu a silnice jsou vidět.",
  },
  {
    q: "Ve škole chcete na nástěnné mapě porovnat polohu všech světadílů a oceánů. Jaká mapa se hodí?",
    n: 50000000,
    d: [
      { n: 10000, why: `Mapa obce ukáže jen malé území. ${PRILIS_PODROBNA}` },
      { n: 250000, why: `Mapa kraje je na celý svět moc podrobná. ${PRILIS_PODROBNA}` },
      { n: 50000, why: `Turistická mapa je na celý svět moc podrobná. ${PRILIS_PODROBNA}` },
    ],
    hints: ["Na jedné stěně má být celá Země.", "Potřebuješ co nejvíc zmenšenou mapu — s co největším číslem za dvojtečkou."],
    explanation: "Celý svět se na nástěnnou mapu vejde jen v malém měřítku. Na mapě 1 : 50 000 000 odpovídá 1 cm 500 km.",
  },
  {
    q: "Plánuješ jednodenní výlet na kole po okolí, asi 50 km po silničkách mezi vesnicemi. Jaká mapa se hodí?",
    n: 100000,
    d: [
      { n: 5000000, why: ZAMENA },
      { n: 50000000, why: "Mapa světa je zmenšená tolik, že na ní vesnice ani silničky nejsou." },
      { n: 1000, why: `Plán jedné zahrady nebo budovy je na výlet na kole moc podrobný. ${PRILIS_PODROBNA}` },
    ],
    hints: ["Na kole ujedeš víc než pěšky, ale pořád potřebuješ vidět vesnice a silničky.", "Vyber mapu, na které 1 cm odpovídá zhruba jednomu kilometru — celá trasa se pak vejde na jeden list a vesnice zůstanou vidět."],
    explanation: "Cykloturistické mapy mívají měřítko kolem 1 : 100 000. Na něm 1 cm odpovídá 1 km, takže 50 km trasy se vejde na jeden list a vesnice jsou vidět.",
  },
  {
    q: "Na závodech v orientačním běhu hledáš v lese kontroly u jednotlivých kamenů a pasek. Jaká mapa se hodí?",
    n: 10000,
    d: [
      { n: 10000000, why: ZAMENA },
      { n: 1000000, why: "Na mapě 1 : 1 000 000 odpovídá 1 cm 10 km. Jednotlivé kameny a paseky na ní nejsou." },
      { n: 500000, why: "Na mapě 1 : 500 000 odpovídá 1 cm 5 km — les by byl jen zelená skvrna." },
    ],
    hints: ["Kámen nebo paseka jsou velmi drobné podrobnosti a závodní les je malé území.", "Vyber mapu, na které 1 cm odpovídá jen stovce metrů — jen tak rozeznáš jednotlivé kameny a okraje pasek."],
    explanation: "Orientační běh potřebuje velmi podrobnou mapu malého území. Na mapě 1 : 10 000 odpovídá 1 cm 100 m.",
  },
  {
    q: "Učitel chce na jedné stěně ukázat celou Asii i s pohořími a velkými řekami. Jaká mapa se hodí?",
    n: 10000000,
    d: [
      { n: 10000, why: `Plán obce je na celý světadíl moc podrobný. ${PRILIS_PODROBNA}` },
      { n: 100000, why: `Mapa okolí je na celý světadíl moc podrobná. ${PRILIS_PODROBNA}` },
      { n: 50000, why: `Turistická mapa je na celý světadíl moc podrobná. ${PRILIS_PODROBNA}` },
    ],
    hints: ["Asie měří tisíce kilometrů.", "Potřebuješ mapu, na které 1 cm odpovídá stovce kilometrů."],
    explanation: "Celý světadíl se vejde na stěnu jen v malém měřítku. Na mapě 1 : 10 000 000 odpovídá 1 cm 100 km.",
  },
];

function genUcel(): PracticeTask | null {
  const u = pick(UCELY);
  return task(
    u.q,
    `mapa v měřítku ${meritko(u.n)}`,
    u.d.map((x) => ({ value: `mapa v měřítku ${meritko(x.n)}`, why: x.why })),
    { hints: [...u.hints], explanation: u.explanation },
  );
}

// ── L3 (d) — čas cesty podle mapy ──────────────────────────────────────────

const PRESUNY = [
  { veta: "Půjdeš pěšky", pohyb: "ušlých", v: [4, 5], n: [50000, 100000] },
  { veta: "Pojedeš na kole", pohyb: "ujetých", v: [15, 20], n: [200000, 500000] },
];

function genCas(): PracticeTask | null {
  const p = pick(PRESUNY);
  const v = pick(p.v);
  const n = pick(p.n);
  const h = pick([2, 3, 4, 5, 6]);
  if (h === v) return null;
  const D = v * h; // km
  const c = zaokr((D * 100000) / n); // cm na mapě
  if (c > 40 || c < 4 || !jednoDesetinne(c)) return null;
  const d: Distractor[] = [
    { value: hodin(h * v * v), why: "Vzdálenost se tu vynásobila rychlostí. Čas zjistíš, když vzdálenost rychlostí vydělíš." },
    { value: hodin(h * 10), why: "Výsledek je o řád vedle — vzdálenost z mapy se převedla špatně. Platí 1 km = 100 000 cm." },
    { value: hodin(zaokr(h / 10)), why: "Výsledek je o řád vedle na druhou stranu — vzdálenost z mapy se převedla špatně. Platí 1 km = 100 000 cm." },
  ];
  const zMapy = zaokr(c / v);
  if (Number.isInteger(zMapy)) {
    d.push({ value: hodin(zMapy), why: "Délka z mapy se vzala rovnou jako kilometry. Nejdřív ji podle měřítka převeď na skutečnou vzdálenost." });
  }
  d.push({ value: hodin(h * 1000), why: "Vzdálenost se převedla jen na metry, ale rychlost je v kilometrech za hodinu. Převeď ji až na kilometry." });
  return task(
    `Na mapě v měřítku ${meritko(n)} měří trasa ${cis(c)} cm. ${p.veta} rychlostí ${cis(v)} km za hodinu. Kolik hodin ti cesta zabere?`,
    hodin(h),
    d,
    {
      hints: [
        `Nejdřív podle měřítka ${meritko(n)} zjisti skutečnou délku trasy v kilometrech.`,
        `Pak zjisti, kolikrát se ${cis(v)} km ${p.pohyb} za hodinu vejde do celé trasy. Odpovědí je čas v hodinách, ne vzdálenost — zkontroluj na konci, že odpovídáš na to, na co se otázka ptá.`,
      ],
      solutionSteps: [
        ...krokyPrevodu(n, false),
        `Skutečná délka: ${cis(c)} · ${cis(n / 100000)} km = ${cis(D)} km`,
        `Čas: ${cis(D)} km : ${cis(v)} km za hodinu = ${hodin(h)}`,
      ],
      explanation: `Trasa je ve skutečnosti ${cis(c)} · ${cis(n / 100000)} km = ${cis(D)} km. Rychlostí ${cis(v)} km za hodinu ji zvládneš za ${cis(D)} : ${cis(v)} = ${hodin(h)}.`,
    },
  );
}

function genL3(sablona: number): PracticeTask | null {
  if (sablona === 0) return genInverze();
  if (sablona === 1) return Math.random() < 0.5 ? genRozdil() : genPodrobnost();
  if (sablona === 2) return genUcel();
  return genCas();
}

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  // Rotace šablon je lokální pro jedno volání — generátor nemá stav mezi voláními.
  let krok = 0;
  if (level === 1) return ruzneUlohy(() => losUlohy(() => genL1(krok++ % 3)));
  if (level === 2) return ruzneUlohy(() => losUlohy(() => { const s = krok++ % 3; return s === 2 ? genDveMapy() : genL2(s); }));
  return ruzneUlohy(() => losUlohy(() => genL3(krok++ % 4)));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const GLOBUS_MAPA_MERITKO: TopicMetadata[] = [
  {
    id: "g6-zem-globus-mapa-meritko-6",
    rvpNodeId: "g6-zemepis-geograficke-informace-zdroje-dat-kartogr-mapa-a-globus-globus-a-mapa-meritko-druhy-map",
    displayName: "Glóbus a mapa, měřítko, druhy map",
    title: "Glóbus a mapa, měřítko, druhy map",
    studentTitle: "Mapa, glóbus a měřítko",
    subject: "zemepis",
    category: "Geografické informace, zdroje dat, kartografie",
    topic: "Mapa a glóbus",
    briefDescription: "Spočítáš skutečnou vzdálenost z mapy a poznáš, k čemu se hodí jaká mapa.",
    keywords: [
      "glóbus", "mapa", "měřítko", "číselné měřítko", "velké měřítko", "malé měřítko",
      "obecně zeměpisná mapa", "tematická mapa", "politická mapa", "zkreslení", "vzdálenost na mapě",
    ],
    goals: [
      "Rozlišit glóbus a mapu a vysvětlit, proč mapa zkresluje.",
      "Rozpoznat druh mapy podle obsahu a podle měřítka.",
      "Převést vzdálenost na mapě na skutečnou a naopak podle číselného měřítka.",
      "Určit měřítko z délek, porovnat mapy a vybrat mapu vhodnou k účelu.",
    ],
    boundaries: [
      "Jen číselné měřítko (ne grafické).",
      "Převody cm → m → km, výsledky nejvýš s jedním desetinným místem.",
      "Druhy měřítek jen u hodnot daleko od hranic, které se mezi učebnicemi liší.",
      "Bez obrázků map — všechno jde vyřešit ze slov.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Měřítko 1 : n znamená, že 1 cm na mapě odpovídá n cm ve skutečnosti. 100 cm = 1 m, 1 000 m = 1 km.",
      steps: [
        "Převeď číslo za dvojtečkou z centimetrů na metry (dělením 100) nebo na kilometry (dělením 100 000).",
        "Ze skutečnosti na mapu se dělí, z mapy na skutečnost se násobí.",
        "Čím menší číslo za dvojtečkou, tím větší měřítko a podrobnější mapa.",
      ],
      commonMistake: "Škrtnout jen dvě nuly a myslet si, že vyšly kilometry (1 : 50 000 → „1 cm = 500 km“ místo 500 m).",
      example: "1 : 50 000 → 1 cm = 50 000 cm = 500 m = 0,5 km. 7 cm na mapě = 7 · 0,5 km = 3,5 km.",
    },
  },
];
