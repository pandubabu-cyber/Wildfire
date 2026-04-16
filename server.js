const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let nodes = {};

const OFFLINE_TIMEOUT = 5 * 60 * 1000; // 5 minutes


// 🔥 FIX: Add GET handler for /update (prevents "Cannot GET /update")
app.get("/update", (req, res) => {
  res.json({
    message: "🔥 This endpoint accepts POST requests from ESP32",
    usage: "Send data using POST /update",
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


// ✅ ESP32 sends data here
app.post("/update", (req, res) => {
  const data = req.body;

  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach(n => {
      nodes[n.id] = { ...n, receivedAt: Date.now() };
    });
  }

  console.log("Node update:", JSON.stringify(nodes));
  res.json({ status: "ok" });
});


// ✅ Website fetches data from here
app.get("/latest", (req, res) => {
  const now = Date.now();

  const alive = Object.values(nodes).filter(
    n => (now - n.receivedAt) < OFFLINE_TIMEOUT
  );

  res.json({ nodes: alive });
});


// 🔥 Optional: root route (clean homepage)
app.get("/", (req, res) => {
  res.send("🔥 AgniNet Wildfire Server Running");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Railway server running");
});
