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
    question: "Spoj orgán nebo součást těla s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Pumpuje krev tělem" },
      { left: "Plíce", right: "Provádějí výměnu O₂ a CO₂" },
      { left: "Páteř", right: "Chrání míchu a nese váhu těla" },
      { left: "Bránice", right: "Sval umožňující dýchání" },
    ],
  },
  {
    question: "Spoj orgán nebo součást těla s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Tepna", right: "Vede krev od srdce do těla" },
      { left: "Žíla", right: "Vede krev od těla k srdci" },
      { left: "Alveola (plicní sklípek)", right: "Místo výměny kyslíku a CO₂ v plicích" },
      { left: "Kloub", right: "Pohyblivý spoj dvou kostí" },
    ],
  },
  {
    question: "Spoj součást krve s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Červené krvinky", right: "Přenášejí kyslík z plic do tkání" },
      { left: "Bílé krvinky", right: "Chrání tělo před infekcemi (imunita)" },
      { left: "Destičky (trombocyty)", right: "Srážejí krev při krvácení" },
      { left: "Krevní plasma", right: "Kapalina přenášející živiny a odpadní látky" },
    ],
  },
  {
    question: "Spoj součást kostrové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Lebka", right: "Chrání mozek" },
      { left: "Žebra", right: "Chrání srdce a plíce" },
      { left: "Páteř", right: "Opora těla, ochrana míchy" },
      { left: "Kost stehenní", right: "Nejdelší kost v těle, tvoří základ stehna" },
    ],
  },
  {
    question: "Spoj orgán s jeho funkcí v dýchací nebo oběhové soustavě.",
    correctAnswer: "match",
    pairs: [
      { left: "Průdušnice", right: "Vede vzduch z hrtanu do plic" },
      { left: "Hrtan", right: "Obsahuje hlasivky, spojuje nosohltán s průdušnicí" },
      { left: "Levá komora srdce", right: "Pumpuje okysličenou krev do velkého oběhu" },
      { left: "Pravá komora srdce", right: "Pumpuje odkysličenou krev do plic" },
    ],
  },
  {
    question: "Spoj sval s jeho popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Kosterní sval", right: "Ovládáme ho vědomě – pohyb ruky, nohy" },
      { left: "Srdeční sval", right: "Bije automaticky, nelze ho vědomě zastavit" },
      { left: "Hladký sval", right: "Ve stěnách střev a cév, mimovolný" },
      { left: "Šlacha", right: "Pojivová tkáň připevňující sval ke kosti" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Červená kostní dřeň", right: "Tvoří krvinky (krvetvorba)" },
      { left: "Chrupavka", right: "Tlumí nárazy v kloubech" },
      { left: "Vaz", right: "Spojuje kosti v kloubu" },
      { left: "Hemoglobin", right: "Červené barvivo krvinky vázající kyslík" },
    ],
  },
  {
    question: "Spoj část dýchací soustavy s jejím popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Nosní sliznice", right: "Ohřívá, zvlhčuje a čistí vzduch" },
      { left: "Průduška", right: "Větví se do plicních laloků" },
      { left: "Plicní lalok", right: "Část plíce zásobená jednou průduškou" },
      { left: "Pohrudnice", right: "Blána obalující plíce a usnadňující dýchání" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Čerpá krev do dvou oddělených oběhů" },
      { left: "Plíce", right: "Okysličují krev a vydechují CO₂" },
      { left: "Kostra", right: "Chrání orgány a umožňuje pohyb" },
      { left: "Svaly", right: "Tahají za kosti a způsobují pohyb" },
    ],
  },
  {
    question: "Spoj krevní oběh s jeho popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Malý (plicní) oběh", right: "Srdce → plíce → okysličení → zpět k srdci" },
      { left: "Velký (tělový) oběh", right: "Srdce → tělo → odevzdání O₂ → zpět k srdci" },
      { left: "Tepna plicní", right: "Vede odkysličenou krev do plic" },
      { left: "Žíla plicní", right: "Přivádí okysličenou krev z plic do srdce" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Páteř", right: "33 obratlů chrání míchu" },
      { left: "Kost", right: "Pevná tkáň tvořící kostru" },
      { left: "Sval", right: "Stahuje se a uvolňuje – způsobuje pohyb" },
      { left: "Krev", right: "Rozvádí látky, O₂ a imunitní buňky po těle" },
    ],
  },
  {
    question: "Spoj orgán s popisem jeho umístění nebo stavby.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Leží v hrudní dutině, vlevo od středu" },
      { left: "Plíce", right: "Dvě houbovité struktury v hrudním koši" },
      { left: "Bránice", right: "Klenutý sval oddělující hrudník od břicha" },
      { left: "Žebra", right: "12 párů kostěných oblouků chránící hrudní orgány" },
    ],
  },
  {
    question: "Spoj součást kostrové soustavy s její funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kyčelní kost", right: "Základ pánve, nese váhu těla" },
      { left: "Lopatka", right: "Základ ramenního kloubu" },
      { left: "Klíční kost", right: "Spojuje lopatku s hrudní kostí" },
      { left: "Kost holenní", right: "Větší ze dvou kostí bérce" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Vytváří krevní tlak pro oběh krve" },
      { left: "Kapiláry", right: "Nejtenčí cévy, kde probíhá výměna látek s tkáněmi" },
      { left: "Alveoly", right: "Miliony váčků s velkým povrchem pro výměnu plynů" },
      { left: "Průdušnice", right: "Vede vzduch do plic (trachea)" },
    ],
  },
  {
    question: "Spoj součást s jejím popisem v oběhové soustavě.",
    correctAnswer: "match",
    pairs: [
      { left: "Předsíň srdeční", right: "Přijímá krev přitékající žílami do srdce" },
      { left: "Komora srdeční", right: "Vypuzuje krev do tepen ze srdce" },
      { left: "Srdeční chlopeň", right: "Brání zpětnému toku krve" },
      { left: "Aorta", right: "Největší tepna vycházející ze srdce" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kostra", right: "Opora, ochrana, pohyb, krvetvorba" },
      { left: "Sval", right: "Stahuje se – vytváří pohyb nebo teplo" },
      { left: "Plíce", right: "Výměna plynů – O₂ dovnitř, CO₂ ven" },
      { left: "Srdce", right: "Pumpa udržující tok krve" },
    ],
  },
  {
    question: "Spoj součást krve s jejím popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Hemoglobin", right: "Protein v červených krvinkách vázající O₂" },
      { left: "Fibrin", right: "Bílkovina srážející krev při zranění" },
      { left: "Sérum", right: "Krevní plasma bez srážecích faktorů" },
      { left: "Lymfocyt", right: "Typ bílé krvinky – klíčový pro imunitu" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Dýchací centrum mozku", right: "Řídí rytmus dýchání automaticky" },
      { left: "Mezižeberní svaly", right: "Pomáhají bránici při dýchání" },
      { left: "Nosní přepážka", right: "Dělí nosní dutinu na dvě poloviny" },
      { left: "Mandle", right: "Imunitní tkáň v nosohltanu – první obrana" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Pumpuje krev tělem" },
      { left: "Kloub", right: "Pohyblivý spoj kostí umožňující pohyb" },
      { left: "Červené krvinky", right: "Přenášejí kyslík z plic do buněk" },
      { left: "Bránice", right: "Sval dýchání, odděluje hrudník od břicha" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Plíce", right: "Okysličují krev" },
      { left: "Tepny", right: "Vedou okysličenou krev od srdce" },
      { left: "Žíly", right: "Vedou odkysličenou krev k srdci" },
      { left: "Kosterní svaly", right: "Ovládají pohyb kostí vědomě" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Lebka", right: "Chrání mozek před poraněním" },
      { left: "Srdeční sval", right: "Nepřetržitě bije bez vědomé kontroly" },
      { left: "Alveola", right: "Váček v plicích pro výměnu plynů" },
      { left: "Červená kostní dřeň", right: "Tvoří červené a bílé krvinky" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Páteř", right: "Mechanická osa těla, chrání míchu" },
      { left: "Bílé krvinky", right: "Bojují s bakteriemi a viry" },
      { left: "Průdušnice", right: "Trubice vedoucí vzduch do plic" },
      { left: "Destičky", right: "Zastavují krvácení tvorbou krevní zátky" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Pravá předsíň", right: "Přijímá odkysličenou krev z těla" },
      { left: "Levá předsíň", right: "Přijímá okysličenou krev z plic" },
      { left: "Aorta", right: "Největší tepna vycházející z levé komory" },
      { left: "Plicní tepna", right: "Vede odkysličenou krev do plic" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kostra", right: "Základní nosná struktura těla" },
      { left: "Sval", right: "Přeměňuje chemickou energii na pohyb" },
      { left: "Plíce", right: "Zásobují krev kyslíkem" },
      { left: "Srdce", right: "Udržuje cirkulaci krve" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Dýchání nosem", right: "Filtruje, ohřívá a zvlhčuje vzduch" },
      { left: "Výdech CO₂", right: "Odpad buněčného dýchání opouštějící plíce" },
      { left: "Vdech O₂", right: "Kyslík vstupující do krve v alveolách" },
      { left: "Bránice", right: "Stahem dolů rozepíná plíce při vdechu" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Pumpuje krev tělem" },
      { left: "Plíce", right: "Vyměňují O₂ a CO₂" },
      { left: "Páteř", right: "Chrání míchu a nese váhu" },
      { left: "Šlacha", right: "Připevňuje sval ke kosti" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kolenní kloub", right: "Umožňuje ohýbání a natahování nohy" },
      { left: "Ramenní kloub", right: "Umožňuje pohyb paže do všech stran" },
      { left: "Kyčelní kloub", right: "Kulový kloub spojující stehno s pánví" },
      { left: "Loketní kloub", right: "Ohýbání a natahování předloktí" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Červené krvinky", right: "Přenášejí O₂ pomocí hemoglobinu" },
      { left: "Bílé krvinky", right: "Ničí patogeny (imunita)" },
      { left: "Destičky", right: "Pomáhají zastavit krvácení" },
      { left: "Plasma", right: "Přenáší živiny, hormony a odpadní látky" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Pumpuje krev tělem" },
      { left: "Kostra", right: "Drží tělo vzpřímené a chrání orgány" },
      { left: "Svaly", right: "Pohybují kostmi" },
      { left: "Krev", right: "Zásobuje buňky kyslíkem a živinami" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Nosohltán", right: "Propojuje nos s hrtanem" },
      { left: "Glotis", right: "Hlasová štěrbina v hrtanu" },
      { left: "Plicní povrch", right: "Celkem 70–100 m² pro výměnu plynů" },
      { left: "Kapilára plicní", right: "Tenká céva opletená kolem alveoly" },
    ],
  },
  {
    question: "Spoj orgán nebo součást s jeho funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Srdce", right: "Pumpuje krev tělem" },
      { left: "Plíce", right: "Provádějí výměnu dýchacích plynů" },
      { left: "Kostra", right: "Základ těla – opora a ochrana orgánů" },
      { left: "Svaly", right: "Generují sílu pro pohyb" },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
}

export const KOSTRAASVALYDYCHACIAOBEHOVASOUSTAVA: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava",
    title: "Kostra a svaly, dýchací a oběhová soustava",
    studentTitle: "Kostra a krev",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo - soustavy",
    briefDescription: "Pochopíš, jak funguje kostra, svaly, plíce a srdce.",
    keywords: ["kostra", "svaly", "srdce", "plíce", "krev", "alveoly", "tepny", "žíly", "klouby"],
    goals: ["Popsat funkce kostry a svalů", "Vysvětlit princip dýchání a výměny plynů", "Popsat malý a velký krevní oběh"],
    boundaries: ["Neprobírá biochemii krve", "Neprobírá kardiovaskulární choroby do hloubky"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Kostra: 206 kostí. Dýchání: nos → plíce → alveoly → krev. Srdce: malý (plíce) + velký (tělo) oběh.",
      steps: [
        "1. Kostra: opora + ochrana + pohyb + krvetvorba.",
        "2. Dýchání: nos → hrtan → průdušnice → plíce → alveoly.",
        "3. Alveoly: O₂ do krve, CO₂ ven.",
        "4. Srdce: malý oběh (plíce), velký oběh (tělo).",
        "5. Krev: červené (O₂), bílé (imunita), destičky (srážení).",
      ],
      commonMistake: "Tepny vedou krev OD srdce. Žíly vedou krev K srdci.",
      example: "Vdech: bránice dolů → plíce se rozepnou → vzduch dovnitř. Výdech: bránice nahoru → plíce se smrsknou.",
    },
  },
];
