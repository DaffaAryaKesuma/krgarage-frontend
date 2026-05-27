<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { getIconToneClass } from "@/utils/badgeVariants";
import type { IconToneKey } from "@/utils/badgeVariants";

interface Ringkasan {
  total_pendapatan: number;
  total_pemesanan: number;
  rata_rata_nilai_pesan: number;
}

interface RingkasanKartu {
  title: string;
  key: keyof Ringkasan;
  color: IconToneKey;
  icon: string;
  format: (value: number) => string;
}

interface Props {
  ringkasan: Ringkasan;
}

defineProps<Props>();

const RINGKASAN_KARTU: RingkasanKartu[] = [
  {
    title: "Total Pendapatan",
    key: "total_pendapatan",
    color: "success",
    icon: "mdi-cash-multiple",
    format: (value) => toIDR(value),
  },
  {
    title: "Total Transaksi",
    key: "total_pemesanan",
    color: "info",
    icon: "mdi-receipt-text",
    format: (value) => value.toString(),
  },
];
</script>

<template>
  <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
    <div 
      v-for="kartu in RINGKASAN_KARTU" 
      :key="kartu.key"
      class="rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-lg sm:p-6"
    >
      <div class="flex items-center justify-between gap-3 sm:items-start">
        <div class="min-w-0">
          <p class="text-[11px] font-medium leading-tight text-gray-600 sm:text-sm">
            {{ kartu.title }}
          </p>
          <h3 class="mt-1 break-words text-base font-bold leading-tight text-gray-900 sm:text-xl">
            {{ kartu.format(ringkasan[kartu.key]) }}
          </h3>
        </div>

        <div
          :class="[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
            getIconToneClass(kartu.color),
          ]"
        >
          <i :class="['mdi', kartu.icon, 'text-lg sm:text-2xl']"></i>
        </div>
      </div>
    </div>
  </div>
</template>
