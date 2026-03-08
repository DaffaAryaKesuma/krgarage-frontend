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

const props = defineProps<Props>();

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
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <div
      v-for="card in SUMMARY_CARDS"
      :key="card.key"
      class="bg-gradient-to-br rounded-2xl shadow-lg p-8 text-white"
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
          <p class="text-4xl font-bold mt-2">
            {{ card.format(summary[card.key]) }}
          </p>
        </div>
        <div class="bg-white/20 rounded-full p-4">
          <i :class="`mdi ${card.icon} text-4xl`"></i>
        </div>
      </div>
    </div>
  </div>
</template>
