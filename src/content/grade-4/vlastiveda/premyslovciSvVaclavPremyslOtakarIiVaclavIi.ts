import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události Přemyslovců ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události z dějin Přemyslovců od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první pokřtěný přemyslovský kníže",
      "Sv. Václav zavražděn svým bratrem Boleslavem",
      "Přemysl Otakar I. – Čechy se staly dědičným královstvím",
      "Bitva na Moravském poli – zánik moci Přemysla Otakara II.",
    ],
    hints: ["Bořivoj byl první, bitva na Moravském poli (1278) poslední.", "Sv. Václav zemřel roku 935."],
    explanation: "Přemyslovci začali jako lokální knížata, ale postupně rostli v síle. Přemysl Otakar I. získal roku 1212 dědičný titul krále a rod dosáhl vrcholu za Přemysla Otakara II. — než ho roku 1278 porazil Rudolf Habsburský.",
  },
  {
    question: "Seřaď přemyslovské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů do Čech (6. stol.)",
      "Bořivoj přijal křesťanství na dvoře Svätopluka",
      "Zavraždění sv. Václava (935)",
      "Václav II. – zlaté časy kutnohorského stříbra",
    ],
    hints: ["Slované přišli jako první.", "935 byl rok zavraždění sv. Václava."],
    explanation: "Slované přišli do Čech bez křesťanství — to jim přinesli Přemyslovci. Bořivoj a sv. Václav zakotvili nové náboženství, a Václav II. pak žil v dostatku díky stříbru z Kutné Hory.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav šíří křesťanství v Čechách",
      "Bitva na Moravském poli – smrt Přemysla Otakara II. (1278)",
      "Václav II. – král český a polský",
      "Václav III. zavražděn – konec Přemyslovců (1306)",
    ],
    hints: ["Sv. Václav byl nejdříve, zánik Přemyslovců (1306) nejpozději.", "Bitva na Moravském poli byla roku 1278."],
    explanation: "Sv. Václav byl nejmocnějším mravním symbolem Čech — a Přemysl Otakar II. byl nejmocnějším vojenským vládcem. Vojensky silný Otakar II. padl roku 1278, zatímco vzpomínka na mírového Václava žije dodnes.",
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj (první historický přemyslovský kníže)",
      "Sv. Václav (patron Čech)",
      "Přemysl Otakar II. (král železný a zlatý)",
      "Václav III. (poslední Přemyslovec)",
    ],
    hints: ["Bořivoj byl první, Václav III. poslední.", "Sv. Václav žil v 10. stol., Přemysl Otakar II. ve 13. stol."],
    explanation: "Přemyslovci prošli čtyřmi klíčovými postavami: Bořivoj přinesl křesťanství, Václav dal dynastii patrona, Přemysl Otakar II. přivedl Čechy na vrchol moci — a Václav III. byl zavražděn roku 1306 bez dědice.",
  },
  {
    question: "Seřaď mezníky přemyslovské doby od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (7. stol.) – první slovanský stát",
      "Pokřtění Bořivoje na Moravě",
      "Zlatá bula sicilská – dědičné království (1212)",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["Sámova říše byla nejstarší.", "Zlatá bula sicilská byla roku 1212."],
    explanation: "Od Sámovy první slovanské říše po zánik Přemyslovců uplynulo téměř 700 let. Přemyslovci navázali tam, kde skončila Velká Morava — Bořivoj přijal křesťanství a dynastie rostla, až v roce 1212 získala dědičné království.",
  },
  {
    question: "Seřaď tyto historické události chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství (kolem 874)",
      "Zavraždění sv. Václava (935)",
      "Přemysl Otakar I. – dědičný titul krále (1198)",
      "Přemysl Otakar II. – rozkvět království",
    ],
    hints: ["874 → 935 → 1198 → poté Přemysl Otakar II.", "Sv. Václav byl zavražděn roku 935."],
    explanation: "Každý z těchto panovníků posunul Čechy o krok výš: Bořivoj přinesl víru, Václav se stal patronem národa, Otakar I. získal dědičný titul krále, Otakar II. vybudoval říši od Baltu po Jadrán.",
  },
  {
    question: "Seřaď od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové v Čechách (doba železná)",
      "Příchod Slovanů (6. stol. n. l.)",
      "Bořivoj – první přemyslovský kníže",
      "Sv. Václav – patron Čech",
    ],
    hints: ["Keltové byli nejdříve, sv. Václav nejpozději.", "Slované přišli v 6. stol."],
    explanation: "Čechy měly před Přemyslovci dlouhou historii: Keltové tu žili v době železné a pojmenovali zemi Bohemia. Po stěhování národů přišli Slované a Přemyslovci, kteří z Čech udělali křesťanský stát se sv. Václavem jako patronem.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav zavražděn Boleslavem I.",
      "Přemysl Otakar I. získal dědičný titul krále",
      "Přemysl Otakar II. – nejsilnější panovník střední Evropy",
      "Václav II. – krále český a polský, Kutná Hora",
    ],
    hints: ["935 bylo nejdříve, Václav II. nejpozději.", "Přemysl Otakar I. získal titul roku 1198."],
    explanation: "Zavraždění sv. Václava bylo nejen tragedií — jeho bratr Boleslav I. se ukázal jako silný vládce. Tradice pokračovala: Přemysl Otakar I. a II. dovedli dynastii k vrcholu.",
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Boleslav I. – vrah Václava, ale silný kníže",
      "Přemysl Otakar I. – dědičné království",
      "Přemysl Otakar II. – od Baltu po Jadrán",
      "Václav II. – Kutná Hora, polský král",
    ],
    hints: ["Boleslav I. byl nejstarší z těchto čtyř.", "Václav II. byl nejpozději."],
    explanation: "Boleslav I. zavraždil sv. Václava — ale sám byl silným vládcem, který rozšířil přemyslovské území. Přemyslovci pak trvale rostli na moci: od knížat k dědičným králům (Otakar I.) a pak k vladařům střední Evropy (Otakar II.).",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – pokřtěn na dvoře Svätopluka",
      "Sv. Václav – zavražděn 935",
      "Bitva na Moravském poli (1278)",
      "Zánik Přemyslovců – Václav III. (1306)",
    ],
    hints: ["Bořivoj byl první, zánik Přemyslovců (1306) poslední.", "Bitva na Moravském poli byla roku 1278."],
    explanation: "Přemyslovec Bořivoj přijal křesťanství a začal cestu, která trvala přes 400 let. Sv. Václav ji posílil svým martyriem, Otakar II. dosáhl vrcholu moci — ale bitva na Moravském poli roku 1278 zahájila konec.",
  },
  {
    question: "Seřaď tyto události chronologicky.",
    correctAnswer: "order",
    items: [
      "Zlatá bula sicilská – dědičný titul krále pro Přemyslovce (1212)",
      "Přemysl Otakar II. – rozšíření říše od Baltu po Jadrán",
      "Bitva na Moravském poli – smrt Přemysla Otakara II. (1278)",
      "Václav III. zavražděn – konec rodu (1306)",
    ],
    hints: ["1212 → poté Otakar II. → 1278 → 1306.", "Zánik byl roku 1306."],
    explanation: "Zlatá bula sicilská (1212) zabezpečila Čechám dědičné království — od té chvíle nikdo nemohl Přemyslovce sesadit. Přemysl Otakar II. toho využil naplno a vybudoval říši od Baltu po Jadrán, ale roku 1278 padl.",
  },
  {
    question: "Seřaď od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše – první slovanský stát (623)",
      "Velkomoravská říše – vznik (9. stol.)",
      "Bořivoj – první přemyslovský kníže",
      "Přemysl Otakar II. – král železný a zlatý",
    ],
    hints: ["623 → 9. stol. → Bořivoj → Přemysl Otakar II.", "Sámova říše byla nejdříve."],
    explanation: "Přemyslovci navazují na desetiletí starou tradici: od Sámovy první slovanské říše (623) přes Velkomoravskou říši až k dynastii, která dosáhla vrcholu v osobě Přemysla Otakara II. — největšího přemyslovského krále.",
  },
  {
    question: "Seřaď přemyslovské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – patron Čech",
      "Přemysl Otakar I. – dědičné království (1198)",
      "Přemysl Otakar II. – nejmocnější panovník střední Evropy",
      "Václav II. – polský král, stříbrné doly Kutná Hora",
    ],
    hints: ["Sv. Václav byl nejdříve, Václav II. nejpozději.", "Přemysl Otakar I. získal titul roku 1198."],
    explanation: "Každý z těchto panovníků přidal k přemyslovské slávě vrstvu: Václav dal dynastii duchovní autoritu, Otakar I. právní základ (dědičné království), Otakar II. vojenskou moc, a Václav II. bohatství ze stříbra Kutné Hory.",
  },
  {
    question: "Seřaď od nejstaršího po nejmladší.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první křesťanský přemyslovský kníže",
      "Přemysl Otakar I. – Čechy královstvím",
      "Bitva na Moravském poli (1278)",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Bořivoj byl nejdříve, zánik (1306) nejpozději.", "Bitva na Moravském poli byla roku 1278."],
    explanation: "Dvanáct generací Přemyslovců — od Bořivoje (874) po Václava III. (1306) — vládlo Čechám po dobu 432 let. Získali křesťanství, dědičné království i říši od Baltu po Jadrán. Konec přišel jedinou dýkou v Olomouci.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci sjednotili slovanské kmeny v Čechách",
      "Sv. Václav – kníže a patron Čech",
      "Přemysl Otakar II. – Bohemia od Baltu po Jadrán",
      "Zánik Přemyslovců – Václav III. (1306)",
    ],
    hints: ["Sjednocení bylo nejdříve, zánik (1306) nejpozději.", "Sv. Václav žil v 10. stol."],
    explanation: "Přemyslovci sjednotili české kmeny, sv. Václav dal zemi patrona a duchovní základ, Přemysl Otakar II. vybudoval největší přemyslovskou říši — a Václav III. byl zavražděn bez potomků, čímž rod vymřel po meči.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové (Boiové) pojmenovali Čechy Bohemia",
      "Slované přišli do Čech (6. stol. n. l.)",
      "Bořivoj – první přemyslovský kníže",
      "Václav II. – král česky a polský",
    ],
    hints: ["Keltové byli nejdříve, Václav II. nejpozději.", "Slované přišli v 6. stol."],
    explanation: "Jméno Bohemia pochází od keltského kmene Boiů, kteří žili v Čechách v době železné. Slované je vystřídali, Přemyslovci pak sjednotili Čechy — a Václav II. zažil jejich zlatý věk díky stříbru z Kutné Hory.",
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Přijetí křesťanství Bořivojem",
      "Sv. Václav zavražděn bratrem (935)",
      "Přemysl Otakar I. – dědičný titul (1198)",
      "Václav II. – kutnohorské stříbro a polská koruna",
    ],
    hints: ["Bořivoj byl nejdříve, Václav II. nejpozději.", "Přemysl Otakar I. získal titul roku 1198."],
    explanation: "Každé dvě generace přinesly Přemyslovcům nový zlom: Bořivoj přijal víru, Václav se stal mučedníkem, Otakar I. získal dědičné království, Václav II. ovládl i Polsko a Kutnou Horu — bohatství na tehdejší poměry ohromující.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Velkomoravské říše (906)",
      "Bořivoj – první přemyslovský kníže",
      "Sv. Václav – patron Čech (zavražděn 935)",
      "Přemysl Otakar II. – rozkvět království",
    ],
    hints: ["Zánik VM Říše (906) byl nejdříve.", "Sv. Václav byl zavražděn roku 935."],
    explanation: "Zánik Velké Moravy roku 906 otevřel prostor Přemyslovcům. Bořivoj byl sice pokřtěn ještě za Velké Moravy, ale přemyslovská státnost začala naplno až po pádu moravské říše.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav šíří křesťanství",
      "Zlatá bula sicilská (1212) – dědičné království",
      "Bitva na Moravském poli (1278)",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Sv. Václav byl nejdříve, zánik (1306) nejpozději.", "Zlatá bula sicilská byla roku 1212."],
    explanation: "Zlatá bula sicilská (1212) dala Přemyslovcům jistotu, že jejich království je dědičné — nikdo ho nemohl vzít. Přemysl Otakar II. tuto jistotu plně využil, ale roku 1278 ji vojensky ztratil.",
  },
  {
    question: "Seřaď přemyslovské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – křest na dvoře VM Říše (kolem 874)",
      "Zavraždění sv. Václava (935)",
      "Zlatá bula sicilská – dědičné království (1212)",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["874 → 935 → 1212 → 1306.", "Zlatá bula sicilská byla roku 1212."],
    explanation: "Od Bořivojova křtu (874) po zánik Přemyslovců (1306) uplynulo 432 let. Tři klíčové momenty: Václav jako patron Čech, zlatá bula jako právní základ království, a zánik roku 1306 bez mužského dědice.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – kníže, šíří křesťanství",
      "Přemysl Otakar I. – dědičný titul krále ČR",
      "Přemysl Otakar II. – největší přemyslovská moc",
      "Václav II. – polský král, bohatství z Kutné Hory",
    ],
    hints: ["Sv. Václav byl nejdříve, Václav II. nejpozději.", "Přemysl Otakar I. byl dříve než Přemysl Otakar II."],
    explanation: "Sv. Václav zakotvil křesťanskou identitu Čech, Přemysl Otakar I. zajistil dynastii právní ochranu, Přemysl Otakar II. dovedl Čechy na vrchol středoevropské moci, a Václav II. ovládl i Polsko — přemyslovský vrchol.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství",
      "Bitva na Moravském poli – zánik moci Přemysla Otakara II. (1278)",
      "Václav II. – stříbrné doly a polská koruna",
      "Václav III. – poslední Přemyslovec (zavražděn 1306)",
    ],
    hints: ["Bořivoj byl nejdříve, zánik (1306) nejpozději.", "Bitva na Moravském poli byla roku 1278."],
    explanation: "Bitva na Moravském poli (1278) zabila Přemysla Otakara II. a oslabila dynastii. Václav II. ale obnovil přemyslovskou slávu — stříbrem z Kutné Hory a polskou korunou. Václav III. pak zemřel bez dědice.",
  },
  {
    question: "Seřaď přemyslovské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci sjednocují slovanské kmeny v Čechách",
      "Zlatá bula sicilská – Čechy dědičným královstvím",
      "Přemysl Otakar II. – říše od Baltu po Jadrán",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["Sjednocení bylo nejdříve, zánik (1306) nejpozději.", "Zlatá bula sicilská byla roku 1212."],
    explanation: "Zlatá bula sicilská (1212) prohlásila Čechy za dědičné království — v Evropě to bylo výjimečné právo. Přemysl Otakar II. ho využil naplno a rozšířil říši od Baltu po Jadrán, ale roku 1278 padl v bitvě.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové v Čechách – doba železná",
      "Slované v Čechách – 6. stol. n. l.",
      "Sámova říše – 7. stol.",
      "Bořivoj – první přemyslovský kníže",
    ],
    hints: ["Keltové byli nejdříve, Bořivoj nejpozději.", "Slované přišli v 6. stol."],
    explanation: "Bořivoj byl prvním historicky doloženým přemyslovským knížetem. Přišel po dlouhé prehistorii Čech: keltských osídleních, příchodu Slovanů, Sámově říši — a jako první z rodu přijal křesťanství.",
  },
  {
    question: "Seřaď přemyslovská panování od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Boleslav I. – konsolidátor přemyslovské moci",
      "Boleslav II. – upevnění křesťanství",
      "Přemysl Otakar I. – dědičné království",
      "Přemysl Otakar II. – rozkvět",
    ],
    hints: ["Boleslav I. byl nejdříve, Přemysl Otakar II. nejpozději.", "Oba Boleslavové byli dříve než Otakarové."],
    explanation: "Boleslav I. se přezdívá Ukrutný — zavraždil bratra, ale upevnil přemyslovskou moc. Boleslav II. dokončil christianizaci Čech. Přemysl Otakar I. a II. pak dovedli dynastii na vrchol středoevropské politiky.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první křesťanský kníže Čech",
      "Sv. Václav – patron Čech (9.–10. stol.)",
      "Přemysl Otakar II. – největší přemyslovský vládce",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Bořivoj byl nejdříve, zánik (1306) nejpozději.", "Sv. Václav žil v 9.–10. stol."],
    explanation: "Přemyslovci trvali přes čtyři staletí. Bořivoj a Václav dali dynastii duchovní základ, Přemysl Otakar II. ji vojensky proslavil, ale Václav III. zemřel zavražděn roku 1306 a rod vymřel po meči.",
  },
  {
    question: "Seřaď tyto mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Příchod Slovanů do střední Evropy (6. stol.)",
      "Bořivoj – křest (kolem 874)",
      "Sv. Václav – zavražděn (935)",
      "Zlatá bula sicilská – Čechy dědičné království (1212)",
    ],
    hints: ["6. stol. → 874 → 935 → 1212.", "Zlatá bula sicilská byla roku 1212."],
    explanation: "Slované přišli do Čech bez státní organizace. Přemyslovci ji postupně budovali: Bořivoj přijal křesťanství (874), Václav se stal mučedníkem a patronem (935), a roku 1212 Čechy získaly status dědičného království.",
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství z Velké Moravy",
      "Sv. Václav – zavražděn 935",
      "Přemysl Otakar I. – dědičné království (1198)",
      "Přemysl Otakar II. – 'král železný a zlatý'",
    ],
    hints: ["Bořivoj byl nejdříve, Přemysl Otakar II. nejpozději.", "Sv. Václav byl zavražděn roku 935."],
    explanation: "Každý z těchto čtyř panovníků přidal Čechám něco nového: Bořivoj víru, Václav patrona, Přemysl Otakar I. dědičnou korunu, Přemysl Otakar II. největší středoevropskou říši. Přemyslovci budovali krok po kroku.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – 28. září (svátek patrona Čech)",
      "Přemysl Otakar I. – dědičné království",
      "Přemysl Otakar II. – bitva na Moravském poli (1278)",
      "Václav III. – zánik Přemyslovců (1306)",
    ],
    hints: ["Sv. Václav byl nejdříve, zánik (1306) nejpozději.", "Bitva na Moravském poli byla roku 1278."],
    explanation: "Přemyslovci dosáhli vrcholu a pak rychle klesli. Přemysl Otakar I. zajistil dynastii právní základ, Otakar II. vojenský vrchol — ale zánik přišel o pouhých 28 let po bitvě na Moravském poli roku 1278.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Bořivoj – první Přemyslovec s pokřtěním",
      "Sv. Václav – patron Čech",
      "Václav II. – král český a polský",
      "Václav III. – konec rodu Přemyslovců",
    ],
    hints: ["Bořivoj byl nejdříve, Václav III. nejpozději.", "Tři Václavové — všichni v různých dobách."],
    explanation: "Tři Václavové v přemyslovské dynastii: sv. Václav (kníže-mučedník, zemřel 935), Václav II. (král-boháč, zemřel 1305) a Václav III. (zavražděný bez dědice, 1306). Posledním Přemyslovcem byl shodou okolností opět Václav.",
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Přemyslovci sjednocují Čechy",
      "Sv. Václav – šíří křesťanství",
      "Zlatá bula sicilská (1212)",
      "Zánik Přemyslovců – Václav III. (1306)",
    ],
    hints: ["Sjednocení bylo nejdříve, zánik (1306) nejpozději.", "Zlatá bula sicilská byla roku 1212."],
    explanation: "Přemyslovci sjednotili Čechy, sv. Václav jim dal duchovní identitu, zlatá bula sicilská (1212) právní základ království — a přesto rod vymřel roku 1306. Čtyři staletí úsilí ukončila jedna dýka v Olomouci.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci – vznik dynastie (9. stol.)",
      "Zlatá bula sicilská (1212) – dědičné království",
      "Přemysl Otakar II. – nejmocnější přemyslovský král",
      "Zánik Přemyslovců (1306)",
    ],
    hints: ["9. stol. → 1212 → Otakar II. → 1306.", "Zlatá bula sicilská byla roku 1212."],
    explanation: "Zlatá bula sicilská (1212) zaručila Čechám, že nikdo z venku nemůže svrhnout Přemyslovce — království bylo dědičné. Přemysl Otakar II. byl pak nejmocnějším panovníkem střední Evropy, ale padl v bitvě.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Keltové Boiové – pojmenování Bohemia",
      "Slované v Čechách – 6. stol.",
      "Bořivoj – první historický přemyslovský kníže",
      "Sv. Václav – zavražděn 935",
    ],
    hints: ["Keltové byli nejdříve, sv. Václav nejpozději.", "Slované přišli v 6. stol."],
    explanation: "Jméno Bohemia přinesli Keltové — pojmenoval zemi jejich kmen Boii. Po tisíciletích přišli Slované a Přemyslovci, kteří z Čech udělali křesťanský stát. Sv. Václav, patron Čech, zemřel roku 935.",
  },
  {
    question: "Seřaď přemyslovské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Bořivoj – přijetí křesťanství",
      "Přemysl Otakar I. – dědičné království (1198)",
      "Přemysl Otakar II. – 'od Baltu po Jadrán'",
      "Václav II. – kutnohorské stříbro",
    ],
    hints: ["Bořivoj byl nejdříve, Václav II. nejpozději.", "Přemysl Otakar I. získal titul roku 1198."],
    explanation: "Přemyslovci rostli v moci: Bořivoj jen malý kníže v podhůří, Přemysl Otakar I. král s dědičným titulem, Přemysl Otakar II. vládce od Baltu po Jadrán, Václav II. nejbohatší středoevropský panovník díky Kutné Hoře.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sv. Václav – kníže, patron Čech",
      "Přemysl Otakar II. – 'král železný a zlatý'",
      "Václav II. – polský král, Kutná Hora",
      "Zánik rodu Přemyslovců (1306)",
    ],
    hints: ["Sv. Václav byl nejdříve, zánik (1306) nejpozději.", "Přemysl Otakar II. byl dříve než Václav II."],
    explanation: "Přemysl Otakar II. dostal přezdívku 'král železný a zlatý' — železný pro vojenskou sílu, zlatý pro bohatství. Václav II. byl ještě bohatší díky kutnohorskému stříbru. Ale ani velké bohatství nenahradí věrného dědice.",
  },
  {
    question: "Seřaď mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Přemyslovci – vznik rodu (9. stol.)",
      "Sv. Václav – zavražděn 935",
      "Přemysl Otakar II. – bitva na Moravském poli (1278)",
      "Václav III. – poslední Přemyslovec (1306)",
    ],
    hints: ["9. stol. → 935 → 1278 → 1306.", "Zánik byl roku 1306."],
    explanation: "Přemyslovci vládli Čechám přes čtyři staletí. Klíčové milníky: vznik dynastie, mučednictví sv. Václava, vrchol moci za Přemysla Otakara II. — a rychlý zánik: od bitvy na Moravském poli (1278) do zániku rodu (1306) uplynulo jen 28 let.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const PREMYSLOVCISVVACLAVPREMYSLOTAKARIIVACLAVII: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-premyslovci-sv-vaclav-premysl-otakar-ii-vaclav-ii",
    title: "Přemyslovci - sv. Václav, Přemysl Otakar II., Václav II.",
    studentTitle: "Přemyslovci",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš první českou dynastii Přemyslovců a jejich nejslavnější panovníky.",
    keywords: ["Přemyslovci", "Václav", "Přemysl Otakar II.", "Bořivoj", "Kutná Hora", "patron Čech"],
    goals: [
      "Vyjmenovat hlavní přemyslovské panovníky",
      "Popsat přínos sv. Václava",
      "Vysvětlit přezdívku 'král železný a zlatý'",
      "Vědět, kdy a proč Přemyslovci vymřeli",
    ],
    boundaries: ["Přesná genealogie celé dynastie není vyžadována", "Feudální systém do hloubky není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Přemyslovci: Bořivoj (první křestěný) → Sv. Václav (zavražděn 935) → Přemysl Otakar II. 'železný a zlatý' → Václav II. (stříbro) → Václav III. (1306 konec).",
      steps: [
        "Patron Čech = sv. Václav, 28. září = svátek",
        "Přemysl Otakar II. = 'král železný a zlatý', od Baltu po Jadrán",
        "Bitva na Moravském poli 1278 = konec moci Přemyslovců",
        "Václav III. 1306 = zánik dynastie",
      ],
      commonMistake: "Žáci si pletou Václava I. (sv. Václav, kníže) a Václava II. (král, otec Václava III.).",
      example: "Sv. Václav: kníže, šířil křesťanství, zavražděn 935, patron Čech.",
    },
  },
];
