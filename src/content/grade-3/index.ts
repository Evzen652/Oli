import type { TopicMetadata } from "@/lib/types";

// ── Matematika (13) ──
import { CTENIZAPISPOROVNAVANICISELDO1000 } from "./matematika/cteniZapisPorovnavaniCiselDo1000";
import { ZAOKROUHLOVANINADESITKYASTOVKY } from "./matematika/zaokrouhlovaniNaDesitkyAStovky";
import { SCITANIAODCITANIDO1000 } from "./matematika/scitaniAOdcitaniDo1000";
import { NASOBILKA6789A10 } from "./matematika/nasobilka6789a10";
import { NASOBENIADELENIMALANASOBILKA } from "./matematika/nasobeniADeleniMalaNasobilka";
import { NASOBENI10A100DELENISEZBYTKEM } from "./matematika/nasobeni10a100DeleniSeZbytkem";
import { PREVODYJEDNOTEKDELKY } from "./matematika/prevodyJednotekDelky";
import { PREVODYJEDNOTEKHMOTNOSTIOBJEMCAS } from "./matematika/prevodyJednotekHmotnostiObjemCas";
import { TABULKYJIZDNIRADYDIAGRAMY } from "./matematika/tabulkyJizdniRadyDiagramy";
import { SLOVNIULOHYSEDVEMAOPERACEMI } from "./matematika/slovniUlohySeDvemaOperacemi";
import { RYSOVANIUSECKYODANEDELCE } from "./matematika/rysovaaniUseckyODaneDelce";
import { KRUZNICAAKRUHRYSOVANI } from "./matematika/kruznicaKruhRysovani";
import { OBVODTROJUHELNIKUCTVERCEOBD } from "./matematika/obvodTrojuhelnikuCtverceObdelniku";

// ── Prvouka (14) ──
import { MINULOSTREGIONUPOVESTI } from "./prvouka/minulostRegionuPovesti";
import { CASOVAPRIMKAGENERACE } from "./prvouka/casovaPrimkaGenerace";
import { KOMUNIKACEBEZPECNOST } from "./prvouka/komunikaceBezpecnost";
import { VZTAHYKONFLIKTY } from "./prvouka/vztahyKonflikty";
import { KRAJEREGIONYCR } from "./prvouka/krajeRegionyCr";
import { MAPASTRANYSVET } from "./prvouka/mapaStranySveta";
import { CRSYMBOLY } from "./prvouka/crSymboly";
import { EKOSYSTEMYPOLLOUKAES } from "./prvouka/ekosystemyPoleLoukaLes";
import { SKUPINYZIVOCICHU } from "./prvouka/skupinyZivocichu";
import { STAVBAROSTLIN } from "./prvouka/stavbaRostlin";
import { ZIVANEZIVAPRIRODA } from "./prvouka/zivaNezivaPrivroda";
import { VODAVZDUCHPUDA } from "./prvouka/vodaVzduchPuda";
import { MIMORADNEUDALOSTI } from "./prvouka/mimoradneUdalosti";
import { STAVBATELAAZDRAV } from "./prvouka/stavbaTelaaZdravi";

// ── Český jazyk a literatura (25) ──
import { SLOVAPRIBYZNAKOREN } from "./cjl/slovaPribuznaKorenSlova";
import { SLOVASOUZNACNAPROTIKLADNA } from "./cjl/slovaSouznacnaAProtikladna";
import { SLOVAJEDNOZNACNAMNOHO } from "./cjl/slovaJednoznacnaMnohoznacna";
import { SLOVAPRIBYZNAVANJE } from "./cjl/slovaPribuznaVyjmenovana";
import { VYJMENOVANASLOVA } from "./cjl/vyjmenovanaSlova";
import { VELKAPISMENA } from "./cjl/velkaPismenaVlastniJmena";
import { SPOJOVANIVETSPOJKAMI } from "./cjl/spojovaniVetSpojkami";
import { VETAJJEDNODUCHASONVETI } from "./cjl/vetaJednoduchaSouveti";
import { PODSTATNAROD } from "./cjl/podstatnaJmenaRodCisloPad";
import { SLOVESAOSOBACISELCAS } from "./cjl/slovesaOsobaCisloCas";
import { SLOVNIDRUHY } from "./cjl/slovniDruhyPrehled";
import { SEBEKONTROLAPROJEVU } from "./cjl/sebekontrolaPisemnehoProjevu";
import { UHLEDNEPISANI } from "./cjl/uhledneACitelnePsani";
import { DIALOGPRAVIDLA } from "./cjl/dialogPravidlaRozhovoru";
import { OMLUVENKAZPRAVA } from "./cjl/omluvenkaZpravaOznameniPozvanka";
import { POPISPREDMETU } from "./cjl/popisPredmetuZvireteOsoby";
import { VYPRAVOVANIOSNOVA } from "./cjl/vypravovaniOsnova";
import { PLYNULECTENI } from "./cjl/plynuleCteniSPorozumenim";
import { REPRODUKCETEXTU } from "./cjl/reprodukcePrectenehoTextu";
import { VYHLEDAVANIINFO } from "./cjl/vyhledavaniInformaciKlicova";
import { POHADKAPOVIDKA } from "./cjl/pohadkaPovídkaBasenBajka";
import { PROZAVERSE } from "./cjl/prozaAVerseRozliseni";
import { VERSRYMPRIROVNANI } from "./cjl/versRymPrirovnani";
import { TVORIVECINN } from "./cjl/tvoriveCinnostiLiterarni";
import { VLASTNIVYTVARNY } from "./cjl/vlastniVytvarnyDoprovod";

export const GRADE_3_TOPICS: TopicMetadata[] = [
  // ── Matematika ──
  ...CTENIZAPISPOROVNAVANICISELDO1000,
  ...ZAOKROUHLOVANINADESITKYASTOVKY,
  ...SCITANIAODCITANIDO1000,
  ...NASOBILKA6789A10,
  ...NASOBENIADELENIMALANASOBILKA,
  ...NASOBENI10A100DELENISEZBYTKEM,
  ...PREVODYJEDNOTEKDELKY,
  ...PREVODYJEDNOTEKHMOTNOSTIOBJEMCAS,
  ...TABULKYJIZDNIRADYDIAGRAMY,
  ...SLOVNIULOHYSEDVEMAOPERACEMI,
  ...RYSOVANIUSECKYODANEDELCE,
  ...KRUZNICAAKRUHRYSOVANI,
  ...OBVODTROJUHELNIKUCTVERCEOBD,

  // ── Prvouka ──
  ...MINULOSTREGIONUPOVESTI,
  ...CASOVAPRIMKAGENERACE,
  ...KOMUNIKACEBEZPECNOST,
  ...VZTAHYKONFLIKTY,
  ...KRAJEREGIONYCR,
  ...MAPASTRANYSVET,
  ...CRSYMBOLY,
  ...EKOSYSTEMYPOLLOUKAES,
  ...SKUPINYZIVOCICHU,
  ...STAVBAROSTLIN,
  ...ZIVANEZIVAPRIRODA,
  ...VODAVZDUCHPUDA,
  ...MIMORADNEUDALOSTI,
  ...STAVBATELAAZDRAV,

  // ── Český jazyk a literatura ──
  ...SLOVAPRIBYZNAKOREN,
  ...SLOVASOUZNACNAPROTIKLADNA,
  ...SLOVAJEDNOZNACNAMNOHO,
  ...SLOVAPRIBYZNAVANJE,
  ...VYJMENOVANASLOVA,
  ...VELKAPISMENA,
  ...SPOJOVANIVETSPOJKAMI,
  ...VETAJJEDNODUCHASONVETI,
  ...PODSTATNAROD,
  ...SLOVESAOSOBACISELCAS,
  ...SLOVNIDRUHY,
  ...SEBEKONTROLAPROJEVU,
  ...UHLEDNEPISANI,
  ...DIALOGPRAVIDLA,
  ...OMLUVENKAZPRAVA,
  ...POPISPREDMETU,
  ...VYPRAVOVANIOSNOVA,
  ...PLYNULECTENI,
  ...REPRODUKCETEXTU,
  ...VYHLEDAVANIINFO,
  ...POHADKAPOVIDKA,
  ...PROZAVERSE,
  ...VERSRYMPRIROVNANI,
  ...TVORIVECINN,
  ...VLASTNIVYTVARNY,
];
