import { useEffect } from 'react';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Locale } from '@/i18n/locales/types';

/**
 * Privacy page. The Norwegian version is the authoritative legal text.
 * Translations are provided for information only and carry the discrepancy
 * disclaimer required by the editor.
 */

type Section = { h?: string; p: string[]; subsections?: { h: string; p: string[] }[] };
type Copy = {
  pageTitle: string;
  pageDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  disclaimer: string | null;
  intro: string[];
  sections: Section[];
  questionsHeading: string;
  questionsBefore: string;
  questionsAfter: string;
};

const EMAIL = 'skisenter@bjorli.no';

const NO: Copy = {
  pageTitle: 'Personvern | Bjorli',
  pageDescription:
    'Les hvordan Bjorli Skisenter AS behandler personopplysninger, informasjonskapsler og henvendelser via bjorli.no.',
  heroTitle: 'Personvern',
  heroSubtitle: 'Slik behandler Bjorli Skisenter AS dine personopplysninger.',
  disclaimer: null,
  intro: [
    'Ditt personvern er viktig for Bjorli Skisenter AS, og vi tar vårt ansvar for sikkerheten til dine personopplysninger svært alvorlig. Vi påtar oss å beskytte dine personopplysninger og praktisere åpenhet om de opplysningene vi innhenter om deg og hva vi gjør med dem.',
    'For å gjenspeile de nyeste endringene i personvernlovgivningen, og vårt engasjement for åpenhet, har vi oppdatert personvernpolicyen vår.',
    'Bjorli Skisenter AS («vi») respekterer ditt personvern og behandler personopplysninger som behandlingsansvarlig i samsvar med personopplysningsloven. Disse vilkårene gir deg informasjon om hvordan vi behandler opplysninger om deg.',
  ],
  sections: [
    {
      h: 'Hvilke opplysninger vi behandler og hvordan vi bruker dem',
      p: [
        'Vi behandler besøksopplysninger. Dette er opplysninger som serveren genererer automatisk når noen besøker vårt nettsted. Dette omfatter typisk hvilke sider som er lastet ned, tidspunkt, hvilken side du kom fra, IP-adresse, type enhet, for eksempel iPhone, type nettleser og operativsystem.',
        'Besøksopplysninger brukes anonymisert for å drifte og videreutvikle nettsidene.',
        'Dersom du fyller inn informasjon i registreringsskjemaer, vil vi også behandle de opplysningene som du fyller inn i registreringsskjemaene. Disse opplysningene brukes til å administrere tjenestene. Din e-postadresse kan brukes til å sende deg reklame dersom du har samtykket til dette, eller det for øvrig er tillatt etter norsk lov.',
        'Vi behandler i tillegg dine henvendelser og tilbakemeldinger dersom du frivillig henvender deg til oss, eller gir tilbakemelding om våre nettsider.',
      ],
    },
    { h: 'Utlevering til tredjeparter', p: ['Dersom det ikke er gitt samtykke til annet, utleverer vi ikke dine opplysninger til noen tredjepart.'] },
    {
      h: 'Hvordan oppbevarer vi opplysningene?',
      p: [
        'Vi har implementert tekniske, fysiske og organisatoriske tiltak for å hindre at personlig data går tapt eller at uvedkommende får tilgang til data. Herunder oppbevarer vi opplysningene kryptert der det er nødvendig.',
        'Besøksopplysninger slettes eller anonymiseres løpende. Øvrige opplysninger vi mottar fra deg slettes når vi ikke lenger har behov for å oppbevare dem.',
      ],
    },
    { h: 'Lenker', p: ['Bjorli.no inneholder lenker til nettsider som eies og drives av andre. Disse personvernvilkårene gjelder kun bjorli.no, og vi har ikke ansvar for hvordan dine personopplysninger behandles på eksterne sider.'] },
    { h: 'Endringer', p: ['Vi vil publisere endringer i personvernerklæringen på nettsiden. Din fortsatte bruk av nettsiden betyr at du godtar de endrede personvernvilkårene. Brukere av nettsiden bør sjekke personvernerklæringen regelmessig.'] },
    {
      h: 'Brukeranmeldelser fra tredjepart',
      p: [
        'Bjorli.no kan, ved avtale med TripAdvisor, Google, Facebook eller lignende, samle og synliggjøre anmeldelser fra brukere som har publisert informasjon på relevante destinasjoner og produkter på TripAdvisor, Google, Facebook eller lignende.',
        'Man har frasagt seg alle rettigheter man måtte ha når man skriver disse brukeranmeldelsene. Dine bidrag kan fritt brukes, kopieres, distribueres og publiseres i alle medier og på alle måter uten din tillatelse.',
        'Vi redigerer ikke brukeranmeldelser publisert på TripAdvisor, Google, Facebook eller lignende, og kan ikke holdes ansvarlige for disse anmeldelsene eller annen bruk, distribusjon eller republisering av disse.',
        'Bjorli.no verken bekrefter eller avkrefter meninger eller holdninger uttrykt i brukeranmeldelser. Alle beslutninger tatt med grunnlag i anmeldelser eller kommentarer på Bjorli.no gjøres for egen regning.',
      ],
    },
    {
      h: 'Cookies',
      p: [
        'Vi bruker cookies, også kalt informasjonskapsler. Dette er datapakker som lagres på din enhet. Våre cookies brukes for å tilpasse nettsidene til din bruk og dine innstillinger, samt til å gjennomføre anonymiserte undersøkelser om brukeratferd på nettsidene og registrere antall besøkende.',
        'Cookies kan også brukes til brukerrettet markedsføring i samsvar med gjeldende lovgivning.',
        'Vi bruker følgende cookies:',
      ],
      subsections: [
        { h: 'Sesjonsavhengige cookies', p: ['Sesjonsavhengige cookies brukes for å registrere at en bruker er inne på sidene våre, og hvilke valg brukeren gjør.'] },
        { h: 'Faste informasjonskapsler', p: ['Faste informasjonskapsler bruker vi for at du skal slippe å endre noen faste innstillinger hver gang du besøker vårt nettsted, for eksempel språk. De fleste faste informasjonskapsler har en utløpsdato og vil slettes automatisk etter en gitt periode.'] },
        { h: 'Tredjeparts cookies', p: ['Tredjeparts cookies bruker vi for å innhente generell statistikk om besøk på våre nettsider, for eksempel Google Analytics.', 'Du kan i din nettleser velge å avvise cookies. Gjennom en funksjon i din nettleser velger du også om og når du vil slette cookies.'] },
      ],
    },
  ],
  questionsHeading: 'Spørsmål eller kommentarer',
  questionsBefore: 'Dersom du har spørsmål eller kommentarer til hvordan vi behandler personopplysninger, kan du kontakte oss på ',
  questionsAfter: '.',
};

const EN: Copy = {
  pageTitle: 'Privacy | Bjorli',
  pageDescription:
    'How Bjorli Skisenter AS processes personal data, cookies and enquiries on bjorli.no.',
  heroTitle: 'Privacy',
  heroSubtitle: 'How Bjorli Skisenter AS processes your personal data.',
  disclaimer: 'This translation is provided for information. In case of discrepancy, the Norwegian version applies.',
  intro: [
    'Your privacy is important to Bjorli Skisenter AS, and we take our responsibility for the security of your personal data very seriously. We commit to protecting your personal data and to being transparent about the data we collect about you and what we do with it.',
    'To reflect the latest changes in data protection legislation, and our commitment to transparency, we have updated our privacy policy.',
    'Bjorli Skisenter AS (“we”) respects your privacy and processes personal data as data controller in accordance with the Norwegian Personal Data Act. These terms inform you of how we process information about you.',
  ],
  sections: [
    {
      h: 'What information we process and how we use it',
      p: [
        'We process visitor information. This is information the server generates automatically when someone visits our website. It typically includes which pages were loaded, when, which page you came from, IP address, device type (for example iPhone), browser type and operating system.',
        'Visitor information is used in anonymised form to operate and further develop the website.',
        'If you fill in information in registration forms, we will also process the information you enter. This information is used to administer the services. Your email address may be used to send you marketing where you have consented, or where otherwise permitted under Norwegian law.',
        'We also process your enquiries and feedback if you voluntarily contact us or give feedback about our website.',
      ],
    },
    { h: 'Disclosure to third parties', p: ['Unless consent has been given to the contrary, we do not disclose your information to any third party.'] },
    {
      h: 'How do we store the information?',
      p: [
        'We have implemented technical, physical and organisational measures to prevent personal data from being lost or accessed by unauthorised persons, including storing data encrypted where necessary.',
        'Visitor information is deleted or anonymised on a continuous basis. Other information we receive from you is deleted when we no longer need to retain it.',
      ],
    },
    { h: 'Links', p: ['Bjorli.no contains links to websites owned and operated by others. These privacy terms apply only to bjorli.no, and we are not responsible for how your personal data is processed on external sites.'] },
    { h: 'Changes', p: ['We will publish changes to the privacy statement on the website. Your continued use of the website means you accept the amended privacy terms. Users of the website should check the privacy statement regularly.'] },
    {
      h: 'User reviews from third parties',
      p: [
        'Bjorli.no may, by agreement with TripAdvisor, Google, Facebook or similar, collect and display reviews from users who have published information about relevant destinations and products on TripAdvisor, Google, Facebook or similar.',
        'You waive any rights you may have when you write such user reviews. Your contributions may be freely used, copied, distributed and published in any media and in any way without your permission.',
        'We do not edit user reviews published on TripAdvisor, Google, Facebook or similar, and cannot be held responsible for these reviews or for any other use, distribution or republication.',
        'Bjorli.no neither confirms nor denies opinions or views expressed in user reviews. Any decisions taken on the basis of reviews or comments on Bjorli.no are taken at your own risk.',
      ],
    },
    {
      h: 'Cookies',
      p: [
        'We use cookies. These are small data files stored on your device. Our cookies are used to adapt the website to your usage and settings, and to carry out anonymised research on user behaviour and to record the number of visitors.',
        'Cookies may also be used for targeted marketing in accordance with applicable legislation.',
        'We use the following cookies:',
      ],
      subsections: [
        { h: 'Session cookies', p: ['Session cookies are used to register that a user is on our pages and the choices the user makes.'] },
        { h: 'Persistent cookies', p: ['We use persistent cookies so that you do not have to change certain fixed settings every time you visit our website, for example language. Most persistent cookies have an expiry date and will be deleted automatically after a set period.'] },
        { h: 'Third-party cookies', p: ['We use third-party cookies to obtain general statistics about visits to our website, for example Google Analytics.', 'You can choose to refuse cookies in your browser. Your browser also lets you choose if and when to delete cookies.'] },
      ],
    },
  ],
  questionsHeading: 'Questions or comments',
  questionsBefore: 'If you have questions or comments about how we process personal data, please contact us at ',
  questionsAfter: '.',
};

const DE: Copy = {
  pageTitle: 'Datenschutz | Bjorli',
  pageDescription:
    'Wie die Bjorli Skisenter AS personenbezogene Daten, Cookies und Anfragen über bjorli.no verarbeitet.',
  heroTitle: 'Datenschutz',
  heroSubtitle: 'So verarbeitet die Bjorli Skisenter AS Ihre personenbezogenen Daten.',
  disclaimer: 'Diese Übersetzung dient nur zur Information. Bei Abweichungen gilt die norwegische Fassung.',
  intro: [
    'Ihre Privatsphäre ist der Bjorli Skisenter AS wichtig, und wir nehmen unsere Verantwortung für die Sicherheit Ihrer personenbezogenen Daten sehr ernst. Wir verpflichten uns, Ihre Daten zu schützen und transparent darüber zu informieren, welche Daten wir erheben und wofür wir sie verwenden.',
    'Um die jüngsten Änderungen im Datenschutzrecht und unser Engagement für Transparenz widerzuspiegeln, haben wir unsere Datenschutzerklärung aktualisiert.',
    'Die Bjorli Skisenter AS („wir“) respektiert Ihre Privatsphäre und verarbeitet personenbezogene Daten als Verantwortlicher gemäß dem norwegischen Personopplysningsloven. Diese Bedingungen informieren Sie darüber, wie wir Daten über Sie verarbeiten.',
  ],
  sections: [
    {
      h: 'Welche Daten wir verarbeiten und wie wir sie verwenden',
      p: [
        'Wir verarbeiten Besuchsdaten. Das sind Daten, die der Server automatisch generiert, wenn jemand unsere Website besucht. Dazu gehören in der Regel die geladenen Seiten, Zeitpunkt, die Herkunftsseite, IP-Adresse, Gerätetyp (z. B. iPhone), Browsertyp und Betriebssystem.',
        'Besuchsdaten werden anonymisiert verwendet, um die Website zu betreiben und weiterzuentwickeln.',
        'Wenn Sie Daten in Registrierungsformulare eingeben, verarbeiten wir auch diese Angaben. Sie dienen der Verwaltung der Dienste. Ihre E-Mail-Adresse kann für Werbung verwendet werden, wenn Sie eingewilligt haben oder dies nach norwegischem Recht zulässig ist.',
        'Wir verarbeiten zudem Ihre Anfragen und Rückmeldungen, wenn Sie sich freiwillig an uns wenden oder Feedback zur Website geben.',
      ],
    },
    { h: 'Weitergabe an Dritte', p: ['Sofern keine andere Einwilligung vorliegt, geben wir Ihre Daten nicht an Dritte weiter.'] },
    {
      h: 'Wie speichern wir die Daten?',
      p: [
        'Wir haben technische, physische und organisatorische Maßnahmen umgesetzt, um zu verhindern, dass personenbezogene Daten verloren gehen oder Unbefugte darauf zugreifen, einschließlich verschlüsselter Speicherung, wo erforderlich.',
        'Besuchsdaten werden laufend gelöscht oder anonymisiert. Weitere von Ihnen erhaltene Daten werden gelöscht, sobald wir sie nicht mehr aufbewahren müssen.',
      ],
    },
    { h: 'Links', p: ['Bjorli.no enthält Links zu Websites Dritter. Diese Datenschutzbedingungen gelten nur für bjorli.no; wir übernehmen keine Verantwortung dafür, wie Ihre Daten auf externen Seiten verarbeitet werden.'] },
    { h: 'Änderungen', p: ['Änderungen der Datenschutzerklärung veröffentlichen wir auf der Website. Mit der weiteren Nutzung der Website akzeptieren Sie die geänderten Bedingungen. Nutzer sollten die Datenschutzerklärung regelmäßig prüfen.'] },
    {
      h: 'Nutzerbewertungen Dritter',
      p: [
        'Bjorli.no kann auf Grundlage einer Vereinbarung mit TripAdvisor, Google, Facebook oder ähnlichen Anbietern Bewertungen erfassen und anzeigen, die Nutzer dort zu relevanten Destinationen und Produkten veröffentlicht haben.',
        'Mit dem Verfassen solcher Bewertungen verzichten Sie auf alle daran bestehenden Rechte. Ihre Beiträge dürfen ohne Ihre Zustimmung frei genutzt, kopiert, verbreitet und in allen Medien veröffentlicht werden.',
        'Wir bearbeiten Nutzerbewertungen auf TripAdvisor, Google, Facebook oder ähnlichen Plattformen nicht und übernehmen keine Verantwortung für deren Inhalt oder Weiterverwendung.',
        'Bjorli.no bestätigt oder dementiert keine in Nutzerbewertungen geäußerten Meinungen. Entscheidungen auf Grundlage solcher Bewertungen treffen Sie auf eigene Verantwortung.',
      ],
    },
    {
      h: 'Cookies',
      p: [
        'Wir verwenden Cookies. Das sind kleine Datenpakete, die auf Ihrem Gerät gespeichert werden. Unsere Cookies dienen dazu, die Website an Ihre Nutzung und Einstellungen anzupassen sowie anonymisierte Auswertungen des Nutzerverhaltens und der Besuchszahlen durchzuführen.',
        'Cookies können zudem für zielgerichtetes Marketing im Rahmen der geltenden Gesetze eingesetzt werden.',
        'Wir verwenden folgende Cookies:',
      ],
      subsections: [
        { h: 'Sitzungscookies', p: ['Sitzungscookies registrieren, dass ein Nutzer auf unseren Seiten ist und welche Auswahl getroffen wird.'] },
        { h: 'Dauerhafte Cookies', p: ['Dauerhafte Cookies verwenden wir, damit Sie bestimmte Einstellungen — z. B. die Sprache — nicht bei jedem Besuch neu setzen müssen. Die meisten dauerhaften Cookies haben ein Ablaufdatum und werden danach automatisch gelöscht.'] },
        { h: 'Cookies von Drittanbietern', p: ['Cookies von Drittanbietern nutzen wir, um allgemeine Besuchsstatistiken zu erheben, etwa über Google Analytics.', 'Sie können Cookies in Ihrem Browser ablehnen. Ihr Browser bietet zudem eine Funktion, mit der Sie auswählen können, ob und wann Cookies gelöscht werden.'] },
      ],
    },
  ],
  questionsHeading: 'Fragen oder Anmerkungen',
  questionsBefore: 'Bei Fragen oder Anmerkungen zur Verarbeitung personenbezogener Daten erreichen Sie uns unter ',
  questionsAfter: '.',
};

const NL: Copy = {
  pageTitle: 'Privacy | Bjorli',
  pageDescription:
    'Hoe Bjorli Skisenter AS persoonsgegevens, cookies en aanvragen via bjorli.no verwerkt.',
  heroTitle: 'Privacy',
  heroSubtitle: 'Zo gaat Bjorli Skisenter AS om met je persoonsgegevens.',
  disclaimer: 'Deze vertaling is uitsluitend ter informatie. Bij afwijkingen geldt de Noorse versie.',
  intro: [
    'Je privacy is belangrijk voor Bjorli Skisenter AS, en we nemen onze verantwoordelijkheid voor de veiligheid van je persoonsgegevens zeer serieus. We verplichten ons om je gegevens te beschermen en transparant te zijn over de informatie die we over je verzamelen en wat we ermee doen.',
    'Om de meest recente wijzigingen in de privacywetgeving en ons streven naar transparantie te weerspiegelen, hebben we ons privacybeleid bijgewerkt.',
    'Bjorli Skisenter AS (“wij”) respecteert je privacy en verwerkt persoonsgegevens als verwerkingsverantwoordelijke in overeenstemming met de Noorse personvernlovgivning. Deze voorwaarden informeren je over hoe wij gegevens over jou verwerken.',
  ],
  sections: [
    {
      h: 'Welke gegevens we verwerken en hoe we ze gebruiken',
      p: [
        'We verwerken bezoekgegevens. Dit zijn gegevens die de server automatisch genereert wanneer iemand onze website bezoekt. Het gaat doorgaans om welke pagina’s zijn geladen, het tijdstip, de pagina waarvandaan je komt, IP-adres, apparaattype (bijvoorbeeld iPhone), browsertype en besturingssysteem.',
        'Bezoekgegevens worden geanonimiseerd gebruikt om de website te beheren en verder te ontwikkelen.',
        'Als je informatie invult in registratieformulieren, verwerken we ook die gegevens. Ze worden gebruikt om de diensten te beheren. Je e-mailadres kan worden gebruikt voor reclame als je daarvoor toestemming hebt gegeven, of als dit anderszins is toegestaan onder Noors recht.',
        'We verwerken ook je aanvragen en feedback als je vrijwillig contact met ons opneemt of feedback geeft over onze website.',
      ],
    },
    { h: 'Verstrekking aan derden', p: ['Tenzij je daar toestemming voor hebt gegeven, verstrekken we je gegevens niet aan derden.'] },
    {
      h: 'Hoe bewaren we de gegevens?',
      p: [
        'We hebben technische, fysieke en organisatorische maatregelen genomen om te voorkomen dat persoonsgegevens verloren gaan of dat onbevoegden toegang krijgen, waaronder versleutelde opslag waar nodig.',
        'Bezoekgegevens worden doorlopend verwijderd of geanonimiseerd. Overige gegevens die we van je ontvangen, worden verwijderd zodra we ze niet langer hoeven te bewaren.',
      ],
    },
    { h: 'Links', p: ['Bjorli.no bevat links naar websites van derden. Deze privacyvoorwaarden gelden alleen voor bjorli.no; wij zijn niet verantwoordelijk voor de manier waarop je gegevens op externe sites worden verwerkt.'] },
    { h: 'Wijzigingen', p: ['Wijzigingen in de privacyverklaring publiceren we op de website. Door de website te blijven gebruiken, accepteer je de gewijzigde voorwaarden. Gebruikers wordt aangeraden de privacyverklaring regelmatig te raadplegen.'] },
    {
      h: 'Gebruikersbeoordelingen van derden',
      p: [
        'Bjorli.no kan, op basis van een overeenkomst met TripAdvisor, Google, Facebook of vergelijkbare partijen, beoordelingen verzamelen en tonen die gebruikers daar over relevante bestemmingen en producten hebben gepubliceerd.',
        'Door dergelijke beoordelingen te schrijven, doe je afstand van alle eventuele rechten daarop. Je bijdragen mogen vrij worden gebruikt, gekopieerd, verspreid en gepubliceerd in alle media en op alle manieren zonder jouw toestemming.',
        'We bewerken gebruikersbeoordelingen op TripAdvisor, Google, Facebook of vergelijkbare platforms niet en zijn niet verantwoordelijk voor deze beoordelingen of voor ander gebruik, verspreiding of herpublicatie.',
        'Bjorli.no bevestigt noch ontkent meningen in gebruikersbeoordelingen. Beslissingen op basis van beoordelingen of opmerkingen op Bjorli.no neem je op eigen verantwoordelijkheid.',
      ],
    },
    {
      h: 'Cookies',
      p: [
        'We gebruiken cookies. Dit zijn kleine gegevenspakketten die op je apparaat worden opgeslagen. Onze cookies worden gebruikt om de website af te stemmen op je gebruik en instellingen en om geanonimiseerd onderzoek naar gebruikersgedrag en bezoekersaantallen te doen.',
        'Cookies kunnen ook worden gebruikt voor gerichte marketing in overeenstemming met de geldende wetgeving.',
        'We gebruiken de volgende cookies:',
      ],
      subsections: [
        { h: 'Sessiecookies', p: ['Sessiecookies registreren dat een gebruiker op onze pagina’s is en welke keuzes de gebruiker maakt.'] },
        { h: 'Permanente cookies', p: ['Permanente cookies gebruiken we zodat je bepaalde vaste instellingen, zoals taal, niet bij elk bezoek opnieuw hoeft in te stellen. De meeste permanente cookies hebben een vervaldatum en worden daarna automatisch verwijderd.'] },
        { h: 'Cookies van derden', p: ['Cookies van derden gebruiken we om algemene bezoekersstatistieken te verzamelen, bijvoorbeeld via Google Analytics.', 'In je browser kun je cookies weigeren. Ook kun je via je browser bepalen of en wanneer je cookies wilt verwijderen.'] },
      ],
    },
  ],
  questionsHeading: 'Vragen of opmerkingen',
  questionsBefore: 'Als je vragen of opmerkingen hebt over hoe we persoonsgegevens verwerken, kun je contact met ons opnemen via ',
  questionsAfter: '.',
};

const DA: Copy = {
  pageTitle: 'Privatliv | Bjorli',
  pageDescription:
    'Sådan behandler Bjorli Skisenter AS personoplysninger, cookies og henvendelser via bjorli.no.',
  heroTitle: 'Privatliv',
  heroSubtitle: 'Sådan behandler Bjorli Skisenter AS dine personoplysninger.',
  disclaimer: 'Denne oversættelse er kun til information. I tilfælde af uoverensstemmelser gælder den norske version.',
  intro: [
    'Dit privatliv er vigtigt for Bjorli Skisenter AS, og vi tager vores ansvar for sikkerheden af dine personoplysninger meget alvorligt. Vi forpligter os til at beskytte dine personoplysninger og være åbne om de oplysninger, vi indsamler om dig, og hvad vi bruger dem til.',
    'For at afspejle de seneste ændringer i persondatalovgivningen og vores engagement i åbenhed har vi opdateret vores privatlivspolitik.',
    'Bjorli Skisenter AS (“vi”) respekterer dit privatliv og behandler personoplysninger som dataansvarlig i overensstemmelse med den norske personvernlov. Disse vilkår oplyser dig om, hvordan vi behandler oplysninger om dig.',
  ],
  sections: [
    {
      h: 'Hvilke oplysninger vi behandler, og hvordan vi bruger dem',
      p: [
        'Vi behandler besøgsoplysninger. Det er oplysninger, som serveren automatisk genererer, når nogen besøger vores hjemmeside. Det omfatter typisk hvilke sider der er indlæst, tidspunkt, hvilken side du kom fra, IP-adresse, enhedstype (for eksempel iPhone), browsertype og operativsystem.',
        'Besøgsoplysninger bruges anonymiseret til at drive og videreudvikle hjemmesiderne.',
        'Hvis du udfylder oplysninger i registreringsformularer, behandler vi også disse oplysninger. De bruges til at administrere tjenesterne. Din e-mailadresse kan bruges til markedsføring, hvis du har givet samtykke, eller det i øvrigt er tilladt efter norsk lovgivning.',
        'Vi behandler desuden dine henvendelser og tilbagemeldinger, hvis du frivilligt kontakter os eller giver feedback om vores hjemmesider.',
      ],
    },
    { h: 'Videregivelse til tredjeparter', p: ['Medmindre der er givet samtykke til andet, videregiver vi ikke dine oplysninger til nogen tredjepart.'] },
    {
      h: 'Hvordan opbevarer vi oplysningerne?',
      p: [
        'Vi har implementeret tekniske, fysiske og organisatoriske foranstaltninger for at forhindre, at personoplysninger går tabt eller tilgås af uvedkommende, herunder krypteret opbevaring hvor det er nødvendigt.',
        'Besøgsoplysninger slettes eller anonymiseres løbende. Øvrige oplysninger, vi modtager fra dig, slettes, når vi ikke længere har behov for at opbevare dem.',
      ],
    },
    { h: 'Links', p: ['Bjorli.no indeholder links til hjemmesider, der ejes og drives af andre. Disse privatlivsvilkår gælder kun for bjorli.no, og vi er ikke ansvarlige for, hvordan dine personoplysninger behandles på eksterne sider.'] },
    { h: 'Ændringer', p: ['Ændringer i privatlivserklæringen offentliggør vi på hjemmesiden. Din fortsatte brug af hjemmesiden betyder, at du accepterer de ændrede vilkår. Brugere bør tjekke privatlivserklæringen jævnligt.'] },
    {
      h: 'Brugeranmeldelser fra tredjepart',
      p: [
        'Bjorli.no kan, efter aftale med TripAdvisor, Google, Facebook eller lignende, indsamle og vise anmeldelser fra brugere, der har offentliggjort information om relevante destinationer og produkter på TripAdvisor, Google, Facebook eller lignende.',
        'Du frasiger dig alle rettigheder, du måtte have, når du skriver sådanne anmeldelser. Dine bidrag kan frit bruges, kopieres, distribueres og udgives i alle medier og på alle måder uden din tilladelse.',
        'Vi redigerer ikke brugeranmeldelser på TripAdvisor, Google, Facebook eller lignende, og kan ikke holdes ansvarlige for disse anmeldelser eller anden brug, distribution eller genudgivelse.',
        'Bjorli.no bekræfter eller afkræfter ikke meninger udtrykt i brugeranmeldelser. Beslutninger truffet på baggrund af anmeldelser eller kommentarer på Bjorli.no sker på eget ansvar.',
      ],
    },
    {
      h: 'Cookies',
      p: [
        'Vi bruger cookies. Det er små datapakker, der gemmes på din enhed. Vores cookies bruges til at tilpasse hjemmesiderne til din brug og dine indstillinger og til at gennemføre anonymiserede undersøgelser af brugeradfærd samt registrere antallet af besøgende.',
        'Cookies kan også bruges til målrettet markedsføring i overensstemmelse med gældende lovgivning.',
        'Vi bruger følgende cookies:',
      ],
      subsections: [
        { h: 'Sessionscookies', p: ['Sessionscookies bruges til at registrere, at en bruger er på vores sider, og hvilke valg brugeren træffer.'] },
        { h: 'Vedvarende cookies', p: ['Vedvarende cookies bruger vi, så du ikke skal ændre visse faste indstillinger, fx sprog, hver gang du besøger vores hjemmeside. De fleste vedvarende cookies har en udløbsdato og slettes automatisk derefter.'] },
        { h: 'Tredjepartscookies', p: ['Tredjepartscookies bruger vi til at indsamle generel statistik om besøg, fx via Google Analytics.', 'I din browser kan du vælge at afvise cookies. Via din browser kan du også vælge, om og hvornår du vil slette cookies.'] },
      ],
    },
  ],
  questionsHeading: 'Spørgsmål eller kommentarer',
  questionsBefore: 'Hvis du har spørgsmål eller kommentarer til, hvordan vi behandler personoplysninger, kan du kontakte os på ',
  questionsAfter: '.',
};

const SV: Copy = {
  pageTitle: 'Integritet | Bjorli',
  pageDescription:
    'Så behandlar Bjorli Skisenter AS personuppgifter, cookies och förfrågningar via bjorli.no.',
  heroTitle: 'Integritet',
  heroSubtitle: 'Så behandlar Bjorli Skisenter AS dina personuppgifter.',
  disclaimer: 'Denna översättning är endast avsedd som information. Vid avvikelser gäller den norska versionen.',
  intro: [
    'Din integritet är viktig för Bjorli Skisenter AS, och vi tar vårt ansvar för säkerheten i dina personuppgifter på största allvar. Vi förbinder oss att skydda dina personuppgifter och vara öppna med vilka uppgifter vi samlar in och hur vi använder dem.',
    'För att återspegla de senaste ändringarna i dataskyddslagstiftningen och vårt engagemang för öppenhet har vi uppdaterat vår integritetspolicy.',
    'Bjorli Skisenter AS (”vi”) respekterar din integritet och behandlar personuppgifter som personuppgiftsansvarig i enlighet med den norska personvernlovgivningen. Dessa villkor informerar dig om hur vi behandlar uppgifter om dig.',
  ],
  sections: [
    {
      h: 'Vilka uppgifter vi behandlar och hur vi använder dem',
      p: [
        'Vi behandlar besöksuppgifter. Det är uppgifter som servern automatiskt genererar när någon besöker vår webbplats. Det omfattar vanligen vilka sidor som laddats, tidpunkt, vilken sida du kom från, IP-adress, enhetstyp (till exempel iPhone), webbläsare och operativsystem.',
        'Besöksuppgifter används anonymiserat för att driva och utveckla webbplatsen.',
        'Om du fyller i uppgifter i registreringsformulär behandlar vi även dessa. De används för att administrera tjänsterna. Din e-postadress kan användas för marknadsföring om du samtyckt till det, eller om det i övrigt är tillåtet enligt norsk lag.',
        'Vi behandlar även dina förfrågningar och återkopplingar om du frivilligt kontaktar oss eller ger feedback om webbplatsen.',
      ],
    },
    { h: 'Utlämning till tredje part', p: ['Om inget annat samtycke har lämnats, lämnar vi inte ut dina uppgifter till tredje part.'] },
    {
      h: 'Hur lagrar vi uppgifterna?',
      p: [
        'Vi har vidtagit tekniska, fysiska och organisatoriska åtgärder för att förhindra att personuppgifter går förlorade eller att obehöriga får tillgång, inklusive krypterad lagring där det behövs.',
        'Besöksuppgifter raderas eller anonymiseras löpande. Övriga uppgifter vi får från dig raderas när vi inte längre behöver behålla dem.',
      ],
    },
    { h: 'Länkar', p: ['Bjorli.no innehåller länkar till webbplatser som ägs och drivs av andra. Dessa integritetsvillkor gäller endast bjorli.no, och vi ansvarar inte för hur dina personuppgifter behandlas på externa sidor.'] },
    { h: 'Ändringar', p: ['Vi publicerar ändringar av integritetsdeklarationen på webbplatsen. Genom att fortsätta använda webbplatsen accepterar du de ändrade villkoren. Användare bör kontrollera integritetsdeklarationen regelbundet.'] },
    {
      h: 'Användarrecensioner från tredje part',
      p: [
        'Bjorli.no kan, enligt avtal med TripAdvisor, Google, Facebook eller liknande, samla in och visa recensioner från användare som publicerat information om relevanta destinationer och produkter på TripAdvisor, Google, Facebook eller liknande.',
        'När du skriver sådana recensioner avstår du från alla rättigheter du eventuellt har. Dina bidrag får fritt användas, kopieras, distribueras och publiceras i alla medier och på alla sätt utan ditt tillstånd.',
        'Vi redigerar inte användarrecensioner på TripAdvisor, Google, Facebook eller liknande, och kan inte hållas ansvariga för dessa recensioner eller annan användning, distribution eller återpublicering.',
        'Bjorli.no varken bekräftar eller avfärdar åsikter i användarrecensioner. Beslut som fattas utifrån recensioner eller kommentarer på Bjorli.no sker på egen risk.',
      ],
    },
    {
      h: 'Cookies',
      p: [
        'Vi använder cookies. Det är små datapaket som lagras på din enhet. Våra cookies används för att anpassa webbplatsen efter din användning och dina inställningar samt för att genomföra anonymiserade undersökningar av användarbeteende och räkna antalet besökare.',
        'Cookies kan även användas för riktad marknadsföring i enlighet med gällande lagstiftning.',
        'Vi använder följande cookies:',
      ],
      subsections: [
        { h: 'Sessionscookies', p: ['Sessionscookies används för att registrera att en användare är på våra sidor och vilka val användaren gör.'] },
        { h: 'Bestående cookies', p: ['Bestående cookies använder vi så att du inte behöver ändra vissa inställningar, till exempel språk, varje gång du besöker webbplatsen. De flesta bestående cookies har ett utgångsdatum och raderas automatiskt därefter.'] },
        { h: 'Tredjepartscookies', p: ['Tredjepartscookies använder vi för att samla in allmän statistik om besök, exempelvis via Google Analytics.', 'I din webbläsare kan du välja att avvisa cookies. Via webbläsaren kan du också välja om och när du vill radera cookies.'] },
      ],
    },
  ],
  questionsHeading: 'Frågor eller kommentarer',
  questionsBefore: 'Har du frågor eller kommentarer om hur vi behandlar personuppgifter, kontakta oss på ',
  questionsAfter: '.',
};

const COPY: Record<Locale, Copy> = { no: NO, en: EN, de: DE, nl: NL, da: DA, sv: SV };

const Personvern = () => {
  const { locale } = useLanguage();
  const c = usePageCopy(COPY);

  useEffect(() => {
    document.title = c.pageTitle;
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', c.pageDescription);
    setMeta('og:title', c.pageTitle, true);
    setMeta('og:description', c.pageDescription, true);
  }, [c.pageTitle, c.pageDescription, locale]);

  return (
    <div>
      <PageHero title={c.heroTitle} subtitle={c.heroSubtitle} image={heroImage} />
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <article className="prose prose-base md:prose-lg max-w-none text-foreground/90 prose-headings:font-display prose-headings:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-a:text-secondary hover:prose-a:underline">
            {c.disclaimer && (
              <p className="not-prose mb-8 text-sm rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground/80">
                {c.disclaimer}
              </p>
            )}
            {c.intro.map((p, i) => <p key={`intro-${i}`}>{p}</p>)}
            {c.sections.map((s, i) => (
              <div key={`s-${i}`}>
                {s.h && <h2>{s.h}</h2>}
                {s.p.map((para, j) => <p key={`s-${i}-p-${j}`}>{para}</p>)}
                {s.subsections?.map((sub, k) => (
                  <div key={`s-${i}-sub-${k}`}>
                    <h3>{sub.h}</h3>
                    {sub.p.map((para, j) => <p key={`sub-${k}-p-${j}`}>{para}</p>)}
                  </div>
                ))}
              </div>
            ))}
            <h2>{c.questionsHeading}</h2>
            <p>
              {c.questionsBefore}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              {c.questionsAfter}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Personvern;