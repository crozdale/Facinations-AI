import { useEffect } from "react";
import { useRealtime } from "../hooks/useRealtime";
import { AppSubscriptions } from "../lib/appSubscriptions";

export function FacinationsDashboard({ userId, token }) {
  const ws = useRealtime(token);

  useEffect(() => {
    if (!ws || !userId) return;

    const topics = AppSubscriptions.Facinations(userId);

    // Subscribe to topics
    topics.forEach((t) => ws.subscribe(t));

    // Event handler
    const handleAssetUpdate = (event) => {
      console.log("Asset update:", event);
    };

    // Listen to specific event type
    ws.on("events.asset.tokenized", handleAssetUpdate);

    // Cleanup on unmount
    return () => {
      topics.forEach((t) => ws.unsubscribe(t));
      ws.off("events.asset.tokenized", handleAssetUpdate);
    };
  }, [ws, userId]);

  return (
    <div>
      <h1>Facinations Dashboard</h1>
    </div>
  );
}