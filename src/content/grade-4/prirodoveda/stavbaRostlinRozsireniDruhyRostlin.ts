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
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kořen", right: "Přijímá vodu a minerály z půdy" },
      { left: "Stonek", right: "Vede vodu nahoru a cukry dolů" },
      { left: "List", right: "Provádí fotosyntézu" },
      { left: "Květ", right: "Umožňuje opylení a rozmnožování" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Plod", right: "Chrání semena a šíří je" },
      { left: "Semeno", right: "Obsahuje zárodek nové rostliny" },
      { left: "Chlorofyl", right: "Zelené barvivo v listech pro fotosyntézu" },
      { left: "Kořenové vlášení", right: "Zvětšuje plochu pro příjem vody" },
    ],
  },
  {
    question: "Spoj způsob šíření semen s příkladem rostliny.",
    correctAnswer: "match",
    pairs: [
      { left: "Vítr (chmýří)", right: "Pampeliška" },
      { left: "Živočichové (dužnatý plod)", right: "Třešeň" },
      { left: "Vítr (křídélko)", right: "Javor" },
      { left: "Voda (nepromokavý plod)", right: "Kokos" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Bránice (průduch)", right: "Reguluje výměnu plynů v listu" },
      { left: "Dřevo", right: "Vede vodu a minerály nahoru" },
      { left: "Lýko", right: "Vede cukry dolů ke kořenům" },
      { left: "Zásobní kořen", right: "Ukládá zásoby živin (mrkev, řepa)" },
    ],
  },
  {
    question: "Spoj potřeby fotosyntézy s tím, co při ní vzniká.",
    correctAnswer: "match",
    pairs: [
      { left: "Světlo", right: "Zdroj energie pro fotosyntézu" },
      { left: "Oxid uhličitý (CO₂)", right: "Vstupní látka pro tvorbu cukru" },
      { left: "Voda (H₂O)", right: "Vstupní látka přijímaná kořenem" },
      { left: "Kyslík (O₂)", right: "Vzniká při fotosyntéze jako vedlejší produkt" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kořen", right: "Ukotvení v půdě" },
      { left: "List", right: "Transpirace – výpar vody" },
      { left: "Květ", right: "Přitahuje opylovače barvou a nektarem" },
      { left: "Plod", right: "Láká živočichy k roznesení semen" },
    ],
  },
  {
    question: "Spoj způsob šíření semen s popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Háčky (lopuch)", right: "Zachytí se na srsti zvířat nebo oblečení" },
      { left: "Voda", right: "Lehký nepromokavý plod se nechá unést proudem" },
      { left: "Živočichové", right: "Sní plod a vylučují semena" },
      { left: "Samovýstřel (boba)", right: "Tobolka praskne a semena vystřelí" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Děloha", right: "Zásobní list semene živící klíček" },
      { left: "Apikální meristém", right: "Pletivo na špičce kořene zodpovídající za růst" },
      { left: "Průduch", right: "Malý otvor v listu pro výměnu plynů" },
      { left: "Chloroplast", right: "Buněčný orgán obsahující chlorofyl" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Stonek", right: "Mechanická opora celé rostliny" },
      { left: "Kořen", right: "Příjem vody a minerálních látek" },
      { left: "List", right: "Výroba cukru pomocí světla a CO₂" },
      { left: "Semeno", right: "Zárodek s výživou pro klíček" },
    ],
  },
  {
    question: "Spoj rostlinu s typem opylení.",
    correctAnswer: "match",
    pairs: [
      { left: "Pampeliška", right: "Hmyz (barevný květ s nektarem)" },
      { left: "Vrba", right: "Hmyz (kvetoucí na jaře)" },
      { left: "Bříza", right: "Vítr (velké množství drobného pylu)" },
      { left: "Jetel", right: "Hmyz (čmelák)" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kořen", right: "Vstřebává vodu s minerály" },
      { left: "Stonek", right: "Spojuje kořen s listy" },
      { left: "Květ", right: "Po opylení se změní v plod" },
      { left: "Plod", right: "Obklopuje a chrání semena" },
    ],
  },
  {
    question: "Spoj části listu s jejich popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Pokožka listu", right: "Ochranná vnější vrstva" },
      { left: "Průduch", right: "Otvor pro výměnu CO₂ a O₂" },
      { left: "Žilnatina", right: "Vedení vody a cukrů v listu" },
      { left: "Chloroplast", right: "Místo, kde probíhá fotosyntéza" },
    ],
  },
  {
    question: "Spoj způsob přizpůsobení rostliny s prostředím.",
    correctAnswer: "match",
    pairs: [
      { left: "Trny místo listů", right: "Omezení výparu v poušti (kaktus)" },
      { left: "Tlusté listy", right: "Zásobárna vody (sukulenty, aloe)" },
      { left: "Barevné květy", right: "Přilákání opylovačů (hmyz)" },
      { left: "Dlouhý kořen", right: "Dosažení spodní vody v suchu" },
    ],
  },
  {
    question: "Spoj typ rostliny s příkladem.",
    correctAnswer: "match",
    pairs: [
      { left: "Jednoděložná rostlina", right: "Tráva, pšenice, kukuřice" },
      { left: "Dvouděložná rostlina", right: "Dub, fazol, jabloň" },
      { left: "Sukulentní rostlina", right: "Kaktus, aloe, agáve" },
      { left: "Vodní rostlina", right: "Leknín, rdest, rákos" },
    ],
  },
  {
    question: "Spoj části stonku s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Dřevo (xylém)", right: "Vede vodu a minerály od kořene nahoru" },
      { left: "Lýko (floém)", right: "Vede cukry z listů dolů ke kořenům" },
      { left: "Kambium", right: "Vrstva buněk produkující nové dřevo a lýko" },
      { left: "Kůra stonku", right: "Ochrana stonku před poškozením" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Květ", right: "Rozmnožení – opylení vede k plodu" },
      { left: "Plod", right: "Šíření semen do okolí" },
      { left: "Semeno", right: "Klíčení a vznik nové rostliny" },
      { left: "Kořen", right: "Ukotvení a příjem živin z půdy" },
    ],
  },
  {
    question: "Spoj proces v rostlině s jeho popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Fotosyntéza", right: "Přeměna CO₂ + H₂O + světlo → cukr + O₂" },
      { left: "Transpirace", right: "Výpar vody z listů průduchy" },
      { left: "Klíčení", right: "Semeno nasaje vodu a vyroste kořínek" },
      { left: "Opylení", right: "Přenos pylu na bliznu květu" },
    ],
  },
  {
    question: "Spoj části rostliny s tím, co je jejich hlavní funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "List", right: "Fotosyntéza a výměna plynů" },
      { left: "Květ", right: "Rozmnožování" },
      { left: "Stonek", right: "Vedení látek a opora" },
      { left: "Kořen", right: "Příjem vody a ukotvení" },
    ],
  },
  {
    question: "Spoj způsob šíření semen s příkladem.",
    correctAnswer: "match",
    pairs: [
      { left: "Vítr", right: "Javor, pampeliška, borovice" },
      { left: "Voda", right: "Kokos, olše" },
      { left: "Živočichové (uvnitř plodu)", right: "Třešeň, malina, šípek" },
      { left: "Živočichové (na povrchu)", right: "Lopuch, jehlice" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Hlíza", right: "Zásobní podzemní orgán (brambor)" },
      { left: "Oddenek", right: "Podzemní stonek s pupeny (konvalinka)" },
      { left: "Cibule", right: "Zásobní listy kolem poupěte (cibule, česnek)" },
      { left: "Výhonek", right: "Nadzemní stonek sloužící k vegetativnímu rozmnožování (jahoda)" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kořenová čepička", right: "Chrání kořen při prorůstání půdou" },
      { left: "Kořenové vlášení", right: "Zvyšuje plochu pro příjem vody a živin" },
      { left: "Hlavní kořen", right: "Ukotví rostlinu do hloubky" },
      { left: "Postranní kořeny", right: "Rozvětvení pro příjem vody do šířky" },
    ],
  },
  {
    question: "Spoj látku s jejím pohybem v rostlině.",
    correctAnswer: "match",
    pairs: [
      { left: "Voda", right: "Z kořene přes stonek do listů (nahoru)" },
      { left: "Cukr (asimilát)", right: "Z listů přes stonek do kořene (dolů)" },
      { left: "CO₂", right: "Vstupuje do listu průduchy z okolí" },
      { left: "O₂", right: "Uniká z listu průduchy do okolí" },
    ],
  },
  {
    question: "Spoj typ rozmnožování s příkladem.",
    correctAnswer: "match",
    pairs: [
      { left: "Pohlavní rozmnožování (semena)", right: "Jabloň, hrušeň, obilí" },
      { left: "Vegetativní (výhonky)", right: "Jahoda (plazivé výhonky)" },
      { left: "Vegetativní (hlízy)", right: "Brambor" },
      { left: "Vegetativní (řízky)", right: "Řeřicha, pelargonie" },
    ],
  },
  {
    question: "Spoj části květu s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Tyčinka", right: "Mužský orgán – tvoří pyl" },
      { left: "Pestík", right: "Ženský orgán – obsahuje vajíčka" },
      { left: "Okvětní lístky", right: "Přilákání opylovačů barvou" },
      { left: "Nektar", right: "Odměna pro opylovače (hmyz)" },
    ],
  },
  {
    question: "Spoj rostlinu s ekosystémem, kde typicky roste.",
    correctAnswer: "match",
    pairs: [
      { left: "Leknín", right: "Rybník nebo jezero" },
      { left: "Pampeliška", right: "Louka" },
      { left: "Jedle", right: "Les" },
      { left: "Pšenice", right: "Pole" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Stonek", right: "Drží rostlinu vzpřímeně" },
      { left: "List", right: "Zachycuje sluneční energii" },
      { left: "Kořen", right: "Brání vyvrácení rostliny větrem" },
      { left: "Plod", right: "Přiláká živočichy ke šíření semen" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kořen", right: "Vstřebává vodu a soli z půdy" },
      { left: "Stonek", right: "Dopravuje vodu od kořene k listům" },
      { left: "List", right: "Vyrábí organické látky pro celou rostlinu" },
      { left: "Semeno", right: "Šíří druh do nového prostředí" },
    ],
  },
  {
    question: "Spoj přizpůsobení rostliny s podmínkami prostředí.",
    correctAnswer: "match",
    pairs: [
      { left: "Velké ploché listy", right: "Deštný prales – zachycení světla ve stínu" },
      { left: "Jehličí", right: "Mírné pásmo – odolnost vůči mrazu a suchu" },
      { left: "Vzdušné kořeny", right: "Mokřad – příjem kyslíku nad vodou" },
      { left: "Trny", right: "Sucho – omezení výparu místo listů" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Blizna", right: "Lepkavá část pestíku zachytávající pyl" },
      { left: "Čnělka", right: "Spojuje bliznu s vaječníkem" },
      { left: "Vaječník", right: "Obsahuje vajíčka, ze kterých vznikají semena" },
      { left: "Pylová láčka", right: "Vede pyl k vajíčku při oplodnění" },
    ],
  },
  {
    question: "Spoj typ listu s jeho popisem.",
    correctAnswer: "match",
    pairs: [
      { left: "Jehličí", right: "Úzký list jehličnanů odolný mrazu" },
      { left: "Šupinatý list", right: "Přeměněný list přikrývající pupeny" },
      { left: "Složený list", right: "List složený z více lístků (akát, jasan)" },
      { left: "Jednoduchý list", right: "Celý list na jednom řapíku (dub, lípa)" },
    ],
  },
  {
    question: "Spoj části rostliny s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Kořen", right: "Příjem vody a minerálů, ukotvení" },
      { left: "Stonek", right: "Mechanická opora, transport látek" },
      { left: "List", right: "Fotosyntéza, transpirace" },
      { left: "Květ", right: "Pohlavní rozmnožování" },
    ],
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 30);
}

export const STAVBAROSTLINROZSIRENIDRUHYROSTLIN: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-stavba-rostlin-rozsireni-druhy-rostlin",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-rostliny-stavba-rostlin-rozsireni-druhy-rostlin",
    title: "Stavba rostlin - rozšíření, druhy rostlin",
    studentTitle: "Jak funguje rostlina",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Pochopíš, jak fungují části rostliny a jak se semena dostávají do celého světa.",
    keywords: ["fotosyntéza", "chlorofyl", "kořen", "stonek", "list", "květ", "plod", "semena", "opylení", "šíření semen"],
    goals: [
      "Popsat funkci kořene, stonku, listu, květu a plodu",
      "Vysvětlit průběh fotosyntézy",
      "Uvést způsoby šíření semen (vítr, voda, živočichové)",
      "Rozlišit jednoděložné a dvouděložné rostliny",
    ],
    boundaries: ["Podrobná buněčná biologie není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Fotosyntéza: světlo + CO₂ + voda → cukr + kyslík (v listech s chlorofylem).",
      steps: [
        "1. Kořen: ukotvení + příjem vody a minerálů.",
        "2. Stonek: opora + dřevo (voda nahoru) + lýko (cukry dolů).",
        "3. List: fotosyntéza + transpirace.",
        "4. Květ → plod → semeno → šíření (vítr, voda, živočich).",
      ],
      commonMistake: "Fotosyntéza probíhá v listech (ne v kořenech ani stonku).",
      example: "Pampeliška šíří semena větrem (chmýří). Třešeň živočichy (ptáci sní plod).",
    },
  },
];
