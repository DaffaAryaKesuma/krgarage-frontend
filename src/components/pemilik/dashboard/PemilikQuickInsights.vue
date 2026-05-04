<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";

const now = ref(new Date());
const mechanicsCount = ref(5); // Default fallback
let timeTimer: number | undefined;
let pollTimer: number | undefined;

function updateNow() {
  now.value = new Date();
}

async function loadMechanicsCount() {
  try {
    const response = await axios.get("/api/pemilik/mekanik-online");
    mechanicsCount.value = response.data.count ?? 5;
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

const firstCard = computed(() => ({
  title: "Status Operasional",
  value: isOpen.value ? "Bengkel Buka" : "Bengkel Tutup",
  subtitle: isFriday.value ? "Libur: Jumat" : `Jam Operasional: 10:00 - 17:00`,
  icon: isOpen.value ? "mdi-store-clock" : "mdi-store-off",
  gradient: isOpen.value
    ? "from-green-500 to-green-600"
    : "from-gray-500 to-gray-600",
}));

const teamCard = computed(() => ({
  title: "Tim Aktif",
  value: `${mechanicsCount.value} Mekanik`,
  subtitle: "Siap melayani pelanggan",
  icon: "mdi-account-group",
  gradient: "from-blue-500 to-blue-600",
}));

const INSIGHT_CARDS = computed(() => [firstCard.value, teamCard.value]);

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
  <div
    class="mb-8 grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 sm:mt-8 lg:grid-cols-2"
  >
    <div
      v-for="card in INSIGHT_CARDS"
      :key="card.title"
      :class="[
        'rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg',
        `${card.gradient}`,
      ]"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium opacity-90">{{ card.title }}</p>
          <h3 class="mt-2 text-2xl font-bold">{{ card.value }}</h3>
          <p class="mt-2 text-sm opacity-90">{{ card.subtitle }}</p>
        </div>
        <div
          class="rounded-full bg-white/20 flex items-center justify-center w-11 h-11"
        >
          <i :class="['mdi', card.icon, 'text-2xl']"></i>
        </div>
      </div>
    </div>
  </div>
</template>
