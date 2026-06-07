<script setup lang="ts">
// CustomSelect dipakai agar dropdown bulan/tahun konsisten dengan UI lain.
import CustomSelect from "@/components/ui/CustomSelect.vue";

// Bentuk option untuk dropdown.
type Option = { label: string; value: number | string };

// Props filter bulan dan tahun.
interface Props {
  selectedMonth: number | string;
  selectedYear: number | string;
  monthOptions: Option[];
  yearOptions: Option[];
  title?: string;
  wrapperClass?: string;
}

// Default wrapper card filter.
withDefaults(defineProps<Props>(), {
  wrapperClass: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",
});

// Event v-model untuk bulan/tahun dan event change untuk trigger fetch/filter ulang.
const emit = defineEmits<{
  "update:selectedMonth": [value: number | string];
  "update:selectedYear": [value: number | string];
  change: [];
}>();

// Saat bulan berubah, update parent lalu panggil change.
const handleMonthChange = (value: string | number | null) => {
  emit("update:selectedMonth", value ?? "");
  emit("change");
};

// Saat tahun berubah, update parent lalu panggil change.
const handleYearChange = (value: string | number | null) => {
  emit("update:selectedYear", value ?? "");
  emit("change");
};
</script>

<template>
  <!-- Wrapper filter bulan-tahun. -->
  <div :class="wrapperClass">
    <!-- Dua dropdown sejajar: bulan dan tahun. -->
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
