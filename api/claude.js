export default async function handler(req, res) {
  const upstreamUrl =
    "https://api.anthropic.com" + req.url.replace("/api/claude", "");

  const isStream = req.body?.stream === true;

  const response = await fetch(upstreamUrl, {
    method: req.method,
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  });

  if (isStream) {
    res.status(response.status);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const reader = response.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      res.end();
    }
  } else {
    const data = await response.json();
    res.status(response.status).json(data);
  }
}
