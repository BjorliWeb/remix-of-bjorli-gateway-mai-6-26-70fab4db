import type { Locale } from '@/i18n/locales/types';

/**
 * Shared Salgsbetingelser (Terms of Sale) copy + body markup.
 *
 * Moved verbatim out of src/pages/SkiCenter.tsx so both the ski-centre
 * accordion and the standalone /salgsbetingelser page render the exact
 * same legal text. No wording changes.
 *
 * Legal note: the Norwegian text is the authoritative source. Translations
 * for en/de/nl/da/sv are informational only and carry a discrepancy
 * disclaimer at the top of the body.
 */
type TermsCopy = {
  heading: string;
  lead: string;
  trigger: string;
  /** Optional disclaimer rendered as the first line of the accordion body
   *  for non-Norwegian translations. Null for the authoritative Norwegian. */
  disclaimer: string | null;
  introHeading: string;
  introP1: string;
  introP2: string;
  responsibleLabel: string;
  addressLabel: string;
  vatLabel: string;
  emailLabel: string;
  phoneLabel: string;
  s1Title: string;
  s1P1: string;
  s1P2: string;
  s2Title: string;
  s2P1: string;
  s2P2: string;
  s2P3: string;
  s3Title: string;
  s3P1: string;
  s3Intro: string;
  s3List: [string, string, string];
  s3P2: string;
  s4Title: string;
  s4P1: string;
  s5Title: string;
  s5P1: string;
  s6Title: string;
  s6P1: string;
  s7Title: string;
  s7P1: string;
  s8Title: string;
  s8P1: string;
  s9Title: string;
  s9P1: string;
  fmHeading: string;
  fmP1: string;
  fmP2: string;
  fmP3: string;
  fmP4: string;
  fmP5: string;
  fmP6: string;
};

export const SALES_TERMS_COPY: Record<Locale, TermsCopy> = {
  no: {
    heading: 'Salgsbetingelser',
    lead: 'Her finner du generelle salgsbetingelser ved kjøp av heiskort og andre produkter på nett.',
    trigger: 'Les salgsbetingelser',
    disclaimer: null,
    introHeading: 'Generelle salgsbetingelser ved bestilling av heiskort og annet på internett',
    introP1: 'Disse generelle vilkårene gjelder mellom tilbyder og den person som selv, eller gjennom andre, foretar en bestilling på tilbyders webside eller hos tilbyders tilknyttede online partnere.',
    introP2: 'Bestillingen kan gjelde heiskort, aktiviteter og kjøp av andre produkter og tjenester, eller en kombinasjon av disse.',
    responsibleLabel: 'Ansvarlig formidler:',
    addressLabel: 'Adresse:',
    vatLabel: 'Mva nummer:',
    emailLabel: 'E-postadresse:',
    phoneLabel: 'Telefon:',
    s1Title: '1. Bestillers ansvar',
    s1P1: 'Før man foretar en endelig bestilling, skal man lese og gjøre seg kjent med viktig informasjon om det aktuelle produktet. Bestiller er ansvarlig for at kjøpet er i henhold til egne ønsker. Bestiller er ansvarlig for å forsikre seg om at opplysningene i bekreftelsen, som kun sendes på e-post, er i samsvar med bestillingen.',
    s1P2: 'Du kan også registrere deg og logge inn som bruker via sosial innlogging, for eksempel Facebook og Google. Når du registrerer deg ved hjelp av Facebook eller Google, vil du kunne logge inn på din konto med e-posten du er registrert med på disse tjenestene. Du kan når som helst endre dine personopplysninger ved å logge deg inn på «Min side».',
    s2Title: '2. Heiskort',
    s2P1: 'Når du kjøper heiskort online, kan du kjøpe dette med eller uten datamedium, for eksempel Keycard. Hvis du kjøper et heiskort med et eksisterende Keycard, aktiveres billetten ved første passering i vendekorset/heisen. Hvis du har kjøpt et nytt Keycard på nettet, kan dette hentes på destinasjonen.',
    s2P2: 'Hvis skistedet har QR- eller strekkodelesere i vendekorset/heisen, kan billetten lastes ned til smarttelefonen din for offline bruk og brukes for direkte adgang.',
    s2P3: 'Hvis skistedet har automat eller henteboks, kan QR-/strekkoden brukes til å hente billettene dine. Hvis skistedet ikke har dette, kan du gå til billettluken.',
    s3Title: '3. Gjennomføring av bestilling',
    s3P1: 'Etter korrekt gjennomført online betaling skal du få en kvittering på e-post. Kvitteringen vil inneholde alle detaljer ved kjøpet og kan medbringes til skianlegget.',
    s3Intro: 'Bestillingen er ikke gjennomført og ikke gyldig i følgende tilfeller:',
    s3List: [
      'Bestiller har ikke mottatt e-post med kvittering, bekreftelse eller referansenummer.',
      'Kortbetaling avbrytes av ulike årsaker og innbetalingen mislykkes.',
      'Betalingen gjennomføres ikke fullstendig eller korrekt, slik at beløpet ikke blir trukket fra konto.',
    ],
    s3P2: 'Er du i tvil om bestillingen er korrekt gjennomført, ta gjerne kontakt med oss.',
    s4Title: '4. Betaling',
    s4P1: 'Vi benytter en betalingsløsning fra Nets AS / Netaxept. Tredjepart vil ikke få tilgang til dine personopplysninger. Netaxept benytter Secure Socket Layer (SSL) ved overføring av personlig informasjon. SSL lager en sikker, kryptert forbindelse mellom din maskin og Netaxept. På denne måten kan informasjonen overføres trygt uten at uvedkommende kan lese den underveis.',
    s5Title: '5. Angrerett',
    s5P1: 'Ved kjøp av heiskort på internett er det ingen rett til avbestilling eller refusjon, jf. angrerettloven § 22 bokstav m. Dette gjelder også for pakker og kampanjer som inneholder datofestede heiskort eller datofestede arrangement. Ta gjerne kontakt med oss.',
    s6Title: '6. Endring i skatter og avgifter',
    s6P1: 'Dersom skatter og/eller avgifter endres, og dermed fører til en kostnadsøkning for tilbyder etter at bestillingen er gjennomført og betalt, kan prisen økes tilsvarende for bestiller. Prisendringen skal umiddelbart meddeles bestiller.',
    s7Title: '7. Forbehold',
    s7P1: 'Det tas forbehold om eventuelle publiserings- eller korrekturfeil på nettsider og på annen trykt informasjon om tilbudene som tilbyder formidler.',
    s8Title: '8. Tvisteløsning',
    s8P1: 'Gjesten bes henvende seg til tilbyder dersom denne har noe å utsette på bestilt arrangement. Dersom gjesten og tilbyder ikke klarer å forhandle seg til enighet, skal eventuell tvist vedrørende tidligere inngått avtale løses i lokal rettsinstans.',
    s9Title: '9. Force majeure',
    s9P1: 'Begge parter har rett til å gå bort fra avtalen dersom arrangementet ikke kan gjennomføres som følge av krigshandlinger, naturkatastrofer eller arbeidsmarkedskonflikter. Lengre avbrudd i vann- eller energitilførsel, brann eller andre tilsvarende større hendelser som ingen av partene har kunnet forutse eller påvirke, omfattes også.',
    fmHeading: 'Driftsavbrudd som ligger utenfor driftsledelsens kontroll',
    fmP1: 'Ved driftsavbrudd som ligger utenfor skianleggets kontroll skal refusjonen tilsvare 50 % av den forholdsmessige refusjonen som kortinnehaver har krav på etter det foregående punkt.',
    fmP2: 'Dette gjelder ved driftsavbrudd som følge av eksempelvis vær- og vindforhold, snømangel, skred, lynnedslag, oversvømmelse, brann, strømstans, streik, offentligrettslige forbud eller påbud, pandemier m.v., og som utgjør forhold som anlegget ikke med rimelighet kunne forvente å ta i betraktning på kjøpstidspunktet. Det er opp til anlegget å dokumentere at driftsavbruddet skyldes slike forhold, og at anlegget ikke har hatt mulighet til å unngå eller overvinne følgene av disse.',
    fmP3: 'Ovennevnte bestemmelse gjelder ikke hvis anlegget holder åpent mer enn 1/3 av sesongen.',
    fmP4: 'Hvis anlegget er stengt, eksempelvis på grunn av snømangel, utover 1/3 av sesongens totale antall skidager, kan kortholder kreve en forholdsmessig refusjon for den tid sesongkortet ikke kan benyttes. Kortholder har ikke krav på hele kjøpesummen. Et eventuelt refusjonskrav er oppad begrenset til 50 % av heiskortets kjøpesum, uavhengig av kjøpstidspunkt.',
    fmP5: 'Refusjonen skal tilsvare 50 % av den forholdsmessige andel av den tid heiskortet ikke kan benyttes, det vil si heiskortets verdi delt på antall dager i sesongen. Denne «dagraten» er avgjørende for refusjonskravets størrelse.',
    fmP6: 'Eventuelle refusjonskrav kan ikke avregnes før etter at sesongen er avsluttet. Inntil sesongavslutning kan anleggseier følgelig avvise eventuelle refusjonskrav.',
  },
  en: {
    heading: 'Terms of Sale',
    lead: 'General terms of sale that apply when you buy lift passes and other products online.',
    trigger: 'Read the terms of sale',
    disclaimer: 'This translation is provided for information. In case of discrepancy, the Norwegian version applies.',
    introHeading: 'General terms of sale for online orders of lift passes and other products',
    introP1: 'These general terms apply between the provider and the person who, either themselves or through others, places an order on the provider\u2019s website or with the provider\u2019s affiliated online partners.',
    introP2: 'An order may cover lift passes, activities and the purchase of other products and services, or any combination of these.',
    responsibleLabel: 'Responsible provider:',
    addressLabel: 'Address:',
    vatLabel: 'VAT number:',
    emailLabel: 'Email:',
    phoneLabel: 'Phone:',
    s1Title: '1. The customer\u2019s responsibility',
    s1P1: 'Before placing a final order, the customer must read and familiarise themselves with the important information about the relevant product. The customer is responsible for ensuring that the purchase matches their own wishes. The customer is also responsible for verifying that the details in the confirmation, which is only sent by email, match the order.',
    s1P2: 'You may also register and sign in as a user via social login, for example Facebook and Google. When you register using Facebook or Google, you can log in to your account with the email address registered with those services. You may change your personal information at any time by logging in to \u201cMy page\u201d.',
    s2Title: '2. Lift passes',
    s2P1: 'When buying a lift pass online, you can purchase it with or without a physical media, for example a Keycard. If you buy a lift pass on an existing Keycard, the ticket is activated the first time you pass through the gate/lift. If you have bought a new Keycard online, it can be collected at the destination.',
    s2P2: 'If the resort has QR or barcode readers in the gates/lifts, the ticket can be downloaded to your smartphone for offline use and used for direct access.',
    s2P3: 'If the resort has a vending or pick-up box, the QR/barcode can be used to collect your tickets. If the resort does not have this, you can go to the ticket counter.',
    s3Title: '3. Completing the order',
    s3P1: 'After a correctly completed online payment you will receive a receipt by email. The receipt contains all details of the purchase and can be brought with you to the ski resort.',
    s3Intro: 'An order is not completed and not valid in the following cases:',
    s3List: [
      'The customer has not received an email with a receipt, confirmation or reference number.',
      'Card payment is interrupted for any reason and the payment fails.',
      'The payment is not completed fully or correctly, so the amount is not deducted from the account.',
    ],
    s3P2: 'If you are unsure whether your order has been completed correctly, please contact us.',
    s4Title: '4. Payment',
    s4P1: 'We use a payment solution from Nets AS / Netaxept. Third parties will not have access to your personal information. Netaxept uses Secure Socket Layer (SSL) when transferring personal information. SSL creates a secure, encrypted connection between your device and Netaxept, so the information can be transferred safely without third parties being able to read it.',
    s5Title: '5. Right of withdrawal',
    s5P1: 'For lift passes purchased online there is no right of cancellation or refund, cf. the Norwegian Right of Withdrawal Act \u00a7 22 letter m. The same applies to packages and campaigns that include dated lift passes or dated events. Please contact us if needed.',
    s6Title: '6. Changes in taxes and fees',
    s6P1: 'If taxes and/or fees change and this leads to a cost increase for the provider after the order has been placed and paid, the price may be increased correspondingly for the customer. Any price change will be communicated to the customer without delay.',
    s7Title: '7. Reservations',
    s7P1: 'The provider reserves the right to correct any publishing or proofing errors on websites and other printed information about the offers presented.',
    s8Title: '8. Disputes',
    s8P1: 'Guests are asked to contact the provider if they have a complaint about a booked arrangement. If the guest and the provider cannot reach an agreement, any dispute regarding a previously concluded contract shall be resolved in the local court.',
    s9Title: '9. Force majeure',
    s9P1: 'Both parties have the right to withdraw from the agreement if the event cannot be carried out due to acts of war, natural disasters or labour conflicts. Longer interruptions in water or energy supply, fire or other comparable major events that neither party could foresee or influence are also covered.',
    fmHeading: 'Operational interruptions outside the resort\u2019s control',
    fmP1: 'In the event of operational interruptions outside the resort\u2019s control, the refund shall correspond to 50% of the proportional refund the cardholder would otherwise be entitled to under the preceding clause.',
    fmP2: 'This applies to operational interruptions caused by, for example, weather and wind conditions, lack of snow, avalanches, lightning, flooding, fire, power outages, strikes, public-law prohibitions or orders, pandemics, etc., and which constitute circumstances the resort could not reasonably have foreseen at the time of purchase. It is up to the resort to document that the interruption is due to such circumstances and that the resort had no possibility to avoid or overcome the consequences.',
    fmP3: 'The above provision does not apply if the resort is open for more than 1/3 of the season.',
    fmP4: 'If the resort is closed, for example due to lack of snow, for more than 1/3 of the total number of ski days in the season, the cardholder may claim a proportional refund for the time the season pass cannot be used. The cardholder is not entitled to the full purchase price. Any refund claim is capped at 50% of the lift pass purchase price, regardless of the time of purchase.',
    fmP5: 'The refund shall correspond to 50% of the proportional share of the time the lift pass cannot be used, that is, the value of the lift pass divided by the number of days in the season. This \u201cday rate\u201d determines the size of the refund claim.',
    fmP6: 'Any refund claims cannot be settled until after the season has ended. Until the end of the season, the resort owner may therefore reject any refund claims.',
  },
  de: {
    heading: 'AGB',
    lead: 'Hier finden Sie die allgemeinen Verkaufsbedingungen f\u00fcr den Online-Kauf von Skip\u00e4ssen und anderen Produkten.',
    trigger: 'AGB lesen',
    disclaimer: 'Diese \u00dcbersetzung dient nur zur Information. Bei Abweichungen gilt die norwegische Fassung.',
    introHeading: 'Allgemeine Verkaufsbedingungen f\u00fcr die Online-Bestellung von Skip\u00e4ssen und anderen Produkten',
    introP1: 'Diese allgemeinen Bedingungen gelten zwischen dem Anbieter und der Person, die selbst oder durch andere eine Bestellung auf der Website des Anbieters oder bei einem angeschlossenen Online-Partner aufgibt.',
    introP2: 'Die Bestellung kann Skip\u00e4sse, Aktivit\u00e4ten sowie den Kauf weiterer Produkte und Dienstleistungen oder eine Kombination davon umfassen.',
    responsibleLabel: 'Verantwortlicher Anbieter:',
    addressLabel: 'Adresse:',
    vatLabel: 'USt-Nr.:',
    emailLabel: 'E-Mail:',
    phoneLabel: 'Telefon:',
    s1Title: '1. Verantwortung des Bestellers',
    s1P1: 'Vor der endg\u00fcltigen Bestellung muss der Besteller die wichtigen Informationen zum jeweiligen Produkt lesen und zur Kenntnis nehmen. Der Besteller ist daf\u00fcr verantwortlich, dass der Kauf seinen W\u00fcnschen entspricht. Der Besteller ist au\u00dferdem daf\u00fcr verantwortlich, sich zu vergewissern, dass die Angaben in der Best\u00e4tigung, die ausschlie\u00dflich per E-Mail versendet wird, mit der Bestellung \u00fcbereinstimmen.',
    s1P2: 'Sie k\u00f6nnen sich auch \u00fcber Social Login registrieren und anmelden, z. B. mit Facebook oder Google. Wenn Sie sich \u00fcber Facebook oder Google registrieren, k\u00f6nnen Sie sich mit der bei diesen Diensten hinterlegten E-Mail-Adresse in Ihrem Konto anmelden. Sie k\u00f6nnen Ihre pers\u00f6nlichen Daten jederzeit \u00fcber \u201eMein Bereich\u201c \u00e4ndern.',
    s2Title: '2. Skipass',
    s2P1: 'Beim Online-Kauf eines Skipasses k\u00f6nnen Sie diesen mit oder ohne Datentr\u00e4ger, z. B. Keycard, erwerben. Wenn Sie einen Skipass auf eine vorhandene Keycard kaufen, wird das Ticket beim ersten Passieren des Drehkreuzes/Lifts aktiviert. Wenn Sie eine neue Keycard online gekauft haben, kann diese am Zielort abgeholt werden.',
    s2P2: 'Verf\u00fcgt das Skigebiet \u00fcber QR- oder Barcode-Leser an Drehkreuzen/Liften, kann das Ticket auf Ihr Smartphone heruntergeladen und offline zum direkten Zutritt verwendet werden.',
    s2P3: 'Verf\u00fcgt das Skigebiet \u00fcber einen Automaten oder eine Abholbox, k\u00f6nnen Sie den QR-/Barcode zur Abholung Ihrer Tickets verwenden. Andernfalls steht der Ticketschalter zur Verf\u00fcgung.',
    s3Title: '3. Durchf\u00fchrung der Bestellung',
    s3P1: 'Nach korrekt abgeschlossener Online-Zahlung erhalten Sie eine Quittung per E-Mail. Die Quittung enth\u00e4lt alle Details des Kaufs und kann zum Skigebiet mitgenommen werden.',
    s3Intro: 'Die Bestellung gilt in folgenden F\u00e4llen als nicht ausgef\u00fchrt und nicht g\u00fcltig:',
    s3List: [
      'Der Besteller hat keine E-Mail mit Quittung, Best\u00e4tigung oder Referenznummer erhalten.',
      'Die Kartenzahlung wird aus verschiedenen Gr\u00fcnden abgebrochen und die Zahlung schl\u00e4gt fehl.',
      'Die Zahlung wird nicht vollst\u00e4ndig oder nicht korrekt ausgef\u00fchrt, sodass der Betrag nicht vom Konto abgebucht wird.',
    ],
    s3P2: 'Wenn Sie unsicher sind, ob Ihre Bestellung korrekt ausgef\u00fchrt wurde, kontaktieren Sie uns bitte.',
    s4Title: '4. Zahlung',
    s4P1: 'Wir verwenden eine Zahlungsl\u00f6sung von Nets AS / Netaxept. Dritte erhalten keinen Zugriff auf Ihre pers\u00f6nlichen Daten. Netaxept verwendet Secure Socket Layer (SSL) zur \u00dcbertragung pers\u00f6nlicher Informationen. SSL stellt eine sichere, verschl\u00fcsselte Verbindung zwischen Ihrem Ger\u00e4t und Netaxept her, sodass die Informationen sicher \u00fcbertragen werden.',
    s5Title: '5. Widerrufsrecht',
    s5P1: 'Beim Online-Kauf von Skip\u00e4ssen besteht kein Recht auf Stornierung oder R\u00fcckerstattung gem\u00e4\u00df dem norwegischen Widerrufsgesetz \u00a7 22 Buchstabe m. Dies gilt auch f\u00fcr Pakete und Kampagnen, die datierte Skip\u00e4sse oder datierte Veranstaltungen enthalten. Kontaktieren Sie uns bei Bedarf.',
    s6Title: '6. \u00c4nderungen bei Steuern und Abgaben',
    s6P1: '\u00c4ndern sich Steuern und/oder Abgaben und f\u00fchren dies nach abgeschlossener und bezahlter Bestellung zu einer Kostensteigerung beim Anbieter, kann der Preis f\u00fcr den Besteller entsprechend erh\u00f6ht werden. Die Preis\u00e4nderung wird dem Besteller unverz\u00fcglich mitgeteilt.',
    s7Title: '7. Vorbehalt',
    s7P1: 'Der Anbieter beh\u00e4lt sich Druck- oder Korrekturfehler auf Websites und in sonstigen gedruckten Informationen zu den vermittelten Angeboten vor.',
    s8Title: '8. Streitbeilegung',
    s8P1: 'G\u00e4ste werden gebeten, sich bei Beanstandungen zu einem gebuchten Angebot an den Anbieter zu wenden. K\u00f6nnen Gast und Anbieter keine Einigung erzielen, ist f\u00fcr Streitigkeiten aus dem zuvor geschlossenen Vertrag das \u00f6rtliche Gericht zust\u00e4ndig.',
    s9Title: '9. H\u00f6here Gewalt',
    s9P1: 'Beide Parteien sind berechtigt, vom Vertrag zur\u00fcckzutreten, wenn die Veranstaltung infolge von Kriegshandlungen, Naturkatastrophen oder Arbeitskonflikten nicht durchgef\u00fchrt werden kann. L\u00e4ngere Unterbrechungen der Wasser- oder Energieversorgung, Brand oder vergleichbare gr\u00f6\u00dfere Ereignisse, die keine der Parteien vorhersehen oder beeinflussen konnte, sind ebenfalls erfasst.',
    fmHeading: 'Betriebsunterbrechungen au\u00dferhalb der Kontrolle des Skigebiets',
    fmP1: 'Bei Betriebsunterbrechungen au\u00dferhalb der Kontrolle des Skigebiets entspricht die R\u00fcckerstattung 50 % der anteiligen R\u00fcckerstattung, auf die der Karteninhaber nach dem vorstehenden Punkt sonst Anspruch h\u00e4tte.',
    fmP2: 'Dies gilt bei Betriebsunterbrechungen z. B. infolge von Wetter- und Windverh\u00e4ltnissen, Schneemangel, Lawinen, Blitzschlag, \u00dcberschwemmung, Brand, Stromausfall, Streiks, beh\u00f6rdlichen Verboten oder Anordnungen, Pandemien usw., die Umst\u00e4nde darstellen, die das Skigebiet zum Kaufzeitpunkt nicht in zumutbarer Weise voraussehen konnte. Es obliegt dem Skigebiet, nachzuweisen, dass die Unterbrechung auf solche Umst\u00e4nde zur\u00fcckzuf\u00fchren ist und das Skigebiet keine M\u00f6glichkeit hatte, deren Folgen zu vermeiden oder zu \u00fcberwinden.',
    fmP3: 'Die obige Bestimmung gilt nicht, wenn das Skigebiet mehr als 1/3 der Saison ge\u00f6ffnet ist.',
    fmP4: 'Ist das Skigebiet, z. B. wegen Schneemangels, mehr als 1/3 der gesamten Skitage der Saison geschlossen, kann der Karteninhaber eine anteilige R\u00fcckerstattung f\u00fcr die Zeit verlangen, in der die Saisonkarte nicht genutzt werden kann. Ein Anspruch auf den vollen Kaufpreis besteht nicht. Eine R\u00fcckerstattungsforderung ist unabh\u00e4ngig vom Kaufzeitpunkt auf 50 % des Kaufpreises des Skipasses begrenzt.',
    fmP5: 'Die R\u00fcckerstattung entspricht 50 % des anteiligen Werts der Zeit, in der der Skipass nicht genutzt werden kann \u2013 das hei\u00dft dem Wert des Skipasses geteilt durch die Anzahl der Tage der Saison. Dieser \u201eTagessatz\u201c ist ma\u00dfgeblich f\u00fcr die H\u00f6he der R\u00fcckerstattungsforderung.',
    fmP6: 'Etwaige R\u00fcckerstattungsforderungen k\u00f6nnen erst nach Saisonende abgerechnet werden. Bis zum Saisonende kann der Anlagenbetreiber R\u00fcckerstattungsforderungen daher zur\u00fcckweisen.',
  },
  nl: {
    heading: 'Verkoopvoorwaarden',
    lead: 'Hier vind je de algemene verkoopvoorwaarden voor de online aankoop van skipassen en andere producten.',
    trigger: 'Lees de verkoopvoorwaarden',
    disclaimer: 'Deze vertaling is uitsluitend ter informatie. Bij afwijkingen geldt de Noorse versie.',
    introHeading: 'Algemene verkoopvoorwaarden voor online bestellingen van skipassen en andere producten',
    introP1: 'Deze algemene voorwaarden gelden tussen de aanbieder en de persoon die zelf of via anderen een bestelling plaatst op de website van de aanbieder of bij aangesloten online partners.',
    introP2: 'Een bestelling kan betrekking hebben op skipassen, activiteiten en de aankoop van andere producten en diensten, of een combinatie daarvan.',
    responsibleLabel: 'Verantwoordelijke aanbieder:',
    addressLabel: 'Adres:',
    vatLabel: 'BTW-nummer:',
    emailLabel: 'E-mail:',
    phoneLabel: 'Telefoon:',
    s1Title: '1. Verantwoordelijkheid van de besteller',
    s1P1: 'Voor het plaatsen van een definitieve bestelling moet de besteller de belangrijke informatie over het betreffende product lezen en kennisnemen. De besteller is verantwoordelijk dat de aankoop overeenkomt met de eigen wensen. De besteller is ook verantwoordelijk om te controleren dat de gegevens in de bevestiging, die uitsluitend per e-mail wordt verzonden, overeenstemmen met de bestelling.',
    s1P2: 'Je kunt je ook registreren en aanmelden via social login, bijvoorbeeld Facebook en Google. Bij registratie via Facebook of Google log je in met het e-mailadres dat bij die diensten is geregistreerd. Je kunt je persoonlijke gegevens op elk moment wijzigen via \u201cMijn pagina\u201d.',
    s2Title: '2. Skipassen',
    s2P1: 'Bij online aankoop van een skipas kun je deze met of zonder datadrager kopen, bijvoorbeeld een Keycard. Koop je een skipas op een bestaande Keycard, dan wordt het ticket geactiveerd bij de eerste passage bij het draaihek/de lift. Heb je online een nieuwe Keycard gekocht, dan kan deze op de bestemming worden opgehaald.',
    s2P2: 'Beschikt het skigebied over QR- of barcodelezers bij het draaihek/de lift, dan kan het ticket op je smartphone worden gedownload voor offline gebruik en direct toegang.',
    s2P3: 'Beschikt het skigebied over een automaat of ophaalbox, dan kan de QR-/barcode worden gebruikt om je tickets op te halen. Anders kun je naar het ticketloket gaan.',
    s3Title: '3. Afronden van de bestelling',
    s3P1: 'Na een correct uitgevoerde online betaling ontvang je een ontvangstbevestiging per e-mail. De bevestiging bevat alle details van de aankoop en kan worden meegenomen naar het skigebied.',
    s3Intro: 'De bestelling is in de volgende gevallen niet uitgevoerd en niet geldig:',
    s3List: [
      'De besteller heeft geen e-mail met bevestiging, ontvangstbewijs of referentienummer ontvangen.',
      'De kaartbetaling wordt om uiteenlopende redenen afgebroken en de betaling mislukt.',
      'De betaling wordt niet volledig of niet correct uitgevoerd, waardoor het bedrag niet van de rekening wordt afgeschreven.',
    ],
    s3P2: 'Twijfel je of de bestelling correct is uitgevoerd, neem dan gerust contact met ons op.',
    s4Title: '4. Betaling',
    s4P1: 'Wij gebruiken een betaaloplossing van Nets AS / Netaxept. Derden krijgen geen toegang tot je persoonlijke gegevens. Netaxept gebruikt Secure Socket Layer (SSL) bij de overdracht van persoonlijke informatie. SSL maakt een veilige, versleutelde verbinding tussen je apparaat en Netaxept, zodat de informatie veilig kan worden overgedragen.',
    s5Title: '5. Herroepingsrecht',
    s5P1: 'Voor online gekochte skipassen geldt geen recht op annulering of restitutie, conform de Noorse Wet op het herroepingsrecht \u00a7 22 letter m. Dit geldt ook voor pakketten en campagnes die gedateerde skipassen of gedateerde evenementen bevatten. Neem gerust contact met ons op.',
    s6Title: '6. Wijziging van belastingen en heffingen',
    s6P1: 'Indien belastingen en/of heffingen wijzigen en dit leidt tot een kostenstijging voor de aanbieder nadat de bestelling is geplaatst en betaald, kan de prijs voor de besteller dienovereenkomstig worden verhoogd. De prijswijziging wordt onverwijld aan de besteller meegedeeld.',
    s7Title: '7. Voorbehoud',
    s7P1: 'Voorbehoud wordt gemaakt voor eventuele publicatie- of drukfouten op websites en in andere gedrukte informatie over de aangeboden arrangementen.',
    s8Title: '8. Geschillen',
    s8P1: 'Gasten worden verzocht contact op te nemen met de aanbieder bij klachten over een geboekt arrangement. Komen gast en aanbieder er niet samen uit, dan wordt een eventueel geschil over de eerder gesloten overeenkomst beslecht bij de plaatselijke rechter.',
    s9Title: '9. Overmacht',
    s9P1: 'Beide partijen hebben het recht de overeenkomst te ontbinden als het arrangement niet kan worden uitgevoerd door oorlogshandelingen, natuurrampen of arbeidsconflicten. Langere onderbrekingen in water- of energievoorziening, brand of vergelijkbare grote gebeurtenissen die geen van de partijen kon voorzien of be\u00efnvloeden vallen hier ook onder.',
    fmHeading: 'Bedrijfsonderbrekingen buiten de controle van het skigebied',
    fmP1: 'Bij bedrijfsonderbrekingen buiten de controle van het skigebied bedraagt de restitutie 50% van de evenredige restitutie waarop de pashouder volgens het vorige punt anders recht zou hebben.',
    fmP2: 'Dit geldt bij bedrijfsonderbrekingen door bijvoorbeeld weer- en windomstandigheden, sneeuwgebrek, lawines, blikseminslag, overstroming, brand, stroomuitval, stakingen, publiekrechtelijke verboden of bevelen, pandemie\u00ebn enzovoort, die omstandigheden vormen die het skigebied op het moment van aankoop redelijkerwijs niet kon voorzien. Het is aan het skigebied om aan te tonen dat de onderbreking door dergelijke omstandigheden is veroorzaakt en dat het skigebied de gevolgen niet kon voorkomen of overwinnen.',
    fmP3: 'Bovenstaande bepaling geldt niet als het skigebied meer dan 1/3 van het seizoen geopend is.',
    fmP4: 'Is het skigebied, bijvoorbeeld door sneeuwgebrek, meer dan 1/3 van het totale aantal skidagen in het seizoen gesloten, dan kan de pashouder een evenredige restitutie eisen voor de tijd dat de seizoenpas niet kan worden gebruikt. De pashouder heeft geen recht op de volledige aankoopprijs. Een eventuele restitutievordering is, ongeacht het aankoopmoment, beperkt tot 50% van de aankoopprijs van de skipas.',
    fmP5: 'De restitutie komt overeen met 50% van het evenredige aandeel van de tijd dat de skipas niet kan worden gebruikt, dat wil zeggen de waarde van de skipas gedeeld door het aantal dagen in het seizoen. Dit \u201cdagtarief\u201d is bepalend voor de hoogte van de restitutievordering.',
    fmP6: 'Eventuele restitutievorderingen kunnen pas na afloop van het seizoen worden afgerekend. Tot het einde van het seizoen mag de exploitant restitutievorderingen daarom afwijzen.',
  },
  da: {
    heading: 'Salgsbetingelser',
    lead: 'Her finder du de generelle salgsbetingelser ved k\u00f8b af liftkort og andre produkter online.',
    trigger: 'L\u00e6s salgsbetingelser',
    disclaimer: 'Denne overs\u00e6ttelse er kun til information. I tilf\u00e6lde af uoverensstemmelser g\u00e6lder den norske version.',
    introHeading: 'Generelle salgsbetingelser ved online bestilling af liftkort og andet',
    introP1: 'Disse generelle vilk\u00e5r g\u00e6lder mellem udbyderen og den person, der selv eller gennem andre foretager en bestilling p\u00e5 udbyderens hjemmeside eller hos udbyderens tilknyttede onlinepartnere.',
    introP2: 'Bestillingen kan omfatte liftkort, aktiviteter og k\u00f8b af andre produkter og tjenester eller en kombination heraf.',
    responsibleLabel: 'Ansvarlig udbyder:',
    addressLabel: 'Adresse:',
    vatLabel: 'Moms-nr.:',
    emailLabel: 'E-mail:',
    phoneLabel: 'Telefon:',
    s1Title: '1. Bestillerens ansvar',
    s1P1: 'F\u00f8r en endelig bestilling skal bestilleren l\u00e6se og g\u00f8re sig bekendt med vigtige oplysninger om det p\u00e5g\u00e6ldende produkt. Bestilleren er ansvarlig for, at k\u00f8bet er i overensstemmelse med egne \u00f8nsker. Bestilleren er ogs\u00e5 ansvarlig for at sikre, at oplysningerne i bekr\u00e6ftelsen, der kun sendes pr. e-mail, stemmer overens med bestillingen.',
    s1P2: 'Du kan ogs\u00e5 registrere dig og logge ind som bruger via social login, fx Facebook og Google. N\u00e5r du registrerer dig via Facebook eller Google, kan du logge ind p\u00e5 din konto med den e-mail, der er registreret hos disse tjenester. Du kan til enhver tid \u00e6ndre dine personoplysninger ved at logge ind p\u00e5 \u201eMin side\u201c.',
    s2Title: '2. Liftkort',
    s2P1: 'N\u00e5r du k\u00f8ber liftkort online, kan du k\u00f8be det med eller uden datamedium, fx Keycard. Hvis du k\u00f8ber et liftkort til et eksisterende Keycard, aktiveres billetten ved f\u00f8rste passage gennem dreje-/liftporten. Har du k\u00f8bt et nyt Keycard online, kan det hentes p\u00e5 destinationen.',
    s2P2: 'Hvis skistedet har QR- eller stregkodel\u00e6sere ved drejeporte/lifte, kan billetten downloades til din smartphone til offlinebrug og benyttes til direkte adgang.',
    s2P3: 'Hvis skistedet har automat eller afhentningsboks, kan QR-/stregkoden bruges til at hente dine billetter. Ellers kan du g\u00e5 til billetlugen.',
    s3Title: '3. Gennemf\u00f8relse af bestilling',
    s3P1: 'Efter korrekt gennemf\u00f8rt onlinebetaling modtager du en kvittering pr. e-mail. Kvitteringen indeholder alle detaljer om k\u00f8bet og kan medbringes til skianl\u00e6gget.',
    s3Intro: 'Bestillingen er ikke gennemf\u00f8rt og ikke gyldig i f\u00f8lgende tilf\u00e6lde:',
    s3List: [
      'Bestilleren har ikke modtaget en e-mail med kvittering, bekr\u00e6ftelse eller referencenummer.',
      'Kortbetalingen afbrydes af forskellige \u00e5rsager, og betalingen mislykkes.',
      'Betalingen gennemf\u00f8res ikke fuldt ud eller korrekt, s\u00e5 bel\u00f8bet ikke tr\u00e6kkes fra kontoen.',
    ],
    s3P2: 'Er du i tvivl om, hvorvidt din bestilling er gennemf\u00f8rt korrekt, er du velkommen til at kontakte os.',
    s4Title: '4. Betaling',
    s4P1: 'Vi anvender en betalingsl\u00f8sning fra Nets AS / Netaxept. Tredjepart f\u00e5r ikke adgang til dine personoplysninger. Netaxept anvender Secure Socket Layer (SSL) ved overf\u00f8rsel af personlige oplysninger. SSL etablerer en sikker, krypteret forbindelse mellem din enhed og Netaxept, s\u00e5 oplysningerne overf\u00f8res sikkert.',
    s5Title: '5. Fortrydelsesret',
    s5P1: 'Ved online k\u00f8b af liftkort er der ingen ret til annullering eller refusion, jf. den norske angrerettlov \u00a7 22 litra m. Det samme g\u00e6lder pakker og kampagner, der indeholder daterede liftkort eller daterede arrangementer. Kontakt os gerne.',
    s6Title: '6. \u00c6ndringer i skatter og afgifter',
    s6P1: 'Hvis skatter og/eller afgifter \u00e6ndres, og det medf\u00f8rer en omkostningsstigning for udbyderen efter at bestillingen er gennemf\u00f8rt og betalt, kan prisen for bestilleren forh\u00f8jes tilsvarende. Pris\u00e6ndringen meddeles straks bestilleren.',
    s7Title: '7. Forbehold',
    s7P1: 'Der tages forbehold for eventuelle publicerings- eller korrekturfejl p\u00e5 hjemmesider og anden trykt information om udbyderens tilbud.',
    s8Title: '8. Tvistl\u00f8sning',
    s8P1: 'G\u00e6sten bedes henvende sig til udbyderen ved klager over et bestilt arrangement. Hvis g\u00e6sten og udbyderen ikke n\u00e5r til enighed, afg\u00f8res tvister vedr\u00f8rende den tidligere indg\u00e5ede aftale ved den lokale retsinstans.',
    s9Title: '9. Force majeure',
    s9P1: 'Begge parter har ret til at tr\u00e6de tilbage fra aftalen, hvis arrangementet ikke kan gennemf\u00f8res p\u00e5 grund af krigshandlinger, naturkatastrofer eller arbejdsmarkedskonflikter. L\u00e6ngere afbrydelser i vand- eller energiforsyning, brand eller andre tilsvarende st\u00f8rre h\u00e6ndelser, som ingen af parterne har kunnet forudse eller p\u00e5virke, er ogs\u00e5 omfattet.',
    fmHeading: 'Driftsafbrydelser uden for driftsledelsens kontrol',
    fmP1: 'Ved driftsafbrydelser uden for skianl\u00e6ggets kontrol svarer refusionen til 50 % af den forholdsm\u00e6ssige refusion, som kortindehaveren ellers ville have krav p\u00e5 efter det foreg\u00e5ende punkt.',
    fmP2: 'Dette g\u00e6lder ved driftsafbrydelser som f\u00f8lge af eksempelvis vejr- og vindforhold, snemangel, lavinefare, lynnedslag, oversv\u00f8mmelse, brand, str\u00f8msvigt, strejke, offentligretlige forbud eller p\u00e5bud, pandemier m.v., og som udg\u00f8r forhold, som anl\u00e6gget med rimelighed ikke kunne forudse p\u00e5 k\u00f8bstidspunktet. Det p\u00e5hviler anl\u00e6gget at dokumentere, at afbrydelsen skyldes s\u00e5danne forhold, og at anl\u00e6gget ikke har haft mulighed for at undg\u00e5 eller overvinde f\u00f8lgerne heraf.',
    fmP3: 'Ovenst\u00e5ende bestemmelse g\u00e6lder ikke, hvis anl\u00e6gget holder \u00e5bent mere end 1/3 af s\u00e6sonen.',
    fmP4: 'Er anl\u00e6gget lukket, eksempelvis pga. snemangel, ud over 1/3 af s\u00e6sonens samlede antal skidage, kan kortholderen kr\u00e6ve en forholdsm\u00e6ssig refusion for den tid, s\u00e6sonkortet ikke kan benyttes. Kortholderen har ikke krav p\u00e5 hele k\u00f8besummen. Et eventuelt refusionskrav er uanset k\u00f8bstidspunkt begr\u00e6nset opadtil til 50 % af liftkortets k\u00f8besum.',
    fmP5: 'Refusionen svarer til 50 % af den forholdsm\u00e6ssige andel af den tid, liftkortet ikke kan benyttes, dvs. liftkortets v\u00e6rdi divideret med antal dage i s\u00e6sonen. Denne \u201edagsrate\u201c er afg\u00f8rende for refusionskravets st\u00f8rrelse.',
    fmP6: 'Eventuelle refusionskrav kan ikke afregnes f\u00f8r efter s\u00e6sonens afslutning. Indtil s\u00e6sonafslutning kan anl\u00e6gsejeren derfor afvise eventuelle refusionskrav.',
  },
  sv: {
    heading: 'K\u00f6pvillkor',
    lead: 'H\u00e4r hittar du de allm\u00e4nna k\u00f6pvillkoren f\u00f6r onlinek\u00f6p av liftkort och andra produkter.',
    trigger: 'L\u00e4s k\u00f6pvillkoren',
    disclaimer: 'Denna \u00f6vers\u00e4ttning \u00e4r endast avsedd som information. Vid avvikelser g\u00e4ller den norska versionen.',
    introHeading: 'Allm\u00e4nna k\u00f6pvillkor vid online-bokning av liftkort och annat',
    introP1: 'Dessa allm\u00e4nna villkor g\u00e4ller mellan leverant\u00f6ren och den person som sj\u00e4lv eller genom andra g\u00f6r en bokning p\u00e5 leverant\u00f6rens webbplats eller hos leverant\u00f6rens anslutna onlinepartners.',
    introP2: 'Bokningen kan g\u00e4lla liftkort, aktiviteter och k\u00f6p av andra produkter och tj\u00e4nster, eller en kombination av dessa.',
    responsibleLabel: 'Ansvarig leverant\u00f6r:',
    addressLabel: 'Adress:',
    vatLabel: 'Momsnummer:',
    emailLabel: 'E-post:',
    phoneLabel: 'Telefon:',
    s1Title: '1. Best\u00e4llarens ansvar',
    s1P1: 'F\u00f6re en slutlig bokning ska best\u00e4llaren l\u00e4sa och ta del av viktig information om aktuell produkt. Best\u00e4llaren ansvarar f\u00f6r att k\u00f6pet st\u00e4mmer med egna \u00f6nskem\u00e5l. Best\u00e4llaren ansvarar ocks\u00e5 f\u00f6r att kontrollera att uppgifterna i bekr\u00e4ftelsen, som endast skickas via e-post, st\u00e4mmer med bokningen.',
    s1P2: 'Du kan ocks\u00e5 registrera dig och logga in som anv\u00e4ndare via social inloggning, till exempel Facebook och Google. N\u00e4r du registrerar dig via Facebook eller Google kan du logga in p\u00e5 ditt konto med den e-postadress som \u00e4r registrerad hos dessa tj\u00e4nster. Du kan n\u00e4r som helst \u00e4ndra dina personuppgifter genom att logga in p\u00e5 \u201eMin sida\u201c.',
    s2Title: '2. Liftkort',
    s2P1: 'N\u00e4r du k\u00f6per liftkort online kan du k\u00f6pa det med eller utan datamedium, till exempel Keycard. Om du k\u00f6per ett liftkort p\u00e5 ett befintligt Keycard aktiveras biljetten vid f\u00f6rsta passagen genom v\u00e4ndkorset/liften. Har du k\u00f6pt ett nytt Keycard online kan det h\u00e4mtas vid destinationen.',
    s2P2: 'Om skidanl\u00e4ggningen har QR- eller streckkodsl\u00e4sare i v\u00e4ndkorset/liften kan biljetten laddas ner till din smartphone f\u00f6r offlineanv\u00e4ndning och anv\u00e4ndas f\u00f6r direkt tilltr\u00e4de.',
    s2P3: 'Om skidanl\u00e4ggningen har automat eller h\u00e4mtningsbox kan QR-/streckkoden anv\u00e4ndas f\u00f6r att h\u00e4mta dina biljetter. Annars kan du g\u00e5 till biljettluckan.',
    s3Title: '3. Genomf\u00f6rande av bokning',
    s3P1: 'Efter korrekt genomf\u00f6rd onlinebetalning f\u00e5r du ett kvitto via e-post. Kvittot inneh\u00e5ller alla detaljer om k\u00f6pet och kan tas med till skidanl\u00e4ggningen.',
    s3Intro: 'Bokningen \u00e4r inte genomf\u00f6rd och inte giltig i f\u00f6ljande fall:',
    s3List: [
      'Best\u00e4llaren har inte f\u00e5tt n\u00e5got e-postmeddelande med kvitto, bekr\u00e4ftelse eller referensnummer.',
      'Kortbetalningen avbryts av olika sk\u00e4l och betalningen misslyckas.',
      'Betalningen genomf\u00f6rs inte fullt ut eller korrekt, s\u00e5 att beloppet inte dras fr\u00e5n kontot.',
    ],
    s3P2: '\u00c4r du os\u00e4ker p\u00e5 om bokningen \u00e4r korrekt genomf\u00f6rd \u00e4r du v\u00e4lkommen att kontakta oss.',
    s4Title: '4. Betalning',
    s4P1: 'Vi anv\u00e4nder en betall\u00f6sning fr\u00e5n Nets AS / Netaxept. Tredje part f\u00e5r inte tillg\u00e5ng till dina personuppgifter. Netaxept anv\u00e4nder Secure Socket Layer (SSL) vid \u00f6verf\u00f6ring av personlig information. SSL skapar en s\u00e4ker, krypterad anslutning mellan din enhet och Netaxept, s\u00e5 att informationen kan \u00f6verf\u00f6ras s\u00e4kert.',
    s5Title: '5. \u00c5ngerr\u00e4tt',
    s5P1: 'Vid online-k\u00f6p av liftkort finns ingen r\u00e4tt till avbokning eller \u00e5terbetalning, jfr. den norska \u00e5ngerr\u00e4ttslagen \u00a7 22 bokstav m. Detsamma g\u00e4ller paket och kampanjer som inneh\u00e5ller daterade liftkort eller daterade arrangemang. Kontakta oss g\u00e4rna.',
    s6Title: '6. \u00c4ndring av skatter och avgifter',
    s6P1: 'Om skatter och/eller avgifter \u00e4ndras och detta medf\u00f6r en kostnads\u00f6kning f\u00f6r leverant\u00f6ren efter att bokningen \u00e4r genomf\u00f6rd och betald kan priset h\u00f6jas i motsvarande m\u00e5n f\u00f6r best\u00e4llaren. Pris\u00e4ndringen meddelas best\u00e4llaren omedelbart.',
    s7Title: '7. F\u00f6rbeh\u00e5ll',
    s7P1: 'F\u00f6rbeh\u00e5ll g\u00f6rs f\u00f6r eventuella publicerings- eller korrekturfel p\u00e5 webbplatser och i annan tryckt information om de erbjudanden som leverant\u00f6ren f\u00f6rmedlar.',
    s8Title: '8. Tvistl\u00f6sning',
    s8P1: 'G\u00e4sten ombeds v\u00e4nda sig till leverant\u00f6ren vid klagom\u00e5l p\u00e5 ett bokat arrangemang. Om g\u00e4sten och leverant\u00f6ren inte n\u00e5r en \u00f6verenskommelse l\u00f6ses tvister r\u00f6rande det tidigare ing\u00e5ngna avtalet vid lokal domstol.',
    s9Title: '9. Force majeure',
    s9P1: 'B\u00e5da parter har r\u00e4tt att fr\u00e5ntr\u00e4da avtalet om arrangemanget inte kan genomf\u00f6ras till f\u00f6ljd av krigshandlingar, naturkatastrofer eller arbetsmarknadskonflikter. L\u00e4ngre avbrott i vatten- eller energif\u00f6rs\u00f6rjningen, brand eller andra j\u00e4mf\u00f6rbara st\u00f6rre h\u00e4ndelser som ingen av parterna kunnat f\u00f6ruts\u00e4tta eller p\u00e5verka omfattas ocks\u00e5.',
    fmHeading: 'Driftavbrott utanf\u00f6r driftledningens kontroll',
    fmP1: 'Vid driftavbrott utanf\u00f6r skidanl\u00e4ggningens kontroll motsvarar \u00e5terbetalningen 50 % av den proportionella \u00e5terbetalning som kortinnehavaren annars skulle ha r\u00e4tt till enligt f\u00f6reg\u00e5ende punkt.',
    fmP2: 'Detta g\u00e4ller vid driftavbrott till f\u00f6ljd av exempelvis v\u00e4der- och vindf\u00f6rh\u00e5llanden, sn\u00f6brist, laviner, blixtnedslag, \u00f6versv\u00e4mning, brand, str\u00f6mavbrott, strejk, offentligr\u00e4ttsliga f\u00f6rbud eller f\u00f6rel\u00e4gganden, pandemier m.m., och som utg\u00f6r f\u00f6rh\u00e5llanden som anl\u00e4ggningen rimligen inte kunde f\u00f6ruts\u00e4tta vid k\u00f6ptillf\u00e4llet. Det \u00e5ligger anl\u00e4ggningen att dokumentera att avbrottet beror p\u00e5 s\u00e5dana f\u00f6rh\u00e5llanden och att anl\u00e4ggningen inte haft m\u00f6jlighet att undvika eller \u00f6vervinna f\u00f6ljderna.',
    fmP3: 'Ovanst\u00e5ende best\u00e4mmelse g\u00e4ller inte om anl\u00e4ggningen \u00e4r \u00f6ppen mer \u00e4n 1/3 av s\u00e4songen.',
    fmP4: 'Om anl\u00e4ggningen \u00e4r st\u00e4ngd, exempelvis p\u00e5 grund av sn\u00f6brist, ut\u00f6ver 1/3 av s\u00e4songens totala antal skiddagar, kan kortinnehavaren beg\u00e4ra en proportionell \u00e5terbetalning f\u00f6r den tid s\u00e4songskortet inte kan anv\u00e4ndas. Kortinnehavaren har inte r\u00e4tt till hela k\u00f6pesumman. En eventuell \u00e5terbetalningsbeg\u00e4ran \u00e4r oavsett k\u00f6ptillf\u00e4lle begr\u00e4nsad upp\u00e5t till 50 % av liftkortets k\u00f6pesumma.',
    fmP5: '\u00c5terbetalningen motsvarar 50 % av den proportionella del av tiden d\u00e5 liftkortet inte kan anv\u00e4ndas, det vill s\u00e4ga liftkortets v\u00e4rde dividerat med antal dagar i s\u00e4songen. Denna \u201edagstaxa\u201c \u00e4r avg\u00f6rande f\u00f6r \u00e5terbetalningskravets storlek.',
    fmP6: 'Eventuella \u00e5terbetalningskrav kan inte avr\u00e4knas f\u00f6rr\u00e4n efter s\u00e4songens slut. Fram till s\u00e4songsavslutningen kan anl\u00e4ggnings\u00e4garen d\u00e4rf\u00f6r avvisa eventuella \u00e5terbetalningskrav.',
  },
};

export const SalesTermsBody = ({ tr }: { tr: TermsCopy }) => (
  <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-4 leading-relaxed">
    {tr.disclaimer && (
      <p className="text-xs italic text-muted-foreground border-l-2 border-border pl-3">
        {tr.disclaimer}
      </p>
    )}
    <p className="font-semibold">{tr.introHeading}</p>
    <p>{tr.introP1}</p>
    <p>{tr.introP2}</p>
    <div>
      <p className="font-semibold mb-1">{tr.responsibleLabel}</p>
      <p className="mb-0">Bjorli Skisenter AS</p>
      <p className="mb-0">{tr.addressLabel} Bjorliveien 84, 2669 Bjorli</p>
      <p className="mb-0">{tr.vatLabel} 831 920 432</p>
      <p className="mb-0">
        {tr.emailLabel}{' '}
        <a href="mailto:skisenter@bjorli.no" className="text-secondary hover:underline">
          skisenter@bjorli.no
        </a>
      </p>
      <p className="mb-0">{tr.phoneLabel} +47 48 15 22 00</p>
    </div>

    <h3 className="font-semibold mt-4">{tr.s1Title}</h3>
    <p>{tr.s1P1}</p>
    <p>{tr.s1P2}</p>

    <h3 className="font-semibold mt-4">{tr.s2Title}</h3>
    <p>{tr.s2P1}</p>
    <p>{tr.s2P2}</p>
    <p>{tr.s2P3}</p>

    <h3 className="font-semibold mt-4">{tr.s3Title}</h3>
    <p>{tr.s3P1}</p>
    <p>{tr.s3Intro}</p>
    <ul className="list-disc pl-6 space-y-1">
      {tr.s3List.map((li) => (
        <li key={li}>{li}</li>
      ))}
    </ul>
    <p>{tr.s3P2}</p>

    <h3 className="font-semibold mt-4">{tr.s4Title}</h3>
    <p>{tr.s4P1}</p>

    <h3 className="font-semibold mt-4">{tr.s5Title}</h3>
    <p>{tr.s5P1}</p>

    <h3 className="font-semibold mt-4">{tr.s6Title}</h3>
    <p>{tr.s6P1}</p>

    <h3 className="font-semibold mt-4">{tr.s7Title}</h3>
    <p>{tr.s7P1}</p>

    <h3 className="font-semibold mt-4">{tr.s8Title}</h3>
    <p>{tr.s8P1}</p>

    <h3 className="font-semibold mt-4">{tr.s9Title}</h3>
    <p>{tr.s9P1}</p>

    <p className="font-semibold mt-2">{tr.fmHeading}</p>
    <p>{tr.fmP1}</p>
    <p>{tr.fmP2}</p>
    <p>{tr.fmP3}</p>
    <p>{tr.fmP4}</p>
    <p>{tr.fmP5}</p>
    <p>{tr.fmP6}</p>
  </div>
);
