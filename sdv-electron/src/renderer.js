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
enterBtn.disabled = true;

function validateForm() {
  const date = document.getElementById("date").value;
  const sh = document.getElementById("sleep-hour").value;
  const sm = document.getElementById("sleep-minute").value;
  const wh = document.getElementById("wake-hour").value;
  const wm = document.getElementById("wake-minute").value;

  enterBtn.disabled = true; // 🚨 Start by disabling the button

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
    document.getElementById("preview").src = "data:image/png;base64," + b64;
    console.log("📈 Full timeline rendered!");
  } catch (err) {
    console.error("💥 Failed to generate full chart:", err);
  }
};

document.getElementById("sleep-form").onsubmit = async (e) => {
  e.preventDefault();
  const row = validateForm();
  if (!row) return;

  console.log("🆕 ENTER row:", row);

  try {
    const result = await window.sdv.saveRow(row);
    if (result.ok) {
      console.log(`✅ Saved entry. Total entries: ${result.count}`);
      clearForm();
    } else {
      alert("❌ Failed to save row: " + result.error);
    }
  } catch (err) {
    console.error("💥 Save error:", err);
  }
};

function clearForm() {
  document.getElementById("date").value = "";
  document.getElementById("sleep-hour").value = "";
  document.getElementById("sleep-minute").value = "";
  document.getElementById("wake-hour").value = "";
  document.getElementById("wake-minute").value = "";
  errorMsg.textContent = "";
  generateBtn.disabled = true;
}
