import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a přídavná jména se určovala bez věty. Teď se určují ve větě:
// L1 základní tvary · L2 skloňované tvary · L3 zrádné případy — psí, ptačí,
// boží jsou měkká (ne přivlastňovací), otcovský a mateřský tvrdá, její zájmeno.

const DRUHY: Kategorie[] = [
  { nazev: "tvrdé přídavné jméno (vzor mladý)", znak: "končí v 1. pádě na -ý (mladý, velký) a skloňuje se jako mladý." },
  { nazev: "měkké přídavné jméno (vzor jarní)", znak: "končí v 1. pádě na -í (jarní, cizí, psí) a má ve všech rodech stejný tvar." },
  { nazev: "přivlastňovací přídavné jméno (vzory otcův, matčin)", znak: "říká, komu něco patří, a končí na -ův nebo -in (otcův, matčin)." },
  { nazev: "přivlastňovací zájmeno (můj, tvůj, její)", znak: "zastupuje majitele, ale samo jeho jméno neobsahuje (můj, tvůj, jeho, její)." },
];

const TVR = DRUHY[0].nazev, MEK = DRUHY[1].nazev, PRIV = DRUHY[2].nazev, ZAJ = DRUHY[3].nazev;
const P = (uroven: 1 | 2 | 3, slovo: string, veta: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo, veta, kategorie, klic, proc });

const BANKA: Polozka[] = [
  P(1, "mladý", "Na lavičce sedí mladý muž.", TVR, "končí na -ý", "Mladý končí na -ý — tvrdé přídavné jméno, vzor mladý."),
  P(1, "velký", "Na zahradě roste velký strom.", TVR, "končí na -ý", "Velký — tvrdé přídavné jméno podle vzoru mladý."),
  P(1, "zelený", "Máme zelený plot.", TVR, "končí na -ý", "Zelený — tvrdé přídavné jméno podle vzoru mladý."),
  P(1, "jarní", "Přišel teplý jarní den.", MEK, "končí na -í a nemění se podle rodu (jarní den, jarní noc)", "Jarní — měkké přídavné jméno, vzor jarní."),
  P(1, "cizí", "Na chodbě stál cizí pán.", MEK, "končí na -í (cizí pán, cizí paní)", "Cizí — měkké přídavné jméno podle vzoru jarní."),
  P(1, "letní", "Užívali jsme si letní večer.", MEK, "končí na -í", "Letní — měkké přídavné jméno podle vzoru jarní."),
  P(1, "otcův", "Na věšáku visí otcův klobouk.", PRIV, "říká, komu klobouk patří, a končí na -ův", "Otcův — přivlastňovací přídavné jméno podle vzoru otcův."),
  P(1, "matčina", "Na stole leží matčina kabelka.", PRIV, "říká, komu patří kabelka, a vzniklo ze slova matka", "Matčina — přivlastňovací přídavné jméno podle vzoru matčin."),
  P(1, "Petrův", "Petrův batoh je modrý.", PRIV, "říká, komu patří batoh, a vzniklo ze jména Petr", "Petrův — přivlastňovací přídavné jméno podle vzoru otcův."),
  P(1, "můj", "To je můj pes.", ZAJ, "zastupuje majitele, ale jeho jméno neobsahuje", "Můj je přivlastňovací zájmeno — neobsahuje jméno majitele."),
  P(1, "sestřin", "Sestřin pokoj je vedle mého.", PRIV, "říká, komu pokoj patří, a vzniklo ze slova sestra", "Sestřin — přivlastňovací přídavné jméno podle vzoru matčin."),
  P(1, "zimní", "Na horách byl krásný zimní den.", MEK, "končí na -í", "Zimní — měkké přídavné jméno podle vzoru jarní."),
  P(1, "dobrý", "Byl to dobrý nápad.", TVR, "končí na -ý", "Dobrý — tvrdé přídavné jméno podle vzoru mladý."),

  P(2, "mladého", "Potkal jsem mladého psa.", TVR, "v 1. pádě by znělo „mladý“", "Mladého je 4. pád od mladý — tvrdé přídavné jméno."),
  P(2, "jarním", "V jarním lese kvetou sasanky.", MEK, "v 1. pádě by znělo „jarní“", "Jarním je 6. pád od jarní — měkké přídavné jméno."),
  P(2, "otcovy", "Otcovy boty jsou velké.", PRIV, "vzniklo ze slova otec a říká, komu boty patří", "Otcovy — přivlastňovací přídavné jméno (vzor otcův) v množném čísle."),
  P(2, "matčiny", "Našel jsem matčiny brýle.", PRIV, "vzniklo ze slova matka a říká, čí jsou brýle", "Matčiny — přivlastňovací přídavné jméno (vzor matčin)."),
  P(2, "cizími", "Nemluv s cizími lidmi.", MEK, "v 1. pádě by znělo „cizí“", "Cizími je 7. pád od cizí — měkké přídavné jméno."),
  P(2, "Karlův", "Karlův most je nejstarší pražský most.", PRIV, "vzniklo ze jména Karel a říká, čí most je", "Karlův — přivlastňovací přídavné jméno podle vzoru otcův."),
  P(2, "babiččin", "Babiččin dort nejlépe voní.", PRIV, "vzniklo ze slova babička a říká, čí je dort", "Babiččin — přivlastňovací přídavné jméno podle vzoru matčin."),
  P(2, "tvůj", "Je to tvůj sešit?", ZAJ, "zastupuje majitele, jeho jméno neobsahuje", "Tvůj je přivlastňovací zájmeno."),
  P(2, "hnědými", "Pes s hnědými skvrnami běžel k nám.", TVR, "v 1. pádě by znělo „hnědý“", "Hnědými je 7. pád od hnědý — tvrdé přídavné jméno."),
  P(2, "ranní", "Chytil ranní autobus.", MEK, "končí na -í", "Ranní — měkké přídavné jméno podle vzoru jarní."),
  P(2, "večerní", "Zazněl večerní zvon.", MEK, "končí na -í", "Večerní — měkké přídavné jméno podle vzoru jarní."),
  P(2, "Janin", "Janin sešit je nejúhlednější.", PRIV, "vzniklo ze jména Jana a říká, čí je sešit", "Janin — přivlastňovací přídavné jméno podle vzoru matčin."),
  P(2, "velkými", "Dům s velkými okny stojí na rohu.", TVR, "v 1. pádě by znělo „velký“", "Velkými je 7. pád od velký — tvrdé přídavné jméno."),

  P(3, "psí", "Na dvoře stojí psí bouda.", MEK, "končí na -í a neříká, kterému psovi bouda patří", "Psí je měkké přídavné jméno (vzor jarní) — neříká, komu bouda patří, ale jaká je."),
  P(3, "ptačí", "Z lesa se ozýval ptačí zpěv.", MEK, "končí na -í a označuje druh zpěvu, ne jednoho majitele", "Ptačí — měkké přídavné jméno, vzor jarní."),
  P(3, "boží", "O Vánocích je boží hod.", MEK, "končí na -í", "Boží — měkké přídavné jméno podle vzoru jarní."),
  P(3, "rybí", "K večeři byla rybí polévka.", MEK, "končí na -í a říká, jaká je polévka", "Rybí — měkké přídavné jméno podle vzoru jarní."),
  P(3, "lví", "Lev měl hustou lví hřívu.", MEK, "končí na -í", "Lví — měkké přídavné jméno, vzor jarní."),
  P(3, "Karlovy", "Karlovy Vary jsou lázeňské město.", PRIV, "vzniklo ze jména Karel a končí jako otcovy", "Karlovy — přivlastňovací přídavné jméno (vzor otcův) v názvu města."),
  P(3, "její", "Její kolo je úplně nové.", ZAJ, "zastupuje majitelku, ale jméno neobsahuje, i když končí na -í", "Její je přivlastňovací zájmeno, ne měkké přídavné jméno."),
  P(3, "dědečkův", "Dědečkův klobouk visí u dveří.", PRIV, "vzniklo ze slova dědeček a říká, čí je klobouk", "Dědečkův — přivlastňovací přídavné jméno podle vzoru otcův."),
  P(3, "otcovská", "Dostal otcovskou radu.", TVR, "končí v 1. pádě na -ý (otcovský) a říká, jaká rada, ne čí", "Otcovský je tvrdé přídavné jméno (vzor mladý) — neříká, čí rada je, ale jaká."),
  P(3, "mateřská", "Mladší bratr chodí do mateřské školy.", TVR, "v 1. pádě mužského rodu by znělo „mateřský“", "Mateřský je tvrdé přídavné jméno (vzor mladý); přivlastňovací by bylo matčin."),
  P(3, "jeho", "Jeho kamarád bydlí vedle.", ZAJ, "zastupuje majitele, ale jméno neobsahuje", "Jeho je přivlastňovací zájmeno."),
  P(3, "sousedův", "Sousedův pes štěká celou noc.", PRIV, "vzniklo ze slova soused a končí na -ův", "Sousedův — přivlastňovací přídavné jméno podle vzoru otcův."),
  P(3, "kočičí", "Ve tmě svítily kočičí oči.", MEK, "končí na -í", "Kočičí — měkké přídavné jméno podle vzoru jarní."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, DRUHY, level, (p) => ({
    question: `Co je slovo „${p.slovo}“ ve větě „${p.veta}“?`,
    hints: [
      `Jaký je 1. pád slova „${p.slovo}“ a na co se ptáš — jaký, nebo čí?`,
      `Pomůže tohle: slovo „${p.slovo}“ ${p.klic}.`,
    ],
  }));
}

export const PRIDAVNAJMENADRUHYTVRDAMEKKAPRIVLASTNOVACISKLONOVANI: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-tvaroslovi-pridavna-jmena-druhy-tvrda-mekka-privlastnovaci-sklonovani",
    rvpNodeId: "g5-cjl-jazykova-vychova-tvaroslovi-pridavna-jmena-druhy-tvrda-mekka-privlastnovaci-sklonovani",
    title: "Přídavná jména – druhy, skloňování",
    studentTitle: "Přídavná jména",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Tvarosloví",
    briefDescription: "Poznáš druhy přídavných jmen a jejich skloňování.",
    keywords: ["přídavná jména", "tvrdá", "měkká", "přivlastňovací", "skloňování", "vzory"],
    goals: [
      "Rozlišit tvrdá, měkká a přivlastňovací přídavná jména",
      "Přiřadit přídavné jméno ke správnému vzoru",
      "Správně skloňovat přídavná jména v různých pádech",
    ],
    boundaries: [
      "Neprobíráme přídavná jména neurčitá a záporná podrobně",
      "Bez složitých syntaktických analýz",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Přídavné jméno v základním tvaru: končí na -ý/-á/-é → tvrdé (vzor mladý). Končí na -í → měkké (vzor jarní). Vyjadřuje vlastnictví (-ův/-in) → přivlastňovací.",
      steps: [
        "Podívej se na základní tvar přídavného jména.",
        "Koncovka -ý/-á/-é → tvrdé, vzor mladý.",
        "Koncovka -í → měkké, vzor jarní.",
        "Vyjadřuje komu patří (-ův, -in) → přivlastňovací.",
        "Skloňuj podle správného vzoru.",
      ],
      commonMistake: "Žáci zaměňují měkká a tvrdá přídavná jména. Klíč: přídavné jméno, které v 1. pádě končí na -í, je měkké (pozor, její je zájmeno).",
      example: "Tvrdé: mladý, krásný, velký. Měkké: jarní, večerní, cizí. Přivlastňovací: Petrův, maminčin.",
    },
  },
];
