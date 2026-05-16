<script setup lang="ts">
import { getMonthOptions, getYearOptions } from "@/utils/dateFilters";
import MonthYearFilter from "@/components/ui/MonthYearFilter.vue";

interface Props {
  selectedMonth: number;
  selectedYear: number;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:selectedMonth": [value: number | string];
  "update:selectedYear": [value: number | string];
  change: [];
}>();

const monthOptions = getMonthOptions();
const yearOptions = getYearOptions();
</script>

<template>
  <MonthYearFilter
    :selectedMonth="selectedMonth"
    :selectedYear="selectedYear"
    :monthOptions="monthOptions"
    :yearOptions="yearOptions"
    wrapperClass="mb-6 p-4 bg-white rounded-lg shadow-sm"
    @update:selectedMonth="emit('update:selectedMonth', $event)"
    @update:selectedYear="emit('update:selectedYear', $event)"
    @change="emit('change')"
  />
</template>
