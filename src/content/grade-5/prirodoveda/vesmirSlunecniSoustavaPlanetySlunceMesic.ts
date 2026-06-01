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
  { question: "Co je Slunce?", correctAnswer: "Hvězda – obrovská koule horkého plynu", options: ["Hvězda – obrovská koule horkého plynu", "Planeta naší soustavy", "Měsíc Jupitera", "Asteroid"], hints: ["Slunce září vlastním světlem."] },
  { question: "Kolik planet má naše Sluneční soustava?", correctAnswer: "8 planet", options: ["8 planet", "9 planet", "7 planet", "10 planet"], hints: ["Pluto bylo v roce 2006 překlasifikováno."] },
  { question: "Která planeta je nejblíže Slunci?", correctAnswer: "Merkur", options: ["Merkur", "Venuše", "Mars", "Země"], hints: ["Začíná na M."] },
  { question: "Jak se jmenuje přirozená družice Země?", correctAnswer: "Měsíc", options: ["Měsíc", "Mars", "Venuše", "Fobos"], hints: ["Vidíme ji každou noc."] },
  { question: "Jak daleko je Slunce od Země přibližně?", correctAnswer: "150 milionů km (světlo doletí za 8 minut)", options: ["150 milionů km (světlo doletí za 8 minut)", "1 500 km", "15 000 km", "1,5 milionu km"], hints: ["Světlo letí rychlostí 300 000 km/s."] },
  { question: "Jak se jmenuje galaxie, ve které žijeme?", correctAnswer: "Mléčná dráha", options: ["Mléčná dráha", "Andromeda", "Velký Magellanův mrak", "Sombrero"], hints: ["Na nočním nebi ji vidíme jako světelný pás."] },
  { question: "Kdo jako první přistál na Měsíci?", correctAnswer: "Neil Armstrong (Apollo 11, 1969)", options: ["Neil Armstrong (Apollo 11, 1969)", "Jurij Gagarin (1961)", "Buzz Aldrin (1972)", "Valentina Těreškovová (1963)"], hints: ["Byl to Američan."] },
  { question: "Co jsou planety kamenité skupiny?", correctAnswer: "Merkur, Venuše, Země, Mars", options: ["Merkur, Venuše, Země, Mars", "Jupiter, Saturn, Uran, Neptun", "Mars, Jupiter, Saturn, Uran", "Merkur, Venuše, Jupiter, Saturn"], hints: ["Jsou blíž ke Slunci."] },
  { question: "Která planeta má typické prstence?", correctAnswer: "Saturn", options: ["Saturn", "Jupiter", "Uran", "Mars"], hints: ["Prstence jsou tvořené ledem a kameny."] },
  { question: "Co je to kometa?", correctAnswer: "Těleso z ledu a prachu obíhající kolem Slunce s jasným ocasem", options: ["Těleso z ledu a prachu obíhající kolem Slunce s jasným ocasem", "Malá planeta bez atmosféry", "Druh hvězdy", "Meteorit na povrchu Měsíce"], hints: ["Její ocas míří od Slunce."] },
  { question: "Kde ve Sluneční soustavě se nachází pás asteroidů?", correctAnswer: "Mezi Marsem a Jupiterem", options: ["Mezi Marsem a Jupiterem", "Mezi Zemí a Marsem", "Za Neptuntem", "Kolem Saturnu"], hints: ["Asteroidy jsou skalnatá tělesa."] },
  { question: "Jak dlouho trvá jeden oběh Měsíce kolem Země?", correctAnswer: "Přibližně 27 dní", options: ["Přibližně 27 dní", "Přibližně 365 dní", "Přibližně 7 dní", "Přibližně 12 hodin"], hints: ["Měsíc se mění z novu na nov za 27 dní."] },
  { question: "Jaký je stáří vesmíru přibližně?", correctAnswer: "13,8 miliardy let", options: ["13,8 miliardy let", "4,5 miliardy let", "100 milionů let", "1 miliarda let"], hints: ["Vznikl Velkým třeskem."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se od sebe liší kamenité a plynné planety?", correctAnswer: "Kamenité mají pevný povrch (Merkur, Venuše, Země, Mars), plynné jsou tvořeny převážně plynem (Jupiter, Saturn, Uran, Neptun)", options: ["Kamenité mají pevný povrch (Merkur, Venuše, Země, Mars), plynné jsou tvořeny převážně plynem (Jupiter, Saturn, Uran, Neptun)", "Kamenité jsou větší než plynné", "Plynné jsou blíže ke Slunci", "Kamenité mají více měsíců"], hints: ["Jupiter je největší planeta – je plynná."] },
  { question: "Co je to jaderná fúze probíhající ve Slunci?", correctAnswer: "Slučování atomů vodíku na helium, při němž se uvolňuje obrovské množství energie (teplo a světlo)", options: ["Slučování atomů vodíku na helium, při němž se uvolňuje obrovské množství energie (teplo a světlo)", "Hoření kyslíku v obrovském ohni", "Chemická reakce mezi plyny", "Výbuch způsobený tlakem gravitace"], hints: ["Je to jiný proces než hoření – jde o přeměnu jader atomů."] },
  { question: "Proč nemá Měsíc atmosféru?", correctAnswer: "Je příliš malý – jeho gravitace nestačí udržet plyny u povrchu", options: ["Je příliš malý – jeho gravitace nestačí udržet plyny u povrchu", "Je příliš daleko od Slunce", "Byl vždy příliš horký", "Atmosféru ztratil srážkou s asteroidem"], hints: ["Atmosféra vyžaduje dostatečnou gravitaci."] },
  { question: "Co je nejbližší hvězda k naší Sluneční soustavě?", correctAnswer: "Proxima Centauri (4,2 světelného roku)", options: ["Proxima Centauri (4,2 světelného roku)", "Sírius (8,6 světelného roku)", "Betelgeuse (700 světelných let)", "Polárka (430 světelných let)"], hints: ["I k nejbližší hvězdě by let trval tisíce let."] },
  { question: "Co je světelný rok?", correctAnswer: "Vzdálenost, kterou světlo urazí za jeden rok (přibližně 9,5 bilionu km)", options: ["Vzdálenost, kterou světlo urazí za jeden rok (přibližně 9,5 bilionu km)", "Čas, za který světlo obletí Zemi", "Rok měřený na vzdálené planetě", "Rychlost světla v km/s"], hints: ["Světlo letí rychlostí 300 000 km/s."] },
  { question: "Jaký je rozdíl mezi asteroidem a kometou?", correctAnswer: "Asteroid je skalnaté těleso bez ocasu, kometa je z ledu a prachu a při přiblížení ke Slunci tvoří ocas", options: ["Asteroid je skalnaté těleso bez ocasu, kometa je z ledu a prachu a při přiblížení ke Slunci tvoří ocas", "Jsou to totéž, jen různá jména", "Kometa je větší než asteroid", "Asteroid obíhá kolem Měsíce, kometa kolem Slunce"], hints: ["Ocas komety vzniká sublimací ledu."] },
  { question: "Proč Venuše svítí na obloze nejjasněji ze všech planet?", correctAnswer: "Má hustou oblačnou atmosféru, která odráží hodně slunečního světla", options: ["Má hustou oblačnou atmosféru, která odráží hodně slunečního světla", "Je nejblíže ke Slunci", "Je největší planetou vnitřní soustavy", "Je pokryta sněhem, který odráží světlo"], hints: ["Venuše je druhá planeta od Slunce."] },
  { question: "Jaký je pořadí planet od Slunce?", correctAnswer: "Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", options: ["Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", "Merkur, Mars, Venuše, Země, Jupiter, Saturn, Uran, Neptun", "Venuše, Merkur, Země, Mars, Jupiter, Uran, Saturn, Neptun", "Merkur, Venuše, Země, Mars, Saturn, Jupiter, Uran, Neptun"], hints: ["Pomůže věta: 'Malý Vesmír Zachraňuje Moudré Jedince Světlou Útěchou Nakonec'"] },
  { question: "Proč je Mars červený?", correctAnswer: "Jeho povrch obsahuje oxid železitý (rez)", options: ["Jeho povrch obsahuje oxid železitý (rez)", "Je pokryt lávou", "Odráží světlo červenou atmosférou", "Je pokryt červenými horninami bez oxidu"], hints: ["Rez je chemicky stejný jako oxid železitý."] },
  { question: "Co jsou fáze Měsíce?", correctAnswer: "Různé podoby Měsíce viditelné ze Země podle toho, jak ho osvětluje Slunce", options: ["Různé podoby Měsíce viditelné ze Země podle toho, jak ho osvětluje Slunce", "Změny polohy Měsíce na obloze", "Pohyb Měsíce blíže a dále od Země", "Otočení Měsíce kolem své osy"], hints: ["Nov → Couvající srpek → Čtvrť → Dorůstající → Úplněk."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak vzniká solární energie a proč je obnovitelná?", correctAnswer: "Slunce produkuje energii jadernou fúzí (po miliardy let), fotovoltaické panely ji mění v elektřinu – pro lidstvo prakticky nevyčerpatelná", options: ["Slunce produkuje energii jadernou fúzí (po miliardy let), fotovoltaické panely ji mění v elektřinu – pro lidstvo prakticky nevyčerpatelná", "Slunce hoří jako dřevo – ale má zásoby na 1 000 let", "Solární energie se tvoří atmosférou Země", "Slunce přijímá energii z okolních hvězd a předává ji Zemi"], hints: ["Slunce bude svítit ještě asi 5 miliard let."] },
  { question: "Proč vidíme z Měsíce vždy stejnou stranu? ", correctAnswer: "Měsíc se otočí kolem osy za stejnou dobu, za jakou oběhne Zemi – synchronní rotace", options: ["Měsíc se otočí kolem osy za stejnou dobu, za jakou oběhne Zemi – synchronní rotace", "Měsíc se neotáčí kolem své osy vůbec", "Druhá strana je odvrácena ke Slunci", "Gravitace Země zastavila rotaci Měsíce"], hints: ["Tomuto jevu se říká slapová brzda."] },
  { question: "Jak by vypadal den na Merkuru ve srovnání se Zemí?", correctAnswer: "Merkurský den (rotace) trvá 59 pozemských dní, ale rok (oběh) jen 88 dní – dny a roky jsou zde velmi jiné", options: ["Merkurský den (rotace) trvá 59 pozemských dní, ale rok (oběh) jen 88 dní – dny a roky jsou zde velmi jiné", "Den na Merkuru trvá stejně jako na Zemi, jen rok je kratší", "Merkur se neotáčí, takže tam není den ani noc", "Merkurský den trvá 365 hodin"], hints: ["Merkur je nejblíže Slunci – gravitace Slunce jeho rotaci zpomaluje."] },
  { question: "Proč se Venuše považuje za 'sestru Země', ale přesto je tam život nemožný?", correctAnswer: "Venuše má podobnou velikost a hmotnost jako Země, ale má obrovský skleníkový efekt – teplota povrchu je 465 °C a atmosféra je z CO₂ s kyselinovými mraky", options: ["Venuše má podobnou velikost a hmotnost jako Země, ale má obrovský skleníkový efekt – teplota povrchu je 465 °C a atmosféra je z CO₂ s kyselinovými mraky", "Venuše je příliš daleko od Slunce, proto je příliš studená", "Venuše nemá atmosféru, proto nepřežijí organismy", "Venuše je příliš malá na to, aby udržela vodu"], hints: ["Skleníkový efekt – CO₂ zachytává teplo."] },
  { question: "Proč je Jupiter tak velký? Co by se stalo, kdyby byl ještě větší?", correctAnswer: "Jupiter je z plynů bez pevného povrchu. Kdyby byl asi 80× těžší, mohl by začít jaderná fúze a stal by se hvězdou (hnědý trpaslík nebo hvězda)", options: ["Jupiter je z plynů bez pevného povrchu. Kdyby byl asi 80× těžší, mohl by začít jaderná fúze a stal by se hvězdou (hnědý trpaslík nebo hvězda)", "Jupiter je velký, protože přitáhl do sebe všechny asteroidy v soustavě", "Kdyby byl větší, zhroutil by se do černé díry", "Jupiter je největší, protože je nejblíže Slunci a má nejvíce energie"], hints: ["Hmotnost rozhoduje o tom, zda dojde k jaderné fúzi."] },
  { question: "Co je Velká rudá skvrna na Jupiteru?", correctAnswer: "Obrovský anticyklón (bouře) větší než Země, který zuří nepřetržitě déle než 350 let", options: ["Obrovský anticyklón (bouře) větší než Země, který zuří nepřetržitě déle než 350 let", "Sopka chrlící červenou lávu na povrchu Jupiteru", "Kráter po srážce s asteroidem", "Ozónová díra v atmosféře Jupiteru"], hints: ["Jupiter je plynná planeta – nemá pevný povrch, nemůže mít sopky ani krátery."] },
  { question: "Proč je vzdálenost k hvězdám měřena ve světelných letech a ne v kilometrech?", correctAnswer: "Vzdálenosti jsou tak ohromné, že kilometry by byly neprakticky velká čísla – nejbližší hvězda je 40 bilionu km daleko", options: ["Vzdálenosti jsou tak ohromné, že kilometry by byly neprakticky velká čísla – nejbližší hvězda je 40 bilionu km daleko", "Světelný rok je standardní astronomická jednotka dohodnutá jako jeden metr", "Kilometry nelze použít mimo Sluneční soustavu", "Světelné roky jsou přesné, kilometry jsou přibližné"], hints: ["Proxima Centauri je 4,2 světelného roku = přibližně 40 000 000 000 000 km."] },
  { question: "Jak se liší plynné obří planety (Jupiter, Saturn) od ledových obrů (Uran, Neptun)?", correctAnswer: "Plynní obři jsou tvořeni hlavně vodíkem a heliem, ledoví obři mají vyšší podíl vody, amoniaku a metanu v ledu – proto mají modrou barvu", options: ["Plynní obři jsou tvořeni hlavně vodíkem a heliem, ledoví obři mají vyšší podíl vody, amoniaku a metanu v ledu – proto mají modrou barvu", "Ledoví obři jsou pokryti tuhým ledem, plynní obři ne", "Jsou stejné – dělení na plynné a ledové obry je jen historické", "Ledoví obři jsou blíže Slunci a mají méně energie"], hints: ["Modrá barva Uranu a Neptunu je způsobena metanem."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const VESMIRSLUNECNISOUSTAVAPLANETYSLUNCEMESIC: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-vesmir-slunecni-soustava-planety-slunce-mesic",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-neziva-priroda-rozsireni-vesmir-slunecni-soustava-planety-slunce-mesic",
    title: "Vesmír - Sluneční soustava, planety, Slunce, Měsíc",
    studentTitle: "Vesmír",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Neživá příroda - rozšíření",
    briefDescription: "Poznáš planety Sluneční soustavy a dozvíš se, co je Slunce a Měsíc.",
    keywords: ["vesmír", "planety", "Slunce", "Měsíc", "Sluneční soustava", "hvězdy", "komety"],
    goals: ["Vyjmenovat planety Sluneční soustavy v pořadí od Slunce", "Popsat základní vlastnosti Slunce a Měsíce", "Rozlišit kamenité a plynné planety"],
    boundaries: ["Neprobírá spektroskopii hvězd", "Neprobírá kosmonautiku do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Planety od Slunce: Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun. Pomůže věta s počátečními písmeny.",
      steps: ["1. Zapamatuj si pořadí planet.", "2. Rozliš kamenité (1–4) a plynné (5–8).", "3. Slunce = hvězda, Měsíc = přirozená družice Země."],
      commonMistake: "Pluto není planeta – je to trpasličí planeta od roku 2006.",
      example: "Merkur – nejmenší a nejbližší k Slunci. Saturn – má výrazné prstence.",
    },
  },
];
