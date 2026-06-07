<script setup lang="ts">
// Komponen input tanggal reusable.
import PemilihTanggal from "@/components/ui/PemilihTanggal/PemilihTanggal.vue";
// Helper class tombol.
import { getButtonClass } from "@/utils/buttonVariants";

// Props berisi rentang tanggal dan status loading.
interface Props {
  startDate: string;
  endDate: string;
  loading: boolean;
}

// Event update tanggal dan apply filter ke parent.
interface Emits {
  (e: "update:startDate", value: string): void;
  (e: "update:endDate", value: string): void;
  (e: "apply"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

// Handler perubahan tanggal awal.
const updateStartDate = (val: string) => emit("update:startDate", val);
// Handler perubahan tanggal akhir.
const updateEndDate = (val: string) => emit("update:endDate", val);
</script>

<template>
  <!-- Filter rentang tanggal laporan keuangan pemilik. -->
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-5">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <!-- Judul filter. -->
      <div class="shrink-0">
        <h2 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-calendar-range text-red-600"></i>
          Filter Rentang Waktu
        </h2>
        <p class="text-sm text-gray-500">Tampilkan laporan berdasarkan tanggal spesifik</p>
      </div>

      <!-- Kontrol tanggal dan tombol terapkan. -->
      <div class="flex flex-col sm:flex-row sm:items-end gap-2">
        <!-- Dua input tanggal dibuat 2 kolom di mobile. -->
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

        <!-- Tombol apply memicu fetch ulang di parent. -->
        <button
          @click="emit('apply')"
          :disabled="loading"
          :class="getButtonClass('primary', 'md', 'w-full sm:w-auto shrink-0 disabled:opacity-70 disabled:cursor-not-allowed')"
        >
          <i class="mdi mdi-filter-check" v-if="!loading"></i>
          <i class="mdi mdi-loading mdi-spin" v-else></i>
          {{ loading ? "Memuat..." : "Terapkan" }}
        </button>
      </div>
    </div>
  </div>
</template>
