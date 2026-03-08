<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Chart, registerables } from "chart.js";
import { toIDR } from "@/utils/money";
import { MONTH_NAMES } from "@/utils/dateFilters";

Chart.register(...registerables);

interface Props {
  monthlyData: Array<{ bulan: number; pendapatan: string }>;
  selectedYear: number;
}

const props = defineProps<Props>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const getChartData = () =>
  MONTH_NAMES.map((_, index) => {
    const monthData = props.monthlyData.find((d) => d.bulan === index + 1);
    return monthData ? parseFloat(monthData.pendapatan) : 0;
  });

const renderChart = () => {
  if (!chartCanvas.value) return;

  chartInstance?.destroy();

  chartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels: MONTH_NAMES,
      datasets: [
        {
          label: "Pendapatan (Rp)",
          data: getChartData(),
          backgroundColor: "rgba(220, 38, 38, 0.8)",
          borderColor: "rgb(220, 38, 38)",
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Rp ${toIDR(context.parsed.y || 0)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `Rp ${(value as number) / 1000}k`,
          },
        },
      },
    },
  });
};

watch(() => props.monthlyData, renderChart, { deep: true });

onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  chartInstance?.destroy();
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      Pendapatan Bulanan {{ selectedYear }}
    </h2>
    <canvas ref="chartCanvas" class="w-full max-h-[400px]"></canvas>
  </div>
</template>
