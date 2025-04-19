// 📦 IMPORTS
console.log("🚀 Renderer loaded");
import "./index.css";

// 🌱 INITIAL SETUP
const generateBtn = document.getElementById("generate");
const enterBtn = document.getElementById("enter");
const pushBtn = document.getElementById("push");
const errorMsg = document.getElementById("error-msg");
const errorDate = document.getElementById("error-date");
const errorSleep = document.getElementById("error-sleep");
const errorWake = document.getElementById("error-wake");

const touched = { date: false, sleep: false, wake: false };

document.getElementById("open-github").onclick = () =>
  window.openTools.github();
document.getElementById("open-image").onclick = () => window.openTools.image();
document.getElementById("open-vscode").onclick = () =>
  window.openTools.vscode();

// 🛠️ VALIDATION FUNCTION
function validateForm() {
  const date = document.getElementById("date").value;
  const sh = document.getElementById("sleep-hour").value;
  const sm = document.getElementById("sleep-minute").value;
  const wh = document.getElementById("wake-hour").value;
  const wm = document.getElementById("wake-minute").value;

  const sleepHourInput = document.getElementById("sleep-hour");
  const sleepMinInput = document.getElementById("sleep-minute");
  const wakeHourInput = document.getElementById("wake-hour");
  const wakeMinInput = document.getElementById("wake-minute");

  if (errorMsg) errorMsg.textContent = "";
  if (errorDate) errorDate.textContent = "";
  if (errorSleep) errorSleep.textContent = "";
  if (errorWake) errorWake.textContent = "";

  [sleepHourInput, sleepMinInput, wakeHourInput, wakeMinInput].forEach(
    (input) => input.classList.remove("invalid")
  );

  const sleepHour = parseInt(sh, 10);
  const sleepMin = parseInt(sm, 10);
  const wakeHour = parseInt(wh, 10);
  const wakeMin = parseInt(wm, 10);

  let hasError = false;

  if (touched.sleep && (isNaN(sleepHour) || sleepHour < 0 || sleepHour > 23)) {
    sleepHourInput.classList.add("invalid");
    if (errorSleep) errorSleep.textContent = "Hour must be 0–23.";
    hasError = true;
  }

  if (touched.sleep && (isNaN(sleepMin) || sleepMin < 0 || sleepMin > 59)) {
    sleepMinInput.classList.add("invalid");
    if (errorSleep) errorSleep.textContent += " Minute must be 0–59.";
    hasError = true;
  }

  if (touched.wake && (isNaN(wakeHour) || wakeHour < 0 || wakeHour > 23)) {
    wakeHourInput.classList.add("invalid");
    if (errorWake) errorWake.textContent = "Hour must be 0–23.";
    hasError = true;
  }

  if (touched.wake && (isNaN(wakeMin) || wakeMin < 0 || wakeMin > 59)) {
    wakeMinInput.classList.add("invalid");
    if (errorWake) errorWake.textContent += " Minute must be 0–59.";
    hasError = true;
  }

  if (touched.date && !date) {
    if (errorDate) errorDate.textContent = "Please select a date.";
    hasError = true;
  }

  enterBtn.disabled = hasError;
  if (hasError) return false;

  const sleep = new Date(
    `${date}T${sh.padStart(2, "0")}:${sm.padStart(2, "0")}:00`
  );
  let wake = new Date(
    `${date}T${wh.padStart(2, "0")}:${wm.padStart(2, "0")}:00`
  );

  if (wake <= sleep) wake.setDate(wake.getDate() + 1);

  const duration = (wake - sleep) / 1000 / 60 / 60;
  if (duration <= 0 || duration > 24) {
    if (errorMsg) errorMsg.textContent = "Duration is invalid.";
    return false;
  }

  if (wake <= sleep && duration > 14) {
    if (errorMsg)
      errorMsg.textContent =
        "Wake time is over 14 hours after sleep. Please confirm.";
    return false;
  }

  function formatLocalISO(dateObj) {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
      dateObj.getDate()
    )}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`;
  }

  return {
    Date: new Date(date).toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    }),
    Sleep: formatLocalISO(sleep),
    Wake: formatLocalISO(wake),
    Duration: parseFloat(duration.toFixed(2)),
  };
}

["date", "sleep-hour", "sleep-minute", "wake-hour", "wake-minute"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("input", () => {
      if (id === "date") touched.date = true;
      if (id.startsWith("sleep")) touched.sleep = true;
      if (id.startsWith("wake")) touched.wake = true;
      validateForm();
    });
  }
);

// 🧼 Unify generate button styling
if (generateBtn) generateBtn.classList.add("btn-primary");
if (pushBtn) pushBtn.classList.add("btn-secondary");

// 🎯 GENERATE CHART
generateBtn.onclick = async () => {
  const preview = document.getElementById("preview");
  const loader = document.getElementById("loader");
  const placeholder = document.getElementById("placeholder");

  preview.classList.remove("loaded");
  preview.style.display = "none";
  placeholder.style.display = "none";
  loader.style.display = "block";

  try {
    const allRows = await window.sdv.getAllRows();
    if (!allRows || allRows.length === 0) {
      alert("No saved data to plot.");
      loader.style.display = "none";
      placeholder.style.display = "block";
      return;
    }

    const b64 = await window.sdv.genChart(allRows, allRows.length);
    if (!b64 || typeof b64 !== "string") {
      alert("Failed to generate chart. Please check your data.");
      loader.style.display = "none";
      placeholder.style.display = "block";
      return;
    }

    preview.src = "data:image/png;base64," + b64;
    preview.onload = () => {
      loader.style.display = "none";
      preview.classList.add("loaded");
      preview.style.display = "block";
    };
  } catch (err) {
    loader.style.display = "none";
    placeholder.style.display = "block";
    console.error("💥 Chart generation failed:", err);
  }
};

// 💾 SUBMIT SLEEP DATA
const sleepForm = document.getElementById("sleep-form");
sleepForm.onsubmit = async (e) => {
  e.preventDefault();
  const row = validateForm();
  if (!row) return;

  const existing = await window.sdv.getAllRows();
  const hasSameDate = existing.some((r) => r.Date === row.Date);
  const hasSameTime = existing.some(
    (r) => r.Sleep === row.Sleep && r.Wake === row.Wake
  );

  if (hasSameDate) {
    alert("❌ An entry with the same date already exists.");
    return;
  }

  if (hasSameTime) {
    alert("❌ This exact sleep time is already recorded.");
    return;
  }

  const sleepTime = new Date(row.Sleep);
  const wakeTime = new Date(row.Wake);
  const midnight = new Date(sleepTime);
  midnight.setHours(23, 59, 59, 0);
  const nextDay = new Date(sleepTime);
  nextDay.setDate(sleepTime.getDate() + 1);

  const rowsToSave =
    wakeTime <= sleepTime
      ? [
          {
            Date: sleepTime.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            }),
            Sleep: row.Sleep,
            Wake: formatLocalISO(midnight),
            Duration: parseFloat(((midnight - sleepTime) / 3600000).toFixed(2)),
          },
          {
            Date: nextDay.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            }),
            Sleep: formatLocalISO(new Date(nextDay.setHours(0, 0, 0, 0))),
            Wake: row.Wake,
            Duration: parseFloat(
              (
                (wakeTime - new Date(nextDay.setHours(0, 0, 0, 0))) /
                3600000
              ).toFixed(2)
            ),
          },
        ]
      : [row];

  for (const r of rowsToSave) {
    const result = await window.sdv.saveRow(r);
    if (!result.ok) {
      alert("❌ Failed to save part of the sleep entry.");
      return;
    }
  }
  clearForm();
  updateRowStats();
};

// 🚀 PUSH TO GITHUB
pushBtn.onclick = async () => {
  pushBtn.disabled = true;
  pushBtn.textContent = "Pushing...";

  const result = await window.sdv.commitAndPush();
  if (result.ok) {
    alert("✅ Pushed to GitHub!");
  } else {
    alert("❌ Failed to push to GitHub: " + result.error);
  }

  pushBtn.disabled = false;
  pushBtn.textContent = "Push to GitHub";
};

// ♻️ RESET FORM
function clearForm() {
  document.getElementById("date").value = "";
  document.getElementById("sleep-hour").value = "";
  document.getElementById("sleep-minute").value = "";
  document.getElementById("wake-hour").value = "";
  document.getElementById("wake-minute").value = "";
  if (errorMsg) errorMsg.textContent = "";
  enterBtn.disabled = true;
}

// 🧩 Helper
function formatLocalISO(dateObj) {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
    dateObj.getDate()
  )}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`;
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(target).classList.add("active");

    if (target === "summary") loadSleepSummary();
  });
});

async function updateRowStats() {
  const data = await window.sdv.getAllRows();
  const count = data.length;
  const earliest = count > 0 ? data[0].Date : "-";
  const latest = count > 0 ? data[data.length - 1].Date : "-";

  document.getElementById("row-count").textContent = count;
  document.getElementById("first-date").textContent = earliest;
  document.getElementById("latest-date").textContent = latest;
}

async function loadSleepSummary() {
  const data = await window.sdv.getAllRows();
  if (!data || data.length === 0) return;

  const recentContainer = document.getElementById("recent-summary");
  const totalContainer = document.getElementById("total-summary");
  const monthContainer = document.getElementById("monthly-summary");
  const monthSelect = document.getElementById("month-select");

  const now = new Date();
  const getDaysAgo = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  };

  const last7 = data.filter((r) => new Date(r.Sleep) >= getDaysAgo(7));
  const last30 = data.filter((r) => new Date(r.Sleep) >= getDaysAgo(30));

  const avg = (arr) =>
    parseFloat(
      (arr.reduce((a, b) => a + b.Duration, 0) / arr.length || 0).toFixed(2)
    );
  const total = (arr) =>
    parseFloat(arr.reduce((a, b) => a + b.Duration, 0).toFixed(2));
  const min = (arr) =>
    arr.length
      ? parseFloat(Math.min(...arr.map((r) => r.Duration)).toFixed(2))
      : "-";
  const max = (arr) =>
    arr.length
      ? parseFloat(Math.max(...arr.map((r) => r.Duration)).toFixed(2))
      : "-";

  function formatDateRange(start, end) {
    const opts = { month: "2-digit", day: "2-digit" };
    return `${start.toLocaleDateString("en-US", opts)}–${end.toLocaleDateString(
      "en-US",
      opts
    )}`;
  }

  const dateRange7 = formatDateRange(getDaysAgo(6), now);
  const dateRange30 = formatDateRange(getDaysAgo(29), now);

  function renderRecentStats(span = 7) {
    const list = span === 7 ? last7 : last30;
    if (span === 30 && list.length < 21) {
      recentContainer.innerHTML = `<li>Not enough data for 30-day summary</li>`;
    } else {
      recentContainer.innerHTML = `
        <li>Average: <strong>${avg(list)} hrs</strong></li>
        <li>Longest Night: <strong>${max(list)} hrs</strong></li>
        <li>Shortest Night: <strong>${min(list)} hrs</strong></li>
      `;
    }
  }

  // Always show both total summaries
  totalContainer.innerHTML = `
    <li>Total This Week – ${dateRange7}: <strong>${total(
    last7
  )} hrs</strong></li>
    <li>Total This Month: <strong>${
      last30.length < 21 ? "Not enough data" : total(last30) + " hrs"
    }</strong></li>
  `;

  // Setup subtabs for 7d/30d
  document.querySelectorAll(".subtab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".subtab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderRecentStats(parseInt(tab.dataset.span));
    });
  });

  renderRecentStats(7); // default

  // Monthly dropdown
  function groupByMonth(data) {
    const map = new Map();
    data.forEach((row) => {
      const [day, month] = row.Date.split(" ");
      const key = `${month} ${new Date(row.Sleep).getFullYear()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return map;
  }

  const monthMap = groupByMonth(data);
  const months = Array.from(monthMap.keys());

  monthSelect.innerHTML = months
    .map(
      (m, i) =>
        `<option value="${m}" ${
          i === months.length - 1 ? "selected" : ""
        }>${m}</option>`
    )
    .join("");

  function renderMonth(monthKey) {
    const rows = monthMap.get(monthKey) || [];
    const nights = new Set(rows.map((r) => r.Date));
    monthContainer.innerHTML = `
      <li>Total Sleep: <strong>${total(rows)} hrs</strong></li>
      <li>Average Sleep/Night: <strong>${avg(rows)} hrs</strong></li>
      <li>Unique Nights Recorded: <strong>${nights.size}</strong></li>
    `;
  }

  renderMonth(monthSelect.value);
  monthSelect.onchange = () => renderMonth(monthSelect.value);
}

updateRowStats();
