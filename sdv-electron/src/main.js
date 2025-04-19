const { app, BrowserWindow, ipcMain, shell } = require("electron");
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

const isDev = !app.isPackaged;
const dataPath = isDev
  ? path.join(process.cwd(), "data", "sleep.json")
  : path.join(process.resourcesPath, "data", "sleep.json");

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
  const appPath = app.getAppPath();
  const dataFilePath = path.join(appPath, "data", "sleep.json");

  // 🗓 Get latest entry's date for commit message
  let dateForCommit = new Date().toLocaleDateString("en-GB");
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    if (Array.isArray(data) && data.length > 0) {
      dateForCommit = data[data.length - 1]?.Date || dateForCommit;
    }
  } catch (err) {
    console.warn("⚠️ Could not read sleep.json:", err.message);
  }

  const steps = [
    "git pull",
    "git add -u",
    `git commit -m "Update sleep data — latest entry: ${dateForCommit}"`,
    "git push",
  ];

  for (const cmd of steps) {
    const result = await new Promise((resolve) => {
      exec(cmd, { cwd: appPath }, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ ${cmd} failed:\n`, stderr || error.message);
          resolve({ ok: false, step: cmd, error: stderr || error.message });
        } else {
          resolve({ ok: true });
        }
      });
    });

    if (!result.ok) {
      return result; // 🛑 Exit on first error
    }
  }

  return { ok: true };
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../../src/assets/icon.png"),
    webPreferences: {
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // win.webContents.openDevTools();
}

ipcMain.handle("open-github", async () => {
  const url = "https://github.com/ccy05327/Sleep-Data-Visualization";
  await shell.openExternal(url);
});

ipcMain.handle("open-image", async () => {
  const fullPath = path.join(app.getAppPath(), "", "out.png");
  await shell.openPath(fullPath);
});

ipcMain.handle("open-vscode", async () => {
  const projectPath = app.getAppPath();
  exec(`code "${projectPath}"`);
});
app.whenReady().then(createWindow);

console.log("🧱 ICON PATH:", path.join(__dirname, "../../src/assets/icon.png"));
