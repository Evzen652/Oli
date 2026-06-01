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
  { question: "Co je Slunce?", correctAnswer: "Hvězda — žhavá koule plynu ve středu sluneční soustavy", options: ["Hvězda — žhavá koule plynu ve středu sluneční soustavy", "Planeta podobná Zemi", "Měsíc obíhající Zemi", "Velký kámen ve vesmíru"] },
  { question: "Kolik planet obíhá kolem Slunce v naší soustavě?", correctAnswer: "8 planet", options: ["8 planet", "7 planet", "9 planet", "10 planet"] },
  { question: "Která planeta je Slunci nejblíže?", correctAnswer: "Merkur", options: ["Merkur", "Venuše", "Země", "Mars"] },
  { question: "Na které planetě žijeme?", correctAnswer: "Země – 3. od Slunce", options: ["Země – 3. od Slunce", "Mars", "Venuše", "Jupiter"] },
  { question: "Jaký typ energie Slunce vydává?", correctAnswer: "Světelnou a tepelnou energii", options: ["Světelnou a tepelnou energii", "Jen světelnou energii", "Jen tepelnou energii", "Elektrickou energii"] },
  { question: "Co způsobuje střídání ročních období na Zemi?", correctAnswer: "Sklon zemské osy – 23,5°", options: ["Sklon zemské osy – 23,5°", "Vzdálenost Země od Slunce", "Rotace Měsíce kolem Země", "Teplota Slunce se mění"] },
  { question: "Za jak dlouho doletí světlo ze Slunce na Zemi?", correctAnswer: "Přibližně 8 minut", options: ["Přibližně 8 minut", "Přibližně 1 sekundu", "Přibližně 1 hodinu", "Přibližně 1 den"] },
  { question: "Jak se jmenuje největší planeta sluneční soustavy?", correctAnswer: "Jupiter", options: ["Jupiter", "Saturn", "Uran", "Neptun"] },
  { question: "Která planeta má prstence?", correctAnswer: "Saturn – nejznámější prstence", options: ["Saturn – nejznámější prstence", "Jupiter", "Mars", "Neptun"] },
  { question: "Jak se nazývá pohyb Země kolem Slunce?", correctAnswer: "Oběh – revoluce — trvá 1 rok", options: ["Oběh – revoluce — trvá 1 rok", "Rotace — trvá 1 den", "Revoluce — trvá 1 měsíc", "Orbitace — trvá 1 hodinu"] },
  { question: "Jak se nazývá pohyb Země kolem vlastní osy?", correctAnswer: "Rotace — trvá 24 hodin – 1 den", options: ["Rotace — trvá 24 hodin – 1 den", "Oběh — trvá 1 rok", "Cirkulace — trvá 1 měsíc", "Revoluce — trvá 1 den"] },
  { question: "Co jsou solární panely?", correctAnswer: "Zařízení přeměňující sluneční světlo na elektřinu", options: ["Zařízení přeměňující sluneční světlo na elektřinu", "Zrcadla odrážející sluneční světlo", "Zařízení ukládající teplo do vody", "Větráky poháněné větrem"] },
  { question: "Co je fotosyntéza?", correctAnswer: "Výroba cukru z CO₂ a vody pomocí sluneční energie v listech", options: ["Výroba cukru z CO₂ a vody pomocí sluneční energie v listech", "Dýchání rostlin kyslíkem", "Přijímání vody kořeny", "Odpaření vody z listů"] },
  { question: "Která planeta je nejdále od Slunce?", correctAnswer: "Neptun – 8. planeta", options: ["Neptun – 8. planeta", "Uran", "Saturn", "Pluto – není planeta"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaká je přibližná vzdálenost Země od Slunce?", correctAnswer: "Cca 150 milionů km", options: ["Cca 150 milionů km", "Cca 1 500 km", "Cca 1,5 miliardy km", "Cca 15 000 km"] },
  { question: "Jakou rychlostí se šíří světlo?", correctAnswer: "Cca 300 000 km/s", options: ["Cca 300 000 km/s", "Cca 3 000 km/s", "Cca 30 000 km/s", "Cca 3 000 000 km/s"] },
  { question: "Jak se Slunce produkuje energii?", correctAnswer: "Jadernou fúzí — slučování vodíku na helium", options: ["Jadernou fúzí — slučování vodíku na helium", "Spalováním uhlí a plynu", "Chemickými reakcemi kyslíku", "Elektromagnetickým polem"] },
  { question: "Vyjmenuj planety sluneční soustavy od Slunce správně.", correctAnswer: "Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", options: ["Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", "Merkur, Venuše, Mars, Země, Jupiter, Saturn, Uran, Neptun", "Venuše, Merkur, Země, Mars, Jupiter, Saturn, Uran, Neptun", "Merkur, Venuše, Země, Mars, Saturn, Jupiter, Uran, Neptun"] },
  { question: "Proč je v létě teplo a v zimě zima?", correctAnswer: "V létě dopadají paprsky šikměji – intenzivněji na naši polokouli díky sklonu osy", options: ["V létě dopadají paprsky šikměji – intenzivněji na naši polokouli díky sklonu osy", "V létě je Země blíže ke Slunci", "V zimě rotuje Země pomaleji", "V létě je den kratší"] },
  { question: "Co je sluneční energie a jak ji lidé využívají?", correctAnswer: "Energie vyzařovaná Sluncem — solární panely, sluneční kolektory, fotovoltaika", options: ["Energie vyzařovaná Sluncem — solární panely, sluneční kolektory, fotovoltaika", "Teplo uvnitř Země", "Energie větru způsobená Sluncem", "Energie přiváděná z kosmické stanice"] },
  { question: "Co je astronomická jednotka (AU)?", correctAnswer: "Vzdálenost Země-Slunce – cca 150 milionů km — měrná jednotka v astronomii", options: ["Vzdálenost Země-Slunce – cca 150 milionů km — měrná jednotka v astronomii", "Délka světelného roku", "Velikost Slunce", "Vzdálenost Měsíce od Země"] },
  { question: "Co jsou sluneční skvrny?", correctAnswer: "Tmavší – chladnější oblasti na povrchu Slunce s intenzivním magnetickým polem", options: ["Tmavší – chladnější oblasti na povrchu Slunce s intenzivním magnetickým polem", "Meteority narážející do Slunce", "Části Slunce bez jaderné fúze", "Tmavé mraky obklopující Slunce"] },
  { question: "Co je atmosféra Slunce (korona)?", correctAnswer: "Vnější obal Slunce — viditelný při úplném zatmění jako světelný věnec", options: ["Vnější obal Slunce — viditelný při úplném zatmění jako světelný věnec", "Vrstva vesmíru kolem Slunce", "Vzduchový obal Slunce podobný Zemi", "Magnetické pole Slunce"] },
  { question: "Proč Merkur nemá atmosféru?", correctAnswer: "Příliš blízko Slunci — gravitace nestačí atmosféru udržet a slunce ji rozfoukává", options: ["Příliš blízko Slunci — gravitace nestačí atmosféru udržet a slunce ji rozfoukává", "Je příliš malý na jakoukoli atmosféru", "Merkur atmosféru má — jen ji nevidíme", "Atmosféru nemá žádná planeta v soustavě"] },
  { question: "Co je letní slunovrat?", correctAnswer: "Nejdelší den v roce — slunce je nejvýše nad obzorem – 21. června u nás", options: ["Nejdelší den v roce — slunce je nejvýše nad obzorem – 21. června u nás", "Nejkratší den v roce", "Den, kdy je Země nejblíže Slunci", "Den, kdy je den a noc stejně dlouhý"] },
  { question: "Co je jarní rovnodennost?", correctAnswer: "Den, kdy je den a noc stejně dlouhý – ~20. března", options: ["Den, kdy je den a noc stejně dlouhý – ~20. března", "Nejdelší den roku", "Nejkratší den roku", "První den letního slunovratu"] },
  { question: "Jak daleko je Slunce od středu Mléčné dráhy?", correctAnswer: "Cca 26 000 světelných let — Slunce je na okraji galaxie", options: ["Cca 26 000 světelných let — Slunce je na okraji galaxie", "Slunce je ve středu Mléčné dráhy", "Cca 100 světelných let", "Cca 1 milion světelných let"] },
  { question: "Proč je Mars zvaný Rudá planeta?", correctAnswer: "Povrch obsahuje oxidy železa – rez — červenavý prach pokrývá povrch", options: ["Povrch obsahuje oxidy železa – rez — červenavý prach pokrývá povrch", "Mars září červeně jako hvězda", "Atmosféra Marsu je červená", "Mars je pokryt sopečnou lávou"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jaký je rozdíl mezi planetou a hvězdou?", correctAnswer: "Hvězda sama svítí jadernou fúzí; planeta svítí jen odraženým světlem a obíhá hvězdu", options: ["Hvězda sama svítí jadernou fúzí; planeta svítí jen odraženým světlem a obíhá hvězdu", "Planeta je větší než hvězda", "Hvězda obíhá planetu", "Hvězda a planeta jsou totéž, jen jinak velké"] },
  { question: "Vysvětli, proč roční období nejsou způsobena vzdáleností Země od Slunce.", correctAnswer: "Vzdálenost se mění jen málo; příčinou je 23,5° sklon osy — mění se úhel dopadu slunečních paprsků", options: ["Vzdálenost se mění jen málo; příčinou je 23,5° sklon osy — mění se úhel dopadu slunečních paprsků", "Vzdálenost Země od Slunce způsobuje sezóny", "Sklon osy nesouvisí s ročními obdobími", "Roční období způsobuje Měsíc"] },
  { question: "Co je světelný rok?", correctAnswer: "Vzdálenost, kterou světlo urazí za 1 rok — cca 9,46 × 10¹² km", options: ["Vzdálenost, kterou světlo urazí za 1 rok — cca 9,46 × 10¹² km", "Doba, za níž Slunce oběhne galaxii", "Rychlost světla za sekundu", "Čas potřebný pro světlo ze Slunce na Zemi"] },
  { question: "Proč Venuše nemá měsíce, přestože je podobná Zemi?", correctAnswer: "Pravděpodobně chybí velká srážka, která by měsíc vytvořila; Venuše rotuje velmi pomalu a pozpátku", options: ["Pravděpodobně chybí velká srážka, která by měsíc vytvořila; Venuše rotuje velmi pomalu a pozpátku", "Venuše je příliš daleko od Slunce", "Měsíce mají jen planety za Marsem", "Venuše je příliš malá na gravitaci potřebnou pro měsíc"] },
  { question: "Co jsou asteroidy a kde se nacházejí?", correctAnswer: "Skalní tělesa obíhající Slunce — pás asteroidů leží mezi Marsem a Jupiterem", options: ["Skalní tělesa obíhající Slunce — pás asteroidů leží mezi Marsem a Jupiterem", "Malé planety mimo naši soustavu", "Kusy odlomené od Měsíce", "Meteority v atmosféře Země"] },
  { question: "Proč Jupiter pomáhá chránit Zemi?", correctAnswer: "Jeho obrovská gravitace zachytává nebo odklání meteority a komety namířené k vnitřní soustavě", options: ["Jeho obrovská gravitace zachytává nebo odklání meteority a komety namířené k vnitřní soustavě", "Jupiter vysílá magnetické pole bránící úderům", "Jupiter absorbuje záření Slunce", "Jupiter nemá na Zemi vliv"] },
  { question: "Co je heliocentrický model sluneční soustavy?", correctAnswer: "Model, kde je Slunce ve středu a planety ho obíhají – navrhnutý Koperníkem", options: ["Model, kde je Slunce ve středu a planety ho obíhají – navrhnutý Koperníkem", "Model, kde je Země ve středu a Slunce obíhá Zemi", "Geocentrický model Ptolemaia", "Model, kde nic neobíhá nic"] },
  { question: "Jak vznikají zatmění Slunce?", correctAnswer: "Měsíc se dostane přesně mezi Zemi a Slunce — zakryje ho ze Země viditelný disk Slunce", options: ["Měsíc se dostane přesně mezi Zemi a Slunce — zakryje ho ze Země viditelný disk Slunce", "Země se dostane mezi Slunce a Měsíc", "Slunce přejde za Měsícem z pohledu Země", "Slunce se zatmí samo při slunovratech"] },
  { question: "Co je sluneční vítr?", correctAnswer: "Proud nabitých částic – plazma vycházející ze Slunce do celé sluneční soustavy", options: ["Proud nabitých částic – plazma vycházející ze Slunce do celé sluneční soustavy", "Silný vítr způsobený gravitací Slunce", "Infračervené záření Slunce", "Pohyb vzduchu na Zemi způsobený Sluncem"] },
  { question: "Co je polární záře (aurora) a jak vzniká?", correctAnswer: "Světelný jev způsobený srážkami nabitých částic slunečního větru s atmosférou u magnetických pólů", options: ["Světelný jev způsobený srážkami nabitých částic slunečního větru s atmosférou u magnetických pólů", "Odraz světla od sněhu v Arktidě", "Záře způsobená vulkanickým výbuchem", "Odraz slunečních paprsků od oceánu"] },
  { question: "Proč planety obíhají Slunce po elipse, ne po kruhu?", correctAnswer: "Gravitace a počáteční impulz při vzniku soustavy způsobily eliptické dráhy – Keplerovy zákony", options: ["Gravitace a počáteční impulz při vzniku soustavy způsobily eliptické dráhy – Keplerovy zákony", "Slunce se pohybuje, proto jsou dráhy eliptické", "Planety obíhají po dokonalém kruhu", "Gravitace ostatních planet způsobuje elipsu"] },
  { question: "Jak přispívá Slunce ke koloběhu vody?", correctAnswer: "Ohřívá vodní plochy a způsobuje výpar — pohání celý hydrologický cyklus", options: ["Ohřívá vodní plochy a způsobuje výpar — pohání celý hydrologický cyklus", "Slunce vyrábí vodu z vodíku a kyslíku", "Slunce přitahuje vodu gravitací", "Slunce nemá přímý vliv na koloběh vody"] },
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
    briefDescription: "Poznáš planety sluneční soustavy a pochopíš, proč je Slunce zdrojem energie pro Zemi.",
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
