<script setup lang="ts">
// computed dipakai untuk menambahkan opsi "Semua".
import { computed } from "vue";
// Helper opsi bulan dan tahun.
import { getMonthOptions, getYearOptions } from "@/utils/dateFilters";
// Komponen filter bulan/tahun reusable.
import MonthYearFilter from "@/components/ui/MonthYearFilter.vue";

// Props filter riwayat mekanik.
interface Props {
  selectedMonth: number;
  selectedYear: number;
}

defineProps<Props>();

// Event update filter dan trigger perubahan filter.
const emit = defineEmits<{
  "update:selectedMonth": [value: number | string];
  "update:selectedYear": [value: number | string];
  filterChange: [];
}>();

// Opsi bulan ditambah "Semua Bulan" untuk melihat seluruh bulan.
const monthOptions = computed(() => [
  { value: 0, label: "Semua Bulan" },
  ...getMonthOptions(),
]);

// Opsi tahun ditambah "Semua Tahun".
const yearOptions = computed(() => [
  { value: 0, label: "Semua Tahun" },
  ...getYearOptions(),
]);
</script>

<template>
  <!-- Filter riwayat pekerjaan mekanik berdasarkan bulan dan tahun. -->
  <MonthYearFilter
    :selectedMonth="selectedMonth"
    :selectedYear="selectedYear"
    :monthOptions="monthOptions"
    :yearOptions="yearOptions"
    title="Filter Riwayat"
    wrapperClass="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6"
    @update:selectedMonth="emit('update:selectedMonth', $event)"
    @update:selectedYear="emit('update:selectedYear', $event)"
    @change="emit('filterChange')"
  />
</template>
