/**
 * Sample-app behavior: mail, writing desk, auction tray, and house controls.
 * Era switching stays in demos/recipes/shared/shell.js.
 */
(() => {
  const root = document.querySelector("[data-groovster-root]");
  if (!root) return;

  const scenes = {
    day: {
      label: "Day",
      lights: { "living-lamp": [true, 80], "kitchen-pendants": [true, 70], "bedroom-lamp": [false, 20], "bath-mirror": [false, 40], "porch-sconce": [false, 20] },
      locks: { "entry-lock": true, "back-lock": true },
      temp: 70,
    },
    evening: {
      label: "Evening",
      lights: { "living-lamp": [true, 55], "kitchen-pendants": [true, 35], "bedroom-lamp": [true, 25], "bath-mirror": [false, 30], "porch-sconce": [true, 40] },
      locks: { "entry-lock": true, "back-lock": true },
      temp: 68,
    },
    away: {
      label: "Away",
      lights: { "living-lamp": [false, 0], "kitchen-pendants": [false, 0], "bedroom-lamp": [false, 0], "bath-mirror": [false, 0], "porch-sconce": [false, 0] },
      locks: { "entry-lock": true, "back-lock": true },
      temp: 62,
    },
    movie: {
      label: "Movie",
      lights: { "living-lamp": [true, 15], "kitchen-pendants": [false, 10], "bedroom-lamp": [false, 0], "bath-mirror": [false, 0], "porch-sconce": [false, 10] },
      locks: { "entry-lock": true, "back-lock": true },
      temp: 68,
    },
    sleep: {
      label: "Sleep",
      lights: { "living-lamp": [false, 0], "kitchen-pendants": [false, 0], "bedroom-lamp": [false, 0], "bath-mirror": [false, 0], "porch-sconce": [false, 0] },
      locks: { "entry-lock": true, "back-lock": true },
      temp: 65,
    },
  };

  let currentMail = null;
  let openingDoc = "";

  function toast(title, body) {
    const region = document.querySelector("ew-toast-region");
    if (region && typeof region.show === "function") region.show({ title, body, variant: "success" });
  }

  function frozen() {
    return Boolean(document.querySelector("[data-freeze]")?.checked);
  }

  function relabelRows() {
    const live = document.querySelector("[data-row-count]");
    if (!live) return;
    const count = (live.textContent.match(/\d+/) || ["0"])[0];
    if (document.querySelector("[data-mail]")) live.textContent = `${count} matching messages`;
    else if (document.querySelector("[data-device-row]")) live.textContent = `${count} matching devices`;
  }

  function refreshFilter() {
    document.querySelector("[data-status-filter]")?.dispatchEvent(new Event("change", { bubbles: true }));
    relabelRows();
  }

  function statusLabel(status) {
    if (status === "unread") return "Unread";
    if (status === "flagged") return "Flagged";
    if (status === "read") return "Read";
    if (status === "draft") return "Draft";
    return "Read";
  }

  function recountMail() {
    const inbox = [...document.querySelectorAll('#inbox-rows [data-mail]')];
    const unread = document.querySelector('[data-metric="unread"]');
    const flagged = document.querySelector('[data-metric="flagged"]');
    const drafts = document.querySelector('[data-metric="drafts"]');
    if (unread) unread.textContent = String(inbox.filter((row) => row.dataset.status === "unread").length);
    if (flagged) flagged.textContent = String(inbox.filter((row) => row.dataset.status === "flagged").length);
    if (drafts) drafts.textContent = String(document.querySelectorAll("#draft-rows [data-mail]").length);
  }

  function paintMail(row) {
    const empty = document.querySelector("[data-mail-empty]");
    const view = document.querySelector("[data-mail-view]");
    if (!row || !view) return;
    for (const other of document.querySelectorAll("[data-mail]")) other.removeAttribute("aria-current");
    row.setAttribute("aria-current", "true");
    currentMail = row;
    if (empty) empty.hidden = true;
    view.hidden = false;
    const when = view.querySelector("[data-mail-when]");
    const subject = view.querySelector("[data-mail-subject]");
    const who = view.querySelector("[data-mail-from]");
    const body = view.querySelector("[data-mail-body]");
    if (when) when.textContent = row.dataset.when || "";
    if (subject) subject.textContent = row.dataset.subject || "Message";
    if (who) {
      who.textContent = row.dataset.folder === "inbox" ? row.dataset.from || "" : `To ${row.dataset.from || ""}`;
    }
    if (body) {
      body.replaceChildren();
      const template = document.getElementById(row.dataset.letter || "");
      if (template) body.append(template.content.cloneNode(true));
    }
    const flag = document.querySelector("[data-mail-flag]");
    if (flag) {
      flag.hidden = row.dataset.folder !== "inbox";
      flag.textContent = row.dataset.status === "flagged" ? "Remove flag" : "Flag";
    }
  }

  function openMail(row) {
    if (!row) return;
    if (row.dataset.status === "unread") {
      row.dataset.status = "read";
      const cell = row.querySelector("[data-mail-state]");
      if (cell) cell.textContent = "Read";
    }
    paintMail(row);
    recountMail();
    refreshFilter();
  }

  function toggleFlag() {
    if (!currentMail || currentMail.dataset.folder !== "inbox") return;
    currentMail.dataset.status = currentMail.dataset.status === "flagged" ? "read" : "flagged";
    const cell = currentMail.querySelector("[data-mail-state]");
    if (cell) cell.textContent = statusLabel(currentMail.dataset.status);
    paintMail(currentMail);
    recountMail();
    refreshFilter();
  }

  function archiveMail() {
    if (!currentMail) return;
    const row = currentMail;
    row.remove();
    currentMail = null;
    const empty = document.querySelector("[data-mail-empty]");
    const view = document.querySelector("[data-mail-view]");
    if (view) view.hidden = true;
    if (empty) empty.hidden = false;
    recountMail();
    refreshFilter();
    toast("Archived", "The message left this page. No account was changed.");
  }

  function prefillCompose(row) {
    const form = document.getElementById("compose-form");
    if (!form) return;
    form.reset();
    const to = form.querySelector("#compose-to");
    const subject = form.querySelector("#compose-subject");
    if (row && to) to.value = row.dataset.email || "";
    if (row && subject) {
      const current = row.dataset.subject || "";
      subject.value = current.startsWith("Re:") ? current : `Re: ${current}`;
    }
  }

  function keepDraft(form) {
    const to = form.querySelector("#compose-to")?.value.trim() || "";
    const subject = form.querySelector("#compose-subject")?.value.trim() || "Untitled draft";
    const message = form.querySelector("#compose-body")?.value.trim() || "";
    const id = `letter-draft-${Date.now()}`;
    const template = document.createElement("template");
    template.id = id;
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    template.content.append(paragraph);
    document.body.append(template);
    const row = document.createElement("tr");
    row.dataset.mail = "";
    row.dataset.folder = "draft";
    row.dataset.status = "draft";
    row.dataset.from = to;
    row.dataset.email = to;
    row.dataset.subject = subject;
    row.dataset.when = "Just now";
    row.dataset.letter = id;
    const who = document.createElement("td");
    who.textContent = to;
    const title = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ew-button app-subject";
    button.dataset.variant = "ghost";
    button.dataset.size = "sm";
    button.textContent = subject;
    title.append(button);
    const state = document.createElement("td");
    state.dataset.mailState = "";
    state.textContent = "Draft";
    const when = document.createElement("td");
    when.textContent = "Just now";
    row.append(who, title, state, when);
    document.querySelector("#draft-rows")?.prepend(row);
    recountMail();
    form.reset();
    form.closest("dialog")?.close();
    toast("Draft kept", "The message stays on this page. Nothing was sent.");
  }

  function filterLots() {
    const grid = document.querySelector("[data-lot-grid]");
    if (!grid) return;
    const category = document.querySelector("[data-item-filter]")?.value || "all";
    const condition = document.querySelector("[data-lot-condition]")?.value || "all";
    const onlyBin = Boolean(document.querySelector("[data-stock-filter]")?.checked);
    const query = (document.querySelector("[data-lot-query]")?.value || "").trim().toLowerCase();
    let visible = 0;
    for (const item of grid.querySelectorAll("[data-item]")) {
      const blob = `${item.dataset.item || ""} ${item.textContent || ""}`.toLowerCase();
      const okCategory = category === "all" || item.dataset.category === category;
      const okCondition = condition === "all" || item.dataset.condition === condition;
      const okStock = !onlyBin || item.dataset.stock === "in";
      const okQuery = !query || blob.includes(query);
      item.hidden = !(okCategory && okCondition && okStock && okQuery);
      if (!item.hidden) visible += 1;
    }
    const live = document.querySelector("[data-lot-count]");
    if (live) live.textContent = visible === 1 ? "1 lot showing" : `${visible} lots showing`;
  }

  function sortLots() {
    const grid = document.querySelector("[data-lot-grid]");
    if (!grid) return;
    const mode = document.querySelector("[data-lot-sort]")?.value || "featured";
    const items = [...grid.querySelectorAll("[data-item]")];
    const price = (item) => Number(item.dataset.price || 0);
    const ending = (item) => Number(item.dataset.ending || 0);
    const featured = (item) => Number(item.dataset.featured || 0);
    items.sort((a, b) => {
      if (mode === "price-asc") return price(a) - price(b);
      if (mode === "price-desc") return price(b) - price(a);
      if (mode === "ending") return ending(a) - ending(b);
      return featured(a) - featured(b);
    });
    for (const item of items) grid.append(item);
  }

  function openBid(button) {
    const dialog = document.getElementById("bid-dialog");
    const form = document.getElementById("bid-form");
    if (!dialog || !form) return;
    const next = Number(button.dataset.price || 0) + 1;
    form.dataset.sku = button.dataset.sku || "";
    form.dataset.name = button.dataset.name || "Lot";
    form.dataset.min = String(next);
    const input = form.querySelector("#bid-amount");
    if (input) {
      input.min = String(next);
      input.value = String(next);
    }
    const copy = dialog.querySelector("[data-bid-copy]");
    if (copy) copy.textContent = `${button.dataset.name} is at $${button.dataset.price}. The sample bid goes on the tray. Nothing is charged.`;
    if (!dialog.open) dialog.showModal();
  }

  function placeBid(form) {
    const amount = Number(form.querySelector("#bid-amount")?.value || 0);
    const min = Number(form.dataset.min || 0);
    if (amount < min) {
      form.reportValidity();
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.cartAdd = "1";
    button.dataset.sku = `${form.dataset.sku}-bid`;
    button.dataset.name = `${form.dataset.name} bid`;
    button.dataset.price = String(amount);
    document.body.append(button);
    button.click();
    button.remove();
    form.closest("dialog")?.close();
  }

  function toggleWatch(button) {
    const on = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", on ? "false" : "true");
    button.textContent = on ? "Watch" : "Watching";
    const name = button.dataset.watch || "This lot";
    toast(on ? "Removed" : "Watching", on ? `${name} left the sample watch list.` : `${name} is on the sample watch list. No alert is sent.`);
  }

  function wordCount() {
    const doc = document.querySelector("[data-doc]");
    const out = document.querySelector("[data-word-count]");
    if (!doc || !out) return;
    const text = (doc.textContent || "").replace(/\s+/g, " ").trim();
    const words = text ? text.split(" ").length : 0;
    const minutes = words === 0 ? 0 : Math.max(1, Math.round(words / 200));
    out.textContent = `${words} words · ${minutes} min read`;
  }

  function refreshOutline() {
    const doc = document.querySelector("[data-doc]");
    const list = document.querySelector("[data-outline]");
    if (!doc || !list) return;
    list.replaceChildren();
    const heads = [...doc.querySelectorAll("h2, h3")];
    if (!heads.length) {
      const item = document.createElement("li");
      item.textContent = "No headings yet. Use Heading in the toolbar.";
      list.append(item);
      return;
    }
    heads.forEach((head, index) => {
      if (!head.id) head.id = `doc-h-${index + 1}`;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "ew-link";
      link.href = `#${head.id}`;
      link.textContent = head.textContent.trim() || "Untitled heading";
      item.append(link);
      list.append(item);
    });
  }

  function countFind() {
    const input = document.querySelector("[data-doc-find]");
    const live = document.querySelector("[data-find-count]");
    const doc = document.querySelector("[data-doc]");
    if (!input || !live || !doc) return;
    const query = input.value.trim().toLowerCase();
    if (!query) {
      live.textContent = "Find is empty.";
      return;
    }
    const text = (doc.textContent || "").toLowerCase();
    let count = 0;
    let from = 0;
    while (from < text.length) {
      const at = text.indexOf(query, from);
      if (at < 0) break;
      count += 1;
      from = at + query.length;
    }
    live.textContent = count === 1 ? "1 match in this document." : `${count} matches in this document.`;
  }

  function applyDocCommand(source) {
    const doc = document.querySelector("[data-doc]");
    const command = source.dataset.docCmd;
    if (!doc || !command) return;
    doc.focus();
    const arg = source.dataset.docArg || null;
    if (command === "formatBlock" && arg) {
      document.execCommand("formatBlock", false, arg);
      const current = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
      if (current !== arg.toLowerCase()) document.execCommand("formatBlock", false, `<${arg}>`);
    } else {
      document.execCommand(command, false, arg);
    }
    wordCount();
    refreshOutline();
  }

  function syncMarks() {
    for (const button of document.querySelectorAll('[data-doc-cmd="bold"], [data-doc-cmd="italic"]')) {
      let on = false;
      try {
        on = document.queryCommandState(button.dataset.docCmd);
      } catch {
        on = false;
      }
      button.setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  function retitle() {
    const input = document.querySelector("[data-doc-title]");
    const heading = document.querySelector("[data-doc-heading]");
    const crumb = document.querySelector("[data-doc-crumb]");
    const value = input?.value.trim() || "Untitled";
    if (heading) heading.textContent = value;
    if (crumb) crumb.textContent = value;
  }

  function restoreDoc() {
    const doc = document.querySelector("[data-doc]");
    if (!doc) return;
    doc.innerHTML = openingDoc;
    wordCount();
    refreshOutline();
    toast("Restored", "The opening text is back. Nothing was saved to a file.");
  }

  function deviceSwitch(id) {
    return document.querySelector(`[data-device-switch][data-device="${id}"]`);
  }

  function deviceRange(id) {
    return document.querySelector(`[data-device-range][data-device="${id}"]`);
  }

  function writeState(id, text) {
    for (const cell of document.querySelectorAll(`[data-device-state="${id}"]`)) cell.textContent = text;
  }

  function syncSwitch(input) {
    const id = input.dataset.device;
    if (!id) return;
    if (input.dataset.kind === "light") {
      const level = deviceRange(id)?.value || "0";
      writeState(id, input.checked ? `On · ${level}%` : "Off");
      const row = document.querySelector(`#device-rows [data-device-row="${id}"]`);
      if (row) row.dataset.status = input.checked ? "on" : "idle";
    } else if (input.dataset.kind === "lock") {
      writeState(id, input.checked ? "Locked" : "Unlocked");
      const row = document.querySelector(`#device-rows [data-device-row="${id}"]`);
      if (row) row.dataset.status = input.checked ? "idle" : "alert";
    }
  }

  function syncRange(input) {
    const id = input.dataset.device;
    if (!id) return;
    input.dataset.held = input.value;
    if (input.dataset.kind === "light") {
      const sw = deviceSwitch(id);
      writeState(id, sw?.checked ? `On · ${input.value}%` : "Off");
    } else if (input.dataset.kind === "climate") {
      writeState(id, `${input.value}°F heat`);
    }
  }

  function setSwitch(id, on) {
    const input = deviceSwitch(id);
    if (!input) return;
    input.checked = on;
    input.setAttribute("aria-checked", on ? "true" : "false");
    syncSwitch(input);
  }

  function setRange(id, value) {
    const input = deviceRange(id);
    if (!input) return;
    input.value = String(value);
    syncRange(input);
  }

  function refreshHouse() {
    if (!document.querySelector('[data-metric="lights"]')) return;
    const lights = document.querySelectorAll('[data-device-switch][data-kind="light"]:checked').length;
    const temp = Number(deviceRange("hall-temp")?.value || 68);
    const lighting = lights * 36;
    const heating = 900 + Math.abs(temp - 70) * 40;
    const other = 180;
    const total = lighting + heating + other;
    const openLocks = document.querySelectorAll('[data-device-switch][data-kind="lock"]:not(:checked)').length;
    const openSensors = document.querySelectorAll('[data-sensor][data-open="true"]').length;
    const lightsNode = document.querySelector('[data-metric="lights"]');
    const indoor = document.querySelector('[data-metric="indoor"]');
    const draw = document.querySelector('[data-metric="draw"]');
    const entries = document.querySelector('[data-metric="entries"]');
    if (lightsNode) lightsNode.textContent = String(lights);
    if (indoor) indoor.textContent = `${temp}°F`;
    if (draw) draw.textContent = `${(total / 1000).toFixed(1)} kW`;
    if (entries) entries.textContent = String(openLocks + openSensors);
    const energy = { lighting: `${lighting} W`, hvac: `${heating} W`, other: `${other} W`, total: `${(total / 1000).toFixed(1)} kW` };
    for (const [key, text] of Object.entries(energy)) {
      const cell = document.querySelector(`[data-energy="${key}"]`);
      if (cell) cell.textContent = text;
    }
    const sensor = document.querySelector('[data-sensor="porch-contact"]');
    const banner = document.querySelector("[data-house-alert]");
    if (sensor && banner) {
      const open = sensor.dataset.open === "true";
      banner.dataset.variant = open ? "warning" : "success";
      const title = banner.querySelector(".ew-alert__title");
      const body = banner.querySelector(".ew-alert__body");
      if (title) title.textContent = open ? "Porch contact is open" : "Porch contact is closed";
      if (body) body.textContent = open ? "Fictional sensor. The same status is written in the security board." : "Fictional sensor. No alarm was sent.";
      sensor.textContent = open ? "Open for 14 minutes in this sample." : "Closed in this sample.";
      writeState("porch-contact", open ? "Open" : "Closed");
      const row = document.querySelector('#device-rows [data-device-row="porch-contact"]');
      if (row) row.dataset.status = open ? "alert" : "idle";
      const button = document.querySelector("[data-ack-sensor]");
      if (button) button.textContent = open ? "Mark closed" : "Mark open";
    }
  }

  function logActivity(text) {
    const body = document.querySelector("[data-activity]");
    if (!body) return;
    const row = document.createElement("tr");
    const time = document.createElement("td");
    const note = document.createElement("td");
    time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    note.textContent = text;
    row.append(time, note);
    body.prepend(row);
    while (body.children.length > 8) body.lastElementChild?.remove();
  }

  function applyScene(id) {
    const scene = scenes[id];
    if (!scene) return;
    if (frozen()) {
      toast("Frozen", "The sample clock is stopped. This house stays as it was.");
      return;
    }
    for (const button of document.querySelectorAll("[data-scene]")) {
      const on = button.dataset.scene === id;
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.dataset.variant = on ? "primary" : "secondary";
    }
    for (const [device, [on, level]] of Object.entries(scene.lights)) {
      setRange(device, level);
      setSwitch(device, on);
    }
    for (const [device, locked] of Object.entries(scene.locks)) setSwitch(device, locked);
    setRange("hall-temp", scene.temp);
    refreshHouse();
    refreshFilter();
    logActivity(`${scene.label} scene applied on this page.`);
    toast(scene.label, `${scene.label} scene applied on this page. No hub is connected.`);
  }

  function toggleSensor() {
    const sensor = document.querySelector('[data-sensor="porch-contact"]');
    if (!sensor) return;
    if (frozen()) {
      toast("Frozen", "The sample clock is stopped. This house stays as it was.");
      return;
    }
    sensor.dataset.open = sensor.dataset.open === "true" ? "false" : "true";
    refreshHouse();
    refreshFilter();
    logActivity(sensor.dataset.open === "true" ? "Porch contact marked open." : "Porch contact marked closed.");
  }

  document.addEventListener("mousedown", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-doc-cmd]")) event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('[role="menuitem"]')) return;
    const mail = target.closest("[data-mail]");
    if (mail) openMail(mail);
    if (target.closest("[data-mail-flag]")) toggleFlag();
    if (target.closest("[data-mail-archive]")) archiveMail();
    if (target.closest("[data-compose-new]")) document.getElementById("compose-form")?.reset();
    if (target.closest("[data-reply]")) prefillCompose(currentMail);
    const command = target.closest("[data-doc-cmd]");
    if (command) applyDocCommand(command);
    if (target.closest("[data-doc-restore]")) restoreDoc();
    const scene = target.closest("[data-scene]");
    if (scene) applyScene(scene.dataset.scene || "");
    if (target.closest("[data-ack-sensor]")) toggleSensor();
    const bid = target.closest("[data-open-bid]");
    if (bid) openBid(bid);
    const watch = target.closest("[data-watch]");
    if (watch) toggleWatch(watch);
  });

  document.addEventListener("ew-menu-select", (event) => {
    const id = event.detail && event.detail.id;
    const item = id ? document.getElementById(id) : null;
    if (item?.hasAttribute("data-doc-restore")) restoreDoc();
    if (item?.hasAttribute("data-doc-export")) toast("Export", "No file was created. This desk is fictional.");
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.id === "compose-form") {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      keepDraft(form);
    }
    if (form.id === "bid-form") {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      placeBid(form);
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[data-device-switch]")) {
      if (frozen()) {
        target.checked = !target.checked;
        target.setAttribute("aria-checked", target.checked ? "true" : "false");
        toast("Frozen", "The sample clock is stopped. This house stays as it was.");
      } else {
        syncSwitch(target);
        refreshHouse();
        refreshFilter();
        const label = target.dataset.deviceLabel || "Device";
        const state = target.checked ? target.dataset.onText || "On" : target.dataset.offText || "Off";
        logActivity(`${label} is ${state.toLowerCase()}.`);
      }
    }
    if (target.matches("[data-lot-sort]")) sortLots();
    if (target.matches("[data-item-filter], [data-stock-filter], [data-lot-condition], [data-lot-sort]")) filterLots();
    if (target.matches("[data-doc-title]")) retitle();
    relabelRows();
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("[data-device-range]")) {
      if (frozen()) {
        target.value = target.dataset.held || target.defaultValue;
        if (target.dataset.froze !== "1") {
          target.dataset.froze = "1";
          toast("Frozen", "The sample clock is stopped. This house stays as it was.");
          setTimeout(() => { target.dataset.froze = "0"; }, 900);
        }
      } else {
        syncRange(target);
        refreshHouse();
      }
    }
    if (target.matches("[data-lot-query]")) filterLots();
    if (target.matches("[data-doc]")) {
      wordCount();
      refreshOutline();
    }
    if (target.matches("[data-doc-find]")) countFind();
    if (target.matches("[data-doc-title]")) retitle();
    if (target.matches("[data-row-filter]")) relabelRows();
  });

  document.addEventListener("selectionchange", syncMarks);

  const doc = document.querySelector("[data-doc]");
  if (doc) openingDoc = doc.innerHTML;
  for (const input of document.querySelectorAll("[data-device-range]")) input.dataset.held = input.value;
  wordCount();
  refreshOutline();
  sortLots();
  filterLots();
  refreshHouse();
  recountMail();
  relabelRows();
})();
