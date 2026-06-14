(() => {
  const CODE_BLOCK_SELECTOR = ".markdown pre code";
  const LINE_THRESHOLD = 20;
  const FOLD_CLASS = "code-foldable";
  const COLLAPSED_CLASS = "code-collapsed";
  const BUTTON_CLASS = "code-fold-button";

  function countLines(codeElement) {
    const text = codeElement.textContent || "";
    return text.split("\n").length;
  }

  function createFoldButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.setAttribute("aria-label", "折叠代码块");
    button.textContent = "折叠";
    return button;
  }

  function toggleFold(pre, button) {
    const isCollapsed = pre.classList.contains(COLLAPSED_CLASS);

    if (isCollapsed) {
      pre.classList.remove(COLLAPSED_CLASS);
      button.textContent = "折叠";
      button.setAttribute("aria-label", "折叠代码块");
      button.setAttribute("aria-expanded", "true");
    } else {
      pre.classList.add(COLLAPSED_CLASS);
      button.textContent = "展开";
      button.setAttribute("aria-label", "展开代码块");
      button.setAttribute("aria-expanded", "false");
    }
  }

  function installCodeFold(codeElement) {
    if (!(codeElement instanceof HTMLElement)) {
      return;
    }

    const pre = codeElement.closest("pre");
    if (!pre || pre.dataset.codeFoldBound === "true") {
      return;
    }

    const lineCount = countLines(codeElement);
    if (lineCount <= LINE_THRESHOLD) {
      return;
    }

    pre.dataset.codeFoldBound = "true";
    pre.classList.add(FOLD_CLASS);

    const button = createFoldButton();
    button.setAttribute("aria-expanded", "true");

    button.addEventListener("click", () => {
      toggleFold(pre, button);
    });

    pre.appendChild(button);
  }

  function init() {
    document.querySelectorAll(CODE_BLOCK_SELECTOR).forEach((code) => {
      installCodeFold(code);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
