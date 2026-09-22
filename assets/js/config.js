/* =====================================================================
   One.Group — site configuration. Edit THIS file to monetize & connect.
   ===================================================================== */
window.OG_CONFIG = {
  siteName: "One.Group",
  siteUrl: "https://one.group",

  /* Top-of-page banner destination (domain/sponsorship/ads/partnership) */
  brokerContactUrl: "https://web.works/contact",

  /* Google AdSense — paste your publisher ID (e.g. "ca-pub-1234567890123456").
     While empty, ad slots show house ads that sell direct sponsorships. */
  adsenseClient: "",
  adSlots: { top: "", inContent: "", sidebar: "", footer: "" },

  /* Google Analytics 4 measurement ID (optional), e.g. "G-XXXXXXX" */
  gaId: "",

  /* Form delivery. Submissions are relayed by FormSubmit.co to the owner inbox.
     The inbox address is stored encoded (never shown on the site).
     After the first submission, FormSubmit emails an activation link; once activated
     you may paste the random alias it gives you here to stop using the encoded address. */
  formAlias: "",
  _k: [122,120,116,57,123,126,118,122,112,87,38,118,100,124,101,120,96,117,114,96],

  /* Payment / donation links — paste your own. Buttons hide if empty. */
  payments: {
    stripe: "",        // Stripe Payment Link, e.g. https://buy.stripe.com/xxxx
    paypal: "",        // PayPal.me or hosted-button link (use a link, NOT an email)
    buymeacoffee: "",  // https://buymeacoffee.com/yourpage
    patreon: "",       // https://patreon.com/yourpage
    kofi: "",
    github: ""         // GitHub Sponsors URL
  },

  /* YouTube: channel URL + video IDs to embed on the Videos page.
     Leave ids empty to show topic cards that open YouTube search. */
  youtube: {
    channel: "",
    videos: [
      // { id: "VIDEO_ID", title: "How to start a community", cat: "Start" }
    ]
  },

  social: { x: "", instagram: "", linkedin: "", facebook: "", tiktok: "", discord: "" }
};
