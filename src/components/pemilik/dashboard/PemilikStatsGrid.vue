<script setup lang="ts">
import { computed } from "vue";
import PemilikStatCard from "@/components/pemilik/dashboard/PemilikStatCard.vue";
import { toIDR } from "@/utils/money";

interface Stats {
  pendapatanHariIni: number;
  pendapatanBulanIni: number;
  unitHariIni: number;
  nilaiStok: number;
  loading: boolean;
}

interface Ringkasan {
  finansial?: {
    pendapatan_kotor: number;
    pengeluaran: number;
    keuntungan_bersih: number;
  };
  operasional?: {
    total_pemesanan_selesai: number;
    total_pelanggan_aktif: number;
  };
  performa?: {
    mekanik_terbaik: {
      nama: string;
      total_pekerjaan: number;
    } | null;
    suku_cadang_terlaris: any[];
  };
}

interface Props {
  stats: Stats;
  ringkasan: Ringkasan | null;
}

const props = defineProps<Props>();

const STAT_CARDS = computed(() => [
  {
    title: "Pendapatan Hari Ini",
    value: toIDR(props.stats.pendapatanHariIni),
    icon: "mdi-cash-multiple",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Pendapatan Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.pendapatan_kotor || 0),
    icon: "mdi-chart-line",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Pengeluaran Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.pengeluaran || 0),
    icon: "mdi-cash-minus",
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "Keuntungan Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.keuntungan_bersih || 0),
    icon: "mdi-wallet-plus",
    iconBgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
]);
</script>

<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Ringkasan Finansial</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <PemilikStatCard
        v-for="card in STAT_CARDS"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :icon-bg-color="card.iconBgColor"
        :icon-color="card.iconColor"
        :loading="stats.loading || !ringkasan"
      />
    </div>
  </div>
</template>
