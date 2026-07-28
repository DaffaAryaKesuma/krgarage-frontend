<script setup lang="ts">
// Grafik batang berdampingan (Grouped Bar Chart) dari vue-chartjs.
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toIDR } from "@/utils/money";

// Daftarkan komponen Chart.js yang diperlukan.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Interface data perbandingan dari API.
interface PerformaItem {
  pendapatan: number;
  pengeluaran: number;
  keuntungan: number;
}

interface Props {
  hariIni: PerformaItem;
  kemarin: PerformaItem;
  loading: boolean;
}

const props = defineProps<Props>();

// Format angka ke rupiah ringkas untuk sumbu Y.
function formatRupiahRingkas(value: number): string {
  const isNegative = value < 0;
  const absVal = Math.abs(value);
  const prefix = isNegative ? "-Rp " : "Rp ";

  if (absVal >= 1_000_000) {
    return prefix + (absVal / 1_000_000).toFixed(1).replace(".", ",") + " jt";
  }
  if (absVal >= 1_000) {
    return prefix + (absVal / 1_000).toFixed(0) + " rb";
  }
  return prefix + absVal.toLocaleString("id-ID");
}

// Susun data grafik dari props setiap kali data berubah dengan proporsi batang yang sleek.
const chartData = computed(() => ({
  labels: ["Pendapatan", "Pengeluaran", "Keuntungan"],
  datasets: [
    {
      // Dataset Hari Ini — Warna Merah KRGarage yang Vibrant & Sleek.
      label: "Hari Ini",
      data: [
        props.hariIni.pendapatan,
        props.hariIni.pengeluaran,
        props.hariIni.keuntungan,
      ],
      backgroundColor: "rgba(225, 29, 72, 0.88)",
      hoverBackgroundColor: "rgba(225, 29, 72, 1)",
      borderColor: "transparent",
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 54,
      barPercentage: 0.92,
      categoryPercentage: 0.75,
    },
    {
      // Dataset Kemarin — Warna Slate Gray Netral & Elegan.
      label: "Kemarin",
      data: [
        props.kemarin.pendapatan,
        props.kemarin.pengeluaran,
        props.kemarin.keuntungan,
      ],
      backgroundColor: "rgba(148, 163, 184, 0.75)",
      hoverBackgroundColor: "rgba(100, 116, 139, 0.9)",
      borderColor: "transparent",
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 54,
      barPercentage: 0.92,
      categoryPercentage: 0.75,
    },
  ],
}));

// Opsi Chart.js untuk Grouped Bar Chart yang bersih dan intuitif.
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
      align: "end" as const,
      labels: {
        font: { size: 12, family: "'Inter', sans-serif" },
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 8,
        boxHeight: 8,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      padding: 12,
      titleFont: { size: 13, weight: "bold" as const },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => {
          const val = ctx.parsed.y;
          return `  ${ctx.dataset.label}: ${toIDR(val)}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { size: 12, family: "'Inter', sans-serif" },
        color: "#374151",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: { size: 11, family: "'Inter', sans-serif" },
        color: "#6B7280",
        callback: (value: any) => formatRupiahRingkas(value),
      },
    },
  },
}));

// Hitung selisih persentase untuk setiap metrik.
function hitungPersentase(
  sekarang: number,
  lalu: number,
): { nilai: string; naik: boolean; nol: boolean } {
  if (lalu === 0 && sekarang === 0)
    return { nilai: "0%", naik: true, nol: true };
  if (lalu === 0) return { nilai: "+100%", naik: true, nol: false };
  const persen = ((sekarang - lalu) / Math.abs(lalu)) * 100;
  const naik = persen >= 0;
  return {
    nilai: (naik ? "+" : "") + persen.toFixed(1) + "%",
    naik,
    nol: persen === 0,
  };
}

// Data ringkasan badge persentase & nominal di atas grafik.
const ringkasanCards = computed(() => [
  {
    title: "Pendapatan",
    icon: "mdi-cash-multiple",
    hariIni: props.hariIni.pendapatan,
    kemarin: props.kemarin.pendapatan,
    iconBg: "bg-emerald-50 text-emerald-600",
    ...hitungPersentase(props.hariIni.pendapatan, props.kemarin.pendapatan),
  },
  {
    title: "Pengeluaran Restok",
    icon: "mdi-cart-arrow-down",
    hariIni: props.hariIni.pengeluaran,
    kemarin: props.kemarin.pengeluaran,
    iconBg: "bg-amber-50 text-amber-600",
    ...hitungPersentase(props.hariIni.pengeluaran, props.kemarin.pengeluaran),
  },
  {
    title: "Keuntungan",
    icon: "mdi-wallet-plus",
    hariIni: props.hariIni.keuntungan,
    kemarin: props.kemarin.keuntungan,
    iconBg: "bg-rose-50 text-rose-600",
    ...hitungPersentase(props.hariIni.keuntungan, props.kemarin.keuntungan),
  },
]);
</script>

<template>
  <!-- Widget perbandingan performa harian. -->
  <div class="mb-4 sm:mb-6 rounded-2xl bg-white p-4 shadow-md sm:p-6">
    <!-- Header widget. -->
    <div
      class="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"
        >
          <i class="mdi mdi-chart-bar text-2xl"></i>
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-900 sm:text-lg">
            Perbandingan Performa Harian
          </h2>
          <p class="text-xs text-gray-500 sm:text-sm">Hari Ini vs Kemarin</p>
        </div>
      </div>

      <!-- Badge tanggal hari ini. -->
      <div
        class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600"
      >
        <i class="mdi mdi-calendar text-red-600"></i>
        <span>
          {{
            new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          }}
        </span>
      </div>
    </div>

    <!-- Loading state. -->
    <div v-if="loading" class="flex h-72 items-center justify-center">
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"
      ></div>
    </div>

    <template v-else>
      <!-- Area Grafik Batang Grouped Bar Chart murni tanpa kartu ganda. -->
      <div class="relative h-64 w-full sm:h-72">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </template>
  </div>
</template>
