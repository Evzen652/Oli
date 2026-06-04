import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[] }[] = [
  { q: "Proč je důležité psát čitelně?", a: "Aby čtenář mohl přečíst a pochopit text", opts: ["Aby čtenář mohl přečíst a pochopit text", "Aby text byl delší", "Aby bylo méně chyb", "Aby text byl rychlejší"] },
  { q: "Co patří k úpravě textu?", a: "Okraje, odstavce, nadpis, mezery mezi slovy", opts: ["Okraje, odstavce, nadpis, mezery mezi slovy", "Jen barva inkoustu", "Jen velikost písma", "Jen délka textu"] },
  { q: "Kdy děláme nový odstavec?", a: "Když začínáme novou myšlenku nebo část textu", opts: ["Když začínáme novou myšlenku nebo část textu", "Po každém slově", "Po každé větě", "Nikdy"] },
  { q: "Co je nadpis?", a: "Název textu, který říká, o čem bude", opts: ["Název textu, který říká, o čem bude", "Poslední věta textu", "Podpis autora", "Datum napsání"] },
  { q: "Jak správně začínáme větu?", a: "Velkým písmenem", opts: ["Velkým písmenem", "Malým písmenem", "Číslem", "Pomlčkou"] },
  { q: "Jak ukončujeme větu?", a: "Tečkou, otazníkem nebo vykřičníkem", opts: ["Tečkou, otazníkem nebo vykřičníkem", "Čárkou", "Středníkem", "Ničím"] },
  { q: "Jaký okraj necháváme při psaní?", a: "Zleva i zprava (volný okraj na okraji stránky)", opts: ["Zleva i zprava (volný okraj na okraji stránky)", "Žádný okraj", "Jen zprava", "Jen nahoře"] },
  { q: "Proč je lepší psát do řádků (ne nakřivo)?", a: "Text je pak přehledný a čitelný", opts: ["Text je pak přehledný a čitelný", "Je to povinné", "Nakřivo se nepíše kvůli tintě", "Nezáleží na tom"] },
  { q: "Co je nečitelný rukopis?", a: "Písmo, které nelze přečíst", opts: ["Písmo, které nelze přečíst", "Krásné zdobné písmo", "Rychlé psaní", "Tučné písmo"] },
  { q: "Jak opravíme chybné slovo v textu?", a: "Přeškrtneme jednou čarou a napíšeme správně nad/vedle", opts: ["Přeškrtneme jednou čarou a napíšeme správně nad/vedle", "Celou stránku přepíšeme", "Přelepíme náplastí", "Nic neděláme"] },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Čitelný text = každé písmeno je zřetelné, slova oddělená mezerami.", "Úprava = okraje, nadpis, odstavce, čitelnost."],
    solutionSteps: [`Odpověď: ${a}`],
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
