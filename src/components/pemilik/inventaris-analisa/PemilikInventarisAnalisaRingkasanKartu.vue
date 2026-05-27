<script setup lang="ts">
import { computed } from "vue";
import { getMonthOptions } from "@/utils/dateFilters";
import { getIconToneClass, type IconToneKey } from "@/utils/badgeVariants";

interface Ringkasan {
  totalLayanan: number;
  totalSukuCadang: number;
  lowStockCount: number;
}

interface Props {
  ringkasan: Ringkasan;
  selectedMonth: number;
  selectedYear: number;
}

const props = defineProps<Props>();

const MONTH_OPTIONS = getMonthOptions();

const RINGKASAN_KARTU = computed(() => [
  {
    title: "Total Layanan Terjual",
    key: "totalLayanan" as keyof Ringkasan,
    subtitle: `Periode ${MONTH_OPTIONS[props.selectedMonth - 1].label} ${props.selectedYear}`,
    tone: "info" as IconToneKey,
    icon: "mdi-wrench",
  },
  {
    title: "Total Suku Cadang Terjual",
    key: "totalSukuCadang" as keyof Ringkasan,
    subtitle: `Periode ${MONTH_OPTIONS[props.selectedMonth - 1].label} ${props.selectedYear}`,
    tone: "success" as IconToneKey,
    icon: "mdi-package-variant",
  },
  {
    title: "Stok Menipis",
    key: "lowStockCount" as keyof Ringkasan,
    subtitle: "Saat Ini",
    tone: "danger" as IconToneKey,
    icon: "mdi-alert",
  },
]);
</script>

<template>
  <div class="mb-5 space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-3">
    <div
      v-for="card in RINGKASAN_KARTU"
      :key="card.key"
      class="relative overflow-hidden rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-md transition-shadow hover:shadow-lg sm:p-6"
    >
      <div class="relative z-10 flex items-center justify-between gap-3 sm:items-start">
        <div class="flex min-w-0 items-center gap-3">
          <div
            :class="[
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
              getIconToneClass(card.tone),
            ]"
          >
            <i :class="['mdi', card.icon, 'text-2xl']"></i>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold leading-tight sm:text-base">
              {{ card.title }}
            </p>
            <p class="mt-1 text-xs text-gray-500">{{ card.subtitle }}</p>
          </div>
        </div>

        <div class="shrink-0 text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
          {{ ringkasan[card.key] }}
        </div>
      </div>

      <div
        class="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-gray-50 opacity-80"
      ></div>
    </div>
  </div>
</template>
