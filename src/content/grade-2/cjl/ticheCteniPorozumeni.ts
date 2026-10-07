/**
 * Tiché čtení a porozumění obsahu — 2. ročník.
 *
 * RVP uzel `g2-cjl-komunikacni-a-slohova-vychova-cteni-s-porozumenim-tiche-
 * cteni-a-porozumeni-obsahu`. Poslední z pěti uzlů okruhu „sloh a čtení",
 * které zbyly po opravě `rvpNodeId` (`PROJECT_STATUS.md` §6).
 *
 * **Čím se liší od sousedního „Vyznej se v textu"** (`orientaceVTextu.ts`,
 * uzel *orientace v textu — nadpis, odstavec*): tam jde o **tvar** textu —
 * kolik má vět, kde začíná odstavec, který nadpis se k němu hodí. Tady jde
 * o **obsah** — co se v textu stalo, proč a co z toho plyne. Stejný text,
 * jiná otázka; překryv je proto žádný, ne malý.
 *
 * **Text je zadání, ne ozdoba.** Proto nestojí v otázce, ale ve vlastním
 * druhu `TaskVisual` — `text_passage` (`src/lib/types.ts`,
 * `src/components/TaskVisual.tsx`). Dva důvody:
 * 1. Vepsaný do otázky by dal zadání o čtyřiceti slovech. Audit
 *    `sentence_complexity` povoluje pro 2. ročník dvanáct a všechna zadání
 *    tady se pod ten strop vejdou.
 * 2. Oddělený text a pod ním otázka říkají samy, co se má dělat: přečíst
 *    potichu celé, teprve pak hledat odpověď. To je ta dovednost.
 *
 * ⚠️ **Obrácené pravidlo o obrázku.** Ostatní druhy `TaskVisual` nesmějí nést
 * odpověď. Tenhle ji nést musí, jinak by z textu nešlo nic vyčíst. Hlídá se
 * proto druhá strana: **žádná možnost nesmí být doslovná věta z textu**
 * (`zkontroluj` níž). Bez toho by úloha měřila hledání shody — dítě by
 * očima našlo stejně vypadající řádek a nemuselo rozumět ani slovo.
 *
 * Kalibrace úrovní:
 * - **L1 vyhledání** — údaj je v textu napsaný. Stačí najít tu správnou větu
 *   (co si Lenka vzala, kam dědeček pověsil budku). Jeden krok, nic se
 *   nedomýšlí.
 * - **L2 souvislost** — odpověď leží mezi dvěma větami: proč se něco stalo,
 *   co bylo dřív a co potom, co zastupuje zájmeno, co znamená slovo v téhle
 *   větě („třída" jsou děti, ne místnost).
 * - **L3 vyvození** — v textu to napsané **není**: které tvrzení z textu
 *   plyne, co se z něj naopak nedozvíš a jak se to nejspíš sešlo dál. Dítě
 *   musí držet celý text v hlavě, ne jednu větu.
 *
 * **Pět textů, devět úloh z každého.** Čtení se podle `CONTENT_AUTHORING`
 * má rotovat na víc textech, ne na jednom. Každý text je dlouhý pět vět —
 * tolik druhák potichu přečte, aniž by zapomněl začátek.
 *
 * **Jména a příběhy jsou vymyšlené** a nic se v nich nestane, co by dítě
 * nezažilo: ztracená rukavice, ptačí budka, oběd u babičky, spadlý řetěz,
 * déšť na výletě.
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
 * Srovná text na podobu, ve které se dá porovnávat shoda: malá písmena, bez
 * interpunkce a uvozovek, jedna mezera mezi slovy.
 *
 * ⚠️ Bez téhle normalizace kontrola mlčí právě o tom, co má hlídat: v
 * sousedním tématu jí prošlo pět úniků, protože nápověda nesla „Dobrou noc"
 * a klíč „Dobrou noc." — lišily se tečkou (`SESSION_HANDOFF.md` §4).
 */
const srovnej = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:…„“"'’\-–—()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Rozdělí text na věty podle `.` `?` `!`. */
const naVety = (text: string): string[] =>
  text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);

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
    if (srovnej(h).includes(srovnej(t.correctAnswer))) {
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
  if (!t.visual || t.visual.kind !== "text_passage") {
    throw new Error(`${kde}: chybí čtený text (visual text_passage)`);
  }
  // `TextPassage` při nesmyslném počtu odstavců vykreslí `null` — stejně jako
  // ostatní druhy obrázku. U nich to nevadí, protože obrázek je doplněk
  // zadání. Tady je text zadání **samo**: bez něj by dítě dostalo otázku,
  // na kterou nejde odpovědět. Větev se proto nesmí dát spustit odsud —
  // hlídá to tahle podmínka, ne naděje.
  if (t.visual.paragraphs.length < 1 || t.visual.paragraphs.length > 4) {
    throw new Error(`${kde}: text má ${t.visual.paragraphs.length} odstavců, kreslí se jen 1 až 4`);
  }
  if (t.visual.paragraphs.some((p) => !p.trim())) {
    throw new Error(`${kde}: jeden odstavec textu je prázdný`);
  }
  // Nadpis stojí nad textem, takže se čte dřív než otázka. Když v něm klíč
  // stojí, úloha se vyřeší bez čtení textu — a dva nadpisy to doopravdy
  // dělaly („Ztracená rukavice" k otázce, co si Lenka vzala, a „Spadlý řetěz"
  // k otázce, co se stalo na kopci).
  if (t.visual.title && srovnej(t.visual.title).includes(srovnej(t.correctAnswer))) {
    throw new Error(`${kde}: nadpis „${t.visual.title}“ nese klíč „${t.correctAnswer}“`);
  }
  // Obrácené pravidlo o obrázku: text odpověď nést musí, ale možnost nesmí
  // být doslovná věta z textu — jinak se úloha vyřeší hledáním shodného
  // řádku a dítě nemusí rozumět ani slovu.
  const vetyTextu = new Set(t.visual.paragraphs.flatMap(naVety).map(srovnej));
  for (const m of o) {
    if (vetyTextu.has(srovnej(m))) {
      throw new Error(`${kde}: možnost „${m}“ je doslovná věta z textu, stačí hledat shodu`);
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
  // `choice()` dolepí k velké nápovědě obecné věty, dokud není aspoň o pětinu
  // delší než malá (audit `hint_progression`). U podrobných nápověd to dává
  // nesmysl: po konkrétním pokynu přijde obecné „nejdřív škrtni tu, která
  // s otázkou nesouvisí". V tématu o adrese to našel až náhled v prohlížeči,
  // ve čtrnácti úlohách. Velká nápověda proto musí být delší sama.
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
// Banka textů
// ─────────────────────────────────────────────────────────────────────────────

/** Jádro úlohy. Nápovědy se skládají podle druhu úlohy ze `stopa`. */
interface Jadro {
  q: string;
  a: string;
  d: [string, string][];
  /**
   * Krátká stopa do nápovědy — kam se v textu podívat nebo co hledat.
   * Dělá nápovědu konkrétní pro **tu** úlohu; bez ní by všech pět textů
   * mělo u stejného druhu úlohy stejnou nápovědu.
   */
  stopa: string;
  e: string;
}

interface Ctivo {
  nadpis: string;
  emoji: string;
  text: string;
  /** L1 vyhledání · L2 souvislost (proč, pořadí, odkaz) · L3 vyvození. */
  vyhledej: [Jadro, Jadro, Jadro];
  proc: Jadro;
  poradi: Jadro;
  odkaz: Jadro;
  plati: Jadro;
  nedozvis: Jadro;
  vyvod: Jadro;
}

const CTIVA: Ctivo[] = [
  {
    nadpis: "Cesta do školy",
    emoji: "🧤",
    text:
      "Ráno bylo zima. Lenka si vzala rukavice. Cestou do školy jednu ztratila. " +
      "Ve škole měla levou ruku studenou. Odpoledne ji našla u plotu.",
    vyhledej: [
      {
        q: "Co si Lenka ráno vzala?",
        a: "rukavice",
        d: [
          ["přezůvky", "Přezůvky se v textu nikde nepíšou."],
          ["deštník", "Deštník by byl na déšť, ale v textu byla zima, ne déšť."],
          ["čepice", "Čepice v textu není. Lenka si vzala něco na ruce."],
        ],
        stopa: "větu, kde se píše, co si Lenka ráno oblékla",
        e: "Druhá věta textu to říká rovnou: Lenka si vzala rukavice. Nic se nedomýšlí, jen se hledá.",
      },
      {
        q: "Kde Lenka rukavici našla?",
        a: "u plotu",
        d: [
          ["ve škole", "Ve škole jí ruka studila, ale rukavice tam nebyla."],
          ["u branky", "Branka se v textu nikde nepíše."],
          ["na lavičce", "Lavička se v textu nikde nepíše."],
        ],
        stopa: "poslední větu textu, která mluví o odpoledni",
        e: "Odpověď je v poslední větě. Když se ptáš KDE, hledej v textu místo, ne čas ani osobu.",
      },
      {
        q: "Která ruka Lenku studila?",
        a: "levá ruka",
        d: [
          ["pravá ruka", "V textu stojí druhá ruka, ne tahle."],
          ["obě ruce", "Lenka ztratila jednu rukavici, ne obě. Studila ji proto jedna ruka."],
          ["žádná ruka", "Text přímo říká, že jedna ruka studená byla."],
        ],
        stopa: "větu o tom, co se dělo ve škole",
        e: "Čtvrtá věta to říká přesně. Právě takový malý údaj se při rychlém čtení přehlédne — proto se čte potichu a celé.",
      },
    ],
    proc: {
      q: "Proč měla Lenka ve škole studenou ruku?",
      a: "Jednu rukavici cestou ztratila.",
      d: [
        ["Ve třídě měla otevřené okno.", "O okně ve třídě text nic neříká."],
        ["Rukavice si vůbec nevzala.", "Vzala si je — stojí to ve druhé větě."],
        ["Venku ráno hustě sněžilo.", "Text říká jen, že byla zima. O sněhu v něm nic není."],
      ],
      stopa: "třetí větu o cestě do školy se čtvrtou o škole",
      e: "Příčina a následek stojí v textu ve dvou různých větách. Nejdřív se něco stalo cestou, teprve potom se to projevilo ve škole.",
    },
    poradi: {
      q: "Co se stalo jako poslední?",
      a: "Lenka rukavici našla.",
      d: [
        ["Lenka rukavici ztratila.", "To bylo cestou do školy, tedy dřív."],
        ["Lence byla ruka studená.", "To bylo ve škole, tedy ještě před odpolednem."],
        ["Lenka si oblékla rukavice.", "To bylo ráno — úplně na začátku."],
      ],
      stopa: "která věta o rukavici stojí nejníž",
      e: "Text vypráví po pořádku. Co je v něm napsané nejníž, stalo se naposled — nerozhoduje, co je nejdůležitější.",
    },
    odkaz: {
      q: "Co Lenka odpoledne našla?",
      a: "ztracenou rukavici",
      d: [
        ["svoji kamarádku", "O kamarádce text nic neříká."],
        ["cestu do školy", "Cestu Lenka neztratila, šla po ní ráno."],
        ["studenou ruku", "Ruka ji studila ve škole, ale neztratila se."],
      ],
      stopa: "všimni si, co se ztratilo ve třetí větě",
      e: "V poslední větě stojí slovo „ji“. Zastupuje to, co se v textu ztratilo dřív — zájmeno samo nic neříká, musí se dosadit.",
    },
    plati: {
      q: "Které tvrzení podle textu platí?",
      a: "Lenka přišla do školy s jednou rukavicí.",
      d: [
        ["Lenka našla rukavici ve škole.", "Text říká, že ji našla odpoledne u plotu."],
        ["Lenka měla studené obě ruce.", "Studenou měla jen levou ruku."],
        ["Lenka nechala rukavice doma.", "Vzala si je, jen jednu cestou ztratila."],
      ],
      stopa: "Jednu rukavici cestou ztratila, druhou ne.",
      e: "Tahle věta v textu napsaná není, ale plyne z něj: Lenka vyšla se dvěma rukavicemi a jednu cestou ztratila.",
    },
    nedozvis: {
      q: "Co se z textu nedozvíš?",
      a: "Jakou barvu rukavice měly.",
      d: [
        ["Kdy Lenka rukavici ztratila.", "To text říká — cestou do školy."],
        ["Kde Lenka rukavici našla.", "To text říká — u plotu."],
        ["Která ruka ji studila.", "To text říká — levá."],
      ],
      stopa: "O barvě v textu nepadne ani slovo.",
      e: "Text neodpovídá na všechno. Když v něm odpověď není, je správné říct, že se to nedozvíš — ne si ji domyslet.",
    },
    vyvod: {
      q: "Jak se Lenka odpoledne nejspíš cítila?",
      a: "Ulevilo se jí.",
      d: [
        ["Byla pořádně naštvaná.", "Rukavice se našla, zlobit se už nebylo proč."],
        ["Měla velký strach.", "Ztracená rukavice není důvod ke strachu."],
        ["Bylo jí to líto.", "Líto jí mohlo být dopoledne. Odpoledne už byla rukavice zpátky."],
      ],
      stopa: "Odpoledne se ztracená věc našla.",
      e: "O pocitech text nepíše. Vyvodíš je z toho, co se stalo: ztracená věc se našla, a to je úleva.",
    },
  },
  {
    nadpis: "Ptačí budka",
    emoji: "🐦",
    text:
      "Dědeček vyrobil ze dřeva budku. Pověsil ji na starou jabloň. " +
      "Za týden se do ní nastěhovaly sýkorky. Tomáš je pozoroval z okna. Rušit je nesměl.",
    vyhledej: [
      {
        q: "Z čeho dědeček budku vyrobil?",
        a: "ze dřeva",
        d: [
          ["z papíru", "Papírová budka by v dešti nevydržela a v textu není."],
          ["z plechu", "Plech se v textu nikde nepíše."],
          ["z hlíny", "Hlína se v textu nikde nepíše."],
        ],
        stopa: "první větu, která mluví o výrobě",
        e: "Hned první věta říká, z čeho je budka. Když se ptáš Z ČEHO, hledáš materiál.",
      },
      {
        q: "Kam dědeček budku pověsil?",
        a: "na starou jabloň",
        d: [
          ["na vysokou břízu", "Bříza se v textu nikde nepíše."],
          ["na plot u cesty", "Plot se v textu nikde nepíše."],
          ["na zeď domu", "Zeď domu se v textu nikde nepíše."],
        ],
        stopa: "druhou větu, která mluví o pověšení",
        e: "Odpověď je ve druhé větě. Na otázku KAM odpovídá v textu místo, ne to, kdo něco udělal.",
      },
      {
        q: "Odkud Tomáš sýkorky pozoroval?",
        a: "z okna",
        d: [
          ["ze dvora", "Dvůr se v textu nikde nepíše."],
          ["ze stromu", "Na jabloni byla budka, ne Tomáš."],
          ["z balkonu", "Balkon se v textu nikde nepíše."],
        ],
        stopa: "větu, ve které se mluví o Tomášovi",
        e: "Čtvrtá věta to říká rovnou. Jedno slovo v textu stačí na celou odpověď — proto se čte pozorně.",
      },
    ],
    proc: {
      q: "Proč Tomáš sýkorky pozoroval z okna?",
      a: "Nesměl je vyrušit.",
      d: [
        ["Venku pršelo celý týden.", "O dešti text nic neříká."],
        ["Jabloň byla moc vysoká.", "O výšce jabloně text nic neříká."],
        ["Budka byla zamčená.", "Budka není truhla, zamykat se nedá — a text o tom nepíše."],
      ],
      stopa: "poslední větu s větou o pozorování",
      e: "Odpověď leží mezi dvěma větami: Tomáš je pozoroval z okna, protože poslední věta říká, co nesměl.",
    },
    poradi: {
      q: "Co se stalo jako první?",
      a: "Dědeček vyrobil budku.",
      d: [
        ["Sýkorky se nastěhovaly.", "To bylo až za týden, tedy mnohem později."],
        ["Budka visela na jabloni.", "Nejdřív musela budka vzniknout, teprve pak mohla viset."],
        ["Tomáš sýkorky pozoroval.", "Pozorovat je mohl, až když tam byly."],
      ],
      stopa: "která věta o budce stojí nejvýš",
      e: "Text jde po pořádku odshora dolů. Co je napsané nejvýš, stalo se nejdřív.",
    },
    odkaz: {
      q: "Co dědeček pověsil na jabloň?",
      a: "hotovou budku",
      d: [
        ["ptačí hnízdo", "O hnízdě text nic neříká."],
        ["kousek dřeva", "Dřevo bylo materiál. Na jabloň šla až hotová věc."],
        ["starou jabloň", "Jabloň je strom, na který se věšelo."],
      ],
      stopa: "všimni si, co vzniklo v první větě",
      e: "Ve druhé větě stojí slovo „ji“. Zastupuje to, co dědeček v první větě vyrobil.",
    },
    plati: {
      q: "Které tvrzení podle textu platí?",
      a: "V budce bydlely sýkorky.",
      d: [
        ["Sýkorky si budku vyrobily.", "Budku vyrobil dědeček, ne ptáci."],
        ["V budce bydlel dědeček.", "Dědeček budku vyrobil, ale nebydlel v ní."],
        ["Budka zůstala prázdná.", "Za týden se do ní někdo nastěhoval."],
      ],
      stopa: "Nastěhovat se znamená začít někde bydlet.",
      e: "Text neříká „bydlely“, říká „nastěhovaly se“. Pochopit, že to znamená totéž, je přesně porozumění obsahu.",
    },
    nedozvis: {
      q: "Co se z textu nedozvíš?",
      a: "Kolik sýkorek v budce bylo.",
      d: [
        ["Kam dědeček budku pověsil.", "To text říká — na starou jabloň."],
        ["Kdo sýkorky pozoroval.", "To text říká — Tomáš."],
        ["Z čeho byla budka.", "To text říká — ze dřeva."],
      ],
      stopa: "Počet ptáků v textu nikde nestojí.",
      e: "Text mluví o sýkorkách, ale nikde neříká, kolik jich bylo. Číslo, které v textu není, se nedá vyčíst.",
    },
    vyvod: {
      q: "Proč sýkorky Tomáš nerušil?",
      a: "Aby z budky neulétly.",
      d: [
        ["Protože je vůbec neviděl.", "Viděl je — pozoroval je z okna."],
        ["Protože měl zavřené okno.", "Zavřené okno pozorování nebrání a text o něm nepíše."],
        ["Aby mu dědeček nevynadal.", "O dědečkových zákazech text nic neříká."],
      ],
      stopa: "Čerstvě nastěhovaní ptáci jsou plaší.",
      e: "Text říká jen, že rušit nesměl. Proč, to musíš vyvodit: vyplašení ptáci by se z budky odstěhovali.",
    },
  },
  {
    nadpis: "Oběd u babičky",
    emoji: "🍲",
    text:
      "V neděli jely děti k babičce. Babička uvařila bramborovou polévku. " +
      "Káťa si přidala dvakrát. Matěj polévku nejedl. Dal si místo ní chleba.",
    vyhledej: [
      {
        q: "Co babička uvařila?",
        a: "bramborovou polévku",
        d: [
          ["zeleninovou polévku", "Polévka to byla, ale z něčeho jiného."],
          ["houbovou polévku", "Houby se v textu nikde nepíšou."],
          ["rajskou omáčku", "Omáčka se v textu nikde nepíše."],
        ],
        stopa: "druhou větu, která mluví o vaření",
        e: "Druhá věta říká přesně jakou polévku. Nestačí najít slovo „polévka“ — důležité je i to, jaká byla.",
      },
      {
        q: "Kdy děti jely k babičce?",
        a: "v neděli",
        d: [
          ["v sobotu", "V textu stojí jiný den."],
          ["ve středu", "V textu stojí jiný den."],
          ["v pátek", "V textu stojí jiný den."],
        ],
        stopa: "úplně první slova textu",
        e: "Hned první věta začíná časem. Na otázku KDY odpovídá v textu den, ne místo ani jídlo.",
      },
      {
        q: "Kdo si polévku přidal?",
        a: "jenom Káťa",
        d: [
          ["jenom Matěj", "Matěj polévku vůbec nejedl."],
          ["obě děti", "Matěj polévku nejedl, takže si přidávat nemohl."],
          ["babička sama", "O tom, že by si přidala babička, text nic neříká."],
        ],
        stopa: "třetí větu, která mluví o přidávání",
        e: "Třetí věta jmenuje toho, kdo si přidal. Na otázku KDO odpovídá v textu jméno.",
      },
    ],
    proc: {
      q: "Proč si Matěj dal chleba?",
      a: "Polévku jíst nechtěl.",
      d: [
        ["Babička neuvařila dost.", "O nedostatku polévky text nic neříká."],
        ["Káťa snědla celý hrnec.", "Káťa si přidala, ale o celém hrnci text nepíše."],
        ["Chleba měl úplně nejradši.", "Text neříká, co má Matěj nejradši. Říká, co nejedl."],
      ],
      stopa: "čtvrtou větu s pátou",
      e: "Odpověď leží mezi dvěma větami: nejdřív se dozvíš, že polévku nejedl, pak co si dal místo ní.",
    },
    poradi: {
      q: "Co se stalo jako první?",
      a: "Děti jely k babičce.",
      d: [
        ["Babička uvařila polévku.", "Vařila až potom, co se v textu píše dřív."],
        ["Matěj si vzal chleba.", "To je až úplně na konci textu."],
        ["Káťa si přidala.", "Přidat si mohla, až když byla polévka uvařená."],
      ],
      stopa: "která věta o nedělním obědě stojí nejvýš",
      e: "Text jde po pořádku odshora dolů. Co je napsané nejvýš, stalo se nejdřív.",
    },
    odkaz: {
      q: "Místo čeho si dal Matěj chleba?",
      a: "místo polévky",
      d: [
        ["místo neděle", "Neděle je den, ne jídlo."],
        ["místo babičky", "Babička polévku uvařila, ale nejedla se."],
        ["místo Káti", "Káťa je sestra, ne jídlo."],
      ],
      stopa: "všimni si, co se jedlo ve větě předtím",
      e: "V poslední větě stojí slovo „ní“. Zastupuje to, co Matěj podle věty předtím nejedl.",
    },
    plati: {
      q: "Které tvrzení podle textu platí?",
      a: "Kátě polévka chutnala.",
      d: [
        ["Matějovi polévka chutnala.", "Matěj ji vůbec nejedl."],
        ["Káťa polévku nejedla.", "Káťa si ji dokonce přidala."],
        ["Nikdo polévku nejedl.", "Jedl ji aspoň jeden z nich."],
      ],
      stopa: "Kdo si přidá dvakrát, tomu jídlo chutná.",
      e: "Text neříká „chutnala“. Plyne to z toho, že si přidala — a ne jednou, ale dvakrát.",
    },
    nedozvis: {
      q: "Co se z textu nedozvíš?",
      a: "Kolik je babičce let.",
      d: [
        ["Co babička uvařila.", "To text říká — bramborovou polévku."],
        ["Kdo polévku nejedl.", "To text říká — Matěj."],
        ["Kdy děti přijely.", "To text říká — v neděli."],
      ],
      stopa: "Věk se v textu nikde nepíše.",
      e: "Text neodpovídá na všechno. Co v něm není, to se z něj nedá vyčíst — ani odhadem.",
    },
    vyvod: {
      q: "Podle čeho poznáš, že Kátě polévka chutnala?",
      a: "Přidala si dvakrát.",
      d: [
        ["Jela k babičce.", "K babičce jely obě děti, i ten, kdo polévku nejedl."],
        ["Seděla u stolu.", "O sezení u stolu text nic neříká."],
        ["Snědla i chleba.", "Chleba si dal Matěj, ne Káťa."],
      ],
      stopa: "Hledej v textu důkaz, ne dojem.",
      e: "Vyvodit něco z textu znamená opřít se o konkrétní větu. Tahle je tím důkazem — ostatní tři nic o chuti neříkají.",
    },
  },
  {
    nadpis: "Adamův dárek",
    emoji: "🚲",
    text:
      "Adam dostal k narozeninám kolo. Hned si na něm vyjel. Na kopci mu spadl řetěz. " +
      "Kolo musel tlačit domů. Tatínek řetěz večer opravil.",
    vyhledej: [
      {
        q: "Co Adam dostal k narozeninám?",
        a: "kolo",
        d: [
          ["brusle", "Brusle se v textu nikde nepíšou."],
          ["helmu", "Helma se v textu nikde nepíše."],
          ["míček", "Míček se v textu nikde nepíše."],
        ],
        stopa: "první větu, která mluví o dárku",
        e: "Hned první věta říká, co Adam dostal. Nic se nedomýšlí, jen se hledá.",
      },
      {
        q: "Co se Adamovi stalo na kopci?",
        a: "spadl mu řetěz",
        d: [
          ["praskla mu duše", "Duše se v textu nikde nepíše."],
          ["ztratil klíče", "Klíče se v textu nikde nepíšou."],
          ["upadl na zem", "Spadl řetěz, ne Adam."],
        ],
        stopa: "třetí větu, která mluví o kopci",
        e: "Třetí věta to říká přesně. Pozor na rozdíl: spadnout může kolo i řetěz, a není to totéž.",
      },
      {
        q: "Kdo řetěz opravil?",
        a: "tatínek",
        d: [
          ["Adam sám", "Adam kolo tlačil domů. Opravu udělal někdo jiný."],
          ["opravář", "Opravář se v textu nikde nepíše."],
          ["dědeček", "Dědeček se v textu nikde nepíše."],
        ],
        stopa: "poslední větu textu",
        e: "Odpověď je v poslední větě. Na otázku KDO odpovídá v textu osoba, ne čas ani místo.",
      },
    ],
    proc: {
      q: "Proč musel Adam kolo tlačit?",
      a: "Spadl mu řetěz.",
      d: [
        ["Byl hrozně unavený.", "O únavě text nic neříká."],
        ["Kolo bylo moc těžké.", "O váze kola text nic neříká."],
        ["Cesta vedla do kopce.", "Na kopci se něco pokazilo. Kopec sám tlačení nezpůsobil."],
      ],
      stopa: "třetí větu se čtvrtou",
      e: "Příčina stojí v textu dřív než následek: nejdřív se něco pokazilo, teprve pak musel Adam kolo tlačit.",
    },
    poradi: {
      q: "Co se stalo jako poslední?",
      a: "Tatínek řetěz opravil.",
      d: [
        ["Řetěz spadl na kopci.", "To bylo během vyjížďky, tedy dřív."],
        ["Adam dostal kolo.", "To bylo úplně na začátku."],
        ["Adam si vyjel.", "Vyjel si hned po tom, co kolo dostal."],
      ],
      stopa: "která věta o kole stojí nejníž",
      e: "Text jde po pořádku odshora dolů. Co je napsané nejníž, stalo se naposled.",
    },
    odkaz: {
      q: "Na čem si Adam hned vyjel?",
      a: "na novém kole",
      d: [
        ["na staré koloběžce", "Koloběžka se v textu nikde nepíše."],
        ["na tátově kole", "Tatínek řetěz opravil, ale své kolo nepůjčil."],
        ["na velkém kopci", "Kopec je místo, ne něco, na čem se jede."],
      ],
      stopa: "všimni si, co Adam dostal v první větě",
      e: "Ve druhé větě stojí slovo „něm“. Zastupuje to, co Adam podle první věty dostal.",
    },
    plati: {
      q: "Které tvrzení podle textu platí?",
      a: "Kolo bylo večer zase v pořádku.",
      d: [
        ["Kolo zůstalo rozbité.", "Večer se řetěz opravil."],
        ["Adam kolo nikdy nedostal.", "Dostal ho hned v první větě."],
        ["Řetěz opravil sám Adam.", "Opravoval ho někdo jiný."],
      ],
      stopa: "Opravit řetěz znamená dát kolo do pořádku.",
      e: "Text neříká „v pořádku“, říká „opravil“. Pochopit, že to znamená totéž, je přesně porozumění obsahu.",
    },
    nedozvis: {
      q: "Co se z textu nedozvíš?",
      a: "Kolik je Adamovi let.",
      d: [
        ["Co se stalo na kopci.", "To text říká — spadl řetěz."],
        ["Kdy Adam kolo dostal.", "To text říká — k narozeninám."],
        ["Kdo řetěz opravil.", "To text říká — tatínek."],
      ],
      stopa: "Narozeniny v textu jsou, ale věk ne.",
      e: "Narozeniny se v textu píšou, ale kolik jich bylo, ne. Taková past čeká na toho, kdo si domýšlí.",
    },
    vyvod: {
      q: "Jak se Adam na kopci nejspíš cítil?",
      a: "Mrzelo ho to.",
      d: [
        ["Měl velkou radost.", "Radost měl z kola. Na kopci se mu pokazilo."],
        ["Byl na sebe pyšný.", "Pyšnit se spadlým řetězem není proč."],
        ["Vůbec si nevšiml.", "Všiml si — kolo pak musel tlačit."],
      ],
      stopa: "Nová věc se hned první den pokazila.",
      e: "O pocitech text nepíše. Vyvodíš je z toho, co se stalo: nové kolo se pokazilo hned na první vyjížďce.",
    },
  },
  {
    nadpis: "Školní výlet",
    emoji: "☔",
    text:
      "Třída jela na výlet do lesa. Po obědě začalo pršet. Děti se schovaly pod velký buk. " +
      "Paní učitelka rozdala pláštěnky. Domů se děti vrátily celé mokré.",
    vyhledej: [
      {
        q: "Kam třída jela na výlet?",
        a: "do lesa",
        d: [
          ["do zoo", "Zoo se v textu nikde nepíše."],
          ["k rybníku", "Rybník se v textu nikde nepíše."],
          ["na hrad", "Hrad se v textu nikde nepíše."],
        ],
        stopa: "první větu, která mluví o výletě",
        e: "Hned první věta říká, kam se jelo. Na otázku KAM odpovídá v textu místo.",
      },
      {
        q: "Kdo rozdal pláštěnky?",
        a: "paní učitelka",
        d: [
          ["paní kuchařka", "Kuchařka se v textu nikde nepíše."],
          ["starší děti", "Děti se schovávaly, ale nic nerozdávaly."],
          ["pan řidič", "Řidič se v textu nikde nepíše."],
        ],
        stopa: "čtvrtou větu, která mluví o pláštěnkách",
        e: "Čtvrtá věta jmenuje toho, kdo pláštěnky rozdal. Na otázku KDO odpovídá v textu osoba.",
      },
      {
        q: "Pod jaký strom se děti schovaly?",
        a: "pod velký buk",
        d: [
          ["pod starou lípu", "Lípa se v textu nikde nepíše."],
          ["pod vysoký smrk", "Smrk se v textu nikde nepíše."],
          ["pod mladý dub", "Dub se v textu nikde nepíše."],
        ],
        stopa: "třetí větu, která mluví o schovávání",
        e: "Třetí věta jmenuje strom. Když se ptáš POD JAKÝ, nestačí najít slovo „strom“ — důležité je, který to byl.",
      },
    ],
    proc: {
      q: "Proč se děti schovaly pod buk?",
      a: "Začalo totiž pršet.",
      d: [
        ["Byly hrozně unavené.", "O únavě text nic neříká."],
        ["Chtěly si tam hrát.", "O hraní pod stromem text nic neříká."],
        ["Hledaly tam houby.", "Houby se v textu nikde nepíšou."],
      ],
      stopa: "druhou větu se třetí",
      e: "Příčina stojí v textu dřív než následek: nejdřív se změnilo počasí, teprve pak se děti schovaly.",
    },
    poradi: {
      q: "Co se stalo jako první?",
      a: "Třída jela do lesa.",
      d: [
        ["Spustil se déšť.", "Pršet začalo až na výletě."],
        ["Rozdaly se pláštěnky.", "Pláštěnky se rozdávaly, až když pršelo."],
        ["Děti se schovaly.", "Schovat se potřebovaly, až když začalo pršet."],
      ],
      stopa: "která věta o výletě stojí nejvýš",
      e: "Text jde po pořádku odshora dolů. Co je napsané nejvýš, stalo se nejdřív.",
    },
    odkaz: {
      q: "Koho text myslí slovem „třída“?",
      a: "děti ze třídy",
      d: [
        ["jednu místnost", "Místnost na výlet nejede. Tady to slovo znamená lidi."],
        ["školní budovu", "Budova na výlet nejede. Tady to slovo znamená lidi."],
        ["paní učitelku", "Učitelka jela taky, ale sama třída není."],
      ],
      stopa: "zeptej se, co z toho může jet na výlet",
      e: "Jedno slovo může znamenat víc věcí. Co znamená tady, pozná jen ten, kdo si přečte celou větu.",
    },
    plati: {
      q: "Které tvrzení podle textu platí?",
      a: "Pláštěnky dětem úplně nepomohly.",
      d: [
        ["Děti dojely domů suché.", "Domů se vrátily celé mokré."],
        ["Pršet začalo už ráno.", "Pršet začalo až po obědě."],
        ["Výlet se konal v zimě.", "O ročním období text nic neříká."],
      ],
      stopa: "Pláštěnky se rozdaly, a stejně se něco nepovedlo.",
      e: "Tahle věta v textu napsaná není, ale plyne z něj: pláštěnky děti dostaly a domů se přesto vrátily mokré.",
    },
    nedozvis: {
      q: "Co se z textu nedozvíš?",
      a: "Jak dlouho pršelo.",
      d: [
        ["Kdy začalo pršet.", "To text říká — po obědě."],
        ["Kam třída jela.", "To text říká — do lesa."],
        ["Kdo rozdal pláštěnky.", "To text říká — paní učitelka."],
      ],
      stopa: "Text říká, kdy déšť začal, ale ne kdy skončil.",
      e: "Je rozdíl mezi „kdy to začalo“ a „jak dlouho to trvalo“. Text odpovídá jen na to první.",
    },
    vyvod: {
      q: "Co děti doma nejspíš udělaly?",
      a: "Převlékly se do suchého.",
      d: [
        ["Vrátily se do lesa.", "Výlet skončil, domů se jezdí na konci."],
        ["Šly si hned zaplavat.", "Mokré děti do vody nepotřebují."],
        ["Pověsily pláštěnky do skříně.", "Mokrá pláštěnka do skříně nepatří, musí nejdřív uschnout."],
      ],
      stopa: "Domů se vrátily celé mokré.",
      e: "Text končí návratem domů. Co se stalo dál, v něm není — vyvodíš to z toho, v jakém stavu děti přijely.",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Stavba úloh
// ─────────────────────────────────────────────────────────────────────────────

const pasaz = (c: Ctivo): TaskVisual => ({
  kind: "text_passage",
  title: c.nadpis,
  paragraphs: [c.text],
});

/** Z jádra a dvojice nápověd udělá hotovou úlohu. */
const sestav = (c: Ctivo, j: Jadro, h: [string, string]): PracticeTask =>
  uloha(j.q, j.a, j.d, h, j.e, pasaz(c), c.emoji);

// L1 — údaj je v textu napsaný, stačí ho najít.
const vyhledejTask = (c: Ctivo, j: Jadro) =>
  sestav(c, j, [
    `V textu „${c.nadpis}“ je odpověď napsaná. Hledej ${j.stopa}.`,
    `Přečti si text potichu celý a hledej ${j.stopa}. Jakmile tu větu najdeš, odpověď v ní stojí rovnou a nemusíš nic domýšlet — ostatní tři možnosti v textu nenajdeš vůbec.`,
  ]);

// L2 — odpověď leží mezi dvěma větami.
const procTask = (c: Ctivo, j: Jadro) =>
  sestav(c, j, [
    `V jedné větě textu „${c.nadpis}“ to nenajdeš. Spoj ${j.stopa}.`,
    `Spoj ${j.stopa} a zeptej se, co z první z nich plyne pro druhou. Příčina stojí v textu vždycky dřív než to, co způsobila, takže hledej o větu nebo dvě výš, než kde je následek.`,
  ]);

const poradiTask = (c: Ctivo, j: Jadro) =>
  sestav(c, j, [
    `Jdi textem „${c.nadpis}“ odshora dolů a sleduj, ${j.stopa}.`,
    `Každá možnost se v textu někde stala. Najdi u všech čtyř, ve které větě to je, a pak porovnej, ${j.stopa}. Nerozhoduje, co je nejdůležitější, ale co text píše dřív a co později.`,
  ]);

const odkazTask = (c: Ctivo, j: Jadro) =>
  sestav(c, j, [
    `Vrať se do textu „${c.nadpis}“ a ${j.stopa}.`,
    `Najdi v textu „${c.nadpis}“ větu, kde to slovo stojí, a přečti si ji celou — ${j.stopa}. Potom si za to slovo dosaď každou možnost a poslechni si, u které z nich věta dává smysl.`,
  ]);

// L3 — v textu to napsané není, musí se vyvodit.
const platiTask = (c: Ctivo, j: Jadro) =>
  sestav(c, j, [
    `Projdi možnosti a hledej, co jim v textu „${c.nadpis}“ odporuje.`,
    `Tři možnosti se s textem hádají — ke každé z nich najdeš větu, která říká opak. ${j.stopa} U jedné takovou větu nenajdeš, i když není v textu napsaná doslova. Právě ta platí.`,
  ]);

const nedozvisTask = (c: Ctivo, j: Jadro) =>
  sestav(c, j, [
    `Tři věci v textu „${c.nadpis}“ najdeš, jedna tam není.`,
    `Zkus u každé možnosti ukázat prstem na větu, která to říká. ${j.stopa} U tří to půjde, u jedné budeš hledat marně — a právě tu text neříká.`,
  ]);

const vyvodTask = (c: Ctivo, j: Jadro) =>
  sestav(c, j, [
    `Tohle v textu „${c.nadpis}“ napsané není, musíš to vyvodit.`,
    `Přečti si znovu, co se v textu stalo, a zeptej se: co z toho plyne? ${j.stopa} Text to neříká přímo, ale jedna možnost na to navazuje — ostatní tři by znamenaly něco jiného, než co se stalo.`,
  ]);

function genL1(): PracticeTask[] {
  return CTIVA.flatMap((c) => c.vyhledej.map((j) => vyhledejTask(c, j)));
}

function genL2(): PracticeTask[] {
  return CTIVA.flatMap((c) => [procTask(c, c.proc), poradiTask(c, c.poradi), odkazTask(c, c.odkaz)]);
}

function genL3(): PracticeTask[] {
  return CTIVA.flatMap((c) => [platiTask(c, c.plati), nedozvisTask(c, c.nedozvis), vyvodTask(c, c.vyvod)]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(genL1());
  if (level === 2) return shuffle(genL2());
  return shuffle(genL3());
}

export const TICHE_CTENI_POROZUMENI: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-cteni-s-porozumenim-tiche-cteni-a-porozumeni-obsahu",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-cteni-s-porozumenim-tiche-cteni-a-porozumeni-obsahu",
    title: "Tiché čtení a porozumění obsahu",
    studentTitle: "Čti a rozuměj",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení s porozuměním",
    briefDescription: "Přečteš si krátký text potichu a odpovíš, co se v něm stalo.",
    keywords: ["čtení", "porozumění", "text", "otázka", "odpověď", "proč", "pořadí", "vyvození"],
    goals: [
      "Najít v textu údaj, který je v něm přímo napsaný.",
      "Odpovědět na otázku „proč“ spojením dvou vět.",
      "Určit, co se v textu stalo dřív a co později.",
      "Poznat, co zastupuje zájmeno a co znamená slovo v té které větě.",
      "Vyvodit, co z textu plyne — a poznat, na co text neodpovídá.",
    ],
    boundaries: [
      "Dítě vybírá z možností, nic nepíše — odpovědi vlastními slovy aplikace nemá.",
      "Texty jsou dlouhé pět vět; delší druhák potichu neudrží v hlavě.",
      "Čte se potichu, ne nahlas — hlasité čtení by potřebovalo mikrofon.",
      "Tvar textu (věta, odstavec, nadpis) je v tématu „Vyznej se v textu“.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přečti si text celý a potichu. Teprve pak se podívej na otázku a hledej v textu větu, která na ni odpovídá.",
      steps: [
        "Přečti si celý text potichu, bez spěchu a až do konce.",
        "Přečti si otázku a všimni si, na co se ptá: kdo, co, kde, kdy, nebo proč.",
        "Vrať se do textu a najdi větu, která o tom mluví.",
        "Když odpověď v textu přímo není, poskládej ji ze dvou vět — nebo řekni, že se to z textu nedozvíš.",
      ],
      commonMistake: "Odpovědět podle vlastní zkušenosti místo podle textu. Platí jen to, co v textu opravdu stojí.",
      example: "„Ve škole měla levou ruku studenou.“ Na otázku, která ruka studila, je odpověď v textu. Jakou barvu měla rukavice, se z něj ale nedozvíš.",
    },
  },
];
