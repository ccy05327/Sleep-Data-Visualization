console.log("🚀 Renderer loaded");

const app = document.getElementById("app");

if (app) {
  app.innerHTML = `
    <h2>Sleep Data Visualisation</h2>
    <button id="generate">Generate Chart</button>
    <br><img id="preview" width="800" />
  `;

  document.getElementById("generate").onclick = async () => {
    const dummyData = [
      {
        Date: "2025-04-17",
        Sleep: "2025-04-17T23:45:00",
        Wake: "2025-04-18T07:12:00",
        Duration: 7.45,
      },
      {
        Date: "2025-04-18",
        Sleep: "2025-04-18T00:10:00",
        Wake: "2025-04-18T08:05:00",
        Duration: 7.92,
      },
    ];

    console.log("🧪 Sending rows to sdv.genChart...");
    try {
      const b64 = await window.sdv.genChart(dummyData, 2);
      console.log("📷 Got image, rendering...");
      document.getElementById("preview").src = "data:image/png;base64," + b64;
    } catch (err) {
      console.error("💥 Failed to generate chart:", err);
    }
  };
} else {
  console.error("❌ #app container not found!");
}
