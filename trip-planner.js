/* ============================================
   Trip Planner — Photography Trip Itineraries
   ============================================ */

// ---- State ----
let trips = [];
let tripIdGen = 1;
let tripDayIdGen = 1;
let activeTripId = null;

// ---- Initialize (called after DOM ready) ----
function initTripPlanner() {
  document.getElementById("addTripBtn").addEventListener("click", () => openTripModal());
  document.getElementById("tripBackBtn").addEventListener("click", showTripList);
  document.getElementById("addTripDayBtn").addEventListener("click", () => openDayModal());
  renderTripList();
}

// ---- Trip List ----
function renderTripList() {
  const grid = document.getElementById("tripsGrid");

  if (trips.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i data-lucide="map"></i>
        <p>No trips planned yet. Create your first photography trip.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = trips.map(t => {
    const dayCount = t.days.length;
    const locationList = t.days.map(d => d.location).filter(Boolean);
    const locPreview = locationList.length > 0
      ? locationList.slice(0, 3).join(" → ") + (locationList.length > 3 ? " ..." : "")
      : "No locations yet";
    const dateRange = getTripDateRange(t);

    return `
      <div class="trip-card" data-trip-card-id="${t.id}">
        <div class="trip-card-top">
          <div class="trip-card-icon"><i data-lucide="map-pin"></i></div>
          <div class="trip-card-actions">
            <button class="btn-ghost" onclick="event.stopPropagation(); openTripModal(${t.id})" title="Edit"><i data-lucide="pencil"></i></button>
            <button class="btn-danger" onclick="event.stopPropagation(); deleteTrip(${t.id})" title="Delete"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
        <div class="trip-card-title">${escapeHtml(t.name)}</div>
        <div class="trip-card-date">${dateRange}</div>
        <div class="trip-card-route">${escapeHtml(locPreview)}</div>
        <div class="trip-card-meta">
          <span><i data-lucide="calendar-days"></i> ${dayCount} day${dayCount !== 1 ? "s" : ""}</span>
        </div>
      </div>`;
  }).join("");

  // Click to open trip detail
  grid.querySelectorAll(".trip-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.tripCardId);
      openTripDetail(id);
    });
  });

  lucide.createIcons();
}

function getTripDateRange(trip) {
  const dates = trip.days.map(d => d.date).filter(Boolean).sort();
  if (dates.length === 0) return "Dates not set";
  if (dates.length === 1) return formatDateShort(dates[0]);
  return formatDateShort(dates[0]) + " — " + formatDateShort(dates[dates.length - 1]);
}

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---- Trip CRUD ----
function openTripModal(id) {
  const trip = id ? trips.find(t => t.id === id) : null;
  document.getElementById("modalTitle").textContent = trip ? "Edit Trip" : "New Trip";
  document.getElementById("modalBody").innerHTML = `
    <div class="form-field">
      <label for="tripName">Trip Name</label>
      <input type="text" id="tripName" value="${trip ? escapeHtml(trip.name) : ""}" placeholder="e.g. Death Valley Spring 2026">
    </div>
    <div class="form-field">
      <label for="tripNotes">Notes</label>
      <textarea id="tripNotes" placeholder="General trip notes, goals, or reminders...">${trip ? escapeHtml(trip.notes || "") : ""}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveTrip(${id || "null"})">${trip ? "Save Changes" : "Create Trip"}</button>
    </div>
  `;
  openModal();
  setTimeout(() => document.getElementById("tripName").focus(), 100);
}

function saveTrip(id) {
  const name = document.getElementById("tripName").value.trim();
  const notes = document.getElementById("tripNotes").value.trim();

  if (!name) { showToast("Please enter a trip name", "error"); return; }

  if (id) {
    const trip = trips.find(t => t.id === id);
    if (trip) { trip.name = name; trip.notes = notes; }
    showToast("Trip updated", "success");
  } else {
    trips.push({ id: tripIdGen++, name, notes, days: [] });
    showToast("Trip created", "success");
  }

  closeModal();
  renderTripList();
  if (activeTripId) renderTripDetail();
}

function deleteTrip(id) {
  trips = trips.filter(t => t.id !== id);
  if (activeTripId === id) {
    activeTripId = null;
    showTripList();
  }
  renderTripList();
  showToast("Trip deleted", "success");
}

// ---- Trip Detail View ----
function openTripDetail(id) {
  activeTripId = id;
  document.getElementById("tripListView").style.display = "none";
  document.getElementById("addTripBtn").style.display = "none";
  document.getElementById("tripDetailView").style.display = "block";
  renderTripDetail();
}

function showTripList() {
  activeTripId = null;
  document.getElementById("tripDetailView").style.display = "none";
  document.getElementById("addTripBtn").style.display = "";
  document.getElementById("tripListView").style.display = "";
  renderTripList();
}

function renderTripDetail() {
  const trip = trips.find(t => t.id === activeTripId);
  if (!trip) { showTripList(); return; }

  // Header
  const header = document.getElementById("tripDetailHeader");
  header.innerHTML = `
    <div class="trip-detail-title-row">
      <div>
        <h2 class="trip-detail-name">${escapeHtml(trip.name)}</h2>
        ${trip.notes ? `<p class="trip-detail-notes">${escapeHtml(trip.notes)}</p>` : ""}
      </div>
      <button class="btn btn-ghost" onclick="openTripModal(${trip.id})" title="Edit trip">
        <i data-lucide="pencil"></i>
      </button>
    </div>
    <div class="trip-detail-stats">
      <div class="trip-stat"><span class="trip-stat-value">${trip.days.length}</span><span class="trip-stat-label">Days</span></div>
      <div class="trip-stat"><span class="trip-stat-value">${trip.days.filter(d => d.location).length}</span><span class="trip-stat-label">Locations</span></div>
      <div class="trip-stat"><span class="trip-stat-value">${trip.days.reduce((s, d) => s + d.backups.length, 0)}</span><span class="trip-stat-label">Backups</span></div>
    </div>`;

  // Days
  const container = document.getElementById("tripDaysContainer");
  if (trip.days.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="margin:var(--space-8) 0;">
        <i data-lucide="calendar-plus"></i>
        <p>No days added yet. Start building your itinerary.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  // Sort days by date
  const sortedDays = [...trip.days].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  container.innerHTML = sortedDays.map((day, idx) => {
    const dayLabel = day.date ? formatDateShort(day.date) : `Day ${idx + 1}`;
    const mapsRouteUrl = day.driveFrom && day.location
      ? `https://www.google.com/maps/dir/${encodeURIComponent(day.driveFrom)}/${encodeURIComponent(day.location)}`
      : null;
    const lodgingUrl = day.location
      ? `https://www.google.com/maps/search/hotels+near+${encodeURIComponent(day.location)}`
      : null;

    return `
      <div class="trip-day-card" data-day-id="${day.id}">
        <div class="trip-day-header">
          <div class="trip-day-badge">${dayLabel}</div>
          <div class="td-actions">
            <button class="btn-ghost" onclick="openDayModal(${day.id})" title="Edit day"><i data-lucide="pencil"></i></button>
            <button class="btn-danger" onclick="deleteTripDay(${day.id})" title="Remove day"><i data-lucide="trash-2"></i></button>
          </div>
        </div>

        ${day.location ? `
        <div class="trip-day-location">
          <i data-lucide="map-pin"></i>
          <span>${escapeHtml(day.location)}</span>
        </div>` : ""}

        ${day.notes ? `<p class="trip-day-notes">${escapeHtml(day.notes)}</p>` : ""}

        <div class="trip-day-links">
          ${mapsRouteUrl ? `
          <a href="${mapsRouteUrl}" target="_blank" rel="noopener noreferrer" class="trip-day-link">
            <i data-lucide="navigation"></i>
            <span>Driving Route${day.driveFrom ? " from " + escapeHtml(day.driveFrom) : ""}</span>
            <i data-lucide="external-link"></i>
          </a>` : ""}

          ${lodgingUrl ? `
          <a href="${lodgingUrl}" target="_blank" rel="noopener noreferrer" class="trip-day-link">
            <i data-lucide="bed"></i>
            <span>Nearby Lodging</span>
            <i data-lucide="external-link"></i>
          </a>` : ""}
        </div>

        ${day.backups.length > 0 ? `
        <div class="trip-day-backups">
          <div class="trip-day-backups-label">
            <i data-lucide="shield"></i>
            <span>Backup Locations</span>
          </div>
          <div class="trip-day-backup-list">
            ${day.backups.map(b => `
              <div class="trip-backup-item">
                <span class="trip-backup-name">${escapeHtml(b.name)}</span>
                ${b.notes ? `<span class="trip-backup-note">${escapeHtml(b.notes)}</span>` : ""}
              </div>`).join("")}
          </div>
        </div>` : ""}
      </div>`;
  }).join("");

  lucide.createIcons();
}

// ---- Day CRUD ----
function openDayModal(dayId) {
  const trip = trips.find(t => t.id === activeTripId);
  if (!trip) return;

  const day = dayId ? trip.days.find(d => d.id === dayId) : null;
  document.getElementById("modalTitle").textContent = day ? "Edit Day" : "Add Day";

  const backupsHtml = day && day.backups.length > 0
    ? day.backups.map((b, i) => `
      <div class="form-backup-row" data-backup-idx="${i}">
        <input type="text" class="backup-name-input" value="${escapeHtml(b.name)}" placeholder="Location name">
        <input type="text" class="backup-note-input" value="${escapeHtml(b.notes || "")}" placeholder="Notes (optional)">
        <button class="btn-danger btn-sm" onclick="removeDayBackupRow(this)" title="Remove"><i data-lucide="x"></i></button>
      </div>`).join("")
    : "";

  document.getElementById("modalBody").innerHTML = `
    <div class="form-field">
      <label for="dayDate">Date</label>
      <input type="date" id="dayDate" value="${day ? day.date || "" : ""}">
    </div>
    <div class="form-field">
      <label for="dayLocation">Shooting Location</label>
      <input type="text" id="dayLocation" value="${day ? escapeHtml(day.location || "") : ""}" placeholder="e.g. Zabriskie Point, Death Valley">
    </div>
    <div class="form-field">
      <label for="dayDriveFrom">Driving From</label>
      <input type="text" id="dayDriveFrom" value="${day ? escapeHtml(day.driveFrom || "") : ""}" placeholder="e.g. Furnace Creek, CA">
    </div>
    <div class="form-field">
      <label for="dayNotes">Notes</label>
      <textarea id="dayNotes" placeholder="Sunrise time, shot ideas, conditions to watch for...">${day ? escapeHtml(day.notes || "") : ""}</textarea>
    </div>
    <div class="form-field">
      <label>Backup Locations</label>
      <div id="backupRows">${backupsHtml}</div>
      <button class="btn btn-ghost btn-sm" onclick="addDayBackupRow()" style="margin-top:var(--space-2);align-self:flex-start;">
        <i data-lucide="plus"></i> Add Backup Location
      </button>
    </div>
    <div class="form-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveTripDay(${dayId || "null"})">${day ? "Save Changes" : "Add Day"}</button>
    </div>
  `;
  openModal();
  lucide.createIcons();
  setTimeout(() => document.getElementById("dayDate").focus(), 100);
}

function addDayBackupRow() {
  const container = document.getElementById("backupRows");
  const idx = container.children.length;
  const row = document.createElement("div");
  row.className = "form-backup-row";
  row.dataset.backupIdx = idx;
  row.innerHTML = `
    <input type="text" class="backup-name-input" placeholder="Location name">
    <input type="text" class="backup-note-input" placeholder="Notes (optional)">
    <button class="btn-danger btn-sm" onclick="removeDayBackupRow(this)" title="Remove"><i data-lucide="x"></i></button>
  `;
  container.appendChild(row);
  lucide.createIcons();
  row.querySelector(".backup-name-input").focus();
}

function removeDayBackupRow(btn) {
  btn.closest(".form-backup-row").remove();
}

function saveTripDay(dayId) {
  const trip = trips.find(t => t.id === activeTripId);
  if (!trip) return;

  const date = document.getElementById("dayDate").value;
  const location = document.getElementById("dayLocation").value.trim();
  const driveFrom = document.getElementById("dayDriveFrom").value.trim();
  const notes = document.getElementById("dayNotes").value.trim();

  // Collect backups
  const backups = [];
  document.querySelectorAll(".form-backup-row").forEach(row => {
    const name = row.querySelector(".backup-name-input").value.trim();
    if (name) {
      backups.push({
        name,
        notes: row.querySelector(".backup-note-input").value.trim()
      });
    }
  });

  if (dayId) {
    const day = trip.days.find(d => d.id === dayId);
    if (day) {
      day.date = date;
      day.location = location;
      day.driveFrom = driveFrom;
      day.notes = notes;
      day.backups = backups;
    }
    showToast("Day updated", "success");
  } else {
    trip.days.push({
      id: tripDayIdGen++,
      date,
      location,
      driveFrom,
      notes,
      backups
    });
    showToast("Day added", "success");
  }

  closeModal();
  renderTripDetail();
}

function deleteTripDay(dayId) {
  const trip = trips.find(t => t.id === activeTripId);
  if (!trip) return;
  trip.days = trip.days.filter(d => d.id !== dayId);
  renderTripDetail();
  showToast("Day removed", "success");
}

// ---- Boot (attach after DOM ready) ----
document.addEventListener("DOMContentLoaded", initTripPlanner);
