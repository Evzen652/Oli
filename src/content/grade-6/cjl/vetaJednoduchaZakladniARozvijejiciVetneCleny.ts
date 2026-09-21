/**
 * Čeština 6. ročník — Skladba: základní a rozvíjející větné členy (select_one).
 *
 * Úloha vypadá vždy stejně: věta s vyznačeným členem (VELKÝMI písmeny, u
 * víceslovného členu celé sousloví) + otázka „Jakým větným členem je
 * vyznačené slovo?“ (u víceslovného: „vyznačený výraz“). Vybírá se ze 4 uzavřených možností, právě jedna správná.
 *
 *  • L1 — rozcvička z 5. ročníku rozšířená o první rozvíjející člen: podmět,
 *    přísudek nebo předmět v jasných větách s přímým pořadím slov (podmět –
 *    přísudek – předmět). Uzavřená nabídka: podmět / přísudek / předmět /
 *    přívlastek (přívlastek je tu jen nabízená možnost, nikdy klíč).
 *  • L2 — celá soustava rozvíjejících členů v typických větách: předmět
 *    v jiných pádech (komu/čemu, koho/čeho, s kým/čím, o kom/o čem),
 *    příslovečné určení místa/času/způsobu/příčiny (druh se určuje přímo
 *    v možnostech) a přívlastek shodný × neshodný.
 *  • L3 — analýza a přenos: (a) předmět v 4. pádě na začátku věty a podmět
 *    na konci, vyznačen vždy podmět nebo předmět (pořadí slov nerozhoduje); (b) přísudek
 *    jmenný se sponou jako celek (spona + jméno); (c) doplněk jen
 *    v prototypech (vztahuje se zároveň ke dvěma členům) proti přívlastku
 *    shodnému (rozvíjí jen jedno jméno); (d) minimální dvojice předmět ×
 *    příslovečné určení místa se stejnou předložkou (spoléhat NA KAMARÁDA ×
 *    vylézt NA STROM).
 *
 * Chybový model (viz optionFeedback u každé možnosti): záměna podmětu
 * a předmětu podle pořadí slov ve větě, záměna předmětu a příslovečného
 * určení místa u předložkových vazeb, záměna přívlastku shodného
 * a neshodného, záměna doplňku a přívlastku shodného, záměna přísudku
 * jmenného se sponou za slovesný/přívlastek shodný/doplněk.
 *
 * Nápovědy (hints) NIKDY nejmenují žádný z uzavřených názvů členů
 * (podmět/přísudek/předmět/přívlastek/doplněk/příslovečné určení + druh) —
 * jen otázky a obecný postup, aby nešlo o prozrazení odpovědi (BRÁNA 0
 * kontroluje `hint.includes(correctAnswer)`).
 *
 * Sporné případy (předmět × PU u netypických předložkových vazeb, doplněk
 * mimo prototypy, PU míry a účelu) se jako klíč nepoužívají.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as choice, losUlohy, ruzneUlohy } from "./_shared";

type Term4 = "podmět" | "přísudek" | "předmět" | "přívlastek";

/** Víceslovné vyznačení (KVŮLI DEŠTI, BYLA NEMOCNÁ) je „výraz“, jednoslovné „slovo“. */
const jeVyraz = (fraze: string): boolean => fraze.trim().includes(" ");

function zadani(veta: string, fraze: string): string {
  return `„${veta}“ Jakým větným členem je ${jeVyraz(fraze) ? "vyznačený výraz" : "vyznačené slovo"}?`;
}

/** „Slovo „ráno““ / „Výraz „kvůli dešti““ – na začátek věty. */
function Oznac(fraze: string): string {
  return `${jeVyraz(fraze) ? "Výraz" : "Slovo"} „${fraze}“`;
}

// ═══════════════════════════════════════════════════════════════════════
// L1 — podmět / přísudek / předmět (4. pád) / přívlastek (jen možnost)
// ═══════════════════════════════════════════════════════════════════════

interface ItemL1 {
  veta: string;
  correct: "podmět" | "přísudek" | "předmět";
  oznacene: string;
  podmet: string;
  prisudek: string;
  predmet: string;
}

const BANKA_L1: ItemL1[] = [
  { veta: "Tomáš kopl MÍČ.", correct: "předmět", oznacene: "míč", podmet: "Tomáš", prisudek: "kopl", predmet: "míč" },
  { veta: "Eliška ČTE knihu.", correct: "přísudek", oznacene: "čte", podmet: "Eliška", prisudek: "čte", predmet: "knihu" },
  { veta: "KUBA staví hrad.", correct: "podmět", oznacene: "Kuba", podmet: "Kuba", prisudek: "staví", predmet: "hrad" },
  { veta: "Adéla KRESLÍ obrázek.", correct: "přísudek", oznacene: "kreslí", podmet: "Adéla", prisudek: "kreslí", predmet: "obrázek" },
  { veta: "Ondra píše DOPIS.", correct: "předmět", oznacene: "dopis", podmet: "Ondra", prisudek: "píše", predmet: "dopis" },
  { veta: "BÁRA opravuje kolo.", correct: "podmět", oznacene: "Bára", podmet: "Bára", prisudek: "opravuje", predmet: "kolo" },
  { veta: "Petr SBÍRÁ jahody.", correct: "přísudek", oznacene: "sbírá", podmet: "Petr", prisudek: "sbírá", predmet: "jahody" },
  { veta: "Jana nese TAŠKU.", correct: "předmět", oznacene: "tašku", podmet: "Jana", prisudek: "nese", predmet: "tašku" },
  { veta: "MAREK zalévá květiny.", correct: "podmět", oznacene: "Marek", podmet: "Marek", prisudek: "zalévá", predmet: "květiny" },
  { veta: "Karolína STAVÍ stan.", correct: "přísudek", oznacene: "staví", podmet: "Karolína", prisudek: "staví", predmet: "stan" },
  { veta: "Filip krmí PSA.", correct: "předmět", oznacene: "psa", podmet: "Filip", prisudek: "krmí", predmet: "psa" },
  { veta: "SIMONA maluje plot.", correct: "podmět", oznacene: "Simona", podmet: "Simona", prisudek: "maluje", predmet: "plot" },
  { veta: "Ondra ZAMETÁ dvůr.", correct: "přísudek", oznacene: "zametá", podmet: "Ondra", prisudek: "zametá", predmet: "dvůr" },
  { veta: "Bára loví RYBY.", correct: "předmět", oznacene: "ryby", podmet: "Bára", prisudek: "loví", predmet: "ryby" },
  { veta: "TOMÁŠ vaří polévku.", correct: "podmět", oznacene: "Tomáš", podmet: "Tomáš", prisudek: "vaří", predmet: "polévku" },
  { veta: "Adéla HLÍDÁ bratra.", correct: "přísudek", oznacene: "hlídá", podmet: "Adéla", prisudek: "hlídá", predmet: "bratra" },
];

function feedbackL1(term: Term4, it: ItemL1): string {
  switch (term) {
    case "podmět":
      return `„${it.oznacene}“ neurčuje, kdo nebo co ${it.prisudek} – tomu odpovídá slovo „${it.podmet}“.`;
    case "přísudek":
      return `„${it.oznacene}“ neříká, co se ve větě děje – děj vyjadřuje sloveso „${it.prisudek}“.`;
    case "předmět":
      return `„${it.oznacene}“ neodpovídá na pádovou otázku koho/co – tomu odpovídá slovo „${it.predmet}“.`;
    case "přívlastek":
      return `„${it.oznacene}“ samo nic nepopisuje (neodpovídá na otázku jaký? čí?) – přívlastek to není.`;
  }
}

const HINT1_L1 =
  "Slovo, které dělá děj, odpovídá na otázku kdo nebo co (1. pád). To, co se ve větě děje, vyjadřuje sloveso. " +
  "Slovo v pádové otázce (koho/co, komu/čemu…) ukazuje na jiný člen. Slovo, které bez slovesa popisuje " +
  "podstatné jméno (jaký? čí?), je zase jiný člen.";

function explainL1(it: ItemL1): string {
  if (it.correct === "podmět") {
    return `Kdo nebo co ${it.prisudek}? – ${it.podmet}. Slovo „${it.oznacene}“ je tedy podmět – označuje, kdo koná děj. Přísudkem je „${it.prisudek}“, předmětem „${it.predmet}“.`;
  }
  if (it.correct === "přísudek") {
    return `Co se s podmětem „${it.podmet}“ děje? – ${it.prisudek}. Slovo „${it.oznacene}“ je tedy přísudek – vyjadřuje děj. Podmětem je „${it.podmet}“, předmětem „${it.predmet}“.`;
  }
  return `Koho nebo co ${it.podmet} ${it.prisudek}? – ${it.predmet}. Slovo „${it.oznacene}“ je tedy předmět – doplňuje sloveso pádovou otázkou mimo 1. pád. Podmětem je „${it.podmet}“, přísudkem „${it.prisudek}“.`;
}

function ulohaL1(it: ItemL1): PracticeTask | null {
  const TERMS: Term4[] = ["podmět", "přísudek", "předmět", "přívlastek"];
  const ds = TERMS.filter((t) => t !== it.correct).map((t) => ({ value: t, why: feedbackL1(t, it) }));
  return choice(zadani(it.veta, it.oznacene), it.correct, ds, {
    hints: [
      `Ve větě „${it.veta}“ najdi slovo, ke kterému se vyznačené slovo vztahuje, a od něj se na něj zeptej.`,
      HINT1_L1,
    ],
    explanation: explainL1(it),
  });
}

// ═══════════════════════════════════════════════════════════════════════
// L2 (a) — předmět v jiných pádech (s předložkou i bez)
// ═══════════════════════════════════════════════════════════════════════

interface ItemPredmet {
  veta: string;
  fraze: string; // vyznačená fráze, přirozený tvar
  sloveso: string;
  otazka: string;
}

const BANKA_L2_PREDMET: ItemPredmet[] = [
  { veta: "Pomohl KAMARÁDOVI.", fraze: "kamarádovi", sloveso: "pomohl", otazka: "komu/čemu" },
  { veta: "Bojí se PAVOUKŮ.", fraze: "pavouků", sloveso: "bojí se", otazka: "koho/čeho" },
  { veta: "Mluvil S UČITELEM.", fraze: "s učitelem", sloveso: "mluvil", otazka: "s kým/s čím" },
  { veta: "Přemýšlel O VÝLETU.", fraze: "o výletu", sloveso: "přemýšlel", otazka: "o kom/o čem" },
];

const HINT1_PREDMET =
  "Pádové otázky kromě 1. pádu (koho/co, komu/čemu, o kom/o čem, s kým/čím…) vedou k jinému členu než otázka " +
  "kdo/co. Otázky kde/kam/kdy/jak/proč vedou zase k jiným členům, otázky jaký/který/čí k dalším.";

function ulohaPredmet(it: ItemPredmet): PracticeTask | null {
  const ds = [
    {
      value: "podmět",
      why: `Podmětem by bylo slovo v 1. pádě (kdo/co ${it.sloveso}?). ${Oznac(it.fraze)} odpovídá na otázku ${it.otazka}, to je jiný pád – předmět, ne podmět.`,
    },
    {
      value: "příslovečné určení místa",
      why: `Otázka ${it.otazka} se neptá kde/kam – „${it.fraze}“ doplňuje sloveso „${it.sloveso}“ pádovou otázkou, ne otázkou místa.`,
    },
    {
      value: "přívlastek neshodný",
      why: `„${it.fraze}“ nerozvíjí žádné podstatné jméno – rozvíjí přímo sloveso „${it.sloveso}“, proto je to předmět, ne přívlastek.`,
    },
  ];
  return choice(zadani(it.veta, it.fraze), "předmět", ds, {
    hints: [
      `Ve větě „${it.veta}“ se na „${it.fraze}“ zeptej od slovesa „${it.sloveso}“. Zkus kdo/co, komu/čemu, kde/kam i jaký/čí a zjisti, která otázka dává smysl.`,
      HINT1_PREDMET,
    ],
    explanation: `Otázka „${it.sloveso} ${it.otazka}?“ vede k předmětu. ${Oznac(it.fraze)} na tuto pádovou otázku odpovídá, proto je to předmět.`,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// L2 (b) — příslovečné určení místa / času / způsobu / příčiny
// ═══════════════════════════════════════════════════════════════════════

type Druh = "místa" | "času" | "způsobu" | "příčiny";

interface ItemPU {
  veta: string;
  fraze: string;
  sloveso: string;
  druh: Druh;
}

const OTAZKA_PU: Record<Druh, string> = {
  místa: "kde/kam/odkud",
  času: "kdy/jak dlouho/odkdy",
  způsobu: "jak",
  příčiny: "proč",
};

const BANKA_L2_PU: ItemPU[] = [
  { veta: "Potkal ho NA STARÉM MOSTĚ.", fraze: "na starém mostě", sloveso: "potkal", druh: "místa" },
  { veta: "Schovali se POD STOLEM.", fraze: "pod stolem", sloveso: "schovali se", druh: "místa" },
  { veta: "Čekali PŘED ŠKOLOU.", fraze: "před školou", sloveso: "čekali", druh: "místa" },
  { veta: "Přišel RÁNO.", fraze: "ráno", sloveso: "přišel", druh: "času" },
  { veta: "Vrátili se POZDĚ VEČER.", fraze: "pozdě večer", sloveso: "vrátili se", druh: "času" },
  { veta: "Sraz je ZÍTRA RÁNO.", fraze: "zítra ráno", sloveso: "je", druh: "času" },
  { veta: "Mluvila TICHÝM HLASEM.", fraze: "tichým hlasem", sloveso: "mluvila", druh: "způsobu" },
  { veta: "Běžel RYCHLE.", fraze: "rychle", sloveso: "běžel", druh: "způsobu" },
  { veta: "Odpověděl BEZ VÁHÁNÍ.", fraze: "bez váhání", sloveso: "odpověděl", druh: "způsobu" },
  { veta: "Zůstali doma KVŮLI DEŠTI.", fraze: "kvůli dešti", sloveso: "zůstali", druh: "příčiny" },
  { veta: "Škola byla zavřená KVŮLI CHŘIPCE.", fraze: "kvůli chřipce", sloveso: "byla zavřená", druh: "příčiny" },
  { veta: "Nešel ven KVŮLI NACHLAZENÍ.", fraze: "kvůli nachlazení", sloveso: "nešel", druh: "příčiny" },
];

const HINT1_PU =
  "Různé otázky (kde/kam, kdy, jak, proč) vedou vždy k jinému druhu rozvíjejícího členu – urči, na kterou " +
  "z nich vyznačené slovo doopravdy odpovídá.";

function ulohaPU(it: ItemPU): PracticeTask | null {
  const DRUHY: Druh[] = ["místa", "času", "způsobu", "příčiny"];
  const key = `příslovečné určení ${it.druh}`;
  const ds = DRUHY.filter((d) => d !== it.druh).map((d) => ({
    value: `příslovečné určení ${d}`,
    why: `${Oznac(it.fraze)} neodpovídá na otázku ${OTAZKA_PU[d]} – odpovídá na otázku ${OTAZKA_PU[it.druh]}.`,
  }));
  return choice(zadani(it.veta, it.fraze), key, ds, {
    hints: [
      `Ve větě „${it.veta}“ zkus na „${it.fraze}“ položit otázky kde, kdy, jak a proč – jen jedna z nich pasuje.`,
      HINT1_PU,
    ],
    explanation: `Otázka „${it.sloveso} ${OTAZKA_PU[it.druh]}?“ vede k odpovědi „${it.fraze}“ – proto je to příslovečné určení ${it.druh}.`,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// L2 (c) — přívlastek shodný × neshodný
// ═══════════════════════════════════════════════════════════════════════

interface ItemPrivlastek {
  veta: string;
  fraze: string;
  jmeno: string;
  key: "přívlastek shodný" | "přívlastek neshodný";
  /** Ukázka skloňování: jméno ve dvou pádech i s vyznačeným výrazem. */
  sklon: string;
}

const BANKA_L2_PRIVLASTEK: ItemPrivlastek[] = [
  { veta: "Přinesla MODRÝ batoh.", fraze: "modrý", jmeno: "batoh", key: "přívlastek shodný", sklon: "modrý batoh – modrého batohu" },
  { veta: "Koupil STARÝ dům.", fraze: "starý", jmeno: "dům", key: "přívlastek shodný", sklon: "starý dům – starého domu" },
  { veta: "Batoh S NÁŠIVKOU visel na věšáku.", fraze: "s nášivkou", jmeno: "batoh", key: "přívlastek neshodný", sklon: "batoh s nášivkou – batohu s nášivkou" },
  { veta: "Přečetla knihu MÉ SESTRY.", fraze: "mé sestry", jmeno: "knihu", key: "přívlastek neshodný", sklon: "kniha mé sestry – knihy mé sestry" },
];

const HINT1_PRIVLASTEK =
  "Pokud rozvíjející slovo mění tvar spolu s podstatným jménem (stejný rod, číslo, pád), jde o jeden typ " +
  "vztahu. Pokud tvar podstatného jména nekopíruje, jde o typ jiný.";

function ulohaPrivlastek(it: ItemPrivlastek): PracticeTask | null {
  const jiny: "přívlastek shodný" | "přívlastek neshodný" =
    it.key === "přívlastek shodný" ? "přívlastek neshodný" : "přívlastek shodný";
  // Vazba popisuje skutečnou vlastnost vyznačeného výrazu (ne vlastnost distraktoru).
  const jinyWhy =
    it.key === "přívlastek shodný"
      ? `„${it.fraze}“ se se slovem „${it.jmeno}“ shoduje v rodě, čísle i pádě – mění tvar spolu s ním (${it.sklon}). To je přívlastek shodný, ne neshodný. Neshodný by tvar nekopíroval.`
      : `„${it.fraze}“ se se slovem „${it.jmeno}“ neshoduje – nemění tvar spolu s ním, zůstává pořád stejné (${it.sklon}). Proto je to přívlastek neshodný, ne shodný.`;
  const ds = [
    { value: jiny, why: jinyWhy },
    {
      value: "příslovečné určení způsobu",
      why: `„${it.fraze}“ rozvíjí podstatné jméno „${it.jmeno}“ (odpovídá na otázku jaký/který/čí), ne sloveso – proto to není příslovečné určení způsobu.`,
    },
    {
      value: "podmět",
      why: `„${it.fraze}“ samo neurčuje, kdo nebo co koná děj – jen blíže popisuje podstatné jméno „${it.jmeno}“, proto je to přívlastek, ne podmět.`,
    },
  ];
  return choice(zadani(it.veta, it.fraze), it.key, ds, {
    hints: [
      `Ve větě „${it.veta}“ najdi podstatné jméno, které „${it.fraze}“ blíže popisuje, a zeptej se od něj jaký/který/čí. Pak ho zkus dát do jiného pádu.`,
      HINT1_PRIVLASTEK,
    ],
    explanation: `Od slova „${it.jmeno}“ se ptáš jaký/který/čí? – odpověď je „${it.fraze}“. ${
      it.key === "přívlastek shodný"
        ? `„${it.fraze}“ se s ním shoduje v rodě, čísle a pádě a mění tvar spolu s ním (${it.sklon}), proto je to přívlastek shodný.`
        : `„${it.fraze}“ se s ním neshoduje – při změně pádu zůstává stejné (${it.sklon}), proto je to přívlastek neshodný.`
    }`,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// L3 (a) — předmět × podmět: pořadí slov nerozhoduje
// ═══════════════════════════════════════════════════════════════════════
//
// Vyznačuje se jen podmět nebo předmět – u vyznačeného slovesa by přehozený
// slovosled nic neztěžoval (to je úroveň L1).

interface BazeA {
  predmet: string;
  sloveso: string;
  podmet: string;
  /** Otázka na podmět se slovesem v rodě, který „kdo/co“ vyžaduje (Kdo upekl…). */
  otazkaPodmet: string;
  otazkaPredmet: string;
}

const BAZE_A: BazeA[] = [
  { predmet: "míč", sloveso: "kopl", podmet: "Tomáš", otazkaPodmet: "Kdo kopl míč?", otazkaPredmet: "Co kopl Tomáš?" },
  { predmet: "dort", sloveso: "upekla", podmet: "babička", otazkaPodmet: "Kdo upekl dort?", otazkaPredmet: "Co upekla babička?" },
  { predmet: "zprávu", sloveso: "napsal", podmet: "Kuba", otazkaPodmet: "Kdo napsal zprávu?", otazkaPredmet: "Co napsal Kuba?" },
  { predmet: "psa", sloveso: "venčil", podmet: "Ondra", otazkaPodmet: "Kdo venčil psa?", otazkaPredmet: "Koho venčil Ondra?" },
  { predmet: "kolo", sloveso: "opravil", podmet: "táta", otazkaPodmet: "Kdo opravil kolo?", otazkaPredmet: "Co opravil táta?" },
  { predmet: "obrázek", sloveso: "nakreslila", podmet: "Adéla", otazkaPodmet: "Kdo nakreslil obrázek?", otazkaPredmet: "Co nakreslila Adéla?" },
];

type MarkA = "predmet" | "podmet";
const TERMY_A: Record<MarkA, string> = { predmet: "předmět", podmet: "podmět" };

function vetaA(b: BazeA, mark: MarkA): string {
  const P = mark === "predmet" ? b.predmet.toUpperCase() : b.predmet.charAt(0).toUpperCase() + b.predmet.slice(1);
  const D = mark === "podmet" ? b.podmet.toUpperCase() : b.podmet;
  return `${P} ${b.sloveso} ${D}.`;
}

const HINT1_A =
  "Postavení slova ve větě (na začátku, uprostřed, na konci) samo o sobě nic neurčuje – rozhoduje jen otázka, " +
  "kterou od slovesa položíš.";

function ulohaA(b: BazeA, mark: MarkA): PracticeTask | null {
  const veta = vetaA(b, mark);
  const correct = TERMY_A[mark];
  const oznacene = mark === "predmet" ? b.predmet : b.podmet;
  const otazka = mark === "predmet" ? b.otazkaPredmet : b.otazkaPodmet;
  const OPTIONS: string[] = ["podmět", "předmět", "přísudek slovesný", "přísudek jmenný se sponou"];
  const ds = OPTIONS.filter((o) => o !== correct).map((o) => {
    if (o === "podmět") {
      return { value: o, why: `Podmět odpovídá na otázku „${b.otazkaPodmet}“ – to je „${b.podmet}“, ne „${oznacene}“. To, že „${b.predmet}“ stojí na začátku věty, o podmětu nerozhoduje.` };
    }
    if (o === "předmět") {
      return { value: o, why: `Předmět odpovídá na otázku „${b.otazkaPredmet}“ – to je „${b.predmet}“, ne „${oznacene}“. Na „${oznacene}“ se ptáš „${otazka}“.` };
    }
    if (o === "přísudek slovesný") {
      return { value: o, why: `„${oznacene}“ není sloveso – to, co se ve větě děje, vyjadřuje „${b.sloveso}“. Na „${oznacene}“ se ptáš „${otazka}“.` };
    }
    return { value: o, why: `„${oznacene}“ není sloveso ani jeho jmenná část – odpovídá na otázku „${otazka}“, tedy je to ${correct}. Ve větě navíc není „být“ se jménem.` };
  });
  return choice(zadani(veta, oznacene), correct, ds, {
    hints: [
      `Ve větě „${veta}“ nespoléhej na to, že slovo na začátku věty automaticky koná děj. Zkus se na vyznačené slovo zeptat od slovesa „${b.sloveso}“.`,
      HINT1_A,
    ],
    explanation: `${b.otazkaPodmet} – ${b.podmet} (podmět). ${b.otazkaPredmet} – ${b.predmet} (předmět). Pořadí slov ve větě „${veta}“ o větném členu nerozhoduje, rozhoduje jen otázka. Vyznačené slovo „${oznacene}“ je proto ${correct}.`,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// L3 (b) — přísudek jmenný se sponou (spona + jméno = jeden člen)
// ═══════════════════════════════════════════════════════════════════════

interface ItemSpona {
  veta: string;
  vyraz: string; // vyznačený výraz malými písmeny, jak stojí ve větě
  spona: string; // spona v základním tvaru pořadí (je, byla, stal se)
  jmeno: string;
  podmet: string;
  kratka: string; // věta zkrácená jen na podmět + sponu
  otazkaPodmet: string;
}

const BANKA_L3_SPONA: ItemSpona[] = [
  { veta: "Petr JE LÉKAŘ.", vyraz: "je lékař", spona: "je", jmeno: "lékař", podmet: "Petr", kratka: "Petr je.", otazkaPodmet: "Kdo je lékař?" },
  { veta: "Babička BYLA NEMOCNÁ.", vyraz: "byla nemocná", spona: "byla", jmeno: "nemocná", podmet: "babička", kratka: "Babička byla.", otazkaPodmet: "Kdo byl nemocný?" },
  { veta: "Adéla JE UČITELKA.", vyraz: "je učitelka", spona: "je", jmeno: "učitelka", podmet: "Adéla", kratka: "Adéla je.", otazkaPodmet: "Kdo je učitelka?" },
  { veta: "Tomáš SE STAL KAPITÁNEM.", vyraz: "se stal kapitánem", spona: "stal se", jmeno: "kapitánem", podmet: "Tomáš", kratka: "Tomáš se stal.", otazkaPodmet: "Kdo se stal kapitánem?" },
  { veta: "Výlet BUDE ZÁBAVNÝ.", vyraz: "bude zábavný", spona: "bude", jmeno: "zábavný", podmet: "výlet", kratka: "Výlet bude.", otazkaPodmet: "Co bude zábavné?" },
  { veta: "Voda BYLA STUDENÁ.", vyraz: "byla studená", spona: "byla", jmeno: "studená", podmet: "voda", kratka: "Voda byla.", otazkaPodmet: "Co bylo studené?" },
  { veta: "Jana SE STALA VÍTĚZKOU.", vyraz: "se stala vítězkou", spona: "stala se", jmeno: "vítězkou", podmet: "Jana", kratka: "Jana se stala.", otazkaPodmet: "Kdo se stal vítězem?" },
];

function ulohaSpona(it: ItemSpona): PracticeTask | null {
  const ds = [
    {
      value: "přísudek slovesný",
      why: `Samotné „${it.spona}“ nic neříká („${it.kratka}“ nedává smysl) – potřebuje jmennou část „${it.jmeno}“. Spolu tvoří přísudek jmenný se sponou, ne slovesný.`,
    },
    {
      value: "přívlastek shodný",
      why: `Přívlastek rozvíjí podstatné jméno přímo a sloveso k němu nepatří. Vyznačený výraz „${it.vyraz}“ obsahuje sloveso „${it.spona}“ a vypovídá o podmětu „${it.podmet}“ – je to přísudek.`,
    },
    {
      value: "doplněk",
      why: `Doplněk se přidává k ději, který dává smysl i bez něj („Vrátil se unavený.“ → „Vrátil se.“). Tady „${it.kratka}“ smysl nedává – „${it.jmeno}“ se slovesem „${it.spona}“ tvoří jeden člen, přísudek jmenný se sponou.`,
    },
  ];
  return choice(zadani(it.veta, it.vyraz), "přísudek jmenný se sponou", ds, {
    hints: [
      `Zkus větu „${it.veta}“ zkrátit jen na sloveso („${it.kratka}“). Dává sama smysl? Pokud ne, co ke slovesu musí patřit?`,
      `Když sloveso samo nic neříká a teprve jméno za ním říká, kdo nebo jaký podmět je, tvoří spolu jeden člen. Když sloveso dává smysl samo, je jméno za ním jiný člen.`,
    ],
    explanation: `„${it.kratka}“ samo nedává smysl – sloveso „${it.spona}“ (spona) potřebuje jmennou část „${it.jmeno}“. Spolu tvoří jeden větný člen: přísudek jmenný se sponou. ${it.otazkaPodmet} – ${it.podmet} (to je podmět, ne vyznačený výraz).`,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// L3 (c) — doplněk (vztah ke dvěma členům zároveň) × přívlastek shodný
// ═══════════════════════════════════════════════════════════════════════

interface ItemDoplnek {
  veta: string;
  fraze: string;
  key: "doplněk" | "přívlastek shodný";
  ds: { value: string; why: string }[];
  explanation: string;
}

const BANKA_L3_DOPLNEK: ItemDoplnek[] = [
  {
    veta: "Vrátil se z výletu UNAVENÝ.",
    fraze: "unavený",
    key: "doplněk",
    ds: [
      { value: "přívlastek shodný", why: `„Unavený“ tady nestojí přímo u žádného podstatného jména, které by rozvíjelo – vztahuje se zároveň k (nevyjádřenému) podmětu i ke slovesu „vrátil se“, proto je to doplněk.` },
      { value: "předmět", why: `„Unavený“ neodpovídá na pádovou otázku koho/co – je to přídavné jméno vztahující se k podmětu i k ději zároveň.` },
      { value: "podmět", why: `„Unavený“ neurčuje, kdo se vrátil (to je nevyjádřený podmět „on“) – jen popisuje jeho stav zároveň s dějem.` },
    ],
    explanation: `Slovo „unavený“ se vztahuje zároveň k nevyjádřenému podmětu „on“ (kdo byl unavený?) i ke slovesu „vrátil se“ (v jakém stavu se vrátil?) – to je znak doplňku, ne přívlastku.`,
  },
  {
    veta: "Zvolili ho PŘEDSEDOU třídy.",
    fraze: "předsedou",
    key: "doplněk",
    ds: [
      { value: "přívlastek shodný", why: `„Předsedou“ nestojí přímo u podstatného jména, které by rozvíjelo – vztahuje se zároveň k předmětu „ho“ i ke slovesu „zvolili“, proto je to doplněk.` },
      { value: "podmět", why: `„Předsedou“ neurčuje, kdo koná děj „zvolili“ – popisuje výsledek děje pro předmět „ho“.` },
      { value: "předmět", why: `„Předsedou“ samo neodpovídá na pádovou otázku koho/co – tou je slovo „ho“. „Předsedou“ navíc popisuje výsledek děje.` },
    ],
    explanation: `Slovo „předsedou“ se vztahuje zároveň k předmětu „ho“ (koho zvolili?) i ke slovesu „zvolili“ (kým ho zvolili?) – to je znak doplňku.`,
  },
  {
    veta: "Viděla ho UTÍKAT.",
    fraze: "utíkat",
    key: "doplněk",
    ds: [
      { value: "přívlastek shodný", why: `„Utíkat“ je sloveso v infinitivu, ne přídavné jméno – nemůže se s žádným podstatným jménem shodovat v rodě, čísle a pádě, proto to není přívlastek.` },
      { value: "podmět", why: `„Utíkat“ neurčuje, kdo koná hlavní děj věty (viděla) – vztahuje se k předmětu „ho“ a slovesu „viděla“ zároveň.` },
      { value: "předmět", why: `„Utíkat“ samo neodpovídá na pádovou otázku koho/co – tou je slovo „ho“. „Utíkat“ navíc popisuje děj, který dělal předmět.` },
    ],
    explanation: `Slovo „utíkat“ se vztahuje zároveň k předmětu „ho“ (koho viděla?) i ke slovesu „viděla“ (jak/co dělajícího ho viděla?) – to je znak doplňku.`,
  },
  {
    veta: "UNAVENÝ turista se vrátil domů.",
    fraze: "unavený",
    key: "přívlastek shodný",
    ds: [
      { value: "doplněk", why: `„Unavený“ tu stojí přímo před podstatným jménem „turista“ a shoduje se s ním v rodě, čísle a pádě – rozvíjí jen tohle jméno, nevztahuje se zároveň k ději, proto je to přívlastek shodný, ne doplněk.` },
      { value: "podmět", why: `„Unavený“ neurčuje, kdo se vrátil (to je slovo „turista“) – jen ho blíže popisuje.` },
      { value: "přívlastek neshodný", why: `„Unavený“ se se slovem „turista“ shoduje v rodě, čísle i pádě – mění tvar spolu s ním (unavený turista – unaveného turisty). To je přívlastek shodný, ne neshodný.` },
    ],
    explanation: `Slovo „unavený“ stojí přímo u podstatného jména „turista“ a shoduje se s ním v rodě, čísle a pádě (unavený turista, 1. pád, mužský rod, jednotné číslo) – to je přívlastek shodný, ne doplněk.`,
  },
];

const HINT1_DOPLNEK =
  "Pokud rozvíjející slovo stojí přímo u podstatného jména a shoduje se s ním, patří jen k němu. Pokud popisuje " +
  "stav při ději a vztahuje se zároveň k ději i k jinému členu, patří k oběma zároveň.";

function ulohaDoplnek(it: ItemDoplnek): PracticeTask | null {
  return choice(zadani(it.veta, it.fraze), it.key, it.ds, {
    hints: [
      `Ve větě „${it.veta}“ zkus zjistit, jestli se vyznačené slovo vztahuje jen k jednomu podstatnému jménu, nebo zároveň i ke slovesu.`,
      HINT1_DOPLNEK,
    ],
    explanation: it.explanation,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// L3 (d) — minimální dvojice: předmět × příslovečné určení místa
// ═══════════════════════════════════════════════════════════════════════
//
// Chyták: stejná předložka (na + 4. pád, o + 6. pád) jednou uvádí předmět
// (spoléhal NA KAMARÁDA – na koho?), jindy místo (vylezl NA STROM – kam?).
// Předložka sama nerozhoduje – rozhoduje, jestli výraz označuje místo.

interface ItemD {
  veta: string;
  fraze: string;
  sloveso: string;
  key: "předmět" | "příslovečné určení místa";
  otazka: string; // otázka vedoucí ke klíči (pro explanation)
}

const BANKA_L3_D: ItemD[] = [
  { veta: "Mluvil O ŠKOLE.", fraze: "o škole", sloveso: "mluvil", key: "předmět", otazka: "o kom/o čem" },
  { veta: "Přemýšlel O ZÁPASE.", fraze: "o zápase", sloveso: "přemýšlel", key: "předmět", otazka: "o kom/o čem" },
  { veta: "Spoléhal NA KAMARÁDA.", fraze: "na kamaráda", sloveso: "spoléhal", key: "předmět", otazka: "na koho/na co" },
  { veta: "Zeptal se NA CESTU.", fraze: "na cestu", sloveso: "zeptal se", key: "předmět", otazka: "na koho/na co" },
  { veta: "Sedl si NA LAVIČKU.", fraze: "na lavičku", sloveso: "sedl si", key: "příslovečné určení místa", otazka: "kam" },
  { veta: "Vylezl NA STROM.", fraze: "na strom", sloveso: "vylezl", key: "příslovečné určení místa", otazka: "kam" },
  { veta: "Hráli si NA HŘIŠTI.", fraze: "na hřišti", sloveso: "hráli si", key: "příslovečné určení místa", otazka: "kde" },
];

function ulohaD(it: ItemD): PracticeTask | null {
  const ds =
    it.key === "předmět"
      ? [
          { value: "příslovečné určení místa", why: `„${it.fraze}“ neoznačuje místo, kde nebo kam se děj odehrává – neodpovídá na otázku kde/kam. Od slovesa „${it.sloveso}“ se ptáš pádovou otázkou ${it.otazka}, proto je to předmět.` },
          { value: "příslovečné určení času", why: `„${it.fraze}“ neodpovídá na otázku kdy – je to pádová vazba slovesa „${it.sloveso}“ (${it.otazka}?).` },
          { value: "podmět", why: `„${it.fraze}“ neurčuje, kdo koná děj (1. pád) – je to pádová vazba slovesa „${it.sloveso}“ v jiném pádu.` },
        ]
      : [
          { value: "předmět", why: `Předložka „na“ sama nerozhoduje. „${it.fraze}“ označuje místo – odpovídá na otázku ${it.otazka}?, proto je to příslovečné určení místa. Předmět by to byl, kdyby nešlo o místo (spoléhal na koho? – na kamaráda).` },
          { value: "příslovečné určení času", why: `„${it.fraze}“ odpovídá na otázku ${it.otazka}, ne kdy.` },
          { value: "podmět", why: `„${it.fraze}“ neurčuje, kdo koná děj – odpovídá na otázku ${it.otazka}.` },
        ];
  return choice(zadani(it.veta, it.fraze), it.key, ds, {
    hints: [
      `Ve větě „${it.veta}“ rozhodni: označuje „${it.fraze}“ místo (ptáš se kde/kam?), nebo se na něj ptáš pádovou otázkou od slovesa „${it.sloveso}“ (na koho/na co, o kom/o čem…)?`,
      "Stejná předložka (na, o) může uvádět různé větné členy. Nerozhoduje předložka, ale otázka: označuje výraz místo, nebo jen doplňuje, na koho/na co či o kom/o čem sloveso je?",
    ],
    explanation:
      it.key === "předmět"
        ? `„${it.fraze}“ neoznačuje místo. Ptáš se „${it.sloveso} ${it.otazka}?“ – to je pádová otázka, proto je to předmět.`
        : `„${it.fraze}“ označuje místo – ptáš se „${it.sloveso} ${it.otazka}?“. Proto je to příslovečné určení místa, i když má předložku stejně jako předmět.`,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Generátor
// ═══════════════════════════════════════════════════════════════════════

function genL1(): PracticeTask | null {
  return ulohaL1(pick(BANKA_L1));
}

function genL2(): PracticeTask | null {
  const skupina = pick(["predmet", "pu", "privlastek"] as const);
  if (skupina === "predmet") return ulohaPredmet(pick(BANKA_L2_PREDMET));
  if (skupina === "pu") return ulohaPU(pick(BANKA_L2_PU));
  return ulohaPrivlastek(pick(BANKA_L2_PRIVLASTEK));
}

function genL3(): PracticeTask | null {
  const skupina = pick(["a", "spona", "doplnek", "d"] as const);
  if (skupina === "a") {
    const b = pick(BAZE_A);
    const mark = pick(["predmet", "podmet"] as const);
    return ulohaA(b, mark);
  }
  if (skupina === "spona") return ulohaSpona(pick(BANKA_L3_SPONA));
  if (skupina === "doplnek") return ulohaDoplnek(pick(BANKA_L3_DOPLNEK));
  return ulohaD(pick(BANKA_L3_D));
}

function gen(level: number): PracticeTask[] {
  const genLx = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(genLx));
}

// ═══════════════════════════════════════════════════════════════════════
// Topic
// ═══════════════════════════════════════════════════════════════════════

export const VETA_JEDNODUCHA_ZAKLADNI_A_ROZVIJEJICI_VETNE_CLENY: TopicMetadata[] = [
  {
    id: "g6-cjl-veta-jednoducha-vetne-cleny-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-skladba-veta-jednoducha-zakladni-a-rozvijejici-vetne-cleny",
    title: "Věta jednoduchá - základní a rozvíjející větné členy",
    displayName: "Větné členy",
    studentTitle: "Větné členy – základní a rozvíjející",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Skladba",
    briefDescription: "Urči, jakým větným členem je vyznačené slovo ve větě.",
    keywords: [
      "větný člen", "podmět", "přísudek", "přísudek slovesný", "přísudek jmenný se sponou",
      "předmět", "příslovečné určení", "místo", "čas", "způsob", "příčina",
      "přívlastek", "shodný", "neshodný", "doplněk", "skladba",
    ],
    goals: [
      "Rozlišit základní větné členy (podmět, přísudek) od rozvíjejících (předmět, příslovečné určení, přívlastek, doplněk).",
      "Určit větný člen podle otázky položené od řídícího členu, ne podle pořadí slov ve větě.",
      "Rozlišit typické záměny: předmět × podmět, předmět × příslovečné určení místa, přívlastek shodný × neshodný, doplněk × přívlastek.",
    ],
    boundaries: [
      "Sporné případy (předmět × PU u netypických předložkových vazeb mimo prototypy, doplněk mimo prototypy, příslovečné určení míry a účelu) se jako klíč nepoužívají.",
      "Větný člen se určuje jen ve větě, kde je jednoznačný.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Větný člen zjistíš otázkou od slova, ke kterému vyznačené slovo patří (většinou od slovesa). Pořadí slov ve větě samo o sobě nic neurčuje.",
      steps: [
        "Najdi ve větě slovo, ke kterému se vyznačené slovo vztahuje.",
        "Polož od něj otázku: kdo/co (bez pádu), co se děje, koho/co/komu/čemu… (pádová otázka), kde/kdy/jak/proč, nebo jaký/který/čí.",
        "Podle otázky, na kterou vyznačené slovo odpovídá, urči větný člen.",
        "Sloveso „být“ + jméno za ním (je lékař, byla nemocná) tvoří dohromady jeden člen.",
      ],
      commonMistake: "Určovat člen podle pořadí slov ve větě (slovo na začátku = podmět) místo podle otázky, nebo plést předmět s příslovečným určením místa u předložkových vazeb.",
      example: "„Míč kopl Tomáš.“ – Tomáš je podmět (kdo kopl?), míč je předmět (koho/co kopl?), i když míč stojí na začátku věty.",
    },
  },
];
