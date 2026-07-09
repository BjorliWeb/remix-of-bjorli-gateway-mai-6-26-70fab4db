import { useMemo, useState, useEffect } from 'react';
import { Globe, Mail, MapPin, Clock } from 'lucide-react';
import type { CmsEvent } from '@/lib/cms';

const COPY = {
  no: {
    heading: 'Om arrangøren',
    website: 'Besøk nettsted',
    email: 'Kontakt arrangør',
    location: 'Sted',
    time: 'Tidspunkt',
  },
  en: {
    heading: 'About the organiser',
    website: 'Visit website',
    email: 'Contact organiser',
    location: 'Location',
    time: 'Time',
  },
} as const;

type Lang = keyof typeof COPY;

interface Props {
  event: Pick<
    CmsEvent,
    'organizer' | 'website' | 'contactEmail' | 'location' | 'timeText' | 'mapsUrl' | 'language'
  >;
}

/**
 * Renders an organiser block on the public event detail page.
 *
 * - `website` always shown when present (opened in a new tab).
 * - `contactEmail` shown ONLY when the edge function included it in the
 *   response (i.e. the submitter opted in via show_email_public). We do
 *   NOT trust a client-side flag here — the presence of `contactEmail`
 *   in the props IS the server-side decision.
 * - Light client-side obfuscation of the mailto: to reduce naive scraping.
 */
const EventOrganizerBlock = ({ event }: Props) => {
  const lang: Lang = event.language === 'en' ? 'en' : 'no';
  const c = COPY[lang];

  // Client-side email assembly — avoids putting the address in the
  // initial HTML text. Bots that execute JS can still read it; the goal
  // is only to defeat naive scrapers, which the submitter has opted into.
  const [mailto, setMailto] = useState<string | null>(null);
  const [emailText, setEmailText] = useState<string | null>(null);
  useEffect(() => {
    if (event.contactEmail && event.contactEmail.includes('@')) {
      const [local, domain] = event.contactEmail.split('@');
      setMailto(`mailto:${local}@${domain}`);
      setEmailText(`${local}@${domain}`);
    } else {
      setMailto(null);
      setEmailText(null);
    }
  }, [event.contactEmail]);

  const hasAny = useMemo(
    () => Boolean(event.organizer || event.website || event.contactEmail || event.location || event.timeText),
    [event],
  );
  if (!hasAny) return null;

  return (
    <aside className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">
        {c.heading}
        {event.organizer && (
          <span className="block text-base font-normal text-muted-foreground mt-1">
            {event.organizer}
          </span>
        )}
      </h2>

      <dl className="grid gap-3 text-sm">
        {event.location && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <dt className="text-muted-foreground">{c.location}</dt>
              <dd className="text-foreground">
                {event.mapsUrl ? (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline hover:text-secondary"
                  >
                    {event.location}
                  </a>
                ) : (
                  event.location
                )}
              </dd>
            </div>
          </div>
        )}

        {event.timeText && (
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <dt className="text-muted-foreground">{c.time}</dt>
              <dd className="text-foreground">{event.timeText}</dd>
            </div>
          </div>
        )}
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        {event.website && (
          <a
            href={event.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-foreground/40 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {c.website}
          </a>
        )}
        {mailto && emailText && (
          <a
            href={mailto}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/90 transition-colors"
            aria-label={`${c.email}: ${emailText}`}
          >
            <Mail className="h-4 w-4" />
            {c.email}
          </a>
        )}
      </div>
    </aside>
  );
};

export default EventOrganizerBlock;