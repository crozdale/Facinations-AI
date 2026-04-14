export class WSClient {
  constructor({ url, token }) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.listeners = new Map();
    this.subscriptions = new Set();
  }

  connect() {
    const fullUrl = `${this.url}?token=${this.token}`;
    console.log("[WS] connecting to:", fullUrl);

    this.ws = new WebSocket(fullUrl);

    this.ws.onopen = () => {
      console.log("[WS] ✅ CONNECTED");

      // re-subscribe
      this.subscriptions.forEach((topic) => {
        this.send({ type: "subscribe", topic });
      });
    };

    this.ws.onmessage = (msg) => {
      console.log("[WS] 📩 RAW MESSAGE:", msg.data);

      try {
        const data = JSON.parse(msg.data);
        const topic = data.topic || data.type;

        this.emit(topic, data);
      } catch (err) {
        console.error("[WS] parse error:", err);
      }
    };

    this.ws.onclose = () => {
      console.log("[WS] ❌ DISCONNECTED");
    };

    this.ws.onerror = (err) => {
      console.error("[WS] ERROR:", err);
    };
  }

  send(payload) {
    console.log("[WS] → sending:", payload);
    this.ws?.send(JSON.stringify(payload));
  }

  subscribe(topic) {
    console.log("[WS] ➕ subscribe:", topic);
    this.subscriptions.add(topic);
    this.send({ type: "subscribe", topic });
  }

  unsubscribe(topic) {
    console.log("[WS] ➖ unsubscribe:", topic);
    this.subscriptions.delete(topic);
    this.send({ type: "unsubscribe", topic });
  }

  on(topic, handler) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic).add(handler);
  }

  off(topic, handler) {
    this.listeners.get(topic)?.delete(handler);
  }

  emit(topic, data) {
    console.log("[WS] 🔔 EMIT:", topic, data);

    const handlers = this.listeners.get(topic);
    if (handlers) {
      handlers.forEach((h) => h(data));
    }
  }
}