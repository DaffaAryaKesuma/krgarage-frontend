<script setup lang="ts">
import { computed } from "vue";

const TIPS = [
  "Servis rutin setiap 3 bulan untuk performa optimal",
  "Ganti oli mesin setiap 2000 km atau 6 bulan",
  "Periksa busi secara berkala untuk konsumsi BBM efisien",
  "Gunakan oli 2-tak berkualitas untuk mesin awet",
];

const currentTip = computed(
  () => TIPS[Math.floor(Math.random() * TIPS.length)],
);
</script>

<template>
  <section
    class="rounded-xl border-l-4 border-gray-400 bg-gray-50 p-4 shadow-md sm:p-6"
  >
    <div class="flex items-start gap-3 sm:gap-4">
      <i class="mdi mdi-lightbulb-on text-3xl text-gray-500 sm:text-4xl"></i>
      <div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Tips Perawatan</h3>
        <div class="flex items-start gap-2">
          <i
            class="mdi mdi-wrench text-gray-600 text-lg mt-0.5 flex-shrink-0"
          ></i>
          <p class="text-gray-700">{{ currentTip }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
