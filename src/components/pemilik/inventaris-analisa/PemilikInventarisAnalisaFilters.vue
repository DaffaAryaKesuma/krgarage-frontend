<script setup lang="ts">
import { computed } from "vue";
import { getMonthOptions } from "@/utils/dateFilters";
import CustomSelect from "@/components/ui/CustomSelect.vue";

interface Props {
  selectedMonth: number;
  selectedYear: number;
  yearOptions: number[];
}

interface Emits {
  (e: "update:selectedMonth", value: number): void;
  (e: "update:selectedYear", value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const MONTH_OPTIONS = getMonthOptions().map(m => ({
  value: Number(m.value),
  label: m.label
}));

const formattedYearOptions = computed(() => 
  props.yearOptions.map(y => ({
    value: y,
    label: y.toString()
  }))
);

const updateMonth = (val: string | number | null) => {
  if (val !== null) emit("update:selectedMonth", Number(val));
};

const updateYear = (val: string | number | null) => {
  if (val !== null) emit("update:selectedYear", Number(val));
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-5 mb-5 border border-gray-100 overflow-visible">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <i class="mdi mdi-calendar-search text-2xl text-red-600"></i>
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900 leading-tight">
            Filter Periode Analisa
          </h2>
          <p class="text-xs text-gray-500">
            Pilih bulan dan tahun untuk melihat performa inventaris
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:flex sm:flex-row gap-3 items-end lg:w-auto w-full">
        <div class="min-w-0 sm:w-36">
          <CustomSelect
            :model-value="selectedMonth"
            :options="MONTH_OPTIONS"
            @update:model-value="updateMonth"
          />
        </div>
        
        <div class="min-w-0 sm:w-32">
          <CustomSelect
            :model-value="selectedYear"
            :options="formattedYearOptions"
            @update:model-value="updateYear"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure dropdowns can overflow the card */
.overflow-visible {
  overflow: visible !important;
}
</style>

