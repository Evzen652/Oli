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
  { question: "Co je první krok trávení v ústech?", correctAnswer: "Rozmělnění zuby a smísení se slinami – začátek trávení škrobů", options: ["Rozmělnění zuby a smísení se slinami (začátek trávení škrobů)", "Vstřebání živin do krve", "Ničení bakterií kyselinou", "Pohyb potravy do žaludku"], hints: ["Sliny obsahují enzym amylázu, která štěpí škrob."] },
  { question: "Jaká kyselina se nachází v žaludku a k čemu slouží?", correctAnswer: "Kyselina chlorovodíková – HCl – ničí bakterie a pomáhá trávit bílkoviny", options: ["Kyselina chlorovodíková (HCl) – ničí bakterie a pomáhá trávit bílkoviny", "Kyselina mléčná pro rozkládání tuků", "Žluč produkovaná žaludkem pro trávení tuků", "Kyselina octová pro konzervaci potravy"], hints: ["pH žaludku je přibližně 2 – velmi kyselé."] },
  { question: "Kde se vstřebávají živiny do krve?", correctAnswer: "V tenkém střevě – přes klky", options: ["V tenkém střevě (přes klky)", "V žaludku", "V tlustém střevě", "V jícnu"], hints: ["Tenké střevo = hlavní vstřebávání. Délka: 6–7 metrů."] },
  { question: "Jakou funkci mají játra v trávení?", correctAnswer: "Produkují žluč – trávení tuků, detoxikují krev a metabolizují živiny", options: ["Produkují žluč (trávení tuků), detoxikují krev a metabolizují živiny", "Tráví bílkoviny pomocí enzymů", "Vstřebávají vodu z zbytků potravy", "Produkují inzulín pro trávení cukrů"], hints: ["Játra jsou největší žlázou v těle."] },
  { question: "Co dělá tlusté střevo?", correctAnswer: "Vstřebává vodu ze zbytků potravy a tvoří výkaly", options: ["Vstřebává vodu ze zbytků potravy a tvoří výkaly", "Vstřebává bílkoviny a cukry", "Produkuje trávicí enzymy", "Ničí bakterie kyselinou"], hints: ["Tlustě střevo = záverečná fáze trávení."] },
  { question: "Co jsou ledviny a jaká je jejich hlavní funkce?", correctAnswer: "Párové orgány filtrující krev a vylučující odpadní látky do moče", options: ["Párové orgány filtrující krev a vylučující odpadní látky do moče", "Orgány produkující trávicí enzymy", "Zásobník pro krev v těle", "Orgány regulující srdeční tep"], hints: ["Ledviny čistí 180 litrů krve denně."] },
  { question: "Jaký odpad vylučují plíce?", correctAnswer: "Oxid uhličitý – CO₂ a vodní páru", options: ["Oxid uhličitý (CO₂) a vodní páru", "Dusíkaté látky", "Kyselinu mléčnou", "Soli a minerály"], hints: ["Vydechuješ CO₂ – produkt buněčného dýchání."] },
  { question: "Co vylučuje kůže?", correctAnswer: "Pot – voda + soli + dusíkaté látky – chlazení a vylučování", options: ["Pot (voda + soli + dusíkaté látky) – chlazení a vylučování", "Pouze CO₂ při pocení", "Kyselinu mléčnou z svalů", "Hormony regulující trávení"], hints: ["Pocení také ochlazuje tělo výparem."] },
  { question: "Co je pankreas (slinivka břišní)?", correctAnswer: "Žláza produkující trávicí enzymy a inzulín – regulace cukru v krvi", options: ["Žláza produkující trávicí enzymy a inzulín (regulace cukru v krvi)", "Součást tenkého střeva vstřebávající tuky", "Orgán filtrující krev jako ledviny", "Záložní játra pro detoxikaci"], hints: ["Inzulín = hormon snižující hladinu cukru v krvi."] },
  { question: "Jak dlouho trvá přejít jídlu celou trávicí soustavou?", correctAnswer: "Přibližně 24–72 hodin – 1–3 dny", options: ["Přibližně 24–72 hodin (1–3 dny)", "Přibližně 2 hodiny", "Přibližně 1 týden", "Přibližně 30 minut"], hints: ["Záleží na složení jídla – tuky a vláknina zpomalují trávení."] },
  { question: "Co je jícen?", correctAnswer: "Trubice vedoucí potravu z úst do žaludku", options: ["Trubice vedoucí potravu z úst do žaludku", "Část tenkého střeva", "Orgán trávící tuky", "Spojení mezi žaludkem a tlustým střevem"], hints: ["Jícen = rychlá trubka pro transport jídla."] },
  { question: "Co způsobuje průjem?", correctAnswer: "Příliš rychlý pohyb potravy tlustým střevem – střevo nestačí vstřebat vodu", options: ["Příliš rychlý pohyb potravy tlustým střevem – střevo nestačí vstřebat vodu", "Příliš mnoho trávicích enzymů v žaludku", "Nedostatek kyseliny v žaludku", "Zánět ledvin způsobující přebytek vody v těle"], hints: ["Průjem = nebezpečí dehydratace, zejména u dětí."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak fungují klky tenkého střeva?", correctAnswer: "Klky – a mikroklky = výrůstky zvyšující povrch tenkého střeva na 200–300 m². Živiny difundují přes tenkou stěnu do krevních kapilár.", options: ["Klky (a mikroklky) = výrůstky zvyšující povrch tenkého střeva na 200–300 m². Živiny difundují přes tenkou stěnu do krevních kapilár.", "Klky rozmělňují potravu mechanicky jako zuby.", "Klky produkují enzymy pro trávení bílkovin.", "Klky jsou bakterie pomáhající s trávením vlákniny."], hints: ["Velký povrch = více místa pro vstřebávání živin."] },
  { question: "Proč játra provádí detoxikaci a co to znamená?", correctAnswer: "Krev z trávicí soustavy jde nejprve do jater. Játra neutralizují toxiny – alkohol, léky, jedy z jídla a přeměňují je na méně škodlivé látky vyloučené žlučí nebo ledvinami.", options: ["Krev z trávicí soustavy jde nejprve do jater. Játra neutralizují toxiny (alkohol, léky, jedy z jídla) a přeměňují je na méně škodlivé látky vyloučené žlučí nebo ledvinami.", "Detoxikace probíhá v ledvinách, ne v játrech.", "Játra detoxikují jen alkohol – jiné toxiny jdou přímo do krve.", "Detoxikace = filtrování krve jako ledviny – játra a ledviny dělají totéž."], hints: ["Portální krevní oběh: střevo → jater → játra → srdce."] },
  { question: "Jak ledviny rozlišují, co z krve vyloučit a co ponechat?", correctAnswer: "Glomeruly filtrují krev – malé molekuly – voda, soli, urea procházejí. Tubuly zpětně vstřebávají užitečné látky – glukózu, vodu – zbytek jde jako moč.", options: ["Glomeruly filtrují krev – malé molekuly (voda, soli, urea) procházejí. Tubuly zpětně vstřebávají užitečné látky (glukózu, vodu) – zbytek jde jako moč.", "Ledviny vylučují vše – tělo pak vstřebá co potřebuje zpět.", "Ledviny filtrují krev chemicky – přidávají enzymy, které ničí toxiny.", "Ledviny vylučují jen ureu – vodu a soli zpracovávají střeva."], hints: ["Nefron = základní filtrační jednotka ledvin."] },
  { question: "Proč je důležité jíst vlákninu?", correctAnswer: "Vláknina urychluje pohyb potravy střevem, krmí střevní bakterie, snižuje cholesterol a zabraňuje zácpě", options: ["Vláknina urychluje pohyb potravy střevem, krmí střevní bakterie, snižuje cholesterol a zabraňuje zácpě", "Vláknina se vstřebává v tenkém střevě jako bílkoviny.", "Vláknina způsobuje průjem, proto je třeba ji omezit.", "Vláknina je zdroj energie – spaluje se v žaludku."], hints: ["Vláknina = nestravitelná složka potravy (zelenina, ovoce, celozrnné)."] },
  { question: "Jak střevní mikrobiom ovlivňuje zdraví?", correctAnswer: "Biliony bakterií v tlustém střevě pomáhají trávit vlákninu, produkují vitamíny – K, B12, chrání před patogeny a ovlivňují imunitu i náladu.", options: ["Biliony bakterií v tlustém střevě pomáhají trávit vlákninu, produkují vitamíny (K, B12), chrání před patogeny a ovlivňují imunitu i náladu.", "Střevní bakterie jsou škodlivé – způsobují infekce.", "Střevní mikrobiom ovlivňuje jen trávení tuků.", "Střevo je sterilní – bakterie v něm způsobují nemoci."], hints: ["Střevní mikrobiom = 1,5–2 kg bakterií v tlustém střevě."] },
  { question: "Jak diabetes (cukrovka) narušuje trávení a vylučování?", correctAnswer: "Bez dostatku inzulínu – pankreas nemůže glukóza vstoupit do buněk → hromadí se v krvi → ledviny ji vylučují do moče – glukóza v moči → nadměrné vylučování moče.", options: ["Bez dostatku inzulínu (pankreas) nemůže glukóza vstoupit do buněk → hromadí se v krvi → ledviny ji vylučují do moče (glukóza v moči) → nadměrné vylučování moče.", "Cukrovka ovlivňuje jen trávení škrobů – ostatní živiny nejsou postiženy.", "Inzulín produkují ledviny – jejich porucha způsobuje cukrovku.", "Diabetes způsobuje, že játra přestávají metabolizovat glukózu."], hints: ["Diabetes mellitus = cukrová nemoc. Inzulín = hormon z pankreatu."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč se po tučném jídle cítíme déle sytí než po sladkém?", correctAnswer: "Tuky se tráví nejpomaleji – lipázy v tenkém střevě, žluč emulguje. Cukry se vstřebají rychle → rychlý pokles glykémie → hlad. Tuky udržují sytost déle.", options: ["Tuky se tráví nejpomaleji (lipázy v tenkém střevě, žluč emulguje). Cukry se vstřebají rychle → rychlý pokles glykémie → hlad. Tuky udržují sytost déle.", "Tučné jídlo obsahuje více kalorií – proto nasytí více.", "Cukry zastavují trávení a způsobují sytost.", "Bílkoviny způsobují sytost – tuk i cukry jsou stejně rychlé."], hints: ["Glykemický index = rychlost vzestupu cukru v krvi po jídle."] },
  { question: "Jak alkohol poškozuje játra?", correctAnswer: "Alkohol je pro játra prioritní toxin – metabolizují ho přednostně. Chronické přetěžování → zánět – hepatitida → jizevnatá tkáň – cirhóza → jaterní selhání.", options: ["Alkohol je pro játra prioritní toxin – metabolizují ho přednostně. Chronické přetěžování → zánět (hepatitida) → jizevnatá tkáň (cirhóza) → jaterní selhání.", "Alkohol poškozuje ledviny, ne játra.", "Alkohol se metabolizuje v žaludku – játra nejsou zatížena.", "Játra zpracovávají alkohol bez problémů – poškozují se jen plíce."], hints: ["Cirhóza jater = nezvratné poškození jaterní tkáně."] },
  { question: "Proč dialýza (umělá ledvina) je záchranou při selhání ledvin?", correctAnswer: "Dialyzační přístroj filtruje krev umělou membránou – odstraňuje ureu, přebytek solí a vody, které zdravé ledviny normálně vylučují. Pacient musí na dialýzu 3× týdně.", options: ["Dialyzační přístroj filtruje krev umělou membránou – odstraňuje ureu, přebytek solí a vody, které zdravé ledviny normálně vylučují. Pacient musí na dialýzu 3× týdně.", "Dialýza léčí ledviny a obnovuje jejich funkci.", "Dialýza je záložní metoda pro játra při jejich selhání.", "Dialýza je umělé trávení pro lidi, kteří nemohou jíst."], hints: ["Urea = hlavní odpadní látka z metabolismu bílkovin."] },
  { question: "Jak střevní bakterie ovlivňují duševní zdraví?", correctAnswer: "Střevo-mozková osa: bakterie produkují neurotransmitery – serotonin, dopamin přes bloudivý nerv. Stav mikrobiomu ovlivňuje náladu, úzkost a koncentraci.", options: ["Střevo-mozková osa: bakterie produkují neurotransmitery (serotonin, dopamin) přes bloudivý nerv. Stav mikrobiomu ovlivňuje náladu, úzkost a koncentraci.", "Střevo a mozek spolu nekomunikují – jsou odděleny hematoencefalickou bariérou.", "Střevní bakterie ovlivňují jen fyzické zdraví – duševní závisí na mozku.", "Serotonin se tvoří jen v mozku – střevo ho produkovat neumí."], hints: ["90 % serotoninu (hormonu štěstí) se tvoří ve střevě."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const TRAVICISOUSTAVAVYLUCOVACISOUSTAVA: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava",
    title: "Trávicí soustava, vylučovací soustava",
    studentTitle: "Trávení a ledviny",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo - soustavy",
    briefDescription: "Pochopíš, jak tělo zpracovává jídlo a zbavuje se odpadů.",
    keywords: ["trávení", "žaludek", "střevo", "játra", "ledviny", "enzymy", "vstřebávání", "vylučování"],
    goals: ["Popsat cestu potravy trávicí soustavou", "Vysvětlit funkce jater a pankreatu", "Popsat vylučovací orgány a jejich funkce"],
    boundaries: ["Neprobírá biochemii enzymů do hloubky", "Neprobírá trávicí choroby"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Trávicí cesta: ústa → jícen → žaludek → tenké střevo → tlusté střevo. Vylučování: ledviny (moč), plíce (CO₂), kůže (pot).",
      steps: [
        "1. Ústa: zuby + sliny (enzymy).",
        "2. Žaludek: HCl + enzymy.",
        "3. Tenké střevo: vstřebávání živin přes klky.",
        "4. Tlusté střevo: vstřebávání vody, tvorba výkalů.",
        "5. Vylučovací: ledviny (moč), plíce (CO₂), kůže (pot).",
      ],
      commonMistake: "Inzulín produkuje SLINIVKA (pankreas), ne játra. Játra produkují ŽLUČ.",
      example: "Jablko: ústy rozmělněno, žaludkem natráveno, střevem vstřebáno, zbytek vyloučen.",
    },
  },
];
