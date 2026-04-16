import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LocaleProvider, useT } from "@/lib/i18n";
import cs from "@/lib/i18n/cs";
import { useUserRole, type AppRole } from "@/hooks/useUserRole";
import { useProfile } from "@/hooks/useProfile";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ChildAuth from "./pages/ChildAuth";
import Report from "./pages/Report";
import ParentOnboarding from "./pages/ParentOnboarding";
import ParentDashboard from "./pages/ParentDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import SessionHistory from "./pages/SessionHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategories from "./pages/AdminCategories";
import AdminTopics from "./pages/AdminTopics";
import AdminSkills from "./pages/AdminSkills";
import Demo from "./pages/Demo";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

function AuthenticatedRoutes() {
  const { role, loading: roleLoading } = useUserRole();
  const { profile, loading: profileLoading } = useProfile();

  const t = useT();

  if (roleLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  // Parent with no display name → onboarding
  if (role === "parent" && !profile?.display_name) {
    return (
      <Routes>
        <Route path="/onboarding" element={<ParentOnboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Admin → admin panel
  if (role === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/onboarding" element={<ParentOnboarding />} />
        <Route path="/report" element={<Report />} />
        <Route path="/session-history/:childId" element={<SessionHistory />} />
        <Route path="/student" element={<Index />} />
        <Route path="/auth" element={<Navigate to="/admin" replace />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Parent → dashboard
  if (role === "parent") {
    return (
      <Routes>
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/onboarding" element={<ParentOnboarding />} />
        <Route path="/report" element={<Report />} />
        <Route path="/session-history/:childId" element={<SessionHistory />} />
        <Route path="/auth" element={<Navigate to="/parent" replace />} />
        <Route path="/" element={<Navigate to="/parent" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Child or no role (backward compat) → practice
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/report" element={<Report />} />
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Safety timeout — if Supabase doesn't respond in 3s, show unauthenticated UI
    const timeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn("Supabase auth timeout — showing landing page");
        return false;
      });
    }, 3000);

    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{cs.loading}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LocaleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {session ? (
                <AuthenticatedRoutes />
              ) : (
                <Routes>
                   <Route path="/" element={<Landing />} />
                   <Route path="/demo" element={<Demo />} />
                   <Route path="/auth" element={<Auth />} />
                   <Route path="/auth/child" element={<ChildAuth />} />
                   <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                   <Route path="/reset-password" element={<ResetPassword />} />
                   <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              )}
            </BrowserRouter>
          </LocaleProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
