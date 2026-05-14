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
import EmptyState from "@/components/ui/EmptyState.vue";
import type { PelangganBooking } from "@/types/booking";

interface Props {
  bookings: PelangganBooking[];
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const getMekanikNotePreview = (note: string | undefined): string => {
  if (!note) {
    return "";
  }

  const cleaned = note.trim();
  if (cleaned.length <= 140) {
    return cleaned;
  }

  return `${cleaned.slice(0, 140)}...`;
};

const getServicePrice = (booking: PelangganBooking) =>
  booking.layanan.reduce(
    (sum, layanan) =>
      sum +
      toMoneyNumber(layanan.pivot?.harga_saat_pesan ?? layanan.harga ?? 0),
    0,
  );
</script>

<template>
  <section class="rounded-xl bg-white p-4 shadow-md sm:p-6">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
      <h2 class="text-xl font-bold text-gray-900 sm:text-2xl">
        Riwayat Terakhir
      </h2>
      <router-link
        to="/app/riwayat"
        class="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
      >
        Lihat Semua
        <i class="mdi mdi-arrow-right text-lg"></i>
      </router-link>
    </div>
    <LoadingSpinner v-if="isLoading" message="Memuat riwayat..." />
    <EmptyState
      v-else-if="bookings.length === 0"
      icon="mdi mdi-clipboard-outline"
      title="Belum ada riwayat pemesanan"
      message="Buat pemesanan pertama Anda untuk mulai menggunakan layanan kami"
      action-text="Buat Pemesanan Pertama →"
      action-link="/app/pemesanan"
    />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-500/5 sm:p-5 flex flex-col h-full"
      >
        <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <i
              :class="
                booking.status === 'Selesai'
                  ? 'mdi mdi-check-circle text-green-500 text-3xl'
                  : 'mdi mdi-close-circle text-red-500 text-3xl'
              "
            ></i>
            <div>
              <p class="text-xs text-gray-500 mb-1">Kode Pemesanan</p>
              <p class="text-base font-bold text-gray-900 sm:text-lg">
                {{ booking.kode_pemesanan }}
              </p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatDateShort(booking.tanggal_pemesanan) }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span :class="getStatusBadgeClass(booking.status || 'Menunggu')">
              {{ getStatusLabel(booking.status || "Menunggu") }}
            </span>
            <span
              :class="getPaymentStatusBadgeClass(booking.status_pembayaran)"
            >
              {{ getPaymentStatusLabel(booking.status_pembayaran) }}
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
                {{ booking.vespa?.model || "N/A" }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <i class="mdi mdi-wrench text-xl text-gray-600"></i>
            <div>
              <p class="text-xs text-gray-500">Layanan</p>
              <div class="space-y-0.5">
                <p
                  v-for="(layanan, i) in booking.layanan"
                  :key="i"
                  class="font-semibold text-gray-900 text-sm leading-snug"
                >
                  {{ layanan.nama_layanan }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="booking.catatan_mekanik"
          class="mb-4 rounded border border-green-100 bg-green-50 px-3 py-2 w-full"
        >
          <div class="flex items-center gap-1.5 mb-1">
            <i class="mdi mdi-message-text-outline text-xs text-green-700"></i>
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-green-800"
              >Catatan Mekanik</span
            >
          </div>
          <p class="text-xs text-gray-700 w-full whitespace-normal">
            {{ getMekanikNotePreview(booking.catatan_mekanik) }}
          </p>
        </div>
        <div
          class="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto"
        >
          <div>
            <p class="text-xs text-gray-500">Total Biaya</p>
            <p class="text-lg font-bold text-gray-900 sm:text-xl">
              {{ toIDR(booking.total_harga || getServicePrice(booking)) }}
            </p>
          </div>
          <router-link
            :to="`/app/riwayat/${booking.id}`"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <i class="mdi mdi-eye-outline text-sm"></i>
            <span>Detail</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
