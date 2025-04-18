const { contextBridge, ipcRenderer } = require("electron");

console.log("🌞 PRELOAD loaded");

contextBridge.exposeInMainWorld("sdv", {
  genChart: (rows, display) => ipcRenderer.invoke("gen-chart", rows, display),
  saveRow: (row) => ipcRenderer.invoke("save-row", row),
  getAllRows: () => ipcRenderer.invoke("get-all-rows"),
  commitAndPush: () => ipcRenderer.invoke("commit-and-push"),
});
