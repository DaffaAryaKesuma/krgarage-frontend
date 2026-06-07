<script setup lang="ts">
// LoadingSpinner tampil saat data masih dimuat.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Helper opsi bulan untuk label periode.
import { getMonthOptions } from "@/utils/dateFilters";
// Tipe metrik layanan teratas.
import type { TeratasLayananMetric } from "@/types/layanan";
// Helper class badge, ikon, rank, hover, dan warna teks.
import {
  getChipBadgeClass,
  getIconToneClass,
  getRankBadgeClass,
  getSoftHoverToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";

// Props menerima data layanan terlaris dan periode.
interface Props {
  layanan: TeratasLayananMetric[];
  loading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

defineProps<Props>();

// Opsi bulan untuk membaca nama bulan dari selectedMonth.
const MONTH_OPTIONS = getMonthOptions();
</script>

<template>
  <!-- Kartu layanan terlaris. -->
  <div class="rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100">
    <!-- Header kartu dan periode. -->
    <div class="mb-4 flex items-center gap-2 sm:gap-3">
      <div :class="['rounded-full p-2 sm:p-3 shrink-0', getIconToneClass('info')]">
        <i class="mdi mdi-wrench text-lg sm:text-2xl"></i>
      </div>
      <div class="min-w-0">
        <h2 class="text-base sm:text-xl font-bold text-gray-900 leading-tight">Layanan Terlaris</h2>
        <p class="text-xs text-gray-600">
          Periode:
          <span :class="getChipBadgeClass('info')"
            >{{ MONTH_OPTIONS[selectedMonth - 1].label }}
            {{ selectedYear }}</span
          >
        </p>
      </div>
    </div>

    <!-- Loading saat data layanan terlaris diambil. -->
    <LoadingSpinner v-if="loading" message="Memuat layanan terlaris..." />

    <!-- Tampilkan maksimal 5 layanan teratas. -->
    <div v-else-if="layanan.length > 0" class="space-y-2">
      <div
        v-for="(item, index) in layanan.slice(0, 5)"
        :key="item.id"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition border border-gray-100',
          getSoftHoverToneClass('info'),
        ]"
      >
        <!-- Nomor ranking layanan. -->
        <span :class="getRankBadgeClass('info')">
          {{ index + 1 }}
        </span>
        <!-- Nama layanan. -->
        <span class="flex-1 text-sm font-medium text-gray-800 truncate">
          {{ item.nama_layanan }}
        </span>
        <!-- Total terjual. -->
        <span :class="['text-sm font-bold shrink-0', getToneTextClass('info')]">
          {{ item.total }}x
        </span>
      </div>
    </div>

    <!-- Empty state jika tidak ada penjualan layanan pada periode ini. -->
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
