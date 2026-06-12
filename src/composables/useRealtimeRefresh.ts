import { onBeforeUnmount, onMounted } from "vue";
import { getPusherClient } from "@/utils/pusher";

// Nama event custom browser untuk memberi tahu halaman lain bahwa data berubah.
export const KRGARAGE_DATA_CHANGED_EVENT = "krgarage:data-changed";

// Bentuk pesan realtime yang dikirim lewat event browser atau Pusher.
interface RealtimeMessage {
  id?: number;
  event?: string;
  payload?: Record<string, unknown>;
}

// Opsi untuk membatasi event apa saja yang boleh memicu refresh.
interface RealtimeRefreshOptions {
  events?: string[];
}

// Fungsi ini dipanggil setelah data penting berubah, misalnya status pemesanan berubah.
export function notifyKrGarageDataChanged(event = "pemesanan.changed") {
  // Detail event berisi nama event dan waktu perubahan.
  const detail: RealtimeMessage = {
    event,
    payload: {
      changedAt: Date.now(),
    },
  };

  // Dispatch event untuk tab/halaman aktif yang sama.
  window.dispatchEvent(
    new CustomEvent<RealtimeMessage>(KRGARAGE_DATA_CHANGED_EVENT, { detail }),
  );

  try {
    // localStorage dipakai agar tab browser lain juga mendapat sinyal melalui storage event.
    localStorage.setItem("krg_data_changed_at", String(Date.now()));
  } catch {
    // Ignore storage errors; the active tab event above is enough.
  }
}

// Composable untuk menjalankan refresh otomatis saat data KRGarage berubah.
export function useRealtimeRefresh(
  refresh: (message: RealtimeMessage) => Promise<void> | void,
  options: RealtimeRefreshOptions = {},
) {
  // Default hanya merespons perubahan pemesanan.
  const allowedEvents = options.events ?? ["pemesanan.changed"];
  // Flag agar refresh tidak dobel saat event datang berdekatan.
  let isRefreshing = false;
  // Timer debounce agar event realtime beruntun digabung menjadi satu refresh.
  let pendingRefreshTimer: ReturnType<typeof setTimeout> | null = null;
  // Pusher bisa null jika key belum dikonfigurasi.
  const pusher = getPusherClient();
  // Subscribe ke channel status jika Pusher aktif.
  const pusherChannel = pusher?.subscribe("krgarage-status");
  // Handler event Pusher untuk perubahan pemesanan.
  const handlePusherPemesananChanged = (payload: Record<string, unknown>) => {
    runRefresh({
      event: "pemesanan.changed",
      payload,
    });
  };

  // Menjalankan refresh dengan proteksi anti-double-call dan filter event.
  const runRefreshNow = async (message: RealtimeMessage) => {
    if (isRefreshing) return;
    // Jika event tidak termasuk allowedEvents, abaikan.
    if (message.event && !allowedEvents.includes(message.event)) return;

    isRefreshing = true;
    try {
      await refresh(message);
    } finally {
      isRefreshing = false;
    }
  };

  const runRefresh = (message: RealtimeMessage) => {
    if (pendingRefreshTimer) {
      clearTimeout(pendingRefreshTimer);
    }

    pendingRefreshTimer = setTimeout(() => {
      pendingRefreshTimer = null;
      void runRefreshNow(message);
    }, 350);
  };

  // Handler untuk custom event dalam tab yang sama.
  const handleDataChanged = (event: Event) => {
    const detail = (event as CustomEvent<RealtimeMessage>).detail;
    runRefresh(detail || { event: "pemesanan.changed" });
  };

  // Handler untuk perubahan localStorage dari tab lain.
  const handleStorageChanged = (event: StorageEvent) => {
    if (event.key === "krg_data_changed_at") {
      runRefresh({ event: "pemesanan.changed" });
    }
  };

  // Saat tab mendapat focus lagi, refresh agar data tidak basi.
  const handleFocus = () => {
    runRefresh({ event: "pemesanan.changed" });
  };

  // Pasang semua listener saat komponen memakai composable ini sudah mounted.
  onMounted(() => {
    window.addEventListener(KRGARAGE_DATA_CHANGED_EVENT, handleDataChanged);
    window.addEventListener("storage", handleStorageChanged);
    window.addEventListener("focus", handleFocus);

    pusherChannel?.bind("pemesanan.changed", handlePusherPemesananChanged);
  });

  // Lepas listener saat komponen dihancurkan agar tidak memory leak.
  onBeforeUnmount(() => {
    window.removeEventListener(KRGARAGE_DATA_CHANGED_EVENT, handleDataChanged);
    window.removeEventListener("storage", handleStorageChanged);
    window.removeEventListener("focus", handleFocus);
    pusherChannel?.unbind("pemesanan.changed", handlePusherPemesananChanged);
    if (pendingRefreshTimer) {
      clearTimeout(pendingRefreshTimer);
    }
  });
}
