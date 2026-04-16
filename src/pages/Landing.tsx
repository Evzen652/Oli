import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingNav } from "./LandingNav";
import imgPisemka from "@/assets/topic-math-scitani-a-odcitani-do-100.png";
import imgDiktat from "@/assets/topic-cz-diktat.png";
import imgZlomky from "@/assets/topic-math-porovnavani-zlomku.png";
import imgProcvicovani from "@/assets/subject-matematika.png";
// Jak to funguje
import imgRodina from "@/assets/topic-rodina-a-spolecnost.png";
import imgZdraviHygiena from "@/assets/topic-zdravi-a-hygiena.png";
import imgRocniObdobi from "@/assets/topic-rocni-obdobi-a-pocasi.png";
// Prinosy
import imgBarChart from "@/assets/cat-math-cisla-a-operace.png";
import imgUceni from "@/assets/good-to-know.png";
import imgSkola from "@/assets/cat-cz-pravopis.png";
import imgPodpora from "@/assets/topic-rostliny.png";
import imgStarosti from "@/assets/category-info.png";
import imgProstredi from "@/assets/topic-zvirata.png";
// Duvera
import imgProcvic from "@/assets/subject-prvouka.png";
import imgVysvetleni from "@/assets/help-hint.png";
import imgPrehled from "@/assets/cat-math-zlomky.png";
import imgCilene from "@/assets/subject-cestina.png";
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
        <img src={img} alt={title} className="h-14 w-14 object-contain drop-shadow-md" />
        <h3 className="text-lg font-semibold font-heading" style={{ color: C.dark }}>{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

/* ── page ── */
export default function Landing() {
  const navigate = useNavigate();

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
                <Button size="lg" className="text-base px-12 h-14 gap-2 rounded-full shadow-lg shadow-orange-200 w-full sm:w-auto" style={{ background: C.orange }} onClick={() => navigate("/auth")}>
                  Začít zdarma <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-12 h-14 rounded-full border-slate-200 text-slate-600 w-full sm:w-auto" onClick={() => document.querySelector("#jak-to-funguje")?.scrollIntoView({ behavior: "smooth" })}>
                  Podívat se, jak to funguje
                </Button>
              </div>
              <p className="text-sm text-slate-400">14 dní zdarma · Bez zadání karty</p>
            </div>

            {/* Right — 2x2 topic tiles */}
            <div className="hidden lg:grid grid-cols-2 gap-7 -mt-12">
              {[
                {
                  title: "Příprava na písemku",
                  desc: "Procvičení konkrétní látky",
                  img: imgPisemka,
                  bg: "linear-gradient(135deg, #EAF2FF 0%, #DBEAFE 100%)",
                  border: "border-blue-200/60",
                  rotate: "-rotate-1",
                },
                {
                  title: "Diktát",
                  desc: "Čeština krok za krokem",
                  img: imgDiktat,
                  bg: "linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)",
                  border: "border-purple-200/60",
                  rotate: "rotate-1",
                  mt: "mt-6",
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
                  title: "Každodenní procvičování",
                  desc: "Krátké úkoly na míru",
                  img: imgProcvicovani,
                  bg: "linear-gradient(135deg, #FFF1E6 0%, #FED7AA 40%, #FFEDD5 100%)",
                  border: "border-orange-200/60",
                  rotate: "-rotate-1",
                  mt: "mt-4",
                },
              ].map((tile) => (
                <div
                  key={tile.title}
                  className={`group rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-2 hover:rotate-0 transition-all duration-500 ease-out p-6 flex flex-col justify-between min-h-[230px] cursor-default border ${tile.border} ${tile.rotate} ${tile.mt ?? ""} backdrop-blur-sm`}
                  style={{ background: tile.bg }}
                >
                  {/* Illustration — large, dominant */}
                  <div className="flex-1 flex items-center justify-center mb-3">
                    <img
                      src={tile.img}
                      alt={tile.title}
                      className="h-28 w-28 object-contain group-hover:scale-115 group-hover:-translate-y-1 transition-all duration-500 ease-out drop-shadow-lg"
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
                { title: "Příprava na písemku", desc: "Procvičení konkrétní látky", img: imgPisemka, bg: C.bgBlue },
                { title: "Diktát", desc: "Čeština krok za krokem", img: imgDiktat, bg: "#F3E8FF" },
                { title: "Zlomky", desc: "Matematika srozumitelně", img: imgZlomky, bg: C.bgGreen },
                { title: "Každodenní procvičování", desc: "Krátké úkoly na míru", img: imgProcvicovani, bg: C.bgOrange },
              ].map((tile) => (
                <div key={tile.title} className="rounded-2xl shadow-md p-4 flex flex-col gap-2 items-center text-center" style={{ background: tile.bg }}>
                  <img src={tile.img} alt={tile.title} className="h-16 w-16 object-contain drop-shadow-sm" />
                  <h3 className="text-sm font-bold font-heading" style={{ color: C.dark }}>{tile.title}</h3>
                  <p className="text-xs text-slate-500">{tile.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PŘÍPRAVA NA PÍSEMKY ═══════ */}
      <Section id="jak-to-funguje" className="">
        <p className="text-center text-lg font-medium text-slate-500 mb-2">Jak to funguje</p>
        <SectionHead title="Příprava na písemku bez stresu" sub="Stačí vybrat téma a Oli připraví dítě krok za krokem." />
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FeatureCard img={imgZlomky} title="Vyberete téma nebo okruh" desc="Např. zlomky, vyjmenovaná slova nebo konkrétní látku ze školy." bg={C.bgBlue} />
          <FeatureCard img={imgUceni} title="Oli připraví cvičení na míru" desc="Navazuje na aktuální úroveň dítěte a postupně ho vede dál." bg="white" />
          <FeatureCard img={imgPodpora} title="Dítě získá jistotu" desc="Procvičuje přesně to, co potřebuje, v tempu, které mu vyhovuje." bg="white" />
          <FeatureCard img={imgPrehled} title="Vy vidíte výsledek" desc="Přehledně sledujete, jak se dítě připravuje a jak se mu daří." bg={C.bgGreen} />
        </div>
      </Section>

      {/* ═══════ JAK TO FUNGUJE ═══════ */}
      <Section className="bg-[#F8FAFC]">
        <SectionHead title="Jak to funguje" sub="Oli vás provede celým procesem — od prvního přihlášení až po každodenní učení." />
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { img: imgRodina, step: "1", title: "Nastavíte profil dítěte", desc: "Zadáte ročník a během chvíle je vše připraveno.", bg: C.bgBlue },
            { img: imgZdraviHygiena, step: "2", title: "Dítě se jednoduše přihlásí", desc: "Přístup pomocí krátkého kódu — bez e-mailu.", bg: C.bgOrange },
            { img: imgRocniObdobi, step: "3", title: "Každý den jasný postup", desc: "Oli sleduje pokrok a připravuje cvičení na míru.", bg: C.bgGreen },
          ].map((item) => (
            <Card key={item.step} className="rounded-3xl border-0 shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ background: item.bg }}>
              <CardContent className="p-8 space-y-4">
                <img src={item.img} alt={item.title} className="mx-auto h-20 w-20 object-contain drop-shadow-md" />
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

      {/* ═══════ DŮVĚROVÝ BLOK ═══════ */}
      <Section>
        <SectionHead title="Jak vypadá běžný den s Oli" />
        <div className="space-y-5 max-w-3xl mx-auto">
          {[
            { img: imgProcvic, title: "Krátké procvičování", desc: "Oli navazuje na to, co už dítě zvládá, a přirozeně ho posouvá dál.", bg: C.bgOrange },
            { img: imgVysvetleni, title: "Vysvětlení během učení", desc: "Každý krok dává smysl a pomáhá látku pochopit.", bg: C.bgBlue },
            { img: imgPrehled, title: "Přehled pro rodiče", desc: "Vidíte, co dítě procvičovalo, jak se mu dařilo a kde se posouvá.", bg: C.bgGreen },
            { img: imgCilene, title: "Cílené procvičování", desc: "Při přípravě na písemku zvolíte téma a Oli vede dítě krok za krokem.", bg: "white" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-5 p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow" style={{ background: item.bg }}>
              <img src={item.img} alt={item.title} className="h-14 w-14 object-contain shrink-0 drop-shadow-md" />
              <div>
                <h3 className="font-semibold text-base font-heading" style={{ color: C.dark }}>{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-xl sm:text-2xl font-semibold leading-relaxed max-w-xl mx-auto font-heading" style={{ color: C.dark }}>
            „Každý den máte jasný přehled o učení vašeho dítěte."
          </p>
        </div>
      </Section>

      {/* ═══════ HLAVNÍ PŘÍNOSY ═══════ */}
      <Section id="prinosy" className="bg-[#F8FAFC]">
        <SectionHead title="Co vám Oli přinese" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard img={imgBarChart} title="Přehled o pokroku" desc="Každý den vidíte, co dítě procvičilo a jak se mu dařilo." />
          <FeatureCard img={imgUceni} title="Učení, které dává smysl" desc="Cvičení odpovídají aktuální úrovni dítěte." bg={C.bgBlue} />
          <FeatureCard img={imgSkola} title="Cílená příprava na školu" desc="Snadno zaměříte učení na konkrétní téma nebo písemku." />
          <FeatureCard img={imgPodpora} title="Podpora bez tlaku" desc="Dítě postupuje vlastním tempem." bg={C.bgGreen} />
          <FeatureCard img={imgStarosti} title="Méně starostí pro rodiče" desc="Oli se stará o průběh učení za vás." />
          <FeatureCard img={imgProstredi} title="Soustředěné prostředí" desc="Bez reklam a rušivých prvků." bg={C.bgOrange} />
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
                {["1 dítě", "Všechny předměty", "Základní přehled", "5 AI cvičení/měsíc"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} /> {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth")}>Začít zdarma</Button>
            </CardContent>
          </Card>

          {/* Standard */}
          <Card className="rounded-3xl shadow-2xl relative sm:-mt-4 sm:mb-4" style={{ border: `2px solid ${C.orange}` }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="text-white text-xs px-4 py-1 rounded-full" style={{ background: C.orange }}>Nejčastější volba</Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Standard</h3><p className="text-sm text-slate-400 mt-1">Pro pravidelný posun a přehled</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>149 Kč</span><span className="text-slate-400 text-sm">/měsíc</span></div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Až 3 děti", "Neomezená cvičení", "Podrobné reporty", "AI hodnocení", "Příprava na písemky", "Bez reklam"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} /> {f}</li>
                ))}
              </ul>
              <Button className="w-full rounded-full text-white gap-2" style={{ background: C.orange }} onClick={() => navigate("/auth")}>
                Zkusit 14 dní zdarma <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Family */}
          <Card className="rounded-3xl border border-slate-200 shadow-md">
            <CardContent className="p-8 space-y-6">
              <div><h3 className="text-xl font-bold font-heading" style={{ color: C.dark }}>Rodinný</h3><p className="text-sm text-slate-400 mt-1">Pro více dětí</p></div>
              <div><span className="text-4xl font-bold" style={{ color: C.dark }}>249 Kč</span><span className="text-slate-400 text-sm">/měsíc</span></div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Až 5 dětí", "Vše ze Standard", "Rodinný přehled", "Export dat", "Prioritní podpora"].map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: C.teal }} /> {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth")}>Zkusit 14 dní zdarma</Button>
            </CardContent>
          </Card>
        </div>
        <p className="text-center text-sm text-slate-400 mt-8">14 dní zdarma. Bez zadání karty. Zrušit můžete kdykoliv.</p>
      </Section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-20 sm:py-28" style={{ background: `linear-gradient(135deg, ${C.bgBlue}60, ${C.bgGreen}40)` }}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-heading" style={{ color: C.dark }}>
            Začněte mít přehled o učení vašeho dítěte
          </h2>
          <p className="text-lg text-slate-500">Registrace trvá minutu. Prvních 14 dní je zdarma.</p>
          <Button size="lg" className="text-base px-10 h-13 gap-2 rounded-full shadow-lg shadow-orange-200 text-white" style={{ background: C.orange }} onClick={() => navigate("/auth")}>
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
