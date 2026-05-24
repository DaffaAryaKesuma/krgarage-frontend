<script setup lang="ts">
import { computed } from "vue";
import { toIDR } from "@/utils/money";

interface Ringkasan {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  totalPemesanan: number;
  totalRestok: number;
  avgPemesanan: number;
}

interface Props {
  ringkasan: Ringkasan;
}

const props = defineProps<Props>();

const RINGKASAN_KARTU = computed(() => [
  {
    title: "Total Pendapatan",
    value: toIDR(props.ringkasan.totalRevenue),
    icon: "mdi-currency-usd",
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Total Pemesanan Lunas",
    value: props.ringkasan.totalPemesanan.toString(),
    icon: "mdi-receipt-text",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Pengeluaran Restok",
    value: toIDR(props.ringkasan.totalExpense),
    icon: "mdi-cash-minus",
    bg: "bg-red-100",
    color: "text-red-600",
  },
  {
    title: "Keuntungan Bersih",
    value: toIDR(props.ringkasan.netProfit),
    icon: "mdi-wallet-plus",
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
        <div
          :class="[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
            card.bg,
          ]"
        >
          <i :class="['mdi', card.icon, 'text-lg sm:text-2xl', card.color]"></i>
        </div>
      </div>
    </div>
  </div>
</template>
