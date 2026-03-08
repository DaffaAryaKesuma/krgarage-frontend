<script setup lang="ts">
import { computed } from "vue";
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
  filterChange: [];
}>();

const monthOptions = computed(() => [
  { value: 0, label: "Semua Bulan" },
  ...getMonthOptions(),
]);

const yearOptions = computed(() => [
  { value: 0, label: "Semua Tahun" },
  ...getYearOptions(),
]);
</script>

<template>
  <MonthYearFilter
    :selectedMonth="selectedMonth"
    :selectedYear="selectedYear"
    :monthOptions="monthOptions"
    :yearOptions="yearOptions"
    title="Filter Riwayat"
    wrapperClass="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6"
    @update:selectedMonth="(v) => emit('update:selectedMonth', v)"
    @update:selectedYear="(v) => emit('update:selectedYear', v)"
    @change="emit('filterChange')"
  />
</template>
