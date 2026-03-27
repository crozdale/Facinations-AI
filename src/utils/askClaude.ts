/**
 * Streams a Claude response via the /api/claude proxy.
 * Calls onChunk for each text delta. Throws on HTTP error.
 */
export async function streamClaude(
  body: {
    model: string;
    max_tokens: number;
    system: string;
    messages: { role: string; content: string }[];
  },
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetch("/api/claude/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: true }),
  });
  if (!res.ok) {
    const raw = await res.text();
    throw new Error(`HTTP ${res.status}: ${raw}`);
  }
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        if (
          json.type === "content_block_delta" &&
          json.delta?.type === "text_delta"
        ) {
          onChunk(json.delta.text);
        }
      } catch {}
    }
  }
}
