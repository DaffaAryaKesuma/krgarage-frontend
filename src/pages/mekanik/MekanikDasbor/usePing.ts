// Mengambil lifecycle Vue untuk menjalankan dan membersihkan interval.
import { onMounted, onUnmounted } from "vue";
// Mengambil axios untuk memanggil endpoint ping backend.
import axios from "axios";

// Helper untuk mengirim ping berkala agar last_seen mekanik tetap update.
export function usePing(intervalMs = 30 * 1000) {
  // Menyimpan ID timer interval.
  let pingTimer: number | undefined;

  // Fungsi mengirim ping ke backend.
  async function sendPing() {
    try {
      // Endpoint ini akan memperbarui last_seen user login.
      await axios.post("/api/ping");
    } catch (error) {
      // Error ping tidak kritis, jadi cukup dicatat sebagai debug.
      console.debug("Ping error (non-critical):", error);
    }
  }

  // Saat komponen dipasang, kirim ping pertama dan mulai interval.
  onMounted(() => {
    sendPing();
    pingTimer = window.setInterval(sendPing, intervalMs);
  });

  // Saat komponen dilepas, hentikan interval agar tidak bocor memori.
  onUnmounted(() => {
    if (pingTimer) clearInterval(pingTimer);
  });
}
