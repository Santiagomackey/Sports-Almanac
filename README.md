# Sports Almanac — Live 2026 & Historical Archive

The original hero artwork, sport illustrations, palette, typography and boxed layout are retained.

## Run / upload

Open `index.html`, or upload the CONTENTS of `sports-almanac/` to your existing static website / GitHub repository. Keep `assets/` next to `index.html`. No build step, API key or database is required.

Upload all files together, including `live.html`, `live.js`, `api/live.mjs` and `vercel.json`. ESPN feeds can run on static hosting; deploy to Vercel for the included server endpoint and Formula 1 standings. See V6 hosting instructions below.

## Included

- 15 sport archives: NFL, NBA, MLB, NHL, soccer, tennis, golf, boxing, Formula 1, cricket, rugby, cycling, athletics, handball and swimming.
- 212 numerical statistics and 158 athlete profiles, generated from the same data.
- 375 championship results with winners, available opponents/results and reference links.
- Search across athletes, sports, statistic names, teams, competitions and years.
- A statistics desk with sport/metric filters, search, numeric sorting within a metric, pagination, saved records and CSV export.
- Sport dossiers with Statistics, Champions, Athletes and Sport Guide tabs.
- Team directories with championship appearances included in this edition.
- Same-sport athlete comparisons that require a matching metric, unit and coverage scope.
- Browser-local saved statistics and championship records. These do not sync between devices; storage restrictions can prevent persistence.
- A dated history panel. It says “Today” only when a stored event matches the visitor’s local date; otherwise it explicitly displays a historical archive item.

## Coverage and statistical conventions

The curated championship archive now includes selected completed 2025 and 2026 editions. The separate live desk fetches current-season statistics, including 2026 and 2026–27. Individual table rows contain their applicable coverage. Missing rows do not mean zero.

| Competition | Included period |
| --- | --- |
| Super Bowls | Game years 1967–2024; corresponds to 1966–2023 NFL seasons |
| NBA / BAA Finals | 1947–2024 |
| World Series | 1980–2024; no 1994 tournament |
| Stanley Cup Final | 1990–2024; no 2005 championship |
| Men's FIFA World Cup | 1930–2022, all 22 tournaments |
| Women's FIFA World Cup | 1991–2023, all nine tournaments |
| Men's European Championship | 1964 final |
| Wimbledon men's singles | 2008 final |
| Formula 1 drivers' champions | 1950–2024 |
| Men's ODI Cricket World Cup | 1975–2023 |
| Men's Rugby World Cup | 1987–2023 |
| Tour de France | 2010–2024, official winners |
| Men's IHF World Championship | 1995–2023 |

Some sports have career statistics but no championship-result series in this edition. Tabs show the actual available coverage. Sport guides are introductory summaries, not comprehensive rulebooks.

Career lists contain selected players, not all-time rankings of every eligible athlete. Active careers are not silently compared against frozen current totals. Formula 1 statistics are specifically the 2023 top ten. Tennis totals are singles titles across eras. Golf counts professional men's majors, including Bobby Jones's seven professional majors, not his amateur titles. Cricket is ODI; rugby is union; handball is men's indoor.

Year labels use the event/final year. NFL Super Bowl details additionally state the preceding season year. NBA, MLB and NHL final scores represent series wins. The 1950 men's World Cup entry identifies a decisive final-group match, not a knockout final. Tour 2010 lists official winner Andy Schleck following disqualification of the original first-place rider.

Team page counts cover the archive window only. Historical franchise names are retained separately. Men's and women's national sides are identified by competition. These counts are not entire-franchise trophy totals.

## Data maintenance

Edit `data.js` to add entries. It defines `window.ALMANAC` with `sports`, `stats`, `champions`, `events`, and `sources`. IDs must stay unique and stable because saved records use them. Use an explicit metric, unit and scope for each numerical value. Include a source URL. Only figures with matching sport/metric/scope/unit appear together in comparisons. Most menus and counters update from the data automatically.

Sources include league/federation archives and specialist reference databases; reference links appear inside the site. Broad archive links can require selecting a historical season. Historical archive entries are manually curated; the live desk uses separate automatically refreshed feeds.

## Verification

JavaScript syntax, data consistency, unique IDs, file references, all dossier tabs, profile/result rendering, filters, sorting, directories, saved-state logic, comparison eligibility, search escaping and CSV output were checked with a browserless DOM harness. The unchanged hero asset was checked. No real-browser visual or mobile-device test was available in the editing environment; responsive rules and reduced-motion/focus behavior are included but require final device QA after upload.

## Dedicated sport editions (this update)

Every sport now has a standalone `sport-*.html` URL. The homepage artwork is unchanged. Each sport page contains an overview, sortable/searchable statistics, championship results, championship win totals, searchable athlete profiles, and a sport guide. Pages work as static files with no router/server configuration.

The new record-book section provides metric spotlights and a random athlete button. Numeric comparison availability is now checked before offering a comparison button.

Championship win totals are calculated separately by competition from the loaded results. Men's and women's World Cups are never combined. The coverage period and number of included editions accompany each table.

Athlete profiles support links such as `index.html?athlete=Michael%20Jordan`; sport tabs support hashes such as `sport-nfl.html#statistics`. The shared `pages.js` layer handles navigation. All 15 pages and their six sections were exercised in the browserless harness. Real-browser visual testing remains unavailable.

## V4: full reference pages

- `athletes.html`: searchable player directory with sport filtering, sorting and pagination.
- `athlete.html?name=Tom%20Brady`: full athlete profile with numerical cards, sources, saved statistics, compatible comparison links and a peer table with matching coverage.
- `teams.html`: searchable team directory grouped by sport and competition.
- `team.html?sport=NBA&name=Chicago%20Bulls`: title years, championship opponent summaries and every included final for one team. National teams stay separate by competition.
- `yearbook.html?year=2024`: historical calendar-year explorer with sport filters and previous/next available year controls. It explicitly distinguishes Super Bowl game years from NFL season years.
- `saved.html`: a dedicated shelf for saved statistics and championship results.

The homepage now includes direct links to the yearbook, athlete files, team histories and saved shelf. Statistic tables and search results open full athlete/team pages. Existing sport pages retain their original tabs and appearance.

This release keeps the curated 178 statistics, 127 athlete profiles and 254 championship results. It expands how those records can be explored; it does not claim to add live seasons. Peer positions are calculated only among loaded rows with identical sport, metric, unit and coverage. Championship opponent summaries count final outcomes, not individual game head-to-head records.

Upload all files in this folder together. Existing saved IDs are retained. The added scripts remain plain browser JavaScript; there is no installation or build requirement.

## V5: deeper history and competition pages

121 championship records were added while preserving every existing record ID: 33 NBA/BAA Finals (1947–1979), 50 Formula 1 drivers' champions (1950–1999), 19 World Series (1980–1999 excluding 1994), and 19 Stanley Cup finals (1990–2009 excluding 2005).

Formula 1 title counts are derived from all 75 championship seasons from 1950 through 2024, creating 34 numerical title records. The archive now contains **212 statistical entries, 158 athlete profiles, and 375 championship results**.

- `competitions.html`: searchable competition catalog, with sport filters, included edition counts and date windows.
- `competition.html?sport=NBA&name=NBA+Finals`: competition results with year-range and participant filters, pagination, CSV export and title totals calculated from the active selection.
- `result.html?id=c0`: permanent result page with champion, runner-up where applicable, score interpretation, source, and previous/next included editions. Existing result buttons now open this page.

Known gaps are documented: no World Series in 1994 and no NHL champion in 2005. NBA titles in 1947–1949 are identified as BAA history. The original Baltimore Bullets (1948 champion) is explicitly distinguished from the later Baltimore/Washington franchise. Historical franchise names are otherwise not merged.

Reference links include the NBA's official championship index, year-specific Formula 1 standings, MLB postseason archives, and NHL decade championship histories. Result pages carry their source and coverage notes.

Verification includes browserless rendering of every result page and competition, range/search filters, CSV export, invalid URLs, source/file integrity and preserved original artwork. A real-browser visual test was not available.

## V6 — Live 2026 and current-season statistics

Open **live.html**, or the live desk immediately below the homepage artwork.

- NFL, NBA, MLB, NHL, Premier League, La Liga, Argentina and men's FIFA World Cup scores and schedules from ESPN. Choose a match date, including 2025/2026 dates.
- Current-season standings, grouped by the provider's conferences/tables, with wins, losses, points and other available metrics. The provider's season label is shown: NBA 2026–27 is not mislabelled 2026.
- Game details show available team statistics and player box scores. Future games may not have a box score yet.
- Formula 1 driver standings, constructor names, points and wins through the latest classified round from Jolpica-F1. This is not real-time lap timing.
- Visible-tab score refresh every 30 seconds; standings every 5 minutes. Manual refresh and pause controls, request timeouts, retrieval timestamps, empty schedules and explicit feed errors.
- All content is fetched at runtime. No 2026 scores or results are fabricated or bundled as fake live data.

### Hosting

The original static archive still works. ESPN explicitly allows cross-origin browser requests, so the eight ESPN league feeds also work on ordinary static hosting via a direct-feed fallback. Your browser/network must permit access to site.api.espn.com. Formula 1 requires the included server endpoint.

For **all features**, deploy this folder as the project root on Vercel, using the Other framework preset, no build command, and output directory `.`. The root `api/live.mjs` supplies GET `/api/live` using Vercel's Node runtime. No API keys or dependencies are required. The endpoint only accepts the listed leagues and feed types and has a 10-second upstream timeout. Do not configure a catch-all HTML rewrite over `/api/live`.

Example: `/api/live?league=nfl&kind=scores&date=20261012`; `/api/live?league=nba&kind=standings`; `/api/live?league=f1&kind=standings`.

ESPN's public endpoints are not a contracted service and can change or throttle. Jolpica has usage limits. Review provider terms before commercial deployment. The UI never substitutes archived statistics for a failed live request. A retrieval timestamp means the response was fetched then, not that every number changed then. Standings display the provider's current season, independently of the scoreboard's selected match date. Game details are snapshots and can be reopened to refresh.

The archive contains completed 2025 and 2026 championship additions, documented in V7 below. Coverage varies by competition; older career-statistic snapshots retain their original dates.

Provider references: https://site.api.espn.com/ · https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md · https://vercel.com/docs/functions/runtimes/node-js

V6 verification: all eight ESPN scoreboards and standings endpoints returned HTTP 200; 2026 F1 standings were retrieved. Browserless rendering checks exercised these payloads, game box scores, unavailable-feed states, hidden-tab pause and backend input validation. Local links and original artwork were checked. A visual browser check and hosted deployment have not been performed.

## V7 — corrected championship cards and yearbook

The homepage championship cards, year dropdown, yearbook, sport pages, team title counts and competition pages now use 15 additional sourced results: eight from 2025 and seven from 2026. There are 390 championship results in total. Source links are stored on every new result.

Added 2025/2026 Super Bowls, NBA Finals, Stanley Cup Finals, Tour de France and Wimbledon men's singles; the 2025 World Series, F1 drivers' championship and men's handball World Championship; the 2026 men's FIFA World Cup and handball European Championship. European and world handball competitions are kept separate.

The 2026 World Series and F1 title are marked undecided as of 12 October 2026, with links to live coverage. The 2026 Super Bowl follows the 2025 NFL season. Status notes are dated editorial snapshots, not auto-updating championship predictions.

F1 driver title totals are recalculated through 2025, Denmark's world-title count includes 2025, and Pogačar's Tour count includes 2026. Five sourced 2026 NBA postseason statistics were added. There are 218 numerical entries; remaining career snapshots retain their own original coverage dates. This does not claim every historical statistic is current.

Upload the full folder contents to replace the previous release. Changed scripts and styles have versioned URLs to avoid reusing old cached files. Live-feed functionality is retained.

## V8 — Today, some years ago

The history card and More Events dialog now show only events matching the visitor's local month and day, from earlier years. Two sourced October 12 anniversaries are bundled for offline use. Additional sports events load from Wikimedia's daily history feed, with attribution and source links. No unrelated date is substituted on empty days or network failures. The section checks for local midnight every minute and when the tab becomes visible. Original styling and artwork are retained.
