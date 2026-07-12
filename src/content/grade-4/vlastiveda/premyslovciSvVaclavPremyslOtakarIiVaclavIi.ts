import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), drag_order chronologie.
//   L1 = rozpoznání: 3 velké postavy v pořadí dynastie (Bořivoj → sv. Václav → …)
//   L2 = aplikace:   4 události se stoletím (Slované → Bořivoj → 935 → 1278/1306)
//   L3 = transfer:   5 událostí; pozor na past „stejné jméno, jiné číslo“ —
//                    Přemysl Otakar I. (1212) vs II. (1278), Václav II. vs III. (1306)
// `items` jsou ve SPRÁVNÉM chronologickém pořadí (UI je zamíchá).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď přemyslovské panovníky od nejstaršího po nejmladšího.",
    correctAnswer: "order",
    items: ["Bořivoj (první křesťanský kníže)", "Sv. Václav (patron Čech)", "Václav III. (poslední Přemyslovec)"],
    hints: ["Bořivoj přinesl křesťanství — byl na začátku.", "Václav III. byl posledním Přemyslovcem."],
    explanation: "Bořivoj byl prvním křesťanským přemyslovským knížetem. Sv. Václav se stal patronem Čech. Václav III. byl posledním mužským Přemyslovcem — jeho smrtí rod vymřel.",
  },
  {
    question: "Seřaď přemyslovské osobnosti od nejstarší po nejmladší.",
    correctAnswer: "order",
    items: ["Sv. Václav (10. stol.)", "Přemysl Otakar II. (13. stol.)", "Václav III. (14. stol.)"],
    hints: ["Sv. Václav žil v 10. století — nejdříve.", "Václav III. je ze 14. století — nejpozději."],
    explanation: "Sv. Václav žil v 10. století, Přemysl Otakar II. ve 13. století jako král železný a zlatý, Václav III. na počátku 14. století jako poslední Přemyslovec.",
  },
  {
    question: "Seřaď události Přemyslovců od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Bořivoj přijal křesťanství", "Sv. Václav zavražděn (935)", "Bitva na Moravském poli (1278)"],
    hints: ["Bořivoj byl první křesťanský kníže.", "Bitva na Moravském poli byla roku 1278 — nejpozději."],
    explanation: "Bořivoj přijal křesťanství jako první přemyslovský kníže. Sv. Václav byl zavražděn roku 935. Přemysl Otakar II. padl v bitvě na Moravském poli roku 1278.",
  },
  {
    question: "Seřaď od nejstaršího po nejmladšího.",
    correctAnswer: "order",
    items: ["Bořivoj (první historický kníže)", "Přemysl Otakar II. (král železný a zlatý)", "Václav III. (poslední Přemyslovec)"],
    hints: ["Bořivoj byl první.", "Václav III. uzavírá rod Přemyslovců."],
    explanation: "Bořivoj byl prvním historicky doloženým přemyslovským knížetem. Přemysl Otakar II. dovedl Čechy na vrchol moci. Václav III. byl posledním Přemyslovcem.",
  },
  {
    question: "Seřaď přemyslovské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Sv. Václav šíří křesťanství", "Přemysl Otakar II. na vrcholu moci", "Konec Přemyslovců (1306)"],
    hints: ["Sv. Václav byl v 10. století.", "Rod vymřel roku 1306."],
    explanation: "Sv. Václav šířil křesťanství v 10. století. Přemysl Otakar II. přivedl Čechy na vrchol moci ve 13. století. Roku 1306 rod Přemyslovců vymřel.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Příchod Slovanů do Čech (6. stol.)", "Sv. Václav zavražděn (935)", "Bitva na Moravském poli (1278)"],
    hints: ["Slované přišli jako první — v 6. století.", "Bitva na Moravském poli byla roku 1278."],
    explanation: "Slované přišli do Čech v 6. století. Sv. Václav byl zavražděn roku 935. Přemysl Otakar II. padl na Moravském poli roku 1278.",
  },
  {
    question: "Seřaď přemyslovské osobnosti od nejstarší po nejmladší.",
    correctAnswer: "order",
    items: ["Bořivoj (kníže)", "Sv. Václav (patron)", "Václav II. (kutnohorské stříbro)"],
    hints: ["Bořivoj byl první křesťanský kníže.", "Václav II. vládl ve 13.–14. století."],
    explanation: "Bořivoj přinesl křesťanství. Sv. Václav se stal patronem Čech. Václav II. proslul bohatstvím z kutnohorského stříbra.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Bořivoj přijal křesťanství", "Sv. Václav zavražděn (935)", "Konec Přemyslovců (1306)"],
    hints: ["Bořivoj byl první.", "Rod vymřel roku 1306 — nejpozději."],
    explanation: "Bořivoj byl prvním křesťanským knížetem. Sv. Václav byl zavražděn roku 935. Rod Přemyslovců vymřel roku 1306 smrtí Václava III.",
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejmladší.",
    correctAnswer: "order",
    items: ["Sv. Václav (patron Čech)", "Přemysl Otakar II. (král)", "Václav II. (král)"],
    hints: ["Sv. Václav žil v 10. století.", "Přemysl Otakar II. vládl před Václavem II."],
    explanation: "Sv. Václav byl patronem Čech v 10. století. Přemysl Otakar II. vládl ve 13. století jako mocný král. Po jeho smrti nastoupil Václav II.",
  },
  {
    question: "Seřaď od nejstaršího po nejmladšího.",
    correctAnswer: "order",
    items: ["Bořivoj (první křesťanský kníže)", "Sv. Václav (patron Čech)", "Přemysl Otakar II. (král železný a zlatý)"],
    hints: ["Bořivoj byl první.", "Přemysl Otakar II. je ze 13. století — nejpozdější z těchto tří."],
    explanation: "Bořivoj přinesl křesťanství. Sv. Václav se stal patronem Čech v 10. století. Přemysl Otakar II. přivedl Čechy na vrchol moci ve 13. století.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď události z dějin Přemyslovců od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první pokřtěný přemyslovský kníže",
      "Sv. Václav zavražděn bratrem Boleslavem (935)",
      "Přemysl Otakar I. – Čechy dědičným královstvím (1212)",
      "Bitva na Moravském poli – smrt Přemysla Otakara II. (1278)",
    ],
    hints: ["Bořivoj byl první, bitva na Moravském poli (1278) poslední.", "Sv. Václav zemřel roku 935, dědičné království vzniklo 1212."],
    explanation: "Přemyslovci začali jako knížata, ale rostli v síle. Sv. Václav (†935) dal dynastii patrona. Přemysl Otakar I. získal roku 1212 dědičný královský titul a rod dosáhl vrcholu za Přemysla Otakara II. — než padl roku 1278.",
  },
  {
    question: "Seřaď přemyslovské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů do Čech (6. stol.)",
      "Bořivoj přijal křesťanství",
      "Zavraždění sv. Václava (935)",
      "Václav II. – zlaté časy kutnohorského stříbra",
    ],
    hints: ["Slované přišli jako první.", "935 byl rok zavraždění sv. Václava, Václav II. vládl mnohem později."],
    explanation: "Slované přišli do Čech bez křesťanství — to jim přinesli Přemyslovci. Bořivoj a sv. Václav zakotvili nové náboženství. Václav II. pak žil v dostatku díky stříbru z Kutné Hory.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav šíří křesťanství v Čechách",
      "Přemysl Otakar I. – dědičné království (1212)",
      "Bitva na Moravském poli – smrt Přemysla Otakara II. (1278)",
      "Václav III. zavražděn – konec Přemyslovců (1306)",
    ],
    hints: ["Sv. Václav byl nejdříve, zánik Přemyslovců (1306) nejpozději.", "Dědičné království (1212) je před bitvou na Moravském poli (1278)."],
    explanation: "Sv. Václav byl mravním symbolem Čech. Přemysl Otakar I. získal dědičný titul (1212). Přemysl Otakar II. padl roku 1278. Roku 1306 byl zavražděn Václav III. a rod vymřel.",
  },
  {
    question: "Seřaď přemyslovské osobnosti od nejstarší po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj (první historický kníže)",
      "Sv. Václav (patron Čech, †935)",
      "Přemysl Otakar II. (†1278)",
      "Václav III. (poslední Přemyslovec, †1306)",
    ],
    hints: ["Bořivoj byl první, Václav III. poslední.", "Sv. Václav žil v 10. stol., Přemysl Otakar II. ve 13. stol."],
    explanation: "Bořivoj přinesl křesťanství, Václav dal dynastii patrona (†935), Přemysl Otakar II. přivedl Čechy na vrchol moci (†1278) a Václav III. byl zavražděn roku 1306 bez dědice — rod vymřel.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj přijal křesťanství",
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar II. padl na Moravském poli (1278)",
      "Václav III. zavražděn (1306)",
    ],
    hints: ["Bořivoj a sv. Václav tvoří starší dvojici.", "Moravské pole (1278) je před koncem rodu (1306)."],
    explanation: "Bořivoj přinesl křesťanství, sv. Václav byl zavražděn roku 935. Přemysl Otakar II. padl na Moravském poli (1278) a rod uzavřel Václav III. roku 1306.",
  },
  {
    question: "Seřaď přemyslovské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů (6. stol.)",
      "Zavraždění sv. Václava (935)",
      "Přemysl Otakar I. – dědičné království (1212)",
      "Bitva na Moravském poli (1278)",
    ],
    hints: ["Slované přišli jako první.", "Dědičné království (1212) je před bitvou na Moravském poli (1278)."],
    explanation: "Slované přišli v 6. století. Sv. Václav byl zavražděn roku 935. Přemysl Otakar I. získal dědičný královský titul (1212). Přemysl Otakar II. padl na Moravském poli roku 1278.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první křesťanský kníže",
      "Sv. Václav zavražděn (935)",
      "Václav II. – kutnohorské stříbro",
      "Václav III. – konec Přemyslovců (1306)",
    ],
    hints: ["Bořivoj a sv. Václav jsou starší dvojice.", "Václav II. vládl před Václavem III. (†1306)."],
    explanation: "Bořivoj přinesl křesťanství, sv. Václav byl zavražděn roku 935. Václav II. proslul bohatstvím z kutnohorského stříbra. Jeho syn Václav III. byl zavražděn roku 1306 — rod vymřel.",
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejmladší.",
    correctAnswer: "order",
    items: [
      "Sv. Václav (patron Čech, 10. stol.)",
      "Přemysl Otakar I. (dědičné království, 1212)",
      "Přemysl Otakar II. (Moravské pole, 1278)",
      "Václav II. (kutnohorské stříbro)",
    ],
    hints: ["Sv. Václav je z 10. století.", "Přemysl Otakar I. (1212) vládl před Přemyslem Otakarem II. (1278)."],
    explanation: "Sv. Václav byl patronem v 10. století. Přemysl Otakar I. získal dědičné království (1212). Přemysl Otakar II. padl roku 1278. Po něm vládl Václav II. s bohatstvím z Kutné Hory.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj přijal křesťanství",
      "Sv. Václav zavražděn (935)",
      "Bitva na Moravském poli (1278)",
      "Konec Přemyslovců (1306)",
    ],
    hints: ["Bořivoj byl první.", "Moravské pole (1278) je před koncem rodu (1306)."],
    explanation: "Bořivoj přinesl křesťanství, sv. Václav byl zavražděn roku 935. Přemysl Otakar II. padl na Moravském poli (1278). Rod vymřel roku 1306 smrtí Václava III.",
  },
  {
    question: "Seřaď přemyslovské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů (6. stol.)",
      "Bořivoj – první křesťanský kníže",
      "Sv. Václav zavražděn (935)",
      "Bitva na Moravském poli (1278)",
    ],
    hints: ["Slované přišli jako první, pak Bořivoj.", "Sv. Václav (935) je před bitvou na Moravském poli (1278)."],
    explanation: "Slované přišli v 6. století. Bořivoj přinesl křesťanství. Sv. Václav byl zavražděn roku 935. Přemysl Otakar II. padl na Moravském poli roku 1278.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď události Přemyslovců od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první křesťanský kníže",
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar I. – dědičné království (1212)",
      "Přemysl Otakar II. padl na Moravském poli (1278)",
      "Václav III. zavražděn – konec rodu (1306)",
    ],
    hints: ["Pozor: Přemysl Otakar I. (1212) vládl dřív než Přemysl Otakar II. (1278).", "Stejné jméno, jiné číslo — nižší číslo bylo dřív."],
    explanation: "Bořivoj přinesl křesťanství, sv. Václav byl zavražděn (935). Přemysl Otakar I. získal dědičné království (1212), jeho vnuk Přemysl Otakar II. padl roku 1278. Rod uzavřel Václav III. (1306).",
  },
  {
    question: "Seřaď přemyslovské osobnosti od nejstarší po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj (první historický kníže)",
      "Sv. Václav (patron Čech, †935)",
      "Přemysl Otakar II. (†1278)",
      "Václav II. (kutnohorské stříbro)",
      "Václav III. (poslední Přemyslovec, †1306)",
    ],
    hints: ["Pozor na dva Václavy: Václav II. vládl před Václavem III.", "Nižší číslo znamená dřívější panování."],
    explanation: "Bořivoj, sv. Václav (†935) a Přemysl Otakar II. (†1278) tvoří starší část. Pak vládl Václav II. (kutnohorské stříbro) a nakonec jeho syn Václav III. (†1306) — rod vymřel.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů (6. stol.)",
      "Bořivoj – první křesťanský kníže",
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar I. – dědičné království (1212)",
      "Bitva na Moravském poli (1278)",
    ],
    hints: ["Slované a Bořivoj tvoří nejstarší dvojici.", "Přemysl Otakar I. (1212) byl před Přemyslem Otakarem II. na Moravském poli (1278)."],
    explanation: "Slované přišli v 6. století, Bořivoj přinesl křesťanství, sv. Václav byl zavražděn (935). Přemysl Otakar I. získal dědičné království (1212) a Přemysl Otakar II. padl roku 1278.",
  },
  {
    question: "Seřaď přemyslovské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar I. – dědičné království (1212)",
      "Bitva na Moravském poli (1278)",
      "Václav II. – král český a polský",
      "Václav III. zavražděn (1306)",
    ],
    hints: ["Přemysl Otakar I. (1212) je před bitvou na Moravském poli (1278).", "Václav II. vládl mezi rokem 1278 a smrtí Václava III. (1306)."],
    explanation: "Sv. Václav (†935), dědičné království za Přemysla Otakara I. (1212), pád Přemysla Otakara II. na Moravském poli (1278). Pak vládl Václav II. a rod uzavřel Václav III. (1306).",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj přijal křesťanství",
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar II. padl na Moravském poli (1278)",
      "Václav II. – kutnohorské stříbro",
      "Václav III. – konec Přemyslovců (1306)",
    ],
    hints: ["Bořivoj a sv. Václav jsou nejstarší.", "Václav II. vládl po roce 1278 a před smrtí Václava III. (1306)."],
    explanation: "Bořivoj přinesl křesťanství, sv. Václav byl zavražděn (935). Přemysl Otakar II. padl roku 1278, po něm vládl Václav II. (kutnohorské stříbro) a nakonec Václav III. († 1306).",
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj (první křesťanský kníže)",
      "Sv. Václav (patron Čech, †935)",
      "Přemysl Otakar I. (dědičné království, 1212)",
      "Přemysl Otakar II. (Moravské pole, 1278)",
      "Václav III. (poslední Přemyslovec, 1306)",
    ],
    hints: ["Pozor na dva Otakary: I. (1212) byl dřív než II. (1278).", "Václav III. uzavírá rod roku 1306."],
    explanation: "Bořivoj, sv. Václav (†935), Přemysl Otakar I. s dědičným královstvím (1212), Přemysl Otakar II. na Moravském poli (1278) a Václav III. (1306). Nižší číslo u jména znamená dřívější panovníka.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů (6. stol.)",
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar I. – dědičné království (1212)",
      "Bitva na Moravském poli (1278)",
      "Václav III. – konec Přemyslovců (1306)",
    ],
    hints: ["Slované a sv. Václav tvoří starší část.", "Přemysl Otakar I. (1212) je před Moravským polem (1278)."],
    explanation: "Slované přišli v 6. století, sv. Václav byl zavražděn (935). Přemysl Otakar I. získal dědičné království (1212), Přemysl Otakar II. padl roku 1278 a rod uzavřel Václav III. (1306).",
  },
  {
    question: "Seřaď přemyslovské osobnosti od nejstarší po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj (první historický kníže)",
      "Sv. Václav (†935)",
      "Přemysl Otakar I. (dědičné království, 1212)",
      "Přemysl Otakar II. (†1278)",
      "Václav II. (kutnohorské stříbro)",
    ],
    hints: ["Dva Otakary rozliš podle čísla: I. (1212) před II. (1278).", "Václav II. vládl až po smrti Přemysla Otakara II. (1278)."],
    explanation: "Bořivoj, sv. Václav (†935), Přemysl Otakar I. (1212), Přemysl Otakar II. (†1278) a Václav II. (kutnohorské stříbro). Otakar I. vládl dřív než Otakar II. — nižší číslo, dřívější doba.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první křesťanský kníže",
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar I. – dědičné království (1212)",
      "Václav II. – kutnohorské stříbro",
      "Václav III. – konec rodu (1306)",
    ],
    hints: ["Přemysl Otakar I. (1212) je uprostřed.", "Václav II. vládl před svým synem Václavem III. (†1306)."],
    explanation: "Bořivoj, sv. Václav (†935), dědičné království za Přemysla Otakara I. (1212). Pak Václav II. (kutnohorské stříbro) a nakonec Václav III. (†1306). Dva Václavy rozlišíš podle čísla.",
  },
  {
    question: "Seřaď přemyslovské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů (6. stol.)",
      "Bořivoj přijal křesťanství",
      "Sv. Václav zavražděn (935)",
      "Přemysl Otakar II. – Moravské pole (1278)",
      "Václav III. – konec Přemyslovců (1306)",
    ],
    hints: ["Slované a Bořivoj jsou nejstarší.", "Moravské pole (1278) je těsně před koncem rodu (1306)."],
    explanation: "Slované přišli v 6. století, Bořivoj přinesl křesťanství, sv. Václav byl zavražděn (935). Přemysl Otakar II. padl na Moravském poli (1278) a rod uzavřel Václav III. (1306).",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const PREMYSLOVCISVVACLAVPREMYSLOTAKARIIVACLAVII: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    title: "Přemyslovci - sv. Václav, Přemysl Otakar II., Václav II.",
    studentTitle: "Přemyslovci",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš první českou dynastii — od sv. Václava po poslední Přemyslovce.",
    keywords: ["Přemyslovci", "sv. Václav", "Bořivoj", "Přemysl Otakar II.", "Václav II.", "Moravské pole", "1306"],
    goals: [
      "Znát sv. Václava a Bořivoje",
      "Vědět o vrcholu moci za Přemysla Otakara II.",
      "Znát bitvu na Moravském poli (1278)",
      "Vědět, kdy a jak rod Přemyslovců vymřel",
    ],
    boundaries: ["Detailní genealogie není vyžadována", "Politické spory do hloubky nejsou cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Bořivoj (křesťanství) → sv. Václav (†935) → Přemysl Otakar I. (dědičné království 1212) → Přemysl Otakar II. (Moravské pole 1278) → Václav II. → Václav III. (†1306).",
      steps: [
        "Bořivoj = první křesťanský kníže",
        "Sv. Václav = patron Čech, zavražděn 935",
        "Přemysl Otakar II. = vrchol moci, padl 1278",
        "Václav III. = poslední Přemyslovec, †1306",
      ],
      commonMistake: "Žáci si pletou Přemysla Otakara I. (1212) s Přemyslem Otakarem II. (1278) a Václava II. s Václavem III. — nižší číslo = dřívější panovník.",
      example: "Sv. Václav 935 → Přemysl Otakar I. 1212 → Přemysl Otakar II. 1278 → Václav III. 1306.",
    },
  },
];
