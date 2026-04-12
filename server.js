const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let nodes = {};

const OFFLINE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

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

app.get("/latest", (req, res) => {
  const now = Date.now();
  const alive = Object.values(nodes).filter(
    n => (now - n.receivedAt) < OFFLINE_TIMEOUT
  );
  res.json({ nodes: alive });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Railway server running");
});
