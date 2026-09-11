import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { parovani, type Dvojice } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a dvojice obsahovaly chyby i nejasnosti (stejná levá strana
// s různými pravými, „Brambory → chladnější podnebí“, zeměpisné šířky nad
// rámec 5. ročníku). Teď se skládají z banky dvojic, kde každá levá strana
// je jiný zeměpisný pojem s jednoznačným popisem.

const DVOJICE: Dvojice[] = [
  { uroven: 1, levy: "Alpy", pravy: "pohoří s horou Mont Blanc",
    proc: "Mont Blanc na hranici Francie a Itálie je nejvyšší horou Alp." },
  { uroven: 1, levy: "Volha", pravy: "nejdelší řeka Evropy",
    proc: "Volha teče Ruskem a vlévá se do Kaspického moře." },
  { uroven: 1, levy: "Dunaj", pravy: "řeka, která protéká Vídní a Budapeští",
    proc: "Dunaj teče z Německa až do Černého moře a spojuje deset států." },
  { uroven: 1, levy: "Velká Británie", pravy: "největší ostrov Evropy",
    proc: "Velká Británie je větší než Island i Irsko." },
  { uroven: 1, levy: "Středozemní moře", pravy: "moře mezi jižní Evropou a Afrikou",
    proc: "Na jeho pobřeží leží Itálie, Řecko nebo Španělsko." },
  { uroven: 1, levy: "Ural", pravy: "pohoří na hranici Evropy a Asie",
    proc: "Pohoří Ural se táhne Ruskem od severu k jihu." },
  { uroven: 1, levy: "Skandinávský poloostrov", pravy: "poloostrov, na kterém leží Norsko a Švédsko",
    proc: "Je to největší poloostrov Evropy." },

  { uroven: 2, levy: "Pyreneje", pravy: "pohoří mezi Španělskem a Francií",
    proc: "Pyreneje oddělují Pyrenejský poloostrov od zbytku Evropy." },
  { uroven: 2, levy: "Apeninský poloostrov", pravy: "poloostrov ve tvaru boty",
    proc: "Na Apeninském poloostrově leží Itálie." },
  { uroven: 2, levy: "Pyrenejský poloostrov", pravy: "poloostrov Španělska a Portugalska",
    proc: "Leží na jihozápadě Evropy mezi Atlantikem a Středozemním mořem." },
  { uroven: 2, levy: "Balkánský poloostrov", pravy: "poloostrov na jihovýchodě Evropy",
    proc: "Leží na něm například Řecko, Bulharsko a Chorvatsko." },
  { uroven: 2, levy: "Karpaty", pravy: "oblouk hor přes Slovensko, Polsko a Rumunsko",
    proc: "Karpaty zasahují i na východ Moravy — patří k nim Beskydy." },
  { uroven: 2, levy: "Rýn", pravy: "řeka, která teče Německem do Severního moře",
    proc: "Rýn pramení ve Švýcarsku a ústí v Nizozemsku." },
  { uroven: 2, levy: "Baltské moře", pravy: "moře mezi Skandinávií a Pobaltím",
    proc: "Baltské moře je méně slané, protože do něj ústí mnoho řek." },
  { uroven: 2, levy: "Golfský proud", pravy: "teplý mořský proud, který ohřívá západ Evropy",
    proc: "Díky němu mají Irsko a Norsko mírnější zimy, než by odpovídalo jejich poloze." },

  { uroven: 3, levy: "fjord", pravy: "úzký mořský záliv vyhloubený ledovcem",
    proc: "Nejznámější fjordy jsou na pobřeží Norska." },
  { uroven: 3, levy: "oceánské podnebí", pravy: "mírné zimy, chladnější léta a hodně srážek",
    proc: "Moře v zimě hřeje a v létě chladí — typické je pro Irsko a Velkou Británii." },
  { uroven: 3, levy: "vnitrozemské podnebí", pravy: "studené zimy, teplá léta a méně srážek",
    proc: "Čím dál od moře, tím větší rozdíl mezi létem a zimou — typické je pro východ Evropy." },
  { uroven: 3, levy: "středomořské podnebí", pravy: "horká suchá léta a mírné deštivé zimy",
    proc: "Takové podnebí mají Itálie, Řecko nebo Španělsko." },
  { uroven: 3, levy: "Island", pravy: "ostrov se sopkami a gejzíry",
    proc: "Island leží na rozhraní dvou zemských desek, proto je tam tolik sopek." },
  { uroven: 3, levy: "Kaspické moře", pravy: "největší jezero světa",
    proc: "Leží na hranici Evropy a Asie a jeho voda je slaná." },
  { uroven: 3, levy: "Elbrus", pravy: "nejvyšší hora Kavkazu",
    proc: "Kavkaz leží mezi Černým a Kaspickým mořem." },
  { uroven: 3, levy: "Severní moře", pravy: "moře, do kterého ústí Labe",
    proc: "Labe teče z Krkonoš přes Německo až do Severního moře u Hamburku." },
];

function gen(level: number): PracticeTask[] {
  return parovani(DVOJICE, level, "Spoj zeměpisný pojem s tím, co o něm platí.");
}

export const EVROPAPOLOHAPOVRCHVODSTVOPODNEBI: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-evropa-poloha-povrch-vodstvo-podnebi",
    title: "Evropa - poloha, povrch, vodstvo, podnebí",
    studentTitle: "Evropa — příroda",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Poznáš hory, řeky a klima Evropy.",
    keywords: ["evropa", "alpy", "mont blanc", "volha", "dunaj", "středomořské", "atlantické", "podnebí"],
    goals: [
      "Žák popíše polohu Evropy a její hranice",
      "Žák uvede hlavní pohoří a řeky Evropy",
      "Žák rozliší typy podnebí v Evropě",
    ],
    boundaries: ["Podrobná fyzická geografie", "Detailní klimatologie"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Mont Blanc je nejvyšší hora Alp, Volha nejdelší řeka Evropy.",
      steps: [
        "Hranice Evropy: Ural → Kaspické moře → Kavkaz",
        "Nejvyšší hora Alp: Mont Blanc",
        "Nejdelší řeka Evropy: Volha",
        "Podnebí: oceánské (západ), středomořské (jih), vnitrozemské (východ)",
      ],
      commonMistake: "Záměna Volhy (nejdelší) a Dunaje (druhá nejdelší — ale protéká více zeměmi).",
      example: "Středomořské klima: suché horké léto a mírná deštivá zima.",
    },
  },
];
