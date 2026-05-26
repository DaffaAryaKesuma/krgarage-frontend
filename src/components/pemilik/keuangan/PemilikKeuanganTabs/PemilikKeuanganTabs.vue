<script setup lang="ts">
import { getButtonClass } from "@/utils/buttonVariants";
import {
  PEMILIK_KEUANGAN_TABS,
  type PemilikKeuanganTabKey,
} from "./usePemilikKeuanganTabs";

interface Props {
  activeTab: PemilikKeuanganTabKey;
}

interface Emits {
  (e: "update:activeTab", value: PemilikKeuanganTabKey): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="rounded-xl bg-white p-1.5 shadow-lg sm:rounded-2xl sm:p-2">
    <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
      <button
        v-for="tab in PEMILIK_KEUANGAN_TABS"
        :key="tab.key"
        type="button"
        @click="emit('update:activeTab', tab.key)"
        :class="[
          getButtonClass(activeTab === tab.key ? 'primary' : 'ghost', 'sm'),
          'min-h-12 flex-col rounded-lg px-1.5 py-1.5 text-center text-[10px] leading-tight sm:min-h-0 sm:flex-row sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm',
          activeTab === tab.key ? 'shadow-sm' : 'text-gray-600 hover:text-red-600',
        ]"
      >
        <i :class="['mdi', tab.icon, 'text-sm sm:text-base']"></i>
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>
