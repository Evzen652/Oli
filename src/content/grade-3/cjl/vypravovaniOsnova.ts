import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam se stejnou nápovědou. Teď tři oddělené banky:
// L1 pojmy (vypravování, osnova, úvod, zápletka, závěr, slova pořadí) ·
// L2 do které části vypravování věta patří · L3 seřadit body osnovy, najít
// chybějící část, doplnit slovo pořadí, vybrat začátek a nadpis.

const L1: PracticeTask[] = [
  choice("Co je vypravování?", "text, který vypráví příběh", [
    { value: "popis toho, jak věc vypadá", why: "To je popis — v něm se nic neděje." },
    { value: "seznam slov podle abecedy", why: "To je slovník." },
    { value: "návod, jak něco udělat", why: "Návod radí postup, nevypráví." },
  ], { hints: ["Když kamarádovi líčíš, co se ti stalo o prázdninách, co děláš?", "Ve vypravování jsou postavy, místo a děj — něco se stane."], explanation: "Vypravování je text, který vypráví příběh: někdo něco zažije." }),
  choice("Jak se jmenují tři části vypravování?", "úvod, zápletka, závěr", [
    { value: "začátek, jméno, konec", why: "Jméno není část vypravování." },
    { value: "popis, děj, poznámka", why: "Tak se části vypravování nejmenují." },
    { value: "nadpis, text, podpis", why: "To jsou části dopisu nebo slohu, ne děje." },
  ], { hints: ["Jak se jmenuje začátek, prostředek a konec příběhu?", "První část představí postavy, druhá přinese problém, třetí ho vyřeší."], explanation: "Vypravování má úvod, zápletku a závěr." }),
  choice("Co je osnova?", "plán vypravování v bodech", [
    { value: "obrázek k příběhu", why: "To je ilustrace." },
    { value: "poslední věta příběhu", why: "To je část závěru." },
    { value: "jméno autora", why: "Jméno není plán." },
  ], { hints: ["Co si napíšeš dřív, než začneš psát sloh?", "Krátký seznam toho, co se bude dít a v jakém pořadí."], explanation: "Osnova je plán vypravování v bodech." }),
  choice("Co obsahuje úvod vypravování?", "kdo, kde a kdy", [
    { value: "největší napětí", why: "Napětí přijde až uprostřed." },
    { value: "rozuzlení", why: "Rozuzlení patří na konec." },
    { value: "ponaučení", why: "Ponaučení bývá na konci." },
  ], { hints: ["Co musí čtenář vědět, než se začne něco dít?", "Na začátku představíme postavy, místo a čas."], explanation: "Úvod řekne, kdo v příběhu je, kde a kdy se odehrává." }),
  choice("Co je zápletka?", "chvíle, kdy se něco přihodí", [
    { value: "klidný popis místa", why: "Popis místa patří spíš do úvodu." },
    { value: "pozdrav čtenáři", why: "Pozdrav patří do dopisu." },
    { value: "seznam postav", why: "Postavy se představují v úvodu." },
  ], { hints: ["Kdy začne být vyprávění napínavé?", "Uprostřed nastane problém nebo překvapení."], explanation: "Zápletka je chvíle, kdy se něco stane — problém nebo dobrodružství." }),
  choice("Co obsahuje závěr vypravování?", "jak to celé dopadlo", [
    { value: "nový problém", why: "Nový problém by příběh neuzavřel." },
    { value: "představení postav", why: "To patří do úvodu." },
    { value: "datum", why: "Datum děj neuzavírá." },
  ], { hints: ["Co chce čtenář vědět na konci?", "Konec vyřeší problém, který nastal uprostřed."], explanation: "Závěr říká, jak to celé dopadlo." }),
  choice("Proč je ve vypravování důležité pořadí událostí?", "aby příběh dával smysl", [
    { value: "aby byl co nejdelší", why: "O délku nejde." },
    { value: "aby se rýmoval", why: "Vypravování není báseň." },
    { value: "na pořadí nezáleží", why: "Záleží — jinak se čtenář ztratí." },
  ], { hints: ["Rozuměl bys vyprávění, které začíná koncem?", "Události vyprávíme tak, jak šly za sebou."], explanation: "Správné pořadí zajistí, že příběh dává smysl." }),
  choice("Která slova pomáhají dodržet pořadí událostí?", "nejdříve, potom, nakonec", [
    { value: "velký, malý, červený", why: "To jsou vlastnosti." },
    { value: "ale, nebo, protože", why: "To jsou spojky, pořadí neurčují." },
    { value: "já, ty, on", why: "To jsou zájmena." },
  ], { hints: ["Která slova říkají, co bylo dřív a co později?", "Tato slůvka jsou ukazatele času a pořadí událostí."], explanation: "Nejdříve, potom, nakonec — ukazují pořadí." }),
  choice("Co je obrázková osnova?", "obrázky seřazené podle děje", [
    { value: "mapa okolí", why: "Mapa neukazuje děj." },
    { value: "portrét hlavní postavy", why: "Jeden portrét děj neukáže." },
    { value: "ilustrace na obálce", why: "Ta děj po částech neukazuje." },
  ], { hints: ["Jak si můžeš vyprávění naplánovat kreslením?", "Každý obrázek ukazuje jednu část a jdou za sebou jako v komiksu."], explanation: "Obrázková osnova jsou obrázky seřazené podle děje." }),
  choice("V jakém čase obvykle píšeme vypravování o zážitku?", "v minulém", [
    { value: "v budoucím", why: "Zážitek už se stal." },
    { value: "v žádném", why: "Slovesa mají vždy nějaký čas." },
    { value: "v každé větě v jiném", why: "Střídání časů by mátlo." },
  ], { hints: ["Vyprávíš o tom, co se stalo, co se děje, nebo co bude?", "Když líčíme zážitek, už se stal: šli jsme, viděli jsme."], explanation: "Vypravování o zážitku píšeme v minulém čase." }),
  choice("Kdo je hlavní postava?", "ten, o kom příběh hlavně vypráví", [
    { value: "autor knihy", why: "Autor příběh píše, nemusí v něm být." },
    { value: "čtenář", why: "Čtenář příběh čte." },
    { value: "kdokoli, kdo se objeví", why: "Vedlejší postavy nejsou hlavní." },
  ], { hints: ["Na koho se ve vyprávění čtenář dívá nejvíc?", "Hlavní hrdina prožívá to nejdůležitější."], explanation: "Hlavní postava je ten, o kom se hlavně vypráví." }),
  choice("Proč si před psaním vypravování napíšeme osnovu?", "abychom na nic nezapomněli a drželi pořadí", [
    { value: "aby byl sloh co nejdelší", why: "Délka není cíl." },
    { value: "protože to učitel chce", why: "Osnova hlavně pomáhá nám." },
    { value: "abychom nemuseli psát závěr", why: "Závěr musí být vždy." },
  ], { hints: ["K čemu je dobrý nákupní seznam?", "Plán v bodech ohlídá, že ve vyprávění nic nechybí a jde to po sobě."], explanation: "Osnova hlídá, abychom nic nevynechali a dodrželi pořadí." }),
  choice("K čemu je nadpis vypravování?", "krátký název, který láká ke čtení", [
    { value: "první věta celého úvodu", why: "Nadpis stojí nad textem." },
    { value: "podpis autora pod textem", why: "Podpis říká, kdo psal." },
    { value: "poslední věta závěru", why: "Ta patří do závěru." },
  ], { hints: ["Co čteš úplně první?", "Nadpis nad textem napoví, o čem se bude vyprávět, a má zaujmout."], explanation: "Nadpis je krátký název, který má čtenáře zaujmout." }),
];

type Cast = "U" | "Z" | "K";
const CASTI: Record<Cast, string> = { U: "úvod", Z: "zápletka", K: "závěr" };
const PROC: Record<Cast | "N", string> = {
  U: "Úvod teprve představuje postavy, místo a čas.",
  Z: "V zápletce se něco nečekaně přihodí.",
  K: "Závěr říká, jak to dopadlo.",
  N: "Nadpis je jen krátký název nad textem, ne věta z děje.",
};

function cast(veta: string, c: Cast, stopa: string): PracticeTask {
  const distraktory = [...(Object.keys(CASTI) as Cast[]).filter((x) => x !== c).map((x) => ({ value: CASTI[x], why: PROC[x] })),
    { value: "nadpis", why: PROC.N }] as [Distractor, Distractor, Distractor];
  return choice(`Do které části vypravování patří věta: „${veta}“?`, CASTI[c], distraktory, {
    hints: [
      `Věta „${veta}“ — seznamuje čtenáře s postavami, přináší problém, nebo něco uzavírá?`,
      `Začátek představí kdo, kde a kdy; prostředek přinese problém nebo překvapení; konec řekne, jak to dopadlo. Všimni si: ${stopa}.`,
    ],
    explanation: `${PROC[c]} Proto věta patří do části ${CASTI[c]}.`,
  });
}

const L2: PracticeTask[] = [
  cast("Jednoho letního rána se Péťa vydal k babičce na vesnici.", "U", "slova „Jednoho letního rána“ — kdy a kdo"),
  cast("Za devatero horami žila princezna Lada.", "U", "pohádka teprve říká, kde a kdo žil"),
  cast("V naší třídě je nový spolužák Adam.", "U", "věta představuje postavu"),
  cast("Loni v zimě jsme byli s rodiči na horách.", "U", "věta říká kdy, kde a s kým"),
  cast("Najednou se ozvala rána a lodička se začala potápět.", "Z", "slovo „Najednou“ a nečekaný problém"),
  cast("Cestou si Péťa všiml, že mu chybí klíče.", "Z", "objevil se problém, který bude potřeba vyřešit"),
  cast("Vtom se z křoví vyřítil velký pes.", "Z", "slovo „Vtom“ a překvapení"),
  cast("Uprostřed hry se nám ztratil míč v rákosí.", "Z", "děj se zkomplikoval"),
  cast("Když jsme dorazili, zjistili jsme, že je chata zamčená.", "Z", "nečekaná potíž"),
  cast("Nakonec jsme klíče našli v kapse u bundy a všichni se smáli.", "K", "slovo „Nakonec“ a vyřešený problém"),
  cast("Od té doby už Péťa na klíče nikdy nezapomněl.", "K", "věta shrnuje, co si Péťa odnesl"),
  cast("Unavení, ale šťastní jsme se večer vrátili domů.", "K", "návrat domů po celém dni"),
  cast("A tak se z Adama stal náš nejlepší kamarád.", "K", "slova „A tak“ a to, jak vše dopadlo"),
];

const CHYBI: [string, string, string, string] = ["úvod — kdo, kde a kdy", "zápletka — co se přihodilo", "závěr — jak to dopadlo", "nic, příběh je celý"];
const CHYBI_PROC = [
  "Úvod tu je — víme, kdo, kde a kdy.",
  "Zápletka tu je — něco se přihodilo.",
  "Závěr tu je — víme, jak to dopadlo.",
  "Jedna část příběhu chybí.",
];
function chybi(text: string, i: 0 | 1 | 2, hints: [string, string], proc: string): PracticeTask {
  const distraktory = CHYBI.map((v, j) => ({ value: v, why: CHYBI_PROC[j] })).filter((_, j) => j !== i) as [Distractor, Distractor, Distractor];
  return choice(`Text: „${text}“ Co tomuto vypravování chybí?`, CHYBI[i], distraktory, { hints, explanation: proc });
}

const L3: PracticeTask[] = [
  choice("Osnova: 1. Jdeme na výlet do lesa. 2. ??? 3. Unavení, ale spokojení se vracíme domů. Který bod patří doprostřed?", "Ztratíme se a hledáme cestu.", [
    { value: "Ráno si balíme batoh.", why: "Balení je před odchodem — patřilo by před bod 1." },
    { value: "Doma rychle usínáme.", why: "To je až po návratu." },
    { value: "Druhý den jdeme do školy.", why: "S výletem to nesouvisí." },
  ], { hints: ["Co chybí mezi odchodem a návratem?", "Prostřední bod osnovy přináší to, co se na výletě přihodilo."], explanation: "Doprostřed patří zápletka: ztratíme se a hledáme cestu." }),
  choice("Seřaď body osnovy: A) Drak unese princeznu. B) Princ draka přemůže. C) Princ a princezna mají svatbu.", "A, B, C", [
    { value: "C, A, B", why: "Svatba je až na konci." },
    { value: "B, C, A", why: "Princ nemůže porazit draka dřív, než drak princeznu unese." },
    { value: "A, C, B", why: "Svatba je až po vítězství nad drakem." },
  ], { hints: ["Co se stane jako první, aby měl princ důvod bojovat?", "Seřaď body podle příčiny a následku: problém, řešení, šťastný konec."], explanation: "Nejdřív únos (A), pak boj (B), nakonec svatba (C)." }),
  choice("Seřaď body osnovy: A) Schovali jsme se pod stříšku. B) Déšť přestal a vysvitlo slunce. C) Venku začalo pršet.", "C, A, B", [
    { value: "A, B, C", why: "Proč by se schovávali, když ještě neprší?" },
    { value: "B, C, A", why: "Slunce vysvitlo až po dešti." },
    { value: "C, B, A", why: "Schovali se, dokud pršelo — ne až potom." },
  ], { hints: ["Co bylo důvodem, proč se schovali?", "Najdi příčinu, pak reakci na ni a nakonec to, jak to skončilo."], explanation: "Nejdřív začalo pršet (C), schovali se (A) a pak vysvitlo slunce (B)." }),
  choice("Seřaď body osnovy: A) Vyhráli jsme pohár. B) Celý měsíc jsme trénovali. C) Přihlásili jsme se do soutěže.", "C, B, A", [
    { value: "A, B, C", why: "Pohár se vyhrává až na konci." },
    { value: "B, A, C", why: "Přihláška je před tréninkem na soutěž." },
    { value: "C, A, B", why: "Nejdřív se trénuje, pak se vyhrává." },
  ], { hints: ["Co muselo být úplně na začátku?", "Přihláška — příprava — výsledek: tak jdou události po sobě."], explanation: "Přihlásili se (C), trénovali (B) a vyhráli (A)." }),
  chybi("Jednou jsme šli k řece. Najednou jsme uviděli bobra, jak kácí strom.", 2, ["Víš, jak příhoda s bobrem skončila?", "Příběh začal a něco se přihodilo — co ale čtenář na konci neví?"], "Příběh nemá závěr — nevíme, jak to dopadlo."),
  chybi("Najednou se utrhla houpačka. Nakonec to dobře dopadlo a všichni se smáli.", 0, ["Víš, kdo se houpal a kde?", "Příběh hned začíná problémem — chybí představení postav a místa."], "Příběh nemá úvod — nevíme, kdo, kde a kdy."),
  chybi("Loni v létě jsme byli u moře. Nakonec jsme odjeli domů.", 1, ["Stalo se u moře něco zajímavého?", "Máme začátek i konec, ale mezi nimi se nic neděje."], "Příběh nemá zápletku — nic se nepřihodilo."),
  choice("Doplň slovo: „Nejdřív jsme si umyli ruce, ___ jsme začali vařit.“", "potom", [
    { value: "včera", why: "Neurčuje pořadí mezi dvěma kroky." },
    { value: "nejdřív", why: "„Nejdřív“ už ve větě je." },
    { value: "ale", why: "„Ale“ vyjadřuje odpor, ne pořadí." },
  ], { hints: ["Co následuje po mytí rukou?", "Hledej slovo, které ukazuje, že jedna činnost přišla po druhé."], explanation: "„Nejdřív… potom…“ — slova pořadí." }),
  choice("Doplň slovo: „Celý den jsme hledali kocoura Mourka. ___ jsme ho našli na půdě.“", "Nakonec", [
    { value: "Nejdříve", why: "Našli ho až po celodenním hledání." },
    { value: "Předtím", why: "Předtím by znamenalo před hledáním." },
    { value: "Zatím", why: "Zatím nevyjadřuje konec hledání." },
  ], { hints: ["Kdy Mourka našli — na začátku, nebo po dlouhém hledání?", "Slovo, které uzavírá děj, stojí u toho, co se stalo jako poslední."], explanation: "Po celodenním hledání ho našli — hodí se „Nakonec“." }),
  choice("Který nadpis se nejlépe hodí k vypravování o tom, jak se Péťa ztratil v zoologické zahradě?", "Ztracený mezi zvířaty", [
    { value: "Zvířata v Africe", why: "Text není o Africe." },
    { value: "Můj pokoj", why: "S příběhem nesouvisí." },
    { value: "Den", why: "Příliš obecné." },
  ], { hints: ["Co je v příběhu to nejdůležitější?", "Dobrý nadpis prozradí téma, ale neprozradí celý konec."], explanation: "„Ztracený mezi zvířaty“ vystihuje zápletku příběhu." }),
  choice("Text: „Byl krásný den. Svítilo slunce. Bylo teplo. Obloha byla modrá.“ Proč to ještě není vypravování?", "nic se v něm neděje", [
    { value: "nemá žádný nadpis", why: "Nadpis z textu vypravování neudělá." },
    { value: "je napsaný v minulém čase", why: "Minulý čas je u vypravování běžný." },
    { value: "má moc teček", why: "Tečky nerozhodují." },
  ], { hints: ["Stalo se v textu něco?", "Vypravování potřebuje děj — postavu, která něco zažije."], explanation: "Text jen popisuje počasí; chybí děj." }),
  choice("Který začátek vypravování je nejlepší?", "Minulou sobotu jsme s tátou jeli na kolech k rybníku.", [
    { value: "A pak se najednou stalo něco hrozného.", why: "To je věta ze zápletky, ne ze začátku." },
    { value: "Nakonec jsme unavení šli spát domů.", why: "To je věta ze závěru." },
    { value: "Bylo to prostě tak, jak to bylo.", why: "Z toho čtenář nic nezjistí." },
  ], { hints: ["Která věta řekne kdo, kde a kdy?", "Dobrý začátek uvede čtenáře do děje — představí postavy, místo a čas."], explanation: "Nejlepší začátek říká kdo, kde a kdy." }),
  choice("Co ve vypravování naznačuje věta „Najednou se setmělo a začalo hřmít.“?", "že přichází napětí", [
    { value: "že příběh končí", why: "Konec by řekl, jak to dopadlo." },
    { value: "kdo je hlavní postava", why: "O postavě věta nic neříká." },
    { value: "kde se příběh odehrává", why: "Místo věta neurčuje." },
  ], { hints: ["Co čtenáři prozradí slovo „Najednou“?", "Nečekaná změna počasí je signál, že se začne něco dít."], explanation: "„Najednou“ a bouřka ohlašují zápletku — přichází napětí." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const VYPRAVOVANIOSNOVA: TopicMetadata[] = [
  {
    id: "g3-cjl-vypravovani-osnova",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-vypravovani-podle-obrazkove-i-slovni-osnovy",
    title: "Vypravování podle obrázkové i slovní osnovy",
    studentTitle: "Píšu příběh",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat příběh s úvodem, zápletkou a závěrem.",
    keywords: ["vypravování", "osnova", "úvod", "zápletka", "závěr", "příběh", "pořadí"],
    goals: ["Sestavit osnovu příběhu.", "Napsat vypravování se třemi částmi.", "Dodržet časovou posloupnost."],
    boundaries: ["Jednoduchý příběh se třemi částmi."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Příběh = úvod (kdo/kde/kdy) + zápletka (co se stalo) + závěr (jak to skončilo).",
      steps: ["Sestav osnovu: 3 body.", "Úvod: Kde, kdy, kdo?", "Střed: Co se přihodilo?", "Závěr: Jak to dopadlo?"],
      commonMistake: "Příběh bez závěru — vždy řekni, jak to skončilo.",
      example: "1. Úvod: Jednoho dne šel Tomáš do lesa. 2. Zápletka: Ztratil cestu domů. 3. Závěr: Našel ho správce lesa a odvedl domů.",
    },
  },
];
