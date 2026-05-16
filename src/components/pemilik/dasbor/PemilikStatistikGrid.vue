<script setup lang="ts">
import { computed } from "vue";
import { toIDR } from "@/utils/money";

interface Statistik {
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
}

interface Props {
  statistik: Statistik;
  ringkasan: Ringkasan | null;
}

const props = defineProps<Props>();

const STAT_KARTU = computed(() => [
  {
    title: "Pendapatan Hari Ini",
    value: toIDR(props.statistik.pendapatanHariIni),
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
  <div class="mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="card in STAT_KARTU"
        :key="card.title"
        class="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-md transition-all hover:shadow-lg"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">{{ card.title }}</p>

            <!-- Loading State -->
            <div v-if="statistik.loading || !ringkasan" class="mt-2">
              <div class="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>

            <!-- Value -->
            <h3
              v-else
              class="mt-2 text-xl font-bold text-gray-900 break-words leading-tight"
            >
              {{ card.value }}
            </h3>
          </div>

          <!-- Icon -->
          <div
            :class="['rounded-xl flex items-center justify-center', card.iconBgColor]"
            style="width: 48px; height: 48px"
          >
            <i
              :class="['mdi', card.icon, card.iconColor, 'text-2xl']"
              style="line-height: 1"
            ></i>
          </div>
        </div>

        <!-- Decorative Element -->
        <div
          class="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"
        ></div>
      </div>
    </div>
  </div>
</template>
