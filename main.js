(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

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
    ".section-head, .pain-list li, .service, .steps li, .stack-grid li, .offer-panel, .faq-list details, .contact-link, .lead-form, .trust-item"
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
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const message = String(data.get("message") || "").trim();
    const body = `Имя: ${name}\nКонтакт: ${contact}\nЗадача: ${message}`;
    const mailto = `mailto:vitek.batishev97@gmail.com?subject=${encodeURIComponent(
      "Заявка с сайта — " + name
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
})();
