<script setup lang="ts">
// LoadingSpinner tampil saat data masih dimuat.
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
// Helper opsi bulan untuk label periode.
import { getMonthOptions } from "@/utils/dateFilters";
// Tipe metrik suku cadang teratas.
import type { TeratasSukuCadangMetric } from "@/types/inventaris";
// Helper class badge, ikon, rank, hover, dan warna teks.
import {
  getChipBadgeClass,
  getIconToneClass,
  getRankBadgeClass,
  getSoftHoverToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";

// Props menerima data suku cadang terlaris dan periode.
interface Props {
  sukucadang: TeratasSukuCadangMetric[];
  loading: boolean;
  selectedMonth: number;
  selectedYear: number;
}

defineProps<Props>();

// Opsi bulan untuk membaca nama bulan dari selectedMonth.
const MONTH_OPTIONS = getMonthOptions();
</script>

<template>
  <!-- Kartu suku cadang terlaris. -->
  <div class="rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100">
    <!-- Header kartu dan periode. -->
    <div class="mb-4 flex items-center gap-2 sm:gap-3">
      <div :class="['rounded-full p-2 sm:p-3 shrink-0', getIconToneClass('success')]">
        <i class="mdi mdi-cog text-lg sm:text-2xl"></i>
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

    <!-- Loading saat data suku cadang terlaris diambil. -->
    <LoadingSpinner v-if="loading" message="Memuat suku cadang terlaris..." />

    <!-- Tampilkan maksimal 5 suku cadang teratas. -->
    <div v-else-if="sukucadang.length > 0" class="space-y-2">
      <div
        v-for="(item, index) in sukucadang.slice(0, 5)"
        :key="item.id"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition border border-gray-100',
          getSoftHoverToneClass('success'),
        ]"
      >
        <!-- Nomor ranking suku cadang. -->
        <span :class="getRankBadgeClass('success')">
          {{ index + 1 }}
        </span>
        <!-- Nama suku cadang. -->
        <span class="flex-1 text-sm font-medium text-gray-800 truncate">
          {{ item.nama_barang }}
        </span>
        <!-- Total terjual. -->
        <span :class="['text-sm font-bold shrink-0', getToneTextClass('success')]">
          {{ item.total_terjual }}x
        </span>
      </div>
    </div>

    <!-- Empty state jika belum ada penjualan suku cadang pada periode ini. -->
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
