(() => {
  const MARKDOWN_SELECTOR = ".markdown";
  const IMAGE_SELECTOR = `${MARKDOWN_SELECTOR} img`;
  const ZOOMABLE_IMAGE_SELECTOR = `${IMAGE_SELECTOR}.is-zoomable`;
  const HEADING_SELECTOR = `${MARKDOWN_SELECTOR} h1[id], ${MARKDOWN_SELECTOR} h2[id], ${MARKDOWN_SELECTOR} h3[id], ${MARKDOWN_SELECTOR} h4[id], ${MARKDOWN_SELECTOR} h5[id], ${MARKDOWN_SELECTOR} h6[id]`;
  const HEADING_ANCHOR_SELECTOR = "[data-heading-anchor-link]";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const FOOTNOTE_REF_SELECTOR = `${MARKDOWN_SELECTOR} a.footnote-ref`;
  const FOOTNOTE_DESKTOP_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
  const FOOTNOTE_MOBILE_OPEN_CLASS = "footnote-preview-mobile-open";
  const FOOTNOTE_HIDE_DELAY = 140;
  const FOOTNOTE_MOBILE_CLOSE_DURATION = 280;
  const FIGURE_SELECTOR = 'figure[data-rehype-pretty-code-figure]';
  const BUTTON_SELECTOR = "[data-code-copy-button]";
  const MIN_ZOOMABLE_IMAGE_SIZE = 64;
  const RESET_DELAY = 1800;
  const footnoteDesktopMedia = window.matchMedia(FOOTNOTE_DESKTOP_MEDIA_QUERY);
  const resetTimers = new WeakMap();

  let initialized = false;
  let activeImage = null;
  let activePlaceholder = null;
  let footnoteLayer = null;
  let footnoteOverlay = null;
  let footnoteCard = null;
  let footnoteLabel = null;
  let footnoteContent = null;
  let footnoteCloseButton = null;
  let activeFootnoteRef = null;
  let footnoteHideTimer = 0;
  let footnoteCloseTimer = 0;
  let previousBodyPaddingRight = null;

  function getButtonLabel(state) {
    if (state === "success") {
      return "复制成功";
    }

    if (state === "error") {
      return "复制失败";
    }

    return "复制代码";
  }

  function setButtonState(button, state) {
    button.dataset.copyState = state;
    const label = getButtonLabel(state);
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  }

  function scheduleReset(button) {
    const activeTimer = resetTimers.get(button);
    if (activeTimer) {
      window.clearTimeout(activeTimer);
    }

    const timerId = window.setTimeout(() => {
      setButtonState(button, "idle");
      resetTimers.delete(button);
    }, RESET_DELAY);

    resetTimers.set(button, timerId);
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";

    document.body.append(textarea);
    textarea.select();

    try {
      if (typeof document.execCommand !== "function" || !document.execCommand("copy")) {
        throw new Error("document.execCommand(copy) returned false");
      }
    } finally {
      textarea.remove();
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return;
    }

    fallbackCopyText(text);
  }

  function extractCodeText(container) {
    const code =
      container.querySelector("pre code") ||
      container.querySelector("code") ||
      container.querySelector("pre") ||
      container;

    if (!(code instanceof HTMLElement)) {
      return "";
    }

    const lines = Array.from(code.querySelectorAll("[data-line]"));
    if (lines.length > 0) {
      return lines.map((line) => line.textContent || "").join("\n");
    }

    return code.textContent || "";
  }

  function createCopyButton() {
    const button = document.createElement("button");
    const icon = document.createElement("span");

    button.type = "button";
    button.className = "code-copy-button";
    button.dataset.codeCopyButton = "true";
    icon.className = "code-copy-icon";
    icon.dataset.codeCopyIcon = "true";
    icon.setAttribute("aria-hidden", "true");

    button.append(icon);
    setButtonState(button, "idle");
    return button;
  }

  function installFigureButton(figure) {
    if (!(figure instanceof HTMLElement)) {
      return;
    }

    const title = figure.querySelector("figcaption[data-rehype-pretty-code-title]");
    const pre = figure.querySelector("pre");
    if (!(pre instanceof HTMLElement) || pre.querySelector(BUTTON_SELECTOR)) {
      return;
    }

    pre.dataset.copyToolbar = title ? "titled" : "untitled";
    pre.append(createCopyButton());
  }

  function installPreButton(pre) {
    if (!(pre instanceof HTMLElement) || pre.querySelector(BUTTON_SELECTOR)) {
      return;
    }

    if (pre.closest(FIGURE_SELECTOR)) {
      return;
    }

    pre.dataset.copyToolbar = "plain";
    pre.append(createCopyButton());
  }

  function installCopyButtons() {
    document.querySelectorAll(`${MARKDOWN_SELECTOR} ${FIGURE_SELECTOR}`).forEach((figure) => {
      installFigureButton(figure);
    });

    document.querySelectorAll(`${MARKDOWN_SELECTOR} pre:not([hidden])`).forEach((pre) => {
      installPreButton(pre);
    });
  }

  function createHeadingAnchorLink(heading) {
    const id = heading.getAttribute("id");
    if (!id) {
      return null;
    }

    const link = document.createElement("a");
    const icon = document.createElementNS(SVG_NAMESPACE, "svg");
    const path = document.createElementNS(SVG_NAMESPACE, "path");
    const label = heading.textContent ? heading.textContent.trim() : id;

    link.className = "heading-anchor-link";
    link.href = `#${id}`;
    link.draggable = false;
    link.dataset.headingAnchorLink = "true";
    link.setAttribute("aria-label", `跳转到标题：${label}`);
    link.setAttribute("title", "跳转到这个标题");
    icon.classList.add("heading-anchor-icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("fill", "none");
    icon.setAttribute("stroke", "currentColor");
    icon.setAttribute("stroke-width", "2");
    icon.setAttribute("stroke-linecap", "round");
    icon.setAttribute("stroke-linejoin", "round");
    icon.setAttribute("aria-hidden", "true");
    path.setAttribute(
      "d",
      "M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"
    );
    icon.append(path);
    link.append(icon);
    return link;
  }

  function installHeadingAnchors() {
    document.querySelectorAll(HEADING_SELECTOR).forEach((heading) => {
      if (!(heading instanceof HTMLElement) || heading.dataset.headingAnchorBound === "true") {
        return;
      }

      if (heading.querySelector(HEADING_ANCHOR_SELECTOR)) {
        heading.dataset.headingAnchorBound = "true";
        return;
      }

      const anchor = createHeadingAnchorLink(heading);
      if (!anchor) {
        return;
      }

      const content = document.createElement("span");
      content.className = "heading-anchor-text";

      while (heading.firstChild) {
        content.append(heading.firstChild);
      }

      heading.dataset.headingAnchorBound = "true";
      heading.append(content, anchor);
    });
  }

  async function handleCopyButtonClick(event) {
    const button = event.target instanceof Element ? event.target.closest(BUTTON_SELECTOR) : null;
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const container = button.closest(`${FIGURE_SELECTOR}, pre`);
    if (!(container instanceof HTMLElement)) {
      return;
    }

    const codeText = extractCodeText(container);

    try {
      await copyText(codeText);
      setButtonState(button, "success");
    } catch (error) {
      console.error("Failed to copy code block:", error);
      setButtonState(button, "error");
    }

    scheduleReset(button);
  }

  function getImageDimension(...dimensions) {
    const positiveDimensions = dimensions.filter((dimension) => {
      return Number.isFinite(dimension) && dimension > 0;
    });

    if (positiveDimensions.length === 0) {
      return 0;
    }

    return Math.min(...positiveDimensions);
  }

  function isSmallImage(image) {
    const rect = image.getBoundingClientRect();
    const width = getImageDimension(rect.width, image.width, image.naturalWidth);
    const height = getImageDimension(rect.height, image.height, image.naturalHeight);

    return !width || !height || width < MIN_ZOOMABLE_IMAGE_SIZE || height < MIN_ZOOMABLE_IMAGE_SIZE;
  }

  function shouldZoomImage(image) {
    if (!(image instanceof HTMLImageElement)) {
      return false;
    }

    if (!image.closest(MARKDOWN_SELECTOR)) {
      return false;
    }

    if (image.closest(FIGURE_SELECTOR) || image.closest("a")) {
      return false;
    }

    if (image.getAttribute("role") === "presentation" || image.getAttribute("aria-hidden") === "true") {
      return false;
    }

    if (isSmallImage(image)) {
      return false;
    }

    return true;
  }

  function syncZoomableImage(image) {
    if (!(image instanceof HTMLImageElement)) {
      return;
    }

    image.classList.toggle("is-zoomable", shouldZoomImage(image));
  }

  function bindZoomableImage(image) {
    if (!(image instanceof HTMLImageElement) || image.dataset.imageZoomBound === "true") {
      return;
    }

    image.dataset.imageZoomBound = "true";
    image.addEventListener("load", () => {
      syncZoomableImage(image);
    });
    image.addEventListener("error", () => {
      image.classList.remove("is-zoomable");
    });
  }

  function installZoomableImages() {
    document.querySelectorAll(IMAGE_SELECTOR).forEach((image) => {
      bindZoomableImage(image);
      syncZoomableImage(image);
    });
  }

  function lockBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyStyle = window.getComputedStyle(document.body);
    const currentPaddingRight = Number.parseFloat(bodyStyle.paddingRight) || 0;

    previousBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.paddingRight = `${currentPaddingRight + Math.max(0, scrollbarWidth)}px`;
    document.body.classList.add("image-zoom-active");
  }

  function unlockBodyScroll() {
    if (previousBodyPaddingRight === null) {
      document.body.style.removeProperty("padding-right");
    } else {
      document.body.style.paddingRight = previousBodyPaddingRight;
    }

    previousBodyPaddingRight = null;
    document.body.classList.remove("image-zoom-active");
  }

  function cleanupZoom() {
    if (activeImage) {
      activeImage.classList.remove("is-zoomed");
      activeImage.style.removeProperty("--image-zoom-width");
      activeImage.style.removeProperty("--image-zoom-height");
      activeImage = null;
    }

    if (activePlaceholder) {
      activePlaceholder.remove();
      activePlaceholder = null;
    }

    unlockBodyScroll();
  }

  function createFlowPlaceholder(image) {
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const styles = window.getComputedStyle(image);
    const placeholder = document.createElement("span");
    const display = styles.display === "inline" ? "inline-block" : styles.display;

    placeholder.setAttribute("aria-hidden", "true");
    placeholder.className = "image-zoom-placeholder";
    placeholder.style.display = display;
    placeholder.style.width = `${Math.round(rect.width)}px`;
    placeholder.style.height = `${Math.round(rect.height)}px`;
    placeholder.style.marginTop = styles.marginTop;
    placeholder.style.marginRight = styles.marginRight;
    placeholder.style.marginBottom = styles.marginBottom;
    placeholder.style.marginLeft = styles.marginLeft;
    placeholder.style.verticalAlign = styles.verticalAlign;
    image.insertAdjacentElement("afterend", placeholder);
    activePlaceholder = placeholder;
  }

  function updateZoomSize(image) {
    const viewportWidth = window.innerWidth * 0.92;
    const viewportHeight = window.innerHeight * 0.92;
    const naturalWidth = image.naturalWidth || image.width;
    const naturalHeight = image.naturalHeight || image.height;

    if (!naturalWidth || !naturalHeight) {
      image.style.removeProperty("--image-zoom-width");
      image.style.removeProperty("--image-zoom-height");
      return;
    }

    const fitScale = Math.min(viewportWidth / naturalWidth, viewportHeight / naturalHeight);
    const minimumZoomWidth = Math.min(viewportWidth, 560);
    const minimumZoomHeight = Math.min(viewportHeight, 360);
    const preferredScale = Math.max(minimumZoomWidth / naturalWidth, minimumZoomHeight / naturalHeight);
    const zoomScale = Math.max(1, Math.min(fitScale, preferredScale));

    image.style.setProperty("--image-zoom-width", `${Math.round(naturalWidth * zoomScale)}px`);
    image.style.setProperty("--image-zoom-height", `${Math.round(naturalHeight * zoomScale)}px`);
  }

  function zoomImage(image) {
    if (activeImage === image) {
      cleanupZoom();
      return;
    }

    cleanupZoom();
    activeImage = image;
    createFlowPlaceholder(activeImage);
    updateZoomSize(activeImage);
    activeImage.classList.add("is-zoomed");
    lockBodyScroll();
  }

  function clearFootnoteHideTimer() {
    if (!footnoteHideTimer) {
      return;
    }

    window.clearTimeout(footnoteHideTimer);
    footnoteHideTimer = 0;
  }

  function clearFootnoteCloseTimer() {
    if (!footnoteCloseTimer) {
      return;
    }

    window.clearTimeout(footnoteCloseTimer);
    footnoteCloseTimer = 0;
  }

  function getFootnoteItem(ref) {
    const href = ref.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      return null;
    }

    const item = document.getElementById(decodeURIComponent(href.slice(1)));
    return item instanceof HTMLLIElement ? item : null;
  }

  function ensureFootnoteUi() {
    if (footnoteLayer) {
      return;
    }

    const layer = document.createElement("div");
    layer.className = "footnote-preview-layer";
    layer.hidden = true;
    layer.innerHTML = `
      <button class="footnote-preview-overlay" type="button" aria-label="关闭脚注预览"></button>
      <div class="footnote-preview-card" role="tooltip" aria-hidden="true">
        <div class="footnote-preview-header">
          <span class="footnote-preview-label"></span>
          <button class="footnote-preview-close" type="button" aria-label="关闭脚注预览">关闭</button>
        </div>
        <div class="footnote-preview-content"></div>
      </div>
    `;

    document.body.append(layer);
    footnoteLayer = layer;
    footnoteOverlay = layer.querySelector(".footnote-preview-overlay");
    footnoteCard = layer.querySelector(".footnote-preview-card");
    footnoteLabel = layer.querySelector(".footnote-preview-label");
    footnoteContent = layer.querySelector(".footnote-preview-content");
    footnoteCloseButton = layer.querySelector(".footnote-preview-close");

    if (footnoteOverlay) {
      footnoteOverlay.addEventListener("click", () => {
        closeFootnotePreview({ restoreFocus: true });
      });
    }

    if (footnoteCloseButton) {
      footnoteCloseButton.addEventListener("click", () => {
        closeFootnotePreview({ restoreFocus: true });
      });
    }

    if (footnoteCard) {
      footnoteCard.addEventListener("mouseenter", () => {
        if (footnoteDesktopMedia.matches) {
          clearFootnoteHideTimer();
        }
      });

      footnoteCard.addEventListener("mouseleave", () => {
        if (footnoteDesktopMedia.matches) {
          scheduleFootnoteClose();
        }
      });
    }
  }

  function closeFootnotePreview({ restoreFocus = false } = {}) {
    clearFootnoteHideTimer();
    clearFootnoteCloseTimer();

    if (activeFootnoteRef) {
      activeFootnoteRef.removeAttribute("data-footnote-preview-active");
      activeFootnoteRef.setAttribute("aria-expanded", "false");

      if (restoreFocus) {
        activeFootnoteRef.focus();
      }
    }

    activeFootnoteRef = null;
    document.body.classList.remove(FOOTNOTE_MOBILE_OPEN_CLASS);

    if (footnoteLayer) {
      const isMobile = footnoteLayer.dataset.mode === "mobile";
      footnoteLayer.dataset.open = "false";

      if (isMobile) {
        footnoteCloseTimer = window.setTimeout(() => {
          if (footnoteLayer && footnoteLayer.dataset.open !== "true") {
            footnoteLayer.hidden = true;
          }

          footnoteCloseTimer = 0;
        }, FOOTNOTE_MOBILE_CLOSE_DURATION);
      } else {
        footnoteLayer.hidden = true;
      }
    }

    if (footnoteCard) {
      footnoteCard.setAttribute("aria-hidden", "true");
      footnoteCard.setAttribute("role", "tooltip");
      footnoteCard.removeAttribute("aria-modal");
      footnoteCard.removeAttribute("style");
    }
  }

  function scheduleFootnoteClose() {
    clearFootnoteHideTimer();
    footnoteHideTimer = window.setTimeout(() => {
      closeFootnotePreview();
    }, FOOTNOTE_HIDE_DELAY);
  }

  function syncFootnoteContent(ref, footnoteItem) {
    ensureFootnoteUi();

    if (!footnoteContent || !footnoteLabel) {
      return false;
    }

    const clone = footnoteItem.cloneNode(true);
    if (!(clone instanceof HTMLLIElement)) {
      return false;
    }

    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((node) => {
      node.removeAttribute("id");
    });
    clone.querySelectorAll(".footnote-backref, [role='doc-backlink']").forEach((node) => {
      node.remove();
    });

    const nodes = Array.from(clone.childNodes).filter((node) => {
      return node.nodeType !== Node.TEXT_NODE || (node.textContent || "").trim();
    });

    footnoteContent.replaceChildren();
    nodes.forEach((node) => {
      footnoteContent.append(node);
    });

    footnoteLabel.textContent = `脚注 ${ref.textContent ? ref.textContent.trim() : "预览"}`;
    return nodes.length > 0;
  }

  function positionDesktopFootnoteCard(ref) {
    if (!footnoteLayer || !footnoteCard) {
      return;
    }

    const gap = 12;
    const viewportPadding = 16;
    const referenceRect = ref.getBoundingClientRect();
    const cardRect = footnoteCard.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    let left = referenceRect.left + referenceRect.width / 2 - cardWidth / 2;

    left = Math.min(Math.max(viewportPadding, left), window.innerWidth - cardWidth - viewportPadding);

    const spaceBelow = window.innerHeight - referenceRect.bottom - viewportPadding;
    const shouldPlaceAbove = spaceBelow < cardHeight + gap && referenceRect.top > spaceBelow;
    let top = shouldPlaceAbove ? referenceRect.top - cardHeight - gap : referenceRect.bottom + gap;

    top = Math.min(Math.max(viewportPadding, top), window.innerHeight - cardHeight - viewportPadding);

    footnoteLayer.dataset.mode = "desktop";
    footnoteCard.style.left = `${Math.round(left)}px`;
    footnoteCard.style.top = `${Math.round(top)}px`;
  }

  function openFootnotePreview(ref, footnoteItem, mode) {
    ensureFootnoteUi();

    if (!syncFootnoteContent(ref, footnoteItem) || !footnoteLayer || !footnoteCard) {
      return;
    }

    clearFootnoteHideTimer();
    clearFootnoteCloseTimer();

    if (activeFootnoteRef && activeFootnoteRef !== ref) {
      activeFootnoteRef.removeAttribute("data-footnote-preview-active");
      activeFootnoteRef.setAttribute("aria-expanded", "false");
    }

    activeFootnoteRef = ref;
    ref.setAttribute("data-footnote-preview-active", "true");
    ref.setAttribute("aria-expanded", "true");
    footnoteLayer.hidden = false;
    footnoteLayer.dataset.open = "true";
    footnoteLayer.dataset.mode = mode;
    footnoteCard.setAttribute("aria-hidden", "false");

    if (mode === "mobile") {
      document.body.classList.add(FOOTNOTE_MOBILE_OPEN_CLASS);
      footnoteCard.setAttribute("role", "dialog");
      footnoteCard.setAttribute("aria-modal", "true");
      footnoteCard.removeAttribute("style");
      return;
    }

    document.body.classList.remove(FOOTNOTE_MOBILE_OPEN_CLASS);
    footnoteCard.setAttribute("role", "tooltip");
    footnoteCard.removeAttribute("aria-modal");
    positionDesktopFootnoteCard(ref);
  }

  function handleFootnotePointerDown(event) {
    if (!footnoteLayer || footnoteLayer.hidden) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if ((footnoteCard && footnoteCard.contains(target)) || (activeFootnoteRef && activeFootnoteRef.contains(target))) {
      return;
    }

    closeFootnotePreview();
  }

  function handleFootnoteKeyDown(event) {
    if (event.key === "Escape") {
      closeFootnotePreview({ restoreFocus: footnoteDesktopMedia.matches === false });
    }
  }

  function handleFootnoteViewportChange() {
    if (!footnoteDesktopMedia.matches || !activeFootnoteRef || !footnoteLayer || footnoteLayer.hidden) {
      return;
    }

    positionDesktopFootnoteCard(activeFootnoteRef);
  }

  function handleFootnoteMediaChange() {
    closeFootnotePreview();
  }

  function initFootnotes() {
    const refs = Array.from(document.querySelectorAll(FOOTNOTE_REF_SELECTOR)).filter((node) => {
      return node instanceof HTMLAnchorElement && getFootnoteItem(node);
    });

    if (refs.length === 0) {
      return;
    }

    ensureFootnoteUi();

    refs.forEach((ref) => {
      if (!(ref instanceof HTMLAnchorElement) || ref.dataset.footnotePreviewBound === "true") {
        return;
      }

      const footnoteItem = getFootnoteItem(ref);
      if (!footnoteItem) {
        return;
      }

      ref.dataset.footnotePreviewBound = "true";
      ref.setAttribute("aria-haspopup", "dialog");
      ref.setAttribute("aria-expanded", "false");

      ref.addEventListener("mouseenter", () => {
        if (footnoteDesktopMedia.matches) {
          openFootnotePreview(ref, footnoteItem, "desktop");
        }
      });

      ref.addEventListener("mouseleave", () => {
        if (footnoteDesktopMedia.matches) {
          scheduleFootnoteClose();
        }
      });

      ref.addEventListener("focus", () => {
        if (footnoteDesktopMedia.matches) {
          openFootnotePreview(ref, footnoteItem, "desktop");
        }
      });

      ref.addEventListener("blur", () => {
        if (footnoteDesktopMedia.matches) {
          scheduleFootnoteClose();
        }
      });

      ref.addEventListener("click", (event) => {
        if (footnoteDesktopMedia.matches) {
          return;
        }

        event.preventDefault();

        if (
          activeFootnoteRef === ref &&
          footnoteLayer &&
          footnoteLayer.dataset.mode === "mobile" &&
          footnoteLayer.dataset.open === "true"
        ) {
          closeFootnotePreview();
          return;
        }

        openFootnotePreview(ref, footnoteItem, "mobile");
      });
    });
  }

  function handleDocumentClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const image = target.closest(ZOOMABLE_IMAGE_SELECTOR);
    if (image instanceof HTMLImageElement) {
      event.preventDefault();
      zoomImage(image);
      return;
    }

    if (activeImage) {
      cleanupZoom();
    }
  }

  function handleEscape(event) {
    if (event.key === "Escape") {
      cleanupZoom();
    }
  }

  function handleResize() {
    installZoomableImages();

    if (activeImage) {
      updateZoomSize(activeImage);
    }
  }

  function init() {
    if (initialized) {
      return;
    }

    initialized = true;
    installCopyButtons();
    installHeadingAnchors();
    installZoomableImages();
    document.addEventListener("click", handleCopyButtonClick);
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("pointerdown", handleFootnotePointerDown);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleFootnoteKeyDown);
    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleFootnoteViewportChange);
    window.addEventListener("scroll", handleFootnoteViewportChange, { passive: true });
    if (typeof footnoteDesktopMedia.addEventListener === "function") {
      footnoteDesktopMedia.addEventListener("change", handleFootnoteMediaChange);
    } else if (typeof footnoteDesktopMedia.addListener === "function") {
      footnoteDesktopMedia.addListener(handleFootnoteMediaChange);
    }
    initFootnotes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
