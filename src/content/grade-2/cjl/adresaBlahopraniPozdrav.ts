/**
 * Adresa, blahopřání, pozdrav z prázdnin — 2. ročník.
 *
 * RVP uzel `g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-adresa-
 * blahoprani-pozdrav-z-prazdnin`. Druhý ze tří uzlů slohové výchovy, které
 * zbyly po opravě `rvpNodeId` (viz `PROJECT_STATUS.md` §6); první naplnil
 * `pozdravOsloveniOmluva.ts` a tohle téma na něj vědomě navazuje — tam se
 * řeší, co se **řekne**, tady co se **napíše a pošle**.
 *
 * **Sloh tady neznamená volný text.** `inputType: "essay"` v aplikaci
 * neexistuje a existovat nemá (`CLAUDE.md`). Dítě tedy nepíše pohlednici, ale
 * pozná, která ze čtyř se dá poslat — a to je samostatná dovednost, ne
 * náhražka psaní.
 *
 * Kalibrace úrovní:
 * - **L1 rozpoznání** — pojmenovat údaj v hotové adrese („390 01“ je
 *   směrovací číslo pošty, ne číslo domu) a poznat, co je text za žánr
 *   (blahopřání × pozdrav z prázdnin × vzkaz × poděkování). Jeden krok.
 * - **L2 aplikace** — použít pravidlo na konkrétní obálku (co patří na který
 *   řádek, když adresu teprve píšu) a vybrat blahopřání, které sedí na
 *   příležitost **i** na oslovení adresáta.
 * - **L3 přenos** — posoudit celý text, ne jeden údaj: která adresa je
 *   napsaná celá, která pohlednice nese všechno, co příjemce potřebuje, a
 *   které blahopřání opravdu přeje tomu druhému. Dvoukrokové: nejdřív zjisti,
 *   co tam má být, pak teprve porovnej čtyři možnosti.
 *
 * **Délka možností.** Distraktory se u každé úlohy drží délkou blízko klíči,
 * jinak by stačilo hádat „nejdelší je správně“. Hlídá to `zkontroluj()` níž a
 * padá už při generování. U L3 to byla nejdražší část práce: úplná adresa i
 * úplná pohlednice nesou víc informace než neúplné, takže se distraktory
 * musely dopsat do stejné délky, ne zkrátit o chybějící údaj.
 *
 * **Jména a místa jsou vymyšlená.** PSČ jsou ale skutečná (602 00 Brno,
 * 760 01 Zlín, 390 01 Tábor, 266 01 Beroun, 110 00 Praha) — dítě si to může
 * doma zkontrolovat na obálce a nesmí tam najít nesmysl.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// ── Kritik uvnitř souboru ────────────────────────────────────────────────────
// Generátor a kontrola jsou oddělené: `zkontroluj` nezná záměr úlohy, dívá se
// jen na hotový výsledek. Padá hlasitě — vadná úloha se nemá dostat před dítě
// ani v dev náhledu.

/** Nejdelší možnost nesmí být o víc než tolik procent delší než nejkratší. */
const MAX_ROZPTYL_DELKY = 0.6;

/**
 * Srovná text na podobu, ve které se dá porovnávat únik: malá písmena, bez
 * interpunkce a uvozovek, jedna mezera mezi slovy.
 *
 * ⚠️ Bez téhle normalizace kontrola mlčí právě o tom, co má hlídat: v
 * sousedním tématu jí prošlo pět úniků, protože nápověda nesla „Dobrou noc“
 * a klíč „Dobrou noc.“ — lišily se tečkou (`SESSION_HANDOFF.md` §4).
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
  return t;
}

function uloha(
  q: string,
  a: string,
  d: [string, string][],
  h: [string, string],
  e: string,
  emoji: string,
): PracticeTask {
  if (d.length !== 3) throw new Error(`Úloha „${q}“ nemá tři chybné možnosti`);
  // `choice()` dolepí k velké nápovědě obecné věty („Nejdřív škrtni možnost,
  // která s otázkou vůbec nesouvisí.“), dokud není aspoň o pětinu delší než
  // malá — kvůli pravidlu auditu `hint_progression`. U podrobných nápověd z
  // tohohle tématu to dávalo nesmysl: po konkrétním „vyřaď tyhle dvě možnosti“
  // přišlo obecné „nejdřív škrtni tu, která s otázkou nesouvisí“. Našel to až
  // náhled v prohlížeči. Řeší se to tak, že velká nápověda je delší sama.
  if (d.length === 3 && h[1].length < h[0].length * 1.2) {
    throw new Error(
      `${q}: velká nápověda je kratší než 1,2× malá (${h[0].length} → ${h[1].length}), choice() k ní dolepí obecné věty`,
    );
  }
  const wrong = d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  const t = { ...choice(q, a, wrong, { hints: h, explanation: e }), emoji };
  return zkontroluj(t, q);
}

// ─────────────────────────────────────────────────────────────────────────────
// Banka adres
// ─────────────────────────────────────────────────────────────────────────────
// Pět vymyšlených lidí, skutečná PSČ. `odesilatel` je jméno někoho jiného —
// slouží jako distraktor v L2, protože „na obálku napíšu sebe“ je chyba, kterou
// druháci dělají doopravdy.
//
// Délky řádků jsou v jedné adrese vědomě podobné (8–13 znaků). Kdyby se jedno
// jméno rozšířilo o prostřední jméno nebo město na „České Budějovice“, shodí to
// `zkontroluj` na rozptylu délky — a to je správně, protože pak by se dalo
// hádat podle délky.

interface Adresa {
  jmeno: string;
  /** Ulice včetně čísla domu, jak stojí na obálce. */
  ulice: string;
  psc: string;
  mesto: string;
  /** Jméno někoho jiného — ten, kdo dopis posílá. */
  odesilatel: string;
  emoji: string;
}

const ADRESY: Adresa[] = [
  { jmeno: "Jana Nováková", ulice: "Lipová 12", psc: "602 00", mesto: "Brno", odesilatel: "Marek Veselý", emoji: "✉️" },
  { jmeno: "Petr Dvořák", ulice: "Školní 18", psc: "760 01", mesto: "Zlín", odesilatel: "Alena Pokorná", emoji: "📮" },
  { jmeno: "Eva Horáková", ulice: "Krátká 25", psc: "390 01", mesto: "Tábor", odesilatel: "Jakub Richter", emoji: "📬" },
  { jmeno: "Tomáš Beneš", ulice: "Zahradní 6", psc: "266 01", mesto: "Beroun", odesilatel: "Hana Smolová", emoji: "📨" },
  { jmeno: "Lucie Málková", ulice: "Nádražní 3", psc: "110 00", mesto: "Praha", odesilatel: "Filip Urban", emoji: "🏤" },
];

const radekMesta = (a: Adresa) => `${a.psc} ${a.mesto}`;
const celaAdresa = (a: Adresa) => `${a.jmeno}, ${a.ulice}, ${radekMesta(a)}`;

// ─────────────────────────────────────────────────────────────────────────────
// L1a — co je který údaj v adrese
// ─────────────────────────────────────────────────────────────────────────────
// Všechny čtyři úlohy nad jednou adresou mají **tutéž čtveřici možností** a
// liší se jen tím, na kterou část adresy se otázka ptá. Je to vědomé: tak jsou
// distraktory vždycky právě ti tři zaměnitelní sourozenci (číslo domu ×
// směrovací číslo, jméno člověka × jméno města), ne náhodná slova. Navíc jsou
// všechny čtyři nálepky dlouhé 18–23 znaků, takže se nedá hádat podle délky.

type Cast = "jmeno" | "ulice" | "psc" | "mesto";

const NALEPKA: Record<Cast, string> = {
  jmeno: "jméno toho, komu píšeš",
  ulice: "ulice a číslo domu",
  psc: "směrovací číslo pošty",
  mesto: "jméno města, kam to jde",
};

const HODNOTA: Record<Cast, (a: Adresa) => string> = {
  jmeno: (a) => a.jmeno,
  ulice: (a) => a.ulice,
  psc: (a) => a.psc,
  mesto: (a) => a.mesto,
};

/** Dovětek druhé nápovědy — nesmí obsahovat nálepku klíče, jen pravidlo. */
const PRAVIDLO: Record<Cast, string> = {
  jmeno: "Zbylá možnost mluví o člověku — a nahoře na obálce stojí vždycky ten, komu dopis jde.",
  ulice: "Zbylá možnost říká, kde přesně ve městě ten člověk bydlí: název ulice a za ním číslo domu.",
  psc: "Zbylá možnost je to pětimístné číslo, které dopis nasměruje na správnou poštu.",
  mesto: "Zbylá možnost je místo, kam dopis doveze pošta jako poslední — proto stojí na obálce úplně dole.",
};

const CASTI: Cast[] = ["jmeno", "ulice", "psc", "mesto"];

function udajTask(a: Adresa, cast: Cast): PracticeTask {
  const datum = HODNOTA[cast](a);
  const jine = CASTI.filter((c) => c !== cast);
  return uloha(
    `V adrese „${celaAdresa(a)}“ je část „${datum}“. Co to je?`,
    NALEPKA[cast],
    jine.map((c) => [
      NALEPKA[c],
      `To je v téhle adrese „${HODNOTA[c](a)}“. Část „${datum}“ je něco jiného.`,
    ]) as [string, string][],
    [
      `Jednu možnost vyřadíš hned: ${NALEPKA[jine[0]]} je v téhle adrese „${HODNOTA[jine[0]](a)}“.`,
      `Vyřaď i ${NALEPKA[jine[1]]} („${HODNOTA[jine[1]](a)}“) a ${NALEPKA[jine[2]]} („${HODNOTA[jine[2]](a)}“). ${PRAVIDLO[cast]}`,
    ],
    `Adresa má tři řádky: nahoře jméno člověka, pod ním ulice s číslem domu a dole směrovací číslo pošty se jménem města. Část „${datum}“ je ${NALEPKA[cast]}.`,
    a.emoji,
  );
}

function genL1a(): PracticeTask[] {
  return ADRESY.flatMap((a) => CASTI.map((c) => udajTask(a, c)));
}

// ─────────────────────────────────────────────────────────────────────────────
// L1b — co je to za text
// ─────────────────────────────────────────────────────────────────────────────
// Čtyři žánry, které se v tomhle věku pletou. Texty jsou držené na 29–36
// znacích, aby se daly porovnat na první pohled a aby klíč nevyčníval délkou.
// `cue` je slovo, kterým text svůj žánr prozradí — jde do vysvětlení, takže je
// pro každý text jiné.

type Zanr = "blahoprani" | "pozdravZPrazdnin" | "vzkaz" | "podekovani";

const NAZEV_ZANRU: Record<Zanr, string> = {
  blahoprani: "blahopřání",
  pozdravZPrazdnin: "pozdrav z prázdnin",
  vzkaz: "vzkaz",
  podekovani: "poděkování",
};

const ZNAK_ZANRU: Record<Zanr, string> = {
  blahoprani: "blahopřáním přejeme druhému něco dobrého k jeho dni",
  pozdravZPrazdnin: "pozdravem z prázdnin dáváme vědět, kde jsme a jak se nám tam vede",
  vzkaz: "vzkazem předáváme dál zprávu, kterou někdo nechal",
  podekovani: "poděkováním oceníme, co pro nás někdo udělal",
};

interface Text {
  t: string;
  z: Zanr;
  /** Slovo, kterým text prozradí svůj žánr. */
  cue: string;
}

const TEXTY: Text[] = [
  { t: "Všechno nejlepší k narozeninám!", z: "blahoprani", cue: "Všechno nejlepší" },
  { t: "Hodně zdraví a radosti k svátku.", z: "blahoprani", cue: "Hodně zdraví" },
  { t: "Krásné Vánoce a šťastný nový rok.", z: "blahoprani", cue: "Krásné Vánoce" },
  { t: "Zdravíme z hor, je tu plno sněhu.", z: "pozdravZPrazdnin", cue: "Zdravíme z hor" },
  { t: "Posíláme pusu od moře, je tu teplo.", z: "pozdravZPrazdnin", cue: "od moře" },
  { t: "Zdravím z tábora, chytili jsme rybu.", z: "pozdravZPrazdnin", cue: "Zdravím z tábora" },
  { t: "Volal dědeček, přijede ve čtvrtek.", z: "vzkaz", cue: "Volal dědeček" },
  { t: "Mamka nechala klíče pod rohožkou.", z: "vzkaz", cue: "nechala klíče" },
  { t: "Trénink se posouvá na pátek v pět.", z: "vzkaz", cue: "se posouvá" },
  { t: "Děkuju ti za ten krásný dárek.", z: "podekovani", cue: "Děkuju ti" },
  { t: "Moc vám děkuji za pomoc s úkolem.", z: "podekovani", cue: "děkuji za pomoc" },
  { t: "Díky za to, že jsi mi pomohl.", z: "podekovani", cue: "Díky za to" },
];

const ZANRY: Zanr[] = ["blahoprani", "pozdravZPrazdnin", "vzkaz", "podekovani"];

/**
 * Ke klíči dohledá tři distraktory — každý jiného žánru a délkou co nejblíž
 * klíči. Výběr je deterministický (podle rozdílu délky, při shodě podle
 * textu), takže generátor vydá pokaždé tutéž sadu a úlohy jsou spočitatelné.
 */
function blizkeDelkou(klic: Text): Text[] {
  return ZANRY.filter((z) => z !== klic.z).map((z) => {
    const kandidati = TEXTY.filter((v) => v.z === z);
    return [...kandidati].sort((a, b) => {
      const da = Math.abs(a.t.length - klic.t.length), db = Math.abs(b.t.length - klic.t.length);
      return da - db || a.t.localeCompare(b.t, "cs");
    })[0];
  });
}

function zanrTask(klic: Text, emoji: string): PracticeTask {
  const d = blizkeDelkou(klic);
  return uloha(
    `Který text je ${NAZEV_ZANRU[klic.z]}?`,
    klic.t,
    d.map((v) => [v.t, `„${v.t}“ je ${NAZEV_ZANRU[v.z]} — ${ZNAK_ZANRU[v.z]}.`]) as [string, string][],
    // Nápověda nesmí ukázat na klíč jeho vlastními slovy, proto navádí
    // vylučováním: jmenují se distraktory, nikdy klíč. Unikátní to je samo,
    // protože každá úloha má jinou trojici distraktorů.
    [
      `Vyřaď „${d[0].t}“ — ${ZNAK_ZANRU[d[0].z]}, takže to ${NAZEV_ZANRU[klic.z]} není. Zbývají tři možnosti.`,
      `Vyřaď i „${d[1].t}“ a „${d[2].t}“ — první je ${NAZEV_ZANRU[d[1].z]}, druhá ${NAZEV_ZANRU[d[2].z]}. U zbylého textu si rozmysli, komu a proč se posílá: ${ZNAK_ZANRU[klic.z]}.`,
    ],
    `Je to ${NAZEV_ZANRU[klic.z]}, protože ${ZNAK_ZANRU[klic.z]}. Poznáš to podle slov „${klic.cue}“.`,
    emoji,
  );
}

const EMOJI_ZANR = ["🎂", "🌼", "🎄", "⛰️", "🏖️", "🎣", "📞", "🔑", "⚽", "🎁", "📘", "🤝"];

function genL1b(): PracticeTask[] {
  return TEXTY.map((v, i) => zanrTask(v, EMOJI_ZANR[i % EMOJI_ZANR.length]));
}

function genL1(): PracticeTask[] {
  return [...genL1a(), ...genL1b()];
}

// ─────────────────────────────────────────────────────────────────────────────
// L2a — co patří na který řádek obálky
// ─────────────────────────────────────────────────────────────────────────────
// Rozdíl proti L1a: tam dítě čte hotovou adresu a údaj pojmenuje, tady adresu
// teprve píše a musí pravidlo použít. Čtvrtou možností je jméno odesílatele —
// „na obálku napíšu sebe“ je skutečná chyba, a hlavně to znamená, že u otázky
// na nejvyšší řádek stojí proti sobě **dvě** jména. Nestačí tedy poznat, že
// nahoru patří člověk; musí se rozhodnout, který.
//
// Zadání jmenuje odesílatele, nikdy adresáta — jinak by klíč stál v otázce.

type Radek = "nejvys" | "doprostred" | "nejniz";

const OTAZKA_RADKU: Record<Radek, string> = {
  nejvys: "Který údaj patří na obálce nejvýš?",
  doprostred: "Který údaj patří na prostřední řádek?",
  nejniz: "Který údaj patří na nejnižší řádek?",
};

function radekTask(a: Adresa, radek: Radek): PracticeTask {
  const mesto = radekMesta(a);
  const q = `Dopis posílá ${a.odesilatel}. ${OTAZKA_RADKU[radek]}`;

  if (radek === "nejvys") {
    return uloha(
      q,
      a.jmeno,
      [
        [a.odesilatel, `To je ten, kdo dopis posílá. Odesílatel se píše dozadu na obálku — dopředu patří ten, komu dopis jde.`],
        [a.ulice, `To je ulice s číslem domu. Ta patří doprostřed, pod jméno.`],
        [mesto, `To je směrovací číslo pošty a jméno města. Ten řádek patří úplně dolů.`],
      ],
      [
        `Vyřaď „${a.ulice}“ a „${mesto}“ — to nejsou jména lidí, a nahoru na obálku patří člověk.`,
        `Zbyla dvě jména a rozhoduje, komu dopis jde. ${a.odesilatel} ho posílá, takže jeho jméno patří dozadu na obálku, ne nahoru dopředu.`,
      ],
      `Nahoru na obálku patří jméno toho, komu dopis jde. ${a.odesilatel} je odesílatel, takže jeho jméno se píše dozadu.`,
      a.emoji,
    );
  }

  if (radek === "doprostred") {
    return uloha(
      q,
      a.ulice,
      [
        [a.jmeno, `To je jméno toho, komu dopis jde. Patří nahoru na první řádek.`],
        [a.odesilatel, `To je jméno odesílatele, a to se píše dozadu na obálku. Doprostřed navíc jméno nepatří vůbec.`],
        [mesto, `To je směrovací číslo pošty a město. Ten řádek stojí až pod ulicí.`],
      ],
      [
        `Vyřaď obě jména, „${a.jmeno}“ i „${a.odesilatel}“ — doprostřed nepatří člověk.`,
        `Zbyly dva údaje o místě. „${mesto}“ patří na nejnižší řádek, protože město se na poště čte jako poslední.`,
      ],
      `Doprostřed patří ulice a číslo domu — tedy „${a.ulice}“. Nad ní je jméno, pod ní směrovací číslo pošty s městem.`,
      a.emoji,
    );
  }

  return uloha(
    q,
    mesto,
    [
      [a.jmeno, `To je jméno toho, komu dopis jde. Patří nahoru, ne dolů.`],
      [a.odesilatel, `To je jméno odesílatele. Patří dozadu na obálku, a na nejnižší řádek by nepatřilo ani tak.`],
      [a.ulice, `To je ulice s číslem domu. Ta patří doprostřed, nad spodní řádek.`],
    ],
    [
      `Vyřaď „${a.jmeno}“ a „${a.odesilatel}“ — jména lidí na nejnižší řádek nepatří.`,
      `Zbyly „${a.ulice}“ a údaj o městě. Ulice s číslem domu stojí doprostřed, protože sama by dopis do města nedostala — a místo s číslem pošty se píše až pod ni.`,
    ],
    `Na nejnižší řádek patří směrovací číslo pošty a jméno města — tedy „${mesto}“. Pošta podle něj pozná, kam dopis poslat dřív, než hledá ulici.`,
    a.emoji,
  );
}

const RADKY: Radek[] = ["nejvys", "doprostred", "nejniz"];

function genL2a(): PracticeTask[] {
  return ADRESY.flatMap((a) => RADKY.map((r) => radekTask(a, r)));
}

// ─────────────────────────────────────────────────────────────────────────────
// L2b — blahopřání k příležitosti
// ─────────────────────────────────────────────────────────────────────────────
// Tři druhy chyb, každá zastoupená v každé situaci:
//   PŘÍLEŽITOST — správně napsané přání, ale k něčemu jinému
//   NENÍ PŘÁNÍ  — zdvořilá věta, která ale jen vypráví o mně
//   OSLOVENÍ    — tykání dospělému, kterému se vyká (a naopak vykání blízkému)

interface Prani {
  /** Situace = zadání úlohy. */
  kdy: string;
  klic: string;
  prilezitost: [string, string];
  nepraani: [string, string];
  osloveni: [string, string];
  /**
   * O jakou příležitost jde, ve 4. pádě („jde o ..."). Do nápovědy i do
   * vysvětlení, takže je pro každou situaci jiné.
   */
  cue: string;
  /**
   * K čemu přeje ten distraktor s jinou příležitostí.
   *
   * ⚠️ Nápověda ho smí popsat, ale **nesmí ho citovat**: ten distraktor je
   * u části situací téměř klon klíče (stejné oslovení i tvar, jiná jen
   * příležitost), takže citace plus jméno správné příležitosti dohromady
   * poskládají klíč. Našel to `check:hints` u tří ze šesti situací — moje
   * vlastní kontrola uvnitř souboru mlčela, protože hlídá jen doslovný výskyt
   * celého klíče.
   */
  cizi: string;
  /** Jak se adresát oslovuje — do nápovědy i do vysvětlení. */
  komu: string;
  emoji: string;
}

const PRANI: Prani[] = [
  {
    kdy: "Babička má narozeniny a posíláš jí pohled. Co na něj napíšeš?",
    klic: "Milá babičko, všechno nejlepší k narozeninám!",
    prilezitost: ["Milá babičko, veselé Vánoce a hodně dárků!", "Přání k Vánocům je napsané správně, jenže babička má dneska narozeniny, ne Vánoce."],
    nepraani: ["Milá babičko, dnes jsem byl s tátou na kole.", "Tahle věta vypráví o tobě. Blahopřání přeje něco tomu druhému."],
    osloveni: ["Milá babičko, ať se ti daří ve škole!", "Do školy chodíš ty, ne babička. Přání má být o tom, co potěší ji."],
    cue: "babiččiny narozeniny",
    cizi: "Vánocům",
    komu: "babičce se tyká",
    emoji: "👵",
  },
  {
    kdy: "Paní učitelka má svátek. Co jí napíšeš na přání?",
    klic: "Milá paní učitelko, přeji vám krásný svátek.",
    prilezitost: ["Milá paní učitelko, přeji vám veselé Vánoce.", "Vánoce jsou jiný den. Dneska má paní učitelka svátek."],
    nepraani: ["Milá paní učitelko, zapomněl jsem si úkol.", "To je oznámení o tobě, ne přání. A na přání se takováhle věta nehodí."],
    osloveni: ["Milá paní učitelko, přeju ti krásný svátek.", "Paní učitelce vykáme. „Přeju ti“ je tykání, které patří kamarádovi."],
    cue: "svátek paní učitelky",
    cizi: "Vánocům",
    komu: "paní učitelce se vyká",
    emoji: "🧑‍🏫",
  },
  {
    kdy: "Kamarád Marek má narozeniny. Co mu napíšeš do přání?",
    klic: "Ahoj Marku, všechno nejlepší k narozeninám!",
    prilezitost: ["Ahoj Marku, krásné Velikonoce a hodně vajíček!", "Velikonoce jsou na jaře a jsou pro všechny. Marek má dneska svůj den."],
    nepraani: ["Ahoj Marku, zítra jdeme s tátou plavat.", "Tahle věta nic nepřeje, jen vypráví, co budeš dělat ty."],
    osloveni: ["Ahoj Marku, přejeme vám všechno nejlepší!", "Kamarádovi se tyká. „Přejeme vám“ je vykání, které patří dospělému."],
    cue: "Markovy narozeniny",
    cizi: "Velikonocům",
    komu: "kamarádovi se tyká",
    emoji: "🎈",
  },
  {
    kdy: "Dědeček je nemocný a leží v posteli. Co mu napíšeš na pohled?",
    klic: "Milý dědečku, ať jsi zase brzy zdravý.",
    prilezitost: ["Milý dědečku, všechno nejlepší k narozeninám!", "Narozeniny teď nemá. Teď je nemocný, a to si žádá jiné přání."],
    nepraani: ["Milý dědečku, u nás doma je všechno dobré.", "To je zpráva o vás, ne přání pro dědečka."],
    osloveni: ["Milý dědečku, ať mi koupíš novou hračku.", "Tohle přeje něco tobě. Přání v blahopřání je pro toho druhého."],
    cue: "dědečkovo zdraví",
    cizi: "narozeninám",
    komu: "dědečkovi se tyká",
    emoji: "🤒",
  },
  {
    kdy: "Spolužačka Eliška vyhrála ve výtvarné soutěži. Co jí napíšeš?",
    klic: "Eliško, moc ti gratuluji k té výhře!",
    prilezitost: ["Eliško, moc ti gratuluji k narozeninám!", "Gratulace je správná, jen k jiné věci. Eliška vyhrála soutěž."],
    nepraani: ["Eliško, já jsem byl v soutěži čtvrtý.", "Tohle mluví o tobě. Blahopřání patří tomu, kdo vyhrál."],
    osloveni: ["Eliško, gratuluji vám k té výhře!", "Spolužačce se tyká. „Gratuluji vám“ je vykání pro dospělého."],
    cue: "Eliščinu výhru",
    cizi: "narozeninám",
    komu: "spolužačce se tyká",
    emoji: "🏆",
  },
  {
    kdy: "Maminka má svátek a chceš jí napsat přání. Co napíšeš?",
    klic: "Milá mami, přeju ti krásný svátek.",
    prilezitost: ["Milá mami, přeju ti veselé Vánoce.", "Vánoce jsou v prosinci a mají je všichni. Svátek má dneska maminka."],
    nepraani: ["Milá mami, dneska jsem dostal jedničku.", "To je zpráva o tobě. Přání má přát něco mamince."],
    osloveni: ["Milá mami, přeju vám krásný svátek.", "Mamince tykáš. „Přeju vám“ je vykání, které sem nepatří."],
    cue: "maminčin svátek",
    cizi: "Vánocům",
    komu: "mamince se tyká",
    emoji: "💐",
  },
];

function praniTask(p: Prani): PracticeTask {
  // Nápověda cituje jen tu část distraktoru **za oslovením**.
  //
  // ⚠️ Všechny čtyři možnosti v úloze začínají týmž oslovením („Milá
  // babičko,"), takže citovat celý distraktor sice nic neprozradí — ale
  // `audit:content` to hlásí jako `hint_leak`, protože nápověda pak doslova
  // obsahuje dvojslovný začátek klíče. Měřeno: u všech šesti situací je ten
  // začátek shodný u všech čtyř možností, takže šlo o falešný poplach.
  // Přesto se cituje jen zbytek věty: je to konkrétnější vodítko a zároveň
  // nezůstane v auditu nález, který bude muset někdo příště znovu rozebírat.
  const zbytekNeprani = p.nepraani[0].slice(p.nepraani[0].indexOf(",") + 1).trim();
  return uloha(
    p.kdy,
    p.klic,
    [p.prilezitost, p.nepraani, p.osloveni],
    [
      `Jedna možnost přeje k ${p.cizi}, ale tady jde o ${p.cue}. Tu vyřaď.`,
      `Vyřaď i možnost, která za oslovením pokračuje slovy „${zbytekNeprani}“ — ta věta nic nepřeje, jen vypráví. Mezi zbylými dvěma rozhodni podle oslovení: ${p.komu}.`,
    ],
    `Blahopřání přeje tomu druhému něco k té příležitosti, o kterou jde — tady o ${p.cue} — a oslovuje ho správně: ${p.komu}.`,
    p.emoji,
  );
}

function genL2(): PracticeTask[] {
  return [...genL2a(), ...PRANI.map(praniTask)];
}

// ─────────────────────────────────────────────────────────────────────────────
// L3a — která adresa je napsaná celá a správně
// ─────────────────────────────────────────────────────────────────────────────
// Dvoukrokové: nejdřív si vybav, co v adrese má být, a teprve pak porovnávej.
// Chyby jsou ty, které obálku opravdu zdrží nebo zastaví: chybějící číslo domu,
// chybějící směrovací číslo, prohozené pořadí.
//
// Délka: úplná adresa je nutně nejdelší — neúplné jsou o chybějící údaj kratší.
// Proto je mezi distraktory vždycky jedna **stejně dlouhá** (prohozené
// pořadí), aby klíč nebyl jediný nejdelší a nedal se poznat na pohled.

interface CelaAdresaUloha {
  klic: string;
  chyby: [string, string][];
  napovedy: [string, string];
  emoji: string;
}

const ADRESY_L3: CelaAdresaUloha[] = [
  {
    klic: "Eva Horáková, Krátká 25, 390 01 Tábor",
    chyby: [
      ["Krátká 25, Eva Horáková, 390 01 Tábor", "Všechno tam je, ale v jiném pořadí. Jméno patří na první řádek, ulice teprve pod něj."],
      ["Eva Horáková, Krátká, 390 01 Tábor", "Chybí číslo domu. Pošťák by v Krátké ulici nevěděl, u kterého domu zazvonit."],
      ["Eva Horáková, Krátká 25, Tábor", "Chybí směrovací číslo pošty. Bez něj dopis putuje pomaleji a v Táboře nemusí najít správnou poštu."],
    ],
    napovedy: [
      "Odškrtni si tři údaje: jméno člověka, ulici s číslem domu, směrovací číslo s městem. Dvě možnosti mají jeden z nich neúplný — vyřaď je.",
      "Zbyly dvě možnosti, které mají všechno. Rozhoduje pořadí řádků: nejvýš stojí člověk, pod ním ulice s číslem domu a nejníž směrovací číslo se jménem města. Ulice na první řádek nepatří.",
    ],
    emoji: "📬",
  },
  {
    klic: "Petr Dvořák, Školní 18, 760 01 Zlín",
    chyby: [
      ["Školní 18, Petr Dvořák, 760 01 Zlín", "Údaje jsou všechny, ale ulice se dostala nad jméno. Nahoře má být člověk."],
      ["Petr Dvořák, Školní, 760 01 Zlín", "U ulice chybí číslo domu, takže adresa nemíří ke konkrétnímu domu."],
      ["Petr Dvořák, Školní 18, Zlín", "Chybí směrovací číslo. Město samo o sobě poštu nenasměruje tak přesně."],
    ],
    napovedy: [
      "Nejdřív si vybav, co v adrese být musí, a pak každou možnost projdi, jestli to tam je. Dvěma možnostem jeden údaj chybí.",
      "Zbyly dvě úplné adresy a rozhoduje pořadí. Na obálce se jde odshora dolů od člověka k místu: nejvýš jméno a příjmení, pak ulice s číslem domu, nakonec směrovací číslo s městem.",
    ],
    emoji: "📮",
  },
  {
    klic: "Jana Nováková, Lipová 12, 602 00 Brno",
    chyby: [
      ["Jana Nováková, Lipová 12, Brno 602 00", "Řádky jsou správně, ale na posledním je město před číslem. Píše se nejdřív směrovací číslo a pak město."],
      ["Nováková, Lipová 12, 602 00 Brno", "Je tam jen příjmení. V domě může být víc Novákových, a dopis má mít jasného adresáta."],
      ["Jana Nováková, Lipová 12, 602 00", "Chybí jméno města. Samotné číslo napoví poštu, ale na obálce má být i město."],
    ],
    napovedy: [
      "Projdi možnosti odspodu: na posledním řádku má stát nejdřív pětimístné číslo a za ním jméno města. Jedna možnost to má obráceně a jedné město chybí.",
      "Zbyly dvě možnosti. Teď se podívej nahoru na první řádek — má tam být jméno i příjmení, aby bylo jasné, komu dopis jde. Samotné příjmení nestačí, protože v jednom domě může bydlet víc lidí se stejným příjmením.",
    ],
    emoji: "✉️",
  },
  {
    klic: "Tomáš Beneš, Zahradní 6, 266 01 Beroun",
    chyby: [
      ["Zahradní 6, Tomáš Beneš, 266 01 Beroun", "Ulice se dostala nad jméno. Nejvýš patří ten, komu dopis jde."],
      ["Tomáš Beneš, Zahradní, 266 01 Beroun", "U ulice není číslo domu, takže se neví, kde přesně zazvonit."],
      ["Tomáš Beneš, Beroun, Zahradní 6", "Tady je všechno pomíchané a chybí směrovací číslo. Město i ulice stojí na nesprávných řádcích."],
    ],
    napovedy: [
      "Jedna možnost má řádky přeházené tak, že město stojí nad ulicí, a navíc jí chybí směrovací číslo. Tu vyřaď první.",
      "Ze zbylých tří vyřaď tu, které u ulice chybí číslo domu. Pak porovnej, co stojí na prvním řádku — jméno, nebo ulice. Nejvýš patří ten, komu dopis jde, a místo se píše pod něj, nikdy nad něj.",
    ],
    emoji: "📨",
  },
];

function celaAdresaTask(u: CelaAdresaUloha): PracticeTask {
  return uloha(
    `Která adresa je napsaná celá a správně?`,
    u.klic,
    u.chyby,
    u.napovedy,
    `Úplná adresa má tři řádky a pořadí: jméno a příjmení, ulice s číslem domu, směrovací číslo pošty a jméno města. Když jeden údaj chybí nebo si řádky vymění místo, dopis se zdrží, nebo nedojde vůbec.`,
    u.emoji,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// L3b — která pohlednice z prázdnin se dá poslat
// ─────────────────────────────────────────────────────────────────────────────
// Pohlednice z prázdnin potřebuje tři věci, a jsou vždycky tytéž: **kde jsem**,
// **co tam dělám** a **kdo ji posílá**. (U vzkazu to tak jednoduché není — tam
// se potřebné údaje mění podle situace, viz `pozdravOsloveniOmluva.ts`.)
//
// Každý distraktor vynechává právě jednu z těch tří věcí a je přitom stejně
// dlouhý jako klíč: chybějící údaj je nahrazený slovy, která nic neříkají
// („je nám tu krásně“). Bez toho by stačilo vybrat nejdelší text.

interface Pohlednice {
  kdy: string;
  klic: string;
  chyby: [string, string][];
  napovedy: [string, string];
  emoji: string;
}

const POHLEDNICE: Pohlednice[] = [
  {
    kdy: "Jsi s rodiči týden u moře. Posíláš pohled babičce. Který text se dá poslat?",
    klic: "Ahoj babičko, zdravíme od moře. Každý den se koupeme a sbíráme mušle. Tvůj Marek",
    chyby: [
      ["Ahoj babičko, moc tě zdravíme. Každý den se koupeme a sbíráme mušle. Tvůj Marek", "Není tu, kde jsi. Koupat se dá i v bazénu za domem — babička nepozná, kam jste jeli."],
      ["Ahoj babičko, zdravíme od moře. Je tu moc a moc krásně a moc teplo. Tvůj Marek", "Chybí, co tam děláte. Že je krásně, platí o každé dovolené."],
      ["Ahoj babičko, zdravíme od moře. Každý den se koupeme a sbíráme mušle u skal.", "Chybí podpis. Babička nepozná, kdo jí pohled poslal."],
    ],
    napovedy: [
      "Pohlednice z prázdnin potřebuje tři věci: kde jsi, co tam děláš a kdo ji posílá. Projdi možnosti a škrtej ty, kterým jedna z nich chybí.",
      "Dvě možnosti vyřadíš hned: jedna neříká, kde jsi, druhá nekončí podpisem. Ze zbylých dvou vyber tu, která říká i to, co tam děláte — ne jenom to, že je vám tam dobře.",
    ],
    emoji: "🏖️",
  },
  {
    kdy: "Jsi s rodiči na týden v horách. Posíláš pohled kamarádovi Petrovi. Který text se dá poslat?",
    klic: "Ahoj Petře, zdravím z hor. Celé dny tu jezdíme na sáňkách. Tvůj Tomáš",
    chyby: [
      ["Ahoj Petře, moc tě zdravím. Celé dny tu jezdíme na sáňkách. Tvůj Tomáš", "Není tu, kde jsi. Na sáňkách se jezdí i na kopci za městem."],
      ["Ahoj Petře, zdravím z hor. Celé dny je tady opravdu moc hezky. Tvůj Tomáš", "Chybí, co tam děláš. Že je hezky, nic nevypráví."],
      ["Ahoj Petře, zdravím z hor. Celé dny tu jezdíme na sáňkách a bobech.", "Chybí podpis. Petr nepozná, od koho pohled je."],
    ],
    napovedy: [
      "Zkus si o každé možnosti odpovědět na tři otázky: Kde je? Co tam dělá? Kdo to posílá? Která odpoví na všechny tři?",
      "Jedné možnosti chybí podpis a jedna neříká, kde jsi. Mezi zbylými dvěma rozhoduje, jestli se tam dozvíš, co tam vlastně děláte — „je hezky“ se dá napsat o kterémkoli týdnu a kdekoli.",
    ],
    emoji: "⛰️",
  },
  {
    kdy: "Jsi na táboře u rybníka. Posíláš pohled tetě. Který text se dá poslat?",
    klic: "Milá teto, zdravím z tábora u rybníka. Učíme se tu pádlovat. Tvoje Eliška",
    chyby: [
      ["Milá teto, moc tě zdravím a mám se dobře. Učíme se tu pádlovat. Tvoje Eliška", "Není tu, kde jsi. Pádlovat se dá na táboře i v plaveckém oddíle."],
      ["Milá teto, zdravím z tábora u rybníka. Je nám tu spolu moc dobře. Tvoje Eliška", "Chybí, co tam děláš. „Je nám dobře“ platí o každém táboře."],
      ["Milá teto, zdravím z tábora u rybníka. Učíme se tu pádlovat na kánoích.", "Chybí podpis. Teta nepozná, která z neteří jí píše."],
    ],
    napovedy: [
      "Nejdřív si řekni, co teta potřebuje vědět: kde jsi, co tam děláš a kdo jí píše. Pak teprve čti možnosti.",
      "Dvě možnosti rovnou odpadnou — jedné chybí místo, druhé podpis. Ze zbylých dvou vyber tu, kde se dozvíš, co se na tom táboře učíte.",
    ],
    emoji: "🛶",
  },
  {
    kdy: "Jsi o prázdninách u dědy na vesnici. Posíláš pohled mamince. Který text se dá poslat?",
    klic: "Milá mami, zdravím od dědy z vesnice. Pomáhám mu tu krmit kozy. Tvůj Honzík",
    chyby: [
      ["Milá mami, moc tě zdravím a mám se tu fajn. Pomáhám tu krmit kozy. Tvůj Honzík", "Není tu, kde jsi. Kozy jsou i v zoo nebo na statku u školy."],
      ["Milá mami, zdravím od dědy z vesnice. Je tu moc a moc dobře. Tvůj Honzík", "Chybí, co tam děláš. Maminka se nedozví, jak u dědy trávíš dny."],
      ["Milá mami, zdravím od dědy z vesnice. Pomáhám mu tu krmit kozy a slepice.", "Chybí podpis. I maminka ho na pohledu čeká — tak se pohlednice píše."],
    ],
    napovedy: [
      "Tři věci, které na pohlednici patří: kde jsi, co tam děláš, kdo ji posílá. Hledej možnost, které nechybí ani jedna.",
      "Jedna možnost nekončí podpisem a jedna neprozradí, kde jsi. Mezi zbylými dvěma rozhodne to, jestli se z pohledu dozvíš, co tam děláš — „je tu dobře“ platí o každých prázdninách.",
    ],
    emoji: "🐐",
  },
];

function pohledniceTask(p: Pohlednice): PracticeTask {
  return uloha(
    p.kdy,
    p.klic,
    p.chyby,
    p.napovedy,
    `Pohlednice z prázdnin má říct tři věci: kde jsi, co tam děláš a kdo ji posílá. Když chybí místo, text platí o kterékoli dovolené; když chybí, co tam děláš, nic nevypráví; a bez podpisu příjemce nepozná, od koho je.`,
    p.emoji,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// L3c — které blahopřání opravdu přeje tomu druhému
// ─────────────────────────────────────────────────────────────────────────────
// Na L2 se poznávala správná příležitost a oslovení. Tady jsou všechny čtyři
// možnosti správně oslovené a všechny ke správné příležitosti — rozhoduje, co
// ta věta dělá. Tři chyby jsou ty, které děti v přáních píšou nejčastěji:
// mluví o sobě, žádají si něco pro sebe, nebo jen oznámí, co je za den.

interface Blahoprani {
  kdy: string;
  klic: string;
  chyby: [string, string][];
  napovedy: [string, string];
  emoji: string;
}

const BLAHOPRANI: Blahoprani[] = [
  {
    kdy: "Kamarádka Anička má narozeniny. Které blahopřání opravdu přeje jí?",
    klic: "Aničko, ať je ti celý rok krásně a ať se ti splní, co si přeješ.",
    chyby: [
      ["Aničko, já mám narozeniny až v květnu a moc se na ně těším.", "Tohle je o tobě. Dneska má svůj den Anička."],
      ["Aničko, všechno nejlepší, a co mi dáš ty k narozeninám?", "Začátek je přání, ale pak si říkáš o dárek. Blahopřání nic nežádá."],
      ["Aničko, dneska máš narozeniny a je ti už osm let.", "To jen oznamuje, co je za den. Nic to Aničce nepřeje."],
    ],
    napovedy: [
      "U každé možnosti si odpověz: komu ta věta něco přeje? Jedna mluví jen o tobě — tu vyřaď.",
      "Ze zbylých tří vyřaď tu, která si říká o dárek, a tu, která jenom oznamuje, co je za den a kolik je Aničce let. Zbyde věta, která Aničce něco přeje.",
    ],
    emoji: "🎂",
  },
  {
    kdy: "Dědeček má narozeniny. Které blahopřání opravdu přeje jemu?",
    klic: "Dědo, ať tě nic nebolí a ať máš z nás pořád radost.",
    chyby: [
      ["Dědo, já jsem dneska dostal ve škole dvě jedničky.", "To je zpráva o tobě. Dědeček má narozeniny, ne ty."],
      ["Dědo, všechno nejlepší, a vezmeš mě pak na zmrzlinu?", "Druhá polovina si něco žádá. Přání má dávat, ne žádat."],
      ["Dědo, dneska je tvůj den a je ti sedmdesát let.", "To je jen oznámení o dni a letech. Nic to dědečkovi nepřeje."],
    ],
    napovedy: [
      "Hledej větu, která dědečkovi něco přeje. Jedna z možností vypráví o tvých jedničkách — tu vyřaď hned.",
      "Pak vyřaď tu, která žádá zmrzlinu, a tu, která jen říká, kolik je dědečkovi let. Zbyde jediná věta, která dědečkovi něco přeje — a přání se často pozná podle slůvka „ať“.",
    ],
    emoji: "🎉",
  },
  {
    kdy: "Paní učitelka má svátek. Které blahopřání opravdu přeje jí?",
    klic: "Paní učitelko, přeji vám krásný svátek a hodně klidu.",
    chyby: [
      ["Paní učitelko, já jsem měl svátek už v červenci.", "To mluví o tobě. Svátek má dneska paní učitelka."],
      ["Paní učitelko, přeji vám vše dobré, a dáte mi jedničku?", "Přání se tu mění v prosbu o jedničku. To do blahopřání nepatří."],
      ["Paní učitelko, dneska máte svátek a máte tu kytici.", "To jen popisuje, co se děje. Nic to paní učitelce nepřeje."],
    ],
    napovedy: [
      "Všechny čtyři možnosti paní učitelce správně vykají. Rozhoduje tedy něco jiného: komu ta věta něco přeje.",
      "Vyřaď tu, která mluví o tvém svátku, tu, která si přidává prosbu o jedničku, a tu, která jen popisuje kytici na stole. Zbyde věta, která paní učitelce opravdu něco přeje.",
    ],
    emoji: "🌸",
  },
  {
    kdy: "Maminka má narozeniny. Které blahopřání opravdu přeje jí?",
    klic: "Mami, přeju ti, ať se ti všechno daří a ať jsi veselá.",
    chyby: [
      ["Mami, já se k narozeninám těším na ten tvůj dort.", "Tohle je o tom, na co se těšíš ty. Narozeniny má maminka."],
      ["Mami, všechno nejlepší, a koupíš mi k tomu novou hru?", "Po přání přišla žádost o hru. Blahopřání si o nic neříká."],
      ["Mami, dneska máš narozeniny a přišla i teta Jana.", "To jen oznamuje, co je za den a kdo přišel. Nic to mamince nepřeje."],
    ],
    napovedy: [
      "Zkus u každé možnosti doplnit: „přeju ti, aby...“. U jedné to vůbec nejde, protože mluví o tvém těšení na dort.",
      "Vyřaď i tu, která si říká o novou hru, a tu, která jen oznamuje, kdo přišel na návštěvu. Zbyde jediná věta, která mamince něco přeje a nic za to nechce.",
    ],
    emoji: "💝",
  },
];

function blahopraniTask(b: Blahoprani): PracticeTask {
  return uloha(
    b.kdy,
    b.klic,
    b.chyby,
    b.napovedy,
    `Blahopřání dává — přeje tomu druhému něco dobrého. Jakmile začne vyprávět o mně, žádat si dárek nebo jen oznamovat, co je za den, přestává to být přání.`,
    b.emoji,
  );
}

function genL3(): PracticeTask[] {
  return [
    ...ADRESY_L3.map(celaAdresaTask),
    ...POHLEDNICE.map(pohledniceTask),
    ...BLAHOPRANI.map(blahopraniTask),
  ];
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(genL1());
  if (level === 2) return shuffle(genL2());
  return shuffle(genL3());
}

export const ADRESA_BLAHOPRANI_POZDRAV: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-adresa-blahoprani-pozdrav-z-prazdnin",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-slohova-vychova-adresa-blahoprani-pozdrav-z-prazdnin",
    title: "Adresa, blahopřání, pozdrav z prázdnin",
    studentTitle: "Pohled a dopis",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Zjistíš, co patří na obálku, co do přání a co na pohled z prázdnin.",
    keywords: ["adresa", "obálka", "PSČ", "blahopřání", "přání", "pohlednice", "prázdniny", "odesílatel"],
    goals: [
      "Pojmenovat údaje v adrese — jméno, ulici s číslem, směrovací číslo i město.",
      "Vědět, co patří na který řádek obálky a že dopředu se píše adresát, ne odesílatel.",
      "Vybrat blahopřání, které sedí na příležitost i na oslovení.",
      "Posoudit, jestli pohlednice z prázdnin nese, co příjemce potřebuje vědět.",
    ],
    boundaries: [
      "Dítě vybírá z možností, nic nepíše — sloh jako volný text v aplikaci není.",
      "Bez psaní adresy do cizí země a bez údajů o odesílateli na zadní straně.",
      "Mluvený pozdrav, prosba a omluva jsou v tématu „Jak to říct“.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "U adresy si odškrtni tři řádky: jméno, ulice s číslem domu, směrovací číslo s městem. U přání a pohledu se ptej, co se ten druhý z textu dozví.",
      steps: [
        "Přečti si, co se po tobě chce — adresa, přání, nebo pohled z prázdnin.",
        "U adresy jdi po řádcích odshora: člověk, ulice s číslem, směrovací číslo s městem.",
        "U přání zkontroluj dvě věci: jde o správnou příležitost a je adresát správně osloven?",
        "U pohledu z prázdnin si odškrtni tři údaje: kde jsi, co tam děláš a kdo pohled posílá.",
      ],
      commonMistake: "Napsat na přední stranu obálky sebe. Dopředu patří ten, komu dopis jde — odesílatel se píše dozadu.",
      example: "„Eva Horáková, Krátká 25, 390 01 Tábor“ je celá adresa. „Eva Horáková, Krátká, Tábor“ nedojde — chybí číslo domu i směrovací číslo.",
    },
  },
];
