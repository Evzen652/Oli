import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { urceni, type Kategorie, type Polozka } from "../_urceni";
const zac = (s: string) => s.replace(/[„“]/g, "").split(" ").slice(0, 5).join(" ") + "…";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď: L1 co v krátkém sdělení chybí
// (kdo, co, kde, kdy) · L2 totéž v delších sděleních, kde chybějící údaj
// není na první pohled vidět · L3 vybrat úplné sdělení mezi sděleními
// s neurčitým údajem („někdy o víkendu“, „tam, co minule“).

const UDAJE: Kategorie[] = [
  { nazev: "čas (kdy)", znak: "sdělení neříká, kdy se to stane nebo v kolik hodin." },
  { nazev: "místo (kde)", znak: "sdělení neříká, kde se to stane nebo kam přijít." },
  { nazev: "osoba (kdo)", znak: "sdělení neříká, kdo píše nebo na koho se obrátit." },
  { nazev: "událost (co)", znak: "sdělení neříká, o co jde nebo co se má udělat." },
];
const T = "čas (kdy)", M = "místo (kde)", O = "osoba (kdo)", C = "událost (co)";
const S = (uroven: 1 | 2, sdeleni: string, kategorie: string, klic: string): Polozka =>
  ({ uroven, slovo: sdeleni, veta: sdeleni, kategorie, klic, proc: `Ve sdělení ${sdeleni} ${klic}.` });

const BANKA: Polozka[] = [
  S(1, "„Sraz na výlet je před školou. Vezměte si svačinu. Paní učitelka Nová“", T, "víme, kam a kdo zve, ale ne v kolik hodin ani který den"),
  S(1, "„Zítra v 8 hodin je sraz na výlet. Paní učitelka Nová“", M, "nevíme, kam máme přijít"),
  S(1, "„Přijď v sobotu ve 3 hodiny na oslavu do Sokolovny.“", O, "nevíme, kdo zve a čí je oslava"),
  S(1, "„Mami, v pondělí v 7 hodin u školy. Eva“", C, "nevíme, co se v pondělí u školy děje"),
  S(1, "„Tréninky fotbalu budou nově na hřišti za školou. Trenér Petr“", T, "nevíme, v které dny a hodiny se trénuje"),
  S(1, "„Vodník Čepický hraje v neděli v 10 hodin. Vstupné 50 Kč.“", M, "nevíme, kde se hraje"),
  S(1, "„Ztratil se hnědý pes. Kdo ho viděl, ať zavolá.“", O, "nevíme, komu máme zavolat"),
  S(1, "„Tatínku, dnes v 5 odpoledne na zahradě. Tvoje Lucka“", C, "nevíme, co se na zahradě bude dít"),
  S(1, "„Knihovna bude zavřená kvůli malování. Knihovnice Jana“", T, "nevíme, odkdy dokdy bude zavřeno"),
  S(1, "„Dnes v 17 hodin bude sraz turistického oddílu. Vedoucí Tomáš“", M, "nevíme, kde se oddíl schází"),
  S(1, "„Zítra ve 2 hodiny tě čekám u kašny na náměstí.“", O, "nevíme, kdo čeká"),
  S(1, "„Pepo, zítra v 6 ráno před domem. Děda“", C, "nevíme, co se ráno před domem stane"),
  S(1, "„V úterý ve 4 hodiny začíná kroužek vaření. Paní Malá“", M, "nevíme, kde se kroužek koná"),

  S(2, "„Ahoj Kubo, oslava mých narozenin bude u nás na zahradě v Lipové ulici 5. Přines plavky. Tvoje Anna“", T, "je tu adresa i kdo zve, ale ne den a hodina"),
  S(2, "„Milí rodiče, v úterý 12. května v 7.30 odjíždíme na školu v přírodě. Zavazadla podepište. Mgr. Dvořák“", M, "víme kdy, ale ne odkud autobus odjíždí"),
  S(2, "„Našla jsem na lavičce v parku klíče s červeným přívěskem. Majitel si je může vyzvednout zítra v 5 odpoledne.“", O, "nevíme, u koho si je vyzvednout"),
  S(2, "„Vážení sousedé, ve středu od 8 do 12 hodin v celém našem domě. Děkujeme za pochopení. Správa domu“", C, "nevíme, co se bude ve středu v domě dít"),
  S(2, "„Pozor, změna! Autobus na výlet odjede od kostela, ne od školy. Paní učitelka Nová“", T, "víme odkud, ale ne v kolik"),
  S(2, "„Honzo, maminka tě vyzvedne dnes ve 4 hodiny. Počkej na ni tam, co minule. Paní vychovatelka“", M, "„tam, co minule“ není přesné určení"),
  S(2, "„Ahoj! Zítra v 10 hodin jdeme hrát hokej na zamrzlý rybník za vsí. Přijď určitě!“", O, "chybí podpis — nevíme, kdo zve"),
  S(2, "„Pane domovníku, v pátek v 9 hodin ve sklepě. Soused Novotný z 2. patra“", C, "nevíme, o co soused žádá"),
  S(2, "„Soutěž v recitaci proběhne v aule školy. Přihlášky noste paní učitelce Malé.“", T, "nevíme, v který den soutěž bude"),
  S(2, "„Tati, dnes po tréninku jdu ke kamarádovi. Vyzvedni mě tam prosím v 7 večer. Filip“", M, "nevíme, ke kterému kamarádovi a na jakou adresu"),
  S(2, "„Nabízím koťata do dobrých rukou. Jsou zdravá a zvyklá na děti. Volejte večer.“", O, "chybí jméno a telefon — nevíme, komu volat"),
  S(2, "„Milá třído, zítra si všichni vezměte do školy. Paní učitelka“", C, "nevíme, co si máme vzít"),
  S(2, "„Kino Svět uvádí pohádku Tři oříšky. Lístky koupíte na pokladně kina.“", T, "nevíme, kdy se promítá"),
];

// L3: úplné sdělení vs. sdělení s jedním neurčitým údajem.
interface Sdeleni { tema: string; co: string; kde: string; kdy: string; kdo: string; vKde: string; vKdy: string; vKdo: string }
const SDELENI: Sdeleni[] = [
  { tema: "oslava narozenin", co: "Zvu tě na oslavu narozenin", kde: "do Sokolovny v Lipové ulici", kdy: "v sobotu 14. června ve 3 hodiny", kdo: "Tvoje Anna", vKde: "tam, jak jsme se bavili", vKdy: "někdy o víkendu", vKdo: "Těším se na tebe!" },
  { tema: "fotbal s kamarádem", co: "Mami, šel jsem hrát fotbal s Petrem", kde: "na hřiště za školou", kdy: "a vrátím se v 6 hodin", kdo: "Jakub", vKde: "někam ven", vKdy: "a vrátím se později", vKdo: "Ahoj!" },
  { tema: "kroužek keramiky", co: "Kroužek keramiky bude", kde: "v učebně výtvarné výchovy", kdy: "každý čtvrtek od 14 do 15 hodin", kdo: "Paní učitelka Malá", vKde: "ve škole", vKdy: "jednou týdně", vKdo: "Děkujeme." },
  { tema: "vánoční besídka", co: "Zveme rodiče na vánoční besídku", kde: "do tělocvičny naší školy", kdy: "ve středu 18. prosince v 17 hodin", kdo: "Žáci 5. A", vKde: "k nám", vKdy: "před Vánoci", vKdo: "Těšíme se!" },
  { tema: "přesunutý trénink", co: "Tati, trénink se dnes přesouvá", kde: "na umělou trávu u stadionu", kdy: "a začíná v 16.30", kdo: "Filip", vKde: "jinam", vKdy: "a začíná jindy", vKdo: "Ahoj!" },
  { tema: "sběr papíru", co: "Sběr papíru proběhne", kde: "před hlavním vchodem školy", kdy: "v pondělí 3. dubna od 7 do 8 hodin", kdo: "Školní parlament", vKde: "u školy", vKdy: "na jaře", vKdo: "Děkujeme." },
  { tema: "bruslení", co: "Pojď se mnou bruslit", kde: "na zimní stadion v Kolíně", kdy: "v neděli v 10 hodin", kdo: "Tvůj Ondra", vKde: "na led", vKdy: "někdy brzo", vKdo: "Těším se!" },
  { tema: "kontrola u lékařky", co: "Babi, volala paní doktorka, že máš přijít na kontrolu", kde: "do ordinace v Zahradní ulici", kdy: "v úterý v 9 hodin", kdo: "Tvoje Klára", vKde: "k ní", vKdy: "někdy příští týden", vKdo: "Ahoj!" },
  { tema: "zavřená knihovna", co: "Pobočka knihovny", kde: "na Masarykově náměstí", kdy: "bude od 1. do 15. srpna zavřená", kdo: "Knihovnice Jana", vKde: "v centru", vKdy: "bude nějakou dobu zavřená", vKdo: "Děkujeme za pochopení." },
  { tema: "turnaj ve vybíjené", co: "Zveme vás na turnaj ve vybíjené", kde: "do sokolovny v Dolní ulici", kdy: "v sobotu 5. října od 9 hodin", kdo: "Oddíl Sokol Lipová", vKde: "k nám", vKdy: "na podzim", vKdo: "Přijďte!" },
  { tema: "sraz na výlet", co: "Pepo, sraz na výlet je", kde: "na nádraží u pokladen", kdy: "zítra v 7.15", kdo: "Děda", vKde: "na obvyklém místě", vKdy: "zítra ráno", vKdo: "Ahoj!" },
  { tema: "očkování psů", co: "Očkování psů proběhne", kde: "na dvoře obecního úřadu", kdy: "ve středu 10. května od 15 do 17 hodin", kdo: "Obecní úřad Lipová", vKde: "v obci", vKdy: "v květnu", vKdo: "Děkujeme." },
  { tema: "půjčená učebnice", co: "Evo, učebnici ti nechám", kde: "v šatně ve tvé skříňce", kdy: "zítra před první hodinou", kdo: "Lucka", vKde: "ve škole", vKdy: "někdy zítra", vKdo: "Ahoj!" },
];

function uplneUloha(s: Sdeleni): PracticeTask {
  const cele = `${s.co} ${s.kde} ${s.kdy}. ${s.kdo}`;
  return choice(`Které sdělení je úplné? Téma: ${s.tema}.`, cele, [
    { value: `${s.co} ${s.vKde} ${s.kdy}. ${s.kdo}`, why: `Neurčuje přesně, kde: „${s.vKde}“.` },
    { value: `${s.co} ${s.kde} ${s.vKdy}. ${s.kdo}`, why: `Neurčuje přesně, kdy: „${s.vKdy}“.` },
    { value: `${s.co} ${s.kde} ${s.kdy}. ${s.vKdo}`, why: "Chybí podpis — nevíme, kdo sdělení píše." },
  ], {
    hints: [
      `Porovnej sdělení: kde je čas i určení kde přesné a kde jen neurčité, třeba „${s.vKdy}“?`,
      `Neurčitá slova jako „${s.vKde}“ nebo chybějící podpis dělají sdělení neúplným; úplné má přesný čas, přesné určení kde a podpis.`,
    ],
    explanation: `Úplné je: „${cele}“ — víme kdo, co, kde i kdy.`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level >= 3) return shuffle(SDELENI.map(uplneUloha));
  return urceni(BANKA, UDAJE, level, (p) => ({
    question: `Co chybí ve sdělení ${p.veta}?`,
    hints: [
      `Polož si u sdělení „${zac(p.veta)}“ otázky kdo, co, kde a kdy. Na kterou odpověď nenajdeš?`,
      `Pomůže tohle: ${p.klic}. Úplné sdělení odpovídá na všechny čtyři otázky.`,
    ],
  }), ["Projdi sdělení postupně: kdo píše, o co jde, kam přijít a kdy.", "Údaj, který si musíš domýšlet, ve sdělení chybí."]);
}

export const POSUZOVANIUPLNOSTISDELENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-posuzovani-uplnosti-sdeleni",
    title: "Posuzování úplnosti sdělení",
    studentTitle: "Řekl jsem všechno?",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Poznáš, jestli zpráva obsahuje všechny důležité informace.",
    keywords: ["úplnost sdělení", "komunikace", "kdo co kde kdy proč jak", "zpráva", "vzkaz"],
    goals: [
      "Posoudit, zda sdělení obsahuje všechny podstatné informace",
      "Určit, co ve sdělení chybí",
      "Doplnit neúplné sdělení",
    ],
    boundaries: [
      "Bez lingvistické analýzy komunikace",
      "Neprobíráme teorii komunikace podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Úplné sdělení odpovídá na: KDO? CO? KDE? KDY? PROČ? JAK? Přečti sdělení a zkontroluj, zda znáš odpovědi na všechny tyto otázky.",
      steps: [
        "Přečti sdělení.",
        "Zeptej se: Kdo? Co? Kde? Kdy? Proč? Jak?",
        "Pokud na některou otázku nemáš odpověď = sdělení je neúplné.",
        "Urči, co konkrétně chybí.",
      ],
      commonMistake: "Žáci si myslí, že krátká sdělení jsou vždy neúplná. Ale v kontextu může být i kratší sdělení úplné.",
      example: "'Přijdu v 15:00 ke škole.' = kdo (já), co (přijdu), kde (ke škole), kdy (v 15:00). Proč? chybí – ale v kontextu to nemusí vadit.",
    },
  },
];
