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
  { question: "Kolik planet má naše Sluneční soustava?", correctAnswer: "8 planet", options: ["9 planet", "8 planet", "7 planet", "10 planet"], hints: ["Pluto bylo v roce 2006 překlasifikováno."] },
  { question: "Která planeta je nejblíže Slunci?", correctAnswer: "Merkur", options: ["Venuše", "Mars", "Merkur", "Země"], hints: ["Začíná na M."] },
  { question: "Jak se jmenuje přirozená družice Země?", correctAnswer: "Měsíc", options: ["Mars", "Venuše", "Fobos", "Měsíc"], hints: ["Vidíme ji každou noc."] },
  { question: "Jak daleko je Slunce od Země?", correctAnswer: "150 milionů km", options: ["150 milionů km", "1 500 km", "15 000 km", "1,5 milionu km"], hints: ["Světlo letí rychlostí 300 000 km/s."] },
  { question: "Jak se jmenuje galaxie, ve které žijeme?", correctAnswer: "Mléčná dráha", options: ["Andromeda", "Mléčná dráha", "Velký Magellanův mrak", "Sombrero"], hints: ["Na nočním nebi ji vidíme jako světelný pás."] },
  { question: "Kdo jako první přistál na Měsíci?", correctAnswer: "Neil Armstrong – Apollo 11, 1969", options: ["Jurij Gagarin – 1961", "Buzz Aldrin – 1972", "Neil Armstrong – Apollo 11, 1969", "Valentina Těreškovová – 1963"], hints: ["Byl to Američan."] },
  { question: "Co jsou planety kamenité skupiny?", correctAnswer: "Merkur, Venuše, Země, Mars", options: ["Jupiter, Saturn, Uran, Neptun", "Mars, Jupiter, Saturn, Uran", "Merkur, Venuše, Jupiter, Saturn", "Merkur, Venuše, Země, Mars"], hints: ["Jsou blíž ke Slunci."] },
  { question: "Která planeta má typické prstence?", correctAnswer: "Saturn", options: ["Saturn", "Jupiter", "Uran", "Mars"], hints: ["Prstence jsou tvořené ledem a kameny."] },
  { question: "Co je to kometa?", correctAnswer: "Těleso z ledu a prachu s ocasem", options: ["Malá planeta bez atmosféry", "Těleso z ledu a prachu s ocasem", "Druh vzdálené hvězdy", "Meteorit na povrchu Měsíce"], hints: ["Její ocas míří od Slunce."] },
  { question: "Kde ve Sluneční soustavě se nachází pás asteroidů?", correctAnswer: "Mezi Marsem a Jupiterem", options: ["Mezi Zemí a Marsem", "Za Neptuntem", "Mezi Marsem a Jupiterem", "Kolem Saturnu"], hints: ["Asteroidy jsou skalnatá tělesa."] },
  { question: "Jak dlouho trvá jeden oběh Měsíce kolem Země?", correctAnswer: "Přibližně 27 dní", options: ["Přibližně 365 dní", "Přibližně 7 dní", "Přibližně 12 hodin", "Přibližně 27 dní"], hints: ["Měsíc se mění z novu na nov za 27 dní."] },
  { question: "Jaký je stáří vesmíru přibližně?", correctAnswer: "13,8 miliardy let", options: ["13,8 miliardy let", "4,5 miliardy let", "100 milionů let", "1 miliarda let"], hints: ["Vznikl Velkým třeskem."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se od sebe liší kamenité a plynné planety?", correctAnswer: "Kamenité mají pevný povrch", options: ["Kamenité jsou větší než plynné", "Kamenité mají pevný povrch", "Plynné jsou blíže ke Slunci", "Kamenité mají více měsíců"], hints: ["Jupiter je největší planeta – je plynná."] },
  { question: "Odkud bere Slunce energii?", correctAnswer: "Ze slučování vodíku na helium", options: ["Z hoření kyslíku v ohni", "Z chemické reakce mezi plyny", "Ze slučování vodíku na helium", "Z výbuchu způsobeného tlakem"], hints: ["Je to jiný proces než hoření – jde o přeměnu jader atomů."] },
  { question: "Proč nemá Měsíc atmosféru?", correctAnswer: "Je příliš malý – jeho gravitace nestačí udržet plyny u povrchu", options: ["Je příliš daleko od Slunce", "Byl vždy příliš horký", "Atmosféru ztratil srážkou s asteroidem", "Je příliš malý – jeho gravitace nestačí udržet plyny u povrchu"], hints: ["Atmosféra vyžaduje dostatečnou gravitaci."] },
  { question: "Co je nejbližší hvězda k naší Sluneční soustavě?", correctAnswer: "Proxima Centauri – 4,2 světelného roku", options: ["Proxima Centauri – 4,2 světelného roku", "Sírius – 8,6 světelného roku", "Betelgeuse – 700 světelných let", "Polárka – 430 světelných let"], hints: ["I k nejbližší hvězdě by let trval tisíce let."] },
  { question: "Co je světelný rok?", correctAnswer: "Vzdálenost, kterou světlo urazí za rok", options: ["Čas, za který světlo obletí Zemi", "Vzdálenost, kterou světlo urazí za rok", "Rok měřený na vzdálené planetě", "Rychlost světla za jednu sekundu"], hints: ["Světlo letí rychlostí 300 000 km/s."] },
  { question: "Jaký je rozdíl mezi asteroidem a kometou?", correctAnswer: "Kometě u Slunce roste ocas", options: ["Jsou to totéž, jen různá jména", "Kometa je vždy větší než asteroid", "Kometě u Slunce roste ocas", "Asteroid obíhá kolem Měsíce"], hints: ["Ocas komety vzniká sublimací ledu."] },
  { question: "Proč Venuše svítí na obloze nejjasněji ze všech planet?", correctAnswer: "Má hustou oblačnou atmosféru, která odráží hodně slunečního světla", options: ["Je nejblíže ke Slunci", "Je největší planetou vnitřní soustavy", "Je pokryta sněhem, který odráží světlo", "Má hustou oblačnou atmosféru, která odráží hodně slunečního světla"], hints: ["Venuše je druhá planeta od Slunce."] },
  { question: "Jaký je pořadí planet od Slunce?", correctAnswer: "Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", options: ["Merkur, Venuše, Země, Mars, Jupiter, Saturn, Uran, Neptun", "Merkur, Mars, Venuše, Země, Jupiter, Saturn, Uran, Neptun", "Venuše, Merkur, Země, Mars, Jupiter, Uran, Saturn, Neptun", "Merkur, Venuše, Země, Mars, Saturn, Jupiter, Uran, Neptun"], hints: ["Pomůže věta: 'Malý Vesmír Zachraňuje Moudré Jedince Světlou Útěchou Nakonec'"] },
  { question: "Proč je Mars červený?", correctAnswer: "Jeho povrch obsahuje oxid železitý – rez", options: ["Je pokryt lávou", "Jeho povrch obsahuje oxid železitý – rez", "Odráží světlo červenou atmosférou", "Je pokryt červenými horninami bez oxidu"], hints: ["Rez, která vzniká na železe, má stejné chemické složení jako to, co barví povrch této planety."] },
  { question: "Co jsou fáze Měsíce?", correctAnswer: "Podoby Měsíce podle osvětlení Sluncem", options: ["Změny polohy Měsíce na obloze", "Pohyb Měsíce blíž a dál od Země", "Podoby Měsíce podle osvětlení Sluncem", "Otočení Měsíce kolem své osy"], hints: ["Nov → Couvající srpek → Čtvrť → Dorůstající → Úplněk."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč je sluneční energie obnovitelná?", correctAnswer: "Bude svítit ještě miliardy let", options: ["Slunce hoří jako dřevo, vydrží 1 000 let", "Energie vzniká v zemské atmosféře", "Slunce ji dostává od okolních hvězd", "Bude svítit ještě miliardy let"], hints: ["Slunce bude svítit ještě asi 5 miliard let."] },
  { question: "Proč ze Země vidíme vždy stejnou stranu Měsíce?", correctAnswer: "Otočí se kolem osy za stejnou dobu", options: ["Otočí se kolem osy za stejnou dobu", "Vůbec se kolem osy neotáčí", "Druhá strana je vždy ke Slunci", "Gravitace Země rotaci zastavila"], hints: ["Tomuto jevu se říká slapová brzda."] },
  { question: "Jak by vypadal den na Merkuru ve srovnání se Zemí?", correctAnswer: "Merkurský den (rotace) trvá 59 pozemských dní, ale rok – oběh jen 88 dní – dny a roky jsou zde velmi jiné", options: ["Den na Merkuru trvá stejně jako na Zemi, jen rok je kratší", "Merkurský den (rotace) trvá 59 pozemských dní, ale rok – oběh jen 88 dní – dny a roky jsou zde velmi jiné", "Merkur se neotáčí, takže tam není den ani noc", "Merkurský den trvá 365 hodin"], hints: ["Merkur je nejblíže Slunci – gravitace Slunce jeho rotaci zpomaluje."] },
  { question: "Proč se Venuše považuje za 'sestru Země', ale přesto je tam život nemožný?", correctAnswer: "Má obrovský skleníkový efekt", options: ["Je moc daleko, a proto studená", "Nemá vůbec žádnou atmosféru", "Má obrovský skleníkový efekt", "Je moc malá, neudrží vodu"], hints: ["CO₂ v atmosféře zachytává teplo jako ve skleníku — jen o hodně silněji."] },
  { question: "Proč je Jupiter tak velký? Co by se stalo, kdyby byl ještě větší?", correctAnswer: "Je z plynů, chybí mu pevný povrch", options: ["Přitáhl do sebe všechny asteroidy", "Kdyby byl větší, byl by černá díra", "Je největší, protože je u Slunce", "Je z plynů, chybí mu pevný povrch"], hints: ["Hmotnost rozhoduje o tom, zda dojde k jaderné fúzi."] },
  { question: "Co je Velká rudá skvrna na Jupiteru?", correctAnswer: "Obrovský anticyklón – bouře větší než Země, který zuří nepřetržitě déle než 350 let", options: ["Obrovský anticyklón – bouře větší než Země, který zuří nepřetržitě déle než 350 let", "Sopka chrlící červenou lávu na povrchu Jupiteru", "Kráter po srážce s asteroidem", "Ozónová díra v atmosféře Jupiteru"], hints: ["Jupiter je plynná planeta – nemá pevný povrch, nemůže mít sopky ani krátery."] },
  { question: "Proč je vzdálenost k hvězdám měřena ve světelných letech a ne v kilometrech?", correctAnswer: "Vzdálenosti jsou tak ohromné, že kilometry by byly neprakticky velká čísla – nejbližší hvězda je 40 bilionu km daleko", options: ["Světelný rok je standardní astronomická jednotka dohodnutá jako jeden metr", "Vzdálenosti jsou tak ohromné, že kilometry by byly neprakticky velká čísla – nejbližší hvězda je 40 bilionu km daleko", "Kilometry nelze použít mimo Sluneční soustavu", "Světelné roky jsou přesné, kilometry jsou přibližné"], hints: ["Proxima Centauri je 4,2 světelného roku = přibližně 40 000 000 000 000 km."] },
  { question: "Čím se liší Uran a Neptun od Jupitera a Saturnu?", correctAnswer: "Mají víc vody, čpavku a metanu", options: ["Jsou pokryti tuhou vrstvou ledu", "Neliší se, je to jen zvyk", "Mají víc vody, čpavku a metanu", "Jsou blíž ke Slunci než Jupiter"], hints: ["Modrá barva Uranu a Neptunu je způsobena metanem."] },
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
