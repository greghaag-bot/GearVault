/* ============================================
   GearVault — Photography Gear Tracker
   ============================================ */

// ---- State ----
let gearItems = [];
let tripSelections = new Set();
let links = [];
let techniques = [];
let sortCol = "name";
let sortDir = "asc";
let activeSection = "gear";
let gearIdCounter = 1;
let linkIdCounter = 1;
let techIdCounter = 1;

// ---- Default Data from Excel ----
const DEFAULT_GEAR = [
  { name: "Thinktank Mindshift Backlight 36L", weight: 4.5, category: "Bags" },
  { name: "F-Stop Ajna 3.75 Large ICU 1.71", weight: 5.5, category: "Bags" },
  { name: "Shimoda Explore 40 2.9 w Large ICU 1.71", weight: 4.6, category: "Bags" },
  { name: "Shimoda Action X70 w Extra Large DV", weight: 7.7, category: "Bags" },
  { name: "Atlas Adventure", weight: 6.7, category: "Bags" },
  { name: "F-Stop Kashmir 30L", weight: 2.5, category: "Bags" },
  { name: "Phase One IQ4 150", weight: 1.81, category: "Camera Bodies" },
  { name: "Cables Phase One & Rodenstock", weight: 0.45, category: "Accessories" },
  { name: "Phase One Battery (x5)", weight: 1.125, category: "Accessories" },
  { name: "Battery Charger w Cables", weight: 0.95, category: "Accessories" },
  { name: "Cambo WRS 1600", weight: 2.36, category: "Camera Bodies" },
  { name: "Cambo Rodenstock 32HR", weight: 2.51, category: "Lenses" },
  { name: "Cambo Rodenstock 90HR", weight: 2.36, category: "Lenses" },
  { name: "Cambo Rodenstock 180HR", weight: 2.75, category: "Lenses" },
  { name: "Rodenstock 90 & 180 Spacer", weight: 0.43, category: "Accessories" },
  { name: "Arca-Swiss C1 Cube Geared Head", weight: 2.4, category: "Heads" },
  { name: "Arca-Swiss D4", weight: 2.15, category: "Heads" },
  { name: "RRS BH-30 Ballhead", weight: 0.84, category: "Heads" },
  { name: "RRS BH-55 Ball Head", weight: 2.3, category: "Heads" },
  { name: "RRS BH-40 Ball Head", weight: 1.12, category: "Heads" },
  { name: "Gitzo GT3533LS Systematic Series 3", weight: 4.5, category: "Tripods" },
  { name: "FEISOL CT-3372LV M2 Rapid", weight: 4.86, category: "Tripods" },
  { name: "RRS TFC-34 Series 3 Mk2", weight: 3.85, category: "Tripods" },
  { name: "RRS TFC-14 MK2 Series 1 Ultralight", weight: 2.46, category: "Tripods" },
  { name: "Memory Cards", weight: 0.1, category: "Accessories" },
  { name: "Filter Kit Nisi", weight: 3.56, category: "Filters" },
  { name: "RRS MPR-192 & Mini-Clamps", weight: 0.74, category: "Accessories" },
  { name: "18oz Hydro Flask (full)", weight: 1.78, category: "Personal" },
  { name: "18oz Swiftwick Water Bottle (full)", weight: 1.65, category: "Personal" },
  { name: "Misc.", weight: 2.0, category: "Personal" },
  { name: '16" MacBook Pro', weight: 4.3, category: "Electronics" },
  { name: "11-inch iPad Air", weight: 1.02, category: "Electronics" },
  { name: "Hasselblad HC210", weight: 2.9, category: "Lenses" },
  { name: "Macro Adapter", weight: 0.5, category: "Accessories" },
  { name: "Hasselblad X2D II", weight: 1.8, category: "Camera Bodies" },
  { name: "Hasselblad XCD 55mm f/2.5 V", weight: 0.82, category: "Lenses" },
  { name: "Hasselblad XCD 25mm f/2.5 V", weight: 1.3, category: "Lenses" },
  { name: "Hasselblad XCD 90mm f/2.5 V", weight: 1.22, category: "Lenses" },
  { name: "Hasselblad XCD 135mm f/2.8 w 1.7x", weight: 2.06, category: "Lenses" },
  { name: "RRS L-Plate for Hasselblad X2D", weight: 0.33, category: "Accessories" },
  { name: "Kase KW Revolution Plus MEGA Kit 82mm", weight: 1.34, category: "Filters" },
];

const DEFAULT_LINKS = [
  { title: "Capture Integration", url: "https://www.captureintegration.com", description: "High-end medium format, technical cameras, and digital back specialists" },
  { title: "GetDPI", url: "https://getdpi.com", description: "Photographic forum with in-depth discussions on medium format and technical cameras" },
  { title: "Photographer's Trail Notes", url: "https://photographerstrailnotes.com", description: "Location guides for landscape photographers with 185+ shooting locations" },
  { title: "Tim Parkin Tilt-Shift Simulator", url: "http://static.timparkin.co.uk/static/dslr-tilt-shift/", description: "Interactive tilt-shift depth of field simulator for landscape photography" },
];

// ---- Initialize ----
function init() {
  initTheme();
  loadData();
  renderGear();
  renderTrip();
  renderLinks();
  renderTechniques();
  if (typeof initLocations === 'function') initLocations();
  updateStats();
  bindEvents();
  lucide.createIcons();
}

function loadData() {
  // Initialize with defaults (in-memory only — no storage APIs in sandboxed iframes)
  if (gearItems.length === 0) {
    gearItems = DEFAULT_GEAR.map(g => ({ ...g, id: gearIdCounter++ }));
  }
  if (links.length === 0) {
    links = DEFAULT_LINKS.map(l => ({ ...l, id: linkIdCounter++ }));
  }
}

function saveData() {
  // State is held in-memory variables (gearItems, tripSelections, links, techniques).
  // No persistent storage in sandboxed iframes.
}

// ---- Theme ----
function initTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = prefersDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);

  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      lucide.createIcons();
    });
  }
}

// ---- Navigation ----
function bindEvents() {
  // Nav links
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = el.dataset.nav;
      if (target === "hero") {
        document.getElementById("hero-section").scrollIntoView({ behavior: "smooth" });
        return;
      }
      switchSection(target);
      // Close mobile menu
      document.getElementById("mobileMenu").classList.remove("open");
    });
  });

  // Hamburger
  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("open");
  });

  // Search
  document.getElementById("gearSearch").addEventListener("input", renderGear);

  // Add buttons
  document.getElementById("addGearBtn").addEventListener("click", () => openGearModal());
  document.getElementById("addLinkBtn").addEventListener("click", () => openLinkModal());
  const addTechBtn = document.getElementById("addTechniqueBtn");
  if (addTechBtn) addTechBtn.addEventListener("click", () => openTechniqueModal());
  document.getElementById("clearTripBtn").addEventListener("click", clearTrip);

  // Weight limit
  document.getElementById("weightLimit").addEventListener("input", updateTripSummary);

  // Modal close
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Sort
  document.querySelectorAll(".th-sortable").forEach(th => {
    th.addEventListener("click", () => {
      const col = th.dataset.sort;
      if (sortCol === col) sortDir = sortDir === "asc" ? "desc" : "asc";
      else { sortCol = col; sortDir = "asc"; }
      renderGear();
    });
  });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function switchSection(name) {
  activeSection = name;
  // Show section
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  const sec = document.getElementById("section-" + name);
  if (sec) sec.classList.remove("hidden");

  // Update nav
  document.querySelectorAll(".nav-link, .mobile-link").forEach(l => {
    l.classList.toggle("active", l.dataset.nav === name);
  });

  // Scroll to content
  document.querySelector(".main-content").scrollIntoView({ behavior: "smooth" });
}

// ---- Render Gear ----
function getCategories() {
  const cats = new Set(gearItems.map(g => g.category));
  return [...cats].sort();
}

function renderCategoryFilters() {
  const container = document.getElementById("categoryFilter");
  const cats = getCategories();
  container.innerHTML = '<button class="chip active" data-category="all">All</button>' +
    cats.map(c => `<button class="chip" data-category="${c}">${c}</button>`).join("");

  container.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      container.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderGear();
    });
  });
  lucide.createIcons();
}

function getFilteredGear() {
  const search = document.getElementById("gearSearch").value.toLowerCase();
  const activeCat = document.querySelector("#categoryFilter .chip.active")?.dataset.category || "all";

  let filtered = gearItems.filter(g => {
    const matchSearch = !search || g.name.toLowerCase().includes(search) || g.category.toLowerCase().includes(search);
    const matchCat = activeCat === "all" || g.category === activeCat;
    return matchSearch && matchCat;
  });

  filtered.sort((a, b) => {
    let aVal = a[sortCol];
    let bVal = b[sortCol];
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
}

function renderGear() {
  renderCategoryFilters();
  const filtered = getFilteredGear();
  const tbody = document.getElementById("gearBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">
      <div class="empty-state">
        <i data-lucide="camera-off"></i>
        <p>No gear found. Add your first item above.</p>
      </div>
    </td></tr>`;
    lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map(g => `
    <tr data-id="${g.id}">
      <td><strong>${escapeHtml(g.name)}</strong></td>
      <td><span class="td-category">${escapeHtml(g.category)}</span></td>
      <td class="td-weight">${g.weight.toFixed(2)}</td>
      <td class="td-right">
        <div class="td-actions">
          <button class="btn-ghost" onclick="openGearModal(${g.id})" title="Edit"><i data-lucide="pencil"></i></button>
          <button class="btn-danger" onclick="deleteGear(${g.id})" title="Delete"><i data-lucide="trash-2"></i></button>
        </div>
      </td>
    </tr>
  `).join("");
  lucide.createIcons();
}

// ---- Stats ----
function updateStats() {
  document.getElementById("statTotalItems").textContent = gearItems.length;
  const totalW = gearItems.reduce((s, g) => s + g.weight, 0);
  document.getElementById("statTotalWeight").textContent = totalW.toFixed(1) + " lb";
  document.getElementById("statCategories").textContent = getCategories().length;
}

// ---- Gear CRUD ----
function openGearModal(id) {
  const item = id ? gearItems.find(g => g.id === id) : null;
  document.getElementById("modalTitle").textContent = item ? "Edit Gear" : "Add Gear";

  const cats = getCategories();
  const catOptions = [...new Set([...cats, "Camera Bodies", "Lenses", "Tripods", "Heads", "Bags", "Filters", "Accessories", "Electronics", "Personal"])].sort();

  document.getElementById("modalBody").innerHTML = `
    <div class="form-field">
      <label for="gearName">Item Name</label>
      <input type="text" id="gearName" value="${item ? escapeHtml(item.name) : ""}" placeholder="e.g. Canon RF 70-200mm f/2.8">
    </div>
    <div class="form-field">
      <label for="gearWeight">Weight (lb)</label>
      <input type="number" id="gearWeight" value="${item ? item.weight : ""}" placeholder="e.g. 2.5" step="0.01" min="0">
    </div>
    <div class="form-field">
      <label for="gearCategory">Category</label>
      <select id="gearCategory">
        ${catOptions.map(c => `<option value="${c}" ${item && item.category === c ? "selected" : ""}>${c}</option>`).join("")}
      </select>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveGear(${id || 'null'})">${item ? "Save Changes" : "Add Gear"}</button>
    </div>
  `;
  openModal();
  setTimeout(() => document.getElementById("gearName").focus(), 100);
}

function saveGear(id) {
  const name = document.getElementById("gearName").value.trim();
  const weight = parseFloat(document.getElementById("gearWeight").value);
  const category = document.getElementById("gearCategory").value;

  if (!name) { showToast("Please enter an item name", "error"); return; }
  if (isNaN(weight) || weight < 0) { showToast("Please enter a valid weight", "error"); return; }

  if (id) {
    const item = gearItems.find(g => g.id === id);
    if (item) { item.name = name; item.weight = weight; item.category = category; }
    showToast("Gear updated", "success");
  } else {
    gearItems.push({ id: gearIdCounter++, name, weight, category });
    showToast("Gear added", "success");
  }

  saveData();
  closeModal();
  renderGear();
  renderTrip();
  updateStats();
}

function deleteGear(id) {
  gearItems = gearItems.filter(g => g.id !== id);
  tripSelections.delete(id);
  saveData();
  renderGear();
  renderTrip();
  updateStats();
  showToast("Gear removed", "success");
}

// ---- Trip Planner ----
function renderTrip() {
  const container = document.getElementById("tripGearList");
  const sorted = [...gearItems].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  let currentCat = "";

  let html = "";
  for (const g of sorted) {
    if (g.category !== currentCat) {
      currentCat = g.category;
      html += `<div style="font-size:var(--text-xs);color:var(--color-text-faint);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-top:var(--space-4);margin-bottom:var(--space-2);padding-left:var(--space-1);">${escapeHtml(currentCat)}</div>`;
    }
    const selected = tripSelections.has(g.id);
    html += `
      <div class="trip-gear-item ${selected ? "selected" : ""}" data-trip-id="${g.id}">
        <div class="trip-checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span class="trip-gear-name">${escapeHtml(g.name)}</span>
        <span class="trip-gear-weight">${g.weight.toFixed(2)} lb</span>
      </div>
    `;
  }
  container.innerHTML = html;

  container.querySelectorAll(".trip-gear-item").forEach(el => {
    el.addEventListener("click", () => {
      const id = parseInt(el.dataset.tripId);
      if (tripSelections.has(id)) tripSelections.delete(id);
      else tripSelections.add(id);
      el.classList.toggle("selected");
      saveData();
      updateTripSummary();
    });
  });

  updateTripSummary();
}

function updateTripSummary() {
  const selectedItems = gearItems.filter(g => tripSelections.has(g.id));
  const totalWeight = selectedItems.reduce((s, g) => s + g.weight, 0);
  const limit = parseFloat(document.getElementById("weightLimit").value) || 30;
  const remaining = limit - totalWeight;

  document.getElementById("tripWeightValue").textContent = totalWeight.toFixed(1);
  document.getElementById("tripItemCount").textContent = selectedItems.length;

  const remEl = document.getElementById("tripRemaining");
  remEl.textContent = remaining.toFixed(1) + " lb";
  remEl.style.color = remaining < 0 ? "var(--color-error)" : "var(--color-success)";

  // Update ring
  const ring = document.getElementById("weightRing");
  const circumference = 2 * Math.PI * 52; // r=52
  const pct = Math.min(totalWeight / limit, 1);
  ring.style.strokeDashoffset = circumference * (1 - pct);
  ring.style.stroke = pct > 1 ? "var(--color-error)" : pct > 0.8 ? "var(--color-warning)" : "var(--color-primary)";
  ring.style.transition = "stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease";
}

function clearTrip() {
  tripSelections.clear();
  saveData();
  renderTrip();
  showToast("Trip selection cleared", "success");
}

// ---- Links ----
function renderLinks() {
  const container = document.getElementById("linksGrid");
  if (links.length === 0) {
    container.innerHTML = `<div class="empty-state"><i data-lucide="link"></i><p>No links yet. Add your favorite photography resources.</p></div>`;
    lucide.createIcons();
    return;
  }

  container.innerHTML = links.map(l => `
    <div class="link-card" data-link-id="${l.id}">
      <div class="link-card-header">
        <div class="link-card-icon"><i data-lucide="globe"></i></div>
        <div class="link-card-actions">
          <button class="btn-ghost" onclick="openLinkModal(${l.id})" title="Edit"><i data-lucide="pencil"></i></button>
          <button class="btn-danger" onclick="deleteLink(${l.id})" title="Delete"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
      <div class="link-card-title">${escapeHtml(l.title)}</div>
      <div class="link-card-desc">${escapeHtml(l.description || "")}</div>
      <a class="link-card-url" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">
        <span>${escapeHtml(l.url)}</span>
        <i data-lucide="external-link"></i>
      </a>
    </div>
  `).join("");
  lucide.createIcons();
}

function openLinkModal(id) {
  const item = id ? links.find(l => l.id === id) : null;
  document.getElementById("modalTitle").textContent = item ? "Edit Link" : "Add Link";
  document.getElementById("modalBody").innerHTML = `
    <div class="form-field">
      <label for="linkTitle">Title</label>
      <input type="text" id="linkTitle" value="${item ? escapeHtml(item.title) : ""}" placeholder="e.g. GetDPI">
    </div>
    <div class="form-field">
      <label for="linkUrl">URL</label>
      <input type="url" id="linkUrl" value="${item ? escapeHtml(item.url) : ""}" placeholder="https://example.com">
    </div>
    <div class="form-field">
      <label for="linkDesc">Description</label>
      <textarea id="linkDesc" placeholder="Brief description...">${item ? escapeHtml(item.description || "") : ""}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveLink(${id || 'null'})">${item ? "Save Changes" : "Add Link"}</button>
    </div>
  `;
  openModal();
  setTimeout(() => document.getElementById("linkTitle").focus(), 100);
}

function saveLink(id) {
  const title = document.getElementById("linkTitle").value.trim();
  const url = document.getElementById("linkUrl").value.trim();
  const description = document.getElementById("linkDesc").value.trim();

  if (!title) { showToast("Please enter a title", "error"); return; }
  if (!url) { showToast("Please enter a URL", "error"); return; }

  if (id) {
    const item = links.find(l => l.id === id);
    if (item) { item.title = title; item.url = url; item.description = description; }
    showToast("Link updated", "success");
  } else {
    links.push({ id: linkIdCounter++, title, url, description });
    showToast("Link added", "success");
  }

  saveData();
  closeModal();
  renderLinks();
}

function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveData();
  renderLinks();
  showToast("Link removed", "success");
}

// ---- Techniques ----
function renderTechniques() {
  const container = document.getElementById("techniqueSections");
  if (techniques.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = techniques.map(t => `
    <div class="technique-card" data-tech-id="${t.id}">
      <div class="technique-card-header">
        <h3>${escapeHtml(t.title)}</h3>
        <div class="td-actions">
          <button class="btn-ghost" onclick="openTechniqueModal(${t.id})" title="Edit"><i data-lucide="pencil"></i></button>
          <button class="btn-danger" onclick="deleteTechnique(${t.id})" title="Delete"><i data-lucide="trash-2"></i></button>
        </div>
      </div>
      <div class="technique-card-body">${escapeHtml(t.content)}</div>
    </div>
  `).join("");
  lucide.createIcons();
}

function openTechniqueModal(id) {
  const item = id ? techniques.find(t => t.id === id) : null;
  document.getElementById("modalTitle").textContent = item ? "Edit Section" : "Add Section";
  document.getElementById("modalBody").innerHTML = `
    <div class="form-field">
      <label for="techTitle">Title</label>
      <input type="text" id="techTitle" value="${item ? escapeHtml(item.title) : ""}" placeholder="e.g. Hyperfocal Distance Tips">
    </div>
    <div class="form-field">
      <label for="techContent">Content</label>
      <textarea id="techContent" style="min-height:200px" placeholder="Your notes, techniques, formulas...">${item ? escapeHtml(item.content || "") : ""}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveTechnique(${id || 'null'})">${item ? "Save Changes" : "Add Section"}</button>
    </div>
  `;
  openModal();
  setTimeout(() => document.getElementById("techTitle").focus(), 100);
}

function saveTechnique(id) {
  const title = document.getElementById("techTitle").value.trim();
  const content = document.getElementById("techContent").value.trim();

  if (!title) { showToast("Please enter a title", "error"); return; }

  if (id) {
    const item = techniques.find(t => t.id === id);
    if (item) { item.title = title; item.content = content; }
    showToast("Section updated", "success");
  } else {
    techniques.push({ id: techIdCounter++, title, content });
    showToast("Section added", "success");
  }

  saveData();
  closeModal();
  renderTechniques();
}

function deleteTechnique(id) {
  techniques = techniques.filter(t => t.id !== id);
  saveData();
  renderTechniques();
  showToast("Section removed", "success");
}

// ---- Calculators ----
function calculateDOF() {
  const focal = parseFloat(document.getElementById("dofFocal").value);
  const aperture = parseFloat(document.getElementById("dofAperture").value);
  const distanceFt = parseFloat(document.getElementById("dofDistance").value);
  const coc = parseFloat(document.getElementById("dofSensor").value); // circle of confusion in mm

  if (isNaN(focal) || isNaN(aperture) || isNaN(distanceFt)) return;

  const distanceMM = distanceFt * 304.8;
  const H = (focal * focal) / (aperture * coc) + focal; // hyperfocal

  const nearMM = (distanceMM * (H - focal)) / (H + distanceMM - 2 * focal);
  const farMM = distanceMM < H ? (distanceMM * (H - focal)) / (H - distanceMM) : Infinity;

  const nearFt = nearMM / 304.8;
  const farFt = farMM === Infinity ? Infinity : farMM / 304.8;
  const totalFt = farFt === Infinity ? Infinity : farFt - nearFt;

  document.getElementById("dofNear").textContent = nearFt.toFixed(2) + " ft";
  document.getElementById("dofFar").textContent = farFt === Infinity ? "Infinity" : farFt.toFixed(2) + " ft";
  document.getElementById("dofTotal").textContent = totalFt === Infinity ? "Infinity" : totalFt.toFixed(2) + " ft";
}

function calculateExposure() {
  const baseSpeed = parseFloat(document.getElementById("expShutter").value);
  const ndStops = parseInt(document.getElementById("expND").value);

  const newSpeed = baseSpeed * Math.pow(2, ndStops);

  let display;
  if (newSpeed < 0.5) {
    const denom = Math.round(1 / newSpeed);
    display = "1/" + denom + "s";
  } else if (newSpeed < 60) {
    display = newSpeed.toFixed(1) + "s";
  } else {
    const min = Math.floor(newSpeed / 60);
    const sec = Math.round(newSpeed % 60);
    display = min + "m " + sec + "s";
  }
  document.getElementById("expNew").textContent = display;
}

function calculateExtension() {
  const focal = parseFloat(document.getElementById("extFocal").value);
  const nativeMag = parseFloat(document.getElementById("extNativeMag").value);
  const extLen = parseFloat(document.getElementById("extLength").value);
  const fstop = parseFloat(document.getElementById("extAperture").value);
  const diopter = parseFloat(document.getElementById("extDiopter").value) || 0;
  const sensorStr = document.getElementById("extSensor").value;

  if (isNaN(focal) || isNaN(nativeMag) || isNaN(extLen) || isNaN(fstop)) return;

  // Parse sensor dimensions
  const [sW, sH] = sensorStr.split("x").map(Number);

  // Magnification gain from extension tube: extension / focal length
  const tubeMagGain = extLen / focal;

  // Magnification gain from close-up diopter lens:
  // diopter magnification gain = focal_length(mm) * diopter / 1000
  const diopterMagGain = diopter > 0 ? (focal * diopter) / 1000 : 0;

  // Total magnification
  const totalMag = nativeMag + tubeMagGain + diopterMagGain;

  // Effective f-stop: f-stop * (1 + magnification)
  const effFstop = fstop * (1 + totalMag);

  // Light loss in stops: 2 * log2(1 + magnification)
  const lightLoss = 2 * Math.log2(1 + totalMag);

  // Field of view (approximate): sensor dimension / magnification
  let fovStr = "—";
  if (totalMag > 0) {
    const fovW = sW / totalMag;
    const fovH = sH / totalMag;
    if (fovW < 1000) {
      fovStr = fovW.toFixed(1) + " x " + fovH.toFixed(1) + " mm";
    } else {
      fovStr = (fovW / 10).toFixed(1) + " x " + (fovH / 10).toFixed(1) + " cm";
    }
  }

  // Working distance approximation (thin lens formula)
  // Total extension from sensor = focal * (1 + totalMag)
  // Subject distance from sensor = focal * (1 + 1/totalMag)  (when totalMag > 0)
  // Working distance = subject distance from sensor - (lens physical length estimate + extension)
  // Rough lens length estimate: ~focal length for primes
  let workDistStr = "—";
  if (totalMag > 0.01) {
    const subjectDist = focal * (1 + 1 / totalMag); // mm from sensor
    const lensLength = focal * 0.8; // rough estimate
    const workDist = subjectDist - lensLength - extLen;
    if (workDist > 0) {
      if (workDist >= 25.4) {
        workDistStr = (workDist / 25.4).toFixed(1) + " in (" + workDist.toFixed(0) + " mm)";
      } else {
        workDistStr = workDist.toFixed(1) + " mm";
      }
    } else {
      workDistStr = "Cannot focus (too close)";
    }
  }

  document.getElementById("extMagGain").textContent = tubeMagGain.toFixed(3) + "X";
  document.getElementById("extDiopterGain").textContent = diopter > 0 ? diopterMagGain.toFixed(3) + "X" : "N/A";
  document.getElementById("extTotalMag").textContent = totalMag.toFixed(3) + "X";
  document.getElementById("extEffFstop").textContent = "f/" + effFstop.toFixed(1);
  document.getElementById("extLightLoss").textContent = lightLoss.toFixed(1) + " stops";
  document.getElementById("extFOV").textContent = fovStr;
  document.getElementById("extWorkDist").textContent = workDistStr;
}

function calculateStar() {
  const focal = parseFloat(document.getElementById("starFocal").value);
  const crop = parseFloat(document.getElementById("starSensor").value);

  if (isNaN(focal) || isNaN(crop)) return;

  const effectiveFocal = focal * crop;
  const rule500 = 500 / effectiveFocal;
  // NPF rule approximation (for 24MP sensor): (35 * aperture + 30 * pixel_pitch) / focal
  // Simplified: ~250 / (focal * crop)
  const npf = 250 / effectiveFocal;

  document.getElementById("star500").textContent = rule500.toFixed(1) + "s";
  document.getElementById("starNPF").textContent = npf.toFixed(1) + "s";
}

// ---- Modal ----
function openModal() {
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ---- Toast ----
function showToast(message, type) {
  const container = document.getElementById("toastContainer");
  const icon = type === "success" ? "check-circle" : "alert-circle";
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.animation = "toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---- Utility ----
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Boot ----
document.addEventListener("DOMContentLoaded", init);
