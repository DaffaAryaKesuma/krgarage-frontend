<script setup lang="ts">
import { toIDR } from "@/utils/money";
import { formatDateShort } from "@/utils/date";
import { getStatusBadge, getStatusLabel } from "@/utils/statusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

interface Booking {
  id: number;
  kode_pemesanan: string;
  tanggal_pemesanan: string;
  status: string;
  total_harga?: number;
  vespa: { model: string; plat_nomor: string };
  layanan: { nama_layanan: string; harga: number }[];
}

interface Props {
  bookings: Booking[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});
</script>

<template>
  <section class="bg-white p-6 rounded-xl shadow-md">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Riwayat Terakhir</h2>
      <router-link
        to="/app/history"
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
      action-link="/app/bookings"
    />
    <div v-else class="space-y-4">
      <div
        v-for="b in bookings"
        :key="b.id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
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
              <p class="font-semibold text-gray-900 text-lg">
                {{ b.kode_pemesanan }}
              </p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatDateShort(b.tanggal_pemesanan) }}
              </p>
            </div>
          </div>
          <span
            :class="[
              'px-3 py-1 text-xs font-semibold rounded-full',
              getStatusBadge(b.status || 'Pending'),
            ]"
          >
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
