import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: PracticeTask[] = [
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Rozkládá bílkoviny kyselinou HCl" },
      { left: "Tenké střevo", right: "Vstřebává živiny do krve přes klky" },
      { left: "Játra", right: "Produkují žluč a detoxikují krev" },
      { left: "Slinivka (pankreas)", right: "Produkuje trávicí enzymy a inzulín" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Ústa", right: "Rozmělnění zuby, sliny štěpí škrob" },
      { left: "Jícen", right: "Vede potravu z úst do žaludku" },
      { left: "Tlusté střevo", right: "Vstřebává vodu, tvoří výkaly" },
      { left: "Konečník", right: "Uchovává a vylučuje výkaly" },
    ],
  },
  {
    question: "Spoj orgán s jeho vylučovací funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Ledviny", right: "Filtrují krev a tvoří moč" },
      { left: "Plíce", right: "Vydechují CO₂ a vodní páru" },
      { left: "Kůže (pot)", right: "Vylučují vodu, soli a dusíkaté látky" },
      { left: "Játra (žluč)", right: "Vylučují odpadní produkty rozkladu hemoglobinu" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Churning – míchání a trávení bílkovin" },
      { left: "Tenké střevo", right: "Finální trávení tuků, cukrů, bílkovin" },
      { left: "Slinivka", right: "Enzymy do střeva + inzulín do krve" },
      { left: "Žlučník", right: "Zásobník žluče" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Sliny", right: "Zvlhčují potravu a štěpí škrob (amyláza)" },
      { left: "Pepsin", right: "Enzym žaludku štěpící bílkoviny" },
      { left: "Žluč", right: "Emulguje tuky (produkují ji játra)" },
      { left: "Klky střeva", right: "Zvyšují plochu pro vstřebávání živin" },
    ],
  },
  {
    question: "Spoj orgán s jeho vylučovací nebo regulační funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Ledviny", right: "Regulují množství vody a solí v těle" },
      { left: "Plíce", right: "Udržují pH krve výdejem CO₂" },
      { left: "Inzulín", right: "Snižuje hladinu glukózy v krvi" },
      { left: "Glukagon", right: "Zvyšuje hladinu glukózy v krvi" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Ústa", right: "Mechanické a enzymatické trávení škrobu" },
      { left: "Žaludek", right: "Kyselé prostředí (pH 2) – trávení bílkovin" },
      { left: "Tenké střevo", right: "Enzymatické trávení a vstřebávání živin" },
      { left: "Tlusté střevo", right: "Vstřebávání vody a tvorba výkalů" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Játra", right: "Metabolizují živiny, produkují žluč, detoxikují" },
      { left: "Slinivka", right: "Enzymy (lipáza, amyláza, proteáza) + inzulín" },
      { left: "Žlučník", right: "Uchovává žluč a uvolňuje ji do střeva" },
      { left: "Dvanáctník", right: "První část tenkého střeva přijímá enzymy" },
    ],
  },
  {
    question: "Spoj orgán s jeho vylučovací funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Ledviny", right: "Odstraňují ureu, přebytek solí a vody" },
      { left: "Kůže", right: "Potní žlázy vylučují pot a ochlazují tělo" },
      { left: "Plíce", right: "Vydechují CO₂ (odpad buněčného dýchání)" },
      { left: "Játra", right: "Vylučují odpadní látky žlučí do střeva" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Promíchává potravu a tráví kyselinou" },
      { left: "Tenké střevo", right: "Vstřebává glukózu, aminokyseliny, vitamíny" },
      { left: "Tlusté střevo", right: "Vstřebává vodu, střevní bakterie pomáhají" },
      { left: "Konečník", right: "Ukládá výkaly do vyprázdnění" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím nebo vylučovacím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Kyselinou HCl tráví bílkoviny" },
      { left: "Ledviny", right: "Filtrují krev a tvoří moč" },
      { left: "Játra", right: "Produkují žluč, detoxikují krev" },
      { left: "Slinivka", right: "Produkují trávicí enzymy a inzulín" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Ledviny", right: "Filtrují krev a vylučují moč" },
      { left: "Játra", right: "Metabolické centrum – detoxikace, žluč" },
      { left: "Tenké střevo", right: "Vstřebávání živin přes klky" },
      { left: "Tlusté střevo", right: "Vstřebávání vody, formování výkalů" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Mechanické a chemické trávení jídla" },
      { left: "Jícen", right: "Transport potravy do žaludku" },
      { left: "Dvanáctník", right: "Přijímá žluč a enzymy ze slinivky" },
      { left: "Slepé střevo (appendix)", right: "Pozůstatek, imunitní funkce" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Ústa", right: "Začátek trávení – zuby a sliny" },
      { left: "Žaludek", right: "Kyselé trávení bílkovin" },
      { left: "Tenké střevo", right: "Vstřebávání živin do krve" },
      { left: "Ledviny", right: "Vylučování odpadních látek z krve" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Glomerulus ledviny", right: "Filtruje krev – malé molekuly procházejí" },
      { left: "Tubulus ledviny", right: "Zpětně vstřebává glukózu a vodu" },
      { left: "Ureter", right: "Vede moč z ledviny do močového měchýře" },
      { left: "Močový měchýř", right: "Ukládá moč do vyprázdnění" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Rozkládá bílkoviny kyselinou a enzymy" },
      { left: "Tenké střevo", right: "Vstřebání cukrů, tuků, bílkovin" },
      { left: "Slinivka", right: "Enzymy do střeva, inzulín do krve" },
      { left: "Játra", right: "Detoxikace a tvorba žluče" },
    ],
  },
  {
    question: "Spoj orgán s jeho vylučovací funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Ledviny", right: "Tvoří moč – odstraňují ureu a soli" },
      { left: "Plíce", right: "Vylučují CO₂ výdechem" },
      { left: "Kůže", right: "Vylučují pot – vodu, soli, dusíkaté látky" },
      { left: "Játra", right: "Vylučují bilirubin do žluče" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Sliny (amyláza)", right: "Štěpí škrob v ústech na cukry" },
      { left: "HCl v žaludku", right: "Ničí bakterie a aktivuje pepsiny" },
      { left: "Lipáza (slinivka)", right: "Štěpí tuky na mastné kyseliny" },
      { left: "Střevní klky", right: "Mnohonásobně zvyšují plochu vstřebávání" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Kyselé prostředí rozkladu bílkovin" },
      { left: "Duodenum (dvanáctník)", right: "Přijímá trávicí šťávy ze slinivky a jater" },
      { left: "Jejunum (lačník)", right: "Hlavní část tenkého střeva pro vstřebávání" },
      { left: "Ileum (kyčelník)", right: "Vstřebává vitamín B12 a žlučové kyseliny" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Ledviny", right: "Filtrují 180 litrů krve denně" },
      { left: "Játra", right: "Metabolizují živiny po vstřebání ze střeva" },
      { left: "Slinivka", right: "Produkují enzymy i hormony (inzulín)" },
      { left: "Žlučník", right: "Zásobník a rezervoár žluče" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Trávení bílkovin kyselinou a enzymy" },
      { left: "Tlusté střevo", right: "Vstřebávání vody, střevní mikrobiom" },
      { left: "Játra", right: "Detoxikace + tvorba žluče" },
      { left: "Slinivka", right: "Enzymy (štěpení) + inzulín (regulace)" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Míchá a tráví potravu HCl a pepsimy" },
      { left: "Tenké střevo", right: "Vstřebává živiny do krve a lymfy" },
      { left: "Ledviny", right: "Odstraňují odpadní látky z krve do moče" },
      { left: "Kůže", right: "Vylučuje pot a ochlazuje tělo" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Ústa", right: "Mechanické a chemické trávení" },
      { left: "Jícen", right: "Peristaltika – posun potravy do žaludku" },
      { left: "Žaludek", right: "Kyselé trávení" },
      { left: "Tenké střevo", right: "Vstřebávání živin přes klky" },
    ],
  },
  {
    question: "Spoj orgán s jeho vylučovací nebo metabolickou funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Ledviny", right: "Filtrují krev a regulují složení moče" },
      { left: "Játra", right: "Metabolizují léky, alkohol a toxiny" },
      { left: "Plíce", right: "Vydechují odpadní CO₂" },
      { left: "Kůže (pot)", right: "Vylučují přebytek solí a vody" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím nebo vylučovacím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Rozkládá bílkoviny" },
      { left: "Tenké střevo", right: "Vstřebává živiny" },
      { left: "Tlusté střevo", right: "Vstřebává vodu" },
      { left: "Ledviny", right: "Vylučují dusíkaté odpadní látky" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Rozkládá bílkoviny kyselinou HCl" },
      { left: "Játra", right: "Produkují žluč k emulgaci tuků" },
      { left: "Slinivka", right: "Enzym lipáza štěpí tuky ve střevě" },
      { left: "Tenké střevo", right: "Vstřebává tuky přes lymfatické cévy" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím nebo vylučovacím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Trávení bílkovin" },
      { left: "Tenké střevo", right: "Vstřebávání živin" },
      { left: "Ledviny", right: "Filtrování krve a tvorba moče" },
      { left: "Játra", right: "Detoxikace a tvorba žluče" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Zuby", right: "Mechanické rozmělnění potravy" },
      { left: "Sliny", right: "Enzymatické štěpení škrobu v ústech" },
      { left: "Žaludek", right: "Chemické trávení bílkovin kyselinou" },
      { left: "Klky tenkého střeva", right: "Vstřebávání živin do krve" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím nebo vylučovacím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Ústa", right: "Přijímání a první trávení potravy" },
      { left: "Žaludek", right: "Kyselé trávení bílkovin" },
      { left: "Tenké střevo", right: "Vstřebávání živin do krve" },
      { left: "Ledviny", right: "Vylučování dusíkatého odpadu (urea)" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v trávicím procesu.",
    correctAnswer: "match",
    pairs: [
      { left: "Žaludek", right: "Rozkládá bílkoviny kyselinou a enzymy" },
      { left: "Tenké střevo", right: "Vstřebává živiny do krve" },
      { left: "Tlusté střevo", right: "Vstřebává vodu ze zbytků potravy" },
      { left: "Ledviny", right: "Čistí krev a vylučují odpad moč" },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
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
    inputType: "match_pairs",
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
