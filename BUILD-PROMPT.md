# One.Group — Phase-wise Build Prompt

Use these prompts in order with any AI coding agent. Each phase depends on the ones before it. The repo you are reading is the finished output of Phases 1–7. Phases 8–10 are the growth roadmap.

---

## The idea (read this before Phase 1)

**One.Group: "One place for every group."** A platform-neutral hub where people **find, start and grow** groups: communities, clubs, teams, trips and events. It has five parts:

1. **Directory.** Traffic and SEO. Groups are listed by interest, city, language and platform (WhatsApp, Telegram, Discord, Slack, Facebook, in person).
2. **Organizer toolkit.** Free tools people come back to: expense splitter, event budget, membership revenue calculator, name generator, team picker, poll.
3. **Playbook.** Long-form guides and videos. This is the AdSense and YouTube inventory and targets high-intent keywords.
4. **Group Quotes.** The lead-generation engine: group travel, events and venues, group insurance, team building, bulk buying.
5. **Community money.** Contests, donations, sponsorships, featured listings and talent hiring.

**Why this idea and not the alternatives.** The main alternatives were a corporate-holding-style site (weak traffic), a group-buying deals site (thin margins, heavy operations) and a pure directory (low revenue per visit). The combined hub wins on three points:

- **Keyword economics.** "Group" is the modifier on some of the highest-value commercial searches: group health insurance, group travel, group tours, event venues and team building. Directory and guide pages bring cheap top-of-funnel traffic, and Group Quotes converts it into paid leads.
- **Five revenue streams, not one:** AdSense/RPM, lead referral fees, sponsorships and featured listings, donations and memberships, YouTube.
- **The domain fits literally.** A `.group` TLD on a directory of groups is memorable and needs no explanation.

**Rough unit economics.** These are industry ranges, not guarantees; check them against your own data.

| Stream | Driver | Ballpark |
|---|---|---|
| AdSense | Tier-1 content RPM | ~$5–20 per 1,000 pageviews (much higher on insurance/travel pages) |
| Insurance leads | Small-group health/business | often ~$30–100+ per qualified lead in the US/Canada |
| Group travel leads | Tour operators / group desks | often ~$15–50 per lead, or 3–10% commission |
| Venue / event leads | Venues, planners | often ~$10–40 per lead |
| Featured listings | $49/30 days | 100 listings/month ≈ $4.9k/month |
| Sponsorships | Category/city sponsor $499/month | 10 sponsors ≈ $5k/month |

The lead forms are what make this model work: 100 insurance leads a month at $50 earns more than about 300k pageviews of AdSense.

---

## Phase 1: Foundation and brand
> Build a static, dependency-free website for the domain **One.Group**, hostable on the GitHub Pages free plan.
> - Flat structure: one `.html` file per page at the repo root, plus `assets/css`, `assets/js` and `assets/img`. The shared header and footer live in `assets/js/layout.js`; per-page SEO `<head>` and the top contact bar are static in each HTML file. Also add `scripts/sitemap.py`, `sitemap.xml`, `robots.txt`, `ads.txt`, `manifest.webmanifest`, `.nojekyll` and `404.html`.
> - Brand: always written "One.Group" with the dot. Use a gradient mark in violet #5b3df5, purple #8b5cf6 and coral #ff6b4a, the Plus Jakarta Sans font, a light/dark theme toggle that remembers the choice, and a mobile-first layout with no horizontal scroll at 390px.
> - **Every page** starts with a top bar that reads *"Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership"* and links to `https://web.works/contact`.
> - A sticky header with nav, a mobile hamburger menu, a footer segmented by audience (Members / Organizers / Business / Company), a newsletter form and a mobile sticky CTA bar.

## Phase 2: Configuration and hidden-email form engine
> Create `assets/js/config.js` as the single place for all monetization and IDs: AdSense client and slots, GA4 ID, payment links (Stripe, PayPal link, Buy Me a Coffee, Patreon, Ko-fi, GitHub Sponsors), YouTube channel and video IDs, and social links.
> - All forms post by AJAX to FormSubmit. The owner inbox is stored **only as an encoded integer array** and decoded at runtime, so it never appears in HTML, `mailto:` links or visible text. Support an optional FormSubmit alias to replace the address after activation.
> - Every form gets a honeypot, validation, a success/error state, a `_subject` naming the form, a table template, the source page URL and a GA `generate_lead` event.

## Phase 3: Directory
> Build `groups.html` with a filter sidebar (keyword, location, category, platform, price, verified, sort), deep links such as `?q=&where=&cat=`, and cards showing members, platform, price, activity, language and a verified badge. The cards come from `assets/js/data.js`, seed data clearly labelled as illustrative samples.
> - Add a "Concierge match" lead form.
> - Build `list-your-group.html`, a 3-step wizard with a progress bar: details, then location/size/price/privacy, then organizer contact plus upsell (Free / Featured / Verified + video), consent and rules.

## Phase 4: Lead generation (Group Quotes)
> Build `quotes.html` with five tabbed, multi-step wizards, one question per screen and contact details asked last:
> - **Travel:** trip type, destination, departure city, dates and flexibility, group size, budget per person, accommodation level, and services (flights/hotels/transfers/activities/insurance).
> - **Events & venues:** event type, city, date, guests, budget, services and venue style.
> - **Insurance:** coverage type, country/postal code, people to cover (2–9 / 10–49 / 50–199 / 200+), group type, current cover and start date. Include a licensed-professional disclaimer.
> - **Team building:** format, goal, team size, city, budget per person, date, and an optional "free 15-min call".
> - **Bulk buying:** product, quantity, needed-by date and details.
>
> Each wizard ends with an explicit partner-sharing consent (up to 5 partners). Add trust rows, a referral-fee disclosure, a FAQ and a "Become a partner" CTA. Deep links: `quotes.html#travel|events|insurance|teambuilding|bulk`.

## Phase 5: Engagement: tools, guides, videos
> - `tools.html`: expense splitter, event budget planner, membership revenue calculator, group name generator, random team picker and an in-room poll. All run client-side. Add a "suggest a tool" form.
> - `guides.html` plus at least 7 long-form guides, each with a TOC, tables, a mid-article ad slot, a CTA band into Quotes or Listing, Article JSON-LD and related links. Topics: starting a community, growing WhatsApp/Telegram/Discord groups, monetization, group travel, event planning, team building ideas and group insurance basics.
> - `videos.html`: a click-to-load YouTube-nocookie player (no heavy iframes on first load) driven by `config.youtube.videos`. When that list is empty, show topic cards that open a YouTube search. Add a "pitch your group for a spotlight" form.

## Phase 6: Money pages: contests, support, careers, advertise
> - `contests.html`: Group of the Month, Photo Challenge and Organizer Grant; a 4-step "how winners are chosen"; an entry form with referral field and share button; official rules (no purchase necessary, 18+, judging, notification, taxes, licence).
> - `support.html`: one-time/monthly toggle, amount presets and custom amount, a fund selector (operations, promoting small groups, marketing, hiring talent, contests & prizes, grants), a use-of-funds table, a goal meter, supporter tiers ($5/$15/$50), payment buttons from config, a pledge form as fallback and a not-a-charity note.
> - `careers.html`: roles (writer, sales, video, moderator, ambassador, developer) and an application form with consent.
> - `advertise.html`: a media kit with packages (Featured $49, Newsletter $149, Category Sponsor $499, custom Contest/Video), a lead-partner program (pay-per-lead / rev-share / subscription) and an inquiry form that includes "Domain / website acquisition".

## Phase 7: Trust, legal, SEO, monetization plumbing
> - Pages: `about`, `contact` (topic router, no email shown), `faq` (FAQPage JSON-LD), `trust-safety`, `privacy` (GDPR, CCPA, PIPEDA and Québec Law 25; AdSense cookie language), `terms`, and `legal` (trademark no-affiliation disclaimer for "ONE Group"-type marks, copyright, DMCA, and advertising/affiliate disclosure).
> - A cookie consent banner. AdSense and GA load **only** after consent and only when IDs are set. Until then, ad slots render house ads that sell sponsorships and push Quotes, Support and Listing.
> - SEO: unique titles and descriptions, canonical tags, OG/Twitter tags, WebSite + SearchAction and Organization JSON-LD, an auto-generated sitemap, and robots rules.
> - QA: open every page headless at 390/1280/1440px. Require zero JS errors and zero horizontal overflow. Grep the repo to confirm the owner email appears nowhere in plain text.

## Phase 8: Launch (owner actions)
0. Turn on GitHub Pages: Settings, Pages, Source "Deploy from a branch", then `main` / `(root)`. The site goes live at `https://webworksa1.github.io/One-Group/`.
1. Point **one.group** DNS at GitHub Pages: A records 185.199.108.153, .109.153, .110.153, .111.153 and a `www` CNAME to `webworksa1.github.io`. Then add `one.group` under Settings, Pages, Custom domain and enable HTTPS. (This creates the `CNAME` file.)
2. Submit any form once, then click FormSubmit's activation email. Optionally paste the alias into `config.formAlias`.
3. Apply for AdSense. Once approved, set `adsenseClient` and the slots, and uncomment `ads.txt`. Use a Google-certified CMP for EEA/UK traffic.
4. Add payment links, the YouTube channel, social links and GA4 to `config.js`.
5. Submit the sitemap in Google Search Console and Bing Webmaster Tools.

## Phase 9: Growth (months 1–6)
> - Programmatic SEO: `/groups-in-{city}` and `/{category}-groups` pages generated from `data.js` by a small script.
> - One guide a week aimed at "group + commercial" keywords, for example group trip to {destination}, venues for {n} people in {city}, and small business health insurance {state/province}.
> - Recruit 3–5 lead buyers per vertical and route leads by rules, moving FormSubmit to a Google Apps Script or Airtable webhook.
> - Weekly YouTube Shorts: group spotlights and organizer tips, embedded back into the guides.

## Phase 10: Scale (month 6+)
> - Move to Astro/Next.js with a headless CMS and a real database for listings, reviews, organizer accounts, "bump" boosts and verified badges.
> - Paid organizer tier: featured placement, analytics, sponsor matching.
> - A sponsorship marketplace (brands find groups by audience) with a revenue share.
> - Localization in FR, ES, HI, PT and AR, with hreflang.
