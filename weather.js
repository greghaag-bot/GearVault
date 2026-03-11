/* ============================================
   GearVault — Weather Module
   ============================================ */

(function () {
  "use strict";

  // ---- WMO Weather Code Mapping ----
  const WMO_CODES = {
    0: { desc: "Clear sky", icon: "sun" },
    1: { desc: "Mainly clear", icon: "sun" },
    2: { desc: "Partly cloudy", icon: "cloud-sun" },
    3: { desc: "Overcast", icon: "cloud" },
    45: { desc: "Fog", icon: "cloud-fog" },
    48: { desc: "Depositing rime fog", icon: "cloud-fog" },
    51: { desc: "Light drizzle", icon: "cloud-drizzle" },
    53: { desc: "Moderate drizzle", icon: "cloud-drizzle" },
    55: { desc: "Dense drizzle", icon: "cloud-drizzle" },
    56: { desc: "Light freezing drizzle", icon: "cloud-snow" },
    57: { desc: "Dense freezing drizzle", icon: "cloud-snow" },
    61: { desc: "Slight rain", icon: "cloud-rain" },
    63: { desc: "Moderate rain", icon: "cloud-rain" },
    65: { desc: "Heavy rain", icon: "cloud-rain" },
    66: { desc: "Light freezing rain", icon: "cloud-snow" },
    67: { desc: "Heavy freezing rain", icon: "cloud-snow" },
    71: { desc: "Slight snow", icon: "snowflake" },
    73: { desc: "Moderate snow", icon: "snowflake" },
    75: { desc: "Heavy snow", icon: "snowflake" },
    77: { desc: "Snow grains", icon: "snowflake" },
    80: { desc: "Slight rain showers", icon: "cloud-rain" },
    81: { desc: "Moderate rain showers", icon: "cloud-rain" },
    82: { desc: "Violent rain showers", icon: "cloud-rain" },
    85: { desc: "Slight snow showers", icon: "snowflake" },
    86: { desc: "Heavy snow showers", icon: "snowflake" },
    95: { desc: "Thunderstorm", icon: "cloud-lightning" },
    96: { desc: "Thunderstorm w/ slight hail", icon: "cloud-lightning" },
    99: { desc: "Thunderstorm w/ heavy hail", icon: "cloud-lightning" },
  };

  function getWeatherInfo(code) {
    return WMO_CODES[code] || { desc: "Unknown", icon: "cloud" };
  }

  function windDirection(deg) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
  }

  function formatTime(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  function formatDay(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  // Golden hour: ~first/last hour of sunlight (sun within 6° of horizon)
  // Approximation: 30-60 min after sunrise and before sunset
  function goldenHour(sunriseISO, sunsetISO) {
    const rise = new Date(sunriseISO);
    const set = new Date(sunsetISO);

    const goldenMorningStart = new Date(rise.getTime());
    const goldenMorningEnd = new Date(rise.getTime() + 60 * 60 * 1000);
    const goldenEveningStart = new Date(set.getTime() - 60 * 60 * 1000);
    const goldenEveningEnd = new Date(set.getTime());

    // Blue hour: ~20-30 min before sunrise and after sunset
    const blueMorningStart = new Date(rise.getTime() - 30 * 60 * 1000);
    const blueMorningEnd = new Date(rise.getTime());
    const blueEveningStart = new Date(set.getTime());
    const blueEveningEnd = new Date(set.getTime() + 30 * 60 * 1000);

    return {
      goldenMorning: { start: goldenMorningStart, end: goldenMorningEnd },
      goldenEvening: { start: goldenEveningStart, end: goldenEveningEnd },
      blueMorning: { start: blueMorningStart, end: blueMorningEnd },
      blueEvening: { start: blueEveningStart, end: blueEveningEnd },
    };
  }

  function fmtTime(date) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  // ---- Search ----
  let searchTimeout = null;

  function initWeather() {
    const input = document.getElementById("weatherSearch");
    if (!input) return;

    input.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      const q = input.value.trim();
      if (q.length < 2) {
        hideResults();
        return;
      }
      searchTimeout = setTimeout(() => searchLocation(q), 350);
    });

    // Close results on click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".weather-search-box")) hideResults();
    });

    // Keyboard nav
    input.addEventListener("keydown", (e) => {
      const results = document.getElementById("weatherSearchResults");
      const items = results.querySelectorAll(".weather-result-item");
      if (!items.length) return;

      let active = results.querySelector(".weather-result-item.active");
      let idx = [...items].indexOf(active);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (active) active.classList.remove("active");
        idx = (idx + 1) % items.length;
        items[idx].classList.add("active");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (active) active.classList.remove("active");
        idx = idx <= 0 ? items.length - 1 : idx - 1;
        items[idx].classList.add("active");
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (active) active.click();
        else if (items.length) items[0].click();
      }
    });
  }

  async function searchLocation(query) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || !data.results.length) {
        showResults([]);
        return;
      }
      showResults(data.results);
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  }

  function showResults(results) {
    const container = document.getElementById("weatherSearchResults");
    if (!results.length) {
      container.innerHTML = '<div class="weather-result-empty">No locations found</div>';
      container.classList.add("open");
      return;
    }

    container.innerHTML = results
      .map((r) => {
        const parts = [r.name];
        if (r.admin1 && r.admin1 !== r.name) parts.push(r.admin1);
        if (r.country) parts.push(r.country);
        return `<div class="weather-result-item" data-lat="${r.latitude}" data-lon="${r.longitude}" data-tz="${r.timezone || ""}" data-name="${r.name}, ${r.admin1 || r.country || ""}">
          <i data-lucide="map-pin"></i>
          <span>${parts.join(", ")}</span>
        </div>`;
      })
      .join("");
    container.classList.add("open");
    lucide.createIcons();

    container.querySelectorAll(".weather-result-item").forEach((el) => {
      el.addEventListener("click", () => {
        const lat = parseFloat(el.dataset.lat);
        const lon = parseFloat(el.dataset.lon);
        const tz = el.dataset.tz;
        const name = el.dataset.name;
        document.getElementById("weatherSearch").value = name;
        hideResults();
        fetchWeather(lat, lon, tz, name);
      });
    });
  }

  function hideResults() {
    const container = document.getElementById("weatherSearchResults");
    container.classList.remove("open");
    container.innerHTML = "";
  }

  // ---- Fetch Weather ----
  async function fetchWeather(lat, lon, tz, name) {
    const content = document.getElementById("weatherContent");
    const empty = document.getElementById("weatherEmpty");
    const loading = document.getElementById("weatherLoading");

    empty.style.display = "none";
    content.style.display = "none";
    loading.style.display = "flex";

    try {
      const timezone = tz || "auto";
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,cloud_cover_mean` +
        `&timezone=${encodeURIComponent(timezone)}` +
        `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=7`;

      const res = await fetch(url);
      const data = await res.json();

      renderCurrent(data, name);
      renderSun(data);
      renderForecast(data);

      loading.style.display = "none";
      content.style.display = "block";
      lucide.createIcons();
    } catch (err) {
      console.error("Weather fetch error:", err);
      loading.style.display = "none";
      empty.style.display = "flex";
    }
  }

  // ---- Render Current ----
  function renderCurrent(data, name) {
    const c = data.current;
    const info = getWeatherInfo(c.weather_code);

    document.getElementById("weatherCurrent").innerHTML = `
      <div class="wc-main">
        <div class="wc-icon"><i data-lucide="${info.icon}"></i></div>
        <div class="wc-temp">${Math.round(c.temperature_2m)}°</div>
        <div class="wc-details">
          <div class="wc-location">${escapeHtml(name)}</div>
          <div class="wc-condition">${info.desc}</div>
          <div class="wc-feels">Feels like ${Math.round(c.apparent_temperature)}°F</div>
        </div>
      </div>
      <div class="wc-stats">
        <div class="wc-stat">
          <i data-lucide="wind"></i>
          <div>
            <span class="wc-stat-value">${c.wind_speed_10m} mph</span>
            <span class="wc-stat-label">${windDirection(c.wind_direction_10m)} Wind</span>
          </div>
        </div>
        <div class="wc-stat">
          <i data-lucide="droplets"></i>
          <div>
            <span class="wc-stat-value">${c.relative_humidity_2m}%</span>
            <span class="wc-stat-label">Humidity</span>
          </div>
        </div>
        <div class="wc-stat">
          <i data-lucide="cloud"></i>
          <div>
            <span class="wc-stat-value">${c.cloud_cover}%</span>
            <span class="wc-stat-label">Cloud Cover</span>
          </div>
        </div>
        <div class="wc-stat">
          <i data-lucide="umbrella"></i>
          <div>
            <span class="wc-stat-value">${c.precipitation} in</span>
            <span class="wc-stat-label">Precipitation</span>
          </div>
        </div>
      </div>
    `;
  }

  // ---- Render Sun/Golden Hour ----
  function renderSun(data) {
    const sunrise = data.daily.sunrise[0];
    const sunset = data.daily.sunset[0];
    const hours = goldenHour(sunrise, sunset);

    document.getElementById("weatherSun").innerHTML = `
      <h3 class="weather-sub-title">Sun & Golden Hour</h3>
      <div class="sun-grid">
        <div class="sun-card sun-card--blue">
          <div class="sun-card-icon"><i data-lucide="moon-star"></i></div>
          <div class="sun-card-label">Blue Hour (AM)</div>
          <div class="sun-card-time">${fmtTime(hours.blueMorning.start)} – ${fmtTime(hours.blueMorning.end)}</div>
        </div>
        <div class="sun-card sun-card--golden">
          <div class="sun-card-icon"><i data-lucide="sunrise"></i></div>
          <div class="sun-card-label">Golden Hour (AM)</div>
          <div class="sun-card-time">${fmtTime(hours.goldenMorning.start)} – ${fmtTime(hours.goldenMorning.end)}</div>
        </div>
        <div class="sun-card">
          <div class="sun-card-icon"><i data-lucide="sun"></i></div>
          <div class="sun-card-label">Sunrise</div>
          <div class="sun-card-time">${formatTime(sunrise)}</div>
        </div>
        <div class="sun-card">
          <div class="sun-card-icon"><i data-lucide="sunset"></i></div>
          <div class="sun-card-label">Sunset</div>
          <div class="sun-card-time">${formatTime(sunset)}</div>
        </div>
        <div class="sun-card sun-card--golden">
          <div class="sun-card-icon"><i data-lucide="sunset"></i></div>
          <div class="sun-card-label">Golden Hour (PM)</div>
          <div class="sun-card-time">${fmtTime(hours.goldenEvening.start)} – ${fmtTime(hours.goldenEvening.end)}</div>
        </div>
        <div class="sun-card sun-card--blue">
          <div class="sun-card-icon"><i data-lucide="moon-star"></i></div>
          <div class="sun-card-label">Blue Hour (PM)</div>
          <div class="sun-card-time">${fmtTime(hours.blueEvening.start)} – ${fmtTime(hours.blueEvening.end)}</div>
        </div>
      </div>
    `;
  }

  // ---- Render Forecast ----
  function renderForecast(data) {
    const d = data.daily;

    let html = '<h3 class="weather-sub-title">7-Day Forecast</h3><div class="forecast-grid">';
    for (let i = 0; i < d.time.length; i++) {
      const info = getWeatherInfo(d.weather_code[i]);
      const cloudCover = d.cloud_cover_mean[i];
      html += `
        <div class="forecast-card${i === 0 ? " forecast-card--today" : ""}">
          <div class="forecast-day">${formatDay(d.time[i])}</div>
          <div class="forecast-icon"><i data-lucide="${info.icon}"></i></div>
          <div class="forecast-temps">
            <span class="forecast-hi">${Math.round(d.temperature_2m_max[i])}°</span>
            <span class="forecast-lo">${Math.round(d.temperature_2m_min[i])}°</span>
          </div>
          <div class="forecast-desc">${info.desc}</div>
          <div class="forecast-meta">
            <span><i data-lucide="cloud"></i> ${cloudCover != null ? Math.round(cloudCover) + "%" : "—"}</span>
            <span><i data-lucide="umbrella"></i> ${d.precipitation_probability_max[i] != null ? d.precipitation_probability_max[i] + "%" : "—"}</span>
            <span><i data-lucide="wind"></i> ${Math.round(d.wind_speed_10m_max[i])}</span>
          </div>
        </div>
      `;
    }
    html += "</div>";
    document.getElementById("weatherForecast").innerHTML = html;
  }

  // Reuse escape from main app
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Boot ----
  document.addEventListener("DOMContentLoaded", initWeather);
})();
