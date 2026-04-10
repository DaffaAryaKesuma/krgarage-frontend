<script setup lang="ts">
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

interface BookingItem {
  id: number;
  suku_cadang: { nama_suku_cadang: string; kategori: string };
  jumlah: number;
  harga_saat_ini: number;
}

interface Booking {
  id: number;
  kode_pemesanan: string;
  pengguna: { nama: string; email: string };
  vespa: { model: string; tahun_produksi: number; plat_nomor: string };
  layanan?: { id: number; nama_layanan: string }[];
  tanggal_pemesanan: string;
  jam_pemesanan: string;
  status: string;
  catatan_pelanggan?: string;
  item_pemesanan?: BookingItem[];
}

interface Props {
  bookings: Booking[];
  loading: boolean;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

withDefaults(defineProps<Props>(), {
  emptyIcon: "mdi mdi-clipboard-list",
  emptyTitle: "Tidak ada pekerjaan",
  emptyMessage: "Tidak ada pekerjaan saat ini.",
  loadingMessage: "Memuat data...",
});

const emit = defineEmits<{
  updateStatus: [bookingId: number];
  addSparepart: [bookingId: number];
  deleteSparepart: [bookingId: number, itemId: number];
}>();

const getServiceName = (booking: Booking) =>
  booking.layanan?.map((s) => s.nama_layanan).join(", ") ||
  "Layanan tidak tersedia";

const canUpdateStatus = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  return (
    normalizedStatus === "pending" ||
    normalizedStatus === "confirmed" ||
    normalizedStatus === "in progress"
  );
};

const canAddSparepart = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "in progress";
};

const getActionButtonText = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "pending" || normalizedStatus === "confirmed") {
    return "Mulai Pekerjaan";
  } else if (normalizedStatus === "in progress") {
    return "Selesaikan Pekerjaan";
  }
  return "";
};

const getActionButtonClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "pending" || normalizedStatus === "confirmed") {
    return "bg-blue-600 hover:bg-blue-700";
  } else if (normalizedStatus === "in progress") {
    return "bg-green-600 hover:bg-green-700";
  }
  return "";
};
</script>

<template>
  <LoadingSpinner v-if="loading" :message="loadingMessage" />

  <EmptyState
    v-else-if="bookings.length === 0"
    :icon="emptyIcon"
    :title="emptyTitle"
    :message="emptyMessage"
  />

  <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
    <div
      v-for="booking in bookings"
      :key="booking.id"
      class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <!-- Header with Kode Booking & Status -->
      <div
        class="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 flex items-center justify-between"
      >
        <div>
          <p class="text-xs opacity-90">Kode Pemesanan</p>
          <p class="text-lg font-bold">{{ booking.kode_pemesanan }}</p>
        </div>
        <span :class="getStatusBadgeClass(booking.status)">
          {{ getStatusLabel(booking.status) }}
        </span>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-3">
        <!-- Customer Info -->
        <div>
          <p class="text-xs text-gray-500 mb-1">Pelanggan</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ booking.pengguna.nama }}
          </p>
        </div>

        <!-- Vespa Info -->
        <div>
          <p class="text-xs text-gray-500 mb-1">Vespa</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ booking.vespa.model }} - {{ booking.vespa.tahun_produksi }}
          </p>
        </div>

        <!-- Service Info -->
        <div>
          <p class="text-xs text-gray-500 mb-1">Layanan</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ getServiceName(booking) }}
          </p>
        </div>

        <!-- Date & Time -->
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <i class="mdi mdi-calendar text-gray-500"></i>
            <span>{{ formatDateShort(booking.tanggal_pemesanan) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <i class="mdi mdi-clock-outline text-gray-500"></i>
            <span>{{ booking.jam_pemesanan }}</span>
          </div>
        </div>

        <!-- Customer Notes -->
        <div
          v-if="booking.catatan_pelanggan"
          class="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5"
        >
          <p class="text-xs font-semibold text-gray-700 mb-0.5">
            Catatan Pelanggan:
          </p>
          <p class="text-xs text-gray-600">{{ booking.catatan_pelanggan }}</p>
        </div>

        <!-- Spareparts Used -->
        <div
          v-if="booking.item_pemesanan?.length"
          class="bg-blue-50 rounded-lg p-3"
        >
          <p class="text-xs font-semibold text-gray-700 mb-2">
            Suku Cadang Digunakan:
          </p>
          <div class="space-y-1.5">
            <div
              v-for="item in booking.item_pemesanan"
              :key="item.id"
              class="flex justify-between items-center text-xs bg-white p-2 rounded"
            >
              <span class="text-gray-700 font-medium">{{
                item.suku_cadang.nama_suku_cadang
              }}</span>
              <div class="flex items-center gap-2">
                <span class="text-gray-600">{{ item.jumlah }}x</span>
                <button
                  v-if="canAddSparepart(booking.status)"
                  @click="emit('deleteSparepart', booking.id, item.id)"
                  class="text-red-600 hover:text-red-700 ml-2"
                  title="Hapus sparepart"
                >
                  <i class="mdi mdi-delete"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-2">
          <!-- Complete/Start Button -->
          <button
            v-if="canUpdateStatus(booking.status)"
            @click="emit('updateStatus', booking.id)"
            :class="[
              'py-3 text-white font-semibold rounded-lg transition text-sm',
              getActionButtonClass(booking.status),
            ]"
          >
            {{ getActionButtonText(booking.status) }}
          </button>

          <!-- Add Sparepart Button -->
          <button
            v-if="canAddSparepart(booking.status)"
            @click="emit('addSparepart', booking.id)"
            class="py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition text-sm"
          >
            Tambah Suku Cadang
          </button>

          <!-- Completed Badge (full width) -->
          <div
            v-if="booking.status === 'Completed'"
            class="col-span-2 bg-green-50 border border-green-200 rounded-lg p-3 text-center"
          >
            <i class="mdi mdi-check-all text-green-600 text-xl"></i>
            <p class="text-xs text-green-800 font-semibold mt-1">
              Pekerjaan Selesai
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
