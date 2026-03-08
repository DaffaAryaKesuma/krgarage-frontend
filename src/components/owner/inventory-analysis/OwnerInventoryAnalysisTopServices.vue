<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { getMonthOptions } from "@/utils/dateFilters";

interface Service {
  id: number;
  nama_layanan: string;
  harga: number;
  total_pemesanan: number;
}

interface Props {
  services: Service[];
  loading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

defineProps<Props>();

const MONTH_OPTIONS = getMonthOptions();
</script>

<template>
  <div class="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
    <div class="mb-6 flex items-center gap-3">
      <div class="rounded-xl bg-blue-100 p-3">
        <i class="mdi mdi-trophy text-2xl text-blue-600"></i>
      </div>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Top 5 Layanan Terlaris</h2>
        <p class="text-sm text-gray-600">
          Periode:
          <span class="font-semibold text-blue-600"
            >{{ MONTH_OPTIONS[selectedMonth - 1].label }}
            {{ selectedYear }}</span
          >
        </p>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="h-20 animate-pulse rounded-lg bg-gray-200"
      ></div>
    </div>

    <div v-else-if="services.length > 0" class="space-y-3">
      <div
        v-for="(service, index) in services.slice(0, 5)"
        :key="service.id"
        class="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition border border-gray-100"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 shadow-sm"
        >
          {{ index + 1 }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-900 truncate">
            {{ service.nama_layanan }}
          </div>
          <div class="text-xs text-gray-500">
            {{ toIDR(service.harga) }}
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-2xl font-bold text-blue-600">
            {{ service.total_pemesanan }}
          </div>
          <div class="text-xs text-gray-600">pemesanan</div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
    >
      <i class="mdi mdi-chart-box-outline text-5xl text-gray-300"></i>
      <p class="mt-3 text-gray-600 font-medium">Belum ada data layanan</p>
      <p class="text-xs text-gray-400">Pada periode ini</p>
    </div>
  </div>
</template>
