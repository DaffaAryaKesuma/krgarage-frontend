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
  (event: "update:selectedMonth", value: number): void;
  (event: "update:selectedYear", value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const MONTH_OPTIONS = getMonthOptions().map(month => ({
  value: Number(month.value),
  label: month.label
}));

const formattedYearOptions = computed(() => 
  props.yearOptions.map(year => ({
    value: year,
    label: year.toString()
  }))
);

const updateMonth = (value: string | number | null) => {
  if (value !== null) emit("update:selectedMonth", Number(value));
};

const updateYear = (value: string | number | null) => {
  if (value !== null) emit("update:selectedYear", Number(value));
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md p-5 mb-5 border border-gray-100 overflow-visible">
    <div class="grid grid-cols-2 gap-4 w-full">
      <div class="min-w-0">
        <CustomSelect
          :model-value="selectedMonth"
          :options="MONTH_OPTIONS"
          @update:model-value="updateMonth"
        />
      </div>
      
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
/* Ensure dropdowns can overflow the card */
.overflow-visible {
  overflow: visible !important;
}
</style>

