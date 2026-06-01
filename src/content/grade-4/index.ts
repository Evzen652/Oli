/**
 * Grade 4 — veřejný export.
 *
 * Vše, co grade-4 modul nabízí zbytku aplikace, prochází tudy.
 * Vnitřní soubory grade-4/ se NEimportují odjinud.
 *
 * Grade-4 session přidává topics postupně. Každý topic je `TopicMetadata`
 * (z `src/lib/types.ts`) s vyplněným `rvpNodeId` linkujícím na RVP dataset.
 */

import type { TopicMetadata } from "@/lib/types";

// Matematika
import { PISEMNE_SCITANI_ODCITANI } from "./matematika/pisemneScitaniAOdcitaniVicecifernychCisel";
import { PISEMNE_DELENI } from "./matematika/pisemneDeleniJednocifernymDelitelem";
import { PISEMNE_NASOBENI } from "./matematika/pisemneNasobeniJednoADvoucifernymCinitelem";
import { ZLOMEK_CAST_CELKU } from "./matematika/zlomekJakoCastCelkuZnazorneniZlomku";
import { SCITANI_ODCITANI_ZLOMKU } from "./matematika/scitaniAOdcitaniZlomkuSeStejnymJmenovatelem";
import { CTENI_ZAPIS_POROVNAVANI } from "./matematika/cteniZapisAPorovnavaniCiselDoMilionu";
import { ZAOKROUHLOVANI } from "./matematika/zaokrouhlovaniNaDesitkyStovkyTisiceDesetitisice";
import { OBVOD_OBSAH } from "./matematika/obvodAObsahObdelnikuACtverce";
import { ROVNOBEZKY_KOLMICE } from "./matematika/rovnobezkyAKolmice";
import { TROJUHELNIK_DRUHY } from "./matematika/trojuhelnikDruhyPodleStran";
import { OSOVA_SOUMERNOST } from "./matematika/osovaSoumernostOsaSoumerneUtvary";
import { ARITMETICKY_PRUMER } from "./matematika/aritmetickyPrumerUvod";
import { TABULKY_DIAGRAMY } from "./matematika/tabulkyDiagramySloupcovyKruhovy";
import { MAGICKE_CTVERCE_RADY } from "./matematika/magickeCtverceCiselneRady";

// Český jazyk a literatura
import { PRAVOPISPREDLOZEKSZSEZE } from "./cjl/pravopisPredlozekSZSeZe";
import { PRAVOPISPREDPONVYVYSZVZ } from "./cjl/pravopisPredponVyVySZVz";
import { PREDPONAKORENPRIPONAKONCOVKA } from "./cjl/predponaKorenPriponaKoncovka";
import { STAVBAVETYZAKLADNISKLADEBNIDVOJICEPODMETPRISUDEK } from "./cjl/stavbaVetyZakladniSkladebniDvojicePodmetPrisudek";
import { VETAJEDNODUCHAASOUVETIVZORECSOUVETI } from "./cjl/vetaJednoduchaASouvetiVzorecSouveti";
import { PODSTATNAJMENASKLONOVANIPODLEVZORURODMUZZENSTR } from "./cjl/podstatnaJmenaSklonovaniPodleVzoruRodMuzZenStr";
import { VZORYPODSTATNYCHJMENPANHRADMUZSTROJPREDSEDASOUDCE } from "./cjl/vzoryPodstatnychJmenPanHradMuzStrojPredsedaSoudce";
import { VZORYPODSTATNYCHJMENZENARUZEPISENKOSTMESTOMOREKURESTAVENI } from "./cjl/vzoryPodstatnychJmenZenaRuzePisenKostMestoMoreKureStaveni";
import { SLOVESAMLUVNICKEKATEGORIECASOVANIVJEDNODUCHYCHCASECH } from "./cjl/slovesaMluvnickeKategorieCasovaniVJednoduchychCasech";
import { ZAJMENADRUHYZAJMEN } from "./cjl/zajmenaDruhyZajmen";
import { DOPISPSANISOUKROMEHODOPISU } from "./cjl/dopisPsaniSoukromehoDopisu";
import { INZERATVZKAZTELEFONICKYROZHOVOR } from "./cjl/inzeratVzkazTelefonickyRozhovor";
import { POPISPREDMETUOSOBYAPRACOVNIHOPOSTUPU } from "./cjl/popisPredmetuOsobyAPracovnihoPostupu";
import { VYPRAVOVANISCASOVOUPOSLOUPNOSTIOSNOVA } from "./cjl/vypravovaniSCasovouPosloupnostiOsnova";
import { MANIPULATIVNIKOMUNIKACEVREKLAME } from "./cjl/manipulativniKomunikaceVReklame";
import { PLYNULECTENISPOROZUMENIMPRIMERENENAROCNYCHTEXTU } from "./cjl/plynuleCteniSPorozumenimPrimereneNarocnychTextu";
import { ROZLISENIPODSTATNYCHAOKRAJOVYCHINFORMACI } from "./cjl/rozliseniPodstatnychAOkrajovychInformaci";
import { VYHLEDAVANIKLICOVYCHSLOVAHLAVNIMYSLENKY } from "./cjl/vyhledavaniKlicovychSlovAHlavniMyslenky";
import { ENCYKLOPEDIESLOVNIKPERIODIKA } from "./cjl/encyklopedieSlovnikPeriodika";
import { POHADKAPOVESTBAJKAPOVIDKA } from "./cjl/pohadkaPovestBajkaPovidka";
import { HLAVNIPOSTAVYAJEJICHCHARAKTERISTIKA } from "./cjl/hlavniPostavyAJejichCharakteristika";
import { VLASTNILITERARNITVORBANADANETEMA } from "./cjl/vlastniLiterarniTvorbaNaDaneTema";

// Vlastivěda
import { T14KRAJUCRJEJICHPOLOHAAKRAJSKAMESTA } from "./vlastiveda/t14KrajuCrJejichPolohaAKrajskaMesta";
import { NASKRAJPRIRODAHOSPODARSTVIZAJIMAVOSTI } from "./vlastiveda/nasKrajPrirodaHospodarstviZajimavosti";
import { DRUHYMAPMERITKOMAPOVEZNACKYSVETOVESTRANY } from "./vlastiveda/druhyMapMeritkoMapoveZnackySvetoveStrany";
import { PODNEBICROVZDUSIPOCASI } from "./vlastiveda/podnebiCrOvzdusiPocasi";
import { POLOHACRVEVROPESOUSEDNISTATY } from "./vlastiveda/polohaCrVEvropeSousedniStaty";
import { POVRCHCRNIZINYVRCHOVINYHORYKRKONOSESUMAVAAJ } from "./vlastiveda/povrchCrNizinyVrchovinyHoryKrkonoseSumavaAj";
import { VODSTVOCRHLAVNIREKYVLTAVALABEMORAVAODRARYBNIKYPREHRADY } from "./vlastiveda/vodstvoCrHlavniRekyVltavaLabeMoravaOdraRybnikyPrehrady";
import { PRAVEKAPRVNILIDENANASEMUZEMI } from "./vlastiveda/pravekAPrvniLideNaNasemUzemi";
import { SLOVANEVELKOMORAVSKARISECYRILAMETODEJ } from "./vlastiveda/slovaneVelkomoravskaRiseCyrilAMetodej";
import { PREMYSLOVCISVVACLAVPREMYSLOTAKARIIVACLAVII } from "./vlastiveda/premyslovciSvVaclavPremyslOtakarIiVaclavIi";
import { LUCEMBURKOVEKARELIVAJEHODOBA } from "./vlastiveda/lucemburkoveKarelIvAJehoDoba";
import { MISTRJANHUSHUSITSKEVALKY } from "./vlastiveda/mistrJanHusHusitskeValky";
import { VZNIKAVYVOJSTATUDEMOKRACIEPRAVNISTAT } from "./vlastiveda/vznikAVyvojStatuDemokraciePravniStat";

// Přírodověda
import { VODASKUPENSTVIKOLOBEHVODYVPRIRODE } from "./prirodoveda/vodaSkupenstviKolobehVodyVPrirode";
import { VZDUCHSLOZENIVLASTNOSTIVYZNAM } from "./prirodoveda/vzduchSlozeniVlastnostiVyznam";
import { SLUNCESVETLOTEPLOENERGIE } from "./prirodoveda/slunceSvetloTeploEnergie";
import { PUDAVZNIKSLOZENIVYZNAMPROZIVOT } from "./prirodoveda/pudaVznikSlozeniVyznamProZivot";
import { LESLOUKAPOLERYBNIKROSTLINYAZIVOCICHOVE } from "./prirodoveda/lesLoukaPoleRybnikRostlinyAZivocichove";
import { DREVINYSTROMYAKERE } from "./prirodoveda/drevinyStromyAKere";
import { HOSPODARSKEROSTLINYOBILNINYOVOCEZELENINA } from "./prirodoveda/hospodarskeRostlinyObilninyOvoceZelenina";
import { STAVBAROSTLINROZSIRENIDRUHYROSTLIN } from "./prirodoveda/stavbaRostlinRozsireniDruhyRostlin";
import { BEZOBRATLIAOBRATLOVCIUVODNITRIDENI } from "./prirodoveda/bezobratliAObratlovciUvodniTrideni";
import { SAVCIPTACIZNAKYZASTUPCI } from "./prirodoveda/savciPtaciZnakyZastupci";
import { CHRANENEROSTLINYAZIVOCICHOVEOHROZENEDRUHY } from "./prirodoveda/chraneneRostlinyAZivocichoveOhrozeneDruhy";
import { PRVNIPOMOCTISNOVEVOLANIMIMORADNEUDALOSTI } from "./prirodoveda/prvniPomocTisnoveVolaniMimoradneUdalosti";
import { STRAVAPOHYBSPANEKPREVENCEURAZUANEMOCI } from "./prirodoveda/stravaPohybSpanekPrevenceUrazuANemoci";

// Informatika — skryta, soubory existuji, az bude pripravena zverejnit odkomentovat

export const GRADE_4_TOPICS: TopicMetadata[] = [
  // Matematika (14)
  ...PISEMNE_SCITANI_ODCITANI,
  ...PISEMNE_DELENI,
  ...PISEMNE_NASOBENI,
  ...ZLOMEK_CAST_CELKU,
  ...SCITANI_ODCITANI_ZLOMKU,
  ...CTENI_ZAPIS_POROVNAVANI,
  ...ZAOKROUHLOVANI,
  ...OBVOD_OBSAH,
  ...ROVNOBEZKY_KOLMICE,
  ...TROJUHELNIK_DRUHY,
  ...OSOVA_SOUMERNOST,
  ...ARITMETICKY_PRUMER,
  ...TABULKY_DIAGRAMY,
  ...MAGICKE_CTVERCE_RADY,
  // Český jazyk a literatura (22)
  ...PRAVOPISPREDLOZEKSZSEZE,
  ...PRAVOPISPREDPONVYVYSZVZ,
  ...PREDPONAKORENPRIPONAKONCOVKA,
  ...STAVBAVETYZAKLADNISKLADEBNIDVOJICEPODMETPRISUDEK,
  ...VETAJEDNODUCHAASOUVETIVZORECSOUVETI,
  ...PODSTATNAJMENASKLONOVANIPODLEVZORURODMUZZENSTR,
  ...VZORYPODSTATNYCHJMENPANHRADMUZSTROJPREDSEDASOUDCE,
  ...VZORYPODSTATNYCHJMENZENARUZEPISENKOSTMESTOMOREKURESTAVENI,
  ...SLOVESAMLUVNICKEKATEGORIECASOVANIVJEDNODUCHYCHCASECH,
  ...ZAJMENADRUHYZAJMEN,
  ...DOPISPSANISOUKROMEHODOPISU,
  ...INZERATVZKAZTELEFONICKYROZHOVOR,
  ...POPISPREDMETUOSOBYAPRACOVNIHOPOSTUPU,
  ...VYPRAVOVANISCASOVOUPOSLOUPNOSTIOSNOVA,
  ...MANIPULATIVNIKOMUNIKACEVREKLAME,
  ...PLYNULECTENISPOROZUMENIMPRIMERENENAROCNYCHTEXTU,
  ...ROZLISENIPODSTATNYCHAOKRAJOVYCHINFORMACI,
  ...VYHLEDAVANIKLICOVYCHSLOVAHLAVNIMYSLENKY,
  ...ENCYKLOPEDIESLOVNIKPERIODIKA,
  ...POHADKAPOVESTBAJKAPOVIDKA,
  ...HLAVNIPOSTAVYAJEJICHCHARAKTERISTIKA,
  ...VLASTNILITERARNITVORBANADANETEMA,
  // Vlastivěda (13)
  ...T14KRAJUCRJEJICHPOLOHAAKRAJSKAMESTA,
  ...NASKRAJPRIRODAHOSPODARSTVIZAJIMAVOSTI,
  ...DRUHYMAPMERITKOMAPOVEZNACKYSVETOVESTRANY,
  ...PODNEBICROVZDUSIPOCASI,
  ...POLOHACRVEVROPESOUSEDNISTATY,
  ...POVRCHCRNIZINYVRCHOVINYHORYKRKONOSESUMAVAAJ,
  ...VODSTVOCRHLAVNIREKYVLTAVALABEMORAVAODRARYBNIKYPREHRADY,
  ...PRAVEKAPRVNILIDENANASEMUZEMI,
  ...SLOVANEVELKOMORAVSKARISECYRILAMETODEJ,
  ...PREMYSLOVCISVVACLAVPREMYSLOTAKARIIVACLAVII,
  ...LUCEMBURKOVEKARELIVAJEHODOBA,
  ...MISTRJANHUSHUSITSKEVALKY,
  ...VZNIKAVYVOJSTATUDEMOKRACIEPRAVNISTAT,
  // Přírodověda (13)
  ...VODASKUPENSTVIKOLOBEHVODYVPRIRODE,
  ...VZDUCHSLOZENIVLASTNOSTIVYZNAM,
  ...SLUNCESVETLOTEPLOENERGIE,
  ...PUDAVZNIKSLOZENIVYZNAMPROZIVOT,
  ...LESLOUKAPOLERYBNIKROSTLINYAZIVOCICHOVE,
  ...DREVINYSTROMYAKERE,
  ...HOSPODARSKEROSTLINYOBILNINYOVOCEZELENINA,
  ...STAVBAROSTLINROZSIRENIDRUHYROSTLIN,
  ...BEZOBRATLIAOBRATLOVCIUVODNITRIDENI,
  ...SAVCIPTACIZNAKYZASTUPCI,
  ...CHRANENEROSTLINYAZIVOCICHOVEOHROZENEDRUHY,
  ...PRVNIPOMOCTISNOVEVOLANIMIMORADNEUDALOSTI,
  ...STRAVAPOHYBSPANEKPREVENCEURAZUANEMOCI,
  // Informatika (10) — skryta, odkomentovat az bude pripravena
];
