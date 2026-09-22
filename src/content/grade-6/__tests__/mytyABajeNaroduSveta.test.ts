import { describe, it, expect } from "vitest";
import { MYTY_A_BAJE_NARODU_SVETA, skupinaUlohy, tematUlohy } from "../cjl/mytyABajeNaroduSveta";
import type { PracticeTask } from "@/lib/types";

/**
 * Mýty a báje národů světa — čeština 6. ročník (select_one).
 *
 * NEZÁVISLÝ SOLVER (druhá cesta, nečte interní pole generátoru):
 *  1. Tabulka postava → čin → kultura přepsaná ručně z fakt — ověří L1(b)/(c).
 *  2. Žánrový klasifikátor L2(b) podle klíčových slov (bohové/vznik/hrom/
 *     slunce/nebe → báje; skutečné místní jméno → pověst; „bylo nebylo“ /
 *     kouzelný předmět → pohádka; mluvící zvířata a ponaučení → bajka).
 *  3. Tabulka postava L2(a) přepsaná ručně.
 *  4. Tabulka spojení → význam L3(a), ověří že spojení je ve větě obsažené.
 *  5. Obecné kontroly: 4 možnosti / 1 správná, optionFeedback, hints,
 *     correctAnswer mimo otázku, klíč ne systematicky nejdelší, L1≠L3 texty.
 */
const topic = MYTY_A_BAJE_NARODU_SVETA[0];

describe("Mýty a báje národů světa — metadata", () => {
  it("čeština g6, select_one, Literární výchova / Lidová slovesnost", () => {
    expect(topic.subject).toBe("čeština");
    expect(topic.gradeRange).toEqual([6, 6]);
    expect(topic.inputType).toBe("select_one");
    expect(topic.id).toBe("g6-cjl-myty-a-baje-narodu-sveta-6");
    expect(topic.rvpNodeId).toBe("g6-cjl-literarni-vychova-lidova-slovesnost-myty-a-baje-narodu-sveta");
    expect(topic.category).toBe("Literární výchova");
    expect(topic.topic).toBe("Lidová slovesnost");
  });
});

// ── 1. NEZÁVISLÝ SOLVER: postava → čin → kultura ────────────────────────────
// Tabulka přepsaná ručně, nezávisle na poli FAKTA generátoru.

const TABULKA_FAKT: Record<string, { tvrzeni: string; kultura: string }> = {
  "Prométheus": { tvrzeni: "Přinesl lidem oheň.", kultura: "řecké" },
  "Ikaros": { tvrzeni: "Vzlétl na křídlech z peří a vosku a zřítil se.", kultura: "řecké" },
  "Héraklés": { tvrzeni: "Vykonal dvanáct úkolů.", kultura: "řecké" },
  "Theseus": { tvrzeni: "Zabil Minotaura v labyrintu.", kultura: "řecké" },
  "Odysseus": { tvrzeni: "Dlouho se vracel domů z trojské války.", kultura: "řecké" },
  "Zeus": { tvrzeni: "Je nejvyšší řecký bůh a vládce blesku.", kultura: "řecké" },
  "Poseidon": { tvrzeni: "Je bůh moře.", kultura: "řecké" },
  "Thor": { tvrzeni: "Je severský bůh hromu s kladivem.", kultura: "severské" },
  "Gilgameš": { tvrzeni: "Je hrdina nejstaršího známého eposu z Mezopotámie.", kultura: "mezopotamské" },
};
const VSECHNY_OSOBY = Object.keys(TABULKA_FAKT);
const VSECHNA_TVRZENI = Object.values(TABULKA_FAKT).map((f) => f.tvrzeni);

describe("NEZÁVISLÝ SOLVER 1: L1 postava → čin sedí s ručně přepsanou tabulkou", () => {
  it("směr 1 (Co platí o postavě X?): klíč sedí s tabulkou, žádný distraktor není podle tabulky taky správně", () => {
    const l1 = topic.generator(1);
    const smer1 = l1.filter((t) => t.question.startsWith("Co platí o postavě "));
    let overeno = 0;
    for (const t of smer1) {
      const m = t.question.match(/^Co platí o postavě (.+) podle báje\?$/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const osoba = m![1];
      const ocekavano = TABULKA_FAKT[osoba];
      expect(ocekavano, `postava není v tabulce: ${osoba}`).toBeDefined();
      expect(t.correctAnswer, `klíč nesedí pro ${osoba}`).toBe(ocekavano.tvrzeni);
      // žádný distraktor nesmí být tvrzení, které v tabulce patří JINÉ osobě a zároveň je shodné s klíčem (duplicitně správné)
      for (const opt of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(opt, `distraktor duplicitně správný u ${osoba}: ${opt}`).not.toBe(ocekavano.tvrzeni);
      }
      overeno++;
    }
    expect(overeno).toBeGreaterThanOrEqual(9);
  });

  it("směr 2 (Kdo podle báje ...?): klíč je platná osoba z tabulky a odpovídá tvrzení v otázce", () => {
    const l1 = topic.generator(1);
    // „Kdo podle báje …?" i ručně psané varianty „Kdo se podle báje …?" / „Kdo je podle báje …?"
    const smer2 = l1.filter((t) => /^Kdo (se |je )?podle báje /u.test(t.question));
    let overeno = 0;
    for (const t of smer2) {
      expect(VSECHNY_OSOBY, `klíč mimo tabulku: ${t.correctAnswer}`).toContain(t.correctAnswer);
      const ocekavano = TABULKA_FAKT[t.correctAnswer];
      const fragment = ocekavano.tvrzeni.replace(/\.$/, "").toLowerCase();
      // otázka musí obsahovat fragment tvrzení odpovídající klíči (case-insensitive, dovolí drobné tvarové odchylky u "se")
      const otazkaLower = t.question.toLowerCase();
      const klicovaSlova = fragment.split(" ").filter((w) => w.length >= 4);
      for (const slovo of klicovaSlova) {
        expect(otazkaLower.includes(slovo), `otázka "${t.question}" neobsahuje klíčové slovo "${slovo}" z tvrzení klíče`).toBe(true);
      }
      overeno++;
    }
    expect(overeno).toBeGreaterThanOrEqual(9);
  });

  it("kombinace obou směrů je aspoň 14 (spec: 'nejméně 14 kombinací')", () => {
    const l1 = topic.generator(1);
    const kombinaci = l1.filter(
      (t) => t.question.startsWith("Co platí o postavě ") || /^Kdo (se |je )?podle báje /u.test(t.question),
    ).length;
    expect(kombinaci).toBeGreaterThanOrEqual(14);
  });
});

describe("NEZÁVISLÝ SOLVER 1b: L1 kultura sedí s tabulkou", () => {
  it("Ke kterým bájím patří...: klíč sedí s tabulkou, žádný distraktor není taky správně", () => {
    const l1 = topic.generator(1);
    const kult = l1.filter((t) => t.question.startsWith("Ke kterým bájím patří postava "));
    let overeno = 0;
    for (const t of kult) {
      const m = t.question.match(/^Ke kterým bájím patří postava (.+)\?$/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const osoba = m![1];
      const ocekavano = TABULKA_FAKT[osoba];
      expect(ocekavano, `postava není v tabulce: ${osoba}`).toBeDefined();
      expect(t.correctAnswer, `klíč nesedí pro ${osoba}`).toBe(`${ocekavano.kultura} báje`);
      overeno++;
    }
    expect(overeno).toBeGreaterThanOrEqual(9);
  });
});

describe.each([1, 2, 3])("Mýty a báje národů světa — úlohy level %i", (level) => {
  const tasks = topic.generator(level);

  it("≥12 unikátních úloh", () => {
    const keys = new Set(tasks.map((t) => `${t.question}|${t.correctAnswer}`));
    expect(keys.size).toBeGreaterThanOrEqual(12);
  });

  it("4 různé možnosti, správná je mezi nimi", () => {
    for (const t of tasks) {
      expect(t.options!.length, t.question).toBe(4);
      expect(new Set(t.options).size, `duplicitní options: ${t.question}`).toBe(4);
      expect(t.options, `correctAnswer mimo options: ${t.question}`).toContain(t.correctAnswer);
    }
  });

  it("chybový model: každý distraktor má feedback, správná ne", () => {
    for (const t of tasks) {
      for (const key of Object.keys(t.optionFeedback!)) {
        expect(t.options, `feedback klíč mimo options: ${key}`).toContain(key);
        expect(key).not.toBe(t.correctAnswer);
      }
      for (const d of t.options!.filter((o) => o !== t.correctAnswer)) {
        expect(t.optionFeedback![d], `chybí feedback: "${d}" v ${t.question}`).toBeTruthy();
      }
    }
  });

  it("nápověda neprozrazuje výsledek (2 unikátní nápovědy)", () => {
    for (const t of tasks) {
      expect(t.hints?.length, t.question).toBeGreaterThanOrEqual(2);
      expect(t.hints![0]).not.toBe(t.hints![1]);
      for (const h of t.hints ?? []) {
        expect(h, `hint leak: ${t.question}`).not.toContain(t.correctAnswer);
      }
    }
  });

  it("správná odpověď se nevyskytuje ve znění otázky", () => {
    for (const t of tasks) {
      expect(t.question.includes(t.correctAnswer), `correctAnswer v otázce: ${t.question}`).toBe(false);
    }
  });

  it("každá úloha má vysvětlení", () => {
    for (const t of tasks) {
      expect(t.explanation, t.question).toBeTruthy();
    }
  });

  it("klíč není systematicky nejdelší možnost", () => {
    const nejdelsiJeKlic = tasks.filter((t) => {
      const maxLen = Math.max(...t.options!.map((o) => o.length));
      return t.correctAnswer.length === maxLen;
    }).length;
    expect(nejdelsiJeKlic / tasks.length, "klíč = nejdelší možnost příliš často").toBeLessThan(0.8);
  });
});

describe("Mýty a báje národů světa — L1 a L3 jsou textově disjunktní", () => {
  it("L1 a L3 otázky se nepřekrývají", () => {
    const l1 = new Set(topic.generator(1).map((t) => t.question));
    const l3 = topic.generator(3).map((t) => t.question);
    for (const q of l3) expect(l1.has(q), `L3 otázka se opakuje v L1: ${q}`).toBe(false);
  });
});

// ── 2. NEZÁVISLÝ SOLVER: L2(b) žánrový klasifikátor podle klíčových slov ────

// "boh" jako kmen chytne i skloněné tvary (boha, bohu, bohové, bohyně, bohem…), "bůh" navíc nominativ.
const BUH_MARKERY = ["bůh", "boh", "nesmrtel"];
const MISTNI_JMENA = ["blaník", "vyšehrad", "říp", "karlštejn", "radhošť", "karlově mostě", "vltavy", "prahy"];
const POHADKA_MARKERY = ["bylo nebylo", "za sedmero", "za devatero", "kouzeln", "trpaslík", "čarodějnic"];
const ZVIRE_MARKERY = ["kohout", "slepic", "netopýr", "krysa", "kočka", "beránek", "kůzle", "žába", "vůl", "rak", "housenka", "motýl", "lev", "myšk"];

function obsahujeNejakou(text: string, seznam: string[]): boolean {
  const t = text.toLowerCase();
  return seznam.some((s) => t.includes(s));
}

function klasifikujZanrL2(text: string): "báje" | "pověst" | "pohádka" | "bajka" | null {
  const maMistniJmeno = obsahujeNejakou(text, MISTNI_JMENA);
  if (maMistniJmeno) return "pověst";
  const maZvire = obsahujeNejakou(text, ZVIRE_MARKERY);
  if (maZvire) return "bajka";
  const maPohadku = obsahujeNejakou(text, POHADKA_MARKERY);
  if (maPohadku) return "pohádka";
  const maBoha = obsahujeNejakou(text, BUH_MARKERY);
  if (maBoha) return "báje";
  return null;
}

describe("NEZÁVISLÝ SOLVER 2: L2(b) žánrový klasifikátor sedí s klíčem", () => {
  it("každá L2(b) ukázka se jednoznačně klasifikuje a shoduje se s correctAnswer", () => {
    const l2 = topic.generator(2);
    const zanrove = l2.filter((t) => t.question.startsWith("Přečti si ukázku. Jaký útvar to je?"));
    let overeno = 0;
    for (const t of zanrove) {
      const m = t.question.match(/Jaký útvar to je\? „(.+)“/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const text = m![1];
      const vysledek = klasifikujZanrL2(text);
      expect(vysledek, `nejednoznačná/chybějící klasifikace: ${text}`).not.toBeNull();
      expect(vysledek, `klasifikátor nesouhlasí s klíčem: ${text}`).toBe(t.correctAnswer);
      // jméno postavy z L1 nesmí v ukázce zaznít
      for (const osoba of VSECHNY_OSOBY) {
        expect(text.includes(osoba), `ukázka jmenuje postavu ${osoba}: ${text}`).toBe(false);
      }
      overeno++;
    }
    expect(overeno).toBeGreaterThanOrEqual(12);
  });

  it("banka L2(b) obsahuje aspoň 8 ukázek na každý ze 4 žánrů", () => {
    const l2 = topic.generator(2);
    const zanrove = l2.filter((t) => t.question.startsWith("Přečti si ukázku. Jaký útvar to je?"));
    const poZanru = (z: string) => zanrove.filter((t) => t.correctAnswer === z).length;
    expect(poZanru("báje")).toBeGreaterThanOrEqual(8);
    expect(poZanru("pověst")).toBeGreaterThanOrEqual(8);
    expect(poZanru("pohádka")).toBeGreaterThanOrEqual(8);
    expect(poZanru("bajka")).toBeGreaterThanOrEqual(8);
  });
});

// ── 3. NEZÁVISLÝ SOLVER: L2(a) postava podle ukázky ──────────────────────────

const TABULKA_POSTAVA_UKAZKA: Record<string, string> = {
  "Mladík si s otcovou pomocí přidělal na záda křídla slepená voskem. Otec ho varoval, ať nelétá moc vysoko, ale on neposlechl, vzlétl blízko slunci, vosk mu roztál a zřítil se do moře.": "Ikaros",
  "Jeden z Titánů se slitoval nad lidmi, kteří žili ve tmě a zimě bez ohně. Ukradl bohům jiskru a přinesl ji lidem, i když věděl, že ho za to čeká přísný trest.": "Prométheus",
  "Hrdina musel z rozkazu krále splnit dvanáct takřka nesplnitelných úkolů, mezi nimi zabít mnohohlavou saň a přinést zlatá jablka ze zahrady bohů.": "Héraklés",
  "Mladík se dobrovolně vydal do labyrintu, aby zabil netvora s býčí hlavou, kterému museli každý devátý rok posílat lidské oběti. Cestu ven si pak našel podle klubka nitě, které mu dala jedna z královských dcer.": "Theseus",
  "Král se po vítězné válce vydal na cestu domů, ale bohové mu do ní stavěli jednu překážku za druhou. Cesta se protáhla na dlouhých deset let, než se konečně vrátil ke své ženě.": "Odysseus",
  "Nejmocnější z bohů sídlil na vysoké hoře a v hněvu házel na zem ohnivé blesky — proto se lidem na nebi občas zablýskne a zahřmí.": "Zeus",
  "Severský bůh nosil těžké kladivo, kterým dokázal přivolat bouři, a jeho síla byla podle vyprávění větší než síla kteréhokoli obra.": "Thor",
  "Mocný král starobylého města se podle nejstaršího známého vyprávění vydal hledat rostlinu věčného mládí, ale nakonec pochopil, že se se smrtí musí smířit každý člověk.": "Gilgameš",
};

describe("NEZÁVISLÝ SOLVER 3: L2(a) postava podle ukázky sedí s tabulkou", () => {
  it("klíč generátoru odpovídá nezávislé tabulce pro všech 8 ukázek", () => {
    const l2 = topic.generator(2);
    const postavy = l2.filter((t) => t.question.startsWith("Přečti si ukázku. O které postavě z bájí vypráví?"));
    let overeno = 0;
    for (const t of postavy) {
      const m = t.question.match(/„(.+)“$/u);
      expect(m, `nerozpoznaný text: ${t.question}`).not.toBeNull();
      const text = m![1];
      const ocekavano = TABULKA_POSTAVA_UKAZKA[text];
      expect(ocekavano, `ukázka není v tabulce: ${text}`).toBeDefined();
      expect(t.correctAnswer, `klíč nesedí pro: ${text}`).toBe(ocekavano);
      overeno++;
    }
    expect(overeno).toBe(8);
  });
});

// ── 4. NEZÁVISLÝ SOLVER: L3(a) ustálené spojení → význam ────────────────────

const TABULKA_IDIOM: Record<string, { fraze: string; vyznam: string }> = {
  "Po třídní oslavě zůstala učebna jako Augiášův chlév.": {
    fraze: "Augiášův chlév",
    vyznam: "Obrovský, dlouho zanedbaný nepořádek, jehož uklizení stojí spoustu času a sil.",
  },
  "Když se Tomáš ztratil v obřím nákupním centru, plánek u vchodu mu posloužil jako pravá Ariadnina nit.": {
    fraze: "Ariadnina nit",
    vyznam: "Spolehlivé vodítko, které pomůže najít cestu ven ze složité nebo spletité situace.",
  },
  "Kryštof exceloval ve všech předmětech kromě matematiky — ta byla jeho Achillova pata.": {
    fraze: "Achillova pata",
    vyznam: "Slabé, zranitelné místo jinak silného nebo úspěšného člověka.",
  },
  "Nový mazlíček od tety, o kterého se ale nikdo nechtěl starat, se pro rodinu ukázal jako pravý danajský dar.": {
    fraze: "danajský dar",
    vyznam: "Dar, který se navenek tváří jako výhoda, ale ve skutečnosti tomu, kdo ho přijme, spíš uškodí nebo přidělá starosti.",
  },
  "Zavedení telefonů do třídy se ukázalo jako pravá Pandořina skříňka plná nových problémů.": {
    fraze: "Pandořina skříňka",
    vyznam: "Něco, co po otevření nebo spuštění přinese celou řadu nečekaných potíží.",
  },
  "Přesvědčovat mladšího bratra, aby si po sobě uklízel, byla pro Elišku vyložená sisyfovská práce.": {
    fraze: "sisyfovská práce",
    vyznam: "Nekonečná, marná námaha, která nikdy nevede k trvalému výsledku, protože se práce pořád opakuje od začátku.",
  },
  "Hrozba, že škola zruší výlet kvůli počasí, visela nad třídou jako Damoklův meč až do posledního dne.": {
    fraze: "Damoklův meč",
    vyznam: "Stálý pocit ohrožení, že se každou chvíli může stát něco zlého.",
  },
};

describe("NEZÁVISLÝ SOLVER 4: L3(a) ustálené spojení sedí s tabulkou a je opravdu ve větě", () => {
  it("klíč generátoru odpovídá nezávislé tabulce pro všech 7 spojení a fráze je doslova obsažená ve větě", () => {
    const l3 = topic.generator(3);
    const idiomy = l3.filter((t) => t.question.startsWith("Co znamená spojení"));
    let overeno = 0;
    for (const t of idiomy) {
      const m = t.question.match(/^Co znamená spojení „(.+)“ v téhle větě\? „(.+)“$/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const [, fraze, veta] = m!;
      const ocekavano = TABULKA_IDIOM[veta];
      expect(ocekavano, `věta není v nezávislé tabulce: ${veta}`).toBeDefined();
      expect(fraze).toBe(ocekavano.fraze);
      expect(t.correctAnswer, `L3a klíč nesedí pro: ${veta}`).toBe(ocekavano.vyznam);
      expect(veta.includes(fraze), `spojení "${fraze}" není doslova obsažené ve větě: ${veta}`).toBe(true);
      overeno++;
    }
    expect(overeno).toBe(7);
  });
});

// ── 5. NEZÁVISLÝ SOLVER: L3(b) funkce mýtu — klíč se odvozuje OD UKÁZKY ────
// Tabulka přepsaná ručně: co ukázka vykládá → jaká funkce. Kdyby všechny
// položky měly stejný klíč, úloha by šla vyřešit bez čtení (dřívější vada).

const FUNKCE_JEV = "Vysvětlit přírodní jev, kterému lidé nerozuměli.";
const FUNKCE_PUVOD = "Vysvětlit, jak vznikl svět a první lidé.";
const FUNKCE_ZVYK = "Zdůvodnit obřad nebo zvyk, který lidé dodržovali.";

/** Nezávislý klasifikátor: co ukázka vykládá? */
function klasifikujFunkci(text: string): string | null {
  const t = text.toLowerCase();
  // zvyk = vyprávění končí u toho, co lidé dodnes/pravidelně dělají
  if (/dodnes|hospodáři|nesklízel|tancuj/u.test(t)) return FUNKCE_ZVYK;
  // počátek = svět, první lidé, "na počátku", "vznikl svět"
  if (/na počátku|první lidé|vznikl svět|prvn. lid/u.test(t)) return FUNKCE_PUVOD;
  // opakující se jev v přírodě
  if (/hrom|slunce|zima|blesk|duh|příliv|odliv|měsíc|bouř/u.test(t)) return FUNKCE_JEV;
  return null;
}

describe("NEZÁVISLÝ SOLVER 5: L3(b) funkce mýtu sedí s nezávislou klasifikací", () => {
  it("každá ukázka se klasifikuje a shoduje se s klíčem generátoru", () => {
    const l3 = topic.generator(3);
    const funkce = l3.filter((t) => t.question.startsWith("Přečti si ukázku. Jakou funkci mýtus měl?"));
    let overeno = 0;
    for (const t of funkce) {
      const m = t.question.match(/„(.+)“$/u);
      expect(m, `nerozpoznaný text: ${t.question}`).not.toBeNull();
      const text = m![1];
      expect(klasifikujFunkci(text), `klasifikátor nesouhlasí s klíčem: ${text}`).toBe(t.correctAnswer);
      expect(obsahujeNejakou(text, BUH_MARKERY), `ukázka nemluví o bohu: ${text}`).toBe(true);
      overeno++;
    }
    expect(overeno).toBeGreaterThanOrEqual(9);
  });

  it("banka L3(b) má aspoň tři různé správné odpovědi a žádná nepokrývá víc než dvě třetiny", () => {
    const funkce = topic.generator(3).filter((t) => t.question.startsWith("Přečti si ukázku. Jakou funkci mýtus měl?"));
    const podleKlice = new Map<string, number>();
    for (const t of funkce) podleKlice.set(t.correctAnswer, (podleKlice.get(t.correctAnswer) ?? 0) + 1);
    expect(podleKlice.size, "všechny ukázky mají stejný klíč — jde vyřešit bez čtení").toBeGreaterThanOrEqual(3);
    for (const [klic, pocet] of podleKlice) {
      expect(pocet / funkce.length, `klíč „${klic}" dominuje bance`).toBeLessThanOrEqual(2 / 3);
    }
  });

  it("vysvětlení není doslovná kopie správné možnosti", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        expect(t.explanation!.trim(), `explanation = kopie klíče: ${t.question}`).not.toBe(t.correctAnswer.trim());
      }
    }
  });
});

// ── 6. NEZÁVISLÝ SOLVER: L3(c) situace → hodnota/poučení báje ───────────────

const TABULKA_HODNOTA: Record<string, string> = {
  "Rodiče Kubovi zakázali plavat příliš daleko od břehu, protože proud tam bývá silný. Kuba je neposlechl, doplaval skoro doprostřed jezera a museli ho zachraňovat záchranáři.":
    "Ukazuje, jak nebezpečná může být nerozvážnost a nedbání varování druhých.",
  "Učitelka Elišku varovala, ať nezkouší nejtěžší sjezdovku hned první den na lyžích. Eliška ji neposlechla, vyrazila na ni sama a hned na začátku spadla a zranila se.":
    "Ukazuje, jak nebezpečná může být nerozvážnost a nedbání varování druhých.",
  "Ačkoli věděl, že se tím sám dostane do problémů s trenérem, Honza se přiznal, že rozbité okno na hřišti způsobil on, aby za to nebyl potrestaný celý tým.":
    "Ukazuje ochotu obětovat se nebo riskovat něco pro dobro druhých.",
  "Marek se o přestávkách vzdával svého oblíbeného místa v jídelně, aby si tam mohl sednout nový spolužák, který ve třídě ještě nikoho neznal.":
    "Ukazuje ochotu obětovat se nebo riskovat něco pro dobro druhých.",
  "Když se skupina na výletě ztratila v lese, Tereza vymyslela, jak si podle mechu na stromech poznamenat směr, a i po několika špatných odbočkách vytrvale hledala cestu, až všechny dovedla zpátky k autobusu.":
    "Ukazuje, že lest a vytrvalost dokážou překonat i dlouhou řadu překážek.",
  "Filip prohrál v deskové hře několikrát za sebou, ale pokaždé si všiml chyby ze svého předchozího tahu a vymyslel nový trik, až nakonec s vytrvalostí zvítězil.":
    "Ukazuje, že lest a vytrvalost dokážou překonat i dlouhou řadu překážek.",
};

describe("NEZÁVISLÝ SOLVER 6: L3(c) situace → hodnota báje sedí s tabulkou", () => {
  it("klíč generátoru odpovídá nezávislé tabulce pro všech 6 situací", () => {
    const l3 = topic.generator(3);
    const situace = l3.filter((t) => t.question.endsWith("Jakou hodnotu nebo poučení z báje tahle situace nejlépe připomíná?"));
    let overeno = 0;
    for (const t of situace) {
      const m = t.question.match(/^(.+) Jakou hodnotu nebo poučení z báje tahle situace nejlépe připomíná\?$/u);
      expect(m, `nerozpoznaný formát: ${t.question}`).not.toBeNull();
      const sit = m![1];
      const ocekavano = TABULKA_HODNOTA[sit];
      expect(ocekavano, `situace není v tabulce: ${sit}`).toBeDefined();
      expect(t.correctAnswer, `L3c klíč nesedí pro: ${sit}`).toBe(ocekavano);
      overeno++;
    }
    expect(overeno).toBe(6);
  });
});

// ── 7. Nápovědy: žádný nesmyslný sdílený dovětek, velká je opravdu větší ────

describe("Mýty a báje — nápovědy", () => {
  it("žádná nápověda nenese sdílený dovětek o dosazování do věty", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        for (const h of t.hints ?? []) expect(h, t.question).not.toContain("Dosaď každou možnost");
      }
    }
  });

  it("druhá nápověda je aspoň o pětinu delší než první", () => {
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        expect(t.hints![1].length, `velká nápověda není delší: ${t.question}`).toBeGreaterThanOrEqual(
          Math.ceil(t.hints![0].length * 1.2),
        );
      }
    }
  });

  it("nápověda neradí podle složení banky úloh (statistika místo znalosti)", () => {
    const zakazano = ["V tomhle tématu", "většina probíraných", "jen dvě jsou odjinud"];
    for (const level of [1, 2, 3]) {
      for (const t of topic.generator(level)) {
        for (const h of t.hints ?? []) {
          for (const z of zakazano) expect(h, t.question).not.toContain(z);
        }
      }
    }
  });
});

// ── 8. Prostřídání: jedno sezení neopakuje tentýž typ ani tentýž klíč ───────

describe("Mýty a báje — sezení nestřídá jen jméno v téže šabloně", () => {
  it("dvě po sobě jdoucí úlohy nepatří do stejné skupiny", () => {
    for (const level of [1, 2, 3]) {
      const tasks = topic.generator(level);
      for (let i = 1; i < tasks.length; i++) {
        expect(
          skupinaUlohy(tasks[i]),
          `L${level}: stejná skupina dvakrát po sobě u "${tasks[i].question.slice(0, 60)}"`,
        ).not.toBe(skupinaUlohy(tasks[i - 1]));
      }
    }
  });

  it("dvě po sobě jdoucí úlohy se neptají na tutéž postavu (jedna by druhou zodpověděla)", () => {
    for (const level of [1, 2, 3]) {
      const tasks = topic.generator(level);
      for (let i = 1; i < tasks.length; i++) {
        const tema = tematUlohy(tasks[i]);
        if (tema === "") continue;
        expect(tema, `L${level}: tatáž postava dvakrát po sobě — "${tasks[i].question.slice(0, 60)}"`).not.toBe(
          tematUlohy(tasks[i - 1]),
        );
      }
    }
  });

  it("prvních 6 úloh L1 má aspoň tři různé šablony otázek", () => {
    const sablony = new Set(
      topic.generator(1).slice(0, 6).map((t) => skupinaUlohy(t).split(":")[0]),
    );
    expect(sablony.size).toBeGreaterThanOrEqual(3);
  });
});

// ── 9. Věcné a jazykové kontroly, které chytily konkrétní nahlášené vady ────

describe("Mýty a báje — věcná a jazyková správnost", () => {
  const vsechny = () => [1, 2, 3].flatMap((l) => topic.generator(l));

  it("nikde se netvrdí, že se báje neváže ke skutečnému místu", () => {
    const zakazano = ["k žádnému skutečnému místu", "žádnému skutečnému místu se neváže"];
    for (const t of vsechny()) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {}), ...(t.options ?? [])];
      for (const s of texty) for (const z of zakazano) expect(s, t.question).not.toContain(z);
    }
  });

  it("žádný text neobsahuje nahlášené chybné tvary", () => {
    const chyby = [
      "desková hru",
      "kterému se každý potěší",
      "Proměna v zvíře",
      "mlýnek mlecí",
      "k řecké bájím",
      "k severské bájím",
      "k mezopotamské bájím",
      "Augiášova práce",
      "mrštil ze svého sídla na hoře.",
    ];
    for (const t of vsechny()) {
      const texty = [t.question, t.explanation ?? "", ...(t.hints ?? []), ...Object.values(t.optionFeedback ?? {}), ...(t.options ?? [])];
      for (const s of texty) for (const z of chyby) expect(s, `${z} → ${t.question.slice(0, 50)}`).not.toContain(z);
    }
  });

  it("Prométheus je v ukázce Titán, ne bůh (a zadání tím nerozděluje možnosti)", () => {
    const u = topic
      .generator(2)
      .find((t) => t.question.startsWith("Přečti si ukázku. O které postavě") && t.correctAnswer === "Prométheus")!;
    expect(u.question).toContain("Jeden z Titánů");
    expect(u.question.startsWith("Přečti si ukázku. O které postavě z bájí vypráví? „Bůh")).toBe(false);
  });

  it("danajský dar: doslovný distraktor je trojský kůň, opačný je štědrý dar", () => {
    const t = topic.generator(3).find((x) => x.question.includes("danajský dar"))!;
    const fb = t.optionFeedback!;
    const doslovny = Object.keys(fb).find((k) => fb[k].includes("doslovný popis"))!;
    const opacny = Object.keys(fb).find((k) => fb[k].includes("pravý opak"))!;
    expect(doslovny).toContain("dřevěný kůň");
    expect(opacny).toContain("štědrý dárek");
  });

  it("pověst o meči rytíře se lvem: meč je zazděný v mostě, nikdo ho nevykoval", () => {
    const t = topic.generator(2).find((x) => x.question.includes("Karlově mostě"))!;
    expect(t.question).toContain("zazděný");
    expect(t.question).not.toContain("vykoval");
  });
});
