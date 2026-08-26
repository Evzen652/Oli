import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TEXTY = [
  {
    text: "Velryby jsou největší savci na světě. Žijí v oceánech. Přestože jsou obrovské, živí se drobnými krevetami zvanými kril. Velryba může být až 30 metrů dlouhá.",
    otazky: [
      { q: "Jaká jsou klíčová slova v textu o velrybách?", a: "velryba, savec, oceán, kril, 30 metrů", opts: ["velryba, savec, oceán, kril, 30 metrů", "voda, ryba, moře, jídlo, malý", "zvíře, velké, plout, žít, jíst", "savec, kočka, pes, oceán, velký"], e: "Klíčová slova jsou ta nejdůležitější — říkají, o kom text je (velryba, savec), kde žije (oceán), co jí (kril) a jak je velká (30 metrů). Slova jako 'jsou' nebo 'živí se' jsou jen pomocná a klíčová nejsou." },
      { q: "Čím se živí velryby?", a: "Drobnými krevetami zvanými kril", opts: ["Drobnými krevetami zvanými kril", "Rybami", "Mořskými řasami", "Medúzami"], e: "Text přímo říká, že velryby se živí drobnými krevetami zvanými kril — to je překvapivé, protože jsou tak obrovské, ale jedí tak malé živočichy." },
      { q: "Jak velká může být velryba?", a: "Až 30 metrů", opts: ["Až 30 metrů", "Až 10 metrů", "Až 100 metrů", "Až 5 metrů"], e: "V textu stojí přímo: 'Velryba může být až 30 metrů dlouhá.' To je jako tři školní autobusy za sebou!" },
    ],
  },
  {
    text: "Slunečnice je vysoká rostlina s velkým žlutým květem. Roste na slunci. Semena slunečnice se lisují na olej. Slunečnicový olej se používá v kuchyni při vaření.",
    otazky: [
      { q: "Jaká jsou klíčová slova v textu?", a: "slunečnice, květ, semena, olej, vaření", opts: ["slunečnice, květ, semena, olej, vaření", "louka, tráva, voda, stromy, zelenina", "barva, žlutá, velká, roste, kvete", "zahrada, plevel, květ, list, kůra"], e: "Klíčová slova jsou ta, která celý text vystihují — o čem je (slunečnice, květ), co se z ní vyrábí (semena, olej) a k čemu to slouží (vaření). Slova jako 'vysoká' nebo 'žlutý' jsou jen popis, ne hlavní téma." },
      { q: "K čemu se používá slunečnicový olej?", a: "V kuchyni při vaření", opts: ["V kuchyni při vaření", "Na svícení", "Jako lék", "Na mazání kola"], e: "Text říká přímo: 'Slunečnicový olej se používá v kuchyni při vaření.' Určitě jsi ho viděl nebo viděla doma — maminky ho přidávají do pánve při smažení." },
      { q: "Co se lisuje ze semen slunečnice?", a: "Olej", opts: ["Olej", "Mouka", "Cukr", "Med"], e: "V textu stojí: 'Semena slunečnice se lisují na olej.' Mouka se mele z obilí, cukr se vyrábí z cukrové řepy a med dělají včely — to vše je jiný zdroj." },
    ],
  },
];

const TEXT_L3 = {
  text: "Mravenci žijí ve velkých skupinách zvaných mraveniště. Jeden mraveniště může mít až milion mravenců. Mravenci si mezi sebou rozdělují práci — jedni hledají potravu, jiní hlídají mraveniště a královna klade vajíčka. Mravenec dokáže unést předmět, který je až 50krát těžší než on sám.",
  otazky: [
    { q: "Jaká jsou klíčová slova v textu o mravencích?", a: "mravenec, mraveniště, práce, královna, milion", opts: ["mravenec, mraveniště, práce, královna, milion", "hmyz, louka, tráva, léto", "zvíře, malý, silný, rychlý", "královna, král, princ, hrad"], e: "Klíčová slova vystihují téma textu: mravenec a mraveniště (o kom a kde), práce (dělba práce) a královna (role v mraveništi). Slova jako 'král' nebo 'hrad' evokují pohádku, ne fakta o mravencích." },
    { q: "Kolik mravenců může mít jedno mraveniště?", a: "Až milion", opts: ["Až milion", "Až tisíc", "Až sto", "Až deset tisíc"], e: "Text uvádí přímo: 'Jeden mraveniště může mít až milion mravenců.'" },
    { q: "Kolikrát těžší předmět dokáže mravenec unést, než sám váží?", a: "Až 50krát", opts: ["Až 50krát", "Až 5krát", "Až 500krát", "Až 15krát"], e: "Text říká: 'Mravenec dokáže unést předmět, který je až 50krát těžší než on sám.'" },
    { q: "Které tvrzení text NEPODPORUJE?", a: "Mravenci žijí sami, ne ve skupinách", opts: ["Mravenci žijí sami, ne ve skupinách", "V mraveništi může být až milion mravenců", "Královna klade vajíčka", "Mravenci si dělí práci"], e: "Text naopak říká, že mravenci žijí ve velkých skupinách zvaných mraveniště — tvrzení, že žijí sami, textu odporuje." },
    { q: "Pokud by dítě o hmotnosti 30 kg dokázalo unést 50krát víc, než samo váží (jako mravenec), kolik kilogramů by to bylo?", a: "1500 kg", opts: ["1500 kg", "150 kg", "500 kg", "5000 kg"], e: "30 kg × 50 = 1500 kg. Spojili jsme fakt z textu (50krát víc) s novým číslem (30 kg), abychom vypočítali odpověď." },
  ],
};

const TEORIE_L3: { q: string; a: string; opts: string[]; e: string }[] = [
  { q: "Jak nejrychleji najdeš konkrétní číslo v dlouhém textu?", a: "Přeletíš očima text a hledáš čísla nebo klíčová slova okolo nich", opts: ["Přeletíš očima text a hledáš čísla nebo klíčová slova okolo nich", "Čteš text odzadu", "Počítáš písmena v každém slově", "Hledáš nejdelší větu v textu"], e: "Při hledání konkrétního čísla nemusíme číst každé slovo — stačí přelétnout text očima a všímat si čísel a slov kolem nich." },
  { q: "Text má nadpis 'Mravenci'. Co ti nadpis prozradí ještě předtím, než začneš číst?", a: "Hlavní téma textu", opts: ["Hlavní téma textu", "Přesný počet mravenců", "Autora textu", "Kolik má text vět"], e: "Nadpis obvykle prozradí hlavní téma, o kterém text bude — v tomto případě že text je o mravencích. Konkrétní čísla nebo autora z něj nezjistíme." },
  { q: "Když najdeš v textu dvě různé informace o stejném tématu, co s nimi uděláš, abys odpověděl na složitější otázku?", a: "Spojíš je dohromady a odvodíš odpověď", opts: ["Spojíš je dohromady a odvodíš odpověď", "Použiješ jen tu první", "Použiješ jen tu poslední", "Obě zahodíš, protože jsou dvě"], e: "Někdy odpověď nenajdeme v jedné větě — musíme spojit dvě informace z textu dohromady, abychom si odpověď odvodili." },
  { q: "Proč je důležité ověřit, že nalezená informace opravdu odpovídá na otázku, ne jen že obsahuje stejné slovo?", a: "Protože stejné slovo se může v textu objevit i v jiném kontextu, který otázku nezodpoví", opts: ["Protože stejné slovo se může v textu objevit i v jiném kontextu, který otázku nezodpoví", "Není to důležité, stačí najít stejné slovo", "Protože text má vždy jen jednu informaci", "Protože slova se v textu nikdy neopakují"], e: "Slovo z otázky se může v textu objevit vícekrát a v různém významu, proto musíme ověřit, že věta se slovem opravdu odpovídá na to, na co se ptáme." },
  { q: "Jak se liší 'vyhledání konkrétní informace' od 'pochopení hlavní myšlenky' textu?", a: "Vyhledání = najdeš přesný fakt nebo číslo; pochopení hlavní myšlenky = shrneš, o čem text celkově je", opts: ["Vyhledání = najdeš přesný fakt nebo číslo; pochopení hlavní myšlenky = shrneš, o čem text celkově je", "Jsou to úplně stejné dovednosti", "Vyhledání je vždy těžší", "Hlavní myšlenka se hledá jen v nadpisu"], e: "Vyhledání je hledání konkrétního detailu (čísla, jména), kdežto pochopení hlavní myšlenky znamená umět celý text shrnout vlastními slovy." },
  { q: "Když se tě zeptají 'Kolik' nebo 'Kdy', hledáš v textu především:", a: "Čísla a časové údaje", opts: ["Čísla a časové údaje", "Přídavná jména", "Jména osob", "Poslední větu textu"], e: "Otázky 'Kolik' a 'Kdy' se ptají na množství nebo čas, proto v textu hledáme čísla a časové údaje, ne přídavná jména nebo jména osob." },
];

const TEORIE: { q: string; a: string; opts: string[]; e: string }[] = [
  { q: "Co jsou klíčová slova v textu?", a: "Nejdůležitější slova, která vyjadřují hlavní téma", opts: ["Nejdůležitější slova, která vyjadřují hlavní téma", "Nejdelší slova v textu", "Slova, která neznáme", "První slova každé věty"], e: "Klíčová slova jsou ta nejdůležitější — říkají, o čem celý text je. Nejsou to nutně nejdelší slova ani slova, která neznáme." },
  { q: "Jak hledáme klíčová slova?", a: "Ptáme se: Co je v textu nejdůležitější?", opts: ["Ptáme se: Co je v textu nejdůležitější?", "Podtrhneme každé slovo", "Hledáme nejkratší slova", "Hledáme nejdéle ve slovníku"], e: "Správná otázka je: 'Co je v textu nejdůležitější?' Kdybys text musel popsat jedním slovem nebo dvěma, jaká by to byla? To jsou právě klíčová slova." },
  { q: "Proč jsou klíčová slova užitečná?", a: "Pomáhají rychle pochopit, o čem text je", opts: ["Pomáhají rychle pochopit, o čem text je", "Jsou to pravopisné chyby", "Používají se jen v básních", "Jsou to vždy přídavná jména"], e: "Klíčová slova fungují jako výtah — rychle ti řeknou, o čem text je, aniž bys musel číst každé slovo. Pomáhají ti pochopit text a zapamatovat si ho." },
  { q: "Kde v textu nejčastěji najdeme klíčová slova?", a: "V názvu, prvním a posledním odstavci", opts: ["V názvu, prvním a posledním odstavci", "Jen uprostřed textu", "Jen na konci", "Nikde konkrétně"], e: "Autoři obvykle uvádějí to nejdůležitější hned v názvu nebo na začátku a shrnou to na konci. Proto hledej klíčová slova nejdřív tam." },
];

function gen(level: number): PracticeTask[] {
  const tasks: PracticeTask[] = [];

  if (level === 3) {
    // L3: nový, náročnější text vyžadující syntézu dvou faktů / rozpoznání
    // nepodpořeného tvrzení / mezipředmětovou aplikaci (matematika), a
    // pokročilejší teorie vyhledávací strategie. Zcela disjunktní od L1/L2.
    TEXT_L3.otazky.forEach((o) => {
      tasks.push({
        question: `Text:\n${TEXT_L3.text}\n\n${o.q}`,
        correctAnswer: o.a,
        options: shuffle([...o.opts]),
        hints: ["Hledej odpověď přímo v textu.", "Někdy je potřeba spojit dvě informace z textu dohromady."],
        explanation: o.e,
      });
    });
    TEORIE_L3.forEach(({ q, a, opts, e }) => {
      tasks.push({ question: q, correctAnswer: a, options: shuffle([...opts]), hints: ["Přemýšlej o strategii vyhledávání, ne jen o jednom faktu."], explanation: e });
    });
    return tasks;
  }

  // Level 1: jen faktické otázky z prvního textu
  // Level 2: oba texty + klíčová slova
  const texty = level === 1 ? TEXTY.slice(0, 1) : TEXTY.slice(0, 2);
  const getOtazky = (t: typeof TEXTY[0]) =>
    level === 1 ? t.otazky.slice(1) : t.otazky; // level 1: přeskočit klíčová slova

  for (let i = 0; i < 20; i++) {
    const t = texty[i % texty.length];
    const otazky = getOtazky(t);
    const o = otazky[i % otazky.length];
    tasks.push({
      question: `Text:\n${t.text}\n\n${o.q}`,
      correctAnswer: o.a,
      options: shuffle([...o.opts]),
      hints: ["Hledej odpověď přímo v textu.", "Klíčová slova = nejdůležitější slova tématu."],
      explanation: o.e,
    });
  }
  shuffle(TEORIE).slice(0, 20).forEach(({ q, a, opts, e }) => {
    tasks.push({ question: q, correctAnswer: a, options: shuffle([...opts]), hints: ["Klíčová slova ti prozradí, o čem se text týká, i když ho nepřečteš celý."], explanation: e });
  });
  return tasks.slice(0, 40);
}

export const VYHLEDAVANIINFO: TopicMetadata[] = [
  {
    id: "g3-cjl-vyhledavani-informaci",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-informaci-v-textu-klicova-slova",
    title: "Vyhledávání informací v textu, klíčová slova",
    studentTitle: "Hledám info v textu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Naučíš se najít klíčové informace a klíčová slova v textu.",
    keywords: ["klíčová slova", "vyhledávání informací", "hlavní myšlenka", "text", "porozumění"],
    goals: ["Najít klíčová slova v textu.", "Vyhledat konkrétní informaci z textu.", "Rozlišit důležité a méně důležité informace."],
    boundaries: ["Krátké texty přiměřené 3. ročníku."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová slova = to nejdůležitější. Hledej: kdo/co je v textu hlavní? O čem celý text je?",
      steps: ["Přečti celý text.", "Zeptej se: O čem to celé je?", "Podtrhni slova, která se opakují nebo jsou nejdůležitější.", "To jsou klíčová slova."],
      commonMistake: "Vybírání dlouhých slov místo klíčových — délka slova neznamená důležitost.",
      example: "Text o velrybách: klíčová slova = velryba, savec, oceán (ne: 'jsou', 'živí se', 'obrovské').",
    },
  },
];
