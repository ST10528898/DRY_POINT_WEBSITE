/*
 * Dry Point Clothing Store — Part 3 JavaScript enhancements
 *
 * Copy this file to: dry-point-website/js/script.js
 * Then include it on every HTML page:
 * <script src="js/script.js" defer></script>
 *
 * This is a front-end demonstration. It does not send real payments.
 * Contact/enquiry forms open the visitor's email app unless a real AJAX
 * endpoint is configured with data-ajax-endpoint on the form.
 */
(function () {
  "use strict";

  const CART_STORAGE_KEY = "dryPointCart.v1";
  const CONTACT_EMAIL = "st10528898@rcconnect.edu.za";
  const currencyFormatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR"
  });

  let cart = loadCart();
  let revealObserver = null;

  function formatCurrency(amount) {
    try {
      return currencyFormatter.format(amount);
    } catch (_error) {
      return `R ${amount.toFixed(2)}`;
    }
  }

  function normaliseCart(value) {
    if (!Array.isArray(value)) return [];

    return value
      .filter((item) => (
        item &&
        typeof item.name === "string" &&
        item.name.trim().length > 0 &&
        item.name.length <= 100 &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) > 0
      ))
      .map((item) => ({
        name: item.name.trim(),
        price: Number(item.price),
        quantity: Math.min(99, Math.max(1, Math.floor(Number(item.quantity) || 1))),
        image: safeImagePath(item.image)
      }));
  }

  function safeImagePath(value) {
    return typeof value === "string" &&
      /^images\/[a-z0-9 _./-]+$/i.test(value) &&
      !value.includes("..")
      ? value
      : "";
  }

  function loadCart() {
    try {
      return normaliseCart(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]"));
    } catch (_error) {
      return [];
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (_error) {
      // The in-memory cart still works if the browser blocks local storage.
    }
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function announceCartChange(message) {
    const status = document.getElementById("cart-message");
    if (!status) return;
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = message;
  }

  function addToCart(name, price, image) {
    const safeName = String(name || "").trim();
    const safePrice = Number(price);
    if (!safeName || safeName.length > 100 || !Number.isFinite(safePrice) || safePrice <= 0) {
      announceCartChange("That item could not be added. Please refresh the products page and try again.");
      return false;
    }

    const existingItem = cart.find((item) => item.name.toLowerCase() === safeName.toLowerCase());
    if (existingItem) {
      existingItem.quantity = Math.min(99, existingItem.quantity + 1);
      if (!existingItem.image && image) existingItem.image = String(image);
    } else {
      cart.push({
        name: safeName,
        price: safePrice,
        quantity: 1,
        image: safeImagePath(image)
      });
    }

    saveCart();
    renderCart();
    renderOrderSummary();
    announceCartChange(`${safeName} added to your cart. Cart total: ${formatCurrency(getCartTotal())}.`);
    return true;
  }

  // Keep compatibility with the existing inline onclick="addToCart(...)" links.
  window.addToCart = addToCart;

  function createCartTable(isEditable) {
    const table = makeElement("table", "dp-cart-table");
    const caption = makeElement("caption", "", isEditable ? "Items in your cart" : "Order summary");
    table.appendChild(caption);

    const thead = document.createElement("thead");
    const headingRow = document.createElement("tr");
    ["Product", "Price", "Quantity", "Subtotal"].forEach((label) => {
      headingRow.appendChild(makeElement("th", "", label));
    });
    if (isEditable) headingRow.appendChild(makeElement("th", "", "Action"));
    thead.appendChild(headingRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      const productCell = document.createElement("td");

      if (item.image) {
        const image = makeElement("img", "dp-cart-image");
        image.src = item.image;
        image.alt = item.name;
        image.loading = "lazy";
        productCell.appendChild(image);
      }
      productCell.appendChild(makeElement("span", "", item.name));
      row.appendChild(productCell);
      row.appendChild(makeElement("td", "", formatCurrency(item.price)));

      const quantityCell = document.createElement("td");
      if (isEditable) {
        const quantity = makeElement("input", "dp-quantity");
        quantity.type = "number";
        quantity.min = "1";
        quantity.max = "99";
        quantity.step = "1";
        quantity.value = String(item.quantity);
        quantity.setAttribute("aria-label", `Quantity for ${item.name}`);
        quantity.addEventListener("change", () => {
          const nextQuantity = Number(quantity.value);
          if (!Number.isInteger(nextQuantity) || nextQuantity < 1 || nextQuantity > 99) {
            quantity.value = String(cart[index].quantity);
            return;
          }
          cart[index].quantity = nextQuantity;
          saveCart();
          renderCart();
          renderOrderSummary();
        });
        quantityCell.appendChild(quantity);
      } else {
        quantityCell.textContent = String(item.quantity);
      }
      row.appendChild(quantityCell);
      row.appendChild(makeElement("td", "", formatCurrency(item.price * item.quantity)));

      if (isEditable) {
        const actionCell = document.createElement("td");
        const removeButton = makeElement("button", "dp-button dp-remove-button", "Remove");
        removeButton.type = "button";
        removeButton.setAttribute("aria-label", `Remove ${item.name} from cart`);
        removeButton.addEventListener("click", () => {
          cart.splice(index, 1);
          saveCart();
          renderCart();
          renderOrderSummary();
          announceCartChange(`${item.name} removed from your cart.`);
        });
        actionCell.appendChild(removeButton);
        row.appendChild(actionCell);
      }

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    return table;
  }

  function renderCart() {
    const container = document.getElementById("cart-contents");
    const total = document.getElementById("cart-total");
    if (!container) return;

    container.replaceChildren();
    if (cart.length === 0) {
      container.appendChild(makeElement("p", "dp-empty-state", "Your cart is empty. Browse the products to add an item."));
      if (total) total.textContent = `Cart total: ${formatCurrency(0)}`;
      return;
    }

    container.appendChild(createCartTable(true));
    const clearButton = makeElement("button", "dp-button dp-clear-button", "Remove all items");
    clearButton.type = "button";
    clearButton.addEventListener("click", () => {
      cart = [];
      saveCart();
      renderCart();
      renderOrderSummary();
      announceCartChange("All items have been removed from your cart.");
    });
    container.appendChild(clearButton);
    if (total) total.textContent = `Cart total: ${formatCurrency(getCartTotal())}`;
  }

  function renderOrderSummary() {
    const container = document.getElementById("order-summary");
    const total = document.getElementById("order-total");
    if (!container) return;

    container.replaceChildren();
    if (cart.length === 0) {
      container.appendChild(makeElement("p", "dp-empty-state", "There are no items to check out."));
      if (total) total.textContent = `Order total: ${formatCurrency(0)}`;
      return;
    }

    container.appendChild(createCartTable(false));
    if (total) total.textContent = `Order total: ${formatCurrency(getCartTotal())}`;
  }

  function parseProductsFromTable(table) {
    return Array.from(table.querySelectorAll("tbody tr, tr"))
      .filter((row) => row.cells.length >= 3)
      .map((row) => {
        const name = row.cells[0].textContent.replace(/\s+/g, " ").trim();
        const price = Number(row.cells[1].textContent.replace(/[^\d.]/g, ""));
        const image = row.cells[0].querySelector("img");
        if (!name || !Number.isFinite(price) || price <= 0) return null;
        return {
          name,
          price,
          image: image ? image.getAttribute("src") || "" : ""
        };
      })
      .filter(Boolean);
  }

  function renderProductCards(products, grid, searchValue, sortValue, resultCount) {
    const query = searchValue.trim().toLocaleLowerCase();
    const visibleProducts = products
      .filter((product) => product.name.toLocaleLowerCase().includes(query))
      .slice()
      .sort((first, second) => {
        if (sortValue === "price-low") return first.price - second.price;
        if (sortValue === "price-high") return second.price - first.price;
        return first.name.localeCompare(second.name);
      });

    grid.replaceChildren();
    visibleProducts.forEach((product) => {
      const card = makeElement("article", "dp-product-card dp-reveal");
      const image = makeElement("img", "dp-product-image");
      if (product.image) image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      makeLightboxAccessible(image);
      card.appendChild(image);
      card.appendChild(makeElement("h3", "", product.name));
      card.appendChild(makeElement("p", "dp-product-price", formatCurrency(product.price)));

      const button = makeElement("button", "dp-button dp-add-button", "Add to cart");
      button.type = "button";
      button.addEventListener("click", () => {
        addToCart(product.name, product.price, product.image);
      });
      card.appendChild(button);
      grid.appendChild(card);
    });

    resultCount.textContent = visibleProducts.length === 1
      ? "1 product shown"
      : `${visibleProducts.length} products shown`;
    resultCount.setAttribute("aria-live", "polite");
    initRevealAnimations(grid);
  }

  function initProductBrowser() {
    const table = Array.from(document.querySelectorAll("table"))
      .find((candidate) => parseProductsFromTable(candidate).length > 0);
    if (!table) return;

    const products = parseProductsFromTable(table);
    const browser = makeElement("section", "dp-product-browser");
    browser.setAttribute("aria-label", "Search and sort products");

    const controls = makeElement("div", "dp-product-controls");
    const searchLabel = makeElement("label", "", "Search products");
    const search = makeElement("input", "dp-product-search");
    search.type = "search";
    search.id = "dp-product-search";
    search.placeholder = "Type a product name";
    search.setAttribute("aria-label", "Search products by name");
    searchLabel.htmlFor = search.id;
    searchLabel.appendChild(search);

    const sortLabel = makeElement("label", "", "Sort by");
    const sort = makeElement("select", "dp-product-sort");
    sort.id = "dp-product-sort";
    sortLabel.htmlFor = sort.id;
    [
      ["name-asc", "Name (A–Z)"],
      ["price-low", "Price (low to high)"],
      ["price-high", "Price (high to low)"]
    ].forEach(([value, label]) => {
      const option = makeElement("option", "", label);
      option.value = value;
      sort.appendChild(option);
    });
    sortLabel.appendChild(sort);
    controls.append(searchLabel, sortLabel);
    browser.appendChild(controls);

    const resultCount = makeElement("p", "dp-result-count");
    browser.appendChild(resultCount);
    const grid = makeElement("div", "dp-product-grid");
    browser.appendChild(grid);
    table.parentNode.insertBefore(browser, table);
    table.hidden = true;

    const update = () => renderProductCards(products, grid, search.value, sort.value, resultCount);
    search.addEventListener("input", update);
    sort.addEventListener("change", update);
    update();
  }

  function setFieldError(field, message) {
    const key = field.id || field.name || "field";
    const errorId = `dp-error-${key.replace(/[^a-z0-9_-]/gi, "-")}`;
    let error = document.getElementById(errorId);
    if (!error) {
      error = makeElement("small", "dp-field-error");
      error.id = errorId;
      error.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", error);
    }

    const descriptionIds = new Set((field.getAttribute("aria-describedby") || "")
      .split(/\s+/).filter(Boolean));
    descriptionIds.add(errorId);
    field.setAttribute("aria-describedby", Array.from(descriptionIds).join(" "));
    if (message) {
      field.setAttribute("aria-invalid", "true");
      error.textContent = message;
      error.hidden = false;
    } else {
      field.removeAttribute("aria-invalid");
      error.textContent = "";
      error.hidden = true;
    }
  }

  function validateField(field) {
    if (!field.matches("input, textarea, select") || field.disabled) return true;

    field.setCustomValidity("");
    const value = String(field.value || "").trim();
    const fieldName = `${field.name} ${field.id}`.toLowerCase();

    if ((field.type === "tel" || /phone|telephone/.test(fieldName)) && value) {
      const digitCount = value.replace(/\D/g, "").length;
      if (!/^[+]?[\d\s().-]+$/.test(value) || digitCount < 7 || digitCount > 15) {
        field.setCustomValidity("Enter a phone number with 7 to 15 digits.");
      }
    }

    if (field.tagName === "TEXTAREA" && /message/.test(fieldName) && value) {
      if (value.length < 10) {
        field.setCustomValidity("Please write at least 10 characters.");
      } else if (value.length > 1500) {
        field.setCustomValidity("Please keep your message under 1,500 characters.");
      }
    }

    const valid = field.checkValidity();
    setFieldError(field, valid ? "" : field.validationMessage);
    return valid;
  }

  function validateForm(form) {
    const fields = Array.from(form.querySelectorAll("input, textarea, select"))
      .filter((field) => field.type !== "submit" && field.type !== "button" && field.type !== "hidden");
    return fields.map(validateField).every(Boolean);
  }

  function getFormStatus(form) {
    let status = form.parentElement.querySelector(`[data-form-status="${form.id}"]`);
    if (!status) {
      status = makeElement("p", "dp-form-status");
      status.dataset.formStatus = form.id || "site-form";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      form.insertAdjacentElement("afterend", status);
    }
    return status;
  }

  function buildMailto(form) {
    const recipient = form.dataset.recipient || CONTACT_EMAIL;
    const kind = form.id === "enquiry-form" ? "Product or service enquiry" : "Website contact message";
    const lines = [];
    for (const [key, value] of new FormData(form).entries()) {
      if (key.startsWith("_")) continue;
      lines.push(`${key}: ${String(value).trim()}`);
    }
    const subject = encodeURIComponent(`Dry Point: ${kind}`);
    const body = encodeURIComponent(lines.join("\n"));
    const safeRecipient = encodeURIComponent(recipient).replace(/%40/gi, "@");
    return `mailto:${safeRecipient}?subject=${subject}&body=${body}`;
  }

  function validAjaxEndpoint(form) {
    const rawEndpoint = (form.dataset.ajaxEndpoint || "").trim();
    if (!rawEndpoint) return "";
    try {
      const endpoint = new URL(rawEndpoint, window.location.href);
      return endpoint.protocol === "https:" || endpoint.origin === window.location.origin
        ? endpoint.href
        : "";
    } catch (_error) {
      return "";
    }
  }

  function initForms() {
    const forms = document.querySelectorAll(
      "#contact-form, #enquiry-form, form[data-site-form]"
    );

    forms.forEach((form, index) => {
      if (!form.id) form.id = `dp-site-form-${index + 1}`;
      // Let the script show consistent, field-specific errors on submit.
      // checkValidity() still honours the HTML required/type/minlength rules.
      form.noValidate = true;
      const status = getFormStatus(form);

      form.querySelectorAll("input, textarea, select").forEach((field) => {
        field.addEventListener("input", () => validateField(field));
        field.addEventListener("change", () => validateField(field));
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!validateForm(form)) {
          status.textContent = "Please correct the highlighted fields and try again.";
          status.dataset.state = "error";
          const firstInvalid = form.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        const endpoint = validAjaxEndpoint(form);
        if (endpoint) {
          status.textContent = "Sending your message…";
          status.dataset.state = "pending";
          try {
            const response = await fetch(endpoint, {
              method: (form.method || "post").toUpperCase(),
              body: new FormData(form),
              headers: { Accept: "application/json" },
              credentials: "omit"
            });
            if (!response.ok) throw new Error("The form service returned an error.");
            status.textContent = "Your message was submitted successfully.";
            status.dataset.state = "success";
            form.reset();
            form.querySelectorAll("[aria-invalid='true']").forEach((field) => setFieldError(field, ""));
          } catch (_error) {
            status.textContent = "The message could not be submitted. Check your connection or email the store directly.";
            status.dataset.state = "error";
          }
          return;
        }

        status.textContent = `Opening your email app to address ${form.dataset.recipient || CONTACT_EMAIL}. Review the draft and press Send in your email app.`;
        status.dataset.state = "pending";
        window.location.href = buildMailto(form);
      });
    });
  }

  function initInteractiveMap() {
    const mapLink = document.querySelector('a[href*="google.com/maps"]');
    if (!mapLink || document.getElementById("dry-point-map")) return;

    let searchQuery = "Ladysmith, KwaZulu-Natal";
    try {
      const linkUrl = new URL(mapLink.href);
      searchQuery = linkUrl.searchParams.get("query") ||
        linkUrl.searchParams.get("q") ||
        searchQuery;
    } catch (_error) {
      // Keep the general Ladysmith map if the original link is malformed.
    }

    const figure = makeElement("figure", "dp-map");
    figure.id = "dry-point-map";
    const iframe = makeElement("iframe", "dp-map-frame");
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`;
    iframe.title = `Interactive map: ${searchQuery}`;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    figure.appendChild(iframe);
    figure.appendChild(makeElement("figcaption", "", `Map location: ${searchQuery}. Confirm the store details before travelling.`));

    const mapParagraph = mapLink.closest("p");
    if (mapParagraph) {
      mapParagraph.insertAdjacentElement("afterend", figure);
    } else {
      document.body.appendChild(figure);
    }
  }

  function makeLightboxAccessible(image) {
    image.dataset.lightbox = "true";
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `View larger image: ${image.alt}`);
    image.setAttribute("aria-haspopup", "dialog");
  }

  function initLightbox() {
    const productBrowser = document.querySelector(".dp-product-browser");
    const images = Array.from(document.querySelectorAll("main img, body > img, [data-lightbox]"))
      .filter((image) => (
        image.alt &&
        !/dry-point logo/i.test(image.alt) &&
        !image.closest(".dp-product-browser")
      ));
    if (images.length === 0 && !productBrowser) return;

    const dialog = makeElement("dialog", "dp-lightbox");
    dialog.setAttribute("aria-label", "Image preview");
    const closeButton = makeElement("button", "dp-lightbox-close", "Close image");
    closeButton.type = "button";
    const preview = makeElement("img", "dp-lightbox-image");
    const caption = makeElement("p", "dp-lightbox-caption");
    dialog.append(closeButton, preview, caption);
    document.body.appendChild(dialog);

    function closeLightbox() {
      if (typeof dialog.close === "function" && dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    }

    function showImage(image) {
      preview.src = image.currentSrc || image.src;
      preview.alt = image.alt;
      caption.textContent = image.alt;
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      closeButton.focus();
    }

    images.forEach((image) => {
      makeLightboxAccessible(image);
      image.addEventListener("click", () => showImage(image));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showImage(image);
        }
      });
    });

    // Product cards are rebuilt whenever search or sorting changes. Delegated
    // listeners keep the lightbox working for those newly-created images.
    if (productBrowser) {
      productBrowser.addEventListener("click", (event) => {
        const image = event.target.closest
          ? event.target.closest('img[data-lightbox="true"]')
          : null;
        if (image && productBrowser.contains(image)) showImage(image);
      });
      productBrowser.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const image = event.target.closest
          ? event.target.closest('img[data-lightbox="true"]')
          : null;
        if (!image || !productBrowser.contains(image)) return;
        event.preventDefault();
        showImage(image);
      });
    }

    closeButton.addEventListener("click", closeLightbox);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeLightbox();
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion-button]").forEach((button) => {
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      button.setAttribute("aria-expanded", String(!panel.hidden));
      button.addEventListener("click", () => {
        const willOpen = panel.hidden;
        panel.hidden = !willOpen;
        button.setAttribute("aria-expanded", String(willOpen));
      });
    });
  }

  function initRevealAnimations(root) {
    const container = root || document;
    const targets = container.querySelectorAll(".dp-product-card, .dp-map, [data-reveal]");
    const reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    revealObserver = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach((target) => {
      if (!target.classList.contains("is-visible")) revealObserver.observe(target);
    });
  }

  function initPaymentPage() {
    const form = document.getElementById("payment-form");
    const button = document.getElementById("pay-now");
    if (!form && !button) return;

    if (form) {
      const notice = makeElement(
        "p",
        "dp-demo-notice",
        "Demonstration checkout only: this website does not process payments. Never enter real card details."
      );
      notice.setAttribute("role", "note");
      form.insertAdjacentElement("beforebegin", notice);
      form.addEventListener("submit", payNow);
    }
    if (button) button.addEventListener("click", payNow);
  }

  function payNow(event) {
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    const status = document.getElementById("payment-status");
    const cardFields = document.querySelectorAll("#card-number, #card-expiry, #card-cvv");
    cardFields.forEach((field) => {
      field.value = "";
    });

    if (status) {
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.textContent = cart.length
        ? "Demo only: no payment was taken and no order was sent. Do not enter real card details."
        : "Your cart is empty. Add products before viewing the demo checkout.";
    }
    return false;
  }
  window.payNow = payNow;

  function initSiteWideDetails() {
    document.querySelectorAll('[target="_blank"]').forEach((link) => {
      const relValues = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      relValues.add("noopener");
      relValues.add("noreferrer");
      link.setAttribute("rel", Array.from(relValues).join(" "));
    });

    document.querySelectorAll("[data-year]").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });
  }

  function boot() {
    initSiteWideDetails();
    initProductBrowser();
    renderCart();
    renderOrderSummary();
    initForms();
    initInteractiveMap();
    initLightbox();
    initAccordions();
    initRevealAnimations();
    initPaymentPage();

    window.addEventListener("storage", (event) => {
      if (event.key === CART_STORAGE_KEY) {
        cart = loadCart();
        renderCart();
        renderOrderSummary();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
