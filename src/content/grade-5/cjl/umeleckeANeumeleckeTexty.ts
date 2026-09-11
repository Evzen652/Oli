import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { urceni, type Kategorie, type Polozka } from "../_urceni";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď se podle krátké vlastní ukázky určuje,
// jaký je to text: L1 zřetelné ukázky · L2 ukázky s méně nápadnými znaky
// · L3 zrádné případy (naučný text o zvířeti × pohádka o zvířeti, zpráva × povídka).

const TEXTY: Kategorie[] = [
  { nazev: "umělecký text", znak: "vymyšlený příběh nebo báseň, která má zaujmout a vyvolat pocity (pohádka, povídka, báseň)." },
  { nazev: "naučný text", znak: "věcně vysvětluje, jak něco je nebo funguje (učebnice, encyklopedie)." },
  { nazev: "zpráva", znak: "stručně oznamuje, co se kde a kdy skutečně stalo (noviny, zprávy)." },
  { nazev: "návod", znak: "radí krok za krokem, jak něco udělat (recept, návod ke hře)." },
];
const UM = "umělecký text", NA = "naučný text", ZP = "zpráva", NV = "návod";
const P = (uroven: 1 | 2 | 3, ukazka: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven, slovo: ukazka, veta: ukazka, kategorie, klic, proc });

const BANKA: Polozka[] = [
  P(1, "„Byl jednou jeden král a ten měl tři dcery…“", UM, "začíná jako pohádka a je vymyšlený", "Vymyšlený příběh s pohádkovým začátkem — umělecký text."),
  P(1, "„Ježek je savec. Živí se hmyzem a žížalami a v zimě spí.“", NA, "věcně popisuje, jak ježek žije", "Věcné informace o zvířeti — naučný text."),
  P(1, "„Včera odpoledne hasiči v Brně uhasili požár skladu. Nikdo nebyl zraněn.“", ZP, "oznamuje, co se kdy a kde skutečně stalo", "Skutečná událost s místem a časem — zpráva."),
  P(1, "„Nejprve rozšlehej vejce, potom přidej mouku a nakonec mléko.“", NV, "radí po krocích, jak něco udělat", "Kroky za sebou — návod (recept)."),
  P(1, "„Slunce se usmálo na louku a květiny mu zamávaly.“", UM, "slunce se usmívá a květiny mávají — to je vymyšlené a básnické", "Básnický, vymyšlený obraz — umělecký text."),
  P(1, "„Voda vře při teplotě sto stupňů Celsia.“", NA, "věcně vysvětluje, jak něco je", "Věcná informace — naučný text."),
  P(1, "„V sobotu ráno se na dálnici D1 srazila dvě auta. Silnice byla dvě hodiny uzavřená.“", ZP, "stručně oznamuje skutečnou událost", "Skutečná událost — zpráva."),
  P(1, "„Zapoj kabel do zásuvky a stiskni zelené tlačítko.“", NV, "radí, co udělat", "Pokyny krok za krokem — návod."),
  P(1, "„Malá liška se jednou vydala hledat, kde končí duha.“", UM, "je to vymyšlený příběh o zvířeti, které hledá duhu", "Vymyšlený příběh — umělecký text."),
  P(1, "„Praha je hlavní město České republiky a leží na Vltavě.“", NA, "věcně sděluje informaci", "Věcná informace — naučný text."),
  P(1, "„Ve škole v Kolíně dnes začala výstava dětských kreseb.“", ZP, "oznamuje, co se dnes skutečně stalo", "Oznámení události — zpráva."),
  P(1, "„Hráči si rozdají pět karet a začíná nejmladší.“", NV, "vysvětluje pravidla, jak hrát", "Pravidla hry — návod."),
  P(1, "„Tichounce padá sníh, / svět je bílý jako smích.“", UM, "jsou to verše s rýmem", "Verše — umělecký text."),

  P(2, "„Drak zafuněl, ale Jirka se nebál. Vytáhl kouzelnou píšťalku a začal hrát.“", UM, "děj s drakem a kouzelnou píšťalkou je vymyšlený", "Vymyšlený příběh — umělecký text."),
  P(2, "„Srdce je sval, který pumpuje krev. Za minutu udělá asi sedmdesát stahů.“", NA, "vysvětluje, jak funguje část těla", "Věcné vysvětlení — naučný text."),
  P(2, "„Český tým vyhrál včera finále turnaje 3 : 1.“", ZP, "oznamuje skutečný výsledek", "Oznámení výsledku — zpráva."),
  P(2, "„Semínka zasaď dva centimetry hluboko a každý den je zalij.“", NV, "radí, jak postupovat", "Pokyny — návod."),
  P(2, "„Vítr si hrál s listím a honil ho po celé zahradě.“", UM, "vítr si hraje jako živá bytost — básnický obraz", "Básnický obraz — umělecký text."),
  P(2, "„Včely žijí v úlech. V každém úlu je jedna královna a tisíce dělnic.“", NA, "věcně popisuje život včel", "Věcné informace — naučný text."),
  P(2, "„Kvůli silnému větru dnes nejezdí lanovka na Sněžku.“", ZP, "oznamuje skutečnou situaci", "Oznámení — zpráva."),
  P(2, "„Papír přelož napůl, pak rohy ohni do středu.“", NV, "vede krok za krokem k výrobku", "Postup — návod."),
  P(2, "„Starý mlýnek vyprávěl hodinám, jak kdysi mlel mouku pro celou vesnici.“", UM, "mluvící mlýnek je vymyšlený", "Vymyšlený příběh — umělecký text."),
  P(2, "„Měsíc oběhne Zemi přibližně za 29 dní.“", NA, "věcně vysvětluje", "Věcná informace — naučný text."),
  P(2, "„Ve čtvrtek bude v celém kraji přerušena dodávka vody od osmi do dvanácti hodin.“", ZP, "oznamuje, co se kdy skutečně stane", "Oznámení — zpráva."),
  P(2, "„Do hrnce nalij litr vody, přidej sůl a počkej, až se voda začne vařit.“", NV, "radí po krocích", "Recept — návod."),
  P(2, "„Hvězdy na nebi mrkaly, jako by si šeptaly tajemství.“", UM, "hvězdy mrkají a šeptají jako lidé — básnický obraz", "Básnický obraz — umělecký text."),

  P(3, "„Liška obecná má rezavou srst a huňatý ocas. Loví hlavně myši.“", NA, "i když je o zvířeti, nic nevymýšlí a jen věcně popisuje", "Věcný popis zvířete — naučný text, ne pohádka."),
  P(3, "„Liška se protáhla a řekla sýkorce: ‚Pojď si ke mně sednout, zazpíváme si.‘“", UM, "zvíře tu mluví jako člověk, je to vymyšlený příběh", "Mluvící liška — umělecký text (bajka nebo pohádka)."),
  P(3, "„Tomáš ráno zaspal, a tak musel běžet na autobus. Když dorazil do školy, zjistil, že je sobota.“", UM, "je to příhoda o postavě, kterou si autor vymyslel", "Vymyšlená příhoda s pointou — umělecký text (povídka)."),
  P(3, "„Dnes ráno zaspalo v Ostravě mnoho lidí, protože v noci vypadl proud a nezvonily budíky.“", ZP, "oznamuje skutečnou událost s místem a časem", "Skutečná událost — zpráva."),
  P(3, "„Když chceš, aby kytka rostla, dej ji na světlo a nezapomeň ji zalévat.“", NV, "radí, co udělat, i když to zní jako rozhovor", "Rada, jak postupovat — návod."),
  P(3, "„Rostliny potřebují světlo, aby si mohly vyrobit živiny. Tomu se říká fotosyntéza.“", NA, "vysvětluje, proč a jak něco funguje", "Věcné vysvětlení — naučný text."),
  P(3, "„Kytka na okně smutně svěsila lístky: ‚Kdyby mi tak někdo dal napít.‘“", UM, "mluvící kytka je vymyšlená", "Vymyšlený, básnicky laděný text — umělecký text."),
  P(3, "„Vědci objevili v Jižní Americe nový druh žáby. Oznámili to včera.“", ZP, "oznamuje, že se něco skutečně stalo a kdy", "Oznámení nového objevu — zpráva."),
  P(3, "„Žáby patří mezi obojživelníky. Kladou vajíčka do vody, ze kterých se líhnou pulci.“", NA, "věcně popisuje, jak žáby žijí", "Věcné informace — naučný text."),
  P(3, "„Otoč kolečko doprava, dokud neuslyšíš cvaknutí. Pak víčko zvedni.“", NV, "vede krok za krokem", "Postup — návod."),
  P(3, "„Kouzelná žába slíbila princi, že mu splní tři přání.“", UM, "kouzelná žába plnící přání je vymyšlená", "Pohádka — umělecký text."),
  P(3, "„Na náměstí dnes vysadili dvacet nových lip. Akci zorganizovala místní škola.“", ZP, "oznamuje skutečnou událost", "Zpráva o události."),
  P(3, "„Nejvyšší horou Česka je Sněžka. Měří 1 603 metrů.“", NA, "věcně sděluje fakta", "Věcné informace — naučný text."),
];

function gen(level: number): PracticeTask[] {
  return urceni(BANKA, TEXTY, level, (p) => ({
    question: `Jaký je to text? ${p.veta}`,
    hints: [
      `Ukázka začíná slovy ${p.veta.split(" ").slice(0, 3).join(" ")}… Chce něco vysvětlit, oznámit, poradit, nebo pobavit příběhem?`,
      `Pomůže tohle: ukázka ${p.klic}.`,
    ],
  }));
}

export const UMELECKEANEUMELECKETEXTY: TopicMetadata[] = [
  {
    id: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty",
    rvpNodeId: "g5-cjl-literarni-vychova-literarni-pojmy-a-zanry-umelecke-a-neumelecke-texty",
    title: "Umělecké a věcné texty",
    studentTitle: "Umělecké a věcné texty",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární pojmy a žánry",
    briefDescription: "Rozlišíš umělecký a věcný text a pochopíš jejich účel.",
    keywords: ["umělecký text", "věcný text", "beletrie", "odborný text", "publicistika"],
    goals: [
      "Rozlišit umělecký a věcný text",
      "Určit cíl a styl obou typů textů",
      "Přiřadit konkrétní text ke správné kategorii",
    ],
    boundaries: [
      "Bez podrobné literárněvědné analýzy",
      "Rozšiřující nad rámec RVP 5. ročníku: úroveň 3 (propaganda, alegorie, satira, literatura faktu, dystopie)",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Umělecký text = krása, emoce, příběh (básně, romány, pohádky). Věcný text = informace, fakta (učebnice, návody, zprávy).",
      steps: [
        "Přečti text a zeptej se: Chce mě pobavit nebo dojmout? → umělecký.",
        "Chce mě informovat nebo poučit? → věcný.",
        "Umělecký: obrazný jazyk, příběh, emoce.",
        "Věcný: přesná fakta, neutrální jazyk.",
      ],
      commonMistake: "Žáci si myslí, že krásně napsaný věcný text je umělecký. Záleží na účelu, ne na kráse jazyka.",
      example: "Báseň o slonech = umělecká. Encyklopedický článek o slonech = věcný.",
    },
  },
];
