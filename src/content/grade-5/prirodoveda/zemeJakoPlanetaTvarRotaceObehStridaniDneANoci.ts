import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { poradi, type Rada } from "../_poradi";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy neměly nápovědy k úloze ani
// vysvětlení, byly mezi nimi triviální řady (měsíce roku, hodiny dne) i věcné
// chyby („zemská osa se otáčí ze západu na východ“ — otáčí se Země, ne osa).
// Teď řady podle pravidla: L1 roční období, cesta Slunce po obloze, časové
// úseky · L2 slunovraty a rovnodennosti, planety, velikost těles · L3 pět
// planet, fáze Měsíce, délka dne v průběhu roku.

const PLANETY_PRAVIDLO = "Blíž ke Slunci jsou malé kamenné planety, dál obří planety z plynu a ledu.";
const PLANETY = [
  { text: "Merkur", proc: "je nejmenší planeta a obíhá nejblíž Slunci." },
  { text: "Venuše", proc: "je nejteplejší planeta, zahalená hustými mraky." },
  { text: "Země", proc: "je jediná planeta, o které víme, že je na ní život." },
  { text: "Mars", proc: "je rudá planeta s nejvyšší sopkou Sluneční soustavy." },
  { text: "Jupiter", proc: "je největší planeta." },
  { text: "Saturn", proc: "má nejnápadnější prstence." },
  { text: "Uran", proc: "obíhá Slunce nakloněný skoro na bok." },
  { text: "Neptun", proc: "je nejvzdálenější planeta." },
];

const RADY: Rada[] = [
  { uroven: 1, zadani: "Seřaď roční období tak, jak jdou po sobě během roku od jara do zimy.", kolik: 3,
    pravidlo: "Roční období se střídají, jak Země obíhá kolem Slunce.",
    polozky: [
      { text: "jaro", proc: "dny se prodlužují a příroda se probouzí." },
      { text: "léto", proc: "dny jsou nejdelší a Slunce stojí vysoko." },
      { text: "podzim", proc: "dny se krátí a listí opadává." },
      { text: "zima", proc: "dny jsou nejkratší a Slunce stojí nízko." },
    ] },
  { uroven: 1, zadani: "Seřaď, jak jde Slunce po obloze během dne od rána do večera.", kolik: 3,
    pravidlo: "Země se otáčí od západu k východu, proto Slunce vychází na východě a zapadá na západě.",
    polozky: [
      { text: "východ Slunce", proc: "Slunce se objeví na východě a stíny jsou dlouhé." },
      { text: "dopoledne", proc: "Slunce stoupá a stíny se zkracují." },
      { text: "poledne", proc: "Slunce stojí nejvýš, u nás na jihu, a stíny jsou nejkratší." },
      { text: "odpoledne", proc: "Slunce klesá k západu a stíny se prodlužují." },
      { text: "západ Slunce", proc: "Slunce zmizí na západě a nastane noc." },
    ] },
  { uroven: 1, zadani: "Seřaď časové úseky od nejkratšího po nejdelší.", kolik: 3,
    pravidlo: "Den je jedna otočka Země kolem osy, rok je jeden oběh Země kolem Slunce.",
    polozky: [
      { text: "minuta", proc: "má 60 sekund." },
      { text: "hodina", proc: "má 60 minut." },
      { text: "den", proc: "trvá 24 hodin — tak dlouho se Země jednou otočí." },
      { text: "měsíc", proc: "trvá asi 30 dní — zhruba tak dlouho oběhne Měsíc Zemi." },
      { text: "rok", proc: "trvá 365 dní — tak dlouho Země oběhne Slunce." },
    ] },

  { uroven: 2, zadani: "Seřaď slunovraty a rovnodennosti tak, jak jdou v kalendáři od ledna.", kolik: 3,
    pravidlo: "O rovnodennosti je den stejně dlouhý jako noc; o letním slunovratu je nejdelší den, o zimním nejkratší.",
    polozky: [
      { text: "jarní rovnodennost", proc: "kolem 21. března začíná astronomické jaro." },
      { text: "letní slunovrat", proc: "kolem 21. června je nejdelší den roku." },
      { text: "podzimní rovnodennost", proc: "kolem 23. září začíná astronomický podzim." },
      { text: "zimní slunovrat", proc: "kolem 21. prosince je nejkratší den roku." },
    ] },
  { uroven: 2, zadani: "Seřaď čtyři planety od nejbližší ke Slunci.", kolik: 4, pravidlo: PLANETY_PRAVIDLO, polozky: PLANETY },
  { uroven: 2, zadani: "Seřaď vesmírná tělesa od nejmenšího po největší.", kolik: 4,
    pravidlo: "Měsíc je menší než Země, Jupiter je největší planeta a Slunce je větší než všechny planety dohromady.",
    polozky: [
      { text: "Měsíc", proc: "je asi čtyřikrát menší než Země." },
      { text: "Země", proc: "je největší z kamenných planet." },
      { text: "Jupiter", proc: "je největší planeta Sluneční soustavy." },
      { text: "Slunce", proc: "je hvězda — vešlo by se do něj přes milion Zemí." },
      { text: "Mléčná dráha", proc: "je celá galaxie s miliardami hvězd, mezi nimi i Sluncem." },
    ] },

  { uroven: 3, zadani: "Seřaď pět planet od nejbližší ke Slunci.", kolik: 5, pravidlo: PLANETY_PRAVIDLO, polozky: PLANETY },
  { uroven: 3, zadani: "Seřaď fáze Měsíce v pořadí od novu přes úplněk zpět k novu.", kolik: 4,
    pravidlo: "Měsíc oběhne Zemi asi za měsíc. Od novu jeho osvětlená část roste až do úplňku a pak zase ubývá.",
    polozky: [
      { text: "nov", proc: "Měsíc je mezi Zemí a Sluncem a není vidět." },
      { text: "dorůstající srpek", proc: "večer je vidět tenký srpek, který přibývá." },
      { text: "první čtvrť", proc: "je osvětlená pravá polovina Měsíce." },
      { text: "úplněk", proc: "Země je mezi Sluncem a Měsícem a vidíme celý kotouč." },
      { text: "poslední čtvrť", proc: "je osvětlená levá polovina Měsíce." },
      { text: "ubývající srpek", proc: "ráno je vidět tenký srpek, který mizí." },
    ] },
  { uroven: 3, zadani: "Seřaď, jak se mění délka dne od zimního slunovratu do léta.", kolik: 3,
    pravidlo: "Po zimním slunovratu se dny prodlužují až do letního slunovratu.",
    polozky: [
      { text: "nejkratší den roku", proc: "je o zimním slunovratu kolem 21. prosince." },
      { text: "dny se prodlužují", proc: "v lednu a únoru světla přibývá." },
      { text: "den stejně dlouhý jako noc", proc: "je o jarní rovnodennosti kolem 21. března." },
      { text: "nejdelší den roku", proc: "je o letním slunovratu kolem 21. června." },
    ] },
];

function gen(level: number): PracticeTask[] {
  return poradi(RADY, level);
}

export const ZEMEJAKOPLANETATVARROTACEOBEHSTRIDANIDNEANOCI: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci",
    title: "Země jako planeta - tvar, rotace, oběh, střídání dne a noci",
    studentTitle: "Pohyby Země",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Pochopíš, proč se střídá den a noc a jak vznikají roční období.",
    keywords: ["rotace", "oběh", "den", "noc", "roční období", "slunovrat", "rovnodennost", "časová pásma"],
    goals: ["Vysvětlit střídání dne a noci rotací Země", "Popsat vztah sklonu osy k ročním obdobím", "Určit data slunovratů a rovnodenností"],
    boundaries: ["Neprobírá precesi zemské osy", "Neprobírá přesnou astronomii oběžných drah"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Rotace (24 h) → den/noc. Oběh + sklon osy (23,5°) → roční období.",
      steps: [
        "Rotace Země (kolem osy) = 24 hodin = den a noc.",
        "Oběh kolem Slunce = 365,25 dne = rok.",
        "Sklon osy = roční období (léto/zima).",
        "Nejdelší den: 21. 6. Nejkratší: 21. 12.",
      ],
      commonMistake: "Roční období NEZPŮSOBUJE vzdálenost od Slunce, ale sklon zemské osy!",
      example: "21. června: severní polokoule nakloněna ke Slunci → léto. 21. prosince: odkloněna → zima.",
    },
  },
];
