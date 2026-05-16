<script setup lang="ts">
import { computed } from "vue";
import { getMonthOptions } from "@/utils/dateFilters";

interface Ringkasan {
  totalLayanan: number;
  totalSukuCadang: number;
  lowStockCount: number;
}

interface Props {
  ringkasan: Ringkasan;
  selectedMonth: number;
  selectedYear: number;
}

const props = defineProps<Props>();

const MONTH_OPTIONS = getMonthOptions();

const RINGKASAN_KARTU = computed(() => [
  {
    title: "Total Layanan Terjual",
    key: "totalLayanan" as keyof Ringkasan,
    subtitle: `Periode ${MONTH_OPTIONS[props.selectedMonth - 1].label} ${props.selectedYear}`,
    gradient: "from-blue-500 to-blue-600",
    icon: "mdi-wrench",
  },
  {
    title: "Total Suku Cadang Terjual",
    key: "totalSukuCadang" as keyof Ringkasan,
    subtitle: `Periode ${MONTH_OPTIONS[props.selectedMonth - 1].label} ${props.selectedYear}`,
    gradient: "from-green-500 to-green-600",
    icon: "mdi-package-variant",
  },
  {
    title: "Stok Menipis",
    key: "lowStockCount" as keyof Ringkasan,
    subtitle: "Saat Ini",
    gradient: "from-red-500 to-red-600",
    icon: "mdi-alert",
  },
]);
</script>

<template>
  <div class="mb-5 space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
    <div
      v-for="card in RINGKASAN_KARTU"
      :key="card.key"
      :class="[
        'rounded-2xl px-5 py-4 text-white shadow-lg flex items-center justify-between gap-4',
        `bg-gradient-to-r ${card.gradient}`,
      ]"
    >
      <!-- Kiri: icon + label -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="rounded-full bg-white/20 p-2.5 shrink-0">
          <i :class="['mdi', card.icon, 'text-2xl']"></i>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium opacity-90 leading-tight">{{ card.title }}</p>
          <p class="text-xs opacity-75 mt-0.5">{{ card.subtitle }}</p>
        </div>
      </div>
      <!-- Kanan: angka -->
      <div class="text-3xl font-bold shrink-0">
        {{ ringkasan[card.key] }}
      </div>
    </div>
  </div>
</template>
