/**
 * Čeština 6. ročník — Mýty a báje národů světa (select_one).
 *
 * Navazuje na grade-4/cjl/pohadkaPovestBajkaPovidka.ts (žánry lidové
 * slovesnosti) a na grade-6/cjl/povestRegionalniHistoricka.ts (odlišení
 * báje od pověsti). Dovednost: poznat báji podle znaků (bohové a mytičtí
 * hrdinové z doby před dějinami, často vysvětlení vzniku světa nebo
 * přírodního jevu), odlišit ji od pověsti/pohádky/bajky, znát nesporné
 * postavy a jejich činy a rozumět ustáleným spojením z bájí v dnešní
 * češtině.
 *
 * POZOR na rozlišovací znak: báje se ke skutečným místům váže běžně
 * (Olymp, Kréta, Trója, Uruk). Nerozlišujeme tedy podle PŘÍTOMNOSTI místa,
 * ale podle toho, JAK se k němu příběh staví: pověst se vypráví jako
 * vzpomínka na konkrétní místo nebo osobu z naší minulosti a má jádro
 * pravdy, báje vypráví o bozích a mytických hrdinech z doby před dějinami.
 *
 *  • L1 — ZAPAMATOVÁNÍ (tři šablony, viz sekce níže):
 *    (a) znak žánru — který znak patří k bájím (proti pověsti/bajce/pohádce);
 *    (b) postava a její čin — 9 nesporných faktů, oba směry (postava→čin,
 *        čin→postava), dohromady 18 kombinací;
 *    (c) odkud postava pochází — ke kterým bájím (řecké/severské/
 *        mezopotamské) postava patří.
 *  • L2 — POUŽITÍ: (a) neznámá ukázka bez jména postavy → která postava/báje
 *    to je (distraktory = postavy s podobným motivem); (b) neznámá ukázka
 *    bez jména postavy → jaký útvar to je (báje/pověst/pohádka/bajka),
 *    banka ≥8 ukázek na žánr.
 *  • L3 — ANALÝZA A PŘENOS: (a) ustálené spojení z bájí ve větě ze života
 *    → jeho význam; (b) ukázka → jakou funkci mýtus měl (tři různé funkce:
 *    přírodní jev / vznik světa a lidí / původ obřadu nebo zvyku — klíč se
 *    odvozuje od ukázky, ne z konstanty); (c) situace ze života → poučení/
 *    hodnota báje (Ikaros, Prométheus, Odysseus).
 *
 * Chybový model (errorModel, viz zadání tématu):
 *  • báje ↔ pověst (žák bere každý starý příběh o hrdinovi za pověst);
 *  • báje ↔ pohádka/bajka podle nadpřirozena nebo zvířat (bůh proměněný
 *    ve zvíře ≠ bajka, ≠ pohádka);
 *  • záměna postav s podobným motivem (Ikaros × Daidalos, Prométheus ×
 *    Héraklés, Theseus × Héraklés, Zeus × Thor);
 *  • ustálené spojení pochopené doslova nebo zaměněné za jiné.
 *
 * Determinismus: gen() nemá žádný stav mezi voláními — pool se sestavuje
 * znovu při každém volání (viz src/test/generator-determinism.test.ts).
 * Pořadí se pak prostřídá `prostridej()`, aby v jednom sezení nešly po sobě
 * dvě úlohy téhož typu a téhož klíče.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, ruzneUlohy, losUlohy, pick, type Distractor } from "./_shared";

/**
 * buildChoiceTask, ale nápovědy přesně tak, jak je napíšeme. `_shared` ke krátké
 * velké nápovědě připojuje „Dosaď každou možnost zpátky do věty…“, což v tomhle
 * tématu nedává smysl ani v jedné úloze — možnosti jsou názvy žánrů, jména
 * postav nebo celé definice, není kam co dosazovat. Velké nápovědy jsou proto
 * psané celé a aspoň o pětinu delší než malé.
 */
function choice(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: [string, string]; explanation: string },
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (t) t.hints = [...parts.hints];
  return t;
}

// ════════════════════════════════════════════════════════════════════════
// L1 (a) — znak žánru (báje proti pověsti / bajce / pohádce)
// ════════════════════════════════════════════════════════════════════════

interface ZnakVarianta {
  otazka: string;
  spravny: string;
  /** Zdůvodnění klíče — celé, ne jen zopakovaný klíč. */
  proc: string;
  povest: { text: string; why: string };
  bajka: { text: string; why: string };
  pohadka: { text: string; why: string };
}

const ZNAK_VARIANTY: ZnakVarianta[] = [
  {
    otazka: "Který znak patří k bájím?",
    spravny: "Vypráví o bozích a mytických hrdinech a vykládá vznik světa nebo přírodních jevů.",
    proc: "Znak báje: vypráví o bozích a mytických hrdinech z doby před dějinami a vykládá vznik světa nebo přírodních jevů. Tím se liší od pověsti (vzpomínka na skutečné místo nebo osobu z naší minulosti), od bajky (zvířata s ponaučením) i od pohádky (neurčitý vymyšlený svět).",
    povest: {
      text: "Vypráví se jako vzpomínka na skutečné místo nebo osobu a má jádro pravdy.",
      why: "To je znak pověsti. Pověst se vypráví jako vzpomínka na konkrétní místo nebo osobu z naší minulosti. Báje vypráví o bozích a mytických hrdinech z doby před dějinami — i ona může jmenovat místo (Olymp, Kréta), ale nevzpomíná na ně jako na kus naší historie.",
    },
    bajka: {
      text: "Vystupují v ní zvířata s lidskými vlastnostmi a plyne z ní ponaučení.",
      why: "To je znak bajky. V báji jednají bohové a mytičtí hrdinové, ne zvířata s lidskými vlastnostmi.",
    },
    pohadka: {
      text: "Začíná slovy „Byl jednou jeden“ a odehrává se ve vymyšleném světě bez určení místa nebo doby.",
      why: "To je znak pohádky. V báji navíc vystupují bohové nebo mytičtí hrdinové a příběh obvykle vykládá vznik světa nebo přírodního jevu — to pohádka nedělá.",
    },
  },
  {
    otazka: "Co je pro báje typické?",
    spravny: "Hlavní roli v nich hrají bohové a mytičtí hrdinové z doby před dějinami.",
    proc: "Pro báje je typické, že hlavní roli v nich hrají bohové a mytičtí hrdinové z doby před dějinami a že příběh často vykládá vznik světa nebo přírodního jevu. Pověst je oproti tomu vzpomínka na skutečné místo nebo osobu z naší minulosti, bajka má zvířecí postavy s ponaučením a pohádka se odehrává v neurčitém vymyšleném světě.",
    povest: {
      text: "Uchovávají vzpomínku na skutečné místo nebo osobu a mají jádro pravdy.",
      why: "To je typické pro pověst. Pověst se váže k naší krajině a minulosti jako vzpomínka. Báje mluví o bozích a mytických hrdinech z doby před dějinami a často vykládá vznik světa nebo přírodního jevu.",
    },
    bajka: {
      text: "Hlavní roli hrají zvířata jednající jako lidé a příběh končí ponaučením.",
      why: "To je typické pro bajku. V báji hrají hlavní roli bohové a mytičtí hrdinové, ne zvířata s lidskými vlastnostmi.",
    },
    pohadka: {
      text: "Odehrávají se ve vymyšleném, blíže neurčeném světě a často obsahují kouzelný předmět.",
      why: "To je typické pro pohádku. V báji jsou hlavními postavami jmenovaní bohové a mytičtí hrdinové a příběh často vykládá vznik světa nebo přírodního jevu — to pohádka nedělá.",
    },
  },
];

function ukolZnak(v: ZnakVarianta): PracticeTask | null {
  return choice(
    v.otazka,
    v.spravny,
    [
      { value: v.povest.text, why: v.povest.why },
      { value: v.bajka.text, why: v.bajka.why },
      { value: v.pohadka.text, why: v.pohadka.why },
    ],
    {
      hints: [
        "Ptej se, kdo v příběhu vystupuje a co příběh vykládá — u báje jsou to bohové a mytičtí hrdinové z doby před dějinami.",
        "Pověst se vypráví jako vzpomínka na skutečné místo nebo osobu z naší minulosti a má jádro pravdy, bajka má zvířecí postavy a ponaučení, pohádka se odehrává v neurčitém vymyšleném světě. Žádný z těch tří znaků k báji nepatří.",
      ],
      explanation: v.proc,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L1 (b) + (c) — postava, její čin a kultura (9 nesporných faktů)
// ════════════════════════════════════════════════════════════════════════

type Kultura = "řecké" | "severské" | "mezopotamské";
type KulturaDistraktor = Kultura | "egyptské";

const KULTURA_DAT: Record<KulturaDistraktor, string> = {
  "řecké": "řeckým",
  "severské": "severským",
  "mezopotamské": "mezopotamským",
  "egyptské": "egyptským",
};
const KULTURA_PRIKLAD: Record<KulturaDistraktor, string> = {
  "řecké": "Zeus nebo Héraklés",
  "severské": "Thor",
  "mezopotamské": "Gilgameš",
  "egyptské": "",
};
const VSECHNY_KULTURY: KulturaDistraktor[] = ["řecké", "severské", "mezopotamské", "egyptské"];

interface Fakt {
  osoba: string;
  /** celá věta, 3. osoba, začíná velkým písmenem — přímá odpověď na „co o postavě platí" */
  tvrzeni: string;
  /** fragment pro otázku „Kdo podle báje ___?" (bez otazníku, malým písmenem) */
  otazka: string;
  /**
   * Celé znění otázky, když by šablona „Kdo podle báje ${otazka}?" dala
   * negramatickou nebo příznakovou větu (příklonka „se" patří na druhou
   * pozici; sloveso „je" nepatří až za vsuvku).
   */
  otazkaCela?: string;
  kultura: Kultura;
  /** ručně vybrané indexy jiných faktů jako distraktory — zachycují typické záměny postav */
  distraktory: [number, number, number];
}

const FAKTA: Fakt[] = [
  { osoba: "Prométheus", tvrzeni: "Přinesl lidem oheň.", otazka: "přinesl lidem oheň", kultura: "řecké", distraktory: [2, 1, 6] },
  { osoba: "Ikaros", tvrzeni: "Vzlétl na křídlech z peří a vosku a zřítil se.", otazka: "vzlétl na křídlech z peří a vosku a zřítil se", kultura: "řecké", distraktory: [2, 0, 3] },
  { osoba: "Héraklés", tvrzeni: "Vykonal dvanáct úkolů.", otazka: "vykonal dvanáct úkolů", kultura: "řecké", distraktory: [3, 1, 4] },
  { osoba: "Theseus", tvrzeni: "Zabil Minotaura v labyrintu.", otazka: "zabil Minotaura v labyrintu", kultura: "řecké", distraktory: [2, 4, 0] },
  {
    osoba: "Odysseus",
    tvrzeni: "Dlouho se vracel domů z trojské války.",
    otazka: "se dlouho vracel domů z trojské války",
    otazkaCela: "Kdo se podle báje dlouho vracel domů z trojské války?",
    kultura: "řecké",
    distraktory: [3, 2, 6],
  },
  {
    osoba: "Zeus",
    tvrzeni: "Je nejvyšší řecký bůh a vládce blesku.",
    otazka: "je nejvyšší řecký bůh a vládce blesku",
    otazkaCela: "Kdo je podle báje nejvyšší řecký bůh a vládce blesku?",
    kultura: "řecké",
    distraktory: [7, 6, 8],
  },
  {
    osoba: "Poseidon",
    tvrzeni: "Je bůh moře.",
    otazka: "je bůh moře",
    otazkaCela: "Kdo je podle báje bůh moře?",
    kultura: "řecké",
    distraktory: [5, 7, 4],
  },
  {
    osoba: "Thor",
    tvrzeni: "Je severský bůh hromu s kladivem.",
    otazka: "je severský bůh hromu s kladivem",
    otazkaCela: "Kdo je podle báje severský bůh hromu s kladivem?",
    kultura: "severské",
    distraktory: [5, 6, 8],
  },
  {
    osoba: "Gilgameš",
    tvrzeni: "Je hrdina nejstaršího známého eposu z Mezopotámie.",
    otazka: "je hrdina nejstaršího známého eposu z Mezopotámie",
    otazkaCela: "Kdo je podle báje hrdina nejstaršího známého eposu z Mezopotámie?",
    kultura: "mezopotamské",
    distraktory: [7, 5, 6],
  },
];

const HINT_ZAMENA =
  "Pozor na postavy, které si jsou motivem podobné: dva hrdinové plnící těžké úkoly, dva bohové ovládající hrom, dva letci na voskových křídlech. Čin patří vždycky jen jedné z nich a ta druhá je známá něčím jiným.";

function ukolFaktSmer1(i: number): PracticeTask | null {
  const f = FAKTA[i];
  const distraktory: Distractor[] = f.distraktory.map((j) => ({
    value: FAKTA[j].tvrzeni,
    why: `Tohle platí o postavě ${FAKTA[j].osoba}, ne o postavě ${f.osoba}. O postavě ${f.osoba} podle báje platí: ${f.tvrzeni}`,
  }));
  return choice(
    `Co platí o postavě ${f.osoba} podle báje?`,
    f.tvrzeni,
    distraktory,
    {
      hints: [
        "Vzpomeň si, co tahle postava podle báje udělala nebo kým je — a nezaměň ji s postavou z podobného příběhu.",
        HINT_ZAMENA,
      ],
      explanation: `${f.osoba}: ${f.tvrzeni}`,
    },
  );
}

function ukolFaktSmer2(i: number): PracticeTask | null {
  const f = FAKTA[i];
  const distraktory: Distractor[] = f.distraktory.map((j) => ({
    value: FAKTA[j].osoba,
    why: `Tohle platí o postavě ${FAKTA[j].osoba} (${FAKTA[j].tvrzeni}), ne o postavě ${f.osoba}.`,
  }));
  return choice(
    f.otazkaCela ?? `Kdo podle báje ${f.otazka}?`,
    f.osoba,
    distraktory,
    {
      hints: [
        "Vzpomeň si na postavy řeckých, severských a mezopotamských bájí a na to, co je o každé z nich známo.",
        HINT_ZAMENA,
      ],
      explanation: `${f.osoba}: ${f.tvrzeni}`,
    },
  );
}

function ukolKultura(i: number): PracticeTask | null {
  const f = FAKTA[i];
  const distraktory: Distractor[] = VSECHNY_KULTURY.filter((k) => k !== f.kultura).map((k) => ({
    value: `${k} báje`,
    why:
      k === "egyptské"
        ? `Egyptské báje mezi probíranými postavami nemáme. Postava ${f.osoba} patří k ${KULTURA_DAT[f.kultura]} bájím.`
        : `Postava ${f.osoba} patří k ${KULTURA_DAT[f.kultura]} bájím, ne k ${KULTURA_DAT[k]}. K ${KULTURA_DAT[k]} bájím patří třeba ${KULTURA_PRIKLAD[k]}.`,
  }));
  return choice(
    `Ke kterým bájím patří postava ${f.osoba}?`,
    `${f.kultura} báje`,
    distraktory,
    {
      hints: [
        "Mytologie jednotlivých národů mají jiné bohy a jiné hrdiny — podle jména postavy a podle toho, co o ní víš, poznáš, ke které kultuře patří.",
        "Jména hrdinů starého Řecka často končí na -eus nebo -és a jejich bohové sídlí na Olympu. Seveřané mají jména krátká a tvrdá a jejich bohové bydlí v Ásgardu po boku Ódina. Nejstarší známý epos na světě pochází z Mezopotámie, z krajiny mezi řekami Eufratem a Tigridem.",
      ],
      explanation: `Postava ${f.osoba} patří k ${KULTURA_DAT[f.kultura]} bájím. ${f.tvrzeni}`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (a) — neznámá ukázka bez jména postavy → která postava/báje to je
// ════════════════════════════════════════════════════════════════════════

const KRATKY_FAKT: Record<string, string> = {
  "Prométheus": "přinesl lidem oheň",
  "Ikaros": "vzlétl na křídlech z vosku a peří příliš vysoko a zřítil se",
  "Daidalos": "byl to zkušený stavitel a Ikarův otec, který mu křídla vyrobil, ale sám doletěl v pořádku",
  "Héraklés": "vykonal dvanáct takřka nesplnitelných úkolů",
  "Theseus": "zabil Minotaura v labyrintu",
  "Odysseus": "se deset let vracel domů z trojské války",
  "Zeus": "je nejvyšší řecký bůh a vládce blesku",
  "Poseidon": "je bůh moře",
  "Thor": "je severský bůh hromu s kladivem",
  "Gilgameš": "je hrdina nejstaršího známého eposu z Mezopotámie",
};

interface UkazkaPostava {
  text: string;
  postava: string;
  distraktory: [string, string, string];
}

const UKAZKY_POSTAVA: UkazkaPostava[] = [
  {
    text: "Mladík si s otcovou pomocí přidělal na záda křídla slepená voskem. Otec ho varoval, ať nelétá moc vysoko, ale on neposlechl, vzlétl blízko slunci, vosk mu roztál a zřítil se do moře.",
    postava: "Ikaros",
    distraktory: ["Daidalos", "Prométheus", "Héraklés"],
  },
  {
    text: "Jeden z Titánů se slitoval nad lidmi, kteří žili ve tmě a zimě bez ohně. Ukradl bohům jiskru a přinesl ji lidem, i když věděl, že ho za to čeká přísný trest.",
    postava: "Prométheus",
    distraktory: ["Héraklés", "Zeus", "Ikaros"],
  },
  {
    text: "Hrdina musel z rozkazu krále splnit dvanáct takřka nesplnitelných úkolů, mezi nimi zabít mnohohlavou saň a přinést zlatá jablka ze zahrady bohů.",
    postava: "Héraklés",
    distraktory: ["Theseus", "Odysseus", "Prométheus"],
  },
  {
    text: "Mladík se dobrovolně vydal do labyrintu, aby zabil netvora s býčí hlavou, kterému museli každý devátý rok posílat lidské oběti. Cestu ven si pak našel podle klubka nitě, které mu dala jedna z královských dcer.",
    postava: "Theseus",
    distraktory: ["Héraklés", "Odysseus", "Ikaros"],
  },
  {
    text: "Král se po vítězné válce vydal na cestu domů, ale bohové mu do ní stavěli jednu překážku za druhou. Cesta se protáhla na dlouhých deset let, než se konečně vrátil ke své ženě.",
    postava: "Odysseus",
    distraktory: ["Theseus", "Héraklés", "Prométheus"],
  },
  {
    text: "Nejmocnější z bohů sídlil na vysoké hoře a v hněvu házel na zem ohnivé blesky — proto se lidem na nebi občas zablýskne a zahřmí.",
    postava: "Zeus",
    distraktory: ["Poseidon", "Thor", "Héraklés"],
  },
  {
    text: "Severský bůh nosil těžké kladivo, kterým dokázal přivolat bouři, a jeho síla byla podle vyprávění větší než síla kteréhokoli obra.",
    postava: "Thor",
    distraktory: ["Zeus", "Poseidon", "Gilgameš"],
  },
  {
    text: "Mocný král starobylého města se podle nejstaršího známého vyprávění vydal hledat rostlinu věčného mládí, ale nakonec pochopil, že se se smrtí musí smířit každý člověk.",
    postava: "Gilgameš",
    distraktory: ["Odysseus", "Héraklés", "Prométheus"],
  },
];

function ukolUkazkaPostava(u: UkazkaPostava): PracticeTask | null {
  const distraktory: Distractor[] = u.distraktory.map((jmeno) => ({
    value: jmeno,
    why: `Tohle je příběh postavy ${u.postava}, ne ${jmeno}. ${jmeno} je podle báje známý jinak: ${KRATKY_FAKT[jmeno]}.`,
  }));
  return choice(
    `Přečti si ukázku. O které postavě z bájí vypráví? „${u.text}“`,
    u.postava,
    distraktory,
    {
      hints: [
        "Postava v ukázce není jmenovaná — pozorně si všimni, CO dělá nebo co se jí stane, a porovnej to s tím, co o jednotlivých postavách víš.",
        "Pozor na postavy s podobným motivem: dva letci na voskových křídlech (jeden křídla vyrobil, druhý na nich letěl), dva hrdinové plnící těžké úkoly nebo bojující s netvorem, dva bohové ovládající hrom a bouři. Rozhodne drobnost v textu, ne celkový dojem.",
      ],
      explanation: `Ukázka vypráví o postavě ${u.postava} (${KRATKY_FAKT[u.postava]}).`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (b) — neznámá ukázka bez jména postavy → jaký útvar to je
// ════════════════════════════════════════════════════════════════════════

type Zanr = "báje" | "pověst" | "pohádka" | "bajka";
const ZANRY: Zanr[] = ["báje", "pověst", "pohádka", "bajka"];

const ZANR_POPIS: Record<Zanr, string> = {
  "báje": "vypráví o bozích a mytických hrdinech z doby před dějinami a často vykládá, jak vznikl svět nebo nějaký přírodní jev",
  "pověst": "vypráví se jako vzpomínka na konkrétní skutečné místo nebo osobu z naší minulosti a má jádro pravdy",
  "pohádka": "je vymyšlený příběh v neurčitém světě, často s kouzelným předmětem, a začíná obratem jako „bylo nebylo“",
  "bajka": "vystupují v ní zvířata s lidskými vlastnostmi a plyne z ní ponaučení",
};

const ZANR_WHY: Record<string, string> = {
  "báje>pověst": "Pověst se vypráví jako vzpomínka na konkrétní místo nebo osobu z naší minulosti a má jádro pravdy. Tahle ukázka vypráví o bozích nebo mytických hrdinech z doby před dějinami, ne o kusu naší historie.",
  "báje>pohádka": "Pohádka se odehrává ve vymyšleném světě a její hrdinové jsou bezejmenní princové, chudí synkové a čarodějnice. Tahle ukázka mluví o bozích nebo mytických hrdinech, kteří k pohádce nepatří.",
  "báje>bajka": "V bajce vystupují zvířata s lidskými vlastnostmi a příběh končí ponaučením. Tahle ukázka mluví o bozích nebo mytických hrdinech, ne o zvířatech jednajících jako lidé.",
  "pověst>báje": "Báje vypráví o bozích a mytických hrdinech z doby před dějinami. Tahle ukázka se vypráví jako vzpomínka na skutečné místo nebo osobu z naší minulosti.",
  "pověst>pohádka": "Pohádka se odehrává ve vymyšleném, neurčitém světě. Tahle ukázka jmenuje skutečné místo nebo osobu a má jádro pravdy.",
  "pověst>bajka": "V bajce vystupují zvířata s lidskými vlastnostmi. Tahle ukázka se vypráví jako vzpomínka na skutečné místo nebo osobu.",
  "pohádka>báje": "Báje vypráví o bozích nebo mytických hrdinech. Tahle ukázka žádného boha ani mytického hrdinu nemá — je to vymyšlený příběh v neurčitém světě.",
  "pohádka>pověst": "Pověst se vypráví jako vzpomínka na skutečné místo nebo osobu. Tahle ukázka se odehrává ve vymyšleném, blíže neurčeném světě.",
  "pohádka>bajka": "V bajce vystupují zvířata s lidskými vlastnostmi a příběh končí ponaučením. Tahle ukázka nemá zvířecí postavy ani ponaučení.",
  "bajka>báje": "Báje mluví o bozích a mytických hrdinech, ne o zvířatech jednajících jako lidé. Tahle ukázka má zvířecí postavy a končí ponaučením.",
  "bajka>pověst": "Pověst se vypráví jako vzpomínka na skutečné místo nebo osobu. Tahle ukázka má zvířecí postavy jednající jako lidé.",
  "bajka>pohádka": "Pohádka nemá zvířecí postavy s ponaučením jako hlavní znak. Tahle ukázka má zvířecí postavy jednající jako lidé a končí ponaučením.",
};

function zanrDistraktory(spravny: Zanr): Distractor[] {
  return ZANRY.filter((z) => z !== spravny).map((z) => ({ value: z, why: ZANR_WHY[`${spravny}>${z}`] }));
}

interface Ukazka2 {
  text: string;
  zanr: Zanr;
}

const UKAZKY_ZANR: Ukazka2[] = [
  // ── báje (9, včetně jedné s proměnou boha ve zvíře — errorModel #2) ──
  { zanr: "báje", text: "Bůh hromu prý jezdí po obloze na voze taženém kozly a rachot jeho kol lidé slyší jako hřmění; blesk pak vyletí z jeho kovového kladiva." },
  { zanr: "báje", text: "Vládce bohů prý svírá v ruce blesky a metá je na zem, kdykoli se na někoho rozhněvá — proto se blýská a hřmí." },
  { zanr: "báje", text: "Podle starého vyprávění bohyně jara každý rok na chvíli odchází do podsvětí, a proto na zemi nastává studené a temné roční období." },
  { zanr: "báje", text: "Bůh slunce prý každý den projíždí po obloze na ohnivém voze a tím vzniká den; v noci se vrací jinou cestou zpátky." },
  { zanr: "báje", text: "Hrdina, napůl člověk a napůl bůh, podle vyprávění splnil řadu takřka nemožných úkolů, a z jeho vítězství prý zůstala na obloze souhvězdí, která lidé vidí dodnes." },
  { zanr: "báje", text: "Podle starého vyprávění se bůh moře rozzuřil, udeřil trojzubcem do vln a vyvolal obrovskou bouři, která potopila lodě." },
  { zanr: "báje", text: "Bůh ohně prý ukoval lidem první kovové nástroje hluboko pod horou, ze které proto někdy stoupá dým a žhne láva." },
  { zanr: "báje", text: "Podle dávného vyprávění bohyně měsíce každou noc vyjíždí na stříbrném voze po obloze, a proto měsíc putuje z jedné strany nebe na druhou." },
  { zanr: "báje", text: "Bůh moří se prý dovedl proměnit v obrovského žraloka nebo velrybu, a když se v té podobě rozzuřil, hnal vlny na břeh — proto prý moře někdy bez příčiny bouří." },
  // ── pověst (8) ──
  { zanr: "pověst", text: "Vypráví se, že na vrchu Blaník spí rytíři, kteří se probudí a vyjedou ven, až bude naší zemi nejhůř." },
  { zanr: "pověst", text: "Podle starého vyprávění stál na Vyšehradě hrad kněžny, která odtud věštila slávu Praze." },
  { zanr: "pověst", text: "Traduje se, že praotec kmene vystoupil na horu Říp a odtud poprvé uviděl úrodnou zemi, kterou pak jeho lid osídlil." },
  { zanr: "pověst", text: "Vypráví se, že na Karlštejně jsou v opuštěné komnatě dodnes schované poklady jednoho z českých králů." },
  { zanr: "pověst", text: "Traduje se, že v horách Radhošť žije duch, který ochraňuje pocestné a hospodáře v okolních vesnicích." },
  { zanr: "pověst", text: "Traduje se, že meč rytíře se zkroceným lvem je zazděný v Karlově mostě a vyjede z něj sám, až bude naší zemi nejhůř." },
  { zanr: "pověst", text: "Vypráví se, že jméno řeky Vltavy pochází od slova, kterým staří obyvatelé popsali její divokou vodu." },
  { zanr: "pověst", text: "Podle vyprávění poslala jedna kněžna své muže postavit město tam, kde najdou tesaře tesajícího práh domu, a tak prý vzniklo jméno Prahy." },
  // ── pohádka (8) ──
  { zanr: "pohádka", text: "Bylo nebylo, za sedmero horami a sedmero řekami žil chudý mlynář, který jednou našel kouzelný mlýnek mlející zlato." },
  { zanr: "pohádka", text: "Za devatero horami stála chaloupka, ve které babička střežila zrcátko, jež pravdivě odpovídalo na každou otázku." },
  { zanr: "pohádka", text: "V jedné daleké zemi žil král, který slíbil půlku království tomu, kdo mu z kouzelné studny přinese živou vodu." },
  { zanr: "pohádka", text: "Bylo nebylo, chudý ševcovský učeň dostal od trpaslíka kouzelné boty, ve kterých uměl přeskočit sedm polí najednou." },
  { zanr: "pohádka", text: "Za horami a dolami žila princezna zakletá v labuť, kterou mohl vysvobodit jen ten, kdo uhodl tři kouzelná hesla." },
  { zanr: "pohádka", text: "V dávné zemi vládl král, jehož nejmladší syn dostal od moudré vrány kouzelné pero, které splnilo jedno jediné přání." },
  { zanr: "pohádka", text: "Bylo nebylo, na kraji lesa stála chaloupka na kuří nožce, kde vládla zlá čarodějnice a vařila kouzelné lektvary." },
  { zanr: "pohádka", text: "Za devatero řekami žil rybář, kterému zlatá rybka slíbila splnit tři přání, pokud ji pustí zpátky do moře." },
  // ── bajka (8) ──
  { zanr: "bajka", text: "Kohout se každé ráno chlubil slepicím, že to on svým kokrháním přivolává slunce na oblohu. Jednou byl nemocný a nemohl zakokrhat — slunce přesto vyšlo jako vždycky." },
  { zanr: "bajka", text: "Netopýr se snažil zalíbit ptákům i myším zároveň a jednou tvrdil, že je pták, protože létá, podruhé, že je myš, protože má srst. Nakonec mu nevěřil ani jeden z obou táborů." },
  { zanr: "bajka", text: "Krysa se posmívala kočce, že je líná a celý den jen leží na slunci. Jakmile se ale objevila u spíže, kočka ji v mžiku chytila." },
  { zanr: "bajka", text: "Beránek a kůzle se přetahovali o to, kdo z nich je odvážnější, a vsadili se, kdo první přeskočí potok. Kůzle skočilo bez rozmyslu a spadlo do vody, zatímco beránek si trasu nejdřív rozmyslel a přešel suchou nohou po kamenech." },
  { zanr: "bajka", text: "Slepice snesla zlaté vejce a její majitel v naději na víc zlata slepici zabil, aby zjistil, kde má zlato uvnitř. Uvnitř nic nebylo a o zlatá vejce navždy přišel." },
  { zanr: "bajka", text: "Žába se nafukovala, aby byla stejně velká jako vůl, o kterém jí vyprávěly její děti. Nafukovala se tak dlouho, až praskla." },
  { zanr: "bajka", text: "Rak se posmíval kraťoučkým nohám housenky, že se sotva hne z místa. Housenka se beze spěchu zakuklila a za pár týdnů z ní vylétl motýl, zatímco rak pořád lezl stejně pomalu po dně potoka." },
  { zanr: "bajka", text: "Lev chytil myšku a chtěl ji sníst, ale myška ho poprosila, ať ji pustí, že se mu jednou odvděčí. Lev se zasmál, ale pustil ji. Když se pak lev zamotal do lovecké sítě, myška provazy překousala a lva vysvobodila." },
];

function ukolZanr(u: Ukazka2): PracticeTask | null {
  return choice(
    `Přečti si ukázku. Jaký útvar to je? „${u.text}“`,
    u.zanr,
    zanrDistraktory(u.zanr),
    {
      hints: [
        "Zjisti, kdo v ukázce jedná a co se v ní vykládá: bohové a mytičtí hrdinové z doby před dějinami, skutečné jmenované místo nebo osoba z naší minulosti, neurčitý vymyšlený svět, nebo zvířata jednající jako lidé?",
        "Proměna ve zvíře ani kouzelná moc samy o sobě nerozhodují — nadpřirozeno se objevuje ve všech čtyřech útvarech. Rozhoduje, jestli jde o boha nebo mytického hrdinu z doby před dějinami, o vzpomínku na skutečné pojmenované místo či osobu z naší minulosti, o neurčitý vymyšlený svět bez jmen, nebo o zvíře, které jedná jako člověk a vede k ponaučení.",
      ],
      explanation: `Tahle ukázka je ${u.zanr}: ${ZANR_POPIS[u.zanr]}.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (a) — ustálené spojení z bájí ve větě ze života → jeho význam
// ════════════════════════════════════════════════════════════════════════

interface Idiom {
  fraze: string;
  veta: string;
  vyznam: string;
  doslovny: string;
  opacny: string;
  jiny: string;
}

const IDIOMY: Idiom[] = [
  {
    fraze: "Augiášův chlév",
    veta: "Po třídní oslavě zůstala učebna jako Augiášův chlév.",
    vyznam: "Obrovský, dlouho zanedbaný nepořádek, jehož uklizení stojí spoustu času a sil.",
    doslovny: "Skutečná stáj plná dobytka, kterou nikdo třicet let nevyčistil.",
    opacny: "Maličký nepořádek, se kterým je hotovo za pár vteřin.",
    jiny: "Slabé místo, kde je člověk nejvíc zranitelný.",
  },
  {
    fraze: "Ariadnina nit",
    veta: "Když se Tomáš ztratil v obřím nákupním centru, plánek u vchodu mu posloužil jako pravá Ariadnina nit.",
    vyznam: "Spolehlivé vodítko, které pomůže najít cestu ven ze složité nebo spletité situace.",
    doslovny: "Obyčejná nit nebo provázek, kterým se něco přiváže.",
    opacny: "Něco, co člověka ještě víc zmate a cestu mu znepříjemní.",
    jiny: "Dar, který navenek vypadá skvěle, ale ve skutečnosti přinese jen škodu.",
  },
  {
    fraze: "Achillova pata",
    veta: "Kryštof exceloval ve všech předmětech kromě matematiky — ta byla jeho Achillova pata.",
    vyznam: "Slabé, zranitelné místo jinak silného nebo úspěšného člověka.",
    doslovny: "Bolavé místo na noze po sportu nebo po úraze.",
    opacny: "Oblast, ve které je člověk naopak nejlepší ze všech.",
    jiny: "Marná, nekonečná práce, která nikdy nevede k žádnému výsledku.",
  },
  {
    fraze: "danajský dar",
    veta: "Nový mazlíček od tety, o kterého se ale nikdo nechtěl starat, se pro rodinu ukázal jako pravý danajský dar.",
    vyznam: "Dar, který se navenek tváří jako výhoda, ale ve skutečnosti tomu, kdo ho přijme, spíš uškodí nebo přidělá starosti.",
    doslovny: "Velký dřevěný kůň, kterého nepřátelé nechali před branami města.",
    opacny: "Velmi hodnotný a štědrý dárek, ze kterého má každý jen radost.",
    jiny: "Stálý pocit ohrožení, že se každou chvíli může stát něco zlého.",
  },
  {
    fraze: "Pandořina skříňka",
    veta: "Zavedení telefonů do třídy se ukázalo jako pravá Pandořina skříňka plná nových problémů.",
    vyznam: "Něco, co po otevření nebo spuštění přinese celou řadu nečekaných potíží.",
    doslovny: "Obyčejná ozdobná krabička, do které se dají schovávat drobnosti.",
    opacny: "Něco, co po otevření přinese jen samé příjemné překvapení.",
    jiny: "Obrovský, dlouho zanedbaný nepořádek, který je náročné uklidit.",
  },
  {
    fraze: "sisyfovská práce",
    veta: "Přesvědčovat mladšího bratra, aby si po sobě uklízel, byla pro Elišku vyložená sisyfovská práce.",
    vyznam: "Nekonečná, marná námaha, která nikdy nevede k trvalému výsledku, protože se práce pořád opakuje od začátku.",
    doslovny: "Namáhavé tlačení velkého kamene do kopce jako fyzické cvičení.",
    opacny: "Snadný úkol, který se podaří hned napoprvé a natrvalo.",
    jiny: "Slabé, zranitelné místo jinak silného nebo úspěšného člověka.",
  },
  {
    fraze: "Damoklův meč",
    veta: "Hrozba, že škola zruší výlet kvůli počasí, visela nad třídou jako Damoklův meč až do posledního dne.",
    vyznam: "Stálý pocit ohrožení, že se každou chvíli může stát něco zlého.",
    doslovny: "Skutečná zbraň zavěšená nad hlavou na jednom vlásku.",
    opacny: "Pocit naprostého bezpečí, kdy nic zlého nehrozí.",
    jiny: "Dar, který navenek vypadá skvěle, ale ve skutečnosti přinese jen škodu.",
  },
];

function ukolIdiom(i: Idiom): PracticeTask | null {
  return choice(
    `Co znamená spojení „${i.fraze}“ v téhle větě? „${i.veta}“`,
    i.vyznam,
    [
      { value: i.doslovny, why: `To je jen doslovný popis toho, co spojení „${i.fraze}“ původně znamenalo v báji. Ve větě má ale přenesený význam: ${i.vyznam}` },
      { value: i.opacny, why: `Tohle tvrdí pravý opak toho, co spojení „${i.fraze}“ ve skutečnosti znamená: ${i.vyznam}` },
      { value: i.jiny, why: `Tohle je význam jiného ustáleného spojení z bájí. „${i.fraze}“ znamená: ${i.vyznam}` },
    ],
    {
      hints: [
        "Ustálená spojení z bájí mají přenesený význam — nepřekládej si je doslova, i když v nich zůstalo jméno bájné postavy nebo místa.",
        "Zkus spojení nahradit jinými slovy tak, aby věta dál dávala smysl, a přemýšlej, jakou vlastnost, věc nebo pocit popisuje. Pomůže i vyloučit možnost, která jen doslova popisuje, co se v báji stalo, a tu, která tvrdí pravý opak.",
      ],
      explanation: `Ve větě nejde o doslovný obraz z báje, ale o jeho přenesený význam. „${i.fraze}“ znamená: ${i.vyznam}`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (b) — ukázka → jakou funkci mýtus měl
//   Klíč se odvozuje OD UKÁZKY (tři různé funkce), ne z jedné konstanty,
//   aby úloha nešla vyřešit bez čtení textu.
// ════════════════════════════════════════════════════════════════════════

type FunkceKey = "jev" | "puvod" | "zvyk";
type CiziFunkce = "bajka" | "povest" | "kronika";

const FUNKCE_LABEL: Record<FunkceKey, string> = {
  jev: "Vysvětlit přírodní jev, kterému lidé nerozuměli.",
  puvod: "Vysvětlit, jak vznikl svět a první lidé.",
  zvyk: "Zdůvodnit obřad nebo zvyk, který lidé dodržovali.",
};

const CIZI_LABEL: Record<CiziFunkce, string> = {
  bajka: "Pobavit čtenáře a poučit ho o lidském chování.",
  povest: "Uchovat vzpomínku na skutečné místo nebo osobu z naší minulosti.",
  kronika: "Přesně zapsat historické události tak, jak se opravdu staly.",
};

const FUNKCE_WHY: Record<string, string> = {
  "jev>puvod": "Ukázka nevypráví o tom, jak vznikl svět nebo první lidé — svět v ní už dávno stojí. Vykládá jen jednu věc, která se v přírodě pořád dokola opakuje.",
  "jev>zvyk": "Ukázka nikomu nepřikazuje žádný obřad ani zvyk a nekončí tím, co mají lidé dělat. Vykládá, proč se něco děje v přírodě.",
  "puvod>jev": "Ukázka nevykládá jev, který se v přírodě pořád opakuje, ale jednorázový začátek — odkud se vzal svět a lidé.",
  "puvod>zvyk": "Ukázka nezdůvodňuje žádný obřad ani zvyk lidí. Vypráví o tom, jak všechno na počátku vzniklo.",
  "zvyk>jev": "Ukázka nevykládá, proč se něco děje v přírodě. Odpovídá na otázku, proč lidé pravidelně něco dělají.",
  "zvyk>puvod": "Ukázka nevypráví o vzniku světa ani prvních lidí. Vysvětluje, odkud se vzal lidský obřad nebo zvyk.",
};

const CIZI_WHY: Record<CiziFunkce, string> = {
  bajka: "To je funkce bajky. V ukázce nejednají zvířata jako lidé a nekončí ponaučením o lidském chování.",
  povest: "To je funkce pověsti. Ukázka nejmenuje žádné skutečné místo ani osobu z naší minulosti — mluví o bozích a mytické době.",
  kronika: "Mýtus není přesný historický zápis. Vznikl proto, aby si lidé vyložili něco, co si sami vysvětlit neuměli.",
};

interface UkazkaFunkce {
  text: string;
  funkce: FunkceKey;
  cizi: CiziFunkce;
  /** PROČ je klíč správný — vazba na konkrétní ukázku, ne opakování klíče. */
  proc: string;
}

const UKAZKY_FUNKCE: UkazkaFunkce[] = [
  {
    text: "Lidé si podle starého vyprávění mysleli, že hrom je hlas rozzlobeného boha, který třískl kladivem o oblohu.",
    funkce: "jev",
    cizi: "kronika",
    proc: "Ukázka odpovídá na otázku, odkud se bere hrom — zvuk, který lidé slýchali za bouřky a neuměli si ho vyložit. Proto ho přičetli bohu. Není to zápis historie ani ponaučení o chování.",
  },
  {
    text: "Bůh slunce podle starého vyprávění každý den projíždí po obloze na voze taženém ohnivými koňmi, a proto slunce vychází na východě a zapadá na západě.",
    funkce: "jev",
    cizi: "povest",
    proc: "Ukázka vykládá, proč slunce putuje po obloze každý den stejnou cestou. To je jev, který se v přírodě pravidelně opakuje — žádný začátek světa ani lidský zvyk v ukázce není.",
  },
  {
    text: "Staří lidé věřili, že zima nastává proto, že bohyně jara ze smutku na chvíli odešla pod zem.",
    funkce: "jev",
    cizi: "bajka",
    proc: "Ukázka vykládá střídání ročních dob — proč po teplé části roku přichází chladná. Lidé tenkrát neznali oběh Země kolem Slunce, a tak si jev vyložili jednáním bohyně.",
  },
  {
    text: "Podle starého vyprávění blesky vznikaly, kdykoli nejmocnější bůh v hněvu mrštil ze svého sídla na hoře ohnivým kopím.",
    funkce: "jev",
    cizi: "kronika",
    proc: "Ukázka odpovídá na otázku, odkud se berou blesky. Jde o jev z přírody, který se opakuje při každé bouřce — ne o vzpomínku na skutečnou osobu ani o přesný zápis událostí.",
  },
  {
    text: "Lidé si vysvětlovali duhu jako most, po kterém bohové sestupují na zem mezi lidi.",
    funkce: "jev",
    cizi: "povest",
    proc: "Ukázka dává odpověď na otázku, co je ta barevná klenba na nebi po dešti. Duha je přírodní jev, který se opakuje — vyprávění ho jen vyloží obrazem mostu bohů.",
  },
  {
    text: "Staří lidé věřili, že příliv a odliv moře způsobuje bůh, když pod hladinou pomalu dýchá.",
    funkce: "jev",
    cizi: "bajka",
    proc: "Ukázka vykládá pravidelné stoupání a klesání hladiny moře. Je to jev z přírody, který lidé pozorovali každý den, ale neuměli ho vysvětlit.",
  },
  {
    text: "Podle dávného vyprávění na počátku nebylo nic než tma a voda; potom bohové oddělili nebe od země a z hlíny uhnětli první lidi.",
    funkce: "puvod",
    cizi: "kronika",
    proc: "Ukázka nemluví o ničem, co se v přírodě opakuje. Vypráví o jednorázovém začátku: odkud se vzalo nebe, země i lidé. Takový mýtus se jmenuje mýtus o stvoření.",
  },
  {
    text: "Staré vyprávění říká, že první lidé vyrostli ze stromů, které zasadil nesmrtelný tvůrce světa, a proto prý mají lidé v sobě kus dřeva i kus jeho jiskry.",
    funkce: "puvod",
    cizi: "povest",
    proc: "Ukázka odpovídá na otázku, odkud se vzali lidé — tedy na počátek, který se stal jen jednou. Nevykládá žádný jev, který se v přírodě opakuje, ani lidský zvyk.",
  },
  {
    text: "Podle mýtu vznikl svět z těla obrovského obra, kterého bohové rozdělili: z jeho kostí vznikly hory, z krve moře a z vlasů lesy.",
    funkce: "puvod",
    cizi: "bajka",
    proc: "Ukázka vypráví, jak vznikly hory, moře i lesy — tedy celý svět naráz. Je to příběh o počátku, ne výklad jevu, který se opakuje, ani zdůvodnění lidského zvyku.",
  },
  {
    text: "Podle starého vyprávění naučil bůh ohně lidi zapalovat na jaře velký oheň, a proto se na jaře dodnes pálí hranice a lidé kolem ní tancují.",
    funkce: "zvyk",
    cizi: "povest",
    proc: "Ukázka končí u toho, co lidé dodnes dělají — pálí na jaře hranici. Odpovídá tedy na otázku, proč se ten zvyk drží, ne na otázku, proč se něco děje v přírodě.",
  },
  {
    text: "Staré vyprávění říká, že bohové darovali lidem první zrno pod podmínkou, že jim po žních vždycky nechají na poli poslední snop — proto ho hospodáři nikdy nesklízeli.",
    funkce: "zvyk",
    cizi: "kronika",
    proc: "Ukázka vysvětluje, proč hospodáři nechávali poslední snop na poli. Jádrem je lidský zvyk a jeho původ, ne přírodní jev ani vznik světa.",
  },
];

function ukolFunkce(u: UkazkaFunkce): PracticeTask | null {
  const jineFunkce = (Object.keys(FUNKCE_LABEL) as FunkceKey[]).filter((k) => k !== u.funkce);
  const distraktory: Distractor[] = [
    ...jineFunkce.map((k) => ({ value: FUNKCE_LABEL[k], why: FUNKCE_WHY[`${u.funkce}>${k}`] })),
    { value: CIZI_LABEL[u.cizi], why: CIZI_WHY[u.cizi] },
  ];
  return choice(
    `Přečti si ukázku. Jakou funkci mýtus měl? „${u.text}“`,
    FUNKCE_LABEL[u.funkce],
    distraktory,
    {
      hints: [
        "Zeptej se, na co vyprávění odpovídá: proč se něco v přírodě pořád dokola opakuje, jak všechno na úplném začátku vzniklo, nebo proč lidé něco pravidelně dělají?",
        "Mýtus vznikal tam, kde si lidé něco neuměli vyložit, a bohové jim posloužili jako odpověď. Nikdy to není přesný zápis dějin ani ponaučení o chování podané příběhem zvířat. Rozliš, jestli ukázka mluví o něčem, co se v přírodě opakuje, o jednorázovém počátku světa a lidí, nebo o původu lidského obřadu.",
      ],
      explanation: u.proc,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (c) — situace ze života → poučení/hodnota báje (Ikaros, Prométheus, Odysseus)
// ════════════════════════════════════════════════════════════════════════

type Hodnota = "ikaros" | "prometheus" | "odysseus";

const HODNOTA_LABEL: Record<Hodnota, string> = {
  ikaros: "Ukazuje, jak nebezpečná může být nerozvážnost a nedbání varování druhých.",
  prometheus: "Ukazuje ochotu obětovat se nebo riskovat něco pro dobro druhých.",
  odysseus: "Ukazuje, že lest a vytrvalost dokážou překonat i dlouhou řadu překážek.",
};

interface SituaceHodnota {
  situace: string;
  hodnota: Hodnota;
  /** doslovné převyprávění děje situace — distraktor mimo trojici hodnot */
  doslovne: string;
  /** PROČ je klíč správný — vazba na konkrétní situaci a na konkrétní báji. */
  proc: string;
}

const L3_HODNOTA: SituaceHodnota[] = [
  {
    situace: "Rodiče Kubovi zakázali plavat příliš daleko od břehu, protože proud tam bývá silný. Kuba je neposlechl, doplaval skoro doprostřed jezera a museli ho zachraňovat záchranáři.",
    hodnota: "ikaros",
    doslovne: "Popisuje jen to, že Kuba doplaval daleko a museli ho zachránit, bez obecného poučení.",
    proc: "Kuba dostal jasné varování a nedbal ho — stejně jako Ikaros, kterého otec varoval, ať nelétá blízko slunci. Obecné poučení je tedy o nerozvážnosti, ne o plavání; pouhé převyprávění děje poučení není.",
  },
  {
    situace: "Učitelka Elišku varovala, ať nezkouší nejtěžší sjezdovku hned první den na lyžích. Eliška ji neposlechla, vyrazila na ni sama a hned na začátku spadla a zranila se.",
    hodnota: "ikaros",
    doslovne: "Popisuje jen to, že Eliška spadla na sjezdovce a zranila se, bez obecného poučení.",
    proc: "Eliška přecenila síly navzdory varování zkušenějšího člověka — přesně to se stalo Ikarovi, když neposlechl otce. Nejde o oběť pro druhé ani o vytrvalé hledání řešení.",
  },
  {
    situace: "Ačkoli věděl, že se tím sám dostane do problémů s trenérem, Honza se přiznal, že rozbité okno na hřišti způsobil on, aby za to nebyl potrestaný celý tým.",
    hodnota: "prometheus",
    doslovne: "Popisuje jen to, že Honza rozbil okno a přiznal se trenérovi, bez obecného poučení.",
    proc: "Honza vzal trest na sebe, aby ušetřil ostatní — stejně jako Prométheus přijal trest za to, že lidem přinesl oheň. Nikdo ho nevaroval, takže o nerozvážnost nejde.",
  },
  {
    situace: "Marek se o přestávkách vzdával svého oblíbeného místa v jídelně, aby si tam mohl sednout nový spolužák, který ve třídě ještě nikoho neznal.",
    hodnota: "prometheus",
    doslovne: "Popisuje jen to, že Marek pustil nového spolužáka na své místo, bez obecného poučení.",
    proc: "Marek se dobrovolně vzdal něčeho svého ve prospěch druhého — to je jádro Prométheova příběhu. Nešlo o chytrý plán ani o riskování navzdory varování.",
  },
  {
    situace: "Když se skupina na výletě ztratila v lese, Tereza vymyslela, jak si podle mechu na stromech poznamenat směr, a i po několika špatných odbočkách vytrvale hledala cestu, až všechny dovedla zpátky k autobusu.",
    hodnota: "odysseus",
    doslovne: "Popisuje jen to, že Tereza použila mech ke značení cesty, bez obecného poučení.",
    proc: "Tereza spojila chytrý nápad s vytrvalostí a po sérii překážek našla cestu domů — přesně tím se vyznačuje Odysseův návrat z trojské války. Nikoho neobětovala ani nejednala nerozvážně.",
  },
  {
    situace: "Filip prohrál v deskové hře několikrát za sebou, ale pokaždé si všiml chyby ze svého předchozího tahu a vymyslel nový trik, až nakonec s vytrvalostí zvítězil.",
    hodnota: "odysseus",
    doslovne: "Popisuje jen to, že Filip několikrát prohrál a nakonec vyhrál deskovou hru, bez obecného poučení.",
    proc: "Filip se po každé prohře poučil a zkusil nový úskok — vytrvalost spojená s lstí je přesně to, čím Odysseus překonal své překážky. Poučení je obecné, ne převyprávění partie.",
  },
];

function ukolHodnota(s: SituaceHodnota): PracticeTask | null {
  const jineHodnoty = (Object.keys(HODNOTA_LABEL) as Hodnota[]).filter((h) => h !== s.hodnota);
  const distraktory: Distractor[] = [
    ...jineHodnoty.map((h) => ({
      value: HODNOTA_LABEL[h],
      why: "Tohle poučení patří k jiné báji a k jiné situaci, ne k téhle.",
    })),
    { value: s.doslovne, why: "To jen opakuje, co se stalo, ne obecné poučení, které situace ukazuje." },
  ];
  return choice(
    `${s.situace} Jakou hodnotu nebo poučení z báje tahle situace nejlépe připomíná?`,
    HODNOTA_LABEL[s.hodnota],
    distraktory,
    {
      hints: [
        "Přemýšlej, co popsaná osoba udělala — riskovala navzdory varování, obětovala něco pro druhé, nebo vytrvale a chytře hledala řešení?",
        "Tři bájné postavy pro tuhle úlohu jsou Ikaros (nerozvážnost a nedbání varování), Prométheus (oběť pro dobro druhých) a Odysseus (lest a vytrvalost). Vyber tu, jejíž příběh popsané situaci nejlépe odpovídá — a nespokoj se s možností, která jen převypráví, co se stalo.",
      ],
      explanation: s.proc,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// gen()
// ════════════════════════════════════════════════════════════════════════

const POOL_L1: (() => PracticeTask | null)[] = [
  ...ZNAK_VARIANTY.map((v) => () => ukolZnak(v)),
  ...FAKTA.map((_, i) => () => ukolFaktSmer1(i)),
  ...FAKTA.map((_, i) => () => ukolFaktSmer2(i)),
  ...FAKTA.map((_, i) => () => ukolKultura(i)),
];

const POOL_L2: (() => PracticeTask | null)[] = [
  ...UKAZKY_POSTAVA.map((u) => () => ukolUkazkaPostava(u)),
  ...UKAZKY_ZANR.map((u) => () => ukolZanr(u)),
];

const POOL_L3: (() => PracticeTask | null)[] = [
  ...IDIOMY.map((i) => () => ukolIdiom(i)),
  ...UKAZKY_FUNKCE.map((u) => () => ukolFunkce(u)),
  ...L3_HODNOTA.map((s) => () => ukolHodnota(s)),
];

/**
 * Skupina úlohy = šablona + klíč tam, kde by se klíč sám opakoval.
 * Slouží k prostřídání pořadí: v jednom sezení nemá jít po sobě dvakrát
 * „Ke kterým bájím patří…" ani dvakrát stejné poučení (Ikaros po Ikarovi).
 */
export function skupinaUlohy(t: PracticeTask): string {
  const q = t.question;
  if (q.startsWith("Který znak") || q.startsWith("Co je pro báje")) return "znak";
  if (q.startsWith("Co platí o postavě")) return "fakt-postava";
  if (q.startsWith("Ke kterým bájím")) return `kultura:${t.correctAnswer}`;
  if (q.startsWith("Kdo ")) return "fakt-cin";
  if (q.startsWith("Přečti si ukázku. O které postavě")) return "ukazka-postava";
  if (q.startsWith("Přečti si ukázku. Jaký útvar")) return `zanr:${t.correctAnswer}`;
  if (q.startsWith("Co znamená spojení")) return "idiom";
  if (q.startsWith("Přečti si ukázku. Jakou funkci")) return `funkce:${t.correctAnswer}`;
  return `hodnota:${t.correctAnswer}`;
}

/**
 * Téma úlohy = postava, o kterou v úloze jde. Tři šablony L1 se ptají na
 * TÝŽ fakt z různých stran, takže „Co platí o postavě Gilgameš?" hned
 * následované otázkou „Kdo je hrdina nejstaršího eposu z Mezopotámie?"
 * druhou úlohu rovnou zodpoví. Prázdný řetězec = šablona nemá sdílené téma.
 */
export function tematUlohy(t: PracticeTask): string {
  const q = t.question;
  const m1 = q.match(/^Co platí o postavě (.+) podle báje\?$/u);
  if (m1) return `osoba:${m1[1]}`;
  const m2 = q.match(/^Ke kterým bájím patří postava (.+)\?$/u);
  if (m2) return `osoba:${m2[1]}`;
  if (/^Kdo (se |je )?podle báje /u.test(q)) return `osoba:${t.correctAnswer}`;
  return "";
}

/**
 * Přeskládá úlohy tak, aby dvě po sobě jdoucí nepatřily do stejné skupiny.
 * Bere vždy úlohu z NEJPOČETNĚJŠÍ jiné skupiny — kdyby se sahalo jen po
 * první vyhovující, nejpočetnější skupina by zbyla na konec a naskládala se
 * za sebe (přesně ten „pořád to samé dokola" efekt, kvůli kterému to je).
 */
function prostridej(tasks: PracticeTask[]): PracticeTask[] {
  const zbyva = [...tasks];
  const pocty = new Map<string, number>();
  for (const t of zbyva) pocty.set(skupinaUlohy(t), (pocty.get(skupinaUlohy(t)) ?? 0) + 1);

  const out: PracticeTask[] = [];
  let predSkupina = "";
  let predTema = "";
  /** `prisne` = hlídej i téma (postavu); bez něj jen skupinu. */
  const najdi = (prisne: boolean): number => {
    let vybrany = -1;
    let nejvic = -1;
    for (let i = 0; i < zbyva.length; i++) {
      const s = skupinaUlohy(zbyva[i]);
      if (s === predSkupina) continue;
      if (prisne) {
        const tema = tematUlohy(zbyva[i]);
        if (tema !== "" && tema === predTema) continue;
      }
      const n = pocty.get(s) ?? 0;
      if (n > nejvic) {
        nejvic = n;
        vybrany = i;
      }
    }
    return vybrany;
  };
  while (zbyva.length > 0) {
    let vybrany = najdi(true);
    if (vybrany === -1) vybrany = najdi(false);
    if (vybrany === -1) vybrany = 0; // poslední záchrana, ať se pořadí nezacyklí
    const [t] = zbyva.splice(vybrany, 1);
    const s = skupinaUlohy(t);
    pocty.set(s, (pocty.get(s) ?? 1) - 1);
    out.push(t);
    predSkupina = s;
    predTema = tematUlohy(t);
  }
  return out;
}

/** gen() nemá žádný stav mezi voláními — pool i losování se sestaví znovu při každém volání. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const genLx = () => pick(pool)();
  return prostridej(ruzneUlohy(() => losUlohy(genLx), pool.length, pool.length * 8));
}

// ════════════════════════════════════════════════════════════════════════
// Topic
// ════════════════════════════════════════════════════════════════════════

export const MYTY_A_BAJE_NARODU_SVETA: TopicMetadata[] = [
  {
    id: "g6-cjl-myty-a-baje-narodu-sveta-6",
    rvpNodeId: "g6-cjl-literarni-vychova-lidova-slovesnost-myty-a-baje-narodu-sveta",
    displayName: "Mýty a báje národů světa",
    title: "Mýty a báje národů světa",
    studentTitle: "Mýty a báje národů světa",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Lidová slovesnost",
    briefDescription: "Poznáš báje různých národů, jejich hrdiny i ustálená spojení, která používáme dodnes.",
    keywords: [
      "báje", "mýtus", "řecké báje", "severské báje", "mezopotamské báje",
      "Prométheus", "Ikaros", "Héraklés", "Odysseus", "Zeus", "Poseidon", "Thor", "Gilgameš",
      "ustálené spojení", "Achillova pata",
    ],
    goals: [
      "Rozpoznat báji podle jejích znaků a odlišit ji od pověsti, pohádky a bajky.",
      "Znát nesporné postavy bájí a jejich činy i to, ke kterému národu báje patří.",
      "Rozumět ustáleným spojením z bájí, která se používají v dnešní češtině.",
      "Vysvětlit, jakou funkci mýtus měl, a přenést poučení báje na novou situaci.",
    ],
    boundaries: [
      "Navazuje na grade-4/cjl/pohadkaPovestBajkaPovidka.ts a na grade-6/cjl/povestRegionalniHistoricka.ts.",
      "Jen nesporná fakta o postavách (obecně známé motivy, žádná citace); sporné detaily (délky, počty, jména rodičů) se nepoužívají jako klíč.",
      "Báje se ke skutečným místům váže (Olymp, Kréta, Trója, Uruk) — rozlišovacím znakem proti pověsti je způsob vyprávění (vzpomínka na naši minulost × doba před dějinami), ne přítomnost místa.",
      "Bez psaní vlastního textu — žák jen vybírá ze čtyř možností.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Báje vypráví o bozích a mytických hrdinech z doby před dějinami a často vykládá vznik světa nebo přírodních jevů — na rozdíl od pověsti (vzpomínka na skutečné místo nebo osobu z naší minulosti), bajky (zvířata s ponaučením) a pohádky (neurčitý vymyšlený svět). Ustálená spojení z bájí (Achillova pata, danajský dar…) mají přenesený význam.",
      steps: [
        "Zjisti, jestli ukázka mluví o bozích nebo mytických hrdinech z doby před dějinami (báje), vypráví se jako vzpomínka na skutečné místo či osobu z naší minulosti (pověst), má zvířecí postavy s ponaučením (bajka), nebo se odehrává v neurčitém vymyšleném světě (pohádka).",
        "U postavy si vzpomeň na její čin i na to, ke kterému národu báje patří (řecké, severské, mezopotamské).",
        "U ustáleného spojení hledej přenesený význam, ne doslovný popis toho, co se v báji stalo.",
        "U funkce mýtu se ptej, na co vyprávění odpovídá: proč se něco opakuje v přírodě, jak svět a lidé vznikli, nebo proč lidé dodržují nějaký zvyk.",
      ],
      commonMistake: "Zaměnit báji s pověstí podle toho, že je v ní jmenované místo (i báje má Olymp, Krétu nebo Tróju — rozhoduje způsob vyprávění), zaměnit ji s pohádkou nebo bajkou podle nadpřirozena či zvířat, nebo zaměnit postavy s podobným motivem (Ikaros × Daidalos, Prométheus × Héraklés, Zeus × Thor).",
      example: "„Bůh v hněvu metá blesky, proto hřmí.“ = báje (vykládá přírodní jev). „Achillova pata“ = slabé místo jinak silného člověka (přenesený význam, ne bolavá noha).",
    },
  },
];
