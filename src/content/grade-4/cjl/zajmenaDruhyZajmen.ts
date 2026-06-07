import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL_L1: QA[] = [
  { q: "Jaký druh zájmena je 'nikdo'?", a: "záporné", opts: ["záporné", "neurčité", "osobní", "tázací"], e: "Slovo 'nikdo' něco popírá — říká, že tu žádná osoba není. Proto je to zájmeno záporné. Pomáhá poznávací znak: záporná zájmena začínají na ni- nebo žá- (nikdo, nic, žádný)." },
  { q: "Jaký druh zájmena je 'já'?", a: "osobní", opts: ["osobní", "přivlastňovací", "ukazovací", "tázací"], e: "Zájmeno 'já' označuje osobu, která mluví. Zájmena, která zastupují osoby (já, ty, on, my...), nazýváme osobní. Nepřivlastňuje ani neukazuje, jen pojmenovává mluvčího." },
  { q: "Jaký druh zájmena je 'můj'?", a: "přivlastňovací", opts: ["přivlastňovací", "osobní", "ukazovací", "neurčité"], e: "Slovo 'můj' říká, komu věc patří — že je moje. Zájmena, která něco přivlastňují (můj, tvůj, náš), jsou přivlastňovací. Na rozdíl od 'já' neoznačuje osobu, ale vlastnictví." },
  { q: "Jaký druh zájmena je 'ten'?", a: "ukazovací", opts: ["ukazovací", "osobní", "tázací", "přivlastňovací"], e: "Zájmenem 'ten' na něco ukazujeme, jako bychom říkali 'právě tahle věc'. Ukazovací zájmena (ten, tento, onen) určují, o kterou věc jde. Neptají se ani nepřivlastňují." },
  { q: "Jaký druh zájmena je 'kdo'?", a: "tázací", opts: ["tázací", "osobní", "záporné", "neurčité"], e: "Slovem 'kdo' se ptáme na osobu — 'Kdo to byl?'. Zájmena, kterými se ptáme (kdo, co, jaký, který), jsou tázací. Poznáš je podle toho, že stojí v otázce." },
  { q: "Jaký druh zájmena je 'někdo'?", a: "neurčité", opts: ["neurčité", "osobní", "záporné", "tázací"], e: "Slovo 'někdo' označuje osobu, kterou přesně neznáme — nevíme, kdo to je. Taková zájmena se nazývají neurčitá a často začínají na ně-/-si/lec- (někdo, něco, kdosi)." },
  { q: "Jaký druh zájmena je 'nic'?", a: "záporné", opts: ["záporné", "neurčité", "tázací", "osobní"], e: "Slovo 'nic' popírá, že by tu něco bylo. Protože něco zápornou cestou vylučuje, je to zájmeno záporné. Začíná na ni-, což je typický znak záporných zájmen (nic, nikdo)." },
  { q: "Jaký druh zájmena je 'ona'?", a: "osobní", opts: ["osobní", "ukazovací", "přivlastňovací", "vztažné"], e: "Zájmeno 'ona' zastupuje osobu, o které mluvíme — třetí osobu. Zájmena zastupující osoby (já, ty, on, ona) jsou osobní. Nepřivlastňuje, jen ji pojmenovává." },
  { q: "Jaký druh zájmena je 'tvůj'?", a: "přivlastňovací", opts: ["přivlastňovací", "osobní", "ukazovací", "tázací"], e: "Slovo 'tvůj' říká, že věc patří tobě. Protože vyjadřuje vlastnictví, je to zájmeno přivlastňovací (můj, tvůj, jeho). Liší se od osobního 'ty', které jen označuje osobu." },
  { q: "Jaký druh zájmena je 'který'?", a: "tázací nebo vztažné", opts: ["tázací nebo vztažné", "osobní", "přivlastňovací", "záporné"], e: "Slovo 'který' může být dvojí: když se ptáme ('Který je tvůj?'), je tázací; když spojuje věty ('chlapec, který přišel'), je vztažné. Záleží tedy na tom, jak je ve větě použité." },
  { q: "Jaký druh zájmena je 'tento'?", a: "ukazovací", opts: ["ukazovací", "osobní", "neurčité", "přivlastňovací"], e: "Zájmenem 'tento' ukazujeme na věc, která je blízko — 'právě tento'. Ukazovací zájmena (ten, tento, onen) určují, o kterou věc jde. Neptají se ani nic nepřivlastňují." },
  { q: "Jaký druh zájmena je 'žádný'?", a: "záporné", opts: ["záporné", "neurčité", "ukazovací", "tázací"], e: "Slovo 'žádný' popírá — říká, že tu není ani jeden. Proto je to zájmeno záporné. Pozor, neplést s neurčitým 'nějaký', které naopak připouští, že někdo je." },
  { q: "Jaký druh zájmena je 'my'?", a: "osobní", opts: ["osobní", "přivlastňovací", "vztažné", "tázací"], e: "Zájmeno 'my' označuje skupinu osob včetně mluvčího. Zájmena zastupující osoby (já, ty, my, vy) jsou osobní. Liší se od přivlastňovacího 'náš', které vyjadřuje vlastnictví." },
  { q: "Jaký druh zájmena je 'něco'?", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"], e: "Slovo 'něco' označuje věc, kterou přesně neznáme. Taková zájmena nazýváme neurčitá. Pozor na rozdíl od záporného 'nic' — 'něco' tu připouští, že nějaká věc je." },
  { q: "Jaký druh zájmena je 'jejich'?", a: "přivlastňovací", opts: ["přivlastňovací", "osobní", "ukazovací", "vztažné"], e: "Slovo 'jejich' říká, že věc patří jim. Protože vyjadřuje vlastnictví, je to zájmeno přivlastňovací. Liší se od osobního 'oni', které jen označuje osoby." },
  { q: "Jaký druh zájmena je 'jenž'?", a: "vztažné", opts: ["vztažné", "tázací", "záporné", "neurčité"], e: "Zájmeno 'jenž' spojuje hlavní větu s vedlejší ('muž, jenž přišel'). Zájmena, která uvozují vedlejší větu, jsou vztažná. Neptáme se jím jako tázacími zájmeny." },
];

const POOL_L2: QA[] = [
  { q: "Která zájmena jsou osobní?", a: "já, ty, on, ona, ono, my, vy, oni, ony", opts: ["já, ty, on, ona, ono, my, vy, oni, ony", "ten, tento, onen", "někdo, něco, nějaký", "kdo, co, jaký"], e: "Osobní zájmena zastupují osoby — toho, kdo mluví (já, my), s kým mluvíme (ty, vy) i o kom mluvíme (on, ona, oni). Řada 'ten, tento' ukazuje a 'kdo, co' se ptá, proto to osobní nejsou." },
  { q: "Která zájmena jsou přivlastňovací?", a: "můj, tvůj, jeho, její, náš, váš, jejich", opts: ["můj, tvůj, jeho, její, náš, váš, jejich", "já, ty, on, ona", "ten, tento, tamten", "nikdo, nic, žádný"], e: "Přivlastňovací zájmena říkají, komu věc patří (můj, náš, jejich). Řada 'já, ty, on' jen označuje osoby (osobní) a 'nikdo, nic' něco popírá (záporná)." },
  { q: "Která zájmena jsou ukazovací?", a: "ten, tento, tenhle, onen, tamten", opts: ["ten, tento, tenhle, onen, tamten", "já, ty, on", "kdo, co, jaký", "někdo, něco, nějaký"], e: "Ukazovacími zájmeny na věc ukazujeme a určujeme, o kterou jde (ten, tento, onen). Řada 'kdo, co' se ptá (tázací) a 'někdo, něco' je nejistá (neurčitá)." },
  { q: "Která zájmena jsou záporná?", a: "nikdo, nic, žádný, nijaký", opts: ["nikdo, nic, žádný, nijaký", "někdo, něco, nějaký", "kdo, co, jaký", "ten, tento, onen"], e: "Záporná zájmena popírají — říkají, že tu nikdo a nic není. Poznáš je podle začátku ni-/žá- (nikdo, žádný). Pozor na neurčitá 'někdo, něco', která naopak připouštějí, že někdo je." },
  { q: "Která zájmena jsou tázací?", a: "kdo, co, jaký, který, čí", opts: ["kdo, co, jaký, který, čí", "jenž, který, co", "někdo, něco, nějaký", "nikdo, nic, žádný"], e: "Tázací zájmena se používají v otázkách, ptáme se jimi (Kdo? Co? Jaký? Čí?). Řada 'jenž, který' spojuje věty (vztažná) a 'někdo, něco' je neurčitá." },
  { q: "Která zájmena jsou vztažná?", a: "který, jenž, co (ve větě vedlejší)", opts: ["který, jenž, co (ve větě vedlejší)", "kdo, co (tázací)", "ten, tento", "někdo, něco"], e: "Vztažná zájmena spojují větu hlavní s vedlejší ('dům, který stojí na kopci'). Stejná slova jako 'co' nebo 'který' mohou být i tázací — záleží, zda se ptáme, nebo spojujeme věty." },
  { q: "Urči druh zájmena 'co' ve větě: 'Co děláš?'", a: "tázací", opts: ["tázací", "vztažné", "neurčité", "záporné"], e: "Věta je otázka — ptáme se slovem 'co', proto je zde tázací. Kdyby 'co' spojovalo dvě věty ('udělal, co slíbil'), bylo by vztažné. Rozhoduje, jak je slovo ve větě použité." },
  { q: "Urči druh zájmena 'co' ve větě: 'Přišel, co slíbil.'", a: "vztažné", opts: ["vztažné", "tázací", "neurčité", "záporné"], e: "Zde 'co' spojuje hlavní větu s vedlejší a odkazuje k tomu, co bylo slíbeno — je vztažné. Nejde o otázku, takže to není tázací 'co' jako ve větě 'Co děláš?'." },
  { q: "Urči druh zájmena 'jaký' ve větě: 'Jaký je to člověk?'", a: "tázací", opts: ["tázací", "vztažné", "neurčité", "ukazovací"], e: "Věta je otázka — ptáme se slovem 'jaký', proto je tázací. Kdyby 'jaký' uvozovalo vedlejší větu ('nevím, jaký je'), bylo by vztažné. Otazník napovídá, že jde o tázací zájmeno." },
  { q: "Urči druh zájmena: 'náš' (naše škola)", a: "přivlastňovací", opts: ["přivlastňovací", "ukazovací", "osobní", "neurčité"], e: "Slovo 'náš' říká, že škola patří nám — vyjadřuje vlastnictví, proto je přivlastňovací. Liší se od osobního 'my', které jen označuje osoby, ale nic nepřivlastňuje." },
  { q: "Urči druh zájmena 'někdo' ve větě: 'Někdo klepal na dveře.'", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"], e: "Slovo 'někdo' označuje osobu, kterou neznáme — nevíme, kdo to byl. Taková zájmena jsou neurčitá. Pozor na záporné 'nikdo', které by naopak řeklo, že nikdo neklepal." },
  { q: "Urči druh zájmena 'se' ve větě: 'Dívám se na oblohu.'", a: "osobní (zvratné)", opts: ["osobní (zvratné)", "přivlastňovací", "ukazovací", "vztažné"], e: "Slůvko 'se' se vztahuje zpět k tomu, kdo děj koná — je to osobní zvratné zájmeno. Nepřivlastňuje ani neukazuje, jen ukazuje, že činnost míří zpět na konatele." },
  { q: "Urči druh zájmena 'sám' ve větě: 'Udělal to sám.'", a: "neurčité (důrazové)", opts: ["neurčité (důrazové)", "záporné", "osobní", "přivlastňovací"], e: "Slovo 'sám' zdůrazňuje, že to udělal bez cizí pomoci. Řadí se mezi neurčitá (důrazová) zájmena. Nic nepopírá, takže to není záporné, a neoznačuje vlastnictví." },
  { q: "Urči druh zájmena: 'onen' (onen vzdálený svět)", a: "ukazovací", opts: ["ukazovací", "osobní", "neurčité", "tázací"], e: "Slovem 'onen' ukazujeme na něco vzdáleného — 'tamten, ten druhý'. Je to zájmeno ukazovací, patří k řadě ten, tento, onen. Neptá se ani neoznačuje osobu." },
  { q: "Urči druh zájmena 'nijaký'.", a: "záporné", opts: ["záporné", "neurčité", "tázací", "ukazovací"], e: "Slovo 'nijaký' popírá jakoukoli vlastnost — žádný takový není. Začíná na ni-, což je znak záporných zájmen. Pozor na neurčité 'nějaký', které naopak nějakou vlastnost připouští." },
  { q: "Urči druh zájmena 'čí' ve větě: 'Čí je tato taška?'", a: "tázací", opts: ["tázací", "vztažné", "přivlastňovací", "neurčité"], e: "Větou se ptáme, komu taška patří — slovem 'čí' se tážeme, proto je tázací. I když se ptá na vlastnictví, samo nepřivlastňuje (to by bylo 'moje, tvoje'), jen klade otázku." },
];

const POOL_L3: QA[] = [
  { q: "V jakém pádu je zájmeno 'mě' ve větě: 'Neviděl mě.'?", a: "4. pád (koho neviděl? mě)", opts: ["4. pád (koho neviděl? mě)", "2. pád", "3. pád", "6. pád"], e: "Pád určíme pádovou otázkou: 'Neviděl koho? mě.' Otázka 'koho, co?' patří ke 4. pádu. Proto je zájmeno 'mě' ve 4. pádu, ne ve druhém ('bez koho') ani třetím ('komu')." },
  { q: "Urči druh a pád zájmena 'sobě' ve větě: 'Koupila si to pro sebe.'", a: "osobní zvratné, 4. pád (sebe)", opts: ["osobní zvratné, 4. pád (sebe)", "přivlastňovací, 2. pád", "osobní, 3. pád", "neurčité, 4. pád"], e: "Zájmeno 'sebe' míří zpět na toho, kdo koupil — je osobní zvratné. Pádovou otázkou 'pro koho? pro sebe' zjistíme 4. pád. Nepřivlastňuje, takže přivlastňovací být nemůže." },
  { q: "Urči druh: 'všechno' ve větě: 'Zvládl všechno.'", a: "neurčité", opts: ["neurčité", "záporné", "ukazovací", "tázací"], e: "Slovo 'všechno' označuje celý, blíže neurčený rozsah věcí — řadí se k neurčitým zájmenům. Nic nepopírá (není záporné) a neukazuje na konkrétní věc jako 'ten'." },
  { q: "Urči druh: 'leckdo' ve větě: 'Leckdo by se divil.'", a: "neurčité", opts: ["neurčité", "záporné", "osobní", "tázací"], e: "Slovo 'leckdo' znamená 'kdekdo, mnohý' — osobu přesně neurčuje, proto je neurčité. Předpona lec- je typickým znakem neurčitých zájmen, podobně jako lec-co, lec-jaký." },
  { q: "Urči druh zájmena v souvětí: 'Přišel chlapec, který byl hodný.'", a: "vztažné (který)", opts: ["vztažné (který)", "tázací (který)", "ukazovací", "neurčité"], e: "Slovo 'který' zde spojuje hlavní větu s vedlejší a odkazuje na chlapce — je vztažné. Není to otázka, proto nejde o tázací 'který' jako ve větě 'Který přišel?'." },
  { q: "Urči druh: 'málokdo' ve větě: 'Málokdo o tom ví.'", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"], e: "Slovo 'málokdo' znamená 'jen někdo, jen pár lidí' — osobu neurčuje přesně, proto je neurčité. Pozor: i když říká 'málo', stále někoho připouští, takže není záporné jako 'nikdo'." },
  { q: "Urči druh a pád zájmena 'jejich' ve větě: 'To je jejich dům.'", a: "přivlastňovací, přívlastek (gen.)", opts: ["přivlastňovací, přívlastek (gen.)", "osobní, 2. pád", "ukazovací", "vztažné"], e: "Slovo 'jejich' říká, komu dům patří — je přivlastňovací a ve větě rozvíjí podstatné jméno 'dům' jako přívlastek. Liší se od osobního 'oni', které by jen označovalo osoby." },
  { q: "Urči druh: 'nikterak' ve větě: 'Nikterak se nespěchá.'", a: "záporné příslovce (od záporného zájmena)", opts: ["záporné příslovce (od záporného zájmena)", "záporné zájmeno", "neurčité zájmeno", "tázací příslovce"], e: "Slovo 'nikterak' vyjadřuje způsob ('nijak'), a slova vyjadřující způsob jsou příslovce. Vzniklo ze záporného zájmena, proto je to záporné příslovce, ne samotné zájmeno." },
  { q: "Urči druh: 'tentýž' ve větě: 'Přišel tentýž člověk.'", a: "ukazovací (totožnostní)", opts: ["ukazovací (totožnostní)", "neurčité", "osobní", "tázací"], e: "Slovo 'tentýž' ukazuje na to, že jde o stejnou, totožnou osobu — je ukazovací. Vychází ze zájmena 'ten', jen zdůrazňuje shodnost. Nepojmenovává osobu samu jako osobní zájmena." },
  { q: "Urči druh: 'kdekdo' ve větě: 'O tom věděl kdekdo.'", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"], e: "Slovo 'kdekdo' znamená 'kdokoli, leckdo' — osobu neurčuje přesně, proto je neurčité. Vzniklo z tázacího 'kdo', ale v této větě se neptáme, jen mluvíme o blíže neznámých lidech." },
  { q: "Urči druh: 'sebe' ve větě: 'Myslí jen na sebe.'", a: "osobní zvratné", opts: ["osobní zvratné", "přivlastňovací", "záporné", "neurčité"], e: "Zájmeno 'sebe' míří zpět na toho, kdo myslí — vztahuje děj k samotnému konateli, proto je osobní zvratné. Nepřivlastňuje (to by bylo 'svůj') ani nic nepopírá." },
  { q: "Urči druh: 'jiný' ve větě: 'Přijel jiný vlak.'", a: "neurčité", opts: ["neurčité", "ukazovací", "záporné", "tázací"], e: "Slovo 'jiný' znamená 'nějaký další, odlišný' — který přesně, nevíme, proto je neurčité. Neukazuje na konkrétní vlak jako 'ten' a nic nepopírá jako 'žádný'." },
  { q: "Urči druh zájmena 'jaký' ve větě: 'Nevím, jaký bude výsledek.'", a: "vztažné (uvozuje větu vedlejší)", opts: ["vztažné (uvozuje větu vedlejší)", "tázací", "neurčité", "ukazovací"], e: "Slovo 'jaký' zde uvozuje vedlejší větu a spojuje ji s hlavní — je vztažné. I když věta mluví o nejistotě, není to přímá otázka, proto nejde o tázací 'jaký' jako v 'Jaký bude?'." },
  { q: "Urči druh: 'kdosi' ve větě: 'Kdosi zavolal z neznámého čísla.'", a: "neurčité", opts: ["neurčité", "záporné", "osobní", "tázací"], e: "Slovo 'kdosi' označuje osobu, kterou neznáme. Přípona -si je typickým znakem neurčitých zájmen (kdosi, cosi, jakýsi). Nepopírá, takže není záporné." },
  { q: "Urči druh: 'veškerý' ve větě: 'Využil veškerý čas.'", a: "neurčité (totalizační)", opts: ["neurčité (totalizační)", "ukazovací", "záporné", "tázací"], e: "Slovo 'veškerý' znamená 'všechen, celý' — vyjadřuje úplný, blíže neurčený rozsah, proto patří k neurčitým zájmenům. Neukazuje na konkrétní věc a nic nepopírá." },
  { q: "Urči, co zájmena nahrazují v textu.", a: "jména (podstatná, přídavná) — zabraňují opakování", opts: ["jména (podstatná, přídavná) — zabraňují opakování", "slovesa", "příslovce", "předložky"], e: "Zájmena zastupují jména (podstatná i přídavná), abychom je nemuseli stále opakovat — místo 'Petr' řekneme 'on'. Nezastupují slovesa (děje) ani příslovce, ta mají vlastní druhy slov." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Osobní: já, ty, on, ona, my, vy, oni",
      "Přivlastňovací: můj, tvůj, jeho, náš, váš, jejich",
      "Ukazovací: ten, tento, onen, tamten",
      "Tázací: kdo, co, jaký, který — ptáme se",
      "Vztažná: který, jenž, co — uvozují větu vedlejší",
      "Neurčitá: někdo, něco, leckdo, kdekdo",
      "Záporná: nikdo, nic, žádný, nijaký",
    ],
    explanation: e,
  }));
}

export const ZAJMENADRUHYZAJMEN: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen",
    displayName: "Druhy zájmen",
    title: "Zájmena - druhy zájmen",
    studentTitle: "Druhy zájmen",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš druhy zájmen a naučíš se je rozlišovat ve větách.",
    keywords: ["zájmeno", "osobní", "přivlastňovací", "ukazovací", "tázací", "vztažné", "neurčité", "záporné"],
    goals: [
      "Rozlišit druhy zájmen",
      "Určit druh zájmena ve větě",
    ],
    boundaries: ["Bez pokročilého skloňování zájmen", "Bez záporných příslovcí"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek"],
    generator: gen,
    helpTemplate: {
      hint: "7 druhů: osobní, přivlastňovací, ukazovací, tázací, vztažná, neurčitá, záporná",
      steps: [
        "Označuje osobu (já, ty, on)? → osobní",
        "Přivlastňuje (můj, tvůj)? → přivlastňovací",
        "Ukazuje (ten, tento)? → ukazovací",
        "Ptá se (kdo, co)? → tázací; uvozuje větu vedlejší? → vztažné",
        "Neujasňuje (někdo, něco)? → neurčité; popírá (nikdo, nic)? → záporné",
      ],
      commonMistake: "Záměna tázacího 'který' a vztažného 'který': tázací = ptáme se, vztažné = uvozuje větu vedlejší",
      example: "Jaký druh zájmena je 'nikdo'? → záporné",
    },
  },
];
