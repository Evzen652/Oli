import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DewhiteImg } from "@/components/DewhiteImg";
import { LandingNav } from "./LandingNav";
import { Loader2 } from "lucide-react";

const DEMO_PARENT_EMAIL = "demo@oli.app";
const DEMO_CHILD_EMAIL  = "demo-child@oli.app";
const DEMO_PASSWORD     = "Demo123demo";

export default function Demo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleParentDemo() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: DEMO_PARENT_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (error) {
      toast.error("Demo není momentálně dostupné. Zkuste to za chvíli.");
      setLoading(false);
    } else {
      window.location.href = "/parent";
    }
  }

  async function handleChildDemo() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: DEMO_CHILD_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (error) {
      toast.error("Demo není momentálně dostupné. Zkuste to za chvíli.");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#F97316] text-white px-4 py-2 text-sm text-center font-medium">
        Demo — prohlídka bez registrace
      </div>
      <LandingNav />

      <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-bold text-3xl text-foreground">Vyzkoušejte Oli</h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Projděte si Oli očima rodiče nebo žáka. Žádná registrace, žádné omezení.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Rodičovský pohled */}
          <button
            onClick={handleParentDemo}
            disabled={loading}
            className="group relative rounded-3xl border-2 border-blue-200 bg-blue-50/60 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg p-8 text-center space-y-4 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait flex flex-col items-center"
          >
            <DewhiteImg
              src="https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/topic-rodina-a-spolecnost.png"
              alt=""
              className="h-24 w-24 object-contain drop-shadow-md"
              threshold={240}
            />
            <div>
              <p className="font-bold text-xl text-blue-900">Jsem rodič</p>
              <p className="text-sm text-blue-700 mt-1 leading-snug">
                Zadávejte úkoly, sledujte pokrok a výsledky, odhalte slabá místa — vše přehledně na jednom místě.
              </p>
            </div>
            {loading
              ? <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
              : <span className="text-blue-400 text-lg group-hover:translate-x-1 transition-transform inline-block">→</span>
            }
          </button>

          {/* Žákovský pohled */}
          <button
            onClick={handleChildDemo}
            disabled={loading}
            className="group rounded-3xl border-2 border-orange-200 bg-orange-50/60 hover:border-orange-400 hover:bg-orange-50 hover:shadow-lg p-8 text-center space-y-4 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait flex flex-col items-center"
          >
            <DewhiteImg
              src="https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/ui-child-desk.png"
              alt=""
              className="h-24 w-24 object-contain drop-shadow-md"
              threshold={240}
            />
            <div>
              <p className="font-bold text-xl text-orange-900">Jsem žák</p>
              <p className="text-sm text-orange-700 mt-1 leading-snug">
                Procvičuj libovolné téma — Oli připraví úlohy přesně na míru, poradí a okamžitě ohodnotí.
              </p>
            </div>
            {loading
              ? <Loader2 className="h-5 w-5 text-orange-400 animate-spin" />
              : <span className="text-orange-400 text-lg group-hover:translate-x-1 transition-transform inline-block">→</span>
            }
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Oba pohledy se přihlásí jako demo účet s předpřipravenou historií.
          Výsledky z demo relace se neukládají natrvalo.
        </p>
      </div>
    </div>
  );
}
