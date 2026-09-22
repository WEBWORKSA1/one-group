/* One.Group — shared header & footer. Edit once; applies to every page.
   (The top "Contact, if you are interested…" bar is hard-coded in each page's HTML.) */
(function () {
  var NAV = [
    ["groups", "groups.html", "Find Groups"], ["quotes", "quotes.html", "Group Quotes"],
    ["tools", "tools.html", "Tools"], ["guides", "guides.html", "Guides"], ["videos", "videos.html", "Videos"],
    ["contests", "contests.html", "Contests"], ["support", "support.html", "Support Us"], ["advertise", "advertise.html", "Advertise"]
  ];
  var cur = document.body.getAttribute("data-nav") || "";
  var nav = NAV.map(function (n) {
    return '<li><a href="' + n[1] + '"' + (n[0] === cur ? ' aria-current="page"' : "") + ">" + n[2] + "</a></li>";
  }).join("");
  var logo = '<span class="logo-mark">1</span><span>One<span class="dot">.</span>Group</span>';

  var H = `<header class="site-header">
  <div class="container nav">
    <a class="logo" href="index.html" aria-label="One.Group home">${logo}</a>
    <ul class="nav-links" id="nav">${nav}</ul>
    <div class="nav-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode">🌓</button>
      <a class="btn btn-primary btn-sm btn-sm-hide" href="list-your-group.html">+ List a Group</a>
      <button class="icon-btn menu-btn" data-menu aria-controls="nav" aria-expanded="false" aria-label="Menu">☰</button>
    </div>
  </div>
</header>`;

  var F = `<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <a class="logo" href="index.html" style="color:#fff">${logo}</a>
        <p style="margin-top:14px;font-size:.92rem">One place to find, start and grow any group — communities, clubs, teams, trips and events. Free for members and organizers.</p>
        <form class="newsletter" data-form="Newsletter" data-success="You're subscribed! Watch your inbox for the Organizer Weekly.">
          <input type="email" name="email" placeholder="Your email" required aria-label="Email for newsletter">
          <input type="hidden" name="source" value="footer">
          <button class="btn btn-primary btn-sm" type="submit">Join</button>
          <div class="form-status"></div>
        </form>
      </div>
      <div><h4>Members</h4><ul>
        <li><a href="groups.html">Find a group</a></li><li><a href="groups.html?where=online">Online communities</a></li>
        <li><a href="contests.html">Contests &amp; prizes</a></li><li><a href="videos.html">Videos</a></li><li><a href="trust-safety.html">Trust &amp; Safety</a></li></ul></div>
      <div><h4>Organizers</h4><ul>
        <li><a href="list-your-group.html">List your group</a></li><li><a href="tools.html">Free organizer tools</a></li>
        <li><a href="guides.html">Guides</a></li><li><a href="quotes.html">Group quotes</a></li><li><a href="faq.html">FAQ</a></li></ul></div>
      <div><h4>Business</h4><ul>
        <li><a href="advertise.html">Advertise &amp; sponsor</a></li><li><a href="advertise.html#partners">Become a quote partner</a></li>
        <li><a href="careers.html">Careers &amp; talent</a></li><li><a href="support.html">Donate / support</a></li><li><a href="https://web.works/contact" target="_blank" rel="noopener">Acquire this domain</a></li></ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li><li><a href="privacy.html">Privacy &amp; Cookies</a></li>
        <li><a href="terms.html">Terms of Use</a></li><li><a href="legal.html">Trademark &amp; Copyright</a></li></ul></div>
    </div>
    <div class="foot-bottom">
      <span>© <span data-year>2026</span> One.Group. All rights reserved. One.Group is an independent website and is not affiliated with, endorsed by, or connected to any company using the names "ONE Group", "The ONE Group" or similar. <a href="legal.html">Disclosure</a>.</span>
      <span><a href="sitemap.xml">Sitemap</a> · <a href="legal.html#affiliate">Affiliate disclosure</a></span>
    </div>
  </div>
</footer>
<div class="sticky-cta"><a class="btn btn-ghost btn-sm" href="groups.html">Find groups</a><a class="btn btn-primary btn-sm" href="quotes.html">Free group quote</a></div>`;

  var h = document.getElementById("og-header"); if (h) h.outerHTML = H;
  var f = document.getElementById("og-footer"); if (f) f.outerHTML = F;
})();
