<script setup lang="ts">
import PemilihTanggal from "../../ui/PemilihTanggal.vue";

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
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-5">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <!-- Judul -->
      <div class="shrink-0">
        <h2 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-calendar-range text-red-600"></i>
          Filter Rentang Waktu
        </h2>
        <p class="text-sm text-gray-500">Tampilkan laporan berdasarkan tanggal spesifik</p>
      </div>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row sm:items-end gap-2">
        <!-- 2 kolom di mobile, sejajar di sm+ -->
        <div class="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <PemilihTanggal
            :model-value="startDate"
            @update:model-value="updateStartDate"
            label="Dari Tanggal"
          />
          <PemilihTanggal
            :model-value="endDate"
            @update:model-value="updateEndDate"
            label="Sampai Tanggal"
            :align-right="true"
          />
        </div>

        <button
          @click="emit('apply')"
          :disabled="loading"
          class="w-full sm:w-auto shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <i class="mdi mdi-filter-check" v-if="!loading"></i>
          <i class="mdi mdi-loading mdi-spin" v-else></i>
          {{ loading ? "Memuat..." : "Terapkan" }}
        </button>
      </div>
    </div>
  </div>
</template>
