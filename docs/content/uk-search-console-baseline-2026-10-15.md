# UK Search Console baseline, 15 October 2026

Internal reference for the English (UK) content and SEO work. Not for publication on the site.

## Source and filters

- Source: manual review in Google Search Console, 15 October 2026.
- Property: `sc-domain:bjorli.no`.
- Filters: Country = United Kingdom, Search type = Web. All languages and pages included.
- Country describes where the search was made, not the user's nationality or language.
- Period: 14 July–13 October 2026.

## Totals for the period

| Clicks | Impressions | CTR | Average position |
|---|---|---|---|
| 49 | 1,388 | 3.5% | 7.1 |

Reviewed: 73 reported queries and 93 pages.

## Selected queries

| Query | Clicks | Impressions | Avg. position |
|---|---|---|---|
| bjorli | 6 | 128 | 6.0 |
| bjorli skisenter | 5 | 8 | 1.5 |
| bjorli norway | 4 | 50 | 6.3 |
| webcam bjorli | 2 | 3 | 1.3 |
| bjorli station | 1 | 7 | 6.3 |
| bjorli ski resort | 0 | 6 | 6.7 |
| train from oslo to andalsnes | 0 | 4 | 8.5 |
| train oslo to åndalsnes | 0 | 3 | 8.0 |
| ski pass norway | 0 | 3 | 38.0 |
| norwegian ski resorts | 0 | 1 | 2.0 |
| norway skiing season | 0 | 1 | 1.0 |

## Selected pages (reported separately per exact URL)

| URL | Clicks | Impressions | Avg. position |
|---|---|---|---|
| https://bjorli.no/en/ | 7 | 180 | 5.9 |
| https://bjorli.no/en/summer/ | 0 | 30 | 12.0 |
| https://bjorli.no/en/golden-train/ | 0 | 25 | 15.1 |
| https://bjorli.no/en/bjorli-ski-resort/ | 0 | 20 | 8.3 |
| https://bjorli.no/en/bjorli-ski-resort | 0 | 9 | 16.7 |
| https://bjorli.no/en/accommodation/ | 0 | 9 | 14.3 |
| https://bjorli.no/en/accommodation | 0 | 2 | 72.5 |
| https://bjorli.no/en/winter/ | 0 | 2 | 53.5 |
| https://bjorli.no/en/winter | 0 | 3 | 47.0 |
| https://bjorli.no/en/tips/5-reasons-to-take-the-train-to-bjorli | 1 | 4 | 7.3 |
| https://bjorli.no/en/tips/5-reasons-to-take-the-train-to-bjorli/ | 0 | 2 | 3.5 |

## Limitations

- The selected rows are a sample. They don't add up to the totals and are not a complete query log.
- "Gateway to winter", "family ski holidays in Norway" and "winter holidays in Norway" were not among the 73 reported queries. That does not prove there is no demand or no impressions.
- The numbers are small. Don't build demand or traffic estimates on them.
- **Winter check:** the period 1 November 2025–31 May 2026 was selected with the same UK filter. Search Console showed "Processing data, please check again in a day or so", disabled report controls and "No data". Winter data was unavailable at the time of the check. This is not documented zero traffic, and no winter comparison can be drawn. The window was chosen to cover winter broadly and does not document the ski resort's actual season.

## URL variants (checked 15 October 2026)

The historical tables show URLs with and without a trailing slash. On the live site, checked with `curl`:

- `https://bjorli.no/en/bjorli-ski-resort`, `/en/accommodation`, `/en/winter`, `/en` and the train article without a slash return **308** to the trailing-slash URL.
- `http://bjorli.no/en/` and `https://www.bjorli.no/en/` return **301** to `https://bjorli.no/en/`.
- Canonical, hreflang, sitemap and OG URL all use the `https://bjorli.no/…/` form.

The variants in Search Console are historical signals, not current errors. No URLs were removed or renamed.

## Priorities derived from this data

- A. English homepage and ski resort page (existing visibility).
- B. Winter page: clearer holiday content and search themes.
- C. Travel information and the train article (searches about the station and Oslo–Åndalsnes).
- D. Accommodation and booking routes that help visitors take the next step.
