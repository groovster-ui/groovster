document.querySelectorAll("[data-filter]").forEach((form) => {
  const grid = document.querySelector(form.getAttribute("data-filter"));
  const live = document.querySelector("[data-count]");
  const apply = () => {
    const cat = form.querySelector("[data-cat]")?.value || "all";
    const stock = form.querySelector("[data-stock]")?.checked;
    let n = 0;
    grid.querySelectorAll("[data-item]").forEach((item) => {
      const ok = (cat === "all" || item.getAttribute("data-cat") === cat) && (!stock || item.getAttribute("data-stock") === "true");
      item.toggleAttribute("data-hide", !ok);
      if (ok) n += 1;
    });
    if (live) live.textContent = n === 1 ? "1 piece shown" : n + " pieces shown";
  };
  form.addEventListener("change", apply);
});

document.querySelectorAll("[data-add]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const count = document.querySelector("[data-cart]");
    const n = Number(count?.textContent || 0) + 1;
    if (count) count.textContent = String(n);
    const live = document.querySelector("[data-cart-live]");
    if (live) live.textContent = n + " in the demonstration cart. Nothing is charged.";
  });
});

document.querySelectorAll("form[data-fictional]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const alert = document.querySelector(form.getAttribute("data-alert"));
    if (alert) alert.hidden = false;
    const dialog = document.querySelector(form.getAttribute("data-dialog"));
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
  });
});

document.querySelectorAll("[data-queue]").forEach((input) => {
  const table = document.querySelector(input.getAttribute("data-queue"));
  const live = document.querySelector("[data-queue-live]");
  const run = () => {
    const q = input.value.trim().toLowerCase();
    const status = document.querySelector("[data-status]")?.value || "all";
    let n = 0;
    table.querySelectorAll("tbody tr").forEach((row) => {
      const text = row.textContent.toLowerCase();
      const ok = (!q || text.includes(q)) && (status === "all" || row.getAttribute("data-status") === status);
      row.toggleAttribute("data-hide", !ok);
      if (ok) n += 1;
    });
    if (live) live.textContent = n === 1 ? "1 row in view" : n + " rows in view";
  };
  input.addEventListener("input", run);
  document.querySelector("[data-status]")?.addEventListener("change", run);
});
