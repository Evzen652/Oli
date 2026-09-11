import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Generátor vracel na všech úrovních
// tentýž seznam, převážně se společnou nápovědou. Teď tři oddělené banky:
// L1 co musí omluvenka, vzkaz, pozvánka a oznámení obsahovat · L2 poznat
// útvar podle ukázky · L3 najít, co v ukázce chybí, vybrat útvar pro situaci
// a správné oslovení nebo zakončení.

const L1: PracticeTask[] = [
  choice("Co musí obsahovat omluvenka?", "koho omlouváme, kdy a proč chyběl a podpis rodiče", [
    { value: "jen datum, kdy žák chyběl", why: "Chybí jméno, důvod i podpis." },
    { value: "jen jméno chybějícího žáka", why: "Chybí datum, důvod i podpis." },
    { value: "básničku a přání pro učitele", why: "To do omluvenky nepatří." },
  ], { hints: ["Kolik různých údajů musí učitel z omluvenky vyčíst?", "Učitel potřebuje vědět, o koho jde, kdy a proč nebyl ve škole — a že o tom ví dospělý."], explanation: "Omluvenka říká, kdo chyběl, kdy a proč, a podepíše ji rodič." }),
  choice("Komu je omluvenka ze školy určená?", "třídní učitelce nebo třídnímu učiteli", [
    { value: "kamarádovi ze třídy", why: "Kamarád docházku nevede." },
    { value: "školníkovi", why: "Školník docházku nevede." },
    { value: "nikomu, jen se založí", why: "Omluvenku musí dostat učitel." },
  ], { hints: ["Kdo ve třídě zapisuje, kdo chyběl?", "Docházku třídy vede ten, kdo má třídu na starosti."], explanation: "Omluvenku dostává třídní učitel nebo učitelka." }),
  choice("Co je vzkaz?", "krátká zpráva pro jednoho člověka", [
    { value: "dlouhé vyprávění příběhu", why: "Vzkaz je krátký." },
    { value: "báseň s rýmy a verši", why: "Vzkaz není báseň." },
    { value: "cedule na nástěnce pro všechny", why: "To je oznámení." },
  ], { hints: ["Co necháš mamince na lednici, když odcházíš?", "Pár vět tomu, kdo tě hledá — kde jsi a kdy se vrátíš."], explanation: "Vzkaz je krátká zpráva pro jednoho konkrétního člověka." }),
  choice("Co musí obsahovat pozvánka?", "co se koná, kdy, kde a kdo zve", [
    { value: "jen datum", why: "Pozvaný by nevěděl kam a na co." },
    { value: "jen adresu", why: "Pozvaný by nevěděl kdy." },
    { value: "jen seznam dárků", why: "Dárky na pozvánku nepatří." },
  ], { hints: ["Co všechno musí pozvaný vědět, aby dorazil?", "Na akci trefíš, jen když víš, o jakou jde, v kolik a na jaké adrese — a od koho je pozvání."], explanation: "Pozvánka říká co, kdy, kde a kdo zve." }),
  choice("Co je oznámení?", "sdělení pro mnoho lidí najednou", [
    { value: "soukromý dopis jednomu člověku", why: "Dopis je pro jednoho." },
    { value: "pohlednice z dovolené", why: "Pohlednice je pro jednoho." },
    { value: "básnička k svátku", why: "To je přání." },
  ], { hints: ["Komu je určená cedule na školní nástěnce?", "Oznámení si přečte kdokoli, koho se informace týká — třeba celá škola."], explanation: "Oznámení je sdělení pro mnoho lidí najednou." }),
  choice("Čím začíná omluvenka?", "zdvořilým oslovením", [
    { value: "pozdravem Ahoj", why: "Ahoj je pro kamarády." },
    { value: "podpisem rodiče", why: "Podpis je na konci." },
    { value: "básničkou", why: "Básnička do omluvenky nepatří." },
  ], { hints: ["Jak začíná dopis dospělému, kterému vykáme?", "Na začátku oslovíme toho, komu píšeme: Vážená paní učitelko,"], explanation: "Omluvenka začíná zdvořilým oslovením: Vážená paní učitelko," }),
  choice("Čím končí omluvenka?", "pozdravem a podpisem rodiče", [
    { value: "otázkou na učitele", why: "Otázka na konec omluvenky nepatří." },
    { value: "oslovením", why: "Oslovení je na začátku." },
    { value: "nadpisem", why: "Nadpis by byl nahoře." },
  ], { hints: ["Co bývá na konci každého dopisu?", "Na závěr připojíme zdvořilé „S pozdravem“ a jméno toho, kdo píše."], explanation: "Omluvenka končí pozdravem a podpisem rodiče." }),
  choice("Kdo podepisuje omluvenku?", "rodič", [
    { value: "žák sám", why: "Žák se nemůže omlouvat sám." },
    { value: "spolužák", why: "Spolužák za nikoho neručí." },
    { value: "prodavačka", why: "Ta s omluvenkou nemá nic společného." },
  ], { hints: ["Kdo za dítě odpovídá?", "Podpis dospělého dokazuje, že o chybění ví a souhlasí."], explanation: "Omluvenku podepisuje rodič." }),
  choice("Proč se píše omluvenka?", "aby škola věděla, proč žák chyběl", [
    { value: "pro zábavu", why: "Omluvenka má vážný účel." },
    { value: "aby měl žák volno", why: "Omluvenka volno nedává, jen vysvětluje." },
    { value: "každý pátek povinně", why: "Píše se jen, když žák chyběl." },
  ], { hints: ["Co potřebuje škola vědět, když žák nepřijde?", "Škola musí vědět, že nepřítomnost měla vážný důvod a rodiče o ní vědí."], explanation: "Omluvenka vysvětluje škole, proč žák chyběl." }),
  choice("Jaký je rozdíl mezi vzkazem a oznámením?", "vzkaz je pro jednoho, oznámení pro mnoho lidí", [
    { value: "vzkaz je pro mnoho lidí, oznámení pro jednoho", why: "Je to obráceně." },
    { value: "vzkaz je vždy delší než oznámení", why: "Délka o tom nerozhoduje." },
    { value: "mezi vzkazem a oznámením není rozdíl", why: "Liší se tím, komu jsou určené." },
  ], { hints: ["Komu píšeš lístek na lednici a komu je určená nástěnka?", "Rozhoduje, kolik lidí má text přečíst."], explanation: "Vzkaz je pro jednoho, oznámení pro mnoho lidí." }),
  choice("Co má obsahovat vzkaz kamarádovi?", "kdo píše a co sděluje", [
    { value: "jen básničku", why: "Vzkaz není báseň." },
    { value: "vždy omluvu", why: "Vzkaz nemusí být omluva." },
    { value: "dlouhý příběh", why: "Vzkaz je krátký." },
  ], { hints: ["Co potřebuje kamarád vědět, aby vzkazu rozuměl?", "Musí poznat, od koho lístek je a o co jde."], explanation: "Vzkaz říká, kdo píše a co sděluje." }),
  choice("Kde nejčastěji visí oznámení pro celou školu?", "na nástěnce", [
    { value: "v šuplíku", why: "Tam by ho nikdo neviděl." },
    { value: "v soukromém sešitě", why: "Ten čte jen jeden člověk." },
    { value: "pod polštářem", why: "Tam ho nikdo nenajde." },
  ], { hints: ["Kam se ve škole dávají informace, které má vidět každý?", "Oznámení musí být na místě, kolem kterého chodí hodně lidí."], explanation: "Oznámení bývá na nástěnce, kde ho uvidí všichni." }),
  choice("Posíláš mamince SMS, že přijdeš později. Co v ní nesmí chybět?", "kdy přijdeš domů", [
    { value: "básnička pro maminku", why: "Básnička maminku neuklidní." },
    { value: "nadpis nad zprávou", why: "SMS nadpis nepotřebuje." },
    { value: "razítko školy", why: "Razítko do SMS nedáš." },
  ], { hints: ["Co bude maminka chtít vědět?", "Krátká zpráva má obsahovat to hlavní — tady čas návratu."], explanation: "Maminka potřebuje vědět, kdy přijdeš." }),
];

type Utvar = "O" | "P" | "N" | "V";
const UTVARY: Record<Utvar, string> = { O: "omluvenka", P: "pozvánka", N: "oznámení", V: "vzkaz" };
const UTVAR_PROC: Record<Utvar, string> = {
  O: "Omluvenka vysvětluje, proč žák chyběl ve škole.",
  P: "Pozvánka zve na akci a říká co, kdy a kde.",
  N: "Oznámení sděluje informaci mnoha lidem najednou.",
  V: "Vzkaz je krátká zpráva pro jednoho blízkého člověka.",
};

function utvar(text: string, u: Utvar, stopa: string): PracticeTask {
  const distraktory = (Object.keys(UTVARY) as Utvar[]).filter((x) => x !== u)
    .map((x) => ({ value: UTVARY[x], why: UTVAR_PROC[x] })) as [Distractor, Distractor, Distractor];
  return choice(`Text: „${text}“ Jaký je to útvar?`, UTVARY[u], distraktory, {
    hints: [
      `Komu je text určený a co po něm chce? Všimni si: ${stopa}.`,
      "Vysvětluje rodič, proč dítě chybělo? Zve někdo na akci? Dozvídá se něco hodně lidí najednou? Nebo jde o pár slov jednomu člověku?",
    ],
    explanation: `${UTVAR_PROC[u]} Proto je to ${UTVARY[u]}.`,
  });
}

const L2: PracticeTask[] = [
  utvar("Vážená paní učitelko, omlouvám svou dceru Evu z vyučování dne 3. 3. z důvodu nemoci. Jana Malá", "O", "rodič vysvětluje, proč Eva nebyla ve škole"),
  utvar("Vážený pane učiteli, prosím o omluvení syna Tomáše, který 12. 4. chyběl kvůli návštěvě lékaře. S pozdravem Petr Novák", "O", "píše tatínek kvůli chybění ve škole"),
  utvar("Paní učitelko, Karel včera nebyl ve škole, protože měl horečku. Marie Veselá", "O", "vysvětlení, proč Karel chyběl"),
  utvar("Milá Terezko, zvu tě na svou oslavu narozenin v sobotu 5. 5. ve 14 hodin u nás doma. Tvoje Anička", "P", "slova „zvu tě“ a čas i místo oslavy"),
  utvar("Srdečně zveme rodiče na vánoční besídku ve čtvrtek 18. 12. v 16 hodin v tělocvičně.", "P", "akce, čas a místo, kam mají rodiče přijít"),
  utvar("Zveme všechny na divadelní představení Budulínek v pátek v 17 hodin ve školní aule.", "P", "představení s časem a místem"),
  utvar("Upozorňujeme žáky, že v pondělí 10. 6. nebude jídelna v provozu.", "N", "informace pro všechny žáky"),
  utvar("Knihovna bude od 1. do 15. 7. zavřená.", "N", "zpráva pro všechny čtenáře knihovny"),
  utvar("Ztratil se černý kocour s bílou tlapkou. Kdo ho viděl, ať se ozve v bytě číslo 5.", "N", "text je určený všem sousedům"),
  utvar("Autobus na školní výlet odjíždí ve středu v 7.30 od školy.", "N", "informace pro všechny, kdo jedou na výlet"),
  utvar("Mami, jsem u Pavly, domů přijdu v pět. Jirka", "V", "pár slov mamince"),
  utvar("Tati, klíče jsou pod rohožkou. Eva", "V", "krátká zpráva tátovi"),
  utvar("Babi, šla jsem na kroužek, oběd si ohřeju sama. Lucka", "V", "pár slov babičce"),
];

const L3: PracticeTask[] = [
  choice("Text: „Milý Petře, zvu tě na oslavu narozenin. Tvůj Filip“ Co v pozvánce chybí?", "kdy a kde oslava bude", [
    { value: "oslovení", why: "Oslovení tam je: Milý Petře." },
    { value: "podpis", why: "Podpis tam je: Tvůj Filip." },
    { value: "nic, pozvánka je úplná", why: "Petr neví, kdy a kam přijít." },
  ], { hints: ["Věděl by Petr, v kolik a kam má přijít?", "Pozvaný potřebuje vědět, na co jde, v kolik hodin, na jakou adresu a od koho pozvání je."], explanation: "Chybí čas a místo oslavy." }),
  choice("Text: „Vážená paní učitelko, omlouvám syna Jakuba z vyučování dne 5. 2., protože byl nemocný. S pozdravem“ Co v omluvence chybí?", "podpis rodiče", [
    { value: "datum", why: "Datum tam je: 5. 2." },
    { value: "důvod", why: "Důvod tam je: byl nemocný." },
    { value: "oslovení", why: "Oslovení tam je: Vážená paní učitelko." },
  ], { hints: ["Kdo omluvenku napsal?", "Za „S pozdravem“ má následovat jméno dospělého, který za omluvu ručí."], explanation: "Chybí podpis rodiče." }),
  choice("Text: „Vážená paní učitelko, omlouvám dceru Kláru, protože měla angínu. S pozdravem Hana Dvořáková“ Co v omluvence chybí?", "kdy Klára chyběla", [
    { value: "oslovení paní učitelky", why: "Oslovení tam je." },
    { value: "podpis rodiče", why: "Podpis tam je: Hana Dvořáková." },
    { value: "důvod chybění", why: "Důvod tam je: angína." },
  ], { hints: ["Ví paní učitelka, který den má Kláře omluvit?", "Projdi údaje omluvenky jeden po druhém: kdo, kdy, proč a podpis."], explanation: "Chybí datum — kdy Klára chyběla." }),
  choice("Text: „Zveme vás na jarmark ve škole v sobotu od 9 hodin.“ Co v pozvánce chybí?", "kdo zve", [
    { value: "kde se akce koná", why: "Místo tam je: ve škole." },
    { value: "kdy se akce koná", why: "Čas tam je: v sobotu od 9." },
    { value: "co se koná", why: "Akce tam je: jarmark." },
  ], { hints: ["Víš, od koho pozvánka je?", "Zkontroluj co, kdy, kde — a pak podpis toho, kdo pozvánku posílá."], explanation: "Chybí, kdo zve — třeba třída 3. A." }),
  choice("Text: „Mami, jsem u kamaráda, přijdu večer.“ Co ve vzkazu chybí?", "podpis", [
    { value: "oslovení", why: "Oslovení tam je: Mami." },
    { value: "datum a razítko", why: "Vzkaz datum ani razítko nepotřebuje." },
    { value: "nic, je úplný", why: "Maminka neví, kdo lístek napsal." },
  ], { hints: ["Poznala by maminka, od koho lístek je, když má víc dětí?", "Krátký lístek má i tak mít jméno toho, kdo ho napsal."], explanation: "Chybí podpis — kdo vzkaz napsal." }),
  choice("Posíláš pozvánku panu řediteli. Jak ho oslovíš?", "Vážený pane řediteli,", [
    { value: "Ahoj řediteli,", why: "Panu řediteli netykáme." },
    { value: "Milý Pepo,", why: "Tak oslovíme kamaráda." },
    { value: "Hej, pane,", why: "To je nezdvořilé." },
  ], { hints: ["Tykáš panu řediteli?", "Dospělému, kterému vykáme, píšeme zdvořilé oslovení i s jeho funkcí."], explanation: "Správně: Vážený pane řediteli," }),
  choice("Jak zakončíš pozvánku pro kamarádku?", "Moc se na tebe těším. Tvoje Anička", [
    { value: "S úctou Ing. Anna Malá", why: "Tak se podepisují dospělí v úředním dopise." },
    { value: "Vážení rodiče,", why: "To je oslovení, ne zakončení." },
    { value: "Omlouvám se za nepřítomnost.", why: "To patří do omluvenky." },
  ], { hints: ["Jak se podepisuješ, když píšeš kamarádce?", "Kamarádce tykáme — zakončení může být srdečné, s křestním jménem."], explanation: "Kamarádce napíšeme srdečné zakončení a křestní jméno." }),
  choice("Škola chce dát vědět všem rodičům, že v pátek se neučí. Co napíše?", "oznámení", [
    { value: "vzkaz", why: "Vzkaz je pro jednoho člověka." },
    { value: "pozvánku", why: "Nikoho na nic nezve." },
    { value: "omluvenku", why: "Omluvenku píšou rodiče." },
  ], { hints: ["Kolik lidí má zprávu dostat?", "Když má informaci dostat hodně lidí najednou, volíme útvar pro všechny."], explanation: "Informace pro všechny rodiče je oznámení." }),
  choice("Chceš dát mamince vědět, že jsi šel ke kamarádovi. Co napíšeš?", "vzkaz", [
    { value: "oznámení", why: "Oznámení je pro mnoho lidí." },
    { value: "pozvánku", why: "Maminku nikam nezveš." },
    { value: "omluvenku", why: "Nechyběl jsi ve škole." },
  ], { hints: ["Kolika lidem píšeš a jak dlouhé to bude?", "Pár slov jednomu blízkému člověku stačí na lístek."], explanation: "Mamince napíšeš krátký vzkaz." }),
  choice("Chceš, aby kamarádi přišli na tvou oslavu. Co napíšeš?", "pozvánku", [
    { value: "omluvenku", why: "Nikoho neomlouváš." },
    { value: "oznámení", why: "Oslava není pro všechny, zveš jen kamarády." },
    { value: "vzkaz", why: "Vzkaz nezve na akci s časem a místem." },
  ], { hints: ["Co chceš, aby kamarádi udělali?", "Když někoho někam zveš, napíšeš mu co, kdy a kde."], explanation: "Na oslavu kamarády pozveš pozvánkou." }),
  choice("Jirka byl nemocný a chyběl ve škole. Co napíšou rodiče?", "omluvenku", [
    { value: "pozvánku", why: "Nikoho nezvou." },
    { value: "oznámení", why: "Neinformují všechny." },
    { value: "vzkaz", why: "Škola potřebuje řádnou omluvu s podpisem." },
  ], { hints: ["Co potřebuje škola, když žák chyběl?", "Rodiče vysvětlí, proč dítě nebylo ve škole, a podepíšou to."], explanation: "Rodiče napíšou omluvenku." }),
  choice("Kde nejspíš najdeš oznámení o školním výletě?", "na nástěnce ve škole", [
    { value: "v soukromé SMS kamarádovi", why: "SMS je pro jednoho." },
    { value: "v deníčku pod polštářem", why: "Tam ho nikdo neuvidí." },
    { value: "na pohlednici od babičky", why: "Pohlednice je soukromá." },
  ], { hints: ["Kde uvidí zprávu všichni žáci?", "Informace pro celou školu musí viset tam, kudy všichni chodí."], explanation: "Oznámení visí na nástěnce ve škole." }),
  choice("Text: „Milá Kláro, zvu tě na oslavu svých 9. narozenin v sobotu 12. 10. v 15 hodin v Lipové ulici 7. Těším se! Tvoje Eva“ Kde se oslava koná?", "v Lipové ulici 7", [
    { value: "ve škole", why: "O škole tam nic není." },
    { value: "v sobotu", why: "To je čas, ne místo." },
    { value: "u Kláry doma", why: "Oslava je u Evy." },
  ], { hints: ["Který údaj v pozvánce odpovídá na otázku kde?", "Rozliš v pozvánce čas (kdy) a adresu (kde)."], explanation: "Místo je v Lipové ulici 7." }),
];

function gen(level: number): PracticeTask[] {
  return shuffle(level === 1 ? L1 : level === 2 ? L2 : L3);
}

export const OMLUVENKAZPRAVA: TopicMetadata[] = [
  {
    id: "g3-cjl-omluvenka-zprava",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-omluvenka-zprava-oznameni-pozvanka",
    title: "Omluvenka, zpráva, oznámení, pozvánka",
    studentTitle: "Omluvenka a pozvánka",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se napsat omluvenku, vzkaz, pozvánku nebo oznámení.",
    keywords: ["omluvenka", "zpráva", "vzkaz", "pozvánka", "oznámení", "oslovení", "podpis"],
    goals: ["Napsat omluvenku se všemi náležitostmi.", "Rozlišit zprávu, oznámení a pozvánku.", "Správně oslovit adresáta."],
    boundaries: ["Základní slohové útvary pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Omluvenka: Vážená paní učitelko, omlouvám Petra Nováka... datum, podpis rodiče.",
      steps: ["Oslovení (Vážená…).", "Obsah (kdo, proč chyběl).", "Datum.", "Podpis."],
      commonMistake: "Omluvenka bez podpisu rodiče je neplatná.",
      example: "V Praze 1. 3. 2026 / Vážená paní učitelko, / omlouvám svého syna Petra z důvodu nemoci dne 28. 2. / S pozdravem Jana Nováková.",
    },
  },
];
