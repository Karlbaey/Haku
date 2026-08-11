(function () {
  const root = document.querySelector("friends-application");

  if (!root) {
    return;
  }

  const dialog = root.querySelector("[data-friends-dialog]");
  const openButton = root.querySelector("[data-friends-open]");
  const closeButtons = root.querySelectorAll("[data-friends-close]");
  const form = root.querySelector("[data-friends-form]");
  const config = readConfig(root);

  if (!(dialog instanceof HTMLDialogElement) || !(form instanceof HTMLFormElement) || !config) {
    return;
  }

  openButton?.addEventListener("click", function () {
    document.body.classList.add("friends-dialog-open");
    dialog.showModal();
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeDialog);
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  // 原生 <dialog> 按 Esc 或浏览器关闭按钮触发 cancel/close,不会走自定义 closeDialog,
  // 需要在此兜底清理 body 上的滚动锁类,避免页面滚动被永久锁定。
  dialog.addEventListener("cancel", function () {
    document.body.classList.remove("friends-dialog-open");
  });

  dialog.addEventListener("close", function () {
    document.body.classList.remove("friends-dialog-open");
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      url: String(formData.get("url") || ""),
      description: String(formData.get("description") || ""),
      site: String(formData.get("site") || ""),
      avatar: String(formData.get("avatar") || ""),
      tags: String(formData.get("tags") || ""),
    };

    window.location.href = buildIssueUrl(config, payload).toString();
  });

  function closeDialog() {
    document.body.classList.remove("friends-dialog-open");
    dialog.close();
  }

  function readConfig(element) {
    const raw = element.dataset.config;
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function normalizeTags(tags) {
    const normalized = String(tags || "")
      .split(",")
      .map(function (tag) { return tag.trim(); })
      .filter(Boolean);

    return normalized.length > 0 ? normalized : ["博客"];
  }

  function buildIssueUrl(currentConfig, input) {
    const issueTitlePrefix = currentConfig.issueTitlePrefix || currentConfig.issuetitleprefix || "";
    const tags = normalizeTags(input.tags);
    const url = new URL(
      "https://github.com/" + currentConfig.github.owner.trim() + "/" + currentConfig.github.repo.trim() + "/issues/new"
    );

    url.searchParams.set("template", "friend-link.yml");
    url.searchParams.set("title", (issueTitlePrefix.trim() + " " + input.name.trim()).trim());
    url.searchParams.set("name", input.name.trim());
    url.searchParams.set("url", input.url.trim());
    url.searchParams.set("description", input.description.trim());
    url.searchParams.set("site", input.site.trim());
    url.searchParams.set("avatar", input.avatar.trim());
    url.searchParams.set("tags", tags.join(", "));

    return url;
  }
}());
