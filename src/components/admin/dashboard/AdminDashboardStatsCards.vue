<script setup lang="ts">
import { computed } from "vue";

interface Stats {
  pemesanan_hari_ini: number;
  sedang_diproses: number;
  selesai_hari_ini: number;
}

interface StatCard {
  label: string;
  key: keyof Stats | "lowStock";
  color: "yellow" | "blue" | "green" | "red";
  icon: string;
  route: string;
  suffix?: (value: number) => string;
}

interface Props {
  stats: Stats;
  lowStockCount: number;
}

const props = defineProps<Props>();

const STAT_CARDS: StatCard[] = [
  {
    label: "Pemesanan Hari Ini",
    key: "pemesanan_hari_ini",
    color: "yellow",
    icon: "mdi mdi-calendar-today",
    route: "/admin/pemesanan",
    suffix: () => "pemesanan",
  },
  {
    label: "Dikerjakan",
    key: "sedang_diproses",
    color: "blue",
    icon: "mdi mdi-cog",
    route: "/admin/pemesanan",
    suffix: () => "vespa",
  },
  {
    label: "Selesai Hari Ini",
    key: "selesai_hari_ini",
    color: "green",
    icon: "mdi mdi-check-circle",
    route: "/admin/pemesanan",
    suffix: () => "pemesanan",
  },
  {
    label: "Peringatan Stok Kritis/Habis",
    key: "lowStock",
    color: "red",
    icon: "mdi mdi-alert-circle",
    route: "/admin/inventaris",
    suffix: (value) => (value > 0 ? "item perlu restock" : "semua aman"),
  },
];

const colorClasses = computed(() => ({
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "border-yellow-500",
  },
  blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-500" },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-500",
  },
  red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-500" },
}));

const getStatValue = (key: StatCard["key"]) => {
  return key === "lowStock" ? props.lowStockCount : props.stats[key];
};

const getCardColorClasses = (color: string) => {
  return colorClasses.value[color as keyof typeof colorClasses.value];
};
</script>

<template>
  <div class="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
    <router-link
      v-for="card in STAT_CARDS"
      :key="card.key"
      :to="card.route"
      class="rounded-xl border-l-4 bg-white p-3 shadow-md transition-shadow hover:shadow-lg sm:p-6"
      :class="getCardColorClasses(card.color).border"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs leading-tight text-gray-600 font-medium sm:text-sm">
            {{ card.label }}
          </p>
          <h3 class="mt-1 text-2xl font-bold text-gray-900 sm:mt-2 sm:text-3xl">
            {{ getStatValue(card.key) }}
          </h3>
          <p
            class="mt-1 text-[11px] sm:text-xs"
            :class="
              card.color === 'red'
                ? 'text-red-600 font-medium'
                : 'text-gray-500'
            "
          >
            {{ card.suffix ? card.suffix(getStatValue(card.key)) : "" }}
          </p>
        </div>
        <div
          class="rounded-full p-2 sm:p-3"
          :class="getCardColorClasses(card.color).bg"
        >
          <i
            :class="`${card.icon} text-2xl sm:text-4xl ${
              getCardColorClasses(card.color).text
            }`"
          ></i>
        </div>
      </div>
    </router-link>
  </div>
</template>
