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

const kanvasGrafik = ref<HTMLCanvasElement | null>(null);
let instansiGrafik: Chart | null = null;

const getChartData = () =>
  MONTH_NAMES.map((_, index) => {
    const monthData = props.monthlyData.find((d) => d.bulan === index + 1);
    return monthData ? parseFloat(monthData.pendapatan) : 0;
  });

const renderChart = () => {
  if (!kanvasGrafik.value) return;

  instansiGrafik?.destroy();

  instansiGrafik = new Chart(kanvasGrafik.value, {
    type: "bar",
    data: {
      labels: MONTH_NAMES,
      datasets: [
        {
          label: "Pendapatan",
          data: getChartData(),
          backgroundColor: "#ef4444",
          borderColor: "#dc2626",
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
            label: (context) => toIDR(context.parsed.y || 0),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#f3f4f6",
          },
          ticks: {
            font: {
              size: window.innerWidth < 640 ? 10 : 12,
            },
            callback: (value) => toIDR(value as number),
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: window.innerWidth < 640 ? 10 : 12,
            },
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
  instansiGrafik?.destroy();
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      Pendapatan Bulanan {{ selectedYear }}
    </h2>
    <canvas ref="kanvasGrafik" class="w-full max-h-[400px]"></canvas>
  </div>
</template>
