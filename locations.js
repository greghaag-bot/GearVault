/* ============================================
   GearVault — Location Scouting Module
   ============================================ */

(function () {
  "use strict";

  // ---- State ----
  let locations = [];
  let locIdCounter = 1;
  let expandedLocationId = null;
  let activeRegionFilter = "all";

  // ---- US Regions (default grouping) ----
  const REGIONS = [
    "Southwest",
    "Pacific Northwest",
    "Rocky Mountains",
    "Southeast",
    "Northeast",
    "Midwest",
    "West Coast",
    "Hawaii",
    "Alaska",
    "International",
    "Other"
  ];

  // ---- Default Sample Locations ----
  const DEFAULT_LOCATIONS = [
    {
      name: "Yosemite Valley",
      region: "West Coast",
      state: "California",
      lat: "37.7456",
      lng: "-119.5936",
      notes: "Tunnel View, El Capitan meadow, Valley View. Fall colors in late October. Waterfalls best in spring (April–June).",
      bestSeason: "Spring / Fall",
      bestTime: "Golden hour — sunrise at Tunnel View, sunset at Valley View",
      bestConditions: "Clearing storms for dramatic clouds around granite walls",
      photos: []
    },
    {
      name: "White Sands",
      region: "Southwest",
      state: "New Mexico",
      lat: "32.7872",
      lng: "-106.3257",
      notes: "Endless gypsum dunes. Best patterns and textures in low-angle light. Backcountry camping permits available for sunset/sunrise shoots.",
      bestSeason: "Fall / Winter",
      bestTime: "Last 2 hours before sunset for warm sidelighting on dunes",
      bestConditions: "Blue sky with scattered clouds, or full moon nights",
      photos: []
    },
    {
      name: "Acadia National Park",
      region: "Northeast",
      state: "Maine",
      lat: "44.3386",
      lng: "-68.2733",
      notes: "Cadillac Mountain for first sunrise in the US. Bass Harbor Head Lighthouse. Jordan Pond reflections. Peak foliage mid-October.",
      bestSeason: "Fall",
      bestTime: "Pre-dawn Cadillac Mountain, blue hour at Bass Harbor",
      bestConditions: "Fog rolling in from the coast, peak foliage",
      photos: []
    }
  ];

  // ---- Initialize ----
  function initLocations() {
    loadLocationsData();
    renderLocations();
    bindLocationEvents();
  }

  function loadLocationsData() {
    if (locations.length === 0) {
      locations = DEFAULT_LOCATIONS.map(l => ({ ...l, id: locIdCounter++ }));
    }
  }

  function bindLocationEvents() {
    const addBtn = document.getElementById("addLocationBtn");
    if (addBtn) addBtn.addEventListener("click", () => openLocationModal());

    const searchInput = document.getElementById("locationSearch");
    if (searchInput) searchInput.addEventListener("input", renderLocations);
  }

  // ---- Region Filters ----
  function getUsedRegions() {
    const regions = new Set(locations.map(l => l.region));
    return [...regions].sort();
  }

  function renderRegionFilters() {
    const container = document.getElementById("regionFilter");
    if (!container) return;
    const regions = getUsedRegions();
    container.innerHTML = `<button class="chip ${activeRegionFilter === 'all' ? 'active' : ''}" data-region="all">All Regions</button>` +
      regions.map(r => `<button class="chip ${activeRegionFilter === r ? 'active' : ''}" data-region="${r}">${r}</button>`).join("");

    container.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        activeRegionFilter = chip.dataset.region;
        renderLocations();
      });
    });
  }

  // ---- Filtered Locations ----
  function getFilteredLocations() {
    const search = (document.getElementById("locationSearch")?.value || "").toLowerCase();
    const activeRegion = activeRegionFilter;

    return locations.filter(l => {
      const matchSearch = !search ||
        l.name.toLowerCase().includes(search) ||
        l.region.toLowerCase().includes(search) ||
        (l.state && l.state.toLowerCase().includes(search)) ||
        (l.notes && l.notes.toLowerCase().includes(search));
      const matchRegion = activeRegion === "all" || l.region === activeRegion;
      return matchSearch && matchRegion;
    });
  }

  // ---- Render ----
  function renderLocations() {
    renderRegionFilters();
    const filtered = getFilteredLocations();
    const container = document.getElementById("locationsGrid");
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <i data-lucide="map-pin-off"></i>
        <p>No locations found. Add your first scouting location above.</p>
      </div>`;
      lucide.createIcons();
      return;
    }

    // Group by region
    const grouped = {};
    for (const loc of filtered) {
      if (!grouped[loc.region]) grouped[loc.region] = [];
      grouped[loc.region].push(loc);
    }

    let html = "";
    const regionOrder = Object.keys(grouped).sort();

    for (const region of regionOrder) {
      html += `<div class="loc-region-group">
        <div class="loc-region-label">
          <i data-lucide="map"></i>
          <span>${escapeHtml(region)}</span>
          <span class="loc-region-count">${grouped[region].length}</span>
        </div>
        <div class="loc-cards">`;

      for (const loc of grouped[region]) {
        const isExpanded = expandedLocationId === loc.id;
        const hasCoords = loc.lat && loc.lng;
        const coordsDisplay = hasCoords ? `${parseFloat(loc.lat).toFixed(4)}°, ${parseFloat(loc.lng).toFixed(4)}°` : "";

        html += `<div class="loc-card ${isExpanded ? 'loc-card--expanded' : ''}" data-loc-id="${loc.id}">
          <div class="loc-card-main" data-expand-loc="${loc.id}">
            <div class="loc-card-info">
              <div class="loc-card-name">${escapeHtml(loc.name)}</div>
              <div class="loc-card-meta">
                ${loc.state ? `<span class="loc-meta-tag"><i data-lucide="map-pin"></i>${escapeHtml(loc.state)}</span>` : ""}
                ${loc.bestSeason ? `<span class="loc-meta-tag"><i data-lucide="calendar"></i>${escapeHtml(loc.bestSeason)}</span>` : ""}
                ${hasCoords ? `<span class="loc-meta-tag loc-meta-coords"><i data-lucide="navigation"></i>${coordsDisplay}</span>` : ""}
              </div>
            </div>
            <div class="loc-card-actions">
              <button class="btn-ghost" onclick="event.stopPropagation(); window._locModule.openLocationModal(${loc.id})" title="Edit"><i data-lucide="pencil"></i></button>
              <button class="btn-danger" onclick="event.stopPropagation(); window._locModule.deleteLocation(${loc.id})" title="Delete"><i data-lucide="trash-2"></i></button>
              <div class="loc-expand-icon"><i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}"></i></div>
            </div>
          </div>`;

        // Expanded detail
        if (isExpanded) {
          html += `<div class="loc-card-detail">`;

          // Best Time & Conditions
          if (loc.bestTime || loc.bestConditions) {
            html += `<div class="loc-detail-section">
              <div class="loc-detail-grid">`;
            if (loc.bestTime) {
              html += `<div class="loc-detail-item">
                <span class="loc-detail-label"><i data-lucide="sun"></i> Best Time</span>
                <span class="loc-detail-value">${escapeHtml(loc.bestTime)}</span>
              </div>`;
            }
            if (loc.bestConditions) {
              html += `<div class="loc-detail-item">
                <span class="loc-detail-label"><i data-lucide="cloud-sun"></i> Ideal Conditions</span>
                <span class="loc-detail-value">${escapeHtml(loc.bestConditions)}</span>
              </div>`;
            }
            html += `</div></div>`;
          }

          // Notes
          if (loc.notes) {
            html += `<div class="loc-detail-section">
              <span class="loc-detail-label"><i data-lucide="notebook-pen"></i> Notes</span>
              <div class="loc-detail-notes">${escapeHtml(loc.notes)}</div>
            </div>`;
          }

          // GPS link
          if (hasCoords) {
            html += `<div class="loc-detail-section">
              <a href="https://www.google.com/maps?q=${loc.lat},${loc.lng}" target="_blank" rel="noopener noreferrer" class="loc-map-link">
                <i data-lucide="external-link"></i>
                <span>Open in Google Maps</span>
              </a>
            </div>`;
          }

          // Photo Gallery
          if (loc.photos && loc.photos.length > 0) {
            html += `<div class="loc-detail-section">
              <span class="loc-detail-label"><i data-lucide="image"></i> Reference Photos</span>
              <div class="loc-photo-gallery">`;
            for (let i = 0; i < loc.photos.length; i++) {
              html += `<div class="loc-photo-thumb">
                <img src="${escapeHtml(loc.photos[i])}" alt="Reference photo" loading="lazy">
                <button class="loc-photo-remove" onclick="event.stopPropagation(); window._locModule.removePhoto(${loc.id}, ${i})" title="Remove photo"><i data-lucide="x"></i></button>
              </div>`;
            }
            html += `</div>`;
          }
          // Add photo button
          html += `<div class="loc-add-photo-row">
            <button class="btn btn-sm" onclick="event.stopPropagation(); window._locModule.addPhotoPrompt(${loc.id})">
              <i data-lucide="image-plus"></i>
              <span>Add Photo URL</span>
            </button>
          </div>`;

          html += `</div>`; // close loc-card-detail
        }

        html += `</div>`; // close loc-card
      }

      html += `</div></div>`; // close loc-cards, loc-region-group
    }

    container.innerHTML = html;

    // Bind expand/collapse
    container.querySelectorAll("[data-expand-loc]").forEach(el => {
      el.addEventListener("click", () => {
        const id = parseInt(el.dataset.expandLoc);
        expandedLocationId = expandedLocationId === id ? null : id;
        renderLocations();
        lucide.createIcons();
      });
    });

    lucide.createIcons();
  }

  // ---- Add / Edit Modal ----
  function openLocationModal(id) {
    const item = id ? locations.find(l => l.id === id) : null;
    document.getElementById("modalTitle").textContent = item ? "Edit Location" : "Add Location";

    const regionOptions = [...new Set([...REGIONS, ...getUsedRegions()])].sort();

    document.getElementById("modalBody").innerHTML = `
      <div class="form-field">
        <label for="locName">Location Name</label>
        <input type="text" id="locName" value="${item ? escapeHtml(item.name) : ""}" placeholder="e.g. Yosemite Valley">
      </div>
      <div class="form-row-2">
        <div class="form-field">
          <label for="locRegion">Region</label>
          <select id="locRegion">
            ${regionOptions.map(r => `<option value="${r}" ${item && item.region === r ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label for="locState">State / Country</label>
          <input type="text" id="locState" value="${item ? escapeHtml(item.state || "") : ""}" placeholder="e.g. California">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-field">
          <label for="locLat">Latitude</label>
          <input type="text" id="locLat" value="${item ? escapeHtml(item.lat || "") : ""}" placeholder="e.g. 37.7456">
        </div>
        <div class="form-field">
          <label for="locLng">Longitude</label>
          <input type="text" id="locLng" value="${item ? escapeHtml(item.lng || "") : ""}" placeholder="e.g. -119.5936">
        </div>
      </div>
      <div class="form-field">
        <label for="locBestSeason">Best Season</label>
        <input type="text" id="locBestSeason" value="${item ? escapeHtml(item.bestSeason || "") : ""}" placeholder="e.g. Spring / Fall">
      </div>
      <div class="form-field">
        <label for="locBestTime">Best Time of Day</label>
        <input type="text" id="locBestTime" value="${item ? escapeHtml(item.bestTime || "") : ""}" placeholder="e.g. Golden hour — sunrise from the east rim">
      </div>
      <div class="form-field">
        <label for="locBestConditions">Ideal Conditions</label>
        <input type="text" id="locBestConditions" value="${item ? escapeHtml(item.bestConditions || "") : ""}" placeholder="e.g. Clearing storms, fog in the valley">
      </div>
      <div class="form-field">
        <label for="locNotes">Notes</label>
        <textarea id="locNotes" placeholder="Detailed scouting notes — parking, permits, compositions, hazards...">${item ? escapeHtml(item.notes || "") : ""}</textarea>
      </div>
      <div class="form-actions">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="window._locModule.saveLocation(${id || 'null'})">${item ? "Save Changes" : "Add Location"}</button>
      </div>
    `;
    openModal();
    setTimeout(() => document.getElementById("locName").focus(), 100);
  }

  function saveLocation(id) {
    const name = document.getElementById("locName").value.trim();
    const region = document.getElementById("locRegion").value;
    const state = document.getElementById("locState").value.trim();
    const lat = document.getElementById("locLat").value.trim();
    const lng = document.getElementById("locLng").value.trim();
    const bestSeason = document.getElementById("locBestSeason").value.trim();
    const bestTime = document.getElementById("locBestTime").value.trim();
    const bestConditions = document.getElementById("locBestConditions").value.trim();
    const notes = document.getElementById("locNotes").value.trim();

    if (!name) { showToast("Please enter a location name", "error"); return; }

    if (id) {
      const item = locations.find(l => l.id === id);
      if (item) {
        item.name = name;
        item.region = region;
        item.state = state;
        item.lat = lat;
        item.lng = lng;
        item.bestSeason = bestSeason;
        item.bestTime = bestTime;
        item.bestConditions = bestConditions;
        item.notes = notes;
      }
      showToast("Location updated", "success");
    } else {
      locations.push({ id: locIdCounter++, name, region, state, lat, lng, bestSeason, bestTime, bestConditions, notes, photos: [] });
      showToast("Location added", "success");
    }

    if (typeof saveData === "function") saveData();
    closeModal();
    renderLocations();
    lucide.createIcons();
  }

  function deleteLocation(id) {
    locations = locations.filter(l => l.id !== id);
    if (expandedLocationId === id) expandedLocationId = null;
    if (typeof saveData === "function") saveData();
    renderLocations();
    lucide.createIcons();
    showToast("Location removed", "success");
  }

  // ---- Photo Gallery ----
  function addPhotoPrompt(locId) {
    const url = prompt("Enter image URL:");
    if (!url || !url.trim()) return;
    const loc = locations.find(l => l.id === locId);
    if (!loc) return;
    if (!loc.photos) loc.photos = [];
    loc.photos.push(url.trim());
    if (typeof saveData === "function") saveData();
    renderLocations();
    lucide.createIcons();
    showToast("Photo added", "success");
  }

  function removePhoto(locId, index) {
    const loc = locations.find(l => l.id === locId);
    if (!loc || !loc.photos) return;
    loc.photos.splice(index, 1);
    if (typeof saveData === "function") saveData();
    renderLocations();
    lucide.createIcons();
    showToast("Photo removed", "success");
  }

  // ---- Escape helper (reuse from main app if available) ----
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Expose for global access (used by inline onclick handlers and app.js init)
  window.initLocations = initLocations;
  window._locModule = {
    openLocationModal,
    saveLocation,
    deleteLocation,
    addPhotoPrompt,
    removePhoto
  };
})();
