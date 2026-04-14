import { WSClient } from "./wsClient";

let ws: WSClient | null = null;

export function getRealtimeClient(token: string) {
  if (!ws) {
    ws = new WSClient({
      url: "ws://localhost:3000",
      token,
    });

    ws.connect();
  }

  return ws;
}