(function () {
  const MEDIA_QUERY = "(min-width: 1536px)";
  const tocRoot = document.querySelector("[data-article-toc]");

  if (!tocRoot) {
    return;
  }

  const scrollContainer = tocRoot.querySelector("[data-toc-scroll]");
  const links = Array.from(tocRoot.querySelectorAll("a"));
  const media = window.matchMedia(MEDIA_QUERY);

  if (!(scrollContainer instanceof HTMLElement) || links.length === 0) {
    return;
  }

  const entries = links.map((link) => {
    const targetId = link.getAttribute("href") ? link.getAttribute("href").slice(1) : "";
    return {
      link,
      heading: targetId ? document.getElementById(targetId) : null,
    };
  });

  let lastActiveLink = null;
  let rafId = 0;

  function renderActiveLink() {
    if (!media.matches) {
      links.forEach((link) => link.removeAttribute("data-active"));
      lastActiveLink = null;
      return;
    }

    let candidate = null;

    for (const entry of entries) {
      if (!entry.heading) {
        continue;
      }

      const rect = entry.heading.getBoundingClientRect();
      if (rect.top <= 140) {
        candidate = entry.link;
      } else {
        break;
      }
    }

    const activeLink = candidate || entries.find((entry) => entry.heading)?.link;

    if (!activeLink) {
      return;
    }

    links.forEach((link) => {
      if (link === activeLink) {
        link.setAttribute("data-active", "true");
      } else {
        link.removeAttribute("data-active");
      }
    });

    if (activeLink !== lastActiveLink) {
      activeLink.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
      lastActiveLink = activeLink;
    }
  }

  function scheduleRender() {
    if (rafId) {
      return;
    }

    rafId = window.requestAnimationFrame(function () {
      rafId = 0;
      renderActiveLink();
    });
  }

  window.addEventListener("scroll", scheduleRender, { passive: true });
  window.addEventListener("hashchange", scheduleRender);
  media.addEventListener("change", scheduleRender);
  scheduleRender();
}());
