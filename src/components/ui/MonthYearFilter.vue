<script setup lang="ts">
import CustomSelect from "@/components/ui/CustomSelect.vue";

type Option = { label: string; value: number | string };

interface Props {
  selectedMonth: number | string;
  selectedYear: number | string;
  monthOptions: Option[];
  yearOptions: Option[];
  title?: string;
  wrapperClass?: string;
}

withDefaults(defineProps<Props>(), {
  wrapperClass: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",
});

const emit = defineEmits<{
  "update:selectedMonth": [value: number | string];
  "update:selectedYear": [value: number | string];
  change: [];
}>();

const handleMonthChange = (value: string | number | null) => {
  emit("update:selectedMonth", value ?? "");
  emit("change");
};

const handleYearChange = (value: string | number | null) => {
  emit("update:selectedYear", value ?? "");
  emit("change");
};
</script>

<template>
  <div :class="wrapperClass">
    <h2
      v-if="title"
      class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4"
    >
      {{ title }}
    </h2>
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Bulan
        </label>
        <CustomSelect
          :model-value="selectedMonth"
          :options="monthOptions"
          @update:model-value="handleMonthChange"
        />
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tahun
        </label>
        <CustomSelect
          :model-value="selectedYear"
          :options="yearOptions"
          @update:model-value="handleYearChange"
        />
      </div>
    </div>
  </div>
</template>
