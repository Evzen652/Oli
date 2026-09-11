import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď: L1 poznat druh textu v zřetelné
// ukázce (objektivní × subjektivní popis × pracovní postup × vyprávění)
// · L2 totéž v méně nápadných ukázkách · L3 přepsat subjektivní větu objektivně.

const DRUHY: Kategorie[] = [
  { nazev: "objektivní popis", znak: "věcně uvádí, jak věc vypadá (barva, tvar, velikost), bez pocitů a hodnocení." },
  { nazev: "subjektivní popis", znak: "přidává pocity, hodnocení a přirovnání pisatele." },
  { nazev: "pracovní postup", znak: "radí krok za krokem, jak něco udělat." },
  { nazev: "vyprávění", znak: "líčí, co se stalo, jednu událost za druhou." },
];
const O = "objektivní popis", S = "subjektivní popis", P = "pracovní postup", V = "vyprávění";
const U = (uroven: 1 | 2, ukazka: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo: ukazka, veta: ukazka, kategorie, klic, proc });

const BANKA: Polozka[] = [
  U(1, "„Stůl je dřevěný, hnědý a má čtyři nohy.“", O, "uvádí jen materiál, barvu a počet nohou", "Jen fakta, žádné pocity — objektivní popis."),
  U(1, "„Náš stůl je nejkrásnější kus nábytku, jaký znám.“", S, "pisatel stůl hodnotí a říká, co si myslí", "Hodnocení „nejkrásnější“ — subjektivní popis."),
  U(1, "„Nejdřív namoč štětec, potom nanes barvu a nech ji uschnout.“", P, "radí, co udělat a v jakém pořadí", "Kroky za sebou v rozkazovacím způsobu — pracovní postup."),
  U(1, "„Včera jsme šli do lesa a našli jsme veverku.“", V, "líčí, co se včera stalo", "Událost v minulosti — vyprávění."),
  U(1, "„Hrnek je bílý, kulatý a má ucho na pravé straně.“", O, "jsou tu jen barva, tvar a umístění ucha", "Jen fakta — objektivní popis."),
  U(1, "„Můj hrnek je tak roztomilý, že se na něj pořád usmívám.“", S, "pisatel říká, jak se u hrnku cítí", "Pocit pisatele — subjektivní popis."),
  U(1, "„Zalij čaj vroucí vodou a po pěti minutách vyndej sáček.“", P, "radí, co udělat, krok po kroku", "Pokyny v pořadí — pracovní postup."),
  U(1, "„Když jsem přišel domů, pes na mě hned skočil.“", V, "líčí příhodu, která se stala", "Příhoda — vyprávění."),
  U(1, "„Batoh má dvě kapsy, zip a modré popruhy.“", O, "vyjmenovává části a barvu, nic nehodnotí", "Jen fakta — objektivní popis."),
  U(1, "„Babiččina zahrada voní jako ráj a vždycky mě uklidní.“", S, "je tu přirovnání a pocit pisatele", "Přirovnání a pocit — subjektivní popis."),
  U(1, "„Vezmi papír, přelož ho napůl a rohy ohni ke středu.“", P, "radí, jak papír skládat", "Pokyny v pořadí — pracovní postup."),
  U(1, "„Ráno jsme zaspali, a tak jsme utíkali na vlak.“", V, "líčí, co se ráno stalo", "Události za sebou — vyprávění."),
  U(1, "„Míč je kulatý, červený a má průměr asi dvacet centimetrů.“", O, "uvádí tvar, barvu a rozměr", "Jen fakta — objektivní popis."),

  U(2, "„Starý kabát je trochu obnošený, ale hřeje jako babiččina náruč.“", S, "přirovnání k babiččině náruči prozrazuje pocit pisatele", "Přirovnání a pocit — subjektivní popis."),
  U(2, "„Kabát je dlouhý po kolena, šedý a má šest knoflíků.“", O, "jsou tu jen údaje, které by zjistil každý", "Ověřitelná fakta — objektivní popis."),
  U(2, "„Těsto rozválej na plech, posyp ho sýrem a peč dvacet minut.“", P, "jsou to pokyny, jak upéct jídlo", "Recept — pracovní postup."),
  U(2, "„Kočka vyskočila na stůl, převrhla vázu a utekla.“", V, "události jdou za sebou — skočila, převrhla, utekla", "Děj za sebou — vyprávění."),
  U(2, "„Ta obrovská, strašidelná skříň v rohu mi nahání strach.“", S, "slova strašidelná a strach vyjadřují pocit", "Pocit strachu — subjektivní popis."),
  U(2, "„Skříň je vysoká dva metry, bílá a má dvoje dveře.“", O, "rozměr, barva a počet dveří se dají ověřit", "Fakta — objektivní popis."),
  U(2, "„Kolo obrať, sundej řetěz a namaž ho olejem.“", P, "radí, jak kolo ošetřit", "Pokyny v pořadí — pracovní postup."),
  U(2, "„Na výletě jsme zabloudili, ale nakonec nás vyvedla turistická značka.“", V, "líčí, co se na výletě stalo", "Příhoda — vyprávění."),
  U(2, "„Moje sestra má ty nejveselejší oči na světě.“", S, "„nejveselejší na světě“ je hodnocení pisatele", "Hodnocení — subjektivní popis."),
  U(2, "„Moje sestra má hnědé oči, krátké vlasy a měří 140 centimetrů.“", O, "barva očí, délka vlasů a výška se dají ověřit", "Fakta — objektivní popis."),
  U(2, "„Semínka zasej do hlíny, zakryj je a každý den je zalévej.“", P, "radí, jak zasít semínka", "Pokyny — pracovní postup."),
  U(2, "„O prázdninách jsem se naučila plavat a pak jsem přeplavala celý rybník.“", V, "líčí, co se o prázdninách stalo", "Události za sebou — vyprávění."),
  U(2, "„Náš pes je chlupatý uličník, kterého prostě musíte milovat.“", S, "„uličník, kterého musíte milovat“ je hodnocení", "Hodnocení a pocit — subjektivní popis."),
];

// L3: přepis subjektivní věty na objektivní. Distraktory: pořád hodnotí,
// mění fakta, nebo místo popisu radí.
interface Prepis { veta: string; objektivne: string; hodnoti: string; slova: string; jinaFakta: string; rada: string }
const PREPISY: Prepis[] = [
  { veta: "Ten úžasný červený batoh je nejlepší dárek, jaký jsem dostal.", objektivne: "Batoh je červený.", hodnoti: "Batoh je úžasně červený.", slova: "„úžasný“ a „nejlepší dárek“", jinaFakta: "Batoh je modrý.", rada: "Kup si červený batoh." },
  { veta: "Ta strašně vysoká a hrozivá věž se tyčí nad městem.", objektivne: "Vysoká věž stojí nad městem.", hodnoti: "Hrozivá věž se tyčí nad městem.", slova: "„strašně“ a „hrozivá“", jinaFakta: "Nízká věž stojí za městem.", rada: "Vylez na věž nad městem." },
  { veta: "Náš roztomilý mourovatý kocour má krásně huňatý ocas.", objektivne: "Kocour je mourovatý a má huňatý ocas.", hodnoti: "Kocour je roztomilý a má krásný ocas.", slova: "„roztomilý“ a „krásně“", jinaFakta: "Kocour je černý a má krátký ocas.", rada: "Pohlaď mourovatého kocoura po ocase." },
  { veta: "Ta nádherná kulatá dýně svítí jako malé sluníčko.", objektivne: "Dýně je kulatá.", hodnoti: "Dýně je nádherně kulatá.", slova: "„nádherná“ a přirovnání „jako malé sluníčko“", jinaFakta: "Dýně je hranatá.", rada: "Vydlabej kulatou dýni." },
  { veta: "Babiččin starý hrnek je nejmilejší věc v celé kuchyni.", objektivne: "Babiččin hrnek je starý.", hodnoti: "Babiččin hrnek je nejmilejší.", slova: "„nejmilejší věc“", jinaFakta: "Babiččin hrnek je nový.", rada: "Umyj babiččin starý hrnek." },
  { veta: "Ta příšerně těžká taška mi málem utrhla ruce.", objektivne: "Taška je těžká.", hodnoti: "Taška je příšerně těžká.", slova: "„příšerně“ a „málem utrhla ruce“", jinaFakta: "Taška je lehká.", rada: "Zvedni tu těžkou tašku." },
  { veta: "Nádherná bílá chaloupka se krčí pod kopcem jako vystrašené kotě.", objektivne: "Bílá chaloupka stojí pod kopcem.", hodnoti: "Chaloupka se krčí jako kotě.", slova: "„nádherná“ a přirovnání „jako vystrašené kotě“", jinaFakta: "Žlutá chaloupka stojí na kopci.", rada: "Namaluj bílou chaloupku." },
  { veta: "Moje úžasné nové kolo je rychlé jako blesk.", objektivne: "Kolo je nové a rychlé.", hodnoti: "Kolo je rychlé jako blesk.", slova: "„úžasné“ a přirovnání „jako blesk“", jinaFakta: "Kolo je staré a pomalé.", rada: "Jezdi na novém kole." },
  { veta: "Ten krásný dlouhý šál hřeje jako maminčino objetí.", objektivne: "Šál je dlouhý a teplý.", hodnoti: "Šál hřeje jako objetí.", slova: "„krásný“ a přirovnání „jako maminčino objetí“", jinaFakta: "Šál je krátký a tenký.", rada: "Uvaž si dlouhý šál." },
  { veta: "Obrovský starý dub u cesty je nejkouzelnější strom na světě.", objektivne: "U cesty roste velký starý dub.", hodnoti: "U cesty roste kouzelný dub.", slova: "„nejkouzelnější na světě“", jinaFakta: "U cesty roste malá mladá bříza.", rada: "Zasaď u cesty dub." },
  { veta: "Ten hnusný šedý sešit mi nikdy nepřinesl radost.", objektivne: "Sešit je šedý.", hodnoti: "Sešit je hnusně šedý.", slova: "„hnusný“ a „nepřinesl radost“", jinaFakta: "Sešit je zelený.", rada: "Obal si šedý sešit." },
  { veta: "Pohádková zahrada plná barevných tulipánů mi zvedne náladu.", objektivne: "Na zahradě rostou barevné tulipány.", hodnoti: "Zahrada je pohádková a zvedne náladu.", slova: "„pohádková“ a „zvedne náladu“", jinaFakta: "Na zahradě rostou jen bílé růže.", rada: "Zasaď na zahradu tulipány." },
  { veta: "Moje milovaná plyšová žirafa je měkoučká jako obláček.", objektivne: "Plyšová žirafa je měkká.", hodnoti: "Žirafa je milovaná a měkoučká.", slova: "„milovaná“ a přirovnání „jako obláček“", jinaFakta: "Plyšová žirafa je tvrdá.", rada: "Obejmi plyšovou žirafu." },
];

function prepisUloha(p: Prepis): PracticeTask {
  return choice(`Jak popsat objektivně, bez pocitů, větu „${p.veta}“?`, p.objektivne, [
    { value: p.hodnoti, why: "Pořád obsahuje hodnocení nebo přirovnání pisatele." },
    { value: p.jinaFakta, why: "Mění fakta — objektivní popis musí říkat totéž, jen bez pocitů." },
    { value: p.rada, why: "To je pokyn, co udělat, ne popis." },
  ], {
    hints: [
      `Slova ${p.slova} vyjadřují pocit nebo hodnocení. Co zbude, když je vynecháš?`,
      "Objektivní popis uvádí jen to, co by viděl nebo změřil každý: barvu, tvar, velikost, materiál. Fakta přitom musí zůstat stejná.",
    ],
    explanation: `Objektivně: „${p.objektivne}“ Vynechali jsme ${p.slova}; fakta zůstala stejná.`,
  });
}

function gen(level: number): PracticeTask[] {
  if (level >= 3) return shuffle(PREPISY.map(prepisUloha));
  return urceni(BANKA, DRUHY, level, (p) => ({
    question: `Co je to za text? ${p.veta}`,
    hints: [
      `Říká ukázka ${p.veta}, jak věc vypadá, radí, co dělat, nebo líčí, co se stalo? A jsou v ní pocity?`,
      `Pomůže tohle: ukázka ${p.klic}. Porovnej ji se znaky každé možnosti.`,
    ],
  }), ["Hodnoticí slova a přirovnání prozradí pocity pisatele.", "Pokyny poznáš podle rozkazovacího způsobu, příhodu podle sloves v minulém čase."]);
}

export const POPISSUBJEKTIVNEZABARVENYPOPISPRACOVNIHOPOSTUPU: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-slohova-vychova-popis-subjektivne-zabarveny-popis-pracovniho-postupu",
    title: "Popis – subjektivně zabarvený, popis pracovního postupu",
    studentTitle: "Druhy popisu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se rozdíl mezi objektivním a subjektivním popisem.",
    keywords: ["popis", "objektivní", "subjektivní", "pracovní postup", "recept", "návod"],
    goals: [
      "Rozlišit objektivní a subjektivně zabarvený popis",
      "Poznat pracovní postup a jeho znaky",
      "Přepsat text z jednoho stylu do druhého",
    ],
    boundaries: [
      "Bez hluboké stylistiky a rétoriky",
      "Úroveň 3: přepis subjektivní věty na objektivní; bez metafory a dalších figur",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Objektivní = jen fakta (barva, tvar, velikost). Subjektivní = pocity, hodnocení, přirovnání. Pracovní postup = kroky v pořadí s rozkazovacím způsobem.",
      steps: [
        "Přečti text a hledej hodnotící slova (skvělý, kouzelný) = subjektivní.",
        "Jsou tam jen fakta a čísla? = objektivní.",
        "Jsou tam kroky v pořadí s rozkazy (přidej, smíchej)? = pracovní postup.",
      ],
      commonMistake: "Žáci si pletou subjektivní hodnocení s objektivními fakty. Hodnotící přídavná jména (krásný, ošklivý) jsou vždy subjektivní.",
      example: "Objektivní: Jablko je kulaté, červené. Subjektivní: Jablko voní jako léto. Postup: Oloupeš jablko, nakrájíš ho...",
    },
  },
];
