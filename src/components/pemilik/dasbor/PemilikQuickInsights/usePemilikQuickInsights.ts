import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";

export function usePemilikQuickInsights(props: { ringkasan: any; statistik: any }) {
  const now = ref(new Date());
  const mechanicsCount = ref(0);
  let timeTimer: number | undefined;
  let pollTimer: number | undefined;

  function updateNow() {
    now.value = new Date();
  }

  async function loadMechanicsCount() {
    try {
      const response = await axios.get("/api/pemilik/mekanik-online");
      const data = response.data.data ?? response.data;
      mechanicsCount.value = data.online ?? 0;
    } catch (error) {
      console.error("Failed to load mechanics count:", error);
    }
  }

  const isFriday = computed(() => now.value.getDay() === 5);
  const OPEN_HOUR = 10;
  const CLOSE_HOUR = 17;

  const isOpen = computed(() => {
    if (isFriday.value) return false;
    const h = now.value.getHours();
    return h >= OPEN_HOUR && h < CLOSE_HOUR;
  });

  const firstKartu = computed(() => ({
    title: "Status Operasional",
    value: isOpen.value ? "Bengkel Buka" : "Bengkel Tutup",
    subtitle: isFriday.value ? "Libur: Jumat" : "Jam Operasional: 10:00 - 17:00",
    icon: isOpen.value ? "mdi-store-clock" : "mdi-store-off",
    tone: "neutral",
  }));

  const teamKartu = computed(() => ({
    title: "Tim Aktif",
    value: `${mechanicsCount.value} Mekanik`,
    subtitle: "Siap melayani pelanggan",
    icon: "mdi-account-group",
    tone: "info",
  }));

  const bestMechanicKartu = computed(() => {
    const name = props.ringkasan?.performa?.mekanik_terbaik?.nama;
    const jobs = props.ringkasan?.performa?.mekanik_terbaik?.total_pekerjaan;
    if (!name) return null;
    return {
      title: "Mekanik Terbaik",
      value: name,
      subtitle: `${jobs} pesanan selesai bulan ini`,
      icon: "mdi-star-circle",
      tone: "warning",
    };
  });

  const unitKartu = computed(() => ({
    title: "Vespa Masuk Hari Ini",
    value: `${props.statistik?.unitHariIni || 0} Vespa`,
    subtitle: "Sedang/selesai diproses",
    icon: "mdi-motorbike",
    tone: "primary",
  }));

  const INSIGHT_KARTU = computed(() => {
    const cards = [firstKartu.value, teamKartu.value];
    if (bestMechanicKartu.value) cards.push(bestMechanicKartu.value);
    cards.push(unitKartu.value);
    return cards;
  });

  onMounted(() => {
    updateNow();
    timeTimer = window.setInterval(updateNow, 60 * 1000);
    setTimeout(() => {
      loadMechanicsCount();
      pollTimer = window.setInterval(loadMechanicsCount, 30 * 1000);
    }, 500);
  });

  onUnmounted(() => {
    if (timeTimer) clearInterval(timeTimer);
    if (pollTimer) clearInterval(pollTimer);
  });

  return { INSIGHT_KARTU };
}
