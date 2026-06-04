<script setup lang="ts">
import { computed } from "vue";
import { getAlertBoxClass, getAlertIconClass } from "@/utils/badgeVariants";

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
    :class="[getAlertBoxClass('neutral'), 'border-l-4 p-3 sm:p-6']"
  >
    <div class="flex items-start gap-2 sm:gap-4">
      <i
        :class="[getAlertIconClass('neutral'), 'mdi mdi-lightbulb-on text-2xl sm:text-4xl']"
      ></i>
      <div>
        <h3 class="mb-1 text-base font-bold text-gray-900 sm:mb-2 sm:text-lg">Tips Perawatan</h3>
        <div class="flex items-start gap-2">
          <i
            :class="[getAlertIconClass('neutral'), 'mdi mdi-wrench mt-0.5 flex-shrink-0 text-base sm:text-lg']"
          ></i>
          <p class="text-xs text-gray-700 sm:text-sm">{{ currentTip }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
