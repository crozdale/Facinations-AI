import { useMemo } from "react";
import { getRealtimeClient } from "@/lib/realtime";

export function useRealtime(token: string) {
  return useMemo(() => getRealtimeClient(token), [token]);
}