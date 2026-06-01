import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Jaký žánr je text o lišce a hroznovém víně?", a: "bajka", opts: ["bajka", "pohádka", "pověst", "povídka"] },
  { q: "Co je charakteristické pro pohádku?", a: "Nadpřirozené bytosti, dobro vítězí, vymyšlené, 'Byl jednou jeden...'", opts: ["Nadpřirozené bytosti, dobro vítězí, vymyšlené, 'Byl jednou jeden...'", "Váže se na skutečné místo, historický základ", "Zvířata jako lidé, morální ponaučení", "Reálné postavy, krátký příběh"] },
  { q: "Co je charakteristické pro pověst?", a: "Váže se na skutečné místo nebo osobu, historický základ", opts: ["Váže se na skutečné místo nebo osobu, historický základ", "Nadpřirozené bytosti, dobro vítězí", "Zvířata jako lidé, morální ponaučení", "Reálné postavy, krátký příběh"] },
  { q: "Co je charakteristické pro bajku?", a: "Zvířata jako lidé, morální ponaučení na konci", opts: ["Zvířata jako lidé, morální ponaučení na konci", "Nadpřirozené bytosti", "Historický základ", "Reálné postavy z každodenního života"] },
  { q: "Co je charakteristické pro povídku?", a: "Kratší próza, reálné postavy a děj, jeden příběh", opts: ["Kratší próza, reálné postavy a děj, jeden příběh", "Nadpřirozené bytosti", "Morální ponaučení", "Historický základ a skutečné místo"] },
  { q: "Ezop byl starořecký autor:", a: "bajek", opts: ["bajek", "pohádek", "pověstí", "povídek"] },
  { q: "Alois Jirásek napsal:", a: "Staré pověsti české", opts: ["Staré pověsti české", "pohádky pro děti", "bajky o zvířatech", "detektivní povídky"] },
  { q: "Pohádka začíná typicky:", a: "Byl jednou jeden...", opts: ["Byl jednou jeden...", "Vím, že bylo skutečně...", "Liška říkala vraně...", "V naší třídě žil..."] },
  { q: "Bajka o havranovi a lišce učí:", a: "morální ponaučení — nebýt marnivý nebo pozor na lichocení", opts: ["morální ponaučení — nebýt marnivý nebo pozor na lichocení", "historický příběh o lišce", "pohádkový příběh o dobru a zlu", "příběh z reálného života"] },
  { q: "Pověst 'Libuše a Přemysl' je příkladem:", a: "pověsti (historický základ, skutečné místo — Čechy)", opts: ["pověsti (historický základ, skutečné místo — Čechy)", "pohádky", "bajky", "povídky"] },
  { q: "Co je ponaučení (morál) bajky?", a: "Závěrečná věta říkající, co bychom se měli naučit", opts: ["Závěrečná věta říkající, co bychom se měli naučit", "Začátek bajky s uvedením postav", "Popis prostředí", "Přímá řeč zvířat"] },
  { q: "Karel Čapek napsal:", a: "Povídky, romány (detektivky, sci-fi)", opts: ["Povídky, romány (detektivky, sci-fi)", "bajky", "staré pověsti", "pohádky s draky"] },
  { q: "Co je typické pro pohádkové prostředí?", a: "Věci se mění kouzlem, draci, víly, trpaslíci", opts: ["Věci se mění kouzlem, draci, víly, trpaslíci", "Reálná moderní Česká republika", "Historický hrad se skutečným panovníkem", "Zvířata mluví jako lidé"] },
  { q: "Jak se liší pohádka od pověsti?", a: "Pohádka = zcela vymyšlená; pověst = historický základ", opts: ["Pohádka = zcela vymyšlená; pověst = historický základ", "Pohádka má historický základ; pověst je vymyšlená", "Jsou to stejné žánry", "Pohádka má ponaučení; pověst ne"] },
  { q: "La Fontaine byl francouzský autor:", a: "bajek", opts: ["bajek", "pohádek", "pověstí", "románů"] },
  { q: "Bajka 'Liška a vrána' — kdo jsou postavy?", a: "zvířata, která jednají jako lidé", opts: ["zvířata, která jednají jako lidé", "historické osoby", "pohádkové bytosti", "reálné moderní postavy"] },
];

const POOL_L2: QA[] = [
  { q: "Urči žánr: 'V pradávných časech žil na Vyšehradě moudrý kníže Krok, otec tří dcer...'", a: "pověst (historické místo — Vyšehrad)", opts: ["pověst (historické místo — Vyšehrad)", "pohádka", "bajka", "povídka"] },
  { q: "Urči žánr: 'Jednoho dne se liška procházela lesem a spatřila hrozny. Přemýšlela, jak se k nim dostat...'", a: "bajka (zvíře s lidskými vlastnostmi, bude ponaučení)", opts: ["bajka (zvíře s lidskými vlastnostmi, bude ponaučení)", "pohádka", "pověst", "povídka"] },
  { q: "Urči žánr: 'V malém horském městě žila žena, která každý rok v zimě pletla svetry pro sousedy...'", a: "povídka (reálné prostředí, reálné postavy)", opts: ["povídka (reálné prostředí, reálné postavy)", "pohádka", "bajka", "pověst"] },
  { q: "Urči žánr: 'Za devatero horami žila princezna uvězněná v temné věži. Každou noc ji hlídal drak...'", a: "pohádka (nadpřirozené bytosti, za devatero horami)", opts: ["pohádka (nadpřirozené bytosti, za devatero horami)", "pověst", "bajka", "povídka"] },
  { q: "Co mají bajka a pohádka společného?", a: "Obě mají prvky fantazie a jsou vymyšlené", opts: ["Obě mají prvky fantazie a jsou vymyšlené", "Obě mají historický základ", "Obě mají jen reálné postavy", "Obě se odehrávají v moderní době"] },
  { q: "Co mají pověst a historický román společného?", a: "Obě vychází z historických událostí a osob", opts: ["Obě vychází z historických událostí a osob", "Obě jsou vymyšlené", "Obě mají zvířecí postavy", "Obě mají pohádkové bytosti"] },
  { q: "Krylov byl ruský autor:", a: "bajek", opts: ["bajek", "pohádek", "pověstí", "románů"] },
  { q: "Jak bajka poučuje čtenáře?", a: "Na konci přímo říká morální ponaučení (záměrně)", opts: ["Na konci přímo říká morální ponaučení (záměrně)", "Pomocí kouzelného řešení", "Skrytě přes postavu knížete", "Prostřednictvím nadpřirozených bytostí"] },
  { q: "Pověst 'Blaničtí rytíři' — co je historický základ?", a: "Rytíři čekající v hoře Blaník — symbol národní naděje", opts: ["Rytíři čekající v hoře Blaník — symbol národní naděje", "Pohádkový hrad s drakem", "Liška a havran v lese", "Moderní česká vesnice"] },
  { q: "Povídka se od románu liší:", a: "Je kratší a soustředí se na jeden příběh nebo moment", opts: ["Je kratší a soustředí se na jeden příběh nebo moment", "Je delší a podrobnější", "Má více postav", "Je vždy pro děti"] },
  { q: "Bajka 'Moucha a vůz' — jaká je morálka?", a: "Ten, kdo nepracuje, si přisuzuje zásluhy jiných", opts: ["Ten, kdo nepracuje, si přisuzuje zásluhy jiných", "Koně jsou silnější než mouchy", "Vozy jezdí rychle", "Mouchy jsou chytré"] },
  { q: "Co je zvláštní na pohádkové logice?", a: "Věci fungují jinak než v reálném světě (kouzla, mluvící zvířata)", opts: ["Věci fungují jinak než v reálném světě (kouzla, mluvící zvířata)", "Vše je realistické a vědecky vysvětlitelné", "Vždy skončí smutně", "Nikdy se neobjevují lidé"] },
  { q: "Urči žánr: Příběh o Honzovi, který dostane tři zlaté vlasy čerta.", a: "pohádka (nadpřirozené prvky, pohádkový Honza)", opts: ["pohádka (nadpřirozené prvky, pohádkový Honza)", "pověst", "bajka", "povídka"] },
  { q: "Pověst se od pohádky liší tím, že:", a: "Pověst má základ v historii nebo skutečném místě", opts: ["Pověst má základ v historii nebo skutečném místě", "Pověst je vždy kratší", "Pověst má vždy zvířata", "Pověst vždy skončí šťastně"] },
  { q: "Povídka se od bajky liší tím, že:", a: "Povídka má reálné postavy, bajka zvířata s morálním ponaučením", opts: ["Povídka má reálné postavy, bajka zvířata s morálním ponaučením", "Jsou to stejné žánry", "Povídka má ponaučení, bajka ne", "Bajka je delší než povídka"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Pohádka = nadpřirozené bytosti, dobro vítězí, zcela vymyšlená",
      "Pověst = historický základ, skutečné místo nebo osoba",
      "Bajka = zvířata jako lidé, morální ponaučení na konci",
      "Povídka = kratší próza, reálné postavy, jeden příběh",
    ],
    solutionSteps: [
      "Jsou v textu nadpřirozené bytosti (draci, víly)? → pohádka",
      "Váže se na skutečné místo nebo historii? → pověst",
      "Jednají zvířata jako lidé a je na konci ponaučení? → bajka",
      "Jsou reálné postavy bez fantazie? → povídka",
    ],
  }));
}

export const POHADKAPOVESTBAJKAPOVIDKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
    rvpNodeId: "g4-cjl-literarni-vychova-literarni-pojmy-a-zanry-pohadka-povest-bajka-povidka",
    title: "Pohádka, pověst, bajka, povídka",
    studentTitle: "Literární žánry",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Poznáš rozdíl mezi pohádkou, pověstí, bajkou a povídkou.",
    keywords: ["pohádka", "pověst", "bajka", "povídka", "literární žánr", "Ezop", "Jirásek"],
    goals: [
      "Rozlišit literární žánry: pohádku, pověst, bajku, povídku",
      "Přiřadit text k správnému žánru",
    ],
    boundaries: ["Bez románu a novely", "Bez dramatických žánrů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Pohádka=draci+víly; Pověst=historické místo+osoby; Bajka=zvířata+ponaučení; Povídka=reální lidé+jeden příběh",
      steps: [
        "Jsou nadpřirozené bytosti? → pohádka",
        "Historické místo nebo osoby? → pověst",
        "Zvířata jako lidé + morál na konci? → bajka",
        "Reální lidé, žádná fantazie? → povídka",
      ],
      commonMistake: "Záměna pohádky a bajky — bajka má vždy morální ponaučení na konci",
      example: "Liška a hrozny (Ezop) = bajka; Libuše (Jirásek) = pověst; Červená Karkulka = pohádka",
    },
  },
];
