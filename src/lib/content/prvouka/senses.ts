import type { TopicMetadata, HelpData } from "../../types";
import { mapQPoolToTasks, type QPool } from "../helpers";

const SENSES_QUESTIONS: QPool[] = [
  { question: "👁️ Kterým smyslem vnímáme barvy?", correct: "Zrak", options: ["Zrak", "Sluch", "Hmat", "Čich"], hints: ["Barvy vidíme — kterým smyslem?", "Barvy vnímáme očima. Jak se ten smysl jmenuje?"] },
  { question: "👂 Kterým smyslem slyšíme hudbu?", correct: "Sluch", options: ["Sluch", "Zrak", "Chuť", "Hmat"], hints: ["Hudbu slyšíme ušima — jak se ten smysl jmenuje?", "Uši slouží ke slyšení. Který smysl to je?"] },
  { question: "👅 Kterým smyslem poznáme, že je jídlo sladké?", correct: "Chuť", options: ["Chuť", "Čich", "Hmat", "Zrak"], hints: ["Sladké poznáš, když ochutnáš — jaký smysl používáš?", "Jazyk rozlišuje chutě. Jak se ten smysl jmenuje?"] },
  { question: "✋ Kterým smyslem poznáme, že je předmět horký?", correct: "Hmat", options: ["Hmat", "Zrak", "Čich", "Chuť"], hints: ["Teplotu cítíš kůží, když se něčeho dotkneš. Jaký je to smysl?", "Rukama a kůží vnímáme dotyk, teplotu a bolest — to je…"] },
  { question: "👃 Kterým smyslem cítíme vůni květin?", correct: "Čich", options: ["Čich", "Chuť", "Hmat", "Sluch"], hints: ["Vůni cítíme nosem. Jak se ten smysl jmenuje?", "Nos slouží k rozlišování vůní a pachů — to je smysl…"] },
  { question: "👁️ Který orgán patří ke smyslu zraku?", correct: "Oko", options: ["Oko", "Ucho", "Nos", "Jazyk"], hints: ["Zrak = vidění. Čím vidíme?", "Smysl zraku patří k orgánu, kterým se díváme."] },
  { question: "👂 Který orgán patří ke smyslu sluchu?", correct: "Ucho", options: ["Ucho", "Oko", "Nos", "Ruka"], hints: ["Sluch = slyšení. Čím slyšíme?", "Zvuky zachycujeme orgánem po stranách hlavy."] },
  { question: "🧊 Čím poznáš, že je led studený?", correct: "Hmatem (kůží)", options: ["Hmatem (kůží)", "Zrakem", "Sluchem", "Chutí"], hints: ["Když se dotkneš ledu, cítíš chlad. Čím to vnímáš?", "Teplotu vnímáme kůží — jak se ten smysl jmenuje?"] },
  { question: "🍋 Čím poznáš, že je citrón kyselý?", correct: "Chutí", options: ["Chutí", "Čichem", "Zrakem", "Hmatem"], hints: ["Kyselost poznáš, když ochutnáš. Jaký smysl to je?", "Jazyk rozlišuje: sladké, kyselé, slané, hořké — to je smysl…"] },
  { question: "🔔 Čím poznáš, že zvoní zvonek?", correct: "Sluchem", options: ["Sluchem", "Zrakem", "Čichem", "Hmatem"], hints: ["Zvonění je zvuk — čím ho zachytíš?", "Zvuky slyšíme ušima. Jak se ten smysl jmenuje?"] },
  // Nové otázky
  { question: "🌹 Čím poznáš, že růže voní?", correct: "Čichem", options: ["Čichem", "Zrakem", "Chutí", "Hmatem"], hints: ["Vůni vnímáme nosem. Jaký smysl to je?", "Nos = čich. Čichem rozlišíme vůně."] },
  { question: "👁️ Kolik smyslů má člověk?", correct: "5", options: ["5", "3", "6", "4"], hints: ["Zrak, sluch, čich, chuť a… jaký je pátý?", "5 smyslů: zrak, sluch, čich, chuť, hmat."] },
  { question: "🎵 Čím vnímáme, jestli je zvuk hlasitý nebo tichý?", correct: "Sluchem", options: ["Sluchem", "Hmatem", "Zrakem", "Čichem"], hints: ["Hlasitost je vlastnost zvuku. Čím vnímáme zvuky?", "Uši = sluch. Sluchem rozlišujeme tiché a hlasité zvuky."] },
  { question: "🍫 Čím poznáš, že čokoláda chutná sladce?", correct: "Chutí", options: ["Chutí", "Čichem", "Hmatem", "Zrakem"], hints: ["Sladkost poznáš, když si dáš kousek do úst.", "Jazyk rozlišuje chutě — sladké, kyselé, slané, hořké."] },
  { question: "🧤 Čím poznáš, že rukavice je měkká?", correct: "Hmatem", options: ["Hmatem", "Zrakem", "Sluchem", "Čichem"], hints: ["Když se dotýkáš rukavice, cítíš, jestli je měkká nebo tvrdá.", "Měkkost vnímáme dotykem = hmatem."] },
  { question: "👃 Čím poznáš, že se v kuchyni peče koláč?", correct: "Čichem", options: ["Čichem", "Zrakem", "Sluchem", "Hmatem"], hints: ["Vůně koláče se šíří z kuchyně. Čím ji zachytíš?", "Nos zachytí vůni pečení — to je čich."] },
  { question: "👁️ Který smysl ti pomáhá při čtení?", correct: "Zrak", options: ["Zrak", "Sluch", "Hmat", "Chuť"], hints: ["Při čtení se díváš na písmena. Jaký smysl používáš?", "Čtení = díváme se na text = zrak."] },
  { question: "🎸 Který smysl používáš při poslechu pohádky?", correct: "Sluch", options: ["Sluch", "Zrak", "Čich", "Hmat"], hints: ["Pohádku posloucháš ušima. Jaký je to smysl?", "Poslech = uši = sluch."] },
  { question: "🧊 Čím poznáš, že povrch stolu je hladký?", correct: "Hmatem", options: ["Hmatem", "Zrakem", "Chutí", "Sluchem"], hints: ["Přejedeš rukou po stole — cítíš, jestli je hladký nebo drsný.", "Hladkost a drsnost vnímáme dotykem = hmatem."] },
  { question: "🫒 Jaké jsou 4 základní chutě?", correct: "Sladká, kyselá, slaná, hořká", options: ["Sladká, kyselá, slaná, hořká", "Teplá, studená, měkká, tvrdá", "Červená, zelená, modrá, žlutá", "Hlasitá, tichá, rychlá, pomalá"], hints: ["Jazyk rozlišuje 4 základní chutě. Jaké?", "Cukr je sladký, citrón kyselý, sůl slaná, káva hořká."] },
];

const HELP: HelpData = {
  hint: "Máme 5 smyslů: zrak, sluch, čich, chuť a hmat.",
  steps: ["Přečti si, co máš poznat nebo vnímat.", "Přemýšlej — potřebuji k tomu oči, uši, nos, jazyk, nebo ruce?", "Vyber správný smysl."],
  commonMistake: "Záměna čichu a chuti — nos je na vůně, jazyk na chutě.",
  example: "🍋 Čím poznáš, že je citrón kyselý? → Chutí ✅",
  visualExamples: [{ label: "5 smyslů", illustration: "👁️ Zrak → OČI (barvy, tvary)\n👂 Sluch → UŠI (zvuky, hudba)\n👃 Čich → NOS (vůně, pachy)\n👅 Chuť → JAZYK (sladké, kyselé)\n✋ Hmat → KŮŽE (teplé, studené)" }],
};

export const SENSES_TOPICS: TopicMetadata[] = [{
  id: "pr-senses", title: "Smysly", subject: "prvouka", category: "Člověk a jeho tělo", topic: "Smysly",
  briefDescription: "Poznáš 5 smyslů a jejich orgány — zrak, sluch, čich, chuť a hmat.",
  keywords: ["smysly", "zrak", "sluch", "čich", "chuť", "hmat", "oči", "uši"],
  goals: ["Naučíš se rozlišit 5 lidských smyslů a přiřadit je ke správným orgánům."],
  boundaries: ["Pouze 5 základních smyslů", "Žádná biologie smyslových orgánů"],
  gradeRange: [3, 3], practiceType: "result_only", defaultLevel: 1, inputType: "select_one",
  generator: (_level) => mapQPoolToTasks(SENSES_QUESTIONS), helpTemplate: HELP,
}];
