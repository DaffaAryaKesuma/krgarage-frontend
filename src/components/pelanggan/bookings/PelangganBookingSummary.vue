<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";

import type { ServiceCatalogItem } from "@/types/service";
import type { VespaBasic } from "@/types/vespa";

interface Props {
  selectedServices: ServiceCatalogItem[];
  totalPrice: number;
  selectedDate: string;
  selectedVespa?: VespaBasic;
  selectedTime: string;
  isSubmitting?: boolean;
}

withDefaults(defineProps<Props>(), {
  isSubmitting: false,
});
</script>

<template>
  <div
    class="relative bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden"
  >
    <div class="p-5 sm:p-7">
      <!-- Header -->
      <div class="text-center mb-6">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-3 border border-red-100/50"
        >
          <i class="mdi mdi-receipt-text-outline text-3xl text-red-600"></i>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
          Ringkasan Pemesanan
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Periksa kembali detail pemesanan vespa Anda
        </p>
      </div>

      <!-- Receipt Dashed Divider -->
      <div class="relative flex items-center justify-center mb-6">
        <div
          class="absolute w-full border-t-2 border-dashed border-gray-200"
        ></div>
        <div class="absolute w-5 h-5 bg-gray-50 rounded-full -left-8"></div>
        <div class="absolute w-5 h-5 bg-gray-50 rounded-full -right-8"></div>
      </div>

      <!-- Detail Items -->
      <div class="space-y-4 mb-6 px-1">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-2.5 text-gray-600 shrink-0">
            <i class="mdi mdi-wrench-outline text-lg"></i>
            <span class="text-sm sm:text-base font-medium leading-relaxed"
              >Layanan Dipilih</span
            >
          </div>
          <div class="text-right ml-4">
            <template v-if="selectedServices.length > 0">
              <div
                v-for="service in selectedServices"
                :key="service.id"
                class="text-sm sm:text-base font-bold text-gray-900 mb-0.5 leading-relaxed"
              >
                {{ service.nama_layanan }}
              </div>
            </template>
            <span
              v-else
              class="text-sm sm:text-base font-medium text-gray-400 italic"
            >
              Belum ada
            </span>
          </div>
        </div>

        <div v-if="selectedVespa" class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 text-gray-600">
            <i class="mdi mdi-motorbike text-lg"></i>
            <span class="text-sm sm:text-base font-medium">Vespa</span>
          </div>
          <div class="text-right">
            <div class="text-sm sm:text-base font-bold text-gray-900">
              {{ selectedVespa.model }}
            </div>
            <div
              v-if="selectedVespa.plat_nomor"
              class="text-xs font-bold text-red-600 mt-0.5 inline-block px-1.5 py-0.5 rounded uppercase"
            >
              {{ selectedVespa.plat_nomor }}
            </div>
          </div>
        </div>

        <div v-if="selectedTime" class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 text-gray-600">
            <i class="mdi mdi-calendar-clock-outline text-lg"></i>
            <span class="text-sm sm:text-base font-medium">Jadwal Servis</span>
          </div>
          <div class="text-right">
            <div class="text-sm sm:text-base font-bold text-gray-900">
              {{ formatDateShort(selectedDate) }}
            </div>
            <div
              v-if="selectedTime"
              class="text-xs font-bold text-red-600 mt-0.5 inline-block px-1.5 py-0.5 rounded"
            >
              {{ selectedTime }}
            </div>
          </div>
        </div>
      </div>

      <!-- Total Price Banner -->
      <div
        v-if="selectedServices.length > 0"
        class="flex items-center justify-between py-4 px-5 bg-red-100 rounded-xl mb-6 shadow-inner"
      >
        <span class="text-gray-700 font-bold text-sm sm:text-xl"
          >Total Estimasi</span
        >
        <span
          class="text-xl sm:text-xl font-bold text-gray-800 tracking-tight"
          >{{ toIDR(totalPrice) }}</span
        >
      </div>

      <!-- Disclaimer Info Box -->
      <div
        v-if="selectedServices.length > 0 "
        class="flex items-start gap-3 p-3.5 bg-yellow-50/80 border border-yellow-100 rounded-xl mb-6"
      >
        <i
          class="mdi mdi-alert-circle-outline text-yellow-600 text-lg shrink-0 mt-0.5"
        ></i>
        <p
          class="text-[11px] sm:text-xs text-yellow-800/90 leading-relaxed font-medium"
        >
          Harga di atas adalah estimasi awal. Harga akhir dapat berubah
          menyesuaikan kondisi aktual Vespa dan penambahan suku cadang saat
          perbaikan.
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        :class="[
          'w-full py-3.5 px-4 text-white font-bold rounded-xl transition-all duration-200 flex justify-center items-center gap-2 text-base sm:text-lg',
          isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/30',
        ]"
      >
        <i
          :class="[
            isSubmitting
              ? 'mdi mdi-loading mdi-spin'
              : 'mdi mdi-check-circle-outline',
            'text-xl',
          ]"
        ></i>
        <span>{{ isSubmitting ? "Memproses..." : "Konfirmasi Pesanan" }}</span>
      </button>
    </div>
  </div>
</template>
