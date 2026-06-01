import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Kolik přísudků má věta 'Petr hraje a zpívá'?", a: "2 — je to souvětí", opts: ["2 — je to souvětí", "1 — věta jednoduchá", "3", "0"] },
  { q: "Urči druh věty: 'Šli jsme domů.'", a: "věta jednoduchá", opts: ["věta jednoduchá", "souvětí", "souvětí se dvěma větami", "nelze určit"] },
  { q: "Urči druh: 'Pršelo a děti nemohly ven.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s přívlastkem", "věta rozvinutá"] },
  { q: "Kolik vět tvoří souvětí 'Přišel jsem domů, dal jsem si svačinu a šel jsem spát.'?", a: "3 věty", opts: ["3 věty", "1 věta", "2 věty", "4 věty"] },
  { q: "Věta jednoduchá má:", a: "jeden přísudek", opts: ["jeden přísudek", "dva přísudky", "žádný přísudek", "tři přísudky"] },
  { q: "Souvětí má:", a: "dva nebo více přísudků", opts: ["dva nebo více přísudků", "jeden přísudek", "žádný přísudek", "vždy tři přísudky"] },
  { q: "Urči druh: 'Kočka spí.'", a: "věta jednoduchá", opts: ["věta jednoduchá", "souvětí", "nelze určit", "věta rozvitá"] },
  { q: "Urči druh: 'Slunce svítí, ale je chladno.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s přívlastkem", "věta rozšířená"] },
  { q: "Kolik přísudků má věta 'Sedím a čtu'?", a: "2", opts: ["2", "1", "3", "0"] },
  { q: "Urči druh: 'Babička peče koláč a dědeček čte noviny.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s předmětem", "věta přísudková"] },
  { q: "Jak se nazývají jednotlivé části souvětí?", a: "věty (věta hlavní, věta vedlejší)", opts: ["věty (věta hlavní, věta vedlejší)", "odstavce", "části", "úseky"] },
  { q: "Urči druh: 'Bratr hraje počítač.'", a: "věta jednoduchá", opts: ["věta jednoduchá", "souvětí", "věta s předmětem", "věta vedlejší"] },
  { q: "Urči druh: 'Nevím, kde jsou moje klíče.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta tázací", "věta s příslovcem"] },
  { q: "Kolik přísudků má věta 'Ptáci zpívají.'?", a: "1", opts: ["1", "2", "3", "0"] },
  { q: "Urči druh: 'Šel do obchodu, protože neměl chléb.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta dvojdílná", "věta s předmětem"] },
  { q: "Co spojuje věty v souvětí?", a: "spojky (a, ale, nebo, protože, když, že...)", opts: ["spojky (a, ale, nebo, protože, když, že...)", "přídavná jména", "příslovce", "předložky"] },
];

const POOL_L2: QA[] = [
  { q: "Urči druh věty: 'Jdu do školy, protože mám hodiny.'", a: "souvětí podřadné", opts: ["souvětí podřadné", "souvětí souřadné", "věta jednoduchá", "věta přísudková"] },
  { q: "Věta 'Šli jsme na výlet a bylo krásně.' — jaký druh souvětí?", a: "souvětí souřadné (spojka a)", opts: ["souvětí souřadné (spojka a)", "souvětí podřadné", "věta jednoduchá", "věta složená"] },
  { q: "Urči větu vedlejší v souvětí: 'Věřím, že uspěješ.'", a: "že uspěješ", opts: ["že uspěješ", "Věřím", "uspěješ", "Věřím, že"] },
  { q: "Urči větu hlavní v souvětí: 'Když pršelo, zůstali jsme doma.'", a: "zůstali jsme doma", opts: ["zůstali jsme doma", "Když pršelo", "pršelo", "Když pršelo, zůstali jsme"] },
  { q: "Jaká spojka vyjadřuje příčinu (proto, protože)?", a: "protože, poněvadž", opts: ["protože, poněvadž", "ale, avšak", "a, i, ani", "nebo, anebo"] },
  { q: "Urči druh věty: 'Nevím, kam jít.'", a: "souvětí", opts: ["souvětí", "věta jednoduchá", "věta s infinitivem", "věta rozvitá"] },
  { q: "Spojka 'ale' vyjadřuje:", a: "protiklad (odporovací)", opts: ["protiklad (odporovací)", "příčinu", "časový vztah", "účel"] },
  { q: "Urči větu vedlejší: 'Čtu knihu, která je velmi zajímavá.'", a: "která je velmi zajímavá", opts: ["která je velmi zajímavá", "Čtu knihu", "Čtu", "knihu, která"] },
  { q: "Urči druh souvětí: 'Pospíchám, aby mě nečekali.'", a: "souvětí podřadné (aby = účel)", opts: ["souvětí podřadné (aby = účel)", "souvětí souřadné", "věta jednoduchá", "souvětí odporovací"] },
  { q: "Kolik vět je v souvětí: 'Věděl jsem, že přijdete, protože jste slíbili.'?", a: "3 věty", opts: ["3 věty", "2 věty", "1 věta", "4 věty"] },
  { q: "Věta 'Přišel jsem, uviděl jsem, zvítězil jsem.' — kolik vět?", a: "3 věty", opts: ["3 věty", "2 věty", "1 věta", "4 věty"] },
  { q: "Urči větu hlavní: 'Ačkoliv bylo pozdě, šel jsem na procházku.'", a: "šel jsem na procházku", opts: ["šel jsem na procházku", "Ačkoliv bylo pozdě", "bylo pozdě", "ačkoliv šel"] },
  { q: "Jaká spojka vyjadřuje časový vztah?", a: "když, jakmile, zatímco", opts: ["když, jakmile, zatímco", "ale, avšak, jenže", "protože, poněvadž", "aby, ať"] },
  { q: "Urči druh: 'Nevím, jestli to zvládnu.'", a: "souvětí podřadné", opts: ["souvětí podřadné", "souvětí souřadné", "věta jednoduchá", "věta tázací"] },
  { q: "Čárka v souvětí odděluje:", a: "věty od sebe", opts: ["věty od sebe", "podmět od přísudku", "přívlastky", "předmět od přísudku"] },
  { q: "Urči větu vedlejší: 'Řekl mi, kde to je.'", a: "kde to je", opts: ["kde to je", "Řekl mi", "Řekl", "mi, kde to je"] },
];

const POOL_L3: QA[] = [
  { q: "Věta vedlejší podmětná: která z vět je podmětná?", a: "Kdo chodí pozdě, spí do poledne. (podmět = kdo chodí pozdě)", opts: ["Kdo chodí pozdě, spí do poledne. (podmět = kdo chodí pozdě)", "Vím, že přijdeš.", "Šel domů, protože byl unavený.", "Jdu, abych se naučil."] },
  { q: "Urči druh věty vedlejší: 'Věřím, že to dokážeš.'", a: "předmětná", opts: ["předmětná", "podmětná", "příslovečná časová", "přívlastková"] },
  { q: "Urči druh věty vedlejší: 'Kniha, kterou jsem četl, byla zajímavá.'", a: "přívlastková", opts: ["přívlastková", "předmětná", "podmětná", "příslovečná"] },
  { q: "Urči druh věty vedlejší: 'Šel jsem domů, když začalo pršet.'", a: "příslovečná časová", opts: ["příslovečná časová", "příslovečná příčinná", "přívlastková", "předmětná"] },
  { q: "Urči druh věty vedlejší: 'Nešel jsem ven, protože byl déšť.'", a: "příslovečná příčinná", opts: ["příslovečná příčinná", "příslovečná časová", "podmětná", "předmětná"] },
  { q: "Co je vzorec souvětí 'Petr hraje a Jana čte.'?", a: "V + V (souřadné)", opts: ["V + V (souřadné)", "V ← VV (podřadné)", "V → VV", "VV + V"] },
  { q: "Souvětí 'Nevím, jestli přijdeš.' — jaký typ?", a: "podřadné (věta vedlejší předmětná)", opts: ["podřadné (věta vedlejší předmětná)", "souřadné", "věta jednoduchá", "podřadné podmětné"] },
  { q: "Urči druh věty vedlejší: 'Trénoval, aby vyhrál.'", a: "příslovečná účelová", opts: ["příslovečná účelová", "příslovečná příčinná", "předmětná", "přívlastková"] },
  { q: "Kolik vět je v souvětí: 'Víme, kde bydlíš, protože ti píšeme.'?", a: "3 věty", opts: ["3 věty", "2 věty", "4 věty", "1 věta"] },
  { q: "Věta vedlejší přívlastková uvozena slovem 'který'— příklad:", a: "Četl jsem knihu, která se mi líbila.", opts: ["Četl jsem knihu, která se mi líbila.", "Věřím, že uspěješ.", "Přišel, protože chtěl pomoci.", "Spím, abych byl odpočatý."] },
  { q: "Urči druh věty vedlejší: 'Nevím, jak to udělat.'", a: "předmětná", opts: ["předmětná", "podmětná", "příslovečná způsobová", "přívlastková"] },
  { q: "Souvětí souřadné slučovací používá spojky:", a: "a, i, ani, také", opts: ["a, i, ani, také", "ale, avšak, jenže", "nebo, anebo", "protože, poněvadž"] },
  { q: "Urči druh věty vedlejší: 'Ačkoliv byl unavený, dál pracoval.'", a: "příslovečná přípustková", opts: ["příslovečná přípustková", "příslovečná příčinná", "příslovečná časová", "podmínková"] },
  { q: "Urči druh věty vedlejší: 'Kdybys přišel, byl bych rád.'", a: "příslovečná podmínková", opts: ["příslovečná podmínková", "příslovečná přípustková", "předmětná", "časová"] },
  { q: "Věta vedlejší podmětná uvozena 'kdo': příklad:", a: "Kdo nezkoumá, neobjeví.", opts: ["Kdo nezkoumá, neobjeví.", "Přišel, kdo chtěl.", "Myslím, kdo přijde.", "Řekl mi, kdo to byl."] },
  { q: "Vzorec podřadného souvětí 'Vím, že přijdete.' ukazuje:", a: "věta hlavní + věta vedlejší", opts: ["věta hlavní + věta vedlejší", "věta vedlejší + věta hlavní", "dvě věty hlavní", "dvě věty vedlejší"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Věta jednoduchá = 1 přísudek (1 sloveso jako základ)",
      "Souvětí = 2 a více přísudků (slovese spojených spojkami)",
      "Věta hlavní může stát sama, vedlejší závisí na hlavní",
    ],
    solutionSteps: [
      "Spočítej slovesa (přísudky) ve větě.",
      "1 přísudek → věta jednoduchá",
      "2+ přísudků → souvětí",
      "Věta vedlejší závisí na větě hlavní.",
    ],
  }));
}

export const VETAJEDNODUCHAASOUVETIVZORECSOUVETI: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti",
    rvpNodeId: "g4-cjl-jazykova-vychova-skladba-veta-jednoducha-a-souveti-vzorec-souveti",
    title: "Věta jednoduchá a souvětí, vzorec souvětí",
    studentTitle: "Věta a souvětí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš rozdíl mezi větou jednoduchou a souvětím a pochopíš jejich vzorec.",
    keywords: ["věta jednoduchá", "souvětí", "přísudek", "spojka", "věta hlavní", "věta vedlejší"],
    goals: [
      "Rozlišit větu jednoduchou a souvětí",
      "Určit počet vět v souvětí",
      "Pochopit roli spojek v souvětí",
    ],
    boundaries: ["Bez složitých druhů vedlejších vět pro úroveň 1", "Bez souvětí s více než 3 větami"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Věta jednoduchá = 1 přísudek; souvětí = 2+ přísudků spojených spojkami",
      steps: [
        "Spočítej slovesa (přísudky) ve větě.",
        "1 sloveso → věta jednoduchá",
        "2+ slovesa → souvětí",
        "Věty v souvětí jsou odděleny čárkou nebo spojkou.",
      ],
      commonMistake: "Záměna rozvité věty jednoduché a souvětí — přídavné jméno nebo příslovce nejsou přísudek",
      example: "'Petr hraje a zpívá.' = souvětí (hraje, zpívá = 2 přísudky); 'Unavený Petr spí.' = věta jednoduchá",
    },
  },
];
