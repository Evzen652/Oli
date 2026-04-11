import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OlyLogo } from "@/components/OlyLogo";
import { DemoChildTab } from "@/components/demo/DemoChildTab";
import { DemoParentTab } from "@/components/demo/DemoParentTab";
import { DemoAdminTab } from "@/components/demo/DemoAdminTab";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Settings } from "lucide-react";

export default function Demo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between text-sm shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-medium">Demo režim — vyzkoušej si Oly bez registrace</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="h-7 text-xs"
          onClick={() => navigate("/auth")}
        >
          Registrovat se →
        </Button>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <OlyLogo size="sm" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Oly — interaktivní procvičování</h1>
            <p className="text-sm text-muted-foreground">Adaptivní tutor pro žáky 3.–9. třídy</p>
          </div>
        </div>

        <Tabs defaultValue="child" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="child" className="gap-2 text-sm">
              <GraduationCap className="h-4 w-4" />
              Žák
            </TabsTrigger>
            <TabsTrigger value="parent" className="gap-2 text-sm">
              <Users className="h-4 w-4" />
              Rodič
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="child">
            <DemoChildTab />
          </TabsContent>
          <TabsContent value="parent">
            <DemoParentTab />
          </TabsContent>
          <TabsContent value="admin">
            <DemoAdminTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
