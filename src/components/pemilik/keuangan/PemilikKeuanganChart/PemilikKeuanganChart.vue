<script setup lang="ts">
// Komponen Line dari vue-chartjs.
import { Line } from "vue-chartjs";
// Helper format tanggal pendek.
import { formatDateShort } from "@/utils/date";
// Opsi chart dipisah agar file template lebih ringkas.
import { CHART_OPTIONS } from "./usePemilikKeuanganChart";
// Helper badge periode.
import { getChipBadgeClass } from "@/utils/badgeVariants";

// Props menerima data chart, loading, dan periode laporan.
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
</script>

<template>
  <!-- Kartu grafik tren pendapatan. -->
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
    <!-- Header grafik dan badge periode. -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <i class="mdi mdi-chart-line text-red-600"></i>
        Tren Pendapatan
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        Periode:
        <span :class="getChipBadgeClass('primary')">
          {{ formatDateShort(startDate) }} -
          {{ formatDateShort(endDate) }}
        </span>
      </p>
    </div>

    <div
      class="h-80 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
    >
      <!-- Chart tampil setelah data selesai dimuat. -->
      <Line v-if="!loading" :data="revenueData" :options="CHART_OPTIONS" />
      <!-- Spinner saat chart masih loading. -->
      <div v-else class="flex h-full items-center justify-center">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"
        ></div>
      </div>
    </div>
  </div>
</template>
