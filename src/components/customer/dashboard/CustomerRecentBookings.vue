<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadgeClass, getStatusLabel } from "@/utils/statusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import type { CustomerBooking } from "@/types/booking";

interface Props {
  bookings: CustomerBooking[];
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
});
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
          <span :class="getStatusBadgeClass(b.status || 'Pending')">
            {{ getStatusLabel(b.status || "Pending") }}
          </span>
        </div>
        <div class="text-xs sm:text-sm text-gray-600 mb-2">
          <span class="font-medium">{{ b.vespa?.model }}</span> •
          {{ b.layanan.map((s) => s.nama_layanan).join(", ") }}
        </div>
        <p class="text-base sm:text-lg font-bold text-gray-900">
          {{
            toIDR(
              b.total_harga || b.layanan.reduce((sum, s) => sum + s.harga, 0),
            )
          }}
        </p>
      </div>
    </div>
  </section>
</template>
