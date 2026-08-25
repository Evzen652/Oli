import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from "@/components/BackButton";
import { useT } from "@/lib/i18n";

const NotFound = () => {
  const location = useLocation();
  const t = useT();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center space-y-4">
        <h1 className="text-h1 text-foreground">{t("not_found.title")}</h1>
        <p className="text-xl text-muted-foreground">{t("not_found.message")}</p>
        {/* „Zpět" je pro člověka, který sem spadl z odkazu, užitečnější než
            skok na domovskou stránku — vrátí ho tam, odkud přišel. */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <BackButton />
          <Link to="/" className="text-primary underline hover:text-primary/90">
            {t("not_found.back")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
