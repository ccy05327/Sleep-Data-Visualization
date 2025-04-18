const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const fs = require("fs");

ipcMain.handle("gen-chart", (_, rows, display = 30) => {
  const exePath = path.join(app.getAppPath(), "python", "sdv_cli.py");
  const py = spawn("python", [exePath], { stdio: ["pipe", "pipe", "inherit"] });

  py.stdin.write(JSON.stringify({ rows, display }));
  py.stdin.end();

  return new Promise((resolve, reject) => {
    let out = "";
    py.stdout.on("data", (chunk) => (out += chunk));
    py.on("close", (code) => {
      if (code === 0) {
        try {
          const parsed = JSON.parse(out);
          resolve(parsed.png);
        } catch (err) {
          reject("Failed to parse sdv_cli.py output");
        }
      } else {
        reject("sdv_cli.py exited with code " + code);
      }
    });
  });
});

const dataPath = path.join(app.getAppPath(), "data", "sleep.json");

ipcMain.handle("save-row", async (_, newRow) => {
  try {
    const json = fs.readFileSync(dataPath, "utf-8");
    const rows = JSON.parse(json);

    rows.push(newRow);

    // ✅ Sort by ISO sleep datetime
    rows.sort((a, b) => new Date(a.Sleep) - new Date(b.Sleep));

    fs.writeFileSync(dataPath, JSON.stringify(rows, null, 2));
    return { ok: true, count: rows.length };
  } catch (err) {
    console.error("❌ Failed to save row:", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("get-all-rows", async () => {
  try {
    const json = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(json);
  } catch (err) {
    console.error("❌ Failed to read saved data:", err);
    return [];
  }
});

ipcMain.handle("commit-and-push", async () => {
  try {
    const jsonPath = path.join(app.getAppPath(), "data", "sleep.json");
    const json = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(json);

    if (!data || data.length === 0) {
      return { ok: false, error: "No data found in sleep.json" };
    }

    const last = data[data.length - 1];
    const dateForCommit = last?.Date || new Date().toLocaleDateString("en-GB");
    const message = `TEST | Update sleep.json — latest entry: ${dateForCommit}`;

    const gitCmd = `
      git pull &&
      git add data/sleep.json python/out.png &&
      git diff --cached --quiet || git commit -m "${message}" &&
      git push
    `;

    return new Promise((resolve) => {
      exec(gitCmd, { cwd: app.getAppPath() }, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Git error:", stderr);
          resolve({ ok: false, error: stderr });
        } else {
          console.log("✅ Git output:", stdout);
          console.log("Git stderr:", stderr);
          resolve({ ok: true, output: stdout });
        }
      });
    });
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
