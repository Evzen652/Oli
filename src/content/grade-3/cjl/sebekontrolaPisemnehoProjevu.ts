import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam se stejnou nápovědou a jedinou úlohou na hledání chyby.
// Teď tři oddělené banky:
// L1 jak a kdy text kontrolujeme · L2 jaký druh chyby je ve větě (velké
// písmeno, znaménko na konci, i/y, chybějící slovo) · L3 najít ve větě
// konkrétní chybně napsané slovo (i/y, ě, ů/ú, velké písmeno ve jméně).

const L1: PracticeTask[] = [
  choice("Kdy svůj text kontrolujeme?", "po dopsání, když si ho znovu přečteme", [
    { value: "před psaním", why: "Text, který ještě neexistuje, zkontrolovat nejde." },
    { value: "nikdy, učitel to opraví", why: "Vlastní chyby máme najít sami." },
    { value: "jen když zbude čas", why: "Kontrola patří ke psaní vždycky." },
  ], { hints: ["Můžeš hledat chyby v textu, který ještě neexistuje?", "Nejdřív text dopíšeme celý, pak ho v klidu projdeme od začátku do konce."], explanation: "Text kontrolujeme po dopsání — přečteme ho a opravíme chyby." }),
  choice("Co při kontrole textu hlídáme?", "pravopis, velká písmena, interpunkci i smysl", [
    { value: "jen počet slov v celém textu", why: "Počet slov chyby neodhalí." },
    { value: "jen to, jak dlouhé jsou věty", why: "Délka vět o chybách nic neříká." },
    { value: "jen barvu propisky, kterou píšu", why: "Barva nemá s chybami nic společného." },
  ], { hints: ["Stačí zkontrolovat jen jednu věc?", "Chyba se může skrýt v písmenu, ve znaménku na konci věty i v tom, že věta čtenáři nic neřekne."], explanation: "Kontrolujeme pravopis, velká písmena, interpunkci i to, jestli text dává smysl." }),
  choice("Jak opravíme chybné slovo v sešitě?", "jednou čarou ho přeškrtneme a napíšeme ho znovu", [
    { value: "zamažeme ho, až není vidět", why: "Zamazaná skvrna je nepřehledná." },
    { value: "vytrhneme celou stránku", why: "Kvůli jednomu slovu se stránka netrhá." },
    { value: "necháme ho tak", why: "Chybu, kterou najdeme, opravíme." },
  ], { hints: ["Má učitel po opravě vidět, co tam bylo původně?", "Oprava má být čistá a čitelná — jedna rovná čára a správné slovo vedle nebo nad ním."], explanation: "Chybné slovo přeškrtneme jednou čarou a napíšeme ho správně." }),
  choice("Proč pomáhá číst si text nahlas?", "ucho zachytí chybu, kterou oko přehlédne", [
    { value: "text se tím zkrátí a zrychlí", why: "Čtení nahlas text nezkrátí." },
    { value: "chyby při tom zmizí samy od sebe", why: "Chyby musíme opravit my." },
    { value: "vůbec nepomáhá, je to zbytečné", why: "Pomáhá — slyšíme, když věta zní divně." },
  ], { hints: ["Který další smysl kromě zraku můžeš při kontrole zapojit?", "Když slyšíš vlastní větu, snáz poznáš, že v ní něco chybí nebo zní divně."], explanation: "Při čtení nahlas uslyšíme i chybu, kterou jsme očima přehlédli." }),
  choice("Co je korektura?", "opravování chyb v textu", [
    { value: "psaní nového textu", why: "Při korektuře se nic nového nepíše." },
    { value: "překládání do jiného jazyka", why: "To je překlad." },
    { value: "opisování textu", why: "To je opis." },
  ], { hints: ["Co dělá v redakci novin člověk, který čte články před tiskem?", "Korektor projde hotový text a hledá v něm, co je špatně napsané."], explanation: "Korektura je pečlivé hledání a opravování chyb v textu." }),
  choice("Proč si text po napsání čteme?", "abychom našli chyby, které jsme přehlédli", [
    { value: "abychom se ho naučili nazpaměť", why: "Nazpaměť se text učit nemusí." },
    { value: "abychom ho prodloužili", why: "O délku nejde." },
    { value: "není to potřeba", why: "Při psaní přehlédneme víc, než si myslíme." },
  ], { hints: ["Myslíš při psaní víc na obsah, nebo na každé písmeno?", "Při psaní se soustředíme na to, co chceme říct, a drobnosti nám uniknou — až při čtení je uvidíme."], explanation: "Čteme ho, abychom našli a opravili chyby, které jsme při psaní přehlédli." }),
  choice("Jaké je správné pořadí práce?", "napsat, přečíst, opravit, přepsat načisto", [
    { value: "přepsat načisto, napsat, přečíst", why: "Načisto se přepisuje až nakonec." },
    { value: "napsat a hned odevzdat", why: "Chybí kontrola." },
    { value: "opravit, napsat, přečíst", why: "Opravovat jde až napsaný text." },
  ], { hints: ["Co musí existovat dřív, než můžeš opravovat?", "Nejdřív koncept, pak kontrola a opravy; čistopis je až poslední krok."], explanation: "Nejdřív napíšeme, pak přečteme, opravíme a přepíšeme načisto." }),
  choice("Kde zjistíš, jak se slovo správně píše?", "v pravidlech českého pravopisu nebo ve slovníku", [
    { value: "v kuchařce s recepty na koláče", why: "V kuchařce jsou recepty." },
    { value: "v atlase s mapami světa", why: "V atlase jsou mapy." },
    { value: "v jízdním řádu autobusů a vlaků", why: "V jízdním řádu jsou spoje." },
  ], { hints: ["Která kniha má abecední seznam s pravopisem?", "Když si nejsi jistý nebo jistá, nehádej — nalistuj heslo v knize, která je k tomu určená."], explanation: "Správný zápis najdeme v Pravidlech českého pravopisu nebo ve slovníku." }),
  choice("Na co se ptáš, když kontroluješ, jestli je text srozumitelný?", "pochopí to čtenář, který u toho nebyl?", [
    { value: "je tam dost dlouhých slov?", why: "Dlouhá slova text srozumitelnějším neudělají." },
    { value: "zabere text celou stránku?", why: "Délka o srozumitelnosti nerozhoduje." },
    { value: "psal jsem dost rychle?", why: "Rychlost psaní nehraje roli." },
  ], { hints: ["Pro koho text píšeš?", "Srozumitelný text dává smysl i někomu, kdo nic z toho nezažil."], explanation: "Srozumitelný je text, kterému porozumí i čtenář, který u toho nebyl." }),
  choice("Jak píšeme jména lidí a měst?", "s velkým počátečním písmenem", [
    { value: "celá velkými písmeny", why: "Velké je jen první písmeno." },
    { value: "s malým počátečním písmenem", why: "Vlastní jména mají první písmeno velké." },
    { value: "v uvozovkách", why: "Jména do uvozovek nedáváme." },
  ], { hints: ["Jak začíná jméno Petr nebo Brno?", "Vlastní jména — lidí, zvířat, měst, řek — mají zvláštní první písmeno."], explanation: "Vlastní jména píšeme s velkým počátečním písmenem: Petr, Brno." }),
  choice("Čím končí věta, ve které se na něco ptáme?", "otazníkem", [
    { value: "tečkou", why: "Tečkou končí oznamovací věta." },
    { value: "čárkou", why: "Čárkou věta nekončí." },
    { value: "vykřičníkem", why: "Vykřičník patří za zvolání nebo rozkaz." },
  ], { hints: ["Jaké znaménko stojí za otázkou Kdy přijdeš?", "Oznamovací věta končí tečkou, zvolací vykřičníkem — a tázací?"], explanation: "Tázací věta končí otazníkem." }),
  choice("Čím začíná každá věta?", "velkým písmenem", [
    { value: "malým písmenem", why: "Na začátku věty je vždy velké písmeno." },
    { value: "číslem", why: "Věta začíná slovem." },
    { value: "čárkou", why: "Čárka na začátku věty nestojí." },
  ], { hints: ["Jak čtenář pozná, kde začíná nová věta?", "Za tečkou začíná další věta a její první písmeno se od ostatních liší."], explanation: "Každá věta začíná velkým písmenem." }),
  choice("Nevíš, jestli napsat i, nebo y. Co uděláš?", "vzpomenu si na pravidlo nebo vyjmenovaná slova", [
    { value: "napíšu něco mezi i a y, ať to nejde poznat", why: "Nečitelné písmeno chybu jen schová." },
    { value: "napíšu to, co mě zrovna napadne", why: "Pravopis se nehádá." },
    { value: "slovo raději úplně vynechám", why: "Pak by věta nedávala smysl." },
  ], { hints: ["Kde hledat pomoc, když váháš?", "Pravopis není hádání: po tvrdé souhlásce y, po měkké i, po obojetné rozhodne seznam, který ses učil."], explanation: "Rozhodneme podle pravidla: tvrdé, měkké a obojetné souhlásky a vyjmenovaná slova." }),
];

type Druh = "V" | "Z" | "IY" | "S";
const DRUHY: Record<Druh, string> = {
  V: "chybí velké písmeno",
  Z: "chybí znaménko na konci věty",
  IY: "špatně napsané i/y",
  S: "chybí slovo",
};
const PROC_NE: Record<Druh, string> = {
  V: "Velká písmena jsou tu v pořádku.",
  Z: "Na konci věty znaménko je a sedí.",
  IY: "I/y jsou ve všech slovech správně.",
  S: "Žádné slovo tu nechybí, věta dává smysl.",
};

function druhChyby(veta: string, druh: Druh, kam: string, oprava: string): PracticeTask {
  const distraktory = (Object.keys(DRUHY) as Druh[]).filter((d) => d !== druh)
    .map((d) => ({ value: DRUHY[d], why: PROC_NE[d] })) as [Distractor, Distractor, Distractor];
  return choice(`Ve větě je chyba: „${veta}“ Jaká?`, DRUHY[druh], distraktory, {
    hints: [
      `Přečti si větu „${veta}“ pomalu a nahlas. Kde by ses zarazil?`,
      `Zkontroluj postupně začátek věty, konec věty, pravopis a jestli věta dává smysl. Tady se zaměř na ${kam}.`,
    ],
    explanation: `Správně: ${oprava}`,
  });
}

const L2: PracticeTask[] = [
  druhChyby("dnes jdeme do kina.", "V", "úplný začátek věty", "Dnes jdeme do kina. — věta začíná velkým písmenem."),
  druhChyby("Bydlíme v praze.", "V", "název města", "Bydlíme v Praze. — jména měst píšeme s velkým písmenem."),
  druhChyby("Můj pes se jmenuje rex.", "V", "jméno psa", "Můj pes se jmenuje Rex. — i jména zvířat jsou vlastní jména."),
  druhChyby("ve škole máme novou tabuli.", "V", "první slovo", "Ve škole máme novou tabuli. — začátek věty má velké písmeno."),
  druhChyby("Maminka vaří oběd", "Z", "to, co stojí za posledním slovem", "Maminka vaří oběd. — oznamovací věta končí tečkou."),
  druhChyby("Kdy přijdeš domů", "Z", "to, jestli se někdo ptá", "Kdy přijdeš domů? — otázka končí otazníkem."),
  druhChyby("Pozor, pes kouše", "Z", "to, čím věta končí", "Pozor, pes kouše! — varování končí vykřičníkem."),
  druhChyby("Pes štěkal na kočki.", "IY", "souhlásku k v posledním slově", "Pes štěkal na kočky. — po tvrdé souhlásce k píšeme y."),
  druhChyby("Na stromě sedí malí ptáček.", "IY", "to, jaký ptáček je", "Na stromě sedí malý ptáček. — přídavné jméno „malý“ má ý."),
  druhChyby("Kluci hráli fotbal na hřyšti.", "IY", "měkkou souhlásku ř v místě, kde se hraje", "Kluci hráli fotbal na hřišti. — po měkké souhlásce ř píšeme i."),
  druhChyby("Petr šel do a koupil chleba.", "S", "místo mezi „do“ a „a“", "Petr šel do obchodu a koupil chleba. — za „do“ musí následovat kam."),
  druhChyby("Babička upekla výborný.", "S", "to, co babička vlastně upekla", "Babička upekla výborný koláč. — přídavné jméno potřebuje podstatné jméno."),
  druhChyby("Zítra pojedeme k na chalupu.", "S", "předložku „k“", "Zítra pojedeme k babičce na chalupu. — za „k“ musí být, ke komu."),
];

function spatneSlovo(veta: string, spatne: string, spravne: string, ostatni: [string, string, string], hints: [string, string], proc: string): PracticeTask {
  return choice(`Text: „${veta}“ Které slovo je napsané špatně?`, spatne,
    ostatni.map((w) => ({ value: w, why: `„${w}“ je napsané správně.` })) as [Distractor, Distractor, Distractor],
    { hints, explanation: `Správně je „${spravne}“ — ${proc}` });
}

const L3: PracticeTask[] = [
  spatneSlovo("U cesty rostly bílé kitky.", "kitky", "kytky", ["cesty", "rostly", "bílé"], ["Po které souhlásce se nikdy nepíše i?", "Po tvrdých souhláskách h, ch, k, r, d, t, n píšeme y. Najdi slovo, kde tohle pravidlo neplatí."], "po tvrdé souhlásce k píšeme y."),
  spatneSlovo("Na výlete jsme viděli srnu.", "výlete", "výletě", ["jsme", "viděli", "srnu"], ["Jak zní to slovo, když ho vyslovíš pečlivě — je tam tvrdé, nebo měkké t?", "Když slyšíme ťe, píšeme tě. Poslechni si každé slovo s písmenem e."], "vyslovujeme ťe, píšeme tě."),
  spatneSlovo("Tatínek opravuje kolo v dílne.", "dílne", "dílně", ["Tatínek", "opravuje", "kolo"], ["Vyslov poslední slovo pečlivě — slyšíš ne, nebo ně?", "Kde slyšíme ňe, píšeme ně. Tak je to i u místa, kde tatínek opravuje kolo."], "vyslovujeme ňe, píšeme ně."),
  spatneSlovo("Naše kočka chitla malou myš.", "chitla", "chytla", ["kočka", "malou", "myš"], ["Je ch tvrdá, nebo měkká souhláska?", "Ch patří k tvrdým souhláskám jako h, k, r — po nich píšeme y."], "po tvrdé souhlásce ch píšeme y."),
  spatneSlovo("V létě pojedeme k moři do itálie.", "itálie", "Itálie", ["létě", "pojedeme", "moři"], ["Které slovo je jméno země?", "Názvy států, měst a řek jsou vlastní jména — první písmeno mají velké."], "názvy států píšeme s velkým písmenem."),
  spatneSlovo("Pes leží v boudě a hlídá dúm.", "dúm", "dům", ["leží", "boudě", "hlídá"], ["Kde se píše ú s čárkou a kde ů s kroužkem?", "Ú s čárkou píšeme hlavně na začátku slova; uprostřed a na konci slova bývá ů."], "uprostřed slova píšeme ů s kroužkem."),
  spatneSlovo("Jeli jsme přes ůzký most.", "ůzký", "úzký", ["Jeli", "jsme", "most"], ["Které slovo začíná dlouhým u?", "Na začátku slova píšeme ú s čárkou, kroužek tam nepatří."], "na začátku slova píšeme ú."),
  spatneSlovo("Na stole ležel žlutí citron.", "žlutí", "žlutý", ["stole", "ležel", "citron"], ["Jaký citron? Poslechni si, jak končí to slovo.", "Přídavná jména jako mladý, žlutý, velký končí na -ý; po tvrdém t se i nepíše."], "přídavné jméno „žlutý“ končí na ý."),
  spatneSlovo("Ve škole máme nového spolužáka tomáše.", "tomáše", "Tomáše", ["škole", "nového", "spolužáka"], ["Které slovo je jméno člověka?", "Jména lidí jsou vlastní jména — i uprostřed věty začínají velkým písmenem."], "jména lidí píšeme s velkým písmenem."),
  spatneSlovo("Sestra hraje na housle a na klavýr.", "klavýr", "klavír", ["Sestra", "hraje", "housle"], ["Je slovo s obojetnou souhláskou v mezi vyjmenovanými?", "Po obojetné souhlásce píšeme y jen ve vyjmenovaných slovech a slovech příbuzných. Jinak i."], "„klavír“ není vyjmenované slovo, po v píšeme í."),
  spatneSlovo("Zítra budeme psát dikdát.", "dikdát", "diktát", ["Zítra", "budeme", "psát"], ["Které slovo se vyslovuje jinak, než se píše?", "Když souhláska zní nejasně, zkus ji pomalu a zřetelně vyslovit: diktovat, diktát."], "slovo patří k „diktovat“, píše se kt."),
  spatneSlovo("Dědeček každé ráno čte novini.", "novini", "noviny", ["Dědeček", "každé", "ráno"], ["Je n tvrdá, nebo měkká souhláska?", "N patří k tvrdým souhláskám jako d a t — po nich píšeme y (noviny, tady, dýně)."], "po tvrdé souhlásce n píšeme y."),
  spatneSlovo("Ptáci na podzim odlétají do teplích krajin.", "teplích", "teplých", ["Ptáci", "podzim", "krajin"], ["Do jakých krajin? Poslechni si, jak zní konec toho slova.", "Přídavná jména jako teplý, mladý, velký mají v tomto tvaru -ých: teplých, mladých."], "přídavné jméno „teplý“ má tvar „teplých“."),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const SEBEKONTROLAPROJEVU: TopicMetadata[] = [
  {
    id: "g3-cjl-sebekontrola-projevu",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-psani-sebekontrola-vlastniho-pisemneho-projevu",
    title: "Sebekontrola vlastního písemného projevu",
    studentTitle: "Kontroluji svůj text",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Psaní",
    briefDescription: "Naučíš se zkontrolovat a opravit svůj napsaný text.",
    keywords: ["sebekontrola", "korektura", "oprava chyb", "přečíst text", "pravopis kontrola"],
    goals: ["Přečíst vlastní text a hledat chyby.", "Opravit nalezené chyby.", "Zkontrolovat pravopis, velká písmena a interpunkci."],
    boundaries: ["Základní sebekontrola, bez pokročilé stylistiky."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Po napsání vždy přečti text znovu. Hledej: chybná písmena, velká/malá písmena, tečky a čárky.",
      steps: ["Dočti text do konce.", "Přečti ho znovu — tentokrát pomalu.", "Podtrhni slova, která vypadají špatně.", "Oprav chyby."],
      commonMistake: "Přeskočení sebekontroly — unáhlené odevzdání textu s chybami.",
      example: "Napsáno: 'šel do školi' → kontrola → opraveno: 'šel do školy'.",
    },
  },
];
