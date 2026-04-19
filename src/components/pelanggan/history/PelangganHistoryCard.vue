<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import {
  canPelangganCancelBooking,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/utils/statusBadge";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from "@/utils/paymentStatus";
import type { PelangganBooking } from "@/types/booking";

interface Props {
  booking: PelangganBooking;
  isCancelling?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCancelling: false,
});

const emit = defineEmits<{
  cancel: [bookingId: number];
}>();

// Hitung total harga
const getTotalharga = (booking: PelangganBooking) =>
  booking.total_harga || booking.layanan.reduce((sum, s) => sum + s.harga, 0);

const handleCancel = () => {
  emit("cancel", props.booking.id);
};
</script>

<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
  >
    <!-- Header -->
    <div
      class="flex items-start justify-between mb-4 pb-4 border-b border-gray-100"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100"
        >
          <i class="mdi mdi-calendar text-2xl text-red-600"></i>
        </div>
        <div>
          <p class="text-xs text-gray-500">Kode Pemesanan</p>
          <p class="font-bold text-gray-900 text-lg">
            {{ booking.kode_pemesanan }}
          </p>
          <p class="text-xs text-gray-600 mt-1">
            {{ formatDateShort(booking.tanggal_pemesanan) }} -
            {{ booking.jam_pemesanan }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <span :class="getStatusBadgeClass(booking.status)">
          {{ getStatusLabel(booking.status || "Pending") }}
        </span>
        <span :class="getPaymentStatusBadgeClass(booking.status_pembayaran)">
          {{ getPaymentStatusLabel(booking.status_pembayaran) }}
        </span>
      </div>
    </div>

    <!-- Vespa Info -->
    <div class="mb-4 p-3 bg-red-50 rounded-lg flex items-start gap-3">
      <i class="mdi mdi-motorbike text-2xl text-red-600"></i>
      <div class="flex-1">
        <p class="text-xs text-gray-500 mb-1">Vespa</p>
        <p class="font-semibold text-gray-900">
          {{ booking.vespa?.model || "N/A" }}
        </p>
        <p class="text-xs text-gray-600">
          {{ booking.vespa?.plat_nomor || "N/A" }}
        </p>
      </div>
    </div>

    <!-- Services -->
    <div class="mb-4 p-3 bg-purple-50 rounded-lg flex items-start gap-3">
      <i class="mdi mdi-wrench text-2xl text-purple-600 flex-shrink-0"></i>
      <div class="flex-1">
        <p class="text-xs text-gray-500 mb-1">Layanan</p>
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900">
            {{ booking.layanan.map((s) => s.nama_layanan).join(", ") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="pt-4 border-t border-gray-200 space-y-3">
      <router-link
        :to="`/app/riwayat/${booking.id}`"
        class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
      >
        <i class="mdi mdi-text-box-search-outline"></i>
        <span>Lihat Detail Pemesanan</span>
      </router-link>

      <template v-if="canPelangganCancelBooking(booking.status)">
        <button
          @click="handleCancel"
          :disabled="isCancelling"
          class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <i v-if="isCancelling" class="mdi mdi-loading mdi-spin"></i>
          <i v-else class="mdi mdi-close-circle"></i>
          <span>{{
            isCancelling ? "Membatalkan..." : "Batalkan Pemesanan"
          }}</span>
        </button>
        <p class="text-xs text-gray-500 text-center">
          <i class="mdi mdi-information"></i>
          Pemesanan dapat dibatalkan selama statusnya masih "Menunggu" atau
          "Dikonfirmasi"
        </p>
      </template>
    </div>
  </div>
</template>
