/**
 * Vyprávění podle obrázkové osnovy — 2. ročník.
 *
 * RVP uzel `g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypraveni-
 * podle-obrazkove-osnovy`. Třetí ze uzlů slohové výchovy, které zbyly po
 * opravě `rvpNodeId` (viz `PROJECT_STATUS.md` §6). Předchůdci: `pozdrav-
 * OsloveniOmluva.ts` (co se **řekne**) a `adresaBlahopraniPozdrav.ts` (co se
 * **napíše a pošle**). Tady jde o to, jak se z obrázků stane **příběh** —
 * tedy o pořadí, úplnost a celek.
 *
 * **Sloh tady neznamená volný text.** `inputType: "essay"` v aplikaci
 * neexistuje a existovat nemá (`CLAUDE.md`). Dítě tedy nevypráví do
 * mikrofonu ani nepíše sloh; rozhoduje, které vyprávění osnovu dodrží. To je
 * samostatná dovednost — kdo neumí poznat, že vyprávění přeskočilo obrázek,
 * neumí ho ani vyprávět celé.
 *
 * **Osnova je obrázek, ne text v zadání.** Kvůli tomu tématu vznikl nový
 * druh `TaskVisual` — `story_strip` (`src/lib/types.ts`,
 * `src/components/TaskVisual.tsx`). Bez něj by se osnova musela vepsat do
 * otázky, a to u 2. ročníku dává zadání o třiceti slovech; audit
 * `sentence_complexity` povoluje dvanáct a všechna zadání tady se pod ten
 * limit vejdou. Pás navíc dělá přesně to, co dělá učebnice: obrázky vedle
 * sebe, číslo nad každým, pár slov pod ním.
 *
 * **Odpovědí nikdy není popisek z obrázku** — jedinou výjimkou je úloha „jak
 * osnova skončí", a tam se poslední pole pásu nekreslí, jen otazník. Ostatní
 * úlohy odpovídají pořadovým číslem („k druhému obrázku") nebo celou větou.
 * Kdyby odpověď stála v pásu, dítě by ji opsalo a nic nepřečetlo.
 *
 * Kalibrace úrovní:
 * - **L1 rozpoznání** — přiřadit jednu větu k jednomu obrázku a vědět, že
 *   vyprávění začíná vlevo a končí vpravo. Jeden krok.
 * - **L2 aplikace** — posunout se osnovou o jeden obrázek dál (ne zpátky, ne
 *   přeskočit) a poznat větu, která v osnově vůbec nemá obrázek.
 * - **L3 přenos** — posoudit celek, ne jeden krok: které ze čtyř vyprávění
 *   osnovu dodrží, jak osnova dopadne, když poslední obrázek chybí, a jak se
 *   dá celý příběh pojmenovat. Dvoukrokové a u pojmenování i obrácené —
 *   z celku zpátky k jedné větě.
 *
 * **Povrchní znaky, které by se daly naučit.** Délka možností není jediný
 * způsob, jak uhodnout klíč bez čtení. Dvě pasti jsem si tady vyrobil sám a
 * všiml si jich teprve, když jsem psal nezávislou kontrolu:
 * - U pojmenování osnovy (L3c) začínalo **všech pět** klíčů slovem „Jak" a
 *   žádný distraktor ne. Stačilo tedy hledat „Jak" a téma bylo vyřešené.
 *   Teď má „Jak" aspoň jeden distraktor v každém příběhu a dva klíče z pěti
 *   začínají jinak. Měří to `vypraveni-osnova.test.ts`.
 * - U konce osnovy (L3b) byl klíč vždy jediná možnost, která dopadne dobře.
 *   „Vyber tu veselou" tedy fungovalo bez pohledu na obrázky. Každý příběh
 *   proto má jeden distraktor, který je taky veselý — jen v osnově není
 *   (pamlsek pro psa, horký čaj, slunečnice na okně, mléko pro kočku,
 *   dědeček pouštějící draka).
 *
 * **Délka možností.** Distraktory se u každé úlohy drží délkou blízko klíči,
 * jinak by stačilo hádat „nejdelší je správně". Hlídá to `zkontroluj()` níž a
 * padá už při generování. Nejdražší to bylo u L3: vyprávění, které obrázek
 * vynechá, je přirozeně kratší než úplné, takže se muselo rozepsat jinde.
 *
 * **Jména a příběhy jsou vymyšlené**, ale děje se v nich jen to, co druhák
 * sám zná — ztracený míč, sněhulák, semínko v květináči, kočka na stromě,
 * drak na kopci.
 */
import type { TopicMetadata, PracticeTask, TaskVisual } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ── Kritik uvnitř souboru ────────────────────────────────────────────────────
// Generátor a kontrola jsou oddělené: `zkontroluj` nezná záměr úlohy, dívá se
// jen na hotový výsledek. Padá hlasitě — vadná úloha se nemá dostat před dítě
// ani v dev náhledu.

/** Nejdelší možnost nesmí být o víc než tolik procent delší než nejkratší. */
const MAX_ROZPTYL_DELKY = 0.6;

/** Nejvyšší počet slov v zadání pro 2. ročník (audit `sentence_complexity`). */
const MAX_SLOV_V_ZADANI = 12;

/**
 * Srovná text na podobu, ve které se dá porovnávat únik: malá písmena, bez
 * interpunkce a uvozovek, jedna mezera mezi slovy.
 *
 * ⚠️ Bez téhle normalizace kontrola mlčí právě o tom, co má hlídat: v
 * sousedním tématu jí prošlo pět úniků, protože nápověda nesla „Dobrou noc"
 * a klíč „Dobrou noc." — lišily se tečkou (`SESSION_HANDOFF.md` §4).
 */
const bezInterpunkce = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:…„“"'’\-–—()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function zkontroluj(t: PracticeTask, kde: string): PracticeTask {
  const o = t.options ?? [];
  if (o.length !== 4) throw new Error(`${kde}: možností je ${o.length}, mají být 4`);
  if (new Set(o).size !== 4) throw new Error(`${kde}: dvě možnosti jsou shodné`);
  if (!o.includes(t.correctAnswer)) throw new Error(`${kde}: klíč není mezi možnostmi`);
  if (!t.hints || t.hints.length < 2) throw new Error(`${kde}: chybí dvoustupňová nápověda`);
  if (t.hints[0] === t.hints[1]) throw new Error(`${kde}: obě nápovědy jsou stejné`);
  if (!t.explanation) throw new Error(`${kde}: chybí vysvětlení`);
  for (const m of o) {
    if (m === t.correctAnswer) continue;
    if (!t.optionFeedback?.[m]) throw new Error(`${kde}: distraktor „${m}“ nemá zpětnou vazbu`);
  }
  for (const h of t.hints) {
    if (bezInterpunkce(h).includes(bezInterpunkce(t.correctAnswer))) {
      throw new Error(`${kde}: nápověda prozrazuje klíč („${t.correctAnswer}“)`);
    }
  }
  const delky = o.map((m) => m.length);
  const min = Math.min(...delky), max = Math.max(...delky);
  if (max > min * (1 + MAX_ROZPTYL_DELKY)) {
    throw new Error(`${kde}: možnosti se liší délkou ${min}–${max} znaků, dá se hádat`);
  }
  const slov = t.question.trim().split(/\s+/).length;
  if (slov > MAX_SLOV_V_ZADANI) {
    throw new Error(`${kde}: zadání má ${slov} slov, pro 2. ročník je strop ${MAX_SLOV_V_ZADANI}`);
  }
  // Osnova je podstata úlohy — bez pásu by zadání nemělo o čem mluvit.
  if (!t.visual || t.visual.kind !== "story_strip") {
    throw new Error(`${kde}: chybí obrázková osnova (visual story_strip)`);
  }
  // Pravidlo všech obrázků: obrázek nenese odpověď (`TaskVisual.tsx`).
  for (const f of t.visual.frames) {
    if (f.caption === t.correctAnswer) {
      throw new Error(`${kde}: klíč „${t.correctAnswer}“ je napsaný v pásu osnovy`);
    }
  }
  return t;
}

function uloha(
  q: string,
  a: string,
  d: [string, string][],
  h: [string, string],
  e: string,
  visual: TaskVisual,
  emoji: string,
): PracticeTask {
  if (d.length !== 3) throw new Error(`Úloha „${q}“ nemá tři chybné možnosti`);
  // `choice()` dolepí k velké nápovědě obecné věty („Nejdřív škrtni možnost,
  // která s otázkou vůbec nesouvisí."), dokud není aspoň o pětinu delší než
  // malá — kvůli pravidlu auditu `hint_progression`. U podrobných nápověd to
  // dává nesmysl: po konkrétním „vyřaď tyhle dvě možnosti" přijde obecné
  // „nejdřív škrtni tu, která s otázkou nesouvisí". V sousedním tématu to
  // našel až náhled v prohlížeči, ve čtrnácti úlohách. Řeší se to tak, že
  // velká nápověda je delší sama — a tenhle guard to vynucuje.
  if (h[1].length < h[0].length * 1.2) {
    throw new Error(
      `${q}: velká nápověda je kratší než 1,2× malá (${h[0].length} → ${h[1].length}), choice() k ní dolepí obecné věty`,
    );
  }
  const wrong = d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  const t = { ...choice(q, a, wrong, { hints: h, explanation: e }), visual, emoji };
  return zkontroluj(t, q);
}

// ─────────────────────────────────────────────────────────────────────────────
// Slovníček pořadí
// ─────────────────────────────────────────────────────────────────────────────
// Záměrně slovy, ne číslicemi. Číslice s podstatným jménem by se podle
// `CLAUDE.md` musela ohýbat přes `czechGrammar`, a druhák navíc čte „ke
// čtvrtému obrázku" snáz než „ke 4. obrázku".

/**
 * Možnosti v L1: odpovědí je pořadí, ne popisek z obrázku.
 *
 * ⚠️ „ke čtvrtému", ne „k čtvrtému" — předložka se před `č` vokalizuje. Platí
 * i všude jinde, kde se tenhle řetězec dosazuje do věty, proto se používá
 * `KAM[i]` celé a ne jen řadová číslovka s ručně dopsaným „k".
 */
const KAM: [string, string, string, string] = [
  "k prvnímu obrázku",
  "k druhému obrázku",
  "k třetímu obrázku",
  "ke čtvrtému obrázku",
];

// Pády řadové číslovky. Který kam patří, rozhoduje předložka ve větě —
// „na prvním obrázku" (6. pád), „z prvního obrázku" (2. pád), „na první
// obrázek" (4. pád). Dosadit špatný tvar je tiché zkomolení: typecheck ani
// test obsahu si ho nevšimnou, protože řetězec vznikne až za běhu.
// První verze tohohle souboru měla ve zpětné vazbě „Na prvnímu obrázku" a
// našel to až náhled v prohlížeči. Hlídá to teď `vypraveni-osnova.test.ts`.
const PORADI_LOK = ["prvním", "druhém", "třetím", "čtvrtém"];
const PORADI_GEN = ["prvního", "druhého", "třetího", "čtvrtého"];
const PORADI_AKUZ = ["první", "druhý", "třetí", "čtvrtý"];

// ─────────────────────────────────────────────────────────────────────────────
// Banka příběhů
// ─────────────────────────────────────────────────────────────────────────────

interface Obrazek {
  emoji: string;
  /** Pár slov pod obrázkem v pásu osnovy. */
  popis: string;
  /** Věta, kterou se ten obrázek vypráví. Nejvýš sedm slov (2. ročník). */
  veta: string;
  /**
   * Co na obrázku hledat — jde do nápovědy za dvojtečku, takže to může být
   * jakékoli jmenné spojení a nemusí se shodovat s „je/jsou".
   *
   * ⚠️ Nesmí prozradit **pořadí**: v L1 je klíčem právě pořadí, takže
   * „obrázek vlevo" nebo „hned na začátku" by byl únik.
   */
  hledej: string;
}

interface Pribeh {
  /** V 6. padě, dvě slova — jde do zadání, aby byla otázka unikátní. */
  oCem: string;
  emoji: string;
  obrazky: [Obrazek, Obrazek, Obrazek, Obrazek];
  /** Věta, která se dá říct, ale v osnově pro ni není obrázek (L2b). */
  mimoOsnovu: string;
  /** Totéž jmenným spojením, do vysvětlení. */
  mimoProc: string;
  /** L3a — celé vyprávění, které osnovu dodrží, a tři, která ji poruší. */
  prevypraveni: { klic: string; chyby: [string, string][] };
  /** L3b — klíčem je popisek čtvrtého obrázku, pás ho proto nekreslí. */
  konec: { chyby: [string, string][] };
  /** L3c — jméno celé osnovy. */
  nazev: { klic: string; chyby: [string, string][] };
}

const PRIBEHY: Pribeh[] = [
  {
    oCem: "ztraceném míči",
    emoji: "⚽",
    obrazky: [
      {
        emoji: "⚽",
        popis: "míč na hřišti",
        veta: "Kluci si na hřišti hráli s míčem.",
        hledej: "míč, se kterým si kluci hrají",
      },
      {
        emoji: "🌳",
        popis: "míč v křoví",
        veta: "Míč zapadl do hustého křoví.",
        hledej: "husté křoví",
      },
      {
        emoji: "🐕",
        popis: "pes ho vytáhl",
        veta: "Pes Bobík vytáhl míč z křoví.",
        hledej: "pes, který míč vytáhl",
      },
      {
        emoji: "😀",
        popis: "kluci hrají dál",
        veta: "Kluci Bobíkovi zatleskali a hráli dál.",
        hledej: "kluci, kteří tleskají",
      },
    ],
    mimoOsnovu: "Kluci si pak koupili zmrzlinu.",
    mimoProc: "Zmrzlina po hře",
    prevypraveni: {
      klic: "Kluci hráli s míčem. Zapadl do křoví. Pes ho vytáhl. Hráli dál.",
      chyby: [
        [
          "Pes vytáhl míč z křoví. Kluci si hráli. Míč zapadl. Hráli dál.",
          "Začíná psem, i když ten je v osnově až třetí.",
        ],
        [
          "Kluci hráli s míčem. Zapadl do hustého křoví. Potom hráli dál.",
          "Pes, který míč vytáhl, se tu vůbec nevypráví.",
        ],
        [
          "Kluci hráli s míčem. Zapadl do křoví. Pes ho vytáhl. Šli domů.",
          "Osnova končí hrou, ne odchodem domů.",
        ],
      ],
    },
    konec: {
      chyby: [
        ["pes dostal pamlsek", "Pamlsek v osnově není a hra by tím nedopadla."],
        ["míč zůstal v křoví", "To už v osnově bylo a třetí obrázek to vyřešil."],
        ["kluci jdou domů", "Pak by příběh skončil bez hry, i když míč je zpátky."],
      ],
    },
    nazev: {
      klic: "Jak pes zachránil míč",
      chyby: [
        ["Jak kluci přišli o míč", "O konci, kdy je míč zpátky, tohle nic neříká."],
        ["Pes Bobík v křoví", "Mluví jen o jednom obrázku, zbytek osnovy vynechá."],
        ["Hraní na hřišti", "Tohle by se dalo dát skoro každé osnově o hraní."],
      ],
    },
  },
  {
    oCem: "stavbě sněhuláka",
    emoji: "⛄",
    obrazky: [
      {
        emoji: "❄️",
        popis: "v noci napadl sníh",
        veta: "V noci napadl sníh na zahradu.",
        hledej: "sníh, co napadl v noci",
      },
      {
        emoji: "⛄",
        popis: "velká koule",
        veta: "Děti venku válely velkou kouli.",
        hledej: "velká sněhová koule",
      },
      {
        emoji: "🥕",
        popis: "mrkev na nos",
        veta: "Sněhulák dostal místo nosu mrkev.",
        hledej: "mrkev místo nosu",
      },
      {
        emoji: "📷",
        popis: "foto u sněhuláka",
        veta: "Maminka děti u sněhuláka vyfotila.",
        hledej: "fotoaparát v ruce maminky",
      },
    ],
    mimoOsnovu: "Odpoledne si pustily pohádku.",
    mimoProc: "Pohádka odpoledne",
    prevypraveni: {
      klic: "V noci napadl sníh. Děti válely kouli. Dostal mrkev. Maminka je vyfotila.",
      chyby: [
        [
          "Děti válely kouli. V noci napadl sníh. Dostal mrkev. Maminka je vyfotila.",
          "Koule se tu válí dřív, než vůbec napadne sníh.",
        ],
        [
          "V noci napadl sníh. Děti venku válely velkou kouli. Maminka je vyfotila.",
          "Mrkev místo nosu se tu vůbec nevypráví.",
        ],
        [
          "V noci napadl sníh. Děti válely kouli. Dostal mrkev. Pak šly na čaj.",
          "Osnova končí fotkou, ne čajem.",
        ],
      ],
    },
    konec: {
      chyby: [
        ["děti pijí horký čaj", "O čaji v osnově není ani slovo."],
        ["sněhulák se rozpadl", "Sněhulák je právě hotový, rozpadnout se nemá."],
        ["mrkev snědl zajíc", "Mrkev je na obrázku na nose a tam taky zůstane."],
      ],
    },
    nazev: {
      klic: "Stavba sněhuláka",
      chyby: [
        ["Jak napadl sníh", "To je jen první obrázek, sněhulák v tom chybí."],
        ["Mrkev místo nosu", "Mluví jen o jednom obrázku z celé osnovy."],
        ["Zima na zahradě", "Tohle sedí na každou zimní osnovu, nejen na tuhle."],
      ],
    },
  },
  {
    oCem: "Aniččině slunečnici",
    emoji: "🌻",
    obrazky: [
      {
        emoji: "🌱",
        popis: "zaseté semínko",
        veta: "Anička zasela do květináče semínko.",
        hledej: "semínko a květináč",
      },
      {
        emoji: "💧",
        popis: "zalévání vodou",
        veta: "Každé ráno ho polila vodou.",
        hledej: "voda na zalévání",
      },
      {
        emoji: "🌻",
        popis: "vysoká slunečnice",
        veta: "Z květináče vyrostla vysoká slunečnice.",
        hledej: "vysoká rostlina se žlutým květem",
      },
      {
        emoji: "🏫",
        popis: "cesta do školy",
        veta: "Anička slunečnici odnesla do školy.",
        hledej: "škola, kam to Anička nese",
      },
    ],
    mimoOsnovu: "Ve škole byla hodina zpěvu.",
    mimoProc: "Hodina zpěvu ve škole",
    prevypraveni: {
      klic: "Anička zasela semínko. Každý den ho zalévala. Vyrostla slunečnice. Odnesla ji do školy.",
      chyby: [
        [
          "Anička zasela semínko. Vyrostla slunečnice. Každý den ji zalévala. Odnesla ji do školy.",
          "Slunečnice tu vyroste dřív, než ji Anička zalévá.",
        ],
        [
          "Anička zasela semínko. Vyrostla vysoká slunečnice. Pak ji hrdě odnesla do školy.",
          "Zalévání každé ráno se tu vůbec nevypráví.",
        ],
        [
          "Anička zasela semínko. Každý den ho zalévala. Vyrostla slunečnice. Dala ji mamince.",
          "Osnova končí cestou do školy, ne darem mamince.",
        ],
      ],
    },
    konec: {
      chyby: [
        ["slunečnice na okně", "O okně v osnově není ani slovo."],
        ["semínko uhynulo", "Slunečnice už na třetím obrázku vyrostla."],
        ["nový květináč", "Druhý květináč osnova nikde nekreslí."],
      ],
    },
    nazev: {
      klic: "Jak vyrostla slunečnice",
      chyby: [
        ["Jak Anička šla do školy", "To je jen poslední obrázek osnovy."],
        ["Semínko v květináči", "To je jen začátek, slunečnice v tom chybí."],
        ["Co roste v zahradě", "V osnově roste slunečnice v květináči, ne na zahradě."],
      ],
    },
  },
  {
    oCem: "kočce Míně",
    emoji: "🐈",
    obrazky: [
      {
        emoji: "🐈",
        popis: "kočka na stromě",
        veta: "Kočka Mína vylezla na vysoký strom.",
        hledej: "kočka vysoko mezi větvemi",
      },
      {
        emoji: "😿",
        popis: "bojí se slézt",
        veta: "Dolů se jí slézt nechtělo.",
        hledej: "uplakaná, vyděšená kočka",
      },
      {
        emoji: "🪜",
        popis: "tatínek nese štafle",
        veta: "Tatínek přinesl ze dvora štafle.",
        hledej: "štafle, které někdo nese",
      },
      {
        emoji: "🏠",
        popis: "kočka je doma",
        veta: "Mína pak doma spala v křesle.",
        hledej: "křeslo a spící kočka",
      },
    ],
    mimoOsnovu: "Mína má nejradši konzervu.",
    mimoProc: "Oblíbená rybí konzerva",
    prevypraveni: {
      klic: "Mína vylezla na strom. Bála se slézt. Tatínek přinesl štafle. Spala doma v křesle.",
      chyby: [
        [
          "Tatínek přinesl štafle. Mína vylezla na strom. Bála se slézt. Spala doma v křesle.",
          "Štafle jsou tu dřív, než Mína vůbec vyleze na strom.",
        ],
        [
          "Mína vylezla na strom. Dolů se jí slézt nechtělo. Potom spala doma v křesle.",
          "Tatínek se štaflemi se tu vůbec nevypráví.",
        ],
        [
          "Mína vylezla na strom. Bála se slézt. Tatínek přinesl štafle. Dostala konzervu.",
          "Osnova končí spánkem v křesle, ne konzervou.",
        ],
      ],
    },
    konec: {
      chyby: [
        ["Mína dostala mléko", "O mléku v osnově není ani slovo."],
        ["kočka zůstala nahoře", "Pak by se nic nevyřešilo a štafle by byly k ničemu."],
        ["tatínek leze výš", "Tatínek nese štafle, lézt po stromě nemusí."],
      ],
    },
    nazev: {
      klic: "Jak Mína slezla ze stromu",
      chyby: [
        ["Jak Mína vylezla na strom", "To je jen začátek, osnova pokračuje až domů."],
        ["Tatínek a jeho štafle", "Mluví jen o jednom obrázku z osnovy."],
        ["Kočka spí v křesle", "To je jen poslední obrázek, zbytek vynechá."],
      ],
    },
  },
  {
    oCem: "papírovém drakovi",
    emoji: "🪁",
    obrazky: [
      {
        emoji: "🪁",
        popis: "Tomáš nese draka",
        veta: "Tomáš nesl na kopec draka.",
        hledej: "papírový drak v rukou",
      },
      {
        emoji: "💨",
        popis: "vítr draka zvedl",
        veta: "Silný vítr draka zvedl nad stromy.",
        hledej: "vítr, který zvedá draka",
      },
      {
        emoji: "🌲",
        popis: "drak uvízl ve větvích",
        veta: "Drak se zamotal do větví.",
        hledej: "větve, ve kterých drak visí",
      },
      {
        emoji: "🤝",
        popis: "dědeček ho sundal",
        veta: "Dědeček draka opatrně sundal dolů.",
        hledej: "dědeček, který pomáhá",
      },
    ],
    mimoOsnovu: "Tomáš má doma druhého draka.",
    mimoProc: "Druhý drak doma",
    prevypraveni: {
      klic: "Tomáš nesl draka na kopec. Vítr ho zvedl. Drak uvízl ve větvích. Dědeček ho sundal.",
      chyby: [
        [
          "Drak uvízl ve větvích. Tomáš nesl draka na kopec. Vítr ho zvedl. Dědeček ho sundal.",
          "Drak tu uvízne dřív, než ho Tomáš vynese na kopec.",
        ],
        [
          "Tomáš nesl draka na kopec. Silný vítr ho zvedl nad stromy. Dědeček ho sundal.",
          "Drak zamotaný do větví se tu vůbec nevypráví.",
        ],
        [
          "Tomáš nesl draka na kopec. Vítr ho zvedl. Drak uvízl ve větvích. Koupil nového.",
          "Osnova končí záchranou draka, ne nákupem nového.",
        ],
      ],
    },
    konec: {
      chyby: [
        ["dědeček pouští draka", "Pouštět draka ještě nejde, visí ve větvích."],
        ["drak zůstal nahoře", "Pak by příběh zůstal nedokončený, drak pořád ve větvích."],
        ["Tomáš jde domů", "Drak by zůstal ve větvích a nic by se nevyřešilo."],
      ],
    },
    nazev: {
      klic: "Záchrana papírového draka",
      chyby: [
        ["Jak vítr zvedl draka", "To je jen jeden obrázek z prostředka osnovy."],
        ["Dědeček ve větvích", "Ve větvích uvízl drak, ne dědeček."],
        ["Tomáš jde na kopec", "To je jen začátek, osnova pokračuje dál."],
      ],
    },
  },
];

/** Pás celé osnovy. */
function pas(p: Pribeh): TaskVisual {
  return {
    kind: "story_strip",
    frames: p.obrazky.map((o) => ({ emoji: o.emoji, caption: o.popis })),
  };
}

/** Pás bez posledního obrázku, s otazníkem na jeho místě. */
function pasBezKonce(p: Pribeh): TaskVisual {
  return {
    kind: "story_strip",
    frames: p.obrazky.slice(0, 3).map((o) => ({ emoji: o.emoji, caption: o.popis })),
    unknown: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// L1 — rozpoznání
// ─────────────────────────────────────────────────────────────────────────────

/**
 * L1a — ke kterému obrázku věta patří.
 *
 * Odpovědí je **pořadí**, ne popisek z pásu. Kdyby se odpovídalo popiskem,
 * dítě by ho z obrázku opsalo; takhle musí osnovu projít a to místo spočítat.
 */
function kamPatriTask(p: Pribeh, i: number): PracticeTask {
  const o = p.obrazky[i];
  const chyby = p.obrazky
    .map((jiny, j) => [j, jiny] as const)
    .filter(([j]) => j !== i)
    .map(([j, jiny]) => [KAM[j], `Na ${PORADI_LOK[j]} obrázku je tohle: ${jiny.popis}. O tom ta věta nemluví.`] as [string, string]);

  return uloha(
    `Kam v osnově patří věta „${o.veta}“?`,
    KAM[i],
    chyby as [string, string][],
    // ⚠️ V nápovědě tady vědomě není slovo „obrázek" ani pořadová číslovka.
    // Klíčem je „k druhému obrázku", takže `hint_leak` v `audit:content` bere
    // „obrázku" za doslovné prozrazení odpovědi — a nahlásil to u všech deseti
    // vzorků. Je to planý poplach (to slovo nesou **všechny čtyři** možnosti,
    // takže nerozlišuje nic, a test to hlídá), jenže nález, který se musí
    // posuzovat při každém běhu, nikomu neslouží. Nápověda proto mluví o
    // „políčkách" pásu — stejně konkrétně, bez kolize.
    [
      `Ve větě se mluví o jedné věci z osnovy: ${o.hledej}.`,
      `Projdi osnovu zleva doprava a u každého políčka se podívej, jestli je v něm tohle: ${o.hledej}. U tří políček to nenajdeš, u jednoho ano — a to pak jen spočítej, kolikáté v pásu je.`,
    ],
    `Osnova se čte zleva doprava a každý obrázek má svou větu. Když najdeš obrázek, o kterém ta věta mluví, stačí spočítat, kolikátý v pásu stojí.`,
    pas(p),
    o.emoji,
  );
}

/** L1b — první a poslední věta vyprávění. */
function okrajTask(p: Pribeh, konec: boolean): PracticeTask {
  const i = konec ? 3 : 0;
  const chyby = p.obrazky
    .map((jiny, j) => [j, jiny] as const)
    .filter(([j]) => j !== i)
    .map(
      ([j, jiny]) =>
        [
          jiny.veta,
          konec
            ? `Tahle věta patří ${KAM[j]} a za ním osnova ještě pokračuje.`
            : `Tahle věta patří ${KAM[j]} a ten je až dál vpravo.`,
        ] as [string, string],
    );

  return uloha(
    konec ? `V osnově o ${p.oCem}: kterou větou skončíš?` : `V osnově o ${p.oCem}: kterou větou začneš?`,
    p.obrazky[i].veta,
    chyby as [string, string][],
    konec
      ? [`Vyprávění o ${p.oCem} končí tím obrázkem úplně vpravo.`, `Podívej se v osnově o ${p.oCem} jen na ten obrázek úplně vpravo a mezi větami najdi tu, která mluví právě o něm. Ostatní tři patří k obrázkům, které stojí dřív.`]
      : [`Vyprávění o ${p.oCem} začíná tím obrázkem úplně vlevo.`, `Podívej se v osnově o ${p.oCem} jen na ten obrázek úplně vlevo a mezi větami najdi tu, která mluví právě o něm. Ostatní tři patří k obrázkům, které jsou až dál vpravo.`],
    konec
      ? `Vyprávění jde osnovou od prvního obrázku k poslednímu, takže končí tím vpravo. Pořadí si nevybíráš — osnova ho má dané.`
      : `Vyprávění jde osnovou od prvního obrázku k poslednímu, takže začíná tím vlevo. Pořadí si nevybíráš — osnova ho má dané.`,
    pas(p),
    p.emoji,
  );
}

function genL1(): PracticeTask[] {
  const t: PracticeTask[] = [];
  for (const p of PRIBEHY) {
    for (let i = 0; i < 4; i++) t.push(kamPatriTask(p, i));
    t.push(okrajTask(p, false));
    t.push(okrajTask(p, true));
  }
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// L2 — aplikace
// ─────────────────────────────────────────────────────────────────────────────

/**
 * L2a — co se vypráví po obrázku, u kterého stojím.
 *
 * Tři chyby, které druháci dělají doopravdy: vrátit se k obrázku, který už
 * vyprávěli; skočit dopředu a jeden obrázek vynechat; přidat něco, co v
 * osnově vůbec není.
 */
function coDalTask(p: Pribeh, pos: number): PracticeTask {
  // Dvojice (index obrázku, jaká je to chyba). U posledního kroku už není kam
  // skočit dopředu, takže se místo přeskoku nabízí druhý návrat dozadu.
  const zpatky = pos === 2 ? 2 : 0;
  const dopredu = pos === 2 ? 1 : 3;
  const chyby: [string, string][] = [
    [
      p.obrazky[zpatky].veta,
      `Tahle věta patří ${KAM[zpatky]}, a ten už máš za sebou.`,
    ],
    [
      p.obrazky[dopredu].veta,
      pos === 2
        ? `Tahle věta patří ${KAM[dopredu]}, a ten už máš za sebou.`
        : `Tahle věta patří ${KAM[dopredu]} — tím bys obrázek mezi nimi přeskočil.`,
    ],
    [p.mimoOsnovu, `Takový obrázek v osnově vůbec není.`],
  ];

  return uloha(
    `V osnově o ${p.oCem} jsi vyprávěl ${PORADI_AKUZ[pos]} obrázek. Co dál?`,
    p.obrazky[pos + 1].veta,
    chyby,
    [
      `V osnově o ${p.oCem} se posuň z ${PORADI_GEN[pos]} obrázku o jeden doprava.`,
      `Ukaž si v osnově o ${p.oCem} prstem na ${PORADI_AKUZ[pos]} obrázek a pak na ten hned vedle vpravo. Mezi větami najdi tu, která mluví právě o něm — ostatní se buď vracejí dozadu, nebo skáčou dopředu, nebo v osnově obrázek nemají.`,
    ],
    `Vyprávění podle osnovy nesmí ani uhnout, ani přeskočit. Po obrázku, u kterého stojíš, přijde ten hned vpravo — a nic, co v osnově není.`,
    pas(p),
    p.obrazky[pos + 1].emoji,
  );
}

/** L2b — věta, pro kterou v osnově není obrázek. */
function nehodiSeTask(p: Pribeh): PracticeTask {
  const chyby = [0, 2, 3].map(
    (j) => [p.obrazky[j].veta, `Tahle věta patří ${KAM[j]} osnovy, takže do vyprávění patří.`] as [string, string],
  );

  return uloha(
    `Která věta se do osnovy o ${p.oCem} nehodí?`,
    p.mimoOsnovu,
    chyby as [string, string][],
    [
      `Tři věty se dají najít na obrázcích osnovy o ${p.oCem}. Jedna ne.`,
      `Zkus u každé věty ukázat prstem na obrázek, o kterém mluví. U tří to půjde, u jedné v osnově o ${p.oCem} nenajdeš nic — a právě ta se do vyprávění nehodí.`,
    ],
    `Osnova říká, co se bude vyprávět. ${p.mimoProc} by klidně mohla být pravda, ale na žádném obrázku není — do vyprávění podle téhle osnovy tedy nepatří.`,
    pas(p),
    p.emoji,
  );
}

function genL2(): PracticeTask[] {
  const t: PracticeTask[] = [];
  for (const p of PRIBEHY) {
    for (let pos = 0; pos < 3; pos++) t.push(coDalTask(p, pos));
    t.push(nehodiSeTask(p));
  }
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// L3 — přenos
// ─────────────────────────────────────────────────────────────────────────────

/** L3a — celé vyprávění proti celé osnově. */
function prevypraveniTask(p: Pribeh): PracticeTask {
  return uloha(
    `Které vyprávění jde přesně podle osnovy o ${p.oCem}?`,
    p.prevypraveni.klic,
    p.prevypraveni.chyby,
    [
      `Porovnej každé vyprávění s osnovou o ${p.oCem} obrázek po obrázku.`,
      `Hledej tři vady: jedno vyprávění má obrázky v jiném pořadí, jedno jeden obrázek vynechá a jedno si na konci vymyslí něco, co v osnově o ${p.oCem} není. Zbyde jediné, které osnovu dodrží celou.`,
    ],
    `Vyprávění podle osnovy drží tři věci: všechny obrázky, jejich pořadí a nic navíc. Stačí porušit jednu z nich a osnově už vyprávění neodpovídá.`,
    pas(p),
    p.emoji,
  );
}

/**
 * L3b — jak osnova skončí.
 *
 * Pás tady má jen tři obrázky a na místě čtvrtého otazník, protože klíčem je
 * právě popisek toho čtvrtého. S celým pásem by si ho dítě přečetlo.
 */
function konecTask(p: Pribeh): PracticeTask {
  return uloha(
    `Jak osnova o ${p.oCem} skončí?`,
    p.obrazky[3].popis,
    p.konec.chyby,
    [
      `Poslední obrázek osnovy o ${p.oCem} chybí. Rozmysli, jak to dopadne.`,
      `Tři možnosti na obrázky před sebou nenavazují — buď nechají příběh nedokončený, nebo začnou něco úplně nového. Vyber tu, která to, co v osnově o ${p.oCem} začalo, dovede do konce.`,
    ],
    `Osnova vypráví celý příběh — od toho, co se stalo, až po to, jak to dopadlo. Poslední obrázek proto musí dokončit přesně to, co začaly obrázky před ním.`,
    pasBezKonce(p),
    p.emoji,
  );
}

/** L3c — jméno celé osnovy. */
function nazevTask(p: Pribeh): PracticeTask {
  return uloha(
    `Jak se dá pojmenovat osnova o ${p.oCem}?`,
    p.nazev.klic,
    p.nazev.chyby,
    [
      `Jméno osnovy o ${p.oCem} musí sedět na všechny čtyři obrázky.`,
      `Dvě možnosti mluví jen o jednom obrázku z osnovy o ${p.oCem} a jedna je tak obecná, že by se dala dát skoro čemukoli. Vyber tu, ze které se pozná celý příběh od začátku do konce.`,
    ],
    `Jméno osnovy musí platit pro celý příběh. Když mluví jen o jednom obrázku, je moc úzké; když by se dalo dát skoro každé osnově, je moc obecné.`,
    pas(p),
    p.emoji,
  );
}

function genL3(): PracticeTask[] {
  const t: PracticeTask[] = [];
  for (const p of PRIBEHY) {
    t.push(prevypraveniTask(p));
    t.push(konecTask(p));
    t.push(nazevTask(p));
  }
  return t;
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(genL1());
  if (level === 2) return shuffle(genL2());
  return shuffle(genL3());
}

export const VYPRAVENI_PODLE_OSNOVY: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypraveni-podle-obrazkove-osnovy",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypraveni-podle-obrazkove-osnovy",
    title: "Vyprávění podle obrázkové osnovy",
    studentTitle: "Vyprávěj podle obrázků",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Z obrázků poskládáš příběh — po pořádku, celý a bez vymýšlení.",
    keywords: ["osnova", "vyprávění", "obrázky", "pořadí", "příběh", "začátek", "konec", "děj"],
    goals: [
      "Přiřadit větu k obrázku v osnově a poznat, kolikátý ten obrázek je.",
      "Vědět, že vyprávění jde osnovou zleva doprava — od prvního obrázku k poslednímu.",
      "Nepřeskočit obrázek a nevrátit se k tomu, co už bylo vyprávěné.",
      "Poznat větu, pro kterou v osnově není obrázek.",
      "Posoudit celé vyprávění proti osnově a pojmenovat celý příběh.",
    ],
    boundaries: [
      "Dítě vybírá z možností, nic nepíše ani nevypráví nahlas — sloh jako volný text v aplikaci není.",
      "Osnova má vždy čtyři obrázky; delší se na obrazovku nevejde.",
      "Mluvený pozdrav, prosba a omluva jsou v tématu „Jak to říct“, adresa a přání v tématu „Pohled a dopis“.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Osnova se čte zleva doprava. U každého obrázku si řekni jednu větu — a nic nepřeskakuj.",
      steps: [
        "Projdi osnovu zleva doprava a u každého obrázku si řekni, co na něm vidíš.",
        "Začni vyprávět prvním obrázkem, tím úplně vlevo.",
        "Po každé větě se posuň o jeden obrázek doprava, nikdy ne o dva.",
        "Skonči posledním obrázkem — a nepřidávej nic, co v osnově není.",
      ],
      commonMistake: "Přeskočit obrázek, protože se zdá nedůležitý. Pak posluchač nepochopí, jak se příběh dostal ke konci.",
      example: "Osnova „míč na hřišti → míč v křoví → pes ho vytáhl → kluci hrají dál“ se vypráví čtyřmi větami. Když vynecháš psa, nikdo nepochopí, jak se míč dostal zpátky.",
    },
  },
];
