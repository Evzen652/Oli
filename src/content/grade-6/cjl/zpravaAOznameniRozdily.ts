/**
 * Čeština 6. ročník — Zpráva a oznámení, rozdíly (select_one).
 *
 * Dovednost je rozhodnutí o žánru (podle ČASU DĚJE) a o úplnosti textu podle
 * znaků. Navazuje na grade-4/cjl/inzeratVzkazTelefonickyRozhovor.ts (inzerát
 * jako kontrast) a grade-5/cjl/posuzovaniUplnostiSdeleni.ts (úplnost sdělení
 * kdo/co/kde/kdy).
 *
 *  • L1 — ROZPOZNÁNÍ ŽÁNRU: (a) krátká ukázka (2–3 věty) → zpráva / oznámení /
 *    vypravování / inzerát (klíč se střídá mezi všemi čtyřmi útvary), podle
 *    funkce textu a u věcných textů podle času děje (minulý vs. budoucí/výzva).
 *    (b) definice — dokončení věty o tom, co zpráva/oznámení dělá a čím se
 *    liší od vypravování/inzerátu.
 *  • L2 — POUŽITÍ ZNAKŮ: (a) oznámení, kterému chybí právě jeden ze čtyř
 *    údajů (kdo/co/kdy/kde) — vyber, který. (b) vhodná první věta zprávy
 *    (věcná, minulý čas) mezi oznamovací, hodnotící a vypravovací distraktory.
 *    (c) čtyři věty o události, jedna z nich (osobní dojem) do zprávy nepatří.
 *  • L3 — ANALÝZA A PŘENOS: (a) převod oznámení na zprávu po proběhlé akci
 *    (stejné datum a místo, minulý čas; distraktory: budoucí děj, jiné místo,
 *    hodnocení bez místa). (b) smíšený text (zpráva + oznámení
 *    za sebou) — přiřaď, která věta je co. (c) situace — jaký útvar a proč
 *    (útvar × důvod, čtyři kombinace).
 *
 * Chybový model (errorModel, viz zadání tématu):
 *  • rozhoduje podle TÉMATU, ne podle času děje (školní akce = vždy oznámení);
 *  • za zprávu považuje každý text s datem a místem, i když je v budoucnu;
 *  • zaměňuje zprávu s vypravováním (dojmy, zápletka) a oznámení s inzerátem;
 *  • při kontrole úplnosti přehlédne chybějící údaj nebo naopak označí údaj,
 *    který v textu je; do zprávy přidává osobní hodnocení.
 *
 * Determinismus: gen() nemá žádný stav mezi voláními — rotace pool[] se
 * počítá při každém volání znovu (viz src/test/generator-determinism.test.ts).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, ruzneUlohy, losUlohy, type Distractor } from "./_shared";

/**
 * buildChoiceTask, ale nápovědy přesně tak, jak je napíšeme. `_shared` ke krátké
 * velké nápovědě připojuje „Dosaď každou možnost zpátky do věty…“, což u ukázek,
 * chybějícího údaje ani výběru věty nedává smysl (není kam dosazovat). Velké
 * nápovědy jsou proto psané celé a aspoň o pětinu delší než malé.
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
// L1 (a) — rozpoznání žánru ze čtyř možností
// ════════════════════════════════════════════════════════════════════════

type Zanr = "zpráva" | "oznámení" | "vypravování" | "inzerát";
const ZANRY: Zanr[] = ["zpráva", "oznámení", "vypravování", "inzerát"];

/**
 * Zpětná vazba k distraktoru: klíč = `${správný útvar}>${zvolený útvar}`.
 * Každý text popisuje, proč zvolený útvar na TUHLE ukázku nesedí.
 */
const ZANR_WHY: Record<string, string> = {
  // správně zpráva
  "zpráva>oznámení":
    "Oznámení by mluvilo o tom, co se teprve stane. Sloveso v ukázce je ale v minulém čase, děj už proběhl.",
  "zpráva>vypravování":
    "Vypravování líčí příběh s napětím a prožitky vypravěče. Tahle ukázka je věcná a stručná, bez zápletky a bez pocitů.",
  "zpráva>inzerát":
    "Inzerátem se něco nabízí nebo shání (prodám, koupím, hledám). Tahle ukázka o nabídce ani poptávce není.",
  // správně oznámení
  "oznámení>zpráva":
    "Zpráva by mluvila o tom, co už proběhlo. Tady děj teprve nastane (bude, pojede, koná se s datem dopředu) nebo jde o výzvu.",
  "oznámení>vypravování":
    "Vypravování líčí příběh s napětím a prožitky vypravěče. Tahle ukázka věcně upozorňuje na to, co teprve bude.",
  "oznámení>inzerát":
    "Inzerátem se něco nabízí nebo shání (prodám, koupím, hledám). Tahle ukázka upozorňuje na akci nebo změnu, nic neprodává.",
  // správně vypravování
  "vypravování>zpráva":
    "Zpráva je věcná, bez napětí a bez pocitů pisatele. Tahle ukázka vypráví příběh v 1. osobě a líčí, co vypravěč prožíval.",
  "vypravování>oznámení":
    "Oznámení upozorňuje předem na akci (co, kdy, kde). Tahle ukázka vypráví příběh, který se už stal, s napětím a pocity.",
  "vypravování>inzerát":
    "Inzerátem se něco nabízí nebo shání. Tahle ukázka nic nenabízí, vypráví příběh.",
  // správně inzerát
  "inzerát>zpráva":
    "Zpráva informuje o události, která proběhla. Tahle ukázka o žádné události nemluví, pisatel něco nabízí nebo shání.",
  "inzerát>oznámení":
    "Oznámení upozorňuje na akci nebo změnu, která teprve bude. Tahle ukázka na nic nezve, pisatel něco nabízí nebo shání.",
  "inzerát>vypravování":
    "Vypravování líčí příběh. Tahle ukázka žádný příběh nemá, pisatel v ní něco nabízí nebo shání.",
};

function zanrDistraktory(spravny: Zanr): Distractor[] {
  return ZANRY.filter((z) => z !== spravny).map((z) => ({ value: z, why: ZANR_WHY[`${spravny}>${z}`] }));
}

const ZANR_VYSVETLENI: Record<Zanr, string> = {
  "zpráva": "věcně a bez osobních dojmů informuje o události, která se už stala",
  "oznámení": "upozorňuje předem na to, co se teprve stane, nebo vyzývá k účasti",
  "vypravování": "vypravěč v 1. osobě líčí příběh s napětím a se svými pocity",
  "inzerát": "pisatel v ní něco nabízí nebo shání",
};

interface Ukazka {
  tema: string;
  text: string;
  zanr: Zanr;
}

const UKAZKY: Ukazka[] = [
  // ── zprávy (minulý čas) ──
  { tema: "sběr papíru", zanr: "zpráva",
    text: "Ve čtvrtek proběhl sběr starého papíru. Žáci školy vybrali přes 800 kilogramů. Nejvíc odevzdala 6. A." },
  { tema: "školní výlet", zanr: "zpráva",
    text: "V pátek 16. října jela 6. A na výlet na zámek Kost. Žáci si prohlédli zámek i věž." },
  { tema: "turnaj ve florbale", zanr: "zpráva",
    text: "V úterý se konal turnaj ve florbale mezi šestými třídami. Zvítězila 6. B, druhá skončila 6. C." },
  { tema: "kroužek keramiky", zanr: "zpráva",
    text: "Kroužek keramiky se minulý týden poprvé sešel. Děti si vyrobily první misky z hlíny." },
  { tema: "školní knihovna", zanr: "zpráva",
    text: "Školní knihovna minulý měsíc přivítala pět set nových čtenářů. Nejoblíbenější byly knihy o zvířatech." },
  { tema: "divadelní představení", zanr: "zpráva",
    text: "Šesťáci navštívili v pondělí divadelní představení Pyšná princezna. Herci sklidili velký potlesk." },
  { tema: "zápis do kroužků", zanr: "zpráva",
    text: "Zápis do sportovních kroužků skončil minulý pátek. Přihlásilo se přes sto žáků." },
  { tema: "recitační soutěž", zanr: "zpráva",
    text: "V recitační soutěži zvítězila Tereza Nováková z 6. A. Porota ocenila i Jakuba Krále." },
  { tema: "přerušená voda", zanr: "zpráva",
    text: "V obci byla ve středu přerušena dodávka vody kvůli opravě potrubí. Voda tekla znovu po poledni." },
  { tema: "školní jarmark", zanr: "zpráva",
    text: "Školní jarmark minulou sobotu vynesl přes deset tisíc korun. Výtěžek podpoří nový herní prvek na hřišti." },
  // ── oznámení (budoucí čas / výzva) ──
  { tema: "sběr papíru", zanr: "oznámení",
    text: "Ve čtvrtek 8. října se koná sběr starého papíru. Přineste svázané balíky před hlavní vchod." },
  { tema: "školní výlet", zanr: "oznámení",
    text: "V pátek 16. října pojede 6. A na výlet na zámek Kost. Sraz je v 7:30 před školou." },
  { tema: "turnaj ve florbale", zanr: "oznámení",
    text: "V úterý 20. října se uskuteční turnaj ve florbale mezi šestými třídami. Hraje se v tělocvičně od 14 hodin." },
  { tema: "kroužek keramiky", zanr: "oznámení",
    text: "Kroužek keramiky se otevře od příštího pondělí. Přihlásit se můžete u paní učitelky Novákové." },
  { tema: "školní knihovna", zanr: "oznámení",
    text: "Školní knihovna bude od pondělí 5. října otevřená i ve středu odpoledne. Přijďte si vybrat knihy." },
  { tema: "divadelní představení", zanr: "oznámení",
    text: "V listopadu se uskuteční divadelní představení pro šesté třídy. Vstupenky si vyzvedněte u třídní učitelky." },
  { tema: "zápis do kroužků", zanr: "oznámení",
    text: "Zápis do sportovních kroužků proběhne od 1. do 5. října ve sborovně. Přihlášku přineste vyplněnou rodiči." },
  { tema: "recitační soutěž", zanr: "oznámení",
    text: "Ve středu 21. října se bude konat školní recitační soutěž. Přihlásit se můžete u paní učitelky Malé do pátku." },
  { tema: "přerušená voda", zanr: "oznámení",
    text: "V pátek 9. října bude v obci od 8 do 14 hodin přerušena dodávka vody. Zásobte se vodou předem." },
  { tema: "školní jarmark", zanr: "oznámení",
    text: "V sobotu 5. prosince se koná školní vánoční jarmark. Přijďte si koupit dárky a podpořit žáky." },
  // ── vypravování (příběh, 1. osoba, napětí a prožitky) ──
  { tema: "výlet na zámek", zanr: "vypravování",
    text: "U zámku začalo pršet. Najednou jsem zjistil, že mi batoh zůstal v autobuse. Srdce mi bušilo." },
  { tema: "zápas ve florbale", zanr: "vypravování",
    text: "Na zápas jsem se těšil celý týden. Když rozhodčí zapískal, třásla se mi kolena. Pak jsem vystřelil." },
  { tema: "večer bez proudu", zanr: "vypravování",
    text: "Byla jsem sama doma, když najednou zhasla světla. Z chodby se ozvalo zaskřípění. Opatrně jsem vzala baterku." },
  { tema: "ryby s dědou", zanr: "vypravování",
    text: "S dědou jsme seděli u rybníka. Dlouho se nic nedělo, až najednou splávek zmizel. Děda zašeptal, ať táhnu pomalu." },
  // ── inzeráty (nabídka / poptávka) ──
  { tema: "kolo", zanr: "inzerát",
    text: "Prodám málo používané kolo pro děti od 10 let. Cena dohodou, volejte odpoledne." },
  { tema: "klávesy", zanr: "inzerát",
    text: "Koupím starší klávesy pro začínajícího hudebníka. Nabídky pište na lístek na nástěnce ve 2. patře." },
  { tema: "samolepky", zanr: "inzerát",
    text: "Vyměním sbírku samolepek s fotbalisty za knihy o zvířatech. Zájemci, hlaste se v 6. B." },
  { tema: "doučování", zanr: "inzerát",
    text: "Nabízím doučování angličtiny pro žáky 1. stupně. Cena 150 Kč za hodinu, domluva po telefonu." },
];

function ukolZanr(u: Ukazka): PracticeTask | null {
  return choice(
    `Jaký útvar tahle ukázka představuje? „${u.text}“`,
    u.zanr,
    zanrDistraktory(u.zanr),
    {
      hints: [
        "Nejdřív zjisti, co ukázka dělá. Něco nabízí nebo shání? Vypráví příběh v 1. osobě s napětím a pocity? Nebo věcně, bez pocitů informuje o nějaké akci?",
        "U věcného textu bez pocitů rozhoduje čas děje: děj už proběhl (proběhl, konal se, vybrali), nebo teprve nastane (bude, pojede, koná se s datem dopředu, přijďte)? Najdi v ukázce hlavní sloveso a urči, kdy se děj odehrává.",
      ],
      explanation: `Ukázka je ${u.zanr}: ${ZANR_VYSVETLENI[u.zanr]}.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L1 (b) — definice: co zpráva/oznámení dělá, čím se liší od sousedů
// ════════════════════════════════════════════════════════════════════════

function ukolDefiniceZprava(): PracticeTask | null {
  return choice(
    "Zpráva informuje o události, která…",
    "se už stala",
    [
      { value: "se teprve stane", why: "To je smysl oznámení, ne zprávy." },
      { value: "se právě někomu jen zdála", why: "Zpráva popisuje skutečnou událost, ne sen ani domněnku." },
      { value: "by se mohla stát", why: "Zpráva mluví o jisté, už proběhlé události, ne o možnosti." },
    ],
    {
      hints: [
        "Podívej se na možnosti: která mluví o tom, co už proběhlo, a která o tom, co teprve bude?",
        "Zpráva mluví o něčem jistém a už hotovém, ne o možnosti nebo výmyslu. Vzpomeň si, v jakém čase bývají slovesa ve zprávě na školním webu.",
      ],
      explanation: "Zpráva vždy informuje o události, která se už stala — proto je v minulém čase.",
    },
  );
}

function ukolDefiniceOznameni(): PracticeTask | null {
  return choice(
    "Oznámení informuje o tom, co…",
    "se teprve stane",
    [
      { value: "se už stalo", why: "O tom, co už proběhlo, informuje zpráva. Oznámení u akcí obvykle upozorňuje předem." },
      { value: "si někdo jen vymyslel", why: "Oznámení mluví o skutečně připravované akci, ne o výmyslu." },
      { value: "se stává úplně každý den", why: "Oznámení se týká konkrétní budoucí akce, ne opakované rutiny." },
    ],
    {
      hints: [
        "Přemýšlej, kdy se oznámení obvykle píše — před akcí, nebo až po ní?",
        "Oznámení se píše DOPŘEDU, aby lidé věděli, na co se mají připravit. Porovnej to s tím, kdy se píše zpráva.",
      ],
      explanation: "Oznámení informuje předem o akci, která se teprve stane — sloveso proto mluví o budoucnosti (bude, koná se s datem dopředu) nebo vyzývá přijít.",
    },
  );
}

function ukolDefiniceVypravovani(): PracticeTask | null {
  return choice(
    "Čím se zpráva liší od vypravování?",
    "je věcná a bez osobních dojmů",
    [
      { value: "má hlavní postavu a zápletku", why: "Hlavní postava a zápletka patří do vypravování, ne do zprávy." },
      { value: "je psaná vždy v budoucím čase", why: "Zpráva je v minulém čase, ne v budoucím." },
      { value: "vždy končí ponaučením", why: "Ponaučení je typické pro bajku, ne pro zprávu ani běžné vypravování." },
    ],
    {
      hints: [
        "Srovnej zprávu s příběhem, který znáš z čítanky — má hlavní postavu a napětí?",
        "Zpráva nemá zápletku ani hlavního hrdinu, jen fakta o události. Postupně vyřaď možnosti, které popisují vypravování nebo jiný útvar.",
      ],
      explanation: "Zpráva jen věcně sděluje fakta o události, bez osobních dojmů a bez vypravěčského napětí jako u vypravování.",
    },
  );
}

function ukolDefiniceInzerat(): PracticeTask | null {
  return choice(
    "Čím se oznámení liší od inzerátu?",
    "upozorňuje na akci nebo změnu, nic nenabízí ani neshání",
    [
      { value: "je vždy delší a podrobnější než inzerát", why: "Délka není rozdíl — oba útvary bývají stručné." },
      { value: "nesmí obsahovat žádné datum ani hodinu", why: "Naopak, datum v oznámení nesmí chybět." },
      { value: "píše se výhradně pro dospělé čtenáře", why: "Oznámení se týká i dětí, například pozvánky na školní akce." },
    ],
    {
      hints: [
        "Přemýšlej, proč lidé píšou inzerát — co tím chtějí získat nebo nabídnout?",
        "Inzerát něco nabízí nebo shání (prodám, koupím, hledám). Oznámení upozorňuje, co se kdy a kde bude dít.",
      ],
      explanation: "Oznámení informuje o chystané akci nebo změně (co, kdy, kde, kdo), inzerát naopak něco nabízí nebo shání (prodám, koupím, hledám).",
    },
  );
}

const DEFINICE: (() => PracticeTask | null)[] = [
  ukolDefiniceZprava,
  ukolDefiniceOznameni,
  ukolDefiniceVypravovani,
  ukolDefiniceInzerat,
];

// ════════════════════════════════════════════════════════════════════════
// L2 (a) — oznámení, kterému chybí právě jeden údaj (kdo/co/kdy/kde)
// ════════════════════════════════════════════════════════════════════════

type Udaj = "kdy" | "kde" | "kdo" | "co";

const L2A_LABEL: Record<Udaj, string> = {
  kdy: "kdy se akce koná",
  kde: "kde se akce koná",
  kdo: "kdo akci pořádá",
  co: "co se vlastně koná",
};

/** Proč oznámení bez daného údaje nefunguje — pro vysvětlení u L2a. */
const L2A_PROC: Record<Udaj, string> = {
  kdy: "Čtenář neví, v který den a v kolik hodin má přijít.",
  kde: "Čtenář neví, kam má jít.",
  co: "Čtenář neví, na jakou akci ho zvou.",
  kdo: "Čtenář neví, kdo akci pořádá a na koho se může obrátit s dotazem.",
};

interface OznameniChybi {
  tema: string;
  text: string;
  missing: Udaj;
  detail: Partial<Record<Udaj, string>>;
}

const L2A: OznameniChybi[] = [
  { tema: "turnaj ve florbale", missing: "kdy",
    text: "V tělocvičně se koná turnaj ve florbale mezi šestými třídami. Pořádá ho školní sportovní kroužek.",
    detail: { kde: "v tělocvičně", kdo: "školní sportovní kroužek", co: "turnaj ve florbale mezi šestými třídami" } },
  { tema: "sběr papíru", missing: "kde",
    text: "Ve čtvrtek 8. října se koná sběr starého papíru. Balíky svažte a přineste. Pořádá školní parlament.",
    detail: { kdy: "ve čtvrtek 8. října", kdo: "školní parlament", co: "sběr starého papíru" } },
  { tema: "výlet na zámek", missing: "kdo",
    text: "V pátek 16. října v 7:30 je sraz na výlet na zámek Kost před hlavní budovou školy.",
    detail: { kdy: "v pátek 16. října v 7:30", kde: "před hlavní budovou školy", co: "výlet na zámek Kost" } },
  { tema: "školní jarmark", missing: "co",
    text: "Přijďte v sobotu 14. listopadu od 9 hodin na školní hřiště. Zve rodičovské sdružení.",
    detail: { kdy: "v sobotu 14. listopadu od 9 hodin", kde: "na školní hřiště", kdo: "rodičovské sdružení" } },
  { tema: "kroužek deskových her", missing: "kdy",
    text: "Nový kroužek deskových her se otevírá v učebně dějepisu. Přihlásit se můžete u pana učitele Krále.",
    detail: { kde: "v učebně dějepisu", kdo: "u pana učitele Krále", co: "kroužek deskových her" } },
  { tema: "beseda v knihovně", missing: "kde",
    text: "V pondělí 5. října od 14 hodin bude beseda se spisovatelem. Pořádá ji paní knihovnice.",
    detail: { kdy: "v pondělí 5. října od 14 hodin", kdo: "paní knihovnice", co: "beseda se spisovatelem" } },
  { tema: "divadelní představení", missing: "kdo",
    text: "Ve čtvrtek 12. listopadu v 9 hodin se v kulturním domě hraje představení Pyšná princezna.",
    detail: { kdy: "ve čtvrtek 12. listopadu v 9 hodin", kde: "v kulturním domě", co: "představení Pyšná princezna" } },
  { tema: "zápis do kroužků", missing: "co",
    text: "Přijďte od 1. do 5. října do sborovny. Přihlášky vydává paní učitelka Nováková.",
    detail: { kdy: "od 1. do 5. října", kde: "do sborovny", kdo: "paní učitelka Nováková" } },
  { tema: "recitační soutěž", missing: "kde",
    text: "Ve středu 21. října od 13 hodin proběhne školní recitační soutěž. Pořádá ji paní učitelka Malá.",
    detail: { kdy: "ve středu 21. října od 13 hodin", kdo: "paní učitelka Malá", co: "školní recitační soutěž" } },
  { tema: "sběr papíru (podzim)", missing: "kdo",
    text: "V úterý 3. listopadu od 7 do 8 hodin před školou proběhne sběr starého papíru.",
    detail: { kdy: "v úterý 3. listopadu od 7 do 8 hodin", kde: "před školou", co: "sběr starého papíru" } },
  { tema: "výlet na nádraží", missing: "co",
    text: "V sobotu 7. listopadu v 8 hodin ráno je sraz na vlakovém nádraží. Pořádá turistický kroužek.",
    detail: { kdy: "v sobotu 7. listopadu v 8 hodin ráno", kde: "na vlakovém nádraží", kdo: "turistický kroužek" } },
  { tema: "pěvecký sbor", missing: "kdy",
    text: "V hudebně se schází nový pěvecký sbor. Vede ho paní učitelka Dvořáková.",
    detail: { kde: "v hudebně", kdo: "paní učitelka Dvořáková", co: "nový pěvecký sbor" } },
  { tema: "vánoční jarmark", missing: "kde",
    text: "V pátek 11. prosince od 15 hodin se koná vánoční jarmark. Pořádá ho žákovský parlament.",
    detail: { kdy: "v pátek 11. prosince od 15 hodin", kdo: "žákovský parlament", co: "vánoční jarmark" } },
];

function ukolL2a(item: OznameniChybi): PracticeTask | null {
  const other = (["kdy", "kde", "kdo", "co"] as Udaj[]).filter((k) => k !== item.missing);
  const distraktory: Distractor[] = other.map((k) => ({
    value: L2A_LABEL[k],
    why: `V oznámení to je uvedené: „${item.detail[k]}“.`,
  }));
  return choice(
    `V oznámení chybí jeden důležitý údaj. „${item.text}“ Který údaj v oznámení chybí?`,
    L2A_LABEL[item.missing],
    distraktory,
    {
      hints: [
        "Projdi oznámení a u každého údaje najdi v textu konkrétní slova: o jakou akci jde, v který den a hodinu, na jakém místě a kdo ji pořádá.",
        "Údaj, který v textu nenajdeš — ani jako datum nebo den v týdnu, ani jako místo s předložkou, ani jako jméno pořadatele — je to, co chybí. Než odpovíš, zkontroluj ještě jednou, že ostatní tři údaje v textu opravdu jsou.",
      ],
      explanation: `V oznámení chybí, ${L2A_LABEL[item.missing]}. ${L2A_PROC[item.missing]}`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (b) — vhodná první věta zprávy (věcná, minulý čas)
// ════════════════════════════════════════════════════════════════════════

interface NadpisItem {
  tema: string;
  spravna: string;
  oznamovaci: string;
  hodnotici: string;
  vypravovaci: string;
}

const NADPISY: NadpisItem[] = [
  { tema: "turnaj ve florbale",
    spravna: "Turnaj ve florbale mezi šestými třídami vyhrála 6. B.",
    oznamovaci: "Přijďte podpořit šesťáky na turnaji ve florbale!",
    hodnotici: "Byl to nejnapínavější turnaj, jaký jsme kdy zažili!",
    vypravovaci: "Jednou ráno jsme se sešli v tělocvičně a nikdo netušil, jak zápas dopadne…" },
  { tema: "školní výlet na zámek",
    spravna: "Šesťáci navštívili v pátek zámek Kost a prohlédli si i věž.",
    oznamovaci: "Přihlaste se na výlet na zámek Kost, sraz je před školou!",
    hodnotici: "Byl to nejkrásnější výlet celého podzimu!",
    vypravovaci: "Jednou v pátek jsme vyrazili na zámek a cestou se nám stalo něco nečekaného…" },
  { tema: "sběr starého papíru",
    spravna: "Škola vybrala při sběru starého papíru přes 800 kilogramů.",
    oznamovaci: "Přineste starý papír na sběr, který se koná ve čtvrtek!",
    hodnotici: "Byla to nejlepší akce, jakou jsme kdy dělali!",
    vypravovaci: "Jednou ráno jsme přinesli do školy balíky papíru a netušili jsme, kolik ho nakonec bude…" },
  { tema: "divadelní představení",
    spravna: "Šesťáci zhlédli v pondělí divadelní představení Pyšná princezna.",
    oznamovaci: "Vyzvedněte si vstupenky na divadelní představení, které se hraje v listopadu!",
    hodnotici: "Bylo to nejveselejší představení, jaké jsme kdy viděli!",
    vypravovaci: "Jednoho pondělí jsme usedli do hlediště a netušili, co nás čeká…" },
  { tema: "školní knihovna",
    spravna: "Školní knihovna rozšířila od pondělí otevírací dobu i na středy.",
    oznamovaci: "Přijďte si od příštího týdne vybrat knihy i ve středu!",
    hodnotici: "Konečně máme nejlepší knihovnu ve městě!",
    vypravovaci: "Jednou jsme přišli do knihovny a všimli jsme si, že se něco změnilo…" },
  { tema: "školní jarmark",
    spravna: "Školní jarmark vynesl minulou sobotu přes deset tisíc korun.",
    oznamovaci: "Přijďte si na jarmark koupit vánoční dárky!",
    hodnotici: "Byl to nejúžasnější jarmark, jaký kdy škola měla!",
    vypravovaci: "Jednou v sobotu jsme si na stánku rozložili výrobky a netušili, kolik lidí přijde…" },
  { tema: "recitační soutěž",
    spravna: "V recitační soutěži zvítězila Tereza Nováková z 6. A.",
    oznamovaci: "Přihlaste se do recitační soutěže, která se koná ve středu!",
    hodnotici: "Bylo to nejdojemnější vystoupení, jaké jsem kdy slyšel!",
    vypravovaci: "Jednou ve středu jsme se sešli v aule a netušili jsme, kdo nakonec zvítězí…" },
];

function ukolNadpis(n: NadpisItem): PracticeTask | null {
  return choice(
    `Zpráva o tématu „${n.tema}“ potřebuje vhodnou první větu. Kterou zvolíš?`,
    n.spravna,
    [
      { value: n.oznamovaci, why: "Tahle věta zve na budoucí akci — to patří do oznámení, ne do zprávy o tom, co se stalo." },
      { value: n.hodnotici, why: "Tahle věta vyjadřuje jen osobní dojem, ne věcný fakt o události." },
      { value: n.vypravovaci, why: "Tahle věta začíná jako vyprávění příběhu, ne jako věcná zpráva." },
    ],
    {
      hints: [
        "Hledej větu, která popisuje něco, co se UŽ stalo — v minulém čase, bez pozvání a bez osobního dojmu.",
        "Věta, která zve na budoucí akci, patří do oznámení. Věta s dojmem („nejlepší“, „úžasné“) do zprávy nepatří. Věta začínající jako příběh patří do vypravování.",
      ],
      explanation: `Správná první věta zprávy je věcná, v minulém čase a bez dojmů: „${n.spravna}“`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L2 (c) — čtyři věty o události, jedna (osobní dojem) do zprávy nepatří
// ════════════════════════════════════════════════════════════════════════

interface VetaItem {
  tema: string;
  fakta: [string, string, string];
  dojem: string;
}

const VETY: VetaItem[] = [
  { tema: "sběr papíru",
    fakta: ["Sběr proběhl ve čtvrtek před hlavním vchodem.", "Škola vybrala celkem 820 kilogramů papíru.", "Nejvíc papíru odevzdala 6. A."],
    dojem: "Byl to nejúžasnější den, jaký si pamatuju!" },
  { tema: "turnaj ve vybíjené",
    fakta: ["Turnaj se hrál v tělocvičně od 14 hodin.", "Zúčastnily se všechny šesté třídy.", "Vítězům předal ceny pan ředitel."],
    dojem: "Srdce mi tlouklo jako splašené, když jsme čekali na výsledky!" },
  { tema: "výlet na zámek",
    fakta: ["Autobus odjel od školy v 7:30.", "Prohlídka zámku trvala hodinu.", "Žáci se vrátili do školy v 16 hodin."],
    dojem: "Byl to nejlepší výlet mého života!" },
  { tema: "divadelní představení",
    fakta: ["Představení se hrálo v kulturním domě.", "Zhlédly ho obě šesté třídy.", "Po představení herci odpovídali na otázky."],
    dojem: "Smáli jsme se tak, že mě bolelo břicho!" },
  { tema: "recitační soutěž",
    fakta: ["Soutěže se zúčastnilo dvacet žáků.", "Porota hodnotila přednes i výběr básně.", "Vítězka získala diplom a knihu."],
    dojem: "Byla jsem tak nervózní, že se mi třásl hlas!" },
  { tema: "školní jarmark",
    fakta: ["Jarmark se konal na školním hřišti.", "Žáci prodávali vlastní výrobky.", "Výtěžek půjde na nový herní prvek."],
    dojem: "Nikdy jsem se tolik nebavila jako na téhle akci!" },
  { tema: "zápis do kroužků",
    fakta: ["Zápis probíhal celý týden ve sborovně.", "Přihlásilo se přes sto žáků.", "Nejoblíbenější byl sportovní kroužek."],
    dojem: "Konečně jsem se mohla přihlásit na kroužek svých snů!" },
];

function ukolVeta(v: VetaItem): PracticeTask | null {
  return choice(
    `Zpráva o tématu „${v.tema}“ má tyto čtyři věty. Která z nich do zprávy NEpatří?`,
    v.dojem,
    v.fakta.map((f): Distractor => ({ value: f, why: "Tahle věta uvádí konkrétní fakt (kdo, co, kde, kolik) — do zprávy patří." })),
    {
      hints: [
        `Tři věty u tématu „${v.tema}“ jsou fakta a jedna vyjadřuje jen pocit. Kterou z vět je třeba ze zprávy vypustit?`,
        "Fakta se dají ověřit — datum, místo, počet. Pocit nebo hodnocení (jak se někdo cítil, co se mu líbilo) ověřit nejde, a proto do věcné zprávy nepatří. U každé věty se zeptej, jestli by ji mohl potvrdit i někdo, kdo u akce nebyl.",
      ],
      explanation: `Věta „${v.dojem}“ vyjadřuje jen osobní pocit, ne ověřitelný fakt — do věcné zprávy nepatří.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (a) — převod žánru: zpráva o právě proběhlé akci z oznámení
// ════════════════════════════════════════════════════════════════════════

interface PrevodItem {
  tema: string;
  oznameni: string;
  spravne: string;
  /** stejná věta jako v oznámení — sloveso pořád mluví o budoucnosti */
  opakovani: string;
  /** minulý čas i datum sedí, ale místo je jiné než v oznámení */
  jineMisto: string;
  /** minulý čas a datum sedí, ale je tu osobní hodnocení a chybí místo */
  hodnotici: string;
}

const PREVODY: PrevodItem[] = [
  { tema: "turnaj ve vybíjené",
    oznameni: "V sobotu 10. října se v tělocvičně koná turnaj ve vybíjené šestých tříd.",
    spravne: "V sobotu 10. října se v tělocvičně konal turnaj ve vybíjené šestých tříd.",
    opakovani: "V sobotu 10. října se v tělocvičně bude konat turnaj ve vybíjené šestých tříd.",
    jineMisto: "V sobotu 10. října se na školním hřišti konal turnaj ve vybíjené šestých tříd.",
    hodnotici: "V sobotu 10. října se konal nejnapínavější turnaj ve vybíjené, jaký šesté třídy kdy hrály!" },
  { tema: "výlet na zámek",
    oznameni: "V pátek 16. října pojede 6. A na výlet na zámek Kost.",
    spravne: "V pátek 16. října jela 6. A na výlet na zámek Kost.",
    opakovani: "V pátek 16. října pojede 6. A na výlet na zámek Kost.",
    jineMisto: "V pátek 16. října jela 6. A na výlet na hrad Bouzov.",
    hodnotici: "V pátek 16. října jela 6. A na nejkrásnější výlet celého podzimu!" },
  { tema: "sběr papíru",
    oznameni: "Ve čtvrtek 8. října se koná před školou sběr starého papíru.",
    spravne: "Ve čtvrtek 8. října se před školou konal sběr starého papíru.",
    opakovani: "Ve čtvrtek 8. října se koná před školou sběr starého papíru.",
    jineMisto: "Ve čtvrtek 8. října se v tělocvičně konal sběr starého papíru.",
    hodnotici: "Ve čtvrtek 8. října se konal skvělý sběr starého papíru, všichni jsme se moc snažili!" },
  { tema: "divadelní představení",
    oznameni: "V pondělí 16. listopadu se v kulturním domě uskuteční divadelní představení pro šesté třídy.",
    spravne: "V pondělí 16. listopadu se v kulturním domě uskutečnilo divadelní představení pro šesté třídy.",
    opakovani: "V pondělí 16. listopadu se v kulturním domě uskuteční divadelní představení pro šesté třídy.",
    jineMisto: "V pondělí 16. listopadu se ve školní jídelně uskutečnilo divadelní představení pro šesté třídy.",
    hodnotici: "V pondělí 16. listopadu se uskutečnilo nejveselejší divadelní představení, jaké jsme kdy viděli!" },
  { tema: "recitační soutěž",
    oznameni: "Ve středu 21. října proběhne od 13 hodin v aule školní recitační soutěž.",
    spravne: "Ve středu 21. října proběhla od 13 hodin v aule školní recitační soutěž.",
    opakovani: "Ve středu 21. října proběhne od 13 hodin v aule školní recitační soutěž.",
    jineMisto: "Ve středu 21. října proběhla od 13 hodin v tělocvičně školní recitační soutěž.",
    hodnotici: "Ve středu 21. října proběhla nejdojemnější recitační soutěž, jakou škola kdy měla!" },
  { tema: "školní jarmark",
    oznameni: "V sobotu 5. prosince se koná na školním hřišti vánoční jarmark.",
    spravne: "V sobotu 5. prosince se konal na školním hřišti vánoční jarmark.",
    opakovani: "V sobotu 5. prosince se koná na školním hřišti vánoční jarmark.",
    jineMisto: "V sobotu 5. prosince se konal ve školní jídelně vánoční jarmark.",
    hodnotici: "V sobotu 5. prosince se konal nejveselejší vánoční jarmark celého roku!" },
  { tema: "zápis do kroužků",
    oznameni: "Od 1. do 5. října probíhá ve sborovně zápis do sportovních kroužků.",
    spravne: "Od 1. do 5. října probíhal ve sborovně zápis do sportovních kroužků.",
    opakovani: "Od 1. do 5. října probíhá ve sborovně zápis do sportovních kroužků.",
    jineMisto: "Od 1. do 5. října probíhal v ředitelně zápis do sportovních kroužků.",
    hodnotici: "Od 1. do 5. října probíhal zápis do kroužků, který byl mnohem lepší než loni!" },
  { tema: "přerušení vody",
    oznameni: "V pátek 9. října bude v obci od 8 do 14 hodin přerušena dodávka vody.",
    spravne: "V pátek 9. října byla v obci od 8 do 14 hodin přerušena dodávka vody.",
    opakovani: "V pátek 9. října bude v obci od 8 do 14 hodin přerušena dodávka vody.",
    jineMisto: "V pátek 9. října byla ve městě od 8 do 14 hodin přerušena dodávka vody.",
    hodnotici: "V pátek 9. října byla přerušena dodávka vody a bylo to hrozně otravné!" },
];

function ukolPrevod(p: PrevodItem): PracticeTask | null {
  return choice(
    `Akce z oznámení „${p.oznameni}“ právě skončila. Kterou větou správně začneš ZPRÁVU o ní?`,
    p.spravne,
    [
      { value: p.opakovani, why: "Sloveso pořád mluví o akci jako o budoucí (bude, koná se s datem dopředu), stejně jako oznámení. Akce ale už proběhla, sloveso patří do minulého času." },
      { value: p.jineMisto, why: "Datum i minulý čas sedí, ale místo je jiné než v oznámení. Zpráva musí údaje z oznámení převzít přesně." },
      { value: p.hodnotici, why: "Osobní hodnocení do věcné zprávy nepatří a chybí tu místo, kde se akce konala." },
    ],
    {
      hints: [
        `Akce, o které mluvilo oznámení („${p.tema}“), už proběhla. Kterou větou začneš zprávu?`,
        "Zpráva převezme z oznámení všechny údaje (co, kdy, kde) beze změny, jen sloveso převede do minulého času. Porovnej každou možnost s oznámením údaj po údaji.",
      ],
      explanation: `Správně: „${p.spravne}“ — stejné datum a místo jako v oznámení, sloveso v minulém čase a bez osobního hodnocení.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (b) — smíšený text (zpráva + oznámení za sebou)
// ════════════════════════════════════════════════════════════════════════

interface SmisenyItem {
  tema: string;
  zprava: string;
  oznameni: string;
  poradi: "zpravaFirst" | "oznameniFirst";
}

const SMISENE: SmisenyItem[] = [
  { tema: "sběr papíru", poradi: "zpravaFirst",
    zprava: "Minulý týden jsme vybrali přes 300 kilogramů papíru.", oznameni: "Další sběr proběhne 14. listopadu." },
  { tema: "školní jarmark", poradi: "oznameniFirst",
    oznameni: "V sobotu 5. prosince se koná vánoční jarmark.", zprava: "Loňský jarmark vynesl přes deset tisíc korun." },
  { tema: "turnaj ve vybíjené", poradi: "zpravaFirst",
    zprava: "V úterý se konal turnaj ve vybíjené a zvítězila 6. B.", oznameni: "Příští turnaj proběhne v listopadu." },
  { tema: "školní výlet", poradi: "oznameniFirst",
    oznameni: "Příští pátek pojede 6. A na výlet na zámek Kost.", zprava: "Minulý výlet do zoo absolvovalo 45 žáků." },
  { tema: "školní knihovna", poradi: "zpravaFirst",
    zprava: "Školní knihovna minulý měsíc přivítala pět set nových čtenářů.", oznameni: "Od příštího týdne bude otevřená i ve středu." },
  { tema: "kroužek deskových her", poradi: "oznameniFirst",
    oznameni: "Nový kroužek deskových her se otevře od pondělí.", zprava: "Loňský kroužek navštěvovalo přes dvacet dětí." },
  { tema: "divadelní představení", poradi: "zpravaFirst",
    zprava: "Šesťáci navštívili minulý týden divadelní představení.", oznameni: "Další představení pro sedmé třídy proběhne v prosinci." },
  { tema: "recitační soutěž", poradi: "oznameniFirst",
    oznameni: "Školní recitační soutěž se bude konat příští středu.", zprava: "Loňskou soutěž vyhrála Tereza Nováková." },
];

const L3B_OPTIONS = [
  "První věta je zpráva, druhá oznámení.",
  "První věta je oznámení, druhá zpráva.",
  "Obě věty jsou zpráva.",
  "Obě věty jsou oznámení.",
] as const;

const L3B_WHY: Record<string, string> = {
  [L3B_OPTIONS[0]]: "Zkontroluj časy sloves v obou větách znovu — možná je pořadí zprávy a oznámení obrácené.",
  [L3B_OPTIONS[1]]: "Zkontroluj časy sloves v obou větách znovu — možná je pořadí zprávy a oznámení obrácené.",
  [L3B_OPTIONS[2]]: "Jedna z vět mluví o něčem, co se teprve stane — upozorňuje předem, to dělá oznámení.",
  [L3B_OPTIONS[3]]: "Jedna z vět mluví o něčem, co už proběhlo — tady jde o zprávu o proběhlé akci.",
};

function ukolSmiseny(s: SmisenyItem): PracticeTask | null {
  const [prvni, druha] = s.poradi === "zpravaFirst" ? [s.zprava, s.oznameni] : [s.oznameni, s.zprava];
  const correct = s.poradi === "zpravaFirst" ? L3B_OPTIONS[0] : L3B_OPTIONS[1];
  const distraktory: Distractor[] = L3B_OPTIONS.filter((o) => o !== correct).map((o) => ({ value: o, why: L3B_WHY[o] }));
  return choice(
    `Přečti si text o tématu „${s.tema}“: „${prvni} ${druha}“ Co z textu je oznámení, co zpráva?`,
    correct,
    distraktory,
    {
      hints: [
        `V textu o tématu „${s.tema}“ jsou dvě věty. Jedna mluví o tom, co se stalo, druhá o tom, co se teprve stane. Podle slovesa je rozliš.`,
        "Minulý čas (proběhl, vybrali, konal se…) ukazuje na zprávu. Děj, který se teprve stane (proběhne, bude; i přítomný čas s datem dopředu: koná se), ukazuje na oznámení. Přiřaď to ke správné větě podle jejího pořadí v textu.",
      ],
      explanation: `„${prvni}“ je ${s.poradi === "zpravaFirst" ? "zpráva" : "oznámení"} a „${druha}“ je ${s.poradi === "zpravaFirst" ? "oznámení" : "zpráva"}.`,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// L3 (c) — situace: jaký útvar zvolit a proč (útvar × důvod)
// ════════════════════════════════════════════════════════════════════════

interface SituaceItem {
  situace: string;
  spravny: string;
  b: string;
  c: string;
  d: string;
}

const SITUACE: SituaceItem[] = [
  { situace: "Třída chce pozvat rodiče na vánoční besídku, která bude za dva týdny v tělocvičně.",
    spravny: "Oznámení, protože besídka se teprve bude konat a rodiče musí vědět, kdy a kam přijít.",
    b: "Oznámení, protože o besídkách se vždycky píše nejdelší možný text.",
    c: "Zprávu, protože rodiče potřebují přesné datum a místo konání besídky.",
    d: "Zprávu, protože besídka už minulý týden proběhla." },
  { situace: "Třída chce na web školy napsat, jak dopadl sběr starého papíru, který proběhl minulý týden.",
    spravny: "Zprávu, protože sběr už proběhl a čtenáři se dozví, jak dopadl.",
    b: "Zprávu, protože o všech akcích školy se musí psát vždycky stejně dlouze.",
    c: "Oznámení, protože čtenáři chtějí vědět přesné výsledky sběru.",
    d: "Oznámení, protože sběr papíru se bude konat až za měsíc." },
  { situace: "Škola chce dát žákům vědět, že příští pondělí začíná zápis do kroužků.",
    spravny: "Oznámení, protože zápis se teprve uskuteční a žáci potřebují vědět, kdy se mají přijít zapsat.",
    b: "Oznámení, protože o zápisu do kroužků se píše jen jednou za rok.",
    c: "Zprávu, protože žáci potřebují vědět přesné datum začátku zápisu.",
    d: "Zprávu, protože zápis do kroužků už minulý týden skončil." },
  { situace: "Redakce školního časopisu chce napsat, jak dopadl turnaj ve florbale, který se odehrál včera.",
    spravny: "Zprávu, protože turnaj už proběhl a čtenáři se dozví, jak dopadl.",
    b: "Zprávu, protože o sportovních akcích se píše nejrychleji ze všech.",
    c: "Oznámení, protože čtenáři chtějí vědět, kdo turnaj vyhrál.",
    d: "Oznámení, protože turnaj ve florbale se bude konat příští týden." },
  { situace: "Knihovna chce čtenáře upozornit, že od příštího týdne bude otevřená i v sobotu.",
    spravny: "Oznámení, protože změna otevírací doby teprve začne platit a čtenáři to musí vědět předem.",
    b: "Oznámení, protože o knihovně se musí psát co nejkratší text.",
    c: "Zprávu, protože čtenáři potřebují vědět přesný den, od kdy platí nová otevírací doba.",
    d: "Zprávu, protože knihovna už v sobotu otevřená byla." },
  { situace: "Třída chce napsat na nástěnku, jak proběhl výlet na zámek, ze kterého se právě vrátila.",
    spravny: "Zprávu, protože výlet už proběhl a spolužáci se dozví, jak dopadl.",
    b: "Zprávu, protože o výletech se píše jen na konci školního roku.",
    c: "Oznámení, protože spolužáci chtějí vědět, kam se přesně jelo.",
    d: "Oznámení, protože výlet na zámek se bude konat až na jaře." },
  { situace: "Sportovní kroužek chce pozvat všechny žáky na turnaj, který se bude konat za měsíc.",
    spravny: "Oznámení, protože turnaj se teprve bude konat a žáci se na něj musí stihnout přihlásit.",
    b: "Oznámení, protože o turnajích se píše jen na sportovní nástěnku.",
    c: "Zprávu, protože žáci potřebují vědět přesné datum konání turnaje.",
    d: "Zprávu, protože turnaj sportovního kroužku už minulý měsíc proběhl." },
  { situace: "Místní zpravodaj chce napsat, jak proběhla oprava vodovodu a kolik domácností bylo bez vody.",
    spravny: "Zprávu, protože oprava už proběhla a čtenáři se dozví, jak dopadla.",
    b: "Zprávu, protože o opravách vodovodu se píše jen jednou za rok.",
    c: "Oznámení, protože čtenáři chtějí vědět, kolik domácností bylo bez vody.",
    d: "Oznámení, protože oprava vodovodu se teprve bude konat příští týden." },
];

function ukolSituace(s: SituaceItem): PracticeTask | null {
  return choice(
    `${s.situace} Jaký útvar zvolí a proč?`,
    s.spravny,
    [
      { value: s.b, why: "Útvar je určený správně, ale důvod nesedí k podstatě věci — jde o to, zda akce teprve bude, nebo už byla, ne o tom, kde, jak často, jak rychle nebo jak dlouze se o ní píše." },
      { value: s.c, why: "Důvod zní rozumně, ale útvar neodpovídá tomu, zda akce teprve bude, nebo už proběhla." },
      { value: s.d, why: "Útvar i důvod jsou v rozporu se zadanou situací — zkontroluj, jestli akce teprve bude, nebo už byla." },
    ],
    {
      hints: [
        "Rozhodni nejdřív, jestli akce už proběhla, nebo je ještě před ní — a pak hledej útvar s odpovídajícím, věcně správným důvodem.",
        "Oznámení se píše před akcí (kdo, co, kdy, kde). Zpráva se píše po akci (co se stalo a jak dopadlo). Důvod musí sedět k tomu, o co ve situaci skutečně jde.",
      ],
      explanation: s.spravny,
    },
  );
}

// ════════════════════════════════════════════════════════════════════════
// gen()
// ════════════════════════════════════════════════════════════════════════

/** Round-robin proložení několika seznamů (zbytek delších seznamů jde na konec). */
function prokladej<T>(...seznamy: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(...seznamy.map((s) => s.length));
  for (let i = 0; i < max; i++) for (const s of seznamy) if (i < s.length) out.push(s[i]);
  return out;
}

/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  // Proložení útvarů: klíč se v sezení střídá (zpráva, oznámení, vypravování/inzerát, definice…),
  // aby žák nemohl klikat pořád na tutéž odpověď bez čtení.
  const zUkazek = (z: Zanr) => UKAZKY.filter((u) => u.zanr === z).map((u) => () => ukolZanr(u));
  const vypravInz = prokladej(zUkazek("vypravování"), zUkazek("inzerát"));
  const poolL1: (() => PracticeTask | null)[] = prokladej(zUkazek("zpráva"), zUkazek("oznámení"), vypravInz, DEFINICE);
  const poolL2: (() => PracticeTask | null)[] = [
    ...L2A.map((o) => () => ukolL2a(o)),
    ...NADPISY.map((n) => () => ukolNadpis(n)),
    ...VETY.map((v) => () => ukolVeta(v)),
  ];
  const poolL3: (() => PracticeTask | null)[] = [
    ...PREVODY.map((p) => () => ukolPrevod(p)),
    ...SMISENE.map((s) => () => ukolSmiseny(s)),
    ...SITUACE.map((s) => () => ukolSituace(s)),
  ];
  const pool = level <= 1 ? poolL1 : level === 2 ? poolL2 : poolL3;
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), pool.length, pool.length * 3);
}

// ════════════════════════════════════════════════════════════════════════
// Topic
// ════════════════════════════════════════════════════════════════════════

export const ZPRAVA_A_OZNAMENI_ROZDILY: TopicMetadata[] = [
  {
    id: "g6-cjl-zprava-a-oznameni-rozdily-6",
    rvpNodeId: "g6-cjl-komunikacni-a-slohova-vychova-slohova-vychova-zprava-a-oznameni-rozdily",
    displayName: "Zpráva a oznámení - rozdíly",
    title: "Zpráva a oznámení - rozdíly",
    studentTitle: "Zpráva, nebo oznámení?",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Poznáš, jestli text informuje o tom, co se stalo, nebo stane.",
    keywords: ["zpráva", "oznámení", "slohová výchova", "komunikace", "žánr", "stalo se", "stane se", "úplnost oznámení"],
    goals: [
      "Rozlišit zprávu a oznámení podle času děje.",
      "Posoudit, zda oznámení obsahuje všechny nutné údaje (kdo, co, kdy, kde).",
      "Posoudit věcnost a úplnost zprávy.",
    ],
    boundaries: [
      "Navazuje na grade-4/cjl/inzeratVzkazTelefonickyRozhovor.ts a grade-5/cjl/posuzovaniUplnostiSdeleni.ts; vypravování a inzerát se tu jen odlišují jako kontrast, neprocvičují se samostatně.",
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
      hint: "Zpráva věcně mluví o tom, co se UŽ STALO (minulý čas). Oznámení upozorňuje na to, co se TEPRVE STANE (bude, proběhne; i „koná se“ s datem dopředu) nebo vyzývá k účasti, a musí obsahovat kdo, co, kdy a kde.",
      steps: [
        "Najdi v textu hlavní sloveso a urči jeho čas.",
        "Děj už proběhl (minulý čas) = zpráva; děj teprve nastane (budoucí čas nebo přítomný čas s datem dopředu) nebo výzva k účasti = oznámení.",
        "U oznámení zkontroluj, jestli jsou tam všechny údaje: kdo, co, kdy, kde.",
        "U zprávy zkontroluj, jestli je věcná a bez osobních dojmů.",
      ],
      commonMistake: "Žáci rozhodují podle tématu (škola, akce), ne podle času děje — akci ve škole automaticky považují za oznámení, i když už proběhla.",
      example: "„V pátek proběhl sběr papíru, vybrali jsme 800 kg.“ = zpráva (proběhl, vybrali = minulý čas). „Ve čtvrtek se koná sběr papíru, přineste balíky.“ = oznámení (koná se = přítomný čas s budoucím významem, přineste = výzva).",
    },
  },
];
