<script setup lang="ts">
import { computed } from "vue";
import { getMonthOptions } from "@/utils/dateFilters";

interface Summary {
  totalServices: number;
  totalSpareparts: number;
  lowStockCount: number;
}

interface Props {
  summary: Summary;
  selectedMonth: number;
  selectedYear: number;
}

const props = defineProps<Props>();

const MONTH_OPTIONS = getMonthOptions();

const SUMMARY_CARDS = computed(() => [
  {
    title: "Total Layanan Terjual",
    key: "totalServices" as keyof Summary,
    subtitle: `Periode ${MONTH_OPTIONS[props.selectedMonth - 1].label} ${props.selectedYear}`,
    gradient: "from-blue-500 to-blue-600",
    icon: "mdi-wrench",
  },
  {
    title: "Total Sparepart Terjual",
    key: "totalSpareparts" as keyof Summary,
    subtitle: `Periode ${MONTH_OPTIONS[props.selectedMonth - 1].label} ${props.selectedYear}`,
    gradient: "from-green-500 to-green-600",
    icon: "mdi-package-variant",
  },
  {
    title: "Stok Menipis",
    key: "lowStockCount" as keyof Summary,
    subtitle: "Saat Ini",
    gradient: "from-red-500 to-red-600",
    icon: "mdi-alert",
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
    <div
      v-for="card in SUMMARY_CARDS"
      :key="card.key"
      :class="[
        'rounded-2xl p-6 text-white shadow-lg transition-transform hover:-translate-y-1',
        `bg-gradient-to-br ${card.gradient}`,
      ]"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-lg font-medium opacity-90">{{ card.title }}</p>
          <h3 class="mt-2 text-3xl font-bold">
            {{ summary[card.key] }}
          </h3>
          <p class="text-sm font-medium opacity-90">
            {{ card.subtitle }}
          </p>
        </div>
        <div class="rounded-full bg-white/20 p-3">
          <i :class="['mdi', card.icon, 'text-3xl']"></i>
        </div>
      </div>
    </div>
  </div>
</template>
