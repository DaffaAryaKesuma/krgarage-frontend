import { onBeforeUnmount, onMounted } from "vue";
import { getPusherClient } from "@/utils/pusher";

export const KRGARAGE_DATA_CHANGED_EVENT = "krgarage:data-changed";

interface RealtimeMessage {
  id?: number;
  event?: string;
  payload?: Record<string, unknown>;
}

interface RealtimeRefreshOptions {
  events?: string[];
}

export function notifyKrGarageDataChanged(event = "pemesanan.changed") {
  const detail: RealtimeMessage = {
    event,
    payload: {
      changedAt: Date.now(),
    },
  };

  window.dispatchEvent(
    new CustomEvent<RealtimeMessage>(KRGARAGE_DATA_CHANGED_EVENT, { detail }),
  );

  try {
    localStorage.setItem("krg_data_changed_at", String(Date.now()));
  } catch {
    // Ignore storage errors; the active tab event above is enough.
  }
}

export function useRealtimeRefresh(
  refresh: (message: RealtimeMessage) => Promise<void> | void,
  options: RealtimeRefreshOptions = {},
) {
  const allowedEvents = options.events ?? ["pemesanan.changed"];
  let isRefreshing = false;
  const pusher = getPusherClient();
  const pusherChannel = pusher?.subscribe("krgarage-status");
  const handlePusherPemesananChanged = (payload: Record<string, unknown>) => {
    void runRefresh({
      event: "pemesanan.changed",
      payload,
    });
  };

  const runRefresh = async (message: RealtimeMessage) => {
    if (isRefreshing) return;
    if (message.event && !allowedEvents.includes(message.event)) return;

    isRefreshing = true;
    try {
      await refresh(message);
    } finally {
      isRefreshing = false;
    }
  };

  const handleDataChanged = (event: Event) => {
    const detail = (event as CustomEvent<RealtimeMessage>).detail;
    void runRefresh(detail || { event: "pemesanan.changed" });
  };

  const handleStorageChanged = (event: StorageEvent) => {
    if (event.key === "krg_data_changed_at") {
      void runRefresh({ event: "pemesanan.changed" });
    }
  };

  const handleFocus = () => {
    void runRefresh({ event: "pemesanan.changed" });
  };

  onMounted(() => {
    window.addEventListener(KRGARAGE_DATA_CHANGED_EVENT, handleDataChanged);
    window.addEventListener("storage", handleStorageChanged);
    window.addEventListener("focus", handleFocus);

    pusherChannel?.bind("pemesanan.changed", handlePusherPemesananChanged);
  });

  onBeforeUnmount(() => {
    window.removeEventListener(KRGARAGE_DATA_CHANGED_EVENT, handleDataChanged);
    window.removeEventListener("storage", handleStorageChanged);
    window.removeEventListener("focus", handleFocus);
    pusherChannel?.unbind("pemesanan.changed", handlePusherPemesananChanged);
  });
}
