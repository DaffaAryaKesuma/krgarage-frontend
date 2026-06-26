<script setup lang="ts">
// computed dipakai untuk format opsi tahun.
import { computed } from "vue";
// Helper opsi bulan.
import { getMonthOptions } from "@/utils/dateFilters";
// Select custom reusable.
import CustomSelect from "@/components/ui/CustomSelect.vue";

// Props filter bulan dan tahun.
interface Props {
  selectedMonth: number;
  selectedYear: number;
  yearOptions: number[];
}

// Event update filter ke halaman induk.
interface Emits {
  (event: "update:selectedMonth", value: number): void;
  (event: "update:selectedYear", value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Opsi bulan dari helper diubah value-nya menjadi number.
const MONTH_OPTIONS = getMonthOptions().map(month => ({
  value: Number(month.value),
  label: month.label
}));

// Opsi tahun diformat agar sesuai struktur CustomSelect.
const formattedYearOptions = computed(() => 
  props.yearOptions.map(year => ({
    value: year,
    label: year.toString()
  }))
);

// Update bulan jika nilai select tidak null.
const updateMonth = (value: string | number | null) => {
  if (value !== null) emit("update:selectedMonth", Number(value));
};

// Update tahun jika nilai select tidak null.
const updateYear = (value: string | number | null) => {
  if (value !== null) emit("update:selectedYear", Number(value));
};
</script>

<template>
  <!-- Filter bulan dan tahun untuk analisis inventaris. -->
  <div class="bg-white rounded-2xl shadow-md p-5 mb-5 border border-gray-100 overflow-visible">
    <div class="grid grid-cols-2 gap-4 w-full">
      <!-- Select bulan. -->
      <div class="min-w-0">
        <CustomSelect
          :model-value="selectedMonth"
          :options="MONTH_OPTIONS"
          @update:model-value="updateMonth"
        />
      </div>
      
      <!-- Select tahun. -->
      <div class="min-w-0">
        <CustomSelect
          :model-value="selectedYear"
          :options="formattedYearOptions"
          @update:model-value="updateYear"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Dropdown select boleh keluar dari batas kartu agar tidak terpotong. */
.overflow-visible {
  overflow: visible !important;
}
</style>

