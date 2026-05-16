<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";

const now = ref(new Date());
const mechanicsCount = ref(0); // Default 0
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
    // Keep fallback value on error
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

const props = defineProps<{
  ringkasan: any;
  statistik: any;
}>();

const firstKartu = computed(() => ({
  title: "Status Operasional",
  value: isOpen.value ? "Bengkel Buka" : "Bengkel Tutup",
  subtitle: isFriday.value ? "Libur: Jumat" : `Jam Operasional: 10:00 - 17:00`,
  icon: isOpen.value ? "mdi-store-clock" : "mdi-store-off",
  gradient: isOpen.value
    ? "from-green-500 to-green-600"
    : "from-gray-500 to-gray-600",
}));

const teamKartu = computed(() => ({
  title: "Tim Aktif",
  value: `${mechanicsCount.value} Mekanik`,
  subtitle: "Siap melayani pelanggan",
  icon: "mdi-account-group",
  gradient: "from-blue-500 to-blue-600",
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
    gradient: "from-amber-500 to-amber-600",
  };
});

const unitKartu = computed(() => ({
  title: "Vespa Masuk Hari Ini",
  value: `${props.statistik?.unitHariIni || 0} Vespa`,
  subtitle: "Sedang/selesai diproses",
  icon: "mdi-motorbike",
  gradient: "from-purple-500 to-purple-600",
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

  // Delay mechanics count fetch by 500ms to ensure token is ready
  setTimeout(() => {
    loadMechanicsCount();
    pollTimer = window.setInterval(loadMechanicsCount, 30 * 1000);
  }, 500);
});

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer);
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<template>
  <div class="mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      <div
        v-for="card in INSIGHT_KARTU"
        :key="card.title"
        :class="[
          'rounded-2xl bg-gradient-to-br p-4 text-white shadow-md',
          card.gradient,
        ]"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="text-xs font-medium opacity-90 mb-1">{{ card.title }}</p>
            <h3 class="text-lg font-bold leading-tight break-words">
              {{ card.value }}
            </h3>
            <p class="mt-1 text-xs opacity-80 leading-snug">
              {{ card.subtitle }}
            </p>
          </div>
          <div
            class="rounded-full bg-white/20 flex items-center justify-center shrink-0 w-9 h-9"
          >
            <i :class="['mdi', card.icon, 'text-xl']"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
