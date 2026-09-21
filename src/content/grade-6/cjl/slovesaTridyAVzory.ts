/**
 * Čeština 6. ročník — Slovesa: mluvnické kategorie, slovesné třídy a vzory
 * (select_one).
 *
 * Klíčová dovednost: TŘÍDU určí zakončení 3. osoby jednotného čísla
 * přítomného času (-e, -ne, -je, -í, -á), ne vzhled infinitivu (psát → píše
 * → 1. třída, ne 5. jako dělat). VZOR uvnitř třídy pak rozliší znak
 * infinitivu (-ovat, hláska před -nout, -řít, střídání souhlásek) nebo
 * 3. osoba množného čísla (4. třída: oni sázejí × oni trpí).
 *
 *  • L1 — rozcvička na 4./5. ročník. (a) osoba a číslo zvýrazněného slovesa
 *    ve větě; (b) ze zadané 3. osoby (bez věty) se určí JEN třída podle
 *    koncovky (-e/-ne/-je/-í/-á).
 *  • L2 — sloveso ve větě v minulém čase nebo infinitivu; žák si sám utvoří
 *    3. osobu a určí třídu i vzor. V bance nejsou samotná vzorová slovesa
 *    (nese, peče, kupuje…) — ta by odpověď prozradila shodou slov.
 *  • L3 — (a) infinitiv úmyslně svádí k jinému vzoru, než určí 3. osoba;
 *    (b) inverze — které ze čtyř sloves se časuje jinak; všechna čtyři mají
 *    stejné zakončení infinitivu, takže lichý se pozná až po časování;
 *    (c) čas a vid dohromady — dokonavé sloveso v přítomném tvaru vyjadřuje
 *    budoucí čas (nemá čas přítomný).
 *
 * Pravidla i verbální materiál ověřeny podle Pravidel českého pravopisu
 * a učebnic ČJ pro 6. ročník (Fraus, SPN, Nová škola); sporná slovesa
 * (stát, bát se, chtít, spát) se nepoužívají jako klíč.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Trida = 1 | 2 | 3 | 4 | 5;

// ── Třídy a vzory (uzavřená množina: 5 tříd, 14 vzorů) ─────────────────────
interface Vzor {
  trida: Trida;
  vzor: string;
}
const VZORY: Vzor[] = [
  { trida: 1, vzor: "nese" }, { trida: 1, vzor: "bere" }, { trida: 1, vzor: "maže" },
  { trida: 1, vzor: "peče" }, { trida: 1, vzor: "umře" },
  { trida: 2, vzor: "tiskne" }, { trida: 2, vzor: "mine" }, { trida: 2, vzor: "začne" },
  { trida: 3, vzor: "kryje" }, { trida: 3, vzor: "kupuje" },
  { trida: 4, vzor: "prosí" }, { trida: 4, vzor: "trpí" }, { trida: 4, vzor: "sází" },
  { trida: 5, vzor: "dělá" },
];
const label = (trida: number, vzor: string) => `${trida}. třída, vzor ${vzor}`;

// ── L2 — banka sloves s ověřenou 3. osobou j. č. a zařazením ───────────────
// Bez samotných vzorových sloves: ve větě „Chlapec prosil“ by stačilo najít
// stejné slovo v možnostech („vzor prosí“) a nic neurčovat.
interface Sloveso {
  infinitiv: string;
  trida: Trida;
  vzor: string;
  tvar3: string; // 3. osoba jednotného čísla přítomného času
  veta: string; // celá věta, tvar minulý/infinitiv zvýrazněný v ‚…‘
}
const S = (infinitiv: string, trida: Trida, vzor: string, tvar3: string, veta: string): Sloveso =>
  ({ infinitiv, trida, vzor, tvar3, veta });

const SLOVESA_L2: Sloveso[] = [
  // nese
  S("vést", 1, "nese", "vede", "Kapitán ‚vedl‘ výpravu k vítězství."),
  S("krást", 1, "nese", "krade", "Zloděj ‚kradl‘ šperky z výlohy."),
  S("mést", 1, "nese", "mete", "Školník ‚metl‘ chodník před školou."),
  // bere
  S("prát", 1, "bere", "pere", "Babička ‚prala‘ prádlo v neděli."),
  // maže
  S("psát", 1, "maže", "píše", "Eliška ‚psala‘ dopis babičce."),
  S("česat", 1, "maže", "češe", "Holčička ‚česala‘ panence vlasy."),
  S("řezat", 1, "maže", "řeže", "Truhlář ‚řezal‘ prkno pilou."),
  S("lízat", 1, "maže", "líže", "Kočka ‚lízala‘ mléko z misky."),
  // peče
  S("moci", 1, "peče", "může", "Dědeček ‚mohl‘ přijet až večer."),
  S("téct", 1, "peče", "teče", "Voda ‚tekla‘ úzkým potokem."),
  S("vléct", 1, "peče", "vleče", "Kůň ‚vlekl‘ těžký vůz."),
  // umře
  S("zavřít", 1, "umře", "zavře", "Tomáš ‚zavřel‘ okno před bouřkou."),
  S("třít", 1, "umře", "tře", "Kuchařka ‚třela‘ mrkev na struhadle."),
  // tiskne
  S("zamknout", 2, "tiskne", "zamkne", "Musím ‚zamknout‘ kolo."),
  S("sednout", 2, "tiskne", "sedne", "Kluk si ‚sedl‘ na židli."),
  S("říznout", 2, "tiskne", "řízne", "Kuchař se ‚řízl‘ nožem do prstu."),
  // mine
  S("plynout", 2, "mine", "plyne", "Čas ‚plynul‘ pomalu."),
  S("hynout", 2, "mine", "hyne", "Květiny ‚hynuly‘ suchem."),
  S("kynout", 2, "mine", "kyne", "Těsto ‚kynulo‘ pod utěrkou."),
  // kryje
  S("pít", 3, "kryje", "pije", "Kluk ‚pil‘ limonádu brčkem."),
  S("hrát", 3, "kryje", "hraje", "Marek ‚hrál‘ na kytaru celý večer."),
  S("zout", 3, "kryje", "zuje", "Filip ‚zul‘ boty už ve dveřích."),
  S("šít", 3, "kryje", "šije", "Babička ‚šila‘ šaty pro panenku."),
  S("mýt", 3, "kryje", "myje", "Tomáš ‚myl‘ nádobí po obědě."),
  // kupuje
  S("pracovat", 3, "kupuje", "pracuje", "Táta ‚pracoval‘ na zahradě celé odpoledne."),
  S("malovat", 3, "kupuje", "maluje", "Adam ‚maloval‘ obrázek pastelkami."),
  S("cestovat", 3, "kupuje", "cestuje", "Rodina ‚cestovala‘ po Evropě."),
  S("tancovat", 3, "kupuje", "tancuje", "Děti ‚tancovaly‘ na besídce."),
  // prosí
  S("nosit", 4, "prosí", "nosí", "Listonoš ‚nosil‘ dopisy do schránek."),
  S("vozit", 4, "prosí", "vozí", "Řidič ‚vozil‘ děti do školy."),
  S("chodit", 4, "prosí", "chodí", "Honza ‚chodil‘ do kroužku keramiky."),
  S("vařit", 4, "prosí", "vaří", "Máma ‚vařila‘ polévku."),
  // trpí
  S("mlčet", 4, "trpí", "mlčí", "Žák ‚mlčel‘ celou hodinu."),
  S("sedět", 4, "trpí", "sedí", "Dědeček ‚seděl‘ na lavičce v parku."),
  S("ležet", 4, "trpí", "leží", "Kočka ‚ležela‘ na gauči."),
  S("letět", 4, "trpí", "letí", "Letadlo ‚letělo‘ nad mraky."),
  // sází
  S("házet", 4, "sází", "hází", "Honza ‚házel‘ míčem na koš."),
  S("pouštět", 4, "sází", "pouští", "Táta ‚pouštěl‘ draka na louce."),
  S("střílet", 4, "sází", "střílí", "Myslivec ‚střílel‘ na terč."),
  S("vracet", 4, "sází", "vrací", "Soused ‚vracel‘ půjčenou sekačku."),
  // dělá
  S("znát", 5, "dělá", "zná", "Průvodce ‚znal‘ každou uličku města."),
  S("mít", 5, "dělá", "má", "Strýček ‚měl‘ nový mobil."),
  S("volat", 5, "dělá", "volá", "Maminka ‚volala‘ na děti."),
  S("hledat", 5, "dělá", "hledá", "Děda ‚hledal‘ brýle."),
];

/**
 * Chybový model pro L2/L3(a): infinitiv na -at/-át svádí k dělá, na -et/-ět
 * k trpí; uvnitř třídy se plete kryje↔kupuje (3. tř.), tiskne↔mine↔začne
 * (2. tř.), prosí↔trpí↔sází (4. tř.). Poslední smyčka je záloha, aby
 * kandidátů bylo vždycky aspoň 3 (buildChoiceTask si vezme první tři různé).
 */
function distraktoryVzoru(s: Sloveso): Distractor[] {
  const out: Distractor[] = [];
  const infOvat = /ovat$/.test(s.infinitiv);

  if (/[aá]t$/.test(s.infinitiv) && s.vzor !== "dělá") {
    out.push({
      value: label(5, "dělá"),
      why: `Řídíš se infinitivem. Utvoř 3. osobu: „${s.tvar3}“ nekončí na -á, takže „${s.infinitiv}“ nepatří ke vzoru dělá — je to ${label(s.trida, s.vzor)}.`,
    });
  }
  if (/[eě]t$/.test(s.infinitiv) && s.vzor !== "trpí") {
    out.push({
      value: label(4, "trpí"),
      why: s.vzor === "sází"
        ? `Infinitiv na -et/-ět svádí ke vzoru trpí a 3. os. j. č. „${s.tvar3}“ to nerozhodne. Rozhodne 3. os. mn. č.: „oni …“ tu končí na -ejí/-ějí, proto „${s.infinitiv}“ patří ke vzoru sází, ne ke vzoru trpí.`
        : `Infinitiv na -et/-ět svádí ke vzoru trpí. Rozhoduje ale 3. osoba: „${s.tvar3}“ patří ke vzoru ${s.vzor}, ne ke vzoru trpí.`,
    });
  }
  if (s.trida === 1) {
    const jiny = VZORY.find((v) => v.trida === 1 && v.vzor !== s.vzor)!;
    out.push({
      value: label(1, jiny.vzor),
      why: `I ${jiny.vzor} je 1. třída, ale jiný vzor. „${s.infinitiv}“ (3. os. „${s.tvar3}“) patří ke vzoru ${s.vzor}, ne ke vzoru ${jiny.vzor}.`,
    });
  }
  if (s.trida === 2) {
    for (const j of VZORY.filter((v) => v.trida === 2 && v.vzor !== s.vzor)) {
      out.push({
        value: label(2, j.vzor),
        why: s.vzor === "začne" || j.vzor === "začne"
          ? `Vzor začne mají slovesa s infinitivem na -ít; ostatní slovesa 2. třídy se řadí podle souhlásky/samohlásky před -nout. „${s.infinitiv}“ patří ke vzoru ${s.vzor}.`
          : `Před -nout je u „${s.infinitiv}“ ${s.vzor === "tiskne" ? "souhláska" : "samohláska"} — proto vzor ${s.vzor}, ne ${j.vzor}.`,
      });
    }
  }
  if (s.trida === 3) {
    const jiny = VZORY.find((v) => v.trida === 3 && v.vzor !== s.vzor)!;
    out.push({
      value: label(3, jiny.vzor),
      why: `Vzor kupuje mají slovesa na -ovat, vzor kryje ostatní slovesa 3. třídy. „${s.infinitiv}“ ${infOvat ? "končí na -ovat" : "nekončí na -ovat"}, proto patří ke vzoru ${s.vzor}, ne ke vzoru ${jiny.vzor}.`,
    });
  }
  if (s.trida === 4) {
    for (const j of VZORY.filter((v) => v.trida === 4 && v.vzor !== s.vzor)) {
      if (out.some((o) => o.value === label(4, j.vzor))) continue;
      out.push({
        value: label(4, j.vzor),
        why: `U 4. třídy rozhoduje infinitiv a 3. osoba množného čísla: -it je vždy prosí; -et/-ět se 3. os. mn. č. na -ejí/-ějí je sází; ostatní -et/-ět je trpí. „${s.infinitiv}“ patří ke vzoru ${s.vzor}, ne ke vzoru ${j.vzor}.`,
      });
    }
  }
  if (s.trida === 5) {
    out.push({
      value: label(1, "bere"),
      why: `„${s.infinitiv}“ má ve 3. osobě tvar „${s.tvar3}“ na -á, to je 5. třída dělá — 1. třída bere má jiné zakončení (-e).`,
    });
  }
  for (const v of VZORY) {
    if (v.vzor === s.vzor) continue;
    if (out.some((o) => o.value === label(v.trida, v.vzor))) continue;
    out.push({
      value: label(v.trida, v.vzor),
      why: `Sloveso „${s.infinitiv}“ (3. os. „${s.tvar3}“) patří ke vzoru ${s.vzor}, ne ke vzoru ${v.vzor}.`,
    });
  }
  return out;
}

/** Znak, který rozhoduje o vzoru UVNITŘ třídy — navádí, vzor neprozradí. */
function znakVzoru(s: Sloveso): string {
  switch (s.trida) {
    case 1:
      return `Tvar končí na -e (a nejde o -ne ani -je). Vzor uvnitř této třídy rozlišíš podle infinitivu „${s.infinitiv}“: končí na -st/-zt, na -ct/-ci, na -řít, nebo na -at/-át? A mění se při časování souhláska na konci kmene (s → š, z → ž)?`;
    case 2:
      return `Tvar končí na -ne. Vzor uvnitř této třídy rozlišíš podle infinitivu „${s.infinitiv}“: stojí před -nout souhláska, nebo samohláska? (Infinitiv na -ít má vlastní vzor.)`;
    case 3:
      return `Tvar končí na -je. Vzor uvnitř této třídy rozlišíš podle infinitivu „${s.infinitiv}“: končí na -ovat, nebo ne?`;
    case 4:
      return `Tvar končí na -í. Vzor uvnitř této třídy rozlišíš podle infinitivu „${s.infinitiv}“ a třetí osoby množného čísla: končí infinitiv na -it? Pokud na -et/-ět, zní „oni …“ na -í, nebo na -ejí/-ějí?`;
    default:
      return `Tvar končí na -á. Tahle třída má jediný vzor — vybav si, který to je, a ověř, že sloveso „${s.infinitiv}“ se časuje stejně.`;
  }
}

function genL2(): PracticeTask | null {
  const s = pick(SLOVESA_L2);
  return choice(
    `Podle kterého vzoru se časuje sloveso ve větě „${s.veta}“?`,
    label(s.trida, s.vzor),
    distraktoryVzoru(s),
    {
      hints: [
        `Utvoř si třetí osobu jednotného čísla přítomného času slovesa ${s.infinitiv} — doplň „on/ona/ono dnes …“.`,
        znakVzoru(s),
      ],
      explanation: `Sloveso ${s.infinitiv} má ve 3. osobě jednotného čísla tvar „${s.tvar3}“, to je ${label(s.trida, s.vzor)}.`,
    },
  );
}

// ── L1(b) — jen třída podle koncovky 3. osoby (bez věty, bez vzoru) ────────
interface TridaPolozka {
  infinitiv: string;
  tvar3: string;
  trida: Trida;
}
const TRIDA_BANKA: TridaPolozka[] = [
  { infinitiv: "nosit", tvar3: "nosí", trida: 4 },
  { infinitiv: "dělat", tvar3: "dělá", trida: 5 },
  { infinitiv: "tisknout", tvar3: "tiskne", trida: 2 },
  { infinitiv: "kupovat", tvar3: "kupuje", trida: 3 },
  { infinitiv: "nést", tvar3: "nese", trida: 1 },
  { infinitiv: "začít", tvar3: "začne", trida: 2 },
  { infinitiv: "sázet", tvar3: "sází", trida: 4 },
  { infinitiv: "krýt", tvar3: "kryje", trida: 3 },
  { infinitiv: "péct", tvar3: "peče", trida: 1 },
  { infinitiv: "mlčet", tvar3: "mlčí", trida: 4 },
  { infinitiv: "malovat", tvar3: "maluje", trida: 3 },
  { infinitiv: "brát", tvar3: "bere", trida: 1 },
  { infinitiv: "minout", tvar3: "mine", trida: 2 },
  { infinitiv: "znát", tvar3: "zná", trida: 5 },
];
const REPR: { trida: Trida; ex: string; end: string }[] = [
  { trida: 1, ex: "nese", end: "-e" },
  { trida: 2, ex: "tiskne", end: "-ne" },
  { trida: 3, ex: "kryje", end: "-je" },
  { trida: 4, ex: "prosí", end: "-í" },
  { trida: 5, ex: "dělá", end: "-á" },
];
const ENDING: Record<Trida, string> = { 1: "-e", 2: "-ne", 3: "-je", 4: "-í", 5: "-á" };

function whyTrida(p: TridaPolozka, t: Trida): string {
  // Tvary 2. a 3. třídy taky končí na -e — tvrdit „nekončí na -e“ by nebyla pravda.
  if (t === 1 && (p.trida === 2 || p.trida === 3)) {
    return `Tvar „${p.tvar3}“ sice končí na -e, ale celé zakončení je ${ENDING[p.trida]}, a to patří ${p.trida}. třídě. 1. třída má -e bez -n- nebo -j- před ním.`;
  }
  return `Tvar „${p.tvar3}“ nekončí na ${ENDING[t]}, což je typické zakončení ${t}. třídy. Sloveso ${p.infinitiv} patří do ${p.trida}. třídy.`;
}

function genL1Trida(): PracticeTask | null {
  const p = pick(TRIDA_BANKA);
  const ostatni = ([1, 2, 3, 4, 5] as Trida[]).filter((t) => t !== p.trida);
  const distraktory: Distractor[] = ostatni.map((t) => ({ value: `${t}. třída`, why: whyTrida(p, t) }));
  const example = REPR.find((r) => r.trida !== p.trida)!;
  const zakonceni = p.trida === 1 ? "končí na -e a nejde o -ne ani -je" : `končí na ${ENDING[p.trida]}`;
  return choice(
    `Sloveso ${p.infinitiv} má ve 3. osobě tvar ${p.tvar3}. Do které třídy patří?`,
    `${p.trida}. třída`,
    distraktory,
    {
      hints: [
        `Podívej se, na jaké písmeno nebo slabiku tvar „${p.tvar3}“ končí.`,
        `Zakončení třetí osoby určuje třídu. Např. sloveso ${example.ex} má tvar na ${example.end} a patří do ${example.trida}. třídy — najdi stejné zakončení u tvaru „${p.tvar3}“.`,
      ],
      explanation: `Tvar „${p.tvar3}“ ${zakonceni}, proto sloveso ${p.infinitiv} patří do ${p.trida}. třídy.`,
    },
  );
}

// ── L1(a) — osoba a číslo zvýrazněného slovesa ve větě ─────────────────────
const OSOBA_CISLO = [
  "1. osoba, jednotné číslo", "2. osoba, jednotné číslo", "3. osoba, jednotné číslo",
  "1. osoba, množné číslo", "2. osoba, množné číslo", "3. osoba, množné číslo",
];
const ZAJMENO: Record<string, string> = {
  "1. osoba, jednotné číslo": "já",
  "2. osoba, jednotné číslo": "ty",
  "3. osoba, jednotné číslo": "on/ona/ono",
  "1. osoba, množné číslo": "my",
  "2. osoba, množné číslo": "vy",
  "3. osoba, množné číslo": "oni/ony/ona",
};
const KDO: Record<string, string> = {
  "1. osoba, jednotné číslo": "děj koná sám mluvčí",
  "2. osoba, jednotné číslo": "děj koná jeden oslovený",
  "3. osoba, jednotné číslo": "děj koná jeden člověk, zvíře nebo věc, o kterých se mluví",
  "1. osoba, množné číslo": "děj koná mluvčí spolu s dalšími",
  "2. osoba, množné číslo": "děj konají oslovení (víc než jeden)",
  "3. osoba, množné číslo": "děj koná víc lidí, zvířat nebo věcí, o kterých se mluví",
};
/** „2. osoba, jednotné číslo“ → „2. osoba jednotného čísla“ (pád podle `pad`). */
function osobaVeVazbe(o: string, pad: "nom" | "akuz"): string {
  const [osoba, cislo] = o.split(", ");
  const os = pad === "akuz" ? osoba.replace(/osoba$/, "osobu") : osoba;
  return `${os} ${cislo === "jednotné číslo" ? "jednotného čísla" : "množného čísla"}`;
}
interface OsobaPolozka {
  veta: string;
  forma: string;
  spravna: string;
}
const OSOBA_BANKA: OsobaPolozka[] = [
  { veta: "Tomáš ‚píše‘ úkol.", forma: "píše", spravna: "3. osoba, jednotné číslo" },
  { veta: "Já ‚čtu‘ knihu před spaním.", forma: "čtu", spravna: "1. osoba, jednotné číslo" },
  { veta: "Ty ‚pomáháš‘ mamince v kuchyni.", forma: "pomáháš", spravna: "2. osoba, jednotné číslo" },
  { veta: "My ‚stavíme‘ sněhuláka na dvorku.", forma: "stavíme", spravna: "1. osoba, množné číslo" },
  { veta: "Vy ‚zpíváte‘ krásně.", forma: "zpíváte", spravna: "2. osoba, množné číslo" },
  { veta: "Sourozenci ‚uklízejí‘ svůj pokoj.", forma: "uklízejí", spravna: "3. osoba, množné číslo" },
  { veta: "Babička ‚peče‘ koláč.", forma: "peče", spravna: "3. osoba, jednotné číslo" },
  { veta: "My ‚posloucháme‘ hudbu.", forma: "posloucháme", spravna: "1. osoba, množné číslo" },
  { veta: "Ty ‚kreslíš‘ hezký obrázek.", forma: "kreslíš", spravna: "2. osoba, jednotné číslo" },
  { veta: "Kamarádi ‚běhají‘ po hřišti.", forma: "běhají", spravna: "3. osoba, množné číslo" },
  { veta: "Já ‚uklízím‘ svůj pokoj.", forma: "uklízím", spravna: "1. osoba, jednotné číslo" },
  { veta: "Vy ‚vaříte‘ oběd pro všechny.", forma: "vaříte", spravna: "2. osoba, množné číslo" },
  { veta: "Pes ‚štěká‘ na pošťáka.", forma: "štěká", spravna: "3. osoba, jednotné číslo" },
  { veta: "My ‚hrajeme‘ fotbal na hřišti.", forma: "hrajeme", spravna: "1. osoba, množné číslo" },
];

function genL1Osoba(): PracticeTask | null {
  const p = pick(OSOBA_BANKA);
  const ostatni = OSOBA_CISLO.filter((o) => o !== p.spravna);
  const distraktory: Distractor[] = ostatni.map((o) => ({
    value: o,
    why: `Nejde o ${osobaVeVazbe(o, "akuz")} — ta by odpovídala zájmenu „${ZAJMENO[o]}“. Tvar „${p.forma}“ patří k zájmenu „${ZAJMENO[p.spravna]}“: ${KDO[p.spravna]}.`,
  }));
  return choice(
    `Urči osobu a číslo slovesa „${p.forma}“ ve větě „${p.veta}“.`,
    p.spravna,
    distraktory,
    {
      hints: [
        `Kdo ve větě dělá děj vyjádřený tvarem „${p.forma}“ — mluvčí, oslovený, nebo někdo/něco jiného? A je to jeden, nebo víc?`,
        `Zkus si k tvaru dosadit zájmeno: já/my, ty/vy, on-ona-ono/oni. Jednotné číslo je jeden, množné je víc.`,
      ],
      explanation: `Tvar „${p.forma}“ je ${osobaVeVazbe(p.spravna, "nom")}: ${KDO[p.spravna]}, dosadíme zájmeno „${ZAJMENO[p.spravna]}“ (${ZAJMENO[p.spravna]} ${p.forma}).`,
    },
  );
}

function genL1(): PracticeTask | null {
  return Math.random() < 0.5 ? genL1Osoba() : genL1Trida();
}

// ── L3(a) — past infinitivu: infinitiv svádí k jinému vzoru než 3. osoba ──
interface Trap {
  infinitiv: string;
  trida: Trida;
  vzor: string;
  tvar3: string;
  trapTrida: Trida;
  trapVzor: string;
  trapWhy: string; // proč past nesedí
  proc: string; // co o vzoru rozhoduje (do vysvětlení)
}
/** 4. třída na -et/-ět: o sází × trpí rozhodne 3. os. mn. č. */
const sazi = (infinitiv: string, tvar3: string, mn3: string): Trap => ({
  infinitiv, trida: 4, vzor: "sází", tvar3, trapTrida: 4, trapVzor: "trpí",
  trapWhy: `Infinitiv na -et/-ět svádí ke vzoru trpí a 3. os. j. č. „${tvar3}“ to nerozhodne — i trpí končí na -í. Rozhodne 3. os. mn. č.: „oni ${mn3}“ končí na -ejí/-ějí, kdežto „oni trpí“ na -í.`,
  proc: `tvar na -í znamená 4. třídu; infinitiv je na -et/-ět a 3. osoba množného čísla zní „oni ${mn3}“ (na -ejí/-ějí), což je znak vzoru sází`,
});
const trpi = (infinitiv: string, tvar3: string): Trap => ({
  infinitiv, trida: 4, vzor: "trpí", tvar3, trapTrida: 4, trapVzor: "sází",
  trapWhy: `Infinitiv na -et/-ět mají oba vzory, trpí i sází. Rozhodne 3. os. mn. č.: „oni ${tvar3}“ končí na -í, ne na -ejí/-ějí jako „oni sázejí“.`,
  proc: `tvar na -í znamená 4. třídu; 3. osoba množného čísla zní „oni ${tvar3}“ (na -í, ne na -ejí), což je znak vzoru trpí`,
});
const TRAPY: Trap[] = [
  {
    infinitiv: "psát", trida: 1, vzor: "maže", tvar3: "píše", trapTrida: 5, trapVzor: "dělá",
    trapWhy: "Infinitiv na -át svádí ke vzoru dělá. Jenže 3. osoba nezní „psá“, ale „píše“ — končí na -e, takže jde o 1. třídu.",
    proc: "tvar končí na -e (1. třída) a při časování se mění s → š (psát – píše), stejně jako z → ž u vzoru maže",
  },
  {
    infinitiv: "česat", trida: 1, vzor: "maže", tvar3: "češe", trapTrida: 5, trapVzor: "dělá",
    trapWhy: "Infinitiv na -at svádí ke vzoru dělá. Jenže 3. osoba nezní „česá“, ale „češe“ — končí na -e, takže jde o 1. třídu.",
    proc: "tvar končí na -e (1. třída) a při časování se mění s → š (česat – češe), stejně jako z → ž u vzoru maže",
  },
  {
    infinitiv: "prát", trida: 1, vzor: "bere", tvar3: "pere", trapTrida: 5, trapVzor: "dělá",
    trapWhy: "Infinitiv na -át svádí ke vzoru dělá. Jenže 3. osoba nezní „prá“, ale „pere“ — končí na -e, takže jde o 1. třídu.",
    proc: "tvar končí na -e (1. třída) a kmen se mění stejně jako u slovesa brát (prát – pere, brát – bere)",
  },
  {
    infinitiv: "hrát", trida: 3, vzor: "kryje", tvar3: "hraje", trapTrida: 5, trapVzor: "dělá",
    trapWhy: "Infinitiv na -át svádí ke vzoru dělá. Jenže 3. osoba nezní „hrá“, ale „hraje“ — končí na -je, takže jde o 3. třídu.",
    proc: "tvar končí na -je (3. třída) a infinitiv nekončí na -ovat",
  },
  {
    infinitiv: "pít", trida: 3, vzor: "kryje", tvar3: "pije", trapTrida: 3, trapVzor: "kupuje",
    trapWhy: "Tvar „pije“ na -je je opravdu 3. třída, ale vzor kupuje mají jen slovesa s infinitivem na -ovat. „pít“ na -ovat nekončí.",
    proc: "tvar končí na -je (3. třída) a infinitiv nekončí na -ovat",
  },
  {
    infinitiv: "zavřít", trida: 1, vzor: "umře", tvar3: "zavře", trapTrida: 2, trapVzor: "začne",
    trapWhy: "Infinitiv na -ít připomíná začít. Jenže 3. osoba „zavře“ nekončí na -ne, ale jen na -e — to je 1. třída, ne 2.",
    proc: "tvar končí na -e (1. třída) a infinitiv končí na -řít",
  },
  {
    infinitiv: "třít", trida: 1, vzor: "umře", tvar3: "tře", trapTrida: 2, trapVzor: "začne",
    trapWhy: "Infinitiv na -ít připomíná začít. Jenže 3. osoba „tře“ nekončí na -ne, ale jen na -e — to je 1. třída, ne 2.",
    proc: "tvar končí na -e (1. třída) a infinitiv končí na -řít",
  },
  sazi("házet", "hází", "házejí"),
  sazi("pouštět", "pouští", "pouštějí"),
  sazi("střílet", "střílí", "střílejí"),
  sazi("vracet", "vrací", "vracejí"),
  sazi("rozumět", "rozumí", "rozumějí"),
  trpi("mlčet", "mlčí"),
  trpi("ležet", "leží"),
];

function genL3a(): PracticeTask | null {
  const t = pick(TRAPY);
  const fake: Sloveso = { infinitiv: t.infinitiv, trida: t.trida, vzor: t.vzor, tvar3: t.tvar3, veta: "" };
  const trapValue = label(t.trapTrida, t.trapVzor);
  const rest = distraktoryVzoru(fake).filter((d) => d.value !== trapValue);
  const distraktory: Distractor[] = [{ value: trapValue, why: t.trapWhy }, ...rest];
  return choice(
    `Podle kterého vzoru se časuje sloveso „${t.infinitiv}“?`,
    label(t.trida, t.vzor),
    distraktory,
    {
      hints: [
        `Infinitiv může klamat. Doplň: on/ona/ono dnes … (sloveso ${t.infinitiv}).`,
        `Tvar třetí osoby jednotného čísla od slovesa ${t.infinitiv} určí třídu (-e, -ne, -je, -í, -á). Vzor uvnitř třídy pak určí znak infinitivu (-ovat, hláska před -nout, -řít, střídání souhlásek) nebo třetí osoba množného čísla. U tvaru na -í doplň i „oni dnes …“ a sleduj, jestli končí na -í, nebo na -ejí/-ějí.`,
      ],
      explanation: `Sloveso „${t.infinitiv}“ má ve 3. osobě jednotného čísla tvar „${t.tvar3}“: ${t.proc}. Proto ${label(t.trida, t.vzor)}.`,
    },
  );
}

// ── L3(b) — inverze: které ze čtyř sloves se časuje jinak než ostatní ─────
// Všechna čtyři slovesa mají stejné zakončení infinitivu (-et/-ět, -nout,
// -at/-át, -ít), takže lichý se nepozná pohledem — až po utvoření tvarů.
interface Odlisny {
  stejne: [string, string][]; // [infinitiv, věta] ×3
  jine: [string, string];
  vzorStejny: string;
  vzorJiny: string;
  hint: string; // rozhodující znak této sady
  proc: string; // zdůvodnění do vysvětlení
}
const H_MN3 = "Všechna čtyři mají infinitiv na -et/-ět a ve třetí osobě j. č. tvar na -í, takže to nerozhodne. Doplň u každého „oni dnes …“: končí tvar na -í, nebo na -ejí/-ějí?";
const H_NOUT = "Všechna čtyři mají infinitiv na -nout a ve třetí osobě j. č. tvar na -ne. Podívej se na hlásku těsně před -nout: je to souhláska, nebo samohláska?";
const ODLISNE: Odlisny[] = [
  {
    stejne: [["házet", "Honza ‚házel‘ kamínky do vody."], ["pouštět", "Táta ‚pouštěl‘ draka."], ["střílet", "Myslivec ‚střílel‘ na terč."]],
    jine: ["sedět", "Dědeček ‚seděl‘ na lavičce."], vzorStejny: "sází", vzorJiny: "trpí", hint: H_MN3,
    proc: "„oni házejí, pouštějí, střílejí“ končí na -ejí/-ějí (vzor sází), ale „oni sedí“ končí na -í (vzor trpí)",
  },
  {
    stejne: [["vracet", "Soused ‚vracel‘ půjčenou sekačku."], ["rozumět", "Žák ‚rozuměl‘ úloze."], ["házet", "Brankář ‚házel‘ míč daleko."]],
    jine: ["ležet", "Kočka ‚ležela‘ na gauči."], vzorStejny: "sází", vzorJiny: "trpí", hint: H_MN3,
    proc: "„oni vracejí, rozumějí, házejí“ končí na -ejí/-ějí (vzor sází), ale „oni leží“ končí na -í (vzor trpí)",
  },
  {
    stejne: [["mlčet", "Žák ‚mlčel‘ při zkoušení."], ["sedět", "Babička ‚seděla‘ u okna."], ["ležet", "Pes ‚ležel‘ před boudou."]],
    jine: ["střílet", "Hráč ‚střílel‘ na bránu."], vzorStejny: "trpí", vzorJiny: "sází", hint: H_MN3,
    proc: "„oni mlčí, sedí, leží“ končí na -í (vzor trpí), ale „oni střílejí“ končí na -ejí (vzor sází)",
  },
  {
    stejne: [["letět", "Pták ‚letěl‘ nad polem."], ["vidět", "Děda ‚viděl‘ v lese srnku."], ["mlčet", "Kluk ‚mlčel‘ celou cestu."]],
    jine: ["pouštět", "Děti ‚pouštěly‘ lodičky po potoce."], vzorStejny: "trpí", vzorJiny: "sází", hint: H_MN3,
    proc: "„oni letí, vidí, mlčí“ končí na -í (vzor trpí), ale „oni pouštějí“ končí na -ějí (vzor sází)",
  },
  {
    stejne: [["vracet", "Prodavač ‚vracel‘ drobné."], ["pouštět", "Děti ‚pouštěly‘ draka."], ["střílet", "Útočník ‚střílel‘ góly."]],
    jine: ["letět", "Letadlo ‚letělo‘ nad mraky."], vzorStejny: "sází", vzorJiny: "trpí", hint: H_MN3,
    proc: "„oni vracejí, pouštějí, střílejí“ končí na -ejí/-ějí (vzor sází), ale „oni letí“ končí na -í (vzor trpí)",
  },
  {
    stejne: [["zamknout", "Tomáš ‚zamkl‘ kolo."], ["sednout", "Kluk si ‚sedl‘ na židli."], ["říznout", "Kuchař se ‚řízl‘ do prstu."]],
    jine: ["hynout", "Rostliny ‚hynuly‘ suchem."], vzorStejny: "tiskne", vzorJiny: "mine", hint: H_NOUT,
    proc: "u „zamknout, sednout, říznout“ stojí před -nout souhláska (vzor tiskne), u „hynout“ samohláska (vzor mine)",
  },
  {
    stejne: [["plynout", "Čas ‚plynul‘ pomalu."], ["hynout", "Květiny ‚hynuly‘ v suchu."], ["kynout", "Těsto ‚kynulo‘ pod utěrkou."]],
    jine: ["zamknout", "Školník ‚zamkl‘ bránu."], vzorStejny: "mine", vzorJiny: "tiskne", hint: H_NOUT,
    proc: "u „plynout, hynout, kynout“ stojí před -nout samohláska (vzor mine), u „zamknout“ souhláska (vzor tiskne)",
  },
  {
    stejne: [["psát", "Eliška ‚psala‘ dopis."], ["řezat", "Truhlář ‚řezal‘ prkno."], ["lízat", "Kočka ‚lízala‘ mléko."]],
    jine: ["prát", "Babička ‚prala‘ prádlo."], vzorStejny: "maže", vzorJiny: "bere",
    hint: "Všechna čtyři mají infinitiv na -at/-át a ve třetí osobě j. č. tvar na -e. Sleduj souhlásku na konci kmene: mění se při časování (s → š, z → ž), nebo zůstává?",
    proc: "„píše, řeže, líže“ mění souhlásku (s → š, z → ž) jako vzor maže, kdežto „pere“ souhlásku nemění a kmen se mění jako u slovesa brát (vzor bere)",
  },
  {
    stejne: [["řezat", "Děda ‚řezal‘ větve."], ["česat", "Maminka ‚česala‘ dceru."], ["lízat", "Pes ‚lízal‘ kost."]],
    jine: ["volat", "Trenér ‚volal‘ na hráče."], vzorStejny: "maže", vzorJiny: "dělá",
    hint: "Všechna čtyři mají infinitiv na -at, takže to nerozhodne. Doplň u každého „on/ona dnes …“: končí tvar na -e, nebo na -á?",
    proc: "„řeže, češe, líže“ končí na -e (1. třída, vzor maže), ale „volá“ na -á (5. třída, vzor dělá)",
  },
  {
    stejne: [["volat", "Maminka ‚volala‘ děti k obědu."], ["hledat", "Děda ‚hledal‘ brýle."], ["čekat", "Pes ‚čekal‘ u dveří."]],
    jine: ["česat", "Holčička ‚česala‘ panenku."], vzorStejny: "dělá", vzorJiny: "maže",
    hint: "Všechna čtyři mají infinitiv na -at, takže to nerozhodne. Doplň u každého „on/ona dnes …“: končí tvar na -á, nebo na -e?",
    proc: "„volá, hledá, čeká“ končí na -á (5. třída, vzor dělá), ale „češe“ na -e (1. třída, vzor maže)",
  },
  {
    stejne: [["hrát", "Bratr ‚hrál‘ šachy."], ["přát", "Babička mi ‚přála‘ k narozeninám."], ["hřát", "Kamna ‚hřála‘ celou místnost."]],
    jine: ["znát", "Průvodce ‚znal‘ každou uličku."], vzorStejny: "kryje", vzorJiny: "dělá",
    hint: "Všechna čtyři mají infinitiv na -át, takže to nerozhodne. Doplň u každého „on/ona dnes …“: končí tvar na -je, nebo na -á?",
    proc: "„hraje, přeje, hřeje“ končí na -je (3. třída, vzor kryje), ale „zná“ na -á (5. třída, vzor dělá)",
  },
  {
    stejne: [["pít", "Miminko ‚pilo‘ mléko."], ["šít", "Krejčí ‚šil‘ oblek."], ["bít", "Hodiny ‚bily‘ poledne."]],
    jine: ["zavřít", "Tomáš ‚zavřel‘ okno."], vzorStejny: "kryje", vzorJiny: "umře",
    hint: "Všechna čtyři mají infinitiv na -ít, takže to nerozhodne. Doplň u každého „on/ona dnes …“: končí tvar na -je, nebo jen na -e?",
    proc: "„pije, šije, bije“ končí na -je (3. třída, vzor kryje), ale „zavře“ jen na -e (1. třída, vzor umře)",
  },
  {
    stejne: [["zavřít", "Honza ‚zavřel‘ dveře."], ["třít", "Kuchařka ‚třela‘ mrkev."], ["prostřít", "Maminka ‚prostřela‘ stůl."]],
    jine: ["šít", "Babička ‚šila‘ zástěru."], vzorStejny: "umře", vzorJiny: "kryje",
    hint: "Všechna čtyři mají infinitiv na -ít, takže to nerozhodne. Doplň u každého „on/ona dnes …“: končí tvar jen na -e, nebo na -je?",
    proc: "„zavře, tře, prostře“ končí jen na -e (1. třída, vzor umře), ale „šije“ na -je (3. třída, vzor kryje)",
  },
];

function genL3b(): PracticeTask | null {
  const o = pick(ODLISNE);
  // Pevné (abecední) pořadí → stejná sada dá vždy stejné zadání a ruzneUlohy
  // ji ve vzorku nezopakuje jen s jinak zamíchanými větami.
  const all = [...o.stejne, o.jine]
    .map(([inf, veta]) => ({ inf, veta }))
    .sort((a, b) => a.inf.localeCompare(b.inf, "cs"));
  const cislovane = all.map((x, i) => `(${i + 1}) „${x.veta}“`).join(" ");
  const options = all.map((x) => `sloveso „${x.inf}“`);
  const odd = o.jine[0];
  const optionFeedback: Record<string, string> = {};
  for (const x of all) {
    if (x.inf === odd) continue;
    optionFeedback[`sloveso „${x.inf}“`] =
      `„${x.inf}“ se spolu s dalšími dvěma slovesy časuje podle vzoru ${o.vzorStejny} — patří do trojice, která k sobě sedí. Odlišné je „${odd}“ (vzor ${o.vzorJiny}).`;
  }
  return {
    question: `Které sloveso se NEčasuje podle stejného vzoru jako ostatní tři ve větách ${cislovane}?`,
    correctAnswer: `sloveso „${odd}“`,
    options,
    optionFeedback,
    hints: [
      `U sloves ${all.map((x) => x.inf).join(", ")} utvoř třetí osobu přítomného času. Samotný infinitiv tady nepomůže — končí u všech stejně.`,
      o.hint,
    ],
    explanation: `${o.proc[0].toUpperCase()}${o.proc.slice(1)}. Proto se od ostatních liší „${odd}“.`,
  };
}

// ── L3(c) — čas a vid dohromady ────────────────────────────────────────────
const CAS_VID = [
  "čas přítomný, vid nedokonavý",
  "čas budoucí, vid nedokonavý",
  "čas budoucí, vid dokonavý",
  "čas přítomný, vid dokonavý",
] as const;
type CasVid = (typeof CAS_VID)[number];
interface CasVidPolozka {
  veta: string;
  forma: string;
  spravna: CasVid;
  signal?: string; // časové určení ve větě, které čas potvrzuje
}
const CAS_VID_BANKA: CasVidPolozka[] = [
  { veta: "Zítra ‚dopíšu‘ referát.", forma: "dopíšu", spravna: "čas budoucí, vid dokonavý", signal: "zítra" },
  { veta: "Kamarád mi zítra ‚přinese‘ knihu.", forma: "přinese", spravna: "čas budoucí, vid dokonavý", signal: "zítra" },
  { veta: "Za chvíli ‚udělám‘ svačinu.", forma: "udělám", spravna: "čas budoucí, vid dokonavý", signal: "za chvíli" },
  { veta: "Máma zítra ‚koupí‘ nový batoh.", forma: "koupí", spravna: "čas budoucí, vid dokonavý", signal: "zítra" },
  { veta: "Hned ‚napíšu‘ odpověď.", forma: "napíšu", spravna: "čas budoucí, vid dokonavý", signal: "hned" },
  { veta: "‚Budu psát‘ referát celý večer.", forma: "budu psát", spravna: "čas budoucí, vid nedokonavý" },
  { veta: "Zítra ‚budu dělat‘ úkoly celé dopoledne.", forma: "budu dělat", spravna: "čas budoucí, vid nedokonavý", signal: "zítra" },
  { veta: "O víkendu ‚budu číst‘ novou knihu.", forma: "budu číst", spravna: "čas budoucí, vid nedokonavý", signal: "o víkendu" },
  { veta: "Odpoledne ‚budu kreslit‘ obrázek.", forma: "budu kreslit", spravna: "čas budoucí, vid nedokonavý", signal: "odpoledne" },
  { veta: "Právě teď ‚píšu‘ referát.", forma: "píšu", spravna: "čas přítomný, vid nedokonavý", signal: "právě teď" },
  { veta: "Právě ‚dělám‘ domácí úkol.", forma: "dělám", spravna: "čas přítomný, vid nedokonavý", signal: "právě" },
  { veta: "Teď si ‚čtu‘ komiks.", forma: "čtu", spravna: "čas přítomný, vid nedokonavý", signal: "teď" },
  { veta: "Zrovna ‚kreslím‘ mapu pokladu.", forma: "kreslím", spravna: "čas přítomný, vid nedokonavý", signal: "zrovna" },
];

/** Proč je ČAS takový, jaký je (bez úvodní nálepky). */
function casProc(i: CasVidPolozka): string {
  const sig = i.signal ? ` Napovídá to i „${i.signal}“ ve větě.` : "";
  if (i.spravna === "čas budoucí, vid dokonavý") {
    return `Dokonavé sloveso nemá přítomný čas — jeho přítomný tvar „${i.forma}“ vyjadřuje budoucnost.${sig}`;
  }
  if (i.spravna === "čas budoucí, vid nedokonavý") {
    return `Tvar obsahuje „budu“, a to je znak budoucího času.${sig}`;
  }
  return `Tvar „${i.forma}“ neobsahuje „budu/budeš…“ a sloveso je nedokonavé, děj tedy probíhá teď.${sig}`;
}
/** Proč je VID takový, jaký je (bez úvodní nálepky). */
function vidProc(i: CasVidPolozka): string {
  if (i.spravna === "čas budoucí, vid dokonavý") {
    return `„Právě teď ${i.forma}“ nedává smysl, protože děj bude dokončený — sloveso je dokonavé.`;
  }
  if (i.spravna === "čas budoucí, vid nedokonavý") {
    return "Spojení „budu + infinitiv“ tvoří jen nedokonavá slovesa (nejde říct „budu napsat“).";
  }
  return `„Právě teď ${i.forma}“ dává smysl, děj probíhá a není hotový — sloveso je nedokonavé.`;
}

function whyCasVid(i: CasVidPolozka, wrong: CasVid): string {
  if (wrong === "čas přítomný, vid dokonavý") {
    return "Tahle možnost ani neexistuje — dokonavé sloveso nemá přítomný čas, jeho přítomný tvar vždy míří do budoucnosti.";
  }
  const [casS, vidS] = i.spravna.split(", ");
  const [casW, vidW] = wrong.split(", ");
  const casChyba = casS !== casW;
  const vidChyba = vidS !== vidW;
  if (casChyba && vidChyba) {
    return `Špatně je čas i vid. Čas: ${casProc(i)} Vid: ${vidProc(i)}`;
  }
  if (vidChyba) return `Vid jsi určil obráceně. ${vidProc(i)}`;
  return `Čas jsi určil špatně. ${casProc(i)}`;
}

function vysvetleniCasVid(i: CasVidPolozka): string {
  const sig = i.signal ? ` Potvrzuje to i „${i.signal}“ ve větě.` : "";
  if (i.spravna === "čas budoucí, vid dokonavý") {
    return `„${i.forma}“ je dokonavé sloveso: děj bude dokončený, a proto „právě teď ${i.forma}“ nedává smysl. Dokonavé sloveso nemá přítomný čas — jeho přítomný tvar vyjadřuje budoucnost.${sig} Proto čas budoucí, vid dokonavý.`;
  }
  if (i.spravna === "čas budoucí, vid nedokonavý") {
    return `„${i.forma}“ je složený tvar „budu + infinitiv“: vyjadřuje budoucnost a tvoří ho jen nedokonavá slovesa (nejde říct „budu napsat“).${sig} Proto čas budoucí, vid nedokonavý.`;
  }
  return `„${i.forma}“ neobsahuje „budu“ a „právě teď ${i.forma}“ dává smysl — děj právě probíhá a není hotový. Nedokonavé sloveso v přítomném tvaru vyjadřuje přítomnost.${sig} Proto čas přítomný, vid nedokonavý.`;
}

function genL3c(): PracticeTask | null {
  const item = pick(CAS_VID_BANKA);
  const distraktory: Distractor[] = CAS_VID
    .filter((c) => c !== item.spravna)
    .map((c) => ({ value: c, why: whyCasVid(item, c) }));
  return choice(
    `Jaký čas a vid má sloveso „${item.forma}“ ve větě „${item.veta}“?`,
    item.spravna,
    distraktory,
    {
      hints: [
        `Nejdřív zkus tvar „${item.forma}“ nahradit spojením „budu/budeš + základní tvar slovesa“ — jde to přirozeně, nebo by to znělo divně?`,
        "Metoda: obsahuje-li tvar „budu/budeš…“ + infinitiv, jde o čas, který teprve přijde. Pokud „budu“ neobsahuje, zkus před něj dát „právě teď“: dává-li to smysl, děj právě probíhá; nedává-li smysl, jde o jednorázové dokonané jednání, jehož přítomný tvar vždy míří do budoucnosti.",
      ],
      explanation: vysvetleniCasVid(item),
    },
  );
}

function genL3(): PracticeTask | null {
  const r = Math.random();
  if (r < 1 / 3) return genL3a();
  if (r < 2 / 3) return genL3b();
  return genL3c();
}

// ── Generátor ────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor), 24, 400);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const SLOVESA_TRIDY_A_VZORY: TopicMetadata[] = [
  {
    id: "g6-cjl-slovesa-tridy-a-vzory-6",
    rvpNodeId: "g6-cjl-jazykova-vychova-tvaroslovi-slovesa-mluvnicke-kategorie-slovesne-tridy-a-vzory",
    displayName: "Slovesné třídy a vzory",
    title: "Slovesa - mluvnické kategorie, slovesné třídy a vzory",
    studentTitle: "Slovesné třídy a vzory",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Podle 3. osoby zařadíš sloveso do třídy, ke vzoru a určíš vid.",
    keywords: [
      "slovesná třída", "slovesný vzor", "3. osoba", "vid", "dokonavé sloveso",
      "nedokonavé sloveso", "časování", "mluvnické kategorie", "osoba a číslo",
    ],
    goals: [
      "Určit osobu a číslo slovesa ve větě a třídu podle koncovky 3. osoby.",
      "Zařadit sloveso ve větě do slovesné třídy podle 3. osoby jednotného čísla (ne podle vzhledu infinitivu) a uvnitř třídy určit vzor.",
      "Rozlišit u slovesa čas a vid a poznat, že dokonavé sloveso v přítomném tvaru vyjadřuje budoucí čas.",
    ],
    boundaries: [
      "Třída se určuje podle 3. osoby jednotného čísla přítomného času; vzor uvnitř třídy podle znaku infinitivu nebo 3. osoby množného čísla.",
      "Sporná slovesa (stát, bát se, chtít, spát) se nepoužívají jako klíč.",
      "Počet vzorů 1. třídy se v testu neřeší jako sporný bod.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Třídu poznáš podle 3. osoby jednotného čísla přítomného času, ne podle vzhledu infinitivu: -e nese/bere/maže/peče/umře, -ne tiskne/mine/začne, -je kryje/kupuje, -í prosí/trpí/sází, -á dělá. Vzor uvnitř třídy rozliší infinitiv (-ovat, hláska před -nout, -řít…) nebo 3. osoba množného čísla (oni sázejí × oni trpí). Dokonavé sloveso nemá přítomný čas — jeho přítomný tvar vyjadřuje budoucnost.",
      steps: [
        "Utvoř si 3. osobu jednotného čísla přítomného času (on/ona/ono dnes …).",
        "Podle zakončení tohoto tvaru urči třídu (-e, -ne, -je, -í, -á).",
        "Uvnitř třídy urči vzor podle znaku infinitivu, u 4. třídy i podle tvaru „oni …“ (-í, nebo -ejí/-ějí).",
        "U času a vidu zkontroluj, jestli tvar neobsahuje „budu/budeš…“, a jestli jde dosadit „právě teď“.",
      ],
      commonMistake: "Určit třídu podle infinitivu místo podle 3. osoby (psát vypadá jako dělat, ale píše je 1. třída maže), nebo označit dokonavé sloveso v přítomném tvaru za přítomný čas.",
      example: "Psát → píše → 1. třída, vzor maže (ne dělá). Zítra dopíšu referát → čas budoucí, vid dokonavý.",
    },
  },
];
