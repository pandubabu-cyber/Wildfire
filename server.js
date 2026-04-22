const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let nodes = {};

const OFFLINE_TIMEOUT = 5 * 60 * 1000; // 5 minutes


// 🔥 GET handler (prevents "Cannot GET /update")
app.get("/update", (req, res) => {
  res.json({
    message: "🔥 This endpoint accepts POST requests from ESP32",
    usage: "Send data using POST /update"
  });
});


// ✅ ESP32 sends data here
app.post("/update", (req
