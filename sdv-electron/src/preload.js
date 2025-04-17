const { contextBridge, ipcRenderer } = require("electron");

console.log("🌞 PRELOAD loaded");

contextBridge.exposeInMainWorld("sdv", {
  genChart: (rows, display) => ipcRenderer.invoke("gen-chart", rows, display),
});
