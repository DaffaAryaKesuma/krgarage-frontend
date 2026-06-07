<script setup lang="ts">
// Format pendapatan ke Rupiah.
import { toIDR } from "@/utils/money";
// Helper alert dan badge ranking.
import { getAlertBoxClass, getAlertIconClass, getRankBadgeClass } from "@/utils/badgeVariants";

// Bentuk satu layanan teratas.
interface TeratasLayanan {
  nama_layanan: string;
  total_pesanan: number;
  total_pendapatan: number;
}

// Props list layanan paling laris.
interface Props {
  topLayanan: TeratasLayanan[];
}

defineProps<Props>();
</script>

<template>
  <!-- Card layanan paling laris. -->
  <div class="rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100 mb-8">
    <!-- Header section. -->
    <div class="mb-4 flex items-center gap-2 sm:gap-3">
      <div class=" p-2 sm:p-3 shrink-0">
        <i class="mdi mdi-trophy text-xl sm:text-2xl text-blue-600"></i>
      </div>
      <div>
        <h2 class="text-base sm:text-xl font-bold text-gray-900 leading-tight">Layanan Paling Laris</h2>
        <p class="text-xs text-gray-500">Berdasarkan jumlah pemesanan</p>
      </div>
    </div>

    <!-- List layanan jika ada data. -->
    <div v-if="topLayanan.length > 0" class="space-y-2">
      <div
        v-for="(layanan, index) in topLayanan"
        :key="index"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg"
      >
        <!-- Badge ranking. -->
        <span :class="[getRankBadgeClass('info'), 'h-8 w-8 text-sm']">
          {{ index + 1 }}
        </span>

        <!-- Nama layanan. -->
        <span class="flex-1 text-sm font-medium text-gray-900 truncate">
          {{ layanan.nama_layanan }}
        </span>

        <!-- Jumlah pesanan dan pendapatan. -->
        <div class="text-right shrink-0">
          <p class="text-sm font-medium text-gray-900">{{ layanan.total_pesanan }}x</p>
          <p class="text-xs text-gray-500">{{ toIDR(layanan.total_pendapatan) }}</p>
        </div>
      </div>
    </div>

    <!-- Empty state jika belum ada data. -->
    <div v-else :class="[getAlertBoxClass('info'), 'text-center']">
      <i
        :class="[getAlertIconClass('info'), 'mdi mdi-chart-box-outline text-4xl']"
      ></i>
      <p class="mt-2 text-sm text-gray-600 font-medium">Belum ada data layanan</p>
      <p class="text-xs text-gray-400">Pada periode ini</p>
    </div>
  </div>
</template>
