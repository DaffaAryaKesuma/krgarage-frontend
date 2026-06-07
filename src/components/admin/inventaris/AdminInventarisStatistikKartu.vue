<script setup lang="ts">
// Helper warna icon.
import { getIconToneClass } from "@/utils/badgeVariants";
import type { IconToneKey } from "@/utils/badgeVariants";

// Bentuk statistik inventaris dari halaman.
interface Statistik {
  total: number;
  lowStock: number;
  goodStock: number;
}

// Props statistik.
interface Props {
  statistik: Statistik;
}

defineProps<Props>();

// Konfigurasi tiga kartu statistik inventaris.
const STAT_KARTU = [
  {
    key: "total" as keyof Statistik,
    label: "Total",
    icon: "mdi-package-variant",
    tone: "info" as IconToneKey,
    borderColor: "border-blue-600",
  },
  {
    key: "lowStock" as keyof Statistik,
    label: "Stok Kritis/Habis",
    icon: "mdi-alert-circle",
    tone: "danger" as IconToneKey,
    borderColor: "border-red-600",
  },
  {
    key: "goodStock" as keyof Statistik,
    label: "Stok Tersedia",
    icon: "mdi-check-circle",
    tone: "success" as IconToneKey,
    borderColor: "border-green-600",
  },
];
</script>

<template>
  <!-- Grid kartu statistik inventaris. -->
  <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <!-- Satu kartu untuk total, stok kritis/habis, dan stok tersedia. -->
    <div
      v-for="card in STAT_KARTU"
      :key="card.key"
      class="bg-white p-4 rounded-lg shadow hover:shadow-md transition border-l-4"
      :class="card.borderColor"
    >
      <div class="flex items-center">
        <!-- Icon statistik. -->
        <div class="p-3 rounded-full flex-shrink-0" :class="getIconToneClass(card.tone)">
          <i class="mdi text-2xl" :class="card.icon"></i>
        </div>
        <!-- Label dan nilai statistik. -->
        <div class="ml-4">
          <p class="text-sm text-gray-600">{{ card.label }}</p>
          <p class="text-2xl font-bold text-gray-800">{{ statistik[card.key] }}</p>
          <p class="text-xs text-gray-600">Item Suku Cadang</p>
        </div>
      </div>
    </div>
  </div>
</template>
