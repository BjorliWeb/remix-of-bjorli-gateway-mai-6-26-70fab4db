# Morki Lodge på overnattingssiden

## Hva som endres
- Nytt kort **Morki Lodge** (https://morkilodge.no) rett etter Bjorli Mountain Lodge i lista «Overnattingsmuligheter», på alle seks språk (no, en, de, nl, da, sv). Kortet ser ut som de andre.
- **Tekst på kortet**, kun med opplysninger fra Morki Lodges egen nettside:
  - Kategori: «Privat lodge» (oversatt).
  - Beskrivelse (no): «Privat lodge på Søre Morken gård med plass til 12, seks soverom og langrennsløype rett utenfor døren.» Tilsvarende på de fem andre språkene.
  - Knapp: «Send forespørsel hos Morki Lodge» (oversatt). Lenken åpnes i ny fane, akkurat som de andre.
- **Bilde:** Nettstedet har ikke noe bilde av Morki Lodge. Jeg bruker et nøytralt fjellbilde som allerede finnes på siden, til du sender et godkjent bilde. Bilder fra morkilodge.no blir ikke kopiert uten tillatelse.
- **Google Analytics:** Klikk på knappen sendes med samme hendelse som de andre overnattingskortene, med navnet «Morki Lodge», kategorien og lenkeadressen. Da kan du skille Morki Lodge fra de andre i GA4. Det legges ikke til noen ny type hendelse.

## Kontroller
- Siden vises riktig på alle seks språk, og Morki Lodge står som nummer fire.
- Den første ferdige siden (det søkemotorer leser) inneholder Morki Lodge.
- I nettleseren: klikk på knappen sender én hendelse med riktig navn og lenke.
- Tester og bygg.
- Ingen publisering.

## Tekniske detaljer
- `src/pages/Accommodation.tsx`: ny `ProviderKey` `morki` i `providers` etter `mountainLodge`, i `PROVIDER_CATEGORY` (`apartment`→ heller `lodge`), `PROVIDER_IMAGES` og `providers` i alle seks `COPY`-språk.
- Tracking skjer gjennom eksisterende `trackAccommodationLinkClick` (`provider_name`, `provider_category`, `link_url`, `link_text`).
- Det trengs ingen endringer i analytics-modulen, i samtykket eller i prerenderingen, fordi siden er bygget av samme komponent.
