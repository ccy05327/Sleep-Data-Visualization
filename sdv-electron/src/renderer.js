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
    <button type="button">Generate Chart</button>
    <button type="submit" id="enter">Enter</button>
  </form>
  <p id="error-msg" style="color: red; min-height: 1.5em;"></p>
  <br/>
  <img id="preview" width="800" />
`;

const errorMsg = document.getElementById("error-msg");
const generateBtn = document.querySelector("button[type='submit']");
const enterBtn = document.getElementById("enter");

function validateForm(autoAdjust = true) {
  const date = document.getElementById("date").value;
  const sh = document.getElementById("sleep-hour").value;
  const sm = document.getElementById("sleep-minute").value;
  const wh = document.getElementById("wake-hour").value;
  const wm = document.getElementById("wake-minute").value;

  const sleepHour = parseInt(sh);
  const sleepMin = parseInt(sm);
  const wakeHour = parseInt(wh);
  const wakeMin = parseInt(wm);

  if (!date || sh === "" || sm === "" || wh === "" || wm === "") {
    errorMsg.textContent = "Please fill in all fields.";
    generateBtn.disabled = true;
    return false;
  }

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
    generateBtn.disabled = true;
    return false;
  }

  const sleep = new Date(
    `${date}T${sh.padStart(2, "0")}:${sm.padStart(2, "0")}:00`
  );
  let wake = new Date(
    `${date}T${wh.padStart(2, "0")}:${wm.padStart(2, "0")}:00`
  );

  if (wake <= sleep && autoAdjust) {
    wake.setDate(wake.getDate() + 1);
  }

  const duration = (wake - sleep) / 1000 / 60 / 60;

  if (wake <= sleep && duration > 14) {
    errorMsg.textContent =
      "Wake time seems too far from sleep (over 14 hours).";
    alert(
      "Wake time is more than 14 hours after sleep. Please confirm your input."
    );
    generateBtn.disabled = true;
    return false;
  }

  if (duration <= 0 || duration > 24) {
    errorMsg.textContent = "Duration is invalid.";
    generateBtn.disabled = true;
    return false;
  }

  errorMsg.textContent = "";
  generateBtn.disabled = false;

  return {
    Date: new Date(date).toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    }),
    Sleep: sleep.toISOString(),
    Wake: wake.toISOString(),
    Duration: parseFloat(duration.toFixed(2)),
  };
}

["date", "sleep-hour", "sleep-minute", "wake-hour", "wake-minute"].forEach(
  (id) => {
    document.getElementById(id).addEventListener("input", () => validateForm());
  }
);

generateBtn.disabled = true;

document.getElementById("sleep-form").onsubmit = async (e) => {
  e.preventDefault();
  const row = validateForm();
  if (!row) return;

  try {
    const b64 = await window.sdv.genChart([row], 1);
    document.getElementById("preview").src = "data:image/png;base64," + b64;
    clearForm();
  } catch (err) {
    console.error("💥 Error generating chart:", err);
  }
};

// 🆕 Temporary Enter button
enterBtn.onclick = () => {
  const row = validateForm();
  if (!row) return;
  console.log("🆕 ENTER row:", row);
  clearForm();
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
