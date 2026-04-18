(() => {
  const GISCUS_SCRIPT_SRC = "https://giscus.app/client.js";
  const WALINE_MODULE_SRC = "https://unpkg.com/@waline/client@v3/dist/waline.js";
  let walineInitPromise;

  function applyTabState(root, provider) {
    root.querySelectorAll("[data-comments-tab]").forEach((tab) => {
      const isActive = tab.getAttribute("data-comments-tab") === provider;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    root.querySelectorAll("[data-comments-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-comments-panel") !== provider;
    });
  }

  function mountGiscus(mount, config) {
    if (mount.dataset.loaded === "true" || !config.giscus) {
      return;
    }

    const script = document.createElement("script");
    script.src = GISCUS_SCRIPT_SRC;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", config.giscus.repo);
    script.setAttribute("data-repo-id", config.giscus.repoId);
    script.setAttribute("data-category", config.giscus.category);
    script.setAttribute("data-category-id", config.giscus.categoryId);
    script.setAttribute("data-mapping", config.giscus.mapping || "pathname");
    script.setAttribute("data-strict", config.giscus.strict || "0");
    script.setAttribute("data-reactions-enabled", config.giscus.reactionsEnabled || "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", config.giscus.inputPosition || "top");
    script.setAttribute("data-theme", config.giscus.theme || "preferred_color_scheme");
    script.setAttribute("data-lang", config.giscus.lang || "zh-CN");
    script.setAttribute("data-loading", "lazy");

    if (config.giscus.mapping === "title") {
      script.setAttribute("data-term", config.article.title);
    }

    if (config.giscus.mapping === "url") {
      script.setAttribute("data-term", config.article.url);
    }

    if (config.giscus.mapping === "specific") {
      script.setAttribute("data-term", config.article.id);
    }

    mount.append(script);
    mount.dataset.loaded = "true";
  }

  async function loadWalineInit() {
    if (!walineInitPromise) {
      walineInitPromise = import(WALINE_MODULE_SRC).then((module) => module.init);
    }

    return walineInitPromise;
  }

  async function mountWaline(mount, config) {
    if (mount.dataset.loaded === "true" || !config.waline) {
      return;
    }

    const init = await loadWalineInit();
    init({
      el: mount,
      serverURL: config.waline.serverUrl,
      path: config.article.pathname,
      turnstileKey: config.waline.turnstileKey,
      lang: config.waline.lang || "zh-CN",
      emoji: config.waline.emoji || [],
      requiredMeta: config.waline.requiredMeta || ["nick", "mail"],
      login: config.waline.login || "enable",
      pageSize: config.waline.pageSize || 10,
      commentSorting: config.waline.commentSorting || "latest",
    });
    mount.dataset.loaded = "true";
  }

  async function activateProvider(root, config, provider) {
    applyTabState(root, provider);
    const mount = root.querySelector(`[data-comments-mount="${provider}"]`);
    if (!(mount instanceof HTMLElement)) {
      return;
    }

    try {
      if (provider === "giscus") {
        mountGiscus(mount, config);
        return;
      }

      if (provider === "waline") {
        await mountWaline(mount, config);
      }
    } catch (error) {
      console.error(error);
      mount.textContent = `${provider} 加载失败，请稍后重试。`;
    }
  }

  function setupCommentsTabs() {
    document.querySelectorAll("[data-comments-root]").forEach((root) => {
      if (root.dataset.bound === "true") {
        return;
      }

      const configScript = root.querySelector("[data-comments-config]");
      if (!(configScript instanceof HTMLScriptElement) || !configScript.textContent) {
        return;
      }

      let config;
      try {
        config = JSON.parse(configScript.textContent);
        if (typeof config === "string") {
          config = JSON.parse(config);
        }
      } catch (error) {
        console.error("Failed to parse comments config:", error);
        return;
      }

      if (!config || typeof config !== "object") {
        console.error("Invalid comments config:", config);
        return;
      }

      root.querySelectorAll("[data-comments-tab]").forEach((tab) => {
        tab.addEventListener("click", () => {
          const provider = tab.getAttribute("data-comments-tab");
          if (!provider) {
            return;
          }

          void activateProvider(root, config, provider);
        });
      });

      root.dataset.bound = "true";
      void activateProvider(root, config, config.defaultProvider);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupCommentsTabs, { once: true });
  } else {
    setupCommentsTabs();
  }
})();
