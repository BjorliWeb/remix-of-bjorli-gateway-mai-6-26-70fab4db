# Bjorli — International SEO Content Strategy

Goal: ensure each important search intent for Bjorli has a clear, single
landing page in every supported language. This is an editor / developer
reference — keyword stuffing is forbidden. Each page should target one
primary intent and a small cluster of related questions.

## Locales

| Code | URL prefix | Notes |
|------|------------|-------|
| no   | `/`        | Canonical Norwegian site |
| en   | `/en/`     | Primary international entry; x-default fallback |
| de   | `/de/`     | German tourism market |
| nl   | `/nl/`     | Dutch tourism market |
| da   | `/da/`     | Danish tourism market |
| sv   | `/sv/`     | Swedish tourism market |

Never use `/dk/` or `/se/`.

## Intent → page map

| Search intent | EN page | NO page | Notes |
|---|---|---|---|
| ski holiday Norway | `/en/ski-holiday-norway` | `/` | EN-only landing page reinforces the home page intent. |
| family ski resort Norway | `/en/family` | `/familie` | Emphasize calm, short distances, children's areas. |
| snow sure ski resort Norway | `/en/bjorli-ski-resort` | `/bjorli-skisenter` | "often among the first to open", "snow-sure". |
| skiing in Norway by train | `/en/getting-here` | `/reisen-hit` | Cross-link to Visit Norway's Raumabanen guide. |
| ski resort near Dombås / Åndalsnes | `/en/getting-here` + `/en/bjorli-ski-resort` | `/reisen-hit` + `/bjorli-skisenter` | Mention both towns explicitly. |
| ski resort near Raumabanen | `/en/getting-here` | `/reisen-hit` | Train angle. |
| cross-country skiing Norway | `/en/cross-country-skiing` | `/langrenn` | Snow-sure trails, classic + skating. |
| ski school Norway | `/en/ski-school` | `/skiskole` | Children, beginners, telemark. |
| ski rental Bjorli | `/en/ski-rental` | `/skiutleie` | Located next to the resort. |
| mountain holiday Norway (summer) | `/en/summer` | `/sommer` | Hiking, cycling, fishing, families. |
| hiking Bjorli | `/en/hiking` | `/fotturer` | Reinheimen, Dovrefjell, Romsdalen. |
| cycling Bjorli | `/en/cycling` | `/sykling` | Gravel + mountain. |
| fishing Bjorli | (covered in `/en/summer` until dedicated page) | `/sommer` | Add dedicated page when WP content exists. |
| Romsdalen and Bjorli | `/en/getting-here` + tips | `/reisen-hit` + tips | Link to Romsdalsgondolen, Trollstigen. |
| Reinheimen and Bjorli | `/en/hiking` | `/fotturer` | National park context. |
| Dovrefjell and Bjorli | `/en/hiking` | `/fotturer` | National park context. |

## International flight access (DA / NL / EN)

Bjorli is positioned as easier to reach for Danish and Dutch ski tourists
thanks to direct flights to Ålesund Airport Vigra (AES). Use careful
language only — "in relevant periods", "seasonal or year-round depending
on route", "check current airline schedules". Do NOT emphasise London
Gatwick for winter SEO; it is not the priority winter route for Bjorli.

Source: https://www.traveltrade.visitmr.com/articles/direct-flights

### Danish search intents (`/da/`)

- skiferie Norge fly fra København → `/da/rejsen-hertil`, `/da/skiferie-norge`
- skiferie Bjorli fra København → `/da/rejsen-hertil`, `/da/skiferie-norge`
- skiferie Norge Ålesund lufthavn → `/da/rejsen-hertil`
- familie skiferie Norge fra Danmark → `/da/familie`, `/da/skiferie-norge`
- skiferie Norge med direkte fly → `/da/rejsen-hertil`, `/da/skiferie-norge`

### Dutch search intents (`/nl/`)

- skivakantie Noorwegen vliegen vanaf Amsterdam → `/nl/reizen-naar-bjorli`, `/nl/ski-vakantie-noorwegen`
- skivakantie Bjorli via Ålesund → `/nl/reizen-naar-bjorli`
- skiën Noorwegen KLM Ålesund → `/nl/reizen-naar-bjorli`
- familievriendelijke skivakantie Noorwegen → `/nl/familie`, `/nl/ski-vakantie-noorwegen`
- wintersport Noorwegen vanaf Amsterdam → `/nl/reizen-naar-bjorli`, `/nl/ski-vakantie-noorwegen`

### English carrier of the message

- `/en/getting-here` — primary owner of "fly to Bjorli", "Ålesund airport
  to Bjorli", "drive from Vigra".
- `/en/ski-holiday-norway` — secondary mention to capture
  "ski holiday Norway flights".

### Internal linking

- Every Danish and Dutch ski-holiday landing page should link to its
  local "getting here / rejsen hertil / reizen naar Bjorli" page using
  the flight-access section as the anchor.
- The Getting Here page renders an opt-in `flightAccess` block from the
  i18n dictionary (`gettingHere.flightAccess`) — populated for DA, NL
  and EN; absent for NO, DE, SV until carrier coverage justifies it.
- FAQ blocks on all three locales include a "Can you fly to Bjorli from
  Amsterdam / Copenhagen?" Q&A so the answer surfaces in FAQPage JSON-LD
  for AI Overviews and Perplexity.

### Verification before launch

The following claims must be re-verified against airline schedules
before production launch (and before any paid push targeting DK / NL):

1. KLM Amsterdam ↔ Ålesund — confirm operating periods across 2026.
2. SAS Copenhagen ↔ Ålesund — confirm 29 March 2026 start date and
   winter 2026/2027 continuity.
3. Drive time Vigra → Bjorli (~2.5 h) — re-check via Google / Entur.
4. Refresh the Travel Trade Møre & Romsdal source URL for any
   subsequent updates.

## Translation parity

Every page in the table above MUST exist in NO/EN/DE/NL/DA/SV with a
localized slug from `src/i18n/routes.ts`. The English-only landing
(`/en/ski-holiday-norway`) is intentionally not translated; do not
create `/no/`, `/de/` etc. variants for it.

## Editorial guardrails

- Use Bjorli prominently in the first paragraph of every page.
- Use "Norway" or its localized equivalent in international pages where
  natural (avoid in NO).
- Careful claims only: "often among the first to open", "snow-sure",
  "easy to reach", "a good base for". Do not invent rankings, prices,
  ratings or reviews.
- One H1 per page. Use H2/H3 to structure intents.
- Include a short factual summary near the top (use
  `<PageSummaryBlock>`) so LLMs can lift it cleanly.
- Add an FAQ block (`<FaqBlock>`) for any page with 3+ recurring
  questions — this also emits FAQPage JSON-LD.
- Internal link to neighbouring topics; see §5 of `docs/SEO_GEO_AEO.md`.

## Linking out

Use external links sparingly and with descriptive anchor text. Open in
the same tab unless the link is to a third-party booking step.
Suggested placements:

- `/reisen-hit`: Visit Norway Raumabanen guide; Entur for tickets.
- `/sommer`: Visit Norway Bjorli & Lesja page.
- `/fotturer`: Nasjonalparkriket Bjorli + national park pages.
- Tips articles about Romsdalen day trips: Romsdalsgondolen / Golden
  Train listings on Visit Norway.

## Production handoff (Next.js)

- `seoTitle` / `seoDescription` move from
  `src/lib/seo/routeSeo.ts` into WordPress fields per page per locale.
- Sitemap is generated by `app/sitemap.ts` from WordPress, including
  `availableTranslations` so missing locales never appear in hreflang.
- Verify hreflang in Search Console for every locale × every page.