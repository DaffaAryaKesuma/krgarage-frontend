import { onMounted, onUnmounted } from "vue";
import axios from "axios";

export function usePing(intervalMs = 30 * 1000) {
  let pingTimer: number | undefined;

  async function sendPing() {
    try {
      await axios.post("/api/ping");
    } catch (error) {
      console.debug("Ping error (non-critical):", error);
    }
  }

  onMounted(() => {
    sendPing();
    pingTimer = window.setInterval(sendPing, intervalMs);
  });

  onUnmounted(() => {
    if (pingTimer) clearInterval(pingTimer);
  });
}
