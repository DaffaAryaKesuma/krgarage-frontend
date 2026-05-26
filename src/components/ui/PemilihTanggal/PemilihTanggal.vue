<script setup lang="ts">
import { toRef } from "vue";
import { usePemilihTanggal } from "./usePemilihTanggal";
import { getButtonClass, getIconButtonClass } from "@/utils/buttonVariants";
import { getToneTextClass } from "@/utils/badgeVariants";
import { FORM_LABEL_CLASS, getFormInputClass } from "@/utils/formVariants";

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

const {
  showPemilih,
  currentMonth,
  currentYear,
  MONTHS,
  DAYS,
  calendarDays,
  formatDateDisplay,
  selectDate,
  changeMonth,
  changeYear,
  isDateSelected,
  isToday,
  handleBlur,
  setToday,
} = usePemilihTanggal(toRef(props, "modelValue"), (value) => {
  emit("update:modelValue", value);
});
</script>

<template>
  <div class="w-full sm:w-auto relative">
    <label :class="[FORM_LABEL_CLASS, 'text-xs']">
      {{ label }}
    </label>
    <button
      @click="showPemilih = !showPemilih"
      @blur="handleBlur"
      :class="getFormInputClass(false, 'flex w-full items-center justify-between px-3 py-2 sm:w-36')"
    >
      <span>{{ formatDateDisplay(modelValue) }}</span>
      <i :class="['mdi mdi-calendar', getToneTextClass('primary')]"></i>
    </button>

    <div
      v-if="showPemilih"
      @mousedown.prevent
      :class="[
        'absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72',
        alignRight ? 'right-0 sm:right-auto sm:left-0' : '',
      ]"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex gap-1">
          <button
            @click="changeYear(-1)"
            :class="getIconButtonClass('neutral', 'sm')"
          >
            <i class="mdi mdi-chevron-double-left text-xl"></i>
          </button>
          <button
            @click="changeMonth(-1)"
            :class="getIconButtonClass('neutral', 'sm')"
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
            :class="getIconButtonClass('neutral', 'sm')"
          >
            <i class="mdi mdi-chevron-right text-xl"></i>
          </button>
          <button
            @click="changeYear(1)"
            :class="getIconButtonClass('neutral', 'sm')"
          >
            <i class="mdi mdi-chevron-double-right text-xl"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in DAYS"
          :key="day"
          class="text-center text-xs font-semibold text-gray-600 py-1"
        >
          {{ day }}
        </div>
      </div>

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

      <div class="flex gap-2 mt-3 pt-3 border-t">
        <button
          @click="setToday"
          :class="getButtonClass('secondary', 'xs', 'flex-1')"
        >
          Hari Ini
        </button>
        <button
          @click="showPemilih = false"
          :class="getButtonClass('ghost', 'xs')"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>
