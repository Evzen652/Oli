import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pad } from "@/lib/czechGrammar";
import { DEFAULT_DAILY_COUNT } from "@/lib/anonDailyTasks";
import { LandingNav } from "./LandingNav";
import imgVysvetleni from "@/assets/help-hint.png";
import imgDiktat from "@/assets/landing-diktat.png";
import imgPisemka from "@/assets/landing-priprava-na-pisemku.png";
import imgZlomky from "@/assets/landing-zlomky-kruh.png";
import imgProcvicovani from "@/assets/landing-kazdodenni-vyucovani.png";
import imgRodina from "@/assets/landing-vstup-bez-barier.png";
import imgZdraviHygiena from "@/assets/landing-propojeni-s-rodicem.png";
import imgRocniObdobi from "@/assets/landing-samostatne-nebo-spolecne.png";
import imgVyberTematu from "@/assets/landing-vyber-tematu.png";
import imgKrokZaKrokem from "@/assets/landing-krok-za-krokem.png";
import imgPrehledUspechu from "@/assets/landing-prehled-o-uspechu.png";
import imgPrehledPokroku from "@/assets/landing-prehled-o-pokroku.png";
import imgMaleKroky from "@/assets/landing-male-kroky.png";
import imgPripravaPisemka from "@/assets/landing-priprava-pisemka.png";
import imgBezStresu from "@/assets/landing-bez-stresu.png";
import imgBezpecneProstredi from "@/assets/landing-bezpecne-prostredi.png";
import imgPravidelnyNavyk from "@/assets/landing-pravidelny-navyk.png";
import imgKratkeProcvicovani from "@/assets/landing-kratke-procvicovani.png";
import imgCileneProcvicovani from "@/assets/landing-cilene-procvicovani.png";
import imgPrehledProRodice from "@/assets/landing-prehled-pro-rodice.png";
import {
  BookOpen, BarChart3, Target, Shield, Clock, Sparkles,
  UserPlus, KeyRound, TrendingUp, CheckCircle2, Eye, Zap,
  ArrowRight, GraduationCap, Heart
} from "lucide-react";

/* ── helpers ── */
/**
 * Privátní paleta landingu. `brand` drží značkovou oranžovou z loga; `bg*` jsou
 * DEKORATIVNÍ tinty dlaždic, ne odvozeniny primární barvy — střídají se jako
 * trojice modrá / oranžová / zelená, aby po sobě jdoucí karty šly rozeznat.
 * Nesjednocovat je s `--accent`: tím by modrá i oranžová splynuly v jednu.
 */
const C = {
  brand: "#F97316",     /* --primary  značková oranžová, shodná s logem */
  brandHover: "#EA580C",/* --primary-hover */
  teal: "#0F766E",      /* předmětová prvouka — 5,47:1 na bílé */
  dark: "#1C1917",      /* --foreground  teplá, ne studená slate */
  bgBlue: "#EAF2FF",    /* dekorativní modrý tint */
  bgGreen: "#CCFBF1",   /* dekorativní mátový tint */
  bgOrange: "#FFF1E6",  /* tint sovy/maskota */
  bgGray: "#F2F0EA",    /* --muted  teplá plocha */
  bgWarning: "#FEF6E7", /* --warning-muted  jantarový tint */
};

/**
 * Stín ilustrací. Tailwindí `drop-shadow-lg` má krytí 0,04 / 0,1 — na akvarelu
 * s měkkým, poloprůhledným okrajem se přes něj rozprostře do neviditelna.
 * Proto vlastní hodnota: kratší rozostření a výrazně vyšší krytí, v teplém
 * odstínu (rgba(41,37,36)) shodném se stínovými tokeny v `tailwind.config.ts`.
 */
const IMG_SHADOW = "drop-shadow-[0_6px_5px_rgba(41,37,36,0.30)]";

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`py-20 sm:py-28 ${className}`}><div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div></section>;
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading" style={{ color: C.dark }}>{title}</h2>
      {sub && <p className="text-lg text-muted-foreground leading-relaxed">{sub}</p>}
    </div>
  );
}

/** Pastelová plocha nese celou kartu — barva je podklad, ne jen dlaždice ikony. */
function FeatureCard({ img, title, desc, bg, preprocessed }: { img: string; title: string; desc: string; bg?: string; preprocessed?: boolean }) {
  return (
    <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ background: bg || "#fff" }}>
      <CardContent className="p-7 space-y-3">
        {/* Jednotná výška, volná šířka — kresby mají poměr stran od 0,84 do 2,48
            a ve čtverci by se ty široké zmenšily nejvíc. */}
        <DewhiteImg preprocessed={preprocessed} src={img} alt={title} className={`h-16 w-auto max-w-full object-contain ${IMG_SHADOW}`} />
        <h3 className="text-lg font-semibold font-heading" style={{ color: C.dark }}>{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

/* ── page ── */
/**
 * Odstraní bílé pozadí v prohlížeči (canvas). POZOR: na rozdíl od serverového
 * `dewhiteBackground` NEMÁ flood-fill od okrajů — maže podle jasu kdekoli, i
 * uvnitř kresby. U akvarelu to sežere pleť a odlesky (naměřeno 11 % krycích
 * pixelů). Proto `preprocessed` u obrázků, které už průhledné jsou: druhý
 * průchod by je jen poškodil.
 */
function DewhiteImg({ src, alt, className, style, threshold = 245, preprocessed = false }: { src: string; alt: string; className?: string; style?: React.CSSProperties; threshold?: number; preprocessed?: boolean }) {
  const [out, setOut] = useState(src);
  useEffect(() => {
    if (preprocessed) { setOut(src); return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      try {
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = d.data;
        const fade = threshold - 35;
        for (let i = 0; i < px.length; i += 4) {
          const brightness = (px[i] + px[i + 1] + px[i + 2]) / 3;
          if (brightness > threshold) { px[i + 3] = 0; }
          else if (brightness > fade) { px[i + 3] = Math.round((threshold - brightness) * (255 / (threshold - fade))); }
        }
        ctx.putImageData(d, 0, 0);
        setOut(canvas.toDataURL("image/png"));
      } catch { /* CORS blokuje canvas — mix-blend-multiply zajistí vizuální transparentnost */ }
    };
    img.src = src;
  }, [src, threshold, preprocessed]);
  return <img src={out} alt={alt} className={className} style={style} />;
}

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.bgBlue}80, white 60%, ${C.bgGreen}40)` }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start pt-6 sm:pt-10">
            {/* Left — text */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.12] font-heading" style={{ color: C.dark }}>
                Zvládnete školu a písemky s jistotou
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Oli učí, pomáhá, procvičuje — krok za krokem
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="text-base px-12 h-14 gap-2 rounded-full shadow-e2 w-full sm:w-auto bg-primary hover:bg-primary-hover transition-colors duration-150" onClick={() => navigate("/onboarding")}>
                  Začít zdarma <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right — 2x2 topic tiles */}
            <div className="hidden lg:grid grid-cols-2 gap-7 -mt-12">
              {[
                {
                  title: "Diktát",
                  desc: "Čeština krok za krokem",
                  img: imgDiktat,
                  bg: "linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)",
                  border: "border-purple-200/60",
                  rotate: "-rotate-1",
                  imgClass: "max-h-44",
                },
                {
                  title: "Příprava na písemku",
                  desc: "Procvičení konkrétní látky",
                  img: imgPisemka,
                  bg: "linear-gradient(135deg, #EAF2FF 0%, #DBEAFE 100%)",
                  border: "border-blue-200/60",
                  rotate: "rotate-1",
                  mt: "mt-6",
                  imgClass: "max-h-44",
                },
                {
                  title: "Zlomky",
                  desc: "Matematika srozumitelně",
                  img: imgZlomky,
                  bg: "linear-gradient(135deg, #CCFBF1 0%, #D1FAE5 100%)",
                  border: "border-teal-200/60",
                  rotate: "rotate-1",
                  mt: "mt-4",
                  imgClass: "max-h-40",
                },
                {
                  title: "Každodenní vyučování",
                  desc: "Krátké úkoly na míru",
                  img: imgProcvicovani,
                  bg: "linear-gradient(135deg, #FFF1E6 0%, #FED7AA 40%, #FFEDD5 100%)",
                  border: "border-orange-200/60",
                  rotate: "-rotate-1",
                  mt: "-mt-2",
                  // Batoh je předmět, ne postava — při stejné výšce jako dítě
                  // u „Diktátu" působil předimenzovaně. Nižší strop ho srovná
                  // s dortem, aniž by ostatní dlaždice musely zmenšovat.
                  imgClass: "max-h-36",
                },
              ].map((tile) => (
                <div
                  key={tile.title}
                  className={`group rounded-3xl shadow-e1 hover:shadow-e2 hover:scale-[1.05] hover:-translate-y-2 hover:rotate-0 transition-all duration-500 ease-out p-6 flex flex-col justify-between min-h-[230px] cursor-default border ${tile.border} ${tile.rotate} ${tile.mt ?? ""}`}
                  style={{ background: tile.bg }}
                >
                  {/* Illustration — large, dominant.
                      Šířka na celou dlaždici (ne čtverec): ilustrace jsou různě
                      široké a ve čtvercovém boxu by se ty na šířku zmenšily
                      podle své nejdelší strany, tedy na půlku výšky. */}
                  <div className="flex-1 flex items-center justify-center mb-3">
                    <DewhiteImg
                      preprocessed
                      src={tile.img}
                      alt={tile.title}
                      className={`w-full ${tile.imgClass} object-contain group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 ease-out ${IMG_SHADOW}`}
                    />
                  </div>
                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-bold leading-tight font-heading" style={{ color: C.dark }}>
                      {tile.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{tile.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile — stacked tiles */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {[
                { title: "Diktát", desc: "Čeština krok za krokem", img: imgDiktat, bg: "#F3E8FF" },
                { title: "Příprava na písemku", desc: "Procvičení konkrétní látky", img: imgPisemka, bg: C.bgBlue },
                { title: "Zlomky", desc: "Matematika srozumitelně", img: imgZlomky, bg: C.bgGreen },
                { title: "Každodenní vyučování", desc: "Krátké úkoly na míru", img: imgProcvicovani, bg: C.bgOrange },
              ].map((tile) => (
                <div key={tile.title} className="rounded-2xl shadow-e1 p-4 flex flex-col gap-2 items-center text-center" style={{ background: tile.bg }}>
                  <DewhiteImg preprocessed src={tile.img} alt={tile.title} className={`w-full max-h-20 object-contain ${IMG_SHADOW}`} />
                  <h3 className="text-sm font-bold font-heading" style={{ color: C.dark }}>{tile.title}</h3>
                  <p className="text-xs text-muted-foreground">{tile.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ JAK TO FUNGUJE ═══════ */}
      <Section id="jak-to-funguje" className="bg-[#F8FAFC]">
        <SectionHead title="Jak to funguje" sub="Tři kroky od prvního spuštění až po každodenní učení." />
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { img: imgRodina, step: "1", title: "Vstup bez bariér", desc: "Stačí vybrat ročník. Žádná registrace, žádné heslo. 14 dní plný přístup zdarma.", bg: C.bgBlue },
            { img: imgZdraviHygiena, step: "2", title: "Propojení s rodičem", desc: "Volitelné. Když rodič vytvoří účet, vidí pokrok dítěte a může zadávat úkoly.", bg: C.bgOrange },
            { img: imgRocniObdobi, step: "3", title: "Samostatně nebo společně", desc: "Aplikace funguje jen pro děti, ale s rodičem dává úžasné možnosti.", bg: C.bgGreen },
          ].map((item) => (
            <Card key={item.step} className="rounded-3xl border-0 shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ background: item.bg }}>
              <CardContent className="p-8 space-y-4">
                {/* Jednotná VÝŠKA, ne čtverec: tyhle tři kresby mají různý poměr
                    stran (0,86 / 1,11 / 1,38) a ve čtvercovém boxu by se ta
                    nejširší zmenšila podle šířky, tedy opticky nejvíc. */}
                <DewhiteImg preprocessed src={item.img} alt={item.title} className={`mx-auto h-28 w-auto max-w-full object-contain ${IMG_SHADOW}`} />
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: C.brand }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold font-heading" style={{ color: C.dark }}>{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══════ PŘÍPRAVA NA PÍSEMKY ═══════ */}
      <Section id="pisemka" className="">
        <SectionHead title="Příprava na písemku bez stresu" sub="Stačí vybrat téma a aplikace připraví cvičení krok za krokem." />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: 1, img: imgVyberTematu, title: "Výběr tématu", desc: "Vyjmenovaná slova, zlomky, dělení — cokoli, co se zrovna učí ve škole.", bg: C.bgBlue },
            { step: 2, img: imgKrokZaKrokem, title: "Procvičování krok za krokem", desc: "Aplikace začíná lehčími úlohami a postupuje k obtížnějším. Nápověda je k dispozici, žádný stres.", bg: C.bgOrange },
            { step: 3, img: imgPrehledUspechu, title: "Přehled o úspěchu", desc: "S rodičovským účtem je vidět, co se daří a kde je co zlepšit.", bg: C.bgGreen },
          ].map((item) => (
            <div key={item.step} className="relative rounded-3xl p-6 shadow-md flex flex-col gap-3" style={{ background: item.bg }}>
              <div className="absolute top-4 right-4 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: C.brand }}>
                {item.step}
              </div>
              <DewhiteImg preprocessed src={item.img} alt={item.title} className={`h-20 w-auto max-w-full object-contain ${IMG_SHADOW}`} />
              <h3 className="text-base font-semibold font-heading pr-8" style={{ color: C.dark }}>{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════ KAŽDODENNÍ VYUČOVÁNÍ ═══════ */}
      <Section id="den-s-olim">
        <SectionHead title="Každodenní vyučování" sub="Pár minut denně — pravidelný návyk místo nárazového učení." />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: 1, img: imgKratkeProcvicovani, title: "Krátké procvičování každý den", desc: "Aplikace postupně přidává obtížnost — pár minut denně místo dlouhého sezení.", bg: C.bgOrange },
            { step: 2, img: imgCileneProcvicovani, title: "Cílené procvičování", desc: "Při přípravě na písemku zvolíte téma a aplikace vede dítě krok za krokem.", bg: C.bgBlue },
            { step: 3, img: imgPrehledProRodice, title: "Přehled pro rodiče", desc: "Vidíte, co dítě procvičovalo, jak se mu dařilo a kde se posouvá.", bg: C.bgGreen },
          ].map((item) => (
            <div key={item.step} className="relative rounded-3xl p-6 shadow-md flex flex-col gap-3" style={{ background: item.bg }}>
              <div className="absolute top-4 right-4 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: C.brand }}>
                {item.step}
              </div>
              <DewhiteImg preprocessed src={item.img} alt={item.title} className={`h-20 w-auto max-w-full object-contain ${IMG_SHADOW}`} />
              <h3 className="text-base font-semibold font-heading pr-8" style={{ color: C.dark }}>{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════ HLAVNÍ PŘÍNOSY ═══════ */}
      <Section id="prinosy" className="bg-[#F8FAFC]">
        <SectionHead title="Co vám Oli přinese" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard img={imgPrehledPokroku} preprocessed title="Přehled o pokroku" desc="Každý den vidíte, co dítě procvičilo a jak se mu dařilo." bg={C.bgOrange} />
          <FeatureCard img={imgMaleKroky} preprocessed title="Učení po malých krocích" desc="Krátké úlohy místo dlouhých sezení." bg={C.bgBlue} />
          <FeatureCard img={imgPripravaPisemka} preprocessed title="Příprava na konkrétní písemku" desc="Možnost zadat téma předem." bg={C.bgBlue} />
          <FeatureCard img={imgBezStresu} preprocessed title="Bez stresu a známkování" desc="Žádné 1–5. Pozitivní zpětná vazba." bg={C.bgGreen} />
          <FeatureCard img={imgPravidelnyNavyk} preprocessed title="Pravidelný návyk" desc="Pár minut denně místo nárazového učení." bg={C.bgWarning} />
          <FeatureCard img={imgBezpecneProstredi} preprocessed title="Bezpečné prostředí" desc="Žádné reklamy, žádné odkazy ven z aplikace." bg={C.bgOrange} />
        </div>
      </Section>

      {/* ═══════ CENY ═══════ */}
      <Section id="ceny">
        <SectionHead title="Jednoduchý ceník" sub="Vyberte si, co vám dává smysl" />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
          {/* Free */}
          <Card className="rounded-3xl shadow-e1">
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Zdarma</h3><p className="text-sm text-muted-foreground mt-1">Na vyzkoušení a první pokroky</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>0 Kč</span><span className="text-muted-foreground text-sm">/měsíc</span></div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Anonymní vstup bez registrace", "14 dní plný přístup zdarma", `Po 14 dnech: ${pad(DEFAULT_DAILY_COUNT, "CVIČENÍ")} denně navždy`, "Veškerý hotový obsah"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} /> {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth?mode=register")}>Začít zdarma</Button>
            </CardContent>
          </Card>

          {/* Standard */}
          <Card className="rounded-3xl shadow-2xl relative sm:-mt-4 sm:mb-4" style={{ border: `2px solid ${C.brand}` }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="warning" className="px-4 py-1">Připravujeme</Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Standard</h3><p className="text-sm text-muted-foreground mt-1">Pro pravidelný posun a přehled</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>249 Kč</span><span className="text-muted-foreground text-sm">/měsíc</span></div>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  { text: "Neomezené procvičování", soon: false },
                  { text: "Rodičovský přehled a zadávání úkolů", soon: false },
                  { text: "Týdenní přehled pokroku", soon: false },
                  { text: "AI hodnocení", soon: true },
                  { text: "Všechny předměty 1.–9. třída (postupně přibývají)", soon: true },
                ].map((f) => (
                  <li key={f.text} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} />
                    {f.soon ? <span>🕒 <em>{f.text}</em></span> : f.text}
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full text-white gap-2" style={{ background: C.brand }} onClick={() => navigate("/auth?mode=register")}>
                Založit účet zdarma <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-caption text-muted-foreground text-center">Placené plány zatím nespouštíme — účet i obsah jsou teď zdarma.</p>
            </CardContent>
          </Card>

          {/* Family */}
          <Card className="rounded-3xl shadow-e1 relative" style={{ border: `2px solid ${C.teal}` }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="warning" className="px-4 py-1">Připravujeme</Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Rodinný</h3><p className="text-sm text-muted-foreground mt-1">Pro více dětí</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>399 Kč</span><span className="text-muted-foreground text-sm">/měsíc</span></div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Vše ze Standard plánu", "Až 3 děti pod jedním účtem"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} /> {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth?mode=register")}>Založit účet zdarma</Button>
              <p className="text-caption text-muted-foreground text-center">Placené plány zatím nespouštíme — účet i obsah jsou teď zdarma.</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          Ceny ukazujeme dopředu, ať víte, s čím počítat. Zatím se neplatí nic —
          registrace i veškerý obsah jsou zdarma a kartu po vás nikdo nechce.
        </p>
      </Section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-20 sm:py-28" style={{ background: `linear-gradient(135deg, ${C.bgBlue}60, ${C.bgGreen}40)` }}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading" style={{ color: C.dark }}>
            Začněte mít přehled o učení vašeho dítěte
          </h2>
          <p className="text-lg text-muted-foreground">Registrace trvá minutu. Prvních 14 dní je zdarma.</p>
          <Button size="lg" className="text-base px-10 h-13 gap-2 rounded-full shadow-e2 text-white" style={{ background: C.brand }} onClick={() => navigate("/auth?mode=register")}>
            Vytvořit účet zdarma <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Oli. Všechna práva vyhrazena.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-slate-700 transition-colors">Podmínky</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Ochrana soukromí</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
