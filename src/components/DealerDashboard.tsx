import { useEffect } from "react";
import { useRealtime } from "@/hooks/useRealtime";
import { AppSubscriptions } from "@/lib/appSubscriptions";

export function DealerDashboard({ dealerId, token }) {
  const ws = useRealtime(token);

  useEffect(() => {
    const topics = AppSubscriptions.DealerIntelligence(dealerId);

    topics.forEach((t) => ws.subscribe(t));

    const handler = (event: any) => {
      console.log("Market trade:", event);
    };

    ws.on("events.market.trade", handler);

    return () => {
      topics.forEach((t) => ws.unsubscribe(t));
      ws.off("events.market.trade", handler);
    };
  }, [ws, dealerId]);

  return <div>Dealer Panel</div>;
}