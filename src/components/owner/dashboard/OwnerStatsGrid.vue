<script setup lang="ts">
import OwnerStatCard from "@/components/owner/dashboard/OwnerStatCard.vue";
import { toIDR } from "@/utils/money";

interface Stats {
  pendapatanHariIni: number;
  pendapatanBulanIni: number;
  unitHariIni: number;
  nilaiStok: number;
  loading: boolean;
}

interface Props {
  stats: Stats;
}

defineProps<Props>();

const STAT_CARDS = [
  {
    title: "Omzet Hari Ini",
    key: "pendapatanHariIni" as keyof Stats,
    icon: "mdi-cash-multiple",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
    formatter: (value: number) => toIDR(value),
  },
  {
    title: "Omzet Bulan Ini",
    key: "pendapatanBulanIni" as keyof Stats,
    icon: "mdi-chart-line",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    formatter: (value: number) => toIDR(value),
  },
  {
    title: "Unit Masuk Hari Ini",
    key: "unitHariIni" as keyof Stats,
    icon: "mdi-motorbike",
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600",
    formatter: (value: number) => value.toString(),
  },
  {
    title: "Nilai Aset Stok",
    key: "nilaiStok" as keyof Stats,
    icon: "mdi-package-variant",
    iconBgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    formatter: (value: number) => toIDR(value),
  },
];
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
    <OwnerStatCard
      v-for="card in STAT_CARDS"
      :key="card.key"
      :title="card.title"
      :value="card.formatter(stats[card.key] as number)"
      :icon="card.icon"
      :icon-bg-color="card.iconBgColor"
      :icon-color="card.iconColor"
      :loading="stats.loading"
    />
  </div>
</template>
