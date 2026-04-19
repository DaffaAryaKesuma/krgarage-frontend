<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import {
  getPaymentStatusBadgeClass,
  getPaymentStatusLabel,
} from "@/utils/paymentStatus";
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
    <div v-else class="space-y-4">
      <div
        v-for="b in bookings"
        :key="b.id"
        class="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md sm:p-5"
      >
        <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <i
              :class="[
                'text-3xl',
                b.status === 'Completed'
                  ? 'mdi mdi-check-circle text-green-600'
                  : 'mdi mdi-close-circle text-red-600',
              ]"
            ></i>
            <div>
              <p class="text-xs text-gray-500">Kode Pemesanan</p>
              <p class="text-base font-semibold text-gray-900 sm:text-lg">
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
        <div class="text-xs sm:text-sm text-gray-600 mb-2">
          <span class="font-medium">{{ b.vespa?.model }}</span> •
          {{ b.layanan.map((s) => s.nama_layanan).join(", ") }}
        </div>

        <div
          v-if="b.catatan_mekanik"
          class="mb-2 rounded-lg border border-green-200 bg-green-50 p-2"
        >
          <p class="mb-1 text-[11px] font-semibold text-green-800">
            Catatan Mekanik
          </p>
          <p class="text-xs text-gray-700">
            {{ getMekanikNotePreview(b.catatan_mekanik) }}
          </p>
        </div>

        <p class="text-base sm:text-lg font-bold text-gray-900">
          {{
            toIDR(
              b.total_harga || b.layanan.reduce((sum, s) => sum + s.harga, 0),
            )
          }}
        </p>

        <router-link
          :to="`/app/riwayat/${b.id}`"
          class="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:text-sm"
        >
          <i class="mdi mdi-text-box-search-outline"></i>
          <span>Lihat Detail</span>
        </router-link>
      </div>
    </div>
  </section>
</template>
