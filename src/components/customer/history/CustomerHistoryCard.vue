<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";

interface Booking {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  total_harga: number | null;
  vespa: { model: string; plat_nomor: string };
  layanan: { nama_layanan: string; harga: number }[];
  item_pemesanan?: Array<{
    id: number;
    suku_cadang: { nama_suku_cadang: string; kategori: string };
    jumlah: number;
    harga_saat_ini: number;
  }>;
}

interface Props {
  booking: Booking;
  isCancelling?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCancelling: false,
});

const emit = defineEmits<{
  cancel: [bookingId: number];
}>();

// Hitung total harga
const getTotalharga = (booking: Booking) =>
  booking.total_harga || booking.layanan.reduce((sum, s) => sum + s.harga, 0);

// Check if booking can be cancelled
const canCancelBooking = (booking: Booking) => {
  const status = booking.status?.toLowerCase();
  return status === "pending" || status === "confirmed";
};

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
      <span :class="getStatusBadgeClass(booking.status)">
        {{ getStatusLabel(booking.status || "Pending") }}
      </span>
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
          <span class="font-medium text-gray-900">{{
            toIDR(booking.layanan.reduce((sum, s) => sum + s.harga, 0))
          }}</span>
        </div>
      </div>
    </div>

    <!-- Spareparts -->
    <div
      v-if="booking.item_pemesanan?.length"
      class="mb-4 p-3 bg-orange-50 rounded-lg"
    >
      <div class="flex items-start gap-3">
        <i class="mdi mdi-cog text-2xl text-orange-600 flex-shrink-0"></i>
        <div class="flex-1">
          <p class="text-xs text-gray-500 mb-2">Sparepart yang Digunakan</p>
          <div class="space-y-1">
            <div
              v-for="item in booking.item_pemesanan"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-700">
                {{ item.suku_cadang.nama_suku_cadang }}
                <span class="text-xs text-gray-500">(x{{ item.jumlah }})</span>
              </span>
              <span class="font-medium text-gray-900">{{
                toIDR(item.harga_saat_ini * item.jumlah)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Total harga -->
    <div class="mb-4 p-3 bg-green-50 rounded-lg">
      <div class="flex items-center justify-between">
        <p class="text-lg text-gray-900 font-medium">Total Biaya</p>
        <p class="text-lg font-bold text-green-600">
          {{ toIDR(getTotalharga(booking)) }}
        </p>
      </div>
    </div>

    <!-- Cancel Button (only if can cancel) -->
    <div v-if="canCancelBooking(booking)" class="pt-4 border-t border-gray-200">
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
      <p class="text-xs text-gray-500 mt-2 text-center">
        <i class="mdi mdi-information"></i>
        Pemesanan dapat dibatalkan selama statusnya masih "Menunggu" atau
        "Dikonfirmasi"
      </p>
    </div>
  </div>
</template>
