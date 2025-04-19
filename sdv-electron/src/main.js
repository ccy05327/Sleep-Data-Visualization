const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const fs = require("fs");

const isDev = !app.isPackaged;
const dataDir = isDev
  ? path.join(process.cwd(), "data")
  : path.join(app.getPath("userData"), "data");
const dataFilePath = path.join(dataDir, "sleep.json");
const imageFilePath = path.join(dataDir, "out.png");

const logFile = path.join(app.getPath("userData"), "app.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  if (isDev) {
    console.log(line.trim());
  } else {
    logStream.write(line);
  }
}

log("🚀 Application launched in " + (isDev ? "DEV" : "BUILD") + " mode");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize sleep.json if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  if (isDev) {
    // In dev mode, create an empty file
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
    log("🆕 Created empty sleep.json in dev mode");
  } else {
    // In build mode, copy from resources if available
    const sourceDataPath = path.join(
      process.resourcesPath,
      "data",
      "sleep.json"
    );
    if (fs.existsSync(sourceDataPath)) {
      fs.copyFileSync(sourceDataPath, dataFilePath);
      log("📦 Copied sleep.json from resources to userData");
    } else {
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
      log("🆕 Created empty sleep.json in build mode");
    }
  }
}

ipcMain.handle("gen-chart", (_, rows, display = 30) => {
  const pythonScript = isDev
    ? path.join(process.cwd(), "python", "sdv_cli.py")
    : path.join(process.resourcesPath, "python", "sdv_cli.py");

  const py = spawn("python", [pythonScript], {
    stdio: ["pipe", "pipe", "inherit"],
  });

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

ipcMain.handle("save-row", async (_, newRow) => {
  try {
    const json = fs.readFileSync(dataFilePath, "utf-8");
    const rows = JSON.parse(json);

    rows.push(newRow);
    rows.sort((a, b) => new Date(a.Sleep) - new Date(b.Sleep));

    fs.writeFileSync(dataFilePath, JSON.stringify(rows, null, 2));
    return { ok: true, count: rows.length };
  } catch (err) {
    log("❌ Failed to save row:", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("get-all-rows", async () => {
  try {
    const json = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(json);
  } catch (err) {
    log("❌ Failed to read saved data:", err);
    return [];
  }
});

ipcMain.handle("commit-and-push", async () => {
  const appPath = isDev ? process.cwd() : path.dirname(app.getPath("exe"));
  const dataDirPath = path.join(appPath, "data");

  let dateForCommit = new Date().toLocaleDateString("en-GB");
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    if (Array.isArray(data) && data.length > 0) {
      dateForCommit = data[data.length - 1]?.Date || dateForCommit;
    }
  } catch (err) {
    log("⚠️ Could not read sleep.json:", err.message);
  }

  const steps = [
    "git pull",
    "git add ./data",
    `git commit -m "Update sleep data — latest entry: ${dateForCommit}"`,
    "git push",
  ];

  for (const cmd of steps) {
    const result = await new Promise((resolve) => {
      exec(cmd, { cwd: appPath }, (error, stdout, stderr) => {
        if (error) {
          log(`❌ ${cmd} failed:\n`, stderr || error.message);
          resolve({ ok: false, step: cmd, error: stderr || error.message });
        } else {
          resolve({ ok: true });
        }
      });
    });

    if (!result.ok) {
      return result;
    }
  }

  return { ok: true };
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "assets", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      preload: isDev
        ? MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        : path.join(process.resourcesPath, "src", "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(process.resourcesPath, "src", "index.html"));
  }
}

ipcMain.handle("open-github", async () => {
  const url = "https://github.com/ccy05327/Sleep-Data-Visualization";
  await shell.openExternal(url);
});

ipcMain.handle("open-image", async () => {
  try {
    const result = await shell.openPath(imageFilePath);
    if (result) {
      log("❌ Failed to open image:", result);
      return { ok: false, error: result };
    }
    return { ok: true };
  } catch (err) {
    log("❌ Exception while opening image:", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("open-vscode", async () => {
  const projectPath = isDev ? process.cwd() : path.dirname(app.getPath("exe"));
  exec(`code "${projectPath}"`);
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
