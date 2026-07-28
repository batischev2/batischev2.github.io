(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const themeKey = "vb-theme";
  const langKey = "vb-lang";
  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const langToggle = document.querySelector(".lang-toggle");
  const themeColorMeta = document.getElementById("theme-color-meta");
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogTitle = document.getElementById("og-title");
  const ogDescription = document.getElementById("og-description");
  const ogLocale = document.getElementById("og-locale");
  const ogImageAlt = document.getElementById("og-image-alt");
  const twitterTitle = document.getElementById("twitter-title");
  const twitterDescription = document.getElementById("twitter-description");
  const twitterImageAlt = document.getElementById("twitter-image-alt");

  const t = (lang, key) => I18N[lang]?.[key] ?? I18N.ru[key] ?? key;

  const applyI18n = (lang) => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(lang, key));
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      let ariaKey = key;
      if (key === "aria.theme") {
        ariaKey =
          root.getAttribute("data-theme") === "dark"
            ? "aria.themeToLight"
            : "aria.themeToDark";
      }
      el.setAttribute("aria-label", t(lang, ariaKey));
    });

    document.title = t(lang, "meta.title");
    metaDescription?.setAttribute("content", t(lang, "meta.description"));
    ogTitle?.setAttribute("content", t(lang, "meta.ogTitle"));
    ogDescription?.setAttribute("content", t(lang, "meta.ogDescription"));
    twitterTitle?.setAttribute("content", t(lang, "meta.ogTitle"));
    twitterDescription?.setAttribute("content", t(lang, "meta.ogDescription"));
    ogImageAlt?.setAttribute("content", t(lang, "meta.ogImageAlt"));
    twitterImageAlt?.setAttribute("content", t(lang, "meta.ogImageAlt"));
    ogLocale?.setAttribute("content", lang === "en" ? "en_US" : "ru_RU");
  };

  const syncThemeUi = (theme) => {
    const lang = root.getAttribute("data-lang") || "ru";
    const isDark = theme === "dark";
    themeToggle?.setAttribute(
      "aria-label",
      t(lang, isDark ? "aria.themeToLight" : "aria.themeToDark")
    );
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDark ? "#0B1214" : "#0B3D4A");
    }
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(themeKey, theme);
    syncThemeUi(theme);
  };

  const applyLang = (lang) => {
    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);
    localStorage.setItem(langKey, lang);
    applyI18n(lang);
    syncThemeUi(root.getAttribute("data-theme") || "light");

    const url = new URL(window.location.href);
    if (lang === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    window.history.replaceState({}, "", url);
  };

  const currentLang =
    root.getAttribute("data-lang") === "en" || root.getAttribute("lang") === "en"
      ? "en"
      : "ru";
  applyLang(currentLang);
  syncThemeUi(root.getAttribute("data-theme") || "light");

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  langToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-lang") === "en" ? "ru" : "en";
    applyLang(next);
  });

  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".menu-btn");
  const mobileNav = document.getElementById("mobile-nav");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  };

  menuBtn?.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = open;
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const revealTargets = document.querySelectorAll(
    ".section-head, .pain-list li, .service, .case, .steps li, .stack-grid li, .offer-panel, .faq-list details, .contact-link, .lead-form, .trust-item"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  const form = document.getElementById("lead-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const lang = root.getAttribute("data-lang") || "ru";
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const message = String(data.get("message") || "").trim();
    const body = `${t(lang, "form.mailName")}: ${name}\n${t(lang, "form.mailContact")}: ${contact}\n${t(lang, "form.mailTask")}: ${message}`;
    const mailto = `mailto:vitek.bithev97@gmail.com?subject=${encodeURIComponent(
      t(lang, "form.mailSubject") + name
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
})();
