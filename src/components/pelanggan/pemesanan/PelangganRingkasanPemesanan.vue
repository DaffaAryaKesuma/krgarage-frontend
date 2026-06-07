<script setup lang="ts">
// Helper format rupiah.
import { toIDR } from "@/utils/money";
// Helper format tanggal pendek.
import { formatDateShort } from "@/utils/date";
// Helper format plat nomor.
import { formatPlatNomor } from "@/utils/format";
// Helper class untuk alert, badge, ikon, dan panel.
import {
  getAlertBoxClass,
  getAlertIconClass,
  getChipBadgeClass,
  getIconToneClass,
  getTonePanelClass,
} from "@/utils/badgeVariants";
// Helper class tombol lebar penuh.
import { getFullWidthButtonClass } from "@/utils/buttonVariants";

// Tipe data layanan dan Vespa yang dipilih.
import type { LayananCatalogItem } from "@/types/layanan";
import type { VespaBasic } from "@/types/vespa";

// Props berisi hasil pilihan pelanggan sebelum dikonfirmasi.
interface Props {
  selectedLayanan: LayananCatalogItem[];
  totalPrice: number;
  selectedDate: string;
  selectedVespa?: VespaBasic;
  selectedTime: string;
  isSubmitting?: boolean;
}

// Default isSubmitting false supaya tombol normal saat belum submit.
withDefaults(defineProps<Props>(), {
  isSubmitting: false,
});
</script>

<template>
  <!-- Kartu ringkasan sebelum pemesanan dikirim ke API. -->
  <div
    class="relative bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden"
  >
    <div class="p-5 sm:p-7">
      <!-- Header ringkasan. -->
      <div class="text-center mb-6">
        <div
          :class="[
            getIconToneClass('primary'),
            'mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full border border-transparent',
          ]"
        >
          <i class="mdi mdi-receipt-text-outline text-3xl"></i>
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900">
          Ringkasan Pemesanan
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Periksa kembali detail pemesanan vespa Anda
        </p>
      </div>

      <!-- Garis putus-putus sebagai pemisah visual ala struk. -->
      <div class="relative flex items-center justify-center mb-6">
        <div
          class="absolute w-full border-t-2 border-dashed border-gray-200"
        ></div>
        <div class="absolute w-5 h-5 bg-gray-50 rounded-full -left-8"></div>
        <div class="absolute w-5 h-5 bg-gray-50 rounded-full -right-8"></div>
      </div>

      <!-- Detail pilihan yang akan dikirim sebagai pemesanan. -->
      <div class="space-y-4 mb-6 px-1">
        <!-- Daftar layanan yang dipilih. -->
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-2.5 text-gray-600 shrink-0">
            <i class="mdi mdi-wrench text-lg"></i>
            <span class="text-sm sm:text-base font-medium leading-relaxed"
              >Layanan Dipilih</span
            >
          </div>
          <div class="text-right ml-4">
            <div
              v-for="layanan in selectedLayanan"
              :key="layanan.id"
              class="text-sm sm:text-base font-bold text-gray-900 mb-0.5 leading-relaxed"
            >
              {{ layanan.nama_layanan }}
            </div>
          </div>
        </div>

        <!-- Vespa yang akan diservis. -->
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
              :class="[getChipBadgeClass('primary'), 'mt-0.5 inline-flex px-1.5 py-0.5 text-xs font-bold uppercase']"
            >
              {{ formatPlatNomor(selectedVespa.plat_nomor) }}
            </div>
          </div>
        </div>

        <!-- Jadwal tanggal dan jam servis. -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 text-gray-600">
            <i class="mdi mdi-calendar-clock text-lg"></i>
            <span class="text-sm sm:text-base font-medium">Jadwal Servis</span>
          </div>
          <div class="text-right">
            <div class="text-sm sm:text-base font-bold text-gray-900">
              {{ formatDateShort(selectedDate) }}
            </div>
            <div
              :class="[getChipBadgeClass('primary'), 'mt-0.5 inline-flex px-1.5 py-0.5 text-xs font-bold']"
            >
              {{ selectedTime }}
            </div>
          </div>
        </div>
      </div>

      <!-- Total estimasi biaya dari layanan yang dipilih. -->
      <div
        :class="[getTonePanelClass('primary'), 'mb-6 flex items-center justify-between px-5 py-4 shadow-inner']"
      >
        <span class="text-gray-700 font-bold text-sm sm:text-xl"
          >Total Estimasi</span
        >
        <span
          class="text-xl sm:text-xl font-bold text-gray-800 tracking-tight"
          >{{ toIDR(totalPrice) }}</span
        >
      </div>

      <!-- Catatan bahwa total masih estimasi sebelum mekanik mengecek kondisi Vespa. -->
      <div
        :class="[getAlertBoxClass('warning'), 'mb-6 flex items-start gap-3 p-3.5 shadow-none']"
      >
        <i
          :class="[getAlertIconClass('warning'), 'mdi mdi-alert-circle-outline mt-0.5 shrink-0 text-lg']"
        ></i>
        <p
          class="text-[11px] font-medium leading-relaxed sm:text-xs"
        >
          Harga di atas adalah estimasi awal. Harga akhir dapat berubah
          menyesuaikan kondisi aktual Vespa dan penambahan suku cadang saat
          perbaikan.
        </p>
      </div>

      <!-- Tombol submit final pemesanan. -->
      <button
        type="submit"
        :disabled="isSubmitting"
        :class="getFullWidthButtonClass('primary', 'lg', 'rounded-xl py-3.5 text-base font-bold shadow-lg active:scale-[0.98] sm:text-lg')"
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
