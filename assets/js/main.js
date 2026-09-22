/* One.Group — main interactions (no dependencies) */
(function () {
  "use strict";
  const C = window.OG_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Theme ---------- */
  const savedTheme = store.get("og_theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store.set("og_theme", next);
  });

  /* ---------- Mobile menu ---------- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-menu]");
    if (!b) return;
    const nav = $(".nav-links");
    nav.classList.toggle("open");
    b.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  /* ---------- Toast ---------- */
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = "block";
    clearTimeout(t._h); t._h = setTimeout(() => (t.style.display = "none"), 3200);
  }
  window.ogToast = toast;

  /* ---------- Form delivery (inbox never exposed in markup) ---------- */
  function endpoint() {
    const id = C.formAlias || (C._k || []).slice().reverse().map(n => String.fromCharCode(n ^ 23)).join("");
    return "https://formsubmit.co/ajax/" + id;
  }
  async function sendForm(form) {
    const status = $(".form-status", form) || (() => { const d = document.createElement("div"); d.className = "form-status"; form.appendChild(d); return d; })();
    if (form.querySelector('[name="_honey"]')?.value) return; // bot
    const btn = form.querySelector('[type="submit"]');
    const fd = new FormData(form);
    const data = {};
    fd.forEach((v, k) => { data[k] = data[k] ? data[k] + ", " + v : v; });
    data._subject = "One.Group — " + (form.dataset.form || "Form") + " submission";
    data._template = "table";
    data._captcha = "false";
    data.page = location.href;
    data.submitted = new Date().toISOString();
    if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
    status.className = "form-status";
    try {
      const r = await fetch(endpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      status.className = "form-status ok";
      status.textContent = form.dataset.success || "Thank you! Your submission was received — we'll be in touch shortly.";
      form.reset();
      if (typeof gtag === "function") gtag("event", "generate_lead", { form: form.dataset.form });
      if (form.dataset.redirect) setTimeout(() => (location.href = form.dataset.redirect), 1400);
    } catch (err) {
      status.className = "form-status err";
      status.textContent = "Sorry, something went wrong. Please try again in a moment, or use the Contact page.";
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; }
    }
  }
  document.addEventListener("submit", e => {
    const f = e.target.closest("form[data-form]");
    if (!f) return;
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    sendForm(f);
  });
  // Add honeypot to every form automatically
  $$("form[data-form]").forEach(f => {
    if (!f.querySelector('[name="_honey"]')) {
      const h = document.createElement("input");
      h.type = "text"; h.name = "_honey"; h.tabIndex = -1; h.autocomplete = "off"; h.className = "hp"; h.setAttribute("aria-hidden", "true");
      f.appendChild(h);
    }
  });

  /* ---------- Ads: AdSense if configured, else house ads ---------- */
  const houseAds = [
    ["Reach engaged group organizers", "Sponsor this space — packages from $49", "advertise.html"],
    ["Planning a group trip or event?", "Get free, no-obligation group quotes", "quotes.html"],
    ["Love One.Group?", "Support the platform & fund member prizes", "support.html"],
    ["Run a community?", "List your group free and get discovered", "list-your-group.html"]
  ];
  function renderAds() {
    const slots = $$("[data-ad]");
    if (!slots.length) return;
    const consent = store.get("og_consent");
    if (C.adsenseClient && consent !== "essential") {
      const s = document.createElement("script");
      s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(C.adsenseClient);
      document.head.appendChild(s);
      slots.forEach(el => {
        const slot = (C.adSlots || {})[el.dataset.ad] || "";
        el.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + esc(C.adsenseClient) + '"' +
          (slot ? ' data-ad-slot="' + esc(slot) + '"' : "") + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    } else {
      slots.forEach((el, i) => {
        const a = houseAds[(i + (new Date().getDate())) % houseAds.length];
        el.innerHTML = '<span class="ad-label">Sponsored</span><a class="ad-inner" href="' + a[2] + '"><span><b>' + a[0] + '</b><br>' + a[1] + ' →</span></a>';
      });
    }
  }

  /* ---------- Analytics (optional) ---------- */
  function loadGA() {
    if (!C.gaId || store.get("og_consent") !== "all") return;
    const s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.gaId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", C.gaId, { anonymize_ip: true });
  }

  /* ---------- Cookie consent ---------- */
  function cookieBar() {
    if (store.get("og_consent")) return;
    const d = document.createElement("div");
    d.className = "cookie show";
    d.setAttribute("role", "dialog");
    d.innerHTML = '<b>Cookies & ads</b><p class="muted" style="margin:6px 0 12px">We use cookies for essential functions, analytics and to show ads (including Google AdSense) that keep One.Group free. See our <a href="privacy.html">Privacy & Cookie Policy</a>.</p><div class="list-inline"><button class="btn btn-primary btn-sm" data-c="all">Accept all</button><button class="btn btn-ghost btn-sm" data-c="essential">Essential only</button></div>';
    document.body.appendChild(d);
    d.addEventListener("click", e => {
      const b = e.target.closest("[data-c]"); if (!b) return;
      store.set("og_consent", b.dataset.c); d.remove(); loadGA();
    });
  }

  /* ---------- Reveal + counters ---------- */
  function reveal() {
    const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); count(en.target); }
    }), { threshold: .12 }) : null;
    $$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));
    $$("[data-count]").forEach(el => io ? io.observe(el) : count(el));
  }
  function count(el) {
    const els = el.matches("[data-count]") ? [el] : $$("[data-count]", el);
    els.forEach(n => {
      if (n._done) return; n._done = 1;
      const end = +n.dataset.count, suf = n.dataset.suffix || "", t0 = performance.now();
      const step = t => { const p = Math.min(1, (t - t0) / 1400); n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  /* ---------- Directory ---------- */
  function cat(k) { return (window.OG_CATEGORIES || []).find(c => c.k === k) || { n: k, i: "👥", c: "#5b3df5" }; }
  function groupCard(g) {
    const c = cat(g.cat);
    return '<article class="card group-card reveal in">' +
      '<div class="cover" style="background:linear-gradient(135deg,' + c.c + ',#15142b)">' + c.i + '</div>' +
      '<div>' + (g.verified ? '<span class="badge ok">✔ Verified</span>' : "") + '<span class="badge brand">' + esc(g.platform) + '</span><span class="badge">' + esc(g.price) + '</span></div>' +
      '<h3>' + esc(g.name) + '</h3><p class="muted" style="margin:0">' + esc(g.desc) + '</p>' +
      '<div class="meta"><span>👥 ' + g.members.toLocaleString() + '</span><span>📍 ' + esc(g.city) + (g.city === "Online" ? "" : ", " + esc(g.country)) + '</span><span>⚡ ' + esc(g.active) + '</span><span>🗣 ' + esc(g.lang) + '</span></div>' +
      '<div class="foot"><span class="badge">' + c.i + " " + esc(c.n) + '</span><a class="btn btn-sm btn-primary" href="contact.html?topic=join&group=' + encodeURIComponent(g.name) + '">Request to join</a></div></article>';
  }
  window.ogGroupCard = groupCard;

  function directory() {
    const wrap = $("#dir-results"); if (!wrap) return;
    const G = window.OG_GROUPS || [];
    const q = new URLSearchParams(location.search);
    const f = { q: q.get("q") || "", cat: q.get("cat") || "", where: q.get("where") || "", platform: "", price: "", verified: false, sort: "members" };
    $("#f-q").value = f.q; $("#f-where").value = f.where;
    const catSel = $("#f-cat");
    (window.OG_CATEGORIES || []).forEach(c => catSel.insertAdjacentHTML("beforeend", '<option value="' + c.k + '">' + c.i + " " + c.n + "</option>"));
    catSel.value = f.cat;
    const plats = [...new Set(G.map(g => g.platform))].sort();
    plats.forEach(p => $("#f-platform").insertAdjacentHTML("beforeend", "<option>" + esc(p) + "</option>"));
    function run() {
      f.q = $("#f-q").value.trim().toLowerCase(); f.where = $("#f-where").value.trim().toLowerCase();
      f.cat = catSel.value; f.platform = $("#f-platform").value; f.price = $("#f-price").value;
      f.verified = $("#f-verified").checked; f.sort = $("#f-sort").value;
      let r = G.filter(g =>
        (!f.q || (g.name + " " + g.desc + " " + cat(g.cat).n).toLowerCase().includes(f.q)) &&
        (!f.where || (g.city + " " + g.country).toLowerCase().includes(f.where)) &&
        (!f.cat || g.cat === f.cat) && (!f.platform || g.platform === f.platform) &&
        (!f.price || (f.price === "free" ? g.price === "Free" : g.price !== "Free")) &&
        (!f.verified || g.verified));
      r.sort((a, b) => f.sort === "name" ? a.name.localeCompare(b.name) : f.sort === "new" ? b.id - a.id : b.members - a.members);
      $("#dir-count").textContent = r.length + " group" + (r.length === 1 ? "" : "s") + " found";
      wrap.innerHTML = r.length ? r.map(groupCard).join("") :
        '<div class="card center" style="grid-column:1/-1"><h3>No groups match yet</h3><p class="muted">Be the first — list a group or ask us to find one for you.</p><a class="btn btn-primary" href="list-your-group.html">List a group free</a></div>';
    }
    $$("#filters input, #filters select").forEach(el => el.addEventListener("input", run));
    $("#f-reset").addEventListener("click", () => { $("#filters").reset(); setTimeout(run, 0); });
    run();
  }

  function featured() {
    const el = $("#featured-groups"); if (!el) return;
    el.innerHTML = (window.OG_GROUPS || []).filter(g => g.verified).sort((a, b) => b.members - a.members).slice(0, 6).map(groupCard).join("");
  }
  function catGrid() {
    const el = $("#cat-grid"); if (!el) return;
    el.innerHTML = (window.OG_CATEGORIES || []).map(c =>
      '<a class="card center" href="groups.html?cat=' + c.k + '" style="padding:18px"><div class="ico" style="margin:0 auto 8px;background:' + c.c + '22">' + c.i + '</div><b style="color:var(--text)">' + c.n + '</b></a>').join("");
  }

  /* ---------- Multi-step wizards ---------- */
  function wizards() {
    $$("[data-wizard]").forEach(w => {
      const steps = $$(".wstep", w), bar = $(".progress span", w), lab = $("[data-step-label]", w);
      let i = 0;
      function show(n) {
        i = Math.max(0, Math.min(steps.length - 1, n));
        steps.forEach((s, k) => s.classList.toggle("active", k === i));
        if (bar) bar.style.width = ((i + 1) / steps.length * 100) + "%";
        if (lab) lab.textContent = "Step " + (i + 1) + " of " + steps.length;
        $$("[data-prev]", w).forEach(b => (b.style.visibility = i ? "visible" : "hidden"));
      }
      w.addEventListener("click", e => {
        if (e.target.closest("[data-next]")) {
          e.preventDefault();
          const req = $$("input,select,textarea", steps[i]).filter(x => !x.checkValidity());
          if (req.length) { req[0].reportValidity(); return; }
          show(i + 1);
          w.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (e.target.closest("[data-prev]")) { e.preventDefault(); show(i - 1); }
      });
      w.addEventListener("reset", () => setTimeout(() => show(0), 0));
      show(0);
    });
    // Quote tabs
    const tabs = $$("[data-qtab]");
    if (tabs.length) {
      const sel = t => {
        tabs.forEach(x => x.classList.toggle("active", x === t));
        $$("[data-qpanel]").forEach(p => (p.hidden = p.dataset.qpanel !== t.dataset.qtab));
        history.replaceState(null, "", "#" + t.dataset.qtab);
      };
      tabs.forEach(t => t.addEventListener("click", () => sel(t)));
      const h = location.hash.slice(1);
      sel(tabs.find(t => t.dataset.qtab === h) || tabs[0]);
    }
  }

  /* ---------- Prefill from query string ---------- */
  function prefill() {
    const q = new URLSearchParams(location.search);
    q.forEach((v, k) => { const el = document.querySelector('form [name="' + CSS.escape(k) + '"]'); if (el && !el.value) el.value = v; });
  }

  /* ---------- Donations ---------- */
  function donations() {
    const box = $("#donate-box"); if (!box) return;
    const amt = $("#don-amount");
    $$(".amounts .chip", box).forEach(b => b.addEventListener("click", () => {
      $$(".amounts .chip", box).forEach(x => x.classList.remove("active")); b.classList.add("active");
      amt.value = b.dataset.v; amt.dispatchEvent(new Event("input"));
    }));
    const P = C.payments || {};
    const map = { stripe: "💳 Pay with card (Stripe)", paypal: "🅿️ PayPal", buymeacoffee: "☕ Buy Me a Coffee", patreon: "🔁 Monthly on Patreon", kofi: "💙 Ko-fi", github: "🐙 GitHub Sponsors" };
    const wrap = $("#pay-links");
    const live = Object.keys(map).filter(k => P[k]);
    wrap.innerHTML = live.length ? live.map(k => '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + esc(P[k]) + '">' + map[k] + "</a>").join("") :
      '<p class="form-note">Instant online payment links are being set up. Submit a pledge below and we will send you a secure payment link within 24 hours.</p>';
  }

  /* ---------- Videos ---------- */
  function videos() {
    const el = $("#video-grid"); if (!el) return;
    const Y = C.youtube || {};
    const topics = [
      ["How to start a community from zero", "Start"], ["Growing a Discord server", "Grow"], ["Running great meetups", "Events"],
      ["Community monetization strategies", "Monetize"], ["Group travel planning tips", "Travel"], ["Team building activities", "Teams"],
      ["Moderation best practices", "Safety"], ["Fundraising for clubs", "Fundraise"], ["Icebreaker games for groups", "Events"]
    ];
    const list = (Y.videos && Y.videos.length) ? Y.videos : topics.map(t => ({ title: t[0], cat: t[1] }));
    el.innerHTML = list.map(v => '<div class="card" style="padding:12px"><div class="video" data-yt="' + esc(v.id || "") + '" data-q="' + esc(v.title) + '" style="background:linear-gradient(135deg,#15142b,#5b3df5)"><div class="video-face"><div><div class="play">▶</div><b>' + esc(v.title) + '</b></div></div></div><div style="padding:10px 4px 0"><span class="badge brand">' + esc(v.cat || "Video") + '</span></div></div>').join("");
    el.addEventListener("click", e => {
      const v = e.target.closest(".video"); if (!v) return;
      if (v.dataset.yt) v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.dataset.yt) + '?autoplay=1&rel=0" title="' + esc(v.dataset.q) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
      else window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(v.dataset.q), "_blank", "noopener");
    });
    const ch = $("#yt-channel"); if (ch && Y.channel) { ch.href = Y.channel; ch.hidden = false; }
  }

  /* ---------- Tools ---------- */
  function tools() {
    // Expense splitter
    const sp = $("#tool-split");
    if (sp) {
      const run = () => {
        const total = +$("#sp-total").value || 0, n = Math.max(1, +$("#sp-people").value || 1), tip = +$("#sp-tip").value || 0;
        const t = total * (1 + tip / 100);
        $("#sp-out").innerHTML = "Total with tip: <b>" + t.toFixed(2) + "</b> · Each person pays: <b>" + (t / n).toFixed(2) + "</b>";
      };
      $$("input", sp).forEach(i => i.addEventListener("input", run)); run();
    }
    // Event budget
    const eb = $("#tool-budget");
    if (eb) {
      const run = () => {
        const g = +$("#eb-guests").value || 0, v = +$("#eb-venue").value || 0, f = +$("#eb-food").value || 0, x = +$("#eb-extra").value || 0, b = +$("#eb-buffer").value || 0;
        const sub = v + g * f + x, tot = sub * (1 + b / 100);
        $("#eb-out").innerHTML = "Estimated total: <b>" + tot.toFixed(0) + "</b> · Cost per guest: <b>" + (g ? (tot / g).toFixed(2) : "0") + "</b><br><span class='form-note'>Includes " + b + "% contingency. Want real prices? <a href='quotes.html#events'>Get venue quotes</a>.</span>";
      };
      $$("input", eb).forEach(i => i.addEventListener("input", run)); run();
    }
    // Membership revenue
    const mr = $("#tool-rev");
    if (mr) {
      const run = () => {
        const m = +$("#mr-members").value || 0, p = +$("#mr-price").value || 0, c = +$("#mr-conv").value || 0, fee = +$("#mr-fee").value || 0;
        const paying = Math.round(m * c / 100), mo = paying * p * (1 - fee / 100);
        $("#mr-out").innerHTML = "Paying members: <b>" + paying.toLocaleString() + "</b> · Monthly: <b>" + mo.toLocaleString(undefined, { maximumFractionDigits: 0 }) + "</b> · Yearly: <b>" + (mo * 12).toLocaleString(undefined, { maximumFractionDigits: 0 }) + "</b>";
      };
      $$("input", mr).forEach(i => i.addEventListener("input", run)); run();
    }
    // Name generator
    const ng = $("#tool-name");
    if (ng) {
      const pre = ["The", "United", "Bold", "Bright", "North", "True", "Open", "Rising", "Kindred", "Wild", "Urban", "Golden"];
      const mid = ["Circle", "Collective", "Crew", "Society", "Guild", "Tribe", "League", "Club", "Hub", "Alliance", "Network", "Lab"];
      $("#ng-go").addEventListener("click", () => {
        const kw = ($("#ng-kw").value || "Makers").trim().replace(/\b\w/g, c => c.toUpperCase());
        const r = a => a[Math.floor(Math.random() * a.length)];
        const out = new Set(); while (out.size < 8) out.add([r(pre) + " " + kw + " " + r(mid), kw + " " + r(mid), r(pre) + " " + r(mid) + " of " + kw, kw + " " + r(["Together", "Society", "United", "Nation", "Squad"])][Math.floor(Math.random() * 4)]);
        $("#ng-out").innerHTML = [...out].map(n => '<span class="chip">' + esc(n) + "</span>").join("");
      });
      $("#ng-go").click();
    }
    // Team picker
    const tp = $("#tool-teams");
    if (tp) {
      $("#tp-go").addEventListener("click", () => {
        const names = $("#tp-names").value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        const k = Math.max(2, +$("#tp-n").value || 2);
        for (let i = names.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[names[i], names[j]] = [names[j], names[i]]; }
        const teams = Array.from({ length: k }, () => []); names.forEach((n, i) => teams[i % k].push(n));
        $("#tp-out").innerHTML = teams.map((t, i) => "<div><b>Team " + (i + 1) + ":</b> " + (t.map(esc).join(", ") || "—") + "</div>").join("");
      });
    }
    // Quick poll
    const qp = $("#tool-poll");
    if (qp) {
      const votes = {};
      $("#qp-build").addEventListener("click", () => {
        const opts = $("#qp-opts").value.split(/\n+/).map(s => s.trim()).filter(Boolean);
        const out = $("#qp-out"); out.innerHTML = "<b>" + esc($("#qp-q").value || "Your question") + "</b>";
        opts.forEach(o => { votes[o] = 0; out.insertAdjacentHTML("beforeend", '<button class="chip" style="display:block;width:100%;text-align:left;margin-top:8px" data-o="' + esc(o) + '">' + esc(o) + ' — <span>0</span></button>'); });
      });
      $("#qp-out").addEventListener("click", e => { const b = e.target.closest("[data-o]"); if (!b) return; b.querySelector("span").textContent = ++votes[b.dataset.o]; });
    }
  }

  /* ---------- Hero search ---------- */
  function heroSearch() {
    const f = $("#hero-search"); if (!f) return;
    f.addEventListener("submit", e => {
      e.preventDefault();
      const p = new URLSearchParams({ q: $("#hs-q").value, where: $("#hs-where").value });
      location.href = "groups.html?" + p.toString();
    });
  }

  /* ---------- Share buttons ---------- */
  document.addEventListener("click", e => {
    const s = e.target.closest("[data-share]"); if (!s) return;
    e.preventDefault();
    const url = location.href, title = document.title;
    if (navigator.share) navigator.share({ title, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).then(() => toast("Link copied — share it with your group!"));
  });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(y => (y.textContent = new Date().getFullYear()));
  // Broker banner link from config (static fallback already in markup)
  $$("[data-broker]").forEach(a => { if (C.brokerContactUrl) a.href = C.brokerContactUrl; });

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
  function init() {
    if (init.done) return; init.done = 1;
    renderAds(); cookieBar(); loadGA(); reveal(); directory(); featured(); catGrid(); wizards(); prefill(); donations(); videos(); tools(); heroSearch();
  }
})();
