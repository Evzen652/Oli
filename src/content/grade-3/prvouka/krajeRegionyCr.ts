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
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: počet krajů, definice kraj vs region, Praha jako
//        hlavní město i kraj zároveň, obecné otázky o smyslu kraje/regionu.
//   L2 = aplikace:   přiřazení konkrétní krajské město ↔ kraj (12 párů,
//        pokrývá 12 ze 14 krajů — Praha a Středočeský kraj vynechány,
//        protože nejsou obyčejným párem kraj–stejnojmenné město).
//   L3 = transfer:   kombinace dvou faktů (poloha + jiný rys), výjimka
//        Vysočina/Jihlava, rozlišení podobných názvů (Jihočeský vs
//        Jihomoravský), počet krajů včetně Prahy.
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Kolik krajů má Česká republika?",
    correctAnswer: "14 krajů",
    options: ["14 krajů", "12 krajů", "16 krajů", "10 krajů"],
    hints: [
      "Počet krajů je mezi 10 a 16.",
      "Hlavní město Praha je také kraj — jeden ze 14.",
    ],
    explanation:
      "Česká republika se dělí na 14 krajů. Každý kraj má své krajské město, kde sídlí krajský úřad. Praha je zároveň hlavním městem státu i samostatným krajem.",
  },
  {
    question: "Co je kraj?",
    correctAnswer: "Územní celek, který spravuje část státu",
    options: [
      "Územní celek, který spravuje část státu",
      "Název pro velkou vesnici",
      "Jiné označení pro stát",
      "Část ulice ve městě",
    ],
    hints: [
      "Kraj je větší než obec, ale menší než stát.",
      "Každý kraj má svůj úřad a zastupitele.",
    ],
    explanation:
      "Kraj je územní celek, který spravuje část státu. Česká republika je rozdělena na 14 krajů. Každý kraj má krajský úřad a zastupitelstvo, které rozhoduje o věcech v daném kraji.",
  },
  {
    question: "Co je region?",
    correctAnswer: "Oblast se společnými znaky — přírodou, historií nebo kulturou",
    options: [
      "Oblast se společnými znaky — přírodou, historií nebo kulturou",
      "Přesně vymezená část státu s úřadem",
      "Jiný název pro hlavní město",
      "Část kraje bez vlastní správy",
    ],
    hints: [
      "Region nemusí mít přesné hranice — jde o podobné rysy oblasti.",
      "Lidé v regionu mají podobnou kulturu, přírodní podmínky nebo historii.",
    ],
    explanation:
      "Region je oblast, která má společné znaky — například stejnou přírodu, historii nebo kulturu. Region nemusí mít přesně dané hranice jako kraj. Například Haná nebo Chodsko jsou regiony.",
  },
  {
    question: "Kolik krajských měst má Česká republika?",
    correctAnswer: "14",
    options: ["14", "13", "12", "15"],
    hints: [
      "Každý kraj má právě jedno krajské město.",
      "Krajských měst je stejně jako krajů.",
    ],
    explanation:
      "Česká republika má 14 krajů a každý kraj má své krajské město — dohromady tedy 14 krajských měst. I kraj Vysočina má krajské město, i když se nejmenuje stejně jako kraj — je to Jihlava.",
  },
  {
    question: "Které město je zároveň hlavním městem státu i samostatným krajem?",
    correctAnswer: "Praha",
    options: ["Praha", "Brno", "Ostrava", "Plzeň"],
    hints: [
      "Toto město je největší v České republice.",
      "Sídlí zde prezident, vláda i parlament.",
    ],
    explanation:
      "Praha je zároveň hlavním městem České republiky a samostatným krajem. Je největším městem státu a sídlí zde prezident, vláda, parlament i soudy.",
  },
  {
    question: "Má každý kraj svůj krajský úřad?",
    correctAnswer: "Ano",
    options: ["Ano", "Ne"],
    hints: [
      "Krajský úřad je místo, kde se rozhoduje o věcech v kraji.",
      "Bez úřadu by kraj nemohl fungovat.",
    ],
    explanation:
      "Ano, každý kraj má svůj krajský úřad, kde sídlí krajská správa a zastupitelstvo. Úřad sídlí v krajském městě.",
  },
  {
    question: "Je region to samé jako kraj?",
    correctAnswer: "Ne",
    options: ["Ano", "Ne"],
    hints: [
      "Kraj má přesné hranice a úřad, region ne.",
      "Region se pozná podle společných znaků, ne podle úřadu.",
    ],
    explanation:
      "Ne, region a kraj nejsou to samé. Kraj má přesně vymezené hranice a vlastní úřad. Region je jen oblast se společnými znaky, bez přesných hranic a bez vlastní správy.",
  },
  {
    question: "Co je větší — kraj, nebo obec?",
    correctAnswer: "Kraj je větší než obec",
    options: [
      "Kraj je větší než obec",
      "Obec je větší než kraj",
      "Kraj a obec jsou stejně velké",
      "Obec a stát jsou stejně velké",
    ],
    hints: [
      "Kraj se skládá z mnoha obcí.",
      "Řazení podle velikosti: obec, kraj, stát.",
    ],
    explanation:
      "Kraj je větší územní celek než obec — jeden kraj se skládá z mnoha obcí a měst. Nad krajem už je jen celý stát.",
  },
  {
    question: "Kdo rozhoduje o věcech v kraji?",
    correctAnswer: "Krajský úřad a zastupitelstvo",
    options: [
      "Krajský úřad a zastupitelstvo",
      "Pouze obecní úřad",
      "Parlament ČR",
      "Vláda ČR",
    ],
    hints: [
      "Hledej název úřadu, který patří přímo ke kraji.",
      "Není to obecní úřad ani vláda — je to úřad na úrovni kraje.",
    ],
    explanation:
      "O věcech v kraji rozhoduje krajský úřad a krajské zastupitelstvo. Sídlí v krajském městě a starají se o školství, zdravotnictví nebo silnice v kraji.",
  },
  {
    question: "Co má kraj navíc oproti regionu?",
    correctAnswer: "Přesné hranice a vlastní úřad",
    options: [
      "Přesné hranice a vlastní úřad",
      "Vlastní jazyk",
      "Vlastní měnu",
      "Vlastní armádu",
    ],
    hints: [
      "Region nemá ani jedno z toho, co kraj má.",
      "Mysli na to, co dělá kraj úředně uznaným celkem.",
    ],
    explanation:
      "Kraj má na rozdíl od regionu přesně vymezené hranice a vlastní krajský úřad. Region je jen oblast se společnými znaky, bez úřadu a bez přesných hranic.",
  },
  {
    question: "Kde sídlí krajský úřad?",
    correctAnswer: "V krajském městě",
    options: [
      "V krajském městě",
      "Vždy v Praze, bez ohledu na kraj",
      "V obci, kde bydlí nejvíc lidí v celé ČR",
      "V hlavním městě sousedního státu",
    ],
    hints: [
      "Každý kraj má jedno město, které je jeho centrem.",
      "Toto město se obvykle jmenuje stejně jako kraj.",
    ],
    explanation:
      "Krajský úřad sídlí v krajském městě — to je centrum kraje, kde se rozhoduje o jeho záležitostech.",
  },
  {
    question: "Patří Praha do Středočeského kraje?",
    correctAnswer: "Ne",
    options: ["Ano", "Ne"],
    hints: [
      "Praha je sama samostatným krajem.",
      "I když leží uprostřed Středočeského kraje, není jeho součástí.",
    ],
    explanation:
      "Ne, Praha do Středočeského kraje nepatří. Praha je samostatný kraj, i když geograficky leží uprostřed území Středočeského kraje a je sídlem jeho úřadů.",
  },
  {
    question: "Musí mít region přesně vymezené hranice jako kraj?",
    correctAnswer: "Ne",
    options: ["Ano", "Ne"],
    hints: [
      "Region se pozná podle společných znaků, ne podle hranic na mapě.",
      "Přesné hranice a úřad má kraj, ne region.",
    ],
    explanation:
      "Ne, region nemusí mít přesně vymezené hranice. Na rozdíl od kraje jde jen o oblast se společnými znaky — přírodou, historií nebo kulturou.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jaké je krajské město Jihomoravského kraje?",
    correctAnswer: "Brno",
    options: ["Brno", "Zlín", "Jihlava", "Olomouc"],
    hints: [
      "Je to druhé největší město České republiky.",
      "Leží na jihu Moravy a je centrem celé oblasti.",
    ],
    explanation:
      "Brno je krajské město Jihomoravského kraje. Je to druhé největší město České republiky a leží na jihu Moravy.",
  },
  {
    question: "Jaké je krajské město Moravskoslezského kraje?",
    correctAnswer: "Ostrava",
    options: ["Ostrava", "Opava", "Brno", "Olomouc"],
    hints: [
      "Je to třetí největší město České republiky.",
      "Leží na severu Moravy, poblíž hranic s Polskem.",
    ],
    explanation:
      "Ostrava je krajské město Moravskoslezského kraje. Je to třetí největší město v České republice a leží na severovýchodě Moravy.",
  },
  {
    question: "Jaké je krajské město Plzeňského kraje?",
    correctAnswer: "Plzeň",
    options: ["Plzeň", "České Budějovice", "Liberec", "Karlovy Vary"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to velké město v západních Čechách.",
    ],
    explanation:
      "Plzeň je krajské město Plzeňského kraje. Leží v západních Čechách a je čtvrtým největším městem České republiky.",
  },
  {
    question: "Jaké je krajské město Jihočeského kraje?",
    correctAnswer: "České Budějovice",
    options: ["České Budějovice", "Písek", "Tábor", "Strakonice"],
    hints: [
      "Leží na jihu Čech, poblíž hranic s Rakouskem.",
      "V názvu tohoto města jsou slova označující polohu — jih a Čechy.",
    ],
    explanation:
      "České Budějovice jsou krajské město Jihočeského kraje. Leží na jihu Čech a jsou největším městem tohoto kraje.",
  },
  {
    question: "Jaké je krajské město Libereckého kraje?",
    correctAnswer: "Liberec",
    options: ["Liberec", "Jablonec nad Nisou", "Česká Lípa", "Frýdlant"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Leží v severních Čechách, pod Ještědem.",
    ],
    explanation:
      "Liberec je krajské město Libereckého kraje. Leží v severních Čechách pod horou Ještěd.",
  },
  {
    question: "Jaké je krajské město Olomouckého kraje?",
    correctAnswer: "Olomouc",
    options: ["Olomouc", "Přerov", "Prostějov", "Šumperk"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to historické město na střední Moravě.",
    ],
    explanation:
      "Olomouc je krajské město Olomouckého kraje. Je to jedno z nejstarších a historicky nejvýznamnějších měst na Moravě.",
  },
  {
    question: "Jaké je krajské město Zlínského kraje?",
    correctAnswer: "Zlín",
    options: ["Zlín", "Uherské Hradiště", "Vsetín", "Kroměříž"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Leží na východní Moravě a je znám historií obuvnické továrny Baťa.",
    ],
    explanation:
      "Zlín je krajské město Zlínského kraje. Leží na východní Moravě a je proslulý svou historií spojenou s firmou Baťa.",
  },
  {
    question: "Jaké je krajské město Pardubického kraje?",
    correctAnswer: "Pardubice",
    options: ["Pardubice", "Chrudim", "Svitavy", "Ústí nad Orlicí"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to město ve východních Čechách, známé dostihy.",
    ],
    explanation:
      "Pardubice jsou krajské město Pardubického kraje. Leží ve východních Čechách a jsou proslulé Velkou pardubickou — slavným dostihem.",
  },
  {
    question: "Jaké je krajské město Královéhradeckého kraje?",
    correctAnswer: "Hradec Králové",
    options: ["Hradec Králové", "Náchod", "Trutnov", "Jičín"],
    hints: [
      "Název krajského města je skryt v názvu kraje.",
      "Leží ve východních Čechách při řece Labi.",
    ],
    explanation:
      "Hradec Králové je krajské město Královéhradeckého kraje. Leží ve východních Čechách, kde se setkávají řeky Labe a Orlice.",
  },
  {
    question: "Jaké je krajské město kraje Vysočina?",
    correctAnswer: "Jihlava",
    options: ["Jihlava", "Havlíčkův Brod", "Třebíč", "Žďár nad Sázavou"],
    hints: [
      "Leží přibližně uprostřed České republiky.",
      "Kraj Vysočina je pojmenován podle krajiny — vysočiny, nikoliv podle města.",
    ],
    explanation:
      "Jihlava je krajské město kraje Vysočina. Leží přibližně ve středu České republiky. Kraj Vysočina je jediný kraj, který nemá v názvu jméno svého krajského města.",
  },
  {
    question: "Jaké je krajské město Karlovarského kraje?",
    correctAnswer: "Karlovy Vary",
    options: ["Karlovy Vary", "Cheb", "Sokolov", "Mariánské Lázně"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Je to lázeňské město v západních Čechách.",
    ],
    explanation:
      "Karlovy Vary jsou krajské město Karlovarského kraje. Je to slavné lázeňské město v západních Čechách, známé minerálními prameny.",
  },
  {
    question: "Jaké je krajské město Ústeckého kraje?",
    correctAnswer: "Ústí nad Labem",
    options: ["Ústí nad Labem", "Most", "Chomutov", "Teplice"],
    hints: [
      "Krajské město leží u velké řeky — Labe.",
      "Kraj leží na severu Čech u hranic s Německem.",
    ],
    explanation:
      "Ústí nad Labem je krajské město Ústeckého kraje. Leží na severu Čech u řeky Labe a hranic s Německem.",
  },
  {
    question: "Ve kterém kraji leží město Brno?",
    correctAnswer: "Jihomoravský kraj",
    options: ["Jihomoravský kraj", "Moravskoslezský kraj", "Zlínský kraj", "Olomoucký kraj"],
    hints: [
      "Brno je krajské město tohoto kraje.",
      "Kraj leží na jihu Moravy.",
    ],
    explanation:
      "Brno leží v Jihomoravském kraji a je jeho krajským městem.",
  },
  {
    question: "Ve kterém kraji leží město Plzeň?",
    correctAnswer: "Plzeňský kraj",
    options: ["Plzeňský kraj", "Karlovarský kraj", "Jihočeský kraj", "Ústecký kraj"],
    hints: [
      "Plzeň je krajské město tohoto kraje.",
      "Kraj leží v západních Čechách.",
    ],
    explanation:
      "Plzeň leží v Plzeňském kraji a je jeho krajským městem.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Který kraj je jedinou výjimkou — nemá krajské město se stejným názvem, jako je název kraje?",
    correctAnswer: "Vysočina",
    options: ["Vysočina", "Plzeňský kraj", "Zlínský kraj", "Olomoucký kraj"],
    hints: [
      "Tento kraj je pojmenován podle krajiny, ne podle města.",
      "Jeho krajské město se jmenuje Jihlava.",
    ],
    explanation:
      "Kraj Vysočina je jediný kraj, jehož krajské město (Jihlava) se nejmenuje stejně jako kraj. Ostatní kraje mají krajské město pojmenované stejně jako kraj.",
  },
  {
    question: "Které krajské město je proslulé firmou Baťa a leží na východní Moravě?",
    correctAnswer: "Zlín",
    options: ["Zlín", "Olomouc", "Ostrava", "Brno"],
    hints: [
      "Toto město dalo jméno celému kraji.",
      "Firma Baťa vyráběla boty.",
    ],
    explanation:
      "Zlín leží na východní Moravě a je proslulý svou historií spojenou s obuvnickou firmou Baťa. Je krajským městem Zlínského kraje.",
  },
  {
    question: "Které krajské město je lázeňské a leží v západních Čechách?",
    correctAnswer: "Karlovy Vary",
    options: ["Karlovy Vary", "Plzeň", "Ústí nad Labem", "Liberec"],
    hints: [
      "Toto město je známé minerálními prameny.",
      "Je krajským městem Karlovarského kraje.",
    ],
    explanation:
      "Karlovy Vary jsou slavné lázeňské město v západních Čechách, známé minerálními prameny. Jsou krajským městem Karlovarského kraje.",
  },
  {
    question:
      "Jihočeský kraj i Jihomoravský kraj mají v názvu slovo „Jiho-“. Které krajské město patří k Jihočeskému kraji (ne k Jihomoravskému)?",
    correctAnswer: "České Budějovice",
    options: ["České Budějovice", "Brno", "Plzeň", "Jihlava"],
    hints: [
      "Toto město leží na jihu Čech, ne na jihu Moravy.",
      "Pozor na podobný název sousedního kraje — Jihomoravský.",
    ],
    explanation:
      "České Budějovice jsou krajské město Jihočeského kraje, který leží na jihu Čech. Nezaměňuj ho s Jihomoravským krajem, jehož krajským městem je Brno.",
  },
  {
    question:
      "Jihočeský kraj i Jihomoravský kraj mají v názvu slovo „Jiho-“. Které krajské město patří k Jihomoravskému kraji (ne k Jihočeskému)?",
    correctAnswer: "Brno",
    options: ["Brno", "České Budějovice", "Zlín", "Olomouc"],
    hints: [
      "Toto město leží na jihu Moravy, ne na jihu Čech.",
      "Pozor na podobný název sousedního kraje — Jihočeský.",
    ],
    explanation:
      "Brno je krajské město Jihomoravského kraje, který leží na jihu Moravy. Nezaměňuj ho s Jihočeským krajem, jehož krajským městem jsou České Budějovice.",
  },
  {
    question:
      "Praha je hlavní město ČR a zároveň i samostatný kraj. Kolik krajů má Česká republika CELKEM, počítáme-li Prahu mezi ně?",
    correctAnswer: "14 krajů",
    options: ["14 krajů", "13 krajů", "15 krajů", "12 krajů"],
    hints: [
      "Praha se do celkového počtu krajů počítá jako jeden z nich.",
      "Bez Prahy by krajů bylo 13 — ale Praha mezi ně patří.",
    ],
    explanation:
      "Česká republika má 14 krajů a Praha je jedním z nich — je zároveň hlavním městem státu i samostatným krajem. Proto se do celkového počtu 14 krajů počítá.",
  },
  {
    question: "Které krajské město je třetí největší v ČR a leží poblíž hranic s Polskem?",
    correctAnswer: "Ostrava",
    options: ["Ostrava", "Olomouc", "Zlín", "Brno"],
    hints: [
      "Toto město leží na severovýchodě Moravy.",
      "Je krajským městem Moravskoslezského kraje.",
    ],
    explanation:
      "Ostrava je třetí největší město České republiky a leží na severovýchodě Moravy poblíž hranic s Polskem. Je krajským městem Moravskoslezského kraje.",
  },
  {
    question: "Které krajské město je druhé největší v ČR a leží na jihu Moravy?",
    correctAnswer: "Brno",
    options: ["Brno", "Ostrava", "Zlín", "Olomouc"],
    hints: [
      "Toto město je centrem celé jižní Moravy.",
      "Je krajským městem Jihomoravského kraje.",
    ],
    explanation:
      "Brno je druhé největší město České republiky a leží na jihu Moravy. Je krajským městem Jihomoravského kraje.",
  },
  {
    question: "Které krajské město je čtvrté největší v ČR a leží v západních Čechách?",
    correctAnswer: "Plzeň",
    options: ["Plzeň", "Karlovy Vary", "České Budějovice", "Liberec"],
    hints: [
      "Toto město je krajským městem Plzeňského kraje.",
      "Leží dál na západ než Karlovy Vary od Prahy směrem k hranicím.",
    ],
    explanation:
      "Plzeň je čtvrté největší město České republiky a leží v západních Čechách. Je krajským městem Plzeňského kraje.",
  },
  {
    question: "Které krajské město leží u řeky Labe poblíž hranic s Německem?",
    correctAnswer: "Ústí nad Labem",
    options: ["Ústí nad Labem", "Liberec", "Hradec Králové", "Karlovy Vary"],
    hints: [
      "Název tohoto města přímo obsahuje jméno řeky, u které leží.",
      "Je krajským městem Ústeckého kraje na severu Čech.",
    ],
    explanation:
      "Ústí nad Labem leží u řeky Labe na severu Čech poblíž hranic s Německem. Je krajským městem Ústeckého kraje.",
  },
  {
    question: "Které krajské město leží tam, kde se stékají řeky Labe a Orlice, ve východních Čechách?",
    correctAnswer: "Hradec Králové",
    options: ["Hradec Králové", "Pardubice", "Liberec", "Jihlava"],
    hints: [
      "Název tohoto krajského města je skrytý v názvu kraje.",
      "Je krajským městem Královéhradeckého kraje.",
    ],
    explanation:
      "Hradec Králové leží ve východních Čechách, kde se setkávají řeky Labe a Orlice. Je krajským městem Královéhradeckého kraje.",
  },
  {
    question: "Které krajské město je proslulé koňským dostihem Velká pardubická a leží ve východních Čechách?",
    correctAnswer: "Pardubice",
    options: ["Pardubice", "Hradec Králové", "Liberec", "Jihlava"],
    hints: [
      "Krajské město má stejné jméno jako kraj.",
      "Dostih se jmenuje podle tohoto města.",
    ],
    explanation:
      "Pardubice leží ve východních Čechách a jsou proslulé Velkou pardubickou — slavným koňským dostihem. Jsou krajským městem Pardubického kraje.",
  },
  {
    question: "Které krajské město patří mezi nejstarší a historicky nejvýznamnější města na Moravě a leží na střední Moravě?",
    correctAnswer: "Olomouc",
    options: ["Olomouc", "Zlín", "Brno", "Ostrava"],
    hints: [
      "Toto město leží na střední Moravě, mezi Brnem a Ostravou.",
      "Je krajským městem Olomouckého kraje.",
    ],
    explanation:
      "Olomouc leží na střední Moravě a patří mezi nejstarší a historicky nejvýznamnější města Moravy. Je krajským městem Olomouckého kraje.",
  },
  {
    question: "Které krajské město leží v severních Čechách pod horou Ještěd?",
    correctAnswer: "Liberec",
    options: ["Liberec", "Ústí nad Labem", "Hradec Králové", "Karlovy Vary"],
    hints: [
      "Ještěd je hora se známou televizní věží.",
      "Je krajským městem Libereckého kraje.",
    ],
    explanation:
      "Liberec leží v severních Čechách pod horou Ještěd. Je krajským městem Libereckého kraje.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const KRAJEREGIONYCR: TopicMetadata[] = [
  {
    id: "g3-prvouka-misto-kde-zijeme-nase-vlast-kraje-a-regiony-cr-uvod-nas-region",
    title: "Kraje a regiony ČR (úvod)",
    studentTitle: "Kraje České republiky",
    subject: "prvouka",
    category: "Místo, kde žijeme",
    topic: "Naše vlast",
    briefDescription: "Poznáš kraje ČR a jejich krajská města.",
    keywords: [
      "kraj",
      "region",
      "krajské město",
      "Praha",
      "Brno",
      "Ostrava",
      "Plzeň",
      "České Budějovice",
      "Liberec",
      "Olomouc",
      "Zlín",
      "Pardubice",
      "Hradec Králové",
      "Jihlava",
      "Karlovy Vary",
      "Ústí nad Labem",
    ],
    goals: [
      "Vědět, že Česká republika má 14 krajů.",
      "Znát rozdíl mezi krajem a regionem.",
      "Umět přiřadit krajská města ke správným krajům.",
    ],
    boundaries: [
      "Podrobná geografie a poloha krajů na mapě nejsou součástí základního obsahu pro 3. ročník.",
      "Detaily o krajské správě a politice se neprobírají.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "ČR má 14 krajů. Kraj = územní celek se správou. Region = oblast se společnými znaky. Praha je hlavní město i kraj.",
      steps: [
        "Vzpomeň si, kolik krajů má Česká republika.",
        "Kraj a region nejsou totéž — kraj má přesné hranice a úřad, region je oblast se společnými znaky.",
        "Každý kraj má krajské město — většinou má stejný název jako kraj.",
        "Praha je výjimka — je to hlavní město státu i samostatný kraj.",
      ],
      commonMistake:
        "Středočeský kraj nemá vlastní krajské město — jeho správa sídlí v Praze, ale Praha do Středočeského kraje nepatří.",
      example:
        "Jihomoravský kraj — krajské město Brno. Vysočina — krajské město Jihlava (jediný kraj bez jména města v názvu).",
    },
  },
];
