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
        v-for="b in bookings"
        :key="b.id"
        class="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-500/5 sm:p-5 flex flex-col justify-between h-full gap-4"
      >
        <!-- Top Half: Info -->
        <div class="flex items-start gap-3 sm:gap-4 min-w-0">
          <i
            :class="[
              'text-3xl mt-0.5 shrink-0',
              b.status === 'Completed'
                ? 'mdi mdi-check-circle text-green-500'
                : 'mdi mdi-close-circle text-red-500',
            ]"
          ></i>
          <div class="min-w-0">
            <div class="flex flex-col gap-0.5 mb-2">
              <h3
                class="text-base sm:text-lg font-bold text-gray-900 leading-tight"
              >
                {{ b.kode_pemesanan }}
              </h3>
              <span class="text-xs text-gray-500 font-medium">
                {{ formatDateShort(b.tanggal_pemesanan) }}
              </span>
            </div>

            <p class="text-xs sm:text-sm text-gray-600 mb-3">
              <span class="font-bold text-gray-800">{{
                b.vespa?.model || "Vespa"
              }}</span>
              <span class="line-clamp-2 mt-0.5">{{
                b.layanan.map((s) => s.nama_layanan).join(", ")
              }}</span>
            </p>

            <div
              v-if="b.catatan_mekanik"
              class="rounded border border-green-100 bg-green-50 px-2.5 py-1.5 w-full"
            >
              <div class="flex items-center gap-1.5 mb-0.5">
                <i
                  class="mdi mdi-message-text-outline text-[11px] text-green-700"
                ></i>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider text-green-800"
                  >Catatan Mekanik</span
                >
              </div>
              <p class="text-xs text-gray-700 w-full whitespace-normal">
                {{ getMekanikNotePreview(b.catatan_mekanik) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bottom Half: Status, Price, Action -->
        <div
          class="flex flex-wrap items-end justify-between gap-3 shrink-0 border-t border-gray-100 pt-3 mt-auto"
        >
          <div class="flex flex-col gap-1.5 min-w-0">
            <span
              :class="[
                getStatusBadgeClass(b.status || 'Pending'),
                'text-[10px] sm:text-[11px] px-2 py-0.5 w-fit',
              ]"
            >
              {{ getStatusLabel(b.status || "Pending") }}
            </span>
            <span
              :class="[
                getPaymentStatusBadgeClass(b.status_pembayaran),
                'text-[10px] sm:text-[11px] px-2 py-0.5 w-fit',
              ]"
            >
              {{ getPaymentStatusLabel(b.status_pembayaran) }}
            </span>
          </div>

          <div class="flex flex-col items-end text-right shrink-0">
            <p class="text-sm sm:text-base font-bold text-gray-900 mb-2">
              {{ toIDR(b.total_harga || getServicePrice(b)) }}
            </p>
            <router-link
              :to="`/app/riwayat/${b.id}`"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 w-auto"
            >
              <i class="mdi mdi-eye-outline text-sm"></i>
              <span>Detail</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
