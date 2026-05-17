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
    <div class="grid grid-cols-2 gap-4">
      <div class="flex-1">
        <CustomSelect
          :model-value="selectedMonth"
          :options="monthOptions"
          @update:model-value="handleMonthChange"
        />
      </div>
      <div class="flex-1">
        <CustomSelect
          :model-value="selectedYear"
          :options="yearOptions"
          @update:model-value="handleYearChange"
        />
      </div>
    </div>
  </div>
</template>
