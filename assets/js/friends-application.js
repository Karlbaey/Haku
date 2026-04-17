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

  function escapeString(value) {
    return String(value).replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
  }

  function buildIssueBody(currentConfig, input) {
    const issueBodyHeader = currentConfig.issueBodyHeader || currentConfig.issuebodyheader || "";
    const tags = normalizeTags(input.tags);
    const codeBlock = [
      "  {",
      "    name: \"" + escapeString(input.name.trim()) + "\",",
      "    url: \"" + escapeString(input.url.trim()) + "\",",
      "    description: \"" + escapeString(input.description.trim()) + "\",",
      "    site: \"" + escapeString(input.site.trim()) + "\",",
      "    avatar: \"" + escapeString(input.avatar.trim()) + "\",",
      "    tags: [" + tags.map(function (tag) { return "\"" + escapeString(tag) + "\""; }).join(", ") + "],",
      "  },",
    ].join("\n");

    return [
      issueBodyHeader.trim(),
      "",
      "- 站点名称：" + input.name.trim(),
      "- 站点链接：" + input.url.trim(),
      "- 站点简介：" + input.description.trim(),
      "- 展示域名：" + input.site.trim(),
      "- 头像链接：" + input.avatar.trim(),
      "- 标签：" + tags.join("、"),
      "",
      "<!-- 下方为自动生成的代码，填写到博客时我会以下面的为准 -->",
      "",
      "```typescript",
      codeBlock,
      "```",
    ].join("\n");
  }

  function buildIssueUrl(currentConfig, input) {
    const issueTitlePrefix = currentConfig.issueTitlePrefix || currentConfig.issuetitleprefix || "";
    const url = new URL(
      "https://github.com/" + currentConfig.github.owner.trim() + "/" + currentConfig.github.repo.trim() + "/issues/new"
    );

    url.searchParams.set("title", (issueTitlePrefix.trim() + " " + input.name.trim()).trim());
    url.searchParams.set("body", buildIssueBody(currentConfig, input));

    return url;
  }
}());
