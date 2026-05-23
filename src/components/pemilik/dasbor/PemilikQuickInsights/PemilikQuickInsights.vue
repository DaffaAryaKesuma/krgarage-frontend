<script setup lang="ts">
import { usePemilikQuickInsights } from "@/components/pemilik/dasbor/PemilikQuickInsights/usePemilikQuickInsights";

const props = defineProps<{ ringkasan: any; statistik: any }>();

const { INSIGHT_KARTU } = usePemilikQuickInsights(props);
</script>

<template>
  <div class="mb-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      <div
        v-for="card in INSIGHT_KARTU"
        :key="card.title"
        :class="[
          'rounded-2xl bg-gradient-to-br p-4 text-white shadow-md',
          card.gradient,
        ]"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="text-xs font-medium opacity-90 mb-1">{{ card.title }}</p>
            <h3 class="text-lg font-bold leading-tight break-words">
              {{ card.value }}
            </h3>
            <p class="mt-1 text-xs opacity-80 leading-snug">
              {{ card.subtitle }}
            </p>
          </div>
          <div
            class="rounded-full bg-white/20 flex items-center justify-center shrink-0 w-9 h-9"
          >
            <i :class="['mdi', card.icon, 'text-xl']"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
