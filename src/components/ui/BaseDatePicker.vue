<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  modelValue: string;
  label: string;
  alignRight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  alignRight: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const showPicker = ref(false);

// Initialize month and year based on modelValue or current date
const initDate = new Date(props.modelValue || new Date());
const currentMonth = ref(initDate.getMonth());
const currentYear = ref(initDate.getFullYear());

// Sync month and year when modelValue changes from outside
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      const d = new Date(newVal);
      currentMonth.value = d.getMonth();
      currentYear.value = d.getFullYear();
    }
  },
);

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return "Pilih tanggal";
  const date = new Date(dateStr);
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
};

const getDaysInMonth = (month: number, year: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};

const calendarDays = computed(() =>
  getDaysInMonth(currentMonth.value, currentYear.value),
);

const selectDate = (day: number | null) => {
  if (!day) return;
  const y = currentYear.value;
  const m = String(currentMonth.value + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  emit("update:modelValue", `${y}-${m}-${d}`);
  showPicker.value = false;
};

const changeMonth = (delta: number) => {
  currentMonth.value += delta;
  if (currentMonth.value > 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else if (currentMonth.value < 0) {
    currentMonth.value = 11;
    currentYear.value--;
  }
};

const changeYear = (delta: number) => {
  currentYear.value += delta;
};

const isDateSelected = (day: number | null) => {
  if (!day || !props.modelValue) return false;
  const y = currentYear.value;
  const m = String(currentMonth.value + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}` === props.modelValue;
};

const isToday = (day: number | null, month: number, year: number) => {
  if (!day) return false;
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
};

const handleBlur = () => {
  window.setTimeout(() => {
    showPicker.value = false;
  }, 200);
};

const setToday = () => {
  emit("update:modelValue", new Date().toISOString().split("T")[0]);
  showPicker.value = false;
};
</script>

<template>
  <div class="w-full sm:w-auto relative">
    <label class="block text-xs font-semibold text-gray-500 mb-1">
      {{ label }}
    </label>
    <button
      @click="showPicker = !showPicker"
      @blur="handleBlur"
      class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm text-gray-700 flex items-center justify-between bg-white"
    >
      <span>{{ formatDateDisplay(modelValue) }}</span>
      <i class="mdi mdi-calendar text-red-600"></i>
    </button>

    <!-- Calendar Dropdown -->
    <div
      v-if="showPicker"
      @mousedown.prevent
      :class="[
        'absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72',
        alignRight ? 'right-0 sm:right-auto sm:left-0' : '',
      ]"
    >
      <!-- Month/Year Navigation -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex gap-1">
          <button
            @click="changeYear(-1)"
            class="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded transition"
          >
            <i class="mdi mdi-chevron-double-left text-xl"></i>
          </button>
          <button
            @click="changeMonth(-1)"
            class="p-1 hover:bg-gray-100 rounded transition"
          >
            <i class="mdi mdi-chevron-left text-xl"></i>
          </button>
        </div>

        <span class="font-semibold text-gray-900">
          {{ MONTHS[currentMonth] }} {{ currentYear }}
        </span>

        <div class="flex gap-1">
          <button
            @click="changeMonth(1)"
            class="p-1 hover:bg-gray-100 rounded transition"
          >
            <i class="mdi mdi-chevron-right text-xl"></i>
          </button>
          <button
            @click="changeYear(1)"
            class="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded transition"
          >
            <i class="mdi mdi-chevron-double-right text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Days Header -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in DAYS"
          :key="day"
          class="text-center text-xs font-semibold text-gray-600 py-1"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :disabled="!day"
          :class="[
            'aspect-square text-sm rounded-lg transition-colors',
            !day
              ? 'invisible'
              : isDateSelected(day)
                ? 'bg-red-600 text-white font-bold'
                : isToday(day, currentMonth, currentYear)
                  ? 'bg-red-100 text-red-700 font-semibold'
                  : 'hover:bg-gray-100 text-gray-700',
          ]"
        >
          {{ day }}
        </button>
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-2 mt-3 pt-3 border-t">
        <button
          @click="setToday"
          class="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
        >
          Hari Ini
        </button>
        <button
          @click="showPicker = false"
          class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>
