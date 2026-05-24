<script setup lang="ts">
import { usePemilikQuickInsights } from "@/components/pemilik/dasbor/PemilikQuickInsights/usePemilikQuickInsights";

const props = defineProps<{ ringkasan: any; statistik: any }>();

const { INSIGHT_KARTU } = usePemilikQuickInsights(props);
</script>

<template>
  <div class="mb-4 sm:mb-6">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 h-full">
      <div
        v-for="card in INSIGHT_KARTU"
        :key="card.title"
        :class="[
          'rounded-xl bg-gradient-to-br p-3 text-white shadow-md sm:rounded-2xl sm:p-4',
          card.gradient,
        ]"
      >
        <div class="flex min-h-20 items-start justify-between gap-2 sm:min-h-0">
          <div class="min-w-0">
            <p class="mb-1 text-[11px] font-medium leading-tight opacity-90 sm:text-xs">
              {{ card.title }}
            </p>
            <h3 class="text-sm font-bold leading-tight break-words sm:text-lg">
              {{ card.value }}
            </h3>
            <p class="mt-1 line-clamp-2 text-[10px] leading-snug opacity-80 sm:text-xs">
              {{ card.subtitle }}
            </p>
          </div>
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 sm:h-9 sm:w-9"
          >
            <i :class="['mdi', card.icon, 'text-lg sm:text-xl']"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
