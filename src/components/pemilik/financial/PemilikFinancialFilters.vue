<script setup lang="ts">
import BaseDatePicker from "../../ui/BaseDatePicker.vue";

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

defineProps<Props>();
const emit = defineEmits<Emits>();

const updateStartDate = (val: string) => emit("update:startDate", val);
const updateEndDate = (val: string) => emit("update:endDate", val);
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
        <BaseDatePicker
          :model-value="startDate"
          @update:model-value="updateStartDate"
          label="Dari Tanggal"
        />

        <!-- End Date Picker -->
        <BaseDatePicker
          :model-value="endDate"
          @update:model-value="updateEndDate"
          label="Sampai Tanggal"
          :align-right="true"
        />

        <button
          @click="emit(`apply`)"
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
