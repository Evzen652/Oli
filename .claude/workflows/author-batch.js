export const meta = {
  name: 'author-batch',
  description: 'Authoring + dvojí-optika verifikace cvičení 2. stupně přes paralelní agenty (pedagog + žák)',
  whenToUse: 'Když je potřeba vytvořit a ověřit více témat cvičení najednou (batch 6–8 RVP podtémat).',
  phases: [
    { title: 'Spec', detail: 'pedagog-plánovač navrhne hodinu per téma' },
    { title: 'Author', detail: 'autor napíše téma + test, projde bránou 0' },
    { title: 'Verify', detail: 'žák ∥ pedagog ∥ fakt — dvojí optika' },
    { title: 'Fix', detail: 'opravář sloučí nálezy, opraví, re-brána' },
  ],
}

// ── Vstup ────────────────────────────────────────────────────────────────
// args = pole položek: buď řetězec rvpId, nebo { rvpId, label?, file?, exportName?, subject?, authorModel? }
const raw = Array.isArray(args) ? args : (args ? [args] : [])
const topics = raw.map((t) => (typeof t === 'string' ? { rvpId: t } : t)).filter((t) => t && t.rvpId)
if (!topics.length) {
  log('⚠️ Nebyl předán žádný topic. Předej args = pole rvpId (nebo objektů {rvpId, label, file, exportName, subject}).')
  return { error: 'no_topics' }
}
log(`Batch: ${topics.length} témat → ${topics.map((t) => t.rvpId).join(', ')}`)

// ── Sdílené standardy (vloženy do promptů jednou) ──────────────────────────
const STANDARDS = `
STANDARD KVALITY 2. STUPNĚ (závazné):
- Žák jen VYBÍRÁ/manipuluje, NIKDY nepíše volnou odpověď. Povolené typy:
  select_one, true_false, multi_select, drag_order, categorize, comparison, timeline.
- Reálná gradace L1→L3 (zapamatování → použití → analýza). ŽÁDNÁ recyklace L1=L3.
  Znění otázek L1 a L3 musí být DISJUNKTNÍ (audit difficulty_progression porovnává texty otázek).
- Téma NEMÍCHÁ typy úloh (select_one téma emituje jen úlohy s options — jinak "Cause C" fail).
- Chybový model: KAŽDÝ distraktor = konkrétní typická chyba, ne náhodný posun.
  U select_one/true_false/multi_select navíc optionFeedback (mapa možnost→vysvětlení té chyby).
- Nápověda učí METODU, NIKDY neprozradí výsledek (ani jako součást převodního vztahu).
- explanation vysvětluje PROČ (u výpočtů solutionSteps s mezivýsledky).
- Česká gramatika čísel přes helpery z @/lib/czechGrammar (pad/plural/phrase/form) — nikdy inline.
- Test MUSÍ obsahovat NEZÁVISLÝ SOLVER (druhá cesta): pro výpočetní = přepočítej klíč z textu
  otázky; pro chronologii = rank-tabulka stáří; pro categorize = klasifikátor klíčových slov.

ZLATÉ VZORY (použij jako šablonu dle typu):
- select_one (výpočetní/faktický): src/content/grade-6/dejepis/periodizaceLetopocet.ts
- drag_order (chronologie):        src/content/grade-6/dejepis/dobaKamennaPeriodizace.ts
- categorize (práce se zdrojem):   src/content/grade-6/dejepis/historickePrameny.ts
- sdílené helpery faktického vzoru: src/content/grade-6/dejepis/_shared.ts
  (buildChoiceTask / buildOrderTask / buildCategorizeTask / pick / pickN / shuffle)
- výpočetní fyzika:                 src/content/grade-6/fyzika/mereniDelky.ts
- MATEMATIKA: stavba úlohy jako mereniDelky.ts, ale helpery VÝHRADNĚ z src/content/grade-6/matematika/_shared.ts
  (cis, uhel, rnd, pick, buildChoiceTask → vrací null při < 3 různých distraktorech, losUlohy, ruzneUlohy).
  Generátor: gen(level) = ruzneUlohy(() => losUlohy(genLx)). Soubor do src/content/grade-6/matematika/<camelCase>.ts,
  id "g6-mat-<kebab>-6", subject "matematika". Ten _shared.ts NEEDITUJ (sdílí ho celá dávka).

- PŘÍRODOPIS: stavba jako dějepisné vzory (historickePrameny.ts pro categorize, periodizaceLetopocet.ts pro select_one),
  ale helpery VÝHRADNĚ z src/content/grade-6/prirodopis/_shared.ts (buildChoiceTask → null při < 3 distraktorech,
  buildOrderTask, buildCategorizeTask, losUlohy, ruzneUlohy, pick, pickN, shuffle). Ten _shared.ts NEEDITUJ.
  Soubor do src/content/grade-6/prirodopis/<camelCase>.ts, id "g6-pri-<kebab>-6", subject "prirodopis".
  Generátor: gen(level) = ruzneUlohy(() => losUlohy(genLx)) (u order/categorize bez losUlohy).

PRAVIDLA PRO PŘÍRODOPIS:
- Fakta jen ta, na kterých se shodují běžné učebnice přírodopisu 6. ročníku (Fraus, Nová škola, SPN).
  Zjednodušení smí být, nepravda ne (houby NEJSOU rostliny; viry NEJSOU organismy v běžném smyslu —
  formuluj „nemají buněčnou stavbu"; lišejník = soužití houby a řasy/sinice).
- Distraktor = typická miskoncepce šesťáka (pavouk je hmyz, antibiotika na virózu, klíště je hmyz,
  žížala je had/hmyz, medúza je ryba, mech má kořeny, houba dělá fotosyntézu), ne náhodný pojem odjinud.
- Zástupci jen z české přírody nebo všeobecně známí (trepka, měňavka, nezmar, škeble, hlemýžď, sépie…).
  Latinské názvy nepoužívej jako klíč.
- Zdraví (jedovaté houby, klíšťata, nemoci) — správné rady (houbu neznáš = netrhej; klíště vytáhnout
  celé, místo sledovat; na viry antibiotika nezabírají). Žádná rada, která by mohla ublížit.
- Pořadí (drag_order) jen tam, kde je pořadí jednoznačné (vývoj hmyzu, práce s mikroskopem, geologická éra).
- L3 = přenos: poznej organismus z popisu znaků, rozhodni o neznámém případu, spoj znak s funkcí.

- ZEMĚPIS: stavba jako přírodopis (faktická témata) nebo mereniDelky.ts (výpočty), ale helpery VÝHRADNĚ
  z src/content/grade-6/zemepis/_shared.ts (buildChoiceTask → null při < 3 distraktorech; s parts.solutionSteps
  = výpočetní úloha; buildOrderTask, buildCategorizeTask, losUlohy, ruzneUlohy, pick, pickN, shuffle, rnd,
  cis = číslo česky, sirka(st, min) = „50° s. š.", delka(st, min) = „14° v. d.", meritko(n) = „1 : 50 000",
  cas(h, min) = „21:00" s přetečením přes půlnoc). Ten _shared.ts NEEDITUJ.
  Soubor do src/content/grade-6/zemepis/<camelCase>.ts, id "g6-zem-<kebab>-6", subject "zemepis".
  Generátor: gen(level) = ruzneUlohy(() => losUlohy(genLx)) (u order/categorize bez losUlohy).

PRAVIDLA PRO ZEMĚPIS:
- K obsahu NEJSOU mapy ani obrázky. Úloha musí jít vyřešit ze slov: poloha přes souřadnice, sousedství,
  světadíl, oceán; žádné „podívej se na mapu" ani „na obrázku". Mapové značky popiš slovy (modrá čára = řeka).
- Fakta jen ta, na kterých se shodují školní atlasy a učebnice zeměpisu 6. ročníku (Fraus, Nová škola, SPN).
  Čísla (výšky, délky řek, rozlohy) jen zaokrouhlená a nesporná; kde se zdroje liší (délka Nilu, výška
  Kilimandžára na metr), NEdávej přesné číslo jako klíč — ptej se na pořadí nebo řád.
- Klíč nesmí záviset na aktuálním dění (počet obyvatel na milion, HDP, hlavní město po přejmenování).
  Politická fakta jen stálá (Austrálie je stát i světadíl; Antarktida nepatří žádnému státu — Antarktická smlouva).
- Distraktor = typická miskoncepce šesťáka: léto = Země blíž Slunci; rovník prochází Evropou; na jižní
  polokouli je v prosinci zima; Grónsko je světadíl; Arktida je pevnina; tučňáci žijí v Arktidě;
  lední medvědi v Antarktidě; s. š. ↔ v. d.; poledníky ↔ rovnoběžky; východ = čas dřív; Sahara = jen písek;
  měřítko 1 : 50 000 → 1 cm = 50 km. Ne náhodný pojem odjinud.
- Výpočty (měřítko, časová pásma, rozdíl souřadnic): čísla přes cis(), výsledky celé nebo s jedním
  desetinným místem, převod jednotek (cm → m → km) ukázaný v solutionSteps. Distraktor = výsledek konkrétní
  chyby ze STEJNÝCH čísel (zapomenutý převod o řád, sečtené místo odečtené, posun času špatným směrem,
  přičtení místo odečtení pásem, 15° na hodinu zaměněné).
- Časová pásma pro 6. ročník zjednodušeně: 15° délky = 1 hodina, na východ je později. Letní čas
  a nepravidelné hranice pásem NEpoužívej v klíči (nebo výslovně řekni „bez letního času").
- Roční doby: příčinou je sklon zemské osy, NE vzdálenost od Slunce. Obratníky 23,5°, polární kruhy 66,5°.
- Regiony (Afrika, Austrálie a Oceánie, polární oblasti): L1 poloha a přírodní fakta, L2 souvislosti
  (podnebí → vegetace → život lidí), L3 přenos: poznej oblast z popisu, rozhodni o neznámém místě podle
  souřadnic a podnebí, vysvětli problém (dezertifikace, sucho, tání ledu) příčinou.
- Endemity a zvířata jen všeobecně známá (klokan, koala, ptakopysk, emu, tučňák císařský, lední medvěd, mrož).

- ČEŠTINA: stavba jako přírodopis (faktická/pojmová témata), helpery VÝHRADNĚ z src/content/grade-6/cjl/_shared.ts
  (buildChoiceTask → null při < 3 distraktorech, buildOrderTask, buildCategorizeTask, losUlohy, ruzneUlohy, pick,
  pickN, shuffle). Ten _shared.ts NEEDITUJ. Soubor do src/content/grade-6/cjl/<camelCase>.ts,
  id "g6-cjl-<kebab>-6" (konvence šestky), rvpNodeId = celé rvpId, subject "čeština"
  (s diakritikou, jako src/content/grade-5/cjl/*). Generátor: gen(level) = ruzneUlohy(() => losUlohy(genLx)).
  Navazuj na hotový obsah: src/content/grade-5/cjl/ (slovní druhy, přídavná jména, slovesné způsoby, zájmena,
  slova jednoznačná/mnohoznačná) a src/content/grade-4/cjl/ (_vzory.ts, vzory podstatných jmen, časování).
  L1 smí být rozcvička z 5. ročníku, L2/L3 musí jít za ni (vzory předseda/soudce, kategorie vidu, slovesné třídy…).

PRAVIDLA PRO ČEŠTINU:
- Mluvnice podle Pravidel českého pravopisu a běžných učebnic 6. ročníku (Fraus, SPN, Nová škola).
  Slovesné třídy a vzory podle kmene přítomného (1. tř. nese/bere/maže/peče/umře, 2. tiskne/mine/začne,
  3. kryje/kupuje, 4. prosí/trpí/sází, 5. dělá). Kde učebnice počítají jinak (počet vzorů 1. třídy), NEdávej
  sporný bod jako klíč.
- KAŽDÝ vzorový/klíčový tvar ověř nahlas: vyskloňuj/vyčasuj slovo celé a teprve pak vyber tvar. Žádné ne-slovo
  v otázce ani mezi možnostmi, pokud úloha výslovně netestuje chybný tvar (a i pak jen tvar, který dítě reálně napíše).
- Ptej se na slovo, které NENÍ samo vzorem (u „podle kterého vzoru se skloňuje…" nikdy slovo „předseda",
  „pán", „žena" — klíč by stál v zadání). Stejně u slovních druhů: klíč nesmí být pojmenovaný v otázce.
- Slovo vždy ve VĚTĚ, kde je slovní druh / pád / význam jednoznačný. Homonyma a přechodné případy (vedle = předložka
  × příslovce, to = zájmeno × částice, „ráno" podst. jm. × příslovce) jen tam, kde je rozhoduje kontext věty,
  a právě to je cílem L3 — nikdy jako holé slovo bez věty.
- Mluvnické kategorie v tabulce učebnic: podst. jm. = rod (u mužského životnost), číslo, pád, vzor; sloveso = osoba,
  číslo, čas, způsob, vid (+ třída a vzor). Rod střední nemá životnost. Vid: dokonavé nemá přítomný čas (udělám = budoucí).
- Slovní zásoba: synonyma/antonyma/homonyma jen s jednoznačným párem v kontextu (hrubý papír × jemný, hrubý člověk ×
  zdvořilý). Homonymum ≠ mnohoznačné slovo — pokud to rozlišuješ, drž se učebnicové definice (homonyma = shodná forma,
  významy nesouvisí: kolej, los, jeřáb). Obohacování slovní zásoby = tvoření slov (odvozování, skládání, zkracování),
  přejímání, zkratky/zkratková slova — příklady ověřené, ne vymyšlené.
- Distraktor = typická chyba šesťáka: vzor podle zakončení místo rodu (předseda → žena), soudce ↔ muž, kost ↔ píseň,
  příslovce ↔ přídavné jméno, číslovka ↔ podst. jm. (sto, pětka), předložka ↔ příslovce, dokonavé sloveso v přítomném čase,
  synonymum ↔ antonymum, homonymum ↔ synonymum. Ne náhodný pojem.
- Formát: select_one / categorize / multi_select. Volný text (doplň) workflow nedovoluje; pravopisnou doplňovačku
  s grafémy (i/y) NEDĚLEJ — těžiště je v tvarosloví, skladbě a slovní zásobě.
- Žádné obrázky ani zvuk. Věty v úlohách přirozené, ze života 11–12letých, bez archaismů; jména střídej.

PRAVIDLA PRO ČEŠTINU — SKLADBA (větné členy):
- Navazuj na src/content/grade-4/cjl/stavbaVetyZakladniSkladebniDvojicePodmetPrisudek.ts a grade-5/cjl/
  (podmetVyjadrenyNevyjadrenyNekolikanasobny.ts, shodaPrisudkuSPodmetem.ts). L1 smí být podmět/přísudek, L2/L3 za ně.
- Terminologie učebnic 6. ročníku: podmět (vyjádřený/nevyjádřený), přísudek slovesný / jmenný se sponou, předmět,
  příslovečné určení místa, času, způsobu, příčiny (míry a účelu jen na L3), přívlastek shodný × neshodný, doplněk.
  Otázky na větné členy: předmět = pádové otázky kromě 1. pádu (koho/co, komu/čemu…), PU = kde/kdy/jak/proč, přívlastek =
  jaký/který/čí, doplněk = na dva členy zároveň (podmět/předmět + přísudek). Věty „rozvíjející × základní".
- Větný člen se určuje JEN ve větě, kde je jednoznačný. Vyhni se učebnicově sporným případům jako klíči:
  předmět × PU u předložkových vazeb (mluvil o škole = předmět × šel do školy = PU) dávej jen v jasných, typických
  větách; doplněk jen v prototypech (Vrátil se unavený. Zvolili ho předsedou. Viděl ho utíkat.); přívlastek × doplněk
  jen tam, kde je rozdíl zjevný z věty. Zkoumaný člen VYZNAČ v zadání (velkými písmeny nebo uvozovkami), ať je jasné,
  které slovo/sousloví se určuje; u víceslovných členů zvýrazni celé sousloví („na starém mostě").
- Přívlastek rozvíjí podstatné jméno a je součástí toho členu, který rozvíjí — neptej se, zda je přívlastek „samostatný
  základní člen". Přísudek jmenný se sponou (Petr je lékař / byl nemocný) — spona + jméno = celý přísudek.
- Distraktor = typická chyba šesťáka: předmět ↔ podmět u 4. pádu (Míč kopl Tomáš), PU místa ↔ předmět, přívlastek
  shodný ↔ neshodný, přívlastek ↔ doplněk, PU způsobu ↔ přívlastek, pádová otázka z předložky místo z tvaru, zaměnit
  kdy/kde. Ne náhodný pojem.
- Nezávislý solver: tabulka věta → vyznačený člen → správný větný člen (a druh PU); test ověří, že klíč z generátoru
  sedí s tabulkou a že vyznačené slovo ve větě opravdu je.

PRAVIDLA PRO ČEŠTINU — ZVUKOVÁ STRÁNKA JAZYKA (bez zvuku!):
- Zvukové soubory NEJSOU a nebudou. Vše řešitelné z psaného textu: na kterou slabiku padá přízvuk (česky na první,
  předložka přebírá přízvuk: NA stole, DO lesa), přízvukový takt, jaká melodie (intonace) patří k větě oznamovací
  (klesavá), tázací doplňovací (klesavá: Kdo přišel?), zjišťovací (stoupavá: Přišel?), kde udělat pauzu (frázování
  podle smyslu a interpunkce), co zdůraznit (větný přízvuk / důraz mění smysl — zvýrazněné slovo ve větě).
- Spisovná výslovnost psaná PŘEPISEM v hranatých závorkách, jak ho dělají učebnice: spodoba znělosti ([ret] = led,
  [kfjet] = květ, [sfatba] = svatba), di/ti/ni → [ďi], dě/tě/ně/mě/bě/pě/vě ([mňesto] = město), ě po b/p/v = [je],
  ou jako dvojhláska, dvě stejné souhlásky ve slově vyslovujeme jako jednu (měkký [mňekí]), ráz před samohláskou
  po předložce (v Americe). Spisovná × nespisovná výslovnost jen s jasnou odpovědí z učebnic ([mňesto] je spisovně;
  [mlíko], [vokno], [dobrej] jsou nespisovné). Sporné jevy (míra rázu, výslovnost cizích slov, zdvojení na švu předpony) NEdávej jako klíč.
- Každý fonetický přepis OVĚŘ písmeno po písmenu (spodoba jde podle poslední souhlásky ve skupině; na konci slova
  před pauzou se znělá mění v neznělou: had [hat], hrad [hrat], lev [lef]). Přepis bez háčkových chyb — ď, ť, ň.
- Modulace souvislé řeči = tempo, síla hlasu, pauzy, důraz podle situace (hlášení v rozhlase × vyprávění kamarádovi).
  Úlohy: vyber, jak přednést danou větu v dané situaci; kam umístit pauzu, aby věta dávala smysl
  (Jíst, nečekat. × Jíst ne, čekat.); které slovo zdůraznit, aby věta odpověděla na danou otázku.
- Distraktor = typická chyba: přízvuk na předložce opomenutý / na druhé slabice (anglicky/polsky), stoupavá melodie
  u doplňovací otázky, přepis bez spodoby ([hrad]), spodoba opačným směrem, pauza rozdělující sousloví.
- Nezávislý solver: pro přepis mechanická funkce spodoby na konci slova a v souhláskové skupině (jen pro slova v bance);
  pro intonaci klasifikace věty podle tázacího slova / otazníku.

PRAVIDLA PRO ČEŠTINU — SLOH A ČTENÍ (komunikační a slohová výchova):
- Sloh NENÍ psaní slohu: inputType "essay" neexistuje, žák nic nepíše. Úlohy = poznat, seřadit, vybrat, roztřídit:
  část dopisu (oslovení, úvod, jádro, závěr, pozdrav, podpis; u úředního adresa odesílatele/adresáta, místo a datum,
  věc, podpis), vhodná formulace pro úřední × soukromý dopis (Vážený pane řediteli × Ahoj Petře), seřaď kompozici
  vyprávění (úvod – zápletka – vyvrcholení – obrat – závěr), rozliš popis prostý × odborný × umělecký podle ukázky,
  zpráva × oznámení (zpráva = o tom, co se STALO; oznámení = o tom, co se STANE — kdo, co, kdy, kde).
- Navazuj na grade-4/5 cjl (dopisPsaniSoukromehoDopisu, dopisUredniZadostTiskopisy…, popis…, vypravovani…,
  vyhledavaniKlicovychSlov…, studijniCteniAVecneCteni). L1 smí být rozcvička z 5. ročníku, L2/L3 za ni.
- Krátké ukázky (2–5 vět) napiš SÁM, přirozeně, ze života 11–12letých; žádné citace chráněných textů.
  Banka ≥ 8 různých ukázek na úroveň (rotuj), ne jedna ukázka s obměnou otázky.
- Klíčová slova / hlavní myšlenka: ukázka musí mít JEDNU jasnou hlavní myšlenku; distraktory = detail z textu,
  příliš obecné tvrzení, tvrzení, které v textu není (typická chyba: vybrat první větu, vybrat zajímavý detail).
- Věcné čtení: jízdní řád, návod, leták, tabulka — převyprávěj slovy v zadání (žádné obrázky), otázka musí jít
  jednoznačně vyčíst. Čísla a časy konzistentní s ukázkou (ověř).
- Distraktor = typická chyba: úřední dopis s hovorovým oslovením, chybějící věc/datum, zpráva ↔ oznámení (čas děje),
  popis prostý ↔ odborný (odborné termíny, míry), umělecký popis ↔ vyprávění, zápletka ↔ vyvrcholení.
- Nápověda navádí na znak (čas děje, adresát, míra termínů), neprozrazuje zařazení.
- Formát: select_one / categorize / multi_select; drag_order (buildOrderTask) smíš pro pořadí částí dopisu nebo
  kompozici vyprávění — téma ale typy NEMÍCHÁ (celé téma jeden typ, viz Cause C). Ano/Ne jen L1.
- Pozor na jazyk ukázek: úřední dopis spisovně a zdvořile (Vážená paní, S pozdravem), soukromý přirozeně
  (Ahoj, Měj se). Žádná ukázka nesmí obsahovat reálnou adresu, telefon či e-mail — jen zjevně smyšlené.

OBECNĚ — DETERMINISMUS: generátor nesmí mít stav mezi voláními (žádné „let" počítadlo na úrovni modulu,
které se jen zvyšuje). Rotaci šablon nastav na začátku gen() — hlídá to src/test/generator-determinism.test.ts.

PRAVIDLA PRO MATEMATIKU:
- Čísla v textu VŽDY přes cis() (česká čárka, mezera v tisících), úhly přes uhel(). Nikdy String(n) ani toFixed.
- Desetinné výsledky jen jako možnosti select_one (číselné pole zahodí čárku). Výsledky „čisté" — nejvýš 2 desetinná místa, bez periody.
- Rozsah RVP 6. ročníku; navazuje na src/content/grade-5/matematika — L1 smí být rozcvička z 5. ročníku, L2/L3 ne.
  Zlomky, procenta, záporná čísla v počtech a rovnice sem NEPATŘÍ (7. ročník).
- Geometrie bez obrázku: zadání musí jít vyřešit ze slov (rozměry, velikosti úhlů, popis). Žádné „podívej se na obrázek".
- Distraktor = výsledek konkrétního chybného postupu (čárka posunutá o řád, sečtené místo vynásobené, 60 ↔ 100 u minut,
  obvod místo obsahu, povrch jen tří stěn, nsn ↔ NSD, zapomenutý prvočinitel…), spočítaný z TĚCH SAMÝCH čísel.
- Slovní úlohy: jména a reálie střídej, čísla realistická (cena, délka, hmotnost). Jednotka ve všech možnostech stejná.
- NÁLEZY KRITIKŮ Z 1. DÁVKY MATEMATIKY (16. 9.) — napiš rovnou správně:
  • Mocniny ani zápis 2³ šesťák nezná (RVP 8. roč.) — piš 2 · 2 · 2 a „tolikrát, kolikrát…".
  • optionFeedback musí platit pro KAŽDOU vylosovanou kombinaci, ne jen typickou („dělíš číslem menším než 1…" u dělitele 2,5 je lež).
    Podmíněné tvrzení → podmíněný text. Feedback pojmenuje chybu slovníkem úrovně (na L1 bez pojmů z L2).
  • Peníze vždy se dvěma desetinnými místy (24,80 Kč) a realistické ceny podle zboží.
  • L3 nesmí jít vyřešit vylučováním ani vzorem (jediná možnost končící 5; klíč vždy jediné velké číslo; klíč daný polohou *).
  • Každá úloha tématu musí obsahovat to, co téma procvičuje (téma desetinných čísel = desetinné číslo v každé úloze).
  • Šablony střídej rovnoměrně (ne 5 ze 6 úloh L1 stejný typ); u slovních úloh ≥ 4 různé kontexty na úroveň.
  • Čeština: s 2–4 „byly tři", ne „bylo jich 3"; „kus" jen u věcí, které se tak počítají; žádné useknuté věty.
  • Vysvětlení nesmí být tautologie („5 560 = 5 560 + 0") a mezikrok s koncovou nulou ukaž (0,120 = 0,12).
- Test: nezávislý solver PARSUJE čísla ze znění otázky (ne z parametrů generátoru) a spočítá klíč jinou cestou
  (např. NSD Euklidem vs. rozklad v generátoru; objem a·b·c vs. součet vrstev).

PRAVIDLA Z 13.–14. 9. 2026 (kontroly je chytí při integraci — napiš to rovnou správně):
- ODBORNÉ TYPY: přečti docs/CONTENT_AUTHORING.md §6.4. timeline: timelineEvents = pool, correctAnswer = labely ve správném
  pořadí spojené "|". numeric_range smíš použít (letopočet), jen CELÁ čísla. image_select ani diagram_label NEPOUŽÍVEJ (nejsou obrázky).
- ≥12 RŮZNÝCH úloh na každou úroveň — deterministicky, ne losováním a doufáním (vzor ruzneUlohy() v src/content/grade-6/fyzika/_shared.ts).
- Klíč NESMÍ být systematicky výrazně nejdelší možnost (check:length). Distraktory piš stejně dlouhé a stejně konkrétní jako klíč.
- Klíč NESMÍ vyčnívat tvarem: když 3 distraktory začínají stejným slovem („Protože…", „Jen…"), musí tak začínat i klíč (check:options).
- Ano/Ne (true_false) jen na L1.
- Nápověda nesmí jmenovat prvky řešení (u drag_order/categorize/timeline ani pravou stranu dvojice). hints[0] i hints[1] unikátní pro úlohu.
- Správná odpověď se nesmí vyskytovat ve znění otázky.
- Předložka + dosazené jméno: pád ulož jako vlastní pole, nelep předložku k holému jménu (dřív vznikalo „z sklo", „u jantar").
- Čeština: žádné rodové lomítkové tvary (sám/sama). Po dosazení do šablony ověř shodu.
- category = labels.AREA, topic = labels.TOPIC (NE subtopic — podtéma je jen v rvpNodeId a title).
  Příklad: rvpId g6-prirodopis-biologie-hub-houby-a-lisejniky-lisejniky-… → category "Biologie hub", topic "Houby a lišejníky".
- category a topic ZNAK PO ZNAKU podle data/rvp_data.json (pomlčka "-", ne "–"). Témata téhož RVP topicu
  sdílí klíč pro zajímavost (src/lib/topicInsight.ts) a dětský název (src/content/grade-N/displayNames.ts);
  jiný znak = rozdělené téma bez zajímavosti. Ty soubory needituj, jen drž přesný zápis.
- Historická fakta jen ta, na kterých se shodují běžné učebnice 6. ročníku; sporné datace formuluj s „asi/kolem" nebo nepoužívej jako klíč.

DŮLEŽITÉ:
- Téma NEregistruj do index.ts (kolize). Registraci dělá architekt při integraci.
- RVP id, dětský studentTitle, briefDescription (max 14 slov), category/topic dle RVP datasetu.
`

// ── Schémata strukturovaného výstupu ───────────────────────────────────────
const SPEC_SCHEMA = {
  type: 'object',
  properties: {
    rvpId: { type: 'string' },
    skill: { type: 'string', description: 'Jedna jasná dovednost, kterou téma procvičuje.' },
    inputType: { type: 'string', description: 'Nejvhodnější typ úlohy.' },
    levels: {
      type: 'object',
      properties: { L1: { type: 'string' }, L2: { type: 'string' }, L3: { type: 'string' } },
      required: ['L1', 'L2', 'L3'],
    },
    errorModel: {
      type: 'array',
      description: '3–4 typické omyly žáka → z nich budou distraktory.',
      items: { type: 'object', properties: { mistake: { type: 'string' }, distractor: { type: 'string' } }, required: ['mistake', 'distractor'] },
    },
    factSource: { type: 'string', description: 'Zdroj faktů (RVP/učebnice); u výpočetních pravidlo.' },
    solverCheck: { type: 'string', description: 'Co má nezávislý solver v testu ověřit.' },
    isFactual: { type: 'boolean', description: 'true = faktické téma (potřebuje fakt-experta).' },
    file: { type: 'string', description: 'Navržená cesta souboru.' },
    exportName: { type: 'string', description: 'Navržený název export konstanty (UPPER_SNAKE).' },
  },
  required: ['rvpId', 'skill', 'inputType', 'levels', 'errorModel', 'solverCheck', 'isFactual', 'file', 'exportName'],
}

const AUTHOR_SCHEMA = {
  type: 'object',
  properties: {
    topicId: { type: 'string' },
    file: { type: 'string' },
    test: { type: 'string' },
    exportName: { type: 'string' },
    gatePassed: { type: 'boolean', description: 'Prošla brána 0 (strukturálně)?' },
    blockingErrors: { type: 'array', items: { type: 'string' } },
    reviewFindings: { type: 'array', items: { type: 'string' }, description: 'Heuristické audit nálezy k adjudikaci pedagogem.' },
  },
  required: ['topicId', 'file', 'test', 'exportName', 'gatePassed'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    realDefects: {
      type: 'array',
      items: { type: 'object', properties: { where: { type: 'string' }, what: { type: 'string' }, fix: { type: 'string' } }, required: ['what', 'fix'] },
    },
    verdict: { type: 'string', description: 'PŘIJMOUT nebo OPRAVIT.' },
  },
  required: ['realDefects', 'verdict'],
}

// ── Prompty agentů ─────────────────────────────────────────────────────────
const planPrompt = (t) => `Jsi zkušený učitel 2. stupně ZŠ. Pro RVP podtéma "${t.rvpId}"${t.label ? ` (${t.label})` : ''} navrhni plán cvičení.
${STANDARDS}
Vrať: (1) JEDNU jasnou dovednost; (2) typ úlohy a proč; (3) gradaci L1→L3 (konkrétně CO žák na každé úrovni dělá); (4) CHYBOVÝ MODEL — 3–4 typické omyly, které žák reálně dělá, a jaký distraktor z nich vznikne; (5) zdroj faktů / pravidlo; (6) co má ověřit nezávislý solver; (7) isFactual; (8) cestu souboru a název exportu. Mysli jako učitel připravující hodinu pro 11–12leté.`

const authorPrompt = (spec) => `Jsi autor obsahu cvičení. Podle TÉTO specifikace napiš hotové soubory:
SPEC: ${JSON.stringify(spec)}
${STANDARDS}
Postup:
1. Otevři odpovídající ZLATÝ VZOR (dle inputType) a _shared.ts a drž jejich strukturu i styl.
2. Napiš téma do "${spec.file}" (export "${spec.exportName}") + test do src/content/grade-6/__tests__/ s NEZÁVISLÝM SOLVEREM dle spec.solverCheck.
3. Spusť BRÁNU 0:  node scripts/audit-topic.mjs --file ${spec.file} --export ${spec.exportName} <cesta_k_testu>
   - Pokud hlásí "✗ FAIL" (strukturální vada / pád solveru) → oprav a spusť znovu. Max 2 pokusy.
   - Heuristické nálezy "k revizi" (hint_leak na jednotku, hint_progression) NEOPRAVUJ na sílu — nech je pedagogovi.
4. Vrať: topicId, file, test (cesta), exportName, gatePassed (bool), blockingErrors (pokud zůstaly), reviewFindings (řádky z bloku "REVIZE").
⛔ NEEDITUJ ŽÁDNÉ SDÍLENÉ SOUBORY — index.ts, PROJECT_STATUS.md, PENDING_CHANGES.md, STATUS.md.
   (I když to říká CLAUDE.md — v tomto workflow to NEPLATÍ; sdílené soubory aktualizuje architekt
   při integraci, jinak by se paralelní agenti o soubor poprali.) Tvůj výstup = JEN nový .ts soubor
   tématu + jeho test + strukturovaný návrat.`

const zakPrompt = (a) => `Jsi 11–12letý žák 6. třídy. V souboru .audit-topic/${a.topicId}.json je pole "samples" (úlohy po úrovních).
Vezmi z každé úrovně 2–3 úlohy a vyřeš je NASLEPO — IGNORUJ pole "correctAnswer"/"items"/"categories" jako klíč, řeš jen ze zadání a možností, tím co zná šesťák.
Pak u každé řekni UPŘÍMNĚ: (1) co bys vybral; (2) bylo JASNÉ, co se chce? (když ne, proč); (3) která špatná možnost tě lákala; (4) je tam slovo, kterému nerozumíš; (5) je to nudné/pořád stejné?
Teprve POTOM porovnej s klíčem v souboru. Každou neshodu (tvá odpověď ≠ klíč) nebo zmatek nahlas jako realDefect. Mluv jako dítě, nepředstírej víc, než šesťák ví. verdict = OPRAVIT, pokud ses někde nezvládl rozhodnout nebo nerozuměl; jinak PŘIJMOUT.`

const pedagogPrompt = (a) => `Jsi přísný učitel, co kontroluje pracovní list před tiskem. Default "hledej vadu".
Soubor tématu: ${a.file}. Vzorek instancí: .audit-topic/${a.topicId}.json (pole "samples", s klíčem).
U výpočetního tématu NEJDŘÍV sám přepočítej klíč u KAŽDÉ úlohy ve vzorku (bez pohledu do generátoru) a každou neshodu hlas jako realDefect.
Posuď 7 kritérií: řešitelnost, jednoznačnost, realističnost, čistý výsledek, KAŽDÝ distraktor = reálný omyl (ne náhoda), nápověda učí metodu (neprozrazuje), vysvětlení ukazuje PROČ. Navíc: sedí na RVP dovednost? jazyk pro 11–12 let? roste obtížnost L1→L3 reálně?
ADJUDIKUJ heuristické audit nálezy (mohou být falešné poplachy): ${JSON.stringify(a.reviewFindings || [])}
— u každého rozhodni, zda je to REÁLNÁ vada (pak realDefect), nebo falešný poplach checku (např. hint_leak na jednotku "století", kde se rozlišující číslo neprozrazuje → ignoruj).
Vrať realDefects (where/what/fix) + verdict PŘIJMOUT/OPRAVIT.`

const faktPrompt = (a) => `Jsi odborník na daný předmět. Soubor: ${a.file}. Vzorek: .audit-topic/${a.topicId}.json.
Fakt-check KAŽDÉ tvrzení v zadáních, distraktorech, optionFeedback i vysvětleních. Každý faktický omyl (co je špatně + správně) a každé sporné/zjednodušené-až-chybné tvrzení nahlas jako realDefect s návrhem opravy. verdict = OPRAVIT při jakékoli faktické vadě, jinak PŘIJMOUT.`

const fixPrompt = (a, defects) => `Dostáváš soubor tématu a potvrzené vady od žáka/pedagoga/fakt-experta. Oprav je.
Soubor: ${a.file} · test: ${a.test} · export: ${a.exportName}
VADY (sloučeno): ${JSON.stringify(defects)}
Priorita: cokoli, kde se žák zasekl NEBO faktická chyba. Zachovej, co funguje. Po opravě spusť bránu 0:
  node scripts/audit-topic.mjs --file ${a.file} --export ${a.exportName} ${a.test}
Musí projít (✓ PASS) a test/solver nesmí spadnout.
⛔ NEEDITUJ sdílené soubory (index.ts, PROJECT_STATUS.md, PENDING_CHANGES.md, STATUS.md) — jen soubor tématu a jeho test.
Vrať souhrn: co jsi změnil a finální gatePassed.`

// ── Pipeline: každé téma protéká nezávisle (bez bariéry mezi tématy) ───────
const results = await pipeline(
  topics,
  // 1) SPEC
  (t) => agent(planPrompt(t), { label: `spec:${t.rvpId.slice(0, 28)}`, phase: 'Spec', schema: SPEC_SCHEMA }),
  // 2) AUTHOR + brána 0
  //    Pozor: agent() vrací null, když subagent zemře (terminal API error po retry).
  //    Nikdy nevracíme bare null — vracíme sentinel s rvpId (z originalItem `t`),
  //    aby téma NEZMIZELO tiše, ale objevilo se v needsReview jako 'failed'.
  (spec, t) => {
    if (!spec) return { rvpId: t.rvpId, status: 'failed', stage: 'spec', reason: 'plánovač vrátil null (agent zemřel / schema fail)' }
    // t.authorModel (volitelné) — autorskou práci lze pustit na levnější model, kritici zůstávají na modelu relace.
    return agent(authorPrompt(spec), { label: `author:${spec.exportName}`, phase: 'Author', schema: AUTHOR_SCHEMA, ...(t.authorModel ? { model: t.authorModel } : {}) })
      .then((a) => (a ? { spec, author: a } : { rvpId: t.rvpId, status: 'failed', stage: 'author', reason: 'autor vrátil null (agent zemřel / schema fail)' }))
  },
  // 3) VERIFY — dvojí optika (+ fakt u faktických), paralelně
  (prev) => {
    if (!prev || !prev.author) return prev
    const a = prev.author
    if (!a.gatePassed) {
      log(`⛔ ${a.topicId}: brána 0 neprošla (${(a.blockingErrors || []).join('; ')}) → needs_review, přeskakuji kritiky.`)
      return { ...prev, verdicts: [], needsReview: true }
    }
    const critics = [
      () => agent(zakPrompt(a), { label: `žák:${a.topicId.slice(0, 24)}`, phase: 'Verify', schema: VERDICT_SCHEMA }),
      () => agent(pedagogPrompt(a), { label: `pedagog:${a.topicId.slice(0, 20)}`, phase: 'Verify', schema: VERDICT_SCHEMA }),
    ]
    if (prev.spec && prev.spec.isFactual) {
      critics.push(() => agent(faktPrompt(a), { label: `fakt:${a.topicId.slice(0, 24)}`, phase: 'Verify', schema: VERDICT_SCHEMA }))
    }
    // Kritik, který zemřel (limit relace), vrací null. Bez téhle kontroly téma
    // s nulou vad prošlo jako „accepted", i když ho nikdo nečetl (přírodopis 16. 9.).
    return parallel(critics).then((vs) => {
      const verdicts = vs.filter(Boolean)
      return { ...prev, verdicts, criticsMissing: critics.length - verdicts.length }
    })
  },
  // 4) FIX — jen pokud kritici našli reálné vady
  (prev) => {
    if (!prev || !prev.author) return prev
    if (prev.needsReview) return { topicId: prev.author.topicId, file: prev.author.file, status: 'needs_review', reason: 'brána 0 neprošla' }
    const a = prev.author
    if (prev.criticsMissing > 0) {
      log(`⛔ ${a.topicId}: ${prev.criticsMissing} kritik(ů) nedoběhlo → failed (obnov přes resumeFromRunId).`)
      return { topicId: a.topicId, file: a.file, status: 'failed', stage: 'verify', reason: `nedoběhlo kritiků: ${prev.criticsMissing}` }
    }
    const defects = (prev.verdicts || []).flatMap((v) => (v && v.realDefects) || [])
    const mustFix = (prev.verdicts || []).some((v) => v && v.verdict === 'OPRAVIT') && defects.length > 0
    if (!mustFix) {
      return { topicId: a.topicId, file: a.file, test: a.test, exportName: a.exportName, status: 'accepted', defects: 0 }
    }
    return agent(fixPrompt(a, defects), { label: `fix:${a.topicId.slice(0, 26)}`, phase: 'Fix' })
      .then((summary) => (summary
        ? { topicId: a.topicId, file: a.file, test: a.test, exportName: a.exportName, status: 'fixed', defects: defects.length, fixSummary: summary }
        : { topicId: a.topicId, file: a.file, status: 'failed', stage: 'fix', reason: `opravář nedoběhl, neopraveno vad: ${defects.length}` }))
  },
)

// ── Souhrn pro architekta (integraci dělá main loop, ne workflow) ──────────
const done = results.filter(Boolean)
const accepted = done.filter((r) => r.status === 'accepted' || r.status === 'fixed')
const review = done.filter((r) => r.status === 'needs_review' || r.status === 'failed')
log(`Hotovo: ${accepted.length} přijato/opraveno, ${review.length} k ruční revizi (vč. ${done.filter((r) => r.status === 'failed').length} padlých agentů).`)

return {
  batch: topics.map((t) => t.rvpId),
  accepted: accepted.map((r) => ({ topicId: r.topicId, file: r.file, test: r.test, exportName: r.exportName, status: r.status, defects: r.defects })),
  needsReview: review,
  // integrace (main loop): registrace exportů do src/content/grade-6/index.ts,
  // globální tsc + audit + generator-validation + navigation, docs, commit.
  integrationHint: accepted.map((r) => ({ exportName: r.exportName, file: r.file })),
}
