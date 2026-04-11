import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { shuffleArray, pickRandom, mapQPoolToTasks, type QPool } from "../helpers";

const DIRECTIONS_QUESTIONS: QPool[] = [
  { question: "🧭 Kde vychází slunce?", correct: "Na východě", options: ["Na východě", "Na západě", "Na severu", "Na jihu"], hints: ["Ráno vidíš slunce nízko nad obzorem — na které straně?", "Slunce VYCHÁZÍ na východě a ZAPADÁ na západě."] },
  { question: "🌅 Kde zapadá slunce?", correct: "Na západě", options: ["Na západě", "Na východě", "Na severu", "Na jihu"], hints: ["Večer slunce klesá k obzoru — na které straně?", "Západ slunce — slovo západ ti napoví."] },
  { question: "🗺️ Kde na mapě najdeš sever?", correct: "Nahoře", options: ["Nahoře", "Dole", "Vlevo", "Vpravo"], hints: ["Na většině map je sever vždy na jednom místě. Kde?", "Sever = nahoře na mapě."] },
  { question: "🗺️ Kde na mapě najdeš jih?", correct: "Dole", options: ["Dole", "Nahoře", "Vlevo", "Vpravo"], hints: ["Jih je opak severu. Když sever je nahoře, kde je jih?", "Sever ↑ nahoře, jih ↓ dole."] },
  { question: "🗺️ Na mapě je západ vlevo. Kde je východ?", correct: "Vpravo", options: ["Vpravo", "Vlevo", "Nahoře", "Dole"], hints: ["Východ je opak západu. Když je západ vlevo, kde je východ?", "Západ ← vlevo, východ → vpravo."] },
  { question: "🧭 Jaký přístroj ukazuje světové strany?", correct: "Kompas (buzola)", options: ["Kompas (buzola)", "Teploměr", "Hodiny", "Dalekohled"], hints: ["Je to malý přístroj s magnetickou střelkou, která ukazuje na sever.", "Turisté ho používají v přírodě k orientaci."] },
  { question: "🌞 Když stojíš čelem k vycházejícímu slunci, co máš za zády?", correct: "Západ", options: ["Západ", "Východ", "Sever", "Jih"], hints: ["Díváš se na východ (tam vychází slunce). Co je za tebou?", "Za tebou je vždy opačná strana — opak východu."] },
  { question: "🗺️ Slovensko leží od ČR na…", correct: "Východ", options: ["Východ", "Západ", "Sever", "Jih"], hints: ["Podívej se na mapu — Slovensko je napravo od ČR.", "Na mapě je vpravo = východ."] },
  // Vedlejší světové strany
  { question: "🧭 Jak se říká směru mezi severem a východem?", correct: "Severovýchod", options: ["Severovýchod", "Jihozápad", "Severozápad", "Jihovýchod"], hints: ["Spojíš dva názvy: sever + východ.", "Mezi severem a východem = severovýchod."] },
  { question: "🧭 Jak se říká směru mezi jihem a západem?", correct: "Jihozápad", options: ["Jihozápad", "Severovýchod", "Jihovýchod", "Severozápad"], hints: ["Spojíš dva názvy: jih + západ.", "Mezi jihem a západem = jihozápad."] },
  { question: "🧭 Kolik hlavních světových stran existuje?", correct: "4", options: ["4", "2", "6", "8"], hints: ["Sever, jih, východ, západ — kolik jich je?", "Hlavní světové strany jsou právě 4."] },
  { question: "🧭 Kolik vedlejších světových stran existuje?", correct: "4", options: ["4", "2", "6", "8"], hints: ["Severovýchod, jihovýchod, jihozápad, severozápad — kolik?", "Vedlejší strany jsou taky 4."] },
  // Zkratky
  { question: "🧭 Jakou zkratkou značíme sever?", correct: "S", options: ["S", "J", "V", "Z"], hints: ["Sever — první písmeno slova.", "S jako Sever."] },
  { question: '🧭 Co znamená zkratka „JV" na mapě?', correct: "Jihovýchod", options: ["Jihovýchod", "Jihozápad", "Severovýchod", "Severozápad"], hints: ["J = jih, V = východ. Dohromady?", "JV = jihovýchod."] },
  { question: '🧭 Co znamená zkratka „SZ" na mapě?', correct: "Severozápad", options: ["Severozápad", "Jihovýchod", "Severovýchod", "Jihozápad"], hints: ["S = sever, Z = západ. Dohromady?", "SZ = severozápad."] },
  // Orientace podle slunce
  { question: "🌞 V poledne je slunce na…", correct: "Jihu", options: ["Jihu", "Severu", "Východě", "Západě"], hints: ["V poledne je slunce nejvýše na obloze. V Česku svítí z jihu.", "Poledne = slunce na jihu (u nás)."] },
  { question: "🌞 Když stojíš čelem k jihu, co máš vlevo?", correct: "Východ", options: ["Východ", "Západ", "Sever", "Jih"], hints: ["Představ si, že se díváš dolů na mapě. Co je vlevo?", "Čelem k jihu: vlevo = východ, vpravo = západ."] },
  { question: "🌞 Když stojíš čelem k severu, co máš vpravo?", correct: "Východ", options: ["Východ", "Západ", "Sever", "Jih"], hints: ["Díváš se nahoru na mapě. Co je vpravo?", "Čelem k severu: vpravo = východ, vlevo = západ."] },
  // Sousední státy
  { question: "🗺️ Polsko leží od ČR na…", correct: "Sever", options: ["Sever", "Jih", "Východ", "Západ"], hints: ["Na mapě je Polsko nad ČR.", "Nahoře na mapě = sever."] },
  { question: "🗺️ Rakousko leží od ČR na…", correct: "Jih", options: ["Jih", "Sever", "Východ", "Západ"], hints: ["Na mapě je Rakousko pod ČR.", "Dole na mapě = jih."] },
  { question: "🗺️ Německo leží od ČR na…", correct: "Západ", options: ["Západ", "Východ", "Sever", "Jih"], hints: ["Na mapě je Německo vlevo od ČR.", "Vlevo na mapě = západ."] },
  // Praktické situace
  { question: "🧭 Stojíš čelem na západ. Kam se otočíš, abys šel na sever?", correct: "Doprava", options: ["Doprava", "Doleva", "Dozadu", "Nikam"], hints: ["Na mapě: západ je vlevo, sever nahoře. Kam se otočíš?", "Ze západu na sever = doprava."] },
  { question: "🧭 Opak severu je…", correct: "Jih", options: ["Jih", "Západ", "Východ", "Sever"], hints: ["Sever je nahoře, jeho opak je…", "Opak severu = jih (dole)."] },
];

const HELP_DIR: HelpData = {
  hint: "4 světové strany: sever (S), jih (J), východ (V), západ (Z).",
  steps: ["Vzpomeň si, kde vychází slunce — to je východ.", "Naproti východu je západ.", "Na mapě: sever je nahoře, jih dole, západ vlevo, východ vpravo."],
  commonMistake: "Západ a východ se pletou — slunce VYCHÁZÍ na východě a ZAPADÁ na západě!",
  example: "🧭 Kde vychází slunce? → Na východě ✅",
  visualExamples: [{ label: "Světové strany na mapě", illustration: "         ⬆️ SEVER (S)\n            |\nZÁPAD (Z) ←🧭→ VÝCHOD (V)\n            |\n         ⬇️ JIH (J)\n\n🌅 Slunce: vychází na V, zapadá na Z" }],
};

const TIME_QUESTIONS: QPool[] = [
  { question: "⏰ Kolik hodin má jeden den?", correct: "24", options: ["24", "12", "60", "30"], hints: ["Den má dvě poloviny — dopoledne a odpoledne. Každá má 12 hodin.", "12 + 12 = ?"] },
  { question: "⏱️ Kolik minut má jedna hodina?", correct: "60", options: ["60", "30", "100", "24"], hints: ["Velká ručička obejde celý ciferník za jednu hodinu. Kolik dílků?", "Jedna hodina = 60 minut."] },
  { question: "📅 Kolik dní má jeden týden?", correct: "7", options: ["7", "5", "10", "6"], hints: ["Pondělí až neděle — spočítej dny.", "Pracovní dny (5) + víkend (2) = ?"] },
  { question: "📅 Kolik měsíců má rok?", correct: "12", options: ["12", "10", "6", "52"], hints: ["Leden, únor, březen… prosinec. Kolik jich je?", "Rok má 12 měsíců — od ledna do prosince."] },
  { question: "📅 Který den v týdnu je první?", correct: "Pondělí", options: ["Pondělí", "Neděle", "Sobota", "Úterý"], hints: ["V Česku začíná týden pracovním dnem. Který to je?", "Po víkendu (neděle) přijde první den nového týdne."] },
  { question: "⏰ Co ukazuje malá ručička na hodinách?", correct: "Hodiny", options: ["Hodiny", "Minuty", "Sekundy", "Dny"], hints: ["Malá ručička se pohybuje pomalu. Co počítá — minuty, nebo hodiny?", "Malá = hodiny, velká = minuty."] },
  { question: "⏰ Co ukazuje velká ručička na hodinách?", correct: "Minuty", options: ["Minuty", "Hodiny", "Sekundy", "Dny"], hints: ["Velká ručička se pohybuje rychleji. Co počítá?", "Velká ručička obejde ciferník za 60 minut = 1 hodinu."] },
  { question: "📅 Kolik dní má únor v přestupném roce?", correct: "29", options: ["29", "28", "30", "31"], hints: ["Únor má normálně 28 dní. V přestupném roce má o jeden víc.", "28 + 1 = ?"] },
  { question: "📅 Který měsíc má vždy 28 nebo 29 dní?", correct: "Únor", options: ["Únor", "Duben", "Červen", "Září"], hints: ["Je to nejkratší měsíc v roce.", "Tento měsíc je druhý v roce a má nejméně dní."] },
  { question: "🕐 Je 15:00. Kolik je to hodin odpoledne?", correct: "3 hodiny odpoledne", options: ["3 hodiny odpoledne", "5 hodin odpoledne", "1 hodina odpoledne", "15 hodin ráno"], hints: ["Od 15 odečti 12 — dostaneš odpolední čas.", "15 − 12 = ? hodin odpoledne."] },
  // Nové otázky
  { question: "⏰ Kolik sekund má jedna minuta?", correct: "60", options: ["60", "100", "30", "24"], hints: ["Stejně jako hodina má 60 minut, minuta má… kolik sekund?", "Minuta = 60 sekund."] },
  { question: "📅 Kolik dní má rok (běžný)?", correct: "365", options: ["365", "360", "350", "400"], hints: ["Rok má 12 měsíců a dohromady kolik dní?", "Říká se: rok má 365 dní (v přestupném 366)."] },
  { question: "📅 Kolik týdnů má přibližně jeden rok?", correct: "52", options: ["52", "48", "36", "12"], hints: ["365 dní děleno 7 dny v týdnu = přibližně kolik?", "Rok má asi 52 týdnů."] },
  { question: "🕐 Je 20:00. Kolik je to hodin večer?", correct: "8 hodin večer", options: ["8 hodin večer", "10 hodin večer", "6 hodin večer", "2 hodiny odpoledne"], hints: ["20 − 12 = ?", "20:00 = 8 hodin večer."] },
  { question: "📅 Který den v týdnu je poslední?", correct: "Neděle", options: ["Neděle", "Sobota", "Pátek", "Pondělí"], hints: ["V Česku týden končí víkendem. Který den je úplně poslední?", "Po sobotě přijde neděle — poslední den týdne."] },
  { question: "📅 Kolik dní má březen?", correct: "31", options: ["31", "30", "28", "29"], hints: ["Březen je první jarní měsíc. Má 30 nebo 31 dní?", "Březen má 31 dní."] },
  { question: "📅 Které dva dny tvoří víkend?", correct: "Sobota a neděle", options: ["Sobota a neděle", "Pátek a sobota", "Neděle a pondělí", "Čtvrtek a pátek"], hints: ["Víkend je volno po pracovním týdnu. Které dny to jsou?", "Sobota a neděle — dva dny volna."] },
  { question: "⏰ Kdy je poledne?", correct: "Ve 12:00", options: ["Ve 12:00", "V 10:00", "Ve 14:00", "V 6:00"], hints: ["Poledne je přesně uprostřed dne. Kolik je hodin?", "Poledne = 12 hodin."] },
  { question: "⏰ Kdy je půlnoc?", correct: "Ve 24:00 (0:00)", options: ["Ve 24:00 (0:00)", "Ve 12:00", "V 6:00", "Ve 20:00"], hints: ["Půlnoc je přesně uprostřed noci. Kolik je hodin?", "Půlnoc = 0:00 nebo 24:00 — začátek nového dne."] },
  { question: "📅 Kolik pracovních dní má týden?", correct: "5", options: ["5", "6", "7", "4"], hints: ["Pondělí až pátek — kolik je to dní?", "Pracovních dní je 5 (Po-Pá), víkend má 2 dny."] },
];

const HELP_TIME: HelpData = {
  hint: "Den má 24 hodin, hodina 60 minut, rok 12 měsíců.",
  steps: ["Přečti otázku — týká se hodin, dnů, nebo měsíců?", "Vzpomeň si na hodiny nebo kalendář.", "Vyber správnou odpověď."],
  commonMistake: "Malá ručička = hodiny, velká ručička = minuty (ne naopak)!",
  example: "⏰ Kolik hodin má den? → 24 ✅",
  visualExamples: [{ label: "Čas a kalendář", illustration: "⏰ Den = 24 hodin\n⏱️ Hodina = 60 minut\n📅 Týden = 7 dní\n📅 Rok = 12 měsíců = 365 dní\n\n🕐 Malá ručička → HODINY\n🕐 Velká ručička → MINUTY" }],
};

function genTimeOrder(_level: number): PracticeTask[] {
  const chains = [
    { items: ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"], question: "📅 Seřaď dny v týdnu:", hints: ["Týden začíná pondělím. Co je druhý den?", "Po-Út-St-Čt-Pá-So-Ne — v tomhle pořadí."] },
    { items: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen"], question: "📅 Seřaď první polovinu měsíců:", hints: ["Rok začíná lednem. Který měsíc je druhý?", "Leden, únor, březen, duben, květen, červen."] },
    { items: ["Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], question: "📅 Seřaď druhou polovinu měsíců:", hints: ["Po červnu přichází červenec. Co dál?", "Červenec, srpen, září, říjen, listopad, prosinec."] },
    { items: ["Ráno", "Dopoledne", "Poledne", "Odpoledne", "Večer", "Noc"], question: "🌅 Seřaď části dne:", hints: ["Den začíná ránem. Co přijde po ránu?", "Ráno → dopoledne → poledne → odpoledne → večer → noc."] },
    { items: ["Minuta", "Hodina", "Den", "Týden", "Měsíc", "Rok"], question: "⏱️ Seřaď od nejkratší po nejdelší:", hints: ["Co je kratší — minuta, nebo hodina?", "Od nejkratší: minuta < hodina < den < týden < měsíc < rok."] },
    // Nové řazení
    { items: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"], question: "📅 Seřaď všech 12 měsíců v roce:", hints: ["Rok začíná lednem a končí prosincem.", "Leden → únor → březen → … → prosinec."] },
    { items: ["Sekunda", "Minuta", "Hodina", "Den"], question: "⏱️ Seřaď od nejkratší po nejdelší:", hints: ["Co je kratší než minuta?", "Sekunda < minuta < hodina < den."] },
    { items: ["Svítání", "Ráno", "Poledne", "Podvečer", "Soumrak"], question: "🌅 Seřaď od úsvitu do tmy:", hints: ["Den začíná svítáním. Co přijde pak?", "Svítání → ráno → poledne → podvečer → soumrak."] },
    { items: ["Úterý", "Středa", "Čtvrtek", "Pátek"], question: "📅 Seřaď prostřední dny pracovního týdne:", hints: ["Po pondělí je úterý. Co dál?", "Úterý → středa → čtvrtek → pátek."] },
    { items: ["Září", "Říjen", "Listopad", "Prosinec", "Leden", "Únor"], question: "📅 Seřaď měsíce od září do února:", hints: ["Školní rok začíná v září. Co dál?", "Září → říjen → listopad → prosinec → leden → únor."] },
  ];
  return pickRandom(chains, chains.length).map((c) => ({ question: c.question, correctAnswer: c.items.join(","), items: c.items, hints: c.hints }));
}

const HELP_TIME_ORDER: HelpData = {
  hint: "Dny v týdnu i měsíce v roce mají své pevné pořadí.",
  steps: ["Přečti, co máš seřadit — dny, měsíce, nebo části dne?", "Vzpomeň si na kalendář nebo hodiny.", "Seřaď od prvního po poslední."],
  commonMistake: "Týden začíná PONDĚLÍM, ne nedělí (v Česku)!",
  example: "📅 Pondělí → Úterý → Středa → … → Neděle ✅",
  visualExamples: [{ label: "Dny v týdnu", illustration: "1️⃣ Pondělí\n2️⃣ Úterý\n3️⃣ Středa\n4️⃣ Čtvrtek\n5️⃣ Pátek\n6️⃣ Sobota\n7️⃣ Neděle" }],
};

const MAP_QUESTIONS: QPool[] = [
  { question: "🗺️ Co je legenda mapy?", correct: "Vysvětlivky značek na mapě", options: ["Vysvětlivky značek na mapě", "Název mapy", "Okraj mapy", "Číslo mapy"], hints: ["Legenda vysvětluje, co jednotlivé značky na mapě znamenají.", "Není to název ani okraj — jsou to vysvětlivky k symbolům."] },
  { question: "🏔️ Jak se na mapě značí hory?", correct: "Hnědou barvou", options: ["Hnědou barvou", "Modrou barvou", "Zelenou barvou", "Červenou barvou"], hints: ["Každá barva na mapě něco znamená. Hory jsou vysoko — jakou barvou se značí?", "Modrá je voda, zelená nížiny. Co zbývá pro hory?"] },
  { question: "💧 Co na mapě značí modrá barva?", correct: "Vodu (řeky, jezera, moře)", options: ["Vodu (řeky, jezera, moře)", "Hory", "Lesy", "Města"], hints: ["Modrá jako… co je v přírodě modré a tekuté?", "Řeky, jezera a moře — všechno je modrá barva na mapě."] },
  { question: "🌲 Co na mapě značí zelená barva?", correct: "Nížiny, lesy a louky", options: ["Nížiny, lesy a louky", "Vodu", "Hory", "Silnice"], hints: ["Zelená jako tráva a stromy. Co je na mapě zelené?", "Nízko položené oblasti s trávou a lesy."] },
  { question: "📏 K čemu slouží měřítko mapy?", correct: "Ukazuje, kolik cm na mapě = kolik km ve skutečnosti", options: ["Ukazuje, kolik cm na mapě = kolik km ve skutečnosti", "Ukazuje světové strany", "Ukazuje počasí", "Ukazuje čas"], hints: ["Měřítko ti řekne, jak velká je mapa ve srovnání se skutečností.", "1 cm na mapě = kolik km doopravdy? To říká měřítko."] },
  { question: "🗺️ Kde na mapě najdeš sever?", correct: "Nahoře", options: ["Nahoře", "Dole", "Vlevo", "Vpravo"], hints: ["Na většině map je sever vždy na jednom místě. Kde?", "Sever je na mapě nahoře — vždy."] },
  // Nové otázky
  { question: "🗺️ Co značí černé tečky nebo kroužky na mapě?", correct: "Města a obce", options: ["Města a obce", "Hory", "Řeky", "Lesy"], hints: ["Černé značky na mapě obvykle ukazují místa, kde žijí lidé.", "Města se na mapě značí tečkami nebo kroužky."] },
  { question: "🗺️ Jakou barvou se na mapě značí silnice?", correct: "Červenou nebo žlutou", options: ["Červenou nebo žlutou", "Modrou", "Zelenou", "Hnědou"], hints: ["Silnice na mapě bývají barevné čáry — jaké barvy?", "Hlavní silnice jsou červené, vedlejší žluté."] },
  { question: "🗺️ Co je plán města?", correct: "Podrobná mapa jednoho města", options: ["Podrobná mapa jednoho města", "Seznam obyvatel", "Fotografie města", "Jízdní řád"], hints: ["Plán = mapa, ale jen jednoho místa. Jakého?", "Plán města ukazuje ulice, budovy a parky jednoho města."] },
  { question: "🗺️ Co znamená, když je na mapě měřítko 1 : 100 000?", correct: "1 cm na mapě = 1 km ve skutečnosti", options: ["1 cm na mapě = 1 km ve skutečnosti", "Mapa je 100 000× větší", "Na mapě je 100 000 měst", "Mapa má 100 000 barev"], hints: ["100 000 cm = 1 km. Takže 1 cm na mapě = ?", "Měřítko říká, kolikrát je mapa zmenšená."] },
  { question: "🗺️ Proč se na mapách používají značky místo obrázků?", correct: "Jsou přehlednější a zabírají méně místa", options: ["Jsou přehlednější a zabírají méně místa", "Jsou hezčí", "Obrázky nejdou tisknout", "Značky jsou barevnější"], hints: ["Mapa musí být přehledná. Co je lepší — malá značka, nebo velký obrázek?", "Značky šetří místo a mapa je díky nim čitelná."] },
  { question: "🏞️ Čím výše v horách, tím je barva na mapě…", correct: "Tmavší (sytější hnědá)", options: ["Tmavší (sytější hnědá)", "Světlejší", "Modrá", "Zelená"], hints: ["Hory se značí hnědě. Čím vyšší hora, tím…", "Vyšší = tmavší hnědá na mapě."] },
];

const HELP_MAP: HelpData = {
  hint: "Mapa je zmenšený obrázek krajiny. Barvy a značky mají svůj význam.",
  steps: ["Přečti otázku — o jaké části mapy se mluví?", "Vzpomeň si na barvy: modrá = voda, zelená = nížiny, hnědá = hory.", "Vyber správnou odpověď."],
  commonMistake: "Hnědá na mapě = hory a kopce, NE města!",
  example: "💧 Modrá na mapě → voda (řeky, jezera) ✅",
  visualExamples: [{ label: "Barvy na mapě", illustration: "🔵 Modrá → voda (řeky, jezera, moře)\n🟢 Zelená → nížiny, louky, lesy\n🟤 Hnědá → hory a kopce\n⚫ Černá → města, silnice, značky\n📏 Měřítko → vzdálenosti\n📜 Legenda → vysvětlivky" }],
};

export const ORIENTATION_TOPICS: TopicMetadata[] = [
  { id: "pr-directions", title: "Světové strany", subject: "prvouka", category: "Orientace v prostoru a čase", topic: "Orientace",
    topicDescription: "Naučíš se světové strany, orientaci na mapě a základní práci s mapou.",
    briefDescription: "Naučíš se 4 světové strany a kde na mapě najdeš sever, jih, východ a západ.",
    keywords: ["světové strany", "sever", "jih", "východ", "západ", "kompas", "mapa"],
    goals: ["Naučíš se pojmenovat světové strany a orientovat se na mapě."],
    boundaries: ["Pouze 4 základní světové strany", "Žádné zeměpisné souřadnice"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(DIRECTIONS_QUESTIONS), helpTemplate: HELP_DIR },
  { id: "pr-time-calendar", title: "Čas a kalendář", subject: "prvouka", category: "Orientace v prostoru a čase", topic: "Čas",
    topicDescription: "Naučíš se měřit čas, znát hodiny, dny v týdnu a měsíce v roce.",
    briefDescription: "Naučíš se hodiny, minuty, dny v týdnu a měsíce v roce.",
    keywords: ["čas", "hodiny", "minuty", "dny", "měsíce", "kalendář", "týden"],
    goals: ["Naučíš se základní jednotky času a orientaci v kalendáři."],
    boundaries: ["Pouze základní údaje", "Žádné časové zóny"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(TIME_QUESTIONS), helpTemplate: HELP_TIME },
  { id: "pr-time-order", title: "Pořadí dnů a měsíců", subject: "prvouka", category: "Orientace v prostoru a čase", topic: "Čas",
    topicDescription: "Naučíš se měřit čas, znát hodiny, dny v týdnu a měsíce v roce.",
    briefDescription: "Seřadíš dny v týdnu, měsíce v roce a části dne ve správném pořadí.",
    keywords: ["dny v týdnu", "pořadí dnů", "pořadí měsíců", "části dne"],
    goals: ["Naučíš se správné pořadí dnů, měsíců a částí dne."],
    boundaries: ["Pouze správné pořadí", "Žádné časové výpočty"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "drag_order",
    generator: genTimeOrder, helpTemplate: HELP_TIME_ORDER },
  { id: "pr-map-reading", title: "Jednoduchá mapa", subject: "prvouka", category: "Orientace v prostoru a čase", topic: "Orientace",
    topicDescription: "Naučíš se světové strany, orientaci na mapě a základní práci s mapou.",
    briefDescription: "Naučíš se číst jednoduchou mapu — barvy, značky, legendu a měřítko.",
    keywords: ["mapa", "legenda", "měřítko", "barvy na mapě", "orientace na mapě"],
    goals: ["Naučíš se základy čtení mapy — barvy, značky a měřítko."],
    boundaries: ["Pouze jednoduchá mapa", "Žádné GPS nebo digitální mapy"],
    gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
    generator: (_level) => mapQPoolToTasks(MAP_QUESTIONS), helpTemplate: HELP_MAP },
];
