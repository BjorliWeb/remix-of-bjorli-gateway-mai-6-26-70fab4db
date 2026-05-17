import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLocalizedPath } from "@/i18n/useLocalizedPath";

const NOT_FOUND_COPY: Record<string, { title: string; message: string; cta: string }> = {
  no: { title: '404', message: 'Beklager! Siden finnes ikke', cta: 'Tilbake til forsiden' },
  en: { title: '404', message: 'Oops! Page not found', cta: 'Return to home' },
  de: { title: '404', message: 'Hoppla! Seite nicht gefunden', cta: 'Zurück zur Startseite' },
  nl: { title: '404', message: 'Oeps! Pagina niet gevonden', cta: 'Terug naar de startpagina' },
  da: { title: '404', message: 'Ups! Siden blev ikke fundet', cta: 'Tilbage til forsiden' },
  sv: { title: '404', message: 'Hoppsan! Sidan hittades inte', cta: 'Tillbaka till startsidan' },
};

const NotFound = () => {
  const location = useLocation();
  const { locale } = useLanguage();
  const lp = useLocalizedPath();
  const copy = NOT_FOUND_COPY[locale] ?? NOT_FOUND_COPY.en;

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{copy.title}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{copy.message}</p>
        <Link to={lp('/')} className="text-primary underline hover:text-primary/90">
          {copy.cta}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
