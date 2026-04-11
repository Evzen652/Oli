import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray, pickRandom, mapQPoolToTasks, type QPool } from "../helpers";

const HEALTH_QUESTIONS: QPool[] = [
  { question: "🏃 Proč je pohyb důležitý pro zdraví?", correct: "Posiluje svaly a srdce", options: ["Posiluje svaly a srdce", "Pomáhá spát", "Zlepšuje zrak", "Nic nedělá"], hints: ["Když běháš nebo skáčeš, co v těle pracuje nejvíc?", "Pohyb posiluje dvě důležité věci — svaly a jeden orgán v hrudníku."] },
  { question: "🥦 Které jídlo je nejzdravější?", correct: "Zelenina a ovoce", options: ["Zelenina a ovoce", "Čokoláda", "Chipsy", "Bonbóny"], hints: ["Které jídlo roste na záhonku nebo na stromě?", "Zdravé jídlo je přirozené, ne z obalu — co to je?"] },
  { question: "💧 Kolikrát denně bychom měli pít?", correct: "Pravidelně celý den", options: ["Pravidelně celý den", "Jen ráno", "Jen když mám žízeň", "Jen u oběda"], hints: ["Tělo potřebuje vodu neustále. Stačí pít jen jednou?", "Pít bychom měli průběžně — nejen když máme žízeň."] },
  { question: "😴 Proč děti potřebují dostatek spánku?", correct: "Tělo roste a nabírá sílu", options: ["Tělo roste a nabírá sílu", "Aby nechodily ven", "Spánek není důležitý", "Protože to říká maminka"], hints: ["Během spánku se tělo opravuje a roste. Co je tedy hlavní důvod?", "Děti rostou hlavně ve spánku — proto potřebují spát víc než dospělí."] },
  { question: "🦷 Jak často si máme čistit zuby?", correct: "Ráno a večer", options: ["Ráno a večer", "Jen ráno", "Jen večer", "Jednou týdně"], hints: ["Zuby si čistíme dvakrát denně. Kdy přesně?", "Jednou po probuzení a jednou před spaním."] },
  { question: "🧼 Kdy si máme mýt ruce?", correct: "Před jídlem a po toaletě", options: ["Před jídlem a po toaletě", "Jen ráno", "Jen večer", "Nikdy"], hints: ["Ruce si myjeme, aby na nich nebyly bakterie. Kdy je to nejdůležitější?", "Před jídlem, abychom nespolkli bakterie, a po jedné místnosti v bytě…"] },
  { question: "🍎 Co patří ke zdravé svačině?", correct: "Jablko a celozrnný chléb", options: ["Jablko a celozrnný chléb", "Čokoládová tyčinka", "Hranolky", "Limonáda"], hints: ["Zdravá svačina by měla obsahovat ovoce a něco sytého. Co z možností to splňuje?", "Čokoláda, hranolky a limonáda jsou pochoutky — ale ne zdravá svačina."] },
  { question: "📱 Proč nemáme trávit hodiny u obrazovky?", correct: "Škodí očím a chybí pohyb", options: ["Škodí očím a chybí pohyb", "Obrazovky nic nedělají", "Je to nuda", "Rodiče to nechtějí"], hints: ["Dlouhé koukání na obrazovku unaví oči. A co tělo — hýbe se u toho?", "Obrazovka škodí dvěma způsoby: očím a také chybí něco důležitého pro zdraví."] },
  // Nové otázky
  { question: "🥛 Proč je mléko důležité pro děti?", correct: "Obsahuje vápník pro kosti", options: ["Obsahuje vápník pro kosti", "Je sladké", "Nahrazuje vodu", "Je barevné"], hints: ["Kosti dětí rostou a potřebují jednu důležitou látku z mléka.", "Vápník posiluje kosti a zuby — a je ho hodně v mléce."] },
  { question: "🍽️ Kolikrát denně bychom měli jíst?", correct: "Asi 5× (3 hlavní jídla + 2 svačiny)", options: ["Asi 5× (3 hlavní jídla + 2 svačiny)", "Jen 1× denně", "Jen 2× denně", "Kolikrát chceme"], hints: ["Snídaně, svačina, oběd, svačina, večeře — kolik je to jídel?", "Správně je jíst pravidelně — asi 5× za den."] },
  { question: "🚿 Proč se máme pravidelně sprchovat?", correct: "Odstraníme pot a bakterie", options: ["Odstraníme pot a bakterie", "Abychom voněli", "Rodiče to chtějí", "Není to nutné"], hints: ["Na kůži se hromadí pot a nečistoty. Co s nimi uděláme?", "Sprchováním se zbavíme bakterií a potu — je to důležité pro zdraví."] },
  { question: "🏊 Který sport je vhodný pro celé tělo?", correct: "Plavání", options: ["Plavání", "Šachy", "Čtení", "Kreslení"], hints: ["Při tomto sportu pracují téměř všechny svaly těla.", "Ve vodě cvičíš celé tělo — plavání je skvělý sport."] },
  { question: "🧃 Co je lepší pít — vodu, nebo sladkou limonádu?", correct: "Vodu", options: ["Vodu", "Limonádu", "Obojí stejně", "Nic"], hints: ["Limonáda obsahuje hodně cukru. Co je zdravější?", "Voda je nejzdravější nápoj — bez cukru a kalorií."] },
  { question: "🌞 Proč bychom měli trávit čas venku?", correct: "Čerstvý vzduch a pohyb prospívají zdraví", options: ["Čerstvý vzduch a pohyb prospívají zdraví", "Venku je hezky", "Nemáme co dělat doma", "Je to jedno"], hints: ["Venku dýcháme čerstvý vzduch a hýbeme se. Proč je to důležité?", "Čerstvý vzduch + pohyb = zdravé tělo i mysl."] },
  { question: "😴 Kolik hodin by mělo dítě spát?", correct: "Asi 10 hodin", options: ["Asi 10 hodin", "5 hodin", "15 hodin", "Kolik chce"], hints: ["Děti potřebují víc spánku než dospělí. Kolik přibližně?", "Doporučený spánek pro školáky je asi 10 hodin denně."] },
  { question: "🦠 Proč si myjeme ruce mýdlem?", correct: "Mýdlo zabije bakterie", options: ["Mýdlo zabije bakterie", "Aby ruce voněly", "Protože to říká maminka", "Stačí jen voda"], hints: ["Samotná voda nestačí — mýdlo dělá něco navíc s bakteriemi.", "Mýdlo odstraňuje a ničí bakterie z kůže."] },
];

const HELP_HEALTH: HelpData = {
  hint: "Zdravý životní styl = správné jídlo, pohyb, spánek a hygiena.",
  steps: ["Přečti otázku — týká se jídla, pohybu, spánku, nebo hygieny?", "Vzpomeň si, co ti říkají ve škole nebo doma.", "Vyber odpověď, která je zdravá a rozumná."],
  commonMistake: "Chipsy a bonbóny nejsou zdravá svačina, i když chutnají dobře!",
  example: "🥦 Nejzdravější jídlo? → Zelenina a ovoce ✅",
  visualExamples: [{ label: "Zdravý den", illustration: "🌅 Ráno: snídaně + čištění zubů\n🏫 Škola: svačina (ovoce 🍎)\n🏃 Odpoledne: pohyb venku\n🥗 Večer: zdravá večeře\n😴 Noc: 10 hodin spánku" }],
};

const FIRST_AID_QUESTIONS: QPool[] = [
  { question: "🩹 Co uděláš, když se řízneš do prstu?", correct: "Omyji a přilepím náplast", options: ["Omyji a přilepím náplast", "Nic, samo se zahojí", "Dám si ruku do kapsy", "Začnu běhat"], hints: ["Ránu je potřeba nejdřív vyčistit. Co uděláš potom?", "Po omytí ránu zakryješ, aby se do ní nedostala špína."] },
  { question: "📞 Jaké číslo voláme v nouzi?", correct: "112 nebo 155", options: ["112 nebo 155", "100", "999", "123"], hints: ["Tísňové číslo je trojciferné a začíná jedničkou.", "Pamatuj si: 1-1-2 je obecná tísňová linka, 1-5-5 je záchranná služba."] },
  { question: "🔥 Co uděláš, když vidíš požár?", correct: "Utečeš a zavoláš dospělé", options: ["Utečeš a zavoláš dospělé", "Hasisíš sám", "Díváš se", "Schovám se"], hints: ["Požár je nebezpečný — první pravidlo je dostat se do bezpečí.", "Nikdy se nepokoušej hasit oheň sám. Komu to řekneš?"] },
  { question: "🤕 Kamarád spadl a bolí ho ruka. Co uděláš?", correct: "Řekneš to dospělému", options: ["Řekneš to dospělému", "Nic", "Zatřeseš mu rukou", "Pošleš ho domů"], hints: ["Kamarád má bolest — potřebuje pomoc někoho zkušeného.", "Ty nemůžeš posoudit, jestli je to vážné. Kdo to umí?"] },
  { question: "🐝 Co uděláš po bodnutí včelou?", correct: "Řekneš dospělému a ochladíš místo", options: ["Řekneš dospělému a ochladíš místo", "Mačkáš to", "Nic se neděje", "Namažeš to hlínou"], hints: ["Po bodnutí je místo oteklé a bolí. Co pomůže proti otoku?", "Chlad zmírní bolest a otok. A komu to řekneš?"] },
  { question: "☀️ Co dělat, když je ti na slunci špatně?", correct: "Jdu do stínu a napiju se", options: ["Jdu do stínu a napiju se", "Zůstanu na slunci", "Dám si zmrzlinu", "Lehnu si na slunce"], hints: ["Tělo je přehřáté — potřebuje se zchladit a dostat tekutinu.", "Nejdůležitější: pryč ze slunce a pít čistou vodu."] },
  { question: "🩸 Teče kamarádovi krev z nosu. Co uděláš?", correct: "Předkloní hlavu a stiskne nos", options: ["Předkloní hlavu a stiskne nos", "Zakloní hlavu", "Zavolá 112", "Nic"], hints: ["Krev z nosu — hlava musí jít dopředu, ne dozadu. Proč?", "Při zaklonění by krev tekla do krku. Správně je předklonit a stisknout nos."] },
  { question: "⚡ Proč se nesmíš dotýkat zásuvky mokrýma rukama?", correct: "Hrozí úraz elektrickým proudem", options: ["Hrozí úraz elektrickým proudem", "Nic se nestane", "Zásuvka se rozbije", "Ruce budou špinavé"], hints: ["Voda vede elektřinu. Co se stane, když se mokrou rukou dotkneš zásuvky?", "Elektřina je nebezpečná — a voda ji dovede do tvého těla."] },
  // Nové otázky
  { question: "🚑 Jaké číslo má záchranná služba?", correct: "155", options: ["155", "150", "158", "112"], hints: ["Záchranná služba má své vlastní číslo. Začíná jedničkou.", "1-5-5 = záchranná služba (sanitka)."] },
  { question: "🚒 Jaké číslo mají hasiči?", correct: "150", options: ["150", "155", "158", "112"], hints: ["Hasiči mají číslo, které začíná jedničkou a končí nulou.", "1-5-0 = hasiči."] },
  { question: "👮 Jaké číslo má policie?", correct: "158", options: ["158", "155", "150", "112"], hints: ["Policie má číslo, které začíná jedničkou a končí osmičkou.", "1-5-8 = policie."] },
  { question: "🧊 Co přiložíš na bouli po nárazu?", correct: "Studený obklad", options: ["Studený obklad", "Teplý obklad", "Náplast", "Nic"], hints: ["Boule oteče a bolí. Co pomůže zmírnit otok?", "Studený obklad (led v hadříku) zmírní bolest a otok."] },
  { question: "🌊 Proč se nesmíš koupat sám bez dozoru?", correct: "Hrozí utonutí", options: ["Hrozí utonutí", "Voda je studená", "Je to nuda", "Nic se nestane"], hints: ["Ve vodě může být nebezpečno, i když umíš plavat.", "Voda je nebezpečná — proto vždy s dospělým!"] },
  { question: "🏠 Co uděláš, když ucítíš plyn v bytě?", correct: "Otevřu okna a řeknu dospělému", options: ["Otevřu okna a řeknu dospělému", "Zapálím sirku", "Nic", "Zapnu televizi"], hints: ["Plyn je nebezpečný a hořlavý! Co nesmíš dělat?", "Otevři okna (vyvětrej) a zavolej dospělého. NIKDY nezapaluj!"] },
  { question: "🚶 Jak správně přecházíš silnici?", correct: "Rozhlédnu se, počkám a přejdu na přechodu", options: ["Rozhlédnu se, počkám a přejdu na přechodu", "Přeběhnu rychle", "Přejdu kdekoli", "Nekoukám se"], hints: ["Silnice je nebezpečná. Co uděláš, než vstoupíš na vozovku?", "Na přechodu se rozhlédni doleva, doprava, doleva — a teprve pak přejdi."] },
];

const HELP_FIRST_AID: HelpData = {
  hint: "Při úrazu: zachovej klid, řekni dospělému, zavolej 112.",
  steps: ["Přečti si situaci — co se stalo?", "Přemýšlej — je to nebezpečné? Potřebuji pomoc dospělého?", "Vyber nejbezpečnější a nejrozumnější řešení."],
  commonMistake: "Při krvácení z nosu se hlava NEPŘEDKLÁNÍ dozadu — krev by tekla do žaludku!",
  example: "📞 Nouzové číslo: 112 (obecné) nebo 155 (záchranná služba) ✅",
  visualExamples: [{ label: "Důležitá čísla", illustration: "📞 112 — tísňové volání (obecné)\n🚑 155 — záchranná služba\n🚒 150 — hasiči\n👮 158 — policie" }],
};

function genDigestionOrder(_level: number): PracticeTask[] {
  const chains = [
    { items: ["Ústa", "Jícen", "Žaludek", "Tenké střevo", "Tlusté střevo"], question: "🍽️ Seřaď cestu jídla tělem od začátku:", hints: ["Jídlo začíná v ústech. Kam jde po spolknutí?", "Z úst jde jícnem do žaludku — a pak dál do střev."] },
    { items: ["Sousto jídla", "Žvýkání v ústech", "Polknutí", "Trávení v žaludku", "Vstřebání živin"], question: "🥄 Seřaď, co se děje s jídlem v těle:", hints: ["Nejdřív si jídlo dáš do úst. Co s ním uděláš jako první?", "Po žvýkání polkneš — a v žaludku se jídlo tráví."] },
    { items: ["Nadechnutí nosem", "Vzduch jde průdušnicí", "Vzduch do plic", "Výměna plynů", "Vydechnutí"], question: "🫁 Seřaď, jak probíhá dýchání:", hints: ["Dýchání začíná nosem — nadechneš se. Kam vzduch putuje dál?", "Vzduch jde nosem → průdušnicí → do plic. Tam proběhne výměna a pak vydechneš."] },
    { items: ["Srdce pumpuje krev", "Krev teče tepnami", "Krev přináší kyslík", "Krev se vrací žílami", "Krev zpět do srdce"], question: "❤️ Seřaď cestu krve tělem:", hints: ["Krev začíná svou cestu v srdci. Kam ji srdce pošle?", "Ze srdce teče tepnami, roznáší kyslík a vrací se žílami zpátky."] },
    // Nové řetězce
    { items: ["Jídlo v ústech", "Zuby rozmělní", "Sliny zvlhčí", "Jazyk posune", "Polknutí do jícnu"], question: "👄 Seřaď, co se děje s jídlem v ústech:", hints: ["Jídlo nejdřív rozkousáš zuby. Co dál?", "Zuby → sliny → jazyk → polknutí."] },
    { items: ["Kůže vnímá dotyk", "Nervy vedou signál", "Signál dorazí do mozku", "Mozek vyhodnotí", "Cítíš bolest nebo teplo"], question: "✋ Seřaď cestu signálu od kůže do mozku:", hints: ["Dotkneš se něčeho horkého. Co se stane v těle?", "Kůže → nervy → mozek → pocit."] },
    { items: ["Vidíš jídlo", "Ústa se napustí slinami", "Začneš jíst", "Žaludek začne trávit", "Cítíš sytost"], question: "🍕 Seřaď, co se děje od pohledu na jídlo po sytost:", hints: ["Nejdřív jídlo vidíš a začnou ti téct sliny.", "Vidíš → sliny → jíš → trávíš → cítíš sytost."] },
    { items: ["Nos zachytí vůni", "Signál jde do mozku", "Mozek rozpozná pach", "Reaguješ na vůni"], question: "👃 Seřaď, jak vnímáme vůni:", hints: ["Vůně vstoupí do nosu. Co se stane potom?", "Nos → signál → mozek → poznáš, co to voní."] },
  ];
  return pickRandom(chains, chains.length).map((c) => ({
    question: c.question, correctAnswer: c.items.join(","), items: c.items, hints: c.hints,
  }));
}

const HELP_DIGESTION: HelpData = {
  hint: "Představ si cestu jídla — kam jde po ústech?",
  steps: ["Podívej se na položky — kde to začíná?", "Přemýšlej, co následuje — co se děje dál v těle?", "Seřaď od prvního kroku k poslednímu."],
  commonMistake: "Jícen je PŘED žaludkem, ne za ním!",
  example: "🍽️ Ústa → Jícen → Žaludek → Tenké střevo → Tlusté střevo ✅",
  visualExamples: [{ label: "Cesta jídla", illustration: "👄 Ústa (žvýkání)\n  ↓\n🟤 Jícen (polknutí)\n  ↓\n🟡 Žaludek (trávení)\n  ↓\n🟢 Tenké střevo (živiny)\n  ↓\n🔵 Tlusté střevo (odpad)" }],
};

export const HEALTH_TOPICS: TopicMetadata[] = [
  {
    id: "pr-health", title: "Zdravý životní styl", subject: "prvouka", category: "Člověk a jeho tělo", topic: "Zdraví a hygiena",
    topicDescription: "Zjistíš, co je zdravé, jak se starat o hygienu a co dělat při úrazu.",
    briefDescription: "Zjistíš, proč je důležitý pohyb, zdravé jídlo, spánek a hygiena.",
    keywords: ["zdraví", "zdravý životní styl", "hygiena", "jídlo", "pohyb", "spánek"],
    goals: ["Naučíš se zásady zdravého životního stylu a osobní hygieny."],
    boundaries: ["Pouze základní zásady", "Žádné nemoci a léky"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(HEALTH_QUESTIONS), helpTemplate: HELP_HEALTH,
  },
  {
    id: "pr-first-aid", title: "První pomoc", subject: "prvouka", category: "Člověk a jeho tělo", topic: "Zdraví a hygiena",
    topicDescription: "Zjistíš, co je zdravé, jak se starat o hygienu a co dělat při úrazu.",
    briefDescription: "Naučíš se, co dělat při drobném úrazu a jaká čísla volat v nouzi.",
    keywords: ["první pomoc", "úraz", "nouzové volání", "112", "155", "bezpečnost"],
    goals: ["Naučíš se základy první pomoci a důležitá telefonní čísla."],
    boundaries: ["Pouze jednoduché situace", "Žádné závažné úrazy"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(FIRST_AID_QUESTIONS), helpTemplate: HELP_FIRST_AID,
  },
  {
    id: "pr-digestion-order", title: "Cesta jídla tělem", subject: "prvouka", category: "Člověk a jeho tělo", topic: "Lidské tělo",
    topicDescription: "Poznáš hlavní části a orgány lidského těla a pochopíš, k čemu slouží.",
    briefDescription: "Seřadíš, kudy prochází jídlo, vzduch i krev v lidském těle.",
    keywords: ["trávení", "cesta jídla", "dýchání", "oběh krve", "orgánové soustavy"],
    goals: ["Naučíš se správné pořadí orgánů, kterými prochází jídlo, vzduch i krev."],
    boundaries: ["Pouze zjednodušené soustavy", "Žádné chemické procesy"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "drag_order",
    generator: genDigestionOrder, helpTemplate: HELP_DIGESTION,
  },
];
