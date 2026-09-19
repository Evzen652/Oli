/**
 * Zeměpis 6. ročník — Roční doby, časová pásma (select_one).
 *
 * Téma má dvě části a každá úroveň je střídá zhruba napůl:
 *  • fakta z banky: příčina ročních dob (sklon osy, ne vzdálenost), obratníky
 *    a polární kruhy, slunovraty a rovnodennosti, jižní polokoule, polární den,
 *  • výpočet časového posunu: 15° zeměpisné délky = 1 hodina, na východ je
 *    později, bez letního času a bez nepravidelných hranic pásem.
 *
 * Gradace:
 *  • L1 — jeden fakt nebo jeden krok (rozdíl délek → hodiny a naopak).
 *  • L2 — čas v cílovém místě na téže polokouli; roční doba na jižní
 *    polokouli; polární den a noc o slunovratu.
 *  • L3 — místa na opačných stranách od nultého poledníku (délky se sčítají),
 *    inverze (z časů délka), let s přistáním v místním čase, hypotézy
 *    o sklonu osy a protiklady mezi polokoulemi.
 *
 * Chybový model: vzdálenost od Slunce jako příčina ročních dob; posun času
 * opačným směrem; sečtené místo odečtených délek (a naopak); rozdíl stupňů
 * vzatý rovnou jako hodiny; stejné roční doby na obou polokoulích; obratník
 * zaměněný s polárním kruhem.
 *
 * Místa jsou zadaná jen souřadnicemi (násobky 15°), aby klíč nekolidoval se
 * skutečným úředním časem států. Rotace šablon se nastavuje v gen(), modul
 * nedrží žádný stav.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import {
  pick,
  rnd,
  cas,
  delka,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí obsahovat klíč ve znění — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  if (t.question.includes(t.correctAnswer)) return null;
  return t;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Poznámka k času, který přetekl přes půlnoc. */
function den(h: number): string {
  if (h >= 24) return " (to už je následující den)";
  if (h < 0) return " (to je ještě předchozí den)";
  return "";
}

/** Posun času zapsaný se znaménkem: `10:00 + 4 h`. */
function posunText(h: number, o: number): string {
  return `${cas(h)} ${o >= 0 ? "+" : "−"} ${Math.abs(o)} h`;
}

/** Rozdíl dvou délek slovy: na stejné straně se odečítají, přes nultý poledník sčítají. */
function rozdilKrok(l1: number, l2: number): string {
  const a = Math.abs(l1), b = Math.abs(l2);
  if (Math.sign(l1) === Math.sign(l2)) {
    return `Obě místa leží na ${l1 > 0 ? "východní" : "západní"} straně od nultého poledníku, délky se odečítají: ${Math.max(a, b)}° − ${Math.min(a, b)}° = ${Math.abs(a - b)}°.`;
  }
  return `Místa leží na opačných stranách od nultého poledníku, délky se sčítají: ${a}° + ${b}° = ${a + b}°.`;
}

/** Jak se z délky l1 dostat posunem o m stupňů na l2 (bez záporných čísel). */
function posunDelkyKrok(l1: number, l2: number): string {
  const a = Math.abs(l1), b = Math.abs(l2), m = Math.abs(l2 - l1);
  const smer = l2 > l1 ? "na východ" : "na západ";
  if (Math.sign(l1) === Math.sign(l2)) {
    const pocet = b > a ? `${a}° + ${m}° = ${b}°` : `${a}° − ${m}° = ${b}°`;
    return `Posun o ${m}° ${smer}: ${pocet}, strana od nultého poledníku zůstává stejná → ${delka(l2)}`;
  }
  return `Posun o ${m}° ${smer}: do nultého poledníku je to ${a}°, zbylých ${m}° − ${a}° = ${b}° leží už na druhé straně → ${delka(l2)}`;
}

// ── Faktická banka ─────────────────────────────────────────────────────────

interface Fakt {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const fakt = (f: Fakt): PracticeTask | null =>
  hlidej(
    choice(
      f.q,
      f.key,
      f.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: f.hints, explanation: f.explanation },
    ),
  );

const DATA_SLUNCE = [
  { nazev: "letní slunovrat", datum: "21. června", popis: "letní slunovrat, nejdelší den v roce" },
  { nazev: "zimní slunovrat", datum: "21. prosince", popis: "zimní slunovrat, nejkratší den v roce" },
  { nazev: "jarní rovnodennost", datum: "20.–21. března", popis: "jarní rovnodennost, den a noc jsou skoro stejně dlouhé" },
  { nazev: "podzimní rovnodennost", datum: "22.–23. září", popis: "podzimní rovnodennost, den a noc jsou skoro stejně dlouhé" },
];

const BANKA_L1: Fakt[] = [
  {
    q: "Co je příčinou střídání ročních dob na Zemi?",
    key: "sklon zemské osy při oběhu kolem Slunce",
    d: [
      ["měnící se vzdálenost Země od Slunce", "Vzdálenost Země od Slunce se během roku mění jen málo a nejblíž je Země v lednu, kdy je u nás zima. Roční doby proto vzdálenost nezpůsobuje."],
      ["otáčení Země kolem vlastní osy", "Otáčení kolem osy trvá jeden den a způsobuje střídání dne a noci, ne ročních dob."],
      ["měnící se síla samotného Slunce", "Slunce svítí celý rok prakticky stejně silně. Mění se jen to, pod jakým úhlem paprsky dopadají na určité místo Země."],
    ],
    hints: [
      "Mysli na to, proč je v prosinci zima u nás, ale léto v Austrálii — ve stejnou chvíli.",
      "Když mají obě polokoule ve stejném okamžiku opačné roční doby, nemůže za to vzdálenost celé Země od Slunce. Hledej něco, co jednu polokouli ke Slunci přiklání a druhou odklání.",
    ],
    explanation: "Zemská osa je skloněná a při oběhu kolem Slunce míří stále stejným směrem. Polokoule přikloněná ke Slunci dostává paprsky pod větším úhlem a má delší den, proto je na ní léto. Druhá polokoule je odkloněná a má zimu.",
  },
  {
    q: "Kolik stupňů svírá zemská osa s kolmicí k rovině oběhu Země kolem Slunce?",
    key: "asi 23,5°",
    d: [
      ["asi 66,5°", "66,5° svírá osa s rovinou oběhu, ne s kolmicí k ní. Oba úhly dávají dohromady pravý úhel."],
      ["asi 15°", "15° je šíře jednoho časového pásma, se sklonem osy nesouvisí."],
      ["asi 90°", "Při 90° by osa ležela přímo v rovině oběhu a Země by se kolem Slunce „kutálela“. Tak to není."],
    ],
    hints: [
      "Stejné číslo najdeš v zeměpisné šířce obratníků.",
      "Sklon osy určuje, jak daleko od rovníku může Slunce v poledne svítit kolmo. Tato hranice je obratník, takže sklon osy a šířka obratníku jsou stejné číslo.",
    ],
    explanation: "Zemská osa je od kolmice k rovině oběhu odkloněná asi o 23,5°. Proto leží obratníky na 23,5° s. š. a j. š. a polární kruhy na 90° − 23,5° = 66,5°.",
  },
  {
    q: "Kolik stupňů od rovníku leží obratník Raka a obratník Kozoroha?",
    key: "23,5°",
    d: [
      ["66,5°", "66,5° je zeměpisná šířka polárních kruhů, ne obratníků. Obratníky jsou mnohem blíž k rovníku."],
      ["90°", "Na 90° leží póly, ne obratníky."],
      ["0°", "0° je sám rovník. Obratníky leží na sever a na jih od něj."],
    ],
    hints: [
      "Obratník je nejvzdálenější rovnoběžka, nad kterou může Slunce stát v poledne kolmo.",
      "Jak daleko od rovníku může Slunce svítit kolmo, určuje sklon zemské osy. Obratníky leží na stejném počtu stupňů, o kolik je osa skloněná.",
    ],
    explanation: "Obratníky leží na 23,5° s. š. (obratník Raka) a 23,5° j. š. (obratník Kozoroha). Je to stejné číslo jako sklon zemské osy, protože dál od rovníku už Slunce kolmo nesvítí.",
  },
  {
    q: "Kolik stupňů od rovníku leží severní a jižní polární kruh?",
    key: "66,5°",
    d: [
      ["23,5°", "23,5° je zeměpisná šířka obratníků. Polární kruhy leží mnohem blíž k pólům."],
      ["90°", "Na 90° leží samotné póly, polární kruh je od nich ještě kus dál."],
      ["0°", "0° je rovník, polární kruhy jsou naopak blízko pólů."],
    ],
    hints: [
      "Polární kruh leží blízko pólu. Od pólu (90°) je vzdálený přesně o tolik, o kolik je skloněná zemská osa.",
      "Vezmi zeměpisnou šířku pólu a odečti od ní sklon zemské osy. Tak dostaneš rovnoběžku, za kterou už bývá polární den a polární noc.",
    ],
    explanation: "Polární kruhy leží na 66,5° s. š. a j. š. Spočítáš to jako 90° − 23,5° (sklon osy). Za polárním kruhem nastává polární den a polární noc.",
  },
  ...DATA_SLUNCE.map((x): Fakt => ({
    q: `Kdy je přibližně ${x.nazev} na severní polokouli?`,
    key: x.datum,
    d: DATA_SLUNCE.filter((y) => y !== x).map((y): [string, string] => [
      y.datum,
      `Kolem ${y.datum} nastává ${y.popis}. Otázka se ptá na ${x.nazev}.`,
    ]),
    hints: [
      x.nazev.includes("slunovrat")
        ? `${cap(x.nazev)} je den, kdy je u nás den ${x.nazev.startsWith("letní") ? "nejdelší" : "nejkratší"} z celého roku. Ve kterém měsíci to bývá?`
        : `${cap(x.nazev)} je den, kdy jsou den a noc skoro stejně dlouhé, a to ${x.nazev.startsWith("jarní") ? "na jaře" : "na podzim"}. Ve kterém měsíci to bývá?`,
      `Připomeň si, kterým dnem začíná ${x.nazev.startsWith("letní") ? "léto" : x.nazev.startsWith("zimní") ? "zima" : x.nazev.startsWith("jarní") ? "jaro" : "podzim"} podle kalendáře. Slunovraty připadají na červen a prosinec, rovnodennosti na měsíce přesně uprostřed mezi nimi.`,
    ],
    explanation: `${cap(x.nazev)} je přibližně ${x.datum} (přesný den se rok od roku posouvá, proto se u rovnodenností uvádějí dva dny). Na severní polokouli tím astronomicky začíná ${x.nazev.startsWith("letní") ? "léto" : x.nazev.startsWith("zimní") ? "zima" : x.nazev.startsWith("jarní") ? "jaro" : "podzim"}.`,
  })),
  {
    q: "Kolik stupňů zeměpisné délky připadá na jedno časové pásmo?",
    key: "15°",
    d: [
      ["1°", "Jedno pásmo není jeden stupeň. Země se za 24 hodin otočí o 360° a na jedno pásmo připadá 360 : 24."],
      ["24°", "24 je počet časových pásem, ne jejich šíře. Šíři dostaneš, když 360° vydělíš počtem pásem."],
      ["30°", "Tolik by vyšlo, kdyby pásem bylo jen dvanáct. Den ale má 24 hodin, takže 360° se dělí 24."],
    ],
    hints: [
      "Země se za celý den otočí o plný úhel 360°. Kolik hodin má den?",
      "Každé časové pásmo odpovídá jedné hodině otáčení. Plný úhel proto rozděl na tolik stejných dílů, kolik hodin trvá jedna otočka Země.",
    ],
    explanation: "Země se za 24 hodin otočí o 360°. Na jednu hodinu, a tedy na jedno časové pásmo, připadá 360° : 24 = 15° zeměpisné délky.",
  },
  {
    q: "Kolik časových pásem má Země podle teoretického rozdělení poledníky?",
    key: "24",
    d: [
      ["12", "Dvanáct je jen polovina. Pásem je tolik, kolik hodin trvá celá otočka Země, tedy celý den i noc."],
      ["360", "360 je počet stupňů plného úhlu. Pásmo má více stupňů, takže pásem je mnohem méně."],
      ["15", "15 stupňů je šíře jednoho pásma, ne jejich počet."],
    ],
    hints: [
      "Každé časové pásmo odpovídá jedné hodině. Za jak dlouho se Země otočí kolem své osy?",
      "Pásem je stejně jako hodin v celém dni (den i noc dohromady). Pro kontrolu vyděl plný úhel šíří jednoho pásma.",
    ],
    explanation: "Země se kolem osy otočí za 24 hodin a každé hodině odpovídá jedno pásmo. Teoreticky je pásem proto 24, každé široké 360° : 24 = 15°. Ve skutečnosti se hranice pásem přizpůsobují státním hranicím a některé státy používají i půlhodinový posun (například Indie).",
  },
  {
    q: "Co je pravda o čase v místě, které leží daleko na východ od nás?",
    key: "Je tam později než u nás.",
    d: [
      ["Je tam dříve než u nás.", "Je to obráceně. Země se otáčí od západu k východu, Slunce proto vychází dřív na východě a čas tam je napřed."],
      ["Je tam stejně jako u nás.", "Stejný čas je jen v rámci jednoho pásma. Daleko na východ už leží jiné pásmo."],
      ["Je tam později jen v zimě.", "Posun času nezávisí na roční době. Na východ je později po celý rok."],
    ],
    hints: [
      "Slunce vychází na východě. Kde vyjde dřív — u nás, nebo v místě na východ od nás?",
      "Země se otáčí od západu k východu, takže místa na východě se ke Slunci natočí dřív. Kde ráno přijde dřív, tam hodiny ukazují víc.",
    ],
    explanation: "Země se otáčí od západu k východu. Místa na východ od nás se ke Slunci natočí dřív, mají dřív ráno i poledne, a proto je tam později než u nás.",
  },
  {
    q: "Co je polární den?",
    key: "doba, kdy Slunce ani o půlnoci nezapadne",
    d: [
      ["doba, kdy Slunce celý den nevyjde", "To je polární noc. Polární den je naopak doba, kdy Slunce nezapadá."],
      ["den, kdy je v Česku den nejdelší", "Nejdelší den v Česku je letní slunovrat. I tehdy ale u nás Slunce večer zapadne."],
      ["den, kdy trvá den i noc stejně", "Stejně dlouhý den a noc jsou o rovnodennosti, ne o polárním dni."],
    ],
    hints: [
      "Polární den nastává jen za polárním kruhem, a to v létě dané polokoule.",
      "Za polárním kruhem je v létě polokoule ke Slunci přikloněná tak moc, že se místo ani během otočky Země nedostane do stínu. Co to znamená pro západ Slunce?",
    ],
    explanation: "Polární den je doba, kdy Slunce ani o půlnoci nezapadne. Nastává za polárním kruhem v létě, protože je polokoule ke Slunci přikloněná a místo se při otáčení Země nedostane do stínu.",
  },
  {
    q: "Co je rovnodennost?",
    key: "den, kdy jsou den a noc všude skoro stejně dlouhé",
    d: [
      ["den, kdy je den nejdelší z celého roku", "Nejdelší den v roce je slunovrat, ne rovnodennost."],
      ["den, kdy je Země nejblíž ke Slunci", "Nejblíž je Země ke Slunci na začátku ledna a s rovnodenností to nesouvisí."],
      ["den, kdy Slunce svítí kolmo na obratník", "Kolmo na obratník svítí Slunce o slunovratu. O rovnodennosti svítí kolmo na rovník."],
    ],
    hints: [
      "Zkus rozložit samotné slovo na dvě části.",
      "Rovnodennost nastává dvakrát do roka, na jaře a na podzim. Slunce tehdy svítí kolmo na rovník a osvětlí obě polokoule stejně.",
    ],
    explanation: "O rovnodennosti (kolem 20.–21. března a 22.–23. září) svítí Slunce kolmo na rovník, obě polokoule jsou osvětlené stejně, a proto jsou den a noc skoro všude stejně dlouhé.",
  },
];

// ── L1 ───────────────────────────────────────────────────────────────────

function faktL1(): PracticeTask | null {
  return fakt(pick(BANKA_L1));
}

/** Jeden krok: rozdíl délek → hodiny, nebo hodiny → rozdíl délek. */
function vypocetL1(): PracticeTask | null {
  const n = rnd(1, 6);
  const d = n * 15;
  if (Math.random() < 0.5) {
    const tretina = d % 30 === 0
      ? { value: pad(d / 30, "HODINA"), why: "Tahle možnost vyjde, když se na jednu hodinu počítá 30°, jako by pásem bylo jen dvanáct. Den má ale 24 hodin." }
      : { value: pad(24 - n, "HODINA"), why: "Tahle možnost vyjde, když se výsledek odečte od celého dne. Rozdíl délek ale přímo udává, o kolik hodin se čas liší." };
    return hlidej(
      choice(
        `Kolik hodin je časový rozdíl mezi dvěma místy, jejichž zeměpisné délky se liší o ${d}°?`,
        pad(n, "HODINA"),
        [
          { value: pad(d, "HODINA"), why: `Tahle možnost vyjde, když se rozdíl ${d}° vezme rovnou jako hodiny. Jedna hodina ale neodpovídá jednomu stupni: Země se za 24 hodin otočí o 360°, takže na hodinu připadá 360 : 24 stupňů.` },
          { value: pad(n, "MINUTA"), why: "Číslo sedí, jednotka ne. Na 15° připadá celá hodina, ne minuta — za jednu minutu se Země otočí jen o čtvrt stupně." },
          tretina,
        ],
        {
          hints: [
            `Země se za celý den otočí o 360°. Zjisti, o kolik stupňů se otočí za jednu hodinu, a pak zjisti, kolikrát se to vejde do ${d}°.`,
            "Plný úhel 360° rozděl počtem hodin v celém dni. Tím dostaneš, kolik stupňů odpovídá jedné hodině, a rozdíl délek pak vyděl tímto číslem. Na závěr si ověř, že ti vyšel počet hodin, a ne počet stupňů — výsledek musí být menší než zadaný rozdíl délek.",
          ],
          solutionSteps: [
            "Na jednu hodinu připadá 360° : 24 = 15°.",
            `${d}° : 15° = ${n}, časový rozdíl: ${pad(n, "HODINA")}.`,
          ],
          explanation: `Země se za 24 hodin otočí o 360°, za hodinu tedy o 15°. Rozdíl ${d}° odpovídá ${d} : 15 = ${n}, tedy časový rozdíl ${pad(n, "HODINA")}.`,
        },
      ),
    );
  }
  return hlidej(
    choice(
      `Kolik stupňů zeměpisné délky dělí dvě místa, mezi nimiž je časový rozdíl ${pad(n, "HODINA")}?`,
      `${d}°`,
      [
        { value: `${n}°`, why: "Tahle možnost vyjde, když se jedna hodina počítá jako jeden stupeň. Země se ale za hodinu otočí o mnohem víc, o 360 : 24 stupňů." },
        { value: `${n * 24}°`, why: "Tahle možnost vyjde, když se hodiny vynásobí počtem pásem. Násobit se má šíří jednoho pásma, tedy 360 : 24." },
        { value: `${n * 30}°`, why: "Tahle možnost vyjde, když se na hodinu počítá 30°, jako by pásem bylo jen dvanáct. Den má ale 24 hodin." },
      ],
      {
        hints: [
          `Zjisti, o kolik stupňů se Země otočí za jednu hodinu, a výsledek vynásob počtem hodin rozdílu (${pad(n, "HODINA")}).`,
          "Země se za celý den otočí jednou dokola, tedy o plný úhel. Když ho rozdělíš počtem hodin v jednom dni, dostaneš šíři jednoho časového pásma. Na závěr si ověř, že ti vyšly stupně, a ne hodiny — výsledek musí být mnohem větší než zadaný časový rozdíl.",
        ],
        solutionSteps: [
          "Na jednu hodinu připadá 360° : 24 = 15°.",
          `${n} · 15° = ${d}°.`,
        ],
        explanation: `Za jednu hodinu se Země otočí o 360° : 24 = 15°. Časovému rozdílu ${pad(n, "HODINA")} proto odpovídá ${n} · 15° = ${d}° zeměpisné délky.`,
      },
    ),
  );
}

// ── L2 ───────────────────────────────────────────────────────────────────

/** Čas v cílovém místě na téže straně od nultého poledníku. */
function vypocetL2(): PracticeTask | null {
  const strana = pick([1, -1]);
  const a = rnd(1, 11) * 15, b = rnd(1, 11) * 15;
  if (a === b || Math.abs(a - b) > 150) return null;
  const l1 = strana * a, l2 = strana * b;
  const h1 = rnd(0, 23);
  const dif = Math.abs(a - b);
  const posun = dif / 15;
  const smer = l2 > l1 ? 1 : -1;
  const cil = h1 + smer * posun;
  const klic = cas(cil);
  const start = l1 === 15 ? "V Praze (počítej s 15° v. d.)" : `V místě na ${delka(l1)}`;
  // Velká nápověda se skládá podle toho, co je na téhle instanci opravdu
  // záludné: hodně pásem, směr posunu a případný přechod přes půlnoc. Jedna
  // společná šablona pro celou rodinu by se v sezení opakovala třikrát za sebou
  // a žák by ji podruhé i potřetí přeskočil.
  const zaklad = posun >= 5
    ? "Nepočítej pásma po jednom, spleteš se: rozdíl délek rovnou vyděl šíří jednoho pásma, 15°, a máš počet hodin naráz."
    : "Rozdíl délek vyděl šíří jednoho pásma, 15°, a dostaneš počet hodin.";
  const smerVeta = smer > 0
    ? "Cílové místo leží na východ, kde Slunce vychází dřív, a proto je tam později — hodiny k času přičti."
    : "Cílové místo leží na západ, kde Slunce vychází později, a proto je tam dříve — hodiny od času odečti.";
  const konec = cil >= 24
    ? "Pozor na přechod přes půlnoc: když ti vyjde víc než 24 hodin, odečti 24 a jsi už v dalším dni."
    : cil < 0
      ? "Pozor na přechod přes půlnoc: když ti vyjde záporný čas, přičti 24 a jsi ještě v předchozím dni."
      : "Na závěr si ověř, že počet přičtených nebo odečtených hodin odpovídá počtu pásem mezi oběma místy.";
  const velka = `${zaklad} ${smerVeta} ${konec}`;
  return hlidej(
    choice(
      `${start} je ${cas(h1)}. Kolik je ve stejném okamžiku hodin v místě na ${delka(l2)}? Počítej jen podle zeměpisné délky, bez letního času.`,
      klic,
      [
        { value: cas(h1 - smer * posun), why: "Posun šel opačným směrem. Slunce vychází dřív na východě, proto je na východ později a na západ dříve." },
        { value: cas(h1 + smer * ((a + b) / 15)), why: "Tahle možnost vyjde, když se zeměpisné délky sečtou. Obě místa ale leží na stejné straně od nultého poledníku, takže se délky odečítají." },
        { value: cas(h1 + smer * dif), why: `Tahle možnost vyjde, když se rozdíl ${dif}° vezme rovnou jako počet hodin. Za hodinu se Země otočí o 360° : 24, rozdíl stupňů je proto potřeba ještě vydělit.` },
        { value: cas(h1 + smer * (posun + 1)), why: "Tady se započítalo o jedno pásmo navíc, jako by se počítalo i pásmo výchozího místa. Posun je jen rozdíl délek vydělený šíří pásma." },
      ],
      {
        hints: [
          `Zjisti, o kolik stupňů se liší délky ${delka(l1)} a ${delka(l2)}, a rozhodni, jestli obě místa leží na stejné straně od nultého poledníku.`,
          velka,
        ],
        solutionSteps: [
          rozdilKrok(l1, l2),
          `${dif}° : 15° = ${posun}, časový posun: ${pad(posun, "HODINA")}.`,
          `Cíl leží ${smer > 0 ? "na východ, je tam později" : "na západ, je tam dříve"}: ${posunText(h1, smer * posun)} = ${klic}${den(cil)}.`,
        ],
        explanation: `Obě místa leží na stejné straně od nultého poledníku, proto se délky odečítají: rozdíl ${dif}° odpovídá ${pad(posun, "HODINA")}. Cílové místo leží ${smer > 0 ? "na východ, a tak je tam později" : "na západ, a tak je tam dříve"}: ${klic}.`,
      },
    ),
  );
}

const ROCNI_DOBY = ["jaro", "léto", "podzim", "zima"] as const;
const MESICE = [
  { loc: "v lednu", sever: 3 },
  { loc: "v únoru", sever: 3 },
  { loc: "v dubnu", sever: 0 },
  { loc: "v květnu", sever: 0 },
  { loc: "v červenci", sever: 1 },
  { loc: "v srpnu", sever: 1 },
  { loc: "v říjnu", sever: 2 },
  { loc: "v listopadu", sever: 2 },
];
const JIH = [
  { nom: "Austrálie", loc: "v Austrálii" },
  { nom: "Argentina", loc: "v Argentině" },
  { nom: "Jihoafrická republika", loc: "v Jihoafrické republice" },
  { nom: "Nový Zéland", loc: "na Novém Zélandu" },
];

function rocniDobaJih(): PracticeTask | null {
  const m = pick(MESICE), z = pick(JIH);
  const sever = ROCNI_DOBY[m.sever];
  const jih = ROCNI_DOBY[(m.sever + 2) % 4];
  const d: Distractor[] = [
    { value: sever, why: `${cap(sever)} je ${m.loc} u nás na severní polokouli. ${z.nom} ale leží na jižní polokouli, kde jsou roční doby opačné.` },
    ...ROCNI_DOBY.filter((r) => r !== sever && r !== jih).map((r): Distractor => ({
      value: r,
      why: "Tahle roční doba je od té naší posunutá jen o čtvrt roku. Na jižní polokouli jsou roční doby posunuté o půl roku, jsou tedy opačné.",
    })),
  ];
  return hlidej(
    choice(`Jaká roční doba je ${m.loc} ${z.loc}?`, jih, d, {
      hints: [
        `Nejdřív urči, na které polokouli leží ${z.nom}, a vzpomeň si, jaká roční doba je ${m.loc} u nás.`,
        "Když je severní polokoule přikloněná ke Slunci, jižní je od něj odkloněná, a naopak. Roční doby na obou polokoulích jsou proto posunuté o půl roku.",
      ],
      explanation: `${z.nom} leží na jižní polokouli. ${cap(m.loc)} je u nás na severní polokouli ${sever}, jižní polokoule je v tu dobu ke Slunci natočená opačně, proto je tam ${jih}.`,
    }),
  );
}

function nejdelsiDen(): PracticeTask | null {
  const datum = pick(["21. června", "21. prosince"]);
  const jaky = pick(["nejdelší", "nejkratší"]);
  const severNejdelsi = datum === "21. června";
  const naSeveru = (jaky === "nejdelší") === severNejdelsi;
  const key = naSeveru ? "na severní polokouli" : "na jižní polokouli";
  const jina = naSeveru ? "na jižní polokouli" : "na severní polokouli";
  return hlidej(
    choice(
      `Na které polokouli je kolem ${datum} ${jaky} den v roce?`,
      key,
      [
        { value: jina, why: `Obráceně. Kolem ${datum} je ke Slunci přikloněná ${severNejdelsi ? "severní" : "jižní"} polokoule a ta má den nejdelší, druhá polokoule nejkratší.` },
        { value: "na obou polokoulích zároveň", why: "Polokoule jsou ke Slunci natočené opačně. Když má jedna nejdelší den, druhá má nejkratší." },
        { value: "na žádné, den i noc trvají všude stejně", why: "Stejně dlouhý den a noc jsou o rovnodennostech v březnu a září, ne o slunovratu." },
      ],
      {
        hints: [
          `Kolem ${datum} je slunovrat. Která polokoule je v tu dobu ke Slunci přikloněná?`,
          "Přikloněná polokoule má léto a nejdelší dny, odkloněná zimu a nejkratší dny. U nás je léto v červnu a zima v prosinci.",
        ],
        explanation: `Kolem ${datum} je ke Slunci přikloněná ${severNejdelsi ? "severní" : "jižní"} polokoule, má léto a nejdelší den v roce. Druhá polokoule je odkloněná a má den nejkratší. ${jaky === "nejdelší" ? "Nejdelší" : "Nejkratší"} den je proto ${key}.`,
      },
    ),
  );
}

function polarniKruh(): PracticeTask | null {
  const sever = Math.random() < 0.5;
  const datum = pick(["21. června", "21. prosince"]);
  const leto = sever === (datum === "21. června");
  const DEN = "polární den, Slunce ani v noci nezapadne";
  const NOC = "polární noc, Slunce celý den nevyjde";
  const key = leto ? DEN : NOC;
  return hlidej(
    choice(
      `Co nastává kolem ${datum} za ${sever ? "severním" : "jižním"} polárním kruhem?`,
      key,
      [
        { value: leto ? NOC : DEN, why: `Obráceně. Kolem ${datum} je ${sever ? "severní" : "jižní"} polokoule ke Slunci ${leto ? "přikloněná, má léto" : "odkloněná, má zimu"}.` },
        { value: "den a noc trvají stejně dlouho", why: "Stejně dlouhý den a noc jsou o rovnodennostech. Kolem slunovratu jsou za polárním kruhem rozdíly největší." },
        { value: "Slunce stojí v poledne kolmo nad hlavou", why: "Kolmo nad hlavou může Slunce stát jen mezi obratníky, nikdy za polárním kruhem." },
      ],
      {
        hints: [
          `Rozhodni, jestli je ${sever ? "severní" : "jižní"} polokoule kolem ${datum} ke Slunci přikloněná, nebo odkloněná.`,
          "Kolem slunovratu je za polárním kruhem přikloněná polokoule osvětlená i během celé otočky Země, odkloněná naopak zůstává ve stínu. Po zbytek roku se tam den a noc střídají normálně. Na jižní polokouli je léto v prosinci.",
        ],
        explanation: `Kolem ${datum} je ${sever ? "severní" : "jižní"} polokoule ke Slunci ${leto ? "přikloněná, a tak za polárním kruhem Slunce nezapadá: je polární den" : "odkloněná, a tak za polárním kruhem Slunce nevyjde: je polární noc"}.`,
      },
    ),
  );
}

function faktL2(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.6) return rocniDobaJih();
  if (r < 0.8) return nejdelsiDen();
  return polarniKruh();
}

// ── L3 ───────────────────────────────────────────────────────────────────

/** Místa na opačných stranách od nultého poledníku — délky se sčítají. */
function opacneStrany(): PracticeTask | null {
  const s = pick([1, -1]);
  const a = rnd(1, 10) * 15, b = rnd(1, 10) * 15;
  if (a === b || a + b > 165) return null;
  const l1 = s * a, l2 = -s * b;
  const h1 = rnd(0, 23);
  const dif = a + b, posun = dif / 15;
  const smer = l2 > l1 ? 1 : -1;
  const cil = h1 + smer * posun;
  const klic = cas(cil);
  const odect = Math.abs(a - b) / 15;
  return hlidej(
    choice(
      `V místě A na ${delka(l1)} je ${cas(h1)}. Kolik je ve stejném okamžiku hodin v místě B na ${delka(l2)}? Počítej jen podle zeměpisné délky, bez letního času.`,
      klic,
      [
        { value: cas(h1 + smer * odect), why: "Tahle možnost vyjde, když se délky odečtou. Místa ale leží na opačných stranách od nultého poledníku, takže se jejich vzdálenosti od něj sčítají." },
        { value: cas(h1 - smer * posun), why: "Posun šel opačným směrem. Slunce vychází dřív na východě, proto je na východ později a na západ dříve." },
        { value: cas(h1 - smer * odect), why: "Tady se délky odečetly místo sečetly a navíc se čas posunul opačným směrem." },
        { value: cas(h1 + smer * dif), why: `Tahle možnost vyjde, když se součet ${dif}° vezme rovnou jako počet hodin. Rozdíl stupňů je potřeba ještě vydělit šíří pásma.` },
      ],
      {
        hints: [
          `Místo A leží na ${delka(l1)}, místo B na ${delka(l2)}: jsou na stejné straně od nultého poledníku?`,
          cil >= 24 || cil < 0
            ? "Když leží místa na opačných stranách od nultého poledníku, jejich vzdálenosti od něj se sčítají. Součet vyděl 15° a rozhodni, jestli B leží na východ (později), nebo na západ (dříve). Pozor na přechod přes půlnoc: vyjde-li ti víc než 24 hodin, odečti 24 a jsi v dalším dni; vyjde-li záporný čas, přičti 24 a jsi v předchozím."
            : "Když leží místa na opačných stranách od nultého poledníku, jejich vzdálenosti od něj se sčítají — nultý poledník je mezi nimi, ne za nimi. Součet vyděl 15° a rozhodni, jestli B leží na východ (později), nebo na západ (dříve).",
        ],
        solutionSteps: [
          rozdilKrok(l1, l2),
          `${dif}° : 15° = ${posun}, časový posun: ${pad(posun, "HODINA")}.`,
          `Místo B leží ${smer > 0 ? "na východ, je tam později" : "na západ, je tam dříve"}: ${posunText(h1, smer * posun)} = ${klic}${den(cil)}.`,
        ],
        explanation: `Mezi místy leží nultý poledník, takže se délky sčítají: ${a}° + ${b}° = ${dif}°, tedy časový posun ${pad(posun, "HODINA")}. Místo B leží ${smer > 0 ? "na východ, čas se přičítá" : "na západ, čas se odečítá"}: ${klic}.`,
      },
    ),
  );
}

/** Inverze: ze dvou časů a jedné délky určit délku druhého místa. */
function inverze(): PracticeTask | null {
  const l1 = pick([1, -1]) * rnd(1, 11) * 15;
  const D = pick([-1, 1]) * rnd(1, 8);
  const l2 = l1 + 15 * D;
  if (l2 === 0 || Math.abs(l2) >= 180) return null;
  const h1 = rnd(0, 23);
  const h2 = h1 + D;
  const m = 15 * Math.abs(D);
  const platna = (x: number) => x !== 0 && Math.abs(x) < 180;
  const d: Distractor[] = [];
  if (platna(l1 - 15 * D)) {
    d.push({ value: delka(l1 - 15 * D), why: `Směr je obráceně. V místě B je ${D > 0 ? "později" : "dříve"}, takže leží na ${D > 0 ? "východ" : "západ"} od místa A.` });
  }
  d.push({ value: delka(-l2), why: "Počet stupňů sedí, ale označení strany je opačné. Rozhoduje, na kterou stranu od nultého poledníku se z místa A posunem dostaneš." });
  if (platna(15 * D)) {
    d.push({ value: delka(15 * D), why: "Tady se spočítal jen posun a zapomnělo se, že místo A neleží na nultém poledníku. Posun je potřeba připočítat k délce místa A." });
  }
  d.push({ value: delka(l1 + D), why: "Tahle možnost vyjde, když se rozdíl časů vezme rovnou jako stupně. Jedna hodina ale odpovídá 360° : 24." });
  return hlidej(
    choice(
      `V místě A na ${delka(l1)} je ${cas(h1)}. Ve stejném okamžiku je v místě B ${cas(h2)}. Na jaké zeměpisné délce leží místo B? Počítej bez letního času.`,
      delka(l2),
      d,
      {
        hints: [
          `Porovnej oba časy: je v místě B později, nebo dříve než v místě A na ${delka(l1)}? Z toho poznáš, na kterou stranu od A se vydat.`,
          "Každá hodina rozdílu odpovídá 15° zeměpisné délky. Od délky místa A se posuň o tolik stupňů; když přitom přejdeš nultý poledník, změní se označení v. d. a z. d.",
        ],
        solutionSteps: [
          `Časový rozdíl: ${pad(Math.abs(D), "HODINA")}, v místě B je ${D > 0 ? "později, leží tedy na východ" : "dříve, leží tedy na západ"}.`,
          `${Math.abs(D)} · 15° = ${m}°.`,
          posunDelkyKrok(l1, l2),
        ],
        explanation: `V místě B je ${D > 0 ? "později, takže leží na východ" : "dříve, takže leží na západ"} od místa A. Časový rozdíl ${pad(Math.abs(D), "HODINA")} odpovídá ${Math.abs(D)} · 15° = ${m}° zeměpisné délky, a posun o ${m}° od ${delka(l1)} vede na ${delka(l2)}, kde leží místo B.`,
      },
    ),
  );
}

/** Let s přistáním v místním čase. */
function let_(): PracticeTask | null {
  const l1 = pick([1, -1]) * rnd(1, 11) * 15;
  const l2 = pick([1, -1]) * rnd(1, 11) * 15;
  const dif = Math.abs(l2 - l1);
  if (l1 === l2 || dif > 135) return null;
  const smer = l2 > l1 ? 1 : -1;
  const posun = dif / 15;
  // Doba letu musí odpovídat uletěné délce: dopravní letadlo urazí 15° zhruba
  // za hodinu a něco. Losovat N nezávisle by vyrobilo lety rychlejší než zvuk.
  const N = posun + rnd(1, 3);
  const h1 = rnd(0, 23);
  const odlet = h1 + smer * posun;
  const cil = odlet + N;
  const klic = cas(cil);
  const stejna = Math.sign(l1) === Math.sign(l2);
  const spatne = stejna
    ? (Math.abs(l1) + Math.abs(l2)) / 15
    : Math.abs(Math.abs(l1) - Math.abs(l2)) / 15;
  // Dva distraktory se mohou srazit na stejné hodině; dedup by pak nechal
  // jediné `why` a žákovi popsal jinou chybu, než jaké se dopustil.
  const varianty = [
    cas(h1 + N - smer * posun),
    cas(h1 + N),
    cas(h1 + N + smer * spatne),
    cas(odlet),
  ];
  if (new Set(varianty).size !== 4) return null;
  return hlidej(
    choice(
      `Letadlo vzlétne z místa na ${delka(l1)} v ${cas(h1)} místního času a poletí ${pad(N, "HODINA")} do místa na ${delka(l2)}, kde přistane. Kolik hodin tam bude místního času v okamžiku přistání? Počítej bez letního času.`,
      klic,
      [
        { value: cas(h1 + N - smer * posun), why: "Posun pásem šel opačným směrem. Cíl leží na " + (smer > 0 ? "východ, a tam je později." : "západ, a tam je dříve.") },
        { value: cas(h1 + N), why: "Tady se k času odletu přičetla jen doba letu. Čas odletu ale platí v místě odletu, v cíli je potřeba ho ještě posunout o rozdíl pásem." },
        {
          value: cas(h1 + N + smer * spatne),
          why: stejna
            ? "Tahle možnost vyjde, když se délky sečtou. Obě místa leží na stejné straně od nultého poledníku, takže se délky odečítají."
            : "Tahle možnost vyjde, když se délky odečtou. Místa leží na opačných stranách od nultého poledníku, takže se délky sčítají.",
        },
        { value: cas(odlet), why: "Tady se správně posunul čas odletu do cílového pásma, ale zapomnělo se přičíst, jak dlouho letadlo letí." },
      ],
      {
        hints: [
          `Nejdřív zjisti, kolik je hodin v cíli na ${delka(l2)} ve chvíli odletu z místa na ${delka(l1)}, a teprve potom přičti dobu letu.`,
          "Tahle úloha má dva kroky a nesmíš je poplést: nejdřív převedeš čas odletu do pásma cíle (podle toho, jestli místa leží na stejné straně od nultého poledníku, délky odečti, nebo sečti; každých 15° je jedna hodina, na východ je později a na západ dříve), a až k tomuhle času přičteš dobu letu. Když ti vyjde víc než 24 hodin, odečti 24 — letadlo přistálo už v dalším dni.",
        ],
        solutionSteps: [
          rozdilKrok(l1, l2),
          `${dif}° : 15° = ${posun}, cíl leží ${smer > 0 ? "na východ, čas se přičítá" : "na západ, čas se odečítá"}.`,
          `V okamžiku odletu je v cíli ${posunText(h1, smer * posun)} = ${cas(odlet)}${den(odlet)}.`,
          `Přistání: ${cas(odlet)} + ${N} h = ${klic}${odlet >= 0 && odlet < 24 ? den(cil) : ""}.`,
        ],
        explanation: `Časy odletu a přistání je potřeba vztáhnout k jednomu místu. V cíli je o ${pad(posun, "HODINA")} ${smer > 0 ? "později" : "dříve"}, takže v okamžiku odletu tam je ${cas(odlet)}. Po ${N} h letu bude v cíli ${klic}.`,
      },
    ),
  );
}

const SEVER_MISTA = [{ nom: "Česko", loc: "v Česku" }, { nom: "Německo", loc: "v Německu" }];
const JIH_MISTA = [
  { nom: "Argentina", loc: "v Argentině" },
  { nom: "Austrálie", loc: "v Austrálii" },
  { nom: "Jihoafrická republika", loc: "v Jihoafrické republice" },
];

/**
 * Porovnání obou polokoulí. Zadání záměrně neprozrazuje délku dne ani v jedné
 * zemi — žák musí odvodit obě strany (datum → přikloněná polokoule → obě země),
 * jinak by úloha měla jediný krok a byla by lehčí než faktické šablony L2.
 */
function protiklad(): PracticeTask | null {
  const datum = pick(["21. června", "21. prosince"]);
  const severDen = datum === "21. června" ? "nejdelší" : "nejkratší";
  const jihDen = severDen === "nejdelší" ? "nejkratší" : "nejdelší";
  const s = pick(SEVER_MISTA), j = pick(JIH_MISTA);
  const prvniSever = Math.random() < 0.5;
  const prvni = prvniSever ? s : j;
  const druhy = prvniSever ? j : s;
  const prvniDen = prvniSever ? severDen : jihDen;
  const druhyDen = prvniSever ? jihDen : severDen;
  const priklonena = datum === "21. června" ? "severní" : "jižní";
  const key = `${cap(prvni.loc)} ${prvniDen} den, ${druhy.loc} ${druhyDen} den`;
  return hlidej(
    choice(
      `Kolem ${datum} — porovnej délku dne ${prvni.loc} a ${druhy.loc}. Která dvojice platí?`,
      key,
      [
        {
          value: `${cap(prvni.loc)} ${druhyDen} den, ${druhy.loc} ${prvniDen} den`,
          why: `Polokoule máš prohozené. Kolem ${datum} je ke Slunci přikloněná ${priklonena} polokoule a právě tam je den ze všech v roce nejdelší. ${prvni.nom} přitom leží na ${prvniSever ? "severní" : "jižní"} polokouli.`,
        },
        {
          value: `${cap(prvni.loc)} ${prvniDen} den, ${druhy.loc} také ${prvniDen} den`,
          why: `${prvni.nom} a ${druhy.nom} leží na opačných polokoulích. Když je jedna ke Slunci přikloněná, druhá je od něj odkloněná, takže stejně dlouhý den mít nemohou.`,
        },
        {
          value: `${cap(prvni.loc)} i ${druhy.loc} je den stejně dlouhý jako noc`,
          why: "Den stejně dlouhý jako noc je o rovnodennostech v březnu a v září, ne kolem slunovratu.",
        },
      ],
      {
        hints: [
          `Datum ti samo neřekne nic — nejdřív rozhodni, na které polokouli leží ${prvni.nom} a na které ${druhy.nom}.`,
          "Kolem slunovratu je jedna polokoule ke Slunci přikloněná a druhá odkloněná. Přikloněná má den delší než noc, odkloněná naopak. U nás na severu začíná léto 21. června a zima 21. prosince.",
        ],
        explanation: `${prvni.nom} a ${druhy.nom} leží na opačných polokoulích. Kolem ${datum} je ke Slunci přikloněná ${priklonena} polokoule: tam je den v roce nejdelší, na odkloněné polokouli nejkratší. Platí proto: ${prvni.loc} ${prvniDen} den, ${druhy.loc} ${druhyDen} den.`,
      },
    ),
  );
}

const BANKA_L3: Fakt[] = [
  {
    q: "Kdyby zemská osa nebyla vůbec skloněná, co by se stalo s ročními dobami?",
    key: "Střídání ročních dob by téměř zmizelo.",
    d: [
      ["Roční doby by se střídaly stejně jako dnes.", "To by platilo, kdyby roční doby způsobovala vzdálenost od Slunce. Ta se ale mění jen málo. Roční doby vznikají kvůli sklonu osy."],
      ["Na celé Zemi by bylo po celý rok léto.", "Bez sklonu by se sice nic nestřídalo, ale v každém místě by bylo stále podobně jako dnes o rovnodennosti. U pólů by bylo pořád chladno."],
      ["Den a noc by se přestaly vůbec střídat.", "Den a noc způsobuje otáčení Země kolem osy. To by pokračovalo i bez sklonu, zmizelo by jen střídání ročních dob."],
    ],
    hints: [
      "Zkus si vzpomenout, co přesně způsobuje, že je jedna polokoule v létě blíž k přímým paprskům.",
      "Bez sklonu by žádná polokoule nebyla ke Slunci přikloněná víc než druhá. Úhel dopadu paprsků i délka dne by se v jednom místě během roku téměř neměnily.",
    ],
    explanation: "Roční doby vznikají tím, že skloněná osa střídavě přiklání ke Slunci severní a jižní polokouli. Bez sklonu by úhel paprsků i délka dne zůstávaly v každém místě skoro stejné a roční doby by téměř zmizely. Den a noc by se střídaly dál.",
  },
  {
    q: "Země je Slunci nejblíž na začátku ledna. Co z toho vyplývá?",
    key: "V lednu je u nás zima, vzdálenost tedy roční doby nezpůsobuje.",
    d: [
      ["V lednu je v Česku léto, protože jsme Slunci nejblíž.", "V lednu je v Česku zima, to víš ze zkušenosti. Blízkost Slunce tedy léto nezpůsobuje."],
      ["V lednu je na celé Zemi nejtepleji z celého roku.", "V lednu je na severní polokouli zima a na jižní léto. Teplota se řídí sklonem osy, ne vzdáleností."],
      ["V lednu mají obě polokoule stejnou roční dobu, zimu.", "Polokoule mají vždy opačné roční doby. V lednu je na jižní polokouli léto."],
    ],
    hints: [
      "Porovnej tuto informaci s tím, jaké počasí u nás v lednu opravdu bývá.",
      "Kdyby o střídání zim a lét rozhodovala vzdálenost, muselo by u nás být v době největší blízkosti Slunce nejtepleji z celého roku. Je to tak? A co z toho plyne o skutečné příčině?",
    ],
    explanation: "Země je Slunci nejblíž začátkem ledna, a přesto je u nás tehdy zima. Vzdálenost od Slunce tedy roční doby nezpůsobuje. Příčinou je sklon zemské osy: v lednu je severní polokoule od Slunce odkloněná.",
  },
  {
    q: "Kdyby zemská osa byla skloněná víc než dnes, kam by se posunuly polární kruhy?",
    key: "Posunuly by se blíž k rovníku.",
    d: [
      ["Posunuly by se blíž k pólům.", "Polární kruh leží od pólu tolik stupňů, o kolik je osa skloněná. Větší sklon ho tedy od pólu vzdálí, ne přiblíží."],
      ["Zůstaly by tam, kde jsou dnes.", "Poloha polárních kruhů závisí přímo na sklonu osy. Při jiném sklonu by se posunuly."],
      ["Zmizely by a nebyl by polární den.", "Při větším sklonu by polární den a noc zasahovaly ještě dál od pólů, nezmizely by."],
    ],
    hints: [
      "Dnes je osa skloněná o 23,5° a polární kruh leží na 66,5°. Zkus najít, jak spolu ta dvě čísla souvisí.",
      "Polární kruh leží na šířce, kterou dostaneš, když od šířky pólu (90°) odečteš sklon osy: 90° − 23,5° = 66,5°. Co se stane s výsledkem, když se odečítá větší číslo?",
    ],
    explanation: "Polární kruh leží na 90° minus sklon osy (dnes 90° − 23,5° = 66,5°). Při větším sklonu by se odečítalo víc, polární kruhy by ležely na menší zeměpisné šířce, tedy blíž k rovníku.",
  },
  {
    q: "Kdyby zemská osa byla skloněná méně než dnes, kde by ležely obratníky?",
    key: "blíž k rovníku než dnes",
    d: [
      ["dál od rovníku než dnes", "Obratník leží na tolika stupních šířky, o kolik je osa skloněná. Menší sklon znamená menší šířku, tedy blíž k rovníku."],
      ["na stejném místě jako dnes", "Poloha obratníků je stejné číslo jako sklon osy. Při jiném sklonu by se posunuly."],
      ["přímo na pólech Země", "Na pólech by obratníky ležely jen při sklonu 90°. Menší sklon je naopak přibližuje k rovníku."],
    ],
    hints: [
      "Připomeň si, jaký je vztah mezi sklonem osy a zeměpisnou šířkou obratníků.",
      "Obratník je nejvzdálenější rovnoběžka, kde Slunce může svítit kolmo, a leží na šířce rovné sklonu osy. Co se stane s touto šířkou, když se sklon zmenší?",
    ],
    explanation: "Obratníky leží na zeměpisné šířce rovné sklonu osy (dnes 23,5°). Kdyby byla osa skloněná méně, Slunce by svítilo kolmo jen blíž k rovníku a obratníky by ležely blíž k němu.",
  },
  {
    q: "Kdyby se Země otočila kolem své osy za 12 hodin, jak široké by bylo jedno časové pásmo?",
    key: "30°",
    d: [
      ["15°", "15° je šíře pásma při dnešní otočce za 24 hodin. Při kratší otočce by se plný úhel dělil méně hodinami, takže by pásmo vyšlo jiné."],
      ["12°", "12 je počet hodin ze zadání, ne počet stupňů. Šíři pásma dostaneš až tak, že plný úhel vydělíš počtem hodin."],
      ["7,5°", "Takhle to vyjde, když se dnešních 15° ještě jednou vydělí dvěma. Kratší otočka ale pásma rozšiřuje, ne zužuje — hodin je míň, a tak na každou připadá větší díl plného úhlu."],
    ],
    hints: [
      "Časové pásmo je vždy tolik stupňů, kolik jich Země urazí za jednu hodinu svého otáčení.",
      "Plný úhel 360° rozděl počtem hodin, za které se Země otočí. Dnes je to 24 hodin, a proto vychází 15°. Při poloviční době otočky se ale plný úhel dělí na poloviční počet dílů.",
    ],
    explanation: "Šíře pásma je plný úhel dělený počtem hodin jedné otočky. Při otočce za 12 hodin vyjde 360° : 12 = 30°, tedy dvakrát víc než dnešních 360° : 24 = 15°. Čím rychleji se Země otáčí, tím širší jsou pásma a tím méně jich je.",
  },
  {
    q: "Na rovníku trvá den po celý rok skoro přesně dvanáct hodin. Čím to je?",
    key: "Osa se naklání do stran, ale rovník zůstává osvětlený vždy z poloviny.",
    d: [
      ["Rovník je ze všech míst na Zemi Slunci nejblíž, a proto je osvětlený stále stejně.", "Vzdálenost od Slunce délku dne neurčuje — kdyby ano, měnil by se den s tím, jak se Země po dráze pohybuje. Rozhoduje, jakou část rovnoběžky protne hranice světla a stínu."],
      ["Na rovníku se Země otáčí nejrychleji, takže tam den i noc trvají stejně.", "Otočka trvá 24 hodin všude na Zemi stejně, i když se rovník při ní urazí nejdelší dráhu. Délku dne to neovlivní."],
      ["Nad rovníkem stojí Slunce v poledne vždy kolmo, a tak je den pořád stejný.", "Kolmo nad rovníkem stojí Slunce jen o rovnodennostech. Po zbytek roku je nad obratníkovou stranou, a přesto je den na rovníku dál dvanáctihodinový."],
    ],
    hints: [
      "Představ si hranici mezi osvětlenou a neosvětlenou polovinou Země. Na jaké části rovníku ta hranice leží, ať je osa nakloněná jakkoli?",
      "Hranice světla a stínu se se sklonem osy naklání, rovník však protíná pokaždé přesně napůl. A polovina otočky strávená ve světle znamená polovinu z 24 hodin.",
    ],
    explanation: "Slunce osvětluje vždy přesně polovinu Země a hranice světla a stínu půlí rovník bez ohledu na sklon osy. Místo na rovníku proto stráví ve světle polovinu otočky, tedy zhruba dvanáct hodin, a to po celý rok. U nás blíž k pólu už se délka dne během roku výrazně mění.",
  },
];

function faktL3(): PracticeTask | null {
  return Math.random() < 0.7 ? fakt(pick(BANKA_L3)) : protiklad();
}

// ── Generátor ──────────────────────────────────────────────────────────────

function gen(level: number): PracticeTask[] {
  const sablony: Tvurce[] =
    level === 1
      ? [faktL1, vypocetL1]
      : level === 2
        ? [vypocetL2, faktL2]
        : [opacneStrany, faktL3, inverze, faktL3, let_, faktL3];
  let i = 0;
  const genLx = () => losUlohy(sablony[i++ % sablony.length]);
  return ruzneUlohy(() => losUlohy(genLx));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const ROCNI_DOBY_CASOVA_PASMA: TopicMetadata[] = [
  {
    id: "g6-zem-rocni-doby-casova-pasma-6",
    rvpNodeId: "g6-zemepis-prirodni-obraz-zeme-vesmir-a-zeme-rocni-doby-casova-pasma",
    displayName: "Roční doby a časová pásma",
    title: "Roční doby, časová pásma",
    studentTitle: "Proč máme zimu a kolik je hodin jinde",
    subject: "zemepis",
    category: "Přírodní obraz Země",
    topic: "Vesmír a Země",
    briefDescription: "Sklon zemské osy, roční doby a počítání času v časových pásmech.",
    keywords: [
      "roční doby", "sklon zemské osy", "obratník", "polární kruh", "slunovrat",
      "rovnodennost", "polární den", "polární noc", "časové pásmo", "zeměpisná délka",
      "časový posun", "jižní polokoule",
    ],
    goals: [
      "Vysvětlit roční doby sklonem zemské osy, ne vzdáleností od Slunce.",
      "Znát polohu obratníků a polárních kruhů a data slunovratů a rovnodenností.",
      "Z rozdílu zeměpisné délky určit časový posun a čas v jiném místě.",
    ],
    boundaries: [
      "Časová pásma zjednodušeně: 15° délky = 1 hodina, bez letního času a nepravidelných hranic.",
      "Místa jsou zadaná souřadnicemi v násobcích 15°, výsledky jsou celé hodiny.",
      "Data slunovratů a rovnodenností jsou přibližná.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Roční doby způsobuje sklon zemské osy. Časové pásmo je široké 15° zeměpisné délky, na východ je později a na západ dříve.",
      steps: [
        "Zjisti, jestli místa leží na stejné straně od nultého poledníku: pak délky odečti, jinak je sečti.",
        "Rozdíl délek vyděl 15° a dostaneš počet hodin.",
        "Na východ hodiny přičti, na západ odečti; přes půlnoc se přechází do dalšího dne.",
      ],
      commonMistake: "Posunout čas opačným směrem nebo si myslet, že léto je tehdy, když je Země blíž Slunci.",
      example: "V místě na 15° v. d. (poledník středoevropského času, blízko Prahy) je 10:00. Na 75° v. d. je o (75 − 15) : 15 = 4 hodiny později, tedy 14:00.",
    },
  },
];
