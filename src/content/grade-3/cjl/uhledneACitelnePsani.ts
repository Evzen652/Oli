import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[]; e: string }[] = [
  { q: "Proč je důležité psát čitelně?", a: "Aby čtenář mohl přečíst a pochopit text", opts: ["Aby čtenář mohl přečíst a pochopit text", "Aby text byl delší", "Aby bylo méně chyb", "Aby text byl rychlejší"], e: "Když píšeme čitelně, každý kdo to čte (učitel, kamarád, rodič) může snadno pochopit, co jsme napsali. Nečitelný text nikdo nepřečte, takže naše myšlenky zůstanou nepochopeny." },
  { q: "Co patří k úpravě textu?", a: "Okraje, odstavce, nadpis, mezery mezi slovy", opts: ["Okraje, odstavce, nadpis, mezery mezi slovy", "Jen barva inkoustu", "Jen velikost písma", "Jen délka textu"], e: "Úprava textu zahrnuje více věcí najednou — nadpis nám řekne, o čem text je, okraje dělají text přehledným, odstavce oddělují myšlenky a mezery oddělují slova od sebe." },
  { q: "Kdy děláme nový odstavec?", a: "Když začínáme novou myšlenku nebo část textu", opts: ["Když začínáme novou myšlenku nebo část textu", "Po každém slově", "Po každé větě", "Nikdy"], e: "Odstavec je jako 'skupinka' vět, které patří k sobě. Když chceme říct něco nového a jiného, začneme nový odstavec, aby čtenář věděl, že téma se mění." },
  { q: "Co je nadpis?", a: "Název textu, který říká, o čem bude", opts: ["Název textu, který říká, o čem bude", "Poslední věta textu", "Podpis autora", "Datum napsání"], e: "Nadpis stojí na začátku textu a jako 'značka' nám říká, co nás čeká. Třeba nadpis 'Můj pes' hned prozradí, že text bude o psovi — ne o kočce ani o škole." },
  { q: "Jak správně začínáme větu?", a: "Velkým písmenem", opts: ["Velkým písmenem", "Malým písmenem", "Číslem", "Pomlčkou"], e: "Velké písmeno na začátku věty je jako signál čtenáři: 'Tady začíná nová věta!' Díky tomu se text lépe čte a nehledáme, kde jedna věta končí a druhá začíná." },
  { q: "Jak ukončujeme větu?", a: "Tečkou, otazníkem nebo vykřičníkem", opts: ["Tečkou, otazníkem nebo vykřičníkem", "Čárkou", "Středníkem", "Ničím"], e: "Tečka, otazník nebo vykřičník jsou 'stop značky' — říkají čtenáři, že věta skončila. Otazník píšeme, když se ptáme, vykřičník, když chceme zdůraznit, a tečku ve všech ostatních větách." },
  { q: "Jaký okraj necháváme při psaní?", a: "Zleva i zprava (volný okraj na okraji stránky)", opts: ["Zleva i zprava (volný okraj na okraji stránky)", "Žádný okraj", "Jen zprava", "Jen nahoře"], e: "Okraje jsou prázdné místo kolem textu, které text 'orámují'. Díky nim text nevypadá zmačkaně a učitel tam také může psát poznámky nebo opravy." },
  { q: "Proč je lepší psát do řádků (ne nakřivo)?", a: "Text je pak přehledný a čitelný", opts: ["Text je pak přehledný a čitelný", "Je to povinné", "Nakřivo se nepíše kvůli tintě", "Nezáleží na tom"], e: "Když píšeme rovně do řádků, oko čtenáře snadno sleduje text zleva doprava. Nakřivo psaný text nutí čtenáře otáčet hlavou a namáhat oči, takže je čtení obtížné a únavné." },
  { q: "Co je nečitelný rukopis?", a: "Písmo, které nelze přečíst", opts: ["Písmo, které nelze přečíst", "Krásné zdobné písmo", "Rychlé psaní", "Tučné písmo"], e: "Nečitelný rukopis znamená, že písmena jsou tak špatně napsaná, že ani sám autor nepozná, co napsal. Krásné nebo zdobné písmo může být naopak velmi čitelné — záleží na tom, zda se dají rozeznat jednotlivá písmena." },
  { q: "Jak opravíme chybné slovo v textu?", a: "Přeškrtneme jednou čarou a napíšeme správně nad/vedle", opts: ["Přeškrtneme jednou čarou a napíšeme správně nad/vedle", "Celou stránku přepíšeme", "Přelepíme náplastí", "Nic neděláme"], e: "Jedna čára přes chybné slovo je správný způsob opravy — chyba zůstane čitelná (učitel vidí, co tam bylo) a správné slovo je hned vedle. Přepisovat celou stránku kvůli jedné chybě by bylo zbytečné a zdlouhavé." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Čitelný text = každé písmeno je zřetelné, slova oddělená mezerami.", "Úprava = okraje, nadpis, odstavce, čitelnost."],
    explanation: e,
  }));
}

export const UHLEDNEPISANI: TopicMetadata[] = [
  {
    id: "g3-cjl-uhledne-psani",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-psani-uhledne-a-citelne-psani-uprava-textu",
    title: "Úhledné a čitelné psaní, úprava textu",
    studentTitle: "Píšu přehledně",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Psaní",
    briefDescription: "Naučíš se psát čitelně a správně upravovat text.",
    keywords: ["čitelné psaní", "úprava textu", "okraje", "odstavce", "nadpis", "rukopis"],
    goals: ["Psát čitelně s dodržením mezer a okrajů.", "Správně dělit text na odstavce.", "Opravit chybu v textu přehledně."],
    boundaries: ["Základní pravidla úpravy textu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Čitelný text: mezery mezi slovy, přímé řádky, okraje na stránce, odstavce pro nové myšlenky.",
      steps: ["Piš pomalu a zřetelně.", "Nechej okraje.", "Každou novou myšlenku začni na novém řádku (odstavec).", "Po dokončení zkontroluj čitelnost."],
      commonMistake: "Slova bez mezer: 'Jdudoskoly.' → správně: 'Jdu do školy.'",
      example: "Správná úprava: nadpis uprostřed, odstavce odsazené, věty s tečkami, okraje.",
    },
  },
];
