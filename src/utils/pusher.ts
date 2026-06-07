import Pusher from "pusher-js";

// Key dan cluster Pusher dibaca dari environment frontend.
const PUSHER_KEY = (import.meta.env.VITE_PUSHER_APP_KEY || "").trim();
const PUSHER_CLUSTER = (import.meta.env.VITE_PUSHER_APP_CLUSTER || "ap1").trim();

// Client disimpan sebagai singleton agar tidak membuat koneksi berulang.
let pusherClient: Pusher | null = null;

// Mengambil instance Pusher jika konfigurasi tersedia.
export function getPusherClient(): Pusher | null {
  // Jika key kosong, fitur realtime dianggap nonaktif.
  if (!PUSHER_KEY) {
    return null;
  }

  // Buat client sekali saja, lalu reuse.
  if (!pusherClient) {
    pusherClient = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });
  }

  // Return client yang sudah siap.
  return pusherClient;
}
