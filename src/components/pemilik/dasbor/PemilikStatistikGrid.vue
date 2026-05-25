<script setup lang="ts">
import { computed } from "vue";
import { toIDR } from "@/utils/money";
import { getIconToneClass, type IconToneKey } from "@/utils/badgeVariants";

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
    tone: "success" as IconToneKey,
  },
  {
    title: "Pendapatan Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.pendapatan_kotor || 0),
    icon: "mdi-chart-line",
    tone: "info" as IconToneKey,
  },
  {
    title: "Pengeluaran Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.pengeluaran || 0),
    icon: "mdi-cash-minus",
    tone: "danger" as IconToneKey,
  },
  {
    title: "Keuntungan Bulan Ini",
    value: toIDR(props.ringkasan?.finansial?.keuntungan_bersih || 0),
    icon: "mdi-wallet-plus",
    tone: "emerald" as IconToneKey,
  },
]);
</script>

<template>
  <div class="mb-4 sm:mb-6">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      <div
        v-for="card in STAT_KARTU"
        :key="card.title"
        class="relative overflow-hidden rounded-xl bg-white px-3 py-2.5 shadow-md transition-all hover:shadow-lg sm:rounded-2xl sm:p-6"
      >
        <div class="flex items-center justify-between gap-3 sm:min-h-0 sm:items-start">
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-medium leading-tight text-gray-600 sm:text-sm">
              {{ card.title }}
            </p>

            <!-- Loading State -->
            <div v-if="statistik.loading || !ringkasan" class="mt-2">
              <div class="h-6 w-20 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-32"></div>
            </div>

            <!-- Value -->
            <h3
              v-else
              class="mt-1 break-words text-base font-bold leading-tight text-gray-900 sm:mt-2 sm:text-xl"
            >
              {{ card.value }}
            </h3>
          </div>

          <!-- Icon -->
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl',
              getIconToneClass(card.tone),
            ]"
          >
            <i
              :class="['mdi', card.icon, 'text-lg sm:text-2xl']"
              style="line-height: 1"
            ></i>
          </div>
        </div>

        <!-- Decorative Element -->
        <div
          class="absolute -right-10 -bottom-10 h-20 w-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 sm:-right-8 sm:-bottom-8 sm:h-32 sm:w-32"
        ></div>
      </div>
    </div>
  </div>
</template>
