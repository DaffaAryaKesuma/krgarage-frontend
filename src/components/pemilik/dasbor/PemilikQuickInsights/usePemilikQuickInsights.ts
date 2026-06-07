// ref untuk waktu/count, computed untuk kartu turunan, lifecycle untuk timer.
import { ref, computed, onMounted, onUnmounted } from "vue";
// Axios dipakai untuk mengambil jumlah mekanik online.
import axios from "axios";

// Composable penyusun kartu insight cepat di dashboard pemilik.
export function usePemilikQuickInsights(props: { ringkasan: any; statistik: any }) {
  // Waktu saat ini dipakai untuk menentukan status operasional bengkel.
  const now = ref(new Date());
  // Jumlah mekanik online dari API.
  const mechanicsCount = ref(0);
  // Timer update jam.
  let timeTimer: number | undefined;
  // Timer polling mekanik online.
  let pollTimer: number | undefined;

  // Update waktu lokal.
  function updateNow() {
    now.value = new Date();
  }

  // Ambil jumlah mekanik online dari backend.
  async function loadMechanicsCount() {
    try {
      const response = await axios.get("/api/pemilik/mekanik-online");
      const data = response.data.data ?? response.data;
      mechanicsCount.value = data.online ?? 0;
    } catch (error) {
      // Jika gagal, dashboard tetap jalan dengan nilai terakhir.
      console.error("Failed to load mechanics count:", error);
    }
  }

  // Bengkel libur pada hari Jumat.
  const isFriday = computed(() => now.value.getDay() === 5);
  // Jam buka bengkel.
  const OPEN_HOUR = 10;
  // Jam tutup bengkel.
  const CLOSE_HOUR = 17;

  // Status buka/tutup dihitung dari hari dan jam saat ini.
  const isOpen = computed(() => {
    if (isFriday.value) return false;
    const h = now.value.getHours();
    return h >= OPEN_HOUR && h < CLOSE_HOUR;
  });

  // Kartu status operasional bengkel.
  const firstKartu = computed(() => ({
    title: "Status Operasional",
    value: isOpen.value ? "Bengkel Buka" : "Bengkel Tutup",
    subtitle: isFriday.value ? "Libur: Jumat" : "Jam Operasional: 10:00 - 17:00",
    icon: isOpen.value ? "mdi-store-clock" : "mdi-store-off",
    tone: isOpen.value ? "success" : "neutral",
  }));

  // Kartu jumlah mekanik yang sedang online.
  const teamKartu = computed(() => ({
    title: "Tim Aktif",
    value: `${mechanicsCount.value} Mekanik`,
    subtitle: "Siap melayani pelanggan",
    icon: "mdi-account-group",
    tone: "info",
  }));

  // Kartu mekanik terbaik berdasarkan ringkasan performa bulan ini.
  const bestMechanicKartu = computed(() => {
    const name = props.ringkasan?.performa?.mekanik_terbaik?.nama;
    const jobs =
      props.ringkasan?.performa?.mekanik_terbaik?.total_pekerjaan ?? 0;

    if (!name) {
      // Fallback jika belum ada servis selesai bulan ini.
      return {
        title: "Mekanik Terbaik",
        value: "Belum Tersedia",
        subtitle: "Belum ada servis selesai bulan ini",
        icon: "mdi-star-outline",
        tone: "warning",
      };
    }

    return {
      title: "Mekanik Terbaik",
      value: name,
      subtitle: `${jobs} pesanan selesai bulan ini`,
      icon: "mdi-star-circle",
      tone: "warning",
    };
  });

  // Kartu jumlah Vespa yang masuk hari ini.
  const unitKartu = computed(() => ({
    title: "Vespa Masuk Hari Ini",
    value: `${props.statistik?.unitHariIni || 0} Vespa`,
    subtitle: "Sedang/selesai diproses",
    icon: "mdi-motorbike",
    tone: "primary",
  }));

  // Gabungkan semua kartu agar template cukup v-for.
  const INSIGHT_KARTU = computed(() => {
    return [
      firstKartu.value,
      teamKartu.value,
      bestMechanicKartu.value,
      unitKartu.value,
    ];
  });

  // Setup timer saat komponen dipasang.
  onMounted(() => {
    updateNow();
    // Waktu operasional diperbarui setiap menit.
    timeTimer = window.setInterval(updateNow, 60 * 1000);
    setTimeout(() => {
      // Jumlah mekanik online diambil berkala.
      loadMechanicsCount();
      pollTimer = window.setInterval(loadMechanicsCount, 30 * 1000);
    }, 500);
  });

  // Bersihkan timer agar tidak berjalan setelah komponen hilang.
  onUnmounted(() => {
    if (timeTimer) clearInterval(timeTimer);
    if (pollTimer) clearInterval(pollTimer);
  });

  // Kartu insight dipakai di komponen Vue.
  return { INSIGHT_KARTU };
}
