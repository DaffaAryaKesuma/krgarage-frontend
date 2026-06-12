<script setup lang="ts">
import { computed } from "vue";
import {
  getAlertBoxClass,
  getAlertIconClass,
  getGradientToneClass,
  getToneTextClass,
} from "@/utils/badgeVariants";

interface Props {
  vespaCount: number;
  activePemesanan: number;
}

defineProps<Props>();

const TIPS = [
  "Servis rutin setiap 3 bulan untuk performa optimal",
  "Ganti oli mesin setiap 2000 km atau 6 bulan",
  "Periksa busi secara berkala untuk konsumsi BBM efisien",
  "Gunakan oli 2-tak berkualitas untuk mesin awet",
];

const currentTip = computed(
  () => TIPS[Math.floor(Math.random() * TIPS.length)],
);
</script>

<template>
  <section class="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-5">
    <!-- Vespa terdaftar. -->
    <div
      class="min-h-[68px] rounded-lg border-l-4 border-red-500 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:rounded-xl sm:p-4"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <h4
            class="mb-0.5 text-[10px] font-medium leading-tight text-gray-500 sm:mb-1 sm:text-sm"
          >
            Vespa Terdaftar
          </h4>
          <p class="text-xl font-bold text-gray-900 sm:text-2xl">
            {{ vespaCount }}
          </p>
        </div>
        <i
          :class="[
            getToneTextClass('primary'),
            'mdi mdi-motorbike hidden text-4xl opacity-20 min-[420px]:block',
          ]"
        ></i>
      </div>
    </div>

    <!-- Pemesanan aktif. -->
    <div
      class="min-h-[68px] rounded-lg border-l-4 border-purple-500 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:rounded-xl sm:p-4"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <h4
            class="mb-0.5 text-[10px] font-medium leading-tight text-gray-500 sm:mb-1 sm:text-sm"
          >
            Pemesanan Aktif
          </h4>
          <p class="text-xl font-bold text-gray-900 sm:text-2xl">
            {{ activePemesanan }}
          </p>
        </div>
        <i
          :class="[
            getToneTextClass('owner'),
            'mdi mdi-clock-outline hidden text-4xl opacity-20 min-[420px]:block',
          ]"
        ></i>
      </div>
    </div>

    <!-- Tips perawatan. -->
    <div
      :class="[
        getAlertBoxClass('neutral'),
        'relative order-5 col-span-2 min-h-[68px] overflow-hidden border-l-4 p-3 sm:p-4 xl:order-3 xl:col-span-1',
      ]"
    >
      <div class="relative z-10 h-full pr-10">
        <i
          :class="[
            getAlertIconClass('neutral'),
            'mdi mdi-lightbulb-on absolute right-0 top-0 text-4xl opacity-20',
          ]"
        ></i>
        <div class="min-w-0">
          <h3 class="text-base font-bold text-gray-900 xl:text-sm">
            Tips Perawatan
          </h3>
          <p class="mt-1 line-clamp-2 text-xs text-gray-700 sm:text-sm xl:text-xs">
            {{ currentTip }}
          </p>
        </div>
      </div>
    </div>

    <!-- Pemesanan baru. -->
    <router-link
      to="/app/pemesanan"
      :class="[
        'group relative order-3 min-h-[68px] overflow-hidden rounded-lg bg-gradient-to-br p-3 text-white shadow-sm transition-all hover:shadow-md sm:rounded-xl sm:p-4 xl:order-4',
        getGradientToneClass('primary'),
      ]"
    >
      <i
        class="mdi mdi-calendar-clock absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-white opacity-25"
      ></i>
      <div class="relative z-10 h-full">
        <div class="min-w-0 pr-10">
          <h3 class="text-sm font-bold leading-tight sm:text-base xl:text-sm">
            Pemesanan Baru
          </h3>
          <p class="mt-1 line-clamp-1 text-[10px] text-red-100 sm:text-xs">
            Buat servis
          </p>
        </div>
      </div>
      <i
        class="mdi mdi-arrow-right absolute bottom-1 right-2 text-base opacity-60 transition-opacity group-hover:opacity-100"
      ></i>
    </router-link>

    <!-- Kelola Vespa. -->
    <router-link
      to="/app/vespa-saya"
      :class="[
        'group relative order-4 min-h-[68px] overflow-hidden rounded-lg bg-gradient-to-br p-3 text-white shadow-sm transition-all hover:shadow-md sm:rounded-xl sm:p-4 xl:order-5',
        getGradientToneClass('neutral'),
      ]"
    >
      <i
        class="mdi mdi-motorbike absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-white opacity-25"
      ></i>
      <div class="relative z-10 h-full">
        <div class="min-w-0 pr-10">
          <h3 class="text-sm font-bold leading-tight sm:text-base xl:text-sm">
            Kelola Vespa
          </h3>
          <p class="mt-1 line-clamp-1 text-[10px] text-gray-200 sm:text-xs">
            Data Vespa
          </p>
        </div>
      </div>
      <i
        class="mdi mdi-arrow-right absolute bottom-1 right-2 text-base opacity-60 transition-opacity group-hover:opacity-100"
      ></i>
    </router-link>
  </section>
</template>
