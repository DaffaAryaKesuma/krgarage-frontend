<script setup lang="ts">
import { toIDR } from "@/utils/money";

interface Summary {
  total_pendapatan: number;
  total_pemesanan: number;
  rata_rata_nilai_pesan: number;
}

interface SummaryCard {
  title: string;
  key: keyof Summary;
  color: "blue" | "green";
  icon: string;
  format: (value: number) => string;
}

interface Props {
  summary: Summary;
}

defineProps<Props>();

const CARD_COLOR_CLASSES = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    text: "text-blue-100",
  },
  green: {
    gradient: "from-green-500 to-green-600",
    text: "text-green-100",
  },
} as const;

const SUMMARY_CARDS: SummaryCard[] = [
  {
    title: "Total Pendapatan",
    key: "total_pendapatan",
    color: "blue",
    icon: "mdi-cash-multiple",
    format: (value) => toIDR(value),
  },
  {
    title: "Total Transaksi",
    key: "total_pemesanan",
    color: "green",
    icon: "mdi-receipt-text",
    format: (value) => value.toString(),
  },
];
</script>

<template>
  <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
    <div
      v-for="card in SUMMARY_CARDS"
      :key="card.key"
      class="rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg sm:p-8"
      :class="CARD_COLOR_CLASSES[card.color].gradient"
    >
      <div class="flex items-center justify-between">
        <div>
          <p
            class="text-sm font-medium mb-1"
            :class="CARD_COLOR_CLASSES[card.color].text"
          >
            {{ card.title }}
          </p>
          <p class="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
            {{ card.format(summary[card.key]) }}
          </p>
        </div>
        <div class="rounded-full bg-white/20 p-3 sm:p-4">
          <i :class="`mdi ${card.icon} text-3xl sm:text-4xl`"></i>
        </div>
      </div>
    </div>
  </div>
</template>
