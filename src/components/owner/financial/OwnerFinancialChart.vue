<script setup lang="ts">
import { Line } from "vue-chartjs";
import { formatDateShort } from "@/utils/date";

interface Props {
  revenueData: {
    labels: string[];
    datasets: any[];
  };
  loading: boolean;
  startDate: string;
  endDate: string;
}

defineProps<Props>();

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: { size: 14 },
      bodyFont: { size: 13 },
      callbacks: {
        label: (context: any) =>
          "Rp " + context.parsed.y.toLocaleString("id-ID"),
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => "Rp " + (value / 1000).toFixed(0) + "k",
      },
      grid: { color: "rgba(0, 0, 0, 0.05)" },
    },
    x: { grid: { display: false } },
  },
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <i class="mdi mdi-chart-line text-red-600"></i>
        Tren Pendapatan
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        Periode:
        <span class="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
          {{ formatDateShort(startDate) }} -
          {{ formatDateShort(endDate) }}
        </span>
      </p>
    </div>

    <div
      class="h-80 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
    >
      <Line v-if="!loading" :data="revenueData" :options="CHART_OPTIONS" />
      <div v-else class="flex h-full items-center justify-center">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"
        ></div>
      </div>
    </div>
  </div>
</template>
