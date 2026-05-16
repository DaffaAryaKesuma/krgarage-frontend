<script setup lang="ts">
import { computed } from "vue";
import { toIDR } from "@/utils/money";

interface Ringkasan {
  totalRevenue: number;
  totalPemesanan: number;
  avgPemesanan: number;
}

interface Props {
  ringkasan: Ringkasan;
}

const props = defineProps<Props>();

const RINGKASAN_KARTU = computed(() => [
  {
    title: "Total Pendapatan",
    value: toIDR(props.ringkasan.totalRevenue),
    icon: "mdi-currency-usd",
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Total Pemesanan",
    value: props.ringkasan.totalPemesanan.toString(),
    icon: "mdi-receipt-text",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Rata-rata Pemesanan",
    value: toIDR(props.ringkasan.avgPemesanan),
    icon: "mdi-chart-bar",
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div
      v-for="card in RINGKASAN_KARTU"
      :key="card.title"
      class="rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-medium text-gray-600">{{ card.title }}</p>
          <h3 class="mt-1 text-xl sm:text-xl font-bold text-gray-900">
            {{ card.value }}
          </h3>
        </div>
        <div :class="['rounded-xl p-3 shrink-0', card.bg]">
          <i :class="['mdi', card.icon, 'text-2xl', card.color]"></i>
        </div>
      </div>
    </div>
  </div>
</template>
