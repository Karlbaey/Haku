(function () {
  function normalizeWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function stripLeadingSiteOperator(value) {
    return normalizeWhitespace(String(value || "").replace(/^\s*site:\S+\s*/i, ""));
  }

  function normalizeSiteTarget(value) {
    const normalizedValue = normalizeWhitespace(String(value || "").replace(/^\s*site:/i, ""));

    if (!normalizedValue) {
      return "";
    }

    try {
      const parsedUrl = new URL(normalizedValue);
      if (parsedUrl.host) {
        return parsedUrl.host.toLocaleLowerCase("en-US");
      }
    } catch (error) {
    }

    if (/^\/\//.test(normalizedValue)) {
      try {
        const parsedProtocolRelativeUrl = new URL("https:" + normalizedValue);
        if (parsedProtocolRelativeUrl.host) {
          return parsedProtocolRelativeUrl.host.toLocaleLowerCase("en-US");
        }
      } catch (error) {
      }
    }

    return normalizedValue
      .replace(/^\/+/, "")
      .split(/[/?#\s]/, 1)[0]
      .toLocaleLowerCase("en-US");
  }

  function composeGoogleSiteQuery(siteTarget, keyword) {
    const normalizedSiteTarget = normalizeSiteTarget(siteTarget);
    const normalizedKeyword = normalizeWhitespace(stripLeadingSiteOperator(keyword));

    if (!normalizedSiteTarget) {
      return normalizedKeyword;
    }

    if (!normalizedKeyword) {
      return "site:" + normalizedSiteTarget;
    }

    return "site:" + normalizedSiteTarget + " " + normalizedKeyword;
  }

  function getControlName(control) {
    if (!control) {
      return "";
    }

    if (typeof control.getAttribute === "function") {
      const attributeName = control.getAttribute("name");
      if (attributeName !== null) {
        return attributeName;
      }
    }

    return typeof control.name === "string" ? control.name : "";
  }

  function setControlName(control, name) {
    if (!control) {
      return;
    }

    if (typeof control.setAttribute === "function") {
      control.setAttribute("name", name);
    }

    control.name = name;
  }

  function clearControlName(control) {
    if (!control) {
      return;
    }

    if (typeof control.removeAttribute === "function") {
      control.removeAttribute("name");
    }

    control.name = "";
  }

  function createSubmittedQueryInput(form) {
    const documentRef = form && form.ownerDocument ? form.ownerDocument : document;
    const hiddenInput = documentRef.createElement("input");

    hiddenInput.type = "hidden";
    hiddenInput.setAttribute("type", "hidden");
    hiddenInput.setAttribute("data-search-submitted-query", "true");
    form.appendChild(hiddenInput);

    return hiddenInput;
  }

  function prepareSearchSubmission(form) {
    const input = form.querySelector("[data-search-input]");
    const siteTarget = form.getAttribute("data-search-site");

    if (!input) {
      return function noop() {};
    }

    const inputName = getControlName(input) || "q";
    const submittedQueryInput = createSubmittedQueryInput(form);

    setControlName(submittedQueryInput, inputName);
    submittedQueryInput.value = composeGoogleSiteQuery(siteTarget, input.value);
    clearControlName(input);

    return function cleanupSearchSubmission() {
      setControlName(input, inputName);

      if (submittedQueryInput.parentNode === form) {
        form.removeChild(submittedQueryInput);
      }
    };
  }

  function handleSearchSubmit(event) {
    const form = event.currentTarget;
    const cleanupSubmission = prepareSearchSubmission(form);

    if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
      window.setTimeout(cleanupSubmission, 0);
    }
  }

  function bindSearchForms(root) {
    const searchForms = root.querySelectorAll("[data-search-form]");

    searchForms.forEach((form) => {
      if (form.dataset.searchFormBound === "true") {
        return;
      }

      form.addEventListener("submit", handleSearchSubmit);
      form.dataset.searchFormBound = "true";
    });
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      composeGoogleSiteQuery,
      normalizeSiteTarget,
      prepareSearchSubmission,
    };
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        bindSearchForms(document);
      }, { once: true });
    } else {
      bindSearchForms(document);
    }
  }
})();
