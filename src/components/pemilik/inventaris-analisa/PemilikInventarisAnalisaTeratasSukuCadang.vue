<script setup lang="ts">
import { getMonthOptions } from "@/utils/dateFilters";
import type { TeratasSukuCadangMetric } from "@/types/inventaris";
import {
  getChipBadgeClass,
  getIconToneClass,
  getRankBadgeClass,
  getSoftHoverToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";

interface Props {
  sukucadang: TeratasSukuCadangMetric[];
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
      <div :class="['rounded-xl p-2 sm:p-3 shrink-0', getIconToneClass('success')]">
        <i class="mdi mdi-star text-lg sm:text-2xl"></i>
      </div>
      <div class="min-w-0">
        <h2 class="text-base sm:text-xl font-bold text-gray-900 leading-tight">
          Suku Cadang Terlaris
        </h2>
        <p class="text-xs text-gray-600">
          Periode:
          <span :class="getChipBadgeClass('success')"
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

    <div v-else-if="sukucadang.length > 0" class="space-y-2">
      <div
        v-for="(item, index) in sukucadang.slice(0, 5)"
        :key="item.id"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition border border-gray-100',
          getSoftHoverToneClass('success'),
        ]"
      >
        <!-- Rank badge -->
        <span :class="getRankBadgeClass('success')">
          {{ index + 1 }}
        </span>
        <!-- Nama -->
        <span class="flex-1 text-sm font-medium text-gray-800 truncate">
          {{ item.nama_barang }}
        </span>
        <!-- Jumlah -->
        <span :class="['text-sm font-bold shrink-0', getToneTextClass('success')]">
          {{ item.total_terjual }}x
        </span>
      </div>
    </div>

    <div
      v-else
      class="py-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
    >
      <i class="mdi mdi-package-variant-closed text-4xl text-gray-300"></i>
      <p class="mt-2 text-sm text-gray-600 font-medium">Belum ada penjualan</p>
      <p class="text-xs text-gray-400">Pada periode ini</p>
    </div>
  </div>
</template>
