/**
 * Dějepis 6. ročník — Co je dějepis (význam studia minulosti).
 *
 * FAKTICKÝ vzor typu select_one (žák VYBÍRÁ, neuvádí volnou odpověď). Procvičuje
 * jádro úvodní kapitoly dějepisu: rozlišit DĚJINY (co se v minulosti SKUTEČNĚ
 * STALO) od DĚJEPISU (VĚDA, která tu minulost zkoumá z pramenů), vědět, čím se
 * historik zabývá, a proč minulost studujeme.
 *
 * Chybový model 2. stupně platí i na čistě pojmovém tématu — každý distraktor =
 * jeden konkrétní typický omyl, ne náhodný posun:
 *  • záměna pojmů (dějiny = věda, dějepis = co se stalo),
 *  • historik „věští" budoucnost / předpovídá počasí,
 *  • dějepis = jen války, králové a data k memorování,
 *  • „studujeme minulost, abychom ji změnili" + záměna doby (teď/budoucnost místo minulosti).
 * Každý distraktor nese optionFeedback, který tu chybu pojmenuje a opraví.
 *
 * Reálná gradace (znění L1 a L3 je DISJUNKTNÍ — audit difficulty_progression
 * porovnává texty otázek):
 *  • L1 — čistá definice / doplnění pojmu do dvojice + který čas dějepis zkoumá (jeden krok).
 *  • L2 — použití pojmu na popsanou ČINNOST (událost → dějiny, práce s prameny → dějepis).
 *  • L3 — hraniční případy: co spadá / nespadá do náplně historika a PROČ minulost
 *         studovat (poučení vs. „abychom ji změnili"). Vyžaduje pochopit hranici vědy.
 *
 * GIVEAWAY: v definičních otázkách se hledaný pojem (DĚJEPIS/DĚJINY) NIKDY
 * nevyskytuje ve znění otázky — ptáme se opisem („věda zkoumající minulost",
 * „vše, co se skutečně stalo"). Žák musí pojem znát, ne ho jen přečíst.
 *
 * Téma záměrně nemíchá typy (vyhýbá se Cause C: select_one téma emituje jen
 * úlohy s `options`).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pickN, buildChoiceTask as choice } from "./_shared";

// Dvě jádrová slova tématu (drží se konvence VELKÝMI v zadání pro zdůraznění).
const DEJINY = "Dějiny";
const DEJEPIS = "Dějepis";

// ── Pooly úloh po úrovních ──────────────────────────────────────────────────
// L1 — čistá definice / doplnění pojmu + řazení času. Jeden krok, žádná situace.
const L1: PracticeTask[] = [
  // (a) VĚDA zkoumající minulost → DĚJEPIS (slovo „dějepis" není v otázce)
  choice(
    "Jak se jmenuje VĚDA (obor), která zkoumá lidskou minulost?",
    DEJEPIS,
    [
      {
        value: DEJINY,
        why: "Dějiny jsou to, co se v minulosti SKUTEČNĚ STALO — samotné události. VĚDA, která je zkoumá, se jmenuje dějepis.",
      },
      {
        value: "Zeměpis",
        why: "Zeměpis zkoumá Zemi, krajinu a státy v prostoru, ne minulost lidí. Vědě o minulosti říkáme dějepis.",
      },
      {
        value: "Přírodopis",
        why: "Přírodopis zkoumá živou přírodu (rostliny, živočichy), ne lidskou minulost. Tu zkoumá dějepis.",
      },
    ],
    {
      hints: [
        "Hledáš název školního OBORU / vědy, ne to, co se stalo.",
        "Je to věda, která pracuje s historickými prameny a zkoumá, jak žili lidé dřív.",
      ],
      explanation:
        "Dějepis je VĚDA (obor), která zkoumá lidskou minulost z pramenů. Dějiny naproti tomu jsou samotné události — to, co se skutečně stalo.",
    },
  ),
  // (b) Vše, co se SKUTEČNĚ STALO → DĚJINY (slovo „dějiny" není v otázce)
  choice(
    "Jak označujeme vše, co se v minulosti SKUTEČNĚ STALO (samotné události)?",
    DEJINY,
    [
      {
        value: DEJEPIS,
        why: "Dějepis je VĚDA, která minulost zkoumá. Samotné události, které se staly, se nazývají dějiny.",
      },
      {
        value: "Báje",
        why: "Báje je smyšlený příběh (často o bozích a vzniku světa). To, co se opravdu stalo, jsou dějiny.",
      },
      {
        value: "Budoucnost",
        why: "Budoucnost se teprve stane a neznáme ji. To, co už proběhlo, jsou dějiny.",
      },
    ],
    {
      hints: [
        "Nehledáš název vědy, ale označení pro samotné UDÁLOSTI, které proběhly.",
        "Je to souhrn toho, co se opravdu odehrálo — ne věda, která to zkoumá.",
      ],
      explanation:
        "Dějiny jsou souhrn všeho, co se v minulosti skutečně stalo (události samy). Dějepis je až VĚDA, která tyto dějiny zkoumá z pramenů.",
    },
  ),
  // (c) Doplň pojem do dvojice: …………… zkoumá ……………
  choice(
    "Doplň dvojici: „……… je věda, která zkoumá ……… (to, co se stalo).“",
    `${DEJEPIS} — dějiny`,
    [
      {
        value: "Dějiny — dějepis",
        why: "Prohodil jsi pojmy. VĚDA je dějepis; to, co se stalo, jsou dějiny. Správně: dějepis zkoumá dějiny.",
      },
      {
        value: "Dějepis — dějepis",
        why: "Obě slova nemohou být stejná. Věda (dějepis) zkoumá něco jiného — dějiny (události).",
      },
      {
        value: "Dějiny — dějiny",
        why: "Obě slova nemohou být stejná. Hledá se dvojice věda + její předmět: dějepis zkoumá dějiny.",
      },
    ],
    {
      hints: [
        "Na první místo patří VĚDA, na druhé to, co tato věda zkoumá.",
        "Věda a její předmět jsou dvě různá slova — nesmí být stejná.",
      ],
      explanation:
        "Dějepis (věda) zkoumá dějiny (události, které se staly). Jsou to dva různé pojmy: jeden je obor, druhý je jeho předmět zkoumání.",
    },
  ),
  // (d) Který čas zkoumá dějepis — žák musí pojem vybavit, ne přečíst pořadí.
  //     (dřív tu bylo řazení „minulost → … → budoucnost", které odpověď
  //      prozrazovalo doslova ve znění možnosti — nahrazeno.)
  choice(
    "Kterou dobu (čas) zkoumá dějepis?",
    "To, co už bylo a stalo se",
    [
      {
        value: "To, co se děje právě teď",
        why: "To, co probíhá právě teď, je přítomnost. Dějepis se ale dívá dozadu — zkoumá, co se už stalo.",
      },
      {
        value: "To, co teprve nastane",
        why: "To, co se teprve stane, je budoucnost a tu nikdo přesně nezná. Dějepis zkoumá minulost — co už proběhlo.",
      },
      {
        value: "Všechny tři doby najednou stejně",
        why: "Dějepis se nezabývá vším stejně — soustředí se na to, co se už stalo (minulost), ne na teď a na budoucnost.",
      },
    ],
    {
      hints: [
        "Historik se vždy dívá dozadu — k tomu, co je už za námi.",
        "Vyber dobu, kterou nelze změnit, protože už proběhla.",
      ],
      explanation:
        "Dějepis zkoumá minulost — to, co se už stalo a co už nelze změnit. Přítomnost (teď) a budoucnost (co teprve bude) předmětem dějepisu nejsou.",
    },
  ),
];

// L2 — použití pojmu na popsanou ČINNOST nebo situaci (událost vs. práce historika).
const L2: PracticeTask[] = [
  // (a) konkrétní událost → DĚJINY
  choice(
    "Bitva u Lipan se odehrála roku 1434. Čím je tato bitva?",
    "Událost, která se stala (dějiny)",
    [
      {
        value: "Věda, která zkoumá minulost (dějepis)",
        why: "Bitva je UDÁLOST, která proběhla — patří do dějin. Dějepis je až věda, která takové události zkoumá.",
      },
      {
        value: "Práce historika v knihovně",
        why: "Bitvu nikdo nezkoumal v knihovně — prostě se stala. Je to událost (dějiny), ne práce historika.",
      },
      {
        value: "Předpověď, co se teprve stane",
        why: "Rok 1434 je dávno v minulosti — událost už proběhla. Není to předpověď budoucnosti.",
      },
    ],
    {
      hints: [
        "Rozhodni: jde o samotnou UDÁLOST, která proběhla, nebo o vědu, která ji zkoumá?",
        "Něco, co se v určitém roce stalo, patří mezi dějiny (události).",
      ],
      explanation:
        "Bitva u Lipan je konkrétní událost, která se v minulosti stala — patří tedy do dějin. Dějepis by byl až popis a zkoumání této bitvy historikem.",
    },
  ),
  // (b) popis činnosti historika → DĚJEPIS
  choice(
    "Paní učitelka zkoumá staré listiny, aby zjistila, jak žili lidé ve středověku. Co dělá?",
    "Pracuje jako historik (dějepis)",
    [
      {
        value: "Vytváří novou událost (dějiny)",
        why: "Žádnou událost nevytváří — zkoumá prameny o minulosti. To je práce historika, tedy dějepis.",
      },
      {
        value: "Předpovídá, co se stane příští rok",
        why: "Nezkoumá budoucnost, ale minulost (středověk) z listin. Předpovídání není úkol dějepisu.",
      },
      {
        value: "Zkoumá přírodu a počasí",
        why: "Listiny o životě lidí nejsou příroda ani počasí. Zkoumání minulosti lidí z pramenů je dějepis.",
      },
    ],
    {
      hints: [
        "Rozhodni podle činnosti: zkoumá někdo prameny o minulosti, nebo se sama něco děje?",
        "Práce s prameny (listiny) s cílem poznat minulost je úkol vědy o minulosti.",
      ],
      explanation:
        "Zkoumání starých pramenů (listin) s cílem zjistit, jak lidé dřív žili, je přesně práce historika — tedy dějepis (věda). Sama o sobě to není událost.",
    },
  ),
  // (c) čím se historik ZABÝVÁ (vs. počasí na zítřek)
  choice(
    "Kterou z těchto věcí ZKOUMÁ historik?",
    "Jak žili lidé v minulosti",
    [
      {
        value: "Jaké bude zítra počasí",
        why: "Počasí na zítřek je budoucnost a patří meteorologii, ne dějepisu. Historik zkoumá minulost lidí.",
      },
      {
        value: "Které číslo padne v loterii",
        why: "Náhodný výsledek v budoucnu nikdo nezkoumá. Historik se zabývá tím, co už se stalo.",
      },
      {
        value: "Jak se rozmnožují rostliny",
        why: "Rozmnožování rostlin patří přírodopisu. Historik zkoumá minulost lidí, ne přírodní děje.",
      },
    ],
    {
      hints: [
        "Historik se vždy dívá dozadu, do minulosti — ne do budoucna a ne na přírodu bez lidí.",
        "Vyber to, co se týká života LIDÍ v minulosti.",
      ],
      explanation:
        "Historik zkoumá minulost lidí — jak žili, mysleli a proč jednali. Počasí na zítřek (budoucnost) ani přírodní děje bez lidí do dějepisu nepatří.",
    },
  ),
  // (d) událost vs. zkoumání — pojmenování dvojice
  choice(
    "Hrad byl postaven ve 13. století. Archeolog dnes zkoumá jeho zbytky. Co je co?",
    "Stavba hradu = dějiny, zkoumání = dějepis",
    [
      {
        value: "Stavba hradu = dějepis, zkoumání = dějiny",
        why: "Prohodil jsi to. Postavení hradu je UDÁLOST (dějiny); jeho dnešní zkoumání je práce vědy (dějepis).",
      },
      {
        value: "Obojí jsou dějiny",
        why: "Dnešní zkoumání není událost z minulosti — je to práce historika, tedy dějepis. Dějiny jsou jen stavba hradu.",
      },
      {
        value: "Obojí je dějepis",
        why: "Postavení hradu se stalo — to jsou dějiny (událost). Dějepis je až dnešní zkoumání jeho zbytků.",
      },
    ],
    {
      hints: [
        "Co se v minulosti STALO, jsou dějiny; co dnes někdo ZKOUMÁ, je dějepis.",
        "Jedna část je dávná událost, druhá je dnešní práce s prameny.",
      ],
      explanation:
        "Postavení hradu ve 13. století je událost — patří do dějin. To, že ho dnes archeolog zkoumá, je práce vědy o minulosti — dějepis. Jsou to dvě různé věci.",
    },
  ),
];

// L3 — hraniční případy + PROČ studovat minulost. Žák rozhoduje na hranici vědy.
const L3: PracticeTask[] = [
  // (a) co NEPATŘÍ do náplně historika (budoucnost)
  choice(
    "Která z těchto věcí NEPATŘÍ do práce historika?",
    "Přesně předpovědět, co se stane příští rok",
    [
      {
        value: "Zkoumat, jak lidé žili před tisíci lety",
        why: "To je přímo náplň dějepisu — poznávat minulost lidí. Tahle činnost do práce historika PATŘÍ.",
      },
      {
        value: "Hledat příčiny, proč vypukla válka",
        why: "Hledat příčiny dávných událostí je úkol historika. Patří to do dějepisu, takže to není správná odpověď.",
      },
      {
        value: "Číst staré kroniky a listiny",
        why: "Práce s písemnými prameny je základ dějepisu. Tahle činnost do práce historika patří.",
      },
    ],
    {
      hints: [
        "Tři z možností míří do minulosti, jedna do budoucnosti — ta je mimo dějepis.",
        "Historik umí vysvětlit, co se STALO; budoucnost přesně předpovědět neumí nikdo.",
      ],
      explanation:
        "Historik zkoumá MINULOST — prameny, příčiny, život lidí. Budoucnost přesně předpovědět nedokáže (to není úkol žádné vědy o minulosti), proto tahle činnost do dějepisu nepatří.",
    },
  ),
  // (b) hranice: přírodní jev bez lidí / výmysl vs. minulost lidí
  choice(
    "Čím se historik NEzabývá?",
    "Sopečnou činností na pusté planetě bez lidí",
    [
      {
        value: "Tím, jak se ve městě dřív obchodovalo",
        why: "Každodenní život lidí v minulosti (obchod) je jádro dějepisu. Tím se historik zabývá.",
      },
      {
        value: "Tím, jaké nástroje používali dávní lovci",
        why: "Nástroje dávných lidí zkoumá dějepis (i archeologie). Tím se historik zabývá.",
      },
      {
        value: "Tím, proč zanikla starověká říše",
        why: "Příčiny zániku říší jsou klasické téma dějepisu. Tím se historik zabývá.",
      },
    ],
    {
      hints: [
        "Dějepis je věda o minulosti LIDÍ — kde nejsou lidé, tam nemá co zkoumat.",
        "Vyber to, co se vůbec netýká lidí a jejich života.",
      ],
      explanation:
        "Dějepis zkoumá minulost LIDÍ — jejich život, výrobu, příčiny událostí. Přírodní jev na planetě bez lidí se lidské minulosti netýká, proto do dějepisu nepatří (to by byla přírodní věda).",
    },
  ),
  // (c) PROČ studovat minulost — platný důvod vs. „abychom ji změnili"
  choice(
    "Proč má smysl studovat minulost?",
    "Abychom se z ní poučili a lépe rozuměli dnešku",
    [
      {
        value: "Abychom mohli změnit, co se kdysi stalo",
        why: "Minulost změnit NELZE — už se stala. Studujeme ji kvůli poučení a pochopení dneška, ne kvůli změně.",
      },
      {
        value: "Abychom přesně předpověděli, co nás čeká",
        why: "Z minulosti se poučíme, ale přesně předpovědět budoucnost neumíme. Smyslem je porozumět, ne věštit.",
      },
      {
        value: "Abychom se nemuseli učit nic nového",
        why: "Studium minulosti naopak rozšiřuje vědění. Smyslem je poučit se a chápat kořeny dneška.",
      },
    ],
    {
      hints: [
        "Co se už stalo, nezměníme — tak k čemu nám poznání minulosti vlastně je?",
        "Mysli na poučení, na kořeny dneška a na pochopení, proč je svět takový, jaký je.",
      ],
      explanation:
        "Minulost už nelze změnit. Studujeme ji proto, abychom se poučili z chyb i úspěchů, poznali kořeny dneška a lépe rozuměli tomu, proč svět vypadá, jak vypadá.",
    },
  ),
  // (d) hraniční: fikce/výmysl vs. doložená událost
  choice(
    "Které z toho je téma pro historika (skutečná minulost), a ne výmysl?",
    "Život rytířů na středověkém hradě doložený prameny",
    [
      {
        value: "Příběh draka, který hlídal poklad v jeskyni",
        why: "Drak je smyšlený — patří do bájí, ne do dějin. Historik zkoumá to, co je doložené prameny.",
      },
      {
        value: "Dobrodružství vymyšleného hrdiny z filmu",
        why: "Vymyšlená filmová postava se nestala doopravdy. Dějepis se zabývá skutečnou, doloženou minulostí.",
      },
      {
        value: "Co se podle pověsti stane na hradě za sto let",
        why: "To míří do budoucnosti a je to navíc pověst (výmysl). Historik zkoumá doloženou minulost, ne budoucí pověsti.",
      },
    ],
    {
      hints: [
        "Historik staví na tom, co lze doložit prameny — ne na smyšlených příbězích.",
        "Vyber to, co se opravdu odehrálo a o čem máme doklady.",
      ],
      explanation:
        "Dějepis zkoumá skutečnou minulost doloženou prameny (např. život rytířů na hradě). Draci, vymyšlení hrdinové a pověsti o budoucnosti jsou fikce — do dějin nepatří.",
    },
  ),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? L1 : level === 2 ? L2 : L3;
  // Vrátí celý pool v náhodném pořadí (orchestrátor pak vybere sessionTaskCount).
  // options jsou už zamíchané uvnitř buildChoiceTask, klíč zůstává mezi nimi.
  return pickN(pool, pool.length);
}

// ── Topic ────────────────────────────────────────────────────────────────
export const CO_JE_DEJEPIS: TopicMetadata[] = [
  {
    id: "g6-dej-co-je-dejepis-6",
    rvpNodeId:
      "g6-dejepis-uvod-do-dejepisu-historie-a-historicke-prameny-co-je-dejepis-vyznam-studia-minulosti",
    displayName: "Co je dějepis",
    title: "Co je dějepis – význam studia minulosti",
    studentTitle: "Co je dějepis",
    subject: "dejepis",
    category: "Úvod do dějepisu",
    topic: "Historie a historické prameny",
    briefDescription: "Rozlišíš dějiny (co se stalo) od dějepisu (vědy) a proč minulost studujeme.",
    keywords: [
      "dějepis", "dějiny", "historik", "minulost", "význam studia minulosti",
      "věda o minulosti", "prameny", "poučení", "čas", "události",
    ],
    goals: [
      "Rozlišit dějiny (co se skutečně stalo) od dějepisu (vědy, která to zkoumá).",
      "Rozhodnout, čím se historik zabývá a čím ne (minulost lidí ano, budoucnost ne).",
      "Vysvětlit, proč studujeme minulost (poučení, pochopení dneška).",
    ],
    boundaries: [
      "Jen rozlišení pojmů dějiny/dějepis a náplně práce historika.",
      "Hranice vědy: budoucnost, příroda bez lidí a výmysl do dějepisu nepatří.",
      "Nezahrnuje konkrétní dějinné události zpaměti ani periodizaci.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 4,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Dějiny = co se v minulosti SKUTEČNĚ STALO (události). Dějepis = VĚDA, která tyto dějiny zkoumá z pramenů. Historik zkoumá minulost lidí — ne budoucnost, ne přírodu bez lidí, ne výmysly.",
      steps: [
        "Ptej se: jde o samotnou UDÁLOST (dějiny), nebo o ZKOUMÁNÍ minulosti (dějepis)?",
        "Historik se dívá do minulosti lidí — budoucnost ani počasí nezkoumá.",
        "Minulost studujeme kvůli poučení a pochopení dneška, ne abychom ji změnili.",
      ],
      commonMistake: "Zaměnit dějiny a dějepis (věda × události), nebo myslet, že historik předpovídá budoucnost.",
      example: "Bitva roku 1434 = dějiny (událost). Zkoumání starých listin = dějepis (věda).",
    },
  },
];
