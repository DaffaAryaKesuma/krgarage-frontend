<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  startDate: string;
  endDate: string;
  loading: boolean;
}

interface Emits {
  (e: "update:startDate", value: string): void;
  (e: "update:endDate", value: string): void;
  (e: "apply"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const startMonth = ref(new Date(props.startDate || new Date()).getMonth());
const startYear = ref(new Date(props.startDate || new Date()).getFullYear());
const endMonth = ref(new Date(props.endDate || new Date()).getMonth());
const endYear = ref(new Date(props.endDate || new Date()).getFullYear());

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

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};

const startCalendarDays = computed(() =>
  getDaysInMonth(startMonth.value, startYear.value),
);
const endCalendarDays = computed(() =>
  getDaysInMonth(endMonth.value, endYear.value),
);

const selectStartDate = (day: number | null) => {
  if (!day) return;
  const date = new Date(startYear.value, startMonth.value, day);
  emit("update:startDate", date.toISOString().split("T")[0]);
  showStartDatePicker.value = false;
};

const selectEndDate = (day: number | null) => {
  if (!day) return;
  const date = new Date(endYear.value, endMonth.value, day);
  emit("update:endDate", date.toISOString().split("T")[0]);
  showEndDatePicker.value = false;
};

const changeStartMonth = (delta: number) => {
  startMonth.value += delta;
  if (startMonth.value > 11) {
    startMonth.value = 0;
    startYear.value++;
  } else if (startMonth.value < 0) {
    startMonth.value = 11;
    startYear.value--;
  }
};

const changeEndMonth = (delta: number) => {
  endMonth.value += delta;
  if (endMonth.value > 11) {
    endMonth.value = 0;
    endYear.value++;
  } else if (endMonth.value < 0) {
    endMonth.value = 11;
    endYear.value--;
  }
};

const isStartDateSelected = (day: number | null) => {
  if (!day || !props.startDate) return false;
  const date = new Date(startYear.value, startMonth.value, day);
  return date.toISOString().split("T")[0] === props.startDate;
};

const isEndDateSelected = (day: number | null) => {
  if (!day || !props.endDate) return false;
  const date = new Date(endYear.value, endMonth.value, day);
  return date.toISOString().split("T")[0] === props.endDate;
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

const handleStartBlur = () => {
  window.setTimeout(() => {
    showStartDatePicker.value = false;
  }, 200);
};

const handleEndBlur = () => {
  window.setTimeout(() => {
    showEndDatePicker.value = false;
  }, 200);
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2
          class="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2"
        >
          <i class="mdi mdi-calendar-range text-red-600"></i>
          Filter Rentang Waktu
        </h2>
        <p class="text-sm text-gray-600">
          Tampilkan laporan berdasarkan tanggal spesifik
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-end w-full md:w-auto">
        <!-- Start Date Picker -->
        <div class="w-full sm:w-auto relative">
          <label class="block text-xs font-semibold text-gray-500 mb-1"
            >Dari Tanggal</label
          >
          <button
            @click="showStartDatePicker = !showStartDatePicker"
            @blur="handleStartBlur"
            class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm text-gray-700 flex items-center justify-between bg-white"
          >
            <span>{{ formatDateDisplay(startDate) }}</span>
            <i class="mdi mdi-calendar text-red-600"></i>
          </button>

          <!-- Start Date Calendar Dropdown -->
          <div
            v-if="showStartDatePicker"
            class="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72"
          >
            <!-- Month/Year Navigation -->
            <div class="flex items-center justify-between mb-3">
              <button
                @click="changeStartMonth(-1)"
                class="p-1 hover:bg-gray-100 rounded transition"
              >
                <i class="mdi mdi-chevron-left text-xl"></i>
              </button>
              <span class="font-semibold text-gray-900">
                {{ MONTHS[startMonth] }} {{ startYear }}
              </span>
              <button
                @click="changeStartMonth(1)"
                class="p-1 hover:bg-gray-100 rounded transition"
              >
                <i class="mdi mdi-chevron-right text-xl"></i>
              </button>
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
                v-for="(day, index) in startCalendarDays"
                :key="index"
                @click="selectStartDate(day)"
                :disabled="!day"
                :class="[
                  'aspect-square text-sm rounded-lg transition-colors',
                  !day
                    ? 'invisible'
                    : isStartDateSelected(day)
                      ? 'bg-red-600 text-white font-bold'
                      : isToday(day, startMonth, startYear)
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
                @click="
                  emit(
                    'update:startDate',
                    new Date().toISOString().split('T')[0],
                  );
                  showStartDatePicker = false;
                "
                class="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
              >
                Hari Ini
              </button>
              <button
                @click="showStartDatePicker = false"
                class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        <!-- End Date Picker -->
        <div class="w-full sm:w-auto relative">
          <label class="block text-xs font-semibold text-gray-500 mb-1"
            >Sampai Tanggal</label
          >
          <button
            @click="showEndDatePicker = !showEndDatePicker"
            @blur="handleEndBlur"
            class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm text-gray-700 flex items-center justify-between bg-white"
          >
            <span>{{ formatDateDisplay(endDate) }}</span>
            <i class="mdi mdi-calendar text-red-600"></i>
          </button>

          <!-- End Date Calendar Dropdown -->
          <div
            v-if="showEndDatePicker"
            class="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72"
          >
            <!-- Month/Year Navigation -->
            <div class="flex items-center justify-between mb-3">
              <button
                @click="changeEndMonth(-1)"
                class="p-1 hover:bg-gray-100 rounded transition"
              >
                <i class="mdi mdi-chevron-left text-xl"></i>
              </button>
              <span class="font-semibold text-gray-900">
                {{ MONTHS[endMonth] }} {{ endYear }}
              </span>
              <button
                @click="changeEndMonth(1)"
                class="p-1 hover:bg-gray-100 rounded transition"
              >
                <i class="mdi mdi-chevron-right text-xl"></i>
              </button>
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
                v-for="(day, index) in endCalendarDays"
                :key="index"
                @click="selectEndDate(day)"
                :disabled="!day"
                :class="[
                  'aspect-square text-sm rounded-lg transition-colors',
                  !day
                    ? 'invisible'
                    : isEndDateSelected(day)
                      ? 'bg-red-600 text-white font-bold'
                      : isToday(day, endMonth, endYear)
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
                @click="
                  emit(
                    'update:endDate',
                    new Date().toISOString().split('T')[0],
                  );
                  showEndDatePicker = false;
                "
                class="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
              >
                Hari Ini
              </button>
              <button
                @click="showEndDatePicker = false"
                class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        <button
          @click="emit('apply')"
          :disabled="loading"
          class="w-full sm:w-auto px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          <i class="mdi mdi-filter-check" v-if="!loading"></i>
          <i class="mdi mdi-loading mdi-spin" v-else></i>
          {{ loading ? "Memuat..." : "Terapkan" }}
        </button>
      </div>
    </div>
  </div>
</template>
