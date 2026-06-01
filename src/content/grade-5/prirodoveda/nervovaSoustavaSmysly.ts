import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Z čeho se skládá nervová soustava?", correctAnswer: "Mozek + mícha + nervy", options: ["Mozek + mícha + nervy", "Srdce + mozek + nervy", "Játra + mozek + mícha", "Mozek + plíce + nervy"], hints: ["CNS = centrální nervová soustava = mozek + mícha."] },
  { question: "Jakou funkcí má velký mozek?", correctAnswer: "Myšlení, paměť, vědomé pohyby, řeč", options: ["Myšlení, paměť, vědomé pohyby, řeč", "Koordinace pohybů a rovnováha", "Dýchání a srdeční tep", "Vnímání chuti a čichu"], hints: ["Velký mozek = největší část mozku."] },
  { question: "Co řídí mozeček?", correctAnswer: "Koordinaci pohybů a rovnováhu", options: ["Koordinaci pohybů a rovnováhu", "Vědomé myšlení a paměť", "Dýchání a srdeční tep", "Vidění a sluch"], hints: ["Bez mozečku bychom nedokázali chodit rovně."] },
  { question: "Co řídí mozkový kmen?", correctAnswer: "Životně důležité funkce: dýchání, srdeční tep, trávení", options: ["Životně důležité funkce: dýchání, srdeční tep, trávení", "Myšlení a paměť", "Rovnováhu a koordinaci", "Zrak a sluch"], hints: ["Mozkový kmen pracuje i ve spánku."] },
  { question: "Který smyslový orgán slouží k vidění?", correctAnswer: "Oko (sítnice + zrakový nerv)", options: ["Oko (sítnice + zrakový nerv)", "Ucho", "Jazyk", "Nos"], hints: ["Sítnice = citlivá vrstva na zadní stěně oka."] },
  { question: "Jak funguje sluch?", correctAnswer: "Zvuk → ušní boltec → ušní bubínek → sluchové kůstky → hlemýžď → sluchový nerv → mozek", options: ["Zvuk → ušní boltec → ušní bubínek → sluchové kůstky → hlemýžď → sluchový nerv → mozek", "Zvuk → nos → mozek", "Zvuk → oko → mozek přes zrakový nerv", "Zvuk → mozek přímo přes vzduch"], hints: ["Bubínek vibruje a přenáší zvuk do středního ucha."] },
  { question: "Jakou roli hraje čich?", correctAnswer: "Vnímání vůní a pachů přes čichové buňky v nose", options: ["Vnímání vůní a pachů přes čichové buňky v nose", "Vnímání chuti jídla", "Udržení rovnováhy", "Detekce teploty vzduchu"], hints: ["Čich a chuť jsou úzce propojeny."] },
  { question: "Jak rozpoznáváme různé chutě?", correctAnswer: "Chuťovými pohárky na jazyku (sladký, slaný, kyselý, hořký, umami)", options: ["Chuťovými pohárky na jazyku (sladký, slaný, kyselý, hořký, umami)", "Čichovými buňkami v nose", "Receptory v žaludku", "Nervovými zakončeními v zubech"], hints: ["Jazyk má tisíce chuťových pohárků."] },
  { question: "Co vnímá kůže (hmat)?", correctAnswer: "Dotek, tlak, bolest, teplotu přes kožní receptory", options: ["Dotek, tlak, bolest, teplotu přes kožní receptory", "Zvuk a světlo", "Chemické látky a vůně", "Pohyb a polohu těla"], hints: ["Kůže je největší smyslový orgán těla."] },
  { question: "Co je reflex?", correctAnswer: "Rychlá mimovolná reakce nervové soustavy (bez vědomé kontroly)", options: ["Rychlá mimovolná reakce nervové soustavy (bez vědomé kontroly)", "Vědomé rozhodnutí reagovat na podnět", "Pomalá reakce mozku na bolest", "Pohyb způsobený vůlí"], hints: ["Kolenkový reflex – lékař gumovým kladívkem."] },
  { question: "Co jsou neurony?", correctAnswer: "Nervové buňky přenášející elektrické signály", options: ["Nervové buňky přenášející elektrické signály", "Buňky mozku produkující hormony", "Krevní buňky zásobující mozek kyslíkem", "Svalové buňky reagující na nervové impulzy"], hints: ["Mozek obsahuje asi 86 miliard neuronů."] },
  { question: "Proč je spánek důležitý pro mozek?", correctAnswer: "Mozek ve spánku upevňuje paměť, čistí odpadní látky a obnovuje energii", options: ["Mozek ve spánku upevňuje paměť, čistí odpadní látky a obnovuje energii", "Mozek ve spánku úplně odpočívá a nepracuje", "Spánek je potřebný jen pro svaly, ne pro mozek", "Ve spánku se tvoří nové neurony pro paměť"], hints: ["Děti ve věku 10–11 let potřebují 9–11 hodin spánku."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak probíhá přenos nervového signálu z neuronu na neuron?", correctAnswer: "Elektrický signál přechází přes synaptickou štěrbinu pomocí chemických přenašečů (neurotransmiterů) na další neuron", options: ["Elektrický signál přechází přes synaptickou štěrbinu pomocí chemických přenašečů (neurotransmiterů) na další neuron", "Signál přechází přímo elektrickým kontaktem mezi neurony", "Signál putuje krevním řečištěm do dalších neuronů", "Neurony jsou propojeny fyzicky – signál teče mechanicky"], hints: ["Synapse = místo spojení dvou neuronů."] },
  { question: "Jak se liší vědomé a reflexní pohyby?", correctAnswer: "Vědomé: signál prochází mozkem (pomalejší). Reflex: míšní oblouk bez mozku (rychlejší) – ochranná reakce na nebezpečí.", options: ["Vědomé: signál prochází mozkem (pomalejší). Reflex: míšní oblouk bez mozku (rychlejší) – ochranná reakce na nebezpečí.", "Vědomé pohyby jsou rychlejší – mozek je nejefektivnější.", "Reflexy procházejí mozkem, vědomé pohyby ne.", "Oba typy pohybů jsou stejně rychlé."], hints: ["Reflex na bolest ruky: ruka se stáhne dřív, než si to uvědomíme."] },
  { question: "Proč ztratíme rovnováhu při zánětu středního ucha?", correctAnswer: "Středního ucho obsahuje rovnovážný orgán (polokruhovité kanálky). Zánět narušuje tekutinu v nich → mozek dostává zkreslené informace o poloze těla.", options: ["Středního ucho obsahuje rovnovážný orgán (polokruhovité kanálky). Zánět narušuje tekutinu v nich → mozek dostává zkreslené informace o poloze těla.", "Zánět ucha přerušuje sluchový nerv vedoucí do mozečku.", "Rovnováha závisí na oči – zánět ucha postihuje zrakový nerv.", "Zánět středního ucha způsobuje bolest, která narušuje soustředění potřebné k rovnováze."], hints: ["Polokruhovité kanálky = tři trubičky kolmé na sebe → vnímají rotaci ve 3D."] },
  { question: "Jak mozek zpracovává obraz z obou očí?", correctAnswer: "Každé oko snímá obraz trochu jinak. Mozek je spojí a vytvoří 3D vnímání (stereoskopické vidění) pro posouzení vzdálenosti.", options: ["Každé oko snímá obraz trochu jinak. Mozek je spojí a vytvoří 3D vnímání (stereoskopické vidění) pro posouzení vzdálenosti.", "Každé oko posílá obraz do jiné hemisféry – mozek je nikdy nespojuje.", "Mozek vybere obraz z jednoho oka a druhé ignoruje.", "Obraz je stejný v obou očích – mozek ho zostruje, ne spojuje."], hints: ["Zakryjte jedno oko – hloubka vnímání se změní."] },
  { question: "Jak bolest chrání tělo?", correctAnswer: "Bolest signalizuje poškození tkáně – nutí nás ukončit škodlivou činnost a vyhledat pomoc. Bez bolesti bychom si závažná zranění ani nevšimli.", options: ["Bolest signalizuje poškození tkáně – nutí nás ukončit škodlivou činnost a vyhledat pomoc. Bez bolesti bychom si závažná zranění ani nevšimli.", "Bolest je negativní jev bez ochranné funkce.", "Bolest vzniká v srdci a varuje před srdečním infarktem.", "Bolest je způsobena zánětem, ne nervovým signálem."], hints: ["Lidé s vrozenou necitlivostí k bolesti si způsobují těžká zranění bez povšimnutí."] },
  { question: "Co je podmíněný reflex (Pavlovův pes)?", correctAnswer: "Naučený reflex: organismus reaguje na neutrální podnět (zvonek), který byl opakovaně spojen s původním podnětem (jídlo). Pavlovovi psi slinili na zvuk zvonku.", options: ["Naučený reflex: organismus reaguje na neutrální podnět (zvonek), který byl opakovaně spojen s původním podnětem (jídlo). Pavlovovi psi slinili na zvuk zvonku.", "Podmíněný reflex je vrozený – nelze se ho naučit.", "Podmíněný reflex prochází vědomou kontrolou mozku.", "Podmíněný reflex se mění u každého jedince každý den."], hints: ["Ivan Pavlov (1849–1936) – Nobel 1904 za fyziologii trávení."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak způsobuje pití alkoholu poruchy koordinace a paměti?", correctAnswer: "Alkohol zpomaluje přenos nervových signálů tlumením neurotransmiterů (GABA). Potkozuje mozeček (koordinace) a hipokampus (paměť). Způsobuje 'výpadky paměti'.", options: ["Alkohol zpomaluje přenos nervových signálů tlumením neurotransmiterů (GABA). Potkozuje mozeček (koordinace) a hipokampus (paměť). Způsobuje 'výpadky paměti'.", "Alkohol zvyšuje aktivitu mozku, proto je koordinace narušena.", "Alkohol ničí neurony přímo – poruchy jsou nevratné ihned.", "Alkohol ovlivňuje jen motorické nervy, ne paměťové centrum."], hints: ["Hipokampus = centrum krátkodobé paměti. Mozeček = koordinace."] },
  { question: "Proč máme různou ostrost vidění v centru a na okraji zorného pole?", correctAnswer: "Sítnice: centrum (žlutá skvrna) má vysokou hustotu čípků pro ostré barevné vidění. Okraj má tyčinky pro vnímání pohybu a vidění za šera, ale menší ostrost.", options: ["Sítnice: centrum (žlutá skvrna) má vysokou hustotu čípků pro ostré barevné vidění. Okraj má tyčinky pro vnímání pohybu a vidění za šera, ale menší ostrost.", "Oko vidí stejně ostře všude – jen mozek ostří jen střed obrazu.", "Centrum oka vnímá jen světlo, okraj barvy.", "Ostrost vidění závisí na poloze zorniček, ne na sítnici."], hints: ["Tyčinky = šerovidění. Čípky = barevné ostré vidění."] },
  { question: "Proč trénink a opakování zlepšují motorické dovednosti?", correctAnswer: "Opakování posiluje synaptická spojení (plasticita mozku) a myelinizaci nervů → signály se přenášejí rychleji a přesněji. Pohyb se stane automatickým.", options: ["Opakování posiluje synaptická spojení (plasticita mozku) a myelinizaci nervů → signály se přenášejí rychleji a přesněji. Pohyb se stane automatickým.", "Trénink zvyšuje počet neuronů v motorickém kortexu.", "Opakování zlepšuje jen výdrž svalů, ne nervový přenos.", "Motorické dovednosti jsou vrozené – trénink jen odhaluje přirozený talent."], hints: ["Myelin = izolace nervu. Více myelinu = rychlejší přenos."] },
  { question: "Jak neuroplasticita pomáhá po poranění mozku?", correctAnswer: "Zdravé neurony přebírají funkci poškozených oblastí tvorbou nových synapsí. Intenzivní rehabilitace využívá tuto plasticitu k obnově ztracených funkcí.", options: ["Zdravé neurony přebírají funkci poškozených oblastí tvorbou nových synapsí. Intenzivní rehabilitace využívá tuto plasticitu k obnově ztracených funkcí.", "Poranění mozku je vždy nevratné – neuroplasticita nepomáhá.", "Mozek se regeneruje přemnožením stávajících neuronů na postižené místo.", "Rehabilitace pomáhá jen svalům – mozek se neopravuje."], hints: ["Neuroplasticita = schopnost mozku měnit svou strukturu a funkci."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const NERVOVASOUSTAVASMYSLY: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-nervova-soustava-smysly",
    title: "Nervová soustava, smysly",
    studentTitle: "Mozek a smysly",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo - soustavy",
    briefDescription: "Pochopíš, jak mozek a smysly spolupracují při vnímání světa.",
    keywords: ["mozek", "nervová soustava", "smysly", "reflex", "zrak", "sluch", "čich", "chuť", "hmat"],
    goals: ["Popsat části nervové soustavy a jejich funkce", "Vysvětlit princip vnímání základními smysly", "Rozlišit vědomý pohyb od reflexu"],
    boundaries: ["Neprobírá neurochemii do hloubky", "Neprobírá duševní poruchy"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Mozek: velký (myšlení), mozeček (koordinace), mozkový kmen (dýchání, tep). 5 smyslů: zrak, sluch, čich, chuť, hmat.",
      steps: [
        "1. Velký mozek: myšlení, paměť, řeč.",
        "2. Mozeček: rovnováha, koordinace.",
        "3. Mozkový kmen: dýchání, tep (automatické).",
        "4. Smysly: oko (světlo), ucho (zvuk), nos (vůně), jazyk (chuť), kůže (dotek).",
        "5. Reflex: rychlá reakce bez vědomé kontroly.",
      ],
      commonMistake: "Reflex probíhá v míše (míšní oblouk) – mozek je informován až dodatečně.",
      example: "Dotkneš se horké plotny → reflex okamžitě stáhne ruku → teprve pak cítíš bolest.",
    },
  },
];
