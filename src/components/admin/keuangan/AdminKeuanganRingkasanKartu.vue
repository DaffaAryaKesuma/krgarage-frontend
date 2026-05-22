<script setup lang="ts">
import { toIDR } from "@/utils/money";

interface Ringkasan {
  total_pendapatan: number;
  total_pemesanan: number;
  rata_rata_nilai_pesan: number;
}

interface RingkasanKartu {
  title: string;
  key: keyof Ringkasan;
  color: "green" | "blue";
  icon: string;
  format: (value: number) => string;
}

interface Props {
  ringkasan: Ringkasan;
}

defineProps<Props>();

const KARTU_COLOR_CLASSES = {
  green: {
    bgIcon: "bg-green-50",
    textIcon: "text-green-600",
  },
  blue: {
    bgIcon: "bg-blue-50",
    textIcon: "text-blue-600",
  },
} as const;

const RINGKASAN_KARTU: RingkasanKartu[] = [
  {
    title: "Total Pendapatan",
    key: "total_pendapatan",
    color: "green",
    icon: "mdi-cash-multiple",
    format: (value) => toIDR(value),
  },
  {
    title: "Total Transaksi",
    key: "total_pemesanan",
    color: "blue",
    icon: "mdi-receipt-text",
    format: (value) => value.toString(),
  },
];
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 sm:gap-6 gap-4 mb-6">
    <div 
      v-for="kartu in RINGKASAN_KARTU" 
      :key="kartu.key"
      class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between"
    >
      <div>
        <p class="text-slate-500 text-sm font-medium">{{ kartu.title }}</p>
        <h3 class="text-3xl font-bold text-slate-800 mt-1">
          {{ kartu.format(ringkasan[kartu.key]) }}
        </h3>
      </div>
      
      <div 
        :class="[
          'h-14 w-14 rounded-full flex items-center justify-center', 
          KARTU_COLOR_CLASSES[kartu.color].bgIcon, 
          KARTU_COLOR_CLASSES[kartu.color].textIcon
        ]"
      >
        <i :class="['mdi text-3xl', kartu.icon]"></i>
      </div>
    </div>
  </div>
</template>
