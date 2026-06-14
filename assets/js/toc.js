(function () {
  const MEDIA_QUERY = "(min-width: 1024px)";
  const SCROLL_THRESHOLD = 200;
  const ARTICLE_IMAGE_SELECTOR = ".markdown img";
  const HASH_REALIGN_WINDOW = 3000;
  const tocRoot = document.querySelector("[data-article-toc]");

  if (!tocRoot) {
    return;
  }

  const scrollContainer = tocRoot.querySelector("[data-toc-scroll]");
  const links = Array.from(tocRoot.querySelectorAll("a"));
  const media = window.matchMedia(MEDIA_QUERY);
  const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!(scrollContainer instanceof HTMLElement) || links.length === 0) {
    return;
  }

  function updateTocVisibility() {
    if (!media.matches) {
      tocRoot.classList.remove("is-visible");
      return;
    }

    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    tocRoot.classList.toggle("is-visible", scrolled);
  }

  function decodeHashFragment(value) {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  }

  function getTargetId(hash) {
    if (!hash || hash.charAt(0) !== "#") {
      return "";
    }

    return decodeHashFragment(hash.slice(1));
  }

  const entries = links.map((link) => {
    const hash = link.getAttribute("href") || "";
    const targetId = getTargetId(hash);
    return {
      link,
      hash,
      targetId,
      heading: targetId ? document.getElementById(targetId) : null,
    };
  });

  let lastActiveLink = null;
  let rafId = 0;
  let alignRafId = 0;
  let hashSyncToken = 0;
  let hashRealignDeadline = 0;

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

  function getHeadingScrollOffset(heading) {
    const scrollMarginTop = Number.parseFloat(window.getComputedStyle(heading).scrollMarginTop);

    if (!Number.isFinite(scrollMarginTop)) {
      return 0;
    }

    return scrollMarginTop;
  }

  function scrollWindowTo(top, smooth) {
    const nextTop = Math.max(0, Math.round(top));

    if (smooth) {
      window.scrollTo({
        top: nextTop,
        behavior: "smooth",
      });
      return;
    }

    window.scrollTo(0, nextTop);
  }

  function alignHeading(heading, smooth) {
    if (!(heading instanceof HTMLElement)) {
      return;
    }

    const top = window.scrollY + heading.getBoundingClientRect().top - getHeadingScrollOffset(heading);
    scrollWindowTo(top, smooth);
  }

  function scheduleHeadingAlignment(heading, smooth) {
    if (alignRafId) {
      window.cancelAnimationFrame(alignRafId);
    }

    alignRafId = window.requestAnimationFrame(function () {
      alignRafId = 0;
      alignHeading(heading, smooth);
    });
  }

  function isImageBeforeHeading(image, heading) {
    return Boolean(image.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  function watchPendingImages(heading, token) {
    const pendingImages = Array.from(document.querySelectorAll(ARTICLE_IMAGE_SELECTOR)).filter((image) => {
      return image instanceof HTMLImageElement && !image.complete && isImageBeforeHeading(image, heading);
    });

    if (pendingImages.length === 0) {
      hashRealignDeadline = 0;
      return;
    }

    hashRealignDeadline = Date.now() + HASH_REALIGN_WINDOW;

    pendingImages.forEach((image) => {
      const realign = function () {
        if (token !== hashSyncToken || Date.now() > hashRealignDeadline) {
          return;
        }

        scheduleHeadingAlignment(heading, false);
      };

      image.addEventListener("load", realign, { once: true });
      image.addEventListener("error", realign, { once: true });
    });
  }

  function syncHashTarget(targetId, smooth) {
    const heading = targetId ? document.getElementById(targetId) : null;
    const token = hashSyncToken + 1;

    hashSyncToken = token;

    if (!(heading instanceof HTMLElement)) {
      hashRealignDeadline = 0;
      return;
    }

    scheduleHeadingAlignment(heading, smooth);
    watchPendingImages(heading, token);
  }

  function updateHash(hash) {
    if (!hash) {
      return;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.hash = hash;

    if (nextUrl.hash === window.location.hash) {
      return;
    }

    window.history.pushState(null, "", nextUrl);
  }

  function scheduleRender() {
    if (rafId) {
      return;
    }

    rafId = window.requestAnimationFrame(function () {
      rafId = 0;
      updateTocVisibility();
      renderActiveLink();
    });
  }

  function handleTocClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest("a");
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    const entry = entries.find((item) => item.link === link);
    if (!entry || !(entry.heading instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    updateHash(entry.hash);
    syncHashTarget(entry.targetId, !reducedMotionMedia.matches);
    scheduleRender();
  }

  function handleHashNavigation() {
    syncHashTarget(getTargetId(window.location.hash), false);
    scheduleRender();
  }

  tocRoot.addEventListener("click", handleTocClick);
  window.addEventListener("scroll", scheduleRender, { passive: true });
  window.addEventListener("hashchange", handleHashNavigation);
  window.addEventListener("load", handleHashNavigation, { once: true });
  media.addEventListener("change", function () {
    updateTocVisibility();
    scheduleRender();
  });

  if (window.location.hash) {
    handleHashNavigation();
  }

  updateTocVisibility();
  scheduleRender();
}());
