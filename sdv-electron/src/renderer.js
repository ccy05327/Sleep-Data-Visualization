console.log("🚀 Renderer loaded");

const app = document.getElementById("app");

app.innerHTML = `
  <h2>Sleep Data Input</h2>
  <form id="sleep-form">
    <label>Date: <input type="date" id="date" required /></label><br/>
    <label>Sleep Time: 
      <input type="number" id="sleep-hour" min="0" max="23" placeholder="HH" required /> :
      <input type="number" id="sleep-minute" min="0" max="59" placeholder="MM" required />
    </label><br/>
    <label>Wake Time: 
      <input type="number" id="wake-hour" min="0" max="23" placeholder="HH" required /> :
      <input type="number" id="wake-minute" min="0" max="59" placeholder="MM" required />
    </label><br/>
    <button type="submit" id="enter">Enter</button>
    <button type="button" id="generate">Generate Chart</button>
  </form>
  <p id="error-msg" style="color: red; min-height: 1.5em;"></p>
  <br/>
  <img id="preview" width="800" />
`;

const errorMsg = document.getElementById("error-msg");
const generateBtn = document.getElementById("generate");
const enterBtn = document.getElementById("enter");

function validateForm() {
  const date = document.getElementById("date").value;
  const sh = document.getElementById("sleep-hour").value;
  const sm = document.getElementById("sleep-minute").value;
  const wh = document.getElementById("wake-hour").value;
  const wm = document.getElementById("wake-minute").value;

  enterBtn.disabled = true;

  if (!date || sh === "" || sm === "" || wh === "" || wm === "") {
    errorMsg.textContent = "Please fill in all fields.";
    return false;
  }

  const sleepHour = parseInt(sh);
  const sleepMin = parseInt(sm);
  const wakeHour = parseInt(wh);
  const wakeMin = parseInt(wm);

  if (
    isNaN(sleepHour) ||
    sleepHour < 0 ||
    sleepHour > 23 ||
    isNaN(sleepMin) ||
    sleepMin < 0 ||
    sleepMin > 59 ||
    isNaN(wakeHour) ||
    wakeHour < 0 ||
    wakeHour > 23 ||
    isNaN(wakeMin) ||
    wakeMin < 0 ||
    wakeMin > 59
  ) {
    errorMsg.textContent = "Hours must be 0–23 and minutes 0–59.";
    return false;
  }

  const sleep = new Date(
    `${date}T${sh.padStart(2, "0")}:${sm.padStart(2, "0")}:00`
  );
  let wake = new Date(
    `${date}T${wh.padStart(2, "0")}:${wm.padStart(2, "0")}:00`
  );

  if (wake <= sleep) {
    wake.setDate(wake.getDate() + 1);
  }

  const duration = (wake - sleep) / 1000 / 60 / 60;
  if (duration <= 0 || duration > 24) {
    errorMsg.textContent = "Duration is invalid.";
    return false;
  }

  if (wake <= sleep && duration > 14) {
    errorMsg.textContent =
      "Wake time is over 14 hours after sleep. Please confirm.";
    return false;
  }

  // ✅ All checks passed
  errorMsg.textContent = "";
  enterBtn.disabled = false;

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
    document.getElementById(id).addEventListener("input", () => validateForm());
  }
);

generateBtn.onclick = async () => {
  try {
    const allRows = await window.sdv.getAllRows();

    if (!allRows || allRows.length === 0) {
      alert("No saved data to plot.");
      return;
    }

    const b64 = await window.sdv.genChart(allRows, allRows.length);

    if (!b64 || typeof b64 !== "string") {
      alert(
        "Failed to generate chart. Please check your data or Python script."
      );
      console.error("⚠️ genChart returned invalid data:", b64);
      return;
    }

    document.getElementById("preview").src = "data:image/png;base64," + b64;
    console.log("📈 Full timeline rendered!");
  } catch (err) {
    console.error("💥 Failed to generate full chart:", err);
    alert("Error generating chart. Check console for details.");
  }
};

document.getElementById("sleep-form").onsubmit = async (e) => {
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

  let rowsToSave = [];

  const sleepTime = new Date(row.Sleep);
  const wakeTime = new Date(row.Wake);

  if (wakeTime <= sleepTime) {
    // ⛔ cross-midnight → split into two entries

    const midnight = new Date(sleepTime);
    midnight.setHours(23, 59, 59, 0);

    const nextDay = new Date(sleepTime);
    nextDay.setDate(sleepTime.getDate() + 1);

    const part1 = {
      Date: sleepTime.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      Sleep: formatLocalISO(sleepTime),
      Wake: formatLocalISO(midnight),
      Duration: parseFloat(((midnight - sleepTime) / 3600000).toFixed(2)),
    };

    const part2 = {
      Date: nextDay.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      Sleep: formatLocalISO(new Date(nextDay.setHours(0, 0, 0, 0))),
      Wake: formatLocalISO(wakeTime),
      Duration: parseFloat(
        ((wakeTime - new Date(nextDay.setHours(0, 0, 0, 0))) / 3600000).toFixed(
          2
        )
      ),
    };

    rowsToSave.push(part1, part2);
  } else {
    rowsToSave.push(row);
  }

  for (const r of rowsToSave) {
    const result = await window.sdv.saveRow(r);
    if (!result.ok) {
      alert("❌ Failed to save part of the sleep entry.");
      return;
    }
  }
  console.log(`✅ Saved ${rowsToSave.length} entries.`);
  clearForm();
};

function clearForm() {
  document.getElementById("date").value = "";
  document.getElementById("sleep-hour").value = "";
  document.getElementById("sleep-minute").value = "";
  document.getElementById("wake-hour").value = "";
  document.getElementById("wake-minute").value = "";
  errorMsg.textContent = "";
  enterBtn.disabled = true;
}
