<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from "@/utils/paymentStatus";
import { toMoneyNumber } from "@/utils/money";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import type { PelangganBooking } from "@/types/booking";

interface Props {
  bookings: PelangganBooking[];
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const getServiceTotal = (booking: PelangganBooking) =>
  booking.layanan.reduce(
    (sum, layanan) =>
      sum +
      toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0),
    0,
  );
</script>

<template>
  <section
    v-if="bookings.length > 0"
    class="rounded-xl bg-white p-4 shadow-md sm:p-6"
  >
    <div class="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
      <h2 class="text-xl font-bold text-gray-900 sm:text-2xl">
        Pemesanan Mendatang
      </h2>
      <router-link
        to="/app/riwayat"
        class="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
      >
        Lihat Semua
        <i class="mdi mdi-arrow-right text-lg"></i>
      </router-link>
    </div>
    <LoadingSpinner v-if="isLoading" message="Memuat pemesanan..." />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="b in bookings"
        :key="b.id"
        class="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-500/5 sm:p-5 flex flex-col h-full"
      >
        <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <i class="mdi mdi-calendar-month text-3xl text-red-600"></i>
            <div>
              <p class="text-xs text-gray-500 mb-1">Kode Pemesanan</p>
              <p class="text-base font-bold text-gray-900 sm:text-lg">
                {{ b.kode_pemesanan }}
              </p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatDateShort(b.tanggal_pemesanan) }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span :class="getStatusBadgeClass(b.status || 'Pending')">
              {{ getStatusLabel(b.status || "Pending") }}
            </span>
            <span :class="getPaymentStatusBadgeClass(b.status_pembayaran)">
              {{ getPaymentStatusLabel(b.status_pembayaran) }}
            </span>
          </div>
        </div>
        <div
          class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2"
        >
          <div class="flex items-start gap-2">
            <i class="mdi mdi-motorbike text-xl text-gray-600"></i>
            <div>
              <p class="text-xs text-gray-500">Vespa</p>
              <p class="font-semibold text-gray-900">
                {{ b.vespa?.model || "N/A" }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <i class="mdi mdi-wrench text-xl text-gray-600"></i>
            <div>
              <p class="text-xs text-gray-500">Layanan</p>
              <p class="font-semibold text-gray-900 text-sm">
                {{ b.layanan.map((s) => s.nama_layanan).join(", ") }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto"
        >
          <div>
            <p class="text-xs text-gray-500">Total Biaya</p>
            <p class="text-lg font-bold text-red-600 sm:text-xl">
              {{ toIDR(b.total_harga || getServiceTotal(b)) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
