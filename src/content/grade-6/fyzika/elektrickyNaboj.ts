/**
 * Fyzika 6. ročník — Elektrické pole: kladný a záporný náboj.
 *
 * První téma okruhu „Elektrické vlastnosti látek“ a zároveň první téma šestky,
 * kde se pracuje se **silou působící na dálku**. Všechno předchozí se dalo
 * osahat: délka, hmotnost, skupenství, promíchání látek. Tady poprvé něco
 * působí přes prázdný prostor, aniž se tělesa dotknou — a právě to je na tom
 * pro dítě nové.
 *
 * **Miskoncepce, na které téma cílí:**
 *  1. Třením náboj *vzniká*. (Nevzniká. Přesunou se elektrony z jednoho tělesa
 *     na druhé, takže jedno má přebytek a druhé přesně stejně velký nedostatek.
 *     Dohromady je to pořád nula.)
 *  2. Nabité těleso přitahuje jenom nabité. (Přitáhne i papírek nebo pramínek
 *     vody, které nabité nejsou. Celá L3 stojí na tomhle.)
 *  3. Elektrická síla potřebuje dotyk. (Nepotřebuje. Papírky se zvednou dřív,
 *     než se hřebene dotknou.)
 *  4. Zelektrovat se dá cokoli. (Kovová tyč držená v ruce ne — náboj z ní
 *     odteče tělem do země.)
 *
 * Gradace:
 *  • **L1 rozpoznání** — dvě tělesa se známými znaménky, přitáhnou se, nebo
 *    odpudí? Parametrické z banky deseti zelektrovaných těles.
 *  • **L2 aplikace** — co se při tření vlastně děje a proč to jednou vyjde
 *    a podruhé ne (vlhko, kov v ruce, zachování náboje).
 *  • **L3 přenos** — nabité těleso přitahuje i nenabité. Tady nestačí znát
 *    pravidlo ze L1, protože to pravidlo o téhle situaci nic neříká; musí se
 *    domyslet, že se náboje uvnitř papírku přeskupí.
 *
 * ## Rozhodnutí, která stojí za vysvětlení
 *
 * **Klíč se v L1 střídá.** U předchozího tématu (`pohybCastic.ts`) byla
 * správnou odpovědí vždycky ta teplejší strana, takže se úroveň dala projít
 * bez porozumění. Tady je to opravené konstrukcí: znaménka se losují nezávisle,
 * takže „přitáhnou se“ a „odpudí se“ padá střídavě a dítě musí obě znaménka
 * přečíst.
 *
 * **Znaménka v bance jsou fyzikálně správná, ne vymyšlená.** Sklo × hedvábí,
 * jantar × kožešina, balonek × vlna — všechno odpovídá skutečné trioelektrické
 * řadě. Dvojice, které k sobě patří, jsou v bance obě (balonek i svetr), takže
 * může padnout i ta poctivá dvojice z jednoho pokusu.
 *
 * **Nápovědy pravidlo opisují, neříkají ho slovy z klíče.** „Tlačí se od sebe“
 * místo „odpuzují se“. Obecné pravidlo v nápovědě zakázané není
 * (`CONTENT_AUTHORING` §7.1), ale doslovné slovo z klíče by prošlo i bez
 * přemýšlení. Termíny se vrátí ve `solutionSteps` a ve vysvětlení, kde už na
 * ně dítě po odpovědi narazí.
 *
 * **Pojem elektrostatická indukce tu nepadne**, přestože jev sám je jádrem L3.
 * Šestka ho zvládne popsat slovy („náboje uvnitř papírku se přeskupí“) a název
 * by z toho udělal slovíčko k zapamatování místo úvahy.
 *
 * **Bez Coulombova zákona, bez jednotky coulomb a bez výpočtů.** Síla se
 * porovnává jen slovně (větší, menší, se vzdáleností slábne).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as task, ruzneUlohy } from "./_shared";

/* ------------------------------------------------------------------ L1 --- */

/**
 * Zelektrovaná tělesa pro L1. `veta` je hotová celá věta včetně znaménka —
 * rod ani pád se do šablony nedostanou (táž zásada jako `stejneVeci`
 * v `pohybCastic.ts`). `koho` je druhý pád pro vazbu „u koho“ v nápovědě —
 * z prvního pádu se odvodit nedá („u jantar“, „u pravítko“). `kdo` slouží už
 * jen k abecednímu ustálení dvojice, do textu se nedostane.
 *
 * Znaménka odpovídají skutečné trioelektrické řadě: sklo se o hedvábí nabije
 * kladně, plast a jantar se o vlnu, vlasy nebo kožešinu nabijí záporně.
 */
const TELESA: { kdo: string; koho: string; veta: string; kladny: boolean }[] = [
  {
    kdo: "balonek",
    koho: "balonku",
    veta: "Nafouknutý balonek jsi potřel o vlněný svetr a má teď záporný náboj.",
    kladny: false,
  },
  {
    kdo: "svetr",
    koho: "svetru",
    veta: "Vlněný svetr, o který jsi třel balonek, má kladný náboj.",
    kladny: true,
  },
  {
    kdo: "pravítko",
    koho: "pravítka",
    veta: "Plastové pravítko jsi přejel suchým hadříkem a má teď záporný náboj.",
    kladny: false,
  },
  {
    kdo: "skleněná tyč",
    koho: "skleněné tyče",
    veta: "Skleněnou tyč jsi potřel hedvábím a má teď kladný náboj.",
    kladny: true,
  },
  {
    kdo: "hedvábný šátek",
    koho: "hedvábného šátku",
    veta: "Hedvábný šátek, kterým jsi třel skleněnou tyč, má záporný náboj.",
    kladny: false,
  },
  {
    kdo: "hřeben",
    koho: "hřebenu",
    veta: "Umělohmotný hřeben jsi protáhl suchými vlasy a má teď záporný náboj.",
    kladny: false,
  },
  {
    kdo: "vlasy",
    koho: "vlasů",
    veta: "Suché vlasy, kterými jsi protáhl hřeben, mají kladný náboj.",
    kladny: true,
  },
  {
    kdo: "jantar",
    koho: "jantaru",
    veta: "Kousek jantaru jsi potřel kožešinou a má teď záporný náboj.",
    kladny: false,
  },
  {
    kdo: "kožešina",
    koho: "kožešiny",
    veta: "Kožešina, kterou jsi třel jantar, má kladný náboj.",
    kladny: true,
  },
  {
    kdo: "igelitový sáček",
    koho: "igelitového sáčku",
    veta: "Igelitový sáček jsi přejel rukávem a má teď záporný náboj.",
    kladny: false,
  },
];

const KROKY_L1 = [
  "Najdi v zadání znaménko náboje u obou těles.",
  "Stejná znaménka znamenají odpuzování, opačná přitahování.",
  "Elektrická síla působí i na dálku — dotyk k ní potřeba není.",
];

function genL1(): PracticeTask {
  let a = pick(TELESA);
  let b = pick(TELESA);
  while (b.kdo === a.kdo) b = pick(TELESA);
  // Pořadí ustálíme abecedně, ať se zrcadlová dvojice nepočítá jako nová úloha.
  if (a.kdo > b.kdo) [a, b] = [b, a];

  const stejne = a.kladny === b.kladny;
  const klic = stejne ? "odpudí se" : "přitáhnou se";

  return task(
    `${a.veta} ${b.veta} Co se stane, když je k sobě přiblížíš?`,
    klic,
    [
      {
        value: stejne ? "přitáhnou se" : "odpudí se",
        why: stejne
          ? "K sobě se táhnou jen náboje opačných znamének. Tady mají obě tělesa znaménko stejné."
          : "Od sebe se tlačí jen náboje stejných znamének. Tady má každé těleso jiné.",
      },
      {
        value: "nestane se nic, náboje na sebe působí až při dotyku",
        why: "Dotyk potřeba není. Elektrická síla působí i přes mezeru, proto se papírky zvednou k hřebenu dřív, než se ho dotknou.",
      },
      {
        value: "záleží na tom, které z nich je těžší",
        why: "Hmotnost s tím nemá nic společného. Rozhoduje jedině znaménko náboje na obou tělesech.",
      },
    ],
    {
      hints: [
        `Porovnej jen ta dvě znaménka ze zadání — u ${a.koho} a u ${b.koho}.`,
        `Dvě tělesa se stejným znaménkem se od sebe tlačí pryč, dvě s opačným se k sobě táhnou. Nic jiného do toho nevstupuje: na velikosti ani hmotnosti nezáleží a tělesa se přitom nemusí dotknout. Vrať se proto k oběma větám ze zadání a u ${a.koho} i u ${b.koho} si najdi to jediné slovo, které znaménko určuje.`,
      ],
      solutionSteps: KROKY_L1,
      explanation: stejne
        ? "Obě tělesa mají náboj téhož znaménka, a proto se odpuzují. Souhlasné náboje se vždycky odpuzují, nesouhlasné vždycky přitahují."
        : "Tělesa mají náboje opačných znamének, a proto se přitahují. Nesouhlasné náboje se vždycky přitahují, souhlasné vždycky odpuzují.",
    },
  );
}

/* --------------------------------------------------------------- L2, L3 --- */

/** Ručně psaná položka banky: celá úloha včetně vlastního chybového modelu. */
interface Polozka {
  otazka: string;
  klic: string;
  chybne: { value: string; why: string }[];
  h0: string;
  h1: string;
  vysvetleni: string;
}

const MECHANISMUS: Polozka[] = [
  {
    otazka:
      "Balonek třeš o vlněný svetr. Balonek se nabije záporně, svetr kladně. Co se mezi nimi při tření přesunulo?",
    klic: "Elektrony ze svetru na balonek.",
    chybne: [
      {
        value: "Kladné částice z balonku na svetr.",
        why: "Kladné částice jsou v jádrech atomů a ty se z látky neuvolní. Pohyblivé jsou jedině elektrony.",
      },
      {
        value: "Nic se nepřesunulo, třením náboj vznikl z ničeho.",
        why: "Náboj z ničeho nevzniká. Jen se přemístí z jednoho tělesa na druhé.",
      },
      {
        value: "Teplo, které při tření vzniklo, se změnilo na náboj.",
        why: "Teplo při tření opravdu vzniká, ale na náboj se neproměňuje. Ten se jen přestěhoval.",
      },
    ],
    h0: "Zeptej se, co se v látce vůbec může pohnout z místa. Jádra atomů zůstávají, kde jsou.",
    h1: "Balonek skončil se záporným nábojem, takže mu něco záporného přibylo, a svetr s kladným, takže mu totéž ubylo. Jediné, co se v látce takhle stěhuje, jsou elektrony — záporné částice v obalu atomu. Ubývají tam, kde vznikl kladný náboj, a přibývají tam, kde vznikl záporný.",
    vysvetleni:
      "Při elektrování třením přecházejí z jednoho tělesa na druhé elektrony. Těleso, které je získá, má záporný náboj, těleso, které je ztratí, kladný. Kladné částice zůstávají v jádrech a nepohybují se.",
  },
  {
    otazka:
      "Před třením nebyl nabitý balonek ani svetr. Po tření má balonek záporný náboj a svetr kladný. Jaký je náboj obou těles dohromady?",
    klic: "Pořád nulový — přebytek na jednom je přesně tak velký jako nedostatek na druhém.",
    chybne: [
      {
        value: "Záporný, protože balonek se nabil silněji.",
        why: "Obě tělesa se nabijí stejně silně. Co jednomu přibude, to druhému přesně tolik chybí.",
      },
      {
        value: "Dvojnásobný proti tomu před třením, náboje se sečetly.",
        why: "Náboje opačných znamének se nesčítají, ale ruší. Dohromady dají nulu.",
      },
      {
        value: "To se bez měření nedá říct.",
        why: "Dá. Náboj nevzniká ani nemizí, jen se přemisťuje, takže součet musí zůstat stejný jako před pokusem.",
      },
    ],
    h0: "Elektrony nikam nezmizely. Jen se přestěhovaly z jednoho tělesa na druhé.",
    h1: "Kolik elektronů svetr ztratil, přesně tolik jich balonek získal. Kladný náboj svetru je proto stejně velký jako záporný náboj balonku a dohromady se přesně vyruší. Tomuhle pravidlu se říká zachování náboje a platí u každého elektrování, nejen u balonku.",
    vysvetleni:
      "Elektrický náboj se při elektrování zachovává. Nevzniká ani nezaniká, jen přechází z tělesa na těleso, takže součet nábojů obou těles zůstává stejný jako na začátku.",
  },
  {
    otazka:
      "Plastové pravítko se v ruce třením zelektruje snadno, železná tyč držená v ruce ne. Čím to je?",
    klic: "Kov je vodič, takže náboj z tyče okamžitě odteče rukou a tělem do země.",
    chybne: [
      {
        value: "Železo se elektrovat vůbec nedá, náboj na něm nedrží.",
        why: "Dá. Stačí tyč držet za izolační rukojeť nebo ji postavit na izolant — pak náboj neodteče a zůstane na ní.",
      },
      {
        value: "Železo je moc těžké, takže se náboj nestačí vytvořit.",
        why: "Hmotnost s elektrováním nesouvisí. Rozhoduje, jestli látka náboj propustí, nebo ne.",
      },
      {
        value: "Kov je hladký, takže se na něm třením nic nezachytí.",
        why: "Hladkost nerozhoduje. Sklo je také hladké a zelektrovat se dá bez potíží.",
      },
    ],
    h0: "Nemysli na to, jestli náboj vznikne, ale jestli na tělese zůstane.",
    h1: "Náboj na obou tyčích vzniká stejně dobře. Rozdíl je v tom, co se s ním stane potom: v kovu se pohybuje volně, takže projde rukou a tělem až do země a na tyči nic nezůstane. V plastu se pohnout nemůže, a proto tam zůstane sedět na místě, kde vznikl. Kdyby se železná tyč držela za plastovou rukojeť, zelektrovala by se také.",
    vysvetleni:
      "Vodiče náboj propouštějí, izolanty ne. Kovová tyč v holé ruce se proto nezelektruje — náboj z ní odteče do země. Izolant jako plast nebo sklo náboj udrží na místě.",
  },
  {
    otazka:
      "V mokrém a mlhavém počasí se pokusy s elektrováním nedaří: náboj na tělese chvíli vydrží a pak zmizí. Proč?",
    klic: "Vlhký vzduch vede elektrický náboj, takže ho z tělesa postupně odvede.",
    chybne: [
      {
        value: "Vlhko brání tomu, aby náboj vůbec vznikl.",
        why: "Vzniknout vznikne. Zadání říká, že chvíli drží — teprve potom se ztrácí.",
      },
      {
        value: "Voda náboj pohltí a změní ho na teplo.",
        why: "Na teplo se náboj neproměňuje. Vlhký vzduch ho jen odvede pryč z tělesa.",
      },
      {
        value: "Ve vlhku se tělesa hůř třou o sebe.",
        why: "Tření probíhá stejně. Rozdíl je až v tom, jak dlouho náboj na tělese vydrží.",
      },
    ],
    h0: "Zadání říká, že náboj nejdřív je a teprve pak mizí. Ptej se tedy, kam se poděl.",
    h1: "Suchý vzduch je izolant a náboj na tělese udrží. Jakmile je ve vzduchu vodní pára, stává se z něj špatný vodič a náboj po něm postupně uteče pryč. Právě proto se tyhle pokusy dělají v suchém pokoji v zimě a v létě u vody nevyjdou.",
    vysvetleni:
      "Vlhký vzduch vede náboj, a proto ho ze zelektrovaného tělesa odvede. Pokusy s elektrostatikou vycházejí nejlépe v suchu.",
  },
  {
    otazka: "Co je elektrické pole?",
    klic: "Prostor kolem nabitého tělesa, ve kterém působí síla na jiné nabité těleso.",
    chybne: [
      {
        value: "Vrstva vzduchu, která na nabitém tělese ulpí.",
        why: "Se vzduchem to nesouvisí. Elektrické pole je i tam, kde žádný vzduch není.",
      },
      {
        value: "Jiskra, která mezi dvěma nabitými tělesy přeskočí.",
        why: "Jiskra je jeden z projevů, ne pole samotné. Pole je kolem tělesa i tehdy, když nic nepřeskakuje.",
      },
      {
        value: "Náboj rozprostřený po povrchu tělesa.",
        why: "To je náboj, ne pole. Pole je až to, co je kolem tělesa a čím působí na okolí.",
      },
    ],
    h0: "Pole je odpověď na otázku, jak může jedno těleso působit na druhé přes prázdnou mezeru.",
    h1: "Kolem každého nabitého tělesa je prostor, ve kterém by na jiné nabité těleso působila síla. Tomu prostoru se říká elektrické pole a je i ve vzduchoprázdnu. Vidět není a poznáš ho jedině podle toho, co udělá s tělesem, které do něj vložíš.",
    vysvetleni:
      "Elektrické pole je prostor kolem nabitého tělesa, ve kterém působí elektrická síla. Právě přes ně se působení přenáší na dálku, bez dotyku.",
  },
  {
    otazka:
      "Nabitou tyč pomalu přibližuješ ke kuličce na vlákně. Kdy na kuličku bude elektrická síla působit nejsilněji?",
    klic: "Těsně u tyče — se vzdáleností síla slábne.",
    chybne: [
      {
        value: "Všude stejně, dokud je kulička v poli.",
        why: "Pole není všude stejně silné. Čím dál od nabitého tělesa, tím je slabší.",
      },
      {
        value: "V polovině cesty mezi tyčí a kuličkou.",
        why: "Uprostřed není nic zvláštního. Síla roste plynule, jak se kulička k tyči blíží.",
      },
      {
        value: "Až ve chvíli, kdy se kulička tyče dotkne.",
        why: "Dotyk potřeba není. Síla působí už předtím, jen je na dálku slabší.",
      },
    ],
    h0: "Vzpomeň si na papírky pod hřebenem: zvednou se, až když je hřeben dost blízko.",
    h1: "Elektrické pole je nejsilnější těsně u nabitého tělesa a se vzdáleností rychle slábne. Proto musíš hřeben k papírkům přiblížit na pár centimetrů a proto se nabitý balonek přilepí na zeď teprve tehdy, když se jí skoro dotýká.",
    vysvetleni:
      "Elektrická síla se vzdáleností slábne. Nejsilněji působí těsně u nabitého tělesa, na větší vzdálenost už je prakticky nepozorovatelná.",
  },
  {
    otazka:
      "Záporně nabitou tyčí se dotkneš kovové kuličky zavěšené na vlákně. Kulička se hned nato od tyče odtáhne. Co se stalo?",
    klic: "Část náboje přešla na kuličku, takže má teď stejné znaménko jako tyč.",
    chybne: [
      {
        value: "Kulička se dotykem vybila a vybitá tělesa se odpuzují.",
        why: "Nenabitá tělesa se neodpuzují vůbec. Kulička se odtáhla právě proto, že náboj získala.",
      },
      {
        value: "Tyč kuličku odstrčila nárazem při dotyku.",
        why: "Kdyby šlo o náraz, kulička by se po chvíli vrátila zpátky. Ona se drží stranou dál.",
      },
      {
        value: "Kulička se zahřála a teplo ji odtlačilo.",
        why: "Teplem se nic neodtlačuje. Za pohybem je elektrická síla mezi souhlasnými náboji.",
      },
    ],
    h0: "Před dotykem kulička nabitá nebyla, po dotyku se chová jinak. Muselo se tedy něco změnit právě při doteku.",
    h1: "Dotykem přejde část náboje z tyče na kuličku. Obě tělesa mají od té chvíle náboj téhož znaménka a souhlasné náboje se od sebe tlačí pryč. Je to ukázka, že náboj se dá z tělesa na těleso předat i bez tření, pouhým dotykem vodivých předmětů.",
    vysvetleni:
      "Dotykem se náboj rozdělí mezi obě tělesa. Ta pak mají souhlasný náboj a odpuzují se. Tohle chování využívá elektroskop.",
  },
  {
    otazka:
      "Atom má obvykle stejně kladných částic v jádře jako záporných elektronů v obalu, takže navenek není nabitý. Jak z něj vznikne záporný iont?",
    klic: "Přijme elektrony navíc, takže záporných částic má víc než kladných.",
    chybne: [
      {
        value: "Ztratí několik elektronů.",
        why: "Když elektrony ztratí, převáží kladné částice v jádře a vznikne kladný iont, ne záporný.",
      },
      {
        value: "Přibudou mu kladné částice v jádře.",
        why: "Kladných částic by přibýt muselo, jenže ty by náboj udělaly kladným. A jádro se při elektrování nemění.",
      },
      {
        value: "Jeho elektrony se zpomalí.",
        why: "Rychlost elektronů s nábojem nesouvisí. Rozhoduje jedině jejich počet proti počtu kladných částic.",
      },
    ],
    h0: "Porovnávej počty: kolik je v atomu kladných částic a kolik záporných.",
    h1: "Navenek nenabitý atom má obojích částic stejně, takže se jejich účinky vyruší. Jakmile se ta rovnováha poruší, začne atom působit navenek nábojem toho druhu, kterého má víc. Záporný náboj tedy znamená přebytek elektronů, kladný jejich nedostatek.",
    vysvetleni:
      "Nenabitý atom má stejný počet kladných částic a elektronů. Přebytek elektronů z něj udělá záporný iont, nedostatek kladný. Jádro se přitom nemění.",
  },
  {
    otazka:
      "Dva stejné balonky potřeš o týž vlněný svetr a pověsíš je vedle sebe na nitích. Co udělají?",
    klic: "Rozejdou se od sebe, protože oba dostaly náboj téhož znaménka.",
    chybne: [
      {
        value: "Přitáhnou se k sobě, protože jsou oba nabité.",
        why: "Nabité ještě neznamená k sobě. Přitahují se jen náboje opačných znamének a tyhle mají oba stejný.",
      },
      {
        value: "Zůstanou viset klidně, náboj se mezi nimi vyruší.",
        why: "Vyrušit by se mohly jen opačné náboje. Oba balonky se třely o totéž, takže mají znaménko stejné.",
      },
      {
        value: "Rozejdou se a po chvíli se zase přitáhnou.",
        why: "Náboj se sám na opačný nemění. Balonky se drží od sebe, dokud jim náboj neodteče, a pak zůstanou viset klidně.",
      },
    ],
    h0: "Oba balonky se třely o stejnou látku, takže dopadly stejně.",
    h1: "Vlna dává elektrony, plast je přijímá, takže se oba balonky nabijí záporně. Dvě tělesa se stejným znaménkem se od sebe tlačí pryč, a protože visí volně na nitích, síla je opravdu rozestoupí. Je to nejjednodušší pokus, kterým se dá odpuzování ukázat.",
    vysvetleni:
      "Tělesa zelektrovaná o tutéž látku dostanou náboj téhož znaménka, a proto se odpuzují. Na nitích je to vidět jako rozestup obou balonků.",
  },
  {
    otazka:
      "Balonek jenom přiložíš ke svetru a hned ho zvedneš, netřeš. Zelektruje se mnohem méně než po tření. Proč?",
    klic: "Třením se obě látky dotknou na mnohem víc místech, takže přejde mnohem víc elektronů.",
    chybne: [
      {
        value: "Teprve teplo z tření elektrony uvolní.",
        why: "Teplo při tření vzniká, ale elektrony neuvolňuje. Rozhoduje počet míst, kde se látky dotkly.",
      },
      {
        value: "Při pouhém přiložení se náboj nepřenáší vůbec.",
        why: "Trochu se přenese vždycky. Zadání říká, že se balonek zelektruje méně, ne že vůbec.",
      },
      {
        value: "Tření elektrony rozbíhá rychleji, a tak snáz přeskočí.",
        why: "Elektrony nikam neskáčou. Přecházejí tam, kde se obě látky dotýkají — a tření těch míst udělá spoustu.",
      },
    ],
    h0: "Povrch, který vypadá hladce, je zblízka samý hrbolek. Ptej se, kolik z nich se při pouhém přiložení potká.",
    h1: "Elektrony přecházejí jen v místech skutečného dotyku a těch je při pouhém přiložení překvapivě málo — povrchy se potkají jen na několika vyvýšeninách. Třením se po sobě látky posunou a vystřídá se přitom obrovské množství dotykových míst, takže přejde mnohem víc elektronů.",
    vysvetleni:
      "Při elektrování třením rozhoduje plocha skutečného dotyku. Tření ji mnohonásobně zvětší, a proto se těleso nabije mnohem silněji než pouhým přiložením.",
  },
  {
    otazka: "K čemu slouží elektroskop?",
    klic: "Ukáže, jestli je těleso nabité, a hrubě i jak silně.",
    chybne: [
      {
        value: "Změří, kolik elektrického proudu tělesem protéká.",
        why: "Proud měří ampérmetr. Elektroskop pracuje s nábojem na tělese, které nikam neteče.",
      },
      {
        value: "Určí, jestli je náboj kladný, nebo záporný.",
        why: "Sám o sobě to nepozná — lístky se rozestoupí u obou znamének stejně.",
      },
      {
        value: "Nabije těleso na požadovanou hodnotu.",
        why: "Nic nenabíjí. Je to ukazatel, ne zdroj.",
      },
    ],
    h0: "Vzpomeň si, co v elektroskopu vidíš: dva lehké lístky, které se rozestoupí.",
    h1: "Když se elektroskopu dotkneš nabitým tělesem, náboj z něj přejde až na oba lístky. Ty mají od té chvíle souhlasný náboj, takže se od sebe odtlačí — a čím větší náboj, tím víc se rozestoupí. Odpovídá to tedy na otázku zda a přibližně kolik, ale ne jakého znaménka.",
    vysvetleni:
      "Elektroskop ukazuje přítomnost a přibližnou velikost náboje. Lístky se rozestupují proto, že dostanou souhlasný náboj a odpuzují se. Znaménko sám neurčí.",
  },
  {
    otazka:
      "Zelektrovanou plastovou tyč položíš na dřevěný stůl a necháš ji tam do druhého dne. Ráno už nepřitahuje papírky. Kam se náboj poděl?",
    klic: "Postupně odtekl do okolí, hlavně vzduchem a podložkou.",
    chybne: [
      {
        value: "Sám se rozpadl a zanikl.",
        why: "Náboj nezaniká. Vždycky se jen přemístí jinam.",
      },
      {
        value: "Změnil se na opačný, a proto už papírky nepřitahuje.",
        why: "Kdyby měl opačné znaménko, papírky by přitahoval úplně stejně. Ony se nezvedají, protože tam žádný náboj nezbyl.",
      },
      {
        value: "Vsákl se do plastu hlouběji, kde už nepůsobí.",
        why: "V plastu se náboj nepohybuje ani do hloubky. Odešel z tyče pryč.",
      },
    ],
    h0: "Náboj nikdy nezmizí, jen se přesune. Ptej se tedy, kudy mohl z tyče odejít.",
    h1: "Ani vzduch, ani dřevo nejsou dokonalé izolanty, takže po nich náboj pomalu uniká pryč. Za pár hodin z tyče odteče všechen. Právě proto se elektrostatické pokusy dělají hned a ve vlhku vydrží ještě mnohem kratší dobu než v suchu.",
    vysvetleni:
      "Náboj se ze zelektrovaného tělesa postupně ztrácí do okolí, protože žádný izolant není dokonalý. Nezaniká, jen odteče jinam.",
  },
];

const PRITAHOVANI: Polozka[] = [
  {
    otazka:
      "Hřeben protažený suchými vlasy přiblížíš k malým kouskům papíru. Papírky vyskočí k hřebenu, přestože nabité nejsou. Jak je to možné?",
    klic: "Náboje uvnitř papírku se přeskupí: k hřebenu se stáhnou ty opačné, a proto papírek převáží k němu.",
    chybne: [
      {
        value: "Papír je vždycky trochu nabitý, jen je to málo vidět.",
        why: "Papírky leží na stole nenabité. Kdyby nabité byly, polovina by se od hřebenu odtáhla.",
      },
      {
        value: "Hřeben papírky nasaje proudem vzduchu.",
        why: "Žádný vzduch se nehýbe. Hřeben se ani nepohnul, jen se přiblížil.",
      },
      {
        value: "Papírky jsou tak lehké, že je zvedne každý předmět.",
        why: "Nezelektrovaný hřeben je nezvedne vůbec, i když je stejně lehký. Rozhoduje náboj, ne hmotnost.",
      },
    ],
    h0: "Papírek jako celek nabitý není, uvnitř něj ale kladné i záporné částice jsou. Zamysli se, co s nimi hřeben udělá.",
    h1: "V papírku se náboje můžou kousek posunout. Hřeben ty opačné přitáhne ke svému konci a ty souhlasné odtlačí na opačnou stranu papírku. Opačné jsou tím pádem blíž než souhlasné, a protože síla se vzdáleností slábne, přitažení převáží nad odpuzením. Papírek proto vyskočí.",
    vysvetleni:
      "Nabité těleso přitahuje i tělesa nenabitá. Náboje v nich se přeskupí tak, že opačné jsou blíž než souhlasné, a přitažení tím převáží. Právě proto se u tohohle pokusu nikdy nestane, že by papírek odletěl pryč.",
  },
  {
    otazka:
      "Z kohoutku necháš téct velmi tenký pramínek vody a přiblížíš k němu zelektrované pravítko. Pramínek se k pravítku ohne. Proč se ohýbá, když voda nabitá není?",
    klic: "V molekulách vody se náboje natočí tak, že opačné míří k pravítku, a proto je pramínek přitažen.",
    chybne: [
      {
        value: "Pravítko vodu nabije na opačný náboj a pak ji přitáhne.",
        why: "K žádnému nabití nedojde, pravítko se vody ani nedotklo. Náboje v molekulách se jen natočí.",
      },
      {
        value: "Voda po pravítku stéká, protože je hladké.",
        why: "Pramínek se ohne dřív, než se pravítka dotkne, a stéká dál vzduchem.",
      },
      {
        value: "Teplo z pravítka ohřeje vzduch a ten pramínek odkloní.",
        why: "Pravítko není teplé a proud vzduchu by pramínek odfoukl pryč, ne přitáhl.",
      },
    ],
    h0: "Je to táž věc jako s papírky u hřebenu, jen s vodou. Ptej se, co se stane s náboji uvnitř.",
    h1: "Molekula vody má jednu stranu spíš kladnou a druhou spíš zápornou. V poli pravítka se všechny natočí stejně: tou stranou, která je k pravítku přitahována. Opačné náboje jsou tím pádem blíž než souhlasné a přitažení převáží. Pramínek se proto ohne bez ohledu na to, jakým znaménkem je pravítko nabité.",
    vysvetleni:
      "Pramínek vody se ohne k libovolně nabitému tělesu. Molekuly vody se v poli natočí a opačné náboje se dostanou blíž, takže přitažení převáží. Voda přitom zůstane nenabitá.",
  },
  {
    otazka:
      "Nafouknutý balonek potřeš o vlasy a přitiskneš ho na zeď. Balonek na zdi visí, i když zeď nabitá není. Co ho tam drží?",
    klic: "Balonek přeskupí náboje ve zdi, takže je k němu přitahována stejně jako papírek k hřebenu.",
    chybne: [
      {
        value: "Zeď se od balonku nabila na opačný náboj.",
        why: "Zeď je izolant a náboj z balonku na ni nepřejde. Uvnitř se náboje jen posunou.",
      },
      {
        value: "Balonek se na zeď přisál, protože je z gumy.",
        why: "Nepotřený balonek se na zeď nepřisaje. Rozhoduje náboj, ne guma.",
      },
      {
        value: "Drží ho tam vlhkost ze vzduchu.",
        why: "Ve vlhku pokus naopak nevyjde — vlhký vzduch náboj z balonku odvede a balonek spadne.",
      },
    ],
    h0: "Balonek nabitý je, zeď ne. Znáš už jednu situaci, kde nabité drží nenabité.",
    h1: "Ve zdi se náboje kousek posunou: ty opačné se stáhnou k balonku a ty souhlasné ustoupí dál dozadu. Opačné jsou pak blíž a přitažení převáží nad odpuzením, takže balonek na zdi visí. Za pár hodin mu náboj odteče a balonek spadne sám od sebe.",
    vysvetleni:
      "Balonek drží na zdi touž silou, jakou hřeben zvedá papírky. Nenabitá stěna se v poli nabitého tělesa chová tak, že opačné náboje jsou blíž, a proto ji balonek přitahuje.",
  },
  {
    otazka:
      "Dva balonky potřené o vlasy se od sebe odtáhnou, ale oba se přilepí na zeď. Jak to, že se jednou odpuzují a podruhé přitahují?",
    klic: "Oba balonky mají souhlasný náboj, kdežto zeď nabitá není — u nenabitého tělesa jde vždycky o přitahování.",
    chybne: [
      {
        value: "Zeď je nabitá opačně než balonky.",
        why: "Zeď nabitá není. Kdyby byla, udržela by i nepotřený balonek — a ten po ní sklouzne dolů.",
      },
      {
        value: "Balonky jsou u zdi blíž, a proto se chovají jinak.",
        why: "Vzdálenost mění jen sílu, ne to, jestli jde o přitahování nebo odpuzování.",
      },
      {
        value: "Zeď je těžší, a proto přitahování vyhraje.",
        why: "Hmotnost do elektrické síly nevstupuje vůbec.",
      },
    ],
    h0: "Rozdíl není v balonkách, ale v tom druhém tělese. Jednou je nabité, podruhé ne.",
    h1: "Mezi dvěma nabitými tělesy rozhoduje znaménko: souhlasná se od sebe tlačí pryč, opačná k sobě. Jenže nenabité těleso žádné znaménko nemá — v jeho nitru se náboje teprve přeskupí, a to vždycky tak, aby opačné skončily blíž. Proto nabité těleso přitahuje každé nenabité, ať už je samo nabité jakkoli.",
    vysvetleni:
      "Mezi dvěma nabitými tělesy může jít o přitahování i odpuzování podle znamének. Nabité těleso a nenabité těleso se přitahují vždycky.",
  },
  {
    otazka:
      "Nabitou tyč přiblížíš k elektroskopu, ale vůbec se ho nedotkneš. Lístky se přesto rozestoupí. Co se v elektroskopu stalo?",
    klic: "Náboje se v něm přesunuly: souhlasné se stáhly do lístků a ty se odpudily.",
    chybne: [
      {
        value: "Náboj z tyče přeskočil na elektroskop vzduchem.",
        why: "Nic nepřeskočilo. Kdyby ano, lístky by zůstaly rozestoupené i po oddálení tyče.",
      },
      {
        value: "Lístky se rozfoukly vzduchem, který tyč před sebou tlačila.",
        why: "Lístky jsou uvnitř uzavřené baňky, kam se vzduch zvenku nedostane.",
      },
      {
        value: "Elektroskop se zahřál a lístky se roztáhly.",
        why: "Teplem by se lístky neroztáhly do stran. Rozestupuje je elektrická síla.",
      },
    ],
    h0: "Celkový náboj elektroskopu se nezměnil. Přesto se něco muselo pohnout.",
    h1: "Elektroskop je z kovu, takže se v něm náboj volně pohybuje. Tyč k sobě přitáhne náboje opačného znaménka nahoru ke svému konci a ty souhlasné odtlačí dolů až do lístků. Oba lístky tím dostanou stejné znaménko a rozestoupí se. Jakmile tyč oddálíš, náboje se vrátí zpátky a lístky klesnou.",
    vysvetleni:
      "Přiblížením nabitého tělesa se náboje ve vodiči přeskupí, i když na něj žádný náboj nepřejde. Lístky se proto rozestoupí a po oddálení tyče zase klesnou.",
  },
  {
    otazka:
      "Po vystoupení z auta tě při doteku kliky cvakne. Kdy se to stane spíš?",
    klic: "V mrazivém suchém dni.",
    chybne: [
      {
        value: "V teplém deštivém dni.",
        why: "Ve vlhku náboj z tebe průběžně odtéká vzduchem, takže se žádný nenahromadí.",
      },
      {
        value: "Vždycky stejně, na počasí to nezávisí.",
        why: "Závisí, a hodně. Rozhoduje, jestli vzduch náboj odvádí, nebo ne.",
      },
      {
        value: "V horkém letním dni.",
        why: "V létě bývá ve vzduchu hodně vodní páry a ta náboj odvede dřív, než se stihne nastřádat.",
      },
    ],
    h0: "Aby to cvaklo, musí se na tobě náboj nejdřív nastřádat. Ptej se, kdy mu v tom nic nebrání.",
    h1: "Při posouvání po sedačce se zelektruješ třením. Jestli náboj zůstane, nebo průběžně odteče, rozhoduje vzduch: suchý mrazivý je dobrý izolant a nechá ho na tobě nastřádat, vlhký ho odvádí průběžně pryč. Cvaknutí je pak výboj mezi tebou a klikou, který ten nastřádaný náboj vyrovná.",
    vysvetleni:
      "Nepříjemné cvaknutí o kliku je elektrostatický výboj. Nastřádaný náboj přeskočí do kovu. Nejčastěji se to stává v suchém mrazivém počasí, protože suchý vzduch náboj neodvádí.",
  },
  {
    otazka:
      "Obrazovka televize se rychleji zapráší než dřevěná police vedle ní. Čím to je?",
    klic: "Zapnutá obrazovka je zelektrovaná a nenabitá zrnka prachu k sobě přitahuje.",
    chybne: [
      {
        value: "Obrazovka je teplá, a teplo prach přitahuje.",
        why: "Teplo prach nepřitahuje. Nad teplým tělesem vzduch spíš stoupá a prach odnáší.",
      },
      {
        value: "Prach se drží na hladkém povrchu lépe než na dřevě.",
        why: "Na hladkém povrchu prach naopak spíš sklouzne. Drží ho tam elektrická síla.",
      },
      {
        value: "Prach je nabitý a obrazovka má opačný náboj.",
        why: "Zrnka prachu ve vzduchu nabitá nejsou. K přitažení je nemusí být — stačí, že se v nich náboje přeskupí.",
      },
    ],
    h0: "Prach sám nabitý není. Přesto se to chová jako papírky pod hřebenem.",
    h1: "Na zapnuté obrazovce se hromadí náboj a kolem ní je proto elektrické pole. V každém zrnku prachu, které do pole vletí, se náboje přeskupí tak, že opačné skončí blíž k obrazovce. Zrnko je tím pádem přitaženo a přilepí se. Dřevěná police kolem sebe žádné pole nemá, takže na ni prach jen padá.",
    vysvetleni:
      "Zelektrovaný povrch přitahuje nenabitý prach stejným způsobem, jakým hřeben zvedá papírky. Proto se obrazovky a plastové kryty práší rychleji než dřevo.",
  },
  {
    otazka:
      "Sundáš si v zimě čepici a vlasy se ti rozletí na všechny strany. Co se s nimi stalo?",
    klic: "Všechny vlasy dostaly třením týž náboj, a proto se od sebe tlačí pryč.",
    chybne: [
      {
        value: "Každý vlas dostal jiný náboj, a tak se navzájem přitahují i odpuzují.",
        why: "Kdyby se přitahovaly, slepily by se k sobě. Ony míří všechny od sebe, takže mají náboj stejný.",
      },
      {
        value: "Čepice je nadzvedla statickým vzduchem.",
        why: "Vlasy zůstanou rozcuchané i dlouho po sundání čepice. Vzduch to tedy není.",
      },
      {
        value: "Vlasy se chladem smrští a postaví se.",
        why: "Chladem se vlasy nestaví. Ve stejném mrazu, ale bez čepice, se to nestane.",
      },
    ],
    h0: "Vlasy míří od sebe, ne k sobě. To samo o sobě hodně napoví o jejich znaménkách.",
    h1: "Tření o čepici odvede ze všech vlasů elektrony stejným směrem, takže dostanou náboj téhož znaménka. Souhlasné náboje se od sebe tlačí pryč a vlasy jsou dost lehké, aby je ta síla nadzvedla. Rozestoupí se proto tak, aby od sebe byly co nejdál.",
    vysvetleni:
      "Vlasy zelektrované o čepici mají všechny stejný náboj, a proto se odpuzují. Je to táž síla jako mezi dvěma balonky potřenými o týž svetr.",
  },
  {
    otazka:
      "Zelektrovanou tyč přiblížíš k papírku. Nic se nestane. Přiblížíš ji ještě víc a papírek vyskočí. Proč to napoprvé nešlo?",
    klic: "Na větší vzdálenost je síla tak slabá, že papírek nenadzvedne.",
    chybne: [
      {
        value: "Pole má ostrou hranici a papírek byl ještě za ní.",
        why: "Žádná hranice neexistuje. Pole plynule slábne, takže v jedné chvíli síla na zvednutí stačí a o kousek dál už ne.",
      },
      {
        value: "Napoprvé nebyla tyč dost nabitá a přiblížením se nabila víc.",
        why: "Přiblížením se náboj na tyči nemění. Mění se jen vzdálenost, a tím i síla.",
      },
      {
        value: "Papírek se musel nejdřív nabít, a to chvíli trvá.",
        why: "Papírek se nenabíjí vůbec. Náboje se v něm jen přeskupí, a to okamžitě.",
      },
    ],
    h0: "Mezi oběma pokusy se změnila jediná věc — vzdálenost.",
    h1: "Elektrická síla se vzdáleností rychle slábne. Na papírek působí i zdaleka, jenže tak slabě, že nepřemůže jeho tíhu. Jakmile tyč přiblížíš, síla rychle vzroste a v jistém okamžiku už na zvednutí stačí. Žádná ostrá hranice u toho není, jde o plynulý přechod.",
    vysvetleni:
      "Elektrická síla působí na libovolnou vzdálenost, ale rychle slábne. Papírek se zvedne teprve tehdy, když převáží jeho tíhu.",
  },
  {
    otazka:
      "Čím se liší přitažení nenabitého papírku od přitažení opačně nabité kuličky?",
    klic: "U kuličky působí síla mezi náboji obou těles rovnou, u papírku se náboje musí nejdřív uvnitř přeskupit.",
    chybne: [
      {
        value: "Ničím, jde přesně o totéž.",
        why: "Výsledek vypadá stejně, cesta k němu ale stejná není. Papírek žádný vlastní náboj nemá.",
      },
      {
        value: "Papírek se přitáhne jen tehdy, když je z kovu.",
        why: "Papír kov není a přitáhne se také. Náboje se posunou i v izolantu, jen o kousek.",
      },
      {
        value: "Kuličku lze přitáhnout jen zblízka, papírek i zdaleka.",
        why: "Spíš je to obráceně — na nenabitý papírek je síla slabší, protože ji oslabuje i odpuzení souhlasných nábojů.",
      },
    ],
    h0: "U jednoho z těles víš znaménko předem, u druhého žádné není.",
    h1: "U nabité kuličky stačí porovnat obě znaménka a hotovo. U papírku žádné znaménko není, takže se musí nejdřív stát něco navíc: v poli tyče se v něm náboje posunou, opačné skončí blíž a souhlasné dál. Teprve tím přitažení převáží nad odpuzením — a je proto slabší než u skutečně nabité kuličky.",
    vysvetleni:
      "Přitažení nabitého tělesa je přímé a dá se předpovědět ze znamének. Přitažení nenabitého tělesa je nepřímé: nejdřív se v něm náboje přeskupí a teprve pak převáží přitažení nad odpuzením.",
  },
  {
    otazka:
      "Záporně nabitý hřeben papírky zvedne. Jak dopadne týž pokus s hřebenem nabitým kladně?",
    klic: "Papírky se zvednou úplně stejně.",
    chybne: [
      {
        value: "Papírky se od hřebenu odtáhnou.",
        why: "Odtáhnout by se mohly, jen kdyby byly samy nabité souhlasně. Nenabitý papírek je přitahován vždycky.",
      },
      {
        value: "Papírky zůstanou ležet, kladný náboj na ně nepůsobí.",
        why: "Působí stejně dobře. Náboje v papírku se přeskupí u obou znamének, jen pokaždé obráceně.",
      },
      {
        value: "Papírky se zvednou, ale jen pokud jsou úplně suché.",
        why: "Vlhkost rozhoduje o tom, jak dlouho náboj na hřebenu vydrží, ne o směru síly.",
      },
    ],
    h0: "Zeptej se, co se v papírku stane u kladného hřebenu a co u záporného.",
    h1: "U záporného hřebenu se v papírku stáhnou blíž náboje kladné, u kladného zase záporné. V obou případech skončí blíž ty opačné, takže přitažení převáží. Znaménko hřebenu tedy rozhoduje jen o tom, které náboje se v papírku posunou kam — výsledek je vždycky přitažení.",
    vysvetleni:
      "Nabité těleso přitahuje nenabité bez ohledu na své znaménko. Odpuzování může nastat jedině mezi dvěma tělesy, která jsou obě nabitá souhlasně.",
  },
  {
    otazka:
      "Cisterny s pohonnými hmotami mívají vzadu řetěz vlekoucí se po silnici. K čemu je?",
    klic: "Odvádí do země náboj, který na cisterně vzniká třením, aby nepřeskočila jiskra.",
    chybne: [
      {
        value: "Drží cisternu při brzdění na místě.",
        why: "Volně se vlekoucí řetěz nic neudrží. Jeho úkol je elektrický, ne mechanický.",
      },
      {
        value: "Ukazuje ostatním řidičům, že jde o nebezpečný náklad.",
        why: "K označení slouží oranžové tabulky. Řetěz má jiný úkol.",
      },
      {
        value: "Odvádí teplo od nádrže.",
        why: "Teplo by řetězem neodešlo. Odvádí náboj.",
      },
    ],
    h0: "Vzpomeň si na cvaknutí o kliku auta a domysli, co by takový výboj udělal u benzinu.",
    h1: "Jízdou a přečerpáváním se cisterna zelektruje třením. Kdyby se náboj nastřádal, přeskočila by jiskra a u benzinových par by to znamenalo požár. Řetěz je vodivé spojení se zemí, takže náboj odtéká průběžně a nemá se kde nahromadit. Ze stejného důvodu se cisterna před stáčením uzemňuje kabelem.",
    vysvetleni:
      "Uzemnění odvádí vzniklý náboj průběžně do země a zabrání výboji. U hořlavin je to bezpečnostní opatření proti jiskře.",
  },
];

const KROKY_L2 = [
  "Ptej se, co se v látce může pohnout — jsou to jedině elektrony.",
  "Náboj nevzniká ani nemizí, jen přechází z tělesa na těleso.",
  "Jestli na tělese zůstane, rozhoduje vodič × izolant a vlhkost okolí.",
];

const KROKY_L3 = [
  "Zjisti, jestli je to druhé těleso nabité, nebo ne.",
  "Nabité × nabité: rozhodují znaménka. Nabité × nenabité: vždycky přitažení.",
  "U nenabitého tělesa se náboje uvnitř přeskupí — opačné blíž, souhlasné dál.",
];

function zBanky(p: Polozka, kroky: string[]): PracticeTask {
  return task(p.otazka, p.klic, p.chybne, {
    hints: [p.h0, p.h1],
    solutionSteps: kroky,
    explanation: p.vysvetleni,
  });
}

function gen(level: number): PracticeTask[] {
  return ruzneUlohy(() =>
    level === 1
      ? genL1()
      : level === 2
        ? zBanky(pick(MECHANISMUS), KROKY_L2)
        : zBanky(pick(PRITAHOVANI), KROKY_L3),
  );
}

export const ELEKTRICKY_NABOJ: TopicMetadata[] = [
  {
    id: "g6-fyz-elektricky-naboj-6",
    rvpNodeId:
      "g6-fyzika-elektricke-vlastnosti-latek-elektricky-naboj-a-magnetismus-elektricke-pole-kladny-a-zaporny-naboj",
    displayName: "Elektrický náboj",
    title: "Elektrické pole – kladný a záporný náboj",
    studentTitle: "Elektrický náboj",
    subject: "fyzika",
    category: "Elektrické vlastnosti látek",
    topic: "Elektrický náboj a magnetismus",
    briefDescription: "Zjistíš, proč se balonek přilepí na zeď a proč tě cvakne o kliku.",
    keywords: [
      "elektrický náboj", "kladný náboj", "záporný náboj", "elektrické pole",
      "elektrování třením", "přitahování a odpuzování", "vodič", "izolant",
      "elektroskop", "uzemnění",
    ],
    goals: [
      "Rozhodnout ze znamének, zda se dvě nabitá tělesa přitáhnou, nebo odpudí.",
      "Vysvětlit elektrování třením přechodem elektronů a zachováním náboje.",
      "Vysvětlit, proč nabité těleso přitahuje i těleso nenabité.",
    ],
    boundaries: [
      "Bez Coulombova zákona, bez jednotky coulomb a bez výpočtů — síla se porovnává slovy.",
      "Elektrický proud a obvod má vlastní téma, tady náboj nikam neteče.",
      "Název elektrostatická indukce nepadne, jev se popisuje slovy.",
      "Bez siločar a bez podrobné stavby atomu.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Souhlasné náboje se odpuzují, nesouhlasné přitahují. Nabité těleso přitahuje i nenabité.",
      steps: [
        "U dvou nabitých těles porovnej znaménka.",
        "Při tření přecházejí elektrony — náboj nevzniká, jen se stěhuje.",
        "U nenabitého tělesa se náboje uvnitř přeskupí a přitažení vždycky převáží.",
      ],
      commonMistake: "Myslet si, že třením náboj vzniká a že nabité těleso přitahuje jen nabité.",
      example: "Balonek potřený o vlasy visí na zdi, i když zeď nabitá není — náboje ve zdi se přeskupí.",
    },
  },
];
