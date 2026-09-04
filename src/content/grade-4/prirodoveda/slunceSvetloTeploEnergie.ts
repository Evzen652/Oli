import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Co je Slunce?", correctAnswer: "Hvězda ve středu soustavy", options: ["Hvězda ve středu soustavy", "Planeta podobná Zemi", "Měsíc obíhající Zemi", "Velký kámen ve vesmíru"] },
  { question: "Kolik planet obíhá kolem Slunce v naší soustavě?", correctAnswer: "8 planet", options: ["7 planet", "8 planet", "9 planet", "10 planet"] },
  { question: "Která planeta je Slunci nejblíže?", correctAnswer: "Merkur", options: ["Venuše", "Země", "Merkur", "Mars"] },
  { question: "Na které planetě žijeme?", correctAnswer: "Země", options: ["Mars", "Venuše", "Jupiter", "Země"] },
  { question: "Jaký typ energie Slunce vydává?", correctAnswer: "Světelnou a tepelnou energii", options: ["Světelnou a tepelnou energii", "Jen světelnou energii", "Jen tepelnou energii", "Elektrickou energii"] },
  { question: "Co způsobuje střídání ročních období na Zemi?", correctAnswer: "Sklon zemské osy – 23,5°", options: ["Vzdálenost Země od Slunce", "Sklon zemské osy – 23,5°", "Rotace Měsíce kolem Země", "Teplota Slunce se mění"] },
  { question: "Za jak dlouho doletí světlo ze Slunce na Zemi?", correctAnswer: "Přibližně 8 minut", options: ["Přibližně 1 sekundu", "Přibližně 1 hodinu", "Přibližně 8 minut", "Přibližně 1 den"] },
  { question: "Jak se jmenuje největší planeta sluneční soustavy?", correctAnswer: "Jupiter", options: ["Saturn", "Uran", "Neptun", "Jupiter"] },
  { question: "Která planeta má prstence?", correctAnswer: "Saturn", options: ["Saturn", "Jupiter", "Mars", "Neptun"] },
  { question: "Jak se nazývá pohyb Země kolem Slunce?", correctAnswer: "Oběh – revoluce — trvá 1 rok", options: ["Rotace — trvá 1 den", "Oběh – revoluce — trvá 1 rok", "Revoluce — trvá 1 měsíc", "Orbitace — trvá 1 hodinu"] },
  { question: "Jak se nazývá pohyb Země kolem vlastní osy?", correctAnswer: "Rotace — trvá 24 hodin – 1 den", options: ["Oběh — trvá 1 rok", "Cirkulace — trvá 1 měsíc", "Rotace — trvá 24 hodin – 1 den", "Revoluce — trvá 1 den"] },
  { question: "Co jsou solární panely?", correctAnswer: "Zařízení přeměňující sluneční světlo na elektřinu", options: ["Zrcadla odrážející sluneční světlo", "Zařízení ukládající teplo do vody", "Větráky poháněné větrem", "Zařízení přeměňující sluneční světlo na elektřinu"] },
  { question: "Co je fotosyntéza?", correctAnswer: "Výroba cukru ze světla", options: ["Výroba cukru ze světla", "Dýchání rostlin kyslíkem", "Přijímání vody kořeny", "Odpaření vody z listů"] },
  { question: "Která planeta je nejdále od Slunce?", correctAnswer: "Neptun – 8. planeta", options: ["Uran", "Neptun – 8. planeta", "Saturn", "Pluto – není planeta"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaká je přibližná vzdálenost Země od Slunce?", correctAnswer: "Cca 150 milionů km", options: ["Cca 1 500 km", "Cca 1,5 miliardy km", "Cca 150 milionů km", "Cca 15 000 km"] },
  { question: "Jakou rychlostí se šíří světlo?", correctAnswer: "Cca 300 000 km/s", options: ["Cca 3 000 km/s", "Cca 30 000 km/s", "Cca 3 000 000 km/s", "Cca 300 000 km/s"] },
  { question: "Jak se Slunce produkuje energii?", correctAnswer: "Jadernou fúzí — slučování vodíku na helium", options: ["Jadernou fúzí — slučování vodíku na helium", "Spalováním uhlí a plynu", "Chemickými reakcemi kyslíku", "Elektromagnetickým polem"] },
  { question: "Vyjmenuj planety sluneční soustavy od Slunce správně.", correctAnswer: "Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", options: ["Merkur, Venuše, Mars, Země, Jupiter, Saturn, Uran, Neptun", "Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", "Venuše, Merkur, Země, Mars, Jupiter, Saturn, Uran, Neptun", "Merkur, Venuše, Země, Mars, Saturn, Jupiter, Uran, Neptun"] },
  { question: "Proč je v létě teplo a v zimě zima?", correctAnswer: "V létě dopadají paprsky strměji", options: ["V létě je Země blíže ke Slunci", "V zimě rotuje Země pomaleji", "V létě dopadají paprsky strměji", "V létě je den kratší než v zimě"] },
  { question: "Co je sluneční energie a jak ji lidé využívají?", correctAnswer: "Energie vyzařovaná Sluncem", options: ["Teplo z nitra Země", "Energie větru způsobená Sluncem", "Energie z kosmické stanice", "Energie vyzařovaná Sluncem"] },
  { question: "Co je astronomická jednotka (AU)?", correctAnswer: "Vzdálenost Země od Slunce", options: ["Vzdálenost Země od Slunce", "Délka světelného roku", "Velikost Slunce v kilometrech", "Vzdálenost Měsíce od Země"] },
  { question: "Co jsou sluneční skvrny?", correctAnswer: "Chladnější místa na povrchu", options: ["Meteority narážející do Slunce", "Chladnější místa na povrchu", "Části Slunce bez jaderné fúze", "Tmavé mraky obklopující Slunce"] },
  { question: "Co je atmosféra Slunce (korona)?", correctAnswer: "Vnější obal Slunce", options: ["Vrstva vesmíru kolem Slunce", "Vzduchový obal jako u Země", "Vnější obal Slunce", "Magnetické pole Slunce"] },
  { question: "Proč Merkur nemá atmosféru?", correctAnswer: "Je blízko Slunci a málo hmotný", options: ["Je příliš malý na jakoukoli atmosféru", "Merkur atmosféru má, jen ji nevidíme", "Atmosféru nemá žádná planeta", "Je blízko Slunci a málo hmotný"] },
  { question: "Co je letní slunovrat?", correctAnswer: "Nejdelší den v roce", options: ["Nejdelší den v roce", "Nejkratší den v roce", "Den, kdy je Země nejblíže Slunci", "Den, kdy je den a noc stejně dlouhý"] },
  { question: "Co je jarní rovnodennost?", correctAnswer: "Den, kdy je den a noc stejně dlouhý – ~20. března", options: ["Nejdelší den roku", "Den, kdy je den a noc stejně dlouhý – ~20. března", "Nejkratší den roku", "První den letního slunovratu"] },
  { question: "Jak daleko je Slunce od středu Mléčné dráhy?", correctAnswer: "Cca 26 000 světelných let — Slunce je na okraji galaxie", options: ["Slunce je ve středu Mléčné dráhy", "Cca 100 světelných let", "Cca 26 000 světelných let — Slunce je na okraji galaxie", "Cca 1 milion světelných let"] },
  { question: "Proč je Mars zvaný Rudá planeta?", correctAnswer: "Povrch pokrývá rezavý prach", options: ["Mars září červeně jako hvězda", "Atmosféra Marsu je červená", "Mars je pokryt sopečnou lávou", "Povrch pokrývá rezavý prach"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jaký je rozdíl mezi planetou a hvězdou?", correctAnswer: "Hvězda sama svítí jadernou fúzí; planeta svítí jen odraženým světlem a obíhá hvězdu", options: ["Hvězda sama svítí jadernou fúzí; planeta svítí jen odraženým světlem a obíhá hvězdu", "Planeta je větší než hvězda", "Hvězda obíhá planetu", "Hvězda a planeta jsou totéž, jen jinak velké"] },
  { question: "Vysvětli, proč roční období nejsou způsobena vzdáleností Země od Slunce.", correctAnswer: "Příčinou je sklon zemské osy", options: ["Vzdálenost Země od Slunce", "Příčinou je sklon zemské osy", "Sklon osy s tím nesouvisí", "Roční období způsobuje Měsíc"] },
  { question: "Co je světelný rok?", correctAnswer: "Vzdálenost, kterou světlo urazí za 1 rok — cca 9,46 × 10¹² km", options: ["Doba, za níž Slunce oběhne galaxii", "Rychlost světla za sekundu", "Vzdálenost, kterou světlo urazí za 1 rok — cca 9,46 × 10¹² km", "Čas potřebný pro světlo ze Slunce na Zemi"] },
  { question: "Proč Venuše nemá měsíce, přestože je podobná Zemi?", correctAnswer: "Pravděpodobně chybí velká srážka, která by měsíc vytvořila; Venuše rotuje velmi pomalu a pozpátku", options: ["Venuše je příliš daleko od Slunce", "Měsíce mají jen planety za Marsem", "Venuše je příliš malá na gravitaci potřebnou pro měsíc", "Pravděpodobně chybí velká srážka, která by měsíc vytvořila; Venuše rotuje velmi pomalu a pozpátku"] },
  { question: "Co jsou asteroidy a kde se nacházejí?", correctAnswer: "Skalní tělesa mezi Marsem a Jupiterem", options: ["Skalní tělesa mezi Marsem a Jupiterem", "Malé planety mimo naši soustavu", "Kusy odlomené od Měsíce", "Meteority v atmosféře Země"] },
  { question: "Proč Jupiter pomáhá chránit Zemi?", correctAnswer: "Gravitací odklání meteority", options: ["Vysílá magnetické pole", "Gravitací odklání meteority", "Pohlcuje záření Slunce", "Nemá na Zemi žádný vliv"] },
  { question: "Co je heliocentrický model sluneční soustavy?", correctAnswer: "Model, kde je Slunce ve středu a planety ho obíhají – navrhnutý Koperníkem", options: ["Model, kde je Země ve středu a Slunce obíhá Zemi", "Geocentrický model Ptolemaia", "Model, kde je Slunce ve středu a planety ho obíhají – navrhnutý Koperníkem", "Model, kde nic neobíhá nic"] },
  { question: "Jak vznikají zatmění Slunce?", correctAnswer: "Měsíc se dostane mezi Zemi a Slunce", options: ["Země se dostane mezi Slunce a Měsíc", "Slunce přejde za Měsícem", "Slunce se zatmí samo", "Měsíc se dostane mezi Zemi a Slunce"] },
  { question: "Co je sluneční vítr?", correctAnswer: "Proud částic ze Slunce", options: ["Proud částic ze Slunce", "Vítr způsobený gravitací Slunce", "Infračervené záření Slunce", "Pohyb vzduchu na Zemi"] },
  { question: "Co je polární záře (aurora) a jak vzniká?", correctAnswer: "Srážky částic s atmosférou u pólů", options: ["Odraz světla od sněhu v Arktidě", "Srážky částic s atmosférou u pólů", "Záře od vulkanického výbuchu", "Odraz paprsků od oceánu"] },
  { question: "Proč planety obíhají Slunce po elipse, ne po kruhu?", correctAnswer: "Působí gravitace a počáteční pohyb", options: ["Slunce planety odpuzuje", "Kruhová dráha je nemožná", "Působí gravitace a počáteční pohyb", "Planety mění dráhu každý rok"] },
  { question: "Jak přispívá Slunce ke koloběhu vody?", correctAnswer: "Ohřívá vodní plochy a způsobuje výpar — pohání celý hydrologický cyklus", options: ["Slunce vyrábí vodu z vodíku a kyslíku", "Slunce přitahuje vodu gravitací", "Slunce nemá přímý vliv na koloběh vody", "Ohřívá vodní plochy a způsobuje výpar — pohání celý hydrologický cyklus"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 40);
}

export const SLUNCESVETLOTEPLOENERGIE: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-slunce-svetlo-teplo-energie",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-neziva-priroda-slunce-svetlo-teplo-energie",
    title: "Slunce, světlo, teplo, energie",
    studentTitle: "Slunce a vesmír",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš planety sluneční soustavy a proč je Slunce zdrojem energie.",
    keywords: ["Slunce", "planety", "sluneční soustava", "energie", "světlo", "teplo", "fotosyntéza", "roční období"],
    goals: [
      "Vyjmenovat planety sluneční soustavy ve správném pořadí",
      "Vysvětlit, proč Slunce je hvězda",
      "Popsat zdroje energie Slunce (jaderná fúze)",
      "Vysvětlit příčinu ročních období (sklon osy)",
    ],
    boundaries: ["Detailní fyzika jaderné fúze není náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Planety: Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun (zkratka: 'My Velmi Zkušení Muži Jedeme Stále Usilovně Napřed').",
      steps: [
        "1. Slunce = hvězda, střed sluneční soustavy.",
        "2. Energie: jaderná fúze (vodík → helium).",
        "3. Roční období: sklon osy 23,5°, ne vzdálenost.",
        "4. Světlo: 300 000 km/s, ze Slunce za 8 minut.",
      ],
      commonMistake: "Roční období nejsou způsobena vzdáleností od Slunce, ale sklonem zemské osy.",
      example: "V létě je osa nakloněna k Slunci — paprsky dopadají příměji a ohřívají víc.",
    },
  },
];
