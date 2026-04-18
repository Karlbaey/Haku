(() => {
  const HIT_LABELS = {
    title: "标题",
    tag: "标签",
    description: "摘要",
    body: "正文",
  };
  const RESULT_LIMIT = 8;
  const FETCH_LIMIT = 24;
  const IDLE_STATUS = "输入关键词开始搜索，按 Esc 退出。";
  const HTML_ESCAPE_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  function normalizeText(value) {
    return String(value || "").trim().toLocaleLowerCase("zh-CN");
  }

  function stripHtml(value) {
    return String(value || "").replace(/<[^>]*>/g, "");
  }

  function getSearchTerms(query) {
    return Array.from(new Set(normalizeText(query).split(/\s+/).filter(Boolean)));
  }

  function includesEveryTerm(value, terms) {
    const normalizedValue = normalizeText(stripHtml(value));
    return terms.length > 0 && terms.every((term) => normalizedValue.includes(term));
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character] || character);
  }

  function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightText(value, query) {
    const terms = getSearchTerms(query);
    if (terms.length === 0) {
      return escapeHtml(value);
    }

    const source = escapeHtml(value);
    const pattern = new RegExp(`(${terms.sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`, "giu");
    return source.replace(pattern, "<mark>$1</mark>");
  }

  function normalizeExcerpt(excerpt, fallback) {
    if (String(excerpt || "").trim().length > 0) {
      return excerpt;
    }

    return escapeHtml(fallback);
  }

  function inferSearchHitType(query, fields) {
    const terms = getSearchTerms(query);
    if (terms.length === 0) {
      return "body";
    }

    if (includesEveryTerm(fields.title, terms)) {
      return "title";
    }

    if (fields.tags.some((tag) => includesEveryTerm(tag, terms))) {
      return "tag";
    }

    if (includesEveryTerm(fields.description, terms)) {
      return "description";
    }

    return "body";
  }

  function parseSearchSections(value) {
    return String(value || "")
      .split(",")
      .map((section) => section.trim())
      .filter(Boolean)
      .map((section) => "/" + section.replace(/^\/+|\/+$/g, "") + "/");
  }

  function isSearchTargetUrl(url, sectionPrefixes) {
    try {
      const pathname = new URL(String(url || ""), window.location.origin).pathname;
      if (sectionPrefixes.length === 0) {
        return true;
      }

      return sectionPrefixes.some((prefix) => pathname.startsWith(prefix));
    } catch (error) {
      const fallbackPath = String(url || "");
      if (sectionPrefixes.length === 0) {
        return true;
      }

      return sectionPrefixes.some((prefix) => fallbackPath.startsWith(prefix));
    }
  }

  class HomeSearchElement extends HTMLElement {
    constructor() {
      super();
      this.overlay = null;
      this.trigger = null;
      this.closeButton = null;
      this.input = null;
      this.status = null;
      this.results = null;
      this.pagefind = null;
      this.searchSectionPrefixes = [];
      this.searchToken = 0;

      this.handleOpen = this.handleOpen.bind(this);
      this.handleCloseClick = this.handleCloseClick.bind(this);
      this.handleOverlayClick = this.handleOverlayClick.bind(this);
      this.handleInput = this.handleInput.bind(this);
      this.handleInputKeydown = this.handleInputKeydown.bind(this);
      this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
    }

    connectedCallback() {
      if (this.dataset.bound === "true") {
        return;
      }

      this.overlay = this.querySelector("[data-search-overlay]");
      this.trigger = this.querySelector("[data-search-trigger]");
      this.closeButton = this.querySelector("[data-search-close]");
      this.input = this.querySelector("[data-search-input]");
      this.status = this.querySelector("[data-search-status]");
      this.results = this.querySelector("[data-search-results]");
      this.searchSectionPrefixes = parseSearchSections(this.dataset.searchSections);

      if (!this.overlay || !this.trigger || !this.closeButton || !this.input || !this.status || !this.results) {
        return;
      }

      this.trigger.addEventListener("click", this.handleOpen);
      this.closeButton.addEventListener("click", this.handleCloseClick);
      this.overlay.addEventListener("click", this.handleOverlayClick);
      this.input.addEventListener("input", this.handleInput);
      this.input.addEventListener("keydown", this.handleInputKeydown);
      document.addEventListener("keydown", this.handleDocumentKeydown);
      this.dataset.bound = "true";
    }

    disconnectedCallback() {
      if (!this.trigger || !this.closeButton || !this.overlay || !this.input) {
        return;
      }

      this.trigger.removeEventListener("click", this.handleOpen);
      this.closeButton.removeEventListener("click", this.handleCloseClick);
      this.overlay.removeEventListener("click", this.handleOverlayClick);
      this.input.removeEventListener("input", this.handleInput);
      this.input.removeEventListener("keydown", this.handleInputKeydown);
      document.removeEventListener("keydown", this.handleDocumentKeydown);
      delete this.dataset.bound;
    }

    async handleOpen() {
      if (!this.overlay || !this.input || !this.status || !this.trigger) {
        return;
      }

      this.overlay.hidden = false;
      this.trigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("search-open");
      this.status.textContent = "正在准备搜索索引...";
      this.input.focus();

      try {
        await this.ensurePagefind();
        this.status.textContent = IDLE_STATUS;
      } catch (error) {
        console.error(error);
        this.status.textContent = "搜索索引尚未生成。请先执行 `npm run build` 后再试。";
      }
    }

    handleCloseClick() {
      this.close();
    }

    close(focusTrigger = true) {
      if (!this.overlay || !this.input || !this.status || !this.results || !this.trigger) {
        return;
      }

      this.overlay.hidden = true;
      this.trigger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("search-open");
      this.input.value = "";
      this.status.textContent = IDLE_STATUS;
      this.results.innerHTML = "";
      this.searchToken += 1;

      if (focusTrigger) {
        this.trigger.focus();
      }
    }

    handleOverlayClick(event) {
      if (event.target === this.overlay) {
        this.close();
      }
    }

    handleInputKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.close();
      }
    }

    handleDocumentKeydown(event) {
      if (event.key === "Escape" && this.overlay && !this.overlay.hidden) {
        event.preventDefault();
        this.close();
      }
    }

    async handleInput() {
      if (!this.input || !this.status || !this.results) {
        return;
      }

      const query = this.input.value.trim();
      const searchToken = ++this.searchToken;

      if (!query) {
        this.status.textContent = IDLE_STATUS;
        this.results.innerHTML = "";
        return;
      }

      this.status.textContent = "正在搜索...";

      try {
        const pagefind = await this.ensurePagefind();
        if (typeof pagefind.preload === "function") {
          await pagefind.preload(query);
        }

        const search = await pagefind.debouncedSearch(query, { excerptLength: 18 }, 120);
        if (search === null || searchToken !== this.searchToken) {
          return;
        }

        const handles = search.results.slice(0, FETCH_LIMIT);
        const entries = (await Promise.all(handles.map((result) => result.data())))
          .filter((entry) => isSearchTargetUrl(entry.url, this.searchSectionPrefixes))
          .slice(0, RESULT_LIMIT);

        if (searchToken !== this.searchToken) {
          return;
        }

        this.renderResults(query, entries);
      } catch (error) {
        console.error(error);
        this.status.textContent = "搜索失败，请稍后重试。";
      }
    }

    async ensurePagefind() {
      if (this.pagefind) {
        return this.pagefind;
      }

      const loadPagefind = new Function("return import('/pagefind/pagefind.js');");
      const pagefind = await loadPagefind();
      if (typeof pagefind.options === "function") {
        await pagefind.options({ excerptLength: 18 });
      }

      this.pagefind = pagefind;
      return pagefind;
    }

    renderResults(query, entries) {
      if (!this.results || !this.status) {
        return;
      }

      if (entries.length === 0) {
        this.status.textContent = `没有找到和“${query}”相关的内容。`;
        this.results.innerHTML = "";
        return;
      }

      this.status.textContent = `找到 ${entries.length} 条结果。`;
      this.results.innerHTML = entries.map((entry) => this.renderResultItem(query, entry)).join("");

      this.results.querySelectorAll("a").forEach((anchor) => {
        anchor.addEventListener("click", () => {
          this.close(false);
        });
      });
    }

    renderResultItem(query, entry) {
      const title = String((entry.meta && entry.meta.title) || "未命名内容");
      const description = String((entry.meta && entry.meta.description) || "");
      const tags = String((entry.meta && entry.meta.tags) || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const hitType = inferSearchHitType(query, {
        title,
        description,
        tags,
        excerpt: entry.excerpt || "",
      });
      const normalizedExcerpt = normalizeExcerpt(entry.excerpt || "", description || title);
      const tagList = tags
        .map((tag) => `<li class="search-tag">#${highlightText(tag, query)}</li>`)
        .join("");

      return `
        <li class="search-result-item">
          <a class="search-result-link" href="${escapeHtml(entry.url || "#")}">
            <div class="search-result-meta">
              <span class="search-hit-badge">${HIT_LABELS[hitType]}</span>
              ${tagList ? `<ul class="search-tag-list">${tagList}</ul>` : ""}
            </div>
            <h3 class="search-result-title">${highlightText(title, query)}</h3>
            <p class="search-result-excerpt">${normalizedExcerpt}</p>
          </a>
        </li>
      `;
    }
  }

  if (window.customElements && !window.customElements.get("home-search")) {
    window.customElements.define("home-search", HomeSearchElement);
  }
})();
