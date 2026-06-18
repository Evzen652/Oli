import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ANO = "Ano, to je pravda";
const NE = "Ne, to není pravda";

interface PoolItem {
  question: string;
  correct: string;
  emoji: string;
  hint: string;
  solution: string;
}

// L1: Rozpoznání vlastního jména (Praha je vlastní jméno. Jan je vlastní jméno. Rex je vlastní jméno psa.)
const POOL_L1: PoolItem[] = [
  { question: "'Praha' je vlastní jméno. Je to pravda?", correct: ANO, emoji: "🏙️", hint: "Praha je konkrétní název jednoho města v Česku — takový název se jmenuje vlastní jméno.", solution: "'Praha' je vlastní jméno — je to konkrétní název hlavního města České republiky, proto píšeme P velké." },
  { question: "'Jan' je vlastní jméno osoby. Je to pravda?", correct: ANO, emoji: "👦", hint: "Jan je jméno konkrétního člověka — jak se takovým jménům říká?", solution: "'Jan' je vlastní jméno — je to jméno konkrétní osoby, proto píšeme J velké." },
  { question: "Vltava je vlastní jméno řeky. Je to pravda?", correct: ANO, emoji: "🌊", hint: "Vltava je konkrétní název jedné řeky v Česku — je to vlastní jméno?", solution: "Vltava je vlastní jméno — je to konkrétní název řeky, proto píšeme V velké." },
  { question: "'Alžběta' je vlastní jméno. Je to pravda?", correct: ANO, emoji: "👧", hint: "Alžběta je jméno konkrétní osoby — jak se takovým jménům říká?", solution: "'Alžběta' je vlastní jméno — je to jméno konkrétní osoby, proto píšeme A velké." },
  { question: "Vlastní jméno psa může být 'Rex'. Je to pravda?", correct: ANO, emoji: "🐕", hint: "Rex je konkrétní jméno, které dáváme konkrétnímu psovi — je to vlastní jméno?", solution: "Vlastní jméno psa může být 'Rex' — vlastní jméno může mít i zvíře nebo věc, píšeme ho s velkým R." },
  { question: "Slovo 'pes' je vlastní jméno. Je to pravda?", correct: NE, emoji: "🐕", hint: "Slovo 'pes' říká druh zvířete — ale nejmenuje konkrétního psa. Vlastní jméno psa by bylo třeba...", solution: "'Pes' není vlastní jméno — je to obecné podstatné jméno, které označuje všechny psy. Vlastní jméno je třeba 'Rex' (jméno konkrétního psa)." },
  { question: "Slovo 'město' je vlastní jméno. Je to pravda?", correct: NE, emoji: "🏙️", hint: "Slovo 'město' říká druh sídla — ale nejmenuje konkrétní město. Vlastní jméno by bylo třeba...", solution: "'Město' není vlastní jméno — je to obecné slovo pro všechna města. Vlastní jméno je třeba 'Praha' nebo 'Brno'." },
  { question: "Slovo 'kamarád' je vlastní jméno. Je to pravda?", correct: NE, emoji: "🤝", hint: "Slovo 'kamarád' říká druh vztahu — ale nejmenuje konkrétního kamaráda. Vlastní jméno kamaráda by bylo třeba...", solution: "'Kamarád' není vlastní jméno — je to obecné slovo. Vlastní jméno je třeba 'Tomáš' nebo 'Lucie'." },
];

// L2: Pravidlo velké/malé písmeno (vlastní = velké, obecné = malé)
const POOL_L2: PoolItem[] = [
  { question: "Vlastní jméno píšeme s velkým písmenem. Je to pravda?", correct: ANO, emoji: "🔠", hint: "Vzpomeň si na jméno svého kamaráda nebo název svého města — jak začíná?", solution: "Vlastní jméno píšeme vždy s velkým písmenem — proto 'Praha', 'Jan', 'Vltava', ne 'praha', 'jan', 'vltava'." },
  { question: "'Brno' je vlastní jméno města. Je to pravda?", correct: ANO, emoji: "🏙️", hint: "Brno je konkrétní název jednoho českého města — je to vlastní jméno?", solution: "'Brno' je vlastní jméno — je to konkrétní název města, proto píšeme B velké." },
  { question: "Název 'Česká republika' je vlastní jméno. Je to pravda?", correct: ANO, emoji: "🇨🇿", hint: "Česká republika je konkrétní název jednoho státu — je to vlastní jméno?", solution: "'Česká republika' je vlastní jméno — je to konkrétní název státu, proto píšeme Č velké." },
  { question: "Jméno 'marie' (s malým m) je správně napsané. Je to pravda?", correct: NE, emoji: "👩", hint: "Marie je jméno konkrétní osoby. Jak píšeme vlastní jméno — s malým nebo velkým písmenem?", solution: "'Marie' se píše s velkým M — je to vlastní jméno osoby. 'marie' s malým m je pravopisná chyba." },
  { question: "Obecná jména se píšou s velkým písmenem. Je to pravda?", correct: NE, emoji: "🔡", hint: "Obecné podstatné jméno označuje všechny věci svého druhu (pes, stůl, řeka) — jak ho píšeme?", solution: "Obecná jména píšeme s malým písmenem — 'pes', 'stůl', 'řeka'. Velké písmeno patří jen vlastním jménům." },
  { question: "Jméno 'jana' (s malým j) je správně napsané. Je to pravda?", correct: NE, emoji: "👧", hint: "Jana je jméno konkrétní osoby. Jak píšeme vlastní jméno — s malým nebo velkým písmenem?", solution: "'Jana' se píše s velkým J — je to vlastní jméno osoby. 'jana' s malým j je pravopisná chyba." },
  { question: "Slovo 'kočka' je vlastní jméno. Je to pravda?", correct: NE, emoji: "🐱", hint: "Slovo 'kočka' říká druh zvířete — ale nejmenuje konkrétní kočku. Vlastní jméno kočky by bylo třeba...", solution: "'Kočka' není vlastní jméno — je to obecné slovo pro všechny kočky. Vlastní jméno je třeba 'Micka'." },
  { question: "Název 'labe' (s malým l) je správně napsaný. Je to pravda?", correct: NE, emoji: "🌊", hint: "Labe je konkrétní název řeky — je to vlastní nebo obecné jméno?", solution: "'Labe' se píše s velkým L — je to vlastní jméno řeky. 'labe' s malým l je pravopisná chyba." },
];

// L3: Méně zřejmé případy a časté omyly (jaro vs. Jaroslav, řeka vs. Vltava, stůl, slunce)
const POOL_L3: PoolItem[] = [
  { question: "Slovo 'řeka' je vlastní jméno. Je to pravda?", correct: NE, emoji: "🏞️", hint: "Slovo 'řeka' říká druh vodního toku — ale nejmenuje konkrétní řeku. Vlastní jméno by bylo třeba...", solution: "'Řeka' není vlastní jméno — je to obecné slovo pro všechny řeky. Vlastní jméno je třeba 'Vltava' nebo 'Labe'." },
  { question: "Slovo 'jaro' je vlastní jméno. Je to pravda?", correct: NE, emoji: "🌸", hint: "Slovo 'jaro' označuje roční období — nejmenuje konkrétní věc. Je to vlastní jméno?", solution: "'Jaro' není vlastní jméno — je to obecné slovo pro roční období. Vlastní jméno je třeba 'Jaroslav' (jméno člověka)." },
  { question: "Slovo 'stůl' je vlastní jméno. Je to pravda?", correct: NE, emoji: "🪑", hint: "Slovo 'stůl' označuje druh nábytku — nejmenuje konkrétní věc. Je to vlastní jméno?", solution: "'Stůl' není vlastní jméno — je to obecné slovo pro kus nábytku. Vlastní jméno se vztahuje k jedinečné osobě, místu nebo věci." },
  { question: "Slovo 'slunce' je vlastní jméno. Je to pravda?", correct: NE, emoji: "☀️", hint: "Slovo 'slunce' označuje hvězdu obecně — i v jiných slunečních soustavách jsou hvězdy. Píšeme ho s malým s.", solution: "'Slunce' jako obecné slovo píšeme s malým s — označuje typ hvězdy. Vlastní jméno (astronomický název) by bylo 'Slunce' jen v odborném textu." },
  { question: "'Micka' může být vlastní jméno kočky. Je to pravda?", correct: ANO, emoji: "🐱", hint: "Vlastní jméno může dostat i zvíře. Micka je konkrétní název pro konkrétní kočku — je to vlastní jméno?", solution: "'Micka' je vlastní jméno — je to konkrétní jméno dané konkrétní kočce, proto píšeme M velké." },
  { question: "Slovo 'hora' je vlastní jméno. Je to pravda?", correct: NE, emoji: "⛰️", hint: "Slovo 'hora' označuje druh terénu — nejmenuje konkrétní horu. Vlastní jméno by bylo třeba...", solution: "'Hora' není vlastní jméno — je to obecné slovo. Vlastní jméno je třeba 'Sněžka' (konkrétní hora)." },
  { question: "'Sněžka' je vlastní jméno hory. Je to pravda?", correct: ANO, emoji: "⛰️", hint: "Sněžka je konkrétní název nejvyšší hory Česka — je to vlastní jméno?", solution: "'Sněžka' je vlastní jméno — je to konkrétní název hory, proto píšeme S velké." },
  { question: "Slovo 'kniha' je vlastní jméno. Je to pravda?", correct: NE, emoji: "📚", hint: "Slovo 'kniha' označuje druh předmětu — nejmenuje konkrétní knihu. Je to vlastní jméno?", solution: "'Kniha' není vlastní jméno — je to obecné slovo pro všechny knihy. Vlastní jméno by byl třeba název konkrétní knihy." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).map(item => ({
    question: item.question,
    correctAnswer: item.correct,
    options: [ANO, NE],
    emoji: item.emoji,
    hints: [item.hint],
    explanation: item.solution,
  }));
}

export const VLASTNIJMENA: TopicMetadata[] = [
  {
    id: "g2-cjl-jazykova-vychova-tvaroslovi-vlastni-jmena-velke-pismeno",
    rvpNodeId: "g2-cjl-jazykova-vychova-tvaroslovi-vlastni-jmena-velke-pismeno",
    title: "Vlastní jména a velké písmeno",
    studentTitle: "Vlastní jména",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se poznat vlastní jméno a psát ho s velkým písmenem.",
    keywords: ["vlastní jméno", "velké písmeno", "Praha", "Jan", "Vltava", "obecné jméno"],
    goals: [
      "Rozlišit vlastní jméno od obecného jména.",
      "Vědět, že vlastní jméno píšeme s velkým písmenem.",
    ],
    boundaries: ["Vlastní jména osob, měst a řek.", "Bez historických názvů a institucí."],
    gradeRange: [2, 2],
    inputType: "true_false",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Vlastní jméno pojmenovává konkrétní osobu, město nebo věc a píše se s VELKÝM písmenem.",
      steps: ["Pojmenovává slovo konkrétní jedinečnou věc (Jana, Praha)?", "Ano → vlastní jméno s velkým písmenem.", "Ne → obecné jméno s malým písmenem."],
      commonMistake: "Psát vlastní jméno s malým písmenem — 'jan' místo 'Jan', 'praha' místo 'Praha'.",
      example: "Praha (vlastní jméno) vs. město (obecné jméno). Jan (vlastní) vs. chlapec (obecné).",
    },
  },
];
