import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy se ptaly na izolované tvary
// („2. pád od já“) a jako správnou nabízely dvojici „mě / mne“, takže dítě
// nevybíralo tvar do věty. Teď se tvar doplňuje do věty a možnosti nikdy
// neobsahují dva správné tvary (třeba mi i mně ve 3. pádě):
// L1 já a ty (mě × mně × mnou) · L2 on, ona, my, vy · L3 tvary po předložce
// (k němu, na ni × o ní, s nimi) a krátké × dlouhé tvary.

type Z = { veta: string; zajmeno: string; tvar: string; chyby: [[string, string], [string, string], [string, string]]; napoveda: string; proc: string };

const ULOHY: Record<1 | 2 | 3, Z[]> = {
  1: [
    { veta: "Přijď zítra ke ___.", zajmeno: "já", tvar: "mně", chyby: [["mě", "Mě je 2. nebo 4. pád; po předložce k je 3. pád."], ["mnou", "Mnou je 7. pád (s kým?)."], ["mi", "Krátký tvar mi se po předložce nepoužívá."]], napoveda: "Po předložce k je 3. pád (komu? čemu?). Ve 3. pádě se píše tvar s -ně.", proc: "Ke komu? Ke mně — 3. pád." },
    { veta: "Mluvili jsme o ___.", zajmeno: "já", tvar: "mně", chyby: [["mě", "Mě je 2. nebo 4. pád; po o je 6. pád."], ["mnou", "Mnou je 7. pád."], ["mi", "Mi je krátký 3. pád a po předložce se nepíše."]], napoveda: "Po předložce o je 6. pád (o kom? o čem?); ve 3. a 6. pádě se píše tvar s -ně.", proc: "O kom? O mně — 6. pád." },
    { veta: "Pojď se ___ podívat na hřiště.", zajmeno: "já", tvar: "mnou", chyby: [["mně", "Mně je 3. nebo 6. pád."], ["mě", "Mě je 2. nebo 4. pád."], ["mi", "Mi je 3. pád."]], napoveda: "Zeptej se s kým? — to je 7. pád.", proc: "S kým? Se mnou — 7. pád." },
    { veta: "Bez ___ nikam nechoď.", zajmeno: "já", tvar: "mě", chyby: [["mně", "Mně je 3. nebo 6. pád; po bez je 2. pád."], ["mnou", "Mnou je 7. pád."], ["mi", "Mi je 3. pád."]], napoveda: "Po předložce bez je 2. pád (koho? čeho?). Ve 2. pádě píšeme mě, ne mně.", proc: "Bez koho? Beze mě — 2. pád." },
    { veta: "Vidíš ___ na té fotce?", zajmeno: "já", tvar: "mě", chyby: [["mně", "Mně je 3. nebo 6. pád; tady je 4. pád."], ["mnou", "Mnou je 7. pád."], ["mi", "Mi je 3. pád."]], napoveda: "Zeptej se koho? co? vidíš — to je 4. pád.", proc: "Koho vidíš? Mě — 4. pád." },
    { veta: "Podej ___ prosím sešit.", zajmeno: "já", tvar: "mi", chyby: [["mě", "Mě je 2. nebo 4. pád; tady je 3. pád."], ["mnou", "Mnou je 7. pád."], ["můj", "Můj je přivlastňovací zájmeno, ne tvar zájmena já."]], napoveda: "Zeptej se komu? podej — to je 3. pád.", proc: "Komu? Mi (nebo mně) — 3. pád." },
    { veta: "Půjdu s ___ do kina.", zajmeno: "ty", tvar: "tebou", chyby: [["tobě", "Tobě je 3. nebo 6. pád."], ["tebe", "Tebe je 2. nebo 4. pád."], ["ti", "Ti je 3. pád."]], napoveda: "Zeptej se s kým? — to je 7. pád.", proc: "S kým? S tebou — 7. pád." },
    { veta: "Myslím na ___.", zajmeno: "ty", tvar: "tebe", chyby: [["tě", "Krátký tvar tě se po předložce nepoužívá."], ["tobě", "Tobě je 3. nebo 6. pád; po na je tu 4. pád."], ["tebou", "Tebou je 7. pád."]], napoveda: "Na koho myslíš? To je 4. pád; po předložce se píše dlouhý tvar.", proc: "Na koho? Na tebe — 4. pád, po předložce dlouhý tvar." },
    { veta: "Přinesu ___ knihu.", zajmeno: "ty", tvar: "ti", chyby: [["tě", "Tě je 2. nebo 4. pád; tady je 3. pád."], ["tebou", "Tebou je 7. pád."], ["tvou", "Tvou je tvar přivlastňovacího zájmena tvůj."]], napoveda: "Zeptej se komu? přinesu — to je 3. pád.", proc: "Komu? Ti (nebo tobě) — 3. pád." },
    { veta: "Často o ___ mluvíme.", zajmeno: "ty", tvar: "tobě", chyby: [["tebe", "Tebe je 2. nebo 4. pád; po o je 6. pád."], ["tebou", "Tebou je 7. pád."], ["ti", "Krátký tvar ti se po předložce nepoužívá."]], napoveda: "O kom mluvíme? To je 6. pád.", proc: "O kom? O tobě — 6. pád." },
    { veta: "Bez ___ to nepůjde.", zajmeno: "ty", tvar: "tebe", chyby: [["tobě", "Tobě je 3. nebo 6. pád; po bez je 2. pád."], ["tebou", "Tebou je 7. pád."], ["ti", "Ti je 3. pád."]], napoveda: "Po předložce bez je 2. pád (koho? čeho?); po předložce dlouhý tvar.", proc: "Bez koho? Bez tebe — 2. pád." },
    { veta: "Stojí to před ___.", zajmeno: "já", tvar: "mnou", chyby: [["mně", "Mně je 3. nebo 6. pád; po před je tu 7. pád."], ["mě", "Mě je 2. nebo 4. pád."], ["mi", "Mi je 3. pád."]], napoveda: "Před kým? — to je 7. pád.", proc: "Před kým? Přede mnou — 7. pád." },
    { veta: "Kvůli ___ přišel pozdě.", zajmeno: "ty", tvar: "tobě", chyby: [["tebe", "Tebe je 2. nebo 4. pád; po kvůli je 3. pád."], ["tebou", "Tebou je 7. pád."], ["ti", "Po předložce se krátký tvar nepíše."]], napoveda: "Po předložce kvůli je 3. pád (kvůli komu?).", proc: "Kvůli komu? Kvůli tobě — 3. pád." },
  ],
  2: [
    { veta: "Dal jsem ___ dárek.", zajmeno: "ona", tvar: "jí", chyby: [["ji", "Ji je 4. pád (koho? co?)."], ["ní", "Ní se píše po předložce."], ["její", "Její je přivlastňovací zájmeno."]], napoveda: "Komu jsem dal dárek? To je 3. pád; bez předložky začíná tvar na j-.", proc: "Komu? Jí — 3. pád." },
    { veta: "Včera jsem ___ viděl v parku.", zajmeno: "ona", tvar: "ji", chyby: [["jí", "Jí je 3. nebo 7. pád."], ["ní", "Ní se píše po předložce."], ["její", "Její je přivlastňovací zájmeno."]], napoveda: "Koho jsem viděl? To je 4. pád; bez předložky začíná tvar na j-.", proc: "Koho? Ji — 4. pád." },
    { veta: "Potkal jsem ___ před školou.", zajmeno: "on", tvar: "ho", chyby: [["mu", "Mu je 3. pád (komu?)."], ["něho", "Tvar s n- se píše po předložce."], ["ním", "Ním je 7. pád po předložce."]], napoveda: "Koho jsem potkal? To je 4. pád; bez předložky se píše tvar bez n-.", proc: "Koho? Ho (jeho) — 4. pád." },
    { veta: "Poděkoval jsem ___ za pomoc.", zajmeno: "on", tvar: "mu", chyby: [["ho", "Ho je 2. nebo 4. pád."], ["němu", "Tvar s n- se píše po předložce."], ["jím", "Jím je 7. pád."]], napoveda: "Komu jsem poděkoval? To je 3. pád.", proc: "Komu? Mu (jemu) — 3. pád." },
    { veta: "Přijďte zítra k ___.", zajmeno: "my", tvar: "nám", chyby: [["nás", "Nás je 2., 4. nebo 6. pád."], ["námi", "Námi je 7. pád."], ["náš", "Náš je přivlastňovací zájmeno."]], napoveda: "Ke komu? To je 3. pád.", proc: "Ke komu? K nám — 3. pád." },
    { veta: "Pojďte s ___ na výlet.", zajmeno: "my", tvar: "námi", chyby: [["nám", "Nám je 3. pád."], ["nás", "Nás je 2., 4. nebo 6. pád."], ["náma", "Náma je nespisovný tvar; spisovně námi."]], napoveda: "S kým? To je 7. pád.", proc: "S kým? S námi — 7. pád." },
    { veta: "Dlouho jsme na ___ čekali.", zajmeno: "vy", tvar: "vás", chyby: [["vám", "Vám je 3. pád."], ["vámi", "Vámi je 7. pád."], ["váš", "Váš je přivlastňovací zájmeno."]], napoveda: "Na koho jsme čekali? To je 4. pád.", proc: "Na koho? Na vás — 4. pád." },
    { veta: "Přineseme ___ dort.", zajmeno: "vy", tvar: "vám", chyby: [["vás", "Vás je 2., 4. nebo 6. pád."], ["vámi", "Vámi je 7. pád."], ["váš", "Váš je přivlastňovací zájmeno."]], napoveda: "Komu přineseme dort? To je 3. pád.", proc: "Komu? Vám — 3. pád." },
    { veta: "Pozdravil jsem ___ na chodbě.", zajmeno: "oni", tvar: "je", chyby: [["jich", "Jich je 2. pád."], ["jim", "Jim je 3. pád."], ["ně", "Tvar ně se píše po předložce."]], napoveda: "Koho jsem pozdravil? To je 4. pád; bez předložky tvar na j-.", proc: "Koho? Je — 4. pád." },
    { veta: "Zavolám ___ večer.", zajmeno: "oni", tvar: "jim", chyby: [["je", "Je je 4. pád."], ["jich", "Jich je 2. pád."], ["nim", "Tvar s n- se píše po předložce."]], napoveda: "Komu zavolám? To je 3. pád.", proc: "Komu? Jim — 3. pád." },
    { veta: "Kolik ___ tam bylo?", zajmeno: "oni", tvar: "jich", chyby: [["je", "Je je 4. pád."], ["jim", "Jim je 3. pád."], ["nich", "Tvar s n- se píše po předložce."]], napoveda: "Po slově kolik je 2. pád (koho? čeho?).", proc: "Kolik (koho)? Jich — 2. pád." },
    { veta: "Obdivuji ___ za odvahu.", zajmeno: "ona", tvar: "ji", chyby: [["jí", "Jí je 3. nebo 7. pád."], ["ni", "Tvar ni se píše po předložce."], ["její", "Její je přivlastňovací zájmeno."]], napoveda: "Koho obdivuji? To je 4. pád, bez předložky.", proc: "Koho? Ji — 4. pád." },
    { veta: "Pomůžeme ___ s úkolem.", zajmeno: "on", tvar: "mu", chyby: [["ho", "Ho je 2. nebo 4. pád."], ["něm", "Něm je 6. pád po předložce."], ["jím", "Jím je 7. pád."]], napoveda: "Komu pomůžeme? To je 3. pád.", proc: "Komu? Mu (jemu) — 3. pád." },
  ],
  3: [
    { veta: "Šli jsme k ___ na návštěvu.", zajmeno: "on", tvar: "němu", chyby: [["jemu", "Po předložce se píše tvar s n-."], ["mu", "Krátký tvar mu se po předložce nepoužívá."], ["něho", "Něho je 2. nebo 4. pád; po k je 3. pád."]], napoveda: "Po předložce k je 3. pád a zájmeno on má po předložce tvar s n-.", proc: "Ke komu? K němu — 3. pád, po předložce s n-." },
    { veta: "Mluvili jsme o ___ celý večer.", zajmeno: "on", tvar: "něm", chyby: [["něho", "Něho je 2. nebo 4. pád; po o je 6. pád."], ["ním", "Ním je 7. pád."], ["jeho", "Po předložce se píše tvar s n-."]], napoveda: "O kom jsme mluvili? To je 6. pád, po předložce tvar s n-.", proc: "O kom? O něm — 6. pád." },
    { veta: "Hrál jsem si s ___ celé odpoledne.", zajmeno: "on", tvar: "ním", chyby: [["jím", "Po předložce se píše tvar s n-."], ["něm", "Něm je 6. pád."], ["němu", "Němu je 3. pád."]], napoveda: "S kým? To je 7. pád; po předložce tvar s n-.", proc: "S kým? S ním — 7. pád." },
    { veta: "Čekal jsem na ___ před kinem.", zajmeno: "ona", tvar: "ni", chyby: [["ní", "Ní je 2., 3., 6. nebo 7. pád; po na je tu 4. pád."], ["ji", "Po předložce se píše tvar s n-."], ["jí", "Jí je 3. nebo 7. pád bez předložky."]], napoveda: "Na koho jsem čekal? To je 4. pád — po předložce s krátkým i: n-i.", proc: "Na koho? Na ni — 4. pád (krátké i)." },
    { veta: "Často na ___ vzpomínám.", zajmeno: "ona", tvar: "ni", chyby: [["ní", "Ní je 6. pád (o ní); na koho? je 4. pád."], ["ji", "Po předložce se píše tvar s n-."], ["jí", "Jí je 3. nebo 7. pád."]], napoveda: "Na koho vzpomínám? 4. pád — po předložce n- a krátké i.", proc: "Na koho? Na ni — 4. pád." },
    { veta: "Mluvili jsme o ___ jen hezky.", zajmeno: "ona", tvar: "ní", chyby: [["ni", "Ni je 4. pád (na ni); o kom? je 6. pád."], ["jí", "Po předložce se píše tvar s n-."], ["ji", "Ji je 4. pád bez předložky."]], napoveda: "O kom? 6. pád — po předložce n- a dlouhé í.", proc: "O kom? O ní — 6. pád (dlouhé í)." },
    { veta: "Sedla jsem si vedle ___.", zajmeno: "ona", tvar: "ní", chyby: [["ni", "Ni je 4. pád; po vedle je 2. pád."], ["jí", "Po předložce se píše tvar s n-."], ["ji", "Ji je 4. pád bez předložky."]], napoveda: "Vedle koho? 2. pád — po předložce n- a dlouhé í.", proc: "Vedle koho? Vedle ní — 2. pád." },
    { veta: "Šli jsme k ___ na oslavu.", zajmeno: "oni", tvar: "nim", chyby: [["jim", "Po předložce se píše tvar s n-."], ["nich", "Nich je 2. nebo 6. pád."], ["nimi", "Nimi je 7. pád."]], napoveda: "Ke komu? 3. pád; po předložce tvar s n-.", proc: "Ke komu? K nim — 3. pád." },
    { veta: "Mluvili o ___ učitelé.", zajmeno: "oni", tvar: "nich", chyby: [["jich", "Po předložce se píše tvar s n-."], ["nim", "Nim je 3. pád."], ["nimi", "Nimi je 7. pád."]], napoveda: "O kom? 6. pád; po předložce tvar s n-.", proc: "O kom? O nich — 6. pád." },
    { veta: "Na výlet jsme jeli s ___.", zajmeno: "oni", tvar: "nimi", chyby: [["jimi", "Po předložce se píše tvar s n-."], ["nim", "Nim je 3. pád."], ["nich", "Nich je 2. nebo 6. pád."]], napoveda: "S kým? 7. pád; po předložce tvar s n-.", proc: "S kým? S nimi — 7. pád." },
    { veta: "Ten dopis je pro ___.", zajmeno: "on", tvar: "něj", chyby: [["jeho", "Po předložce se píše tvar s n-."], ["němu", "Němu je 3. pád; po pro je 4. pád."], ["ním", "Ním je 7. pád."]], napoveda: "Pro koho? 4. pád; po předložce tvar s n-.", proc: "Pro koho? Pro něj (pro něho) — 4. pád." },
    { veta: "Dívali jsme se na ___ s obdivem.", zajmeno: "oni", tvar: "ně", chyby: [["je", "Po předložce se píše tvar s n-."], ["nich", "Nich je 2. nebo 6. pád; na koho? je 4. pád."], ["nim", "Nim je 3. pád."]], napoveda: "Na koho jsme se dívali? 4. pád; po předložce tvar s n-.", proc: "Na koho? Na ně — 4. pád." },
    { veta: "Dostal jsem od ___ dopis.", zajmeno: "ona", tvar: "ní", chyby: [["ni", "Ni je 4. pád; po od je 2. pád."], ["jí", "Po předložce se píše tvar s n-."], ["její", "Její je přivlastňovací zájmeno."]], napoveda: "Od koho? 2. pád — po předložce n- a dlouhé í.", proc: "Od koho? Od ní — 2. pád." },
  ],
};

function uloha(z: Z): PracticeTask {
  return choice(`Doplň správný tvar zájmena „${z.zajmeno}“: „${z.veta}“`, z.tvar,
    z.chyby.map(([value, why]) => ({ value, why })) as never, {
      hints: [`Jakou pádovou otázku položíš na vynechané slovo ve větě „${z.veta}“?`, z.napoveda],
      explanation: z.proc,
    });
}

function gen(level: number): PracticeTask[] {
  return shuffle(ULOHY[(level >= 3 ? 3 : level) as 1 | 2 | 3].map(uloha));
}

export const ZAJMENASKLONOVANIOSOBNICHZAJMEN: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-zajmena-sklonovani-osobnich-zajmen",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-zajmena-sklonovani-osobnich-zajmen",
    title: "Zájmena – skloňování osobních zájmen",
    studentTitle: "Skloňování zájmen",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Naučíš se správně skloňovat osobní zájmena.",
    keywords: ["zájmena", "osobní zájmena", "skloňování", "já ty on ona my vy oni", "pády"],
    goals: [
      "Správně skloňovat osobní zájmena v různých pádech",
      "Rozlišit krátké a dlouhé tvary zájmen",
      "Použít správný tvar po předložkách",
    ],
    boundaries: [
      "Neprobíráme všechna zájmena podrobně (jen osobní)",
      "Bez složité syntaktické analýzy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osobní zájmena: já, ty, on, ona, ono, my, vy, oni. Po předložkách vždy delší tvar (ke mně, pro tebe, o něm). Krátké tvary (mi, mě, ti, ho) jsou v nepřízvučné pozici.",
      steps: [
        "Zjisti pád (otázkou: kdo? koho? komu? koho? o kom? kým?).",
        "Vyber správný tvar pro daný pád.",
        "Po předložkách vždy delší tvar (mě/mne, tobě, jemu, ní...).",
        "Krátký tvar (mi, mě, ti, mu...) v nepřízvučné pozici.",
      ],
      commonMistake: "Žáci zaměňují 'mi' (3. pád) a 'mě' (2. nebo 4. pád). Po předložkách nelze použít 'mi'.",
      example: "Řekl mi. (3. pád, nepřízvučně). Ke mně přišel. (3. pád, po předložce = mně).",
    },
  },
];
