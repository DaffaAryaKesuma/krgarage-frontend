<script setup lang="ts">
import { computed } from "vue";
// Helper opsi tahun/bulan.
import { getYearOptions, getMonthOptionsWithAll } from "@/utils/dateFilters";
// Komponen reusable filter bulan-tahun.
import MonthYearFilter from "@/components/ui/MonthYearFilter.vue";

// Props filter laporan keuangan.
interface Props {
  selectedYear: number;
  selectedMonth: number | string;
}

defineProps<Props>();

// Event v-model dan change untuk trigger fetch laporan.
const emit = defineEmits<{
  "update:selectedYear": [value: number | string];
  "update:selectedMonth": [value: number | string];
  change: [];
}>();

// Tahun menampilkan 4 tahun terakhir + tahun depan.
const yearOptions = computed(() => getYearOptions(4, true));
// Bulan menampilkan opsi semua bulan.
const monthOptions = computed(() => getMonthOptionsWithAll());
</script>

<template>
  <!-- Filter bulan/tahun laporan keuangan. -->
  <MonthYearFilter
    :selectedMonth="selectedMonth"
    :selectedYear="selectedYear"
    :monthOptions="monthOptions"
    :yearOptions="yearOptions"
    wrapperClass="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
    @update:selectedMonth="emit('update:selectedMonth', $event)"
    @update:selectedYear="emit('update:selectedYear', $event)"
    @change="emit('change')"
  />
</template>
