import { describe, it, expect } from "vitest";
import { VYPRAVENI_VYSTAVBA_KOMPOZICE_ZAPLETKA } from "../cjl/vypraveniVystavbaKompoziceZapletka";
import type { PracticeTask } from "@/lib/types";

/**
 * Vyprávění — výstavba, kompozice, zápletka (6. ročník, select_one).
 *
 * Nezávislý solver: tabulka SOLVER_STAVBA (věty pěti částí každého příběhu,
 * napsaná odděleně od generátoru) + rozbor typu úlohy podle znění otázky.
 * Pro každý typ úlohy se klíč dopočítá jinou cestou než v generátoru:
 *  • citovaná/vyznačená věta → najde se v SOLVER_STAVBA, index určí část.
 *  • „co následuje" → klíč = věta s indexem o 1 vyšším, než poslední ukázaná.
 *  • „špatné místo" → jediná věta, jejíž odebrání napraví rostoucí pořadí.
 *  • „chybí část" → jediný index z pěti, který mezi čtyřmi ukázanými chybí.
 *  • „skutečná zápletka" → nezávisle zapsané klíčové slovo musí být jen
 *    v klíči, ne v distraktorech.
 */
const topic = VYPRAVENI_VYSTAVBA_KOMPOZICE_ZAPLETKA[0];

type Cast = "úvod" | "zápletka" | "vyvrcholení" | "obrat" | "závěr";
const PARTS: Cast[] = ["úvod", "zápletka", "vyvrcholení", "obrat", "závěr"];

// ── Nezávislá tabulka: příběh → pět vět v pořadí PARTS ──────────────────
const SOLVER_STAVBA: Record<string, [string, string, string, string, string]> = {
  "tabor": [
      "První den letního tábora u rybníka si Tomáš vybral místo v chatce hned vedle svého kamaráda Honzy.",
      "Druhý den ráno ale zjistil, že mu z batohu zmizela baterka, bez které se do lesa nesměl.",
      "Srdce mu bušilo, když prohledával poslední tmavý kout chatky a baterku pořád nikde neviděl.",
      "Vtom do chatky nahlédl vedoucí tábora s Tomášovou baterkou v ruce – večer si ji půjčil, aby ji přes noc nabil, a zapomněl mu to říct.",
      "Od té chvíle si Tomáš baterku vždycky večer sám zkontroloval, než šel spát.",
  ],
  "ztraceny-klic": [
      "Jana se v pátek odpoledne vracela ze školy domů a cestou počítala dny do prázdnin.",
      "Před domovními dveřmi sáhla do kapsy a klíč od bytu v ní nenahmatala.",
      "Zvonila na sousedy jednoho po druhém a s každým dalším tichým zvonkem se bála víc a víc.",
      "Když si zkřehlé ruce strčila do druhé kapsy u bundy, nahmatala v ní něco studeného a kovového – ztracený klíč.",
      "Ještě týž večer si Jana navlékla klíč na tkaničku, aby se jí to už nikdy nestalo.",
  ],
  "zapas": [
      "V sobotu ráno nastoupil Ondra na fotbalové hřiště jako brankář do rozhodujícího zápasu sezóny.",
      "Deset minut před koncem soupeř vyrovnal na 1:1 a Ondrovým spoluhráčům začínaly docházet síly.",
      "V poslední minutě se útočník soupeře ocitl sám před Ondrou a vystřelil – celé hřiště na okamžik ztichlo.",
      "Ondra ale míč chytil, hned ho vykopl daleko dopředu a jeho spoluhráč v poslední vteřině vstřelil vítězný gól.",
      "Po zápase Ondru spoluhráči nadšeně objímali uprostřed hřiště.",
  ],
  "bourka-na-chate": [
      "O letních prázdninách trávil Marek týden na chatě u babičky uprostřed lesa.",
      "Jednoho večera se obloha během chvíle zatáhla černými mraky a v dálce zahřmělo.",
      "Blesky práskaly čím dál blíž, a když s dalším zahřměním zhasla všechna světla, Marek se schoval pod peřinu.",
      "Babička ale v klidu vytáhla ze šuplíku svíčky, zapálila je a chata se rozzářila teplým světlem.",
      "Zbytek večera si při svíčkách vyprávěli příběhy a bouřka Marka přestala děsit.",
  ],
  "soutez-ve-vareni": [
      "Simona se přihlásila do školní soutěže ve vaření se svým receptem na bramborové placky.",
      "Když v šatně vybalovala tašku, zjistila, že doma zapomněla klíčovou přísadu – čerstvý česnek.",
      "Do začátku soutěže zbývalo pět minut a Simona zoufale probírala tašku, jestli tam přece jen něco nenajde.",
      "Pomoc přišla odjinud: kuchařka ze školní jídelny měla náhradní stroužek česneku a ráda jí ho dala.",
      "Simona se svými plackami obsadila druhé místo a ze soutěže odcházela celá rozzářená.",
  ],
  "cesta-vlakem": [
      "O jarních prázdninách jela Lucie poprvé sama vlakem za tetou do Olomouce.",
      "Po hodině jízdy ji průvodčí upozornil, že sedí ve vagonu, který se v příští stanici odpojí a pojede jinam.",
      "Vlak už brzdil před stanicí a Lucie s těžkým kufrem marně hledala, kudy se dostat do správného vagonu.",
      "Vtom jí jeden cestující ochotně vzal kufr a provedl ji uličkou až do vedlejšího vagonu.",
      "Do Olomouce dorazila včas a teta jí na nástupišti mávala už z dálky.",
  ],
  "skolni-predstaveni": [
      "Kuba dostal ve školním představení roli krále a týdny se učil svoji jedinou dlouhou repliku.",
      "Těsně před začátkem představení ale zjistil, že mu ze scény zmizela papírová koruna.",
      "Za oponou horečně prohledával krabice s kostýmy, zatímco diváci v sále už netrpělivě čekali.",
      "Najednou si všiml, že jeho korunu má omylem na hlavě spolužačka, která hrála princeznu.",
      "Rychle si koruny vyměnili a představení pak sklidilo velký potlesk.",
  ],
  "ztracene-morce": [
      "Bára měla doma morče jménem Skvrnka, kterému každý den po škole čistila klec.",
      "Jednou odpoledne našla klec otevřenou a Skvrnka v ní nebyla.",
      "Prohledávala byt pokoj po pokoji a se strachem si představovala, co všechno se morčeti mohlo stát.",
      "Z krabice od bot pod postelí se vtom ozvalo tiché chroupání a vykoukla z ní Skvrnka.",
      "Od té chvíle si Bára dávala pozor, aby klec vždycky pořádně zavřela.",
  ],
  "vyprava-do-sklepa": [
      "Petr s bratrancem se rozhodli o víkendu prozkoumat starý sklep na chalupě, kam se báli chodit sami.",
      "Sotva otevřeli vrzající dveře, uslyšeli ze tmy podivné škrábání.",
      "Stáli na schodech s baterkou v ruce a zvuk se ozýval čím dál blíž k nim.",
      "Když konečně posvítili do rohu, zablýskly se tam dvě oči – byla to jen sousedova kočka, která se schovala před deštěm.",
      "Kočku odnesli sousedům a ze sklepa si pak udělali oblíbené místo na hraní.",
  ],
  "vylet-na-kole": [
      "Adéla se s tátou v neděli ráno vydala na první delší cyklovýlet podél řeky.",
      "Na půli cesty ale zaslechla podivné syčení a zjistila, že jí praskla duše v zadním kole.",
      "Stáli uprostřed lesa bez signálu a slunce se pomalu chýlilo k obzoru.",
      "Táta se najednou usmál a z brašny vytáhl náhradní duši i pumpičku, které si přibalil pro jistotu.",
      "Domů dorazili jen o půl hodiny později, než plánovali.",
  ],
  "novy-spoluzak": [
      "Do třídy přišel po Vánocích nový spolužák Filip, který ve škole ještě nikoho neznal.",
      "O přestávce si ale všiml, že si z něj dva kluci ze třídy dělají legraci kvůli jeho výslovnosti.",
      "Stál sám uprostřed chodby a nevěděl, jestli se má bránit nebo raději mlčet.",
      "Vtom se ho ale zastala Karolína a hlasitě řekla, že si z nikoho legraci dělat nebudou.",
      "Od té chvíle Filip s Karolínou o přestávkách sedávali spolu a brzy z nich byli kamarádi.",
  ],
  "rodinny-obed": [
      "V neděli chystala Klára s bratrem Vojtou oběd k babiččiným narozeninám.",
      "Když otevřeli troubu, zjistili, že kuře je spálené na uhel.",
      "Za půl hodiny měla přijít celá rodina a v kuchyni to štiplavě páchlo spáleninou.",
      "Vojtu vtom napadlo podívat se do mrazáku a tam našli velkou krabici tátova guláše.",
      "Babička si guláš pochvalovala a o spáleném kuřeti se dozvěděla, až když jí to vnoučata sama přiznala.",
  ],
  "sachovy-turnaj": [
      "Vítek jel v sobotu na svůj první šachový turnaj, i když ho cestou trochu bolelo v krku.",
      "Los mu hned do prvního kola přidělil loňského vítěze celého turnaje.",
      "Po dvou hodinách hry zbývala Vítkovi na hodinách jediná minuta a soupeř mu hrozil matem.",
      "Soupeř si však v rychlosti nevšiml Vítkova koně a jediným tahem přišel o dámu.",
      "Partii Vítek vyhrál a domů si odvezl pohár pro nejlepšího nováčka.",
  ],
  "koncert": [
      "Eliška hrála na flétnu a v pátek měla vystoupit na školním koncertě, ačkoli venku od rána lilo.",
      "Hodinu před koncertem jí flétna spadla na zem a spodní díl se ohnul tak, že nešel nasadit.",
      "Moderátorka už ohlašovala její jméno a Eliška stála za oponou jen s polovinou nástroje v ruce.",
      "V poslední chvíli jí pan učitel hudby přinesl z kabinetu svou vlastní flétnu.",
      "Eliška zahrála bez jediné chyby a učiteli pak flétnu s poděkováním vrátila.",
  ],
  "pes-v-parku": [
      "Martin venčil v parku sousedova psa Arga a trochu se zlobil, že kvůli tomu nestihne oblíbený seriál.",
      "U rybníka se Argo vysmekl z obojku a rozběhl se za kachnami.",
      "Martin volal jeho jméno do houstnoucí tmy, ale z křoví se ozývalo jen šustění listí.",
      "Když už to chtěl vzdát, přiběhl Argo celý mokrý sám od sebe a olízl mu ruku.",
      "Sousedovi Martin všechno po pravdě pověděl a od té doby Argovi vždycky pořádně utáhl obojek.",
  ],
  "referat": [
      "Anežka měla v pondělí odevzdat referát o sovách a starší bratr jí k tomu celé odpoledne pouštěl hlasitou hudbu.",
      "Večer počítač najednou zčernal a s ním zmizel i celý rozepsaný referát.",
      "Byla skoro půlnoc, Anežka seděla nad prázdnou obrazovkou a věděla, že za jednu noc všechno znovu nenapíše.",
      "Bratr vtom přišel na to, že se referát průběžně ukládal i na internet, a Anežka měla referát za minutu zpátky.",
      "V pondělí dostala Anežka za referát jedničku a bratrovi hudbu už nevyčítala.",
  ],
  "stanovani": [
      "Ríša s tátou jeli na víkend stanovat k přehradě, i když Ríša nerad spal ve spacáku.",
      "Při stavění stanu zjistili, že doma nechali všechny kolíky.",
      "Zvedal se vítr, nepřipevněný stan se nafukoval jako plachta a od západu se blížila bouřka.",
      "Ríšu vtom napadlo zatížit rohy stanu velkými kameny z břehu.",
      "Stan vydržel celou noc a Ríša ve spacáku spal jako nikdy předtím.",
  ],
  "jarmark": [
      "Na školní jarmark připravila třída 6. B stánek s perníčky a Nela, která nerada počítala, dostala na starost pokladnu.",
      "Ráno našli krabici s perníčky rozmočenou, protože přes noc zůstala venku na dešti.",
      "K prázdnému stánku se už sbíhali první zákazníci a ve třídě nikdo nevěděl, co jim nabídnout.",
      "Nela přišla s nápadem prodávat místo perníčků horký čaj a záložky, které třída vyrobila minulý týden.",
      "Stánek vydělal víc, než čekali, a Nela zjistila, že počítat peníze ji vlastně baví.",
  ],
};

// Nezávisle zapsané klíčové slovo skutečné zápletky (pro subtyp L3-d).
const SOLVER_ZAPLETKA_KEYWORD: Record<string, string> = {
  "sachovy-turnaj": "loňského",
  "koncert": "ohnula",
  "pes-v-parku": "vysmekl",
  "referat": "počítač",
  "stanovani": "kolíky",
  "jarmark": "zmokly",
};

// Nezávisle zapsaná definiční otázka L1 → očekávaná část.
const REVERSE_DEFINE: Record<string, Cast> = {
  "Která část vyprávění představí, kdo, kde a kdy se příběh odehrává, a problém v ní ještě nevzniká?": "úvod",
  "Ve které části se poprvé objeví problém, který rozjede děj?": "zápletka",
  "Která část vyprávění je chvílí s největším napětím, kdy se rozhoduje, jak vše dopadne?": "vyvrcholení",
  "Která část vyprávění přináší nečekanou změnu, po které se děj stočí jinam a směřuje k rozuzlení?": "obrat",
  "Která část vyprávění příběh uzavírá a ukazuje, jak vše dopadlo?": "závěr",
};

/** Najde (příběh, index) věty v SOLVER_STAVBA. Null = nenalezena. */
function najdiVetu(veta: string): { storyId: string; idx: number } | null {
  for (const [storyId, vety] of Object.entries(SOLVER_STAVBA)) {
    const idx = vety.indexOf(veta);
    if (idx !== -1) return { storyId, idx };
  }
  return null;
}

function extractQuoted(q: string): string[] {
  return [...q.matchAll(/„([^“]+)“/g)].map((m) => m[1]);
}

/** Jediný index, jehož odebrání napraví ryze rostoucí pořadí. */
function najdiPoruseneMisto(arr: number[]): number {
  for (let skip = 0; skip < arr.length; skip++) {
    const rest = arr.filter((_, i) => i !== skip);
    const rostouci = rest.every((v, i) => i === 0 || v > rest[i - 1]);
    if (rostouci) return skip;
  }
  throw new Error(`najdiPoruseneMisto: žádné odebrání nenapraví pořadí ${arr.join(",")}`);
}

/** Rozparsuje "1) věta 2) věta …" na pole vět. */
function rozparsujOsnovu(text: string): string[] {
  return text
    .split(/\d\)\s/)
    .slice(1)
    .map((s) => s.trim());
}

/** Ověří jednu úlohu podle typu (rozpoznaného ze znění otázky) nezávislou cestou. */
function overUlohu(t: PracticeTask) {
  const q = t.question;

  if (q.startsWith("Přečti si větu z vyprávění: „")) {
    // L1 — citovaná věta
    const [veta] = extractQuoted(q);
    const found = najdiVetu(veta);
    expect(found, `L1 citace: věta „${veta}“ není v SOLVER_STAVBA`).not.toBeNull();
    expect(t.correctAnswer).toBe(PARTS[found!.idx]);
    // Z vytržené věty jsou jednoznačné jen úvod, zápletka a závěr.
    expect(["úvod", "zápletka", "závěr"], `L1 citace se ptá na „${t.correctAnswer}“`).toContain(t.correctAnswer);
    return;
  }

  if (q in REVERSE_DEFINE) {
    // L1 — definice pojmu
    expect(t.correctAnswer).toBe(REVERSE_DEFINE[q]);
    return;
  }

  if (q.includes("Kterou částí vyprávění je tahle věta: „")) {
    // L2 — vyznačená věta v kontextu příběhu
    const quoted = extractQuoted(q);
    const veta = quoted[quoted.length - 1];
    const found = najdiVetu(veta);
    expect(found, `L2 marked: věta „${veta}“ není v SOLVER_STAVBA`).not.toBeNull();
    expect(t.correctAnswer).toBe(PARTS[found!.idx]);
    return;
  }

  if (q.endsWith("Ve které z vět zápletka začíná?")) {
    // L2 — zápletka mezi větami příběhu
    const found = najdiVetu(t.correctAnswer);
    expect(found, `L2 zacatek: klíč "${t.correctAnswer}" není v SOLVER_STAVBA`).not.toBeNull();
    expect(found!.idx).toBe(1); // zápletka = index 1
    return;
  }

  if (q.includes("Která věta podle stavby vyprávění přijde hned jako další?")) {
    // L2 — co následuje (klíč = index o 1 vyšší než poslední ukázaná věta)
    const pre = q.slice(
      "Přečti si text: ".length,
      q.indexOf(" Která věta podle stavby vyprávění přijde"),
    );
    let match: { storyId: string; k: number } | null = null;
    for (const [storyId, vety] of Object.entries(SOLVER_STAVBA)) {
      for (let k = 1; k <= 4; k++) {
        if (vety.slice(0, k).join(" ") === pre) match = { storyId, k };
      }
    }
    expect(match, `L2 nasleduje: text „${pre}“ neodpovídá žádnému prefixu ze SOLVER_STAVBA`).not.toBeNull();
    expect(t.correctAnswer).toBe(SOLVER_STAVBA[match!.storyId][match!.k]);
    // Distraktor nesmí být věta, která už v zobrazeném textu zazněla.
    for (const opt of t.options ?? []) {
      if (opt === t.correctAnswer) continue;
      expect(pre.includes(opt), `L2 nasleduje: distraktor „${opt}“ už stojí v textu`).toBe(false);
    }
    return;
  }

  if (q.includes("Kterou větou by vyprávění začínalo, kdyby šlo chronologicky")) {
    // L3(a) — retrospektivní text → klíč = věta příběhu s nejnižším indexem
    const found = (t.options ?? []).map((o) => ({ o, f: najdiVetu(o) }));
    found.forEach(({ o, f }) => expect(f, `L3a: možnost „${o}“ není v SOLVER_STAVBA`).not.toBeNull());
    expect(new Set(found.map((x) => x.f!.storyId)).size).toBe(1);
    const nejdriv = found.reduce((a, b) => (b.f!.idx < a.f!.idx ? b : a));
    expect(t.correctAnswer).toBe(nejdriv.o);
    expect(nejdriv.f!.idx).toBe(0);
    // Text nesmí začínat klíčem (jinak by nešlo o retrospektivu).
    expect(q.startsWith(`Přečti si text: ${t.correctAnswer}`)).toBe(false);
    return;
  }

  if (q.includes("Která věta stojí v tomhle pořadí na špatném místě?")) {
    // L3(b) — porušená posloupnost
    const text = q.slice(
      "Přečti si text: Vyprávění je poskládané takhle: ".length,
      q.indexOf(" Která věta stojí v tomhle pořadí na špatném místě?"),
    );
    const vety = rozparsujOsnovu(text);
    expect(vety).toHaveLength(5);
    const lookups = vety.map((v) => najdiVetu(v));
    lookups.forEach((f, i) => expect(f, `L3b: věta "${vety[i]}" není v SOLVER_STAVBA`).not.toBeNull());
    const storyIds = new Set(lookups.map((f) => f!.storyId));
    expect(storyIds.size, "L3b: všech 5 vět musí být ze stejného příběhu").toBe(1);
    const idxArr = lookups.map((f) => f!.idx);
    const violatorPos = najdiPoruseneMisto(idxArr);
    // Jednoznačnost: pořadí napraví vyjmutí právě jedné věty.
    const opravy = idxArr.filter((_, skip) => {
      const r = idxArr.filter((__, i) => i !== skip);
      return r.every((v, i) => i === 0 || v > r[i - 1]);
    });
    expect(opravy, `L3b: pořadí ${idxArr.join(",")} má víc možných odpovědí`).toHaveLength(1);
    expect(t.correctAnswer).toBe(`věta č. ${violatorPos + 1}`);
    return;
  }

  if (q.includes("Jedna část chybí. Která?")) {
    // L3(c) — chybějící část osnovy
    const start = q.indexOf("má jen čtyři body: ") + "má jen čtyři body: ".length;
    const text = q.slice(start, q.indexOf(" Jedna část chybí."));
    const vety = rozparsujOsnovu(text);
    expect(vety).toHaveLength(4);
    let storyMissing: Cast | null = null;
    for (const vetyStory of Object.values(SOLVER_STAVBA)) {
      const idxs = vety.map((v) => vetyStory.indexOf(v));
      if (idxs.every((i) => i !== -1)) {
        const missingIdx = [0, 1, 2, 3, 4].find((i) => !idxs.includes(i))!;
        storyMissing = PARTS[missingIdx];
        break;
      }
    }
    expect(storyMissing, `L3c: osnova neodpovídá žádnému příběhu v SOLVER_STAVBA`).not.toBeNull();
    expect(t.correctAnswer).toBe(storyMissing);
    return;
  }

  if (q.includes("Které tvrzení vystihuje skutečnou zápletku celého příběhu?")) {
    // L3(d) — skutečná zápletka × vedlejší nepříjemnost/úvod/vyvrcholení, ověřeno klíčovým slovem
    const text = q.slice(
      "Přečti si text: ".length,
      q.indexOf(" Které tvrzení vystihuje skutečnou zápletku"),
    );
    const storyId = Object.keys(SOLVER_STAVBA).find(
      (id) => SOLVER_STAVBA[id].join(" ") === text,
    );
    expect(storyId, "L3d: text vyprávění neodpovídá žádnému příběhu v SOLVER_STAVBA").toBeDefined();
    const keyword = SOLVER_ZAPLETKA_KEYWORD[storyId!].toLowerCase();
    expect(t.correctAnswer.toLowerCase().includes(keyword)).toBe(true);
    for (const opt of t.options ?? []) {
      if (opt === t.correctAnswer) continue;
      expect(opt.toLowerCase().includes(keyword), `L3d: distraktor "${opt}" obsahuje klíčové slovo zápletky`).toBe(false);
    }
    return;
  }

  throw new Error(`Neznámý typ úlohy (nedaří se rozpoznat šablonu): "${q}"`);
}

// ── Strukturální kontroly (options, optionFeedback, hints) ──────────────
function overStrukturu(t: PracticeTask) {
  expect(t.options?.length).toBe(4);
  expect(t.options).toContain(t.correctAnswer);
  expect(new Set(t.options).size).toBe(4);
  const distractors = (t.options ?? []).filter((o) => o !== t.correctAnswer);
  expect(distractors).toHaveLength(3);
  for (const d of distractors) {
    expect(t.optionFeedback?.[d], `chybí optionFeedback pro "${d}"`).toBeTruthy();
  }
  expect(t.hints?.length).toBe(2);
  expect(t.hints![0]).not.toBe(t.hints![1]);
  for (const h of t.hints ?? []) {
    // Hint nesmí obsahovat přesný klíč. Je-li klíčem přímo název části
    // (úlohy typu „která je to část"), nesmí ho hint jmenovat vůbec — u
    // úloh, kde je klíčem celá věta/fráze (např. L2 „zápletka začíná",
    // L3d „skutečná zápletka"), je pojem v hintu naopak žádoucí výklad
    // metody a leak hlídá jen přesná shoda s korrectAnswer.
    expect(h.includes(t.correctAnswer), `nápověda prozrazuje klíč: "${h}"`).toBe(false);
    if ((PARTS as string[]).includes(t.correctAnswer)) {
      expect(h.includes(t.correctAnswer), `nápověda jmenuje klíčovou část „${t.correctAnswer}“: "${h}"`).toBe(false);
    }
  }
}

describe("Vyprávění — výstavba, kompozice, zápletka (solver)", () => {
  it("L1: nezávislý solver potvrzuje klíč u vzorku úloh", () => {
    const tasks = topic.generator(1);
    expect(tasks.length).toBeGreaterThanOrEqual(12);
    tasks.forEach((t) => {
      overUlohu(t);
      overStrukturu(t);
    });
  });

  it("L2: nezávislý solver potvrzuje klíč u vzorku úloh", () => {
    const tasks = topic.generator(2);
    expect(tasks.length).toBeGreaterThanOrEqual(12);
    tasks.forEach((t) => {
      overUlohu(t);
      overStrukturu(t);
    });
  });

  it("L3: nezávislý solver potvrzuje klíč u vzorku úloh", () => {
    const tasks = topic.generator(3);
    expect(tasks.length).toBeGreaterThanOrEqual(12);
    tasks.forEach((t) => {
      overUlohu(t);
      overStrukturu(t);
    });
  });

  it("L1 a L3 mají disjunktní znění otázek", () => {
    const q1 = new Set(topic.generator(1).map((t) => t.question));
    const q3 = new Set(topic.generator(3).map((t) => t.question));
    const prunik = [...q1].filter((q) => q3.has(q));
    expect(prunik).toHaveLength(0);
  });

  it("SOLVER_STAVBA: každá věta je v bance jen jednou (jednoznačné určení)", () => {
    const all = Object.values(SOLVER_STAVBA).flat();
    expect(new Set(all).size).toBe(all.length);
    expect(all.length).toBe(90);
  });

  it("příběhy se mezi úrovněmi neopakují (disjunktní banky L1/L2/L3)", () => {
    const pribehyUrovne = (level: number) => {
      const ids = new Set<string>();
      for (let i = 0; i < 3; i++) {
        for (const t of topic.generator(level)) {
          const texty = [t.question, ...(t.options ?? [])];
          for (const [id, vety] of Object.entries(SOLVER_STAVBA)) {
            if (vety.some((v) => texty.some((x) => x.includes(v)))) ids.add(id);
          }
        }
      }
      return ids;
    };
    const [a, b, c] = [pribehyUrovne(1), pribehyUrovne(2), pribehyUrovne(3)];
    expect([...a].filter((id) => b.has(id) || c.has(id))).toHaveLength(0);
    expect([...b].filter((id) => c.has(id))).toHaveLength(0);
  });

  it("zpětná vazba a vysvětlení neskládají „věta, která je chvíle“", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        const texty = [t.explanation ?? "", ...Object.values(t.optionFeedback ?? {})];
        for (const x of texty) {
          expect(x, `neidiomatické skládání: ${x}`).not.toMatch(/která je chvíle|věta je chvíle|v ní ještě nevzniká\. Zápletka/);
        }
      }
    }
  });

  it("gen() je deterministický bez sdíleného stavu (opakované volání nekolabuje)", () => {
    for (let i = 0; i < 3; i++) {
      expect(topic.generator(1).length).toBeGreaterThanOrEqual(12);
      expect(topic.generator(2).length).toBeGreaterThanOrEqual(12);
      expect(topic.generator(3).length).toBeGreaterThanOrEqual(12);
    }
  });
});
