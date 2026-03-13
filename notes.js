// ===== NOTES MODULE =====
// Field notes, shot ideas, trip planning, and photography journal
(function () {
  "use strict";

  let notes = [];
  let noteIdCounter = 1;
  let activeFilter = "all";
  let activeTagFilter = null;
  let searchQuery = "";
  let sortBy = "newest"; // newest, oldest, alpha
  let editingNoteId = null;

  // ---- Location list (pulled from locations module) ----
  function getLocationList() {
    if (window._locModule && typeof window._locModule.getLocations === "function") {
      return window._locModule.getLocations();
    }
    return [];
  }

  // ---- Categories ----
  const CATEGORIES = [
    { id: "field-note", label: "Field Note", icon: "map-pin", color: "#4F98A3" },
    { id: "shot-idea", label: "Shot Idea", icon: "camera", color: "#A84B2F" },
    { id: "gear-reminder", label: "Gear Reminder", icon: "backpack", color: "#6DAA45" },
    { id: "trip-planning", label: "Trip Planning", icon: "route", color: "#BB653B" },
    { id: "post-processing", label: "Post-Processing", icon: "sliders-horizontal", color: "#7A39BB" },
    { id: "general", label: "General", icon: "sticky-note", color: "#797876" }
  ];

  function getCategoryById(id) {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
  }

  // ---- Default notes ----
  const DEFAULT_NOTES = [
    {
      title: "Golden Hour Checklist",
      content: "Arrive 45 min before sunset. Set up composition during blue hour. Check wind for long exposures. Bracket 3-5 shots for HDR blending. Clean filters before every session. Remember to shoot both landscape and portrait orientations.",
      category: "field-note",
      tags: ["golden-hour", "workflow", "checklist"],
      locationId: null,
      photos: [],
      pinned: true,
      createdAt: "2026-03-01T08:00:00Z",
      updatedAt: "2026-03-01T08:00:00Z"
    },
    {
      title: "Focus Stacking Workflow",
      content: "1. Set to manual focus and live view. 2. Focus on nearest point, take shot. 3. Shift focus ring slightly toward infinity, shoot again. 4. Repeat until far distance is in focus (usually 5-12 frames). 5. Stack in Helicon Focus or Photoshop. Tip: Use f/8-f/11 for sharpest individual frames. Avoid f/16+ to minimize diffraction.",
      category: "post-processing",
      tags: ["focus-stacking", "technique", "sharpness"],
      locationId: null,
      photos: [],
      pinned: false,
      createdAt: "2026-03-05T10:00:00Z",
      updatedAt: "2026-03-05T10:00:00Z"
    }
  ];

  // ---- Helpers ----
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatDateShort(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function getAllTags() {
    const tagSet = new Set();
    notes.forEach(n => (n.tags || []).forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }

  function getFilteredNotes() {
    let result = notes.slice();

    // Category filter
    if (activeFilter !== "all") {
      result = result.filter(n => n.category === activeFilter);
    }

    // Tag filter
    if (activeTagFilter) {
      result = result.filter(n => (n.tags || []).includes(activeTagFilter));
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(n => {
        return (
          (n.title || "").toLowerCase().includes(q) ||
          (n.content || "").toLowerCase().includes(q) ||
          (n.tags || []).some(t => t.toLowerCase().includes(q)) ||
          getCategoryById(n.category).label.toLowerCase().includes(q)
        );
      });
    }

    // Sort — pinned always first
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === "newest") return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortBy === "oldest") return new Date(a.updatedAt) - new Date(b.updatedAt);
      if (sortBy === "alpha") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

    return result;
  }

  // ---- Render ----
  function renderNotes() {
    const grid = document.getElementById("notesGrid");
    const statsEl = document.getElementById("notesStats");
    const emptyEl = document.getElementById("notesEmpty");
    const tagCloud = document.getElementById("notesTagCloud");
    if (!grid) return;

    const filtered = getFilteredNotes();

    // Stats
    if (statsEl) {
      const totalNotes = notes.length;
      const totalTags = getAllTags().length;
      const pinnedCount = notes.filter(n => n.pinned).length;
      statsEl.innerHTML = `
        <div class="stat-card">
          <span class="stat-label">Total Notes</span>
          <span class="stat-value">${totalNotes}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Tags</span>
          <span class="stat-value">${totalTags}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pinned</span>
          <span class="stat-value">${pinnedCount}</span>
        </div>
      `;
    }

    // Tag cloud
    if (tagCloud) {
      const allTags = getAllTags();
      let tagHtml = `<button class="chip ${!activeTagFilter ? 'active' : ''}" data-tag-filter="all">All Tags</button>`;
      allTags.forEach(tag => {
        tagHtml += `<button class="chip ${activeTagFilter === tag ? 'active' : ''}" data-tag-filter="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
      });
      tagCloud.innerHTML = tagHtml;

      tagCloud.querySelectorAll("[data-tag-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
          const t = btn.getAttribute("data-tag-filter");
          activeTagFilter = t === "all" ? null : t;
          tagCloud.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
          btn.classList.add("active");
          renderNotes();
        });
      });
    }

    // Empty state
    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (emptyEl) {
        emptyEl.style.display = "";
        emptyEl.innerHTML = `
          <i data-lucide="notebook-pen"></i>
          <p>${searchQuery || activeFilter !== "all" || activeTagFilter ? "No notes match your search or filters." : "No notes yet. Add your first note to get started."}</p>
        `;
      }
      lucide.createIcons();
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";

    let html = "";
    filtered.forEach(note => {
      const cat = getCategoryById(note.category);
      const locations = getLocationList();
      const linkedLoc = note.locationId ? locations.find(l => l.id === note.locationId) : null;
      const linkedLocName = linkedLoc ? linkedLoc.name : null;

      html += `<div class="note-card ${note.pinned ? 'note-pinned' : ''}" data-note-id="${note.id}">
        <div class="note-card-header">
          <div class="note-card-cat" style="color: ${cat.color}">
            <i data-lucide="${cat.icon}"></i>
            <span>${escapeHtml(cat.label)}</span>
          </div>
          <div class="note-card-actions">
            <button class="note-action-btn" onclick="event.stopPropagation(); window._notesModule.togglePin(${note.id})" title="${note.pinned ? 'Unpin' : 'Pin'}">
              <i data-lucide="${note.pinned ? 'pin-off' : 'pin'}"></i>
            </button>
            <button class="note-action-btn" onclick="event.stopPropagation(); window._notesModule.editNote(${note.id})" title="Edit">
              <i data-lucide="pencil"></i>
            </button>
            <button class="note-action-btn note-action-delete" onclick="event.stopPropagation(); window._notesModule.deleteNote(${note.id})" title="Delete">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
        <h3 class="note-card-title">${escapeHtml(note.title)}</h3>
        <p class="note-card-content">${escapeHtml(note.content)}</p>`;

      // Photos
      if (note.photos && note.photos.length > 0) {
        html += `<div class="note-card-photos">`;
        note.photos.forEach((url, i) => {
          html += `<div class="note-photo-thumb">
            <img src="${escapeHtml(url)}" alt="Note photo" loading="lazy">
            <button class="note-photo-remove" onclick="event.stopPropagation(); window._notesModule.removePhoto(${note.id}, ${i})" title="Remove photo"><i data-lucide="x"></i></button>
          </div>`;
        });
        html += `</div>`;
      }

      // Tags
      if (note.tags && note.tags.length > 0) {
        html += `<div class="note-card-tags">`;
        note.tags.forEach(tag => {
          html += `<span class="note-tag" onclick="event.stopPropagation(); window._notesModule.filterByTag('${escapeHtml(tag)}')">${escapeHtml(tag)}</span>`;
        });
        html += `</div>`;
      }

      // Footer: linked location + date
      html += `<div class="note-card-footer">`;
      if (linkedLocName) {
        html += `<span class="note-card-location"><i data-lucide="map-pin"></i> ${escapeHtml(linkedLocName)}</span>`;
      }
      html += `<span class="note-card-date">${formatDateShort(note.updatedAt)}</span>`;
      html += `</div>`;

      html += `</div>`;
    });

    grid.innerHTML = html;
    lucide.createIcons();
  }

  // ---- CRUD ----
  function addNote() {
    editingNoteId = null;
    showNoteModal();
  }

  function editNote(id) {
    editingNoteId = id;
    showNoteModal(notes.find(n => n.id === id));
  }

  function deleteNote(id) {
    if (!confirm("Delete this note?")) return;
    notes = notes.filter(n => n.id !== id);
    renderNotes();
    showToast("Note deleted", "success");
  }

  function togglePin(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
      note.pinned = !note.pinned;
      renderNotes();
    }
  }

  function removePhoto(noteId, index) {
    const note = notes.find(n => n.id === noteId);
    if (!note || !note.photos) return;
    note.photos.splice(index, 1);
    renderNotes();
    showToast("Photo removed", "success");
  }

  function filterByTag(tag) {
    activeTagFilter = tag;
    renderNotes();
    // Scroll tag cloud to show active
    const tagCloud = document.getElementById("notesTagCloud");
    if (tagCloud) {
      tagCloud.querySelectorAll(".chip").forEach(c => {
        c.classList.toggle("active", c.getAttribute("data-tag-filter") === tag);
      });
    }
  }

  // ---- Modal ----
  function showNoteModal(note) {
    const overlay = document.getElementById("modalOverlay");
    const modal = document.getElementById("modal");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");
    if (!overlay || !modal || !body) return;

    title.textContent = note ? "Edit Note" : "New Note";
    modal.classList.add("modal-wide");

    // Build location options
    const locations = getLocationList();
    let locOptions = `<option value="">None</option>`;
    // Group by region
    const regionMap = {};
    locations.forEach(l => {
      const region = l.region || "Other";
      if (!regionMap[region]) regionMap[region] = [];
      regionMap[region].push(l);
    });
    Object.keys(regionMap).sort().forEach(region => {
      locOptions += `<optgroup label="${escapeHtml(region)}">`;
      regionMap[region].sort((a, b) => a.name.localeCompare(b.name)).forEach(l => {
        const selected = note && note.locationId === l.id ? "selected" : "";
        locOptions += `<option value="${l.id}" ${selected}>${escapeHtml(l.name)}</option>`;
      });
      locOptions += `</optgroup>`;
    });

    // Build category options
    let catOptions = "";
    CATEGORIES.forEach(cat => {
      const selected = note && note.category === cat.id ? "selected" : "";
      catOptions += `<option value="${cat.id}" ${selected}>${cat.label}</option>`;
    });

    // Build photo list
    const existingPhotos = (note && note.photos) ? note.photos : [];
    let photosHtml = "";
    existingPhotos.forEach((url, i) => {
      photosHtml += `<div class="note-modal-photo">
        <img src="${escapeHtml(url)}" alt="Photo ${i + 1}">
        <button type="button" class="note-modal-photo-remove" data-photo-index="${i}"><i data-lucide="x"></i></button>
      </div>`;
    });

    body.innerHTML = `
      <form id="noteForm" class="note-form">
        <div class="form-field">
          <label for="noteTitle">Title</label>
          <input type="text" id="noteTitle" value="${escapeHtml(note ? note.title : '')}" placeholder="Give your note a title..." required>
        </div>

        <div class="form-row-2col">
          <div class="form-field">
            <label for="noteCategory">Category</label>
            <select id="noteCategory">${catOptions}</select>
          </div>
          <div class="form-field">
            <label for="noteLocation">Linked Location</label>
            <select id="noteLocation">${locOptions}</select>
          </div>
        </div>

        <div class="form-field">
          <label for="noteContent">Content</label>
          <textarea id="noteContent" rows="6" placeholder="Write your note...">${escapeHtml(note ? note.content : '')}</textarea>
        </div>

        <div class="form-field">
          <label for="noteTags">Tags <span class="form-hint">(comma-separated)</span></label>
          <input type="text" id="noteTags" value="${escapeHtml(note ? (note.tags || []).join(', ') : '')}" placeholder="e.g., sunset, long-exposure, composition">
        </div>

        <div class="form-field">
          <label>Reference Photos</label>
          <div class="note-modal-photos" id="noteModalPhotos">${photosHtml}</div>
          <div class="note-add-photo-row">
            <input type="text" id="notePhotoUrl" placeholder="Paste image URL...">
            <button type="button" class="btn btn-sm" id="noteAddPhotoBtn">
              <i data-lucide="image-plus"></i> Add
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="noteCancelBtn">Cancel</button>
          <button type="submit" class="btn btn-primary">
            <i data-lucide="save"></i>
            <span>${note ? 'Update Note' : 'Save Note'}</span>
          </button>
        </div>
      </form>
    `;

    if (typeof openModal === 'function') openModal();
    else overlay.classList.add("open");
    lucide.createIcons();

    // Photo management in modal
    let modalPhotos = [...existingPhotos];

    function refreshPhotoList() {
      const container = document.getElementById("noteModalPhotos");
      if (!container) return;
      let ph = "";
      modalPhotos.forEach((url, i) => {
        ph += `<div class="note-modal-photo">
          <img src="${escapeHtml(url)}" alt="Photo ${i + 1}">
          <button type="button" class="note-modal-photo-remove" data-photo-index="${i}"><i data-lucide="x"></i></button>
        </div>`;
      });
      container.innerHTML = ph;
      lucide.createIcons();
      container.querySelectorAll(".note-modal-photo-remove").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-photo-index"));
          modalPhotos.splice(idx, 1);
          refreshPhotoList();
        });
      });
    }

    document.getElementById("noteAddPhotoBtn").addEventListener("click", () => {
      const urlInput = document.getElementById("notePhotoUrl");
      const url = (urlInput.value || "").trim();
      if (url) {
        modalPhotos.push(url);
        urlInput.value = "";
        refreshPhotoList();
      }
    });

    // Wire up remove buttons for initial photos
    document.querySelectorAll(".note-modal-photo-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-photo-index"));
        modalPhotos.splice(idx, 1);
        refreshPhotoList();
      });
    });

    // Cancel
    document.getElementById("noteCancelBtn").addEventListener("click", () => {
      if (typeof closeModal === 'function') closeModal();
      else overlay.classList.remove("open");
    });

    // Submit
    document.getElementById("noteForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const titleVal = document.getElementById("noteTitle").value.trim();
      const contentVal = document.getElementById("noteContent").value.trim();
      const categoryVal = document.getElementById("noteCategory").value;
      const locationVal = document.getElementById("noteLocation").value;
      const tagsVal = document.getElementById("noteTags").value;

      if (!titleVal) return;

      const parsedTags = tagsVal
        .split(",")
        .map(t => t.trim().toLowerCase().replace(/\s+/g, "-"))
        .filter(t => t.length > 0);

      const now = new Date().toISOString();

      if (editingNoteId !== null) {
        const existing = notes.find(n => n.id === editingNoteId);
        if (existing) {
          existing.title = titleVal;
          existing.content = contentVal;
          existing.category = categoryVal;
          existing.locationId = locationVal ? parseInt(locationVal) : null;
          existing.tags = parsedTags;
          existing.photos = modalPhotos.slice();
          existing.updatedAt = now;
        }
        showToast("Note updated", "success");
      } else {
        notes.push({
          id: noteIdCounter++,
          title: titleVal,
          content: contentVal,
          category: categoryVal,
          locationId: locationVal ? parseInt(locationVal) : null,
          tags: parsedTags,
          photos: modalPhotos.slice(),
          pinned: false,
          createdAt: now,
          updatedAt: now
        });
        showToast("Note added", "success");
      }

      if (typeof closeModal === 'function') closeModal();
      else overlay.classList.remove("open");
      editingNoteId = null;
      renderNotes();
    });
  }

  // ---- Toast (reuse from global if available) ----
  function showToast(message, type) {
    if (typeof window.showToast === "function") {
      window.showToast(message, type);
      return;
    }
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type || "info"}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ---- Init ----
  function initNotes() {
    // Load defaults
    if (notes.length === 0) {
      notes = DEFAULT_NOTES.map(n => ({ ...n, id: noteIdCounter++ }));
    }

    // Add Note button
    const addBtn = document.getElementById("addNoteBtn");
    if (addBtn) addBtn.addEventListener("click", addNote);

    // Search
    const searchInput = document.getElementById("notesSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderNotes();
      });
    }

    // Category filter chips
    const catFilter = document.getElementById("notesCategoryFilter");
    if (catFilter) {
      let chipHtml = `<button class="chip active" data-note-cat="all">All</button>`;
      CATEGORIES.forEach(cat => {
        chipHtml += `<button class="chip" data-note-cat="${cat.id}">${cat.label}</button>`;
      });
      catFilter.innerHTML = chipHtml;
      catFilter.querySelectorAll("[data-note-cat]").forEach(btn => {
        btn.addEventListener("click", () => {
          activeFilter = btn.getAttribute("data-note-cat");
          catFilter.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
          btn.classList.add("active");
          renderNotes();
        });
      });
    }

    // Sort
    const sortSelect = document.getElementById("notesSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderNotes();
      });
    }

    renderNotes();
  }

  // Expose for global access
  window._notesModule = {
    initNotes,
    renderNotes,
    addNote,
    editNote,
    deleteNote,
    togglePin,
    removePhoto,
    filterByTag
  };
})();
