const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const SUBGRAPH_URL = process.env.SUBGRAPH_URL || "https://api.thegraph.com/subgraphs/name/YOUR_SUBGRAPH";
let lastSeenTimestamp = Math.floor(Date.now() / 1000) - 3600;

async function pollSubgraph() {
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: `{
      vaults(where: { createdAt_gt: "${lastSeenTimestamp}" }, orderBy: createdAt) { id vaultId owner createdAt }
      trades(where: { timestamp_gt: "${lastSeenTimestamp}" }, orderBy: timestamp) { id user xerAmount timestamp }
      teleportEvents(where: { timestamp_gt: "${lastSeenTimestamp}" }, orderBy: timestamp) { id assetId fromContext toContext user timestamp }
    }` }),
  });
  const { data } = await res.json();

  if (data.vaults.length) {
    data.vaults.forEach(v => {
      console.log(`[NOTIFY] New vault: ${v.vaultId} by ${v.owner}`);
      // TODO: send email / Discord / Telegram
    });
  }
  if (data.trades.length) {
    data.trades.forEach(t => {
      console.log(`[NOTIFY] Swap by ${t.user}: ${t.xerAmount} XER`);
    });
  }
  if (data.teleportEvents.length) {
    data.teleportEvents.forEach(t => {
      console.log(`[NOTIFY] Teleport: asset ${t.assetId} from ${t.fromContext} to ${t.toContext}`);
    });
  }

  lastSeenTimestamp = Math.floor(Date.now() / 1000);
}

// Poll every 30 seconds
setInterval(pollSubgraph, 30000);

app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));
app.post("/webhook", (req, res) => {
  console.log("[WEBHOOK]", JSON.stringify(req.body));
  res.json({ received: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
