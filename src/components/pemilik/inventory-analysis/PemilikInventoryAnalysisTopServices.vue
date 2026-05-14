<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { getMonthOptions } from "@/utils/dateFilters";
import type { TopServiceMetric } from "@/types/service";

interface Props {
  services: TopServiceMetric[];
  loading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

defineProps<Props>();

const MONTH_OPTIONS = getMonthOptions();
</script>

<template>
  <div class="rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100">
    <div class="mb-4 flex items-center gap-2 sm:gap-3">
      <div class="rounded-xl bg-blue-100 p-2 sm:p-3 shrink-0">
        <i class="mdi mdi-trophy text-lg sm:text-2xl text-blue-600"></i>
      </div>
      <div class="min-w-0">
        <h2 class="text-base sm:text-xl font-bold text-gray-900 leading-tight">Top 5 Layanan Terlaris</h2>
        <p class="text-xs text-gray-600">
          Periode:
          <span class="font-semibold text-blue-600"
            >{{ MONTH_OPTIONS[selectedMonth - 1].label }}
            {{ selectedYear }}</span
          >
        </p>
      </div>
    </div>

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 5"
        :key="i"
        class="h-14 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <div v-else-if="services.length > 0" class="space-y-2">
      <div
        v-for="(service, index) in services.slice(0, 5)"
        :key="service.id"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition border border-gray-100"
      >
        <!-- Rank badge -->
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-500 shrink-0">
          {{ index + 1 }}
        </span>
        <!-- Nama -->
        <span class="flex-1 text-sm font-medium text-gray-800 truncate">
          {{ service.nama_layanan }}
        </span>
        <!-- Jumlah -->
        <span class="text-sm font-bold text-blue-600 shrink-0">
          {{ service.total_pemesanan ?? service.total }}x
        </span>
      </div>
    </div>

    <div
      v-else
      class="py-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
    >
      <i class="mdi mdi-chart-box-outline text-4xl text-gray-300"></i>
      <p class="mt-2 text-sm text-gray-600 font-medium">Belum ada data</p>
      <p class="text-xs text-gray-400">Pada periode ini</p>
    </div>
  </div>
</template>
