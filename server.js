const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let nodes = {};

const OFFLINE_TIMEOUT = 5 * 60 * 1000; // 5 minutes


// Root route (test server)
app.get("/", (req, res) => {
  res.send("🔥 AgniNet Wildfire Server Running");
});


// GET /update (for browser testing)
app.get("/update", (req, res) => {
  res.json({
    message: "🔥 Use POST /update to send data from ESP32",
    example: {
      nodes: [
        {
          id: "Node 1",
          temp: 30,
          hum: 50,
          gas: 150,
          risk: "safe"
        }
      ]
    }
  });
});


// POST /update (ESP32 sends data here)
app.post("/update", (req, res) => {
  const data = req.body;

  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach(n => {
      nodes[n.id] = {
        ...n,
        receivedAt: Date.now()
      };
    });
  }

  console.log("Node update:", JSON.stringify(nodes));

  res.json({ status: "ok" });
});


// GET /latest (frontend fetches data)
app.get("/latest", (req, res) => {
  const now = Date.now();

  const alive = Object.values(nodes).filter(
    n => (now - n.receivedAt) < OFFLINE_TIMEOUT
  );

  res.json({ nodes: alive });
});


// 🔥 IMPORTANT: Use Railway port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
