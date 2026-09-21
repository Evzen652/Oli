/**
 * Čeština 6. ročník — Zvuková stránka jazyka: spisovná výslovnost a modulace
 * souvislé řeči (select_one v celém tématu — bez zvukových nahrávek se
 * výslovnost dá ověřit jen výběrem správného přepisu nebo rozhodnutím
 * o přednesu).
 *
 * Přízvuk slov a melodie vět NEJSOU obsahem tohoto tématu — na to je
 * sesterské téma „Přízvuk, intonace, frázování“, aby se obsah nepřekrýval.
 *
 *  • L1 — rozcvička: rozpoznání jevu (které slovo zní jinak, než se píše),
 *    rozpoznání spisovné výslovnosti mezi běžnými nespisovnými variantami,
 *    „na konci vyslovíme neznělou souhlásku“ a skryté měkčení di/ti/ni,
 *    dě/tě/ně. 4 šablony se střídají, každé zadání začíná „Které/Ve kterém/
 *    Která výslovnost…“. Nápověda nejmenuje vyloučené možnosti z nabídky.
 *  • L2 — použití: fonetický přepis v [ ] konkrétního slova ve větě.
 *    Banka má ručně ověřené přepisy (spodoba znělosti na konci slova i mezi
 *    souhláskami, di/ti/ni → ďi/ťi/ňi, dě/tě/ně → ďe/ťe/ňe,
 *    mě/bě/pě/vě → mňe/bje/pje/vje, psané y/ý → [i]/[í],
 *    zjednodušení dvou stejných souhlásek). Distraktory = doslovný přepis
 *    (bez spodoby), přepis jen s jednou z obou změn tam, kde je jich víc.
 *  • L3 — přenos: (a) pauza mění smysl věty — kam ji umístit; (b) větný
 *    důraz odpovídá na konkrétní otázku (kdo/co/kde/kdy); (c) modulace
 *    (tempo, síla hlasu, pauzy) podle komunikační situace; (d) dvoukrokový
 *    přepis spojení předložka + slovo, kde spodoba přechází přes hranici
 *    slova (v kapse → [f kapse]).
 *
 * Sporné jevy (míra rázu, výslovnost cizích slov, kolísání shoda/sh,
 * zdvojení na švu předpony) se v bance NEPOUŽÍVAJÍ jako klíč — viz
 * docs/CONTENT_AUTHORING.md a poznámky u jednotlivých bank níže.
 *
 * Nezávislé ověření: viz test tématu — mechanický fonetizér (spodoba
 * znělosti, měkčení, zjednodušení) oddělený od těchto dat, plus tabulky
 * věta→role slova (důraz) a věta→pozice pauzy.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, pick, pickN, ruzneUlohy, losUlohy, type Distractor } from "./_shared";

// ═══════════════════════════════════════════════════════════════════════
// L1 — rozpoznání jevu a spisovnosti
// ═══════════════════════════════════════════════════════════════════════

/** Slova, kde se na konci znělá souhláska mění na neznělou (šablony A i C). */
interface KoncPolozka { word: string; prepis: string; hlaska: string }
const KONCOVE_SOUHLASKY: KoncPolozka[] = [
  { word: "had", prepis: "[hat]", hlaska: "d → t" },
  { word: "led", prepis: "[let]", hlaska: "d → t" },
  { word: "hrad", prepis: "[hrat]", hlaska: "d → t" },
  { word: "oběd", prepis: "[objet]", hlaska: "d → t" },
  { word: "dub", prepis: "[dup]", hlaska: "b → p" },
  { word: "zub", prepis: "[zup]", hlaska: "b → p" },
  { word: "holub", prepis: "[holup]", hlaska: "b → p" },
  { word: "krab", prepis: "[krap]", hlaska: "b → p" },
  { word: "lev", prepis: "[lef]", hlaska: "v → f" },
  { word: "mrkev", prepis: "[mrkef]", hlaska: "v → f" },
  { word: "rukáv", prepis: "[rukáf]", hlaska: "v → f" },
  { word: "kov", prepis: "[kof]", hlaska: "v → f" },
  { word: "nůž", prepis: "[nůš]", hlaska: "ž → š" },
  { word: "mráz", prepis: "[mrás]", hlaska: "z → s" },
  { word: "vůz", prepis: "[vůs]", hlaska: "z → s" },
  { word: "roh", prepis: "[roch]", hlaska: "h → ch" },
];

/**
 * Slova, kde se výslovnost od psané podoby neliší (distraktory šablon A i C).
 * Bez y/ý (vyslovujeme [i]) a bez di/ti/ni/dě/tě/ně/mě/bě/pě/vě — jinak by se
 * slovo vyslovovalo jinak, než se píše, a distraktor by byl „také správně“.
 */
const BEZ_ZMENY = [
  "máma", "kolo", "les", "sůl", "pes", "stůl", "dům", "strom", "voda", "okno",
  "lampa", "pero", "hora", "ruka", "sova", "mapa", "lano", "tráva", "slon", "koza",
];

/** Příklad mimo nabídku pro nápovědu — jiné slovo ze stejné banky. */
function prikladMimo(spravne: KoncPolozka): KoncPolozka {
  return pick(KONCOVE_SOUHLASKY.filter((k) => k.word !== spravne.word));
}

// ── Šablona A — „Které slovo se VYSLOVUJE jinak, než se píše?“ ────────────
function templateA(): PracticeTask | null {
  const spravne = pick(KONCOVE_SOUHLASKY);
  const distraktorySlova = pickN(BEZ_ZMENY, 3);
  const poradi = pickN([spravne.word, ...distraktorySlova], 4);
  const priklad = prikladMimo(spravne);
  const distraktory: Distractor[] = distraktorySlova.map((w) => ({
    value: w,
    why: `„${w}“ vyslovujeme přesně tak, jak se píše — žádná hláska se na konci nemění.`,
  }));
  return choice(
    `Které slovo se VYSLOVUJE jinak, než se píše? ${poradi.join(", ")}`,
    spravne.word,
    distraktory,
    {
      hints: [
        `Řekni každé slovo nahlas a poslouchej jen hlásku na konci. Zní stejně, jako je napsaná? Pro představu slovo mimo nabídku: „${priklad.word}“ zní ${priklad.prepis}.`,
        "Podle pravidla se souhláska na konci slova často mění: znělá (b, d, h, v, z, ž) se vysloví jako neznělá (p, t, ch, f, s, š). Zkontroluj koncovou hlásku každého ze čtyř slov v nabídce.",
      ],
      explanation: `„${spravne.word}“ se na konci vyslovuje jinak, než se píše (${spravne.hlaska}), takže vzniká výslovnost ${spravne.prepis}. Ostatní slova (${distraktorySlova.join(", ")}) se vyslovují přesně tak, jak se píšou.`,
    },
  );
}

// ── Šablona C — „Ve kterém slově na KONCI vyslovíme neznělou souhlásku
//    místo znělé?“ (stejná banka, jiná formulace otázky) ───────────────────
function templateC(): PracticeTask | null {
  const spravne = pick(KONCOVE_SOUHLASKY);
  const distraktorySlova = pickN(BEZ_ZMENY, 3);
  const poradi = pickN([spravne.word, ...distraktorySlova], 4);
  const priklad = prikladMimo(spravne);
  const distraktory: Distractor[] = distraktorySlova.map((w) => ({
    value: w,
    why: `„${w}“ nemá na konci znělou souhlásku, která by se měnila — vyslovuje se stejně, jak se píše.`,
  }));
  return choice(
    `Ve kterém slově na KONCI vyslovíme neznělou souhlásku místo znělé? ${poradi.join(", ")}`,
    spravne.word,
    distraktory,
    {
      hints: [
        `Podívej se u každého slova jen na hlásku na konci. Je to znělá souhláska (b, d, h, v, z, ž)? Příklad mimo nabídku: „${priklad.word}“ vyslovíme ${priklad.prepis}.`,
        "Znělé souhlásky b, d, h, v, z, ž se na konci slova mění na neznělé p, t, ch, f, s, š. Projdi si koncovou hlásku u všech čtyř slov z nabídky a najdi tu, která se podle pravidla mění.",
      ],
      explanation: `„${spravne.word}“ končí na znělou souhlásku, kterou na konci slova vyslovíme jako neznělou (${spravne.hlaska}) — výsledná výslovnost je ${spravne.prepis}.`,
    },
  );
}

// ── Šablona B — „Která výslovnost je SPISOVNÁ?“ ────────────────────────────
// Sporné jevy (míra rázu, kolísání shoda/sh, [sem] u „jsem“ — kodifikace ho
// v neutrálním projevu připouští) se nepoužívají — jen jasné, učebnicově
// nesporné dvojice spisovné × obecné (nespisovné) výslovnosti.
// Přepis v [ ] je jednotný s L2: psané y/ý zapisujeme jako [i]/[í].
interface SpisPolozka { slovo: string; spisovna: string; nespisovna: string }
const SPISOVNE_PARY: SpisPolozka[] = [
  { slovo: "mléko", spisovna: "[mléko]", nespisovna: "[mlíko]" },
  { slovo: "okno", spisovna: "[okno]", nespisovna: "[vokno]" },
  { slovo: "dobrý", spisovna: "[dobrí]", nespisovna: "[dobrej]" },
  { slovo: "bychom", spisovna: "[bichom]", nespisovna: "[bisme]" },
  { slovo: "být", spisovna: "[bít]", nespisovna: "[bejt]" },
  { slovo: "sýr", spisovna: "[sír]", nespisovna: "[sejr]" },
  { slovo: "okurka", spisovna: "[okurka]", nespisovna: "[vokurka]" },
  { slovo: "malý", spisovna: "[malí]", nespisovna: "[malej]" },
  { slovo: "létat", spisovna: "[létat]", nespisovna: "[lítat]" },
];

function templateB(): PracticeTask | null {
  const spravnaPolozka = pick(SPISOVNE_PARY);
  const zbyvajici = SPISOVNE_PARY.filter((p) => p.slovo !== spravnaPolozka.slovo);
  const distraktoryPolozky = pickN(zbyvajici, 3);
  const distraktory: Distractor[] = distraktoryPolozky.map((p) => ({
    value: p.nespisovna,
    why: `${p.nespisovna} je běžná nespisovná (obecná) výslovnost slova „${p.slovo}“. Spisovně se vyslovuje ${p.spisovna}.`,
  }));
  return choice(
    "Která výslovnost je SPISOVNÁ?",
    spravnaPolozka.spisovna,
    distraktory,
    {
      hints: [
        "Ke každé možnosti si nejdřív řekni, které slovo to je, a pak si představ, jak by ho vyslovil moderátor ve zprávách. Obecná čeština třeba přidává na začátek v (oko → voko), mění é na í (polévka → polívka) nebo ý na ej (zelený → zelenej).",
        "Spisovná výslovnost je ta, kterou používáme při pečlivém oficiálním projevu (ve zprávách, ve škole). V hranaté závorce píšeme, jak slovo zní: psané y/ý proto zapisujeme jako [i]/[í] — to samo o sobě chyba není. Hledej jiné změny: přidané v, é změněné na í, ý změněné na ej.",
      ],
      explanation: `Spisovně vyslovujeme ${spravnaPolozka.spisovna} (slovo „${spravnaPolozka.slovo}“). Ostatní možnosti jsou běžné nespisovné (obecné) podoby výslovnosti: ${distraktoryPolozky.map((p) => `${p.nespisovna} místo ${p.spisovna}`).join(", ")}.`,
    },
  );
}

// ── Šablona D — měkké ď/ť/ň, které v písmu nevidíme (di/ti/ni, dě/tě/ně) ──
interface MekcPolozka { word: string; prepis: string; skupina: string }
const MEKCENI: MekcPolozka[] = [
  { word: "děti", prepis: "[ďeťi]", skupina: "dě a ti" },
  { word: "tělo", prepis: "[ťelo]", skupina: "tě" },
  { word: "díra", prepis: "[ďíra]", skupina: "dí" },
  { word: "ticho", prepis: "[ťicho]", skupina: "ti" },
  { word: "dědeček", prepis: "[ďeďeček]", skupina: "dě (dvakrát)" },
  { word: "těsto", prepis: "[ťesto]", skupina: "tě" },
  { word: "nic", prepis: "[ňic]", skupina: "ni" },
  { word: "tiše", prepis: "[ťiše]", skupina: "ti" },
  { word: "děkovat", prepis: "[ďekovat]", skupina: "dě" },
  { word: "něha", prepis: "[ňeha]", skupina: "ně" },
  { word: "nitka", prepis: "[ňitka]", skupina: "ni" },
  { word: "dítě", prepis: "[ďíťe]", skupina: "dí a tě" },
  { word: "tisíc", prepis: "[ťisíc]", skupina: "ti" },
];
/** Slova bez di/ti/ni/dě/tě/ně — d, t, n (pokud tam jsou) zní tvrdě. */
const BEZ_MEKCENI = [
  "dým", "nos", "kytara", "tráva", "noha", "lano", "sestra", "dýchat",
  "motýl", "tyč", "strom", "sova", "tabule", "dort", "nora",
];

function templateD(): PracticeTask | null {
  const spravne = pick(MEKCENI);
  const priklad = pick(MEKCENI.filter((m) => m.word !== spravne.word));
  const distraktorySlova = pickN(BEZ_MEKCENI, 3);
  const poradi = pickN([spravne.word, ...distraktorySlova], 4);
  const distraktory: Distractor[] = distraktorySlova.map((w) => ({
    value: w,
    why: `Ve slově „${w}“ není d, t ani n před i, í nebo ě — žádná měkká souhláska tu nevzniká.`,
  }));
  return choice(
    `Ve kterém slově vyslovíme měkké ď, ť nebo ň, i když se píše bez háčku? ${poradi.join(", ")}`,
    spravne.word,
    distraktory,
    {
      hints: [
        `U každého slova se podívej, co stojí hned za písmenem d, t nebo n. Příklad mimo nabídku: „${priklad.word}“ čteme ${priklad.prepis}.`,
        "Skupiny di, ti, ni (i dí, tí, ní) a dě, tě, ně čteme měkce: [ďi], [ťi], [ňi], [ďe], [ťe], [ňe]. Po y, ý a po obyčejném e zůstává d, t, n tvrdé.",
      ],
      explanation: `Ve slově „${spravne.word}“ je skupina ${spravne.skupina}, kterou čteme měkce — vzniká výslovnost ${spravne.prepis}. Ostatní slova (${distraktorySlova.join(", ")}) takovou skupinu nemají.`,
    },
  );
}

function genL1(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.25) return templateA();
  if (r < 0.5) return templateB();
  if (r < 0.75) return templateC();
  return templateD();
}

// ═══════════════════════════════════════════════════════════════════════
// L2 — fonetický přepis konkrétního slova ve větě
// ═══════════════════════════════════════════════════════════════════════

interface Prepis {
  slovo: string;
  veta: string;
  spravny: string;
  d1: string; d1why: string;
  d2: string; d2why: string;
  d3: string; d3why: string;
  vysvetleni: string;
  kategorie: "final" | "cluster" | "palatal";
}

const PREPISY_L2: Prepis[] = [
  // ── final — jednoduchá spodoba na konci slova ────────────────────────
  {
    slovo: "led", veta: "Na rybníku byl tenký led.", spravny: "[let]",
    d1: "[led]", d1why: "Toto je jen doslovný přepis psané podoby — na konci slova se znělé „d“ mění na neznělé „t“.",
    d2: "[leď]", d2why: "„D“ se na konci mění na neznělé „t“, ne na měkké „ď“ — tady žádné měkčení není.",
    d3: "[lét]", d3why: "Délka samohlásky se v tomto slově nemění, jen souhláska na konci.",
    vysvetleni: "Znělé „d“ na konci slova (před pauzou) vyslovíme jako neznělé „t“ — vzniká [let].",
    kategorie: "final",
  },
  {
    slovo: "hrad", veta: "Na kopci nad městem stojí starý hrad.", spravny: "[hrat]",
    d1: "[hrad]", d1why: "Toto je jen doslovný přepis psané podoby — na konci slova se znělé „d“ mění na neznělé „t“.",
    d2: "[hraď]", d2why: "„D“ se na konci mění na neznělé „t“, ne na měkké „ď“ — tady žádné měkčení není.",
    d3: "[chrat]", d3why: "Mění se jen poslední hláska slova. Souhláska na ZAČÁTKU slova (h) se nijak nemění.",
    vysvetleni: "Znělé „d“ na konci slova vyslovíme jako neznělé „t“ — vzniká [hrat].",
    kategorie: "final",
  },
  {
    slovo: "dub", veta: "Před školou roste mohutný dub.", spravny: "[dup]",
    d1: "[dub]", d1why: "Toto je jen doslovný přepis psané podoby — na konci slova se znělé „b“ mění na neznělé „p“.",
    d2: "[duf]", d2why: "„B“ se na konci mění na neznělé „p“, ne na „f“ — „f“ patří k jiné dvojici hlásek (v/f).",
    d3: "[tup]", d3why: "Mění se jen poslední hláska slova. Souhláska na ZAČÁTKU slova (d) se nijak nemění.",
    vysvetleni: "Znělé „b“ na konci slova vyslovíme jako neznělé „p“ — vzniká [dup].",
    kategorie: "final",
  },
  {
    slovo: "mráz", veta: "Venku panoval silný mráz.", spravny: "[mrás]",
    d1: "[mráz]", d1why: "Toto je jen doslovný přepis psané podoby — na konci slova se znělé „z“ mění na neznělé „s“.",
    d2: "[mráš]", d2why: "„Z“ se na konci mění na neznělé „s“, ne na „š“ — „š“ patří k jiné dvojici hlásek (ž/š).",
    d3: "[mras]", d3why: "Délka samohlásky se v tomto slově nemění, jen souhláska na konci.",
    vysvetleni: "Znělé „z“ na konci slova vyslovíme jako neznělé „s“ — vzniká [mrás].",
    kategorie: "final",
  },
  {
    slovo: "nůž", veta: "Na stole ležel ostrý nůž.", spravny: "[nůš]",
    d1: "[nůž]", d1why: "Toto je jen doslovný přepis psané podoby — na konci slova se znělé „ž“ mění na neznělé „š“.",
    d2: "[nůs]", d2why: "„Ž“ se na konci mění na neznělé „š“, ne na „s“ — „s“ patří k jiné dvojici hlásek (z/s).",
    d3: "[nuš]", d3why: "Délka samohlásky se v tomto slově nemění, jen souhláska na konci.",
    vysvetleni: "Znělé „ž“ na konci slova vyslovíme jako neznělé „š“ — vzniká [nůš].",
    kategorie: "final",
  },
  {
    slovo: "lev", veta: "V pohádce vystupoval statečný lev.", spravny: "[lef]",
    d1: "[lev]", d1why: "Toto je jen doslovný přepis psané podoby — na konci slova se znělé „v“ mění na neznělé „f“.",
    d2: "[lep]", d2why: "„V“ se na konci mění na neznělé „f“, ne na „p“ — „p“ patří k jiné dvojici hlásek (b/p).",
    d3: "[léf]", d3why: "Délka samohlásky se v tomto slově nemění, jen souhláska na konci.",
    vysvetleni: "Znělé „v“ na konci slova vyslovíme jako neznělé „f“ — vzniká [lef].",
    kategorie: "final",
  },
  // ── cluster — spodoba mezi dvěma souhláskami uvnitř slova ────────────
  {
    slovo: "svatba", veta: "Sousedům se o víkendu konala svatba.", spravny: "[sfadba]",
    d1: "[svatba]", d1why: "Toto je jen doslovný přepis psané podoby — obě souhláskové skupiny se ve výslovnosti mění.",
    d2: "[svadba]", d2why: "Chybí změna na začátku: skupina „sv“ se vyslovuje [sf], ne [sv].",
    d3: "[sfatba]", d3why: "Chybí změna uprostřed: „t“ před znělým „b“ se vyslovuje jako znělé „d“, ne jako „t“.",
    vysvetleni: "Ve slově „svatba“ dochází ke dvěma změnám: „v“ se před neznělým „s“ mění na „f“ a „t“ se před znělým „b“ mění na „d“ — vzniká [sfadba].",
    kategorie: "cluster",
  },
  {
    slovo: "kdo", veta: "Kdo dnes umyje tabuli?", spravny: "[gdo]",
    d1: "[kdo]", d1why: "Toto je jen doslovný přepis psané podoby — „k“ se před znělým „d“ mění na znělé „g“.",
    d2: "[kto]", d2why: "Tady se změnilo „d“ na neznělé „t“, ale ve skutečnosti se přizpůsobuje PRVNÍ hláska (k) podle druhé (d), ne naopak.",
    d3: "[hdo]", d3why: "„K“ se mění na znělé „g“, ne na „h“ — „h“ a „k“ netvoří pár znělá/neznělá.",
    vysvetleni: "Neznělé „k“ se před znělým „d“ mění na znělé „g“ — vzniká [gdo].",
    kategorie: "cluster",
  },
  {
    slovo: "vtip", veta: "Spolužák nám vyprávěl vtip.", spravny: "[ftip]",
    d1: "[vtip]", d1why: "Toto je jen doslovný přepis psané podoby — „v“ se před neznělým „t“ mění na neznělé „f“.",
    d2: "[vdip]", d2why: "Tady se změnilo „t“ na znělé „d“, ale ve skutečnosti se přizpůsobuje PRVNÍ hláska (v) podle druhé (t), ne naopak.",
    d3: "[ftib]", d3why: "Poslední „p“ je už neznělé a nijak se nemění — mění se jen „v“ na začátku skupiny.",
    vysvetleni: "Znělé „v“ se před neznělým „t“ mění na neznělé „f“ — vzniká [ftip].",
    kategorie: "cluster",
  },
  {
    slovo: "loďka", veta: "Na rybníku kotvila malá loďka.", spravny: "[loťka]",
    d1: "[loďka]", d1why: "Toto je jen doslovný přepis psané podoby — měkké „ď“ se před neznělým „k“ mění na neznělé „ť“.",
    d2: "[lodka]", d2why: "Chybí měkčení: ve slově je měkké „ď“ (ne tvrdé „d“), které se navíc před „k“ ještě mění na neznělé „ť“.",
    d3: "[loďga]", d3why: "Tady se změnilo „k“ na znělé „g“, ale ve skutečnosti se přizpůsobuje PRVNÍ hláska (ď) podle druhé (k), ne naopak.",
    vysvetleni: "Měkké „ď“ se před neznělým „k“ mění na neznělé „ť“ — vzniká [loťka].",
    kategorie: "cluster",
  },
  {
    slovo: "kobka", veta: "Ve sklepení hradu byla temná kobka.", spravny: "[kopka]",
    d1: "[kobka]", d1why: "Toto je jen doslovný přepis psané podoby — „b“ se před neznělým „k“ mění na neznělé „p“.",
    d2: "[kogka]", d2why: "Tady se změnilo „k“ na znělé „g“, ale ve skutečnosti se přizpůsobuje PRVNÍ hláska (b) podle druhé (k), ne naopak.",
    d3: "[kofka]", d3why: "„B“ se mění na neznělé „p“, ne na „f“ — „f“ patří k jiné dvojici hlásek (v/f).",
    vysvetleni: "Znělé „b“ se před neznělým „k“ mění na neznělé „p“ — vzniká [kopka].",
    kategorie: "cluster",
  },
  {
    slovo: "lehký", veta: "Batoh byl na výlet překvapivě lehký.", spravny: "[lechkí]",
    d1: "[lehký]", d1why: "Toto je jen doslovný přepis psané podoby — „h“ se před neznělým „k“ mění na neznělé „ch“.",
    d2: "[lehgí]", d2why: "Tady se změnilo „k“ na znělé „g“, ale ve skutečnosti se přizpůsobuje PRVNÍ hláska (h) podle druhé (k), ne naopak.",
    d3: "[lefkí]", d3why: "„H“ se mění na neznělé „ch“, ne na „f“ — „f“ patří k jiné dvojici hlásek (v/f).",
    vysvetleni: "Znělé „h“ se před neznělým „k“ mění na neznělé „ch“ — vzniká [lechkí] (psané „ý“ se vyslovuje stejně jako „í“).",
    kategorie: "cluster",
  },
  // ── palatal — di/ti/ni a mě/bě/pě/vě, případně v kombinaci se spodobou ──
  {
    slovo: "město", veta: "Naše město dostalo nové hřiště.", spravny: "[mňesto]",
    d1: "[město]", d1why: "Toto je jen doslovný přepis psané podoby — skupina „mě“ se vyslovuje [mňe].",
    d2: "[mjesto]", d2why: "Skupina „mě“ se čte [mňe] (s měkkým „ň“), ne [mje] — ten vzor platí pro „bě, pě, vě“, ne pro „mě“.",
    d3: "[mnesto]", d3why: "Chybí měkčení: souhláska musí být měkké „ň“, ne tvrdé „n“.",
    vysvetleni: "Skupina „mě“ se vyslovuje [mňe] — ve slově „město“ vzniká výslovnost [mňesto].",
    kategorie: "palatal",
  },
  {
    slovo: "běh", veta: "Ve škole máme zítra běh na 60 metrů.", spravny: "[bjech]",
    d1: "[běh]", d1why: "Toto je jen doslovný přepis psané podoby — skupina „bě“ se vyslovuje [bje] a „h“ na konci se mění na „ch“.",
    d2: "[bjeh]", d2why: "Skupina „bě“ je přepsaná správně, ale chybí druhá změna: „h“ na konci slova se před pauzou mění na neznělé „ch“.",
    d3: "[bech]", d3why: "Chybí měkčení skupiny „bě“ — ta se vyslovuje s „j“ jako [bje], ne jako obyčejné [be].",
    vysvetleni: "Skupina „bě“ se vyslovuje [bje] a znělé „h“ na konci slova se mění na neznělé „ch“ — vzniká [bjech].",
    kategorie: "palatal",
  },
  {
    slovo: "pěna", veta: "Na kapučínu byla hustá pěna.", spravny: "[pjena]",
    d1: "[pěna]", d1why: "Toto je jen doslovný přepis psané podoby — skupina „pě“ se vyslovuje [pje].",
    d2: "[pňena]", d2why: "Skupina „pě“ se čte [pje] (s „j“), ne [pňe] — ten vzor platí jen pro „mě“, ne pro „bě, pě, vě“.",
    d3: "[pena]", d3why: "Chybí měkčení: skupina „pě“ se vyslovuje s „j“ jako [pje], ne jako obyčejné [pe].",
    vysvetleni: "Skupina „pě“ se vyslovuje [pje] — ve slově „pěna“ vzniká výslovnost [pjena].",
    kategorie: "palatal",
  },
  {
    slovo: "věda", veta: "Fyzika je podle učitele zajímavá věda.", spravny: "[vjeda]",
    d1: "[věda]", d1why: "Toto je jen doslovný přepis psané podoby — skupina „vě“ se vyslovuje [vje].",
    d2: "[vňeda]", d2why: "Skupina „vě“ se čte [vje] (s „j“), ne [vňe] — ten vzor platí jen pro „mě“, ne pro „bě, pě, vě“.",
    d3: "[veda]", d3why: "Chybí měkčení: skupina „vě“ se vyslovuje s „j“ jako [vje], ne jako obyčejné [ve].",
    vysvetleni: "Skupina „vě“ se vyslovuje [vje] — ve slově „věda“ vzniká výslovnost [vjeda].",
    kategorie: "palatal",
  },
  {
    slovo: "měkký", veta: "Polštář byl příjemně měkký.", spravny: "[mňekí]",
    d1: "[měkký]", d1why: "Toto je jen doslovný přepis psané podoby — skupina „mě“ se vyslovuje [mňe] a dvě stejné souhlásky „kk“ se vyslovují jako jedna.",
    d2: "[mňekký]", d2why: "Skupina „mě“ je přepsaná správně, ale chybí druhá změna: dvě stejné souhlásky vedle sebe („kk“) se vyslovují jako jedna.",
    d3: "[mjekí]", d3why: "Skupina „mě“ se čte [mňe] (s měkkým „ň“), ne [mje] — ten vzor platí pro „bě, pě, vě“, ne pro „mě“.",
    vysvetleni: "Skupina „mě“ se vyslovuje [mňe] a dvojice stejných souhlásek „kk“ se zjednodušuje na jedno „k“ — vzniká [mňekí].",
    kategorie: "palatal",
  },
  {
    slovo: "nic", veta: "V lednici nezbylo nic k snídani.", spravny: "[ňic]",
    d1: "[nic]", d1why: "Toto je jen doslovný přepis psané podoby — „n“ před „i“ se vyslovuje měkce jako [ň].",
    d2: "[ňič]", d2why: "Měkne jen souhláska „n“ na začátku slova (na [ň]) — koncové „c“ zůstává „c“, nemění se na „č“.",
    d3: "[nič]", d3why: "Změnit se má souhláska „n“ na začátku, ne souhláska „c“ na konci.",
    vysvetleni: "„N“ před „i“ se vyslovuje měkce jako [ň] — vzniká [ňic].",
    kategorie: "palatal",
  },
  {
    slovo: "tisíc", veta: "Na koncert prý přišlo skoro tisíc lidí.", spravny: "[ťisíc]",
    d1: "[tisíc]", d1why: "Toto je jen doslovný přepis psané podoby — „t“ před „i“ se vyslovuje měkce jako [ť].",
    d2: "[ťisic]", d2why: "Měkčení na začátku je správně, ale délka samohlásky „í“ uprostřed slova se nemění.",
    d3: "[tisic]", d3why: "Chybí měkčení na začátku (t → ť) a navíc se špatně zkrátila samohláska „í“.",
    vysvetleni: "„T“ před „i“ se vyslovuje měkce jako [ť], délka samohlásky „í“ zůstává — vzniká [ťisíc].",
    kategorie: "palatal",
  },
  {
    slovo: "sníh", veta: "V noci napadl čerstvý sníh.", spravny: "[sňích]",
    d1: "[sníh]", d1why: "Toto je jen doslovný přepis psané podoby — „n“ před „í“ se vyslovuje měkce jako [ň] a „h“ na konci se mění na „ch“.",
    d2: "[sňíh]", d2why: "Měkčení na začátku je správně (n → ň), ale chybí druhá změna: „h“ na konci slova se mění na neznělé „ch“.",
    d3: "[sních]", d3why: "Změna „h“ na „ch“ na konci je správně, ale chybí měkčení „n“ na začátku (n → ň).",
    vysvetleni: "„N“ před „í“ se vyslovuje měkce jako [ň] a znělé „h“ na konci slova se mění na neznělé „ch“ — vzniká [sňích].",
    kategorie: "palatal",
  },
  {
    slovo: "dívka", veta: "Na hřišti si hrála malá dívka.", spravny: "[ďífka]",
    d1: "[dívka]", d1why: "Toto je jen doslovný přepis psané podoby — „d“ před „í“ se vyslovuje měkce jako [ď] a „v“ před neznělým „k“ se mění na „f“.",
    d2: "[ďívka]", d2why: "Měkčení na začátku je správně (d → ď), ale chybí druhá změna: „v“ před neznělým „k“ se mění na neznělé „f“.",
    d3: "[dífka]", d3why: "Změna „v“ na „f“ je správně, ale chybí měkčení „d“ na začátku (d → ď).",
    vysvetleni: "„D“ před „í“ se vyslovuje měkce jako [ď] a znělé „v“ před neznělým „k“ se mění na neznělé „f“ — vzniká [ďífka].",
    kategorie: "palatal",
  },
  {
    slovo: "těžký", veta: "Dnešní test byl podle spolužáků těžký.", spravny: "[ťeškí]",
    d1: "[težký]", d1why: "Toto je jen doslovný přepis bez úprav — chybí měkčení „tě“ na [ťe] i spodoba „ž“ na [š] před „k“.",
    d2: "[ťežkí]", d2why: "Měkčení na začátku je správně (tě → ťe), ale chybí druhá změna: „ž“ před neznělým „k“ se mění na neznělé „š“.",
    d3: "[teškí]", d3why: "Změna „ž“ na „š“ je správně, ale chybí měkčení na začátku (tě → ťe).",
    vysvetleni: "Skupina „tě“ se vyslovuje [ťe] a znělé „ž“ před neznělým „k“ se mění na neznělé „š“ — vzniká [ťeškí].",
    kategorie: "palatal",
  },
];

const HINT_KATEGORIE: Record<Prepis["kategorie"], [string, string]> = {
  final: [
    "Vyslov si dané slovo potichu na konci — jak by znělo, kdyby bylo úplně poslední ve větě, před pauzou?",
    "Znělé souhlásky (b, d, h, v, z, ž) se na samém konci slova (před pauzou) mění na své neznělé protějšky (p, t, ch, f, s, š). Rozmysli si, která z těchto dvojic sedí na poslední hlásku daného slova.",
  ],
  cluster: [
    "Najdi ve slově dvě souhlásky vedle sebe — první z nich se přizpůsobuje té druhé, ne naopak.",
    "V souhláskové skupině rozhoduje o znělosti vždy ta hláska, která je ve slově POZDĚJI. Najdi dvě souhlásky vedle sebe a uprav podle pravidla tu, která je z nich dřív. (Psané y/ý zapisujeme v závorce jako [i]/[í].)",
  ],
  palatal: [
    "Hledej ve slově skupinu di/ti/ni, dě/tě/ně nebo mě/bě/pě/vě — ty se čtou jinak, než jak vypadají napsané.",
    "Skupiny di, ti, ni se čtou [ďi], [ťi], [ňi]. Skupiny dě, tě, ně se čtou [ďe], [ťe], [ňe]. Skupina mě se čte [mňe], skupiny bě, pě, vě se čtou [bje], [pje], [vje]. Psané y/ý zapisujeme v závorce jako [i]/[í]. Zkontroluj, která z těchto skupin je ve slově, a jestli k tomu navíc nepřibývá i spodoba znělosti.",
  ],
};

function prepisTask(p: Prepis): PracticeTask | null {
  const distraktory: Distractor[] = [
    { value: p.d1, why: p.d1why },
    { value: p.d2, why: p.d2why },
    { value: p.d3, why: p.d3why },
  ];
  return choice(
    `Jak spisovně vyslovíme slovo ${p.slovo} ve větě „${p.veta}“?`,
    p.spravny,
    distraktory,
    {
      hints: HINT_KATEGORIE[p.kategorie],
      explanation: p.vysvetleni,
    },
  );
}

function genL2(): PracticeTask | null {
  return prepisTask(pick(PREPISY_L2));
}

// ═══════════════════════════════════════════════════════════════════════
// L3 — přenos a situační rozhodnutí (modulace)
// ═══════════════════════════════════════════════════════════════════════

// ── (a) pauza mění smysl věty ──────────────────────────────────────────
interface PauzaPolozka { w1: string; w2: string; w3: string; vyznamW1: string; vyznamW2: string }
const PAUZA_DVOJICE: PauzaPolozka[] = [
  { w1: "Pomalu", w2: "ne", w3: "rychle", vyznamW1: "Dělej to pomalu, ne rychle.", vyznamW2: "Nedělej to pomalu — dělej to rychle." },
  { w1: "Trestat", w2: "ne", w3: "odpouštět", vyznamW1: "Potrestej ho, neodpouštěj mu.", vyznamW2: "Netrestej ho, odpusť mu." },
  { w1: "Chválit", w2: "ne", w3: "kritizovat", vyznamW1: "Pochval ho, nekritizuj ho.", vyznamW2: "Nechval ho, kritizuj ho." },
  { w1: "Pomoct", w2: "ne", w3: "škodit", vyznamW1: "Pomoz mu, neškoď mu.", vyznamW2: "Nepomáhej mu, škoď mu." },
  { w1: "Jít", w2: "ne", w3: "zůstat", vyznamW1: "Jdi, nezůstávej.", vyznamW2: "Nechoď, zůstaň." },
  { w1: "Věřit", w2: "ne", w3: "pochybovat", vyznamW1: "Věř, nepochybuj.", vyznamW2: "Nevěř, pochybuj." },
  { w1: "Mluvit", w2: "ne", w3: "mlčet", vyznamW1: "Mluv, nemlč.", vyznamW2: "Nemluv, mlč." },
  { w1: "Čekat", w2: "ne", w3: "utíkat", vyznamW1: "Čekej, neutíkej.", vyznamW2: "Nečekej, utíkej." },
  { w1: "Psát", w2: "ne", w3: "kreslit", vyznamW1: "Piš, nekresli.", vyznamW2: "Nepiš, kresli." },
];

function pauzaTask(p: PauzaPolozka, cilW1: boolean): PracticeTask | null {
  const optA = `${p.w1} | ${p.w2} ${p.w3}.`;
  const optB = `${p.w1} ${p.w2} | ${p.w3}.`;
  const optC = `${p.w1} ${p.w2} ${p.w3}.`;
  const optD = `${p.w1} | ${p.w2} | ${p.w3}.`;
  const spravna = cilW1 ? optA : optB;
  const druha = cilW1 ? optB : optA;
  const druhyVyznam = cilW1 ? p.vyznamW2 : p.vyznamW1;
  const cilVyznam = cilW1 ? p.vyznamW1 : p.vyznamW2;
  const distraktory: Distractor[] = [
    { value: druha, why: `Tahle pauza dává OPAČNÝ význam: ${druhyVyznam}` },
    { value: optC, why: "Bez pauzy věta zní nejednoznačně — posluchač nepozná, který ze dvou významů myslíš." },
    { value: optD, why: "Pauza na obou místech větu jen zpomalí a nerozhodne mezi dvěma možnými významy." },
  ];
  return choice(
    `Kam patří pauza ve větě „${p.w1} ${p.w2} ${p.w3}.“, aby znamenala: „${cilVyznam}“?`,
    spravna,
    distraktory,
    {
      hints: [
        "Zkus větu nahlas přečíst s pauzou na různých místech a poslouchej, po které pauze dává smysl ten uvedený význam.",
        "Pauza odděluje dvě části věty podobně jako čárka v psaném textu. Zkus si mezi třemi slovy představit čárku na různých místech a vyber tu pozici, po které věta znamená přesně to, co je zadané.",
      ],
      explanation: `Správně patří pauza takhle: „${spravna}“ — to znamená: ${cilVyznam}`,
    },
  );
}

function templateL3Pauza(): PracticeTask | null {
  const p = pick(PAUZA_DVOJICE);
  return pauzaTask(p, Math.random() < 0.5);
}

// ── (b) větný důraz odpovídá na konkrétní otázku ───────────────────────
type Role = "subjekt" | "sloveso" | "predmet" | "okolnost";
/** vlastni = vlastní jméno (uprostřed otázky zůstává s velkým písmenem). */
interface DurazVeta { subjekt: string; vlastni: boolean; sloveso: string; predmet: string; okolnost: string; okolnostOtazka: "Kde" | "Kdy"; /** Tvar slovesa po „Kdo…?“ — tázací „kdo“ se pojí s mužským rodem. */ slovesoKdo?: string }
const DURAZ_VETY: DurazVeta[] = [
  { subjekt: "Petra", vlastni: true, sloveso: "koupila", predmet: "dort", okolnost: "v pekárně", okolnostOtazka: "Kde", slovesoKdo: "koupil" },
  { subjekt: "Tomáš", vlastni: true, sloveso: "namaloval", predmet: "obrázek", okolnost: "ve škole", okolnostOtazka: "Kde" },
  { subjekt: "Babička", vlastni: false, sloveso: "upekla", predmet: "koláč", okolnost: "včera", okolnostOtazka: "Kdy", slovesoKdo: "upekl" },
  { subjekt: "Bratr", vlastni: false, sloveso: "opravil", predmet: "kolo", okolnost: "v garáži", okolnostOtazka: "Kde" },
  { subjekt: "Sousedka", vlastni: false, sloveso: "zalila", predmet: "květiny", okolnost: "ráno", okolnostOtazka: "Kdy", slovesoKdo: "zalil" },
  { subjekt: "Trenér", vlastni: false, sloveso: "pochválil", predmet: "tým", okolnost: "po zápase", okolnostOtazka: "Kdy" },
];
const ROLE_LIST: Role[] = ["subjekt", "sloveso", "predmet", "okolnost"];

/** Podmět uprostřed otázky: obecné jméno malým písmenem, vlastní jméno beze změny. */
function subjektUprostred(v: DurazVeta): string {
  return v.vlastni ? v.subjekt : v.subjekt.toLowerCase();
}

// Otázka na sloveso se nepoužívá (neexistuje přirozená otázka, na kterou by
// odpovídalo jen sloveso) — sloveso je jen distraktor.
function otazkaPro(v: DurazVeta, r: Exclude<Role, "sloveso">): string {
  if (r === "subjekt") return `Kdo ${v.slovesoKdo ?? v.sloveso} ${v.predmet} ${v.okolnost}?`;
  if (r === "predmet") return `Co ${subjektUprostred(v)} ${v.sloveso} ${v.okolnost}?`;
  return `${v.okolnostOtazka} ${subjektUprostred(v)} ${v.sloveso} ${v.predmet}?`;
}
function slovoPro(v: DurazVeta, r: Role): string {
  return r === "subjekt" ? v.subjekt : r === "sloveso" ? v.sloveso : r === "predmet" ? v.predmet : v.okolnost;
}
function vetaSDurazem(v: DurazVeta, duraz: Role): string {
  const s = duraz === "subjekt" ? v.subjekt.toUpperCase() : v.subjekt;
  const g = duraz === "sloveso" ? v.sloveso.toUpperCase() : v.sloveso;
  const p = duraz === "predmet" ? v.predmet.toUpperCase() : v.predmet;
  const o = duraz === "okolnost" ? v.okolnost.toUpperCase() : v.okolnost;
  return `${s} ${g} ${p} ${o}.`;
}

function durazTask(v: DurazVeta, role: Exclude<Role, "sloveso">): PracticeTask | null {
  const otazka = otazkaPro(v, role);
  const spravna = vetaSDurazem(v, role);
  const ostatni = ROLE_LIST.filter((r) => r !== role);
  const distraktory: Distractor[] = ostatni.map((r) => ({
    value: vetaSDurazem(v, r),
    why: `Tady je zdůrazněné slovo „${slovoPro(v, r)}“ — to odpovídá na jinou otázku, ne na „${otazka}“.`,
  }));
  return choice(
    `Která věta se zdůrazněným slovem (napsaným VELKÝMI PÍSMENY) odpovídá na otázku „${otazka}“?`,
    spravna,
    distraktory,
    {
      hints: [
        `Zkus na otázku „${otazka}“ odpovědět jedním slovem — přesně to slovo pak ve větě nese důraz.`,
        "Kdo se ptá „Kdo…?“, ptá se na toho, kdo děj dělá. Kdo se ptá „Co…?“, ptá se na věc, které se děj týká. Kdo se ptá „Kde…?“ nebo „Kdy…?“, ptá se na místo nebo čas. Podle typu otázky poznáš, které slovo má nést důraz.",
      ],
      explanation: `Na otázku „${otazka}“ odpovídá slovo „${slovoPro(v, role)}“ — proto se právě ono ve větě zdůrazní: „${spravna}“`,
    },
  );
}

function templateL3Duraz(): PracticeTask | null {
  const v = pick(DURAZ_VETY);
  const role = pick(["subjekt", "predmet", "okolnost"] as const);
  return durazTask(v, role);
}

// ── (c) modulace (tempo, síla hlasu, pauzy) podle situace ──────────────
interface Situace {
  popis: string;
  /** Kdo poslouchá a co potřebuje — pro nápovědu i vysvětlení PROČ. */
  posluchac: string;
  spravna: string;
  proc: string;
  spatne: { text: string; why: string }[];
}
// Distraktory jsou blízké a rozumně znějící — každý má jednu nebo dvě
// vlastnosti správně a liší se v tom, co daný posluchač potřebuje nejvíc.
// Délky možností jsou vyrovnané, aby se klíč nedal poznat podle délky.
const SITUACE: Situace[] = [
  {
    popis: "čteš hlášení ve školním rozhlase pro celou školu",
    posluchac: "Poslouchá celá škola najednou a nikdo se nemůže zeptat znovu.",
    spravna: "Zřetelně a dost nahlas, v klidném tempu, s krátkou pauzou mezi informacemi.",
    proc: "Hlášení slyší všichni jen jednou, proto musí být zřetelné a dost hlasité. Krátké pauzy mezi informacemi dají posluchačům čas zapamatovat si, co, kdy a kde se děje.",
    spatne: [
      { text: "Zřetelně a dost nahlas, ale svižně a bez pauz, aby hlášení nezdrželo výuku.", why: "Bez pauz se informace slijí dohromady — posluchači nestihnou zachytit, co, kdy a kde." },
      { text: "Pomalu a s pauzami, s velkým napětím v hlase jako při vyprávění příběhu.", why: "Hraní s napětím odvádí pozornost od informací. Hlášení má být věcné a srozumitelné." },
      { text: "Nahlas a zřetelně, ale velmi pomalu, s dlouhou pauzou po každém slově.", why: "Rozkouskované hlášení slovo po slově ztrácí souvislost — posluchači se v něm ztratí." },
    ],
  },
  {
    popis: "vypravuješ kamarádovi vtip",
    posluchac: "Poslouchá jeden kamarád a má se na konci zasmát.",
    spravna: "Živě a s napětím v hlase, před pointou krátká pauza, pointu řekni zřetelně.",
    proc: "Vtip stojí na napětí a překvapení. Krátká pauza před pointou napětí vystupňuje a zřetelně vyslovená pointa pak vynikne.",
    spatne: [
      { text: "Živě a s napětím v hlase, ale pointu dořekni rychle a bez zastavení.", why: "Bez pauzy před pointou překvapení zanikne — kamarád nemá chvilku napětí, ze které by se zasmál." },
      { text: "Klidně a zřetelně, stejným tónem od začátku vtipu až do jeho pointy.", why: "Stejný tón od začátku do konce nevytvoří žádné napětí, takže pointa nevynikne." },
      { text: "Živě, ale s dlouhou pauzou po každé větě, aby kamarád všechno stihl.", why: "Pauzy všude rozbijí tempo vyprávění. Pauza má smysl hlavně před pointou." },
    ],
  },
  {
    popis: "předčítáš pohádku malému sourozenci",
    posluchac: "Poslouchá malé dítě, které teprve sleduje, co se v příběhu děje.",
    spravna: "Pomalu a výrazně, jiným hlasem pro každou postavu, napětí vytvoř ztišením.",
    proc: "Malé dítě potřebuje čas pochopit děj. Výrazná intonace a různé hlasy mu pomáhají rozlišit postavy a ztišení vytvoří napětí, aniž by se vylekalo.",
    spatne: [
      { text: "Pomalu a zřetelně, ale pořád stejným tónem, aby dítě nic nerozptylovalo.", why: "Jednotvárný hlas malé dítě nebaví a nepozná z něj, která postava zrovna mluví." },
      { text: "Výrazně, jiným hlasem pro každou postavu, ale svižně, ať pohádku stihneš.", why: "V rychlém tempu malé dítě nestihne pochopit, co se v pohádce děje." },
      { text: "Pomalu a výrazně, a v napínavých chvílích co nejvíc zesil svůj hlas.", why: "Náhlý hlasitý hlas může malé dítě vyděsit. Napětí lépe vytvoří ztišení a pauza." },
    ],
  },
  {
    popis: "se omlouváš učitelce, že nemáš úkol",
    posluchac: "Poslouchá učitelka, kterou to zklamalo, a má poznat, že tě to mrzí.",
    spravna: "Klidně a zřetelně, v mírném tempu, s klesajícím hlasem na konci věty.",
    proc: "Učitelka potřebuje omluvě rozumět a poznat, že ji myslíš vážně. Klidné mírné tempo zní upřímně a klesající hlas na konci věty zní vážně a uzavřeně.",
    spatne: [
      { text: "Klidně a zřetelně, ale rychle, ať omluva netrvá dlouho a nezdržuje.", why: "Spěch působí, jako by ti na omluvě nezáleželo a šlo ti jen o to mít ji rychle za sebou." },
      { text: "Velmi potichu a pomalu, skoro šeptem, aby bylo slyšet, že tě to mrzí.", why: "Omluvu šeptem učitelka nemusí vůbec slyšet — upřímná omluva má být i srozumitelná." },
      { text: "Zřetelně a nahlas, s důrazem na to, proč úkol nemáš.", why: "Silný hlas a důraz na výmluvu zní jako obhajoba nebo hádka, ne jako omluva." },
    ],
  },
  {
    popis: "odpovídáš u tabule a poslouchá tě celá třída",
    posluchac: "Poslouchá učitel i celá třída, včetně spolužáků v poslední lavici.",
    spravna: "Nahlas a zřetelně, ve středním tempu, s krátkou pauzou mezi částmi odpovědi.",
    proc: "Odpověď má slyšet a pochopit celá třída. Dost silný hlas dojde i do poslední lavice a krátké pauzy oddělí jednotlivé myšlenky odpovědi.",
    spatne: [
      { text: "Zřetelně a v klidném tempu, ale tiše, protože odpovídáš hlavně učiteli.", why: "Poslouchá i celá třída — spolužáci v zadních lavicích by tichou odpověď neslyšeli." },
      { text: "Nahlas a zřetelně, ale rychle a bez zastavení, ať neztrácíš čas třídy.", why: "Bez pauz se odpověď slije dohromady a posluchači nepoznají, kde končí jedna myšlenka." },
      { text: "Nahlas a pomalu, s dlouhou pauzou po každém slově, aby vše vyznělo.", why: "Rozkouskovaná odpověď slovo po slově se špatně sleduje a zní nejistě." },
    ],
  },
];

function situaceTask(s: Situace): PracticeTask | null {
  const distraktory: Distractor[] = s.spatne.map((sp) => ({ value: sp.text, why: sp.why }));
  return choice(
    `Jak je vhodné mluvit, když ${s.popis}?`,
    s.spravna,
    distraktory,
    {
      hints: [
        `${s.posluchac} Co z tempa, síly hlasu a pauz ten posluchač potřebuje nejvíc?`,
        "Všechny možnosti znějí rozumně a každá má něco dobře. Hledej tu, ve které NIC neodporuje potřebám posluchače: projdi u každé tempo, sílu hlasu a pauzy zvlášť a vyřaď tu, kde je aspoň jedna z těch tří věcí pro tuto situaci nevhodná.",
      ],
      explanation: `Správně: ${s.spravna} Proč: ${s.proc}`,
    },
  );
}

function templateL3Situace(): PracticeTask | null {
  return situaceTask(pick(SITUACE));
}

// ── (d) dvoukrokový přepis: předložka + slovo, spodoba přes hranici slova ──
interface PredlozkaPolozka {
  predlozka: string; slovo: string; spravny: string;
  d2: string; d2why: string;
  d3: string; d3why: string;
}
const PREDLOZKY_PREPIS: PredlozkaPolozka[] = [
  {
    predlozka: "v", slovo: "kapse", spravny: "[f kapse]",
    d2: "[v gapse]", d2why: "Tady se změnilo slovo (k → g), ale ve skutečnosti se přizpůsobuje PŘEDLOŽKA podle první hlásky slova, ne naopak.",
    d3: "[f gapse]", d3why: "Změnila se i hláska na začátku slova, ale mění se jen konec předložky — začátek slova zůstává, jak je napsaný.",
  },
  {
    predlozka: "z", slovo: "pole", spravny: "[s pole]",
    d2: "[z bole]", d2why: "Tady se změnilo slovo (p → b), ale ve skutečnosti se přizpůsobuje PŘEDLOŽKA podle první hlásky slova, ne naopak.",
    d3: "[s bole]", d3why: "Změnila se i hláska na začátku slova, ale mění se jen konec předložky — začátek slova zůstává, jak je napsaný.",
  },
  {
    predlozka: "k", slovo: "domu", spravny: "[g domu]",
    d2: "[k tomu]", d2why: "Tady se změnilo slovo (d → t), ale ve skutečnosti se přizpůsobuje PŘEDLOŽKA podle první hlásky slova, ne naopak.",
    d3: "[g tomu]", d3why: "Změnila se i hláska na začátku slova, ale mění se jen konec předložky — začátek slova zůstává, jak je napsaný.",
  },
  {
    predlozka: "s", slovo: "bratrem", spravny: "[z bratrem]",
    d2: "[s pratrem]", d2why: "Tady se změnilo slovo (b → p), ale ve skutečnosti se přizpůsobuje PŘEDLOŽKA podle první hlásky slova, ne naopak.",
    d3: "[z pratrem]", d3why: "Změnila se i hláska na začátku slova, ale mění se jen konec předložky — začátek slova zůstává, jak je napsaný.",
  },
  {
    // „bez peněz“ vyřazeno: „peněz“ má samo ně → [ňe] a koncovou spodobu z → s,
    // takže by klíč kombinoval tři jevy. „práce“ končí samohláskou a nemá
    // skupinu dě/tě/ně — mění se jen předložka.
    predlozka: "bez", slovo: "práce", spravny: "[bes práce]",
    d2: "[bez bráce]", d2why: "Tady se změnilo slovo (p → b), ale ve skutečnosti se přizpůsobuje PŘEDLOŽKA podle první hlásky slova, ne naopak.",
    d3: "[bes bráce]", d3why: "Změnila se i hláska na začátku slova, ale mění se jen konec předložky — začátek slova zůstává, jak je napsaný.",
  },
  {
    predlozka: "pod", slovo: "stromem", spravny: "[pot stromem]",
    d2: "[pod ztromem]", d2why: "Tady se změnilo slovo (s → z), ale ve skutečnosti se přizpůsobuje PŘEDLOŽKA podle první hlásky slova, ne naopak.",
    d3: "[pot ztromem]", d3why: "Změnila se i hláska na začátku slova, ale mění se jen konec předložky — začátek slova zůstává, jak je napsaný.",
  },
];

function predlozkaTask(p: PredlozkaPolozka): PracticeTask | null {
  const d1 = `[${p.predlozka} ${p.slovo}]`;
  const distraktory: Distractor[] = [
    { value: d1, why: "Toto je jen doslovný přepis psané podoby — nebere v úvahu, že se předložka přizpůsobuje první hlásce dalšího slova." },
    { value: p.d2, why: p.d2why },
    { value: p.d3, why: p.d3why },
  ];
  return choice(
    `Jak spisovně vyslovíme spojení „${p.predlozka} ${p.slovo}“?`,
    p.spravny,
    distraktory,
    {
      hints: [
        `Řekni si nahlas „${p.predlozka}“ a hned za tím první hlásku slova „${p.slovo}“ — jak spolu ty dvě hlásky znějí, když je vyslovíš plynule za sebou, bez přestávky?`,
        "Předložka se na hranici se slovem chová stejně jako souhláska uvnitř slova: přizpůsobuje se té hlásce, která je hned za ní — ne naopak. Zkontroluj, jestli je první hláska následujícího slova znělá, nebo neznělá, a uprav podle toho konec předložky.",
      ],
      explanation: `Ve spojení „${p.predlozka} ${p.slovo}“ se předložka přizpůsobí první hlásce slova, které za ní následuje — vzniká ${p.spravny}.`,
    },
  );
}

function templateL3Predlozka(): PracticeTask | null {
  return predlozkaTask(pick(PREDLOZKY_PREPIS));
}

function genL3(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.25) return templateL3Pauza();
  if (r < 0.5) return templateL3Duraz();
  if (r < 0.75) return templateL3Situace();
  return templateL3Predlozka();
}

// ── Generátor ────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const SPISOVNA_VYSLOVNOST_MODULACE_SOUVISLE_RECI: TopicMetadata[] = [
  {
    id: "g6-cjl-spisovna-vyslovnost-modulace-souvisle-reci-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-zvukova-stranka-jazyka-spisovna-vyslovnost-modulace-souvisle-reci",
    displayName: "Spisovná výslovnost",
    title: "Spisovná výslovnost, modulace souvislé řeči",
    studentTitle: "Jak správně vyslovovat a mluvit",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Zvuková stránka jazyka",
    briefDescription: "Spisovná výslovnost slov a jak přednést řeč podle situace.",
    keywords: [
      "spisovná výslovnost", "spodoba znělosti", "fonetický přepis",
      "ďi ťi ňi", "mě bě pě vě", "modulace řeči", "tempo", "síla hlasu",
      "pauza", "důraz", "přednes",
    ],
    goals: [
      "Rozpoznat, kdy se výslovnost slova liší od jeho psané podoby.",
      "Přepsat spisovnou výslovnost slova v hranaté závorce (spodoba znělosti, di/ti/ni, dě/tě/ně, mě/bě/pě/vě).",
      "Rozlišit spisovnou výslovnost od běžné nespisovné (obecné) varianty.",
      "Umístit pauzu tak, aby věta měla zamýšlený smysl, a zdůraznit slovo odpovídající dané otázce.",
      "Zvolit vhodné tempo, sílu hlasu a pauzy pro přednes podle komunikační situace.",
    ],
    boundaries: [
      "Přízvuk slov a melodie (intonace) vět se tu neprobírá — má vlastní téma „Přízvuk, intonace, frázování“.",
      "Žádné zvukové nahrávky — vše se řeší z psaného textu a fonetického přepisu.",
      "Sporné jevy (míra rázu, výslovnost cizích slov, kolísání shoda/sh) se nepoužívají jako klíč.",
      "Jen vybírání ze čtyř možností — žádný volný přepis.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Znělé souhlásky (b, d, h, v, z, ž) se na konci slova nebo před neznělou souhláskou mění na neznělé (p, t, ch, f, s, š) — a naopak, neznělá souhláska se před znělou mění na znělou. Skupiny di, ti, ni se čtou měkce [ďi, ťi, ňi], skupiny dě, tě, ně [ďe, ťe, ňe], skupina mě se čte [mňe], skupiny bě, pě, vě se čtou [bje, pje, vje]. Při přednesu vol tempo, sílu hlasu a pauzy podle toho, kdo poslouchá a co potřebuje slyšet.",
      steps: [
        "Najdi ve slově souhlásky, které jsou vedle sebe, nebo poslední souhlásku před pauzou.",
        "Uprav znělost podle pravidla: rozhoduje vždy hláska, která je ve slově pozdější (nebo hláska následujícího slova u předložek).",
        "Zkontroluj, jestli ve slově není skupina di/ti/ni, dě/tě/ně nebo mě/bě/pě/vě, která se čte jinak, než se píše.",
      ],
      commonMistake: "Přepsat slovo přesně tak, jak se píše, a spodobu znělosti vůbec neuplatnit — nebo ji uplatnit opačným směrem (dřívější hláska ovlivní tu pozdější, místo naopak).",
      example: "Slovo hrad se na konci vyslovuje jinak, než se píše: [hrat]. Slovo město se vyslovuje [mňesto], protože skupina mě se čte [mňe].",
    },
  },
];
