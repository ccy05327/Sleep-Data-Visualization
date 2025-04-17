const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

console.log("🧠 MAIN process is running");

ipcMain.handle("gen-chart", (_, rows, display = 30) => {
  console.log("📩 gen-chart received from renderer");

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
