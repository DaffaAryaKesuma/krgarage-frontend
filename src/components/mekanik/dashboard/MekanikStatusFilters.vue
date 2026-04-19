<script setup lang="ts">
import {
  MEKANIK_STATUS_FILTER_OPTIONS,
  type MekanikStatusFilter,
} from "@/utils/statusBadge";

interface Props {
  statusFilter: MekanikStatusFilter;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:statusFilter": [value: MekanikStatusFilter];
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
    <h2 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
      Filter Status
    </h2>
    <div class="flex flex-wrap gap-2 sm:gap-3">
      <button
        v-for="filter in MEKANIK_STATUS_FILTER_OPTIONS"
        :key="filter.value"
        @click="emit('update:statusFilter', filter.value)"
        :class="[
          'px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base',
          statusFilter === filter.value
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>
