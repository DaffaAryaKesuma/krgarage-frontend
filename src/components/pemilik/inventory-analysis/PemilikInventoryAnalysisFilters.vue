<script setup lang="ts">
import { ref } from "vue";
import { getMonthOptions } from "@/utils/dateFilters";

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

const MONTH_OPTIONS = getMonthOptions();
const showMonthDropdown = ref(false);
const showYearDropdown = ref(false);

const selectMonth = (month: number) => {
  emit("update:selectedMonth", month);
  showMonthDropdown.value = false;
};

const selectYear = (year: number) => {
  emit("update:selectedYear", year);
  showYearDropdown.value = false;
};

const getSelectedMonthLabel = () => {
  const month = MONTH_OPTIONS.find((m) => m.value === props.selectedMonth);
  return month?.label || "";
};

const handleMonthBlur = () => {
  window.setTimeout(() => {
    showMonthDropdown.value = false;
  }, 200);
};

const handleYearBlur = () => {
  window.setTimeout(() => {
    showYearDropdown.value = false;
  }, 200);
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-filter-variant text-red-600"></i>
          Filter Periode Analisa
        </h2>
        <p class="text-sm text-gray-500">
          Lihat barang terlaris berdasarkan bulan
        </p>
      </div>
      <div class="flex gap-3">
        <!-- Month Dropdown -->
        <div class="relative">
          <button
            @click="showMonthDropdown = !showMonthDropdown"
            @blur="handleMonthBlur"
            class="px-8 py-2 rounded-lg border border-gray-300 hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white text-sm font-medium text-gray-700 flex items-center gap-2 min-w-[140px] justify-between transition-colors"
          >
            <span>{{ getSelectedMonthLabel() }}</span>
            <i
              :class="[
                'mdi mdi-chevron-down transition-transform',
                showMonthDropdown ? 'rotate-180' : '',
              ]"
            ></i>
          </button>
          <div
            v-if="showMonthDropdown"
            class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            <button
              v-for="m in MONTH_OPTIONS"
              :key="m.value"
              @click="selectMonth(Number(m.value))"
              :class="[
                'w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors',
                selectedMonth === m.value
                  ? 'bg-red-100 text-red-700 font-semibold'
                  : 'text-gray-700',
              ]"
            >
              {{ m.label }}
            </button>
          </div>
        </div>

        <!-- Year Dropdown -->
        <div class="relative">
          <button
            @click="showYearDropdown = !showYearDropdown"
            @blur="handleYearBlur"
            class="px-4 py-2 rounded-lg border border-gray-300 hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white text-sm font-medium text-gray-700 flex items-center gap-2 min-w-[100px] justify-between transition-colors"
          >
            <span>{{ selectedYear }}</span>
            <i
              :class="[
                'mdi mdi-chevron-down transition-transform',
                showYearDropdown ? 'rotate-180' : '',
              ]"
            ></i>
          </button>
          <div
            v-if="showYearDropdown"
            class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            <button
              v-for="y in yearOptions"
              :key="y"
              @click="selectYear(y)"
              :class="[
                'w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors',
                selectedYear === y
                  ? 'bg-red-100 text-red-700 font-semibold'
                  : 'text-gray-700',
              ]"
            >
              {{ y }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
