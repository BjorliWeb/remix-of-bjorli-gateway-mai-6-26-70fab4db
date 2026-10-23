/** Homepage practical shortcuts. Node-safe: shared by React and prerender. */
export type PracticalShortcutKey = 'hours' | 'conditions' | 'weather' | 'map';

export const PRACTICAL_SHORTCUTS: { key: PracticalShortcutKey; href: string; labels: Record<string, string> }[] = [
  { key: 'hours', href: '/apningstider', labels: { no: 'Åpningstider', en: 'Opening hours', de: 'Öffnungszeiten', nl: 'Openingstijden', da: 'Åbningstider', sv: 'Öppettider' } },
  { key: 'conditions', href: '/live', labels: { no: 'Føre og heiser', en: 'Snow and lifts', de: 'Schnee und Lifte', nl: 'Sneeuw en liften', da: 'Føre og lifte', sv: 'Före och liftar' } },
  { key: 'weather', href: '/vaer-og-webkamera', labels: { no: 'Vær og webkamera', en: 'Weather and webcams', de: 'Wetter und Webcams', nl: 'Weer en webcams', da: 'Vejr og webkamera', sv: 'Väder och webbkamera' } },
  { key: 'map', href: '/loypekart', labels: { no: 'Løypekart', en: 'Trail map', de: 'Pistenplan', nl: 'Pistekaart', da: 'Løypekort', sv: 'Pistkarta' } },
];

export const PRACTICAL_SHORTCUTS_LABEL: Record<string, string> = {
  no: 'Praktisk informasjon', en: 'Practical information', de: 'Praktische Informationen',
  nl: 'Praktische informatie', da: 'Praktisk information', sv: 'Praktisk information',
};

