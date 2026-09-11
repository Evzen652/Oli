import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku): každá úloha má vlastní nápovědy
// a zpětnou vazbu ke každé špatné možnosti. Vypadly úlohy s chybným nebo
// sporným klíčem („sám“ je ve školní mluvnici ukazovací, ne neurčité;
// „nikterak“ je příslovce; klíč „tázací nebo vztažné“ nešlo jednoznačně
// ověřit; „Nevím, jaký bude“ je nepřímá otázka, kde se mluvnice rozcházejí;
// otázka na „sobě“ ukazovala větu se „sebe“).
//
// L1 = druh u samostatného zájmena · L2 = druh zájmena ve větě (tvary,
// tázací × vztažné) · L3 = najdi větu s daným druhem, méně častá zájmena.

const L1: PracticeTask[] = [
  choice("Jaký druh zájmena je „nikdo“?", "záporné", [
    { value: "neurčité", why: "Neurčité je „někdo“ – připouští, že tu nějaká osoba je. „Nikdo“ to naopak popírá." },
    { value: "tázací", why: "Tázací je „kdo“ bez ni-. Předpona ni- mění otázku na zápor." },
    { value: "osobní", why: "Osobní zájmena zastupují konkrétní osobu (já, ty, on). „Nikdo“ říká, že tu osoba není." },
  ], {
    hints: ["Říká slovo „nikdo“, že tu nějaká osoba je, nebo že tu není?", "Všimni si začátku ni-. Stejně začínají slova nic a nijaký a všechna tři něco popírají."],
    explanation: "„Nikdo“ popírá, že by tu byla nějaká osoba, proto je to zájmeno záporné. Záporná zájmena poznáš podle začátku ni- nebo žá- (nikdo, nic, žádný).",
  }),
  choice("Jaký druh zájmena je „já“?", "osobní", [
    { value: "přivlastňovací", why: "Přivlastňovací je až „můj“ – to říká, komu věc patří. „Já“ označuje přímo osobu." },
    { value: "ukazovací", why: "Ukazovací zájmena (ten, tento) vybírají věc. „Já“ označuje toho, kdo mluví." },
    { value: "tázací", why: "Tázacím zájmenem se ptáme (kdo, co). „Já“ se na nic neptá." },
  ], {
    hints: ["Koho označuje slovo „já“?", "Slovo „já“ označuje přímo člověka, který mluví. Nic neukazuje, nic nepřivlastňuje a na nic se neptá."],
    explanation: "„Já“ zastupuje osobu, která mluví. Zájmena, která zastupují osoby (já, ty, on, ona, my, vy, oni), jsou osobní.",
  }),
  choice("Jaký druh zájmena je „můj“?", "přivlastňovací", [
    { value: "osobní", why: "Osobní je „já“. „Můj“ neoznačuje osobu, ale to, komu věc patří." },
    { value: "ukazovací", why: "Ukazovací by bylo „ten“ nebo „tento“. „Můj“ na věc neukazuje, říká, čí je." },
    { value: "neurčité", why: "Neurčité zájmeno (někdo, něco) označuje něco neznámého. U „můj“ víme přesně, komu věc patří." },
  ], {
    hints: ["Řekni „můj míč“. Co tím slovem o míči říkáš?", "Slovo „můj“ neoznačuje člověka, ale to, komu věc patří. Stejně fungují tvůj, náš nebo jejich."],
    explanation: "„Můj“ vyjadřuje, že věc patří mně. Zájmena, která říkají, komu něco patří (můj, tvůj, jeho, náš, jejich), jsou přivlastňovací.",
  }),
  choice("Jaký druh zájmena je „ten“?", "ukazovací", [
    { value: "osobní", why: "Osobní zájmena zastupují osoby (já, ty, on). „Ten“ vybírá určitou věc nebo osobu." },
    { value: "tázací", why: "Tázací by bylo „který“ v otázce. „Ten“ se neptá." },
    { value: "přivlastňovací", why: "Přivlastňovací je „můj“ nebo „tvůj“. „Ten“ neříká, komu věc patří." },
  ], {
    hints: ["Představ si, že při slově „ten“ ukážeš prstem. Co tím děláš?", "Slovem „ten“ vybereš jednu určitou věc: ten dům, a ne jiný. Stejnou práci dělají slova tento a onen."],
    explanation: "Zájmenem „ten“ ukazujeme na určitou věc nebo osobu, proto je ukazovací. Do stejné skupiny patří tento, tamten, onen, takový.",
  }),
  choice("Jaký druh zájmena je „kdo“?", "tázací", [
    { value: "osobní", why: "„Kdo“ osobu nezastupuje, ale ptá se na ni. Osobní by bylo „on“ nebo „ona“." },
    { value: "záporné", why: "Záporné je až „nikdo“ se začátkem ni-." },
    { value: "neurčité", why: "Neurčité je „někdo“ se začátkem ně-." },
  ], {
    hints: ["Kde slovo „kdo“ nejčastěji stojí — v otázce, nebo v oznámení?", "Kdo to byl? Kdo přijde? Slovo „kdo“ stojí na začátku otázky, protože se jím ptáme na osobu."],
    explanation: "Slovem „kdo“ se ptáme na osobu, proto je to zájmeno tázací. Tázací jsou i co, jaký, který, čí.",
  }),
  choice("Jaký druh zájmena je „někdo“?", "neurčité", [
    { value: "záporné", why: "Záporné je „nikdo“ – to by říkalo, že tu nikdo není. „Někdo“ tu je, jen nevíme kdo." },
    { value: "tázací", why: "Tázací je „kdo“ v otázce. „Někdo“ se neptá." },
    { value: "osobní", why: "Osobní zájmeno (on, ona) zastupuje osobu, o které víme. U „někdo“ nevíme, o koho jde." },
  ], {
    hints: ["Víme přesně, o koho jde, když řekneme „někdo“?", "„Někdo zazvonil“ — nějaká osoba tu byla, ale nevíme která. Stejně začínají slova něco a nějaký."],
    explanation: "„Někdo“ označuje osobu, kterou přesně neznáme, proto je to zájmeno neurčité. Neurčitá zájmena často začínají na ně- (někdo, něco, nějaký).",
  }),
  choice("Jaký druh zájmena je „ona“?", "osobní", [
    { value: "ukazovací", why: "Ukazovací zájmeno vybírá věc (ta, tamta). „Ona“ zastupuje osobu, o které mluvíme." },
    { value: "přivlastňovací", why: "Přivlastňovací by bylo „její“. „Ona“ neříká, komu něco patří." },
    { value: "vztažné", why: "Vztažné zájmeno připojuje větu (který, jenž). „Ona“ nic nepřipojuje." },
  ], {
    hints: ["Co zastupuje slovo „ona“ ve větě „Ona zpívá“?", "„Ona“ stojí místo jména ženy nebo dívky, třeba místo „Jana“. Zastupuje tedy osobu, o které mluvíme."],
    explanation: "„Ona“ zastupuje osobu, o které se mluví, proto je to zájmeno osobní. Díky němu nemusíme pořád opakovat jméno.",
  }),
  choice("Jaký druh zájmena je „tvůj“?", "přivlastňovací", [
    { value: "osobní", why: "Osobní je „ty“. „Tvůj“ neoznačuje tebe, ale to, že věc je tvoje." },
    { value: "ukazovací", why: "Ukazovací zájmena (ten, tento) vybírají věc. „Tvůj“ říká, komu patří." },
    { value: "tázací", why: "Tázací by bylo „čí“ v otázce. „Tvůj“ se neptá, odpovídá." },
  ], {
    hints: ["Komu patří „tvůj sešit“?", "Slovo „tvůj“ neoznačuje tebe, ale to, že věc je tvoje. Porovnej dvojici ty – tvůj: první slovo je osoba, druhé vlastnictví."],
    explanation: "„Tvůj“ vyjadřuje, že věc patří tobě, proto je to zájmeno přivlastňovací.",
  }),
  choice("Jaký druh zájmena je „tento“?", "ukazovací", [
    { value: "osobní", why: "Osobní zájmena zastupují osoby. „Tento“ vybírá určitou věc." },
    { value: "neurčité", why: "Neurčité by bylo „nějaký“. U „tento“ víme přesně, o kterou věc jde." },
    { value: "přivlastňovací", why: "„Tento“ neříká, komu věc patří. To by bylo „můj“ nebo „tvůj“." },
  ], {
    hints: ["Kterou věc myslíš, když řekneš „tento obrázek“ — jakoukoli, nebo určitou?", "„Tento“ vybírá jednu určitou věc, obvykle blízko nás. Patří do stejné skupiny jako ten a onen."],
    explanation: "Slovem „tento“ ukazujeme na určitou věc, proto je to zájmeno ukazovací.",
  }),
  choice("Jaký druh zájmena je „nic“?", "záporné", [
    { value: "neurčité", why: "Neurčité je „něco“ – připouští, že nějaká věc tu je. „Nic“ to popírá." },
    { value: "tázací", why: "Tázací je „co“ bez ni-. „Nic“ se neptá." },
    { value: "ukazovací", why: "Ukazovací zájmeno (to, tamto) vybírá věc. „Nic“ říká, že tu žádná věc není." },
  ], {
    hints: ["Když řekneš „Nic nevidím“, je tam něco k vidění?", "Slovo „nic“ popírá, že by tu nějaká věc byla. Začíná na ni- stejně jako nikdo a nijaký."],
    explanation: "„Nic“ popírá, že by tu byla nějaká věc, proto je to zájmeno záporné.",
  }),
  choice("Jaký druh zájmena je „my“?", "osobní", [
    { value: "přivlastňovací", why: "Přivlastňovací by bylo „náš“. „My“ označuje lidi, ne jejich věci." },
    { value: "vztažné", why: "Vztažné zájmeno (který, jenž) připojuje větu. „My“ nic nepřipojuje." },
    { value: "tázací", why: "„My“ se na nic neptá. Tázací jsou kdo, co, jaký." },
  ], {
    hints: ["Koho označuje slovo „my“?", "„My“ jsou lidé včetně toho, kdo mluví: já a ostatní. Zastupuje osoby, nikoli jejich věci."],
    explanation: "„My“ zastupuje skupinu osob včetně mluvčího, proto je to zájmeno osobní.",
  }),
  choice("Jaký druh zájmena je „jejich“?", "přivlastňovací", [
    { value: "osobní", why: "Osobní je „oni“. „Jejich“ neoznačuje lidi, ale říká, komu věc patří." },
    { value: "ukazovací", why: "„Jejich“ na nic neukazuje. Ukazovací jsou ten, tento, onen." },
    { value: "vztažné", why: "Vztažné zájmeno připojuje větu. „Jejich“ stojí před podstatným jménem a říká, čí je." },
  ], {
    hints: ["Čí je „jejich zahrada“?", "„Jejich zahrada“ patří jim. Slovo „jejich“ tedy neoznačuje lidi, ale vlastnictví, stejně jako náš nebo váš."],
    explanation: "„Jejich“ vyjadřuje, že věc patří jim, proto je to zájmeno přivlastňovací.",
  }),
  choice("Jaký druh zájmena je „žádný“?", "záporné", [
    { value: "neurčité", why: "Neurčité je „nějaký“. „Žádný“ popírá, že by tu byl byť jediný." },
    { value: "ukazovací", why: "Ukazovací zájmeno vybírá určitou věc. „Žádný“ říká, že tu není žádná." },
    { value: "tázací", why: "Tázací by bylo „jaký“ nebo „který“ v otázce." },
  ], {
    hints: ["Když řekneš „žádný pes tu není“, je tu nějaký pes?", "„Žádný“ popírá, že by tu byl byť jediný. Záporná zájmena začínají na ni- nebo žá-: nikdo, nic, žádný."],
    explanation: "„Žádný“ popírá, proto je to zájmeno záporné.",
  }),
];

const L2: PracticeTask[] = [
  choice("Urči druh zájmena „co“ ve větě: „Co děláš?“", "tázací", [
    { value: "vztažné", why: "Vztažné zájmeno připojuje jednu větu k druhé. Tady je jen jedna věta a je to otázka." },
    { value: "neurčité", why: "Neurčité by bylo „něco“. Tady se ptáme." },
    { value: "záporné", why: "Záporné by bylo „nic“. Věta nic nepopírá." },
  ], {
    hints: ["Jaké znaménko je na konci věty?", "Věta končí otazníkem a slovem „co“ se v ní ptáme, co někdo dělá. Nic dalšího se k ní nepřipojuje."],
    explanation: "Věta je otázka a slovem „co“ se v ní ptáme, proto je „co“ zájmeno tázací.",
  }),
  choice("Urči druh zájmena „kterou“ ve větě: „Kniha, kterou čtu, je napínavá.“", "vztažné", [
    { value: "tázací", why: "Tázací by bylo v otázce „Kterou knihu čteš?“. Tady se nikdo neptá." },
    { value: "ukazovací", why: "Ukazovací by bylo „tu knihu“. „Kterou“ připojuje další větu." },
    { value: "osobní", why: "„Kterou“ nezastupuje osobu, odkazuje ke knize." },
  ], {
    hints: ["Ptá se tahle věta na něco, nebo jen o knize něco říká?", "Slovo „kterou“ připojuje k hlavní větě další větu a odkazuje zpátky ke slovu „kniha“. Na konci není otazník."],
    explanation: "„Kterou“ připojuje vedlejší větu „kterou čtu“ a odkazuje ke knize, proto je vztažné. V otázce by stejné slovo bylo tázací.",
  }),
  choice("Urči druh zájmena „kterou“ ve větě: „Kterou knihu čteš?“", "tázací", [
    { value: "vztažné", why: "Vztažné zájmeno připojuje větu k podstatnému jménu. Tady se ptáme, o jakou knihu jde." },
    { value: "ukazovací", why: "Ukazovací by bylo „tuto knihu“. Tady nevíme, o kterou jde, a ptáme se." },
    { value: "neurčité", why: "Neurčité by bylo „nějakou knihu“. Věta je otázka." },
  ], {
    hints: ["Čím končí tahle věta?", "Věta je otázka a slovem „kterou“ se ptáš, o jakou knihu jde. Porovnej ji s větou „Kniha, kterou čtu, je dobrá“, kde se nikdo neptá."],
    explanation: "Věta je otázka a slovem „kterou“ se v ní ptáme, proto je tázací.",
  }),
  choice("Urči druh zájmena „náš“ ve větě: „Náš pes rád běhá.“", "přivlastňovací", [
    { value: "osobní", why: "Osobní by bylo „my“. „Náš“ neoznačuje osoby, ale říká, komu pes patří." },
    { value: "ukazovací", why: "Ukazovací by bylo „ten pes“. „Náš“ říká, čí pes je." },
    { value: "neurčité", why: "U „náš pes“ přesně víme, čí pes je. Neurčité by bylo „něčí“." },
  ], {
    hints: ["Komu ten pes patří?", "Slovo „náš“ neoznačuje lidi, ale říká, komu pes patří — nám. Stejně fungují můj, tvůj, jejich."],
    explanation: "„Náš“ vyjadřuje, že pes patří nám, proto je přivlastňovací.",
  }),
  choice("Urči druh zájmena „někdo“ ve větě: „Někdo klepe na dveře.“", "neurčité", [
    { value: "záporné", why: "Záporné by bylo „nikdo“. Tady někdo klepe, jen nevíme kdo." },
    { value: "tázací", why: "Tázací by bylo v otázce „Kdo klepe?“. Věta končí tečkou." },
    { value: "osobní", why: "Osobní zájmeno (on, ona) zastupuje známou osobu. Tady nevíme, kdo to je." },
  ], {
    hints: ["Víš, kdo za dveřmi stojí?", "Za dveřmi někdo je, ale nevíme kdo. Zájmena pro osobu nebo věc, kterou neznáme, začínají často na ně-."],
    explanation: "„Někdo“ označuje osobu, kterou neznáme, proto je neurčité.",
  }),
  choice("Urči druh zájmena „onen“ ve větě: „Onen hrad stojí daleko.“", "ukazovací", [
    { value: "osobní", why: "Připomíná „on“, ale neoznačuje osobu. Stojí před slovem hrad a vybírá ho." },
    { value: "neurčité", why: "Neurčité by bylo „nějaký hrad“. „Onen“ míří na určitý hrad." },
    { value: "přivlastňovací", why: "„Onen“ neříká, komu hrad patří." },
  ], {
    hints: ["K jakému slovu se „onen“ vztahuje a co s ním dělá?", "„Onen hrad“ znamená tamten hrad, ten vzdálený. Slovo tedy míří na určitou věc, i když je daleko."],
    explanation: "„Onen“ míří na určitou vzdálenou věc, proto je ukazovací (ten – tento – onen).",
  }),
  choice("Urči druh zájmena „nijakou“ ve větě: „Nemám nijakou chuť.“", "záporné", [
    { value: "neurčité", why: "Neurčité by bylo „nějakou chuť“. Tady se chuť popírá." },
    { value: "tázací", why: "Tázací by bylo „jakou“ v otázce. Věta se neptá." },
    { value: "ukazovací", why: "Ukazovací by bylo „takovou“. „Nijakou“ popírá." },
  ], {
    hints: ["Má ten, kdo mluví, chuť, nebo ne?", "Slovo „nijakou“ popírá, že by nějaká chuť byla. Začíná na ni- stejně jako nikdo a nic."],
    explanation: "„Nijakou“ popírá, proto je to zájmeno záporné.",
  }),
  choice("Urči druh zájmena „se“ ve větě: „Petr se myje.“", "osobní", [
    { value: "přivlastňovací", why: "Přivlastňovací zvratné zájmeno je „svůj“. „Se“ neříká, komu něco patří." },
    { value: "ukazovací", why: "„Se“ na nic neukazuje. Míří zpět k Petrovi." },
    { value: "vztažné", why: "„Se“ nepřipojuje žádnou větu." },
  ], {
    hints: ["Koho Petr myje?", "Petr myje sám sebe. Slovo „se“ míří zpátky k tomu, kdo činnost dělá — je to zvratná podoba zájmena, které zastupuje osobu."],
    explanation: "„Se“ je zvratné zájmeno: vrací děj k tomu, kdo ho koná. Řadí se k zájmenům osobním.",
  }),
  choice("Urči druh zájmena „čí“ ve větě: „Čí je ta taška?“", "tázací", [
    { value: "přivlastňovací", why: "Ptá se na vlastnictví, ale samo nic nepřivlastňuje – to by bylo „moje“." },
    { value: "vztažné", why: "Věta je otázka, nic nepřipojuje." },
    { value: "ukazovací", why: "Ukazovací je v té větě „ta“. My ale určujeme „čí“." },
  ], {
    hints: ["Odpovídá ta věta na otázku, nebo ji klade?", "Věta končí otazníkem a slovem „čí“ se ptáme, komu taška patří. Teprve odpověď by obsahovala slovo jako „moje“."],
    explanation: "„Čí“ stojí v otázce a ptá se na vlastníka, proto je tázací.",
  }),
  choice("Urči druh zájmena „mi“ ve větě: „Dej mi to.“", "osobní", [
    { value: "přivlastňovací", why: "Přivlastňovací by bylo „můj“. „Mi“ neříká, komu věc patří." },
    { value: "ukazovací", why: "Ukazovací je v té větě „to“. My určujeme „mi“." },
    { value: "neurčité", why: "U „mi“ přesně víme, o koho jde — o toho, kdo mluví." },
  ], {
    hints: ["Komu to máš dát?", "„Mi“ je tvar slova „já“ (komu? mně, mi). Označuje tedy toho, kdo mluví, jen v jiném pádě."],
    explanation: "„Mi“ je 3. pád od „já“, proto je to zájmeno osobní.",
  }),
  choice("Urči druh zájmena „něco“ ve větě: „Něco tu voní.“", "neurčité", [
    { value: "záporné", why: "Záporné by bylo „nic“. Tady něco voní." },
    { value: "tázací", why: "Tázací „co“ by bylo v otázce „Co tu voní?“." },
    { value: "ukazovací", why: "Ukazovací by bylo „to“. Tady nevíme, co voní." },
  ], {
    hints: ["Víš přesně, co voní?", "Něco tu voní, ale nevíme co. Slova pro neznámou věc nebo osobu začínají na ně-: někdo, něco, nějaký."],
    explanation: "„Něco“ označuje věc, kterou neznáme, proto je neurčité.",
  }),
  choice("Urči druh zájmena „tuto“ ve větě: „Vezmi si tuto knihu.“", "ukazovací", [
    { value: "přivlastňovací", why: "„Tuto“ neříká, komu kniha patří. To by bylo „svou“ nebo „mou“." },
    { value: "neurčité", why: "Neurčité by bylo „nějakou knihu“. Tady jde o jednu určitou." },
    { value: "osobní", why: "„Tuto“ nezastupuje osobu, stojí před slovem kniha." },
  ], {
    hints: ["Kterou knihu si máš vzít — jakoukoli, nebo určitou?", "„Tuto“ je tvar slova „tento“. Vybírá jednu určitou knihu, na kterou by se dalo ukázat."],
    explanation: "„Tuto“ je tvar zájmena „tento“ a míří na určitou knihu, proto je ukazovací.",
  }),
  choice("Urči druh zájmena „nám“ ve větě: „Babička nám upekla koláč.“", "osobní", [
    { value: "přivlastňovací", why: "Přivlastňovací by bylo „náš“. „Nám“ označuje lidi, kterým babička pekla." },
    { value: "ukazovací", why: "„Nám“ na nic neukazuje." },
    { value: "záporné", why: "Věta nic nepopírá." },
  ], {
    hints: ["Komu babička upekla koláč?", "„Nám“ je tvar slova „my“ (komu? nám). Zastupuje osoby, nikoli to, co jim patří."],
    explanation: "„Nám“ je 3. pád od „my“, proto je to zájmeno osobní.",
  }),
];

const L3: PracticeTask[] = [
  choice("Ve které větě je zájmeno vztažné?", "Pes, který štěká, je náš.", [
    { value: "Který pes to štěká?", why: "Tady se ptáme, proto je „který“ tázací." },
    { value: "Tamten pes štěká.", why: "„Tamten“ ukazuje na psa, je ukazovací." },
    { value: "Nějaký pes štěká.", why: "„Nějaký“ je neurčité – nevíme, který pes." },
  ], {
    hints: ["Ve které větě spojuje zájmeno dvě věty dohromady?", "Hledej zájmeno, které stojí za čárkou a odkazuje zpátky k podstatnému jménu. Otázka to není."],
    explanation: "Ve větě „Pes, který štěká, je náš“ připojuje „který“ vedlejší větu a odkazuje ke psovi, proto je vztažné.",
  }),
  choice("Ve které větě je zájmeno záporné?", "Nikomu to neřeknu.", [
    { value: "Někomu to řeknu.", why: "„Někomu“ je neurčité – nějakému člověku, nevíme kterému." },
    { value: "Komu to řekneš?", why: "„Komu“ stojí v otázce, je tázací." },
    { value: "Tomu to řeknu.", why: "„Tomu“ ukazuje na určitého člověka, je ukazovací." },
  ], {
    hints: ["Která věta něco popírá?", "Záporná zájmena začínají na ni- nebo žá-, třeba nikdo, nic, žádný. Pozor: ně- na začátku znamená něco jiného."],
    explanation: "„Nikomu“ je tvar zájmena „nikdo“ a popírá, že by se to někdo dozvěděl, proto je záporné.",
  }),
  choice("Ve které větě je zájmeno přivlastňovací?", "Půjč mi svoji tužku.", [
    { value: "Půjč mi tu tužku.", why: "„Tu“ ukazuje na určitou tužku, je ukazovací." },
    { value: "Půjč mi nějakou tužku.", why: "„Nějakou“ je neurčité – nevíme kterou." },
    { value: "Kterou tužku mi půjčíš?", why: "„Kterou“ stojí v otázce, je tázací." },
  ], {
    hints: ["Která věta říká, komu tužka patří?", "Hledej slovo, které by šlo nahradit slovem „tvoji“. Přivlastňovací zájmena říkají, čí věc je."],
    explanation: "„Svoji“ je tvar zájmena „svůj“ a říká, že tužka patří tomu, kdo ji půjčuje. Je to přivlastňovací zájmeno.",
  }),
  choice("Ve které větě je zájmeno tázací?", "Co ti maminka koupila?", [
    { value: "Maminka mi něco koupila.", why: "„Něco“ je neurčité – nevíme co." },
    { value: "Maminka mi nic nekoupila.", why: "„Nic“ popírá, je záporné." },
    { value: "Maminka koupila to, co slíbila.", why: "Tady „co“ připojuje větu a odkazuje k „to“, je vztažné." },
  ], {
    hints: ["Která z vět je otázka?", "Tázací zájmeno stojí v otázce a ptá se na něco, co nevíme. V ostatních větách zájmeno něco neurčitě označuje, popírá, nebo připojuje větu."],
    explanation: "Ve větě „Co ti maminka koupila?“ se slovem „co“ ptáme, proto je tázací.",
  }),
  choice("Urči druh zájmena „tentýž“ ve větě: „Přišel zase tentýž pošťák.“", "ukazovací", [
    { value: "neurčité", why: "Neurčité by bylo „nějaký pošťák“. My víme, že je to stejný pošťák jako minule." },
    { value: "osobní", why: "„Tentýž“ nezastupuje osobu, stojí před slovem pošťák." },
    { value: "vztažné", why: "„Tentýž“ nepřipojuje žádnou větu." },
  ], {
    hints: ["Z jakého kratšího zájmena slovo „tentýž“ vzniklo?", "Ve slově „tentýž“ je schované „ten“. Míří na tu samou, už známou osobu."],
    explanation: "„Tentýž“ vzniklo ze zájmena „ten“ a míří na stejnou osobu, proto je ukazovací.",
  }),
  choice("Urči druh zájmena „kdosi“ ve větě: „Kdosi zaklepal.“", "neurčité", [
    { value: "tázací", why: "Obsahuje „kdo“, ale věta se neptá." },
    { value: "záporné", why: "Záporné by bylo „nikdo“. Tady někdo zaklepal." },
    { value: "osobní", why: "Osobní zájmeno zastupuje známou osobu. Tady nevíme, kdo to byl." },
  ], {
    hints: ["Víme, kdo zaklepal?", "Přípona -si dělá z tázacího „kdo“ zájmeno pro osobu, kterou neznáme. Stejně vznikla slova cosi a jakýsi."],
    explanation: "„Kdosi“ označuje neznámou osobu, proto je neurčité, stejně jako „někdo“.",
  }),
  choice("Urči druh zájmena „leckdo“ ve větě: „Leckdo by se divil.“", "neurčité", [
    { value: "záporné", why: "„Leckdo“ neznamená nikdo, ale mnoho lidí." },
    { value: "tázací", why: "Věta se neptá, i když je ve slově schované „kdo“." },
    { value: "ukazovací", why: "„Leckdo“ neukazuje na určitého člověka." },
  ], {
    hints: ["Znamená „leckdo“ nikdo, nebo mnozí lidé?", "„Leckdo“ znamená leckterý člověk, mnoho lidí — ale nevíme kteří. Začátek lec- najdeš i ve slovech leccos a lecjaký."],
    explanation: "„Leckdo“ označuje blíže neurčené lidi, proto je neurčité.",
  }),
  choice("Urči druh zájmena „kdo“ ve větě: „Kdo to viděl, ať se přihlásí.“", "vztažné", [
    { value: "tázací", why: "Věta není otázka – je to výzva. „Kdo“ tu nic nezjišťuje." },
    { value: "neurčité", why: "Neurčité by bylo „někdo“." },
    { value: "osobní", why: "„Kdo“ tu osobu nezastupuje, připojuje větu." },
  ], {
    hints: ["Je tahle věta otázka? Kolik je v ní sloves?", "Jsou tu dvě věty: „kdo to viděl“ a „ať se přihlásí“. Slovo „kdo“ tu nic nezjišťuje, jen první větu připojuje k druhé."],
    explanation: "Věta není otázka. „Kdo“ uvozuje vedlejší větu „kdo to viděl“ a připojuje ji k hlavní, proto je vztažné.",
  }),
  choice("Urči druh zájmena „sebe“ ve větě: „Myslí jen na sebe.“", "osobní", [
    { value: "přivlastňovací", why: "Přivlastňovací zvratné je „svůj“. „Sebe“ neříká, komu něco patří." },
    { value: "ukazovací", why: "„Sebe“ na nic neukazuje, míří zpět k tomu, kdo myslí." },
    { value: "neurčité", why: "Víme přesně, o koho jde – o toho, kdo myslí." },
  ], {
    hints: ["Na koho ten člověk myslí?", "„Sebe“ míří zpátky k tomu, kdo myslí. Je to zvratné zájmeno, které zastupuje osobu — stejně jako „se“ nebo „si“."],
    explanation: "„Sebe“ je zvratné zájmeno a řadí se k zájmenům osobním.",
  }),
  choice("Urči druh zájmena „takové“ ve větě: „Takové jablko jsem ještě neviděla.“", "ukazovací", [
    { value: "tázací", why: "Tázací by bylo „jaké“ v otázce." },
    { value: "neurčité", why: "Neurčité by bylo „nějaké“. „Takové“ míří na jablko, které máš před sebou." },
    { value: "vztažné", why: "„Takové“ nepřipojuje žádnou větu." },
  ], {
    hints: ["Na které jablko míří slovo „takové“ — na jakékoli, nebo na to, které máš před sebou?", "„Takové“ ukazuje na určitý druh věci, kterou vidíš: takové, jako je tohle. Patří do skupiny ten, tento, onen."],
    explanation: "„Takový“ ukazuje na určitý druh věci, proto je ukazovací.",
  }),
  choice("Ve které větě je zájmeno neurčité?", "Něčí pes štěká na zahradě.", [
    { value: "Čí pes štěká na zahradě?", why: "„Čí“ stojí v otázce, je tázací." },
    { value: "Ničí pes na zahradě neštěká.", why: "„Ničí“ popírá, je záporné." },
    { value: "Náš pes štěká na zahradě.", why: "„Náš“ říká, komu pes patří, je přivlastňovací." },
  ], {
    hints: ["Ve které větě nevíme, komu pes patří, a přitom se neptáme?", "Neurčité zájmeno označuje někoho nebo něco, co přesně neznáme. Často začíná na ně-: někdo, něco, nějaký."],
    explanation: "„Něčí“ znamená, že pes patří někomu, koho neznáme, proto je neurčité.",
  }),
  choice("Ve které větě je zájmeno ukazovací?", "Tamten strom je nejvyšší.", [
    { value: "Který strom je nejvyšší?", why: "„Který“ stojí v otázce, je tázací." },
    { value: "Žádný strom tu není vyšší.", why: "„Žádný“ popírá, je záporné." },
    { value: "Náš strom je nejvyšší.", why: "„Náš“ říká, komu strom patří, je přivlastňovací." },
  ], {
    hints: ["Ve které větě by se dalo na strom ukázat prstem?", "Ukazovací zájmena vybírají určitou věc: ten, tento, tamten, onen. Ostatní věty se ptají, popírají, nebo říkají, komu strom patří."],
    explanation: "„Tamten“ míří na určitý strom, proto je ukazovací.",
  }),
  choice("Ve které větě je zájmeno osobní?", "Pomůžeš mu s úkolem?", [
    { value: "Pomůžeš svému bratrovi?", why: "„Svému“ říká, čí bratr to je, je přivlastňovací." },
    { value: "Pomůžeš tomu klukovi?", why: "„Tomu“ ukazuje na určitého kluka, je ukazovací." },
    { value: "Pomůžeš někomu s úkolem?", why: "„Někomu“ je neurčité – nevíme komu." },
  ], {
    hints: ["Ve které větě zájmeno jen zastupuje člověka a nic dalšího o něm neříká?", "„Mu“ je tvar slova „on“ (komu? jemu, mu). Osobní zájmena zastupují osoby; ostatní věty říkají, čí je, který je, nebo že nevíme kdo."],
    explanation: "„Mu“ je 3. pád od „on“, proto je to zájmeno osobní.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const ZAJMENADRUHYZAJMEN: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen",
    displayName: "Druhy zájmen",
    title: "Zájmena - druhy zájmen",
    studentTitle: "Druhy zájmen",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš druhy zájmen a naučíš se je rozlišovat ve větách.",
    keywords: ["zájmeno", "osobní", "přivlastňovací", "ukazovací", "tázací", "vztažné", "neurčité", "záporné"],
    goals: [
      "Rozlišit druhy zájmen",
      "Určit druh zájmena ve větě",
    ],
    boundaries: ["Bez pokročilého skloňování zájmen", "Bez záporných příslovcí"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: ["g4-cjl-jazykova-vychova-skladba-stavba-vety-zakladni-skladebni-dvojice-podmet-prisudek"],
    generator: gen,
    helpTemplate: {
      hint: "7 druhů: osobní, přivlastňovací, ukazovací, tázací, vztažná, neurčitá, záporná",
      steps: [
        "Označuje osobu (já, ty, on)? → osobní",
        "Přivlastňuje (můj, tvůj)? → přivlastňovací",
        "Ukazuje (ten, tento)? → ukazovací",
        "Ptá se (kdo, co)? → tázací; připojuje větu vedlejší? → vztažné",
        "Označuje neznámou osobu nebo věc (někdo, něco)? → neurčité; popírá (nikdo, nic)? → záporné",
      ],
      commonMistake: "Záměna tázacího a vztažného „který“: tázací = ptáme se, vztažné = připojuje větu vedlejší",
      example: "Jaký druh zájmena je „nikdo“? → záporné",
    },
  },
];
