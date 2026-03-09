<script setup lang="ts">
const INSIGHT_CARDS = [
  {
    title: "Status Operasional",
    value: "Bengkel Buka",
    subtitle: "Setiap Hari (Kecuali Jumat), 10:00 - 17:00",
    icon: "mdi-store-clock",
    gradient: "from-red-500 to-red-600",
  },
  {
    title: "Tim Aktif",
    value: "5 Mekanik",
    subtitle: "Siap melayani pelanggan",
    icon: "mdi-account-group",
    gradient: "from-blue-500 to-blue-600",
  },
];
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 sm:mt-8 mb-8">
    <div
      v-for="card in INSIGHT_CARDS"
      :key="card.title"
      :class="[
        'rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg',
        `${card.gradient}`,
      ]"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium opacity-90">{{ card.title }}</p>
          <h3 class="mt-2 text-2xl font-bold">{{ card.value }}</h3>
          <p class="mt-2 text-sm opacity-90">{{ card.subtitle }}</p>
        </div>
        <div
          class="rounded-full bg-white/20 flex items-center justify-center w-11 h-11"
        >
          <i :class="['mdi', card.icon, 'text-2xl']"></i>
        </div>
      </div>
    </div>
  </div>
</template>
