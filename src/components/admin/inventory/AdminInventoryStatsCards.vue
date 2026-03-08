<script setup lang="ts">
interface Stats {
  total: number;
  lowStock: number;
  goodStock: number;
}

interface Props {
  stats: Stats;
}

defineProps<Props>();

const STAT_CARDS = [
  {
    key: "total" as keyof Stats,
    label: "Total Item",
    icon: "mdi-package-variant",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    borderColor: "border-red-600",
  },
  {
    key: "lowStock" as keyof Stats,
    label: "Peringatan Stok Rendah",
    icon: "mdi-alert-circle",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    borderColor: "border-yellow-600",
  },
  {
    key: "goodStock" as keyof Stats,
    label: "Stok Tersedia",
    icon: "mdi-check-circle",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    borderColor: "border-green-600",
  },
];
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div
      v-for="card in STAT_CARDS"
      :key="card.key"
      class="bg-white p-4 rounded-lg shadow hover:shadow-md transition border-l-4"
      :class="card.borderColor"
    >
      <div class="flex items-center">
        <div class="p-3 rounded-full flex-shrink-0" :class="card.bgColor">
          <i class="mdi text-2xl" :class="[card.icon, card.iconColor]"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm text-gray-600">{{ card.label }}</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats[card.key] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
