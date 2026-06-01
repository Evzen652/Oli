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
  { question: "Jaký je tvar Země?", correctAnswer: "Geoid – zploštělá koule", options: ["Geoid – zploštělá koule", "Dokonalá koule", "Disk", "Elipsa"], hints: ["Země je trochu zploštělá u pólů."] },
  { question: "Jak dlouho trvá jedna rotace Země kolem své osy?", correctAnswer: "24 hodin – jeden den", options: ["24 hodin (jeden den)", "365 dní", "12 hodin", "7 dní"], hints: ["Rotace způsobuje střídání dne a noci."] },
  { question: "Co způsobuje střídání dne a noci?", correctAnswer: "Rotace Země kolem vlastní osy", options: ["Rotace Země kolem vlastní osy", "Oběh Země kolem Slunce", "Pohyb Měsíce kolem Země", "Sklon zemské osy"], hints: ["Den a noc se mění každých 24 hodin."] },
  { question: "Jak dlouho trvá jeden oběh Země kolem Slunce?", correctAnswer: "365,25 dne – jeden rok", options: ["365,25 dne (jeden rok)", "24 hodin", "30 dní", "12 hodin"], hints: ["Proto máme přestupný rok každé 4 roky."] },
  { question: "Co způsobuje střídání ročních období?", correctAnswer: "Sklon zemské osy – 23,5° při oběhu kolem Slunce", options: ["Sklon zemské osy (23,5°) při oběhu kolem Slunce", "Vzdálenost Země od Slunce", "Rotace Země kolem osy", "Pohyb Měsíce"], hints: ["V zimě je severní polokoule odkloněná od Slunce."] },
  { question: "Kdy nastává nejdelší den v roce na severní polokouli?", correctAnswer: "21. června – letní slunovrat", options: ["21. června (letní slunovrat)", "21. prosince", "21. března", "23. září"], hints: ["V létě je severní polokoule nakloněná ke Slunci."] },
  { question: "Co je to přestupný rok?", correctAnswer: "Rok s 366 dny, vyskytuje se každé 4 roky", options: ["Rok s 366 dny, vyskytuje se každé 4 roky", "Rok s 364 dny", "Rok, kdy se mění časová pásma", "Rok, kdy je Slunce nejblíže Zemi"], hints: ["Přibývá 29. únor."] },
  { question: "Kolik časových pásem má Země?", correctAnswer: "24 časových pásem", options: ["24 časových pásem", "12 časových pásem", "36 časových pásem", "10 časových pásem"], hints: ["Každé pásmo odpovídá 15° zeměpisné délky."] },
  { question: "Co je rovnodennost?", correctAnswer: "Den, kdy je den stejně dlouhý jako noc – 21. března a 23. září", options: ["Den, kdy je den stejně dlouhý jako noc (21. března a 23. září)", "Den, kdy je nejdelší noc v roce", "Den, kdy Slunce svítí nejsilněji", "Den, kdy začíná přestupný rok"], hints: ["Rovnodennost = stejně dlouhý den i noc."] },
  { question: "Jak velký je obvod rovníku Země přibližně?", correctAnswer: "40 075 km", options: ["40 075 km", "12 742 km", "6 371 km", "100 000 km"], hints: ["Průměr Země je asi 12 742 km."] },
  { question: "V jakém časovém pásmu leží Česká republika?", correctAnswer: "SEČ – UTC+1, v létě SELČ – UTC+2", options: ["SEČ (UTC+1), v létě SELČ (UTC+2)", "UTC+0 celoročně", "UTC+3", "UTC-1"], hints: ["Česká republika je ve střední Evropě."] },
  { question: "Kdy nastává zimní slunovrat na severní polokouli?", correctAnswer: "21. prosince – nejkratší den", options: ["21. prosince (nejkratší den)", "21. června", "23. září", "21. března"], hints: ["V zimě je severní polokoule odkloněná od Slunce."] },
  { question: "Jak se pohybuje Slunce po obloze každý den?", correctAnswer: "Vychází na východě, přechází přes jih a zapadá na západě", options: ["Vychází na východě, přechází přes jih a zapadá na západě", "Vychází na severu a zapadá na jihu", "Pohybuje se ze západu na východ", "Zůstává na místě a Země se otáčí kolem něj"], hints: ["Je to zdánlivý pohyb – ve skutečnosti se otáčí Země."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč je Země zploštělá u pólů a vydutá u rovníku?", correctAnswer: "Odstředivá síla způsobená rotací Země způsobuje zploštění u pólů a vydutí u rovníku", options: ["Odstředivá síla způsobená rotací Země způsobuje zploštění u pólů a vydutí u rovníku", "Gravitace Měsíce táhne Zemi ze stran", "Zemské nitro je tekuté a vytlačuje povrch", "Je to způsobeno srážkami s asteroidy v minulosti"], hints: ["Rotace způsobuje odstředivou sílu – nejsilnější na rovníku."] },
  { question: "Proč je v létě na severní polokouli teplo, zatímco na jižní je zima?", correctAnswer: "Severní polokoule je v létě nakloněna ke Slunci – dopadá na ni více světla pod menším úhlem", options: ["Severní polokoule je v létě nakloněna ke Slunci – dopadá na ni více světla pod menším úhlem", "V létě je Země blíže ke Slunci", "Sluneční paprsky jsou v létě intenzivnější", "Atmosféra lépe propouští světlo v létě"], hints: ["Sklon osy = 23,5°. Paprsky pod ostrým úhlem zahřívají méně."] },
  { question: "Jak se mění délka dne v průběhu roku na severní polokouli?", correctAnswer: "Od nejkratšího dne – 21. 12. přes rovnodennost – 21. 3. k nejdelšímu dni – 21. 6. a zpět", options: ["Od nejkratšího dne (21. 12.) přes rovnodennost (21. 3.) k nejdelšímu dni (21. 6.) a zpět", "Den je celoročně stejně dlouhý na severní polokouli", "Den se prodlužuje jen v létě, v zimě zůstává stálý", "Nejkratší den je 23. 9. a nejdelší 21. 3."], hints: ["Sklon zemské osy způsobuje, že Slunce stoupá v létě výše nad obzor."] },
  { question: "Co je to greenwichský poledník a k čemu slouží?", correctAnswer: "Nultý poledník – 0° délky procházející Greenwich u Londýna – základ pro určení časových pásem", options: ["Nultý poledník (0° délky) procházející Greenwich u Londýna – základ pro určení časových pásem", "Poledník oddělující Evropu od Asie", "Datumová hranice mezinárodní datové linie", "Poledník určující polohu severního magnetického pólu"], hints: ["Každé časové pásmo je posunuto o 1 hodinu a 15° zeměpisné délky."] },
  { question: "Proč musíme přidávat 29. únor každé 4 roky?", correctAnswer: "Rok trvá 365,25 dne – čtvrt dne se za 4 roky nasčítá na celý den navíc – 29. únor", options: ["Rok trvá 365,25 dne – čtvrt dne se za 4 roky nasčítá na celý den navíc (29. únor)", "Měsíc má nepravidelný oběh a způsobuje nerovnoměrnost", "Slunce se mírně zpomaluje, proto potřebujeme korekci", "Přestupný rok byl zvykový svátek v Antickém Řecku"], hints: ["365 × 4 = 1 460 dní, ale skutečně uběhne 1 461 dní – proto 29. únor."] },
  { question: "Proč jsou noci v zimě delší než v létě?", correctAnswer: "Zemská osa je nakloněna – v zimě míří severní polokoule od Slunce, takže Slunce svítí méně hodin", options: ["Zemská osa je nakloněna – v zimě míří severní polokoule od Slunce, takže Slunce svítí méně hodin", "Země se v zimě otáčí pomaleji", "Slunce vychází dřív v létě než v zimě kvůli jiné dráze", "Atmosféra absorbuje světlo delší dobu v zimě"], hints: ["Sklon osy: 23,5°. Čím více nakloněno od Slunce, tím kratší den."] },
  { question: "Na severním pólu je 6 měsíců nepřetržité noci. Proč?", correctAnswer: "Severní pól je v zimě zcela odvrácen od Slunce kvůli sklonu osy – ani rotace Země ho nepřiblíží ke Slunci", options: ["Severní pól je v zimě zcela odvrácen od Slunce kvůli sklonu osy – ani rotace Země ho nepřiblíží ke Slunci", "Sever leží za atmosférou, která blokuje světlo", "Magnetické pole odráží sluneční světlo od pólů", "Na pólu se Země neotáčí, proto tam není den ani noc"], hints: ["Polární noc a polární den jsou extrémní důsledky sklonu zemské osy."] },
  { question: "Jak se liší rotace od oběhu Země?", correctAnswer: "Rotace = otočení Země kolem vlastní osy – 24 h, oběh = pohyb Země kolem Slunce – 365,25 dne", options: ["Rotace = otočení Země kolem vlastní osy (24 h), oběh = pohyb Země kolem Slunce (365,25 dne)", "Rotace = pohyb kolem Slunce, oběh = otočení kolem osy", "Obě jsou stejné, jen různá slova", "Rotace trvá rok, oběh trvá den"], hints: ["Rotace → den/noc. Oběh → rok."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli, proč v létě na severní polokouli je teplo, ačkoli je Země v létě ve skutečnosti dál od Slunce než v zimě.", correctAnswer: "Roční období závisí na sklonu osy – 23,5°, nikoli na vzdálenosti. V létě dopadají paprsky kolměji → více energie na m². V zimě je Země blíže, ale paprsky dopadají šikmo.", options: ["Roční období závisí na sklonu osy (23,5°), nikoli na vzdálenosti. V létě dopadají paprsky kolměji → více energie na m². V zimě je Země blíže, ale paprsky dopadají šikmo.", "V létě je Země blíže ke Slunci, to způsobuje teplo.", "Vzdálenost i sklon osy se kompenzují – výsledek je teplo v létě.", "Atmosféra lépe propouští světlo v létě než v zimě."], hints: ["Klíč je úhel dopadajících paprsků, ne vzdálenost."] },
  { question: "Jak by se změnil život na Zemi, kdyby zemská osa nebyla nakloněna?", correctAnswer: "Neexistovala by roční období – na celé Zemi by byl stále stejný klimatický vzorec. Den by byl vždy stejně dlouhý jako noc – 12 h/12 h na všech místech.", options: ["Neexistovala by roční období – na celé Zemi by byl stále stejný klimatický vzorec. Den by byl vždy stejně dlouhý jako noc (12 h/12 h) na všech místech.", "Roku by bylo více dní, protože by se Země točila rychleji.", "Zima a léto by se střídaly každý měsíc místo každé půlroku.", "Neexistoval by den a noc – Země by vždy svítila jen z jedné strany."], hints: ["Sklon osy způsobuje roční období. Bez sklonu = bez ročních období."] },
  { question: "Jak funguje letní čas a proč ho zavedli?", correctAnswer: "V létě se hodiny posunou o 1 hodinu dopředu – SELČ = UTC+2, aby lidé lépe využívali denního světla – méně elektřiny na osvětlení večer.", options: ["V létě se hodiny posunou o 1 hodinu dopředu (SELČ = UTC+2), aby lidé lépe využívali denního světla – méně elektřiny na osvětlení večer.", "V létě se hodiny posunou zpět, aby byl večer delší.", "Letní čas přizpůsobuje hodiny pohybu Slunce na obloze.", "Letní čas zavedli kvůli zemědělcům, aby vstávali dřív."], hints: ["V březnu přidáme hodinu, v říjnu odebereme."] },
  { question: "Proč jsou rovnodennosti jen dvakrát ročně?", correctAnswer: "Rovnodennosti nastávají, když zemská osa není nakloněna ani k Slunci, ani od něj – to nastane jen při přechodu mezi létem a zimou – 21. 3. a 23. 9..", options: ["Rovnodennosti nastávají, když zemská osa není nakloněna ani k Slunci, ani od něj – to nastane jen při přechodu mezi létem a zimou (21. 3. a 23. 9.).", "Rovnodennosti jsou způsobeny fázemi Měsíce.", "Rovnodennosti nastávají jen v tropech, na rovníku je den vždy stejně dlouhý.", "Rovnodennosti se vztahují jen na polární oblasti."], hints: ["Osa je nakloněna 23,5° – rovnodennost nastává ve chvíli, kdy osa míří kolmo ke Slunci."] },
  { question: "Proč je cestování na západ nebo na východ spojeno se 'zpožděním'?", correctAnswer: "Časová pásma se mění o 1 hodinu na každých 15° zeměpisné délky – letadlo letící na západ 'dohání' slunce, na východ ho 'přeskakuje'.", options: ["Časová pásma se mění o 1 hodinu na každých 15° zeměpisné délky – letadlo letící na západ 'dohání' slunce, na východ ho 'přeskakuje'.", "Letadlo letí pomaleji ve směru větru, proto trvá déle.", "Biologické hodiny se resetují při přechodu rovníku.", "Gravitace se mění v různých pásmech a ovlivňuje rytmus těla."], hints: ["Jet lag = desynchronizace biologických hodin a místního času."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const ZEMEJAKOPLANETATVARROTACEOBEHSTRIDANIDNEANOCI: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-zeme-jako-planeta-tvar-rotace-obeh-stridani-dne-a-noci",
    title: "Země jako planeta - tvar, rotace, oběh, střídání dne a noci",
    studentTitle: "Pohyby Země",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Pochopíš, proč se střídá den a noc a jak vznikají roční období.",
    keywords: ["rotace", "oběh", "den", "noc", "roční období", "slunovrat", "rovnodennost", "časová pásma"],
    goals: ["Vysvětlit střídání dne a noci rotací Země", "Popsat vztah sklonu osy k ročním obdobím", "Určit data slunovratů a rovnodenností"],
    boundaries: ["Neprobírá precesi zemské osy", "Neprobírá přesnou astronomii oběžných drah"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Rotace (24 h) → den/noc. Oběh + sklon osy (23,5°) → roční období.",
      steps: [
        "1. Rotace Země (kolem osy) = 24 hodin = den a noc.",
        "2. Oběh kolem Slunce = 365,25 dne = rok.",
        "3. Sklon osy = roční období (léto/zima).",
        "4. Nejdelší den: 21. 6. Nejkratší: 21. 12.",
      ],
      commonMistake: "Roční období NEZPŮSOBUJE vzdálenost od Slunce, ale sklon zemské osy!",
      example: "21. června: severní polokoule nakloněna ke Slunci → léto. 21. prosince: odkloněna → zima.",
    },
  },
];
