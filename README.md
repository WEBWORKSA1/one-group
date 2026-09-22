# One.Group — Find, start & grow any group

A static website built for the domain **one.group**. It is a hub for groups and communities that combines five parts:

- a directory of groups
- free tools for organizers
- guides and videos
- lead generation for group quotes: travel, events, insurance, team building and bulk buying
- contests, donations, careers and advertising pages

It has no dependencies and runs on the **GitHub Pages free plan**.

> Interested in this website or domain, or in sponsorship, advertising or partnership? → https://web.works/contact

## Structure

```
*.html                  pages (edit directly; copy any page to add a new one)
assets/css/style.css    design system (light and dark themes)
assets/js/config.js     ← all monetization settings and IDs (AdSense, payments, YouTube, GA)
assets/js/layout.js     shared header, nav and footer (edit once, applies to every page)
assets/js/data.js       directory categories and sample listings
assets/js/main.js       forms, wizards, directory, tools, ads, consent
scripts/sitemap.py      regenerates sitemap.xml after you add pages
BUILD-PROMPT.md         phase-by-phase build and growth prompt, plus the business case
RESEARCH.md             notes from the 30-site competitive review
```

The top contact bar (web.works/contact) is hard-coded at the top of every page, so it shows even without JavaScript.

## Forms

All forms send to the owner's inbox through FormSubmit. The inbox address is stored only in encoded form inside `config.js`, so it never appears on the site.

The **first submission sends an activation email**. Click it once, and all forms go live after that.

## Monetization checklist

1. **AdSense:** set `adsenseClient` and `adSlots` in `config.js`, and uncomment the line in `ads.txt`. Until then, the ad slots show house ads for sponsorship and quotes.
2. **Payments:** paste links for Stripe, PayPal, Buy Me a Coffee, Patreon, Ko-fi or GitHub Sponsors into `config.payments`.
3. **YouTube:** set `config.youtube.channel` and the list of `videos`.
4. **Analytics:** set `gaId`. It loads only after the visitor gives consent.

## Publish on GitHub Pages (free)

Go to **Settings → Pages → Build and deployment**, set **Source: Deploy from a branch**, choose **Branch: `main` / `(root)`** and click **Save**. The site goes live at https://webworksa1.github.io/One-Group/ within about a minute. Nothing needs to be built.

## Custom domain

Point the DNS for `one.group` at GitHub Pages:

- A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www` CNAME: `webworksa1.github.io`

Then go to **Settings → Pages → Custom domain**, enter `one.group`, and enable **Enforce HTTPS**.

## Legal

© 2026 One.Group. All rights reserved. One.Group is independent. It is not affiliated with any company using "ONE Group", "The ONE Group", "OneGroup" or similar names. See `legal.html`.
