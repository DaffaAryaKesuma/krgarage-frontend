<script setup lang="ts">
// computed menyusun daftar kartu dari props ringkasan.
import { computed } from "vue";
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper class ikon berdasarkan tone.
import { getIconToneClass, type IconToneKey } from "@/utils/badgeVariants";

// Ringkasan keuangan yang dihitung di halaman induk.
interface Ringkasan {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  totalPemesanan: number;
  totalRestok: number;
  avgPemesanan: number;
}

// Props menerima ringkasan laporan.
interface Props {
  ringkasan: Ringkasan;
}

const props = defineProps<Props>();

// Data kartu disusun di computed agar otomatis berubah saat props berubah.
const RINGKASAN_KARTU = computed(() => [
  {
    title: "Total Pendapatan",
    value: toIDR(props.ringkasan.totalRevenue),
    icon: "mdi-currency-usd",
    tone: "success" as IconToneKey,
  },
  {
    title: "Total Pemesanan Lunas",
    value: props.ringkasan.totalPemesanan.toString(),
    icon: "mdi-receipt-text",
    tone: "info" as IconToneKey,
  },
  {
    title: "Pengeluaran Restok",
    value: toIDR(props.ringkasan.totalExpense),
    icon: "mdi-cash-minus",
    tone: "danger" as IconToneKey,
  },
  {
    title: "Keuntungan Bersih",
    value: toIDR(props.ringkasan.netProfit),
    icon: "mdi-wallet-plus",
    tone: "emerald" as IconToneKey,
  },
]);
</script>

<template>
  <!-- Grid kartu ringkasan laporan keuangan. -->
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
    <!-- Satu kartu ringkasan. -->
    <div
      v-for="card in RINGKASAN_KARTU"
      :key="card.title"
      class="rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-lg sm:p-6"
    >
      <div class="flex items-center justify-between gap-3 sm:items-start">
        <div class="min-w-0">
          <p class="text-[11px] font-medium leading-tight text-gray-600 sm:text-sm">
            {{ card.title }}
          </p>
          <h3 class="mt-1 break-words text-base font-bold leading-tight text-gray-900 sm:text-xl">
            {{ card.value }}
          </h3>
        </div>
        <!-- Ikon mengikuti tone kartu. -->
        <div
          :class="[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
            getIconToneClass(card.tone),
          ]"
        >
          <i :class="['mdi', card.icon, 'text-lg sm:text-2xl']"></i>
        </div>
      </div>
    </div>
  </div>
</template>
