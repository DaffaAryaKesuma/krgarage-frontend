<script setup lang="ts">
import { computed } from "vue";
import { getYearOptions, getMonthOptionsWithAll } from "@/utils/dateFilters";
import MonthYearFilter from "@/components/ui/MonthYearFilter.vue";

interface Props {
  selectedYear: number;
  selectedMonth: number | string;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:selectedYear": [value: number | string];
  "update:selectedMonth": [value: number | string];
  change: [];
}>();

const yearOptions = computed(() => getYearOptions(4, true));
const monthOptions = computed(() => getMonthOptionsWithAll());
</script>

<template>
  <MonthYearFilter
    :selectedMonth="selectedMonth"
    :selectedYear="selectedYear"
    :monthOptions="monthOptions"
    :yearOptions="yearOptions"
    wrapperClass="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
    @update:selectedMonth="(v) => emit('update:selectedMonth', v)"
    @update:selectedYear="(v) => emit('update:selectedYear', v)"
    @change="emit('change')"
  />
</template>
