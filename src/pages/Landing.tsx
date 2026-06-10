import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingNav } from "./LandingNav";
import imgUceni from "@/assets/good-to-know.png";
import imgVysvetleni from "@/assets/help-hint.png";
import imgStarosti from "@/assets/category-info.png";

// Nově generované ilustrace ze Supabase storage
const S = "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images";
const si = (key: string) => `${S}/${key}.png`;

const imgPisemka     = si("subject-cestina");
const imgDiktat      = si("topic-cz-diktat");
const imgZlomky      = si("landing-zlomky");
const imgProcvicovani = si("landing-kazdenodni-vyucovani");
const imgRodina      = si("landing-vstup-bez-barier");
const imgZdraviHygiena = si("landing-rodic-propojeni");
const imgRocniObdobi = si("landing-samostatne-spolecne");
const imgBarChart    = si("cat-math-cisla-a-operace");
const imgSkola       = si("cat-cz-pravopis");
const imgPodpora     = si("topic-rostliny");
const imgProstredi   = si("topic-zvirata");
const imgProcvic     = si("subject-prvouka");
const imgPrehled     = si("cat-math-zlomky");
const imgCilene      = si("subject-cestina");
import {
  BookOpen, BarChart3, Target, Shield, Clock, Sparkles,
  UserPlus, KeyRound, TrendingUp, CheckCircle2, Eye, Zap,
  ArrowRight, GraduationCap, Heart
} from "lucide-react";

/* ── helpers ── */
const C = {
  orange: "#F97316",
  teal: "#14B8A6",
  dark: "#0F172A",
  bgBlue: "#EAF2FF",
  bgGreen: "#CCFBF1",
  bgOrange: "#FFF1E6",
  bgGray: "#F8FAFC",
};

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`py-20 sm:py-28 ${className}`}><div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div></section>;
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading" style={{ color: C.dark }}>{title}</h2>
      {sub && <p className="text-lg text-slate-500 leading-relaxed">{sub}</p>}
    </div>
  );
}

function FeatureCard({ img, title, desc, bg }: { img: string; title: string; desc: string; bg?: string }) {
  return (
    <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ background: bg || "#fff" }}>
      <CardContent className="p-7 space-y-3">
        <DewhiteImg src={img} alt={title} className="h-14 w-14 object-contain drop-shadow-md" />
        <h3 className="text-lg font-semibold font-heading" style={{ color: C.dark }}>{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

/* ── page ── */
function DewhiteImg({ src, alt, className, style, threshold = 245 }: { src: string; alt: string; className?: string; style?: React.CSSProperties; threshold?: number }) {
  const [out, setOut] = useState(src);
  useEffect(() => {
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
  }, [src, threshold]);
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
              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-lg">
                Oli učí, pomáhá, procvičuje — krok za krokem
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="text-base px-12 h-14 gap-2 rounded-full shadow-lg shadow-orange-200 w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors duration-150" onClick={() => navigate("/onboarding")}>
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
                },
                {
                  title: "Příprava na písemku",
                  desc: "Procvičení konkrétní látky",
                  img: imgPisemka,
                  bg: "linear-gradient(135deg, #EAF2FF 0%, #DBEAFE 100%)",
                  border: "border-blue-200/60",
                  rotate: "rotate-1",
                  mt: "mt-6",
                  threshold: 220,
                },
                {
                  title: "Zlomky",
                  desc: "Matematika srozumitelně",
                  img: imgZlomky,
                  bg: "linear-gradient(135deg, #CCFBF1 0%, #D1FAE5 100%)",
                  border: "border-teal-200/60",
                  rotate: "rotate-1",
                  mt: "-mt-2",
                },
                {
                  title: "Každodenní vyučování",
                  desc: "Krátké úkoly na míru",
                  img: imgProcvicovani,
                  bg: "linear-gradient(135deg, #FFF1E6 0%, #FED7AA 40%, #FFEDD5 100%)",
                  border: "border-orange-200/60",
                  rotate: "-rotate-1",
                  mt: "mt-4",
                  imgClass: "h-44 w-44",
                },
              ].map((tile) => (
                <div
                  key={tile.title}
                  className={`group rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-2 hover:rotate-0 transition-all duration-500 ease-out p-6 flex flex-col justify-between min-h-[230px] cursor-default border ${tile.border} ${tile.rotate} ${tile.mt ?? ""}`}
                  style={{ background: tile.bg }}
                >
                  {/* Illustration — large, dominant */}
                  <div className="flex-1 flex items-center justify-center mb-3">
                    <DewhiteImg
                      src={tile.img}
                      alt={tile.title}
                      className={`${tile.imgClass ?? "h-36 w-36"} object-contain group-hover:scale-115 group-hover:-translate-y-1 transition-all duration-500 ease-out drop-shadow-lg`}
                      threshold={tile.threshold}
                    />
                  </div>
                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-bold leading-tight font-heading" style={{ color: C.dark }}>
                      {tile.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{tile.desc}</p>
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
                <div key={tile.title} className="rounded-2xl shadow-md p-4 flex flex-col gap-2 items-center text-center" style={{ background: tile.bg }}>
                  <DewhiteImg src={tile.img} alt={tile.title} className="h-16 w-16 object-contain drop-shadow-sm" />
                  <h3 className="text-sm font-bold font-heading" style={{ color: C.dark }}>{tile.title}</h3>
                  <p className="text-xs text-slate-500">{tile.desc}</p>
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
                <DewhiteImg src={item.img} alt={item.title} className="mx-auto h-20 w-20 object-contain drop-shadow-md" />
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: C.orange }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold font-heading" style={{ color: C.dark }}>{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
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
            { step: 1, img: imgZlomky, title: "Výběr tématu", desc: "Vyjmenovaná slova, zlomky, dělení — cokoli, co se zrovna učí ve škole.", bg: C.bgBlue },
            { step: 2, img: imgUceni, title: "Procvičování krok za krokem", desc: "Aplikace začíná lehčími úlohami a postupuje k obtížnějším. Nápověda je k dispozici, žádný stres.", bg: C.bgOrange },
            { step: 3, img: imgPrehled, title: "Přehled o úspěchu", desc: "S rodičovským účtem je vidět, co se daří a kde je co zlepšit.", bg: C.bgGreen },
          ].map((item) => (
            <div key={item.step} className="relative rounded-3xl p-6 shadow-md flex flex-col gap-3" style={{ background: item.bg }}>
              <div className="absolute top-4 right-4 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: C.orange }}>
                {item.step}
              </div>
              <DewhiteImg src={item.img} alt={item.title} className="h-14 w-14 object-contain drop-shadow-sm" />
              <h3 className="text-base font-semibold font-heading pr-8" style={{ color: C.dark }}>{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════ KAŽDODENNÍ VYUČOVÁNÍ ═══════ */}
      <Section id="den-s-olim">
        <SectionHead title="Každodenní vyučování" sub="Pár minut denně — pravidelný návyk místo nárazového učení." />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: 1, img: imgProcvic, title: "Krátké procvičování každý den", desc: "Aplikace postupně přidává obtížnost — pár minut denně místo dlouhého sezení.", bg: C.bgOrange },
            { step: 2, img: imgCilene, title: "Cílené procvičování", desc: "Při přípravě na písemku zvolíte téma a aplikace vede dítě krok za krokem.", bg: C.bgBlue },
            { step: 3, img: imgPrehled, title: "Přehled pro rodiče", desc: "Vidíte, co dítě procvičovalo, jak se mu dařilo a kde se posouvá.", bg: C.bgGreen },
          ].map((item) => (
            <div key={item.step} className="relative rounded-3xl p-6 shadow-md flex flex-col gap-3" style={{ background: item.bg }}>
              <div className="absolute top-4 right-4 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: C.orange }}>
                {item.step}
              </div>
              <DewhiteImg src={item.img} alt={item.title} className="h-14 w-14 object-contain drop-shadow-sm" />
              <h3 className="text-base font-semibold font-heading pr-8" style={{ color: C.dark }}>{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════ HLAVNÍ PŘÍNOSY ═══════ */}
      <Section id="prinosy" className="bg-[#F8FAFC]">
        <SectionHead title="Co vám Oli přinese" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard img={imgBarChart} title="Přehled o pokroku" desc="Každý den vidíte, co dítě procvičilo a jak se mu dařilo." bg={C.bgOrange} />
          <FeatureCard img={imgUceni} title="Učení po malých krocích" desc="Krátké úlohy místo dlouhých sezení." bg={C.bgBlue} />
          <FeatureCard img={imgSkola} title="Příprava na konkrétní písemku" desc="Možnost zadat téma předem." bg="#F3F0FF" />
          <FeatureCard img={imgPodpora} title="Bez stresu a známkování" desc="Žádné 1–5. Pozitivní zpětná vazba." bg={C.bgGreen} />
          <FeatureCard img={imgStarosti} title="Pravidelný návyk" desc="Pár minut denně místo nárazového učení." bg="#FEF9C3" />
          <FeatureCard img={imgProstredi} title="Bezpečné prostředí" desc="Žádné reklamy, žádné odkazy ven z aplikace." bg={C.bgOrange} />
        </div>
      </Section>

      {/* ═══════ CENY ═══════ */}
      <Section id="ceny">
        <SectionHead title="Jednoduchý ceník" sub="Vyberte si, co vám dává smysl" />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
          {/* Free */}
          <Card className="rounded-3xl border border-slate-200 shadow-md">
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Zdarma</h3><p className="text-sm text-slate-400 mt-1">Na vyzkoušení a první pokroky</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>0 Kč</span><span className="text-slate-400 text-sm">/měsíc</span></div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Anonymní vstup bez registrace", "14 dní plný přístup zdarma", "Po 14 dnech: 3 cvičení denně navždy", "Veškerý hotový obsah"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} /> {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth?mode=register")}>Začít zdarma</Button>
            </CardContent>
          </Card>

          {/* Standard */}
          <Card className="rounded-3xl shadow-2xl relative sm:-mt-4 sm:mb-4" style={{ border: `2px solid ${C.orange}` }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="text-white text-xs px-4 py-1 rounded-full" style={{ background: C.orange }}>Nejčastější volba</Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Standard</h3><p className="text-sm text-slate-400 mt-1">Pro pravidelný posun a přehled</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>249 Kč</span><span className="text-slate-400 text-sm">/měsíc</span></div>
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
              <Button className="w-full rounded-full text-white gap-2" style={{ background: C.orange }} onClick={() => navigate("/auth?mode=register")}>
                Zkusit 14 dní zdarma <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Family */}
          <Card className="rounded-3xl shadow-md relative" style={{ border: `2px solid ${C.teal}` }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="text-white text-xs px-4 py-1 rounded-full" style={{ background: C.teal }}>Pro celou rodinu</Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Rodinný</h3><p className="text-sm text-slate-400 mt-1">Pro více dětí</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>399 Kč</span><span className="text-slate-400 text-sm">/měsíc</span></div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Vše ze Standard plánu", "Až 3 děti pod jedním účtem"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} /> {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth?mode=register")}>Zkusit 14 dní zdarma</Button>
            </CardContent>
          </Card>
        </div>
        <p className="text-center text-sm text-slate-400 mt-8">14 dní zdarma · Bez zadání karty · Zrušit můžete kdykoliv</p>
      </Section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-20 sm:py-28" style={{ background: `linear-gradient(135deg, ${C.bgBlue}60, ${C.bgGreen}40)` }}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading" style={{ color: C.dark }}>
            Začněte mít přehled o učení vašeho dítěte
          </h2>
          <p className="text-lg text-slate-500">Registrace trvá minutu. Prvních 14 dní je zdarma.</p>
          <Button size="lg" className="text-base px-10 h-13 gap-2 rounded-full shadow-lg shadow-orange-200 text-white" style={{ background: C.orange }} onClick={() => navigate("/auth?mode=register")}>
            Vytvořit účet zdarma <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">© 2025 Oli. Všechna práva vyhrazena.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-700 transition-colors">Podmínky</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Ochrana soukromí</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
