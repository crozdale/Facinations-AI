export default async function handler(req, res) {
  const upstreamUrl =
    "https://api.anthropic.com" + req.url.replace("/api/claude", "");

  const response = await fetch(upstreamUrl, {
    method: req.method,
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}