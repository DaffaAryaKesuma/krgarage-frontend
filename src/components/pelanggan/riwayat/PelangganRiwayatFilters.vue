<script setup lang="ts">
// Helper membuat opsi bulan dan tahun untuk filter.
import { getMonthOptions, getYearOptions } from "@/utils/dateFilters";
// Komponen filter bulan/tahun yang dipakai ulang di beberapa halaman.
import MonthYearFilter from "@/components/ui/MonthYearFilter.vue";

// Props menyimpan bulan dan tahun yang sedang dipilih.
interface Props {
  selectedMonth: number;
  selectedYear: number;
}

defineProps<Props>();

// Event update dikirim ke parent supaya nilai filter bisa berubah.
const emit = defineEmits<{
  "update:selectedMonth": [value: number | string];
  "update:selectedYear": [value: number | string];
  change: [];
}>();

// Opsi bulan dan tahun dihitung sekali untuk komponen filter.
const monthOptions = getMonthOptions();
const yearOptions = getYearOptions();
</script>

<template>
  <!-- Filter meneruskan event perubahan bulan/tahun ke halaman riwayat. -->
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
